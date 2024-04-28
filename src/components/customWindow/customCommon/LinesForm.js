import React, { useState } from 'react'
import { Card, Row, Col, Form, Button, Select, InputNumber, Table } from 'antd'
import { useGlobalContext } from "../../../lib/storage";
import trashIcon from "../../../assets/images/trash.svg";
import { getSelectorDataFromApi } from "../../../services/generic"
import { v4 as uuid } from "uuid";
import reset from "../../../assets/images/reset.svg"
import printIcon from "../../../assets/images/printIcon.svg"
import mailIcon from "../../../assets/images/maillicon.svg"
import EmailTemplate from './email/EmailTemplate';
import ImportTemplate from './import/ImportTemplate';
import { useHistory } from "react-router-dom";



const { Option } = Select

const LinesForm = (props) => {
  const history = useHistory();
  const { globalStore } = useGlobalContext();
  const Themes = globalStore.userData.CW360_V2_UI;
  const { schema, dataSource, setDatasource, changeQty, getselectedProductData, form, getFormValues, saveFlag, setSaveFlag, clearScreen, selectedHistoryRecord, selectedOption, getPrint, recordId, processDataForLines, importFlag } = props

  const [linesDropdownData, setLinesDropdownData] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const tableColumns = schema?.lineFields.map(field => {
    let column = {
      title: field.title,
      dataIndex: field.name,
      width: 230,
    };

    if (field.type === 'selector') {
      column.render = (text, row, index) => (
        <span>
          {selectedHistoryRecord.status !== "CO" ?
            <Select
              className="certain-category-search"
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ width: '200px' }}
              style={{ width: '200px' }}
              showSearch
              value={text}
              onSearch={(e) => searchDropdownRecords(e, field)}
              size="medium"
              filterOption={(input, option) =>
                option.props.children !== undefined
                  ? option.props.children
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0
                  : ''
              }
              // onSelect={(option) => getselectedProductData(option, index)} 
              onSelect={(value) => {
                const selectedOp = linesDropdownData.find(option => option.recordid === value);
                getselectedProductData(selectedOp, field.name, index);
              }}
            >
              {linesDropdownData.map((option, index) => (
                <Option key={`${index}-${option.name}`} value={option.recordid}>
                  {option.value}-{option.name}
                </Option>
              ))}
            </Select> : text}
        </span>
      );
    } else if (field.type === 'number') {
      column.render = (text, row, index) => (
        <span>
          {selectedHistoryRecord.status !== "CO" ?
            <InputNumber onChange={(e) => changeQty(e, field.name, index)} size="medium" style={{ width: '90%' }} value={text} /> :
            text}
        </span>
      );
    } else if (field.type === 'icon' && field.name === 'delete') {
      column.render = (text, row) => (
        <span>
          {selectedHistoryRecord.status !== "CO" ?
            <img src={trashIcon} alt='delete' onClick={() => deleteLine(row)} /> : null}
        </span>
      );
    }
    return column;
  });

  let myObject = {};

  schema?.lineFields.forEach(field => {
    myObject[field.name] = "";
  })

  const addLine = () => {
    let uniqueId = uuid()
      .replace(/-/g, "")
      .toUpperCase();
    myObject.key = uniqueId
    const newdataSource = [myObject, ...dataSource]
    setDatasource(newdataSource)
  }

  const deleteLine = (row) => {
    const updatedDataSource = dataSource.filter(item => item.key !== row.key);
    setDatasource(updatedDataSource);
  }


  const getData = async (event, field) => {
    const valuesObj = field.apiBuiler.params
    let valuesCopy = { ...valuesObj }
    valuesCopy.name = event === "" || event === undefined ? null : event
    valuesCopy.value = "null"
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
    const stringifiedJSON = JSON.stringify(valuesCopy);
    const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
    const response = await getSelectorDataFromApi(field.apiBuiler.id, jsonToSend)
    setLinesDropdownData(response)
  }

  const debounce = (fn, d) => {
    let timer
    return function () {
      let context = searchInput,
        args = arguments
      clearTimeout(timer)
      timer = setTimeout(() => {
        getData.apply(context, arguments)
      }, d)
    }
  }
  const debounceLog = debounce(getData, 500)

  const searchDropdownRecords = (e, field) => {
    debounceLog(e, field)
  }

  return (
    <div>
      <Card style={{ marginTop: '20px', borderRadius: '8px', border: '1px solid #E4E4E4', boxShadow: '0px 0px 10px 1px rgba(0, 0, 0, 0.04)' }} bodyStyle={{ padding: '25px', paddingTop: '0px', paddingBottom: '15px' }}>
        <Row gutter={24}>
          <Col span={24}>
            <Table
              columns={tableColumns}
              dataSource={dataSource}
              style={{ fontSize: "12px" }}
              size="small"
              sticky={true}
              scroll={{ y: "21vh", x: "100%" }}
              pagination={false}
              footer={() => <span>
                <Row gutter={24}>
                  <Col span={4} style={{ paddingLeft: '4px', paddingTop: '10px' }}>
                    <Button
                       id='addProduct'
                      disabled={selectedHistoryRecord.status === "CO"} type="dashed" style={{ fontsize: '14px', fontStyle: 'normal', fontWeight: '700', fontFamily: 'Inter', color: '#0C173A', border: '1px dashed #0C173A' }} block onClick={addLine} >
                      + Add Product
                    </Button>
                  </Col>
                </Row>
              </span>}
            />
          </Col>
        </Row>
      </Card>
      <Row gutter={24} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <span style={{ float: 'right' }}>
            <img
             id='clearFilter'
              onClick={clearScreen} alt="refresh" width="25px" height="15px" src={reset} style={{ cursor: "pointer", marginBottom: '4px' }} />
            &emsp;
            <ImportTemplate selectedHistoryRecord={selectedHistoryRecord} importConfig={schema.LinesButtons[2].importConfig} selectedOption={selectedOption} processDataForLines={processDataForLines} importFlag={importFlag} />
            <EmailTemplate selectedHistoryRecord={selectedHistoryRecord} emailConfig={schema.LinesButtons[1].emailConfig} recordId={recordId} />
            <Button
               id='print'
              onClick={getPrint} disabled={selectedHistoryRecord.status !== "CO"} style={{ border: 'none', padding: '0px', background: 'none' }}>
              <img alt="setting" width="25px" height="15px" src={printIcon} style={{ cursor: "pointer", marginBottom: '4px' }} />
            </Button>
            &emsp;
            <Button
              disabled={selectedHistoryRecord.status === "CO"}
              htmlType="submit"
              onClick={() => setSaveFlag(true)}
              style={{ height: "36px", borderRadius: "4px", borderColor: '#0C173A', background: 'transparent', fontFamily: "Inter", fontWeight: 700, color: Themes.appTheme.primaryColor }}
            >
              Save
            </Button>
            &emsp;
            <Button
              id={`${schema.LinesButtons[0].name}`}
              disabled={selectedHistoryRecord.status === "CO"}
              type="primary"
              style={{ height: "36px", borderRadius: "4px", boxShadow: "-1px -1px 3px #00000029", fontFamily: "Inter", fontWeight: 700, color: selectedHistoryRecord.status === "CO" ? "#000000" : "#FFFFFF" }}
              htmlType="submit"
              onClick={() => setSaveFlag(false)}
            >
              {schema.LinesButtons[0].name}
            </Button>
          </span>
        </Col>
      </Row>
    </div>
  )
}

export default LinesForm