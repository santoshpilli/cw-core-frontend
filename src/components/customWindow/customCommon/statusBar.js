import React,{useState} from "react";
import { Row, Col } from "antd";
import {DoubleRightOutlined,DoubleLeftOutlined} from '@ant-design/icons'
import { useGlobalContext } from "../../../lib/storage";
import dayjs from "dayjs";

const customParseFormat = require("dayjs/plugin/customParseFormat");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

const StatusBar = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = globalStore.userData.CW360_V2_UI;
  const globalParams = JSON.parse(localStorage.getItem('globalParameters'))
  const [scrollLeft,setscrollLeft] = useState(true)
  const { auditLog,statusBarData } = props;
  const shallowCopyAuditLog = { ...auditLog };

  if(shallowCopyAuditLog.created){
    shallowCopyAuditLog.created = dayjs(shallowCopyAuditLog.created, "YYYY-MM-DD HH:mm:ss").fromNow();
    shallowCopyAuditLog.updated = dayjs(shallowCopyAuditLog.updated, "YYYY-MM-DD HH:mm:ss").fromNow();
  }

  const sty = {
    description: "status bar keys styles in the status bar part",
    fontSize: "12px",
    fontFamily:"Inter",
    overflowX: "hidden",
    position: "relative",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    backgroundColor: "#f2f2f2",
    borderRadius: "100px",
    marginRight:"7px",
    padding: "5px"
  }


  const  getScrollby = () =>{
    document.getElementById('yellow').scrollLeft += 600;
    setscrollLeft(false)
  }
  
  const getScrollbyRight = () =>{
    document.getElementById('yellow').scrollLeft -= 600;
    setscrollLeft(true)
  }

  const currencySymbol = JSON.parse(localStorage.getItem('currencyParams'))?.map(res=>{
    return(
      res.currSymbol
    )
  })
 
  const responsiveButtonIn = {
    xxl: 14,
    xl: 14,
    lg: 15,
    xs: 0,
    sm: 0,
    md: 14,
  };

  return (
    <>
 <Row style={{paddingLeft:"25px",paddingRight:'25px'}}>
 {shallowCopyAuditLog?.createdbyName ? (
          <Col {...responsiveButtonIn}>
            <div style={{ marginTop: "-7px"}}>
              <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>
                Created By : <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>{shallowCopyAuditLog?.createdbyName}</span> &emsp;
              </span>
              <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>
                Created On : <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>{shallowCopyAuditLog?.created}</span> &emsp;
              </span>
              <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>
                Updated By : <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>{shallowCopyAuditLog?.updatedbyName}</span> &emsp;
              </span>
              <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>
                Updated On : <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>{shallowCopyAuditLog?.updated}</span> &emsp;
              </span>
            </div>
          </Col>
       ) : null}
 </Row>
 {statusBarData.length > 0 ?(
 <Row gutter={[0, 22]} style={{overflow:'hidden',backgroundColor:"white",marginBottom:'-2px',paddingLeft:"25px",paddingRight:'25px'}} >
      <>
      <Col span={23}  id ="yellow" style={{overflow:'hidden'}}>
      {statusBarData.map((status, index) => (
          <span style={sty} key={`${index}`}>
            <span style={{opacity:0.5,color:"#000000",fontWeight:400,lineHeight:"20px"}}>&nbsp;{status.titleName}</span>&nbsp;<span style={{color:"#000000",fontWeight:"400",fontSize:"12px"}}>{status.amountId==='12'?currencySymbol:''}{status.amountId==='12'?status.titleValue.toLocaleString():status.titleValue}</span>&nbsp;
          </span>
        ))}
      </Col>
      {scrollLeft === true ?
      <Col style={{textAlign:'right'}} span={1}>
        <DoubleRightOutlined style={{color:"#0C173A"}} onClick={getScrollby} />
      </Col>
      :
      <Col style={{textAlign:'right'}} span={1}>
        <DoubleLeftOutlined style={{color:"#0C173A"}} onClick={getScrollbyRight} />
      </Col>
      }
      </>
    </Row>
    ):<div style={{paddingTop:'12px'}} />}
    </>
  );
};

export default StatusBar;
