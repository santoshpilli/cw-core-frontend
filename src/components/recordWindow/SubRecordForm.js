import React, { useState, useEffect, Fragment } from "react";
import { Row, Col, Form, Typography } from "antd";
import { useParams } from "react-router-dom";
import { getTabData, getWindowInitializationData } from "../../services/generic";
import RecordForm from "../window/RecordForm";
import dayjs from "dayjs";
import { formatDisplayField } from "../window/windowUtilities";
import { useGlobalContext, useWindowContext } from "../../lib/storage";
import { FieldReference } from "../../lib/fieldReference";
import { upsertTabData } from "../../services/generic";
import Arrow from "../../assets/images/arrow.svg";
import "antd/dist/antd.css";
import ThemeJson from "../../constants/UIServer.json"

const { Text } = Typography;

const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const SubRecordForm = (props) => {
  const { windowStore } = useWindowContext();
  const windowDefinition = { ...windowStore.windowDefinition };
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const [form] = Form.useForm();
  const { recordId } = useParams();

  const [headerTab, setHeaderTab] = useState({ fields: [] });
  const [headerRecord, setHeaderRecord] = useState({});
  const headerFieldGroups = {};
  // const [isEdit, setIsEdit] = useState(false);

  const { referenceTabId, parentTabId, isEdit } = props;

 

  const onFinish = async (values) => {
    Object.entries(values).map(([key, value]) => {
      if (value === true) {
        values[key] = "Y";
      }
      if (value === false) {
        values[key] = "N";
      }
      if(typeof value === "string"){
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

    if (recordId === "NEW_RECORD") {
      Object.entries(values).map(([ValuesKey, valuesValue]) => {
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
    }

    const stringifiedFields = JSON.stringify(values);
    const updatedStrings = stringifiedFields.replace(/\\"/g, '\\"');
    const stringRequest = JSON.stringify(updatedStrings);
    const upsertResponse = await upsertTabData(windowDefinition.ad_window_id,headerTab.ad_tab_id, "NEW_RECORD", stringRequest, parentTabId, recordId);
    if (upsertResponse.data.data.upsertTab.status === "200") {

    }

  };

  useEffect(() => {
    if (windowDefinition.tabs.length > 0) {
      

      if (referenceTabId) {
        const headerTabData = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.ad_tab_id === referenceTabId)];
        headerTabData.fields.sort((a, b) => {
          const x = a.seqno !== null ? parseInt(a.seqno) : a.seqno;
          const y = b.seqno !== null ? parseInt(b.seqno) : b.seqno;
          return (x != null ? x : Infinity) - (y != null ? y : Infinity);
        });
        setHeaderTab({ ...headerTabData });

        let headerRecordData;
        if (recordId !== "NEW_RECORD") {
          getTabData({ windowId:windowDefinition.ad_tab_id,ad_tab_id: headerTabData.ad_tab_id, parentTabId: parentTabId, recordId: recordId, startRow: "0", endRow: "1" }).then((getTabDataResponse) => {
            headerRecordData = getTabDataResponse[0];
          });
        } else {
          getWindowInitializationData(windowDefinition.ad_window_id,headerTabData.ad_tab_id, parentTabId).then((data) => {
            headerRecordData = data;
          });
        }
        setHeaderRecord({ ...headerRecordData });
      }
    } else {
      console.error("No window defination found");
    }
  }, [referenceTabId]);

  useEffect(() => {
    if (recordId.length === 32) {
      form
        .validateFields()
        .then(() => {
          form.submit();
        })
        .catch((error) => {
          console.error(JSON.stringify(error, null, 2));
        });
    }
  }, [recordId]);

  const getRecordValue = (field) => {
    let recordValueField = headerRecord[field.ad_field_id.concat("_iden")] ? headerRecord[field.ad_field_id.concat("_iden")] : headerRecord[field.ad_field_id];
    if (recordValueField === "Y") {
      recordValueField = "Yes";
    }
    if (recordValueField === "N") {
      recordValueField = "No";
    }
    return formatDisplayField(recordValueField, field);
  };

  return (
    <Fragment>
      {headerTab.fields.length > 0 ? (
        isEdit ? (
          <RecordForm
            form={form}
            idName="subRecordForm"
            onFinish={onFinish}
            headerTab={headerTab}
            headerRecord={headerRecord}
            headerFieldGroups={headerFieldGroups}
            recordId={recordId}
            isHeader={true}
          />
        ) : (
          <Fragment>
            <Row>
              <Col span={24} style={Themes.contentWindow.recordWindow.RecordHeader.readOnlyViewColumn}>
                <Row gutter={[24, 24]}>
                  {headerTab.fields.map((field, index) =>
                    field.isdisplayed === "Y" &&
                    field.fieldgroup_name === undefined &&
                    field.isshowninstatusbar !== "Y" &&
                    field.nt_base_reference_id !== "28" &&
                    field.column_type !== "Button" ? (
                      <Col key={`${index}-${headerRecord[field.ad_field_id]}`} span={field.nt_base_reference_id === FieldReference.WYSIWYGEditor ? 24 : 8}>
                        <Text type="secondary">{field.name}</Text> <br />
                        <Text strong>
                          {field.new_record_window ? (
                            <span style={{ color: "#1648AA" }}>
                              {getRecordValue(field)}&nbsp; {getRecordValue(field) ? <img style={{ paddingBottom: "5px" }} src={Arrow} alt="Arrow" /> : ""}
                            </span>
                          ) : (
                            getRecordValue(field)
                          )}
                        </Text>
                      </Col>
                    ) : (
                      ""
                    )
                  )}
                </Row>
              </Col>
            </Row>
          </Fragment>
        )
      ) : null}
    </Fragment>
  );
};

export default SubRecordForm;
