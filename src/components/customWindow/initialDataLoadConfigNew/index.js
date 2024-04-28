import React, { useState, useEffect } from "react";
import { Card, Tabs, Row, Col, Form, Select, Button, message,Checkbox,Table, Spin,Input,Space,Modal } from "antd";
import { LoadingOutlined ,EditOutlined,DeleteOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";
import { useGlobalContext } from "../../../lib/storage";
import Axios from "axios";
import ThemeJson from "../../../constants/UIServer.json"
// import { serverUrl } from "../../../constants/serverConfig";
import "antd/dist/antd.css";
import "../../../styles/antd.css";
import { window } from "d3";
import { generateToken } from "../../../services/generateToken";

const { TabPane } = Tabs;
const { Option } = Select;

const DataLoadNewConfig = () => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  // End products tab
  const serverUrl = process.env.REACT_APP_serverUrl;
  const [loading, setLoading] = useState(false);
  const [visible,setVisible] = useState(false)
  const [mainTabData,setMainTabData] = useState([])
  const [openAddToFieldsModal,setOpenAddToFieldsModal] = useState(false)
  const [openAddToFieldsModalForEdit,setOpenAddToFieldsModalForEdit] = useState(false)
  const [activeTabId,setActiveTabId] = useState(null)
  const [filedIdToEdit,setFieldIdToEdit] = useState(null)
  const [mainForm] = Form.useForm();
  const [addTabForm] = Form.useForm();
  const [addFieldsForm] = Form.useForm();
  const [updateFieldsForm] = Form.useForm();

  useEffect(() => {
    getAppSetupData();
  }, [])

  const getAppSetupData = async () => {
    try {
      setLoading(true);
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const getAppSetupMutation = {
        query: `query{
          getDataLoadConfig(name:null)
          {
              dataLoadConfigId
              name
              serviceName
              configJson
          }
          }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      };

      const serverResponse = await Axios.post(serverUrl, getAppSetupMutation, { headers: headers }, { async: true }, { crossDomain: true });
      const appSetupResponse = serverResponse.data.data.getDataLoadConfig;  
      if (appSetupResponse.length > 0) {
        const finalArray =[]
        
        for (let index = 0; index < appSetupResponse.length; index++) {
        const tempArry = []
        const newArry = JSON.parse(appSetupResponse[index].configJson)
        newArry.map((item)=>{
          item.key= appSetupResponse[index].dataLoadConfigId
          tempArry.push(item)
        })
          const obj ={
            tabName:appSetupResponse[index].name, 
            tabKey: appSetupResponse[index].dataLoadConfigId, 
            serviceName:appSetupResponse[index].serviceName,
            colsData:tempArry,
          }
          finalArray.push(obj)
        }
        setActiveTabId(finalArray[0].tabKey)
        setMainTabData(finalArray)
        // const appSetupRecord = appSetupResponse[0];
        // const { configJson } = appSetupRecord;
        // const poParsedConfigJSON = JSON.parse(configJson);
        // setProductValues(poParsedConfigJSON)
        setLoading(false);
      } else {
        message.error("No Data Available");
        setLoading(false);
      }
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  }

  const saveData = () => {
    // mainForm.submit(); 
    const newToken = JSON.parse(localStorage.getItem("authTokens"));  
    setLoading(true)
    const newMutationArrayToPush= []
    for (let index = 0; index < mainTabData.length; index++) {
      newMutationArrayToPush.push(
        `{
          dataLoadConfigId:"${mainTabData[index].tabKey}",
          name:"${mainTabData[index].tabName}",
          serviceName:"${mainTabData[index].serviceName}"
          configJson:${JSON.stringify(JSON.stringify(mainTabData[index].colsData))},
        }`
      )
    }
    const appSetupMutation = {
      query: `mutation {
          upsertDataLoadConfig(dataLoad: { 
              dataLoadConfigs:[${newMutationArrayToPush}]
        }) {
          status
          message
      }
    }`,
    };
    Axios({
      url: serverUrl,
      method: "POST",
      data: appSetupMutation,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      },
    }).then((response) => {
      const appSetupResponse = response.data.data.upsertDataLoadConfig;
      if (appSetupResponse.status === "200") {          
        message.success(appSetupResponse.message);
        setLoading(false);
      } else {
        message.error(appSetupResponse.message);
        setLoading(false);
      }
    });
    
  };

  const onFinish = async () => { 
  
  };

  const addTabsModalVisible = () =>{
      setVisible(true)
  }

  const handleCancel = () =>{
    setVisible(false)
  }

  
  const handleOk = () =>{
    addTabForm.validateFields().then(values => {
        const tabName = values.tabName
        const uniqId = uuid()
          .replace(/-/g, "")
          .toUpperCase();
          const newObj = {
              tabName:tabName,
              serviceName:values.serviceName,
              tabKey :uniqId,
              colsData:[]
          }
          setActiveTabId(uniqId)
          setMainTabData([...mainTabData,newObj])
          addTabForm.resetFields()
          setVisible(false)
        // Do something with value
      });
    // setVisible(false)
  }

  const addFieldsToTabs = (tabId) =>{
    setActiveTabId(tabId)
    setOpenAddToFieldsModal(true)
  }

  const AddToFieldshandleOk = () =>{
    addFieldsForm.validateFields().then(values => {
        const uniqId = uuid()
          .replace(/-/g, "")
          .toUpperCase();
        const newObj = {
          fieldName:values.fieldReference,
          columnName:values.fieldName,
          enabledField:values.isEnable === true ? "Y" :"N",
          isMandatory:values.isMandetory === true ? "Y" :"N", 
          fieldId :uniqId
        }
          let newRefreshArray = []
          for (let index = 0; index < mainTabData.length; index++) {
            const eleTabKey = mainTabData[index].tabKey;
            const cols = mainTabData[index].colsData
            if(eleTabKey === activeTabId){
              cols.push(newObj)
            } 
            newRefreshArray.push(mainTabData[index])           
          }
          addFieldsForm.resetFields()
          setOpenAddToFieldsModal(false)
          setMainTabData([])
          setMainTabData(newRefreshArray)
    })
  }

 const AddToFieldshandleOkForEdit = () =>{
   updateFieldsForm.validateFields().then(values => {
     const fieldName = values.fieldReference1
     const columnName = values.fieldName1
     const enabledField = values.isEnable1 === true ? "Y" :"N"
     const isMandatory = values.isMandetory1 === true ? "Y" :"N"
      let newRefreshArray1 = []
      for (let index = 0; index < mainTabData.length; index++) {
        const eleTabKey = mainTabData[index].tabKey;
        const cols = mainTabData[index].colsData
        if(eleTabKey === activeTabId){
          // cols.push(newObj)
          for (let index2 = 0; index2 < cols.length; index2++) {
            const colsFieldId = cols[index2].fieldId;
            if(colsFieldId === filedIdToEdit){
              cols[index2].fieldName = fieldName
              cols[index2].columnName = columnName
              cols[index2].enabledField = enabledField
              cols[index2].isMandatory = isMandatory

            }
          }
        } 
        newRefreshArray1.push(mainTabData[index])           
      }
      updateFieldsForm.resetFields()
      setOpenAddToFieldsModalForEdit(false)
      setFieldIdToEdit(null)
      setMainTabData([])
      setMainTabData(newRefreshArray1)
   })
 }
 const AddToFieldshandleCancelForEdit = () =>{
  setOpenAddToFieldsModalForEdit(false)
 }

  const selectedFields = (text,operation) =>{
    if(operation === "edit"){
      setOpenAddToFieldsModalForEdit(true)
      updateFieldsForm.setFieldsValue({
        fieldName1:text.columnName,
        fieldReference1:text.fieldName,
        isEnable1:text.enabledField === "Y" ? true :false,
        isMandetory1:text.isMandatory === "Y" ? true :false,
      })
      setFieldIdToEdit(text.fieldId)
    }else{
    let newArry = []
    mainTabData.forEach((item)=>{
      let arry = []
      if(item.tabKey === text.key){
        item.colsData.map((ele)=>{
          if(ele.fieldId !==text.fieldId){
            arry.push(ele)
          }
        })
        item.colsData = arry
      }
      newArry.push(item)
      })
      setMainTabData([])
      setMainTabData(newArry)
    }    
  }

  const AddToFieldshandleCancel = () =>{
    setOpenAddToFieldsModal(false)
  }

  const onChangeTabs = (key) =>{
    setActiveTabId(key)
  }

  const columns = [
    {
      title: 'Display Name',
      dataIndex: 'columnName',
    },
    {
      title: 'DB Column Name',
      dataIndex: 'fieldName',
    },
    {
      title: 'Enabled',
      dataIndex: 'enabledField',
    },
    {
      title: 'Mandatory',
      dataIndex: 'isMandatory',
    },
    {
      title: '',
      dataIndex: '',
      width: 80,
      render: (text,data) => <>
      <span
      style={{cursor:'pointer'}}
      role="presentation"
      onClick={() => {
        selectedFields(text,"edit")
      }}
    >
      <EditOutlined />
    </span>
    <span
      style={{cursor:'pointer',marginLeft:'10px'}}
      role="presentation"
      onClick={() => {
        selectedFields(text,"delete")
      }}
    >
      <DeleteOutlined />
    </span>
      </>

    }
  ];
  
  return (
    <Spin indicator={<LoadingOutlined style={{ fontSize: "52px" }} spin />} spinning={loading}>
      <div>
        <Row>
          <Col span={12}>
            <h2>Data Load Configuration</h2>
          </Col>
          <Col span={10} />
          <Col span={2}>
            <Button style={Themes.contentWindow.ListWindowHeader.newButtonForlist} type="primary" onClick={saveData}>
              Save
            </Button>
            &nbsp;
          </Col>
         
        </Row>
        <Row>
          <Col span={24}>
            <Form layout="vertical" form={mainForm} name="control-hooks" /* onValuesChange={getAllFormValues} */ onFinish={onFinish} /* onFinishFailed={onFinishFailed} */>
              <Card>
                <Tabs defaultActiveKey ={activeTabId} activeKey ={activeTabId} onChange={onChangeTabs} tabBarExtraContent={<Button onClick={addTabsModalVisible} size ="small">Add</Button>} /* onChange={callBackTabs} */>
                  {mainTabData.map((data)=>(
                      <TabPane tab={data.tabName} key={data.tabKey}>
                       <Row>
                           <Col span={24} style={{textAlign:'right'}}>
                                <Button onClick={()=>addFieldsToTabs(data.tabKey)} size="small">Add Fields</Button>
                           </Col>
                       </Row>
                      <div>
                      <Table
                        columns={columns}
                        dataSource={data.colsData}
                        size="small"
                        scroll={{ y: "62.5vh", x: "100%"}}
                        pagination={false}
                        // onRow={selectRow}
                      />
                      </div>
                     </TabPane>
                  ))}
                </Tabs>
              </Card>
            </Form>
          </Col>
        </Row>
      </div>
      <Modal title="Add Tabs" visible={visible} onOk={handleOk} onCancel={handleCancel}>
      <Card style={{padding:'0px',border:'none'}} bodyStyle={{padding:'0px'}}>
        <Form layout="vertical" form={addTabForm} name="addTab_hooks">
             <Row>
                 <Col className="gutter-row" span={24}>
                    <Form.Item label="Name" name="tabName" rules={[
                            {
                                required: true,
                                message: 'Please input tab name!',
                            },
                            ]}>
                        <Input />
                    </Form.Item>
                 </Col>
             </Row>
             <br />
             <Row>
                 <Col className="gutter-row" span={24}>
                    <Form.Item label="Service Name" name="serviceName" rules={[
                            {
                                required: true,
                                message: 'Please input service name!',
                            },
                            ]}>
                        <Input />
                    </Form.Item>
                 </Col>
             </Row>
             <br />
        </Form>
      </Card>
      </Modal>
      <Modal title="Add Fields" visible={openAddToFieldsModal} onOk={AddToFieldshandleOk} onCancel={AddToFieldshandleCancel}>
      <Card style={{padding:'0px',border:'none'}} bodyStyle={{padding:'0px'}}>
        <Form layout="vertical" form={addFieldsForm} name="addFields_hooks">
             <Row gutter={16}>
                 <Col className="gutter-row" span={12}>
                    <Form.Item label="Field Name" name="fieldName" rules={[
                            {
                                required: true,
                                message: 'Please input field name!',
                            },
                            ]}>
                        <Input />
                    </Form.Item>
                 </Col>
                 <Col className="gutter-row" span={12}>
                    <Form.Item label="Field Reference" name="fieldReference" rules={[
                            {
                                required: true,
                                message: 'Please give input in Field Reference',
                            },
                            ]}>
                        <Input />
                    </Form.Item>
                 </Col>
                 </Row>
                 <br />
                 <Row gutter={16}>
                 <Col className="gutter-row" span={12}>
                    <Form.Item label="Enable" name="isEnable" valuePropName="checked">
                        <Checkbox />
                    </Form.Item>
                 </Col>
                 <Col className="gutter-row" span={12}>
                 <Form.Item label="Mandatory" name="isMandetory" valuePropName="checked">
                        <Checkbox />
                    </Form.Item>
                 </Col>
                 </Row>
             <br />
        </Form>
      </Card>
      </Modal>
      <Modal title="Update Fields" visible={openAddToFieldsModalForEdit} onOk={AddToFieldshandleOkForEdit} onCancel={AddToFieldshandleCancelForEdit}>
      <Card style={{padding:'0px',border:'none'}} bodyStyle={{padding:'0px'}}>
        <Form layout="vertical" form={updateFieldsForm} name="updateFields_hooks">
             <Row gutter={16}>
                 <Col className="gutter-row" span={12}>
                    <Form.Item label="Field Name" name="fieldName1" rules={[
                            {
                                required: true,
                                message: 'Please input field name!',
                            },
                            ]}>
                        <Input />
                    </Form.Item>
                 </Col>
                 <Col className="gutter-row" span={12}>
                    <Form.Item label="Field Reference" name="fieldReference1" rules={[
                            {
                                required: true,
                                message: 'Please give input in Field Reference',
                            },
                            ]}>
                        <Input />
                    </Form.Item>
                 </Col>
                 </Row>
                 <br />
                 <Row gutter={16}>
                 <Col className="gutter-row" span={12}>
                    <Form.Item label="Enable" name="isEnable1" valuePropName="checked">
                        <Checkbox />
                    </Form.Item>
                 </Col>
                 <Col className="gutter-row" span={12}>
                 <Form.Item label="Mandatory" name="isMandetory1" valuePropName="checked">
                        <Checkbox />
                    </Form.Item>
                 </Col>
                 </Row>
             <br />
        </Form>
      </Card>
      </Modal>
    </Spin>
  );
};

export default DataLoadNewConfig;