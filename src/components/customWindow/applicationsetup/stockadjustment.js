import React from "react";
import { Row, Col, Form, Checkbox } from "antd";

const StockAdjustment = (props) => {

  const { showSummary, importSA, downloadTemplate, upcSearch, skuSearch, fullCount, cyclicCount, openingBalance,cost } = props.stockAdjustmentValues;

  return (
    <div>
      <Row gutter={16}>
        <Col span={4} />
        {showSummary ? (
          <Col className="gutter-row" span={6}>
            <Form.Item label="Show Summary" name="sashowsummary" valuePropName="checked" initialValue={showSummary === "Y" ? true : false}>
              <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
            </Form.Item>
          </Col>
        ) : null}
        {importSA ? (
          <Col className="gutter-row" span={6}>
            <Form.Item label="Import" name="saimport" valuePropName="checked" initialValue={importSA === "Y" ? true : false}>
              <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
            </Form.Item>
          </Col>
        ) : null}
        {downloadTemplate ? (
          <Col className="gutter-row" span={6}>
            <Form.Item label="Download Template" name="sadownloadtemplate" valuePropName="checked" style={{ marginBottom: "8px" }} initialValue={downloadTemplate === "Y" ? true : false}>
              <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
            </Form.Item>
          </Col>
        ) : null}
      </Row>
      <br />
      <Row gutter={16}>
        <Col span={4} />
        {upcSearch ? (
          <Col className="gutter-row" span={6}>
            <Form.Item label="UPC Search" name="saupcsearch" valuePropName="checked" initialValue={upcSearch === "Y" ? true : false}>
              <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
            </Form.Item>
          </Col>
        ) : null}
        {skuSearch ? (
          <Col className="gutter-row" span={6}>
            <Form.Item label="SKU Search" name="saskusearch" valuePropName="checked" initialValue={skuSearch === "Y" ? true : false}>
              <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
            </Form.Item>
          </Col>
        ) : null}
        {fullCount ? (
          <Col className="gutter-row" span={6}>
            <Form.Item label="Full Count" name="safullcount" valuePropName="checked" style={{ marginBottom: "8px" }} initialValue={fullCount === "Y" ? true : false}>
              <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
            </Form.Item>
          </Col>
        ) : null}
      </Row>
      <br />
      <Row gutter={16}>
        <Col span={4} />
        {cyclicCount ? (
          <Col className="gutter-row" span={6}>
            <Form.Item label="Cyclic Count" name="sacycliccount" valuePropName="checked" initialValue={cyclicCount === "Y" ? true : false}>
              <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
            </Form.Item>
          </Col>
        ) : null}
        {openingBalance ? (
          <Col className="gutter-row" span={6}>
            <Form.Item label="Opening Balance" name="saopeningbalance" valuePropName="checked" initialValue={openingBalance === "Y" ? true : false}>
              <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
            </Form.Item>
          </Col>
        ) : null}
        {/* {cost ? (
          <Col className="gutter-row" span={6}>
            <Form.Item label="Cost" name="sacost" valuePropName="checked" initialValue={cost === "Y" ? true : false}>
              <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
            </Form.Item>
          </Col>
        ) : null} */}
        {/* configJson: "{\\"showSummary\\":${values.sashowsummary === undefined || values.sashowsummary === null ? null : values.sashowsummary===true?`\\"${"Y"}\\"`:`\\"${"N"}\\"`},
          \\"importSA\\":${values.saimport === undefined || values.saimport === null ? null : values.saimport===true?`\\"${"Y"}\\"`:`\\"${"N"}\\"`},
          */}
      </Row>
      <br />
    </div>
  );
};

export default StockAdjustment;
