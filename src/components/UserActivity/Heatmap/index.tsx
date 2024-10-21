import React, { useEffect } from "react";
import calendarHeatmap from "./calendar-heatmap";
import "./calendar-heatmap.css";
import { HeatmapValue, ICalendarDate } from "../types";

interface HeatmapProps {
  data: ICalendarDate[] | undefined;
  overview: "year" | "month" | "day";
  onClick?: (value: HeatmapValue) => void;
}

const Heatmap = React.memo(({ data, overview, onClick }: HeatmapProps) => {
  console.log("Heatmap enter");

  const div_id = "calendar";

  // Set custom color for the calendar heatmap
  const color = "#044a8f";

  // Set overview types (choices are year, month and day)
  // const overview = "year";

  useEffect(() => {
    if (data) {
      calendarHeatmap.init(data, div_id, color, overview, onClick);
    }
  }, [data, overview, onClick]);

  return (
    <div
      style={{
        border: "1px solid #d0d7de",
        borderRadius: "6px",
        boxSizing: "border-box"
      }}
    >
      <div id={div_id} />
    </div>
  );
});

const HeatmapMemo = React.memo(Heatmap, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});
export default HeatmapMemo;
