import React, { useState } from "react";
import { Spin, Modal, Table, Row, Col, Button, Input, Card, Form, message } from "antd";

import { getHistoryOfSqlQuery, getSqlQuery } from "../../../services/generic";
import { HistoryOutlined, LoadingOutlined } from "@ant-design/icons";
import InvoiceLogo from "../../../assets/images/invoice.svg";
import "antd/dist/antd.css";
import Export from "../../../assets/images/export.svg";
import { ExportToCsv } from 'export-to-csv';

const UserWindowHeader = () => {
  const [loading, setLoading] = useState(false);
  const [queryInState, setQueryInState] = useState('');
  const [columnDefs, setColumnDefs] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableDataForHistory, setTableDataForHistory] = useState([]);

  const [historyOfQueryModal, setHistoryOfQueryModal] = useState(false)
  const [displayTableFlag, setDisplayTableFlag] = useState(false);
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 12,
    sm: 12,
    md: 12,
  };

  const editorValChange = (event) => {
    setQueryInState(event.target.value);
  }

  const searchSqlQuery = async () => {
    setLoading(true);
    let queryData = null;

    if (queryInState !== undefined && queryInState !== null) {
      const doubleQuoteForDesc = queryInState.replace(/\r?\n|\r/g, '\\n')
      queryData = doubleQuoteForDesc.replace(/"/g, '\\"')
    }

    const getSqlQueryData = await getSqlQuery(queryData)

    if (getSqlQueryData.Status === 'Success') {
      let dataArray;
      const clientGridArray = []
      const res2 = getSqlQueryData.Result;
      if (res2.length > 0) {
        for (let index1 = 0; index1 < res2.length; index1 += 1) {
          dataArray = res2[index1]
          clientGridArray.push(dataArray)
        }
        const ObjKey = Object.keys(clientGridArray[0]);
        const ColDef = [];
        for (let index3 = 0; index3 < ObjKey.length; index3 += 1) {
          const element = ObjKey[index3];
          ColDef.push({
            title: element,
            dataIndex: element,
            editable: true,
            width: 180,
            ellipsis: true
          })
        }
        setDisplayTableFlag(true)
        setColumnDefs(ColDef)
        setTableData(clientGridArray)
      }
      else {
        // pending else condition
      }
    } else {
      message.error(getSqlQueryData.Result)
      setDisplayTableFlag(true)
      setColumnDefs([])
      setTableData([])
    }
    setLoading(false);
  }

  const callClearFun = () => {
    setQueryInState('')
    setDisplayTableFlag(false);
    setColumnDefs([]);
    setTableData([]);
  }

  const handleCancel = () => {
    setHistoryOfQueryModal(false)
  }

  const getHistoryOfSql = async () => {
    setHistoryOfQueryModal(true)
    const getHistoryOfSqlData = await getHistoryOfSqlQuery()
    setTableDataForHistory(getHistoryOfSqlData)
  }

  const historyColumns = [
    {
      title: 'Start time',
      dataIndex: 'starttime',
    },
    {
      title: 'Query',
      dataIndex: 'query',
    },
  ];

  const exportData = () => {
    setLoading(true);
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    let finalOutputArray = [];

    for (let recordIndex = 0; recordIndex < tableData.length; recordIndex++) {
      const jsonRecord = tableData[recordIndex];
      let jsonObject = {};
      for (let headerIndex = 0; headerIndex < columnDefs.length; headerIndex++) {
        const fieldValue = columnDefs[headerIndex].dataIndex;
        if (!(jsonRecord[fieldValue] === undefined)) {
          jsonObject[columnDefs[headerIndex].title] = jsonRecord[fieldValue];
        }
      }
      finalOutputArray.push(jsonObject);
    };

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: `SQL_Query_Tool_${date}_${time}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };

    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(finalOutputArray);
    setLoading(false);
  };

  return (
    <div>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
        <Row>
          <Col {...responsiveDesignForColumn}>
            <img src={InvoiceLogo} alt="invoice" align="left" /> <p /* style={Themes.contentWindow.ListWindowHeader.listWindowTitle} */> &ensp;SQL Query Tool</p>
          </Col>
          <Col {...responsiveDesignForColumn}>
            {tableData.length > 0 ?
              <img 
                style={{ cursor: "pointer",
                  fontSize: "20px",
                  height: "2rem",
                  width: "1.3rem",
                  opacity: 1,
                  fontWeight: 500,
                  margin: "0px 5px 0px 0px",
                  float: "right"
                }}
                src={Export}
                alt="invoice" 
                onClick={exportData}
              /> : 
              ""
            }
            <span
              type="default"
              onClick={() => getHistoryOfSql()}
              style={{
                cursor: "pointer",
                fontSize: "20px",
                height: "2rem",
                width: "1.4rem",
                opacity: 1,
                fontWeight: 500,
                margin: "0px 5px 0px 0px",
                float: "right",
              }}
            >
              <HistoryOutlined />
            </span>
          </Col>
        </Row>
        <Card>
          <Form layout="vertical" name="control-hooks" form={form}>
            <Form.Item style={{ marginBottom: '0px' }}>
              <TextArea rows={12} size='small' value={queryInState} onChange={editorValChange} />
            </Form.Item>
          </Form>
        </Card>
        <Row>
          <Col {...responsiveDesignForColumn}>
            <p>
              <Button type="default" onClick={searchSqlQuery} style={{ backgroundColor: 'rgb(8, 158, 164)', color: 'white' }}>
                Search
              </Button>
              &nbsp;
              <Button type="default" onClick={callClearFun} htmlType="submit" >
                Clear
              </Button>
            </p>
          </Col>
        </Row>
        {displayTableFlag === true ? <Table
          size="small"
          scroll={{ x:"100%", y: "40vh" }}
          pagination={false}
          loading={{
            spinning: loading,
            indicator: <LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />,
          }}

          dataSource={tableData}
          columns={columnDefs}

        /> : ''}
        <Modal
          visible={historyOfQueryModal}
          onCancel={handleCancel}
          width="75%"
          height="75%"
          closable={false}
          style={{ top: "10px" }}
          centered
          bodyStyle={{ padding: "0px" }}
          footer={[
            <div>
              <Button
                onClick={handleCancel}
                style={{
                  backgroundColor: "#089ea4",
                  color: "#fff",
                  border: "0.5px",
                  fontSize: "12px",
                  fontWeight: "700",
                  height: "35px",
                  width: "105px",
                  borderRadius: "2px",
                }}
              >
                <span>Ok</span>
              </Button>
              <Button
                key="back"
                onClick={handleCancel}
                style={{
                  backgroundColor: "#ececec",
                  border: "none",
                  color: "dimgray",
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>
            </div>,
          ]}
        >
          <Card style={{ backgroundColor: "#ececec" }}>
            <h3
              style={{
                fontWeight: "500",
                fontSize: "19px",
                color: "black",
                marginTop: "4px",
                marginLeft: "2px",
              }}
            >
              History
            </h3>
            <Card>
              <Table
                size="small"
                scroll={{ y: "25vh" }}
                pagination={false}
                loading={{
                  spinning: loading,
                  indicator: <LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />,
                }}
                dataSource={tableDataForHistory}
                columns={historyColumns}
              />
            </Card>
          </Card>
        </Modal>
      </Spin>
    </div>
  );
};

export default UserWindowHeader;
