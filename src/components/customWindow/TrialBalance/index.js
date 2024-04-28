import React, { useEffect, useState } from 'react';
import { Row, Col, Form, DatePicker, Button, Select, Popover, Table, Switch, Checkbox} from 'antd';
import { LoadingOutlined, FilterOutlined, ExportOutlined } from "@ant-design/icons";
import { getTrialBalanceData, getCustomBusinessUnitForProfitLossStatement } from '../../../services/generic';
import { useGlobalContext } from "../../../lib/storage";
import jsPDF from "jspdf";
import "jspdf-autotable";

const { Option } = Select;
const { RangePicker } = DatePicker;

const TrialBalance = () => {
    const { globalStore } = useGlobalContext();
    const userPreferences = globalStore.userPreferences;
    const dateFormat = userPreferences.dateFormat;
    const userData = globalStore.userData;
    const currency = userData.currency;
    const [bunitData,setBunitData] = useState([]);
    const [currentFromDate, setCurrentFromDate] = useState('');
    const [currentToDate, setCurrentToDate] = useState('');
    const [selectedView,  setSelectedView] = useState(`Consolidated View`);
    const [expensesRevenueRowData, setExpensesRevenueRowData] = useState([]);
    const [expensesRevenueColumnData, setExpensesRevenueColumnData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [checkedSwitch, setCheckedSwitch] = useState(false);
    const [checkedCheckbox, setCheckedCheckbox] = useState(false);
    const [mainData1, setMainData1] = useState([]);
    const [mainData2, setMainData2] = useState([]);
    const [headerform] = Form.useForm();

    const getBusinessUnit = async () =>{
        const businessUnitResponse = await getCustomBusinessUnitForProfitLossStatement();
        setBunitData(businessUnitResponse);
    };

    const currentDateChanges = (dates, dateStrings) => {
        setCurrentFromDate(dateStrings[0]);
        setCurrentToDate(dateStrings[1]);
    };

    const handleSelectedView = (value) => {
        setSelectedView(value);
        setExpensesRevenueColumnData([])
        setExpensesRevenueRowData([]);
    };

    const getColumns = (data2) => {
        let arr1 = [], arr2 = [];
        let finalArr1 = [], finalArr2 = [];
        data2.forEach(item => {
            if (item.parentaccount === "BS") {
                item[`${item.parentaccount}`] = item.accountname;
                item.padding = 0;
                arr1.push(item);
            }
        });
        arr1.forEach(item => {
            let subArr1 = [], subArr2 = [], subArr3 = [], subArr4 = [], subArr5 = [], subArr6 = [], subArr7 = [], subArr8 = [], subArr9 = [], subArr10 = [];
            data2.forEach(item2 => {
                if (item.accountname === item2.parentname) {
                    subArr1.push(item2);
                };
            });
            subArr1.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr2.push(item4);
                    };
                });
            });
            subArr2.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr3.push(item4);
                    };
                });
            });
            subArr3.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr4.push(item4);
                    };
                });
            });
            subArr4.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr5.push(item4);
                    };
                });
            });
            subArr5.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr6.push(item4);
                    };
                });
            });
            subArr6.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr7.push(item4);
                    };
                });
            });
            subArr7.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr8.push(item4);
                    };
                });
            });
            subArr8.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr9.push(item4);
                    };
                });
            });
            subArr9.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr10.push(item4);
                    };
                });
            });
            subArr10.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                    };
                });
            });
        });
        arr1.forEach(item => {
            finalArr1.push(item);
            data2.forEach(item2 => {
                let subArr1 = [], subArr2 = [], subArr3 = [], subArr4 = [], subArr5 = [], subArr6 = [], subArr7 = [], subArr8 = [], subArr9 = [], subArr10 = [];
                if (item.accountname === item2.parentname) {
                    item2[`${item.parentaccount}`] = item2.accountname;
                    item2.padding = 30;
                    finalArr1.push(item2);
                    subArr1.push(item2);
                };
                subArr1.forEach(item3 => {
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 60;
                            finalArr1.push(item4);
                            subArr2.push(item4);
                        };
                    });
                });
                subArr2.forEach(item3 => {
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 90;
                            finalArr1.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr1.splice(index+1, 0, item4);
                                };
                            });
                            subArr3.push(item4);
                        };
                    });
                });
                subArr3.forEach(item3 => {        
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 120;
                            finalArr1.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr1.splice(index+1, 0, item4);
                                };
                            });
                            subArr4.push(item4);
                        };
                    });
                });
                subArr4.forEach(item3 => {       
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 150;
                            finalArr1.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr1.splice(index+1, 0, item4);
                                };
                            });
                            subArr5.push(item4);
                        };
                    });
                });
                subArr5.forEach(item3 => {       
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 180;
                            finalArr1.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr1.splice(index+1, 0, item4);
                                };
                            });
                            subArr6.push(item4);
                        };
                    });
                });
                subArr6.forEach(item3 => {    
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 210;
                            finalArr1.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr1.splice(index+1, 0, item4);
                                };
                            });
                            subArr7.push(item4);
                        };
                    });
                });
                subArr7.forEach(item3 => {       
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 240;
                            finalArr1.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr1.splice(index+1, 0, item4);
                                };
                            });
                            subArr8.push(item4);
                        };
                    });
                });
                subArr8.forEach(item3 => {       
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 270;
                            finalArr1.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr1.splice(index+1, 0, item4);
                                };
                            });
                            subArr9.push(item4);
                        };
                    });
                });
                subArr9.forEach(item3 => {        
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 300;
                            finalArr1.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr1.splice(index+1, 0, item4);
                                };
                            });
                            subArr10.push(item4);
                        };
                    });
                });
                subArr10.forEach(item3 => {  
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 330;
                            finalArr1.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr1.splice(index+1, 0, item4);
                                };
                            });
                        };
                    });
                });
            });
        });
        data2.forEach(item => {
            if (item.parentaccount === "P&L") {
                item[`${item.parentaccount}`] = item.accountname;
                item.padding = 0;
                arr2.push(item);
            }
        });
        arr2.forEach(item => {

            let subArr1 = [], subArr2 = [], subArr3 = [], subArr4 = [], subArr5 = [], subArr6 = [], subArr7 = [], subArr8 = [], subArr9 = [], subArr10 = [];
            data2.forEach(item2 => {
                if (item.accountname === item2.parentname) {
                    subArr1.push(item2);
                };
            });
            subArr1.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr2.push(item4);
                    };
                });
            });
            subArr2.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr3.push(item4);
                    };
                });
            });
            subArr3.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr4.push(item4);
                    };
                });
            });
            subArr4.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr5.push(item4);
                    };
                });
            });
            subArr5.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr6.push(item4);
                    };
                });
            });
            subArr6.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr7.push(item4);
                    };
                });
            });
            subArr7.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr8.push(item4);
                    };
                });
            });
            subArr8.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr9.push(item4);
                    };
                });
            });
            subArr9.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                        subArr10.push(item4);
                    };
                });
            });
            subArr10.forEach(item3 => {
                data2.forEach(item4 => {
                    if (item3.accountname === item4.parentname) {
                    };
                });
            });
        });
        arr2.forEach(item => {
            finalArr2.push(item);
            data2.forEach(item2 => {
                let subArr1 = [], subArr2 = [], subArr3 = [], subArr4 = [], subArr5 = [], subArr6 = [], subArr7 = [], subArr8 = [], subArr9 = [], subArr10 = [];
                if (item.accountname === item2.parentname) {
                    item2[`${item.parentaccount}`] = item2.accountname;
                    item2.padding = 30;
                    finalArr2.push(item2);
                    subArr1.push(item2);
                };
                subArr1.forEach(item3 => {       
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 60;
                            finalArr2.push(item4);
                            subArr2.push(item4);
                        };
                    });
                });
                subArr2.forEach(item3 => {      
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 90;
                            finalArr2.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr2.splice(index+1, 0, item4);
                                };
                            });
                            subArr3.push(item4);
                        };
                    });
                });
                subArr3.forEach(item3 => {
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 120;
                            finalArr2.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr2.splice(index+1, 0, item4);
                                };
                            });
                            subArr4.push(item4);
                        };
                    });
                });
                subArr4.forEach(item3 => {      
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 150;
                            finalArr2.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr2.splice(index+1, 0, item4);
                                };
                            });
                            subArr5.push(item4);
                        };
                    });
                });
                subArr5.forEach(item3 => {
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 180;
                            finalArr2.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr2.splice(index+1, 0, item4);
                                };
                            });
                            subArr6.push(item4);
                        };
                    });
                });
                subArr6.forEach(item3 => {       
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 210;
                            finalArr2.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr2.splice(index+1, 0, item4);
                                };
                            });
                            subArr7.push(item4);
                        };
                    });
                });
                subArr7.forEach(item3 => {       
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 240;
                            finalArr2.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr2.splice(index+1, 0, item4);
                                };
                            });
                            subArr8.push(item4);
                        };
                    });
                });
                subArr8.forEach(item3 => {       
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 270;
                            finalArr2.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr2.splice(index+1, 0, item4);
                                };
                            });
                            subArr9.push(item4);
                        };
                    });
                });
                subArr9.forEach(item3 => {    
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 300;
                            finalArr2.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr2.splice(index+1, 0, item4);
                                };
                            });
                            subArr10.push(item4);
                        };
                    });
                });
                subArr10.forEach(item3 => {     
                    data2.forEach(item4 => {
                        if (item3.acctnumber === item4.parentaccount) {
                            item4[`${item.parentaccount}`] = item4.accountname;
                            item4.padding = 330;
                            finalArr2.forEach((item5, index) => {
                                if (item5.acctnumber === item4.parentaccount) {
                                    finalArr2.splice(index+1, 0, item4);
                                };
                            });
                        };
                    });
                });
            });
        });
        finalArr1.forEach(item => {
            item["EXP"] = item.BS
        });
        finalArr2.forEach(item => {
            item["EXP"] = item["P&L"];
        });
        const nesting1 = {};
        finalArr1.forEach((item) => {
            const { parentaccount, acctnumber } = item;

            if (!nesting1[acctnumber]) {
                nesting1[acctnumber] = [acctnumber];
            }

            if (!nesting1[parentaccount] && parentaccount !== null) {
                nesting1[parentaccount] = [parentaccount];
            }

            if (parentaccount !== null) {
                nesting1[parentaccount].push(acctnumber);
            }
        });
        let sum1Arr1 = [], sum1Arr2 = [], sum1Arr3 = [], sum1Arr4 = [], sum1Arr5 = [], sum1Arr6 = [], sum1Arr7 = [], sum1Arr8 = [], sum1Arr9 = [], sum1Arr10 = [], sum1Arr11 = [], sum1Arr12 = [];
        finalArr1.forEach(item => {
            if (item.padding === 330){
                sum1Arr1.push(item.acctnumber);
            };
        });
        finalArr1.forEach(item => {
            if (item.padding === 300){
                sum1Arr2.push(item.acctnumber);
            };
        });
        finalArr1.forEach(item => {
            if (item.padding === 270){
                sum1Arr3.push(item.acctnumber);
            };
        });
        finalArr1.forEach(item => {
            if (item.padding === 240){
                sum1Arr4.push(item.acctnumber);
            };
        });
        finalArr1.forEach(item => {
            if (item.padding === 210){
                sum1Arr5.push(item.acctnumber);
            };
        });
        finalArr1.forEach(item => {
            if (item.padding === 180){
                sum1Arr6.push(item.acctnumber);
            };
        });
        finalArr1.forEach(item => {
            if (item.padding === 150){
                sum1Arr7.push(item.acctnumber);
            };
        });
        finalArr1.forEach(item => {
            if (item.padding === 120){
                sum1Arr8.push(item.acctnumber);
            };
        });
        finalArr1.forEach(item => {
            if (item.padding === 90){
                sum1Arr9.push(item.acctnumber);
            };
        });
        finalArr1.forEach(item => {
            if (item.padding === 60){
                sum1Arr10.push(item.acctnumber);
            };
        });
        finalArr1.forEach(item => {
            if (item.padding === 30){
                sum1Arr11.push(item.acctnumber);
            };
        });
        finalArr1.forEach(item => {
            if (item.padding === 0){
                sum1Arr12.push(item.acctnumber);
            };
        });
        sum1Arr1.forEach(item => {
            Object.keys(nesting1).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting1)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting1)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr1.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr1.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum1Arr2.forEach(item => {
            Object.keys(nesting1).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting1)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting1)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr1.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr1.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum1Arr3.forEach(item => {
            Object.keys(nesting1).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting1)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting1)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr1.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr1.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum1Arr4.forEach(item => {
            Object.keys(nesting1).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting1)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting1)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr1.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr1.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum1Arr5.forEach(item => {
            Object.keys(nesting1).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting1)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting1)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr1.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr1.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum1Arr6.forEach(item => {
            Object.keys(nesting1).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting1)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting1)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr1.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr1.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum1Arr7.forEach(item => {
            Object.keys(nesting1).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting1)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting1)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr1.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr1.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum1Arr8.forEach(item => {
            Object.keys(nesting1).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting1)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting1)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr1.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr1.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum1Arr9.forEach(item => {
            Object.keys(nesting1).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting1)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting1)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr1.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr1.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum1Arr10.forEach(item => {
            Object.keys(nesting1).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting1)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting1)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr1.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr1.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum1Arr11.forEach(item => {
            Object.keys(nesting1).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting1)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting1)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr1.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr1.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum1Arr12.forEach(item => {
            Object.keys(nesting1).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting1)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting1)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr1.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr1.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        const nesting2 = {};
        finalArr2.forEach((item) => {
            const { parentaccount, acctnumber } = item;

            if (!nesting2[acctnumber]) {
                nesting2[acctnumber] = [acctnumber];
            }

            if (!nesting2[parentaccount] && parentaccount !== null) {
                nesting2[parentaccount] = [parentaccount];
            }

            if (parentaccount !== null) {
                nesting2[parentaccount].push(acctnumber);
            }
        });
        let sum2Arr1 = [], sum2Arr2 = [], sum2Arr3 = [], sum2Arr4 = [], sum2Arr5 = [], sum2Arr6 = [], sum2Arr7 = [], sum2Arr8 = [], sum2Arr9 = [], sum2Arr10 = [], sum2Arr11 = [], sum2Arr12 = [];
        finalArr2.forEach(item => {
            if (item.padding === 330){
                sum2Arr1.push(item.acctnumber);
            };
        });
        finalArr2.forEach(item => {
            if (item.padding === 300){
                sum2Arr2.push(item.acctnumber);
            };
        });
        finalArr2.forEach(item => {
            if (item.padding === 270){
                sum2Arr3.push(item.acctnumber);
            };
        });
        finalArr2.forEach(item => {
            if (item.padding === 240){
                sum2Arr4.push(item.acctnumber);
            };
        });
        finalArr2.forEach(item => {
            if (item.padding === 210){
                sum2Arr5.push(item.acctnumber);
            };
        });
        finalArr2.forEach(item => {
            if (item.padding === 180){
                sum2Arr6.push(item.acctnumber);
            };
        });
        finalArr2.forEach(item => {
            if (item.padding === 150){
                sum2Arr7.push(item.acctnumber);
            };
        });
        finalArr2.forEach(item => {
            if (item.padding === 120){
                sum2Arr8.push(item.acctnumber);
            };
        });
        finalArr2.forEach(item => {
            if (item.padding === 90){
                sum2Arr9.push(item.acctnumber);
            };
        });
        finalArr2.forEach(item => {
            if (item.padding === 60){
                sum2Arr10.push(item.acctnumber);
            };
        });
        finalArr2.forEach(item => {
            if (item.padding === 30){
                sum2Arr11.push(item.acctnumber);
            };
        });
        finalArr2.forEach(item => {
            if (item.padding === 0){
                sum2Arr12.push(item.acctnumber);
            };
        });
        sum2Arr1.forEach(item => {
            Object.keys(nesting2).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting2)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting2)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr2.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr2.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum2Arr2.forEach(item => {
            Object.keys(nesting2).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting2)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting2)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr2.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr2.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum2Arr3.forEach(item => {
            Object.keys(nesting2).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting2)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting2)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr2.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr2.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum2Arr4.forEach(item => {
            Object.keys(nesting2).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting2)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting2)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr2.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr2.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum2Arr5.forEach(item => {
            Object.keys(nesting2).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting2)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting2)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr2.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr2.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum2Arr6.forEach(item => {
            Object.keys(nesting2).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting2)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting2)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr2.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr2.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum2Arr7.forEach(item => {
            Object.keys(nesting2).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting2)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting2)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr2.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr2.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum2Arr8.forEach(item => {
            Object.keys(nesting2).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting2)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting2)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr2.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr2.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum2Arr9.forEach(item => {
            Object.keys(nesting2).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting2)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting2)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr2.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr2.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum2Arr10.forEach(item => {
            Object.keys(nesting2).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting2)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting2)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr2.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr2.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum2Arr11.forEach(item => {
            Object.keys(nesting2).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting2)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting2)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr2.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr2.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        sum2Arr12.forEach(item => {
            Object.keys(nesting2).forEach((key, index) => {
                if (item === key) {
                    if (Object.values(nesting2)[index].length > 1) {
                        let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
                        Object.values(nesting2)[index].forEach((value, ind) => {
                            if (ind !== 0) {
                                finalArr2.forEach(final => {
                                    if (final.acctnumber === value) {
                                        sum1 = sum1 + final.opening;
                                        sum2 = sum2 + final.debit;
                                        sum3 = sum3 + final.credit;
                                        sum4 = sum4 + final.closing;
                                    }
                                });
                            }
                        });
                        finalArr2.forEach(final => {
                            if (final.acctnumber === item) {
                                final.opening = sum1;
                                final.debit = sum2;
                                final.credit = sum3;
                                final.closing = sum4;
                            }
                        });
                    }
                }
            });
        });
        let finalArr = [...finalArr1, ...finalArr2];
        finalArr.forEach(item => {
            item.EXP = `${item.acctnumber} - ${item.accountname}`;
        });
        return finalArr;
    }

    const onFinish = async (values) => {
            setLoading(true);
            const valuesArray = Object.values(values);
            let valuesObj = {};
            valuesObj['cs_bunit_id'] = valuesArray[0];
            valuesObj['datefrom'] = currentFromDate.split("-").reverse().join("-");
            valuesObj['dateto'] = currentToDate.split("-").reverse().join("-");
    
            const stringifiedJSON = JSON.stringify(valuesObj);
            const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
    
                const serverResponse2 = await getTrialBalanceData(jsonToSend);
                if (serverResponse2) {
                    const data2 = serverResponse2;
                    if (selectedView === "Consolidated View") {
                        let arr = getColumns(data2);
                        let finalArr = arr.filter(item => {
                            if (item.padding === 0 || item.padding === 30) {
                                return item;
                            };
                        });

                        const columns = [
                            {
                                "title": "Account Name",
                                "dataIndex": "EXP",
                                "key": "EXP",
                                width: 550,
                                ellipsis: true,
                                fixed: "left",
                                render: (text, record, index) => (
                                    <>
                                        {finalArr.map((item, i) => {
                                            if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && text === item.EXP && index === i) {
                                                return <span style={{ fontWeight: 800 }}>{text}</span>
                                            } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && text === item.EXP && index === i) {
                                                return <span style={{ marginLeft: item.padding }}>{text}</span>
                                            }
                                        })}
                                    </>
                                )
                            },
                            {
                                "title": <div style={{ textAlign: "right" }}>Opening</div>,
                                "dataIndex": "opening",
                                "key": "opening",
                                render: (text, record, index) => (
                                    <>
                                        {finalArr.map((item, i) => {
                                            if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.opening !== undefined ? record.opening.toLocaleString('en-US') : record.opening) : record.opening.toFixed(2)}</div>
                                            } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.opening !== undefined ? record.opening.toLocaleString('en-US') : record.opening) : record.opening.toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            },
                            {
                                "title": <div style={{ textAlign: "right" }}>Debit</div>,
                                "dataIndex": "debit",
                                "key": "debit",
                                render: (text, record, index) => (
                                    <>
                                        {finalArr.map((item, i) => {
                                            if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.debit !== undefined ? record.debit.toLocaleString('en-US') : record.debit) : record.debit.toFixed(2)}</div>
                                            } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.debit !== undefined ? record.debit.toLocaleString('en-US') : record.debit) : record.debit.toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            },
                            {
                                "title": <div style={{ textAlign: "right" }}>Credit</div>,
                                "dataIndex": "credit",
                                "key": "credit",
                                render: (text, record, index) => (
                                    <>
                                        {finalArr.map((item, i) => {
                                            if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.credit !== undefined ? record.credit.toLocaleString('en-US') : record.credit) : record.credit.toFixed(2)}</div>
                                            } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.credit !== undefined ? record.credit.toLocaleString('en-US') : record.credit) : record.credit.toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            },
                            {
                                "title": <div style={{ textAlign: "right" }}>Closing</div>,
                                "dataIndex": "closing",
                                "key": "closing",
                                render: (text, record, index) => (
                                    <>
                                        {finalArr.map((item, i) => {
                                            if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.closing !== undefined ? record.closing.toLocaleString('en-US') : record.closing) : record.closing.toFixed(2)}</div>
                                            } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.closing !== undefined ? record.closing.toLocaleString('en-US') : record.closing) : record.closing.toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            }
                        ];
                        
                        setLoading(false);
                        setExpensesRevenueRowData(finalArr);
                        setExpensesRevenueColumnData(columns);

                    } else if (selectedView === "Detailed View") {
                        setMainData1(data2);
                        setMainData2(data2);
                        let finalArr = getColumns(data2);
            
                        const columns = [
                            {
                                "title": "Account Name",
                                "dataIndex": "EXP",
                                "key": "EXP",
                                width: 550,
                                ellipsis: true,
                                fixed: "left",
                                render: (text, record, index) => (
                                    <>
                                        {finalArr.map((item, i) => {
                                            if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && text === item.EXP && index === i) {
                                                return <span style={{ fontWeight: 800 }}>{text}</span>
                                            } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && text === item.EXP && index === i) {
                                                return <span style={{ marginLeft: item.padding }}>{text}</span>
                                            }
                                        })}
                                    </>
                                )
                            },
                            {
                                "title": <div style={{ textAlign: "right" }}>Opening</div>,
                                "dataIndex": "opening",
                                "key": "opening",
                                render: (text, record, index) => (
                                    <>
                                        {finalArr.map((item, i) => {
                                            if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.opening !== undefined ? record.opening.toLocaleString('en-US') : record.opening) : record.opening.toFixed(2)}</div>
                                            } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.opening !== undefined ? record.opening.toLocaleString('en-US') : record.opening) : record.opening.toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            },
                            {
                                "title": <div style={{ textAlign: "right" }}>Debit</div>,
                                "dataIndex": "debit",
                                "key": "debit",
                                render: (text, record, index) => (
                                    <>
                                        {finalArr.map((item, i) => {
                                            if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.debit !== undefined ? record.debit.toLocaleString('en-US') : record.debit) : record.debit.toFixed(2)}</div>
                                            } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.debit !== undefined ? record.debit.toLocaleString('en-US') : record.debit) : record.debit.toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            },
                            {
                                "title": <div style={{ textAlign: "right" }}>Credit</div>,
                                "dataIndex": "credit",
                                "key": "credit",
                                render: (text, record, index) => (
                                    <>
                                        {finalArr.map((item, i) => {
                                            if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.credit !== undefined ? record.credit.toLocaleString('en-US') : record.credit) : record.credit.toFixed(2)}</div>
                                            } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.credit !== undefined ? record.credit.toLocaleString('en-US') : record.credit) : record.credit.toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            },
                            {
                                "title": <div style={{ textAlign: "right" }}>Closing</div>,
                                "dataIndex": "closing",
                                "key": "closing",
                                render: (text, record, index) => (
                                    <>
                                        {finalArr.map((item, i) => {
                                            if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.closing !== undefined ? record.closing.toLocaleString('en-US') : record.closing) : record.closing.toFixed(2)}</div>
                                            } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                                return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.closing !== undefined ? record.closing.toLocaleString('en-US') : record.closing) : record.closing.toFixed(2)}</div>
                                            }
                                        })}
                                    </>
                                )
                            }
                        ];
                        setExpensesRevenueRowData(finalArr);
                        setExpensesRevenueColumnData(columns);
                        setLoading(false);
                    }
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
                    <Option value={"Consolidated View"}>Consolidated View</Option>
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

    const handleCheckbox = () => {
        setCheckedCheckbox(!checkedCheckbox);
    };

    const handleSwitch = (check) => {
        setCheckedSwitch(check);
    };

    useEffect(() => {
        if (mainData1.length > 0 || mainData2.length > 0) {
            setLoading(true);
            if (checkedCheckbox === false) {
                mainData1.map(item => {
                    return delete item["children"];
                });
                mainData1.map((item, index)=> {
                    return item.key = index;
                });
                let finalArr = getColumns(mainData1);
    
                const columns = [
                    {
                        "title": "Account Name",
                        "dataIndex": "EXP",
                        "key": "EXP",
                        width: 550,
                        ellipsis: true,
                        fixed: "left",
                        render: (text, record, index) => (
                            <>
                                {finalArr.map((item, i) => {
                                    if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && text === item.EXP && index === i) {
                                        return <span style={{ fontWeight: 800 }}>{text}</span>
                                    } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && text === item.EXP && index === i) {
                                        return <span style={{ marginLeft: item.padding }}>{text}</span>
                                    }
                                })}
                            </>
                        )
                    },
                    {
                        "title": <div style={{ textAlign: "right" }}>Opening</div>,
                        "dataIndex": "opening",
                        "key": "opening",
                        render: (text, record, index) => (
                            <>
                                {finalArr.map((item, i) => {
                                    if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.opening !== undefined ? record.opening.toLocaleString('en-US') : record.opening) : record.opening.toFixed(2)}</div>
                                    } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.opening !== undefined ? record.opening.toLocaleString('en-US') : record.opening) : record.opening.toFixed(2)}</div>
                                    }
                                })}
                            </>
                        )
                    },
                    {
                        "title": <div style={{ textAlign: "right" }}>Debit</div>,
                        "dataIndex": "debit",
                        "key": "debit",
                        render: (text, record, index) => (
                            <>
                                {finalArr.map((item, i) => {
                                    if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.debit !== undefined ? record.debit.toLocaleString('en-US') : record.debit) : record.debit.toFixed(2)}</div>
                                    } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.debit !== undefined ? record.debit.toLocaleString('en-US') : record.debit) : record.debit.toFixed(2)}</div>
                                    }
                                })}
                            </>
                        )
                    },
                    {
                        "title": <div style={{ textAlign: "right" }}>Credit</div>,
                        "dataIndex": "credit",
                        "key": "credit",
                        render: (text, record, index) => (
                            <>
                                {finalArr.map((item, i) => {
                                    if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.credit !== undefined ? record.credit.toLocaleString('en-US') : record.credit) : record.credit.toFixed(2)}</div>
                                    } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.credit !== undefined ? record.credit.toLocaleString('en-US') : record.credit) : record.credit.toFixed(2)}</div>
                                    }
                                })}
                            </>
                        )
                    },
                    {
                        "title": <div style={{ textAlign: "right" }}>Closing</div>,
                        "dataIndex": "closing",
                        "key": "closing",
                        render: (text, record, index) => (
                            <>
                                {finalArr.map((item, i) => {
                                    if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.closing !== undefined ? record.closing.toLocaleString('en-US') : record.closing) : record.closing.toFixed(2)}</div>
                                    } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.closing !== undefined ? record.closing.toLocaleString('en-US') : record.closing) : record.closing.toFixed(2)}</div>
                                    }
                                })}
                            </>
                        )
                    }
                ];
                setExpensesRevenueRowData(finalArr);
                setExpensesRevenueColumnData(columns);
                setLoading(false);
            } else {
                mainData1.map(item => {
                    return delete item["children"];
                });
                mainData1.map((item, index)=> {
                    return item.key = index;
                });
                let finalArr = getColumns(mainData1);

                let finalFilteredArr = finalArr.filter(item => {
                    if (item.credit !== 0 || item.debit !== 0 || item.opening !== 0 || item.closing !== 0) {
                        return item;
                    };
                })
    
                const columns = [
                    {
                        "title": "Account Name",
                        "dataIndex": "EXP",
                        "key": "EXP",
                        width: 550,
                        ellipsis: true,
                        fixed: "left",
                        render: (text, record, index) => (
                            <>
                                {finalFilteredArr.map((item, i) => {
                                    if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && text === item.EXP && index === i) {
                                        return <span style={{ fontWeight: 800 }}>{text}</span>
                                    } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && text === item.EXP && index === i) {
                                        return <span style={{ marginLeft: item.padding }}>{text}</span>
                                    }
                                })}
                            </>
                        )
                    },
                    {
                        "title": <div style={{ textAlign: "right" }}>Opening</div>,
                        "dataIndex": "opening",
                        "key": "opening",
                        render: (text, record, index) => (
                            <>
                                {finalFilteredArr.map((item, i) => {
                                    if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.opening !== undefined ? record.opening.toLocaleString('en-US') : record.opening) : record.opening.toFixed(2)}</div>
                                    } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.opening !== undefined ? record.opening.toLocaleString('en-US') : record.opening) : record.opening.toFixed(2)}</div>
                                    }
                                })}
                            </>
                        )
                    },
                    {
                        "title": <div style={{ textAlign: "right" }}>Debit</div>,
                        "dataIndex": "debit",
                        "key": "debit",
                        render: (text, record, index) => (
                            <>
                                {finalFilteredArr.map((item, i) => {
                                    if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.debit !== undefined ? record.debit.toLocaleString('en-US') : record.debit) : record.debit.toFixed(2)}</div>
                                    } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.debit !== undefined ? record.debit.toLocaleString('en-US') : record.debit) : record.debit.toFixed(2)}</div>
                                    }
                                })}
                            </>
                        )
                    },
                    {
                        "title": <div style={{ textAlign: "right" }}>Credit</div>,
                        "dataIndex": "credit",
                        "key": "credit",
                        render: (text, record, index) => (
                            <>
                                {finalFilteredArr.map((item, i) => {
                                    if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.credit !== undefined ? record.credit.toLocaleString('en-US') : record.credit) : record.credit.toFixed(2)}</div>
                                    } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.credit !== undefined ? record.credit.toLocaleString('en-US') : record.credit) : record.credit.toFixed(2)}</div>
                                    }
                                })}
                            </>
                        )
                    },
                    {
                        "title": <div style={{ textAlign: "right" }}>Closing</div>,
                        "dataIndex": "closing",
                        "key": "closing",
                        render: (text, record, index) => (
                            <>
                                {finalFilteredArr.map((item, i) => {
                                    if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.closing !== undefined ? record.closing.toLocaleString('en-US') : record.closing) : record.closing.toFixed(2)}</div>
                                    } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.closing !== undefined ? record.closing.toLocaleString('en-US') : record.closing) : record.closing.toFixed(2)}</div>
                                    }
                                })}
                            </>
                        )
                    }
                ];
                setExpensesRevenueRowData(finalFilteredArr);
                setExpensesRevenueColumnData(columns);
                setLoading(false);
            };
        };
    }, [checkedCheckbox]);

    useEffect(() => {
        if (mainData1.length > 0 || mainData2.length > 0) {
            setLoading(true);
            if (checkedSwitch === false) {
                mainData1.map(item => {
                    return delete item["children"];
                });
                mainData1.map((item, index)=> {
                    return item.key = index;
                });
                let finalArr = getColumns(mainData1);
    
                const columns = [
                    {
                        "title": "Account Name",
                        "dataIndex": "EXP",
                        "key": "EXP",
                        width: 550,
                        ellipsis: true,
                        fixed: "left",
                        render: (text, record, index) => (
                            <>
                                {finalArr.map((item, i) => {
                                    if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && text === item.EXP && index === i) {
                                        return <span style={{ fontWeight: 800 }}>{text}</span>
                                    } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && text === item.EXP && index === i) {
                                        return <span style={{ marginLeft: item.padding }}>{text}</span>
                                    }
                                })}
                            </>
                        )
                    },
                    {
                        "title": <div style={{ textAlign: "right" }}>Opening</div>,
                        "dataIndex": "opening",
                        "key": "opening",
                        render: (text, record, index) => (
                            <>
                                {finalArr.map((item, i) => {
                                    if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.opening !== undefined ? record.opening.toLocaleString('en-US') : record.opening) : record.opening.toFixed(2)}</div>
                                    } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.opening !== undefined ? record.opening.toLocaleString('en-US') : record.opening) : record.opening.toFixed(2)}</div>
                                    }
                                })}
                            </>
                        )
                    },
                    {
                        "title": <div style={{ textAlign: "right" }}>Debit</div>,
                        "dataIndex": "debit",
                        "key": "debit",
                        render: (text, record, index) => (
                            <>
                                {finalArr.map((item, i) => {
                                    if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.debit !== undefined ? record.debit.toLocaleString('en-US') : record.debit) : record.debit.toFixed(2)}</div>
                                    } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.debit !== undefined ? record.debit.toLocaleString('en-US') : record.debit) : record.debit.toFixed(2)}</div>
                                    }
                                })}
                            </>
                        )
                    },
                    {
                        "title": <div style={{ textAlign: "right" }}>Credit</div>,
                        "dataIndex": "credit",
                        "key": "credit",
                        render: (text, record, index) => (
                            <>
                                {finalArr.map((item, i) => {
                                    if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.credit !== undefined ? record.credit.toLocaleString('en-US') : record.credit) : record.credit.toFixed(2)}</div>
                                    } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.credit !== undefined ? record.credit.toLocaleString('en-US') : record.credit) : record.credit.toFixed(2)}</div>
                                    }
                                })}
                            </>
                        )
                    },
                    {
                        "title": <div style={{ textAlign: "right" }}>Closing</div>,
                        "dataIndex": "closing",
                        "key": "closing",
                        render: (text, record, index) => (
                            <>
                                {finalArr.map((item, i) => {
                                    if ((item.parentaccount === "P&L" || item.parentaccount === "BS") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ fontWeight: 800, textAlign: "right" }}>{currency === "INR" ? (record.closing !== undefined ? record.closing.toLocaleString('en-US') : record.closing) : record.closing.toFixed(2)}</div>
                                    } else if ((item.parentaccount !== "BS" || item.parentaccount !== "P&L") && record.EXP === item.EXP && index === i) {
                                        return <div style={{ textAlign: "right" }}>{currency === "INR" ? (record.closing !== undefined ? record.closing.toLocaleString('en-US') : record.closing) : record.closing.toFixed(2)}</div>
                                    }
                                })}
                            </>
                        )
                    }
                ];
                setExpensesRevenueRowData(finalArr);
                setExpensesRevenueColumnData(columns);
                setLoading(false);
            } else {
                setLoading(true);
                mainData2.map((item, index)=> {
                    return item.key = index + 1000;
                });
                const toTree = (arr) => {
                    const arrMap = new Map(arr.map(item => [item.acctnumber, item]));
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
                
                const treeRowData = toTree(mainData2);
                const columns = [
                    {
                        "title": "Account Number",
                        "dataIndex": "acctnumber",
                        "key": "acctnumber"
                    },
                    {
                        "title": "Account Name",
                        "dataIndex": "accountname",
                        "key": "accountname"
                    },
                    {
                      "title": "Parent Account",
                      "dataIndex": "parentaccount",
                      "key": "parentaccount",
                    },
                    {
                      "title": "Parent Name",
                      "dataIndex": "parentname",
                      "key": "parentname",
                    }
                ];
                setExpensesRevenueRowData(treeRowData);
                setExpensesRevenueColumnData(columns);
                setLoading(false);
            };
        };
    }, [checkedSwitch]);

    const exportPdf = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape
        // const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        var totalPagesExp = "{total_pages_count_string}";

        expensesRevenueColumnData.map((item, index) => {
            if (index === 1) {
                return item.title = "Opening"
            };
            if (index === 2) {
                return item.title = "Debit"
            };
            if (index === 3) {
                return item.title = "Credit"
            };
            if (index === 4) {
                return item.title = "Closing"
            };
        });
        expensesRevenueRowData.map(item => {
            let name = '';
            for (let i = 0; i < item.padding; i++) {
                name = name.concat(" ");
            };
            return item.EXP = name.concat(item.EXP);
        });

        let content = {
            startY: 50,
            // head: headers,
            columns: expensesRevenueColumnData,
            body: expensesRevenueRowData,
            theme: "grid",
            styles: {
              overflow: "linebreak",
              cellWidth: "wrap",
              fontSize: 5,
              fontStyle: "bold",
            },
            margin: { left: 10, right: 10 },
            columnWidth: "wrap",
            columnStyles: {
              // parentBunitName: {
              //   columnWidth: "100",
              // },
              regionName: {
                columnWidth: "80",
              },
              marketName: {
                columnWidth: "80",
              },
              // orgName: {
              //   columnWidth: "100",
              // },
              // productCategoryName: {
              //   columnWidth: "100",
              // },
              Commodity: {
                columnWidth: "150",
              },
              Description: {
                columnWidth: "150",
              },
              volumeOfSale: {
                halign: "right",
              },
              amountOfSale: {
                halign: "right",
              },
              royaltyPercentage: {
                halign: "right",
              },
              amountOfRoyality: {
                halign: "right",
              },
              countOfOrders: {
                halign: "right",
              },
            },
            headStyles: { fillColor: [169, 169, 169] },
            didDrawPage: function(data) {
              doc.setFontSize(11);
              doc.setTextColor(40);
              doc.setFont("helvetica", "bold");
              doc.text(
                "Trial Balance",
                data.settings.margin.left + 360,
                30
              );
      
              // Footer
              var str = "Page " + doc.internal.getNumberOfPages();
              // Total page number plugin only available in jspdf v1.0+
              // if (typeof doc.putTotalPages === 'function') {
              //   str = str + ' of ' + totalPagesExp
              // }
              doc.setFontSize(10);
      
              // jsPDF 1.4+ uses getWidth, <1.4 uses .width
              var pageSize = doc.internal.pageSize;
              var pageHeight = pageSize.height
                ? pageSize.height
                : pageSize.getHeight();
              doc.setFontSize(8);
              doc.setFont("helvetica", "normal");
              doc.text(str, data.settings.margin.left + 795, pageHeight - 10);
            },
          };
      
          // doc.text(title, marginLeft, 40);
          doc.autoTable(content);
          var str = "Page " + doc.internal.getNumberOfPages();
          if (typeof doc.putTotalPages === "function") {
            str = str + " of " + totalPagesExp;
          }
          doc.save("Trial Balance.pdf");
    };

    return (
        <div>
            <Row>
                <Col span={6}>
                    <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>{`Trial Balance`}</h2>
                </Col>
                <Col span={8}>
                    <div style={{ display: "flex" }}>
                        <div style={{ textAlign: "center", marginTop: "1%" }}>{currentFromDate} - {currentToDate}</div>
                    </div>
                </Col>
                <Col span={6}>
                    <div style={{ display: "flex" }}>
                        <div style={{ textAlign: "center", marginTop: "1%" }}>{selectedView}</div>
                    </div>
                </Col>
                <Col span={1}>
                    {selectedView === "Detailed View" ?
                        <Checkbox style={{ marginTop : "8px", marginLeft: "20px" }} checked={checkedCheckbox} onChange={handleCheckbox} /> :
                        ""
                    }
                </Col>
                <Col span={1}>
                    {selectedView === "Detailed View" ?
                        <Switch style={{ marginTop : "5px" }} checked={checkedSwitch} onChange={handleSwitch} /> :
                        ""
                    }
                </Col>
                <Col span={1}>
                    <Button onClick={exportPdf}><ExportOutlined /></Button>
                </Col>
                <Col span={1}>
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
            <div style={{ display: "flex" }}>
                <Table
                    dataSource={expensesRevenueRowData}
                    columns={expensesRevenueColumnData}
                    pagination={false}
                    size='small'
                    loading={{
                        spinning: loading,
                        indicator: <LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />,
                    }}
                    scroll={{ y: "78vh", x: "100%" }}
                />
            </div>
        </div>
    );
};

export default TrialBalance;