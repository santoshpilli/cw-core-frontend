import React, { useState, useEffect } from "react";
import { Row, Col, Layout, Input, Badge, Avatar, Button } from "antd";
import { SearchOutlined, SendOutlined } from "@ant-design/icons";
import NavBar from "../../navBar";
import { useGlobalContext } from "../../../lib/storage";
import EmailIcon from "../../../assets/images/envelop.svg";
import One from "../../../assets/images/1.jpeg";
import Two from "../../../assets/images/2.jpeg";
import Three from "../../../assets/images/3.jpg";
import Four from "../../../assets/images/4.jpg";
import PrintIcon from "../../../assets/images/print-alert.svg";
import BackwardIcon from "../../../assets/images/backward.svg";
import MoreAction from "../../../assets/images/moreActions.svg";
import "./styles.css";

const { Header, Content } = Layout;

const AlertsandMessages = (props) => {
  const { globalStore, setGlobalStore } = useGlobalContext();
  const { userData } = globalStore;
  const Themes = userData.CW360_V2_UI;
  const [loading, setLoading] = useState(true);
  const [menuToggle, setMenuToggle] = useState(false);
  const [fullMenuToggle, setFullMenuToggle] = useState(false);
  const [drawerFlag, setDrawerFlag] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState("Alert : Low Stock");
  const [selectedMessage, setSelectedMessage] = useState("Sam Lowel");

  const handleSelectedAlert = (value, fieldName) => {
    setSelectedAlert(value);
  };

  const handleSelectedMessage = (value) => {
    setSelectedMessage(value);
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 200);
  }, []);

  const [alertTab, setAlertTab] = useState("inbox");
  const handleAlertType = (fieldName) => {
    setAlertTab(fieldName);
  };

  const alertNameList = [
    {
      title: "Alert : Low Stock",
      custTitle: "James Franco",
      time: "2 Hours Ago",
    },
    {
      title: "System Reboot",
      custTitle: "James Franco",
      time: "5 Hours Ago",
    },
    {
      title: "Expense Report",
      custTitle: "Nick Magovac",
      time: "9 Hours Ago",
    },
  ];

  const personNameList = [
    {
      title: "Sam Lowel",
      custTitle: "New request",
      img: Four,
    },
    {
      title: "Angelina Johnson",
      custTitle: "",
      img: null,
    },
    {
      title: "John Snow",
      custTitle: "See you there",
      img: One,
    },
    {
      title: "Rachel Green",
      custTitle: "You: Okay Rachel. Will chec...",
      img: Two,
    },
    {
      title: "Erik Payne",
      custTitle: "Thank you!",
      img: Three,
    },
  ];

  return (
    <Layout style={{ display: loading ? "none" : "block", fontFamily: "'Open Sans', sans-serif" }}>
      <Header style={Themes.header}>
        <NavBar
          fullMenuToggle={fullMenuToggle}
          setFullMenuToggle={setFullMenuToggle}
          setMenuToggle={setMenuToggle}
          menuToggle={menuToggle}
          setDrawerFlag={setDrawerFlag}
          drawerFlag={drawerFlag}
        />
      </Header>
      <Layout>
        <Content style={Themes.content}>
          <div style={{ backgroundColor: "#ffffff", height: "92vh" }}>
            <Row>
              <Col span={6} style={{ height: "92vh", border: "0.5px solid #DBDBDB", borderTop: "none" }}>
                <Row>
                  <Col span={12}>
                    <div className={alertTab === "inbox" ? "alerts-tab-div-active" : "alerts-tabs-div"} onClick={() => handleAlertType("inbox")}>
                      <p className={alertTab === "inbox" ? "alerts-tabs-active" : "alerts-tabs"}>Inbox</p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={alertTab === "conversations" ? "alerts-tab-div-active" : "alerts-tabs-div"} onClick={() => handleAlertType("conversations")}>
                      <p className={alertTab === "conversations" ? "alerts-tabs-active" : "alerts-tabs"}>Conversations</p>
                    </div>
                  </Col>
                </Row>
                <div style={{ textAlign: "center", margin: "10px 15px 15px" }}>
                  <Input
                    placeholder="Search..."
                    className="searchInput"
                    suffix={<SearchOutlined style={{ color: "#d7dade" }} />}
                    // value={customerSearchInput}
                    // onPressEnter={handleCustomerSearch}
                  />
                </div>
                {alertTab === "inbox" ? (
                  <div>
                    {alertNameList.map((item) => (
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={1}>
                          <div
                            className="selectedItem"
                            style={{
                              visibility: selectedAlert === item.title ? "visible" : "hidden",
                            }}
                          ></div>
                        </Col>
                        <Col span={20} style={{ paddingLeft: 7, cursor: "pointer" }} onClick={() => handleSelectedAlert(item.title)}>
                          <div>
                            <p className="alertName">{item.title}</p>
                            <p className="alertLoc">
                              {item.custTitle} . {item.time}
                            </p>
                          </div>
                        </Col>
                        <Col span={3} style={{ paddingLeft: 7, cursor: "pointer", alignSelf: "center" }} onClick={() => handleSelectedAlert(item.title)}>
                          <img src={EmailIcon} alt="" />
                        </Col>
                      </Row>
                    ))}
                  </div>
                ) : (
                  <div>
                    {personNameList.map((item) => (
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={1}>
                          <div
                            className="selectedItem"
                            style={{
                              visibility: selectedMessage === item.title ? "visible" : "hidden",
                            }}
                          ></div>
                        </Col>
                        <Col span={3} style={{ paddingLeft: 7, cursor: "pointer", alignSelf: "center" }} onClick={() => handleSelectedMessage(item.title)}>
                          <Badge dot color="#009045" offset={[-5, 30]}>
                            {item.img !== null ? (
                              <Avatar shape="circle" src={item.img} size={35} style={{ backgroundColor: "#AE9DD3" }} />
                            ) : (
                              <Avatar shape="circle" size={35} style={{ backgroundColor: "#AE9DD3" }}>
                                {item.title.charAt(0)}
                              </Avatar>
                            )}
                          </Badge>
                        </Col>
                        <Col span={20} style={{ paddingLeft: 20, cursor: "pointer" }} onClick={() => handleSelectedMessage(item.title)}>
                          <div>
                            <p className="alertName">{item.title}</p>
                            <p className={item.custTitle === "New request" ? "newRequest" : "alertLoc"}>{item.custTitle}</p>
                          </div>
                        </Col>
                      </Row>
                    ))}
                  </div>
                )}
              </Col>
              {alertTab === "inbox" ? (
                <Col
                  span={18}
                  style={{
                    height: "92vh",
                    padding: "0px 10px 10px",
                    backgroundColor: "#F2F3F6",
                    borderBottom: "0.5px solid #DBDBDB",
                    borderRadius: "3px",
                    borderTopLeftRadius: "0px",
                    borderBottomLeftRadius: "0px",
                  }}
                >
                  <div style={{ height: "90.5vh", padding: "15px 20px 20px", backgroundColor: "#ffffff" }}>
                    <Row>
                      <Col span={12}>
                        <p className="alertTitle">Alert : Low Stock</p>
                      </Col>
                      <Col span={12} style={{ textAlign: "right" }}>
                        <img src={PrintIcon} alt="" /> &nbsp; <img src={BackwardIcon} alt="" /> &nbsp; <img src={MoreAction} alt="" style={{ height: "27px", width: "27px" }} />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <p className="alertLoc">System Admin to me, Benji, Prisha</p>
                      </Col>
                      <Col span={12} style={{ textAlign: "right" }}>
                        <p className="alertLoc">Feb 10, 2022, 2:49 PM (4 days ago)</p>{" "}
                      </Col>
                    </Row>
                    <hr />
                    <p className="this-is-to">This is to notify you that the following Product Stock Levels are critically low, please replenish it.</p>
                    <div>
                      <p className="details-title">Product Name :</p>
                      <p className="details-value">Onions</p>
                    </div>
                    <div>
                      <p className="details-title">Warehouse :</p>
                      <p className="details-value">Madhapur</p>
                    </div>
                    <div>
                      <p className="details-title">Minimum Stock :</p>
                      <p className="details-value">150</p>
                    </div>
                    <div>
                      <p className="details-title">Current Stock :</p>
                      <p className="details-value">80</p>
                    </div>
                  </div>
                </Col>
              ) : (
                <Col
                  span={18}
                  style={{
                    height: "92vh",
                    padding: "5px 10px 10px",
                    borderBottom: "0.5px solid #DBDBDB",
                    borderRadius: "3px",
                    borderTopLeftRadius: "0px",
                    borderBottomLeftRadius: "0px",
                    backgroundColor: "#F2F3F6",
                    borderTop: "none",
                  }}
                >
                  {selectedMessage === "John Snow" ? (
                    <>
                      <Row>
                        <Col span={20}>
                          <p className="selectedPerson">John Snow</p>
                          <p className="status">
                            <Badge dot color="#009045" width="7px" height="7px"></Badge> Online
                          </p>
                        </Col>
                        <Col span={4} style={{ paddingRight: 10, textAlign: "right", alignSelf: "center" }}>
                          <SearchOutlined style={{ color: "#464646" }} />
                        </Col>
                      </Row>
                      <div style={{ height: "80.5vh", backgroundColor: "#ffffff", marginTop: 8, padding: 10 }}>
                        <p className="personStatus">Sam has joined the chat</p>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={2} style={{ paddingLeft: 20, cursor: "pointer" }}>
                            <Avatar shape="circle" src={One} size="large" />
                          </Col>
                          <Col span={22} style={{ cursor: "pointer" }}>
                            <div>
                              <p className="alertName">John Snow</p>
                              <p className="alertLoc">Hello Sam</p>
                              <p className="alertLoc">Welcome aboard</p>
                              <p className="alertLoc">We have a staff meeting tomorrow at 8:00 am in Conference room #9</p>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10, padding: "5px 0px", backgroundColor: "#FBFBFB" }}>
                          <Col span={2} style={{ paddingLeft: 20, cursor: "pointer" }}>
                            <Avatar shape="circle" src={Two} size="large" />
                          </Col>
                          <Col span={22} style={{ cursor: "pointer" }}>
                            <div>
                              <p className="alertName">Sam Lowel</p>
                              <p className="alertLoc">Hey John</p>
                              <p className="alertLoc">Thank you so much!</p>
                              <p className="alertLoc">Sure, I will be there</p>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={2} style={{ paddingLeft: 20, cursor: "pointer" }}>
                            <Avatar shape="circle" src={One} size="large" />
                          </Col>
                          <Col span={22} style={{ cursor: "pointer" }}>
                            <div>
                              <p className="alertName">John Snow</p>
                              <p className="alertLoc">Cool</p>
                              <p className="alertLoc">See you there</p>
                            </div>
                          </Col>
                        </Row>
                        <div
                          style={{
                            position: "absolute",
                            bottom: "0px",
                            width: "94%",
                            margin: "0px 10px 25px",
                          }}
                        >
                          <Input className="typing-input" placeholder="Type here..." suffix={<SendOutlined />} />
                        </div>
                      </div>
                    </>
                  ) : selectedMessage === "Rachel Green" ? (
                    <>
                      <Row>
                        <Col span={20}>
                          <p className="selectedPerson">Rachel Green</p>
                          <p className="status">
                            <Badge dot color="#009045" width="7px" height="7px"></Badge> Online
                          </p>
                        </Col>
                        <Col span={4} style={{ paddingRight: 10, textAlign: "right", alignSelf: "center" }}>
                          <SearchOutlined style={{ color: "#464646" }} />
                        </Col>
                      </Row>
                      <div style={{ height: "80.5vh", backgroundColor: "#ffffff", marginTop: 8, padding: 10 }}>
                        <p className="personStatus">Sam has joined the chat</p>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={2} style={{ paddingLeft: 20, cursor: "pointer" }}>
                            <Avatar shape="circle" src={Two} size="large" />
                          </Col>
                          <Col span={22} style={{ cursor: "pointer" }}>
                            <div>
                              <p className="alertName">Rachel Green</p>
                              <p className="alertLoc">Hello John</p>
                              <p className="alertLoc">Welcome aboard</p>
                              <p className="alertLoc">We have a staff meeting tomorrow at 8:00 am in Conference room #9</p>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10, padding: "5px 0px", backgroundColor: "#FBFBFB" }}>
                          <Col span={2} style={{ paddingLeft: 20, cursor: "pointer" }}>
                            <Avatar shape="circle" src={One} size="large" />
                          </Col>
                          <Col span={22} style={{ cursor: "pointer" }}>
                            <div>
                              <p className="alertName">John Snow</p>
                              <p className="alertLoc">Hey John</p>
                              <p className="alertLoc">Thank you so much!</p>
                              <p className="alertLoc">Sure, I will be there</p>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={2} style={{ paddingLeft: 20, cursor: "pointer" }}>
                            <Avatar shape="circle" src={Two} size="large" />
                          </Col>
                          <Col span={22} style={{ cursor: "pointer" }}>
                            <div>
                              <p className="alertName">Rachel Green</p>
                              <p className="alertLoc">Cool</p>
                              <p className="alertLoc">See you there</p>
                            </div>
                          </Col>
                        </Row>
                        <div
                          style={{
                            position: "absolute",
                            bottom: "0px",
                            width: "94%",
                            margin: "0px 10px 15px",
                          }}
                        >
                          <Input className="typing-input" placeholder="Type here..." suffix={<SendOutlined style={{ color: "#858282" }} />} />
                        </div>
                      </div>
                    </>
                  ) : selectedMessage === "Erik Payne" ? (
                    <>
                      <Row>
                        <Col span={20}>
                          <p className="selectedPerson">Erik Payne</p>
                          <p className="status">
                            <Badge dot color="#009045" width="7px" height="7px"></Badge> Online
                          </p>
                        </Col>
                        <Col span={4} style={{ paddingRight: 10, textAlign: "right", alignSelf: "center" }}>
                          <SearchOutlined style={{ color: "#464646" }} />
                        </Col>
                      </Row>
                      <div style={{ height: "80.5vh", backgroundColor: "#ffffff", marginTop: 8, padding: 10 }}>
                        <p className="personStatus">Sam has joined the chat</p>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={2} style={{ paddingLeft: 20, cursor: "pointer" }}>
                            <Avatar shape="circle" src={Three} size="large" />
                          </Col>
                          <Col span={22} style={{ cursor: "pointer" }}>
                            <div>
                              <p className="alertName">Erik Payne</p>
                              <p className="alertLoc">Hello Sam</p>
                              <p className="alertLoc">Welcome aboard</p>
                              <p className="alertLoc">We have a staff meeting tomorrow at 8:00 am in Conference room #9</p>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10, padding: "5px 0px", backgroundColor: "#FBFBFB" }}>
                          <Col span={2} style={{ paddingLeft: 20, cursor: "pointer" }}>
                            <Avatar shape="circle" src={Two} size="large" />
                          </Col>
                          <Col span={22} style={{ cursor: "pointer" }}>
                            <div>
                              <p className="alertName">Sam Lowel</p>
                              <p className="alertLoc">Hey Erik</p>
                              <p className="alertLoc">Thank you so much!</p>
                              <p className="alertLoc">Sure, I will be there</p>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={2} style={{ paddingLeft: 20, cursor: "pointer" }}>
                            <Avatar shape="circle" src={Three} size="large" />
                          </Col>
                          <Col span={22} style={{ cursor: "pointer" }}>
                            <div>
                              <p className="alertName">Erik Payne</p>
                              <p className="alertLoc">Cool</p>
                              <p className="alertLoc">See you there</p>
                            </div>
                          </Col>
                        </Row>
                        <div
                          style={{
                            position: "absolute",
                            bottom: "0px",
                            width: "94%",
                            margin: "0px 10px 15px",
                          }}
                        >
                          <Input className="typing-input" placeholder="Type here..." suffix={<SendOutlined style={{ color: "#858282" }} />} />
                        </div>
                      </div>
                    </>
                  ) : selectedMessage === "Angelina Johnson" ? (
                    <>
                      <Row>
                        <Col span={20}>
                          <p className="selectedPerson">Angelina Johnson</p>
                          <p className="status">
                            <Badge dot color="#009045" width="7px" height="7px"></Badge> Online
                          </p>
                        </Col>
                        <Col span={4} style={{ paddingRight: 10, textAlign: "right", alignSelf: "center" }}>
                          <SearchOutlined style={{ color: "#464646" }} />
                        </Col>
                      </Row>
                      <div style={{ height: "80.5vh", backgroundColor: "#ffffff", marginTop: 8, padding: 10 }}>
                        <div style={{ paddingTop: "15%", textAlign: "center" }}>
                          <Avatar shape="circle" size={35} style={{ backgroundColor: "#AE9DD3" }}>
                            {selectedMessage.charAt(0)}
                          </Avatar>
                          <p className="new-person-title">Angelina Johnson</p>
                          <p className="mail-address">angelina.j@cwsolutions.in</p>
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            bottom: "0px",
                            width: "94%",
                            margin: "0px 10px 25px",
                          }}
                        >
                          <Input className="typing-input" placeholder="Type here..." suffix={<SendOutlined />} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Row>
                        <Col span={20}>
                          <p className="selectedPerson">Sam Lovel</p>
                          <p className="status">
                            <Badge dot color="#009045" width="7px" height="7px"></Badge> Online
                          </p>
                        </Col>
                        <Col span={4} style={{ paddingRight: 10, textAlign: "right", alignSelf: "center" }}>
                          <SearchOutlined style={{ color: "#464646" }} />
                        </Col>
                      </Row>
                      <div style={{ height: "80.5vh", backgroundColor: "#ffffff", marginTop: 8, padding: 10 }}>
                        <Row style={{ marginBottom: 10, visibility: "hidden" }}>
                          <Col span={2} style={{ paddingLeft: 20, cursor: "pointer" }}>
                            <Avatar shape="circle" size={35} style={{ backgroundColor: "#AE9DD3" }}>
                              {selectedMessage.charAt(0)}
                            </Avatar>
                          </Col>
                          <Col span={22} style={{ cursor: "pointer" }}>
                            <div>
                              <p className="alertName">Sam Lovel</p>
                              <p className="alertLoc">Hi Angelina</p>
                              <p className="alertLoc">Sam here</p>
                              <p className="alertLoc">I have just joined as a Product Designer</p>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10, visibility: "hidden" }}>
                          <Col span={2} style={{ paddingLeft: 20, cursor: "pointer" }}>
                            <Avatar shape="circle" size={35} style={{ backgroundColor: "#AE9DD3" }}>
                              {selectedMessage.charAt(0)}
                            </Avatar>
                          </Col>
                          <Col span={22} style={{ cursor: "pointer" }}>
                            <div>
                              <p className="alertName">Sam Lovel</p>
                              <p className="alertLoc">Hi Angelina</p>
                              <p className="alertLoc">Sam here</p>
                              <p className="alertLoc">I have just joined as a Product Designer</p>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10, visibility: "hidden" }}>
                          <Col span={2} style={{ paddingLeft: 20, cursor: "pointer" }}>
                            <Avatar shape="circle" src={Four} size="large" />
                          </Col>
                          <Col span={22} style={{ cursor: "pointer" }}>
                            <div>
                              <p className="alertName">Sam Lovel</p>
                              <p className="alertLoc">Hi Angelina</p>
                              <p className="alertLoc">Sam here</p>
                              <p className="alertLoc">I have just joined as a Product Designer</p>
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={2} style={{ paddingLeft: 20, cursor: "pointer" }}>
                            <Avatar shape="circle" src={Four} size="large" />
                          </Col>
                          <Col span={22} style={{ cursor: "pointer" }}>
                            <div>
                              <p className="alertName">Sam Lovel</p>
                              <p className="alertLoc">Hi Angelina</p>
                              <p className="alertLoc">Sam here</p>
                              <p className="alertLoc">I have just joined as a Product Designer</p>
                            </div>
                          </Col>
                        </Row>
                        <div
                          style={{
                            position: "absolute",
                            bottom: "0px",
                            width: "94%",
                            margin: "0px 10px 25px",
                          }}
                        >
                          <div className="accept-request-div">
                            <Row>
                              <Col span={12} style={{ alignSelf: "center" }}>
                                <p className="request-person-msg">Do you know sam.lowel@cwsuite.com</p>
                              </Col>
                              <Col span={12} style={{ textAlign: "right" }}>
                                <Button type="submit" size="small" className="ignore-btn">
                                  Ignore
                                </Button>{" "}
                                &nbsp;{" "}
                                <Button type="submit" size="small" className="accept-btn">
                                  Accept
                                </Button>
                              </Col>
                            </Row>
                          </div>
                          <Input className="typing-input" placeholder="Type here..." suffix={<SendOutlined />} />
                        </div>
                      </div>
                    </>
                  )}
                </Col>
              )}
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AlertsandMessages;
