import { IServerResponse } from "../../../types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { Box, Divider, Skeleton, Typography } from "@mui/material";
import {
  IDict,
  IDictWithColor,
  ITotalResultsSteps,
  ITypeLife,
  IUserStep
} from "../types";
import StepCard from "./StepCard";
import React from "react";

interface UserStepsProps {
  data: IServerResponse<IUserStep, ITotalResultsSteps> | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
  typeLife?: ITypeLife[];
  onClickTypeLife: (typeLife: IDictWithColor) => void;
  onClickTask: (task: IDict) => void;
}
const groupAndSortTasksByDate = (tasks: IUserStep[]) => {
  const groups = tasks.reduce(
    (acc, task) => {
      const date = new Date(task.start).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(task);
      return acc;
    },
    {} as Record<string, IUserStep[]>
  );
  Object.keys(groups).forEach((key) => {
    groups[key].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  });
  return groups;
};

const getTypeLifeColorsMapping = (
  typeLife: ITypeLife[] | undefined
): Record<string, string> => {
  const typeLifeColors: Record<number, string> = {};
  typeLife?.forEach((item) => {
    typeLifeColors[item.id] = item.colorbackground_hex || "";
  });
  return typeLifeColors;
};

const UserSteps = ({
  data,
  error,
  isLoading,
  typeLife,
  onClickTypeLife,
  onClickTask
}: UserStepsProps) => {
  console.log("UserSteps enter");
  if (isLoading || !data) {
    return <Skeleton height={200} />;
  }

  if (error) {
    return <div>Error:</div>;
  }

  if (!data?.content) {
    return <div>no data</div>;
  }
  const groupedTasks = groupAndSortTasksByDate(data.content);
  const typeLifeColors = getTypeLifeColorsMapping(typeLife);

  return (
    <div>
      {Object.entries(groupedTasks).map(([date, steps], index) => (
        <Box
          key={"key" + index}
          sx={{ marginBottom: "20px", backgroundColor: "transparent" }}
        >
          <Divider textAlign="left" variant="middle">
            <Typography variant="h6">{date} </Typography>
          </Divider>

          {steps.map((step) => (
            <StepCard
              key={step.start}
              userStep={step}
              typeLifeColor={typeLifeColors[step.typelifeid] || "primary"}
              onClickTypeLife={onClickTypeLife}
              onClickTask={onClickTask}
            />
          ))}
        </Box>
      ))}
    </div>
  );
};

const UserStepsMemo = React.memo(UserSteps, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});
export default UserStepsMemo;
