import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { notification, Spin, Modal, Table, Row, Col, Button, message, Input, Card, Form, Select, Checkbox, Tabs } from "antd";
import { useWindowContext, useGlobalContext } from "../../../lib/storage";
import {
  getUserRoleAccessTab,
  saveNewUser,
  getUserAccess,
  getUsersBusinessUnit,
  getUsersHomeDashboard,
  getUsersHomeWindow,
  getUsersHomeReport,
  getUsersDefaultRole,
  getUsersDefaultBusinessUnit,
  getPassWordChangeData
} from "../../../services/generic";
import ThemeJson from"../../../constants/UIServer.json";
import { LoadingOutlined } from "@ant-design/icons";
import InvoiceLogo from "../../../assets/images/invoice.svg";
import "antd/dist/antd.css";

const UserWindowHeader = (props) => {
  const history = useHistory();
  const { globalStore } = useGlobalContext();
  let usersData = JSON.parse(localStorage.getItem("userData"));
  const Themes = ThemeJson;

  const [usersBusinessUnitDropdown, setUsersBusinessUnitDropdown] = useState([]);
  const [usersHomeDashboardDropdown, setUsersHomeDashboardDropdown] = useState([]);
  const [loading, setLoading] = useState(false);

  const [usersHomeWindowDropdown, setUsersHomeWindowDropdown] = useState([]);
  const [usersHomeReportDropdown, setUsersHomeReportDropdown] = useState([]);

  const [usersDefaultRoleDropdown, setUsersDefaultRoleDropdown] = useState([]);
  const [usersDefaultBusinessUnitDropdown, setUsersDefaultBusinessUnitDropdown] = useState([]);

  const [lineBusinessUnitData, setLineBusinessUnitData] = useState([]);
  const [lineBusinessUnitDataCopy, setLineBusinessUnitDataCopy] = useState([]);
  const [lineRolesData, setLineRolesData] = useState([]);
  const [lineRolesDataCopy, setLineRolesDataCopy] = useState([]);
  const [buModalVisible, setBuModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [usersRoleAccessDropdown, setUsersRoleAccessDropdown] = useState([]);

  const [autoGeneratePassFlag, setAutoGeneratePassFlag] = useState(true);
  const [passwordModalVisible,setPasswordModalVisible] = useState(false)

  const [isCreatorCheck, setIsCreatorCheck] = useState(false);
  const [displayShow, setdisplayShow] = useState("block");

  const [headerFormData, setHeaderFormData] = useState({});
  const [isAdminChecked,setisAdminChecked] = useState(false)
  const [autoGeneratePassFlagforModal,setautoGeneratePassFlagforModal] = useState(true)
  const [value, setValue] = useState('');

  const userId = localStorage.getItem("csUserId");

  const [form] = Form.useForm();
  const [passChangeform] = Form.useForm()
  const { TextArea } = Input;
  const { Option } = Select;
  const { TabPane } = Tabs;
  const moment = require("moment");

  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 12,
    sm: 12,
    md: 12,
  };
  useEffect(async () => {
    if (userId === "undefined") {
      setdisplayShow("none");
    } else {
      getuserData()
    }

    const getUsersBusinessUnitData = await getUsersBusinessUnit();
    setUsersBusinessUnitDropdown(getUsersBusinessUnitData);

    const getUsersHomeDashboardData = await getUsersHomeDashboard();
    setUsersHomeDashboardDropdown(getUsersHomeDashboardData);

    const getUsersHomeWindowData = await getUsersHomeWindow();
    setUsersHomeWindowDropdown(getUsersHomeWindowData);

    const getUsersHomeReportData = await getUsersHomeReport();
    setUsersHomeReportDropdown(getUsersHomeReportData);

    const getUsersDefaultRoleData = await getUsersDefaultRole(userId);
    setUsersDefaultRoleDropdown(getUsersDefaultRoleData);

    const getUsersDefaultBusinessUnitData = await getUsersDefaultBusinessUnit(userId);
    setUsersDefaultBusinessUnitDropdown(getUsersDefaultBusinessUnitData);

    const getUserRoleAccessTabData = await getUserRoleAccessTab();
    setUsersRoleAccessDropdown(getUserRoleAccessTabData);
    setLoading(false);
  }, []);

  const getuserData = async() =>{
    setLoading(true);
       const userId = localStorage.getItem("csUserId");
      const getUserAccessData = await getUserAccess(userId);
      setHeaderFormData(getUserAccessData);
      form.setFieldsValue({
        firstname: getUserAccessData["firstname"],
        lastname: getUserAccessData["lastname"],
        username: getUserAccessData["username"],
        email: getUserAccessData["email"],
        description: getUserAccessData["description"],
        isadmin: getUserAccessData["isadmin"],
        bunitname: getUserAccessData["csBunitId"],
        defaultbunit: getUserAccessData["default_cs_bunit_id"],
        defaultrole: getUserAccessData["default_cs_role_id"],
        home_dashboard_id: getUserAccessData["home_dashboard_id"],
        home_report_id: getUserAccessData["home_report_id"],
        home_window_id: getUserAccessData["home_window_id"],
      });
      setisAdminChecked(getUserAccessData["isadmin"] === "Y" ? true :false)
      setLineBusinessUnitData(getUserAccessData["buAccess"]);
      setLineBusinessUnitDataCopy(getUserAccessData["buAccess"])
      setLineRolesData(getUserAccessData["roleAccess"]);
      setLineRolesDataCopy(getUserAccessData["roleAccess"])
      setLoading(false);
  }

  const onFinish = async (values) => {
    const now = moment().format("YYYY-MM-DD h:mm:ss");
    const roleAccessTosend = [];
    const bussinessAccessTosend = [];
    for (let index = 0; index < lineRolesData.length; index++) {
      const eleroleId = lineRolesData[index].roleId;
      const eleCsuserAccess = lineRolesData[index].csUserAccessId;
      const eleisCreator = lineRolesData[index].isCreator === true ? "Y" : "N";
      roleAccessTosend.push({ roleId: eleroleId, csUserAccessId: eleCsuserAccess, isCreator: eleisCreator });
    }
    for (let index1 = 0; index1 < lineBusinessUnitData.length; index1++) {
      const eleroleId1 = lineBusinessUnitData[index1].bunitid;
      const eleCsbu = lineBusinessUnitData[index1].csuserbunitid;
      bussinessAccessTosend.push({ bunitid: eleroleId1, csuserbunitid: eleCsbu });
    }
    const concatName = values["firstname"] + " " + values["lastname"];
    const obj = {
      csUserId: userId === "undefined" ? null : userId,
      created: now,
      createdby: usersData["user_id"],
      updated: now,
      updatedby: usersData["user_id"],
      isadmin: isAdminChecked === true ? "Y" : "N",
      isactive: "Y",
      csClientId: usersData["cs_client_id"],
      csWindowId: null,
      description: values["description"],
      email: values["email"],
      firstname: values["firstname"],
      lastname: values["lastname"],
      name: concatName,
      username: values["username"],
      password: autoGeneratePassFlag === false ? values["password"] : null,
      csBunitId: values["bunitname"],
      default_cs_role_id: values["defaultrole"],
      default_cs_bunit_id: values["defaultbunit"],

      home_dashboard_id: values["home_dashboard_id"],
      home_report_id: values["home_report_id"],
      home_window_id: values["home_window_id"],

      buAccess: bussinessAccessTosend,
      roleAccess: roleAccessTosend,
    };

    const newStrigifiedJson = JSON.stringify(JSON.stringify(obj));
    const saveNewUserDetails = await saveNewUser(newStrigifiedJson);

    if (saveNewUserDetails.messageCode == 200) {
      let userData = JSON.parse(saveNewUserDetails.data);
      localStorage.setItem("csUserId", userData["csUserId"]);
      notification.success({
        message: saveNewUserDetails.message,
      });
      setTimeout(() => {
        getuserData()
      }, 500);
      setdisplayShow('block')
    } else {
      notification.info({
        message: saveNewUserDetails.message,
      });
    }
  };

  const columnsForBusinessUnit = [
    {
      width: 50,
      checkboxSelection(params) {
        return params.columnApi.getRowGroupColumns().length === 0;
      },
      headerCheckboxSelection(params) {
        return params.columnApi.getRowGroupColumns().length === 0;
      },
    },
    {
      title: "Business unit",
      dataIndex: "bunitname",
    },
  ];

  const columnsForRole = [
    {
      width: 50,
      checkboxSelection(params) {
        return params.columnApi.getRowGroupColumns().length === 0;
      },
      headerCheckboxSelection(params) {
        return params.columnApi.getRowGroupColumns().length === 0;
      },
    },
    {
      title: "Role",
      dataIndex: "roleName",
    },
    {
      title: "Creator",
      dataIndex: "isCreator",
      render: (text, record) => {
        return record.isCreator === true || record.isCreator === "Y" ? "Y" : "N";
      },
    },
  ];

  const handleOk = () => {
    form.validateFields().then(values => {
      form.submit();
    })
  };

  const onFinishForBusinessUnit = async (fieldsValue) => {
    const roleBusinessUnit = fieldsValue["roleBusinessUnit"];
    let selectedBU = usersBusinessUnitDropdown.find((o) => o.recordid === roleBusinessUnit);

    let values = [
      {
        bunitid: roleBusinessUnit,
        csuserbunitid: null,
        bunitname: selectedBU["name"],
      },
    ];

    var finalLineBusinessUnit = [...lineBusinessUnitData, ...values];
    setLineBusinessUnitData(finalLineBusinessUnit);
    setLineBusinessUnitDataCopy(finalLineBusinessUnit)
    setBuModalVisible(false);
  };

  const onFinishForLineRole = async (fieldsValue) => {
    const roleForLine = fieldsValue["lineRole"];
    let selectedBU = usersRoleAccessDropdown.find((o) => o.recordid === roleForLine);

    let values = [
      {
        roleId: roleForLine,
        csUserAccessId: null,
        roleName: selectedBU["name"],
        isCreator: isCreatorCheck,
      },
    ];

    var finalLineBusinessUnit = [...lineRolesData, ...values];
    setLineRolesData(finalLineBusinessUnit);
    setLineRolesDataCopy(finalLineBusinessUnit)
    setRoleModalVisible(false);
  };

  const handleCancel = () => {
    setBuModalVisible(false);
    setRoleModalVisible(false);
    setPasswordModalVisible(false)
  };

  const displayBusinessUnitLine = () => {
    form.resetFields(['roleBusinessUnit'])
    setBuModalVisible(true);
  };

  const displayRoleLine = () => {
    form.resetFields(['lineRole'])
    setRoleModalVisible(true);
  };

  const onChangeAutogeneratePassFlag = (e) => {
    setAutoGeneratePassFlag(e.target.checked);
  };

  const isCreatoronChange = (e) => {
    setIsCreatorCheck(e.target.checked);
  };

  const editFields = () => {
    setdisplayShow("none");
  };

  const onChangeAdmin = (e) => {
    setisAdminChecked(e.target.checked)
  }

  const passWordChangeModal = () =>{
    setPasswordModalVisible(true)
  }

 const onChangeAutogeneratePassFlagforModal = (e)=>{
    setautoGeneratePassFlagforModal(e.target.checked)
  }

const changePassword = () =>{
  passChangeform.validateFields().then(values => {
    const password = values.passwordnew2
    getPassWordChange(password)
  })
}

const getPassWordChange =  async (password) =>{
  setLoading(true)
  const userId = localStorage.getItem("csUserId");
  const response = await getPassWordChangeData(autoGeneratePassFlagforModal === false ? password :null,userId)
  if(response.messageCode === "200"){
    setLoading(false)
    setPasswordModalVisible(false)
    setautoGeneratePassFlagforModal(true)
    message.success(response.message)
  }else{
    setLoading(false)
    setPasswordModalVisible(false)
    setautoGeneratePassFlagforModal(true)
    message.success(response.message)
  }
}
  return (
    <div>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
        <Row>
          <Col {...responsiveDesignForColumn}>
            <img src={InvoiceLogo} alt="invoice" align="left" /> <p style={Themes.contentWindow.ListWindowHeader.listWindowTitle}> &ensp;User</p>
          </Col>

          <Col {...responsiveDesignForColumn} style={{textAlign:'right'}}>
            {displayShow === "none" ? (
              <Button type="default" onClick={handleOk} htmlType="submit" style={{height:'2rem',width:'5.4rem',backgroundColor:'rgb(8 158 164)',border:'0.25px solid rgb(7, 136, 141)',borderRadius:'2px',fontSize:'14px',color:'rgb(255, 255, 255)',fontWeight:'500',fontFamily:'Open Sans',opacity:'1'}}>
                Save
              </Button>
            ) : (
              <Button onClick={editFields} style={{height:'2rem',width:'5.4rem',backgroundColor:'rgb(8 158 164)',border:'0.25px solid rgb(7, 136, 141)',borderRadius:'2px',fontSize:'14px',color:'rgb(255, 255, 255)',fontWeight:'500',fontFamily:'Open Sans',opacity:'1'}} /* style={Themes.contentWindow.ListWindowHeader.newButtonForlist} */>
                Edit
              </Button>
            )}
            &nbsp;
            <Button
              type="default"
              onClick={() => {
                history.push(`/others/window/7198`);
              }}
              style={{
                cursor: "pointer",
                fontSize: "14px",
                height: "2rem",
                width: "5.4rem",
                border: "0.25px solid rgb(7, 136, 141)",
                borderRadius: "2px",
                opacity: 1,
                fontWeight: 500,
                margin: "0px 5px 0px 0px",
                // float: "right",
              }}

              // style={Themes.contentWindow.ListWindowHeader.newButtonForlist}
            >
              Cancel
            </Button>
            &nbsp;
            {userId !== "undefined" ? (
              <span>
                  <span style={{ cursor: 'pointer' }}>
                    <i
                      class="fa fa-ellipsis-v"
                      style={{ fontSize: '20px', marginTop: '4px' }}
                      onClick={passWordChangeModal}
                      aria-hidden="true"
                    />
                  </span>
                </span>
           ) : null}
          </Col>
        </Row>
        <Card style={Themes.contentWindow.recordWindow.RecordHeader.headerCard}>
          <Form layout="vertical" name="control-hooks" form={form} onFinish={onFinish}>
            <Row gutter={16}>
              <Col span={6}>
                <span>
                  {displayShow === "block" ? (
                    <Form.Item label="Business Unit" name="bunitname">
                      <span>{headerFormData.bunitname}</span>
                    </Form.Item>
                  ) : (
                    <Form.Item 
                    label="Business Unit" 
                    name="bunitname"
                    rules={[
                      {
                        required: true,
                        message: 'Please select business unit!',
                      },
                    ]}
                    >
                      <Select
                        className="ant-select-enabled"
                        dropdownClassName="certain-category-search-dropdown"
                        placeholder="Business Unit"
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 228 }}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        style={{ width: "100%" }}
                      >
                        {usersBusinessUnitDropdown.map((option, index) => (
                          <Option key={`${index}-${option.name}`} value={option.recordid}>
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </span>
              </Col>
              <Col span={6}>
                <span>
                  {displayShow === "block" ? (
                    <Form.Item label="First Name" name="firstname">
                      <span>{headerFormData.firstname}</span>
                    </Form.Item>
                  ) : (
                    <Form.Item 
                    label="First Name" 
                    name="firstname"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter firstname!',
                      },
                    ]}
                    >
                      <Input placeholder="First name" />
                    </Form.Item>
                  )}
                </span>
              </Col>

              <Col span={6}>
                <span>
                  {displayShow === "block" ? (
                    <Form.Item label="Last name" name="lastname">
                      <span>{headerFormData.lastname}</span>
                    </Form.Item>
                  ) : (
                    <Form.Item label="Last name" 
                    name="lastname"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter lastname!',
                      },
                    ]}>
                      <Input placeholder="Last name" />
                    </Form.Item>
                  )}
                </span>
              </Col>
              <Col span={6}>
                <span>
                  {displayShow === "block" ? (
                    <Form.Item label="Username" name="username">
                      <span>{headerFormData.username}</span>
                    </Form.Item>
                  ) : (
                    <Form.Item label="Username" 
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter username!',
                      },
                    ]}
                    >
                      <Input placeholder="User Name" />
                    </Form.Item>
                  )}
                </span>
              </Col>
            </Row>
            <p style={{ marginBottom: "20px" }} />
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Admin" name="isactive">
                  <Checkbox
                    checked={isAdminChecked}
                    onChange={onChangeAdmin}
                    style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                  >
                    Admin
                  </Checkbox>
                </Form.Item>
              </Col>

              <Col span={6}>
                <span>
                  {displayShow === "block" ? (
                    <Form.Item label="Home Dashboard" name="home_dashboard_id">
                      <span>{headerFormData.home_dashboard_name}</span>
                    </Form.Item>
                  ) : (
                    <Form.Item label="Home Dashboard" name="home_dashboard_id">
                      <Select
                        className="ant-select-enabled"
                        placeholder="Home Report"
                        dropdownClassName="certain-category-search-dropdown"
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 228 }}
                        allowClear={true}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        style={{ width: "100%" }}
                      >
                        {usersHomeDashboardDropdown.map((option, index) => (
                          <Option key={`${index}-${option.name}`} value={option.recordid}>
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </span>
              </Col>
              <Col span={6}>
                <span>
                  {displayShow === "block" ? (
                    <Form.Item label="Home Window" name="home_window_id">
                      <span>{headerFormData.home_window_name}</span>
                    </Form.Item>
                  ) : (
                    <Form.Item label="Home Window" name="home_window_id">
                      <Select
                        className="ant-select-enabled"
                        placeholder="Home Window"
                        dropdownClassName="certain-category-search-dropdown"
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 228 }}
                        allowClear={true}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        style={{ width: "100%" }}
                      >
                        {usersHomeWindowDropdown.map((option, index) => (
                          <Option key={`${index}-${option.name}`} value={option.recordid}>
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </span>
              </Col>
              <Col span={6}>
                <span>
                  {displayShow === "block" ? (
                    <Form.Item label="Home Report" name="home_report_id">
                      <span>{headerFormData.home_report_name}</span>
                    </Form.Item>
                  ) : (
                    <Form.Item label="Home Report" name="home_report_id">
                      <Select
                        className="ant-select-enabled"
                        placeholder="Home Report"
                        dropdownClassName="certain-category-search-dropdown"
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 228 }}
                        allowClear={true}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        style={{ width: "100%" }}
                        // onFocus={this.getHomeReportData}
                        // onChange={this.homeReportOnchange}
                      >
                        {usersHomeReportDropdown.map((option, index) => (
                          <Option key={`${index}-${option.name}`} value={option.recordid}>
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </span>
              </Col>
            </Row>
            <p style={{ marginBottom: "20px" }} />
            <Row gutter={16}>
              {userId === "undefined" ? (
                <Col span={6}>
                  <Form.Item>
                    <Checkbox checked={autoGeneratePassFlag} onChange={onChangeAutogeneratePassFlag} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}>
                      Auto Generate password
                    </Checkbox>
                  </Form.Item>
                </Col>
              ) : (
                <Col span={6}>
                  <span>
                    {displayShow === "block" ? (
                      <Form.Item label="Default Role" name="defaultrole">
                        <span>{headerFormData.defaultCsRoleName}</span>
                      </Form.Item>
                    ) : (
                      <Form.Item label="Default Role" name="defaultrole">
                        <Select
                          className="ant-select-enabled"
                          placeholder="Default role"
                          dropdownClassName="certain-category-search-dropdown"
                          dropdownMatchSelectWidth={false}
                          dropdownStyle={{ width: 228 }}
                          showSearch
                          allowClear={true}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          style={{ width: "100%" }}
                          // onChange={this.defaultRoleOnchange}
                        >
                          {usersDefaultRoleDropdown.map((option, index) => (
                            <Option key={`${index}-${option.name}`} value={option.recordid}>
                              {option.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                  </span>
                </Col>
              )}

              {autoGeneratePassFlag == false ? (
                <Col span={6}>
                  <Form.Item label="Password" name="password">
                    <Input.Password placeholder="Password" />
                  </Form.Item>
                </Col>
              ) : (
                ""
              )}

              {userId === "undefined" ? (
                ""
              ) : (
                <Col span={6}>
                  <span>
                    {displayShow === "block" ? (
                      <Form.Item label="Default Business Unit" name="defaultbunit">
                        <span>{headerFormData.defaultCsBunitName}</span>
                      </Form.Item>
                    ) : (
                      <Form.Item label="Default Business Unit" name="defaultbunit">
                        <Select
                          className="ant-select-enabled"
                          placeholder="Default Business Unit"
                          dropdownClassName="certain-category-search-dropdown"
                          dropdownMatchSelectWidth={false}
                          dropdownStyle={{ width: 228 }}
                          showSearch
                          allowClear={true}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          style={{ width: "100%" }}
                          // onChange={this.defaultBunitOnchange}
                        >
                          {usersDefaultBusinessUnitDropdown.map((option, index) => (
                            <Option key={`${index}-${option.name}`} value={option.recordid}>
                              {option.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                  </span>
                </Col>
              )}

              <Col span={6}>
                <span>
                  {displayShow === "block" ? (
                    <Form.Item label="Email" name="email">
                      <span>{headerFormData.email}</span>
                    </Form.Item>
                  ) : (
                    <Form.Item label="Email" name="email">
                      <Input placeholder="Email" />
                    </Form.Item>
                  )}
                </span>
              </Col>
              <Col span={6}>
                <span>
                  {displayShow === "block" ? (
                    <Form.Item label="Description" name="description">
                      <span>{headerFormData.description}</span>
                    </Form.Item>
                  ) : (
                    <Form.Item label="Description" name="description">
                      <TextArea placeholder="Description" />
                    </Form.Item>
                  )}
                </span>
              </Col>
            </Row>
            <p />
          </Form>
        </Card>
        <div /* style={Themes.contentWindow.recordWindow.RecordLines.mainDiv} */>
          <Row>
            <Col span={24}>
              <Tabs
                // tabBarStyle={Themes.contentWindow.recordWindow.RecordLines.TabStyle}
                type="card"
                defaultActiveKey="0"
              >
                <TabPane tab="Business Unit" key="1">
                  <Row>
                    <Col span={6} /* style={Themes.contentWindow.recordWindow.RecordLines.linesSearchPadding} */>
                      <Input
                        placeholder="Search"
                        value={value}
                        onChange={e => {
                          let currValue = e.target.value;
                          setValue(currValue);
                          const filteredData = lineBusinessUnitDataCopy.filter(entry =>
                            entry.bunitname !== null && entry.bunitname.toLowerCase().includes(currValue.toLowerCase())
                          );
                          setLineBusinessUnitData(filteredData);
                        }}
                        style={{ width: "85%" }}
                        suffix={<i className="fa fa-search" role="presentation" aria-hidden="true" /* style={Themes.contentWindow.recordWindow.RecordLines.linesSearchIcon} */ />}
                      />
                    </Col>
                    <Col span={28}>
                        {userId === "undefined" ? null :
                        <Button onClick={displayBusinessUnitLine}>+Add New</Button>
                      }
                    </Col>
                  </Row>
                  <div>
                    <Table
                      /* style={Themes.contentWindow.recordWindow.RecordLines.linesTable} */
                      size="small"
                      scroll={{ y: "20vh" }}
                      pagination={false}
                      columns={columnsForBusinessUnit}
                      dataSource={lineBusinessUnitData}
                    />
                  </div>
                </TabPane>
                <TabPane tab="Role" key="2">
                  <Row>
                    <Col span={6} /* style={Themes.contentWindow.recordWindow.RecordLines.linesSearchPadding} */>
                      <Input
                        placeholder="Search"
                        value={value}
                        onChange={e => {
                          let currValue = e.target.value;
                          setValue(currValue);
                          const filteredData = lineRolesDataCopy.filter(entry =>
                            entry.roleName !== null && entry.roleName.toLowerCase().includes(currValue.toLowerCase())
                          );
                          setLineRolesData(filteredData);
                        }}
                        style={{ width: "85%" }}
                        suffix={<i className="fa fa-search" role="presentation" aria-hidden="true" /* style={Themes.contentWindow.recordWindow.RecordLines.linesSearchIcon} */ />}
                      />
                    </Col>
                    <Col span={28}>
                      <Button /* style={Themes.contentWindow.recordWindow.RecordLines.LinesAddNewButton}*/ onClick={displayRoleLine}>+Add New</Button>
                    </Col>
                  </Row>
                  <div>
                    <Table
                      /* style={Themes.contentWindow.recordWindow.RecordLines.linesTable} */
                      size="small"
                      scroll={{ y: "20vh" }}
                      pagination={false}
                      columns={columnsForRole}
                      dataSource={lineRolesData}
                    />
                  </div>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </div>
        <Modal
          visible={buModalVisible}
          onCancel={handleCancel}
          width="25%"
          // height="94%"
          style={{ top: "10px" }}
          centered
          bodyStyle={{ padding: "0px" }}
          footer={[
            <div>
              <Button
                // className={`${styles.buttonStylesforlistProduct}`}
                onClick={handleOk}
                htmlType="submit"
                style={{
                  backgroundColor: "#089ea4",
                  color: "#fff",
                  border: "0.5px",
                  fontSize: "12px",
                  fontWeight: "700",
                  height: "35px",
                  width: "105px",
                  borderRadius: "2px",
                }}
              >
                <span>Submit</span>
              </Button>
              <Button
                key="back"
                onClick={handleCancel}
                style={{
                  backgroundColor: "#ececec",
                  border: "none",
                  color: "dimgray",
                  height: "35px",
                  width: "105px",
                  fontWeight: 600,
                }}
                // className={`${styles.buttonStylesforlistProductCancel}`}
              >
                Cancel
              </Button>
            </div>,
          ]}
        >
          <Card style={{ backgroundColor: "#ececec" }}>
            <h3
              style={{
                fontWeight: "500",
                fontSize: "19px",
                color: "black",
                marginTop: "4px",
                marginLeft: "2px",
              }}
            >
              <span>Add Business Unit</span>
            </h3>
            <Card style={Themes.contentWindow.recordWindow.RecordHeader.headerCard}>
              <Form layout="vertical" name="control-hooks" form={form} onFinish={onFinishForBusinessUnit}>
                <Row>
                  <Col span={24}>
                    <Form.Item label="Business Unit" name="roleBusinessUnit">
                      <Select
                        className="ant-select-enabled"
                        dropdownClassName="certain-category-search-dropdown"
                        placeholder="Business Unit"
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 228 }}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        style={{ width: "100%" }}
                        // onChange={this.BuintOnchange}
                      >
                        {usersBusinessUnitDropdown.map((option, index) => (
                          <Option key={`${index}-${option.name}`} value={option.recordid}>
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <p />
              </Form>
            </Card>
          </Card>
        </Modal>
        <Modal
          visible={roleModalVisible}
          onCancel={handleCancel}
          width="25%"
          // height="94%"
          style={{ top: "10px" }}
          centered
          bodyStyle={{ padding: "0px" }}
          footer={[
            <div>
              <Button
                // className={`${styles.buttonStylesforlistProduct}`}
                onClick={handleOk}
                htmlType="submit"
                style={{
                  backgroundColor: "#089ea4",
                  color: "#fff",
                  border: "0.5px",
                  fontSize: "12px",
                  fontWeight: "700",
                  height: "35px",
                  width: "105px",
                  borderRadius: "2px",
                }}
              >
                <span>Submit</span>
              </Button>
              <Button
                key="back"
                onClick={handleCancel}
                style={{
                  backgroundColor: "#ececec",
                  border: "none",
                  color: "dimgray",
                  fontWeight: 600,
                  height: "35px",
                  width: "105px",
                }}
                // className={`${styles.buttonStylesforlistProductCancel}`}
              >
                Cancel
              </Button>
            </div>,
          ]}
        >
          <Card style={{ backgroundColor: "#ececec" }}>
            <h3
              style={{
                fontWeight: "500",
                fontSize: "19px",
                color: "black",
                marginTop: "4px",
                marginLeft: "2px",
              }}
            >
              <span>Add Role</span>
            </h3>
            <Card /* style={Themes.contentWindow.recordWindow.RecordHeader.headerCard} */>
              <Form layout="vertical" name="control-hooks" form={form} onFinish={onFinishForLineRole}>
                <Row>
                  <Col span={24}>
                    <Form.Item label="Role" name="lineRole">
                      <Select
                        className="ant-select-enabled"
                        dropdownClassName="certain-category-search-dropdown"
                        placeholder="Role"
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 228 }}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        style={{ width: "100%" }}
                        // onChange={this.BuintOnchange}
                      >
                        {usersRoleAccessDropdown.map((option, index) => (
                          <Option key={`${index}-${option.name}`} value={option.recordid}>
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <br />
                    <Form.Item label="Creator" name="creator">
                      <Checkbox checked={isCreatorCheck} onChange={isCreatoronChange} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Card>
        </Modal>
        <Modal
          visible={passwordModalVisible}
          onCancel={handleCancel}
          width="25%"
          // height="94%"
          style={{ top: "10px" }}
          centered
          bodyStyle={{ padding: "0px" }}
          footer={[
            <div>
              <Button
                // className={`${styles.buttonStylesforlistProduct}`}
                onClick={changePassword}
                htmlType="submit"
                style={{
                  backgroundColor: "#089ea4",
                  color: "#fff",
                  border: "0.5px",
                  fontSize: "12px",
                  fontWeight: "700",
                  height: "35px",
                  width: "105px",
                  borderRadius: "2px",
                }}
              >
                <span>Submit</span>
              </Button>
              <Button
                key="back"
                onClick={handleCancel}
                style={{
                  backgroundColor: "#ececec",
                  border: "none",
                  color: "dimgray",
                  fontWeight: 600,
                  height: "35px",
                  width: "105px",
                }}
                // className={`${styles.buttonStylesforlistProductCancel}`}
              >
                Cancel
              </Button>
            </div>,
          ]}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
          <Card style={{ backgroundColor: "#ececec" }}>
            <h3
              style={{
                fontWeight: "500",
                fontSize: "19px",
                color: "black",
                marginTop: "4px",
                marginLeft: "2px",
              }}
            >
              <span>Reset Password</span>
            </h3>
            <Card /* style={Themes.contentWindow.recordWindow.RecordHeader.headerCard} */>
              <Form layout="vertical" name="control-hooks14" form={passChangeform}>
                <Row>
                <Col span={24}>
                      <Checkbox checked={autoGeneratePassFlagforModal} onChange={onChangeAutogeneratePassFlagforModal} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}>Auto Generate password</Checkbox>
                </Col>
                  <Col span={24}>
                  {autoGeneratePassFlagforModal === false ?(
                    <Form.Item label="Password" 
                    name="passwordnew2"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter password!',
                      },
                    ]}>

                    <Input.Password placeholder="Password" />
                    </Form.Item>
                     ):''}
                  </Col>
                </Row>
              </Form>
            </Card>
          </Card>
          </Spin>
        </Modal>
      </Spin>
    </div>
  );
};

export default UserWindowHeader;
