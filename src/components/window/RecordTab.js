import React, { Fragment, useEffect, useState, useRef } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { useParams } from "react-router-dom";
import { Row, Col, Button, Input, Table, Modal, Form, notification, message, Spin, Collapse, Menu, Checkbox, Dropdown, Typography, Tooltip } from "antd"; // eslint-disable-line
import { LoadingOutlined,CloseOutlined } from "@ant-design/icons";
import { useWindowContext, useGlobalContext } from "../../lib/storage";
import { getTabColumns, getTabRecords, getTreeData, getFilterData } from "../window/windowUtilities";
import TreeView from "../../assets/images/tree_View.svg";
import ShowAndHide from "../../assets/images/showandHide.svg";
import ImportHover from "../../assets/images/importHover.svg";
import ImportDefault from "../../assets/images/importDefault.svg";
import ColumnHover from "../../assets/images/columnHover.svg"
import ColumnDefault from "../../assets/images/columnDefault.svg"
import Repeat from "../../assets/images/repeat.svg";
import useDebounce from "../../lib/hooks/useDebounce";
import Summary from "../../assets/images/summaryTab.svg";
import Summary2 from "../../assets/images/State=Hover.svg"
import "./index.css"
import Reset from "../../assets/images/reloadIcon.svg";
import Reset2 from "../../assets/images/reloadIconHover.svg";
import ThemeJson from "../../constants/UIServer.json"
import filterDefault from "../../assets/images/filterDefault.svg";
import filterHover from "../../assets/images/filterHover.svg";
import ListMore from "../../assets/images/listMoreIcon.svg";
// import AddnewIcon from "../../assets/images/addnewIcon.svg";
import AddnewIcon from "../../assets/images/tabAddNew.svg";
import Import from "../../assets/images/importGeneric.svg";
import Delete from "../../assets/images/deleteDefault.svg"
import DeleteHover from "../../assets/images/deleteHover.svg"
import Previous from "../../assets/images/previous.svg";
import NewPrevious from "../../assets/images/prevNew.svg";
import Next from "../../assets/images/next.svg";
import NewNextIcon from "../../assets/images/nextNew.svg";
import ImportComponent from "../import";
import "../../styles/antd.css"
import dayjs from "dayjs";
import { Resizable } from "react-resizable";

import "antd/dist/antd.css";
import { deleteTabRecord, getTabData, getWindowInitializationData, upsertTabData, getTabSummary } from "../../services/generic";
import RecordForm from "./RecordForm";
import { FieldReference } from "../../lib/fieldReference";
import FormTable from "./FormTable";

const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
const { Panel } = Collapse;

const ResizableCell = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const RecordTab = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const { windowStore, setWindowStore } = useWindowContext();
  const windowDefinition = { ...windowStore.windowDefinition };
  const { tabData, isHeaderActive, headerRecordData, selectRecord, lastRefreshed } = props;
  const { recordId, parentTabRecordData } = tabData;
  const { windowId} = useParams();
  const [tabRecords, setTabRecords] = useState([]);
  const [tabColumns, setTabColumns] = useState([]);
  const [importPopupVisible, setImportPopupVisible] = useState(false);
  const [nestedData, setNestedData] = useState({});
  const [deleteModal,setDeleteModal] = useState(false)
  const [isLoading, setIsLoading] = useState({});
  const [tabLastRefreshed, setTabLastRefreshed] = useState(null);
  const [treeViewFlag, setTreeViewFlag] = useState(() => {
    const tablevel = parseInt(tabData.tablevel);
    const tabId = tabData.ad_tab_id;
    const finalTabLevel = tablevel.toString();
    if (
      windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabTreeView === undefined ||
      windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabTreeView === false
    ) {
      return false;
    } else {
      return true;
    }
  });
  const [filterArray, setFilterArray] = useState({});
  const [sorterArray, setSorterArray] = useState({});
  const [finalFilterArray, setFinalFilterArray] = useState([]);
  const [finalSorterArray, setFinalSorterArray] = useState([]);
  const [reOrderIndexes, setReOrderIndexes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const [hideAndShowData, setHideAndShowData] = useState([]);
  const [summaryData, setSummaryData] = useState(() => {
    const tablevel = parseInt(tabData.tablevel);
    const tabId = tabData.ad_tab_id;
    const finalTabLevel = tablevel.toString();
    if (
      windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabSummary === undefined ||
      windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabSummary === {}
    ) {
      return {};
    } else {
      return windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabSummary;
    }
  });
  const [summaryMenuItems, setSummaryMenuItems] = useState([]);
  const [summaryResponse, setSummaryResponse] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState();
  const [activeRecordId, setActiveRecordId] = useState();
  const [form] = Form.useForm();
  const { Text } = Typography;
  const headerTabRecordDataRef = useRef({});
  const scrollbarRef = useRef();

  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleIconHover = (iconName) => {
    setHoveredIcon(iconName);
  };

  const handleIconLeave = () => {
    setHoveredIcon(null);
  };

  const checkConditionalLogic = (logicString) => {
    if (logicString) {
      let string = logicString;
      const keys = logicString?.split("@");
      const actualKeys = keys.filter((s) => s.length === 32);
      for (const logicKey of actualKeys) {
        let keyValue = headerRecordData[logicKey];
        if (typeof keyValue === "string" && isNaN(keyValue)) {
          keyValue = `'${keyValue}'`;
        }
        const stringToUpdate = "@" + logicKey + "@";
        string = string.replaceAll(stringToUpdate, keyValue);
      }
      string = string.replaceAll("=", "==");
      string = string.replaceAll("<==", "<=");
      string = string.replaceAll(">==", ">=");
      string = string.replaceAll("&", "&&");
      string = string.replaceAll("|", "||");
      string = string.replaceAll("====", "===");
      string = string.replaceAll("&&&&", "&&");
      string = string.replaceAll("||||", "||");
      let logicStateValid = true;
      try {
        logicStateValid = eval(string); // eslint-disable-line
      } catch (error) {
        console.error("Invalid Display Logic Condition: ", string);
        logicStateValid = false;
      }
      return logicStateValid;
    } else {
      return true;
    }
  };

  useEffect(() => {
    try {
      setLoading(true);
      tabData.fields.sort((a, b) => {
        const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
        const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      const tabColumnsData = getTabColumns(tabData);
      let finalFilterArray = [];
      let finalSorterArray = [];
      if (sorterArray.order !== undefined && sorterArray.field !== undefined) {
        finalSorterArray.push(`{'${`sortBy`}':'${sorterArray.field.replace("_iden", "")}','${`sortDirection`}':'${sorterArray.order === "ascend" ? "ASC" : "DESC"}'}`);
      }
      setFinalSorterArray(finalSorterArray);
      getTabRecords({
        windowId:windowDefinition.ad_window_id,
        ad_tab_id: tabData.ad_tab_id,
        parentTabId: tabData.parent_tab_id,
        parentRecordID: recordId,
        startRow: "0",
        endRow: `${tabData.pagelimit}`,
        sortInfo: finalSorterArray.length !== 0 ? finalSorterArray : null,
      }).then((getTabRecordsResponse) => {
        let filteredData = getFilterData(tabColumnsData, getTabRecordsResponse, tabData);
        for (let index1 = 0; index1 < Object.keys(filterArray).length; index1++) {
          if (Object.values(filterArray)[index1] !== null) {
            for (let index2 = 0; index2 < filteredData.length; index2++) {
              if (Object.keys(filterArray)[index1] === filteredData[index2].dataIndex) {
                if (
                  filteredData[index2].baseReferenceId === "17" ||
                  filteredData[index2].baseReferenceId === "19" ||
                  filteredData[index2].baseReferenceId === "15" ||
                  filteredData[index2].baseReferenceId === "16"
                ) {
                  finalFilterArray.push(`{'${`filterBy`}':'${Object.keys(filterArray)[index1].replace("_iden", "")}','${`filterTerm`}':'[${Object.values(filterArray)[index1]}]'}`);
                } else {
                  finalFilterArray.push(`{'${`filterBy`}':'${Object.keys(filterArray)[index1].replace("_iden", "")}','${`filterTerm`}':'${Object.values(filterArray)[index1]}'}`);
                }
              }
            }
          }
        }
        let enableEdit = windowDefinition.enableedit === "Y" ? true : false;
        let enableDelete = windowDefinition.enabledelete === "Y" ? true : false;
        if (tabData.editrecord) {
          enableEdit = tabData.editrecord === "Y" ? true : false;
        }
        if (tabData.deleterecord) {
          enableDelete = tabData.deleterecord === "Y" ? true : false;
        }
        /* filteredData.unshift({
          title: "Action",
          width: 80,
          render: (value) => {
            return (
              <span>
                {enableEdit ? <i className="fa fa-pencil" style={{ color: "#706e6b" }} aria-hidden="true" onClick={(e) => editRecord(e, value)}></i> : null}
                {enableDelete && enableEdit ? <span style={{ color: "#000000", opacity: "30%" }}>&ensp;&#9474;&ensp;</span> : null}
                {enableDelete ? <i className="fa fa-trash" style={{ color: "#706e6b" }} aria-hidden="true" onClick={(e) => deleteTabRecordValue(e, value)}></i> : null}
              </span>
            );
          },
        }); */
        for (let index = 0; index < filteredData.length; index++) {
          let title = filteredData[index].title;
          if (title !== "Action") {
            filteredData[index].title = <span className="dragHandler">{title}</span>;
          }
        }
        setFinalFilterArray(finalFilterArray);
        if (finalFilterArray.length > 0) {
          getTabRecords({
            windowId:windowDefinition.ad_window_id,
            ad_tab_id: tabData.ad_tab_id,
            parentTabId: tabData.parent_tab_id,
            parentRecordID: recordId,
            startRow: "0",
            endRow: `${tabData.pagelimit}`,
            filterData: finalFilterArray,
            sortInfo: finalSorterArray.length !== 0 ? finalSorterArray : null,
          }).then((getTabRecordsResponse) => {
            setTabColumns([...filteredData]);
            setTabRecords([...getTabRecordsResponse]);
            setLoading(false);
          });
        } else {
          if (treeViewFlag === false) {
            setTabColumns([...filteredData]);
            setTabRecords([...getTabRecordsResponse]);
            setLoading(false);
          } else {
            getTabRecords({
              windowId:windowDefinition.ad_window_id,
              ad_tab_id: tabData.ad_tab_id,
              parentTabId: tabData.parent_tab_id,
              parentRecordID: recordId,
              startRow: "0",
              endRow: "300",
              sortInfo: finalSorterArray.length !== 0 ? finalSorterArray : null,
            }).then((getTabRecordsResponse) => {
              setTabColumns([...filteredData]);
              const treeRowData = getTreeData(getTabRecordsResponse, windowDefinition.tabs);
              setTabRecords([...treeRowData]);
              setLoading(false);
            });
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  }, [recordId, lastRefreshed, treeViewFlag, filterArray, tabLastRefreshed]);

  useEffect(() => {
    const windowDef = { ...windowDefinition };
    if (windowDef.tabs) {
      const tablevel = parseInt(tabData.tablevel);
      const tabId = tabData.ad_tab_id;
      const finalTabLevel = tablevel.toString();
      const lineTab = windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)];
      lineTab.fields.sort((a, b) => {
        const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
        const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      for (let index1 = 0; index1 < lineTab.fields.length; index1++) {
        if (
          lineTab.fields[index1].nt_base_reference_id !== FieldReference.Button &&
          lineTab.fields[index1].isdisplayed === "Y" &&
          lineTab.fields[index1].isactive === "Y" &&
          lineTab.fields[index1].showinrelation === "Y"
        ) {
          if (tabColumns.length > 0) {
            for (let index2 = 0; index2 < tabColumns.length; index2++) {
              if (tabColumns[index2].dataIndex !== undefined) {
                if (tabColumns[index2].dataIndex.replace("_iden", "") === lineTab.fields[index1].ad_field_id) {
                  lineTab.fields[index1].gridlength = tabColumns[index2].width;
                }
              }
            }
          }
        }
      }
    }
    setWindowStore({ windowDefinition: windowDef });
  }, [tabColumns]);

  useEffect(() => {
    if (windowDefinition.tabs) {
      const tablevel = parseInt(tabData.tablevel);
      const tabId = tabData.ad_tab_id;
      const finalTabLevel = tablevel.toString();
      const lineTab = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)];
      lineTab.fields.sort((a, b) => {
        const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
        const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      const tabColumnsData = getTabColumns(lineTab);
      if (tabRecords.length > 0) {
        let filteredData = getFilterData(tabColumnsData, tabRecords, lineTab);
        let enableEdit = windowDefinition.enableedit === "Y" ? true : false;
        let enableDelete = windowDefinition.enabledelete === "Y" ? true : false;
        if (tabData.editrecord) {
          enableEdit = tabData.editrecord === "Y" ? true : false;
        }
        if (tabData.deleterecord) {
          enableDelete = tabData.deleterecord === "Y" ? true : false;
        }
        if (enableEdit && tabData.editrecord_displaylogic) {
          enableEdit = checkConditionalLogic(tabData.editrecord_displaylogic);
        }
        if (enableDelete && tabData.deleterecord_displaylogic) {
          enableDelete = checkConditionalLogic(tabData.deleterecord_displaylogic);
        }

        let actionIndex = filteredData.findIndex((f) => f.title === "Action");
        if (actionIndex >= 0) {
          filteredData.splice(actionIndex, 1);
        }
        // filteredData.map(item=>{
        //   console.log(item.title)
        // })
        // if (enableEdit || enableDelete) {
        //   filteredData.unshift({
        //     title: "Action",
        //     width: 80,
        //     render: (value) => {
        //       return (
        //         <span>
        //           {enableEdit ? <i className="fa fa-pencil" aria-hidden="true" onClick={(e) => editRecord(e, value)}></i> : null}
        //           {enableDelete && enableEdit ? <span>&ensp;&#9474;&ensp;</span> : null}
        //           {enableDelete ? <i className="fa fa-trash" aria-hidden="true" onClick={(e) => deleteTabRecordValue(e, value)}></i> : null}
        //         </span>
        //       );
        //     },
        //   });
        // }

        for (let index = 0; index < filteredData.length; index++) {
          let title = filteredData[index].title;
          if (title !== "Action") {
            filteredData[index].title = <span className="dragHandler">{title}</span>;
          }
        }
        setTabColumns([...filteredData]);
      }
    }
  }, [hideAndShowData, reOrderIndexes, headerRecordData]);

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  useEffect(() => {
    if (windowDefinition.tabs) {
      const tablevel = parseInt(tabData.tablevel);
      const tabId = tabData.ad_tab_id;
      const finalTabLevel = tablevel.toString();
      const lineTab = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)];
      lineTab.fields.sort((a, b) => {
        const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
        const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      let hideAndShowTitles = [];
      for (let index1 = 0; index1 < lineTab.fields.length; index1++) {
        if (lineTab.fields[index1].nt_base_reference_id !== FieldReference.Button && lineTab.fields[index1].isdisplayed === "Y" && lineTab.fields[index1].isactive === "Y") {
          hideAndShowTitles.push({
            title: lineTab.fields[index1].name,
            checked: lineTab.fields[index1].showinrelation === "Y" ? true : false,
          });
        }
      }
      setHideAndShowData(hideAndShowTitles);
    }
  }, [checkBox, reOrderIndexes]);

  const onChange = (e, i) => {
    const windowDef = { ...windowDefinition };
    const tablevel = parseInt(tabData.tablevel);
    const tabId = tabData.ad_tab_id;
    const finalTabLevel = tablevel.toString();
    if (windowDef.tabs) {
      const lineTab = windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)];
      lineTab.fields.sort((a, b) => {
        const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
        const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      for (let index1 = 0; index1 < lineTab.fields.length; index1++) {
        if (lineTab.fields[index1].name === e.target.id) {
          if (e.target.checked) {
            lineTab.fields[index1].showinrelation = "Y";
          } else {
            lineTab.fields[index1].showinrelation = "N";
          }
        }
      }
    }
    setWindowStore({ windowDefinition: windowDef });
    setCheckBox(!checkBox);
  };

  const menu = () => {
    return (
      <Menu
        key="1"
        style={{
          overflowY: "scroll",
          maxHeight: "15rem",
        }}
      >
        {hideAndShowData.map((item, index) => {
          return (
            <Menu.Item key={index}>
              <Checkbox key={index} id={item.title} onChange={(e) => onChange(e, index)} checked={item.checked}>
                {item.title}
              </Checkbox>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  useEffect(() => {
    const tablevel = parseInt(tabData.tablevel);
    const tabId = tabData.ad_tab_id;
    const finalTabLevel = tablevel.toString();
    const windowDef = { ...windowDefinition };
    if (windowDef) {
      windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabTreeView = treeViewFlag;
      windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabSummary = summaryData;
    }
    setWindowStore({ windowDefinition: windowDef });
  }, [treeViewFlag, summaryData]);

  const deleteTabRecordValue = async (e, value) => {
    if (e) {
      e.stopPropagation();
    }
    setLoading(true);
    const recordsForDeletion = [];
    recordsForDeletion.push(value.recordId);
    const deleteTabResponse = await deleteTabRecord(windowDefinition.ad_window_id,tabData.ad_tab_id, recordsForDeletion);
    if (deleteTabResponse.messageCode !== "200") {
      notification["error"]({
        message: deleteTabResponse.title,
        description: deleteTabResponse.message,
      });
    }

    const getTabRecordsResponse = await getTabRecords({
      windowId:windowDefinition.ad_window_id,
      ad_tab_id: tabData.ad_tab_id,
      parentTabId: tabData.parent_tab_id,
      parentRecordID: recordId,
      startRow: "0",
      endRow: `${tabData.pagelimit}`,
      sortInfo: finalSorterArray.length !== 0 ? finalSorterArray : null,
    });
    setTabRecords([...getTabRecordsResponse]);
    setLoading(false);
  };

  const [isEditRecordActive, setIsEditRecordActive] = useState(false);
  const editRecord = (e, value) => {
    if (e) {
      e.stopPropagation();
    }
    if (value.recordId) {
      addOrEditRecord(value.recordId, tabData.name);
      setIsEditRecordActive(true);
    }
  };

  const getSearchData = (e) => {
    // eslint-disable-line
    const searchValue = e.target.value;
    setSearchInput(searchValue);
  };

  const debouncedSearchKey = useDebounce(searchInput, 350);
  useEffect(() => {
    if (searchInput !== null) {
      if (debouncedSearchKey || debouncedSearchKey === "") {
        getLineSearchDataValue(debouncedSearchKey);
      }
    }
  }, [debouncedSearchKey]);

  const getLineSearchDataValue = async (SearchValue) => {
    setLoading(true);
    const getTabRecordsResponse = await getTabRecords({
      windowId:windowDefinition.ad_window_id,
      ad_tab_id: tabData.ad_tab_id,
      parentTabId: tabData.parent_tab_id,
      parentRecordID: recordId,
      search: SearchValue,
      startRow: "0",
      endRow: `${tabData.pagelimit}`,
      sortInfo: finalSorterArray.length !== 0 ? finalSorterArray : null,
    });
    setTabRecords([...getTabRecordsResponse]);
    setLoading(false);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rowSelectionKeys, setRowSelectionKeys] = useState([]);
  const onSelectChange = (keys,selectedRows) => {
    setRowSelectionKeys([...keys])
    setSelectedRowKeys([...selectedRows])
    // setSelectedRowKeys([keys[keys.length - 1]]);
  };

  const rowSelection = {
    selectedRowKeys:rowSelectionKeys,
    onChange: onSelectChange,
    hideSelectAll: false,
    fixed: true,
  };

  const propsConfirmCancel=()=>{
    setDeleteModal(false)
  }

  const deleteLines = async ()=>{
    setLoading(true);
    const recordArray = [];
    selectedRowKeys.map((recordKey) => {
      return recordArray.push(recordKey.recordId); });
      const deleteTabResponse = await deleteTabRecord(windowDefinition.ad_window_id,tabData.ad_tab_id, recordArray);
      if (deleteTabResponse.messageCode !== "200") {
        notification["error"]({
          message: deleteTabResponse.title,
          description: deleteTabResponse.message,
        });
      }else{
        setDeleteModal(false)
        notification["success"]({
          message: deleteTabResponse.title,
          description: deleteTabResponse.message,
        });
      }
  
      const getTabRecordsResponse = await getTabRecords({
        windowId:windowDefinition.ad_window_id,
        ad_tab_id: tabData.ad_tab_id,
        parentTabId: tabData.parent_tab_id,
        parentRecordID: recordId,
        startRow: "0",
        endRow: `${tabData.pagelimit}`,
        sortInfo: finalSorterArray.length !== 0 ? finalSorterArray : null,
      });
      setTabRecords([...getTabRecordsResponse]);
      setLoading(false);
  }

  const [nextAction, setNextAction] = useState("");
  const [loadingModal, setLoadingModal] = useState(false);
  const handleSave = (action) => {
    form
      .validateFields()
      .then(() => {
        form.submit();
        setLoadingModal(true);
        // setIsModalVisible(false);
      })
      .catch((error) => {
        console.error(JSON.stringify(error, null, 2));
      });

    if (action === "saveNext") {
      setNextAction("next");
    } else if (action === "savePrev") {
      setNextAction("previous");
    } else {
      setNextAction("");
    }
  };

  const [headerTab, setHeaderTab] = useState({ fields: [] });
  const [headerRecord, setHeaderRecord] = useState({});
  const [headerFieldGroups, setHeaderFieldGroups] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [jsonParam, setJsonParam] = useState();

  const rowsInLine = headerTab.noofcolumnsinrow;
  let colSpanValue = 8;
  let modalWidth = "280px";
  if (rowsInLine && !isHeaderActive) {
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

  useEffect(() => {
    headerTabRecordDataRef.current = headerRecordData;
  }, [headerRecordData]);

  const addOrEditRecord = async (selectedRecordId, tabName) => {
    if (!isHeaderActive) {
      props.setLoadingRecordWindow(true);
      const headerRecordDataIn = headerTabRecordDataRef.current;
      const localWindowDefinition = { ...windowDefinition };
      const masterParentTabDataIndex = localWindowDefinition.tabs.findIndex((tab) => tab.tablevel === "0");
      const headerTabData = localWindowDefinition.tabs[localWindowDefinition.tabs.findIndex((tab) => tab.name === tabName)];
      const localIndex = localWindowDefinition.tabs.findIndex((tab) => tab.ad_tab_id === tabData.parent_tab_id);
      const parentTab = localWindowDefinition.tabs[localIndex];
      const parentTabId = parentTab.ad_tab_id;
      headerTabData.fields.sort((a, b) => {
        const x = a.seqno !== null ? parseInt(a.seqno) : a.seqno;
        const y = b.seqno !== null ? parseInt(b.seqno) : b.seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      setHeaderTab(headerTabData);
      setActiveRecordId(selectedRecordId);

      let headerRecordDataLocal;
      if (selectedRecordId !== "NEW_RECORD") {
        const getTabDataResponse = await getTabData({ windowId:windowDefinition.ad_window_id,ad_tab_id: headerTabData.ad_tab_id, parentTabId: parentTabId, recordId: selectedRecordId, startRow: "0", endRow: "1" });
        headerRecordDataLocal = getTabDataResponse[0];
      } else {
        let sessionValues = {};
        parentTab.fields.map((field) => {
          if (field.issession === "Y") {
            if (parentTab.tablevel === "0") {
              sessionValues[field.column_name] = headerRecordDataIn[field.ad_field_id];
            } else {
              sessionValues[field.column_name] = parentTabRecordData[field.ad_field_id];
            }
          }
          return null;
        });
        if (parentTab.tablevel !== "0") {
          localWindowDefinition.tabs[masterParentTabDataIndex].fields.map((field) => {
            if (field.issession === "Y") {
              sessionValues[field.column_name] = headerRecordDataIn[field.ad_field_id];
            }
            return null;
          });
        }
        const stringifiedSession = JSON.stringify(sessionValues);
        const updatedSession = stringifiedSession.replace(/\\"/g, '\\"');
        const stringRequest = JSON.stringify(updatedSession);
        setJsonParam(stringRequest);
        headerRecordDataLocal = await getWindowInitializationData(windowDefinition.ad_window_id,headerTabData.ad_tab_id, parentTabId, stringRequest);
      }
      setHeaderRecord(headerRecordDataLocal);

      const fieldGroupsList = {};
      headerTabData.fields.forEach((element) => {
        if (element.fieldgroup_name !== undefined && element.nt_base_reference_id !== "28") {
          fieldGroupsList[element.fieldgroup_name] = fieldGroupsList[element.fieldgroup_name] || [];
          fieldGroupsList[element.fieldgroup_name].push(element);
        }
      });
      setHeaderFieldGroups(fieldGroupsList);
      setIsModalVisible(true);
      props.setLoadingRecordWindow(false);
      // scrollbarRef.current.scrollTop = 0;
    } else {
      message.warning("Please Save Header !");
    }
  };

  const [toggleNewRecordEdit, setToggleNewRecordEdit] = useState();

  const addRecordInTable = async () => {
    if (!isHeaderActive) {
      setLoading(true);
      const headerRecordDataIn = headerTabRecordDataRef.current;
      const localWindowDefinition = { ...windowDefinition };
      const masterParentTabDataIndex = localWindowDefinition.tabs.findIndex((tab) => tab.tablevel === "0");
      const headerTabData = localWindowDefinition.tabs[localWindowDefinition.tabs.findIndex((tab) => tab.name === tabData.name)];
      const localIndex = localWindowDefinition.tabs.findIndex((tab) => tab.ad_tab_id === tabData.parent_tab_id);
      const parentTab = localWindowDefinition.tabs[localIndex];
      const parentTabId = parentTab.ad_tab_id;
      headerTabData.fields.sort((a, b) => {
        const x = a.seqno !== null ? parseInt(a.seqno) : a.seqno;
        const y = b.seqno !== null ? parseInt(b.seqno) : b.seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });

      let sessionValues = {};
      parentTab.fields.map((field) => {
        if (field.issession === "Y") {
          if (parentTab.tablevel === "0") {
            sessionValues[field.column_name] = headerRecordDataIn[field.ad_field_id];
          } else {
            sessionValues[field.column_name] = parentTabRecordData[field.ad_field_id];
          }
        }
        return null;
      });
      if (parentTab.tablevel !== "0") {
        localWindowDefinition.tabs[masterParentTabDataIndex].fields.map((field) => {
          if (field.issession === "Y") {
            sessionValues[field.column_name] = headerRecordDataIn[field.ad_field_id];
          }
          return null;
        });
      }
      const stringifiedSession = JSON.stringify(sessionValues);
      const updatedSession = stringifiedSession.replace(/\\"/g, '\\"');
      const stringRequest = JSON.stringify(updatedSession);
      let headerRecordDataLocal;
      headerRecordDataLocal = await getWindowInitializationData(windowDefinition.ad_window_id,headerTabData.ad_tab_id, parentTabId, stringRequest);

      headerRecordDataLocal.key = "0-NEW_RECORD";
      headerRecordDataLocal.recordId = "NEW_RECORD";

      const newTabRecords = [...tabRecords];
      newTabRecords.unshift(headerRecordDataLocal);
      setTabRecords([...newTabRecords]);
      setLoading(false);
      setToggleNewRecordEdit(new Date());
    }
  };

  const [clearFields, setClearFields] = useState();
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditRecordActive(false);
    setClearFields(new Date());
  };

  const onFinish = async (values) => {
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

    if (activeRecordId === "NEW_RECORD") {
      Object.entries(values).map(() => {
        Object.entries(headerRecord).map(([headerKey, headerValue]) => {
          if (values[headerKey] === undefined) {
            if (headerKey.search("_iden") === -1) {
              values[headerKey] = headerValue;
            }
          }
          return null;
        });
        return null;
      });
    }

    const stringifiedFields = JSON.stringify(values);
    const updatedStrings = stringifiedFields.replace(/\\"/g, '\\"');
    const stringRequest = JSON.stringify(updatedStrings);
    const parentTabId = tabData.parent_tab_id;

    const upsertResponse = await upsertTabData(windowDefinition.ad_window_id,headerTab.ad_tab_id, activeRecordId, stringRequest, parentTabId, recordId);
    if (upsertResponse.data.data.upsertTab.status === "200") {
      message.success(`${upsertResponse.data.data.upsertTab.message}`);
      setLoading(true);
      const getTabRecordsResponse = await getTabRecords({
        windowId:windowDefinition.ad_window_id,
        ad_tab_id: tabData.ad_tab_id,
        parentTabId: parentTabId,
        parentRecordID: recordId,
        startRow: "0",
        endRow: `${tabData.pagelimit}`,
        sortInfo: finalSorterArray.length !== 0 ? finalSorterArray : null,
      });
      setTabRecords([...getTabRecordsResponse]);
      setClearFields(new Date());
      setLoadingModal(false);
      setLoading(false);
      if (nextAction && isEditRecordActive) {
        const activeRecordIndex = tabRecords.findIndex((r) => r.recordId === activeRecordId);
        let nextRecordIndex = nextAction === "next" ? activeRecordIndex + 1 : activeRecordIndex - 1;
        if (activeRecordIndex >= 0 && nextRecordIndex < tabRecords.length) {
          addOrEditRecord(tabRecords[nextRecordIndex].recordId, tabData.name);
        } else {
          setIsModalVisible(false);
          setIsEditRecordActive(false);
        }
      } else if (nextAction) {
        addOrEditRecord("NEW_RECORD", tabData.name);
      } else {
        setIsModalVisible(false);
        setIsEditRecordActive(false);
      }
    } else {
      setLoadingModal(false);
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
      // message.error(upsertResponse.data.data.upsertTab.message);
    }
  };

  const expandedRowRender = (record) => {
    if (windowDefinition.tabs) {
      const tablevel = parseInt(tabData.tablevel) + 1;
      const tabId = tabData.ad_tab_id;
      const finalTabLevel = tablevel.toString();
      const levelTabs = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)];
      if (levelTabs !== undefined) {
        levelTabs.fields.sort((a, b) => {
          const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
          const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
          return (x != null ? x : Infinity) - (y != null ? y : Infinity);
        });
        const tabColumnsData = getTabColumns(levelTabs);
        const data = nestedData[record.recordId];
        return (
          <Table
            style={{ fontSize: "12px" }}
            size="small"
            sticky={true}
            scroll={{ y: "20vh" }}
            columns={tabColumnsData}
            dataSource={nestedData[record.recordId]}
            loading={isLoading[record.recordId] && !data}
            pagination={false}
          />
        );
      } else {
        return;
      }
    }
  };

  const handleExpand = (expanded, record) => {
    setIsLoading({
      [record.recordId]: true,
    });
    if (expanded === true) {
      if (tabData.child_tab_id !== null) {
        getTabRecords({
          windowId:windowDefinition.ad_window_id,
          ad_tab_id: tabData.child_tab_id,
          parentTabId: tabData.ad_tab_id,
          parentRecordID: record.recordId,
          startRow: "0",
          endRow: `${tabData.pagelimit}`,
          sortInfo: finalSorterArray.length !== 0 ? finalSorterArray : null,
        }).then((getTabRecordsResponse) => {
          setNestedData((state) => ({
            ...state,
            [record.recordId]: getTabRecordsResponse,
          }));
        });
      } else {
        setNestedData((state) => ({
          ...state,
          [record.recordId]: [],
        }));
      }
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setFilterArray(filters);
    setSorterArray(sorter);
  };

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      let startIndex, endIndex;
      if (tabData.enablenestedtab === "Y") {
        startIndex = fromIndex - 2;
        endIndex = toIndex - 2;
      } else {
        startIndex = fromIndex - 1;
        endIndex = toIndex - 1;
      }
      let tempDataindexes = [];
      for (let index = 0; index < tabColumns.length; index++) {
        if (index === startIndex) {
          if (tabColumns[index].title !== "Action") {
            tempDataindexes.push(tabColumns[index].dataIndex.replace("_iden", ""));
          }
        }
      }
      for (let index = 0; index < tabColumns.length; index++) {
        if (index === endIndex) {
          if (tabColumns[index].title !== "Action") {
            tempDataindexes.push(tabColumns[index].dataIndex.replace("_iden", ""));
          }
        }
      }
      let index1, index2;
      const windowDef = { ...windowDefinition };
      if (windowDef.tabs) {
        const tablevel = parseInt(tabData.tablevel);
        const tabId = tabData.ad_tab_id;
        const finalTabLevel = tablevel.toString();
        const lineTab = windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)];
        lineTab.fields.sort((a, b) => {
          const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
          const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
          return (x != null ? x : Infinity) - (y != null ? y : Infinity);
        });
        for (let index = 0; index < lineTab.fields.length; index++) {
          if (lineTab.fields[index].nt_base_reference_id !== FieldReference.Button && lineTab.fields[index].isdisplayed === "Y" && lineTab.fields[index].isactive === "Y") {
            if (tempDataindexes[0] === lineTab.fields[index].ad_field_id) {
              index1 = index;
            }
          }
        }
        for (let index = 0; index < lineTab.fields.length; index++) {
          if (lineTab.fields[index].nt_base_reference_id !== FieldReference.Button && lineTab.fields[index].isdisplayed === "Y" && lineTab.fields[index].isactive === "Y") {
            if (tempDataindexes[1] === lineTab.fields[index].ad_field_id) {
              index2 = index;
            }
          }
        }
        const item = lineTab.fields.splice(index1, 1)[0];
        lineTab.fields.splice(index2, 0, item);
        for (let index = 0; index < lineTab.fields.length; index++) {
          if (lineTab.fields[index].nt_base_reference_id !== FieldReference.Button && lineTab.fields[index].isdisplayed === "Y" && lineTab.fields[index].isactive === "Y") {
            lineTab.fields[index].grid_seqno = index;
          }
        }
      }
      setWindowStore({ windowDefinition: windowDef });
      setReOrderIndexes([index1, index2]);
    },
    nodeSelector: "th",
    handleSelector: ".dragHandler",
    ignoreSelector: "react-resizable-handle",
  };

  const handleSummaryVisibleChange = (flag) => {
    setSummaryVisible(flag);
  };

  const handleSummary = (e) => {
    const tablevel = parseInt(tabData.tablevel);
    const tabId = tabData.ad_tab_id;
    const finalTabLevel = tablevel.toString();
    const windowDef = { ...windowDefinition };
    if (windowDef) {
      if (e.target.id === "SUM") {
        if (e.target.checked) {
          windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabSum = true;
        } else {
          windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabSum = false;
        }
      }
      if (e.target.id === "COUNT") {
        if (e.target.checked) {
          windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabCount = true;
        } else {
          windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabCount = false;
        }
      }
      if (e.target.id === "MIN") {
        if (e.target.checked) {
          windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabMin = true;
        } else {
          windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabMin = false;
        }
      }
      if (e.target.id === "MAX") {
        if (e.target.checked) {
          windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabMax = true;
        } else {
          windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabMax = false;
        }
      }
      if (e.target.id === "AVG") {
        if (e.target.checked) {
          windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabAvg = true;
        } else {
          windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabAvg = false;
        }
      }
    }
    let fieldIds = [];
    for (let i = 0; i < tabColumns.length; i++) {
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
    setWindowStore({ windowDefinition: windowDef });
    if (fieldIds.length > 0) {
      const summary =
        windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabSummary === undefined ||
        windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabSummary === {}
          ? {}
          : windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabSummary;
      if (e.target.checked) {
        summary[e.target.id] = fieldIds;
      } else {
        delete summary[e.target.id];
      }
      setSummaryData({ ...summary });
    }
  };

  useEffect(() => {
    const tablevel = parseInt(tabData.tablevel);
    const tabId = tabData.ad_tab_id;
    const finalTabLevel = tablevel.toString();
    const summaryMenu = [
      {
        title: "TOTAL",
        id: "SUM",
        checked:
          windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabSum === undefined ||
          windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabSum === false
            ? false
            : true,
      },
      {
        title: "COUNT",
        id: "COUNT",
        checked:
          windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabCount === undefined ||
          windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabCount === false
            ? false
            : true,
      },
      {
        title: "MIN",
        id: "MIN",
        checked:
          windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabMin === undefined ||
          windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabMin === false
            ? false
            : true,
      },
      {
        title: "MAX",
        id: "MAX",
        checked:
          windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabMax === undefined ||
          windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabMax === false
            ? false
            : true,
      },
      {
        title: "AVG",
        id: "AVG",
        checked:
          windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabAvg === undefined ||
          windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)].tabAvg === false
            ? false
            : true,
      },
    ];
    setSummaryMenuItems(summaryMenu);
  }, [summaryData]);

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

  useEffect(() => {
    if (windowDefinition.tabs) {
      const tablevel = parseInt(tabData.tablevel);
      const tabId = tabData.ad_tab_id;
      const finalTabLevel = tablevel.toString();
      const lineTab = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)];
      if (Object.values(summaryData).length > 0) {
        let finalSummaryData = JSON.stringify(summaryData).replace(/"/g, '\\"');
        getTabSummary({
          windowId:windowId,
          tabId: lineTab.ad_tab_id,
          parentTabId: lineTab.parent_tab_id,
          parentRecordId: lineTab.recordId,
          filterData: finalFilterArray,
          summaryData: finalSummaryData,
        }).then((getTabSummaryResponse) => {
          setSummaryResponse(JSON.parse(getTabSummaryResponse));
        });
      } else {
        setSummaryResponse({});
      }
    }
  }, [summaryData, finalFilterArray]);

  const summary = () => {
    let arr = [];
    const userPreferences = JSON.parse(localStorage.getItem("userPreferences"));
    for (let index1 = 0; index1 < Object.values(summaryResponse).length; index1++) {
      for (let index2 = 0; index2 < Object.values(summaryResponse)[index1].length; index2++) {
        for (let index3 = 0; index3 < Object.values(Object.values(summaryResponse)[index1][index2]).length; index3++) {
          const fixedValue = parseInt(userPreferences.decimalPlaces);
          const numberValue = parseFloat(Object.values(Object.values(summaryResponse)[index1][index2])[index3]).toFixed(fixedValue);
          if (!isNaN(numberValue)) {
            Object.values(summaryResponse)[index1][index2][Object.keys(Object.values(summaryResponse)[index1][index2])[index3]] = numberValue;
          }
        }
      }
    }
    if (Object.keys(summaryResponse).length > 0) {
      for (let index1 = 0; index1 < Object.values(summaryResponse).length; index1++) {
        for (let index2 = 0; index2 < Object.values(summaryResponse)[index1].length; index2++) {
          Object.assign(Object.values(summaryResponse)[index1][index2], { key: Object.keys(summaryResponse)[index1] });
          arr.push(Object.values(summaryResponse)[index1][index2]);
        }
      }
    }
    let totalArr = [];
    if (tabData.enablenestedtab === "Y") {
      for (let index = 0; index < tabColumns.length + 2; index++) {
        totalArr[index] = 0;
      }
    } else {
      for (let index = 0; index < tabColumns.length + 1; index++) {
        totalArr[index] = 0;
      }
    }
    for (let index = 0; index < tabColumns.length; index++) {
      if (tabColumns[index].baseReferenceId === "22") {
        if (tabData.enablenestedtab === "Y") {
          totalArr[index + 2] = tabColumns[index].dataIndex.replace("_iden", "");
        } else {
          totalArr[index + 1] = tabColumns[index].dataIndex.replace("_iden", "");
        }
      }
    }
    if (tabData.enablenestedtab === "Y") {
      totalArr.splice(2, 1, "key");
    } else {
      totalArr.splice(1, 1, "key");
    }
    let finalArr = [];
    for (let index1 = 0; index1 < arr.length; index1++) {
      let tempArr = [];
      for (let index2 = 0; index2 < Object.keys(arr[index1]).length; index2++) {
        for (let index3 = 0; index3 < totalArr.length; index3++) {
          if (totalArr[index3] === Object.keys(arr[index1])[index2]) {
            tempArr[index3] = Object.values(arr[index1])[index2];
          }
        }
      }
      finalArr[index1] = tempArr;
    }
    for (let index1 = 0; index1 < finalArr.length; index1++) {
      for (let index2 = 0; index2 < finalArr[index1].length; index2++) {
        if (finalArr[index1][index2] === undefined) {
          finalArr[index1][index2] = "";
        }
      }
    }
    return (
      <Table.Summary fixed>
        {finalArr.map((data, index) => {
          return (
            <Table.Summary.Row key={index}>
              {data.map((summaryItem, index) => {
                return (
                  <Table.Summary.Cell key={index}>
                    <Text>{summaryItem}</Text>
                  </Table.Summary.Cell>
                );
              })}
            </Table.Summary.Row>
          );
        })}
      </Table.Summary>
    );
  };

  const components = {
    header: {
      cell: ResizableCell,
    },
  };

  const columns = tabColumns.map((col, index) => ({
    ...col,
    onHeaderCell: (columns) => ({
      width: columns.width,
      onResize: handleResize(index),
    }),
  }));

  const handleResize =
    (index) =>
    (e, { size }) => {
      setTabColumns((columns) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };
        return nextColumns;
      });
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

  const approxeq = (a, b, e) => {
    if (!e) {
      e = 2;
    }
    return Math.abs(a - b) < e;
  };

  let scrollLeft;
  const fetchMoreData = (event) => {
    const maxScroll = event.target.scrollHeight - event.target.clientHeight;
    const currentScroll = event.target.scrollTop;

    if (scrollLeft !== event.target.scrollLeft) {
      scrollLeft = event.target.scrollLeft;
      return null;
    }

    if (approxeq(Math.round(currentScroll), Math.round(maxScroll))) {
      setLoading(true);
      const recordOffset = tabRecords.length;
      getTabRecords({
        windowId:windowDefinition.ad_window_id,
        ad_tab_id: tabData.ad_tab_id,
        parentTabId: tabData.parent_tab_id,
        parentRecordID: recordId,
        startRow: `${recordOffset}`,
        endRow: `${tabData.pagelimit}`,
        filterData: finalFilterArray.length > 0 ? finalFilterArray : null,
        sortInfo: finalSorterArray.length !== 0 ? finalSorterArray : null,
      })
        .then((getTabRecordsResponse) => {
          if (getTabRecordsResponse.length > 0) {
            const newSourceRecords = tabRecords.concat(getTabRecordsResponse);
            setTabRecords([...newSourceRecords]);
          } else {
            message.info("No More Records !");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    const antTableBody = document.querySelector(".ant-table-body");
    if (treeViewFlag === false) {
      antTableBody?.addEventListener("scroll", fetchMoreData);
    }
    return () => antTableBody?.removeEventListener("scroll", fetchMoreData);
  }, [tabData, tabRecords]);

  const responsiveButtonIn = {
    xxl: 5,
    xl: 5,
    lg: 5,
    xs: 10,
    sm: 10,
    md:6,
  };
  const responsiveSpace={
    xxl:1,
    xl: 1,
    lg:1,
    xs:0,
    sm: 0,
    md:1,
  }

  const responsiveAddIcon = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 2,
    sm: 2,
    md: 0,
  };

  const reponsiveaddNeButton = {
    xxl:7,
    xl:7,
    lg:7,
    xs: 0,
    sm: 0,
    md: 6,
  };

  const responsiveButtonFor = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 0,
    sm: 0,
    md: 12,
  };

  const responsiveButtonMore = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 12,
    sm: 12,
    md: 0,
  };

  const resetFilters = () => {
    const tablevel = parseInt(tabData.tablevel);
    const tabId = tabData.ad_tab_id;
    const finalTabLevel = tablevel.toString();
    const windowDef = { ...windowDefinition };
    if (windowDef.tabs) {
      const headerTab = windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === finalTabLevel && tab.ad_tab_id === tabId)];
      headerTab.fields.sort((a, b) => {
        const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
        const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      for (let index1 = 0; index1 < headerTab.fields.length; index1++) {
        if (
          headerTab.fields[index1].nt_base_reference_id !== FieldReference.Button &&
          headerTab.fields[index1].isdisplayed === "Y" &&
          headerTab.fields[index1].isactive === "Y" &&
          headerTab.fields[index1].showinrelation === "Y"
        ) {
          headerTab.fields[index1].filters = null;
        }
      }
    }
    setWindowStore({ windowDefinition: windowDef });
    setFilterArray({});
  };

  const linesSearchBar = {
    paddingLeft:"1em",
    paddingBottom: "0px",
    icon: {
      cursor: "pointer",
      paddingRight:"4px",
      paddingBottom:"2px",
      color: "#464646",
      opacity: "75%",
      fontSize:"1em"
}
}


  const importLinesData = () => {
    const { recordId } = tabData;
    setImportPopupVisible(true);
  };

  const moreLinesActions = (
    <Col {...responsiveButtonFor}>
      <div className="flex-spread">
        <Dropdown trigger={["click"]} overlay={summaryMenu} onVisibleChange={handleSummaryVisibleChange} visible={summaryVisible}>
          <Button color="primary" style={Themes.contentWindow.ListWindowHeader.linesActionButtons}>
            <img style={{ paddingBottom: "6px", paddingRight: "1px", width: "12px" }} src={Summary} alt="invoice" />
          </Button>
        </Dropdown>
        &nbsp;
        <Button color="primary" style={Themes.contentWindow.ListWindowHeader.linesActionButtons} onClick={resetFilters}>
          <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "20px" }} src={Reset} alt="invoice" />
        </Button>
        &nbsp;
        <Dropdown trigger={["click"]} overlay={menu} onVisibleChange={handleVisibleChange} visible={visible}>
          <Button color="primary" style={Themes.contentWindow.ListWindowHeader.linesActionButtons}>
            <img style={{ paddingBottom: "6px", paddingRight: "1px", width: "16px" }} src={ShowAndHide} alt="invoice" />
          </Button>
        </Dropdown>
        &nbsp;
        <Button color="primary" style={Themes.contentWindow.ListWindowHeader.linesActionButtons}>
          <img style={{ paddingBottom: "6px", paddingRight: "6px", width: "22px" }} src={Repeat} alt="invoice" />
        </Button>
      </div>
    </Col>
  );

  return (
    <Fragment>
      <Row style={{height:"5vh"}}>
        <Col {...responsiveButtonIn}  style={linesSearchBar}>
          <Input
            placeholder="Search"
            value={searchInput}
            onChange={getSearchData}
            style={{ width: "95%", border: "1px solid #D1D1D1",marginTop:'7px',height:"4vh",paddingTop:"5px",paddingBottom:"5px",borderRadius:"5px" }}
            prefix={<>
              <i className="fa fa-search" role="presentation" aria-hidden="true" style={linesSearchBar.icon} />
              {/* <span style={{fontFamily:"Roboto",color:"#868B8F",paddingTop:'3px'}}>&nbsp;Search</span> */}
              </>}
          />
        </Col>
        <Col {...responsiveAddIcon}  style={{textAlign:'left',marginTop:'14px',right:5,top:"2px"}}>
          <img
            onClick={() => {
              addOrEditRecord("NEW_RECORD", tabData.name);
            }}
            style={{ marginTop: "4px",textAlign:'left'}}
            src={AddnewIcon}
            alt="invoice"
          />
        </Col>
        <Col {...reponsiveaddNeButton} style={{textAlign:'left',right:5}}>
        {tabData.addrecord === "Y"  && checkConditionalLogic(tabData.addrecord_displaylogic) ? (
          <Button
            style={{
              backgroundColor: '#FFFFFF',
              border: "0px solid rgb(83, 108, 120)",
              borderRadius: '0px',
              boxShadow: '0 0 0 0px',
              color: 'rgb(83, 108, 120)',
              cursor: 'pointer',
              fontFamily: 'Open Sans',
              fontSize: '12px',
              fontWeight: '600',
              padding: "8px",
              top: '2px',
              // display:tabData.addrecord === "Y" && checkConditionalLogic(tabData.addrecord_displaylogic) ? "block" :"none"
            }}
            onClick={() => {
              if (tabData.tab_view_type === "Form") {
                addRecordInTable();
              } else {
                addOrEditRecord("NEW_RECORD", tabData.name);
              }
            }}
          >
            <img style={{ cursor: "pointer", textAlign: 'left' }} src={AddnewIcon} preview={false} />
            {/* {tabData.addlinename ? `+ ${tabData.addlinename}` : "+Add New"} */}
          </Button>
         ) : null}
        </Col>
        {/* <Col {...responsiveSpace}/> */}
        <Col {...responsiveButtonFor} style={{ textAlign: "right" }}>
          {tabData.enabletreeview === "Y" ? (
            <Button
              color="primary"
              style={Themes.contentWindow.ListWindowHeader.linesActionButtons}
              onClick={() => {
                setTreeViewFlag(!treeViewFlag);
              }}
            >
              <img style={{ paddingBottom: "6px", paddingRight: "1px" }} src={TreeView} alt="invoice" />
            </Button>
          ) : (
            ""
          )}
          <div className="flex-spread">
            <Dropdown trigger={["click"]} overlay={summaryMenu} onVisibleChange={handleSummaryVisibleChange} visible={summaryVisible}>
             <Tooltip title="Summary" placement="top"  onMouseEnter={() => handleIconHover('summary')} onMouseLeave={handleIconLeave}>
                    <img style={{ paddingTop: "", marginRight: '', cursor: 'pointer' }} src={hoveredIcon === "summary"?Summary2:Summary} alt="invoice" />
                </Tooltip>
            </Dropdown>
            &nbsp;&nbsp;
            <Tooltip placement="top" title="Reset"  onMouseEnter={() => handleIconHover('clear')} onMouseLeave={handleIconLeave}>
                    <img style={{ paddingTop: "", marginRight: '', cursor: 'pointer' }} onClick={resetFilters} src={hoveredIcon === "clear"?filterHover:filterDefault} alt="invoice" />
            </Tooltip>
            &nbsp;&nbsp;
            <Dropdown trigger={["click"]} overlay={menu} onVisibleChange={handleVisibleChange} visible={visible}>
              <Tooltip title="Show/Hide Columns" placement="top" onMouseEnter={() => handleIconHover('column')} onMouseLeave={handleIconLeave}>
              {/* <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}> */}
                  <img style={{ paddingTop: "", marginRight: '', cursor: 'pointer' }} onClick={resetFilters} src={hoveredIcon === "column"?ColumnHover:ColumnDefault} alt="invoice" />
                {/* </Button> */}
              </Tooltip>
            </Dropdown>
            &nbsp;&nbsp;
            <Tooltip placement="top" title="Refresh" onMouseEnter={() => handleIconHover('reset')} onMouseLeave={handleIconLeave}>
            {/* <Button onClick={() => setTabLastRefreshed(new Date())} className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}> */}
               <img onClick={() => setTabLastRefreshed(new Date())}  style={{ paddingTop: "", marginRight: '', cursor: 'pointer' }} onClick={resetFilters} src={hoveredIcon === "reset"?Reset2:Reset} alt="invoice" />
              {/* </Button> */}
            </Tooltip>
            &nbsp;
            {tabData.tabenabledforimport === "Y" ? (
              <Tooltip title="Import" placement="top"  onMouseEnter={() => handleIconHover('import')} onMouseLeave={handleIconLeave}>
                 {/* <Button className="listHeaderButtons" color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}> */}
                  <img style={{  }} src={hoveredIcon === "import"?ImportHover:ImportDefault} alt="invoice" onClick={importLinesData} />
                {/* </Button> */}
              </Tooltip>
            ) : (
              ""
            )} &nbsp;
            {selectedRowKeys.length >1 ? (
              <Tooltip className="listHeaderButtons" title="Trash" placement="top"  onMouseEnter={() => handleIconHover('delete')} onMouseLeave={handleIconLeave}>
              <img onClick={()=>{setDeleteModal(true)}} style={{ paddingTop: "", marginRight: '', cursor: 'pointer' }} src={hoveredIcon === "delete"?DeleteHover:Delete} alt="invoice"  />          
             </Tooltip>
            ):null}  &nbsp;
          </div>
        </Col>
        <Col {...responsiveButtonMore} style={{ textAlign: "right" }}>
          <Dropdown trigger={["click"]} overlay={moreLinesActions}>
            <Button color="primary" style={Themes.contentWindow.ListWindowHeader.linesActionButtons}>
              <img style={{ paddingBottom: "0px", paddingRight: "5px", width: "25px" }} src={ListMore} alt="invoice" />
            </Button>
          </Dropdown>
        </Col>
      </Row>
      <div style={{ marginTop: "10px" }}>
        <FormTable
          dragProps={dragProps}
          loading={loading}
          setLoading={setLoading}
          rowSelection={rowSelection}
          tabRecordsData={tabRecords}
          columns={columns}
          components={components}
          setSelectedRowKeys={setSelectedRowKeys}
          selectRecord={selectRecord}
          tabData={tabData}
          expandedRowRender={expandedRowRender}
          handleExpand={handleExpand}
          onChange={onChange}
          handleTableChange={handleTableChange}
          summary={summary}
          headerRecordData={headerRecordData}
          parentTabRecordData={parentTabRecordData}
          setTabLastRefreshed={setTabLastRefreshed}
          toggleNewRecordEdit={toggleNewRecordEdit}
          editRecord={editRecord}
          deleteTabRecordValue={deleteTabRecordValue}
          setSearchInput={setSearchInput}
        />
      </div>
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        getContainer={false}
        width={modalWidth}
        style={{padding:0}}
        bodyStyle={{padding:0}}
        centered
        destroyOnClose={true}
        closable={false}
        maskClosable={false}
        maskStyle={{backgroundColor:"#000000",opacity:0.5}}
        footer={[
          isEditRecordActive ? 
          <Button key="save" type="primary"  style={{ backgroundColor:Themes.appTheme.primaryColor, color: "white", width: "88px", height: "36px",marginLeft:'31px',fontWeight:700,borderRadius:'4px'}} disabled={loadingModal} onClick={() => handleSave("save")}>
            Save
          </Button>
          :<Button key="save"  style={{ border: "2px solid #f0f0eb",fontFamily:"Roboto",fontWeight:600,cursor:"pointer"}} disabled={loadingModal} onClick={() => handleSave("save")}>
            Save
           </Button>,
          tabRecords.findIndex((r) => r.recordId === activeRecordId) > 0 ? (
            <div key="save-next" type="primary" disabled={loadingModal} loading={false} onClick={() => handleSave("savePrev")} style={{position:'absolute',top:'50%',zIndex:10,left:'-55px',width:'40px',cursor:'pointer',textAlign:'center'}} >
              <img src={NewPrevious} style={{width:'40px',height:"40px"}} />
            </div>
          ) : null,
          isEditRecordActive ? 
          <div key="save-next" type="primary" disabled={loadingModal} loading={false} onClick={() => handleSave("saveNext")} style={{position:'absolute',top:'50%',zIndex:10,right:'-58px',width:'40px',cursor:'pointer',textAlign:'center'}}>
            <img src={NewNextIcon} style={{width:'40px',height:"40px"}} />
          </div>
           : 
          <Button
            key="save-next"
            type="primary"
            disabled={loadingModal}
            style={{ backgroundColor:Themes.appTheme.primaryColor, color: "white", width: "118px", height: "36px",marginLeft:'10px',fontWeight:700,borderRadius:'4px'}}
            loading={false}
            onClick={() => handleSave("saveNext")}
          >
          <>Save &amp; Next</>
          </Button>,
        ]}
        title={<>
          <h2 style={{fontWeight:'bold',fontStyle:'normal',float:'left',marginTop:"7px"}}>{tabData.addlinename? tabData.addlinename:"Add New"}</h2>
          <span style={{float:'right',marginTop:"7px"}}><CloseOutlined onClick={()=>{setIsModalVisible(false)}}/></span>
          
          </>}
        // title={tabData.addlinename ? tabData.addlinename : "Add New"}
      >
        <hr style={{marginTop:"2em",opacity:0.1,height:'1px'}}/>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 36,top:0 }} className="spinLoader" spin />} spinning={loadingModal}>
          <Scrollbars
            style={{
              height: "61vh",
            }}
            ref={scrollbarRef}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            thumbSize={90}
            renderView={renderView}
            // renderThumbHorizontal={renderThumb}
            renderThumbVertical={renderThumb}
          >
            <RecordForm
              form={form}
              idName="lineTab"
              onFinish={onFinish}
              headerTab={headerTab}
              headerRecord={headerRecord}
              headerFieldGroups={headerFieldGroups}
              recordId={"NEW_RECORD"}
              jsonParam={jsonParam}
              parentId={recordId}
              clearFields={clearFields}
            />
          </Scrollbars>
        </Spin>
      </Modal>

      <Modal
        width={"1000px"}
        visible={importPopupVisible}
        onCancel={() => {
          setImportPopupVisible(false);
        }}
        footer={null}
      >
        <ImportComponent importData={{ headerId: tabData.recordId, importId: tabData.ad_tab_id, importFlag: true, windowName: windowDefinition.name }} />
      </Modal>
      <Modal
          title={<>
            <center style={{fontWeight:'bold',width:'40%px',fontStyle:'normal'}}>Confirm Delete</center>
            {/* <span style={{float:'right',marginTop:"-25px"}}><CloseOutlined onClick={propsConfirmCancel}/></span> */}
            </>}
          visible={deleteModal}
          footer={[
            <span
             style={{color:Themes.appTheme.primaryColor,fontWeight:700,cursor:'pointer'}}
              onClick={propsConfirmCancel}
            >
              Cancel
            </span>,
            <Button style={{ backgroundColor: Themes.appTheme.primaryColor, color: "white", width: "88px", height: "36px",marginLeft:'31px',fontWeight:700,borderRadius:'4px'}} onClick={deleteLines}>
              Confirm
            </Button>,
          ]}
          closable={false}
          centered
          style={{marginTop:"3%"}}
          width="350px"
        >
          <center>Do you want to delete selected records?</center>
            <br />
        </Modal>
    </Fragment>
  );
};

export default RecordTab;
