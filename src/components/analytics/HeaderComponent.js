import React,{ useState,useEffect } from "react";
import { Col, Row, Dropdown,Menu,Modal,Form,DatePicker,Select, Button,Card,Input,Checkbox } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useGlobalContext } from "../../lib/storage";
import {getComboFillForDashboard } from "../../services/generic";
import More from "../../assets/images/more.svg";
import Scrollbars from "react-custom-scrollbars";
import refreshIcon from "../../assets/images/refreshNew.svg";
import moment from 'moment'
// import Axios from "axios";
import "./index.css";


const{Option}=Select

const HeaderComponent = (props) => {
  const { globalStore } = useGlobalContext();
  const userPreferences = globalStore.userPreferences;
  const userData = globalStore.userData
  const dateFormat = userPreferences.dateFormat
  const userCurrency = userData.currency
  const {dashboardFilters,isComparableFlag,kpiData,dashboardId,previousYearArray,currentYearDateChange,previousYearDateChange,clearFilterValues,executeDashboard,setLoading,initializationData}=props
  const [filterPopup, setFilterPopup] = useState(false);
  const [popupHeight, setPopupHeight] = useState(false); 
  const [searchValue,setSearchValue]=useState('')
  const [dropdownDetails, setDropdownDetails] = useState([]);
  const [dropdownDetailsCopy, setDropdownDetailsCopy] = useState([]);
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [businessUnitName,setSelectedBusinessUnitName] = useState([]);
  const [selectedDate,setSelectedDate] = useState();
  const [referenceListDetails, setListReferenceDetails] = useState([]);
  const [clickedFiltersCount, setClickedFiltersCount] = useState(0)
  const [mobMenu,setMobMenu] = useState(false)
  const [bunitVisible,setBunitVisible] = useState(false)
  const [form] = Form.useForm();
  const [comparableForm] = Form.useForm();
  const [dateFilterForm] = Form.useForm();
  const innerWidth = windowSize.innerWidth
  
  const dateConvertor = (str)=>{
    const date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const filterMode = () => {
    setClickedFiltersCount(clickedFiltersCount + 1)
    const currentDateArray = []
    if(clickedFiltersCount===0){
      for (let index = 0; index < initializationData.length; index += 1) {
        const element = initializationData[index]
        if (typeof element.defaultValue === 'string') {
          // const columnName = element.column_name
          // const defaultValue = element.default_value_expression.split(';')
          const [startDate, endDate] = element.defaultValue.split(';');
          const defaultValue = [startDate, endDate]
          const fromDate = new Date(defaultValue[0])
          const toDate = new Date(defaultValue[1])
          const formattedFromDate = fromDate.getFullYear() - 1 + '-' + (fromDate.getMonth() + 1) + '-' + fromDate.getDate()
          const formattedToDate = toDate.getFullYear() - 1 + '-' + (toDate.getMonth() + 1) + '-' + toDate.getDate()
  
          currentDateArray.push(formattedFromDate, formattedToDate)
          form.setFieldsValue({
            fromDate: moment(fromDate, dateFormat),
            toDate: moment(toDate, dateFormat),

          })
  
          if (isComparableFlag === 'Y') {
            comparableForm.setFieldsValue({
              comparableFromDate: moment(new Date(formattedFromDate), dateFormat),
              comparableToDate: moment(new Date(formattedToDate), dateFormat),
            })
          }
        }else if (typeof element.defaultValue === 'object') {
         setDropdownDetails([element.defaultValue])
        }
        
      }
    }
    setFilterPopup(true)
  };

  useEffect(()=>{
    form.resetFields();
    setSelectedBusinessUnitName([initializationData[1]?.defaultValue.name])
    const defaultValue = initializationData[0]?.defaultValue;
    if (defaultValue) {
      const dateArray = defaultValue.split(';');
      const formattedDateRange = dateArray.join(' to ');
      setSelectedDate(formattedDateRange);
    } else {
      console.error("defaultValue is not defined");
    }    
    onDropDownSelect(dashboardId,initializationData[1]?.filter_id)
  },[dashboardId,initializationData])

  const submitFilterDetails=()=>{
    form.submit();
  }

  const onFinishFailed = (errorInfo) => {
  };

  const onDropDownSelect = async (dashboard,id) => {
    const getDashboardData = await getComboFillForDashboard(dashboard,id);
    if (getDashboardData && typeof getDashboardData[Symbol.iterator] === 'function') {
      setDropdownDetails([...getDashboardData]);
      setDropdownDetailsCopy([...getDashboardData])
    } else {
      console.error("Error getting dropdown details")
      // Handle non-iterable data (e.g., setDropdownDetails with a default value or handle error)
    }
  };


  const onDropDownSelectForListReference = (values) => {
    setListReferenceDetails([...values]);
  };



  const refreshDashboard = () => {
    props.refreshDashboard()
  };


  const onCurrentFromDateChange = (date, dateString) => {
    const fromDateValue = new Date(date)

    const fromDateYear = fromDateValue.getFullYear()
    const formattedFromDateToSet = fromDateValue.getFullYear() - 1 + '-' + (fromDateValue.getMonth() + 1) + '-' + fromDateValue.getDate()
    if (isComparableFlag === 'Y') {
      comparableForm.setFieldsValue({
        comparableFromDate: moment(new Date(formattedFromDateToSet), dateFormat),
      })
    }
    currentYearDateChange({
      isDateChanged: true,
      currentYearFlag: true,
      fromDateYearInState: fromDateYear,
    })
  }

  const onCurrentToDateChange = (date, dateString) => {
    const toDateValue = new Date(date)
    const toDateYear = toDateValue.getFullYear()
    const formattedToDateToSet = toDateValue.getFullYear() - 1 + '-' + (toDateValue.getMonth() + 1) + '-' + toDateValue.getDate()

    if (isComparableFlag === 'Y') {
      comparableForm.setFieldsValue({
        comparableToDate: moment(new Date(formattedToDateToSet), dateFormat),
      })
    }
    currentYearDateChange({
      isDateChanged: true,
      currentYearFlag: true,
      fromDateYearInState: toDateYear,
    })
  }

  const onComparableFromDateChange = (date, dateString) => {  
    const fromDateValue = new Date(dateString)
    const fromDateYear = fromDateValue.getFullYear()
    previousYearDateChange({
      isDateChanged: true,
      previousYearFlag: true,
      fromDateYearInState: fromDateYear,
    })
  }

  const clearValues=()=>{
    setFilterPopup(false)
    setPopupHeight(false)
  }

  const closeFilterModal = () => {
    clearFilterValues()
    setClickedFiltersCount(0)
    setFilterPopup(false)
    setPopupHeight(false)
    form.resetFields();
    comparableForm.resetFields();
    dateFilterForm.resetFields();
  };



  const selectTimeLineFilters=(value)=>{
    setPopupHeight(false)
    switch (value) {
      case "today":
        const todayDate = new Date()
        const formattedFromDate = todayDate.getFullYear() - 1 + '-' + (todayDate.getMonth() + 1) + '-' + todayDate.getDate()
        const formattedToDate = todayDate.getFullYear() - 1 + '-' + (todayDate.getMonth() + 1) + '-' + todayDate.getDate()
        form.setFieldsValue({ "fromDate": moment(new Date(), dateFormat),"toDate": moment(new Date(), dateFormat) });
        comparableForm.setFieldsValue({ "comparableFromDate": moment(new Date(formattedFromDate), dateFormat),"comparableToDate": moment(new Date(formattedToDate), dateFormat) });
        break;
    
      case "yesterday":
        const yesterdaysDate = new Date(new Date().getTime() - 24*60*60*1000);
        const formattedYesterdayFromDate = yesterdaysDate.getFullYear() - 1 + '-' + (yesterdaysDate.getMonth() + 1) + '-' + yesterdaysDate.getDate()
        const formattedYesterdayToDate = yesterdaysDate.getFullYear() - 1 + '-' + (yesterdaysDate.getMonth() + 1) + '-' + yesterdaysDate.getDate()
        form.setFieldsValue({ "fromDate": moment(new Date(yesterdaysDate), dateFormat),"toDate": moment(new Date(yesterdaysDate), dateFormat) });
        comparableForm.setFieldsValue({ "comparableFromDate": moment(new Date(formattedYesterdayFromDate), dateFormat),"comparableToDate": moment(new Date(formattedYesterdayToDate), dateFormat) });
        break;

      case "lastSevenDays":
        const currDate = new Date();
        const lastSevenDay = dateConvertor(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))
        
        const formattedLastSevenFromDate = currDate.getFullYear() - 1 + '-' + (currDate.getMonth() + 1) + '-' + currDate.getDate()
        const formattedLastSevenToDate = new Date(lastSevenDay).getFullYear() - 1 + '-' + (new Date(lastSevenDay).getMonth() + 1) + '-' + new Date(lastSevenDay).getDate()

        form.setFieldsValue({ "fromDate": moment(new Date(lastSevenDay), dateFormat),"toDate": moment(new Date(currDate), dateFormat) });        
        comparableForm.setFieldsValue({ "comparableFromDate": moment(new Date(formattedLastSevenToDate), dateFormat),"comparableToDate": moment(new Date(formattedLastSevenFromDate), dateFormat) });
        break;

      case "lastThirtyDays":
        const currDateForThirtyDays = new Date();
        const last30Day = dateConvertor(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000))
        const formattedLastThirtyFromDate = currDateForThirtyDays.getFullYear() - 1 + '-' + (currDateForThirtyDays.getMonth() + 1) + '-' + currDateForThirtyDays.getDate()
        const formattedLastThirtyToDate = new Date(last30Day).getFullYear() - 1 + '-' + (new Date(last30Day).getMonth() + 1) + '-' + new Date(last30Day).getDate()

        form.setFieldsValue({ "fromDate": moment(new Date(last30Day), dateFormat),"toDate": moment(new Date(currDateForThirtyDays), dateFormat) });        
        comparableForm.setFieldsValue({ "comparableFromDate": moment(new Date(formattedLastThirtyToDate), dateFormat),"comparableToDate": moment(new Date(formattedLastThirtyFromDate), dateFormat) });
        break;

      case "lastNinetyDays":
        const startDateForLastNinetyDays = dateConvertor(moment().subtract(90, 'days'))
        const endDateForLastNinetyDays = new Date()

        const formattedLastNinetyFromDate = endDateForLastNinetyDays.getFullYear() - 1 + '-' + (endDateForLastNinetyDays.getMonth() + 1) + '-' + endDateForLastNinetyDays.getDate()
        const formattedLastNinetyToDate = new Date(startDateForLastNinetyDays).getFullYear() - 1 + '-' + (new Date(startDateForLastNinetyDays).getMonth() + 1) + '-' + new Date(startDateForLastNinetyDays).getDate()

        form.setFieldsValue({ "fromDate": moment(new Date(startDateForLastNinetyDays), dateFormat),"toDate": moment(new Date(endDateForLastNinetyDays), dateFormat) });
        comparableForm.setFieldsValue({ "comparableFromDate": moment(new Date(formattedLastNinetyToDate), dateFormat),"comparableToDate": moment(new Date(formattedLastNinetyFromDate), dateFormat) });
        break;

      case "lastMonth":
        const lastMonthDate = new Date();
        const lastMonthFirstDay = dateConvertor(new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth()-1, 1));
        const lastMonthLastDay = dateConvertor(new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 0));

        const formattedLastMonthFromDate = new Date(lastMonthFirstDay).getFullYear() - 1 + '-' + (new Date(lastMonthFirstDay).getMonth() + 1) + '-' + new Date(lastMonthFirstDay).getDate()
        const formattedLastMonthToDate = new Date(lastMonthLastDay).getFullYear() - 1 + '-' + (new Date(lastMonthLastDay).getMonth() + 1) + '-' + new Date(lastMonthLastDay).getDate()

       
        form.setFieldsValue({ "fromDate": moment(new Date(lastMonthFirstDay), dateFormat),"toDate": moment(new Date(lastMonthLastDay), dateFormat) });
        comparableForm.setFieldsValue({ "comparableFromDate": moment(new Date(formattedLastMonthFromDate), dateFormat),"comparableToDate": moment(new Date(formattedLastMonthToDate), dateFormat) });
        break;

      case "lastYear":
        if(userCurrency==="INR"){
          const currDateCurrency = new Date()
          const fiscalYearFirstDay = dateConvertor((new Date(currDateCurrency.getFullYear()-1, 3, 1)));
          const fiscalYearLastDay = dateConvertor((new Date(currDateCurrency.getFullYear(), 2, 31)));

          const formattedLastYearFromDate = new Date(fiscalYearFirstDay).getFullYear() - 1 + '-' + (new Date(fiscalYearFirstDay).getMonth() + 1) + '-' + new Date(fiscalYearFirstDay).getDate()
          const formattedLastYearToDate = new Date(fiscalYearLastDay).getFullYear() - 1 + '-' + (new Date(fiscalYearLastDay).getMonth() + 1) + '-' + new Date(fiscalYearLastDay).getDate()


          form.setFieldsValue({ "fromDate": moment(new Date(fiscalYearFirstDay), dateFormat),"toDate": moment(new Date(fiscalYearLastDay), dateFormat) });
          comparableForm.setFieldsValue({ "comparableFromDate": moment(new Date(formattedLastYearFromDate), dateFormat),"comparableToDate": moment(new Date(formattedLastYearToDate), dateFormat) });

        }else{
          const lastYearDate = new Date(new Date().getFullYear() - 1, 0, 1);
          const lastYearFirstDay = dateConvertor(new Date(lastYearDate.getFullYear(), 0, 1));
          const lastYearLastDay = dateConvertor(new Date(lastYearDate.getFullYear(), 11, 31));

          const formattedLastYearFromDate = new Date(lastYearFirstDay).getFullYear() - 1 + '-' + (new Date(lastYearFirstDay).getMonth() + 1) + '-' + new Date(lastYearFirstDay).getDate()
          const formattedLastYearToDate = new Date(lastYearLastDay).getFullYear() - 1 + '-' + (new Date(lastYearLastDay).getMonth() + 1) + '-' + new Date(lastYearLastDay).getDate()

          form.setFieldsValue({ "fromDate": moment(new Date(lastYearFirstDay), dateFormat),"toDate": moment(new Date(lastYearLastDay), dateFormat) });
          comparableForm.setFieldsValue({ "comparableFromDate": moment(new Date(formattedLastYearFromDate), dateFormat),"comparableToDate": moment(new Date(formattedLastYearToDate), dateFormat) });

        }       
        break;

      case "thisWeek":
        let curr = new Date();
        let week = []
        for (let i = 1; i <= 7; i++) {
          let first = curr.getDate() - curr.getDay() + i 
          let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
          week.push(day)
        }
        const firstday = dateConvertor(week[0]);
        const lastday = dateConvertor(new Date());


        const formattedThisWeekFromDate = new Date(firstday).getFullYear() - 1 + '-' + (new Date(firstday).getMonth() + 1) + '-' + new Date(firstday).getDate()
        const formattedThisWeekToDate = new Date(lastday).getFullYear() - 1 + '-' + (new Date(lastday).getMonth() + 1) + '-' + new Date(lastday).getDate()

       
        form.setFieldsValue({ "fromDate": moment(new Date(firstday), dateFormat),"toDate": moment(new Date(lastday), dateFormat) });
        comparableForm.setFieldsValue({ "comparableFromDate": moment(new Date(formattedThisWeekFromDate), dateFormat),"comparableToDate": moment(new Date(formattedThisWeekToDate), dateFormat) });
        break;

      case "thisMonth":
        const date = new Date(); 
        const year = date.getFullYear(); 
        const month = date.getMonth();
        const firstDay = dateConvertor((new Date(year, month, 1)));
        const lastDay = dateConvertor(new Date());

        const formattedThisMonthFromDate = new Date(firstDay).getFullYear() - 1 + '-' + (new Date(firstDay).getMonth() + 1) + '-' + new Date(firstDay).getDate()
        const formattedThisMonthToDate = new Date(lastDay).getFullYear() - 1 + '-' + (new Date(lastDay).getMonth() + 1) + '-' + new Date(lastDay).getDate()

       
        form.setFieldsValue({ "fromDate": moment(new Date(firstDay), dateFormat),"toDate": moment(new Date(lastDay), dateFormat) });
        comparableForm.setFieldsValue({ "comparableFromDate": moment(new Date(formattedThisMonthFromDate), dateFormat),"comparableToDate": moment(new Date(formattedThisMonthToDate), dateFormat) });

        
        break;

      case "thisQuarter":
        const startDateOfQuarter = dateConvertor(moment().startOf('quarter'))
        const endDateOfQuarter = dateConvertor(new Date());
        const formattedThisQuarterFromDate = new Date(startDateOfQuarter).getFullYear() - 1 + '-' + (new Date(startDateOfQuarter).getMonth() + 1) + '-' + new Date(startDateOfQuarter).getDate()
        const formattedThisQuarterToDate = new Date(endDateOfQuarter).getFullYear() - 1 + '-' + (new Date(endDateOfQuarter).getMonth() + 1) + '-' + new Date(endDateOfQuarter).getDate()

       
        form.setFieldsValue({ "fromDate": moment(new Date(startDateOfQuarter), dateFormat),"toDate": moment(new Date(endDateOfQuarter), dateFormat) });
        comparableForm.setFieldsValue({ "comparableFromDate": moment(new Date(formattedThisQuarterFromDate), dateFormat),"comparableToDate": moment(new Date(formattedThisQuarterToDate), dateFormat) });      
        break;

      case "thisYear":
        if(userCurrency==="INR"){
          const today = new Date();
          const fiscalYearFirstDayForYearToDate = dateConvertor((new Date(today.getFullYear(), 3, 1)));

          const formattedThisYearFromDate = new Date(fiscalYearFirstDayForYearToDate).getFullYear() - 1 + '-' + (new Date(fiscalYearFirstDayForYearToDate).getMonth() + 1) + '-' + new Date(fiscalYearFirstDayForYearToDate).getDate()
          const formattedThisYearToDate = new Date().getFullYear() - 1 + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
       
          form.setFieldsValue({ "fromDate": moment(new Date(fiscalYearFirstDayForYearToDate), dateFormat),"toDate": moment(new Date(), dateFormat) });
          comparableForm.setFieldsValue({ "comparableFromDate": moment(new Date(formattedThisYearFromDate), dateFormat),"comparableToDate": moment(new Date(formattedThisYearToDate), dateFormat) });
          
        }else{
          const currentDate = new Date();
          const theFirst = dateConvertor((new Date(currentDate.getFullYear(), 0, 1)));
          
          const formattedThisYearFromDate = new Date(theFirst).getFullYear() - 1 + '-' + (new Date(theFirst).getMonth() + 1) + '-' + new Date(theFirst).getDate()
          const formattedThisYearToDate = new Date().getFullYear() - 1 + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
       
          form.setFieldsValue({ "fromDate": moment(new Date(theFirst), dateFormat),"toDate": moment(new Date(), dateFormat) });
          comparableForm.setFieldsValue({ "comparableFromDate": moment(new Date(formattedThisYearFromDate), dateFormat),"comparableToDate": moment(new Date(formattedThisYearToDate), dateFormat) });

        }       
        break;

      default:
        break;
    }  

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

 

  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 8,
    lg: 12,
    xs: 16,
    sm: 16,
    md: 12,
  };
  const responsiveDesignForButtons = {
    xxl: 12,
    xl: 16,
    lg: 12,
    xs: 8,
    sm: 8,
    md: 12,
  };

  const sty = {
    description: "status bar keys styles in the status bar part",
    fontSize: "12px",
    fontFamily:"Inter",
    overflowX: "hidden",
    position: "relative",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginRight:"7px",
    paddingTop:"2px"
  }

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

  const onFinish = async (values) => {
    setLoading(true)
    setFilterPopup(false);
    const comparableFormValues = comparableForm.getFieldsValue(true);
    const currentYearFromDate = values.fromDate !== undefined ? values.fromDate.format("YYYY-MM-DD") : "";
    const currentYearToDate = values.toDate !== undefined ? values.toDate.format("YYYY-MM-DD") : "";
    const comparableFromDate = comparableFormValues.comparableFromDate !== undefined ? comparableFormValues.comparableFromDate.format("YYYY-MM-DD") : "";
    const comparableToDate = comparableFormValues.comparableToDate !== undefined ? comparableFormValues.comparableToDate.format("YYYY-MM-DD") : "";
    const currentYearDatesArray = [];
    const previousYearArray = [];
    let comparableValue;
    console.log(currentYearFromDate,currentYearToDate)
    currentYearDatesArray.push(currentYearFromDate, currentYearToDate);  
    if (dashboardFilters !== undefined) {
      for (let index = 0; index < dashboardFilters.length; index += 1) {
        const element = dashboardFilters[index];
        if (dashboardFilters[index].type === "DateRange") {
          comparableValue = element.column_name;
          values[element.column_name] = currentYearDatesArray;
        }
      }
      if (isComparableFlag === "Y") {
        const fromDate = new Date(comparableFromDate);
        const toDate = new Date(comparableToDate);
        const formattedFromDate = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1) + "-" + fromDate.getDate();
        const formattedToDate = toDate.getFullYear() + "-" + (toDate.getMonth() + 1) + "-" + toDate.getDate();
        previousYearArray.push(formattedFromDate, formattedToDate);
        values[comparableValue.concat("_COMPARABLE_")] = previousYearArray;
      }
  
      for (const [key, value] of Object.entries(values)) {
        if (value === undefined) {
          delete values[key];
        }
        delete values["fromDate"];
        delete values["toDate"];
      }
      const selectedBusinessUnitNames = [];

      dropdownDetails.forEach((res) => {
        if (values?.cs_bunit_id) {
          values.cs_bunit_id.forEach((tre) => {
            if (res.recordid === tre) {
              selectedBusinessUnitNames.push(res.name);
            }
          });
        }
      });
      // console.log(selectedBusinessUnitNames)
      setSelectedBusinessUnitName(selectedBusinessUnitNames);
      // setSelectedBusinessUnitName(values.cs_bunit_id)
      props.paramsValue(values);
      const stringifiedJSON = JSON.stringify(values);
      const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      // const headers = { "Content-Type": "application/json", Authorization: `bearer ${newToken.access_token}` };
      const kpiDataCopy = [...kpiData]; // Create a copy to avoid modifying the original array
    
    // Execute dashboards without promises
    for (const element of kpiDataCopy) {
      props.loadingAfterFiltersApplied('Y', element.kpi_id);
      await executeDashboard([element], jsonToSend);
    }
    setLoading(false); 
    }
  };

  const handleCheckboxChange = async(name,id)=>{
    setLoading(true);
    // Check if the name is already in the list
    const isSelected = businessUnitName.includes(name);
    // Create a new array with updated selection
    const updatedBusinessUnitNames = isSelected
      ? businessUnitName.filter((unitName) => unitName !== name) // Remove the name if it's already selected
      : [...businessUnitName, name]; // Add the name if it's not selected
    setSelectedBusinessUnitName(updatedBusinessUnitNames);
    setBunitVisible(false);
      const formValues = dateFilterForm.getFieldsValue(true);
      let comparableValue;
      if (dashboardFilters !== undefined) {
        for (let index = 0; index < dashboardFilters.length; index += 1) {
          const element = dashboardFilters[index];
          if (dashboardFilters[index].type === "DateRange") {
            comparableValue = element.column_name;
            formValues[element.column_name] = selectedDate;
          }
        }
        if (isComparableFlag === "Y") {
          const selectedBusinessUnits = dropdownDetails.filter((unit) =>
          updatedBusinessUnitNames.includes(unit.name)
        );
        const selectedBusinessUnitIDs = selectedBusinessUnits.map((unit) => unit.recordid);
          // const fromDate = new Date(comparableFromDate);
          // const toDate = new Date(comparableToDate);
          // const formattedFromDate = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1) + "-" + fromDate.getDate();
          // const formattedToDate = toDate.getFullYear() + "-" + (toDate.getMonth() + 1) + "-" + toDate.getDate();
          // previousYearArray.push(formattedFromDate, formattedToDate);
          formValues[comparableValue.concat("_COMPARABLE_")] = previousYearArray;
          formValues["cs_bunit_id"] = selectedBusinessUnitIDs
        }
        props.paramsValue(formValues);
        const stringifiedJSON = JSON.stringify(formValues);
        const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
        const kpiDataCopy = [...kpiData]; // Create a copy to avoid modifying the original array
        console.log(jsonToSend)
      // Execute dashboards without promises
      // for (const element of kpiDataCopy) {
      //   props.loadingAfterFiltersApplied('Y', element.kpi_id);
      //   await executeDashboard([element], jsonToSend);
      // }
      // await executeDashboard(kpiData, jsonToSend);
      setLoading(false); 
      }

  }

  const handleChange=(e)=>{
    setSearchValue(e.target.value)
    if(e.target.value !== ""){
      const arr = [];
      dropdownDetails.forEach(tab=>{
       if(tab.name.toLowerCase().indexOf(e.target.value.toLowerCase())>=0){
         arr.push(tab)
       }
      })
     setDropdownDetails(arr)
    }else{
      setDropdownDetails(dropdownDetailsCopy)
    }
    
 }

 const handleSelectAll = (e) => {
  const selectAllChecked = e.target.checked;
  const selectedBusinessUnitNames = selectAllChecked ? dropdownDetails.map(item => item.name) : [];
  setSelectedBusinessUnitName(selectedBusinessUnitNames);
  setLoading(true);
  // Update formValues
  const formValues = dateFilterForm.getFieldsValue(true);
  let comparableValue;
  if (dashboardFilters !== undefined) {
    for (let index = 0; index < dashboardFilters.length; index += 1) {
      const element = dashboardFilters[index];
      if (dashboardFilters[index].type === "DateRange") {
        comparableValue = element.column_name;
        formValues[element.column_name] = selectedDate;
      }
    }
    if (isComparableFlag === "Y") {
      const selectedBusinessUnits = dropdownDetails.filter((unit) =>
        selectedBusinessUnitNames.includes(unit.name)
      );
      const selectedBusinessUnitIDs = selectedBusinessUnits.map((unit) => unit.recordid);
      formValues[comparableValue.concat("_COMPARABLE_")] = previousYearArray;
      formValues["cs_bunit_id"] = selectedBusinessUnitIDs;
    }
  }

  props.paramsValue(formValues);
  const stringifiedJSON = JSON.stringify(formValues);
  const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
  const kpiDataCopy = [...kpiData]; // Create a copy to avoid modifying the original array

  // Execute dashboards without promises
  for (const element of kpiDataCopy) {
    props.loadingAfterFiltersApplied('Y', element.kpi_id);
    executeDashboard([element], jsonToSend);
  }

  setLoading(false);
};

 
  const menu = () => {
    return (
      <Menu
        key="1"
      >
        <Input style={{margin:'7px',width:'225px'}}  value={searchValue} allowClear onChange={handleChange}/>
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
          <Menu.Item key="selectAll">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ maxWidth: '150px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Select All</span>
              <Checkbox
                checked={businessUnitName.length === dropdownDetails.length}
                onChange={handleSelectAll}
             />
             </div>   
            </Menu.Item>
            {dropdownDetails?.map((item, index) => {
               const isChecked = businessUnitName?.includes(item.name);
              return (
                <Menu.Item key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ maxWidth: '150px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.name}</span>
                    <Checkbox key={item.recordid} id={item.recordid} checked={isChecked} onChange={() => handleCheckboxChange(item.name,item.recordid)}/>
                  </div>
                </Menu.Item>
              );
            })}
          </Card>
        </Scrollbars>
      </Menu>
    );
  };



  return (
    <div>
      {/* {innerWidth>1004? */}
      <Row style={{paddingBottom:"15px"}}>
        <Col {...responsiveDesignForColumn} style={{display:"flex",justifyContent:"space-between"}}>
          <span className="formRecordTitle" style={{ fontSize: "24px", fontWeight: "700",color: "#0C173A",lineHeight:'29px',paddingLeft:'4px'}}>{props.dashboardTitle}</span>
        </Col>
        <Col {...responsiveDesignForButtons}>
        <span style={{ float: "right",marginRight:"9px",display:"flex" ,cursor:"pointer"}}>
          <Dropdown overlay={menu} visible={bunitVisible} onVisibleChange={()=>{setBunitVisible(!bunitVisible)}}>
          <span style={sty}>
            <span style={{opacity:0.5, color:"#192228", fontWeight:400, lineHeight:"20px"}}>
              &nbsp;Business Unit
            </span>
            &nbsp;:&nbsp;
            {businessUnitName && businessUnitName.length > 0 ? (
              <span style={{color:"#192228", fontWeight:"500", fontSize:"12px"}}>
                {businessUnitName[0]}
                {businessUnitName.length > 1 ? ` +${businessUnitName.length - 1}` : ''}
              </span>
            ) : (
              <span>No business unit selected</span>
            )}
          </span>
          </Dropdown>
          <span style={sty}>
            <span style={{opacity:0.5,color:"#192228",fontWeight:400,lineHeight:"20px"}}>&nbsp;Date</span>&nbsp;:&nbsp;<span style={{color:"#192228",fontWeight:"500",fontSize:"12px"}}>{selectedDate}</span>&nbsp;
          </span>&nbsp;&nbsp;
          <div onClick={refreshDashboard} style={{cursor:"pointer"}}>
              <img alt="refresh"  height="15vh" width='15vw'  src={refreshIcon}  style={{ cursor: "pointer",marginBottom:'2%'}} />&nbsp;
              <span style={{fontFamily:"Inter",fontWeight:500,}}>Reload</span>
            </div>
            &emsp;
         
            <div onClick={filterMode} style={{cursor:"pointer"}}>
              <img alt="filter" width="15vw" height="15vh" src={More}  style={{ cursor: "pointer",marginBottom:'2%',paddingRight:"2%"}} />&nbsp; 
              <span style={{fontFamily:"Inter",fontWeight:500}}>Filters</span>
            </div>     
          </span>
        </Col>
      </Row>

      <Modal
        title="Manage Filters"
        visible={filterPopup}
        width="360px"
        className="ant-modal-header-custom"
        // onOk={submitFilterDetails}
        // bodyStyle={{height:"46vh"}}
        footer={[
          <Button type="default" onClick={closeFilterModal}>
            Clear
          </Button>,
          <Button type="default" onClick={clearValues}>
            Cancel
          </Button>,
           <Button type="primary" onClick={() => {
            setLoading(true);
            setFilterPopup(false);
            setTimeout(() => {
              submitFilterDetails();
            }, 1000); // Delay in milliseconds (adjust as needed)
          }}>
            Apply
          </Button>,
        ]}
        onCancel={closeFilterModal}
        centered
      >
        <div style={{ padding: "8px" }}>
          <Form form={dateFilterForm} layout="vertical">
            <Row>
              <Col span={24}>
                <Form.Item                
                  label="Date Range"
                  name="dateRange"
                  // rules={[{ required: dashboardFilters.mandatory === "Y" ? true : false, message: `Please Enter ${dashboardFilters.display_name}` }]}
                >
                  <Select 
                    allowClear
                    suffixIcon={<CalendarOutlined />}
                    showSearch
                    listHeight={200}
                    placeholder="---Select timeline---"
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    // dropdownMatchSelectWidth={false}
                    onSelect={selectTimeLineFilters} 
                    // onFocus={focusTimeLineFilters}
                    // onBlur={unFocusTimeLineFilters}
                    style={{ width: "100%" }}
                    // dropdownStyle={{width:"20%"}}
                    placement="bottomRight"
                  >
                      <Option key="1" value="today">
                        Today
                      </Option>
                      <Option key="2" value="yesterday">
                        Yesterday
                      </Option>
                      {/* <Option key="12" disabled>------------------------------------------------------------</Option> */}
                      <Option key="3" value="lastSevenDays">
                        Last 7 days
                      </Option>
                      <Option key="4" value="lastThirtyDays">
                        Last 30 days
                      </Option>
                      <Option key="6" value="lastMonth">
                        Last month
                      </Option>
                      <Option key="7" value="lastYear">
                        Last year
                      </Option>
                      {/* <Option key="12" disabled>-----------------------------------------------------------</Option> */}
                      <Option key="8" value="thisWeek">
                        Week to date
                      </Option>
                      <Option key="9" value="thisMonth">Month to date</Option>
                      <Option key="10" value="thisQuarter">Quarter to date</Option>
                      <Option key="11" value="thisYear">Year to date</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <br />
          <Row style={{marginTop:popupHeight===true?"50%":"0%"}}>
            {dashboardFilters !== undefined
              ? dashboardFilters.map((dashboardFilters, index) => {
                  return (
                    <Col span={24} key={index} style={{ display: dashboardFilters.is_for_prompting === "Y" ? "block" : "none" }}>
                      <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                        <Form.Item
                          label={dashboardFilters.type === "DateRange" ? null : dashboardFilters.display_name}
                          name={dashboardFilters.type === "DateRange" ? null : dashboardFilters.column_name}
                          rules={[{ required: dashboardFilters.mandatory === "Y" ? true : false, message: `Please Enter ${dashboardFilters.display_name}` }]}
                        >
                          {dashboardFilters.type === "MultiSelector" ? (
                            <Select
                              style={{ width: "100%" }}
                              mode="multiple"
                              maxTagCount={1}
                              listHeight={100}
                              showSearch
                              allowClear
                              placement="bottomRight"
                              dropdownStyle={{width:"20%"}}
                              dropdownMatchSelectWidth={false}
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              onFocus={() => onDropDownSelect(dashboardId,dashboardFilters.filter_id)}
                              defaultValue={dropdownDetails?.[0]?.recordid}
                            >
                              {/* {dropdownList} */}
                              {dropdownDetails === null || dropdownDetails === undefined
                                ? null
                                : dropdownDetails.map((data) => {
                                    return (
                                      <Option key={data.recordid} value={data.recordid}>
                                        {data.name}
                                      </Option>
                                    );
                                  })}
                            </Select>
                          ) : dashboardFilters.type === "DateRange" ? (
                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item
                                  label="From Date"
                                  name="fromDate"
                                  rules={[{ required: dashboardFilters.mandatory === "Y" ? true : false, message: `Please Enter ${dashboardFilters.display_name}` }]}
                                >
                                  <DatePicker style={{ width: "100%" }} format={dateFormat} onChange={onCurrentFromDateChange} />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  label="To Date"
                                  name="toDate"
                                  rules={[{ required: dashboardFilters.mandatory === "Y" ? true : false, message: `Please Enter ${dashboardFilters.display_name}` }]}
                                >
                                  <DatePicker style={{ width: "100%" }} format={dateFormat} onChange={onCurrentToDateChange} />
                                </Form.Item>
                              </Col>
                            </Row>
                          ) : dashboardFilters.type === "List" ? (
                            <Select
                              showSearch
                              allowClear
                              // notFoundContent={fetching ? <Spin size="small" /> : null}
                              dropdownMatchSelectWidth={false}
                              style={{ width: "100%" }}
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              onFocus={() => onDropDownSelectForListReference(dashboardFilters.Values)}
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
                          ) : dashboardFilters.type === "Selector" ? (
                            <Select
                              showSearch
                              allowClear
                              // notFoundContent={fetching ? <Spin size="small" /> : null}
                              dropdownMatchSelectWidth={false}
                              style={{ width: "100%" }}
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              onFocus={() => onDropDownSelect(dashboardId,dashboardFilters.id)}
                            >
                              {dropdownDetails === null || dropdownDetails === undefined
                                ? null
                                : dropdownDetails.map((data) => {
                                    return (
                                      <Option key={data.recordid} value={data.recordid}>
                                        {data.name}
                                      </Option>
                                    );
                                  })}
                            </Select>
                          ) : dashboardFilters.type === "Date" ? (
                            <DatePicker style={{ width: "100%" }} format={dateFormat} />
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
          {isComparableFlag === "Y" ? (
            <Form form={comparableForm} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Comparable From Date"
                    name="comparableFromDate"
                    rules={[{ required: dashboardFilters.mandatory === "Y" ? true : false, message: `Please Enter ${dashboardFilters.display_name}` }]}
                  >
                    <DatePicker style={{ width: "100%" }}  format={dateFormat} onChange={onComparableFromDateChange} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Comparable To Date"
                    name="comparableToDate"
                    rules={[{ required: dashboardFilters.mandatory === "Y" ? true : false, message: `Please Enter ${dashboardFilters.display_name}` }]}
                  >
                    <DatePicker style={{ width: "100%" }} format={dateFormat} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          ) : (
            ""
          )}

          <br />
        </div>
      </Modal>
    </div>
  );
};

export default HeaderComponent;
