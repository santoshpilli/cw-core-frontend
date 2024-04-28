import React, { useState, useEffect } from "react";
import { getFilterDropdownData, getTabData } from "../../services/generic";
import useDebounce from "../../lib/hooks/useDebounce";
import { Select } from "antd";
import { useWindowContext } from "../../lib/storage";
import { useParams } from "react-router-dom";

const { Option } = Select;

const FilterSelector = (props) => {
  const { selectedKeys, setSelectedKeys, id, tab, getTabDataResponse } = props;
  const { parentTabRecordData } = tab;
  const [searchData, setSearchData] = useState([]);
  const [json, setJson] = useState();
  const { windowStore } = useWindowContext();
  const windowDefinition = { ...windowStore.windowDefinition };
  const { recordId } = useParams();

  useEffect( async() => {
    const localWindowDefinition = { ...windowDefinition };
    if (localWindowDefinition.tabs) {
      const headerTabData = localWindowDefinition.tabs[localWindowDefinition.tabs.findIndex((tab) => tab.tablevel === "0")];
      const masterParentTabDataIndex = localWindowDefinition.tabs.findIndex(tab => tab.tablevel === "0");
      const localIndex = localWindowDefinition.tabs.findIndex((ta) => ta.ad_tab_id === tab.parent_tab_id);
      let sessionValues = {};
      if (localIndex !== -1) {
        const parentTab = localWindowDefinition.tabs[localIndex];
        const getTabDataServerResponse = await getTabData({ windowId:windowDefinition.ad_window_id,ad_tab_id: headerTabData.ad_tab_id, recordId: recordId, startRow: "0", endRow: "1" });
        let headerRecordData = getTabDataServerResponse[0];
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
      } else {
        tab.fields.map((field) => {
          if (field.issession === "Y") {
              sessionValues[field.column_name] = getTabDataResponse[0][field.ad_field_id];
            }
          return null;
        });
      };
      if (Object.keys(sessionValues).length !== 0) {
        const stringifiedSession = JSON.stringify(sessionValues);
        const updatedSession = stringifiedSession.replace(/\\"/g, '\\"');
        const stringRequest = JSON.stringify(updatedSession);
        setJson(stringRequest);
      } else {
        setJson(null);
      };
    }
  }, [searchData]); 

  const getColumnData = async (id) => {
    const headerTabData = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === "0")];
    const headerTabId = headerTabData.ad_tab_id;
    const dropDownData = await getFilterDropdownData(windowDefinition.ad_window_id,headerTabId,id, null, json);
    const data = JSON.parse(dropDownData);
    if (data !== null) {
      setSearchData([...data.searchData])
    }                                                                                                                                                                                       
  };

  const [searchKey, setSearchkey] = useState();
  const [searchId, setSearchId] = useState();
  const debouncedSearchKey = useDebounce(searchKey, 350);

  useEffect(async () => {
    const headerTabData = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === "0")];
    const headerTabId = headerTabData.ad_tab_id;
    if (debouncedSearchKey) {
      const dropDownData = await getFilterDropdownData(windowDefinition.ad_window_id,headerTabId,searchId, debouncedSearchKey, json);
      const data = JSON.parse(dropDownData);
      if (data !== null) {
        setSearchData([...data.searchData])
      } 
    }
  }, [debouncedSearchKey]);

  const handleSearch = (id) => (value) => {
    setSearchId(id)
    setSearchkey(value);
  };

  const dropDownOptions = searchData.map((d) => <Option key={d.RecordID}>{d.Name}</Option>);

  return (
    <Select style={{ marginBottom: 8, width: 200 }} mode="multiple"  allowClear value={selectedKeys[0]} defaultActiveFirstOption={false} filterOption={false} onSearch={handleSearch(id)} onFocus={() => getColumnData(id)} notFoundContent={null} onChange={(newValue) => setSelectedKeys(newValue ? [newValue] : [])}>
      {dropDownOptions}
    </Select>
  );
};

export default FilterSelector;