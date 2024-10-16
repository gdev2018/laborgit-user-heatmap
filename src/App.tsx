import React, { useCallback, useMemo } from "react";
import "./reset.css";
import UserActivity from "./components/UserActivity";
// import "./normalize.css";
// import "./App.css";

const App: React.FC = () => {
  const url = window.location.pathname;

  const getUserIdFromUrl = (url: string): number | null => {
    const segments = url.split("/");
    const userIndex = segments.indexOf("user");
    return userIndex !== -1 && userIndex + 1 < segments.length
      ? Number(segments[userIndex + 1]) || null
      : null;
  };

  const userId = useMemo(() => getUserIdFromUrl(url), [url]);

  const renderError = useCallback(() => {
    if (userId === null && process.env.NODE_ENV !== "development") {
      return <div>Error: Invalid UserID. Please check the URL.</div>;
    }
    return null;
  }, [userId]);

  return (
    <>
      {renderError()}
      <UserActivity userId={userId ?? 1} />
    </>
  );
};

export default App;
