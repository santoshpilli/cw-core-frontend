import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col, Select, Button, InputNumber, Checkbox, message } from "antd";
import MainTable from "./MainTable";
import { getCustomBusinessUnit, getWarehouse } from "../../../services/generic";
import { getStockAllocationData, getConfirmDataForStockAllocation } from "../../../services/custom";

const { Option } = Select;

const StockAllocation = () => {
    const [bunitData,setBunitData] = useState([]);
    const [wareHouseData, setWareHouseData] = useState([]);
    const [bUnitId, setBUnitId] = useState('');

    const [mainData, setMainData] = useState([]);
    const [mainColumns, setMainColumns] = useState([]);

    const [mainNestedData, setMainNestedData] = useState([]);
    const [mainNestedColumns, setMainNestedColumns] = useState([]);

    const [changedValue, setChangedValue] = useState('');
    const [changedKey, setChangedKey] = useState('');
    const [changedIndex, setChangedIndex] = useState('');

    const [loading, setLoading] = useState(false);
    const [headerform] = Form.useForm();

    const [editMainRowKey, setEditMainRowKey] = useState('');

    const getBusinessUnit = async () => {
        const businessUnitResponse = await getCustomBusinessUnit();
        setBunitData(businessUnitResponse);
    };

    const onSelectBusinessUnit = (e) => {
        setBUnitId(e);
    };

    const getWareHouseData = async () => {
        const wareHouseResponse = await getWarehouse(bUnitId);
        setWareHouseData(wareHouseResponse);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const valuesArray = Object.values(values);

        const serverResponse = await getStockAllocationData(valuesArray[0], valuesArray[1]);

        if (serverResponse) {
            const data = serverResponse.data.data.getSTOpenOrders;
            let nestedData = [];
            data.forEach((item, index) => {
                item.uomUnit = item.uom.name;
                item.key = index;
                item.confirm_qty = '';
                let stockOrder = [...item.stockTransferOrder];
                stockOrder.forEach((item, index) => {
                    item.allocate = '';
                    item.confirm_qty = '';
                    item.key = index;
                });
                nestedData.push(stockOrder);
            });
            const columns = [
                { title: 'Type', dataIndex: 'value', key: 'value', ellipsis: true },
                { title: 'Product', dataIndex: 'name', key: 'name', ellipsis: true },
                { title: 'Uom', dataIndex: 'uomUnit', key: 'uomUnit', ellipsis: true },
                { title: 'Order Qty', dataIndex: 'qty', key: 'qty', ellipsis: true },
                { title: 'Confirm Qty', dataIndex: 'confirm_qty', key: 'confirm_qty', ellipsis: true },
                { title: 'On Hand Qty', dataIndex: 'qtyOnHand', key: 'qtyOnHand', ellipsis: true },
            ];

            const nestedColumns = [
                {
                    title: 'Business Unit',
                    dataIndex: 'bUnitName',
                    key: 'bUnitName',
                },
                {
                    title: 'Order Qty',
                    dataIndex: 'qty',
                    key: 'qty',
                },
                {
                    title: 'Confirm Qty',
                    dataIndex: 'confirm_qty',
                    key: 'confirm_qty',
                    render: (text, record, index) => (
                        <InputNumber size='small' min={0} max={1000000000} value={text} onChange={onInputChange('confirm_qty', index)} />
                    )
                },
                {   
                    title: 'Allocate', dataIndex: 'allocate', key: 'allocate',
                    render: (text) => (
                        <Checkbox checked={text}/>
                    )
                }
            ];

            setLoading(false);
            setMainData(data);
            setMainColumns(columns);
            setMainNestedData(nestedData);
            setMainNestedColumns(nestedColumns);
        }
    };

    const takeRecordKey = (record) => {
      setEditMainRowKey(record);
    };

    const onInputChange = (key, index) => (value) => {
        setChangedValue(value);
        setChangedKey(key);
        setChangedIndex(index);
    };

    useEffect(() => {
        let newData = [...mainNestedData];
        if (newData.length > 0) {
            if (newData[editMainRowKey][changedIndex]['qty'] >= changedValue) {
                newData[editMainRowKey][changedIndex][changedKey] = changedValue;
                if (changedValue !== null) {
                    newData[editMainRowKey][changedIndex]['allocate'] = true;
                } else {
                    newData[editMainRowKey][changedIndex]['allocate'] = false;
                }
                let total = 0;
                for (let index = 0; index < newData[editMainRowKey].length; index++) {
                    total = total + (newData[editMainRowKey][index][changedKey] !== '' ? newData[editMainRowKey][index][changedKey] : 0)
                };
                let newMainData = [...mainData];
                if (newMainData.length > 0) {
                    for (let index = 0; index < newMainData.length; index++) {
                        if (newMainData[index].key === editMainRowKey) {
                            newMainData[index][changedKey] = total;
                        }
                    }
                    setMainData(newMainData);
                }
                setMainNestedData(newData);
            } else {
                newData[editMainRowKey][changedIndex]['allocate'] = false;
                setMainNestedData(newData);
                message.warning('Confirm Qty is more than Order Qty');
            }
        }
    }, [changedValue]);

    const onSearch = () => {
        headerform.submit();
    };

    const onConfirm = async () => {
        let newData = [...mainNestedData];
        let order = [];
        for (let index1 = 0; index1 < newData.length; index1++) {
            for (let index2 = 0; index2 < newData[index1].length; index2++) {
                if (newData[index1][index2].allocate === true) {
                    let arr = [];
                    let orderLineStr = {};
                    orderLineStr.stockTransferOrderLineId = newData[index1][index2].stockTransferOrderLineId;
                    orderLineStr.qtyconfirmed = newData[index1][index2].confirm_qty;
                    arr.push(orderLineStr);
                    let orderStr = {};
                    orderStr.stockTransferOrderId = newData[index1][index2].stockTransferOrderId;
                    orderStr.orderLines = arr;
                    order.push(orderStr);
                }
            }
        };
        for (let index1 = 0; index1 < order.length; index1++) {
            for (let index2 = index1+1; index2 < order.length; index2++) {
                if (order[index2].stockTransferOrderId === order[index1].stockTransferOrderId) {
                    order[index1].orderLines = order[index1].orderLines.concat(order[index2].orderLines);
                    order.splice(index2, 1);
                }
            }
        };

        let finalOrder = [];
        for (let index1 = 0; index1 < order.length; index1++) {
            let orderLinesArr = [];
            for (let index2 = 0; index2 < order[index1].orderLines.length; index2++) {
                orderLinesArr.push(
                    `{
                        stockTransferOrderLineId: "${order[index1].orderLines[index2].stockTransferOrderLineId}",
                        mProductId: "",
                        qtyconfirmed: "${order[index1].orderLines[index2].qtyconfirmed}"
                    }`
                )
            };
            let arr = [];
            arr.push(
                `{
                    stockTransferOrderId: "${order[index1].stockTransferOrderId}",
                    createdby: "",
                    dateOrdered: "",
                    orderLines: [${orderLinesArr}]
                }`
            );
            finalOrder.push(arr);
        };

        const serverResponse = await getConfirmDataForStockAllocation(finalOrder);
        if (serverResponse) {
            const data = serverResponse.data.data.confirmSTOrder;
            message.success(data.message);
            window.location.reload();
        }
    };

    return (
        <div>
            <Row>
                <Col span={12}>
                    <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>Stock Allocation</h2>
                </Col>
                <Col span={12}>
                    <span style={{ float: "right" }}>
                        <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={onSearch}>
                            Search
                        </Button>
                        <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={onConfirm}>
                            Confirm
                        </Button>
                    </span>
                </Col>
            </Row>
            <Card style={{ marginBottom: "8px" }}>
                <Form layout="vertical" form={headerform} onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                            <Form.Item name="businessUnit" label="Business unit" style={{ marginBottom: "8px" }}>
                                <Select
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    onFocus={getBusinessUnit}
                                    onSelect={onSelectBusinessUnit}
                                >
                                    {bunitData.map((data) => (
                                        <Option key={data.recordid} value={data.recordid} title={data.name}>
                                            {data.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item name="warehouse" label="Warehouse" style={{ marginBottom: "8px" }}>
                                <Select
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    onFocus={getWareHouseData}
                                >
                                    {wareHouseData.map((data) => (
                                        <Option key={data.recordid} value={data.recordid} title={data.name}>
                                            {data.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <MainTable mainData={mainData} mainColumns={mainColumns} nestedData={mainNestedData} nestedColumns={mainNestedColumns} takeRecordKey={takeRecordKey} loading={loading} />
        </div>
    );
};

export default StockAllocation;