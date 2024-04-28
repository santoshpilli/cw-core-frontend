import React from "react";
import { Table } from "antd";
// import { EditOutlined } from '@ant-design/icons'
import "antd/dist/antd.css";
// import "./antdClass.css"
import "../../../styles/antd.css";

const EligibleITCTable = (props) => {
  // const [selectedRecord,setSelectedRecord] = useState({})
  // const {gridData,getSelectedRecord} = props

  const tableColumns = [
    {
      title: <span style={{paddingLeft:"3%"}}>Details</span>,
      dataIndex: "details",
      width: 450,
      render: (text, record) => <span style={{paddingLeft:"3%"}}>{record.details}</span>,
    },
    /* {
      title: "Taxable Value",
      dataIndex: "taxableValue",
      width: 150,
    }, */
    {
      title: <div style={{ textAlign: "right" }}>Integrated Tax</div>,
      dataIndex: "integratedTax",
      width: 150,
      render: (text, record) => <div style={{ textAlign: "right" }}>{record.integratedTax}</div>,
    },
    {
      title: <div style={{ textAlign: "right" }}>Central Tax</div>,
      dataIndex: "centralTax",
      width: 150,
      render: (text, record) => <div style={{ textAlign: "right" }}>{record.centralTax}</div>,
    },
    {
      title: <div style={{ textAlign: "right" }}>State/UT Tax</div>,
      dataIndex: "stateTax",
      width: 150,
      render: (text, record) => <div style={{ textAlign: "right" }}>{record.stateTax}</div>,
    },
    {
      title: <div style={{ textAlign: "right" }}>Cess Tax</div>,
      dataIndex: "cessTax",
      width: 150,
      render: (text, record) => <div style={{ textAlign: "right" }}>{record.cessTax}</div>,
    },
  ];

  const gridData = [
    {
      details: "Import of Goods",
      integratedTax: 0.00,
      centralTax: null,
      stateTax: null,
      cessTax: 0.00,
    },
    {
      details: "Import of Services",
      integratedTax: 0.00,
      centralTax: null,
      stateTax: null,
      cessTax: 0.00,
    },
    {
      details: "Inward supplies liable to reverse charge",
      integratedTax: 0.00,
      centralTax: 0.00,
      stateTax: 0.00,
      cessTax: 0.00,
    },
    {
      details: "Inward supplies from ISD",
      taxableValue: null,
      integratedTax: null,
      centralTax: null,
      stateTax: null,
      cessTax: null,
    },
    {
      details: "All other ITC",
      integratedTax: 1168.20,
      centralTax: 0.00,
      stateTax: 0.00,
      cessTax: 0.00,
    },
    {
      details: "As per section 17(5)",
      integratedTax: 0.00,
      centralTax: 0.00,
      stateTax: 0.00,
      cessTax: 0.00,
    },
    {
      details: "Others",
      integratedTax: 1168.20,
      centralTax: 0.00,
      stateTax: 0.00,
      cessTax: 0.00,
    },
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
        scroll={{ y:"20vh",x: "100%" }}
        pagination={false}
      />
    </div>
  );
};

export default EligibleITCTable;
