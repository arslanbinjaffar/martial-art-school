import { Menu, MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import membership from "../../assets/icons/ic_dashboard_..svg";
import logo from "../../assets/icons/ic_logo.svg";
import dashboard from "../../assets/icons/ic_membership.svg";
import payment from "../../assets/icons/ic_membership.svg";
import classes from "../../assets/icons/ic_classes.svg";
import booking from "../../assets/icons/ic_booking.svg";
import qrCode from "../../assets/icons/ic_qr_code.svg";
import setting from "../../assets/icons/ic_setting.svg";
import { NavigationMenuStyled } from "./styles";

type MenuItem = Required<MenuProps>["items"][number];

const routeKeyMap: Record<string, string> = {
  dashboard: "/",
  superAdmin: "/super-admin",
  createSchool: "/school/create",
  listbranch: "/branch/list",
  listFranchise: "/franchise/list",
  membership: "/membership",
  payment: "/payment",
  classes: "/classes",
  booking: "/booking",
  "booking-current": "/booking?tab=current",
  "booking-webinars": "/booking?tab=webinars",
  "booking-previous": "/booking?tab=previous",
  qrCode: "/qr-code",
  "setting-profile": "/setting?tab=profile",
  "setting-sub-account": "/setting?tab=sub-account",
  "setting-change-password": "/setting?tab=change-password",
  "setting-delete-account": "/setting?tab=delete-account",
  "setting-enrolled-school": "/setting?tab=enrolled-school",
};

const NavigationMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getMenuIcon = (file: any) => <img src={file} alt="" style={{ width: 18, height: 18 }} />;

  const sidebarData: MenuItem[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: getMenuIcon(dashboard),
    },
    {
      key: "superAdmin",
      label: "👑 Super Admin",
      icon: getMenuIcon(membership),
    },
    {
      key: "createSchool",
      label: "School Profile",
      icon: getMenuIcon(dashboard),
    },
    {
      key: "listbranch",
      label: "Branches",
      icon: getMenuIcon(dashboard),
    },
    {
      key: "listFranchise",
      label: "Franchises",
      icon: getMenuIcon(dashboard),
    },
    {
      key: "membership",
      label: "Membership",
      icon: getMenuIcon(membership),
    },
    {
      key: "payment",
      label: "Payment & Wallet",
      icon: getMenuIcon(payment),
    },
    {
      key: "classes",
      label: "Classes & Timetable",
      icon: getMenuIcon(classes),
    },
    {
      key: "booking",
      label: "Bookings & Seminars",
      icon: getMenuIcon(booking),
      children: [
        {
          key: "booking-current",
          label: "Current Bookings",
        },
        {
          key: "booking-webinars",
          label: "💻 Live Masterclasses",
        },
        {
          key: "booking-previous",
          label: "Past Training History",
        },
      ],
    },
    {
      key: "qrCode",
      label: "Member QR Pass",
      icon: getMenuIcon(qrCode),
    },
    {
      key: "setting",
      label: "Settings",
      icon: getMenuIcon(setting),
      children: [
        {
          key: "setting-profile",
          label: "My Profile",
        },
        {
          key: "setting-sub-account",
          label: "Sub Account",
        },
        {
          key: "setting-change-password",
          label: "Change Password",
        },
        {
          key: "setting-enrolled-school",
          label: "Enrolled School",
        },
        {
          key: "setting-delete-account",
          label: "Delete Account",
        },
      ],
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const targetRoute = routeKeyMap[e.key];
    if (targetRoute) {
      navigate(targetRoute);
    }
  };

  // Determine active selected key
  let selectedKey = "dashboard";
  if (location.pathname === "/school/create") selectedKey = "createSchool";
  else if (location.pathname.startsWith("/branch")) selectedKey = "listbranch";
  else if (location.pathname.startsWith("/franchise")) selectedKey = "listFranchise";
  else if (location.pathname.startsWith("/membership")) selectedKey = "membership";
  else if (location.pathname.startsWith("/payment") || location.pathname.startsWith("/credit-card")) selectedKey = "payment";
  else if (location.pathname.startsWith("/classes")) selectedKey = "classes";
  else if (location.pathname.startsWith("/booking")) {
    selectedKey = location.search.includes("previous") ? "booking-previous" : "booking-current";
  } else if (location.pathname.startsWith("/qr-code")) selectedKey = "qrCode";
  else if (location.pathname.startsWith("/setting")) {
    if (location.search.includes("change-password")) selectedKey = "setting-change-password";
    else if (location.search.includes("enrolled-school")) selectedKey = "setting-enrolled-school";
    else if (location.search.includes("delete-account")) selectedKey = "setting-delete-account";
    else if (location.search.includes("sub-account")) selectedKey = "setting-sub-account";
    else selectedKey = "setting-profile";
  }

  return (
    <NavigationMenuStyled>
      <div
        className="logo text-center cursor-pointer mb-3"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="Martial Arts Logo" />
      </div>
      <Menu
        selectedKeys={[selectedKey]}
        mode="inline"
        items={sidebarData}
        onClick={handleMenuClick}
      />
    </NavigationMenuStyled>
  );
};

export default NavigationMenu;
