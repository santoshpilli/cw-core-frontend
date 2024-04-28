import React, { useEffect, useState } from "react";
import { Card, Menu, Dropdown,Collapse, Form, Row,Upload, Col,Radio, Select,Checkbox, Button,Input, InputNumber, Spin,DatePicker, message, Table, Image,Popover } from "antd";
import { getQualityReviewTask,getconfirmQualityTask,getconfirmQualityReviewTask } from "../../../services/custom";
import { LoadingOutlined,UploadOutlined,DownOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";
import { useParams,useHistory } from "react-router-dom";
import { useGlobalContext } from "../../../lib/storage";
import dayjs from "dayjs";
import ThemeJson from "../../../constants/UIServer.json"
import "./style.css"

import moment from "moment";
const { Panel } = Collapse;
const { Option } = Select;

const QcDetailsView = () => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const history = useHistory();
  const [bunitData, setBunitData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled,setDisabled] = useState(false)
  const [taskData,setTaskData] = useState([])
  const [headerData,setHeaderData] = useState([])
  const [headerform] = Form.useForm();
  const [parametersform] = Form.useForm();
  const {recordId} = useParams()
  const [displayShow, setdisplayShow] = useState("none");
  const [lineData,setLineData] = useState([])
  const [qualityReviewResponse,setQualityReviewResponse] = useState([])

  
  useEffect(() => {
    getData()
    
  }, []);

  const getData = async () =>{
    setLoading(true)
    const qualityReviewResponse = await getQualityReviewTask(recordId)
    setQualityReviewResponse(qualityReviewResponse)
    headerform.setFieldsValue({
      'businessUnit':qualityReviewResponse[0].bUnit.name,
      'product':qualityReviewResponse[0].product.name,
      'batch':qualityReviewResponse[0].batchNo,
    })

    let tempGroupNameArray = []
    let allTaskLineArry = []
    let parameterArrayNames = []
    for (let index = 0; index < qualityReviewResponse.length; index++) {
      const element = qualityReviewResponse[index].cWQInspectionTaskLine;
      const enggName = qualityReviewResponse[index].cwqQualityEngineerName
      for (let index = 0; index < element.length; index++) {
        const element12 = element[index].parameterGroupName;
        element[index].enggName = enggName
        tempGroupNameArray.push(element12)
        allTaskLineArry.push(element[index])
        parameterArrayNames.push(element[index].parameterName)
      }
    }

    for (let index = 0; index < allTaskLineArry.length; index++) {
      const refElement = allTaskLineArry[index].refValues;
      if(refElement === null){
        allTaskLineArry[index].newRefValues = []
      }else{
        allTaskLineArry[index].newRefValues = allTaskLineArry[index].refValues. split(',')
      }
    }

    let uniqueChars = [...new Set(tempGroupNameArray)];
    let uniqueParameterNames = [...new Set(parameterArrayNames)];

    const newArrayToSortGroupWise = []
    for (let index = 0; index < uniqueChars.length; index++) {
      const element = uniqueChars[index];
      let neArry =[]
      const uniqId = uuid()
      .replace(/-/g, "")
      .toUpperCase();
      for (let index2 = 0; index2 < allTaskLineArry.length; index2++) {
        const grpName = allTaskLineArry[index2].parameterGroupName;
            if(element === grpName) {
              neArry.push(allTaskLineArry[index2])            
            } 
      }
      newArrayToSortGroupWise.push({'GroupName':element,'ValueArray':neArry,'key':uniqId})
    }

    let ArrayWithParameterName = []
    for (let index = 0; index < uniqueParameterNames.length; index++) {
      const paraName = uniqueParameterNames[index];
      let newArrr = []
      for (let index = 0; index < allTaskLineArry.length; index++) {
        const element = allTaskLineArry[index].parameterName;
        if(paraName === element){
          newArrr.push(allTaskLineArry[index])
        }
      }
      const obj = {
        paraName : paraName,
        valArray:newArrr
      }
      ArrayWithParameterName.push(obj)
    } 

    for (let index = 0; index < newArrayToSortGroupWise.length; index++) {
      const element = newArrayToSortGroupWise[index].ValueArray;
      let neWRRR = []
      for (let index = 0; index < element.length; index++) {
        const eleParanames = element[index].parameterName;
        neWRRR.push(eleParanames)
      }
      const uniqueCharsData = [...new Set(neWRRR)];
      newArrayToSortGroupWise[index].uniqueParaNames = uniqueCharsData
    }

    for (let index2 = 0; index2 < newArrayToSortGroupWise.length; index2++) {
      const uniqueParamsele = newArrayToSortGroupWise[index2].uniqueParaNames;
      const valueArrayele = newArrayToSortGroupWise[index2].ValueArray;
      let newArray117 = []
      for (let index = 0; index < uniqueParamsele.length; index++) {
        const elementuniqueParamsele = uniqueParamsele[index];
        let newArray116 = []
        let valueForComapre = []
        for (let index = 0; index < valueArrayele.length; index++) {
          const element = valueArrayele[index].parameterName;
          if(elementuniqueParamsele === element){
            newArray116.push(valueArrayele[index])
            valueForComapre.push(valueArrayele[index].value)
          }
        }
        const valComp = [...new Set(valueForComapre)] 
        const newValComp = valComp.length > 1 ? null : valComp[0]
        const uniqId = uuid()
          .replace(/-/g, "")
          .toUpperCase();
        let obj12 = {
          parameterName :elementuniqueParamsele,
          valArray1:newArray116,
          cWQInspectionRuleId :newArray116[0].cWQInspectionRuleId,
          type:newArray116[0].type,
          valueForComapre: newValComp,
          uniqueId :uniqId
        }
        newArray117.push(obj12)
      }
      newArrayToSortGroupWise[index2].finalSortedData = newArray117      
    }
        
    setTaskData(newArrayToSortGroupWise)
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
    history.push(`/others/window/7478`);
  }


  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 0,
    sm: 0,
    md: 0,
  };

  const getApproval = () =>{
    const dyanamicFieldsValues = parametersform.getFieldsValue(true)
    const dyanamicArray = []
    for (const [key, value] of Object.entries(dyanamicFieldsValues)) {
      const obj = {
        Key:key,
        value:value
      }
      dyanamicArray.push(obj)
    }

    let consolidateDataArray = []
    for (let index = 0; index < taskData.length; index++) {
      const element = taskData[index].finalSortedData;
      for (let index2 = 0; index2 < element.length; index2++) {
        consolidateDataArray.push(element[index2])  
      }      
    }

    for (let index = 0; index < consolidateDataArray.length; index++) {
      const element = consolidateDataArray[index];
      const newId = element.uniqueId
      for (let index2 = 0; index2 < dyanamicArray.length; index2++) {
        const dyanamicArryKey = dyanamicArray[index2].Key;
        if(newId === dyanamicArryKey){
          consolidateDataArray[index].newFormValues = dyanamicArray[index2].value
        }
      }
    }
    processQcReviewData(qualityReviewResponse,consolidateDataArray)
  }

  const processQcReviewData = async(qualityReviewResponse,consolidateDataArray) =>{
    setLoading(true)
    const userData = JSON.parse(window.localStorage.getItem("userData"));
    const response = await getconfirmQualityReviewTask(qualityReviewResponse,consolidateDataArray,userData.user_id)
    if(response.status === "200"){
      message.success(response.message)
      setLoading(false)
      setDisabled(true)
    }else{
      message.error(response.message)
      setLoading(false)
      // setDisabled(true)
    }
  }

  const processButtons = (
    
    <Menu disabled={disabled}>
      {disabled===true?'':
        <span>
        <Menu.Item key="1" onClick = {getApproval} >
          Approve
        </Menu.Item>
        <Menu.Item key="2">
          Reject
      </Menu.Item>
      </span>}
    </Menu>
  )


  const handleFormSubmit = (values) =>{
  }

  return (
    <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
      <div>
      <Row>
        <Col {...responsiveDesignForColumn} style={{ marginTop: "-4px" }}>
          <Button type="link" onClick={onClose} style={Themes.contentWindow.recordWindow.RecordHeader.breadCrumb}>
            QC Review
          </Button>
        </Col>
        <Col {...responsiveDesignForColumn} style={{ marginTop: "-4px" }}>
        <span style={{ float: "right" }}>
            {/* <Button htmlType="submit">Sub</Button> */}
            <Dropdown overlay={processButtons}>
                <Button style={{backgroundColor:'rgb(8, 158, 164)',color:'white',width:'93px',height:'33px'}}>
                  Actions <DownOutlined />
                </Button>
            </Dropdown>
            </span>
        </Col>
      </Row>
        <p style={{marginBottom:'8px'}}/>
        <Card style={{ marginBottom: "0px" }}>
          <Form layout="vertical"  form={headerform}>
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
              {/* <Col className="gutter-row" span={6}>
                <Form.Item name="serviceEngg" label="Service Engineer" style={{ marginBottom: "8px" }}>
                  <Input disabled />
                </Form.Item>
              </Col> */}
            </Row>
          </Form>
        </Card>
        <Row>
            <Col span={24}>
                <Card style={{border:'none'}} bodyStyle={{paddingLeft:'0px',paddingTop:'0px',paddingRight:'0px'}} style={{height:'67vh',overflow:'scroll'}}>
                    {/* <Form layout="horizontal" form={parametersform}> */}
                    <Row>
                      <Col span={6} />
                      <Col span={18}>
                      {qualityReviewResponse.map((data3)=>{
                                return (
                                    <span>
                                    <div style={{color:'#607D8B',fontSize:'13px',fontWeight:'600',textAlign:'center',marginRight:'6px',display:'inline-block',width:'150px'}}>
                                      {data3.cwqQualityEngineerName}
                                    </div>
                                    <div style={{color:'#607D8B',fontSize:'13px',fontWeight:'600',textAlign:'center',marginRight:'6px',display:'inline-block',width:'150px'}}>
                                      Remarks
                                    </div>
                                    </span>
                                )
                              })}
                              <div style={{color:'#607D8B',fontSize:'13px',fontWeight:'600',textAlign:'center',marginRight:'6px',display:'inline-block',width:'150px'}}>
                                      Approver Value
                              </div>
                      </Col>
                      </Row>
                      <Form layout="horizontal" form={parametersform} name="control-hooks11" onFinish={(values) => handleFormSubmit(values)}>
                        {/* <Button htmlType="submit">submit</Button> */}
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
                                <span style={{color:'#607D8B',fontSize:'13px',fontWeight:'600'}}>
                                    Parameter
                                </span>
                                </Col>
                              </Row>
                              </Card>
                              {data.finalSortedData.map((element) => {
                                return (
                                <Card bodyStyle={{paddingTop:'4px',paddingBottom:'4px'}} style={{border:'0.5px solid #DDDBDA',borderTop:'none'}}>
                                    <Row>
                                      <Col span={6}>
                                      <span style={{color:'#19181A;',fontSize:'13px'}}>
                                          {element.parameterName}
                                      </span>
                                      </Col>
                                      <Col span={18} style={{alignItems:'center',display:'flex'}}>
                                        {element.valArray1.map((data2)=>{
                                          return (
                                            data2.type === "IM" ?
                                            <span>
                                              <div style={{textAlign:'center',marginRight:'6px',display:'inline-block',width:'150px',overflow: 'hidden'}}>
                                                <Image src={data2.value} style={{width:'60px',height:'60px'}} />
                                              </div>
                                              <div style={{color:'#19181A',textAlign:'center',marginRight:'6px',fontSize:'13px',backgroundColor:'#E8E8E8',display:'inline-block',width:'150px',overflow: 'hidden'}}>
                                                <Input style={{height:'24px',backgroundColor:'#e8e8e8'}} size="small" value={data2.remarks === "null" || data2.remarks === null ? null : data2.remarks} />
                                              </div>
                                            </span>
                                            :
                                          <span>
                                          <div style={{height:'24px',color:'#19181A',textAlign:'center',marginRight:'6px',fontSize:'13px',backgroundColor:'#E8E8E8',display:'inline-block',width:'150px',overflow: 'hidden'}}>
                                            {data2.value}
                                          </div>
                                          <div style={{height:'24px',color:'#19181A',textAlign:'center',marginRight:'6px',fontSize:'13px',backgroundColor:'#E8E8E8',display:'inline-block',width:'150px',overflow: 'hidden'}}>
                                            <Input style={{height:'24px',backgroundColor:'#e8e8e8'}} size="small" value={data2.remarks === "null" || data2.remarks === null ? null : data2.remarks} />
                                          </div>
                                          </span>
                                          )
                                        })}
                                          <div style={{display:'inline-block',width:'150px',textAlign:'center'}}>
                                            {/* {renderSwitch(element)}*/}
                                            {element.valArray1[0].type === "LV" ?
                                            <span>
                                              <Form.Item initialValue ={element.valueForComapre} name={element.uniqueId}>
                                                <Select size="small" defaultValue={element.valueForComapre} maxTagCount="responsive" showSearch style={{ width: "100%", marginBottom: "0px" }}>
                                                    {element.valArray1[0].newRefValues.map((option, index) => (
                                                      <Option key={option} value={option}>
                                                        {option}
                                                      </Option>
                                                    ))} 
                                                  </Select>
                                              </Form.Item>
                                              <p />
                                              </span>
                                            :element.valArray1[0].type === "IN" ?
                                            <span>
                                              <Form.Item label="" initialValue={element.valueForComapre} name={element.uniqueId}>
                                                <InputNumber size="small" defaultValue = {element.valueForComapre} style={{ width: "100%", marginBottom: "0px" }}/>
                                              </Form.Item>
                                              <p />      
                                            </span>
                                            :element.valArray1[0].type === "RB" ?
                                            <span>
                                              <Form.Item name={element.uniqueId} initialValue={element.valueForComapre} >
                                                <Radio.Group value={element.valueForComapre}>
                                                  {element.valArray1[0].newRefValues.length > 0 ?(
                                                        element.valArray1[0].newRefValues.map((data)=>{
                                                          return (
                                                            <Radio value={data}>{data}</Radio>
                                                          )
                                                        })
                                                    ):null}
                                                  </Radio.Group>
                                              </Form.Item>
                                            </span>
                                            :element.valArray1[0].type === "IM" ?
                                            <span>
                                              <Form.Item name={element.uniqueId} >
                                                <Upload
                                                    action="https://sapp.mycw.in/image-manager/uploadImage"
                                                    listType="picture"
                                                    headers={{ APIKey: "AUa4koVlpsgR7PZwPVhRdTfUvYsWcjkg" }}
                                                    name="image"
                                                    // onChange={imageUploadStatusChange}
                                                    maxCount={1}
                                                  >
                                                    <Button size="small" icon={<UploadOutlined />}>Upload</Button>
                                                  </Upload>
                                                </Form.Item>
                                            </span>
                                            :element.valArray1[0].type === "BO" ?
                                            <span>
                                              <Form.Item valuePropName="checked"  initialValue={element.valueForComapre === "true" || element.valueForComapre === true ? true :false } label="" name={element.uniqueId}>
                                                 <Checkbox />
                                              </Form.Item>
                                            </span>
                                            :element.valArray1[0].type === "DT" ?
                                            <span>
                                              <Form.Item  initialValue = {moment(element.valueForComapre)} name={element.uniqueId}>
                                                  <DatePicker size="small" style={{width:'100%'}} format={"YYYY-MM-DD"} />
                                              </Form.Item>
                                              <p />
                                            </span>
                                            :element.valArray1[0].type === "NM" ?
                                            <span>
                                              <Form.Item label="" initialValue={element.valueForComapre} name={element.uniqueId}>
                                                  <InputNumber size="small" defaultValue = {element.valueForComapre} style={{ width: "100%", marginBottom: "0px" }}/>
                                              </Form.Item>
                                              <p />
                                            </span>
                                            :element.valArray1[0].type === "TX" ?
                                            <span>
                                              <Form.Item label="" name={element.uniqueId} initialValue={element.valueForComapre}>
                                                <Input style={{height:'24px'}} size="small" />
                                              </Form.Item>
                                              <p />      
                                            </span>
                                            :null}
                                          </div>
                                      </Col>
                                    </Row>
                                </Card>
                                )
                              })}
                            </span>
                            
                          )
                        })}
                      </Form>
                    {/* </Collapse> */}
                </Card>
            </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default QcDetailsView;
