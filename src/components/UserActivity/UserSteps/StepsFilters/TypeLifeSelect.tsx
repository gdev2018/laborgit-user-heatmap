import { ITypeLife } from "../../types";
import React, { useEffect } from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Nullable } from "../../../../types";

interface TypeLifeSelectProps {
  initValue: Nullable<string>;
  typeLife: ITypeLife[];
  onChange: (selectedItem: Nullable<ITypeLife>) => void;
}

const TypeLifeSelect = ({ initValue, typeLife = [], onChange }: TypeLifeSelectProps) => {
  console.log("TypeLifeSelect enter");
  console.log("TypeLifeSelect initValue=", initValue);
  const [value, setValue] = React.useState<string>(initValue || "");

  useEffect(() => {
    setValue(initValue || "");
  }, [initValue]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    const selectedItem = typeLife.find((item) => Number(item.id) === Number(selectedValue)) || null;
    setValue(selectedValue);
    onChange(selectedItem);
  };

  const handleClear = () => {
    setValue("");
    onChange(null);
  };

  return (
    <FormControl sx={{ mt: 1, minWidth: 200 }} size="small">
      <InputLabel id="select-label">Choose TypeLife</InputLabel>
      <Select
        labelId="typelife-select-label"
        id="typelife-select"
        value={value}
        label="Choose TypeLife"
        onChange={handleChange}
        // displayEmpty
        sx={{
          borderRadius: "12px"
          // "& .MuiSelect-select": {
          //   borderRadius: "12px"
          // }
        }}
        endAdornment={
          value && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} size="small" sx={{ mr: 1 }}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }
      >
        <MenuItem value="" disabled>
          Choose TypeLife
        </MenuItem>
        {typeLife.map(({ id, typelife }) => (
          <MenuItem value={id} key={id}>
            {typelife}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const TypeLifeSelectMemo = React.memo(TypeLifeSelect);
export default TypeLifeSelectMemo;
