import { getTabData, getWindowInitializationData } from "../../services/generic";
import { Input, Space, Button, DatePicker, Image } from "antd";
import { FieldReference } from "../../lib/fieldReference";
import dayjs from "dayjs";
import moment from 'moment';
import FilterSelector from "./filterSelector";
import Checkbox from "antd/lib/checkbox/Checkbox";

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';


const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const getDayJsValue = (value, format) => {
  if (value) {
    return dayjs(value,"YYYY-MM-DD HH:mm:ss").format(format);
  } else {
    return value;
  }
};

const userPreferencesData = JSON.parse(localStorage.getItem("userPreferences"));
const formatDisplayField = (value, field, type) => {
  const userPreferences = userPreferencesData ? userPreferencesData : JSON.parse(localStorage.getItem("userPreferences"));
  if (field) {
    if (field.nt_base_reference_id === FieldReference.Date) {
      return getDayJsValue(value, userPreferences.dateFormat);
    } else if (field.nt_base_reference_id === FieldReference.Time) {
      return getDayJsValue(value, userPreferences.timeFormat);
    } else if (field.nt_base_reference_id === FieldReference.DateTime) {
      return getDayJsValue(value, userPreferences.dateTimeFormat);
    } else if (field.nt_base_reference_id === FieldReference.WYSIWYGEditor) {
      if (type === "header") {
        return <div dangerouslySetInnerHTML={{ __html: value }}></div>;
      } else {
        return (
          <div style={{ height: "22px" }}>
            <div dangerouslySetInnerHTML={{ __html: value }}></div>
          </div>
        );
      }
    } else if (field.nt_base_reference_id === FieldReference.Number) {
      const fixedValue = parseInt(userPreferences.decimalPlaces);
      const numberValue = parseFloat(value).toFixed(fixedValue);
      if (!isNaN(numberValue)) {
        return numberValue;
      } else {
        return value;
      }
    } else if (field.nt_base_reference_id === FieldReference.Image && value) {
      return <Image width={200} src={`${value}`} preview={false} />;
    } else if (field.nt_base_reference_id === FieldReference.YesNo) {
      return value === "Y" ? "Yes" : "No";
    } else {
      return value;
    }
  }
};

const getTabColumns = (tab) => {
  const tableColumns = [];
  const cellReferenceList = [];
  const fieldCount = tab.fields.length;
  for (let index = 0; index < fieldCount; index++) {
    const element = tab.fields[index];
    if (element.nt_base_reference_id === FieldReference.List) {
      const ListElements = element.Values;
      if (ListElements) {
        if (ListElements.length >= 0) {
          ListElements.forEach((value) => {
            cellReferenceList.push(value);
          });
        }
      }
    }
    const auditFiledsState = ['createdby', 'updatedby', 'created', 'updated'].indexOf(element.column_name) >= 0;
    if ((element.nt_base_reference_id !== FieldReference.Button && element.isdisplayed === "Y" && element.isactive === "Y" && element.showinrelation === "Y") || (auditFiledsState)) {
      const dataIndexField = element.ad_field_id.concat("_iden");
      const dataIndexFieldWithoutIdn = element.ad_field_id;
      const baseId = element.nt_base_reference_id;
      let gridlength;
      if (element.gridlength) {
        gridlength = parseInt(element.gridlength);
      } else {
        gridlength = 180;
      };
      tableColumns.push({
        title: element.name,
        dataIndex: dataIndexField,
        dataIndexWithoutIdn:dataIndexFieldWithoutIdn,
        ellipsis: true,
        baseReferenceId: baseId,
        filteredValue: element.filters,
        checked: true,
        listKeyAndValueArray:cellReferenceList,
        width: gridlength,
        editable: true,
        sorter: (a, b) => a[dataIndexField] !== undefined && b[dataIndexField] !== undefined ? (a[dataIndexField].length - b[dataIndexField].length) : (a[dataIndexFieldWithoutIdn] - b[dataIndexFieldWithoutIdn]),
        render: (value, row) => {
          const cellData = {
            children: value,
            props: {},
          };
          if (value === null || value === undefined) {
            cellData.children = row[element.ad_field_id];
          }
          const cellRefIndex = cellReferenceList.findIndex((cellRef) => cellRef.key === cellData.children);
          if (cellRefIndex >= 0) {
            cellData.children = cellReferenceList[cellRefIndex].value;
          }
          cellData.children = formatDisplayField(cellData.children, element);
          return cellData;
        },
      });
    }
  }
  return tableColumns;
};

const getTabRecords = async (args) => {
  const getTabDataResponse = await getTabData(args);
  const dataSourceKeyed = [];
  getTabDataResponse.forEach((item, index) => {
    item.key = `${index}-${item.recordId}`;
    dataSourceKeyed.push(item);
  });
  return dataSourceKeyed;
};

const getTabFields = async (tabLevel, tabDataArgs, windowInitArgs) => {
  const localWindowDefinition = localStorage.getItem("WindowDefinition");
  const selectedTabData = localWindowDefinition.tabs[localWindowDefinition.tabs.findIndex((tab) => tab.tablevel === tabLevel)];
  selectedTabData.fields.sort((a, b) => {
    const x = a.seqno !== null ? parseInt(a.seqno) : a.seqno;
    const y = b.seqno !== null ? parseInt(b.seqno) : b.seqno;
    return (x != null ? x : Infinity) - (y != null ? y : Infinity);
  });

  let tabFieldsValue;
  if (tabDataArgs.recordId !== "NEW_RECORD") {
    tabDataArgs.ad_tab_id = selectedTabData.ad_tab_id;
    tabDataArgs.startRow = "0";
    tabDataArgs.endRow = "1";
    const getTabDataResponse = await getTabData(tabDataArgs);
    tabFieldsValue = getTabDataResponse[0];
  } else {
    tabFieldsValue = await getWindowInitializationData(localWindowDefinition.ad_window_id,selectedTabData.ad_tab_id);
  }

  const fieldGroupsList = {};
  selectedTabData.fields.forEach((element) => {
    if (element.fieldgroup_name !== undefined && element.nt_base_reference_id !== "28") {
      fieldGroupsList[element.fieldgroup_name] = fieldGroupsList[element.fieldgroup_name] || [];
      fieldGroupsList[element.fieldgroup_name].push(element);
    }
  });

  return { tabFields: selectedTabData, tabFieldGroups: fieldGroupsList, tabFieldRecords: tabFieldsValue };
};

const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
      clearTimeout(timer);
    }, delay);
  };
};

const getFilterData = (tabColumnsData, getTabDataResponse, tab) => {
  if (tab !== undefined) {
    let tabValues = [];
    const data = tab.fields.filter(field => field.nt_base_reference_id === "17" );
    const values = data.map(item => item.Values !== undefined || item.Values !== null ? item.Values : '');
    for (let index1 = 0; index1 < values.length; index1++) {
      for (let index2 = 0; index2 < values[index1].length; index2++) {
        tabValues.push(values[index1][index2]);
      }
    };
    let valueArr = [];
    let textArr = [];
    for (let index1 = 0; index1 < tabColumnsData.length; index1++) {
      valueArr.push({
        key: tabColumnsData[index1].dataIndex.replace("_iden", "")
      })
      textArr.push({
        key: tabColumnsData[index1].dataIndex.replace("_iden", "")
      })
    }
    for (let index1 = 0; index1 < tabColumnsData.length; index1++) {
      let tempValueArr = [], tempTextArr = [];
      for (let index2 = 0; index2 < getTabDataResponse.length; index2++) {
        for (let index3 = 0; index3 < Object.keys(getTabDataResponse[index2]).length; index3++) {
          if (tabColumnsData[index1].baseReferenceId === "17") {
            if (Object.keys(getTabDataResponse[index2])[index3] === tabColumnsData[index1].dataIndex.replace("_iden", "")) {
              if (tabValues.length > 0) {
                for (let index = 0; index < tabValues.length; index++) {
                  if (tabValues[index].key === Object.values(getTabDataResponse[index2])[index3] || tabValues[index].value === Object.values(getTabDataResponse[index2])[index3]) {
                    tempValueArr.push(
                      tabValues[index].key
                    )
                  }
                }
              } else { 
                if (Object.values(getTabDataResponse[index2])[index3] !== null) {
                  tempValueArr.push(
                    Object.values(getTabDataResponse[index2])[index3]
                  )
                }
              }
            }
          } else {
            if (Object.keys(getTabDataResponse[index2])[index3] === tabColumnsData[index1].dataIndex.replace("_iden", "")) {
              if (Object.values(getTabDataResponse[index2])[index3] !== null) {
                tempValueArr.push(
                  Object.values(getTabDataResponse[index2])[index3]
                )
              }
            }
          };
          if (tabColumnsData[index1].baseReferenceId === "19") {
            if (Object.keys(getTabDataResponse[index2])[index3] === tabColumnsData[index1].dataIndex) {
              if (Object.values(getTabDataResponse[index2])[index3] !== null) {
                tempTextArr.push(
                  Object.values(getTabDataResponse[index2])[index3]
                )
              }
            }
          } else if (tabColumnsData[index1].baseReferenceId === "17") {
            if (Object.keys(getTabDataResponse[index2])[index3] === tabColumnsData[index1].dataIndex.replace("_iden", "")) {
              if (tabValues.length > 0) {
                for (let index = 0; index < tabValues.length; index++) {
                  if (tabValues[index].key === Object.values(getTabDataResponse[index2])[index3] || tabValues[index].value === Object.values(getTabDataResponse[index2])[index3]) {
                    tempTextArr.push(
                      tabValues[index].value
                    )
                  }
                }
              } else { 
                if (Object.values(getTabDataResponse[index2])[index3] !== null) {
                  tempTextArr.push(
                    Object.values(getTabDataResponse[index2])[index3]
                  )
                }
              }
            }
          } else {
            if (Object.keys(getTabDataResponse[index2])[index3] === tabColumnsData[index1].dataIndex.replace("_iden", "")) {
              if (Object.values(getTabDataResponse[index2])[index3] !== null) {
                tempTextArr.push(
                  Object.values(getTabDataResponse[index2])[index3]
                )
              }
            }
          }
        }
      }
      let uniqueTextArr = [...new Set(tempTextArr)];
      let uniqueValueArr = [...new Set(tempValueArr)];
      Object.assign(valueArr[index1], { fileds: uniqueValueArr })
      Object.assign(textArr[index1], { fields: uniqueTextArr })
    }
    let yesValue = false;
    let noValue = false;
    
    const getColumnSearchProps = (baseReferenceId, id) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        const handleReset = () => {
          clearFilters();
          setSelectedKeys([]); // Clear filter input
          handleCheckboxChange(false); // Uncheck the checkbox
          handleCheckboxChangeNo(false); // Uncheck the checkbox
        };
    
        const handleCheckboxChange = (checked) => {
          setSelectedKeys(checked ? ["y"] : []); // Set selected key or clear it based on checkbox state
        };
    
        const handleCheckboxChangeNo = (checked) => {
          setSelectedKeys(checked ? ["n"] : []); // Set selected key or clear it based on checkbox state
        };
    
        return (
          <div style={{ padding: 8 }}>
            <Space style={{ marginBottom: '5px' }}>
              <Button onClick={handleReset} size="small">
                Reset
              </Button>
              <Button
                onClick={() => {
                  confirm({ closeDropdown: true });
                  handleReset(); // Call handleReset function to ensure checkbox is unchecked
                }}
                size="small"
              >
                Ok
              </Button>
            </Space>
            <br />
            {baseReferenceId === "15" || baseReferenceId === "16" ? (
              <RangePicker
                value={
                  selectedKeys.length > 0
                    ? [moment(selectedKeys[0][0], dateFormat), moment(selectedKeys[0][1], dateFormat)]
                    : []
                }
                onChange={(date, dateString) => setSelectedKeys(dateString ? [dateString] : [])}
                style={{ marginBottom: 8, width: 300 }}
                format={dateFormat}
              />
            ) : baseReferenceId === "17" || baseReferenceId === "19" ? (
              <FilterSelector selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} id={id} tab={tab} getTabDataResponse={getTabDataResponse} />
            ) : baseReferenceId === "20" ? (
              <div>
                <Checkbox id="checkbox-yes" checked={selectedKeys.includes("y")} onChange={(e) => handleCheckboxChange(e.target.checked)}>
                  Yes
                </Checkbox>
                <Checkbox id="checkbox-no" checked={selectedKeys.includes("n")} onChange={(e) => handleCheckboxChangeNo(e.target.checked)}>
                  No
                </Checkbox>
              </div>
            ) : (
              <Input
                id="filterText"
                value={selectedKeys[0]}
                onChange={(e) => {
                  setSelectedKeys(e.target.value ? [e.target.value] : []);
                }}
                style={{ marginBottom: 3, width: 200 }}
              />
            )}
          </div>
        );
      },
    });
    
   
    for (let index1 = 0; index1 < tabColumnsData.length; index1++) {
      let finalFilterArray = [];
      for (let index2 = 0; index2 < Object.values(valueArr[index1])[1].length; index2++) {
        finalFilterArray.push({
          text: Object.values(textArr[index1])[1][index2],
          value: Object.values(valueArr[index1])[1][index2]
        })
      }
      if (tabColumnsData[index1].baseReferenceId === "17") {
        Object.assign(tabColumnsData[index1], { filters: finalFilterArray })
      } else {
        Object.assign(tabColumnsData[index1], getColumnSearchProps(tabColumnsData[index1].baseReferenceId, tabColumnsData[index1].dataIndexWithoutIdn, getTabDataResponse))
      }
      // Object.assign(tabColumnsData[index1], getColumnSearchProps(tabColumnsData[index1].baseReferenceId, tabColumnsData[index1].dataIndexWithoutIdn))
    };
    return tabColumnsData;
  };
};

const getTreeData = (data, tabData) => {
  for (let index1 = 0; index1 < data.length; index1++) {
    for (let index2 = 0; index2 < Object.keys(data[index1]).length; index2++) {
      for (let index3 = 0; index3 < tabData.length; index3++) {
        if (tabData[index3].tree_field_id === Object.keys(data[index1])[index2]) {
          data[index1]['tree_field_id'] = Object.values(data[index1])[index2];
          data[index1]['key'] = index1;
        }
      }
    }
  };
  const toTree = (arr) => {
    const arrMap = new Map(arr.map(item => [item.recordId, item]));
    const tree = [];
    for (let index = 0; index < arr.length; index++) {
      const item = arr[index];
      if (item.tree_field_id) {
        const parentItem = arrMap.get(item.tree_field_id);
        if (parentItem) {
          const { children } = parentItem;
          if (children) {
            parentItem.children.push(item);
          } else {
            parentItem.children = [item];
          }
        }
      } else {
        tree.push(item);
      }
    }
    return tree;
  }
  const treeRowData = toTree(data);
  return treeRowData;
}

const stringLogic = () => {
  let string = "@2F24B5F8DB1747F5B77D751926E88E74@!='CO' | @37DF9BAEBCDD4DBE905453F83938617A@='SO' | @5AEA9DC2ED724C84B0F5DB7F09DE7319@='Y'";

  const keys = string.split("@");
  const actualKeys = keys.filter(s => s.length === 32);

  actualKeys.map((k, i) => {
    const newData = "'test'";
    const stringToUpdate = "@" + k + "@";
    return string = string.replaceAll(stringToUpdate, newData);
  });

  string = string.replaceAll("=", "==");
  string = string.replaceAll("|", "||");
  string = string.replaceAll("&", "&&");
  string = string.replaceAll("'Y'", "'true'");
  string = string.replaceAll("'N'", "'false'");

  function strEval(fn) {
    // eslint-disable-next-line
    return new Function('return ' + fn)();
  }

  if (strEval(string)) {
  } else {
  }
}

export { getTabColumns, getTabRecords, getTabFields, debounce, formatDisplayField, getFilterData, getTreeData, stringLogic ,getDayJsValue };