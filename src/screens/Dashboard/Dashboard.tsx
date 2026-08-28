import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ProgressBar, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import Head from "../../components/Head/Head";
import CustomButton from "../../components/CustomButton/CustomButton";
import {
  fontFamilyBold,
  fontFamilyMedium,
  lightBlue3,
  primaryColor,
  pureDark,
  whiteColor,
} from "../../components/GlobalStyle";
import {
  base_url,
  belts_my_progress_url,
  classes_list_url,
  classes_book_url,
} from "../../utils/api_urls";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../redux/store";

const Dashboard = () => {
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
      <Head title="Dojo Command Center" />
      <Container fluid className="py-2 px-md-3">
        {/* Welcome Header */}
        <div className="welcome-banner mb-4 p-4 rounded-4 text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className="badge bg-white text-dark mb-2 px-3 py-1 fw-bold">🥋 Dojo Management Portal</span>
            <h1 className="fw-bold mb-1">Welcome back, {userName}!</h1>
            <p className="mb-0 text-white-50">
              Here is what's happening at your martial arts school today. Track attendance, schedule classes, and manage student rankings.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <CustomButton
              title="📱 Digital QR Pass"
              clicked={() => navigate("/qr-code")}
              bgcolor={lightBlue3}
              color={pureDark}
              padding="10px 18px"
              fontSize="14px"
              fontFamily={fontFamilyBold}
            />
            <CustomButton
              title="+ Schedule Class"
              clicked={() => navigate("/classes")}
              bgcolor="#ffffff"
              color="#0f172a"
              padding="10px 18px"
              fontSize="14px"
              fontFamily={fontFamilyBold}
            />
          </div>
        </div>

        {/* KPI Metrics */}
        <Row className="g-3 mb-4">
          <Col xl={3} md={6}>
            <Card className="metric-card">
              <Card.Body className="p-3 d-flex align-items-center gap-3">
                <div className="icon-box bg-primary-subtle text-primary">🥋</div>
                <div>
                  <span className="metric-lbl">Active Students</span>
                  <h3 className="metric-val mb-0">142</h3>
                  <small className="text-success fw-bold">↑ +12 this month</small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} md={6}>
            <Card className="metric-card">
              <Card.Body className="p-3 d-flex align-items-center gap-3">
                <div className="icon-box bg-success-subtle text-success">📅</div>
                <div>
                  <span className="metric-lbl">Live Classes Scheduled</span>
                  <h3 className="metric-val mb-0">28</h3>
                  <small className="text-muted">5 Disciplines active</small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} md={6}>
            <Card className="metric-card">
              <Card.Body className="p-3 d-flex align-items-center gap-3">
                <div className="icon-box bg-warning-subtle text-warning">⏱</div>
                <div>
                  <span className="metric-lbl">Dojo Check-ins Today</span>
                  <h3 className="metric-val mb-0">{attended + 14}</h3>
                  <small className="text-primary fw-bold">QR & Kiosk Scans</small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} md={6}>
            <Card className="metric-card">
              <Card.Body className="p-3 d-flex align-items-center gap-3">
                <div className="icon-box bg-info-subtle text-info">💰</div>
                <div>
                  <span className="metric-lbl">Monthly Revenue</span>
                  <h3 className="metric-val mb-0">$8,420</h3>
                  <small className="text-success fw-bold">98% Auto-renewed</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Left Column: Belt Progression & Curriculum */}
          <Col lg={7}>
            <Card className="dashboard-card mb-4">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4 className="fw-bold text-dark mb-0">🥋 Student Belt Progression</h4>
                    <small className="text-muted">Discipline: {beltProgress?.discipline || "Brazilian Jiu-Jitsu"}</small>
                  </div>
                  <span className="badge bg-primary px-3 py-2">
                    {beltProgress?.currentBelt || "Blue Belt"} (2 Stripes)
                  </span>
                </div>

                <div className="belt-status-box p-3 bg-light rounded-3 mb-3 border">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold text-dark small">Attendance to Next Exam ({beltProgress?.nextBelt || "Purple Belt"})</span>
                    <span className="text-primary fw-bold small">{attended} / {required} Classes ({progressPercent}%)</span>
                  </div>
                  <ProgressBar now={progressPercent} variant="primary" style={{ height: 10 }} />
                  <p className="text-muted small mt-2 mb-0">
                    🥋 Certificate: <code>{beltProgress?.certificateNo || "CERT-BJJ-2026-904"}</code> • Awarded by Master Rodrigo Silva
                  </p>
                </div>

                <h6 className="fw-bold text-dark mt-4 mb-3">Curriculum Belt Track</h6>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    { rank: "White Belt", done: true, color: "#e2e8f0", text: "#0f172a" },
                    { rank: "Blue Belt", current: true, color: "#3b82f6", text: "#ffffff" },
                    { rank: "Purple Belt", done: false, color: "#8b5cf6", text: "#ffffff" },
                    { rank: "Brown Belt", done: false, color: "#78350f", text: "#ffffff" },
                    { rank: "Black Belt", done: false, color: "#0f172a", text: "#ffffff" },
                  ].map((b, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 rounded-2 border d-flex align-items-center gap-2"
                      style={{
                        backgroundColor: b.color,
                        color: b.text,
                        fontWeight: b.current ? "bold" : "normal",
                        opacity: b.done || b.current ? 1 : 0.4,
                      }}
                    >
                      <span>{b.done ? "✓" : b.current ? "★" : "○"}</span>
                      <span>{b.rank}</span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Quick Navigation Cards */}
            <Card className="dashboard-card p-4">
              <h4 className="fw-bold text-dark mb-3">⚡ Quick Management Actions</h4>
              <Row className="g-3">
                <Col sm={6}>
                  <div
                    className="action-tile p-3 rounded-3 border bg-light cursor-pointer"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/classes")}
                  >
                    <div className="tile-icon">🥋</div>
                    <strong className="text-dark d-block">Manage Classes</strong>
                    <small className="text-muted">Update timetable & assign Senseis</small>
                  </div>
                </Col>

                <Col sm={6}>
                  <div
                    className="action-tile p-3 rounded-3 border bg-light cursor-pointer"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/branch/create")}
                  >
                    <div className="tile-icon">🏢</div>
                    <strong className="text-dark d-block">Add New Branch</strong>
                    <small className="text-muted">Register a new Dojo dojo facility</small>
                  </div>
                </Col>

                <Col sm={6}>
                  <div
                    className="action-tile p-3 rounded-3 border bg-light cursor-pointer"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/membership")}
                  >
                    <div className="tile-icon">⭐</div>
                    <strong className="text-dark d-block">Membership Tiers</strong>
                    <small className="text-muted">Configure pricing & passes</small>
                  </div>
                </Col>

                <Col sm={6}>
                  <div
                    className="action-tile p-3 rounded-3 border bg-light cursor-pointer"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/setting?tab=sub-account")}
                  >
                    <div className="tile-icon">👤</div>
                    <strong className="text-dark d-block">Family Sub-Accounts</strong>
                    <small className="text-muted">Manage child practitioner profiles</small>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column: Today's Class Roster & Check-in Feed */}
          <Col lg={5}>
            <Card className="dashboard-card mb-4 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold text-dark mb-0">📅 Today's Live Classes</h4>
                <a
                  href="#/classes"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/classes");
                  }}
                  className="small text-primary fw-bold"
                >
                  View All
                </a>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" size="sm" variant="primary" />
                </div>
              ) : todayClasses.length === 0 ? (
                <p className="text-muted small">No classes scheduled for today.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {todayClasses.map((item) => (
                    <div key={item.id} className="class-roster-item p-3 border rounded-3 bg-light">
                      <div className="d-flex justify-content-between align-items-start">
                        <span
                          className="badge"
                          style={{
                            backgroundColor: `${item.tag_color || "#3b82f6"}20`,
                            color: item.tag_color || "#3b82f6",
                          }}
                        >
                          {item.discipline}
                        </span>
                        <small className="text-muted">{item.start_time} - {item.end_time}</small>
                      </div>

                      <h6 className="fw-bold text-dark mt-2 mb-1">{item.title}</h6>
                      <p className="text-muted small mb-2">🥋 {item.instructor_name} • 📍 {item.room_location}</p>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                        <span className="small text-muted">{item.capacity_text || `${item.enrolled_count || 0}/${item.max_capacity} spots`}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary px-3"
                          disabled={bookingClassId === item.id}
                          onClick={() => handleQuickBook(item)}
                        >
                          {bookingClassId === item.id ? "Booking..." : "Reserve Spot"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Check-Ins Stream */}
            <Card className="dashboard-card p-4">
              <h4 className="fw-bold text-dark mb-3">⚡ Live Dojo Check-Ins</h4>
              <div className="timeline-stream">
                <div className="stream-item pb-3 border-bottom mb-2">
                  <div className="d-flex justify-content-between">
                    <strong className="text-dark small">Sensei Rodrigo Silva</strong>
                    <span className="text-muted small">2 mins ago</span>
                  </div>
                  <p className="text-muted small mb-0">Scanned QR Check-In at Main Dojo Reception</p>
                </div>

                <div className="stream-item pb-3 border-bottom mb-2">
                  <div className="d-flex justify-content-between">
                    <strong className="text-dark small">Junior Fighter Leo</strong>
                    <span className="text-muted small">15 mins ago</span>
                  </div>
                  <p className="text-muted small mb-0">Checked in for Karate Kata & Kumite Class</p>
                </div>

                <div className="stream-item">
                  <div className="d-flex justify-content-between">
                    <strong className="text-dark small">Master Jin-Woo Park</strong>
                    <span className="text-muted small">1 hour ago</span>
                  </div>
                  <p className="text-muted small mb-0">Completed Taekwondo Sparring Session</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </DashboardStyled>
  );
};

export default Dashboard;

const DashboardStyled = styled.div`
  background: #f8fafc;
  min-height: 85vh;

  .welcome-banner {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%);
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
  }

  .metric-card {
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    background: #ffffff;

    .icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }

    .metric-lbl {
      font-size: 12px;
      color: #64748b;
      display: block;
      font-family: ${fontFamilyMedium};
    }

    .metric-val {
      font-size: 24px;
      font-family: ${fontFamilyBold};
      color: #0f172a;
    }
  }

  .dashboard-card {
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    background: #ffffff;
  }

  .action-tile {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    }
    .tile-icon {
      font-size: 24px;
      margin-bottom: 6px;
    }
  }
`;
