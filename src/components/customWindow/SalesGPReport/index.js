import { Menu, Card, Select, Row, Col, Button, Spin, Popover, Tabs, DatePicker, Checkbox, message, Modal, Input, Tooltip, Dropdown } from "antd";
import React, { useEffect, useState } from "react"; 
import { Scrollbars } from "react-custom-scrollbars";
import { LoadingOutlined, DownloadOutlined } from '@ant-design/icons';
import Axios from 'axios';
import { Table } from  'react-bootstrap';
import '../PivotSample/pivotsample.css';
import AddFilter from "../../../assets/images/addFilter.svg";
import Minimise from "../../../assets/images/pivotMinimise.svg";
import RunButton from "../../../assets/images/runButton.svg";
import MeasureClose from "../../../assets/images/msrClose.svg";
import Open from "../../../assets/images/open.svg";
import SaveIcon from "../../../assets/images/save.svg";
import Charts from "../../../assets/images/charts.svg";
import Customise from "../../../assets/images/customise.svg";
import MeasureIcon from "../../../assets/images/measures.svg";
import DimensionIcon from "../../../assets/images/dimension.svg";
import Maximise from "../../../assets/images/pivotMaximise.svg";
import "antd/dist/antd.css";
import "../../../styles/antd.css";
import AdaptiveFormat from "../../../lib/adaptiveFormating";
import ReactHTMLTableToExcel from '../PivotSample/download';
import { useGlobalContext } from "../../../lib/storage";
import { getViews, upsertViews } from "../../../services/generic";
import moment from 'moment';
import useDebounce from "../../../lib/hooks/useDebounce";

const { SubMenu } = Menu;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

const SalesGPReport = () => {
    const { globalStore } = useGlobalContext();

    // const [mainData, setMainData] = useState([]);
    // const [mainDataLoading, setMainDataLoading] = useState(false);
    const [dimensionsValue, setDimensionsValue] = useState('');
    const [rowValue, setRowValue] = useState([]);
    const [columnValue, setColumnValue] = useState([]);
    const [measuresValue, setMeasuresValue] = useState([]);

    const [columnForFilters, setColumnForFilters] = useState('');
    const [operator, setOperator] = useState('in');
    const [valueForFilters, setValueForFilters] = useState([]);
    const [valueDropdown, setValueDropdown] = useState([]);
    const [valueItem, setValueItem] = useState('');
    const [filters, setFilters] = useState([]);
    const [finalFilters, setFinalFilters] = useState([]);
    const [filterLoading, setFilterLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    const [data, setData] = useState([]);
    const [limit, setLimit] = useState('20000');
    const [flag, setFlag] = useState(false);
    const [tableColumnData, setTableColumnData] = useState([]);
    const [sumForTable, setSumForTable] = useState([]);
    const [bodyData, setBodyData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);

    const [isMeasure, setIsMeasure] = useState(true);
    const [isMinimise, setMinimise] = useState(true);
    const [isDimension, setDimensions] = useState(true);
    const [isVerticalMeasure, setVerticalMeasure] = useState(false);
    const [isCustomise, setCustomise] = useState(false);

    const [checkbox, setCheckBox] = useState(false);
    const [currentFromDate, setCurrentFromDate] = useState('');
    const [currentToDate, setCurrentToDate] = useState('');
    const [previousFromDate, setPreviousFromDate] = useState('');
    const [previousToDate, setPreviousToDate] = useState('');
    const [compareFlag, setCompareFlag] = useState(false);
    const [currentDateValue, setCurrentDateValue] = useState();
    const [previousDateValue, setPreviousDateValue] = useState();

    const [visibleViewModal, setVisibleViewModal] = useState(false);
    const [viewName, setViewName] = useState('');
    const [openVisible, setOpenVisible] = useState(false);
    const [openData, setOpenData] = useState([]);
    const [viewFlag, setViewFlag] = useState(false);
    const [openFlag, setOpenFlag] = useState('');

    const [formatValue, setFormatValue] = useState('NumberFormat');

    const [filename, setFilename] = useState('');
    const [fileFlag, setFileFlag] = useState(false);

    const [colorArray, setColorArray] = useState([]);
    const [searchKey, setSearchKey] = useState();
    const debouncedSearchKey = useDebounce(searchKey, 350);

    useEffect(async () => {
      let isMounted = true;
      const response = await getViews("7412");
      if (response) {
        if (isMounted) {
          const data = response;
          setOpenData(data);
        };
      };
      return () => {
        isMounted = false;
      };
    }, [viewFlag]);

    // const getDimensionData = () => {
    //   setMainDataLoading(true);
    //   Axios({
    //     url: 'https://node-analytics-test.cw.solutions:8081/getDataSources',
    //     method: 'POST',
    //     crossDomain: true
    //   }).then(response => {
    //     const data = response.data;
    //     setMainData(data);
    //     setMainDataLoading(false);
    //   }, error => {
    //     message.error(error.message);
    //   })
    // };

    useEffect(() => {
        let isMounted = true;
        if (data.length > 0) {

        } else {
          setLoad(true);
          setDimensionsValue("salesdetail");
          setRowValue([]);
          setColumnValue([]);
          setMeasuresValue([]);
          setLimit('20000');
          setFlag(false);
          setTableColumnData([]);
          setBodyData([]);
          setFilters([]);
          setColumnForFilters('');
          setOperator('in');
          setValueForFilters([]);
          setValueItem('');
          setValueDropdown([]);
          setFilters([]);
          setFinalFilters([]);
          setVisible(false);
          Axios({
            url: 'https://node-analytics-test.cw.solutions:8081/getSchema',
            method: 'POST',
            crossDomain: true,
            data: {
              "table": "salesdetail",
            }
          }).then(response => {
            if (isMounted) {
              const data = response.data;
              //   if (newValue === "salesdetail") {
                  data.forEach(item => {
                    if (item.COLUMN_NAME === "__time") {
                      item.SHOW_NAME = "Date";
                    } else if (item.COLUMN_NAME === "account") {
                      item.SHOW_NAME = "Account";
                    } else if (item.COLUMN_NAME === "basenetamount") {
                      item.SHOW_NAME = "Amount";
                    } else if (item.COLUMN_NAME === "brand") {
                      item.SHOW_NAME = "Brand";
                    } else if (item.COLUMN_NAME === "currency") {
                      item.SHOW_NAME = "Currency";
                    } else if (item.COLUMN_NAME === "customer") {
                      item.SHOW_NAME = "Customer";
                    } else if (item.COLUMN_NAME === "customergroup") {
                      item.SHOW_NAME = "Customer Group";
                    } else if (item.COLUMN_NAME === "department") {
                      item.SHOW_NAME = "Department";
                    } else if (item.COLUMN_NAME === "division") {
                      item.SHOW_NAME = "Division";
                    } else if (item.COLUMN_NAME === "uom") {
                      item.SHOW_NAME = "UOM";
                    } else if (item.COLUMN_NAME === "organization") {
                      item.SHOW_NAME = "Organization";
                    } else if (item.COLUMN_NAME === "parentproductcategory") {
                      item.SHOW_NAME = "Main Category";
                    } else if (item.COLUMN_NAME === "invperiod") {
                      item.SHOW_NAME = "Period";
                    } else if (item.COLUMN_NAME === "itemcode") {
                      item.SHOW_NAME = "Itemcode";
                    } else if (item.COLUMN_NAME === "itemname") {
                      item.SHOW_NAME = "Itemname";
                    } else if (item.COLUMN_NAME === "product") {
                      item.SHOW_NAME = "Product";
                    } else if (item.COLUMN_NAME === "productcategory") {
                      item.SHOW_NAME = "Product Category";
                    } else if (item.COLUMN_NAME === "qty") {
                      item.SHOW_NAME = "Qty";
                    } else if (item.COLUMN_NAME === "sourcenetamount") {
                      item.SHOW_NAME = "Amount (Trx Currency)";
                    } else if (item.COLUMN_NAME === "supplier") {
                      item.SHOW_NAME = "Supplier";
                    } else if (item.COLUMN_NAME === "transactioncost") {
                      item.SHOW_NAME = "Transaction Cost";
                    };
                  });
              //   };
                setData(data);
                setLoad(false);
            };
          })
        };
        return () => {
          isMounted = false;
        };
    }, []);

    // const handleDimensions = (newValue) => {
    //   setLoad(true);
    //   setDimensionsValue(newValue);
    //   setRowValue([]);
    //   setColumnValue([]);
    //   setMeasuresValue([]);
    //   setLimit('20000');
    //   setFlag(false);
    //   setTableColumnData([]);
    //   setBodyData([]);
    //   setFilters([]);
    //   setColumnForFilters('');
    //   setOperator('in');
    //   setValueForFilters([]);
    //   setValueItem('');
    //   setValueDropdown([]);
    //   setFilters([]);
    //   setFinalFilters([]);
    //   setVisible(false);
    //   Axios({
    //     url: 'https://node-analytics-test.cw.solutions:8081/getSchema',
    //     method: 'POST',
    //     crossDomain: true,
    //     data: {
    //       "table": newValue,
    //     }
    //   }).then(response => {
    //     const data = response.data;
    //     if (newValue === "salesdetail") {
    //       data.forEach(item => {
    //         if (item.COLUMN_NAME === "__time") {
    //           item.SHOW_NAME = "Date";
    //         } else if (item.COLUMN_NAME === "account") {
    //           item.SHOW_NAME = "Account";
    //         } else if (item.COLUMN_NAME === "basenetamount") {
    //           item.SHOW_NAME = "Amount";
    //         } else if (item.COLUMN_NAME === "brand") {
    //           item.SHOW_NAME = "Brand";
    //         } else if (item.COLUMN_NAME === "currency") {
    //           item.SHOW_NAME = "Currency";
    //         } else if (item.COLUMN_NAME === "customer") {
    //           item.SHOW_NAME = "Customer";
    //         } else if (item.COLUMN_NAME === "customergroup") {
    //           item.SHOW_NAME = "Customer Group";
    //         } else if (item.COLUMN_NAME === "department") {
    //           item.SHOW_NAME = "Department";
    //         } else if (item.COLUMN_NAME === "division") {
    //           item.SHOW_NAME = "Division";
    //         } else if (item.COLUMN_NAME === "organization") {
    //           item.SHOW_NAME = "Organization";
    //         } else if (item.COLUMN_NAME === "invperiod") {
    //           item.SHOW_NAME = "Period";
    //         } else if (item.COLUMN_NAME === "product") {
    //           item.SHOW_NAME = "Product";
    //         } else if (item.COLUMN_NAME === "productcategory") {
    //           item.SHOW_NAME = "Product Category";
    //         } else if (item.COLUMN_NAME === "qty") {
    //           item.SHOW_NAME = "Qty";
    //         } else if (item.COLUMN_NAME === "sourcenetamount") {
    //           item.SHOW_NAME = "Amount (Trx Currency)";
    //         } else if (item.COLUMN_NAME === "supplier") {
    //           item.SHOW_NAME = "Supplier";
    //         } else if (item.COLUMN_NAME === "transactioncost") {
    //           item.SHOW_NAME = "Transaction Cost";
    //         };
    //       });
    //     };
    //     setData(data);
    //     setLoad(false);
    //   })
    // };

    const handleSearchFilters = (value) => {
      setSearchKey(value);
    };

    useEffect(() => {
      if (columnForFilters !== '') {
        setFilterLoading(true);
        Axios({
          url: 'https://node-analytics-test.cw.solutions:8081/getFilterParams',
          method: 'POST',
          crossDomain: true,
          data: {
            "table": dimensionsValue,
            "column": columnForFilters,
            "search": debouncedSearchKey,
            "limit": 500,
            "database": "druid"
          }
        }).then((response) => {
          const data = response.data;
          setValueItem(Object.keys(data[0])[0]);
          setValueDropdown(data);
          setFilterLoading(false);
        })
      };
    }, [debouncedSearchKey]);

    const getValueForFilters = () => {
      if (valueDropdown.length > 0) {

      } else if (columnForFilters !== '') {
        setFilterLoading(true);
        Axios({
          url: 'https://node-analytics-test.cw.solutions:8081/getFilterParams',
          method: 'POST',
          crossDomain: true,
          data: {
            "table": dimensionsValue,
            "column": columnForFilters,
            "search": "",
            "limit": 500
          }
        }).then((response) => {
          const data = response.data;
          setValueItem(Object.keys(data[0])[0]);
          setValueDropdown(data);
          setFilterLoading(false);
        })
      };
    };

    const onClose = () => {
      setVisible(false);
    };

    const saveFilers = () => {
      setFlag(false);
      let obj = {}
      obj["column"] = columnForFilters;
      obj["operator"] = operator;
      obj["value"] = valueForFilters;
      let finalFilterArr = [];
      finalFilterArr.push(obj);
      let arr = [...finalFilters];
      let newArrayForFinalFilters = arr.concat(finalFilterArr);
      setFinalFilters(newArrayForFinalFilters);
      let filterArr = [...filters];

      let newArrayForFilters = filterArr.concat([`${
        dimensionsValue === "salesdetail" ?
        (columnForFilters === "__time" ? "Date" :
        columnForFilters === "account" ? "Account" :
        columnForFilters === "basenetamount" ? "Amount" :
        columnForFilters === "brand" ? "Brand" :
        columnForFilters === "currency" ? "Currency" :
        columnForFilters === "customer" ? "Customer" :
        columnForFilters === "customergroup" ? "Customer Group" :
        columnForFilters === "department" ? "Department" :
        columnForFilters === "division" ? "Division" :
        columnForFilters === "uom" ? "UOM" :
        columnForFilters === "organization" ? "Organization" :
        columnForFilters === "parentproductcategory" ? "Main Category" :
        columnForFilters === "invperiod" ? "Period" :
        columnForFilters === "itemcode" ? "Itemcode" :
        columnForFilters === "itemname" ? "Itemname" :
        columnForFilters === "product" ? "Product" :
        columnForFilters === "productcategory" ? "Product Category" :
        columnForFilters === "qty" ? "Qty" :
        columnForFilters === "sourcenetamount" ? "Amount (Trx Currency)" :
        columnForFilters === "supplier" ? "Supplier" :
        columnForFilters === "transactioncost" ? "Transaction Cost" :
        "") : columnForFilters
      } ${operator} ${valueForFilters}`])
      setFilters(newArrayForFilters);
      setColumnForFilters('');
      setOperator('in');
      setValueForFilters([]);
      setValueItem('');
      setValueDropdown([]);
      setVisible(false);
    };

    const content = (
      <>
          <Button style={{width: "150px", height: "32px" }} onClick={onClose}>
            Close
          </Button>
          <Button style={{backgroundColor: "rgb(8 158 164)", color: "white", width: "150px", height: "32px", float: "right" }} onClick={saveFilers}>
            Save
          </Button>
          <br />
          <br />
          <Select
            showSearch
            placeholder={'column'}
            style={{ width: 300 }}
            value={columnForFilters}
            onChange={(newValue) => {
              setColumnForFilters(newValue);
              setValueDropdown([]);
              setValueForFilters([]);
              setValueItem('');
            }}
          >
            {data.map((item) => {
              if (
                item.DATA_TYPE !== "DECIMAL" &&
                item.DATA_TYPE !== "FLOAT" &&
                item.DATA_TYPE !== "REAL" &&
                item.DATA_TYPE !== "DOUBLE" &&
                item.DATA_TYPE !== "BOOLEAN" &&
                item.DATA_TYPE !== "TINYINT" &&
                item.DATA_TYPE !== "SMALLINT" &&
                item.DATA_TYPE !== "BIGINT" &&
                item.DATA_TYPE !== "INTEGER"
              ) {
                return (
                  <Option key={item.COLUMN_NAME}>{dimensionsValue === "salesdetail" ? item.SHOW_NAME : item.COLUMN_NAME}</Option>
                )
              }
            })}
          </Select>
          <br/>
          <Select
            showSearch
            placeholder={'operator'}
            style={{ width: 300 }}
            value={operator}
            onChange={(newValue) => setOperator(newValue)}
          >
            <Option key={"in"}>in</Option>
            <Option key={"notIn"}>Not in</Option>
          </Select>
          <br/>
          <Spin spinning={filterLoading}>
          <Select
            allowClear
            mode="multiple"
            placeholder={'value'}
            style={{ width: 300 }}
            maxTagCount='responsive'
            value={valueForFilters}
            onClick={getValueForFilters}
            onSearch={handleSearchFilters}
            filterOption={false}
            onChange={(newValue) => setValueForFilters(newValue)}
          >
            {valueDropdown.map((item) => {
              return (
                <Option key={item[valueItem]}>{item[valueItem]}</Option>
              )
            })}
          </Select>
          </Spin>
    </>
    );

    const drag = (ev) => {
        ev.dataTransfer.setData("text", ev.target.innerText);
    };

    const allowDrop = (ev) => {
        ev.preventDefault();
    };

    const dropRow = (ev) => {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("text");
        let arr = [...rowValue];
        if (arr.includes(data)) {

        } else {
            arr.push(
              dimensionsValue === "salesdetail" ?
              (data === "Date" ? "__time" :
              data === "Account" ? "account" :
              data === "Amount" ? "basenetamount" :
              data === "Brand" ? "brand" :
              data === "Currency" ? "currency" :
              data === "Customer" ? "customer" :
              data === "Customer Group" ? "customergroup" :
              data === "Department" ? "department" :
              data === "Division" ? "division" :
              data === "UOM" ? "uom" :
              data === "Organization" ? "organization" :
              data === "Main Category" ? "parentproductcategory" :
              data === "Period" ? "invperiod" :
              data === "Itemcode" ? "itemcode" :
              data === "Itemname" ? "itemname" :
              data === "Product" ? "product" :
              data === "Product Category" ? "productcategory" :
              data === "Qty" ? "qty" :
              data === "Amount (Trx Currency)" ? "sourcenetamount" :
              data === "Supplier" ? "supplier" :
              data === "Transaction Cost" ? "transactioncost" :
              "") : data
            );
            setRowValue(arr);
            setFlag(false);
            setTableColumnData([]);
            setBodyData([]);
        };
    };

    const dropColumn = (ev) => {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("text");
        let arr = [...columnValue];
        if (arr.includes(data)) {

        } else {
            arr.push(
              dimensionsValue === "salesdetail" ?
              (data === "Date" ? "__time" :
              data === "Account" ? "account" :
              data === "Amount" ? "basenetamount" :
              data === "Brand" ? "brand" :
              data === "Currency" ? "currency" :
              data === "Customer" ? "customer" :
              data === "Customer Group" ? "customergroup" :
              data === "Department" ? "department" :
              data === "Division" ? "division" :
              data === "UOM" ? "uom" :
              data === "Organization" ? "organization" :
              data === "Main Category" ? "parentproductcategory" :
              data === "Period" ? "invperiod" :
              data === "Itemcode" ? "itemcode" :
              data === "Itemname" ? "itemname" :
              data === "Product" ? "product" :
              data === "Product Category" ? "productcategory" :
              data === "Qty" ? "qty" :
              data === "Amount (Trx Currency)" ? "sourcenetamount" :
              data === "Supplier" ? "supplier" :
              data === "Transaction Cost" ? "transactioncost" :
              "") : data
            );
            setColumnValue(arr);
            setFlag(false);
            setTableColumnData([]);
            setBodyData([]);
        };
    };

    const handleChange = (value) => {
        setLimit(value);
        setFlag(false);
        setTableColumnData([]);
        setBodyData([]);
    };

    const handleVisibleChange = (visible) => {
      setVisible(visible);
    };

    const currentChanges = (dates, dateStrings) => {
      setFlag(false);
      setCurrentFromDate(dateStrings[0]);
      setCurrentToDate(dateStrings[1]);
      setCurrentDateValue(dates);
    };

    const checkboxChange = (e) => {
      setCheckBox(e.target.checked);
      setFlag(false);
    };

    const previousChanges = (dates, dateStrings) => {
      setFlag(false);
      setPreviousFromDate(dateStrings[0]);
      setPreviousToDate(dateStrings[1]);
      setPreviousDateValue(dates);
    };

    const handleDownloadCsv = () => {
      if (rowValue.length > 0 || columnValue.length > 0) {
        setFlag(true);
        setLoading(true);
        let arr = [];
        let comparableFlag = "Y";
        arr.push(
          currentFromDate,
          currentToDate,
          previousFromDate,
          previousToDate
        );
        for (let index = 0; index < arr.length; index++) {
          if (arr[index] === '' || arr[index] === null) {
            comparableFlag = "N"
          }
        };
        if (comparableFlag === "Y") {
          setCompareFlag(true);
        } else {
          setCompareFlag(false);
        };
        let metricsArray = [];
        for (let index = 0; index < measuresValue.length; index++) {
          let obj = {};
          obj["type"] = "SUM";
          obj["column"] = measuresValue[index];
          metricsArray.push(obj);
        };
        Axios({
          url: 'https://node-analytics-test.cw.solutions:8081/getComparableTable',
          method: 'POST',
          responseType: 'stream',
          crossDomain: true,
          data: {
            "table": dimensionsValue,
            "limit": "1000000",
            "resultFormat": "csv",
            "rows" : rowValue,
            "columns": columnValue,
            "metrics": metricsArray,
            "comparableDates": {
              "isComparable": checkbox === true ? (comparableFlag === "Y" ? true : false) : false,
              "currentStartDate": currentFromDate !== '' ? currentFromDate : null,
              "currentEndDate": currentToDate !== '' ? currentToDate : null,
              "previousStartDate": checkbox === true ? (previousFromDate !== '' ? previousFromDate : null) : null,
              "previousEndDate": checkbox === true ? (previousToDate !== '' ? previousToDate : null) : null
            },
            "filters": finalFilters,
            "database": "druid",
            "date_column" : "__time"
          },
        }).then(response => {
          const link = document.createElement('a');
          link.href = response.data;
          link.click();
          setFlag(false);
          setLoading(false);
        }, error => {
          setLoading(false);
          setFlag(false);
          message.error(error.message);
        })
      } else {
        message.warning("Please select atleast one Row");
        setFlag(false);
      };
    };

    const onRun = () => {
        if (rowValue.length > 0 || columnValue.length > 0) {
          setFlag(true);
          setLoading(true);
          let arr = [];
          let comparableFlag = "Y";
          arr.push(
            currentFromDate,
            currentToDate,
            previousFromDate,
            previousToDate
          );
          for (let index = 0; index < arr.length; index++) {
            if (arr[index] === '' || arr[index] === null) {
              comparableFlag = "N"
            }
          };
          if (comparableFlag === "Y") {
            setCompareFlag(true);
          } else {
            setCompareFlag(false);
          };
          let metricsArray = [];
          for (let index = 0; index < measuresValue.length; index++) {
            let obj = {};
            obj["type"] = "SUM";
            obj["column"] = measuresValue[index];
            metricsArray.push(obj);
          };
          Axios({
            url: 'https://node-analytics-test.cw.solutions:8081/getComparableTable',
            method: 'POST',
            crossDomain: true,
            data: {
              "table": dimensionsValue,
              "limit": limit,
              "resultFormat": null,
              "rows" : rowValue,
              "columns": columnValue,
              "metrics": metricsArray,
              "comparableDates": {
                "isComparable": checkbox === true ? (comparableFlag === "Y" ? true : false) : false,
                "currentStartDate": currentFromDate !== '' ? currentFromDate : null,
                "currentEndDate": currentToDate !== '' ? currentToDate : null,
                "previousStartDate": checkbox === true ? (previousFromDate !== '' ? previousFromDate : null) : null,
                "previousEndDate": checkbox === true ? (previousToDate !== '' ? previousToDate : null) : null
              },
              "filters": finalFilters,
              "database": "druid",
              "date_column" : "__time"
            }
          }).then(response => {
              const data = response.data;
              if (data.length > 0) {
                let rowData = [];
                data.map(item => {
                  let arr = [];
                  for (let index = 0; index < rowValue.length; index++) {
                    arr.push(item[dimensionsValue === "salesdetail"
                                          ? rowValue[index] === "__time"
                                            ? "Date"
                                            : rowValue[index] === "account"
                                            ? "Account"
                                            : rowValue[index] === "basenetamount"
                                            ? "Amount"
                                            : rowValue[index] === "brand"
                                            ? "Brand"
                                            : rowValue[index] === "currency"
                                            ? "Currency"
                                            : rowValue[index] === "customer"
                                            ? "Customer"
                                            : rowValue[index] === "customergroup"
                                            ? "Customer Group"
                                            : rowValue[index] === "department"
                                            ? "Department"
                                            : rowValue[index] === "division"
                                            ? "Division"
                                            : rowValue[index] === "uom"
                                            ? "UOM"
                                            : rowValue[index] === "organization"
                                            ? "Organization"
                                            : rowValue[index] === "parentproductcategory"
                                            ? "Main Category"
                                            : rowValue[index] === "itemcode"
                                            ? "Itemcode"
                                            : rowValue[index] === "itemname"
                                            ? "Itemname"
                                            : rowValue[index] === "invperiod"
                                            ? "Period"
                                            : rowValue[index] === "product"
                                            ? "Product"
                                            : rowValue[index] === "productcategory"
                                            ? "Product Category"
                                            : rowValue[index] === "qty"
                                            ? "Qty"
                                            : rowValue[index] === "sourcenetamount"
                                            ? "Amount (Trx Currency)"
                                            : rowValue[index] === "supplier"
                                            ? "Supplier"
                                            : rowValue[index] === "transactioncost"
                                            ? "Transaction Cost"
                                            : ""
                                          : rowValue[index]]);
                  };
                  rowData.push(arr);
                });
    
                let columnData = [];
                data.map(item => {
                  let arr = [];
                  for (let index = 0; index < columnValue.length; index++) {
                    arr.push(item[dimensionsValue === "salesdetail"
                                        ? columnValue[index] === "__time"
                                          ? "Date"
                                          : columnValue[index] === "account"
                                          ? "Account"
                                          : columnValue[index] === "basenetamount"
                                          ? "Amount"
                                          : columnValue[index] === "brand"
                                          ? "Brand"
                                          : columnValue[index] === "currency"
                                          ? "Currency"
                                          : columnValue[index] === "customer"
                                          ? "Customer"
                                          : columnValue[index] === "customergroup"
                                          ? "Customer Group"
                                          : columnValue[index] === "department"
                                          ? "Department"
                                          : columnValue[index] === "division"
                                          ? "Division"
                                          : columnValue[index] === "uom"
                                          ? "UOM"
                                          : columnValue[index] === "organization"
                                          ? "Organization"
                                          : columnValue[index] === "parentproductcategory"
                                          ? "Main Category"
                                          : columnValue[index] === "itemcode"
                                          ? "Itemcode"
                                          : columnValue[index] === "itemname"
                                          ? "Itemname"
                                          : columnValue[index] === "invperiod"
                                          ? "Period"
                                          : columnValue[index] === "product"
                                          ? "Product"
                                          : columnValue[index] === "productcategory"
                                          ? "Product Category"
                                          : columnValue[index] === "qty"
                                          ? "Qty"
                                          : columnValue[index] === "sourcenetamount"
                                          ? "Amount (Trx Currency)"
                                          : columnValue[index] === "supplier"
                                          ? "Supplier"
                                          : columnValue[index] === "transactioncost"
                                          ? "Transaction Cost"
                                          : ""
                                        : columnValue[index]]);
                  };
                  columnData.push(arr);
                })
    
                let hashMap1 = {};
    
                rowData.forEach((arr) => {
                  hashMap1[arr.join("|")] = arr;
                });
    
                let finalRowData = Object.keys(hashMap1).map((k) => {
                  return hashMap1[k];
                });
    
                let hashMap2 = {};
    
                columnData.forEach((arr) => {
                  hashMap2[arr.join("|")] = arr;
                });
    
                let finalColumnData = Object.keys(hashMap2).map((k) => {
                  return hashMap2[k];
                });
                
                let bodyArr = [...finalRowData];
  
                let summaryArray = [];

                finalColumnData.forEach((column, index1) => {
                  finalRowData.forEach((row, index2) => {
                    let arr = [];
                    data.forEach((item) => {
                      let key = "Y";
                      for (let index3 = 0; index3 < rowValue.length; index3++) {
                        if (item[dimensionsValue === "salesdetail"
                        ? rowValue[index3] === "__time"
                          ? "Date"
                          : rowValue[index3] === "account"
                          ? "Account"
                          : rowValue[index3] === "basenetamount"
                          ? "Amount"
                          : rowValue[index3] === "brand"
                          ? "Brand"
                          : rowValue[index3] === "currency"
                          ? "Currency"
                          : rowValue[index3] === "customer"
                          ? "Customer"
                          : rowValue[index3] === "customergroup"
                          ? "Customer Group"
                          : rowValue[index3] === "department"
                          ? "Department"
                          : rowValue[index3] === "division"
                          ? "Division"
                          : rowValue[index3] === "uom"
                          ? "UOM"
                          : rowValue[index3] === "organization"
                          ? "Organization"
                          : rowValue[index3] === "parentproductcategory"
                          ? "Main Category"
                          : rowValue[index3] === "itemcode"
                          ? "Itemcode"
                          : rowValue[index3] === "itemname"
                          ? "Itemname"
                          : rowValue[index3] === "invperiod"
                          ? "Period"
                          : rowValue[index3] === "product"
                          ? "Product"
                          : rowValue[index3] === "productcategory"
                          ? "Product Category"
                          : rowValue[index3] === "qty"
                          ? "Qty"
                          : rowValue[index3] === "sourcenetamount"
                          ? "Amount (Trx Currency)"
                          : rowValue[index3] === "supplier"
                          ? "Supplier"
                          : rowValue[index3] === "transactioncost"
                          ? "Transaction Cost"
                          : ""
                        : rowValue[index3]] === row[index3]) {
    
                        } else {
                          key = "N";
                        }
                      };
                      if (key !== "N") {
                        for (let index4 = 0; index4 < columnValue.length; index4++) {
                          if (item[dimensionsValue === "salesdetail"
                          ? columnValue[index4] === "__time"
                            ? "Date"
                            : columnValue[index4] === "account"
                            ? "Account"
                            : columnValue[index4] === "basenetamount"
                            ? "Amount"
                            : columnValue[index4] === "brand"
                            ? "Brand"
                            : columnValue[index4] === "currency"
                            ? "Currency"
                            : columnValue[index4] === "customer"
                            ? "Customer"
                            : columnValue[index4] === "customergroup"
                            ? "Customer Group"
                            : columnValue[index4] === "department"
                            ? "Department"
                            : columnValue[index4] === "division"
                            ? "Division"
                            : columnValue[index4] === "uom"
                            ? "UOM"
                            : columnValue[index4] === "organization"
                            ? "Organization"
                            : columnValue[index4] === "parentproductcategory"
                            ? "Main Category"
                            : columnValue[index4] === "itemcode"
                            ? "Itemcode"
                            : columnValue[index4] === "itemname"
                            ? "Itemname"
                            : columnValue[index4] === "invperiod"
                            ? "Period"
                            : columnValue[index4] === "product"
                            ? "Product"
                            : columnValue[index4] === "productcategory"
                            ? "Product Category"
                            : columnValue[index4] === "qty"
                            ? "Qty"
                            : columnValue[index4] === "sourcenetamount"
                            ? "Amount (Trx Currency)"
                            : columnValue[index4] === "supplier"
                            ? "Supplier"
                            : columnValue[index4] === "transactioncost"
                            ? "Transaction Cost"
                            : ""
                          : columnValue[index4]] === column[index4]) {
      
                          } else {
                            key = "N";
                          }
                        };
                      }
                      if (key === "Y") {
                        if (checkbox === false) {
                          measuresValue.forEach(value => {
                            arr.push(item[`SUM ${value = dimensionsValue === "salesdetail" ?
                            (value === "__time"
                            ? "Date"
                            : value === "account"
                            ? "Account"
                            : value === "basenetamount"
                            ? "Amount"
                            : value === "brand"
                            ? "Brand"
                            : value === "currency"
                            ? "Currency"
                            : value === "customer"
                            ? "Customer"
                            : value === "customergroup"
                            ? "Customer Group"
                            : value === "department"
                            ? "Department"
                            : value === "division"
                            ? "Division"
                            : value === "uom"
                            ? "UOM"
                            : value === "organization"
                            ? "Organization"
                            : value === "parentproductcategory"
                            ? "Main Category"
                            : value === "invperiod"
                            ? "Period"
                            : value === "itemcode"
                            ? "Itemcode"
                            : value === "itemname"
                            ? "Itemname"
                            : value === "product"
                            ? "Product"
                            : value === "productcategory"
                            ? "Product Category"
                            : value === "qty"
                            ? "Qty"
                            : value === "sourcenetamount"
                            ? "Amount (Trx Currency)"
                            : value === "supplier"
                            ? "Supplier"
                            : value === "transactioncost"
                            ? "Transaction Cost"
                            : "")
                          : value}`]);  
                          });
                        } else if (checkbox === true && comparableFlag === "Y") {
                          measuresValue.forEach(value => {
                            arr.push(item[`current_${value}`]);  
                            arr.push(item[`previous_${value}`]); 
                          });
                        }
                      }
                    });
                    if (checkbox === false) {
                      if (arr.length > 0) {
                        measuresValue.forEach((value, index) => {
                          bodyArr[index2].push(arr[index]);
                          if (summaryArray[index + (index1*measuresValue.length)] === undefined) {
                            summaryArray[index + (index1*measuresValue.length)] = arr[index];  
                          } else {
                            summaryArray[index + (index1*measuresValue.length)] = summaryArray[index + (index1*measuresValue.length)] + arr[index];
                          };
                        });
                      } else {
                        measuresValue.forEach(() => {
                          bodyArr[index2].push('');
                        });
                      }
                    } else {
                      if (arr.length > 0) {
                        measuresValue.forEach((value, index) => {
                          bodyArr[index2].push(arr[2*index + 0]);
                          bodyArr[index2].push(arr[2*index + 1]);
                          if (summaryArray[2*(index + (index1*measuresValue.length)) + 0] === undefined) {
                            summaryArray[2*(index + (index1*measuresValue.length)) + 0] = arr[2*index + 0];
                            summaryArray[2*(index + (index1*measuresValue.length)) + 1] = arr[2*index + 1];
                          } else {
                            summaryArray[2*(index + (index1*measuresValue.length)) + 0] = summaryArray[2*(index + (index1*measuresValue.length)) + 0] + arr[2*index + 0];
                            summaryArray[2*(index + (index1*measuresValue.length)) + 1] = summaryArray[2*(index + (index1*measuresValue.length)) + 1] + arr[2*index + 1];
                          };
                        });
                      } else {
                        measuresValue.forEach(() => {
                          bodyArr[index2].push('');
                          bodyArr[index2].push('');
                        });
                      }
                    }
                  });
                });
  
                rowValue.forEach((item, index) => {
                  if (rowValue.length - 1 === index) {
                    summaryArray.splice(index, 0, "Total");
                  } else {
                    summaryArray.splice(index, 0, "");
                  }
                });
                bodyArr.unshift(summaryArray);
    
                let columnsForTable = [];
                for (let index = 0; index < finalColumnData[0].length; index++) {
                  let arr = [];
                  finalColumnData.forEach((column) => {
                    arr.push(column[index]);
                  });
                  columnsForTable.push(arr);
                };
    
                let arrForSum = [];
                finalColumnData.forEach((column) => {
                  arrForSum.push(column[0]);
                });
                let finalArrForSum = [];
                finalArrForSum.push(arrForSum);

                let colorArr = [];
                rowValue.forEach(() => {
                  colorArr.push('');
                });
                finalColumnData.forEach((column, index) => {
                  if (checkbox === false) {
                    measuresValue.forEach(() => {
                      if (index%2 === 0) {
                        colorArr.push('#f3f3f3ff');
                      } else {
                        colorArr.push('');
                      }
                    })
                  } else if (checkbox === true && comparableFlag === "Y") {
                    measuresValue.forEach(() => {
                      if (index%2 === 0) {
                        colorArr.push('#f3f3f3ff');
                        colorArr.push('#f3f3f3ff');
                      } else {
                        colorArr.push('');
                        colorArr.push('');
                      }
                    })
                  }
                });

                setTableColumnData(columnsForTable);
                setSumForTable(finalArrForSum);
                setBodyData(bodyArr);
                setColorArray(colorArr);
                setLoading(false);
              } else {
                setLoading(false);
                setFlag(false);
                message.warning("Request has no data");
              }
          }, error => {
            setLoading(false);
            setFlag(false);
            message.error(error.message);
          })
        } else {
          message.warning("Please select atleast one Row or one Column");
          setFlag(false);
        };
    };

    const hideMeasures = () => {
      if (isVerticalMeasure) {
        setVerticalMeasure(false);
      } else {
        setIsMeasure(false);
      }
    };
  
    const onMinimise = () => {
      if (isMeasure) {
        setIsMeasure(false);
        setMinimise(false);
        setVerticalMeasure(true);
      } else {
        setVerticalMeasure(false);
        setMinimise(false);
      }
    };

    const onMaximise = () => {
      if (isVerticalMeasure) {
        setIsMeasure(true);
        setMinimise(true);
      } else {
        setIsMeasure(false);
        setMinimise(true);
      }
    };
  
    const hideDimensions = () => {
      setDimensions(false);
    };
  
    const showDimensions = () => {
      setDimensions(true);
      setCustomise(false);
    };

    const showMeasures = () => {
      if (!isMinimise) {
        setVerticalMeasure(true);
        setIsMeasure(false);
      } else {
        setVerticalMeasure(false);
        setIsMeasure(true);
      }
    };

    const showCustomise = () => {
      setCustomise(true);
      setDimensions(false);
    };

    const hideCustomise = () => {
      setCustomise(false);
    };

    const operations = <img style={{ marginTop: "-8px", cursor: "pointer" }} src={MeasureClose} alt="MeasureClose" onClick={hideDimensions} />;

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

    const responsiveDesignRow = {
      xxl: 24,
      xl: 24,
      lg: 24,
      xs: 24,
      sm: 24,
      md: 24,
    };
  
    const responsiveDesignColumn = {
      xxl: 19,
      xl: 19,
      lg: 19,
      xs: 19,
      sm: 19,
      md: 19,
    };

    // const responsiveDesignFilter1 = {
    //   xxl: 16,
    //   xl: 16,
    //   lg: 16,
    //   xs: 16,
    //   sm: 16,
    //   md: 16,
    // };
  
    const responsiveDesignFilter = {
      xxl: 21,
      xl: 21,
      lg: 21,
      xs: 21,
      sm: 21,
      md: 21,
    };
  
    // const responsiveSearch1 = {
    //   xxl: 22,
    //   xl: 22,
    //   lg: 22,
    //   xs: 22,
    //   sm: 22,
    //   md: 22,
    // };
  
    const responsiveSearch = {
      xxl: 8,
      xl: 8,
      lg: 8,
      xs: 8,
      sm: 8,
      md: 8,
    };
  
    const responsiveDesignFour = {
      xxl: 5,
      xl: 5,
      lg: 5,
      xs: 5,
      sm: 5,
      md: 5,
    };
    const responsiveDesignButton = {
      xxl: 2,
      xl: 2,
      lg: 2,
      xs: 2,
      sm: 2,
      md: 2,
    };
  
    const responsiveDesignAddFilter = {
      xxl: 3,
      xl: 3,
      lg: 3,
      xs: 3,
      sm: 3,
      md: 3,
    };

    const handleSaveIcon = () => {
      setVisibleViewModal(true);
    };

    const saveViewName = async () => {
      try{
        setVisibleViewModal(false);
        const userData = {...globalStore.userData};
        let pivotChanges = {
          dimensionsValue : dimensionsValue,
          limit: limit,
          rowValue: rowValue,
          columnValue: columnValue,
          checkbox: checkbox,
          compareFlag: compareFlag,
          currentFromDate: currentFromDate,
          currentToDate: currentToDate,
          previousFromDate: previousFromDate,
          previousToDate: previousToDate,
          finalFilters: finalFilters,
          data: data,
          measuresValue: measuresValue,
          operator: operator,
          filters: filters,
          formatValue: formatValue
        };
        const stringifiedFields = JSON.stringify(pivotChanges).replace(/"/g, "'");
        const response = await upsertViews(userData.user_id, userData.cs_client_id, "7412", viewName, stringifiedFields);
        if (response) {
          if (response.title === "Success") {
            message.success(response.message);
            setViewFlag(!viewFlag);
          }
        }
      } catch(error) {
        message.error("View is not saved properly");
      };
    };
  
    const handleViewName = (e) => {
      setViewName(e.target.value);
    };

    const handleOpenDropDown = (flag) => {
      setOpenVisible(flag);
    };

    useEffect(() => {
      if (openFlag !== '') {
        onRun();
      };
    }, [openFlag]);

    const handleOpenMenu = (e) => {
      if (e.key !== openFlag) {
        const data = openData.filter(item => item.id === e.key);
        const selectedData = JSON.parse(data[0].filters.replace(/'/g, '"'));
        setCheckBox(selectedData[0].checkbox);
        setColumnValue(selectedData[0].columnValue);
        setCompareFlag(selectedData[0].comparableFlag);
        setCurrentDateValue([moment(selectedData[0].currentFromDate, dateFormat), moment(selectedData[0].currentToDate, dateFormat)]);
        setCurrentFromDate(selectedData[0].currentFromDate);
        setCurrentToDate(selectedData[0].currentToDate);
        setData(selectedData[0].data);
        setDimensionsValue(selectedData[0].dimensionsValue);
        setFilters(selectedData[0].filters);
        setFinalFilters(selectedData[0].finalFilters);
        setFormatValue(selectedData[0].formatValue);
        setLimit(selectedData[0].limit);
        setMeasuresValue(selectedData[0].measuresValue);
        setOperator(selectedData[0].operator);
        setPreviousDateValue([moment(selectedData[0].previousFromDate, dateFormat), moment(selectedData[0].previousToDate, dateFormat)]);
        setPreviousFromDate(selectedData[0].previousFromDate);
        setPreviousToDate(selectedData[0].previousToDate);
        setRowValue(selectedData[0].rowValue);
        setOpenVisible(false);
        setOpenFlag(e.key);
      } else {
        message.warning("Already selected this View");
      }
    };

    const openMenu = () => {
      return (
        <Menu
          key="1"
          style={{
            overflowY: "scroll",
            maxHeight: "15rem",
          }}
          onClick={handleOpenMenu}
        >
          {openData.map((item) => {
            return (
              <Menu.Item key={item.id}>
                {item.name}
              </Menu.Item>
            );
          })}
        </Menu>
      );
    };

    const changeFormat = (value) => {
      setLoading(true);
      setTimeout(() => {
        setFormatValue(value);
      }, 1000);
    };

    useEffect(() => {
      let isMounted = true;
      if (formatValue !== '') {
        setTimeout(() => {
          if (isMounted) {
            setLoading(false);
          };
        }, 1000);
      };
      return () => {
        isMounted = false;
      };
    }, [formatValue]);

    useEffect(() => {
      const name = `Sales_GP_Report_${new Date().toLocaleDateString()}`;
      setFilename(name);
    }, [fileFlag]);

    const downloadSheet = () => {
      setFileFlag(!fileFlag);
    };

    return (
      <div style={{ margin: "-8px" }}>
        <Row style={{ backgroundColor: "white", borderBottom: "0.25px solid #f0f0f0" }}>
          <Col {...responsiveDesignColumn}>
            <Row>
              <Col {...(!isMeasure ? responsiveDesignRow : responsiveDesignColumn)}>
                <Col {...responsiveDesignRow}>
                  <Row>
                    <Col {...responsiveDesignAddFilter}>
                      <Row>
                        <p style={{ fontSize: "13px", fontWeight: 600, paddingLeft: "8px", marginBottom: "0px", paddingTop: "4px" }}>Filter</p>&nbsp;
                        <Popover content={content} trigger="click" title="Filters" visible={visible} onVisibleChange={handleVisibleChange}>
                          <img style={{ paddingTop: "3px" }} src={AddFilter} alt="AddFilter" />
                        </Popover>
                      </Row>
                    </Col>
                    <Col {...responsiveDesignFilter} style={{ paddingTop: "2.5px" }}>
                      <Select
                        // className="pivotRows"
                        allowClear
                        mode="multiple"
                        showArrow={false}
                        value={filters}
                        style={{ width: "100%", border: "0px solid gray" }}
                        className="ant-select-selector1"
                        onChange={(newValue) => {
                          setFlag(false);
                          let arr = [];
                          if (newValue.length > 0) {
                            for (let index1 = 0; index1 < newValue.length; index1++) {
                              let value = dimensionsValue === "salesdetail" ? newValue[index1].substring(newValue[index1].indexOf("'") + 1, newValue[index1].indexOf(" in ")) : newValue[index1].substring(newValue[index1].indexOf("'") + 1, newValue[index1].indexOf(" "));
                              value = dimensionsValue === "salesdetail" ?
                                      (value === "Date" ? "__time" :
                                      value === "Account" ? "account" :
                                      value === "Amount" ? "basenetamount" :
                                      value === "Brand" ? "brand" :
                                      value === "Currency" ? "currency" :
                                      value === "Customer" ? "customer" :
                                      value === "Customer Group" ? "customergroup" :
                                      value === "Department" ? "department" :
                                      value === "UOM" ? "uom" :
                                      value === "Division" ? "division" :
                                      value === "Organization" ? "organization" :
                                      value === "Main Category" ? "parentproductcategory" :
                                      value === "Period" ? "invperiod" :
                                      value === "Itemcode" ? "itemcode" :
                                      value === "Itemname" ? "itemname" :
                                      value === "Product" ? "product" :
                                      value === "Product Category" ? "productcategory" :
                                      value === "Qty" ? "qty" :
                                      value === "Amount (Trx Currency)" ? "sourcenetamount" :
                                      value === "Supplier" ? "supplier" :
                                      value === "Transaction Cost" ? "transactioncost" :
                                      "") : value;
                              for (let index2 = 0; index2 < finalFilters.length; index2++) {
                                if (finalFilters[index2].column === value) {
                                  arr.push(finalFilters[index2]);
                                }
                              }
                            }
                            setFinalFilters(arr);
                          } else {
                            setFinalFilters([]);
                          }
                          setFilters(newValue);
                        }}
                        maxTagCount="responsive"
                      >
                        {filters.map(item => {
                          return <Option key={item}>{item}</Option>
                        })}
                      </Select>{" "}
                      {isMinimise ? (
                        <img
                          style={{ paddingTop: "3px", width: "22px", position: "absolute", zIndex: 1, top: "5px", right: "5px", cursor: "pointer" }}
                          src={Minimise}
                          alt="Minimise"
                          onClick={onMinimise}
                        />
                      ) : (
                        <img
                          style={{ paddingTop: "3px", width: "22px", position: "absolute", zIndex: 1, top: "5px", right: "5px", cursor: "pointer" }}
                          src={Maximise}
                          alt="Minimise"
                          onClick={onMaximise}
                        />
                      )}
                    </Col>
                  </Row>
                </Col>
                {isMinimise ? (
                  <div>
                    <Row>
                      <Col {...responsiveDesignAddFilter}>
                        <p style={{ fontSize: "13px", fontWeight: 600, paddingLeft: "8px", marginBottom: "0px", paddingTop: "4px" }}>Rows</p>
                      </Col>
                      <Col {...responsiveDesignFilter}>
                        <Select
                          // className="pivotRows"
                          allowClear
                          mode="multiple"
                          onDrop={dropRow}
                          onDragOver={allowDrop}
                          showArrow={false}
                          style={{ width: "100%" }}
                          value={rowValue}
                          maxTagCount="responsive"
                          onChange={(newValue) => {
                            if (rowValue.includes(newValue)) {
                            } else {
                              setRowValue(newValue);
                              setFlag(false);
                              setTableColumnData([]);
                              setBodyData([]);
                            }
                          }}
                        >
                          {data.map((item) => {
                            if (
                              item.DATA_TYPE !== "DECIMAL" &&
                              item.DATA_TYPE !== "FLOAT" &&
                              item.DATA_TYPE !== "REAL" &&
                              item.DATA_TYPE !== "DOUBLE" &&
                              item.DATA_TYPE !== "BOOLEAN" &&
                              item.DATA_TYPE !== "TINYINT" &&
                              item.DATA_TYPE !== "SMALLINT" &&
                              item.DATA_TYPE !== "BIGINT" &&
                              item.DATA_TYPE !== "INTEGER"
                            ) {
                              return <Option key={item.COLUMN_NAME}>{dimensionsValue === "salesdetail" ? item.SHOW_NAME : item.COLUMN_NAME}</Option>;
                            }
                          })}
                        </Select>
                      </Col>
                    </Row>
                    <Row>
                      <Col {...responsiveDesignAddFilter}>
                        <p style={{ fontSize: "13px", fontWeight: 600, paddingLeft: "8px", marginBottom: "0px", paddingTop: "4px" }}>Columns</p>
                      </Col>
                      <Col {...responsiveDesignFilter}>
                        <Select
                          // className="pivotRows"
                          allowClear
                          mode="multiple"
                          onDrop={dropColumn}
                          onDragOver={allowDrop}
                          showArrow={false}
                          style={{ width: "100%" }}
                          value={columnValue}
                          maxTagCount="responsive"
                          onChange={(newValue) => {
                            if (columnValue.includes(newValue)) {
                            } else {
                              setColumnValue(newValue);
                              setFlag(false);
                              setTableColumnData([]);
                              setBodyData([]);
                            }
                          }}
                        >
                          {data.map((item) => {
                            if (
                              item.DATA_TYPE !== "DECIMAL" &&
                              item.DATA_TYPE !== "FLOAT" &&
                              item.DATA_TYPE !== "REAL" &&
                              item.DATA_TYPE !== "DOUBLE" &&
                              item.DATA_TYPE !== "BOOLEAN" &&
                              item.DATA_TYPE !== "TINYINT" &&
                              item.DATA_TYPE !== "SMALLINT" &&
                              item.DATA_TYPE !== "BIGINT" &&
                              item.DATA_TYPE !== "INTEGER"
                            ) {
                              return <Option key={item.COLUMN_NAME}>{dimensionsValue === "salesdetail" ? item.SHOW_NAME : item.COLUMN_NAME}</Option>;
                            }
                          })}
                        </Select>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <div>
                    {isVerticalMeasure ? (
                      <Row style={{ paddingBottom: "8px" }}>
                        <Col {...responsiveDesignAddFilter}>
                          <p style={{ fontSize: "13px", fontWeight: 600, paddingLeft: "8px", marginBottom: "0px", paddingTop: "4px" }}>Measures</p>{" "}
                        </Col>
                        <Col {...responsiveDesignFilter}>
                          <Row>
                            <Col {...responsiveSearch} style={{ paddingRight: "2px" }}>
                              <Select
                                allowClear
                                showSearch
                                mode="multiple"
                                style={{ width: "100%", marginTop: "8px" }}
                                placeholder={"measures"}
                                value={measuresValue}
                                maxTagCount="responsive"
                                onChange={(newValue) => {
                                  setMeasuresValue(newValue);
                                  setFlag(false);
                                  setTableColumnData([]);
                                  setBodyData([]);
                                }}
                              >
                                {data.map((item) => {
                                  if (
                                    item.DATA_TYPE === "DECIMAL" ||
                                    item.DATA_TYPE === "FLOAT" ||
                                    item.DATA_TYPE === "REAL" ||
                                    item.DATA_TYPE === "DOUBLE" ||
                                    item.DATA_TYPE === "BOOLEAN" ||
                                    item.DATA_TYPE === "TINYINT" ||
                                    item.DATA_TYPE === "SMALLINT" ||
                                    item.DATA_TYPE === "BIGINT" ||
                                    item.DATA_TYPE === "INTEGER"
                                  ) {
                                    return <Option key={item.COLUMN_NAME}>{dimensionsValue === "salesdetail" ? item.SHOW_NAME : item.COLUMN_NAME}</Option>;
                                  }
                                })}
                              </Select>
                            </Col>
  
                            <Col {...responsiveSearch} style={{ paddingLeft: "2px" }}>
                              <Select
                                showSearch
                                style={{ width: "100%", marginTop: "8px" }}
                                placeholder={"limit"}
                                value={limit}
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
                                onChange={handleChange}
                              >
                                <Option value="1000">1000</Option>
                                <Option value="5000">5000</Option>
                                <Option value="10000">10000</Option>
                                <Option value="20000">20000</Option>
                                <Option value="50000">50000</Option>
                              </Select>
                            </Col>
                            <Col {...responsiveDesignButton} style={{ textAlign: "right", paddingTop: "10PX", paddingRight: "2px" }}>
                              <img style={{ marginTop: "-8px", cursor: "pointer" }} src={MeasureClose} alt="MeasureClose" onClick={hideMeasures} />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    ) : null}
                  </div>
                )}
              </Col>
              {isMeasure ? (
                <Col {...responsiveDesignFour} style={{ borderLeft: "0.25px solid #f0f0f0", borderRight: "0.25px solid #f0f0f0", padding: "8px" }}>
                  <Row>
                    <Col {...responsiveDesignFilter}>
                      <h5>Measures</h5>{" "}
                    </Col>
                    <Col {...responsiveDesignAddFilter} style={{ textAlign: "right", paddingRight: "4px" }}>
                      <img style={{ marginTop: "-8px", cursor: "pointer" }} src={MeasureClose} alt="MeasureClose" onClick={hideMeasures} />
                    </Col>
                  </Row>
                  <Select
                    allowClear
                    showSearch
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder={"measures"}
                    value={measuresValue}
                    maxTagCount="responsive"
                    onChange={(newValue) => {
                      setMeasuresValue(newValue);
                      setFlag(false);
                      setTableColumnData([]);
                      setBodyData([]);
                    }}
                  >
                    {data.map((item) => {
                      if (
                        item.DATA_TYPE === "DECIMAL" ||
                        item.DATA_TYPE === "FLOAT" ||
                        item.DATA_TYPE === "REAL" ||
                        item.DATA_TYPE === "DOUBLE" ||
                        item.DATA_TYPE === "BOOLEAN" ||
                        item.DATA_TYPE === "TINYINT" ||
                        item.DATA_TYPE === "SMALLINT" ||
                        item.DATA_TYPE === "BIGINT" ||
                        item.DATA_TYPE === "INTEGER"
                      ) {
                        return <Option key={item.COLUMN_NAME}>{dimensionsValue === "salesdetail" ? item.SHOW_NAME : item.COLUMN_NAME}</Option>;
                      }
                    })}
                  </Select>
                  <Select
                    showSearch
                    style={{ width: "100%", marginTop: "8px" }}
                    placeholder={"limit"}
                    value={limit}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
                    onChange={handleChange}
                  >
                    <Option value="1000">1000</Option>
                    <Option value="5000">5000</Option>
                    <Option value="10000">10000</Option>
                    <Option value="20000">20000</Option>
                    <Option value="50000">50000</Option>
                  </Select>
                </Col>
              ) : null}
            </Row>
          </Col>
  
          <Col {...responsiveDesignFour} style={{ backgroundColor: "white" }}>
            <Col {...responsiveDesignRow}>
              <Menu style={{ display: "flex", padding: "8px", borderBottom: "0.25px solid #f0f0f0" }}>
                <SubMenu
                  key="sub1"
                  icon={
                    <Dropdown trigger={["click"]} overlay={openMenu} onVisibleChange={handleOpenDropDown} visible={openVisible}>
                      <Tooltip title="Open" placement="bottom">
                        <img style={{ marginTop: "-5px" }} src={Open} alt="Open" />{" "}
                      </Tooltip>
                    </Dropdown>
                  }
                />
                <SubMenu
                  key="sub2"
                  icon={
                    <Tooltip title="Save" placement="bottom">
                      <img style={{ marginTop: "-5px" }} src={SaveIcon} alt="SaveIcon" onClick={handleSaveIcon} />
                    </Tooltip>
                  }
                />
                <SubMenu
                  key="sub3"
                  icon={
                    <Tooltip title="Charts" placement="bottom">
                      <img style={{ marginTop: "-5px" }} src={Charts} alt="Charts" />
                    </Tooltip>
                  } 
                />
                <SubMenu 
                  key="sub4" 
                  icon={
                    <Tooltip title="Customise" placement="bottom">
                      <img style={{ marginTop: "-2px" }} src={Customise} alt="Customise" onClick={showCustomise} />
                    </Tooltip>
                  }
                />
                <SubMenu 
                  key="sub5" 
                  icon={
                    <Tooltip title="Measures" placement="bottom">
                      <img style={{ marginTop: "-6px", height: "14px" }} onClick={showMeasures} src={MeasureIcon} alt="MeasureIcon" />
                    </Tooltip>
                  } 
                />
                <SubMenu 
                  key="sub6" 
                  icon={
                    <Tooltip title="Dimensions" placement="bottom">
                      <img style={{ marginTop: "-5px" }} onClick={showDimensions} src={DimensionIcon} alt="DimensionIcon" />
                    </Tooltip>
                  } 
                />
                {flag === true ? 
                  <SubMenu
                    key="sub7"
                    icon={
                      <Tooltip title="Download" placement="bottom">
                        <div onClick={downloadSheet}>
                          <ReactHTMLTableToExcel
                              id="test-table-xls-button"
                              className="download-table-xls-button"
                              table="table-to-xls"
                              filename={filename}
                              sheet="tablexls"
                          />
                        </div>
                      </Tooltip>
                    }
                  /> : "" 
                }
                {columnValue.length === 0 ?
                  <SubMenu
                    key="sub8"
                    icon={
                      <Tooltip title="Download as csv" placement="bottom">
                        <DownloadOutlined onClick={handleDownloadCsv} />
                      </Tooltip>
                    }
                  /> : ""
                }
                {/* <SubMenu 
                  key="sub9" 
                  icon={
                    <Tooltip title="Run" placement="bottom">
                      <img style={{ paddingTop: "0px", width: "32px", marginLeft: "-6px", cursor: "pointer" }} src={RunButton} alt="RunButton" onClick={onRun} />
                    </Tooltip>
                  }
                /> */}
              </Menu>
            </Col>
            <Col {...responsiveDesignRow} style={{ textAlign: 'center' }} >
              <Tooltip title="Run" placement="bottom">
                {/* <img style={{ paddingTop: "12px", width: "32px", cursor: "pointer" }} src={RunButton} alt="RunButton" onClick={onRun} /> */}
                <Button style={{ cursor: "pointer", backgroundColor: "#089EA4", width: "180px", height: "33px", color: "white", marginTop: "12px" }} onClick={onRun} >
                  <img src={RunButton} alt="RunButton" />
                  Run
                </Button>
              </Tooltip>
            </Col>
          </Col>
        </Row>
        <Row>
          <Col {...(!isDimension && !isCustomise ? responsiveDesignRow : responsiveDesignColumn)}>
            {flag === true ? (
              <Card>
                <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
                  <Table bordered responsive size="sm" id="table-to-xls">
                    <thead key={"head"}>
                      <tr key={"head1"}>
                        {rowValue.map((item) => (
                          <th rowSpan={columnValue.length + 2} key={item}>
                            {dimensionsValue === "salesdetail"
                              ? item === "__time"
                                ? "Date"
                                : item === "account"
                                ? "Account"
                                : item === "basenetamount"
                                ? "Amount"
                                : item === "brand"
                                ? "Brand"
                                : item === "currency"
                                ? "Currency"
                                : item === "customer"
                                ? "Customer"
                                : item === "customergroup"
                                ? "Customer Group"
                                : item === "department"
                                ? "Department"
                                : item === "division"
                                ? "Division"
                                : item === "uom"
                                ? "UOM"
                                : item === "organization"
                                ? "Organization"
                                : item === "parentproductcategory"
                                ? "Main Category"
                                : item === "invperiod"
                                ? "Period"
                                : item === "itemcode"
                                ? "Itemcode"
                                : item === "itemname"
                                ? "Itemname"
                                : item === "product"
                                ? "Product"
                                : item === "productcategory"
                                ? "Product Category"
                                : item === "qty"
                                ? "Qty"
                                : item === "sourcenetamount"
                                ? "Amount (Trx Currency)"
                                : item === "supplier"
                                ? "Supplier"
                                : item === "transactioncost"
                                ? "Transaction Cost"
                                : ""
                              : item}
                          </th>
                        ))}
                      </tr>
                      {tableColumnData.map((column, index) => {
                        return (
                          <tr key={index}>
                            {column.map((item, i) => {
                              if (checkbox === false || (checkbox === true && compareFlag === false)) {
                                return (
                                  <th style={{ backgroundColor: i%2 === 0 ? "#f3f3f3ff" : "" }} colSpan={measuresValue.length} key={i}>
                                    {item}
                                  </th>
                                );
                              } else if (checkbox === true && compareFlag === true) {
                                return (
                                  <th style={{ backgroundColor: i%2 === 0 ? "#f3f3f3ff" : "" }} colSpan={measuresValue.length * 2} key={i}>
                                    {item}
                                  </th>
                                );
                              }
                            })}
                          </tr>
                        );
                      })}
                      <tr key={"head2"}>
                        {sumForTable.map((column) =>
                          column.map((item, index) => (
                            <>
                              {measuresValue.map((value, i) => {
                                if (checkbox === false || (checkbox === true && compareFlag === false)) {
                                  return (
                                    <th style={{ backgroundColor: index%2 === 0 ? "#f3f3f3ff" : "" }} key={`${index}-${i}`}>
                                      SUM{" "}
                                      {dimensionsValue === "salesdetail"
                                        ? value === "__time"
                                          ? "Date"
                                          : value === "account"
                                          ? "Account"
                                          : value === "basenetamount"
                                          ? "Amount"
                                          : value === "brand"
                                          ? "Brand"
                                          : value === "currency"
                                          ? "Currency"
                                          : value === "customer"
                                          ? "Customer"
                                          : value === "customergroup"
                                          ? "Customer Group"
                                          : value === "department"
                                          ? "Department"
                                          : value === "division"
                                          ? "Division"
                                          : value === "uom"
                                          ? "UOM"
                                          : value === "organization"
                                          ? "Organization"
                                          : value === "parentproductcategory"
                                          ? "Main Category"
                                          : value === "invperiod"
                                          ? "Period"
                                          : value === "itemcode"
                                          ? "Itemcode"
                                          : value === "itemname"
                                          ? "Itemname"
                                          : value === "product"
                                          ? "Product"
                                          : value === "productcategory"
                                          ? "Product Category"
                                          : value === "qty"
                                          ? "Qty"
                                          : value === "sourcenetamount"
                                          ? "Amount (Trx Currency)"
                                          : value === "supplier"
                                          ? "Supplier"
                                          : value === "transactioncost"
                                          ? "Transaction Cost"
                                          : ""
                                        : value}
                                    </th>
                                  );
                                } else if (checkbox === true && compareFlag === true) {
                                  return (
                                    <>
                                      <th style={{ backgroundColor: index%2 === 0 ? "#f3f3f3ff" : "" }} key={`${index}-${i}1`}>
                                        current_
                                        {dimensionsValue === "salesdetail"
                                          ? value === "__time"
                                            ? "Date"
                                            : value === "account"
                                            ? "Account"
                                            : value === "basenetamount"
                                            ? "Amount"
                                            : value === "brand"
                                            ? "Brand"
                                            : value === "currency"
                                            ? "Currency"
                                            : value === "customer"
                                            ? "Customer"
                                            : value === "customergroup"
                                            ? "Customer Group"
                                            : value === "department"
                                            ? "Department"
                                            : value === "division"
                                            ? "Division"
                                            : value === "uom"
                                            ? "UOM"
                                            : value === "organization"
                                            ? "Organization"
                                            : value === "parentproductcategory"
                                            ? "Main Category"
                                            : value === "invperiod"
                                            ? "Period"
                                            : value === "itemcode"
                                            ? "Itemcode"
                                            : value === "itemname"
                                            ? "Itemname"
                                            : value === "product"
                                            ? "Product"
                                            : value === "productcategory"
                                            ? "Product Category"
                                            : value === "qty"
                                            ? "Qty"
                                            : value === "sourcenetamount"
                                            ? "Amount (Trx Currency)"
                                            : value === "supplier"
                                            ? "Supplier"
                                            : value === "transactioncost"
                                            ? "Transaction Cost"
                                            : ""
                                          : value}
                                      </th>
                                      <th style={{ backgroundColor: index%2 === 0 ? "#f3f3f3ff" : "" }} key={`${index}-${i}2`}>
                                        previous_
                                        {dimensionsValue === "salesdetail"
                                          ? value === "__time"
                                            ? "Date"
                                            : value === "account"
                                            ? "Account"
                                            : value === "basenetamount"
                                            ? "Amount"
                                            : value === "brand"
                                            ? "Brand"
                                            : value === "currency"
                                            ? "Currency"
                                            : value === "customer"
                                            ? "Customer"
                                            : value === "customergroup"
                                            ? "Customer Group"
                                            : value === "department"
                                            ? "Department"
                                            : value === "division"
                                            ? "Division"
                                            : value === "uom"
                                            ? "UOM"
                                            : value === "organization"
                                            ? "Organization"
                                            : value === "parentproductcategory"
                                            ? "Main Category"
                                            : value === "itemcode"
                                            ? "Itemcode"
                                            : value === "itemname"
                                            ? "Itemname"
                                            : value === "invperiod"
                                            ? "Period"
                                            : value === "product"
                                            ? "Product"
                                            : value === "productcategory"
                                            ? "Product Category"
                                            : value === "qty"
                                            ? "Qty"
                                            : value === "sourcenetamount"
                                            ? "Amount (Trx Currency)"
                                            : value === "supplier"
                                            ? "Supplier"
                                            : value === "transactioncost"
                                            ? "Transaction Cost"
                                            : ""
                                          : value}
                                      </th>
                                    </>
                                  );
                                }
                              })}
                            </>
                          ))
                        )}
                      </tr>
                    </thead>
                    <tbody key={"body"}>
                      {bodyData.map((body, index) => {
                        return (
                          <tr key={index}>
                            {body.map((item, i) => {
                              return colorArray.map((color, j) => {
                                if (i === j) {
                                  return (
                                    <td style={{ fontWeight: index === 0 ? "bold" : "", backgroundColor: color === "#f3f3f3ff" ? "#f3f3f3ff" : "" }} key={`${index}-${i}`} className={isNaN(item) ? "pivot-left" : "pivot-right"}>
                                      {formatValue === "AdaptiveFormat" ?
                                        <AdaptiveFormat precisionValue={2}>{item}</AdaptiveFormat> : 
                                      formatValue === "NumberFormat" ?
                                        (item !== null && item !== undefined ? item.toLocaleString('en-US') : item) :
                                        item
                                      }
                                    </td>
                                  )
                                }
                              })
                           })}
                          </tr>
                        );
                      })}
                    </tbody>{" "}
                  </Table>
                </Spin>
              </Card>
            ) : (
              <Col {...responsiveDesignRow} />
            )}
          </Col>
          <Col {...responsiveDesignFour}>
            {isDimension ? (
              <Col
                {...responsiveDesignRow}
                style={{
                  marginTop: `${isMeasure && !isVerticalMeasure ? "0px" : !isVerticalMeasure && !isMeasure && isMinimise ? "0px" : "0px"}`,
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  backgroundColor: "white",
                }}
              >
                <Tabs tabBarExtraContent={operations}>
                  <TabPane style={{ border: "0px solid gray" }} tab="Dimensions" key="1">
                    {/* <Spin spinning={mainDataLoading}> */}
                      <Select
                        showSearch
                        style={{
                          width: "100%",
                        }}
                        value={'salesdetail'}
                        // onFocus={getDimensionData}
                        // onChange={handleDimensions}
                      >
                        {/* {mainData.map(item => {
                          return <Option key={item}>{item}</Option>
                        })} */}
                      </Select>
                    {/* </Spin> */}
                    <Scrollbars
                      style={{
                        height: "65vh",
                      }}
                      autoHide
                      autoHideTimeout={1000}
                      autoHideDuration={200}
                      thumbSize={90}
                      renderView={renderView}
                      renderThumbHorizontal={renderThumb}
                      renderThumbVertical={renderThumb}
                    >
                      <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={load}>
                        <Menu mode="inline">
                          {data.map((item, index) => {
                            if (
                              item.DATA_TYPE !== "DECIMAL" &&
                              item.DATA_TYPE !== "FLOAT" &&
                              item.DATA_TYPE !== "REAL" &&
                              item.DATA_TYPE !== "DOUBLE" &&
                              item.DATA_TYPE !== "BOOLEAN" &&
                              item.DATA_TYPE !== "TINYINT" &&
                              item.DATA_TYPE !== "SMALLINT" &&
                              item.DATA_TYPE !== "BIGINT" &&
                              item.DATA_TYPE !== "INTEGER"
                            ) {
                              return (
                                <Menu.Item className="testingStyle" draggable="true" onDragStart={drag} key={index}>
                                  <span style={{ color: "#080707", fontWeight: "normal", fontSize: "12px" }}>{dimensionsValue === "salesdetail" ? item.SHOW_NAME : item.COLUMN_NAME}</span>
                                </Menu.Item>
                              );
                            }
                          })}
                        </Menu>
                      </Spin>
                    </Scrollbars>
                  </TabPane>
                  <TabPane style={{ border: "0px solid gray" }} tab="Date Range" key="2">
                    <div style={{ height: "65vh" }}>
                      <RangePicker key={"1"} value={currentDateValue} format={dateFormat} onChange={currentChanges} />
                      <Checkbox style={{ marginTop: "8px" , marginBottom: "8px" }} checked={checkbox} onChange={checkboxChange}>Compare?</Checkbox>
                      {checkbox === true ? <RangePicker key={"2"} value={previousDateValue} format={dateFormat} onChange={previousChanges} /> : ""}{" "}
                    </div>
                  </TabPane>{" "}
                </Tabs>
              </Col>
            ) : 
            isCustomise ? (
              <Col
                {...responsiveDesignRow}
                style={{
                  marginTop: `${isMeasure && !isVerticalMeasure ? "0px" : !isVerticalMeasure && !isMeasure && isMinimise ? "0px" : "0px"}`,
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  backgroundColor: "white",
                }}
              >
                <Scrollbars
                      style={{
                        height: "75vh",
                      }}
                      autoHide
                      autoHideTimeout={1000}
                      autoHideDuration={200}
                      thumbSize={90}
                      renderView={renderView}
                      renderThumbHorizontal={renderThumb}
                      renderThumbVertical={renderThumb}
                >
                <img style={{ marginTop: "-8px", cursor: "pointer", float: "right" }} src={MeasureClose} alt="MeasureClose" onClick={hideCustomise} />
                <h3>Customise</h3>
                <br/>
                <h5>Value Format</h5>
                <Select
                  showSearch
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  value={formatValue}
                  onChange={changeFormat}
                >
                    <Option value="AdaptiveFormat">Adaptive Format</Option>
                    <Option value="NumberFormat">Number Format</Option>
                </Select>
                </Scrollbars>
              </Col>
            ) : null}
          </Col>
        </Row>
        <Modal
              visible={visibleViewModal}
              title={"Create New Grid View"}
              onCancel={() => { setVisibleViewModal(false); setViewName(''); }}
              getContainer={false}
              footer={[
                <Button onClick={() => { setVisibleViewModal(false); setViewName(''); }}>
                  Cancel
                </Button>,
                <Button style={{ backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={saveViewName}>
                  Save
                </Button>
              ]}
            >
              <Input placeholder="Enter View Name" allowClear onChange={handleViewName}/>
          </Modal>
      </div>
    );
}

export default SalesGPReport;