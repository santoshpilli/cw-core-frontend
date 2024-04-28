import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { Row, Col, Spin, Menu, Card, Divider, message, Modal, Input, Button, Form, Timeline, DatePicker, TimePicker, Select } from "antd";
import { useGlobalContext } from "../../lib/storage";
import { getAnnouncements } from "../../services/generic";
import UserIcon from "../../assets/images/blankImage.png";
import CloseIcon from "../../assets/images/closeIcon.png";
import MeghaPhone from "../../assets/images/megaphone.svg";
import GettingStarted from "../../assets/images/getting_started.svg";
import UserDocs from "../../assets/images/userdocs.svg";
import FAQ from "../../assets/images/faqs.svg";
import TimeLineIcon from "../../assets/images/timelineicon.svg";
import moment from "moment";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { getFavouritesMenuList, getAlerts, getPriorityData, getAllusersData, getTaskStatus, createTask, getTaskData } from "../../services/generic";

const { SubMenu } = Menu;
const { TextArea } = Input;
const { Option } = Select;
const HomePage = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { globalStore } = useGlobalContext();
  const [announcements, setAnnouncements] = useState([]);
  const [quickLinkData, setQuickLinkData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [alertsData, setAlertsData] = useState([]);
  const [taskModalVisile, setTaskModalVisile] = useState(false);
  const [PriorityData, setPriorityData] = useState([]);
  const [usersData, setusersData] = useState([]);
  const [taskStatusData, settaskStatusData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [description, setDescription] = useState("");

  const userInfo = {
    name: globalStore.userData.user,
    Email: globalStore.userData.email,
    role: globalStore.userData.role_iden,
    Phone: 9876543210,
  };

  let userDateFormat = globalStore.userPreferences.dateFormat
  let userTimeFormat = globalStore.userPreferences.timeFormat


  // useEffect(async () => {
  //   setLoading(true);
  //   const getAnnouncementsData = await getAnnouncements();
  //   setAnnouncements(getAnnouncementsData);
  //   const getAlertsData = await getAlerts();
  //   const taskResponseData = await getTaskData();
  //   setTaskData(taskResponseData);
  //   setAlertsData(getAlertsData);
  //   // const SideMenu = JSON.parse(window.localStorage.getItem("sideMenuData")) || [];
  //   const SideMenu = [];
  //   const favouritesMenuDataResponse = await getFavouritesMenuList();
  //   const mainArray = [];
  //   const mainTwo = [];
  //   for (let index = 0; index < SideMenu.length; index += 1) {
  //     const elementOne = SideMenu[index];
  //     const elementWithChildren = elementOne.children !== undefined ? elementOne.children : "";
  //     const childrenArray = [];
  //     for (let index1 = 0; index1 < elementWithChildren.length; index1 += 1) {
  //       const elementTwo = elementWithChildren[index1];
  //       for (let index2 = 0; index2 < favouritesMenuDataResponse.length; index2 += 1) {
  //         const menuId1 = favouritesMenuDataResponse[index2].menuId;
  //         if (elementTwo.id === menuId1) {
  //           childrenArray.push(elementTwo);
  //         }
  //       }
  //     }
  //     mainArray.push({
  //       title: SideMenu[index].title,
  //       key: SideMenu[index].key,
  //       children: childrenArray,
  //     });
  //   }
  //   for (let index = 0; index < mainArray.length; index += 1) {
  //     const element = mainArray[index].children;
  //     if (element.length > 0) {
  //       mainTwo.push(mainArray[index]);
  //     }
  //   }
  //   setQuickLinkData(mainTwo);
  //   setLoading(false);
  // }, []);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: "#c1c1c1",
      borderRadius: "5px",
      width: "8px",
    };
    setLoading(false);
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const renderView = ({ style, ...props }) => {
    const viewStyle = {
      color: "#00000",
    };
    return <div className="box" style={{ ...style, ...viewStyle }} {...props} />;
  };

  const deleteAnnouncement = async (id) => {
    const index = announcements.findIndex((data) => data.csAnnouncementId === id);
    if (index >= 0) {
      announcements.splice(index, 1);
    }
    setAnnouncements([...announcements]);
  };

  const responsiveIcon = {
    xxl: 2,
    xl: 2,
    lg: 2,
    xs: 2,
    sm: 2,
    md: 2,
  };

  const responsivePhone = {
    xxl: 1,
    xl: 1,
    lg: 1,
    xs: 0,
    sm: 0,
    md: 1,
  };

  const responsiveText = {
    xxl: 13,
    xl: 13,
    lg: 13,
    xs: 22,
    sm: 22,
    md: 14,
  };

  const responsiveClose = {
    xxl: 10,
    xl: 10,
    lg: 10,
    xs: 2,
    sm: 2,
    md: 9,
  };

  const responsiveImages = {
    xxl: 8,
    xl: 8,
    lg: 8,
    xs: 24,
    sm: 24,
    md: 8,
  };

  const responsiveUserText = {
    xxl: 10,
    xl: 10,
    lg: 10,
    xs: 19,
    sm: 19,
    md: 10,
  };

  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 12,
    sm: 12,
    md: 12,
  };

  const responsiveDesignCards = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 24,
    sm: 24,
    md: 12,
  };

  const responsiveDesignText = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 0,
    sm: 0,
    md: 12,
  };

  const responsiveSearch = {
    xxl: 24,
    xl: 24,
    lg: 24,
    xs: 24,
    sm: 24,
    md: 24,
  };

  const responsiveSpace = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 3,
    sm: 3,
    md: 0,
  };

  const innerWidth = window.innerWidth;

  const handleQuickLinks = (e) => {
    const menuType = e.item.props.k.type;
    const menuId = e.item.props.k.id;
    let navigationUrl;
    switch (menuType) {
      case "Report":
        navigationUrl = `/reports/report/${menuId}`;
        break;
      case "Dashboard":
        navigationUrl = `/analytics/dashboard/${menuId}`;
        break;
      case "Generic":
        navigationUrl = `/window/list/${menuId}`;
        break;
      case "Custom":
        navigationUrl = `/others/window/${menuId}`;
        break;
      case "GenericNew":
        navigationUrl = `/window/${menuId}/NEW_RECORD`;
        break;
      default:
        message.warning("Not Available");
        break;
    }
    history.push(navigationUrl);
  };

  const createTaskModalClose = () => {
    setTaskModalVisile(false);
  };

  const openTaskModal = () => {
    let usersData = JSON.parse(localStorage.getItem("userData"));
    form.setFieldsValue({
      Owner: usersData.user,
    });
    setTaskModalVisile(true);
  };

  const getPriority = async () => {
    const getPriorityResponse = await getPriorityData();
    setPriorityData(getPriorityResponse);
  };

  const getAllusers = async () => {
    let Data = JSON.parse(localStorage.getItem("userData"));
    const getAllusersResponse = await getAllusersData(Data.cs_client_id);
    setusersData(getAllusersResponse);
  };

  const taskStatusList = async () => {
    const taskStatusResponse = await getTaskStatus();
    settaskStatusData(taskStatusResponse);
  };

 const handleChange=(html)=>{
    setDescription(html)
  }

  const createNewTask = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      let uData = JSON.parse(localStorage.getItem("userData"));
      const nTaskname = values.taskname;
      const nPriority = values.priority;
      const nAssignee = values.assignee;
      const nDuedate = moment(values.duedate).format("YYYY-MM-DD");
      const nStatus = values.status;
      const nDescription = description;
      const nDate = moment(values.date).format("YYYY-MM-DD");
      const nTime = moment(values.time).format("YYYY-MM-DD H:m");
      const nOwner = uData.user_id;
      const Bu = uData.bunit_id;

      const data = {
        nTaskname: nTaskname,
        nPriority: nPriority,
        nAssignee: nAssignee,
        nDuedate: nDuedate,
        nStatus: nStatus,
        nDescription: nDescription,
        nDate: nDate,
        nTime: nTime,
        nOwner: nOwner,
        Bu: Bu,
      };
      upsertTask(data);
    });
  };

  const upsertTask = async (data) => {
    const createTaskResponse = await createTask(data);
    if (createTaskResponse.messageCode === "200") {
      message.success(createTaskResponse.message);
      form.resetFields(["taskname", "priority", "assignee", "duedate", "status", "description", "date", "time"]);
      setLoading(false);
      // const taskResponseData = await getTaskData();
      // setTaskData(taskResponseData);
      setTaskModalVisile(false);
      setDescription("")
    } else {
      message.error(createTaskResponse.message);
      form.resetFields(["taskname", "priority", "assignee", "duedate", "status", "description", "date", "time"]);
      setLoading(false);
      // const taskResponseData = await getTaskData();
      // setTaskData(taskResponseData);
      setTaskModalVisile(false);
      setDescription("")
    }
  };
  const priorityMenudata = PriorityData.map((data) => {
    return (
      <Option key={data.id} value={data.id}>
        {data.name}
      </Option>
    );
  });
  const userMenudata = usersData.map((data) => {
    return (
      <Option key={data.cs_user_id} value={data.cs_user_id}>
        {data.name}
      </Option>
    );
  });

  const taskMenudata = taskStatusData.map((data) => {
    return (
      <Option key={data.id} value={data.id}>
        {data.name}
      </Option>
    );
  });


  return (
    <Spin spinning={loading} tip="Loading..." style={{ position: "relative", top: "25em" }} size="large">
      
      <Scrollbars
        style={{
          height: "90vh",
        }}
        autoHide
        // Hide delay in ms
        autoHideTimeout={1000}
        // Duration for hide animation in ms.
        autoHideDuration={200}
        thumbSize={90}
        renderView={renderView}
        renderThumbHorizontal={renderThumb}
        renderThumbVertical={renderThumb}
      >
        <Card style={{ backgroundColor: "rgb(245, 245, 245)", border: "0px solid #f2f2f2" }}>
          <Row>
            <Col {...responsiveIcon}>
              <img src={UserIcon} style={{ width: "62px", height: "62px", borderRadius: "37px" }} alt="UserIcon" />
            </Col>
            <Col {...responsiveSpace} />
            <Col {...responsiveUserText}>
              <Row>
                <Col {...responsiveSearch}>
                  <h5 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "0px" }}>Welcome {userInfo.name}</h5>
                </Col>
                <Col {...responsiveSearch}>
                  <h6 style={{ color: "#4E4E4E", fontSize: "12px" }}>Logged in as {userInfo.role}</h6>
                </Col>
              </Row>
            </Col>
            <Col {...responsiveDesignText} style={{paddingRight:'2vh'}}>
              <h5
                style={{
                  fontSize: "15px",
                  color: "#939398",
                  float: "right",
                  marginBottom: "0px",
                }}
              >
                <span>
                  {" "}
                  {moment(date).format(userDateFormat)}&nbsp;{moment(date).format(userTimeFormat)}
                </span>
              </h5>
            </Col>
          </Row>
          <br />
          {announcements.map((data) => {
            return (
              <Row>
                <Col {...responsiveSearch}>
                  <div
                    className="card"
                    style={{
                      marginBottom: "5px",
                      borderLeft: `${data.priority === "HP" ? "5px solid #C13832" : `${data.priority === "ST" ? "5px solid #089EA4" : "5px solid #FB9700"}`}`,
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                    }}
                  >
                    <div className="card-body" style={{ padding: "8px" }}>
                      <Row>
                        <Col {...responsivePhone}>
                          {" "}
                          <img src={MeghaPhone} alt="MeghaPhone" style={{ height: "32px", width: "32px" }} />{" "}
                        </Col>
                        <Col {...responsiveText}>
                          <h5
                            style={{
                              marginBottom: "3px",
                              color: "#010113",
                              fontWeight: "bold",
                              fontSize: "15px",
                              marginLeft: "3px",
                            }}
                          >
                            {data.title}
                          </h5>
                          <Col {...responsiveSearch}>
                            <p style={{ marginLeft: "5px", color: "#161417" }}>{data.message}</p>
                          </Col>
                        </Col>
                        <Col {...responsiveClose} style={{ textAlign: "right", paddingRight: "10px" }}>
                          <img
                            role="presentation"
                            onClick={() => deleteAnnouncement(data.csAnnouncementId)}
                            style={{ height: "12px", margin: "0%", marginTop: "0.6rem", cursor: "pointer" }}
                            src={CloseIcon}
                            alt="close"
                          />
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            );
          })}
          <Row>
            <Col {...responsiveDesignCards} style={{ paddingTop: "16px" }}>
              <Card style={{ borderRadius: "6px", marginRight: `${innerWidth < 600 ? "0px" : "8px"}` }}>
                <Row>
                  <Col {...responsiveDesignForColumn}>
                    <h5 style={{ fontWeight: "bold", fontSize: "14px", padding: "5px" }}>Alerts</h5>
                  </Col>
                </Row>
                <Divider style={{ margin: "-1px", borderTop: "1px solid #e5e5ff" }} />
                <Row style={{ marginTop: "10px" }}>
                  <Scrollbars
                    style={{
                      height: "254px",
                    }}
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    thumbSize={90}
                    renderView={renderView}
                    renderThumbHorizontal={renderThumb}
                    renderThumbVertical={renderThumb}
                  >
                    {alertsData !== null
                      ? alertsData.map((data) => (
                          <Col {...responsiveSearch}>
                            <Card
                              style={{
                                background: "#FBFBFB",
                                borderLeft: `${
                                  data.level === "1" ? "3px solid #00FF7F" : data.level === "2" ? "3px solid #ffe58f" : data.level === "3" ? "3px solid #DC143C" : ""
                                }`,
                                borderRadius: "4px",
                                marginBottom: "4px",
                              }}
                            >
                              <Row>
                                <p style={{ color: "#19181A", marginBottom: "2px" }}>{data.title}</p>
                              </Row>
                              <Row>
                                <p style={{ color: "#19181A", marginBottom: "0px" }}>{data.description}</p>
                              </Row>
                            </Card>
                          </Col>
                        ))
                      : ""}
                  </Scrollbars>
                </Row>
              </Card>
            </Col>
            <Col {...responsiveDesignCards} style={{ paddingTop: "16px" }}>
              <Card style={{ borderRadius: "6px", marginLeft: `${innerWidth < 600 ? "0px" : "8px"}`, height: "326px" }}>
                <Row>
                  <Col {...responsiveDesignForColumn}>
                    <h5 style={{ fontWeight: "bold", fontSize: "14px", padding: "5px" }}>Tasks</h5>
                  </Col>
                  <Col {...responsiveDesignForColumn}>
                    <h2 onClick={openTaskModal} style={{ float: "right", cursor: "pointer", marginBottom: "3px", fontWeight: "bold", paddingRight: "10px" }} role="presentation">
                      +
                    </h2>
                  </Col>
                </Row>
                <Divider style={{ margin: "-1px", borderTop: "1px solid #e5e5ff" }} />
                <div>
                  <Scrollbars
                    style={{
                      height: "254px",
                    }}
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    thumbSize={90}
                    renderView={renderView}
                    renderThumbHorizontal={renderThumb}
                    renderThumbVertical={renderThumb}
                  >
                    <Card style={{ border: "none" }}>
                      <Timeline>
                        {taskData === null
                          ? ""
                          : taskData.map((data) => (
                              <Timeline.Item color="green" dot={<img src={TimeLineIcon} alt="ud" style={{ height: "20px" }} />}>
                                <Row gutter={16}>
                                  <Col span={18}>
                                    <Row gutter={16}>
                                      <Col span={24}>
                                        <h6 style={{ fontWeight: "bold", fontSize: "12px" }}>{data.title}</h6>
                                      </Col>
                                    </Row>
                                    <Row gutter={16}>
                                      <Col span={24}>
                                        <p style={{ marginBottom: "0px", color: "#161417", fontSize: "12px" }}>{data.description}</p>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col span={6}>
                                    <h6 style={{ fontSize: "12px" }}>{moment(data.remainderDate).format("YYYY-MM-DD")}</h6>
                                  </Col>
                                </Row>
                              </Timeline.Item>
                            ))}
                      </Timeline>
                    </Card>
                  </Scrollbars>
                </div>
              </Card>
            </Col>
          </Row>
          <Row>
          <Col {...responsiveDesignCards} style={{ paddingTop: "16px" }}>
              <Card style={{ borderRadius: "6px", marginRight: `${innerWidth < 600 ? "0px" : "8px"}`, height: "326px" }}>
                <h5 style={{ fontWeight: "bold", fontSize: "14px", padding: "5px" }}>Quick Links</h5>
                <Divider style={{ margin: "-1px", borderTop: "1px solid #e5e5ff" }} />
                <Scrollbars
                  style={{
                    height: "190px",
                  }}
                  autoHide
                  autoHideTimeout={1000}
                  autoHideDuration={200}
                  thumbSize={90}
                  renderView={renderView}
                  renderThumbHorizontal={renderThumb}
                  renderThumbVertical={renderThumb}
                >
                  <Menu theme="light" mode="inline" onClick={handleQuickLinks} style={{ width: "100%", border: "none" }}>
                    {quickLinkData.map((data) => (
                      <SubMenu key={data.key} title={data.title}>
                        {data.children.map((childata) => {
                          return (
                            <Menu.Item key={childata.key} k={childata}>
                              {childata.title}
                            </Menu.Item>
                          );
                        })}
                      </SubMenu>
                    ))}
                  </Menu>
                </Scrollbars>
              </Card>
            </Col>
            <Col {...responsiveDesignCards} style={{ paddingTop: "16px" }}>
              <Card style={{ borderRadius: "6px", marginLeft: `${innerWidth < 600 ? "0px" : "8px"}`, height: `${innerWidth < 600 ? "auto" : "326px"}` }}>
                <Row>
                  <Col {...responsiveDesignForColumn}>
                    <h5 style={{ fontWeight: "bold", fontSize: "14px", padding: "5px" }}>Help & Support</h5>
                  </Col>
                  <Col {...responsiveDesignForColumn} style={{ textAlign: "right", paddingRight: "10px" }}>
                    <i className="fa fa-search" style={{ color: "#BABDC1" }} />
                  </Col>
                </Row>
                <Divider style={{ margin: "-1px", borderTop: "1px solid #e5e5ff" }} />
                <Row>
                  <Col {...responsiveImages}>
                    <Card style={{ borderRadius: "6px", border: "1px solid #e4e9f0", margin: "10px" }}>
                      <Row>
                        <Col {...responsiveSearch} style={{ textAlign: "center" }}>
                          <img src={GettingStarted} alt="gs" style={{ height: "50px" }} />
                        </Col>
                        <Col {...responsiveSearch} style={{ textAlign: "center" }}>
                          <p />
                          <label style={{ color: "#161417" }}>
                            <a style={{ color: "#161417" }} target="_blank" href="https://cw.solutions/" rel="noopener noreferrer">
                              Getting Started
                            </a>
                          </label>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col {...responsiveImages}>
                    <Card style={{ borderRadius: "6px", border: "1px solid #e4e9f0", margin: "10px" }}>
                      <Row>
                        <Col {...responsiveSearch} style={{ textAlign: "center" }}>
                          <img src={UserDocs} alt="gs" style={{ height: "50px" }} />
                        </Col>
                        <Col {...responsiveSearch} style={{ textAlign: "center" }}>
                          <p />
                          <label style={{ color: "#161417" }}>
                            <a style={{ color: "#161417" }} target="_blank" href="https://cw.solutions/" rel="noopener noreferrer">
                              User Docs
                            </a>
                          </label>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col {...responsiveImages}>
                    <Card style={{ borderRadius: "6px", border: "1px solid #e4e9f0", margin: "10px" }}>
                      <Row>
                        <Col {...responsiveSearch} style={{ textAlign: "center" }}>
                          <img src={FAQ} alt="gs" style={{ height: "50px" }} />
                        </Col>
                        <Col {...responsiveSearch} style={{ textAlign: "center" }}>
                          <p />
                          <label style={{ color: "#161417" }}>
                            <a style={{ color: "#161417" }} target="_blank" href="https://cw.solutions/" rel="noopener noreferrer">
                              FAQ
                            </a>
                          </label>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Card>
      </Scrollbars>
      <Modal header={null} visible={taskModalVisile} onCancel={createTaskModalClose} footer={null} centered width="70%" bodyStyle={{ borderRadius: "8px", padding: "8px" }}>
        <Spin spinning={loading} tip="Loading..." style={{ position: "relative", top: "25em" }} size="large">
          <div>
            <Card style={{ border: "none" }}>
              <h3 style={{ textAlign: "center", fontWeight: "bold" }}>New Task</h3>
              <Form form={form} layout="vertical">
                <Row gutter={16}>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      name="taskname"
                      label="Task Name"
                      rules={[
                        {
                          required: true,
                          message: "Please input task name",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Priority"
                      name="priority"
                      rules={[
                        {
                          required: true,
                          message: "Please select priority",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        optionFilterProp="children"
                        onFocus={getPriority}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {priorityMenudata}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Owner"
                      name="Owner"
                      rules={[
                        {
                          required: true,
                          message: "Please Select Owner",
                        },
                      ]}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <p />
                <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Due Date"
                      name="duedate"
                      rules={[
                        {
                          required: true,
                          message: "Select due date",
                        },
                      ]}
                    >
                      <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Assigned To"
                      name="assignee"
                      rules={[
                        {
                          required: true,
                          message: "Please Select Assignee",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        optionFilterProp="children"
                        onFocus={getAllusers}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {userMenudata}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Status"
                      name="status"
                      rules={[
                        {
                          required: true,
                          message: "Please Select status",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        onFocus={taskStatusList}
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {taskMenudata}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <p />
                <Row gutter={16}>
                  <Col className="gutter-row" span={24}>
                    <Form.Item
                      label="Description"
                      name="description"
                      initialValue={description}
                      rules={[
                        {
                          required: true,
                          message: "Please enter description",
                        },
                      ]}
                    >
                    <ReactQuill
                      theme="snow"
                      onChange={handleChange}
                      value={description}
                      modules={{
                        toolbar: [
                          [{ font: [false, "serif", "monospace"] }, { header: [1, 2, 3, 4, 5, 6, false] }],
                          ["bold", "italic", "underline", "strike", "blockquote"],
                          [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                          [{ align: [] }],
                          ["code", "background"],
                          ["code-block", "direction"],
                          ["link", "image", "video"],
                          ["clean"],
                        ],
                      }}
                    />
                    </Form.Item>
                  </Col>
                </Row>
                <p />
                <Row gutter={16}>
                  <Col span={24}>
                    <h5>Set Reminder</h5>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Date"
                      name="date"
                      rules={[
                        {
                          required: true,
                          message: "Please Select date",
                        },
                      ]}
                    >
                      <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Time"
                      name="time"
                      rules={[
                        {
                          required: true,
                          message: "Please Select time",
                        },
                      ]}
                    >
                      <TimePicker style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
                <p />
                <Row gutter={16}>
                  <Col span={24}>
                    <span style={{ float: "right" }}>
                      <Button onClick={createTaskModalClose}>Cancel</Button>
                      &nbsp;&nbsp;
                      <Button key="submit" onClick={createNewTask}>
                        Save
                      </Button>
                    </span>
                  </Col>
                </Row>
              </Form>
            </Card>
          </div>
        </Spin>
      </Modal>
    </Spin>
  );
};

export default HomePage;

