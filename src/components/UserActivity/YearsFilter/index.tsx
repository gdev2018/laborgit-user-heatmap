import { Button } from "@mui/material";
import React from "react";

export interface YearsFilterProps {
  years: number[] | undefined;
  selectedYear: number;
  onClick: (year: number) => void;
}

const YearsFilter = ({ years, selectedYear, onClick }: YearsFilterProps) => {
  if (years === undefined || years === null) {
    return <div>Error:</div>;
  }

  console.log("YearsFilter enter");
  console.log("YearsFilter years=", years);
  console.log("YearsFilter selectedYear=", selectedYear);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      {years.map((year) => (
        <div key={year} style={{ marginTop: "1rem" }}>
          <Button
            variant={year.toString() === selectedYear.toString() ? "contained" : "text"}
            onClick={() => onClick(year)}
            size={"medium"}
            sx={{ fontSize: "1rem" }}
          >
            {year}
          </Button>
        </div>
      ))}
    </div>
  );
};

const YearsFilterMemo = React.memo(YearsFilter);
export default YearsFilterMemo;
