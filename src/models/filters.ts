import { SelectSearchOption } from "react-select-search";

export type FilterFun = (
  options: SelectSearchOption[]
) => (query: string) => SelectSearchOption[];

export type SelectSearchItem = {
  name: string;
  value: string;
};
