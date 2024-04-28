import React from "react";
import { Table, Typography } from "antd";
// import { EditOutlined } from '@ant-design/icons'
import "antd/dist/antd.css";
import "./antdClass.css";
import "../../../styles/antd.css";

const { Text } = Typography;

const MainTable = (props) => {
  // const [selectedRecord,setSelectedRecord] = useState({})
  // const {gridData,getSelectedRecord} = props

  const tableColumns = [
    {
      title: <span style={{ paddingLeft: "3%" }}>Nature of Supply</span>,
      dataIndex: "natureOfSupply",
      width: 450,
      render: (text, record) => <span style={{ paddingLeft: "3%" }}>{record.natureOfSupply}</span>,
    },
    {
      title: <div style={{ textAlign: "right" }}>Taxable Value</div>,
      dataIndex: "taxableValue",
      width: 150,
      render: (text, record) => <div style={{ textAlign: "right" }}>{record.taxableValue}</div>,
    },
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
      natureOfSupply: "Outward taxable supplies (other than zero rated, nil rated andexempted)",
      taxableValue: 7000.0,
      integratedTax: 1260.0,
      centralTax: 0.0,
      stateTax: 0.0,
      cessTax: 0.0,
    },
    {
      natureOfSupply: "Outward taxable supplies (zero rated)",
      taxableValue: 0.0,
      integratedTax: 0.0,
      centralTax: null,
      stateTax: null,
      cessTax: 0.0,
    },
    {
      natureOfSupply: "Other outward supplies (Nil rated, exempted)",
      taxableValue: 0.0,
      integratedTax: null,
      centralTax: null,
      stateTax: null,
      cessTax: null,
    },
    {
      natureOfSupply: "Inward supplies (liable to reverse charge)",
      taxableValue: 0.0,
      integratedTax: 0.0,
      centralTax: 0.0,
      stateTax: 0.0,
      cessTax: 0.0,
    },
    {
      natureOfSupply: "Non-GST outward supplies",
      taxableValue: 0.0,
      integratedTax: null,
      centralTax: null,
      stateTax: null,
      cessTax: null,
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
        scroll={{ x: "100%" }}
        pagination={false}
        summary={(pageData) => {
          let totalTaxableValue = 0;
          let totalIntegratedTax = 0;
          let totalCentralTax = 0;
          let totalStateTax = 0;
          let totalCESSTax = 0;

          pageData.forEach(({ taxableValue, integratedTax, centralTax, stateTax, cessTax }) => {
            totalTaxableValue += taxableValue;
            totalIntegratedTax += integratedTax;
            totalCentralTax += centralTax;
            totalStateTax += stateTax;
            totalCESSTax += cessTax;
          });

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell><div style={{marginLeft:"3%",fontWeight:"bold"}}>Total value</div></Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text style={{float:"right"}}>{totalTaxableValue}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text style={{float:"right"}}>{totalIntegratedTax}</Text>
                </Table.Summary.Cell>
                 <Table.Summary.Cell>
                  <Text style={{float:"right"}}>{totalCentralTax}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text style={{float:"right"}}>{totalStateTax}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text style={{float:"right"}}>{totalCESSTax}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </div>
  );
};

export default MainTable;
