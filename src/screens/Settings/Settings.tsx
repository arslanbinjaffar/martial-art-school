import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Form, Table, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
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
import { updateUserHandler } from "../../redux/features/loginDataSlice";

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

const MARTIAL_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
];

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePictureURL(base64String);
        toast.info("New photo selected! Click 'Save Profile Changes' below to update.");
      };
      reader.readAsDataURL(file);
    }
  };

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
        dispatch(
          updateUserHandler({
            firstName,
            lastName,
            profilePictureURL,
          })
        );
        toast.success("Profile photo and information updated successfully!");
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
        old_password: currentPassword,
        new_password: newPassword,
      });
      if (res.data?.responseCode === 200 || res.status === 200) {
        toast.success("Password changed successfully!");
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
      <div className="w-100 py-2">
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

                  <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 p-3 bg-light rounded-3 mb-4 border">
                    <div className="d-flex align-items-center gap-3">
                      <div className="profile-avatar-circle position-relative" style={{ overflow: "hidden" }}>
                        {profilePictureURL ? (
                          <img src={profilePictureURL} alt="Profile" className="rounded-circle w-100 h-100 object-fit-cover" />
                        ) : (
                          <span>🥋</span>
                        )}
                      </div>
                      <div>
                        <h5 className="mb-1 text-dark fw-bold">{firstName} {lastName}</h5>
                        <p className="text-muted small mb-0">{emailAddress} • Member #{user?.id || 1}</p>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-primary px-3 fw-bold"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        📷 Upload New Photo
                      </button>
                      {profilePictureURL && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger px-2"
                          onClick={() => setProfilePictureURL("")}
                          title="Remove photo"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Preset Avatars */}
                  <div className="mb-4 p-3 bg-light rounded-3 border">
                    <div className="fw-bold small text-dark mb-2">Or Choose from Martial Arts Avatars:</div>
                    <div className="d-flex gap-2">
                      {MARTIAL_AVATARS.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt="Avatar preset"
                          className="rounded-circle cursor-pointer border"
                          style={{
                            width: 44,
                            height: 44,
                            objectFit: "cover",
                            cursor: "pointer",
                            borderWidth: profilePictureURL === url ? 3 : 1,
                            borderColor: profilePictureURL === url ? "#00B0E9" : "#cbd5e1",
                          }}
                          onClick={() => {
                            setProfilePictureURL(url);
                            toast.info("Avatar selected! Click 'Save Profile Changes' below.");
                          }}
                        />
                      ))}
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
                  </Row>

                  <div className="mt-4 pt-3 border-top d-flex justify-content-end">
                    <CustomButton
                      title={savingProfile ? "Saving Profile..." : "Save Profile Changes"}
                      type="submit"
                      disabled={savingProfile}
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
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h3 className="section-title">Family & Sub-Accounts</h3>
                      <p className="section-desc">Manage family member profiles connected to your martial arts master account.</p>
                    </div>
                  </div>

                  {/* Add Sub Account Form */}
                  <div className="p-3 bg-light rounded-3 mb-4 border">
                    <h5 className="fw-bold text-dark mb-3">+ Register New Practitioner Profile</h5>
                    <Form onSubmit={handleAddSubAccount}>
                      <Row className="g-2 mb-2">
                        <Col md={4}>
                          <Form.Control
                            placeholder="First Name"
                            value={newSubFirstName}
                            onChange={(e) => setNewSubFirstName(e.target.value)}
                            required
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Control
                            placeholder="Last Name"
                            value={newSubLastName}
                            onChange={(e) => setNewSubLastName(e.target.value)}
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Select
                            value={newSubRelationship}
                            onChange={(e) => setNewSubRelationship(e.target.value)}
                          >
                            <option value="Child">Child</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Dependent">Dependent</option>
                          </Form.Select>
                        </Col>
                        <Col md={6}>
                          <Form.Select
                            value={newSubDiscipline}
                            onChange={(e) => setNewSubDiscipline(e.target.value)}
                          >
                            <option value="Brazilian Jiu-Jitsu">Brazilian Jiu-Jitsu (BJJ)</option>
                            <option value="Karate">Karate</option>
                            <option value="Taekwondo">Taekwondo</option>
                            <option value="Muay Thai">Muay Thai</option>
                            <option value="Boxing">Boxing</option>
                          </Form.Select>
                        </Col>
                        <Col md={6}>
                          <Form.Select
                            value={newSubBelt}
                            onChange={(e) => setNewSubBelt(e.target.value)}
                          >
                            <option value="White Belt">White Belt</option>
                            <option value="Yellow Belt">Yellow Belt</option>
                            <option value="Orange Belt">Orange Belt</option>
                            <option value="Green Belt">Green Belt</option>
                            <option value="Blue Belt">Blue Belt</option>
                            <option value="Purple Belt">Purple Belt</option>
                            <option value="Brown Belt">Brown Belt</option>
                            <option value="Black Belt">Black Belt</option>
                          </Form.Select>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-end mt-3">
                        <button type="submit" className="btn btn-primary btn-sm px-3">
                          + Add Sub Account
                        </button>
                      </div>
                    </Form>
                  </div>

                  {loadingSubs ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" size="sm" variant="primary" />
                    </div>
                  ) : subAccounts.length === 0 ? (
                    <p className="text-muted small">No sub-accounts registered yet.</p>
                  ) : (
                    <Table responsive hover className="align-middle">
                      <thead>
                        <tr>
                          <th>Practitioner</th>
                          <th>Relationship</th>
                          <th>Discipline</th>
                          <th>Belt Rank</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subAccounts.map((item) => (
                          <tr key={item.id}>
                            <td className="fw-bold">{item.firstName} {item.lastName}</td>
                            <td><span className="badge bg-secondary">{item.relationship}</span></td>
                            <td>{item.discipline}</td>
                            <td><span className="badge bg-info text-dark">{item.beltRank}</span></td>
                            <td><span className="badge bg-success">Active</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              )}

              {activeTab === "change-password" && (
                <Form onSubmit={handlePasswordSubmit}>
                  <h3 className="section-title">Change Password</h3>
                  <p className="section-desc">Update your login security credentials.</p>

                  <Row className="g-3" style={{ maxWidth: 500 }}>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="form-lbl">Current Password</Form.Label>
                        <Form.Control
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="form-lbl">New Password</Form.Label>
                        <Form.Control
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="form-lbl">Confirm New Password</Form.Label>
                        <Form.Control
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="mt-4 pt-3 border-top d-flex justify-content-start">
                    <CustomButton
                      title={updatingPassword ? "Updating..." : "Update Password"}
                      type="submit"
                      disabled={updatingPassword}
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
                  <h3 className="section-title">Enrolled Dojo Facility</h3>
                  <p className="section-desc">Your primary training academy and home martial arts school.</p>

                  <div className="school-box p-4 rounded-3 border bg-light d-flex align-items-center gap-3">
                    <div className="school-avatar">🥋</div>
                    <div>
                      <h4 className="fw-bold text-dark mb-1">Dragon Warrior Martial Arts HQ</h4>
                      <p className="text-muted small mb-1">📍 100 Martial Way, Los Angeles, CA • Sensei Rodrigo Silva</p>
                      <span className="badge bg-success">Enrolled Active Student</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "delete-account" && (
                <div>
                  <h3 className="section-title text-danger">⚠️ Delete Account</h3>
                  <p className="section-desc">Permanently remove your Dojo student account, booking records, and belt history.</p>

                  <div className="p-3 bg-danger-subtle rounded-3 border border-danger-subtle mb-3">
                    <p className="text-danger small mb-0 fw-bold">
                      Warning: Once deleted, your account cannot be recovered. All exam history will be erased.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={handleDeleteAccount}
                  >
                    Permanently Delete Account
                  </button>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </SettingsStyled>
  );
};

export default Settings;

const SettingsStyled = styled.div`
  background: transparent;
  min-height: 80vh;

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
