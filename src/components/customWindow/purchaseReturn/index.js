import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Select, Tabs, Input, Radio, Spin, Modal, Tooltip, DatePicker, message, Table, Collapse } from "antd";
import { LoadingOutlined, CaretRightOutlined, DownloadOutlined } from "@ant-design/icons";
import { ExportToCsv } from "export-to-csv";
import { v4 as uuid } from "uuid";
import moment from "moment";
import Axios from "axios";
import { getOAuthHeaders } from "../../../constants/oAuthValidation";
import { getSupplierData, getSupplierAddress } from "../../../services/generic";
import { getDeliveryLocation, getGRNdocs, getGRNLineProducts, getRoleBusinessUnit, getReturnReasons,getAppSetupData } from "../../../services/custom";
import MainTable from "./MainTable";
import summaryTableColumns from "./summaryCols";
import barcodeImage from "../../../assets/images/barcode.svg";
// import { serverUrl, genericUrl, fileDownloadUrl } from "../../../constants/serverConfig";
import "antd/dist/antd.css";
import "../../../styles/antd.css";

const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const dateFormat = "YYYY-MM-DD";

const PurchaseReturns = (props) => {
  const [bunitData, setBunitData] = useState([]);
  const [bunitId, setBunitId] = useState("");
  const [businessUnitName, setBusinessUnitName] = useState("");
  const serverUrl = process.env.REACT_APP_serverUrl;
  const genericUrl = process.env.REACT_APP_genericUrl;
  const fileDownloadUrl = process.env.REACT_APP_fileDownloadUrl;
  const [supplierData, setSupplierData] = useState([]);
  const [currentDate, setCurrentdate] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [priceListId, setPriceListId] = useState("");
  const [istaxincludedFlag, setIstaxincludedFlag] = useState("");
  const [regionName, setRegionName] = useState("");
  const [deliveryLocationName, setDeliveryLocationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState([]);
  const [selectedProductObject, setSelectedProductObject] = useState({});
  const [supplierAddressName, setSupplierAddressName] = useState("");
  const [supplierAddressId, setSupplierAddressId] = useState("");
  
  const [scheduledDate, setScheduledDate] = useState("");
  const [poSummaryData, setPoSummaryData] = useState([]);
  const [poSummaryVisible, setPoSummaryVisible] = useState(false);
  const [tabKey, setTabKey] = useState("10");
 
  const [PoDocsData, setPoDocsData] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [radioValue, setRadioValue] = useState(1);
  const [returnReasonsData, setReturnReasonsData] = useState([]);
  const [returnReasonId, setreturnReasonId] = useState(null);
  const [receiptid,setreceiptid] = useState(null)
  const [appConfig, setAppConfig] = useState({});

  const [form] = Form.useForm();
  const [headerform] = Form.useForm();
  const [summaryForm] = Form.useForm();
  const [importform] = Form.useForm();
  const [skuform] = Form.useForm();

  useEffect(() => {
    getBusinessUnit();
    getAppSetup()
  }, []);

  const getAppSetup = async () => {
    const val = "PR";
    const response = await getAppSetupData(val);
    setAppConfig(JSON.parse(response[0].configJson));
    }

  const getBusinessUnit = async () => {
    const userData = JSON.parse(window.localStorage.getItem("userData"));
    const businessUnitResponse = await getRoleBusinessUnit(userData.user_id);
    headerform.setFieldsValue({
      businessUnit: businessUnitResponse.bUnitName,
    });
    setBunitId(businessUnitResponse.defaultCsBunitId);
    setBunitData(businessUnitResponse.userBunit);
    const date = new Date();
    const minDate = date.toISOString().slice(0, 10);
    setBusinessUnitName(businessUnitResponse.bUnitName);
    setCurrentdate(minDate);
    setScheduledDate(minDate);
    getDeliverLocation(businessUnitResponse.defaultCsBunitId);
  };

  const getSuppliers = async () => {
    const supplierResponse = await getSupplierData();
    setSupplierData(supplierResponse);
  };

  const onSelectBusinessUnit = (e, data) => {
    const { title } = data.props;
    const date = new Date();
    const minDate = date.toISOString().slice(0, 10);
    setBunitId(e);
    setBusinessUnitName(title);
    setCurrentdate(minDate);
    setScheduledDate(minDate);
    getDeliverLocation(e);
  };

  const getDeliverLocation = async (e) => {
    const deliveryResponse = await getDeliveryLocation(e);
    setRegionName(deliveryResponse[0].bUnitLocationId);
    setDeliveryLocationName(deliveryResponse[0].fulladdress);
  };

  const onSelectSupplier = (e, data) => {
    const date = new Date();
    const minDate = date.toISOString().slice(0, 10);
    setSupplierId(e);
    setSupplierName(data.props.title);
    setCurrentdate(minDate);
    setPriceListId(data.props.pricelistid);
    setIstaxincludedFlag(data.props.istaxflag);
    onSelectDeliveryLocation(e);
  };

  const getGRN = async () => {
    const grnResponse = await getGRNdocs(supplierId, bunitId);
    setPoDocsData(grnResponse);
  };

  const onChangeRadio = (e) => {
    setRadioValue(e.target.value);
  };

  const onSelectDraftpo = async (e,data1) => {
    form.resetFields()
    setProductData([])
    setSelectedOrderId(data1.data.pOrderId);
    setreceiptid(data1.data.mReceiptId)
    setLoading(true);
    const data = await getGRNLineProducts(data1.data.mReceiptId);
    for (let index = 0; index < data.length; index++) {
      data[index].key = data[index].orderLineId;
      data[index].value = data[index].mProduct.value;
      data[index].skuName = data[index].mProduct.value + "-" + data[index].mProduct.name;
      data[index].productName = data[index].mProduct.name
      data[index].uomName = data[index].csuom.name
      data[index].unitPrice = data[index].unitprice
      data[index].orderedQty = data[index].receivedQty
      data[index].listPrice = data[index].listprice
      data[index].productId = data[index].mProduct.mProductId
      data[index].uomId = data[index].csuom.csUomId
      data[index].upc =  data[index].mProduct.upc
      data[index].mfg_date = data[index].startDate === null || data[index].startDate === undefined ? null: moment(data[index].startDate).format('YYYY-MM-DD')
      data[index].expiry_date = data[index].endDate === null || data[index].endDate === undefined ? null: moment(data[index].endDate).format('YYYY-MM-DD')
    }
    setProductData(data);
    setLoading(false);
  };

  const getReturnData = async () => {
    const userData = JSON.parse(window.localStorage.getItem("userData"));
    const data = await getReturnReasons(userData.cs_client_id);
    setReturnReasonsData(data);
  };

  const onTypeChange = (e) => {
    setreturnReasonId(e);
  };
  const onSelectDeliveryLocation = async (e) => {
    const supplierAddressResponse = await getSupplierAddress(e);
    setSupplierAddressName(supplierAddressResponse[0].name === undefined ? null : supplierAddressResponse[0].name);
    setSupplierAddressId(supplierAddressResponse[0].recordid);
  };

  const getSelectedRecord = (data) => {
    setSelectedProductObject(data);
    let sdate = data.startDate === null || data.startDate === undefined ? null: moment(data.startDate).format('YYYY-MM-DD')
    let edate = data.endDate === null || data.endDate === undefined ? null: moment(data.endDate).format('YYYY-MM-DD')
    form.setFieldsValue({
      skuValue: data.skuName,
      productCategoryName: data.productCategoryName,
      uomName: data.uomName,
      orderQty: data.orderedQty,
      returnQty: data.returnQty,
      unitPrice: data.unitPrice,
      taxName: data.taxRate.name,
      grossAmount: data.grossAmount,
      description: data.description,
      batchNo : data.batchNo,
      mfg_date : sdate === null ? null : moment(sdate),
      expiry_date : edate === null ? null :moment(edate),
    });
  };

  const onselectedProduct = (e, data) => {
    const data2 = data.data;
    getSelectedRecord(data2);
  };

  const onFinish = () => {};

  const downloadImportTemplate = () => {
    const options = {
      fieldSeparator: ",",
      filename: "returnQtyImportTemplate",
      // quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      headers: ["Sku", "ReturnQty"],
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv([{ Sku: "", ReturnQty: "" }]);
  };

  const scanUpcOrSku = (event) => {
    const code = event.keyCode || event.which;
    if (code === 13) {
      skuform.resetFields();
      form.resetFields();
      let upcOrSku;
      if (radioValue === 1) {
        upcOrSku = "upc";
      } else {
        upcOrSku = "sku";
      }
      const index = productData.findIndex((element) => {
        if (upcOrSku === "sku") {
          return element.value === event.target.value;
        } else {
          return element.upc === event.target.value;
        }
      });
      if (index >= 0) {
        let productIdToMatch;
        for (let index = 0; index < productData.length; index++) {
          let element;
          if (upcOrSku === "sku") {
            element = productData[index].value;
          } else {
            element = productData[index].upc;
          }
          if (element === event.target.value) {
            productIdToMatch = productData[index].productId;
            let returnQty =
              productData[index].returnQty === null || productData[index].returnQty === undefined || productData[index].returnQty === 0
                ? 1
                : parseInt(productData[index].returnQty) + 1;
            let gridGrossAmt;
            let istaxincluded = istaxincludedFlag;
            let netUnitPrice;
            let totalTax;
            let unitPrice2;
            if (istaxincluded === "Y") {
              const netUnitPrice1 = productData[index].unitPrice / (1 + productData[index].taxRate.rate / 100);
              const taxOnUnitPrice = (productData[index].taxRate.rate / 100) * netUnitPrice1;
              const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
              const gridGrossAmt1 = unitPrice1 * returnQty;
              const totalTax1 = gridGrossAmt1 - netUnitPrice1 * returnQty;

              netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
              unitPrice2 = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
              gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
              totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
            } else {
              const netUnitPrice1 = productData[index].unitPrice;
              const taxOnUnitPrice1 = (productData[index].taxRate.rate / 100) * netUnitPrice1;
              const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice1);
              const gridGrossAmt1 = unitPrice1 * returnQty;
              const totalTax1 = gridGrossAmt1 - netUnitPrice1 * returnQty;

              netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
              unitPrice2 = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
              gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
              totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
            }
            let sdate = productData[index].startDate === null || productData[index].startDate === undefined ? null: moment(productData[index].startDate).format('YYYY-MM-DD')
            let edate = productData[index].endDate === null || productData[index].endDate === undefined ? null: moment(productData[index].endDate).format('YYYY-MM-DD')
            form.setFieldsValue({
              skuValue: productData[index].skuName,
              productCategoryName: productData[index].productCategoryName,
              uomName: productData[index].uomName,
              orderQty: productData[index].orderedQty,
              returnQty: returnQty,
              unitPrice: productData[index].unitPrice,
              taxName: productData[index].taxRate.name,
              grossAmount: gridGrossAmt,
              description: productData[index].description,
              mfg_date: sdate === null ? null :moment(sdate),
              expiry_date: edate === null ? null :moment(edate),
            });
            const obj = {
              description: productData[index].description,
              key: productData[index].key,
              listPrice: productData[index].listPrice,
              orderLineId: productData[index].orderLineId,
              orderedQty: productData[index].orderedQty,
              productId: productData[index].productId,
              productName: productData[index].productName,
              productSearchKey: productData[index].productSearchKey,
              receivedqty: productData[index].receivedQty,
              skuName: productData[index].skuName,
              stockUomId: productData[index].stockUomId,
              stockUomIdName: productData[index].stockUomIdName,
              taxRate: productData[index].taxRate,
              unitPrice: productData[index].unitPrice,
              uomId: productData[index].uomId,
              uomName: productData[index].uomName,
              value: productData[index].value,
              grossAmount: gridGrossAmt,
              unitPrice2: unitPrice2,
              netUnitPrice: netUnitPrice,
              returnQty: returnQty,
              totalTax: totalTax,
              upc: productData[index].upc,
              salePrice: productData[index].salePrice,
              batchNo : productData[index].batchNo,
              mfg_date :sdate,
              expiry_date :edate,
              startDate:productData[index].startDate,
              endDate:productData[index].endDate,
              orderLineId:productData[index].orderLineId,
              receiptLineId:productData[index].receiptLineId 
            };
            setSelectedProductObject(obj);
            const newArray = [];
            for (let index1 = 0; index1 < productData.length; index1++) {
              const productIdFromArray = productData[index1].productId;
              if (productIdFromArray !== productIdToMatch) {
                newArray.push(productData[index1]);
              }
            }
            newArray.unshift(obj);
            setProductData(newArray);
          }
        }
      } else {
        message.error("Product not found!");
        skuform.resetFields();
      }
    }
  };

  const OnChangeOrderQty = () => {
    setTimeout(() => {
      const productObject = selectedProductObject;
      const formFieldsData = form.getFieldsValue(true);
      let description = formFieldsData.description;
      let returnQty = formFieldsData.returnQty === null || formFieldsData.returnQty === undefined ? 0 : formFieldsData.returnQty;
      let gridGrossAmt;
      let istaxincluded = istaxincludedFlag;
      let unitPrice2;
      let netUnitPrice;
      let totalTax;
      if (parseInt(returnQty) > parseInt(productObject.orderedQty)) {
        form.setFieldsValue({
          returnQty: productObject.orderedQty,
        });
      }
      if (istaxincluded === "Y") {
        const netUnitPrice1 = productObject.unitPrice / (1 + productObject.taxRate.rate / 100);
        const taxOnUnitPrice = (productObject.taxRate.rate / 100) * netUnitPrice1;
        const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
        const gridGrossAmt1 = unitPrice1 * returnQty;
        const totalTax1 = gridGrossAmt1 - netUnitPrice1 * returnQty;

        netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
        unitPrice2 = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
        gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
        totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
      } else {
        const netUnitPrice1 = productObject.unitPrice;
        const taxOnUnitPrice1 = (productObject.taxRate.rate / 100) * netUnitPrice1;
        const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice1);
        const gridGrossAmt1 = unitPrice1 * returnQty;
        const totalTax1 = gridGrossAmt1 - netUnitPrice1 * returnQty;

        netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
        unitPrice2 = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
        gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
        totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
      }
      form.setFieldsValue({
        grossAmount: gridGrossAmt,
      });

      const obj = {
        description: description,
        key: productObject.key,
        listPrice: productObject.listPrice,
        orderLineId: productObject.orderLineId,
        orderedQty: productObject.orderedQty,
        productId: productObject.productId,
        productName: productObject.productName,
        productSearchKey: productObject.productSearchKey,
        receivedqty: productObject.receivedQty,
        skuName: productObject.skuName,
        stockUomId: productObject.stockUomId,
        stockUomIdName: productObject.stockUomName,
        taxRate: productObject.taxRate,
        unitPrice: productObject.unitPrice,
        uomId: productObject.uomId,
        uomName: productObject.uomName,
        value: productObject.value,
        grossAmount: gridGrossAmt,
        unitPrice2: unitPrice2,
        netUnitPrice: netUnitPrice,
        returnQty: returnQty,
        totalTax: totalTax,
        upc: productObject.upc,
        salePrice: productObject.salePrice,
        batchNo : productObject.batchNo,
        startDate:productObject.startDate,
        endDate:productObject.endDate,
        orderLineId:productObject.orderLineId,
        receiptLineId:productObject.receiptLineId, 
        mfg_date :productObject.mfg_date === null || productObject.mfg_date === undefined ? null : moment(productObject.mfg_date).format('YYYY-MM-DD'),
        expiry_date :productObject.expiry_date === null || productObject.expiry_date === undefined ? null : moment(productObject.expiry_date).format('YYYY-MM-DD'),
      };
      const newArray = [];
      for (let index = 0; index < productData.length; index++) {
        const productIdFromArray = productData[index].productId;
        if (productIdFromArray !== productObject.productId) {
          newArray.push(productData[index]);
        }
      }
      newArray.unshift(obj);
      setProductData(newArray);
    }, 500);
  };

  const callbackTabs = (key) => {
    setTabKey(key);
    form.resetFields();
    summaryForm.setFieldsValue({
      summreceiptdate: moment(scheduledDate, dateFormat),
      summbusinessunit: businessUnitName,
      summorderdate: currentDate,
      summsupplier: supplierName,
      summsupplierAddress: supplierAddressName,
      summdeliveryAddress: deliveryLocationName,
    });
    let newArray = [];
    for (let index = 0; index < productData.length; index++) {
      const element = parseFloat(productData[index].returnQty);
      if (element > 0) {
        const taxRate = productData[index].taxRate.rate;
        const basePrice = productData[index].unitPrice2;
        let grossStd;
        let netStd;
        if (istaxincludedFlag === "Y") {
          grossStd = productData[index].unitPrice2;
          netStd = (basePrice / (1 + taxRate / 100)).toFixed(2);
        } else {
          const taxOnUnitPrice = (taxRate / 100) * basePrice;
          grossStd = (parseFloat(basePrice) + parseFloat(taxOnUnitPrice)).toFixed(2);
          netStd = productData[index].unitPrice2;
        }
        productData[index].grossStd = grossStd;
        productData[index].netStd = netStd;
        newArray.push(productData[index]);
      }
    }
    setPoSummaryData(newArray);
  };
  const poReview = () => {
    setTabKey("13");
    summaryForm.setFieldsValue({
      summreceiptdate: moment(scheduledDate, dateFormat),
      summbusinessunit: businessUnitName,
      summorderdate: currentDate,
      summsupplier: supplierName,
      summsupplierAddress: supplierAddressName,
      summdeliveryAddress: deliveryLocationName,
    });
    let newArray = [];
    let moreQtyFlag = false;
    for (let index = 0; index < productData.length; index++) {
      const element = parseFloat(productData[index].returnQty);
      const orderQty = parseFloat(productData[index].orderedQty);
      if(element > orderQty){
        moreQtyFlag = true
      }
      if (element > 0) {
        const taxRate = productData[index].taxRate.rate;
        const basePrice = productData[index].unitPrice2;
        let grossStd;
        let netStd;
        if (istaxincludedFlag === "Y") {
          grossStd = productData[index].unitPrice2;
          netStd = (basePrice / (1 + taxRate / 100)).toFixed(2);
        } else {
          const taxOnUnitPrice = (taxRate / 100) * basePrice;
          grossStd = (parseFloat(basePrice) + parseFloat(taxOnUnitPrice)).toFixed(2);
          netStd = productData[index].unitPrice2;
        }
        productData[index].grossStd = grossStd;
        productData[index].netStd = netStd;
        newArray.push(productData[index]);
      }
    }
    setPoSummaryData(newArray);
    const countOfProducts = newArray.length;
    if(moreQtyFlag === true){
      message.error("Return Qty should not more than Ordered Qty !")
    }else{
      if (countOfProducts === 0) {
        message.error("Please Add Products");
      } else {
        setPoSummaryVisible(true);
      }
    }
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
        setPoSummaryData([]);
        setProductData([]);
      },
      onCancel() {
        setPoSummaryVisible(false);
        setProductData([]);
        setPoSummaryData([]);
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


  const createPO = () => {
    const authHeaders = getOAuthHeaders();
    if (authHeaders && authHeaders.email && authHeaders.access_token) {
    setLoading(true);
    const arrayForMutation = [];
    let uomId = "";
    let productId1 = "";
    let orderedQty = "";
    let unitPrice = "";
    let listPrice = "";
    let taxId = "";
    let description1 = "";
    let refpOrderLineId = "";
    let refreceiptLineId = "";
    let grossStd;
    let netStd;
    let upc = "";
    let returnQty = "";
    let salePrice = "";
  
    for (let index = 0; index < poSummaryData.length; index++) {
      uomId = poSummaryData[index].uomId;
      refpOrderLineId = poSummaryData[index].orderLineId;
      refreceiptLineId = poSummaryData[index].receiptLineId;
      grossStd = poSummaryData[index].grossStd;
      netStd = poSummaryData[index].netStd;
      productId1 = poSummaryData[index].productId;
      orderedQty = poSummaryData[index].orderedQty;
      returnQty = poSummaryData[index].returnQty;
      unitPrice = poSummaryData[index].unitPrice;
      listPrice = poSummaryData[index].listPrice;
      taxId = poSummaryData[index].taxRate.csTaxID;
      upc = poSummaryData[index].upc;
      salePrice = poSummaryData[index].salePrice;
      description1 = poSummaryData[index].description === null || poSummaryData[index].description === undefined ? null : poSummaryData[index].description;
      arrayForMutation.push(
        `{
      refpOrderLineId:${refpOrderLineId === null || refpOrderLineId === undefined ? null :`"${refpOrderLineId}"`}
      refReceiptLineId:${refreceiptLineId === null || refreceiptLineId === undefined ? null : `"${refreceiptLineId}"`}
      productId: "${productId1}", 
      uomId: "${uomId}", 
      orderQty: "${orderedQty}", 
      unitPrice: ${unitPrice}, 
      listPrice:${listPrice}, 
      taxId: "${taxId}", 
      description:${description1 === null || description1 === undefined ? null : `"${description1}"`}, 
      isManual: "Y",
      totalDiscount:null,
      grossstd:${grossStd},
      netstd:${netStd},
      salePrice:${salePrice},
      upc:${upc === null || upc === undefined ? null : `"${upc}"`},
      returnQty:${returnQty}
    }`
      );
    }
    const createPoOrder = {
      query: `mutation {
    createPurchaseReturn(order: {
        refOrderId:${selectedOrderId === null || selectedOrderId === undefined ? null :`"${selectedOrderId}"`},
        refReceiptId : ${receiptid === null || receiptid === undefined ? null :`"${receiptid}"`},
        bunitId: "${bunitId}",
        bunitLocationId: "${regionName}", 
        supplierId: "${supplierId}",      
        dateReturn:"${scheduledDate}"
        isTaxIncluded:"${istaxincludedFlag}", 
        pricelistId: "${priceListId}", 
        description: null, 
        returnReason:"${returnReasonId}",
        supplierAddressId: "${supplierAddressId}", 
        lines: [${arrayForMutation}]   
      }) {
          status
          message
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
        const Status = response.data.data.createPurchaseReturn.status;
        const messageForSuccess = response.data.data.createPurchaseReturn.message;
        if (Status === "Success") {
          setPoSummaryVisible(false);
          const recordId = response.data.data.createPurchaseReturn.extraParam;
          form.resetFields();
          summaryForm.resetFields(["summbusinessunit", "summsupplier", "summsupplierAddress", "summdeliveryAddress"]);
          headerform.resetFields(["supplier", "Po", "returnReson"]);
          setBusinessUnitName("");
          setSupplierName("");
          setSupplierAddressName("");
          setDeliveryLocationName("");
          setLoading(false);
          setSelectedOrderId("");
          setreturnReasonId(null);
          getPrintCofirmation(recordId, messageForSuccess);
        } else {
          message.error(messageForSuccess);
          setLoading(false);
        }
      } else {
        message.error("getting error while creating purchase return");
        setLoading(false);
      }
    });
  }
  };

  const createPoCancel = () => {
    setPoSummaryVisible(false);
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
              qty: cells[1],
            });
          }
        }
        if (dataArr.length > 0) {
          setLoading(true);
          const matchedArray = [];
          const unmatchedArray = [];
          for (let indexOne = 0; indexOne < dataArr.length; indexOne += 1) {
            let boolean = true;
            for (let indexTwo = 0; indexTwo < productData.length; indexTwo += 1) {
              if (dataArr[indexOne].sku === productData[indexTwo].value) {
                productData[indexTwo].returnQty = dataArr[indexOne].qty;
                matchedArray.push(productData[indexTwo]);
                boolean = false;
              }
            }
            if (boolean) {
              unmatchedArray.push(dataArr[indexOne].sku);
            }
          }
          setTimeout(() => {
            getDiscountCalculation(matchedArray, unmatchedArray);
          }, 500);
        } else {
          message.error("Please import the file in required format.");
          document.getElementById("choosefile").value = null;
        }
      };

      reader.readAsText(file);
    }
  };

  const getDiscountCalculation = (tempArray, unmatchedArray) => {
    const multipleProductData = tempArray;
    const newArray = [];
    if (istaxincludedFlag === "Y") {
      for (let index = 0; index < multipleProductData.length; index++) {
        const returnQty = multipleProductData[index].returnQty;
        const taxRate = multipleProductData[index].taxRate.rate;
        const basePrice = multipleProductData[index].unitPrice;

        const netUnitPrice1 = basePrice / (1 + taxRate / 100);
        const taxOnUnitPrice = (taxRate / 100) * netUnitPrice1;
        const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
        const gridGrossAmt1 = unitPrice1 * returnQty;
        const totalTax1 = gridGrossAmt1 - netUnitPrice1 * returnQty;

        const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
        const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
        const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
        const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);

        multipleProductData[index].totalTax = totalTax;
        multipleProductData[index].grossAmount = gridGrossAmt;
        multipleProductData[index].netUnitPrice = netUnitPrice;
        multipleProductData[index].unitPrice2 = unitPrice;
        newArray.push(multipleProductData[index]);
      }
    } else {
      for (let index = 0; index < multipleProductData.length; index++) {
        const returnQty = multipleProductData[index].returnQty;
        const taxRate = multipleProductData[index].taxRate.rate;
        const basePrice = multipleProductData[index].unitPrice;

        const netUnitPrice1 = basePrice;
        const taxOnUnitPrice = (taxRate / 100) * netUnitPrice1;
        const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
        const gridGrossAmt1 = unitPrice1 * returnQty;
        const totalTax1 = gridGrossAmt1 - netUnitPrice1 * returnQty;

        const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
        const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
        const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
        const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);

        multipleProductData[index].totalTax = totalTax;
        multipleProductData[index].grossAmount = gridGrossAmt;
        multipleProductData[index].netUnitPrice = netUnitPrice;
        multipleProductData[index].unitPrice2 = unitPrice;
        newArray.push(multipleProductData[index]);
      }
    }
    let gridArray = [];
    for (let index = 0; index < productData.length; index++) {
      let temp = true;
      const finalGridVal = productData[index].value;
      for (let index2 = 0; index2 < newArray.length; index2++) {
        const element = newArray[index2].value;
        if (finalGridVal === element) {
          temp = false;
          break;
        }
      }
      if (temp) {
        gridArray.push(productData[index]);
      }
    }
    const finalData = [...newArray, ...gridArray];
    setProductData([]);
    setProductData(finalData);
    setLoading(false);
    message.success(`${tempArray.length} products imported ...`);
    if (unmatchedArray.length > 0) {
      setTimeout(() => {
        Modal.error({
          title: "Products not found !",
          content: `${unmatchedArray}`,
          closable: true,
          footer: null,
          icon: null,
        });
      }, 500);
    }
    importform.resetFields();
    document.getElementById("choosefile").value = null;
  };
  const disabledDateChange = (date, dateString) => {
    setScheduledDate(dateString);
  };

  const taxNameArray = [];
  let orderQuantityCount = 0;
  let grossAmtCount = 0;
  let orderQuantity = 0;
  let totalOrderQty = 0;
  for (let index = 0; index < poSummaryData.length; index += 1) {
    orderQuantity = poSummaryData[index].returnQty;
    const integer = parseFloat(orderQuantity, 10);
    orderQuantityCount += integer;
    const grossAmtWithFloat = poSummaryData[index].grossAmount;
    grossAmtCount += parseFloat(grossAmtWithFloat);
  }
  totalOrderQty = orderQuantityCount;
  let result = poSummaryData.reduce((c, v) => {
    c[v.taxRate.name] = (c[v.taxRate.name] || 0) + parseFloat(v.totalTax);
    return c;
  }, {});

  Object.keys(result).map((key) => {
    const taxObj = {
      taxName: key,
      taxValue: result[key],
    };
    taxNameArray.push(taxObj);
    return taxObj;
  });

  const summaryDiv = (
    <Card>
      <Form layout="vertical" form={summaryForm} name="summaryForm">
        <Row gutter={16}>
          <Col className="gutter-row" span={8}>
            <Form.Item name="summbusinessunit" label="Business Unit">
              <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item name="summorderdate" label="Order Date">
              <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item name="summreceiptdate" label="Return Date">
              <DatePicker style={{ width: "100%" }} onChange={disabledDateChange} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <p />
          <br />
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={8}>
            <Form.Item name="summsupplier" label="Supplier">
              <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item name="summsupplierAddress" label="Supplier Address">
              <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item name="summdeliveryAddress" label="Delivery Address">
              <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <p />
          <br />
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={8}>
            <Form.Item name="summremarks" label="Remarks">
              <Input style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div>
        <Table
          columns={summaryTableColumns}
          dataSource={poSummaryData}
          style={{ fontSize: "12px" }}
          size="small"
          sticky={true}
          scroll={{ y: "40vh", x: "100%" }}
          pagination={false}
        />
      </div>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <h4>No. of Products: {poSummaryData.length}</h4>
        </Col>
        <Col className="gutter-row" span={6} />
        <Col className="gutter-row" span={6}>
          <h4>Total Return Qty : {totalOrderQty}</h4>
        </Col>
        <Col className="gutter-row" span={6}>
          <h4>Total Amount: {grossAmtCount.toFixed(2)}</h4>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Collapse bordered={false} defaultActiveKey={["2"]} expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />} className="collapseClassStyle">
            <Panel header="Delivery Notes" key="1" showArrow={false} className="collapseClassStyle">
              <Input />
            </Panel>
          </Collapse>
        </Col>
        <Col className="gutter-row" span={6}>
          <Collapse bordered={false} defaultActiveKey={["1"]} expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />} className="collapseClassStyle">
            <Panel header="Terms & Conditions" key="2" showArrow={false} className="collapseClassStyle">
              <Input />
            </Panel>
          </Collapse>
        </Col>
        <Col className="gutter-row" span={12}>
          <span style={{ float: "right" }}>
            <table style={{ border: "1px solid #dddddd" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #dddddd" }}>Tax Breakup</th>
                </tr>
              </thead>
              <tbody>
                {taxNameArray.map((data) => (
                  <tr>
                    <td style={{ border: "1px solid #dddddd" }}>
                      <span>{data.taxName}</span> &nbsp;: {data.taxValue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </span>
        </Col>
      </Row>
    </Card>
  );

  return (
    <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
      <div>
        <Row>
          <Col span={12}>
            <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>New Purchase Returns</h2>
          </Col>
          <Col span={12}>
            <span style={{ float: "right" }}>
              <Button onClick={poReview} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }}>
                Review
              </Button>
            </span>
          </Col>
        </Row>
        <Card style={{ marginBottom: "8px" }}>
          <Form layout="vertical" form={headerform} name="control-hooks" onFinish={onFinish}>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="businessUnit"
                  rules={[
                    {
                      required: true,
                      message: "please select business unit!",
                    },
                  ]}
                  label="Business unit"
                  style={{ marginBottom: "8px" }}
                >
                  <Select
                    allowClear
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    // onFocus={getBusinessUnit}
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
                  name="supplier"
                  rules={[
                    {
                      required: true,
                      message: "please select supplier!",
                    },
                  ]}
                  label="Supplier"
                  style={{ marginBottom: "8px" }}
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
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="Po"
                  rules={[
                    {
                      required: true,
                      message: "please select po!",
                    },
                  ]}
                  label="GRN"
                  style={{ marginBottom: "8px" }}
                >
                  <Select
                    allowClear
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onSelect={onSelectDraftpo}
                    onFocus={getGRN}
                  >
                    {PoDocsData.map((data, index) => (
                      <Option key={data.mReceiptId} value={data.mReceiptId} data={data} title={data.documentNo}>
                        {data.documentNo}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="returnReson"
                  rules={[
                    {
                      required: true,
                      message: "please select return reason!",
                    },
                  ]}
                  label="Return Reason"
                  style={{ marginBottom: "8px" }}
                >
                  <Select
                    allowClear
                    showSearch
                    filterOption={(input, Option) => Option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onChange={onTypeChange}
                    onFocus={getReturnData}
                  >
                    {returnReasonsData.map((data, index) => (
                      <Option key={data.returnReasonId} title={data.name} value={data.returnReasonId}>
                        {data.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Row gutter={16}>
          <Col className="gutter-row" span={4}>
            <Radio.Group style={{ marginTop: "4%" }} onChange={onChangeRadio} value={appConfig.upc === "Y" ? radioValue : 2}>
            {appConfig.upc === "Y" ? <Radio value={1}>UPC</Radio> : ''}
            {appConfig.sku === "Y" ? <Radio value={2}>SKU</Radio> : ''}
            </Radio.Group>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form layout="vertical" form={skuform} name="skuform">
              <Form.Item name="upcsku" label="" style={{display: appConfig.sku === "N" && appConfig.upc === "N" ? 'none' : ''}}>
                <Input
                  placeholder="Scan UPC/SKU"
                  // autoFocus={AutoFocusValue}
                  onKeyPress={scanUpcOrSku}
                  suffix={<img alt="img" src={barcodeImage} />}
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <p />
        <div>
          <Tabs
            defaultActiveKey={tabKey}
            onChange={callbackTabs}
            type="card"
            tabBarStyle={{ marginBottom: "0px" }}
            tabBarExtraContent={
             appConfig.downloadtemplate === "Y" ? <div>
                <Tooltip placement="top" title={"Download Template"}>
                  <Button size="small" onClick={downloadImportTemplate}>
                    <DownloadOutlined />
                  </Button>
                </Tooltip>
                &nbsp;
                <span>
                  <input id="choosefile" type="file" accept=".csv" onChange={readFileData} />
                </span>
              </div>
               : null
            }
          >
            <TabPane tab="Products" key="10">
              <Card style={{ marginBottom: "8px" }}>
                <Form layout="vertical" form={form} name="editable-form" onFinish={onFinish}>
                  <Row gutter={16}>
                    <Col className="gutter-row" span={8}>
                      <Form.Item name="skuValue" label="SKU" style={{ marginBottom: "8px" }}>
                        <Select
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children === null || option.children === undefined ? null : option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onSelect={onselectedProduct}
                        >
                          {productData.map((data, index) => {
                            if(appConfig.sku === "Y"){
                              return (<Option key={data.key} data={data}>
                              {data.skuName}
                            </Option>)
                            }
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    {appConfig.category === "Y" ? <Col className="gutter-row" span={4}>
                      <Form.Item name="productCategoryName" label="Category" style={{ marginBottom: "8px" }}>
                        <Input style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col> : ""}
                    <Col className="gutter-row" span={4}>
                      <Form.Item name="uomName" label="UOM" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4}>
                      <Form.Item name="orderQty" label="Order Qty" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4}>
                      <Form.Item name="returnQty" label="Return Qty" style={{ marginBottom: "8px" }}>
                        <Input onChange={OnChangeOrderQty} />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4}>
                      <Form.Item name="unitPrice" label="Unit Price" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4}>
                      <Form.Item name="taxName" label="Tax" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4}>
                      <Form.Item name="grossAmount" label="Gross Amount" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col>
                    {appConfig.batchNo === "Y" ? <Col className="gutter-row" span={4}>
                  <Form.Item name="batchno" label="Batch No" disabled style={{ marginBottom: "8px" }}>
                    <Input readOnly={appConfig.batchno === "Y" ? false : true} style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                  </Form.Item>
                </Col> : ""}
                {appConfig.mfgdate === "Y" ? <Col className="gutter-row" span={4}>
                  <Form.Item name="mfg_date" label="Mfg Date" style={{ marginBottom: "8px" }}>
                    <DatePicker style={{width:'100%'}} disabled = {appConfig.mfgdate === "Y" ? false : true}/>
                  </Form.Item>
                </Col>: ""}
                {appConfig.expirydate === "Y" ? <Col className="gutter-row" span={4}>
                  <Form.Item name="expiry_date"  label="Expiry Date" style={{ marginBottom: "8px" }}>
                    <DatePicker style={{width:'100%'}} disabled={appConfig.expirydate === "Y" ? false : true}  />
                  </Form.Item>
                </Col> : ""}
                    <Col className="gutter-row" span={4}>
                      <Form.Item name="description" label="Remarks" style={{ marginBottom: "8px" }}>
                        <Input onChange={OnChangeOrderQty} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
              <MainTable key="64" gridData={productData} getSelectedRecord={getSelectedRecord} />
            </TabPane>
            {appConfig.summary === "Y" ? (
              <TabPane tab="Summary" key="13">
                {summaryDiv}
              </TabPane>
            ) : null}
          </Tabs>
        </div>
      </div>
      <div>
        <Modal
          visible={poSummaryVisible}
          closable={null}
          centered
          width="90%"
          footer={[
            <Button key="back" onClick={createPoCancel}>
              Preview
            </Button>,
            <Button loading={loading} onClick={createPO}>
              Confirm
            </Button>,
          ]}
        >
          <h3 style={{ textAlign: "center" }}>Purchase Return Summary</h3>
          <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
            {summaryDiv}
          </Spin>
        </Modal>
      </div>
    </Spin>
  );
};

export default PurchaseReturns;
