import { useMemo, useRef, useState, useEffect } from "react";
import { Avatar, Badge, Button, Drawer, Dropdown, Input, InputRef, MenuProps, Modal, Popover } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
  SearchOutlined,
  CloudOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

import { useGlobalContext } from "../../context/context";
import { RootState } from "../../redux/store";
import { setLanguage } from "../../redux/features/selectedLanguageSlice";
import { removeLoginData } from "../../redux/features/loginDataSlice";
import { removeUserLogin } from "../../redux/features/admin/user/loginDataSlice";
import { auth_token_key, base_url, universal_search_url } from "../../utils/api_urls";

import NavigationMenu from "../NavigationMenu/NavigationMenu";
import NavbarStyle, { NavbarRow2Styled } from "./style";

import searchIcon from "../../assets/icons/ic_search(1).svg";
import notificationIcon from "../../assets/icons/ic_notitfication.svg";
import profileIcon from "../../assets/icons/ic_profile_avatar.svg";
import ukIcon from "../../assets/icons/ic_uk_flag.svg";
import cloudIcon from "../../assets/icons/ic_cloud.svg";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchText, setSearchText } = useGlobalContext();
  const searchRef = useRef<InputRef>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loginData = useSelector((state: RootState) => state.loginData?.data);
  const user = loginData?.userDetails;
  const { selectedLanguage } = useSelector((state: RootState) => state.selectedLanguage);

  const [notificationCount, setNotificationCount] = useState(4);

  // Search Results State
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);

  const currentDateFormatted = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(auth_token_key);
    dispatch(removeUserLogin());
    dispatch(removeLoginData());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSearch = async (term: string) => {
    setSearchText(term);
    if (!term.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      setSearching(true);
      const res = await axios.get(`${base_url}${universal_search_url}?q=${encodeURIComponent(term)}`);
      const data = res.data?.data || res.data?.results;
      if (data) {
        setSearchResults(data);
        setShowSearchModal(true);
      }
    } catch (err) {
      // quiet search fallback
    } finally {
      setSearching(false);
    }
  };

  // Language Menu
  const languageItems: MenuProps["items"] = [
    {
      key: "en",
      label: "🇬🇧 English",
      onClick: () => {
        dispatch(setLanguage("en"));
        toast.info("Language changed to English");
      },
    },
    {
      key: "es",
      label: "🇪🇸 Español",
      onClick: () => {
        dispatch(setLanguage("es"));
        toast.info("Idioma cambiado a Español");
      },
    },
    {
      key: "pt",
      label: "🇵🇹 Português",
      onClick: () => {
        dispatch(setLanguage("pt"));
        toast.info("Idioma alterado para Português");
      },
    },
    {
      key: "ar",
      label: "🇸🇦 العربية",
      onClick: () => {
        dispatch(setLanguage("ar"));
        toast.info("تم تغيير اللغة إلى العربية");
      },
    },
    {
      key: "ur",
      label: "🇵🇰 اردو",
      onClick: () => {
        dispatch(setLanguage("ur"));
        toast.info("زبان اردو میں تبدیل کر دی گئی ہے");
      },
    },
  ];

  // Notification Items
  const notificationItems: MenuProps["items"] = [
    {
      key: "header",
      label: (
        <div className="d-flex justify-content-between align-items-center py-1">
          <strong className="text-dark">Notifications</strong>
          <span
            className="text-primary small cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setNotificationCount(0);
              toast.info("All notifications marked as read");
            }}
          >
            Mark all read
          </span>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "notif-1",
      icon: <CheckCircleOutlined style={{ color: "#10b981" }} />,
      label: (
        <div>
          <div className="fw-bold text-dark">Belt Promotion Ready!</div>
          <small className="text-muted">You are eligible for the next BJJ Stripe assessment.</small>
        </div>
      ),
      onClick: () => navigate("/booking"),
    },
    {
      key: "notif-2",
      icon: <BellOutlined style={{ color: "#3b82f6" }} />,
      label: (
        <div>
          <div className="fw-bold text-dark">Class Reminder: Muay Thai</div>
          <small className="text-muted">Your class starts today at 05:30 PM (Mat A).</small>
        </div>
      ),
      onClick: () => navigate("/classes"),
    },
    {
      key: "notif-3",
      icon: <CreditCardOutlined style={{ color: "#f59e0b" }} />,
      label: (
        <div>
          <div className="fw-bold text-dark">Monthly Dojo Pass Active</div>
          <small className="text-muted">Payment processed successfully.</small>
        </div>
      ),
      onClick: () => navigate("/payment"),
    },
  ];

  // Profile Menu
  const profileItems: MenuProps["items"] = [
    {
      key: "profile-header",
      onClick: () => navigate("/setting?tab=profile"),
      label: (
        <div className="py-1" style={{ cursor: "pointer" }}>
          <div className="fw-bold text-dark">
            {(user as any)?.userFirstName
              ? `${(user as any).userFirstName} ${(user as any).userLastName || ""}`
              : (user as any)?.firstName
              ? `${(user as any).firstName} ${(user as any).lastName || ""}`
              : "Martial Arts Master"}
          </div>
          <small className="text-muted">
            {(user as any)?.email || (user as any)?.emailAddress || "user@martialarts.com"}
          </small>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "my-profile",
      icon: <UserOutlined />,
      label: "My Profile",
      onClick: () => navigate("/setting?tab=profile"),
    },
    {
      key: "membership",
      icon: <CreditCardOutlined />,
      label: "Membership Plans",
      onClick: () => navigate("/membership"),
    },
    {
      key: "school-profile",
      icon: <SettingOutlined />,
      label: "School Settings",
      onClick: () => navigate("/school/create"),
    },
    {
      key: "account-settings",
      icon: <SettingOutlined />,
      label: "Account & Password",
      onClick: () => navigate("/setting?tab=change-password"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ color: "#ef4444" }} />,
      label: <span className="text-danger fw-bold">Logout</span>,
      onClick: handleLogout,
    },
  ];

  // Weather & Training Conditions Popover Content
  const weatherPopoverContent = (
    <div style={{ width: 280, padding: "6px 2px" }}>
      <div className="d-flex align-items-center gap-3 mb-3 pb-2 border-bottom">
        <span style={{ fontSize: "32px" }}>🌤️</span>
        <div>
          <strong className="text-dark d-block" style={{ fontSize: "15px" }}>
            Los Angeles, CA • 72°F
          </strong>
          <span className="text-success small fw-bold">✓ Optimal Training Conditions</span>
        </div>
      </div>

      <div className="d-flex flex-column gap-2" style={{ fontSize: "13px" }}>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted">🥋 Tatami Status:</span>
          <span className="badge bg-success-subtle text-success border border-success-subtle">
            Sanitized & Open
          </span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted">🌡️ Climate Control:</span>
          <strong className="text-dark">Active AC (68°F)</strong>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted">💧 Hydration:</span>
          <strong className="text-dark">Fully Stocked</strong>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted">⏰ Peak Mat Hours:</span>
          <strong className="text-primary">05:00 - 08:30 PM</strong>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <NavbarStyle>
        <Drawer
          open={drawerOpen}
          placement="left"
          onClick={() => setDrawerOpen(false)}
          onClose={() => setDrawerOpen(false)}
          width={300}
        >
          <NavigationMenu />
        </Drawer>

        <div className="top-side d-flex align-items-center justify-content-between gap-4">
          <div className="menu-toggler">
            <Button
              className="menu"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
            />
          </div>

          <div className="left-bar d-flex align-items-center">
            <Input
              ref={searchRef}
              value={searchText}
              placeholder="Search classes, techniques, dojos..."
              onChange={(e) => handleSearch(e.target.value)}
              onPressEnter={() => setShowSearchModal(true)}
              suffix={<img src={searchIcon} alt="search-icon" style={{ cursor: "pointer" }} onClick={() => setShowSearchModal(true)} />}
              className="custom-input"
            />
          </div>

          <div className="right-bar d-flex gap-3 align-items-center">
            {/* Weather / Dojo Status Popover */}
            <Popover
              content={weatherPopoverContent}
              title={<strong className="text-dark">🌤️ Today's Dojo Conditions</strong>}
              trigger="click"
              placement="bottomRight"
            >
              <div
                className="date-time-area px-3 d-flex align-items-center gap-2"
                style={{ cursor: "pointer" }}
              >
                <img src={cloudIcon} alt="" />
                <span className="date">{currentDateFormatted}</span>
              </div>
            </Popover>

            {/* Notifications Dropdown */}
            <Dropdown menu={{ items: notificationItems }} trigger={["click"]} placement="bottomRight">
              <div className="notification-area cursor-pointer" style={{ cursor: "pointer" }}>
                <Badge count={notificationCount} size="small" offset={[-2, 2]}>
                  <div
                    style={{
                      background: "white",
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    <img src={notificationIcon} alt="notification" style={{ width: "20px", height: "20px" }} />
                  </div>
                </Badge>
              </div>
            </Dropdown>

            {/* Profile Dropdown */}
            <Dropdown menu={{ items: profileItems }} trigger={["click"]} placement="bottomRight">
              <div className="profile-area cursor-pointer" style={{ cursor: "pointer" }}>
                <Badge dot color="green">
                  <Avatar
                    size={44}
                    src={user?.profileImageURL || (user as any)?.profilePictureURL || localStorage.getItem("user_profile_picture") || profileIcon}
                    shape="square"
                    style={{ borderRadius: "12px", objectFit: "cover" }}
                  />
                </Badge>
              </div>
            </Dropdown>

            {/* Language Dropdown */}
            <Dropdown menu={{ items: languageItems }} trigger={["click"]} placement="bottomRight">
              <div className="language-area cursor-pointer" style={{ cursor: "pointer" }}>
                <div
                  style={{
                    background: "white",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <GlobalOutlined style={{ fontSize: "16px", color: "#3b82f6" }} />
                  <span className="fw-bold small text-uppercase">{selectedLanguage}</span>
                </div>
              </div>
            </Dropdown>
          </div>
        </div>

        <NavbarRow2Styled>
          <div className="d-flex align-items-center justify-content-between row2">
            <div className="left-bar d-flex align-items-center">
              <Input
                ref={searchRef}
                value={searchText}
                placeholder="Search ..."
                onChange={(e) => handleSearch(e.target.value)}
                onPressEnter={() => setShowSearchModal(true)}
                suffix={<img src={searchIcon} alt="search-icon" />}
                className="custom-input"
              />
            </div>
          </div>
        </NavbarRow2Styled>

        {/* Global Search Modal */}
        <Modal
          title={`🔍 Search Results for "${searchText || 'all'}"`}
          open={showSearchModal}
          onOk={() => setShowSearchModal(false)}
          onCancel={() => setShowSearchModal(false)}
          footer={null}
          centered
          zIndex={9999}
          getContainer={() => document.body}
          bodyStyle={{ background: "#ffffff", padding: "16px" }}
        >
          <div className="py-2">
            {searching ? (
              <p className="text-muted text-center py-4">Searching Dojo database...</p>
            ) : searchResults ? (
              <div>
                {searchResults.classes?.length > 0 && (
                  <div className="mb-3">
                    <h6 className="fw-bold text-primary mb-2">🥋 Classes & Sessions</h6>
                    {searchResults.classes.map((c: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2 border rounded-2 mb-2 cursor-pointer bg-light d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setShowSearchModal(false);
                          navigate(c.route);
                        }}
                      >
                        <div>
                          <strong className="text-dark">{c.title}</strong>
                          <div className="small text-muted">{c.subtitle}</div>
                        </div>
                        <span className="badge bg-primary">View</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.schools?.length > 0 && (
                  <div className="mb-3">
                    <h6 className="fw-bold text-success mb-2">🏢 Martial Arts Academies</h6>
                    {searchResults.schools.map((s: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2 border rounded-2 mb-2 cursor-pointer bg-light d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setShowSearchModal(false);
                          navigate(s.route);
                        }}
                      >
                        <div>
                          <strong className="text-dark">{s.title}</strong>
                          <div className="small text-muted">{s.subtitle}</div>
                        </div>
                        <span className="badge bg-success">Dojo Profile</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.users?.length > 0 && (
                  <div>
                    <h6 className="fw-bold text-dark mb-2">👤 Fighters & Instructors</h6>
                    {searchResults.users.map((u: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2 border rounded-2 mb-2 cursor-pointer bg-light d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setShowSearchModal(false);
                          navigate(u.route);
                        }}
                      >
                        <div>
                          <strong className="text-dark">{u.title}</strong>
                          <div className="small text-muted">{u.subtitle}</div>
                        </div>
                        <span className="badge bg-dark">Profile</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted text-center py-4">No matching results found.</p>
            )}
          </div>
        </Modal>
      </NavbarStyle>
    </>
  );
}

export default Navbar;
