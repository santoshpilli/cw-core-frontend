import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col, Select, Button, Modal, Spin, Table, Image, Input, DatePicker, Radio, Space, Tabs,Popover, message, InputNumber,Menu } from "antd";
import { LoadingOutlined, PlusCircleOutlined, PrinterOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";
import { getWorkOrderDetails} from "../../../services/custom";
// import { serverUrl, genericUrl } from "../../../constants/serverConfig";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import ListData from "../NewWorkOrer/listData";
import { Collapse } from 'antd';
import "antd/dist/antd.css";
import "../../../styles/antd.css";
// import { useHistory } from "react-router";
import { Scrollbars } from "react-custom-scrollbars";
import { useParams } from "react-router-dom";
import { useForm } from "rc-field-form";



const { Option } = Select;
const { TabPane } = Tabs;
const dateFormat = "YYYY-MM-DD";
const { Panel } = Collapse;

const NewWorkOrder = () => {
const [loading, setLoading] = useState(false)
const [isListView,setIsListView] = useState(false)
const [workDetailsData,setWorkDetailsData] = useState([])
const [itemData,setItemData]= useState([])
const [orderedDate,setOrderedDate] = useState('')
const [productID,setProductID] = useState([])
const [metalProductID,setMetalProductID] = useState([])
const [productIdData,setProductIdData] = useState({'solitaireId':'','metalId':''})
const [arrayForMutaion,setArrayForMutaion] = useState([])
const serverUrl = process.env.REACT_APP_serverUrl;
const genericUrl = process.env.REACT_APP_genericUrl;
  const { recordId } = useParams();
  const [soliatire] = Form.useForm()
  const [metalForm] = Form.useForm()

  useEffect(() => {
    if(recordId) {
      setIsListView(true);
      setLoading(true);
      getWorkOrderDetailsData(recordId)
    } else {
      setIsListView(false);
    }
  }, [recordId]);
const history = useHistory();

  const getWorkOrderDetailsData = async(recordId)=>{
    setLoading(true)
    const workOrderDetailsData = await getWorkOrderDetails(recordId)
    setLoading(false)
    let data = []
    // let dynamicData = []
    data.push(workOrderDetailsData[0].pOrderLines[0])
    for(let ind =0;ind<workOrderDetailsData[0].pOrderLines.length;ind++){
      for(let i=0;i<workOrderDetailsData[0].pOrderLines[ind].metaDetails.length;i++){
        if(workOrderDetailsData[0].pOrderLines[ind].metaDetails[i].key === "salesOrder_Object"){
          workOrderDetailsData[0].pOrderLines[ind].dynamicData = JSON.parse(workOrderDetailsData[0].pOrderLines[ind].metaDetails[i].value)
          let obj = {}
          let obj1 = {}
          workOrderDetailsData[0].pOrderLines[ind].dynamicData.arrayMetaData.map((element)=>{
            if(element.name === "solitaire"){
              obj[element.key] = element.value
              
            }else{
              obj1[element.key] = element.value
            }
          })
          workOrderDetailsData[0].pOrderLines[ind].dynamicData.solitaireData = [obj]
          workOrderDetailsData[0].pOrderLines[ind].dynamicData.metalData = [obj1]
        }
      }
    }

    if(workOrderDetailsData[0].pOrderLines[0].dynamicData?.solitaireData){
      const arrayForMutation = []
      let array = ["D","E","F","G","H","I"]
      let clarityArry = ["IF","VVS1","VVS2","VS1","VS2","SI1","SI2"]
      let finalColour = array.slice(array.indexOf(workOrderDetailsData[0].pOrderLines[0].dynamicData.solitaireData[0]['DSColour-E7933C2C6C744FBFB94299F65A66C0EE'] ),array.indexOf(workOrderDetailsData[0].pOrderLines[0].dynamicData.solitaireData[0].colour1)+1)
      let finalClarity = clarityArry.slice(clarityArry.indexOf(workOrderDetailsData[0].pOrderLines[0].dynamicData.solitaireData[0]['DSClarity-5DE648F02E564CA4A8BA392B86B6ADB1']), clarityArry.indexOf(workOrderDetailsData[0].pOrderLines[0].dynamicData.solitaireData[0].clarity1)+1)
      let flag = "N"
      
     Object.entries(workOrderDetailsData[0].pOrderLines[0].dynamicData.solitaireData[0]).map((item,index)=>{
        if(item[0].includes('-') ){
          let id = item[0].split('-')
          if(item[0] === "DSColour-E7933C2C6C744FBFB94299F65A66C0EE"){
            arrayForMutation.push(`{
              designAttributeId: "${id[1]}",
              value: "${finalColour.toString()}"
            }`)
          }else if(item[0] === "DSClarity-5DE648F02E564CA4A8BA392B86B6ADB1"){
            arrayForMutation.push(`{
              designAttributeId: "${id[1]}",
              value: "${finalClarity.toString()}"
            }`)
          }else{
            arrayForMutation.push(`{
              designAttributeId: "${id[1]}",
              value: "${item[1]}"
            }`)
          }
          }
        })  
        getProductIdDetails(arrayForMutation,"1",data,workOrderDetailsData)
      }
    if(workOrderDetailsData[0].pOrderLines[0].dynamicData?.metalData){
      const arrayForMutation = []
      Object.entries(workOrderDetailsData[0].pOrderLines[0].dynamicData.metalData[0]).map((item)=>{
        if(item[0].includes('-')  ){
          let id = item[0].split('-')
                arrayForMutation.push(`{
                  designAttributeId: "${id[1]}",
                  value: "${item[1].trim()}"
                }`);
        }
        })
        getProductIdDetails(arrayForMutation,"2",data,workOrderDetailsData)
    }
    setOrderedDate(workOrderDetailsData[0].pOrderLines[0].date)
    setWorkDetailsData(workOrderDetailsData)
    setItemData(data)
  }

  const getMenuData=(data)=>{
    soliatire.resetFields()
    metalForm.resetFields()
    let item = []
    item.push(data)
    if(data.dynamicData.solitaireData){
      const arrayForMutation = []
      let array = ["D","E","F","G","H","I"]
      let clarityArry = ["IF","VVS1","VVS2","VS1","VS2","SI1","SI2"]
      let finalColour = array.slice(array.indexOf(data.dynamicData.solitaireData[0]['DSColour-E7933C2C6C744FBFB94299F65A66C0EE'] ),array.indexOf(data.dynamicData.solitaireData[0].colour1)+1)
      let finalClarity = clarityArry.slice(clarityArry.indexOf(data.dynamicData.solitaireData[0]['DSClarity-5DE648F02E564CA4A8BA392B86B6ADB1']), clarityArry.indexOf(data.dynamicData.solitaireData[0].clarity1)+1)
      let flag = "N"
      
     Object.entries(data.dynamicData.solitaireData[0]).map((item,index)=>{
        if(item[0].includes('-') ){
          let id = item[0].split('-')
          if(item[0] === "DSColour-E7933C2C6C744FBFB94299F65A66C0EE"){
            arrayForMutation.push(`{
              designAttributeId: "${id[1]}",
              value: "${finalColour.toString()}"
            }`)
          }else if(item[0] === "DSClarity-5DE648F02E564CA4A8BA392B86B6ADB1"){
            arrayForMutation.push(`{
              designAttributeId: "${id[1]}",
              value: "${finalClarity.toString()}"
            }`)
          }else{
            arrayForMutation.push(`{
              designAttributeId: "${id[1]}",
              value: "${item[1]}"
            }`)
          }
          }
        })  
        let mainData = [data]
        getProductIdDetails(arrayForMutation,"1",mainData)
      }
    if(data.dynamicData.metalData){
      const arrayForMutation = []
      Object.entries(data.dynamicData.metalData[0]).map((item)=>{
        if(item[0].includes('-')  ){
          let id = item[0].split('-')
                arrayForMutation.push(`{
                  designAttributeId: "${id[1]}",
                  value: "${item[1].trim()}"
                }`);
        }
        })
        let mainData = [data]
        getProductIdDetails(arrayForMutation,"2",mainData)
    }
    setItemData(item)
  }


  const getProductIdDetails = async(arrayForMutation,type,data)=>{
    const newToken = JSON.parse(localStorage.getItem("authTokens"));
    setLoading(true)
    const productId = {
      query:`
      query{
        getProductByAttributes( design: {
        attributes:[${arrayForMutation}]})  
         {
          productId
          name
        }  
      }
      `
    }
    Axios({
      url: serverUrl,
      method: "POST",
      data: productId,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      },
    }).then((response)=>{
      setLoading(false)
      if(response.data.data.getProductByAttributes?.length>0 ){
        if( type === "1"){
          setProductID(response.data.data.getProductByAttributes)
          if(data[0].prIOProductLines.length>0){
            data[0].prIOProductLines.map((element)=>{
              if(element.attrGroupName === "Solitaire"){
                soliatire.setFieldsValue({
                  productID:element.productName
                })
              }
            })
          }
        } 

        if(type === "2"){
          setMetalProductID(response.data.data.getProductByAttributes)
          if(data[0].prIOProductLines.length>0){
            data[0].prIOProductLines.map((element)=>{
              if(element.attrGroupName === "Metal"){
                metalForm.setFieldsValue({
                  productID:element.productName
                })
              }
            })
          }
      }
      }
    })
  }

  const getProductID =(data)=>(e)=>{
    for(let i=0;i<workDetailsData[0].pOrderLines.length;i++){
      if(workDetailsData[0].pOrderLines[i].prOrderId === data[0].prOrderId){
        workDetailsData[0].pOrderLines[i].solitaireId = e
      }
    }
    setWorkDetailsData(workDetailsData)   
  }

  const getMetalProductID =(data)=>(e)=>{
    for(let i=0;i<workDetailsData[0].pOrderLines.length;i++){
      if(workDetailsData[0].pOrderLines[i].prOrderId === data[0].prOrderId){
        workDetailsData[0].pOrderLines[i].metalId = e
      }
    }

    setWorkDetailsData(workDetailsData)
  }

  const onSave =()=>{
    const newToken = JSON.parse(localStorage.getItem("authTokens"));
    let arrayForMutaion = []
    workDetailsData[0].pOrderLines.map((element)=>{
      let uniq1 = uuid().replace(/-/g, "").toUpperCase();
      let uniq2 = uuid().replace(/-/g, "").toUpperCase();
      if(element.prIOProductLines.length>0 && element.solitaireId !== undefined && element.metalId !== undefined){
        element.prIOProductLines.map((item)=>{
          let array =[]
          if(item.attrGroupName === "Solitaire"){
            array.push(`{
              prIOProductionId:"${item.ioProductId}"
              productId:"${element.solitaireId}"
            }`)
          }
          if(item.attrGroupName === "Metal"){
            array.push(`{
              prIOProductionId:"${item.ioProductId}"
              productId:"${element.metalId}"
            }`)
          }

          arrayForMutaion.push(`{
            prOrderId:"${element.prOrderId}"
            workOrder:[${array}]
          }`)
        })
      }else if(element.metalId !== undefined && element.solitaireId !== undefined){
        arrayForMutaion.push(`{
          prOrderId:"${element.prOrderId}"
          workOrder:[${`{
            prIOProductionId:"${uniq1}"
            productId:"${element.solitaireId}"
          },{
            prIOProductionId:"${uniq2}"
            productId:"${element.metalId}"
          }`}]
        }`)
      
      }
      
      
    })
    const workOrder = {
      query:`mutation {
        upsertProductionLine(workOrder: [${arrayForMutaion}]) { 
      status
      message 
      }
      }`
    }
    Axios({
      url: serverUrl,
      method: "POST",
      data: workOrder,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      },
    }).then((response)=>{
      const status = response.data.data.createWorkOrder.status
      if(status === "200"){
        message.success(response.data.data.createWorkOrder.message);
      }else{
        message.error("Please select the product");
      }
    })
  }


  const renderView = ({ style, ...props }) => {
    const viewStyle = {
      color: "#00000",
    };
    return <div className="box" style={{ ...style, ...viewStyle }} {...props} />;
  };

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: "#c1c1c1",
      borderRadius: "5px",
      width: "8px",
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };
  const style1 = {fontSize:'15px',letterSpacing: "0.3px",color: "#666666"}
  const style2 = {fontSize:'13px',letterSpacing: "0.52px",color: "#8E8E8E"}

  return (
    <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
<div>
     { isListView ?
     <>
      <Row >
         <Col span={12} style={{display:'flex',flexDirection:'column'}}>
           <span  style={{ fontWeight: "500", fontSize: "12px", color: "#1648AA", marginBottom: "0px", marginTop: "1%",cursor:'pointer' }} onClick={()=>{history.push(`/others/window/7473`);}}>Work Order</span>
           <span  style={{ fontWeight: "500", fontSize: "25px", color: "#161537", marginBottom: "0px",marginLeft:'0px' }}>New Work Order</span>
         </Col>
         <Col span={12}>
           <span style={{ float: "right" }}>
             <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }}>
              Cancel
             </Button>
             <Button onClick={onSave} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }}>
             Save
             </Button>
           </span>
         </Col>
       </Row>
     {
       workDetailsData.map((element)=>{
        return (
        <div>
       <Card>
        <Row gutter={16} >
        <Col span={6} style={{marginTop:'10px',marginBottom:'10px' }}>
          <span style={style2}>Supplier</span>
          <br/>
          <span style={style1}>{element.supplierName}</span>
        </Col>
        <Col span={6} style={{marginTop:'10px',marginBottom:'10px'}}>
        <span  style={style2}>Date</span>
          <br/>
          <span style={style1}>{element.date}</span>
        </Col>
        <Col span={6} style={{marginTop:'10px',marginBottom:'10px'}}>
        <span  style={style2}>Work Order</span>
          <br/>
          <span style={style1}>{element.documentNo}</span>
        </Col>
        <Col span={6} style={{marginTop:'10px',marginBottom:'10px'}}>
        <span  style={style2}>Location</span>
          <br/>
          <span style={style1}>{element.city}</span>
        </Col>
        <Col span={6} style={{marginTop:'10px',marginBottom:'10px'}}>
        <span  style={style2}>Sales Order</span>
          <br/>
          <span style={style1}>{element.sDocumentNo}</span>
        </Col>
        <Col span={6} style={{marginTop:'10px',marginBottom:'10px'}}>
        <span  style={style2}>Required By</span>
          <br/>
          <span style={style1}>{element.date}</span>
        </Col>
        </Row>
       </Card>
       <Card style={{marginTop:'16px'}}>
       <Row >
           <Col span={3} style={{background:"#666666"}}>
           <Scrollbars
               autoHide
               autoHideTimeout={1000}
               autoHideDuration={200}
               thumbSize={100}
               renderView={renderView}
               // renderThumbHorizontal={renderThumb}
               renderThumbVertical={renderThumb}
               style={{ height: "53vh" }}
             >
           {element.pOrderLines.map((item,index)=>{
             return(
               <Menu defaultSelectedKeys={[element.pOrderLines[0]?.prOrderId]} >
                 <Menu.Item key={item?.prOrderId} onClick={()=>getMenuData(item)} style={{backgroundColor:`${item?.prOrderId === itemData[0]?.prOrderId? "#949494" : "#666666"}`}} ><img src={item.imageUrl} style={{height:'25px',width:'25px',borderRadius:'3px'}}/> <span style={{color:'#FFFFFF',marginLeft:'2px'}}>{item.productName}</span></Menu.Item>
               </Menu>
            )
           }
           )}
           </Scrollbars>
   
           </Col>
   
           <Col span={21} style={{background:'white'}}>
             {itemData.map((ele)=>{
               return (<Row style={{marginTop:'20px',marginLeft:'20px'}}>
               <Col span={10} style={{marginLeft:'0px'}}>
             <img src={ele?.imageUrl} style={{width: "350px", height: "300px",border: "0.5px solid #D7DADE"}}/>
               </Col>
               <Col span={14} style={{marginLeft:'-15px',marginTop:'-8px'}}>
               <div style={{marginRight:'0px',color: '#666666',fontSize:'22px',fontWeight:'500',marginBottom:'8px'}}>
                 Twisting Vine Ring
                 </div>
                 <Scrollbars
               autoHide
               autoHideTimeout={1000}
               autoHideDuration={200}
               thumbSize={100}
               renderView={renderView}
               // renderThumbHorizontal={renderThumb}
               renderThumbVertical={renderThumb}
               style={{ height: "40vh",marginTop:'12px' }}
             >
              <Card bodyStyle={{padding:'5px'}} style={{boxShadow: "0px 3px 6px #00000029",borderRadius: "5px",marginBottom:'5px'}}>
              <span style={{color:'rgba(0, 0, 0, 0.85)',fontWeight:'600',fontSize:'14px'}}>Solitaire</span>
              
              <Form name="solitaire" form={soliatire} layout="vertical">
              <Row gutter={10}> 
              
              {
                ele.dynamicData.arrayMetaData.map((item)=>{
                  let key = item.key.split('-')
                  if(item.name === "solitaire" && key[0] !== "minPrice" && key[0] !== "maxPrice"){
                    return(
                      <Col span={4}>
                         <span style={{letterSpacing: '0.52px',color: '#8E8E8E',fontSize:'13px'}}>
                         {key[0]}
                         </span>
                         <br/>
                         <span style={{letterSpacing: '0.3px',color: '#666666',fontSize:'15px'}}> 
                           {item.value}
                         </span>
                       </Col>
                    )
                  }
                  
                })
              }
                     
                     <Col span={6}>
                       
                       <Form.Item name="productID" label="Product ID" style={{ marginBottom: "8px" }}>
                       <Select
                         allowClear
                         showSearch
                         filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                         onSelect={getProductID(itemData)}
                       >
                         {productID.map((data) => (
                           <Option key={data.productId} value={data.productId} title={data.name}>
                             {data.name}
                           </Option>
                         ))}
                       </Select>
                     </Form.Item>
                      
                     </Col>
                   </Row>
              </Form>
             
              </Card>
              <Card bodyStyle={{padding:'5px'}} style={{boxShadow: "0px 3px 6px #00000029",borderRadius: "5px",marginBottom:'5px'}}>
              <div style={{color:'rgba(0, 0, 0, 0.85)',fontWeight:'600',fontSize:'14px'}}>Metal</div>
              <Form name="metalForm" form={metalForm} layout="vertical">
              <Row gutter={10}>
              {
                  ele.dynamicData.arrayMetaData.map((item)=>{
                    let key = item.key.split('-')
                    if(item.name === "metal" && key[0] !== "metalPrice"){
                      return(
                        <Col span={4}>
                           <span style={{letterSpacing: '0.52px',color: '#8E8E8E',fontSize:'13px'}}>
                           {key[0]}
                           </span>
                           <br/>
                           <span style={{letterSpacing: '0.3px',color: '#666666',fontSize:'15px'}}> 
                             {item.value}
                           </span>
                         </Col>
                      )
                    }
                    
                  })  
                  }
                       <Col span={5}>
                       
                         <Form.Item name="productID" label="Product ID" style={{ marginBottom: "8px" }}>
                         <Select
                           allowClear
                           showSearch
                           filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                           onSelect={getMetalProductID(itemData)}
                         >
                           {metalProductID.map((data) => (
                             <Option key={data.productId} value={data.productId} title={data.name}>
                               {data.name}
                             </Option>
                           ))}
                         </Select>
                       </Form.Item>
                         
                       </Col>
                     </Row>
              </Form>
              
              </Card>
              <Card bodyStyle={{padding:'5px'}} style={{boxShadow: "0px 3px 6px #00000029",borderRadius: "5px",marginBottom:'5px'}}>
              <div style={{color:'rgba(0, 0, 0, 0.85)',fontWeight:'600',fontSize:'14px'}}>Side Diamond</div>
              <Row gutter={10}>
                       <Col span={4}>
                         <span style={{letterSpacing: '0.52px',color: '#8E8E8E',fontSize:'13px'}}>
                           Purity
                         </span>
                         <br/>
                         <span style={{letterSpacing: '0.3px',color: '#666666',fontSize:'15px'}}> 
                           18KT
                         </span>
                       </Col>
                       <Col span={4}>
                       <span style={{letterSpacing: '0.52px',color: '#8E8E8E',fontSize:'13px'}}>
                           Color
                         </span>
                         <br/>
                         <span style={{letterSpacing: '0.3px',color: '#666666',fontSize:'15px'}}> 
                           White
                         </span>
                       </Col>
                       <Col span={4}>
                       <span style={{letterSpacing: '0.52px',color: '#8E8E8E',fontSize:'13px'}}>
                           Qty
                         </span>
                         <br/>
                         <span style={{letterSpacing: '0.3px',color: '#666666',fontSize:'15px'}}> 
                           5
                         </span>
                       </Col>
                       <Col span={4}>
                       <span style={{letterSpacing: '0.52px',color: '#8E8E8E',fontSize:'13px'}}>
                           Unit
                         </span>
                         <br/>
                         <span style={{letterSpacing: '0.3px',color: '#666666',fontSize:'15px'}}> 
                         grams
                         </span>
                       </Col>
                       <Col span={4}>
                       <span style={{letterSpacing: '0.52px',color: '#8E8E8E',fontSize:'13px'}}>
                           Product ID
                         </span>
                         <br/>
                         <span style={{letterSpacing: '0.3px',color: '#666666',fontSize:'15px'}}> 
                           20,000.00
                         </span>
                       </Col>
              </Row>
              </Card> 
                   
                 
                 </Scrollbars>
               </Col>
             </Row>)
             })}
           </Col>
         </Row>
       </Card>
         
       
       </div>)
        }) 
     }
     </>
     : <ListData/>
     }
   </div>
    </Spin>

   
  )
};

export default NewWorkOrder;
