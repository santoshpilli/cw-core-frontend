import React, { Fragment, useEffect, useState } from "react";
import { Input, Form, Table, Checkbox, Select, Collapse, message, notification } from "antd";
import { DatePicker, TimePicker } from "../../lib/date";
import { LoadingOutlined } from "@ant-design/icons";
import { useGlobalContext, useWindowContext } from "../../lib/storage";
import { FieldReference } from "../../lib/fieldReference";
import { useParams } from "react-router-dom";
import ExpandIcon from "../../assets/images/expandIcon.svg";
import trashTab from "../../assets/images/trashTab.svg"
import deleteTab from "../../assets/images/deleteTab.svg"
import Shrink from "../../assets/images/shrinkIcon.svg"
import { getsearchFieldData, upsertTabData, getAutoCompleteData } from "../../services/generic";
import useDebounce from "../../lib/hooks/useDebounce";
import ReactDragListView from "react-drag-listview";
import ThemeJson from "../../constants/UIServer.json"
import Scrollbars from 'react-custom-scrollbars';
import useEventListner from "../../lib/hooks/useEventListner";
import dayjs from "dayjs";
import "antd/dist/antd.css";

const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const { Password } = Input;
const { Option } = Select;
const { Panel } = Collapse;
let handleKeydownEventCount = 0;

const StringField = (props) => {
  const { field, fieldData } = props;
  return (
    <Form.Item
      name={field.ad_field_id}
      initialValue={fieldData[field.ad_field_id]}
      rules={[
        {
          required: field.ismandatory === "Y" ? true : false,
          message: `Please input ${field.name}`,
        },
      ]}
      style={{ margin: "0px" }}
    >
      <Input onChange={null} disabled={field.isreadonly === "Y" ? true : false} />
    </Form.Item>
  );
};

const CheckBoxField = (props) => {
  const { field, fieldData, form } = props;
  const initialValueData = fieldData[field.ad_field_id].trim() === "Y" ? true : false;
  const changeSelection = (e) => {
    form.setFieldsValue({ [field.ad_field_id]: e.target.checked ? "Y" : "N" });
  };

  return (
    <>
      <Form.Item rules={[{ required: field.ismandatory === "Y" ? true : false }]} name={field.ad_field_id} initialValue={fieldData[field.ad_field_id]} hidden={true}>
        <Input />
      </Form.Item>
      <Checkbox onChange={changeSelection} defaultChecked={initialValueData} disabled={field.isreadonly === "Y" ? true : false} />
    </>
  );
};

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

const IntegerField = (props) => {
  const { field, fieldData } = props;
  return (
    <Form.Item
      name={field.ad_field_id}
      initialValue={fieldData[field.ad_field_id]}
      rules={[
        {
          required: field.ismandatory === "Y" ? true : false,
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
      style={{ margin: "0px" }}
    >
      <Input onChange={null} disabled={field.isreadonly === "Y" ? true : false} />
    </Form.Item>
  );
};

const NumberField = (props) => {
  const { field, fieldData } = props;
  return (
    <Form.Item
      name={field.ad_field_id}
      initialValue={fieldData[field.ad_field_id]}
      rules={[
        {
          required: field.ismandatory === "Y" ? true : false,
          validator: async (_, value) => {
            if (value) {
              try {
                const intValue = value.toString();
                if (!(intValue.length <= parseInt(field.displaylength))) {
                  throw new Error("Invalid Format");
                }
                if (isNaN(value)) {
                  throw new Error("Not a Number");
                }
                if (intValue.length < 1) {
                  throw new Error("Input Value");
                }
              } catch (error) {
                return Promise.reject(new Error("Invalid Integer"));
              }
            }
          },
          message: `Please input ${field.name} with proper value`,
        },
      ]}
      style={{ margin: "0px" }}
    >
      <Input onChange={null} disabled={field.isreadonly === "Y" ? true : false} />
    </Form.Item>
  );
};

const DateTimeField = (props) => {
  const { field, fieldData, form } = props;
  const { globalStore } = useGlobalContext();
  const defaultValueDate = fieldData[field.ad_field_id] ? dayjs(fieldData[field.ad_field_id]) : null;

  const changeDate = (value) => {
    let fieldDate = value;
    if (value) {
      fieldDate = `${value.format("YYYY-MM-DD HH:mm:ss")}`;
    }
    form.setFieldsValue({ [field.ad_field_id]: fieldDate });
  };

  return (
    <>
      <Form.Item rules={[{ required: field.ismandatory === "Y" ? true : false }]} name={field.ad_field_id} initialValue={fieldData[field.ad_field_id]} hidden={true}>
        <Input />
      </Form.Item>
      <DatePicker
        showTime={true}
        defaultValue={defaultValueDate}
        onChange={changeDate}
        format={globalStore.userPreferences.dateTimeFormat}
        disabled={field.isreadonly === "Y" ? true : false}
        style={ThemeJson.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.SelectTag}
      />
    </>
  );
};

const DateField = (props) => {
  const { field, fieldData, form } = props;
  const { globalStore } = useGlobalContext();
  const defaultValueDate = fieldData[field.ad_field_id] ? dayjs(fieldData[field.ad_field_id]) : null;
  const changeDate = (value) => {
    let fieldDate = value;
    if (value) {
      fieldDate = `${value.format("YYYY-MM-DD HH:mm:ss")}`;
    }
    form.setFieldsValue({ [field.ad_field_id]: fieldDate });
  };

  return (
    <>
      <Form.Item rules={[{ required: field.ismandatory === "Y" ? true : false }]} name={field.ad_field_id} initialValue={fieldData[field.ad_field_id]} hidden={true}>
        <Input />
      </Form.Item>
      <DatePicker
        defaultValue={defaultValueDate}
        onChange={changeDate}
        disabled={field.isreadonly === "Y" ? true : false}
        format={globalStore.userPreferences.dateFormat}
        style={ThemeJson.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.SelectTag}
      />
    </>
  );
};

const TimeField = (props) => {
  const { field, fieldData, form } = props;
  const { globalStore } = useGlobalContext();
  const changeTime = (value) => {
    let fieldTime = value;
    if (value) {
      fieldTime = `${value.format("YYYY-MM-DD HH:mm:ss")}`;
    }
    form.setFieldsValue({ [field.ad_field_id]: fieldTime });
  };
  const defaultValueTime = fieldData[field.ad_field_id] ? dayjs(fieldData[field.ad_field_id]) : null;
  return (
    <>
      <Form.Item rules={[{ required: field.ismandatory === "Y" ? true : false }]} name={field.ad_field_id} initialValue={fieldData[field.ad_field_id]} hidden={true}>
        <Input />
      </Form.Item>
      <TimePicker
        onChange={changeTime}
        defaultValue={defaultValueTime}
        disabled={field.isreadonly === "Y" ? true : false}
        use12Hours={true}
        style={{ width: "100%" }}
        format={globalStore.userPreferences.timeFormat}
      />
    </>
  );
};

const PasswordField = (props) => {
  const { field, fieldData } = props;
  return (
    <Form.Item
      name={field.ad_field_id}
      initialValue={fieldData[field.ad_field_id]}
      rules={[
        {
          required: field.ismandatory === "Y" ? true : false,
          message: `Please input ${field.name} with proper value`,
        },
      ]}
      style={{ margin: "0px" }}
    >
      <Password disabled={field.isreadonly === "Y" ? true : false} />
    </Form.Item>
  );
};

const ListField = (props) => {
  const { field, fieldData } = props;
  return (
    <Form.Item
      name={field.ad_field_id}
      initialValue={fieldData[field.ad_field_id]}
      rules={[
        {
          required: field.ismandatory === "Y" ? true : false,
          message: `Please input ${field.name}`,
        },
      ]}
    >
      <Select
        disabled={field.isreadonly === "Y" ? true : false}
        showSearch
        style={{ width: "100%", margin: "0px" }}
        placeholder={`Select ${field.name}`}
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
};

const TableDirField = (props) => {
  const { field, fieldData, form, tabId, optionSets, setOptionSets } = props;
  const { recordId } = useParams();
  const [searchKey, setSearchkey] = useState();
  const [options, setOptions] = useState([{ RecordID: fieldData[field.ad_field_id], Name: fieldData[`${field.ad_field_id}_iden`] }]);
  const debouncedSearchKey = useDebounce(searchKey, 350);
  const { windowStore } = useWindowContext();
  const windowDefinition = { ...windowStore.windowDefinition };
  useEffect(() => {
    if (optionSets) {
      if (optionSets[field.ad_field_id]) {
        setOptions([...optionSets[field.ad_field_id]]);
      }
    }
  }, [optionSets]);

  useEffect(() => {
    const headerTabData = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === "0")];
    const headerTabId = headerTabData.ad_tab_id;
    if (debouncedSearchKey) {
      if (parseInt(debouncedSearchKey.toString().length) > parseFloat(field.ajax_search)) {
        const dependent = field.dependent ? form.getFieldValue(field.dependent) : null;
        getsearchFieldData(windowDefinition.ad_window_id,headerTabId,field.ad_field_id, debouncedSearchKey, dependent).then((serchDataResponse) => {
          const searchData = JSON.parse(serchDataResponse.data.data.searchField).searchData;
          setOptions(searchData);
        });
      }
    }
  }, [debouncedSearchKey]);

  const onSearch = (searchText) => {
    setSearchkey(searchText);
  };

  const focusSearch = (searchText) => {
    const headerTabData = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === "0")];
    const headerTabId = headerTabData.ad_tab_id;
    if (searchText.target.value === "") {
      const dependent = field.dependent ? form.getFieldValue(field.dependent) : null;
      getsearchFieldData(windowDefinition.ad_window_id,headerTabId,field.ad_field_id, searchText.target.value, dependent).then((searchDataResponse) => {
        const searchResponseData = JSON.parse(searchDataResponse.data.data.searchField);
        if (searchResponseData) {
          const searchData = searchResponseData.searchData;
          setOptions(searchData);
        }
      });
    }
  };

  const checkAutoComplete = async (value) => {
    if (field.enableautocomplete === "Y") {
      await form.setFieldsValue({ [field.ad_field_id]: value });
      const fieldsForAutoCompleteData = form.getFieldsValue(true);
      const fieldsForAutoComplete = { ...fieldsForAutoCompleteData };
      const stringifiedFields = JSON.stringify(fieldsForAutoComplete);
      const updatedStrings = stringifiedFields.replace(/\\"/g, '\\"');
      const allFieldsData = JSON.stringify(updatedStrings);
      getAutoCompleteData(windowDefinition.ad_window_id,field.ad_field_id, value, tabId, recordId, allFieldsData).then((autoCompleteData) => {
        if (autoCompleteData !== null) {
          if (autoCompleteData !== undefined) {
            const fieldsToUpdate = {};
            const fieldOptons = {};
            Object.entries(autoCompleteData).map(([dataKey, dataValue]) => {
              fieldsToUpdate[dataKey] = Array.isArray(dataValue.value) ? dataValue.value[0].RecordID : dataValue.value;
              form.setFieldsValue(fieldsToUpdate);
              if (Array.isArray(dataValue.value)) {
                fieldOptons[dataKey] = dataValue.value;
              }
              return null;
            });
            setOptionSets({ ...fieldOptons });
          }
        }
      });
    }
  };

  return (
    <Form.Item
      name={field.ad_field_id}
      initialValue={fieldData[field.ad_field_id]}
      rules={[
        {
          required: field.ismandatory === "Y" ? true : false,
          message: `Please input ${field.name}`,
        },
      ]}
      style={{ margin: "0px" }}
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
        filterOption={false}
        disabled={field.isreadonly === "Y" ? true : false}
        dropdownRender={(menu) => <div>{menu}</div>}
      >
        {options.map((option, index) => (
          <Option key={`${index}-${option.Name}`} value={option.RecordID}>
            {option.Name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

const DefaultField = (props) => {
  const { field, fieldData } = props;
  return (
    <Form.Item name={field.ad_field_id} initialValue={fieldData[field.ad_field_id]} style={{ margin: "0px" }}>
      <Input disabled={true} />
    </Form.Item>
  );
};

const FieldCell = (props) => {
  const { field } = props;
  return (
    <Fragment>
      {(() => {
        switch (field.nt_base_reference_id) {
          case FieldReference.String:
            return <StringField {...props} />;
          case FieldReference.YesNo:
            return <CheckBoxField {...props} />;
          case FieldReference.Integer:
            return <IntegerField {...props} />;
          case FieldReference.Number:
            return <NumberField {...props} />;
          case FieldReference.DateTime:
            return <DateTimeField {...props} />;
          case FieldReference.Time:
            return <TimeField {...props} />;
          case FieldReference.Date:
            return <DateField {...props} />;
          case FieldReference.Password:
            return <PasswordField {...props} />;
          case FieldReference.List:
            return <ListField {...props} />;
          case FieldReference.TableDir:
            return <TableDirField {...props} />;
          default:
            return <DefaultField {...props} />;
        }
      })()}
    </Fragment>
  );
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  columnField,
  dataIndexWithoutIdn,
  formTable,
  tabId,
  editingRecordId,
  optionSets,
  setOptionSets,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <FieldCell field={columnField} fieldData={record} form={formTable} tabId={tabId} editingRecordId={editingRecordId} setOptionSets={setOptionSets} optionSets={optionSets} />
      ) : (
        children
      )}
    </td>
  );
};

const FormTable = (props) => {
  const {
    dragProps,
    rowSelection,
    components,
    loading,
    tabRecordsData,
    columns,
    setSelectedRowKeys,
    selectRecord,
    tabData,
    expandedRowRender,
    handleExpand,
    handleTableChange,
    summary,
    headerRecordData,
    parentTabRecordData,
    setTabLastRefreshed,
    toggleNewRecordEdit,
    editRecord,
    deleteTabRecordValue,
    setLoading,
    setSearchInput
  } = props;

  const [formTable] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [editingRecordId, setEditingRecordId] = useState("");
  const [jsonParam, setJsonParam] = useState({});
  const [tabRecords, setTabRecords] = useState([]);

  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const { windowStore } = useWindowContext();
  const windowDefinition = { ...windowStore.windowDefinition };

  useEffect(() => {
    setTabRecords([...tabRecordsData]);
  }, [tabRecordsData]);

  useEffect(() => {
    const localWindowDefinition = { ...windowDefinition };
    const masterParentTabDataIndex = localWindowDefinition.tabs.findIndex((tab) => tab.tablevel === "0");
    //const headerTabData = localWindowDefinition.tabs[localWindowDefinition.tabs.findIndex((tab) => tab.name === tabName)];
    const localIndex = localWindowDefinition.tabs.findIndex((tab) => tab.ad_tab_id === tabData.parent_tab_id);
    const parentTab = localWindowDefinition.tabs[localIndex];
    //const parentTabId = parentTab.ad_tab_id;

    let sessionValues = {};
    parentTab.fields.map((field) => {
      if (field.issession === "Y") {
        if (parentTab.tablevel === "0") {
          sessionValues[field.column_name] = headerRecordData[field.ad_field_id];
        } else {
          sessionValues[field.column_name] = parentTabRecordData[field.ad_field_id];
        }
      }
      return null;
    });
    if (parentTab.tablevel !== "0") {
      localWindowDefinition.tabs[masterParentTabDataIndex].fields.map((field) => {
        if (field.issession === "Y") {
          sessionValues[field.column_name] = headerRecordData[field.ad_field_id];
        }
        return null;
      });
    }
    const stringifiedSession = JSON.stringify(sessionValues);
    const updatedSession = stringifiedSession.replace(/\\"/g, '\\"');
    const stringRequest = JSON.stringify(updatedSession);
    setJsonParam(stringRequest);
  }, []);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    if (tabData.tab_view_type === "Table") {
      formTable.setFieldsValue({
        ...record,
      });
      setEditingKey(record.key);
      setEditingRecordId(record.recordId);
    } else {
      editRecord(null, record);
    }
  };

  useEffect(() => {
    if (toggleNewRecordEdit) {
      const trdi = tabRecords.findIndex((ti) => ti.recordId === "NEW_RECORD");
      if (trdi >= 0) {
        const recordData = tabRecords[trdi];
        formTable.setFieldsValue({
          ...recordData,
        });
        setEditingKey(recordData.key);
        setEditingRecordId(recordData.recordId);
      }
    }
  }, [toggleNewRecordEdit]);

  const checkConditionalLogic = (logicString) => {
    if (logicString) {
      let string = logicString;
      const keys = logicString.split("@");
      const actualKeys = keys.filter((s) => s.length === 32);
      for (const logicKey of actualKeys) {
        let keyValue = headerRecordData[logicKey];
        if (typeof keyValue === "string" && isNaN(keyValue)) {
          keyValue = `'${keyValue}'`;
        }
        const stringToUpdate = "@" + logicKey + "@";
        string = string.replaceAll(stringToUpdate, keyValue);
      }
      string = string.replaceAll("=", "==");
      string = string.replaceAll("<==", "<=");
      string = string.replaceAll(">==", ">=");
      string = string.replaceAll("&", "&&");
      string = string.replaceAll("|", "||");
      string = string.replaceAll("====", "===");
      string = string.replaceAll("&&&&", "&&");
      string = string.replaceAll("||||", "||");
      let logicStateValid = true;
      try {
        logicStateValid = eval(string); // eslint-disable-line
      } catch (error) {
        console.error("Invalid Display Logic Condition: ", string);
        logicStateValid = false;
      }
      return logicStateValid;
    } else {
      return true;
    }
  };

  const cancel = () => {
    setEditingKey("");
    setEditingRecordId("");
    if (editingRecordId === "NEW_RECORD") {
      setTabLastRefreshed(new Date());
    }
  };

  components.body = {
    cell: EditableCell,
  };

  const [optionSets, setOptionSets] = useState({});

  const columnsUpdated = columns.map((col) => {
    if (!col.editable ) {
      return {
        ...col,
      };
    }

    return {
      ...col,
      onCell: (record) => {
        return {
          record,
          inputType: "random",
          dataIndex: col.dataIndex,
          dataIndexWithoutIdn: col.dataIndexWithoutIdn,
          columnField: tabData.fields[tabData.fields.findIndex((f) => f.ad_field_id === col.dataIndexWithoutIdn)],
          title: col.title,
          editing: isEditing(record),
          formTable: formTable,
          tabId: tabData.ad_tab_id,
          editingRecordId: editingRecordId,
          optionSets: optionSets,
          setOptionSets: setOptionSets,
        };
      },
    };
  });

  const isEditRecord = tabData.editrecord === "Y" && checkConditionalLogic(tabData.editrecord_displaylogic);
  const isDeleteRecord = tabData.deleterecord === "Y" && checkConditionalLogic(tabData.deleterecord_displaylogic);
  
  if (isEditRecord || isDeleteRecord) {
    columnsUpdated.unshift({
      title: "Action",
      dataIndex: "operation",
      width: 70,
      render: (_, record) => {
        const editable = isEditing(record);

        return editable ? (
          <span>
            <i className="fa fa-floppy-o" style={{ color: "#706e6b", fontSize: "16px" }} aria-hidden="true" onClick={() => save(record.key)}></i>
            &emsp;
            <i className="fa fa-ban" style={{ color: "#706e6b", fontSize: "16px" }} aria-hidden="true" onClick={cancel}></i>
          </span>
        ) : (
          <span>
          {isEditRecord ? (
            <img src={trashTab} alt="" disabled={editingKey !== "" ? true : false} onClick={(e) => {edit(record); e.stopPropagation()}}/>
            // <i className="fa fa-trash" style={{ color: "#706e6b" }} disabled={editingKey !== "" ? true : false} aria-hidden="true" onClick={(e) => {edit(record); e.stopPropagation()}}></i>
          ) : null}
          {isEditRecord && isDeleteRecord ? <span style={{ color: "#000000", opacity: "30%" }}>&ensp;&#9474;&ensp;</span> : null}
          {isDeleteRecord ? <img src={deleteTab} alt="" onClick={(e) => {deleteTabRecordValue(e, record); e.stopPropagation(); setSearchInput("")}}/> : null}
        </span>
        );
      },
    });
  }

  const save = async (recordData) => {
    try {
      const values = await formTable.validateFields();

      Object.entries(values).map(([key, value]) => {
        if (value === true) {
          values[key] = "Y";
        }
        if (value === false) {
          values[key] = "N";
        }
        if (typeof value === "string") {
          values[key] = value;
        }
        if (typeof value === "number") {
          values[key] = `${value}`;
        }
        if (dayjs.isDayjs(value)) {
          values[key] = `${value.format("YYYY-MM-DD HH:mm:ss")}`;
        }
        if (value === "") {
          values[key] = null;
        }
        if (value === undefined) {
          values[key] = null;
        }
        return null;
      });

      const activeRecordId = editingRecordId;

      if (activeRecordId === "NEW_RECORD") {
        let headerRecord = [];
        const trdi = tabRecords.findIndex((ti) => ti.recordId === "NEW_RECORD");
        if (trdi >= 0) {
          headerRecord = tabRecords[trdi];
        }
        Object.entries(values).map(() => {
          Object.entries(headerRecord).map(([headerKey, headerValue]) => {
            if (values[headerKey] === undefined) {
              if (headerKey.search("_iden") === -1) {
                values[headerKey] = headerValue;
              }
            }
            return null;
          });
          return null;
        });
        delete values.key;
        delete values.recordId;
      }

      const stringifiedFields = JSON.stringify(values);
      const updatedStrings = stringifiedFields.replace(/\\"/g, '\\"');
      const stringRequest = JSON.stringify(updatedStrings);
      const parentTabId = tabData.parent_tab_id;
      setLoading(true);
      const upsertResponse = await upsertTabData(windowDefinition.ad_window_id,tabData.ad_tab_id, activeRecordId, stringRequest, parentTabId, tabData.recordId);
      setLoading(false);
      if (upsertResponse.data.data.upsertTab.status === "200") {
        message.success(`${upsertResponse.data.data.upsertTab.message}`);
        if (recordData && typeof recordData === "object") {
          const newTabRecords = [...tabRecords];
          const trdi = newTabRecords.findIndex((ti) => ti.recordId === activeRecordId);
          if (trdi >= 0) {
            newTabRecords[trdi] = { ...newTabRecords[trdi], ...values };
          }
          setTabRecords([...newTabRecords]);
          setSelectedRowKeys([recordData.key]);
          edit(recordData);
        } else {
          setEditingKey("");
          setEditingRecordId("");
          setTabLastRefreshed(new Date());
        }
        handleKeydownEventCount = 0;
      } else {
        notification.error({
          message: "Error Processing Operation",
          description: (
            <Collapse ghost>
              <Panel header="Details" key="1">
                {upsertResponse.data.data.upsertTab.message}
              </Panel>
            </Collapse>
          ),
        });
      }
    } catch (errInfo) {
      console.error("Validate Failed:", errInfo);
      message.warning("Fill all the required fields !");
      setLoading(false);
    }
  };

  const handleKeydownEvent = ({ key }) => {
    if (key === "ArrowUp" || (key === "ArrowDown" && editingRecordId !== "NEW_RECORD")) {
      handleKeydownEventCount += 1;
      if (handleKeydownEventCount === 1) {
        const trdi = tabRecords.findIndex((ti) => ti.recordId === editingRecordId);
        if (trdi >= 0) {
          if (key === "ArrowUp") {
            const newKey = trdi - 1;
            if (newKey >= 0) {
              save(tabRecords[newKey]);
            }
          }
          if (key === "ArrowDown") {
            const newKey = trdi + 1;
            if (newKey < tabRecords.length) {
              save(tabRecords[newKey]);
            }
          }
        }
      }
    }
  };

  useEventListner("keydown", handleKeydownEvent);

  return (
    <Form form={formTable} name={"formTable"} component={false}>
      <ReactDragListView.DragColumn {...dragProps}>
      <Scrollbars  style={{
          height: "20em"
        }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        thumbSize={90}
        renderView={renderView}
        renderThumbHorizontal={renderThumb}
        renderThumbVertical={renderThumb}>
        <Table
        className="tabTable"
          style={{fontWeight:500}}
          ellipsis={false}
          size="small"
          // scroll={{ y: "200px" }}
          rowClassName="my-table-row"
          pagination={false}
          loading={{
            spinning: loading,
            indicator: <LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />,
          }}
          rowSelection={rowSelection}
          dataSource={tabRecords}
          columns={columnsUpdated}
          components={components}
          onRow={(record) => ({
            onClick: () => {
              // setSelectedRowKeys([record.key]);
              selectRecord(tabData, record);
            },
          })}
          expandable={tabData.enablenestedtab === "Y" ? {
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <img src={Shrink} style={{cursor:'pointer'}} onClick={(e) => {onExpand(record, e); e.stopPropagation() }} />
              ) : (
                <img src={ExpandIcon} style={{cursor:'pointer'}} onClick={(e) => {onExpand(record, e); e.stopPropagation() }} />
              )
          }:null}
          expandedRowRender={tabData.enablenestedtab === "Y" ? expandedRowRender : null}
          onExpand={tabData.enablenestedtab === "Y" ? handleExpand : null}
          onChange={handleTableChange}
          summary={summary}
        />
        </Scrollbars>
      </ReactDragListView.DragColumn>
    </Form>
  );
};

export default FormTable;
