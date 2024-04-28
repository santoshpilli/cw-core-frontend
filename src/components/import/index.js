import React, { useState, useEffect } from "react";
import { Card, Col, Row, Spin, Select, Form, message, Button, Dropdown, Menu, Table } from "antd";
import { ExportToCsv } from 'export-to-csv'
import { getComboFillForImport, importDefinitionService, downloadImportDataService, verifyAndImportService } from "../../services/generic";
import { LoadingOutlined } from "@ant-design/icons";
import verifyError from '../../assets/images/verifyerror.svg'
import TableForImport from "./TableForImport";
import "./index.css"

const { Option } = Select;

const Import = (props) => {

  const propsData = props
  let importTypeFlag = false
  // const [propsData,setPropsData] = useState(props)
  const [selectedId, setSelectedId] = useState([]);
  const [importTypeDropdownDetails, setImporTypeDropdownDetails] = useState([]);
  const [sortedTableHeader, setSortedTableHeader] = useState([]);
  const [tableHeader, setTableHeader] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableDataCopy, setTableDataCopy] = useState([])
  const [templateId, setTemplateId] = useState();
  const [templateColumns, setTemplateColumns] = useState([]);
  const [selectedImportName, setSelectedImportName] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadTemplateFlag, setDownloadTemplateFlag] = useState(false);
  const [showDownloadTemplateOption, setShowDownloadTemplateOption] = useState(false);
  const [verifyAndImportFlag, setVerifyAndImportFlag] = useState(false);
  const [errorDownload, setErrorDownload] = useState(false)
  const [form] = Form.useForm();

  useEffect(() => {
    if (propsData.importData !== undefined) {
      const { importData } = propsData;
      const { importFlag, importId, windowName } = importData;
      onSelectImportData(importId, { children: windowName });
    }
  }, [propsData]);

  if (propsData.importData !== undefined) {
    const { importData } = propsData;
    const { importFlag } = importData;
    importTypeFlag = importFlag
  }

  const getImportDropdownData = async () => {
    const getImportData = await getComboFillForImport();
    setImporTypeDropdownDetails([...getImportData]);
  };

  const onSelectImportData = async (value, event) => {
    setLoading(true)
    setTemplateId(value)
    const importTypeId = value;
    const importName = event.children;
    const headerArray = [];

    const getImportDataOnSelect = await importDefinitionService(importTypeId, importTypeFlag);
    const headerData = Object.keys(getImportDataOnSelect[0]);
    for (let index = 0; index < headerData.length; index++) {
      const element = headerData[index];
      headerArray.push({
        // headerName: filtersData[index].displayName,
        title: element,
        dataIndex: element,
        key: index,
        width: 180,
        ellipsis: true,
        /* render: (text) => (finalArrayToPush[index].drillDown === "Y" ? <a>{text}</a> : text),
        onCell: (record) => ({
          onClick: () => {
            drillDown(jsonToSend, finalArrayToPush[index].fieldName, record[finalArrayToPush[index].fieldName], finalArrayToPush[index].detailReportId);
          },
        }), */
      });
    }
    setTableHeader(headerArray);
    setTableData(getImportDataOnSelect);
    setSelectedId(importTypeId);
    setSelectedImportName(importName)
    setLoading(false)

    const headersData = await downloadImportDataService(importTypeId, importTypeFlag);
    const arrayOfColumns = [];
    const nullArray = [];
    const withoutNullArray = [];
    const sortedFieldArray = [];
    const parsedResponse = headersData;
    const sortedResponse = parsedResponse.sort(function (a, b) {
      return a.sequenceNo - b.sequenceNo;
    });

    for (let index1 = 0; index1 < sortedResponse.length; index1++) {
      if (sortedResponse[index1].sequenceNo === null) {
        nullArray.push(sortedResponse[index1]);
      } else {
        withoutNullArray.push(sortedResponse[index1]);
      }
    }

    const finalArray = withoutNullArray.concat(nullArray);

    for (let index = 0; index < finalArray.length; index += 1) {
      const element = finalArray[index].fieldName;
      sortedFieldArray.push(finalArray[index].fieldName);
      arrayOfColumns.push({ title: element, dataIndex: element, width: 180, ellipsis: true });
    }

    setTemplateColumns(arrayOfColumns)


  };

  const readFileData = async (evt) => {
    /* const {form}=this.props;
    form.validateFieldsAndScroll(['importDropdownName'],(err, values) => {
      if (!err) { */
    setSelectedRowKeys([]);
    setRowSelectionKeys([])
    setTableHeader([]);
    setTableData([]);
    setLoading(true)
    const headersData = await downloadImportDataService(selectedId, importTypeFlag);
    const arrayOfColumns = [];
    const nullArray = [];
    const withoutNullArray = [];
    const sortedFieldArray = [];
    const parsedResponse = headersData;
    const sortedResponse = parsedResponse.sort(function (a, b) {
      return a.sequenceNo - b.sequenceNo;
    });

    for (let index1 = 0; index1 < sortedResponse.length; index1++) {
      if (sortedResponse[index1].sequenceNo === null) {
        nullArray.push(sortedResponse[index1]);
      } else {
        withoutNullArray.push(sortedResponse[index1]);
      }
    }

    const finalArray = withoutNullArray.concat(nullArray);

    for (let index = 0; index < finalArray.length; index += 1) {
      const element = finalArray[index].fieldName;
      sortedFieldArray.push(finalArray[index].fieldName);
      arrayOfColumns.push({ title: element, dataIndex: element, width: 180, ellipsis: true });
    }
    setTableHeader(arrayOfColumns);
    setSortedTableHeader(sortedFieldArray)
    setTemplateColumns(arrayOfColumns)
    const { files } = evt.target;
    if (files[0] === undefined) {
      setLoading(false)
      document.getElementById("choosefile").value = null;
    } else {

      const filename = files[0].name;
      const fileExt = filename.substr(filename.lastIndexOf("."), filename.length);

      if (fileExt !== ".csv") {
        message.error("Please select csv file");
      } else {
        const file = files[0];
        const reader = new FileReader();
        let fileTextData;
        reader.onload = (e) => {
          fileTextData = e.target.result;
          const rows = fileTextData.split(/\r?\n/);
          const newData = [];
          rows.forEach((element) => {
            if (element.trim() !== "") {
              newData.push(element);
            }
          });
          const dataArr = [];
          let importCount = 1;
console.log(newData)
          // Process each row in the CSV data
          for (let i = 1; i < newData.length; i += 1) {
            const row = newData[i];
            const cells = row.split(',');
            const jsonObject = {};
            let hasError = false;

            // Iterate through each cell in the row and add to jsonObject
            for (let index = 0; index < arrayOfColumns.length; index += 1) {
              const element = arrayOfColumns[index];
              const cellValue = cells[index]?.replace(/"/g, "") ?? ""; // Use empty string as default value
              jsonObject[element.dataIndex] = cellValue;
            
              // Check if there's an error in the cell and set hasError flag
              if (cellValue === "$%&^*") {
                hasError = true;
                break; // Exit the loop early if an error is found
              }
            }            

            // Add the "Status" column to indicate if there's an error
            jsonObject.status = hasError ? "Has Error" : "No Error";

            dataArr.push(jsonObject);
          }
          const tableDataWithoutStatus = dataArr.map(({ status, ...rest }) => rest);
          setTableDataCopy(tableDataWithoutStatus)
          // console.log(tableDataWithoutStatus);
          // Add a single "Status" column to the header
          arrayOfColumns.push({ title: "Status", dataIndex: "status", width: 180, ellipsis: true });
          const data = dataArr.map((item, index) => ({
            ...item,
            key: index, // Use the index as the key
            // actions: item.status === "Has Error" ? ["Like", "Share"] : [] // Add actions based on status
          }));
          // Set the table data
          // setTableData(dataArr);

          // }

          if (data.length > 0) {
            // if (newData.length === importCount) {
            // that.setState({detailsToBeAddedArrayForGrid:dataArr,hideVerifyButton:false,isDownloadDisabled:false})
            setTableData(data);
            setLoading(false)
            message.success("Data imported successfully");
            setShowDownloadTemplateOption(true)
            setDownloadTemplateFlag(true)
            setVerifyAndImportFlag(true)
            // } else {
            //   setTableData([]);
            //   setLoading(false)

            // }
          } else {
            message.error("Error in importing file");
            document.getElementById("choosefile").value = null;
            setLoading(false)
          }
        };
        reader.readAsText(file);
      }

    }

    /* }else{
        document.getElementById("choosefile").value = null;  
      }
    }) */
  };


  const clearData = () => {
    form.resetFields()
    setTableData([]);
    setTableHeader([]);
    setShowDownloadTemplateOption(false)
    setDownloadTemplateFlag(false)
    setVerifyAndImportFlag(false)
    /* this.setState({
      columns: [],
      detailsToBeAddedArrayForGrid: [],
      hideVerifyButton: true,
      hideImportButton: true,
      isDownloadDisabled: true,
      showVerifyInAction: false,
    }) */
    document.getElementById("choosefile").value = null;
  }

  const verifyAndImport = () => {
    const hasImportErrors = tableData.some(record => record.status === "Has Error");
    if (hasImportErrors) {
      message.warn("some of your records have errors")
    } else {
      form.submit();
    }
  }

  const onFinish = async (values) => {
    if (propsData.importData !== undefined) {
      const { importData } = propsData;
      const { headerId } = importData
      setLoading(true)
      const tableHeaderAfterVerifyAndImport = []
      // console.log(tableDataCopy)
      const stringifiedJSON = JSON.stringify(tableDataCopy)
      console.log(tableDataCopy)
      const jsonToSend = stringifiedJSON.replace(/"/g, '\\"')
      // console.log(jsonToSend)
      const verifyAndImportResponse = await verifyAndImportService(headerId, selectedId, jsonToSend, templateId, importTypeFlag);
      if (!verifyAndImportResponse || !verifyAndImportResponse.afterInsert) {
        // Handle the case when verifyAndImportResponse is null or empty
        setLoading(false);
        message.error("Unable to Verify and Import the data")
        // You might want to add an error message or perform other actions here
        return;
      }
      const { afterInsert } = verifyAndImportResponse
      const afterVerifyArray = Object.keys(afterInsert[0])
      const messageCodeAndMessageArray = ["ErrorMessageCode", "ErrorMessage"]
      const verifyAndImportTableHeader = messageCodeAndMessageArray.concat(sortedTableHeader)
      for (let index = 0; index < verifyAndImportTableHeader.length; index++) {
        const element = verifyAndImportTableHeader[index];
        tableHeaderAfterVerifyAndImport.push({
          title: element,
          render: (text) => (text === 'Verify Error' ? <span>{text}&emsp;<img alt="" src={verifyError} /></span> : text),
          dataIndex: element,
          width: 180,
          ellipsis: true,
        });
      }
      const hasImportErrors = tableData.some(record => record.ErrorMessageCode === "Import Error" || record.ErrorMessageCode === "Verify Error");
      setErrorDownload(hasImportErrors)
      setTableHeader(tableHeaderAfterVerifyAndImport)
      setTableData(afterInsert)
      setLoading(false)
      setVerifyAndImportFlag(false)
    } else {
      setLoading(true)
      const headerId = null
      const tableHeaderAfterVerifyAndImport = []
      //  const replacer = (value) => {
      //   if (!isNaN(value) && typeof value === "string" && value.trim() !== "") {
      //     return Number(value); 
      //   }
      //   return value; 
      // };    
      const stringifiedJSON = JSON.stringify(tableDataCopy)
      console.log(tableDataCopy)
      const jsonToSend = stringifiedJSON.replace(/"/g, '\\"')
      console.log(jsonToSend)
      const verifyAndImportResponse = await verifyAndImportService(headerId, selectedId, jsonToSend, templateId);
      const { afterInsert } = verifyAndImportResponse
      const afterVerifyArray = Object.keys(afterInsert[0])
      const messageCodeAndMessageArray = ["ErrorMessageCode", "ErrorMessage"]
      const verifyAndImportTableHeader = messageCodeAndMessageArray.concat(sortedTableHeader)
      for (let index = 0; index < verifyAndImportTableHeader.length; index++) {
        const element = verifyAndImportTableHeader[index];
        tableHeaderAfterVerifyAndImport.push({
          title: element,
          render: (text) => (text === 'Verify Error' ? <span>{text}&emsp;<img alt="" src={verifyError} /></span> : text),
          dataIndex: element,
          width: 180,
          ellipsis: true,
        });
      }
      const hasImportErrors = tableData.some(record => record.ErrorMessageCode === "Import Error" || record.ErrorMessageCode === "Verify Error");
      setErrorDownload(hasImportErrors)
      setTableHeader(tableHeaderAfterVerifyAndImport)
      setTableData(afterInsert)
      setLoading(false)
      setVerifyAndImportFlag(false)
    }

  }

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo)
  }
  const downloadTemplate = () => {
    if (templateColumns === undefined || templateColumns === null || templateColumns.length === 0) {
      message.error("No Headers present")
    } else {
      const templateArray = []
      const headerArray = []
      for (let index = 0; index < templateColumns.length; index += 1) {
        const element = templateColumns[index];
        const fieldName = element.dataIndex
        templateArray.push({})
        headerArray.push(fieldName)
      }

      const options = {
        fieldSeparator: ',',
        filename: selectedImportName,
        // quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: false,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: false,
        headers: headerArray
        // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
      }
      const csvExporter = new ExportToCsv(options)
      csvExporter.generateCsv(templateArray)
    }
  }

  const downloadData = () => {
    if (tableData.length === 0 || tableHeader.length === 0) {
      message.error("No Headers present")
    } else {
      for (let index = 0; index < tableData.length; index += 1) {
        const element = tableData[index];
        Object.keys(element).forEach(function (key) {
          let Keys = key
          if (Keys.substring(0, 2) === '__') {
            delete element[Keys]
          }
          /* delete element["ErrorMessageCode"]
          delete element["ErrorMessage"] */
        })
      }

      const options = {
        fieldSeparator: ',',
        filename: 'ImportData',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: false,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
        headers: tableHeader
        // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
      }
      const csvExporter = new ExportToCsv(options)
      csvExporter.generateCsv(tableData)
      // this.setState({ loading: false })
    }

  }

  const downloadErrorRecords = () => {
    if (tableData.length === 0 || tableHeader.length === 0) {
      message.error("No Headers present")
    } else {
      for (let index = 0; index < tableData.length; index += 1) {
        const element = tableData[index];
        Object.keys(element).forEach(function (key) {
          let Keys = key
          if (Keys.substring(0, 2) === '__') {
            delete element[Keys]
          }
          /* delete element["ErrorMessageCode"]
          delete element["ErrorMessage"] */
        })
      }

      const importErrorRecords = tableData.filter(record => record.ErrorMessageCode === "Import Error" || record.ErrorMessageCode === "Verify Error");

      const options = {
        fieldSeparator: ',',
        filename: 'ImportData',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: false,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
        headers: tableHeader
        // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
      }
      const csvExporter = new ExportToCsv(options)
      csvExporter.generateCsv(importErrorRecords)
      // this.setState({ loading: false })
    }

  }

  const actionsContent = (
    <Menu>
      {showDownloadTemplateOption === true ? (
        <Menu.Item key="1" style={{ color: "#314659" }} onClick={downloadTemplate}>
          Download Template
        </Menu.Item>
      ) : (
        ""
      )}
      {downloadTemplateFlag === true ? (
        <Menu.Item
          key="2"
          style={{ color: '#314659' }}
          onClick={downloadErrorRecords}
          disabled={errorDownload}
        >
          Download Error Records
        </Menu.Item>
      ) : (
        ""
      )}
      {/* <Menu.Item
        key="2"
        style={{ color: '#314659' }}
        // disabled={isDownloadDisabled}
      >
        Download Data
      </Menu.Item>

      <Menu.Item key="3" style={{ color: '#314659' }}>
        Download Error Records
      </Menu.Item> */}

      {/* {showVerifyInAction === true ? (
        <Menu.Item key="4" style={{ color: '#314659' }} onClick={this.verifyDatainAction}>
          Verify
        </Menu.Item>
      ) : (
        ''
      )}
 */}
      <Menu.Item key="4" style={{ color: "#314659" }} onClick={clearData}>
        Clear
      </Menu.Item>
    </Menu>
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rowSelectionKeys, setRowSelectionKeys] = useState([]);
  const onSelectChange = (keys, selectedRows) => {
    console.log(keys,selectedRows)
    setRowSelectionKeys([...keys]);
    setSelectedRowKeys([...selectedRows]);
  };

  const rowSelection = {
    selectedRowKeys: rowSelectionKeys,
    onChange: onSelectChange,
    hideSelectAll: true,
    fixed: true,
  };

  /* const responsiveDesignForColumn = {
    xxl: 24,
    xl: 24,
    lg: 24,
    xs: 12,
    sm: 12,
    md: 12,
  }; */

  const columns = tableHeader.map((col, index) => ({
    ...col,
    onHeaderCell: (columns) => ({
      width: columns.width,
      onResize: handleResize(index),
    }),
  }));

  const handleResize =
    (index) =>
      (e, { size }) => {
        setTableHeader((columns) => {
          const nextColumns = [...columns];
          nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
          };
          return nextColumns;
        });
      };

  const deleteSelectedRecords = () => {
    const updatedTableData = tableData.filter((item, index) => !rowSelectionKeys.includes(index)).map((item, index) => {
      // Remove the existing "key" property and add a new "key" property with the index as the value
      const { key, ...rest } = item;
      return { key: index, ...rest };
    });
    const updatedTableDataWithoutStatus = updatedTableData.map(({ status, ...rest }) => rest);
    setTableDataCopy(updatedTableDataWithoutStatus)
    setTableData(updatedTableData);
    setSelectedRowKeys([]);
    setRowSelectionKeys([])
  };


  return (
    <div>
      <Spin indicator={<LoadingOutlined style={{ fontSize: "52px" }} spin />} spinning={loading}>
        <Row>
          <Col span={12}>
            <h2>
              <b>Import</b>
            </h2>
          </Col>
          <Col span={12}>
            <Button disabled={verifyAndImportFlag === false ? true : false} style={{ float: "right", backgroundColor: "#089EA4", color: "#FFFFFF", fontWeight: "bold" }} onClick={verifyAndImport}>
              Verify and Import
            </Button>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24} style={{ marginBottom: "8px" }}>
            <Card>
              <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                <Row gutter={8}>
                  {importTypeFlag === false ? (
                    <Col span={8}>
                      <Form.Item label="Import" name="import" rules={[{ required: true, message: "Please select supplier" }]}>
                        <Select
                          style={{ width: "100%" }}
                          size="medium"
                          // mode="multiple"
                          maxTagCount={1}
                          showSearch
                          allowClear
                          dropdownMatchSelectWidth={false}
                          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          onFocus={getImportDropdownData}
                          onSelect={onSelectImportData}
                        >
                          {importTypeDropdownDetails === null || importTypeDropdownDetails === undefined
                            ? null
                            : importTypeDropdownDetails.map((data) => {
                              return (
                                <Option key={data.recordid} value={data.recordid}>
                                  {data.name}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                  ) : null}
                  <Col span={8}>
                    <Form.Item label="Import Option" name="importOption" rules={[{ required: false, message: "Please select import option" }]}>
                      <Select
                        style={{ width: "100%" }}
                        size="medium"
                        // mode="multiple"
                        maxTagCount={1}
                        showSearch
                        allowClear
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      // onFocus={getImportDropdownData}
                      // onSelect={onSelectImportData}
                      >
                        <Option key="1" value="Create New">
                          Create New
                        </Option>
                        <Option key="2" value="Update Existing">
                          Update Existing
                        </Option>
                        <Option key="3" value="Create New & Update Existing">
                          Create New & Update Existing
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <input id="choosefile" type="file" accept=".csv" onChange={readFileData} style={{ marginTop: "15%" }} />
                  </Col>
                  <Col span={4}>
                    {/* <Button style={{ marginTop: "13%", float:"right",backgroundColor:"#089EA4",color:"#FFFFFF",fontWeight:"bold" }} onClick={clearData}>Clear</Button> */}
                    <Dropdown placement="bottomRight" overlay={actionsContent} trigger={["hover"]}>
                      <Button style={{ marginTop: "13%", float: "right", backgroundColor: "#089EA4", color: "#FFFFFF", fontWeight: "bold" }}>Actions</Button>
                    </Dropdown>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginBottom: "8px" }}>
            <Card>
              {downloadTemplateFlag === false ? (
                <span style={{ cursor: "pointer", color: "#0000EE" }} onClick={downloadTemplate}>
                  Download Template
                </span>
              ) : (
                <span style={{ cursor: "pointer", color: "#0000EE" }} onClick={downloadData}>
                  Download CSV Format
                </span>
              )}
              {
                selectedRowKeys?.length > 0 ? (
                  <span style={{ cursor: "pointer", color: "#0000EE", float: "right", display: "flex" }} onClick={deleteSelectedRecords}>
                    Delete Selected Records
                  </span>) : ""

              }
              <br />

              <TableForImport columnsData={columns} gridData={tableData} rowSelection={rowSelection} />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Import;
