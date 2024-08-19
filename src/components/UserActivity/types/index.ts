export interface IUserYearClick {
  user: number;
  year?: number;
  dateStart?: string;
  dateEnd?: string;
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

export interface IDictWithColor extends IDict {
  color: string;
}
