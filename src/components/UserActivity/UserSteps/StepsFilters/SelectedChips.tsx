import { Box, Chip, Stack } from "@mui/material";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { Filters } from "./index.tsx";
import React from "react";

interface SelectedChipsProps {
  filters: Filters;
}

const SelectedChips = ({ filters }: SelectedChipsProps) => {
  console.log("SelectedChips enter");
  const labelDates = filters.filterDates?.start + " - " + filters.filterDates?.end;

  return (
    <Stack direction="row" spacing={1} my={2}>
      {filters.filterDates && (
        <Chip
          label={labelDates}
          sx={{
            backgroundColor: "#005bff",
            color: "white"
          }}
          deleteIcon={
            <Box
              sx={{
                borderRadius: "50%",
                backgroundColor: "white",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 18,
                height: 18
              }}
            >
              <HighlightOffRoundedIcon sx={{ fill: "#005bff" }} />
            </Box>
          }
          onDelete={filters.filterDates.onDelete}
        />
      )}
      {/*{filters.filterTypeLife && (*/}
      {/*  <Chip*/}
      {/*    label={filters.filterTypeLife.typelife}*/}
      {/*    sx={{*/}
      {/*      bgcolor: filters.filterTypeLife.colorbackground_hex,*/}
      {/*      color: "black",*/}
      {/*      "&:hover": {*/}
      {/*        backgroundColor: filters.filterTypeLife.colorbackground_hex // Prevent background color change*/}
      {/*      }*/}
      {/*    }}*/}
      {/*    deleteIcon={*/}
      {/*      <Box*/}
      {/*        sx={{*/}
      {/*          borderRadius: "50%",*/}
      {/*          backgroundColor: "white",*/}
      {/*          display: "inline-flex",*/}
      {/*          alignItems: "center",*/}
      {/*          justifyContent: "center",*/}
      {/*          width: 18,*/}
      {/*          height: 18*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        <HighlightOffRoundedIcon sx={{ fill: "#005bff" }} />*/}
      {/*      </Box>*/}
      {/*    }*/}
      {/*    onDelete={filters.filterTypeLife.onDelete}*/}
      {/*  />*/}
      {/*)}*/}
      {filters.filterTask && (
        <Chip
          label={filters.filterTask.name}
          color="primary"
          variant="outlined"
          deleteIcon={
            <Box
              sx={{
                borderRadius: "50%",
                backgroundColor: "white",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 18,
                height: 18
              }}
            >
              <HighlightOffRoundedIcon sx={{ fill: "#005bff" }} />
            </Box>
          }
          onDelete={filters.filterTask.onDelete}
        />
      )}
    </Stack>
  );
};

const SelectedChipsMemo = React.memo(SelectedChips);
export default SelectedChipsMemo;
