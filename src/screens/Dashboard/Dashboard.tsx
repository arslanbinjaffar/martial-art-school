import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Progress,
  Tag,
  Badge,
  Button,
  Space,
  Statistic,
  Spin,
  Timeline,
  Avatar,
} from "antd";
import {
  CheckCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  QrcodeOutlined,
  PlusOutlined,
  TrophyOutlined,
  ArrowRightOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import Head from "../../components/Head/Head";
import CustomButton from "../../components/CustomButton/CustomButton";
import {
  fontFamilyBold,
  fontFamilyMedium,
  fontFamilyRegular,
  primaryColor,
  tertiaryBlue,
  tertiaryBlue2,
  lightBlue3,
  pureDark,
  lightDark,
  whiteColor,
  secondaryGreen,
  primaryRed,
} from "../../components/GlobalStyle";
import {
  base_url,
  belts_my_progress_url,
  classes_list_url,
  classes_book_url,
} from "../../utils/api_urls";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../redux/store";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const loginData = useAppSelector((state: RootState) => state.loginData?.data);
  const user = loginData?.userDetails;

  const [loading, setLoading] = useState(true);
  const [beltProgress, setBeltProgress] = useState<any>(null);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [bookingClassId, setBookingClassId] = useState<number | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Belt Progression
      const beltRes = await axios.get(`${base_url}${belts_my_progress_url}`);
      if (beltRes.data?.data || beltRes.data?.results) {
        setBeltProgress(beltRes.data?.data || beltRes.data?.results);
      }

      // 2. Fetch Classes
      const classesRes = await axios.get(`${base_url}${classes_list_url}`);
      const classesData = classesRes.data?.data || classesRes.data?.results;
      if (classesData) {
        setTodayClasses(classesData.slice(0, 3));
      }
    } catch (err) {
      // quiet fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickBook = async (classItem: any) => {
    try {
      setBookingClassId(classItem.id);
      const res = await axios.post(`${base_url}${classes_book_url}`, {
        class_id: classItem.id,
        booking_date: "Today",
      });
      if (res.data?.responseCode === 200 || res.status === 200) {
        toast.success(`Spot reserved in ${classItem.title}!`);
        navigate("/booking");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.responseMessage || "Failed to book spot");
    } finally {
      setBookingClassId(null);
    }
  };

  const userName = (user as any)?.userFirstName
    ? `${(user as any).userFirstName} ${(user as any).userLastName || ""}`
    : (user as any)?.firstName
    ? `${(user as any).firstName} ${(user as any).lastName || ""}`
    : "Sensei Master";

  const attended = beltProgress?.totalClassesAttended || 18;
  const required = beltProgress?.requiredClassesForExam || 30;
  const progressPercent = Math.min(100, Math.round((attended / required) * 100));

  return (
    <DashboardStyled>
      <Head title="Dashboard - Martial Arts Academy" />

      {/* Top Banner with EnnVisions Cyan & Blue Theme */}
      <div className="banner-container">
        <div className="banner-content">
          <div className="banner-left">
            <Tag color="#00B0E9" className="custom-tag">
              🥋 Martial Arts School Portal
            </Tag>
            <h1 className="banner-title">Welcome back, {userName}!</h1>
            <p className="banner-subtitle">
              Manage your Dojo schedule, track belt progression milestones, and coordinate student attendance.
            </p>
          </div>
          <div className="banner-actions">
            <CustomButton
              title="📱 Digital QR Pass"
              clicked={() => navigate("/qr-code")}
              bgcolor={whiteColor}
              color={pureDark}
              padding="10px 20px"
              fontSize="14px"
              fontFamily={fontFamilyBold}
            />
            <CustomButton
              title="+ Schedule Class"
              clicked={() => navigate("/classes")}
              bgcolor={primaryColor}
              color={whiteColor}
              padding="10px 20px"
              fontSize="14px"
              fontFamily={fontFamilyBold}
            />
          </div>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card" bordered={false}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="metric-title">Active Students</span>
                <div className="metric-number">142</div>
                <span className="metric-trend text-success">↑ +12 this month</span>
              </div>
              <div className="metric-icon-wrapper" style={{ background: tertiaryBlue }}>
                <UserOutlined style={{ color: primaryColor, fontSize: 24 }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card" bordered={false}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="metric-title">Classes Scheduled</span>
                <div className="metric-number">28</div>
                <span className="metric-trend text-muted">5 Disciplines active</span>
              </div>
              <div className="metric-icon-wrapper" style={{ background: "#ecfdf5" }}>
                <CalendarOutlined style={{ color: secondaryGreen, fontSize: 24 }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card" bordered={false}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="metric-title">Check-ins Today</span>
                <div className="metric-number">{attended + 14}</div>
                <span className="metric-trend text-primary">QR & Kiosk Scans</span>
              </div>
              <div className="metric-icon-wrapper" style={{ background: "#fffbeb" }}>
                <QrcodeOutlined style={{ color: "#f59e0b", fontSize: 24 }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card" bordered={false}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="metric-title">Monthly Revenue</span>
                <div className="metric-number">$8,420</div>
                <span className="metric-trend text-success">98% Auto-renewed</span>
              </div>
              <div className="metric-icon-wrapper" style={{ background: tertiaryBlue }}>
                <DollarOutlined style={{ color: primaryColor, fontSize: 24 }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Section */}
      <Row gutter={[20, 20]} className="mt-3">
        {/* Left Column: Belt Progression & Quick Management */}
        <Col xs={24} lg={14}>
          <Card className="content-card mb-3" bordered={false}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="card-heading">🥋 Student Belt Progression</h3>
                <span className="text-muted small">
                  Discipline: {beltProgress?.discipline || "Brazilian Jiu-Jitsu"}
                </span>
              </div>
              <Tag color="cyan" style={{ fontSize: 13, padding: "4px 12px", borderRadius: 12 }}>
                {beltProgress?.currentBelt || "Blue Belt"} (2 Stripes)
              </Tag>
            </div>

            <div className="belt-box">
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-bold text-dark small">
                  Classes Attended Towards Next Exam ({beltProgress?.nextBelt || "Purple Belt"})
                </span>
                <span className="text-primary fw-bold small">
                  {attended} / {required} Classes ({progressPercent}%)
                </span>
              </div>
              <Progress
                percent={progressPercent}
                strokeColor={{ "0%": "#00B0E9", "100%": "#3D86AF" }}
                status="active"
              />
              <p className="text-muted small mt-2 mb-0">
                🥋 Certificate: <code>{beltProgress?.certificateNo || "CERT-BJJ-2026-904"}</code> • Awarded by Master Rodrigo Silva
              </p>
            </div>

            <h4 className="sub-heading mt-4 mb-3">Curriculum Belt Ranks</h4>
            <div className="d-flex flex-wrap gap-2">
              {[
                { rank: "White Belt", done: true, bg: "#f3f4f6", color: "#1f2937" },
                { rank: "Blue Belt", current: true, bg: tertiaryBlue, color: primaryColor },
                { rank: "Purple Belt", done: false, bg: "#faf5ff", color: "#7e22ce" },
                { rank: "Brown Belt", done: false, bg: "#fef3c7", color: "#92400e" },
                { rank: "Black Belt", done: false, bg: "#111827", color: "#ffffff" },
              ].map((b, idx) => (
                <div
                  key={idx}
                  className="belt-track-chip"
                  style={{
                    backgroundColor: b.bg,
                    color: b.color,
                    borderColor: b.current ? primaryColor : "#e5e7eb",
                    borderWidth: b.current ? 2 : 1,
                    fontWeight: b.current ? "bold" : "normal",
                    opacity: b.done || b.current ? 1 : 0.6,
                  }}
                >
                  <span>{b.done ? "✓" : b.current ? "★" : "○"}</span>
                  <span>{b.rank}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Management Tiles */}
          <Card className="content-card" bordered={false}>
            <h3 className="card-heading mb-3">⚡ Quick Management Station</h3>
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12}>
                <div
                  className="quick-action-tile"
                  onClick={() => navigate("/classes")}
                >
                  <div className="tile-icon-box" style={{ background: tertiaryBlue }}>
                    <CalendarOutlined style={{ color: primaryColor, fontSize: 20 }} />
                  </div>
                  <div>
                    <strong className="text-dark d-block">Manage Classes</strong>
                    <small className="text-muted">Timetable & trainer assign</small>
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div
                  className="quick-action-tile"
                  onClick={() => navigate("/branch/create")}
                >
                  <div className="tile-icon-box" style={{ background: "#ecfdf5" }}>
                    <PlusOutlined style={{ color: secondaryGreen, fontSize: 20 }} />
                  </div>
                  <div>
                    <strong className="text-dark d-block">Add New Branch</strong>
                    <small className="text-muted">Register Dojo training facility</small>
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div
                  className="quick-action-tile"
                  onClick={() => navigate("/membership")}
                >
                  <div className="tile-icon-box" style={{ background: "#fffbeb" }}>
                    <TrophyOutlined style={{ color: "#f59e0b", fontSize: 20 }} />
                  </div>
                  <div>
                    <strong className="text-dark d-block">Membership Plans</strong>
                    <small className="text-muted">Passes, pricing & benefits</small>
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div
                  className="quick-action-tile"
                  onClick={() => navigate("/setting?tab=sub-account")}
                >
                  <div className="tile-icon-box" style={{ background: tertiaryBlue }}>
                    <UserOutlined style={{ color: primaryColor, fontSize: 20 }} />
                  </div>
                  <div>
                    <strong className="text-dark d-block">Family Sub-Accounts</strong>
                    <small className="text-muted">Junior & delegated profiles</small>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Right Column: Today's Live Classes & Check-in Stream */}
        <Col xs={24} lg={10}>
          <Card className="content-card mb-3" bordered={false}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="card-heading mb-0">📅 Today's Live Classes</h3>
              <Button
                type="link"
                className="p-0 text-primary fw-bold"
                onClick={() => navigate("/classes")}
              >
                View All <ArrowRightOutlined />
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <Spin />
              </div>
            ) : todayClasses.length === 0 ? (
              <p className="text-muted small">No classes scheduled for today.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {todayClasses.map((item) => (
                  <div key={item.id} className="class-roster-box">
                    <div className="d-flex justify-content-between align-items-start">
                      <Tag color="cyan" style={{ borderRadius: 6, fontWeight: "bold" }}>
                        {item.discipline}
                      </Tag>
                      <span className="text-muted small">
                        <ClockCircleOutlined /> {item.start_time} - {item.end_time}
                      </span>
                    </div>

                    <h4 className="class-title mt-2 mb-1">{item.title}</h4>
                    <p className="text-muted small mb-2">
                      🥋 {item.instructor_name} • <EnvironmentOutlined /> {item.room_location}
                    </p>

                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <span className="small text-muted">
                        {item.capacity_text || `${item.enrolled_count || 0}/${item.max_capacity} spots`}
                      </span>
                      <Button
                        type="primary"
                        size="small"
                        style={{
                          backgroundColor: primaryColor,
                          borderColor: primaryColor,
                          borderRadius: 6,
                          fontWeight: "bold",
                        }}
                        loading={bookingClassId === item.id}
                        onClick={() => handleQuickBook(item)}
                      >
                        Reserve Spot
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Dojo Check-In Timeline */}
          <Card className="content-card" bordered={false}>
            <h3 className="card-heading mb-3">⚡ Live Dojo Check-Ins</h3>
            <Timeline>
              <Timeline.Item color="#00B0E9">
                <div>
                  <strong className="text-dark small">Sensei Rodrigo Silva</strong>
                  <span className="text-muted small ms-2">2 mins ago</span>
                  <p className="text-muted small mb-0">Verified Check-In at Main Tatami</p>
                </div>
              </Timeline.Item>
              <Timeline.Item color="#34C759">
                <div>
                  <strong className="text-dark small">Junior Fighter Leo</strong>
                  <span className="text-muted small ms-2">15 mins ago</span>
                  <p className="text-muted small mb-0">Checked in for Karate Kata session</p>
                </div>
              </Timeline.Item>
              <Timeline.Item color="#C0922E">
                <div>
                  <strong className="text-dark small">Master Jin-Woo Park</strong>
                  <span className="text-muted small ms-2">1 hour ago</span>
                  <p className="text-muted small mb-0">Completed Sparring Assessment</p>
                </div>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>
    </DashboardStyled>
  );
};

export default Dashboard;

const DashboardStyled = styled.div`
  background: transparent;
      color: ${whiteColor};
      border-radius: 12px;
      padding: 3px 12px;
      font-family: ${fontFamilyMedium};
      margin-bottom: 8px;
    }

    .banner-title {
      font-size: 26px;
      font-family: ${fontFamilyBold};
      color: ${whiteColor};
      margin: 4px 0 6px 0;
    }

    .banner-subtitle {
      font-size: 14px;
      font-family: ${fontFamilyRegular};
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 0;
    }

    .banner-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
  }

  .metric-card {
    border-radius: 16px;
    background: ${whiteColor};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
    border: 1px solid #f0f0f0;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    }

    .metric-title {
      font-size: 13px;
      color: ${lightDark};
      font-family: ${fontFamilyMedium};
      display: block;
    }

    .metric-number {
      font-size: 26px;
      font-family: ${fontFamilyBold};
      color: ${pureDark};
      margin: 2px 0;
    }

    .metric-trend {
      font-size: 12px;
      font-family: ${fontFamilyMedium};
    }

    .metric-icon-wrapper {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .content-card {
    border-radius: 16px;
    background: ${whiteColor};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
    border: 1px solid #f0f0f0;
    padding: 6px;

    .card-heading {
      font-size: 18px;
      font-family: ${fontFamilyBold};
      color: ${pureDark};
      margin: 0;
    }

    .sub-heading {
      font-size: 14px;
      font-family: ${fontFamilyBold};
      color: ${lightDark};
    }

    .belt-box {
      background: ${tertiaryBlue};
      border-radius: 14px;
      padding: 16px;
      border: 1px solid ${tertiaryBlue2};
    }

    .belt-track-chip {
      padding: 6px 14px;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: ${fontFamilyMedium};
    }

    .quick-action-tile {
      background: #fafafa;
      border: 1px solid #f0f0f0;
      border-radius: 12px;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: ${tertiaryBlue};
        border-color: ${primaryColor};
        transform: translateY(-2px);
      }

      .tile-icon-box {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
    }

    .class-roster-box {
      background: #fafafa;
      border: 1px solid #f0f0f0;
      border-radius: 12px;
      padding: 14px;
      transition: border-color 0.2s ease;

      &:hover {
        border-color: ${primaryColor};
      }

      .class-title {
        font-size: 15px;
        font-family: ${fontFamilyBold};
        color: ${pureDark};
      }
    }
  }
`;
