import React, { useEffect, useState } from "react";
import { Card, Menu, Dropdown,Collapse, Form, Row,Upload, Col,Radio, Select,Checkbox, Button,Input, InputNumber, Spin,DatePicker, message, Table, Image,Popover } from "antd";
import { getRoleBusinessUnit,getQualityTask,getconfirmQualityTask } from "../../../services/custom";
import { LoadingOutlined,UploadOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";
import { useParams,useHistory } from "react-router-dom";
import { useGlobalContext } from "../../../lib/storage";
import dayjs from "dayjs";
import "./style.css"
import ThemeJson from "../../../constants/UIServer.json"

import moment from "moment";
const { Panel } = Collapse;
const { Option } = Select;

const DetailsView = () => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const history = useHistory();
  const [bunitData, setBunitData] = useState([]);
  const [bUnitId, setBUnitId] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskData,setTaskData] = useState([])
  const [headerData,setHeaderData] = useState([])
  const [headerform] = Form.useForm();
  const [parametersform] = Form.useForm();
  const {recordId} = useParams()
  const [displayShow, setdisplayShow] = useState("none");
  const [lineData,setLineData] = useState([])

  
  const getBusinessUnit = async () => {
    const userData = JSON.parse(window.localStorage.getItem("userData"));
    const businessUnitResponse = await getRoleBusinessUnit(userData.user_id);
    headerform.setFieldsValue({
      businessUnit: businessUnitResponse.bUnitName,
    });
    setBunitData(businessUnitResponse.userBunit);

    setBUnitId(businessUnitResponse.defaultCsBunitId);
    localStorage.setItem('BUnitId', businessUnitResponse.defaultCsBunitId)
  };


  useEffect(() => {
    getData()
  }, []);

  const getData = async () =>{
    setLoading(true)
    const qualityTaskResponse = await getQualityTask()
    const Tdata = qualityTaskResponse !== null && qualityTaskResponse.length > 0 ? qualityTaskResponse :[]
    let newArray = []
    let newArray2 = []
    for (let index = 0; index < Tdata.length; index++) {
      const element = Tdata[index].cWQInspectionTaskId;
      Tdata[index].date = Tdata[index].date === null || Tdata[index].date === undefined || Tdata[index].date === "" ? null :moment(Tdata[index].date).format('YYYY-MM-DD')
      if(element === recordId){
        newArray2.push(Tdata[index])
        newArray.push(Tdata[index].cWQInspectionTaskLine)
      }
    }
    setBUnitId(newArray2[0].bUnit.csBunitId)
    headerform.setFieldsValue({
      'businessUnit':newArray2[0].bUnit.name,
      'product':newArray2[0].product.name,
      'batch':newArray2[0].batchNo,
      'serviceEngg':newArray2[0].cwqQualityEngineerName,
    })

    const lineDataToFormat = newArray[0]
    const newColumnGroups = []
    for (let index = 0; index < lineDataToFormat.length; index++) {
      const element = lineDataToFormat[index].refValues;
      lineDataToFormat[index].remarksId = `${lineDataToFormat[index].cWQInspectionTaskLineId}@remarks`
      if(element === null){
        lineDataToFormat[index].newRefValues = []
      }else{
        lineDataToFormat[index].newRefValues = lineDataToFormat[index].refValues. split(',')
      }
      newColumnGroups.push(lineDataToFormat[index].parameterGroupName)
    }
    const uniquenewColumnGroups = [...new Set(newColumnGroups)];
    setLineData(lineDataToFormat)
  
    const finalArray = []
    for (let index = 0; index < uniquenewColumnGroups.length; index++) {
      const element1 = uniquenewColumnGroups[index];
      let newArr = []
        for (let index2 = 0; index2 < lineDataToFormat.length; index2++) {
          const element2 = lineDataToFormat[index2].parameterGroupName;
          const uniqId = uuid()
          .replace(/-/g, "")
          .toUpperCase();
            if(element1 === element2) {
              newArr.push(lineDataToFormat[index2])            
              finalArray.push({'GroupName':element1,'ValueArray':newArr,'key':uniqId})
            }
        }
    }

    let check = {};
    let res = [];
    for(let i=0; i<finalArray.length; i++) {
        if(!check[finalArray[i]['GroupName']]){
            check[finalArray[i]['GroupName']] = true;
            res.push(finalArray[i]);
        }
    }

    
    setHeaderData(newArray2)
    setTaskData(res)
    setLoading(false)
  }
  
  const ProcessTask = () =>{
   const headerFormValues = headerform.getFieldsValue(true)
   const dyanamicFieldsValues = parametersform.getFieldsValue(true)
   setLoading(true)
    const dyanamicArray = []
    for (const [key, value] of Object.entries(dyanamicFieldsValues)) {
      const obj = {
        Key:key,
        value:value
      }
      dyanamicArray.push(obj)
    }
   for (let index = 0; index < lineData.length; index++) {
     const element = lineData[index];
     const newId = element.cWQInspectionTaskLineId
     const remarksId = lineData[index].remarksId
     for (let index2 = 0; index2 < dyanamicArray.length; index2++) {
       const dyanamicArryKey = dyanamicArray[index2].Key;
       if(newId === dyanamicArryKey){
        lineData[index].newFormValues = dyanamicArray[index2].value
       }
       if(remarksId === dyanamicArryKey){
        lineData[index].remarksFromForm = dyanamicArray[index2].value
       }
     }
   }

   confirmQualityTask(headerFormValues,headerData,lineData)

  }

  const confirmQualityTask = async (headerFormValues,headerData,lineData) =>{
    const response = await getconfirmQualityTask(headerFormValues,headerData,lineData)
    if(response.status === "200"){
      message.success(response.message)
      setLoading(false)
    }else{
      message.error("Faild to update")
      setLoading(false)
    }
  }

  const editFields = () => {
    setdisplayShow("none");
  };

  const onCancel = () =>{
    setdisplayShow('block')
  }

  const onClose = () =>{
    history.push(`/others/window/7475`);
  }

  const imageUploadStatusChange = (uploadStatus) => {
    
  };

  // let activeKeys = []
  // for (let index = 0; index < taskData.length; index++) {
  //   activeKeys.push(taskData[index].key);
  // }

  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 0,
    sm: 0,
    md: 0,
  };

  return (
    <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
      <div>
      <Row>
        <Col {...responsiveDesignForColumn} style={{ marginTop: "-4px" }}>
          <Button type="link" onClick={onClose} style={Themes.contentWindow.recordWindow.RecordHeader.breadCrumb}>
            Pending Qc Task
          </Button>
        </Col>
      </Row>
      <Row>
          <Col span={18}>
            <div className="auditTrialText" style={{ marginTop: "-2%" }}>
            <span>{headerData.length > 0 ?headerData[0].product.name:null}</span>&nbsp;
            <span>{headerData.length > 0 ?headerData[0].batchNo:null}</span>&nbsp;
            <span>{headerData.length > 0 ?headerData[0].date:null}</span>&nbsp;
            <span>{headerData.length > 0 ?headerData[0].qualityWorkflowName:null}</span>&nbsp;
            </div>
          </Col>
          <Col span={6}>
            <span style={{ float: "right" }}>
              {displayShow === "none" ? (
               <span>
              <Button type="default" onClick={ProcessTask} htmlType="submit" style={{height:'30px',width:'auto',color:'rgb(113, 113, 114)',cursor:'pointer',border:'0.25px solid rgb(221, 219, 218)',borderRadius:'2px',fontWeight:'500',fontFamily:'Open Sans',opacity:'1',marginBottom:'6px'}}>
                Save
              </Button>
              &nbsp;
              <Button onClick={onCancel} style={{height:'30px',width:'auto',color:'rgb(113, 113, 114)',cursor:'pointer',border:'0.25px solid rgb(221, 219, 218)',borderRadius:'2px',fontWeight:'500',fontFamily:'Open Sans',opacity:'1',marginBottom:'6px'}}>
                Cancel
              </Button>
              </span>
            ) : (
              <span>
              <Button onClick={editFields} style={{height:'30px',width:'auto',color:'rgb(113, 113, 114)',cursor:'pointer',border:'0.25px solid rgb(221, 219, 218)',borderRadius:'2px',fontWeight:'500',fontFamily:'Open Sans',opacity:'1',marginBottom:'6px'}}>
                Edit
              </Button>
              &nbsp;
              <Button onClick={onClose} style={{height:'30px',width:'auto',color:'rgb(113, 113, 114)',cursor:'pointer',border:'0.25px solid rgb(221, 219, 218)',borderRadius:'2px',fontWeight:'500',fontFamily:'Open Sans',opacity:'1',marginBottom:'6px'}}>
                Close
              </Button>
              </span>
            )}
            </span>
          </Col>
        </Row>
        <Card style={{ marginBottom: "0px" }}>
          <Form layout="vertical"  form={headerform} /* onFinish={onFinish} */>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="businessUnit"
                  label="Business unit"
                  style={{ marginBottom: "8px" }}
                  rules={[
                    {
                      required: true,
                      message: "Please select business bunit!",
                    },
                  ]}
                >
                  <Select
                    disabled
                    allowClear
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onFocus={getBusinessUnit}
                    // onSelect={onSelectBusinessUnit}
                  >
                    {bunitData.map((data, index) => (
                      <Option key={data.csBunitId} value={data.csBunitId} title={data.bUnitName}>
                        {data.bUnitName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="product"
                  label="Product"
                  style={{ marginBottom: "8px" }}
                >
                   <Input disabled />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="batch" label="Batch" style={{ marginBottom: "8px" }}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="serviceEngg" label="Service Engineer" style={{ marginBottom: "8px" }}>
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Row>
            <Col span={24}>
                <Card style={{border:'none'}} bodyStyle={{paddingLeft:'0px',paddingTop:'0px',paddingRight:'0px'}} style={{height:'67vh',overflow:'scroll'}}>
                    <Form layout="horizontal" form={parametersform} /* onFinish={onFinish2} */>
                    {/* <Collapse accordion activeKey={1}> */}
                      {taskData.map((data)=>{
                        return (
                          <span>
                          <Card style={{borderBottom:'none',border:'none',backgroundColor:'#EDEDED'}} bodyStyle={{padding:'4px',paddingLeft:'0px'}}>
                            <span style={{fontSize:'13px',fontWeight:'500',cursor:'pointer',color:'#8E8E8E'}}>
                            {data.GroupName}
                            </span>
                          </Card>
                          <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA'}}>
                            <Row>
                              <Col span={6}>
                              <span style={{color:'#607D8B',fontSize:'14p',fontWeight:'600'}}>
                                  Parameter
                              </span>
                              </Col>
                              <Col span={6}>
                              <span style={{color:'#607D8B',fontSize:'14p',fontWeight:'600'}}>
                              |&nbsp;&nbsp;Result
                              </span>
                              </Col>
                              <Col span={6}>
                              <span style={{color:'#607D8B',fontSize:'14p',fontWeight:'600'}}>
                              |&nbsp;&nbsp;Remarks
                              </span>
                              </Col>
                            </Row>
                            </Card>
                            {data.ValueArray.map((element) => {
                              {
                                switch (element.type) {
                                  case "TX":
                                  return (
                                    <span>
                                      {displayShow === "block" ? (
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                          <Row>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                                {element.parameterName}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                            {element.value}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>   
                                            {element.remarks === null || element.remarks === "null" ? null :element.remarks}
                                            </span>                             
                                            </Col>
                                          </Row>
                                      </Card>
                                      ):(
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                          <Row>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                                {element.parameterName}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <Form.Item label="" name={element.cWQInspectionTaskLineId} initialValue={element.value}>
                                              <Input />
                                            </Form.Item>
                                            </Col>&nbsp;&nbsp;
                                            <Col span={6}>
                                            <Form.Item initialValue={element.remarks === null || element.remarks === "null" ? null :element.remarks} name={element.remarksId}>
                                              <Input  /> 
                                            </Form.Item>  
                                            <p />                             
                                            </Col>
                                          </Row>
                                      </Card>
                                      )}
                                    </span>
                                  );
                                  case "NM":
                                  return (
                                    <span>
                                      {displayShow === "block" ? (
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                        <Row>
                                          <Col span={6}>
                                          <span style={{color:'#19181A;',fontSize:'13px'}}>
                                              {element.parameterName}
                                          </span>
                                          </Col>
                                          <Col span={6}>
                                          <span style={{color:'#19181A;',fontSize:'13px'}}>
                                          {element.value}
                                          </span>
                                          </Col>
                                          <Col span={6}>
                                          <span style={{color:'#19181A;',fontSize:'13px'}}>
                                          {element.remarks === null || element.remarks === "null" ? null :element.remarks}
                                          </span>                                
                                          </Col>
                                        </Row>
                                    </Card>
                                      ):(
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                          <Row>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                                {element.parameterName}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <Form.Item label="" name={element.cWQInspectionTaskLineId} initialValue={element.value}>
                                            <InputNumber  style={{ width: "100%", marginBottom: "0px" }}/>
                                            </Form.Item>
                                            </Col>&nbsp;&nbsp;
                                            <Col span={6}>
                                            <Form.Item initialValue={element.remarks === null || element.remarks === "null" ? null :element.remarks} name={element.remarksId}>
                                              <Input  /> 
                                            </Form.Item>  
                                            <p />                                  
                                            </Col>
                                          </Row>
                                      </Card>
                                        )}
                                      </span>
                                    );
                                    case "IN":
                                  return (
                                    <span>
                                      {displayShow === "block" ? (
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                        <Row>
                                          <Col span={6}>
                                          <span style={{color:'#19181A;',fontSize:'13px'}}>
                                              {element.parameterName}
                                          </span>
                                          </Col>
                                          <Col span={6}>
                                          <span style={{color:'#19181A;',fontSize:'13px'}}>
                                          {element.value}
                                          </span>
                                          </Col>
                                          <Col span={6}>
                                          <span style={{color:'#19181A;',fontSize:'13px'}}>
                                          {element.remarks === null || element.remarks === "null" ? null :element.remarks}
                                          </span>                                    
                                          </Col>
                                        </Row>
                                    </Card>
                                      ):(
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                          <Row>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                                {element.parameterName}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <Form.Item label="" name={element.cWQInspectionTaskLineId} initialValue={element.value}>
                                            <InputNumber  style={{ width: "100%", marginBottom: "0px" }}/>
                                            </Form.Item>
                                            </Col>&nbsp;&nbsp;
                                            <Col span={6}>
                                            <Form.Item initialValue={element.remarks === null || element.remarks === "null" ? null :element.remarks} name={element.remarksId}>
                                              <Input  /> 
                                            </Form.Item>  
                                            <p />                                  
                                            </Col>
                                          </Row>
                                      </Card>
                                        )}
                                      </span>
                                    );
                                    case "LV":
                                  return (
                                    <span>
                                      {displayShow === "block" ? (
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                          <Row>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                                {element.parameterName}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                            {element.value}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                            {element.remarks === null || element.remarks === "null" ? null :element.remarks}
                                            </span>                                  
                                            </Col>
                                          </Row>
                                      </Card>
                                      ):(
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                          <Row>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                                {element.parameterName}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                           <Form.Item initialValue={element.value} label="" name={element.cWQInspectionTaskLineId}>
                                              <Select maxTagCount="responsive" showSearch style={{ width: "100%", marginBottom: "0px" }}>
                                                {element.newRefValues.map((option, index) => (
                                                  <Option key={`${index}-${element.cWQInspectionTaskLineId}`} value={option}>
                                                    {option}
                                                  </Option>
                                                ))} 
                                              </Select>
                                          </Form.Item>
                                            </Col>&nbsp;&nbsp;
                                            <Col span={6}>
                                            <Form.Item initialValue={element.remarks === null || element.remarks === "null" ? null :element.remarks} name={element.remarksId}>
                                              <Input  /> 
                                            </Form.Item>     
                                            <p />                         
                                            </Col>
                                          </Row>
                                        </Card>
                                        )}
                                  </span>
                                  );
                                  case "DT":
                                  return (
                                    <span>
                                      {displayShow === "block" ? (
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                          <Row>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                                {element.parameterName}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                            {element.value}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                            {element.remarks === null || element.remarks === "null" ? null :element.remarks}
                                            </span>                                 
                                            </Col>
                                          </Row>
                                        </Card>
                                      ):(
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                          <Row>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                                {element.parameterName}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                          <Form.Item initialValue={element? moment(element.value) : null}  label="" name={element.cWQInspectionTaskLineId}>
                                            <DatePicker  style={{width:'100%'}} format={"DD-MM-YYYY"} />
                                          </Form.Item>
                                            </Col>&nbsp;&nbsp;
                                            <Col span={6}>
                                            <Form.Item initialValue={element.remarks === null || element.remarks === "null" ? null :element.remarks} name={element.remarksId}>
                                              <Input  /> 
                                            </Form.Item>     
                                            <p />                              
                                            </Col>
                                          </Row>
                                        </Card>
                                      )}
                                    </span>
                                  );
                                  case "BO":
                                  return (
                                    <span>
                                      {displayShow === "block" ? (
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                          <Row>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                                {element.parameterName}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                            {element.value === "false" ? "N" : "N"}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                            {element.remarks === null || element.remarks === "null" ? null :element.remarks}
                                            </span>                                 
                                            </Col>
                                          </Row>
                                        </Card>
                                      ):(
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                          <Row>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                                {element.parameterName}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <Form.Item valuePropName="checked"  initialValue={element.value === "false" ? false:true} label="" name={element.cWQInspectionTaskLineId}>
                                              <Checkbox />
                                            </Form.Item>
                                            </Col>&nbsp;&nbsp;
                                            <Col span={6}>
                                            <Form.Item initialValue={element.remarks === null || element.remarks === "null" ? null :element.remarks} name={element.remarksId}>
                                              <Input  /> 
                                            </Form.Item> 
                                            <p />                            
                                            </Col>
                                          </Row>
                                        </Card>
                                      )}
                                    </span>
                                  );
                                  case "IM":
                                  return (
                                    <span>
                                      {displayShow === "block" ? (
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                          <Row>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                                {element.parameterName}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                              <Image src={element.value} style={{width:'60px',height:'60px'}} />
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                            {element.remarks === null || element.remarks === "null" ? null :element.remarks}
                                            </span>                                   
                                            </Col>
                                          </Row>
                                        </Card>
                                      ):(
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                          <Row>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                                {element.parameterName}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                             <Form.Item  label="" name={element.cWQInspectionTaskLineId}>
                                              <Upload
                                                  action="https://sapp.mycw.in/image-manager/uploadImage"
                                                  listType="picture"
                                                  headers={{ APIKey: "AUa4koVlpsgR7PZwPVhRdTfUvYsWcjkg" }}
                                                  name="image"
                                                  onChange={imageUploadStatusChange}
                                                  maxCount={1}
                                                >
                                                  <Button size="small" icon={<UploadOutlined />}>Upload</Button>
                                                </Upload>
                                              </Form.Item>
                                            </Col>&nbsp;&nbsp;
                                            <Col span={6}>
                                            <Form.Item initialValue={element.remarks === null || element.remarks === "null" ? null :element.remarks} name={element.remarksId}>
                                              <Input  /> 
                                            </Form.Item>
                                            <p />                               
                                            </Col>
                                          </Row>
                                        </Card>
                                      )}
                                    </span>
                                  );
                                  case "RB":
                                  return (
                                    <span>
                                      {displayShow === "block" ? (
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                          <Row>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                                {element.parameterName}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                              {element.newRefValues.length > 0 ?element.newRefValues[0]:null}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                              {element.remarks === null || element.remarks === "null" ? null :element.remarks}
                                            </span>                                   
                                            </Col>
                                          </Row>
                                        </Card>
                                      ):(
                                        <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                          <Row>
                                            <Col span={6}>
                                            <span style={{color:'#19181A;',fontSize:'13px'}}>
                                                {element.parameterName}
                                            </span>
                                            </Col>
                                            <Col span={6}>
                                             <Form.Item initialValue={element.newRefValues.length > 0 ?element.newRefValues[0]:null} label={element.parameterName} name={element.cWQInspectionTaskLineId}>
                                              <Radio.Group value={element.newRefValues.length > 0 ?element.newRefValues[0]:null}>
                                              {element.newRefValues.length > 0 ?(
                                                    element.newRefValues.map((data)=>{
                                                      return (
                                                        <Radio value={data}>{data}</Radio>
                                                      )
                                                    })
                                                ):null}
                                                </Radio.Group>
                                              </Form.Item>
                                            </Col>&nbsp;&nbsp;
                                            <Col span={6}>
                                            <Form.Item initialValue={element.remarks === null || element.remarks === "null" ? null :element.remarks} name={element.remarksId}>
                                              <Input  /> 
                                            </Form.Item>     
                                            <p />                            
                                            </Col>
                                          </Row>
                                        </Card>
                                      )}
                                    </span>
                                  );
                            }
                          }
                          })}
                          </span>
                          
                        )
                      })}
                    {/* </Collapse> */}
                    </Form> 
                </Card>
            </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default DetailsView;
