import React, { useEffect, useState } from "react"; 
import { Row, Col, Input, Button, Table, message, Modal, InputNumber } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getConnections, testConnection, newConnection } from "../../../services/genericForCustom";
import useDebounce from "../../../lib/hooks/useDebounce";

const CwConnections = () => {
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [rowData, setRowData] = useState([]);
    const [rowDataCopy, setRowDataCopy] = useState([]);
    const [columnData, setColumnData] = useState([]);
    const [modalFlag, setModalFlag] = useState(false);
    const [connectionId, setConnectionId] = useState('');
    const [connectionType, setConnectionType] = useState('');
    const [host, setHost] = useState('');
    const [login, setLogin] = useState('');
    const [schema, setSchema] = useState('');
    const [port, setPort] = useState(0);
    const [extra, setExtra] = useState('');
    const [effectFlag, setEffectFlag] = useState(false);

    useEffect(async () => {
        setLoading(true);
        const serverResponse = await getConnections(); 
        if (serverResponse) {
            const data = serverResponse.connections;
            data.map(item => {
                item.key = item.connectionId
            });
            const columns = [
                {
                    title: 'Connection Id',
                    dataIndex: 'connectionId',
                    key: 'connectionId',
                },
                {
                    title: 'Connection Type',
                    dataIndex: 'connectionType',
                    key: 'connectionType',
                },
                {
                    title: 'Host',
                    dataIndex: 'host',
                    key: 'host',
                }
            ];
            setRowData(data);
            setRowDataCopy(data);
            setColumnData(columns);
            setLoading(false);
        } else {
            setLoading(false);
            message.warning("No Data available");
        }
    }, [effectFlag]);

    const rowSelection = {
        onChange: (selectedRowKeys) => {
          setSelectedId(selectedRowKeys);
        }
    };

    const handleSearch = (e) => {
        setSearchKey(e.target.value);
    };

    const debouncedSearchKey = useDebounce(searchKey, 350);

    useEffect(() => {
        getSearchData(debouncedSearchKey);
    }, [debouncedSearchKey]);

    const getSearchData = (input) => {
        let arr = [];
        let mainData = [...rowData];
        mainData.forEach(record => {
            let flag = "N";
            Object.values(record).forEach(value => {
                if (value !== null && typeof(value) !== "number" && typeof(value) !== "object") {
                  if (value.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
                    flag = "Y"
                  };
                };
            });
            if (flag === "Y") {
                arr.push(record);
            };
        });
        setRowDataCopy(arr);
    };

    const onNew = () => {
        setModalFlag(true);
    };

    const onTest = async () => {
        setLoading(true);
        if (selectedId !== '') {
            const serverResponse = await testConnection(selectedId);
            if (serverResponse) {
                if (serverResponse.messageCode === "200") {
                    setLoading(false);
                    message.success(serverResponse.message);
                } else {
                    setLoading(false);
                    message.error(serverResponse.message);
                }
            } else {
                message.warning("Request has no Data");
                setLoading(false);
            };
        } else {
            setLoading(false);
            message.warning("Please select one Record");
        }
    };
    
    const handleCancel = () => {
        setModalFlag(false);
    };

    const handleConnectionId = (e) => {
        setConnectionId(e.target.value);
    };

    const handleConnectionType = (e) => {
        setConnectionType(e.target.value);
    };

    const handleHost = (e) => {
        setHost(e.target.value);
    };

    const handleLogin = (e) => {
        setLogin(e.target.value);
    };

    const handleSchema = (e) => {
        setSchema(e.target.value);
    };

    const handlePort = (e) => {
        setPort(e);
    };

    const handleExtra = (e) => {
        setExtra(e.target.value);
    };

    const handleOk = async () => {
        setLoad(true);
        if (connectionId !== "" && connectionType !== "" && host !== "") {
            const data = {
                connection_id : connectionId,
                conn_type : connectionType,
                host : host,
                login : schema,
                schema : schema,
                port : port !== null ? port : 0,
                extra : extra
            };
            const json = JSON.stringify(data).replace(/"/g, '\\"');
            const serverResponse = await newConnection(json);
            if (serverResponse) {
                if (serverResponse.messageCode === "200") {
                    setLoad(false);
                    setModalFlag(false);
                    message.success(serverResponse.message);
                    setConnectionId("");
                    setConnectionType("");
                    setHost("");
                    setLogin("");
                    setSchema("");
                    setPort(0);
                    setExtra("");
                    setEffectFlag(!effectFlag);
                } else {
                    setLoad(false);
                    message.error(serverResponse.message);
                }
            } else {
                setLoad(false);
                message.warning("Request has no Data");
            };
        } else {
            message.warning("Connection Id, Connect Type and Host are mandatory");
            setLoad(false);
        }
    };

    return (
        <div>
            <Row>
                <Col span={6}>
                    <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>CW Connections</h2>
                </Col>
                <Col span={12}>
                    <div style={{ textAlign: "center", marginBottom: "0px" }}>
                        <Input value={searchKey} onChange={handleSearch}/>
                    </div>
                </Col>
                <Col span={6}>
                    <span style={{ float: "right" }}>
                        <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={onNew}>
                            New
                        </Button>
                        &nbsp;
                        <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={onTest}>
                            Test
                        </Button>
                    </span>
                </Col>
            </Row>
            <Table
                size="small"
                scroll={{ y: "78vh", x: "100%" }}
                sticky={true}
                pagination={false}
                loading={{
                    spinning: loading,
                    indicator: <LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />,
                }}
                dataSource={rowDataCopy}
                columns={columnData}
                rowSelection={{
                    type: 'radio',
                    ...rowSelection,
                }}
            />
            <Modal
                title="Connection Details"
                visible={modalFlag}
                onOk={handleOk} 
                onCancel={handleCancel}
                footer={[
                    <Button onClick={handleCancel}>
                      Cancel
                    </Button>,
                    <Button style={{ backgroundColor: "rgb(8 158 164)", color: "white" }} key="submit" type="primary" loading={load} onClick={handleOk}>
                      Save
                    </Button>
                ]}      
            >
                <div>
                    <Row>
                        <Col span={1}>
                        </Col>
                        <Col span={10}>
                            Connection Id
                            <br/>
                            <Input value={connectionId} onChange={handleConnectionId} />
                        </Col>
                        <Col span={2}>
                        </Col>
                        <Col span={10}>
                            Connection Type
                            <br/>
                            <Input value={connectionType} onChange={handleConnectionType} />
                        </Col>
                        <Col span={1}>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span={1}>
                        </Col>
                        <Col span={10}>
                            Host
                            <br/>
                            <Input value={host} onChange={handleHost} />
                        </Col>
                        <Col span={2}>
                        </Col>
                        <Col span={10}>
                            Login
                            <br/>
                            <Input value={login} onChange={handleLogin} />
                        </Col>
                        <Col span={1}>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span={1}>
                        </Col>
                        <Col span={10}>
                            Schema
                            <br/>
                            <Input value={schema} onChange={handleSchema} />
                        </Col>
                        <Col span={2}>
                        </Col>
                        <Col span={10}>
                            Port
                            <br/>
                            <InputNumber value={port} onChange={handlePort} />
                        </Col>
                        <Col span={1}>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span={1}>
                        </Col>
                        <Col span={10}>
                            Extra
                            <br/>
                            <Input value={extra} onChange={handleExtra} />
                        </Col>
                    </Row>
                    <br />
                </div>
            </Modal>
        </div>
    )
}

export default CwConnections;