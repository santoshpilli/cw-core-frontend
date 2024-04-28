/* eslint-disable */
import React,{useState,useEffect} from 'react'
import {Card,Row,Col,Button,Form,Select,Tabs,Input,InputNumber,Radio,Spin,Modal,Tooltip,DatePicker,message,Table,Collapse,TimePicker} from 'antd'
import { LoadingOutlined ,CaretRightOutlined,DownloadOutlined} from "@ant-design/icons";
import { ExportToCsv } from 'export-to-csv'
import { v4 as uuid } from 'uuid'
import moment from 'moment'
import Axios from 'axios'
import { useGlobalContext } from "../../../lib/storage";
import { getSupplierData,getSupplierAddress} from "../../../services/generic";
import { getDeliveryLocation,getSupplierProduct,getLandedCostData,getDraftPoDocs,getDraftpoProducts,getRoleBusinessUnit,getAppSetupData } from "../../../services/custom";
import MainTable from './MainTable'
import OtherCostTable from './OtherCostTable'
import summaryTableColumns from './summaryCols'
import barcodeImage from "../../../assets/images/barcode.svg";
// import {serverUrl,genericUrl,fileDownloadUrl} from '../../../constants/serverConfig'
import "antd/dist/antd.css";
import { getOAuthHeaders } from '../../../constants/oAuthValidation';
import "../../../styles/antd.css";
import ThemeJson from "../../../constants/UIServer.json"

const {Option} = Select
const {TabPane} = Tabs
const {Panel} = Collapse
const dateFormat = 'YYYY-MM-DD'

const PurchaseOrder = (props) => {
const { globalStore } = useGlobalContext();
const Themes = ThemeJson;
const serverUrl = process.env.REACT_APP_serverUrl;
const genericUrl = process.env.REACT_APP_genericUrl;
const fileDownloadUrl = process.env.REACT_APP_fileDownloadUrl;
const [bunitData,setBunitData] = useState([])
const [bunitId,setBunitId] = useState('')
const [businessUnitName,setBusinessUnitName] = useState('')
const [supplierData,setSupplierData] = useState([])
const [currentDate,setCurrentdate]= useState("")
const [supplierId,setSupplierId] = useState('')
const [supplierName,setSupplierName] = useState('')
const [priceListId,setPriceListId] = useState('')
const [istaxincludedFlag,setIstaxincludedFlag] = useState('')
const [deliveryLocationList,setDeliveryLocationList] = useState([])
const [regionName,setRegionName] = useState('')
const [deliveryLocationName,setDeliveryLocationName] = useState('')
const [loading,setLoading] = useState(false)
const [productData,setProductData] = useState([])
const [selectedProductObject,setSelectedProductObject] = useState({})
const [disableDiscountInput,setdisableDiscountInput] = useState('')
const [supplierAddressName,setSupplierAddressName] = useState('')
const [supplierAddressId,setSupplierAddressId] = useState('')
const [otherCostData,setOtherCostData] = useState([])
const [addCostVisible,setAddCostVisible] = useState(false)
const [landedCostDropDownData ,setLandedCostDropDownData] = useState([])
const [selectedLandedCost,setSelectedLandedCost] = useState({})
const [scheduledDate,setScheduledDate] = useState("")
const [poSummaryData,setPoSummaryData] = useState([])
const [poSummaryVisible,setPoSummaryVisible] = useState(false)
const [tabKey,setTabKey] = useState('10')
const [importModalVisible,setImportModalVisible] = useState(false)
const [importDiscountType,setImportDiscountType] = useState(undefined)
const [draftPoDocsData,setDraftPoDocsData] = useState([])
const [uniueOrderId,SetUniueOrderId] = useState([])
const [changePriceDisabledFlag,setChangePriceDisabledFlag] = useState(true)
const [selectedOrderId,setSelectedOrderId] = useState("")
const [draftLineData,setDraftLineData] = useState([])
const [radioValue, setRadioValue] = useState(1);
const [appConfig,setAppConfig] = useState({})
const [skuSearchedProductData,setSkuSearchedProductData] = useState([])
const [searchInput, setSearchInput] = useState('')
const [productDataCopy,setProductDataCopy] = useState([])
const [dynamicData,setDynamicData]=useState([])
const [formData,setFormData] = useState([])
const [fieldVisible,setFieldVisible] = useState(false)
const [disableBatchField, setDisableBatchField] = useState(true);
const [batchModalVisible, setBatchModalVisible] = useState(false);


const [form] = Form.useForm();
const [headerform] = Form.useForm()
const [otherCostForm] = Form.useForm()
const [summaryForm] = Form.useForm()
const [importform] = Form.useForm()
const [skuform] = Form.useForm()

useEffect(() => {
  const uniqueId = uuid()
  .replace(/-/g, '')
  .toUpperCase()
  SetUniueOrderId(uniqueId)
  getBusinessUnit()
  getAppSetup()
 }, []);


const getBusinessUnit = async () =>{
  const userData = JSON.parse(window.localStorage.getItem('userData'))
  const businessUnitResponse = await getRoleBusinessUnit(userData.user_id)
  headerform.setFieldsValue({
    businessUnit:businessUnitResponse.bUnitName
  })
  setBunitId(businessUnitResponse.defaultCsBunitId)
  setBunitData(businessUnitResponse.userBunit)
  const date = new Date()
  const minDate = date.toISOString().slice(0, 10)
  setBusinessUnitName(businessUnitResponse.bUnitName)
  setCurrentdate(minDate)
  setScheduledDate(minDate)
  getDeliverLocation(businessUnitResponse.defaultCsBunitId)
}

const getAppSetup = async () =>{
  const val = "PO"
  const response = await getAppSetupData(val)
  setAppConfig(JSON.parse(response[0].configJson))
  let formData = JSON.parse(response[0].configJson)
  let formData1 = []
  if(formData.dyanamicFileds.length>0){
    
    for(let i =0;i<formData.dyanamicFileds.length;i++){
      let obj ={
        type :  formData["dyanamicFileds"][i].type,
        lable :  formData["dyanamicFileds"][i].lable
      }
      if(formData.dyanamicFileds[i].type === "LM" && formData.dyanamicFileds[i].defaultValue !== undefined){
        formData.dyanamicFileds[i].data = formData.dyanamicFileds[i].defaultValue.split(",")
        obj.data = formData.dyanamicFileds[i].defaultValue.split(",")
      }
      if(formData.dyanamicFileds[i].type === "LI" && formData.dyanamicFileds[i].defaultValue !== undefined){
        formData.dyanamicFileds[i].data = formData.dyanamicFileds[i].defaultValue.split(",")
        obj.data = formData.dyanamicFileds[i].defaultValue.split(",")
      }
  formData1.push(obj)
  }
  setFormData(formData1)

  }

  setDynamicData(formData.dyanamicFileds)
}

const getSuppliers = async () =>{
  const supplierResponse = await getSupplierData()
  setSupplierData(supplierResponse)
}

const onSelectBusinessUnit = (e,data) =>{
  const { title } = data.props
  const date = new Date()
  const minDate = date.toISOString().slice(0, 10)
  setBunitId(e)
  setBusinessUnitName(title)
  setCurrentdate(minDate)
  setScheduledDate(minDate)
  getDeliverLocation(e)
}

const getDeliverLocation = async (e) =>{
  const deliveryResponse = await getDeliveryLocation(e)
  headerform.setFieldsValue({'deliveryLocation':deliveryResponse[0].fulladdress})
  setDeliveryLocationName(deliveryResponse[0].fulladdress)
  setDeliveryLocationList(deliveryResponse)
  setRegionName(deliveryResponse[0].bUnitLocationId)
}

const onSelectSupplier = (e, data) =>{
  const date = new Date()
  const minDate = date.toISOString().slice(0, 10)
  headerform.resetFields(['Po'])
  setDraftLineData([])
  setSupplierId(e)
  setSupplierName(data.props.title)
  setCurrentdate(minDate)
  setPriceListId(data.props.pricelistid)
  setIstaxincludedFlag(data.props.istaxflag)
  getProductsAfterSelectionSupplier(e,)
}

const getDraftpo = async () =>{
const draftPoResponse = await getDraftPoDocs(supplierId,bunitId) 
setDraftPoDocsData(draftPoResponse)
}

const onChangeRadio = (e) =>{
  setRadioValue(e.target.value)
}

const onSelectDraftpo = async (e) =>{
  if(e === undefined || e === null){
    setSelectedOrderId("")
    setProductData(productDataCopy)
  }else{
    setSelectedOrderId(e)
  setLoading(true)
  const data = await getDraftpoProducts(bunitId,supplierId,e)
  if(data.length > 0){
    const newArray= []
    for (let index = 0; index < data.length; index++) {
      let netUnitPrice;
      let netUnitPrice1;
      let price=0;
      let orQty = data[index].orderedQty 
      let d3;
      let d4;
      const discountType = data[index].discounttype === "TV" ? 'Total value Discount' : data[index].discounttype === "P" ? 'Percentage' :data[index].discounttype === "Value" ? 'Value':data[index].discounttype === null ?null:undefined
      let dprice = (data[index].discountvalue === null || data[index].discountvalue === undefined || data[index].discountvalue === "" ? 0 :data[index].discountvalue )
      const netStd = data[index].netStd 
      let grossStd = data[index].grossStd 
      if(appConfig.basePriceCalc === "Purchase Price"){
        if(discountType === undefined || discountType === null){
          d3 = dprice/orQty
          d4 = isNaN(d3)
          if(d4 === true){
            price= 0
          }else{
            price = d3
          }
          if(istaxincludedFlag === 'Y'){
            netUnitPrice1 = (netStd - price)
            netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
          }else{
            netUnitPrice = netStd
          }
        }else if (discountType === "Total value Discount"){
          if(istaxincludedFlag === 'Y'){
            d3 = dprice/orQty
            d4 = isNaN(d3)
            if(d4 === true){
              price= 0
            }else{
              price = d3
            }
            netUnitPrice1 = (netStd - price)
            netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
          }else{
            netUnitPrice1 = (data[index].unitPrice/(1+(data[index].taxRate.rate/100)))
            netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
          }
        
        }else if(discountType === "Percentage"){
          if(istaxincludedFlag === 'Y'){
          const discountAmount = ((dprice / 100) * netStd)
          netUnitPrice1 = (netStd - discountAmount)
          netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
          }else{
            netUnitPrice1 = (data[index].unitPrice/(1+(data[index].taxRate.rate/100)))
            netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
          }
        
        }else if(discountType === "Value"){
          if(istaxincludedFlag === 'Y'){
            netUnitPrice1 = (netStd - dprice)
            netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
          }else{
            netUnitPrice1 = (data[index].unitPrice/(1+(data[index].taxRate.rate/100)))
            netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
          }
        }
      }else if((istaxincludedFlag === 'Y') && (appConfig.basePriceCalc === "Actual Cost Price")){
        netUnitPrice = data[index].actualCostPrice
      }else if((istaxincludedFlag === 'N') && (appConfig.basePriceCalc === "Actual Cost Price")){
        const p =  (data[index].actualCostPrice/(1+(data[index].taxRate.rate/100)))
        const p2 = (p).toFixed(2)
        netUnitPrice = p2
      }
      const gridGrossAmt1 = ((data[index].unitPrice) * (data[index].orderedQty))
      const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * data[index].orderedQty))
      const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
      const p =  (data[index].actualCostPrice/(1+(data[index].taxRate.rate/100)))
      const p2 = (p).toFixed(2)
      const obj = {
      'discountType':data[index].discounttype === "TV" ? 'Total value Discount' : data[index].discounttype === "P" ? 'Percentage' :data[index].discounttype === "Value" ? 'Value':undefined,
      'description': data[index].description,
      'margin': data[index].margin,
      'oldMargin': data[index].marginStd,
      'orderQty':data[index].orderedQty,
      'name': data[index].productName,
      'priceList': data[index].listPrice,
      'priceStd': data[index].unitPrice,
      'priceList1': data[index].listPrice,
      'priceStd1': istaxincludedFlag === 'Y' ? data[index].grossStd : data[index].netStd,
      'priceStd2': istaxincludedFlag === 'Y' ? data[index].grossStd : data[index].netStd,
      'costPrice':"",
      'grossAmount':((data[index].unitPrice) * (data[index].orderedQty)).toFixed(2), 
      'discount':data[index].discountvalue === undefined || data[index].discountvalue === null ? 0 :data[index].discountvalue,
      'freeqty':data[index].pofreeqty === undefined || data[index].pofreeqty === null ? 0 : data[index].pofreeqty,
      'productCategoryName':data[index].pCategoryName,
      'productId': data[index].productId,
      'key':data[index].productId,
      'qtyOnHand': data[index].stockQty,
      'responseMargin': "",
      'taxId': data[index].taxRate.csTaxID,
      'twoWeekSale': null,
      'uomId': data[index].uomId,
      'uomName':data[index].uomName,
      'value': data[index].productSearchKey,
      'upc':data[index].upc,
      'salePrice':data[index].salePrice,
      'taxName':data[index].taxRate.name,
      'taxRate':data[index].taxRate.rate,
      'unitPrice1': data[index].unitPrice,
      // 'netUnitPrice':data[index].actualCostPrice,
      'netUnitPrice':netUnitPrice,
      'totalDiscount':data[index].totaldiscount,
      'restrictMargin':data[index].restrictMargin,
      'totalTax':totalTax,
      'skuName':data[index].productSearchKey +"-"+ data[index].productName
      }
      newArray.push(obj)
    }
    setDraftLineData(newArray)
    getCombinedData(newArray)
  }
  setLoading(false)
  }
}

const getCombinedData =(newArray) =>{
  if(newArray.length > 0){
    const unmatchedArray = []
    for (let indexOne = 0; indexOne < productDataCopy.length; indexOne += 1) {
      let boolean = true
      for (let indexTwo = 0; indexTwo < newArray.length; indexTwo += 1) {
        if (productDataCopy[indexOne].value === newArray[indexTwo].value) {
          boolean = false
        }
      }
      if (boolean) {
        unmatchedArray.push(productDataCopy[indexOne])
      }
    }
  const newArr = [...newArray,...unmatchedArray]
  setProductData(newArr)
  setLoading(false)
  }
}

const getProductsAfterSelectionSupplier = async (e)=>{
setLoading(true)
const supplierProductResponse = await getSupplierProduct(e,bunitId,appConfig)
setProductData(supplierProductResponse)
setProductDataCopy(supplierProductResponse)
setLoading(false)
const supplierAddressResponse = await getSupplierAddress(e)
setSupplierAddressName(supplierAddressResponse[0].name === undefined ? null : supplierAddressResponse[0].name)
setSupplierAddressId(supplierAddressResponse[0].recordid)
}


const getLandedCost = async () =>{
  const getLandedCostResponse = await getLandedCostData()
  setLandedCostDropDownData(getLandedCostResponse)
}

const getSelectedRecord = (data) =>{
  let disableBatch;
  setChangePriceDisabledFlag(true)
  setSelectedProductObject(data)
  const disabledFlagg = data.discountType === '' || data.discountType === null || data.discountType === undefined ? false :true
  setdisableDiscountInput(disabledFlagg)
  if (data.batchedProduct === "Y") {
    disableBatch = false;
  } else {
    disableBatch = true;
  }
  form.setFieldsValue({
    'skuValue':data.skuName,
    'productName':data.name,
    'productCategoryName':data.productCategoryName,
    'uomName':data.uomName,
    'HSNCode':"",
    'UPC':data.upc,
    'orderQty':data.orderQty,
    'freeqty':data.freeqty,
    'discountType':data.discountType,
    'discount':data.discount,
    'BasePriceChange':data.priceStd1,
    'unitPrice':data.priceStd,
    'netUnitPrice':data.netUnitPrice,
    'priceList':data.priceList,
    'taxName':data.taxName,
    'margin':data.priceList === null || data.priceList === 0 || data.priceList === undefined || data.priceList === "0"  ? 0 : (((data.priceList - data.priceStd) / data.priceList) * 100).toFixed(2),
    'oldMargin':data.priceList1 === null || data.priceList1 === 0 || data.priceList1 === undefined || data.priceList1 === "0"  ? 0 :(((data.priceList1 - data.priceStd2) / data.priceList1) * 100).toFixed(2),
    'grossAmount':data.grossAmount,
    'totalDiscount':data.totalDiscount,
    'twoWeekSale':data.twoWeekSale,
    'qtyOnHand':data.qtyOnHand,
    'description':data.description,
    'salePrice':data.salePrice,
    'batchNo': data.batchNo,
    'mfg_date': data.mfg_date === undefined || data.mfg_date === null ? null : moment(data.mfg_date),
    'expiry_date': data.expiry_date === undefined || data.expiry_date === null ? null : moment(data.expiry_date),
  })
  setDisableBatchField(disableBatch);
}

const onselectedProduct = (e,data) =>{
const data2 =  data.data
if(appConfig.sku === 'Y'){
  getSelectedRecord(data2)
}
}

const addCostCancel = () =>{
  setAddCostVisible(false)
}

const onSelectLandedCost = (e,data) =>{
  setSelectedLandedCost(data.props.data)
}
const addCostToGrid = () =>{
  const formFieldsData = otherCostForm.getFieldsValue(true);
  const uniqueId = uuid()
      .replace(/-/g, '')
      .toUpperCase()
  const costObj = {
    id : uniqueId,
    calcMethod:selectedLandedCost.calcMethod,
    name:selectedLandedCost.name,
    mProductId:selectedLandedCost.product.mProductId,
    costPrice:formFieldsData.costEntered,
    csTaxId:selectedLandedCost.csTaxId,
    pLcTypeId:selectedLandedCost.pLcTypeId
  }
  setOtherCostData([...otherCostData,costObj])
  setSelectedLandedCost([])
  setAddCostVisible(false)
  otherCostForm.resetFields();
}

const openCostModal = () =>{
  setAddCostVisible(true)
}

const onFinish = () =>{

}

const downloadImportTemplate = () =>{
  const options = {
    fieldSeparator: ',',
    filename: 'PurchaseOrderImport',
    // quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: false,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ['Sku','PPrice','SPrice','Mrp','qty','freeqty','discountValue'] 
  }
  const csvExporter = new ExportToCsv(options)
    csvExporter.generateCsv([{'Sku':'','PPrice':'','SPrice':'','Mrp':'','qty':'','freeqty':'','discountValue':''}])
}

  const scanUpcOrSku = (event) =>{
    form.resetFields(["GrossAmount", "batchNo"]);
    form.setFieldsValue({ mfg_date: "", expiry_date: "" });
    const code = event.keyCode || event.which
    if(code === 13){
      skuform.resetFields()
      form.resetFields()
          let upcOrSku;
            if(radioValue === 1){
              upcOrSku = 'upc'
            }else{
              upcOrSku = 'sku'
            }
            const index = productData.findIndex(element => {
              if(upcOrSku === 'sku'){
                return element.value === event.target.value
              }else{
                return element.upc === event.target.value
              }
          })
          if (index >= 0) {
          let productIdToMatch;
          for (let index = 0; index < productData.length; index++) {
            let element;
            if(upcOrSku === 'sku'){
              element = productData[index].value;
            }else{
              element = productData[index].upc;
            }
            if(element === event.target.value){
              const isBatchedFlag = productData[index].batchedProduct;
              if (isBatchedFlag === "Y") {
                setBatchModalVisible(true);
                setDisableBatchField(false);
              } else {
                setBatchModalVisible(false);
                setDisableBatchField(true);
              }
              productIdToMatch = productData[index].productId
              const discountType = productData[index].discountType
              let description = productData[index].description
              let freeqty = productData[index].freeqty === null || productData[index].freeqty === undefined || productData[index].freeqty === "" ? 0 : productData[index].freeqty
              let price=0;
              let dprice = productData[index].discount === null || productData[index].discount === undefined || productData[index].discount === "" ? 0 : productData[index].discount;
              let orQty = productData[index].orderQty === null || productData[index].orderQty === undefined || productData[index].orderQty === 0 ? 1:parseInt(productData[index].orderQty) + 1
              let upc = productData[index].upc === null || productData[index].upc === undefined ? null :  productData[index].upc
              let d3;
              let d4;
              let margin;
              let gridGrossAmt; 
              let totalDiscount =0;
              let istaxincluded = istaxincludedFlag
              let unitPrice;
              let netUnitPrice;
              let totalTax;
              const basePrice = parseFloat(productData[index].priceStd1)
              const salePrice = parseFloat(productData[index].salePrice)
              let initialPriceList = parseFloat(productData[index].priceList)
              
              d3 = dprice/orQty
              d4 = isNaN(d3)
              if(d4 === true){
                price= 0
              }else{
                price = d3
              }
              if((istaxincluded === 'Y') && (appConfig.basePriceCalc === "Purchase Price")){
                if(discountType === undefined || discountType === null){
                  setdisableDiscountInput(false)
                  const netUnitPrice1 = ((basePrice/(1+productData[index].taxRate/100)) - price)
                  const taxOnUnitPrice = ((productData[index].taxRate/ 100) * netUnitPrice1)
                  const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
                  const gridGrossAmt1 = (unitPrice1 * orQty)
                  const margin1 = initialPriceList === undefined || initialPriceList === null || initialPriceList === 0 || initialPriceList === "0" ? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
                  const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))
              
                  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
                  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
                  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
                  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
                  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
                }else if(discountType === "Total value Discount"){
                  setdisableDiscountInput(true)
                  const netUnitPrice1 = ((basePrice/(1+productData[index].taxRate/100)) - price)
                  const taxOnUnitPrice = ((productData[index].taxRate/ 100) * netUnitPrice1)
                  const  unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
                  const  gridGrossAmt1 = (unitPrice1 * orQty)
                  const  margin1 = initialPriceList === undefined || initialPriceList === null || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
                  const basePriceAfterTax = (basePrice/(1+productData[index].taxRate/100))
                  const  totalDiscount1 = ((basePriceAfterTax * orQty) - (netUnitPrice1 * orQty))
                  const  totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))
              
                  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
                  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
                  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
                  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
                  totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
                  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
                }else if(discountType === "Percentage"){
                  setdisableDiscountInput(true)
                  const costPrice3 = (basePrice/(1+(productData[index].taxRate/100)))
                  const discountAmount = ((dprice / 100) * costPrice3)
                  const netUnitPrice1 = ((basePrice/(1+productData[index].taxRate/100)) - discountAmount)
                  const taxOnUnitPrice = ((productData[index].taxRate/ 100) * netUnitPrice1)
                  const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice)
                  const gridGrossAmt1 = (unitPrice1 * orQty).toFixed(2)
                  const margin1 = initialPriceList === undefined || initialPriceList === null || initialPriceList === 0 || initialPriceList === "0" ? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
                  const basePriceAfterTax = (basePrice/(1+productData[index].taxRate/100))
                  const totalDiscount1 = ((basePriceAfterTax * orQty) - (netUnitPrice1 * orQty))
                  const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))
              
                  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
                  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
                  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
                  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
                  totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
                  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
                }else if(discountType === "Value"){
                  setdisableDiscountInput(true)
                  const netUnitPrice1 = ((basePrice/(1+productData[index].taxRate/100)) - dprice)
                  const taxOnUnitPrice = ((productData[index].taxRate/ 100) * netUnitPrice1)
                  const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice)
                  const gridGrossAmt1 = unitPrice1 * orQty
                  const margin1 = initialPriceList === undefined || initialPriceList === null || initialPriceList === 0 || initialPriceList === "0" ? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
                  const basePriceAfterTax = (basePrice/(1+productData[index].taxRate/100))
                  const totalDiscount1 = ((basePriceAfterTax * orQty) - (netUnitPrice1 * orQty))
                  const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))
              
                  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
                  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
                  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
                  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
                  totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
                  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
                }
              }else if ((istaxincluded === 'N') && (appConfig.basePriceCalc === "Purchase Price"))
              {
                if(discountType === undefined){
                  setdisableDiscountInput(false)
                  const netUnitPrice1 = (basePrice - price)
                  const taxOnUnitPrice1 = ((productData[index].taxRate/ 100) * netUnitPrice1)
                  const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice1)
                  const gridGrossAmt1 = (unitPrice1 * orQty)
                  const margin1 = initialPriceList === undefined || initialPriceList === null || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
                  const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))
              
                  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
                  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
                  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
                  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
                  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
                }else if(discountType === "Total value Discount"){
                  setdisableDiscountInput(true)
                  const netUnitPrice1 = (basePrice - price)
                  const taxOnUnitPrice = ((productData[index].taxRate/ 100) * netUnitPrice1)
                  const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice)
                  const gridGrossAmt1 = (unitPrice1 * orQty)
                  const margin1 = initialPriceList === undefined || initialPriceList === null || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
                  const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
                  const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))
              
                  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
                  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
                  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
                  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
                  totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
                  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
                }else if(discountType === "Percentage"){
                  setdisableDiscountInput(true)
                  const discountAmount = ((dprice / 100) * basePrice)
                  const netUnitPrice1 = (basePrice - discountAmount)
                  const taxOnUnitPrice = ((productData[index].taxRate/ 100) * netUnitPrice1)
                  const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
                  const gridGrossAmt1 = (unitPrice1 * orQty)
                  const margin1 = initialPriceList === undefined || initialPriceList === null || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
                  const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
                  const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))
              
                  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
                  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
                  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
                  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
                  totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
                  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
                }else if(discountType === "Value"){
                  setdisableDiscountInput(true)
                  const netUnitPrice1 = (basePrice - dprice)
                  const taxOnUnitPrice = ((productData[index].taxRate/ 100) * netUnitPrice1)
                  const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice)
                  const gridGrossAmt1 = unitPrice1 * orQty
                  const margin1 = initialPriceList === undefined || initialPriceList === null || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
                  const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
                  const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))
              
                  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
                  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
                  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
                  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
                  totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
                  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
                }
              }else{
                if(discountType === undefined){
                  setdisableDiscountInput(false)
                  const netUnitPrice1 = (basePrice - price)
                  const taxOnUnitPrice1 = ((productData[index].taxRate/ 100) * netUnitPrice1)
                  const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice1)
                  const gridGrossAmt1 = (unitPrice1 * orQty)
                  const margin1 = initialPriceList === undefined || initialPriceList === null || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
                  const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))
              
                  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
                  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
                  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
                  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
                  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
                }else if(discountType === "Total value Discount"){
                  setdisableDiscountInput(true)
                  const netUnitPrice1 = (basePrice - price)
                  const taxOnUnitPrice = ((productData[index].taxRate/ 100) * netUnitPrice1)
                  const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice)
                  const gridGrossAmt1 = (unitPrice1 * orQty)
                  const margin1 = initialPriceList === undefined || initialPriceList === null || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
                  const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
                  const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))
              
                  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
                  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
                  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
                  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
                  totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
                  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
                }else if(discountType === "Percentage"){
                  setdisableDiscountInput(true)
                  const discountAmount = ((dprice / 100) * basePrice)
                  const netUnitPrice1 = (basePrice - discountAmount)
                  const taxOnUnitPrice = ((productData[index].taxRate/ 100) * netUnitPrice1)
                  const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
                  const gridGrossAmt1 = (unitPrice1 * orQty)
                  const margin1 = initialPriceList === undefined || initialPriceList === null || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
                  const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
                  const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))
              
                  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
                  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
                  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
                  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
                  totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
                  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
                }else if(discountType === "Value"){
                  setdisableDiscountInput(true)
                  const netUnitPrice1 = (basePrice - dprice)
                  const taxOnUnitPrice = ((productData[index].taxRate/ 100) * netUnitPrice1)
                  const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice)
                  const gridGrossAmt1 = unitPrice1 * orQty
                  const margin1 = initialPriceList === undefined || initialPriceList === null || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
                  const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
                  const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))
              
                  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
                  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
                  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
                  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
                  totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
                  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
                }
              }
              form.setFieldsValue({
                'grossAmount':gridGrossAmt,
                'totalDiscount':totalDiscount,
                'unitPrice':unitPrice,
                'margin':margin,
                'netUnitPrice':netUnitPrice,
                'skuValue':productData[index].value +"-"+ productData[index].name,
                'productName':productData[index].name,
                'productCategoryName':productData[index].productCategoryName,
                'uomName':productData[index].uomName,
                'HSNCode':"",
                'UPC':productData[index].upc,
                'orderQty':orQty,
                'freeqty':productData[index].freeqty,
                'discountType':productData[index].discountType,
                'discount':productData[index].discount,
                'BasePriceChange':productData[index].priceStd1,
                'priceList':productData[index].priceList,
                'taxName':productData[index].taxName,
                'margin':margin,
                'oldMargin':productData[index].priceList1 === undefined || productData[index].priceList1 === null || productData[index].priceList1 === 0 || productData[index].priceList1 === "0" ? 0 :(((productData[index].priceList1 - productData[index].priceStd2) / productData[index].priceList1) * 100).toFixed(2),
                'twoWeekSale':productData[index].twoWeekSale,
                'qtyOnHand':productData[index].qtyOnHand,
                'description':productData[index].description,
                'salePrice':productData[index].salePrice,
                'batchNo': productData[index].batchNo,
                'mfg_date': productData[index].mfg_date === undefined || productData[index].mfg_date === null ? null : moment(productData[index].mfg_date),
                'expiry_date': productData[index].expiry_date === undefined || productData[index].expiry_date === null ? null : moment(productData[index].expiry_date),
              })
              
              const obj = {
                'totalTax':totalTax,
                'discountType':discountType,
                'discount':dprice,
                'freeqty':freeqty,
                'description': description,
                'margin': margin,
                'oldMargin' :productData[index].priceList1 === undefined || productData[index].priceList1 === null || productData[index].priceList1 === 0 || productData[index].priceList1 === "0"? 0 :(((productData[index].priceList1 - productData[index].priceStd2) / productData[index].priceList1) * 100).toFixed(2),
                'orderQty':orQty,
                'name': productData[index].name,
                'netUnitPrice': netUnitPrice,
                'priceList': initialPriceList,
                'priceList1': productData[index].priceList,
                'priceStd': unitPrice,
                'priceStd1': basePrice,
                'priceStd2': productData[index].priceStd2,
                'productCategoryName': productData[index].productCategoryName,
                'productId': productData[index].productId,
                'qtyOnHand': productData[index].qtyOnHand,
                'responseMargin': productData[index].responseMargin,
                'taxId': productData[index].taxId,
                'taxName': productData[index].taxName,
                'taxRate': productData[index].taxRate,
                'twoWeekSale': productData[index].twoWeekSale,
                'unitPrice': unitPrice,
                'unitPrice1': productData[index].unitPrice1,
                'uomId': productData[index].uomId,
                'uomName': productData[index].uomName,
                'upc': productData[index].upc,
                'value': productData[index].value,
                'totalDiscount':totalDiscount,
                'grossAmount':gridGrossAmt,
                'salePrice':salePrice,
                'skuValue':productData[index].value +"-"+ productData[index].name,
                'restrictMargin':productData[index].restrictMargin
              }
              setSelectedProductObject(obj)
              const newArray = []
              for (let index1 = 0; index1 < productData.length; index1++) {
                const productIdFromArray = productData[index1].productId;
                if(productIdFromArray !==productIdToMatch){
                  newArray.push(productData[index1])
                }
              }
              newArray.unshift(obj)
              setProductData(newArray)
            }  
          }
          }else{
            message.error("Product not found!")
            skuform.resetFields()
          }
    }
  }

  const closeBatchModal = () => {
    setBatchModalVisible(false);
  };

  const addBatch = () => {
    setBatchModalVisible(false);
  };

const OnChangeOrderQty = () =>{
  setTimeout(() => {
  const productObject = selectedProductObject
  const formFieldsData = form.getFieldsValue(true);
const discountType = formFieldsData.discountType
let description = formFieldsData.description
let freeqty = formFieldsData.freeqty === null || formFieldsData.freeqty === undefined || formFieldsData.freeqty === "" ? 0 : formFieldsData.freeqty
let price=0;
let dprice = formFieldsData.discount === null || formFieldsData.discount === undefined || formFieldsData.discount === "" ? 0 : formFieldsData.discount;
let orQty = formFieldsData.orderQty === null || formFieldsData.orderQty === undefined  ? 0:formFieldsData.orderQty
let upc = formFieldsData.UPC === null || formFieldsData.UPC === undefined ? null :  formFieldsData.UPC
let d3;
let d4;
let margin;
let gridGrossAmt; 
let totalDiscount =0;
let istaxincluded = istaxincludedFlag
let unitPrice;
let netUnitPrice;
let totalTax;
const basePrice = parseFloat(formFieldsData.BasePriceChange)
const salePrice = parseFloat(formFieldsData.salePrice)
let initialPriceList = parseFloat(formFieldsData.priceList)
let mfg_date = formFieldsData.mfg_date === "" || formFieldsData.mfg_date === undefined || formFieldsData.mfg_date === null ? null : formFieldsData.mfg_date;
let expiry_date = formFieldsData.expiry_date === "" || formFieldsData.expiry_date === undefined || formFieldsData.expiry_date === null ? null : formFieldsData.expiry_date;
let batchNo = formFieldsData.batchNo;
let BpriceList = selectedProductObject.priceList;
let Bsaleprice = selectedProductObject.salePrice;
let flag = true
let flag2 = true
if(initialPriceList < basePrice){
  flag = false
}else if (salePrice < basePrice){
  flag2 = false
}else{
 flag = true
}
if(selectedProductObject.restrictMargin === "Y"){
  if(flag === false){
    message.error("Mrp should not be less than base price")
    form.setFieldsValue({'priceList':BpriceList})
  }else if(flag2 === false){
   message.error("Sale Price should not be less than base price")
   form.setFieldsValue({'salePrice':Bsaleprice})
  }
}else{

}

d3 = dprice/orQty
d4 = isNaN(d3)
if(d4 === true){
  price= 0
}else{
  price = d3
}
if((istaxincluded === 'Y') && (appConfig.basePriceCalc === "Purchase Price")){
  if(discountType === undefined || discountType === null){
    setdisableDiscountInput(false)
    const netUnitPrice1 = ((basePrice/(1+productObject.taxRate/100)) - price)
    const taxOnUnitPrice = ((productObject.taxRate/ 100) * netUnitPrice1)
    const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
    const gridGrossAmt1 = (unitPrice1 * orQty)
    const margin1 = initialPriceList === null || initialPriceList === undefined || initialPriceList === 0 || initialPriceList === "0" ? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
    const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

    netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
    unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
    gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
    margin = (Math.round(margin1 * 100) / 100).toFixed(2)
    totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
  }else if(discountType === "Total value Discount"){
    setdisableDiscountInput(true)
    const netUnitPrice1 = ((basePrice/(1+productObject.taxRate/100)) - price)
    const taxOnUnitPrice = ((productObject.taxRate/ 100) * netUnitPrice1)
    const  unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
    const  gridGrossAmt1 = (unitPrice1 * orQty)
    const  margin1 = initialPriceList === null || initialPriceList === undefined || initialPriceList === 0 || initialPriceList === "0"? 0 : (((initialPriceList - unitPrice1) / initialPriceList) * 100)
    const basePriceAfterTax = (basePrice/(1+productObject.taxRate/100))
    const  totalDiscount1 = ((basePriceAfterTax * orQty) - (netUnitPrice1 * orQty))
    const  totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

    netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
    unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
    gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
    margin = (Math.round(margin1 * 100) / 100).toFixed(2)
    totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
    totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
  }else if(discountType === "Percentage"){
    setdisableDiscountInput(true)
    const costPrice3 = (basePrice/(1+(productObject.taxRate/100)))
    const discountAmount = ((dprice / 100) * costPrice3)
    const netUnitPrice1 = ((basePrice/(1+productObject.taxRate/100)) - discountAmount)
    const taxOnUnitPrice = ((productObject.taxRate/ 100) * netUnitPrice1)
    const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice)
    const gridGrossAmt1 = (unitPrice1 * orQty).toFixed(2)
    const margin1 = initialPriceList === null || initialPriceList === undefined || initialPriceList === 0 || initialPriceList === "0"? 0 : (((initialPriceList - unitPrice1) / initialPriceList) * 100)
    const basePriceAfterTax = (basePrice/(1+productObject.taxRate/100))
    const totalDiscount1 = ((basePriceAfterTax * orQty) - (netUnitPrice1 * orQty))
    const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

    netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
    unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
    gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
    margin = (Math.round(margin1 * 100) / 100).toFixed(2)
    totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
    totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
  }else if(discountType === "Value"){
    setdisableDiscountInput(true)
    const netUnitPrice1 = ((basePrice/(1+productObject.taxRate/100)) - dprice)
    const taxOnUnitPrice = ((productObject.taxRate/ 100) * netUnitPrice1)
    const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice)
    const gridGrossAmt1 = unitPrice1 * orQty
    const margin1 = initialPriceList === null || initialPriceList === undefined || initialPriceList === 0 || initialPriceList === "0"? 0 : (((initialPriceList - unitPrice1) / initialPriceList) * 100)
    const basePriceAfterTax = (basePrice/(1+productObject.taxRate/100))
    const totalDiscount1 = ((basePriceAfterTax * orQty) - (netUnitPrice1 * orQty))
    const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

    netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
    unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
    gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
    margin = (Math.round(margin1 * 100) / 100).toFixed(2)
    totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
    totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
  }
}else if ((istaxincluded === 'N') && (appConfig.basePriceCalc === "Purchase Price"))
{
  if(discountType === undefined){
    setdisableDiscountInput(false)
    const netUnitPrice1 = (basePrice - price)
    const taxOnUnitPrice1 = ((productObject.taxRate/ 100) * netUnitPrice1)
    const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice1)
    const gridGrossAmt1 = (unitPrice1 * orQty)
    const margin1 = initialPriceList === null || initialPriceList === undefined || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
    const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

    netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
    unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
    gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
    margin = (Math.round(margin1 * 100) / 100).toFixed(2)
    totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
  }else if(discountType === "Total value Discount"){
    setdisableDiscountInput(true)
    const netUnitPrice1 = (basePrice - price)
    const taxOnUnitPrice = ((productObject.taxRate/ 100) * netUnitPrice1)
    const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice)
    const gridGrossAmt1 = (unitPrice1 * orQty)
    const margin1 = initialPriceList === null || initialPriceList === undefined || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
    const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
    const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

    netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
    unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
    gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
    margin = (Math.round(margin1 * 100) / 100).toFixed(2)
    totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
    totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
  }else if(discountType === "Percentage"){
    setdisableDiscountInput(true)
    const discountAmount = ((dprice / 100) * basePrice)
    const netUnitPrice1 = (basePrice - discountAmount)
    const taxOnUnitPrice = ((productObject.taxRate/ 100) * netUnitPrice1)
    const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
    const gridGrossAmt1 = (unitPrice1 * orQty)
    const margin1 = initialPriceList === null || initialPriceList === undefined || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
    const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
    const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

    netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
    unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
    gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
    margin = (Math.round(margin1 * 100) / 100).toFixed(2)
    totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
    totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
  }else if(discountType === "Value"){
    setdisableDiscountInput(true)
    const netUnitPrice1 = (basePrice - dprice)
    const taxOnUnitPrice = ((productObject.taxRate/ 100) * netUnitPrice1)
    const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice)
    const gridGrossAmt1 = unitPrice1 * orQty
    const margin1 = initialPriceList === null || initialPriceList === undefined || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
    const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
    const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

    netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
    unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
    gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
    margin = (Math.round(margin1 * 100) / 100).toFixed(2)
    totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
    totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
  }
}else{
// inside actual cost block where it has priceincludedtax flag Y or N
if(discountType === undefined){
  setdisableDiscountInput(false)
  const netUnitPrice1 = (basePrice - price)
  const taxOnUnitPrice1 = ((productObject.taxRate/ 100) * netUnitPrice1)
  const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice1)
  const gridGrossAmt1 = (unitPrice1 * orQty)
  const margin1 = initialPriceList === null || initialPriceList === undefined || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
  const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
}else if(discountType === "Total value Discount"){
  setdisableDiscountInput(true)
  const netUnitPrice1 = (basePrice - price)
  const taxOnUnitPrice = ((productObject.taxRate/ 100) * netUnitPrice1)
  const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice)
  const gridGrossAmt1 = (unitPrice1 * orQty)
  const margin1 = initialPriceList === null || initialPriceList === undefined || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
  const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
  const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
  totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
}else if(discountType === "Percentage"){
  setdisableDiscountInput(true)
  const discountAmount = ((dprice / 100) * basePrice)
  const netUnitPrice1 = (basePrice - discountAmount)
  const taxOnUnitPrice = ((productObject.taxRate/ 100) * netUnitPrice1)
  const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
  const gridGrossAmt1 = (unitPrice1 * orQty)
  const margin1 = initialPriceList === null || initialPriceList === undefined || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
  const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
  const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
  totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
}else if(discountType === "Value"){
  setdisableDiscountInput(true)
  const netUnitPrice1 = (basePrice - dprice)
  const taxOnUnitPrice = ((productObject.taxRate/ 100) * netUnitPrice1)
  const unitPrice1 = parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice)
  const gridGrossAmt1 = unitPrice1 * orQty
  const margin1 = initialPriceList === null || initialPriceList === undefined || initialPriceList === 0 || initialPriceList === "0"? 0 :(((initialPriceList - unitPrice1) / initialPriceList) * 100)
  const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
  const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

  netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
  unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
  gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
  margin = (Math.round(margin1 * 100) / 100).toFixed(2)
  totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
  totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
}
}
form.setFieldsValue({
  'grossAmount':gridGrossAmt,
  'totalDiscount':totalDiscount,
  'unitPrice':unitPrice,
  'margin':margin,
  'netUnitPrice':netUnitPrice,
})

const obj = {
  'totalTax':totalTax,
  'discountType':discountType,
  'discount':dprice,
  'freeqty':freeqty,
  'description': description,
  'margin': margin,
  'oldMargin' :productObject.priceList1 === null || productObject.priceList1 === undefined || productObject.priceList1 === 0 || productObject.priceList1 === "0" ? 0:(((productObject.priceList1 - productObject.priceStd2) / productObject.priceList1) * 100).toFixed(2),
  'orderQty':orQty,
  'name': productObject.name,
  'netUnitPrice': netUnitPrice,
  'priceList': initialPriceList,
  'priceList1': productObject.priceList,
  'priceStd': unitPrice,
  'priceStd1': basePrice,
  'priceStd2': productObject.priceStd2,
  'productCategoryName': productObject.productCategoryName,
  'productId': productObject.productId,
  'qtyOnHand': productObject.qtyOnHand,
  'responseMargin': productObject.responseMargin,
  'taxId': productObject.taxId,
  'taxName': productObject.taxName,
  'taxRate': productObject.taxRate,
  'twoWeekSale': productObject.twoWeekSale,
  'unitPrice': unitPrice,
  'unitPrice1': productObject.unitPrice1,
  'uomId': productObject.uomId,
  'uomName': productObject.uomName,
  'upc': upc,
  'value': productObject.value,
  'totalDiscount':totalDiscount,
  'grossAmount':gridGrossAmt,
  'salePrice':salePrice,
  'skuValue':productObject.skuValue,
  'skuName':productObject.skuName,
  'restrictMargin':productObject.restrictMargin,
  'batchedProduct': productObject.batchedProduct,
  'batchNo': batchNo,
  'expiry_date': moment(expiry_date).format("YYYY-MM-DD") === "Invalid date" ? null : moment(expiry_date).format("YYYY-MM-DD"),
  'mfg_date': moment(mfg_date).format("YYYY-MM-DD") === "Invalid date" ? null : moment(mfg_date).format("YYYY-MM-DD"),
}
const newArray = []
for (let index = 0; index < productData.length; index++) {
  const productIdFromArray = productData[index].productId;
  if(productIdFromArray !==productObject.productId){
    newArray.push(productData[index])
  }
}
newArray.unshift(obj)
setProductData(newArray)
}, 1000);   
}

const callbackTabs = (key) =>{
  setTabKey(key)
  form.resetFields()  
    summaryForm.setFieldsValue({
      'summreceiptdate':moment(scheduledDate,dateFormat),
      'summbusinessunit':businessUnitName,
      'summorderdate':currentDate,
      'summsupplier':supplierName,
      'summsupplierAddress':supplierAddressName,
      'summdeliveryAddress':deliveryLocationName,
    })
  let newArray =[]
  for (let index = 0; index < productData.length; index++) {
    const element = productData[index].orderQty
      const ele2 = productData[index].freeqty
      if (element > 0 || ele2 > 0) {
        productData[index].freeqty = productData[index].freeqty === "" || null ? 0 : productData[index].freeqty
        const taxRate = productData[index].taxRate
        const basePrice = productData[index].priceStd2
        let grossStd;
        let netStd;
        if(istaxincludedFlag === 'Y'){
          grossStd = productData[index].priceStd2
          netStd = (basePrice/(1+taxRate/100)).toFixed(2)
        }else{
          const taxOnUnitPrice = ((taxRate/ 100) * basePrice)
          grossStd = (parseFloat(basePrice) + parseFloat(taxOnUnitPrice)).toFixed(2)
          netStd = productData[index].priceStd2
        }
        productData[index].grossStd = grossStd
        productData[index].netStd = netStd
        newArray.push(productData[index])
      }
  }
  setPoSummaryData(newArray)
}
const poReview = () =>{
  setTabKey("13")
  summaryForm.setFieldsValue({
    'summreceiptdate':moment(scheduledDate,dateFormat),
    'summbusinessunit':businessUnitName,
    'summorderdate':currentDate,
    'summsupplier':supplierName,
    'summsupplierAddress':supplierAddressName,
    'summdeliveryAddress':deliveryLocationName,
  })
  let newArray =[]
  for (let index = 0; index < productData.length; index++) {
    const element = productData[index].orderQty
      const ele2 = productData[index].freeqty
      if (element > 0 || ele2 > 0) {
        productData[index].freeqty = productData[index].freeqty === "" || null ? 0 : productData[index].freeqty
        const taxRate = productData[index].taxRate
        const basePrice = productData[index].priceStd2
        let grossStd;
        let netStd;
        if(istaxincludedFlag === 'Y'){
          grossStd = productData[index].priceStd2
          netStd = (basePrice/(1+taxRate/100)).toFixed(2)
        }else{
          const taxOnUnitPrice = ((taxRate/ 100) * basePrice)
          grossStd = (parseFloat(basePrice) + parseFloat(taxOnUnitPrice)).toFixed(2)
          netStd = productData[index].priceStd2
          // netStd = productData[index].netUnitPrice
        }
        productData[index].grossStd = grossStd
        productData[index].netStd = netStd
        newArray.push(productData[index])
      }
  }
  setPoSummaryData(newArray)
  const countOfProducts = newArray.length
  if(countOfProducts === 0){
    message.error('Please Add Products')
  }else{
    let lessMarginSkus =[]
    let restrictMarginProducts = []
       for (let index45 = 0; index45 < newArray.length; index45++) {
         const margin = parseInt(newArray[index45].margin);
         const oldMargin = parseInt(newArray[index45].oldMargin)
         if(margin >= oldMargin){
         }else{
          lessMarginSkus.push(newArray[index45].value)
         }
         if(newArray[index45].restrictMargin === "N"){
          restrictMarginProducts.push(newArray[index45].value)
         }
       }
            const matchedArray = []
            const unmatchedArray = []
            for (let indexOne = 0; indexOne < lessMarginSkus.length; indexOne += 1) {
              let boolean = true
              for (let indexTwo = 0; indexTwo < restrictMarginProducts.length; indexTwo += 1) {
                if (lessMarginSkus[indexOne] === restrictMarginProducts[indexTwo]) {
                  matchedArray.push(restrictMarginProducts[indexTwo])
                  boolean = false
                }
              }
              if (boolean) {
                unmatchedArray.push(lessMarginSkus[indexOne])
              }
            }
      setPoSummaryVisible(true)
    //    if(unmatchedArray.length > 0){
    //     Modal.error({
    //       title: 'Purchase Margin less than old Margin !',
    //       content: `${unmatchedArray}`,
    //       closable: true,
    //       icon:null,
    //       footer: null,
    //     })
    // }else{
    //   setPoSummaryVisible(true)
    // }
  }

}
const getPrintCofirmation = (recordId,messageForSuccess) => {
  Modal.confirm({
    title: `${messageForSuccess}`,
    content: 'Do you want take Printout',
    okText: 'Yes',
    icon:null,
    cancelText: 'No',
    onOk() {
      getPrintPdffile(recordId)
      setPoSummaryData([])
      setProductData([])
      setOtherCostData([])
    },
    onCancel() {
      setPoSummaryVisible(false)
      setProductData([])
      setPoSummaryData([])
      setProductData([])
      setOtherCostData([])
    },
  });
}

const getPrintPdffile = (recordId) => {
  const authHeaders = getOAuthHeaders();
  if (authHeaders && authHeaders.email && authHeaders.access_token) {
  const RoleId = window.localStorage.getItem('userData')
  const getPrintPdfData = {
    query: `query {reportTemplate(ad_tab_id:"EE797F0AD47E41A08CFBC7867F538661",recordId:"${recordId}")}`,
  }

  Axios({
    url: genericUrl,
    method: 'POST',
    async: true,
    crossDomain: true,
    data: getPrintPdfData,

    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${authHeaders.access_token}`,
      RoleId: `${RoleId.role_id}`,
    },
  }).then(response => {
    if (
      response.data.data.reportTemplate === null ||
      response.data.data.reportTemplate === 'null' ||
      response.data.data.reportTemplate === ''
    ) {
      
    } else {
      getPrintCommand(response.data.data.reportTemplate)
    }
  })
}
}

const getPrintCommand = fileName => {
  setProductData([])
  setPoSummaryVisible(false)
  Axios({
    url: `${fileDownloadUrl}`.concat(`${fileName}`),
    method: 'GET',
    responseType: 'blob',
  }).then(response => {
    const fileURL = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.setAttribute('id', 'downloadlink')
    link.href = fileURL
    link.setAttribute('download', `${fileName}`)
    link.click()
  })
}

const savePo = () =>{
  const authHeaders = getOAuthHeaders();
  if (authHeaders && authHeaders.email && authHeaders.access_token) {
  setLoading(true)
  const formFieldsData = summaryForm.getFieldsValue(true);
  const Remarks = formFieldsData.summremarks
  const arrayForMutation = []
    const arrayForLandedCost = []
    let uomId = ''
    let productId1 = ''
    let orderQty1 = ''
    let unitPrice = ''
    let listPrice = ''
    let taxId = ''
    let description1 = ''
    let freeqty = ''
    let margin = ''
    let discountValue=''
    let discountType=''
    let totalDiscount=''
    let PLcTypeId=''
    let Value=''
    let MProductId =''
    let CsTaxId=''
    let grossStd
    let netStd
    let upc =''
    let marginStd = ''
    let salePrice=''
    let uniqueId = uuid()
            .replace(/-/g, '')
            .toUpperCase()
  for (let index2 = 0; index2 < otherCostData.length; index2++) {
    PLcTypeId = otherCostData[index2].pLcTypeId
    Value = otherCostData[index2].costPrice
    MProductId = otherCostData[index2].mProductId
    CsTaxId = otherCostData[index2].csTaxId
    arrayForLandedCost.push(
      `{
        pLcTypeId : "${PLcTypeId}",
        value :  ${Value},      
        productId : "${MProductId}",
        taxId : "${CsTaxId}"
      }`,
    )
  }
  for (let index = 0; index < poSummaryData.length; index++) {
  uomId = poSummaryData[index].uomId
  grossStd = poSummaryData[index].grossStd
  netStd = poSummaryData[index].netStd
  productId1 = poSummaryData[index].productId
  orderQty1 = poSummaryData[index].orderQty
  // unitPrice = poSummaryData[index].priceStd
  // unitPrice = istaxincludedFlag === 'Y' ? poSummaryData[index].priceStd : poSummaryData[index].netUnitPrice
  unitPrice = appConfig.basePriceCalc === "Purchase Price" ?(istaxincludedFlag === 'Y' ? poSummaryData[index].priceStd : poSummaryData[index].netUnitPrice) :(istaxincludedFlag === 'Y' ? poSummaryData[index].priceStd : poSummaryData[index].netUnitPrice)
  listPrice = poSummaryData[index].priceList
  taxId = poSummaryData[index].taxId
  upc = poSummaryData[index].upc
  salePrice = poSummaryData[index].salePrice
  marginStd=poSummaryData[index].oldMargin === "-Infinity" || poSummaryData[index].oldMargin === "Infinity" ? 0 :poSummaryData[index].oldMargin
  description1 =
  poSummaryData[index].description === null ||
  poSummaryData[index].description === undefined
      ? null
      : poSummaryData[index].description
  freeqty = poSummaryData[index].freeqty === undefined ? 0 : poSummaryData[index].freeqty === null ? 0: poSummaryData[index].freeqty === "" ? 0 : poSummaryData[index].freeqty
  margin = poSummaryData[index].margin === "-Infinity" || poSummaryData[index].margin === "Infinity" ? 0 : poSummaryData[index].margin
  discountValue = poSummaryData[index].discount === null || poSummaryData[index].discount === undefined ? 0 : poSummaryData[index].discount    
  discountType = poSummaryData[index].discountType === "Total value Discount" ? 'TV' : poSummaryData[index].discountType === "Percentage" ? 'P' :poSummaryData[index].discountType === "Value" ? 'V':null
  totalDiscount = poSummaryData[index].totalDiscount
  arrayForMutation.push(
    `{
      
        productId : "${productId1}",
        uomId : "${uomId}",
        orderQty : ${orderQty1},
        unitPrice : ${unitPrice},                                      
        listPrice : ${listPrice},
        taxId : ${taxId === null || taxId === undefined ||taxId === "" ? null :`"${taxId}"`},
        description : ${description1 === null || description1 === undefined ? null : `"${description1}"`},
        freeqty : ${freeqty},
        margin : ${margin},
        isManual: "Y",
        marginStd : ${marginStd},
        discountvalue : ${discountValue},
        discountType: ${discountType === null || discountType === undefined ? null : `"${discountType}"`},       
        totalDiscount: "${totalDiscount}",
        grossstd:${grossStd},
        netstd:${netStd}
        salePrice:${salePrice},
        upc:${upc === undefined || upc === null || upc === "" ? null :`"${upc}"`}
    }`,
  )
}
const createPoOrder = {
  query: `mutation {
    savePO(order : {
            orderId : ${selectedOrderId === "" ? `"${uniueOrderId}"`:`"${selectedOrderId}"`},
            bunitId : "${bunitId}",
            bunitLocationId : "${regionName}",
            supplierId : "${supplierId}",
            dateOrdered : "${currentDate}",
            datePromised : "${scheduledDate}",
            isTaxIncluded : "${istaxincludedFlag}",
            pricelistId : "${priceListId}",
            description : ${Remarks === undefined || null ? null : `"${Remarks}"`},
            deliveryNote : "Check Quantity & Price",
            supplierAddressId : "${supplierAddressId}",
            lines : [${arrayForMutation}]
            landedCost:[${arrayForLandedCost}]
    }) {
            type
            code
            message
            documentNo
            extraParam
    }
}`,
}
Axios({
  url: serverUrl,
  method: 'POST',
  data: createPoOrder,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `bearer ${authHeaders.access_token}`,
  },
}).then(response => {
  if (response.data.data !== null) {
    const Status = response.data.data.savePO.type
    const messageForSuccess = response.data.data.savePO.message
    if (Status === 'Success') {
      setPoSummaryVisible(false)
      message.success(messageForSuccess)
      form.resetFields();
      summaryForm.resetFields([
      "summbusinessunit",
      "summsupplier",
      "summsupplierAddress",
      "summdeliveryAddress",
      ]);
      headerform.resetFields([
      "supplier",
      "Po",
      "deliveryLocation"
      ]);
      setBusinessUnitName('')
      setSupplierName('')
      setSupplierAddressName('')
      setDeliveryLocationName('')
      setLoading(false)
      setSelectedOrderId("")
      SetUniueOrderId(uniqueId)
    }else{
      message.error(messageForSuccess)
      setLoading(false)
    }
  }else{
    message.error('Getting error while saving a PO')
    setLoading(false)
  }
})
}
}

const createPO = () =>{
  const authHeaders = getOAuthHeaders();
  if (authHeaders && authHeaders.email && authHeaders.access_token) {
  setLoading(true)
  const formFieldsData = summaryForm.getFieldsValue(true);
  const Remarks = formFieldsData.summremarks
  const arrayForMutation = []
    const arrayForLandedCost = []
    const metaLines = []
  let dynamicFormData = form.getFieldsValue(true)
    Object.entries(dynamicFormData).map((element)=>{ 
      appConfig.dyanamicFileds?.map((item)=>{
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
    let uomId = ''
    let productId1 = ''
    let orderQty1 = ''
    let unitPrice = ''
    let listPrice = ''
    let taxId = ''
    let description1 = ''
    let freeqty = ''
    let margin = ''
    let discountValue=''
    let discountType=''
    let totalDiscount=''
    let PLcTypeId=''
    let Value=''
    let MProductId =''
    let CsTaxId=''
    let grossStd
    let netStd
    let upc =''
    let marginStd = ''
    let salePrice=''
    let uniqueId = uuid()
            .replace(/-/g, '')
            .toUpperCase()
  for (let index2 = 0; index2 < otherCostData.length; index2++) {
    PLcTypeId = otherCostData[index2].pLcTypeId
    Value = otherCostData[index2].costPrice
    MProductId = otherCostData[index2].mProductId
    CsTaxId = otherCostData[index2].csTaxId
    arrayForLandedCost.push(
      `{
        pLcTypeId : "${PLcTypeId}",
        value :  ${Value},      
        productId : "${MProductId}",
        taxId : "${CsTaxId}"
      }`,
    )
  }
  for (let index = 0; index < poSummaryData.length; index++) {
  // batchNo = poSummaryData[index].batchNo;
  // expiry_date = poSummaryData[index].expiry_date === "Invalid date" ? null : poSummaryData[index].expiry_date;
  // mfg_date = poSummaryData[index].mfg_date === "Invalid date" ? null : poSummaryData[index].mfg_date;
  uomId = poSummaryData[index].uomId
  grossStd = poSummaryData[index].grossStd
  netStd = poSummaryData[index].netStd
  productId1 = poSummaryData[index].productId
  orderQty1 = poSummaryData[index].orderQty
  // unitPrice = poSummaryData[index].priceStd
  unitPrice = appConfig.basePriceCalc === "Purchase Price" ?(istaxincludedFlag === 'Y' ? poSummaryData[index].priceStd : poSummaryData[index].netUnitPrice) :(istaxincludedFlag === 'Y' ? poSummaryData[index].priceStd : poSummaryData[index].netUnitPrice)
  listPrice = poSummaryData[index].priceList
  taxId = poSummaryData[index].taxId
  upc = poSummaryData[index].upc
  salePrice = poSummaryData[index].salePrice
  marginStd=poSummaryData[index].oldMargin === "-Infinity" || poSummaryData[index].oldMargin === "Infinity" ? 0 : poSummaryData[index].oldMargin
  description1 =
  poSummaryData[index].description === null ||
  poSummaryData[index].description === undefined
      ? null
      : poSummaryData[index].description
  freeqty = poSummaryData[index].freeqty === undefined ? 0 : poSummaryData[index].freeqty === null ? 0: poSummaryData[index].freeqty === "" ? 0 : poSummaryData[index].freeqty
  margin = poSummaryData[index].margin === "-Infinity" || poSummaryData[index].margin === "Infinity" ? 0 : poSummaryData[index].margin
  discountValue = poSummaryData[index].discount === null || poSummaryData[index].discount === undefined ? 0 : poSummaryData[index].discount    
  discountType = poSummaryData[index].discountType === "Total value Discount" ? 'TV' : poSummaryData[index].discountType === "Percentage" ? 'P' :poSummaryData[index].discountType === "Value" ? 'V':null
  totalDiscount = poSummaryData[index].totalDiscount
  arrayForMutation.push(
    `{
        productId : "${productId1}",
        uomId : "${uomId}",
        orderQty : ${orderQty1},
        unitPrice : ${unitPrice},                                      
        listPrice : ${listPrice},
        taxId : ${taxId === null || taxId === undefined ||taxId === "" ? null :`"${taxId}"`},
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
        salePrice:${salePrice},
        upc:${upc === undefined || upc === null || upc === "" ? null :`"${upc}"`},
        metaData:[${metaLines}]
    }`,
  )
}
const createPoOrder = {
  query: `mutation {
    createPO(order : {
            orderId : ${selectedOrderId === "" ? `"${uniueOrderId}"`:`"${selectedOrderId}"`},
            bunitId : "${bunitId}",
            bunitLocationId : "${regionName}",
            supplierId : "${supplierId}",
            dateOrdered : "${currentDate}",
            datePromised : "${scheduledDate}",
            isTaxIncluded : "${istaxincludedFlag}",
            pricelistId : "${priceListId}",
            description : ${Remarks === undefined || null ? null : `"${Remarks}"`},
            deliveryNote : "Check Quantity & Price",
            supplierAddressId : "${supplierAddressId}",
            lines : [${arrayForMutation}]
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
}
Axios({
  url: serverUrl,
  method: 'POST',
  data: createPoOrder,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `bearer ${authHeaders.access_token}`,
  },
}).then(response => {
  if (response.data.data !== null) {
    const Status = response.data.data.createPO.type
    const messageForSuccess = response.data.data.createPO.message
    if (Status === 'Success') {
      setPoSummaryVisible(false)
      const recordId = response.data.data.createPO.extraParam  
      form.resetFields();
      setFieldVisible(true)
      summaryForm.resetFields([
      "summbusinessunit",
      "summsupplier",
      "summsupplierAddress",
      "summdeliveryAddress",
      ]);
      headerform.resetFields([
        "supplier",
        "Po", ]);
      setBusinessUnitName('')
      setSupplierName('')
      setSupplierAddressName('')
      setDeliveryLocationName('')
      setLoading(false)
      setSelectedOrderId("")
      SetUniueOrderId(uniqueId)
      setProductData([])
      if(appConfig.printPDF === "Y"){
        getPrintCofirmation(recordId,messageForSuccess)
      }else{
        Modal.confirm({
          title: `${messageForSuccess}`,
          // content: 'Do you want take Printout',
          okText: 'Yes',
          icon:null,
          
          // okType: 'danger',
          cancelText: 'No',
          onCancel() {
            setPoSummaryVisible(false)
          },
        });
      }
    }else{
      message.error(messageForSuccess)
      setLoading(false)
    }
  }else{
    message.error(response.data.errors[0].message)
    setLoading(false)
  }
})
}
}
// Import //

const getImportModal = () =>{
  setImportModalVisible(true)
}

const importModalClose = () =>{
  setImportModalVisible(false)
  importform.resetFields()
  document.getElementById('choosefile').value = null
}

const onSelectDiscountType = (e) =>{
  setImportDiscountType(e)
}
//Import End //

const createPoCancel = () =>{
  setPoSummaryVisible(false)
}
const disabledPreviousDate = current =>{
  return current && current < moment().startOf('day');
}

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
      var dataArr = []
        for (var i = 1; i < rows.length - 1; i++) {
          var cells = rows[i].split(',')
          if (cells.length === 7) {
            dataArr.push({
              sku: cells[0],
              PPrice: cells[1],
              SPrice: cells[2],
              Mrp: cells[3],
              qty: cells[4],
              freeqty: cells[5],
              discount: cells[6],
            })
          }
        }
        let flag = true;
        for (let index = 0; index < dataArr.length; index++) {
          const element = parseInt(dataArr[index].discount);
          if(element > 0 && importDiscountType === undefined || importDiscountType === null || importDiscountType === '' ){
            flag = false
          }else{
            flag = true
          }
        }
        if(flag === false){
          message.error("Please Select discout type")
          document.getElementById('choosefile').value = null
        }else{
          if (dataArr.length > 0) {
            setLoading(true)
            const matchedArray = []
            const unmatchedArray = []
            for (let indexOne = 0; indexOne < dataArr.length; indexOne += 1) {
              let boolean = true
              for (let indexTwo = 0; indexTwo < productData.length; indexTwo += 1) {
                if (dataArr[indexOne].sku === productData[indexTwo].value) {
                  matchedArray.push(productData[indexTwo])
                  boolean = false
                }
              }
              if (boolean) {
                unmatchedArray.push(dataArr[indexOne].sku)
              }
            }
            const tempArray = []
            if(unmatchedArray.length > 0){
              const skuData = JSON.stringify(unmatchedArray)
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
                batchedProduct
                actualCostPrice
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
                  const actualCostPrice = getPurchaseData[index].actualCostPrice === null || getPurchaseData[index].actualCostPrice === undefined  ? 0 : parseFloat(getPurchaseData[index].actualCostPrice).toFixed(2)
                  getPurchaseData[index].priceStd = appConfig.basePriceCalc === "Purchase Price" ? getPurchaseData[index].priceStd: actualCostPrice,
                  getPurchaseData[index].unitPrice= appConfig.basePriceCalc === "Purchase Price" ? getPurchaseData[index].priceStd: actualCostPrice,
                  getPurchaseData[index].netUnitPrice= appConfig.basePriceCalc === "Purchase Price" ? getPurchaseData[index].priceStd:actualCostPrice,
                  getPurchaseData[index].unitPrice1= appConfig.basePriceCalc === "Purchase Price" ? getPurchaseData[index].priceStd:actualCostPrice,
                  getPurchaseData[index].priceStd1= appConfig.basePriceCalc === "Purchase Price" ? getPurchaseData[index].priceStd:actualCostPrice,
                  getPurchaseData[index].priceStd2= appConfig.basePriceCalc === "Purchase Price" ? getPurchaseData[index].priceStd:actualCostPrice
                }
                const array3 = [...getPurchaseData, ...matchedArray]
                for (let index8 = 0; index8 < array3.length; index8 += 1) {
                  const obj = {
                    productCategoryName:
                    array3[index8].productcategoryName || array3[index8].productCategoryName,
                    name: array3[index8].productName || array3[index8].name,
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
                    responseMargin:array3[index8].margin,
                    unitPrice: array3[index8].priceStd,
                    netUnitPrice: array3[index8].priceStd,
                    unitPrice1: array3[index8].priceStd,
                    priceList1: array3[index8].priceList,
                    priceStd1: array3[index8].priceStd,
                    priceStd2: array3[index8].priceStd,
                    oldMargin : array3[index8].priceList === undefined || array3[index8].priceList === null || array3[index8].priceList === 0 || array3[index8].priceList === "0"? 0 :(((array3[index8].priceList - array3[index8].priceStd) / array3[index8].priceList) * 100).toFixed(2),
                    upc :array3[index8].upc,
                    taxName:array3[index8].taxName,
                    taxRate:array3[index8].taxRate,
                    istaxincluded:array3[index8].istaxincluded || array3[index8].isTaxIncluded, 
                    salePrice:array3[index8].salePrice,
                    restrictMargin :array3[index8].restrictMargin,
                    batchedProduct: array3[index8].batchedProduct,
                  }
                  tempArray.push(obj)
                }
                message.success(`${tempArray.length} products imported ...`)
                for (
                  let tempArrayindex = 0;
                  tempArrayindex < tempArray.length;
                  tempArrayindex += 1
                ) {
                  const skus =
                    tempArray[tempArrayindex].productCode || tempArray[tempArrayindex].value
                  for (let index11 = 0; index11 < dataArr.length; index11 += 1) {
                    if (dataArr[index11].sku === skus) {
                      tempArray[tempArrayindex].orderQty = dataArr[index11].qty
                      tempArray[tempArrayindex].freeqty = dataArr[index11].freeqty === null || dataArr[index11].freeqty === undefined || dataArr[index11].freeqty === "" || dataArr[index11].freeqty === "\r" ? null : dataArr[index11].freeqty
                      tempArray[tempArrayindex].discount = dataArr[index11].discount === null || dataArr[index11].discount === undefined || dataArr[index11].discount === "" || dataArr[index11].discount === "\r" ? 0 : dataArr[index11].discount
                      tempArray[tempArrayindex].priceList = dataArr[index11].Mrp === null || dataArr[index11].Mrp === undefined || dataArr[index11].Mrp === "" || dataArr[index11].Mrp === "\r" ? tempArray[tempArrayindex].priceList : dataArr[index11].Mrp
                      tempArray[tempArrayindex].unitPrice = dataArr[index11].PPrice === null || dataArr[index11].PPrice === undefined || dataArr[index11].PPrice === "" || dataArr[index11].PPrice === "\r" ? tempArray[tempArrayindex].unitPrice : dataArr[index11].PPrice
                      tempArray[tempArrayindex].netUnitPrice = dataArr[index11].PPrice === null || dataArr[index11].PPrice === undefined || dataArr[index11].PPrice === "" || dataArr[index11].PPrice === "\r" ? tempArray[tempArrayindex].netUnitPrice : dataArr[index11].PPrice
                      tempArray[tempArrayindex].unitPrice1 = dataArr[index11].PPrice === null || dataArr[index11].PPrice === undefined || dataArr[index11].PPrice === "" || dataArr[index11].PPrice === "\r" ? tempArray[tempArrayindex].unitPrice1 : dataArr[index11].PPrice
                      tempArray[tempArrayindex].priceList1 = dataArr[index11].Mrp === null || dataArr[index11].Mrp === undefined || dataArr[index11].Mrp === "" || dataArr[index11].Mrp === "\r" ? tempArray[tempArrayindex].priceList1 : dataArr[index11].Mrp
                      tempArray[tempArrayindex].priceStd1 = dataArr[index11].PPrice === null || dataArr[index11].PPrice === undefined || dataArr[index11].PPrice === "" || dataArr[index11].PPrice === "\r" ? tempArray[tempArrayindex].priceStd1 : dataArr[index11].PPrice
                      tempArray[tempArrayindex].priceStd2 = dataArr[index11].PPrice === null || dataArr[index11].PPrice === undefined || dataArr[index11].PPrice === "" || dataArr[index11].PPrice === "\r" ? tempArray[tempArrayindex].priceStd2 : dataArr[index11].PPrice
                      tempArray[tempArrayindex].salePrice = dataArr[index11].SPrice === null || dataArr[index11].SPrice === undefined || dataArr[index11].SPrice === "" || dataArr[index11].SPrice === "\r" ? tempArray[tempArrayindex].salePrice : dataArr[index11].SPrice
                      tempArray[tempArrayindex].priceStd = dataArr[index11].PPrice === null || dataArr[index11].PPrice === undefined || dataArr[index11].PPrice === "" || dataArr[index11].PPrice === "\r" ? tempArray[tempArrayindex].priceStd : dataArr[index11].PPrice
                    }
                  }
                }
                let finalunMatchedArray = []
                for (let index9 = 0; index9 < dataArr.length; index9 += 1) {
                  const element9 = dataArr[index9].sku
                  let boolean = true
                  for (let index10 = 0; index10 < tempArray.length; index10 += 1) {
                    const element10 = tempArray[index10].productCode || tempArray[index10].value
                    if (element9 === element10) {
                      boolean = false
                    }
                  }
                  if (boolean) {
                    finalunMatchedArray.push(dataArr[index9].sku)
                  }
                }
                if (finalunMatchedArray.length > 0) {
                  setTimeout(() => {
                    Modal.error({
                      title: 'Products not found !',
                      content: `${finalunMatchedArray}`,
                      closable: true,
                      footer: null,
                      icon:null,
                    })
                  }, 2000)
                }
              })
            }else{
              let allMatchedFinalTempArray = []
              for (let index12 = 0; index12 < matchedArray.length; index12 += 1) {
                const obj = {
                  productCategoryName:
                  matchedArray[index12].productcategoryName ||
                  matchedArray[index12].productCategoryName,
                  name: matchedArray[index12].productName || matchedArray[index12].name,
                  description: matchedArray[index12].description,
                  twoWeekSale: matchedArray[index12].twoWeekSale,
                  qtyOnHand: matchedArray[index12].qtyOnHand,
                  productId: matchedArray[index12].productId,
                  uomName: matchedArray[index12].uomName,
                  uomId: matchedArray[index12].uomId,
                  priceList: matchedArray[index12].priceList,
                  priceStd: matchedArray[index12].priceStd,
                  taxId: matchedArray[index12].taxId,
                  value: matchedArray[index12].productCode || matchedArray[index12].value,
                  responseMargin:matchedArray[index12].margin,
                  unitPrice: matchedArray[index12].priceStd,
                  netUnitPrice: matchedArray[index12].priceStd,
                  unitPrice1: matchedArray[index12].priceStd,
                  priceList1: matchedArray[index12].priceList,
                  priceStd1: matchedArray[index12].priceStd,
                  priceStd2: matchedArray[index12].priceStd,
                  oldMargin : matchedArray[index12].priceList === undefined || matchedArray[index12].priceList === null || matchedArray[index12].priceList === 0 || matchedArray[index12].priceList === "0"? 0:(((matchedArray[index12].priceList - matchedArray[index12].priceStd) / matchedArray[index12].priceList) * 100).toFixed(2),
                  upc :matchedArray[index12].upc,
                  taxName:matchedArray[index12].taxName,
                  taxRate:matchedArray[index12].taxRate,
                  salePrice:matchedArray[index12].salePrice,
                  restrictMargin :matchedArray[index12].restrictMargin,
                  istaxincluded:matchedArray[index12].istaxincluded || matchedArray[index12].isTaxIncluded, 
                }
                allMatchedFinalTempArray.push(obj)
              }

              for (
                let tempArrayindex2 = 0;
                tempArrayindex2 < allMatchedFinalTempArray.length;
                tempArrayindex2 += 1
              ) {
                const skus =
                  allMatchedFinalTempArray[tempArrayindex2].productCode ||
                  allMatchedFinalTempArray[tempArrayindex2].value
                for (let index14 = 0; index14 < dataArr.length; index14 += 1) {
                  if (dataArr[index14].sku === skus) {
                    allMatchedFinalTempArray[tempArrayindex2].orderQty = dataArr[index14].qty
                    allMatchedFinalTempArray[tempArrayindex2].freeqty = dataArr[index14].freeqty === null || dataArr[index14].freeqty === undefined || dataArr[index14].freeqty === "" || dataArr[index14].freeqty === "\r" ? null : dataArr[index14].freeqty
                    allMatchedFinalTempArray[tempArrayindex2].discount = dataArr[index14].discount === null || dataArr[index14].discount === undefined || dataArr[index14].discount === "" || dataArr[index14].discount === "\r" ? 0 : dataArr[index14].discount
                    allMatchedFinalTempArray[tempArrayindex2].priceList = dataArr[index14].Mrp === null || dataArr[index14].Mrp === undefined || dataArr[index14].Mrp === "" || dataArr[index14].Mrp === "\r" ? allMatchedFinalTempArray[tempArrayindex2].priceList : dataArr[index14].Mrp
                    allMatchedFinalTempArray[tempArrayindex2].unitPrice = dataArr[index14].PPrice === null || dataArr[index14].PPrice === undefined || dataArr[index14].PPrice === "" || dataArr[index14].PPrice === "\r" ? allMatchedFinalTempArray[tempArrayindex2].unitPrice : dataArr[index14].PPrice
                    allMatchedFinalTempArray[tempArrayindex2].netUnitPrice = dataArr[index14].PPrice === null || dataArr[index14].PPrice === undefined || dataArr[index14].PPrice === "" || dataArr[index14].PPrice === "\r" ? allMatchedFinalTempArray[tempArrayindex2].netUnitPrice : dataArr[index14].PPrice
                    allMatchedFinalTempArray[tempArrayindex2].unitPrice1 = dataArr[index14].PPrice === null || dataArr[index14].PPrice === undefined || dataArr[index14].PPrice === "" || dataArr[index14].PPrice === "\r" ? allMatchedFinalTempArray[tempArrayindex2].unitPrice1 : dataArr[index14].PPrice
                    allMatchedFinalTempArray[tempArrayindex2].priceList1 = dataArr[index14].Mrp === null || dataArr[index14].Mrp === undefined || dataArr[index14].Mrp === "" || dataArr[index14].Mrp === "\r" ? allMatchedFinalTempArray[tempArrayindex2].priceList1 : dataArr[index14].Mrp
                    allMatchedFinalTempArray[tempArrayindex2].priceStd1 = dataArr[index14].PPrice === null || dataArr[index14].PPrice === undefined || dataArr[index14].PPrice === "" || dataArr[index14].PPrice === "\r" ? allMatchedFinalTempArray[tempArrayindex2].priceStd1 : dataArr[index14].PPrice
                    allMatchedFinalTempArray[tempArrayindex2].priceStd2 = dataArr[index14].PPrice === null || dataArr[index14].PPrice === undefined || dataArr[index14].PPrice === "" || dataArr[index14].PPrice === "\r" ? allMatchedFinalTempArray[tempArrayindex2].priceStd2 : dataArr[index14].PPrice
                    allMatchedFinalTempArray[tempArrayindex2].salePrice = dataArr[index14].SPrice === null || dataArr[index14].SPrice === undefined || dataArr[index14].SPrice === "" || dataArr[index14].SPrice === "\r" ? allMatchedFinalTempArray[tempArrayindex2].salePrice : dataArr[index14].SPrice
                    allMatchedFinalTempArray[tempArrayindex2].priceStd = dataArr[index14].PPrice === null || dataArr[index14].PPrice === undefined || dataArr[index14].PPrice === "" || dataArr[index14].PPrice === "\r" ? allMatchedFinalTempArray[tempArrayindex2].priceStd : dataArr[index14].PPrice
                    tempArray.push(allMatchedFinalTempArray[tempArrayindex2])
                  }
                }
              }
              message.success(`${allMatchedFinalTempArray.length} products imported ...`)
            }
            setTimeout(() => {
              getDiscountCalculation(tempArray)
            }, 3000);
          }else{
          message.error('Please import the file in required format.')
          document.getElementById('choosefile').value = null
          }
        }
    };
    reader.readAsText(file);
  }
}
}

const getDiscountCalculation = (tempArray) =>{
  const multipleProductData = tempArray
  const newArray=[] 
  if((istaxincludedFlag === 'Y') && (appConfig.basePriceCalc === "Purchase Price")){
    if(importDiscountType === undefined || importDiscountType === null){
      for (let index = 0; index < multipleProductData.length; index++) {
        const orQty = multipleProductData[index].orderQty
        const discount = multipleProductData[index].discount
        const taxRate = multipleProductData[index].taxRate
        const basePrice = multipleProductData[index].priceStd1
        const MRP = multipleProductData[index].priceList
        const d3 = discount/orQty
        let price;
        const d4 = isNaN(d3)
            if(d4 === true){
              price= 0
            }else{
              price = d3
            }
        const netUnitPrice1 = ((basePrice/(1+taxRate/100)) - price)
        const taxOnUnitPrice = ((taxRate/ 100) * netUnitPrice1)
        const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
        const gridGrossAmt1 =( unitPrice1 * orQty)
        const margin1 = MRP === undefined || MRP === null || MRP === 0 ? 0:(((MRP - unitPrice1) / MRP) * 100)
        const basePriceAfterTax = (basePrice/(1+taxRate/100))
        const totalDiscount1 = ((basePriceAfterTax * orQty) - (netUnitPrice1 * orQty))
        const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

        const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
        const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
        const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
        const margin = (Math.round(margin1 * 100) / 100).toFixed(2)
        const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
        const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
        multipleProductData[index].totalTax = totalTax
        multipleProductData[index].grossAmount = gridGrossAmt
        multipleProductData[index].discount = discount
        multipleProductData[index].margin = margin
        multipleProductData[index].discountType = null
        multipleProductData[index].netUnitPrice = netUnitPrice
        multipleProductData[index].priceStd = unitPrice
        multipleProductData[index].totalDiscount=totalDiscount
        newArray.push(multipleProductData[index])
      }
    }
    else if(importDiscountType === 'Total value Discount'){
      for (let index = 0; index < multipleProductData.length; index++) {
        const orQty = multipleProductData[index].orderQty
        const discount = multipleProductData[index].discount
        const taxRate = multipleProductData[index].taxRate
        const basePrice = multipleProductData[index].priceStd1
        const MRP = multipleProductData[index].priceList
        const d3 = discount/orQty
        let price;
        const d4 = isNaN(d3)
            if(d4 === true){
              price= 0
            }else{
              price = d3
            }
        const netUnitPrice1 = ((basePrice/(1+taxRate/100)) - price)
        const taxOnUnitPrice = ((taxRate/ 100) * netUnitPrice1)
        const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
        const gridGrossAmt1 =( unitPrice1 * orQty)
        const margin1 = MRP === undefined || MRP === null || MRP === 0 ? 0:(((MRP - unitPrice1) / MRP) * 100)
        const basePriceAfterTax = (basePrice/(1+taxRate/100))
        const totalDiscount1 = ((basePriceAfterTax * orQty) - (netUnitPrice1 * orQty))
        const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

        const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
        const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
        const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
        const margin = (Math.round(margin1 * 100) / 100).toFixed(2)
        const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
        const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)
        multipleProductData[index].totalTax = totalTax
        multipleProductData[index].grossAmount = gridGrossAmt
        multipleProductData[index].discount = discount
        multipleProductData[index].margin = margin
        multipleProductData[index].discountType = importDiscountType
        multipleProductData[index].netUnitPrice = netUnitPrice
        multipleProductData[index].priceStd = unitPrice
        multipleProductData[index].totalDiscount=totalDiscount
        newArray.push(multipleProductData[index])
      }
    }else if(importDiscountType === 'Percentage'){
      for (let index = 0; index < multipleProductData.length; index++) {
        const orQty = multipleProductData[index].orderQty
        const discount = multipleProductData[index].discount
        const taxRate = multipleProductData[index].taxRate
        const basePrice = multipleProductData[index].priceStd1
        const MRP = multipleProductData[index].priceList
        
        const costPrice3 = (basePrice/(1+(taxRate/100)))
        const discountAmount = ((discount / 100) * costPrice3)

        const netUnitPrice1 = ((basePrice/(1+taxRate/100)) - discountAmount)
        const taxOnUnitPrice = ((taxRate/ 100) * netUnitPrice1)
        const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
        const gridGrossAmt1 = (unitPrice1 * orQty)
        const margin1 = MRP === undefined || MRP === null || MRP === 0 ? 0:(((MRP - unitPrice1) / MRP) * 100)
        const basePriceAfterTax = (basePrice/(1+taxRate/100))
        const totalDiscount1 = ((basePriceAfterTax * orQty) - (netUnitPrice1 * orQty))
        const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

        const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
        const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
        const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
        const margin = (Math.round(margin1 * 100) / 100).toFixed(2)
        const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
        const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)

        multipleProductData[index].totalTax = totalTax
        multipleProductData[index].grossAmount = gridGrossAmt
        multipleProductData[index].discount = discount
        multipleProductData[index].margin = margin
        multipleProductData[index].discountType = importDiscountType
        multipleProductData[index].netUnitPrice = netUnitPrice
        multipleProductData[index].priceStd = unitPrice
        multipleProductData[index].totalDiscount = totalDiscount
        newArray.push(multipleProductData[index])
      }

    }else if(importDiscountType ==='Value'){
      for (let index = 0; index < multipleProductData.length; index++) {
        const orQty = multipleProductData[index].orderQty
        const discount = multipleProductData[index].discount
        const taxRate = multipleProductData[index].taxRate
        const basePrice = multipleProductData[index].priceStd1
        const MRP = multipleProductData[index].priceList

        const netUnitPrice1 = ((basePrice/(1+taxRate/100)) - discount)
        const taxOnUnitPrice = ((taxRate/ 100) * netUnitPrice1)
        const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
        const gridGrossAmt1 = (unitPrice1 * orQty)
        const margin1 = MRP === undefined || MRP === null || MRP === 0 ? 0:(((MRP - unitPrice1) / MRP) * 100)
        const basePriceAfterTax = (basePrice/(1+taxRate/100))
        const totalDiscount1 = ((basePriceAfterTax * orQty) - (netUnitPrice1 * orQty))
        const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

        const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
        const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
        const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
        const margin = (Math.round(margin1 * 100) / 100).toFixed(2)
        const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
        const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)

        multipleProductData[index].totalTax = totalTax
        multipleProductData[index].grossAmount = gridGrossAmt
        multipleProductData[index].discount = discount
        multipleProductData[index].margin = margin
        multipleProductData[index].discountType = importDiscountType
        multipleProductData[index].netUnitPrice = netUnitPrice
        multipleProductData[index].priceStd = unitPrice
        multipleProductData[index].totalDiscount = totalDiscount
        newArray.push(multipleProductData[index])
      }
    }
  }else if ((istaxincludedFlag === 'N') && (appConfig.basePriceCalc === "Purchase Price")){
    if(importDiscountType === undefined){
      for (let index = 0; index < multipleProductData.length; index++) {
        const orQty = multipleProductData[index].orderQty
        const discount = multipleProductData[index].discount
        const taxRate = multipleProductData[index].taxRate
        const basePrice = multipleProductData[index].priceStd1
        const MRP = multipleProductData[index].priceList
        const d3 = discount/orQty
        let price;
        const d4 = isNaN(d3)
            if(d4 === true){
              price= 0
            }else{
              price = d3
            }
        const netUnitPrice1 = (basePrice - price)
        const taxOnUnitPrice = ((taxRate/ 100) * netUnitPrice1)
        const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
        const gridGrossAmt1 = (unitPrice1 * orQty)
        const margin1 = MRP === undefined || MRP === null || MRP === 0 ? 0:(((MRP - unitPrice1) / MRP) * 100)
        const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
        const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

        const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
        const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
        const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
        const margin = (Math.round(margin1 * 100) / 100).toFixed(2)
        const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
        const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)

        multipleProductData[index].totalTax = totalTax
        multipleProductData[index].grossAmount = gridGrossAmt
        multipleProductData[index].discount = discount
        multipleProductData[index].margin = margin
        multipleProductData[index].discountType = importDiscountType
        multipleProductData[index].netUnitPrice = netUnitPrice
        multipleProductData[index].priceStd = unitPrice
        multipleProductData[index].totalDiscount = totalDiscount
        newArray.push(multipleProductData[index])
      }
    }
    else if(importDiscountType === 'Total value Discount'){
      for (let index = 0; index < multipleProductData.length; index++) {
        const orQty = multipleProductData[index].orderQty
        const discount = multipleProductData[index].discount
        const taxRate = multipleProductData[index].taxRate
        const basePrice = multipleProductData[index].priceStd1
        const MRP = multipleProductData[index].priceList
        const d3 = discount/orQty
        let price;
        const d4 = isNaN(d3)
            if(d4 === true){
              price= 0
            }else{
              price = d3
            }
        const netUnitPrice1 = (basePrice - price)
        const taxOnUnitPrice = ((taxRate/ 100) * netUnitPrice1)
        const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
        const gridGrossAmt1 = (unitPrice1 * orQty)
        const margin1 = MRP === undefined || MRP === null || MRP === 0 ? 0:(((MRP - unitPrice1) / MRP) * 100)
        const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
        const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

        const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
        const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
        const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
        const margin = (Math.round(margin1 * 100) / 100).toFixed(2)
        const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
        const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)

        multipleProductData[index].totalTax = totalTax
        multipleProductData[index].grossAmount = gridGrossAmt
        multipleProductData[index].discount = discount
        multipleProductData[index].margin = margin
        multipleProductData[index].discountType = importDiscountType
        multipleProductData[index].netUnitPrice = netUnitPrice
        multipleProductData[index].priceStd = unitPrice
        multipleProductData[index].totalDiscount = totalDiscount
        newArray.push(multipleProductData[index])
      }
    }else if(importDiscountType === 'Percentage') {
      for (let index = 0; index < multipleProductData.length; index++) {
        const orQty = multipleProductData[index].orderQty
        const discount = multipleProductData[index].discount
        const taxRate = multipleProductData[index].taxRate
        const basePrice = multipleProductData[index].priceStd1
        const MRP = multipleProductData[index].priceList
        
        const discountAmount = ((discount / 100) * basePrice)

        const netUnitPrice1 = (basePrice - discountAmount)
        const taxOnUnitPrice = ((taxRate/ 100) * netUnitPrice1)
        const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
        const gridGrossAmt1 = (unitPrice1 * orQty)
        const margin1 = MRP === undefined || MRP === null || MRP === 0 ? 0:(((MRP - unitPrice1) / MRP) * 100)
        const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
        const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

        const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
        const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
        const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
        const margin = (Math.round(margin1 * 100) / 100).toFixed(2)
        const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
        const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)

        multipleProductData[index].totalTax = totalTax
        multipleProductData[index].grossAmount = gridGrossAmt
        multipleProductData[index].discount = discount
        multipleProductData[index].margin = margin
        multipleProductData[index].discountType = importDiscountType
        multipleProductData[index].netUnitPrice = netUnitPrice
        multipleProductData[index].priceStd = unitPrice
        multipleProductData[index].totalDiscount = totalDiscount
        newArray.push(multipleProductData[index])
      }
    }else if(importDiscountType ==='Value'){
      for (let index = 0; index < multipleProductData.length; index++) {
        const orQty = multipleProductData[index].orderQty
        const discount = multipleProductData[index].discount
        const taxRate = multipleProductData[index].taxRate
        const basePrice = multipleProductData[index].priceStd1
        const MRP = multipleProductData[index].priceList
        
        const netUnitPrice1 = (basePrice - discount)
        const taxOnUnitPrice = ((taxRate/ 100) * netUnitPrice1)
        const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
        const gridGrossAmt1 = (unitPrice1 * orQty)
        const margin1 = MRP === undefined || MRP === null || MRP === 0 ? 0:(((MRP - unitPrice1) / MRP) * 100)
        const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
        const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

        const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
        const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
        const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
        const margin = (Math.round(margin1 * 100) / 100).toFixed(2)
        const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
        const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)

        multipleProductData[index].totalTax = totalTax
        multipleProductData[index].grossAmount = gridGrossAmt
        multipleProductData[index].discount = discount
        multipleProductData[index].margin = margin
        multipleProductData[index].discountType = importDiscountType
        multipleProductData[index].netUnitPrice = netUnitPrice
        multipleProductData[index].priceStd = unitPrice
        multipleProductData[index].totalDiscount = totalDiscount
        newArray.push(multipleProductData[index])
      }
    }
  }else{
    if(importDiscountType === undefined){
      for (let index = 0; index < multipleProductData.length; index++) {
        const orQty = multipleProductData[index].orderQty
        const discount = multipleProductData[index].discount
        const taxRate = multipleProductData[index].taxRate
        const basePrice = multipleProductData[index].priceStd1
        const MRP = multipleProductData[index].priceList
        const d3 = discount/orQty
        let price;
        const d4 = isNaN(d3)
            if(d4 === true){
              price= 0
            }else{
              price = d3
            }
        const netUnitPrice1 = (basePrice - price)
        const taxOnUnitPrice = ((taxRate/ 100) * netUnitPrice1)
        const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
        const gridGrossAmt1 = (unitPrice1 * orQty)
        const margin1 = MRP === undefined || MRP === null || MRP === 0 ? 0:(((MRP - unitPrice1) / MRP) * 100)
        const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
        const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

        const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
        const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
        const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
        const margin = (Math.round(margin1 * 100) / 100).toFixed(2)
        const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
        const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)

        multipleProductData[index].totalTax = totalTax
        multipleProductData[index].grossAmount = gridGrossAmt
        multipleProductData[index].discount = discount
        multipleProductData[index].margin = margin
        multipleProductData[index].discountType = importDiscountType
        multipleProductData[index].netUnitPrice = netUnitPrice
        multipleProductData[index].priceStd = unitPrice
        multipleProductData[index].totalDiscount = totalDiscount
        newArray.push(multipleProductData[index])
      }
    }
    else if(importDiscountType === 'Total value Discount'){
      for (let index = 0; index < multipleProductData.length; index++) {
        const orQty = multipleProductData[index].orderQty
        const discount = multipleProductData[index].discount
        const taxRate = multipleProductData[index].taxRate
        const basePrice = multipleProductData[index].priceStd1
        const MRP = multipleProductData[index].priceList
        const d3 = discount/orQty
        let price;
        const d4 = isNaN(d3)
            if(d4 === true){
              price= 0
            }else{
              price = d3
            }
        const netUnitPrice1 = (basePrice - price)
        const taxOnUnitPrice = ((taxRate/ 100) * netUnitPrice1)
        const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
        const gridGrossAmt1 = (unitPrice1 * orQty)
        const margin1 = MRP === undefined || MRP === null || MRP === 0 ? 0:(((MRP - unitPrice1) / MRP) * 100)
        const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
        const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

        const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
        const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
        const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
        const margin = (Math.round(margin1 * 100) / 100).toFixed(2)
        const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
        const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)

        multipleProductData[index].totalTax = totalTax
        multipleProductData[index].grossAmount = gridGrossAmt
        multipleProductData[index].discount = discount
        multipleProductData[index].margin = margin
        multipleProductData[index].discountType = importDiscountType
        multipleProductData[index].netUnitPrice = netUnitPrice
        multipleProductData[index].priceStd = unitPrice
        multipleProductData[index].totalDiscount = totalDiscount
        newArray.push(multipleProductData[index])
      }
    }else if(importDiscountType === 'Percentage') {
      for (let index = 0; index < multipleProductData.length; index++) {
        const orQty = multipleProductData[index].orderQty
        const discount = multipleProductData[index].discount
        const taxRate = multipleProductData[index].taxRate
        const basePrice = multipleProductData[index].priceStd1
        const MRP = multipleProductData[index].priceList
        
        const discountAmount = ((discount / 100) * basePrice)

        const netUnitPrice1 = (basePrice - discountAmount)
        const taxOnUnitPrice = ((taxRate/ 100) * netUnitPrice1)
        const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
        const gridGrossAmt1 = (unitPrice1 * orQty)
        const margin1 = MRP === undefined || MRP === null || MRP === 0 ? 0:(((MRP - unitPrice1) / MRP) * 100)
        const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
        const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

        const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
        const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
        const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
        const margin = (Math.round(margin1 * 100) / 100).toFixed(2)
        const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
        const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)

        multipleProductData[index].totalTax = totalTax
        multipleProductData[index].grossAmount = gridGrossAmt
        multipleProductData[index].discount = discount
        multipleProductData[index].margin = margin
        multipleProductData[index].discountType = importDiscountType
        multipleProductData[index].netUnitPrice = netUnitPrice
        multipleProductData[index].priceStd = unitPrice
        multipleProductData[index].totalDiscount = totalDiscount
        newArray.push(multipleProductData[index])
      }
    }else if(importDiscountType ==='Value'){
      for (let index = 0; index < multipleProductData.length; index++) {
        const orQty = multipleProductData[index].orderQty
        const discount = multipleProductData[index].discount
        const taxRate = multipleProductData[index].taxRate
        const basePrice = multipleProductData[index].priceStd1
        const MRP = multipleProductData[index].priceList
        
        const netUnitPrice1 = (basePrice - discount)
        const taxOnUnitPrice = ((taxRate/ 100) * netUnitPrice1)
        const unitPrice1 = (parseFloat(netUnitPrice1) + parseFloat(taxOnUnitPrice))
        const gridGrossAmt1 = (unitPrice1 * orQty)
        const margin1 = MRP === undefined || MRP === null || MRP === 0 ? 0:(((MRP - unitPrice1) / MRP) * 100)
        const totalDiscount1 = ((basePrice * orQty) - (netUnitPrice1 * orQty))
        const totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * orQty))

        const netUnitPrice = (Math.round(netUnitPrice1 * 100) / 100).toFixed(2)
        const unitPrice = (Math.round(unitPrice1 * 100) / 100).toFixed(2)
        const gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
        const margin = (Math.round(margin1 * 100) / 100).toFixed(2)
        const totalTax = (Math.round(totalTax1 * 100) / 100).toFixed(2)
        const totalDiscount = (Math.round(totalDiscount1 * 100) / 100).toFixed(2)

        multipleProductData[index].totalTax = totalTax
        multipleProductData[index].grossAmount = gridGrossAmt
        multipleProductData[index].discount = discount
        multipleProductData[index].margin = margin
        multipleProductData[index].discountType = importDiscountType
        multipleProductData[index].netUnitPrice = netUnitPrice
        multipleProductData[index].priceStd = unitPrice
        multipleProductData[index].totalDiscount = totalDiscount
        newArray.push(multipleProductData[index])
      }
    }
  }
  let gridArray=[]
  for (let index = 0; index < productData.length; index++) {
    let temp=true
    const finalGridVal = productData[index].value;
    for (let index2 = 0; index2 < newArray.length; index2++) {
      const element = newArray[index2].value;
      if(finalGridVal === element){
        temp=false
        break;
      }
    }
    if(temp){
      gridArray.push(productData[index])
    }
  }
  const finalData = [...newArray,...gridArray]
  setProductData(finalData)
  setLoading(false)
  setImportModalVisible(false)
  setImportDiscountType('')
  importform.resetFields()
  document.getElementById('choosefile').value = null
}
const disabledDateChange = (date, dateString) => {
  setScheduledDate(dateString)
}

const changePrice = () =>{
  if(Object.keys(selectedProductObject).length > 0 ){
    setChangePriceDisabledFlag(false)
  }else{
    message.error("Select product to change price")
  }
}

const onSearchFunction = values => {
  setChangePriceDisabledFlag(true)
  // setSelectedProductObject({})
  form.resetFields([
    // 'skuValue',
    'productName',
    'productCategoryName',
    'uomName',
    'HSNCode',
    'UPC',
    'orderQty',
    'freeqty',
    'discountType',
    'discount',
    'BasePriceChange',
    'unitPrice',
    'netUnitPrice',
    'priceList',
    'taxName',
    'margin',
    'oldMargin',
    'grossAmount',
    'totalDiscount',
    'twoWeekSale',
    'qtyOnHand',
    'description',
    'salePrice',
    'batchNo',
    'mfg_date',
    'expiry_date',
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
      const actualCostPrice = getPurchaseData[index].actualCostPrice === null || getPurchaseData[index].actualCostPrice === undefined  ? 0 : parseFloat(getPurchaseData[index].actualCostPrice).toFixed(2)
      getPurchaseData[index].key = getPurchaseData[index].productId
      getPurchaseData[index].priceList1 = getPurchaseData[index].priceList
      getPurchaseData[index].priceStd = appConfig.basePriceCalc === "Purchase Price" ? getPurchaseData[index].priceStd: actualCostPrice,
      getPurchaseData[index].unitPrice= appConfig.basePriceCalc === "Purchase Price" ? getPurchaseData[index].priceStd: actualCostPrice,
      getPurchaseData[index].netUnitPrice= appConfig.basePriceCalc === "Purchase Price" ? getPurchaseData[index].priceStd:actualCostPrice,
      getPurchaseData[index].unitPrice1= appConfig.basePriceCalc === "Purchase Price" ? getPurchaseData[index].priceStd:actualCostPrice,
      getPurchaseData[index].priceStd1= appConfig.basePriceCalc === "Purchase Price" ? getPurchaseData[index].priceStd:actualCostPrice,
      getPurchaseData[index].priceStd2= appConfig.basePriceCalc === "Purchase Price" ? getPurchaseData[index].priceStd:actualCostPrice,
      getPurchaseData[index].skuValue = getPurchaseData[index].value
      getPurchaseData[index].skuName = getPurchaseData[index].value
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
  if(appConfig.sku === 'Y'){
    debounceLog(e)
  }
}

    const taxNameArray =[]
    let orderQuantityCount = 0
    let grossAmtCount = 0
    let orderQuantity = 0
    let summaryFreeQty = 0
    let freeQty = 0
    let totalOrderQty = 0
    let totalDiscountAmount = 0
    for (let index = 0; index < poSummaryData.length; index += 1) {
      orderQuantity = poSummaryData[index].orderQty
      summaryFreeQty = poSummaryData[index].freeqty === null || poSummaryData[index].freeqty === undefined || poSummaryData[index].freeqty === "" || poSummaryData[index].freeqty === "\r" ? 0 : poSummaryData[index].freeqty
      const integer = parseFloat(orderQuantity, 10)
      orderQuantityCount += integer
      const integer2 = parseFloat(summaryFreeQty, 10)
      freeQty += integer2
      const grossAmtWithFloat = poSummaryData[index].grossAmount
      const totalDis = poSummaryData[index].totalDiscount
      grossAmtCount += parseFloat(grossAmtWithFloat) 
      totalDiscountAmount += parseFloat(totalDis)
    }
    totalOrderQty = freeQty + orderQuantityCount
let result = poSummaryData.reduce((c, v) => {
  c[v.taxName] = (c[v.taxName] || 0) + parseFloat(v.totalTax);
  return c;
}, {});

Object.keys(result).map((key) => {
  const taxObj ={
    'taxName':key,
    'taxValue':result[key]
  }
  taxNameArray.push(taxObj)
  return taxObj
});

const summaryDiv =(
  <Card>
    <Form layout="vertical" form={summaryForm} name="summaryForm">
        <Row gutter={16}>
        <Col className="gutter-row" span={8}>
          <Form.Item name="summbusinessunit" label="Business Unit">
            <Input readOnly style={{borderLeft:'none',borderTop:'none',borderRight:'none'}}/>
          </Form.Item>
        </Col>
          <Col className="gutter-row" span={8}>
          <Form.Item name="summorderdate" label="Order Date">
            <Input readOnly style={{borderLeft:'none',borderTop:'none',borderRight:'none'}}/>
          </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
          <Form.Item name="summreceiptdate" label="Receipt Date">
            <DatePicker  style={{width:'100%'}} disabledDate={disabledPreviousDate} onChange={disabledDateChange} />
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
            <Input readOnly style={{borderLeft:'none',borderTop:'none',borderRight:'none'}}/>
          </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
          <Form.Item name="summsupplierAddress" label="Supplier Address">
            <Input readOnly style={{borderLeft:'none',borderTop:'none',borderRight:'none'}}/>
          </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
          <Form.Item name="summdeliveryAddress" label="Delivery Address">
            <Input readOnly style={{borderLeft:'none',borderTop:'none',borderRight:'none'}}/>
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
            <Input  style={{borderLeft:'none',borderTop:'none',borderRight:'none'}}/>
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
      <Col className="gutter-row" span={6}>
      <h4>Total Discount: {totalDiscountAmount}</h4>
      </Col>
      <Col className="gutter-row" span={6}>
      <h4>Total Quantity: {totalOrderQty}</h4>
      </Col>
      <Col className="gutter-row" span={6}>
      <h4>Total Amount: {grossAmtCount.toFixed(2)}</h4>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col className="gutter-row" span={6}>
        <Collapse
          bordered={false}
          defaultActiveKey={['2']}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          className="collapseClassStyle"
        >
          <Panel
            header="Delivery Notes"
            key="1"
            showArrow={false}
            className="collapseClassStyle"
          >
            <Input />
          </Panel>
        </Collapse>
      </Col>
      <Col className="gutter-row" span={6}>
        <Collapse
          bordered={false}
          defaultActiveKey={['1']}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          className="collapseClassStyle"
        >
          <Panel
            header="Terms & Conditions"
            key="2"
            showArrow={false}
            className="collapseClassStyle"
          >
            <Input />
          </Panel>
        </Collapse>
      </Col>
      <Col className="gutter-row" span={6}>
        <span style={{ float: 'right' }}>
          <table style={{border:'1px solid #dddddd'}}>
            <thead>
            <tr>
              <th style={{border:'1px solid #dddddd'}}>Landed Cost</th>
            </tr>
            </thead>
            <tbody>
            {otherCostData.map(data => (
              <tr>
                <td style={{border:'1px solid #dddddd'}}>
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
          <table style={{border:'1px solid #dddddd'}}>
          <thead>
            <tr>
              <th style={{border:'1px solid #dddddd'}}>Tax Breakup</th>
            </tr>
          </thead>
          <tbody>
            {taxNameArray.map(data => (
              <tr>
                <td style={{border:'1px solid #dddddd'}}>
                  <span>{data.taxName}</span> &nbsp;: {(data.taxValue).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </span>
      </Col>
    </Row>
  </Card>
)

    return (
      <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
        <div>
          <Row>
            <Col span={12}>
              <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>New Purchase Order</h2>
            </Col>
            <Col span={12}>
              <span style={{ float: "right" }}>
                <Button onClick={poReview} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }}>Review</Button>
              </span>
            </Col>
          </Row>
          <Card style={{ marginBottom: "8px" }}>
            <Form layout="vertical" form={headerform} name="control-hooks" onFinish={onFinish}>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="businessUnit" label="Business unit" style={{ marginBottom: "8px" }}>
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
                  <Form.Item name="supplier" label="Supplier" style={{ marginBottom: "8px" }}>
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
                  <Form.Item name="Po" label="PO" style={{ marginBottom: "8px" }}>
                    <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={onSelectDraftpo}
                      onFocus={getDraftpo}
                    >
                      {draftPoDocsData.map((data, index) => (
                        <Option key={data.orderId} value={data.orderId} title={data.docNo}>
                          {data.docNo}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="deliveryLocation" label="Delivery Location" style={{ marginBottom: "8px" }}>
                    <Select
                      allowClear
                      showSearch
                      filterOption={(input, Option) => Option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      // onSelect={onSelectDeliveryLocation}
                    >
                      {deliveryLocationList.map((data, index) => (
                        <Option key={data.bUnitLocationId} value={data.bUnitLocationId} title={data.fulladdress}>
                          {data.fulladdress}
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
              <Radio.Group
                style={{ marginTop: '4%' }}
                onChange={onChangeRadio}
                value={appConfig.sku === "Y" && appConfig.upc === "N" ? 2 :radioValue}
              >
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
            <Tabs defaultActiveKey={tabKey}  
            onChange={callbackTabs} 
            type="card" 
            tabBarStyle={{ marginBottom: "0px" }}
            tabBarExtraContent={
              <div>
                {appConfig.changePrice === "Y" ? 
                <Button size="small" onClick={changePrice}>
                Change Price
                </Button>:null}
                &nbsp;
                {appConfig.downloadTemplate === "Y" ? 
                <Tooltip placement="top" title={"Download Template"}>
                  <Button size="small" onClick={downloadImportTemplate}>
                    <DownloadOutlined />
                  </Button>
                </Tooltip>
                :null}
                &nbsp;
                {appConfig.importPO === "Y" ? 
                <Button size="small" onClick={getImportModal}>
                  Import
                </Button>
                :null}
              </div>
            }
            >
              <TabPane tab="Products" key="10">
                <Card style={{ marginBottom: "8px" }}>
                  <Form layout="vertical" form={form} name="editable-form" onFinish={onFinish}>
                    <Row gutter={16}>
                      <Col className="gutter-row" span={8}>
                        <Form.Item name="skuValue" label="SKU" style={{ marginBottom: "8px" }}>
                          <Select 
                          className="certain-category-search"
                          dropdownClassName="certain-category-search-dropdown"
                          dropdownMatchSelectWidth={false}
                          dropdownStyle={{ width: '10%' }}
                          showSearch
                          // disabled = {appConfig.sku === "N" ? true :false}
                          value={searchInput}
                          onSearch={searchDropdownRecords}
                          filterOption={(input, option) =>
                            option.props.children !== undefined
                              ? option.props.children
                                  .toString()
                                  .toLowerCase()
                                  .indexOf(input.toString().toLowerCase()) >= 0
                              : ''
                          }
                          onSelect={onselectedProduct}
                          // onSearch={searchDropdownRecords}
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
                      {/* <Col className="gutter-row" span={4}>
                        <Form.Item name="productName" label="Name" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col> */}
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="productCategoryName" label="Category" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="uomName" label="UOM" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="HSNCode" label="HSN Code" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col>
                      {appConfig.upc === "Y" ? <Col className="gutter-row" span={4}>
                        <Form.Item name="UPC" label="UPC" style={{ marginBottom: "8px" }}>
                          <Input onChange={OnChangeOrderQty} disabled={changePriceDisabledFlag} />
                        </Form.Item>
                      </Col> : ""}
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="orderQty" label="Order Qty" style={{ marginBottom: "8px" }}>
                          <Input  onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="freeqty" label="Free Qty" style={{ marginBottom: "8px" }}>
                          <Input onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col>
                      {appConfig.discounttype === "Y" ? <Col className="gutter-row" span={4}>
                        <Form.Item name="discountType" label="Discount Type" style={{ marginBottom: "8px" }}>
                          <Select allowClear onChange={OnChangeOrderQty}>
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
                      </Col> : ""}
                      {appConfig.discountvalue === "Y"  ? <Col className="gutter-row" span={4}>
                        <Form.Item name="discount" label="Discount Value" style={{ marginBottom: "8px" }}>
                          <Input  disabled={disableDiscountInput === "" || disableDiscountInput === false ? true : true} onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col> : ""}
                      {appConfig.basePrice === "Y"? <Col className="gutter-row" span={4}>
                        <Form.Item name="BasePriceChange" label="Base Price" style={{ marginBottom: "8px" }}>
                          <Input onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col>: ""}
                      {appConfig.unitPrice === "Y"? <Col className="gutter-row" span={4}>
                        <Form.Item name="unitPrice" label="Unit Price" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col> : ""}
                      {appConfig.netUnitPrice === "Y"? <Col className="gutter-row" span={4}>
                        <Form.Item name="netUnitPrice" label="Net Unit Price" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col> : ""}
                      {appConfig.salesPrice === "Y"? <Col className="gutter-row" span={4}>
                        <Form.Item name="salePrice" label="Sale Price" style={{ marginBottom: "8px" }}>
                          <Input disabled={changePriceDisabledFlag} onChange={OnChangeOrderQty}  />
                        </Form.Item>
                      </Col> : ""}
                      {appConfig.mrp === "Y"?<Col className="gutter-row" span={4}>
                        <Form.Item name="priceList" label="MRP" style={{ marginBottom: "8px" }}>
                          <Input disabled={changePriceDisabledFlag} onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col>: ""}
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="taxName" label="Tax" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col>
                      {appConfig.margin === "Y"? <Col className="gutter-row" span={4}>
                        <Form.Item name="margin" label="Margin" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col> : ""}
                      {appConfig.oldMargin === "Y"? <Col className="gutter-row" span={4}>
                        <Form.Item name="oldMargin" label="Old Margin" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col> : ""}
                      {appConfig.grossAmount === "Y"?<Col className="gutter-row" span={4}>
                        <Form.Item name="grossAmount" label="Gross Amount" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col> : ""}
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="totalDiscount" label="Total Discount" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="twoWeekSale" label="2W/4W sale" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="qtyOnHand" label="On Hand qty" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col>
                      {/* changes */}
                      {appConfig.batchNo === "Y"?<Col className="gutter-row" span={4}>
                      <Form.Item name="batchNo" label="Batch No" style={{ marginBottom: "8px" }}>
                        <Input disabled={disableBatchField} onChange={OnChangeOrderQty} />
                      </Form.Item>
                    </Col>:""}
                    {appConfig.mfgDate === "Y"?<Col className="gutter-row" span={4}>
                      <Form.Item name="mfg_date" label="Mfg. Date" style={{ marginBottom: "8px" }}>
                        <DatePicker disabled={disableBatchField} onChange={OnChangeOrderQty} />
                      </Form.Item>
                    </Col>:""}
                    {appConfig.expDate === "Y"?<Col className="gutter-row" span={4}>
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
                                    <Select mode="multiple" maxTagCount="responsive" showSearch style={{ width: "100%", marginBottom: "0px" }} >
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
                                    <Form.Item initialValue={element.defaultValue !== '' && undefined && null? moment(element.defaultValue) : null} label={element.label} name={element.label} style={{ marginBottom: "8px" }}>
                                    <DatePicker format={"DD-MM-YYYY HH:mm"}/>
                                    </Form.Item>
                                  </Col>
                                );
                            case "TI": 
                              return (
                                  <Col className="gutter-row" span={4} >
                                    <Form.Item initialValue={element.defaultValue !== '' && undefined && null? moment( element.defaultValue , 'HH:mm:ss') : null}  label={element.label} name={element.label} style={{ marginBottom: "8px" }}>
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
              {appConfig.showSummary === "Y" ? 
              <TabPane tab="Summary" key="13">
                  {summaryDiv}
              </TabPane>
                :null
              }
            </Tabs>
          </div>
        </div>
        
        <div>
        <Modal
          visible={addCostVisible}
          closable={null}
          centered
          width="40%"
          // getContainer={false}
          footer={[
            <Button key="back" onClick={addCostCancel} >
              Cancel
            </Button>,
            <Button
              onClick={addCostToGrid}
            >
              Add
            </Button>,
          ]}
        >
          <h3 style={{ textAlign: "center" }}>
            Other Cost
          </h3>
          <Card  style={{ marginBottom: "0px", border: "none" }}>
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
                    <Form.Item label="Value" 
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
        </div>
        <div>
        <Modal
          visible={poSummaryVisible}
          closable={null}
          centered
          width="90%"
          footer={[
            <Button key="back" onClick={createPoCancel} >
              Preview
            </Button>,
            <Button
            style={{backgroundColor:'rgb(176 205 206 / 33%)',color:'#5D5454',border:'0.5px #07888D',fontSize:'12px',fontWeight:'600',height:'35px',width:'105px',borderRadius:'2px'}}
            onClick={savePo}
             loading={loading}
          >
            Save
          </Button>,
            <Button
              loading={loading}
              onClick={createPO}
            >
              Confirm
            </Button>,
          ]}
        >
          <h3 style={{ textAlign: "center" }}>
            Purchase Order Summary
          </h3>
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
                <Form.Item name="orderQty" label="Order Qty" style={{ marginBottom: "8px" }}>
                  <Input onChange={OnChangeOrderQty} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
        </div>
        <div>
        <Modal
          visible={importModalVisible}
          onCancel={importModalClose}
          closable={null}
          centered
          width="50%"
          footer={[
            <Button
              onClick={importModalClose}
            >
              Close
            </Button>
          ]}
        >
          <h3
            style={{ textAlign: 'center' }}
          >
            Import Products
          </h3>
          <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
          <Card>
              <Form layout="vertical" form={importform} name="importform">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="importProductsDiscountType" label="Discount Type">
                        <Select
                          style={{ width: '100%'}}
                          onSelect={onSelectDiscountType}
                        >
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
                       <input  id="choosefile" type="file" accept=".csv" onChange={readFileData} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
          </Card>
          </Spin>
        </Modal>
        </div>
      </Spin>
    );
}

export default PurchaseOrder
