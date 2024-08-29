import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { store } from "./redux";
import { Provider } from "react-redux";
// import { StrictMode } from "react";
// import "./index.css";

// prevent logs in production mode
if (process.env.NODE_ENV !== "development") {
  console.log = function () {};
}

const container = document.getElementById("app_calendar_heatmap");
if (container) {
  const root = createRoot(container);
  root.render(
    // <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    // </StrictMode>
  );
}
