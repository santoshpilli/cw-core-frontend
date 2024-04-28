import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Select, Tabs, Input, Spin, Modal, Tooltip, DatePicker, Radio, message, Table } from "antd";
import { LoadingOutlined, DownloadOutlined, EditOutlined } from "@ant-design/icons";
import { ExportToCsv } from "export-to-csv";
import { v4 as uuid } from "uuid";
import { getOAuthHeaders } from "../../../constants/oAuthValidation";
import { getIssueingBusinessUnit, getReceivingBusinessUnits, getRemarksList } from "../../../services/generic";
import {getIssueTypeData,getAppSetupData} from '../../../services/custom'
import Axios from "axios";
// import { serverUrl, genericUrl, fileDownloadUrl } from "../../../constants/serverConfig";

import moment from "moment";
import barcodeImage from "../../../assets/images/barcode.svg";
import { color } from "d3";

const { Option } = Select;
const { TabPane } = Tabs;
const dateFormat = "YYYY-MM-DD";

const StIssue = () => {
  const [issueBusinessUnitData, setIssueBusinessUnitData] = useState([]);
  const [bunitId, setBunitId] = useState("");
  const serverUrl = process.env.REACT_APP_serverUrl;
  const genericUrl = process.env.REACT_APP_ggenericrl;
  const fileDownloadUrl = process.env.REACT_APP_fileDownloadUrl;
  const [receivingBunitId,setReceivingBunitId] = useState("")
  const [businessUnitName, setBusinessUnitName] = useState("");
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState([]);
  const [tabKey, setTabKey] = useState("10");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedProductObject, setSelectedProductObject] = useState({});
  const [inventoryCountSummaryData, setInventoryCountSummaryData] = useState([]);
  const [inventorySummaryReviewVisible, setInventorySummaryReviewVisible] = useState(false);
  const [radioValue, setRadioValue] = useState(1);
  const [AutoFocusValue, setAutoFocusValue] = useState(true);
  const [cwrWareHouseIdForIssueBU, setCwrWareHouseIdForIssueBU] = useState("");
  const [doctypeId, setDoctypeId] = useState("");
  const [receivingBusinessUnitData, setReceivingBusinessUnitData] = useState([]);
  const [cwrWareHouseIdForRecevingBU, setCwrWareHouseIdForRecevingBU] = useState("");
  const [storageBinId, setStorageBinId] = useState("");
  const [remarkslist, setRemarksList] = useState([]);
  const [createStClientId, setCreateStClientId] = useState("");
  const [batchedData, setBatchedData] = useState([]);
  const [batch, setBatch] = useState("");
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [issueTypeData,setIssueTypeData] = useState([])
  const [selectedIssueType,setSelectedIssueType] = useState({})
  const [appConfig, setAppConfig] = useState({});
  const [dateVisible,setDateVisible] = useState(false)

  const [form] = Form.useForm();
  const [headerform] = Form.useForm();
  const [summaryForm] = Form.useForm();
  const [skuupcform] = Form.useForm();

  useEffect(() => {
    const initialDate = moment(new Date()).format("YYYY-MM-DD");
    setSelectedDate(initialDate);
    headerform.setFieldsValue({
      date: moment(initialDate, dateFormat),
    });
    summaryForm.setFieldsValue({
      summbusinessunit: businessUnitName,
      summreceiptdate: moment(initialDate, dateFormat),
    });
    getAppSetup();
  }, []);

  const onFinish = () => {};

  const getAppSetup = async () => {
    const val = "Stock Transfer Issue";
    const response = await getAppSetupData(val);
    if (response.length > 0) {
      setAppConfig(JSON.parse(response[0]?.configJson));
    };
    }

  const inventorySummaryReview = () => {
    summaryForm.setFieldsValue({
      summbusinessunit: businessUnitName,
      summreceiptdate: moment(selectedDate, dateFormat),
    });
    const newArray = [];
    for (let index = 0; index < productData.length; index++) {
      const element = parseFloat(productData[index].qtycount);
      if (element > 0) {
        newArray.push(productData[index]);
      }
    }
    setInventoryCountSummaryData(newArray);

    if (newArray.length > 0) {
      let flag = true;
      for (let index = 0; index < newArray.length; index++) {
        const totalOnHandQty = parseFloat(newArray[index].totalOnHandQty);
        const issueQty = parseFloat(newArray[index].qtycount);
        if (issueQty > totalOnHandQty) {
          flag = false;
        }
      }
      if (flag === true) {
        setInventorySummaryReviewVisible(true);
      } else {
        message.error("Issued qty shouldnt be more than onHand qty");
      }
    } else {
      message.error("Please Add Products");
    }
  };
  const getIssueBusinessUnit = async () => {
    const issueusinessUnitResponse = await getIssueingBusinessUnit();
    setIssueBusinessUnitData(issueusinessUnitResponse);
    setCreateStClientId(issueusinessUnitResponse[0].cs_client_id);
  };

  const getReceivingBusinessUnit = async () => {
    const receivingBusinessUnitResponse = await getReceivingBusinessUnits();
    setReceivingBusinessUnitData(receivingBusinessUnitResponse);
  };

  const getIssueType =  async () =>{
    const response = await getIssueTypeData()
    setIssueTypeData(response)
  }

  const getRemarks = async () => {
    const remarksResponse = await getRemarksList();
    setRemarksList(remarksResponse);
  };
  const onSelectBusinessUnit = (e, data) => {
    setBunitId(data.data.cs_bunit_id);
    setBusinessUnitName(data.data.bunit_name);
    setCwrWareHouseIdForIssueBU(data.data.recordid);
    setDoctypeId(data.data.cs_stidoctype_id);
  };
  const onSelectReceivingBunit = (e, data) => {
    setReceivingBunitId(data.data.cs_bunit_id)
    setCwrWareHouseIdForRecevingBU(data.data.recordid);
    setTimeout(() => {
      handleMenuClick();
    }, 300);
  };
  const handleMenuClick = () => {
    const authHeaders = getOAuthHeaders();
    if (authHeaders && authHeaders.email && authHeaders.access_token) {
    const formFieldsData = headerform.getFieldsValue(true);

    let issueBUnit = formFieldsData.issuebusinessunit;
    let receiveBunit = formFieldsData.receivingbusinessunit;
    if (issueBUnit === receiveBunit) {
      message.error("Issue Location shouldn’t be same as Receiving Location");
      headerform.resetFields(['receivingbusinessunit'])
    } else {
      setLoading(true);
      const getStorageBinId = {
        query: `query {
            comboFill(tableName:"m_storagebin", pkName:"m_storagebin_id",
            identifier:"m_storagebin_id, m_warehouse_id, name, defaultbin"
            whereClause: "m_warehouse_id = '${cwrWareHouseIdForIssueBU}' and defaultbin = 'Y'")
            }`,
      };
      Axios({
        url: genericUrl,
        method: "POST",
        data: getStorageBinId,
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${authHeaders.access_token}`,
        },
      }).then((response) => {
        const storageBinId = JSON.parse(response.data.data.comboFill);
        const getProductByStock = {
          query: `query {
getProductsByStock (storageBinId : "${storageBinId[0]["m_storagebin_id"]}", 
  productId : null, 
  searchKey : null, 
  name : null,
    upc : null) {
    bUnitId
    bunitName
    warehouseId
    warehouseName
    storageBinId
    storateBinName
    products {
      productId
      productIdName
      batchedProduct
      searchKey
      upc
      uomId
      uomIdName
      totalOnHandQty
      batches {
        startDate
        endDate
        productBatchId
        qtyOnHand
        batchNo
        createdDate
      }
          }
      }
      }`,
        };
        Axios({
          url: serverUrl,
          method: "POST",
          data: getProductByStock,
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${authHeaders.access_token}`,
          },
        }).then((response) => {
          setStorageBinId(storageBinId[0]["m_storagebin_id"]);
          if (response.status === 200) {
            const productList = response.data.data.getProductsByStock[0].products;
            for (let index = 0; index < productList.length; index++) {
              const uniqueId = uuid().replace(/-/g, "").toUpperCase();
              productList[index].key = uniqueId;
            }
            setProductData(productList);
            setLoading(false);
          }
        });
      });
    }
  }
  };

  // =====================>

  const batchModalClose = () => {
    setBatchModalVisible(false);
  };

  const addBatch = () => {
    const newData = selectedProductObject;
    form.validateFields(["batchNo", "mfg_date", "expiry_date", "qtycount"], (err, values) => {
      if (values === true) {
        const batchNo = values.batchNo;
        const mfgDate = moment(values.mfg_date).format("YYYY-MM-DD");
        const expDate = moment(values.expiry_date).format("YYYY-MM-DD");
        const issueQty = values.issueQty;
        newData[0].batchNo = batchNo;
        newData[0].mfg_date = mfgDate;
        newData[0].expiry_date = expDate;
        newData[0].issueQty = issueQty;
        newData[0].productBatchId = selectedProductObject.productBatchId;
      }
    });
    setBatchModalVisible(false);
  };

  const batchedDataList = batchedData.map((data) => (
    <Option key={data.productBatchId} title={data.batchNo} value={data.batchNo} childdata={data}>
      {data.batchNo}
    </Option>
  ));

  const onChangeBatch = (e, data) => {
    setBatch(e);
    // setProductBatch(data.props.childdata);
    const data2 = data.props.childdata;
    const selectedMProductId = selectedProductObject.productId;
    const selectedCsUomId = selectedProductObject.uomId;

    if (e.length > 0) {
      selectedProductObject.mfg_date = moment(data2.startDate).format("YYYY-MM-DD") === "Invalid date" ? null : moment(data2.startDate).format("YYYY-MM-DD");
      selectedProductObject.expiry_date = moment(data2.endDate).format("YYYY-MM-DD") === "Invalid date" ? null : moment(data2.endDate).format("YYYY-MM-DD");
      selectedProductObject.productBatchId = data.childdata.productBatchId;
      selectedProductObject.batchNo = data.value
      const index = productData.findIndex((element) => {
        return element.productId === selectedMProductId && element.uomId === selectedCsUomId;
      });
      const newArray = [];
      if (index >= 0) {
        productData.splice(index, 1);
      }
      for (let index = 0; index < productData.length; index++) {
        newArray.push(productData[index]);
      }
      newArray.unshift(selectedProductObject);
      setProductData([]);
      setTimeout(() => {
        setProductData(newArray);
      }, 5);
    }
    const date1 = moment(data2.startDate).format("YYYY-MM-DD");
    const date2 = moment(data2.endDate).format("YYYY-MM-DD");
    form.setFieldsValue({
      mfg_date: moment(date1) === "Invalid date" ? null : moment(date1),
      expiry_date: moment(date2) === "Invalid date" ? null : moment(date2),
    });
  };

  const getDateChange = (date, dateString) => {
    setSelectedDate(dateString);
    summaryForm.setFieldsValue({
      summreceiptdate: moment(dateString, dateFormat),
    });
  };
  const onChangeRadio = (e) => {
    setRadioValue(e.target.value);
    setAutoFocusValue(true);
  };
  const rowSelectedProduct = (data) => {
    setSelectedProductObject(data);
    setBatch("");
    form.resetFields(["Value", "Name", "UoM", "totalOnHandQty", "qtycount", "batchNo", "mfg_date", "expiry_date"]);
    let creatdDate = data.mfg_date === null || data.mfg_date === undefined ? null : moment(data.mfg_date).format("YYYY-MM-DD");
    let endDate = data.expiry_date === null || data.expiry_date === undefined ? null : moment(data.expiry_date).format("YYYY-MM-DD");
    form.setFieldsValue({
      skuValue: data.searchKey,
      productName: data.productIdName,
      uomName: data.uomIdName,
      totalOnHandQty: data.totalOnHandQty,
      qtycount: data.qtycount,
      batchNo: data.batchNo,
      mfg_date: creatdDate === null ? null : moment(creatdDate),
      expiry_date: endDate === null ? null : moment(endDate),
    });
    const selectedRows = [];
    selectedRows.push(data);
    if (selectedRows.length > 0) {
      setBatchedData(selectedRows[0].batches);
    }
    const flag = data.batchedProduct === "N" ? false : true
    setDateVisible(flag)
    // if (selectedRows[0].key === data.key) {
    //   data.mfg_date = creatdDate === null ? null : moment(creatdDate);
    //   data.expiry_date = endDate === null ? null : moment(endDate);
    //   data.productBatchId = productData.productBatchId
    // }
  };

  const scanUpcOrSku = (event) => {
    setBatchedData([]);
    form.resetFields(["qtycount", "batchNo"]);
    form.setFieldsValue({ mfg_date: "", expiry_date: "" });
    const code = event.keyCode || event.which;
    const upcVal = event.target.value;
    if (code === 13) {
      skuupcform.resetFields(["UPC-SKU"]);
      let upcOrSku;
      if (radioValue === 1) {
        upcOrSku = "upc";
      } else {
        upcOrSku = "searchKey";
      }
      let index;
      if (upcOrSku === "upc") {
        index = productData.findIndex((element) => {
          return element.upc === upcVal;
        });
      } else {
        index = productData.findIndex((element) => {
          return element.searchKey === upcVal;
        });
      }
      if (index >= 0) {
      } else {
        message.error("Product not found");
      }
      let arrayforForm = {};
      let newArray = [];
      let deleteKey;
      for (let index = 0; index < productData.length; index++) {
        const searchKey = productData[index].searchKey;
        const upc = productData[index].upc;
        if (upcOrSku === "upc" ? upcVal === upc : upcVal === searchKey) {
          const isBatchedFlag = productData[index].batchedProduct;
          if (isBatchedFlag === "Y") {
            setBatchedData(productData[index].batches);
            setBatchModalVisible(true);
            // setDateEditable(false);
          } else {
            setBatchModalVisible(false);
          }
          productData[index].qtycount =
            productData[index].qtycount === undefined || productData[index].qtycount === "" || productData[index].qtycount === 0 ? 1 : parseInt(productData[index].qtycount) + 1;
          arrayforForm = productData[index];
          deleteKey = productData[index].key;
        }
        newArray.push(productData[index]);
      }
      form.setFieldsValue({
        skuValue: arrayforForm.searchKey,
        productName: arrayforForm.productIdName,
        uomName: arrayforForm.uomIdName,
        totalOnHandQty: arrayforForm.totalOnHandQty,
        qtycount: arrayforForm.qtycount,
        batchNo:arrayforForm.batchNo,
        mfg_date:arrayforForm.mfg_date === null || arrayforForm.mfg_date === undefined ? null : moment(arrayforForm.mfg_date),
        expiry_date:arrayforForm.expiry_date === null || arrayforForm.expiry_date === undefined ? null : moment(arrayforForm.expiry_date),
      });
      newArray.forEach(function (item, i) {
        if (item.key === deleteKey) {
          newArray.splice(i, 1);
          newArray.unshift(item);
        }
      });
      setProductData([]);
      setSelectedProductObject(arrayforForm);
      setProductData(newArray);
    }
    setBatch("");
  };

  const readFileData = (evt) => {
    const { files } = evt.target;
    const filename = files[0].name;
    const fileExt = filename.substr(filename.lastIndexOf("."), filename.length);
    if (fileExt !== ".csv") {
      message.error("Please select csv file");
    } else {
      const file = files[0];
      const reader = new FileReader();
      let fileTextData;
      reader.onload = (e) => {
        fileTextData = e.target.result;
        const rows = fileTextData.split(/\r?\n/);
        var dataArr = [];
        for (var i = 1; i < rows.length - 1; i++) {
          var cells = rows[i].split(",");
          if (cells.length === 2) {
            dataArr.push({
              sku: cells[0],
              qtycount: cells[1],
            });
          }
        }
        if (dataArr.length > 0) {
          const newData = dataArr;

          const matchedArray = [];
          const unmatchedArray = [];
          const unmatchedImportSkuArray = [];
          for (let index2 = 0; index2 < productData.length; index2++) {
            let boolean = true;
            const productSku = productData[index2].searchKey;
            for (let index3 = 0; index3 < newData.length; index3++) {
              const importSku = newData[index3].sku;
              if (productSku === importSku) {
                productData[index2].qtycount =
                  newData[index3].qtycount === undefined || newData[index3].qtycount === null || newData[index3].qtycount === "" ? null : parseInt(newData[index3].qtycount);
                matchedArray.push(productData[index2]);
                boolean = false;
              }
            }
            if (boolean) {
              unmatchedArray.push(productData[index2]);
            }
          }

          for (let index3 = 0; index3 < newData.length; index3++) {
            let boolean = true;
            const importSku = newData[index3].sku;
            for (let index2 = 0; index2 < productData.length; index2++) {
              const productSku = productData[index2].searchKey;
              if (productSku === importSku) {
                boolean = false;
              }
            }
            if (boolean) {
              unmatchedImportSkuArray.push(newData[index3].sku);
            }
          }
          message.success(`${matchedArray.length} products imported ...`);
          const finalDataArray = [...matchedArray, ...unmatchedArray];
          setProductData([]);
          setProductData(finalDataArray);
          if (unmatchedImportSkuArray.length > 0) {
            setTimeout(() => {
              Modal.error({
                title: "Products not found !",
                content: `${unmatchedImportSkuArray}`,
                closable: true,
                footer: null,
                icon: null,
              });
            }, 100);
          }
          setLoading(false);
          document.getElementById("choosefile").value = null;
        } else {
          message.error("Please import the file in required format.");
          document.getElementById("choosefile").value = null;
          setLoading(false);
        }
      };
      reader.readAsText(file);
    }
  };

  const callbackTabs = (key) => {
    setTabKey(key);
    summaryForm.setFieldsValue({
      summbusinessunit: businessUnitName,
      summreceiptdate: moment(selectedDate, dateFormat),
    });
    const newArray = [];
    for (let index = 0; index < productData.length; index++) {
      const element = parseFloat(productData[index].qtycount);
      if (element > 0) {
        newArray.push(productData[index]);
      }
    }
    setInventoryCountSummaryData(newArray);
  };
  const OnChangeOrderQty = () => {
    const formFieldsData = form.getFieldsValue(true);
    const mfg_date = formFieldsData.mfg_date === null ? null : moment(formFieldsData.mfg_date).format("YYYY-MM-DD");
    const expiry_date = formFieldsData.expiry_date === null ? null : moment(formFieldsData.expiry_date).format("YYYY-MM-DD");
    const qtycount = parseFloat(formFieldsData.qtycount);
    const totalOnHandQty = parseFloat(formFieldsData.totalOnHandQty);
    const selectedMProductId = selectedProductObject.productId;
    const selectedCsUomId = selectedProductObject.uomId;

    if (qtycount > totalOnHandQty) {
      form.setFieldsValue({ qtycount: totalOnHandQty });
      message.error("Issue qty shouldn’t be greater than onHand qty");
      selectedProductObject.qtycount = totalOnHandQty;
      const index = productData.findIndex((element) => {
        return element.productId === selectedMProductId && element.uomId === selectedCsUomId;
      });
      const newArray = [];
      if (index >= 0) {
        productData.splice(index, 1);
      }
      for (let index = 0; index < productData.length; index++) {
        newArray.push(productData[index]);
      }
      newArray.unshift(selectedProductObject);
      // setProductData([]);
      // setProductData(newArray);
      setTimeout(() => {
        setProductData([]);
        setProductData(newArray);
      }, 1);
    } else {
      selectedProductObject.qtycount = qtycount;
      selectedProductObject.mfg_date = mfg_date;
      selectedProductObject.expiry_date = expiry_date;
      // selectedProductObject.productBatchId = productData.productBatchId;
      const index = productData.findIndex((element) => {
        return element.productId === selectedMProductId && element.uomId === selectedCsUomId;
      });
      const newArray = [];
      if (index >= 0) {
        productData.splice(index, 1);
      }

      for (let index = 0; index < productData.length; index++) {
        newArray.push(productData[index]);
      }
      newArray.unshift(selectedProductObject);
      // setProductData([]);
      // setProductData(newArray);
      setTimeout(() => {
        setProductData([]);
        setProductData(newArray);
      }, 1);
    }
  };

  const createSTissue = () => {
    const authHeaders = getOAuthHeaders();
    if (authHeaders && authHeaders.email && authHeaders.access_token) {
    let usersData = JSON.parse(localStorage.getItem("userData"));
    const userId = usersData.user_id;
    const formFieldsData = summaryForm.getFieldsValue(true);
    const remarksList = formFieldsData.remarkslist;
    if (remarksList === undefined || remarksList === null) {
      message.error("Please Select Remark");
    } else {
      setLoading(true);
      let currentIssueDate = moment(selectedDate).format("YYYY-MM-DD");
      const toGetMWarehouseData = {
        query: `query {
comboFill(tableName:"m_warehouse", pkName:"m_warehouse_id",
identifier:"m_warehouse_id, cs_bunit_id, value, name, capacity, intransit", 
whereClause: "coalesce(intransit, 'Y') = 'Y'")
}`,
      };
      Axios({
        url: genericUrl,
        method: "POST",
        data: toGetMWarehouseData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${authHeaders.access_token}`,
        },
      }).then((response) => {
        const getWarehouseData = JSON.parse(response.data.data.comboFill);
        const toGetMWarehouseId = {
          query: `query {
  comboFill(tableName:"m_storagebin", pkName:"m_storagebin_id",
identifier:"m_storagebin_id, m_warehouse_id, name, defaultbin"
whereClause: "m_warehouse_id = '${getWarehouseData[0].m_warehouse_id}' and defaultbin = 'Y'")
}`,
        };
        Axios({
          url: genericUrl,
          method: "POST",
          data: toGetMWarehouseId,
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${authHeaders.access_token}`,
          },
        }).then((response) => {
          const toStorageBinData = JSON.parse(response.data.data.comboFill);
          let useToSToargeBin = toStorageBinData[0].m_storagebin_id;
          let productID = "";
          let uomID = "";
          let issueQty = "";
          let productBatchId = "";
          const arrayForMutation = [];
          for (let index = 0; index < inventoryCountSummaryData.length; index++) {
            productID = inventoryCountSummaryData[index].productId;
            uomID = inventoryCountSummaryData[index].uomId;
            issueQty = inventoryCountSummaryData[index].qtycount;
            productBatchId = inventoryCountSummaryData[index].productBatchId;
            arrayForMutation.push(
              `{
          mProductID : "${productID}"
          csUomId : "${uomID}"
          qtyIssued : ${issueQty}
          toStorageBin:"${useToSToargeBin}",
          productBatch:${productBatchId === undefined || productBatchId === null || productBatchId === "" ? null : `"${productBatchId}"`}
          }`
            );
          }

          // doctypeId
          let docytypeId2;
          if(selectedIssueType.csDocTypeId !== null || selectedIssueType.csDocTypeId !== undefined){
            docytypeId2 = selectedIssueType.csDocTypeId
          }else if (doctypeId !== "" || doctypeId !== null || doctypeId !== undefined){
            docytypeId2 = doctypeId
          }else{
            docytypeId2 = null
          }

          const createSTIssue = {
            query: `mutation{
  createSTissue(issue:
  {   cSClientID:"${createStClientId}",
      cSBunitID:"${bunitId}",
      createdby:"${userId}",
      csDoctypeId:${docytypeId2 === undefined || docytypeId2 === null ? null : `"${docytypeId2}"`},
      warehouseId:"${cwrWareHouseIdForIssueBU}",
      receiptWarehouseId:"${cwrWareHouseIdForRecevingBU}",
      storagebinId:"${storageBinId}",
      issueDate:"${currentIssueDate}",
      description:null,
      remarks:${remarksList === undefined || remarksList === null || remarksList === "" ? null : `"${remarksList}"`},
      stockTransferReceipt:null
      lines:[${arrayForMutation}]
  })
  {
      type
      message
      mTransferissueID
      documentno
      cSClientID
      cSBunitID
      warehouseId
      receiptWarehouseId
      storagebinId
      description
      remarks
  }
}`,
          };
          Axios({
            url: serverUrl,
            method: "POST",
            data: createSTIssue,
            headers: {
              "Content-Type": "application/json",
              Authorization: `bearer ${authHeaders.access_token}`,
            },
          }).then((response) => {
            if (response.status === 200) {
              let mTransferissueID = response.data.data.createSTissue.mTransferissueID;
              let messageToDisplay = response.data.data.createSTissue.message;
              let displayDocNo = response.data.data.createSTissue.documentno;
              const processSTIssue = {
                query: `mutation {processStransferIssue(process:{
        cSClientID:"${createStClientId}",
        createdby : "${userId}",
        cSBunitID : "${receivingBunitId}",
        mTransferissueID:"${mTransferissueID}"
        autoReceive:"${selectedIssueType.autoReceive}"
        })
        {
            
                message
            stockTransferReceipt
        }
    }`,
              };
              Axios({
                url: serverUrl,
                method: "POST",
                data: processSTIssue,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `bearer ${authHeaders.access_token}`,
                },
              }).then((response) => {
                if (response.status === 200) {
                  setProductData([]);
                  setInventoryCountSummaryData([]);
                  setInventorySummaryReviewVisible(false);
                  setLoading(false);
                  setBusinessUnitName("");
                  setSelectedIssueType({})
                  form.resetFields();
                  headerform.resetFields(["issuebusinessunit", "receivingbusinessunit","stockIssueType"]);
                  summaryForm.resetFields(["summbusinessunit", "remarkslist"]);
                  getPrintCofirmation(mTransferissueID, messageToDisplay, displayDocNo);
                }
              });
            }
          });
        });
      });
    }
  }
  };

  const getPrintCofirmation = (recordId, messageForSuccess, displayDocNo) => {
    Modal.confirm({
      title: messageForSuccess + ":" + displayDocNo,
      content: "Do you want take Printout",
      okText: "Yes",
      cancelText: "No",
      icon:null,
      onOk() {
        getPrintPdffile(recordId);
      },
      onCancel() {
        setInventorySummaryReviewVisible(false);
        setProductData([]);
      },
    });
  };

  const getPrintPdffile = (recordId) => {
    const authHeaders = getOAuthHeaders();
    if (authHeaders && authHeaders.email && authHeaders.access_token) {
    const RoleId = window.localStorage.getItem("userData");
    const getPrintPdfData = {
      query: `query {reportTemplate(ad_tab_id:"27B699CCCB404265BFCCA9470C4BFD1F",recordId:"${recordId}")}`,
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
        message.error("Error");
      } else {
        getPrintCommand(response.data.data.reportTemplate);
      }
    });
  }
  };

  const getPrintCommand = (fileName) => {
    setProductData([]);
    setInventorySummaryReviewVisible(false);
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

  const closeSummaryReview = () => {
    setInventorySummaryReviewVisible(false);
  };

  const tableColumns = [
    {
      title: "",
      dataIndex: "",
      width: 30,
      render: (text, row) => (
        <span
          style={{ cursor: "pointer" }}
          role="presentation"
          onClick={() => {
            rowSelectedProduct(text);
          }}
        >
          <EditOutlined />
        </span>
      ),
    },
    {
      title: "SKU",
      dataIndex: "searchKey",
      width: 80,
    },
    {
      title: "Product Name",
      dataIndex: "productIdName",
      width: 150,
    },
    {
      title: "UOM",
      dataIndex: "uomIdName",
      width: 80,
    },
    {
      title: "OnHand Qty",
      dataIndex: "totalOnHandQty",
      width: 80,
    },
    {
      title: "Issue Qty",
      dataIndex: "qtycount",
      width: 120,
    },
    {
      title: "Batch No",
      dataIndex: "batchNo",
      width: 120,
    },
    {
      title: "Mfg Date",
      dataIndex: "mfg_date",
      width: 120,
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry_date",
      width: 120,
    },
  ];

  const downloadImportTemplate = () => {
    const options = {
      fieldSeparator: ",",
      filename: "StockTransferIssueImport",
      // quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      headers: ["Sku", "Count"],
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv([{ Sku: "", Count: "" }]);
  };

  let totalQuantity = 0;
  let totalQuantity1;
  for (let index = 0; index < inventoryCountSummaryData.length; index++) {
    totalQuantity1 = inventoryCountSummaryData[index].qtycount;
    const integer = parseFloat(totalQuantity1, 10);
    totalQuantity += integer;
  }

  const summaryDiv = (
    <Card>
      <Form layout="vertical" form={summaryForm} name="summaryForm" onFinish={onFinish}>
        <Row gutter={16}>
          <Col className="gutter-row" span={8}>
            <Form.Item name="summbusinessunit" label="Business Unit">
              <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item name="summreceiptdate" label="Date">
              <DatePicker style={{ width: "100%", borderLeft: "none", borderTop: "none", borderRight: "none" }} onChange={getDateChange} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item
              name="remarkslist"
              label="Remarks"
              rules={[
                {
                  required: true,
                  message: "Please select remarks",
                },
              ]}
            >
              <Select allowClear showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onFocus={getRemarks}>
                {remarkslist.map((data, index) => (
                  <Option key={data.id} value={data.id} title={data.name}>
                    {data.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row>
        <p />
        <br />
      </Row>
      <Row>
        <Table
          columns={tableColumns}
          dataSource={inventoryCountSummaryData}
          style={{ fontSize: "12px" }}
          size="small"
          sticky={true}
          scroll={{ y: "40vh", x: "100%" }}
          pagination={false}
        />
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <h4>No. of Products: {inventoryCountSummaryData.length}</h4>
        </Col>
        <Col className="gutter-row" span={6} />
        <Col className="gutter-row" span={6} />
        <Col className="gutter-row" span={6}>
          <h4>Total Qty: {totalQuantity}</h4>
        </Col>
      </Row>
    </Card>
  );

  const cancelBatch = () =>{
    setBatchModalVisible(false)
  }
  const onSelectIssueType = (e,data) =>{
    setSelectedIssueType(data.data)
  }
  return (
    <div>
      <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
        <div>
          <Row>
            <Col span={12}>
              <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>New Stock Transfer Issue</h2>
            </Col>
            <Col span={12}>
              <span style={{ float: "right" }}>
                <Button onClick={inventorySummaryReview} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }}>
                  Review
                </Button>
              </span>
            </Col>
          </Row>
          <Card style={{ marginBottom: "8px" }}>
            <Form layout="vertical" form={headerform} name="control-hooks" onFinish={onFinish}>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="issuebusinessunit" label="Issue Location" style={{ marginBottom: "8px" }}>
                    <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onFocus={getIssueBusinessUnit}
                      onSelect={onSelectBusinessUnit}
                    >
                      {issueBusinessUnitData.map((data, index) => (
                        <Option key={data.recordid} title={data.name} data={data}>
                          {data.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="receivingbusinessunit" label="Receiving Location" style={{ marginBottom: "8px" }}>
                    <Select
                      onFocus={getReceivingBusinessUnit}
                      onSelect={onSelectReceivingBunit}
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {receivingBusinessUnitData.map((data, index) => (
                        <Option key={data.recordid} title={data.name} data={data}>
                          {data.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="date" label="Date" style={{ marginBottom: "8px" }}>
                    <DatePicker style={{ width: "100%" }} onChange={getDateChange} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="stockIssueType" label="Stock Issue Type" style={{ marginBottom: "8px" }}>
                    <Select
                      onFocus={getIssueType}
                      onSelect={onSelectIssueType}
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {issueTypeData.map((data, index) => (
                        <Option key={data.mIssueTypeId} title={data.name} data={data}>
                          {data.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <Radio.Group onChange={onChangeRadio} value={appConfig.upc === "Y" ? radioValue : 2}>
                {appConfig.upc === "Y" ? <Radio value={1}>UPC</Radio> : ''}
                {appConfig.sku === "Y" ? <Radio value={2}>SKU</Radio> : ''}
                </Radio.Group>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form layout="vertical" form={skuupcform} name="control-hooks1" onFinish={onFinish}  style={{display: appConfig.sku === "N" && appConfig.upc === "N" ? '' : 'none'}}>
                  <Form.Item name="UPC-SKU" label="" style={{ marginBottom: "0" }}>
                    <Input placeholder="Scan UPC/SKU" autoFocus={AutoFocusValue} onKeyPress={scanUpcOrSku} suffix={<img alt="img" src={barcodeImage} />} />
                  </Form.Item>
                </Form>
              </Col>
              <Col className="gutter-row" span={12}>
                {appConfig.downloadTemplate === "Y" ?  <span style={{ float: "right" }}>
                  <Tooltip placement="top" title={"Download Template"}>
                    <Button size="small" onClick={downloadImportTemplate}>
                      <DownloadOutlined />
                    </Button>
                  </Tooltip>
                  &nbsp;&nbsp;
                  <input id="choosefile" type="file" accept=".csv" onChange={readFileData} />
                </span> : null}
              </Col>
            </Row>
          </div>
          <div>
            <Tabs defaultActiveKey={tabKey} onChange={callbackTabs} type="card" tabBarStyle={{ marginBottom: "0px" }}>
              <TabPane tab="Products" key="10">
                <Card style={{ marginBottom: "8px" }}>
                  <Form layout="vertical" form={form} name="editable-form" onFinish={onFinish}>
                    <Row gutter={16}>
                      {appConfig.sku === "Y" ? <Col className="gutter-row" span={4}>
                        <Form.Item name="skuValue" label="SKU" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col> : ""}
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="productName" label="Name" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="uomName" label="UOM" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col>
                      {appConfig.qtyonhand === "Y" ?<Col className="gutter-row" span={4}>
                        <Form.Item name="totalOnHandQty" label="OnHand Qty" style={{ marginBottom: "8px" }}>
                          <Input />
                        </Form.Item>
                      </Col>  : null}
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="qtycount" label="Issue Qty" style={{ marginBottom: "8px" }} rules={[{ required: true, message: "enter issue qty" }]}>
                          <Input onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col>
                      {appConfig.batchNo === "Y" ? <Col className="gutter-row" span={4}>
                        <Form.Item name="batchNo" label="Batch No" style={{ marginBottom: "8px" }}>
                          <Select
                          disabled={appConfig.batchno === "Y" ? false : true}
                            dropdownMatchSelectWidth={false}
                            showSearch
                            filterOption={(input, option) => (option.props.children !== null ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : "")}
                            dropdownStyle={{ width: "10%" }}
                            onChange={onChangeBatch}
                            value={batch}
                          >
                            {batchedDataList}
                          </Select>
                        </Form.Item>
                      </Col> : ""}
                      {appConfig.mfgdate === "Y" ? <Col className="gutter-row" span={4}>
                        <Form.Item  name="mfg_date" label="Mfg Date" style={{ marginBottom: "8px" }}>
                          <DatePicker disabled={appConfig.mfgdate === "Y" ? false : dateVisible} style={{ border: "none", background: "rgb(241 243 247 / 68%)", color: "black" }} />
                        </Form.Item>
                      </Col> : ""}
                      {appConfig.expirydate === "Y" ?<Col className="gutter-row" span={4}>
                        <Form.Item  name="expiry_date" label="Expiry Date" style={{ marginBottom: "8px" }}>
                          <DatePicker disabled={appConfig.expirydate === "Y" ? false : dateVisible} style={{ border: "none", background: "rgb(241 243 247 / 68%)", color: "black" }} />
                        </Form.Item>
                      </Col> : ""}
                    </Row>
                  </Form>
                </Card>
                <Card>
                  <Table
                    rowClassName={(record, index) => (record.key === selectedProductObject.key ? "table-row-dark" : "table-row-light")}
                    columns={tableColumns}
                    dataSource={productData}
                    style={{ fontSize: "12px" }}
                    size="small"
                    sticky={true}
                    scroll={{ y: "37.5vh", x: "100%" }}
                    pagination={false}
                  />
                </Card>
              </TabPane>
              <TabPane tab="Summary" key="13">
                {summaryDiv}
              </TabPane>
            </Tabs>
          </div>
        </div>
        <div>
          <Modal
            visible={inventorySummaryReviewVisible}
            closable={null}
            centered
            width="80%"
            footer={[
              <Button key="back" onClick={closeSummaryReview}>
                Preview
              </Button>,
              <Button loading={loading} htmlType="submit" onClick={createSTissue}>
                Confirm
              </Button>,
            ]}
          >
            <h3 style={{ textAlign: "center" }}>Stock Transfer Issue Summary</h3>
            <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
              {summaryDiv}
            </Spin>
          </Modal>
        </div>
      </Spin>
      <Modal
        visible={batchModalVisible}
        closable={true}
        onCancel={batchModalClose}
        title="Batch Details"
        centered
        width="70%"
        bodyStyle={{ padding: "0px", borderRadius: "5px" }}
        footer={[
          <Button loading={loading} htmlType="submit" onClick={cancelBatch}>
            Cancel
          </Button>,
          <Button loading={loading} htmlType="submit" onClick={addBatch}>
            Add
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form} name="editable-form" onFinish={onFinish}>
          <Row gutter={16}>
            <Col className="gutter-row" span={6}>
              <Form.Item name="batchNo" label="Batch No" style={{ padding: "12px", paddingBottom: "0px" }}>
                <Select
                  dropdownMatchSelectWidth={false}
                  showSearch
                  filterOption={(input, option) => (option.props.children !== null ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : "")}
                  dropdownStyle={{ width: "10%" }}
                  onChange={onChangeBatch}
                  value={batch}
                >
                  {batchedDataList}
                </Select>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item name="mfg_date" label="Mfg Date" style={{ padding: "12px", paddingBottom: "0px" }}>
                <DatePicker style={{width:'100%'}} disabled  onChange={OnChangeOrderQty} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item name="expiry_date"  label="Expiry Date" style={{ padding: "12px", paddingBottom: "0px" }}>
                <DatePicker style={{width:'100%'}} disabled onChange={OnChangeOrderQty} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item name="qtycount" label="Issue Qty" style={{ padding: "12px", paddingBottom: "0px" }} rules={[{ required: true, message: "enter issue qty" }]}>
                <Input onChange={OnChangeOrderQty} />
              </Form.Item>
            </Col>
          </Row>
          <br />
        </Form>
      </Modal>
    </div>
  );
};

export default StIssue;
