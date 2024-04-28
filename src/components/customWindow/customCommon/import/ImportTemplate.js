import React, { useState } from "react";
import { Button, Modal, Card, Row, Col, Form, Spin, message } from "antd";
import { ExportToCsv } from 'export-to-csv'
import { getSelectorDataFromApi } from "../../../../services/generic"
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons'
import downloadAll from "../../../../assets/images/downloadAll.svg"
import "react-quill/dist/quill.bubble.css";
import "./style.css"
import { useHistory } from "react-router-dom";

const ImportTemplate = (props) => {
  const history = useHistory();
  const { selectedHistoryRecord, importConfig, selectedOption, processDataForLines, importFlag } = props;
  const templateColumns = importConfig.columns
  const fileName = importConfig.fileName
  const params = importConfig.params
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();
  const [dataToprocess, setDataToprocess] = useState([])
  const printTemplate = async () => {
    form.resetFields();
    setIsModalVisible(true);
    // setLoading(true)

  };


  const handleOk = () => {
    processDataForLines(dataToprocess)
    setIsModalVisible(false);
    document.getElementById("choosefile").value = null;
    setDataToprocess([])
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    document.getElementById("choosefile").value = null;
    setDataToprocess([])
  };

  const onFinish = async (values) => {
    try {

    } catch (error) {
      console.error("Error", error);
    }
  };

  const downloadTemplate = () => {
    const templateArray = []
    const headerArray = []
    for (let index = 0; index < templateColumns.length; index += 1) {
      const element = templateColumns[index];
      const fieldName = element
      templateArray.push({})
      headerArray.push(fieldName)
    }

    const options = {
      fieldSeparator: ",",
      filename: fileName,
      // quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      headers: headerArray,
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(templateArray);
  }

  const readFileData = async (evt) => {
    setLoading(true);
    const { files } = evt.target;
    if (files[0] === undefined) {
      setLoading(false);
      document.getElementById("choosefile").value = null;
    } else {
      const filename = files[0].name;
      const fileExt = filename.substr(filename.lastIndexOf("."), filename.length);
      if (fileExt !== ".csv") {
        message.error("Please select a CSV file");
      } else {
        setLoading(true)
        const file = files[0];
        const reader = new FileReader();
        reader.onload = async (e) => {
          const fileTextData = e.target.result;
          const rows = fileTextData.split(/\r?\n/);
          const headers = rows[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const headerIndexMap = {};
          for (let i = 0; i < headers.length; i++) {
            headerIndexMap[headers[i]] = i;
          }

          const dataArr = [];
          let importCount = 1;

          for (let i = 1; i < rows.length; i += 1) {
            const cells = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const jsonObject = {};
            for (let index = 0; index < templateColumns.length; index += 1) {
              const element = templateColumns[index];
              const columnIndex = headerIndexMap[element];
              if (columnIndex !== undefined && cells[columnIndex] !== undefined) {
                jsonObject[element] = cells[columnIndex].replace(/"/g, "");
              }
            }
            // Check if all templateColumns are present in the CSV row
            if (Object.keys(jsonObject).length === templateColumns.length) {
              dataArr.push(jsonObject);
              importCount += 1;
            }
          }
          if (dataArr.length > 0) {
            let newArray = dataArr.map((item) => item.productCode);
            const valuesObj = params
            let valuesCopy = { ...valuesObj }
            for (const key in valuesObj) {
              if (valuesObj.hasOwnProperty(key) && valuesObj[key]) {
                if (selectedOption[valuesObj[key]]) {
                  valuesCopy[key] = selectedOption[valuesObj[key]]?.recordId === undefined ? null : selectedOption[valuesObj[key]]?.recordId
                } else {
                  const fieldData = form.getFieldValue(valuesObj[key]) === undefined ? null : form.getFieldValue(valuesObj[key]);
                  valuesCopy[key] = fieldData
                }
              }
            }
            // console.log("dataArr======================>", dataArr)
            valuesCopy.value = newArray
            valuesCopy.name = "null"
            const stringifiedJSON = JSON.stringify(valuesCopy);
            const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
            const response = await getSelectorDataFromApi('64895b56972763299598e7bc', jsonToSend)
            const ProductResponse = response
            const templateValueMap = new Map();
            dataArr.forEach((item) => {
              templateValueMap.set(item.productCode, { qty: item.qty, price: item.price ? item.price : 0 });
            });
            const updatedProductArray = ProductResponse.map((item) => {
              const templateValues = templateValueMap.get(item.value);
              const importqty = templateValues ? templateValues.qty : item.qty;
              const price = templateValues ? templateValues.price : item.importprice;
              return {
                ...item,
                importqty,
                price,
              };
            });
            setDataToprocess(updatedProductArray)
            setLoading(false)
            message.success("Data fetched !");

          }
          else {
            message.error("Error in importing file");
            document.getElementById("choosefile").value = null;
            setLoading(false)
          }
        };

        reader.readAsText(file);
      }
    }
  };

  return (
    <span>
      <Button
       id='importTemplate'
        onClick={printTemplate} disabled={selectedHistoryRecord?.status === "CO" || importFlag === false} style={{ border: 'none', padding: '0px', background: 'none' }}>
        <img alt="refresh" width="25px" height="15px" src={downloadAll} style={{ cursor: "pointer", marginBottom: '4px' }} />
      </Button>
      &emsp;
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width="40%"
        // height="200px"
        centered
        title={<>
          <h2 style={{ fontWeight: 'bold', fontStyle: 'normal', float: 'left' }}>Import</h2>
          <span style={{ float: 'right' }}><CloseOutlined onClick={handleCancel} /></span>
        </>}
        closable={false}
        bodyStyle={{ padding: "0px" }}
        footer={[
          <span
            style={{ color: '#0C173A', fontWeight: 700, cursor: 'pointer' }}
            onClick={handleCancel}
          >
            Cancel
          </span>,
          <Button
            style={{ backgroundColor: "#0C173A", color: "white", width: "88px", height: "36px", marginLeft: '31px', fontWeight: 700, borderRadius: '4px' }}
            key="submit"
            onClick={handleOk}
            disabled={dataToprocess.length === 0}
          >
            Import
          </Button>,
        ]}
      >
        <br />
        <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: '52px' }} spin />} spinning={loading}>
          <Form layout="vertical" name="control-hooks" style={{ padding: "15px" }} form={form} onFinish={onFinish}>
            <Row>
              <Col style={{ padding: "10px" }} span={24}>
                <Row style={{ paddingBottom: "16px" }}>
                  <Col style={{ paddingRight: "8px" }} span={24}>
                    <input id="choosefile" type="file" accept=".csv" onChange={readFileData} />
                    <span style={{ cursor: "pointer", color: "#0000EE" }} onClick={downloadTemplate}>
                      Download Template
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </span>
  );
};

export default ImportTemplate;
