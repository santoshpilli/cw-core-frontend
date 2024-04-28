import React, { useEffect, useState } from "react";
import { Row, Col, Button, Popover, Select, Input, Tabs, Checkbox, Spin, message, Table, Popconfirm, Modal } from "antd";
import { PlusOutlined, CaretRightOutlined, EditOutlined, DeleteOutlined, LoadingOutlined, EditFilled } from "@ant-design/icons";
import { Scrollbars } from "react-custom-scrollbars";
import { useHistory } from "react-router";
import { getSqlQuery, getFKTableData, getFKIdentifierData, getFKPrimaryKeyData, getReferenceData, getModuleData, getDetailReportData, getDataSourceData, getFieldsDetailReportData, getFieldsReferenceData, getNavigationWindowData, getReportDetails } from "../../../services/generic";
import { publishData } from "../../../services/genericForCustom";
import { useParams } from "react-router-dom";
// import { Steps,Hints } from 'intro.js-react';
// import 'intro.js/introjs.css';
// import Obj from "./intro.json"

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const NewReport = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const history = useHistory();
    const [name, setName] = useState("");
    const [nameFlag, setNameFlag] = useState(false);
    const [ntReportId, setNtReportId] = useState("");
    const [mainReportId, setMainReportId] = useState("");
    const [newFiltersVisible, setNewFiltersVisible] = useState(false);
    const [newFieldsVisible, setNewFieldsVisible] = useState(false);
    const [savedFiltersData, setSavedFiltersData] = useState([]);
    const [savedFiltersDataToShow, setSavedFiltersDataToShow] = useState([]);
    const [savedFieldsData, setSavedFieldsData] = useState([]);
    const [savedFieldsDataToShow, setSavedFieldsDataToShow] = useState([]);
    const [filtersFlag, setFiltersFlag] = useState(false);
    const [fieldsFlag, setFieldsFlag] = useState(false);
    const [filtersMainIndex, setFiltersMainIndex] = useState(0);
    const [fieldsMainIndex, setFieldsMainIndex] = useState(0);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [displayTableFlag, setDisplayTableFlag] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [columnData, setColumnData] = useState([]);
    const [visiblePopconfirm, setVisiblePopconfirm] = useState(false);
    const [confirmFieldsData, setConfirmFieldsData] = useState([]);
    const [runFlag, setRunFlag] = useState(false);
    const [dependentData, setDependentData] = useState([]);
    const [fkTableId, setFKTableId] = useState("");
    const [fkTableData, setFKTableData] = useState([]);
    const [fkIdentifierData, setFKIdentifierData] = useState([]);
    const [fkPrimaryKeyData, setFKPrimaryKeyData] = useState([]);
    const [referenceData, setReferenceData] = useState([]);
    const [moduleData, setModuleData] = useState([]);
    const [detailReportData, setDetailReportData] = useState([]);
    const [dataSourceData, setDataSourceData] = useState([]);
    const [fieldsDetailReportData, setFieldsDetailReportData] = useState([]);
    const [fieldsReferenceData, setFieldsReferenceData] = useState([]);
    const [navigationFieldData, setNavigationFieldData] = useState([]);
    const [navigationWindowData, setNavigationWindowData] = useState([]);
    const [currencyFieldData, setCurrencyFieldData] = useState([]);
    const [settingsData, setSettingsData] = useState([]);
    const [filtersReportId, setFiltersReportId] = useState("");
    const [fieldsReportId, setFieldsReportId] = useState("");
    const [settingsId, setSettingsId] = useState("");
    const [queryId, setQueryId] = useState("");
    const [queryReportId, setQueryReportId] = useState("");
    const [queryClientId, setQueryClientId] = useState("");
    const [filtersClientId, setFiltersClientId] = useState("");
    const [fieldsClientId, setFieldsClientId] = useState("");
    const [visibleFiltersModal, setVisibleFiltersModal] = useState(false);
    const [visibleFieldsModal, setVisibleFieldsModal] = useState(false);
    const [popFilterFlag, setPopFilterFlag] = useState(false);
    const [popFieldFlag, setPopFieldFlag] = useState(false);
    const [filtersModalIndex, setFiltersModalIndex] = useState("");
    const [fieldsModalIndex, setFieldsModalIndex] = useState("");
    const [hoverIn,setHoverIn] = useState({})
    const [hoverField,setHoverField] = useState({})
    const [isVisible,setIsVisible] = useState(false)
    const [hintsEnabled,setHintsEnabled] = useState(false)
    const [enabled,setEnabled] = useState(false);
    const [isFlag,setIsFlag] = useState(false)
    const [isFlag1,setIsFlag1] = useState(false)
    const { reportId } = useParams();


    const onExit = () => {
        setEnabled(false)  
    }
    // const getData1 =()=>{
    //   setEnabled(true)
    // }
    // const enableHints =()=>{
    //   setHintsEnabled(!hintsEnabled)
    // }

    useEffect(async() => {
        setLoading(true);
        if (reportId !== "newReport") {
            if (fkTableData.length > 0) {

            } else {
                const data = await getFKTableData();
                if (data !== null) {
                    setFKTableData(data);
                }
            };

            if (referenceData.length > 0) {

            } else {
                const data = await getReferenceData();
                if (data !== null) {
                    setReferenceData(data);
                }
            };

            if (fieldsDetailReportData.length > 0) {

            } else {
                const data = await getFieldsDetailReportData();
                if (data !== null) {
                    setFieldsDetailReportData(data);
                }
            };

            if (fieldsReferenceData.length > 0) {

            } else {
                const data = await getFieldsReferenceData();
                if (data !== null) {
                    setFieldsReferenceData(data);
                }
            };

            if (navigationWindowData.length > 0) {

            } else {
                const data = await getNavigationWindowData();
                if (data !== null) {
                    setNavigationWindowData(data);
                }
            };

            if (moduleData.length > 0) {

            } else {
                const data = await getModuleData();
                if (data !== null) {
                    setModuleData(data);
                }
            };

            if (detailReportData.length > 0) {

            } else {
                const data = await getDetailReportData();
                if (data !== null) {
                    setDetailReportData(data);
                }
            };

            if (dataSourceData.length > 0) {

            } else {
                const data = await getDataSourceData();
                if (data !== null) {
                    setDataSourceData(data);
                }
            };

            const serverResponse = await getReportDetails(reportId);
            if (serverResponse) {
                const data = serverResponse;
                setName(data.name);
                setNtReportId(data.nt_report_id);
                setMainReportId(data.report_id);
                let finalFilters = [];
                let dependentArr = [];
                for (let index = 0; index < data?.Filters?.length; index++) {
                    let arr = [];
                    dependentArr.push(
                        {
                            name: data.Filters[index].displayName !== undefined ? data.Filters[index].displayName : null,
                            id: data.Filters[index].id !== undefined ? data.Filters[index].id : null
                        }
                    );
                    arr.push(
                        {
                            name: "Display Name",
                            value: data.Filters[index].displayName !== undefined ? data.Filters[index].displayName : null
                        },
                        {
                            name: "Column Name",
                            value: data.Filters[index].columnName !== undefined ? data.Filters[index].columnName : null
                        },
                        {
                            name: "Type",
                            value: data.Filters[index].type !== undefined ? data.Filters[index].type : null
                        },
                        {
                            name: "Sequence No",
                            value: data.Filters[index].seqNo !== undefined ? data.Filters[index].seqNo : null
                        },
                        {
                            name: "Mandatory",
                            value: data.Filters[index].mandatory !== undefined ? data.Filters[index].mandatory : null
                        },
                        {
                            name: "Is For Prompting",
                            value: data.Filters[index].isForPrompting !== undefined ? data.Filters[index].isForPrompting : null
                        },
                        {
                            name: "Active",
                            value: data.Filters[index].isactive !== undefined ? data.Filters[index].isactive : null
                        },
                        {
                            name: "Dependent",
                            value: data.Filters[index].dependentName !== undefined ? data.Filters[index].dependentName : null
                        },
                        {
                            name: "FK Table",
                            value: data.Filters[index].fkTableName !== undefined ? data.Filters[index].fkTableName : null
                        },
                        {
                            name: "FK Identifier",
                            value: data.Filters[index].fkIdentifierName !== undefined && data.Filters[index].fkIdentifierName !== null ? data.Filters[index].fkIdentifierName.split(",") : []
                        },
                        {
                            name: "FK PrimaryKey",
                            value: data.Filters[index].fkPrimarykeyName !== undefined ? data.Filters[index].fkPrimarykeyName : null
                        },
                        {
                            name: "Reference",
                            value: data.Filters[index].nt_reference_name !== undefined ? data.Filters[index].nt_reference_name : null
                        },
                        {
                            name: "DependentId",
                            value: data.Filters[index].dependentId !== undefined ? data.Filters[index].dependentId : null
                        },
                        {
                            name: "FK TableId",
                            value: data.Filters[index].fkTableId !== undefined ? data.Filters[index].fkTableId : null
                        },
                        {
                            name: "FK IdentifierId",
                            value: data.Filters[index].fkIdentifierId !== undefined && data.Filters[index].fkIdentifierId !== null ? data.Filters[index].fkIdentifierId.split(",") : []
                        },
                        {
                            name: "FK PrimaryKeyId",
                            value: data.Filters[index].fkPrimarykeyId !== undefined ? data.Filters[index].fkPrimarykeyId : null
                        },
                        {
                            name: "ReferenceId",
                            value: data.Filters[index].nt_reference_id !== undefined ? data.Filters[index].nt_reference_id : null
                        },
                        {
                            name: "Where Clause",
                            value: data.Filters[index].whereclause !== undefined ? data.Filters[index].whereclause : null
                        },
                        {
                            name: "Default Value Expression",
                            value: data.Filters[index].defaultValueExpression !== undefined ? data.Filters[index].defaultValueExpression : null
                        },
                        {
                            name: "id",
                            value: data.Filters[index].id !== undefined ? data.Filters[index].id : null
                        }
                    );
                    finalFilters.push(arr);
                    setFiltersReportId(data.Filters[index].reportId);
                    setFiltersClientId(data.Filters[index].clientId);
                    if (data.Filters[0]?.fkTableId !== undefined) {
                        if (fkIdentifierData.length > 0) {

                        } else {
                            // if (fkTableId !== "" && fkTableId !== null) {
                                const idenData = await getFKIdentifierData(data.Filters[0]?.fkTableId);
                                if (idenData !== null) {
                                    setFKIdentifierData(idenData);
                                }
                            // } else {
                            //     message.warning("Please select FK Table first");
                            // };
                        };
            
                        if (fkPrimaryKeyData.length > 0) {
            
                        } else {
                            // if (fkTableId !== "" && fkTableId !== null) {
                                const keyData = await getFKPrimaryKeyData(data.Filters[0]?.fkTableId);
                                if (keyData !== null) {
                                    setFKPrimaryKeyData(keyData);
                                }
                            // } else {
                            //     message.warning("Please select FK Table first");
                            // }
                        };
                    };
                };
                setFiltersFlag(true);
                setSavedFiltersData(finalFilters);
                setDependentData(dependentArr);
                setFiltersMainIndex(data?.Filters?.length);
                let finalFields = [];
                let dropdownArr = [];
                for (let index = 0; index < data?.Fields?.length; index++) {
                    let arr = [];
                    dropdownArr.push(
                        {
                            name: data.Fields[index].displayName !== undefined ? data.Fields[index].displayName : null,
                            id: data.Fields[index].id !== undefined ? data.Fields[index].id: null
                        }
                    );
                    arr.push(
                        {
                            name: "Display Name",
                            value: data.Fields[index].displayName !== undefined ? data.Fields[index].displayName : null
                        },
                        {
                            name: "Field Name",
                            value: data.Fields[index].fieldName !== undefined ? data.Fields[index].fieldName : null
                        },
                        {
                            name: "Type",
                            value: data.Fields[index].type !== undefined ? data.Fields[index].type : null
                        },
                        {
                            name: "Sequence No",
                            value: data.Fields[index].sequence_no !== undefined ? data.Fields[index].sequence_no : null
                        },
                        {
                            name: "Grid Length",
                            value: data.Fields[index].gridlength !== undefined ? data.Fields[index].gridlength : null
                        },
                        {
                            name: "Drill Down",
                            value: data.Fields[index].drillDown !== undefined ? data.Fields[index].drillDown : null
                        },
                        {
                            name: "Detail Report",
                            value: data.Fields[index].detailReportName !== undefined ? data.Fields[index].detailReportName : null
                        },
                        {
                            name: "Detail ReportId",
                            value: data.Fields[index].detailReportId !== undefined ? data.Fields[index].detailReportId : null
                        },
                        {
                            name: "Currency Field",
                            value: data.Fields[index].currencyFieldName !== undefined ? data.Fields[index].currencyFieldName : null
                        },
                        {
                            name: "Currency FieldId",
                            value: data.Fields[index].currencyFieldId !== undefined ? data.Fields[index].currencyFieldId : null
                        },
                        {
                            name: "Active",
                            value: data.Fields[index].isactive !== undefined ? data.Fields[index].isactive : null
                        },
                        {
                            name: "Enable Summary",
                            value: data.Fields[index].enablesummary !== undefined ? data.Fields[index].enablesummary : null
                        },
                        {
                            name: "Reference",
                            value: data.Fields[index].nt_reference_name !== undefined ? data.Fields[index].nt_reference_name : null
                        },
                        {
                            name: "ReferenceId",
                            value: data.Fields[index].nt_reference_id !== undefined ? data.Fields[index].nt_reference_id : null
                        },
                        {
                            name: "Enable Navigation",
                            value: data.Fields[index].enablenavigation !== undefined ? data.Fields[index].enablenavigation : null
                        },
                        {
                            name: "Navigation Field",
                            value: data.Fields[index].navigation_field_name !== undefined ?  data.Fields[index].navigation_field_name : null
                        },
                        {
                            name: "Navigation FieldId",
                            value: data.Fields[index].navigation_field_id !== undefined ? data.Fields[index].navigation_field_id : null
                        },
                        {
                            name: "Navigation Window",
                            value: data.Fields[index].navigation_window_name !== undefined ? data.Fields[index].navigation_window_name : null
                        },
                        {
                            name: "Navigation WindowId",
                            value: data.Fields[index].navigation_window_id !== undefined ? data.Fields[index].navigation_window_id: null
                        },
                        {
                            name: "id",
                            value: data.Fields[index].id !== undefined ? data.Fields[index].id: null
                        }
                    );
                    finalFields.push(arr);
                    setFieldsReportId(data?.Fields[index]?.reportId);
                    setFieldsClientId(data?.Fields[index]?.clientId);
                };
                setFieldsFlag(true);
                setSavedFieldsData(finalFields);
                setNavigationFieldData(dropdownArr);
                setCurrencyFieldData(dropdownArr);
                setFieldsMainIndex(data?.Fields?.length);
                let finalSettings = [];
                if (data?.Settings !== undefined) {
                    finalSettings.push(
                        {
                            name: "Module",
                            value: typeof(data?.Settings) !== "object" ? (data?.Settings[0]?.moduleName !== undefined ? data?.Settings[0]?.moduleName : null) : (data?.Settings?.moduleName !== undefined ? data?.Settings?.moduleName : null)
                        },
                        {
                            name: "ModuleId",
                            value: typeof(data?.Settings) !== "object" ? (data?.Settings[0]?.moduleId !== undefined ? data?.Settings[0]?.moduleId : null) : (data?.Settings?.moduleId !== undefined ? data?.Settings?.moduleId : null)
                        },
                        {
                            name: "Type",
                            value: typeof(data?.Settings) !== "object" ? (data?.Settings[0]?.type !== undefined ? data?.Settings[0]?.type : null) : (data?.Settings?.type !== undefined ? data?.Settings?.type : null)
                        },
                        {
                            name: "Detail Report",
                            value: typeof(data?.Settings) !== "object" ? (data?.Settings[0]?.detailReportName !== undefined ? data?.Settings[0]?.detailReportName : null) : (data?.Settings?.detailReportName !== undefined ? data?.Settings?.detailReportName : null)
                        },
                        {
                            name: "Detail ReportId",
                            value: typeof(data?.Settings) !== "object" ? (data?.Settings[0]?.detailReportId !== undefined ? data?.Settings[0]?.detailReportId : null) : (data?.Settings?.detailReportId !== undefined ? data?.Settings?.detailReportId : null)
                        },
                        {
                            name: "Data? Source",
                            value: typeof(data?.Settings) !== "object" ? (data?.Settings[0]?.datasourceName !== undefined ? data?.Settings[0]?.datasourceName : null) : (data?.Settings?.datasourceName !== undefined ? data?.Settings?.datasourceName : null)
                        },
                        {
                            name: "Data? SourceId",
                            value: typeof(data?.Settings) !== "object" ? (data?.Settings[0]?.datasourceId !== undefined ? data?.Settings[0]?.datasourceId : null) : (data?.Settings?.datasourceId !== undefined ? data?.Settings?.datasourceId : null)
                        },
                        {
                            name: "Report Path",
                            value: typeof(data?.Settings) !== "object" ? (data?.Settings[0]?.reportpath !== undefined ? data?.Settings[0]?.reportpath : null) : (data?.Settings?.reportpath !== undefined ? data?.Settings?.reportpath : null)
                        },
                        {
                            name: "Description",
                            value: typeof(data?.Settings) !== "object" ? (data?.Settings[0]?.description !== undefined ? data?.Settings[0]?.description : null) : (data?.Settings?.description !== undefined ? data?.Settings?.description : null)
                        },
                        {
                            name: "Enable Date Options",
                            value: typeof(data?.Settings) !== "object" ? (data?.Settings[0]?.enabledateoptions !== undefined ? data?.Settings[0]?.enabledateoptions : null) : (data?.Settings?.enabledateoptions !== undefined ? data?.Settings?.enabledateoptions : null)
                        },
                        {
                            name: "Enable Download",
                            value: typeof(data?.Settings) !== "object" ? (data?.Settings[0]?.enabledownload !== undefined ? data?.Settings[0]?.enabledownload : null) : (data?.Settings?.enabledownload !== undefined ? data?.Settings?.enabledownload : null)
                        },
                        {
                            name: "Enable Pivot",
                            value: typeof(data?.Settings) !== "object" ? (data?.Settings[0]?.enablepivot !== undefined ? data?.Settings[0]?.enablepivot : null) : (data?.Settings?.enablepivot !== undefined ? data?.Settings?.enablepivot : null)
                        },
                        {
                            name: "Enable AutoRun",
                            value: typeof(data?.Settings) !== "object" ? (data?.Settings[0]?.enableautorun !== undefined ? data?.Settings[0]?.enableautorun : null) : (data?.Settings?.enableautorun !== undefined ? data?.Settings?.enableautorun : null)
                        },
                        {
                            name: "Enable Nested",
                            value: typeof(data?.Settings) !== "object" ? (data?.Settings[0]?.enablenestedtable !== undefined ? data?.Settings[0]?.enablenestedtable : null) : (data?.Settings?.enablenestedtable !== undefined ? data?.Settings?.enablenestedtable : null)
                        },
                        {
                            name: "Active",
                            value: typeof(data?.Settings) !== "object" ? (data?.Settings[0]?.isactive !== undefined ? data?.Settings[0]?.isactive : null) : (data?.Settings?.isactive !== undefined ? data?.Settings?.isactive : null)
                        }
                    );
                    setSettingsId(typeof(data?.Settings) !== "object" ? data?.Settings[0]?.id : data?.Settings?.id);
                    setSettingsData(finalSettings);
                }

                if (data?.query?.length > 0) {
                    const queryData = data?.query[0]?.query.replace( /\r?\n|\r/g,'\\n');
                    const changedQueryData = queryData.replace(/"/g, '\\"');
                    setQuery(changedQueryData);
                } else {
                    if (data?.query?.query !== null) {
                        const queryData = data?.query?.query.replace( /\r?\n|\r/g,'\\n');
                        const changedQueryData = queryData?.replace(/"/g, '\\"');
                        setQuery(changedQueryData);
                    }
                };
                setQueryId(data?.query?.length > 0 ? data?.query[0]?.id : data?.query?.id);
                setQueryReportId(data?.query?.length > 0 ? data?.query[0]?.reportId : data?.query?.reportId);
                setQueryClientId((data?.query?.length > 0 ? data?.query[0]?.clientId : data?.query?.clientId))
                setRunFlag(true);
                setLoading(false);
            };
        } else {
            setLoading(false);
            let arr2 = [...settingsData];
            arr2.push(
                {name: "Type", value: "Standard"},
                {name: 'Enable Date Options', value: 'Y'},
                {name: 'Enable Download', value: 'Y'},
                {name: 'Active', value: 'Y'}
            );
            setSettingsData(arr2);
        };
    }, []);

    const filtersData = [
        {
            name: "Display Name",
            type: "String"
        },
        {
            name: "Column Name",
            type: "String"
        },
        {
            name: "Type",
            type: "Dropdown"
        },
        {
            name: "Sequence No",
            type: "String"
        },
        {
            name: "Mandatory",
            type: "Checkbox"
        },
        {
            name: "Is For Prompting",
            type: "Checkbox"
        },
        {
            name: "Active",
            type: "Checkbox"
        },
        {
            name: "Dependent",
            type: "Dropdown"
        },
        {
            name: "FK Table",
            type: "Dropdown"
        },
        {
            name: "FK Identifier",
            type: "Dropdown"
        },
        {
            name: "FK PrimaryKey",
            type: "Dropdown"
        },
        {
            name: "Reference",
            type: "Dropdown"
        },
        {
            name: "Where Clause",
            type: "Text"
        },
        {
            name: "Default Value Expression",
            type: "Text"
        },
    ];

    const fieldsData = [
        {
            name: "Display Name",
            type: "String"
        },
        {
            name: "Field Name",
            type: "String"
        },
        {
            name: "Type",
            type: "Dropdown"
        },
        {
            name: "Sequence No",
            type: "String"
        },
        {
            name: "Grid Length",
            type: "String"
        },
        {
            name: "Drill Down",
            type: "Checkbox"
        },
        {
            name: "Detail Report",
            type: "Dropdown"
        },
        {
            name: "Currency Field",
            type: "Dropdown"
        },
        {
            name: "Active",
            type: "Checkbox"
        },
        {
            name: "Enable Summary",
            type: "Checkbox"
        },
        {
            name: "Reference",
            type: "Dropdown"
        },
        {
            name: "Enable Navigation",
            type: "Checkbox"
        },
        {
            name: "Navigation Field",
            type: "Dropdown"
        },
        {
            name: "Navigation Window",
            type: "Dropdown"
        },
    ];

    const renderThumb = ({ style, ...props }) => {
        const thumbStyle = {
          backgroundColor: "#c1c1c1",
          borderRadius: "5px",
          width: "8px",
        };
        return <div style={{ ...style, ...thumbStyle }} {...props} />;
    };
    
    const renderThumbHorizontalScroll = ({ style, ...props }) => {
        const thumbStyle = {
          width: "0px",
        };
        return <div style={{ ...style, ...thumbStyle }} {...props} />;
    };

    const handleFKTableData = async () => {
        if (fkTableData.length > 0) {

        } else {
            const data = await getFKTableData();
            setFKTableData(data);
        };
    };

    const handleFKIdentifierData = async () => {
        if (fkIdentifierData.length > 0) {

        } else {
            if (fkTableId !== "" && fkTableId !== null) {
                const id = fkTableData.find(data => data.name === fkTableId).id;
                const data = await getFKIdentifierData(id);
                setFKIdentifierData(data);
            } else {
                message.warning("Please select FK Table first");
            };
        };
    };

    const handleFKPrimaryKeyData = async () => {
        if (fkPrimaryKeyData.length > 0) {

        } else {
            if (fkTableId !== "" && fkTableId !== null) {
                const id = fkTableData.find(data => data.name === fkTableId).id;
                const data = await getFKPrimaryKeyData(id);
                setFKPrimaryKeyData(data);
            } else {
                message.warning("Please select FK Table first");
            }
        };
    };

    const handleReferenceData = async () => {
        if (referenceData.length > 0) {

        } else {
            const data = await getReferenceData();
            setReferenceData(data);
        };
    };

    const handleFiltersChange = (name, type) => (ev) => {
        if (name === "FK Table") {
            setFKTableId(ev);
            setFKIdentifierData([]);
            setFKPrimaryKeyData([]);
        };
        setFiltersFlag(false);
        let arr = [...savedFiltersData];
        if (arr[filtersMainIndex] === undefined) {
            arr.push(
                [{
                    name: name,
                    value: type === "Dropdown" ? ev : name === "Column Name" ? ev.target.value.split(" ").join("") : type === "Checkbox" ? (ev.target.checked === true ? "Y" : "N") : ev.target.value
                }]
            );
        } else {
            let ind = -1;
            for (let index = 0; index < arr[filtersMainIndex].length; index++) {
                if (arr[filtersMainIndex][index].name === name) {
                    ind = index
                }
            }
            if (ind === -1) {
                arr[filtersMainIndex].push(
                    {
                        name: name,
                        value: type === "Dropdown" ? ev : name === "Column Name" ? ev.target.value.split(" ").join("") : type === "Checkbox" ? (ev.target.checked === true ? "Y" : "N") : ev.target.value
                    }
                );
            } else {
                if (ev?.target?.value === "" || ev === "") {
                    arr[filtersMainIndex].splice(ind, 1);
                } else {
                    arr[filtersMainIndex][ind].value = type === "Dropdown" ? ev : name === "Column Name" ? ev.target.value.split(" ").join("") : type === "Checkbox" ? (ev.target.checked === true ? "Y" : "N") : ev.target.value
                };
            };
        };
        setSavedFiltersDataToShow(arr[filtersMainIndex]);
        setSavedFiltersData(arr);
    };

    const handleFilters = () => {
        let displayFlag = "N", columnFlag = "N", typeFlag = "N", sequenceFlag ="N";
        savedFiltersData[filtersMainIndex].forEach(item => {
            if (item.name === "Display Name") {
                displayFlag = "Y"
            }
            if (item.name === "Column Name") {
                columnFlag = "Y"
            }
            if (item.name === "Type") {
                typeFlag = "Y"
            }
            if (item.name === "Sequence No") {
                if (item.value !== null) {
                    sequenceFlag = "Y"
                };
            }
        });
        if (displayFlag === "N" || columnFlag === "N" || typeFlag === "N" || sequenceFlag === "N") {
            message.warning("Dispaly Name, Column Name, Type and Sequence No are mandatory");
        } else {
            setNewFiltersVisible(false);
            setSavedFiltersDataToShow([]);
            setFiltersMainIndex(filtersMainIndex + 1);
            setFiltersFlag(true);
            setFKTableId("");
        };
    };

    const handleEditFilters = (savedFilters, ind) => () => {
        if (fkTableData.length > 0) {
            if (savedFilters.find(item => item.name === "FK Table")?.value !== undefined) {
                setFKTableId(savedFilters.find(item => item.name === "FK Table")?.value);
            };
        } else {
            if (savedFilters.find(item => item.name === "FK TableId")?.value !== undefined) {
                setFKTableId(savedFilters.find(item => item.name === "FK TableId")?.value);
            };
        }
        setFiltersFlag(true);
        setNewFiltersVisible(true);
        setFiltersMainIndex(ind);
        setSavedFiltersDataToShow(savedFilters);
    };

    const handleDeleteFilters = (ind) => () => {
        setFiltersModalIndex(ind);
        setVisibleFiltersModal(true);
    };

    const filtersContent = (
        <div style={{width : 680}}>
            <Row gutter={16} style={{width : 680}}>
                <Col span={24} className="gutter-row">
                    <div style={{ fontWeight: 600, fontSize: "16px", textAlign: "center",color:'#666666' }}>New Filter</div>
                </Col>
            </Row>
            <br />
            <Scrollbars
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={200}CaretRightOutlined
                thumbSize={100}
                renderThumbHorizontal={renderThumbHorizontalScroll}
                renderThumbVertical={renderThumb}
                style={{ height: "60vh" }}
            >
                <Row gutter={16} style={{width : 680,paddingLeft:'10px'}}>
                    <>
                        {filtersData?.map(filters => {
                            if (filters?.type === "Dropdown" || filters?.type === "String" || filters?.type === "Checkbox") {
                                return (
                                    <>
                                        <Col span={12} className="gutter-row" style={{marginBottom:'16px'}}>
                                            {filters?.name}
                                            <br />
                                            {filters?.name === "Display Name" ?
                                                <Input
                                                    value={savedFiltersDataToShow?.find(filter => filter.name === filters?.name)?.value}
                                                    onChange={handleFiltersChange(filters?.name, filters?.type)}
                                                    style={{ width: "100%" }}
                                                /> :
                                            filters?.name === "Column Name" ?
                                                <Input
                                                    value={savedFiltersDataToShow?.find(filter => filter.name === filters?.name)?.value}
                                                    onChange={handleFiltersChange(filters?.name, filters?.type)}
                                                    style={{ width: "100%" }}
                                                /> :
                                            filters?.name === "Type" ?
                                                <Select
                                                    showSearch
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    style={{ width: "100%" }}
                                                    value={savedFiltersDataToShow?.find(filter => filter.name === filters?.name)?.value}
                                                    onChange={handleFiltersChange(filters?.name, filters?.type)}
                                                >
                                                    <Option value="Date">Date</Option>
                                                    <Option value="DateRange">DateRange</Option>
                                                    <Option value="String">String</Option>
                                                    <Option value="Selector">Selector</Option>
                                                    <Option value="Multi Selector">Multi Selector</Option>
                                                    <Option value="Numeric">Numeric</Option>
                                                    <Option value="Flag">Flag</Option>
                                                    <Option value="List">List</Option>
                                                </Select> :
                                            filters?.name === "Sequence No" ?
                                                <Input
                                                    value={savedFiltersDataToShow?.find(filter => filter.name === filters?.name)?.value}
                                                    onChange={handleFiltersChange(filters?.name, filters?.type)}
                                                    type="number"
                                                    style={{ width: "100%" }}
                                                /> :
                                            filters?.name === "Mandatory" ?
                                                <Checkbox checked={savedFiltersDataToShow?.find(filter => filter.name === filters?.name)?.value === "Y" ? true : false} onChange={handleFiltersChange(filters?.name, filters?.type)}></Checkbox> :
                                            filters?.name === "Is For Prompting" ?
                                                <Checkbox checked={savedFiltersDataToShow?.find(filter => filter.name === filters?.name)?.value === "Y" ? true : false} onChange={handleFiltersChange(filters?.name, filters?.type)}></Checkbox> :
                                            filters?.name === "Active" ?
                                                <Checkbox checked={savedFiltersDataToShow?.find(filter => filter.name === filters?.name)?.value === "Y" ? true : false} onChange={handleFiltersChange(filters?.name, filters?.type)}></Checkbox> :
                                            filters?.name === "Dependent" ?
                                                <Select
                                                    showSearch
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    style={{ width: "100%" }}
                                                    value={savedFiltersDataToShow?.find(filter => filter.name === filters?.name)?.value}
                                                    onChange={handleFiltersChange(filters?.name, filters?.type)}
                                                >
                                                    {dependentData.map(data => {
                                                        return (
                                                            <Option value={data.name} key={data.name}>{data.name}</Option>
                                                        )
                                                    })}
                                                </Select> :
                                            filters?.name === "FK Table" ?
                                                <Select
                                                    showSearch
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    style={{ width: "100%" }}
                                                    onClick={handleFKTableData}
                                                    value={savedFiltersDataToShow?.find(filter => filter.name === filters?.name)?.value}
                                                    onChange={handleFiltersChange(filters?.name, filters?.type)}
                                                >
                                                    {fkTableData.map(data => {
                                                        return (
                                                            <Option value={data.name} key={data.name}>{data.name}</Option>
                                                        )
                                                    })}
                                                </Select> :
                                            filters?.name === "FK Identifier" ?
                                                <Select
                                                    showSearch
                                                    mode="multiple"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    style={{ width: "100%" }}
                                                    onClick={handleFKIdentifierData}
                                                    value={savedFiltersDataToShow?.find(filter => filter.name === filters?.name)?.value}
                                                    onChange={handleFiltersChange(filters?.name, filters?.type)}
                                                >
                                                    {fkIdentifierData.map(data => {
                                                        return (
                                                            <Option value={data.name} key={data.name}>{data.name}</Option>
                                                        )
                                                    })}
                                                </Select> :
                                            filters?.name === "FK PrimaryKey" ?
                                                <Select
                                                    showSearch
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    style={{ width: "100%" }}
                                                    onClick={handleFKPrimaryKeyData}
                                                    value={savedFiltersDataToShow?.find(filter => filter.name === filters?.name)?.value}
                                                    onChange={handleFiltersChange(filters?.name, filters?.type)}
                                                >
                                                    {fkPrimaryKeyData.map(data => {
                                                        return (
                                                            <Option value={data.name} key={data.name}>{data.name}</Option>
                                                        )
                                                    })}
                                                </Select> :
                                            filters?.name === "Reference" ?
                                                <Select
                                                    showSearch
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    style={{ width: "100%" }}
                                                    onClick={handleReferenceData}
                                                    value={savedFiltersDataToShow?.find(filter => filter.name === filters?.name)?.value}
                                                    onChange={handleFiltersChange(filters?.name, filters?.type)}
                                                >
                                                    {referenceData.map(data => {
                                                        return (
                                                            <Option value={data.name} key={data.name}>{data.name}</Option>
                                                        )
                                                    })}
                                                </Select> :
                                                ""
                                            }
                                            <br />
                                        </Col>
                                    </>
                                )
                            };
                        })}
                        {filtersData.map(filters => {
                            return (
                                filters?.type === "Text" ?
                                    <Col span={24} className="gutter-row" style={{marginBottom:'16px'}}>
                                        {filters?.name}
                                        <br />
                                        <TextArea
                                            value={savedFiltersDataToShow?.find(filter => filter.name === filters?.name)?.value}
                                            onChange={handleFiltersChange(filters?.name, filters?.type)}
                                        />
                                        <br />
                                    </Col> :
                                ""
                            )
                        })}
                    </> 
                </Row>
            </Scrollbars>
            <br />
            <Row>
                <div style={{ marginLeft: 480 }}>
                    <Button style={{ marginBottom: "8px", width: "93px", height: "33px" }} onClick={() => { 
                        setNewFiltersVisible(false); setSavedFiltersDataToShow([]); setFKTableId(""); setFiltersFlag(true);         
                        if (popFilterFlag === true) {
                            let arr = [...savedFiltersData];
                            arr.splice(arr.length-1, 1);
                            setSavedFiltersData(arr);
                            setFiltersMainIndex(arr.length);
                            setPopFilterFlag(false);
                        } else {
                            setFiltersMainIndex(savedFiltersData.length);
                        };
                        setIsFlag(false);
                        getEditedData({})
                    }}>
                        Cancel
                    </Button>
                    &nbsp;
                    <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={()=>{ setIsFlag(false);getEditedData({}); handleFilters()}}>
                        Save
                    </Button>
                </div>
            </Row>
        </div>
    );

    const handleFieldsDetailReportData = async () => {
        if (fieldsDetailReportData.length > 0) {

        } else {
            const data = await getFieldsDetailReportData();
            setFieldsDetailReportData(data);
        };
    };

    const handleFieldsReferenceData = async () => {
        if (fieldsReferenceData.length > 0) {

        } else {
            const data = await getFieldsReferenceData();
            setFieldsReferenceData(data);
        };
    };

    const handleNavigationWindowData = async () => {
        if (navigationWindowData.length > 0) {

        } else {
            const data = await getNavigationWindowData();
            setNavigationWindowData(data);
        };
    };

    const handleFieldsChange = (name, type) => (ev) => {
        setFieldsFlag(false);
        let arr = [...savedFieldsData];
        if (arr[fieldsMainIndex] === undefined) {
            arr.push(
                [{
                    name: name,
                    value: type === "Dropdown" ? ev : name === "Field Name" ? ev.target.value.split(" ").join("") : type === "Checkbox" ? (ev.target.checked === true ? "Y" : "N") : ev.target.value
                }]
            );
        } else {
            let ind = -1;
            for (let index = 0; index < arr[fieldsMainIndex].length; index++) {
                if (arr[fieldsMainIndex][index].name === name) {
                    ind = index
                }
            }
            if (ind === -1) {
                arr[fieldsMainIndex].push(
                    {
                        name: name,
                        value: type === "Dropdown" ? ev : name === "Field Name" ? ev.target.value.split(" ").join("") : type === "Checkbox" ? (ev.target.checked === true ? "Y" : "N") : ev.target.value
                    }
                );
            } else {
                if (ev?.target?.value === "" || ev === "") {
                    arr[fieldsMainIndex].splice(ind, 1);
                } else {
                    arr[fieldsMainIndex][ind].value = type === "Dropdown" ? ev : name === "Field Name" ? ev.target.value.split(" ").join("") : type === "Checkbox" ? (ev.target.checked === true ? "Y" : "N") : ev.target.value;
                };
            };
        };
        setSavedFieldsDataToShow(arr[fieldsMainIndex]);
        setSavedFieldsData(arr);
    };

    const handleFields = () => {
        let displayFlag = "N", fieldFlag = "N", typeFlag = "N", sequenceFlag ="N";
        savedFieldsData[fieldsMainIndex].forEach(item => {
            if (item.name === "Display Name") {
                displayFlag = "Y"
            }
            if (item.name === "Field Name") {
                fieldFlag = "Y"
            }
            if (item.name === "Type") {
                typeFlag = "Y"
            }
            if (item.name === "Sequence No") {
                if (item.value !== null) {
                    sequenceFlag = "Y"
                };
            }
        });
        if (displayFlag === "N" || fieldFlag === "N" || typeFlag === "N" || sequenceFlag === "N") {
            message.warning("Dispaly Name, Field Name, Type and Sequence No are mandatory");
        } else {
            setNewFieldsVisible(false);
            setSavedFieldsDataToShow([]);
            setFieldsMainIndex(fieldsMainIndex + 1);
            setFieldsFlag(true);
        };
    };

    const handleEditFields = (savedFields, ind) => () => {
        setFieldsFlag(true);
        setNewFieldsVisible(true);
        setFieldsMainIndex(ind);
        setSavedFieldsDataToShow(savedFields);
    };

    const handleDeleteFields = (ind) => () => {
        setFieldsModalIndex(ind);
        setVisibleFieldsModal(true);
    };

    const fieldsContent = (
        <div style={{width : 700}}>
            <Row>
                <Col span={24}>
                    <div style={{ fontWeight: 600, fontSize: "16px", textAlign: "center" }}>New Field</div>
                </Col>
            </Row>
            <br />
            <Scrollbars
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={200}
                thumbSize={100}
                renderThumbHorizontal={renderThumbHorizontalScroll}
                renderThumbVertical={renderThumb}
                style={{ height: "60vh" }}
            >
                <Row>
                    <>
                        {fieldsData.map(fields => {
                            return (
                                fields.type === "Dropdown" ?
                                    <Col span={12}>
                                        {fields.name}
                                        <br />
                                        {fields.name === "Type" ?
                                            <Select
                                                showSearch 
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                style={{ width: 320 }}
                                                value={savedFieldsDataToShow.find(field => field.name === fields.name)?.value}
                                                onChange={handleFieldsChange(fields.name, fields.type)}
                                            >
                                                <Option value="Date">Date</Option>
                                                <Option value="String">String</Option>
                                                <Option value="Numeric">Numeric</Option>
                                                <Option value="List">List</Option>
                                                <Option value="Amount">Amount</Option>
                                                <Option value="Yes/No">Yes/No</Option>
                                                <Option value="Image">Image</Option>
                                                <Option value="WYSIWYG Editor">WYSIWYG Editor</Option>
                                            </Select> :
                                        fields.name === "Detail Report" ?
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                style={{ width: 320 }}
                                                onClick={handleFieldsDetailReportData}
                                                value={savedFieldsDataToShow.find(field => field.name === fields.name)?.value}
                                                onChange={handleFieldsChange(fields.name, fields.type)}
                                            >
                                                {fieldsDetailReportData.map(data => {
                                                    return (
                                                        <Option value={data.name} key={data.name}>{data.name}</Option>
                                                    )
                                                })}
                                            </Select> :
                                        fields.name === "Currency Field" ?
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            style={{ width: 320 }}
                                            value={savedFieldsDataToShow.find(field => field.name === fields.name)?.value}
                                            onChange={handleFieldsChange(fields.name, fields.type)}
                                        >
                                            {currencyFieldData.map(data => {
                                                return (
                                                    <Option value={data.name} key={data.name}>{data.name}</Option>
                                                )
                                            })}
                                        </Select> :
                                        fields.name === "Reference" ?
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                style={{ width: 320 }}
                                                onClick={handleFieldsReferenceData}
                                                value={savedFieldsDataToShow.find(field => field.name === fields.name)?.value}
                                                onChange={handleFieldsChange(fields.name, fields.type)}
                                            >
                                                {fieldsReferenceData.map(data => {
                                                    return (
                                                        <Option value={data.name} key={data.name}>{data.name}</Option>
                                                    )
                                                })}
                                            </Select> :
                                        fields.name === "Navigation Field" ?
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            style={{ width: 320 }}
                                            value={savedFieldsDataToShow.find(field => field.name === fields.name)?.value}
                                            onChange={handleFieldsChange(fields.name, fields.type)}
                                        >
                                            {navigationFieldData.map(data => {
                                                return (
                                                    <Option value={data.name} key={data.name}>{data.name}</Option>
                                                )
                                            })}
                                        </Select> :
                                        fields.name === "Navigation Window" ?
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                style={{ width: 320 }}
                                                onClick={handleNavigationWindowData}
                                                value={savedFieldsDataToShow.find(field => field.name === fields.name)?.value}
                                                onChange={handleFieldsChange(fields.name, fields.type)}
                                            >
                                                {navigationWindowData.map(data => {
                                                    return (
                                                        <Option value={data.name} key={data.name}>{data.name}</Option>
                                                    )
                                                })}
                                            </Select> :
                                            <Select 
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                style={{ width: 320 }}
                                                value={savedFieldsDataToShow.find(field => field.name === fields.name)?.value}
                                                onChange={handleFieldsChange(fields.name, fields.type)}
                                            >

                                            </Select>
                                        }
                                        <br />
                                    </Col> :
                                fields.name === "Sequence No" ?
                                <Col span={12}>
                                    {fields.name}
                                    <br />
                                    <Input
                                        type="number"
                                        value={savedFieldsDataToShow.find(field => field.name === fields.name)?.value}
                                        style={{ width: 320 }}
                                        onChange={handleFieldsChange(fields.name, fields.type)}
                                    />
                                    <br />
                                </Col> :
                                fields.type === "String" ?
                                    <Col span={12}>
                                        {fields.name}
                                        <br />
                                        <Input
                                            value={savedFieldsDataToShow.find(field => field.name === fields.name)?.value}
                                            style={{ width: 320 }}
                                            onChange={handleFieldsChange(fields.name, fields.type)}
                                        />
                                        <br />
                                    </Col> :
                                ""
                            )
                        })}
                        {fieldsData.map(fields => {
                            return (
                                fields.type === "Text" ?
                                    <Col span={24}>
                                        {fields.name}
                                        <br />
                                        <TextArea
                                            value={savedFieldsDataToShow.find(field => field.name === fields.name)?.value}
                                            style={{ width: 670 }}
                                            onChange={handleFieldsChange(fields.name, fields.type)}
                                        />
                                        <br />
                                    </Col> :
                                ""
                            )
                        })} 
                        {fieldsData.map(fields => {
                            return (
                                fields.type === "Checkbox" ?
                                    <Col span={24}>
                                        {fields.name}
                                        <br />
                                        <Checkbox checked={savedFieldsDataToShow.length > 0 ? (savedFieldsDataToShow.find(field => field.name === fields.name)?.value === "Y" ? true : false) : (savedFieldsDataToShow.find(field => field.name === fields.name)?.value === "Y" ? true : false)} onChange={handleFieldsChange(fields.name, fields.type)}></Checkbox>
                                        <br />
                                    </Col> :
                                ""
                            )
                        })}
                    </> 
                </Row>
            </Scrollbars>
            <br />
            <Row>
                <div style={{ marginLeft: 480 }}>
                    <Button style={{ marginBottom: "8px", width: "93px", height: "33px" }} onClick={() => { 
                        setNewFieldsVisible(false); setSavedFieldsDataToShow([]); setFieldsFlag(true);
                        if (popFieldFlag === true) {
                            let arr = [...savedFieldsData];
                            arr.splice(arr.length-1, 1);
                            setSavedFieldsData(arr);
                            setFieldsMainIndex(arr.length);
                            setPopFieldFlag(false);
                        } else {
                            setFieldsMainIndex(savedFieldsData.length);
                            setIsFlag1(false);
                        getFieldEdit({})
                        };
                    }}>
                        Cancel
                    </Button>
                    &nbsp;
                    <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={()=>{setIsFlag1(false);
                        getFieldEdit({});handleFields()}}>
                        Save
                    </Button>
                </div>
            </Row>
        </div>
    );

    const handleNewFiltersVisible = () => {
        setNewFiltersVisible(true);
        setPopFilterFlag(true);
        let finalArr = [...savedFiltersData];
        let arr = [];
        arr.push(
            {
                name: "Active",
                value: "Y"
            },
            {
                name: "Is For Prompting",
                value: "Y"
            }
        );
        finalArr.push(arr);
        setSavedFiltersDataToShow(arr);
        setSavedFiltersData(finalArr);
    };

    const handleNewFieldsVisible = () => {
        setNewFieldsVisible(true);
        setPopFieldFlag(true);
        let finalArr = [...savedFieldsData];
        let arr = [];
        arr.push(
            {
                name: "Active",
                value: "Y"
            }
        );
        finalArr.push(arr);
        setSavedFieldsDataToShow(arr);
        setSavedFieldsData(finalArr);
    };

    const handleModuleData = async () => {
        if (moduleData.length > 0) {

        } else {
            const data = await getModuleData();
            setModuleData(data);
        };
    };

    const handleDetailReportData = async () => {
        if (detailReportData.length > 0) {

        } else {
            const data = await getDetailReportData();
            setDetailReportData(data);
        };
    };

    const handleDataSourceData = async () => {
        if (dataSourceData.length > 0) {

        } else {
            const data = await getDataSourceData();
            setDataSourceData(data);
        };
    };

    const handleQuery = (ev) => {
        setQuery(ev.target.value);
        setSavedFieldsData([]);
        setDisplayTableFlag(false);
        setRunFlag(true);
    };

    const confirm = () => {
        setSavedFieldsData(confirmFieldsData);
        setVisiblePopconfirm(false);
    };

    const cancel = () => {
        setVisiblePopconfirm(false);
    };

    const handleRun = async () => {
        setLoading(true);
        let queryData = null;

        if (query !== undefined && query !== null) {
          const doubleQuoteForDesc = query.replace(/\r?\n|\r/g, '\\n');
          queryData = doubleQuoteForDesc.replace(/"/g, '\\"');
        };
    
        const getSqlQueryData = await getSqlQuery(queryData);

        if (getSqlQueryData.Status === 'Success') {
            let dataArray;
            let arr = [...savedFieldsData];
            const clientGridArray = []
            const res2 = getSqlQueryData.Result;
            if (res2.length > 0) {
                for (let index = 0; index < res2.length; index += 1) {
                    dataArray = res2[index];
                    clientGridArray.push(dataArray);
                };
                for (let index2 = 0; index2 < Object.keys(res2[0]).length; index2++) {
                    arr.push(
                        [
                            {
                                name : "Display Name",
                                value : Object.keys(res2[0])[index2]
                            },
                            {
                                name : "Field Name",
                                value : Object.keys(res2[0])[index2]
                            },
                            {
                                name : "Type",
                                value : "String"
                            },
                            {
                                name : "Sequence No",
                                value : (index2+1)*10
                            }
                        ]
                    );
                };
                const ObjKey = Object.keys(clientGridArray[0]);
                const ColDef = [];
                for (let index = 0; index < ObjKey.length; index += 1) {
                    const element = ObjKey[index];
                    ColDef.push({
                        title: element,
                        dataIndex: element,
                        width: 180,
                        ellipsis: true
                    });
                };
                setLoading(false);
                setDisplayTableFlag(true);
                setColumnData(ColDef);
                setRowData(clientGridArray);
                setConfirmFieldsData(arr);
                setVisiblePopconfirm(true);
                setFieldsFlag(true);
                setRunFlag(false);
            }
        } else {
            message.error(getSqlQueryData.Result);
            setLoading(false);
            setDisplayTableFlag(false);
        }
    };

    const handleSettingsData = (name) => (ev) => {
        let arr = [...settingsData];
        if (arr.length === 0) {
            arr.push({
                name : name,
                value : name === "Report Path" ?
                            ev.target.value : 
                        name === "Description" ?
                            ev.target.value :
                        name === "Module" ?
                            ev :
                        name === "Type" ?
                            ev :
                        name === "Detail Report" ?
                            ev :
                        name === "Data Source" ? 
                            ev : 
                            ev.target.checked === true ? "Y" : "N"
            });
        } else {
            let ind = -1;
            for (let index = 0; index < arr.length; index++) {
                if (arr[index].name === name) {
                    ind = index
                }
            }
            if (ind === -1) {
                arr.push(
                    {
                        name : name,
                        value : name === "Report Path" ?
                                    ev.target.value : 
                                name === "Description" ?
                                    ev.target.value :
                                name === "Module" ?
                                    ev :
                                name === "Type" ?
                                    ev :
                                name === "Detail Report" ?
                                    ev :
                                name === "Data Source" ? 
                                    ev : 
                                    ev.target.checked === true ? "Y" : "N"
                    }
                );
            } else {
                if (ev?.target?.value === "" || ev === "") {
                    arr.splice(ind, 1);
                } else {
                    arr[ind].value = name === "Report Path" ?
                                        ev.target.value : 
                                    name === "Description" ?
                                        ev.target.value :
                                    name === "Module" ?
                                        ev :
                                    name === "Type" ?
                                        ev :
                                    name === "Detail Report" ?
                                        ev :
                                    name === "Data Source" ? 
                                        ev : 
                                        ev.target.checked === true ? "Y" : "N"
                };
            };
        }
        setSettingsData(arr);
    };

    const onPublish = async () => {
        setLoading(true);
        if (name !== "") {
            let filtersChangedData = [];
            savedFiltersData.map(filters => {
                let filterObj = {
                    id: null,
                    clientId: filtersClientId !== "" ? filtersClientId : userData.cs_client_id,
                    isactive: "N",
                    reportId: filtersReportId !== "" ? filtersReportId : null,
                    displayName: null,
                    columnName: null,
                    type: null,
                    seqNo: null,
                    mandatory: "N",
                    isForPrompting: "N",
                    dependentId: null,
                    dependentName: null,
                    fkTableId: null,
                    fkTableName: null,
                    fkIdentifierId: null,
                    fkIdentifierName: null,
                    fkPrimarykeyId: null,
                    fkPrimarykeyName: null,
                    nt_reference_id: null,
                    nt_reference_name: null,
                    whereclause: null,
                    defaultValueExpression: null
                };
                for (let index2 = 0; index2 < filters.length; index2++) {
                    if (filters[index2].name === "Display Name") {
                        filterObj.displayName = filters[index2].value;
                    } else if (filters[index2].name === "Column Name") {
                        filterObj.columnName = filters[index2].value;
                    } else if (filters[index2].name === "Type") {
                        filterObj.type = filters[index2].value;
                    } else if (filters[index2].name === "Sequence No") {
                        filterObj.seqNo = filters[index2].value;
                    } else if (filters[index2].name === "Dependent") {
                        filterObj.dependentId = dependentData.length > 0 ? (dependentData.find(data => data.name === filters[index2].value)?.id !== undefined ? dependentData.find(data => data.name === filters[index2].value)?.id : null) : null ;
                        filterObj.dependentName = dependentData.length > 0 ? (dependentData.find(data => data.name === filters[index2].value)?.name !== undefined ? dependentData.find(data => data.name === filters[index2].value)?.name : null) : null ;
                    } else if (filters[index2].name === "FK Table") {
                        filterObj.fkTableId = fkTableData.length > 0 ? (fkTableData.find(data => data.name === filters[index2].value)?.id !== undefined ? fkTableData.find(data => data.name === filters[index2].value)?.id : null) : null ;
                        filterObj.fkTableName = fkTableData.length > 0 ? (fkTableData.find(data => data.name === filters[index2].value)?.name !== undefined ? fkTableData.find(data => data.name === filters[index2].value)?.name : null) : null ;
                    } else if (filters[index2].name === "FK Identifier") {
                        let ids = [], names = [];
                        if (fkIdentifierData.length > 0) {
                            filters[index2].value.forEach(item => {
                                if (fkIdentifierData.find(data => data.name === item)?.id !== undefined) {
                                    ids.push(fkIdentifierData.find(data => data.name === item)?.id);
                                }
                                if (fkIdentifierData.find(data => data.name === item)?.name !== undefined) {
                                    names.push(fkIdentifierData.find(data => data.name === item)?.name);
                                }
                            })
                        };
                        if (ids.length > 0) {
                            filterObj.fkIdentifierId = ids.toString();
                            filterObj.fkIdentifierName = names.toString();
                        };
                        // filterObj.fkIdentifierId = fkIdentifierData.length > 0 ? (fkIdentifierData.find(data => data.name === filters[index2].value)?.id !== undefined ? fkIdentifierData.find(data => data.name === filters[index2].value)?.id : null) : null ;
                        // filterObj.fkIdentifierName = fkIdentifierData.length > 0 ? (fkIdentifierData.find(data => data.name === filters[index2].value)?.name !== undefined ? fkIdentifierData.find(data => data.name === filters[index2].value)?.name : null) : null ;
                    } else if (filters[index2].name === "FK PrimaryKey") {
                        filterObj.fkPrimarykeyId = fkPrimaryKeyData.length > 0 ? (fkPrimaryKeyData.find(data => data.name === filters[index2].value)?.id !== undefined ? fkPrimaryKeyData.find(data => data.name === filters[index2].value)?.id : null) : null ;
                        filterObj.fkPrimarykeyName = fkPrimaryKeyData.length > 0 ? (fkPrimaryKeyData.find(data => data.name === filters[index2].value)?.name !== undefined ? fkPrimaryKeyData.find(data => data.name === filters[index2].value)?.name : null) : null ;
                    } else if (filters[index2].name === "Reference") {
                        filterObj.nt_reference_id = referenceData.length > 0 ? (referenceData.find(data => data.name === filters[index2].value)?.id !== undefined ? referenceData.find(data => data.name === filters[index2].value)?.id : null) : null ;
                        filterObj.nt_reference_name = referenceData.length > 0 ? (referenceData.find(data => data.name === filters[index2].value)?.name !== undefined ? referenceData.find(data => data.name === filters[index2].value)?.name : null) : null ;
                    } else if (filters[index2].name === "Where Clause") {
                        filterObj.whereclause = filters[index2].value;
                    } else if (filters[index2].name === "Default Value Expression") {
                        filterObj.defaultValueExpression = filters[index2].value;
                    } else if (filters[index2].name === "Active") {
                        filterObj.isactive = filters[index2].value;
                    } else if (filters[index2].name === "Is For Prompting") {
                        filterObj.isForPrompting = filters[index2].value;
                    } else if (filters[index2].name === "Mandatory") {
                        filterObj.mandatory = filters[index2].value;
                    } else if (filters[index2].name === "id") {
                        filterObj.id= filters[index2].value;
                    }
                };
                filtersChangedData.push(filterObj);
            });

            let fieldsChangedData = [];
            savedFieldsData.map(fields => {
                let fieldObj = {
                    id: null,
                    clientId: fieldsClientId !== "" ? fieldsClientId : userData.cs_client_id,
                    isactive: "N",
                    reportId: fieldsReportId !== "" ? fieldsReportId : null,
                    displayName: null,
                    fieldName: null,
                    type: null,
                    sequence_no: null,
                    gridlength: null,
                    drillDown: "N",
                    detailReportId: null,
                    detailReportName: null,
                    currencyFieldId: null,
                    currencyFieldName: null,
                    enablesummary: "N",
                    nt_reference_id: null,
                    nt_reference_name: null,
                    enablenavigation: "N",
                    navigation_field_id: null,
                    navigation_field_name: null,
                    navigation_window_id: null,
                    navigation_window_name: null
                };
                for (let index2 = 0; index2 < fields.length; index2++) {
                    if (fields[index2].name === "Display Name") {
                        fieldObj.displayName = fields[index2].value;
                    } else if (fields[index2].name === "Field Name") {
                        fieldObj.fieldName = fields[index2].value;
                    } else if (fields[index2].name === "Type") {
                        fieldObj.type = fields[index2].value;
                    } else if (fields[index2].name === "Sequence No") {
                        fieldObj.sequence_no = fields[index2].value;
                    } else if (fields[index2].name === "Grid Length") {
                        fieldObj.gridlength = fields[index2].value;
                    } else if (fields[index2].name === "Active") {
                        fieldObj.isactive = fields[index2].value;
                    } else if (fields[index2].name === "Enable Summary") {
                        fieldObj.enablesummary = fields[index2].value;
                    } else if (fields[index2].name === "Enable Navigation") {
                        fieldObj.enablenavigation = fields[index2].value;
                    } else if (fields[index2].name === "Reference") {
                        fieldObj.nt_reference_id = fieldsReferenceData.length > 0 ? (fieldsReferenceData.find(data => data.name === fields[index2].value)?.id !== undefined ? fieldsReferenceData.find(data => data.name === fields[index2].value)?.id : null) : null;
                        fieldObj.nt_reference_name = fieldsReferenceData.length > 0 ? (fieldsReferenceData.find(data => data.name === fields[index2].value)?.name !== undefined ? fieldsReferenceData.find(data => data.name === fields[index2].value)?.name : null) : null;
                    } else if (fields[index2].name === "Detail Report") {
                        fieldObj.detailReportId = fieldsDetailReportData.length > 0 ? (fieldsDetailReportData.find(data => data.name === fields[index2].value)?.recordid !== undefined ? fieldsDetailReportData.find(data => data.name === fields[index2].value)?.recordid : null) : null;
                        fieldObj.detailReportName = fieldsDetailReportData.length > 0 ? (fieldsDetailReportData.find(data => data.name === fields[index2].value)?.name !== undefined ? fieldsDetailReportData.find(data => data.name === fields[index2].value)?.name : null) : null;
                    } else if (fields[index2].name === "Currency Field") {
                        fieldObj.currencyFieldId = currencyFieldData.length > 0 ? (currencyFieldData.find(data => data.name === fields[index2].value)?.id !== undefined ? currencyFieldData.find(data => data.name === fields[index2].value)?.id : null) : null;
                        fieldObj.currencyFieldName = currencyFieldData.length > 0 ? (currencyFieldData.find(data => data.name === fields[index2].value)?.name !== undefined ? currencyFieldData.find(data => data.name === fields[index2].value)?.name : null) : null;
                    } else if (fields[index2].name === "Navigation Window") {
                        fieldObj.navigation_window_id = navigationWindowData.length > 0 ? (navigationWindowData.find(data => data.name === fields[index2].value)?.id !== undefined ? navigationWindowData.find(data => data.name === fields[index2].value)?.id : null) : null;
                        fieldObj.navigation_window_name = navigationWindowData.length > 0 ? (navigationWindowData.find(data => data.name === fields[index2].value)?.name !== undefined ? navigationWindowData.find(data => data.name === fields[index2].value)?.name : null) : null;
                    } else if (fields[index2].name === "Navigation Field") {
                        fieldObj.navigation_field_id = navigationFieldData.length > 0 ? (navigationFieldData.find(data => data.name === fields[index2].value)?.id !== undefined ? navigationFieldData.find(data => data.name === fields[index2].value)?.id : null) : null;
                        fieldObj.navigation_field_name = navigationFieldData.length > 0 ? (navigationFieldData.find(data => data.name === fields[index2].value)?.name !== undefined ? navigationFieldData.find(data => data.name === fields[index2].value)?.name : null) : null;
                    } else if (fields[index2].name === "id") {
                        fieldObj.id = fields[index2].value;
                    }
                };
                fieldsChangedData.push(fieldObj);
            });

            let settingsChangedData = [];

            settingsChangedData.push(
                {
                    id: settingsId !== "" ? settingsId : null,
                    type: settingsData.find(data => data.name === "Type")?.value ? settingsData.find(data => data.name === "Type")?.value : null,
                    enableautorun: settingsData.find(data => data.name === "Enable AutoRun")?.value === "Y" ? "Y" : "N",
                    enabledownload: settingsData.find(data => data.name === "Enable Download")?.value === "Y" ? "Y" : "N",
                    enablenestedtable: settingsData.find(data => data.name === "Enable Nested")?.value === "Y" ? "Y" : "N",
                    enabledateoptions: settingsData.find(data => data.name === "Enable Date Options")?.value === "Y" ? "Y" : "N",
                    enablepivot: settingsData.find(data => data.name === "Enable Pivot")?.value === "Y" ? "Y" : "N",
                    isactive: settingsData.find(data => data.name === "Active")?.value === "Y" ? "Y" : "N",
                    detail_report_id: detailReportData.length > 0 ? (detailReportData.find(data => data.name === settingsData.find(data => data.name === "Detail Report")?.value)?.recordid) : null,
                    detail_report_name: detailReportData.length > 0 ? (detailReportData.find(data => data.name === settingsData.find(data => data.name === "Detail Report")?.value)?.name) : null,
                    datasourceId: dataSourceData.length > 0 ? (dataSourceData.find(data => data.name === settingsData.find(data => data.name === "Data Source")?.value)?.id) : null,
                    datasourceName: dataSourceData.length > 0 ? (dataSourceData.find(data => data.name === settingsData.find(data => data.name === "Data Source")?.value)?.name) : null,
                    reportpath: settingsData.find(data => data.name === "Report Path")?.value ? settingsData.find(data => data.name === "Report Path")?.value : null,
                    moduleId: moduleData.length > 0 ? (moduleData.find(data => data.name === settingsData.find(data => data.name === "Module")?.value)?.recordid) : null,
                    moduleName: moduleData.length > 0 ? (moduleData.find(data => data.name === settingsData.find(data => data.name === "Module")?.value)?.name) : null,
                    description: settingsData.find(data => data.name === "Description")?.value ? settingsData.find(data => data.name === "Description")?.value : null
                }
            );

            let queryData = null;

            if (query !== undefined && query !== null) {
                const doubleQuoteForDesc = query.replace(/\r?\n|\r/g, '\\n');
                queryData = doubleQuoteForDesc.replace(/"/g, '\\"');
            };
            
            const publishJson = {
                nt_report_id : ntReportId !== "" ? ntReportId : null,
                name : name,
                report_id : mainReportId !== "" ? mainReportId : null,
                Filters: filtersChangedData,
                Fields: fieldsChangedData,
                query: {
                    id : queryId !== "" ? queryId : null,
                    clientId : queryClientId !== "" ? queryClientId : userData.cs_client_id,
                    reportId : queryReportId !== "" ? queryReportId : null,
                    query: queryData
                },
                Settings: settingsChangedData
            };

            const updateData = await publishData(JSON.stringify(JSON.stringify(publishJson)));

            if (updateData.messageCode === "200") {
                setLoading(false);
                message.success(updateData.message);
                history.push(`/others/window/7464/${JSON.parse(updateData.data).reportId}`);
            } else {
                setLoading(false);
                message.error(updateData.message);
            };
        } else {
            setLoading(false);
            message.warning("Please give a name for Report");
        };
    };

    const handleFiltersOk = () => {
        let arr = [...savedFiltersData];
        arr.splice(filtersModalIndex, 1);
        setSavedFiltersData(arr);
        setFiltersMainIndex(arr.length);
        setVisibleFiltersModal(false);
    };
    
    const handleFiltersCancel = () => {
        setVisibleFiltersModal(false);
    };

    const handleFieldsOk = () => {
        let arr = [...savedFieldsData];
        arr.splice(fieldsModalIndex, 1);
        setSavedFieldsData(arr);
        setFieldsMainIndex(arr.length);
        setVisibleFieldsModal(false);
    };
    
    const handleFieldsCancel = () => {
        setVisibleFieldsModal(false);
    };

    const getEditedData=(filter)=>{
        if(isFlag){
            setHoverIn(filter)
        }else{
            setHoverIn({})
        }
    }

    const getFieldEdit=(field)=>{
        if(isFlag1){
            setHoverField(field)
        }else{
            setHoverField({})
        }
    }

    return (
        <div style={{height:'89vh', overflow:'auto'}}>
            {/* <Steps enabled={enabled}
            steps={Obj.steps}
            initialStep={0}
            onExit={onExit}/>
            <Hints enabled={hintsEnabled} hints={Obj.hints} /> */}
            <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />} spinning={loading}>
                <Row >
                    <Col span={12}>
                        <div style={{ display: "flex" }} onMouseOver={()=>{setIsVisible(true)}} onMouseOut={()=>{setIsVisible(false)}}>
                            <span id="help" onClick={() => { history.push(`/others/window/7464`); }} style={{ fontSize: "15px",color: "#1648AA",cursor:'pointer' }}>
                                Reports&nbsp;&nbsp;
                            </span>
                        <EditFilled style={{ marginTop: "0.5%",display:isVisible?true:"none",marginRight:"1.5%"}} onClick={() => { setNameFlag(true) }} />
                            {nameFlag === true ? null :<span id="about" style={{ fontWeight: "500", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px",marginRight:'5px'}} onMouseOver={()=>{setIsVisible(true)}} onMouseOut={()=>{setIsVisible(false)}}>/&nbsp;&nbsp;{name}</span>}
                        </div>
                        {nameFlag === true ?<Input value={name} onChange={(ev) => { setName(ev.target.value); }} onPressEnter={() => { setNameFlag(false); }} style={{ marginBottom: "0px", marginTop: "-1%", width: 400 }}/> :null}
                    </Col>
                    <Col span={12}>
                        <span style={{ float: "right" }}>
                        {/* <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" ,marginRight:'12px'}} onClick={getData1}>
                                Click
                            </Button> */}
                            <Button id="contact" style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={onPublish}>
                                Publish
                            </Button>
                        </span>
                    </Col>
                </Row>
                <Row style={{ height: "640px", backgroundColor: "white" }}>
                    <Col span={4} style={{ marginTop: "8px" }}>
                            <Row>
                                <Col span={17} style={{ marginTop: "5px" , marginLeft: "6px",paddingLeft:'5px' }}>
                                    <span style={{ fontWeight: 600, fontSize: "16px",color:'#666666' }}>Filters</span>
                                </Col>
                                <Col span={4} style={{paddingLeft:'-5px'}}>
                                    <Popover placement="rightTop" content={filtersContent} trigger="click" visible={newFiltersVisible} onVisibleChange={handleNewFiltersVisible}>
                                        <Button style={{ backgroundColor: "#E3E3E3", border : "#EBEBEB",borderRadius:'3px',height:'30px',width:'20px'  }} ><PlusOutlined style={{color:'#666666',marginLeft:'-6px'}}/></Button>
                                    </Popover>
                                </Col>
                            </Row>
                            <br />
                            <Scrollbars
                                    autoHide
                                    autoHideTimeout={1000}
                                    autoHideDuration={200}
                                    thumbSize={100}
                                    renderThumbHorizontal={renderThumbHorizontalScroll}
                                    renderThumbVertical={renderThumb}
                                    style={{ height: "580px" }}
                            >
                                {filtersFlag === true && savedFiltersData.length > 0 ?
                                    savedFiltersData.map((savedFilter, index) => {
                                        return (
                                            savedFilter.map(filter => {
                                                return (
                                                    <>
                                                        {filter.name === "Display Name" ?
                                                            <>
                                                                <Row style={{paddingLeft:'5px',backgroundColor: hoverIn.value === filter.value ? "#E3E3E3" : null,paddingTop:'5px',paddingBottom:'7px'}} onMouseOver={()=>{setHoverIn(filter)}} onMouseOut={()=>{getEditedData(filter)}}>
                                                                    <Col span={17} style={{ marginTop: "5px", marginLeft: "6px" }}>
                                                                        <span style={{ fontWeight: 400, fontSize: "14px" }}>{filter.value?.length > 15 ? filter.value.slice(0, 15).concat('...') : filter.value}</span>
                                                                    </Col>
                                                                    <Col span={2} style={{ marginTop: "5px"}} onClick={()=>{setIsFlag(true)}}><EditOutlined style={{ fontSize: "16px",color:'#666666' ,cursor:"pointer",visibility: hoverIn.value === filter.value ?"visible" : "hidden"}} onClick={handleEditFilters(savedFilter, index)} /> </Col>
                                                                    &nbsp;
                                                                    &nbsp;
                                                                    <Col span={2} style={{ marginTop: "5px" }} onClick={()=>{setIsFlag(true)}}><DeleteOutlined style={{ fontSize: "16px",color:'#666666',cursor:"pointer",visibility: hoverIn.value === filter.value ?"visible" : "hidden"  }} onClick={handleDeleteFilters(index)} /></Col>
                                                                </Row>
                                                            </> :
                                                            ""
                                                        }
                                                    </>
                                                )
                                            })
                                        )
                                    }) :
                                    ""
                                }
                            </Scrollbars>
                    </Col>
                    <Col span={16} style={{ backgroundColor: "#F5F5F5" }}>
                        <Tabs defaultActiveKey="1" centered style={{ marginTop: "-45px" }}>
                            <TabPane tab="Query" key="1" style={{ border: "#F5F5F5",marginTop:'-7px' }} >
                                <Row>
                                    <Col span={20} style={{ marginLeft: "16px" }}>
                                        <TextArea style={{ height: 200 }} value={query} onChange={handleQuery} />
                                    </Col>
                                    <Col span={1}/>
                                    <Col span={2} >
                                        <Popconfirm
                                            title="Are you sure u want to edit Fields?"
                                            onConfirm={confirm}
                                            onCancel={cancel}
                                            okText="Yes"
                                            cancelText="No"
                                            visible={visiblePopconfirm}
                                            placement="bottom"
                                        >
                                            {runFlag === true ?
                                                <Button style={{ backgroundColor: "#E3E3E3", border : "#EBEBEB",borderRadius:'3px',height:'30px',width:'20px',float:'right' }} onClick={handleRun}><CaretRightOutlined style={{color:'#666666',marginLeft:'-6px'}}/></Button> :
                                                ""
                                            }
                                        </Popconfirm>
                                    </Col>
                                </Row>
                                <br />
                                <Row style={{ marginLeft: "10px", marginRight: "10px" }}>
                                    {displayTableFlag === true ?
                                        <Table
                                            size="small"
                                            scroll={{ x:"100%", y: "47.5vh" }}
                                            pagination={false}
                                            dataSource={rowData}
                                            columns={columnData}
                                        /> :
                                        ""
                                    }
                                </Row>
                            </TabPane>
                            <TabPane tab="Settings" key="2" style={{ border: "#F5F5F5" }}>
                                <Row style={{ marginLeft: "50px"}}>
                                    <Col span={11}>
                                        Module
                                        <br />
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            style={{ width: 300 }}
                                            onClick={handleModuleData}
                                            value={settingsData.find(data => data.name === "Module")?.value}
                                            onChange={handleSettingsData("Module")}
                                        >
                                            {moduleData.map(data => {
                                                return (
                                                    <Option value={data.name} key={data.name}>{data.name}</Option>
                                                )
                                            })}
                                        </Select>
                                    </Col>
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;
                                    <Col span={11}>
                                        Type
                                        <br />
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            value={settingsData.find(data => data.name === "Type")?.value}
                                            onChange={handleSettingsData("Type")}
                                            style={{ width: 300 }}
                                        >
                                            <Option value="Standard">Standard</Option>
                                            <Option value="Jasper">Jasper</Option>
                                        </Select>
                                    </Col>
                                </Row>
                                <br />
                                <Row style={{ marginLeft: "50px"}}>
                                    <Col span={23}>
                                        <Checkbox style={{color:"#666666"}} checked={settingsData.find(data => data.name === "Enable Date Options")?.value === "Y" ? true : false} onChange={handleSettingsData("Enable Date Options")}> Enable Date Options</Checkbox>
                                    </Col>
                                </Row>
                                <br />
                                <Row style={{ marginLeft: "50px"}}>
                                    <Col span={23}>
                                        <Checkbox style={{color:"#666666"}} checked={settingsData.find(data => data.name === "Enable Download")?.value === "Y" ? true : false} onChange={handleSettingsData("Enable Download")}> Enable Download</Checkbox>
                                    </Col>
                                </Row>
                                <br />
                                <Row style={{ marginLeft: "50px"}}>
                                    <Col span={23}>
                                        <Checkbox style={{color:"#666666"}} checked={settingsData.find(data => data.name === "Enable Pivot")?.value === "Y" ? true : false} onChange={handleSettingsData("Enable Pivot")}> Enable Pivot</Checkbox>
                                    </Col>
                                </Row>
                                <br />
                                <Row style={{ marginLeft: "50px"}}>
                                    <Col span={23}>
                                        <Checkbox style={{color:"#666666"}} checked={settingsData.find(data => data.name === "Enable AutoRun")?.value === "Y" ? true : false} onChange={handleSettingsData("Enable AutoRun")}> Enable AutoRun</Checkbox>
                                    </Col>
                                </Row>
                                <br />
                                <Row style={{ marginLeft: "50px"}}>
                                    <Col span={23}>
                                        <Checkbox style={{color:"#666666"}} checked={settingsData.find(data => data.name === "Enable Nested")?.value === "Y" ? true : false} onChange={handleSettingsData("Enable Nested")}> Enable Nested</Checkbox>
                                    </Col>
                                </Row>
                                <Row style={{ marginLeft: "50px",marginTop:'10px'}}>
                                    <Col span={11}>
                                        Data Source
                                        <br />
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            value={settingsData.find(data => data.name === "Data Source")?.value}
                                            onChange={handleSettingsData("Data Source")}
                                            style={{ width: 300 }}
                                            onClick={handleDataSourceData}
                                        >
                                           {dataSourceData.map(data => {
                                                return (
                                                    <Option value={data.name} key={data.name}>{data.name}</Option>
                                                )
                                            })} 
                                        </Select>
                                    </Col>
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;
                                    <Col span={11}>
                                        Detail Report
                                        <br />
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            value={settingsData.find(data => data.name === "Detail Report")?.value}
                                            onChange={handleSettingsData("Detail Report")}
                                            style={{ width: 300 }}
                                            onClick={handleDetailReportData}
                                        >
                                            {detailReportData.map(data => {
                                                return (
                                                    <Option value={data.name} key={data.name}>{data.name}</Option>
                                                )
                                            })}
                                        </Select>
                                    </Col>
                                </Row>
                                <br />
                                <Row style={{ marginLeft: "50px"}}>
                                    <Col span={23}>
                                        Report Path
                                        <br />
                                        <Input 
                                            value={settingsData.find(data => data.name === "Report Path")?.value}
                                            onChange={handleSettingsData("Report Path")} 
                                            style={{ width: 620 }}
                                        />
                                    </Col>
                                </Row>
                                <br />
                                <Row style={{ marginLeft: "50px"}}>
                                    <Col span={23}>
                                        Description
                                        <br />
                                        <TextArea
                                            value={settingsData.find(data => data.name === "Description")?.value}
                                            onChange={handleSettingsData("Description")}
                                            style={{ width: 620, height: 80 }}
                                        />
                                    </Col>
                                </Row>
                                <br />
                                <Row style={{ marginLeft: "50px"}}>
                                    <Col span={23}>
                                        <Checkbox style={{color:"#666666"}} checked={settingsData.find(data => data.name === "Active")?.value === "Y" ? true : false} onChange={handleSettingsData("Enable Nested")}> Active</Checkbox>
                                    </Col>
                                </Row>
                            </TabPane>
                        </Tabs>
                    </Col>
                    <Col span={4} style={{ marginTop: "8px" }}>
                            <Row>
                                <Col span={17} style={{ marginTop: "5px" , marginLeft: "6px" ,paddingLeft:'5px'}}>
                                    <span style={{ fontWeight: 600, fontSize: "16px",color:'#666666' }}>Fields</span>
                                </Col>
                                <Col span={4} style={{paddingRight:'-5px'}}>
                                    <Popover placement="leftTop" content={fieldsContent} trigger="click" visible={newFieldsVisible} onVisibleChange={handleNewFieldsVisible}>
                                        <Button style={{ backgroundColor: "#E3E3E3", marginRight: "5px", border : "#EBEBEB",borderRadius:'3px',height:'30px',width:'20px'  }}><PlusOutlined style={{color:'#666666',marginLeft:'-6px'}}/></Button>
                                    </Popover>
                                </Col>
                            </Row>
                            <br />
                            <Scrollbars
                                autoHide
                                autoHideTimeout={1000}
                                autoHideDuration={200}
                                thumbSize={100}
                                renderThumbHorizontal={renderThumbHorizontalScroll}
                                renderThumbVertical={renderThumb}
                                style={{ height: "580px" }}
                            >
                                {fieldsFlag === true && savedFieldsData.length > 0 ?
                                    savedFieldsData.map((savedField, index) => {
                                        return (
                                            savedField.map(field => {
                                                return (
                                                    <>
                                                        {field.name === "Display Name" ?
                                                            <>
                                                                <Row style={{paddingLeft:'5px',backgroundColor: hoverField.value === field.value ? "#E3E3E3" : null,paddingTop:'5px',paddingBottom:'7px'}} onMouseOver={()=>{setHoverField(field)}} onMouseOut={()=>{getFieldEdit(field)}}>
                                                                    <Col span={17} style={{ marginTop: "5px", marginLeft: "6px" }}>
                                                                        <span style={{ fontWeight: 400, fontSize: "14px" }}>{field.value?.length > 15 ? field.value.slice(0, 15).concat('...') : field.value}</span>
                                                                    </Col>
                                                                    <Col span={2} style={{ marginTop: "5px" }} onClick={()=>{setIsFlag1(true)}}><EditOutlined style={{ fontSize: "16px",color:'#666666', cursor: "pointer",visibility:hoverField.value === field.value ? "visible" : "hidden" }} onClick={handleEditFields(savedField, index)} /></Col>
                                                                    &nbsp;
                                                                    &nbsp;
                                                                    <Col span={2} style={{ marginTop: "5px" }} onClick={()=>{setIsFlag1(true)}}><DeleteOutlined style={{ fontSize: "16px",color:'#666666', cursor: "pointer",visibility:hoverField.value === field.value ? "visible" : "hidden"}} onClick={handleDeleteFields(index)} /></Col>
                                                                </Row>
                                                                <br />
                                                            </> :
                                                            ""
                                                        }
                                                    </>
                                                )
                                            })
                                        )
                                    }) :
                                    ""
                                }
                            </Scrollbars>
                    </Col>
                </Row>
                <Modal
                    visible={visibleFiltersModal}
                    onOk={handleFiltersOk}
                    onCancel={handleFiltersCancel}
                    footer={[
                        <Button key="back" onClick={handleFiltersCancel}>
                          
                        </Button>,
                        <Button key="submit" onClick={handleFiltersOk}>
                          Delete
                        </Button>
                    ]}
                >
                    Are you sure you want to Delete Filters
                </Modal>
                <Modal
                    visible={visibleFieldsModal}
                    onOk={handleFieldsOk}
                    onCancel={handleFieldsCancel}
                    footer={[
                        <Button key="back" onClick={handleFieldsCancel}>
                          
                        </Button>,
                        <Button key="submit" onClick={handleFieldsOk}>
                          Delete
                        </Button>
                    ]}
                >
                    Are you sure you want to Delete Fields
                </Modal>
            </Spin>
        </div>
    )
};

export default NewReport;