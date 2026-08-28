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
    <GlobalContainer>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />

        <Layout className="content-left-width" style={{ transition: "all 0.2s ease" }}>
          <Header
            style={{
              padding: "16px",
              background: "white",
              marginBottom: 20,
              position: "sticky",
              top: 0,
              zIndex: 100,
              width: "100%",
            }}
            className="navbar-styles"
          >
            <Navbar />
          </Header>

          <Content className="content-styles" style={{ padding: "0 16px 32px 16px" }}>
            {children ? children : <Outlet />}
          </Content>
        </Layout>
      </Layout>
    </GlobalContainer>
  );
};

export default AppLayout;
