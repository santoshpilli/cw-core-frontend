import React, { useContext, useState, useEffect, useRef } from "react";
import { Card, Form, Row, Col, Select, Button, Modal, Spin, message, Table, Image, InputNumber,Input } from "antd";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { getOAuthHeaders } from "../../../constants/oAuthValidation";
import Axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import { getRequisitionTypeData, getSupplierData, getSupplierAddress } from "../../../services/generic";
import { getPendingRequisition, getRoleBusinessUnit, getDeliveryLocation } from "../../../services/custom";
// import { serverUrl, genericUrl, fileDownloadUrl } from "../../../constants/serverConfig";
const { Option } = Select;

const ManageRequisition = () => {
  const [bunitData, setBunitData] = useState([]);
  const [bUnitId, setBUnitId] = useState("");
  const serverUrl = process.env.REACT_APP_serverUrl;
  const genericUrl = process.env.REACT_APP_genericUrl;
  const fileDownloadUrl = process.env.REACT_APP_fileDownloadUrl;
  const [changedValue, setChangedValue] = useState("");
  const [changedKey, setChangedKey] = useState("");
  const [changedIndex, setChangedIndex] = useState("");
  const [changedValue1, setChangedValue1] = useState("");
  const [changedKey1, setChangedKey1] = useState("");
  const [changedIndex1, setChangedIndex1] = useState("");
  const [remarkData,setRemarkData] = useState("")
  const [indexNo,setIndexNo] = useState("")
  const [headerRemarks,setHeaderRemarks] = useState("")


  const [loading, setLoading] = useState(false);
  const [requisitionTypeData, setRequisitionTypeData] = useState([]);
  const [requisionTypeId, setRequisionTypeId] = useState(null);
  const [productData, setProductData] = useState([]);
  const [priviewData, setPriviewData] = useState([]);
  const [poSummaryVisible, setPoSummaryVisible] = useState(false);
  const [supplierData, setSupplierData] = useState([]);
  const [regionName, setRegionName] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [priceListId, setPriceListId] = useState("");
  const [istaxincludedFlag, setIstaxincludedFlag] = useState("");
  const [supplierAddressId, setSupplierAddressId] = useState("");
  const [uniueOrderId, SetUniueOrderId] = useState([]);
  const [headerform] = Form.useForm();
  const [summaryForm] = Form.useForm();

  useEffect(() => {
    const uniqueId = uuid().replace(/-/g, "").toUpperCase();
    SetUniueOrderId(uniqueId);
  }, []);

  const getBusinessUnit = async () => {
    const userData = JSON.parse(window.localStorage.getItem("userData"));
    const businessUnitResponse = await getRoleBusinessUnit(userData.user_id);
    setBunitData(businessUnitResponse.userBunit);
  };

  const getSuppliers = async () => {
    const supplierResponse = await getSupplierData();
    setSupplierData(supplierResponse);
  };

  const onSelectBusinessUnit = (e) => {
    setBUnitId(e);
    getDeliverLocation(e);
  };

  const getDeliverLocation = async (e) => {
    const deliveryResponse = await getDeliveryLocation(e);
    setRegionName(deliveryResponse[0].bUnitLocationId);
  };

  const onSelectSupplier = (e, data) => {
    setSupplierId(e);
    setPriceListId(data.props.pricelistid);
    setIstaxincludedFlag(data.props.istaxflag);
    getSupplierAdd(e);
    doPriceCalculationsForSummary(data.props.istaxflag)
  };

  const doPriceCalculationsForSummary = (taxFlag) =>{
    const newArray=[] 
    if(taxFlag === 'Y'){
        for (let index = 0; index < priviewData.length; index++) {
          const orQty = priviewData[index].actualQty;
          const taxRate = priviewData[index].requisitionLines.tax.rate
          const basePrice = priviewData[index].basePrice
          const netUnitPrice1 = (basePrice/(1+taxRate/100))
          const taxOnUnitPrice = ((taxRate/ 100) * netUnitPrice1)
          const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
          const gridGrossAmt1 =( unitPrice1 * orQty)

          const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
          const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
          const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
          
          priviewData[index].basePrice = basePrice
          priviewData[index].netUnitPrice = netUnitPrice
          priviewData[index].unitPrice = unitPrice
          priviewData[index].grossAmount = gridGrossAmt
          priviewData[index].grossStd = basePrice
          priviewData[index].netStd = netUnitPrice

          newArray.push(priviewData[index])
        }
    }else{
      for (let index = 0; index < priviewData.length; index++) {
        const orQty = priviewData[index].actualQty;
        const taxRate = priviewData[index].requisitionLines.tax.rate
        const basePrice = priviewData[index].basePrice

        const netUnitPrice1 = basePrice
        const taxOnUnitPrice = ((taxRate/ 100) * netUnitPrice1)
        const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
        const gridGrossAmt1 = (unitPrice1 * orQty)

        const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
        const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
        const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)

        priviewData[index].basePrice = basePrice
        priviewData[index].netUnitPrice = netUnitPrice
        priviewData[index].unitPrice = unitPrice
        priviewData[index].grossAmount = gridGrossAmt
        priviewData[index].grossStd = unitPrice
        priviewData[index].netStd = basePrice

        newArray.push(priviewData[index])
      }
    }
    setTimeout(() => {
      setPriviewData([])
      setPriviewData(newArray)
    }, 100);
  }

  const getSupplierAdd = async (e) => {
    const supplierAddressResponse = await getSupplierAddress(e);
    setSupplierAddressId(supplierAddressResponse[0].recordid);
  };
  const getRequisitionType = async () => {
    const Response = await getRequisitionTypeData();
    setRequisitionTypeData(Response.searchData);
  };

  const onSelectRequisitionType = (e) => {
    setRequisionTypeId(e);
  };

  const createPoCancel = () => {
    setPoSummaryVisible(false);
  };

  const getProducts = async () => {
    setLoading(true);
    const Response = await getPendingRequisition(bUnitId, requisionTypeId);
    for (let index = 0; index < Response.length; index += 1) {
      Response[index].key = Response[index].requisitionLines.prequestlineId;
      Response[index].imageUrl = Response[index].requisitionLines.product.imageurl;
      Response[index].actualQty = Response[index].requisitionLines.requiredQty;
      Response[index].basePrice = Response[index].requisitionLines.product.purchasePrice;
      Response[index].unitPrice = Response[index].requisitionLines.product.purchasePrice;
      Response[index].netUnitPrice = Response[index].requisitionLines.product.purchasePrice;
      Response[index].grossAmount = (Response[index].requisitionLines.product.purchasePrice) * (Response[index].requisitionLines.requiredQty);
    }
    setProductData(Response);
    setLoading(false);
  };

  const columns = [
    {
      title: "Requisition #",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.documentNo;
      },
    },
    {
      title: "Required By",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.requiredDate === null || record.requiredDate === "" || record.requiredDate === undefined ? null : moment(record.requiredDate).format("YYYY-MM-DD");
      },
    },
    {
      title: "SoDocNo",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.sDocumentNo;
      },
    },
    {
      title: "Client Name",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.sCustomerName;
      },
    },
    {
      title: "Product",
      dataIndex: "value",
      width: 220,
      ellipsis:true,
      render: (text, record) => {
        return record.requisitionLines.product.name;
      },
    },
    {
      title: "Order Qty",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.requisitionLines.sOrderQty !== null ? record.requisitionLines.sOrderQty : 0;
      },
    },
    {
      title: "Order Fulfilled",
      dataIndex: "orderFulfilledQty",
      width: 100,
      render: (text, record) => {
        return record.requisitionLines.orderFulfilledQty;
      },
    },
    {
      title: "Stock Allocated",
      dataIndex: "stockAllocatedQty",
      width: 100,
      render: (text, record) => {
        return record.requisitionLines.stockAllocatedQty === null ? 0 : record.requisitionLines.stockAllocatedQty;
      },
    },
    {
      title: "Requisition Made",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.requisitionLines.requiredQty;
      },
    },
    {
      title: "Pending Requisition",
      dataIndex: "pendingRequisitionQty",
      width: 100,
      render: (text, record) => {
        return record.requisitionLines.pendingRequisitionQty;
      },
    },
    {
      title: "Actual Qty",
      dataIndex: "actualQty",
      width: 100,
      editable: true,
      render: (text, record, index) => <InputNumber size="small" style={{ width: "95%" }} min={0} max={1000000000} value={text} onChange={onInputChange("actualQty", index)} />,
    },
    { title: "Image", dataIndex: "imageUrl", key: "imageUrl", width: 80, 
    render: (text) => {
     return (text !== null ? <Image src={`${text === null ? null : `${text}`}`} /> : null) 
    }
  },
  {
    title: "Channel",
    dataIndex: "channelName",
    width: 140,
    render: (text, record) => {
      return record.requisitionLines.channelName;
    },
  },
  ];

  const summaryColumns = [
    {
      title: "Requisition #",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.documentNo;
      },
    },
    {
      title: "Required By",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.requiredDate === null || record.requiredDate === "" || record.requiredDate === undefined ? null : moment(record.requiredDate).format("YYYY-MM-DD");
      },
    },
    {
      title: "SoDocNo",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.sDocumentNo;
      },
    },
    {
      title: "Client Name",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.sCustomerName;
      },
    },
    {
      title: "Product",
      dataIndex: "value",
      width: 220,
      ellipsis:true,
      render: (text, record) => {
        return record.requisitionLines.product.name;
      },
    },
    {
      title: "Order Qty",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.requisitionLines.sOrderQty !== null ? record.requisitionLines.sOrderQty : 0;
      },
    },
    {
      title: "Order Fulfilled",
      dataIndex: "orderFulfilledQty",
      width: 100,
      render: (text, record) => {
        return record.requisitionLines.orderFulfilledQty;
      },
    },
    {
      title: "Stock Allocated",
      dataIndex: "stockAllocatedQty",
      width: 100,
      render: (text, record) => {
        return record.requisitionLines.stockAllocatedQty === null ? 0 : record.requisitionLines.stockAllocatedQty;

      },
    },
    {
      title: "Requisition Made",
      dataIndex: "value",
      width: 100,
      render: (text, record) => {
        return record.requisitionLines.requiredQty;
      },
    },
    {
      title: "Pending Requisition",
      dataIndex: "pendingRequisitionQty",
      width: 100,
      render: (text, record) => {
        return record.requisitionLines.pendingRequisitionQty;
      },
    },
    {
      title: "Actual Qty",
      dataIndex: "actualQty",
      width: 100,
      editable: true,
      render: (text, record, index) => <InputNumber size="small" style={{ width: "95%" }} min={0} max={1000000000} value={text} onChange={onInputChange2("actualQty", index)} />,
    },
    {
      title: "Tax",
      dataIndex: "value",
      width: 180,
      render: (text, record) => {
        return record.requisitionLines.tax.name;
      },
    },
    {
      title: "Base Price",
      dataIndex: "basePrice",
      width: 100,
      editable: true,
      render: (text, record, index) => <InputNumber size="small" style={{ width: "95%" }} min={0} max={1000000000} value={text} onChange={onInputChange2("basePrice", index)} />,
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      width: 100,
    },
    {
      title: "Netunit Price",
      dataIndex: "netUnitPrice",
      width: 100,
    },
    {
      title: "Gross Amount",
      dataIndex: "grossAmount",
      width: 100,
    },
    { title: "Image", dataIndex: "imageUrl", key: "imageUrl", width: 80, 
    render: (text) => {
     return (text !== null ? <Image src={`${text === null ? null : `${text}`}`} /> : null) 
    }
  },
  {
    title: "Channel",
    dataIndex: "channelName",
    width: 140,
    render: (text, record) => {
      return record.requisitionLines.channelName;
    },
  },
  { title: "Remarks", dataIndex: "remarks", key: "remarks", width: 130, 
    render: (text, record, index)=><Input.TextArea rows={1} onChange={onChangeRemarks(index)} />
  }
  ];

  const onChangeRemarks =(index)=>(value)=>{
setRemarkData(value.target.value);
    setIndexNo(index);

  }

  const onInputChange = (key, index) => (value) => {
    setChangedValue(value);
    setChangedKey(key);
    setChangedIndex(index);
  };

  useEffect(() => {
    let newData = [...priviewData];
    if (newData.length > 0 && newData !== undefined) {
      newData[indexNo].remarks  = remarkData;
      setPriviewData(newData);
    }
  }, [remarkData]);

  useEffect(() => {
    let newData = [...productData];
    if (newData.length > 0) {
      newData[changedIndex][changedKey] = changedValue;
      setProductData(newData);
    }
  }, [changedValue]);

  const onInputChange2 = (key, index) => (value) =>{
    setChangedValue1(value);
    setChangedKey1(key);
    setChangedIndex1(index);
  }

  useEffect(() => {
    let newData = [...priviewData];
    if (newData.length > 0) {
      newData[changedIndex1][changedKey1] = changedValue1;
      // setPriviewData(newData);
      doPriceCalculationsForSummary(istaxincludedFlag)
    }
  }, [changedValue1]);

  const remarksData =(e)=>{
    let description2 = null
        if (e.target.value !== undefined && e.target.value !== null) {
          const doubleQuoteForWhereClause = e.target.value.replace( /\r?\n|\r/g,'\\n')
          description2 = doubleQuoteForWhereClause.replace(/"/g, '\\"')
        }
    setHeaderRemarks(description2)
  }

  // editable cell code end

  const onSelectProductData = (e, data) => {
    setPriviewData(data);
  };
  const rowSelectionForProducts = {
    onChange: onSelectProductData,
  };

  const onPriview = () => {
    if (priviewData.length > 0) {
      setPoSummaryVisible(true);
    } else {
      message.error("Please select products!");
    }
  };

  const createPO = () => {
    summaryForm.validateFields().then((values) => {
      const authHeaders = getOAuthHeaders();
      if (authHeaders && authHeaders.email && authHeaders.access_token) {
      setLoading(true);
      const date = new Date();
      const date1 = moment(date).format("YYYY-MM-DD");
      const arrayForMutation = [];
      let uomId = "";
      let productId1 = "";
      let orderQty1 = "";
      let unitPrice = "";
      let listPrice = "";
      let taxId = "";
      let description1 = "";
      let freeqty = "";
      let margin = "";
      let discountValue = "";
      let discountType = "";
      let totalDiscount = "";
      let grossStd;
      let netStd;
      let upc = "";
      let marginStd = "";
      let salePrice = "";
      let requisitionLineId = ""
      let uniqueId = uuid().replace(/-/g, "").toUpperCase();
      for (let index = 0; index < priviewData.length; index++) {
        productId1 = priviewData[index].requisitionLines.product.mProductId;
        requisitionLineId = priviewData[index].requisitionLines.prequestlineId
        uomId = priviewData[index].requisitionLines.uom.csUomId;
        grossStd = priviewData[index].grossStd;
        netStd = priviewData[index].netStd;
        orderQty1 = priviewData[index].actualQty;
        unitPrice = istaxincludedFlag === 'Y' ? priviewData[index].basePrice : priviewData[index].netUnitPrice
        listPrice = priviewData[index].requisitionLines.product.listPrice;
        taxId = priviewData[index].requisitionLines.tax.csTaxID;
        upc = null;
        salePrice = priviewData[index].requisitionLines.product.salePrice;
        marginStd = 0;
        // description1 =
        //   priviewData[index].remarks === null || priviewData[index].remarks === undefined
        //     ? null
        //     : priviewData[index].remarks;
        freeqty = 0;
        margin = 0;
        discountValue = 0;
        discountType = null;
        totalDiscount = 0;
        if (priviewData[index].remarks !== undefined && priviewData[index].remarks !== null) {
          const doubleQuoteForWhereClause = priviewData[index].remarks.replace( /\r?\n|\r/g,'\\n')
          description1 = doubleQuoteForWhereClause.replace(/"/g, '\\"')
        }
        arrayForMutation.push(
          `{
          productId : "${productId1}",
          uomId : "${uomId}",
          orderQty : ${orderQty1},
          unitPrice : ${unitPrice === null || unitPrice === undefined ? 0 : unitPrice},                                      
          listPrice : ${listPrice === null || listPrice === undefined ? 0 : listPrice},
          taxId : "${taxId}",
          description : ${description1 === null || description1 === undefined ? null : `"${description1}"`},
          freeqty : ${freeqty},
          isManual: "Y",
          margin : ${margin},
          marginStd : ${marginStd},
          discountvalue : ${discountValue},
          discountType: ${discountType === null || discountType === undefined ? null : `"${discountType}"`},       
          totalDiscount: "${totalDiscount}",
          grossstd:${grossStd},
          netstd:${netStd}
          requisitionLineId:"${requisitionLineId}"
          salePrice:${salePrice === null || salePrice === undefined ? null : salePrice},
          upc:${upc === undefined || upc === null || upc === "" ? null : `"${upc}"`}
      }`
        );
      }
      const createPoOrder = {
        query: `mutation {
      createPO(order : {
              orderId : "${uniueOrderId}",
              bunitId : "${bUnitId}",
              bunitLocationId : ${regionName === undefined || regionName === null || regionName === "" ? null : `"${regionName}"`},
              supplierId : "${supplierId}",
              dateOrdered : "${date1}",
              datePromised : "${date1}",
              isTaxIncluded : "${istaxincludedFlag}",
              pricelistId : "${priceListId}",
              description : "${headerRemarks}",
              deliveryNote : "Check Quantity & Price",
              supplierAddressId : "${supplierAddressId}",
              lines : [${arrayForMutation}]
              landedCost:[]
      }) {
              type
              code
              message
              documentNo
              extraParam
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
          const Status = response.data.data.createPO.type;
          const messageForSuccess = response.data.data.createPO.message;
          if (Status === "Success") {
            setLoading(false);
            // message.success(messageForSuccess)
            setPoSummaryVisible(false);
            const recordId = response.data.data.createPO.extraParam;
            headerform.resetFields();
            SetUniueOrderId(uniqueId);
            setProductData([]);
            setPriviewData([]);
            getPrintCofirmation(recordId, messageForSuccess);
            summaryForm.resetFields()
          } else {
            message.error(messageForSuccess);
            setLoading(false);
          }
        } else {
          message.error("getting error while creating a PO");
          setLoading(false);
        }
      });
    }
    });
  };

  const getPrintCofirmation = (recordId, messageForSuccess) => {
    Modal.confirm({
      title: `${messageForSuccess}`,
      content: "Do you want take Printout",
      okText: "Yes",
      icon: null,
      cancelText: "No",
      onOk() {
        getPrintPdffile(recordId);
      },
      onCancel() {
        setPoSummaryVisible(false);
        setProductData([]);
      },
    });
  };

  const getPrintPdffile = (recordId) => {
    const authHeaders = getOAuthHeaders();
    if (authHeaders && authHeaders.email && authHeaders.access_token) {
    const RoleId = window.localStorage.getItem("userData");
    const getPrintPdfData = {
      query: `query {reportTemplate(ad_tab_id:"EE797F0AD47E41A08CFBC7867F538661",recordId:"${recordId}")}`,
    };

    Axios({
      url: genericUrl,
      method: "POST",
      async: true,
      crossDomain: true,
      data: getPrintPdfData,

      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${authHeaders.access_token}`,
        RoleId: `${RoleId.role_id}`,
      },
    }).then((response) => {
      if (response.data.data.reportTemplate === null || response.data.data.reportTemplate === "null" || response.data.data.reportTemplate === "") {
      } else {
        getPrintCommand(response.data.data.reportTemplate);
      }
    });
  }
  };

  const getPrintCommand = (fileName) => {
    setProductData([]);
    setPoSummaryVisible(false);
    Axios({
      url: `${fileDownloadUrl}`.concat(`${fileName}`),
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.setAttribute("id", "downloadlink");
      link.href = fileURL;
      link.setAttribute("download", `${fileName}`);
      link.click();
    });
  };

    let orderQuantityCount = 0
    let grossAmtCount = 0
    let orderQuantity = 0
    for (let index = 0; index < priviewData.length; index += 1) {
      orderQuantity = priviewData[index].actualQty
      const integer = parseFloat(orderQuantity, 10)
      orderQuantityCount += integer
      const grossAmtWithFloat = priviewData[index].grossAmount
      grossAmtCount += parseFloat(grossAmtWithFloat) 
    }

  const summaryDiv = (
    <Card>
      <Form layout="vertical" form={summaryForm} name="summaryForm">
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <Form.Item
              name="summsupplier"
              label="Supplier"
              rules={[
                {
                  required: true,
                  message: "Please select supplier!",
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onSelect={onSelectSupplier}
                onFocus={getSuppliers}
              >
                {supplierData.map((data, index) => (
                  <Option key={data.recordid} value={data.recordid} title={data.name} istaxflag={data.istaxincluded} pricelistid={data.p_pricelist_id}>
                    {data.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
          <Form.Item
              name="remarks"
              label="Remarks"
            >
             <Input.TextArea rows={1} value={headerRemarks} onChange={(value)=>{remarksData(value)}}/>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <p />
        </Row>
        <Row>
          <p />
        </Row>
      </Form>
      <div>
        <Table columns={summaryColumns} dataSource={priviewData} style={{ fontSize: "12px" }} size="small" sticky={true} scroll={{ y: "40vh", x: "100%" }} pagination={false} />
      </div>
      <Row gutter={16}>
      <Col className="gutter-row" span={8}>
      <h4>No. of Products: {priviewData.length}</h4>
      </Col>
      <Col className="gutter-row" span={8}>
      <h4>Total Quantity: {orderQuantityCount}</h4>
      </Col>
      <Col className="gutter-row" span={8}>
      <h4>Total Amount: {grossAmtCount.toFixed(2)}</h4>
      </Col>
    </Row>
    </Card>
  );

  return (
    <div>
      <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
        <Row>
          <Col span={12}>
            <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>Manage Requisition</h2>
          </Col>
          <Col span={12}>
            <span style={{ float: "right" }}>
              <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={getProducts}>
                View
              </Button>
              <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={onPriview}>
                Create Po
              </Button>
            </span>
          </Col>
        </Row>
        <Card style={{ marginBottom: "8px" }}>
          <Form layout="vertical" form={headerform} /* onFinish={onFinish} */>
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
                    {bunitData.map((data) => (
                      <Option key={data.csBunitId} value={data.csBunitId} title={data.bUnitName}>
                        {data.bUnitName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="requisitionType" label="Requisition Type" style={{ marginBottom: "8px" }}>
                  <Select
                    allowClear
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onFocus={getRequisitionType}
                    onSelect={onSelectRequisitionType}
                  >
                    {requisitionTypeData.map((data) => (
                      <Option key={data.RecordID} value={data.RecordID} title={data.Name}>
                        {data.Name}
                      </Option>
                    ))}
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
              dataSource={productData}
              style={{ fontSize: "12px" }}
              size="small"
              sticky={true}
              scroll={{ y: "60vh", x: "100%" }}
              pagination={false}
            />
          </div>
        </Card>
      </Spin>
      <Modal
        visible={poSummaryVisible}
        closable={null}
        centered
        width="90%"
        footer={[
          <Button key="back" onClick={createPoCancel}>
            Cancel
          </Button>,
          <Button loading={loading} onClick={createPO}>
            Confirm
          </Button>,
        ]}
      >
        <h3 style={{ textAlign: "center" }}>Pending Requisition Summary</h3>
        <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
          {summaryDiv}
        </Spin>
      </Modal>
    </div>
  );
};

export default ManageRequisition;