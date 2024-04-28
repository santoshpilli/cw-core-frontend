/* eslint-disable */
import React, { useEffect, useState } from "react";
import HeaderComponent from "./HeaderComponent";
import { useParams } from "react-router-dom";
import { Card, Col, Row, Spin, message, Menu, Dropdown,Tooltip,Skeleton } from "antd";
import { LoadingOutlined, CloseOutlined,DownloadOutlined } from "@ant-design/icons";
// import { genericUrl } from "../../constants/serverConfig";
import { ExportToCsv } from "export-to-csv";
import { useGlobalContext } from "../../lib/storage";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import LineChart from "./charts/LineChart";
import DonutChart from "./charts/DonutChart";
import GaugeChart from "./charts/GaugeChart";
import CombinationChartSingleYAxis from "./charts/CombinationChartSingleYAxis";
import CombinationChartDoubleYAxis from "./charts/CombinationChartDoubleYAxis";
import TableChart from "./charts/TableChart";
import WaterfallChart from "./charts/WaterfallChart";

import dashboardRefresh from '../../assets/images/refreshIcon.svg'
import FullScreen from "../../assets/images/fullscreen.svg";
import badgeIcon from "../../assets/images/iconBadge.svg";
import badgeIconRed from "../../assets/images/badgeIconRed.svg";
import expandChartIcon from "../../assets/images/expandChart.svg";
 
import BarChartC3JS from "./c3charts/BarChart";
import PieChartC3JS from "./c3charts/PieChart";
import DonutChartC3JS from "./c3charts/DonutChart";
import GaugeChartC3JS from "./c3charts/GaugeChart";
import LineChartC3JS from "./c3charts/LineChart";
import AreaChartC3JS from "./c3charts/AreaChart";
import WaterfallChartC3JS from "./c3charts/WaterfallChart";

import Axios from "axios";
import { Scrollbars } from "react-custom-scrollbars";
import { useHistory } from "react-router";
// import FullScreen from "../../assets/images/fullscreen.svg";
import settingIcon from "../../assets/images/settingsIcon.svg";
import closeIcon from "../../assets/images/closeIcon.svg";
import redArrow from "../../assets/images/redArrow.svg";
import newRedArrow from "../../assets/images/newRedArrow.svg"
import greenArrow from "../../assets/images/greenArrow.svg";
import newGreenArrow from "../../assets/images/newGreenArrow.svg";
import CustomIcon from "../../assets/images/customicons";
import "./index.css";
import { getOAuthHeaders } from "../../constants/oAuthValidation";

// const myWorker = new Worker('webWorker.js');

const Dashboard = () => {
  const { dashboardId } = useParams();
  const { globalStore } = useGlobalContext();
  const { userPreferences } = globalStore;
  const userData = globalStore.userData
  const globalParams = JSON.parse(localStorage.getItem('globalParameters'))
  const userCurrency = userData.currency
  const currencySymbol = userData.currency;
  const genericUrl = process.env.REACT_APP_genericUrl;
  const [dashboardName, setDashboardName] = useState("");
  const [dashboardFilters, setDashboardFilters] = useState([]);
  const [initializationData, setInitializationData] = useState([]);
  const [isComparableFlag, setIsComparableFlag] = useState("");
  const [previousYearArray,setPreviousYearArray] = useState(null)
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kpiLoading, setKpiLoading] = useState({});
  const [dashboardDataInState, setDashboardDataInState] = useState([]);
  const [dashboardParams, setDashboardParams] = useState("");
  const [fullScreenValue, setFullScreenValue] = useState(false);
  const [chartKpiId, setChartKpiId] = useState("");
  const [chartType, setChartType] = useState("");
  const [chartTitle, setChartTitle] = useState("");
  const [chartProperties, setChartProperties] = useState("");
  const [isDateChanged, setIsDateChanged] = useState(false);
  const [previousYearFlag, setPreviousYearFlag] = useState(false);
  const [currentYearFlag, setCurrentYearFlag] = useState(false);
  const [fromDateYear, setFromDateYear] = useState("");
  // const [currSymbol,setCurrSymbol] = useState('')
  const [chartLibrary, setChartLibrary] = useState("");
  const [kpiIdInState, setKpiIdInState] = useState("")
  const history = useHistory();
  /* setIsDateChanged(values.isDateChanged)
    setPreviousYearFlag(values.previousYearFlag)
    setFromDateYear(values.fromDateYearInState) */

  const [refresh, setRefresh] = useState(new Date());
  let appId = localStorage.getItem("appId");

  useEffect(() => {
    if (dashboardId) {
      getDashboardData();
    }
    return () => {
      setKpiData([]);
      setDashboardDataInState([]);
      setFullScreenValue(false);
    };
  }, [dashboardId]);

  useEffect(() => {
    if (userPreferences.enableMultiTab !== "Y") {
      setRefresh(new Date());
    }
  }, [dashboardId]);

  const getDashboardData = async () => {
    try {
      setLoading(true);
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const { access_token } = getOAuthHeaders();
      const dashhboardQuery = {
        query: `query {
              getDashboardJson(dashboardId:"${dashboardId}"){data, messageCode, title, message}
          }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${access_token}`,
        appId: appId
      };

      const serverResponse = await Axios.post(genericUrl, dashhboardQuery, { headers: headers }, { async: true }, { crossDomain: true });

      const dashboardJsonResponse = serverResponse.data.data.getDashboardJson;
      if (dashboardJsonResponse.messageCode === "200") {
        const dashboardData = JSON.parse(dashboardJsonResponse.data);
        const dashboardInitialQuery =  {
          query: `query {
            dashboardInitialization(dashboardId:"${dashboardId}" )
             }`,
        };
        const headers = {
          "Content-Type": "application/json",
          Authorization: `bearer ${access_token}`,
          appId: appId
        };
        const initializationResponse = await Axios.post(genericUrl, dashboardInitialQuery, { headers: headers }, { async: true }, { crossDomain: true });
        const myArray = JSON.parse(initializationResponse.data.data.dashboardInitialization)
        const dashboardName = dashboardData.name;
        const dashboardFilters = dashboardData.filters;
        const kpiData = dashboardData.KPI;
        const previousYearArray1 = [];
        const defaultValueJSON = {};
        let chartLibrary;
        if (dashboardData.Settings !== undefined) {
          const chartSettings = dashboardData.Settings;
          chartLibrary = chartSettings.chartlibrary;
        }

        let isComparableFlag = dashboardData.isComparable;
        for (let index = 0; index < kpiData.length; index++) {
          kpiData[index]["hide"] = "N";
        }
        if (kpiData !== undefined) {
          kpiData.sort(function (a, b) {
            return a.position_column - b.position_column;
          });
        }
        setPreviousYearArray(previousYearArray1)
        setDashboardName(dashboardName);
        setDashboardFilters(dashboardFilters);
        setInitializationData(myArray)
        setKpiData(kpiData);
        setIsComparableFlag(isComparableFlag);
        setChartLibrary(chartLibrary);
        let defaultDateValues = "";
        let storeObj={};
        for (let i = 0; i < myArray.length; i++) {
          const element = myArray[i];
      
          if (element.defaultValue) {
              // Check if defaultValue exists in the current element
              if (typeof element.defaultValue === 'string') {
                  // If defaultValue is a string, split it to get start and end dates
                  const [startDate, endDate] = element.defaultValue.split(';');
                  defaultDateValues = [startDate, endDate]
                  defaultValueJSON[element.column_name] = [startDate, endDate];
                  if (isComparableFlag === "Y") {
                  const fromDate = new Date(defaultDateValues[0]);
                  const toDate = new Date(defaultDateValues[1]);
                  const formattedFromDate = fromDate.getFullYear() - 1 + "-" + (fromDate.getMonth() + 1) + "-" + fromDate.getDate();
                  const formattedToDate = toDate.getFullYear() - 1 + "-" + (toDate.getMonth() + 1) + "-" + toDate.getDate();
                  previousYearArray1.push(formattedFromDate, formattedToDate);
                  defaultValueJSON[element.column_name.concat("_COMPARABLE_")] = previousYearArray1;
                  }    
                  // defaultValueJSON[element.filter_id] = [startDate, endDate];
              } else if (typeof element.defaultValue === 'object' && element.defaultValue.recordid) {
                  // If defaultValue is an object and has a recordid, extract the date values from it
                  // Assuming the date values are stored in 'startDate' and 'endDate' keys
                   storeObj=element.defaultValue
                   defaultValueJSON[element.column_name]=[element.defaultValue.recordid]
              }
          }
        }
      
        setLoading(false)
        const stringifiedJSON = JSON.stringify(defaultValueJSON);
        let jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
        setDashboardParams(defaultValueJSON);
        executeDashboard(kpiData, jsonToSend);
      }
    } catch (error) {
    }
  };



  const executeDashboard = (kpiData, dashboardParams) => {
    try {
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const { access_token } = getOAuthHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${access_token}`,
        appId: appId
      };
      let newData;
      for (let index = 0; index < kpiData.length; index++) {
        const element = kpiData[index];

        setKpiLoading((currentData) => ({ ...currentData, [element.kpi_id]: true }));
        const executeDashboardMutation = {
          query: `query {
          executeDashboard(dashboardId:"${dashboardId}",kpiId:"${element.kpi_id}",dashboardParam:"${dashboardParams}"){data, messageCode, title, message}
        }`,
        };
        Axios.post(genericUrl, executeDashboardMutation, { headers: headers }, { async: true }, { crossDomain: true }).then((execDashRes) => {
          const responseFromServer = execDashRes.data.data.executeDashboard;
          if (responseFromServer.title === "Success") {
            const dashboardData = JSON.parse(responseFromServer.data);
            newData = dashboardDataInState;
            for (const [key, value] of Object.entries(dashboardData)) {
              newData[key] = value;
            }
            setDashboardDataInState({ ...newData });
            setKpiLoading((currentData) => ({ ...currentData, [element.kpi_id]: false }));
            // dashBoardArr.push(dashboardData)
          } else {
            setKpiLoading((currentData) => ({ ...currentData, [element.kpi_id]: false }));
          }
        });
      }
    } catch (error) {
    }
  };

  const isLoad = (isLoading, data) => {
    if (isLoading === "Y") {
      setKpiLoading((currentData) => ({ ...currentData, [data]: true }));
    } else {
      setKpiLoading((currentData) => ({ ...currentData, [data]: false }));
    }
  };

  const setParamsValueAfterFilter = (data) => {
    setDashboardParams(data);
  };

  let currSymbol = ""; // Initialize as an empty string

  if (userCurrency) {
    const foundCurrency = globalParams.Currency.find((currency) => {
      const currencyKey = Object.keys(currency)[0]; // Extract the currency key
      const currencyDetails = currency[currencyKey];
  
      if (currencyDetails.isoCode === userCurrency) {
        currSymbol = currencyDetails.currSymbol;
        return true; // Break out of the loop since we found the currency
      }
  
      return false;
    });
  
    if (!foundCurrency) {
      console.log("User currency not found");
    }
  } else {
    console.log("User currency is not defined");
  }

  const amountFormat = (badgeValue,currency_field) => {
    let result;
    if (userCurrency === 'INR') {
      const absVal = Math.abs(badgeValue)
      if (badgeValue === undefined) {
        result = 0
      } else if (absVal >= 10000000) {
        result = ' '+`${(absVal / 10000000).toFixed(2)} Cr`
      } else if (absVal >= 100000) {
        result = ' '+`${(absVal / 100000).toFixed(2)} L`
      } /* else if (Math.abs(Number(badgeValue)) >= 1.0e3) {
        result = `${(Math.abs(Number(badgeValue)) / 1.0e3).toFixed(2)} K`
      } */ else {
        result = ' '+absVal
      }
      if (currency_field && currency_field.trim() !== '') {
        result = currSymbol + result;
      }
    } else {
      if (badgeValue === undefined) {
        result = 0
      } else if (Math.abs(Number(badgeValue)) >= 1.0e9) {
        result = `${(Math.abs(Number(badgeValue)) / 1.0e9).toFixed(2)} B`
      } else if (Math.abs(Number(badgeValue)) >= 1.0e6) {
        result = `${(Math.abs(Number(badgeValue)) / 1.0e6).toFixed(2)} M`
      } else if (Math.abs(Number(badgeValue)) >= 1.0e3) {
        result = `${(Math.abs(Number(badgeValue)) / 1.0e3).toFixed(2)} K`
      } else {
        result = Math.abs(Number(badgeValue))
      }
      if (currency_field && currency_field.trim() !== '') {
        result = currSymbol + result;
      }
    }
    return result;
  };
  

  const maximizeChart = (id, type, title, properties) => {
    setChartKpiId(id);
    setChartType(type);
    setChartTitle(title);
    setChartProperties(properties);
    /* let data = [...kpiData];
    setFullScreenValue(true);
    for (let index1 = 0; index1 < data.length; index1++) {
      if (data[index1].kpi_id !== id) {
        data[index1].hide = "Y";
      }
    };
    setKpiData(data);
    if (fullScreenValue === true) {
      for (let index1 = 0; index1 < data.length; index1++) {
        data[index1].hide = "N";
      }
      setKpiData(data);
      setFullScreenValue(false);
    } */
  };

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
      // backgroundColor: "#c1c1c1",
      // borderRadius: "5px",
      width: "0px",
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const renderView = ({ style, ...props }) => {
    const viewStyle = {
      color: "#00000",
    };
    return <div className="box" style={{ ...style, ...viewStyle,overflowX:"hidden" }} {...props} />;
  };

  const toggleNoScroll = (off) => {
    //	test if already exist:
    var a = Array.prototype.indexOf.call(document.body.classList, "no-scroll") + 1;
    //	remove if does exist, so as not to double up
    document.body.className = document.body.className.replace(" no-scroll", "");
    //	add only if off IS False OR off is empty & it did not previously exist (thus "toggle")
    if (off === false || (off !== true && !a)) document.body.className += " no-scroll";
    return document.body.classList;
  };

  const fullScreenMode = (value) => {
    if (value) {
      if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        toggleNoScroll(true);
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        toggleNoScroll(false);
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    }
  };

  const dashboardParamsAndKpiData = {
    kpiData: kpiData,
    dashboardParams: dashboardParams,
  };

  

  const filteredData = (data) => {
    let newData = dashboardDataInState;
    const parsedJSON = data;
    for (const [key, value] of Object.entries(parsedJSON)) {
      newData[key] = value;
    }
    setDashboardDataInState({ ...newData });
    /* if (data.title === 'Error') {
      message.error(`${data.message}`)
    } else {
      let newData = this.state.dashboardDataInState
      const parsedJSON = data
      for (const [key, value] of Object.entries(parsedJSON)) {
        newData[key] = value
      }
      this.setState({ dashboardDataInState: newData, hideChartData: flag })
    } */
  };

  /* const showKpiOptions=()=>{

  } */

  /* const expandChart = (id) => {
    let data = [...kpiData];
    setFullScreenValue(true);
    for (let index1 = 0; index1 < data.length; index1++) {
      if (data[index1].kpi_id !== id) {
        data[index1].hide = "Y";
      }
    }
    setKpiData(data);
    if (fullScreenValue === true) {
      for (let index1 = 0; index1 < data.length; index1++) {
        data[index1].hide = "N";
      }
      setKpiData(data);
      setFullScreenValue(false);
    }
  }; */

  const expandChart = kpiId => {
    setFullScreenValue(true);
    setKpiIdInState(kpiId)
    // this.setState({ fullScreenValue: true, kpiIdInState: kpiId })
    if (fullScreenValue === true) {
      setFullScreenValue(false);
      setKpiIdInState('')
      // this.setState({ fullScreenValue: false, kpiIdInState: '' })
    }
  }

  const refreshChart = (kpiId) => {
    try {
      const stringifiedJSON = JSON.stringify(dashboardParams);
      let jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const { access_token } = getOAuthHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${access_token}`,
        appId: appId
      };
      let newData;

      setKpiLoading((currentData) => ({ ...currentData, [kpiId]: true }));
      const executeDashboardMutation = {
        query: `query {
        executeDashboard(dashboardId:"${dashboardId}",kpiId:"${kpiId}",dashboardParam:"${jsonToSend}"){data, messageCode, title, message}
      }`,
      };
      Axios.post(genericUrl, executeDashboardMutation, { headers: headers }, { async: true }, { crossDomain: true }).then((execDashRes) => {
        const responseFromServer = execDashRes.data.data.executeDashboard;
        if (responseFromServer.title === "Success") {
          const dashboardData = JSON.parse(responseFromServer.data);
          newData = dashboardDataInState;
          for (const [key, value] of Object.entries(dashboardData)) {
            newData[key] = value;
          }
          setDashboardDataInState({ ...newData });
          setKpiLoading((currentData) => ({ ...currentData, [kpiId]: false }));
          // dashBoardArr.push(dashboardData)
        } else {
          setKpiLoading((currentData) => ({ ...currentData, [kpiId]: false }));
        }
      });
    } catch (error) {
    }
  };

  const exportTableData = (chartKpiId, chartTitle, chartProperties) => {

    const tableData = dashboardDataInState[chartKpiId]
    const finalArr = []
    for (const [key, value] of Object.entries(tableData)) {
    // newData[key] = value    
      delete value["key"]
  }
 
    const tableProperties = JSON.parse(chartProperties)
    const columnsDataArr = tableProperties.columnsData
    const dataIndexArr = []
    for (let index = 0; index < columnsDataArr.length; index++) {
      dataIndexArr.push(columnsDataArr[index].dataIndex)
    }
    for (let index = 0; index < tableData.length; index++) {
      const jsonObj={}
      const element1 = tableData[index];
      for (let index2 = 0; index2 < dataIndexArr.length; index2++) {
        const element2 = dataIndexArr[index2];
        jsonObj[element2]=element1[element2]
      }
      finalArr.push(jsonObj)
    }


    const options = {
      fieldSeparator: ',',
      filename: chartTitle,
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: headersArr,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    }
    const csvExporter = new ExportToCsv(options)
    csvExporter.generateCsv(finalArr)
  };

  const kpiOptionsMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => expandChart(chartKpiId)}>
        Expand
      </Menu.Item>
      <Menu.Item key="2" onClick={() => refreshChart(chartKpiId)}>
        Refresh
      </Menu.Item>
      {chartType === "Table Chart" ? (
        <Menu.Item key="3" onClick={() => exportTableData(chartKpiId, chartTitle, chartProperties)}>
          Download
        </Menu.Item>
      ) : (
        ""
      )}
    </Menu>
  );

  const currentYearDateChange = (values) => {
    setIsDateChanged(values.isDateChanged);
    setCurrentYearFlag(values.currentYearFlag);
    setFromDateYear(values.fromDateYearInState);
    /* this.setState({
      isDateChanged: values.isDateChanged,
      currentYearFlag: values.currentYearFlag,
      fromDateYearInState: values.fromDateYearInState,
    }) */
  };

  const previousYearDateChange = (values) => {
    setIsDateChanged(values.isDateChanged);
    setPreviousYearFlag(values.previousYearFlag);
    setFromDateYear(values.fromDateYearInState);
    /* this.setState({
      isDateChanged: values.isDateChanged,
      previousYearFlag: values.previousYearFlag,
      fromDateYearInState: values.fromDateYearInState,
    }) */
  };

  const clearFilterValues = () => {
    setIsDateChanged(false);
    setPreviousYearFlag(false);
    setFromDateYear(false);
  };

  return (
    <div >
    <Spin  indicator={<LoadingOutlined style={{fontSize:"3em"}} spin />} spinning={loading}>
    <HeaderComponent
          dashboardId={dashboardId}
          isComparableFlag={isComparableFlag}
          dashboardFilters={dashboardFilters}
          initializationData={initializationData}
          dashboardTitle={dashboardName}
          fullScreen={fullScreenMode}
          refreshDashboard={getDashboardData}
          previousYearArray={previousYearArray}
          currentYearDateChange={currentYearDateChange}
          previousYearDateChange={previousYearDateChange}
          clearFilterValues={clearFilterValues}
          kpiData={kpiData}
          filteredData={filteredData}
          loadingAfterFiltersApplied={isLoad}
          paramsValue={setParamsValueAfterFilter}
          executeDashboard={executeDashboard}
          setLoading={setLoading}
        />
      <Scrollbars
        autoHide={false}
        // Hide delay in ms
        // autoHideTimeout={1000}
        // Duration for hide animation in ms.
        // autoHideDuration={200}
        thumbSize={100}
        universal
        renderView={renderView}
        renderThumbHorizontal={renderThumbHorizontalScroll}
        renderThumbVertical={renderThumb}
        style={{ height: "73vh" }}
      >
        <Row gutter={8} style={{paddingBottom:"10px", display: fullScreenValue === true ? "none" : "",}}>
          {kpiData.map((kpiContent, index) => {
            const kpiUIProperties = JSON.parse(kpiContent.properties);
            let bgColor;
            let textColor;
            let titleTextColor;
            let badgeTitleColor;
            let displayChart = false;
            let previousYearDate;
            let backgroundImage;
            let opacityNumber;

            if (isDateChanged === true && previousYearFlag === true && currentYearFlag === true) {
              previousYearDate = fromDateYear;
            } else if (isDateChanged === true && currentYearFlag === true) {
              previousYearDate = fromDateYear - 1;
            } else if (isDateChanged === true && previousYearFlag === true) {
              previousYearDate = fromDateYear;
            } else {
              previousYearDate = new Date().getFullYear() - 1;
            }

            if ((kpiContent.kpi_id === kpiIdInState || kpiIdInState === '') && (kpiContent.isDrilldownedKpi === "N" || kpiContent.isDrilldownedKpi === undefined) && (kpiContent.isactive === "Y" || kpiContent.isactive === undefined)) {
              displayChart = true;
            }
            if (kpiUIProperties === null) {
              titleTextColor="#0C173A"
              bgColor = "white";
              textColor = "black";
              badgeTitleColor = "black";
              backgroundImage = 'none';
              opacityNumber = 1
            } else {
              if (kpiUIProperties["titleTextColor"] === undefined) {
                titleTextColor = "#19181A";
              } else {
                titleTextColor = "#0C173A";
              }
              if(kpiUIProperties["opacityNumber"] === undefined){
                opacityNumber = 1
              }else{
                opacityNumber = kpiUIProperties["opacityNumber"]
              }
              if(kpiUIProperties["imageUrl"] === undefined){
                backgroundImage = 'none'
              }else{
                backgroundImage = kpiUIProperties["imageUrl"]
              }
              if (kpiUIProperties["bgcolor"] === undefined) {
                bgColor = "white";
              } else {
                bgColor = kpiUIProperties["bgcolor"];
              }

              if (kpiUIProperties["textColor"] === undefined) {
                textColor = "#19181A";
              } else {
                textColor = "#0C173A";
              }
              if (kpiUIProperties["badgeTitleColor"] === undefined) {
                badgeTitleColor = "#19181A";
              } else {
                badgeTitleColor = kpiUIProperties["badgeTitleColor"];
              }
            }
            const netPercentage =
              ((dashboardDataInState[kpiContent.kpi_id] - dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")]) /
                dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")]) *
              100;
            if (kpiContent.hide === "N" && kpiContent.isactive === "Y" && kpiContent.type === "Badge") {
              return (
                <Col
                  key={index}
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: fullScreenValue === true && kpiContent.type !== "Badge" ? 24 : kpiContent.column_space * 2 }}
                  lg={{ span: fullScreenValue === true && kpiContent.type !== "Badge" ? 24 : kpiContent.column_space * 2 }}
                  xl={{ span: fullScreenValue === true && kpiContent.type !== "Badge" ? 24 : kpiContent.column_space * 2 }}
                  xxl={{ span: fullScreenValue === true && kpiContent.type !== "Badge" ? 24 : kpiContent.column_space * 2 }}
                  style={{ marginBottom: "13px",paddingLeft:"8px",paddingRight:"8px"}}
                >
                  {
                     kpiLoading[kpiContent.kpi_id] ?
                      <Skeleton.Button
                        active
                        style={{
                          width: '100%',
                          height: '20vh',
                          borderRadius: '10px',
                          marginRight: '1rem',
                        }}
                      /> :
                      <Card
                      className="op"
                      style={{
                        // padding:"3px",
                        background:"#FFFFFF",
                        border: "1px solid #E6E8ED",
                        borderRadius: "8px",
                        opacity : opacityNumber,
                        // backgroundImage:`url(${backgroundImage})`,
                        padding:kpiContent.type !== "Badge"?7:0,
                        backgroundRepeat:"no-repeat",
                        backgroundPosition:"right",
                        // backgroundImage:kpiUIProperties["imageUrl"]===undefined || kpiUIProperties["imageUrl"]===null ? 'none':`url(${kpiUIProperties["imageUrl"]})`,
                        // background: "#FFFFFF",
                        // backgroundImage: kpiContent.type === "Badge"?`linear-gradient(to right, ${gradientOne}, ${gradientTwo} , ${gradientThree})`:`linear-gradient(to right, #FFFFFF, #FFFFFF , #FFFFFF)`,
                        // display: kpiContent.isactive === "Y" || kpiContent.isactive === undefined ? "block" : "none",
                        display: displayChart === true ? "block" : "none",
                        height:
                          fullScreenValue === true && kpiContent.type !== "Badge"
                            ? "81.3vh"
                            : kpiContent.type === "Badge"
                            ? "15vh"
                            : kpiContent.widget_height === undefined || kpiContent.widget_height === null
                            ? "47vh"
                            : "257px",
                      }}
                    >
                      <span className="chartTitle">
                        <span className="formRecordTitle" style={{color: titleTextColor,fontWeight: kpiContent.type === "Badge" ? 400 : 600,marginTop:'2px',fontFamily:'Inter',display:"inline-block",width:kpiContent.type === "Badge" ?'70%':null,fontSize:kpiContent.type === "Badge" ?"0.9vw":"1vw"}}>{kpiContent.title}</span>
                          {kpiContent.type !== "Badge" ? (
                            <span className="maxIcon">
                              <span>
                                <img src={dashboardRefresh} style={{ cursor: "pointer" }} height="11px" width="11px" onClick={() => refreshChart(kpiContent.kpi_id)} />
                              </span>
                              &emsp;
                              <span>
                                {fullScreenValue === false ? (
                                  <img alt="maximize" height="11px" width="11px" src={expandChartIcon} style={{ cursor: "pointer" }} onClick={() => expandChart(kpiContent.kpi_id)} />
                                ) : (
                                  <img alt="minimize" height="11px" width="11px" src={closeIcon} style={{ cursor: "pointer" }} onClick={() => expandChart(kpiContent.kpi_id)} />
                                )}
                              </span>
                              &emsp;
                              {kpiContent.type === 'Table Chart' ? (
                                  <Tooltip placement="top" title="Export">
                                    <DownloadOutlined
                                      // className="maxIcon"
                                      style={{
                                        // float: 'right',
                                        cursor: 'pointer',
                                        opacity: 1,
                                        paddingTop: '3px',
                                        paddingRight: '3px',
                                        color: '#43682B',
                                      }}
                                      onClick={() =>
                                        exportTableData(
                                          kpiContent.kpi_id,
                                          kpiContent.title,
                                          kpiContent.properties,
                                        )
                                      }
                                    />
                                  </Tooltip>
                                ) : (
                                  ''
                                )}
                            </span>
                          ) : (
                            /* fullScreenValue === false ? (
                              <img height="11px" width="11px" src={FullScreen} style={{ float: "right", cursor: "pointer" }} onClick={() => maximizeChart(kpiContent.kpi_id)} />
                            ) : (
                              <CloseOutlined onClick={() => maximizeChart(kpiContent.kpi_id)} style={{ float: "right" }} />
                            ) */
                            ""
                          )}
                        </span>
                      {/* </span> */}
                      {kpiContent.type === 'Badge' && isFinite(netPercentage) ? (
                        <span style={{ float: 'right' }}>
                          {netPercentage < 0 ? (
                            <img alt="redArrow" src={badgeIconRed} />
                          ) : (
                            <img alt="redArrow" src={badgeIcon} />
                          )}
                        </span>
                      ) : null}
                      
                      {(() => {
                        if (chartLibrary === "D3JS") {
                          switch (kpiContent.type) {
                            case "Badge":
                              return (
                                <>
                                  <span
                                    style={{
                                      fontSize: "20px",
                                      color: "#19181A",
                                      // letterSpacing: "0px",
                                      opacity: "0.8",
                                      fontWeight: "bold",
                                      color: textColor,
                                    }}
                                  >
                                    {amountFormat(dashboardDataInState[kpiContent.kpi_id],kpiContent.currency_field)}
                                  </span>
                                  &nbsp;
                                  <span
                                    style={{
                                      textAlign: "right",
                                      fontSize: "12px",
                                      color: netPercentage < 0 ? "#F9656F" : "#0DBC70",
                                      fontWeight: "bold",
                                      // color: textColor
                                    }}
                                  >
                                    {loading === false ? (
                                      kpiContent.is_comparable === "Y" &&
                                      (dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined) ? (
                                          isFinite(netPercentage) ? (
                                            `${netPercentage < 0 ? "" : "+"}${netPercentage.toFixed(2)}%`
                                          ) : null
                                      ) : (
                                        <br />
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                  &emsp;
                                  <span>
                                    {loading === false ? (
                                      kpiContent.is_comparable === "Y" &&
                                      (dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined) ? (
                                          isFinite(netPercentage) ? (
                                            netPercentage < 0 ? (
                                              <img alt="redArrow" height="13px" width="13px" src={newRedArrow} style={{ marginLeft: '-7px' }} />
                                            ) : (
                                              <img alt="greenArrow"  height="13px" width="13px" src={newGreenArrow} style={{ marginLeft: '-7px' }} />
                                            )
                                          ) : null
                                        ) : (
                                        <br />
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                  <br />
                                  {kpiContent.is_comparable === "Y" ? (
                                    <span >
                                      Compared to {kpiContent.currency_field !== undefined && kpiContent.currency_field !== null ? currencySymbol : ""}&nbsp;
                                      <span style={{ fontWeight: "bold", color: textColor }}>
                                        {dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined
                                          ? amountFormat(dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")],kpiContent.currency_field)
                                          : ""}
                                      </span>
                                      &nbsp;
                                      <span style={{ color: textColor }}>in {previousYearDate}</span>&nbsp;
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                              
                            case "Bar Chart":
                              return (
                                <BarChart
                                  barChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  barChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}

                                  fullScreenValue={fullScreenValue}
                                  chartLibrary={chartLibrary}
                                />
                              );

                            case "Pie Chart":
                              return (
                                <PieChart
                                  pieChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  pieChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Line Chart":
                              return (
                                <LineChart
                                  lineChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  lineChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Donut Chart":
                              return (
                                <DonutChart
                                  donutChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  donutChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Gauge Chart":
                              return (
                                <GaugeChart
                                  gaugeChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  gaugeChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Combination Chart With Single Y axis":
                              return (
                                <CombinationChartSingleYAxis
                                  combinationChartSingleYAxisdata={dashboardDataInState[kpiContent.kpi_id]}
                                  combinationChartSingleYAxisProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Combination Chart With Double Y axis":
                              return (
                                <CombinationChartDoubleYAxis
                                  combinationChartDoubleYAxisdata={dashboardDataInState[kpiContent.kpi_id]}
                                  combinationChartDoubleYAxisProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Table Chart":
                              return (
                                <TableChart
                                  tableChartData={dashboardDataInState[kpiContent.kpi_id]}
                                  tableKpi={kpiContent}
                                  dashboardParamsAndKpiData={dashboardParamsAndKpiData}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Waterfall Chart":
                              return <WaterfallChart waterFallChartdata={dashboardDataInState[kpiContent.kpi_id]} fullScreenValue={fullScreenValue} />;

                            default:
                              return <div>Chart</div>;
                          }
                        } else {
                          
                          switch (kpiContent.type) {
                            case "Badge":
                              return (
                                <>
                                  <span
                                  className="formRecordTitle"
                                    style={{
                                      fontSize: "1.56vw",
                                      color: "#19181A",
                                      // letterSpacing: "0px",
                                      opacity: "0.8",
                                      width:kpiContent.type === "Badge" ?'50%':null,
                                      fontWeight: 700,
                                      color: textColor,
                                      display:'inline-block'
                                    }}
                                  >
                                    {amountFormat(dashboardDataInState[kpiContent.kpi_id],kpiContent.currency_field)}
                                  </span>
                                  <span
                                  style={{float:'right'}}>
                                   <span >
                                    {loading === false ? (
                                      kpiContent.is_comparable === "Y" &&
                                      (dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined) ? (
                                          isFinite(netPercentage) ? (
                                            netPercentage < 0 ? (
                                              <img alt="redArrow" height="13px" width="13px" src={newRedArrow} style={{ marginLeft: '-7px' }} />
                                            ) : (
                                              <img alt="greenArrow"  height="13px" width="13px" src={newGreenArrow} style={{ marginLeft: '-7px' }} />
                                            )
                                          ) : null
                                        ) : (
                                        <br />
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                  &emsp;
                                  <span
                                    style={{
                                      textAlign: "left",
                                      fontSize: "12px",
                                      color: netPercentage < 0 ? "#F9656F" : "#86E2BA",
                                      fontWeight: "bold",
                                      // color: textColor
                                    }}
                                  >
                                    {loading === false ? (
                                      kpiContent.is_comparable === "Y" &&
                                      (dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined) ? (
                                          isFinite(netPercentage) ? (
                                            `${netPercentage < 0 ? "" : "+"}${netPercentage.toFixed(2)}%`
                                          ) : null
                                      ) : (
                                        <br />
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                  </span>
                                  <br />
                                  {kpiContent.is_comparable === "Y" ? (
                                    <span className="formRecordTitle" style={{ fontSize: "12px", color: textColor,opacity:0.5,display:'inline-block' }}>
                                      Compared to {kpiContent.currency_field !== undefined && kpiContent.currency_field !== null ? currencySymbol : ""}&nbsp;
                                      <span style={{  color: textColor  }}>
                                        {dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined
                                          ? amountFormat(dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")],kpiContent.currency_field)
                                          : ""}
                                      </span>
                                      &nbsp;
                                      <span style={{ color: textColor }}>in {previousYearDate}</span>&nbsp;
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );

                            case "Bar Chart":
                              return (
                                <BarChartC3JS
                                  uniqueIndex={index}
                                  barChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  barChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  // colSpace={responsiveDesignForCard}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Pie Chart":
                              return (
                                <PieChartC3JS
                                  uniqueIndex={index}
                                  pieChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  pieChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  colSpace={kpiContent.column_space}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Line Chart":
                              return (
                                <LineChartC3JS
                                  uniqueIndex={index}
                                  lineChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  lineChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Donut Chart":
                              return (
                                <DonutChartC3JS
                                  uniqueIndex={index}
                                  donutChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  donutChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                  colSpace={kpiContent.column_space}
                                />
                              );

                            case "Table Chart":
                              return (
                                <TableChart
                                  tableChartData={dashboardDataInState[kpiContent.kpi_id]}
                                  tableKpi={kpiContent}
                                  dashboardParamsAndKpiData={dashboardParamsAndKpiData}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Gauge Chart":
                              return (
                                <GaugeChartC3JS
                                  uniqueIndex={index}
                                  gaugeChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  gaugeChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Area Chart":
                            return (
                              <AreaChartC3JS
                                uniqueIndex={index}
                                areaChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                areaChartProperties={JSON.parse(kpiContent.properties)}
                                height={kpiContent.widget_height}
                                fullScreenValue={fullScreenValue}
                                colSpace={kpiContent.column_space}
                              />
                            );

                            case "Waterfall Chart":
                            return (
                              <WaterfallChartC3JS
                                uniqueIndex={index}
                                waterFallChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                waterFallChartProperties={JSON.parse(kpiContent.properties)}
                                height={kpiContent.widget_height}
                                fullScreenValue={fullScreenValue}
                                colSpace={kpiContent.column_space}
                              />
                            );

                             case "Combination Chart With Single Y axis":
                              return (
                                <CombinationChartSingleYAxis
                                  combinationChartSingleYAxisdata={dashboardDataInState[kpiContent.kpi_id]}
                                  combinationChartSingleYAxisProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );
                              
  
                            // case "Combination Chart With Double Y axis":
                            //   return (
                            //     <CombinationChartDoubleYAxis
                            //       combinationChartDoubleYAxisdata={dashboardDataInState[kpiContent.kpi_id]}
                            //       combinationChartDoubleYAxisProperties={JSON.parse(kpiContent.properties)}
                            //       height={kpiContent.widget_height}
                            //       fullScreenValue={fullScreenValue}
                            //     />
                            //   );
                              
  
                            
                              
  
                            // case "Waterfall Chart":
                            //   return <WaterfallChart waterFallChartdata={dashboardDataInState[kpiContent.kpi_id]} fullScreenValue={fullScreenValue} />; 

                            default:
                              return <div>Chart</div>;
                          }
                        }
                      })()}
                    </Card>
                  }
                   
                </Col>
              );
            } else {
              return;
            }
          })}
        </Row>
        <Row gutter={8} style={{paddingBottom:"10px"}}>
          {kpiData.map((kpiContent, index) => {
            const kpiUIProperties = JSON.parse(kpiContent.properties);
            let bgColor;
            let textColor;
            let titleTextColor;
            let badgeTitleColor;
            let displayChart = false;
            let previousYearDate;
            let backgroundImage;
            let opacityNumber;

            if (isDateChanged === true && previousYearFlag === true && currentYearFlag === true) {
              previousYearDate = fromDateYear;
            } else if (isDateChanged === true && currentYearFlag === true) {
              previousYearDate = fromDateYear - 1;
            } else if (isDateChanged === true && previousYearFlag === true) {
              previousYearDate = fromDateYear;
            } else {
              previousYearDate = new Date().getFullYear() - 1;
            }

            if ((kpiContent.kpi_id === kpiIdInState || kpiIdInState === '') && (kpiContent.isDrilldownedKpi === "N" || kpiContent.isDrilldownedKpi === undefined) && (kpiContent.isactive === "Y" || kpiContent.isactive === undefined)) {
              displayChart = true;
            }
            if (kpiUIProperties === null) {
              titleTextColor="#0C173A"
              bgColor = "white";
              textColor = "black";
              badgeTitleColor = "black";
              backgroundImage = 'none';
              opacityNumber = 1
            } else {
              if (kpiUIProperties["titleTextColor"] === undefined) {
                titleTextColor = "#19181A";
              } else {
                titleTextColor = "#0C173A";
              }
              if(kpiUIProperties["opacityNumber"] === undefined){
                opacityNumber = 1
              }else{
                opacityNumber = kpiUIProperties["opacityNumber"]
              }
              if(kpiUIProperties["imageUrl"] === undefined){
                backgroundImage = 'none'
              }else{
                backgroundImage = kpiUIProperties["imageUrl"]
              }
              if (kpiUIProperties["bgcolor"] === undefined) {
                bgColor = "white";
              } else {
                bgColor = kpiUIProperties["bgcolor"];
              }

              if (kpiUIProperties["textColor"] === undefined) {
                textColor = "#19181A";
              } else {
                textColor = "#0C173A";
              }
              if (kpiUIProperties["badgeTitleColor"] === undefined) {
                badgeTitleColor = "#19181A";
              } else {
                badgeTitleColor = kpiUIProperties["badgeTitleColor"];
              }
            }
            const netPercentage =
              ((dashboardDataInState[kpiContent.kpi_id] - dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")]) /
                dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")]) *
              100;
            if (kpiContent.hide === "N" && kpiContent.isactive === "Y" && kpiContent.type !== "Badge") {
              return (
                <Col
                  key={index}
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: fullScreenValue === true && kpiContent.type !== "Badge" ? 24 : kpiContent.column_space * 2 }}
                  lg={{ span: fullScreenValue === true && kpiContent.type !== "Badge" ? 24 : kpiContent.column_space * 2 }}
                  xl={{ span: fullScreenValue === true && kpiContent.type !== "Badge" ? 24 : kpiContent.column_space * 2 }}
                  xxl={{ span: fullScreenValue === true && kpiContent.type !== "Badge" ? 24 : kpiContent.column_space * 2 }}
                  style={{ marginBottom: "13px",padding:kpiIdInState !== ''?"0 1em":'0 8px',display:fullScreenValue?kpiContent.kpi_id === kpiIdInState?"block":'none':""}}
                >
                  {
                      kpiLoading[kpiContent.kpi_id] ?
                        <Skeleton.Button
                          active
                          style={{
                            width: '100%',
                            height: '46vh',
                            borderRadius: '10px',
                            marginRight: '1rem',
                          }}
                        />
                        :
                    <Card
                      className="op"
                      style={{
                        // padding:"3px",
                        background:"#FFFFFF",
                        border: "1px solid #E6E8ED",
                        borderRadius: "8px",
                        opacity : opacityNumber,
                        // backgroundImage:`url(${backgroundImage})`,
                        padding:7,
                        backgroundRepeat:"no-repeat",
                        backgroundPosition:"right",
                        // backgroundImage:kpiUIProperties["imageUrl"]===undefined || kpiUIProperties["imageUrl"]===null ? 'none':`url(${kpiUIProperties["imageUrl"]})`,
                        // background: "#FFFFFF",
                        // backgroundImage: kpiContent.type === "Badge"?`linear-gradient(to right, ${gradientOne}, ${gradientTwo} , ${gradientThree})`:`linear-gradient(to right, #FFFFFF, #FFFFFF , #FFFFFF)`,
                        // display: kpiContent.isactive === "Y" || kpiContent.isactive === undefined ? "block" : "none",
                        display: displayChart === true ? "block" : "none",
                        height:
                          fullScreenValue === true && kpiContent.type !== "Badge"
                            ? "66vh"
                            : kpiContent.type === "Badge"
                            ? "105px"
                            : kpiContent.widget_height === undefined || kpiContent.widget_height === null
                            ? "47vh"
                            : "257px",
                      }}
                    >
                      <span className="chartTitle">
                        <span className="formRecordTitle" style={{color: titleTextColor,fontWeight: kpiContent.type === "Badge" ? 500 : 600,marginTop:'2px',fontFamily:'Inter',display:"inline-block",width:kpiContent.type === "Badge" ?'70%':null}}>{kpiContent.title}</span>
                          {kpiContent.type !== "Badge" ? (
                            <span className="maxIcon">
                              <span>
                                <img src={dashboardRefresh} style={{ cursor: "pointer" }} height="11px" width="11px" onClick={() => refreshChart(kpiContent.kpi_id)} />
                              </span>
                              &emsp;
                              <span>
                                {fullScreenValue === false ? (
                                  <img alt="maximize" height="11px" width="11px" src={expandChartIcon} style={{ cursor: "pointer" }} onClick={() => expandChart(kpiContent.kpi_id)} />
                                ) : (
                                  <img alt="minimize" height="11px" width="11px" src={closeIcon} style={{ cursor: "pointer" }} onClick={() => expandChart(kpiContent.kpi_id)} />
                                )}
                              </span>
                              &emsp;
                              {kpiContent.type === 'Table Chart' ? (
                                  <Tooltip placement="top" title="Export">
                                    <DownloadOutlined
                                      // className="maxIcon"
                                      style={{
                                        // float: 'right',
                                        cursor: 'pointer',
                                        opacity: 1,
                                        paddingTop: '3px',
                                        paddingRight: '3px',
                                        color: '#43682B',
                                      }}
                                      onClick={() =>
                                        exportTableData(
                                          kpiContent.kpi_id,
                                          kpiContent.title,
                                          kpiContent.properties,
                                        )
                                      }
                                    />
                                  </Tooltip>
                                ) : (
                                  ''
                                )}
                            </span>
                          ) : (
                            /* fullScreenValue === false ? (
                              <img height="11px" width="11px" src={FullScreen} style={{ float: "right", cursor: "pointer" }} onClick={() => maximizeChart(kpiContent.kpi_id)} />
                            ) : (
                              <CloseOutlined onClick={() => maximizeChart(kpiContent.kpi_id)} style={{ float: "right" }} />
                            ) */
                            ""
                          )}
                        </span>
                      {/* </span> */}
                      {kpiContent.type === 'Badge'?<span style={{float:'right'}}> <img alt="redArrow"  src={badgeIcon} /></span>:''}
                      <br />
                      {(() => {
                        if (chartLibrary === "D3JS") {
                          switch (kpiContent.type) {
                            case "Badge":
                              return (
                                <>
                                  <span
                                    style={{
                                      fontSize: "20px",
                                      color: "#19181A",
                                      // letterSpacing: "0px",
                                      opacity: "0.8",
                                      fontWeight: "bold",
                                      color: textColor,
                                    }}
                                  >
                                    {amountFormat(dashboardDataInState[kpiContent.kpi_id],kpiContent.currency_field)}
                                  </span>
                                  &nbsp;
                                  <span
                                    style={{
                                      textAlign: "right",
                                      fontSize: "12px",
                                      color: netPercentage < 0 ? "#F9656F" : "#0DBC70",
                                      fontWeight: "bold",
                                      // color: textColor
                                    }}
                                  >
                                    {loading === false ? (
                                      kpiContent.is_comparable === "Y" &&
                                      (dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined) ? (
                                          isFinite(netPercentage) ? (
                                            `${netPercentage < 0 ? "" : "+"}${netPercentage.toFixed(2)}%`
                                          ) : null
                                      ) : (
                                        <br />
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                  &emsp;
                                  <span>
                                    {loading === false ? (
                                      kpiContent.is_comparable === "Y" &&
                                      (dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined) ? (
                                          isFinite(netPercentage) ? (
                                            netPercentage < 0 ? (
                                              <img alt="redArrow" height="13px" width="13px" src={newRedArrow} style={{ marginLeft: '-7px' }} />
                                            ) : (
                                              <img alt="greenArrow"  height="13px" width="13px" src={newGreenArrow} style={{ marginLeft: '-7px' }} />
                                            )
                                          ) : null
                                        ) : (
                                        <br />
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                  <br />
                                  {kpiContent.is_comparable === "Y" ? (
                                    <span >
                                      Compared to {kpiContent.currency_field !== undefined && kpiContent.currency_field !== null ? currencySymbol : ""}&nbsp;
                                      <span style={{ fontWeight: "bold", color: textColor }}>
                                        {dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined
                                          ? amountFormat(dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")],kpiContent.currency_field)
                                          : ""}
                                      </span>
                                      &nbsp;
                                      <span style={{ color: textColor }}>in {previousYearDate}</span>&nbsp;
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                              
                            case "Bar Chart":
                              return (
                                <BarChart
                                  barChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  barChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}

                                  fullScreenValue={fullScreenValue}
                                  chartLibrary={chartLibrary}
                                />
                              );

                            case "Pie Chart":
                              return (
                                <PieChart
                                  pieChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  pieChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Line Chart":
                              return (
                                <LineChart
                                  lineChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  lineChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Donut Chart":
                              return (
                                <DonutChart
                                  donutChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  donutChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Gauge Chart":
                              return (
                                <GaugeChart
                                  gaugeChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  gaugeChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Combination Chart With Single Y axis":
                              return (
                                <CombinationChartSingleYAxis
                                  combinationChartSingleYAxisdata={dashboardDataInState[kpiContent.kpi_id]}
                                  combinationChartSingleYAxisProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Combination Chart With Double Y axis":
                              return (
                                <CombinationChartDoubleYAxis
                                  combinationChartDoubleYAxisdata={dashboardDataInState[kpiContent.kpi_id]}
                                  combinationChartDoubleYAxisProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Table Chart":
                              return (
                                <TableChart
                                  tableChartData={dashboardDataInState[kpiContent.kpi_id]}
                                  tableKpi={kpiContent}
                                  dashboardParamsAndKpiData={dashboardParamsAndKpiData}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Waterfall Chart":
                              return <WaterfallChart waterFallChartdata={dashboardDataInState[kpiContent.kpi_id]} fullScreenValue={fullScreenValue} />;

                            default:
                              return <div>Chart</div>;
                          }
                        } else {
                          switch (kpiContent.type) {
                            case "Badge":
                              return (
                                <>
                                  <span
                                  className="formRecordTitle"
                                    style={{
                                      fontSize: "20px",
                                      color: "#19181A",
                                      // letterSpacing: "0px",
                                      opacity: "0.8",
                                      width:kpiContent.type === "Badge" ?'50%':null,
                                      fontWeight: "bold",
                                      color: textColor,
                                      display:'inline-block'
                                    }}
                                  >
                                    {amountFormat(dashboardDataInState[kpiContent.kpi_id],kpiContent.currency_field)}
                                  </span>
                                  <span
                                  style={{float:'right'}}>
                                   <span >
                                    {loading === false ? (
                                      kpiContent.is_comparable === "Y" &&
                                      (dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined) ? (
                                          isFinite(netPercentage) ? (
                                            netPercentage < 0 ? (
                                              <img alt="redArrow" height="13px" width="13px" src={newRedArrow} style={{ marginLeft: '-7px' }} />
                                            ) : (
                                              <img alt="greenArrow"  height="13px" width="13px" src={newGreenArrow} style={{ marginLeft: '-7px' }} />
                                            )
                                          ) : null
                                        ) : (
                                        <br />
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                  &emsp;
                                  <span
                                    style={{
                                      textAlign: "left",
                                      fontSize: "12px",
                                      color: netPercentage < 0 ? "#F9656F" : "#86E2BA",
                                      fontWeight: "bold",
                                      // color: textColor
                                    }}
                                  >
                                    {loading === false ? (
                                      kpiContent.is_comparable === "Y" &&
                                      (dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined) ? (
                                          isFinite(netPercentage) ? (
                                            `${netPercentage < 0 ? "" : "+"}${netPercentage.toFixed(2)}%`
                                          ) : null
                                      ) : (
                                        <br />
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                  </span>
                                  <br />
                                  {kpiContent.is_comparable === "Y" ? (
                                    <span className="formRecordTitle" style={{ fontSize: "12px", color: textColor,opacity:0.5,display:'inline-block' }}>
                                      Compared to {kpiContent.currency_field !== undefined && kpiContent.currency_field !== null ? currencySymbol : ""}&nbsp;
                                      <span style={{  color: textColor  }}>
                                        {dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined
                                          ? amountFormat(dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")],kpiContent.currency_field)
                                          : ""}
                                      </span>
                                      &nbsp;
                                      <span style={{ color: textColor }}>in {previousYearDate}</span>&nbsp;
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );

                            case "Bar Chart":
                              return (
                                <BarChartC3JS
                                  uniqueIndex={index}
                                  barChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  barChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  // colSpace={responsiveDesignForCard}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Pie Chart":
                              return (
                                <PieChartC3JS
                                  uniqueIndex={index}
                                  pieChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  pieChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  colSpace={kpiContent.column_space}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Line Chart":
                              return (
                                <LineChartC3JS
                                  uniqueIndex={index}
                                  lineChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  lineChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Donut Chart":
                              return (
                                <DonutChartC3JS
                                  uniqueIndex={index}
                                  donutChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  donutChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                  colSpace={kpiContent.column_space}
                                />
                              );

                            case "Table Chart":
                              return (
                                <TableChart
                                  tableChartData={dashboardDataInState[kpiContent.kpi_id]}
                                  tableKpi={kpiContent}
                                  dashboardParamsAndKpiData={dashboardParamsAndKpiData}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Gauge Chart":
                              return (
                                <GaugeChartC3JS
                                  uniqueIndex={index}
                                  gaugeChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  gaugeChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Area Chart":
                            return (
                              <AreaChartC3JS
                                uniqueIndex={index}
                                areaChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                areaChartProperties={JSON.parse(kpiContent.properties)}
                                height={kpiContent.widget_height}
                                fullScreenValue={fullScreenValue}
                                colSpace={kpiContent.column_space}
                              />
                            );

                            case "Waterfall Chart":
                            return (
                              <WaterfallChartC3JS
                                uniqueIndex={index}
                                waterFallChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                waterFallChartProperties={JSON.parse(kpiContent.properties)}
                                height={kpiContent.widget_height}
                                fullScreenValue={fullScreenValue}
                                colSpace={kpiContent.column_space}
                              />
                            );

                              case "Combination Chart With Single Y axis":
                              return (
                                <CombinationChartSingleYAxis
                                  combinationChartSingleYAxisdata={dashboardDataInState[kpiContent.kpi_id]}
                                  combinationChartSingleYAxisProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );
                              
  
                            // case "Combination Chart With Double Y axis":
                            //   return (
                            //     <CombinationChartDoubleYAxis
                            //       combinationChartDoubleYAxisdata={dashboardDataInState[kpiContent.kpi_id]}
                            //       combinationChartDoubleYAxisProperties={JSON.parse(kpiContent.properties)}
                            //       height={kpiContent.widget_height}
                            //       fullScreenValue={fullScreenValue}
                            //     />
                            //   );
                              
  
                            
                              
  
                            // case "Waterfall Chart":
                            //   return <WaterfallChart waterFallChartdata={dashboardDataInState[kpiContent.kpi_id]} fullScreenValue={fullScreenValue} />; 

                            default:
                              return <div>Chart</div>;
                          }
                        }
                      })()}
                    </Card>
            }
                </Col>
              );
            } else {
              return;
            }
          })}
        </Row>
      </Scrollbars>
    </Spin>
    </div>
  );
};

export default Dashboard;
