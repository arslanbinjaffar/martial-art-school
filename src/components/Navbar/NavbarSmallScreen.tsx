import { NavbarSmallScreenStyled } from "./style";

import logo from "../../assets/icons/ic_logo.svg";
import { Avatar, Badge, Button, Drawer } from "antd";
import { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import CustomButton from "../CustomButton/CustomButton";
import notificationIcon from "../../assets/icons/ic_notitfication.svg";
import profileIcon from "../../assets/icons/ic_profile_avatar.svg";
const NavbarSmallScreen = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <NavbarSmallScreenStyled>
      <div className="d-flex justify-content-between align-items-center">
        <Drawer
          visible={drawerVisible}
          placement="right"
          onClick={() => setDrawerVisible(false)}
          onClose={() => setDrawerVisible(false)}
          width={300}
        >
          <NavigationMenu />
        </Drawer>
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="notification-area">
          <CustomButton
            title=""
            icon={<img src={notificationIcon} alt="notification " />}
            type="button"
            bgcolor={"white"}
            width="50px"
            color=""
            padding=""
          />
          <span className="notification-count">4</span>
        </div>
        <div className="profile-area">
          <Badge dot color="green">
            <Avatar size={50} src={profileIcon} shape="square" />
          </Badge>
        </div>
        <div className="menu-toggler">
          <Button
            className="menu"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
          />
        </div>
      </div>
    </NavbarSmallScreenStyled>
  );
};

export default NavbarSmallScreen;
