import React, { useState, useEffect } from "react";
import { Table, DatePicker, Input, Space, Button, Typography,message,Spin,Tooltip } from "antd";
import { Resizable } from "react-resizable";
import { LoadingOutlined } from "@ant-design/icons";
import ReactDragListView from "react-drag-listview";
import Axios from "axios";
// import { genericUrl } from "../../../constants/serverConfig";
import "../../../styles/app.css";
import { getOAuthHeaders } from "../../../constants/oAuthValidation";
const { Text } = Typography;

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

const TableForChart = (props) => {
  const { dataSource, columnsData, tableKpi,fullScreenValue,dashboardParamsAndKpiData } = props;
  const [columns, setColumns] = useState([]);
  const [nestedKeys, setNestedKeys] = useState([]);
  const [nestedTableColumns, setNestedTableColumns] = useState([]);
  const [nestedTableData, setNestedTableData] = useState([]);
  const [nestedTableLoading, setNestedTableLoading] = useState([]);
  const genericUrl = process.env.REACT_APP_genericUrl;
  let appId = localStorage.getItem("appId");
  const userPreferences = JSON.parse(localStorage.getItem("userPreferences"));
  const roundOffDecimalValue = userPreferences.decimalPlaces;
  for (let index = 0; index < columnsData.length; index++) {
    const element = columnsData[index]
    /* element['render'] = (record) => {
      return(
        <div style={{float:typeof(record)==="number"?"right":"left"}}>{record}</div>
      )
    } */
    
    if (element.trim === 'Y') {
      let titleName = element.title
      element['render'] = (titleName) => {
        return(
        <Tooltip placement="topLeft" title={titleName}>
          {titleName}
        </Tooltip>
        )
      }
    }
  }
  if(dataSource!==undefined){
    for (let index = 0; index < dataSource.length; index++) {
      const element = dataSource[index]
      element['key'] = `${index}${tableKpi.kpi_id}`         
    }
  }
  

  if (dataSource !== undefined && tableKpi!==undefined) {
    if (tableKpi.numeric_field !== undefined && tableKpi.numeric_field !== null) {
      const numericField = tableKpi.numeric_field;
      const numericArr = numericField.split(",");
      for (let index = 0; index < dataSource.length; index++) {
        const element = dataSource[index];
        for (let index2 = 0; index2 < numericArr.length; index2++) {
          const element2 = numericArr[index2];
          element[element2] = parseFloat(element[element2]);
        }
      }
    }    
  }


  useEffect(() => {
    let data = [...columnsData];
    const handleReset = (clearFilters) => {
      clearFilters();
    };
    const getColumnSearchProps = (type) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          {type === "Date" ? (
            <DatePicker onChange={(date, dateString) => setSelectedKeys(dateString ? [dateString] : [])} style={{ marginBottom: 8, display: "block" }} />
          ) : (
            <Input
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
              }}
              style={{ marginBottom: 8, display: "block" }}
            />
          )}
          <Space>
            <Button onClick={() => handleReset(clearFilters)} size="small">
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
      ),
    });
    for (let index = 0; index < data.length; index++) {
      Object.assign(
        data[index],
        getColumnSearchProps(data[index].type),
        { filteredValue: null },
        {
          onFilter: (value, record) => (record[data[index].dataIndex] ? record[data[index].dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : ""),
        }
      );
    }
    setColumns(columnsData);
  }, [columnsData]);

  const handleChange = (pagination, filters) => {
    let data = [...columns];
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
      cell: ResizableCell,
    },
  };

  const finalColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (columns) => ({
      width: columns.width,
      onResize: handleResize(index),
    }),
  }));
  const handleResize = (index) => (e, { size }) => {
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
    onDragEnd(fromIndex, toIndex) {
      const resizeColumns = [...columns];
      const item = resizeColumns.splice(fromIndex, 1)[0];
      resizeColumns.splice(toIndex, 0, item);
      setColumns(resizeColumns);
    },
    nodeSelector: "th",
    handleSelector: ".dragHandler",
    ignoreSelector: "react-resizable-handle",
  };

  const onExpandRow = (expanded,record) => {
    setNestedKeys([record.key]);

    if (expanded) {
      try {
      setNestedTableLoading(true)
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const { access_token } = getOAuthHeaders();
      const paramsJson = dashboardParamsAndKpiData.dashboardParams;
      const kpiData = dashboardParamsAndKpiData.kpiData;
      const drillDownFilter = tableKpi.drilldown_inputfilters
      paramsJson[drillDownFilter] = record[drillDownFilter]  
      const stringifiedJSON = JSON.stringify(paramsJson)
      const jsonToSend = stringifiedJSON.replace(/"/g, '\\"')
      const drillDownMutation = {
        query: `query {
        executeDashboard(dashboardId:"${tableKpi.nt_dashboard_id}", 
        kpiId:"${tableKpi.drilldown_kpi_id}", 
        dashboardParam:"${jsonToSend}")
        {data, messageCode, title, message}
      }`,
      }
      Axios({
        url: genericUrl,
        method: 'POST',
        async: true,
        crossDomain: true,
        data: drillDownMutation,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${access_token}`,
          appId: appId
        },
      }).then(response => {
        const responseFromServer = response.data.data.executeDashboard
          if (responseFromServer.title === 'Success') {
            const successResponse = JSON.parse(responseFromServer.data)
            const tableData = successResponse[tableKpi.drilldown_kpi_id]
            let chartJSON = {}
            for (let chartIndex = 0; chartIndex < kpiData.length; chartIndex += 1) {
              const element = kpiData[chartIndex]
              if (tableKpi.drilldown_kpi_id === element.kpi_id) {
                chartJSON = element
              }
            }
            const chartProperties = JSON.parse(chartJSON.properties)
            for (let index = 0; index < tableData.length; index++) {
              const element = tableData[index]
              element['key'] = `${index}${chartJSON.kpi_id}`         
            }
            setNestedTableData(tableData)
            setNestedTableColumns(chartProperties.columnsData)
            setNestedTableLoading(false)
          } else {
            message.error(responseFromServer.message)
            setNestedTableLoading(false)
          }
      })
      } catch (error) {
      }
    }else{
      setNestedKeys([]);
    }
  }


  const expandedRowRender=(record)=>{
    return (
      <Spin
        indicator={<LoadingOutlined spin />}
        spinning={nestedTableLoading}
      >
        <Table
          columns={nestedTableColumns}
          dataSource={nestedTableData}
          pagination={false}
          size="small"
        />
      </Spin>
    )
  }


  return (
    <div style={{marginTop:"6px"}}>
      <ReactDragListView.DragColumn {...dragProps}>
        <Table
          sticky={true}
          pagination={false}
          dataSource={dataSource}
          columns={finalColumns}
          components={components}
          onChange={handleChange}
          style={{height:'auto'}}
          expandedRowRender={tableKpi.enablenestedtable === 'Y'? record => expandedRowRender(record, tableKpi): ''}
          onExpand={onExpandRow}
          expandedRowKeys={nestedKeys}          
          
          size="small"
          scroll={{ y: fullScreenValue!==true?"28vh":"48vh" }}
          summary={(pageData) => {
            let totalArr = [];
            let finalArr = [];
            let summaryFields = [];
            for (let index = 0; index < finalColumns.length; index++) {
              summaryFields.push(finalColumns[index].dataIndex);
            }
            if(tableKpi.enablenestedtable === "Y"){
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
                finalArr.push(element.toFixed(roundOffDecimalValue));
              }
            }
            finalArr.splice(0, 1,"Total");
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  {summaryFields.map((data, indexNum) => {
                    return (
                      <Table.Summary.Cell>
                        <Text style={{ float:"right",fontWeight: "600" }}>{finalArr[indexNum]==="Total" ? finalArr[indexNum]:isNaN(parseFloat(finalArr[indexNum]))===true?' ':parseFloat(finalArr[indexNum]).toLocaleString('en-US')}</Text>
                      </Table.Summary.Cell>
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

export default TableForChart;