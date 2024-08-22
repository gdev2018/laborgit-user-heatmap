import { configureStore } from "@reduxjs/toolkit";
import { apiService } from "./apiService";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific feature of the store
    [apiService.reducerPath]: apiService.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiService.middleware),
});

// Export hooks for usage in functional components
// export const { useDispatch, useSelector } = store;
