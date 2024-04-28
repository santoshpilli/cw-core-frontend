import React, { useState } from "react";
import { Modal,message,Row,Col } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { ExportToCsv } from "export-to-csv";
import Axios from "axios";
// import Export from "../../../assets/images/exportReport.svg";
// import { genericUrl } from "../../../constants/serverConfig";
import TableForChart from "./TableForChart";
import { getOAuthHeaders } from "../../../constants/oAuthValidation";

const TableChartComponent = (props) => {
  const [drillDownPopup, setPopupForDrillDown] = useState(false);
  const [drillDownTitle, setDrillDownTitle] = useState("");
  const [drillDownTableColumns, setDrillDownTableColumns] = useState([]);
  const [drillDownTableData, setDrillDownTableData] = useState([]);
  const [drillDownParams, setDrillDownParams] = useState({})
  const genericUrl = process.env.REACT_APP_genericUrl;
  const [drillDownClickedCount , setDrillDownClickedCount] = useState(0)
  const { tableChartData, tableKpi, dashboardParamsAndKpiData,fullScreenValue } = props;
  const tableProperties = JSON.parse(tableKpi.properties);
  const columnsDataArr = tableProperties.columnsData;
  let appId = localStorage.getItem("appId");
  
  for (let index = 0; index < columnsDataArr.length; index++) {
    const element = columnsDataArr[index];
    const title = element.title;
    const dataType = element.type
    element["render"] = (text) => <span style={{ color: element.drillDown === "Y"?"blue":"",float:dataType==="string"?"left":"right" }}>{text===null || text===undefined?'':dataType==="string"?text:text.toLocaleString('en-US')}</span>;
    if (element.drillDown === "Y") {
      element["render"] = (text) => <span style={{ color: "blue" }}>{text}</span>;
      element["onCell"] = (record) => ({
        onClick: () => {
          drillDownForTable(record, tableKpi);
        },
      });
    }
    element["width"] = 100;
    element["ellipsis"] = true;
    element.title = <span className="dragHandler"><b style={{color:"gray", float:dataType==="string"?"left":"right"}}>{title}</b></span>
  }
  


  const drillDownForTable = (record, tableKpi) => {
    try {
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const { access_token } = getOAuthHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${access_token}`,
        appId: appId
      };
      const kpiData = dashboardParamsAndKpiData.kpiData;
      const drillDownFilter = tableKpi.drilldown_inputfilters;
      const paramsJson = dashboardParamsAndKpiData.dashboardParams;
      paramsJson[drillDownFilter] = record[drillDownFilter];
      const stringifiedJSON = JSON.stringify(paramsJson);
      const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
      setDrillDownParams(jsonToSend)
      const executeDashboardMutation = {
        query: `query {
             executeDashboard(dashboardId:"${tableKpi.nt_dashboard_id}",kpiId:"${tableKpi.drilldown_kpi_id}",dashboardParam:"${jsonToSend}"){data, messageCode, title, message}
           }`,
      };
      Axios.post(genericUrl, executeDashboardMutation, { headers: headers }, { async: true }, { crossDomain: true }).then((execDashRes) => {
        const responseFromServer = execDashRes.data.data.executeDashboard;
        if (responseFromServer.title === "Success") {
          const successResponse = JSON.parse(responseFromServer.data);
          const tableData = successResponse[tableKpi.drilldown_kpi_id];
          let chartJSON = {};
          for (let chartIndex = 0; chartIndex < kpiData.length; chartIndex += 1) {
            const element = kpiData[chartIndex];
            if (tableKpi.drilldown_kpi_id === element.kpi_id) {
              chartJSON = element;
            }
          }
          const chartProperties = JSON.parse(chartJSON.properties);
          if (chartJSON.type === "Table Chart") {
            const drillDownTableCols = chartProperties.columnsData;
            for (let index = 0; index < drillDownTableCols.length; index++) {
              const element = drillDownTableCols[index];
              const title = element.title;
              const dataType = element.type
              element["render"] = (text) => <span style={{ color: element.drillDown === "Y"?"blue":"",float:dataType==="string"?"left":"right" }}>{text===null || text===undefined?'':dataType==="string"?text:text.toLocaleString('en-US')}</span>;
              element.title = <span className="dragHandler">{title}</span>;
              if (element.drillDown === "Y") {
                element["render"] = (text) => <span style={{ color: "blue" }}>{text}</span>;
                element["onCell"] = (record) => ({
                  onClick: () => {
                    // setDrillDownClickedCount(drillDownClickedCount + 1)
                    drillDownForTable(record, chartJSON);
                  },
                });
              };
              element.title = <span className="dragHandler"><b style={{color:"gray", float:dataType==="string"?"left":"right"}}>{title}</b></span>
              setPopupForDrillDown(true)
              setDrillDownTitle(record[drillDownFilter])
              setDrillDownTableData(tableData)
              setDrillDownTableColumns(drillDownTableCols);              
            }
          }
        } else {
          message.error(responseFromServer.message)
        }
      });
    } catch (error) {
    }
  };

  const downloadDrillDownData=()=>{
    for (const [key, value] of Object.entries(drillDownTableData)) {      
      delete value["key"]
  }

  for (let index = 0; index < drillDownTableData.length; index++) {
    const element = drillDownTableData[index];
    for (const [key, value] of Object.entries(element)) {   
      if(typeof(value)==="number"){
        if(isNaN(value)===true){
          delete element[key]
        }
      }   
    } 
  }
    const options = {
      fieldSeparator: ',',
      filename: drillDownTitle,
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
    csvExporter.generateCsv(drillDownTableData)
  }

  const handleOk=()=>{
    setPopupForDrillDown(false)
  }

  const handleCancel=()=>{
    setPopupForDrillDown(false)
    setDrillDownClickedCount(0)
  }

  return (
    <div>
      <TableForChart
        dataSource={tableChartData}
        columnsData={columnsDataArr}
        tableKpi={tableKpi}
        fullScreenValue={fullScreenValue}
        dashboardParamsAndKpiData={dashboardParamsAndKpiData}
      />
      <Modal
        title={
          <Row>
            <Col span={8} />
            <Col span={8}>{drillDownTitle}</Col>
            <Col span={8}>
              {/* <Button color="primary" style={{ float: "right", height: "32px", width: "33px", paddingLeft: "5px", paddingRight: "5px", paddingTop: "6px", borderRadius: "5px" }}>
                <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "18px", cursor: "pointer" }} src={Export} alt="invoice" onClick={downloadDrillDownData} />
              </Button> */}
              <DownloadOutlined
                style={{
                  float: 'right',
                  cursor: "pointer",
                  color: "#43682B",
                }}
                onClick={downloadDrillDownData}
              />
            </Col>
          </Row>
        }
        visible={drillDownPopup}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        width="1000px"
      >
        <TableForChart dataSource={drillDownTableData} columnsData={drillDownTableColumns} tableKpi={tableKpi} dashboardParamsAndKpiData={dashboardParamsAndKpiData} />
      </Modal>
    </div>
  );
};

export default TableChartComponent;