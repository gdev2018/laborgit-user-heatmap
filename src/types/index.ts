export type ServerSort = { key: string; direction: string };
export type OperatorType = "LIKE" | "EQUAL" | "IN";
export type FieldType = "LONG" | "STRING" | "BOOLEAN";

export type FilterRequest = {
  key: string;
  operatorType: OperatorType;
  fieldType: FieldType;
  value?: string | number;
  values?: string[] | number[];
};

export interface IServerResponse<T, TC> {
  request: {
    filters: FilterRequest[];
    globalFilter: { keys: unknown; value: string };
    sort: ServerSort;
  };
  pagination: { total: number; size: number; page: number };
  totalResults?: TC;
  content: T[];
}

type AnyType = Record<string, unknown>;

export function hasProperty<T extends AnyType>(obj: any, propertyName: keyof T): obj is T {
  return obj && typeof obj === "object" && propertyName in obj;
}

export type Nullable<T> = T | null;
