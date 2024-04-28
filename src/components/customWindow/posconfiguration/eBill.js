import React from "react";
import { Row, Col, Form, Checkbox, Input, Select } from "antd";

const { Option } = Select;

const EBill = (props) => {
  const propsValues = props.eBillValues;
  const {eBill,eBillWebHookURL,eBillCommType}=propsValues

  return (
    <div>
      <Row gutter={16}>
        <Col span={2} />
        {eBill ? (
          <Col span={4}>
            <Form.Item label="E-Bill" name="eBillFlag" valuePropName="checked" initialValue={eBill === "Y" ? true : false}>
              <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
            </Form.Item>
          </Col>
        ) : (
          null
        )}
        {eBillWebHookURL ? (
        <Col span={9}>
          <Form.Item label="E-Bill Webhook URL" name="eBillWebHookURL" initialValue={eBillWebHookURL}>
            <Input />
          </Form.Item>
        </Col>
         ) : (
          null
        )}
        {eBillCommType ? (
        <Col className="gutter-row" span={6}>
          <Form.Item label="E-Bill Communication Type" name="eBillCommType" style={{ marginBottom: "8px" }} initialValue={eBillCommType}>
            <Select allowClear showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              <Option key="1" value="WhatsApp" title="WhatsApp">
                WhatsApp
              </Option>
              <Option key="2" value="SMS" title="SMS">
                SMS
              </Option>
            </Select>
          </Form.Item>
        </Col>
        ) : (
          null
        )}
      </Row>
      <br />
    </div>
  );
};

export default EBill;
