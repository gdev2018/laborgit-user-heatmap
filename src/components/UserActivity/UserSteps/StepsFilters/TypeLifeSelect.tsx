import { ITypeLife } from "../../types";
import React, { useEffect } from "react";
import { IconButton, InputAdornment, MenuItem, Select, SelectChangeEvent } from "@mui/material";
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
    <Select
      value={value}
      size="small"
      onChange={handleChange}
      displayEmpty // This prop allows the placeholder to be displayed when value is empty
      renderValue={(selected) => {
        if (!selected) {
          return <em>Choose TypeLife</em>; // Optionally render the placeholder text
        }
        const selectedItem = typeLife.find((item) => Number(item.id) === Number(selected));
        return selectedItem ? `TypeLife: ${selectedItem.typelife}` : "";
      }}
      sx={{
        borderRadius: "12px",
        mt: 1,
        minWidth: 200
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
      {typeLife.map(({ id, typelife }) => (
        <MenuItem value={id} key={id}>
          {typelife}
        </MenuItem>
      ))}
    </Select>
  );
};

const TypeLifeSelectMemo = React.memo(TypeLifeSelect);
export default TypeLifeSelectMemo;
