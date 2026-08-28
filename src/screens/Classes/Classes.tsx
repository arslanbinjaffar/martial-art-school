import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Modal, Form, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";
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
import { base_url, classes_list_url, classes_book_url, classes_create_url } from "../../utils/api_urls";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../redux/store";

export type ClassItem = {
  id: number;
  title: string;
  discipline: string;
  level: string;
  instructor_name: string;
  days_of_week: string;
  start_time: string;
  end_time: string;
  room_location: string;
  max_capacity: number;
  enrolled_count: number;
  capacity_text: string;
  tag_color: string;
  is_active: boolean;
};

const Classes = () => {
  const [classList, setClassList] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");
  const [bookedClasses, setBookedClasses] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // New Class Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDiscipline, setNewDiscipline] = useState("BJJ");
  const [newLevel, setNewLevel] = useState("All Levels");
  const [newInstructor, setNewInstructor] = useState("Master Rodrigo Silva");
  const [newDays, setNewDays] = useState("Mon, Wed, Fri");
  const [newStartTime, setNewStartTime] = useState("07:00 AM");
  const [newEndTime, setNewEndTime] = useState("08:30 AM");
  const [newLocation, setNewLocation] = useState("Main Dojo - Mat A");
  const [newCapacity, setNewCapacity] = useState(20);

  const loginData = useAppSelector((state: RootState) => state.loginData?.data);
  const user = loginData?.userDetails;

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base_url}${classes_list_url}`);
      if (res.data?.data || res.data?.results) {
        setClassList(res.data?.data || res.data?.results);
      }
    } catch (err: any) {
      toast.error("Failed to load class schedule from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses =
    selectedDiscipline === "ALL"
      ? classList
      : classList.filter((c) => c.discipline === selectedDiscipline);

  const handleBook = async (item: ClassItem) => {
    try {
      const res = await axios.post(`${base_url}${classes_book_url}`, {
        class_id: item.id,
        booking_date: "Upcoming",
      });
      if (res.data?.responseCode === 200 || res.status === 200) {
        setBookedClasses([...bookedClasses, item.id]);
        toast.success(`Booked spot in ${item.title}! Check your Bookings.`);
        fetchClasses();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.responseMessage || "Failed to book class session");
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a class title");
      return;
    }
    try {
      setSubmitting(true);
      const res = await axios.post(`${base_url}${classes_create_url}`, {
        title: newTitle,
        discipline: newDiscipline,
        level: newLevel,
        instructor_name: newInstructor,
        days_of_week: newDays,
        start_time: newStartTime,
        end_time: newEndTime,
        room_location: newLocation,
        max_capacity: newCapacity,
        tag_color:
          newDiscipline === "BJJ"
            ? "#3b82f6"
            : newDiscipline === "MUAY_THAI"
            ? "#ef4444"
            : newDiscipline === "KARATE"
            ? "#f59e0b"
            : newDiscipline === "TAEKWONDO"
            ? "#10b981"
            : "#8b5cf6",
      });
      if (res.data?.responseCode === 200 || res.status === 200) {
        toast.success("New martial arts class created successfully!");
        setShowAddModal(false);
        setNewTitle("");
        fetchClasses();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.responseMessage || "Failed to create class");
    } finally {
      setSubmitting(false);
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
              Browse live martial arts sessions, master trainers, and reserve your training spot.
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center">
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

            <CustomButton
              title="+ Add New Class"
              clicked={() => setShowAddModal(true)}
              bgcolor={primaryColor}
              color={whiteColor}
              padding="8px 16px"
              fontSize="13px"
              fontFamily={fontFamilyBold}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Loading timetable from Dojo server...</p>
          </div>
        ) : (
          <Row className="g-4">
            {filteredClasses.map((item) => {
              const isBooked = bookedClasses.includes(item.id);

              return (
                <Col key={item.id} xl={4} lg={6} md={12}>
                  <Card className="class-card">
                    <Card.Body className="p-4 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span
                          className="discipline-badge"
                          style={{
                            backgroundColor: `${item.tag_color || "#3b82f6"}15`,
                            color: item.tag_color || "#3b82f6",
                          }}
                        >
                          {item.discipline}
                        </span>
                        <span className="level-badge">{item.level}</span>
                      </div>

                      <h4 className="class-title">{item.title}</h4>
                      <p className="trainer-name">🥋 {item.instructor_name}</p>

                      <div className="class-details my-3">
                        <div className="detail-item">
                          <span className="detail-icon">⏰</span>
                          <div>
                            <span className="detail-label">Schedule</span>
                            <p className="detail-val mb-0">
                              {item.start_time} - {item.end_time} ({item.days_of_week})
                            </p>
                          </div>
                        </div>
                        <div className="detail-item mt-2">
                          <span className="detail-icon">📍</span>
                          <div>
                            <span className="detail-label">Facility</span>
                            <p className="detail-val mb-0">{item.room_location}</p>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                        <span className="capacity-badge">{item.capacity_text || `${item.enrolled_count || 0} / ${item.max_capacity} Enrolled`}</span>
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
        )}

        {/* Add Class Modal for Admin */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">🥋 Schedule New Martial Arts Class</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCreateClass}>
            <Modal.Body className="p-4">
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-bold small">Class Title</Form.Label>
                    <Form.Control
                      placeholder="e.g. BJJ Advanced No-Gi & Leglocks"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold small">Discipline</Form.Label>
                    <Form.Select value={newDiscipline} onChange={(e) => setNewDiscipline(e.target.value)}>
                      <option value="BJJ">Brazilian Jiu-Jitsu (BJJ)</option>
                      <option value="MUAY_THAI">Muay Thai / Striking</option>
                      <option value="KARATE">Shotokan Karate</option>
                      <option value="TAEKWONDO">Olympic Taekwondo</option>
                      <option value="BOXING">Pro Boxing</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold small">Belt / Skill Level</Form.Label>
                    <Form.Select value={newLevel} onChange={(e) => setNewLevel(e.target.value)}>
                      <option value="All Levels">All Levels</option>
                      <option value="Beginner">Beginner (White/Yellow Belt)</option>
                      <option value="Intermediate">Intermediate (Green/Blue Belt)</option>
                      <option value="Advanced / Black Belt">Advanced (Brown/Black Belt)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold small">Master / Instructor Name</Form.Label>
                    <Form.Control
                      value={newInstructor}
                      onChange={(e) => setNewInstructor(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold small">Days of Week</Form.Label>
                    <Form.Control
                      placeholder="e.g. Mon, Wed, Fri"
                      value={newDays}
                      onChange={(e) => setNewDays(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold small">Start Time</Form.Label>
                    <Form.Control
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold small">End Time</Form.Label>
                    <Form.Control
                      value={newEndTime}
                      onChange={(e) => setNewEndTime(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold small">Max Capacity (Students)</Form.Label>
                    <Form.Control
                      type="number"
                      value={newCapacity}
                      onChange={(e) => setNewCapacity(Number(e.target.value))}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-bold small">Room / Mat Location</Form.Label>
                    <Form.Control
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <CustomButton
                title={submitting ? "Saving..." : "Create Class"}
                type="submit"
                bgcolor={primaryColor}
                color={whiteColor}
                padding="10px 24px"
                fontSize="14px"
                fontFamily={fontFamilyBold}
              />
            </Modal.Footer>
          </Form>
        </Modal>
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
