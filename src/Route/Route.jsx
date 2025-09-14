import React, { useContext } from "react";

import { AppContext } from "../Context/AppContext";
import Home from "../Component/Home";
import Detail from "../Component/Detail";

export default function Route() {
  const { route } = useContext(AppContext)

  const renderPage = () => {
    switch (route) {
      case "home":
        return <Home />;
      case "detail":
        return <Detail />;
      default:
        return <Home />;
    }
  };
  return <>{renderPage()}</>;
}
