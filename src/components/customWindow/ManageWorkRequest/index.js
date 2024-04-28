import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col, Select, Button, Modal, Spin, Table, Image, Input, DatePicker, Radio, Space, Tabs,Popover, message, InputNumber,Menu,Load } from "antd";
import { LoadingOutlined, PlusCircleOutlined, PrinterOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";
import AuditTrail from "../../../assets/images/auditTrail.svg";
import Arrow from "../../../assets/images/arrow.svg";
// import {getSupplierProduct } from "../../../services/custom";
import { getManageWorkRequest,getSupplierData,getCustomerDetails} from "../../../services/generic";
import moment from "moment";
// import { serverUrl, genericUrl } from "../../../constants/serverConfig";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import ListData from "../NewWorkOrer/listData";
import { Collapse } from 'antd';
import "antd/dist/antd.css";
import "../../../styles/antd.css";
import Filter from "../../../assets/images/filter.svg";
// import { useHistory } from "react-router";
import { Scrollbars } from "react-custom-scrollbars";
import { useParams } from "react-router-dom";


const { Option } = Select;
const { TabPane } = Tabs;
const dateFormat = "YYYY-MM-DD";
const { Panel } = Collapse;

const ManageWorkRequest = () => {

  const [loading, setLoading] = useState(false);
  const [isModalVisible,setIsModalVisible] = useState(false)
  const [statusKey,setStatusKey] = useState('')
  const [dataSource,setDataSource] = useState([])
  const [selectedData,setSelectedData] = useState([])
  const [supplierData,setSupplierData] = useState([])
  const [customerData,setCustomerData] = useState([])
  const [supplierId,setSupplierId] = useState('')
  const [customerId,setCustomerId] = useState('')
  const [modal,setModal] = useState(false)

  const serverUrl = process.env.REACT_APP_serverUrl;
  const genericUrl = process.env.REACT_APP_genericUrl;
const [headerform] = Form.useForm();
const [modalForm] = Form.useForm();
const { recordId } = useParams();


const columns = [
    {
      title: "Product",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.name;
      },
    },
    {
      title: "Qty",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.qty
    },
    },
    {
      title: "Description",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.description;
      },
    },
    {
      title: "Order",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.documentno;
      },
    },
    {
      title: "Customer",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.cname;
      },
    },
    // {
    //   title: "Product",
    //   dataIndex: "value",
    //   width: 220,
    //   ellipsis:true,
    //   render: (text, record) => {
    //     return record.requisitionLines.product.name;
    //   },
    // },
    // {
    //   title: "Order Qty",
    //   dataIndex: "value",
    //   width: 100,
    //   render: (text, record) => {
    //     return record.requisitionLines.sOrderQty !== null ? record.requisitionLines.sOrderQty : 0;
    //   },
    // },
    // {
    //   title: "Order Fulfilled",
    //   dataIndex: "orderFulfilledQty",
    //   width: 100,
    //   render: (text, record) => {
    //     return record.requisitionLines.orderFulfilledQty;
    //   },
    // },
    // {
    //   title: "Stock Allocated",
    //   dataIndex: "stockAllocatedQty",
    //   width: 100,
    //   render: (text, record) => {
    //     return record.requisitionLines.stockAllocatedQty === null ? 0 : record.requisitionLines.stockAllocatedQty;
    //   },
    // },
    
  ];

  const onSelectProductData = (e, data) => {
    setSelectedData(data)
  };
  const rowSelectionForProducts = {
    onChange: onSelectProductData,
  };

  const ModalVisible =()=>{
      setIsModalVisible(true)
  }

  const onView=async()=>{
    const valuesObj ={status:`${statusKey}`, s_customer_id:`${customerId}`}
    const stringifiedJSON = JSON.stringify(valuesObj);
    const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
    const CustomSalesOrderData = await getManageWorkRequest(jsonToSend)
    for(let i=0; i<CustomSalesOrderData.length; i++){
    const uniqueId = uuid().replace(/-/g, '').toUpperCase()
      CustomSalesOrderData[i].qty = 1
      CustomSalesOrderData[i].key = uniqueId
    }
    setDataSource(CustomSalesOrderData)
  }

  const getStatusValue=(e)=>{
    setStatusKey(e)
  }

  

  const CreateWorkOrder=()=>{
    const arryForMutation=[]
    const newToken = JSON.parse(localStorage.getItem("authTokens"));
    if(selectedData.length>0){
      for(let ind=0;ind<selectedData.length;ind++){
      arryForMutation.push(`{
        sOrderLineId: "${selectedData[ind].s_orderline_id}"
        workRequestId:"${selectedData[ind].p_workrequest_id}"
      }`)
  }
    }
  const workOrder = {
    query:` mutation {
      createWorkOrder(workOrder : { 
           supplierId: "${supplierId}"
        workOrder : [${arryForMutation}]
      })
       { 
    status
    message  
    recordsId 
    }
    } `
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

const getSuppliers = async () =>{
  const supplierResponse = await getSupplierData()
  setSupplierData(supplierResponse)
}

const getCustomer =async (e) =>{
  const valuesObj ={name:`${typeof(e) === "object" ?e.target.value : e}`}
  const stringifiedJSON = JSON.stringify(valuesObj);
  const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
  const customerResponse = await getCustomerDetails(jsonToSend)
  setCustomerData(customerResponse)
}

const getCustomerName=(e)=>{
  setCustomerId(e)
}


const onSelectSupplier=(e)=>{
setSupplierId(e)
}


const openModal =()=>{
  setModal(true)
}


  return (
   <div>
       <div>
      <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
        <Row>
          <Col span={12}>
            <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>Manage Work Request</h2>
          </Col>
          <Col span={12}>
            <span style={{ float: "right" }}>
              <Button onClick={onView} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} >
                View
              </Button>
              <Button onClick={()=>{
                // CreateWorkOrder()
                openModal()
              }} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "150px", height: "33px" }}>
                Create Work Order
              </Button>
            </span>
          </Col>
        </Row>
        <Card style={{ marginBottom: "8px" }}>
          <Form layout="vertical" form={headerform} /* onFinish={onFinish} */>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <Form.Item name="status" label="Status" style={{ marginBottom: "8px" }}>
                  <Select
                    allowClear
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onSelect={getStatusValue}
                  >
                      <Option value="OH">ON-Hold</Option>
                      <Option value="PR">Processed</Option>
                      <Option value="OP">Open</Option>
                      <Option value="RJ" >Rejected</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="customer" label="Customer" style={{ marginBottom: "8px" }}>
                  <Select
                    allowClear
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                   onFocus={getCustomer}
                   onSearch={getCustomer}
                   onSelect={getCustomerName}
                  >
                     {customerData.map((data, index) => (
                        <Option key={data.s_customer_id} value={data.s_customer_id} title={data.name} >
                          {data.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col className="gutter-row" span={6}>
                <Form.Item name="salesOrder" label="Sales Order" style={{ marginBottom: "8px" }}>
                  <Select
                    allowClear
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    
                  </Select>
                </Form.Item>
              </Col> */}
              <Col className="gutter-row" span={6}>
                <Form.Item name="product" label="Product" style={{ marginBottom: "8px" }}>
                  <Select
                    allowClear
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                   
                  >
                    
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card bodyStyle={{ paddingTop: "0px", paddingBottom: "0px" }}>
          <div>
            <Table
              rowSelection={{
                ...rowSelectionForProducts,
              }}
              columns={columns}
              dataSource={dataSource}
              style={{ fontSize: "12px" }}
              size="small"
              sticky={true}
              scroll={{ y: "60vh", x: "100%" }}
              pagination={false}
            />
          </div>
          {/* <Modal
        visible={isModalVisible}
        closable={null}
        centered
        width="70%"
        footer={[
          <Button key="back" onClick={()=>{setIsModalVisible(false)}}>
            Cancel
          </Button>,
          <Button onClick={()=>{setIsModalVisible(false)}} >
            Okay
          </Button>,
        ]}
      >
          <Form form={modalForm} 
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 20 }}
          >
           <Row gutter={16} style={{display:'flex',flexDirection:'column'}}>
             <Col span={6} style={{marginBottom:'16px'}}>
               <Form.Item label={"Supplier"} name={'supplier'}>
                 <Input/>
               </Form.Item>
             </Col>
             <Col span={6} style={{marginBottom:'16px'}}>
               <Form.Item label={"Start Date"} name={'startDate'}>
                 <DatePicker/>
               </Form.Item>
             </Col>
             <Col span={6} style={{marginBottom:'16px'}}>
               <Form.Item label={"End Date"} name={'endDate'}>
                 <DatePicker/>
               </Form.Item>
             </Col>
           </Row>
          </Form>
        
      </Modal> */}

      <Modal
        visible={modal}
        closable={null}
        centered
        width="50%"
        footer={[
          <Button key="back" onClick={()=>{
            setModal(false) 
          }}>
            Cancel
          </Button>,
          <Button onClick={()=>{
            CreateWorkOrder()
            setModal(false)}} >
             Submit
          </Button>,
        ]}
      >
        <Form layout="vertical" name="summaryForm">
        <Row gutter={16}>
        <Col span={10}>
          <Form.Item name="supplier" label="Supplier" style={{ marginBottom: "8px" }}>
                  <Select
                    allowClear
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                   onFocus={getSuppliers}
                   onSelect={onSelectSupplier}
                  >
                     {supplierData.map((data, index) => (
                        <Option key={data.recordid} value={data.recordid} title={data.name} istaxflag={data.istaxincluded} pricelistid={data.p_pricelist_id}>
                          {data.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
          </Col>
          <Col span={2}/>
          <Col span={10}>
            <Form.Item name={'remarks'} label="Remarks">
            <Input.TextArea rows={1} />
            </Form.Item>
          </Col>
          <Col span={2}/>
        </Row>
        </Form>
      </Modal>
        </Card>
      </Spin>
      
    </div>
   </div>
  )
};

export default ManageWorkRequest;
