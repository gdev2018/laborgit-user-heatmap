import { IDict, ITypeLife } from "../../types";
import TypeLifeSelect from "./TypeLifeSelect.tsx";
import SelectedChips from "./SelectedChips.tsx";
import { Nullable } from "../../../../types";
import React, { useState } from "react";
import { Box, FormControlLabel } from "@mui/material";
import Switch from "@mui/material/Switch";

export interface Filters {
  filterDates: Nullable<FilterDates>;
  filterTypeLife: Nullable<ITypeLife>;
  filterTask: Nullable<FilterBase>;
  mainEventsOnly: boolean;
}

export interface FilterBase extends IDict {
  onDelete: () => void;
}

export interface FilterDates {
  start: string;
  end: string;
  onDelete: () => void;
}

interface StepsFiltersProps {
  typeLife?: ITypeLife[];
  filters: Filters;
  onChangeTypeLifeSelect: (selectedItem: Nullable<ITypeLife>) => void;
  onChangeMainEventsOnly: (newValue: boolean) => void;
}

const StepsFilters = ({
  typeLife = [],
  filters,
  onChangeTypeLifeSelect,
  onChangeMainEventsOnly
}: StepsFiltersProps) => {
  console.log("StepsFilters enter");
  console.log("StepsFilters filters=", filters);

  const [mainEventsOnly, setMainEventsOnly] = useState(false);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMainEventsOnly(event.target.checked);
    onChangeMainEventsOnly(event.target.checked);
    console.log("MainEvents only:", event.target.checked);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row", my: 2 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <TypeLifeSelect
          typeLife={typeLife}
          initValue={String(filters.filterTypeLife?.id || "")}
          onChange={onChangeTypeLifeSelect}
        />
        <FormControlLabel
          control={
            <Switch checked={mainEventsOnly} onChange={handleSwitchChange} color="primary" />
          }
          label="MainEvents only"
          sx={{ ml: 1, color: mainEventsOnly ? "primary" : "gray" }}
        />
      </div>
      <SelectedChips filters={filters} />
    </Box>
  );
};

const StepsFiltersMemo = React.memo(StepsFilters);
export default StepsFiltersMemo;
