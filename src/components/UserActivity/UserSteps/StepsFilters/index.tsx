import { IDict, ITypeLife } from "../../types";
import TypeLifeSelect from "./TypeLifeSelect.tsx";
import SelectedChips from "./SelectedChips.tsx";
import { Nullable } from "../../../../types";
import React from "react";

export interface Filters {
  filterDates: Nullable<FilterDates>;
  filterTypeLife: Nullable<ITypeLife>;
  filterTask: Nullable<FilterBase>;
}

export interface FilterBase extends IDict {
  onDelete: () => void;
}

export interface FilterDates {
  start: string;
  end: string;
  onDelete: () => void;
}
// export interface FilterTypeLife extends ITypeLife {
//   onDelete: () => void;
// }

interface StepsFiltersProps {
  typeLife?: ITypeLife[];
  filters: Filters;
  onChangeTypeLifeSelect: (selectedItem: Nullable<ITypeLife>) => void;
}

const StepsFilters = ({ typeLife = [], filters, onChangeTypeLifeSelect }: StepsFiltersProps) => {
  console.log("StepsFilters enter");
  console.log("StepsFilters filters=", filters);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {/*<>*/}
      <TypeLifeSelect
        typeLife={typeLife}
        initValue={String(filters.filterTypeLife?.id || "")}
        onChange={onChangeTypeLifeSelect}
      />
      <SelectedChips filters={filters} />
      {/*</>*/}
    </div>
  );
};

const StepsFiltersMemo = React.memo(StepsFilters);
export default StepsFiltersMemo;
