import React,{useState} from "react";
import { Row, Col } from "antd";
import {DoubleRightOutlined,DoubleLeftOutlined} from '@ant-design/icons'
import { useGlobalContext } from "../../lib/storage";
import ThemeJson from "../../constants/UIServer.json";

const StatusBar = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const globalParams = JSON.parse(localStorage.getItem('globalParameters'))
  const [scrollLeft,setscrollLeft] = useState(true)
  
  const { statusBar } = props;
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

  globalParams?.Currency.map((obj)=>{
    Object.values(obj).map(des=>{
      statusBar.map(res=>{
        Object.values(res).map(tre=>{

          if( Object.values(des)[2]===tre){
           localStorage.setItem('currencyParams',JSON.stringify(Object.values(obj))) 
          }
    })
  })})})
  
  const getScrollbyRight = () =>{
    document.getElementById('yellow').scrollLeft -= 600;
    setscrollLeft(true)
  }

  const currencySymbol = JSON.parse(localStorage.getItem('currencyParams'))?.map(res=>{
    return(
      res.currSymbol
    )
  })
 
  return (
    <>
    <Row gutter={[0, 22]} style={{overflow:'hidden',backgroundColor:"white",marginBottom:'-2px',paddingLeft:"0.3em"}} >
      <Col span={23}  id ="yellow" style={{overflow:'hidden',left:10}}>
        {statusBar.map((status, index) => (
          <span style={sty} key={`${index}`}>
            <span style={{opacity:0.5,color:"#000000",fontWeight:400,lineHeight:"20px"}}>&nbsp;{status.titleName}</span>&nbsp;:&nbsp;<span style={{color:"#000000",fontWeight:"400",fontSize:"12px"}}>{status.amountId==='12'?currencySymbol:''}{status.amountId==='12'?status.titleValue.toLocaleString():status.titleValue}</span>&nbsp;
          </span>
        ))}
      </Col>
      {scrollLeft === true ?
      <Col style={{textAlign:'right',right:10}} span={1}>
        <DoubleRightOutlined style={{color:"#0C173A"}} onClick={getScrollby} />
      </Col>
      :
      <Col style={{textAlign:'right',right:10}} span={1}>
        <DoubleLeftOutlined style={{color:"#0C173A"}} onClick={getScrollbyRight} />
      </Col>
      }
    </Row>
    {/* <hr style={{opacity:0.1}}/> */}
    </>
  );
};

export default StatusBar;
