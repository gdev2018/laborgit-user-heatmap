import React, { useEffect } from "react";
import calendarHeatmap from "./calendar-heatmap";
import "./calendar-heatmap.css";
import { ICalendarDate } from "../types";

interface HeatmapProps {
  data: ICalendarDate[];
  onClick?: (value: object) => void;
}

const Heatmap = React.memo(({ data, onClick }: HeatmapProps) => {
  console.log("Heatmap enter");

  // Set the div target id
  const div_id = "calendar";

  // Set custom color for the calendar heatmap
  const color = "#044a8f";

  // Set overview types (choices are year, month and day)
  const overview = "year";

  useEffect(() => {
    calendarHeatmap.init(data, div_id, color, overview, onClick);
  }, [data, onClick]);

  return (
    <div
      style={{
        border: "1px solid #d0d7de",
        borderRadius: "6px",
        boxSizing: "border-box"
      }}
    >
      <div id="calendar" />
    </div>
  );
});

const HeatmapMemo = React.memo(Heatmap, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});
export default HeatmapMemo;
