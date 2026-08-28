import React, { useState, useEffect, useRef } from "react";
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
import { base_url, attendance_qr_token_url, attendance_scan_qr_url } from "../../utils/api_urls";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../redux/store";

const QrCode = () => {
  const loginData = useAppSelector((state: RootState) => state.loginData?.data);
  const user = loginData?.userDetails;

  const [qrToken, setQrToken] = useState<string>("");
  const [qrImageUrl, setQrImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Scanner Kiosk Modal (Admin)
  const [showScanModal, setShowScanModal] = useState<boolean>(false);
  const [scannedTokenInput, setScannedTokenInput] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const fetchQrToken = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(`${base_url}${attendance_qr_token_url}`);
      const data = res.data?.data || res.data?.results;
      if (data) {
        setQrToken(data.token);
        setQrImageUrl(data.qrCodeUrl);
      }
    } catch (err) {
      toast.error("Failed to generate dynamic security QR code");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQrToken();
  }, []);

  const handleDownload = () => {
    if (!qrImageUrl) return;
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `MartialArts_Pass_${user?.id || 1}.png`;
    link.target = "_blank";
    link.click();
    toast.success("Member Pass QR Code downloaded!");
  };

  const handleVerifyScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedTokenInput.trim()) {
      toast.error("Please enter or scan a student QR token");
      return;
    }
    try {
      setVerifying(true);
      const res = await axios.post(`${base_url}${attendance_scan_qr_url}`, {
        qr_token: scannedTokenInput.trim(),
        branch_id: 1,
      });
      const data = res.data?.data || res.data?.results;
      setScanResult(data);
      toast.success(res.data?.responseMessage || "Attendance check-in verified!");
      setScannedTokenInput("");
    } catch (err: any) {
      toast.error(err?.response?.data?.responseMessage || "Invalid student pass or check-in error");
    } finally {
      setVerifying(false);
    }
  };

  const studentName = (user as any)?.userFirstName
    ? `${(user as any).userFirstName} ${(user as any).userLastName || ""}`
    : (user as any)?.firstName
    ? `${(user as any).firstName} ${(user as any).lastName || ""}`
    : "Martial Arts Student";

  return (
    <QrCodeStyled>
      <Head title="Member QR Check-in" />
      <div className="w-100 py-2">
        <div className="text-center mb-4">
          <h1 className="page-title">📱 Dojo Digital Check-In Pass</h1>
          <p className="page-subtitle">
            Scan your dynamic QR Code at the Dojo reception tablet or turnstile to log attendance.
          </p>
        </div>

        <Row className="justify-content-center">
          <Col lg={5} md={8} sm={12}>
            <Card className="qr-card text-center p-4">
              <div className="member-header mb-3">
                <div className="avatar-circle">🥋</div>
                <h3 className="member-name">{studentName}</h3>
                <span className="member-role">Rank: Active Practitioner • Member ID: #{user?.id || 1}</span>
              </div>

              {loading ? (
                <div className="py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <div className="qr-container my-3">
                  <img
                    src={
                      qrImageUrl ||
                      `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=MARTIAL_APP_USER_${user?.id || 1}_PASS&color=0f172a`
                    }
                    alt="Member Check-in QR Code"
                    className="qr-img"
                    style={{ width: 220, height: 220 }}
                  />
                  <p className="qr-timer mt-2">
                    ⏱ Token: <code className="small text-dark">{qrToken || "MARTIAL_APP_USER_PASS"}</code>
                  </p>
                </div>
              )}

              <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                <CustomButton
                  title="Download Pass"
                  clicked={handleDownload}
                  bgcolor={lightBlue3}
                  color={pureDark}
                  padding="8px 20px"
                  fontSize="14px"
                  fontFamily={fontFamilyBold}
                />
                <CustomButton
                  title={refreshing ? "Refreshing..." : "Refresh Code"}
                  clicked={fetchQrToken}
                  bgcolor="#e2e8f0"
                  color="#334155"
                  padding="8px 20px"
                  fontSize="14px"
                  fontFamily={fontFamilyBold}
                />
                <CustomButton
                  title="📷 Scanner Kiosk (Admin)"
                  clicked={() => {
                    setScanResult(null);
                    setShowScanModal(true);
                  }}
                  bgcolor={primaryColor}
                  color={whiteColor}
                  padding="8px 20px"
                  fontSize="14px"
                  fontFamily={fontFamilyBold}
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Admin Scanner Kiosk Modal */}
        <Modal show={showScanModal} onHide={() => setShowScanModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">🥋 Dojo Reception Scanner Kiosk</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleVerifyScan}>
            <Modal.Body className="p-4">
              <p className="text-muted small">
                Simulate barcode/QR laser scanner input or paste student token to log verified attendance.
              </p>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Scan / Enter QR Token</Form.Label>
                <Form.Control
                  placeholder="e.g. MARTIAL_APP_USER_1_TS_1787909601"
                  value={scannedTokenInput}
                  onChange={(e) => setScannedTokenInput(e.target.value)}
                  autoFocus
                />
              </Form.Group>

              {scanResult && (
                <div className="p-3 bg-success-subtle border border-success rounded-3 mt-3 text-start">
                  <h6 className="fw-bold text-success mb-1">✓ Check-in Confirmed!</h6>
                  <p className="mb-1 small"><strong>Student:</strong> {scanResult.studentName}</p>
                  <p className="mb-1 small"><strong>Total Dojo Attendance:</strong> {scanResult.totalAttendance} classes</p>
                  <p className="mb-0 small"><strong>Timestamp:</strong> {scanResult.checkInTime}</p>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setShowScanModal(false)}
              >
                Close
              </button>
              <CustomButton
                title={verifying ? "Verifying..." : "Verify & Check-In"}
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
      </div>
    </QrCodeStyled>
  );
};

export default QrCode;

const QrCodeStyled = styled.div`
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

  .qr-card {
    border-radius: 24px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    background: #ffffff;

    .avatar-circle {
      width: 56px;
      height: 56px;
      background: #eff6ff;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin-bottom: 10px;
    }

    .member-name {
      font-size: 20px;
      font-family: ${fontFamilyBold};
      color: #0f172a;
      margin: 0;
    }

    .member-role {
      font-size: 13px;
      color: #64748b;
    }

    .qr-container {
      background: #f8fafc;
      border-radius: 18px;
      padding: 20px;
      display: inline-block;
      border: 1px dashed #cbd5e1;

      .qr-img {
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      }

      .qr-timer {
        font-size: 12px;
        color: #94a3b8;
        margin-bottom: 0;
      }
    }
  }
`;
