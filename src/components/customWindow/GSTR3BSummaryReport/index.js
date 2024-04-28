import React from "react";
import { Row, Col, Card, Form, DatePicker,Input } from "antd";
import TableData from "./TableData";
import EligibleITCTableData from "./EligibleITCTable";
import ValuesOfExemptTableData from "./ValuesOfExemptTable";

const GSTR3BSummaryReport = () => {
  const [form] = Form.useForm();
  const dateFormat = "YYYY/MM/DD";

  return (
    <>
      <div>
        {/* <span><h2 style={{textAlign:"center",fontWeight:"bold"}}>GSTR 3B Summary</h2></span>
      <span><h5 style={{textAlign:"center"}}>From 01/01/2022 To 31/01/2022</h5></span> */}
        <Row>
          <Col span={24} style={{ marginBottom: "8px" }}>
            <Row>
              <Col span={8}><h2 style={{ textAlign: "left", fontWeight: "bold" }}>GSTR-3B Summary</h2></Col>
              {/* <Col span={8}>
                
              </Col>
              <Col span={8}></Col> */}
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginBottom: "8px" }}>
            <Card>
              <Form form={form} layout="vertical">
                <Row gutter={8}>
                  <Col span={6}>
                    <Form.Item label="From Date" name="fromDate" rules={[{ required: true, message: "Please Enter from date" }]}>
                      <DatePicker style={{ width: "100%" }} format={dateFormat} />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item label="To Date" name="toDate" rules={[{ required: true, message: "Please Enter to date" }]}>
                      <DatePicker style={{ width: "100%" }} format={dateFormat} />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item label="Business Unit" name="businessUnit" rules={[{ required: true, message: "Please Enter to date" }]}>
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <br />
            </Card>
          </Col>
        </Row>
        <div style={{ height: "66vh", overflow: "scroll" }}>
          <span style={{fontWeight:"bold"}}>3.1 Details of Outward Supplies and inward supplies liable to reverse charge</span>
          <br />
          <span>
            <TableData />
          </span>
          <span style={{fontWeight:"bold"}}>4.0 Eligible ITC</span>
          <br />
          <span>
            <EligibleITCTableData />
          </span>
          <span style={{fontWeight:"bold"}}>5. Values of exempt, nil-rated and non-GST inward supplies</span>
          <span>
            <ValuesOfExemptTableData />
          </span>
        </div>
      </div>
    </>
  );
};

export default GSTR3BSummaryReport;
