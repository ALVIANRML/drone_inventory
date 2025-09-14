import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppContextProvider from "./Context/AppContext.jsx";
import Login from "./Page/Login.jsx";
import Dashboard from "./Page/Dashboard.jsx";
import { Spin } from "antd";

const Root = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoginStatus = (isAuthenticated, isLoading) => {
    setAuthenticated(isAuthenticated);
    setLoading(isLoading);
  };

  return (
    <AppContextProvider>
      {loading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: "100vh",
            backgroundColor: "rgb(255, 255, 255)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Spin size="large" />
          <p style={{ marginTop: 16, color: "black" }}>Memuat...</p>
        </div>
      ) : authenticated ? (
        <Dashboard />
      ) : (
        <Login onStatus={handleLoginStatus} />
      )}
    </AppContextProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
