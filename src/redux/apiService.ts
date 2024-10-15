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
    getCalendar: builder.query<ICalendarDate[], IUserYearClick>({
      query: (args) =>
        `/api/user/${args.userId}/calendar/${args.year}/${args.typeLife}/${args.taskId}/${args.mainEventsOnly ? 1 : 0}/`,
      keepUnusedDataFor: 0, // disable cache
      transformResponse: (response: ICalendarDate[]) => {
        if (!Array.isArray(response)) {
          return [];
        }
        return response.map((item) => ({
          ...item,
          total: item.total === null ? 1 : item.total,
          details: item.details.map((detail) => ({
            ...detail,
            value: detail.value === null ? 1 : detail.value
          }))
        }));
      }
      // query: ({ baseId, someFilterIds, sortBy, page }) => {
      // },
      // serializeQueryArgs: ({ endpointName }) => {
      //   return endpointName;
      // },
      // merge: (currentCache, newItems) => {
      //   currentCache.items.push(...newItems.items);
      // },
      // forceRefetch({ currentArg, previousArg }) {
      //   return currentArg !== previousArg; // Force refetch if arguments differ
      // },
    }),
    getUserSteps: builder.mutation<IServerResponse<IUserStep, ITotalResultsSteps>, IUserYearClick>({
      query: (args) => ({
        url: `/api/user/${args.userId}/steps/`,
        method: "POST",
        body: {
          userId: args.userId,
          dateStart: args.dateStart,
          dateEnd: args.dateEnd,
          typeLife: args.typeLife,
          taskId: args.taskId,
          mainEventsOnly: args.mainEventsOnly ? 1 : 0,
          page: args.page,
          itemsPerPage: args.itemsPerPage
        }
      })
    }),
    getUserTypeLife: builder.query<ITypeLife[], IUserYearClick>({
      query: (args) => `/api/user/${args.userId}/typelife/`,
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
      query: (args) => `/api/user/${args.userId}/years/`,
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
  useGetUserStepsMutation,
  useGetUserTypeLifeQuery,
  useGetUserYearsQuery
} = apiService;
