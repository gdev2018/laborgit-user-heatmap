import { useCallback, useEffect, useState } from "react";
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
import StepsFilters, { Filters } from "./UserSteps/StepsFilters";
import { Nullable } from "../../types";

interface HeatmapValue {
  date?: string;
  [key: string]: any; // For other properties
}

const filtersInitial: Filters = {
  filterDates: null,
  filterTypeLife: null,
  filterTask: null,
  mainEventsOnly: false
};

// const dataMock = [
//   {
//     date: "2024-01-02",
//     details: [
//       {
//         date: "2024-01-02 07:29",
//         name: "Foundation",
//         value: 3694
//       },
//       {
//         date: "2024-01-02 08:52",
//         name: "Foundation",
//         value: 4142
//       },
//       {
//         date: "2024-01-02 11:27",
//         name: "Foundation",
//         value: 1929
//       },
//       {
//         date: "2024-01-02 12:52",
//         name: "Foundation",
//         value: 1827
//       },
//       {
//         date: "2024-01-02 13:23",
//         name: "Foundation",
//         value: 2873
//       },
//       {
//         date: "2024-01-02 18:00",
//         name: "Family",
//         value: 12253
//       }
//     ],
//     total: 26718
//   }
// ] as ICalendarDate[];

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

  const handleYearSelect = useCallback(
    (year: number) => {
      setSelectedYear(year);
      setSelectedDateStart(`${year}-01-01`);
      setSelectedDateEnd(`${Number(year) + 1}-01-01`);
      setFilters((prevState) => ({
        ...prevState,
        filterDates: null
      }));
    },
    [setSelectedYear, setSelectedDateStart, setSelectedDateEnd]
  );

  const handleOnDeleteDates = useCallback(() => {
    handleYearSelect(currentYear);
    setFilters((prevState) => ({
      ...prevState,
      filterDates: null
    }));
  }, [currentYear, handleYearSelect]);

  // todo set types vor value
  const handleOnClickHeatmap = useCallback(
    (value: HeatmapValue) => {
      console.log("value=", value);
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

  if (calendarIsLoading) {
    return <>Loading user data...</>;
  }

  if (calendarError) {
    return <>Error loading user data: {calendarError}</>;
  }

  if (!calendarData || calendarData?.length === 0) {
    return <>no user data</>;
  } else {
    return (
      <div className="flex-container">
        <div
          className="inner-flex-item"
          style={{
            flex: 1,
            overflow: "auto"
          }}
        >
          {stepsIsLoading || stepsError !== undefined ? (
            <Skeleton width={600} height={40} />
          ) : (
            <TotalHeader
              totalResults={
                // TODO totalResults not cleared on year change
                stepsIsLoading ? null : stepsData?.totalResults ?? null
              }
              year={selectedYear}
            />
          )}

          {/* todo add skeletons*/}
          <Heatmap data={calendarData} onClick={handleOnClickHeatmap} />

          <Box ml={4}>
            <StepsFilters
              typeLife={typeLifeData}
              filters={filters}
              onChangeTypeLifeSelect={handleOnClickTypeLife}
              onChangeMainEventsOnly={handleOnChangeMainEventsOnly}
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
        <div style={{ flex: 0, position: "sticky", top: 0 }}>
          {stepsIsLoading || stepsError !== undefined ? (
            <Skeleton width={600} height={40} />
          ) : (
            <YearsFilter years={yearsData} selectedYear={selectedYear} onClick={handleYearSelect} />
          )}
        </div>
      </div>
    );
  }
};

export default UserActivity;
