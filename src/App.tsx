import React, { useMemo, useCallback } from "react";
import UserActivity from "./components/UserActivity";
// import "./reset.css";
// import "./normalize.css";
// import "./App.css";

const MemoizedUserActivityComponent = React.memo(UserActivity);

const App: React.FC = () => {
  const url = window.location.pathname;
  const userId = useMemo(() => {
    const segments = url.split("/");
    const userIndex = segments.findIndex((segment) => segment === "user");
    if (userIndex !== -1 && userIndex + 1 < segments.length) {
      return Number(segments[userIndex + 1]);
    }
    return null;
  }, [url]);

  const renderError = useCallback(() => {
    if (userId === null && process.env.NODE_ENV !== "development") {
      return <div>Error: Invalid UserID</div>;
    }
    return null;
  }, [userId]);

  return (
    // <div style={{ minHeight: "300px", overflowY: "auto" }}>
    <>
      {renderError()}
      <MemoizedUserActivityComponent user={userId === null ? 1 : userId} />
    </>
  );
};

export default App;
