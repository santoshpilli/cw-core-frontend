import React, { useState, useEffect, Fragment } from "react";
import { Card, Row, Col, Button, Collapse, Form,Modal,Menu, Typography, Spin, message, notification, Dropdown, Tooltip } from "antd";
import { LoadingOutlined,CloseOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import { Link, useParams,useLocation } from "react-router-dom";
import { getTabData, upsertTabData, getWindowInitializationData } from "../../services/generic";
import { FieldReference } from "../../lib/fieldReference";
import RecordForm from "../window/RecordForm";
import RecordTitle from "./RecordTitle";
import ToggleIcon from "../../assets/images/toggleIcon.svg";
import StatusBar from "./StatusBar";
import AuditTrail from "../../assets/images/auditTrail.svg";
import ThemeJson from "../../constants/UIServer.json"
import Arrow from "../../assets/images/arrow.svg";
import Repeat from "../../assets/images/reloadIcon.svg";
import RepeatHover from "../../assets/images/reloadIconHover.svg";
import backIcon from "../../assets/images/backLeft.svg";
import audit from "../../assets/images/auditDefault.svg";
import auditHover from "../../assets/images/auditHover.svg";
import ListMore from "../../assets/images/listMoreIcon.svg";
import ExpandIcon from "../../assets/images/expandIcon.svg"
import Shrink from "../../assets/images/shrinkIcon.svg"
import Print from "./Print";
import EmailTemplate from "./EmailTemplate";
import FileAttachment from "./FileAttachment";
import dayjs from "dayjs";
import { useGlobalContext, useWindowContext } from "../../lib/storage";
import { formatDisplayField } from "../window/windowUtilities";
import "antd/dist/antd.css";

const { Panel } = Collapse;
const { Text } = Typography;

const headerOptionIcons = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#536C78",
  paddingBottom: "7px",
  paddingLeft: "0px",
  cursor: "pointer",
};

const labelValueDiv = {
  border: "0.5px solid transparent",
  borderRadius: "3px",
  width: "100%",
  // height: "32px",
  padding: "0px 11px 0px",
  // marginTop: "3px",
};

const customParseFormat = require("dayjs/plugin/customParseFormat");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

const RecordHeader = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const { lastRefreshed, setLastRefreshed, setHeaderRecordData,isHeaderActive,headerRecordData, setIsHeaderActive, setLoadingRecordWindow } = props;
  const { recordId } = useParams();
  const { pathname } = useLocation();
  const [headerTab, setHeaderTab] = useState({ fields: [] });
  const [headerTabId, setHeaderTabId] = useState("");
  const [headerRecord, setHeaderRecord] = useState({});
  const [headerFieldGroups, setHeaderFieldGroups] = useState({});
  const [headerReferenceList, setHeaderReferenceList] = useState([]);
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [mobMenu,setMobMenu] = useState(false)
  const [recordTitles, setRecordTitles] = useState([]);
  const [statusBar, setStatusBar] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isActive,setIsActive] = useState(false)
  const [loading, setLoading] = useState(false);
  const [displayAuditInfo, setDisplayAuditInfo] = useState(false);
  const [auditData, setAuditData] = useState({});
  const [autoCompleteHiddenData,setAutoCompleteHiddenData] = useState([])
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleIconHover = (iconName) => {
    setHoveredIcon(iconName);
  };

  const handleIconLeave = () => {
    setHoveredIcon(null);
  };

  const history = useHistory();

  const { windowStore, setWindowStore } = useWindowContext();
  const windowDefinition = { ...windowStore.windowDefinition };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (isMounted) {
        setLoading(true);
        try {
          if (windowDefinition.tabs) {
            const headerTabData = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === "0")];
            const headerTabId = headerTabData.ad_tab_id;
            headerTabData.fields.sort((a, b) => {
              const x = a.seqno !== null ? parseInt(a.seqno) : a.seqno;
              const y = b.seqno !== null ? parseInt(b.seqno) : b.seqno;
              return (x != null ? x : Infinity) - (y != null ? y : Infinity);
            });
            setHeaderTab(headerTabData);
            setHeaderTabId(headerTabId);

            let headerRecordData;
            if (recordId !== "NEW_RECORD") {
              const getTabDataResponse = await getTabData({ windowId:windowDefinition.ad_window_id,ad_tab_id: headerTabData.ad_tab_id, recordId: recordId, startRow: "0", endRow: "1" });
              headerRecordData = getTabDataResponse[0];
            } else {
              setIsEditMode(true);
              headerRecordData = await getWindowInitializationData(windowDefinition.ad_window_id,headerTabData.ad_tab_id);
            }
            setHeaderRecord(headerRecordData);
            setHeaderRecordData({ ...headerRecordData });
            setWindowStore({ windowHeaderTabRecords: headerRecordData });

            const recordTitle = headerTabData.record_identifier.split(",");
            const recordTitlesData = [];
            recordTitle.forEach((element) => {
              const headerFieldIndex = headerTabData.fields.findIndex((field) => field.ad_field_id === element);
              const recordIdentifierField = headerTabData.fields[headerFieldIndex];
              let titleNameValue = headerRecordData[element.concat("_iden")];
              if (titleNameValue === null || titleNameValue === undefined) {
                titleNameValue = headerRecordData[element];
              }
              titleNameValue = formatDisplayField(titleNameValue, recordIdentifierField);
              recordTitlesData.push({
                titleName: titleNameValue,
                titleTip: titleNameValue,
              });
            });
            setRecordTitles([...recordTitlesData]);

            const statusBarValues = [];
            const referenceList = [];
            const fieldGroupsList = {};
            const auditDataValues = {};
            headerTabData.fields.forEach((element) => {
              if (element["nt_base_reference_id"] === FieldReference.List) {
                const list = element.Values;
                if (list !== undefined || list !== null) {
                  Object.keys(list).forEach((key) => {
                    referenceList.push(list[key]);
                  });
                }
              }

              if (element.isshowninstatusbar === "Y" && element.isdisplayed === "Y" && element.isactive === "Y") {
                let titleDataValue = headerRecordData[element.ad_field_id.concat("_iden")];
                if (titleDataValue === null || titleDataValue === undefined) {
                  titleDataValue = headerRecordData[element.ad_field_id];
                  const refIndex = referenceList.findIndex((list) => list.key === titleDataValue);
                  if (refIndex >= 0) {
                    titleDataValue = referenceList[refIndex].value;
                  }
                }
                if (titleDataValue === "Y") {
                  titleDataValue = "Yes";
                }
                if (titleDataValue === "N") {
                  titleDataValue = "No";
                }
                statusBarValues.push({
                  titleName: element.name,
                  amountId:element.nt_base_reference_id,
                  titleValue: titleDataValue,
                  ad_field_id:element.ad_field_id

                });
              }

              if (element.fieldgroup_name !== undefined && element.nt_base_reference_id !== "28") {
                fieldGroupsList[element.fieldgroup_name] = fieldGroupsList[element.fieldgroup_name] || [];
                fieldGroupsList[element.fieldgroup_name].push(element);
              }

              if (element.column_name?.toLowerCase() === "updatedby") {
                auditDataValues.updatedby = headerRecordData[element.ad_field_id.concat("_iden")];
              }
              if (element.column_name?.toLowerCase() === "createdby") {
                auditDataValues.createdby = headerRecordData[element.ad_field_id.concat("_iden")];
              }
              if (element.column_name?.toLowerCase() === "created") {
                auditDataValues.created = dayjs(headerRecordData[element.ad_field_id], "YYYY-MM-DD HH:mm:ss").fromNow();
              }
              if (element.column_name?.toLowerCase() === "updated") {
                auditDataValues.updated = dayjs(headerRecordData[element.ad_field_id], "YYYY-MM-DD HH:mm:ss").fromNow();
              }
            });
            setStatusBar([...statusBarValues]);
            setHeaderFieldGroups(fieldGroupsList);
            setHeaderReferenceList([...referenceList]);
            setAuditData({ ...auditDataValues });
          }
        } catch (error) {
          console.error("Error", error);
        } finally {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [recordId, lastRefreshed]);

  useEffect(() => {
    if(autoCompleteHiddenData.length > 0){
    for (let index1 = 0; index1 < statusBar.length; index1++) {
      const element1 = statusBar[index1].ad_field_id;
      for (let index = 0; index < autoCompleteHiddenData.length; index++) {
        const element2 = autoCompleteHiddenData[index].dataKey;
        if(element1 === element2){
          statusBar[index1].titleValue = autoCompleteHiddenData[index].dataValName  === "Y" ? "Yes" : autoCompleteHiddenData[index].dataValName === "N" ? "NO" : autoCompleteHiddenData[index].dataValName
          statusBar[index1].recordValue = autoCompleteHiddenData[index].dataValKey

        }
      }
      setStatusBar([...statusBar]);
    }
  }}    
  , [autoCompleteHiddenData]);

  const updateLastRefresh = () => {
    setLastRefreshed(new Date());
  };

  const getRecordValue = (field) => {
    let recordValueField = headerRecord[field.ad_field_id.concat("_iden")] ? headerRecord[field.ad_field_id.concat("_iden")] : headerRecord[field.ad_field_id];
    const refIndex = headerReferenceList.findIndex((list) => list.key === recordValueField);
    if (refIndex >= 0) {
      recordValueField = headerReferenceList[refIndex].value;
    }
    // if (typeof recordValueField === "string") {
    //   if (recordValueField.trim() === "Y") {
    //     recordValueField = "Yes";
    //   }
    //   if (recordValueField.trim() === "N") {
    //     recordValueField = "No";
    //   }
    // }
    return formatDisplayField(recordValueField, field, "header");
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    const pathSegments = pathname.split('/');
    const segmentAfterHost = pathSegments[1];
    if (isEditMode && recordId !== "NEW_RECORD") {
      setIsEditMode(false);
    }
    else {
      if(segmentAfterHost === 'popupWindow'){
          window.self.close();
        }
     else{
      history.push(`/window/list/${windowDefinition.ad_window_id}`);
     }
    }
  };

  const onFinish = (values) => {
    setLoading(true);
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

    if (recordId === "NEW_RECORD") {
      Object.entries(values).map(([ValuesKey, valuesValue]) => {
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

    const formValues = values
    
    const matchedData = [];
    autoCompleteHiddenData.forEach((obj) => {
        const value = formValues[obj.dataKey];
        if (value !== undefined) {
          matchedData.push({ dataKey: obj.dataKey, dataValKey: value });
        }else{
          const dynamicKey = obj.dataKey;
          formValues[dynamicKey] = obj.dataValKey
        }
      });

      statusBar.forEach((obj)=>{
        if(obj.recordValue){
          Object.entries(formValues).forEach(([key, value]) => {
          if(obj.ad_field_id === key){
            formValues[key] = obj.recordValue 
          }
          });
        }
      })

    const stringifiedFields = JSON.stringify(values);
    const updatedStrings = stringifiedFields.replace(/\\"/g, '\\"');
    const stringRequest = JSON.stringify(updatedStrings);

    upsertTabData(windowDefinition.ad_window_id,headerTab.ad_tab_id, recordId, stringRequest)
      .then((upsertResponse) => {
        if (upsertResponse.data.data.upsertTab.status === "200") {
          message.success(`${upsertResponse.data.data.upsertTab.message}`);
          setIsEditMode(false);
          if (recordId === "NEW_RECORD") {
            const currentRecord = upsertResponse.data.data.upsertTab.recordId;
            const currentLocation = history.location.pathname;
            const windowType = currentLocation.search("popupWindow") >= 0 ? "popupWindow" : "window";
            history.push(`/${windowType}/${windowDefinition.ad_window_id}/${currentRecord}`);
          } else {
            setLastRefreshed(new Date());
          }
        } else {
          console.error(JSON.stringify(upsertResponse, null, 2));
          // message.error("An Error Occured !");
          // form.setFieldsValue(originalFormValues);
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
        // message.error("An Error Occured !");
        // form.setFieldsValue(originalFormValues);
        /* notification.error({
          message: upsertResponse.data.data.upsertTab.messageCode,
          description: upsertResponse.data.data.upsertTab.message,
        }); */
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setIsHeaderActive(isEditMode);
  }, [isEditMode]);

  const showPopupWindow = (field) => {
    window.open(`/popupWindow/${field.new_record_window}/${headerRecord[field.ad_field_id]}`, "Record Window", "width=1200,height=600,left=210,top=120");
  };

  const navigateToListWindow = () => {
    window.self.close();
    history.push(`/window/list/${windowDefinition.ad_window_id}`);
  };

  const [collapseAllGroups, setCollapseAllGroups] = useState(false);

  const [form] = Form.useForm();

  const listActionButtons = {
    height: "28px",
    width: "28px",
    background: "#fff",
    border: "0.5px solid #d9d9d9",
    cursor: "pointer",
    marginRight: "5px ",
    // display:"flex",
    borderRadius:"3px",
    justifyContent:"center",
    alignItems:"center",
    description: "list icon buttons on the right hand side"
  }

  const responsiveDesignForAuditTrial = {
    xxl: 12,
    xl: 8,
    lg: 5,
    xs: 20,
    sm: 16,
    md: 14,
  };

  const responsiveDesignRecordTitle = {
    xxl: 12,
    xl: 16,
    lg: 19,
    xs: 0,
    sm:0,
    md: 0,
  };

  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 0,
    sm: 0,
    md: 0,
  };

  const responsiveDesignTitle = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 12,
    sm: 12,
    md: 12,
  };

  const responsiveTrial = {
    xxl: 14,
    xl: 14,
    lg: 14,
    xs: 8,
    sm: 8,
    md: 10,
  };

  const responsiveButtonIn = {
    xxl: 24,
    xl: 24,
    lg: 24,
    xs: 12,
    sm: 16,
    md: 18,
  };

  const responsiveButtonFor = {
    xxl: 24,
    xl: 24,
    lg: 24,
    xs: 0,
    sm: 0,
    md: 24,
  };

  const responsiveButtonHeader = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 24,
    sm: 24,
    md: 0,
  };
  const responsiveIcons = {
    xxl: 0,
    xl: 0,
    lg: 12,
    xs: 12,
    sm: 12,
    md: 12,
  };

  const responsiveEditAdd = {
    xxl: 0,
    xl: 0,
    lg: 12,
    xs: 12,
    sm: 12,
    md: 12,
  };

  const responsiveButtonMobileIn = {
    xxl: 0,
    xl: 0,
    lg: 12,
    xs: 12,
    sm: 12,
    md: 12,
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
  const innerWidth1 = windowSize.innerWidth
  let subMenuItem = JSON.parse(localStorage.getItem("subMenuItem"))
  let subMenuData =JSON.parse(localStorage.getItem("subMenuData"))
  // const innerWidth = window.innerWidth;

  const innerWidth = window.innerWidth;

  const moreHeaderActions = (
    <Col {...responsiveButtonFor}>
      <div className="flex-spread">
        {windowDefinition.enableprint === "Y" ? <Print setLoadingRecordWindow={"setLoadingForPrint"} {...props} headerTabId={headerTabId} /> : null}
        {windowDefinition.enableprint === "Y" ? <EmailTemplate headerTabId={headerTabId} /> : null}
        <Tooltip placement="bottom" title="Repeat">
          <Button style={Themes.contentWindow.ListWindowHeader.headerActionButtons} onClick={updateLastRefresh}>
            <img style={{ paddingBottom: "3px", paddingRight: "2px", width: "18px" }} src={Repeat} alt="invoice" />
          </Button>
        </Tooltip>

        {windowDefinition.enableattachment === "Y" || headerTab.tabenabledforimport === "Y" ? <FileAttachment style={{ marginRight: "0px" }} headerTabId={headerTabId} /> : ""}
      </div>
    </Col>
  );

  let recordTitleDataCheck = []
  for (let index = 0; index < recordTitles.length; index+=1) {
    if(recordTitles[index].titleName !== undefined){
      recordTitleDataCheck.push(recordTitles[index])
    }
  }

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

  return (
    <Fragment>
      {innerWidth1 > 1004 ? null :
      <>
      <Row  style={{height:innerWidth > 1004 ?"":"40px"}}>
          <Col {...responsiveButtonMobileIn}>
          <img src={ToggleIcon} style={{cursor:'pointer',paddingBottom:'2px'}} onClick={onTogMenu} alt=''/>&nbsp;&nbsp;&nbsp;
           
          {subMenuData.map((subMenu) => {
             if(subMenuItem===subMenu.key){
              return(
                <span style={{ fontFamily: "Inter", opacity: 0.5 }}>{subMenu.title}</span>
              )
             }
           })}
           
          
          </Col>
          <Col {...responsiveIcons}>
          <div className="flex-spread1">
              {windowDefinition.enableprint === "Y" ? <Print setLoadingRecordWindow={setLoadingRecordWindow} headerTabId={headerTabId} {...props} /> : null}
                {windowDefinition.enableprint === "Y" ? <EmailTemplate headerTabId={headerTabId} /> : null}
                <Tooltip placement="bottom" title="Repeat">
                    <img onClick={updateLastRefresh} style={{ marginLeft:"17px",marginRight:'7px',cursor:"pointer"}} src={Repeat} alt="invoice" />
                </Tooltip>
                {windowDefinition.enableattachment === "Y" || headerTab.tabenabledforimport === "Y" ? (
                  <FileAttachment style={{  }} headerTabId={headerTabId} />
                ) : (
                  ""
                )}
              </div>
          </Col>
        </Row>
        <Row>
        <Col {...responsiveEditAdd}>
        {windowDefinition.enableedit === "Y" && !isEditMode ? (
               <span>
               <Button style={{fontFamily:"Inter",fontWeight:"700",width:"70px",border:'0.1px solid rgba(217, 217, 229,1)',color:"#0C173A",borderRadius:"4px",fontSize:"0.8125rem",height:"30px"}} onClick={handleCancel}>
                 Close
               </Button>
                <Button  disabled={headerTab.editrecord === "Y" && checkConditionalLogic(headerTab.editrecord_displaylogic)?false:true} style={{fontFamily:"Inter",fontWeight:"700",width:"70px",border: '1px solid #B5C3F0',color:"#0C173A",marginLeft:"4px",marginRight:"5px",background:"#B5C3F0",height:"30px",borderRadius:"4px",fontSize:"0.8125rem"}} onClick={handleEdit}>
                 Edit
               </Button>
             </span>
            ) : (
              ""
            )}
            {isEditMode ? (
              <span>
                <Button
                  onClick={() => {
                    form
                      .validateFields()
                      .then(() => {
                        form.submit();
                      })
                      .catch((error) => {
                        setCollapseAllGroups(true);
                        console.error(JSON.stringify(error, null, 2));
                      });
                  }}
                  style={{fontFamily:"Roboto",fontWeight:"700",width:"auto",border:"0.001px solid #DDDBDA",color:"#0C173A",borderRadius:"4px",marginLeft:"4px"}}
                >
                  Save
                </Button>
                <Button style={{fontFamily:"Roboto",fontWeight:"700",width:"auto",border:"0.001px solid #DDDBDA",color:"#0C173A",borderRadius:"4px",marginLeft:"4px"}} onClick={handleCancel}>
                  Cancel
                </Button>
              </span>
            ) : (
              ""
            )}
            </Col>
            <Col {...responsiveEditAdd}>
            <RecordTitle lastRefreshed={lastRefreshed} setLastRefreshed={setLastRefreshed} headerRecordData={headerRecordData} isHeaderActive={isHeaderActive} {...props} />
        </Col>
      </Row>
      </>}
      <Row>
        {/* <Col {...responsiveDesignForColumn}>
          <Button type="link" onClick={navigateToListWindow} style={{color:Themes.appTheme.primeryTextColor,opacity:0.5,fontFamily:"Inter",fontWeight:600,fontStyle:"normal",paddingLeft:'10px',cursor:'pointer'}}>
            <span  style={{width:"62px",cursor:"pointer"}}>{windowDefinition.name}</span>
          </Button>
        </Col> */}
        {/* <Col {...responsiveDesignTitle} style={{ marginTop: "0px",marginLeft:"-13px" }}>
          <Button type="link" onClick={navigateToListWindow} style={{color:Themes.appTheme.primeryTextColor,opacity:0.5,fontFamily:"Inter",fontWeight:600,fontStyle:"normal",paddingLeft:'10px'}}>
            {windowDefinition.name}
          </Button>
        </Col> */}
      </Row>
      <Row style={{ width: "100%",marginTop:"0px",marginBottom:"-2px"}}>
        <Col
          {...responsiveDesignForAuditTrial}
          style={{ marginLeft: `${innerWidth > 1200 ? "0px" : "-13px"}`, marginTop: `${recordTitles.length > 0 && recordTitles[0].titleName ? "-12px" : "-12px"}` }}
        >
           <span>
          <img onClick={handleCancel}  style={{
              display: "inline-block",
              marginTop:"17px",
              position: "absolute",
              marginLeft:"0.8em",
              cursor:"pointer",
              top: `${innerWidth < 375 ? "4px" : "5px"}`,
            }} src={backIcon} alt="AuditTrail" />
          </span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span style={{ display: "inline-block",marginTop:"15px"}} className="formRecordTitle" >
            <span style={{color:Themes.appTheme.primeryTextColor}} className="auditTrialText">
              {recordTitleDataCheck.map((record, index) => (
                <span>&ensp;{record.titleName}</span>
              ))}
            </span>
          </span>
          {/* <span
            style={recordTitleDataCheck.length === 0 ?{
              display: "inline-block",
              marginTop:"15px",
              top: `${innerWidth < 375 ? "4px" : "5px"}`,
            }:{
              display: "inline-block",
              marginTop:"15px",
              position: "absolute",
              top: `${innerWidth < 375 ? "4px" : "5px"}`,
            }}
          >
            {windowDefinition.enableauditlog === "Y" ? <img onClick={() => setDisplayAuditInfo((a) => !a)} style={headerOptionIcons} src={AuditTrail} alt="AuditTrail" /> : null}
          </span> */}
        </Col>
        {innerWidth1 > 1004 ?
        <Col
          {...responsiveDesignRecordTitle}
          style={{
            float: "right",
             // marginTop: "-4px",
             marginLeft: `${innerWidth > 1200 ? "0px" : "9px"}`,
             paddingRight:"1.5em"
          }}
        >
          <Row>
            <Col {...responsiveButtonFor}>
              <div className="flex-spread1">
                <span style={{marginTop:'0.15rem'}}>
                {windowDefinition.enableauditlog === "Y" ?
                <Tooltip placement="top" title="Audit Log" onMouseEnter={() => handleIconHover('audit')} onMouseLeave={handleIconLeave}>
                 <img  onClick={() => setDisplayAuditInfo((a) => !a)} style={{cursor:"pointer"}} src={hoveredIcon === "audit"?auditHover:audit} alt="AuditTrail" /> &nbsp;
                 </Tooltip>: null} 
              {windowDefinition.enableprint === "Y" ? <Print setLoadingRecordWindow={setLoadingRecordWindow} headerTabId={headerTabId} {...props} /> : null}
                {windowDefinition.enableprint === "Y" ? <EmailTemplate headerTabId={headerTabId} /> : null}
                <Tooltip placement="top" title="Reload" onMouseEnter={() => handleIconHover('reload')} onMouseLeave={handleIconLeave}>
                  <img onClick={updateLastRefresh} style={{ cursor:"pointer"}} src={hoveredIcon === "reload"?RepeatHover:Repeat} alt="invoice" />{" "}&nbsp;
                </Tooltip>

                {windowDefinition.enableattachment === "Y" || headerTab.tabenabledforimport === "Y" ? (
                  <FileAttachment style={{  }} headerTabId={headerTabId} />
                ) : (
                  ""
                )}
                </span>
                {windowDefinition.enableedit === "Y" && !isEditMode ? (
                  <span>
                  <Button style={{fontFamily:"Inter",fontWeight:"700",width:"70px",border:'0.1px solid rgba(217, 217, 229,1)',color:"#0C173A",borderRadius:"4px",fontSize:"0.8125rem",height:"30px",marginLeft:"3px"}} onClick={handleCancel}>
                    Close
                  </Button>
                   <Button  disabled={headerTab.editrecord === "Y" && checkConditionalLogic(headerTab.editrecord_displaylogic)?false:true} style={{fontFamily:"Inter",fontWeight:"700",width:"70px",border: '1px solid #B5C3F0',color:"#0C173A",marginLeft:"4px",background:"#B5C3F0",height:"30px",borderRadius:"4px",fontSize:"0.8125rem",marginRight:"2px"}} onClick={handleEdit}>
                    Edit
                  </Button>
                </span>
                ) : (
                  ""
                )}
               {isEditMode ? (
                  <span>
                  
                    <Button style={{fontFamily:"Inter",fontWeight:"700",width:"70px",border:'0.1px solid rgba(217, 217, 229,1)',color:"#0C173A",borderRadius:"4px",fontSize:"0.8125rem",height:"30px",marginLeft:"3px"}} onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                    onClick={() => {
                      form
                        .validateFields()
                        .then(() => {
                          form.submit();
                        })
                        .catch((error) => {
                          setCollapseAllGroups(true);
                          console.error(JSON.stringify(error, null, 2));
                        });
                    }}
                    style={{fontFamily:"Inter",fontWeight:"700",width:"70px",border: '1px solid #B5C3F0',color:"#0C173A",marginLeft:"4px",marginRight:"2px",background:"#B5C3F0",height:"30px",borderRadius:"4px",fontSize:"0.8125rem"}}
                    id='step1'
                    >
                      Save
                    </Button>
                  </span>
                ) : (
                  ""
                )}
               <RecordTitle lastRefreshed={lastRefreshed} setLastRefreshed={setLastRefreshed} headerRecordData={headerRecordData} isHeaderActive={isHeaderActive} recordTitle1={recordTitles[0]?.titleName} {...props} />

              </div>
            </Col>
            <Col {...responsiveButtonHeader} style={{ textAlign: "right" }}>
              <Row style={{float:"right" }}>
              <RecordTitle lastRefreshed={lastRefreshed} setLastRefreshed={setLastRefreshed} headerRecordData={headerRecordData} isHeaderActive={isHeaderActive} recordTitle1={recordTitles[0]?.titleName} {...props} />
              </Row>
              <br/><br/>
              <Row  style={{float:"right",marginTop:"5px"}}>
              {windowDefinition.enableedit === "Y" && !isEditMode ? (
                <span>
                  <Button style={{fontFamily:"Roboto",fontWeight:"700",width:"80px",border:"0.001px solid #DDDBDA",color:"#0C173A",borderRadius:"4px",marginLeft:"4px"}} onClick={handleEdit}>
                    Edit
                  </Button>
                  <Button style={{fontFamily:"Roboto",fontWeight:"700",width:"80px",border:"0.001px solid #DDDBDA",color:"#0C173A",borderRadius:"4px"}} onClick={handleCancel}>
                    Close
                  </Button>
                </span>
              ) : (
                ""
              )}
              {isEditMode ? (
                <span>
                  <Button
                    onClick={() => {
                      form
                        .validateFields()
                        .then(() => {
                          form.submit();
                        })
                        .catch((error) => {
                          setCollapseAllGroups(true);
                          console.error(JSON.stringify(error, null, 2));
                        });
                    }}
                    style={{fontFamily:"Inter",fontWeight:"700",width:"70px",border: '1px solid #B5C3F0',color:"#0C173A",marginLeft:"4px",marginRight:"5px",background:"#B5C3F0",height:"30px",borderRadius:"4px",fontSize:"0.8125rem"}}
                  >
                    Save
                  </Button>
                  <Button style={{fontFamily:"Inter",fontWeight:"700",width:"70px",border:'0.1px solid rgba(217, 217, 229,1)',color:"#0C173A",borderRadius:"4px",fontSize:"0.8125rem",height:"30px"}} onClick={handleCancel}>
                    Cancel
                  </Button>
                </span>
              ) : (
                ""
              )}{" "}
              <span style={{marginLeft:"4px",marginRight:'4px'}}>
              <Dropdown
                trigger={["click"]}
                overlay={
                  <Col {...responsiveButtonFor}>
                    <div className="flex-spread">
                      {windowDefinition.enableprint === "Y" ? <Print setLoadingRecordWindow={setLoadingRecordWindow} {...props} headerTabId={headerTabId} /> : null}
                      {windowDefinition.enableprint === "Y" ? <EmailTemplate headerTabId={headerTabId} /> : null}
                      <Tooltip placement="bottom" title="Repeat">
                        <Button style={Themes.contentWindow.ListWindowHeader.headerActionButtons} onClick={updateLastRefresh}>
                          <img style={{ paddingBottom: "3px", paddingRight: "2px", width: "18px" }} src={Repeat} alt="invoice" />
                        </Button>
                      </Tooltip>

                      {windowDefinition.enableattachment === "Y" || headerTab.tabenabledforimport === "Y" ? (
                        <FileAttachment style={{ marginRight: "4px" }} headerTabId={headerTabId} />
                      ) : (
                        ""
                      )}
                    </div>
                  </Col>
                }
              >
                <Button
                  color="primary"
                  style={{
                    height: "31px",
                    width: "33px",
                    background: "#fff",
                    border: "0.5px solid #dddbda",
                    borderRadius: "5px",
                    cursor: "pointer",
                    paddingLeft: "5px",
                    paddingRight: "5px ",
                    marginRight: "0px ",
                  }}
                >
                  <img style={{ paddingBottom: "4px", width: "19px" }} src={ListMore} alt="invoice" />
                </Button>
              </Dropdown>
              </span>
              </Row>
            </Col>
          </Row>
        </Col>:null}
        {displayAuditInfo ? (
          <Col {...responsiveButtonIn}>
            <div style={{ marginTop: "-7px",marginLeft:"1.5em" }}>
              <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>
                Created By : <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}> {auditData?.createdby}</span> &emsp;
              </span>
              <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>
                Created On : <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}> {auditData?.created}</span> &emsp;
              </span>
              <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>
                Updated By : <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}> {auditData?.updatedby}</span> &emsp;
              </span>
              <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>
                Updated On : <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}> {auditData?.updated}</span> &emsp;
              </span>
            </div>
          </Col>
        ) : null}
      </Row>
      {/* </>:null} */}
      <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
        <Card style={Themes.contentWindow.recordWindow.RecordHeader.headerCard} bodyStyle={{ padding: "0px" }}>
          {(() => {
            if (statusBar.length > 0) {
              return <StatusBar statusBar={statusBar} />;
            }
          })()}
          <hr style={{opacity:0.1}}/>
          {isEditMode ? (
            <Fragment>
              <RecordForm
                form={form}
                idName="headerTab"
                onFinish={onFinish}
                headerTab={headerTab}
                headerRecord={headerRecord}
                headerFieldGroups={headerFieldGroups}
                recordId={recordId}
                isHeader={true}
                collapseAllGroups={collapseAllGroups}
                autoCompleteHiddenData = {autoCompleteHiddenData}
                setAutoCompleteHiddenData = {setAutoCompleteHiddenData}
              />
            </Fragment>
          ) : (
            <Fragment>
              <Row>
              <Col span={24} style={{paddingLeft:"20px",paddingRight:"20px",paddingTop:"3px",paddingBottom:"10px"}}>
                  <Row gutter={[10,10]}>
                    {headerTab.fields.map((field, index) =>
                      field.isdisplayed === "Y" &&
                      field.fieldgroup_name === undefined &&
                      field.isshowninstatusbar !== "Y" &&
                      field.nt_base_reference_id !== "28" &&
                      field.column_type !== "Button" ? (
                        <Col
                          key={`${index}-${headerRecord[field.ad_field_id]}`}
                          span={field.nt_base_reference_id === FieldReference.WYSIWYGEditor || innerWidth < 600 ? 24 : innerWidth > 600 && innerWidth < 800 ? 12 : 8}
                          style={{ paddingLeft: 12, paddingRight: 12 }}
                        >
                          <Text style={{paddingTop:"-2px"}}>
                            <span style={{ visibility: "hidden" }}>*</span> <span style={{ verticalAlign: "text-bottom", paddingLeft: 1,fontFamily:"Inter",opacity:0.6,color:"#000000",fontWeight:500 }}>{field.name}</span>
                          </Text>{" "}
                          {/* <br /> */}
                          <div style={labelValueDiv}>
                            <Text>
                              {field.new_record_window ? (
                                <span style={{ color: "#0C173A" }}>
                                  {getRecordValue(field) ? (
                                    <span style={{ cursor: "pointer",fontWeight:"550" }} onClick={() => showPopupWindow(field)}>
                                      {getRecordValue(field)}&nbsp; <img src={Arrow} style={{ paddingBottom: "5px" }} alt="Arrow" />
                                    </span>
                                  ) : null}
                                </span>
                              ) : (
                                <span style={{fontFamily:'Inter',fontWeight:550}}>
                                {getRecordValue(field)}
                                </span>
                              )}
                            </Text>
                          </div>
                        </Col>
                      ) : (
                        ""
                      )
                    )}
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Collapse
                  //  style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.collapsePanel}
                  expandIcon={({isActive})=>isActive?<img src={Shrink}/>:<img src={ExpandIcon}/>}>
                    
                    {Object.entries(headerFieldGroups).map(([key, value], i) => (
                      <Panel style={{background:"#fff"}} header={
                        <span style={{fontFamily:"Inter",color:"#000000",fontWeight:400}}>{key}</span>
                      }
                       key={key}>
                        <Row>
                          <Col span={24} style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                            <Row gutter={[24, 24]}>
                              {value.map((field, index) =>
                                field.isdisplayed === "Y" && field.isshowninstatusbar !== "Y" && field.nt_base_reference_id !== "28" && field.column_type !== "Button" ? (
                                  <Col
                                    key={`${index}-${headerRecord[field.ad_field_id]}`}
                                    span={field.nt_base_reference_id === FieldReference.WYSIWYGEditor || innerWidth < 600 ? 24 : innerWidth > 600 && innerWidth < 800 ? 12 : 8}
                                  >
                                    <Text type="secondary">{field.name}</Text> <br />
                                    <Text>
                                      {field.new_record_window ? (
                                        <span style={{ color: "#1648AA" }}>
                                          {getRecordValue(field) ? (
                                            <span style={{ cursor: "pointer" }} onClick={() => showPopupWindow(field)}>
                                              {getRecordValue(field)}&nbsp; <img src={Arrow} style={{ paddingBottom: "5px" }} alt="Arrow" />
                                            </span>
                                          ) : null}
                                          </span>
                                      ) : (
                                        getRecordValue(field)
                                      )}
                                    </Text>
                                  </Col>
                                ) : (
                                  ""
                                )
                              )}
                            </Row>
                          </Col>
                        </Row>
                      </Panel>
                    ))}
                  </Collapse>
                </Col>
              </Row>
            </Fragment>
          )}
        </Card>
      </Spin>
      <Modal 
       visible={mobMenu}
       title={<>
        {/* <center style={{fontWeight:'bold',fontStyle:'normal'}}>Confirm Delete</center> */}
        <span style={{float:'right'}}><CloseOutlined onClick={()=>setMobMenu(false)}/></span>
        </>}
       style={{float:'left',top:0}}
       width="40%"
       footer={null}
       closable={false}>
          <Menu mode="inline">
          {subMenuData.map((subMenu) => {
              return (
                <Menu.Item key={subMenu.key} onClick={()=>subMenuNavigate({type:subMenu.type,id:subMenu.id,key:subMenu.key,children:subMenu.children})}>{subMenu.title}</Menu.Item>
              )
            })}
          </Menu>
       </Modal>
    </Fragment>
  );
};

export default RecordHeader;
