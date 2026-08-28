import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
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
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../redux/store";

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "sub-account";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const loginData = useAppSelector((state: RootState) => state.loginData?.data);
  const user = loginData?.userDetails;

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
            Manage your sub-accounts, change password credentials, and configure martial arts enrollment.
          </p>
        </div>

        <Row className="g-4">
          <Col lg={3} md={4}>
            <Card className="nav-card p-2">
              {[
                { id: "sub-account", label: "👤 Sub Account" },
                { id: "change-password", label: "🔒 Change Password" },
                { id: "enrolled-school", label: "🥋 Enrolled School" },
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
              {activeTab === "sub-account" && (
                <div>
                  <h3 className="section-title">Sub Account Profile</h3>
                  <p className="section-desc">Manage family members, junior practitioners, and delegated trainers.</p>

                  <Row className="g-3 mt-2">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-lbl">First Name</Form.Label>
                        <Form.Control
                          defaultValue={(user as any)?.userFirstName || (user as any)?.firstName || "Arslan"}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-lbl">Last Name</Form.Label>
                        <Form.Control
                          defaultValue={(user as any)?.userLastName || (user as any)?.lastName || "bin Jaffar"}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-lbl">Email Address</Form.Label>
                        <Form.Control
                          defaultValue={(user as any)?.email || (user as any)?.emailAddress || "user@martialarts.com"}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-lbl">Phone Number</Form.Label>
                        <Form.Control
                          defaultValue={(user as any)?.phoneNumber || "+1 555-0199"}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="mt-4">
                    <CustomButton
                      title="Save Changes"
                      clicked={() => toast.success("Sub-account details saved!")}
                      bgcolor={lightBlue3}
                      color={pureDark}
                      padding="8px 24px"
                      fontSize="14px"
                      fontFamily={fontFamilyBold}
                    />
                  </div>
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
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="form-lbl">New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="form-lbl">Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Form.Group>

                    <CustomButton
                      title="Update Password"
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

                  <div className="school-box p-3 mt-3 rounded-3 border">
                    <div className="d-flex align-items-center gap-3">
                      <div className="school-avatar">🥋</div>
                      <div>
                        <h4 className="mb-1 text-dark">Dragon Warrior Martial Arts Academy</h4>
                        <p className="text-muted mb-0">Main Headquarters Dojo • Branch ID #001</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row g-2 text-muted small">
                      <div className="col-sm-6">📍 <strong>Address:</strong> 104 Martial Arts Blvd, Lahore</div>
                      <div className="col-sm-6">📞 <strong>Contact:</strong> +92 341 9789822</div>
                      <div className="col-sm-6">🥋 <strong>Disciplines:</strong> Karate, BJJ, Muay Thai</div>
                      <div className="col-sm-6">⭐ <strong>Status:</strong> Active Enrolled Student</div>
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

    .school-box {
      background: #f8fafc;
      .school-avatar {
        font-size: 32px;
      }
    }
  }
`;
