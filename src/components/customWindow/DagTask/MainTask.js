import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Spin, Input, message } from "antd";
import { useHistory } from "react-router";
import { getTasks } from "../../../services/genericForCustom";
import Scrollbars from "react-custom-scrollbars";
import { LoadingOutlined } from "@ant-design/icons";

const MainTask = () => {
    const history = useHistory();
    const [tasksData, setTasksData] = useState([]);
    const [tasksDataToShow, setTasksDataToShow] = useState([]);
    const [loading, setLoading] = useState(false);

    const newDeveloper = (key) => () => {
        history.push(`/others/window/7484/${key}`);
    };

    useEffect(async() => {
        setLoading(true);
        const serverResponse = await getTasks();
        if (serverResponse) {
            const data = serverResponse;
            if (data.length > 0) {
                setTasksData(data);
                setTasksDataToShow(data);
                setLoading(false);
            } else {
                setLoading(false);
                message.warning("No Tasks are available");
            }           
        } else {
            setLoading(false);
            message.error("Something is wrong in Request");
        };
    }, []);

    const handleInput = (ev) => {
        const arr = [];
        tasksData.forEach(report => {
            if (report.name.toLowerCase().indexOf(ev.target.value.toLowerCase()) >= 0) {
                arr.push(report);
            };
        });
        setTasksDataToShow(arr);
    };

    const renderThumb = ({ style, ...props }) => {
        const thumbStyle = {
          backgroundColor: "#c1c1c1",
          borderRadius: "5px",
          width: "8px",
        };

        return <div style={{ ...style, ...thumbStyle }} {...props} />;
    };
    
    const renderThumbHorizontalScroll = ({ style, ...props }) => {
        const thumbStyle = {
          width: "0px",
        };

        return <div style={{ ...style, ...thumbStyle }} {...props} />;
    };

    return (
        <div>
            <Row>
                <Col span={6}>
                    <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>Data Cube</h2>
                </Col>
                <Col span={12}>
                    <div style={{ textAlign: "center", marginTop: "1%", marginBottom: "0px" }}>
                        <Input onChange={handleInput} />
                    </div>
                </Col>
                <Col span={6}>
                    <span style={{ float: "right" }}>
                        <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={newDeveloper("newTask")}>
                            New
                        </Button>
                    </span>
                </Col>
            </Row>
            <br />
            <Scrollbars
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={200}
                thumbSize={100}
                renderThumbHorizontal={renderThumbHorizontalScroll}
                renderThumbVertical={renderThumb}
                style={{ height: "81vh" }}
            >
                <Spin indicator={<LoadingOutlined className="spinLoader" />} spinning={loading}>
                    <Row gutter={16}>
                        {tasksDataToShow.map(data => {
                            return (
                                <Col span={6} style={{ marginBottom: "5px", cursor: "pointer" }} key={data.csDWTaskId} onClick={newDeveloper(data.csDWTaskId)}>
                                    <Card style={{ height: "176px" }}>
                                        <div style={{ textAlign: "center", marginTop: "30px", height: "45px" }}>
                                        </div>
                                        <br />
                                        <br />
                                        <hr style={{ marginTop: "-5px" }} />
                                        <div style={{ textAlign: "center", marginTop: "12px", fontWeight: 400, fontSize: "14px" }}>{data.name}</div>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </Spin>
            </Scrollbars>
        </div>
    )
};

export default MainTask;