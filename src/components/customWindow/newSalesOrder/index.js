import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col, Select, Button, Modal, Spin, Table, Image, Input, DatePicker, Radio, Space, Tabs,Popover, message, InputNumber,Collapse } from "antd";
import { LoadingOutlined, PlusCircleOutlined, PrinterOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownOutlined ,MinusCircleOutlined} from "@ant-design/icons";
import { v4 as uuid } from "uuid";

import AuditTrail from "../../../assets/images/auditTrail.svg";
import Arrow from "../../../assets/images/arrow.svg";
import { getSoProductData, getAddonProductData, getRoleBusinessUnit,getSalesOrderDetailsData,getSolitaireStockData } from "../../../services/custom";
import { getOrderTypeData, getNewSalesCustomerData, getNewSalesPrice, getNewSalesRep, getCustomerAddressData, getOrderFormData, getSalesTypeData } from "../../../services/generic";
import moment from "moment";
// import { serverUrl, genericUrl } from "../../../constants/serverConfig";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import ListData from "../newSalesOrder/listData";
import "antd/dist/antd.css";
import { useWindowContext } from "../../../lib/storage";
import "../../../styles/antd.css";
import Filter from "../../../assets/images/filter.svg";
// import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import useDebounce from "../../../lib/hooks/useDebounce";


const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const dateFormat = "YYYY-MM-DD";

const NewSalesOrder = () => {
  const inputRef = React.useRef(null);

  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { windowStore } = useWindowContext();
  const windowDefinition = { ...windowStore.windowDefinition };
  const [headerform] = Form.useForm();
  const [detailsForm] = Form.useForm();
  // const [metalForm] = Form.useForm();
  const [solitaireForm] = Form.useForm();
  const [sideDiamondForm] = Form.useForm(); 
  const [variantForm]=Form.useForm();
  const [dynamicForm] = Form.useForm();
  const serverUrl = process.env.REACT_APP_serverUrl;
  const genericUrl = process.env.REACT_APP_genericUrl;
  const [colorValue, setColorValue] = useState(0);
  const [color, setColor] = useState("1");
  const [clarityValue, setClarityValue] = useState(0);
  const [clarity, setClarity] = useState("1");
  const [ringSizeValue, setRingSizeValue] = useState(0);
  const [ringSize, setRingSize] = useState("1");
  const [errorMsg, setErrorMsg] = useState(false);
  const [errorMsg1, setErrorMsg1] = useState(false);
  const [errorMsg2, setErrorMsg2] = useState(false);
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [orderTypeId, setOrderTypeId] = useState("");
  const [customerId, setCustomerID] = useState("");
  const [customerAdd, setCustomerAdd] = useState("");
  const [schDelryDate, setSchDelryDate] = useState("");
  const [price, setPrice] = useState("");
  const [salesRep, setSalesRep] = useState("");
  const [productId, setProductId] = useState("");
  const [uomId, setUomId] = useState("");
  const [taxId, setTaxId] = useState("");
  const [priceValue, setPriceValue] = useState("1");
  const [salesTypeData, setSalesTypeData] = useState([]);
  const [orderFormData, setOrderFormData] = useState([]);
  // const [tableData, setTableData] = useState([]);
  const [solitaireData, setSolitaireData] = useState([]);
  const [qtyValue, setQtyValue] = useState("1");

  const [bUnitId, setBUnitId] = useState("");
  const [value, setValue] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [detailsVisbile, setDetailsVisbile] = useState(false);
  const [isDisplayVisible, setIsDisplayVisible] = useState(false);
  const [orderTypeData, setOrderTypeData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [salesRepData, setSalesRepData] = useState([]);
  const [address, setAddress] = useState([]);
  const [metalData, setMetalData] = useState([]);
  const [diamondData,setDiamondData] = useState([])
  // const [totalPrice,setTotalPrice] = useState('')
  const [isListView,setIsListView] = useState(false)
  const [solitaireStock,setSolitaireStock] = useState([])
  const [formDynamicData,setFormDynamicData] = useState([])
  const [metalWeight,setMetalWeight] = useState([])
  const [metalWeeightVisible,setMetalWeightVisible] = useState(false)
  // const [totalPrices,setTotalPrices] = useState({'minPrice':0,'maxPrice':0})


  const [productDetails, setProductDetails] = useState([]);
  const [id, setId] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const { recordId } = useParams();  


  const [solitaireVisible,setSolitaireVisible] = useState(false) 
  const [jewelleryVisible,setJewelleryVisible] = useState(false)
  const [onClickSolitaire,setOnClickSolitaire]=useState(false)
  const [tableData,setTableData] = useState([])
  const [listViewVisible,setListViewVisible] = useState(false)
  const [changeSolitaire,setChangeSolitaire] = useState(false)


  useEffect(() => {
    if (recordId === "New_Record") {
      setIsListView(true);
      headerform.resetFields()
      setProductDetails([])
      setJewelleryVisible(false)
      setListViewVisible(false)
      const initialDate = moment(new Date()).format("YYYY-MM-DD");
      setSelectedDate(initialDate);
      setSchDelryDate(initialDate);
      headerform.setFieldsValue({
        orderDate: moment(initialDate, dateFormat),
        expectedDeliveryDate: moment(initialDate, dateFormat),
      });
      setChangeSolitaire(!changeSolitaire)
    } else if (recordId) {
      setIsListView(true);
      setLoading(true);
      salesOrderDetailsData(recordId)
    } else {
      setIsListView(false);
    }
  }, [recordId]);

  useEffect(() => {
    const initialDate = moment(new Date()).format("YYYY-MM-DD");
    setSelectedDate(initialDate);
    setSchDelryDate(initialDate);
    getBusinessUnit();
    headerform.setFieldsValue({
      orderDate: moment(initialDate, dateFormat),
      expectedDeliveryDate: moment(initialDate, dateFormat),
    });
  }, []);

  const searchKey = useDebounce(value, 500);
  useEffect(() => { 
    getSoProduct(searchKey);
  }, [searchKey]);

  useEffect(()=>{
    let array = [{
      'DSColour-E7933C2C6C744FBFB94299F65A66C0EE' : 'D',
      "colour1" :'D',
      'DSClarity-5DE648F02E564CA4A8BA392B86B6ADB1' : 'IF',
      "clarity1" : 'IF'
    }]
    let array1 = [{}]
    let array2 = [{}]
    dynamicForm.setFieldsValue({
      solitaireForm:array,
      MetalData:array1,
      sideDiamondData:array2
    })

  let array3 = [{
    'DSColour-E7933C2C6C744FBFB94299F65A66C0EE':'D',
    "colour1" :'D',
    'DSClarity-5DE648F02E564CA4A8BA392B86B6ADB1':'IF',
    "clarity1" : 'IF',
    
      }]
      variantForm.setFieldsValue({
        solitaireForm:array3
      })
  },[changeSolitaire])


 

  const salesOrderDetailsData = async (recordId) => {
    const productResponse = await getSalesOrderDetailsData(recordId);

    setLoading(false);
    headerform.setFieldsValue({
      orderType: productResponse[0].docTypeName,
      customer: productResponse[0].customerName,
      address: productResponse[0].address,
      priceList: productResponse[0].priceListName,
      salesRep: productResponse[0].salesRepName,
      orderFrom: productResponse[0].channelName,
      saleType: productResponse[0].saleTypeName,
      expectedDeliveryDate:moment(productResponse[0].dateordered),
      orderDate:moment(productResponse[0].datepromised)
      // designDescription: productResponse[0].description,
    });
    let array = []
    for(let i=0;i<productResponse[0].line?.length;i++){
      for(let ind=0;ind<productResponse[0].line[i]?.metadata?.length;ind++){
        if(productResponse[0].line[i]?.metadata[ind].key === "salesOrder_Object"){
          let data = JSON.parse(productResponse[0].line[i]?.metadata[ind].value)
          productResponse[0].line[i].productData = data.Product_data
          array.push(data.Product_data)
        }
      }
    }
    setProductDetails(array.flat())
    setOrderTypeId(productResponse[0].csDoctypeId)
    setCustomerID(productResponse[0].sCustomerId)
    setCustomerAdd(productResponse[0].sCustomerAddressId)
    setSchDelryDate(moment(productResponse[0].deliveryDate).format("DD-MM-YYYY"))
    setPrice(productResponse[0].sPricelistId)
    setSalesRep(productResponse[0].salesRepId)
  };





  const getDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const getSoProduct = async (searchKey) => {
    const soProductResponse = await getSoProductData(searchKey);
    setFilteredData(soProductResponse);
    setLoading(false);
  };

  const getAddonProduct = async (key,text) => {
    setLoading(true)
    let addonProductResponse = await getAddonProductData(key);
    if(addonProductResponse.length>0){
      setImgUrl(addonProductResponse[0]?.imageurl)
      setDescription(addonProductResponse[0]?.name)
      let metalData1 = []
      let solitaireData1 = []
      let attributeData1 = []
      let sideDiamond = []
      let metalRing 

      addonProductResponse[0]?.metaLines?.map((element)=>{
        if(element.key === "Design_Object"){
        metalRing = JSON.parse(element.value)
        }
      })
      addonProductResponse[0]?.designs.forEach((element)=>{
        if(element.name !== "DSColour"&& element.name !== "DSClarity"){
          if(element.groupName === "Metal"){
            metalData1.push(element)
          }else if(element.groupName === "Solitaire" ){
            solitaireData1.push(element)
          }else if(element.groupName === "Side Diamond " ){
            sideDiamond.push(element)
          }
          else{
            attributeData1.push(element)
          }
        }
      })

      let value =[] 
      let string = false
      metalData1.map((element)=>{
        if(element.name === "Ring Size"){
        value = element.value.split(",")
        string = true
        }
      })
      let finalArry = []
      metalRing.map((item)=>{
        value.map((element)=>{
          if(item.ringSize === Number(element) ){
            finalArry.push(item)
          }
        })
      })
      metalData1.map((item)=>{
        if(string === true && item.name === "SKU Weight (gm)"){
          item.value = ""
        }
      })


        setMetalWeightVisible(string)
      setMetalWeight(finalArry)
      setLoading(false)
      setIsDisplayVisible(false);
      setDetailsVisbile(!detailsVisbile);
      setMetalData(metalData1)
      setSolitaireData(solitaireData1)
      setDiamondData(sideDiamond)
      if(text){
        dynamicForm.setFieldsValue(text.dynamicData);
        setModalVisible(true);
        setDetailsVisbile(false);
      }
      
    }
    

  };

  const getSideDiamondPrice = (name)=>{
    const fieldValues = dynamicForm.getFieldsValue(true)
    const arrayForMutation = []
    let flag = false
    let number =0
    let number1 = 0
    Object.entries(fieldValues.sideDiamondData[name]).map((item)=>{
      if(item[0].includes('-')  ){
        let id = item[0].split('-')
        if(item[0] === "SD Pieces-2492C7CAAC004527ADB8BBC08099787A"){
          number = 1
        }else if(item[0] === "SD Carat-7A0D9292A8814762BC0B7F4A4B4BEBBD"){
          number1 = 1
        }
        else{
          arrayForMutation.push(`{
            designAttributeId: "${id[1]}",
            value: "${item[1].trim()}"
          }`);
        }
              
      }
      if(arrayForMutation.length + number + number1 === diamondData.length ){
        flag = true
      }
      })
      if(flag === true){
        getPriceData(arrayForMutation,"diamond",name)

      }
  }

  const getMetalPrice =(name)=>{
    const fieldValues = dynamicForm.getFieldsValue(true)
        const arrayForMutation = []
        let flag = false
        let number = 0
        let finalFlag = true
        let isFlag = {one:true,two:true}
        metalData.map((item)=>{
          if(item.name === "SKU Weight (gm)" && isFlag.one){
            number = number + 1
          }
          if(item.name ===  "Ring Size" && isFlag.two){
            number = number +1
            finalFlag = false
          }
        })

        Object.entries(fieldValues.MetalData[name]).map((item)=>{
          if(item[0].includes('-')  ){
            let id = item[0].split('-')
                  arrayForMutation.push(`{
                    designAttributeId: "${id[1]}",
                    value: "${item[1].trim()}"
                  }`);
          }
          if(arrayForMutation.length + number  === metalData.length && finalFlag === true ? true : fieldValues.MetalData[name]["ringSize"] !== undefined ? true : false){
            flag = true
          }
          })
          if(flag === true){
            getPriceData(arrayForMutation,"metalData",name)

          }
  }

  const getSolitairePrice = (type,name)=>{ 
  const solitaireValue = variantForm.getFieldsValue(true)
  const formData = dynamicForm.getFieldsValue(true)

if(type === 'solitaire'){
      const arrayForMutation = []
      let array = ["D","E","F","G","H","I"]
      let clarityArry = ["IF","VVS1","VVS2","VS1","VS2","SI1","SI2"]
      let finalColour = array.slice(array.indexOf(formData.solitaireForm[name]['DSColour-E7933C2C6C744FBFB94299F65A66C0EE']),array.indexOf(formData.solitaireForm[name].colour1)+1)
      let finalClarity = clarityArry.slice(clarityArry.indexOf(formData.solitaireForm[name]['DSClarity-5DE648F02E564CA4A8BA392B86B6ADB1']), clarityArry.indexOf(formData.solitaireForm[name].clarity1)+1)
      let flag = "N"
      let number = 0
      Object.entries(formData.solitaireForm[name]).map((item,index)=>{
        
        if(item[0].includes('-') ){
          let id = item[0].split('-')
          if(item[0] === "DSColour-E7933C2C6C744FBFB94299F65A66C0EE"){
            arrayForMutation.push(`{
              designAttributeId: "${id[1]}",
              value: "${finalColour.toString()}"
            }`)
          }else if(item[0] === "DSClarity-5DE648F02E564CA4A8BA392B86B6ADB1"){
            arrayForMutation.push(`{
              designAttributeId: "${id[1]}",
              value: "${finalClarity.toString()}"
            }`)
          }else if(item[0] === "Solitaire PCs-3630CC856CF8419492EB8DA7B56B8F19"){
            number = 1
          }else{
            arrayForMutation.push(`{
              designAttributeId: "${id[1]}",
              value: "${item[1]}"
            }`)
          }
          }
        let length = solitaireData.length + 2
          if(arrayForMutation.length + number === length){
            flag = "Y"
        }
        })
        if(flag === "Y"){
          getPriceData(arrayForMutation,"solitaire",name)
        }
}

if(type === 'solitaire1'){
  let array = ["D","E","F","G","H","I"]
      let clarityArry = ["IF","VVS1","VVS2","VS1","VS2","SI1","SI2"]
      let finalColour = array.slice(array.indexOf(solitaireValue.solitaireForm[name]['DSColour-E7933C2C6C744FBFB94299F65A66C0EE']),array.indexOf(solitaireValue.solitaireForm[name].colour1)+1)
      let finalClarity = clarityArry.slice(clarityArry.indexOf(solitaireValue.solitaireForm[name]['DSClarity-5DE648F02E564CA4A8BA392B86B6ADB1']), clarityArry.indexOf(solitaireValue.solitaireForm[name].clarity1)+1)
      let flag ='N'
      const arrayForMutation = []
    Object.entries(solitaireValue.solitaireForm[name]).map((item)=>{
      if(item[0].includes('-') ){
        let id = item[0].split('-')
        if(item[0] === "DSColour-E7933C2C6C744FBFB94299F65A66C0EE"){
          arrayForMutation.push(`{
            designAttributeId: "${id[1]}",
            value: "${finalColour.toString()}"
          }`)
        }else if(item[0] === "DSClarity-5DE648F02E564CA4A8BA392B86B6ADB1"){
          arrayForMutation.push(`{
            designAttributeId: "${id[1]}",
            value: "${finalClarity.toString()}"
          }`)
        }
        else{
          arrayForMutation.push(`{
            designAttributeId: "${id[1]}",
            value: "${item[1]}"
          }`)
        }
        }
      if(arrayForMutation.length === 4){
        flag = 'Y'
        }
      })
      if(flag === 'Y' ){
        getPriceData(arrayForMutation,"solitaire1",name)
      }
}
  }

  const getPriceData = async(arrayForMutation,type,name)=>{
    const newToken = JSON.parse(localStorage.getItem("authTokens"));
    const headerForm = headerform.getFieldsValue(true)
    let key =Object.keys(price)
    const priceData = {
      query:`
      query{
        getAddOnProductPrice( design: {
          orderDate: "${moment(headerForm.orderDate).format("YYYY-MM-DD")}"
        attributes:[${arrayForMutation}]})  
         {
           productPrice
           productId
           taxId
           uomId
        }  
      }
      `
    }
    Axios({
      url: serverUrl,
      method: "POST",
      data: priceData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      },
    }).then((response)=>{
     let price =  response.data.data.getAddOnProductPrice[0]
     const priceArray1 = []
     let SNo = ''
     response.data.data.getAddOnProductPrice.map((element)=>{
      priceArray1.push(element.productPrice)
     })
      if(type === 'metalData'){
        let formData = dynamicForm.getFieldsValue(true)
        formData.MetalData[name]["metalPrice"]  =formData.MetalData[name]["weight"] !== '0.00' ? Math.round(formData.MetalData[name]["weight"]*price?.productPrice).toLocaleString('en-US') : Math.round(price?.productPrice).toLocaleString('en-US')
        dynamicForm.setFieldsValue({
          MetalData : formData.MetalData,
        })
        SNo = '1'
      }
      if(type === "solitaire1"){
        const priceArray = []
        response.data.data.getAddOnProductPrice.map((element)=>{
         priceArray.push(element.productPrice)
        })
        let formData = variantForm.getFieldsValue(true)
        let max = Math.max(...priceArray)
        let min = Math.min(...priceArray)
        let data = formData.solitaireForm[name]['DSSize-1F923B776EED48F78A1E14B27330953D'].split('-')
          formData.solitaireForm[name]["addAmountRangemin"]  = Math.round(parseInt(data[0]*min)).toLocaleString('en-US')
          formData.solitaireForm[name]['addAmountRangemax'] =  Math.round(parseInt(data[1]*max)).toLocaleString('en-US')
          formData.solitaireForm[name]['priceMax'] = Math.round(parseInt(data[1]*max)).toLocaleString('en-US')
          formData.solitaireForm[name]['priceMin'] = Math.round(parseInt(data[0]*min)).toLocaleString('en-US')
            formData.solitaireForm[name]['productId'] = price?.productId
            formData.solitaireForm[name]['taxId'] = price?.taxId
            formData.solitaireForm[name]['uomId'] = price?.uomId
        variantForm.setFieldsValue({
          solitaireForm : formData.solitaireForm
        })
      }

      if((type === "solitaire")){
        let formData = dynamicForm.getFieldsValue(true)
          if(response.data.data.getAddOnProductPrice.length>0){
            let max = Math.max(...priceArray1)
            let min = Math.min(...priceArray1)
            let data = formData?.solitaireForm[name]['DSSize-1F923B776EED48F78A1E14B27330953D']?.split('-')
            let solitairePic = 1
            // let solitairePic = Number(formData.solitaireForm[name]['DSSize-1F923B776EED48F78A1E14B27330953D']) !== undefined ? Number(formData.solitaireForm[name]['DSSize-1F923B776EED48F78A1E14B27330953D']) !== null ? Number(formData.solitaireForm[name]['DSSize-1F923B776EED48F78A1E14B27330953D']) 
            if(formData.solitaireForm[name]['Solitaire PCs-3630CC856CF8419492EB8DA7B56B8F19'] !== undefined && formData.solitaireForm[name]['Solitaire PCs-3630CC856CF8419492EB8DA7B56B8F19'] !== null){
              solitairePic = formData?.solitaireForm[name]['Solitaire PCs-3630CC856CF8419492EB8DA7B56B8F19']
            }
            formData.solitaireForm[name]["minPrice"] = data!== undefined ? Math.round(parseInt(data[0]*min*solitairePic))?.toLocaleString('en-US') : ""
            formData.solitaireForm[name]['maxPrice'] = data!== undefined ? Math.round(parseInt(data[1]*max*solitairePic))?.toLocaleString('en-US') : ""

            dynamicForm.setFieldsValue({
              solitaireForm : formData.solitaireForm,
            })
          }
          SNo = '1'
      }
      if(type === "diamond"){
        let formData = dynamicForm.getFieldsValue(true)
        let sideDiamondPic = 1
        let SDclarity = 1
        if(formData.sideDiamondData[name]['SD Pieces-2492C7CAAC004527ADB8BBC08099787A'] !== undefined && formData.sideDiamondData[name]['SD Pieces-2492C7CAAC004527ADB8BBC08099787A'] !== null){
          sideDiamondPic = formData.sideDiamondData[name]['SD Pieces-2492C7CAAC004527ADB8BBC08099787A']
        }
        if(formData.sideDiamondData[name]['SD Carat-7A0D9292A8814762BC0B7F4A4B4BEBBD'] !== undefined && formData.sideDiamondData[name]['SD Carat-7A0D9292A8814762BC0B7F4A4B4BEBBD'] !== null){
          SDclarity = formData.sideDiamondData[name]['SD Carat-7A0D9292A8814762BC0B7F4A4B4BEBBD']
        }
        formData.sideDiamondData[name]["price"]  = Math.round(price?.productPrice *sideDiamondPic * SDclarity).toLocaleString('en-US')
        dynamicForm.setFieldsValue({
          sideDiamondData : formData.sideDiamondData,
        })
        SNo = '1'
      }
      if(response.data.data.getAddOnProductPrice.length >0){
      getTotalPrices(SNo)
      }
    })
  }

  const getTotalPrices=(SNo)=> {
    if(SNo === '1'){
      const fieldsData = dynamicForm.getFieldsValue(true)
      let totalMaxPrice = 0
      let totalMinPrice = 0
      if(Object.keys(fieldsData.solitaireForm[0]).length>4){
        for(let i=0;i<fieldsData.solitaireForm.length;i++){
          totalMinPrice = totalMinPrice + fieldsData.solitaireForm[i].minPrice === undefined ? 0 : parseFloat(fieldsData.solitaireForm[i]?.minPrice?.replaceAll(/,/g, ""))
          totalMaxPrice = totalMaxPrice + fieldsData.solitaireForm[i].maxPrice === undefined ? 0 : parseFloat(fieldsData.solitaireForm[i]?.maxPrice?.replaceAll(/,/g, ""))
        }
      }
    
      if(Object.keys(fieldsData.MetalData[0]).length>1){
        for(let i=0;i<fieldsData.MetalData.length;i++){
          totalMinPrice = totalMinPrice + parseFloat(fieldsData.MetalData[i].metalPrice?.replaceAll(/,/g, "")) 
          totalMaxPrice = totalMaxPrice + parseFloat(fieldsData.MetalData[i].metalPrice?.replaceAll(/,/g, ""))
        }
      }

      if(Object.keys(fieldsData.sideDiamondData[0]).length>1){
        for(let i=0;i<fieldsData.sideDiamondData.length;i++){
          totalMinPrice = totalMinPrice + parseFloat(fieldsData.sideDiamondData[i].price?.replaceAll(/,/g, "")) 
          totalMaxPrice = totalMaxPrice + parseFloat(fieldsData.sideDiamondData[i].price?.replaceAll(/,/g, ""))
        }
      }

      dynamicForm.setFieldsValue({
        totalMaxPrice:totalMaxPrice.toLocaleString('en-US'),
        totalMinPrice:totalMinPrice.toLocaleString('en-US')
      })
    }
   
  }

  

  const getOrdertype = async () => {
    const orderTypeResponse = await getOrderTypeData();
    setOrderTypeData(orderTypeResponse.searchData);
  };
  const getCustomer = async () => {
    const customerDataResponse = await getNewSalesCustomerData();
    setCustomerData(customerDataResponse.searchData);
  };

  const getPrice = async () => {
    const priceDataResponse = await getNewSalesPrice();
    setPriceData(priceDataResponse.searchData);
  };
  const getOrderForm = async () => {
    const orderFromresponse = await getOrderFormData();

    setOrderFormData(orderFromresponse.searchData);
  };
  const getSalesTYpe = async () => {
    const response = await getSalesTypeData();

    setSalesTypeData(response.searchData);
  };
  const getSalesRep = async () => {
    const salesRepResponse = await getNewSalesRep();
    setSalesRepData(salesRepResponse.searchData);
  };

  // const getCustomerAddress = async (value) => {
  //   const addressResponse = await getCustomerAddressData(value);
  //   let name = [];
  //   Object.entries(addressResponse).map(([key, value]) =>
  //     name.push({ Name: value.value ? value?.value[0]?.Name : null, RecordID: value.value ? value?.value[0]?.RecordID : null })
  //   );
  //   setAddress(name);
  // };

  const getBusinessUnit = async () => {
    const userData = JSON.parse(window.localStorage.getItem("userData"));
    const businessUnitResponse = await getRoleBusinessUnit(userData.user_id);
    setBUnitId(businessUnitResponse.defaultCsBunitId);
  };

  const onSelectOrderType = (e, data) => {
    setOrderTypeId(e);
  };

  
  const onCustomerData = async(value, data) => {
    setCustomerID(value);
    // getCustomerAddress(e);
    setAddress([])
    headerform.resetFields(["address"])
    const addressResponse = await getCustomerAddressData(windowDefinition.ad_window_id,value);
    const name = [];
    Object.entries(addressResponse).map(([key, value]) =>{
     let uniq =  name.includes(value.value[0].Name)
     if(!uniq){
      name.push({ Name: value.value ? value?.value[0]?.Name : null, RecordID: value.value ? value?.value[0]?.RecordID : null })
    }})
    setAddress(name)
  };

  const getCustomerAdd = (e) => {
    setCustomerAdd(e);
  };
  const onSelectDate = (date, dateString) => {
    setSchDelryDate(dateString);
  };
  const onSalesRep = (e) => {
    setSalesRep(e);
  };
  const selectOrderForm = (e) => {
  };
  const selectsalesType = (e) => {
  };

  const onpriceData = (e, data) => {
    setPrice(e);
  };

  const cancel = () => {
    setValue("");
    setLoading(false);
    setModalVisible(false);
  // detailsForm.resetFields()
  dynamicForm.resetFields()

  };

  const confirm = () => {
    setValue("");
    setModalVisible(false);
  dynamicForm.resetFields()

  };

  const onOkay = () => {
    const uniqueId = uuid().replace(/-/g, "").toUpperCase();
    const dynamicData = dynamicForm.getFieldsValue(true)
    const solitaire = variantForm.getFieldsValue(true)
    setFormDynamicData(dynamicForm.getFieldsValue(true))
    let unitPrice = (parseFloat(dynamicData.totalMinPrice?.replaceAll(/,/g, ""))+parseFloat(dynamicData.totalMaxPrice?.replaceAll(/,/g, "")))/2
    dynamicData.unitPrice = unitPrice
    dynamicData.mProductId = productId
    let index;
    let data = [];
    index = productDetails.findIndex((element) => {
      return element.id === id;
    });
    if (index >= 0) {
      for (let i = 0; i < productDetails.length; i++) {
        if (productDetails[i].id === id) {
          productDetails[i].sku = dynamicData.sku;
          // productDetails[i].price = formFieldsData.totalPrice;
          // productDetails[i].ringSize = formFieldsData.ringSize;
          // productDetails[i].metal = formFieldsData.metal;
          productDetails[i].qty = dynamicData.qty;
          productDetails[i].solitaire = solitaire;
          productDetails[i].dynamicData = dynamicData;
          productDetails[i].productiD = productId;
        }
        setSku(dynamicData.sku)
      }
    } else {
      let newObj = {
        sku: dynamicData.sku,
        // price: formFieldsData.totalPrice,
        // ringSize: formFieldsData.ringSize,
        // metal: formFieldsData.metal,
        qty: dynamicData.qty,
        id: uniqueId,
        imgUrl: imgUrl,
        solitaire: solitaire,
        dynamicData: dynamicData,
        productID : productId,
        uomId : uomId,
        taxId:taxId
        // metalData: metalFormData,
      };
      setSku(dynamicData.sku)
      data.push(newObj);
    }
  
    setImgUrl("");
    let finalArry = [...productDetails, ...data];
    dynamicForm.resetFields();
    setLoading(false);
    setProductDetails(finalArry);
    setDetailsVisbile(true);
    setModalVisible(false);

  };


  const modalView = (e) => {
    setLoading(true)
    setValue(e.target.value);
    setModalVisible(true);
    setIsDisplayVisible(true);
    setDetailsVisbile(true);
  };


  const onChange = (e) => {
    setLoading(true);
    setValue(e.target.value);
  };

  const selectColorValue=(name,type)=> (value,key) => {
    if(type !== 'solitaire'){
      let dynamic = dynamicForm.getFieldsValue(true)
      dynamic.solitaireForm[name].colour1 = value
      setColorValue(parseInt(key.key));
      setColor(value);
      getSolitairePrice('solitaire',name)
    }else{
    let dynamic = variantForm.getFieldsValue(true)
    dynamic.solitaireForm[name].colour1 = value
    setColorValue(parseInt(key.key));
    setColor(value);
    getSolitairePrice('solitaire1',name)
    }
    
  };
  const selectColor=(name,type)=> (value,key) => {
      getSolitairePrice('solitaire',name)
      let int = parseInt(key.key);
      if (int >= colorValue) {
        setErrorMsg1(false);
      } else {
        setErrorMsg1(true);
      }
    
   
    setColor(value);
  };

  const selectSolitaireColor=(name,type)=> (value,key) => {
    getSolitairePrice('solitaire1',name)
    let int = parseInt(key.key);
    if (int >= colorValue) {
      setErrorMsg1(false);
    } else {
      setErrorMsg1(true);
    }
    setColor(value);
  };



  const selectClarityValue =(name,type)=> (value,key) => {
    if(type !== "solitaire"){
      let dynamic = dynamicForm.getFieldsValue(true)
      dynamic.solitaireForm[name].clarity1 = value
      setClarityValue(parseInt(key.key));
      setClarity(value);
      getSolitairePrice('solitaire',name)
    }else{
      let dynamic = variantForm.getFieldsValue(true)
      dynamic.solitaireForm[name].clarity1 = value
      setClarityValue(parseInt(key.key));
      setClarity(value);
      getSolitairePrice('solitaire1',name)
    }
  };
  

  const selectClarity=(name,type)=> (value,key) => {
    getSolitairePrice('solitaire',name)
      let int = parseInt(key.key);
      if (int >= clarityValue) {
        setErrorMsg2(false);
      } else {
        setErrorMsg2(true);
      }
    setClarity(value);
  };

  const selectSolitaireClarity=(name,type)=> (value,key) => {
    getSolitairePrice('solitaire1',name)
      let int = parseInt(key.key);
      if (int >= clarityValue) {
        setErrorMsg2(false);
      } else {
        setErrorMsg2(true);
      }
    setClarity(value);
  };

  const selectRingSizeValue = (value) => {
    setRingSizeValue(parseInt(value));
    setRingSize(value);
  };
  const selectRingSize = (value) => {
    let int = parseInt(value);
    setRingSize(value);
    if (int > ringSizeValue) {
      setErrorMsg(false);
    } else {
      setErrorMsg(true);
    }
  };

  const getFieldData = (data) => {
    setValue("");
    setUomId(data.uom.csUomId);
    setProductId(data.mProductId);
    detailsForm.resetFields(["ringSize", "metal", "qty"]);
    detailsForm.setFieldsValue({
      sku: data.name,
      price: data.productAddons[0]?.price,
      qty: priceValue,
    });
  };

  const editProduct = (text) => {
    
    setId(text.id);
    setImgUrl(text.imgUrl);
    setSku(text.sku)
    getAddonProduct(text.productID.toString(),text);

  };

  const onFinish = () => {
    // setLoading();
  };
  const getValue = (e) => {
    // setMetalValue(e.target.value);
  };

  const changePrice = (e) => {
    setPriceValue(e.target.value);
  };

  const deleteRow = (e) => {
    const dataSource = [...productDetails];
    let newData = [];
    dataSource.filter((item) => {
      if (item.id !== e.id) {
        newData.push(item);
      }
    });
    setProductDetails(newData);
  };
  const selectRow = (record) => {
        dynamicForm.resetFields()
        setSku(record.value)
        setChangeSolitaire(!changeSolitaire)
        // metalForm.resetFields()
        dynamicForm.setFieldsValue({
          sku : record.value
        })
        solitaireForm.resetFields()
        setTaxId(record.taxRate.csTaxID);
        getFieldData(record);
        getAddonProduct(record.mProductId);
     
  };
  useEffect(() => {
    inputRef.current?.focus({
      cursor: "end",
    });
  }, [modalView]);

  const sharedProps = {
    ref: inputRef,
  };

  const getQtyValue = (e) => {
    setQtyValue(e);
    const fieldsData = dynamicForm.getFieldsValue(true)
    let totalMaxPrice = 0
    let totalMinPrice = 0
    if(Object.keys(fieldsData.solitaireForm[0]).length>1){
      for(let i=0;i<fieldsData.solitaireForm.length;i++){
        totalMinPrice = totalMinPrice + parseFloat(fieldsData.solitaireForm[i]?.minPrice.replaceAll(/,/g, ""))
        totalMaxPrice = totalMaxPrice + parseFloat(fieldsData.solitaireForm[i]?.maxPrice.replaceAll(/,/g, ""))
      }
    }
  
    if(Object.keys(fieldsData.MetalData[0]).length>1){
      for(let i=0;i<fieldsData.MetalData.length;i++){
        totalMinPrice = totalMinPrice + parseFloat(fieldsData.MetalData[i].metalPrice?.replaceAll(/,/g, "")) 
        totalMaxPrice = totalMaxPrice + parseFloat(fieldsData.MetalData[i].metalPrice?.replaceAll(/,/g, ""))
      }
    }
    if(Object.keys(fieldsData.sideDiamondData[0]).length>1){
      for(let i=0;i<fieldsData.sideDiamondData.length;i++){
        totalMinPrice = totalMinPrice + parseFloat(fieldsData.sideDiamondData[i].price?.replaceAll(/,/g, "")) 
        totalMaxPrice = totalMaxPrice + parseFloat(fieldsData.sideDiamondData[i].price?.replaceAll(/,/g, ""))
      }
    }
    totalMaxPrice = totalMaxPrice*e
    totalMinPrice = totalMinPrice*e
    dynamicForm.setFieldsValue({
      totalMaxPrice:totalMaxPrice.toLocaleString('en-US'),
      totalMinPrice:totalMinPrice.toLocaleString('en-US')
    })
  };

  const changePage =()=>{
    history.push(`/others/window/7439`)
  }

 const solitaireButton=()=>{
  setListViewVisible(false)
  setSolitaireVisible(true)
  setOnClickSolitaire(true)
  setJewelleryVisible(false)

 }

  const getData = () => {
    // CustomSalesOrder()
    headerform.validateFields().then((values) => {
      const userData = JSON.parse(window.localStorage.getItem("userData"));
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const uniqueId = uuid().replace(/-/g, "").toUpperCase();
      const solitaireFields = variantForm.getFieldsValue(true)
      if(productDetails.length>0 || Object.keys(solitaireFields.solitaireForm[0]).length>4){
        setLoading(true);
        const createPoOrder = {
          query: `mutation {
            createCustomSalesOrder (sOrder : {
                cSBunitID:"${bUnitId}"
                createdby:"${userData.user_id}"
                sOrderID:"${uniqueId}"
                csDoctypeId:"${orderTypeId}"
                orderDate:"${selectedDate}" 
                sCustomerId:"${customerId}"
                sCustomerShippingId:"${customerAdd}"
                deliveryDate:"${schDelryDate}"
                sPricelistId:"${price}"
                description:"Good"
                salesRepId:${salesRep ? `"${salesRep}"` : null}
                cwcChannelId:null
                cwrSaleTypeId:null
                deliverynotes:"Good"
                orderreference:"30"
                nettotal:10
                grosstotal:20
                taxamt:10
            }) {
            id
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
            Authorization: `bearer ${newToken}`,
          },
        }).then((response) => {
          const Status = response.data.data.createCustomSalesOrder.status;
          const messageForSuccess = response.data.data.createCustomSalesOrder.message;
          
          if (Status === "200") {
            
            let flag = false
            let obj = {}
            let recordId = response.data.data.createCustomSalesOrder.id;
            
            // const dynamicData = formDynamicData
            // const description = [sku]
            const arrayForMutation = []
            for(let ind=0; ind<productDetails.length;ind++){
              let arrayMetaData = []
              let arrayForSub = []
              let uniqId = uuid().replace(/-/g, "").toUpperCase();
              let price = ""
               let finalMetaData = []
              let finalArrayForSub = []
              if(productDetails[ind].dynamicData !== {}){
                productDetails[ind].dynamicData?.solitaireForm?.map((element)=>{
                    let uniqId2 = uuid().replace(/-/g, "").toUpperCase();
                    let name = []
                    Object.entries(element).map((item)=>{
                      let uniqId1 = uuid().replace(/-/g, "").toUpperCase();
                      if(item[0].includes('-')){
                        let text = item[0].split('-')
                        if(text[0]=== "DSShape"){
                          name.splice(0,0,`${text[0]} : ${item[1]}`)
                        }else if(text[0]=== "DSSize"){
                          name.splice(1,0,`${text[0]} : ${item[1]}`)
                        }else if(text[0]=== "DSColour"){
                          name.splice(2,0,`${text[0]} : ${item[1]}`)
                        }else if(text[0]=== "colour1"){
                          name.splice(3,0,`${text[0]} : ${item[1]}`)
                        }else if(text[0]=== "DSClarity"){
                          name.splice(4,0,`${text[0]} : ${item[1]}`)
                        }else if(text[0]=== "clarity1"){
                          return(
                            name.push(`${text[0]} : ${item[1]}`)
                        )
                        }
                    arrayMetaData.push(`{
                      sOrderLineMetaId:"${uniqId1}"
                      key: "${text[0]}"
                     value: "${item[1]}"
                      }`)
                      }
                      finalMetaData.push({
                        sOrderLineMetaId:uniqId1,
                        key: item[0],
                       value: item[1],
                       name:"solitaire"})
                    })
  
                    name.push(`price : ${element.maxPrice}`)
                    element.maxPrice = element.maxPrice.replace(/\,/g,'')
                    arrayForSub.push(`{
                      sOrderLineAddonsId:"${uniqId2}"
                       sOrderLineId:"${uniqId}"
                       name:"${name.toString()}"
                       qty:${qtyValue}
                       price:${element.maxPrice}
                    }`)
                    finalArrayForSub.push({
                      sOrderLineAddonsId:uniqId2,
                       sOrderLineId:uniqId,
                       name:name.toString(),
                       qty:qtyValue,
                       price:element.maxPrice,
                       name:"solitaire"
                    })
                    price = element.maxPrice.replace(/\,/g,'')
                  })
  
                  productDetails[ind].dynamicData?.MetalData?.map((element)=>{
                      const uniqId2 = uuid().replace(/-/g, "").toUpperCase();
                      let name = []
                      Object.entries(element).map((item)=>{
                      let uniqId1 = uuid().replace(/-/g, "").toUpperCase();
                        if(item[0].includes('-')){
                          let text = item[0].split('-')
                      name.push(`${text[0]} : ${item[1]}`)
  
                      arrayMetaData.push(`{
                        sOrderLineMetaId:"${uniqId1}"
                        key: "${text[0]}"
                       value: "${item[1]}"
                        }`)
                        }

                      finalMetaData.push({
                        sOrderLineMetaId:uniqId1,
                        key: item[0],
                        value: item[1],
                        name:"metal"
                      })
                      })
  
                      element.metalPrice = element.metalPrice.replace(/\,/g,'')
                      name.push(`price : ${element.metalPrice}`)
                      arrayForSub.push(`{
                        sOrderLineAddonsId:"${uniqId2}"
                         sOrderLineId:"${uniqId}"
                         name:"${name.toString()}"
                         qty:${qtyValue}
                         price:${Math.floor(element.metalPrice)}
                      }`)
                      finalArrayForSub.push({
                        sOrderLineAddonsId:uniqId2,
                         sOrderLineId:uniqId,
                         name:name.toString(),
                         qty:qtyValue,
                         price:Math.floor(element.metalPrice),
                         name:"metal"
                      })
                    })


                    productDetails[ind].dynamicData?.sideDiamondData?.map((element)=>{
                      const uniq = uuid().replace(/-/g, "").toUpperCase();
                      let name = []
                      Object.entries(element).map((item)=>{
                      let uniqId1 = uuid().replace(/-/g, "").toUpperCase();
                        if(item[0].includes('-')){
                          let text = item[0].split('-')
                      name.push(`${text[0]} : ${item[1]}`)
  
                      arrayMetaData.push(`{
                        sOrderLineMetaId:"${uniqId1}"
                        key: "${text[0]}"
                       value: "${item[1]}"
                        }`)
                        }

                      finalMetaData.push({
                        sOrderLineMetaId:uniqId1,
                        key: item[0],
                        value: item[1],
                        name:"diamond"
                      })
                      })
  
                      element.price = element.price.replace(/\,/g,'')
                      name.push(`price : ${element.price}`)
                      arrayForSub.push(`{
                        sOrderLineAddonsId:"${uniq}"
                         sOrderLineId:"${uniqId}"
                         name:"${name.toString()}"
                         qty:${qtyValue}
                         price:${Math.floor(element.price)}
                      }`)
                      finalArrayForSub.push({
                        sOrderLineAddonsId:uniq,
                         sOrderLineId:uniqId,
                         name:name.toString(),
                         qty:qtyValue,
                         price:Math.floor(element.price),
                         name:"diamond"
                      })
                    })
              }

              let arrayForProduct = []
  for(let i=0;i<productDetails.length;i++){
    let arrayForMetal = JSON.stringify(JSON.stringify(productDetails[i].dynamicData.MetalData)).slice(1, -1)
    let arrayForSoliatire = JSON.stringify(JSON.stringify(productDetails[i].dynamicData.solitaireForm)).slice(1, -1)
    let arrayForSideDiamond = JSON.stringify(JSON.stringify(productDetails[i].dynamicData.sideDiamondData)).slice(1, -1)
    let productData = `{\\"imgUrl\\":${`\\"${productDetails[i].imgUrl}\\"`},\\"uomId\\":${`\\"${productDetails[i].uomId}\\"`},\\"taxId\\":${`\\"${productDetails[i].taxId}\\"`},\\"sku\\":${`\\"${productDetails[i].sku}\\"`},\\"ringSize\\":${`\\"${productDetails[i].ringSize === undefined ? 0 : productDetails[i].ringSize}\\"`},\\"qty\\":${`\\"${productDetails[i].qty}\\"`},\\"dynamicData\\":{\\"MetalData\\":${arrayForMetal},\\"solitaireForm\\":${arrayForSoliatire},\\"sideDiamondData\\":${arrayForSideDiamond},\\"qty\\":${`\\"${productDetails[i].dynamicData.qty}\\"`},\\"totalMinPrice\\":${`\\"${productDetails[i].dynamicData.totalMinPrice}\\"`},\\"totalMaxPrice\\":${`\\"${productDetails[i].dynamicData.totalMaxPrice}\\"`},\\"unitPrice\\":${`\\"${productDetails[i].dynamicData.unitPrice}\\"`}},\\"productID\\":${`\\"${productDetails[i].productID}\\"`},\\"qty\\":${`\\"${productDetails[i].qty}\\"`}}`
    arrayForProduct.push(productData)
  }

  
  
              let object = `"{\\"orderedDate\\":${`\\"${selectedDate}\\"`},\\"unitprice\\":${`\\"${Math.floor(price)}\\"`},\\"qty\\":${`\\"${qtyValue}\\"`},\\"taxId\\":${`\\"${flag ? obj.taxId:taxId}\\"`},\\"csUomId\\":${`\\"${flag ? obj.uomId:uomId}\\"`},\\"mProductId\\":${`\\"${flag ? obj.productId:productId}\\"`},\\"sOrderlineID\\":${`\\"${uniqId}\\"`},\\"sOrderId\\":${`\\"${recordId}\\"`},\\"createdby\\":${`\\"${userData.user_id}\\"`},\\"cSBunitID\\":${`\\"${bUnitId}\\"`},\\"arrayMetaData\\":${JSON.stringify(JSON.stringify(finalMetaData)).slice(1, -1)},\\"arrayForSub\\":${JSON.stringify(JSON.stringify(finalArrayForSub)).slice(1, -1)},\\"Product_data\\":[${arrayForProduct}]}"`
              let uniqId0 = uuid().replace(/-/g, "").toUpperCase();
              arrayMetaData.push(`{
                sOrderLineMetaId:"${uniqId0}",
                key: "salesOrder_Object",
                value: ${object}
                }`)
                let string = productDetails[ind].dynamicData.solitaireForm[0]["DSSize-1F923B776EED48F78A1E14B27330953D"].split("-")
                let name = `${productDetails[ind].sku} ${string[0]} ${productDetails[ind].dynamicData.MetalData[0].ringSize}`
                arrayForMutation.push(`{
                  cSBunitID:"${bUnitId}"  
                  createdby:"${userData.user_id}"  
                  sOrderId:"${recordId}" 
                  sOrderlineID:"${uniqId}"
                  mProductId:"${flag ? obj.productId:productDetails[ind].productID}"
                  csUomId:"${flag ? obj.uomId:productDetails[ind].uomId}" 
                  taxId:"${flag ? obj.taxId:productDetails[ind].taxId}"
                  description: "${name}"
                  line:1
                  qty:${qtyValue}
                  unitprice:${Math.floor(price)}
                  listprice:null
                  linenet:null
                  linetax:null
                  linegross:null
                subProducts : [${arrayForSub}]
                metaData : [${arrayMetaData}]}`)
            }

            const formData = variantForm.getFieldsValue(true)
              if(Object.keys(formData.solitaireForm[0]).length>5){
                let arrayMetaData = []
              let arrayForSub = []
              let uniqId = uuid().replace(/-/g, "").toUpperCase();
              let price = ""
               let finalMetaData = []
              let finalArrayForSub = []
                formData.solitaireForm?.map((product)=>{
                  let uniqId2 = uuid().replace(/-/g, "").toUpperCase();
                  let name = []
                  Object.entries(product).map((item)=>{
                    let uniqId1 = uuid().replace(/-/g, "").toUpperCase();
                    if(item[0].includes('-')){
                      let element = item[0].split('-')
                      name.push(`${element[0]} : ${item[1]}`)
                  arrayMetaData.push(`{
                    sOrderLineMetaId:"${uniqId1}"
                    key: "${element[0]}"
                   value: "${item[1]}"
                    }`)
                    }
                    finalMetaData.push({
                      sOrderLineMetaId:uniqId1,
                      key: item[0],
                      name:"solitaire_1",
                      value: item[1]})
                  })
                  
                  product.addAmountRangemax = product.addAmountRangemax.replace(/\,/g,'')
                  name.push(`price : ${product.addAmountRangemax}`)
                  arrayForSub.push(`{
                    sOrderLineAddonsId:"${uniqId2}"
                     sOrderLineId:"${uniqId}"
                     name:"${name.toString()}"
                     qty:${qtyValue}
                     price:${Math.floor(product.addAmountRangemax)}
                  }`)
  
                  finalArrayForSub.push({
                    sOrderLineAddonsId:uniqId2,
                     sOrderLineId:uniqId,
                     name:name.toString(),
                     qty:qtyValue,
                     name:"solitaire_1",
                     price:Math.floor(product.addAmountRangemax)
                  })
                  
                    obj.productId  =formData.solitaireForm[0].productId
                    obj.uomId  = formData.solitaireForm[0].uomId
                    obj.taxId  = formData.solitaireForm[0].taxId
                  
                  // flag =true
                })

                  arrayForMutation.push(`{
                    cSBunitID:"${bUnitId}"  
                    createdby:"${userData.user_id}"  
                    sOrderId:"${recordId}" 
                    sOrderlineID:"${uniqId}"
                    mProductId:"${obj.productId}"
                    csUomId:"${obj.uomId}" 
                    taxId:"${obj.taxId}"
                    description: null
                    line:1
                    qty:${qtyValue}
                    unitprice:${202500}
                    listprice:null
                    linenet:null
                    linetax:null
                    linegross:null
                  subProducts : [${arrayForSub}]
                  metaData : [${arrayMetaData}]}`)
              }

            const orderData = {
              query: `mutation {
                upsertSalesOrderLine (sOrderLines : { sOrderLine :[${arrayForMutation}]
                }) {
                status
                message
                }
              }`,
            };
            Axios({
              url: serverUrl,
              method: "POST",
              data: orderData,
              headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${newToken}`,
              },
            }).then((response) => {
              const Status = response.data.data.upsertSalesOrderLine.status;
              if (Status === "200") {
                const data1 = {
                  query: `mutation {
                        runProcess(recordId:"${recordId}", ad_tab_id:"270EED9D0E7F4C43B227FEDC44C5858F", ad_field_id:"A15626E911C0419A92CC6ADBEE4F9649",parameters:"{}")
                          {
              messageCode,
              title,
              message
              }
                      }
                      `,
                };
                Axios({
                  url: genericUrl,
                  method: "POST",
                  data: data1,
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${newToken}`,
                  },
                }).then((response) => {
                  message.success(response.data.data.runProcess.message);
                  history.push(`/window/7004/${recordId}`);
                  headerform.resetFields();
                  setMetalData([]);
                  setSolitaireData([]);
                  setProductDetails([]);
                  setLoading(false);
                });
              } else {
                message.error(messageForSuccess);
                setLoading(false);
              }
            });
          } else {
            message.error("getting error while creating lines");
            setLoading(false);
          }
        });
      }else{
        message.error("Please add product");
      }
     
    });
  };


  const onChangesPieces=(name)=>(e)=>{
    const fieldsData = variantForm.getFieldsValue(true)
    let data = fieldsData.solitaireForm[name]
    let max = data.priceMax === undefined ? 0 : parseFloat(data.priceMax.replaceAll(/,/g,''))*e
    let min = data.priceMin === undefined ? 0 : parseFloat(data.priceMin.replaceAll(/,/g,''))*e
    fieldsData.solitaireForm[name].addAmountRangemax = max.toLocaleString('en-US')
    fieldsData.solitaireForm[name].addAmountRangemin = min.toLocaleString('en-US')
    variantForm.setFieldsValue(fieldsData)
  }



  const getJewellery=()=>{
    // setSolitaireVisible(false)
    setJewelleryVisible(true)
    setOnClickSolitaire(false)
  }

  const getSolitaireStock=async(limit,key)=>{
    const headerForm = headerform.getFieldsValue(true)
    const Response = await getSolitaireStockData(limit,key,moment(headerForm.orderDate).format("YYYY-MM-DD"));
    Response.map((element)=>{
      for(let i =0;i<element.attributes.length;i++){
        element[`${element.attributes[i].name}`] = element.attributes[i].value
        }
    })

    setSolitaireStock(Response)
    setSolitaireVisible(false)
    setListViewVisible(true)
  }

  const stockTable =[
    {
      title: "Shape",
      dataIndex: "DSShape",
      key: "DSShape",
      width: 80,
      
    },
    {
      title: "Size",
      dataIndex: "DSSize",
      key: "DSSize",
      width: 80,
      
    },

    {
      title: "Colour",
      dataIndex: "DSColour",
      key: "DSColour",
      width: 80,
      
    },
    {
      title: "Clarity",
      dataIndex: "DSClarity",
      key: "DSClarity",
      width: 80,
    },
    {
      title: "Unit Price",
      dataIndex: "productPrice",
      key: "productPrice",
      width: 80,
    },
    {
      title: "Available Qty",
      dataIndex: "qtyOnHand",
      width: 80,
      render: (text, record, index) => <InputNumber size="small" style={{ width: "95%" }} min={0} max={1000000000} value={text}  />,
    },
    {
      title: "Ordered Qty",
      dataIndex: "reqQty",
      width: 80,
      render: (text, record, index) => <InputNumber size="small" style={{ width: "95%" }} min={0} max={1000000000} value={text}  />,
    },
  ]

  const onSelectProductData = (e, data) => {
    setTableData(data);
  };
  const rowSelectionForProducts = {
    onChange: onSelectProductData,
  };


  const onSelectRing=(name)=>(e)=>{
    let weight = ''
    for(let i=0;i<metalWeight.length;i++){
      if(parseInt(e) === metalWeight[i].ringSize){
        weight = metalWeight[i].weight
      }
    }
    const dynamicData = dynamicForm.getFieldsValue(true)
    dynamicData.MetalData[name].weight = weight
    dynamicForm.setFieldsValue({
      MetalData:dynamicData.MetalData,
      sideDiamondData:dynamicData.sideDiamondData,
      solitaireForm:dynamicData.solitaireForm
    })
    getMetalPrice(name)
  }

  const SolitaireSize = ["0.10-0.13","0.14-0.17","0.18-0.22","0.23-0.29","0.30-0.38","0.39-0.44","0.45-0.49","0.50-0.59","0.60-0.69","0.80-0.89","0.90-0.99","1.00-1.23"]


  return (
    <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
      {isListView ?
      <div style={{height:'89vh', overflow:'auto'}}>
      <Row>
        <Col span={12}>
          <h2 onClick={changePage} style={{ fontWeight: "500", fontSize: "12px", color: "#1648AA", marginBottom: "0px", marginTop: "1%",cursor:'pointer' }}>New Sales Order</h2>
        </Col>
        <Col span={12}>
          <span style={{ float: "right" }}>
            <Button onClick={getData} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }}>
              Book
            </Button>
            {/* <Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }}>
              More
              <DownOutlined style={{ fontSize: "10px" }} />
            </Button> */}
          </span>
        </Col>
      </Row>

      <Card style={{ marginBottom: "8px" }}>
        <Form layout="vertical" form={headerform} onFinish={onFinish} name="headerForm" style={{ marginTop: "20px" }}>
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Form.Item
                name="orderType"
                label="Channel type"
                rules={[
                  {
                    required: true,
                    message: "Please select Order Type!",
                  },
                ]}
                style={{ color: "#8E8E8E", fontSize: "13px" }}
              >
                <Select onSelect={onSelectOrderType} onFocus={getOrdertype} style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }}>
                  {orderTypeData.map((data, index) => (
                    <Option key={data.RecordID} value={data.RecordID} title={data.Name}>
                      {data.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item name="orderId" label="Order Id" style={{ color: "#8E8E8E", fontSize: "13px" }}>
                <Input readOnly style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item name="orderDate" label="Order Date" style={{ color: "#8E8E8E", fontSize: "13px" }}>
                <DatePicker onChange={getDateChange} style={{ width: "100%", borderLeft: "none", borderTop: "none", borderRight: "none" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <p />
            <br />
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Form.Item name="expectedDeliveryDate" label="Expected Delivery Date" style={{ color: "#8E8E8E", fontSize: "13px" }}>
                <DatePicker onChange={onSelectDate} style={{ width: "100%", borderLeft: "none", borderTop: "none", borderRight: "none" }} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                name="customer"
                rules={[
                  {
                    required: true,
                    message: "Please select Customer!",
                  },
                ]}
                label="Customer"
                style={{ color: "#8E8E8E", fontSize: "13px" }}
              >
                <Select
                allowClear
                showSearch
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onSelect={onCustomerData} onFocus={getCustomer} style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }}>
                  {customerData.map((data, index) => (
                    <Option key={data.RecordID} value={data.RecordID} >
                      {data.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please select Address!",
                  },
                ]}
                label="Address"
                style={{ color: "#8E8E8E", fontSize: "13px" }}
              >
                <Select onSelect={getCustomerAdd} style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }}>
                {address.map((data, index) => (
                    <Option key={data.RecordID} value={data.RecordID} >
                      {data.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <p />
            <br />
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Form.Item
                name="priceList"
                rules={[
                  {
                    required: true,
                    message: "Please select Price List!",
                  },
                ]}
                label="Price List"
                style={{ color: "#8E8E8E", fontSize: "13px" }}
              >
                <Select onSelect={onpriceData} onFocus={getPrice} style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }}>
                  {priceData.map((data, index) => (
                    <Option key={data.RecordID} value={data.RecordID} title={data.Name}>
                      {data.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item name="salesRep" label="Sales Rep" style={{ color: "#8E8E8E", fontSize: "13px" }}>
                <Select onSelect={onSalesRep} onFocus={getSalesRep} style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }}>
                  {salesRepData.map((data, index) => (
                    <Option key={data.RecordID} value={data.RecordID} title={data.Name}>
                      {data.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item name="orderFrom" label="Order Type" style={{ color: "#8E8E8E", fontSize: "13px" }}>
                <Select onSelect={selectOrderForm} onFocus={getOrderForm} style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }}>
                  {orderFormData.map((data, index) => (
                    <Option key={data.RecordID} value={data.RecordID} title={data.Name}>
                      {data.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <p />
          <br />
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Form.Item name="saleType" label="Sale From" style={{ color: "#8E8E8E", fontSize: "13px" }}>
                <Select onSelect={selectsalesType} onFocus={getSalesTYpe} style={{ borderLeft: "none", borderTop: "none", borderRight: "none" }}>
                  {salesTypeData.map((data, index) => (
                    <Option key={data.RecordID} value={data.RecordID} title={data.Name}>
                      {data.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col> 
            <Radio.Group>
            <Space direction="horizontal">
            
            <Col className="gutter-row" style={{marginTop:'20px'}}  span={3}>
            <span >
              <Radio   value={2}
                onClick={solitaireButton} 
               >Solitaires</Radio>
            </span>
            </Col>
            <Col className="gutter-row" span={3}>
            <span>
              <Radio style={{marginTop:'20px'}} name="modal"  value={1} onClick={getJewellery} >Jewellery</Radio>
            </span>
            </Col> 
            </Space>
            </Radio.Group>

          </Row>
          <br />
        </Form>
      </Card>
       {jewelleryVisible ? 
       <Card style={{ marginBottom: "8px", height: "47px" }}>
        <Row>
          <Col className="gutter-row" span={12}>
            <span>
              <Input autoComplete={'off'} placeholder="Search" prefix={<SearchOutlined />} onChange={modalView} name="modal" value={value} />
            </span>
          </Col>
        </Row>
      </Card> : null}
      
        {onClickSolitaire? 
        <Card>
         <div >
          <Row>
            <Col span={16}/>
            <Col span={8}>
            <Radio.Group style={{float:'right'}} defaultValue={1}>
            <Space direction="horizontal">
            <Col className="gutter-row" span={3}>
            <span>
              <Radio style={{marginTop:'20px'}} name="modal"  value={1} onClick={()=>{
                setOnClickSolitaire(true)
                setSolitaireVisible(true)
                setListViewVisible(false)
                }} >Option1</Radio>
            </span>
            </Col> 
            <Col className="gutter-row" style={{marginTop:'20px'}}  span={3}>
            <span >
              <Radio value={2}
                onClick={getSolitaireStock} 
               >Option2</Radio>
            </span>
            </Col>
            </Space>
            </Radio.Group>
            </Col>
          </Row>
           <Form name="variantForm" layout="vertical" form={variantForm}>
             
        <Form.List name='solitaireForm'>
        {(fields,{add,remove})=>(
      <>
      <Row gutter={16} style={{marginBottom:'8px'}}>
                    <Col span={23}></Col>
                    <Col span={1} style={{marginTop:'3px'}} >
                      <Form.Item>
                             {listViewVisible ? '' :<span style={{marginBottom:'3px'}} >
                              <PlusCircleOutlined label="Add"  onClick={() => {
                                 setSolitaireVisible(true)
                                
                                add()
                                }}/>
                             </span>}
                      </Form.Item>
                           </Col>
                           </Row>
       {solitaireVisible ?
      <Row gutter={16}>
         <Col className="gutter-row" span={3}>
           <label >Solitare_shape</label>
         </Col>
        <Col className="gutter-row" span={3}>
           <label >Solitaire_Size</label>
         </Col>
         <Col className="gutter-row" span={3}>
           <label >Solitaire_Colour</label>
         </Col>
         <Col className="gutter-row" span={2}>
         </Col>
         <Col className="gutter-row" span={3}>
           <label>Solitaire_Clarity</label>
         </Col>
         <Col className="gutter-row" span={2}>
         </Col>
         <Col className="gutter-row" span={2}>
           <label >PCs</label>
         </Col>
         <Col className="gutter-row" span={2}>
           <label >Min_price</label>
         </Col>
         <Col className="gutter-row" span={2}>
           <label >Max_price</label>
         </Col>
         <Col className="gutter-row" span={2}>
           <label >Remarks</label>
         </Col>
         
       </Row> 
        : ''} 
        {listViewVisible ?  <Table columns={stockTable} dataSource={solitaireStock} 
          rowSelection={{
            ...rowSelectionForProducts,
            }} 
          style={{ fontSize: "12px" }}
          size="small"/> : fields.map(({key,name,...restField})=>(
            <>
            <Row gutter={16}>
            <Col span={3} className="gutter-row">
                 <Form.Item name={[name,'DSShape-7E513553A85341E3A820CEF9406A1D32']}  {...restField} style={{marginBottom:'8px'}}>
                    <Select
                      allowClear
                      showSearch
                      onSelect={()=>{getSolitairePrice('solitaire1',name)}}
                    >
                      <Option key={"1"} value={"Round"}>
                                    Round
                                    </Option>
                                    <Option key={"2"} value={"Pear"}>
                                    Pear
                                    </Option>
                                    <Option key={"3"} value={"Square"}>
                                    Square
                                    </Option>
                                    <Option key={"4"} value={"Oval"}>
                                    Oval
                                    </Option>
                                    
                  
                    </Select>
                 </Form.Item>
               </Col>
               <Col span={3} className="gutter-row">
                 <Form.Item name={[name,'DSSize-1F923B776EED48F78A1E14B27330953D']}  {...restField} style={{marginBottom:'8px'}}>
                    <Select
                      allowClear
                      showSearch
                      onSelect={()=>{getSolitairePrice('solitaire1',name)}}
                    >
                      {SolitaireSize.map((item,ind)=>{
                        return(
                        <Option key={ind} value={item}>
                        {item}
                        </Option>)
                      })}
                    </Select>
                 </Form.Item>
               </Col>
               
                        <Col className="gutter-row" span={3} >
                            <Form.Item initialValue={"D"} name={[name,'DSColour-E7933C2C6C744FBFB94299F65A66C0EE']} style={{ color: "#8E8E8E", fontSize: "13px" }}>
                              <Select  onSelect={selectColorValue(name)}>
                                    <Option key={"1"} value={"D"}>
                                    D
                                    </Option>
                                    <Option key={"2"} value={"E"}>
                                    E
                                    </Option>
                                    <Option key={"3"} value={"F"}>
                                    F
                                    </Option>
                                    <Option key={"4"} value={"G"}>
                                    G
                                    </Option>
                                    <Option key={"5"} value={"H"}>
                                    H
                                    </Option>
                                    <Option key={"6"} value={"I"}>
                                    I
                                    </Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          {/* <Col span={1} style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "28px" }}>
                            <span style={{ color: "#5D5454", fontSize: "13px",paddingTop:'2px' }}>to</span>
                          </Col> */}
                          <Col className="gutter-row" span={2} style={{ marginBottom: "-47px" }}>
                            <Form.Item  name={[name,"colour1"]} label="" validateStatus={errorMsg1 ? "error" : ""} help={errorMsg1 ? "select higher value" : ""} style={{ color: "#8E8E8E", fontSize: "13px" }}>
                              <Select defaultValue="D" value={color} onSelect={selectSolitaireColor(name,'solitaire')}>
                              <Option key={"1"} value={"D"}>
                              D
                              </Option>
                              <Option key={"2"} value={"E"}>
                              E
                              </Option>
                              <Option key={"3"} value={"F"}>
                              F
                              </Option>
                              <Option key={"4"} value={"G"}>
                              G
                              </Option>
                              <Option key={"5"} value={"H"}>
                              H
                              </Option>
                              <Option key={"6"} value={"I"}>
                              I
                              </Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={3}>
                            <Form.Item initialValue={'IF'} name={[name,"DSClarity-5DE648F02E564CA4A8BA392B86B6ADB1"]} style={{ color: "#8E8E8E", fontSize: "13px" }}>
                            <Select defaultValue={"IF"} onSelect={selectClarityValue(name,"solitaire")}>
                              <Option key={"1"} value={"IF"}>
                                  IF
                                </Option>
                                <Option key={"2"} value={"VVS1"}>
                                  VVS1
                                </Option>
                                <Option key={"3"} value={"VVS2"}>
                                  VVS2
                                </Option>
                                <Option key={"4"} value={"VS1"}>
                                  VS1
                                </Option>
                                <Option key={"5"} value={"VS2"}>
                                  VS2
                                </Option>
                                <Option key={"6"} value={"SI1"}>
                                  SI1
                                </Option>
                                <Option key={"7"} value={"SI2"}>
                                  SI2
                                </Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          {/* <Col span={1} style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "28px" }}>
                            <span style={{ color: "#5D5454", fontSize: "13px" }}>to</span>
                          </Col> */}
                          <Col className="gutter-row" span={2} style={{ marginBottom: "-44px" }}>
                            <Form.Item name={[name,"clarity1"]} validateStatus={errorMsg2 ? "error" : ""} help={errorMsg2 ? "select higher value" : ""} style={{ color: "#8E8E8E", fontSize: "13px" }}>
                              <Select defaultValue="IF" value={clarity} onSelect={selectSolitaireClarity(name)}>
                              <Option key={"1"} value={"IF"}>
                                  IF
                                </Option>
                                <Option key={"2"} value={"VVS1"}>
                                  VVS1
                                </Option>
                                <Option key={"3"} value={"VVS2"}>
                                  VVS2
                                </Option>
                                <Option key={"4"} value={"VS1"}>
                                  VS1
                                </Option>
                                <Option key={"5"} value={"VS2"}>
                                  VS2
                                </Option>
                                <Option key={"6"} value={"SI1"}>
                                  SI1
                                </Option>
                                <Option key={"7"} value={"SI2"}>
                                  SI2
                                </Option>
                              </Select>
                            </Form.Item>
                          </Col>
                     
               <Col span={2}>
                 <Form.Item initialValue={1} name={[name,'addPCs']} {...restField} style={{marginBottom:'8px'}}>
                   <InputNumber style={{width:'100%'}} onChange={onChangesPieces(name)}/>
                 </Form.Item>
               </Col>
               <Col span={2}>
                 <Form.Item  name={[name,'addAmountRangemin']} {...restField} style={{marginBottom:'8px'}}>
                   <Input readOnly/>
                 </Form.Item>
               </Col>
               <Col span={2}>
                 <Form.Item  name={[name,'addAmountRangemax']} {...restField} style={{marginBottom:'8px'}}>
                   <Input readOnly/>
                 </Form.Item>
               </Col>
               <Col span={2}>
                 <Form.Item name={[name,'addRemarks']} {...restField} style={{marginBottom:'8px'}}>
                   <Input />
                 </Form.Item>
               </Col>
             </Row>
              
              <Row style={{marginBottom:'8px',marginRight:'12px'}}>
              <Col span={22}></Col>
            <Col span={2} className='gutter-row' >
            <MinusCircleOutlined style={{float:'right'}} onClick={() => {
       if(fields.length<=1){
         setSolitaireVisible(false)
         }
       remove(name)
       }} />
                 </Col>
            </Row>
            </>
             
             )) }
            </>
          )} 
        </Form.List>
          </Form>
          </div>
          </Card>
          :null
          }
          
      {productDetails.map((product, ind) => (
        <div style={{ marginBottom: "8px" }}>
          <Card style={{height:'auto'}}>
            <Row gutter={16}>
              <Col className="gutter-row" span={3}>
                <Image src={product.imgUrl} style={{ height: "91px", width: "91px" }} />
              </Col>
              <Col className="gutter-row" span={6}>
                <h1 style={{ color: "#8E8E8E", fontSize: "13px" }}>Design</h1>
              </Col>
              <Col className="gutter-row" span={3}>
                <h1 style={{ color: "#8E8E8E", fontSize: "13px" }}>Qty</h1>
              </Col>
              <Col className="gutter-row" span={3}>
                <h1 style={{ color: "#8E8E8E", fontSize: "13px" }}>Unit Price</h1>
              </Col>
              <Col className="gutter-row" span={3} style={{ color: "#8E8E8E", fontSize: "13px" }}>Total Min Price</Col>
              <Col className="gutter-row" span={3} style={{ color: "#8E8E8E", fontSize: "13px" }}>Total Max Price</Col>
              <Col className="gutter-row" span={3} >
                <span style={{ float: "right" }}>
                  <EditOutlined style={{ paddingRight: "15px", fontSize: "18px", color: "#8E8E8E", cursor: "pointer" }} onClick={() => editProduct(product)} />
                  <DeleteOutlined onClick={() => deleteRow(product)} style={{ paddingRight: "15px", fontSize: "18px", color: "#8E8E8E", cursor: "pointer" }} />
                </span>
              </Col>
            </Row>
            <div
              style={{
                marginTop: "-74px",
              }}
            >
              <Row gutter={16}>
                <Col className="gutter-row" span={3}></Col>
                <Col className="gutter-row" span={6}>
                  <h1 style={{ fontSize: "13px" }}>{product.sku}</h1>
                </Col>
                <Col className="gutter-row" span={3}>
                  <h1 style={{ fontSize: "13px" }}>{product.qty}</h1>
                </Col>
                <Col className="gutter-row" span={3}>
                  <h1 style={{ fontSize: "13px" }}>{product.dynamicData['unitPrice']}</h1>
                </Col>
                <Col className="gutter-row" span={3}>
                <h1 style={{ fontSize: "13px" }}>{product.dynamicData['totalMinPrice']}</h1>
                </Col>
                <Col className="gutter-row" span={3}>
                <h1 style={{ fontSize: "13px" }}>{product.dynamicData['totalMaxPrice']}</h1>
                </Col>
                <Col className="gutter-row" span={3}></Col>
              </Row>
              <Row gutter={16}>

                <Col className="gutter-row" span={3}></Col>
                <Col><span>Solitaire : </span><span>{
                  product.dynamicData.solitaireForm.map((element)=>{
                    let newArry = []
                    Object.entries(element).map((item)=>{
                      let string = item[0].split('-')
                      if(string[0]=== "DSShape"){
                        newArry.splice(0,0,item[1])
                      }else if(string[0]=== "DSSize"){
                        newArry.splice(1,0,item[1])
                      }else if(string[0]=== "DSColour"){
                        newArry.splice(2,0,item[1])
                      }else if(string[0]=== "colour1"){
                        newArry.splice(3,0,item[1])
                      }else if(string[0]=== "DSClarity"){
                        newArry.splice(4,0,item[1])
                      }else if(string[0]=== "clarity1"){
                        return(
                          newArry.splice(5,0,item[1])
                      )
                      }
                    })
                    return newArry.toString().replaceAll(","," ")
})
                }</span></Col>
                </Row>
                <Row gutter={16}>

                <Col className="gutter-row" span={3}></Col>
                <Col><span>Metal : </span><span>{
                  product.dynamicData.MetalData.map((element)=>(
                    Object.entries(element).map((item)=>{
                      let string = item[0].split('-')
                      if( string[0] !== "metalPrice")
                      return(
                          <span>
                          {`${item[1]} `}
                          </span>
                      )
                    })
                  ))
                }</span></Col>
                </Row>
                <Row gutter={16}>

                <Col className="gutter-row" span={3}></Col>
                <Col><span>Diamond : </span><span>{
                  product.dynamicData.sideDiamondData.map((element)=>(
                    Object.entries(element).map((item)=>{
                      let string = item[0].split('-')
                      if( string[0] !== "price")
                      return(
                          <span>
                          {`${item[1]} `}
                          </span>
                      )
                    })
                  ))
                }</span></Col>
                
              </Row>	  
            </div>
          </Card>
        </div>
      ))}

      <Modal width="85%" centered visible={modalVisible} closable={true} okText="Save" onOk={!detailsVisbile ? onOkay : confirm} onCancel={cancel}>
        {isDisplayVisible ? (
          <Card style={{ height: "65vh" }}>
            <Input name="modal" {...sharedProps} value={value} onChange={onChange} suffix={<Popover placement="bottom" content={(<>
              <div style={{cursor:'pointer'}}>
                one
              </div>
              <div style={{cursor:'pointer'}}>
                two
              </div>
            </>)} trigger="click">
  <img src={Filter} style={{cursor:'pointer'}}/>
  </Popover> }/>
            <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
              <Row style={{height: "58vh", overflow: "scroll",overflowX:"hidden",paddingTop:'15px' }} >
              {filteredData.length > 0 ? (
                filteredData.map((item)=>(
                  <Col span={4} onClick={()=>selectRow(item)} style={{cursor:'pointer',borderWidth:'3px',borderColor:'#5D5454'}}>
                    <div>
                   <img src={item.imageurl} height="120px" width="120px"/>
                     </div>
                    <span style={{color: "#5D5454", fontSize: "13px",fontWeight:'550'}}>
                    {item.value}
                   </span>
                  </Col>
              ))
              ) : null}
              </Row>

            </Spin>
          </Card>
        ) : (
          ""
        )}

        {!detailsVisbile ? (
          <div>
            <Row>
              <Col span={7}>
                <img src={imgUrl} style={{ marginLeft: "8px", width: "300px", height: "300px" }} />
              </Col>
              <Col span={17} style={{ marginTop: "-5px", marginLeft: "-1px" }}>
                <span style={{ marginLeft: "16px", fontSize: "22px", font: "normal normal 600 22px/30px  Open Sans", color: "#666666" }}>{sku}</span>
                  <br />
                  <Form form={dynamicForm} layout="vertical">
                  <Row gutter={10} style={{marginTop:'8px',marginTop:'-30px'}}>
                    <Col span={12}></Col>
               <Col span={3} style={{marginBottom:'15px'}}>
                 <Form.Item initialValue={1} name="qty" label="Qty" style={{ color: "#8E8E8E", fontSize: "8px"}}>
                   <InputNumber size="small" onChange={getQtyValue}/>
                 </Form.Item>
               </Col>
               <Col span={4} style={{marginBottom:'15px'}}>
                 <Form.Item name="totalMinPrice" label="Total Min Price" style={{ color: "#8E8E8E", fontSize: "8px"}}>
                   <InputNumber readOnly size="small" style={{width:'100%'}}/>
                 </Form.Item>
               </Col>
               <Col span={4} style={{marginBottom:'15px'}}>
                 <Form.Item name="totalMaxPrice" label="Total Max Price" style={{ color: "#8E8E8E", fontSize: "8px"}}>
                   <InputNumber readOnly size="small" style={{width:'100%'}}/>
                 </Form.Item>
               </Col>
             </Row>
                      <Form.List name="solitaireForm" >
                      {(fields,{add,remove})=>(
                   <>
                  <Card bodyStyle={{padding:'5px'}} style={{boxShadow: "0px 3px 6px #00000029",borderRadius: "5px",marginBottom:'5px'}}>
                  <span style={{color:'rgba(0, 0, 0, 0.85)',fontWeight:'600',marginTop:'4px',fontSize:'12px'}}>Solitaire</span>
                  <Row gutter={16}>
                    <Col span={23}></Col>
                    <Col span={1} style={{marginTop:'3px',marginBottom:'-15px'}} >
                             <span style={{float:'right'}} >
                              <PlusCircleOutlined label="Add"  onClick={() => {
                                setColor('')
                                setClarity('')
                                add()
                                }}/>
                             </span>
                           </Col>
                           </Row>
                     {fields.map(({key,name,...restField})=>{
                       let number = 0
                       return(<> 
                       <Row gutter={16} style={{marginBottom:'8px'}}>
                          {solitaireData.map((element)=>{
                            let data = element.value.split(',')
                            if(element.name !== "Solitaire PCs"){
                              return (
                                <Col className="gutter-row" span={3}>
                              <Form.Item  name={[name,`${element.name}-${element.mAttributeId}`]} label={element.name} style={{ color: "#8E8E8E", fontSize: "8px"}}>
                              <Select size="small" showSearch onSelect={()=>{getSolitairePrice('solitaire',name)}}>
                              {data?.map((option, index) => (
                                      <Option key={element.lineAttributeId} value={option}>
                                        {option}
                                      </Option>
                                    ))}
                              </Select>
                              </Form.Item>
                              </Col>)
                            }
                          })}
                          <Col className="gutter-row" span={3} >
                            <Row>
                              <Col span={18}>
                              <Form.Item  initialValue={'D'} name={[name,'DSColour-E7933C2C6C744FBFB94299F65A66C0EE']} label="DSColour" style={{ color: "#8E8E8E", fontSize: "8px" }}>
                              <Select size='small' onSelect={selectColorValue(name)}>
                                    <Option key={"1"} value={"D"}>
                                    D
                                    </Option>
                                    <Option key={"2"} value={"E"}>
                                    E
                                    </Option>
                                    <Option key={"3"} value={"F"}>
                                    F
                                    </Option>
                                    <Option key={"4"} value={"G"}>
                                    G
                                    </Option>
                                    <Option key={"5"} value={"H"}>
                                    H
                                    </Option>
                                    <Option key={"6"} value={"I"}>
                                    I
                                    </Option>
                              </Select>
                            </Form.Item>
                              </Col>
                              <Col span={6} style={{marginTop:'26px'}}>
                              <span style={{ color: "#5D5454", fontSize: "13px",float:'right'}} >to</span>
                              </Col>
                            </Row>
                           
                          </Col>
                          
                          <Col className="gutter-row" span={2} style={{ marginTop:'21.5px'}}>
                            <Form.Item  name={[name,"colour1"]} label="" validateStatus={errorMsg1 ? "error" : ""} help={errorMsg1 ? "select higher value" : ""} style={{ color: "#8E8E8E", fontSize: "8px" }}>
                              <Select size='small' defaultValue="D" value={color} onSelect={()=>{
                                // getSolitairePrice('solitaire',name)
                                selectColor()
                              }}>
                              <Option key={"1"} value={"D"}>
                              D
                              </Option>
                              <Option key={"2"} value={"E"}>
                              E
                              </Option>
                              <Option key={"3"} value={"F"}>
                              F
                              </Option>
                              <Option key={"4"} value={"G"}>
                              G
                              </Option>
                              <Option key={"5"} value={"H"}>
                              H
                              </Option>
                              <Option key={"6"} value={"I"}>
                              I
                              </Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          
                          <Col className="gutter-row" span={3}>
                          <Form.Item  initialValue={'IF'} name={[name,"DSClarity-5DE648F02E564CA4A8BA392B86B6ADB1"]} label="DSClarity" style={{ color: "#8E8E8E", fontSize: "8px" }}>
                            <Select size='small' onSelect={selectClarityValue(name,'jewellery')}>
                              <Option key={"1"} value={"IF"}>
                                  IF
                                </Option>
                                <Option key={"2"} value={"VVS1"}>
                                  VVS1
                                </Option>
                                <Option key={"3"} value={"VVS2"}>
                                  VVS2
                                </Option>
                                <Option key={"4"} value={"VS1"}>
                                  VS1
                                </Option>
                                <Option key={"5"} value={"VS2"}>
                                  VS2
                                </Option>
                                <Option key={"6"} value={"SI1"}>
                                  SI1
                                </Option>
                                <Option key={"7"} value={"SI2"}>
                                  SI2
                                </Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={3} style={{ marginTop:'21.5px' }}>
                          <Row>
                          <Col span={6} style={{marginTop:'4px'}}>
                              <span style={{ color: "#5D5454", fontSize: "13px",float:'left'}} >to</span>
                              </Col>
                              <Col span={18}>
                              <Form.Item  name={[name,"clarity1"]} validateStatus={errorMsg2 ? "error" : ""} help={errorMsg2 ? "select higher value" : ""} style={{ color: "#8E8E8E", fontSize: "8px" }}>
                              <Select size='small' defaultValue="IF" value={clarity} onSelect={selectClarity(name)}>
                              <Option key={"1"} value={"IF"}>
                                  IF
                                </Option>
                                <Option key={"2"} value={"VVS1"}>
                                  VVS1
                                </Option>
                                <Option key={"3"} value={"VVS2"}>
                                  VVS2
                                </Option>
                                <Option key={"4"} value={"VS1"}>
                                  VS1
                                </Option>
                                <Option key={"5"} value={"VS2"}>
                                  VS2
                                </Option>
                                <Option key={"6"} value={"SI1"}>
                                  SI1
                                </Option>
                                <Option key={"7"} value={"SI2"}>
                                  SI2
                                </Option>
                              </Select>
                            </Form.Item>
                              </Col>
                             
                            </Row>
                          </Col>
                          {solitaireData.map((element)=>{
                            let data = element.value.split(',')
                            if(element.name === "Solitaire PCs"){
                              number = 1
                              return (
                                <Col className="gutter-row" span={3}>
                              <Form.Item  name={[name,`${element.name}-${element.mAttributeId}`]} label={element.name} style={{ color: "#8E8E8E", fontSize: "8px"}}>
                              <Select size="small" showSearch onSelect={()=>{getSolitairePrice('solitaire',name)}}>
                              {data?.map((option, index) => (
                                      <Option key={element.lineAttributeId} value={option}>
                                        {option}
                                      </Option>
                                    ))}
                              </Select>
                              </Form.Item>
                              </Col>)
                            }
                            
                          })}
                          {number ===1?<Col span={4}></Col> : null}
                          <Col className="gutter-row" span={3}>
                      <Form.Item  name={[name,"minPrice"]} label="Min_Price" style={{ color: "#8E8E8E", fontSize: "8px",marginBottom:'12px' }}>
                        <Input readOnly style={{height:'24px'}}/>
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={3}>
                      <Form.Item  name={[name,"maxPrice"]} label="Max_Price" style={{ color: "#8E8E8E", fontSize: "8px",marginBottom:'12px' }}>
                        <Input readOnly style={{height:'24px'}}/>
                      </Form.Item>
                    </Col>
                          </Row>
                       
                        <Row style={{marginTop:'-24px'}}>
                          <Col span={23}></Col>
                        <Col span={1} className='gutter-row' >
                              <MinusCircleOutlined style={{float:'right'}} onClick={() => {
                                remove(name)
                                }} />
                             </Col>
                        </Row>
                       </>)
                     })}
                  </Card>
                         </>
                       )}
                      </Form.List>
                      
                      <Form.List name="MetalData">
                      {(fields,{add,remove})=>(
                   <>
                  <Card bodyStyle={{padding:'5px'}} style={{boxShadow: "0px 3px 6px #00000029",borderRadius: "5px",marginBottom:'5px'}}>
                  <div style={{color:'rgba(0, 0, 0, 0.85)',fontWeight:'600',fontSize:'12px'}}>Metal</div>
                  <Row gutter={16}>
                    <Col span={23}></Col>
                    <Col span={1} style={{marginTop:'3px',marginBottom:'-15px'}} >
                    {/* <span >
                              <Button style={{height:'25px',marginRight:'8px'}} onClick={getMetalPrice}>Calculate Price</Button>
                             </span> */}
                             <span style={{marginBottom:'3px',float:'right'}} >
                              <PlusCircleOutlined label="Add"  onClick={() => {
                                add()
                                }}/>
                             </span>
                           </Col>
                           </Row>
                     {fields.map(({key,name,...restField})=>(
                       <> 
                       <Row gutter={16} style={{marginBottom:'24px'}}>
                       {metalData.map((element)=>{
                           let data = element.value.split(',')
                           if(element.name !== "SKU Weight (gm)" && element.name !== "Ring Size"){
                            return (
                              <Col className="gutter-row" span={5} > 
                                <Form.Item  name={[name,`${element.name}-${element.mAttributeId}`]} label={element.name} style={{ color: "#8E8E8E", fontSize: "8px",marginBottom:'8px' }}>
                                  <Select size='small' showSearch onSelect={()=>{getMetalPrice(name)}}>
                                  {data?.map((option, index) => (
                                  <Option key={element.lineAttributeId} value={option}>
                                    {option}
                                  </Option>
                                ))}
                              </Select>
                                </Form.Item>
                                </Col>)
                           }  
                           if(element.name === "Ring Size"){
                            return(
                              <Col className="gutter-row" span={3} > 
                                <Form.Item  name={[name,"ringSize"]} label={element.name} style={{ color: "#8E8E8E", fontSize: "8px"}}>
                                  <Select size='small' showSearch onSelect={onSelectRing(name)}>
                                  {data?.map((option, index) => (
                                  <Option key={option} value={option}>
                                    {option}
                                  </Option>
                                ))}
                              </Select>
                                </Form.Item>
                                </Col>)
                           }
                          })}
                     {metalWeeightVisible ? metalData.map((element)=>{
                           if(element.name === "SKU Weight (gm)"){
                            return(<Col className="gutter-row" span={5} > 
                            <Form.Item initialValue={""} name={[name,"weight"]} label={"Weight"} style={{ color: "#8E8E8E", fontSize: "8px",marginBottom:'8px' }}>
                              <Input readOnly/>
                            </Form.Item>
                            </Col>)
                           }
                               
                          }) :  metalData.map((element)=>{
                            if(element.name === "SKU Weight (gm)"){
                             return(<Col className="gutter-row" span={5} > 
                             <Form.Item initialValue={element.value}  name={[name,"weight"]} label={"Weight"} style={{ color: "#8E8E8E", fontSize: "8px",marginBottom:'8px' }}>
                               <Input readOnly/>
                             </Form.Item>
                             </Col>)
                            }
                                
                           })}
                          <Col className="gutter-row" span={4}>
                      <Form.Item  name={[name,"metalPrice"]} label="Metal Price" style={{ color: "#8E8E8E", fontSize: "8px" }}>
                        <Input readOnly style={{height:'24px'}}/>
                      </Form.Item>
                    </Col>
                          </Row>
                    <Row style={{marginTop:'-34px'}}>
                    <Col span={24} className='gutter-row'>
                              <MinusCircleOutlined style={{float:'right'}} onClick={() => {
                                remove(name)
                                }} />
                             </Col>
                    </Row>
                       </>
                          ))}
                  </Card>
                    </>
                       )}
                      </Form.List>
                
                {diamondData.length > 0 ? <Form.List name="sideDiamondData">
                      {(fields,{add,remove})=>(
                   <>
                  <Card bodyStyle={{padding:'5px'}} style={{boxShadow: "0px 3px 6px #00000029",borderRadius: "5px",marginBottom:'5px'}}>
                  <div style={{color:'rgba(0, 0, 0, 0.85)',fontWeight:'600',background:'#FBFBFB',fontSize:'12px'}}>Side Diamond</div>
                    <Row gutter={16}>
                    <Col span={23}></Col>
                    <Col span={1} style={{marginTop:'-12px'}}>
                    {/* <span >
                              <Button style={{height:'25px',marginRight:'8px'}}>Calculate Price</Button>
                             </span> */}
                             <span style={{marginBottom:'3px',float:'right'}} >
                              <PlusCircleOutlined label="Add"  onClick={() => {
                                add()
                                }}/>
                             </span>
                           </Col>
                           </Row>
                     {fields.map(({key,name,...restField})=>(
                       <> 
                       <Row gutter={16} >
                      {/* <Col className="gutter-row" span={4} >
                      <Form.Item name="SDPices" label={"SD Pieces"} style={{ color: "#8E8E8E", fontSize: "8px",marginBottom:'8px' }}>
                        <Input style={{height:'24px'}}/>
                      </Form.Item>
                    </Col> */}
                    {/* <Col className="gutter-row" span={4} >
                      <Form.Item name="sdSettingType" label={"SD Setting Type"} style={{ color: "#8E8E8E", fontSize: "8px",marginBottom:'8px' }}>
                        <Input style={{height:'24px'}}/>
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4} >
                      <Form.Item name="sdSieveSize" label="SD Sieve Size" style={{ color: "#8E8E8E", fontSize: "8px",marginBottom:'8px' }}>
                        <Input style={{height:'24px'}}/>
                      </Form.Item>
                    </Col> */}
                    {/* <Col className="gutter-row" span={4} >
                      <Form.Item name="perStoneWeight" label="Per Stone Weight" style={{ color: "#8E8E8E", fontSize: "8px",marginBottom:'8px' }}>
                        <Input style={{height:'24px'}}/>
                      </Form.Item>
                    </Col> */}
                    {diamondData.map((element)=>{
                           let data = element.value.split(',')
                                return (
                                <Col className="gutter-row" span={5} > 
                                  <Form.Item  name={[name,`${element.name}-${element.mAttributeId}`]} label={element.name} style={{ color: "#8E8E8E", fontSize: "8px",marginBottom:'8px' }}>
                                    <Select size='small' showSearch onSelect={()=>{getSideDiamondPrice(name)}}>
                                    {data?.map((option, index) => (
                                    <Option key={element.lineAttributeId} value={option}>
                                      {option}
                                    </Option>
                                  ))}
                                </Select>
                                  </Form.Item>
                                  </Col>)
                          })}
                      <Col className="gutter-row" span={4}>
                      <Form.Item  name={[name,"price"]} label="Price" style={{ color: "#8E8E8E", fontSize: "8px" }}>
                        <Input readOnly style={{height:'24px'}}/>
                      </Form.Item>
                    </Col>
                    {/* <Col className="gutter-row" span={4} >
                      <Form.Item name="SDQuality" label="SD Quality" style={{ color: "#8E8E8E", fontSize: "8px",marginBottom:'8px' }}>
                        <Input style={{height:'24px'}}/>
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4} >
                      <Form.Item name="SDTotalWeight" label="SD Total Weight" style={{ color: "#8E8E8E", fontSize: "8px",marginBottom:'8px' }}>
                        <Input style={{height:'24px'}}/>
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4} >
                      <Form.Item name="SDPrice" label="Diamond Price" style={{ color: "#8E8E8E", fontSize: "8px",marginBottom:'8px' }}>
                        <Input style={{height:'24px'}}/>
                      </Form.Item>
                    </Col> */}
                      </Row>
                      <Row style={{marginTop:'-8px'}}>
                      <Col span={24} className='gutter-row' >
                              <MinusCircleOutlined style={{float:'right'}} onClick={() => {
                                remove(name)
                                }} />
                             </Col>
                      </Row>
                       </>
                          ))}
                  </Card>
                    </>
                       )}
                      </Form.List> : null}
                  </Form>
              </Col>
            </Row>
          </div>
        ) : (
          ""
        )}
      </Modal>
      </div> :  	
        <ListData />
      }
    </Spin>
  );
};

export default NewSalesOrder;
