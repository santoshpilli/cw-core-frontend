import React, { useEffect, useState } from "react";
import { Card, Menu, Dropdown, Form, Row, Col, Select, Button, InputNumber, Spin, message, Table, Image,Popover } from "antd";
import { getDocumentType, getCustomerData } from "../../../services/generic";
import { getPendingSalesOrders, getRoleBusinessUnit,getUIDStocks,getUIDStocks1 } from "../../../services/custom";
import { Resizable } from "react-resizable";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import { getOAuthHeaders } from "../../../constants/oAuthValidation";
import Axios from "axios";
import { v4 as uuid } from "uuid";
// import { serverUrl, genericUrl } from "../../../constants/serverConfig";
import DownArrow from "../../../assets/images/downArrow.svg";
import Modal from "antd/lib/modal/Modal";

// import "antd/dist/antd.css";
// import "../../../styles/app.css";

const { Option } = Select;

const ResizableCell = (props) => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const ManageSalesOrder = () => {
  const [bunitData, setBunitData] = useState([]);
  const [documentData, setDocumentData] = useState([]);
  const [bUnitId, setBUnitId] = useState("");
  const [documentTypeId, setDocumentTypeId] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const serverUrl = process.env.REACT_APP_serverUrl;
  const genericUrl = process.env.REACT_APP_genericUrl;
  const [dataSource, setDataSource] = useState([]);
  const [changedValue, setChangedValue] = useState("");

  const [loading, setLoading] = useState(false);
  const [headerform] = Form.useForm();
  const [customerData, setCustomerData] = useState([]);
  // const [uniueOrderId, SetUniueOrderId] = useState([]);
  const [priviewData, setPriviewData] = useState([]);
  const [changedKey, setChangedKey] = useState("");
  const [changedIndex, setChangedIndex] = useState("");
  const [recordValue, setRecordValue] = useState([]);
  const [modalVisible,setModalVisible] = useState(false)
  const [modalData,setModalData] = useState([])
  const [modalTableData ,setModalTableData] = useState([])
  const [designTaskData,setDesignTaskData] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTrue,setIsTrue] = useState(true)
  const [title,setTitle] = useState('')


  const [keys, setKeys] = useState([]);
  const [changedKey1, setChangedKey1] = useState("");
  const [changedIndex1, setChangedIndex1] = useState("");
  const [recordValue1, setRecordValue1] = useState([]);
  const [changedValue1, setChangedValue1] = useState("");

  const [expand, setExpand] = useState(false);

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
  // useEffect(()=>{
  // },[bUnitId])
  const onSelectBusinessUnit = (e) => {
    setBUnitId(e);
    localStorage.setItem('BUnitId', e)
  };

  const onSelectDocumentType = (e) => {
    setDocumentTypeId(e);
    localStorage.setItem("DocTypeId",e)
  };

  const onSelectCustomer = (e) => {
    if (e === undefined || e === null) {
      setCustomerId(null);
    } else {
      setCustomerId(e);
    }
  };

  const getDocument = async () => {
    const documentTypeResponce = await getDocumentType();
    setDocumentData(documentTypeResponce.searchData);
  };

  const getCustomer = async () => {
    const customerResponse = await getCustomerData();
    setCustomerData(customerResponse.searchData);
  };

  const columns = [
    { title: "SO Date", dataIndex: "SoDate", key: "SoDate", width: 130 },
    {
      title: "Sales Order",
      dataIndex: "SalesOrder",
      key: "SalesOrder",
      width: 130,
    },
    {
      title: "Customer",
      dataIndex: "Customer_name",
      key: "Customer",
      width: 180,
    },
    { title: "Scheduled Delivery Date", dataIndex: "ScheduledDeliveryDate", key: "ScheduledDeliveryDate", width: 180,},
    { title: "Product", dataIndex: "product", key: "product", width: 220,},
    { title: "Order Qty", dataIndex: "orderQty", key: "orderQty", width: 80,},
    { title: "Stock Allocated", dataIndex: "resReqQty", key: "res/ReqQty", width: 120,},
    { title: "Stock Qty", dataIndex: "stockQty", key: "stockQty", width: 80,},
    { title: "Design Status", dataIndex: "designStatus", key: "designStatus", width: 100,},
    // { title: "Channel Type", dataIndex: "channelType", key: "channelType", width: 100},
    {
      title: "Required Qty",
      dataIndex: "reqQty",
      key: "reqQty",
      width: 100,
      render: (text, record, index) => (
        <InputNumber
          readOnly={record.customer ? false : true}
          size="small"
          style={{ width: "95%" }}
          min={0}
          max={1000000000}
          value={text}
          onChange={onInputChange("reqQty", index, record)}
        />
      ),
    },
    // { title: "Sales Rep", dataIndex: "SalesRep", key: "SalesRep", width: 80, ellipsis: true },
    { title: "Image", dataIndex: "imageUrl", key: "imageUrl", width: 80, render: (text) => (text !== null ? <Image src={`${text === null ? null : text.includes(".jpg") || text.includes(".jfif")? text : `${text}.png`}`} /> : null) },
    // { title: "Description", dataIndex: "Description", key: "Description", width: 220, },
    { title: "Actions", dataIndex: "actions", key: "actions", width: 100, render:(text,record)=>(
<Dropdown trigger={["click"]} overlay={(
    <Col style={{ height: "auto" }}>
      <Row>
        <Menu>
          <Menu.Item key="1" onClick={(e)=>{
            let data = []
            data.push(record)
            if(record.flag ==="Y"){
              onSelectProductData(data)
              let string = `${record.SalesOrder}  -  ${record.customer.name}  -  ${record.product}`
              setTitle(string)

            }else{
              UIDStocks1Data(data)
            }
            }} style={{ fontSize: "12px", fontWeight: "400" }}>
            View Stock
          </Menu.Item>
          <Menu.Item key="2" onClick={(e)=>{ let data = []
            data.push(record) 
            setDesignTaskData(data)
            setIsTrue(true)
            setIsVisible(true)
            }} style={{ fontSize: "12px", fontWeight: "400",display:`${record.flag ==="Y" ? "block" : "none"}`}}>
            Create Design Task
          </Menu.Item>
          <Menu.Item key="3" onClick={(e)=>{
            let data = []
            data.push(record)
            setDesignTaskData(data)
            setIsTrue(false)
            setIsVisible(true)
            }} style={{ fontSize: "12px", fontWeight: "400",display:`${record.flag ==="Y" ? "block" : "none"}`}}>
            Create Work Request
          </Menu.Item>
        </Menu>
      </Row>
    </Col>
  )}>
                <Button size="small" style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white" }}>
                  Actions&nbsp;&nbsp;
                  <img style={{ width: "12px" }} src={DownArrow} alt="DownArrow" />
                </Button>
              </Dropdown>
  )},
  ];
  const modalColumns =[
    {
      title: 'Line NO',
      key: 'lineNo',
      width: 50,
      render:(value, item, index) => 1 + index
    },
    { title: "Product Name", dataIndex: "productName", key: "ScheduledDeliveryDate", width: 150,},
    { title: "UOM", dataIndex: "uomName", key: "product", width: 80,},
    { title: "Storage Bin Name ", dataIndex: "storagebinName", key: "orderQty", width: 180,},
    { title: "UID", dataIndex: "batchNo", key: "res/ReqQty", width: 100,},
    { title: "Stock On Hand", dataIndex: "qtyonhand", key: "qtyonhand", width: 80,},
    { title: "Resereved Qty", dataIndex: "reservedQty", key: "reservedQty", width: 100,},
    { title: "Qty", dataIndex: "qty", key: "qty", width: 80,  render: (text, record, index) => (
      <InputNumber
        // readOnly={record.customer ? false : true}
        size="small"
        style={{ width: "95%" }}
        min={0}
        max={1000000000}
        value={text}
        onChange={changeValue("qty", index, record)}
      />
    )},
    { title: "Actions",  key: "stockQty", width: 80,
     render:(record)=> (
       record.qtyonhand>0? <Button size="small" onClick={createReservation(record)} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white" }} >
          Reserve
        </Button>
     :
      <Button size="small" onClick={onConfirm(record)}  style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white" }}>
          Request
    </Button>
     )
  },
  ]
  const [column, setColumn] = useState(columns);
  const changeValue = (key, index, record)=>(value)=>{
    setRecordValue1(record);
    setChangedValue1(value);
    setChangedKey1(key);
    setChangedIndex1(index);
  }
  const onInputChange = (key, index, record) => (value) => {
      setRecordValue(record);
      setChangedValue(value);
      setChangedKey(key);
      setChangedIndex(index);
  };

  useEffect(() => {
    let newArry = [...modalTableData]
    if(newArry.length>0){
      if (newArry[changedIndex1].key === recordValue1.key) {
        if(changedValue1 <= newArry[changedIndex1]["qtyonhand"]){
        newArry[changedIndex1][changedKey1] = changedValue1;
        }else{
          message.error('Qty which is giving more than On Hand Qty')
        }
      }
      setModalTableData(newArry);
    }
  }, [changedValue1]);

  useEffect(() => {
    let newData = [...dataSource];
    if (newData.length > 0) {
      if (newData[changedIndex].key === recordValue.key) {
        newData[changedIndex][changedKey] = changedValue;
      }
      //  else {
      //   for (let index = 0; index < newData.length; index++) {
      //     for (let i = 0; i < newData[index].children.length; i++) {
      //       if (newData[index].children[i].key === recordValue.key) {
      //         newData[index].children[i][changedKey] = changedValue;
      //       }
      //     }
      //   }
      // }

      setDataSource(newData);
    }
  }, [changedValue]);

  const components = {
    header: {
      cell: ResizableCell,
    },
  };

  let finalColumns = column.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  const handleResize =
    (index) =>
    (e, { size }) => {
      setColumn((columns) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };
        return nextColumns;
      });
    };

    const coloseModal =()=>{
      setModalVisible(false)
    }

    const onSubmmit=()=>{
      createRes()
    }


  const getData = async (e, data) => {
    const keys = [];
    const pendingSalesOrderResponse = await getPendingSalesOrders(bUnitId, documentTypeId, customerId);
    for (let i = 0; i < pendingSalesOrderResponse.length; i++) {
      pendingSalesOrderResponse[i].Customer_name = pendingSalesOrderResponse[i].customer.name;
      pendingSalesOrderResponse[i].product = pendingSalesOrderResponse[i].salesOrderLines.product.value;
      pendingSalesOrderResponse[i].orderQty = pendingSalesOrderResponse[i].salesOrderLines.qty;
      pendingSalesOrderResponse[i].stockQty = pendingSalesOrderResponse[i].salesOrderLines.stockqty;
      pendingSalesOrderResponse[i].reqQty = pendingSalesOrderResponse[i].salesOrderLines.actualQty;
      pendingSalesOrderResponse[i].channelType = pendingSalesOrderResponse[i].salesOrderLines.channelName;
      pendingSalesOrderResponse[i].SoDate = pendingSalesOrderResponse[i].dateordered;
      pendingSalesOrderResponse[i].SalesOrder = pendingSalesOrderResponse[i].documentno;
      pendingSalesOrderResponse[i].ScheduledDeliveryDate = pendingSalesOrderResponse[i].datepromised;
      pendingSalesOrderResponse[i].key = pendingSalesOrderResponse[i].salesOrderLines.sOrderlineID;
      pendingSalesOrderResponse[i].flag = pendingSalesOrderResponse[i].sordersubproducts.length>0 ? "Y" : ""
      pendingSalesOrderResponse[i].SalesRep = pendingSalesOrderResponse[i].salesRep.name;
      pendingSalesOrderResponse[i].imageUrl = pendingSalesOrderResponse[i].salesOrderLines.product.imageurl
      pendingSalesOrderResponse[i].mProductId = pendingSalesOrderResponse[i].salesOrderLines.product.mProductId;
      pendingSalesOrderResponse[i].resReqQty = pendingSalesOrderResponse[i].salesOrderLines.reservedQty;
      pendingSalesOrderResponse[i].isReserved = pendingSalesOrderResponse[i].salesOrderLines.isReserved;
      pendingSalesOrderResponse[i].designStatus = pendingSalesOrderResponse[i].salesOrderLines.designStatus === 'Y' ? "Yes" : pendingSalesOrderResponse[i].salesOrderLines.designStatus === 'N' ? "No" : null ;
      const sordersubproducts = pendingSalesOrderResponse[i].sordersubproducts;
      if (sordersubproducts.length > 0) { 
        keys.push(pendingSalesOrderResponse[i].key);
      }
      const uniqueId = uuid().replace(/-/g, "").toUpperCase();

      for (let ind = 0; ind < sordersubproducts.length; ind++) {
       
        sordersubproducts[ind].mProductId = sordersubproducts[ind].product.mProductId;
        sordersubproducts[ind].imageUrl = sordersubproducts[ind].product.imageurl;
        sordersubproducts[ind].product = sordersubproducts[ind].name ? sordersubproducts[ind].name : null;
        sordersubproducts[ind].reqQty = sordersubproducts[ind].requiredQty;
        sordersubproducts[ind].orderQty = sordersubproducts[ind].qty;
        // sordersubproducts[ind].Description = sordersubproducts[ind].product.description;
        sordersubproducts[ind].key = sordersubproducts[ind].sOrderLineAddonsId;
        sordersubproducts[ind].stockQty = sordersubproducts[ind].stockQty;
        sordersubproducts[ind].SOrderId = pendingSalesOrderResponse[i].sOrderID
      }

      pendingSalesOrderResponse[i].children = pendingSalesOrderResponse[i].sordersubproducts;
    }

    setKeys(keys);
    setLoading(false);
    setDataSource(pendingSalesOrderResponse);
  };

  const onFinish = async (values) => {
    setLoading(true);
    // setColumn(finalColumns);
  };

  useEffect(() => {
    getBusinessUnit();
  }, []);

  const onSearch = () => {
    headerform.submit();
    setDataSource([]);
    getData();
  };

  const ExpandRow = (expanded, record) => {
    expanded = true;
    setExpand(true);
  };

  const onConfirm = async(record) => {
    let data = []
    data.push(record)
      setModalVisible(false)
      const BUnitId = localStorage.getItem('BUnitId')
      const DocTypeId = localStorage.getItem('DocTypeId')
    
      const authHeaders = getOAuthHeaders();
      if (authHeaders && authHeaders.email && authHeaders.access_token) {
    const userData = JSON.parse(window.localStorage.getItem("userData"));
    let modalData1 = record ? data : modalData
    headerform.validateFields().then((values) => {
      if (modalData1.length > 0) {
        setLoading(true);
        const date = new Date();
        const date1 = moment(date).format("YYYY-MM-DD");
    const uniueOrderId = uuid().replace(/-/g, "").toUpperCase();

        const createPoOrder = {
          query: `mutation{
      createPurchaseRequisition(requistion:{
              purchaseRequistionId: "${uniueOrderId}" 
                bUnit:{
                cSBunitID:"${record ? BUnitId:  bUnitId}" 
                }
                requisitionType:{
                  typeId:"${record ? DocTypeId : documentTypeId }" 
                }
              requisitionDate:"${date1}"
              requestedBy: "${date1}"
              description:null
              created: "${date1}"
              sOrderId:null
              requester:{
              requestedId:"${userData.user_id}"
              }
            createdBy:{
              userId:"${userData.user_id}"
              }
      })
       {
           status
           message
           id
           documentNo
       }
      }`,
        };
        Axios({
          url: serverUrl,
          method: "POST",
          data: createPoOrder,
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${authHeaders.access_token}`,
          },
        }).then((response) => {
          if (response.data.data !== null) {
            const Status = response.data.data.createPurchaseRequisition.status;
            const messageForSuccess = response.data.data.createPurchaseRequisition.message;
            if (Status === "200") {
              setLoading(false);
              // message.success(messageForSuccess)
              const recordId = response.data.data.createPurchaseRequisition.id;
              headerform.resetFields();
              // SetUniueOrderId(uniqueId);
              const arrayForMutation = [];
              for (let index = 0; index < modalData1.length; index++) {
                let uniqueId = uuid().replace(/-/g, "").toUpperCase();
                arrayForMutation.push(
                  `{
        prequestlineId:"${uniqueId}"
        requisition:{
            purchaseRequistionId:"${recordId}"
        }
         product:{
             mProductId: ${modalData1[index].mProductId === null ? null : `"${modalData1[index].mProductId}"`}
         }
         description:null
           bUnit: {
            cSBunitID:"${record ? BUnitId : bUnitId}" 
          }
         createdBy:{
            userId:"${userData.user_id}"
         }
          requiredQty: "${modalData1[index].reqQty}"
          estimatedPrice :"0"
           estimatedtotal :"0"
           sOrderLineId:"${modalData1[index].salesOrderLines.sOrderlineID}"
            created: "${date1}"
       }`
                );
              }

              const createPoOrder2 = {
                query: `mutation {
          createPRLines(pRLines: {
          pRLiness: [${arrayForMutation}]
          })
          {   
              status
              message
              recordsId
          }
          }`,
              };
              Axios({
                url: serverUrl,
                method: "POST",
                data: createPoOrder2,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `bearer ${authHeaders.access_token}`,
                },
              }).then((response) => {
                if (response.data.data.createPRLines.status === "200") {
                  message.success(response.data.data.createPRLines.message);
                  // setDataSource([]);
                  // setModalData([]);
                  // headerform.resetFields()
                  setLoading(false);
                } else {
                  message.success(response.data.data.createPRLines.message);
                  setLoading(false);
                }
              });
            } else {
              message.error(messageForSuccess);
              setLoading(false);
            }
          } else {
            message.error("getting error while creating lines");
            setLoading(false);
          }
        });
      } else {
        message.error("Please select products to proceed!");
      }
    });
  }
  };

  const createDesignTask = ()=>{
    let data = designTaskData
    const authHeaders = getOAuthHeaders();
    if (authHeaders && authHeaders.email && authHeaders.access_token) {
    const userData = JSON.parse(window.localStorage.getItem("userData"));
    const CreateDesign = {
      query:`mutation {
        createDesignTask(designTask:{designTasks: [{
            sOrderLineId:"${data[0].salesOrderLines.sOrderlineID}"
        }]
        })  {
      status
      message
      }
      }`
    }
    Axios({
      url: serverUrl,
      method: "POST",
      data: CreateDesign,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${authHeaders.access_token}`,
      },
    }).then((response)=>{
      if (response.data.data.createDesignTask.status === "200") {
        message.success(response.data.data.createDesignTask.message);
        // setDataSource([]);
        // setModalData([]);
        // headerform.resetFields()
        setIsVisible(false);
      } else {
        message.error(response.data.data.createDesignTask.message);
        setIsVisible(false);
      }
    })
  }
  }

  const createWorkRequest = ()=>{
    let data = designTaskData 
    const authHeaders = getOAuthHeaders();
    if (authHeaders && authHeaders.email && authHeaders.access_token) {
    const userData = JSON.parse(window.localStorage.getItem("userData"));
    let description = []
    if(data[0].children.length>0){for(let i =0;i<data[0].children.length;i++){
      description.push(data[0].children[i].name)
    }}
    const CreateWorkReq = {
      query:`mutation {
        createWorkRequest(workRequests: { workRequest: [{
          sOrderLineId:"${data[0].salesOrderLines.sOrderlineID}"
          description:${ data[0].children.length>0 ? `"${description.toString()}"` : null}
         }
          ]
         }) { 
      status
      message 
      recordsId
      }
      }`
    }
    Axios({
      url: serverUrl,
      method: "POST",
      data: CreateWorkReq,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${authHeaders.access_token}`,
      },
    }).then((response)=>{
      if (response.data.data.createWorkRequest.status === "200") {
        message.success(response.data.data.createWorkRequest.message);
        // setDataSource([]);
        // setModalData([]);
        // headerform.resetFields()
        setIsVisible(false);
      } else {
        message.error(response.data.data.createWorkRequest.message);
        setIsVisible(false);
      }
    })
  }
  }



  const onSelectProductData = async(data,type) => {
    let newArry = []
      for(let i=0;i<data.length;i++){
        setLoading(true)
        const uidStockRes = await getUIDStocks(data[i].salesOrderLines.product.mProductId);
        uidStockRes.forEach((element) => {
          const uniqueId = uuid().replace(/-/g, "").toUpperCase();
          element.sOrderID = data[i].sOrderID
          element.sOrderlineID = data[i].salesOrderLines.sOrderlineID
          // element.sOrderLineAddonsId = data[i].sordersubproducts[0].sOrderLineAddonsId
          element.qty = element.qtyonhand - element.reservedQty
          element.key = uniqueId
        newArry.push(element)
        });
        }
        setLoading(false)
        setModalTableData(newArry)
        setModalData(data)
        setModalVisible(true)
  };

  const UIDStocks1Data = async(data)=>{
    setLoading(true)
    let newArry = []
    const uidStockRes = await getUIDStocks1(data[0].sOrderLineId);
    uidStockRes.forEach(element => {
      const uniqueId = uuid().replace(/-/g, "").toUpperCase();
      element.sOrderID = data[0].SOrderId
      element.qty = element.qtyonhand
      element.key = uniqueId
      // element.sOrderLineAddonsId = data[0].sOrderLineAddonsId
      element.sOrderLineId = data[0].sOrderLineId
      element.qty = element.qtyonhand-element.reservedQty
    newArry.push(element)
    });
    setLoading(false)
    setModalTableData(newArry)
    setModalVisible(true)
  }

  const handleSelectProduct = (e,data)=>{
  }

  const rowSelectionForProducts = {
    onChange: handleSelectProduct,
  };

  const onSelectProduct = (e, data) => {
    setPriviewData(data);
    
  };

  const rowSelection={
    onChange:onSelectProduct
  }

  const onClickReseration =()=>{
    if(modalTableData.length>0){
      setModalVisible(true)
    }else{
      setModalVisible(false)
      // createRes()
    }
  }

  //  service call for create reservation

  const createRes =()=> {
        setModalVisible(false)
        headerform.validateFields().then((values) => {
          
          const authHeaders = getOAuthHeaders();
          if (authHeaders && authHeaders.email && authHeaders.access_token) {
            setLoading(true);
          const userData = JSON.parse(window.localStorage.getItem("userData"));
          let LinesForMutation = [];
          let SOrderId
              if (priviewData.length > 0) {
                for (let index = 0; index < priviewData.length; index++) {
                  SOrderId = priviewData[index].sOrderID;
                  LinesForMutation.push(`{
                    mProductId: "${priviewData[index].mProductId}", 
                    csUomId:"${priviewData[index].csUomId}",
                    mBatchId: ${priviewData[index].mBatchId === null ? null : `"${priviewData[index].mBatchId}"`},
                    sOrderlineID: "${priviewData[index].sOrderlineID}",
                    qty: "${priviewData[index].qty}"
                    sOrderlineAddonId: null
                  }`)
                }
                const createSoResrvation = {
                  query: `
                  mutation {
                    createSoReservation1(reservation:{
                        sOrder:[{ 
                          sOrderID: "${SOrderId}"
                          csUserId: "${userData.user_id}"
                              line:[${LinesForMutation}]
                       }]
                        }
                     ) {
                      status
                      message
                      recordsId
                      tasksId
                    }
                  }`,
                };
                Axios({
                  url: serverUrl,
                  method: "POST",
                  data: createSoResrvation,
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${authHeaders.access_token}`,
                  },
                }).then((response) => {
                  if (response.data.data.createSoReservation1.status === "200") {
                    message.success(response.data.data.createSoReservation1.message);
                    setLoading(false);
                  } else {
                    message.error("getting error while reservation of product");
                    setLoading(false);
                  }
                });
              } else {
                message.error("Please select products to proceed!");
              }
            }
        });
      
      };

  const createReservation = (record) =>()=> {
let data = []
data.push(record)
    setModalVisible(false)
    headerform.validateFields().then((values) => {
      const authHeaders = getOAuthHeaders();
      if (authHeaders && authHeaders.email && authHeaders.access_token) {
      setLoading(true);

      const userData = JSON.parse(window.localStorage.getItem("userData"));
      let LinesForMutation = [];
      let SOrderId
      let priviewData =data
          if (priviewData.length > 0) {
            for (let index = 0; index < priviewData.length; index++) {
              SOrderId = priviewData[index].sOrderID;
              LinesForMutation.push(`{
                mProductId: "${priviewData[index].mProductId}", 
                csUomId:"${priviewData[index].csUomId}",
                mBatchId: ${priviewData[index].mBatchId === null ? null : `"${priviewData[index].mBatchId}"`},
                sOrderlineID: "${priviewData[index].sOrderlineID}",
                qty: "${priviewData[index].qty}"
                sOrderlineAddonId: null
              }`)
            }
            const createSoResrvation = {
              query: `
              mutation {
                createSoReservation1(reservation:{
                    sOrder:[{ 
                      sOrderID: "${SOrderId}"
                      csUserId: "${userData.user_id}"
                          line:[${LinesForMutation}]
                   }]
                    }
                 ) {
                  status
                  message
                  recordsId
                  tasksId
                }
              }`,
            };
            Axios({
              url: serverUrl,
              method: "POST",
              data: createSoResrvation,
              headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${authHeaders.access_token}`,
              },
            }).then((response) => {
              if (response.data.data.createSoReservation1.status === "200") {
                message.success(response.data.data.createSoReservation1.message);
                setLoading(false);
              } else {
                message.error("getting error while reservation of product");
                setLoading(false);
              }
            });
          } else {
            message.error("Please select products to proceed!");
          }
        }
    });
  };

  const menu = (
    <Col style={{ height: "auto" }}>
      <Row>
        <Menu>
          <Menu.Item key="0" onClick={onConfirm} style={{ fontSize: "12px", fontWeight: "400" }}>
            Create Requisition
          </Menu.Item>
          <Menu.Item key="1" onClick={onClickReseration} style={{ fontSize: "12px", fontWeight: "400" }}>
            Create Reservation
          </Menu.Item>
        </Menu>
      </Row>
    </Col>
  )

  return (
    <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
      <div>
        <Row>
          <Col span={12}>
            <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>Manage Sales Order</h2>
          </Col>
          <Col span={12}>
            <span style={{ float: "right" }}>
              <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={onSearch}>
                View
              </Button>
              <Dropdown trigger={["click"]} overlay={menu}>
                <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "100px", height: "33px" }}>
                  Actions&nbsp;&nbsp;
                  <img style={{ width: "12px" }} src={DownArrow} alt="DownArrow" />
                </Button>
              </Dropdown>
            </span>
          </Col>
        </Row>
        <Card style={{ marginBottom: "8px" }}>
          <Form layout="vertical" form={headerform} onFinish={onFinish}>
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
                <Form.Item
                  name="documentType"
                  label="Document Type"
                  style={{ marginBottom: "8px" }}
                  rules={[
                    {
                      required: true,
                      message: "Please select document type!",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onFocus={getDocument}
                    onSelect={onSelectDocumentType}
                  >
                    {documentData.map((data) => (
                      <Option key={data.RecordID}>{data.Name}</Option>
                    ))}
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
                    onChange={onSelectCustomer}
                  >
                    {customerData.map((data) => (
                      <Option key={data.RecordID}>{data.Name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Table
          columns={finalColumns}
          dataSource={dataSource}
          components={components}
          size="small"
          onExpand={ExpandRow}
          expandedRowKeys={expand ? "" : keys}
          rowSelection={{
            ...rowSelectionForProducts,
          }}
          scroll={{ y: "64.5vh", x: "100%" }}
          pagination={false}
        />
      </div>
      <Modal width="85%" title={title} centered visible={modalVisible} closable={true} okText="Submit" onOk={onSubmmit} onCancel={coloseModal}>
          <Table size="small" 
          rowSelection={{
            ...rowSelection,
          }}
          onExpand={ExpandRow}
          columns={modalColumns} dataSource={modalTableData} pagination={false} style={{ height: "44vh", overflow: "scroll" }}></Table>
      </Modal>
      <Modal width="40%" centered visible={isVisible} closable={true} okText="Okay" onOk={isTrue ? createDesignTask : createWorkRequest} onCancel={()=>{setIsVisible(false)}}>
        {isTrue ? <span>Do you want to create Design Task</span>  : <span>Do you want to create work Request</span>}
      </Modal>
    </Spin>
  );
};

export default ManageSalesOrder;
