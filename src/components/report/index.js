
/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Row, Spin, Select, DatePicker, Form, message, Menu,Table, Button, Modal,Checkbox,Tag, Tooltip , Dropdown, Input, InputNumber } from "antd";
import Export from "../../assets/images/exportReport.svg";
import switchPivot from "../../assets/images/switchPivot.svg";
import showMore from "../../assets/images/showMore.svg";
import Filters from "../../assets/images/filters.svg";
import showLess from "../../assets/images/showLess.svg";
import arrowIcon from "../../assets/images/selArrow.svg";
import noRecord from "../../assets/images/noRecord.png"
import ToggleIcon from "../../assets/images/toggleIcon.svg";
import './style.css';
import ThemeJson from "../../constants/UIServer.json"
import clearReportData from "../../assets/images/clearReportData.svg";
import Envelop from "../../assets/images/envelop.svg";
import TableForReport from './TableForReport'
import { useGlobalContext } from "../../lib/storage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import moment from 'moment'
import { LoadingOutlined,CalendarOutlined,DownOutlined,UpOutlined,EditOutlined,DeleteOutlined,CloseOutlined } from "@ant-design/icons";
// import { genericUrl,fileDownloadUrl } from "../../constants/serverConfig.js";
import { getComboFillForReportOnlyId,getComboFillForReportIdAndValue } from "../../services/generic";
import { gridLogic } from './gridLogic'
// import { dateFilters } from './dateFilters'
import Axios from "axios";
import TableRenderers from 'react-pivottable/TableRenderers'
import createPlotlyComponent from 'react-plotly.js/factory'
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers'
import PivotTableUI from 'react-pivottable/PivotTableUI'
import 'react-pivottable/pivottable.css'
import "antd/dist/antd.css";
import "../../styles/app.css";
import "../../styles/antd.css"
import ShowAndHide from "../../assets/images/showandHide.svg";
import ReportIcon from "../../assets/images/reportIcon.svg";
import PivotTable from "./PivotTable";
import { generateToken } from "../../services/generateToken";
import { getOAuthHeaders } from "../../constants/oAuthValidation";

const { RangePicker } = DatePicker;
const { Option } = Select;
const {TextArea} = Input


const Plot = createPlotlyComponent(window.Plotly)
let PlotlyRenderers = createPlotlyRenderers(Plot)

import dayjs from "dayjs";
const customParseFormat = require("dayjs/plugin/customParseFormat");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
// ...
const Report = () => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const genericUrl = process.env.REACT_APP_genericUrl
  const userData = globalStore.userData
  const userPreferences = globalStore.userPreferences;
  const dateFormat = userPreferences.dateFormat
  const userCurrency = userData.currency
  const fileDownloadUrl = process.env.REACT_APP_fileDownloadUrl;
  const { reportId } = useParams();
  const [gridLength, setGridLength] = useState(0);
  const [reportName, setReportName] = useState("");
  const [parameters, setParameters] = useState("")
  const [reportFilters, setReportFilters] = useState([]);
  const [reportFiltersForNextRow, setReportFiltersForNextRow] = useState([]);
  const [reportFiltersForDatePopup, setReportFiltersForDatePopup] = useState([]);
  const [reportFields, setReportFields] = useState([]);
  const [dropdownDetails, setDropdownDetails] = useState([]);
  const [referenceListDetails, setListReferenceDetails] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [mobMenu,setMobMenu] = useState(false)
  const [mainHeaderData, setMainHeaderData] = useState([]);
  const [drillDownHeader,setHeaderForDrillDown ] = useState([]);
  const [drillDownData, setDataForDrillDown] = useState([]);
  const [drillDownPopup, setPopupForDrillDown] = useState(false);
  const [emailReportPopup, setEmailReportPopup] = useState(false);
  const [drillDownTitle, setDrillDownTitle] = useState("");  
  const [loading, setLoading] = useState(false);
  const [loadingForModal, setLoadingForModal] = useState(false);
  const [loadingForEmail, setLoadingForEmail] = useState(false);
  const [viewMoreLessFilters,setViewMoreLessFilters] = useState(false)
  const [multiSelectorDropdownId,setMultiSelectorDropdownId] = useState("")
  const [popUpReportName, setPopUpReportName] = useState("");
  const [checkedValue, setCheckedValue] = useState(0);
  const [switchValue, setSwitchValue] = useState(false);
  const [startDate,setStartDate] = useState(null)
  const [dateRange, setDateRange] = useState(null);
  const [endDate,setEndDate] = useState(null)
  const [pivotData, setPivotData] = useState();
  const [reportParameters,setReportParameters]=useState("")
  const [showSwitchAndExportButton,setSwitchAndExportButton]=useState(false)
  const [drillDownId, setDrillDownId]=useState("")
  const [showGridData,setShowGridData]=useState(false)
  const [nestedTable,setNestedTable]=useState("")
  const [parametersToSend,setParametersToSend]=useState({})
  const [detailedReportId,setDetailedReportId]=useState("")
  const [pivotColumns, setPivotColumns] = useState([]);
  const [filterModal,FilterModal] = useState(false)
  const [reportDownloadFlag, setReportDownloadFlag] = useState(false)
  const [reportDateOptionsFlag, setReportDateOptionsFlag] = useState(false)
  const [reportPivotFlag, setReportPivotFlag] = useState(false)

  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false)
  const [buttonName,setButtonName] = useState("Today")

  const [dateRangeColumnName,setDateRangeColumnName]=useState({type:null,value:null})
  const [defaultValueExpression,setDefaultValueExpression]=useState(null)
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalRecordsForDrillDown, setTotalRecordsForDrillDown] = useState(0);
  const [visible, setVisible] = useState(false);
  const [unCheckedColumns, setUnCheckedColumns] = useState([]);
  const [emailAttachment, setEmailAttachment]=useState("")
  const [form] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [scheduleReportForm] = Form.useForm();
  const [loadingForSReport,setloadingForSReport] = useState(false)
  const [basescreenFormData,setBasescreenFormData] = useState([])
  const [scheduledData,setScheduledData] = useState([])
  const [scheduledReportFlag,setScheduledReportFlag] = useState(false)
  const [selectedRecordToupdate,setSelectedRecordToUpdate]= useState(null)
  const [reportSchedulerVisible,setReportSchedulerVisible] = useState(false)
  const [windowSize, setWindowSize] = useState(getWindowSize());
  let appId = localStorage.getItem("appId");
  
  const listActionButtons = {
    height: "32px",
    width: "33px",
    background: "#fff",
    border: "1px solid #F3F3F3",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.05)",
    paddingLeft: "5px",
    paddingRight: "5px ",
    marginRight: "9px ",
    paddingTop: "6px ",
    description: "list icon buttons on the right hand side"
  }

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
  const innerWidth = windowSize.innerWidth
  let subMenuItem = JSON.parse(localStorage.getItem("subMenuItem"))
  let subMenuData =JSON.parse(localStorage.getItem("subMenuData"))
  const responsiveButtonMobileIn = {
    xxl: 0,
    xl: 0,
    lg: 18,
    xs: 14,
    sm: 14,
    md: 14,
  };
  const responsiveDesignForButtons ={
    xxl: 0,
    xl: 0,
    lg: 6,
    xs: 10,
    sm: 10,
    md: 10,
  }
  useEffect(() => {
    if (reportId) {     
      getReportData();
      
    }
    return () => {
      setHeaderData([]);
      setMainHeaderData([]);
      setGridData([]);
      setSwitchAndExportButton(false)
      setSwitchValue(false)
      setShowGridData(false)     
      setParametersToSend({})      
      setReportDownloadFlag(false)
      setReportDateOptionsFlag(false)
      setReportPivotFlag(false)
      setPivotData()
      setButtonName("")
      setDateRangeColumnName({type:null,value:null})
      setDefaultValueExpression(null)
      setViewMoreLessFilters(false)
      setTotalRecords(0)
      form.resetFields();
      PlotlyRenderers=''
    };
  }, [reportId]);

  const getReportData = async () => {

    try {
      setLoading(true);
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const { access_token } = getOAuthHeaders();
      const getReportDetailsQuery = {
        query: `query {
        getReportJson(reportId:"${reportId}"){data, messageCode, title, message}
        }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${access_token}`,
        appId: appId
      };

      const serverResponse = await Axios.post(genericUrl, getReportDetailsQuery, { headers: headers }, { async: true }, { crossDomain: true });
      const reportJsonResponse = serverResponse.data.data.getReportJson;
      
      if (reportJsonResponse.messageCode === "200") {
        const reportData = JSON.parse(reportJsonResponse.data);
        const reportName = reportData.name;
        const reportFilters = reportData.Filters;
        const reportSetting = reportData.Settings;
        reportFilters.sort(function(a, b) {
          return a.seqNo - b.seqNo
        })

        let visibleFiltersArr = []
        let autoRunFlag = ""
        let autoRunJson = {}
        let dateTypeValue = {}
        if(reportSetting===undefined || reportSetting===null){
          setReportDownloadFlag(true)
          setReportDateOptionsFlag(true)
          setReportPivotFlag(true)
          setNestedTable("N")
          autoRunFlag="N"
        }else{
          const {enabledownload, enabledateoptions, enablepivot,enableautorun,enablenestedtable,detail_report_id,enableschedulereport}=reportSetting
          autoRunFlag=enableautorun
          setNestedTable(enablenestedtable)
          setDetailedReportId(detail_report_id)
          if(enabledownload==="Y"){
            setReportDownloadFlag(true)
          }else{
            setReportDownloadFlag(false)
          }

          if(enabledateoptions==="Y"){
            setReportDateOptionsFlag(true)
          }else{
            setReportDateOptionsFlag(false)
          }

          if(enablepivot==="Y"){
            setReportPivotFlag(true)
          }else{
            setReportPivotFlag(false)
          }
          if(enableschedulereport==="Y"){
            setScheduledReportFlag(true)
          }else{
            setScheduledReportFlag(false)
          }
        }
        for (let index = 0; index < reportFilters.length; index++) {
          const element = reportFilters[index];
          if(element.isForPrompting==="Y" && element.isactive==="Y" && element.type!=="DateRange"){
            visibleFiltersArr.push(element)
          }
        }
        for (let index = 0; index < reportFilters.length; index++) {
          const element = reportFilters[index];
          if(element.isForPrompting==="Y" && element.isactive==="Y"){
            autoRunJson[element.columnName]=element.defaultValueExpression
            
          }
          if(element.type==="DateRange"){
            dateTypeValue = element.type
            setDateRangeColumnName({type:element.type,value:element.columnName});
            setDefaultValueExpression(element.defaultValueExpression);
            // autoRunJson[element.type]=element.columnName
            const {defaultValueExpression}=element
            if(defaultValueExpression==="" || defaultValueExpression===undefined || defaultValueExpression===null ){
              // dateColNameArray.push(element.columnName)
              const date = new Date(); 
              const year = date.getFullYear(); 
              const month = date.getMonth();
              const firstDay = dateConvertor((new Date(year, month, 1)));
              const lastDay = dateConvertor((new Date(year, month + 1, 0)));
              formattedDateForButton(firstDay,lastDay)
              form.setFieldsValue({[element.columnName]:[moment(new Date(firstDay), dateFormat), moment(new Date(lastDay), dateFormat)]})                
            }else{
               switch (element.defaultValueExpression) {
                case "today":
                  const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
                  const todayDateArray = []
                  const startDate = new Date()
                  const startDateDay = startDate.getDate()
                  const startDateMonth = monthNames[startDate.getMonth()]
                  const startDateYear = startDate.getFullYear()
                  const formattedStartDate = `${startDateDay}-${startDateMonth}-${startDateYear}`
                  todayDateArray.push(moment(new Date()), moment(new Date()))                  
                  form.setFieldsValue({[element.columnName]:[moment(new Date(startDate), dateFormat), moment(new Date(startDate), dateFormat)]})                    
                  setButtonName(formattedStartDate)
                  break;
                
                case "yesterday":
                  const monthNamesYesterday = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
                  const yesterdayDateArray = []
                  const yesterdaysDate = new Date(new Date().getTime() - 24*60*60*1000);
                  const startDateDayYesterday = yesterdaysDate.getDate()
                  const startDateMonthYesterday = monthNamesYesterday[yesterdaysDate.getMonth()]
                  const startDateYearYesterday = yesterdaysDate.getFullYear()
                  const formattedStartDateYesterday = `${startDateDayYesterday}-${startDateMonthYesterday}-${startDateYearYesterday}`
                  yesterdayDateArray.push(moment(new Date(yesterdaysDate)), moment(new Date(yesterdaysDate)))
                  form.setFieldsValue({[element.columnName]:[moment(new Date(yesterdaysDate), dateFormat), moment(new Date(yesterdaysDate), dateFormat)]})                  
                  setButtonName(formattedStartDateYesterday)
                  break;
          
                case "lastSevenDays":
                  const currDate = new Date();
                  const lastSevenDay = dateConvertor(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))
                  form.setFieldsValue({[element.columnName]:[moment(new Date(lastSevenDay), dateFormat), moment(new Date(currDate), dateFormat)]})                  
                  formattedDateForButton(lastSevenDay,currDate)
                  break;
          
                case "lastThirtyDays":
                  const currDateForThirtyDays = new Date();
                  const last30Day = dateConvertor(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000))
                  form.setFieldsValue({[element.columnName]:[moment(new Date(last30Day), dateFormat), moment(new Date(currDateForThirtyDays), dateFormat)]})
                  formattedDateForButton(last30Day,currDateForThirtyDays)
                  break;

                case "lastNinetyDays":
                  const startDateForLastNinetyDays = dateConvertor(moment().subtract(90, 'days'))
                  const endDateForLastNinetyDays = dateConvertor(new Date())
                  formattedDateForButton(startDateForLastNinetyDays,endDateForLastNinetyDays)
                  form.setFieldsValue({[element.columnName]:[moment(new Date(startDateForLastNinetyDays), dateFormat), moment(new Date(), dateFormat)]})
                  break;

                case "lastMonth":
                  const lastMonthDate = new Date();
                  const lastMonthFirstDay = dateConvertor(new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth()-1, 1));
                  const lastMonthLastDay = dateConvertor(new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 0));
                  form.setFieldsValue({[element.columnName]:[moment(new Date(lastMonthFirstDay), dateFormat), moment(new Date(lastMonthLastDay), dateFormat)]})
                  formattedDateForButton(lastMonthFirstDay,lastMonthLastDay)
                  break;
          
                case "lastYear":
                  if(userCurrency==="INR"){
                    const currDateCurrency = new Date()
                    const fiscalYearFirstDay = dateConvertor((new Date(currDateCurrency.getFullYear()-1, 3, 1)));
                    const fiscalYearLastDay = dateConvertor((new Date(currDateCurrency.getFullYear(), 2, 31)));
                    form.setFieldsValue({[element.columnName]:[moment(new Date(fiscalYearFirstDay), dateFormat), moment(new Date(fiscalYearLastDay), dateFormat)]})
                    formattedDateForButton(fiscalYearFirstDay,fiscalYearLastDay)
                  }else{
                    const lastYearDate = new Date(new Date().getFullYear() - 1, 0, 1);
                    const lastYearFirstDay = dateConvertor(new Date(lastYearDate.getFullYear(), 0, 1));
                    const lastYearLastDay = dateConvertor(new Date(lastYearDate.getFullYear(), 11, 31));
                    form.setFieldsValue({[element.columnName]:[moment(new Date(lastYearFirstDay), dateFormat), moment(new Date(lastYearLastDay), dateFormat)]})
                    formattedDateForButton(lastYearFirstDay,lastYearLastDay)
                  }       
                  break;
          
                case "thisWeek":
                  let curr = new Date 
                  let week = []
                  for (let i = 1; i <= 7; i++) {
                    let first = curr.getDate() - curr.getDay() + i 
                    let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
                    week.push(day)
                  }
                  const firstday = dateConvertor(week[0]);
                  const lastday = dateConvertor(new Date());
                  formattedDateForButton(firstday,lastday)
                  form.setFieldsValue({[element.columnName]:[moment(new Date(firstday), dateFormat), moment(new Date(), dateFormat)]})
                  break;
           
                case "thisMonth":
                  const date = new Date(); 
                  const year = date.getFullYear(); 
                  const month = date.getMonth();
                  const firstDay = dateConvertor((new Date(year, month, 1)));
                  const lastDay = dateConvertor(new Date());
                  formattedDateForButton(firstDay,lastDay)
                  form.setFieldsValue({[element.columnName]:[moment(new Date(firstDay), dateFormat), moment(new Date(lastDay), dateFormat)]})
                  break;
                case "thisQuarter":
                  const startDateOfQuarter = dateConvertor(moment().startOf('quarter'))
                  const endDateOfQuarter = dateConvertor(new Date());
                  formattedDateForButton(startDateOfQuarter,endDateOfQuarter)
                  form.setFieldsValue({[element.columnName]:[moment(new Date(startDateOfQuarter), dateFormat), moment(new Date(), dateFormat)]})
                  break;
                case "thisYear":
                  if(userCurrency==="INR"){
                    const today = new Date();
                    const fiscalYearFirstDayForYearToDate = dateConvertor((new Date(today.getFullYear(), 3, 1)));
                    formattedDateForButton(fiscalYearFirstDayForYearToDate,dateConvertor(today))
                    form.setFieldsValue({[element.columnName]:[moment(new Date(fiscalYearFirstDayForYearToDate), dateFormat), moment(new Date(), dateFormat)]})
                  }else{
                    const currentDate = new Date();
                    const theFirst = dateConvertor((new Date(currentDate.getFullYear(), 0, 1)));
                    formattedDateForButton(theFirst,theLast)
                    form.setFieldsValue({[element.columnName]:[moment(new Date(theFirst), dateFormat), moment(new Date(), dateFormat)]})
                  }       
                  break;
                case "nodate":
                  const monthsNoDate = new Date(); 
                  const monthsNoYear = monthsNoDate.getFullYear(); 
                  const monthNoData = monthsNoDate.getMonth();
                  const firstDayOfNoMonth = dateConvertor((new Date(monthsNoYear, monthNoData, 1)));
                  const lastDayOfNoMonth = dateConvertor((new Date(monthsNoYear, monthNoData + 1, 0)));
                  formattedDateForButton(firstDayOfNoMonth,lastDayOfNoMonth)
                  form.setFieldsValue({[element.columnName]:[moment(new Date(firstDayOfNoMonth), dateFormat), moment(new Date(lastDayOfNoMonth), dateFormat)]})  
                  break;
                default:
                  const monthsDate = new Date(); 
                  const monthsYear = monthsDate.getFullYear(); 
                  const monthData = monthsDate.getMonth();
                  const firstDayOfMonth = dateConvertor((new Date(monthsYear, monthData, 1)));
                  const lastDayOfMonth = dateConvertor((new Date(monthsYear, monthData + 1, 0)));
                  formattedDateForButton(firstDayOfMonth,lastDayOfMonth)
                  form.setFieldsValue({[element.columnName]:[moment(new Date(firstDayOfMonth), dateFormat), moment(new Date(lastDayOfMonth), dateFormat)]})  
                  break;
              }
            }
                       
          }
          if(element.type==="Date"){
            dateTypeValue = element.type
            const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
            // dateColNameArray.push(element.columnName)
            setDateRangeColumnName({type:element.type,value:element.columnName})  
            setDefaultValueExpression(element.defaultValueExpression);
            // autoRunJson[element.type]=element.columnName
            const {defaultValueExpression}=element
            if(defaultValueExpression==="" || defaultValueExpression===undefined || defaultValueExpression===null ){
              const startDate = new Date()
              const startDateDay = startDate.getDate()
              const startDateMonth = monthNames[startDate.getMonth()]
              const startDateYear = startDate.getFullYear()
              const formattedStartDate = `${startDateDay}-${startDateMonth}-${startDateYear}`
              setButtonName(formattedStartDate)
              form.setFieldsValue({ [element.columnName]: moment(new Date(), dateFormat) });
            }else{
              switch (element.defaultValueExpression) {
                case "today":
                  const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
                  const todayDateArray = []
                  const startDate = new Date()
                  const startDateDay = startDate.getDate()
                  const startDateMonth = monthNames[startDate.getMonth()]
                  const startDateYear = startDate.getFullYear()
                  const formattedStartDate = `${startDateDay}-${startDateMonth}-${startDateYear}`
                  todayDateArray.push(moment(new Date()), moment(new Date()))                  
                  form.setFieldsValue({ [element.columnName]: moment(new Date(), dateFormat) });
                  setButtonName(formattedStartDate)
                  break;
                
                case "yesterday":
                  const monthNamesYesterday = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
                  const yesterdayDateArray = []
                  const yesterdaysDate = new Date(new Date().getTime() - 24*60*60*1000);
                  const startDateDayYesterday = yesterdaysDate.getDate()
                  const startDateMonthYesterday = monthNamesYesterday[yesterdaysDate.getMonth()]
                  const startDateYearYesterday = yesterdaysDate.getFullYear()
                  const formattedStartDateYesterday = `${startDateDayYesterday}-${startDateMonthYesterday}-${startDateYearYesterday}`
                  yesterdayDateArray.push(moment(new Date(yesterdaysDate)), moment(new Date(yesterdaysDate)))
                  form.setFieldsValue({ [element.columnName]: moment(new Date(yesterdaysDate), dateFormat) });
                  setButtonName(formattedStartDateYesterday)
                  break;

                  default:
                  const defaultMonthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
                  const startDateDefault = new Date()
                  const startDateDayDefault = startDateDefault.getDate()
                  const startDateMonthDefault = defaultMonthNames[startDateDefault.getMonth()]
                  const startDateYearDefault = startDateDefault.getFullYear()
                  const formattedStartDateDefault = `${startDateDayDefault}-${startDateMonthDefault}-${startDateYearDefault}`
                  setButtonName(formattedStartDateDefault)
                  form.setFieldsValue({ [element.columnName]: moment(new Date(), dateFormat) });
              }
            }                  
          }
          if(element.type==="String" && element.isForPrompting==="Y"){
            const {defaultValueExpression} = element
            form.setFieldsValue({ [element.columnName]: defaultValueExpression });
          }
        }
        const reportFields = reportData.Fields;
        // const nestedTableFlag = reportData.enablenestedtable
        const detailedReportId = reportData.detail_report_id
        setLoading(false);
        setReportName(reportName);
        setReportFiltersForDatePopup(reportFilters);
        setReportFilters(visibleFiltersArr.slice(0,6));
        setReportFiltersForNextRow(visibleFiltersArr.slice(6));
        setReportFields(reportFields);
        if(autoRunFlag==="Y"){
          autoRunService(autoRunJson,reportFields,dateTypeValue)
        }
        
      }
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  };

  const onDropDownSelect = async (id,dependentId) => {
    const formdata = form.getFieldValue()
   if(dependentId === undefined || dependentId === null){
     setMultiSelectorDropdownId(id);
    setDropdownDetails([]);
    const getReportData = await getComboFillForReportOnlyId(id,undefined,reportId);
    const reportsGridArray = [];
    let dataArray2;
    for (let index = 0; index < getReportData.length; index++) {
      if (typeof getReportData[index] === "string" ) {
        dataArray2 = JSON.parse(getReportData[index]);
        reportsGridArray.push(dataArray2);
      } else {
        dataArray2 = getReportData[index];
        reportsGridArray.push(dataArray2);
      }
      
    }    
    setDropdownDetails([...reportsGridArray]);
   }else{
     let columnNameId = null
     for (let index = 0; index < reportFilters.length; index++) {
       const elementDependentId = reportFilters[index].id;
       if(elementDependentId === dependentId){
         columnNameId = reportFilters[index].columnName
        }
     }
     const dependentValueId = formdata[columnNameId]
    setMultiSelectorDropdownId(id);
    setDropdownDetails([]);
    const getReportData = await getComboFillForReportOnlyId(id,dependentValueId,reportId);
    const reportsGridArray = [];
    let dataArray2;
    if(getReportData !== null || getReportData !== undefined){
      for (let index = 0; index < getReportData.length; index++) {
        if (typeof getReportData[index] === "string" ) {
          dataArray2 = JSON.parse(getReportData[index]);
          reportsGridArray.push(dataArray2);
        } else {
          dataArray2 = getReportData[index];
          reportsGridArray.push(dataArray2);
        }
        
      }    
      setDropdownDetails([...reportsGridArray]);
    }
   }
    // setMultiSelectorDropdownId(id);
    // setDropdownDetails([]);
    // const getReportData = await getComboFillForReportOnlyId(id);
    // const reportsGridArray = [];
    // let dataArray2;
    // for (let index = 0; index < getReportData.length; index++) {
    //   if (typeof getReportData[index] === "string" ) {
    //     dataArray2 = JSON.parse(getReportData[index]);
    //     reportsGridArray.push(dataArray2);
    //   } else {
    //     dataArray2 = getReportData[index];
    //     reportsGridArray.push(dataArray2);
    //   }
      
    // }    
    // setDropdownDetails([...reportsGridArray]);
  };

  const onSearchFunction = async (value) => {
    const getReportData = await getComboFillForReportIdAndValue(multiSelectorDropdownId,value,reportId);
    const reportsGridArray2 = [];
    let dataArray3;
    for (let index = 0; index < getReportData?.length; index++) {
      if (typeof getReportData[index] === "string" ) {
        dataArray3 = JSON.parse(getReportData[index]);
        reportsGridArray2.push(dataArray3);
      } else {
        dataArray3 = getReportData[index];
        reportsGridArray2.push(dataArray3);
      }
      
    }  
    setDropdownDetails([...reportsGridArray2]);
  };

  const getData = event => {
    onSearchFunction(event)
  }

  const debounce = function(fn, d) {
    let timer
    return function() {
      let context = this,
      args = arguments
      clearTimeout(timer)
      timer = setTimeout(() => {
        getData.apply(context, arguments)
      }, d)
    }
  }

  const searchDropdownRecords = debounce(getData, 300)


  const onDropDownSelectForListReference = (values) => {
    setListReferenceDetails([...values])
  };


  const handleMenuClick = (obj) => {
    if (obj.key === "view") {
      form.submit();
    } else {
      // form.submit();
      downloadData();
    }
  };

  const autoRunService = async (parameters,reportFields,dateTypeValue)=>{
    try {
      setLoading(true);
      const dateArr = []
      for (const [key, autoRunValue] of Object.entries(parameters)) {        
        if(autoRunValue==="nodate"){
          const monthsDate = new Date(); 
          const monthsYear = monthsDate.getFullYear(); 
          const monthData = monthsDate.getMonth();
          const firstDayOfMonth = dateConvertor((new Date(monthsYear, monthData, 1)));
          const lastDayOfMonth = dateConvertor((new Date(monthsYear, monthData + 1, 0)));
          dateArr.push(firstDayOfMonth,lastDayOfMonth)
          parameters[key]=dateTypeValue==="DateRange"?dateArr:dateConvertor(monthsDate)
        }
        else if(autoRunValue==="today"){
          const startDate = dateConvertor(new Date())
          dateArr.push(startDate,startDate)
          parameters[key]=dateTypeValue==="DateRange"?dateArr:startDate
        }else if(autoRunValue==="yesterday"){
          const yesterdaysDate = dateConvertor(new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
          dateArr.push(yesterdaysDate,yesterdaysDate)
          parameters[key]=dateTypeValue==="DateRange"?dateArr:yesterdaysDate
        }else if(autoRunValue==="lastSevenDays"){
          const currDate = dateConvertor(new Date());
          const lastSevenDay = dateConvertor(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))
          dateArr.push(lastSevenDay,currDate)
          parameters[key]=dateArr
        }else if(autoRunValue==="lastThirtyDays"){
          const currDateForThirtyDays = dateConvertor(new Date());
          const last30Day = dateConvertor(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000))
          dateArr.push(last30Day,currDateForThirtyDays)
          parameters[key]=dateArr
        }else if(autoRunValue==="lastNinetyDays"){
          const startDateForLastNinetyDays = dateConvertor(moment().subtract(90, 'days'))
          const endDateForLastNinetyDays = dateConvertor(new Date())
          dateArr.push(startDateForLastNinetyDays,endDateForLastNinetyDays)
          parameters[key]=dateArr
        }else if(autoRunValue==="lastMonth"){
          const lastMonthDate = new Date();
          const lastMonthFirstDay = dateConvertor(new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth()-1, 1));
          const lastMonthLastDay = dateConvertor(new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 0));
          dateArr.push(lastMonthFirstDay,lastMonthLastDay)
          parameters[key]=dateArr
        }else if(autoRunValue==="lastYear"){
          if(userCurrency==="INR"){
            const currDateCurrency = new Date()
            const fiscalYearFirstDay = dateConvertor((new Date(currDateCurrency.getFullYear()-1, 3, 1)));
            const fiscalYearLastDay = dateConvertor((new Date(currDateCurrency.getFullYear(), 2, 31)));
            dateArr.push(fiscalYearFirstDay,fiscalYearLastDay)
            parameters[key]=dateArr
          }else{
            const lastYearDate = new Date(new Date().getFullYear() - 1, 0, 1);
            const lastYearFirstDay = dateConvertor(new Date(lastYearDate.getFullYear(), 0, 1));
            const lastYearLastDay = dateConvertor(new Date(lastYearDate.getFullYear(), 11, 31));
            dateArr.push(lastYearFirstDay,lastYearLastDay)
            parameters[key]=dateArr
          }
        }else if(autoRunValue==="thisWeek"){
          let curr = new Date 
          let week = []
          for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i 
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            week.push(day)
          }
          const firstday = dateConvertor(week[0]);
          const lastday = dateConvertor(new Date());
          dateArr.push(firstday,lastday)
          parameters[key]=dateArr
        }else if(autoRunValue==="thisMonth"){
          const date = new Date(); 
          const year = date.getFullYear(); 
          const month = date.getMonth();
          const firstDay = dateConvertor((new Date(year, month, 1)));
          const lastDay = dateConvertor(new Date());
          dateArr.push(firstDay,lastDay)
          parameters[key]=dateArr
        }else if(autoRunValue==="thisQuarter"){
          const startDateOfQuarter = dateConvertor(moment().startOf('quarter'))
          const endDateOfQuarter = dateConvertor(new Date());
          dateArr.push(startDateOfQuarter,endDateOfQuarter)
          parameters[key]=dateArr
        }else if(autoRunValue==="thisYear"){
          if(userCurrency==="INR"){
            const today = dateConvertor(new Date());
            const fiscalYearFirstDayForYearToDate = dateConvertor((new Date(today.getFullYear(), 3, 1)));
            dateArr.push(fiscalYearFirstDayForYearToDate,today)
            parameters[key]=dateArr

          }else{
            const currentDate = dateConvertor(new Date());
            const theFirst = dateConvertor((new Date(currentDate.getFullYear(), 0, 1)));
            dateArr.push(theFirst,currentDate)
            parameters[key]=dateArr
          }
        }
        if(autoRunValue==='""' || autoRunValue==="" || autoRunValue===null || autoRunValue===undefined){
          delete parameters[key]
        }
      }
    
      const stringifiedJSON = JSON.stringify(parameters);
      const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const { access_token } = getOAuthHeaders();
      const onSubmitQuery = {
        query: `query {
        executeReport(reportId:"${reportId}", reportParam:"${jsonToSend}"){data, messageCode, title, message}
      }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${access_token}`,
        appId: appId
      };
      const serverResponse = await Axios.post(genericUrl, onSubmitQuery, { headers: headers }, { async: true }, { crossDomain: true });
      if (serverResponse.status === 200) {              
        const responseForGridData = serverResponse.data.data.executeReport.data;

        const gridData = JSON.parse(responseForGridData);

        if (gridData.length > 0) {
          const headerArray = [];          
          const getGridLogicResponse = gridLogic(gridData,reportFields)
          const {finalArrayToPush,finalGridData,totalRecords}=getGridLogicResponse
          for (let index = 0; index < finalArrayToPush.length; index += 1) {
            headerArray.push({
              title: <div className="dragHandler" style={{textAlign:finalArrayToPush[index].type==="Numeric"?"right":"left"}}>{finalArrayToPush[index].displayName}</div>,
              dataIndex: finalArrayToPush[index].fieldName,
              type: finalArrayToPush[index].type,
              checked: true,
              // key: index,
              width: finalArrayToPush[index].gridlength===undefined || finalArrayToPush[index].gridlength===null ? 100/* parseInt((finalArrayToPush[index].displayName).length+20) */ : parseInt(finalArrayToPush[index].gridlength) ,
              ellipsis: true,
              sorter:(a, b)=>(a[finalArrayToPush[index].fieldName]!==null|| b[finalArrayToPush[index].fieldName]!==null) && (a[finalArrayToPush[index].fieldName]!==undefined || b[finalArrayToPush[index].fieldName]!==undefined)?finalArrayToPush[index].type==="Numeric"?a[finalArrayToPush[index].fieldName]-b[finalArrayToPush[index].fieldName]:a[finalArrayToPush[index].fieldName].length-b[finalArrayToPush[index].fieldName].length:'',
              render: (text) => finalArrayToPush[index].drillDown==="Y"?<a style={{color:"#1A0DAB",textDecoration:"underline"}}>{text}</a>:<div style={{textAlign:finalArrayToPush[index].type==="Numeric"?"right":"left"}}>{finalArrayToPush[index].type==="Numeric"?text===undefined || text===null ?'':text.toLocaleString('en-US'):text}</div>,
              onCell: (record) => ({
                onClick: () => {
                  drillDown(jsonToSend,finalArrayToPush[index].fieldName,record[finalArrayToPush[index].fieldName],finalArrayToPush[index].detailReportId)
                },
              })
            });
          }
          setGridData(finalGridData);
          setHeaderData(headerArray);
          setMainHeaderData(headerArray);
          setLoading(false);
          setShowGridData(true)
          setSwitchAndExportButton(true)
          setTotalRecords(totalRecords)

        }else{
          message.error("No Data Available")
          setLoading(false);
          setShowGridData(false)
        }
      }
    } catch (error) {
      setLoading(false)
    }
    
  }

  const onFinish = async (values) => {

    defaultValueExpression
    try {
      setGridData([]);
      setHeaderData([]);
      setMainHeaderData([]);
      setLoading(true);
      const arrayToSend = values;
      for (const [key, value] of Object.entries(arrayToSend)) {
        if(arrayToSend[dateRangeColumnName.type]===null || arrayToSend[dateRangeColumnName.type]===undefined){
          const {value,type}=dateRangeColumnName
          const dateArr=[]
          if(defaultValueExpression==='' || defaultValueExpression==='""' || defaultValueExpression==="" || defaultValueExpression===null || defaultValueExpression===undefined || defaultValueExpression==="nodate"){
            if(type==="DateRange"){
              const monthsDate = new Date(); 
              const monthsYear = monthsDate.getFullYear(); 
              const monthData = monthsDate.getMonth();
              const firstDayOfMonth = dateConvertor((new Date(monthsYear, monthData, 1)));
              const lastDayOfMonth = dateConvertor((new Date(monthsYear, monthData + 1, 0)));
              dateArr.push(firstDayOfMonth,lastDayOfMonth)
              arrayToSend[value]=dateArr
            }else{
              const startDate = dateConvertor(new Date())
              arrayToSend[value]=startDate
            }            
          }
          else if(defaultValueExpression==="today"){
            const startDate = dateConvertor(new Date())
            dateArr.push(startDate,startDate)
            arrayToSend[value]=type==="DateRange"?dateArr:startDate
          }else if(defaultValueExpression==="yesterday"){
            const yesterdaysDate = dateConvertor(new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
            dateArr.push(yesterdaysDate,yesterdaysDate)
            arrayToSend[value]=type==="DateRange"?dateArr:yesterdaysDate
          }else if(defaultValueExpression==="lastSevenDays"){
            const currDate = dateConvertor(new Date());
            const lastSevenDay = dateConvertor(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))
            dateArr.push(lastSevenDay,currDate)
            arrayToSend[value]=dateArr
          }else if(defaultValueExpression==="lastThirtyDays"){
            const currDateForThirtyDays = dateConvertor(new Date());
            const last30Day = dateConvertor(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000))
            dateArr.push(last30Day,currDateForThirtyDays)
            arrayToSend[value]=dateArr
          }else if(defaultValueExpression==="lastNinetyDays"){
            const startDateForLastNinetyDays = dateConvertor(moment().subtract(90, 'days'))
            const endDateForLastNinetyDays = dateConvertor(new Date())
            dateArr.push(startDateForLastNinetyDays,endDateForLastNinetyDays)
            arrayToSend[value]=dateArr
          }else if(defaultValueExpression==="lastMonth"){
            const lastMonthDate = new Date();
            const lastMonthFirstDay = dateConvertor(new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth()-1, 1));
            const lastMonthLastDay = dateConvertor(new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 0));
            dateArr.push(lastMonthFirstDay,lastMonthLastDay)
            arrayToSend[value]=dateArr
          }else if(defaultValueExpression==="lastYear"){
            if(userCurrency==="INR"){
              const currDateCurrency = new Date()
              const fiscalYearFirstDay = dateConvertor((new Date(currDateCurrency.getFullYear()-1, 3, 1)));
              const fiscalYearLastDay = dateConvertor((new Date(currDateCurrency.getFullYear(), 2, 31)));
              dateArr.push(fiscalYearFirstDay,fiscalYearLastDay)
              arrayToSend[value]=dateArr
            }else{
              const lastYearDate = new Date(new Date().getFullYear() - 1, 0, 1);
              const lastYearFirstDay = dateConvertor(new Date(lastYearDate.getFullYear(), 0, 1));
              const lastYearLastDay = dateConvertor(new Date(lastYearDate.getFullYear(), 11, 31));
              dateArr.push(lastYearFirstDay,lastYearLastDay)
              arrayToSend[value]=dateArr
            }
          }else if(defaultValueExpression==="thisWeek"){
            let curr = new Date 
            let week = []
            for (let i = 1; i <= 7; i++) {
              let first = curr.getDate() - curr.getDay() + i 
              let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
              week.push(day)
            }
            const firstday = dateConvertor(week[0]);
            const lastday = dateConvertor(new Date());
            dateArr.push(firstday,lastday)
            arrayToSend[value]=dateArr
          }else if(defaultValueExpression==="thisMonth"){
            const date = new Date(); 
            const year = date.getFullYear(); 
            const month = date.getMonth();
            const firstDay = dateConvertor((new Date(year, month, 1)));
            const lastDay = dateConvertor(new Date());
            dateArr.push(firstDay,lastDay)
            arrayToSend[value]=dateArr
          }else if(defaultValueExpression==="thisQuarter"){
            const startDateOfQuarter = dateConvertor(moment().startOf('quarter'))
            const endDateOfQuarter = dateConvertor(new Date());
            dateArr.push(startDateOfQuarter,endDateOfQuarter)
            arrayToSend[value]=dateArr
          }else if(defaultValueExpression==="thisYear"){
            if(userCurrency==="INR"){
              const today = dateConvertor(new Date());
              const fiscalYearFirstDayForYearToDate = dateConvertor((new Date(today.getFullYear(), 3, 1)));
              dateArr.push(fiscalYearFirstDayForYearToDate,today)
              arrayToSend[value]=dateArr
  
            }else{
              const currentDate = dateConvertor(new Date());
              const theFirst = dateConvertor((new Date(currentDate.getFullYear(), 0, 1)));
              dateArr.push(theFirst,currentDate)
              arrayToSend[value]=dateArr
            }
          }
        }
        if (value === undefined || value === null)  {
          delete arrayToSend[key];
        }
      }
      if ( arrayToSend.dateRange) {
        setDateRange( arrayToSend.dateRange);
      }else{
      if (arrayToSend.DateRange && arrayToSend.DateRange.length === 2) {
        const [start, end] = arrayToSend.DateRange;
        setStartDate(start);
        setEndDate(end);
      }}
      setParametersToSend(arrayToSend)
      const stringifiedJSON = JSON.stringify(arrayToSend);
      const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
      
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const { access_token } = getOAuthHeaders();
      const onSubmitQuery = {
        query: `query {
        executeReport(reportId:"${reportId}", reportParam:"${jsonToSend}"){data, messageCode, title, message}
      }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${access_token}`,
        appId: appId
      };
      const serverResponse = await Axios.post(genericUrl, onSubmitQuery, { headers: headers }, { async: true }, { crossDomain: true });

      if (serverResponse.data.data.executeReport.messageCode === "200") {              
        const responseForGridData = serverResponse.data.data.executeReport.data;
        const gridData = JSON.parse(responseForGridData);
        if (gridData.length > 0) {
          const headerArray = [];    
          const getGridLogicResponse = gridLogic(gridData,reportFields)

          const {finalArrayToPush,finalGridData,totalRecords}=getGridLogicResponse

          finalArrayToPush.sort(function (a, b) {
            return a.sequence_no - b.sequence_no;
          });
          setPivotColumns(finalArrayToPush);



          for (let index = 0; index < finalArrayToPush.length; index += 1) {
            headerArray.push({
              title: <div className="dragHandler" style={{textAlign:finalArrayToPush[index].type==="Numeric"?"right":"left"}}>{finalArrayToPush[index].displayName}</div>,
              dataIndex: finalArrayToPush[index].fieldName,
              type: finalArrayToPush[index].type,
              checked: true,
              hidden:finalArrayToPush[index].fieldName === "p_supplier_id" ? true :false,
              // key: index,
              width: finalArrayToPush[index].gridlength===undefined || finalArrayToPush[index].gridlength===null ? 100/* parseInt((finalArrayToPush[index].displayName).length+20) */ : parseInt(finalArrayToPush[index].gridlength) ,
              ellipsis: true,
              sorter:(a, b)=>(a[finalArrayToPush[index].fieldName]!==null|| b[finalArrayToPush[index].fieldName]!==null) && (a[finalArrayToPush[index].fieldName]!==undefined || b[finalArrayToPush[index].fieldName]!==undefined)?finalArrayToPush[index].type==="Numeric"?a[finalArrayToPush[index].fieldName]-b[finalArrayToPush[index].fieldName]:a[finalArrayToPush[index].fieldName].length-b[finalArrayToPush[index].fieldName].length:'',
              render: (text) => finalArrayToPush[index].drillDown==="Y"?<a style={{color:"#1A0DAB",textDecoration:"underline"}}>{text}</a>:finalArrayToPush[index].enablenavigation==="Y"?<a style={{color:"#089EA4",textDecoration:"underline"}}>{text}</a>:<div style={{textAlign:finalArrayToPush[index].type==="Numeric"?"right":"left",whiteSpace:"break-spaces"}}>{finalArrayToPush[index].type==="Numeric"?text===undefined || text===null ?'':text.toLocaleString('en-US'):<div>{text}</div>}</div>,
              onCell: (record) => ({
                onClick: () => {
                  if(finalArrayToPush[index].drillDown==="Y"){
                    drillDown(jsonToSend,finalArrayToPush[index].fieldName,record[finalArrayToPush[index].fieldName],finalArrayToPush[index].detailReportId)
                  }else if(finalArrayToPush[index].enablenavigation==="Y"){
                    navigationFunction(finalArrayToPush[index],record)

                  }
                },
              })
            });
          }
          finalArrayToPush.filter(item => !item.hidden)


          setGridData(finalGridData);
          setHeaderData(headerArray);
          setMainHeaderData(headerArray);
          setLoading(false);
          FilterModal(false)
          setParameters(jsonToSend)
          setShowGridData(true)
          setSwitchAndExportButton(true)
          setTotalRecords(totalRecords)
        }else{
          message.error("No Data Available")
          setLoading(false);
          setShowGridData(false)
        }
      }else{
        message.error(serverResponse.data.data.executeReport.message)
        setLoading(false);
      }
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    // setFilterDropdownVisible(true)
  };

  const navigationFunction=(element, record)=>{
    for (let index = 0; index < reportFields.length; index++) {
      const reportFieldElement = reportFields[index];
      if(reportFieldElement.id===element.navigation_field_id) {
        const {fieldName}=reportFieldElement
        const navigationWindowId = element.navigation_window_id
        const specificWindowId = record[fieldName]
        window.open(`/popupWindow/${navigationWindowId}/${specificWindowId}`, '_blank', "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");
      }
      
    }
  }

  const drillDown = async (parametersData,fieldName,record,drillDownId)=>{   
    try {    
      const parametersFromState = parametersData
      const replacedString = parametersFromState.replace(/\\/g, '')
      const parsedJson = JSON.parse(replacedString)
      parsedJson[fieldName]=record
      for (const [key, value] of Object.entries(parsedJson)) {
        if(value===null){
          delete parsedJson[key]
        }
      }
      const stringifiedJSON = JSON.stringify(parsedJson);      
      const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
      setReportParameters(jsonToSend)
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const { access_token } = getOAuthHeaders();
      if(drillDownId!==null){
        setDrillDownId(drillDownId)
        setLoading(true);
        const headers = {
          "Content-Type": "application/json",
          Authorization: `bearer ${access_token}`,
          appId: appId
        };
        setLoadingForModal(true)
        const getReportDetailsQuery = {
          query: `query {
          getReportJson(reportId:"${drillDownId}"){data, messageCode, title, message}
          }`,
        };
  
        const getReportJsonServerResponse = await Axios.post(genericUrl, getReportDetailsQuery, { headers: headers }, { async: true }, { crossDomain: true });
        const reportJsonResponse = getReportJsonServerResponse.data.data.getReportJson;
        
        if (reportJsonResponse.messageCode === "201") {
          setLoading(false)
          message.error(reportJsonResponse.message)
        }else{
          const reportData = JSON.parse(reportJsonResponse.data);
          const reportName = reportData.name;
          setPopUpReportName(reportName)
          const drillDownFields = reportData.Fields
          const onSubmitQuery = {
            query: `query {
            executeReport(parentReportId:"${reportId}",reportId:"${drillDownId}", reportParam:"${jsonToSend}"){data, messageCode, title, message}
          }`,
          };
          
          const serverResponse = await Axios.post(genericUrl, onSubmitQuery, { headers: headers }, { async: true }, { crossDomain: true });
          const reportResponse = serverResponse.data.data.executeReport
          if(reportResponse.title==="Success"){
          setLoading(false);
          setLoadingForModal(false)
          const gridData = JSON.parse(reportResponse.data);
          setGridLength(gridData.length)
          if (gridData.length > 0) {
            const headerArrayForDrillDown = []
            const getGridLogicResponse = gridLogic(gridData,drillDownFields)
            const {finalArrayToPush,finalGridData,totalRecords}=getGridLogicResponse         
            for (let index = 0; index < finalArrayToPush.length; index+=1) {
              const element = finalArrayToPush[index];  
              headerArrayForDrillDown.push({
                title: <div className="dragHandler" style={{textAlign:finalArrayToPush[index].type==="Numeric"?"right":"left"}}>{element.displayName}</div>,
                dataIndex: element.fieldName,
                type: element.type,
                render: (text) => finalArrayToPush[index].drillDown==="Y"?<a style={{color:"#1A0DAB",textDecoration:"underline"}}>{text}</a>:<div style={{textAlign:finalArrayToPush[index].type==="Numeric"?"right":"left"}}>{finalArrayToPush[index].type==="Numeric"?text===undefined || text===null ?'':text.toLocaleString('en-US'):text}</div>,
                sorter:(a, b)=>(a[finalArrayToPush[index].fieldName]!==null|| b[finalArrayToPush[index].fieldName]!==null) && (a[finalArrayToPush[index].fieldName]!==undefined || b[finalArrayToPush[index].fieldName]!==undefined)?finalArrayToPush[index].type==="Numeric"?a[finalArrayToPush[index].fieldName]-b[finalArrayToPush[index].fieldName]:a[finalArrayToPush[index].fieldName].length-b[finalArrayToPush[index].fieldName].length:'',
                onCell: (record) => ({
                  onClick: () => {
                    drillDown(jsonToSend,finalArrayToPush[index].fieldName,record[finalArrayToPush[index].fieldName],finalArrayToPush[index].detailReportId)
                  },
                }),
                width: finalArrayToPush[index].gridlength===undefined || finalArrayToPush[index].gridlength===null ? 100 : parseInt(finalArrayToPush[index].gridlength),
                ellipsis: true,
              })          
            }
            setHeaderForDrillDown(headerArrayForDrillDown)
            setDataForDrillDown(finalGridData)
            setDrillDownTitle(record)
            setPopupForDrillDown(true)
            setTotalRecordsForDrillDown(totalRecords)

          }else{
            message.error("No Data Available")
            setLoading(false);
            setLoadingForModal(false)
          }
          }else if(reportResponse.title==="Error"){
            message.error(reportResponse.message)
            setLoadingForModal(false)
            setLoading(false)
          }
        }
      }
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  }

  /**
   * @description:-downloadData() downloads the data in CSV file.
   * @author:-Nikhil Gankar
   * @version 1.0
   * @since 31-08-2020
   */

  const downloadData = async () => {
    try {     
      await form.validateFields()
      setLoading(true)
      const inputJson = await form.getFieldsValue(true)
      /* let flagValue = ''
      if (checkedValue === 1) {
        flagValue = "Y";
      } else {
        flagValue = "N";
      }
      Object.entries(inputJson).map(([key, value]) => {
        if(value["_isAMomentObject"]){
          inputJson[key] = moment(value)
        }
        if (value === true) {
          inputJson[key] = "Y";
        }
        if (value === false) {
          inputJson[key] = "N";
        }
      }) */

      const jsonToSend = JSON.stringify(inputJson).replace(/"/g, '\\"')
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const { access_token } = getOAuthHeaders();
      const downloadMutation = {
        query: `query {
        downloadReport(reportId:"${reportId}", reportParam:"${jsonToSend}"){data, messageCode, title, message}
      }`,
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${access_token}`,
        appId: appId
      };

      const response = await Axios.post(genericUrl, downloadMutation, { headers: headers }, { async: true }, { crossDomain: true });
      const responseFromServer = response.data.data.downloadReport
      if(responseFromServer.title==="Success"){
        const fileName = responseFromServer.data
        downloadFile(fileName)
        setLoading(false)
      }else{
        message.error(responseFromServer.message)
        setLoading(false)
      }
      
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  };

  const downloadFile = (fileName)=>{
    try {
      Axios({
        url: `${fileDownloadUrl}`.concat(`${fileName}`),
        method: 'GET',
        responseType: 'blob',
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.setAttribute('id', 'downloadlink')
        link.href = fileURL
        link.setAttribute('download', `${fileName}`)
        link.click()
      })
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="view">
        <span>View</span>
      </Menu.Item>
      <Menu.Item key="download">
        <span>Download</span>
      </Menu.Item>
    </Menu>
  );

  const handleOk=()=>{
    setPopupForDrillDown(false)
  }

  const handleCancel=()=>{
    setPopupForDrillDown(false)
  }

 const onCheckBoxValueChange = e => {
    if (e.target.checked === true) {
      setCheckedValue(1)
    } else {
      setCheckedValue(0)
    }
  }

  const onSwitchChange = () => {
    if(switchValue===true){
      setSwitchValue(false)
    }else{
      setSwitchValue(true)
    }
    

  }

  const setPivotState=(data)=>{
    setPivotData(data)
  }

  const executeData=()=>{
    form.submit();
  }

  const clearData=()=>{
    form.resetFields()
    setHeaderData([])
    setMainHeaderData([]);
    setGridData([])
    setShowGridData(false)
    setSwitchAndExportButton(false)
    if(defaultValueExpression==="" || defaultValueExpression===undefined || defaultValueExpression===null ){
      // dateColNameArray.push(element.columnName)
      const date = new Date(); 
      const year = date.getFullYear(); 
      const month = date.getMonth();
      const firstDay = dateConvertor((new Date(year, month, 1)));
      const lastDay = dateConvertor((new Date(year, month + 1, 0)));
      formattedDateForButton(firstDay,lastDay)
      form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(firstDay), dateFormat), moment(new Date(lastDay), dateFormat)]})                
    }else{
       switch (defaultValueExpression) {
        case "today":
          const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
          const todayDateArray = []
          const startDate = new Date()
          const startDateDay = startDate.getDate()
          const startDateMonth = monthNames[startDate.getMonth()]
          const startDateYear = startDate.getFullYear()
          const formattedStartDate = `${startDateDay}-${startDateMonth}-${startDateYear}`
          todayDateArray.push(moment(new Date()), moment(new Date()))                            
          dateRangeColumnName.type==="DateRange"?form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(startDate), dateFormat), moment(new Date(startDate), dateFormat)]}):form.setFieldsValue({ [dateRangeColumnName.value]: moment(new Date(), dateFormat) });               
          setButtonName(formattedStartDate)
          break;
        
        case "yesterday":
          const monthNamesYesterday = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
          const yesterdayDateArray = []
          const yesterdaysDate = new Date(new Date().getTime() - 24*60*60*1000);
          const startDateDayYesterday = yesterdaysDate.getDate()
          const startDateMonthYesterday = monthNamesYesterday[yesterdaysDate.getMonth()]
          const startDateYearYesterday = yesterdaysDate.getFullYear()
          const formattedStartDateYesterday = `${startDateDayYesterday}-${startDateMonthYesterday}-${startDateYearYesterday}`
          yesterdayDateArray.push(moment(new Date(yesterdaysDate)), moment(new Date(yesterdaysDate)))
          dateRangeColumnName.type==="DateRange"?form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(startDate), dateFormat), moment(new Date(startDate), dateFormat)]}):form.setFieldsValue({ [dateRangeColumnName.value]: moment(new Date(yesterdaysDate), dateFormat) });
          setButtonName(formattedStartDateYesterday)
          break;
  
        case "lastSevenDays":
          const currDate = new Date();
          const lastSevenDay = dateConvertor(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))
          form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(lastSevenDay), dateFormat), moment(new Date(currDate), dateFormat)]})                  
          formattedDateForButton(lastSevenDay,currDate)
          break;
  
        case "lastThirtyDays":
          const currDateForThirtyDays = new Date();
          const last30Day = dateConvertor(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000))
          form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(last30Day), dateFormat), moment(new Date(currDateForThirtyDays), dateFormat)]})
          formattedDateForButton(last30Day,currDateForThirtyDays)
          break;

        case "lastNinetyDays":
          const startDateForLastNinetyDays = dateConvertor(moment().subtract(90, 'days'))
          const endDateForLastNinetyDays = dateConvertor(new Date())
          formattedDateForButton(startDateForLastNinetyDays,endDateForLastNinetyDays)
          form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(startDateForLastNinetyDays), dateFormat), moment(new Date(), dateFormat)]})
          break;

        case "lastMonth":
          const lastMonthDate = new Date();
          const lastMonthFirstDay = dateConvertor(new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth()-1, 1));
          const lastMonthLastDay = dateConvertor(new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 0));
          form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(lastMonthFirstDay), dateFormat), moment(new Date(lastMonthLastDay), dateFormat)]})
          formattedDateForButton(lastMonthFirstDay,lastMonthLastDay)
          break;
  
        case "lastYear":
          if(userCurrency==="INR"){
            const currDateCurrency = new Date()
            const fiscalYearFirstDay = dateConvertor((new Date(currDateCurrency.getFullYear()-1, 3, 1)));
            const fiscalYearLastDay = dateConvertor((new Date(currDateCurrency.getFullYear(), 2, 31)));
            form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(fiscalYearFirstDay), dateFormat), moment(new Date(fiscalYearLastDay), dateFormat)]})
            formattedDateForButton(fiscalYearFirstDay,fiscalYearLastDay)
          }else{
            const lastYearDate = new Date(new Date().getFullYear() - 1, 0, 1);
            const lastYearFirstDay = dateConvertor(new Date(lastYearDate.getFullYear(), 0, 1));
            const lastYearLastDay = dateConvertor(new Date(lastYearDate.getFullYear(), 11, 31));
            form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(lastYearFirstDay), dateFormat), moment(new Date(lastYearLastDay), dateFormat)]})
            formattedDateForButton(lastYearFirstDay,lastYearLastDay)
          }       
          break;
  
        case "thisWeek":
          let curr = new Date 
          let week = []
          for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i 
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            week.push(day)
          }
          const firstday = dateConvertor(week[0]);
          const lastday = dateConvertor(new Date());
          formattedDateForButton(firstday,lastday)
          form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(firstday), dateFormat), moment(new Date(), dateFormat)]})
          break;
   
        case "thisMonth":
          const date = new Date(); 
          const year = date.getFullYear(); 
          const month = date.getMonth();
          const firstDay = dateConvertor((new Date(year, month, 1)));
          const lastDay = dateConvertor(new Date());
          formattedDateForButton(firstDay,lastDay)
          form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(firstDay), dateFormat), moment(new Date(lastDay), dateFormat)]})
          break;
        case "thisQuarter":
          const startDateOfQuarter = dateConvertor(moment().startOf('quarter'))
          const endDateOfQuarter = dateConvertor(new Date());
          formattedDateForButton(startDateOfQuarter,endDateOfQuarter)
          form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(startDateOfQuarter), dateFormat), moment(new Date(), dateFormat)]})
          break;
        case "thisYear":
          if(userCurrency==="INR"){
            const today = new Date();
            const fiscalYearFirstDayForYearToDate = dateConvertor((new Date(today.getFullYear(), 3, 1)));
            formattedDateForButton(fiscalYearFirstDayForYearToDate,dateConvertor(today))
            form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(fiscalYearFirstDayForYearToDate), dateFormat), moment(new Date(), dateFormat)]})
          }else{
            const currentDate = new Date();
            const theFirst = dateConvertor((new Date(currentDate.getFullYear(), 0, 1)));
            formattedDateForButton(theFirst,theLast)
            form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(theFirst), dateFormat), moment(new Date(), dateFormat)]})
          }       
          break;

        case "nodate":
          if(dateRangeColumnName.type==="DateRange"){
            const date = new Date(); 
            const year = date.getFullYear(); 
            const month = date.getMonth();
            const firstDay = dateConvertor((new Date(year, month, 1)));
            const lastDay = dateConvertor((new Date(year, month + 1, 0)));
            formattedDateForButton(firstDay,lastDay)
            form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(firstDay), dateFormat), moment(new Date(lastDay), dateFormat)]})          
          }else if(dateRangeColumnName.type==="Date"){
            const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
            const startDate = new Date()
            const startDateDay = startDate.getDate()
            const startDateMonth = monthNames[startDate.getMonth()]
            const startDateYear = startDate.getFullYear()
            const formattedStartDate = `${startDateDay}-${startDateMonth}-${startDateYear}`
            form.setFieldsValue({ [dateRangeColumnName.value]: moment(new Date(), dateFormat) });
            setButtonName(formattedStartDate)  
          }
        break;

        default:
          const monthsDate = new Date(); 
          const monthsYear = monthsDate.getFullYear(); 
          const monthData = monthsDate.getMonth();
          const firstDayOfMonth = dateConvertor((new Date(monthsYear, monthData, 1)));
          const lastDayOfMonth = dateConvertor((new Date(monthsYear, monthData + 1, 0)));
          formattedDateForButton(firstDayOfMonth,lastDayOfMonth)
          form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(firstDayOfMonth), dateFormat), moment(new Date(lastDayOfMonth), dateFormat)]})  
          break;
      }
    }  
    
    /* if(dateRangeColumnName.type==="DateRange"){
      const date = new Date(); 
      const year = date.getFullYear(); 
      const month = date.getMonth();
      const firstDay = dateConvertor((new Date(year, month, 1)));
      const lastDay = dateConvertor((new Date(year, month + 1, 0)));
      formattedDateForButton(firstDay,lastDay)
      form.setFieldsValue({[dateRangeColumnName.type]:[moment(new Date(firstDay), dateFormat), moment(new Date(lastDay), dateFormat)]})          
    }else if(dateRangeColumnName.type==="Date"){
      const dateRangeValueArr = dateRangeColumnName.value
      const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
      const startDate = new Date()
      const startDateDay = startDate.getDate()
      const startDateMonth = monthNames[startDate.getMonth()]
      const startDateYear = startDate.getFullYear()
      const formattedStartDate = `${startDateDay}-${startDateMonth}-${startDateYear}`
      form.setFieldsValue({ [dateRangeValueArr]: moment(new Date(), dateFormat) });
      setButtonName(formattedStartDate)  
    } */
  }

  const downloadDrillDownData=async ()=>{
    try {
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const { access_token } = getOAuthHeaders();
      const downloadMutation = {
        query: `query {
        downloadReport(parentReportId:"${reportId}",reportId:"${drillDownId}", reportParam:"${reportParameters}"){data, messageCode, title, message}
      }`,
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${access_token}`,
        appId: appId
      };

      const response = await Axios.post(genericUrl, downloadMutation, { headers: headers }, { async: true }, { crossDomain: true });
      const responseFromServer = response.data.data.downloadReport
      if(responseFromServer.title==="Success"){
        const fileName = responseFromServer.data
        downloadFile(fileName)
        // setLoading(false)
      }else{
        message.error(responseFromServer.message)
        // setLoading(false)
      }
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
    
  }

  const dateConvertor = (str)=>{
    const date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const formattedDateForButton=(fromDate,toDate)=>{
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

    const startDate = new Date(fromDate)
    const startDateDay = startDate.getDate()
    const startDateMonth = monthNames[startDate.getMonth()]
    const startDateYear = startDate.getFullYear()

    const formattedStartDate = `${startDateDay}-${startDateMonth}-${startDateYear}`

    const endDate = new Date(toDate)
    const endDateDay = endDate.getDate()
    const endDateMonth = monthNames[endDate.getMonth()]
    const endDateYear = endDate.getFullYear()

    const formattedEndDate = `${endDateDay}-${endDateMonth}-${endDateYear}`
    const fullFormattedDate = `${formattedStartDate} to ${formattedEndDate}`   
    setButtonName(fullFormattedDate)
  }

  /* const onDateFocus=()=>{
    form.resetFields('dateRange')
  } */

  const rangeDateChange=(date,dateString)=>{
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const startDate = new Date(date[0])
    const startDateDay = startDate.getDate()
    const startDateMonth = monthNames[startDate.getMonth()]
    const startDateYear = startDate.getFullYear()

    const formattedStartDate = `${startDateDay}-${startDateMonth}-${startDateYear}`

    const endDate = new Date(date[1])
    const endDateDay = endDate.getDate()
    const endDateMonth = monthNames[endDate.getMonth()]
    const endDateYear = endDate.getFullYear()

    const formattedEndDate = `${endDateDay}-${endDateMonth}-${endDateYear}`
    const fullFormattedDate = `${formattedStartDate} to ${formattedEndDate}`
    setButtonName(fullFormattedDate)
  }

  const onDateChange=(date,dateString)=>{
   const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
   const startDate = new Date(date)
   const startDateDay = startDate.getDate()
   const startDateMonth = monthNames[startDate.getMonth()]
   const startDateYear = startDate.getFullYear()

   const formattedStartDate = `${startDateDay}-${startDateMonth}-${startDateYear}`
   setButtonName(formattedStartDate)
  }

  const selectTimeLineFilters=(value)=>{
    switch (value) {
      case "today":
        const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        const todayDateArray = []
        const dateRangeValueArr = dateRangeColumnName.value
        // getTodaysData()
        const startDate = new Date()
        const startDateDay = startDate.getDate()
        const startDateMonth = monthNames[startDate.getMonth()]
        const startDateYear = startDate.getFullYear()

        const formattedStartDate = `${startDateDay}-${startDateMonth}-${startDateYear}`
        todayDateArray.push(moment(new Date()), moment(new Date()))
        if(dateRangeColumnName.type==="DateRange"){
          form.setFieldsValue({[dateRangeColumnName.value]:[moment(new Date(), dateFormat), moment(new Date(), dateFormat)]})
        }else if(dateRangeColumnName.type==="Date"){         
          form.setFieldsValue({ [dateRangeColumnName.value]: moment(new Date(), dateFormat) });
        }
        setButtonName(formattedStartDate)
        break;
      
      case "yesterday":
        const monthNamesYesterday = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        const yesterdayDateArray = []
        const yesterdaysDate = new Date(new Date().getTime() - 24*60*60*1000);
        const startDateDayYesterday = yesterdaysDate.getDate()
        const startDateMonthYesterday = monthNamesYesterday[yesterdaysDate.getMonth()]
        const startDateYearYesterday = yesterdaysDate.getFullYear()
        const formattedStartDateYesterday = `${startDateDayYesterday}-${startDateMonthYesterday}-${startDateYearYesterday}`
        yesterdayDateArray.push(moment(new Date(yesterdaysDate)), moment(new Date(yesterdaysDate)))
        if(dateRangeColumnName.type==="DateRange"){
          form.setFieldsValue({[dateRangeColumnName.type]:[moment(new Date(yesterdaysDate), dateFormat), moment(new Date(yesterdaysDate), dateFormat)]})
        }else if(dateRangeColumnName.type==="Date"){
          form.setFieldsValue({ [dateRangeColumnName.value]: moment(new Date(yesterdaysDate), dateFormat) });
        }
        setButtonName(formattedStartDateYesterday)
        break;

      case "lastSevenDays":
        const currDate = new Date();
        const lastSevenDay = dateConvertor(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))
        form.setFieldsValue({[dateRangeColumnName.type]:[moment(new Date(lastSevenDay), dateFormat), moment(new Date(currDate), dateFormat)]})        
        formattedDateForButton(lastSevenDay,currDate)
        break;

      case "lastThirtyDays":
        const currDateForThirtyDays = new Date();
        const last30Day = dateConvertor(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000))
        form.setFieldsValue({[dateRangeColumnName.type]:[moment(new Date(last30Day), dateFormat), moment(new Date(currDateForThirtyDays), dateFormat)]})
        formattedDateForButton(last30Day,currDateForThirtyDays)
        break;
      case "lastNinetyDays":
        const startDateForLastNinetyDays = dateConvertor(moment().subtract(90, 'days'))
        const endDateForLastNinetyDays = dateConvertor(new Date())
        formattedDateForButton(startDateForLastNinetyDays,endDateForLastNinetyDays)
        form.setFieldsValue({[dateRangeColumnName.type]:[moment(new Date(startDateForLastNinetyDays), dateFormat), moment(new Date(), dateFormat)]})
        break;
      case "lastMonth":
        const lastMonthDate = new Date();
        const lastMonthFirstDay = dateConvertor(new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth()-1, 1));
        const lastMonthLastDay = dateConvertor(new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 0));
        form.setFieldsValue({[dateRangeColumnName.type]:[moment(new Date(lastMonthFirstDay), dateFormat), moment(new Date(lastMonthLastDay), dateFormat)]})
        formattedDateForButton(lastMonthFirstDay,lastMonthLastDay)
        break;

      case "lastYear":
        if(userCurrency==="INR"){
          const currDateCurrency = new Date()
          const fiscalYearFirstDay = dateConvertor((new Date(currDateCurrency.getFullYear()-1, 3, 1)));
          const fiscalYearLastDay = dateConvertor((new Date(currDateCurrency.getFullYear(), 2, 31)));
          form.setFieldsValue({[dateRangeColumnName.type]:[moment(new Date(fiscalYearFirstDay), dateFormat), moment(new Date(fiscalYearLastDay), dateFormat)]})
          formattedDateForButton(fiscalYearFirstDay,fiscalYearLastDay)
        }else{
          const lastYearDate = new Date(new Date().getFullYear() - 1, 0, 1);
          const lastYearFirstDay = dateConvertor(new Date(lastYearDate.getFullYear(), 0, 1));
          const lastYearLastDay = dateConvertor(new Date(lastYearDate.getFullYear(), 11, 31));
          form.setFieldsValue({[dateRangeColumnName.type]:[moment(new Date(lastYearFirstDay), dateFormat), moment(new Date(lastYearLastDay), dateFormat)]})
          formattedDateForButton(lastYearFirstDay,lastYearLastDay)
        }       
        break;

      case "thisWeek":
        let curr = new Date 
        let week = []
        for (let i = 1; i <= 7; i++) {
          let first = curr.getDate() - curr.getDay() + i 
          let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
          week.push(day)
        }
        const firstday = dateConvertor(week[0]);
        const lastday = dateConvertor(new Date());
        formattedDateForButton(firstday,lastday)
        form.setFieldsValue({[dateRangeColumnName.type]:[moment(new Date(firstday), dateFormat), moment(new Date(), dateFormat)]})
        break;
 
      case "thisMonth":
        const date = new Date(); 
        const year = date.getFullYear(); 
        const month = date.getMonth();
        const firstDay = dateConvertor((new Date(year, month, 1)));
        const lastDay = dateConvertor(new Date());
        formattedDateForButton(firstDay,lastDay)
        form.setFieldsValue({[dateRangeColumnName.type]:[moment(new Date(firstDay), dateFormat), moment(new Date(), dateFormat)]})
        break;
      case "thisQuarter":
        const startDateOfQuarter = dateConvertor(moment().startOf('quarter'))
        const endDateOfQuarter = dateConvertor(new Date());
        formattedDateForButton(startDateOfQuarter,endDateOfQuarter)
        form.setFieldsValue({[dateRangeColumnName.type]:[moment(new Date(startDateOfQuarter), dateFormat), moment(new Date(), dateFormat)]})
        break;
      case "thisYear":
        if(userCurrency==="INR"){
          const today = new Date();
          const fiscalYearFirstDayForYearToDate = dateConvertor((new Date(today.getFullYear(), 3, 1)));
          formattedDateForButton(fiscalYearFirstDayForYearToDate,dateConvertor(today))
          form.setFieldsValue({[dateRangeColumnName.type]:[moment(new Date(fiscalYearFirstDayForYearToDate), dateFormat), moment(new Date(), dateFormat)]})
        }else{
          const currentDate = new Date();
          const theFirst = dateConvertor((new Date(currentDate.getFullYear(), 0, 1)));
          // const theLast = dateConvertor((new Date(currentDate.getFullYear(), 11, 31)));
          formattedDateForButton(theFirst,theLast)
          form.setFieldsValue({[dateRangeColumnName.type]:[moment(new Date(theFirst), dateFormat), moment(new Date(), dateFormat)]})
        }       
        break;
      default:
        message.info("Select proper time line filter")
        break;
    }  

  }

  const focusedRangePicker=()=>{
    form.resetFields(['dateRange'])
  }

  const focusedDatePicker=()=>{
    form.resetFields(['dateRange'])
  }

  const dateMenu = (
    
    <Card style={{ padding: "8px" }}>
      <Form preserve={false} layout="vertical" form={form} onFinish={onFinish}  onFinishFailed={onFinishFailed}>
        {reportDateOptionsFlag === true ? (
          <Row>
            <Col span={24}>
              <Form.Item label="Date Range" name="dateRange" rules={[{ required: false }]}>
                <Select
                  allowClear
                  showSearch
                  // dropdownStyle={{width:"100%",height:'100%'}}
                  placeholder="---Select timeline---"
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  dropdownMatchSelectWidth={false}
                  onSelect={selectTimeLineFilters}
                >
                  {dateRangeColumnName.type === "DateRange" ? (
                    <>
                      <Option key="1" value="today">
                        Today
                      </Option>
                      <Option key="2" value="yesterday">
                        Yesterday
                      </Option>
                      <Option key="3" value="lastSevenDays">
                        Last 7 days
                      </Option>
                      <Option key="4" value="lastThirtyDays">
                        Last 30 days
                      </Option>
                      <Option key="5" value="lastNinetyDays">Last 90 days</Option>
                      <Option key="6" value="lastMonth">
                        Last month
                      </Option>
                      <Option key="7" value="lastYear">
                        Last year
                      </Option>
                      <Option key="8" value="thisWeek">
                        Week to date
                      </Option>
                      <Option key="9" value="thisMonth">
                        Month to date
                      </Option>
                      <Option key="10" value="thisQuarter">Quarter to date</Option>
                      <Option key="11" value="thisYear">Year to date</Option>
                    </>
                  ) : (
                    <>
                      <Option key="1" value="today">
                        Today
                      </Option>
                      <Option key="2" value="yesterday">
                        Yesterday
                      </Option>
                    </>
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        ) : (
          ""
        )}
        <br />
        <Row gutter={8}>
          {reportFiltersForDatePopup !== undefined
            ? reportFiltersForDatePopup.map((filtersData, index) => {
                return (
                  <Col
                    span={/* filtersData.type === "Date" ? 20 :  */ 24}
                    key={index}
                    style={{ display: filtersData.type === "DateRange" || filtersData.type === "Date" ? "block" : "none" }}
                  >
                    <Form.Item
                      label={filtersData.displayName}
                      name={filtersData.columnName}
                      rules={[
                        {
                          required: filtersData.mandatory === "N" ? false : true,
                          message: `Please Enter ${filtersData.displayName}`,
                        },
                      ]}
                    >
                      {filtersData.type === "DateRange" ? (
                        <RangePicker format={dateFormat} onChange={rangeDateChange} onFocus={focusedRangePicker} />
                        
                      ) : filtersData.type === "Date" ? (
                        <DatePicker format={dateFormat} onChange={onDateChange} onFocus={focusedDatePicker} style={{ width: "100%" }} />
                      ) : (
                        ""
                      )}
                    </Form.Item>
                    <br />
                  </Col>
                );
              })
            : null}
        </Row>
        <br />
      </Form>
    </Card>
  );

  const handleFilterDropdownVisibleChange=(flag)=>{
    setFilterDropdownVisible(flag)
  }

  const viewMoreLessFiltersFunction=()=>{
    if(viewMoreLessFilters===false){
      setViewMoreLessFilters(true)
    }else{
      setViewMoreLessFilters(false)
    }
  }

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const onChange = (e, i) => {
    let unCheckColumns = [...unCheckedColumns];
    if (e.target.checked) {
      unCheckColumns = unCheckColumns.filter(id => {return id !== e.target.id});
    } else if (!e.target.checked) {
      unCheckColumns.push(e.target.id);
    };
    let filteredColumns = [...mainHeaderData];
    let mainData = [...mainHeaderData];
    for (let i = 0; i < unCheckColumns.length; i++) {
      filteredColumns = filteredColumns.filter(el => {return el.title !== unCheckColumns[i]});
    };
    mainData.map(item => {
      if (item.title === e.target.id) {
        item.checked = e.target.checked;
      }
    });
    setHeaderData(filteredColumns);
    setMainHeaderData(mainData);
    setUnCheckedColumns(unCheckColumns);
  };

  const hideMenu = () => {
    return (
      <Menu
        key="1"
        style={{
          overflowY: "scroll",
          maxHeight: "15rem",
        }}
      >
        {mainHeaderData.map((item, index) => {
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

  const sendEmail=()=>{
    emailForm.submit();
  }

  const getDefaultContent = () => {
    const lowerSubMenuItem = localStorage.getItem("lowerSubMenuItem");
    let dateRangeMessage = "";
  
    if (dateRange) {
      dateRangeMessage = ` from ${dateRange} `;
    }else{
      if (startDate && endDate) {
        dateRangeMessage = ` dated from ${startDate} to ${endDate}`;
      }
    }
   
    return `Hello,
  
    Please find the <a href="${emailAttachment}">link</a> for ${lowerSubMenuItem} Report ${dateRangeMessage}.
    If you have any questions or need assistance, feel free to contact us.`;
  };

  const emailReport=async ()=>{ 
    try {     
      await form.validateFields()
      const inputJson = await form.getFieldsValue(true)
      /* let flagValue = ''
      if (checkedValue === 1) {
        flagValue = "Y";
      } else {
        flagValue = "N";
      }
      Object.entries(inputJson).map(([key, value]) => {
        if(value["_isAMomentObject"]){
          inputJson[key] = moment(value)
        }
        if (value === true) {
          inputJson[key] = "Y";
        }
        if (value === false) {
          inputJson[key] = "N";
        }
      }) */

      const jsonToSend = JSON.stringify(inputJson).replace(/"/g, '\\"')
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const { access_token } = getOAuthHeaders();
      const downloadMutation = {
        query: `query {
        downloadReport(reportId:"${reportId}", reportParam:"${jsonToSend}"){data, messageCode, title, message}
      }`,
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${access_token}`,
        appId: appId
      };

      const response = await Axios.post(genericUrl, downloadMutation, { headers: headers }, { async: true }, { crossDomain: true });
      const responseFromServer = response.data.data.downloadReport
      if(responseFromServer.title==="Success"){
        const fileName = responseFromServer.data
        setEmailAttachment(fileName)
        setEmailReportPopup(true)
        setLoading(false)
      }else{
        message.error(responseFromServer.message)
        setLoading(false)
      }
      
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  
}

  const onEmailFormFinish=async (values)=>{
    try {
      setLoadingForEmail(true)
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const { access_token } = getOAuthHeaders();
      const {attachment,body,cc,from,replyTo,subject,to}=values
      const bodyString = body ? JSON.stringify(body) : null;
      const emailMutation = {
        query: `query {
          sendEmail(
            fromEmailId: ${from===null || from===undefined ?null:`"${from}"`}, 
            replyTo:${replyTo===null || replyTo===undefined ?null:`"${replyTo}"`}, 
            toEmailIds:${to===null || to===undefined ?null:`"${to}"`},
            ccEmailIds:${cc===null || cc===undefined ?null:`"${cc}"`},
            subject:${subject===null || subject===undefined ?null:`"${subject}"`},
            body: ${bodyString},
            attachmentPath:${attachment===null || attachment===undefined ?null:`"${attachment}"`}
            ) {
              messageCode
              title
              message
          }
      }`,
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${access_token}`,
        appId: appId
      };

      const response = await Axios.post(genericUrl, emailMutation, { headers: headers }, { async: true }, { crossDomain: true });
      const responseFromServer = response.data.data.sendEmail
        if (responseFromServer.title === "Success") {
          message.success(responseFromServer.message);
          setEmailReportPopup(false);
          setLoadingForEmail(false)
          emailForm.resetFields()
        } else {
          message.error(responseFromServer.message);
          setLoadingForEmail(false)
        }

    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  }

  const closeEmail=()=>{
    setEmailReportPopup(false)
    emailForm.resetFields();
  }

  const getReportScheduler = () =>{
    form.validateFields().then(values => {
     const formData = form.getFieldsValue(true)
      setBasescreenFormData(formData)
      setReportSchedulerVisible(true)
      getExistigScheduleData()
    })
  }

  const getExistigScheduleData = () =>{
    setloadingForSReport(true)
    // const newToken = JSON.parse(localStorage.getItem("authTokens"));
    const { access_token } = getOAuthHeaders();
    const getProducts = {
      query: `query{
        getScheduleReport(reportId:"${reportId}"){
        cSReportScheduleId
        frequency
        scheduleinfo
        startDate
        nextSchDate
        lastRunDate
        createdByName
    }
    }`,
    }
    Axios({
      url: genericUrl,
      method: 'POST',
      data: getProducts,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${access_token}`,
        appId: appId
      },
    }).then(response => {
      if(response.status === 200){
        const data = response.data.data.getScheduleReport
        for (let index = 0; index < data.length; index++) {
          data[index].srNo = index + 1
        }
        setScheduledData(data)
      }
      setloadingForSReport(false)
    })
  }

  const closeReportScheduler = () =>{
    setReportSchedulerVisible(false)
    scheduleReportForm.resetFields()
    setSelectedRecordToUpdate(null)
  }

  const onConfirmScheduleReport = () =>{
    // const newToken = JSON.parse(localStorage.getItem("authTokens"));
    const { access_token } = getOAuthHeaders();
    scheduleReportForm.validateFields().then(values => {
      setloadingForSReport(true)
      const formData = scheduleReportForm.getFieldsValue(true)
       const start_date = moment(formData.startdate_time).format('YYYY-MM-DD HH:mm:ss')
       const allparams = {
         params:basescreenFormData,
         recipients:formData.recipient
       }
       const stringifiedJSON = JSON.stringify(allparams);
       const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
       const upsertScheduleReports = {
        query: `mutation{
          upsertScheduleReport(reportSchedule:{ 
              cSReportScheduleId:${selectedRecordToupdate === null || selectedRecordToupdate === undefined ? null : `"${selectedRecordToupdate.cSReportScheduleId}"`}
              csReportId:"${reportId}"
              frequency:"${formData.frequency}"
              scheduleinfo:"${jsonToSend}"
              startDate:"${start_date}"
              nextSchDate:${selectedRecordToupdate === null || selectedRecordToupdate === undefined ? null : `"${selectedRecordToupdate.nextSchDate}"`}
              lastRunDate:${selectedRecordToupdate === null || selectedRecordToupdate === undefined ? null : `"${selectedRecordToupdate.lastRunDate}"`}
          })
          {
              messageCode
              message
          }
      }`,
      }
      Axios({
        url: genericUrl,
        method: 'POST',
        data: upsertScheduleReports,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${access_token}`,
          appId: appId
        },
      }).then(response => {
        if(response.data.data.upsertScheduleReport.messageCode === "200"){
          message.success(response.data.data.upsertScheduleReport.message)
          setloadingForSReport(false)
          setReportSchedulerVisible(false)
          setSelectedRecordToUpdate(null)
          scheduleReportForm.resetFields()
        }else{
          message.error(response.data.data.upsertScheduleReport.message)
          setloadingForSReport(false)
        }
      })
     })
  }

  const editScheduledReport = (text) =>{
    const data1 = JSON.parse(text.scheduleinfo) 
    const startDate = moment(text.startDate).format("YYYY-MM-DD HH:mm:ss")
    scheduleReportForm.setFieldsValue({
      'recipient':data1.recipients,
      'startdate_time':moment(startDate),
      'frequency':text.frequency,
    })
    setSelectedRecordToUpdate(text)
  }

  const deleteScheduledReport = (text) =>{
    // const newToken = JSON.parse(localStorage.getItem("authTokens"));
    const { access_token } = getOAuthHeaders();
    setloadingForSReport(true)
    const deleteReport = {
      query: `mutation{
        deleteScheduleReport(cSReportScheduleId:"${text.cSReportScheduleId}") 
        {
            messageCode
            message
        }
    }`,
    }
    Axios({
      url: genericUrl,
      method: 'POST',
      data: deleteReport,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${access_token}`,
        appId: appId
      },
    }).then(response => {
      if(response.data.data.deleteScheduleReport.messageCode === "200"){
        message.success(response.data.data.deleteScheduleReport.message)
        setloadingForSReport(false)
        getExistigScheduleData()
      }else{
        message.error(response.data.data.deleteScheduleReport.message)
        setloadingForSReport(false)
      }
    })
  }

  const columnsforReportScheduler = [
    {
      title: '',
      dataIndex: '',
      width: 80,
      render: (text, row) => (
        <span>
          <span
      style={{cursor:'pointer'}}
      role="presentation"
      onClick={() => {
        editScheduledReport(text)
      }}
    >
      <EditOutlined />
    </span>
    <span>&nbsp;&nbsp;&nbsp;
    <span
      style={{cursor:'pointer'}}
      role="presentation"
      onClick={()=>deleteScheduledReport(text)}
    >
      <DeleteOutlined />
    </span>
    </span>
        </span>
      )
    },
    {
      title: 'No',
      dataIndex: 'srNo',
    },
    {
      title: 'Created By',
      dataIndex: 'createdByName',
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
    },
    {
      title: 'Last Run Date',
      dataIndex: 'lastRunDate',
    },
  ]

  return (
    <Spin indicator={<LoadingOutlined style={{ fontSize: "52px" }} spin />} spinning={loading}>
      {innerWidth > 1004 ?
        <span>
        <Row>
        <Col span={16}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
          <span className="formRecordTitle" style={{ fontWeight: "600", fontSize: "20px",fontFamily:'Inter' }}>{reportName}</span>
          {dateRangeColumnName.type === "" || reportDateOptionsFlag === false ? null : (
            <span>
              &emsp;
              <Dropdown overlay={dateMenu} trigger={["click"]} visible={filterDropdownVisible} onVisibleChange={handleFilterDropdownVisibleChange}>
                <Tag className="tagReport" style={{ cursor: "pointer" }}>
                  {<span style={{ fontWeight: "600" }}>{buttonName}</span>}&nbsp;
                  <CalendarOutlined />
                </Tag>
              </Dropdown>
            </span>
          )}
          </div>
        </Col>
        {/* <Col span={6} /> */}
        <Col span={8}>
          <span style={{ float: "right" }}>
            <>
              {reportFiltersForNextRow.length > 0 ? (
                <Tooltip placement="topLeft" title={viewMoreLessFilters === false ? "View More" : "View Less"}>
                  {viewMoreLessFilters === false ? (
                    <Button color="primary" style={listActionButtons}>
                      <img style={{ paddingBottom: "5px", paddingLeft: "1px", cursor: "pointer" }} onClick={viewMoreLessFiltersFunction} src={showMore} alt="clear" />
                    </Button>
                  ) : (
                    <Button color="primary" style={listActionButtons}>
                      <img style={{ paddingBottom: "5px", paddingLeft: "1px", cursor: "pointer" }} onClick={viewMoreLessFiltersFunction} src={showLess} alt="clear" />
                    </Button>
                  )}
                </Tooltip>
              ) : (
                ""
              )}
            </>
            <>
            {scheduledReportFlag === true ? 
              <Tooltip placement="topLeft" title="Report Scheduler">
              <Button color="primary" style={listActionButtons}>
                <img style={{ paddingBottom: "5px", paddingLeft: "1px", cursor: "pointer" }} onClick={getReportScheduler} src={ReportIcon} alt="reportscheduler" />
              </Button>
            </Tooltip>
            :null}
              <Tooltip placement="topLeft" title="Clear">
                <Button color="primary" style={listActionButtons}>
                  <img style={{ paddingBottom: "5px", paddingLeft: "1px", cursor: "pointer" }} onClick={clearData} src={clearReportData} alt="clear" />
                </Button>
              </Tooltip>
              {reportDownloadFlag === true ? (
                <Tooltip placement="topLeft" title="Export">
                  <Button color="primary" style={listActionButtons}>
                    <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "18px", cursor: "pointer" }} src={Export} alt="invoice" onClick={downloadData} />
                  </Button>
                </Tooltip>
              ) : (
                ""
              )}
            </>
            {showSwitchAndExportButton === true ? (
              <>
                <Tooltip placement="topLeft" title="Email">
                  <Button style={listActionButtons}>
                    <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "18px", cursor: "pointer" }} onClick={emailReport} src={Envelop} alt="email" />
                  </Button>
                </Tooltip>
                {/* &nbsp; */}
                {reportPivotFlag === true ? (
                  <Tooltip placement="topLeft" title="Pivot View">
                    <Button color="primary" style={listActionButtons}>
                      <img style={{ paddingBottom: "5px", paddingLeft: "1px", cursor: "pointer" }} onClick={onSwitchChange} src={switchPivot} alt="invoice" />
                    </Button>
                  </Tooltip>
                ) : (
                  ""
                )}
                {/* &nbsp; */}
                <Dropdown trigger={["click"]} overlay={hideMenu} onVisibleChange={handleVisibleChange} visible={visible}>
                  <Tooltip title="Show/Hide Columns" placement="topLeft">
                    <Button color="primary" style={listActionButtons}>
                      <img style={{ paddingBottom: "5px", paddingLeft: "1px", cursor: "pointer" }} src={ShowAndHide} alt="invoice" />
                    </Button>
                  </Tooltip>
                </Dropdown>
              </>
            ) : (
              ""
            )}
          </span>
        </Col>
      </Row>
      <br/>
      {innerWidth<768?<Row gutter={8} style={{backgroundColor:'white',height:95,padding:'10px',borderRadius:4,boxShadow:'0px 2px 2px rgba(0, 0, 0, 0.1)'}}>
        <Col span={22}>
          <Row gutter={8}>
            {reportFilters !== undefined
              ? reportFilters.map((filtersData, index) => {
                  return (
                    <Col
                      span={5}
                      key={index}
                      style={{
                        display:
                          filtersData.isForPrompting === "N" || filtersData.isactive === "N" || filtersData.type === "DateRange" || filtersData.type === "Date" ? "none" : "block",
                      }}
                    >
                      <Form preserve={false} form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                        <Form.Item
                          style={{fontFamily:'Inter',fontWeight:'bold',color:Themes.appTheme.primaryColor}}
                          label={filtersData.type === "DateRange" || filtersData.type === "Date" ? null : filtersData.displayName}
                          name={filtersData.type === "DateRange" || filtersData.type === "Date" ? null : filtersData.columnName}
                          rules={[
                            {
                              required: filtersData.mandatory === "N" || filtersData.type === "DateRange" || filtersData.type === "Date" ? false : true,
                              message: `Please Enter ${filtersData.displayName}`,
                            },
                          ]}
                        >
                          {filtersData.type === "MultiSelector" ? (
                            <Select
                              style={{ width: "100%" }}
                              onSearch={searchDropdownRecords}
                              mode="multiple"
                              maxTagCount={1}
                              dropdownStyle={{width:"12%"}}
                              showSearch
                              allowClear
                              placeholder={
                                <>
                                 <span style={{fontFamily:'Inter',fontSize:12}}>Select</span>
                                 <img src={arrowIcon} style={{float:'right',marginTop:10}}/>
                                </>
                              }
                              // loading
                              // notFoundContent={fetching ? <Spin size="small" /> : null}
                              dropdownMatchSelectWidth={false}
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              onFocus={() => onDropDownSelect(filtersData.id,filtersData.dependentId)}
                            >
                              {/* {dropdownList} */}
                              {/* <Spin indicator={<LoadingOutlined style={{ fontSize: "20px" }} spin />} spinning={fetching}> */}
                              {dropdownDetails === null || dropdownDetails === undefined
                                ? null
                                : dropdownDetails.map((data) => {
                                    return (
                                      <Option key={data.recordid} value={data.recordid === undefined || data.recordid === null ? data.name :data.recordid}>
                                        {data.name}
                                      </Option>
                                    );
                                  })}
                            </Select>
                          ) : filtersData.type === "List" ? (
                            <Select
                              showSearch
                              allowClear
                              dropdownStyle={{width:"12%"}}
                              // notFoundContent={fetching ? <Spin size="small" /> : null}
                              placeholder={<span style={{fontFamily:'Inter',fontSize:12}}>Select</span>}
                              dropdownMatchSelectWidth={false}
                              style={{ width: "100%" }}
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              onFocus={() => onDropDownSelectForListReference(filtersData.Values)}
                            >
                              {referenceListDetails === null || referenceListDetails === undefined
                                ? null
                                : referenceListDetails.map((data) => {
                                    return (
                                      <Option key={data.key} title={data.key} value={data.key}>
                                        {data.value}
                                      </Option>
                                    );
                                  })}
                            </Select>
                          ) : filtersData.type === "Selector" ? (
                            <Select
                              showSearch
                              allowClear
                              dropdownStyle={{width:"12%"}}
                              // notFoundContent={fetching ? <Spin size="small" /> : null}
                              dropdownMatchSelectWidth={false}
                              style={{ width: "100%",borderRadius:'4px' }}
                              placeholder={<span style={{fontFamily:'Inter',fontSize:12}}>Select</span>}
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              onFocus={() => onDropDownSelect(filtersData.id,filtersData.dependentId)}
                            >
                              {dropdownDetails === null || dropdownDetails === undefined
                                ? null
                                : dropdownDetails.map((data) => {
                                    return (
                                      <Option key={data.recordid} value={data.recordid === undefined || data.recordid === null ? data.name :data.recordid}>
                                        {data.name}
                                      </Option>
                                    );
                                  })}
                            </Select>
                          ) : filtersData.type === "Flag" ? (
                            <Checkbox checked={checkedValue} onChange={onCheckBoxValueChange} />
                          ) : filtersData.type === "Numeric" ?  (
                            <InputNumber style={{width:"100%"}} />
                          ) : <Input /> 
                          }
                        </Form.Item>
                      </Form>
                      <br />
                    </Col>
                  );
                })
              : ""}
          </Row>
        </Col>
        <Col span={2}>
            <Button  style={{ height: "36px",float:'right', borderRadius: "4px",  fontFamily: "Inter", fontWeight: 700, color: "#FFFFFF",marginTop:'21%' }} type="primary" onClick={executeData}>
              Run
            </Button>
        </Col>
      </Row>:""}
      </span> : null}
      {innerWidth > 1004 ? null:
      <span>
      <Row gutter={8} style={{height:53,backgroundColor:'white',borderBottom:"1px solid #E8EEF2"}}>
          <Col {...responsiveButtonMobileIn} style={{ padding: "2%" }}>
            <img src={ToggleIcon} style={{ cursor: "pointer", paddingBottom: "2px" }} onClick={onTogMenu} alt="" />
            &nbsp;&nbsp;&nbsp;
            <span style={{ fontFamily: "Inter", opacity: 0.5 }}>{subMenuItem}</span>
          </Col>
          <Col {...responsiveDesignForButtons} style={{ padding: "1.3%" }}>
          <span style={{ float: "right" }}>
            <>
              {reportFiltersForNextRow.length > 0 ? (
                <Tooltip placement="topLeft" title={viewMoreLessFilters === false ? "View More" : "View Less"}>
                  {viewMoreLessFilters === false ? (
                    <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                      <img style={{ paddingBottom: "5px", paddingLeft: "1px", cursor: "pointer" }} onClick={viewMoreLessFiltersFunction} src={showMore} alt="clear" />
                    </Button>
                  ) : (
                    <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                      <img style={{ paddingBottom: "5px", paddingLeft: "1px", cursor: "pointer" }} onClick={viewMoreLessFiltersFunction} src={showLess} alt="clear" />
                    </Button>
                  )}
                </Tooltip>
              ) : (
                ""
              )}
            </>
            <>
            {scheduledReportFlag === true ? 
              <Tooltip placement="topLeft" title="Report Scheduler">
              <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                <img style={{ paddingBottom: "5px", paddingLeft: "1px", cursor: "pointer" }} onClick={getReportScheduler} src={ReportIcon} alt="reportscheduler" />
              </Button>
            </Tooltip>
            :null}
              <Tooltip placement="topLeft" title="Clear">
                <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                  <img style={{ paddingBottom: "5px", paddingLeft: "1px", cursor: "pointer" }} onClick={clearData} src={clearReportData} alt="clear" />
                </Button>
              </Tooltip>
              {reportDownloadFlag === true ? (
                <Tooltip placement="topLeft" title="Export">
                  <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                    <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "18px", cursor: "pointer" }} src={Export} alt="invoice" onClick={downloadData} />
                  </Button>
                </Tooltip>
              ) : (
                ""
              )}
            </>
            {showSwitchAndExportButton === true ? (
              <>
                <Tooltip placement="topLeft" title="Email">
                  <Button style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                    <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "18px", cursor: "pointer" }} onClick={emailReport} src={Envelop} alt="email" />
                  </Button>
                </Tooltip>
                {/* &nbsp; */}
                {reportPivotFlag === true ? (
                  <Tooltip placement="topLeft" title="Pivot View">
                    <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                      <img style={{ paddingBottom: "5px", paddingLeft: "1px", cursor: "pointer" }} onClick={onSwitchChange} src={switchPivot} alt="invoice" />
                    </Button>
                  </Tooltip>
                ) : (
                  ""
                )}
                {/* &nbsp; */}
                <Dropdown trigger={["click"]} overlay={hideMenu} onVisibleChange={handleVisibleChange} visible={visible}>
                  <Tooltip title="Show/Hide Columns" placement="topLeft">
                    <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                      <img style={{ paddingBottom: "5px", paddingLeft: "1px", cursor: "pointer" }} src={ShowAndHide} alt="invoice" />
                    </Button>
                  </Tooltip>
                </Dropdown>
              </>
            ) : (
              ""
            )}
            {
              innerWidth > 768 ? null : 
                  <Tooltip title="Show Filters" placement="topLeft">
                    <Button onClick={()=>FilterModal(true)} color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                      <img style={{ paddingBottom: "5px", paddingLeft: "1px", cursor: "pointer" }} src={Filters} alt="invoice" />
                    </Button>
                  </Tooltip>
            }
          </span>
        </Col>
      </Row>
        <br/>
        <Row style={{padding:'1%'}}>
          <Col span={9}>
            <span className="formRecordTitle" style={{ fontWeight: "600",display:"inline-block", fontSize: "20px",fontFamily:'Inter' }}>{reportName}</span>
          </Col>
          <Col span={15}>
          {dateRangeColumnName.type === "" || reportDateOptionsFlag === false ? null : (
            <span>
              &emsp;
              <Dropdown overlay={dateMenu} trigger={["click"]} visible={filterDropdownVisible} onVisibleChange={handleFilterDropdownVisibleChange}>
                <Tag className="tagReport" style={{ cursor: "pointer" }}>
                  {<span style={{ fontWeight: "600" }}>{buttonName}</span>}&nbsp;
                  <CalendarOutlined />
                </Tag>
              </Dropdown>
            </span>
          )}
          </Col>
        </Row>
      </span>}
      {innerWidth > 768?
      <Row gutter={8} style={{backgroundColor:'white',padding:'10px',borderRadius:4,boxShadow:'0px 2px 2px rgba(0, 0, 0, 0.1)'}}>
        <Col span={22}>
          <Row gutter={8}>
            {reportFilters !== undefined
              ? reportFilters.map((filtersData, index) => {
                  return (
                    <Col
                      span={5}
                      key={index}
                      style={{
                        display:
                          filtersData.isForPrompting === "N" || filtersData.isactive === "N" || filtersData.type === "DateRange" || filtersData.type === "Date" ? "none" : "block",
                      }}
                    >
                      <Form preserve={false} form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                        <Form.Item
                          style={{fontFamily:'Inter',fontWeight:'bold',color:Themes.appTheme.primaryColor}}
                          label={filtersData.type === "DateRange" || filtersData.type === "Date" ? null : filtersData.displayName}
                          name={filtersData.type === "DateRange" || filtersData.type === "Date" ? null : filtersData.columnName}
                          rules={[
                            {
                              required: filtersData.mandatory === "N" || filtersData.type === "DateRange" || filtersData.type === "Date" ? false : true,
                              message: `Please Enter ${filtersData.displayName}`,
                            },
                          ]}
                        >
                          {filtersData.type === "MultiSelector" ? (
                            <Select
                              style={{ width: "100%" }}
                              onSearch={searchDropdownRecords}
                              mode="multiple"
                              maxTagCount={1}
                              dropdownStyle={{width:"12%"}}
                              showSearch
                              allowClear
                              placeholder={
                                <>
                                 <span style={{fontFamily:'Inter',fontSize:12}}>Select</span>
                                 <img src={arrowIcon} style={{float:'right',marginTop:10}}/>
                                </>
                              }
                              // loading
                              // notFoundContent={fetching ? <Spin size="small" /> : null}
                              dropdownMatchSelectWidth={false}
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              onFocus={() => onDropDownSelect(filtersData.id,filtersData.dependentId)}
                            >
                              {/* {dropdownList} */}
                              {/* <Spin indicator={<LoadingOutlined style={{ fontSize: "20px" }} spin />} spinning={fetching}> */}
                              {dropdownDetails === null || dropdownDetails === undefined
                                ? null
                                : dropdownDetails.map((data) => {
                                    return (
                                      <Option key={data.recordid} value={data.recordid === undefined || data.recordid === null ? data.name :data.recordid}>
                                        {data.name}
                                      </Option>
                                    );
                                  })}
                            </Select>
                          ) : filtersData.type === "List" ? (
                            <Select
                              showSearch
                              allowClear
                              dropdownStyle={{width:"12%"}}
                              // notFoundContent={fetching ? <Spin size="small" /> : null}
                              placeholder={<span style={{fontFamily:'Inter',fontSize:12}}>Select</span>}
                              dropdownMatchSelectWidth={false}
                              style={{ width: "100%" }}
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              onFocus={() => onDropDownSelectForListReference(filtersData.Values)}
                            >
                              {referenceListDetails === null || referenceListDetails === undefined
                                ? null
                                : referenceListDetails.map((data) => {
                                    return (
                                      <Option key={data.key} title={data.key} value={data.key}>
                                        {data.value}
                                      </Option>
                                    );
                                  })}
                            </Select>
                          ) : filtersData.type === "Selector" ? (
                            <Select
                              showSearch
                              allowClear
                              dropdownStyle={{width:"12%"}}
                              // notFoundContent={fetching ? <Spin size="small" /> : null}
                              dropdownMatchSelectWidth={false}
                              style={{ width: "100%",borderRadius:'4px' }}
                              placeholder={<span style={{fontFamily:'Inter',fontSize:12}}>Select</span>}
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              onFocus={() => onDropDownSelect(filtersData.id,filtersData.dependentId)}
                            >
                              {dropdownDetails === null || dropdownDetails === undefined
                                ? null
                                : dropdownDetails.map((data) => {
                                    return (
                                      <Option key={data.recordid} value={data.recordid === undefined || data.recordid === null ? data.name :data.recordid}>
                                        {data.name}
                                      </Option>
                                    );
                                  })}
                            </Select>
                          ) : filtersData.type === "Flag" ? (
                            <Checkbox checked={checkedValue} onChange={onCheckBoxValueChange} />
                          ) : filtersData.type === "Numeric" ?  (
                            <InputNumber style={{width:"100%"}} />
                          ) : <Input /> 
                          }
                        </Form.Item>
                      </Form>
                      <br />
                    </Col>
                  );
                })
              : ""}
          </Row>
        </Col>
        <Col span={2}>
            <Button  style={{ height: "36px",float:'right', borderRadius: "4px",width:"80%",  fontFamily: "Inter", fontWeight: 700, color: "#FFFFFF",marginTop:'21%' }} type="primary" onClick={executeData}>
              Run
            </Button>
        </Col>
      </Row>:null}
      
      {viewMoreLessFilters === true ? (
        <Row style={{marginTop:7}}>
          <Col span={24}>
            <Row gutter={8}>
              {reportFiltersForNextRow !== undefined
                ? reportFiltersForNextRow.map((filtersData, index) => {
                    return (
                      <Col
                        span={4}
                        key={index}
                        style={{
                          display:
                            filtersData.isForPrompting === "N" || filtersData.isactive === "N" || filtersData.type === "DateRange" || filtersData.type === "Date"
                              ? "none"
                              : "block",
                        }}
                      >
                        <Form preserve={false} form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                          <Form.Item
                            label={filtersData.type === "DateRange" || filtersData.type === "Date" ? null : filtersData.displayName}
                            name={filtersData.type === "DateRange" || filtersData.type === "Date" ? null : filtersData.columnName}
                            rules={[
                              {
                                required: filtersData.mandatory === "N" || filtersData.type === "DateRange" || filtersData.type === "Date" ? false : true,
                                message: `Please Enter ${filtersData.displayName}`,
                              },
                            ]}
                          >
                            {filtersData.type === "MultiSelector" ? (
                              <Select
                                style={{ width: "100%" }}
                                onSearch={searchDropdownRecords}
                                mode="multiple"
                                maxTagCount={1}
                                showSearch
                                allowClear
                                // loading
                                // notFoundContent={fetching ? <Spin size="small" /> : null}
                                dropdownMatchSelectWidth={false}
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onFocus={() => onDropDownSelect(filtersData.id,filtersData.dependentId)}
                              >
                                {/* {dropdownList} */}
                                {/* <Spin indicator={<LoadingOutlined style={{ fontSize: "20px" }} spin />} spinning={fetching}> */}
                                {dropdownDetails === null || dropdownDetails === undefined
                                  ? null
                                  : dropdownDetails.map((data) => {
                                      return (
                                        <Option key={data.recordid} value={data.recordid === undefined || data.recordid === null ? data.name :data.recordid}>
                                          {data.name}
                                        </Option>
                                      );
                                    })}
                              </Select>
                            ) : filtersData.type === "List" ? (
                              <Select
                                showSearch
                                allowClear
                                // notFoundContent={fetching ? <Spin size="small" /> : null}
                                dropdownMatchSelectWidth={false}
                                style={{ width: "100%" }}
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onFocus={() => onDropDownSelectForListReference(filtersData.Values)}
                              >
                                {referenceListDetails === null || referenceListDetails === undefined
                                  ? null
                                  : referenceListDetails.map((data) => {
                                      return (
                                        <Option key={data.key} title={data.key} value={data.key}>
                                          {data.value}
                                        </Option>
                                      );
                                    })}
                              </Select>
                            ) : filtersData.type === "Selector" ? (
                              <Select
                                showSearch
                                allowClear
                                // notFoundContent={fetching ? <Spin size="small" /> : null}
                                dropdownMatchSelectWidth={false}
                                style={{ width: "100%" }}
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onFocus={() => onDropDownSelect(filtersData.id,filtersData.dependentId)}
                              >
                                {dropdownDetails === null || dropdownDetails === undefined
                                  ? null
                                  : dropdownDetails.map((data) => {
                                      return (
                                        <Option key={data.recordid} value={data.recordid === undefined || data.recordid === null ? data.name :data.recordid}>
                                          {data.name}
                                        </Option>
                                      );
                                    })}
                              </Select>
                            ) : filtersData.type === "Flag" ? (
                              <Checkbox checked={checkedValue} onChange={onCheckBoxValueChange} />
                            ) : (
                              ""
                            )}
                          </Form.Item>
                        </Form>
                        <br />
                      </Col>
                    );
                  })
                : ""}
            </Row>
          </Col>
        </Row>
      ) : null}

      <Row gutter={8} style={{marginTop:7}}>
        {switchValue === false ? (
          <Col className="reportCol" span={24} style={{ marginBottom: "8px",padding:0 }}>
            {showGridData === true ? (
              <>
                <Card bodyStyle={{ paddingBottom: "0px", padding: "1.2%" }}>
                  <TableForReport
                    columnsData={headerData}
                    gridData={gridData}
                    reportFields={reportFields}
                    nestedTableFlag={nestedTable}
                    parametersToSend={parametersToSend}
                    detailedReportId={detailedReportId}
                    mainReportId={reportId}
                    viewMoreLessFilter={viewMoreLessFilters}
                    reportFiltersForNextRowLength={reportFiltersForNextRow.length}
                    totalRecords={totalRecords}
                  />
                </Card>
              </>
            ) : (
              <>
              <Card style={{ backgroundColor: "#f5f5f6", border: "none" }} bodyStyle={{ backgroundColor: '#f3f4f9', border: "none", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", boxSizing: "border-box" }}>
                <img style={{ opacity: 0.2, marginBottom: '1em' }} src={noRecord} alt="" />
                <span style={{ fontFamily: "Inter", fontWeight: 700, color: "#425B6D", opacity: 0.7, fontSize: "20px", textAlign: "center" }}>No Reports to Display</span>
                <span style={{ fontFamily: "Inter", fontWeight: 400, color: "#425B6D", opacity: 0.7, fontSize: "14px", textAlign: "center" }}>Please select filter to generate report</span>
              </Card>
            </>
            )}
          </Col>
        ) : (
          <Col span={24} style={{ marginBottom: "8px" }}>
            <Card style={{ margin: "14px", width: "1070px", height: "425px", overflow: "auto" }}>
              {/* <PivotTableUI data={gridData} onChange={(s) => setPivotState(s)} renderers={Object.assign({}, TableRenderers, PlotlyRenderers)} {...pivotData} /> */}
              <PivotTable columnsData={pivotColumns} gridData={gridData} />
            </Card>
          </Col>
        )}
      </Row>
      <div style={{marginTop:7}}>
        <Modal
          id="reportAntModal"
          bodyStyle={{ backgroundColor: "#F2F3F6", paddingBottom: "8px" }}
          // className="ant-modal-header-custom"
          title={
            <Spin indicator={<LoadingOutlined style={{ fontSize: "10px" }} spin />} spinning={loadingForModal}>
              <Row>
                <Col span={8} />
                <Col span={8}>
                  {popUpReportName} - {drillDownTitle}
                </Col>
                <Col span={8}>
                  <Button
                    color="primary"
                    style={{ float: "right", height: "32px", width: "33px", paddingLeft: "5px", paddingRight: "5px", paddingTop: "6px", borderRadius: "5px" }}
                  >
                    <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "18px", cursor: "pointer" }} src={Export} alt="invoice" onClick={downloadDrillDownData} />
                  </Button>
                </Col>
              </Row>
            </Spin>
          }
          visible={drillDownPopup}
          onCancel={handleCancel}
          footer={null}
          centered
          width="1000px"
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: "52px" }} spin />} spinning={loadingForModal}>
            <Card bodyStyle={{ paddingTop: "0px", paddingBottom: "0px" }}>
              <TableForReport
                columnsData={drillDownHeader}
                gridData={drillDownData}
                reportFields={reportFields}
                nestedTableFlag={nestedTable}
                parametersToSend={parametersToSend}
                detailedReportId={detailedReportId}
                mainReportId={reportId}
                viewMoreLessFilter={viewMoreLessFilters}
                reportFiltersForNextRowLength={reportFiltersForNextRow.length}
                totalRecords={totalRecordsForDrillDown}
              />
            </Card>
          </Spin>
        </Modal>
      </div>

      <div style={{marginTop:7}}>
        <Modal
          title={"Email Report"}
          visible={emailReportPopup}
          centered
          width="1000px"
          // onOk={sendEmail}
          onCancel={closeEmail}
          footer={
            <>
              <Button type="default" onClick={closeEmail}>Cancel</Button>&nbsp;
              <Button style={Themes.contentWindow.ListWindowHeader.newButtonForlist} type="primary" onClick={sendEmail}>Send</Button>
            </>
          }
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: "52px" }} spin />} spinning={loadingForEmail}>
            <Form layout="vertical" name="control-hooks" style={{ padding: "8px" }} form={emailForm} onFinish={onEmailFormFinish}>
              <Row>
                <Col style={{ paddingRight: "8px" }} span={12}>
                  <Form.Item label="From" name="from" initialValue={"no-reply@noton.dev"}>
                    <Input />
                  </Form.Item>
                </Col>

                <Col style={{ paddingLeft: "8px" }} span={12}>
                  <Form.Item label="Reply To" name="replyTo">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <br />
              <Row style={{ paddingBottom: "16px" }}>
                <Col style={{ paddingRight: "8px" }} span={12}>
                  <Form.Item
                    label="To"
                    name="to"
                    rules={[
                      /* {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      }, */
                      {
                        required: true,
                        message: "Please input your E-mail!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col style={{ paddingLeft: "8px" }} span={12}>
                  <Form.Item label="Cc" name="cc">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row style={{ paddingBottom: "16px" }}>
                <Col span={24}>
                  <Form.Item label="Subject" name="subject" initialValue={reportName}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row style={{ paddingBottom: "16px" }}>
                <Col span={24}>
                  <Form.Item name="body" label="Body" initialValue={getDefaultContent()}>
                    {/* <Input /> */}
                    <ReactQuill
                      theme="snow"
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

              <Row>
                <Col span={24}>
                  <Form.Item label="Attachment" name="attachment" initialValue={emailAttachment}>
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <br />
            </Form>
          </Spin>
        </Modal>
      </div>

      <div style={{marginTop:7}}>
        <Modal
          title={"Schedule Report"}
          visible={reportSchedulerVisible}
          centered
          width="700px"
          // onOk={sendEmail}
          onCancel={closeReportScheduler}
          footer={
            <>
              <Button type="default" onClick={closeReportScheduler}>Cancel</Button>&nbsp;
              <Button loading={loadingForSReport} style={Themes.contentWindow.ListWindowHeader.newButtonForlist} type="primary" onClick={onConfirmScheduleReport}>Save</Button>
            </>
          }
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: "52px" }} spin />} spinning={loadingForSReport}>
            <Form layout="vertical" name="control-hooks" style={{ padding: "8px" }} form={scheduleReportForm} /* onFinish={onEmailFormFinish} */>
              <Row>
                <Col style={{ paddingRight: "8px" }} span={12}>
                  <Form.Item label="Frequency" name="frequency">
                  <Select
                  allowClear
                  showSearch
                  placeholder="---Select---"
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  dropdownMatchSelectWidth={false}
                  // onSelect={selectTimeLineFilters}
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
                      <Option key="YL" value="YL">Yearly</Option>
                    </>
                </Select>
                  </Form.Item>
                </Col>

                <Col style={{ paddingLeft: "8px" }} span={12}>
                  <Form.Item label="Start Date & Time" name="startdate_time">
                    <DatePicker style={{width:'100%'}} showTime />
                  </Form.Item>
                </Col>
              </Row>
              <br />
              <Row style={{ paddingBottom: "16px" }}>
                <Col span={24}>
                  <Form.Item
                    label="Recipient"
                    name="recipient"
                    rules={[
                      /* {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      }, */
                      {
                        required: true,
                        message: "Please input recipient",
                      },
                    ]}
                  >
                    <TextArea />
                  </Form.Item>
                </Col>
              </Row>
              <p style={{marginBottom:'6px'}} />
              <p style={{fontSize:'12px',marginBottom:'0px'}}>Current Schedules</p>
            </Form>
            <Row>
              <Col style={{ paddingRight: "8px",paddingLeft:'8px' }} span={24}>
                <Table size="small" columns={columnsforReportScheduler} dataSource={scheduledData} pagination={false} />
              </Col>
            </Row>
            <br />
          </Spin>
        </Modal>
        </div>
        <Modal closable={false} visible={filterModal} footer={null}
        title={<>
          <h2 style={{fontWeight:'bold',width:'121px',fontStyle:'normal',float:'left',marginLeft:'7px'}}>Filters</h2>
          <span style={{float:'right'}}><CloseOutlined onClick={()=>{FilterModal(false)}}/></span>
          </>}>
        <Row gutter={8}>
            {reportFilters !== undefined
              ? reportFilters.map((filtersData, index) => {
                  return (
                    <Col
                      span={24}
                      key={index}
                      style={{
                        display:
                          filtersData.isForPrompting === "N" || filtersData.isactive === "N" || filtersData.type === "DateRange" || filtersData.type === "Date" ? "none" : "block",
                      }}
                    >
                      <Form preserve={false} form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                        <Form.Item
                          style={{fontFamily:'Inter',fontWeight:'bold',color:Themes.appTheme.primaryColor}}
                          label={filtersData.type === "DateRange" || filtersData.type === "Date" ? null : filtersData.displayName}
                          name={filtersData.type === "DateRange" || filtersData.type === "Date" ? null : filtersData.columnName}
                          rules={[
                            {
                              required: filtersData.mandatory === "N" || filtersData.type === "DateRange" || filtersData.type === "Date" ? false : true,
                              message: `Please Enter ${filtersData.displayName}`,
                            },
                          ]}
                        >
                          {filtersData.type === "MultiSelector" ? (
                            <Select
                              style={{ width: "100%" }}
                              onSearch={searchDropdownRecords}
                              mode="multiple"
                              maxTagCount={1}
                              dropdownStyle={{width:"12%"}}
                              showSearch
                              allowClear
                              placeholder={
                                <>
                                 <span style={{fontFamily:'Inter',fontSize:12}}>Select</span>
                                 <img src={arrowIcon} style={{float:'right',marginTop:10}}/>
                                </>
                              }
                              // loading
                              // notFoundContent={fetching ? <Spin size="small" /> : null}
                              dropdownMatchSelectWidth={false}
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              onFocus={() => onDropDownSelect(filtersData.id,filtersData.dependentId)}
                            >
                              {/* {dropdownList} */}
                              {/* <Spin indicator={<LoadingOutlined style={{ fontSize: "20px" }} spin />} spinning={fetching}> */}
                              {dropdownDetails === null || dropdownDetails === undefined
                                ? null
                                : dropdownDetails.map((data) => {
                                    return (
                                      <Option key={data.recordid} value={data.recordid === undefined || data.recordid === null ? data.name :data.recordid}>
                                        {data.name}
                                      </Option>
                                    );
                                  })}
                            </Select>
                          ) : filtersData.type === "List" ? (
                            <Select
                              showSearch
                              allowClear
                              dropdownStyle={{width:"12%"}}
                              // notFoundContent={fetching ? <Spin size="small" /> : null}
                              placeholder={<span style={{fontFamily:'Inter',fontSize:12}}>Select</span>}
                              dropdownMatchSelectWidth={false}
                              style={{ width: "100%" }}
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              onFocus={() => onDropDownSelectForListReference(filtersData.Values)}
                            >
                              {referenceListDetails === null || referenceListDetails === undefined
                                ? null
                                : referenceListDetails.map((data) => {
                                    return (
                                      <Option key={data.key} title={data.key} value={data.key}>
                                        {data.value}
                                      </Option>
                                    );
                                  })}
                            </Select>
                          ) : filtersData.type === "Selector" ? (
                            <Select
                              showSearch
                              allowClear
                              dropdownStyle={{width:"12%"}}
                              // notFoundContent={fetching ? <Spin size="small" /> : null}
                              dropdownMatchSelectWidth={false}
                              style={{ width: "100%",borderRadius:'4px' }}
                              placeholder={<span style={{fontFamily:'Inter',fontSize:12}}>Select</span>}
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              onFocus={() => onDropDownSelect(filtersData.id,filtersData.dependentId)}
                            >
                              {dropdownDetails === null || dropdownDetails === undefined
                                ? null
                                : dropdownDetails.map((data) => {
                                    return (
                                      <Option key={data.recordid} value={data.recordid === undefined || data.recordid === null ? data.name :data.recordid}>
                                        {data.name}
                                      </Option>
                                    );
                                  })}
                            </Select>
                          ) : filtersData.type === "Flag" ? (
                            <Checkbox checked={checkedValue} onChange={onCheckBoxValueChange} />
                          ) : filtersData.type === "Numeric" ?  (
                            <InputNumber style={{width:"100%"}} />
                          ) : <Input /> 
                          }
                        </Form.Item>
                      </Form>
                      <br />
                    </Col>
                  );
                })
              : ""}
              <Col span={24}>
              <Button  style={{ borderRadius: "4px",width:"100%", fontFamily: "Inter", fontWeight: 700, color: "#FFFFFF" }} type="primary" onClick={executeData}>
              Run
              </Button>
              </Col>
          </Row>
        </Modal>
    </Spin>
  );
};

export default Report;