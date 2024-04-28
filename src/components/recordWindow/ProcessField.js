/* eslint-disable */
import React, { useState, Fragment, useEffect } from "react";
import { Form, Input, Select, Checkbox } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getsearchFieldData, getAutoCompleteData, getProcessParamComboFill, getProcessFormData } from "../../services/generic";
import { DatePicker, TimePicker } from "../../lib/date";
import { FieldReference } from "../../lib/fieldReference";
import { useGlobalContext } from "../../lib/storage";
import useDebounce from "../../lib/hooks/useDebounce";
import dayjs from "dayjs";
import { useParams } from "react-router";
import ReactQuill from "react-quill";
import ThemeJson from "../../constants/UIServer.json"
import "react-quill/dist/quill.snow.css";
import "antd/dist/antd.css";
import "../../styles/antd.css";

const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const { Option } = Select;
const { TextArea, Password } = Input;

const ProcessField = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const { recordId } = useParams();
  const userPreferences = globalStore.userPreferences;
  const { windowId,field, fieldData, form, headerTabId, dataOptions, setDataOptions, jsonParam } = props;

  const getFieldValue = () => {
    const fieldValueIden = fieldData[field.ad_field_id.concat("_iden")];
    if (fieldValueIden) {
      return fieldValueIden;
    } else {
      return fieldData[field.ad_field_id];
    }
  };

  let initialOptionsValue = [];
  if (getFieldValue()) {
    initialOptionsValue = [{ RecordID: fieldData[field.ad_field_id], Name: getFieldValue() }];
  }

  let initialOptionsValueForSelector = [];
  if (getFieldValue()) {
    initialOptionsValueForSelector = [{ recordid: fieldData[field.ad_field_id], name: getFieldValue() }];
  }

  const [options, setOptions] = useState(initialOptionsValueForSelector);
  const [optionsForSelector, setOptionsForSelector] = useState(initialOptionsValueForSelector);

  useEffect(() => {
    setOptions([...initialOptionsValue]);
    setOptionsForSelector([...initialOptionsValueForSelector]);
  }, [fieldData]);

  const [searchKey, setSearchkey] = useState();
  const debouncedSearchKey = useDebounce(searchKey, 350);

  useEffect(() => {
    if (debouncedSearchKey) {
      //if (parseInt(debouncedSearchKey.toString().length) > parseFloat(field.ajax_search)) {
      const dependent = field.dependent ? form.getFieldValue(field.dependent) : null;
      getsearchFieldData(windowId,headerTabId,field.ad_field_id, debouncedSearchKey, dependent, jsonParam).then((serchDataResponse) => {
        const searchData = JSON.parse(serchDataResponse.data.data.searchField).searchData;
        setOptions(searchData);
      });
      //}
    }
  }, [debouncedSearchKey]);

  const onSearch = (searchText) => {
    setSearchkey(searchText);
  };

  const onSearchForSelector = (searchText) => {
    const searchTextValue = searchText.target.value;
    if (searchTextValue) {
      getProcessParamComboFill(field.nt_process_id,field.parameter_id, searchTextValue,recordId).then((serchDataResponse) => {
        const searchData = JSON.parse(serchDataResponse.data.data.processParamComboFill);
        setOptionsForSelector(searchData);
      });
    }
  };

  const focusSearchForSelector = (searchText) => {
    // console.log("=====",recordId,)
    if (searchText.target.value === "") {
      getProcessParamComboFill(field.nt_process_id,field.parameter_id,searchText.target.value,recordId).then((serchDataResponse) => {
        const searchData = JSON.parse(serchDataResponse.data.data.processParamComboFill);
        setOptionsForSelector(searchData);
      });
    }
  };

  const focusSearch = (searchText) => {
    if (searchText.target.value === "") {
      const dependent = field.dependent ? form.getFieldValue(field.dependent) : null;
      getsearchFieldData(field.ad_field_id, searchText.target.value, dependent, jsonParam).then((searchDataResponse) => {
        const searchResponseData = JSON.parse(searchDataResponse.data.data.searchField);
        if (searchResponseData) {
          const searchData = searchResponseData.searchData;
          setOptions(searchData);
        }
      });
    }
  };

  const checkAutoComplete = (value) => {
    if (field.enableautoload === "Y") {
      const fieldsForAutoCompleteData = form.getFieldsValue(true);
      const fieldsForAutoComplete = { ...fieldsForAutoCompleteData };
      Object.entries(fieldsForAutoComplete).map(([key, val]) => {
        let keyValueField = val;

        if (keyValueField === true) {
          keyValueField = "Y";
        }
        if (keyValueField === false) {
          keyValueField = "N";
        }
        if (typeof keyValueField === "number") {
          keyValueField = `${value}`;
        }
        if (dayjs.isDayjs(keyValueField)) {
          keyValueField = `${keyValueField.format("YYYY-MM-DD HH:mm:ss")}`;
        }
        if (keyValueField === "") {
          keyValueField = null;
        }
        if (keyValueField === undefined) {
          keyValueField = null;
        }
        fieldsForAutoComplete[key] = keyValueField;
        return null;
      });

      const stringifiedFields = JSON.stringify(fieldsForAutoComplete);
      const updatedStrings = stringifiedFields.replace(/\\"/g, '\\"');
      const allFieldsData = JSON.stringify(updatedStrings);

      getProcessFormData(field.nt_process_id, recordId, allFieldsData).then((autoCompleteData) => {
        if (autoCompleteData !== null) {
          // setDataOptions(autoCompleteData);
          const newData = JSON.parse(autoCompleteData.data.data.getProcessFormData);
          props.setProcessParamsData({...fieldData, ...newData });
        }
        //setLoading(false);
      });
    }
  };

  useEffect(() => {
    if (dataOptions !== undefined) {
      Object.entries(dataOptions).map(([dataKey, dataValue]) => {
        if (dataKey === field.column_name) {
          const dataValueData = dataValue.value;
          const fieldsToUpdate = {};
          if (dataValueData) {
            setOptions(dataValueData);
            fieldsToUpdate[field.column_name] = dataValueData[0].RecordID ? dataValueData[0].RecordID : dataValueData;
          } else {
            setOptions([]);
            fieldsToUpdate[field.column_name] = null;
          }
          form.setFieldsValue(fieldsToUpdate);
        }
        return null;
      });
    }
  }, [dataOptions]);

  const formatJson = (e) => {
    let prettyJson = e.target.value;
    try {
      prettyJson = JSON.stringify(JSON.parse(e.target.value), null, 4);
    } catch (err) {
      prettyJson = e.target.value;
    }
    const fieldsToUpdate = {};
    fieldsToUpdate[field.ad_field_id] = prettyJson;
    form.setFieldsValue(fieldsToUpdate);
  };

  const [fieldInput, setFieldInput] = useState();
  const fieldInputKey = useDebounce(fieldInput, 350);

  useEffect(() => {
    if (fieldInputKey) {
      checkAutoComplete(fieldInputKey);
    }
  }, [fieldInputKey]);

  const checkAutoFillData = (e) => {
    if (field.enableautocomplete === "Y") {
      setFieldInput(e.target.value);
    }
  };

  const getTimePeriod = () => {
    const dateValue = getFieldValue();
    const valueDate = dateValue ? dayjs(dateValue) : null;
    return valueDate;
  };

  const openAddNewRecordPopup = () => {
    window.open(`/popupWindow/${field.new_record_window}/NEW_RECORD`, "New Record Window", "width=1200,height=600,left=210,top=120");
  };

  const getFieldName = () => {
    if (field.column_name) {
      return field.column_name;
    } else {
      return field.field_name;
    }
  };

  const getDisplayName = () => {
    if (field.display_name) {
      return field.display_name;
    } else {
      return field.name;
    }
  };

  return (
    <Fragment>
      {(() => {
        switch (field.type) {
          case "String":
            return (
              <Form.Item
                label={getDisplayName()}
                name={getFieldName()}
                initialValue={getFieldValue()}
                rules={[
                  {
                    required: field.mandatory === "Y" ? true : false,
                    message: `Please input ${getDisplayName()}`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <Input /* onChange={checkAutoFillData} */ disabled={field.isreadonly === "Y" ? true : false} />
              </Form.Item>
            );
          case "TableDir":
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={fieldData[field.ad_field_id]}
                rules={[
                  {
                    required: field.mandatory === "Y" ? true : false,
                    message: `Please input ${field.name}`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  onSearch={onSearch}
                  onFocus={focusSearch}
                  onChange={checkAutoComplete}
                  onClear={checkAutoComplete}
                  optionFilterProp="children"
                  allowClear={true}
                  disabled={field.isreadonly === "Y" ? true : false}
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      {field.create_new_record === "Y" && field.new_record_window ? (
                        <div onClick={openAddNewRecordPopup} style={{ padding: "4px", borderTop: "1px solid #e6e6e6", textAlign: "center", cursor: "pointer" }}>
                          <PlusOutlined /> Add New {field.name}
                        </div>
                      ) : null}
                    </div>
                  )}
                >
                  {options.map((option, index) => (
                    <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                      {option.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          case "Selector":
            return (
              <Form.Item
              label={getDisplayName()}
              name={getFieldName()}
              initialValue={fieldData[field.ad_field_id]}
              rules={[
                {
                  required: field.mandatory === "Y" ? true : false,
                  message: `Please input ${field.name}`,
                },
              ]}
            >
              <Select
                showSearch
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.SelectTag}
                onInputKeyDown={onSearchForSelector}
                onClick={focusSearchForSelector} // Change onFocus to onClick
                onChange={checkAutoComplete}
                optionFilterProp="children"
                allowClear={true}
                disabled={field.isreadonly === "Y" ? true : false}
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
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue()}
                rules={[
                  {
                    required: field.mandatory === "Y" ? true : false,
                    message: `Please input ${field.name}`,
                  },
                ]}
              >
                <Select
                  disabled={field.isreadonly === "Y" ? true : false}
                  showSearch
                  style={{ width: "100%", marginBottom: "0px" }}
                  placeholder={`Select ${field.name}`}
                  onChange={checkAutoComplete}
                  onClear={checkAutoComplete}
                  optionFilterProp="children"
                >
                  {field.Values.map((option, index) => (
                    <Option key={`${index}-${option.value}`} value={option.key}>
                      {option.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          case "Flag":
            return (
              <Fragment>
                <Form.Item
                  style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
                  label={getDisplayName()}
                  name={getFieldName()}
                  initialValue={getFieldValue() === "Y" ? true : false}
                  valuePropName="checked"
                >
                  <Checkbox disabled={field.isreadonly === "Y" ? true : false} />
                </Form.Item>
              </Fragment>
            );
          case "Integer":
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue() ? parseFloat(getFieldValue()) : null}
                rules={[
                  {
                    required: field.mandatory === "Y" ? true : false,
                    validator: async (_, value) => {
                      try {
                        if (value) {
                          const intValue = value.toString();
                          if (!(intValue.indexOf(".") === -1 && intValue.length <= parseInt(field.displaylength))) {
                            throw new Error("Invalid Format");
                          }
                          if (isNaN(value)) {
                            throw new Error("Not a Number");
                          }
                        }
                      } catch (error) {
                        return Promise.reject(new Error("Invalid Integer"));
                      }
                    },
                    message: `Please input proper ${field.name} value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <Input onChange={checkAutoFillData} disabled={field.isreadonly === "Y" ? true : false} />
              </Form.Item>
            );
          case "Number":
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue() ? parseFloat(getFieldValue()) : null}
                rules={[
                  {
                    required: field.mandatory === "Y" ? true : false,
                    validator: async (_, value) => {
                      if (value) {
                        try {
                          if (isNaN(value)) {
                            throw new Error("Not a Number");
                          }
                        } catch (error) {
                          return Promise.reject(new Error("Invalid Integer"));
                        }
                      }
                    },
                    message: `Please input ${field.name} with proper value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <Input onChange={checkAutoFillData} disabled={field.isreadonly === "Y" ? true : false} />
              </Form.Item>
            );
          case FieldReference.ID:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue() ? getFieldValue() : null}
                rules={[
                  {
                    required: field.mandatory === "Y" ? true : false,
                    message: `Please input ${field.name}`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <Input disabled={field.isreadonly === "Y" ? true : false} />
              </Form.Item>
            );
          case FieldReference.DateTime:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getTimePeriod()}
                rules={[
                  {
                    required: field.mandatory === "Y" ? true : false,
                    message: `Please input ${field.name} with proper value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <DatePicker style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.SelectTag} showTime={true} format={userPreferences.dateTimeFormat} />
              </Form.Item>
            );
          case "Date":
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getTimePeriod()}
                rules={[
                  {
                    required: field.mandatory === "Y" ? true : false,
                    message: `Please input ${field.name} with proper value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <DatePicker
                  disabled={field.isreadonly === "Y" ? true : false}
                  style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.SelectTag}
                  format={"DD-MM-YYYY"}
                />
              </Form.Item>
            );
          case FieldReference.Time:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getTimePeriod()}
                rules={[
                  {
                    required: field.mandatory === "Y" ? true : false,
                    message: `Please input ${field.name} with proper value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <TimePicker disabled={field.isreadonly === "Y" ? true : false} use12Hours={true} style={{ width: "100%" }} format={userPreferences.timeFormat} />
              </Form.Item>
            );
          case "Text":
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue() ? getFieldValue() : null}
                rules={[
                  {
                    required: field.mandatory === "Y" ? true : false,
                    message: `Please input ${field.name} with proper value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <TextArea disabled={field.isreadonly === "Y" ? true : false} autoSize={{ minRows: 1, maxRows: 6 }} />
              </Form.Item>
            );
          case FieldReference.Password:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue() ? getFieldValue() : null}
                rules={[
                  {
                    required: field.mandatory === "Y" ? true : false,
                    message: `Please input ${field.name} with proper value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <Password disabled={field.isreadonly === "Y" ? true : false} />
              </Form.Item>
            );
          case FieldReference.JSON:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue() ? getFieldValue() : null}
                rules={[
                  {
                    required: field.mandatory === "Y" ? true : false,
                    validator: async (_, value) => {
                      if (value) {
                        try {
                          JSON.stringify(value);
                        } catch (error) {
                          return Promise.reject(new Error("Invalid JSON"));
                        }
                      }
                    },
                    message: `Invalid ${field.name} Value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <TextArea disabled={field.isreadonly === "Y" ? true : false} autoSize={{ minRows: 1, maxRows: 6 }} onChange={formatJson} />
              </Form.Item>
            );
          case FieldReference.WYSIWYGEditor:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue() ? getFieldValue() : null}
                rules={[
                  {
                    required: field.mandatory === "Y" ? true : false,
                    message: `Please input ${field.name} with proper value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <ReactQuill
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ font: [false, "serif", "monospace"] }, { header: [1, 2, 3, 4, 5, 6, false] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                      [{ align: [] }],
                      ["code", "background"],
                      ["code-block", "direction"],
                      ["link", "image", "video"],
                      ["clean"],
                    ],
                  }}
                  disabled={field.isreadonly === "Y" ? true : false}
                />
              </Form.Item>
            );

          default:
            return (
              <Form.Item
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue()}
              >
                <Input readOnly={true} />
              </Form.Item>
            );
        }
      })()}
    </Fragment>
  );
};

export default ProcessField;
