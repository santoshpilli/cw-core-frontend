import React from 'react'
import "antd/dist/antd.css";
import "./login.css";
import { Form, Input, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
// import { useEffect, useState } from 'react';


function resetPassword() {


  const responsiveForReset = {
    xs : 2,
    sm : 3,
    md : 4,
    lg : 4,
    xl : 4
  }

  const responsiveForResetMiddle = {
    xs : 20,
    sm : 18,
    md : 16,
    lg : 16,
    xl : 16
  }

  return (

    <div className="resetLoginPassword">
       <Row >
        <Col xs={2} sm={2} md={4} lg={4} xl={4}></Col>
        <Col className='resetDiv' xs={20} sm={20} md={16} lg={16} xl={16} style={{ backgroundColor: "#FFFFFF", width: "55rem", marginTop: "5%", marginBottom: "5%", height: "100%", borderRadius: "5px", justifyContent: "center" }}> 
         
          <Row>
            <Col {...responsiveForReset}></Col>
            <Col  className = "mainReset"{...responsiveForResetMiddle} style={{ marginTop: "6%" }}><h1 style={{ color: "#0E1212" }}>Reset your Password</h1> </Col>
            <Col {...responsiveForReset} ></Col>
          </Row>
          <Row>
            <Col {...responsiveForReset}></Col>
            <Col xs={20} sm={18} md={16} lg={16} xl={15}>
              <h3 style={{ width: "100%", color: "#0E1212", fontSize: "1rem" }}>
                Enter your registered email address below and we will send a link to reset your password. </h3>
            </Col>
            <Col {...responsiveForReset}></Col>
          </Row>
          <Form>
            <Row>
              <Col {...responsiveForReset}></Col>
              <Col {...responsiveForResetMiddle} style={{ marginTop: "2%" }} >
                <Form.Item name="email"> <Input className = "resetEmail" id = "resetEmailId"style={{ width: "100%", height: "4rem", borderRadius: "5px", borderColor: "#C5C5C5", fontSize: "1rem" }} placeholder='Enter your Email'></Input></Form.Item></Col>
              <Col {...responsiveForReset}></Col>
            </Row>
            <Row >
              <Col {...responsiveForReset}></Col>
              <Col {...responsiveForResetMiddle} style={{ marginTop: "4%" }}> <Button className = "resetBut"style={{ width: "100%", height: "4rem", borderColor: "#8AAD30", fontSize: "1rem", borderRadius: "5px", backgroundColor: "#A0C838", color: "#FFFFFF", fontWeight: "400" }} type="primary" htmlType='submit'>Send link To Email</Button></Col>
              <Col {...responsiveForReset}></Col>
            </Row>
          </Form>
          <Col className = "link"span={16} offset={4} style={{ marginTop: "5%",marginBottom:"5%", textAlign: "center", color: "#1492E6", opacity: "100%", letterSpacing: "0.28px" }}> <Link to="/:appName"  >Back to Login Page</Link></Col>
          
     </Col>

        <Col xs={2} sm={2} md={4} lg={4} xl={4}></Col>
       </Row> 
    </div>
  )
}

export default resetPassword