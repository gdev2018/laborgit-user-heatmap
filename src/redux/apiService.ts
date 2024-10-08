import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IServerResponse } from "../types";
import {
  ICalendarDate,
  ITotalResultsSteps,
  ITypeLife,
  IUserStep,
  IUserYear,
  IUserYearClick
} from "../components/UserActivity/types";

export function powerBuilderColorToHex(pbColor: number): string {
  const r: number = pbColor & 0xff; // Красный компонент находится в младшем байте
  const g: number = (pbColor >> 8) & 0xff; // Зеленый компонент смещается на 8 бит вправо
  const b: number = (pbColor >> 16) & 0xff; // Синий компонент смещается на 16 бит вправо

  const rHex: string = r.toString(16).padStart(2, "0");
  const gHex: string = g.toString(16).padStart(2, "0");
  const bHex: string = b.toString(16).padStart(2, "0");

  return "#" + rHex + gHex + bHex;
}

const currentDomain = window.location.hostname;
const baseUrl = currentDomain === "localhost" ? "https://drupal9" : `https://${currentDomain}`;
console.log("baseUrl=", baseUrl);

export const apiService = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl
    // baseUrl: `${import.meta.env.VITE_API_BASE_URL}`
    // baseUrl: `${process.env.VITE_API_BASE_URL}`
    // baseUrl: BASE_URL
  }),
  endpoints: (builder) => ({
    // TODO change string to another type
    getCalendar: builder.query<ICalendarDate[], IUserYearClick>({
      query: (args) => `/api/user/${args.user}/calendar/${args.year}/`,
      keepUnusedDataFor: 0 // disable cache
    }),
    getUserSteps: builder.query<IServerResponse<IUserStep, ITotalResultsSteps>, IUserYearClick>({
      query: (args) =>
        `/api/user/${args.user}/steps/${args.dateStart}/${args.dateEnd}/${args.typeLife}/${args.taskId}/`,
      keepUnusedDataFor: 0 // disable cache
      // query: ({ baseId, someFilterIds, sortBy, page }) => {
      // },
      // serializeQueryArgs: ({ endpointName }) => {
      //   return endpointName;
      // },
      // merge: (currentCache, newItems) => {
      //   currentCache.items.push(...newItems.items);
      // },
      // transformResponse: (response) => {
      //   return response || [];
      // },
      // forceRefetch({ currentArg, previousArg }) {
      //   return currentArg !== previousArg; // Force refetch if arguments differ
      // },
    }),
    getUserTypeLife: builder.query<ITypeLife[], IUserYearClick>({
      query: (args) => `/api/user/${args.user}/typelife/`,
      transformResponse: (response: ITypeLife[]) => {
        if (!Array.isArray(response)) {
          return [];
        }
        return response.map((item) => ({
          ...item,
          colortext_hex: powerBuilderColorToHex(item.colortext),
          colorbackground_hex: powerBuilderColorToHex(item.colorbackground)
        }));
      }
    }),
    getUserYears: builder.query<number[], IUserYearClick>({
      query: (args) => `/api/user/${args.user}/years/`,
      transformResponse: (response: IUserYear[]) => {
        if (!Array.isArray(response)) {
          return [];
        }
        return response.map((item) => item.year);
      }
    })
  })
});

export const {
  useGetCalendarQuery,
  useGetUserStepsQuery,
  useGetUserTypeLifeQuery,
  useGetUserYearsQuery
} = apiService;
