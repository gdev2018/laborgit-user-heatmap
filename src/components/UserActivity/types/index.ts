// todo rename into RequestFilters or RequestBody
import { hasProperty } from "../../../types";

export interface IUserYearClick {
  userId: number;
  year?: number;
  dateStart?: string;
  dateEnd?: string;
  typeLife?: number;
  taskId?: number;
  mainEventsOnly?: boolean;
  page?: number;
  itemsPerPage?: number;
  onClick?: (value: object) => void;
}

export interface IUserStep {
  typelifeid: number;
  typelife: string;
  taskid: number;
  task: string;
  step?: string; // Optional because some items might not have a step
  start: string;
  value?: string;
  mainevent?: boolean; // Assuming mainevent could be of any type or null
}

export interface ITotalResultsSteps {
  steps: string;
  secExpense: string;
  stepsPerDay: string;
  secPerStep: string;
}

export interface ITypeLife {
  id: number;
  typelife: string;
  colortext: number;
  colorbackground: number;
  priority: boolean;
  default: boolean;
  colortext_hex?: string;
  colorbackground_hex?: string;
}

export interface IUserYear {
  year: number;
}

export interface ICalendarDateDetails {
  date: string;
  name: string;
  value: number;
}

export interface ICalendarDate {
  date: string;
  details: ICalendarDateDetails[];
  total: number;
}

export type ICalendar = ICalendarDate[];

export interface IDict {
  id: number;
  name: string;
}

type HeatmapDate = {
  date: string;
  total: number;
  summary: HeatmapDateSummary[];
};

type HeatmapDateSummary = {
  name: string;
  value: number;
};

type HeatmapTransition = {
  in_transition: boolean;
  overview: string;
};

export type HeatmapValue = Date | HeatmapDate | HeatmapTransition;

export function isHeatmapDate(obj: any): obj is HeatmapDate {
  return hasProperty(obj, "date");
}

export function isHeatmapTransition(obj: any): obj is HeatmapTransition {
  return hasProperty(obj, "in_transition");
}
