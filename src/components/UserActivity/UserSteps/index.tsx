import { IServerResponse } from "../../../types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { Box, Divider, Skeleton, Typography } from "@mui/material";
import { IDict, ITotalResultsSteps, ITypeLife, IUserStep } from "../types";
import StepCard from "./StepCard";
import React from "react";

interface UserStepsProps {
  data: IServerResponse<IUserStep, ITotalResultsSteps> | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
  typeLife?: ITypeLife[];
  onClickTypeLife: (typeLife: ITypeLife) => void;
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
    groups[key].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  });
  return groups;
};

const getTypeLifeItems = (typeLife: ITypeLife[] | undefined): Record<number, ITypeLife> => {
  const typeLifeItems: Record<number, ITypeLife> = {};
  typeLife?.forEach((item) => {
    typeLifeItems[item.id] = item;
  });
  return typeLifeItems;
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
  // console.log("UserSteps data= ", data);
  if (isLoading || !data) {
    return <Skeleton height={0} />;
  }

  if (error) {
    return <div>Error:</div>;
  }

  if (!data?.content) {
    return;
    // return <div>No user steps</div>;
  }
  const groupedTasks = groupAndSortTasksByDate(data.content);
  const typeLifeItems = getTypeLifeItems(typeLife);

  return (
    <div>
      {Object.entries(groupedTasks).map(([date, steps], index) => (
        <Box key={"key" + index} sx={{ marginBottom: "20px", backgroundColor: "transparent" }}>
          <Divider textAlign="left" variant="middle">
            <Typography variant="h6">{date} </Typography>
          </Divider>

          {steps.map((step) => (
            <StepCard
              key={step.start}
              userStep={step}
              typeLife={typeLifeItems[step.typelifeid]}
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
