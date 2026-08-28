import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Table, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";
import Head from "../../components/Head/Head";
import CustomButton from "../../components/CustomButton/CustomButton";
import {
  fontFamilyBold,
  fontFamilyMedium,
  primaryColor,
  whiteColor,
} from "../../components/GlobalStyle";
import {
  base_url,
  change_password_url,
  sub_accounts_url,
  sub_accounts_create_url,
  update_user,
} from "../../utils/api_urls";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../redux/store";

export type SubAccountItem = {
  id: number;
  firstName: string;
  lastName: string;
  relationship: string;
  discipline: string;
  beltRank: string;
  dateOfBirth?: string;
  emergencyPhone?: string;
};

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const loginData = useAppSelector((state: RootState) => state.loginData?.data);
  const user = loginData?.userDetails;

  // Profile Form State
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [stateName, setStateName] = useState<string>("");
  const [country, setCountry] = useState<string>("United States");
  const [profilePictureURL, setProfilePictureURL] = useState<string>("");
  const [savingProfile, setSavingProfile] = useState<boolean>(false);

  // Sub Accounts State
  const [subAccounts, setSubAccounts] = useState<SubAccountItem[]>([]);
  const [loadingSubs, setLoadingSubs] = useState<boolean>(false);
  const [newSubFirstName, setNewSubFirstName] = useState("");
  const [newSubLastName, setNewSubLastName] = useState("");
  const [newSubRelationship, setNewSubRelationship] = useState("Child");
  const [newSubDiscipline, setNewSubDiscipline] = useState("Karate");
  const [newSubBelt, setNewSubBelt] = useState("White Belt");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFirstName((user as any).userFirstName || (user as any).firstName || "Sensei");
      setLastName((user as any).userLastName || (user as any).lastName || "Master");
      setEmailAddress((user as any).email || (user as any).emailAddress || "admin@martialarts.com");
      setPhoneNumber((user as any).phoneNumber || "+1234567890");
      setAddress((user as any).address || "100 Martial Way");
      setCity((user as any).city || "Los Angeles");
      setStateName((user as any).state || "CA");
      setCountry((user as any).country || "United States");
      setProfilePictureURL((user as any).profileImageURL || (user as any).profilePictureURL || "");
    }
  }, [user]);

  const fetchSubAccounts = async () => {
    try {
      setLoadingSubs(true);
      const res = await axios.get(`${base_url}${sub_accounts_url}`);
      const data = res.data?.data || res.data?.results;
      if (data) {
        setSubAccounts(data);
      }
    } catch (err) {
      // quiet fallback
    } finally {
      setLoadingSubs(false);
    }
  };

  useEffect(() => {
    fetchSubAccounts();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      if (tab === "my-profile") setActiveTab("profile");
      else setActiveTab(tab);
    }
  }, [searchParams]);

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await axios.post(`${base_url}${update_user}`, {
        userId: user?.id || 1,
        firstName,
        lastName,
        phoneNumber,
        address,
        city,
        state: stateName,
        country,
        profilePictureURL,
      });
      if (res.data?.responseCode === 200 || res.status === 200) {
        toast.success("Profile information updated successfully!");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.responseMessage || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddSubAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubFirstName.trim()) {
      toast.error("Please enter a first name for the sub-account");
      return;
    }
    try {
      const res = await axios.post(`${base_url}${sub_accounts_create_url}`, {
        firstName: newSubFirstName,
        lastName: newSubLastName,
        relationship: newSubRelationship,
        discipline: newSubDiscipline,
        beltRank: newSubBelt,
      });
      if (res.data?.responseCode === 200 || res.status === 200) {
        toast.success(`Added ${newSubFirstName} as a sub-account!`);
        setNewSubFirstName("");
        setNewSubLastName("");
        fetchSubAccounts();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.responseMessage || "Failed to add sub-account");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      setUpdatingPassword(true);
      const res = await axios.post(`${base_url}${change_password_url}`, {
        userId: user?.id || 1,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
      if (res.data?.responseCode === 200 || res.status === 200) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.responseMessage || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to permanently delete your Dojo account? This cannot be undone.")) {
      toast.info("Account deletion request submitted.");
    }
  };

  return (
    <SettingsStyled>
      <Head title="Account Settings" />
      <Container fluid className="py-4 px-md-4">
        <div className="mb-4">
          <h1 className="page-title">⚙️ Dojo & Account Settings</h1>
          <p className="page-subtitle">
            Manage your personal profile, sub-accounts, password credentials, and martial arts affiliation.
          </p>
        </div>

        <Row className="g-4">
          <Col lg={3} md={4}>
            <Card className="nav-card p-2">
              {[
                { id: "profile", label: "🥋 My Profile" },
                { id: "sub-account", label: "👤 Sub Account" },
                { id: "change-password", label: "🔒 Change Password" },
                { id: "enrolled-school", label: "🏢 Enrolled School" },
                { id: "delete-account", label: "⚠️ Delete Account" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`menu-btn ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => switchTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </Card>
          </Col>

          <Col lg={9} md={8}>
            <Card className="content-card p-4">
              {activeTab === "profile" && (
                <Form onSubmit={handleProfileSubmit}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h3 className="section-title">My Personal Profile</h3>
                      <p className="section-desc">View and update your personal martial artist identity and contact info.</p>
                    </div>
                    <span className="badge bg-primary px-3 py-2">Rank: 🥋 Active Fighter</span>
                  </div>

                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-4 border">
                    <div className="profile-avatar-circle">
                      {profilePictureURL ? (
                        <img src={profilePictureURL} alt="Profile" className="rounded-circle w-100 h-100 object-fit-cover" />
                      ) : (
                        <span>🥋</span>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1 text-dark fw-bold">{firstName} {lastName}</h5>
                      <p className="text-muted small mb-0">{emailAddress} • Member #{user?.id || 1}</p>
                    </div>
                  </div>

                  <Row className="g-3">
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
                          value={emailAddress}
                          disabled
                          className="bg-light"
                        />
                        <small className="text-success">✓ Verified Dojo Account</small>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-lbl">Phone Number</Form.Label>
                        <Form.Control
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="form-lbl">Street Address</Form.Label>
                        <Form.Control
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="form-lbl">City</Form.Label>
                        <Form.Control
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="form-lbl">State / Province</Form.Label>
                        <Form.Control
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="form-lbl">Country</Form.Label>
                        <Form.Control
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="form-lbl">Profile Avatar URL</Form.Label>
                        <Form.Control
                          placeholder="https://example.com/avatar.jpg"
                          value={profilePictureURL}
                          onChange={(e) => setProfilePictureURL(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="mt-4">
                    <CustomButton
                      title={savingProfile ? "Saving..." : "Save Profile Changes"}
                      type="submit"
                      bgcolor={primaryColor}
                      color={whiteColor}
                      padding="10px 24px"
                      fontSize="14px"
                      fontFamily={fontFamilyBold}
                    />
                  </div>
                </Form>
              )}

              {activeTab === "sub-account" && (
                <div>
                  <h3 className="section-title">Sub Account Profiles</h3>
                  <p className="section-desc">Manage family members, junior practitioners, and delegated trainers.</p>

                  <h5 className="fw-bold mt-4 mb-3">Add New Family / Child Member</h5>
                  <Form onSubmit={handleAddSubAccount}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="form-lbl">First Name</Form.Label>
                          <Form.Control
                            placeholder="e.g. Leo"
                            value={newSubFirstName}
                            onChange={(e) => setNewSubFirstName(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="form-lbl">Last Name</Form.Label>
                          <Form.Control
                            placeholder="e.g. Silva"
                            value={newSubLastName}
                            onChange={(e) => setNewSubLastName(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="form-lbl">Relationship</Form.Label>
                          <Form.Select
                            value={newSubRelationship}
                            onChange={(e) => setNewSubRelationship(e.target.value)}
                          >
                            <option value="Child">Child</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Dependent">Dependent</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="form-lbl">Discipline</Form.Label>
                          <Form.Select
                            value={newSubDiscipline}
                            onChange={(e) => setNewSubDiscipline(e.target.value)}
                          >
                            <option value="Karate">Shotokan Karate</option>
                            <option value="BJJ">Brazilian Jiu-Jitsu</option>
                            <option value="Taekwondo">Olympic Taekwondo</option>
                            <option value="Boxing">Boxing</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="form-lbl">Current Belt Rank</Form.Label>
                          <Form.Select
                            value={newSubBelt}
                            onChange={(e) => setNewSubBelt(e.target.value)}
                          >
                            <option value="White Belt">White Belt</option>
                            <option value="Yellow Belt">Yellow Belt</option>
                            <option value="Orange Belt">Orange Belt</option>
                            <option value="Green Belt">Green Belt</option>
                            <option value="Blue Belt">Blue Belt</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="mt-3">
                      <CustomButton
                        title="+ Add Sub-Account"
                        type="submit"
                        bgcolor={primaryColor}
                        color={whiteColor}
                        padding="8px 20px"
                        fontSize="14px"
                        fontFamily={fontFamilyBold}
                      />
                    </div>
                  </Form>

                  <hr className="my-4" />

                  <h5 className="fw-bold mb-3">Linked Family Profiles ({subAccounts.length})</h5>
                  {loadingSubs ? (
                    <Spinner animation="border" size="sm" />
                  ) : subAccounts.length === 0 ? (
                    <p className="text-muted small">No sub-accounts registered yet.</p>
                  ) : (
                    <div className="table-responsive">
                      <Table hover className="align-middle">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Relationship</th>
                            <th>Discipline</th>
                            <th>Rank</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subAccounts.map((s) => (
                            <tr key={s.id}>
                              <td className="fw-bold text-dark">{s.firstName} {s.lastName}</td>
                              <td><span className="badge bg-light text-dark border">{s.relationship}</span></td>
                              <td>{s.discipline}</td>
                              <td>🥋 {s.beltRank}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "change-password" && (
                <Form onSubmit={handlePasswordSubmit}>
                  <h3 className="section-title">Change Password</h3>
                  <p className="section-desc">Keep your Dojo account secure with a strong password.</p>

                  <div className="mt-3" style={{ maxWidth: 500 }}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-lbl">Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="form-lbl">New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="form-lbl">Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <CustomButton
                      title={updatingPassword ? "Updating..." : "Update Password"}
                      type="submit"
                      bgcolor={primaryColor}
                      color={whiteColor}
                      padding="10px 24px"
                      fontSize="14px"
                      fontFamily={fontFamilyBold}
                    />
                  </div>
                </Form>
              )}

              {activeTab === "enrolled-school" && (
                <div>
                  <h3 className="section-title">Enrolled Martial Arts School</h3>
                  <p className="section-desc">Details of your active Dojo affiliation, coaches, and grading register.</p>

                  <div className="school-box p-4 mt-3 rounded-3 border">
                    <div className="d-flex align-items-center gap-3">
                      <div className="school-avatar">🥋</div>
                      <div>
                        <h4 className="mb-1 text-dark fw-bold">Dragon Warrior Martial Arts Academy</h4>
                        <p className="text-muted mb-0">Main Headquarters Dojo • Branch ID #001</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row g-3 text-muted small">
                      <div className="col-sm-6">📍 <strong>Address:</strong> 104 Martial Arts Blvd, Los Angeles, CA</div>
                      <div className="col-sm-6">📞 <strong>Contact:</strong> +1 (415) 555-1234</div>
                      <div className="col-sm-6">🥋 <strong>Disciplines:</strong> Karate, BJJ, Muay Thai, Taekwondo</div>
                      <div className="col-sm-6">⭐ <strong>Status:</strong> Active Enrolled Student</div>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                      <a
                        href="https://maps.google.com/?q=Los+Angeles+CA"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-primary btn-sm px-3"
                      >
                        📍 Get Directions
                      </a>
                      <a
                        href="tel:+14155551234"
                        className="btn btn-outline-secondary btn-sm px-3"
                      >
                        📞 Call Dojo
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "delete-account" && (
                <div>
                  <h3 className="section-title text-danger">⚠️ Danger Zone: Delete Account</h3>
                  <p className="section-desc">Once deleted, all your belt history, booking credits, and payments will be removed.</p>

                  <div className="p-3 bg-light rounded-3 border border-danger-subtle mt-3">
                    <p className="mb-3 text-dark small">
                      Please confirm that you want to permanently close your martial arts student / teacher account.
                    </p>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm px-3"
                      onClick={handleDeleteAccount}
                    >
                      Permanently Delete My Account
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </SettingsStyled>
  );
};

export default Settings;

const SettingsStyled = styled.div`
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

  .nav-card {
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    background: #ffffff;

    .menu-btn {
      border: none;
      background: transparent;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 14px;
      font-family: ${fontFamilyMedium};
      color: #64748b;
      text-align: left;
      cursor: pointer;
      width: 100%;
      margin-bottom: 4px;
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

    .section-title {
      font-size: 20px;
      font-family: ${fontFamilyBold};
      color: #0f172a;
      margin-bottom: 4px;
    }

    .section-desc {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 16px;
    }

    .form-lbl {
      font-size: 13px;
      font-family: ${fontFamilyMedium};
      color: #475569;
    }

    .profile-avatar-circle {
      width: 56px;
      height: 56px;
      background: #eff6ff;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
    }

    .school-box {
      background: #f8fafc;
      .school-avatar {
        font-size: 32px;
      }
    }
  }
`;
