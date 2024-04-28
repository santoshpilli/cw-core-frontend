import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Dropdown, Menu, notification, Spin, Modal, Table,message, Row, Col, Button, Input, Card, Form, Select, Checkbox } from "antd";
import {
  activeAdminRole,
  enableRoleBaseOnActiveMode,
  getUsersFromRole,
  enableAdminRole,
  enableActiveRole,
  getCopyRoleGrid,
  getUserRoleAccessTab,
  getModuleAccessData,
  getModulesDropdownData,
  getRolesFieldsAccess,
  updateRoleAccess,
  getRoleAccess,
  deleteRoleAccessData
} from "../../../services/generic";
import { LoadingOutlined } from "@ant-design/icons";
import InvoiceLogo from "../../../assets/images/invoice.svg";
import "antd/dist/antd.css";

const UserWindowHeader = (props) => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const [lineRoleDetailsData, setLineRoleDetailsData] = useState([]);
  const [lineRoleDetailsDataCopy, setLineRoleDetailsDataCopy] = useState([]);

  const [buModalVisible, setBuModalVisible] = useState(false);
  const [moduleAccessModal, setModuleAccessModal] = useState(false);
  const [usersRoleAccessDropdown, setUsersRoleAccessDropdown] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [isCreatorCheck, setIsCreatorCheck] = useState(false);
  const [updateButtonCondition, setUpdateButtonCondition] = useState(false);
  const [processModalForModuleAccess, setProcessModalForModuleAccess] = useState(false);
  const [processDataForModuleAccess, setProcessDataForModuleAccess] = useState([]);
  const [moduleAccessdataSource, setModuleAccessdataSource] = useState([]);

  const [multipleModuleData, setMultipleModuleData] = useState([]);

  const [copyRolesProcessModal, setCopyRolesProcessModal] = useState(false);
  const [copyRolesProcessData, setCopyRolesProcessData] = useState([]);
  const [getUsersFromRoleModal, setGetUsersFromRoleModal] = useState(false);

  const [multipleModuleKeys, setMultipleModuleKeys] = useState([]);
  const [copyRoleModal, setCopyRoleModal] = useState(false);
  const [copyRolesData, setCopyRolesData] = useState([]);
  const [copyDropDownRolesData, setCopyDropDownRolesData] = useState([]);

  const [processData, setProcessData] = useState([]);
  const [processModal, setProcessModal] = useState(false);
  const [makeAdminModal, setMakeAdminModal] = useState(false);
  const [removeAdminModal, setRemoveAdminModal] = useState(false);
  const [usersBaseOnRolesData, setUsersBaseOnRolesData] = useState([]);
  const [roleAccessDataToDelete,setRoleAccessDataToDelete] = useState([])
  const [value, setValue] = useState('');
  const [displayShow, setdisplayShow] = useState("block");
  const [headerData,setheaderData] = useState([])

  const [isAdmin, setIsAdmin] = useState("");
  const [isActive, setIsActive] = useState("");
  const [form] = Form.useForm();
  const { Option } = Select;
  let roleId = localStorage.getItem("csRoleId");

  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 12,
    sm: 12,
    md: 12,
  };
 
  const accessToArray = [
    {
      name: "All",
      recordid: "All",
    },
    {
      name: "Window",
      recordid: "Window",
    },
    {
      name: "Report",
      recordid: "Report",
    },
    {
      name: "Dashboard",
      recordid: "Dashboard",
    },
  ];

  useEffect(() => {
    getData()
  }, [])

  const getData = async () =>{
    setLoading(true);
    const getRoleAccessData = await getRoleAccess(roleId, isAdmin);
    form.setFieldsValue({
      roleName: getRoleAccessData["roleName"],
      description: getRoleAccessData["description"],
      menuId: getRoleAccessData["menu_id"],
    });
    const newData = getRoleAccessData.window
    for (let index = 0; index < newData.length; index++) {
      newData[index].key = newData[index].id;
    }
    setheaderData(getRoleAccessData)
    setRoleName(getRoleAccessData["roleName"]);
    setLineRoleDetailsData(newData);
    setLineRoleDetailsDataCopy(newData)
    setIsActive(getRoleAccessData["isActive"]);
    setIsAdmin(getRoleAccessData["isAdmin"]);
    setLoading(false);
  }
  
  const onFinish = async (values) => {
    let roleName = values.roleName;
    let description = values.description;
    let menuId = values.menuId

    const newArr3 = lineRoleDetailsData;
    const newArray = [];
    for (let k = 0; k < newArr3.length; k += 1) {
      let newObj;
      if (newArr3[k].type === "Window") {
        newObj = {
          csWindowAccessId: newArr3[k].csWindowAccessId,
          delete: newArr3[k].delete === true ? "Y" : "N",
          download: newArr3[k].download === true ? "Y" : "N",
          id: newArr3[k].id,
          moduleId: newArr3[k].moduleId,
          moduleName: newArr3[k].moduleName,
          name: newArr3[k].name,
          process: newArr3[k].process,
          type: newArr3[k].type,
          view: newArr3[k].view === true ? "Y" : "N",
          write: newArr3[k].write === true ? "Y" : "N",
        };
      } else if (newArr3[k].type === "Report" || newArr3[k].type === "Dashboard") {
        newObj = {
          csReportAccessId: newArr3[k].csReportAccessId,
          delete: newArr3[k].delete === true ? "Y" : "N",
          download: newArr3[k].download === true ? "Y" : "N",
          id: newArr3[k].id,
          moduleId: newArr3[k].moduleId,
          moduleName: newArr3[k].moduleName,
          name: newArr3[k].name,
          process: newArr3[k].process,
          type: newArr3[k].type,
          view: newArr3[k].view === true ? "Y" : "N",
          write: newArr3[k].write === true ? "Y" : "N",
        };
      }
      newArray.push(newObj);
    }

    for (let m = 0; m < newArray.length; m += 1) {
      const element4 = newArray[m].process === null ? [] : newArray[m].process === undefined ? [] : newArray[m].process;
      for (let l = 0; l < element4.length; l += 1) {
        const element = element4[l];
        if (element.access === true) {
          element.access = "Y";
        } else if (element.access === false) {
          element.access = "N";
        }
      }
    }

    const roleAccess = {
      roleName: roleName,
      description: description,
      isAdmin: isAdmin,
      isActive: isActive,
      csRoleId: roleId,
      window: newArray,
      menu_id:menuId
    };

    const finalRoleAccess = JSON.stringify(JSON.stringify(roleAccess));
    const updateMainRoleDetails = await updateRoleAccess(finalRoleAccess);

    if (updateMainRoleDetails.messageCode == 200) {
      notification.success({
        message: updateMainRoleDetails.message,
      });
      getData()
      setdisplayShow("block")
      setUpdateButtonCondition(false)
    } else {
      notification.info({
        message: updateMainRoleDetails.message,
      });
    }
  };

  const columnsForRoleDetails = [
    {
      title: "Module",
      dataIndex: "moduleName",
      key: "module",
      //  editable: true,
      /* // width: 180,
                  ...this.getColumnSearchPropsInMainGrid('moduleName'), */
    },
    {
      title: "Type",
      dataIndex: "type",
      // editable: true,
      /*  key: 'type',
                   ...this.getColumnSearchPropsInMainGrid('type'), */
    },
    {
      title: "Name",
      dataIndex: "name",
      //  editable: true,
      /*  key: 'name',
                   // width: 210,
                   ...this.getColumnSearchPropsInMainGrid('name'), */
    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      editable: true,
      render: (value, record, rowIndex) => <Checkbox checked={value} onChange={handleCheckboxChangeRoleFormainGrid(rowIndex, "view", record)} />,

      // render: text => <span>{text == true ||  text === "true" || text === "Y" ? <i class="fa fa-check" aria-hidden="true" /> : <i class="fa fa-times" aria-hidden="true" />}</span>,
    },
    {
      title: "Write",
      dataIndex: "write",
      editable: true,
      key: "write",
      render: (value, record, rowIndex) => (
        <span>
          {record.type === "Report" || record.type === "Dashboard" ? (
            <Checkbox disabled />
          ) : (
            <Checkbox checked={value} onChange={handleCheckboxChangeRoleFormainGrid(rowIndex, "write", record)} />
          )}
        </span>
      ),
      // render: text => <span>{text == true ||  text === "true" || text === "Y" ? <i class="fa fa-check" aria-hidden="true" /> : <i class="fa fa-times" aria-hidden="true" />}</span>,
    },
    {
      title: "Delete",
      dataIndex: "delete",
      editable: true,

      key: "delete",
      render: (value, record, rowIndex) => (
        <span>
          {record.type === "Report" || record.type === "Dashboard" ? (
            <Checkbox disabled />
          ) : (
            <Checkbox checked={value} onChange={handleCheckboxChangeRoleFormainGrid(rowIndex, "delete", record)} />
          )}
        </span>
      ),
      // render: text => <span>{text == true ||  text === "true" || text === "Y" ? <i class="fa fa-check" aria-hidden="true" /> : <i class="fa fa-times" aria-hidden="true" />}</span>,
    },
    {
      title: "Download",
      dataIndex: "download",
      editable: true,

      key: "download",
      render: (value, record, rowIndex) => <Checkbox checked={value} onChange={handleCheckboxChangeRoleFormainGrid(rowIndex, "download", record)} />,
      // render: text => <span>{text == true ||  text === "true" || text === "Y" ? <i class="fa fa-check" aria-hidden="true" /> : <i class="fa fa-times" aria-hidden="true" />}</span>,
    },
    {
      title: "Process",
      key: "process",
      editable: true,

      render: (text) => (
        <span>
          {text.process === null || text.process === undefined ? (
            ""
          ) : (
            <div>
              <i
                className="fa fa-pencil"
                aria-hidden="true"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  getProcessModal(text);
                }}
              />
              &nbsp;&nbsp;&nbsp;
              <span>
                {text.process.map((data) => (
                  <span>
                    {data.processName}:{data.access === true ? "YES |" : "NO |"}
                  </span>
                ))}
              </span>
            </div>
          )}
        </span>
      ),
      // render: text => <span>{text == true ||  text === "true" || text === "Y" ? <i class="fa fa-check" aria-hidden="true" /> : <i class="fa fa-times" aria-hidden="true" />}</span>,
    },
    {
      dataIndex: "process1",
      key: "process1",
    },
  ];

  const handleCheckboxChangeRoleFormainGrid = (rowIndex, columnKey, record) => (event) => {
    delete record[columnKey];
    record[columnKey] = event.target.checked;
    delete lineRoleDetailsData[rowIndex];
    lineRoleDetailsData[rowIndex] = record;
    var finalLineRoleDetails = [...lineRoleDetailsData];

    setLineRoleDetailsData(finalLineRoleDetails);
    setLineRoleDetailsDataCopy(finalLineRoleDetails)
    setdisplayShow('none')
    setUpdateButtonCondition(true);
  };

  const handleOk = () => {
    form.submit();
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

    var finalLineBusinessUnit = [...lineRoleDetailsData, ...values];
    setLineRoleDetailsData(finalLineBusinessUnit);
    setLineRoleDetailsDataCopy(finalLineBusinessUnit)
  };

  const handleCancel = () => {
    setBuModalVisible(false);
    setProcessModalForModuleAccess(false);
    setCopyRolesProcessModal(false);
    setCopyRoleModal(false);
    setRemoveAdminModal(false);
    setGetUsersFromRoleModal(false);
    setMakeAdminModal(false);
  };

  const displayModuleAccess = async () => {
    setModuleAccessModal(true);
    setLoading(true)
    const getRolesFieldsValue = await getRolesFieldsAccess();
    const getModulesDropdownDatas = await getModulesDropdownData();
    setMultipleModuleData(getModulesDropdownDatas);
    setModuleAccessdataSource(getRolesFieldsValue["window"]);
    setLoading(false)
  };

  const displayCopyRole = async () => {
    setCopyRoleModal(true);
    const getUserRoles = await getUserRoleAccessTab();

    setCopyDropDownRolesData(getUserRoles);
  };

  const handleCheckboxforAccess = (rowIndex, columnKey, record) => (event) => {
    const newCheckboxState = [...processData];
    newCheckboxState[rowIndex][columnKey] = event.target.checked;

    var finalProcessData = [...newCheckboxState];
    setProcessData(finalProcessData);
  };

  const getProcessModal = async (data) => {
    const proData = data.process;
    setProcessData(proData);
    setProcessModal(true);
    setUpdateButtonCondition(true);
  };

  const processModalClose = () => {
    setProcessModal(false);
    setModuleAccessModal(false);
    form.resetFields(['moduleAccess','moduleAccessTo'])
  };

  const handleCheckboxChangeFactory = (rowIndex, columnKey, record) => (event) => {
    const newCheckboxState = [...moduleAccessdataSource];
    for (let index = 0; index < newCheckboxState.length; index++) {
      const element = newCheckboxState[index].id;
      if (element === record.id) {
        newCheckboxState[index][columnKey] = event.target.checked;
      }
    }
    setModuleAccessdataSource(newCheckboxState);
  };

  const getProcessModalForModuleAccess = (data) => {
    setProcessModalForModuleAccess(true);
    setProcessDataForModuleAccess(data.process);
  };

  const processColumns = [
    {
      title: "Process",
      dataIndex: "processName",
      key: "processn",
    },
    {
      title: "Access",
      dataIndex: "access",
      key: "access",
      render: (value, record, rowIndex) => <Checkbox checked={value} onChange={handleCheckboxforAccess(rowIndex, "access", record)} />,
    },
  ];

  const usersBaseOnRolesColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
  ];

  const ModuleAccessColumns = [
    {
      title: "Module",
      dataIndex: "moduleName",
      key: "module",
      //  ...this.getColumnSearchPropsInMainGrid('moduleName'),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      //  ...this.getColumnSearchPropsInMainGrid('type'),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      //...this.getColumnSearchPropsInMainGrid('name'),
    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      render: (value, record, rowIndex) => <Checkbox checked={value} onChange={handleCheckboxChangeFactory(rowIndex, "view", record)} />,
    },
    {
      title: "Write",
      dataIndex: "write",
      key: "write",
      render: (value, record, rowIndex) => (
        <span>
          {record.type === "Report" || record.type === "Dashboard" ? (
            <Checkbox disabled />
          ) : (
            <Checkbox checked={value} onChange={handleCheckboxChangeFactory(rowIndex, "write", record)} />
          )}
        </span>
      ),
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      render: (value, record, rowIndex) => (
        <span>
          {record.type === "Report" || record.type === "Dashboard" ? (
            <Checkbox disabled />
          ) : (
            <Checkbox checked={value} onChange={handleCheckboxChangeFactory(rowIndex, "delete", record)} />
          )}
        </span>
      ),
    },
    {
      title: "Download",
      dataIndex: "download",
      key: "download",
      render: (value, record, rowIndex) => <Checkbox checked={value} onChange={handleCheckboxChangeFactory(rowIndex, "download", record)} />,
    },
    {
      title: "Process",
      key: "process",
      render: (text) => (
        <span>
          {text.process === null || text.process === undefined ? (
            ""
          ) : (
            <div>
              <i
                className="fa fa-pencil"
                aria-hidden="true"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  getProcessModalForModuleAccess(text);
                }}
              />
            </div>
          )}
        </span>
      ),
    },
  ];

  const moduleMenudata = multipleModuleData.map((data) => {
    return (
      <Option key={data.recordid} value={data.recordid}>
        {data.name}
      </Option>
    );
  });

  const processColumnsForModuleAccess = [
    {
      title: "Process",
      dataIndex: "processName",
      key: "processn",
    },
    {
      title: "Access",
      dataIndex: "access",
      key: "access",
      render: (value, record, rowIndex) => <Checkbox checked={value} onChange={handleCheckboxforModuleProcess(rowIndex, "access", record)} />,
    },
  ];

  const handleCheckboxforModuleProcess = (rowIndex, columnKey, record) => (event) => {
    const newCheckboxState = [...processDataForModuleAccess];
    newCheckboxState[rowIndex][columnKey] = event.target.checked;

    var finalProcessData = [...newCheckboxState];
    setProcessDataForModuleAccess(finalProcessData);
  };

  const submitModuleAccess = () => {
    form.submit("moduleAccess");
  };

  const submitCopyRoles = () => {
    form.submit("copyRolesForm");
  };

  const onFinishModuleAccess = async (values) => {
    let roleName = values["roleName"];
    let accessTo = values["moduleAccessTo"];
    let moduleAccess = values["moduleAccess"];
    let description = values["description"]

    const newArr = moduleAccessdataSource;
    const newArr3 = newArr;
    const newArray = [];
    for (let k = 0; k < newArr3.length; k += 1) {
      let newObj;
      if (newArr3[k].type === "Window") {
        newObj = {
          csWindowAccessId: newArr3[k].csWindowAccessId,
          delete: newArr3[k].delete === true ? "Y" : "N",
          download: newArr3[k].download === true ? "Y" : "N",
          id: newArr3[k].id,
          moduleId: newArr3[k].moduleId,
          moduleName: newArr3[k].moduleName,
          name: newArr3[k].name,
          process: newArr3[k].process,
          type: newArr3[k].type,
          view: newArr3[k].view === true ? "Y" : "N",
          write: newArr3[k].write === true ? "Y" : "N",
        };
      } else if (newArr3[k].type === "Report" || newArr3[k].type === "Dashboard") {
        newObj = {
          csReportAccessId: newArr3[k].csReportAccessId,
          delete: newArr3[k].delete === true ? "Y" : "N",
          download: newArr3[k].download === true ? "Y" : "N",
          id: newArr3[k].id,
          moduleId: newArr3[k].moduleId,
          moduleName: newArr3[k].moduleName,
          name: newArr3[k].name,
          process: newArr3[k].process,
          type: newArr3[k].type,
          view: newArr3[k].view === true ? "Y" : "N",
          write: newArr3[k].write === true ? "Y" : "N",
        };
      }
      newArray.push(newObj);
    }
    for (let m = 0; m < newArray.length; m += 1) {
      const element4 = newArray[m].process === null ? [] : newArray[m].process === undefined ? [] : newArray[m].process;
      for (let l = 0; l < element4.length; l += 1) {
        const element = element4[l];
        if (element.access === true) {
          element.access = "Y";
        } else if (element.access === false) {
          element.access = "N";
        }
      }
    }

    const roleAccess = {
      roleName: roleName,
      description:description,
      isAdmin: isAdmin,
      isActive: isActive,
      csRoleId: roleId,
      window: newArray,
    };

    const finalRoleAccess = JSON.stringify(JSON.stringify(roleAccess));

    const updateMainRoleDetails = await updateRoleAccess(finalRoleAccess);

    if (updateMainRoleDetails.messageCode == 200) {
      notification.success({
        message: updateMainRoleDetails.message,
      });
      setModuleAccessModal(false)
      getData()
      setUpdateButtonCondition(false)
    } else {
      notification.info({
        message: updateMainRoleDetails.message,
      });
    }
  };


  const tosendData = async () =>{
    form.validateFields(['moduleAccess','moduleAccessTo']).then((values) => {
      const moduleIds = JSON.stringify(JSON.stringify(values.moduleAccess));
      const accessToKeyId = values.moduleAccessTo
      getModuleAccessGlobData(moduleIds,accessToKeyId)
    })
  }
  const getModuleAccessGlobData = async (moduleIds,accessToKeyId) =>{
    setLoading(true)
    const updateModualAccessGridBaseOnCondition = await getModuleAccessData(moduleIds, accessToKeyId);
    setModuleAccessdataSource(updateModualAccessGridBaseOnCondition["window"]);
    setLoading(false)
  }

  const copyRoleColumns = [
    {
      title: "Module",
      dataIndex: "moduleName",
      key: "module",
      // ...this.getColumnSearchPropsInMainGrid('moduleName'),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      // ...this.getColumnSearchPropsInMainGrid('type'),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // ...this.getColumnSearchPropsInMainGrid('name'),
    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      render: (value, record, rowIndex) => <Checkbox checked={value} onChange={handleCheckboxForCopyRole(rowIndex, "view", record)} />,
    },
    {
      title: "Write",
      dataIndex: "write",
      key: "write",
      render: (value, record, rowIndex) => (
        <span>
          {record.type === "Report" || record.type === "Dashboard" ? (
            <Checkbox disabled />
          ) : (
            <Checkbox checked={value} onChange={handleCheckboxForCopyRole(rowIndex, "write", record)} />
          )}
        </span>
      ),
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      render: (value, record, rowIndex) => (
        <span>
          {record.type === "Report" || record.type === "Dashboard" ? (
            <Checkbox disabled />
          ) : (
            <Checkbox checked={value} onChange={handleCheckboxForCopyRole(rowIndex, "delete", record)} />
          )}
        </span>
      ),
    },
    {
      title: "Download",
      dataIndex: "download",
      key: "download",
      render: (value, record, rowIndex) => <Checkbox checked={value} onChange={handleCheckboxForCopyRole(rowIndex, "download", record)} />,
    },
    {
      title: "Process",
      key: "process",
      render: (text) => (
        <span>
          {text.process === null || text.process === undefined ? (
            ""
          ) : (
            <div>
              <i
                className="fa fa-pencil"
                aria-hidden="true"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  getProcessModalforCopyrole(text);
                }}
              />
            </div>
          )}
        </span>
      ),
    },
  ];

  const onRolesChange = async (id) => {
    const getCopyRoleOptionsGridData = await getCopyRoleGrid(id);
    setCopyRolesData(getCopyRoleOptionsGridData.window);
  };

  const handleCheckboxForCopyRole = (rowIndex, columnKey, record) => (event) => {
    const newCheckboxState = [...copyRolesData];
    for (let index = 0; index < newCheckboxState.length; index++) {
      const element = newCheckboxState[index].id;
      if (element === record.id) {
        newCheckboxState[index][columnKey] = event.target.checked;
      }
    }
    setCopyRolesData(newCheckboxState);
  };

  const getProcessModalforCopyrole = (data) => {
    setCopyRolesProcessModal(true);
    setCopyRolesProcessData(data.process);
  };

  const handleCheckboxforCopyRoleProcess = (rowIndex, columnKey, record) => (event) => {
    const newCheckboxState = [...copyRolesProcessData];
    newCheckboxState[rowIndex][columnKey] = event.target.checked;

    var finalProcessData = [...newCheckboxState];
    setCopyRolesProcessData(finalProcessData);
  };

  const copyRoleprocessColumns = [
    {
      title: "Process",
      dataIndex: "processName",
      key: "processn",
    },
    {
      title: "Access",
      dataIndex: "access",
      key: "access",
      render: (value, record, rowIndex) => <Checkbox checked={value} onChange={handleCheckboxforCopyRoleProcess(rowIndex, "access", record)} />,
    },
  ];

  const onFinishCopyRoles = async (values) => {
    let description = values.description;
    const newArr = copyRolesData;
    const newArr3 = newArr;
    const newArray = [];
    for (let k = 0; k < newArr3.length; k += 1) {
      let newObj;
      if (newArr3[k].type === "Window") {
        newObj = {
          csWindowAccessId: newArr3[k].csWindowAccessId,
          delete: newArr3[k].delete === true ? "Y" : "N",
          download: newArr3[k].download === true ? "Y" : "N",
          id: newArr3[k].id,
          moduleId: newArr3[k].moduleId,
          moduleName: newArr3[k].moduleName,
          name: newArr3[k].name,
          process: newArr3[k].process,
          type: newArr3[k].type,
          view: newArr3[k].view === true ? "Y" : "N",
          write: newArr3[k].write === true ? "Y" : "N",
        };
      } else if (newArr3[k].type === "Report" || newArr3[k].type === "Dashboard") {
        newObj = {
          csReportAccessId: newArr3[k].csReportAccessId,
          delete: newArr3[k].delete === true ? "Y" : "N",
          download: newArr3[k].download === true ? "Y" : "N",
          id: newArr3[k].id,
          moduleId: newArr3[k].moduleId,
          moduleName: newArr3[k].moduleName,
          name: newArr3[k].name,
          process: newArr3[k].process,
          type: newArr3[k].type,
          view: newArr3[k].view === true ? "Y" : "N",
          write: newArr3[k].write === true ? "Y" : "N",
        };
      }
      newArray.push(newObj);
    }
    for (let m = 0; m < newArray.length; m += 1) {
      const element4 = newArray[m].process === null ? [] : newArray[m].process === undefined ? [] : newArray[m].process;
      for (let l = 0; l < element4.length; l += 1) {
        const element = element4[l];
        if (element.access === true) {
          element.access = "Y";
        } else if (element.access === false) {
          element.access = "N";
        }
      }
    }

    const roleAccess = {
      roleName: roleName,
      description:description,
      isAdmin: isAdmin,
      isActive: isActive,
      csRoleId: roleId,
      window: newArray,
    };
    const finalRoleAccess = JSON.stringify(JSON.stringify(roleAccess));

    const updateMainRoleDetails = await updateRoleAccess(finalRoleAccess);

    if (updateMainRoleDetails.messageCode == 200) {
      notification.success({
        message: updateMainRoleDetails.message,
      });
      setCopyRoleModal(false)
      getData()
      setUpdateButtonCondition(false)
    } else {
      notification.info({
        message: updateMainRoleDetails.message,
      });
    }
  };

  const deleteRoleAccess =  async (values) => {
    setLoading(true)
    let description = values.description;
    const element2Array = []
    for (let i = 0; i < lineRoleDetailsData.length; i += 1) {
      for (let index = 0; index < roleAccessDataToDelete.length; index += 1) {
        if (lineRoleDetailsData[i].id === roleAccessDataToDelete[index]) {
          element2Array.push(lineRoleDetailsData[i])
        }
      }
    }
    const newArr3 = element2Array 
    const newArray = [];
    for (let k = 0; k < newArr3.length; k += 1) {
      let newObj;
      if (newArr3[k].type === "Window") {
        newObj = {
          csWindowAccessId: newArr3[k].csWindowAccessId,
          delete: newArr3[k].delete === true ? "Y" : "N",
          download: newArr3[k].download === true ? "Y" : "N",
          id: newArr3[k].id,
          moduleId: newArr3[k].moduleId,
          moduleName: newArr3[k].moduleName,
          name: newArr3[k].name,
          process: newArr3[k].process,
          type: newArr3[k].type,
          view: newArr3[k].view === true ? "Y" : "N",
          write: newArr3[k].write === true ? "Y" : "N",
        };
      } else if (newArr3[k].type === "Report" || newArr3[k].type === "Dashboard") {
        newObj = {
          csReportAccessId: newArr3[k].csReportAccessId,
          delete: newArr3[k].delete === true ? "Y" : "N",
          download: newArr3[k].download === true ? "Y" : "N",
          id: newArr3[k].id,
          moduleId: newArr3[k].moduleId,
          moduleName: newArr3[k].moduleName,
          name: newArr3[k].name,
          process: newArr3[k].process,
          type: newArr3[k].type,
          view: newArr3[k].view === true ? "Y" : "N",
          write: newArr3[k].write === true ? "Y" : "N",
        };
      }
      newArray.push(newObj);
    }
    for (let m = 0; m < newArray.length; m += 1) {
      const element4 = newArray[m].process === null ? [] : newArray[m].process === undefined ? [] : newArray[m].process;
      for (let l = 0; l < element4.length; l += 1) {
        const element = element4[l];
        if (element.access === true) {
          element.access = "Y";
        } else if (element.access === false) {
          element.access = "N";
        }
      }
    }

    const roleAccess = {
      roleName: roleName,
      description:description,
      isAdmin: isAdmin,
      isActive: isActive,
      csRoleId: roleId,
      window: newArray,
    };
    const finalRoleAccess = JSON.stringify(JSON.stringify(roleAccess));

    const updateMainRoleDetails = await deleteRoleAccessData(finalRoleAccess);
    if(updateMainRoleDetails.messageCode === "200"){
      setRoleAccessDataToDelete([])
      setLoading(false)
      message.success(updateMainRoleDetails.message)
      getData()
  }else{
    setRoleAccessDataToDelete([])
    setLoading(false)
    message.error(updateMainRoleDetails.message)
    getData()
  }

  }

  const content = (
    <Menu>
      {isActive === "N" ? (
        <Menu.Item key="1" style={{ color: "#314659" }} onClick={() => makeActive()}>
          Make Active
        </Menu.Item>
      ) : (
        <Menu.Item key="2" style={{ color: "#314659" }} onClick={() => makeInActive()}>
          Make In-Active
        </Menu.Item>
      )}
      {isAdmin === "N" ? (
        <Menu.Item key="3" style={{ color: "#314659" }} onClick={() => makeAdmin()}>
          Make Admin
        </Menu.Item>
      ) : (
        <Menu.Item key="4" style={{ color: "#314659" }} onClick={() => removeAdmin()}>
          Remove Admin
        </Menu.Item>
      )}
      <Menu.Item key="5" style={{ color: "#314659" }} onClick={() => getUsersModal()}>
        View Users
      </Menu.Item>
    </Menu>
  );

  const makeActive = async () => {
    let roleId = localStorage.getItem("csRoleId");
    const enableActiveRoleData = await enableRoleBaseOnActiveMode(roleId);

    if (enableActiveRoleData.messageCode == 200) {
      notification.success({
        message: enableActiveRoleData.message,
      });
      // setIsActive("Y");
      setTimeout(() => {
        getData()
      }, 200);
    } else {
      notification.info({
        message: enableActiveRoleData.message,
      });
    }
    
  };

  const makeInActive = async () => {
    const enabledAdminView = await enableActiveRole(roleId);

    if (enabledAdminView.messageCode == 200) {
      notification.success({
        message: enabledAdminView.message,
      });
      // setIsActive("N");
      setTimeout(() => {
        getData()
      }, 200);
    } else {
      notification.info({
        message: enabledAdminView.message,
      });
    }
  };

  const makeAdmin = () => {
    setMakeAdminModal(true);
  };

  const removeAdmin = () => {
    setRemoveAdminModal(true);
  };

  const removeAdminAccess = async () => {
    const enableAdminRoleAccess = await enableAdminRole(roleId);
    if (enableAdminRoleAccess.messageCode == 200) {
      notification.success({
        message: enableAdminRoleAccess.message,
      });
      setRemoveAdminModal(false);
      setTimeout(() => {
        getData()
      }, 200);
      // setIsAdmin("N");
    } else {
      notification.info({
        message: enableAdminRoleAccess.message,
      });
      setRemoveAdminModal(false);
    }
  };

  const makeAdminAccess = async () => {
    const activeAdminRoleAccess = await activeAdminRole(roleId);
    if (activeAdminRoleAccess.messageCode == 200) {
      notification.success({
        message: activeAdminRoleAccess.message,
      });
      setMakeAdminModal(false);
      setTimeout(() => {
        getData()
      }, 200);
      // setIsAdmin("Y");
    } else {
      notification.info({
        message: activeAdminRoleAccess.message,
      });
      setMakeAdminModal(false);
    }
  };

  const getUsersModal = async () => {
    setGetUsersFromRoleModal(true);
    const getUsersFromRoleData = await getUsersFromRole(roleId);
    setUsersBaseOnRolesData(getUsersFromRoleData);
  };

  const onChangeDescription = () =>{
    setUpdateButtonCondition(true)
  }
  const getlineSelectedRecords = (e) =>{
    setRoleAccessDataToDelete(e)
  }

  const editFields = () => {
    setdisplayShow("none");
  };

  const linerowSelection = {
    onChange:getlineSelectedRecords
  }
  return (
    <div>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
        <Row>
          <Col {...responsiveDesignForColumn}>
            <img src={InvoiceLogo} alt="invoice" align="left" /> <p /* style={Themes.contentWindow.ListWindowHeader.listWindowTitle} */> &ensp;Role-Details</p>
          </Col>

          {/* {updateButtonCondition == false ? ( */}
            <Col {...responsiveDesignForColumn}>
            <span style={{float:'right'}}>
            {displayShow === "none" ? (
              <span>
              <Button
              type="default"
              onClick={() => {
                history.push(`/others/window/7199`);
              }}
              style={{
                cursor: "pointer",
                fontSize: "14px",
                height: "2rem",
                width: "5.4rem",
                borderRadius: "2px",
                opacity: 1,
                fontWeight: 500,
                margin: "0px 5px 0px 0px",
              }}
            >
              Cancel
            </Button>
              <Button type="default" onClick={handleOk} htmlType="submit" /* style={Themes.contentWindow.ListWindowHeader.newButtonForlist} */>
                Save
              </Button>
              </span>
            ) : (
              <Button onClick={editFields} /* style={Themes.contentWindow.ListWindowHeader.newButtonForlist} */>
                Edit
              </Button>
            )}
              <Dropdown placement="bottomLeft" overlay={content}>
                <Button
                  type="default"
                  style={{
                    cursor: "pointer",
                    fontSize: "14px",
                    height: "2rem",
                    width: "5.4rem",
                    border: "0.25px solid rgb(7, 136, 141)",
                    borderRadius: "2px",
                    opacity: 1,
                    fontWeight: 500,
                    margin: "0px 5px 0px 5px",
                    // float: "right",
                    backgroundColor: "rgb(8, 158, 164)",
                    color: "white",
                  }}
                >
                  Action
                </Button>
              </Dropdown>
              </span>
            </Col>
        </Row>
        <Card /* style={Themes.contentWindow.recordWindow.RecordHeader.headerCard} */>
          <Form layout="vertical" name="control-hooks" form={form} onFinish={onFinish}>
            <Row gutter={16}>
              <Col span={6}>
              <span>
                  {displayShow === "block" ? (
                    <Form.Item label="Role Name" name="roleName">
                      <span>{headerData.roleName}</span>
                    </Form.Item>
                  ) : (
                <Form.Item label="Role Name" name="roleName">
                  <Input placeholder="Role Name" />
                </Form.Item>
                  )}
                  </span>
              </Col>
              <Col span={6}>
              <span>
                  {displayShow === "block" ? (
                    <Form.Item label="Description" name="description">
                      <span>{headerData.description}</span>
                    </Form.Item>
                  ) : (
                <Form.Item label="Description" name="description">
                  <Input onChange={onChangeDescription} placeholder="Description" />
                </Form.Item>
                  )}
                  </span>
              </Col>
              <Col span={6}>
              <span>
                  {displayShow === "block" ? (
                    <Form.Item label="Menu Id" name="menuId">
                      <span>{headerData.menu_id}</span>
                    </Form.Item>
                  ) : (
                <Form.Item label="Menu Id" name="menuId">
                  <Input placeholder="Menu Id" />
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
            <Col span={6} /* style={Themes.contentWindow.recordWindow.RecordLines.linesSearchPadding} */>
              <Input
                placeholder="Search"
                value={value}
                onChange={e => {
                  let currValue = e.target.value;
                  setValue(currValue);
                  const filteredData = lineRoleDetailsDataCopy.filter(entry =>
                    entry.moduleName !== null && entry.moduleName.toLowerCase().includes(currValue.toLowerCase()) ||
                    entry.type !== null && entry.type.toLowerCase().includes(currValue.toLowerCase()) ||
                    entry.name !== null && entry.name.toLowerCase().includes(currValue.toLowerCase())
                  );
                  setLineRoleDetailsData(filteredData);
                }}
                style={{ width: "85%", margin: "5px" }}
                suffix={<i className="fa fa-search" role="presentation" aria-hidden="true" /* style={Themes.contentWindow.recordWindow.RecordLines.linesSearchIcon} */ />}
              />
            </Col>
            <Col span={6}>
              <Button style={{marginTop:'6px'}} /* style={Themes.contentWindow.recordWindow.RecordLines.LinesAddNewButton} */ onClick={displayModuleAccess}>
                + Module Access
              </Button>
            &nbsp;
            <Button style={{marginTop:'6px'}} /* style={Themes.contentWindow.recordWindow.RecordLines.LinesAddNewButton} */ onClick={displayCopyRole}>
                + Copy roles
              </Button>
              </Col>
            <Col span={6} />
            {roleAccessDataToDelete.length > 0 ? 
              <Col span={6}>
              <Button style={{float:'right',marginTop:'6px'}} onClick={deleteRoleAccess}>
                <i className="fa fa-trash"/>
              </Button>
              </Col>
            :null}
          </Row>
          <div>
            <Table
              rowSelection={linerowSelection}
              rowClassName={() => "editable-row"}
              dataSource={lineRoleDetailsData}
              size="small"
              scroll={{ y: "55vh" }}
              columns={columnsForRoleDetails}
              bordered
              pagination={false}
            />
          </div>
        </div>

        <Modal
          visible={processModal}
          onCancel={handleCancel}
          width="25%"
          closable={false}
          // height="94%"
          style={{ top: "10px" }}
          centered
          bodyStyle={{ padding: "0px" }}
          footer={[
            <div>
              <Button
                // className={`${styles.buttonStylesforlistProduct}`}
                onClick={processModalClose}
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
                onClick={processModalClose}
                style={{
                  backgroundColor: "#ececec",
                  border: "none",
                  color: "dimgray",
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
            <Card /* style={Themes.contentWindow.recordWindow.RecordHeader.headerCard} */>
              <Form layout="vertical" name="control-hooks" form={form} onFinish={onFinishForLineRole}>
                <Table dataSource={processData} columns={processColumns} pagination={false} />
              </Form>
            </Card>
          </Card>
        </Modal>
        <Modal
          visible={moduleAccessModal}
          onCancel={handleCancel}
          width="90%"
          height="80%"
          closable={false}
          // height="94%"
          style={{ top: "20px" }}
          centered
          bodyStyle={{ padding: "0px" }}
          footer={[
            <div>
              <Button
                // className={`${styles.buttonStylesforlistProduct}`}
                onClick={submitModuleAccess}
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
                onClick={processModalClose}
                style={{
                  backgroundColor: "#ececec",
                  border: "none",
                  color: "dimgray",
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
              <span>Module Access</span>
            </h3>
            <Card /* style={Themes.contentWindow.recordWindow.RecordHeader.headerCard} */>
              <Form layout="vertical" name="moduleAccess" form={form} onFinish={onFinishModuleAccess}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="Module" name="moduleAccess">
                      <Select
                        className="ant-select-enabled"
                        dropdownClassName="certain-category-search-dropdown"
                        placeholder="Select Module"
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 228 }}
                        //  onFocus={getBusinessUnit}
                        mode="multiple"
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        style={{ width: "100%" }}
                        // onChange={onModuleChange}
                        onChange={tosendData}
                      >
                        {moduleMenudata}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="Access To" name="moduleAccessTo">
                      <Select
                        className="ant-select-enabled"
                        dropdownClassName="certain-category-search-dropdown"
                        placeholder="Select Access To"
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 228 }}
                        //  onFocus={getBusinessUnit}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        style={{ width: "100%" }}
                        // onChange={selectAccessto}
                        onChange={tosendData}
                      >
                        {accessToArray.map((option, index) => (
                          <Option key={`${index}-${option.name}`} value={option.recordid}>
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="New Role Name" name="roleName">
                      <span style={{ fontWeight: "bold" }}>{roleName}</span>
                    </Form.Item>
                  </Col>
                </Row>
                <br />
                <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                <Table
                  style={{ height: "45vh", overflowY: "scroll" }}
                  // rowSelection={ModulerowSelection}
                  rowKey={(record) => record.id}
                  dataSource={moduleAccessdataSource}
                  columns={ModuleAccessColumns}
                  pagination={false}
                />
                </Spin>
              </Form>
            </Card>
          </Card>
        </Modal>

        <Modal
          visible={copyRoleModal}
          onCancel={handleCancel}
          width="75%"
          height="80%"
          closable={false}
          // height="94%"
          style={{ top: "20px" }}
          centered
          bodyStyle={{ padding: "0px" }}
          footer={[
            <div>
              <Button
                // className={`${styles.buttonStylesforlistProduct}`}
                onClick={submitCopyRoles}
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
              <span>Copy Role</span>
            </h3>
            <Card /* style={Themes.contentWindow.recordWindow.RecordHeader.headerCard} */>
              <Form layout="vertical" name="copyRolesForm" form={form} onFinish={onFinishCopyRoles}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="Role" name="copyRole">
                      <Select
                        className="ant-select-enabled"
                        dropdownClassName="certain-category-search-dropdown"
                        placeholder="Select Access To"
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 228 }}
                        //  onFocus={getBusinessUnit}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        style={{ width: "100%" }}
                        onChange={onRolesChange}
                      >
                        {copyDropDownRolesData.map((option, index) => (
                          <Option key={`${index}-${option.name}`} value={option.recordid}>
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="New Role Name" name="newRoleName">
                      <span style={{ fontWeight: "bold" }}>{roleName}</span>
                    </Form.Item>
                  </Col>
                </Row>
                <br />
                <Table
                  style={{ height: "45vh", overflowY: "scroll" }}
                  // rowSelection={ModulerowSelection}
                  rowKey={(record) => record.id}
                  dataSource={copyRolesData}
                  columns={copyRoleColumns}
                  pagination={false}
                />
              </Form>
            </Card>
          </Card>
        </Modal>

        <Modal
          visible={processModalForModuleAccess}
          onCancel={handleCancel}
          width="25%"
          closable={false}
          // height="94%"
          style={{ top: "10px" }}
          centered
          bodyStyle={{ padding: "0px" }}
          footer={[
            <div>
              <Button
                // className={`${styles.buttonStylesforlistProduct}`}
                onClick={handleCancel}
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
                <span>Confirm</span>
              </Button>
              <Button
                key="back"
                onClick={handleCancel}
                style={{
                  backgroundColor: "#ececec",
                  border: "none",
                  color: "dimgray",
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
            <Card /* style={Themes.contentWindow.recordWindow.RecordHeader.headerCard} */>
              <Form layout="vertical" name="control-hooks" form={form} onFinish={onFinishForLineRole}>
                <Table dataSource={processDataForModuleAccess} columns={processColumnsForModuleAccess} pagination={false} />
              </Form>
            </Card>
          </Card>
        </Modal>

        <Modal
          visible={copyRolesProcessModal}
          onCancel={handleCancel}
          width="25%"
          closable={false}
          // height="94%"
          style={{ top: "10px" }}
          centered
          bodyStyle={{ padding: "0px" }}
          footer={[
            <div>
              <Button
                // className={`${styles.buttonStylesforlistProduct}`}
                onClick={handleCancel}
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
                <span>Confirm</span>
              </Button>
              <Button
                key="back"
                onClick={handleCancel}
                style={{
                  backgroundColor: "#ececec",
                  border: "none",
                  color: "dimgray",
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
            <Card /* style={Themes.contentWindow.recordWindow.RecordHeader.headerCard} */>
              <Form layout="vertical" name="control-hooks" form={form} onFinish={onFinishForLineRole}>
                <Table dataSource={copyRolesProcessData} columns={copyRoleprocessColumns} pagination={false} />
              </Form>
            </Card>
          </Card>
        </Modal>
        <Modal
          visible={removeAdminModal}
          onCancel={handleCancel}
          width="25%"
          closable={false}
          // height="94%"
          style={{ top: "10px" }}
          centered
          bodyStyle={{ padding: "0px" }}
          footer={[
            <div>
              <Button
                // className={`${styles.buttonStylesforlistProduct}`}
                onClick={removeAdminAccess}
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
                <span>Confirm</span>
              </Button>
              <Button
                key="back"
                onClick={handleCancel}
                style={{
                  backgroundColor: "#ececec",
                  border: "none",
                  color: "dimgray",
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
            <Card /* style={Themes.contentWindow.recordWindow.RecordHeader.headerCard} */>
              <h3 style={{ textAlign: "center", fontWeight: "bold" }}> Remove Admin Access</h3>
              <p style={{ textAlign: "center", fontSize: "12px", color: "#5d5454", alignContent: "center" }}>Are you sure want to remove Admin Access?</p>
              <p style={{ textAlign: "center", fontSize: "12px", color: "#5d5454", alignContent: "center" }}>Note: On confirm Admin Access will be removed permanently !</p>
            </Card>
          </Card>
        </Modal>

        <Modal
          visible={makeAdminModal}
          onCancel={handleCancel}
          width="25%"
          closable={false}
          // height="94%"
          style={{ top: "10px" }}
          centered
          bodyStyle={{ padding: "0px" }}
          footer={[
            <div>
              <Button
                // className={`${styles.buttonStylesforlistProduct}`}
                onClick={makeAdminAccess}
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
                <span>Confirm</span>
              </Button>
              <Button
                key="back"
                onClick={handleCancel}
                style={{
                  backgroundColor: "#ececec",
                  border: "none",
                  color: "dimgray",
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
            <Card /* style={Themes.contentWindow.recordWindow.RecordHeader.headerCard} */>
              <h3 style={{ textAlign: "center", fontWeight: "bold" }}> Admin Acces</h3>
              <p style={{ textAlign: "center", fontSize: "12px", color: "#5d5454", alignContent: "center" }}>Are you sure want to give Admin Access?</p>
              <p style={{ textAlign: "center", fontSize: "12px", color: "#5d5454", alignContent: "center" }}>Note: On confirm Admin Access will be given to all windows !</p>
            </Card>
          </Card>
        </Modal>

        <Modal
          visible={getUsersFromRoleModal}
          onCancel={handleCancel}
          width="25%"
          closable={false}
          // height="94%"
          style={{ top: "10px" }}
          centered
          bodyStyle={{ padding: "0px" }}
          footer={[
            <div>
              <Button
                // className={`${styles.buttonStylesforlistProduct}`}
                onClick={handleCancel}
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
                <span>Ok</span>
              </Button>
              <Button
                key="back"
                onClick={handleCancel}
                style={{
                  backgroundColor: "#ececec",
                  border: "none",
                  color: "dimgray",
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
              <span>Users</span>
            </h3>
            <Card /* style={Themes.contentWindow.recordWindow.RecordHeader.headerCard} */>
              <Form layout="vertical" name="control-hooks" form={form} onFinish={onFinishForLineRole}>
                <Table dataSource={usersBaseOnRolesData} columns={usersBaseOnRolesColumns} pagination={false} />
              </Form>
            </Card>
          </Card>
        </Modal>
      </Spin>
    </div>
  );
};

export default UserWindowHeader;
