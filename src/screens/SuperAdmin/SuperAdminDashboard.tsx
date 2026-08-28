import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Table, Tag, Button, Space, Modal, Input, Badge } from "antd";
import {
  BankOutlined,
  UsergroupAddOutlined,
  DollarCircleOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  GlobalOutlined,
  ReloadOutlined,
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
  tertiaryBlue,
  whiteColor,
} from "../../components/GlobalStyle";
import {
  base_url,
  super_admin_metrics_url,
  super_admin_schools_url,
  super_admin_verify_url,
  super_admin_transactions_url,
} from "../../utils/api_urls";

const SuperAdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [schools, setSchools] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [metricsRes, schoolsRes, txnsRes] = await Promise.all([
        axios.get(`${base_url}${super_admin_metrics_url}`),
        axios.get(`${base_url}${super_admin_schools_url}`),
        axios.get(`${base_url}${super_admin_transactions_url}`),
      ]);

      setMetrics(metricsRes.data?.data || {});
      setSchools(schoolsRes.data?.data || []);
      setTransactions(txnsRes.data?.data || []);
    } catch (err) {
      toast.error("Failed to load Super Admin metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifySchool = async (schoolId: number, newStatus: string) => {
    try {
      const res = await axios.post(`${base_url}${super_admin_verify_url}`, {
        school_id: schoolId,
        status: newStatus,
      });
      if (res.data?.responseCode === 200 || res.status === 200) {
        toast.success(`School #${schoolId} is now ${newStatus}!`);
        fetchAdminData();
      }
    } catch (err) {
      toast.error("Failed to update verification status.");
    }
  };

  const schoolColumns = [
    {
      title: "Academy / Dojo Name",
      dataIndex: "schoolName",
      key: "schoolName",
      render: (name: string, record: any) => (
        <div>
          <strong className="text-dark">{name}</strong>
          <div className="text-muted small">{record.email} • {record.contactNumber}</div>
        </div>
      ),
    },
    {
      title: "Sensei Owner",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "Disciplines",
      dataIndex: "disciplines",
      key: "disciplines",
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {tags?.map((t, idx) => (
            <Tag color="blue" key={idx}>
              {t}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Active Students",
      dataIndex: "totalStudents",
      key: "totalStudents",
      render: (cnt: number) => <span className="fw-bold">{cnt} Fighters</span>,
    },
    {
      title: "Est. Monthly Rev",
      dataIndex: "monthlyRevenue",
      key: "monthlyRevenue",
      render: (rev: number) => <strong className="text-success">${rev?.toLocaleString()} USD</strong>,
    },
    {
      title: "Verification",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Verified Active" ? "green" : "gold"}>
          {status === "Verified Active" ? "✓ Verified Active" : "⏳ Pending Review"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          {record.status !== "Verified Active" ? (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleVerifySchool(record.id, "Verified Active")}
            >
              Verify Dojo
            </Button>
          ) : (
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => handleVerifySchool(record.id, "Pending Review")}
            >
              Suspend
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: "Transaction Ref",
      dataIndex: "transactionRef",
      key: "transactionRef",
      render: (ref: string) => <code className="text-primary fw-bold">{ref}</code>,
    },
    {
      title: "Academy Dojo",
      dataIndex: "schoolName",
      key: "schoolName",
    },
    {
      title: "Student / Buyer",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Item / Service",
      dataIndex: "item",
      key: "item",
      render: (item: string) => <strong>{item}</strong>,
    },
    {
      title: "Gross Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amt: number, record: any) => (
        <span className="fw-bold text-dark">
          ${amt} {record.currency}
        </span>
      ),
    },
    {
      title: "Platform Cut (5%)",
      dataIndex: "platformCut",
      key: "platformCut",
      render: (cut: number) => <Tag color="cyan">+${cut} USD</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: string) => <Tag color="green">✓ {s}</Tag>,
    },
    {
      title: "Timestamp",
      dataIndex: "date",
      key: "date",
    },
  ];

  return (
    <SuperAdminStyled>
      <Head title="Super Admin Platform Console - Martial Arts OS" />

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h1 className="page-title mb-0">👑 Super Admin Platform Console</h1>
            <Tag color="purple">Multi-Tenant Master</Tag>
          </div>
          <p className="page-subtitle mb-0">
            Global oversight across all martial arts academies, platform GMV revenue, and school approvals.
          </p>
        </div>
        <Button icon={<ReloadOutlined />} type="primary" onClick={fetchAdminData}>
          Refresh Analytics
        </Button>
      </div>

      {/* 4 Global KPI Cards */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card" bordered={false}>
            <Statistic
              title="Total Dojos & Franchises"
              value={metrics?.totalSchools || 8}
              prefix={<BankOutlined className="text-primary me-2" />}
            />
            <div className="small text-muted mt-2">Across 14 Cities</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card" bordered={false}>
            <Statistic
              title="Total Active Fighters"
              value={metrics?.totalStudents || 240}
              prefix={<UsergroupAddOutlined className="text-success me-2" />}
            />
            <div className="small text-success mt-2">↑ +38 registered this month</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card" bordered={false}>
            <Statistic
              title="Platform Gross Volume (GMV)"
              value={metrics?.grossMerchandiseValue || 24850}
              prefix="$"
              precision={2}
            />
            <div className="small text-muted mt-2">30-Day Total Transactions</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card highlight-card" bordered={false}>
            <Statistic
              title="Platform Net Revenue (5% Cut)"
              value={metrics?.platformNetRevenue || 1242.5}
              prefix="$"
              precision={2}
              valueStyle={{ color: "#00B0E9", fontWeight: "bold" }}
            />
            <div className="small text-primary mt-2">Automated Stripe SaaS Take-Rate</div>
          </Card>
        </Col>
      </Row>

      {/* Schools Directory */}
      <Card className="section-card mb-4" bordered={false}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="card-heading">🏢 Global Academy Directory & Verification</h3>
          <Badge count={schools.length} style={{ backgroundColor: primaryColor }} />
        </div>
        <Table
          columns={schoolColumns}
          dataSource={schools}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Global Transaction Audit Ledger */}
      <Card className="section-card" bordered={false}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="card-heading">📜 Global Platform Transaction Audit Ledger</h3>
          <Tag color="cyan">Stripe Webhook Sync</Tag>
        </div>
        <Table
          columns={transactionColumns}
          dataSource={transactions}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </Card>
    </SuperAdminStyled>
  );
};

export default SuperAdminDashboard;

const SuperAdminStyled = styled.div`
  width: 100%;

  .page-title {
    font-size: 24px;
    font-family: ${fontFamilyBold};
    color: #0f172a;
  }

  .page-subtitle {
    font-size: 14px;
    color: #64748b;
  }

  .metric-card {
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
    border: 1px solid #f0f0f0;

    &.highlight-card {
      background: ${tertiaryBlue};
      border-color: #00b0e9;
    }
  }

  .section-card {
    border-radius: 16px;
    background: #ffffff;
    border: 1px solid #f0f0f0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
    padding: 6px;

    .card-heading {
      font-size: 18px;
      font-family: ${fontFamilyBold};
      color: ${pureDark};
      margin: 0;
    }
  }
`;
