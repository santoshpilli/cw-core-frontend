import { Card, Row, Col, Image, Button } from "antd";
import React from "react"; 
import first1 from "../../../assets/images/first1.svg"

const Home = () => {
    return (
        <>
            <div style={{ display: "block", textAlign: "center", justifyContent: "center", alignContent: "center" }}>
                <p style={{ fontWeight: 600, color: "#192228" }}>Get started with Digital Receipts</p>
                <p style={{ fontSize: "10px", marginTop: "-5px" }}>Design, create, and integrate digital receipts for your stores with three quick steps</p>
            </div>
            <Row style={{ marginTop: "30px" }}>
                <Col span={5}/>
                <Col span={5}>
                    <Card style={{ height: 250, width: 250, textAlign: "center", justifyContent: "center", alignContent: "center", borderRadius:"5px" }}>
                      <Image src={first1} alt='' preview = "false" height={170} width={180}/>
                      <Button style={{ backgroundColor: "#0C173A", fontFamily: "Roboto", borderRadius: "5px", fontWeight: 600, fontSize: "11px", width: 180, height: "35px", color: "white"}}>Add Store</Button>
                    </Card>
                </Col>
                <Col span={5}>
                    <Card style={{ height: 250, width: 250 }}></Card>
                </Col>
                <Col span={5}>
                    <Card style={{ height: 250, width: 250 }}></Card>
                </Col>
                <Col span={3}/>
            </Row>
        </>
    )
}

export default Home;