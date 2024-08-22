import { ITypeLife } from "../../types";
import React from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface TypeLifeSelectProps {
  typeLife?: ITypeLife[];
}

const TypeLifeSelect = ({ typeLife = [] }: TypeLifeSelectProps) => {
  console.log("TypeLifeSelect enter");
  const [value, setValue] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="select-label">TypeLife</InputLabel>
      <Select
        labelId="select-label"
        id="demo-select-small"
        value={value}
        label="TypeLife"
        onChange={handleChange}
      >
        {typeLife.map((item) => (
          <MenuItem value={item.id} key={item.id}>
            {item.typelife}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const TypeLifeSelectMemo = React.memo(TypeLifeSelect);
export default TypeLifeSelectMemo;
