/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Spin, Row, Col, Button, Select, Form, Card, DatePicker, Radio, Input, Tooltip, Tabs, Modal, InputNumber, Table, message, Collapse,TimePicker,Space } from "antd";
import { LoadingOutlined, CaretRightOutlined, DownloadOutlined,PlusCircleOutlined,MinusCircleOutlined } from "@ant-design/icons";
import { ExportToCsv } from "export-to-csv";
import {
  getRoleBusinessUnit,
  getPurchaseOrderDocData,
  getSupplierProductsList,
  getPoOrderLineProducts,
  getDeliveryLocation,
  getLandedCostData,
  getAppSetupData,
} from "../../../services/custom";
import { getOAuthHeaders } from "../../../constants/oAuthValidation";
import { getGrnSuppliers, getAllSupplier, getDefaultSupplier, getSupplierAddress } from "../../../services/generic";
import { useGlobalContext } from "../../../lib/storage";
import Axios from "axios";
// import { serverUrl, genericUrl, fileDownloadUrl } from "../../../constants/serverConfig";
import { v4 as uuid } from "uuid";
import moment from "moment";
import MainTable from "./MainTable";
import OtherCostTable from "./OtherCostTable";
import summaryTableColumns from "./summaryCols";
import barcodeImage from "../../../assets/images/barcode.svg";
import "antd/dist/antd.css";
import "../../../styles/antd.css";
import ThemeJson from "../../../constants/UIServer.json"

const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const GRN = () => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const [form] = Form.useForm();
  const [skuform] = Form.useForm();
  const [headerform] = Form.useForm();
  const [otherCostForm] = Form.useForm();
  const [summaryForm] = Form.useForm();
  const [importform] = Form.useForm();
  const [mainForm] = Form.useForm()
  const serverUrl = process.env.REACT_APP_serverUrl;
  const genericUrl = process.env.REACT_APP_genericUrl;
  const fileDownloadUrl = process.env.REACT_APP_fileDownloadUrl;
  const [loading, setLoading] = useState(false);
  const [withOrwithoutPoValue, setwithOrwithoutPoValue] = useState("1");
  const [bunitId, setBunitId] = useState("");
  const [bunitData, setBunitData] = useState([]);
  const [businessUnitName, setBusinessUnitName] = useState("");
  const [suppliersValuesInState, setSuppliersValuesInState] = useState([]);
  const [withOutPoSuppliersData, setWithOutPoSuppliersData] = useState([]);
  const [suppliersValuesInStateCopy, setSuppliersValuesInStateCopy] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [poDocList, setPoDocList] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [istaxincludedFlag, setIstaxincludedFlag] = useState(null);
  const [productData, setProductData] = useState([]);
  const [orderDate, setOrderDate] = useState("");
  const [radioValue, setRadioValue] = useState(1);
  const [tabKey, setTabkey] = useState("10");
  const [disableBatchField, setDisableBatchField] = useState(true);
  const [disableDiscountInput, setDisableDiscountInput] = useState("");
  const [selectedGridRecord, setSelectedGridRecord] = useState({});
  const [disabledDiscountType, setDisabledDiscountType] = useState(true);
  const [supplierAddressName, setSupplierAddressName] = useState(null);
  const [supplierAddressId, setSupplierAddressId] = useState(null);
  const [deliveryFullAddress, setDeliveryFullAddress] = useState(null);
  const [otherCostData, setOtherCostData] = useState([]);
  const [addCostVisible, setAddCostVisible] = useState(false);
  const [landedCostDropDownData, setLandedCostDropDownData] = useState([]);
  const [selectedLandedCost, setSelectedLandedCost] = useState({});
  const [grnSummaryData, setGrnSummaryData] = useState([]);
  const [uniqueId, setUniqueId] = useState("");
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importDiscountType, setImportDiscountType] = useState(undefined);
  const [appConfig, setAppConfig] = useState({});
  const [changePriceDisabledFlag,setChangePriceDisabledFlag] = useState(true)
  const [skuSearchedProductData,setSkuSearchedProductData] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [dynamicData,setDynamicData]=useState([])
  const [batchVisible,setBatchVisible] = useState(false)
  const [isSplitBatch,setIsSplitBatch] = useState(false)
  const [fieldsArry,setFieldsArry] = useState([])

  useEffect(() => {
    let newDate = moment(new Date()).format("YYYY-MM-DD");
    headerform.setFieldsValue({
      "with-withoutpo": "With Po",
      date: moment(newDate),
    });
    summaryForm.setFieldsValue({
      summinvoiceDate: moment(newDate),
      summreceiptdate: moment(newDate),
    });
    getAppSetup();
    getBusinessUnit();
    getDefaultSupplierList();
  }, []);

  const getAppSetup = async () => {
    const val = "GRN";
    const response = await getAppSetupData(val);
    setAppConfig(JSON.parse(response[0].configJson));
    let formData = JSON.parse(response[0].configJson)
    if(formData.dynamicFiledsGRN.length>0){
      for(let i =0;i<formData.dynamicFiledsGRN.length;i++){
        if(formData.dynamicFiledsGRN[i].type === "LM" && formData.dynamicFiledsGRN[i].defaultValue !== undefined){
          formData.dynamicFiledsGRN[i].data = formData.dynamicFiledsGRN[i].defaultValue.split(",")
        }
        if(formData.dynamicFiledsGRN[i].type === "LI" && formData.dynamicFiledsGRN[i].defaultValue !== undefined){
          formData.dynamicFiledsGRN[i].data = formData.dynamicFiledsGRN[i].defaultValue.split(",")
        }
    }
    }
  setDynamicData(formData.dynamicFiledsGRN)
  if(formData.splitBatch === "Y"){
    setIsSplitBatch(true)
  }else{
    setIsSplitBatch(false)
  }
  };

  const getBusinessUnit = async () => {
    const userData = JSON.parse(window.localStorage.getItem("userData"));
    const businessUnitResponse = await getRoleBusinessUnit(userData.user_id);
    headerform.setFieldsValue({
      businessUnit: businessUnitResponse.bUnitName,
    });
    summaryForm.setFieldsValue({
      summbusinessunit: businessUnitResponse.bUnitName,
    });
    setBunitId(businessUnitResponse.defaultCsBunitId);
    setBunitData(businessUnitResponse.userBunit);
    setBusinessUnitName(businessUnitResponse.bUnitName);
    getAllSupplierList(businessUnitResponse.defaultCsBunitId);
    // setTimeout(() => {
    //     getPurchaseOrderDocList()
    // }, 200);
  };

  const onFinish = () => {};

  const onSelectOfWithORwithoutPo = (e) => {
    setwithOrwithoutPoValue(e);
    setProductData([]);
    headerform.resetFields(["supplier"]);
    if (e === "2") {
      setSuppliersValuesInState([]);
      setSuppliersValuesInState(withOutPoSuppliersData);
    } else {
      setSuppliersValuesInState([]);
      setSuppliersValuesInState(suppliersValuesInStateCopy);
    }
  };

  const onSelectBusinessUnit = (e, data) => {
    setBunitId(e);
    summaryForm.setFieldsValue({
      summbusinessunit: data.title,
    });
    if (withOrwithoutPoValue === "2") {
      getGRNSupplier(e);
    }
    setTimeout(() => {
      getPurchaseOrderDocList();
    }, 300);
    getAllSupplierList(e);
  };

  const getGRNSupplier = async (e) => {
    const grnSupplierResponse = await getGrnSuppliers(e);
    setSuppliersValuesInState(grnSupplierResponse);
  };

  const getAllSupplierList = async (e) => {
    const allSupplierResponse = await getAllSupplier(e);
    setWithOutPoSuppliersData(allSupplierResponse);
  };

  const getDefaultSupplierList = async () => {
    const defaultSupplierResponse = await getDefaultSupplier();
    setSuppliersValuesInState(defaultSupplierResponse);
    setSuppliersValuesInStateCopy(defaultSupplierResponse);
  };

  const supplierOnchange = (e, data) => {
    setSupplierId(e);
    setIstaxincludedFlag(data.props.istaxflag);
    summaryForm.setFieldsValue({
      summsupplier: data.title,
    });
    setTimeout(() => {
      // getPurchaseOrderDocList()
      if (withOrwithoutPoValue === "2") {
        getSupplierProducts(e, data.props.istaxflag);
      }
    }, 200);
    getSupplierAdd(e);
    getDeliveryLoc();
  };

  const getSupplierAdd = async (e) => {
    const getSupplierAddressResponse = await getSupplierAddress(e);
    setSupplierAddressName(getSupplierAddressResponse[0].name);
    setSupplierAddressId(getSupplierAddressResponse[0].recordid);
    summaryForm.setFieldsValue({
      summorderdate: null,
      summsupplierAddress: getSupplierAddressResponse[0].name,
    });
  };
  const getDeliveryLoc = async () => {
    const getDeliveryLocResponse = await getDeliveryLocation(bunitId);
    if (getDeliveryLocResponse.length > 0) {
      setDeliveryFullAddress(getDeliveryLocResponse[0].fulladdress);
      summaryForm.setFieldsValue({
        summdeliveryAddress: getDeliveryLocResponse[0].fulladdress,
      });
    } else {
      setDeliveryFullAddress(null);
      summaryForm.setFieldsValue({
        summdeliveryAddress: null,
      });
    }
  };

  const getPurchaseOrderDocList = async () => {
    // setLoading(true)
    const purchaseOrderDocResponse = await getPurchaseOrderDocData(bunitId, supplierId);
    if (purchaseOrderDocResponse.length > 0) {
      for (let index = 0; index < purchaseOrderDocResponse.length; index++) {
        purchaseOrderDocResponse[index].docToshow =
          purchaseOrderDocResponse[index].docNo +
          "-" +
          moment(purchaseOrderDocResponse[index].dateOrdered).format("DD/MM/YYYY") +
          "-" +
          purchaseOrderDocResponse[index].totalGrossAmount +
          "/-";
      }
      setPoDocList(purchaseOrderDocResponse);
      // setLoading(false)
    }
  };

  const onSelectPurchaseOrder = async (e, data) => {
    setOrderId(e);
    setOrderDate(moment(data.orderdate).format("YYYY-MM-DD"));
    getpOrderData(e);
    let orderDate;
    if (data.orderdate === null || data.orderdate === undefined || data.orderdate === "") {
      orderDate = null;
      summaryForm.setFieldsValue({
        summorderdate: null,
        poDoc: data.title,
      });
    } else {
      orderDate = moment(data.orderdate).format("YYYY-MM-DD");
      summaryForm.setFieldsValue({
        summorderdate: orderDate,
        poDoc: data.title,
      });
    }
  };

  const getpOrderData = async (e) => {
    setLoading(true);
    const poProductResponse = await getPoOrderLineProducts(e, bunitId, supplierId);
    const productList = poProductResponse;
    for (let index = 0; index < productList.length; index += 1) {
      productList[index].key = productList[index].productId;
      productList[index].receivingQty = undefined;
      productList[index].salePrice = productList[index].salePrice === null || productList[index].salePrice === undefined ? 0 :productList[index].salePrice
      productList[index].priceList = productList[index].listPrice;
      productList[index].priceList1 = productList[index].listPrice;
      productList[index].priceStd = productList[index].unitPrice;
      productList[index].priceStd1 = productList[index].unitPrice;
      productList[index].priceStd2 = productList[index].unitPrice;
      productList[index].totalDiscount = productList[index].totaldiscount;
      productList[index].poTotalDiscount = productList[index].totaldiscount;
      productList[index].isPoTotalDiscoutValue =
        productList[index].discounttype === "TV"
          ? "Total value Discount"
          : productList[index].discounttype === "P"
          ? "Percentage"
          : productList[index].discounttype === "Value"
          ? "Value"
          : null;
      productList[index].DiscountType =
        productList[index].discounttype === "TV"
          ? "Total value Discount"
          : productList[index].discounttype === "P"
          ? "Percentage"
          : productList[index].discounttype === "Value"
          ? "Value"
          : null;
      productList[index].freeqty = undefined;
      productList[index].value = productList[index].productSearchKey;
      productList[index].taxId = productList[index].taxRate.csTaxID;
      productList[index].taxName = productList[index].taxRate.name;
      productList[index].taxRate = productList[index].taxRate.rate;
      productList[index].margin = (((productList[index].listPrice - productList[index].unitPrice) / productList[index].listPrice) * 100).toFixed(2);
    }
    setProductData(productList);
    setLoading(false);
  };

  const getSupplierProducts = async (e, flag) => {
    setLoading(true);
    const supplierProductResponse = await getSupplierProductsList(e,bunitId);
    if (supplierProductResponse.length > 0) {
      const data = supplierProductResponse;
      let netUnitPrice;
      let unitPrice;
      for (let index = 0; index < data.length; index++) {
        let uniqueId = uuid()
          .replace(/-/g, "")
          .toUpperCase();
        data[index].uniqueId = uniqueId;
        data[index].key = uniqueId;
        data[index].priceList1 = data[index].priceList;
        data[index].priceStd1 = data[index].priceStd;
        data[index].priceStd2 = data[index].priceStd;
        data[index].margin = (((data[index].priceList - data[index].priceStd) / data[index].priceList) * 100).toFixed(2);
        data[index].oldMargin = (((data[index].priceList - data[index].priceStd) / data[index].priceList) * 100).toFixed(2);
        data[index].value = data[index].productCode;
        data[index].productSearchKey = data[index].productCode;
        let istaxFlag = flag;
        if (istaxFlag === "Y") {
          netUnitPrice = (data[index].priceStd / (1 + data[index].taxRate / 100)).toFixed(2);
          unitPrice = data[index].priceStd
        } else {
          const netUnitPrice1 = data[index].priceStd;
          const taxOnUnitPrice = (data[index].taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
        }
        data[index].netUnitPrice = netUnitPrice;
        data[index].priceStd = unitPrice
      }
      setProductData(data);
      setLoading(false);
    }
  };

  const onChangeRadio = (e) => {
    setRadioValue(e.target.value);
  };

  const grnSummaryReview = () => {
    let tempArray = [];
    for (let index = 0; index < productData.length; index++) {
      const element = parseFloat(productData[index].receivingQty);
      const ele2 = parseFloat(productData[index].freeqty);
      if (element > 0 || ele2 > 0) {
        tempArray.push(productData[index]);
      }
    }
    if (tempArray.length === 0) {
      message.error("Please Add products");
    } else {
      let tempArray2 = [];
      for (let index = 0; index < productData.length; index++) {
        const element = productData[index].receivingQty;
        const ele2 = productData[index].freeqty;
        const basePrice = productData[index].priceStd;
        const netUnitPrice = basePrice / (1 + productData[index].taxRate / 100);
        const gridGrossAmt = productData[index].gridGross;
        let totalTax;
        if (istaxincludedFlag === "Y") {
          totalTax = gridGrossAmt - netUnitPrice * element;
        } else {
          totalTax = gridGrossAmt - netUnitPrice * element;
        }
        productData[index].totalTax = totalTax.toFixed(2);
        productData[index].totalDiscount =
          productData[index].totalDiscount === undefined || productData[index].totalDiscount === null || productData[index].totalDiscount === ""
            ? 0
            : productData[index].totalDiscount;

        if (element > 0 || ele2 > 0) {
          tempArray2.push(productData[index]);
        }
      }
      for (let index3 = 0; index3 < tempArray2.length; index3 += 1) {
        tempArray2[index3].receivingQty === undefined ? 0 : tempArray2[index3].receivingQty;
      }
      let flag;
      let basePriceFlag;
      for (let index6 = 0; index6 < tempArray2.length; index6 += 1) {
        const orderQtyelement = parseFloat(tempArray2[index6].orderedQty);
        const receivingQtyelement = parseFloat(tempArray2[index6].receivingQty);
        const basePrice = parseFloat(tempArray2[index6].priceStd); 
        const salePrice = parseFloat(tempArray2[index6].salePrice); 
        const mrp = parseFloat(tempArray2[index6].priceList); 
        if (receivingQtyelement > orderQtyelement) {
          flag = false;
        } 
        if (basePrice > mrp ) {
          basePriceFlag = false;
        }else if(basePrice > salePrice){
          basePriceFlag = false;
        }
      }
      if (flag === false) {
        message.error("Total Receiving qty shouldn’t be greater than Order qty");
      } else {
        setGrnSummaryData(tempArray2);
      }
      // callbackTabs()
      if(appConfig.actualPriceGreaterMrp === "Y"){
        setSummaryModalVisible(true);
      }else{
        if(basePriceFlag === false){
          message.error("Base Price is greater than mrp and sale price!");
        }else{
          setSummaryModalVisible(true);
        }
      }
      // this.setState({GoodsSummaryvisible:true})
    }
  };

  const callbackTabs = (e) => {
    setTabkey(e);
    form.resetFields();
    setSelectedGridRecord({});
    if (supplierId === null || supplierId === undefined || supplierId === "") {
      message.error("Please select supplier");
    } else {
      let tempArray = [];
      for (let index = 0; index < productData.length; index++) {
        const element = productData[index].receivingQty;
        const ele2 = productData[index].freeqty;
        const basePrice = productData[index].priceStd;
        const netUnitPrice = basePrice / (1 + productData[index].taxRate / 100);
        const gridGrossAmt = productData[index].gridGross;
        let totalTax;
        if (istaxincludedFlag === "Y") {
          totalTax = gridGrossAmt - netUnitPrice * element;
        } else {
          totalTax = gridGrossAmt - netUnitPrice * element;
        }
        productData[index].totalTax = totalTax.toFixed(2);
        productData[index].totalDiscount =
          productData[index].totalDiscount === undefined || productData[index].totalDiscount === null || productData[index].totalDiscount === ""
            ? 0
            : productData[index].totalDiscount;

        if (element > 0 || ele2 > 0) {
          tempArray.push(productData[index]);
        }
      }
      for (let index3 = 0; index3 < tempArray.length; index3 += 1) {
        tempArray[index3].receivingQty === undefined ? 0 : tempArray[index3].receivingQty;
      }
      let flag;
      for (let index6 = 0; index6 < tempArray.length; index6 += 1) {
        const orderQtyelement = parseFloat(tempArray[index6].orderedQty);
        const receivingQtyelement = parseFloat(tempArray[index6].receivingQty);
        if (receivingQtyelement > orderQtyelement) {
          flag = false;
        } else {
        }
      }
      if (flag === false) {
        message.error("Total Receiving qty shouldn’t be greater than Order qty");
      } else {
        setGrnSummaryData(tempArray);
        const uniqId = uuid()
          .replace(/-/g, "")
          .toUpperCase();
        setUniqueId(uniqId);
      }
    }
  };

  const getSelectedRecord = (data) => {
    if(data?.dynamicArry !== undefined){
      form.setFieldsValue({
        dyanamicFileds : data.dynamicArry
      })
    }else{
      form.setFieldsValue({
        dyanamicFileds : []
      })
    }
    let disableBatch;
    if (withOrwithoutPoValue === "1") {
      if (data.batchedProduct === "Y") {
        disableBatch = false;
      } else {
        disableBatch = true;
      }
      const margin1 = (((data.priceList1 - data.priceStd2) / data.priceList1) * 100).toFixed(2);
      data.oldMargin = margin1;
      form.setFieldsValue({
        Value: data.value,
        Name: data.productName,
        UOM: data.uomName,
        receivingQty: data.receivingQty,
        FreeQty: data.freeqty,
        orderedQty: data.orderedQty,
        poFreeQty: data.poFreeQty,
        receivedQty: data.receivedqty,
        DiscountType: data.DiscountType,
        discountValue: data.discountvalue,
        BasePriceChange: data.priceStd1,
        salePrice:data.salePrice,
        unitPrice: data.priceStd,
        netUnitPrice: data.netUnitPrice,
        priceList: data.priceList,
        margin: data.margin,
        OldMargin: data.oldMargin,
        GrossAmount: data.gridGross,
        totalDiscount: data.totalDiscount,
        batchNo: data.batchNo,
        mfg_date: data.mfg_date === undefined || data.mfg_date === null ? null : moment(data.mfg_date),
        expiry_date: data.expiry_date === undefined || data.expiry_date === null ? null : moment(data.expiry_date),
        description: data.description,
        netAmount: data.lineNetGross,
      });
      const disabledDiscountType1 = data.isPoTotalDiscoutValue === null ? false : true;
      setSelectedGridRecord(data);
      setChangePriceDisabledFlag(true)
      setDisabledDiscountType(disabledDiscountType1);
      setDisableBatchField(disableBatch);
    } else {
      let disableBatch;
      if (data.batchedProduct === "Y") {
        disableBatch = false;
      } else {
        disableBatch = true;
      }
      const disabledFlagg = data.DiscountType === "" || data.DiscountType === null || data.DiscountType === undefined ? false : true;
      const margin = (((data.priceList - data.priceStd) / data.priceList) * 100).toFixed(2);
      data.margin = margin;
      const margin1 = (((data.priceList1 - data.priceStd2) / data.priceList1) * 100).toFixed(2);
      data.oldMargin = margin1;
      form.setFieldsValue({
        Value: data.value,
        Name: data.productName,
        UOM: data.uomName,
        receivingQty: data.receivingQty,
        FreeQty: data.freeqty,
        orderedQty: data.orderedQty,
        poFreeQty: data.poFreeQty,
        receivedQty: data.receivedqty,
        DiscountType: data.DiscountType,
        discountValue: data.discountvalue,
        BasePriceChange: data.priceStd1,
        unitPrice: data.priceStd,
        netUnitPrice: data.netUnitPrice,
        salePrice: data.salePrice,
        priceList: data.priceList,
        margin: margin,
        OldMargin: data.oldMargin,
        GrossAmount: data.gridGross,
        totalDiscount: data.totalDiscount,
        batchNo: data.batchNo,
        mfg_date: data.mfg_date === undefined || data.mfg_date === null ? null : moment(data.mfg_date),
        expiry_date: data.expiry_date === undefined || data.expiry_date === null ? null : moment(data.expiry_date),
        description: data.description,
        netAmount: data.lineNetGross,
      });
      setSelectedGridRecord(data);
      setChangePriceDisabledFlag(true)
      setDisableDiscountInput(disabledFlagg);
      setDisableBatchField(disableBatch);
    }
  };

  const onselectedProduct = (e,data) =>{
    const data2 =  data.data
    getSelectedRecord(data2)
    setBatchVisible(true)
    }

  const onSearchFunction = values => {
    setChangePriceDisabledFlag(true)
    // setSelectedProductObject({})
    form.resetFields([
        // 'Value',
        'Name',
        'UOM',
        'receivingQty',
        'FreeQty',
        'orderedQty',
        'poFreeQty',
        'receivedQty',
        'DiscountType',
        'discountValue',
        'BasePriceChange',
        'unitPrice',
        'netUnitPrice',
        'salePrice',
        'priceList',
        'margin',
        'OldMargin',
        'GrossAmount',
        'totalDiscount',
        'batchNo',
        'mfg_date',
        'expiry_date',
        'description',
        'netAmount',
      ]
      )
      const authHeaders = getOAuthHeaders();
      if (authHeaders && authHeaders.email && authHeaders.access_token) {
    const getProducts = {
      query: `query {
        getPurchaseProduct (bunitId : "${bunitId}", supplierId : "${supplierId}",
        product : "${values}",
        limit : 100){
          clientId
                  bunitId
                  productId
                  value
                  name
                  upc
                  description
                  qtyOnHand
                  uomId
                  uomName
                  productCategoryId
                  productCategoryName
                  taxCategoryId
                  taxCategoryName
                  taxId
                  taxName
                  taxRate
                  priceStd
                  priceList
                  twoWeekSale
                  fourWeekSale
                  isTaxIncluded
                  salePrice
                  restrictMargin
                  actualCostPrice
                  batchedProduct
                  alternateUomList {
                      alternateUomId uomId uomName
                  }
                  margin
      }    
      }`,
    }
    Axios({
      url: serverUrl,
      method: 'POST',
      data: getProducts,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${authHeaders.access_token}`,
      },
    }).then(response => {
      const getPurchaseData = response.data.data.getPurchaseProduct    
      for (let index = 0; index < getPurchaseData.length; index+=1) {
        getPurchaseData[index].key = getPurchaseData[index].productId
        getPurchaseData[index].skuValue = getPurchaseData[index].value
        getPurchaseData[index].skuName = getPurchaseData[index].value
        getPurchaseData[index].productName = getPurchaseData[index].name
        getPurchaseData[index].priceList1 = getPurchaseData[index].priceList;
        getPurchaseData[index].priceStd1 = getPurchaseData[index].priceStd;
        getPurchaseData[index].priceStd2 = getPurchaseData[index].priceStd;
        getPurchaseData[index].margin = (((getPurchaseData[index].priceList - getPurchaseData[index].priceStd) / getPurchaseData[index].priceList) * 100).toFixed(2);
        getPurchaseData[index].oldMargin = (((getPurchaseData[index].priceList - getPurchaseData[index].priceStd) / getPurchaseData[index].priceList) * 100).toFixed(2);
        // getPurchaseData[index].value = getPurchaseData[index].productCode;
        getPurchaseData[index].productSearchKey = getPurchaseData[index].value;
        let istaxFlag = istaxincludedFlag;
        let netUnitPrice;
        let unitPrice;
        if (istaxFlag === "Y") {
          netUnitPrice = (getPurchaseData[index].priceStd / (1 + getPurchaseData[index].taxRate / 100)).toFixed(2);
          unitPrice = getPurchaseData[index].priceStd
        } else{
          const netUnitPrice1 = getPurchaseData[index].priceStd;
          const taxOnUnitPrice = (getPurchaseData[index].taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
        }
        getPurchaseData[index].netUnitPrice = netUnitPrice;
        getPurchaseData[index].priceStd = unitPrice
      }
      setSkuSearchedProductData(getPurchaseData)
    })
  }
  }
  
  const getData = event => {
    onSearchFunction(event)
  }
  
  const debounce = (fn, d) => {
    let timer
    return function() {
      let context = searchInput,
        args = arguments
      clearTimeout(timer)
      timer = setTimeout(() => {
        getData.apply(context, arguments)
      }, d)
    }
  }
  const debounceLog = debounce(getData, 500)
  
  const searchDropdownRecords = e => {
    if(appConfig.sku === "Y"){
      debounceLog(e)
    }
  }

  const changePrice = () =>{
    if(Object.keys(selectedGridRecord).length > 0 ){
      setChangePriceDisabledFlag(false)
    }else{
      message.error("Select product to change price")
    }
  }

  const OnChangeOrderQty = () => {

    if (withOrwithoutPoValue === "1") {
      setTimeout(() => {
        const formFieldsData = form.getFieldsValue(true);
        let qty1 = 0
      formFieldsData.dyanamicFileds.map((element1)=>{
        if(element1.qty1 !== undefined && element1.qty1 !== null){
          qty1 = qty1+ parseInt(element1.qty1)
        }
      })
      let receivingQty
      if(isSplitBatch && formFieldsData.dyanamicFileds.length>0){
        receivingQty= qty1
      }else{
      receivingQty = formFieldsData.receivingQty;
      }
        let batchNo = formFieldsData.batchNo;
        let mfg_date = formFieldsData.mfg_date === "" || formFieldsData.mfg_date === undefined || formFieldsData.mfg_date === null ? null : formFieldsData.mfg_date;
        let expiry_date = formFieldsData.expiry_date === "" || formFieldsData.expiry_date === undefined || formFieldsData.expiry_date === null ? null : formFieldsData.expiry_date;
        let totalPoOrderedQty = selectedGridRecord.orderedQty;
        let freeQty = formFieldsData.FreeQty;
        let netUnitPrice;
        let taxOnUnitPrice;
        let totalTax;
        let priceStd = formFieldsData.BasePriceChange;
        let gridGross;
        let taxRate = selectedGridRecord.taxRate;
        let totalDiscount;
        let lineNetGross;
        if (receivingQty > totalPoOrderedQty) {
          message.error("Receivig qty should not more than ordered qty");
          form.setFieldsValue({ receivingQty: 0 });
        } else {
          if (selectedGridRecord.isPoTotalDiscoutValue === "Total value Discount") {
            setDisableDiscountInput(false);
            const totalPoDiscount = selectedGridRecord.poTotalDiscount;
            const avgDiscount = totalPoDiscount / totalPoOrderedQty;
            selectedGridRecord.discountvalue = avgDiscount * receivingQty;
            totalDiscount = avgDiscount * receivingQty;
            selectedGridRecord.totalDiscount = totalDiscount;
            if (istaxincludedFlag === "Y") {
              netUnitPrice = (priceStd / (1 + taxRate / 100)).toFixed(2);
              taxOnUnitPrice = ((taxRate / 100) * priceStd).toFixed(2);
              totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
              gridGross = (priceStd * receivingQty).toFixed(2);
              lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
            } else {
              const netUnitPrice1 = (priceStd / (1 + taxRate / 100)).toFixed(2);
              taxOnUnitPrice = ((taxRate / 100) * netUnitPrice1).toFixed(2);
              netUnitPrice = parseFloat(priceStd) + parseFloat(taxOnUnitPrice);
              totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
              gridGross = (priceStd * receivingQty).toFixed(2);
              lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
            }
          } else if (selectedGridRecord.isPoTotalDiscoutValue === "Percentage") {
            setDisableDiscountInput(false);
            const totalPoDiscount = selectedGridRecord.poTotalDiscount;
            const avgDiscount = totalPoDiscount / totalPoOrderedQty;
            totalDiscount = avgDiscount * receivingQty;
            selectedGridRecord.totalDiscount = totalDiscount;
            if (istaxincludedFlag === "Y") {
              netUnitPrice = (priceStd / (1 + taxRate / 100)).toFixed(2);
              taxOnUnitPrice = ((taxRate / 100) * priceStd).toFixed(2);
              totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
              gridGross = (priceStd * receivingQty).toFixed(2);
              lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
            } else {
              const netUnitPrice1 = (priceStd / (1 + taxRate / 100)).toFixed(2);
              taxOnUnitPrice = ((taxRate / 100) * netUnitPrice1).toFixed(2);
              netUnitPrice = parseFloat(priceStd) + parseFloat(taxOnUnitPrice);
              totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
              gridGross = (priceStd * receivingQty).toFixed(2);
              lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
            }
          } else if (selectedGridRecord.isPoTotalDiscoutValue === "Value") {
            setDisableDiscountInput(false);
            selectedGridRecord.discountvalue = selectedGridRecord.discountvalue;
            selectedGridRecord.totalDiscount = selectedGridRecord.discountvalue * receivingQty;
            totalDiscount = selectedGridRecord.discountvalue * receivingQty;
            if (istaxincludedFlag === "Y") {
              netUnitPrice = (priceStd / (1 + taxRate / 100)).toFixed(2);
              taxOnUnitPrice = ((taxRate / 100) * priceStd).toFixed(2);
              totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
              gridGross = (priceStd * receivingQty).toFixed(2);
              lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
            } else {
              const netUnitPrice1 = (priceStd / (1 + taxRate / 100)).toFixed(2);
              taxOnUnitPrice = ((taxRate / 100) * netUnitPrice1).toFixed(2);
              netUnitPrice = parseFloat(priceStd) + parseFloat(taxOnUnitPrice);
              totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
              gridGross = (priceStd * receivingQty).toFixed(2);
              lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
            }
          } else {
            setDisableDiscountInput(true);
            getWithoutPoCalculations();
          }
          form.setFieldsValue({
            GrossAmount: gridGross,
            netUnitPrice: netUnitPrice,
            netAmount: lineNetGross,
          });
          const Obj = {
            description: "",
            DiscountType: selectedGridRecord.DiscountType,
            discountvalue: selectedGridRecord.discountvalue,
            totalDiscount: totalDiscount,
            documentNo: selectedGridRecord.documentNo,
            freeqty: freeQty === undefined || freeQty === null ? 0 : freeQty,
            gridGross: gridGross,
            line: selectedGridRecord.line,
            listPrice: selectedGridRecord.listPrice,
            margin: selectedGridRecord.margin,
            orderId: selectedGridRecord.orderId,
            orderLineId: selectedGridRecord.orderLineId,
            orderedQty: selectedGridRecord.orderedQty,
            pofreeqty: selectedGridRecord.pofreeqty,
            priceList: selectedGridRecord.priceList,
            priceStd: selectedGridRecord.priceStd,
            priceStd1: selectedGridRecord.priceStd,
            productId: selectedGridRecord.productId,
            productName: selectedGridRecord.productName,
            productSearchKey: selectedGridRecord.productSearchKey,
            receivedqty: selectedGridRecord.receivedqty,
            receivingQty: receivingQty,
            stockQty: selectedGridRecord.stockQty,
            stockUomId: selectedGridRecord.stockUomId,
            stockUomIdName: selectedGridRecord.stockUomIdName,
            unitPrice: selectedGridRecord.unitPrice,
            uomId: selectedGridRecord.uomId,
            uomName: selectedGridRecord.uomName,
            value: selectedGridRecord.value,
            netUnitPrice: netUnitPrice,
            salePrice:selectedGridRecord.salePrice,
            totalTax: totalTax,
            taxId: selectedGridRecord.taxId,
            taxName: selectedGridRecord.taxName,
            taxRate: selectedGridRecord.taxRate,
            isPoTotalDiscoutValue: selectedGridRecord.isPoTotalDiscoutValue,
            poTotalDiscount: selectedGridRecord.poTotalDiscount,
            batchedProduct: selectedGridRecord.batchedProduct,
            batchNo: batchNo,
            lineNetGross: lineNetGross,
            expiry_date: moment(expiry_date).format("YYYY-MM-DD") === "Invalid date" ? null : moment(expiry_date).format("YYYY-MM-DD"),
            mfg_date: moment(mfg_date).format("YYYY-MM-DD") === "Invalid date" ? null : moment(mfg_date).format("YYYY-MM-DD"),

          };
          const newArray = [];
          for (let index = 0; index < productData.length; index++) {
            const productIdFromArray = productData[index].productId;
            if (productIdFromArray !== selectedGridRecord.productId) {
              newArray.push(productData[index]);
            }
          }
          newArray.unshift(Obj);
          setProductData(newArray);
        }
      }, 300);
    } else {
      getWithoutPoCalculations();
    }

  };

  const getWithoutPoCalculations = () => {
    setTimeout(() => {
      const formFieldsData = form.getFieldsValue(true);
      const dynamicArry = formFieldsData.dyanamicFileds
      let qty1 = 0
      if(formFieldsData !== undefined ){
        formFieldsData?.dyanamicFileds.map((element1)=>{
          // if(element1.expiry_date){
          //   element1.expiry_date = moment(element1.expiry_date).format("YYYY-MM-DD")
          // }else if(element1.mfg_date){
          //   element1.mfg_date = moment(element1.mfg_date).format("YYYY-MM-DD")
          // }
          // dynamicArry.push(element1)
          if(element1?.qty1 !== undefined){
            qty1 = qty1+ parseInt(element1.qty1)
          }
        })
      }
     
      let batchNo = formFieldsData.batchNo;
      let mfg_date = formFieldsData.mfg_date === "" ? null : formFieldsData.mfg_date;
      let expiry_date = formFieldsData.expiry_date === "" ? null : formFieldsData.expiry_date;
      const discountType = formFieldsData.DiscountType;
      let orQty
      if(isSplitBatch && formFieldsData.dyanamicFileds.length>0){
        orQty = qty1
        qty1 = qty1
      }else{
        orQty= formFieldsData.receivingQty === null || formFieldsData.receivingQty === undefined ? 0 : formFieldsData.receivingQty;
        qty1 = formFieldsData.receivingQty === null || formFieldsData.receivingQty === undefined ? 0 : formFieldsData.receivingQty;
      }
      // let basePrice = formFieldsData.receivingQty
      // orQty = orQty + qty1
      let freeqty = formFieldsData.FreeQty;
      let margin;
      let gridGrossAmt;
      let totalDiscount = 0;
      let unitPrice;
      let netUnitPrice;
      let totalTax;
      let price;
      let lineNetGross;
      let dprice = formFieldsData.discountValue === null || formFieldsData.discountValue === undefined ? 0 : formFieldsData.discountValue;
      let d3 = dprice / orQty;
      let d4 = isNaN(d3);
      // let initialPriceList = selectedGridRecord.priceList;
      const basePrice = parseFloat(formFieldsData.BasePriceChange)
      const salePrice = parseFloat(formFieldsData.salePrice)
      let initialPriceList = parseFloat(formFieldsData.priceList)

      let BpriceList = selectedGridRecord.priceList;
      let Bsaleprice = selectedGridRecord.salePrice;

      let flag = true
      let flag2 = true
      if(initialPriceList < basePrice){
        flag = false
      }else if (salePrice < basePrice){
        flag2 = false
      }else{
      flag = true
      }

      if(selectedGridRecord.restrictMargin === "Y"){
        if(flag === false){
          message.error("Mrp should not be less than base price")
          form.setFieldsValue({'priceList':BpriceList})
        }else if(flag2 === false){
         message.error("Sale Price should not be less than base price")
         form.setFieldsValue({'salePrice':Bsaleprice})
        }
      }

      if (d4 === true) {
        price = 0;
      } else {
        price = d3;
      }
      if (discountType === undefined || discountType === null) {
        setDisableDiscountInput(false);
        if (istaxincludedFlag === "Y") {
          const netUnitPrice1 = basePrice / (1 + selectedGridRecord.taxRate / 100) - price;
          const taxOnUnitPrice = (selectedGridRecord.taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((initialPriceList - unitPrice1) / initialPriceList) * 100;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          lineNetGross = (netUnitPrice1 * orQty).toFixed(2);
        } else {
          const netUnitPrice1 = (basePrice - price).toFixed(2);
          const taxOnUnitPrice = (selectedGridRecord.taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((initialPriceList - unitPrice1) / initialPriceList) * 100;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          lineNetGross = (netUnitPrice1 * orQty).toFixed(2);
        }
      } else if (discountType === "Total value Discount") {
        setDisableDiscountInput(true);
        if (istaxincludedFlag === "Y") {
          const netUnitPrice1 = basePrice / (1 + selectedGridRecord.taxRate / 100) - price;
          const taxOnUnitPrice = (selectedGridRecord.taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((initialPriceList - unitPrice1) / initialPriceList) * 100;
          const basePriceAfterTax = basePrice / (1 + selectedGridRecord.taxRate / 100);
          const totalDiscount1 = basePriceAfterTax * orQty - netUnitPrice1 * orQty;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2);
          totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          lineNetGross = (netUnitPrice1 * orQty).toFixed(2);
        } else {
          const netUnitPrice1 = basePrice - price;
          const taxOnUnitPrice = (selectedGridRecord.taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((initialPriceList - unitPrice1) / initialPriceList) * 100;
          const totalDiscount1 = basePrice * orQty - netUnitPrice1 * orQty;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2);
          totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          lineNetGross = (netUnitPrice1 * orQty).toFixed(2);
        }
      } else if (discountType === "Percentage") {
        setDisableDiscountInput(true);
        if (istaxincludedFlag === "Y") {
          const costPrice3 = basePrice / (1 + selectedGridRecord.taxRate / 100);
          const discountAmount = (dprice / 100) * costPrice3;

          const netUnitPrice1 = basePrice / (1 + selectedGridRecord.taxRate / 100) - discountAmount;
          const taxOnUnitPrice = (selectedGridRecord.taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((initialPriceList - unitPrice1) / initialPriceList) * 100;
          const basePriceAfterTax = basePrice / (1 + selectedGridRecord.taxRate / 100);
          const totalDiscount1 = basePriceAfterTax * orQty - netUnitPrice1 * orQty;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2);
          totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          lineNetGross = (netUnitPrice1 * orQty).toFixed(2);
        } else {
          const discountAmount = (dprice / 100) * basePrice;
          const netUnitPrice1 = basePrice - discountAmount;
          const taxOnUnitPrice = (selectedGridRecord.taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((initialPriceList - unitPrice1) / initialPriceList) * 100;
          const totalDiscount1 = basePrice * orQty - netUnitPrice1 * orQty;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2);
          totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          lineNetGross = (netUnitPrice1 * orQty).toFixed(2);
        }
      } else if (discountType === "Value") {
        setDisableDiscountInput(true);
        if (istaxincludedFlag === "Y") {
          const netUnitPrice1 = basePrice / (1 + selectedGridRecord.taxRate / 100) - dprice;
          const taxOnUnitPrice = (selectedGridRecord.taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((initialPriceList - unitPrice1) / initialPriceList) * 100;
          const basePriceAfterTax = basePrice / (1 + selectedGridRecord.taxRate / 100);
          const totalDiscount1 = basePriceAfterTax * orQty - netUnitPrice1 * orQty;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2);
          totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          lineNetGross = (netUnitPrice1 * orQty).toFixed(2);
        } else {
          const netUnitPrice1 = basePrice - dprice;
          const taxOnUnitPrice = (selectedGridRecord.taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((initialPriceList - unitPrice1) / initialPriceList) * 100;
          const totalDiscount1 = basePrice * orQty - netUnitPrice1 * orQty;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2);
          totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          lineNetGross = (netUnitPrice1 * orQty).toFixed(2);
        }
      }
      form.setFieldsValue({
        GrossAmount: gridGrossAmt,
        unitPrice: unitPrice,
        netUnitPrice: netUnitPrice,
        margin: margin,
        totalDiscount: totalDiscount,
        netAmount: lineNetGross,
        // receivingQty : qty1
      });
      const Obj = {
        DiscountType: discountType,
        description: "",
        discountvalue: dprice,
        totalDiscount: totalDiscount,
        documentNo: selectedGridRecord.documentNo,
        freeqty: freeqty === undefined || freeqty === null ? 0 : freeqty,
        gridGross: gridGrossAmt,
        line: selectedGridRecord.line,
        listPrice: selectedGridRecord.listPrice,
        margin: margin,
        oldMargin: (((selectedGridRecord.priceList1 - selectedGridRecord.priceStd2) / selectedGridRecord.priceList1) * 100).toFixed(2),
        orderId: selectedGridRecord.orderId,
        salePrice: salePrice,
        orderLineId: selectedGridRecord.orderLineId,
        orderedQty: selectedGridRecord.orderedQty,
        pofreeqty: selectedGridRecord.pofreeqty,
        // priceList: selectedGridRecord.priceList,
        priceList: initialPriceList,
        priceList1: selectedGridRecord.priceList1,
        priceStd: unitPrice,
        priceStd1: formFieldsData.BasePriceChange,
        priceStd2: selectedGridRecord.priceStd2,
        productId: selectedGridRecord.productId,
        productName: selectedGridRecord.productName,
        productSearchKey: selectedGridRecord.productSearchKey,
        receivedqty: selectedGridRecord.receivedqty,
        receivingQty: orQty,
        stockQty: selectedGridRecord.stockQty,
        stockUomId: selectedGridRecord.stockUomId,
        stockUomIdName: selectedGridRecord.stockUomIdName,
        unitPrice: selectedGridRecord.unitPrice,
        uomId: selectedGridRecord.uomId,
        uomName: selectedGridRecord.uomName,
        value: selectedGridRecord.value,
        upc: selectedGridRecord.upc,
        netUnitPrice: netUnitPrice,
        taxId: selectedGridRecord.taxId,
        taxName: selectedGridRecord.taxName,
        taxRate: selectedGridRecord.taxRate,
        totalTax: totalTax,
        batchedProduct: selectedGridRecord.batchedProduct,
        batchNo: batchNo,
        lineNetGross: lineNetGross,
        expiry_date: moment(expiry_date).format("YYYY-MM-DD") === "Invalid date" ? null : moment(expiry_date).format("YYYY-MM-DD"),
        mfg_date: moment(mfg_date).format("YYYY-MM-DD") === "Invalid date" ? null : moment(mfg_date).format("YYYY-MM-DD"),
        dynamicArry :dynamicArry
      };
      const newArray = [];
      for (let index = 0; index < productData.length; index++) {
        const productIdFromArray = productData[index].productId;
        if (productIdFromArray !== selectedGridRecord.productId) {
          newArray.push(productData[index]);
        }
      }
      newArray.unshift(Obj);
      setProductData(newArray);
    }, 1000);
  };

  const scanUpcOrSku = (event) => {
    form.resetFields(["GrossAmount", "receivingQty", "batchNo"]);
    form.setFieldsValue({ mfg_date: "", expiry_date: "" });
    const code = event.keyCode || event.which;
    let productIdToMatch;
    if (withOrwithoutPoValue === "1") {
      if (code === 13) {
        skuform.resetFields();
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
          let additionalArray = [];
          let arrayforForm = [];
          for (let index = 0; index < productData.length; index++) {
            let element;
            if (upcOrSku === "sku") {
              element = productData[index].value;
            } else {
              element = productData[index].upc;
            }
            if (element === event.target.value) {
              const isBatchedFlag = productData[index].batchedProduct;
              if (isBatchedFlag === "Y") {
                setBatchModalVisible(true);
                setDisableBatchField(false);
              } else {
                setBatchModalVisible(false);
                setDisableBatchField(true);
              }
              productIdToMatch = productData[index].productId;
              let orderedty = productData[index].orderedQty;
              let receivingQty =
                productData[index].receivingQty === undefined || productData[index].receivingQty === "" || productData[index].receivingQty === 0
                  ? 1
                  : parseInt(productData[index].receivingQty) + 1;
              let netUnitPrice;
              let taxOnUnitPrice;
              let totalTax;
              let priceStd = productData[index].priceStd;
              let gridGross;
              let taxRate = productData[index].taxRate;
              let totalDiscount;
              let lineNetGross;
              if (receivingQty > orderedty) {
                message.error("Receivig qty should not more than ordered qty");
                form.setFieldsValue({ receivingQty: "" });
              } else {
                if (productData[index].isPoTotalDiscoutValue === "Total value Discount") {
                  const totalPoDiscount = productData[index].poTotalDiscount;
                  const avgDiscount = totalPoDiscount / orderedty;
                  productData[index].discountvalue = avgDiscount * receivingQty;
                  totalDiscount = avgDiscount * receivingQty;
                  productData[index].totalDiscount = totalDiscount.toFixed(2);
                  if (istaxincludedFlag === "Y") {
                    netUnitPrice = (priceStd / (1 + taxRate / 100)).toFixed(2);
                    taxOnUnitPrice = ((taxRate / 100) * priceStd).toFixed(2);
                    totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
                    gridGross = (priceStd * receivingQty).toFixed(2);
                    lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
                  } else {
                    const netUnitPrice1 = (priceStd / (1 + taxRate / 100)).toFixed(2);
                    taxOnUnitPrice = ((taxRate / 100) * netUnitPrice1).toFixed(2);
                    netUnitPrice = parseFloat(priceStd) + parseFloat(taxOnUnitPrice);
                    totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
                    gridGross = (priceStd * receivingQty).toFixed(2);
                    lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
                  }
                  productData[index].receivingQty =
                    productData[index].receivingQty === undefined || detailsOfGridPo[index].productData === "" || detailsOfGridPo[index].productData === 0
                      ? 1
                      : parseInt(detailsOfGridPo[index].productData) + 1;
                  productData[index].gridGross = gridGross;
                  productData[index].DiscountType = productData[index].DiscountType;
                  productData[index].netUnitPrice = netUnitPrice;
                  productData[index].totalDiscount = totalDiscount.toFixed(2);
                  productData[index].lineNetGross = lineNetGross;
                  arrayforForm.push(productData[index]);
                  // this.getWithoutPoCalculations()
                } else if (productData[index].isPoTotalDiscoutValue === "Percentage") {
                  const totalPoDiscount = productData[index].poTotalDiscount;
                  const avgDiscount = totalPoDiscount / orderedty;
                  totalDiscount = avgDiscount * receivingQty;
                  productData[index].totalDiscount = totalDiscount.toFixed(2);
                  if (istaxincludedFlag === "Y") {
                    netUnitPrice = (priceStd / (1 + taxRate / 100)).toFixed(2);
                    taxOnUnitPrice = ((taxRate / 100) * priceStd).toFixed(2);
                    totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
                    gridGross = (priceStd * receivingQty).toFixed(2);
                    lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
                  } else {
                    const netUnitPrice1 = (priceStd / (1 + taxRate / 100)).toFixed(2);
                    taxOnUnitPrice = ((taxRate / 100) * netUnitPrice1).toFixed(2);
                    netUnitPrice = parseFloat(priceStd) + parseFloat(taxOnUnitPrice);
                    totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
                    gridGross = (priceStd * receivingQty).toFixed(2);
                    lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
                  }
                  productData[index].receivingQty =
                    productData[index].receivingQty === undefined || productData[index].receivingQty === "" || productData[index].receivingQty === 0
                      ? 1
                      : parseInt(productData[index].receivingQty) + 1;
                  productData[index].gridGross = gridGross;
                  productData[index].DiscountType = productData[index].DiscountType;
                  productData[index].netUnitPrice = netUnitPrice;
                  productData[index].totalDiscount = totalDiscount.toFixed(2);
                  productData[index].lineNetGross = lineNetGross;
                  arrayforForm.push(productData[index]);
                } else if (productData[index].isPoTotalDiscoutValue === "Value") {
                  productData[index].discountvalue = productData[index].discountvalue;
                  productData[index].totalDiscount = productData[index].discountvalue * receivingQty;
                  totalDiscount = productData[index].discountvalue * receivingQty;
                  if (istaxincludedFlag === "Y") {
                    netUnitPrice = (priceStd / (1 + taxRate / 100)).toFixed(2);
                    taxOnUnitPrice = ((taxRate / 100) * priceStd).toFixed(2);
                    totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
                    gridGross = (priceStd * receivingQty).toFixed(2);
                    lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
                  } else {
                    const netUnitPrice1 = (priceStd / (1 + taxRate / 100)).toFixed(2);
                    taxOnUnitPrice = ((taxRate / 100) * netUnitPrice1).toFixed(2);
                    netUnitPrice = parseFloat(priceStd) + parseFloat(taxOnUnitPrice);
                    totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
                    gridGross = (priceStd * receivingQty).toFixed(2);
                    lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
                  }
                  productData[index].receivingQty =
                    productData[index].receivingQty === undefined || productData[index].receivingQty === "" || productData[index].receivingQty === 0
                      ? 1
                      : parseInt(productData[index].receivingQty) + 1;
                  productData[index].gridGross = gridGross;
                  productData[index].DiscountType = productData[index].DiscountType;
                  productData[index].netUnitPrice = netUnitPrice;
                  productData[index].lineNetGross = lineNetGross;
                  productData[index].totalDiscount = totalDiscount.toFixed(2);
                  arrayforForm.push(productData[index]);
                } else {
                  setDisabledDiscountType(false);
                  setDisableDiscountInput(true);
                  if (istaxincludedFlag === "Y") {
                    netUnitPrice = (priceStd / (1 + taxRate / 100)).toFixed(2);
                    taxOnUnitPrice = ((taxRate / 100) * priceStd).toFixed(2);
                    totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
                    gridGross = (priceStd * receivingQty).toFixed(2);
                    lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
                  } else {
                    const netUnitPrice1 = (priceStd / (1 + taxRate / 100)).toFixed(2);
                    taxOnUnitPrice = ((taxRate / 100) * netUnitPrice1).toFixed(2);
                    netUnitPrice = parseFloat(priceStd) + parseFloat(taxOnUnitPrice);
                    totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
                    gridGross = (priceStd * receivingQty).toFixed(2);
                    lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
                  }
                  productData[index].receivingQty =
                    productData[index].receivingQty === undefined || productData[index].receivingQty === "" || productData[index].receivingQty === 0
                      ? 1
                      : parseInt(productData[index].receivingQty) + 1;
                  productData[index].gridGross = (priceStd * receivingQty).toFixed(2);
                  productData[index].DiscountType = productData[index].DiscountType;
                  productData[index].netUnitPrice = netUnitPrice;
                  productData[index].totalDiscount = totalDiscount;
                  productData[index].lineNetGross = lineNetGross;
                  arrayforForm.push(productData[index]);
                }
              }
            }
            additionalArray.push(productData[index]);
          }
          const newData = arrayforForm[0];
          form.setFieldsValue({
            Value: newData.value,
            Name: newData.productName,
            UOM: newData.uomName,
            receivingQty: newData.receivingQty,
            FreeQty: newData.freeqty,
            orderedQty: newData.orderedQty,
            poFreeQty: newData.poFreeQty,
            receivedQty: newData.receivedqty,
            DiscountType: newData.DiscountType,
            discountValue: newData.discountvalue,
            BasePriceChange: newData.priceStd1,
            unitPrice: newData.priceStd,
            netUnitPrice: newData.netUnitPrice,
            priceList: newData.priceList,
            margin: newData.margin,
            OldMargin: newData.oldMargin,
            GrossAmount: newData.gridGross,
            totalDiscount: newData.totalDiscount,
            batchNo: newData.batchNo,
            salePrice:newData.salePrice,
            mfg_date: newData.mfg_date === undefined || newData.mfg_date === null ? null : moment(newData.mfg_date),
            expiry_date: newData.expiry_date === undefined || newData.expiry_date === null ? null : moment(newData.expiry_date),
            description: newData.description,
            netAmount: newData.lineNetGross,
          });

          setSelectedGridRecord(arrayforForm[0]);
          const newArray = [];
          for (let index = 0; index < additionalArray.length; index++) {
            const productIdFromArray = additionalArray[index].productId;
            if (productIdFromArray !== productIdToMatch) {
              newArray.push(additionalArray[index]);
            }
          }
          newArray.unshift(arrayforForm[0]);
          setTimeout(() => {
            skuform.resetFields(["upcsku"]);
            setProductData([]);
            setProductData(newArray);
          }, 1);
        } else {
          message.error("Product not found in po");
          form.resetFields();
          skuform.resetFields(["upcsku"]);
        }
      }
    } else {
      let upcOrSku;
      if (radioValue === 1) {
        upcOrSku = "upc";
      } else {
        upcOrSku = "sku";
      }
      if (code === 13) {
        const index = productData.findIndex((element) => {
          if (upcOrSku === "sku") {
            return element.value === event.target.value;
          } else {
            return element.upc === event.target.value;
          }
        });
        // skuform.resetFields(['upcsku'])
        if (index >= 0) {
          let additionalArray = [];
          let arrayforForm = [];
          let productIdToMatch2;
          for (let index = 0; index < productData.length; index++) {
            let element;
            if (upcOrSku === "sku") {
              element = productData[index].value;
            } else {
              element = productData[index].upc;
            }
            if (element === event.target.value) {
              const isBatchedFlag = productData[index].batchedProduct;
              if (isBatchedFlag === "Y") {
                setBatchModalVisible(true);
                setDisableBatchField(false);
              } else {
                setBatchModalVisible(false);
                setDisableBatchField(true);
              }
              productIdToMatch2 = productData[index].productId;
              productData[index].receivingQty =
                productData[index].receivingQty === undefined || productData[index].receivingQty === "" || productData[index].receivingQty === 0
                  ? 1
                  : parseInt(productData[index].receivingQty) + 1;
              productData[index].gridGross = (productData[index].receivingQty * productData[index].priceStd).toFixed(2);
              productData[index].lineNetGross = (productData[index].receivingQty * productData[index].netUnitPrice).toFixed(2);
              productData[index].DiscountType = productData[index].DiscountType;
              productData[index].totalDiscount = productData[index].totalDiscount;
              arrayforForm.push(productData[index]);
            }
            additionalArray.push(productData[index]);
          }
          const newData = arrayforForm[0];
          form.setFieldsValue({
            Value: newData.value,
            Name: newData.productName,
            UOM: newData.uomName,
            receivingQty: newData.receivingQty,
            FreeQty: newData.freeqty,
            orderedQty: newData.orderedQty,
            poFreeQty: newData.poFreeQty,
            receivedQty: newData.receivedqty,
            DiscountType: newData.DiscountType,
            discountValue: newData.discountvalue,
            BasePriceChange: newData.priceStd1,
            unitPrice: newData.priceStd,
            netUnitPrice: newData.netUnitPrice,
            priceList: newData.priceList,
            margin: newData.margin,
            OldMargin: newData.oldMargin,
            GrossAmount: newData.gridGross,
            totalDiscount: newData.totalDiscount,
            salePrice:newData.salePrice,
            batchNo: newData.batchNo,
            mfg_date: newData.mfg_date === undefined || newData.mfg_date === null ? null : moment(newData.mfg_date),
            expiry_date: newData.expiry_date === undefined || newData.expiry_date === null ? null : moment(newData.expiry_date),
            description: newData.description,
            netAmount: newData.lineNetGross,
          });
          setSelectedGridRecord(arrayforForm[0]);
          const newArray = [];
          for (let index = 0; index < additionalArray.length; index++) {
            const productIdFromArray = additionalArray[index].productId;
            if (productIdFromArray !== productIdToMatch2) {
              newArray.push(additionalArray[index]);
            }
          }
          newArray.unshift(arrayforForm[0]);
          setTimeout(() => {
            skuform.resetFields(["upcsku"]);
            setProductData([]);
            setProductData(newArray);
          }, 1);
        } else {
          message.error("Product not found");
          form.resetFields();
          skuform.resetFields(["upcsku"]);
        }
      }
    }
  };

  const addCostCancel = () => {
    setAddCostVisible(false);
  };

  const onSelectLandedCost = (e, data) => {
    setSelectedLandedCost(data.props.data);
  };
  const addCostToGrid = () => {
    const formFieldsData = otherCostForm.getFieldsValue(true);
    const uniqueId = uuid()
      .replace(/-/g, "")
      .toUpperCase();
    const costObj = {
      id: uniqueId,
      calcMethod: selectedLandedCost.calcMethod,
      name: selectedLandedCost.name,
      mProductId: selectedLandedCost.product.mProductId,
      costPrice: formFieldsData.costEntered,
      csTaxId: selectedLandedCost.csTaxId,
      pLcTypeId: selectedLandedCost.pLcTypeId,
    };
    setOtherCostData([...otherCostData, costObj]);
    setSelectedLandedCost([]);
    setAddCostVisible(false);
    otherCostForm.resetFields();
  };

  const getLandedCost = async () => {
    const getLandedCostResponse = await getLandedCostData();
    setLandedCostDropDownData(getLandedCostResponse);
  };

  const openCostModal = () => {
    setAddCostVisible(true);
  };

  const disabledPreviousDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const closeSummaryModal = () => {
    setSummaryModalVisible(false);
  };

  const createGRN = () => {
    const authHeaders = getOAuthHeaders();
    if (authHeaders && authHeaders.email && authHeaders.access_token) {
    summaryForm.validateFields().then((values) => {
      setLoading(true);
      let invoiceNo = values.summinvoiceNo;
      let invoiceDate = moment(values.summinvoiceDate).format("YYYY-MM-DD");
      let movementDate = moment(values.summreceiptdate).format("YYYY-MM-DD");
      let netUnitPrice = "";
      let productID = "";
      let uomID = "";
      let quantity = "";
      let orderID = "";
      let remark = "";
      let descriptioN = "";
      let salePrice;
      let freeqty = "";
      let unitPrice = "";
      let listPrice = "";
      let discountValue = "";
      let discountType = "";
      let totalDiscount = "";
      let PLcTypeId = "";
      let Value = "";
      let MProductId = "";
      let CsTaxId = "";
      let orderLineId = "";
      let batchNo = "";
      let expiry_date = "";
      let mfg_date = "";
      const newOrderId = orderId;
      const metaLines = []
      let dynamicFormData = form.getFieldsValue(true)
        Object.entries(dynamicFormData).map((element)=>{ 
          appConfig.dynamicFiledsGRN.map((item)=>{
          if( element[0] === item.label){
            if (item.type === "DA" && item.defaultValue !== null && item.defaultValue !== undefined  && item.defaultValue !== ""){
              item.defaultValue = moment(element[1]).format("YYYY-MM-DD")
              metaLines.push(`{
                key:"${item.label}",
                value:"${item.defaultValue}"
              }`)}else if (item.type === "DT" && item.defaultValue !== null && item.defaultValue !== undefined  && item.defaultValue !== ""){
              item.defaultValue = moment(element[1]).format("YYYY-MM-DD HH:MM")
                metaLines.push(`{
                  key:"${item.label}",
                  value:"${item.defaultValue}"
                }`)}else if (item.type === "TI" && item.defaultValue !== null && item.defaultValue !== undefined && item.defaultValue !== "")  {
            item.defaultValue = moment(element[1]).format("HH:mm:ss")
                  metaLines.push(`{
                    key:"${item.label}",
                    value:"${item.defaultValue}"
                  }`)}else if( element[1] !== null && element[1] !== undefined && element[1] !== "" ){
                    item.defaultValue = element[1]
            metaLines.push(`{
              key:"${item.label}",
              value:"${item.defaultValue}"
            }`)
            }
          }
        })
       
      })


      let dyanamicFiledsData = dynamicFormData.dyanamicFileds
      

      const arrayForMutation = [];
      const arrayForLandedCost = [];
      for (let index2 = 0; index2 < otherCostData.length; index2++) {
        PLcTypeId = otherCostData[index2].pLcTypeId;
        Value = otherCostData[index2].costPrice;
        MProductId = otherCostData[index2].mProductId;
        CsTaxId = otherCostData[index2].csTaxId;
        arrayForLandedCost.push(
          `{
          pLcTypeId : "${PLcTypeId}",
          value :  ${Value},      
          productId : "${MProductId}",
          taxId : "${CsTaxId}"
        }`
        );
      }

      for (let index = 0; index < grnSummaryData.length; index += 1) {
      const batchedData = []
      if(grnSummaryData[index].dynamicArry !== undefined || grnSummaryData[index].dynamicArry !== null || grnSummaryData[index].dynamicArry !== []){
        for(let i=0; i<grnSummaryData[index].dynamicArry?.length; i++){
          batchedData.push(`
          {
            batchId: null,
            batchNo:${grnSummaryData[index].dynamicArry[i].batchNo === undefined || grnSummaryData[index].dynamicArry[i].batchNo === null || grnSummaryData[index].dynamicArry[i].batchNo === "" ? null : `"${grnSummaryData[index].dynamicArry[i].batchNo}"`},
            expiryDate:${grnSummaryData[index].dynamicArry[i].expiry_date === undefined || grnSummaryData[index].dynamicArry[i].expiry_date === null || grnSummaryData[index].dynamicArry[i].expiry_date === "" || grnSummaryData[index].dynamicArry[i].expiry_date === "Invalid date" ? null : `"${moment(grnSummaryData[index].dynamicArry[i].expiry_date).format("YYYY-MM-DD")}"`},
            endDate: ${grnSummaryData[index].dynamicArry[i].expiry_date === undefined || grnSummaryData[index].dynamicArry[i].expiry_date === null || grnSummaryData[index].dynamicArry[i].expiry_date === "" || grnSummaryData[index].dynamicArry[i].expiry_date === "Invalid date" ? null : `"${moment(grnSummaryData[index].dynamicArry[i].expiry_date).format("YYYY-MM-DD")}"`},
            storagebinId:null,
            startDate:${grnSummaryData[index].dynamicArry[i].mfg_date === undefined || grnSummaryData[index].dynamicArry[i].mfg_date === null || grnSummaryData[index].dynamicArry[i].mfg_date === "" || grnSummaryData[index].dynamicArry[i].mfg_date === "Invalid date" ? null : `"${moment(grnSummaryData[index].dynamicArry[i].mfg_date).format("YYYY-MM-DD")}"`},
            qty : ${grnSummaryData[index].dynamicArry[i].qty1},
          }
          `)
        }
      }
        

        batchNo = grnSummaryData[index].batchNo;
        expiry_date = grnSummaryData[index].expiry_date === "Invalid date" ? null : grnSummaryData[index].expiry_date;
        mfg_date = grnSummaryData[index].mfg_date === "Invalid date" ? null : grnSummaryData[index].mfg_date;
        productID = grnSummaryData[index].productId;
        salePrice = grnSummaryData[index].salePrice;
        netUnitPrice = grnSummaryData[index].netUnitPrice;
        uomID = grnSummaryData[index].uomId;
        quantity = grnSummaryData[index].receivingQty;
        remark = grnSummaryData[index].Remark;
        freeqty = grnSummaryData[index].freeqty;
        descriptioN =
          grnSummaryData[index].description === null ||
          grnSummaryData[index].description === "" ||
          grnSummaryData[index].description === undefined ||
          grnSummaryData[index].description === "null"
            ? ""
            : grnSummaryData[index].description;
        unitPrice = grnSummaryData[index].priceStd;
        listPrice = grnSummaryData[index].priceList;
        orderLineId =
          grnSummaryData[index].orderLineId === null || grnSummaryData[index].orderLineId === "" || grnSummaryData[index].orderLineId === undefined
            ? null
            : grnSummaryData[index].orderLineId;
        discountValue =
          grnSummaryData[index].discountvalue === null || grnSummaryData[index].discountvalue === undefined || grnSummaryData[index].discountvalue === ""
            ? 0
            : grnSummaryData[index].discountvalue;
        discountType =
          grnSummaryData[index].DiscountType === "Total value Discount"
            ? "TV"
            : grnSummaryData[index].DiscountType === "Percentage"
            ? "P"
            : grnSummaryData[index].DiscountType === "Value"
            ? "V"
            : null;
        totalDiscount =
          grnSummaryData[index].totalDiscount === null || grnSummaryData[index].totalDiscount === undefined || grnSummaryData[index].totalDiscount === ""
            ? 0
            : grnSummaryData[index].totalDiscount;
            
        arrayForMutation.push(
          `{
                      productId : "${productID}",
                      uomId : "${uomID}",
                      orderLineId : ${orderLineId === null || orderLineId === "" || orderLineId === undefined ? null : `"${orderLineId}"`},
                      remark : ${remark === undefined ? null : remark === "" ? null : `"${remark}"`},
                      description : "${descriptioN}",
                      stockUomId : "${uomID}",
                      freeQty : ${freeqty === undefined || freeqty === null ? 0 : freeqty},
                      unitprice : ${istaxincludedFlag === "Y" ? unitPrice :netUnitPrice},
                      listprice : ${listPrice},
                      discountvalue : ${discountValue},
                      netUnit:${netUnitPrice},
                      salePrice:${salePrice},
                      discountType:${discountType === null || discountType === "" || discountType === undefined ? null : `"${discountType}"`},
                      totalDiscount:${totalDiscount},
                      qty : ${quantity},
                      batchData:[${batchedData}],
                      metaData:[${metaLines}] 

                    }`
        );
      }
      // setLoading(true);
      const getBookinOrder = {
        query: `mutation {
              createGRN (GRN : {
                bunitId : "${bunitId}"
                supplierId : "${supplierId}"
                supplierAddressId : "${supplierAddressId}"
                isReturn : "N"
                orderId : ${newOrderId === undefined || newOrderId === null || newOrderId === "" ? null : `"${newOrderId}"`}
                remark : "${values.summremarks === undefined || null || "" ? "" : values.summremarks}"
                supplierRef : "${invoiceNo}"
                movementDate : "${movementDate}"
                taskId : null
                invoiceDate : "${invoiceDate}"
                createPInvoice:"${appConfig.createInvoice}"
                receiptLines : [${arrayForMutation}]
                landedCost:[${arrayForLandedCost}]
                metaData:[${metaLines}] 
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
        data: getBookinOrder,
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${authHeaders.access_token}`,
        },
      }).then((response) => {
        if (response.data.data.createGRN.type === "Success") {
          const messageForSuccess = response.data.data.createGRN.message;
          setSummaryModalVisible(false);
          setLoading(false);
          setOrderId("");
          setSupplierId(null);
          // setBunitId(null);
          setProductData([]);
          setGrnSummaryData([]);
          setwithOrwithoutPoValue("1");
          setOtherCostData([]);
          headerform.setFieldsValue({
            "with-withoutpo": "With Po",
            supplier: null,
            Po: null,
          });
          form.resetFields();
          // let reset =[]
          // dynamicData.map((element)=>{
          //   reset.push(element.label)
          // })
          // form.resetFields(reset);
          summaryForm.resetFields(["summremarks","summinvoiceNo"]);
          const d1 = response.data.data.createGRN.extraParam;
          const data = JSON.parse(d1);
          const recordId = data.receiptId;
          if (appConfig.printPDF === "Y") {
            getPrintCofirmation(recordId, messageForSuccess);
          } else {
            Modal.confirm({
              title: `${messageForSuccess}`,
              okText: "Yes",
              icon: null,
              cancelText: "No",
              onCancel() {
                setSummaryModalVisible(false);
              },
            });
          }
          form.resetFields();
        } else {
          const messageForSuccess = response.data.data.createGRN.message;
          message.error(messageForSuccess);
          setLoading(false);
        }
      });
    });
  }
  };

  const getPrintCofirmation = (recordId, messageForSuccess) => {
    Modal.confirm({
      title: `${messageForSuccess}`,
      content: "Do you want take Printout",
      okText: "Yes",
      icon: null,
      // okType: 'danger',
      cancelText: "No",
      onOk() {
        getPrintPdffile(recordId);
      },
      onCancel() {
        setSummaryModalVisible(false);
      },
    });
  };

  const getPrintPdffile = (recordId) => {
    const authHeaders = getOAuthHeaders();
  if (authHeaders && authHeaders.email && authHeaders.access_token) {
    const RoleId = window.localStorage.getItem("userData");
    const getPrintPdfData = {
      query: `query {reportTemplate(ad_tab_id:"0953FB1201D94CA39671ADF5D4CB967B",recordId:"${recordId}")}`,
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
    setSummaryModalVisible(false);
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

  const closeBatchModal = () => {
    setBatchModalVisible(false);
  };

  const addBatch = () => {
    setBatchModalVisible(false);
  };

  const downloadImportTemplate = () => {
    const options = {
      fieldSeparator: ",",
      filename: "GRNImport",
      // quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      headers: ["Sku", "PPrice", "SPrice", "Mrp", "qty", "freeqty", "discountValue"],
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv([{ Sku: "", price: "", PPrice: "", SPrice: "", Mrp: "", qty: "", freeqty: "", discountValue: "" }]);
  };

  const getImportModal = () => {
    const formFieldsData = headerform.getFieldsValue(true);
    if (formFieldsData.supplier === undefined) {
      message.error("Please select supplier");
    } else {
      setImportModalVisible(true);
    }
  };
  const importModalClose = () => {
    setImportModalVisible(false);
    importform.resetFields();
    document.getElementById("choosefile").value = null;
  };

  const onSelectDiscountType = (e) => {
    setImportDiscountType(e);
  };

  const readFileData = (evt) => {
    const authHeaders = getOAuthHeaders();
    if (authHeaders && authHeaders.email && authHeaders.access_token) {
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
          if (cells.length === 7) {
            dataArr.push({
              sku: cells[0],
              PPrice: cells[1],
              SPrice: cells[2],
              Mrp: cells[3],
              qty: cells[4],
              freeqty: cells[5],
              discount: cells[6],
            });
          }
        }
        if (withOrwithoutPoValue === "2") {
          let flag = true;
          for (let index = 0; index < dataArr.length; index++) {
            const element = parseInt(dataArr[index].discount);
            if (element > 0 && importDiscountType === undefined) {
              flag = false;
            } else {
              flag = true;
            }
          }
          if (flag === false) {
            message.error("Please Select discout type");
            document.getElementById("choosefile").value = null;
          } else {
            if (dataArr.length > 0) {
              setLoading(true);
              const matchedArray = [];
              const unmatchedArray = [];
              const unmatchedSupplierProductsArray = [];
              for (let indexOne = 0; indexOne < dataArr.length; indexOne += 1) {
                let boolean = true;
                for (let indexTwo = 0; indexTwo < productData.length; indexTwo += 1) {
                  if (dataArr[indexOne].sku === productData[indexTwo].value) {
                    matchedArray.push(productData[indexTwo]);
                    boolean = false;
                  }
                }
                if (boolean) {
                  unmatchedArray.push(dataArr[indexOne].sku);
                }
              }
              for (let indexTwo = 0; indexTwo < productData.length; indexTwo += 1) {
                let boolean = true;
                for (let indexOne = 0; indexOne < dataArr.length; indexOne += 1) {
                  if (dataArr[indexOne].sku === productData[indexTwo].value) {
                    boolean = false;
                  }
                }
                if (boolean) {
                  unmatchedSupplierProductsArray.push(productData[indexTwo]);
                }
              }
              const tempArray = [];
              let skuData;
              if (unmatchedArray.length > 0) {
                skuData = JSON.stringify(unmatchedArray);
              } else {
                skuData = `""`;
              }
              const getProducts = {
                query: `query {
                getPurchaseProduct (bunitId : "${bunitId}", supplierId : "${supplierId}",
                product : null,
                productCodes:${[skuData]}){
                clientId
                bunitId
                productId
                value
                name
                upc
                description
                qtyOnHand
                uomId
                uomName
                productCategoryId
                productCategoryName
                taxCategoryId
                taxCategoryName
                taxId
                taxName
                taxRate
                priceStd
                priceList
                twoWeekSale
                fourWeekSale
                isTaxIncluded
                salePrice
                restrictMargin
                actualCostPrice
                batchedProduct
                alternateUomList {
                    alternateUomId uomId uomName
                }
                margin
            }    
            }`,
              };
              Axios({
                url: serverUrl,
                method: "POST",
                data: getProducts,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `bearer ${authHeaders.access_token}`,
                },
              }).then((response) => {
                const getPurchaseData = response.data.data === null ? [] : response.data.data.getPurchaseProduct;
                const array3 = [...getPurchaseData, ...matchedArray];
                for (let index8 = 0; index8 < array3.length; index8 += 1) {
                  const obj = {
                    productCategoryName: array3[index8].productcategoryName || array3[index8].productCategoryName,
                    name: array3[index8].productName || array3[index8].name,
                    productName: array3[index8].productName || array3[index8].name,
                    description: array3[index8].description,
                    twoWeekSale: array3[index8].twoWeekSale,
                    qtyOnHand: array3[index8].qtyOnHand,
                    productId: array3[index8].productId,
                    uomName: array3[index8].uomName,
                    uomId: array3[index8].uomId,
                    priceList: array3[index8].priceList,
                    priceStd: array3[index8].priceStd,
                    taxId: array3[index8].taxId,
                    value: array3[index8].productCode || array3[index8].value,
                    productSearchKey: array3[index8].productCode || array3[index8].value,
                    responseMargin: array3[index8].margin,
                    unitPrice: array3[index8].priceStd,
                    netUnitPrice: array3[index8].priceStd,
                    unitPrice1: array3[index8].priceStd,
                    priceList1: array3[index8].priceList,
                    priceStd1: array3[index8].priceStd,
                    priceStd2: array3[index8].priceStd,
                    oldMargin: (((array3[index8].priceList - array3[index8].priceStd) / array3[index8].priceList) * 100).toFixed(2),
                    upc: array3[index8].upc,
                    taxName: array3[index8].taxName,
                    taxRate: array3[index8].taxRate,
                    istaxincluded: array3[index8].istaxincluded || array3[index8].isTaxIncluded,
                    actualCostPrice: array3[index8].actualCostPrice,
                    salePrice: array3[index8].salePrice,
                    batchedProduct: array3[index8].batchedProduct,
                    restrictMargin: array3[index8].restrictMargin,
                  };
                  tempArray.push(obj);
                }
                message.success(`${tempArray.length} products imported ...`);
                for (let tempArrayindex = 0; tempArrayindex < tempArray.length; tempArrayindex += 1) {
                  const skus = tempArray[tempArrayindex].productCode || tempArray[tempArrayindex].value;
                  for (let index11 = 0; index11 < dataArr.length; index11 += 1) {
                    if (dataArr[index11].sku === skus) {
                      tempArray[tempArrayindex].DiscountType = importDiscountType;
                      tempArray[tempArrayindex].discount =
                        dataArr[index11].discount === null || dataArr[index11].discount === undefined || dataArr[index11].discount === "" || dataArr[index11].discount === "\r"
                          ? 0
                          : dataArr[index11].discount;
                      tempArray[tempArrayindex].receivingQty = dataArr[index11].qty;
                      tempArray[tempArrayindex].freeqty =
                        dataArr[index11].freeqty === null || dataArr[index11].freeqty === undefined || dataArr[index11].freeqty === "" || dataArr[index11].freeqty === "\r"
                          ? null
                          : dataArr[index11].freeqty;
                      tempArray[tempArrayindex].priceList =
                        dataArr[index11].Mrp === null || dataArr[index11].Mrp === undefined || dataArr[index11].Mrp === "" || dataArr[index11].Mrp === "\r"
                          ? tempArray[tempArrayindex].priceList
                          : dataArr[index11].Mrp;
                      tempArray[tempArrayindex].unitPrice =
                        dataArr[index11].PPrice === null || dataArr[index11].PPrice === undefined || dataArr[index11].PPrice === "" || dataArr[index11].PPrice === "\r"
                          ? tempArray[tempArrayindex].unitPrice
                          : dataArr[index11].PPrice;
                      tempArray[tempArrayindex].netUnitPrice =
                        dataArr[index11].PPrice === null || dataArr[index11].PPrice === undefined || dataArr[index11].PPrice === "" || dataArr[index11].PPrice === "\r"
                          ? tempArray[tempArrayindex].netUnitPrice
                          : dataArr[index11].PPrice;
                      tempArray[tempArrayindex].unitPrice1 =
                        dataArr[index11].PPrice === null || dataArr[index11].PPrice === undefined || dataArr[index11].PPrice === "" || dataArr[index11].PPrice === "\r"
                          ? tempArray[tempArrayindex].unitPrice1
                          : dataArr[index11].PPrice;
                      tempArray[tempArrayindex].priceList1 =
                        dataArr[index11].Mrp === null || dataArr[index11].Mrp === undefined || dataArr[index11].Mrp === "" || dataArr[index11].Mrp === "\r"
                          ? tempArray[tempArrayindex].priceList1
                          : dataArr[index11].Mrp;
                      tempArray[tempArrayindex].priceStd1 =
                        dataArr[index11].PPrice === null || dataArr[index11].PPrice === undefined || dataArr[index11].PPrice === "" || dataArr[index11].PPrice === "\r"
                          ? tempArray[tempArrayindex].priceStd1
                          : dataArr[index11].PPrice;
                      tempArray[tempArrayindex].priceStd2 =
                        dataArr[index11].PPrice === null || dataArr[index11].PPrice === undefined || dataArr[index11].PPrice === "" || dataArr[index11].PPrice === "\r"
                          ? tempArray[tempArrayindex].priceStd2
                          : dataArr[index11].PPrice;
                      tempArray[tempArrayindex].salePrice =
                        dataArr[index11].SPrice === null || dataArr[index11].SPrice === undefined || dataArr[index11].SPrice === "" || dataArr[index11].SPrice === "\r"
                          ? tempArray[tempArrayindex].salePrice
                          : dataArr[index11].SPrice;
                      tempArray[tempArrayindex].priceStd =
                        dataArr[index11].PPrice === null || dataArr[index11].PPrice === undefined || dataArr[index11].PPrice === "" || dataArr[index11].PPrice === "\r"
                          ? tempArray[tempArrayindex].priceStd
                          : dataArr[index11].PPrice;
                    }
                  }
                }
                let finalunMatchedArray = [];
                for (let index9 = 0; index9 < dataArr.length; index9 += 1) {
                  const element9 = dataArr[index9].sku;
                  let boolean = true;
                  for (let index10 = 0; index10 < tempArray.length; index10 += 1) {
                    const element10 = tempArray[index10].productCode || tempArray[index10].value;
                    if (element9 === element10) {
                      boolean = false;
                    }
                  }
                  if (boolean) {
                    finalunMatchedArray.push(dataArr[index9].sku);
                  }
                }
                if (finalunMatchedArray.length > 0) {
                  setTimeout(() => {
                    Modal.error({
                      title: "Products not found !",
                      content: `${finalunMatchedArray}`,
                      closable: true,
                      footer: null,
                      icon: null,
                    });
                  }, 2000);
                }
                doImportCalculations(tempArray, unmatchedSupplierProductsArray);
              });
            } else {
              message.error("Please import the file in required format.");
              document.getElementById("choosefile").value = null;
            }
          }
        } else {
          if (dataArr.length > 0) {
            setLoading(true);
            const matchedArray = [];
            const unmatchedArray = [];
            for (let index1 = 0; index1 < productData.length; index1++) {
              let boolean = true;
              const gridDataSku = productData[index1].value;
              for (let index2 = 0; index2 < dataArr.length; index2++) {
                const importSku = dataArr[index2].sku;
                if (gridDataSku === importSku) {
                  productData[index1].receivingQty = dataArr[index2].qty;
                  productData[index1].freeqty =
                    dataArr[index2].freeqty === undefined || dataArr[index2].freeqty === null || dataArr[index2].freeqty === "\r" || dataArr[index2].freeqty === ""
                      ? 0
                      : dataArr[index2].freeqty;
                  productData[index1].priceList =
                    dataArr[index2].Mrp === null || dataArr[index2].Mrp === undefined || dataArr[index2].Mrp === "" || dataArr[index2].Mrp === "\r"
                      ? productData[index1].priceList
                      : dataArr[index2].Mrp;
                  productData[index1].listPrice =
                    dataArr[index2].Mrp === null || dataArr[index2].Mrp === undefined || dataArr[index2].Mrp === "" || dataArr[index2].Mrp === "\r"
                      ? productData[index1].listPrice
                      : dataArr[index2].Mrp;
                  productData[index1].priceStd =
                    dataArr[index2].PPrice === null || dataArr[index2].PPrice === undefined || dataArr[index2].PPrice === "" || dataArr[index2].PPrice === "\r"
                      ? productData[index1].priceStd
                      : dataArr[index2].PPrice;
                  productData[index1].priceStd1 =
                    dataArr[index2].PPrice === null || dataArr[index2].PPrice === undefined || dataArr[index2].PPrice === "" || dataArr[index2].PPrice === "\r"
                      ? productData[index1].priceStd1
                      : dataArr[index2].PPrice;
                  productData[index1].priceStd2 =
                    dataArr[index2].PPrice === null || dataArr[index2].PPrice === undefined || dataArr[index2].PPrice === "" || dataArr[index2].PPrice === "\r"
                      ? productData[index1].priceStd2
                      : dataArr[index2].PPrice;
                  productData[index1].salePrice =
                    dataArr[index2].SPrice === null || dataArr[index2].SPrice === undefined || dataArr[index2].SPrice === "" || dataArr[index2].SPrice === "\r"
                      ? productData[index1].salePrice
                      : dataArr[index2].SPrice;
                  matchedArray.push(productData[index1]);
                  boolean = false;
                }
              }
              if (boolean) {
                unmatchedArray.push(productData[index1]);
              }
            }
            getPoCals(matchedArray, unmatchedArray);
          } else {
            message.error("Please import the file in required format.");
            document.getElementById("choosefile").value = null;
          }
        }
      };
      reader.readAsText(file);
    }
  }
};

  const doImportCalculations = (matchedArray, unmatchedArray) => {
    const newArray = [];
    if (istaxincludedFlag === "Y") {
      if (importDiscountType === undefined || importDiscountType === null) {
        for (let index = 0; index < matchedArray.length; index++) {
          const orQty = matchedArray[index].receivingQty;
          const discount =
            matchedArray[index].discountvalue === undefined || matchedArray[index].discountvalue === null || matchedArray[index].discountvalue === ""
              ? 0
              : matchedArray[index].discountvalue;
          const taxRate = matchedArray[index].taxRate;
          const basePrice = matchedArray[index].priceStd1;
          const MRP = matchedArray[index].priceList;
          const d3 = discount / orQty;
          let price;
          const d4 = isNaN(d3);
          if (d4 === true) {
            price = 0;
          } else {
            price = d3;
          }
          const netUnitPrice1 = basePrice / (1 + taxRate / 100) - price;
          const taxOnUnitPrice = (taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((MRP - unitPrice1) / MRP) * 100;
          const basePriceAfterTax = basePrice / (1 + taxRate / 100);
          const totalDiscount1 = basePriceAfterTax * orQty - netUnitPrice1 * orQty;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          const margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2);
          const lineNetGross = (netUnitPrice * orQty).toFixed(2);
          matchedArray[index].totalTax = totalTax;
          matchedArray[index].grossAmount = gridGrossAmt;
          matchedArray[index].gridGross = gridGrossAmt;
          matchedArray[index].discount = discount;
          matchedArray[index].margin = margin;
          matchedArray[index].DiscountType = null;
          matchedArray[index].netUnitPrice = netUnitPrice;
          matchedArray[index].priceStd = unitPrice;
          matchedArray[index].totalDiscount = totalDiscount;
          matchedArray[index].lineNetGross = lineNetGross;
          newArray.push(matchedArray[index]);
        }
      } else if (importDiscountType === "Total value Discount") {
        for (let index = 0; index < matchedArray.length; index++) {
          const orQty = matchedArray[index].receivingQty;
          const discount =
            matchedArray[index].discountvalue === undefined || matchedArray[index].discountvalue === null || matchedArray[index].discountvalue === ""
              ? 0
              : matchedArray[index].discountvalue;
          const taxRate = matchedArray[index].taxRate;
          const basePrice = matchedArray[index].priceStd1;
          const MRP = matchedArray[index].priceList;
          const d3 = discount / orQty;
          let price;
          const d4 = isNaN(d3);
          if (d4 === true) {
            price = 0;
          } else {
            price = d3;
          }
          const netUnitPrice1 = basePrice / (1 + taxRate / 100) - price;
          const taxOnUnitPrice = (taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((MRP - unitPrice1) / MRP) * 100;
          const basePriceAfterTax = basePrice / (1 + taxRate / 100);
          const totalDiscount1 = basePriceAfterTax * orQty - netUnitPrice1 * orQty;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          const margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2);
          const lineNetGross = (netUnitPrice * orQty).toFixed(2);
          matchedArray[index].totalTax = totalTax;
          matchedArray[index].grossAmount = gridGrossAmt;
          matchedArray[index].gridGross = gridGrossAmt;
          matchedArray[index].discount = discount;
          matchedArray[index].margin = margin;
          matchedArray[index].DiscountType = importDiscountType;
          matchedArray[index].netUnitPrice = netUnitPrice;
          matchedArray[index].priceStd = unitPrice;
          matchedArray[index].totalDiscount = totalDiscount;
          matchedArray[index].lineNetGross = lineNetGross;
          newArray.push(matchedArray[index]);
        }
      } else if (importDiscountType === "Percentage") {
        for (let index = 0; index < matchedArray.length; index++) {
          const orQty = matchedArray[index].receivingQty;
          const discount =
            matchedArray[index].discountvalue === undefined || matchedArray[index].discountvalue === null || matchedArray[index].discountvalue === ""
              ? 0
              : matchedArray[index].discountvalue;
          const taxRate = matchedArray[index].taxRate;
          const basePrice = matchedArray[index].priceStd1;
          const MRP = matchedArray[index].priceList;

          const costPrice3 = basePrice / (1 + taxRate / 100);
          const discountAmount = (discount / 100) * costPrice3;

          const netUnitPrice1 = basePrice / (1 + taxRate / 100) - discountAmount;
          const taxOnUnitPrice = (taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((MRP - unitPrice1) / MRP) * 100;
          const basePriceAfterTax = basePrice / (1 + taxRate / 100);
          const totalDiscount1 = basePriceAfterTax * orQty - netUnitPrice1 * orQty;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          const margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2);
          const lineNetGross = (netUnitPrice * orQty).toFixed(2);
          matchedArray[index].totalTax = totalTax;
          matchedArray[index].grossAmount = gridGrossAmt;
          matchedArray[index].gridGross = gridGrossAmt;
          matchedArray[index].discount = discount;
          matchedArray[index].margin = margin;
          matchedArray[index].DiscountType = importDiscountType;
          matchedArray[index].netUnitPrice = netUnitPrice;
          matchedArray[index].priceStd = unitPrice;
          matchedArray[index].totalDiscount = totalDiscount;
          matchedArray[index].lineNetGross = lineNetGross;
          newArray.push(matchedArray[index]);
        }
      } else if (importDiscountType === "Value") {
        for (let index = 0; index < matchedArray.length; index++) {
          const orQty = matchedArray[index].receivingQty;
          const discount =
            matchedArray[index].discountvalue === undefined || matchedArray[index].discountvalue === null || matchedArray[index].discountvalue === ""
              ? 0
              : matchedArray[index].discountvalue;
          const taxRate = matchedArray[index].taxRate;
          const basePrice = matchedArray[index].priceStd1;
          const MRP = matchedArray[index].priceList;

          const netUnitPrice1 = basePrice / (1 + taxRate / 100) - discount;
          const taxOnUnitPrice = (taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((MRP - unitPrice1) / MRP) * 100;
          const basePriceAfterTax = basePrice / (1 + taxRate / 100);
          const totalDiscount1 = basePriceAfterTax * orQty - netUnitPrice1 * orQty;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          const margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2);
          const lineNetGross = (netUnitPrice * orQty).toFixed(2);

          matchedArray[index].totalTax = totalTax;
          matchedArray[index].grossAmount = gridGrossAmt;
          matchedArray[index].gridGross = gridGrossAmt;
          matchedArray[index].discount = discount;
          matchedArray[index].margin = margin;
          matchedArray[index].DiscountType = importDiscountType;
          matchedArray[index].netUnitPrice = netUnitPrice;
          matchedArray[index].priceStd = unitPrice;
          matchedArray[index].totalDiscount = totalDiscount;
          matchedArray[index].lineNetGross = lineNetGross;
          newArray.push(matchedArray[index]);
        }
      }
    } else {
      if (importDiscountType === undefined || importDiscountType === null) {
        for (let index = 0; index < matchedArray.length; index++) {
          const orQty = matchedArray[index].receivingQty;
          const discount =
            matchedArray[index].discountvalue === undefined || matchedArray[index].discountvalue === null || matchedArray[index].discountvalue === ""
              ? 0
              : matchedArray[index].discountvalue;
          const taxRate = matchedArray[index].taxRate;
          const basePrice = matchedArray[index].priceStd1;
          const MRP = matchedArray[index].priceList;
          const d3 = discount / orQty;
          let price;
          const d4 = isNaN(d3);
          if (d4 === true) {
            price = 0;
          } else {
            price = d3;
          }
          const netUnitPrice1 = basePrice - price;
          const taxOnUnitPrice = (taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((MRP - unitPrice1) / MRP) * 100;
          const totalDiscount1 = basePrice * orQty - netUnitPrice1 * orQty;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          const margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2);
          const lineNetGross = (netUnitPrice * orQty).toFixed(2);

          matchedArray[index].totalTax = totalTax;
          matchedArray[index].grossAmount = gridGrossAmt;
          matchedArray[index].gridGross = gridGrossAmt;
          matchedArray[index].discount = discount;
          matchedArray[index].margin = margin;
          matchedArray[index].DiscountType = importDiscountType;
          matchedArray[index].netUnitPrice = netUnitPrice;
          matchedArray[index].priceStd = unitPrice;
          matchedArray[index].totalDiscount = totalDiscount;
          matchedArray[index].lineNetGross = lineNetGross;
          newArray.push(matchedArray[index]);
        }
      } else if (importDiscountType === "Total value Discount") {
        for (let index = 0; index < matchedArray.length; index++) {
          const orQty = matchedArray[index].receivingQty;
          const discount =
            matchedArray[index].discountvalue === undefined || matchedArray[index].discountvalue === null || matchedArray[index].discountvalue === ""
              ? 0
              : matchedArray[index].discountvalue;
          const taxRate = matchedArray[index].taxRate;
          const basePrice = matchedArray[index].priceStd1;
          const MRP = matchedArray[index].priceList;
          const d3 = discount / orQty;
          let price;
          const d4 = isNaN(d3);
          if (d4 === true) {
            price = 0;
          } else {
            price = d3;
          }
          const netUnitPrice1 = basePrice - price;
          const taxOnUnitPrice = (taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((MRP - unitPrice1) / MRP) * 100;
          const totalDiscount1 = basePrice * orQty - netUnitPrice1 * orQty;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          const margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2);
          const lineNetGross = (netUnitPrice * orQty).toFixed(2);

          matchedArray[index].totalTax = totalTax;
          matchedArray[index].grossAmount = gridGrossAmt;
          matchedArray[index].gridGross = gridGrossAmt;
          matchedArray[index].discount = discount;
          matchedArray[index].margin = margin;
          matchedArray[index].DiscountType = importDiscountType;
          matchedArray[index].netUnitPrice = netUnitPrice;
          matchedArray[index].priceStd = unitPrice;
          matchedArray[index].totalDiscount = totalDiscount;
          matchedArray[index].lineNetGross = lineNetGross;
          newArray.push(matchedArray[index]);
        }
      } else if (importDiscountType === "Percentage") {
        for (let index = 0; index < matchedArray.length; index++) {
          const orQty = matchedArray[index].receivingQty;
          const discount =
            matchedArray[index].discountvalue === undefined || matchedArray[index].discountvalue === null || matchedArray[index].discountvalue === ""
              ? 0
              : matchedArray[index].discountvalue;
          const taxRate = matchedArray[index].taxRate;
          const basePrice = matchedArray[index].priceStd1;
          const MRP = matchedArray[index].priceList;

          const discountAmount = (discount / 100) * basePrice;

          const netUnitPrice1 = basePrice - discountAmount;
          const taxOnUnitPrice = (taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((MRP - unitPrice1) / MRP) * 100;
          const totalDiscount1 = basePrice * orQty - netUnitPrice1 * orQty;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          const margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2);
          const lineNetGross = (netUnitPrice * orQty).toFixed(2);

          matchedArray[index].totalTax = totalTax;
          matchedArray[index].grossAmount = gridGrossAmt;
          matchedArray[index].gridGross = gridGrossAmt;
          matchedArray[index].discount = discount;
          matchedArray[index].margin = margin;
          matchedArray[index].DiscountType = importDiscountType;
          matchedArray[index].netUnitPrice = netUnitPrice;
          matchedArray[index].priceStd = unitPrice;
          matchedArray[index].totalDiscount = totalDiscount;
          matchedArray[index].lineNetGross = lineNetGross;
          newArray.push(matchedArray[index]);
        }
      } else if (importDiscountType === "Value") {
        for (let index = 0; index < matchedArray.length; index++) {
          const orQty = matchedArray[index].receivingQty;
          const discount =
            matchedArray[index].discountvalue === undefined || matchedArray[index].discountvalue === null || matchedArray[index].discountvalue === ""
              ? 0
              : matchedArray[index].discountvalue;
          const taxRate = matchedArray[index].taxRate;
          const basePrice = matchedArray[index].priceStd1;
          const MRP = matchedArray[index].priceList;

          const netUnitPrice1 = basePrice - discount;
          const taxOnUnitPrice = (taxRate / 100) * netUnitPrice1;
          const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice);
          const gridGrossAmt1 = unitPrice1 * orQty;
          const margin1 = ((MRP - unitPrice1) / MRP) * 100;
          const totalDiscount1 = basePrice * orQty - netUnitPrice1 * orQty;
          const totalTax1 = gridGrossAmt1 - netUnitPrice1 * orQty;

          const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2);
          const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2);
          const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2);
          const margin = (Math.round(margin1 * 100) / 100).toFixed(2);
          const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2);
          const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2);
          const lineNetGross = (netUnitPrice * orQty).toFixed(2);

          matchedArray[index].totalTax = totalTax;
          matchedArray[index].grossAmount = gridGrossAmt;
          matchedArray[index].gridGross = gridGrossAmt;
          matchedArray[index].discount = discount;
          matchedArray[index].margin = margin;
          matchedArray[index].DiscountType = importDiscountType;
          matchedArray[index].netUnitPrice = netUnitPrice;
          matchedArray[index].priceStd = unitPrice;
          matchedArray[index].totalDiscount = totalDiscount;
          matchedArray[index].lineNetGross = lineNetGross;
          newArray.push(matchedArray[index]);
        }
      }
    }
    const newFinalArray = [...newArray, ...unmatchedArray];
    setProductData([]);
    setProductData(newFinalArray);
    setImportModalVisible(false);
    setLoading(false);
  };



  const getPoCals = (matchedArray, unmatchedArray) => {
    const newArray = [];
    for (let index = 0; index < matchedArray.length; index++) {
      const DiscountType = matchedArray[index].DiscountType;
      const discountValue = matchedArray[index].discountvalue;
      const receivingQty = matchedArray[index].receivingQty;
      const priceStd = matchedArray[index].priceStd;
      const taxRate = matchedArray[index].taxRate;

      const totalPoDiscount = matchedArray[index].poTotalDiscount;
      const totalPoOrderedQty = matchedArray[index].orderedQty;
      const avgDiscount = totalPoDiscount / totalPoOrderedQty;

      let totalDiscount = discountValue * receivingQty;
      let netUnitPrice;
      let taxOnUnitPrice;
      let totalTax;
      let gridGross;
      let lineNetGross;
      if (DiscountType === "Value") {
        if (istaxincludedFlag === "Y") {
          netUnitPrice = (priceStd / (1 + taxRate / 100)).toFixed(2);
          taxOnUnitPrice = ((taxRate / 100) * priceStd).toFixed(2);
          totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
          gridGross = (priceStd * receivingQty).toFixed(2);
          lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
        } else {
          const netUnitPrice1 = (priceStd / (1 + taxRate / 100)).toFixed(2);
          taxOnUnitPrice = ((taxRate / 100) * netUnitPrice1).toFixed(2);
          netUnitPrice = parseFloat(priceStd) + parseFloat(taxOnUnitPrice);
          totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
          gridGross = (priceStd * receivingQty).toFixed(2);
          lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
        }
        matchedArray[index].totalTax = totalTax;
        matchedArray[index].grossAmount = gridGross;
        matchedArray[index].gridGross = gridGross;
        matchedArray[index].netUnitPrice = netUnitPrice;
        matchedArray[index].totalDiscount = totalDiscount;
        matchedArray[index].lineNetGross = lineNetGross;
        newArray.push(matchedArray[index]);
      } else if (DiscountType === "Total value Discount") {
        totalDiscount = avgDiscount * receivingQty;
        if (istaxincludedFlag === "Y") {
          netUnitPrice = (priceStd / (1 + taxRate / 100)).toFixed(2);
          taxOnUnitPrice = ((taxRate / 100) * priceStd).toFixed(2);
          totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
          gridGross = (priceStd * receivingQty).toFixed(2);
          lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
        } else {
          const netUnitPrice1 = (priceStd / (1 + taxRate / 100)).toFixed(2);
          taxOnUnitPrice = ((taxRate / 100) * netUnitPrice1).toFixed(2);
          netUnitPrice = parseFloat(priceStd) + parseFloat(taxOnUnitPrice);
          totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
          gridGross = (priceStd * receivingQty).toFixed(2);
          lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
        }
        matchedArray[index].totalTax = totalTax;
        matchedArray[index].grossAmount = gridGross;
        matchedArray[index].gridGross = gridGross;
        matchedArray[index].netUnitPrice = netUnitPrice;
        matchedArray[index].totalDiscount = totalDiscount;
        matchedArray[index].lineNetGross = lineNetGross;
        newArray.push(matchedArray[index]);
      } else if (DiscountType === "Percentage") {
        totalDiscount = avgDiscount * receivingQty;
        if (istaxincludedFlag === "Y") {
          netUnitPrice = (priceStd / (1 + taxRate / 100)).toFixed(2);
          taxOnUnitPrice = ((taxRate / 100) * priceStd).toFixed(2);
          totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
          gridGross = (priceStd * receivingQty).toFixed(2);
          lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
        } else {
          const netUnitPrice1 = (priceStd / (1 + taxRate / 100)).toFixed(2);
          taxOnUnitPrice = ((taxRate / 100) * netUnitPrice1).toFixed(2);
          netUnitPrice = parseFloat(priceStd) + parseFloat(taxOnUnitPrice);
          totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
          gridGross = (priceStd * receivingQty).toFixed(2);
          lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
        }
        matchedArray[index].totalTax = totalTax;
        matchedArray[index].grossAmount = gridGross;
        matchedArray[index].gridGross = gridGross;
        matchedArray[index].netUnitPrice = netUnitPrice;
        matchedArray[index].totalDiscount = totalDiscount;
        matchedArray[index].lineNetGross = lineNetGross;
        newArray.push(matchedArray[index]);
      } else if (DiscountType === null || DiscountType === undefined) {
        totalDiscount = 0;
        if (istaxincludedFlag === "Y") {
          netUnitPrice = (priceStd / (1 + taxRate / 100)).toFixed(2);
          taxOnUnitPrice = ((taxRate / 100) * priceStd).toFixed(2);
          totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
          gridGross = (priceStd * receivingQty).toFixed(2);
          lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
        } else {
          const netUnitPrice1 = (priceStd / (1 + taxRate / 100)).toFixed(2);
          taxOnUnitPrice = ((taxRate / 100) * netUnitPrice1).toFixed(2);
          netUnitPrice = parseFloat(priceStd) + parseFloat(taxOnUnitPrice);
          totalTax = (taxOnUnitPrice * receivingQty).toFixed(2);
          gridGross = (priceStd * receivingQty).toFixed(2);
          lineNetGross = (netUnitPrice * receivingQty).toFixed(2);
        }
        matchedArray[index].totalTax = totalTax;
        matchedArray[index].grossAmount = gridGross;
        matchedArray[index].gridGross = gridGross;
        matchedArray[index].netUnitPrice = netUnitPrice;
        matchedArray[index].totalDiscount = totalDiscount;
        matchedArray[index].lineNetGross = lineNetGross;
        newArray.push(matchedArray[index]);
      }
    }
    const newFinalArray = [...newArray, ...unmatchedArray];
    setProductData([]);
    setProductData(newFinalArray);
    setImportModalVisible(false);
    setLoading(false);
  };

  let orderQuantityCount = 0;
  let grossAmtCount = 0;
  let orderQuantity = 0;
  let summaryFreeQty = 0;
  let freeQty = 0;
  let totalOrderQty2 = 0;
  let totalDiscountAmount = 0;
  let lineNetGrossTotal = 0;
  let taxNameArray = [];
  for (let index = 0; index < grnSummaryData.length; index += 1) {
    orderQuantity = grnSummaryData[index].receivingQty;
    summaryFreeQty =
      grnSummaryData[index].freeqty === null || grnSummaryData[index].freeqty === undefined || grnSummaryData[index].freeqty === "" ? 0 : grnSummaryData[index].freeqty;
    const integer = parseFloat(orderQuantity, 10);
    orderQuantityCount += integer;
    const integer2 = parseFloat(summaryFreeQty, 10);
    freeQty += integer2;
    const grossAmtWithFloat = grnSummaryData[index].gridGross;
    const lineNetGrossWithFloat = grnSummaryData[index].lineNetGross;
    const totalDis = grnSummaryData[index].totalDiscount;
    grossAmtCount += parseFloat(grossAmtWithFloat);
    lineNetGrossTotal += parseFloat(lineNetGrossWithFloat);
    totalDiscountAmount += parseFloat(totalDis);
  }
  totalOrderQty2 = freeQty + orderQuantityCount;

  let result = grnSummaryData.reduce((c, v) => {
    c[v.taxName] = (c[v.taxName] || 0) + parseFloat(v.totalTax);
    return c;
  }, {});

  Object.keys(result).map((key) => {
    const taxObj = {
      taxName: key,
      taxValue: result[key],
    };
    taxNameArray.push(taxObj);
  });


 

  const summaryDiv = (
    <Card>
      <Form layout="vertical" form={summaryForm} name="summaryForm">
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <Form.Item name="summbusinessunit" label="Business Unit">
              <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item name="summsupplier" label="Supplier">
              <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item name="summsupplierAddress" label="Supplier Address">
              <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item name="poDoc" label="PO#">
              <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <p />
          <br />
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <Form.Item name="summdeliveryAddress" label="Delivery Address">
              <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item name="summorderdate" label="Order Date">
              <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item name="summreceiptdate" label="Receipt Date">
              <DatePicker style={{ width: "100%" }} /* disabledDate={disabledPreviousDate} */ /* onChange={disabledDateChange} */ />
            </Form.Item>
          </Col>
          
          <Col className="gutter-row" span={6}>
            <Form.Item name="summremarks" label="Remarks">
              <Input style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <p />
          <br />
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <Form.Item
              name="summinvoiceNo"
              label="Invoice No"
              rules={[
                {
                  required: true,
                  message: "please input invoice no!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item name="summinvoiceDate" label="Invoice Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <p />
          <br />
        </Row>
      </Form>
      <div>
        <Table
          columns={summaryTableColumns}
          dataSource={grnSummaryData}
          style={{ fontSize: "12px" }}
          size="small"
          sticky={true}
          scroll={{ y: "35vh", x: "100%" }}
          pagination={false}
        />
      </div>
      <Row gutter={16}>
        <Col className="gutter-row" span={5}>
          <h4>No. of Products: {grnSummaryData.length}</h4>
        </Col>
        <Col className="gutter-row" span={5}>
          <h4>Total Discount: {totalDiscountAmount}</h4>
        </Col>
        <Col className="gutter-row" span={5}>
          <h4>Total Quantity: {totalOrderQty2}</h4>
        </Col>
        <Col className="gutter-row" span={5}>
          <h4>Total Net Amount: {lineNetGrossTotal.toFixed(2)}</h4>
        </Col>
        <Col className="gutter-row" span={4}>
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
        <Col className="gutter-row" span={6}>
          <span style={{ float: "right" }}>
            <table style={{ border: "1px solid #dddddd" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #dddddd" }}>Landed Cost</th>
                </tr>
              </thead>
              <tbody>
                {otherCostData.map((data) => (
                  <tr>
                    <td style={{ border: "1px solid #dddddd" }}>
                      <span>{data.name}</span> &nbsp;: {data.costPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </span>
        </Col>
        <Col className="gutter-row" span={6}>
          <span>
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
            <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>Goods Receipt</h2>
          </Col>
          <Col span={12}>
            <span style={{ float: "right" }}>
              <Button onClick={grnSummaryReview} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }}>
                Review
              </Button>
            </span>
          </Col>
        </Row>
        <Card style={{ marginBottom: "8px" }}>
          <Form layout="vertical" form={headerform} name="control-hooks" onFinish={onFinish}>
            <Row gutter={16}>
              <Col className="gutter-row" span={4}>
                <Form.Item name="businessUnit" label="Business unit" style={{ marginBottom: "8px" }}>
                  <Select allowClear showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onSelect={onSelectBusinessUnit}>
                    {bunitData.map((data, index) => (
                      <Option key={data.csBunitId} value={data.csBunitId} title={data.bUnitName}>
                        {data.bUnitName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="with-withoutpo" label="Receive" style={{ marginBottom: "8px" }}>
                  {appConfig.enableWithoutPO === "Y" ? (
                    <Select
                      className="ant-select-enabled"
                      dropdownClassName="certain-category-search-dropdown"
                      dropdownMatchSelectWidth={false}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      style={{ width: "100%" }}
                      onSelect={onSelectOfWithORwithoutPo}
                    >
                      <Option key="1">With Po</Option>
                      <Option key="2">Without Po</Option>
                    </Select>
                  ) : (
                    <Select
                      className="ant-select-enabled"
                      dropdownClassName="certain-category-search-dropdown"
                      dropdownMatchSelectWidth={false}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      style={{ width: "100%" }}
                      onSelect={onSelectOfWithORwithoutPo}
                    >
                      <Option key="1">With Po</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="supplier" label="Supplier" style={{ marginBottom: "8px" }}>
                  <Select allowClear showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={supplierOnchange}>
                    {suppliersValuesInState.map((data, index) => (
                      <Option key={data.recordid} istaxflag={data.istaxincluded} title={data.name} value={data.recordid}>
                        {data.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              {withOrwithoutPoValue === "1" ? (
                <Col className="gutter-row" span={6}>
                  <Form.Item name="Po" label="PO#" style={{ marginBottom: "8px" }}>
                    <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onSelect={onSelectPurchaseOrder}
                      onFocus={getPurchaseOrderDocList}
                    >
                      {poDocList.map((data, index) => (
                        <Option key={data.orderId} title={data.docNo} value={data.orderId} orderdate={data.dateOrdered}>
                          {data.docToshow}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              ) : (
                ""
              )}
              <Col className="gutter-row" span={4}>
                <Form.Item name="date" label="Date" style={{ marginBottom: "8px" }}>
                  <DatePicker style={{ width: "100%" }} /* onChange={this.getDateChange} */ />
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
        <p style={{ marginBottom: "8px" }} />
        <div>
          <Tabs
            defaultActiveKey={tabKey}
            onChange={callbackTabs}
            type="card"
            tabBarStyle={{ marginBottom: "0px" }}
            tabBarExtraContent={
              <div>
                {appConfig.changePrice === "Y" ? 
                  <span>
                      <Button size="small" onClick={changePrice}>
                        Change Price
                      </Button>
                    &nbsp;
                  </span>  
               :null} 
                {appConfig.downloadTemplate === "Y" ? 
                  <span>
                    <Tooltip placement="top" title={"Download Template"}>
                      <Button size="small" onClick={downloadImportTemplate}>
                        <DownloadOutlined />
                      </Button>
                    </Tooltip>
                    &nbsp;
                  </span>  
               :null} 
               {(withOrwithoutPoValue === "2") && (appConfig.importGRN === "Y") ? 
                  <span>
                    <Button size="small" onClick={getImportModal}>
                      Import
                    </Button>
                  </span>  
               :null}              
              </div>
            }
          >
            <TabPane tab="Products" key="10">
              <Card style={{ marginBottom: "8px" }}>
                <Form layout="vertical" form={form} name="editable-form" onFinish={onFinish}>
                  <Row gutter={16}>
                    <Col className="gutter-row" span={8}>
                      <Form.Item name="Value" label="SKU" style={{ marginBottom: "8px" }}>
                        <Select 
                          className="certain-category-search"
                          dropdownClassName="certain-category-search-dropdown"
                          dropdownMatchSelectWidth={false}
                          dropdownStyle={{ width: '10%' }}
                          showSearch
                          value={searchInput}
                          onSearch={searchDropdownRecords}
                          filterOption={(input, option) =>
                            option.props.children !== undefined
                              ? option.props.children
                                  .toString()
                                  .toLowerCase()
                                  .indexOf(input.toString().toLowerCase()) >= 0
                              :''
                          }
                          onSelect={onselectedProduct}
                          >
                            {skuSearchedProductData.map((data, index) => (
                              <Option
                                key={data.key}
                                data={data}
                              > 
                                {data.value}-{data.name}
                              </Option>
                            ))}
                          </Select>
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4}>
                      <Form.Item name="Name" label="Name" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4}>
                      <Form.Item name="UOM" label="UOM" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4}>
                      <Form.Item name="receivingQty" label="Receiving Qty" style={{ marginBottom: "8px" }}>
                        <Input readOnly={isSplitBatch && !disableBatchField ? true : isSplitBatch && disableBatchField ? false: false} style={ isSplitBatch && !disableBatchField ? {border: "none", background: "rgb(241 243 247 / 68%)"} : isSplitBatch && disableBatchField ? {} :{} } onChange={OnChangeOrderQty} />
                      </Form.Item>
                    </Col>
                    {appConfig.freeQty === "Y" ? <Col className="gutter-row" span={4}>
                      <Form.Item name="FreeQty" label="Free Qty" style={{ marginBottom: "8px" }}>
                        <Input onChange={OnChangeOrderQty} />
                      </Form.Item>
                    </Col> : ""}
                    <Col className="gutter-row" span={4}>
                      <Form.Item name="orderedQty" label="Ordered Qty" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4}>
                      <Form.Item name="poFreeQty" label="PO Free Qty" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4}>
                      <Form.Item name="receivedQty" label="Received Qty" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col>
                    {appConfig.discounttype === "Y" ?<Col className="gutter-row" span={4}>
                      {disabledDiscountType === true ? (
                        <Form.Item name="DiscountType" label="Discount Type" style={{ marginBottom: "8px" }}>
                          <Select allowClear onChange={OnChangeOrderQty} disabled={withOrwithoutPoValue === "1" ? true : false}>
                            <Option key="Percentage1" value="Percentage">
                              Percentage
                            </Option>
                            <Option key="Value2" value="Value">
                              Value
                            </Option>
                            <Option key="Totalvd3" value="Total value Discount">
                              Total value Discount
                            </Option>
                          </Select>
                        </Form.Item>
                      ) : (
                        <Form.Item name="DiscountType" label="Discount Type" style={{ marginBottom: "8px" }}>
                          <Select allowClear onChange={OnChangeOrderQty} disabled={appConfig.discounttype === "Y" ? false : true}>
                            <Option key="Percentage1" value="Percentage">
                              Percentage
                            </Option>
                            <Option key="Value2" value="Value">
                              Value
                            </Option>
                            <Option key="Totalvd3" value="Total value Discount">
                              Total value Discount
                            </Option>
                          </Select>
                        </Form.Item>
                      )}
                    </Col> : ""}
                    {appConfig.discountvalue === "Y" ? <Col className="gutter-row" span={4}>
                      <Form.Item name="discountValue" label="Discount Value" style={{ marginBottom: "8px" }}>
                        <Input disabled={disableDiscountInput === "" || disableDiscountInput === false ? true : false} onChange={OnChangeOrderQty} />
                      </Form.Item>
                    </Col> : ""}
                    {appConfig.basePrice === "Y" ? <Col className="gutter-row" span={4}>
                      {disabledDiscountType === true ? (
                        <Form.Item name="BasePriceChange" label="Base Price" style={{ marginBottom: "8px" }}>
                          <Input disabled={withOrwithoutPoValue === "1" ? true : false} onChange={OnChangeOrderQty} />
                        </Form.Item>
                      ) : (
                        <Form.Item name="BasePriceChange" label="Base Price" style={{ marginBottom: "8px" }}>
                          <Input onChange={OnChangeOrderQty} />
                        </Form.Item>
                      )}
                    </Col> : ""}
                    {appConfig.unitPrice === "Y" ? <Col className="gutter-row" span={4}>
                      <Form.Item name="unitPrice" label="Unit Price" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col> : ""}
                    {appConfig.netunitPrice === "Y" ?<Col className="gutter-row" span={4}>
                      <Form.Item name="netUnitPrice" label="Net Unit Price" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col> : ""}
                    {appConfig.salePrice === "Y" ? <Col className="gutter-row" span={4}>
                        <Form.Item name="salePrice" label="Sale Price" style={{ marginBottom: "8px" }}>
                          <Input disabled={changePriceDisabledFlag} onChange={OnChangeOrderQty}  />
                        </Form.Item>
                      </Col> : ""}
                    {appConfig.MRP === "Y" ? <Col className="gutter-row" span={4}>
                      <Form.Item name="priceList" label="MRP" style={{ marginBottom: "8px" }}>
                        <Input disabled={changePriceDisabledFlag} onChange={OnChangeOrderQty} />
                      </Form.Item>
                    </Col> : ""}
                    {/* priceList */}
                    {appConfig.margin ==="Y" ? <Col className="gutter-row" span={4}>
                      <Form.Item name="margin" label="Margin" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col> : ""}
                    {appConfig.oldMargin ==="Y" ? <Col className="gutter-row" span={4}>
                      <Form.Item name="OldMargin" label="Old Margin" style={{ marginBottom: "8px" }}>
                        <Input  readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col> : ""}
                    {appConfig.netamount ==="Y" ? <Col className="gutter-row" span={4}>
                      <Form.Item name="netAmount" label="Net Amount" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col> : ""}
                    {appConfig.grossamount ==="Y" ? <Col className="gutter-row" span={4}>
                      <Form.Item name="GrossAmount" label="Gross Amount" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col> : ""}
                    {appConfig.totaldiscount ==="Y" ? <Col className="gutter-row" span={4}>
                      <Form.Item name="totalDiscount" label="Total Discount" style={{ marginBottom: "8px" }}>
                        <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                      </Form.Item>
                    </Col> : ""}
                    {appConfig.batchNo ==="Y" ?<Col className="gutter-row" span={4} style={{display: isSplitBatch && !disableBatchField ? 'none' : null}}>
                      <Form.Item name="batchNo" label="Batch No" style={{ marginBottom: "8px" }}>
                        <Input disabled={disableBatchField} onChange={OnChangeOrderQty} />
                      </Form.Item>
                    </Col>:""}
                    {appConfig.mfgDate ==="Y" ?<Col className="gutter-row" span={4} style={{display: isSplitBatch && !disableBatchField  ? 'none' : null}}>
                      <Form.Item name="mfg_date" label="Mfg. Date" style={{ marginBottom: "8px" }}>
                        <DatePicker disabled={disableBatchField} onChange={OnChangeOrderQty} />
                      </Form.Item>
                    </Col>:""}
                    {appConfig.expDate ==="Y" ?<Col className="gutter-row" span={4} style={{display: isSplitBatch && !disableBatchField  ? 'none' : null}}>
                      <Form.Item name="expiry_date" label="Exp. Date" style={{ marginBottom: "8px" }}>
                        <DatePicker disabled={disableBatchField} onChange={OnChangeOrderQty} />
                      </Form.Item>
                    </Col>:""}
                    {dynamicData.map((element)=>{
                        {
                          switch (element.type) {
                            case "ST":
                              return (
                                <Col className="gutter-row" span={4} >
                                  <Form.Item  label={element.label} name={element.label} style={{ marginBottom: "8px" }}>
                                    <Input value={element.defaultValue}/>
                                  </Form.Item>
                                </Col>
                              );
                            case "LM":
                              return (
                                <Col className="gutter-row" span={4} >
                                  <Form.Item label={element.label} name={element.label} style={{ marginBottom: "8px" }}>
                                    <Select mode="multiple" maxTagCount="responsive" showSearch style={{ width: "100%", marginBottom: "0px" }}>
                                      {element?.data?.map((option, index) => (
                                        <Option key={index} value={option}>
                                          {option}
                                        </Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                </Col>
                              );
                            case "DA":
                              return (
                                <Col className="gutter-row" span={4} >
                                  <Form.Item initialValue={element.defaultValue !== '' && undefined && null ? moment(element.defaultValue): null} label={element.label} name={element.label} style={{ marginBottom: "8px" }}>
                                    <DatePicker format={"YYYY-MM-DD"} />
                                  </Form.Item>
                                </Col>
                              );
                            case "DT":
                              return (
                                  <Col className="gutter-row" span={4} >
                                    <Form.Item initialValue={element.defaultValue !== '' && undefined && null ? moment(element.defaultValue) : null} label={element.label} name={element.label} style={{ marginBottom: "8px" }}>
                                    <DatePicker format={"DD-MM-YYYY HH:mm"}/>
                                    </Form.Item>
                                  </Col>
                                );
                            case "TI": 
                              return (
                                  <Col className="gutter-row" span={4} >
                                    <Form.Item initialValue={element.defaultValue !== '' && undefined && null ? moment( element.defaultValue , 'HH:mm:ss') : null}  label={element.label} name={element.label} style={{ marginBottom: "8px" }}>
                                    <TimePicker style={{width:'100%'}} format={"HH:mm:ss"}/>
                                    </Form.Item>
                                  </Col>
                                );
                            case "NU":
                                  return (
                                      <Col className="gutter-row" span={4} >
                                        <Form.Item  initialValue={element.defaultValue} label={element.label} name={element.label} style={{ marginBottom: "8px" }}>
                                        <InputNumber  style={{ width: "100%", marginBottom: "0px" }}/>
                                        </Form.Item>
                                      </Col>
                                    );
                            case "IN":
                                  return (
                                      <Col className="gutter-row" span={4} >
                                        <Form.Item  initialValue={element.defaultValue} label={element.label} name={element.label} style={{ marginBottom: "8px" }}>
                                        <Input type="number"  style={{ width: "100%", marginBottom: "0px" }}/>
                                        </Form.Item>
                                      </Col>
                                    );
                            case "LI":
                                  return (
                                    <Col className="gutter-row" span={4} >
                                    <Form.Item  label={element.label} name={element.label} style={{ marginBottom: "8px" }}>
                                      <Select showSearch style={{ width: "100%", marginBottom: "0px" }}>
                                        {element?.data?.map((option, index) => (
                                          <Option key={index} value={option}>
                                            {option}
                                          </Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                    );
                          }
                        }
                      })}
                    <Col className="gutter-row" span={6}>
                      <Form.Item name="description" label="Remarks" style={{ marginBottom: "8px" }}>
                        <Input /* onChange={OnChangeOrderQty} */ />
                      </Form.Item>
                    </Col>
                   {isSplitBatch && !disableBatchField ? <Col className="gutter-row" span={24}>
                          <Form.List  name="dyanamicFileds"  autoComplete="off">
                              {(fieldsArry, { add, remove }) => (
                            <>  

                            <Col className="gutter-row" span={12} /> 
                              <Col className="gutter-row" span={22}>
                             <Form.Item>
                             <span style={{ float: "right" }}>
                                <PlusCircleOutlined  onClick={() => add()}/>
                               </span>
                             </Form.Item>
                            </Col>
                             <br/>
                                {fieldsArry.map(({  name, ...restField }) => (
                              <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Col className="gutter-row" span={2} />
                            <Col className="gutter-row" span={24}>
                            <Form.Item   name={[name, "batchNo"]} label="Batch No"  {...restField} style={{ marginBottom: "8px" }}>
                            <Input onChange={OnChangeOrderQty} />
                            </Form.Item>
                            </Col>
                            
                            <Col className="gutter-row" span={2} />
                            <Col className="gutter-row" span={24}>
                            <Form.Item   name={[name, "mfg_date"]} label="Mfg. Date"  {...restField} style={{ marginBottom: "8px" }}>
                            <DatePicker  onChange={OnChangeOrderQty} />
                            </Form.Item>
                          </Col>
                                        
                          <Col className="gutter-row" span={2} />
                              <Col className="gutter-row" span={24}>
                                <Form.Item  name={[name,"expiry_date"]} label="Exp. Date"  {...restField} style={{ marginBottom: "8px" }}>
                                <DatePicker onChange={OnChangeOrderQty}/>   
                               </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={2} />
                              <Col className="gutter-row" span={24}>
                                <Form.Item readOnly={isSplitBatch && !disableBatchField ? false : isSplitBatch && disableBatchField ? true: true} style={ isSplitBatch && !disableBatchField ? { marginBottom: "8px" } : isSplitBatch && disableBatchField ?  {border: "none", background: "rgb(241 243 247 / 68%)"} :{border: "none", background: "rgb(241 243 247 / 68%)"} } name={[name,"qty1"]} label="Qty"  {...restField}>
                                <Input onChange={OnChangeOrderQty}/>  
                               </Form.Item>
                          </Col>
                            <Col className="gutter-row" span={2} />
                              <Col className="gutter-row" span={2} style={{marginLeft:'2px'}}>
                             <MinusCircleOutlined onClick={() => remove(name)} />
                          </Col>
                          </Space>
                              ))}
                          </>
                          )}
                          </Form.List>
                          </Col> : ''}
                  </Row>
                </Form>
              </Card>
              <MainTable key="64" gridData={productData} getSelectedRecord={getSelectedRecord} />
            </TabPane>
            <TabPane tab="Landed Cost" key="12">
              <Card>
                <Row gutter={16} style={{ marginBottom: "8px" }}>
                  <Col className="gutter-row" span={6}>
                    <Input
                      placeholder="Search"
                      style={{ width: "85%" }}
                      suffix={<i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.contentWindow.recordWindow.linesTab.linesSearchBar.icon} />}
                    />
                  </Col>
                  <Col className="gutter-row" span={4}>
                    <Button onClick={openCostModal} style={Themes.contentWindow.recordWindow.linesTab.LinesAddNewButton}>
                      +Add New
                    </Button>
                  </Col>
                </Row>
                <OtherCostTable gridData1={otherCostData} />
              </Card>
            </TabPane>
            {appConfig.showSummary === "Y" ? (
              <TabPane tab="Summary" key="13">
                {summaryDiv}
              </TabPane>
            ) : null}
          </Tabs>
        </div>
      </div>
      <Modal
        visible={addCostVisible}
        closable={null}
        centered
        width="40%"
        // getContainer={false}
        footer={[
          <Button key="back" onClick={addCostCancel}>
            Cancel
          </Button>,
          <Button onClick={addCostToGrid}>Add</Button>,
        ]}
      >
        <h3 style={{ textAlign: "center" }}>Other Cost</h3>
        <Card style={{ marginBottom: "0px", border: "none" }}>
          <Form layout="vertical" form={otherCostForm} name="other-cost">
            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <Form.Item
                  label="Cost Name"
                  name="costParameter"
                  key="costParam"
                  rules={[
                    {
                      required: true,
                      message: "please select cost name",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    filterOption={(input, Option) => Option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onFocus={getLandedCost}
                    style={{ width: "100%" }}
                    onSelect={onSelectLandedCost}
                  >
                    {landedCostDropDownData.map((data, index) => (
                      <Option key={data.pLcTypeId} data={data} value={data.name}>
                        {data.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <Form.Item
                  label="Value"
                  name="costEntered"
                  key="costVal"
                  rules={[
                    {
                      required: true,
                      message: "please enter cost",
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
      <Modal
        visible={summaryModalVisible}
        closable={null}
        centered
        width="90%"
        footer={[
          <Button key="back" onClick={closeSummaryModal}>
            Cancel
          </Button>,
          <Button loading={loading} onClick={createGRN}>Submit</Button>,
        ]}
      >
        <h3 style={{ textAlign: "center" }}>Goods Receipt Summary</h3>
        <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
          {summaryDiv}
        </Spin>
      </Modal>
      <Modal
        visible={batchModalVisible}
        closable={null}
        centered
        width="60%"
        footer={[
          <Button key="back" onClick={closeBatchModal}>
            Cancel
          </Button>,
          <Button onClick={addBatch}>Add Batch</Button>,
        ]}
      >
        <h3 style={{ textAlign: "center" }}>Batch Details</h3>
        <Card style={{ marginBottom: "8px" }}>
          <Form layout="vertical" form={form} name="editable-form" onFinish={onFinish}>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <Form.Item name="batchNo" label="Batch No" style={{ marginBottom: "8px" }}>
                  <Input onChange={OnChangeOrderQty} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="mfg_date" label="Mfg. Date" style={{ marginBottom: "8px" }}>
                  <DatePicker onChange={OnChangeOrderQty} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="expiry_date" label="Exp. Date" style={{ marginBottom: "8px" }}>
                  <DatePicker onChange={OnChangeOrderQty} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="receivingQty" label="Receiving Qty" style={{ marginBottom: "8px" }}>
                  <Input onChange={OnChangeOrderQty} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
      <Modal visible={importModalVisible} onCancel={importModalClose} closable={null} centered width="50%" footer={[<Button onClick={importModalClose}>Close</Button>]}>
        <h3 style={{ textAlign: "center" }}>Import Products</h3>
        <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
          <Card>
            <Form layout="vertical" form={importform} name="importform">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="importProductsDiscountType" label="Discount Type">
                    <Select style={{ width: "100%" }} onSelect={onSelectDiscountType}>
                      <Option key="25" value="Percentage">
                        Percentage
                      </Option>
                      <Option key="26" value="Value">
                        Value
                      </Option>
                      <Option key="27" value="Total value Discount">
                        Total value Discount
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label=" ">
                    <input id="choosefile" type="file" accept=".csv" onChange={readFileData} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Spin>
      </Modal>
    </Spin>
  );
};

export default GRN;
