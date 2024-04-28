import React, { useState,useEffect } from 'react';
import { useHistory } from "react-router-dom";
import {  Layout,Button, Row, Col,  } from 'antd';
// import "./styles.css"
import Box from "../../../assets/images/posflight.png";
import Inven from "../../../assets/images/invenImg.svg";
import PreferImage from "../../../assets/images/prefImage.png";
import Design from "../../../assets/images/design.png";
import starr from "../../../assets/images/starr.png";
import 'intro.js/introjs.css';
import IntroJS from 'intro.js';
import IntroCloseicon from '../../../assets/images/introCloseIcon.png'

const { Header, Content } = Layout;


const InventoryGetStarted = () => {
  let usersData = JSON.parse(localStorage.getItem("userData"));
  const selectedApp = localStorage.getItem("appName");
  const history = useHistory();
  const [addProductFlag,setAddProductFlag] =useState(false)
  const [manageStoreFlag,setManageStoreFlag] =useState(false)
  const [manageSettingsFlag,setManageSettingsFlag] =useState(false)
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
  }
  const innerWidth = windowSize.innerWidth

  const onClickManageStores = () =>{
    setManageStoreFlag(!manageStoreFlag)
    window.open(`/popupWindow/others/window/7359`,"New Record Window", "width=1200,height=600,left=210,top=120");
  }

  const onClickProductTour = () =>{
    localStorage.removeItem('existingUser')
        const productTourSteps = localStorage.getItem("productTourSteps")
        const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.includes('intro-tour')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
    const pageKey = `intro-tour-${window.location.pathname}`;
    const hasCompletedTour = localStorage.getItem(pageKey);
    if (!hasCompletedTour ) {
      const jsonArray = JSON.parse(JSON.parse(productTourSteps));
      let currentPageSteps = [];
  
      jsonArray.forEach((data) => {
        if(data.appId === localStorage.getItem('appId')){
          data.data.forEach((stepsData)=>{
            if (stepsData.page === window.location.pathname || stepsData.page + '/' === window.location.pathname) {
              currentPageSteps = stepsData.steps;
            }
          })
        } 
      });
      let phoneImg = document.createElement('img');
      phoneImg.src = IntroCloseicon;
      phoneImg.alt = 'Skip tour';
  
      let intro = IntroJS().setOptions({
        steps: currentPageSteps,
        nextButton: 'my-next-button',
        prevButton: 'my-prev-button',
        skipLabel: phoneImg.outerHTML
      });
  
      intro.oncomplete(() => {
        localStorage.setItem(pageKey, 'completed');
      });
      intro.start();

      // setTimeout(() => {
      //   intro.start();
      // }, 2000);
    }
  }

  const onClickAddProduct = () =>{
    // setAddProductFlag(true)
    window.open(`/popupWindow/7517/NEW_RECORD`, "New Record Window", "width=1200,height=600,left=210,top=120");
  }
  const OnClickManageSettings = () =>{
    setManageSettingsFlag(true)
    history.push(`/window/list/7001`)
    localStorage.setItem("subMenuItem",JSON.stringify("Settings"))
    localStorage.setItem("lowerSubMenuItem",JSON.stringify("BusinessUnit"))
    // window.open(`/others/window/7520`, "New Record Window", "width=1200,height=600,left=210,top=120");
  }

  const responsiveSpace ={
    xxl: 3,
    xl: 3,
    lg: 3,
    xs: 1,
    sm: 1,
    md: 1,
  }
  const responsiveSpace1 ={
    xxl: 3,
    xl: 3,
    lg: 3,
    xs: 0,
    sm: 0,
    md: 3,
  }

  const responsiveSpace2 ={
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 3,
    sm: 3,
    md: 0,
  }

  const responsiveSpace4 ={
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 2,
    sm: 2,
    md: 0,
  }

  const responsiveSpace3 ={
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 5,
    sm:5,
    md: 0,
  }



  const responsiveBox ={
    xxl: 6,
    xl: 6,
    lg: 6,
    xs: 0,
    sm: 0,
    md: 6,
  }

  const responsiveBox1 ={
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 18,
    sm: 18,
    md: 0,
  }

  const responsiveBox2 ={
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 14,
    sm: 14,
    md: 0,
  }

  const responsiveQuickAccess ={
    xxl: 6,
    xl: 6,
    lg: 6,
    xs: 18,
    sm: 18,
    md: 6,
  }

  const responsiveDesign = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 0,
    sm: 0,
    md: 16,
  }
  const responsiveDesign1 = {
    xxl:0,
    xl: 0,
    lg: 0,
    xs: 22,
    sm: 22,
    md: 0,
  }

  return (
<div >
  <Row className="main-heading" justify="center" align="middle">
    Start Your Inventory Journey
  </Row>
  <Row justify="space-between" style={{ backgroundColor: " white", marginTop: "10em",borderRadius:"4px" }} gutter={40}>
        <Col {...responsiveSpace1} />
        <Col {...responsiveBox} style={{top:"-7em"}}>
          <div style={{ backgroundColor: "#F5ECDC", height: "26em",borderRadius:"9px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",boxShadow: " 0px 0px 14px 4px rgba(0, 0, 0, 0.06)" }}>
            <img src={Box} alt="" style={{ width: "100%",marginTop:"-5em" }} />
            <p style={{ textAlign: "center", fontFamily: "Inter", fontWeight: 600, fontSize: "20px" }}>Add Product</p>
            <p style={{ textAlign: "center", fontFamily: "Inter", fontWeight: 400, fontSize: "13px", padding: "0 2em" }}>
              Add new products to your inventory. Include details such as product name, description, SKU, price and tax rate
            </p>
            <Button id='step1' onClick={onClickAddProduct} style={{ backgroundColor: "#0C173A", borderRadius: "100px", color: "white", width: "70%", height: "35px", fontFamily: "Inter", fontWeight: 700 }}>Start</Button>
          </div>
        </Col>
        <Col {...responsiveSpace2}/>
        <Col {...responsiveBox1} style={{top:"-5em"}}>
          <div style={{ backgroundColor: "#F5ECDC", height: "29em",borderRadius:"9px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",boxShadow: " 0px 0px 14px 4px rgba(0, 0, 0, 0.06)" }}>
            <img src={Box} alt="" style={{ width: "-webkit-fill-available",height:"70%",marginTop:"-5em" }} />
            <p style={{ textAlign: "center", fontFamily: "Inter", fontWeight: 600, fontSize: "20px" }}>Add Product</p>
            <p style={{ textAlign: "center", fontFamily: "Inter", fontWeight: 400, fontSize: "13px", padding: "0 2em" }}>
              Add new products to your inventory. Include details such as product name, description, SKU, price and tax rate
            </p>
            <Button  onClick={onClickAddProduct} style={{ backgroundColor: "#0C173A", borderRadius: "100px", color: "white", width: "70%", height: "35px", fontFamily: "Inter", fontWeight: 700 }}>Start</Button>
          </div>
        </Col>
        <Col {...responsiveSpace2}/>
        
        <Col {...responsiveBox} style={{top:"-2em"}}>
          <div style={{ backgroundColor: "#F5ECDC", height: "16em",borderRadius:"9px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: "0px 0px 14px 4px rgba(0, 0, 0, 0.06)" }}>
            <img  src={Inven} alt="" style={{ width: "118%",marginTop:"-8em"}} />
            <p style={{ textAlign: "center", fontFamily: "Inter", fontWeight: 600, fontSize: "20px", marginTop: "-15em" }}>Add Stock</p>
            <p style={{ textAlign: "center", fontFamily: "Inter", fontWeight: 400, fontSize: "13px", padding: "0 2em", marginBottom: "1em" }}>Enables efficient inventory management, helping businesses maintain accurate stock levels, and prevent stockouts</p>
            <Button id='step2' onClick={onClickManageStores} style={{ backgroundColor: "#0C173A", borderRadius: "100px", color: "white", width: "70%", height: "35px", fontFamily: "Inter", fontWeight: 700 }}>Start</Button>
          </div>
        </Col>
        <Col {...responsiveSpace3}/>
        <Col {...responsiveBox2} style={{top:"7em"}}>
          <div style={{ backgroundColor: "#F5ECDC", height: "18em",borderRadius:"9px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: "0px 0px 14px 4px rgba(0, 0, 0, 0.06)" }}>
            <img  src={Inven} alt="" style={{ width: "115%",marginTop:"-12em"}} />
            <p style={{ textAlign: "center", fontFamily: "Inter", fontWeight: 600, fontSize: "20px", marginBottom: "",marginTop:"-15em" }}>Add Stock</p>
            <p style={{ textAlign: "center", fontFamily: "Inter", fontWeight: 400, fontSize: "13px", padding: "0 3em", marginBottom: "1em",marginTop:"0px" }}>Enables efficient inventory management, helping businesses maintain accurate stock levels, and prevent stockouts</p>
            <Button  onClick={onClickManageStores} style={{ backgroundColor: "#0C173A", borderRadius: "100px", color: "white", width: "70%", height: "35px", fontFamily: "Inter", fontWeight: 700 }}>Start</Button>
          </div>
        </Col>
        <Col {...responsiveSpace3}/>

        <Col {...responsiveBox} style={{top:"-7em"}}>
        <div style={{ backgroundColor: "#F5ECDC", height: "26em",borderRadius:"9px",alignItems: "center", justifyContent: "center",display:"flex" ,flexDirection: "column",boxShadow: " 0px 0px 14px 4px rgba(0, 0, 0, 0.06)" }}>
          <img src={PreferImage} alt="" style={{ width: "100%",padding:"0em 1em",height:"60%", top: "-5em",position: "absolute", left: "0em", right: "0em" }} />
          <p style={{ textAlign: "center", fontFamily: "Inter", fontWeight: 600, fontSize: "20px",marginTop:"6em" }}>Manage Settings</p>
            <p style={{ textAlign: "center", fontFamily: "Inter", fontWeight: 400, fontSize: "13px", padding: "0 2em" }}>
            Customize and control settings within your account            </p>
            <Button id='step3' onClick={OnClickManageSettings} style={{ backgroundColor: "#0C173A", borderRadius: "100px", color: "white", width: "70%", height: "35px", fontFamily: "Inter", fontWeight: 700 }}>Start</Button>
          </div>
        </Col>
        
        <Col {...responsiveSpace2}/>
        <Col {...responsiveBox1} style={{top:"14em"}}>
        <div style={{ backgroundColor: "#F5ECDC", height: "26em",borderRadius:"9px",alignItems: "center", justifyContent: "center",display:"flex" ,flexDirection: "column",boxShadow: " 0px 0px 14px 4px rgba(0, 0, 0, 0.06)" }}>
          <img src={PreferImage} alt="" style={{ width: "100%",height:"72%", top: "-5em",position: "absolute", left: "0em", right: "0em" }} />
          <p style={{ textAlign: "center", fontFamily: "Inter", fontWeight: 600, fontSize: "20px",marginTop:"6em" }}>Manage Settings</p>
            <p style={{ textAlign: "center", fontFamily: "Inter", fontWeight: 400, fontSize: "13px", padding: "0 2em" }}>
            Customize and control settings within your account            </p>
            <Button id='step3' onClick={OnClickManageSettings} style={{ backgroundColor: "#0C173A", borderRadius: "100px", color: "white", width: "70%", height: "35px", fontFamily: "Inter", fontWeight: 700 }}>Start</Button>
          </div>
        </Col>
        <Col {...responsiveSpace2}/>

        <Col {...responsiveSpace1}  />
        
        <Col {...responsiveSpace} />
                <Col {...responsiveDesign}>
                <div style={{padding:"1em  1em", backgroundColor: "white", height: "auto",borderRadius:"9px",alignItems: "center", justifyContent: "center",display:"flex" ,flexDirection: "row",boxShadow: " 0px 0px 8px 2px rgba(0, 0, 0, 0.06)" }}>
                  <img src={Design} width="auto" alt=""/>
                  <div style={{alignItems:"flex-start"}}>
            <p style={{fontFamily:"Inter",fontSize:"20px",fontWeight:600}}>Need Help</p>
            <p  style={{fontFamily:"Inter",fontWeight:400,fontSize:"13px", wordWrap: "break-word"}}>
              Find everything you need to know about our product and ways to contact our support team. We're here to help you get the most out of our app
            </p>
            <p><a style={{fontWeight:400,fontSize:"13px",fontFamily:"Inter",color:"#0500ED"}}>Tutorials & Guides</a></p>
            <p><a style={{fontWeight:400,fontSize:"13px",fontFamily:"Inter",color:"#0500ED"}}>FAQs</a></p>
            <p><a style={{fontWeight:400,fontSize:"13px",fontFamily:"Inter",color:"#0500ED"}}>Product documentation</a></p>
            <p><a style={{fontWeight:400,fontSize:"13px",fontFamily:"Inter",color:"#0500ED"}}>Contact Support</a></p>
            <Button onClick={onClickProductTour} style={{backgroundColor:"#8C9AC6",float:"right",fontWeight:700,fontSize:"14px",fontFamily:"Roboto",color:"white",height:"36px",borderRadius:"4px"}}>Product Tour</Button>
          </div>

                </div>
                </Col>

                <Col {...responsiveDesign1} style={{marginTop:"17em"}}>
                <div style={{padding:"1em  1em", backgroundColor: "white", height: "auto",borderRadius:"9px",alignItems: "center", justifyContent: "center",display:"flex" ,flexDirection: "row",boxShadow: " 0px 0px 8px 2px rgba(0, 0, 0, 0.06)" }}>
                  <img src={Design} width="auto" alt=""/>
                  <div style={{alignItems:"flex-start"}}>
            <p style={{fontFamily:"Inter",fontSize:"20px",fontWeight:600}}>Need Help</p>
            <p  style={{fontFamily:"Inter",fontWeight:400,fontSize:"13px", wordWrap: "break-word"}}>
              Find everything you need to know about our product and ways to contact our support team. We're here to help you get the most out of our app
            </p>
            <p><a style={{fontWeight:400,fontSize:"13px",fontFamily:"Inter",color:"#0500ED"}}>Tutorials & Guides</a></p>
            <p><a style={{fontWeight:400,fontSize:"13px",fontFamily:"Inter",color:"#0500ED"}}>FAQs</a></p>
            <p><a style={{fontWeight:400,fontSize:"13px",fontFamily:"Inter",color:"#0500ED"}}>Product documentation</a></p>
            <p><a style={{fontWeight:400,fontSize:"13px",fontFamily:"Inter",color:"#0500ED"}}>Contact Support</a></p>
            <Button onClick={onClickProductTour} style={{backgroundColor:"#8C9AC6",float:"right",fontWeight:700,fontSize:"14px",fontFamily:"Roboto",color:"white",height:"36px",borderRadius:"4px"}}>Product Tour</Button>
          </div>

                </div>
                </Col>
                {/* <Col {...responsiveSpace} /> */}
                <Col {...responsiveSpace4} />
      <Col {...responsiveQuickAccess}>
            <div style={{ padding: "1em 1em 1em 2em", backgroundColor: "white", height: "auto",borderRadius:"9px", alignItems: "flex-start", justifyContent: "center", display: "flex", flexDirection: "column", boxShadow: "0px 0px 8px 2px rgba(0, 0, 0, 0.06)", textAlign: "start",marginTop:innerWidth<768?"3em":"" }}>
        <img src={starr} alt="" style={{}} />
        <br/>
        <p style={{ fontWeight: 600, fontSize: "20px", fontFamily: "Inter"}}>Quick Access</p>
        <p style={{ fontWeight: 400, fontSize: "13px", fontFamily: "Inter" }}>Shortcuts designed to help you save time and access the information you need with just a few clicks</p>
        <p style={{ display: "flex", justifyContent: "flex-start" }}><a style={{ fontWeight: 400, fontSize: "13px", fontFamily: "Inter" ,color:"#0500ED"}}>Reports</a></p>
        <p><a style={{ fontWeight: 400, fontSize: "13px", fontFamily: "Inter",color:"#0500ED" }}>Dashboards</a></p>
        <p><a style={{ fontWeight: 400, fontSize: "13px", fontFamily: "Inter",color:"#0500ED" }}>POS Terminal</a></p>
      </div>
      </Col>
      <Col {...responsiveSpace2} />
      <Col {...responsiveSpace} />
      </Row>

</div>

  );
};

export default InventoryGetStarted;
