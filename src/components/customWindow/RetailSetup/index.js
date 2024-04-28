import React,{useState,useEffect} from 'react'
import Axios from 'axios';
import {Form,Button,Input,Space,Card,Checkbox,Col,Row, Select, message, InputNumber,Spin} from "antd"
import { PlusOutlined,MinusCircleOutlined,PlusCircleOutlined,LoadingOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { useGlobalContext } from '../../../lib/storage';
//import { index } from 'd3';
import ThemeJson from "../../../constants/UIServer.json"
import Scrollbars from 'react-custom-scrollbars';
// import { serverUrl } from '../../../constants/serverConfig';
import { generateToken } from '../../../services/generateToken';

const responsiveDesignForColumn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 12,
    sm: 12,
    md: 12,
  };

  const { Option } = Select;
 
 const RetailSetup = () => {

  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const serverUrl = process.env.REACT_APP_serverUrl;
  const[ebill,setEbill]=useState('N')
  const[loyalty,setLoyalty]=useState('N')
  const[accounting,setAccounting] = useState('N')
  const [loading, setLoading] = useState(false);
  const [retailSetupForm]=Form.useForm();

const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    backgroundColor: "#c1c1c1",
    borderRadius: "5px",
    width: "8px",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

const renderView = ({ style, ...props }) => {
  const viewStyle = {
    color: "#00000",
  };
  return <div className="box" style={{ ...style, ...viewStyle }} {...props} />;
};

const saveData = () => {
  retailSetupForm.submit(); 
  
};


 const onFinish = async(values)=>{

const fieldValues = retailSetupForm.getFieldsValue();
const userData = window.localStorage.getItem('userData')
const sessData = JSON.parse(userData)

    
const formattedArray=[]
for(let i=0;i<fieldValues.dyanamicFileds.length;i++){

 formattedArray.push(
   `{
     name:"${values.dyanamicFileds[i].name}"
     type:"${values.dyanamicFileds[i].type}"
     parentBUnit:"${values.dyanamicFileds[i].parentbunit}"
     line1:"${values.dyanamicFileds[i].addressline1}"
     line2:"${values.dyanamicFileds[i].addressline2}"
     line3:"${values.dyanamicFileds[i].addressline3}"
     city:"${values.dyanamicFileds[i].city}"
     regionName:"${values.dyanamicFileds[i].region}"
     noOFTills:"${values.dyanamicFileds[i].tills}"
   }`
 )
}
 try {
   setLoading(true);
   const newToken = JSON.parse(localStorage.getItem("authTokens"));
   const retailSetupMutation = {
     query:`mutation {
      retailSetup(bunit: {
          eBill:"${ebill}"
          loyaltyLevel:"${loyalty}"
          accounting:"${accounting}"
          catalogueName:${fieldValues.catalogueName === null || fieldValues.catalogueName === undefined || fieldValues.catalogueName === '' ? null : `"${fieldValues.catalogueName}"`}
         csClientId: "${sessData.cs_client_id}"
          csbUnits:[${formattedArray}]
       }) {
        status
        message
      }
    }
    `
   };
   Axios({
     url:serverUrl,
     method:"POST",
     data:retailSetupMutation,
     headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${newToken}`,
    },
   }).then((response)=>{
     const retailSetupResponse = response.data.data.retailSetup
     if(retailSetupResponse.status === "200"){
      setLoading(false);
       message.success(retailSetupResponse.message)
       window.location.reload()
     }else{
      setLoading(false)
       message.error(retailSetupResponse.message) 
     }
   });
 } catch (error) {
  const { message } = JSON.parse(JSON.stringify(error));
  if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
    generateToken();
  } else {
    return Promise.reject(error);
    
  }
}
  }
  
const onChangeEbill=(e)=>{
 let checkedValue = e.target.checked
  if(checkedValue === true){
    setEbill('Y')
  }else{
    setEbill('N')
  }
}

const onChangeAccounting = (e)=>{
  let checkedValue = e.target.checked
  if(checkedValue === true){
    setAccounting('Y')
  }else{
    setAccounting('N')
  }
}

const onChangeLoyalty=(e)=>{
  let checkedValue = e.target.checked
  if(checkedValue === true){
    setLoyalty('Y')
  }else{
    setLoyalty('N')
  }
}

  return (
   <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
    <div>
   <Row>
           <Col {...responsiveDesignForColumn}>
           <p style={Themes.contentWindow.ListWindowHeader.listWindowTitle}> &ensp;Retail Setup</p>
           </Col>
           <Col {...responsiveDesignForColumn} span={4} style={{textAlign:'right'}}>
              {/* <Button type='primary' htmlType='submit'  style={{height:'2rem',width:'5.4rem',backgroundColor:'rgb(8 158 164)',border:'0.25px solid rgb(7, 136, 141)',borderRadius:'2px',fontSize:'14px',color:'rgb(255, 255, 255)',fontWeight:'500',fontFamily:'Open Sans',opacity:'1'}}>Save</Button>&nbsp; */}
            <Button type='primary' onClick={saveData} style={{height:'2rem',width:'5.4rem',backgroundColor:'rgb(8 158 164)',border:'0.25px solid rgb(7, 136, 141)',borderRadius:'2px',fontSize:'14px',color:'rgb(255, 255, 255)',fontWeight:'500',fontFamily:'Open Sans',opacity:'1'}}>Process</Button>
          </Col>
      </Row>
     
        <Card style={Themes.contentWindow.recordWindow.RecordHeader.headerCard}>
        <Form name='retailSetupForm' form={retailSetupForm} layout='vertical'  autoComplete="off" onFinish={onFinish}>
        <Row>
        <Col span={24}>
           <Scrollbars  style={{
                        height: "75vh",width:'100%'
                      }}
                      autoHide
                      autoHideTimeout={1000}
                      autoHideDuration={200}
                      thumbSize={90}
                      renderView={renderView}
                      renderThumbHorizontal={renderThumb}
                      renderThumbVertical={renderThumb}>
             <Row gutter={16}>
                <Col span={6}>
                  <Form.Item label="Enable E-Bill" name="enableEbill" valuePropName='checked'>
                  <Checkbox onChange={onChangeEbill} checked={ebill === 'Y' ? true:false} value={ebill}></Checkbox>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Enable Accounting" name="enableAccounting" valuePropName='checked'>
                  <Checkbox onChange={onChangeAccounting} checked={accounting === 'Y' ?true:false} value={accounting}></Checkbox>
                  </Form.Item>
                </Col>
                <Col span={6}><Form.Item label="Enable Loyalty" name="enableLoyalty" valuePropName='checked'>
                <Checkbox onChange={onChangeLoyalty} checked={loyalty === 'Y' ? true:false} value={loyalty}></Checkbox>
                </Form.Item>
                </Col>
                <Col span={4}>
                      <Form.Item
                          name="catalogueName"
                          label="Catalogue Name">
                           <Input/>
                       </Form.Item>
                </Col>
             </Row> <br/> 
      
                    {/* ============================================================ */}
            
                   <Form.List  name="dyanamicFileds"  autoComplete="off">
                      {(fields,{add,remove})=>(

                          <>
                          <Row>
                          
                          <Col span={3}>
                            <h3 style={{marginBottom:0,color: "#5d5454",fontWeight:500 }}>Business Units</h3>
                          </Col>
                          <Col span={20}/>
                            <Col className="gutter-row" span={1} style={{textAlign:"right"}}>
                           <Form.Item >
                           <span >
                              <PlusCircleOutlined  onClick={() => add()}/>
                             </span>
                           </Form.Item>
                          </Col>
                        </Row>
                         
                           <br/>
                           {fields.map(({key,name,index,...restField})=>(
                               
                                   <>
                                   
                                    <Row>
                                       <Col span={23}>
                                           <Row gutter={16}>
                                               <Col span={3} className='gutter-row'>
                                                   <Form.Item key={index} name={[name,'name']} label='Name' {...restField} style={{marginBottom:'8px'}}>
                                                       <Input/>
                                                   </Form.Item>
                                               </Col>
                                               <Col span={2} className='gutter-row'>
                                               <Form.Item key={index}  name={[name, 'type']} label="Type"  {...restField} style={{ marginBottom: "8px" }}>
                         
                                                 <Select  
                                                   showSearch
                                                
                                                  // onFocus={()=>onSelectFocus(key)}
                                                  // onChange={onChange(key)}
                                                  // onSelect={onSelectType}
                                                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}           
                                                 >
                                                  <Option  value="LE" title="Legal Entity">
                                                   Legal Entity
                                                </Option>
                                                <Option value="DV" >
                                                  Division
                                                </Option>
                                                <Option value = "WH">
                                                  Ware House
                                                </Option>

                                                <Option  value="RS" title="Retail Store">
                                                 Retail Store
                                               </Option>

                                              </Select>
                                             </Form.Item>
                                       </Col>
                                               <Col span={4} className='gutter-row'>
                                                <Form.Item key={index}  name={[name, "parentbunit"]} required={false} label="Parent Business Unit"  {...restField} style={{ marginBottom: "8px" }}>
                                                 <Input  />
                                                </Form.Item>
                                               </Col>
                                               <Col span={3} className='gutter-row'>
                                                <Form.Item key={index}  name={[name, "addressline1"]} required={false} label="Address Line 1"  {...restField} style={{ marginBottom: "8px" }}>
                                                 <Input  />
                                                </Form.Item>
                                               </Col>
                                               <Col span={3} className='gutter-row'>
                                                <Form.Item key={index}  name={[name, "addressline2"]} required={false} label="Address Line 2"  {...restField} style={{ marginBottom: "8px" }}>
                                                  <Input  />
                                                </Form.Item>
                                               </Col>
                                               <Col span={3} className='gutter-row'>
                                                 <Form.Item  key={index} name={[name, "addressline3"]} label="Address Line 3"  {...restField} style={{ marginBottom: "8px" }}>
                                                  <Input  />
                                                 </Form.Item>
                                               </Col>
                                               <Col span={2} className='gutter-row'>
                                                <Form.Item  key={index} name={[name, "city"]} label="City"  {...restField} style={{ marginBottom: "8px" }}>
                                                 <Input  />
                                                </Form.Item>
                                               </Col>
                                               <Col span={2} className='gutter-row'>
                                                <Form.Item key={index}  name={[name,"region"]} label="Region"  {...restField} style={{ marginBottom: "8px" }}>
                                                 <Input  />    
                                                </Form.Item>
                                               </Col>
                                               <Col span={2} className='gutter-row'>
                                               <Form.Item   key={index} label='No of Tills' name={[name,'tills']} {...restField} initialValue={0} >
                                                  <InputNumber  />
                                                 </Form.Item>
                                               </Col>
                                           </Row>
                                       </Col>
                                       <Col span={1} className='gutter-row'>
                                       <MinusCircleOutlined onClick={() => remove(name)} />
                                       </Col>
                                   </Row>
                                  
                                   </>
                               )
                           )}
                          </>
                      )}
                   </Form.List>
                   </Scrollbars>
                   </Col>
  </Row>
  </Form>
  </Card>
  </div>
  </Spin>
  )
                                  }
export default RetailSetup;