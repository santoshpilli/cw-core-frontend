import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Spin, Input, message } from "antd";
import { useHistory } from "react-router";
import { getReports } from "../../../services/generic";
import Scrollbars from "react-custom-scrollbars";
import { LoadingOutlined } from "@ant-design/icons";

const ReportDeveloper = () => {
    const history = useHistory();
    const [reportsData, setReportsData] = useState([]);
    const [reportsDataToShow, setReportsDataToShow] = useState([]);
    const [loading, setLoading] = useState(false);

    const newDeveloper = (key) => () => {
        history.push(`/others/window/7464/${key}`);
    };

    useEffect(async() => {
        setLoading(true);
        const serverResponse = await getReports();
        if (serverResponse) {
            const data = serverResponse;
            if (data.length > 0) {
                setReportsData(data);
                setReportsDataToShow(data);
                setLoading(false);
            } else {
                setLoading(false);
                message.warning("No Reports are available");
            }           
        } else {
            setLoading(false);
            message.error("Something is wrong in Request");
        };
    }, []);

    const handleInput = (ev) => {
        const arr = [];
        reportsData.forEach(report => {
            if (report.name.toLowerCase().indexOf(ev.target.value.toLowerCase()) >= 0) {
                arr.push(report);
            };
        });
        setReportsDataToShow(arr);
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
                    <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>Report Developer</h2>
                </Col>
                <Col span={12}>
                    <div style={{ textAlign: "center", marginTop: "1%", marginBottom: "0px" }}>
                        <Input onChange={handleInput} />
                    </div>
                </Col>
                <Col span={6}>
                    <span style={{ float: "right" }}>
                        <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={newDeveloper("newReport")}>
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
                        {reportsDataToShow.map(data => {
                            return (
                                <Col span={6} style={{ marginBottom: "5px", cursor: "pointer" }} key={data.cs_report_id} onClick={newDeveloper(data.cs_report_id)}>
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

export default ReportDeveloper;