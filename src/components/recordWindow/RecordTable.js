import React, { useState, useEffect, useContext, useRef } from "react";
import { Form, Table, Input, Select, Checkbox, InputNumber } from "antd";
import { DatePicker } from "../../lib/date";
import {getProcessParamComboFillField} from "../../services/generic";
import dayjs from "dayjs";
import { Resizable } from "react-resizable";

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


const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
const EditableContext = React.createContext(null);
const { Option } = Select;

const RecordTable = (props) => {
  const { dataSource, columns, selectedRecordsData, setSelectedRecordsData } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectRowChange = (selectedRowKeys) => {
    setSelectedRowKeys([...selectedRowKeys]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectRowChange,
  };

  useEffect(() => {
    if (dataSource.length > 0) {
      const selRecords = { ...selectedRecordsData };
      selRecords[dataSource[0].tableName] = [...selectedRowKeys];
      setSelectedRecordsData({ ...selRecords });
    }
  }, [selectedRowKeys]);

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  
  const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, colData, rowIndex, ...restProps }) => {
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    const toggleEdit = () => {
      form.setFieldsValue({
        [dataIndex]: record[dataIndex] ? record[dataIndex] : "",
      });
      if (selectedRowKeys.findIndex((op) => `${rowIndex}` === `${op}`) < 0) {
        setSelectedRowKeys([...selectedRowKeys, `${rowIndex}`]);
      }
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.error("Save failed:", errInfo);
      }
    };

    let childNode = children;
    let actualValue = 0;
    if (dataIndex) {
      actualValue = record[dataIndex] ? `${record[dataIndex]}`: "";
    }

    const getTimePeriod = () => {
      const dateValue = actualValue;
      const valueDate = dateValue ? dayjs(dateValue) : null;
      return valueDate;
    };

    const [optionMenu, setOptionMenu] = useState(colData ? [ { recordid: record[colData?.field_name], name: record[`${colData?.field_name}_iden`] } ]: []);
    const getOptionsMenuData = () => {
      if (optionMenu.length === 1) {
        getProcessParamComboFillField(colData.nt_process_id,colData.field_id).then((res) => {
          setOptionMenu([...JSON.parse(res.data.data.processParamComboFill)]);
        });
      }
    };

    const saveOption = (_,opt) => {
      record[colData.field_name] = opt.value;
      record[`${colData.field_name}_iden`] = opt.children;

      setOptionMenu([{
        recordid: opt.value,
        name: opt.children
      }]);
      save();
    }

    const getField = () => {
      switch (colData.type) {
        case "Date":
          return (
            <Form.Item
              style={{
                margin: 0,
              }}
              initialValue={getTimePeriod()}
              name={dataIndex}
              rules={[
                {
                  required: colData.mandatory === "Y" ? true : false,
                  message: `${title} is required.`,
                },
              ]}
            >
              <DatePicker ref={inputRef} onBlur={save} format="DD-MM-YYYY" />
            </Form.Item>
          );
        case "Flag":
          return (
            <Form.Item
              style={{
                margin: 0,
              }}
              initialValue={actualValue === "Y" ? true : false}
              name={dataIndex}
              rules={[
                {
                  required: colData.mandatory === "Y" ? true : false,
                  message: `${title} is required.`,
                },
              ]}
            >
              <Checkbox
                checked={actualValue === "Y" ? true : false}
                onChange={(e) => {
                  const newValue = e.target.checked ? "Y" : "N";
                  form.setFieldsValue({ [dataIndex]: newValue });
                  if (selectedRowKeys.findIndex((op) => `${rowIndex}` === `${op}`) < 0) {
                    setSelectedRowKeys([...selectedRowKeys, `${rowIndex}`]);
                  }
                  handleSave({ ...record, [dataIndex]: newValue });
                }}
              />
            </Form.Item>
          );
        case "Number":
          return (
            <Form.Item
              style={{
                margin: 0,
              }}
              initialValue={actualValue}
              name={dataIndex}
              rules={[
                {
                  required: colData.mandatory === "Y" ? true : false,
                  message: `${title} is required.`,
                },
              ]}
            >
              <InputNumber controls={false} ref={inputRef} onBlur={save} />
            </Form.Item>
          );
        case "Integer":
          return (
            <Form.Item
              style={{
                margin: 0,
              }}
              initialValue={actualValue}
              name={dataIndex}
              rules={[
                {
                  required: colData.mandatory === "Y" ? true : false,
                  message: `${title} is required.`,
                },
              ]}
            >
              <InputNumber controls={false} ref={inputRef} onBlur={save} />
            </Form.Item>
          );
        case "Selector":
          return (
            <Form.Item
              style={{
                margin: 0,
              }}
              initialValue={actualValue}
              name={dataIndex}
              rules={[
                {
                  required: colData.mandatory === "Y" ? true : false,
                  message: `${title} is required.`,
                },
              ]}
            >
              <Select
                disabled={colData.isreadonly === "Y" ? true : false}
                style={{ width: "100%", marginBottom: "0px" }}
                placeholder={`Select`}
                optionFilterProp="children"
                onFocus={getOptionsMenuData}
                onSelect={saveOption}
              >
                {optionMenu.map((option, index) => (
                  <Option key={`${option.recordid}-${index}`} value={option.recordid}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          );
        default:
          return (
            <Form.Item
              style={{
                margin: 0,
              }}
              initialValue={actualValue}
              name={dataIndex}
              rules={[
                {
                  required: colData.mandatory === "Y" ? true : false,
                  message: `${title} is required.`,
                },
              ]}
            >
              <Input ref={inputRef} onBlur={save} />
            </Form.Item>
          );
      }
    };

    if (editable) {
      childNode = true ? (
        getField()
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={null}
        >
          {children}
        </div>
      );
    }

    return <td>{childNode}</td>;
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
    header: {
      cell: ResizableCell,
    },
  };

  return (
    <Table rowClassName={() => "editable-row"} dataSource={dataSource} columns={columns} components={components} rowSelection={rowSelection} size="small" pagination={false} />
  );
};

export default RecordTable;
