import React, { useEffect, useState } from "react";
import { Row, Col, Button, Popover, Select, Input, Tabs, Spin, message, Modal, Checkbox, DatePicker, Form, Space, InputNumber } from "antd";
import { PlusOutlined, EyeOutlined, LoadingOutlined, EditFilled, SaveOutlined, PlaySquareOutlined, CalendarOutlined, MinusCircleOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Scrollbars } from "react-custom-scrollbars";
import { useHistory } from "react-router";
import { getTaskDetails, scheduleData, saveData, upsertScheduleData } from "../../../services/genericForCustom";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../../lib/storage";
import moment from 'moment';
import ThemeJson from "../../../constants/UIServer.json"

const { TabPane } = Tabs;
const { Option } = Select;

let childrenDate = [];
childrenDate.push(<Option key="startDate">startDate</Option>,<Option key="endDate">endDate</Option>);

const NewTask = () => {
    // const userData = JSON.parse(localStorage.getItem("userData"));
    const history = useHistory();
    const [name, setName] = useState("");
    const [nameFlag, setNameFlag] = useState(false);
    const [mainReportId, setMainReportId] = useState("");
    const [dagSchedulerId, setDagSchedulerId] = useState("");
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
    const [settingsData, setSettingsData] = useState([]);
    const [visibleFiltersModal, setVisibleFiltersModal] = useState(false);
    const [visibleFieldsModal, setVisibleFieldsModal] = useState(false);
    const [popFilterFlag, setPopFilterFlag] = useState(false);
    const [popFieldFlag, setPopFieldFlag] = useState(false);
    const [filtersModalIndex, setFiltersModalIndex] = useState("");
    const [fieldsModalIndex, setFieldsModalIndex] = useState("");
    const [flowFlag, setFlowFlag] = useState(false);
    const [eyeFlag, setEyeFlag] = useState(false);
    const [dagUrl, setDagUrl] = useState('');
    const [runFlag, setRunFlag] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState(""); 
    const [scheduleFlag, setScheduleFlag] = useState(false);
    const [frequency, setFrequency] = useState("");
    const [startDate, setStartDate] = useState("");
    const [indexes, setIndexes] = useState([]);
    const [jsonValues, setJsonValues] = useState([]);
    const { taskId } = useParams();
    const dateFormat = 'YYYY-MM-DD';
    const { TextArea } = Input;
    const { globalStore } = useGlobalContext();
    const Themes = ThemeJson;
    const [form] = Form.useForm();

    useEffect(async() => {
        setLoading(true);
        if (taskId !== "newTask") {
            setLoading(false);
            const serverResponse = await getTaskDetails(taskId);
            if (serverResponse) {
                const data = serverResponse;
                setDagUrl(data.dagUrl);
                const loopData = JSON.parse(data.paramsJson);
                setName(data.name);
                setMainReportId(data.csDWTaskId);
                if (data.csDagTaskScheduler.startDate !== null) {
                    setDagSchedulerId(data.csDagTaskScheduler.cSDagTaskSchedulerId);
                    setFrequency(data.csDagTaskScheduler.frequency);
                    let date = data.csDagTaskScheduler.startDate.split(" ");
                    setStartDate(date[0]);
                    const jsonData = JSON.parse(data.csDagTaskScheduler.scheduleinfo).paramsJson;
                    let arr1 = [], arr2 = [];
                    jsonData.map((item, index) => {
                        let splitArr = item[Object.keys(item)[0]].split("-");
                        if (splitArr.length === 2) {
                            arr1.push({
                                date: [Object.keys(item)[0]],
                                day: splitArr[0],
                                days: splitArr[1]
                            });
                            arr2.push(index);
                        } else {
                            arr1.push({
                                date: [Object.keys(item)[0]],
                                day: splitArr[0]
                            });
                        };
                    });
                    form.setFieldsValue({ dates : arr1});
                    setJsonValues(arr1);
                    setIndexes(arr2);
                }
                let finalFilters = [];
                for (let index = 0; index < loopData.Filters?.length; index++) {
                    let arr = [];
                    arr.push(
                        {
                            name: "Display Name",
                            value: loopData.Filters[index]?.displayName !== undefined ? loopData.Filters[index]?.displayName : null
                        },
                        {
                            name: "Column Name",
                            value: loopData.Filters[index]?.columnName !== undefined ? loopData.Filters[index]?.columnName : null
                        },
                        {
                            name: "Type",
                            value: loopData.Filters[index]?.type !== undefined ? loopData.Filters[index]?.type : null
                        }
                    );
                    finalFilters.push(arr);
                };
                setFiltersFlag(true);
                setSavedFiltersData(finalFilters);
                if (loopData.Filters !== undefined) {
                    setFiltersMainIndex(loopData.Filters.length);
                }
                let finalFields = [];
                for (let index = 0; index < loopData.Fields?.length; index++) {
                    let arr = [];
                    arr.push(
                        {
                            name: "Display Name",
                            value: loopData.Fields[index]?.displayName !== undefined ? loopData.Fields[index]?.displayName : null
                        },
                        {
                            name: "Field Name",
                            value: loopData.Fields[index]?.fieldName !== undefined ? loopData.Fields[index]?.fieldName : null
                        },
                        {
                            name: "Type",
                            value: loopData.Fields[index]?.type !== undefined ? loopData.Fields[index]?.type : null
                        }
                    );
                    finalFields.push(arr);
                };
                setFieldsFlag(true);
                setSavedFieldsData(finalFields);
                if (loopData.Fields !== undefined) {
                    setFieldsMainIndex(loopData.Fields.length);
                }
                setQuery(loopData.query);
                let finalSettings = [];
                finalSettings.push(
                    {
                        name: "DagName",
                        value: loopData.Settings[0]?.dagName !== undefined ? loopData.Settings[0]?.dagName : null 
                    },
                    {
                        name: "TableName",
                        value: loopData.Settings[0]?.tableName !== undefined ? loopData.Settings[0]?.tableName : null 
                    },
                    {
                        name: "Enable",
                        value: loopData.Settings[0]?.enable !== undefined ? loopData.Settings[0]?.enable : null 
                    }
                );
                setSettingsData(finalSettings);
                // if (data.query.length > 0) {
                //     const queryData = data.query[0]?.query.replace( /\r?\n|\r/g,'\\n');
                //     const changedQueryData = queryData.replace(/"/g, '\\"');
                //     setQuery(changedQueryData);
                // } else {
                //     if (data.query?.query !== null) {
                //         const queryData = data.query?.query.replace( /\r?\n|\r/g,'\\n');
                //         const changedQueryData = queryData.replace(/"/g, '\\"');
                //         setQuery(changedQueryData);
                //     }
                // };
                setLoading(false);
            };
        } else {
            setLoading(false);
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
        }
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
        }
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

    const handleFiltersChange = (name, type) => (ev) => {
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
        let displayFlag = "N", columnFlag = "N", typeFlag = "N";
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
        });
        if (displayFlag === "N" || columnFlag === "N" || typeFlag === "N") {
            message.warning("Dispaly Name, Column Name, Type are mandatory");
        } else {
            setNewFiltersVisible(false);
            setSavedFiltersDataToShow([]);
            setFiltersMainIndex(filtersMainIndex + 1);
            setFiltersFlag(true);
        };
    };

    const handleEditFilters = (savedFilters, ind) => () => {
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
        <div style={{width : 700}}>
            <Row>
                <Col span={24}>
                    <div style={{ fontWeight: 600, fontSize: "16px", textAlign: "center" }}>New Filter</div>
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
                        {filtersData.map(filters => {
                            if (filters.type === "Dropdown" || filters.type === "String" || filters.type === "Checkbox") {
                                return (
                                    <>
                                        <Col span={12}>
                                            {filters.name}
                                            <br />
                                            {filters.name === "Display Name" ?
                                                <Input
                                                    value={savedFiltersDataToShow.find(filter => filter.name === filters.name)?.value}
                                                    onChange={handleFiltersChange(filters.name, filters.type)}
                                                    style={{ width: 320 }}
                                                /> :
                                            filters.name === "Column Name" ?
                                                <Input
                                                    value={savedFiltersDataToShow.find(filter => filter.name === filters.name)?.value}
                                                    onChange={handleFiltersChange(filters.name, filters.type)}
                                                    style={{ width: 320 }}
                                                /> :
                                            filters.name === "Type" ?
                                                <Select
                                                    showSearch
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    style={{ width: 320 }}
                                                    value={savedFiltersDataToShow.find(filter => filter.name === filters.name)?.value}
                                                    onChange={handleFiltersChange(filters.name, filters.type)}
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
                                filters.type === "Text" ?
                                    <Col span={24}>
                                        {filters.name}
                                        <br />
                                        <TextArea
                                            value={savedFiltersDataToShow.find(filter => filter.name === filters.name)?.value}
                                            style={{ width: 670 }}
                                            onChange={handleFiltersChange(filters.name, filters.type)}
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
                        setNewFiltersVisible(false); setSavedFiltersDataToShow([]); setFiltersFlag(true);         
                        if (popFilterFlag === true) {
                            let arr = [...savedFiltersData];
                            arr.splice(arr.length-1, 1);
                            setSavedFiltersData(arr);
                            setFiltersMainIndex(arr.length);
                            setPopFilterFlag(false);
                        } else {
                            setFiltersMainIndex(savedFiltersData.length);
                        };
                    }}>
                        Cancel
                    </Button>
                    &nbsp;
                    <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={handleFilters}>
                        Save
                    </Button>
                </div>
            </Row>
        </div>
    );

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
        let displayFlag = "N", fieldFlag = "N", typeFlag = "N";
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
        });
        if (displayFlag === "N" || fieldFlag === "N" || typeFlag === "N") {
            message.warning("Dispaly Name, Field Name, Type are mandatory");
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
                                                {/* <Option value="Date">Date</Option>
                                                <Option value="String">String</Option>
                                                <Option value="Numeric">Numeric</Option>
                                                <Option value="List">List</Option>
                                                <Option value="Amount">Amount</Option>
                                                <Option value="Yes/No">Yes/No</Option>
                                                <Option value="Image">Image</Option>
                                                <Option value="WYSIWYG Editor">WYSIWYG Editor</Option> */}
                                                <Option value="varchar(255)">varchar(255)</Option>
                                                <Option value="int">int</Option>
                                                <Option value="real">real</Option>
                                                <Option value="date">date</Option>
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
                        };
                    }}>
                        Cancel
                    </Button>
                    &nbsp;
                    <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={handleFields}>
                        Save
                    </Button>
                </div>
            </Row>
        </div>
    );

    const handleNewFiltersVisible = () => {
        setNewFiltersVisible(true);
        setPopFilterFlag(true);
    };

    const handleNewFieldsVisible = () => {
        setNewFieldsVisible(true);
        setPopFieldFlag(true);
    };

    const handleQuery = (ev) => {
        setQuery(ev.target.value);
    };

    const handleSettingsData = (name) => (ev) => {
        let arr = [...settingsData];
        if (arr.length === 0) {
            arr.push({
                name : name,
                value : name !== "Enable" ? 
                        ev.target.value : 
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
                        value : name !== "Enable" ? 
                                ev.target.value : 
                                ev.target.checked === true ? "Y" : "N"
                    }
                );
            } else {
                if (ev?.target?.value === "" || ev === "") {
                    arr.splice(ind, 1);
                } else {
                    arr[ind].value = name !== "Enable" ? 
                                     ev.target.value : 
                                     ev.target.checked === true ? "Y" : "N"
                };
            };
        }
        setSettingsData(arr);
    };

    const onSave = async () => {
        setLoading(true);
        if (name !== "") {
            let filtersChangedData = [];
            savedFiltersData.map(filters => {
                let filterObj = {
                    displayName: null,
                    columnName: null,
                    type: null,
                };
                for (let index2 = 0; index2 < filters.length; index2++) {
                    if (filters[index2].name === "Display Name") {
                        filterObj.displayName = filters[index2].value;
                    } else if (filters[index2].name === "Column Name") {
                        filterObj.columnName = filters[index2].value;
                    } else if (filters[index2].name === "Type") {
                        filterObj.type = filters[index2].value;
                    }
                };
                filtersChangedData.push(filterObj);
            });

            let fieldsChangedData = [];
            savedFieldsData.map(fields => {
                let fieldObj = {
                    displayName: null,
                    fieldName: null,
                    type: null
                };
                for (let index2 = 0; index2 < fields.length; index2++) {
                    if (fields[index2].name === "Display Name") {
                        fieldObj.displayName = fields[index2].value;
                    } else if (fields[index2].name === "Field Name") {
                        fieldObj.fieldName = fields[index2].value;
                    } else if (fields[index2].name === "Type") {
                        fieldObj.type = fields[index2].value;
                    }
                };
                fieldsChangedData.push(fieldObj);
            });

            let settingsChangedData = [];

            settingsChangedData.push(
                {
                    dagName: settingsData.find(data => data.name === "DagName")?.value ? settingsData.find(data => data.name === "DagName")?.value : null,
                    tableName: settingsData.find(data => data.name === "TableName")?.value ? settingsData.find(data => data.name === "TableName")?.value : null,
                    enable: settingsData.find(data => data.name === "Enable")?.value === "Y" ? "Y" : "N"
                }
            );

            let queryData = null;
            let confirmQuery = null;

            if (query !== undefined && query !== null) {
                // const doubleQuoteForDesc = query.replace(/\r?\n|\r/g, '\\n');
                // queryData = doubleQuoteForDesc.replace(/"/g, '\\"');
                queryData = query.split('\n').join(' ');
                confirmQuery = queryData.split('\\n').join(' ');
            };
            
            const publishJson = {
                Filters: filtersChangedData,
                Fields: fieldsChangedData,
                query: confirmQuery,
                Settings: settingsChangedData
            };

            const updateData = await saveData(JSON.stringify(JSON.stringify(publishJson)), name, mainReportId);
            if (updateData.messageCode === "200") {
                setLoading(false);
                message.success(updateData.message);
                history.push(`/others/window/7484/${mainReportId}`);
            } else {
                setLoading(false);
                message.error(updateData.message);
            };
        } else {
            setLoading(false);
            message.warning("Please give a name for Task");
        };
    };

    const onRun = () => {
        setRunFlag(true);
    };

    const handleRunCancel = () => {
        setRunFlag(false);
    };

    const handleFromDate = (date, dateString) => {
        setFromDate(dateString);
    };

    const handleToDate = (date, dateString) => {
        setToDate(dateString);
    };

    const handleRunOk = async () => {
        if (fromDate !== "" && toDate !== "") {
            setRunFlag(false);
            setLoading(true);
            if (name !== "") {
                let filtersChangedData = [];
                savedFiltersData.map(filters => {
                    let filterObj = {
                        displayName: null,
                        columnName: null,
                        type: null,
                    };
                    for (let index2 = 0; index2 < filters.length; index2++) {
                        if (filters[index2].name === "Display Name") {
                            filterObj.displayName = filters[index2].value;
                        } else if (filters[index2].name === "Column Name") {
                            filterObj.columnName = filters[index2].value;
                        } else if (filters[index2].name === "Type") {
                            filterObj.type = filters[index2].value;
                        }
                    };
                    filtersChangedData.push(filterObj);
                });

                let fieldsChangedData = [];
                savedFieldsData.map(fields => {
                    let fieldObj = {
                        displayName: null,
                        fieldName: null,
                        type: null
                    };
                    for (let index2 = 0; index2 < fields.length; index2++) {
                        if (fields[index2].name === "Display Name") {
                            fieldObj.displayName = fields[index2].value;
                        } else if (fields[index2].name === "Field Name") {
                            fieldObj.fieldName = fields[index2].value;
                        } else if (fields[index2].name === "Type") {
                            fieldObj.type = fields[index2].value;
                        }
                    };
                    fieldsChangedData.push(fieldObj);
                });

                let settingsChangedData = [];

                settingsChangedData.push(
                    {
                        dagName: settingsData.find(data => data.name === "DagName")?.value ? settingsData.find(data => data.name === "DagName")?.value : null,
                        tableName: settingsData.find(data => data.name === "TableName")?.value ? settingsData.find(data => data.name === "TableName")?.value : null,
                        enable: settingsData.find(data => data.name === "Enable")?.value === "Y" ? "Y" : "N"
                    }
                );

                let queryData = null;
                let confirmQuery = null;

                if (query !== undefined && query !== null) {
                    // const doubleQuoteForDesc = query.replace(/\r?\n|\r/g, '\\n');
                    // queryData = doubleQuoteForDesc.replace(/"/g, '\\"');
                    queryData = query.split('\n').join(' ');
                    confirmQuery = queryData.split('\\n').join(' ');
                };
                
                const publishJson = {
                    Filters: filtersChangedData,
                    Fields: fieldsChangedData,
                    query: confirmQuery,
                    Settings: settingsChangedData,
                    startDate: fromDate,
                    endDate: toDate
                };

                const updateData = await scheduleData(JSON.stringify(JSON.stringify(publishJson)), name, mainReportId);
                if (updateData.messageCode === "200") {
                    setLoading(false);
                    message.success(updateData.message);
                    history.push(`/others/window/7484/${mainReportId}`);
                } else {
                    setLoading(false);
                    message.error(updateData.message);
                };
            } else {
                setLoading(false);
                message.warning("Please give a name for Task");
            };
        } else {
            message.warning("Please select Dates");
        };
    };

    const onSchedule = () => {
        setScheduleFlag(true);
    };

    const handleScheduleCancel = () => {
        setScheduleFlag(false);
    };

    const selectTimeLineFilters = (val) => {
        setFrequency(val);
    };

    const handleStartDate = (date, dateString) => {
        setStartDate(dateString);
    };

    const handleJSONValues = (changedFields, allFields) => {
        setJsonValues(allFields.dates);
        let arr = [];
        allFields.dates.map((item, ind) => {
            if (item?.day !== undefined) {
                if (item?.day !== "CD" && item?.day !== "YD") {
                    arr.push(ind);
                };
            };
        });
        setIndexes(arr);
    };

    const handleScheduleOk = async () => {
        if (startDate !== "" && frequency !== "" && jsonValues.length > 0 && jsonValues[0] !== undefined) {
            let arr = [];
            jsonValues.map(item => {
                if (item?.day !== "CD" && item?.day !== "YD") {
                    if (item?.date === undefined || item?.day === undefined || item?.days === undefined || item?.date === null || item?.day === null || item?.days === null) {
                        message.warning("Please give all fields in JSON");
                    } else {
                        let obj = {};
                        obj[item.date[0]] = item.day.concat("-").concat(item.days);
                        arr.push(obj);
                    };
                } else {
                    if (item?.date === undefined || item?.day === undefined || item?.date === null || item?.day === null) {
                        message.warning("Please give all fields in JSON");
                    } else {
                        let obj = {};
                        obj[item.date[0]] = item.day;
                        arr.push(obj);
                    };
                }
            });
            if (arr.length > 0) {
                let obj = {
                    paramsJson : arr
                };
                const stringifiedJSON = JSON.stringify(obj);
                const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
                setScheduleFlag(false);
                setLoading(true);
                const updateData = await upsertScheduleData(mainReportId, dagSchedulerId, frequency, startDate, jsonToSend); 
                if (updateData) {
                    if (updateData?.messageCode === "200") {
                        setLoading(false);
                        message.success(updateData.message);
                    } else {
                        setLoading(false);
                        message.error(updateData.message);
                    };
                } else {
                    setLoading(false);
                    message.error("Something wrong in Request");
                }
            };
        } else {
            message.warning("Frequency, Start Date and JSON are mandatory");
        }
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

    const handleTabs = (key) => {
        if (key === "3") {
            setFlowFlag(true);
        } else {
            setFlowFlag(false);
        };
    };

    const handleEye = () => {
        setEyeFlag(true);
    };

    return (
        <div>
            <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />} spinning={loading}>
                <Row>
                    <Col span={12}>
                        <div style={{ display: "flex" }}>
                            <Button type="link" onClick={() => { history.push(`/others/window/7484`); }} style={{ fontSize: "15px", marginTop: "-1%", marginLeft: "-2.5%" }}>
                                Tasks
                            </Button>
                            <EditFilled style={{ marginTop: "0.5%" }} onClick={() => { setNameFlag(true); }} />
                        </div>
                        {nameFlag === true ?
                            <Input value={name} onChange={(ev) => { setName(ev.target.value); }} onPressEnter={() => { setNameFlag(false); }} style={{ marginBottom: "0px", marginTop: "-1%", width: 400 }}/> :
                            <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "-1%" }}>{name}</h2>
                        }
                    </Col>
                    <Col span={12}>
                        <span style={{ float: "right",display:"flex", marginBottom: "8px" }}>
                            {/* <i className="fa-duotone fa-eye" aria-hidden="true" style={{ cursor: "pointer" }}></i> */}
                            <Button onClick={handleEye} style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                                <EyeOutlined/>
                            </Button>
                            &nbsp;
                            <Button onClick={onSave} style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                                <SaveOutlined/>
                            </Button>
                            &nbsp;  
                            <Button onClick={onRun} style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                                <PlaySquareOutlined/>
                            </Button>
                            &nbsp;
                            <Button onClick={onSchedule} style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                                <CalendarOutlined />
                            </Button>
                        </span>
                    </Col>
                </Row>
                <Row style={{ height: "640px", backgroundColor: "white" }}>
                    {flowFlag === false ? 
                        <Col span={4} style={{ marginTop: "8px" }}>
                            <Row>
                                <Col span={17} style={{ marginTop: "5px" , marginLeft: "6px" }}>
                                    <span style={{ fontWeight: 600, fontSize: "16px" }}>Filters</span>
                                </Col>
                                <Col span={4}>
                                    <Popover placement="rightTop" content={filtersContent} trigger="click" visible={newFiltersVisible} onVisibleChange={handleNewFiltersVisible}>
                                        <Button style={{ backgroundColor: "#E3E3E3", marginRight: "5px", border : "#EBEBEB"  }} ><PlusOutlined /></Button>
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
                                                                <Row>
                                                                    <Col span={17} style={{ marginTop: "5px", marginLeft: "6px" }}>
                                                                        <span style={{ fontWeight: 400, fontSize: "14px" }}>{filter.value?.length > 15 ? filter.value.slice(0, 15).concat('...') : filter.value}</span>
                                                                    </Col>
                                                                    <Col span={2} style={{ marginTop: "5px" }}>
                                                                        {/* <EditOutlined style={{ fontSize: "10px", color: "" , cursor: "pointer" }} onClick={handleEditFilters(savedFilter, index)} /> */}
                                                                        <i className="fa fa-pencil" aria-hidden="true" style={{ cursor: "pointer" }} onClick={handleEditFilters(savedFilter, index)}></i>
                                                                    </Col>
                                                                    &nbsp;
                                                                    &nbsp;
                                                                    <Col span={2} style={{ marginTop: "5px" }}>
                                                                        {/* <DeleteOutlined style={{ fontSize: "10px", color: "" , cursor: "pointer" }} onClick={handleDeleteFilters(index)} /> */}
                                                                        <i className="fa fa-trash" aria-hidden="true" style={{ cursor: "pointer" }} onClick={handleDeleteFilters(index)}></i>
                                                                    </Col>
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
                        </Col> : 
                        ""
                    }
                    <Col span={flowFlag === true ? 24 : 16} style={{ backgroundColor: "#F5F5F5" }}>
                        <Tabs defaultActiveKey="1" centered style={{ marginTop: "-45px" }} onChange={handleTabs}>
                            <TabPane tab="Query" key="1" style={{ border: "#F5F5F5" }}>
                                <Row>
                                    <Col span={23} style={{ marginLeft: "16px" }}>
                                        <TextArea style={{ height: 600 }} value={query} onChange={handleQuery} />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Settings" key="2" style={{ border: "#F5F5F5" }}>
                                <Row style={{ marginLeft: "50px"}}>
                                    <Col span={23}>
                                        DagName
                                        <br />
                                        <Input 
                                            value={settingsData.find(data => data.name === "DagName")?.value}
                                            onChange={handleSettingsData("DagName")} 
                                            style={{ width: 650 }}
                                        />
                                    </Col>
                                    <br />
                                    <br />
                                    <br />
                                    <Col span={23}>
                                        TableName
                                        <br />
                                        <Input 
                                            value={settingsData.find(data => data.name === "TableName")?.value}
                                            onChange={handleSettingsData("TableName")} 
                                            style={{ width: 650 }}
                                        />
                                    </Col>
                                    <br />
                                    <br />
                                    <br />
                                    <Col span={23}>
                                        <Checkbox checked={settingsData.find(data => data.name === "Enable")?.value === "Y" ? true : false} onChange={handleSettingsData("Enable")}> Enable</Checkbox>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Runs" key="3" style={{ border: "#F5F5F5" }}>
                                <iframe src={taskId !== "newTask" ? dagUrl : "https://airflow-tserv02.exceloid.in/home"} height="630px" width="100%" ></iframe>
                            </TabPane>
                        </Tabs>
                    </Col>
                    {flowFlag === false ?
                    <Col span={4} style={{ marginTop: "8px" }}>
                            <Row>
                                <Col span={17} style={{ marginTop: "5px" , marginLeft: "6px" }}>
                                    <span style={{ fontWeight: 600, fontSize: "16px" }}>Fields</span>
                                </Col>
                                <Col span={4}>
                                    <Popover placement="leftTop" content={fieldsContent} trigger="click" visible={newFieldsVisible} onVisibleChange={handleNewFieldsVisible}>
                                        <Button style={{ backgroundColor: "#E3E3E3", marginRight: "5px", border : "#EBEBEB"  }}><PlusOutlined /></Button>
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
                                                                <Row>
                                                                    <Col span={17} style={{ marginTop: "5px", marginLeft: "6px" }}>
                                                                        <span style={{ fontWeight: 400, fontSize: "14px" }}>{field.value?.length > 15 ? field.value.slice(0, 15).concat('...') : field.value}</span>
                                                                    </Col>
                                                                    <Col span={2} style={{ marginTop: "5px" }}>
                                                                        {/* <EditOutlined style={{ fontSize: "10px", color: "" , cursor: "pointer" }} onClick={handleEditFields(savedField, index)} /> */}
                                                                        <i className="fa fa-pencil" aria-hidden="true" style={{ cursor: "pointer" }} onClick={handleEditFields(savedField, index)}></i>
                                                                    </Col>
                                                                    &nbsp;
                                                                    &nbsp;
                                                                    <Col span={2} style={{ marginTop: "5px" }}>
                                                                        {/* <DeleteOutlined style={{ fontSize: "10px", color: "" , cursor: "pointer"  }} onClick={handleDeleteFields(index)} /> */}
                                                                        <i className="fa fa-trash" aria-hidden="true" style={{ cursor: "pointer" }} onClick={handleDeleteFields(index)}></i>
                                                                    </Col>
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
                    </Col> : 
                    ""
                }
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
                <Modal
                    title="Dates"
                    visible={runFlag}
                    onOk={handleRunOk}
                    onCancel={handleRunCancel}
                    footer={[
                        <Button key="back" onClick={handleRunCancel}>
                          
                        </Button>,
                        <Button key="submit" style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "80px", height: "33px" }} onClick={handleRunOk}>
                          Run
                        </Button>
                    ]}
                >
                    <div>
                        <Row>
                            <Col span={1}></Col>
                            <Col span={10}>
                                From Date
                                <br />
                                <DatePicker style={{ width: "100%" }} format={dateFormat} onChange={handleFromDate}/>
                            </Col>
                            <Col span={2}></Col>
                            <Col span={10}>
                                To Date
                                <br />
                                <DatePicker style={{ width: "100%" }} format={dateFormat} onChange={handleToDate}/>
                            </Col>
                        </Row>
                        <br />
                    </div>
                </Modal>
                <Modal
                    title="Dates"
                    visible={scheduleFlag}
                    onOk={handleScheduleOk}
                    onCancel={handleScheduleCancel}
                    footer={[
                        <Button key="back" onClick={handleScheduleCancel}>
                          
                        </Button>,
                        <Button key="submit" style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "100px", height: "33px" }} onClick={handleScheduleOk}>
                          Schedule
                        </Button>
                    ]}
                >
                    <div>
                        <Row>
                            <Col span={12}>
                                Frequency
                                <br />
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder="---Select---"
                                    value={frequency}
                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    dropdownMatchSelectWidth={false}
                                    onSelect={selectTimeLineFilters}
                                    style={{ width: "90%" }}
                                    >
                                        <>
                                        <Option key="DL" value="DL">
                                            Daily
                                        </Option>
                                        <Option key="WK" value="WK">
                                            Weekly
                                        </Option>
                                        <Option key="MT" value="MT">
                                            Monthly
                                        </Option>
                                        <Option key="QT" value="QT">
                                            Quarterly
                                        </Option>
                                        <Option key="YL" value="YL">
                                            Yearly
                                        </Option>
                                        </>
                                </Select>
                            </Col>
                            <Col span={12}>
                                Schedule Start Date
                                <br />
                                <DatePicker  style={{ width: "90%" }} value={startDate !== "" ? moment(startDate, dateFormat) : null} format={dateFormat} onChange={handleStartDate}/>
                            </Col>
                        </Row>
                        <Form form={form} name="dynamic_form_nest_item" autoComplete="on" onValuesChange={handleJSONValues}>
                            <Form.List name="dates">
                                {(fields, { add, remove }) => (
                                <>
                                    <Form.Item>
                                        <PlusSquareOutlined onClick={() => add()} style={{ float: "right" }}/>
                                    </Form.Item>
                                    <br />
                                    {fields.map((field, index) => (
                                    <Space key={field.key} align="baseline">
                                        <Form.Item
                                            {...field}
                                            label="Key"
                                            name={[field.name, 'date']}
                                        >
                                            <Select mode="tags" placeholder="Tags Mode" style={{ width : 160 }}>
                                                {childrenDate}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...field}
                                            label="Value"
                                            name={[field.name, 'day']}
                                        >
                                        <Select
                                            style={{ width : 160 }} 
                                        >
                                            <Option key={"CD"} value={"CD"}>{"Today"}</Option>
                                            <Option key={"YD"} value={"YD"}>{"Yesterday"}</Option>
                                            <Option key={"NDA"} value={"NDA"}>{"N Days ago"}</Option>
                                            <Option key={"NWA"} value={"NWA"}>{"N Weeks ago"}</Option>
                                            <Option key={"NMA"} value={"NMA"}>{"N Months ago"}</Option>
                                            <Option key={"NYA"} value={"NYA"}>{"N years ago"}</Option>
                                        </Select>
                                        </Form.Item>
                                        {indexes.map(it => {
                                            if (it === index) {
                                                return (
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'days']}
                                                    >
                                                        <InputNumber style={{ width : 60 }} />
                                                    </Form.Item>
                                                )
                                            }
                                        })}
                                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                                    </Space>
                                    ))}
                                </>
                                )}
                            </Form.List>
                        </Form>
                        <br />
                    </div>
                </Modal>
            </Spin>
        </div>
    )
};

export default NewTask;