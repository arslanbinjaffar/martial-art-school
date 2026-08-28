import React, { useState, useEffect } from "react";
import { Card, Table, Spinner, Row, Col, Badge } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";
import Head from "../../components/Head/Head";
import CustomButton from "../../components/CustomButton/CustomButton";
import {
  fontFamilyBold,
  fontFamilyMedium,
  primaryColor,
  pureDark,
  whiteColor,
} from "../../components/GlobalStyle";
import {
  base_url,
  classes_my_bookings_url,
  classes_cancel_booking_url,
  webinars_list_url,
  webinars_register_url,
} from "../../utils/api_urls";

export type BookingItem = {
  id: string;
  classId: number;
  classTitle: string;
  instructor: string;
  dateTime: string;
  location: string;
  status: string;
  beltLevel: string;
};

export type WebinarItem = {
  id: number;
  title: string;
  instructor: string;
  discipline: string;
  date: string;
  duration: string;
  price: number;
  platform: string;
  joinUrl: string;
  spotsLeft: number;
  description: string;
  tagColor: string;
  isRecorded: boolean;
};

const Booking: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get("tab") || "current";

  const [activeTab, setActiveTab] = useState<string>(currentTab);
  const [upcomingBookings, setUpcomingBookings] = useState<BookingItem[]>([]);
  const [previousBookings, setPreviousBookings] = useState<BookingItem[]>([]);
  const [webinars, setWebinars] = useState<WebinarItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [registeringWebinarId, setRegisteringWebinarId] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base_url}${classes_my_bookings_url}`);
      const data = res.data?.data || res.data?.results;
      if (data) {
        setUpcomingBookings(data.upcoming || []);
        setPreviousBookings(data.previous || []);
      }
    } catch (err) {
      // quiet fallback
    } finally {
      setLoading(false);
    }
  };

  const fetchWebinars = async () => {
    try {
      const res = await axios.get(`${base_url}${webinars_list_url}`);
      const data = res.data?.data || res.data?.results;
      if (data) {
        setWebinars(data);
      }
    } catch (err) {
      // quiet fallback
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchWebinars();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleCancel = async (bookingId: string) => {
    if (window.confirm(`Are you sure you want to cancel booking ${bookingId}?`)) {
      try {
        const res = await axios.post(`${base_url}${classes_cancel_booking_url}`, {
          booking_id: bookingId,
        });
        if (res.data?.responseCode === 200 || res.status === 200) {
          toast.info(`Booking ${bookingId} has been cancelled.`);
          fetchBookings();
        }
      } catch (err: any) {
        toast.error("Failed to cancel booking.");
      }
    }
  };

  const handleRegisterWebinar = async (wbn: WebinarItem) => {
    try {
      setRegisteringWebinarId(wbn.id);
      const res = await axios.post(`${base_url}${webinars_register_url}`, {
        webinar_id: wbn.id,
      });
      if (res.data?.responseCode === 200 || res.status === 200) {
        toast.success(`Registered for "${wbn.title}"! Payment receipt logged in Wallet.`);
        const targetRoomId = (wbn as any).roomId || "live-bjj-masterclass-904";
        navigate(`/webinar/live/${targetRoomId}`);
      }
    } catch (err: any) {
      toast.error("Registration failed. Please verify your payment card in Wallet.");
    } finally {
      setRegisteringWebinarId(null);
    }
  };

  return (
    <BookingStyled>
      <Head title="Class Bookings & Webinars" />
      <div className="w-100 py-2">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h1 className="page-title">📅 Class Bookings & Masterclass Webinars</h1>
            <p className="page-subtitle mb-0">
              Manage your upcoming in-person Dojo classes, live online seminars, and attendance tracks.
            </p>
          </div>
          <div className="d-flex gap-2">
            <CustomButton
              title="💳 Dojo Wallet"
              clicked={() => navigate("/payment")}
              bgcolor="#0f172a"
              color={whiteColor}
              padding="10px 18px"
              fontSize="14px"
              fontFamily={fontFamilyBold}
            />
            <CustomButton
              title="+ Schedule New Class"
              clicked={() => navigate("/classes")}
              bgcolor={primaryColor}
              color={whiteColor}
              padding="10px 18px"
              fontSize="14px"
              fontFamily={fontFamilyBold}
            />
          </div>
        </div>

        {/* Tab Selection */}
        <div className="tabs-wrapper mb-4 d-flex gap-2 border-bottom pb-2">
          <button
            type="button"
            className={`tab-btn ${activeTab === "current" ? "active" : ""}`}
            onClick={() => switchTab("current")}
          >
            🥋 In-Person Bookings ({upcomingBookings.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "webinars" ? "active" : ""}`}
            onClick={() => switchTab("webinars")}
          >
            💻 Live Webinars & Masterclasses ({webinars.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "previous" ? "active" : ""}`}
            onClick={() => switchTab("previous")}
          >
            📜 Past Attendance History ({previousBookings.length})
          </button>
        </div>

        {/* Tab 1: Current In-Person Bookings */}
        {activeTab === "current" && (
          <Card className="content-card p-4">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="text-center py-5">
                <h4 className="fw-bold text-muted mb-2">No Active Reservations</h4>
                <p className="text-muted small mb-3">You haven't reserved any upcoming training sessions yet.</p>
                <CustomButton
                  title="Browse Class Timetable"
                  clicked={() => navigate("/classes")}
                  bgcolor={primaryColor}
                  color={whiteColor}
                  padding="10px 24px"
                  fontSize="14px"
                />
              </div>
            ) : (
              <Table responsive hover className="align-middle">
                <thead>
                  <tr>
                    <th>Class Session</th>
                    <th>Sensei / Instructor</th>
                    <th>Schedule</th>
                    <th>Dojo Location</th>
                    <th>Belt Level</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingBookings.map((b) => (
                    <tr key={b.id}>
                      <td><strong className="text-dark">{b.classTitle}</strong></td>
                      <td>{b.instructor}</td>
                      <td>{b.dateTime}</td>
                      <td><span className="badge bg-light text-dark border">{b.location}</span></td>
                      <td><span className="badge bg-info text-dark">{b.beltLevel}</span></td>
                      <td><span className="badge bg-success">Confirmed</span></td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleCancel(b.id)}
                        >
                          Cancel Spot
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        )}

        {/* Tab 2: Live Webinars & Online Masterclasses */}
        {activeTab === "webinars" && (
          <div>
            <div className="mb-3 p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold text-dark mb-1">🥋 Global Martial Arts Masterclasses</h5>
                <p className="text-muted small mb-0">
                  Broadcasted in Ultra-HD. Join interactive Q&As with world champions and receive recorded replays.
                </p>
              </div>
              <Badge bg="primary" className="px-3 py-2">HD WebRTC Live</Badge>
            </div>

            <Row className="g-4">
              {webinars.map((wbn) => (
                <Col key={wbn.id} xs={12} lg={4}>
                  <Card className="webinar-card h-100 p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge" style={{ background: wbn.tagColor }}>
                        {wbn.discipline}
                      </span>
                      <span className="price-tag fw-bold text-success">${wbn.price} USD</span>
                    </div>

                    <h4 className="webinar-title my-2">{wbn.title}</h4>
                    <p className="text-muted small mb-3">{wbn.description}</p>

                    <div className="webinar-meta mb-3 p-2 rounded-2 bg-light border">
                      <div className="small text-dark mb-1">
                        <strong>👨‍🏫 Instructor:</strong> {wbn.instructor}
                      </div>
                      <div className="small text-dark mb-1">
                        <strong>⏰ Time:</strong> {wbn.date} ({wbn.duration})
                      </div>
                      <div className="small text-dark">
                        <strong>🎟️ Spots Remaining:</strong> <span className="text-danger fw-bold">{wbn.spotsLeft} left</span>
                      </div>
                    </div>

                    <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                      <span className="text-muted small">📹 Recorded Replay Included</span>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm px-3 fw-bold"
                        disabled={registeringWebinarId === wbn.id}
                        onClick={() => handleRegisterWebinar(wbn)}
                      >
                        {registeringWebinarId === wbn.id ? "Registering..." : "Register & Join"}
                      </button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Tab 3: Past History */}
        {activeTab === "previous" && (
          <Card className="content-card p-4">
            {previousBookings.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">No past attendance records found.</p>
            ) : (
              <Table responsive hover className="align-middle">
                <thead>
                  <tr>
                    <th>Class Session</th>
                    <th>Instructor</th>
                    <th>Date & Time</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {previousBookings.map((b) => (
                    <tr key={b.id}>
                      <td className="fw-bold">{b.classTitle}</td>
                      <td>{b.instructor}</td>
                      <td>{b.dateTime}</td>
                      <td>{b.location}</td>
                      <td><span className="badge bg-secondary">{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        )}
      </div>
    </BookingStyled>
  );
};

export default Booking;

const BookingStyled = styled.div`
  width: 100%;

  .page-title {
    font-size: 24px;
    font-family: ${fontFamilyBold};
    color: #0f172a;
    margin-bottom: 4px;
  }

  .page-subtitle {
    font-size: 14px;
    color: #64748b;
  }

  .tabs-wrapper {
    .tab-btn {
      background: transparent;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-family: ${fontFamilyMedium};
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f1f5f9;
        color: #0f172a;
      }

      &.active {
        background: #0f172a;
        color: #ffffff;
        font-family: ${fontFamilyBold};
      }
    }
  }

  .content-card {
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    background: #ffffff;
  }

  .webinar-card {
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    background: #ffffff;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .price-tag {
      font-size: 16px;
    }

    .webinar-title {
      font-size: 17px;
      font-family: ${fontFamilyBold};
      color: #0f172a;
    }
  }
`;
