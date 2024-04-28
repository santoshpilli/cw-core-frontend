import React, { useState } from 'react';
import { Row, Col, Form, DatePicker, Button, Select, Table, message, Popover, Space } from 'antd';
import { LoadingOutlined, CopyFilled, MinusCircleOutlined, PlusOutlined, FilterOutlined } from "@ant-design/icons";
import { getProfitLossReportData, getFinanceData, getCustomBusinessUnitForProfitLossStatement } from '../../../../services/generic';
import { useGlobalContext } from "../../../../lib/storage";

const { Option } = Select;
const { RangePicker } = DatePicker;

const convertToRoman = (num) => {
    var roman = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1
    };
    var str = '';
  
    for (var i of Object.keys(roman)) {
      var q = Math.floor(num / roman[i]);
      num -= q * roman[i];
      str += i.repeat(q);
    }
  
    return str;
};

const ProfitLossSchedule3 = () => {
    const { globalStore } = useGlobalContext();
    const userPreferences = globalStore.userPreferences;
    const dateFormat = userPreferences.dateFormat;
    const userData = globalStore.userData;
    const currency = userData.currency;
    const [bunitData,setBunitData] = useState([]);
    const [currentFromDate, setCurrentFromDate] = useState('');
    const [currentToDate, setCurrentToDate] = useState('');
    const [visible, setVisible] = useState(false);
    const [previousDatesValues, setPreviousDatesValues] = useState([]);
    const [selectedView,  setSelectedView] = useState(`Schedule ${convertToRoman(3)}`);
    const [expensesRowData, setExpensesRowData] = useState([]);
    const [expensesColumnData, setExpensesColumnData] = useState([]);
    const [operationsRowData, setOperationsRowData] = useState([]);
    const [operationsColumnData, setOperationsColumnData] = useState([]);
    const [mainRowData, setMainRowData] = useState([
        {
            accountname: `${convertToRoman(1)}. Revenue from operators`,
            line_id: '1'
        },
        {
            accountname: `${convertToRoman(2)}. Other Income`,
            line_id: '2'
        },
        {
            accountname: `${convertToRoman(3)}. Total Revenue (${convertToRoman(1)} + ${convertToRoman(2)})`,
            line_id: '3'
        },
        {
            accountname: `${convertToRoman(4)}. Expenses`,
            line_id: '4'
        },
        {
            accountname: "1. Cost of materials consumed",
            line_id: '4-1'
        },
        {
            accountname: "2. Purchases of stock in trade",
            line_id: '4-2'
        },
        {
            accountname: "3. Changes in Inventories of finished goods work-in-progress and Stock-in-trade",
            line_id: '4-3'
        },
        {
            accountname: "4. Employee benefits expense",
            line_id: '4-4'
        },
        {
            accountname: "5. Finance Costs",
            line_id: '4-5'
        },
        {
            accountname: "6. Depreciation And Amortization Expense",
            line_id: '4-6'
        },
        {
            accountname: "7. Other Expenses",
            line_id: '4-7'
        },
        {
            accountname: `${convertToRoman(5)}. Profit before exceptional and extraordinary items and tax (${convertToRoman(3)} - ${convertToRoman(4)})`,
            line_id: '5'
        },
        {
            accountname: `${convertToRoman(6)}. Exceptional Items`,
            line_id: '6'
        },
        {
            accountname: `${convertToRoman(7)}. Profit before extraordinary items and tax (${convertToRoman(5)-convertToRoman(6)})`,
            line_id: '7'
        },
        {
            accountname: `${convertToRoman(8)}. Extraordinary Items`,
            line_id: '8'
        },
        {
            accountname: `${convertToRoman(9)}. Profit before tax (${convertToRoman(7)} - ${convertToRoman(8)})`,
            line_id: '9'
        },
        {
            accountname: `${convertToRoman(10)}. Tax Expense`,
            line_id: '10'
        },
        {
            accountname: "1. Current tax",
            line_id: '10-1'
        },
        {
            accountname: "2. Deferred tax",
            line_id: '10-2'
        },
        {
            accountname: `${convertToRoman(11)}. Profit (Loss) for the period from continuing operations (${convertToRoman(9)} - ${convertToRoman(10)})`,
            line_id: '11'
        },
        {
            accountname: `${convertToRoman(12)}. Profit (Loss) from discontinuing operations`,
            line_id: '12'
        },
        {
            accountname: `${convertToRoman(13)}. Tax expense of discontinuing operations`,
            line_id: '13'
        },
        {
            accountname: `${convertToRoman(14)}. Profit (Loss) from Discontinuing operations (after tax) (${convertToRoman(12)} - ${convertToRoman(13)})`,
            line_id: '14'
        },
        {
            accountname: `${convertToRoman(15)}. Profit (Loss) for the period  (${convertToRoman(13)} - ${convertToRoman(14)})`,
            line_id: '15'
        }
    ]);
    const [mainColumnData, setMainColumnData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [headerform] = Form.useForm();

    const getBusinessUnit = async () =>{
        const businessUnitResponse = await getCustomBusinessUnitForProfitLossStatement();
        setBunitData(businessUnitResponse);
    };

    const currentDateChanges = (dates, dateStrings) => {
        setCurrentFromDate(dateStrings[0]);
        setCurrentToDate(dateStrings[1]);
    };

    const onFinishContent = (values) => {
        setPreviousDatesValues(values.previousDates);
        setVisible(false);
    };

    const handleVisibleChange = (newVisible) => {
        setVisible(newVisible);
    };

    const handleSelectedView = (value) => {
        setSelectedView(value);
        setMainColumnData([]);
        setPreviousDatesValues([]);
        setExpensesColumnData([])
        setExpensesRowData([]);
        setOperationsColumnData([]);
        setOperationsRowData([]);
    };

    const previousDatesContent = () => {
        return (
            <div>
                <Form name="dynamic_form_nest_item" onFinish={onFinishContent} autoComplete="off" style={{ height: "300px" }}>
                    <Form.List name="previousDates">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'dates']}
                                            rules={[{ required: true, message: 'Missing Previous dates' }]}
                                        >
                                            <RangePicker format={dateFormat} />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                        <br />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ width: 350 }}>
                                        Add RangePicker
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <br /> 
                    <div style={{ display: "flex", float: "right" }}>
                        <Form.Item>
                            <Button onClick={() => { setVisible(false); }}>
                                Cancel
                            </Button>
                        </Form.Item>
                        &nbsp;
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        );
    };

    const onFinish = async (values) => {
            setLoading(true);
            const valuesArray = Object.values(values);
            let valuesObj = {};
            valuesObj['cs_bunit_id'] = valuesArray[0];
            valuesObj['datefrom'] = currentFromDate.split("-").reverse().join("-");
            valuesObj['dateto'] = currentToDate.split("-").reverse().join("-");
    
            const stringifiedJSON = JSON.stringify(valuesObj);
            const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
    
            const serverResponse = await getProfitLossReportData();
            if (serverResponse) {
                let data1 = serverResponse;
                const serverResponse2 = await getFinanceData(jsonToSend);
                if (serverResponse2) {
                    let mainArray = [...mainRowData];
                    let data2 = serverResponse2; 
                    let formulaArray = [];
                    for (let index = 0; index < data1.length; index++) {
                        formulaArray.push(data1[index].calc_formula);
                    };
                    for (let index1 = 0; index1 < formulaArray.length; index1++) {
                        if (formulaArray[index1]) {
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
                            if (splitArr1.length > 0) {
                                let sumArr = [splitArr1.length];
                                for (let index2 = 0; index2 < splitArr1.length; index2++) {
                                    let valueArr1 = [];
                                    let childArr1 = [];
                                    for (let index3 = 0; index3 < data2.length; index3++) {
                                        if (data2[index3].parentaccount === splitArr1[index2]) {
                                            childArr1.push(data2[index3].accountcode);
                                            valueArr1.push(data2[index3].value);
                                        } 
                                    };
                                    if (childArr1.length > 0) {
                                        for (let index4 = 0; index4 < childArr1.length; index4++) {
                                            for (let index5 = 0; index5 < data2.length; index5++) {
                                                if (data2[index5].parentaccount === childArr1[index4]) {
                                                    childArr1.push(data2[index5].accountcode);
                                                    valueArr1.push(data2[index5].value);
                                                    childArr1.splice(0,10);
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
                                if (sumArr.length > 1) {
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
                                    mainArray[index1].value = value; 
                                } else if (sumArr.length === 1) {
                                    mainArray[index1].value = sumArr[0]; 
                                };
                            };
                        };
                    };
    
                    const columns = [
                          {
                            "title": <span>Particulars</span>,
                            "dataIndex": "accountname",
                            "key": "accountname",
                            width: 550,
                            fixed: "left",
                            render: (text, record, index) => (
                                <>
                                    {mainRowData.map((item, i) => {
                                        if (item.line_id.includes('-') === false && text === item.accountname && index === i) {
                                            return <span style={{ fontWeight: 800 }}>{text}</span>
                                        } else if (item.line_id.includes('-') === true && text === item.accountname && index === i) {
                                            return <span style={{ marginLeft: "30px",  }}>{text}</span>
                                        }
                                    })}
                                </>
                            )
                          },
                          {
                            "title": `${currentFromDate} - ${currentToDate}`,
                            "dataIndex": "value",
                            "key": "value",
                            width: 160,
                            render: (text, record, index) => (
                                <>
                                    {mainRowData.map((item, i) => {
                                        if (item.line_id.includes('-') === false && record.accountname === item.accountname && index === i) {
                                            return <div style={{ fontWeight: 800, textAlign: "center" }}>{currency === "INR" ? (record.value !== undefined ? record.value.toLocaleString('en-US') : record.value) : record.value.toFixed(2)}</div>
                                        } else if (item.line_id.includes('-') === true && record.accountname === item.accountname && index === i) {
                                            return <div style={{ textAlign: "center" }}>{currency === "INR" ? (record.value !== undefined ? record.value.toLocaleString('en-US') : record.value) : record.value.toFixed(2)}</div>
                                        }
                                    })}
                                </>
                            )
                          }
                    ];
                    for(let ind = 0; ind < previousDatesValues.length; ind++) {
                        let valuesObj = {};
                        valuesObj['cs_bunit_id'] = valuesArray[0];
                        valuesObj['datefrom'] = previousDatesValues[ind].dates[0].format("YYYY-MM-DD");
                        valuesObj['dateto'] = previousDatesValues[ind].dates[1].format("YYYY-MM-DD");

                        const stringifiedJSON = JSON.stringify(valuesObj);
                        const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');

                        const serverResponse3 = await getFinanceData(jsonToSend);
                        if (serverResponse3) {
                            const data3 = serverResponse3;
                            for (let index1 = 0; index1 < formulaArray.length; index1++) {
                                if (formulaArray[index1]) {
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
                                    if (splitArr1.length > 0) {
                                        let sumArr = [splitArr1.length];
                                        for (let index2 = 0; index2 < splitArr1.length; index2++) {
                                            let valueArr1 = [];
                                            let childArr1 = [];
                                            for (let index3 = 0; index3 < data3.length; index3++) {
                                                if (data3[index3].parentaccount === splitArr1[index2]) {
                                                    childArr1.push(data3[index3].accountcode);
                                                    valueArr1.push(data3[index3].value);
                                                } 
                                            };
                                            if (childArr1.length > 0) {
                                                for (let index4 = 0; index4 < childArr1.length; index4++) {
                                                    for (let index5 = 0; index5 < data3.length; index5++) {
                                                        if (data3[index5].parentaccount === childArr1[index4]) {
                                                            childArr1.push(data3[index5].accountcode);
                                                            valueArr1.push(data3[index5].value);
                                                            childArr1.splice(0,10);
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
                                        if (sumArr.length > 1) {
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
                                            mainArray[index1][`value${ind}`] = value; 
                                        } else if (sumArr.length === 1) {
                                            mainArray[index1][`value${ind}`] = sumArr[0]; 
                                        };
                                    };
                                };
                            };
                            columns.push(
                                {
                                    title: `${previousDatesValues[ind].dates[0].format(dateFormat)} - ${previousDatesValues[ind].dates[1].format(dateFormat)}`,
                                    "dataIndex": `value${ind}`,
                                    "key": `value${ind}`,
                                    width: 160,
                                    render: (text, record, index) => (
                                        <>
                                            {mainRowData.map((item, i) => {
                                                if (item.line_id.includes('-') === false && record.accountname === item.accountname && index === i) {
                                                    return <div style={{ fontWeight: 800, textAlign: "center" }}>{currency === "INR" ? (record[`value${ind}`] !== undefined ? record[`value${ind}`].toLocaleString('en-US') : record[`value${ind}`]) : record[`value${ind}`].toFixed(2)}</div>
                                                } else if (item.line_id.includes('-') === true && record.accountname === item.accountname && index === i) {
                                                    return <div style={{ textAlign: "center" }}>{currency === "INR" ? (record[`value${ind}`] !== undefined ? record[`value${ind}`].toLocaleString('en-US') : record[`value${ind}`]) : record[`value${ind}`].toFixed(2)}</div>
                                                }
                                            })}
                                        </>
                                    )
                                }
                            );
                        };
                    };
                    if (selectedView === "Horizontal View") {
                        let arr1 = [], arr2 =[];
                        data2.map(item => {
                            if (item.parentaccount === "EXP") {
                                item[`${item.parentaccount}`] = item.accountname;
                                item[`${item.parentaccount}Value`] = item.value;
                                arr1.push(item);
                            }
                        });
                        data2.map(item => {
                            if (item.parentaccount === "RO") {
                                item[`${item.parentaccount}`] = item.accountname;
                                item[`${item.parentaccount}Value`] = item.value;
                                arr2.push(item);
                            }
                        });
                        arr1.map(item => {
                            let sum = 0;
                            let arr = [];
                            data2.map(item2 => {
                                if (item.accountname === item2.parentname) {
                                    sum = sum + item2.value;
                                    arr.push(item2);
                                };
                            });
                            arr.map(item3 => {
                                data2.map(item4 => {
                                    if (item3.accountname === item4.parentname) {
                                        sum = sum + item4.value;
                                        arr.push(item4);
                                        arr.splice(0,1);
                                    };
                                });
                            })
                            item.EXPValue = sum;
                        });
                        arr2.map(item => {
                            let sum = 0;
                            let arr = [];
                            data2.map(item2 => {
                                if (item.accountname === item2.parentname) {
                                    sum = sum + item2.value;
                                    arr.push(item2);
                                };
                            });
                            arr.map(item3 => {
                                data2.map(item4 => {
                                    if (item3.accountname === item4.parentname) {
                                        sum = sum + item4.value;
                                        arr.push(item4);
                                        arr.splice(0,1);
                                    };
                                });
                            })
                            item[`ROValue`] = sum;
                        });
                        const columns1 = [
                            {
                                "title": "Expenses",
                                "dataIndex": "EXP",
                                "key": "EXP"
                            },
                            {
                                "title": `${currentFromDate} - ${currentToDate}`,
                                "dataIndex": "EXPValue",
                                "key": "EXPValue",
                                width: 160,
                                render: (text, record, index) => (
                                    <>
                                        {arr1.map((item, i) => {
                                            if (record.accountname === item.accountname && index === i) {
                                                return <div style={{ textAlign: "center" }}>{currency === "INR" ? (record.EXPValue !== null ? record.EXPValue.toLocaleString('en-US') : record.EXPValue) : record.EXPValue.toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            },
                        ];
                        const columns2 = [
                            {
                                "title": "Revenue from Operations",
                                "dataIndex": "RO",
                                "key": "RO"
                            },
                            {
                                "title": `${currentFromDate} - ${currentToDate}`,
                                "dataIndex": "ROValue",
                                "key": "ROValue",
                                width: 160,
                                render: (text, record, index) => (
                                    <>
                                        {arr2.map((item, i) => {
                                            if (record.accountname === item.accountname && index === i) {
                                                return <div style={{ textAlign: "center" }}>{currency === "INR" ? (record.ROValue !== null ? record.ROValue.toLocaleString('en-US') : record.ROValue) : record.ROValue.toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            },
                        ];
                        setLoading(false);
                        setExpensesRowData(arr1);
                        setExpensesColumnData(columns1);
                        setOperationsRowData(arr2);
                        setOperationsColumnData(columns2);
                    } else if (selectedView === "Detailed View") {
                        let arr1 = [], arr2 =[];
                        let finalArr1 = [], finalArr2 =[];
                        data2.map(item => {
                            if (item.parentaccount === "EXP") {
                                item[`${item.parentaccount}`] = item.accountname;
                                item[`${item.parentaccount}Value`] = item.value;
                                item.padding = "0px";
                                arr1.push(item);
                            }
                        });
                        arr1.map(item => {
                            let sum = 0;
                            let arr = [];
                            data2.map(item2 => {
                                if (item.accountname === item2.parentname) {
                                    sum = sum + item2.value;
                                    arr.push(item2);
                                };
                            });
                            arr.map(item3 => {
                                data2.map(item4 => {
                                    if (item3.accountname === item4.parentname) {
                                        sum = sum + item4.value;
                                        arr.push(item4);
                                        arr.splice(0,1);
                                    };
                                });
                            })
                            item.EXPValue = sum;
                        });
                        arr1.map(item => {
                            finalArr1.push(item);
                            data2.map(item2 => {
                                let subArr1 = [], subArr2 = [], subArr3 = [], subArr4 = [], subArr5 = [], subArr6 = [], subArr7 = [], subArr8 = [], subArr9 = [], subArr10 = [];
                                if (item.accountname === item2.parentname) {
                                    item2[`${item.parentaccount}`] = item2.accountname;
                                    item2[`${item.parentaccount}Value`] = item2.value; 
                                    item2.padding = "30px";
                                    finalArr1.push(item2);
                                    subArr1.push(item2);
                                };
                                subArr1.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "60px";
                                            finalArr1.push(item4);
                                            subArr2.push(item4);
                                        };
                                    });
                                    finalArr1.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.EXPValue = sum;
                                        };
                                    });
                                });
                                subArr2.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "90px";
                                            finalArr1.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr1.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr3.push(item4);
                                        };
                                    });
                                    finalArr1.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.EXPValue = sum;
                                        };
                                    });
                                });
                                subArr3.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "120px";
                                            finalArr1.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr1.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr4.push(item4);
                                        };
                                    });
                                    finalArr1.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.EXPValue = sum;
                                        };
                                    });
                                });
                                subArr4.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "150px";
                                            finalArr1.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr1.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr5.push(item4);
                                        };
                                    });
                                    finalArr1.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.EXPValue = sum;
                                        };
                                    });
                                });
                                subArr5.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "180px";
                                            finalArr1.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr1.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr6.push(item4);
                                        };
                                    });
                                    finalArr1.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.EXPValue = sum;
                                        };
                                    });
                                });
                                subArr6.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "210px";
                                            finalArr1.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr1.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr7.push(item4);
                                        };
                                    });
                                    finalArr1.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.EXPValue = sum;
                                        };
                                    });
                                });
                                subArr7.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "240px";
                                            finalArr1.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr1.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr8.push(item4);
                                        };
                                    });
                                    finalArr1.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.EXPValue = sum;
                                        };
                                    });
                                });
                                subArr8.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "270px";
                                            finalArr1.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr1.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr9.push(item4);
                                        };
                                    });
                                    finalArr1.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.EXPValue = sum;
                                        };
                                    });
                                });
                                subArr9.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "300px";
                                            finalArr1.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr1.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr10.push(item4);
                                        };
                                    });
                                    finalArr1.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.EXPValue = sum;
                                        };
                                    });
                                });
                                subArr10.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "330px";
                                            finalArr1.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr1.splice(index+1, 0, item4);
                                                };
                                            });
                                        };
                                    });
                                    finalArr1.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.EXPValue = sum;
                                        };
                                    });
                                });
                            });
                        });
                        data2.map(item => {
                            if (item.parentaccount === "RO") {
                                item[`${item.parentaccount}`] = item.accountname;
                                item[`${item.parentaccount}Value`] = item.value;
                                arr2.push(item);
                            }
                        });
                        arr2.map(item => {
                            let sum = 0;
                            let arr = [];
                            data2.map(item2 => {
                                if (item.accountname === item2.parentname) {
                                    sum = sum + item2.value;
                                    arr.push(item2);
                                };
                            });
                            arr.map(item3 => {
                                data2.map(item4 => {
                                    if (item3.accountname === item4.parentname) {
                                        sum = sum + item4.value;
                                        arr.push(item4);
                                        arr.splice(0,1);
                                    };
                                });
                            })
                            item[`ROValue`] = sum;
                        });
                        arr2.map(item => {
                            finalArr2.push(item);
                            data2.map(item2 => {
                                let subArr1 = [], subArr2 = [], subArr3 = [], subArr4 = [], subArr5 = [], subArr6 = [], subArr7 = [], subArr8 = [], subArr9 = [], subArr10 = [];
                                if (item.accountname === item2.parentname) {
                                    item2[`${item.parentaccount}`] = item2.accountname;
                                    item2[`${item.parentaccount}Value`] = item2.value; 
                                    item2.padding = "30px";
                                    finalArr2.push(item2);
                                    subArr1.push(item2);
                                };
                                subArr1.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "60px";
                                            finalArr2.push(item4);
                                            subArr2.push(item4);
                                        };
                                    });
                                    finalArr2.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.ROValue = sum;
                                        };
                                    });
                                });
                                subArr2.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "90px";
                                            finalArr2.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr2.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr3.push(item4);
                                        };
                                    });
                                    finalArr2.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.ROValue = sum;
                                        };
                                    });
                                });
                                subArr3.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "120px";
                                            finalArr2.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr2.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr4.push(item4);
                                        };
                                    });
                                    finalArr2.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.ROValue = sum;
                                        };
                                    });
                                });
                                subArr4.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "150px";
                                            finalArr2.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr2.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr5.push(item4);
                                        };
                                    });
                                    finalArr2.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.ROValue = sum;
                                        };
                                    });
                                });
                                subArr5.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "180px";
                                            finalArr2.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr2.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr6.push(item4);
                                        };
                                    });
                                    finalArr2.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.ROValue = sum;
                                        };
                                    });
                                });
                                subArr6.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "210px";
                                            finalArr2.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr2.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr7.push(item4);
                                        };
                                    });
                                    finalArr2.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.ROValue = sum;
                                        };
                                    });
                                });
                                subArr7.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "240px";
                                            finalArr2.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr2.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr8.push(item4);
                                        };
                                    });
                                    finalArr2.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.ROValue = sum;
                                        };
                                    });
                                });
                                subArr8.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "270px";
                                            finalArr2.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr2.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr9.push(item4);
                                        };
                                    });
                                    finalArr2.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.ROValue = sum;
                                        };
                                    });
                                });
                                subArr9.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "300px";
                                            finalArr2.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr2.splice(index+1, 0, item4);
                                                };
                                            });
                                            subArr10.push(item4);
                                        };
                                    });
                                    finalArr2.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.ROValue = sum;
                                        };
                                    });
                                });
                                subArr10.map(item3 => {
                                    let sum = 0;
                                    data2.map(item4 => {
                                        if (item3.accountname === item4.parentname) {
                                            item4[`${item.parentaccount}`] = item4.accountname;
                                            item4[`${item.parentaccount}Value`] = item4.value; 
                                            sum = sum + item4.value;
                                            item4.padding = "330px";
                                            finalArr2.forEach((item5, index) => {
                                                if (item5.accountname === item4.parentaccount) {
                                                    finalArr2.splice(index+1, 0, item4);
                                                };
                                            });
                                        };
                                    });
                                    finalArr2.map(item5 => {
                                        if (item3.accountname === item5.accountname) {
                                            item5.ROValue = sum;
                                        };
                                    });
                                });
                            });
                        });
                        const columns1 = [
                            {
                                "title": "Expenses",
                                "dataIndex": "EXP",
                                "key": "EXP",
                                ellipsis: true,
                                render: (text, record, index) => (
                                    <>
                                        {finalArr1.map((item, i) => {
                                            if (item.parentaccount === "EXP" && text === item.accountname && index === i) {
                                                return <span style={{ fontWeight: 800 }}>{text}</span>
                                            } else if (item.parentaccount !== "EXP" && text === item.accountname && index === i) {
                                                return <span style={{ marginLeft: item.padding }}>{text}</span>
                                            }
                                        })}
                                    </>
                                )
                            },
                            {
                                "title": `${currentFromDate} - ${currentToDate}`,
                                "dataIndex": "EXPValue",
                                "key": "EXPValue",
                                width: 160,
                                render: (text, record, index) => (
                                    <>
                                        {finalArr1.map((item, i) => {
                                            if (item.parentaccount === "EXP" && record.accountname === item.accountname && index === i) {
                                                return <div style={{ fontWeight: 800, textAlign: "center" }}>{currency === "INR" ? (record.EXPValue !== null ? record.EXPValue.toLocaleString('en-US') : record.EXPValue) : record.EXPValue.toFixed(2)}</div>
                                            } else if (item.parentaccount !== "EXP" && record.accountname === item.accountname && index === i) {
                                                return <div style={{ textAlign: "center" }}>{currency === "INR" ? (record.EXPValue !== null ? record.EXPValue.toLocaleString('en-US') : record.EXPValue) : record.EXPValue.toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            },
                        ];
                        const columns2 = [
                            {
                                "title": "Revenue from Operations",
                                "dataIndex": "RO",
                                "key": "RO",
                                ellipsis: true,
                                render: (text, record, index) => (
                                    <>
                                        {finalArr2.map((item, i) => {
                                            if (item.parentaccount === "RO" && text === item.accountname && index === i) {
                                                return <span style={{ fontWeight: 800 }}>{text}</span>
                                            } else if (item.parentaccount !== "RO" && text === item.accountname && index === i) {
                                                return <span style={{ marginLeft: item.padding }}>{text}</span>
                                            }
                                        })}
                                    </>
                                )
                            },
                            {
                                "title": `${currentFromDate} - ${currentToDate}`,
                                "dataIndex": "ROValue",
                                "key": "ROValue",
                                width: 160,
                                render: (text, record, index) => (
                                    <>
                                        {finalArr2.map((item, i) => {
                                            if (item.parentaccount === "RO" && record.accountname === item.accountname && index === i) {
                                                return <div style={{ fontWeight: 800, textAlign: "center" }}>{currency === "INR" ? (record["ROValue"] !== null ? record["ROValue"].toLocaleString('en-US') : record["ROValue"]) : record["ROValue"].toFixed(2)}</div>
                                            } else if (item.parentaccount !== "RO" && record.accountname === item.accountname && index === i) {
                                                return <div style={{ textAlign: "center" }}>{currency === "INR" ? (record["ROValue"] !== null ? record["ROValue"].toLocaleString('en-US') : record["ROValue"]) : record["ROValue"].toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            },
                        ];
                        setLoading(false);
                        setExpensesRowData(finalArr1);
                        setExpensesColumnData(columns1);
                        setOperationsRowData(finalArr2);
                        setOperationsColumnData(columns2);
                    } else {
                        setLoading(false);
                        setMainRowData(mainArray);
                        setMainColumnData(columns);
                    } 
                };
            } else {
                setLoading(false);
                message.error("No Data available");
            };
    };

    const handleConfirm = () => {
        headerform.submit();
        setPopoverVisible(false);
    };

    const handleVisiblePopoverChange = (newVisible) => {
        setPopoverVisible(newVisible);
    };

    const content = (
        <div style={{ height: selectedView === `Schedule ${convertToRoman(3)}` ? "300px" : "240px" }}>
            <Form layout="vertical" form={headerform} onFinish={onFinish}>
                <Form.Item name="businessUnit" label="Business unit" rules={[{ required: true }]} >
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
                <br />
                <Form.Item name="currentdates" label="Current Dates" rules={[{ required: true }]} >
                    <RangePicker format={dateFormat} onChange={currentDateChanges} />
                </Form.Item>
                <br />
                {selectedView === `Schedule ${convertToRoman(3)}` ?
                    // <Col className="gutter-row" span={2.8}>
                        <Form.Item name="previousdates" label="Comparable" style={{ marginBottom: "8px" }} >
                            <Popover
                                trigger={"click"}
                                placement={"bottom"}
                                content={previousDatesContent}
                                visible={visible}
                                onVisibleChange={handleVisibleChange}
                                title={<div style={{ textAlign: "center" }}>Previous Dates</div>}
                            >
                                <CopyFilled style={{ marginLeft: "30px" }} />
                            </Popover>
                        </Form.Item>
                    // </Col>
                     :
                    ""
                }
                <br />
                <Select
                    style={{ width: 310 }}
                    placeholder="Select a View"
                    value={selectedView}
                    onChange={handleSelectedView}
                >
                    <Option value={`Schedule ${convertToRoman(3)}`}>{`Schedule ${convertToRoman(3)}`}</Option>
                    <Option value={"Horizontal View"}>Horizontal View</Option>
                    <Option style={{ marginLeft: "30px" }} value={"Detailed View"}>Detailed View</Option>
                </Select>
                <br />
                <br />
                <Button  style={{ backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px", float: "right" }} onClick={handleConfirm}>
                    View
                </Button>
            </Form>
        </div>
    );

    return (
        <div>
            <Row>
                <Col span={6}>
                    <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>{`Profit & Loss (Schedule ${convertToRoman(3)})`}</h2>
                </Col>
                <Col span={8}>
                    <div style={{ display: "flex" }}>
                        <div style={{ textAlign: "center", marginTop: "1%" }}>{currentFromDate} - {currentToDate}</div>
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{ display: "flex" }}>
                        <div style={{ textAlign: "center", marginTop: "1%" }}>{selectedView}</div>
                    </div>
                </Col>
                <Col span={2}>
                    <Popover 
                        placement='leftTop'
                        trigger="click"
                        visible={popoverVisible}
                        onVisibleChange={handleVisiblePopoverChange}
                        content={content}
                    >
                        <Button style={{ float: "right" }}><FilterOutlined /></Button>
                    </Popover>
                </Col>
            </Row>
            <br />
            {/* <Row gutter={8}>
                <Col span={24} style={{ marginTop: "-10px", marginBottom: "8px" }}>
                    <Card>
                        <Row gutter={8}>
                            <Col span={17}>
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
                                            <Form.Item name="currentdates" label="Current Dates" style={{ marginBottom: "8px" }} rules={[{ required: true }]} >
                                                <RangePicker format={dateFormat} onChange={currentDateChanges} />
                                            </Form.Item>
                                        </Col>
                                        {selectedView === `Schedule ${convertToRoman(3)}` ?
                                            <Col className="gutter-row" span={2.8}>
                                                <Form.Item name="previousdates" label="Comparable" style={{ marginBottom: "8px" }} >
                                                    <Popover
                                                        trigger={"click"}
                                                        placement={"bottom"}
                                                        content={previousDatesContent}
                                                        visible={visible}
                                                        onVisibleChange={handleVisibleChange}
                                                        title={<div style={{ textAlign: "center" }}>Previous Dates</div>}
                                                    >
                                                        <CopyFilled style={{ marginLeft: "30px" }} />
                                                    </Popover>
                                                </Form.Item>
                                            </Col> :
                                            ""
                                        }
                                    </Row>
                                </Form>
                            </Col>
                            <Col soan={4}>
                                <Select
                                    style={{ float: "right", marginTop: "6%", marginBottom: "8px", width: 240 }}
                                    placeholder="Select a View"
                                    value={selectedView}
                                    onChange={handleSelectedView}
                                >
                                    <Option value={`Schedule ${convertToRoman(3)}`}>{`Schedule ${convertToRoman(3)}`}</Option>
                                    <Option value={"Horizontal View"}>Horizontal View</Option>
                                    <Option style={{ marginLeft: "30px" }} value={"Detailed View"}>Detailed View</Option>
                                </Select>
                            </Col>
                            <Col span={2}>
                                <Button  style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px", float: "right", marginTop: "15%" }} onClick={handleConfirm}>
                                    View
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row> */}
            {selectedView === `Schedule ${convertToRoman(3)}` ?
                <div style={{ marginLeft: mainColumnData.length === 2 ? "250px" : mainColumnData.length === 3 ? "180px" : mainColumnData.length === 4 ? "100px" : mainColumnData.length > 4 ?  "2px" : "2px", marginRight: mainColumnData.length === 2 ? "250px" : mainColumnData.length === 3 ? "180px" : mainColumnData.length === 4 ? "100px" : mainColumnData.length > 4 ? "2px" : "2px" }}>
                    <Table
                        dataSource={mainRowData}
                        columns={mainColumnData}
                        pagination={false}
                        size='small'
                        loading={{
                            spinning: loading,
                            indicator: <LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />,
                        }}
                        scroll={{ y: "78vh", x: "100%" }}
                    />
                </div> :
                <div style={{ display: "flex" }}>
                    <Table
                        dataSource={expensesRowData}
                        columns={expensesColumnData}
                        pagination={false}
                        size='small'
                        loading={{
                            spinning: loading,
                            indicator: <LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />,
                        }}
                        scroll={{ y: "78vh", x: "100%" }}
                    />
                    &nbsp;
                    <Table
                        dataSource={operationsRowData}
                        columns={operationsColumnData}
                        pagination={false}
                        size='small'
                        loading={{
                            spinning: loading,
                            indicator: <LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />,
                        }}
                        scroll={{ y: "78vh", x: "100%" }}
                    />
                </div>
            }
        </div>
    );
};

export default ProfitLossSchedule3;