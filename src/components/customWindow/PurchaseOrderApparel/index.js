import React,{useState,useEffect} from 'react'
import {Card,Row,Col,Button,Form,Select,Tabs,Input,InputNumber,Spin,Modal,DatePicker,message,Table,Collapse,Tooltip} from 'antd'
import { LoadingOutlined ,CaretRightOutlined, UpOutlined, DownOutlined} from "@ant-design/icons";
import { v4 as uuid } from 'uuid'
import moment from 'moment'
import Axios from 'axios'
import { useGlobalContext } from "../../../lib/storage";
import useDebounce from "../../../lib/hooks/useDebounce";
import { getCustomBusinessUnit,getSupplierData,getSupplierAddress} from "../../../services/generic";
import { getApparelProducts,getgetAgents,getLandedCostData,getDeliveryLocation,getSupplierCategory,getSupplierRegion,getTaxCategory,getProductCategory,getUOM,getSpecificApparelProduct,getBrand} from "../../../services/custom";
import MainTable from './MainTable'
import OtherCostTable from './OtherCostTable'
import summaryTableColumns from './summaryCols'
// import {serverUrl,genericUrl,fileDownloadUrl} from '../../../constants/serverConfig'
import "antd/dist/antd.css";
import "../../../styles/antd.css";
import { generateToken } from '../../../services/generateToken';
import ThemeJson from "../../../constants/UIServer.json"
const {Option} = Select
const {TabPane} = Tabs
const {Panel} = Collapse
// const dateFormat = 'YYYY-MM-DD'

const PurchaseOrderApparel = (props) => {
let usersData = JSON.parse(localStorage.getItem("userData"));
const { globalStore } = useGlobalContext();
const userPreferences = globalStore.userPreferences;
const dateFormat = userPreferences.dateFormat
const Themes = ThemeJson;
const [bunitData,setBunitData] = useState([])
const [bunitId,setBunitId] = useState('')
const [businessUnitName,setBusinessUnitName] = useState('')
const [supplierData,setSupplierData] = useState([])
const [supplierCategoryDropDownData,setSupplierCategoryDropdownData] = useState([])
const [supplierRegionDropDownData,setSupplierRegionDropdownData] = useState([])
const serverUrl = process.env.REACT_APP_serverUrl;
const genericUrl = process.env.REACT_APP_genericUrl;
const fileDownloadUrl = process.env.REACT_APP_fileDownloadUrl;
const [productCategoryDropDownData,setProductCategoryDropdownData] = useState([])
const [brandDropDownData,setBrandDropdownData] = useState([])
const [taxCategoryDropDownData,setTaxCategoryDropdownData] = useState([])
const [uomDropDownData,setUOMDropdownData] = useState([])
const [globalMargin,setGlobalMargin] = useState(0)

// const [currentDate,setCurrentdate]= useState("")
const [supplierId,setSupplierId] = useState('')
const [supplierName,setSupplierName] = useState('')
const [priceListId,setPriceListId] = useState('')
const [istaxincludedFlag,setIstaxincludedFlag] = useState('')
const [regionName,setRegionName] = useState('')
// const [deliveryLocationName,setDeliveryLocationName] = useState('')
const [loading,setLoading] = useState(false)
const [productData,setProductData] = useState([])
const [selectedProductObject,setSelectedProductObject] = useState({})
const [otherCostData,setOtherCostData] = useState([])
const [addCostVisible,setAddCostVisible] = useState(false)
const [landedCostDropDownData ,setLandedCostDropDownData] = useState([])
const [selectedLandedCost,setSelectedLandedCost] = useState({})
// const [scheduledDate,setScheduledDate] = useState("")
const [poSummaryData,setPoSummaryData] = useState([])
const [poSummaryVisible,setPoSummaryVisible] = useState(false)
const [tabKey,setTabKey] = useState('10')
const [agentData,setAgentData] = useState([])
const [searchInput, setSearchInput] = useState('')
const [responseProductData,setResponseProductData] = useState([])
const [selectedDate,setSelectedDate] = useState('')
const [selectedSupplierEnvDate,setSelectedSupplierEnvDate] = useState('')
const [agentName,setAgentName] = useState('')
const [selectedProductKey,setSelectedProductKey] = useState('')
const [supplierAddressName,setSupplierAddressName] = useState('')
const [supplierAddressId,setSupplierAddressId] = useState('')
const [agentId,setAgentId] = useState(null)

const[supplierPopupVisible,setSupplierPopupVisible] = useState(false)
const[productPopupVisible,setProductPopupVisible] = useState(false)
const[hideHeader,setHideHeader] = useState(false)


const[gridGrossAmount,setGridGrossAmount]=useState(0)
const[MRP,setMRP]=useState(0)
const[totalTax,setTotalTax]=useState("")
const[headerBillAmount,setHeaderBillAmount]=useState(0)
const[totalDiscountValue,setTotalDiscountValue]=useState(0)
const[HSN,setHSN]=useState("")
const[productCategory,setCategory]=useState("")
const[brand,setBrand]=useState("")
const[brandTitle,setBrandTitle]=useState("")

const[modalNo,setModalNo]=useState("")


const[productCategoryTitle,setProductCategoryTitle]=useState("")

const[contraTaxCategoryName,setContraTaxCategoryName]=useState("")
const[overRideCondition,setOverRideCondition]=useState(0)
const[overRideTax,setOverRideTax]=useState("")
const[contraTaxRate,setContraTaxRate]=useState(0)
const[contraRateFlag,setContraRateFlag]=useState(false)

/* const[commissionValue,setCommissionValue]=useState(0)
const[sizeValue,setSizeValue]=useState(0) */


const [form] = Form.useForm();
const [headerform] = Form.useForm()
const [otherCostForm] = Form.useForm()
const [summaryForm] = Form.useForm()
const [addSupplierForm] = Form.useForm()
const [addProductForm] = Form.useForm()

const [searchKey, setSearchkey] = useState();
const debouncedSearchKey = useDebounce(searchKey, 350);


useEffect(() => {
  const initialDate= moment(new Date())
  setSelectedDate(initialDate)
  headerform.setFieldsValue({
   'headerDate':moment(initialDate,dateFormat),
   'supplierEnnvDate':moment(initialDate,dateFormat),
   'totalDiscount':0
 })
 setSelectedSupplierEnvDate(initialDate)
 summaryForm.setFieldsValue({
   'summreceiptdate':moment(initialDate,dateFormat),
   'summsupplierinv#date':moment(initialDate,dateFormat),
 })
 }, []);

 const getDateChange = (date, dateString) =>{
  setSelectedDate(dateString)
  headerform.setFieldsValue({
    'headerDate':moment(dateString,dateFormat),
  })
  summaryForm.setFieldsValue({
    'summorderdate':moment(dateString,dateFormat),
  })
}

const getsupplierDateChange = (date, dateString) =>{
  setSelectedSupplierEnvDate(dateString)
  // const userData = 
  headerform.setFieldsValue({
    'supplierEnnvDate':moment(dateString,dateFormat),
  })
  summaryForm.setFieldsValue({
    'summsupplierinv#date':moment(dateString,dateFormat),
  })
}

const getBusinessUnit = async () =>{
  const businessUnitResponse = await getCustomBusinessUnit()
  setBunitData(businessUnitResponse)
}

const getSuppliers = async () =>{
  const supplierResponse = await getSupplierData()
  setSupplierData(supplierResponse)
}

const onSelectBusinessUnit = (e,data) =>{
  const { title } = data.props
  // const date = new Date()
  // const minDate = date.toISOString().slice(0, 10)
  setBunitId(e)
  setBusinessUnitName(title)
  // setCurrentdate(minDate)
  // setScheduledDate(minDate)
  getDeliverLocation(e)

}

const getDeliverLocation = async (e) =>{
  const deliveryResponse = await getDeliveryLocation(e)
  // setDeliveryLocationList(deliveryResponse)
  setRegionName(deliveryResponse[0].bUnitLocationId)
}

const getAgent = async() =>{
const agentResponse =  await getgetAgents(bunitId)
setAgentData(agentResponse)
}

const getProducts = async (e) =>{
  const productResponse = await getApparelProducts(e,bunitId,supplierId)
  for (let index = 0; index < productResponse.length; index++) {
    const uniqueId = uuid()
      .replace(/-/g, '')
      .toUpperCase()
    productResponse[index].key = uniqueId;
  }
  setResponseProductData((s)=>[...productResponse])
}

const getSpecificProduct = async (value,bunitId,supplierId) =>{
  const specificProductResponse = await getSpecificApparelProduct(value,bunitId,supplierId)
  const productDetails = specificProductResponse[0]
  const productOverRideCondition = productDetails.taxCategory.overRideCondition===null?"":productDetails.taxCategory.overRideCondition
  const productOverRideTax = productDetails.taxCategory.overRideTax
  const productContraTaxRate = productDetails.taxCategory.contraTaxCategory===null?0:productDetails.taxCategory.contraTaxCategory.contraRate
  const productContraTaxCategoryName = productDetails.taxCategory.contraTaxCategory===null?0:productDetails.taxCategory.contraTaxCategory.contraTaxCategoryName

  setSelectedProductObject(specificProductResponse[0])
  setBrand(productDetails.brandName)
  setHSN(productDetails.hsnName)
  setCategory(productDetails.productCategory.name)
  setTotalTax(productDetails.taxCategory.name)
  setContraTaxCategoryName(productContraTaxCategoryName)
  setOverRideCondition(productOverRideCondition)
  setOverRideTax(productOverRideTax)
  setContraTaxRate(productContraTaxRate)
}

const onSelectSupplier = (e, data) =>{
  // const date = new Date()
  // const minDate = date.toISOString().slice(0, 10)
  setSupplierId(e)
  setSupplierName(data.props.title)
  // setCurrentdate(minDate)
  setPriceListId(data.props.pricelistid)
  setIstaxincludedFlag(data.props.istaxflag)
  getSupplierAdd(e)
}

const getSupplierAdd = async (e) =>{
  const supplierAddressResponse = await getSupplierAddress(e)
  if(supplierAddressResponse.length > 0){
setSupplierAddressName(supplierAddressResponse[0].name === undefined ? null : supplierAddressResponse[0].name)
setSupplierAddressId(supplierAddressResponse[0].recordid)
  }else{
setSupplierAddressName(null)
setSupplierAddressId(null)
  }
}

const onAgentChange = (e,data) =>{
  summaryForm.setFieldsValue({
    'summsupplierAgent':data.children
  })
  setAgentId(e)
  setAgentName(data.children)
}

const getLandedCost = async () =>{
  const getLandedCostResponse = await getLandedCostData()
  setLandedCostDropDownData(getLandedCostResponse)
}

const getSelectedRecord = (data) =>{
setSelectedProductKey(data.key)
setSelectedProductObject(data)
const newData = data
const productOverRideCondition = newData.taxCategory.overRideCondition===null?"":newData.taxCategory.overRideCondition
const productOverRideTax = newData.taxCategory.overRideTax
const productContraTaxRate = newData.taxCategory.contraTaxCategory===null?0:newData.taxCategory.contraTaxCategory.contraRate
const productContraTaxCategoryName = newData.taxCategory.contraTaxCategory===null?0:newData.taxCategory.contraTaxCategory.contraTaxCategoryName

form.setFieldsValue({
'productName':newData.name,
'design':newData.design,
'productCategoryName':newData.productCategory.name,
'brand':newData.brandName,
'HSNCode':newData.hsnName,
'orderQty':newData.qty,
'PPriceChange':newData.priceStd,
'taxName':newData.taxCategory.name,
'margin':newData.margin,
'commission':newData.commission,
'grossAmount':newData.gridGrossAmt,
'mrp':newData.priceList,
'size':newData.size,
'bCode':newData.bCode
  })  
setHSN(newData.hsnName)
setCategory(newData.productCategory.name)
setTotalTax(newData.taxCategory.name) 
setBrand(newData.brandName)
setMRP(newData.priceList)
setGridGrossAmount((newData.lineGrossAmtAfterDisc).toFixed(2))
setContraTaxCategoryName(productContraTaxCategoryName)
setOverRideCondition(productOverRideCondition)
setOverRideTax(productOverRideTax)
setContraTaxRate(productContraTaxRate)
}


const deleteSelectedRecord = (data) => {
  const productId = data.mProductId;
  const deletedProductData = productData;
  let newArr = []
  let finalDeletedArr = []
  // const deletedProductData=productData.splice(0,1 );
  for (let index = 0; index < deletedProductData.length; index++) {
    const element = deletedProductData[index];
    if (productId !== element.mProductId) {
      newArr.push(element)
    }
  }

  let totalLineNetAmt = 0;
  let totalHeaderBillAmount = 0;
  for (let index = 0; index < newArr.length; index++) {
    totalLineNetAmt += parseFloat(newArr[index].linenetamt);
    // newArray.push(productData[index])
  }
  let totalDiscountVal = totalDiscountValue;
  for (let index2 = 0; index2 < newArr.length; index2++) {
    // (Sum of all line netamount/each line net amount)*totalDisc
    const discountAmt = parseFloat((newArr[index2].linenetamt/totalLineNetAmt) * totalDiscountVal);
    const lineNetAmtAfterDisc = parseFloat(newArr[index2].linenetamt - discountAmt )  
    if(newArr[index2].pPriceList.isTaxIncluded==="Y"){
      const grossUnitPrice = parseFloat(newArr[index2].priceStd)
      if(newArr[index2].taxCategory.overRideTax==="Y"){
        if(grossUnitPrice<=newArr[index2].taxCategory.overRideCondition){
          const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (parseFloat(newArr[index2].taxCategory.contraTaxCategory.contraRate)/100))+lineNetAmtAfterDisc)
          const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/newArr[index2].qty)
          const unitTax = parseFloat(newArr[index2].priceStd-(newArr[index2].priceStd / (1+parseFloat(newArr[index2].taxCategory.contraTaxCategory.contraRate)/100)))
          const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+parseFloat(newArr[index2].taxCategory.contraTaxCategory.contraRate)/100)))
          // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
          newArr[index2].totalDiscount=discountAmt
          newArr[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
          newArr[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
          newArr[index2].unitPriceAfterDisc = unitPriceAfterDisc;
          newArr[index2].unitTax = unitTax;
          newArr[index2].unitTaxAfterDisc = unitTaxAfterDisc;
          newArr[index2].purchasePrice = parseFloat(newArr[index2].priceStd);;
          finalDeletedArr.push(newArr[index2])
        }else{
          const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (newArr[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
          const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/newArr[index2].qty)
          const unitTax = parseFloat(newArr[index2].priceStd-(newArr[index2].priceStd / (1+newArr[index2].taxRate.rate/100)))
          const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+newArr[index2].taxRate.rate/100)))
          // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
          newArr[index2].totalDiscount=discountAmt
          newArr[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
          newArr[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
          newArr[index2].unitPriceAfterDisc = unitPriceAfterDisc;
          newArr[index2].unitTax = unitTax;
          newArr[index2].unitTaxAfterDisc = unitTaxAfterDisc;
          newArr[index2].purchasePrice = parseFloat(newArr[index2].priceStd);;
          finalDeletedArr.push(newArr[index2])
        }
      }else{
          const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (newArr[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
          const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/newArr[index2].qty)
          const unitTax = parseFloat(newArr[index2].priceStd-(newArr[index2].priceStd / (1+newArr[index2].taxRate.rate/100)))
          const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+newArr[index2].taxRate.rate/100)))
          // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
          newArr[index2].totalDiscount=discountAmt
          newArr[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
          newArr[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
          newArr[index2].unitPriceAfterDisc = unitPriceAfterDisc;
          newArr[index2].unitTax = unitTax;
          newArr[index2].unitTaxAfterDisc = unitTaxAfterDisc;
          newArr[index2].purchasePrice = parseFloat(newArr[index2].priceStd);
          finalDeletedArr.push(newArr[index2])
      }
      
    }else{

      const grossUnitPrice = (parseFloat(newArr[index2].priceStd) * (newArr[index2].taxRate.rate)/100)+parseFloat(newArr[index2].priceStd)
      if(newArr[index2].taxCategory.overRideTax==="Y"){
        if(grossUnitPrice<=newArr[index2].taxCategory.overRideCondition){
          const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (parseFloat(newArr[index2].taxCategory.contraTaxCategory.contraRate)/100))+lineNetAmtAfterDisc)
          const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/newArr[index2].qty)
          const unitTax = parseFloat(newArr[index2].priceStd-(newArr[index2].priceStd / (1+parseFloat(newArr[index2].taxCategory.contraTaxCategory.contraRate)/100)))
          const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+parseFloat(newArr[index2].taxCategory.contraTaxCategory.contraRate)/100)))
          // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
          newArr[index2].totalDiscount=discountAmt
          newArr[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
          newArr[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
          newArr[index2].unitPriceAfterDisc = unitPriceAfterDisc;
          newArr[index2].unitTax = unitTax;
          newArr[index2].unitTaxAfterDisc = unitTaxAfterDisc;
          // newArr[index2].purchasePrice = newArr[index2].priceStd;
          newArr[index2].purchasePrice = parseFloat(lineNetAmtAfterDisc/newArr[index2].qty);
          finalDeletedArr.push(newArr[index2])
        }else{
          const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (newArr[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
          const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/newArr[index2].qty)
          const unitTax = parseFloat(newArr[index2].priceStd-(newArr[index2].priceStd / (1+newArr[index2].taxRate.rate/100)))
          const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+newArr[index2].taxRate.rate/100)))
          // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
          newArr[index2].totalDiscount=discountAmt
          newArr[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
          newArr[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
          newArr[index2].unitPriceAfterDisc = unitPriceAfterDisc;
          newArr[index2].unitTax = unitTax;
          newArr[index2].unitTaxAfterDisc = unitTaxAfterDisc;
          // newArr[index2].purchasePrice = newArr[index2].priceStd;
          newArr[index2].purchasePrice = parseFloat(lineNetAmtAfterDisc/newArr[index2].qty);
          finalDeletedArr.push(newArr[index2])
        }
      }else{
          const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (newArr[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
          const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/newArr[index2].qty)
          const unitTax = parseFloat(newArr[index2].priceStd-(newArr[index2].priceStd / (1+newArr[index2].taxRate.rate/100)))
          const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+newArr[index2].taxRate.rate/100)))
          // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
          newArr[index2].totalDiscount=discountAmt
          newArr[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
          newArr[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
          newArr[index2].unitPriceAfterDisc = unitPriceAfterDisc;
          newArr[index2].unitTax = unitTax;
          newArr[index2].unitTaxAfterDisc = unitTaxAfterDisc;
          // newArr[index2].purchasePrice = newArr[index2].priceStd;
          newArr[index2].purchasePrice = parseFloat(lineNetAmtAfterDisc/newArr[index2].qty);
          finalDeletedArr.push(newArr[index2])
      }
    }  
    
    /* const lineGrossAmtAfterDisc = parseFloat(((lineNetAmtAfterDisc) * (newArr[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
    const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/newArr[index2].qty)
    const unitTax = parseFloat(newArr[index2].priceStd-(newArr[index2].priceStd / (1+newArr[index2].taxRate.rate/100)))
    const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+newArr[index2].taxRate.rate/100)))
    totalHeaderBillAmount += parseFloat(lineGrossAmtAfterDisc)
    newArr[index2].totalDiscount = discountAmt;
    newArr[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
    newArr[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
    newArr[index2].unitPriceAfterDisc = isNaN(unitPriceAfterDisc)===true?0:unitPriceAfterDisc;
    newArr[index2].unitTax = unitTax;
    newArr[index2].unitTaxAfterDisc = isNaN(unitTaxAfterDisc)===true?0:unitTaxAfterDisc;
    finalDeletedArr.push(newArr[index2]) */
  }

  setHeaderBillAmount(totalHeaderBillAmount.toFixed(2))
  setProductData(finalDeletedArr)

};

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

const onChangeTotalDiscount=(e)=>{
  let totalLineNetAmt = 0;
  let totalHeaderBillAmount = 0;
  for (let index = 0; index < productData.length; index++) {
    totalLineNetAmt += parseFloat(productData[index].linenetamt);
  }
  let totalDiscountVal = e.target.value;
  setTotalDiscountValue(totalDiscountVal)
  for (let index2 = 0; index2 < productData.length; index2++) {
    // (Sum of all line netamount/each line net amount)*totalDisc
    const discountAmt = parseFloat((productData[index2].linenetamt/totalLineNetAmt) * totalDiscountVal);
    const lineNetAmtAfterDisc = parseFloat(productData[index2].linenetamt - discountAmt ) 
    
    if(productData[index2].pPriceList.isTaxIncluded==="Y"){
      const grossUnitPrice = parseFloat(productData[index2].priceStd)
      if(productData[index2].taxCategory.overRideTax==="Y"){
        if(grossUnitPrice<=productData[index2].taxCategory.overRideCondition){
          const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (parseFloat(productData[index2].taxCategory.contraTaxCategory.contraRate)/100))+lineNetAmtAfterDisc)
          const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/productData[index2].qty)
          const unitTax = parseFloat(productData[index2].priceStd-(productData[index2].priceStd / (1+parseFloat(productData[index2].taxCategory.contraTaxCategory.contraRate)/100)))
          const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+parseFloat(productData[index2].taxCategory.contraTaxCategory.contraRate)/100)))
          // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
          productData[index2].totalDiscount=discountAmt
          productData[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
          productData[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
          productData[index2].unitPriceAfterDisc = unitPriceAfterDisc;
          productData[index2].unitTax = unitTax;
          productData[index2].unitTaxAfterDisc = unitTaxAfterDisc;
          productData[index2].purchasePrice = parseFloat(productData[index2].priceStd)
        }else{
          const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (productData[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
          const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/productData[index2].qty)
          const unitTax = parseFloat(productData[index2].priceStd-(productData[index2].priceStd / (1+productData[index2].taxRate.rate/100)))
          const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+productData[index2].taxRate.rate/100)))
          // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
          productData[index2].totalDiscount=discountAmt
          productData[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
          productData[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
          productData[index2].unitPriceAfterDisc = unitPriceAfterDisc;
          productData[index2].unitTax = unitTax;
          productData[index2].unitTaxAfterDisc = unitTaxAfterDisc;
          productData[index2].purchasePrice = parseFloat(productData[index2].priceStd)
        }
      }else{
          const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (productData[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
          const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/productData[index2].qty)
          const unitTax = parseFloat(productData[index2].priceStd-(productData[index2].priceStd / (1+productData[index2].taxRate.rate/100)))
          const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+productData[index2].taxRate.rate/100)))
          // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
          productData[index2].totalDiscount=discountAmt
          productData[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
          productData[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
          productData[index2].unitPriceAfterDisc = unitPriceAfterDisc;
          productData[index2].unitTax = unitTax;
          productData[index2].unitTaxAfterDisc = unitTaxAfterDisc;
          productData[index2].purchasePrice = parseFloat(productData[index2].priceStd)
      }
      
    }else{
      const grossUnitPrice = (parseFloat(productData[index2].priceStd) * (productData[index2].taxRate.rate)/100)+parseFloat(productData[index2].priceStd)
      if(productData[index2].taxCategory.overRideTax==="Y"){
        if(grossUnitPrice<=productData[index2].taxCategory.overRideCondition){
          const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (parseFloat(productData[index2].taxCategory.contraTaxCategory.contraRate)/100))+lineNetAmtAfterDisc)
          const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/productData[index2].qty)
          const unitTax = parseFloat(productData[index2].priceStd-(productData[index2].priceStd / (1+parseFloat(productData[index2].taxCategory.contraTaxCategory.contraRate)/100)))
          const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+parseFloat(productData[index2].taxCategory.contraTaxCategory.contraRate)/100)))
          // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
          productData[index2].totalDiscount=discountAmt
          productData[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
          productData[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
          productData[index2].unitPriceAfterDisc = unitPriceAfterDisc;
          productData[index2].unitTax = unitTax;
          productData[index2].unitTaxAfterDisc = unitTaxAfterDisc;
          // productData[index2].purchasePrice = productData[index2].priceStd
          productData[index2].purchasePrice = parseFloat(lineNetAmtAfterDisc/productData[index2].qty);
        }else{
          const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (productData[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
          const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/productData[index2].qty)
          const unitTax = parseFloat(productData[index2].priceStd-(productData[index2].priceStd / (1+productData[index2].taxRate.rate/100)))
          const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+productData[index2].taxRate.rate/100)))
          // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
          productData[index2].totalDiscount=discountAmt
          productData[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
          productData[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
          productData[index2].unitPriceAfterDisc = unitPriceAfterDisc;
          productData[index2].unitTax = unitTax;
          productData[index2].unitTaxAfterDisc = unitTaxAfterDisc;
          // productData[index2].purchasePrice = productData[index2].priceStd
          productData[index2].purchasePrice = parseFloat(lineNetAmtAfterDisc/productData[index2].qty);
        }
      }else{
          const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (productData[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
          const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/productData[index2].qty)
          const unitTax = parseFloat(productData[index2].priceStd-(productData[index2].priceStd / (1+productData[index2].taxRate.rate/100)))
          const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+productData[index2].taxRate.rate/100)))
          // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
          productData[index2].totalDiscount=discountAmt
          productData[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
          productData[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
          productData[index2].unitPriceAfterDisc = unitPriceAfterDisc;
          productData[index2].unitTax = unitTax;
          productData[index2].unitTaxAfterDisc = unitTaxAfterDisc;
          // productData[index2].purchasePrice = productData[index2].priceStd
          productData[index2].purchasePrice = parseFloat(lineNetAmtAfterDisc/productData[index2].qty);
      }
    }

  }
  setHeaderBillAmount(totalHeaderBillAmount.toFixed(2))
  setProductData(productData)
  setSelectedProductObject({});
  setResponseProductData([]);
}

const OnChangeOrderQty = (e) =>{
 const productObject = selectedProductObject
 const formFieldsData = form.getFieldsValue(true);
  const isDatainObject = Object.keys(productObject).length === 0; // true
  
  if(isDatainObject === false){
   let  basePrice = formFieldsData.PPriceChange
   let margin2 = formFieldsData.margin === undefined || formFieldsData.margin === null ? 0 :formFieldsData.margin
   // let  margin1 = (((productObject.priceList - basePrice) / productObject.priceList) * 100)
   // let istaxincluded = productObject.pPriceList.isTaxIncluded
   let gridGrossAmt;
   // let margin;
   let totalTax;
   let MRP;
   let lineNetAmt
   let taxRate
   let grossUnitPrice
   if(istaxincludedFlag === "Y"){
     // Gross Unit Price = Pprice     
      grossUnitPrice = parseFloat(basePrice)
      if(overRideTax==="Y"){
        if(grossUnitPrice<=overRideCondition){
        setContraRateFlag(true)
        const netMargin  = (basePrice * (margin2/100))
        taxRate = contraTaxRate
        MRP = (parseFloat(netMargin) + parseFloat(basePrice)).toFixed(2)
        const gridGrossAmt1 = (basePrice * formFieldsData.orderQty)
        // gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
        const netUnitPrice1 = ((basePrice/(1+contraTaxRate/100)) - 0)
        const  totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * formFieldsData.orderQty))
        totalTax= (Math.round(totalTax1 * 100) / 100).toFixed(2)
        lineNetAmt = (netUnitPrice1 * formFieldsData.orderQty)
        gridGrossAmt = parseFloat((lineNetAmt * ((contraTaxRate/100))+lineNetAmt))
        }
        else{
          setContraRateFlag(false)
          const netMargin  = (basePrice * (margin2/100))
          taxRate = productObject.taxRate.rate
          MRP = (parseFloat(netMargin) + parseFloat(basePrice)).toFixed(2)
          const gridGrossAmt1 = (basePrice * formFieldsData.orderQty)
          // gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
          const netUnitPrice1 = ((basePrice/(1+productObject.taxRate.rate/100)) - 0)
          const  totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * formFieldsData.orderQty))
          totalTax= (Math.round(totalTax1 * 100) / 100).toFixed(2)
          lineNetAmt = (netUnitPrice1 * formFieldsData.orderQty)
          gridGrossAmt = parseFloat((lineNetAmt * ((taxRate/100))+lineNetAmt))
        }
      }else{
        const netMargin  = (basePrice * (margin2/100))
          taxRate = productObject.taxRate.rate
          MRP = (parseFloat(netMargin) + parseFloat(basePrice)).toFixed(2)
          const gridGrossAmt1 = (basePrice * formFieldsData.orderQty)
          // gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
          const netUnitPrice1 = ((basePrice/(1+productObject.taxRate.rate/100)) - 0)
          const  totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * formFieldsData.orderQty))
          totalTax= (Math.round(totalTax1 * 100) / 100).toFixed(2)
          lineNetAmt = (netUnitPrice1 * formFieldsData.orderQty)
          gridGrossAmt = parseFloat((lineNetAmt * ((taxRate/100))+lineNetAmt))
        }
      }          
    else{
      grossUnitPrice = (parseFloat(basePrice) * (productObject.taxRate.rate)/100)+parseFloat(basePrice)
      if(overRideTax==="Y"){
        if(grossUnitPrice<=overRideCondition){
        setContraRateFlag(true)
        const netMargin  = (basePrice * (margin2/100))
        // taxRate = contraTaxRate
        const taxOnUnitPrice1 = ((contraTaxRate/ 100) * basePrice)
        const gridGrossAmt1 = (parseFloat(basePrice) + parseFloat(taxOnUnitPrice1))
        const mrpWithoutTax = netMargin + parseFloat(basePrice)
        MRP = (mrpWithoutTax * (contraTaxRate/100))+parseFloat(mrpWithoutTax)
        const netUnitPrice1 = ((basePrice - 0))
        const  totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * formFieldsData.orderQty))
        totalTax= (Math.round(totalTax1 * 100) / 100).toFixed(2)
        lineNetAmt = (netUnitPrice1 * formFieldsData.orderQty)
        // gridGrossAmt = (parseFloat(basePrice) * (contraTaxRate/100))+parseFloat(basePrice)
        gridGrossAmt = parseFloat((lineNetAmt * ((contraTaxRate/100))+lineNetAmt))
        }
        else{  
          setContraRateFlag(false)      
          const netMargin  = (basePrice * (margin2/100))
          taxRate = productObject.taxRate.rate
          const taxOnUnitPrice1 = ((productObject.taxRate.rate/ 100) * basePrice)
          const gridGrossAmt1 = (parseFloat(basePrice) + parseFloat(taxOnUnitPrice1))
          const mrpWithoutTax = netMargin + parseFloat(basePrice)
          MRP = (mrpWithoutTax * (taxRate/100))+parseFloat(mrpWithoutTax)
          // gridGrossAmt = (parseFloat(basePrice) * taxRate/100)+parseFloat(basePrice)
          const netUnitPrice1 = ((basePrice - 0))
          const  totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * formFieldsData.orderQty))
          totalTax= (Math.round(totalTax1 * 100) / 100).toFixed(2)
          lineNetAmt = (netUnitPrice1 * formFieldsData.orderQty)
          gridGrossAmt = parseFloat((lineNetAmt * ((taxRate/100))+lineNetAmt))
        }
      }else{
        const netMargin  = (basePrice * (margin2/100))
        taxRate = productObject.taxRate.rate
        MRP = (parseFloat(netMargin) + parseFloat(basePrice)).toFixed(2)
        const gridGrossAmt1 = (basePrice * formFieldsData.orderQty)
        // gridGrossAmt = (Math.round(gridGrossAmt1 * 100) / 100).toFixed(2)
        const netUnitPrice1 = ((basePrice/(1+productObject.taxRate.rate/100)) - 0)
        const  totalTax1 = ((gridGrossAmt1) - (netUnitPrice1 * formFieldsData.orderQty))
        totalTax= (Math.round(totalTax1 * 100) / 100).toFixed(2)
        lineNetAmt = (netUnitPrice1 * formFieldsData.orderQty)
        gridGrossAmt = parseFloat((lineNetAmt * ((taxRate/100))+lineNetAmt))
        }    
   }
   setGridGrossAmount(gridGrossAmt === "NaN" || isNaN(gridGrossAmt)===true ? 0 : parseFloat(gridGrossAmt).toFixed(2))
   setMRP(MRP === "NaN" || isNaN(MRP)===true ? 0 : MRP)
   form.setFieldsValue({
     'grossAmount':gridGrossAmt === "NaN" || isNaN(gridGrossAmt)===true ? 0 : gridGrossAmt ,
     'mrp':MRP === "NaN" || isNaN(MRP)===true ? 0 : MRP
   })
   selectedProductObject.gridGrossAmt = gridGrossAmt
   selectedProductObject.margin = margin2
   selectedProductObject.totalTax = totalTax
   selectedProductObject.priceStd = basePrice
   selectedProductObject.mrp = MRP
   selectedProductObject.priceList = MRP
   selectedProductObject.qty = formFieldsData.orderQty
   selectedProductObject.commission = formFieldsData.commission
   selectedProductObject.design = formFieldsData.design !== undefined ? formFieldsData.design : null
   selectedProductObject.linenetamt = lineNetAmt
   selectedProductObject.size = formFieldsData.size
   selectedProductObject.bCode = formFieldsData.bCode
  }
  else{
    message.error("Can not Proceed!")
    form.resetFields(['orderQty','bCode','design','PPriceChange','commission','size'])
  
 }
 
}

// document.addEventListener("keypress", function(e) {
//   if (e.keyCode === 13) {
//    e.preventDefault();
//    e.stopImmediatePropagation();
//    addRecordToLine()
//   }
// });

const addRecordToLine = () =>{
 const isDatainObject = Object.keys(selectedProductObject).length === 0; // true
 const formData =  form.getFieldsValue(true)
 if(isDatainObject === false){
  if(formData.orderQty === undefined || formData.orderQty === null || formData.PPriceChange  === undefined || formData.PPriceChange  === null ||formData.margin  === undefined || formData.margin  === null  ){
    message.error("Can not proceed")
  }else{
    const index = productData.findIndex(element => {
      return element.key === selectedProductKey
    })
      if (index >= 0) {
        let newArray =[]
        let totalLineNetAmt = 0;
        let totalHeaderBillAmount = 0;
        for (let index = 0; index < productData.length; index++) {
          totalLineNetAmt += parseFloat(productData[index].linenetamt);
          // newArray.push(productData[index])
        }
        let totalDiscountVal = totalDiscountValue;
        for (let index2 = 0; index2 < productData.length; index2++) {
          // (Sum of all line netamount/each line net amount)*totalDisc
            const discountAmt = parseFloat((productData[index2].linenetamt/totalLineNetAmt) * totalDiscountVal);
            const lineNetAmtAfterDisc = parseFloat(productData[index2].linenetamt - discountAmt )



            if(productData[index2].pPriceList.isTaxIncluded==="Y"){
              const grossUnitPrice = parseFloat(productData[index2].priceStd)
              if(productData[index2].taxCategory.overRideTax==="Y"){
                if(grossUnitPrice<=productData[index2].taxCategory.overRideCondition){
                  const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (parseFloat(productData[index2].taxCategory.contraTaxCategory.contraRate)/100))+lineNetAmtAfterDisc)
                  const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/productData[index2].qty)
                  const unitTax = parseFloat(productData[index2].priceStd-(productData[index2].priceStd / (1+parseFloat(productData[index2].taxCategory.contraTaxCategory.contraRate)/100)))
                  const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+parseFloat(productData[index2].taxCategory.contraTaxCategory.contraRate)/100)))
                  // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
                  productData[index2].totalDiscount=discountAmt
                  productData[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
                  productData[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
                  productData[index2].unitPriceAfterDisc = unitPriceAfterDisc;
                  productData[index2].unitTax = unitTax;
                  productData[index2].unitTaxAfterDisc = unitTaxAfterDisc;
                  productData[index2].purchasePrice = parseFloat(productData[index2].priceStd);
                  newArray.push(productData[index2])
                }else{
                  const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (productData[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
                  const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/productData[index2].qty)
                  const unitTax = parseFloat(productData[index2].priceStd-(productData[index2].priceStd / (1+productData[index2].taxRate.rate/100)))
                  const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+productData[index2].taxRate.rate/100)))
                  // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
                  productData[index2].totalDiscount=discountAmt
                  productData[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
                  productData[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
                  productData[index2].unitPriceAfterDisc = unitPriceAfterDisc;
                  productData[index2].unitTax = unitTax;
                  productData[index2].unitTaxAfterDisc = unitTaxAfterDisc;
                  productData[index2].purchasePrice = parseFloat(productData[index2].priceStd);
                  newArray.push(productData[index2])
                }
              }else{
                  const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (productData[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
                  const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/productData[index2].qty)
                  const unitTax = parseFloat(productData[index2].priceStd-(productData[index2].priceStd / (1+productData[index2].taxRate.rate/100)))
                  const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+productData[index2].taxRate.rate/100)))
                  // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
                  productData[index2].totalDiscount=discountAmt
                  productData[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
                  productData[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
                  productData[index2].unitPriceAfterDisc = unitPriceAfterDisc;
                  productData[index2].unitTax = unitTax;
                  productData[index2].unitTaxAfterDisc = unitTaxAfterDisc;
                  productData[index2].purchasePrice = parseFloat(productData[index2].priceStd);
                  newArray.push(productData[index2])
              }
              
            }else{
  
              const grossUnitPrice = (parseFloat(productData[index2].priceStd) * (productData[index2].taxRate.rate)/100)+parseFloat(productData[index2].priceStd)
              
              if(productData[index2].taxCategory.overRideTax==="Y"){
                if(grossUnitPrice<=productData[index2].taxCategory.overRideCondition){
                  const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (parseFloat(productData[index2].taxCategory.contraTaxCategory.contraRate)/100))+lineNetAmtAfterDisc)
                  const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/productData[index2].qty)
                  const unitTax = parseFloat(productData[index2].priceStd-(productData[index2].priceStd / (1+parseFloat(productData[index2].taxCategory.contraTaxCategory.contraRate)/100)))
                  const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+parseFloat(productData[index2].taxCategory.contraTaxCategory.contraRate)/100)))
                  // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
                  productData[index2].totalDiscount=discountAmt
                  productData[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
                  productData[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
                  productData[index2].unitPriceAfterDisc = unitPriceAfterDisc;
                  productData[index2].unitTax = unitTax;
                  productData[index2].unitTaxAfterDisc = unitTaxAfterDisc;
                  productData[index2].purchasePrice = parseFloat(productData[index2].priceStd);
                  newArray.push(productData[index2])
                }else{
                  const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (productData[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
                  const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/productData[index2].qty)
                  const unitTax = parseFloat(productData[index2].priceStd-(productData[index2].priceStd / (1+productData[index2].taxRate.rate/100)))
                  const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+productData[index2].taxRate.rate/100)))
                  // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
                  productData[index2].totalDiscount=discountAmt
                  productData[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
                  productData[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
                  productData[index2].unitPriceAfterDisc = unitPriceAfterDisc;
                  productData[index2].unitTax = unitTax;
                  productData[index2].unitTaxAfterDisc = unitTaxAfterDisc;
                  productData[index2].purchasePrice = parseFloat(productData[index2].priceStd);
                  newArray.push(productData[index2])
                }
              }else{
                  const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (productData[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
                  const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/productData[index2].qty)
                  const unitTax = parseFloat(productData[index2].priceStd-(productData[index2].priceStd / (1+productData[index2].taxRate.rate/100)))
                  const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+productData[index2].taxRate.rate/100)))
                  // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
                  productData[index2].totalDiscount=discountAmt
                  productData[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
                  productData[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
                  productData[index2].unitPriceAfterDisc = unitPriceAfterDisc;
                  productData[index2].unitTax = unitTax;
                  productData[index2].unitTaxAfterDisc = unitTaxAfterDisc;
                  productData[index2].purchasePrice = parseFloat(productData[index2].priceStd);
                  newArray.push(productData[index2])
              }
            }
        }
        setHeaderBillAmount(totalHeaderBillAmount.toFixed(2))
        setProductData(newArray)
        form.resetFields()
        form.setFieldsValue({'margin':globalMargin})
        setSelectedProductObject({})
        setResponseProductData([])
        setBrand("")
        setHSN("")
        setCategory("")
        setMRP(0)
        setTotalTax("")
        setGridGrossAmount(0)
        setContraTaxCategoryName("")
        setContraTaxRate(0)
        setOverRideCondition(0)
        setOverRideTax("")
        setBrandTitle("")
        setProductCategoryTitle("")
        setModalNo("")
        setContraRateFlag(false)
        /* setCommissionValue(0)
        setSizeValue(0) */
      }else{
        const data = [selectedProductObject,...productData]

        let totalLineNetAmt = 0
        let totalHeaderBillAmountElse = 0
        for (let index = 0; index < data.length; index++) {
          totalLineNetAmt += parseFloat(data[index].linenetamt)          
        }
        const headerFormData = headerform.getFieldsValue(true)
        let totalDiscount = headerFormData.totalDiscount
        for (let index2 = 0; index2 < data.length; index2++) {
          // totalLineNetAmt += parseFloat(data[index].linenetamt)  
          // (Sum of all line netamount/each line net amount)*totalDisc

          const discountAmt = parseFloat((data[index2].linenetamt/totalLineNetAmt)*totalDiscount)
          const lineNetAmtAfterDisc = parseFloat(data[index2].linenetamt - discountAmt)
          
          if(data[index2].pPriceList.isTaxIncluded==="Y"){
            const grossUnitPrice = parseFloat(data[index2].priceStd)
            if(data[index2].taxCategory.overRideTax==="Y"){
              if(grossUnitPrice<=data[index2].taxCategory.overRideCondition){
                const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (parseFloat(data[index2].taxCategory.contraTaxCategory.contraRate)/100))+lineNetAmtAfterDisc)
                const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/data[index2].qty)
                const unitTax = parseFloat(data[index2].priceStd-(data[index2].priceStd / (1+parseFloat(data[index2].taxCategory.contraTaxCategory.contraRate)/100)))
                const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+parseFloat(data[index2].taxCategory.contraTaxCategory.contraRate)/100)))
                // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
                data[index2].totalDiscount=discountAmt
                data[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
                data[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
                data[index2].unitPriceAfterDisc = unitPriceAfterDisc;
                data[index2].unitTax = unitTax;
                data[index2].unitTaxAfterDisc = unitTaxAfterDisc;
                data[index2].purchasePrice = parseFloat(data[index2].priceStd)
              }else{
                const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (data[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
                const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/data[index2].qty)
                const unitTax = parseFloat(data[index2].priceStd-(data[index2].priceStd / (1+data[index2].taxRate.rate/100)))
                const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+data[index2].taxRate.rate/100)))
                // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
                data[index2].totalDiscount=discountAmt
                data[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
                data[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
                data[index2].unitPriceAfterDisc = unitPriceAfterDisc;
                data[index2].unitTax = unitTax;
                data[index2].unitTaxAfterDisc = unitTaxAfterDisc;
                data[index2].purchasePrice = parseFloat(data[index2].priceStd)
              }
            }else{
                const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (data[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
                const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/data[index2].qty)
                const unitTax = parseFloat(data[index2].priceStd-(data[index2].priceStd / (1+data[index2].taxRate.rate/100)))
                const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+data[index2].taxRate.rate/100)))
                // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
                data[index2].totalDiscount=discountAmt
                data[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
                data[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
                data[index2].unitPriceAfterDisc = unitPriceAfterDisc;
                data[index2].unitTax = unitTax;
                data[index2].unitTaxAfterDisc = unitTaxAfterDisc;
                data[index2].purchasePrice = parseFloat(data[index2].priceStd)
            }
            
          }
            
            else{
            const grossUnitPrice = (parseFloat(data[index2].priceStd) * (data[index2].taxRate.rate)/100)+parseFloat(data[index2].priceStd)
            
            if(data[index2].taxCategory.overRideTax==="Y"){
              if(grossUnitPrice<=data[index2].taxCategory.overRideCondition){
                const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (parseFloat(data[index2].taxCategory.contraTaxCategory.contraRate)/100))+lineNetAmtAfterDisc)
                const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/data[index2].qty)
                const unitTax = parseFloat(data[index2].priceStd-(data[index2].priceStd / (1+parseFloat(data[index2].taxCategory.contraTaxCategory.contraRate)/100)))
                const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+parseFloat(data[index2].taxCategory.contraTaxCategory.contraRate)/100)))
                // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
                data[index2].totalDiscount=discountAmt
                data[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
                data[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
                data[index2].unitPriceAfterDisc = unitPriceAfterDisc;
                data[index2].unitTax = unitTax;
                data[index2].unitTaxAfterDisc = unitTaxAfterDisc;
                // data[index2].purchasePrice = data[index2].priceStd
                data[index2].purchasePrice = parseFloat(lineNetAmtAfterDisc/data[index2].qty)
              }else{
                const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (data[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
                const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/data[index2].qty)
                const unitTax = parseFloat(data[index2].priceStd-(data[index2].priceStd / (1+data[index2].taxRate.rate/100)))
                const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+data[index2].taxRate.rate/100)))
                // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
                data[index2].totalDiscount=discountAmt
                data[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
                data[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
                data[index2].unitPriceAfterDisc = unitPriceAfterDisc;
                data[index2].unitTax = unitTax;
                data[index2].unitTaxAfterDisc = unitTaxAfterDisc;
                // data[index2].purchasePrice = data[index2].priceStd
                data[index2].purchasePrice = parseFloat(lineNetAmtAfterDisc/data[index2].qty)
              }
            }else{
              const lineGrossAmtAfterDisc = parseFloat((lineNetAmtAfterDisc * (data[index2].taxRate.rate/100))+lineNetAmtAfterDisc)
                const unitPriceAfterDisc = parseFloat(lineGrossAmtAfterDisc/data[index2].qty)
                const unitTax = parseFloat(data[index2].priceStd-(data[index2].priceStd / (1+data[index2].taxRate.rate/100)))
                const unitTaxAfterDisc = parseFloat(unitPriceAfterDisc-(unitPriceAfterDisc/(1+data[index2].taxRate.rate/100)))
                // totalHeaderBillAmountElse += parseFloat(lineGrossAmtAfterDisc)
                data[index2].totalDiscount=discountAmt
                data[index2].lineNetAmtAfterDisc = lineNetAmtAfterDisc;
                data[index2].lineGrossAmtAfterDisc = lineGrossAmtAfterDisc;
                data[index2].unitPriceAfterDisc = unitPriceAfterDisc;
                data[index2].unitTax = unitTax;
                data[index2].unitTaxAfterDisc = unitTaxAfterDisc;
                // data[index2].purchasePrice = data[index2].priceStd
                data[index2].purchasePrice = parseFloat(lineNetAmtAfterDisc/data[index2].qty)
            }
          }         
        }
      

        for (let index3 = 0; index3 < data.length; index3++) {
          // const element = array[index];
          totalHeaderBillAmountElse += parseFloat(data[index3].lineGrossAmtAfterDisc)
        }
        
        setHeaderBillAmount(totalHeaderBillAmountElse.toFixed(2))
        setProductData([selectedProductObject,...productData])
        form.resetFields(['productName','PPriceChange','design','orderQty','commission','size','bCode'])
        form.setFieldsValue({'margin':globalMargin})
        setSelectedProductObject({})
        setResponseProductData([])
        setBrand("")
        setHSN("")
        setCategory("")
        setMRP(0)
        setTotalTax("")
        setGridGrossAmount(0)
        setContraTaxCategoryName("")
        setContraTaxRate(0)
        setOverRideCondition(0)
        setOverRideTax("")
        setBrandTitle("")
        setProductCategoryTitle("")
        setModalNo("")
        setContraRateFlag(false)
        /* setCommissionValue(0)
        setSizeValue(0) */
      }
  }
 }else{
   message.error("Can not proceed")
 }
}

const callbackTabs = (key) =>{
  setTabKey(key)
  form.resetFields(['orderQty','bCode','design','PPriceChange','commission','size'])  
  const formFieldsData = headerform.getFieldsValue(true);
    summaryForm.setFieldsValue({
      'summbusinessunit':businessUnitName,
      'summorderdate':moment(selectedDate,dateFormat),
      'summsupplier':supplierName,
      'summsupplierAddress':supplierAddressName,
      'summdcno':formFieldsData.dcNo,
      'summsupplierinv#':formFieldsData.supplierInv,
      'summsupplierinv#date':moment(selectedSupplierEnvDate,dateFormat),
      'summsupplierAgent':agentName,
      'summbillamt':headerBillAmount,
      'summGlobalMargin':formFieldsData.globalMargin
    })
  let newArray =[]
  for (let index = 0; index < productData.length; index++) {
    const element = productData[index].qty
      if (element > 0) {
        productData[index].taxName = productData[index].taxRate.name
        newArray.push(productData[index])
      }
  }
  setPoSummaryData(newArray)
}
const poReview = () =>{
  setTabKey("13")
  form.resetFields(['orderQty','bCode','design','PPriceChange','commission'])  
  const formFieldsData = headerform.getFieldsValue(true);
  let totalDiscount=0
    summaryForm.setFieldsValue({
      'summbusinessunit':businessUnitName,
      'summorderdate':moment(selectedDate,dateFormat),
      'summsupplier':supplierName,
      'summsupplierAddress':supplierAddressName,
      'summdcno':formFieldsData.dcNo,
      'summsupplierinv#':formFieldsData.supplierInv,
      'summsupplierinv#date':moment(selectedSupplierEnvDate,dateFormat),
      'summsupplierAgent':agentName,
      'summbillamt':headerBillAmount,
      'summGlobalMargin':formFieldsData.globalMargin
    })
  let newArray =[]
  for (let index = 0; index < productData.length; index++) {
    const element = productData[index].qty
    totalDiscount += productData[index].totalDiscount
      if (element > 0) {
        productData[index].taxName = productData[index].taxRate.name
        newArray.push(productData[index])
      }
  }
  setPoSummaryData(newArray)
  setTotalDiscountValue(totalDiscount.toFixed(2))
  const countOfProducts = newArray.length
  if(countOfProducts === 0){
    message.error('Please Add Products')
  }else{
    setPoSummaryVisible(true)
  }
}

const getPrintCofirmation = (recordId,responseData,poSummaryData) => {
  const newToken = JSON.parse(localStorage.getItem("authTokens"));
  const RoleId = window.localStorage.getItem('userData')
  const docNumber = responseData.documentNo
  const productsArr = []
  for (let index = 0; index < poSummaryData.length; index++) {
    const element = poSummaryData[index];
    productsArr.push({
      ["SNO"] : index+1,
      ["BCODE"] : parseInt(element.bCode * element.qty),
      ["GROUP"] : element.brandName,
      ["BRAND"] : element.brandName,
      ["DESIGN"] : element.design,
      ["SIZE"] : element.size,
      ["QTY"] : element.qty,
      ["PQTY"] : element.qty,
      ["ORATE"] : element.mrp,
      ["RATE"] : element.mrp,
      ["COMM"] : element.commission
    })
    
  }
  
  const finalJSON = {}
  finalJSON["print_template"]="saree"
  finalJSON["products"]=productsArr

  const getHardwareController = {
    query: `query{   
      getHardwareController{        
          name
          imageUrl
          printReceipt
          weighingScale
          payment
          printBarCode
    } }`,
  }

  Axios({
    url: serverUrl,
    method: 'POST',
    async: true,
    crossDomain: true,
    data: getHardwareController,

    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${newToken}`,
      RoleId: `${RoleId.role_id}`,
    },
  }).then(response => {
    const responseFromServer = response.data.data.getHardwareController
    const actualData = responseFromServer[0]
    const {imageUrl,name,payment,printBarCode,printReceipt,weighingScale}=actualData
    Axios({
      url: `${imageUrl}printApparelBarCode`,
      method: 'POST',
      async: true,
      crossDomain: true,
      data: finalJSON,
  
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${newToken}`,
        RoleId: `${RoleId.role_id}`,
      },
    }).then(response => {
    })

  })


  
  Modal.confirm({
    title: `Purchase Order ${docNumber} Created Successfully`,
    // content: 'Do you want take Printout',
    okText: 'Ok',
    cancelText: 'Close',
    icon:null,
    onOk() {
      // getPrintPdffile(recordId)
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
  const newToken = JSON.parse(localStorage.getItem("authTokens"));
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
      Authorization: `bearer ${newToken}`,
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

const createPO = () =>{
  setLoading(true)
  const newToken = JSON.parse(localStorage.getItem("authTokens"));
  // const formFieldsData = summaryForm.getFieldsValue(true);
  const formData = form.getFieldsValue(true)
  // const headerFormData = form.getFieldsValue(true)
  // const Remarks = formFieldsData.summremarks
  const uniqueId = uuid()
      .replace(/-/g, '')
      .toUpperCase()
  const arrayForMutation = []
    const arrayForLandedCost = []
    let uomId = ''
    let productId1 = ''
    let orderQty1 = ''
    let unitPrice = ''
    let listPrice = ''
    let taxId = ''
    let description1 = ''
    // let freeqty = ''
    let margin = ''
    // let discountValue=''
    // let discountType=''
    // let totalDiscount=''
    let PLcTypeId=''
    let Value=''
    let MProductId =''
    let CsTaxId=''
    let grossStd
    // let netStd
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
  uomId = poSummaryData[index].uom.csUomId
  // grossStd = poSummaryData[index].gridGrossAmt
  grossStd = poSummaryData[index].lineGrossAmtAfterDisc
  // netStd = poSummaryData[index].netStd
  productId1 = poSummaryData[index].mProductId
  orderQty1 = poSummaryData[index].qty
  // unitPrice = poSummaryData[index].priceStd
  unitPrice = poSummaryData[index].unitPriceAfterDisc
  listPrice = poSummaryData[index].priceList
  taxId = poSummaryData[index].taxRate.csTaxID
  // totalDiscount += parseFloat(poSummaryData[index].totalDiscount)
  description1 = 
  poSummaryData[index].design === null ||
  poSummaryData[index].design === undefined ||
  poSummaryData[index].design === 'null'
      ? ''
      : poSummaryData[index].design
  margin = poSummaryData[index].margin
  arrayForMutation.push(
    `{
        productId: "${productId1}", 
        uomId: "${uomId}", 
        orderQty: ${orderQty1}, 
        unitPrice: ${unitPrice.toFixed(2)}, 
        listPrice: ${listPrice}, 
        taxId: "${taxId}", 
        description: ${description1 === undefined || description1 === null ? null : `"${description1}"`}, 
        freeqty: 0,
        margin: ${margin}, 
        discountvalue: null,
        isManual: "Y",
        discountType:null,
        totalDiscount:${(poSummaryData[index].totalDiscount).toFixed(2)},
        grossstd:${grossStd.toFixed(2)},
        netstd:${unitPrice.toFixed(2)},
        salePrice:${listPrice},
        upc:null,
        marginStd:null
        commission:${poSummaryData[index].size === undefined || poSummaryData[index].size === null ? null : `"${poSummaryData[index].size}"`},
        imageUrl:null,
        size:${poSummaryData[index].commission === undefined || poSummaryData[index].commission === null ? null : `"${poSummaryData[index].commission}"`}
    }`,
  )
}
const createPoOrder = {
  query: `mutation {
        createApparelPO(order: {
            orderId: "${uniqueId}"
            bunitId: "${bunitId}", 
            bunitLocationId: "${regionName}", 
            supplierId: "${supplierId}", 
            dateOrdered: "${moment(selectedDate).format('YYYY-MM-DD')}", 
            datePromised: "${moment(selectedSupplierEnvDate).format('YYYY-MM-DD')}", 
            isTaxIncluded: "${istaxincludedFlag}", 
            pricelistId: "${priceListId}", 
            description: null, 
            deliveryNote: "Check the price calculated", 
            supplierAddressId: ${supplierAddressId === undefined || supplierAddressId === null ? null : `"${supplierAddressId}"`}, 
            commissionRate:${formData.globalMargin === undefined || formData.globalMargin === null ? null :formData.globalMargin}
            agentId:${agentId === null || agentId === undefined ? null : `"${agentId}"`}   
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
    Authorization: `bearer ${newToken}`,
  },
}).then(response => {
  if (response.data.data !== null) {
    const Status = response.data.data.createApparelPO.type
    const messageForSuccess = response.data.data.createApparelPO.message
    if (Status === 'Success') {
      setPoSummaryVisible(false)
      const recordId = response.data.data.createApparelPO.extraParam  
      const responseData = response.data.data.createApparelPO
      form.resetFields();
      summaryForm.resetFields([
      "summbusinessunit",
      "summsupplier",
      "summsupplierAddress",
      "summdeliveryAddress",
      ]);
      headerform.resetFields();
      setBusinessUnitName('')
      setSupplierName('')
      setSupplierAddressName('')
      setGridGrossAmount(0)
      setMRP(0)
      setTotalTax("")
      // setDeliveryLocationName('')
      setLoading(false)
      getPrintCofirmation(recordId,responseData,poSummaryData)
    }else{
      message.error(messageForSuccess)
      setLoading(false)
    }
  }else{
    message.error('getting error while creating a PO')
    setLoading(false)
  }
})
}



const createPoCancel = () =>{
  setPoSummaryVisible(false)
}

const onSelectedProduct = (e,data) =>{
const newData = data.data
const productOverRideCondition = newData.taxCategory.overRideCondition===null?"":newData.taxCategory.overRideCondition
const productOverRideTax = newData.taxCategory.overRideTax
const productContraTaxRate = newData.taxCategory.contraTaxCategory===null?0:newData.taxCategory.contraTaxCategory.contraRate
const productContraTaxCategoryName = newData.taxCategory.contraTaxCategory===null?0:newData.taxCategory.contraTaxCategory.contraTaxCategoryName



setSelectedProductKey(e)
setSelectedProductObject(data.data)
setMRP(0)
// setTotalTax(0)
setGridGrossAmount(0)
setIstaxincludedFlag(data.data.pPriceList.isTaxIncluded)

setContraTaxCategoryName(productContraTaxCategoryName)
setOverRideCondition(productOverRideCondition)
setOverRideTax(productOverRideTax)
setContraTaxRate(productContraTaxRate)



form.setFieldsValue({
'design':newData.design,
'productCategoryName':newData.productCategory.name,
'brand':newData.brandName,
'HSNCode':newData.hsnName,
'orderQty':newData.qty,
'PPriceChange':newData.priceStd,
'taxName':newData.taxCategory.name,
// 'margin':newData.margin,
'commission':newData.commission,
'grossAmount':newData.grossAmount,
'mrp':newData.priceList,
})
// setTotalTax(newData.taxCategory.name === "NaN" ? 0 : newData.taxCategory.name) 
setTotalTax(newData.taxCategory.name) 
setBrand(newData.brandName)
setCategory(newData.productCategory.name)
}

useEffect(() => {
  if (debouncedSearchKey) {
    getProducts(debouncedSearchKey===undefined?"":debouncedSearchKey,bunitId,supplierId)
  }
}, [debouncedSearchKey]);

const getSearchData = (searchText) => {
  setSearchkey(searchText)
}

    const taxNameArray =[]
    let orderQuantityCount = 0
    let orderQuantity = 0
    let freeQty = 0
    let totalOrderQty = 0
    let totalDiscountAmount = 0
    let billAmount = 0
    for (let index = 0; index < poSummaryData.length; index += 1) {
      orderQuantity = poSummaryData[index].qty
      const integer = parseInt(orderQuantity, 10)
      orderQuantityCount += integer
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

for (let index = 0; index < productData.length; index++) {
  billAmount += parseFloat(productData[index].lineGrossAmtAfterDisc);
}

for (let index = 0; index < otherCostData.length; index++) {
  billAmount += parseFloat(otherCostData[index].costPrice);
}
useEffect(() => {
  setHeaderBillAmount(billAmount.toFixed(2))
  /* headerform.setFieldsValue({
  'billAmout':billAmount
}) */
}, [billAmount])
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
          <Form.Item name="summorderdate" label="Order Date">
            <DatePicker disabled style={{ borderLeft: "none", borderTop: "none", borderRight: "none", width: "100%" }} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={6}>
          <Form.Item name="summsupplierAddress" label="Supplier Address">
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
          <Form.Item name="summdcno" label="DC No">
            <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={6}>
          <Form.Item name="summsupplierinv#" label="Supplier Inv#">
            <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={6}>
          <Form.Item name="summsupplierinv#date" label="Supplier Inv# Date">
            <DatePicker disabled style={{ borderLeft: "none", borderTop: "none", borderRight: "none", width: "100%" }} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={6}>
          <Form.Item name="summsupplierAgent" label="Agent">
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
          <Form.Item name="summbillamt" label="Bill Amount">
            <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={6}>
          <Form.Item name="summGlobalMargin" label="Global Margin">
            <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
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
        <h4>Total Discount: {totalDiscountValue}</h4>
      </Col>
      <Col className="gutter-row" span={6}>
        <h4>Total Quantity: {totalOrderQty}</h4>
      </Col>
      <Col className="gutter-row" span={6}>
        <h4>Total Amount: {headerBillAmount}</h4>
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


const addNewSupplier=()=>{
  
  setSupplierPopupVisible(true)
}

const cancelSupplierPopup=()=>{
  setSupplierPopupVisible(false)
  addSupplierForm.resetFields()
}

const addSupplier=()=>{
  addSupplierForm.submit();
  // setSupplierPopupVisible(false)
}

const getSupplierCategoryData=async()=>{
  const supplierCategoryResponse = await getSupplierCategory()
  setSupplierCategoryDropdownData(supplierCategoryResponse)
}

const getSupplierRegionData=async()=>{
  const clientId = usersData.cs_client_id
  const supplierRegionResponse = await getSupplierRegion(clientId)
  setSupplierRegionDropdownData(supplierRegionResponse)
}

const onFinish = (values) => {
  try {
    const clientId = usersData.cs_client_id
    const userId = usersData.user_id;
    const newToken = JSON.parse(localStorage.getItem("authTokens"));
    const upsertSupplierQuery = {
      query: `mutation{
        upsertSupplier(
          supplier:{
            cSBunitID:"0",
            name:"${values.name}",
            pSupplierCategoryId:"${values.supplierCategory}",
            gstNo:${values.gstno===null || values.gstno===undefined ?null:`"${values.gstno}"`},
            sAddress1:${values.addLineOne===null || values.addLineOne===undefined ?null:`"${values.addLineOne}"`},
            sAddress2:${values.addLineTwo===null || values.addLineTwo===undefined ?null:`"${values.addLineTwo}"`},
            sAddress3:${values.addLineThree===null || values.addLineThree===undefined ?null:`"${values.addLineThree}"`},
            sCity:${values.city===null || values.city===undefined ?null:`"${values.city}"`},
            sRegionId:${values.supplierRegion===null || values.supplierRegion===undefined ?null:`"${values.supplierRegion}"`},
            sEmail:${values.email===null || values.email===undefined ?null:`"${values.email}"`},
            sPostalCode:${values.postalCode===null || values.postalCode===undefined ?null:`"${values.postalCode}"`},   
            sContactNo:${values.phone===null || values.phone===undefined ?null:`"${values.phone}"`},
            createby: "${userId}",
            updateby: "${userId}",
            cSClientID:"${clientId}",
            supplierCode: null,
            phone: ${values.phone===null || values.phone===undefined ?null:`"${values.phone}"`}     
          
        })
      {
        supplierId
        supplierName
        supplierAddressId
        isTaxIncluded
        status
        message
        }
      }`,
    };

    Axios({
      url: serverUrl,
      method: 'POST',
      data: upsertSupplierQuery,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${newToken}`,
      },
    }).then(response => {
      const upsertSupplierResponse = response.data.data.upsertSupplier
      if(upsertSupplierResponse.status==="200"){
        message.success(upsertSupplierResponse.message)
        setSupplierPopupVisible(false)
        getSuppliers()
        getSupplierAdd(upsertSupplierResponse.supplierId)
        headerform.setFieldsValue({'supplier':upsertSupplierResponse.supplierName})
        // summaryForm.setFieldsValue({'summsupplier':upsertSupplierResponse.supplierName})
        setIstaxincludedFlag(upsertSupplierResponse.isTaxIncluded)
        setSupplierName(upsertSupplierResponse.supplierName)
        setSupplierId(upsertSupplierResponse.supplierId)
        // setSupplierAddressName(upsertSupplierResponse.supplierName)
        addSupplierForm.resetFields()
      }else if(upsertSupplierResponse.status==="201"){
        message.error(upsertSupplierResponse.message)
        setSupplierPopupVisible(false)
        // addSupplierForm.resetFields()
      }
    })
    
  } catch (error) {
    const { message } = JSON.parse(JSON.stringify(error));
    if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
      generateToken();
    } else {
      return Promise.reject(error);
    }
  }
};


const addNewProduct=()=>{
  setProductPopupVisible(true)
}

const cancelProductPopup=()=>{
  setProductPopupVisible(false)
  addProductForm.resetFields()
}

const addProduct=()=>{
  addProductForm.submit();
  // setProductPopupVisible(false)
}

const getUOMData=async()=>{
  const clientId = usersData.cs_client_id
  const uomResponse = await getUOM(clientId)
  setUOMDropdownData(uomResponse)
}

const getProductCategoryData=async()=>{
  const productCategoryResponse = await getProductCategory()
  setProductCategoryDropdownData(productCategoryResponse)
}

const onSelectProductCategory=(e,title)=>{
  setProductCategoryTitle(title.children)
  addProductForm.setFieldsValue({"productName":`${modalNo} ${title.children} ${brandTitle}`})
}

const getBrandData=async()=>{
  const clientId = usersData.cs_client_id
  const brandResponse = await getBrand(clientId)
  setBrandDropdownData(brandResponse)
}

const getBrandDataTitle=(e,title)=>{
  setBrandTitle(title.children)
  addProductForm.setFieldsValue({"productName":`${modalNo} ${productCategoryTitle} ${title.children}`})
}

const onChangeModalNo=(e)=>{
  setModalNo(e.target.value)
  addProductForm.setFieldsValue({"productName":`${e.target.value} ${productCategoryTitle} ${brandTitle}`})
}

const getTaxCategoryData=async()=>{
  const clientId = usersData.cs_client_id
  const taxCategoryResponse = await getTaxCategory(clientId)
  setTaxCategoryDropdownData(taxCategoryResponse)
}

const onFinishProduct=(values)=>{
  try {
    const newToken = JSON.parse(localStorage.getItem("authTokens"));
    const upsertProductQuery = {
      query: `mutation { 	
          createProduct(product : { 		
          searchKey : null, 		
          name : "${values.productName}", 		
          primeSupplierId : ${null}, 		
          uomId : "${values.uom}", 		
          productCategoryId : "${values.productCategory}", 		
          taxCategoryId : ${values.taxCategory===null || values.taxCategory===undefined ? null :`"${values.taxCategory}"`}, 		
          upc : ${null}, 		
          salesPrice : ${values.salesPrice===null || values.salesPrice===undefined ?`"${0}"`:`"${values.salesPrice}"`}, 		
          mrp : ${values.mrp===null || values.mrp===undefined ?`"${0}"`:`"${values.mrp}"`}, 		
          costPrice : ${values.purchasePrice===null || values.purchasePrice===undefined ?`"${0}"`:`"${values.purchasePrice}"`},
          brandId : ${values.productBrand===null || values.productBrand===undefined ? null :`"${values.productBrand}"`},
          hsnCode : ${values.hsnCode===null || values.hsnCode===undefined ? null :`"${values.hsnCode}"`} 	
        }) { 		
          type 
          code 
          message 
          extraParam 	
        } 
      }`,
    };

    Axios({
      url: serverUrl,
      method: 'POST',
      data: upsertProductQuery,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${newToken}`,
      },
    }).then(response => {
      const upsertProductResponse = response.data.data.createProduct
      if(upsertProductResponse.code==="200"){
        const extraParams = JSON.parse(upsertProductResponse.extraParam)
        message.success(upsertProductResponse.message)
        setProductPopupVisible(false)
        getProducts()
        getSpecificProduct(extraParams.productName,bunitId,supplierId)
        setSelectedProductKey(extraParams.productId)
        form.setFieldsValue({'productName':extraParams.productName})
        
        // setSelectedProductObject(data.data)
        addProductForm.resetFields()
      }else if(upsertProductResponse.code==="201"){
        message.error(upsertProductResponse.message)
        setProductPopupVisible(false)
        // addSupplierForm.resetFields()
      }
    })
    
  } catch (error) {
    const { message } = JSON.parse(JSON.stringify(error));
    if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
      generateToken();
    } else {
      return Promise.reject(error);
    }
  }

}

const showHideHeaderFunction=()=>{
  
  if(hideHeader===false){
    setHideHeader(true)
  }else{
    setHideHeader(false)
  }
}

const onChangeGlobalMargin=(e)=>{
  setGlobalMargin(e.target.value)
  form.setFieldsValue({'margin':e.target.value})
}

    return (
      <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
        <div>
          <Row>
            <Col span={6}>
              <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>New Purchase Order(Apparel)</h2>
            </Col>
            <Col span={6} style={{ marginTop: "0.5%" }}>
              {hideHeader === true ? (
                <>
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>
                    <Tooltip title={businessUnitName}>BU | {businessUnitName.slice(0, 10).concat("...")}</Tooltip>
                  </span>
                  &emsp;
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>
                    <Tooltip title={supplierName}>Supplier | {supplierName.slice(0, 8).concat("...")}</Tooltip>
                  </span>
                </>
              ) : (
                ""
              )}
            </Col>
            <Col span={4}>
              <span style={{ float: "right" }}>
                <DatePicker onChange={getDateChange} defaultValue={moment(new Date())} format={dateFormat} bordered={false} style={{ backgroundColor: "#F2F3F6", width: "100%" }} />
              </span>
            </Col>
            <Col span={5}>
              <span style={{ fontSize: "20px", fontWeight: "600", float: "right" }}>Bill Amt | {headerBillAmount}</span>
            </Col>
            <Col span={3}>
              <Button onClick={poReview} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px", float: "right" }}>
                Review
              </Button>
            </Col>
            {/* <Col span={18}>
              <span style={{ float: "right" }}>
              {hideHeader===true?<><span style={{fontSize:"14px",fontWeight:"600"}}>BU | {businessUnitName}</span>&emsp;<span style={{fontSize:"14px",fontWeight:"600"}}>Supplier | {supplierName}</span></>:''}&emsp;&emsp;
              <span style={{ fontSize: "15px" }}><DatePicker onChange={getDateChange} defaultValue={moment(new Date())} format={dateFormat} bordered={false} style={{backgroundColor:"#F2F3F6",width:"30%"}} /></span>&emsp;&emsp;&emsp;&emsp;
                <span style={{ fontSize: "20px",fontWeight:"600" }}>Bill Amt | {headerBillAmount}</span>
                &emsp;
                <span>
                  <Button onClick={poReview} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }}>
                    Review
                  </Button>
                </span>
              </span>
            </Col> */}
          </Row>
          <Card style={{ marginBottom: "8px", display: hideHeader === true ? "none" : "block" }}>
            <Form layout="vertical" form={headerform} name="control-hooks" onFinish={onFinish}>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="businessUnit" label="Business Unit" style={{ marginBottom: "8px" }}>
                    <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onFocus={getBusinessUnit}
                      onSelect={onSelectBusinessUnit}
                    >
                      {bunitData.map((data, index) => (
                        <Option key={data.recordid} value={data.recordid} title={data.name}>
                          {data.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    name="supplier"
                    label={
                      <span>
                        Supplier{" "}
                        <a role="presentation" style={{ cursor: "pointer" }} onClick={addNewSupplier}>
                          +
                        </a>
                      </span>
                    }
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
                        <Option key={data.recordid} value={data.recordid} title={data.name} istaxflag={data.isTaxIncluded} pricelistid={data.p_pricelist_id}>
                          {data.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                {/* <Col className="gutter-row" span={6}>
                  <Form.Item name="headerDate" label="Date" style={{ marginBottom: "8px" }}>
                    <DatePicker style={{ width: "100%" }} onChange={getDateChange} />
                  </Form.Item>
                </Col> */}

                <Col className="gutter-row" span={6}>
                  <Form.Item name="supplierInv" label="Supplier Inv#" style={{ marginBottom: "8px" }}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="supplierEnnvDate" label="Supplier Inv# Date" style={{ marginBottom: "8px" }}>
                    <DatePicker onChange={getsupplierDateChange} style={{ width: "100%" }} format={dateFormat} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="dcNo" label="DC No" style={{ marginBottom: "8px" }}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="agent" label="Agent" style={{ marginBottom: "8px" }}>
                    <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onSelect={onAgentChange}
                      onFocus={getAgent}
                    >
                      {agentData.map((data, index) => (
                        <Option key={data.agentId}>{data.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                {/* <Col className="gutter-row" span={6}>
                  <Form.Item name="billAmout" label="Bill Amount" style={{ marginBottom: "8px" }}>
                    <Input readOnly type="number" />
                  </Form.Item>
                </Col> */}
                <Col className="gutter-row" span={6}>
                  <Form.Item name="globalMargin" label="Global Margin" style={{ marginBottom: "8px" }}>
                    <Input type="number" onChange={onChangeGlobalMargin} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="totalDiscount" label="Total Discount" onChange={onChangeTotalDiscount}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <div>
            <Tabs
              defaultActiveKey={tabKey}
              onChange={callbackTabs}
              type="card"
              tabBarStyle={{ marginBottom: "0px" }}
              tabBarExtraContent={
                <div>
                  <span style={{ color: "#597380" }}>Brand:{brand}</span>&nbsp;|
                  <span style={{ color: "#597380" }}>&nbsp;HSN:{HSN}</span>&nbsp;|
                  <span style={{ color: "#597380" }}>&nbsp;Category:{productCategory}</span>
                  &emsp;&emsp;&emsp;&emsp;&emsp;
                  <span style={{ color: "#597380" }}>MRP: {MRP}</span>&nbsp;|<span style={{ color: "#597380" }}>&nbsp;Tax: {contraRateFlag===true?contraTaxCategoryName:totalTax}</span>&nbsp;|
                  <span style={{ color: "#597380" }}>&nbsp;Gross Amount: {gridGrossAmount}</span>&emsp;&emsp;
                  <span>
                    <Button size="small" onClick={addRecordToLine} style={{ backgroundColor: "#FFFFFF", color: "#717172" }}>
                      + Add
                    </Button>
                    &nbsp;
                    <Button size="small" style={{ cursor: "pointer" }} onClick={showHideHeaderFunction} style={{ backgroundColor: "#FFFFFF", color: "#717172" }}>
                      {hideHeader === true ? <DownOutlined /> : <UpOutlined />}
                    </Button>
                  </span>
                </div>
              }
            >
              <TabPane tab="Products" key="10">
                <Card style={{ marginBottom: "8px" }}>
                  <Form layout="vertical" form={form} name="editable-form" onFinish={onFinish}>
                    <Row gutter={16}>
                      <Col className="gutter-row" span={3}>
                        <Form.Item
                          name="productName"
                          label={
                            <span>
                              Product{" "}
                              <a role="presentation" style={{ cursor: "pointer" }} onClick={addNewProduct}>
                                +
                              </a>
                            </span>
                          }
                          style={{ marginBottom: "8px" }}
                        >
                          <Select
                            allowClear
                            dropdownMatchSelectWidth={false}
                            showSearch
                            value={setSearchInput}
                            onSearch={getSearchData}
                            onSelect={onSelectedProduct}
                            // options={responseProductData}
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          >
                            {responseProductData.map((data, index) => (
                              <Option key={data.key} data={data}>
                                {data.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={3}>
                        <Form.Item name="design" label="Design#" style={{ marginBottom: "8px" }}>
                          <Input onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={3}>
                        <Form.Item name="size" label="Size" style={{ marginBottom: "8px" }}>
                          <Input  onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={3}>
                        <Form.Item
                          name="orderQty"
                          label="Qty"
                          style={{ marginBottom: "8px" }}
                          rules={[
                            {
                              required: true,
                              message: "please enter qty",
                            },
                          ]}
                        >
                          <Input onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={3}>
                        <Form.Item
                          name="bCode"
                          label="B Code"
                          style={{ marginBottom: "8px" }}
                          rules={[
                            {
                              required: true,
                              message: "please enter b code",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={3}>
                        <Form.Item
                          name="PPriceChange"
                          label="P Price"
                          style={{ marginBottom: "8px" }}
                          rules={[
                            {
                              required: true,
                              message: "please enter price",
                            },
                          ]}
                        >
                          <Input onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={3}>
                        <Form.Item
                          name="margin"
                          label="Margin"
                          style={{ marginBottom: "8px" }}
                          rules={[
                            {
                              required: true,
                              message: "please enter margin",
                            },
                          ]}
                        >
                          <Input onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col>

                      <Col className="gutter-row" span={3}>
                        <Form.Item name="commission" label="Commission" style={{ marginBottom: "8px" }}>
                          <Input onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col>

                      

                      {/* <Col className="gutter-row" span={6}>
                        <Form.Item name="HSNCode" label="HSN" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Form.Item name="productCategoryName" label="Category" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col> */}
                    </Row>
                    {/* <Row gutter={16}>
                      <Col className="gutter-row" span={6}>
                        <Form.Item name="brand" label="Brand" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Form.Item name="mrp" label="MRP" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Form.Item name="taxName" label="Tax" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <Form.Item name="grossAmount" label="Gross Amount" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col>
                    </Row> */}

                    {/* <Row gutter={16}>
                      <Col className="gutter-row" style={{ display: "none" }} span={4}>
                        <Form.Item name="totalTax" label="totalTax" style={{ marginBottom: "8px" }}>
                          <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <Button onClick={addRecordToLine}>Add</Button>
                      </Col>
                    </Row> */}
                  </Form>
                </Card>
                <Card>
                  <MainTable key="64" gridData={productData} getSelectedRecord={getSelectedRecord} deleteSelectedRecord={deleteSelectedRecord} />
                </Card>
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
              <TabPane tab="Summary" key="13">
                {summaryDiv}
              </TabPane>
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
            <h3 style={{ textAlign: "center" }}>Purchase Order Summary</h3>
            <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
              {summaryDiv}
            </Spin>
          </Modal>
        </div>
        <div>
          <Modal
            visible={supplierPopupVisible}
            closable={null}
            centered
            width="70%"
            footer={[
              <Button key="back" onClick={cancelSupplierPopup}>
                Cancel
              </Button>,
              <Button onClick={addSupplier}>Add</Button>,
            ]}
          >
            <h3 style={{ textAlign: "center" }}>Add Supplier</h3>
            <Card style={{ marginBottom: "0px", border: "none" }}>
              <Form layout="vertical" form={addSupplierForm} name="supplier-form" onFinish={onFinish}>
                <Row gutter={16}>
                  {/* <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Supplier Code"
                      name="supplierCode"
                      key="supplierCode"
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Supplier Code",
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </Col> */}
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Name"
                      name="name"
                      key="name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter name",
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Supplier Category"
                      name="supplierCategory"
                      key="supplierCat"
                      rules={[
                        {
                          required: true,
                          message: "Please select supplier category",
                        },
                      ]}
                    >
                      <Select
                        allowClear
                        showSearch
                        filterOption={(input, Option) => Option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onFocus={getSupplierCategoryData}
                        style={{ width: "100%" }}
                        // onSelect={onSelectSupplierCategory}
                      >
                        {supplierCategoryDropDownData.map((data, index) => (
                          <Option key={data.pSupplierCategoryId} data={data} value={data.pSupplierCategoryId}>
                            {data.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Address Line 1"
                      name="addLineOne"
                      key="addLineOne"
                      rules={[
                        {
                          required: true,
                          message: "Please enter address line one",
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
                <br />
                <Row gutter={16}>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Address Line 2"
                      name="addLineTwo"
                      key="addLineTwo"
                      rules={[
                        {
                          required: true,
                          message: "Please enter address line two",
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Address Line 3"
                      name="addLineThree"
                      key="addLineThree"
                      rules={[
                        {
                          required: false,
                          message: "Please enter address line three",
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="City"
                      name="city"
                      key="city"
                      rules={[
                        {
                          required: false,
                          message: "Please enter city",
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
                <br />
                <Row gutter={16}>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Region"
                      name="supplierRegion"
                      key="supplierRegion"
                      rules={[
                        {
                          required: true,
                          message: "Please enter supplier region",
                        },
                      ]}
                    >
                      <Select
                        allowClear
                        showSearch
                        filterOption={(input, Option) => Option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onFocus={getSupplierRegionData}
                        style={{ width: "100%" }}
                        // onSelect={onSelectSupplierCategory}
                      >
                        {supplierRegionDropDownData.map((data, index) => (
                          <Option key={data.csRegionID} data={data} value={data.csRegionID}>
                            {data.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="GST Number"
                      name="gstno"
                      key="gstno"
                      rules={[
                        {
                          required: false,
                          message: "Please enter gstno",
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Postal Code"
                      name="postalCode"
                      key="postalCode"
                      rules={[
                        {
                          required: false,
                          message: "Please enter postal code",
                        },
                      ]}
                    >
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
                <br />
                <Row gutter={16}>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Phone"
                      name="phone"
                      key="phone"
                      rules={[
                        {
                          required: true,
                          message: "Please enter phone number",
                        },
                      ]}
                    >
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item
                      label="Email"
                      name="email"
                      key="email"
                      rules={[
                        {
                          required: false,
                          message: "Please enter email",
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Modal>
        </div>

        <div>
          <Modal
            visible={productPopupVisible}
            closable={null}
            centered
            width="60%"
            bodyStyle={{ height: "200px" }}
            // style={{height:"500px"}}
            footer={[
              <Button key="back" onClick={cancelProductPopup}>
                Cancel
              </Button>,
              <Button onClick={addProduct}>Add</Button>,
            ]}
          >
            <h3 style={{ textAlign: "center" }}>Add Product</h3>
            <Card style={{ marginBottom: "0px", border: "none" }}>
              <Form layout="vertical" form={addProductForm} name="product-form" onFinish={onFinishProduct}>
                <Row gutter={16}>
                  <Col className="gutter-row" span={6}>
                    <Form.Item
                      label="Model Number"
                      name="productModalNo"
                      key="productModalNo"
                      rules={[
                        {
                          required: false,
                          message: "Please enter modal Number",
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} onChange={onChangeModalNo} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <Form.Item
                      label="Product Category"
                      name="productCategory"
                      key="productCategory"
                      rules={[
                        {
                          required: true,
                          message: "Please enter product category",
                        },
                      ]}
                    >
                      <Select
                        allowClear
                        showSearch
                        filterOption={(input, Option) => Option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onFocus={getProductCategoryData}
                        style={{ width: "100%" }}
                        onSelect={onSelectProductCategory}
                      >
                        {productCategoryDropDownData.map((data, index) => (
                          <Option key={data.mProductCategoryId} data={data} value={data.mProductCategoryId}>
                            {data.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <Form.Item
                      label="Brand"
                      name="productBrand"
                      key="productBrand"
                      rules={[
                        {
                          required: true,
                          message: "Please select brand",
                        },
                      ]}
                    >
                      <Select
                        allowClear
                        showSearch
                        filterOption={(input, Option) => Option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onFocus={getBrandData}
                        style={{ width: "100%" }}
                        onSelect={getBrandDataTitle}
                      >
                        {brandDropDownData.map((data, index) => (
                          <Option key={data.brandId} data={data} value={data.brandId}>
                            {data.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <Form.Item
                      label="Product Name"
                      name="productName"
                      key="productName"
                      rules={[
                        {
                          required: false,
                          message: "Please enter product name",
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <br />
                <Row gutter={16}>
                  <Col className="gutter-row" span={6}>
                    <Form.Item
                      label="Tax Category"
                      name="taxCategory"
                      key="taxCategory"
                      rules={[
                        {
                          required: true,
                          message: "Please enter tax category",
                        },
                      ]}
                    >
                      <Select
                        allowClear
                        showSearch
                        filterOption={(input, Option) => Option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onFocus={getTaxCategoryData}
                        style={{ width: "100%" }}
                        // onSelect={onSelectSupplierCategory}
                      >
                        {taxCategoryDropDownData.map((data, index) => (
                          <Option key={data.csTaxcategoryID} data={data} value={data.csTaxcategoryID}>
                            {data.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={4}>
                    <Form.Item
                      label="UOM"
                      name="uom"
                      key="uom"
                      rules={[
                        {
                          required: true,
                          message: "Please enter uom",
                        },
                      ]}
                    >
                      <Select
                        allowClear
                        showSearch
                        filterOption={(input, Option) => Option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onFocus={getUOMData}
                        style={{ width: "100%" }}
                        // onSelect={onSelectSupplierCategory}
                      >
                        {uomDropDownData.map((data, index) => (
                          <Option key={data.csUomId} data={data} value={data.csUomId}>
                            {data.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col className="gutter-row" span={4}>
                    <Form.Item
                      label="Purchase Price"
                      name="purchasePrice"
                      key="purchasePrice"
                      rules={[
                        {
                          required: false,
                          message: "Please enter purchase price",
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>

                  <Col className="gutter-row" span={4}>
                    <Form.Item
                      label="Sales Price"
                      name="salesPrice"
                      key="salesPrice"
                      rules={[
                        {
                          required: false,
                          message: "Please enter sales price",
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={3}>
                    <Form.Item
                      label="MRP"
                      name="mrp"
                      key="mrp"
                      rules={[
                        {
                          required: false,
                          message: "Please enter mrp",
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={3}>
                    <Form.Item
                      label="HSN"
                      name="hsnCode"
                      key="hsnCode"
                      rules={[
                        {
                          required: false,
                          message: "Please enter hsn",
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Modal>
        </div>
      </Spin>
    );
}

export default PurchaseOrderApparel