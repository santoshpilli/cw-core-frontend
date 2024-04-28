import React, { useState } from 'react';
import { Row, Col, Form, DatePicker, Button, Select, Table, message, Popover } from 'antd';
import { LoadingOutlined, FilterOutlined } from "@ant-design/icons";
import { getProfitLossReportData, getBalanceSheetData, getCustomBusinessUnitForBalanceSheet } from '../../../services/generic';
import { useGlobalContext } from "../../../lib/storage";

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

const BalanceSheet = () => {
    const { globalStore } = useGlobalContext();
    const userPreferences = globalStore.userPreferences;
    const dateFormat = userPreferences.dateFormat;
    const userData = globalStore.userData;
    const currency = userData.currency;
    const [bunitData,setBunitData] = useState([]);
    const [currentFromDate, setCurrentFromDate] = useState('');
    const [currentToDate, setCurrentToDate] = useState('');
    const [selectedView,  setSelectedView] = useState(`Normal View`);
    const [assetsRowData, setAssetsRowData] = useState([]);
    const [assetsColumnData, setAssetsColumnData] = useState([]);
    const [liabilitiesEquityRowData, setLiabilitiesEquityRowData] = useState([]);
    const [liabilitiesEquityColumnData, setLiabilitiesEquityColumnData] = useState([]);
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
        const businessUnitResponse = await getCustomBusinessUnitForBalanceSheet();
        setBunitData(businessUnitResponse);
    };

    const currentDateChanges = (dates, dateStrings) => {
        setCurrentFromDate(dateStrings[0]);
        setCurrentToDate(dateStrings[1]);
    };

    const handleSelectedView = (value) => {
        setSelectedView(value);
        setMainColumnData([]);
        setAssetsColumnData([])
        setAssetsRowData([]);
        setLiabilitiesEquityColumnData([]);
        setLiabilitiesEquityRowData([]);
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
                const serverResponse2 = await getBalanceSheetData(jsonToSend)
                if (serverResponse2) {
                    let data1 = JSON.parse(serverResponse2.data.data.executeAPIBuilder); 
                    let data2 = JSON.parse(serverResponse2.data.data.executeAPIBuilder); 
                    const toTree = (arr) => {
                        for (let index = 0; index < arr.length; index++) {
                            arr[index].key = index;
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
                        }
                        return tree;
                    };
        
                    const treeRowData = toTree(data1);

                    const columns = [
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
                    if (selectedView === "Horizontal View") {
                        let arr1 = [], arr2 =[];
                        data2.map(item => {
                            if (item.parentaccount === "E&L") {
                                item[`${item.parentaccount}`] = item.accountname;
                                item[`${item.parentaccount}Value`] = item.value;
                                arr1.push(item);
                            }
                        });
                        data2.map(item => {
                            if (item.parentaccount === "AST") {
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
                            item["E&LValue"] = sum;
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
                            item[`ASTValue`] = sum;
                        });
                        const columns1 = [
                            {
                                "title": "Liabilities & Equity",
                                "dataIndex": "E&L",
                                "key": "E&L"
                            },
                            {
                                "title": `${currentFromDate} - ${currentToDate}`,
                                "dataIndex": "E&LValue",
                                "key": "E&LValue",
                                width: 160,
                                render: (text, record, index) => (
                                    <>
                                        {arr1.map((item, i) => {
                                            if (record.accountname === item.accountname && index === i) {
                                                return <div style={{ textAlign: "center" }}>{currency === "INR" ? (record["E&LValue"] !== null ? record["E&LValue"].toLocaleString('en-US') : record["E&LValue"]) : record["E&LValue"].toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            },
                        ];
                        const columns2 = [
                            {
                                "title": "ASSETS",
                                "dataIndex": "AST",
                                "key": "AST"
                            },
                            {
                                "title": `${currentFromDate} - ${currentToDate}`,
                                "dataIndex": "ASTValue",
                                "key": "ASTValue",
                                width: 160,
                                render: (text, record, index) => (
                                    <>
                                        {arr2.map((item, i) => {
                                            if (record.accountname === item.accountname && index === i) {
                                                return <div style={{ textAlign: "center" }}>{currency === "INR" ? (record.ASTValue !== null ? record.ASTValue.toLocaleString('en-US') : record.ASTValue) : record.ASTValue.toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            },
                        ];
                        setLoading(false);
                        setAssetsRowData(arr1);
                        setAssetsColumnData(columns1);
                        setLiabilitiesEquityRowData(arr2);
                        setLiabilitiesEquityColumnData(columns2);
                    } else if (selectedView === "Detailed View") {
                        let arr1 = [], arr2 =[];
                        let finalArr1 = [], finalArr2 =[];
                        data2.map(item => {
                            if (item.parentaccount === "E&L") {
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
                            item["E&LValue"] = sum;
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
                                            item5["E&LValue"] = sum;
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
                                            item5["E&LValue"] = sum;
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
                                            item5["E&LValue"] = sum;
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
                                            item5["E&LValue"] = sum;
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
                                            item5["E&LValue"] = sum;
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
                                            item5["E&LValue"] = sum;
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
                                            item5["E&LValue"] = sum;
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
                                            item5["E&LValue"] = sum;
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
                                            item5["E&LValue"] = sum;
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
                                            item5["E&LValue"] = sum;
                                        };
                                    });
                                });
                            });
                        });
                        data2.map(item => {
                            if (item.parentaccount === "AST") {
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
                            item[`ASTValue`] = sum;
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
                                            item5["ASTValue"] = sum;
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
                                            item5["ASTValue"] = sum;
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
                                            item5["ASTValue"] = sum;
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
                                            item5["ASTValue"] = sum;
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
                                            item5["ASTValue"] = sum;
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
                                            item5["ASTValue"] = sum;
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
                                            item5["ASTValue"] = sum;
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
                                            item5["ASTValue"] = sum;
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
                                            item5["ASTValue"] = sum;
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
                                            item5["ASTValue"] = sum;
                                        };
                                    });
                                });
                            });
                        });
                        const columns1 = [
                            {
                                "title": "Liabilities & Equity",
                                "dataIndex": "E&L",
                                "key": "E&L",
                                ellipsis: true,
                                render: (text, record, index) => (
                                    <>
                                        {finalArr1.map((item, i) => {
                                            if (item.parentaccount === "E&L" && text === item.accountname && index === i) {
                                                return <span style={{ fontWeight: 800 }}>{text}</span>
                                            } else if (item.parentaccount !== "E&L" && text === item.accountname && index === i) {
                                                return <span style={{ marginLeft: item.padding }}>{text}</span>
                                            }
                                        })}
                                    </>
                                )
                            },
                            {
                                "title": `${currentFromDate} - ${currentToDate}`,
                                "dataIndex": "E&LValue",
                                "key": "E&LValue",
                                width: 160,
                                render: (text, record, index) => (
                                    <>
                                        {finalArr1.map((item, i) => {
                                            if (item.parentaccount === "E&L" && record.accountname === item.accountname && index === i) {
                                                return <div style={{ fontWeight: 800, textAlign: "center" }}>{currency === "INR" ? (record["E&LValue"] !== null ? record["E&LValue"].toLocaleString('en-US') : record["E&LValue"]) : record["E&LValue"].toFixed(2)}</div>
                                            } else if (item.parentaccount !== "E&L" && record.accountname === item.accountname && index === i) {
                                                return <div style={{ textAlign: "center" }}>{currency === "INR" ? (record["E&LValue"] !== null ? record["E&LValue"].toLocaleString('en-US') : record["E&LValue"]) : record["E&LValue"].toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            },
                        ];
                        const columns2 = [
                            {
                                "title": "ASSETS",
                                "dataIndex": "AST",
                                "key": "AST",
                                ellipsis: true,
                                render: (text, record, index) => (
                                    <>
                                        {finalArr2.map((item, i) => {
                                            if (item.parentaccount === "AST" && text === item.accountname && index === i) {
                                                return <span style={{ fontWeight: 800 }}>{text}</span>
                                            } else if (item.parentaccount !== "AST" && text === item.accountname && index === i) {
                                                return <span style={{ marginLeft: item.padding }}>{text}</span>
                                            }
                                        })}
                                    </>
                                )
                            },
                            {
                                "title": `${currentFromDate} - ${currentToDate}`,
                                "dataIndex": "ASTValue",
                                "key": "ASTValue",
                                width: 160,
                                render: (text, record, index) => (
                                    <>
                                        {finalArr2.map((item, i) => {
                                            if (item.parentaccount === "AST" && record.accountname === item.accountname && index === i) {
                                                return <div style={{ fontWeight: 800, textAlign: "center" }}>{currency === "INR" ? (record["ASTValue"] !== null ? record["ASTValue"].toLocaleString('en-US') : record["ASTValue"]) : record["ASTValue"].toFixed(2)}</div>
                                            } else if (item.parentaccount !== "AST" && record.accountname === item.accountname && index === i) {
                                                return <div style={{ textAlign: "center" }}>{currency === "INR" ? (record["ASTValue"] !== null ? record["ASTValue"].toLocaleString('en-US') : record["ASTValue"]) : record["ASTValue"].toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            },
                        ];
                        setLoading(false);
                        setAssetsRowData(finalArr1);
                        setAssetsColumnData(columns1);
                        setLiabilitiesEquityRowData(finalArr2);
                        setLiabilitiesEquityColumnData(columns2);
                    } else {
                        setLoading(false);
                        setMainRowData(treeRowData);
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

    const handleVisibleChange = (newVisible) => {
        setPopoverVisible(newVisible);
    };

    const content = (
        <div style={{ height: "220px" }}>
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
                <Select
                    style={{ width: 310 }}
                    placeholder="Select a View"
                    value={selectedView}
                    onChange={handleSelectedView}
                >
                    <Option value={"Normal View"}>Normal View</Option>
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
                    <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>{`Balance Sheet`}</h2>
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
                        onVisibleChange={handleVisibleChange}
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
                                    <Option value={`Normal View`}>{`Normal View`}</Option>
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
            {selectedView === `Normal View` ?
                <div>
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
                        dataSource={assetsRowData}
                        columns={assetsColumnData}
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
                        dataSource={liabilitiesEquityRowData}
                        columns={liabilitiesEquityColumnData}
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

export default BalanceSheet;