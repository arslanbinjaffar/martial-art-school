import React, { useState } from "react";
import { Container, Row, Col, Card, Badge, Tab, Nav } from "react-bootstrap";
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

const Classes = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");
  const [bookedClasses, setBookedClasses] = useState<number[]>([]);

  const classList = [
    {
      id: 101,
      title: "Brazilian Jiu-Jitsu (BJJ) - Fundamentals",
      discipline: "BJJ",
      trainer: "Master Rodrigo Silva (3rd Dan Black Belt)",
      time: "07:00 AM - 08:30 AM",
      days: "Mon, Wed, Fri",
      level: "All Levels",
      capacity: "16 / 20 Enrolled",
      location: "Main Dojo - Mat A",
      tagColor: "#3b82f6",
    },
    {
      id: 102,
      title: "Muay Thai & Striking Conditioning",
      discipline: "MUAY_THAI",
      trainer: "Kru Somchai Thong",
      time: "09:00 AM - 10:30 AM",
      days: "Tue, Thu, Sat",
      level: "Intermediate / Advanced",
      capacity: "12 / 15 Enrolled",
      location: "Heavy Bag Arena - Cage 1",
      tagColor: "#ef4444",
    },
    {
      id: 103,
      title: "Shotokan Karate - Kata & Kumite",
      discipline: "KARATE",
      trainer: "Sensei Takeshi Yamamoto",
      time: "04:30 PM - 06:00 PM",
      days: "Mon, Wed, Fri",
      level: "White to Brown Belt",
      capacity: "18 / 25 Enrolled",
      location: "Traditional Tatami Hall",
      tagColor: "#f59e0b",
    },
    {
      id: 104,
      title: "Olympic Taekwondo - High Kicks & Sparring",
      discipline: "TAEKWONDO",
      trainer: "Master Jin-Woo Park",
      time: "06:15 PM - 07:45 PM",
      days: "Tue, Thu",
      level: "All Belts",
      capacity: "14 / 20 Enrolled",
      location: "Agility Dojo - Mat B",
      tagColor: "#10b981",
    },
    {
      id: 105,
      title: "Pro Boxing & Footwork Clinic",
      discipline: "BOXING",
      trainer: "Coach Marcus Evans (Former Golden Gloves)",
      time: "08:00 PM - 09:30 PM",
      days: "Mon, Wed, Thu",
      level: "All Levels",
      capacity: "10 / 12 Enrolled",
      location: "Boxing Ring Zone",
      tagColor: "#8b5cf6",
    },
  ];

  const filteredClasses =
    selectedDiscipline === "ALL"
      ? classList
      : classList.filter((c) => c.discipline === selectedDiscipline);

  const handleBook = (item: typeof classList[0]) => {
    if (bookedClasses.includes(item.id)) {
      setBookedClasses(bookedClasses.filter((id) => id !== item.id));
      toast.info(`Cancelled reservation for ${item.title}`);
    } else {
      setBookedClasses([...bookedClasses, item.id]);
      toast.success(`Booked ${item.title}! Check your Booking schedule.`);
    }
  };

  return (
    <ClassesStyled>
      <Head title="Class Schedule" />
      <Container fluid className="py-4 px-md-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h1 className="page-title">🥋 Dojo Class Schedule & Timetable</h1>
            <p className="page-subtitle mb-0">
              Browse daily martial arts sessions, master trainers, and reserve your training spot.
            </p>
          </div>

          <div className="filter-chips d-flex flex-wrap gap-2">
            {[
              { id: "ALL", label: "All Disciplines" },
              { id: "BJJ", label: "BJJ" },
              { id: "MUAY_THAI", label: "Muay Thai" },
              { id: "KARATE", label: "Karate" },
              { id: "TAEKWONDO", label: "Taekwondo" },
              { id: "BOXING", label: "Boxing" },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                className={`filter-btn ${selectedDiscipline === d.id ? "active" : ""}`}
                onClick={() => setSelectedDiscipline(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <Row className="g-4">
          {filteredClasses.map((item) => {
            const isBooked = bookedClasses.includes(item.id);

            return (
              <Col key={item.id} xl={4} lg={6} md={12}>
                <Card className="class-card">
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className="discipline-badge" style={{ backgroundColor: `${item.tagColor}15`, color: item.tagColor }}>
                        {item.discipline}
                      </span>
                      <span className="level-badge">{item.level}</span>
                    </div>

                    <h4 className="class-title">{item.title}</h4>
                    <p className="trainer-name">🥋 {item.trainer}</p>

                    <div className="class-details my-3">
                      <div className="detail-item">
                        <span className="detail-icon">⏰</span>
                        <div>
                          <span className="detail-label">Schedule</span>
                          <p className="detail-val mb-0">{item.time} ({item.days})</p>
                        </div>
                      </div>
                      <div className="detail-item mt-2">
                        <span className="detail-icon">📍</span>
                        <div>
                          <span className="detail-label">Facility</span>
                          <p className="detail-val mb-0">{item.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                      <span className="capacity-badge">{item.capacity}</span>
                      <CustomButton
                        title={isBooked ? "Reserved ✓" : "Book Class"}
                        clicked={() => handleBook(item)}
                        bgcolor={isBooked ? "#10b981" : lightBlue3}
                        color={isBooked ? whiteColor : pureDark}
                        padding="8px 20px"
                        fontSize="14px"
                        fontFamily={fontFamilyBold}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </ClassesStyled>
  );
};

export default Classes;

const ClassesStyled = styled.div`
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

  .filter-chips {
    .filter-btn {
      border: 1px solid #e2e8f0;
      background: #ffffff;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-family: ${fontFamilyMedium};
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;

      &.active {
        background: #0f172a;
        color: #ffffff;
        border-color: #0f172a;
      }
    }
  }

  .class-card {
    border-radius: 18px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    height: 100%;
    background: #ffffff;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
    }

    .discipline-badge {
      font-size: 12px;
      font-family: ${fontFamilyBold};
      padding: 4px 10px;
      border-radius: 8px;
    }

    .level-badge {
      font-size: 12px;
      background: #f1f5f9;
      color: #475569;
      padding: 4px 10px;
      border-radius: 20px;
    }

    .class-title {
      font-size: 17px;
      font-family: ${fontFamilyBold};
      color: #0f172a;
      margin-bottom: 4px;
    }

    .trainer-name {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 0;
    }

    .detail-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;

      .detail-icon {
        font-size: 16px;
      }

      .detail-label {
        font-size: 11px;
        color: #94a3b8;
        display: block;
      }

      .detail-val {
        font-size: 13px;
        color: #334155;
        font-family: ${fontFamilyMedium};
      }
    }

    .capacity-badge {
      font-size: 12px;
      color: #64748b;
    }
  }
`;
