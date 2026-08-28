import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { GlobalContainer } from "../../screens/Home/style";

const { Header, Content } = Layout;

type AppLayoutProps = {
  children?: ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <GlobalContainer style={{ width: "100%", margin: 0, padding: 0 }}>
      <Layout style={{ minHeight: "100vh", width: "100%", background: "#f8fafc" }}>
        <Sidebar />

        <Layout
          className="content-left-width"
          style={{
            minHeight: "100vh",
            background: "#f8fafc",
            width: "calc(100% - 280px)",
            maxWidth: "calc(100% - 280px)",
            transition: "all 0.2s ease",
          }}
        >
          <Header
            style={{
              padding: "16px 28px",
              background: "white",
              marginBottom: 16,
              position: "sticky",
              top: 0,
              zIndex: 100,
              width: "100%",
            }}
            className="navbar-styles"
          >
            <Navbar />
          </Header>

          <Content
            className="content-styles"
            style={{
              padding: "0 28px 32px 28px",
              width: "100%",
              maxWidth: "100%",
              flex: 1,
            }}
          >
            {children ? children : <Outlet />}
          </Content>
        </Layout>
      </Layout>
    </GlobalContainer>
  );
};

export default AppLayout;
