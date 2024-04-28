import React from "react";
import { Row, Col, Form, Checkbox, Card } from "antd";

const ApprovalLogging = (props) => {
  const propsValues = props.approvalLoggingValues;
  const {
    login,
    logout,
    deleteLines,
    deleteOrder,
    dayOpening,
    dayClosing,
    decreaseQty,
    addCustomer,
    paymentDelete,
    deleteParkedOrder,
    salesReturn,
    salesRepDelete,
    lineSalesRepDelete,
    removeCustomer
  } = propsValues
  return (
    <div style={{ height: "70vh", overflowY: "auto" }}>
      <Row gutter={16} style={{ padding: "15px" }}>
        <Col className="gutter-row" span={6}>
          <Card style={{ border: "1px solid" }}>
            <h3>Login</h3> 
           
            {login ? (
              <Row>
                <Col className="gutter-row" span={5} />

                <Col className="gutter-row" span={6}>
                  <Form.Item label="Approval" name="loginApproval" valuePropName="checked" initialValue={login[0].approval === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>

                <Col className="gutter-row" span={6} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Log" name="loginLog" valuePropName="checked" initialValue={login[1].log === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
            <br />
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          <Card style={{ border: "1px solid" }}>
            <h3>Logout</h3>
            {logout ? (
              <Row>
                <Col className="gutter-row" span={5} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Approval" name="logoutApproval" valuePropName="checked" initialValue={logout[0].approval === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Log" name="logoutLog" valuePropName="checked" initialValue={logout[1].log === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
            <br />
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          <Card style={{ border: "1px solid" }}>
            <h3>Delete Lines</h3>
            {deleteLines ? (
              <Row>
                <Col className="gutter-row" span={5} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Approval" name="deleteLinesApproval" valuePropName="checked" initialValue={deleteLines[0].approval === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Log" name="deleteLinesLog" valuePropName="checked" initialValue={deleteLines[1].log === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ""
            )}
            <br />
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          <Card style={{ border: "1px solid" }}>
            <h3>Delete Order</h3>
            {deleteOrder ? (
              <Row>
                <Col className="gutter-row" span={5} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Approval" name="deleteOrderApproval" valuePropName="checked" initialValue={deleteOrder[0].approval === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Log" name="deleteOrderLog" valuePropName="checked" initialValue={deleteOrder[1].log === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ""
            )}
            <br />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ padding: "15px" }}>
        <Col className="gutter-row" span={6}>
          <Card style={{ border: "1px solid" }}>
            <h3>Day Opening</h3>
            {dayOpening ? (
              <Row>
                <Col className="gutter-row" span={5} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Approval" name="dayOpeningApproval" valuePropName="checked" initialValue={dayOpening[0].approval === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Log" name="dayOpeningLog" valuePropName="checked" initialValue={dayOpening[1].log === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ""
            )}
            <br />
          </Card>
        </Col>

        <Col className="gutter-row" span={6}>
          <Card style={{ border: "1px solid" }}>
            <h3>Day Closing</h3>
            {dayClosing ? (
              <Row>
                <Col className="gutter-row" span={5} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Approval" name="dayClosingApproval" valuePropName="checked" initialValue={dayClosing[0].approval === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Log" name="dayClosingLog" valuePropName="checked" initialValue={dayClosing[1].log === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ""
            )}
            <br />
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          <Card style={{ border: "1px solid" }}>
            <h3>Reduce Qty</h3>
            {decreaseQty ? (
              <Row>
                <Col className="gutter-row" span={5} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Approval" name="decreaseQtyApproval" valuePropName="checked" initialValue={decreaseQty[0].approval === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Log" name="decreaseQtyLog" valuePropName="checked" initialValue={decreaseQty[1].log === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ""
            )}
            <br />
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          <Card style={{ border: "1px solid" }}>
            <h3>Add Customer</h3>
            {addCustomer ? (
              <Row>
                <Col className="gutter-row" span={5} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Approval" name="addCustomerApproval" valuePropName="checked" initialValue={addCustomer[0].approval === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Log" name="addCustomerLog" valuePropName="checked" initialValue={addCustomer[1].log === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ""
            )}
            <br />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ padding: "15px" }}>
        <Col className="gutter-row" span={6}>
          <Card style={{ border: "1px solid" }}>
            <h3> Delete Payment</h3>
            {paymentDelete ? (
              <Row>
                <Col className="gutter-row" span={5} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Approval" name="paymentDeleteApproval" valuePropName="checked" initialValue={paymentDelete[0].approval === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Log" name="paymentDeleteLog" valuePropName="checked" initialValue={paymentDelete[1].log === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ""
            )}
            <br />
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          <Card style={{ border: "1px solid" }}>
            <h3>Delete Parked Order</h3>
            {deleteParkedOrder ? (
              <Row>
                <Col className="gutter-row" span={5} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Approval" name="deleteParkedOrderApproval" valuePropName="checked" initialValue={deleteParkedOrder[0].approval === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Log" name="deleteParkedOrderLog" valuePropName="checked" initialValue={deleteParkedOrder[1].log === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ""
            )}
            <br />
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          <Card style={{ border: "1px solid" }}>
            <h3>Sales Return</h3>
            {salesReturn ? (
              <Row>
                <Col className="gutter-row" span={5} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Approval" name="salesReturnApproval" valuePropName="checked" initialValue={salesReturn[0].approval === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Log" name="salesReturnLog" valuePropName="checked" initialValue={salesReturn[1].log === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ""
            )}
            <br />
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          <Card style={{ border: "1px solid" }}>
            <h3>Delete Order Sales Rep</h3>
            {salesRepDelete ? (
              <Row>
                <Col className="gutter-row" span={5} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Approval" name="salesRepDeleteApproval" valuePropName="checked" initialValue={salesRepDelete[0].approval === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Log" name="salesRepDeleteLog" valuePropName="checked" initialValue={salesRepDelete[1].log === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ""
            )}
            <br />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ padding: "15px" }}>
        <Col className="gutter-row" span={6}>
          <Card style={{ border: "1px solid" }}>
            <h3>Delete Line Sales Rep</h3>
            {lineSalesRepDelete ? (
              <Row>
                <Col className="gutter-row" span={5} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Approval" name="lineSalesRepDeleteApproval" valuePropName="checked" initialValue={lineSalesRepDelete[0].approval === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Log" name="lineSalesRepDeleteLog" valuePropName="checked" initialValue={lineSalesRepDelete[1].log === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ""
            )}
            <br />
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          <Card style={{ border: "1px solid" }}>
            <h3>Remove Customer</h3>
            {removeCustomer ? (
              <Row>
                <Col className="gutter-row" span={5} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Approval" name="removeCustomerApproval" valuePropName="checked" initialValue={removeCustomer[0].approval === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6} />
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Log" name="removeCustomerLog" valuePropName="checked" initialValue={removeCustomer[1].log === "Y" ? true : false}>
                    <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ""
            )}
            <br />
          </Card>
        </Col>
      </Row>
      <br />
    </div>
  );
};

export default ApprovalLogging;
