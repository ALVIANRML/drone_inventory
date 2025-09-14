import { useState } from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Footer } = Layout;
import LogoHeader from "../assets/Img/LogoHeader_PTPN4.png";
import Route from "../Route/Route";
import Home from "../Component/Home";
import Detail from "../Component/Detail";

const Dashboard = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      localStorage.removeItem("tokenUser");
      localStorage.removeItem("userData");
      window.location.reload();
    } catch (error) {
      console.error("Error saat logout:", error);
      setIsLoggingOut(false);
    }
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Header
        style={{
          position: "fixed",
          top: 0,
          zIndex: 5000,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Kiri */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={LogoHeader} alt="" className="w-10" />
          <h2
            className="ml-5 text-3xl font-bold text-white"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Drone Inventory
          </h2>
        </div>

        {/* Kanan */}
        <button
          onClick={handleLogout}
          className="w-24 h-10 bg-blue-500 text-white rounded-lg 
             flex items-center justify-center 
             hover:bg-red-600 active:bg-red-400 
             transition-colors duration-200"
        >
          Logout
        </button>
      </Header>
      <Content style={{ padding: "0px", marginTop: "6vh" }}>
        <div
          style={{
            padding: 24,
            minHeight: "94vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Route />
          {/* <Detail /> */}
        </div>
      </Content>
    </Layout>
  );
};
export default Dashboard;
