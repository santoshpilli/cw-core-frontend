import React, { useEffect, useState } from "react";
import { Row, Col, Select,Card, Spin, Table,Form,Button,Modal,Input,InputNumber,message } from "antd";
import { useHistory } from "react-router";
import { getRoleBusinessUnit,getStockIssueData,getStReceiptLinesData,getConfirmSTReceipt,getConfirmSTReturen } from "../../../services/custom";
import { LoadingOutlined } from "@ant-design/icons";
import moment from 'moment'
import { getOAuthHeaders } from "../../../constants/oAuthValidation";
import "antd/dist/antd.css";
import "../../../styles/app.css";

const {Option} = Select
const StReceipt = () => {
const [loading,setLoading] = useState(false)
const [data,setData] = useState([])
const [headerform] = Form.useForm();
const [bunitData,setBunitData] = useState([])
const [bunitId,setBunitId] = useState('')
const [visible,setVisible] = useState(false)
const [linesData,setLinesData] = useState([])
const [changedKey, setChangedKey] = useState("");
const [changedIndex, setChangedIndex] = useState("");
const [recordValue, setRecordValue] = useState([]);
const [changedValue, setChangedValue] = useState("");
const [selectedHeaderObject,setSelectedHeaderObject] = useState({})

const history = useHistory();

 
  const getBusinessUnit = async () =>{
    const userData = JSON.parse(window.localStorage.getItem('userData'))
    const businessUnitResponse = await getRoleBusinessUnit(userData.user_id)
    setBunitData(businessUnitResponse.userBunit)
  }

  const columns = [
    {
      title: "Date",
      dataIndex: "SalesOrder",
      key: "SalesOrder",
      width: 130,
      render:(text,data) =>{
           return data.date === null || data.date === undefined || data.date === "" ? null : moment(data.date).format('YYYY-MM-DD')
      }
    },
    {
      title: "ST Document",
      dataIndex: "documentno",
      key: "documentno",
      width: 140,
    },
    { title: "Issue Business Unit", dataIndex: "bunitName", key: "batchNo", width: 180,},
    { title: "Issued By", dataIndex: "createdby", key: "createdby", width: 140,},
    { title: "No Of Products", dataIndex: "noOfProducts", key: "noOfProducts", width: 130 },
    { title: "Product Qty", dataIndex: "totalQty", key: "totalQty", width: 130 },
    { title: "Action",
     key: "date2",
     width: 130,
     render : (data) =>{
         return <span onClick = {()=>getLinesPopup(data)} style ={{color:'blue',textDecoration:'none',borderBottom:'1px solid blue'}}>Receive</span>
     }
     },

  ];
 

  const onSelectBusinessUnit = (e,data) =>{
    setBunitId(e)
  }

  const getLinesPopup = async(data) =>{
      setSelectedHeaderObject(data)
      setVisible(true)
      setLoading(true)
      const linesResponse =  await getStReceiptLinesData(data.mTransferissueID)
      if(linesResponse !== null && linesResponse.length > 0) {
          for (let index = 0; index < linesResponse.length; index++) {
              const element = linesResponse[index].qtyReceived;
              linesResponse[index].qtyReceived1 = element
              linesResponse[index].returnQty = parseInt(linesResponse[index].qtyIssued) - parseInt(linesResponse[index].qtyReceived)
          }
        setLinesData(linesResponse)
      }
      setLoading(false)
  }

  const handleCancel = () =>{
    setVisible(false)
  }

  const getData = async () =>{
    setLoading(true)
    const response = await getStockIssueData(bunitId)
    if(response !== null && response.length > 0) {
      let res2 = response.sort((a, b) => (b.date != null ? moment(b.date) : null) - (a.date != null ? moment(a.date) : null));
        setData(res2)
    }else{
        setData([])
    }
    setLoading(false)
  }

  const linesColumns = [
    {
        title: "SKU",
        dataIndex: "sku",
        key: "sku",
        width: 130,
    },
    {
        title: "Product Name",
        dataIndex: "productName",
        key: "SalesOrder",
        width: 130,
    },
    {
        title: "Batch",
        dataIndex: "batchNo",
        key: "batchNo",
        width: 130,
    },
    {
        title: "UOM",
        dataIndex: "SalesOrder",
        key: "SalesOrder",
        width: 130,
    },
    {
        title: "Issue Qty",
        dataIndex: "qtyIssued",
        key: "qtyIssued",
        width: 130,
    },
    {
        title: "Receiving/Return Qty",
        dataIndex: "qtyReceived",
        key: "qtyReceived",
        width: 130,
        render: (text, record, index) => (
            <InputNumber
            //   readOnly={record.qtyReceived ? false : true}
              size="small"
              style={{ width: "95%" }}
              min={0}
              max={1000000000}
              value={text}
              onChange={onInputChange("qtyReceived", index, record)}
            />
          ),
    },
  ]

  const onInputChange = (key, index, record) => (value) => {
      setRecordValue(record);
      setChangedValue(value);
      setChangedKey(key);
      setChangedIndex(index);
  };

  useEffect(() => {
    let newData = [...linesData];
    if (newData.length > 0) {
      if (newData[changedIndex].key === recordValue.key) {
        const originalQty = parseInt(newData[changedIndex].qtyIssued)
        if(changedValue <= originalQty ){
          newData[changedIndex][changedKey] = changedValue  
          newData[changedIndex]['returnQty'] = parseInt(newData[changedIndex]['qtyIssued']) - (changedValue)
        }else{
          message.error("Qty should not be more than issue qty!")
          }
      }
      setLinesData(newData);
    }
  }, [changedValue]);

  const confirmSTReceipt = async() =>{
      setLoading(true)
      const response = await getConfirmSTReceipt(linesData,selectedHeaderObject)
      if(response.status === "200"){
          message.success(response.message)
          setLinesData([])
          setData([])
          setSelectedHeaderObject({})
          headerform.resetFields()
          setBunitId('')
      }else{
        message.success(response.message) 
      }
      setVisible(false)
      setLoading(false)
  }

  const confirmSTReturn =  async() =>{
    setLoading(true)
    const response = await getConfirmSTReturen(linesData,selectedHeaderObject)
    if(response.status === "200"){
        message.success(response.message)
        setLinesData([])
        setData([])
        setSelectedHeaderObject({})
        headerform.resetFields()
        setBunitId('')
    }else{
      message.success(response.message) 
    }
    setVisible(false)
    setLoading(false)
  }

  return (
    <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
      <div>
        <Row>
          <Col span={12}>
            <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "8px", marginTop: "1%" }}>Stock Receipt</h2>
          </Col>
          <Col span={12} />
        </Row>
        <Row>
          <Col span={24}>
            <Card style={{marginBottom:'8px'}}>
            <Form layout="vertical" form={headerform} name="control-hooks" /* onFinish={onFinish} */>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="businessUnit" label="Business unit" style={{ marginBottom: "8px" }}>
                    <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onFocus={getBusinessUnit}
                      onSelect={onSelectBusinessUnit}
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
                <Form.Item name="null" label="" style={{ marginBottom: "8px" }}>
                  <Button onClick={getData} style={{marginTop:'3.2vh',marginBottom: '8px', background: 'rgb(8, 158, 164)', color: 'white', width: '93px', height: '33px'}}>Search</Button>
                </Form.Item>
                </Col>
              </Row>
            </Form>
            </Card>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={data}
          size="small"
          scroll={{ y: "64.5vh", x: "100%"}}
          pagination={false}
        />
      </div>
      <Modal
          visible={visible}
          closable={null}
          centered
          width="80%"
          footer={[
            <Button onClick = {handleCancel}>
                Cancel
            </Button>,
            <Button
            style={{backgroundColor:'rgb(176 205 206 / 33%)',color:'#5D5454',border:'0.5px #07888D',fontSize:'12px',fontWeight:'600',height:'35px',width:'105px',borderRadius:'2px'}}
            onClick={confirmSTReturn}
            loading={loading}
          >
            Return
          </Button>,
            <Button
              loading={loading}
              onClick={confirmSTReceipt}
            >
              Receive
            </Button>,
          ]}
        >
          <h3>
            Products
          </h3>
          <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
          <Card>
        {/* <Row gutter={16}>
        <Col className="gutter-row" span={8}>
          <h4 style={{marginBottom:'0px'}}>UPC/SKU</h4>
          <Input />
        </Col>
        </Row>   */}
        {/* <br />       */}
      <Table
        columns={linesColumns}
        dataSource={linesData}
        style={{ fontSize: "12px" }}
        size="small"
        sticky={true}
        scroll={{ y: "40vh", x: "100%" }}
        pagination={false}
      />
        </Card>
          </Spin>
        </Modal>
     </Spin>
  );
};

export default StReceipt;
