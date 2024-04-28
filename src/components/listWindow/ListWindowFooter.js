import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Button, AutoComplete, Card, Input, Dropdown, Menu, Checkbox, message, Alert, Modal, Form, notification, Collapse, Spin, Tooltip, Select, Popconfirm } from "antd";
import { useWindowContext, useGlobalContext } from "../../lib/storage";
import searchIcon from '../../assets/images/searchIconMobile.svg';
import TreeView from "../../assets/images/tree_View.svg";
import NewExport from "../../assets/images/newExportIcon.svg";
import Import from "../../assets/images/importGeneric.svg";
import QuickAdd from "../../assets/images/Quickadd.svg";
import listSearchIcon from '../../assets/images/listSearchIcon.svg';
import DownArrow from "../../assets/images/down.svg";
import ThemeJson from "../../constants/UIServer.json"
import Summary from "../../assets/images/summaryMobile.svg";
import Selection from "../../assets/images/selectionMobile.svg";
import ShowList from "../../assets/images/listView.svg";
import NewShowHide from "../../assets/images/showHideMobile.svg";
import NewClearFilters from "../../assets/images/clearFiltersNew.svg";
import mobileGlobalSearch from "../../assets/images/mobileGlobalSearch.svg";
import Print from "../../assets/images/printNew.svg";
import NewRefresh from "../../assets/images/refreshNewMobile.svg";
import Edit from "../../assets/images/edit.svg";
import Trash from "../../assets/images/trash.svg";
import CollapseAll from "../../assets/images/collapse_all.png";
import ExpandAll from "../../assets/images/expand_all.png";
import RecordForm from "../window/RecordForm";
import dayjs from "dayjs";
import { Scrollbars } from "react-custom-scrollbars";
import { LoadingOutlined, CloseOutlined } from "@ant-design/icons";
import { FieldReference } from "../../lib/fieldReference";
import { deleteTabRecord, getWindowInitializationData, removeView, upsertTabData, getViews, upsertViews, getTabData, importDefinitionService } from "../../services/generic";
import { getTabColumns } from "../window/windowUtilities";
import { ExportToCsv } from "export-to-csv";
import ImportComponent from "../import";
import "antd/dist/antd.css";
import './list.css'
import MobileMenu from "../mobileMenu";

const { Panel } = Collapse;
const { SubMenu } = Menu;

const ListWindowFooter = (props) => {
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
    filterFlag
  } = props;
  const history = useHistory();
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const { windowStore, setWindowStore } = useWindowContext();
  const { windowDefinition } = windowStore;
  const [searchInput, setSearchInput] = useState("");
  const [mobMenu, setMobMenu] = useState(false)
  const [headerTabData, setHeaderTabData] = useState({});
  const [hideAndShowData, setHideAndShowData] = useState([]);
  const [headerFieldGroups, setHeaderFieldGroups] = useState({});
  const [visible, setVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const [summaryMenuItems, setSummaryMenuItems] = useState([]);
  const [columnNames, setColumnNames] = useState([])
  const [viewName, setViewName] = useState("");
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [searchValue, setSearchValue] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [recentVisible, setRecentVisible] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false)
  const [viewsData, setViewsData] = useState([]);
  const [viewsDataCopy, setViewsDataCopy] = useState([])
  const [disabled, setDisabled] = useState(true)
  const [recentName, setRecentName] = useState("");
  const [recentNameCopy, setRecentNameCopy] = useState('');
  const [recentID, setRecentID] = useState("1a2bb3ccc");
  const [saveFlag, setSaveFlag] = useState(false);
  const [importPopupVisible, setImportPopupVisible] = useState(false);

  useEffect(async () => {
    let isMounted = true;
    const response = await getViews(windowDefinition.ad_window_id);
    if (response) {
      if (isMounted) {
        const data = response;
        data.unshift(
          {
            id: '1a2bb3ccc',
            name: 'Standard View'
          }
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
    if (e.key === '1a2bb3ccc') {
      takeViewFilters(JSON.stringify([]));
      setRecentVisible(false);
      setRecentID('1a2bb3ccc')
      const data = viewsData.filter((item) => item.id === e.key);
      setRecentName('Standard View');
      setDisabled(true)
    } else {
      const data = viewsData.filter((item) => item.id === e.key);
      setRecentName(data[0].name);
      setRecentNameCopy(data[0].name)
      takeViewFilters(data[0].filters);
      setRecentVisible(false);
      setDisabled(false)
      setRecentID(e.key)
    }
  };

  const recentSearch = (e) => {
    setInputValue(e.target.value)
    const arr = [];
    viewsData.forEach(tab => {
      if (tab.name.toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0) {
        arr.push(tab)
        setViewsDataCopy(arr)
      }
    })
  }

  const recentMenu = () => {
    return (
      <Menu
        style={{
          overflowY: 'auto',
          maxHeight: "15rem",
        }}
        onClick={handleRecentMenu}
      >
        <Input style={{ margin: '5px', width: innerWidth > 992 ? '200px' : '110px' }} value={inputValue} onChange={recentSearch} />
        {viewsDataCopy.map((item) => {
          return <Menu.Item key={item.id}>{item.name}</Menu.Item>;
        })}
      </Menu>
    );
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

  const handleChange = (e) => {
    setSearchValue(e.target.value)
    const arr = [];
    hideAndShowData.forEach(tab => {
      if (tab.title.toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0) {
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
        <Input style={{ margin: '7px', width: '225px' }} value={searchValue} allowClear onChange={handleChange} />
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


//   const deleteRecords = async () => {
//     setWindowLoading(true);
//     const recordArray = [];
//     selectedRowKeys.map((recordKey) => {
//       return recordArray.push(recordKey.recordId);
//     });
//     const deleteResponse = await deleteTabRecord(headerTabData.ad_tab_id, recordArray);
//     if (deleteResponse.messageCode === "200") {
//       setWindowLoading(false);
//       setSelectedRowKeys([]);
//       message.success(deleteResponse.message);
//       refreshData();
//     } else {
//       setWindowLoading(false);
//       setErrorMessageDetails(deleteResponse);
//       setIsAlertActive(true);
//     }
//   };

  const editRecord = () => {
    history.push(`/window/${windowDefinition.ad_window_id}/${selectedRowKeys[0].recordId}`);
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

 

//   const handleViewsChange = (e) => {
//     setViewModalFlag(e.key);
//     setViewsVisible(false);
//     setVisibleViewModal(true);
//     if (recentName === 'Standard View') {
//       setDisabled(true)
//     } setDisabled(false)
//   };

//   const confirmDeletePopup = () => {
//     setDeletePopup(true)
//     setViewsVisible(false);
//     // <Popconfirm></Popconfirm>
//   }


//   const onEditView = (e) => {
//     setViewModalFlag(e.key);
//     setVisibleViewModal(true);
//     setViewsVisible(false);
//     setRecentNameCopy(recentName)
//     setViewName(recentName)
//   }


//   const viewsMenu = () => {
//     return (
//       <Menu key={"1"} style={{ width: '150px' }} >
//         <Menu.Item key={"New"} onClick={handleViewsChange}>Save View</Menu.Item>
//         <Menu.Item key={"Edit"} disabled={disabled} onClick={onEditView}>Edit View</Menu.Item>
//         <Menu.Item key={"Remove"} disabled={disabled} onClick={confirmDeletePopup}
//         // onClick={onDeleteView(recentID)}
//         >Delete View</Menu.Item>
//       </Menu>
//     );
//   };

//   const onSaveView = () => {
//     if (viewName === null || viewName === '') {
//       message.info('Please give a name for view')
//     } else {
//       let existRecord = false
//       viewsData.map(item => {
//         if (viewName.toLocaleLowerCase() === item.name.toLocaleLowerCase()) {
//           existRecord = true
//           message.error("Grid view name already exists. Select a different name")
//         }
//       })
//       if (existRecord === false) {
//         saveViewName()
//       }
//     }
//   }

//   const saveViewName = async () => {
//     try {
//       setViewModalFlag(false);
//       const userData = { ...globalStore.userData };
//       let finalFilters = [...new Set(filters)];

//       const response = await upsertViews(userData.user_id, userData.cs_client_id, windowDefinition.ad_window_id, viewName, finalFilters, recentID);
//       if (response) {
//         if (response.data.data.upsertViews.title === "Success") {
//           message.success(response.data.data.upsertViews.message);
//           // window.location.reload();
//           setSaveFlag(!saveFlag);
//           setRecentName(viewName)
//         } else {
//           message.error(response.data.data.upsertViews.message)
//         }
//       }
//     } catch (error) {
//       message.error("View is not saved properly");
//     }
//   };



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

  const responsiveButtonMoreIn = {
    xxl: 0,
    xl: 0,
    lg: 24,
    xs: 24,
    sm: 24,
    md: 24,
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
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }
 

  const innerWidth = windowSize.innerWidth
  let subMenuData = JSON.parse(localStorage.getItem("subMenuData"))
  
  return (
    // <div style={{ height: innerWidth > 1004 ? "35px" : "auto" }}>
    //   {innerWidth > 1004 ? null :
    <>
        <Row className="uuu" style={{ padding: "0 1em" }}>
          <Col span={24} >
          <div style={{overflowX:"scroll"}} >
            <div style={{ display: 'flex',justifyContent:"space-between" }}>
                
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
                <Tooltip  title="Summary" placement="top">
                <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column',minWidth:"20%" }}>
                <img style={{ cursor: 'pointer' }} src={Summary} alt="invoice" />
                <p style={{ fontFamily: 'Inter', fontWeight: 400, color: '#192228' }}>Summary</p>
                </div>
                </Tooltip>
              </Dropdown>
              <Fragment>
                {!kanbanCardFlag ? (
                  <div style={{ display: treeViewFlag === true ? "none" : "block" ,minWidth:"20%"}}>
                    <Tooltip title="Kanban View" placement="top">
                    <div onClick={kanbanCards} style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                    <img style={{ cursor: 'pointer' }} src={Selection} alt="invoice" />
                    <p style={{ fontFamily: 'Inter', fontWeight: 400, color: '#192228' }}>Kanban</p>
                    </div>
                    </Tooltip>
                  </div>
                ) : (
                  <Tooltip title="List View" placement="top">
                    <div onClick={kanbanCards} style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column',minWidth:"20%" }}>
                    <img style={{ cursor: 'pointer' }} src={ShowList} alt="invoice" />
                    <p style={{ fontFamily: 'Inter', fontWeight: 400, color: '#192228' }}>List View</p>
                    </div>
                  </Tooltip>
                )}
              </Fragment>
              <Dropdown trigger={["click"]} overlay={menu} onVisibleChange={handleVisibleChange} visible={visible}>
                <Tooltip title="Show/Hide Columns" placement="top">
                <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column',minWidth:"20%" }}>
                    <img style={{ cursor: 'pointer' }} src={NewShowHide} alt="invoice" />
                    <p style={{ fontFamily: 'Inter', fontWeight: 400, color: '#192228' }}>Show/Hide</p>
                    </div>
                </Tooltip>
              </Dropdown>
              <Tooltip title="Reload" placement="top">
              <div onClick={refreshData} style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column',minWidth:"20%" }}>
                    <img style={{ cursor: 'pointer' }} src={NewRefresh} alt="invoice" />
                    <p style={{ fontFamily: 'Inter', fontWeight: 400, color: '#192228' }}>Reload</p>
                    </div>
              </Tooltip>
              {windowDefinition.enableprint === "Y" && treeViewFlag === false ? (
                <Tooltip title="Print" placement="top">
                 <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column',minWidth:"20%" }}>
                    <img style={{ cursor: 'pointer' }} src={Print} alt="invoice" />
                    <p style={{ fontFamily: 'Inter', fontWeight: 400, color: '#192228' }}>Print</p>
                    </div>
                </Tooltip>
              ) : null}
              <Tooltip title="Export" placement="top">
              <div onClick={exportData} style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column',minWidth:"20%" }}>
                    <img style={{ cursor: 'pointer' }} src={NewExport} alt="invoice" />
                    <p style={{ fontFamily: 'Inter', fontWeight: 400, color: '#192228' }}>Export</p>
                    </div>
              </Tooltip>

              {headerTabData.tabenabledforimport === "Y" ? (
                <Tooltip title="Import" placement="top">
                 <div onClick={importData} style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column',minWidth:"20%" }}>
                    <img style={{ cursor: 'pointer' }} src={Import} alt="invoice" />
                    <p style={{ fontFamily: 'Inter', fontWeight: 400, color: '#192228' }}>Import</p>
                    </div>
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
                 <div onClick={editRecord} style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column',minWidth:"20%" }}>
                    <img style={{ cursor: 'pointer' }} src={Edit} alt="invoice" />
                    <p style={{ fontFamily: 'Inter', fontWeight: 400, color: '#192228' }}>Edit</p>
                    </div>
                </Tooltip>
              ) : null}
              {windowDefinition.enabledelete === "Y" && selectedRowKeys.length >= 1 ? (
                <Tooltip className="listHeaderButtons" title="Trash" placement="top">
                  <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column',minWidth:"20%" }}>
                    <img style={{ cursor: 'pointer' }} src={Trash} alt="invoice" />
                    <p style={{ fontFamily: 'Inter', fontWeight: 400, color: '#192228' }}>Delete</p>
                    </div>
                </Tooltip>
              ) : null}
            </div>
            </div>
          </Col>
        </Row>
      

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
      {/* <MobileMenu mobMenu={mobMenu} setMobMenu={setMobMenu} /> */}
      </>
  );
};

export default ListWindowFooter;
