import React, { useState } from "react";
import { Card, Col, Row, Table, Form, DatePicker, Select, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getCustomBusinessUnitForProfitLossStatement, getProfitLossStatementData } from "../../../services/generic";

const { Option } = Select;
const dateFormat = "YYYY-MM-DD";

const ProfitLossStatement = () => {
    const [bunitData,setBunitData] = useState([]);
    const [mainRowData, setMainRowData] = useState([]);
    const [mainColumnData, setMainColumnData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [headerform] = Form.useForm();

    const getBusinessUnit = async () =>{
        const businessUnitResponse = await getCustomBusinessUnitForProfitLossStatement();
        setBunitData(businessUnitResponse);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const valuesArray = Object.values(values);
        let valuesObj = {};
        valuesObj['cs_bunit_id'] = valuesArray[0];
        valuesObj['datefrom'] = valuesArray[1].format("YYYY-MM-DD")
        valuesObj['dateto'] = valuesArray[2].format("YYYY-MM-DD")

        const stringifiedJSON = JSON.stringify(valuesObj);
        const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');

        const serverResponse = await getProfitLossStatementData(jsonToSend);

        if (serverResponse) {
            const data = JSON.parse(serverResponse.data.data.executeAPIBuilder);

            let formulaArray = [];
            for (let index = 0; index < data.length; index++) {
                if (data[index].formula) {
                    formulaArray.push(data[index].formula);
                };
            };
            for (let index1 = 0; index1 < formulaArray.length; index1++) {
                let splitArr1 = [];
                let splitSymArr1 = [];
                formulaArray[index1].split("(").forEach(element => {
                    if (element.indexOf(")") > -1) {
                        splitArr1 = splitArr1.concat(element.split(")")[0]);
                    }
                });
                formulaArray[index1].split(")").forEach(element => {
                    if (element.indexOf("(") > -1) {
                        splitSymArr1 = splitSymArr1.concat(element.split("(")[0]);
                    }
                });
                if (splitArr1.length > 1) {
                    let sumArr = [splitArr1.length];
                    for (let index2 = 0; index2 < splitArr1.length; index2++) {
                        let valueArr1 = [];
                        let childArr1 = [];
                        for (let index3 = 0; index3 < data.length; index3++) {
                            if (data[index3].parentaccount === splitArr1[index2]) {
                                childArr1.push(data[index3].accountcode);
                                valueArr1.push(data[index3].value);
                            } 
                        }
                        if (childArr1.length > 0) {
                            for (let index4 = 0; index4 < childArr1.length; index4++) {
                                for (let index5 = 0; index5 < data.length; index5++) {
                                    if (data[index5].parentaccount === childArr1[index4]) {
                                        childArr1.push(data[index5].accountcode);
                                        valueArr1.push(data[index5].value);
                                        childArr1.slice(1, 0);
                                    } 
                                }
                            }
                        };
                        let sum = 0;
                        for (let index6 = 0; index6 < valueArr1.length; index6++) {
                            sum = sum + valueArr1[index6];
                        };
                        sumArr[index2] = sum;
                    };
                    let value = 'undefined';
                    for (let index7 = 0; index7 < sumArr.length -1; index7++) {
                        if (value === 'undefined') {
                            if (splitSymArr1[index7+1] === '+') {
                                value = sumArr[index7] + sumArr[index7+1];
                            }
                            if (splitSymArr1[index7+1] === '-') {
                                value = sumArr[index7] - sumArr[index7+1];
                            }
                            if (splitSymArr1[index7+1] === '*') {
                                value = sumArr[index7] * sumArr[index7+1];
                            }
                        } else {
                            if (splitSymArr1[index7+1] === '+') {
                                value = value + sumArr[index7+1];
                            }
                            if (splitSymArr1[index7+1] === '-') {
                                value = value - sumArr[index7+1];
                            }
                            if (splitSymArr1[index7+1] === '*') {
                                value = value * sumArr[index7+1];
                            }
                        }
                    };
                    for (let index8 = 0; index8 < data.length; index8++) {
                        if (data[index8].formula === formulaArray[index1]) {
                            data[index8].value = value.toFixed(2);
                        }
                    };
                };
            };

            const toTree = (arr) => {
                for (let index = 0; index < arr.length; index++) {
                    arr[index].key = index;
                    if (arr[index].issummary === 'Y' && arr[index].formula === null) {
                        arr[index].value = ''
                    }
                };
                const arrMap = new Map(arr.map(item => [item.accountcode, item]));
                const tree = [];
                for (let index = 0; index < arr.length; index++) {
                    const item = arr[index];
                    if (item.parentaccount) {
                        const parentItem = arrMap.get(item.parentaccount);
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
                };
                return tree;
            };

            const treeRowData = toTree(data);

            const columns = [
                // {
                //     "title": "Parent Name",
                //     "dataIndex": "parentname",
                //     "key": "parentname"
                //   },
                //   {
                //     "title": "Parent Account",
                //     "dataIndex": "parentaccount",
                //     "key": "parentaccount",
                //   },
                  {
                    "title": "Account Code",
                    "dataIndex": "accountcode",
                    "key": "accountcode",
                  },
                  {
                    "title": "Account Name",
                    "dataIndex": "accountname",
                    "key": "accountname",
                  },
                  {
                    "title": "Value",
                    "dataIndex": "value",
                    "key": "value",
                  }
            ];
            setLoading(false);
            setMainRowData(treeRowData);
            setMainColumnData(columns);
        }
    };

    const handleConfirm = () => {
        headerform.submit();
    };

    return (
        <div>
            <Row>
                <Col span={12}>
                    <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>Profit & Loss Statement</h2>
                </Col>
            </Row>
            <br/>
            <Row gutter={8}>
                <Col span={24} style={{ marginBottom: "8px" }}>
                    <Card>
                        <Row gutter={8}>
                            <Col span={20}>
                                <Form layout="vertical" form={headerform} onFinish={onFinish}>
                                    <Row gutter={16}>
                                        <Col className="gutter-row" span={6}>
                                            <Form.Item name="businessUnit" label="Business unit" style={{ marginBottom: "8px" }} rules={[{ required: true }]} >
                                                <Select
                                                    allowClear
                                                    showSearch
                                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    onFocus={getBusinessUnit}
                                                >
                                                    {bunitData.map((data) => (
                                                        <Option key={data.recordid} value={data.recordid} title={data.name}>
                                                            {data.name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={2.8}>
                                            <Form.Item name="datefrom" label="From Date" style={{ marginBottom: "8px" }} rules={[{ required: true }]} >
                                                <DatePicker format={dateFormat} />
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={2.8}>
                                            <Form.Item name="dateto" label="To Date" style={{ marginBottom: "8px" }} rules={[{ required: true }]} >
                                                <DatePicker format={dateFormat} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                            <Col span={4}>
                                <Button  style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px", float: "right", marginTop: "10%" }} onClick={handleConfirm}>
                                    View
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Table
                dataSource={mainRowData}
                columns={mainColumnData}
                pagination={false}
                size='small'
                loading={{
                    spinning: loading,
                    indicator: <LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />,
                }}
                scroll={{ y: "65vh", x: "100%" }}
            />
        </div>
    );
};

export default ProfitLossStatement;