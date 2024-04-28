import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Button,Skeleton , AutoComplete,Card, Input, Dropdown, Menu, Checkbox, message, Alert, Modal, Form, notification, Collapse, Spin, Tooltip, Select, Popconfirm } from "antd";
import { useWindowContext, useGlobalContext } from "../../lib/storage";

import searchIcon from '../../assets/images/searchIconMobile.svg';

import SearchIcon from "../../assets/images/icon _search.svg"
import TreeView from "../../assets/images/tree_View.svg";
import mobileGlobalSearch from "../../assets/images/mobileGlobalSearch.svg";
import ThemeJson from "../../constants/UIServer.json"
import NewExport from "../../assets/images/exportDefault.svg";
import ExportHover from "../../assets/images/exportHover.svg";
import Import from "../../assets/images/importDefault.svg";
import ImportHover from "../../assets/images/importHover.svg";
import QuickAdd from "../../assets/images/quickAddDefault.svg";
import QuickAddHover from "../../assets/images/quickAddHover.svg";
import DownArrow from "../../assets/images/down.svg";
import Summary from "../../assets/images/summaryTab.svg";
import SummaryHover from "../../assets/images/State=Hover.svg";
import Selection from "../../assets/images/kanbanDefault.svg";
import SelectionHover from "../../assets/images/kanbanHover.svg";
import ShowList from "../../assets/images/listView.svg";
import NewShowHide from "../../assets/images/columnDefault.svg";
import NewShowHideHover from "../../assets/images/columnsHover.svg";
import NewClearFilters from "../../assets/images/filterDefault.svg";
import ClearHover from "../../assets/images/filterHover.svg"
import PrintHover from "../../assets/images/printhover.svg";
import Print from "../../assets/images/printdefault.svg";
import NewRefresh from "../../assets/images/refreshDefault.svg";
import RefreshHover from "../../assets/images/refreshHover.svg";
import Edit from "../../assets/images/editDefault.svg";
import EditHover from "../../assets/images/editHover.svg";
import Delete from "../../assets/images/deleteDefault.svg";
import DeleteHover from "../../assets/images/deleteHover.svg";
import CollapseAll from "../../assets/images/collapse_all.png";
import ExpandAll from "../../assets/images/expand_all.png";
import RecordForm from "../window/RecordForm";
import dayjs from "dayjs";
import { Scrollbars } from "react-custom-scrollbars";
import { LoadingOutlined,CloseOutlined } from "@ant-design/icons";
import { FieldReference } from "../../lib/fieldReference";
import { deleteTabRecord, getWindowInitializationData,removeView, upsertTabData, getViews, upsertViews, getTabData, importDefinitionService } from "../../services/generic";
import { getTabColumns } from "../window/windowUtilities";
import { ExportToCsv } from "export-to-csv";
import ImportComponent from "../import";
import "antd/dist/antd.css";
import './list.css';
import MobileMenu from "../mobileMenu";

const { Panel } = Collapse;

const ListWindowHeader = (props) => {
  const {
    setSearchKey,
    dropDownValue,
    setLastRefreshed,
    treeView,
    loading,
    treeViewFlag,
    columns,
    resetFilters,
    takeSummary,
    takeHideAndshowData,
    hideAndShowTitles,
    kanbanCards,
    /* ShowListView, */
    selectedRowKeys,
    setSelectedRowKeys,
    setWindowLoading,
    kanbanCardFlag,
    filters,
    takeViewFilters,
    expandTreeView,
    collapseTreeView,
    treeSearchInput,
    setTreeSearchInput,
    filterFlag,
    clearFiltersFlag
  } = props;
  const history = useHistory();
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const { windowStore, setWindowStore } = useWindowContext();
  const { windowDefinition } = windowStore;
  const [searchInput, setSearchInput] = useState("");
  const [mobMenu,setMobMenu] = useState(false)
  const [headerTabData, setHeaderTabData] = useState({});
  const [hideAndShowData, setHideAndShowData] = useState([]);
  const [headerFieldGroups, setHeaderFieldGroups] = useState({});
  const [visible, setVisible] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const [summaryMenuItems, setSummaryMenuItems] = useState([]);
  const [columnNames,setColumnNames] = useState([])
  const [showSearch,setShowSearch] = useState(false)
  const [viewsVisible, setViewsVisible] = useState(false);
  const [viewModalFlag, setViewModalFlag] = useState("");
  const [visibleViewModal, setVisibleViewModal] = useState(false);
  const [viewName, setViewName] = useState("");
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [searchValue,setSearchValue]=useState('')
  const [inputValue,setInputValue] = useState('')
  const [recentVisible, setRecentVisible] = useState(false);
  const [deletePopup,setDeletePopup] = useState(false)
  const [viewsData, setViewsData] = useState([]);
  const [viewsDataCopy,setViewsDataCopy] = useState([])
  const [disabled,setDisabled] = useState(true)
  const [recentName, setRecentName] = useState("");
  const [recentNameCopy, setRecentNameCopy] = useState('');
  const [recentID, setRecentID] = useState("1a2bb3ccc");
  const [saveFlag, setSaveFlag] = useState(false);
  const [importPopupVisible, setImportPopupVisible] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleIconHover = (iconName) => {
    setHoveredIcon(iconName);
  };

  const handleIconLeave = () => {
    setHoveredIcon(null);
  };

  useEffect(async () => {
    let isMounted = true;
    const response = await getViews(windowDefinition.ad_window_id);
    if (response) {
      if (isMounted) {
        const data = response;
        data.unshift(
          {id:'1a2bb3ccc',
           name:'Standard View'}
        )
        setViewsData(data);
        setViewsDataCopy(data)
      }
    }
    return () => {
      isMounted = false;
    };
  }, [saveFlag]);

  const handleRecentDropDown = (flag) => {
    setRecentVisible(flag);
  };

  const handleRecentMenu = (e) => {
    if (e.key === '1a2bb3ccc'){
      takeViewFilters(JSON.stringify([]));
      setRecentVisible(false);
      setRecentID('1a2bb3ccc')
      const data = viewsData.filter((item) => item.id === e.key);
      setRecentName('Standard View');
      setDisabled(true)
    }else{
      const data = viewsData.filter((item) => item.id === e.key);
      setRecentName(data[0].name);
      setRecentNameCopy(data[0].name)
      takeViewFilters(data[0].filters);
      setRecentVisible(false);
      setDisabled(false)
      setRecentID(e.key)
    }
  };
 
  const recentSearch=(e)=>{
    setInputValue(e.target.value)
    const arr = [];
    viewsData.forEach(tab=>{
     if(tab.name.toLowerCase().indexOf(e.target.value.toLowerCase())>=0){
       arr.push(tab)
       setViewsDataCopy(arr)
     }
    })
 }

  const recentMenu = () => {
    return (
      <Menu
        style={{
          overflowY:'auto',
          maxHeight: "15rem",
        }}
        onClick={handleRecentMenu}
      >
         <Input style={{margin:'5px',width:innerWidth>992?'200px':'110px'}} value={inputValue} onChange={recentSearch}/>
        {viewsDataCopy.map((item) => {
          return <Menu.Item key={item.id}>{item.name}</Menu.Item>;
        })}
      </Menu>
    );
  };

  const getSearchData = (e) => {
    const searchValue = e.target.value;
    setSearchInput(searchValue);
    setSearchKey(searchValue);
  };

  const getSearchTreeData = (e) => {
    const searchValue = e.target.value;
    setTreeSearchInput(searchValue);
  }; 

  const refreshData = () => {
    setLastRefreshed(new Date());
  };

  useEffect(() => {
    if (windowDefinition.tabs) {
      const headerTab = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === "0")];
      headerTab.fields.sort((a, b) => {
        const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
        const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      setHeaderTabData(headerTab);
      let hideAndShowTitles = [];
      for (let index1 = 0; index1 < headerTab.fields.length; index1++) {
        if (headerTab.fields[index1].nt_base_reference_id !== FieldReference.Button && headerTab.fields[index1].isdisplayed === "Y" && headerTab.fields[index1].isactive === "Y") {
          hideAndShowTitles.push({
            title: headerTab.fields[index1].name,
            checked: headerTab.fields[index1].showinrelation === "Y" ? true : false,
          });
        }
      }

      const fieldGroupsList = {};
      headerTab.fields.forEach((element) => {
        if (element.fieldgroup_name !== undefined && element.nt_base_reference_id !== "28") {
          fieldGroupsList[element.fieldgroup_name] = fieldGroupsList[element.fieldgroup_name] || [];
          fieldGroupsList[element.fieldgroup_name].push(element);
        }
      });
      setHeaderFieldGroups(fieldGroupsList);

      takeHideAndshowData(hideAndShowTitles);
      setHideAndShowData(hideAndShowTitles)
      setColumnNames(hideAndShowTitles);
    }
  }, [checkBox, hideAndShowTitles]);

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const onChange = (e, i) => {
    const windowDef = { ...windowDefinition };
    if (windowDef.tabs) {
      const headerTab = windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === "0")];
      headerTab.fields.sort((a, b) => {
        const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
        const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      for (let index1 = 0; index1 < headerTab.fields.length; index1++) {
        if (headerTab.fields[index1].name === e.target.id) {
          if (e.target.checked) {
            headerTab.fields[index1].showinrelation = "Y";
          } else {
            headerTab.fields[index1].showinrelation = "N";
          }
        }
      }
    }
    setWindowStore({ windowDefinition: windowDef });
    setCheckBox(!checkBox);
    setSearchValue('')
    setColumnNames(hideAndShowData)
    // setVisible(false)
  };

  const handleChange=(e)=>{
    setSearchValue(e.target.value)
    const arr = [];
    hideAndShowData.forEach(tab=>{
     if(tab.title.toLowerCase().indexOf(e.target.value.toLowerCase())>=0){
       arr.push(tab)
     }
    })
   setColumnNames(arr)
 }

  const menu = () => {
    return (
      <Menu
        key="1"
      >
        <Input style={{margin:'7px',width:'225px'}} value={searchValue} allowClear onChange={handleChange}/>
        <Scrollbars
            style={{
              height: "35vh",
            }}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            thumbSize={90}
            renderView={renderView}
            renderThumbVertical={renderThumb}
          >
        <Card>
        {columnNames.map((item, index) => {
          return (
            <Menu.Item key={index}>
              <Checkbox key={index} id={item.title} onChange={(e) => onChange(e, index)} checked={item.checked}>
                {item.title}
              </Checkbox>
            </Menu.Item>
          );
        })}
        </Card>
        </Scrollbars>
      </Menu>
    );
  };

  const handleSummaryVisibleChange = (flag) => {
    setSummaryVisible(flag);
  };

  const handleSummary = (e) => {
    const windowDef = { ...windowDefinition };
    if (windowDef) {
      if (e.target.id === "SUM") {
        if (e.target.checked) {
          windowDef.sum = true;
        } else {
          windowDef.sum = false;
        }
      }
      if (e.target.id === "COUNT") {
        if (e.target.checked) {
          windowDef.count = true;
        } else {
          windowDef.count = false;
        }
      }
      if (e.target.id === "MIN") {
        if (e.target.checked) {
          windowDef.min = true;
        } else {
          windowDef.min = false;
        }
      }
      if (e.target.id === "MAX") {
        if (e.target.checked) {
          windowDef.max = true;
        } else {
          windowDef.max = false;
        }
      }
      if (e.target.id === "AVG") {
        if (e.target.checked) {
          windowDef.avg = true;
        } else {
          windowDef.avg = false;
        }
      }
    }
    setWindowStore({ windowDefinition: windowDef });
    let fieldIds = [];
    for (let i = 0; i < columns.length; i++) {
      if (e.target.id === "COUNT") {
        if (columns[i].baseReferenceId === "22" || columns[i].baseReferenceId === "10") {
          fieldIds.push(columns[i].dataIndex.replace("_iden", ""));
        }
      } else {
        if (columns[i].baseReferenceId === "22") {
          fieldIds.push(columns[i].dataIndex.replace("_iden", ""));
        }
      }
    }
    if (fieldIds.length > 0) {
      let summary = windowDef.summary === undefined || windowDef.summary === {} ? {} : windowDef.summary;
      if (e.target.checked) {
        summary[e.target.id] = fieldIds;
      } else {
        delete summary[e.target.id];
      }
      takeSummary(summary);
    }
  };

  useEffect(() => {
    const summaryMenu = [
      {
        title: "TOTAL",
        id: "SUM",
        checked: windowDefinition.sum === undefined || windowDefinition.sum === false ? false : true,
      },
      {
        title: "COUNT",
        id: "COUNT",
        checked: windowDefinition.count === undefined || windowDefinition.count === false ? false : true,
      },
      {
        title: "MIN",
        id: "MIN",
        checked: windowDefinition.min === undefined || windowDefinition.min === false ? false : true,
      },
      {
        title: "MAX",
        id: "MAX",
        checked: windowDefinition.max === undefined || windowDefinition.max === false ? false : true,
      },
      {
        title: "AVG",
        id: "AVG",
        checked: windowDefinition.avg === undefined || windowDefinition.avg === false ? false : true,
      },
    ];
    setSummaryMenuItems(summaryMenu);
  }, [windowDefinition]);

  const summaryMenu = () => {
    return (
      <Menu key="1">
        {summaryMenuItems.map((item, index) => {
          return (
            <Menu.Item key={index}>
              <Checkbox key={index} id={item.id} onChange={handleSummary} checked={item.checked}>
                {item.title}
              </Checkbox>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  const [isAlertActive, setIsAlertActive] = useState(false);
  const [errorMessageDetails, setErrorMessageDetails] = useState();
  const deleteRecords = async () => {
    setWindowLoading(true);
    const recordArray = [];
    selectedRowKeys.map((recordKey) => {
      return recordArray.push(recordKey.recordId);
    });
    const deleteResponse = await deleteTabRecord(windowDefinition.ad_window_id,headerTabData.ad_tab_id, recordArray);
    if (deleteResponse.messageCode === "200") {
      setWindowLoading(false);
      setSelectedRowKeys([]);
      message.success(deleteResponse.message);
      refreshData();
    } else {
      setWindowLoading(false);
      setErrorMessageDetails(deleteResponse);
      setIsAlertActive(true);
    }
  };

  const editRecord = () => {
    history.push(`/window/${windowDefinition.ad_window_id}/${selectedRowKeys[0].recordId}`);
  };

  const displayErrorDetails = () => {
    if (errorMessageDetails) {
      Modal.error({
        title: errorMessageDetails.title,
        content: errorMessageDetails.message,
      });
    }
  };

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: "#c1c1c1",
      borderRadius: "5px",
      width: "8px",
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const renderView = ({ style, ...props }) => {
    const viewStyle = {
      color: "#00000",
    };
    return <div className="box" style={{ ...style, ...viewStyle }} {...props} />;
  };

  const [headerRecordData, setHeaderRecordData] = useState({});
  const [visibleQuickAddModal, setVisibleQuickAddModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form] = Form.useForm();
  const showQuickAdd = async () => {
    const headerRecordData = await getWindowInitializationData(windowDefinition.ad_window_id,headerTabData.ad_tab_id);
    setHeaderRecordData(headerRecordData);
    setVisibleQuickAddModal(true);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(() => {
        form.submit();
      })
      .catch((error) => {
        console.error(JSON.stringify(error, null, 2));
      });
  };

  const onNewButton=()=>{
    if(windowDefinition.custom_path_for_new_record === "Y"){
      history.push(`/others/window/${windowDefinition.new_window_id}/NEW_RECORD`)
      localStorage.setItem('currencyParams',null)
    }
    else{
      history.push(`/window/${windowDefinition.ad_window_id}/NEW_RECORD`)
      localStorage.setItem('currencyParams',null)
    }
  }

  const onFinish = (values) => {
    setFormLoading(true);
    Object.entries(values).map(([key, value]) => {
      if (value === true) {
        values[key] = "Y";
      }
      if (value === false) {
        values[key] = "N";
      }
      if (typeof value === "string") {
        values[key] = value;
      }
      if (typeof value === "number") {
        values[key] = `${value}`;
      }
      if (dayjs.isDayjs(value)) {
        values[key] = `${value.format("YYYY-MM-DD HH:mm:ss")}`;
      }
      if (value === "") {
        values[key] = null;
      }
      if (value === undefined) {
        values[key] = null;
      }
      return null;
    });

    Object.entries(values).map(() => {
      Object.entries(headerRecordData).map(([headerKey, headerValue]) => {
        if (values[headerKey] === undefined) {
          if (headerKey.search("_iden") === -1) {
            values[headerKey] = headerValue;
          }
        }
        return null;
      });
      return null;
    });

    const stringifiedFields = JSON.stringify(values);
    const updatedStrings = stringifiedFields.replace(/\\"/g, '\\"');
    const stringRequest = JSON.stringify(updatedStrings);
    
    upsertTabData(windowDefinition.ad_window_id,headerTabData.ad_tab_id, "NEW_RECORD", stringRequest)
      .then((upsertResponse) => {
        if (upsertResponse.data.data.upsertTab.status === "200") {
          message.success(`${upsertResponse.data.data.upsertTab.message}`);
          setVisibleQuickAddModal(false);
          setLastRefreshed(new Date());
        } else {
          console.error(JSON.stringify(upsertResponse, null, 2));
          notification.error({
            message: "Error Processing Operation",
            description: (
              <Collapse ghost>
                <Panel header="Details" key="1">
                  {upsertResponse.data.data.upsertTab.message}
                </Panel>
              </Collapse>
            ),
          });
        }
      })
      .catch((e) => {
        console.error(JSON.stringify(e, null, 2));
      })
      .finally(() => {
        setFormLoading(false);
      });
  };

  const rowsInLine = headerTabData.noofcolumnsinrow;
  let colSpanValue = 8;
  let modalWidth = "280px";
  if (rowsInLine) {
    colSpanValue = 24 / parseInt(rowsInLine);
    if (colSpanValue === 12) {
      modalWidth = "520px";
    } else if (colSpanValue === 24) {
      modalWidth = "280px";
    } else if (colSpanValue === 8) {
      modalWidth = "800px";
    } else {
      modalWidth = "auto";
    }
  }

  const handleViewsDropdown = (flag) => {
    setViewsVisible(flag);
  };

  const handleViewsChange = (e) => {
    setViewModalFlag(e.key);
    setViewsVisible(false);
    setVisibleViewModal(true);
    if(recentName==='Standard View'){
      setDisabled(true)
    }setDisabled(false)
  };

  const confirmDeletePopup=()=>{
    setDeletePopup(true)
    setViewsVisible(false);
    // <Popconfirm></Popconfirm>
  }

  const propsConfirmCancel=()=>{
    setDeletePopup(false)
  }

  const onDeleteView= (id)=>async () => {
    const removeViewResponse = await removeView(id);
    if(removeViewResponse.data.data.removeView.messageCode==='200'){
      message.success(removeViewResponse.data.data.removeView.message);
      setDeletePopup(false)
      takeViewFilters(JSON.stringify([]));
      setRecentName('Standard View')
      setDisabled(true)
      setSaveFlag(!saveFlag);
    }else{
      message.error(removeViewResponse.data.data.removeView.message);
    }
    
  }

  const onEditView=(e)=>{
    setViewModalFlag(e.key);
    setVisibleViewModal(true);
    setViewsVisible(false);
    setRecentNameCopy(recentName)
    setViewName(recentName) 
  }


  const viewsMenu = () => {
    return (
      <Menu key={"1"} style={{width:'150px'}} >
        <Menu.Item key={"New"} onClick={handleViewsChange}>Save View</Menu.Item>
        <Menu.Item key={"Edit"} disabled={disabled} onClick={onEditView}>Edit View</Menu.Item>
        <Menu.Item key={"Remove"} disabled={disabled} onClick={confirmDeletePopup}
        // onClick={onDeleteView(recentID)}
        >Delete View</Menu.Item>
      </Menu>
    );
  };

  // const onSaveView=()=>{
  //   if(viewName===null||viewName===''){
  //     message.info('Please give a name for view')
  //   }else{
  //   let existRecord =false
  //   viewsData.map(item=>{
  //     if(viewName.toLocaleLowerCase()===item.name.toLocaleLowerCase()){
  //       existRecord = true
  //     }else{
  //       saveViewName()
  //     }
  //   })
  //   if(existRecord === true){
  //     message.error("Grid view name already exists. Select a different name")
  //   }}
  // }
  
  const onSaveView=()=>{
    if(viewName===null||viewName===''){
      message.info('Please give a name for view')
    }else{
    let existRecord =false
    viewsData.map(item=>{
      if(viewName.toLocaleLowerCase()===item.name.toLocaleLowerCase()){
        existRecord = true
        message.error("Grid view name already exists. Select a different name")
      }
    })
    if(existRecord === false){
      saveViewName()
    }}
  }

  const saveViewName = async () => {
    try {
      setViewModalFlag(false);
      const userData = { ...globalStore.userData };
      let finalFilters = [...new Set(filters)];
      
      const response = await upsertViews(userData.user_id, userData.cs_client_id, windowDefinition.ad_window_id, viewName, finalFilters,recentID);
      if (response) {
        if (response.data.data.upsertViews.title === "Success") {
          message.success(response.data.data.upsertViews.message);
          // window.location.reload();
          setSaveFlag(!saveFlag);
          setRecentName(viewName)
        }else{
          message.error(response.data.data.upsertViews.message)
        }
      }
    } catch (error) {
      message.error("View is not saved properly");
    }
  };

  const handleViewName = (e) => {
    setViewName(e.target.value);
  };

  const editViewName = (e) =>{
    setRecentNameCopy(e.target.value)
    setViewName(e.target.value)
    setRecentName(e.target.value)
  }

  const onEditViewName=()=>{
    saveViewName()
  }

  const exportData = async () => {
    const windowName = windowDefinition.name;
    const today = new Date();
    const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    setWindowLoading(true);
    let finalFilters = [...new Set(filters)];
    const getTabDataResponse = await getTabData({
      windowId:windowDefinition.ad_window_id,
      ad_tab_id: headerTabData.ad_tab_id,
      startRow: "0",
      endRow: "1000000",
      isDownload: "Y",
      filterData: finalFilters.length > 0 ? finalFilters : null,
    });
    const gridColumns = getTabColumns(headerTabData);
    let finalOutputArray = [];

    for (let recordIndex = 0; recordIndex < getTabDataResponse.length; recordIndex++) {
      const jsonRecord = getTabDataResponse[recordIndex];
      let jsonObject = {};
      for (let headerIndex = 0; headerIndex < gridColumns.length; headerIndex++) {
        const fieldValue = gridColumns[headerIndex].dataIndexWithoutIdn.concat("_iden");
        const fieldValueWithoutConcat = gridColumns[headerIndex].dataIndexWithoutIdn;
        if (!(jsonRecord[fieldValue] === undefined)) {
          jsonObject[gridColumns[headerIndex].title] = jsonRecord[fieldValue];
        } else if (!(jsonRecord[fieldValueWithoutConcat] === undefined)) {
          jsonObject[gridColumns[headerIndex].title] = jsonRecord[fieldValueWithoutConcat];
        }
      }
      finalOutputArray.push(jsonObject);
    }
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: false,
      filename: `${windowName}_${date}_${time}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };

    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(finalOutputArray);
    setWindowLoading(false);
  };

  const importData = async () => {
    const importTypeId = headerTabData.ad_tab_id;

    /* const getImportDataOnSelect = await importDefinitionService(importTypeId);
    // const headerData = Object.keys(getImportDataOnSelect[0]); */
    setImportPopupVisible(true);
  };

  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 12,
    sm: 12,
    md: 12,
  };

  const responsiveDesignNew = {
    xxl: 24,
    xl: 24,
    lg: 24,
    xs: 24,
    sm: 24,
    md: 24,
  };

  const responsiveSearch = {
    xxl: 8,
    xl: 10,
    lg: 9,
    xs: 0,
    sm: 0,
    md: 10,
  };
  const responsiveSearchInMobile = {
    xxl: 0,
    xl: 0,
    lg: 2,
    xs: 2,
    sm: 2,
    md: 2,
  };

  const responsiveButtonIn = {
    xxl: 16,
    xl: 14,
    lg: 15,
    xs: 0,
    sm: 0,
    md: 14,
  };

  const responsiveRecentlyViewed = {
    xxl: 4,
    xl: 4,
    lg: 4,
    xs: 0,
    sm: 0,
    md: 3,
  };

  const responsiveButton = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 24,
    sm: 16,
    md: 12,
  };

  const responsiveButtonMore = {
    xxl: 3,
    xl: 3,
    lg: 3,
    xs: 0,
    sm: 0,
    md: 2,
  };
  const responsiveButtonAdd = {
    xxl: 0,
    xl: 0,
    lg: 6,
    xs: 12,
    sm: 8,
    md: 8,
  };


  const responsiveButtonMobileIn = {
    xxl: 0,
    xl: 0,
    lg: 18,
    xs: 12,
    sm: 16,
    md: 16,
  };

  const responsiveButtonMoreIn = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 0,
    sm: 0,
    md: 0,
  };

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
  }
  const onTogMenu = () => {
    if(mobMenu === true){
      setMobMenu(false)
    }setMobMenu(true)
  }
  const subMenuNavigate = (data) => {
    if (data.children === undefined || data.children === null) {
      localStorage.setItem("subMenuItem", JSON.stringify(data.key))
      localStorage.setItem("lowerSubMenu",null)
      // setMenuToggle(true)
      // setFullMenuToggle(true)
      if (data.type === "Report") {
        history.push(`/reports/report/${data.id}`);
      } else if (data.type === "Dashboard") {
        history.push(`/analytics/dashboard/${data.id}`);
      } else if (data.type === "Generic") {
        history.push(`/window/list/${data.id}`);
      } else if (data.type === "Custom") {
        history.push(`/others/window/${data.id}`);
      }
    }
    else {
      localStorage.setItem("lowerSubMenu", JSON.stringify(data.children))
      localStorage.setItem("lowerSubMenuItem", JSON.stringify(data.children[0].key))
      localStorage.setItem("subMenuItem", JSON.stringify(data.key))
      if (data.children[0].type === "Report") {
        history.push(`/reports/report/${data.children[0].id}`);
      } else if (data.children[0].type === "Dashboard") {
        history.push(`/analytics/dashboard/${data.children[0].id}`);
      } else if (data.children[0].type === "Generic") {
        history.push(`/window/list/${data.children[0].id}`);
      } else if (data.children[0].type === "Custom") {
        history.push(`/others/window/${data.children[0].id}`);
      }
    }
  };
  const innerWidth = windowSize.innerWidth
  let subMenuItem = JSON.parse(localStorage.getItem("subMenuItem"))
  let subMenuData =JSON.parse(localStorage.getItem("subMenuData"))
  // console.log(windowDefinition)
  return (
    <div style={{ height: innerWidth > 1004 ? "30px" : "auto" }}>
      {innerWidth > 768 ? null : (
        <Row gutter={8} style={{ marginTop: "1em", padding: "0 1em" }}>
          <Col {...responsiveButtonMobileIn} style={{ padding: "2px" }}>
            {/* <img src={ToggleIcon} style={{ cursor: "pointer", paddingBottom: "2px" }} onClick={onTogMenu} alt="" /> */}
            <span style={{ fontFamily: "Inter",fontWeight:700,color:"#0C173A",fontSize:"14px" }}>{localStorage.getItem("lowerSubMenuItem")}</span>
           {/* <span style={{fontWeight:600,width:"20%"}}>{subMenuItem}</span> */}
          </Col>
          <Col {...responsiveButtonAdd}>
            <span style={{ paddingTop: "5px" }}>
            
              {windowDefinition.enablenew === "Y" ? (
                <Button
                  type="primary"
                  onClick={onNewButton}
                  style={{ height: "36px", float: "right", borderRadius: "4px", boxShadow: "-1px -1px 3px #00000029", fontFamily: "Inter", fontWeight: 700, color: "#FFFFFF" }}
                >
                  <span> {innerWidth > 992 ? "Add New" : "Add"}</span>
                </Button>
              ) : null}
              {windowDefinition.enablequickadd === "Y" ? (
                <Button onClick={showQuickAdd} style={{ float: "right", marginRight: `${windowDefinition.enablequickadd === "Y" ? "8px" : "0px"}` }} className="quickAddButtons1">
                <img style={Themes.contentWindow.ListWindowHeader.quickAddButtonImage} src={QuickAdd} alt="quickAdd" />
              </Button>
              ) : null}
              <Button onClick={()=>{setShowSearch((t)=>!t)}} style={{padding:"4px 10px",border:"1px solid #E2E2E2",boxShadow:" 0px 2px 2px rgba(0, 0, 0, 0.05);",borderRadius:"4px", height: "36px",float: "right",marginRight:"0.5em",display:showSearch?"none":"block"}}>
             <img style={{marginTop:""}}  src={mobileGlobalSearch} alt=""/>
             </Button>
              {/* {treeViewFlag === true ? (
                <AutoComplete style={{}}>
                  <Input
                    value={treeSearchInput}
                    onChange={getSearchTreeData}
                    style={{ border: "0.25px solid #D7DADE", width: "30px", height: "30px" }}
                    prefix={<i role="presentation" aria-hidden="true" style={Themes.contentWindow.ListWindowHeader.listSearchIcon} />}
                  />
                </AutoComplete>
              ) : (
                <AutoComplete style={{ float: 'right', marginRight: '8px' }}>
                  <Input
                    value={searchInput}
                    onChange={getSearchData}
                    style={{ border: "0.1px solid #D1D1D1", width: "35px", height: "35px" }}
                    prefix={<img src={searchIcon} style={{ paddingRight: "3px" }} />}
                  />
                </AutoComplete>
              )} */}
            </span>
          </Col>
        </Row>
      )}
      {innerWidth<768 && showSearch ?
        <Row style={{marginTop:"0.3em"}}>
          <Col span={24} style={{padding:"0px 1em"}}>
          {treeViewFlag === true ? (
                <AutoComplete style={{width:"100%"}}>
                  <Input
                    value={treeSearchInput}
                    onChange={getSearchTreeData}
                    suffix={
                      <CloseOutlined onClick={()=>{setShowSearch((t)=>!t)}} />
                    }
                    style={{ border: "0.25px solid #D7DADE", height: "35px" ,borderRadius:"5px"}}
                    prefix={<i role="presentation" aria-hidden="true" style={Themes.contentWindow.ListWindowHeader.listSearchIcon} />}
                  />
                </AutoComplete>
              ) : (
                <AutoComplete style={{width:"100%"}}>
                  <Input
                    value={searchInput}
                    onChange={getSearchData}
                    suffix={
                      <CloseOutlined onClick={()=>{setShowSearch((t)=>!t)}} />
                    }
                    style={{ border: "0.1px solid #D1D1D1", height: "35px",borderRadius:"5px",background:"#f3f4f9"}}
                    prefix={<img src={searchIcon} style={{ paddingRight: "3px" }} />}
                  />
                </AutoComplete>
              )} 
              </Col>
        </Row>:""
      }
      {innerWidth > 768 ?
        <Row style={{ paddingLeft: "", paddingRight: "" }}>
          {treeViewFlag === true ?
            <Col {...responsiveSearch} >
              <div style={{ display: "flex" }}>
               <span className="formRecordTitle" style={{ cursor: "pointer", color: "#161537", fontFamily: "Inter", fontWeight: 550, fontSize: "23px",minWidth: "60%" }}>{windowDefinition.name}</span>
                <div
                  style={{ display: "flex" }}
                  // onMouseEnter={() => setShowSearch(true)}
                  // onMouseLeave={() => setShowSearch(false)}
                >
                  {/* <img
                    style={{
                      marginLeft: "0.5em",
                      padding: "9px",
                      marginTop: "0.2em",
                      height: "2.5em",
                      cursor: "pointer",
                      display: `${showSearch ? "none" : "block"}`,
                    }}
                    src={listSearchIcon}
                    alt=""
                  /> */}
                  <span 
                  // className={showSearch && !loading ? "search-input show" : "search-input"}
                  >
                    <AutoComplete
                      autoFocus
                      style={{
                        width: "100%",
                        height: "2.4em",
                        paddingTop: "0.2em",
                        marginLeft: "0.5em",
                      }}
                    >
                      <Input
                        className="listSearch"
                        placeholder="Search..."
                        value={treeSearchInput}
                        onChange={getSearchTreeData}
                      // style={{ border: "0.1px solid #D1D1D1" }}
                      />
                    </AutoComplete>
                  </span>
                </div>
                </div>
            </Col> :
            <Col {...responsiveSearch}>
              <div style={{ display: "flex" }}>
                <span className="formRecordTitle" style={{ cursor: "pointer", color: "#161537", fontFamily: "Inter", fontWeight: 550,lineHeight:"1.2em",  fontSize: "23px", minWidth: "" }}>{windowDefinition.name}</span>
                <div
                  style={{ display: "flex" }}
                  // onMouseEnter={() => setShowSearch(true)}
                  // onMouseLeave={() => setShowSearch(false)}
                >
                  {/* <img
                    style={{
                      marginLeft: "0.5em",
                      padding: "9px",
                      marginTop: "0.2em",
                      height: "2.5em",
                      cursor: "pointer",
                      display: `${showSearch ? "none" : "block"}`,
                    }}
                    src={listSearchIcon}
                    alt=""
                  /> */}
                  <span 
                  // className={showSearch && !loading ? "search-input show" : "search-input"}
                  >
                    <AutoComplete
                      autoFocus
                      style={{
                        width: "80%",
                        height: "2.4em",
                        paddingTop: "0em",
                        marginLeft: "0.5em",
                      }}
                    >
                      <Input
                        className="listSearch"
                        placeholder="Search"
                        value={searchInput}
                        onChange={getSearchData}
                      style={{background:"transparent",height:"4.3vh",borderRadius:"5px",backgroundColor:"f3f4f5"}}
                      prefix={<img src={SearchIcon} alt="" style={{padding: "2px 1px 2px 0px", height: "3vh"}}/>}
                      />
                    </AutoComplete>
                  </span>
                </div>
              </div>

            </Col>
          }
          <Col {...responsiveButtonIn} style={{ paddingLeft: innerWidth > 769 ? '0' : '15px' }}>
            <div style={{display: 'flex', float: innerWidth > 769 ? 'right' : ''}}>
            <style>
              {showScrollbar && `
                ::-webkit-scrollbar {
                  width: 0.5em;
                  background-color: transparent;
                }
                ::-webkit-scrollbar-thumb {
                  background-color: #888;
                  border-radius: 0.25em;
                }
              `}
      </style>
              {innerWidth<992 ? null:<Dropdown trigger={["click"]} overlay={recentMenu} onVisibleChange={handleRecentDropDown} visible={recentVisible}>
                <span className="ant-dropdown-link" role="presentation" style={{ fontFamily: "Inter", color: '#19222', marginRight: "0.5em",fontSize:"0.9em", marginTop: "0.35em" }}>
                  {/* <img src={recentView} style={{marginRight:"5px",marginBottom:"2px"}} alt="img"/> */}
                  <span style={{ display: 'inline-block' }} className={innerWidth > 926 ? '' : 'formRecordTitle1'}>
                    <span style={{ fontFamily: "Inter", fontWeight: 500, color: "#161537", cursor: "pointer" }}>
                      {recentName !== "" && filterFlag !== true ? recentName : "Standard View"}
                    </span>
                  </span>
                  <span>
                    <img src={DownArrow} style={{ marginLeft: "3px" }} alt="img" />
                  </span>
                </span>
              </Dropdown>}
              <div style={{ display: treeViewFlag === true ? "flex" : "none" }}>
                <Tooltip title="Expand All" placement="top">
                  <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={expandTreeView}>
                    <img style={{ cursor: 'pointer' }} src={ExpandAll} alt="invoice" />
                  </Button>
                </Tooltip>
                <Tooltip title="Collapse All" placement="bottom">
                  <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={collapseTreeView}>
                    <img style={{  cursor: 'pointer' }} src={CollapseAll} alt="invoice" />
                  </Button>
                </Tooltip>
              </div>
              {/* <Dropdown trigger={["click"]} overlay={viewsMenu} onVisibleChange={handleViewsDropdown} visible={viewsVisible}>
            <Tooltip title="View settings" placement="top">
              <span color="primary" >
                <img style={{ paddingTop:'12px',marginRight:innerWidth >769?'15px':'15px',cursor:'pointer'}} src={recentView} alt="invoice" />
              </span>
            </Tooltip>
          </Dropdown> */}
              <Dropdown trigger={["click"]} overlay={summaryMenu} onVisibleChange={handleSummaryVisibleChange} visible={summaryVisible}>
              <Tooltip title="Summary" placement="top"  onMouseEnter={() => handleIconHover('summary')} onMouseLeave={handleIconLeave}>
                    <img style={{ paddingTop: "", marginRight: '', cursor: 'pointer' }} src={hoveredIcon === "summary"?SummaryHover:Summary} alt="invoice" />
                </Tooltip>
              </Dropdown>&nbsp;
              <Fragment>
                {!kanbanCardFlag ? (
                  <div style={{ display: treeViewFlag === true ? "none" : "block" }}>
                    <Tooltip title="Kanban View" placement="top" onMouseEnter={() => handleIconHover('kanban')} onMouseLeave={handleIconLeave} >
                    <img style={{ paddingTop: "", marginTop: '5%', cursor: 'pointer' }} src={hoveredIcon === "kanban"?SelectionHover:Selection} alt="invoice" onClick={kanbanCards} />
                    </Tooltip>
                  </div>
                ) : (
                  <Tooltip title="List View" placement="top">
                    <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={kanbanCards}>
                      <img style={{ width: "19px", cursor: 'pointer' }} src={ShowList} alt="invoice" />
                    </Button>
                  </Tooltip>
                )}
              </Fragment>
              
              <div style={{ display: !treeViewFlag && clearFiltersFlag ? "block" : "none" }}>
              &nbsp;
                <Tooltip title="Clear Filters" placement="top"  onMouseEnter={() => handleIconHover('filters')} onMouseLeave={handleIconLeave}>
                  {/* <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} > */}
                    <img onClick={resetFilters} style={{ marginTop: '5%', cursor: 'pointer' }} src={hoveredIcon === "filters"?ClearHover:NewClearFilters} alt="invoice" />
                  {/* </Button> */}
                </Tooltip>
              </div> &nbsp;
              <Dropdown trigger={["click"]} overlay={menu} onVisibleChange={handleVisibleChange} visible={visible}>
                <Tooltip title="Show/Hide Columns" placement="top" onMouseEnter={() => handleIconHover('column')} onMouseLeave={handleIconLeave}>
                <img style={{ paddingTop: "", marginRight: '', cursor: 'pointer' }} src={hoveredIcon === "column"?NewShowHideHover:NewShowHide} alt="invoice" />
                </Tooltip>
              </Dropdown>&nbsp;
              <Tooltip title="Reload" placement="top" onMouseEnter={() => handleIconHover('reload')} onMouseLeave={handleIconLeave}>
                <img style={{ paddingTop: "", marginRight: '', cursor: 'pointer' }} src={hoveredIcon === "reload"?RefreshHover:NewRefresh} alt="invoice" onClick={refreshData}/>
              </Tooltip> &nbsp;
              {windowDefinition.enableprint === "Y" && treeViewFlag === false ? (
                <Tooltip title="Print" placement="top"  onMouseEnter={() => handleIconHover('print')} onMouseLeave={handleIconLeave}>
                   <img style={{ paddingTop: "", marginRight: '', cursor: 'pointer' }} src={hoveredIcon === "print"?PrintHover:Print} alt="invoice" />                 
                </Tooltip>
              ) : null} &nbsp;
              {/* {windowDefinition.enablefilter === "Y" && treeViewFlag === false ? (
            <Tooltip title="Filter" placement="top">
              <span >
                <img style={{ paddingTop: "12px",marginRight:innerWidth >769?'15px':'15px', paddingRight: "2px",cursor:'pointer'}} src={NewFilter} alt="invoice" />
              </span>
            </Tooltip>
          ) : null} */}
              <Tooltip title="Export" placement="top"  onMouseEnter={() => handleIconHover('export')} onMouseLeave={handleIconLeave}>
              <img style={{ paddingTop: "", marginRight: '', cursor: 'pointer' }} src={hoveredIcon === "export"?ExportHover:NewExport} alt="invoice" onClick={exportData} />
              </Tooltip>&nbsp;
              {headerTabData.tabenabledforimport === "Y" ? (
                <Tooltip title="Export" placement="top"  onMouseEnter={() => handleIconHover('import')} onMouseLeave={handleIconLeave}>
                <img style={{ paddingTop: "", marginRight: '', cursor: 'pointer' }} src={hoveredIcon === "import"?ImportHover:Import} alt="invoice" onClick={importData} />
                </Tooltip>
              ) : (
                ""
              )}

              {headerTabData.enabletreeview === "Y" ? (
                <Tooltip title="TreeView" placement="top">
                  <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={treeView}>
                    <img style={{ cursor: 'pointer' }} src={TreeView} alt="invoice" />
                  </Button>
                </Tooltip>
              ) : (
                ""
              )}
              {windowDefinition.enableedit === "Y" && selectedRowKeys.length === 1 ? (
                <Tooltip title="Edit" placement="top" onMouseEnter={() => handleIconHover('edit')} onMouseLeave={handleIconLeave}>
                 <img style={{ paddingTop: "", marginRight: '', cursor: 'pointer' }} src={hoveredIcon === "edit"?EditHover:Edit} alt="invoice" onClick={editRecord} />
                </Tooltip>
              ) : null}&nbsp;
              {windowDefinition.enabledelete === "Y" && selectedRowKeys.length >= 1 ? (
                <Tooltip className="listHeaderButtons" title="Trash" placement="top"  onMouseEnter={() => handleIconHover('delete')} onMouseLeave={handleIconLeave}>
                 <img style={{ paddingTop: "", marginRight: '', cursor: 'pointer' }} src={hoveredIcon === "delete"?DeleteHover:Delete} alt="invoice" onClick={deleteRecords} />          
                </Tooltip>
              ) : null}
              <span style={{ paddingTop: '0px',display:"flex" }}>
              {windowDefinition.enablequickadd === "Y" ? (
                  <Tooltip title="OuickAdd" placement="top"  onMouseEnter={() => handleIconHover('quickAdd')} onMouseLeave={handleIconLeave}>
                  <img style={{ paddingTop: "", marginRight: '', cursor: 'pointer' }} src={hoveredIcon === "quickAdd"?QuickAddHover:QuickAdd} alt="invoice" onClick={showQuickAdd} />
                  </Tooltip>
                ) : null} &nbsp;
                {windowDefinition.enablenew === "Y" ? (
                  <Button
                    type="primary"
                    onClick={onNewButton}
                    style={{ height: "30px", float: "right", borderRadius: "4px", boxShadow: "-1px -1px 3px #00000029", fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}
                  >
                    <span> {innerWidth > 992 ? "Add New" : "Add"}</span>
                  </Button>
                ) : null}
              </span>
            </div>
          </Col>
        </Row>
        : null}
      {innerWidth > 1004 ? null :
        <Row style={{ padding: "0 1em" }}>
          <Col {...responsiveButtonMoreIn} style={{ float: "right", paddingLeft: '10px', paddingTop: '6px', marginTop: '10px' }}>
            <div style={{ display: 'flex', float: 'right' }}>
            <Dropdown trigger={["click"]} overlay={recentMenu} onVisibleChange={handleRecentDropDown} visible={recentVisible}>
                <span className="ant-dropdown-link" role="presentation" style={{ fontFamily: "Inter", color: '#19222', marginRight: "0.5em", marginTop: "0.3em" }}>
                  {/* <img src={recentView} style={{marginRight:"5px",marginBottom:"2px"}} alt="img"/> */}
                  <span style={{ display: 'inline-block' }} className={innerWidth > 926 ? '' : 'formRecordTitle1'}>
                    <span style={{ fontFamily: "Inter", fontWeight: 500, color: "#161537", cursor: "pointer" }}>
                      {recentName !== "" && filterFlag !== true ? recentName : "Standard View"}
                    </span>
                  </span>
                  <span>
                    <img src={DownArrow} style={{ marginLeft: "3px" }} alt="img" />
                  </span>
                </span>
              </Dropdown>
              <div style={{ display: treeViewFlag === true ? "flex" : "none" }}>
                <Tooltip title="Expand All" placement="top">
                  <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={expandTreeView}>
                    <img style={{ cursor: 'pointer' }} src={ExpandAll} alt="invoice" />
                  </Button>
                </Tooltip>
                <Tooltip title="Collapse All" placement="bottom">
                  <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={collapseTreeView}>
                    <img style={{ cursor: 'pointer' }} src={CollapseAll} alt="invoice" />
                  </Button>
                </Tooltip>
              </div>
              <Dropdown trigger={["click"]} overlay={summaryMenu} onVisibleChange={handleSummaryVisibleChange} visible={summaryVisible}>
                <Tooltip title="Summary" placement="top">
                  <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                    <img style={{ paddingTop: "", marginRight: '', cursor: 'pointer' }} src={Summary} alt="invoice" />
                  </Button>
                </Tooltip>
              </Dropdown>
              <Fragment>
                {!kanbanCardFlag ? (
                  <div style={{ display: treeViewFlag === true ? "none" : "block" }}>
                    <Tooltip title="Kanban View" placement="top">
                      <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={kanbanCards}>
                        <img style={{ width: "16px", cursor: 'pointer' }} src={Selection} alt="invoice" />
                      </Button>
                    </Tooltip>
                  </div>
                ) : (
                  <Tooltip title="List View" placement="top">
                    <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={kanbanCards}>
                      <img style={{ width: "19px", cursor: 'pointer' }} src={ShowList} alt="invoice" />
                    </Button>
                  </Tooltip>
                )}
              </Fragment>
              <div style={{ display: !treeViewFlag && clearFiltersFlag ? "block" : "none" }}>
                <Tooltip title="Clear Filters" placement="top">
                  <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={resetFilters}>
                    <img style={{ width: "18px", cursor: 'pointer' }} src={NewClearFilters} alt="invoice" />
                  </Button>
                </Tooltip>
              </div>
              <Dropdown trigger={["click"]} overlay={menu} onVisibleChange={handleVisibleChange} visible={visible}>
                <Tooltip title="Show/Hide Columns" placement="top">
                  <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                    <img style={{ cursor: 'pointer' }} src={NewShowHide} alt="invoice" />
                  </Button>
                </Tooltip>
              </Dropdown>
              <Tooltip title="Reload" placement="top">
                <Button className="listHeaderButtons" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={refreshData} color="primary" >
                  <img style={{ cursor: 'pointer' }} src={NewRefresh} alt="invoice" />
                </Button>
              </Tooltip>
              {windowDefinition.enableprint === "Y" && treeViewFlag === false ? (
                <Tooltip title="Print" placement="top">
                  <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} >
                    <img style={{ cursor: 'pointer' }} src={Print} alt="invoice" />
                  </Button>
                </Tooltip>
              ) : null}
              <Tooltip title="Export" placement="top">
                <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={exportData}>
                  <img style={{ cursor: 'pointer' }} src={NewExport} alt="invoice" />
                </Button>
              </Tooltip>

              {headerTabData.tabenabledforimport === "Y" ? (
                <Tooltip title="Import" placement="top">
                  <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={importData}>
                    <img style={{ width: "16px", cursor: 'pointer' }} src={Import} alt="invoice" />
                  </Button>
                </Tooltip>
              ) : (
                ""
              )}

              {headerTabData.enabletreeview === "Y" ? (
                <Tooltip title="TreeView" placement="top">
                  <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={treeView}>
                    <img style={{ cursor: 'pointer' }} src={TreeView} alt="invoice" />
                  </Button>
                </Tooltip>
              ) : (
                ""
              )}
              {windowDefinition.enableedit === "Y" && selectedRowKeys.length === 1 ? (
                <Tooltip title="Edit" placement="top">
                  <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={editRecord} >
                    <img style={{ cursor: 'pointer' }} src={Edit} alt="invoice" />
                  </Button>
                </Tooltip>
              ) : null}
              {windowDefinition.enabledelete === "Y" && selectedRowKeys.length >= 1 ? (
                <Tooltip className="listHeaderButtons" title="Trash" placement="top">
                  {/* <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} > */}
                    <img style={{ cursor: 'pointer' }} src={Delete} alt="invoice" onClick={deleteRecords} />
                  {/* </Button> */}
                </Tooltip>
              ) : null}
            </div>
          </Col>
        </Row>
      }
      <Row>
        <Col span={24} style={{ marginTop: "0px" }}>
          {isAlertActive ? (
            <Alert
              style={{
                width: "400px",
                position: "absolute",
                zIndex: 111,
                right: 0,
                top: "8px",
                borderLeft: "5px solid #c13832",
                borderRight: "0.5px solid #c13832",
                borderBottom: "0.5px solid #c13832",
                borderTop: "0.5px solid #c13832",
                backgroundColor: "white",
              }}
              message="Error"
              description="There is an error processing your request !"
              type="error"
              closable
              onClose={() => setIsAlertActive(false)}
              action={
                <Button onClick={displayErrorDetails} size="small" style={{ border: "0px solid #c13832", color: "#c13832", fontSize: "13px", marginTop: "6px" }} danger>
                  Detail
                </Button>
              }
            />
          ) : null}
        </Col>
      </Row>
      <Modal
        visible={visibleQuickAddModal}
        onCancel={() => setVisibleQuickAddModal(false)}
        getContainer={false}
        width={modalWidth}
        bodyStyle={{padding:0}}
        closable={false}
        footer={[
          <Button key="save" style={{  fontFamily:"Roboto",fontWeight:700,cursor:"pointer",width:"auto",backgroundColor:"",borderRadius:"1px",height:"35px",border:"1px solid #dadada" }} disabled={formLoading} onClick={() => setVisibleQuickAddModal(false)}>
            Cancel
          </Button>,
          <Button
            key="save-next"
            type="primary"
            disabled={formLoading}
            style={Themes.contentWindow.recordWindow.linesTab.popUpNewButton}
            loading={formLoading}
            onClick={handleSave}
          >
            Save
          </Button>,
        ]}
        title={<>
          <h2 style={{fontWeight:'bold',fontStyle:'normal',float:'left',marginTop:"7px"}}>Quick Add</h2>
          <span style={{float:'right',marginTop:"7px"}}><CloseOutlined onClick={()=>{setVisibleQuickAddModal(false)}}/></span>
          
          </>}
      >
        <hr style={{opacity:0.3,marginTop:"2.5em",height:'1px'}}/>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={formLoading}>
          <Scrollbars
            style={{
              height: "60vh",
            }}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            thumbSize={90}
            renderView={renderView}
            renderThumbHorizontal={renderThumb}
            renderThumbVertical={renderThumb}
          >
            <RecordForm
              form={form}
              idName="quickAdd"
              onFinish={onFinish}
              headerTab={headerTabData}
              headerRecord={headerRecordData}
              headerFieldGroups={headerFieldGroups}
              recordId={"NEW_RECORD"}
            />
          </Scrollbars>
        </Spin>
      </Modal>
      {viewModalFlag === "New" ? (
        <Modal
          width='366px'
          bodyStyle={{ height: '270px' }}
          visible={visibleViewModal}
          title={<>
            <h2 style={{ fontWeight: 'bold', width: '121px', fontStyle: 'normal', float: 'left', marginLeft: '7px' }}>Save View</h2>
            <span style={{ float: 'right' }}><CloseOutlined onClick={() => { setVisibleViewModal(false) }} /></span>
          </>}
          closable={false}
          onCancel={() => {
            setVisibleViewModal(false);
            setViewModalFlag('')
            setViewName("");
          }}
          getContainer={false}
          footer={[
            <span
              style={{ color: Themes.appTheme.primaryColor, fontWeight: 700, cursor: 'pointer' }}
              onClick={() => {
                setVisibleViewModal(false);
                setViewName("");
              }}
            >
              Cancel
            </span>,
            <Button style={{ backgroundColor: Themes.appTheme.primaryColor, color: "white", width: "88px", height: "36px", marginLeft: '31px', fontWeight: 700, borderRadius: '4px' }} onClick={onSaveView}>
              Save
            </Button>,
          ]}
        >
          <br />
          <hr style={{ opacity: 0.2, color: '#000000' }} />
          <div style={{ marginTop: '30px' }}>
            <p style={{ fontWeight: 600, marginLeft: '20px', marginBottom: '2px' }}>View Name</p>
            <Input style={{ margin: '0px 30px 0px 20px', width: 301 }} placeholder="" allowClear onChange={handleViewName} />
            <br />
            <br />
            <p style={{ fontWeight: 600, marginLeft: '20px', marginBottom: '2px' }}>Set as Default</p>
            <Checkbox style={{ marginLeft: '20px', height: '50px' }} />
          </div>
        </Modal>
      ) : ('')}
      {
        viewModalFlag === 'Edit' ? (
          <Modal
            width='366px'
            bodyStyle={{ height: '306px' }}
            visible={visibleViewModal}
            title={<>
              <h2 style={{ fontWeight: 'bold', width: '121px', fontStyle: 'normal', float: 'left', marginLeft: '7px' }}>Edit View</h2>
              <span style={{ float: 'right' }}><CloseOutlined onClick={() => { setVisibleViewModal(false) }} /></span>
            </>}
            closable={false}
            onCancel={() => {
              setVisibleViewModal(false);
              setViewModalFlag('')
              setViewName("");
            }}
            getContainer={false}
            footer={[
              <span
                style={{ color: Themes.appTheme.primaryColor, fontWeight: 700, cursor: 'pointer' }}
                onClick={() => {
                  setVisibleViewModal(false);
                  setViewName("");
                }}
              >
                Cancel
              </span>,
              <Button style={{ backgroundColor: Themes.appTheme.primaryColor, color: "white", width: "88px", height: "36px", marginLeft: '31px', fontWeight: 700, borderRadius: '4px' }} onClick={onEditViewName}>
                Save
              </Button>,
            ]}
          >
            <br />
            <hr style={{ opacity: 0.2, color: '#000000' }} />
            <div style={{ marginTop: '30px' }}>
              <p style={{ fontWeight: 600, marginLeft: '20px', marginBottom: '2px' }}>View Name</p>
              <Input style={{ margin: '0px 30px 0px 20px', width: 301 }} value={recentNameCopy} placeholder="" onChange={editViewName} />
              <br />
              <br />
              {/* <p style={{fontWeight:600,marginLeft:'20px',marginBottom:'2px'}}>View Access</p>
          <Select style={{margin:'0px 30px 0px 20px',width:301}} placeholder="View Access" allowClear />
          <br/>
          <br/> */}
              <p style={{ fontWeight: 600, marginLeft: '20px', marginBottom: '2px' }}>Set as Default</p>
              <Checkbox style={{ marginLeft: '20px', height: '50px' }} />
            </div>
          </Modal>
        ) : ('')
      }

      <Modal
        width={"1000px"}
        visible={importPopupVisible}
        onCancel={() => {
          setImportPopupVisible(false);
        }}
        footer={null}
      >
        <ImportComponent importData={{ importId: headerTabData.ad_tab_id, importFlag: true, windowName: windowDefinition.name }} />
      </Modal>
      <Modal
        title="Confirm Delete"
        visible={deletePopup}
        footer={[
          <span
            style={{ color: Themes.appTheme.primaryColor, fontWeight: 700, cursor: 'pointer' }}
            onClick={propsConfirmCancel}
          >
            Cancel
          </span>,
          <Button style={{ backgroundColor: Themes.appTheme.primaryColor, color: "white", width: "88px", height: "36px", marginLeft: '31px', fontWeight: 700, borderRadius: '4px' }} onClick={onDeleteView(recentID)}>
            Confirm
          </Button>,
        ]}
        closable={false}
        style={{ marginTop: "3%" }}
        width="350px"
      // onOk={propsConfirmOk}
      >
        <center>Do you want to delete</center>
        <center>"<strong>{recentName}</strong>" view ?</center>
      </Modal>
      <MobileMenu mobMenu={mobMenu} setMobMenu={setMobMenu} />
    </div>
  );
};

export default ListWindowHeader;
