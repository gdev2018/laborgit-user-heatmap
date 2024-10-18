import React, { useCallback, useEffect, useState } from "react";
import {
  useGetCalendarQuery,
  useGetUserStepsMutation,
  useGetUserTypeLifeQuery,
  useGetUserYearsQuery
} from "../../redux";
import UserSteps from "./UserSteps";
import YearsFilter from "./YearsFilter";
import TotalHeader from "./TotalHeader";
import Heatmap from "./Heatmap";
import { IDict, ITypeLife, IUserYearClick } from "./types";
import { Box, Skeleton } from "@mui/material";
import StepsFilters, { Filters, filtersInitial } from "./UserSteps/StepsFilters";
import { Nullable } from "../../types";

type HeatmapDate = {
  date: string;
  total: number;
  summary: HeatmapDateSummary[];
};

type HeatmapDateSummary = {
  name: string;
  value: number;
};

type HeatmapTransition = {
  in_transition: boolean;
  overview: string;
};

type HeatmapValue = Date | HeatmapDate | HeatmapTransition;

const UserActivity = ({ userId }: IUserYearClick) => {
  console.log("UserActivity enter");
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedDateStart, setSelectedDateStart] = useState<string>(`${currentYear}-01-01`);
  const [selectedDateEnd, setSelectedDateEnd] = useState<string>(`${currentYear + 1}-01-01`);

  const [filters, setFilters] = useState<Filters>(filtersInitial);

  const { data: typeLifeData } = useGetUserTypeLifeQuery({
    userId
  });

  const { data: yearsData } = useGetUserYearsQuery({
    userId
  });

  // todo set skeleton if isLoading
  const {
    data: calendarData,
    error: calendarError,
    isLoading: calendarIsLoading
  } = useGetCalendarQuery({
    userId,
    year: selectedYear,
    typeLife: filters.filterTypeLife?.id || 0,
    taskId: filters.filterTask?.id || 0,
    mainEventsOnly: filters.mainEventsOnly
  });

  const [getUserSteps, { data: stepsData, error: stepsError, isLoading: stepsIsLoading }] =
    useGetUserStepsMutation();

  useEffect(() => {
    const fetchUserSteps = async () => {
      try {
        await getUserSteps({
          userId,
          dateStart: selectedDateStart,
          dateEnd: selectedDateEnd,
          typeLife: filters.filterTypeLife?.id || 0,
          taskId: filters.filterTask?.id || 0,
          mainEventsOnly: filters.mainEventsOnly,
          page: 1,
          itemsPerPage: 10
        }).unwrap();
      } catch (error) {
        console.error("Failed to fetch user steps:", error);
      }
    };

    fetchUserSteps();
  }, [userId, selectedDateStart, selectedDateEnd, filters]);

  const handleResetFilters = () => {
    setSelectedYear(currentYear);
    setSelectedDateStart(`${currentYear}-01-01`);
    setSelectedDateEnd(`${currentYear + 1}-01-01`);
    setFilters(filtersInitial);
  };

  const handleYearSelect = useCallback((year: number) => {
    setSelectedYear(year);
    setSelectedDateStart(`${year}-01-01`);
    setSelectedDateEnd(`${Number(year) + 1}-01-01`);
    setFilters((prev) => ({ ...prev, filterDates: null }));
  }, []);

  const handleOnDeleteDates = useCallback(() => {
    handleYearSelect(currentYear);
  }, [currentYear, handleYearSelect]);

  const handleOnClickTypeLife = (typeLife: Nullable<ITypeLife>) => {
    console.log("typeLife=", typeLife);
    setFilters((prevState) => ({
      ...prevState,
      filterTypeLife: typeLife
    }));
  };

  const handleOnChangeMainEventsOnly = (value: boolean) => {
    setFilters((prevState) => ({
      ...prevState,
      mainEventsOnly: value
    }));
  };

  const handleOnClickTask = (task: IDict) => {
    setFilters((prevState) => ({
      ...prevState,
      filterTask: {
        id: task.id,
        name: task.name,
        onDelete: handleOnDeleteTask
      }
    }));
  };

  const handleOnDeleteTask = function () {
    setFilters((prevState) => ({
      ...prevState,
      filterTask: null
    }));
  };

  // todo set types vor value
  const handleOnClickHeatmap = useCallback(
    (value: HeatmapValue) => {
      console.log("handleOnClickHeatmap value=", value);
      if (typeof value === HeatmapTransition) {
        console.error("Нужно сбросить фильтр дат");
        return; // Exit early if value is a Date
      }

      if (typeof value.date === "string") {
        const startDate = new Date(value.date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        const startDateString = startDate.toISOString().split("T")[0]; // Set the start date in YYYY-MM-DD format
        const endDateString = endDate.toISOString().split("T")[0]; // Set the end date in YYYY-MM-DD format
        setSelectedDateStart(startDateString); // todo next - why this row fires calendarHeatmap.init twice?
        // т.к. меняется state компонента, то он перерисовывается и все его дочерние
        // чтоб дочерние не менялись, если не менялись его props надо React.memo()
        // но, видимо, не может правильно сравнить calendarData из-за неглубокого сравнения (shallow compare)
        // надо вторым параметром задать кастомное сравнение в React.memo(Component, ... )
        // и обязательно определить конкретный тип для возвращаемого значения calendarData
        // const MyComponent = React.memo((props) => {
        //   /* render using props */
        // }, (prevProps, nextProps) => {
        //   // Ваше собственное сравнение
        //   return prevProps.user.name === nextProps.user.name; // Пример глубокого сравнения
        // });
        setSelectedDateEnd(endDateString);

        setFilters((prevState) => ({
          ...prevState,
          filterDates: {
            start: startDateString,
            end: endDateString,
            onDelete: handleOnDeleteDates
          }
        }));
      } else {
        console.error("The value object does not contain a valid date field.");
      }
    },
    [handleOnDeleteDates]
  );

  if (calendarIsLoading) {
    return <>Loading user data...</>;
  }

  if (calendarError) {
    return <>Error loading user data: {calendarError}</>;
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
        {stepsIsLoading || stepsError ? (
          <Skeleton width={0} height={39} />
        ) : (
          <TotalHeader
            totalResults={
              // TODO totalResults not cleared on year change
              // stepsIsLoading ? null : stepsData?.totalResults ?? null
              stepsData?.totalResults ?? null
            }
            year={selectedYear}
          />
        )}

        {calendarIsLoading || calendarError ? (
          <Skeleton width={1000} height={200} />
        ) : (
          <Heatmap data={calendarData} overview={"year"} onClick={handleOnClickHeatmap} />
        )}

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
