import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
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

const QrCode = () => {
  const loginData = useAppSelector((state: RootState) => state.loginData?.data);
  const user = loginData?.userDetails;

  const handleDownload = () => {
    toast.success("Member Pass QR Code downloaded!");
  };

  const handleRefresh = () => {
    toast.info("Generated new dynamic security check-in token.");
  };

  return (
    <QrCodeStyled>
      <Head title="Member QR Check-in" />
      <Container fluid className="py-4 px-md-4">
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
                <h3 className="member-name">
                  {(user as any)?.userFirstName
                    ? `${(user as any).userFirstName} ${(user as any).userLastName || ""}`
                    : (user as any)?.firstName
                    ? `${(user as any).firstName} ${(user as any).lastName || ""}`
                    : "Martial Arts Student"}
                </h3>
                <span className="member-role">Rank: Black Belt Candidate • Dojo ID: #MA-9482</span>
              </div>

              <div className="qr-container my-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=MARTIAL_APP_USER_${user?.id || 1}_CHECKIN_${Date.now()}&color=0f172a`}
                  alt="Member Check-in QR Code"
                  className="qr-img"
                />
                <p className="qr-timer mt-2">⏱ Dynamic Code refreshes automatically</p>
              </div>

              <div className="d-flex justify-content-center gap-2 mt-3">
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
                  title="Refresh Code"
                  clicked={handleRefresh}
                  bgcolor="#e2e8f0"
                  color="#334155"
                  padding="8px 20px"
                  fontSize="14px"
                  fontFamily={fontFamilyBold}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
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
