import React, { Fragment, useEffect, useState,useLayoutEffect } from "react";
import { Table, Typography, Input, Space, Button, DatePicker,message,Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useGlobalContext } from "../../lib/storage";
import { Resizable } from 'react-resizable';
import Axios from "axios";
// import { genericUrl } from "../../constants/serverConfig.js";
import ReactDragListView from "react-drag-listview";
// import "antd/dist/antd.css";
import "../../styles/app.css";
import ThemeJson from "../../constants/UIServer.json"
import "../../styles/antd.css";
import { generateToken } from "../../services/generateToken";
import { getOAuthHeaders } from "../../constants/oAuthValidation";
const { Text } = Typography;

const ResizableCell = (props) => {
  
  const { onResize, width, ...restProps} = props;
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

const TableForReport = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson
  const genericUrl = process.env.REACT_APP_genericUrl;
  let scrollLength = 0;
  let defaultScrollLength = 0;
  const { columnsData, gridData,reportFields,nestedTableFlag,parametersToSend,mainReportId, detailedReportId,viewMoreLessFilter,reportFiltersForNextRowLength,totalRecords } = props;
  const [columns, setColumns] = useState([]);
  const [nestedKeys, setNestedKeys] = useState([]);
  const [headerDataForNestedTable,setHeaderForNestedTable]=useState([])
  const [gridDataForNestedTable,setGridDataForNestedTable]=useState([])
  const [nestedTableLoading,setNestedTableLoading]=useState([])
  const [screenSize, setScreenSize] = useState({height:window.innerHeight,width:window.innerWidth});
  let appId = localStorage.getItem("appId");
  const userPreferences = JSON.parse(localStorage.getItem("userPreferences"));
  const roundOffDecimalValue = userPreferences.decimalPlaces;
  const amountArray = []

  const dynamicResolutions=()=>{
    setScreenSize({height:window.innerHeight,width:window.innerWidth})
  }

  useEffect(()=>{
    window.addEventListener('resize', dynamicResolutions);
      return () => window.removeEventListener('resize', dynamicResolutions);
    }, [screenSize]);

  defaultScrollLength = (screenSize.height)-240
  if(viewMoreLessFilter===false){
    scrollLength=400
  }else if(viewMoreLessFilter===true){
    scrollLength=335
  }/* else if(reportFiltersForNextRowLength===0){
    scrollLength=400
  } */
  for (let index = 0; index < reportFields.length; index++) {
    const element = reportFields[index];
    if(element.type==="Amount"){
      amountArray.push(element.fieldName)
    }
  }

  if (gridData.length > 0) {   
    for (let index = 0; index < gridData.length; index++) {
      const element = gridData[index];
      for (let index2 = 0; index2 < amountArray.length; index2++) {
        const element2 = amountArray[index2];
        element[element2] = parseInt(element[element2]);
      }
    }            
  }

  

  useEffect(() => {
    let data = [ ...columnsData];
    const handleReset = clearFilters => {
      clearFilters();
    };
    const getColumnSearchProps = (type) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          {type === "Date" ? 
            <DatePicker
              onChange={(date, dateString) => setSelectedKeys(dateString ? [dateString] : [])}
              style={{ marginBottom: 8, display: 'block' }}
            /> : 
            <Input
              value={selectedKeys[0]}
              onChange={e => { setSelectedKeys(e.target.value ? [e.target.value] : []) }}
              style={{ marginBottom: 8, display: 'block' }}
            />
          }
          <Space>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
            >
              Reset
            </Button>
            <Button
              onClick={() => {
                confirm({ closeDropdown: true });
              }}
              size="small"
            >
              Filter
            </Button>
          </Space>
        </div>
      )
    });
    for (let index = 0; index < data.length; index++) {
      Object.assign(data[index], getColumnSearchProps(data[index].type), { filteredValue : null }, { 
        onFilter: (value, record) => 
          record[data[index].dataIndex]
          ? record[data[index].dataIndex].toString().toLowerCase().includes(value.toLowerCase())
          : ''              
      });
    };
    setColumns(columnsData);
  }, [columnsData]);

  const handleChange = (pagination, filters) => {
    let data = [ ...columns];
    for (let index1 = 0; index1 < Object.keys(filters).length; index1++) {
      for (let index2 = 0; index2 < data.length; index2++) {
        if (Object.keys(filters)[index1] === data[index2].dataIndex) {
          data[index2].filteredValue = Object.values(filters)[index1];
        }
      }
    }
    setColumns(data);
  };

  const components = {
    header: {
      cell: ResizableCell
    }
  };

  const finalColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: columns => ({
      width: columns.width,
      onResize: handleResize(index),
    }),
  }));
  const handleResize = index => (e, { size }) => {
    setColumns((columns) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return nextColumns;
    });
  };

  const dragProps = {
    onDragEnd(fromIndex, toIndex){
      const resizeColumns = [...columns];
      if (nestedTableFlag === 'Y') {
        const item = resizeColumns.splice(fromIndex-1,1)[0];
        resizeColumns.splice(toIndex-1, 0, item);
        setColumns(resizeColumns);
      } else {
        const item = resizeColumns.splice(fromIndex,1)[0];
        resizeColumns.splice(toIndex, 0, item);
        setColumns(resizeColumns);
      }
    },
    nodeSelector: "th",
    handleSelector: ".dragHandler",
    ignoreSelector: "react-resizable-handle"
  };
  
  
  const handleExpand = async (expanded, record) => {
    setNestedKeys([record.key]);
    if (expanded) {
      try {
        setNestedTableLoading(true)
        const headerArrayForNestedTable = []
        const finalArrayToPush = []
        const mergedObject = {
          ...record,
          ...parametersToSend,
        };
        const stringifiedJSON = JSON.stringify(mergedObject);
        const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
        // const newToken = JSON.parse(localStorage.getItem("authTokens"));
        const { access_token } = getOAuthHeaders();
        const headers = {
          "Content-Type": "application/json",
          Authorization: `bearer ${access_token}`,
          appId: appId
        };
        const getReportDetailsQuery = {
          query: `query {
          getReportJson(reportId:"${detailedReportId}"){data, messageCode, title, message}
          }`,
        };
  
        const getReportJsonServerResponse = await Axios.post(genericUrl, getReportDetailsQuery, { headers: headers }, { async: true }, { crossDomain: true });
        const reportJsonResponse = getReportJsonServerResponse.data.data.getReportJson;
        if (reportJsonResponse.messageCode === "201") {
          message.error(reportJsonResponse.message);
        } else {
          const reportData = JSON.parse(reportJsonResponse.data);
          const nestedFields = reportData.Fields
          const onSubmitQuery = {
            query: `query {
            executeReport(parentReportId:"${mainReportId}",reportId:"${detailedReportId}", reportParam:"${jsonToSend}"){data, messageCode, title, message}
            }`,
          };
          const serverResponse = await Axios.post(genericUrl, onSubmitQuery, { headers: headers }, { async: true }, { crossDomain: true });
          const reportResponse = serverResponse.data.data.executeReport;
          if (reportResponse.messageCode === "200") {
            const responseForGridData = reportResponse.data;
            const gridData = JSON.parse(responseForGridData);
            const reportsGridArray = [];
            let dataArray;
            if (gridData.length > 0) {
              for (let index = 0; index < gridData.length; index += 1) {
                if (typeof gridData[index] === "string") {
                  dataArray = JSON.parse(gridData[index]);
                  reportsGridArray.push(dataArray);
                } else {
                  dataArray = gridData[index];
                  reportsGridArray.push(dataArray);
                }
              }
              for (let index = 0; index < reportsGridArray.length; index++) {
                const gridData = reportsGridArray[index];
                for (let indexF = 0; indexF < nestedFields.length; indexF++) {
                  const fieldData = nestedFields[indexF];
                  if(fieldData.type==="String"){
                    const fieldName = fieldData.fieldName
                    gridData[fieldName]= gridData[fieldName]===null || gridData[fieldName]===undefined ? '' : (gridData[fieldName]).toString()
                  }
                  if(fieldData.type==="List"){
                    const fieldName = fieldData.fieldName
                    const valuesArr = fieldData.Values
                    for (let indexV = 0; indexV < valuesArr.length; indexV++) {
                      const valueElement = valuesArr[indexV];    
                      if(valueElement.key===gridData[fieldName]) {
                        gridData[fieldName]=valueElement.value
                      }       
                    }
                  }
                  if(fieldData.type==="Yes/No"){
                    const fieldName = fieldData.fieldName
                    if(gridData[fieldName]==="N"){
                      gridData[fieldName]="No"
                    }else{
                      gridData[fieldName]="Yes"
                    }
                  }
                  if(fieldData.type==="WYSIWYG Editor"){
                    const fieldName = fieldData.fieldName
                    gridData[fieldName] = <div dangerouslySetInnerHTML={{ __html: gridData[fieldName] }}></div>
                  }
                }
              }
              const keysArray = Object.keys(reportsGridArray[0]);         
            for (let i = 0; i < keysArray.length; i += 1) {
              for (let index = 0; index < nestedFields.length; index += 1) {             
                if (keysArray[i] === nestedFields[index].fieldName) {
                  finalArrayToPush.push(nestedFields[index]);                  
                  // summaryFieldsArr.push(nestedFields[index].fieldName);                  
                  break;
                }              
              }
            }
            for (let index = 0; index < finalArrayToPush.length; index+=1) {
              const element = finalArrayToPush[index];  
              /* for (let index = 0; index < nestedFields.length; index++) {
                const element = nestedFields[index];
              } */
              // summaryFieldsForDrillDown.push(element.fieldName)
              headerArrayForNestedTable.push({
                title: <div className="dragHandler" style={{textAlign:finalArrayToPush[index].type==="Numeric"?"right":"left"}}>{element.displayName}</div>,
                dataIndex: element.fieldName,
                type: element.type,
                // key: index,
                render: (text) => <div style={{textAlign:finalArrayToPush[index].type==="Numeric"?"right":"left"}}>{finalArrayToPush[index].type==="Numeric"?text===undefined || text===null ?'':text.toLocaleString('en-US'):text}</div>,
                /* onCell: (record) => ({
                  onClick: () => {
                    drillDown(jsonToSend,finalArrayToPush[index].fieldName,record[finalArrayToPush[index].fieldName],finalArrayToPush[index].detailReportId)
                  },
                }), */
                width: finalArrayToPush[index].gridlength===undefined || finalArrayToPush[index].gridlength===null ? 100 : parseInt(finalArrayToPush[index].gridlength),
                ellipsis: true,
              })          
            }
            setHeaderForNestedTable(headerArrayForNestedTable)
            setGridDataForNestedTable(reportsGridArray)
            setNestedTableLoading(false)
            /* setDrillDownTitle(record)
            setPopupForDrillDown(true) */
            }else{
              message.error("No data present")
              setNestedTableLoading(false);
            }
          }else if(reportResponse.title==="Error"){
            message.error(reportResponse.message)
            setNestedTableLoading(false);
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
    }else{
      setNestedKeys([]);
    }
  };
  
  const expandedRowRender = (record) => {
    return (
      <Spin
        indicator={<LoadingOutlined spin />}
        spinning={nestedTableLoading}
      >
        <Table
          // className="components-table-demo-nested"
          style={Themes.contentWindow.listWindowTable}
          columns={headerDataForNestedTable}
          dataSource={gridDataForNestedTable}
          pagination={false}
          size="small"
          scroll={{x:'100%'}}
          summary={(pageData) => {
            let totalArr = [];
            let finalArr = [];
            let summaryFields = [];
            for (let index = 0; index < headerDataForNestedTable.length; index++) {
              summaryFields.push(headerDataForNestedTable[index].dataIndex);
            };
            for (let index = 0; index < summaryFields.length; index++) {
              totalArr[index] = 0;
            }
            
            for (let index = 0; index < pageData.length; index++) {
              const element = pageData[index];
              for (let index1 = 0; index1 < summaryFields.length; index1++) {
                totalArr[index1] += element[summaryFields[index1]];
              }
            }
            for (let index = 0; index < totalArr.length; index++) {
              const element = totalArr[index];
              
              if (typeof element === "string") {
                finalArr.push(" ");
              } else {
                finalArr.push((element.toFixed(roundOffDecimalValue)).toLocaleString('en-US'));
              }
            }
            for (let index = 1; index < finalArr.length; index++) {
              const element = finalArr[index];
              if(element!==" "){
                finalArr.splice(index-1, 1, "Total");
                break;
              }
            }
  
            return (
              <Table.Summary fixed>
                <Table.Summary.Row style={{ backgroundColor: "#FFFFFF" /* "#D0DFFC" */ }}>
                  {summaryFields.map((data, indexNum) => {
                    return (
                      <Table.Summary.Cell>
                        <Text style={{ float: "right", fontWeight: "600" }}>{finalArr[indexNum]==="Total" ? finalArr[indexNum] : isNaN(parseFloat(finalArr[indexNum]))===true?'':parseFloat(finalArr[indexNum]).toLocaleString('en-US') }</Text>
                      </Table.Summary.Cell>
                    );
                  })}
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
          /* expandedRowKeys={[nestedExpandedRow]}
          expandedRowRender={
            chartJSONInState !== undefined && chartJSONInState.enablenestedtable === 'Y' ? record => expandNestedDrillDown(record, chartJSONInState) : ''
          }
          onExpand={(record, expanded) => onExpandNestedTable(record, expanded, chartJSONInState)} */
        />
      </Spin>
    )
  }


  return (
    <div>
      <ReactDragListView.DragColumn {...dragProps}>
      <Table
        style={{paddingTop:"0px"}}
        className="ant-table-container-custom"
        size="small"
        sticky={true}
        scroll={{ y:reportFiltersForNextRowLength===0?defaultScrollLength:scrollLength, x: "100%" }}
        
        columns={finalColumns}
        dataSource={gridData}
        components={components}
        pagination={false}
        onChange={handleChange}
        // expandedRowRender={expandedRowRender}
        expandedRowRender={nestedTableFlag === 'Y'? expandedRowRender: ''}
        // onExpand={handleExpandd}
        onExpand={handleExpand}
        expandedRowKeys={nestedKeys}
        summary={(pageData) => {
          let totalArr = [];
          let finalArr = [];
          let summaryFields = [];
          for (let index = 0; index < finalColumns.length; index++) {
            summaryFields.push(finalColumns[index].dataIndex);
          };

          if(nestedTableFlag === "Y"){
            summaryFields.splice(0, 0, " ")
          }
          for (let index = 0; index < summaryFields.length; index++) {
            totalArr[index] = 0;
          }
          
          for (let index = 0; index < pageData.length; index++) {
            const element = pageData[index];
            for (let index1 = 0; index1 < summaryFields.length; index1++) {
              totalArr[index1] += element[summaryFields[index1]];
            }
          }
          
          for (let index = 0; index < totalArr.length; index++) {
            const element = totalArr[index];
            
            if (typeof element === "string") {
              finalArr.push(" ");
            } else {
              finalArr.push((element.toFixed(roundOffDecimalValue)).toLocaleString('en-US'));
            }
          }
          let indexNumber = 1
          
          for (indexNumber = 1; indexNumber < finalArr.length ; indexNumber++) {
            const element = finalArr[indexNumber];
            if(element!==" "){
              finalArr.splice(indexNumber-1, 1, "Total");
              break;
            }
          }
          

          return (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ backgroundColor: "#FFFFFF" /* "#D0DFFC" */ }}>
                
                {summaryFields.map((data, indexNum) => {
                  return (
                    <>
                    {/* {nestedTableFlag==="Y"?<Table.Summary.Cell />:''} */}
                    <Table.Summary.Cell>
                    <Text style={{ float: "right", fontWeight: "700",fontFamily:"Inter" ,color:"#425B6D", borderLeft: "1px solid #ccc", paddingLeft: "0.5rem" }}>{finalArr[indexNum]==="Total" ? finalArr[indexNum]  : isNaN(parseFloat(finalArr[indexNum]))===true?'':parseFloat(finalArr[indexNum]).toLocaleString('en-US') }</Text>
                    </Table.Summary.Cell>
                    </>
                  );
                })}
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
      </ReactDragListView.DragColumn>
    </div>
  );
};

export default TableForReport;