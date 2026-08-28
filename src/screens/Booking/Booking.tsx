import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
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

const Booking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get("tab") || "current";

  const [activeTab, setActiveTab] = useState<string>(currentTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "previous" || tab === "current") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const currentBookings = [
    {
      id: "BK-8021",
      classTitle: "Brazilian Jiu-Jitsu (BJJ) - Advanced Gi",
      instructor: "Master Rodrigo Silva",
      dateTime: "Today @ 05:30 PM",
      location: "Main Dojo - Mat A",
      status: "CONFIRMED",
      beltLevel: "Blue & Above",
    },
    {
      id: "BK-8024",
      classTitle: "Muay Thai Heavy Bag Conditioning",
      instructor: "Kru Somchai Thong",
      dateTime: "Tomorrow @ 09:00 AM",
      location: "Striking Cage 2",
      status: "CONFIRMED",
      beltLevel: "All Levels",
    },
    {
      id: "BK-8029",
      classTitle: "Karate Kumite & Sparring Clinic",
      instructor: "Sensei Takeshi Yamamoto",
      dateTime: "Friday @ 06:00 PM",
      location: "Tatami Ring 1",
      status: "PENDING_CHECKIN",
      beltLevel: "Green Belt+",
    },
  ];

  const previousBookings = [
    {
      id: "BK-7910",
      classTitle: "Olympic Taekwondo - High Kick Speed",
      instructor: "Master Jin-Woo Park",
      dateTime: "Aug 24, 2026 @ 06:15 PM",
      location: "Agility Dojo",
      status: "COMPLETED",
      beltLevel: "All Levels",
    },
    {
      id: "BK-7855",
      classTitle: "BJJ Open Mat & Live Submission Sparring",
      instructor: "Master Rodrigo Silva",
      dateTime: "Aug 20, 2026 @ 07:00 PM",
      location: "Main Dojo",
      status: "COMPLETED",
      beltLevel: "All Belts",
    },
    {
      id: "BK-7702",
      classTitle: "Boxing Footwork & Defense Fundamentals",
      instructor: "Coach Marcus Evans",
      dateTime: "Aug 15, 2026 @ 08:00 AM",
      location: "Boxing Ring Zone",
      status: "COMPLETED",
      beltLevel: "Beginner",
    },
  ];

  const handleCancel = (bookingId: string) => {
    toast.info(`Booking ${bookingId} has been cancelled.`);
  };

  const displayedBookings = activeTab === "current" ? currentBookings : previousBookings;

  return (
    <BookingStyled>
      <Head title="Class Bookings" />
      <Container fluid className="py-4 px-md-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h1 className="page-title">📅 Class Bookings & Reservations</h1>
            <p className="page-subtitle mb-0">
              Manage your upcoming martial arts sessions and view past training attendance.
            </p>
          </div>

          <div className="d-flex gap-2">
            <CustomButton
              title="+ Book New Class"
              clicked={() => navigate("/classes")}
              bgcolor={lightBlue3}
              color={pureDark}
              padding="8px 20px"
              fontSize="14px"
              fontFamily={fontFamilyBold}
            />
          </div>
        </div>

        <div className="tab-pills mb-4">
          <button
            type="button"
            className={`pill-btn ${activeTab === "current" ? "active" : ""}`}
            onClick={() => switchTab("current")}
          >
            Upcoming / Current ({currentBookings.length})
          </button>
          <button
            type="button"
            className={`pill-btn ${activeTab === "previous" ? "active" : ""}`}
            onClick={() => switchTab("previous")}
          >
            Previous Training History ({previousBookings.length})
          </button>
        </div>

        <Card className="booking-card">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Martial Arts Session</th>
                  <th>Instructor</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedBookings.map((bk) => (
                  <tr key={bk.id}>
                    <td className="fw-bold text-primary">{bk.id}</td>
                    <td>
                      <div className="fw-bold text-dark">{bk.classTitle}</div>
                      <small className="text-muted">{bk.beltLevel}</small>
                    </td>
                    <td>🥋 {bk.instructor}</td>
                    <td>{bk.dateTime}</td>
                    <td>📍 {bk.location}</td>
                    <td>
                      <span
                        className={`status-pill ${
                          bk.status === "CONFIRMED"
                            ? "confirmed"
                            : bk.status === "COMPLETED"
                            ? "completed"
                            : "pending"
                        }`}
                      >
                        {bk.status}
                      </span>
                    </td>
                    <td className="text-end">
                      {activeTab === "current" ? (
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={() => handleCancel(bk.id)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-rebook"
                          onClick={() => navigate("/classes")}
                        >
                          Rebook
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>
    </BookingStyled>
  );
};

export default Booking;

const BookingStyled = styled.div`
  min-height: 80vh;
  background: #f8fafc;

  .page-title {
    font-size: 28px;
    font-family: ${fontFamilyBold};
    color: #1e293b;
  }

  .page-subtitle {
    font-size: 15px;
    color: #64748b;
  }

  .tab-pills {
    display: inline-flex;
    background: #e2e8f0;
    padding: 4px;
    border-radius: 12px;

    .pill-btn {
      border: none;
      background: transparent;
      padding: 8px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-family: ${fontFamilyMedium};
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;

      &.active {
        background: #ffffff;
        color: #0f172a;
        font-family: ${fontFamilyBold};
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
      }
    }
  }

  .booking-card {
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    background: #ffffff;
    overflow: hidden;
  }

  .custom-table {
    thead th {
      background: #f8fafc;
      font-size: 13px;
      color: #475569;
      font-family: ${fontFamilyBold};
      padding: 16px 20px;
      border-bottom: 1px solid #e2e8f0;
    }

    tbody td {
      padding: 16px 20px;
      font-size: 14px;
      color: #334155;
      border-bottom: 1px solid #f1f5f9;
    }
  }

  .status-pill {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-family: ${fontFamilyBold};

    &.confirmed {
      background: #dcfce7;
      color: #15803d;
    }

    &.completed {
      background: #e0e7ff;
      color: #4338ca;
    }

    &.pending {
      background: #fef3c7;
      color: #b45309;
    }
  }

  .btn-cancel {
    border: 1px solid #fca5a5;
    background: #fff1f2;
    color: #e11d48;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #e11d48;
      color: #ffffff;
    }
  }

  .btn-rebook {
    border: 1px solid #cbd5e1;
    background: #ffffff;
    color: #475569;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;

    &:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
  }
`;
