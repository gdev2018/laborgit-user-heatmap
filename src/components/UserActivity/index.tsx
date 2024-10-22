import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useGetCalendarMutation,
  useGetUserStepsMutation,
  useGetUserTypeLifeQuery,
  useGetUserYearsQuery
} from "../../redux";
import UserSteps from "./UserSteps";
import YearsFilter from "./YearsFilter";
import TotalHeader from "./TotalHeader";
import Heatmap from "./Heatmap";
import {
  HeatmapValue,
  IDict,
  isHeatmapDate,
  isHeatmapTransition,
  ITypeLife,
  IUserYearClick
} from "./types";
import { Box } from "@mui/material";
import StepsFilters, { Filters, filtersInitial } from "./UserSteps/StepsFilters";
import { Nullable } from "../../types";

const currentYear = new Date().getFullYear();

const UserActivity = ({ userId }: IUserYearClick) => {
  console.log("UserActivity enter");

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [filters, setFilters] = useState<Filters>(filtersInitial);

  const { data: typeLifeData } = useGetUserTypeLifeQuery({
    userId
  });

  const { data: yearsData } = useGetUserYearsQuery({
    userId
  });

  const [getCalendar, { data: calendarData, error: calendarError, isLoading: calendarIsLoading }] =
    useGetCalendarMutation();

  const [getUserSteps, { data: stepsData, error: stepsError, isLoading: stepsIsLoading }] =
    useGetUserStepsMutation();

  const memoizedFilters = useMemo(
    () => ({
      typeLife: filters.filterTypeLife?.id || 0,
      taskId: filters.filterTask?.id || 0,
      mainEventsOnly: filters.mainEventsOnly
    }),
    [filters.filterTypeLife, filters.filterTask, filters.mainEventsOnly]
  );

  const fetchCalendarData = useCallback(async () => {
    try {
      await getCalendar({
        userId,
        year: selectedYear,
        ...memoizedFilters
      }).unwrap();
    } catch (error) {
      console.error("Failed to fetch user calendar:", error);
    }
  }, [userId, selectedYear, getCalendar, memoizedFilters]);

  const fetchUserStepsData = useCallback(async () => {
    try {
      await getUserSteps({
        userId,
        dateStart: filters.filterDates?.start || `${selectedYear}-01-01`,
        dateEnd: filters.filterDates?.end || `${Number(selectedYear) + 1}-01-01`,
        ...memoizedFilters,
        page: 1,
        itemsPerPage: 10
      }).unwrap();
    } catch (error) {
      console.error("Failed to fetch user steps:", error);
    }
  }, [userId, selectedYear, filters.filterDates, getUserSteps, memoizedFilters]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  useEffect(() => {
    fetchUserStepsData();
  }, [fetchUserStepsData]);

  const handleResetFilters = () => {
    setSelectedYear(currentYear);
    setFilters(filtersInitial);
  };

  const handleYearSelect = useCallback((year: number) => {
    setSelectedYear(year);
    setFilters((prev) => ({ ...prev, filterDates: null }));
  }, []);

  const handleOnDeleteDates = useCallback(() => handleYearSelect(currentYear), [handleYearSelect]);

  const handleOnClickTypeLife = useCallback((typeLife: Nullable<ITypeLife>) => {
    setFilters((prevState) => ({
      ...prevState,
      filterTypeLife: typeLife
    }));
  }, []);

  const handleOnChangeMainEventsOnly = useCallback((value: boolean) => {
    setFilters((prevState) => ({
      ...prevState,
      mainEventsOnly: value
    }));
  }, []);

  const handleOnDeleteTask = useCallback(() => {
    setFilters((prevState) => ({
      ...prevState,
      filterTask: null
    }));
  }, []);

  const handleOnClickTask = useCallback(
    (task: IDict) => {
      setFilters((prevState) => ({
        ...prevState,
        filterTask: {
          id: task.id,
          name: task.name,
          onDelete: handleOnDeleteTask
        }
      }));
    },
    [handleOnDeleteTask]
  );

  const handleOnClickHeatmap = useCallback(
    (value: HeatmapValue) => {
      console.log("handleOnClickHeatmap value=", value);
      if (isHeatmapTransition(value)) {
        setFilters((prev) => ({ ...prev, filterDates: null }));
      } else if (isHeatmapDate(value)) {
        const startDate = new Date(value.date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        setFilters((prevState) => ({
          ...prevState,
          filterDates: {
            start: startDate.toISOString().split("T")[0], // Set the start date in YYYY-MM-DD format
            end: endDate.toISOString().split("T")[0], // Set the end date in YYYY-MM-DD format
            onDelete: handleOnDeleteDates
          }
        }));
      } else {
        console.error("The value object does not contain a valid date field.");
      }
    },
    [handleOnDeleteDates]
  );

  if (calendarError) {
    return <>Error loading user calendar data: {calendarError}</>;
  }

  if (stepsError) {
    return <>Error loading user steps data: {stepsError}</>;
  }

  // if (!calendarData || calendarData.length === 0) return <>No user data</>;

  return (
    <div className="flex-container">
      <div
        className="inner-flex-item"
        style={{
          flex: 1,
          overflow: "auto"
        }}
      >
        {calendarIsLoading || stepsIsLoading ? (
          <Box height={39}>Loading user data...</Box>
        ) : (
          <TotalHeader totalResults={stepsData?.totalResults ?? null} year={selectedYear} />
        )}

        <Heatmap data={calendarData} overview={"year"} onClick={handleOnClickHeatmap} />

        <Box ml={4}>
          <StepsFilters
            typeLife={typeLifeData}
            filters={filters}
            onChangeTypeLifeSelect={handleOnClickTypeLife}
            onChangeMainEventsOnly={handleOnChangeMainEventsOnly}
            onResetFilters={handleResetFilters}
          />
        </Box>

        <UserSteps
          data={stepsData}
          error={stepsError}
          isLoading={stepsIsLoading}
          typeLife={typeLifeData}
          onClickTypeLife={handleOnClickTypeLife}
          onClickTask={handleOnClickTask}
        />
      </div>
      <div style={{ flexShrink: "0", position: "sticky", top: "0" }}>
        <YearsFilter years={yearsData} selectedYear={selectedYear} onClick={handleYearSelect} />
      </div>
    </div>
  );
};

const UserActivityMemo = React.memo(UserActivity);
export default UserActivityMemo;
