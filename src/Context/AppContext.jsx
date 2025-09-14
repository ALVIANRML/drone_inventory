import dayjs from "dayjs";
import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
const ApplicationContext = createContext();
import { BaseURL } from "../URL/BaseUrl";

export default function AppContextProvider({ children }) {
  const [loged, setLoged] = useState(""); //Verify User ID
  const [route, setRoute] = useState("home");
  const [userLoged, setUserLoged] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [merkData, setMerkData] = useState([]);
  const token = localStorage.getItem("tokenUser");

  //Handling Route
  const handleRoute = (value) => {
    setRoute(value);
  };

  const getAllData = async () => {
    try {
      const response = await axios.get(`${BaseURL}/drone/merk`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMerkData(response.data);
    } catch (error) {
      console.error("Error Message:", error);
    }
  };

  const refreshMerkData = async () => {
    await getAllData();
  };

  useEffect(() => {
    getAllData();
  }, []);

  //Object
  const contextValue = {
    route,
    setRoute,
    setLoged,
    setUserLoged,
    userLoged,
    setDetailData,
    detailData,
    loged,
    handleRoute,
    merkData,
    setMerkData,
    refreshMerkData, 
    getAllData, 
  };

  return (
    <ApplicationContext.Provider value={contextValue}>
      {children}
    </ApplicationContext.Provider>
  );
}

export const AppContext = ApplicationContext;
