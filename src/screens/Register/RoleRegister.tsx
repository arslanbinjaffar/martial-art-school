import React, { useState } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
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
  whiteColor,
  pureDark,
  tertiaryBlue,
} from "../../components/GlobalStyle";
import { base_url, signup_url } from "../../utils/api_urls";

type RoleType = "school" | "student" | "parent";

const RoleRegister: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<RoleType>("student");

  // Common fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // School Owner specific fields
  const [academyName, setAcademyName] = useState("");
  const [disciplines, setDisciplines] = useState<string[]>(["BJJ", "Muay Thai"]);
  const [taxId, setTaxId] = useState("");
  const [facilityAddress, setFacilityAddress] = useState("");

  // Student specific fields
  const [homeDojo, setHomeDojo] = useState("Dragon Warrior Martial Arts HQ");
  const [studentDiscipline, setStudentDiscipline] = useState("Brazilian Jiu-Jitsu");
  const [currentBeltRank, setCurrentBeltRank] = useState("White Belt");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [waiverAccepted, setWaiverAccepted] = useState(false);

  // Parent specific fields
  const [children, setChildren] = useState([
    { name: "", dob: "", belt: "White Belt", discipline: "Karate" },
  ]);

  const handleAddChild = () => {
    setChildren([...children, { name: "", dob: "", belt: "White Belt", discipline: "Karate" }]);
  };

  const handleRemoveChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const handleChildChange = (index: number, field: string, val: string) => {
    const updated = [...children];
    (updated[index] as any)[field] = val;
    setChildren(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !emailAddress || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (selectedRole === "student" && !waiverAccepted) {
      toast.error("Please accept the liability and injury waiver.");
      return;
    }

    try {
      setLoading(true);
      const roleId = selectedRole === "school" ? 2 : selectedRole === "parent" ? 3 : 1;
      
      const payload: any = {
        firstName,
        lastName,
        emailAddress,
        phoneNumber: phoneNumber || "+1234567890",
        password,
        roleId,
        channel: "Web",
        address: facilityAddress || "100 Martial Way",
        city: "Los Angeles",
        state: "CA",
      };

      const res = await axios.post(`${base_url}${signup_url}`, payload);
      if (res.data?.responseCode === 200 || res.status === 200) {
        toast.success(
          `Welcome to Dojo OS! Registered successfully as ${
            selectedRole === "school" ? "School Owner" : selectedRole === "parent" ? "Parent & Family" : "Practitioner Fighter"
          }.`
        );
        navigate("/login");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.responseMessage || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleRegisterStyled>
      <Head title="Role Registration - Martial Arts Platform" />
      <div className="container py-4">
        {/* Header Branding */}
        <div className="text-center mb-4">
          <h1 className="brand-heading">🥋 Martial Arts OS</h1>
          <p className="brand-sub">Join the global combat academy network. Select your account type to get started.</p>
        </div>

        {/* 3 Role Selection Cards */}
        <Row className="g-3 mb-4 justify-content-center">
          <Col md={4} sm={12}>
            <div
              className={`role-card p-3 rounded-4 border text-center cursor-pointer ${
                selectedRole === "school" ? "active" : ""
              }`}
              onClick={() => setSelectedRole("school")}
            >
              <div className="role-icon">🏢</div>
              <h4 className="role-title">School Owner / Sensei</h4>
              <p className="role-desc">Manage a Dojo, create branch facilities, schedule classes, and receive student dues.</p>
              {selectedRole === "school" && <span className="badge bg-primary px-3 py-1">Selected</span>}
            </div>
          </Col>

          <Col md={4} sm={12}>
            <div
              className={`role-card p-3 rounded-4 border text-center cursor-pointer ${
                selectedRole === "student" ? "active" : ""
              }`}
              onClick={() => setSelectedRole("student")}
            >
              <div className="role-icon">🥋</div>
              <h4 className="role-title">Student / Fighter</h4>
              <p className="role-desc">Book class spots, track belt progression radar, join live seminars, and scan QR pass.</p>
              {selectedRole === "student" && <span className="badge bg-primary px-3 py-1">Selected</span>}
            </div>
          </Col>

          <Col md={4} sm={12}>
            <div
              className={`role-card p-3 rounded-4 border text-center cursor-pointer ${
                selectedRole === "parent" ? "active" : ""
              }`}
              onClick={() => setSelectedRole("parent")}
            >
              <div className="role-icon">👨‍👩‍👧</div>
              <h4 className="role-title">Parent / Family</h4>
              <p className="role-desc">Manage multiple children's martial arts training, belt exams, and unified billing.</p>
              {selectedRole === "parent" && <span className="badge bg-primary px-3 py-1">Selected</span>}
            </div>
          </Col>
        </Row>

        {/* Dynamic Form */}
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <Card className="form-card p-4 rounded-4 shadow-sm border">
              <h3 className="section-title mb-1">
                {selectedRole === "school" && "🏢 Register Your Martial Arts Academy"}
                {selectedRole === "student" && "🥋 Practitioner Fighter Registration"}
                {selectedRole === "parent" && "👨‍👩‍👧 Parent & Family Account Registration"}
              </h3>
              <p className="text-muted small mb-4">Fill in your information to set up your verified account.</p>

              <Form onSubmit={handleSubmit}>
                {/* School Owner Fields */}
                {selectedRole === "school" && (
                  <div className="mb-4 p-3 bg-light rounded-3 border">
                    <h5 className="fw-bold text-dark mb-3">Dojo Academy Information</h5>
                    <Row className="g-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="form-lbl">Academy / Business Name</Form.Label>
                          <Form.Control
                            placeholder="e.g. Dragon Warrior Martial Arts HQ"
                            value={academyName}
                            onChange={(e) => setAcademyName(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="form-lbl">Business Tax ID / EIN</Form.Label>
                          <Form.Control
                            placeholder="XX-XXXXXXX"
                            value={taxId}
                            onChange={(e) => setTaxId(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="form-lbl">Facility Address</Form.Label>
                          <Form.Control
                            placeholder="100 Martial Way, Los Angeles"
                            value={facilityAddress}
                            onChange={(e) => setFacilityAddress(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Student Specific Fields */}
                {selectedRole === "student" && (
                  <div className="mb-4 p-3 bg-light rounded-3 border">
                    <h5 className="fw-bold text-dark mb-3">Martial Arts Background</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="form-lbl">Primary Discipline</Form.Label>
                          <Form.Select
                            value={studentDiscipline}
                            onChange={(e) => setStudentDiscipline(e.target.value)}
                          >
                            <option value="Brazilian Jiu-Jitsu">Brazilian Jiu-Jitsu (BJJ)</option>
                            <option value="Muay Thai">Muay Thai Kickboxing</option>
                            <option value="Karate">Karate (Shotokan / Kyokushin)</option>
                            <option value="Taekwondo">Taekwondo</option>
                            <option value="Boxing">Boxing</option>
                            <option value="Judo">Judo</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="form-lbl">Current Belt Rank</Form.Label>
                          <Form.Select
                            value={currentBeltRank}
                            onChange={(e) => setCurrentBeltRank(e.target.value)}
                          >
                            <option value="White Belt">White Belt (Novice)</option>
                            <option value="Yellow Belt">Yellow Belt</option>
                            <option value="Orange Belt">Orange Belt</option>
                            <option value="Green Belt">Green Belt</option>
                            <option value="Blue Belt">Blue Belt</option>
                            <option value="Purple Belt">Purple Belt</option>
                            <option value="Brown Belt">Brown Belt</option>
                            <option value="Black Belt">Black Belt</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="form-lbl">Emergency Contact Name & Phone</Form.Label>
                          <Form.Control
                            placeholder="e.g. Maria Silva (+1 555-0199)"
                            value={emergencyContact}
                            onChange={(e) => setEmergencyContact(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Parent Specific Fields */}
                {selectedRole === "parent" && (
                  <div className="mb-4 p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold text-dark mb-0">Child Practitioner Dependents</h5>
                      <Button variant="outline-primary" size="sm" onClick={handleAddChild}>
                        + Add Child
                      </Button>
                    </div>

                    {children.map((child, idx) => (
                      <div key={idx} className="p-2 mb-2 bg-white rounded-2 border">
                        <Row className="g-2 align-items-center">
                          <Col md={4}>
                            <Form.Control
                              placeholder="Child Full Name"
                              value={child.name}
                              onChange={(e) => handleChildChange(idx, "name", e.target.value)}
                              required
                            />
                          </Col>
                          <Col md={3}>
                            <Form.Control
                              type="date"
                              value={child.dob}
                              onChange={(e) => handleChildChange(idx, "dob", e.target.value)}
                            />
                          </Col>
                          <Col md={2}>
                            <Form.Select
                              value={child.discipline}
                              onChange={(e) => handleChildChange(idx, "discipline", e.target.value)}
                            >
                              <option value="Karate">Karate</option>
                              <option value="BJJ">BJJ</option>
                              <option value="Taekwondo">Taekwondo</option>
                            </Form.Select>
                          </Col>
                          <Col md={2}>
                            <Form.Select
                              value={child.belt}
                              onChange={(e) => handleChildChange(idx, "belt", e.target.value)}
                            >
                              <option value="White Belt">White</option>
                              <option value="Yellow Belt">Yellow</option>
                              <option value="Orange Belt">Orange</option>
                              <option value="Green Belt">Green</option>
                            </Form.Select>
                          </Col>
                          <Col md={1} className="text-end">
                            {children.length > 1 && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveChild(idx)}
                              >
                                ✕
                              </Button>
                            )}
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </div>
                )}

                {/* Common Personal Info Fields */}
                <h5 className="fw-bold text-dark mb-3">Personal & Security Information</h5>
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-lbl">First Name</Form.Label>
                      <Form.Control
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-lbl">Last Name</Form.Label>
                      <Form.Control
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-lbl">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-lbl">Phone Number</Form.Label>
                      <Form.Control
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-lbl">Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-lbl">Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Liability Waiver Checkbox */}
                {selectedRole === "student" && (
                  <div className="mb-4 p-3 bg-light rounded-3 border">
                    <Form.Check
                      type="checkbox"
                      id="waiver-check"
                      checked={waiverAccepted}
                      onChange={(e) => setWaiverAccepted(e.target.checked)}
                      label={
                        <span className="small text-dark">
                          I agree to the <strong>Martial Arts Liability & Medical Release Waiver</strong>. I understand combat training involves physical contact and assume full responsibility.
                        </span>
                      }
                    />
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                  <Link to="/login" className="small text-decoration-none">
                    Already have an account? <strong>Log In</strong>
                  </Link>
                  <CustomButton
                    title={loading ? "Creating Account..." : "Create Account"}
                    type="submit"
                    disabled={loading}
                    bgcolor={primaryColor}
                    color={whiteColor}
                    padding="12px 28px"
                    fontSize="15px"
                    fontFamily={fontFamilyBold}
                  />
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </RoleRegisterStyled>
  );
};

export default RoleRegister;

const RoleRegisterStyled = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 30px 0;

  .brand-heading {
    font-size: 32px;
    font-family: ${fontFamilyBold};
    color: #0f172a;
  }

  .brand-sub {
    font-size: 15px;
    color: #64748b;
  }

  .role-card {
    background: #ffffff;
    border: 2px solid #e2e8f0;
    transition: all 0.2s ease;

    &:hover {
      border-color: ${primaryColor};
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 176, 233, 0.12);
    }

    &.active {
      border-color: ${primaryColor};
      background: ${tertiaryBlue};
      box-shadow: 0 8px 24px rgba(0, 176, 233, 0.15);
    }

    .role-icon {
      font-size: 36px;
      margin-bottom: 8px;
    }

    .role-title {
      font-size: 17px;
      font-family: ${fontFamilyBold};
      color: #0f172a;
      margin-bottom: 4px;
    }

    .role-desc {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 8px;
    }
  }

  .form-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
  }

  .section-title {
    font-size: 22px;
    font-family: ${fontFamilyBold};
    color: #0f172a;
  }

  .form-lbl {
    font-size: 13px;
    font-family: ${fontFamilyMedium};
    color: #334155;
    margin-bottom: 4px;
  }
`;
