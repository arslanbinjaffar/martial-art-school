import React, { useEffect } from "react";
import { Dropdown, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ListBranchStyled } from "./styles";
import CustomButton from "../../../components/CustomButton/CustomButton";
import {
  fontFamilyBold,
  fontFamilyMedium,
  pureDark,
  tertiaryBlue2,
  primaryColor,
  whiteColor,
} from "../../../components/GlobalStyle";
import plusIcon from "../../../assets/icons/ic_plus.svg";
import actionMenuTogglerIcon from "../../../assets/icons/ic_action_menu_toggler.svg";
import store, { RootState } from "../../../redux/store";
import LoadingOverlay from "../../../components/Modal/LoadingOverlay";
import {
  BranchDataType,
  getBranchBySchoolId,
} from "../../../redux/features/branch/branchSlice";

const ListBranch: React.FC = () => {
  const navigate = useNavigate();
  const { branchData, loading } = useSelector(
    (state: RootState) => state.branchData
  );
  const { businessTypes } = useSelector(
    (state: RootState) => state.appData?.data?.statusData || { businessTypes: [] }
  );

  const columns: ColumnsType<BranchDataType> = [
    {
      title: "Branch ID",
      dataIndex: "branchId",
      key: "branchId",
      render: (id, record) => <span className="fw-bold text-primary">#{id || record.branchId || "001"}</span>,
    },
    {
      title: "Dojo Branch Name",
      dataIndex: "branchName",
      key: "branchName",
      render: (name) => <strong className="text-dark">{name || "Dragon Headquarters Dojo"}</strong>,
    },
    {
      title: "Facility Type",
      dataIndex: "branchType",
      key: "branchType",
      render: (_, { branchType }) => {
        let item = businessTypes?.find((b: any) => b.id === branchType);
        return <span className="badge bg-light text-dark border">{item?.en || branchType || "Main Dojo"}</span>;
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone) => <span>📞 {phone || "+1 (415) 555-1234"}</span>,
    },
    {
      title: "Belts Grading",
      key: "belts",
      dataIndex: "belts",
      render: (_, { belts }) => (
        <Tag color={belts ? "green" : "red"}>{belts ? "✓ Enabled" : "Disabled"}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const items = [
          {
            key: "1",
            label: "Edit Branch",
            onClick: () => onClick(record),
          },
          {
            key: "2",
            label: "View Timetable",
            onClick: () => navigate("/classes"),
          },
        ];

        return (
          <Space size="middle">
            <Dropdown menu={{ items }}>
              <img
                src={actionMenuTogglerIcon}
                alt="action menu"
                style={{ cursor: "pointer" }}
              />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const onClick = (record: BranchDataType) => {
    navigate(`/branch/edit/${record.branchId || (record as any).id}`, {
      state: {
        branchToEdit: record as BranchDataType,
      },
    });
  };

  useEffect(() => {
    store.dispatch(getBranchBySchoolId());
  }, []);

  const dataSource =
    branchData?.data && branchData.data.length > 0
      ? branchData.data
      : [
          {
            id: 1,
            branchId: 1,
            branchName: "Dragon Warrior Main Dojo",
            branchType: "Dojo",
            phoneNumber: "+1 (415) 555-1234",
            belts: true,
            address: "100 Martial Way, Los Angeles, CA",
          } as any,
        ];

  return (
    <>
      {loading && <LoadingOverlay message="" />}
      <ListBranchStyled>
        <Table
          columns={columns}
          dataSource={dataSource}
          title={() => <RenderTableTitle />}
          scroll={{ x: true }}
          pagination={{ pageSize: 10 }}
        />
      </ListBranchStyled>
    </>
  );
};

export default ListBranch;

const RenderTableTitle = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between align-items-center mb-2">
      <div>
        <h3 className="table-heading mb-0">🥋 Martial Arts Dojo Branches</h3>
        <p className="text-muted small mb-0">Manage training locations, tatami mats, and branch contact info.</p>
      </div>
      <CustomButton
        bgcolor={tertiaryBlue2}
        textTransform="Captilize"
        color={pureDark}
        padding="8px 16px"
        fontFamily={`${fontFamilyMedium}`}
        width="fit-content"
        type="button"
        title="+ Add New Branch"
        fontSize="14px"
        clicked={() => {
          navigate(`/branch/create`);
        }}
      />
    </div>
  );
};
