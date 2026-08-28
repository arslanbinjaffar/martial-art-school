import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Input, Button, Tag, Avatar, Badge, Space, Alert } from "antd";
import {
  VideoCameraOutlined,
  SendOutlined,
  UserOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  DesktopOutlined,
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import Head from "../../components/Head/Head";
import {
  fontFamilyBold,
  fontFamilyMedium,
  primaryColor,
  pureDark,
  whiteColor,
} from "../../components/GlobalStyle";
import { base_url, conferencing_get_room_url, conferencing_chat_url } from "../../utils/api_urls";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../redux/store";

const LiveWebinarRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const loginData = useAppSelector((state: RootState) => state.loginData?.data);
  const user = loginData?.userDetails;

  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base_url}${conferencing_get_room_url}/${roomId || "live-bjj-masterclass-904"}`);
      const data = res.data?.data;
      if (data) {
        setRoom(data);
        setChatMessages(data.chatMessages || []);
      }
    } catch (err) {
      toast.error("Failed to load live video room.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [roomId]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const senderName = user?.userFirstName
      ? `${user.userFirstName} ${user.userLastName || ""}`
      : "Alex Fighter";

    const newMsg = {
      id: Date.now().toString(),
      sender: senderName,
      role: "Student",
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMsg("");

    try {
      await axios.post(`${base_url}${conferencing_chat_url}`, {
        room_id: roomId || "live-bjj-masterclass-904",
        sender_name: senderName,
        message: newMsg.text,
        sender_role: "Student",
      });
    } catch (err) {
      // quiet fallback
    }
  };

  return (
    <WebinarRoomStyled>
      <Head title={`${room?.title || "Live Masterclass"} - Dojo Live HD`} />

      {/* Top Header */}
      <div className="room-topbar d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-3">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/booking?tab=webinars")}>
            Back to Bookings
          </Button>
          <div>
            <div className="d-flex align-items-center gap-2">
              <Badge status="processing" color="red" />
              <span className="fw-bold text-danger small">LIVE STREAMING</span>
              <Tag color="blue">{room?.provider || "Zoom & WebRTC Hybrid"}</Tag>
            </div>
            <h3 className="room-title mb-0">{room?.title || "🥋 BJJ Guard Retention & Inversions Masterclass"}</h3>
          </div>
        </div>

        <Space>
          <Button
            type="primary"
            style={{ backgroundColor: "#2D8CFF", borderColor: "#2D8CFF" }}
            onClick={() => window.open(room?.zoomMeetingId ? `https://zoom.us/j/${room.zoomMeetingId}` : "https://zoom.us", "_blank")}
          >
            Open in Zoom App
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.info("Live room link copied to clipboard!");
            }}
            icon={<ShareAltOutlined />}
          >
            Share Room
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {/* Left Side: Video Player & Stream Controls */}
        <Col xs={24} lg={16}>
          <Card className="video-card p-0" bordered={false}>
            {/* Live Video Canvas */}
            <div className="video-viewport position-relative">
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                autoPlay
                loop
                muted={isMuted}
                controls
                className="w-100 rounded-top"
                style={{ maxHeight: 480, objectFit: "cover", background: "#000" }}
              />

              {/* Watermark overlay */}
              <div className="video-overlay-badge position-absolute top-0 start-0 m-3">
                <Tag color="red" className="px-3 py-1 fw-bold">
                  🔴 LIVE 1080p 60FPS
                </Tag>
              </div>

              <div className="video-overlay-instructor position-absolute bottom-0 start-0 m-3 p-2 rounded-3 bg-dark bg-opacity-75 text-white">
                <div className="fw-bold small">Sensei Rodrigo Silva (4th Degree Black Belt)</div>
                <div className="text-light text-opacity-75" style={{ fontSize: 11 }}>
                  Dojo Live Studio Mat A • 42 Active Participants
                </div>
              </div>
            </div>

            {/* Conference Action Controls */}
            <div className="p-3 bg-dark d-flex justify-content-between align-items-center rounded-bottom text-white">
              <Space size="middle">
                <Button
                  shape="circle"
                  type={isMuted ? "primary" : "default"}
                  danger={isMuted}
                  icon={isMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
                  onClick={() => setIsMuted(!isMuted)}
                />
                <Button
                  shape="circle"
                  type={isVideoOff ? "primary" : "default"}
                  danger={isVideoOff}
                  icon={<VideoCameraOutlined />}
                  onClick={() => setIsVideoOff(!isVideoOff)}
                />
                <Button shape="circle" icon={<DesktopOutlined />} onClick={() => toast.info("Screen sharing initiated")} />
              </Space>

              <div className="d-flex align-items-center gap-2">
                <Tag color="gold">Passcode: {room?.zoomPasscode || "OSS2026"}</Tag>
                <Tag color="cyan">Meeting ID: {room?.zoomMeetingId || "982-411-0982"}</Tag>
              </div>
            </div>
          </Card>

          {/* Technique Notes & Syllabus */}
          <div className="mt-3 p-3 bg-white rounded-3 border">
            <h5 className="fw-bold text-dark mb-2">🥋 Masterclass Syllabus & Drill Topics</h5>
            <ul className="mb-0 small text-muted">
              <li>1. Hip framing against heavy chest-to-chest pressure passing.</li>
              <li>2. High-elevation bolo inversion counters from De La Riva guard.</li>
              <li>3. Live Sparring breakdown: Countering the knee-slice pass into reverse armbar.</li>
            </ul>
          </div>
        </Col>

        {/* Right Side: Real-Time Seminar Chat */}
        <Col xs={24} lg={8}>
          <Card className="chat-card h-100 d-flex flex-column" bordered={false}>
            <div className="chat-header pb-2 mb-2 border-bottom d-flex justify-content-between align-items-center">
              <h4 className="card-heading mb-0">💬 Seminar Live Chat</h4>
              <Badge count={chatMessages.length} overflowCount={99} />
            </div>

            {/* Message Stream */}
            <div className="chat-stream flex-grow-1 overflow-auto py-2" style={{ maxHeight: 420 }}>
              {chatMessages.map((m, idx) => (
                <div key={idx} className="chat-msg-bubble mb-2 p-2 rounded-2 bg-light border">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className={`fw-bold small ${m.role === "Instructor" ? "text-primary" : "text-dark"}`}>
                      {m.sender} {m.role === "Instructor" && <Tag color="blue">Sensei</Tag>}
                    </span>
                    <span className="text-muted" style={{ fontSize: 10 }}>{m.time}</span>
                  </div>
                  <p className="mb-0 text-dark small">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendChat} className="chat-input-box mt-3 pt-2 border-top">
              <div className="d-flex gap-2">
                <Input
                  placeholder="Ask Sensei a technique question..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                />
                <Button type="primary" htmlType="submit" icon={<SendOutlined />} />
              </div>
            </form>
          </Card>
        </Col>
      </Row>
    </WebinarRoomStyled>
  );
};

export default LiveWebinarRoom;

const WebinarRoomStyled = styled.div`
  width: 100%;

  .room-title {
    font-size: 20px;
    font-family: ${fontFamilyBold};
    color: #0f172a;
  }

  .video-card {
    border-radius: 16px;
    overflow: hidden;
    background: #000;
  }

  .chat-card {
    border-radius: 16px;
    background: #ffffff;
    border: 1px solid #f0f0f0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  }

  .card-heading {
    font-size: 16px;
    font-family: ${fontFamilyBold};
    color: #0f172a;
  }
`;
