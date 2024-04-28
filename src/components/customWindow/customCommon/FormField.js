import React, { useState, Fragment } from "react";
import { Form, Input, Select, DatePicker, Button } from "antd";
import { getSelectorDataFromApi } from "../../../services/generic"
import { useGlobalContext } from "../../../lib/storage";
import moment from 'moment'
import { useHistory } from "react-router-dom";


const { Option } = Select
const FormField = (props) => {
  const history = useHistory();
  const { globalStore } = useGlobalContext();
  const userPreferences = globalStore.userPreferences;
  const dateFormat = userPreferences.dateFormat
  const { field, form, selectedOption, setSelectedOption, getdraftData, selectedHistoryRecord } = props

  const [optionsForSelector, setOptionsForSelector] = useState([])

  const getSelectorData = async () => {
    const valuesObj = field.apiBuiler.params
    let valuesCopy = { ...valuesObj }
    for (const key in valuesObj) {
      if (valuesObj.hasOwnProperty(key) && valuesObj[key]) {
        if (valuesObj[key] === "null") {
          valuesCopy[key] = "null"
        }
        else if (valuesObj[key].includes("#")) {
          valuesCopy[key] = valuesObj[key].replace("#", "")
        } else {
          const fieldData = form.getFieldValue(valuesObj[key]);
          valuesCopy[key] = fieldData
        }
      }
    }

    const stringifiedJSON = JSON.stringify(valuesCopy);
    const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
    const response = await getSelectorDataFromApi(field.apiBuiler.id, jsonToSend)
    setOptionsForSelector(response === null || response === undefined ? [] : response)
  }

  const handleDropdownChange = (fie, value, option) => {
    setSelectedOption((prevState) => ({
      ...prevState,
      [fie.name]: { recordId: value, name: option.children },
    }));
    // if(fie.lineData != null){
    //   const valuesObj2 = fie.lineData.apiBuiler.params
    //   let valuesCopy2 = { ...valuesObj2 }
    //   for (const key in valuesObj2) {
    //       if (valuesObj2.hasOwnProperty(key) && valuesObj2[key]) {
    //         const fieldData = form.getFieldValue(valuesObj2[key]);
    //         valuesCopy2[key] = fieldData
    //       }
    //     }
    //   const stringifiedJSON = JSON.stringify(valuesCopy2);
    //   const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
    //   getdraftData(fie.lineData.apiBuiler.id,jsonToSend)
    // }
  };

  const fetchLines = (fiel) => {
    if (fiel.lineData != null) {
      const valuesObj2 = fiel.lineData.apiBuiler.params
      let valuesCopy2 = { ...valuesObj2 }
      for (const key in valuesObj2) {
        if (valuesObj2.hasOwnProperty(key) && valuesObj2[key]) {
          const fieldData = form.getFieldValue(valuesObj2[key]);
          valuesCopy2[key] = fieldData
        }
      }
      const stringifiedJSON = JSON.stringify(valuesCopy2);
      const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
      if (jsonToSend !== "{}") {
        getdraftData(fiel.lineData.apiBuiler.id, jsonToSend)
      }
    }
  }

  const handleListChange = (fie, value, option) => {
    setSelectedOption((prevState) => ({
      ...prevState,
      [fie.name]: { recordId: value, name: option.children },
    }));
  }


  return (
    <Fragment>
      {(() => {
        switch (field.type) {
          case "selector":
            return (
              <Form.Item
                style={{ marginBottom: '8px' }}
                label={<span style={{ fontWeight: 400, fontSize: 13, fontFamily: "Inter", opacity: 0.6 }}>{field.title}</span>}
                name={field.name}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    message: `Please select ${field.title}`,
                  },
                ]}
              >
                <Select
                  showSearch
                  onFocus={getSelectorData}
                  optionFilterProp="children"
                  allowClear={true}
                  disabled={field.isreadonly === "Y" ? true : false}
                  onChange={(value, option) => handleDropdownChange(field, value, option)}
                >
                  {optionsForSelector.map((option, index) => (
                    <Option key={`${index}-${option.name}`} value={option.recordid}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          case "List":
            return (
              <Form.Item
                style={{ marginBottom: '8px' }}
                label={<span style={{ fontWeight: 400, fontSize: 13, fontFamily: "Inter", opacity: 0.6 }}>{field.title}</span>}
                name={field.name}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    message: `Please select ${field.title}`,
                  },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  allowClear={true}
                  disabled={field.isreadonly === "Y" ? true : false}
                  onChange={(value, option) => handleListChange(field, value, option)}
                >
                  {field?.ListOptions.map((option, index) => (
                    <Option key={`${index}-${option.name}`} value={option.value}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )
          case "string":
            return (
              <Form.Item
                style={{ marginBottom: '8px' }}
                label={<span style={{ fontWeight: 400, fontSize: 13, fontFamily: "Inter", opacity: 0.6 }}>{field.title}</span>}
                name={field.name}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    message: `Please input ${field.title}`,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            )
          case "date":
            return (
              <Form.Item
                style={{ marginBottom: '8px' }}
                label={<span style={{ fontWeight: 400, fontSize: 13, fontFamily: "Inter", opacity: 0.6 }}>{field.title}</span>}
                name={field.name}
                initialValue={moment()}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    message: `Please select ${field.title}`,
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} format={dateFormat} />
              </Form.Item>
            )
          case "button":
            return (
              <Button
                id={
                  history.location.pathname === '/others/window/7363'
                    ? field.title === "Fetch"
                      ? 'step7'
                      : ''
                    : history.location.pathname === '/others/window/7424'
                      ? field.title === "Fetch"
                        ? 'step7'
                        : ''
                      : history.location.pathname === '/others/window/7532'
                        ? field.title === "Fetch"
                          ? 'step7'
                          : ''
                        : history.location.pathname === '/others/window/7531'
                          ? field.title === "Fetch"
                            ? 'step6'
                            : ''
                          : history.location.pathname === '/others/window/7296'
                            ? field.title === "Fetch"
                              ? 'step6'
                              : ''
                            : history.location.pathname === '/others/window/7295'
                              ? field.title === "Fetch"
                                ? 'step6'
                                : ''
                              : ''

                }
                disabled={selectedHistoryRecord.status === "CO"} onClick={() => fetchLines(field)} style={{ marginTop: '27px', borderRadius: '4px' }} type="primary" size="small">{field.title}</Button>
            )
        }
      })()}
    </Fragment>
  )
}


export default FormField