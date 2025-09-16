import { useState } from "react";
import { Dropdown, Layout, Menu, Button, theme } from "antd";
const { Header, Content, Footer } = Layout;
import LogoHeader from "../assets/Img/LogoHeader_PTPN4.png";
import Route from "../Route/Route";
import { MenuOutlined, LogoutOutlined } from "@ant-design/icons";

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
        <div className="flex items-center">
          <img
            src={LogoHeader}
            alt=""
            className="w-10 sm:w-10 md:w-12 lg:w-12 xl:w-14"
          />
          <h2
            className="
        ml-2 sm:ml-4 md:ml-6
        text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl
        font-bold text-white
      "
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Drone Inventory
          </h2>
        </div>

        {/* Kanan */}
        {/* Untuk layar besar (xl ke atas), tombol logout langsung muncul */}
        <div className="hidden xl:flex">
          <button
            onClick={handleLogout}
            className="px-4 h-10 bg-blue-500 text-white rounded-lg 
        flex items-center justify-center 
        hover:bg-red-600 active:bg-red-400 
        transition-colors duration-200 "
          >
            Logout
          </button>
        </div>

        {/* Untuk layar kecil (xs sm md lg), pakai dropdown */}
        <div className="xl:hidden">
          <Dropdown
          style={{marginTop:"5vh"}}
            menu={{
              items: [
                {
                  key: "1",
                  label: (
                    <span
                      onClick={handleLogout}
                      className="flex items-center text-red-600"
                    >
                      <LogoutOutlined className="mr-2" /> Logout
                    </span>
                  ),
                },
              ],
            }}
            overlayStyle={{ zIndex: 6000 }} // lebih tinggi dari Header
            getPopupContainer={(trigger) => document.body} // biar render di body, bukan ke dalam Header
            placement="bottomRight"
            trigger={["click"]}
          >
            <Button type="primary" shape="circle" icon={<MenuOutlined />} />
          </Dropdown>
        </div>
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
