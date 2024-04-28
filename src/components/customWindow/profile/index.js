import React, { useState, useEffect } from "react";

import { Row, Col, Card, Timeline, Button, Tabs, Modal,Form,Input,Spin,message } from "antd";
import {LoadingOutlined} from '@ant-design/icons'
import ProfilePic from "../../../assets/images/profile.jpg";
import editIcon from "../../../assets/images/editIcon.svg";
import TimeLineIcon from "../../../assets/images/timelineicon.svg";
import LockIcon from "../../../assets/images/lock.svg";
import Phone from "../../../assets/images/phone.svg";
import Envlope from "../../../assets/images/envlope.svg";
import BrifCase from "../../../assets/images/birfcase.svg";
import Personaluser from "../../../assets/images/personaluser.svg";
import { getProfile } from "../../../services/custom";
import {getUpdateProfilePassword} from "../../../services/generic"

const { TabPane } = Tabs;
const Profile = () => {
  const [profileData, setProfileData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading,setLoading] = useState(false)
  const [passWordChangeForm] = Form.useForm()

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    const userData = window.localStorage.getItem("userData");
    const parsedUserData = JSON.parse(userData);
    const profileResponse = await getProfile(parsedUserData.user_id);
  };

  const getUpdateModal = () => {
    setOpenModal(true);
  };

  const closeModal = () =>{
    setOpenModal(false);
  }

  const updatePassword = async () =>{
    passWordChangeForm.validateFields().then(values => {
        getUpdate(values)
    })
  }

  const getUpdate = async (values) =>{
    setLoading(true)
    const updatePasswordResponse = await getUpdateProfilePassword(values)
    if(updatePasswordResponse.messageCode === "200"){
        message.success(updatePasswordResponse.message)
       passWordChangeForm.resetFields()
       setLoading(false)
       setOpenModal(false);
      }else{
        message.error(updatePasswordResponse.message)
        setLoading(false)
      }
}
  return (
    <div>
      <Row>
        <Col span={12}>
          <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>Profile</h2>
        </Col>
      </Row>
      <Card style={{ marginBottom: "8px" }}>
        <Row>
          <Col span={8}>
            <Row>
              <Col span={24}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img src={ProfilePic} style={{ height: "200px", width: "200px" }} alt="profile" />
                  <div
                    style={{
                      paddingTop: "7px",
                      paddingRight: "7px",
                      position: "absolute",
                      right: -20,
                      bottom: -10,
                    }}
                  >
                    <img src={editIcon} alt="edit" />
                  </div>
                </div>
              </Col>
            </Row>
            <p />
            <Row>
              <Col span={24}>
                <h3 style={{ fontWeight: "bold", marginBottom: "10px" }}>Login History</h3>
                <Row>
                  <Col span={24} style={{ marginLeft: "15px" }}>
                    <Timeline mode="left">
                      <Timeline.Item dot={<img src={TimeLineIcon} alt="timeIcon" style={{ height: "20px" }} />}>
                        <span style={{ fontSize: "12px" }}>Logged in as Administrator Changed Username and Password</span>
                      </Timeline.Item>
                      <Timeline.Item dot={<img src={TimeLineIcon} alt="timeIcon" style={{ height: "20px" }} />}>
                        <span style={{ fontSize: "12px" }}>Logged in as Administrator Changed Username and Password</span>
                      </Timeline.Item>
                      <Timeline.Item dot={<img src={TimeLineIcon} alt="timeIcon" style={{ height: "20px" }} />}>
                        <span style={{ fontSize: "12px" }}>Logged in as Administrator Changed Username and Password</span>
                      </Timeline.Item>
                      <Timeline.Item dot={<img src={TimeLineIcon} alt="timeIcon" style={{ height: "20px" }} />}>
                        <span style={{ fontSize: "12px" }}>Logged in as Administrator Changed Username and Password</span>
                      </Timeline.Item>
                    </Timeline>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={16} style={{ paddingLeft: "16px" }}>
            <Row>
              <Col span={24}>
                <span style={{ float: "right" }}>
                  <Button
                    style={{
                      background: "#089EA4",
                      color: "white",
                      border: "0.5px solid #07888D",
                      borderRadius: "2px",
                    }}
                    onClick={getUpdateModal}
                  >
                    <img src={LockIcon} alt="lock" style={{ width: "12px", height: "15px", marginBottom: "2px" }} /> &nbsp;&nbsp;Update Password
                  </Button>
                </span>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <h2 style={{ color: "#0D0C22", fontSize: "24px", opacity: 1 }}>{"Cw Solutions"}</h2>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <h6 style={{ color: "#4E4E4E", fontSize: "12px", marginBottom: "0px" }}>System Administrator</h6>
                <h6 style={{ color: "#4E4E4E", fontSize: "12px" }}>Jinzo Pvt. Ltd.</h6>
              </Col>
            </Row>
            <p />
            <Row>
              <Col span={6}>
                <span>
                  <img src={Phone} style={{ height: "17px", width: "17px" }} alt="phone" /> &nbsp;<span style={{ color: "#4E4E4E" }}>020 25823987</span>
                </span>
              </Col>
              <Col span={10}>
                <span>
                  <img src={Envlope} style={{ height: "17px", width: "17px" }} alt="phone" />
                  &nbsp;<span style={{ color: "#4E4E4E" }}>{"ajay.kumar@exceloid.com"}</span>
                </span>
              </Col>
            </Row>
            <div style={{ height: "4rem" }} />
            <Row>
              <Col span={24}>
                <Tabs tabBarStyle={{ marginBottom: "0px" }} defaultActiveKey="1">
                  <TabPane
                    tab={
                      <span>
                        <img src={BrifCase} style={{ height: "17px", width: "17px" }} alt="phone" />
                        &nbsp;&nbsp;Professional &nbsp;&nbsp;&nbsp;
                      </span>
                    }
                    key="1"
                  >
                    <Card style={{ border: "none" }}>
                      <Row>
                        <Col span={8}>
                          <h6 style={{ color: "#4E4E4E", fontSize: "12px" }}>Location :</h6>
                        </Col>
                        <Col span={16}>
                          <h6 style={{ color: "#4E4E4E", fontSize: "12px" }}>Punjagutta, Hyderabad</h6>
                        </Col>
                      </Row>
                      <p />
                      <Row>
                        <Col span={8}>
                          <h6 style={{ color: "#4E4E4E", fontSize: "12px" }}>Department :</h6>
                        </Col>
                        <Col span={16}>
                          <h6 style={{ color: "#4E4E4E", fontSize: "12px" }}>Information Technology</h6>
                        </Col>
                      </Row>
                      <p />
                      <Row>
                        <Col span={8}>
                          <h6 style={{ color: "#4E4E4E", fontSize: "12px" }}>Years of Experience :</h6>
                        </Col>
                        <Col span={16}>
                          <h6 style={{ color: "#4E4E4E", fontSize: "12px" }}>Seven Years</h6>
                        </Col>
                      </Row>
                      <p />
                      <Row>
                        <Col span={8}>
                          <h6 style={{ color: "#4E4E4E", fontSize: "12px" }}>Date of Birth :</h6>
                        </Col>
                        <Col span={16}>
                          <h6 style={{ color: "#4E4E4E", fontSize: "12px" }}>18/Nov/1980</h6>
                        </Col>
                      </Row>
                      <p />
                      <Row>
                        <Col span={8}>
                          <h6 style={{ color: "#4E4E4E", fontSize: "12px" }}>Department :</h6>
                        </Col>
                        <Col span={16}>
                          <h6 style={{ color: "#4E4E4E", fontSize: "12px" }}>Information Technology</h6>
                        </Col>
                      </Row>
                    </Card>
                  </TabPane>
                  <TabPane
                    style={{ paddingBottom: "0px" }}
                    tab={
                      <span>
                        <img src={Personaluser} style={{ height: "17px", width: "17px" }} alt="phone" />
                        &nbsp;&nbsp;Personal &nbsp;&nbsp;&nbsp;
                      </span>
                    }
                    key="2"
                  >
                    <Card>Personal Info</Card>
                  </TabPane>
                </Tabs>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <Modal
        visible={openModal}
        closable={null}
        centered
        width="55%"
        footer={null}
      >
        <h3 style={{ textAlign: "center" }}>Update Password</h3>
        <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
        <Card style={{border:'none'}}>
          <Form layout="vertical"  onFinish={updatePassword} form={passWordChangeForm} name="passWordChangeForm">
            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
                <Form.Item 
                rules={[
                        {
                          required: true,
                          message: "Enter old password",
                        },
                      ]} 
                       name="oldpass" label="Old password">
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item rules={[
                        {
                          required: true,
                          message: "Enter New password",
                        },
                      ]}  name="newpass" label="New password">
                    <Input.Password />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item rules={[
                        {
                          required: true,
                          message: "Enter Confirm password",
                        },
                      ]} name="confirmpass" label="Confirm password">
                    <Input.Password />
                </Form.Item>
              </Col>
            </Row>
            <br />
            <Row>
                <Col span={24} style={{textAlign:'right'}}>
                      <Button onClick={closeModal}>Cancel</Button>
                      &nbsp;&nbsp;
                      <Button type="submit" style={{background:'rgb(8 158 164)',color:'white'}} onClick={updatePassword} >Confirm</Button>
                </Col>
            </Row>
          </Form>
        </Card>
        </Spin>
      </Modal>
    </div>
  );
};

export default Profile;
