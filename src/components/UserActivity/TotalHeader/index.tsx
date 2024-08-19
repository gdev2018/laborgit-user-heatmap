import { Nullable } from "../../../types";
import { Typography } from "@mui/material";
import { ITotalResultsSteps } from "../types";
import React from "react";

interface TotalHeaderProps {
  totalResults: Nullable<ITotalResultsSteps>;
  year: number;
}

const TotalHeader = ({ totalResults, year }: TotalHeaderProps) => {
  console.log("TotalHeader enter");
  // todo show add statistic: stepsPerDay, secPerStep
  return (
    <Typography variant="h6" gutterBottom>
      {totalResults?.steps || 0} steps in {year} year
    </Typography>
  );
};

const TotalHeaderMemo = React.memo(TotalHeader);
export default TotalHeaderMemo;
