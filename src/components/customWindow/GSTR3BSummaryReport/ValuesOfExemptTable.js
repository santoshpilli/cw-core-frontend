import React from "react";
import { Table } from "antd";
// import { EditOutlined } from '@ant-design/icons'
import "antd/dist/antd.css";
// import "./antdClass.css"
import "../../../styles/antd.css";

const ValuesOfExemptTable = () => {
  // const [selectedRecord,setSelectedRecord] = useState({})
  // const {gridData,getSelectedRecord} = props

  const tableColumns = [
    {
      title: <span style={{ paddingLeft: "3%" }}>Nature of Supply</span>,
      dataIndex: "natureOfSupply",
      width: 200,
      render: (text, record) => <span style={{ paddingLeft: "3%" }}>{record.natureOfSupply}</span>,
    },
    /* {
      title: "Taxable Value",
      dataIndex: "taxableValue",
      width: 150,
    }, */
    {
      title: <div style={{ textAlign: "right" }}>Inter-State Supplies</div>,
      dataIndex: "interStateSupplies",
      width: 150,
      render: (text, record) => <div style={{ textAlign: "right" }}>{record.interStateSupplies}</div>,
    },
    {
      title: <div style={{ textAlign: "right" }}>Intra-State Supplies</div>,
      dataIndex: "intrastateSupplies",
      width: 150,
      render: (text, record) => <div style={{ textAlign: "right" }}>{record.intrastateSupplies}</div>,
    },
  ];

  const gridData = [
    {
      natureOfSupply: "Composition Scheme, Exempted, Nil Rated",
      interStateSupplies: 254596.50,
      intrastateSupplies: 236928.00
    },
    {
      natureOfSupply: "Non-GST supply",
      interStateSupplies: 0.00,
      intrastateSupplies: 0.00,
    }
  ];

  return (
    <div>
      <Table
        // rowClassName={(record, index) => record.productId === selectedRecord.productId ? 'table-row-dark' :  'table-row-light'}
        columns={tableColumns}
        dataSource={gridData}
        bordered
        style={{ fontSize: "12px" }}
        size="small"
        sticky={true}
        scroll={{ x: "100%" }}
        pagination={false}
      />
    </div>
  );
};

export default ValuesOfExemptTable;
