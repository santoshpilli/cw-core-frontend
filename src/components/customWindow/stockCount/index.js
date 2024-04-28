import React,{useState,useEffect} from 'react'
import {Card,Row,Col,Button,Form,Select,Tabs,Input,Spin,Modal,Tooltip,DatePicker,Radio,message,Table} from 'antd'
import { LoadingOutlined ,DownloadOutlined,EditOutlined} from "@ant-design/icons";
import { ExportToCsv } from 'export-to-csv'
import { v4 as uuid } from 'uuid'
import moment from 'moment'
import Axios from 'axios'
import { getOAuthHeaders } from '../../../constants/oAuthValidation';
import { getWarehouse} from "../../../services/generic";
import { getStockCountProduct,getRoleBusinessUnit,getAppSetupData} from "../../../services/custom";
// import {serverUrl,genericUrl,fileDownloadUrl} from '../../../constants/serverConfig'
import "./antdClass.css"
import "antd/dist/antd.css";
import "../../../styles/antd.css";
import barcodeImage from '../../../assets/images/barcode.svg'

const {Option} = Select
const {TabPane} = Tabs
const dateFormat = 'YYYY-MM-DD'

const StockCount = (props) => {
const [bunitData,setBunitData] = useState([])
const [bunitId,setBunitId] = useState('')
const [businessUnitName,setBusinessUnitName] = useState('')
const [loading,setLoading] = useState(false)
const [productData,setProductData] = useState([])
const [productData1,setProductData1] = useState([])
const [tabKey,setTabKey] = useState('10')
const serverUrl = process.env.REACT_APP_serverUrl;
const genericUrl = process.env.REACT_APP_genericUrl;
const fileDownloadUrl = process.env.REACT_APP_fileDownloadUrl;
const [selectedDate,setSelectedDate] = useState('')
const [warehouseData,setWarehouseData] = useState([])
const [mwarehouseId,setMwarehouseId]= useState('')
const [warehouseName,setWarehouseName] = useState([])
const [selectedProductObject,setSelectedProductObject] = useState({})
const [inventoryCountSummaryData,setInventoryCountSummaryData] = useState([])
const [inventorySummaryReviewVisible,setInventorySummaryReviewVisible] = useState(false)
const [radioValue,setRadioValue] = useState(1)
const [AutoFocusValue,setAutoFocusValue] = useState(true)
const [batchedData, setBatchedData] = useState([]);
const [batch, setBatch] = useState("");
const [filedDisabled,setFiledDisabled] = useState(false)
const [appConfig, setAppConfig] = useState({});
const [importModalVisible, setImportModalVisible] = useState(false);


const [form] = Form.useForm();
const [headerform] = Form.useForm()
const [summaryForm] = Form.useForm()
const [skuupcform] = Form.useForm()
const [importform] = Form.useForm();

useEffect(() => {
 const initialDate= moment(new Date()).format('YYYY-MM-DD')
 setSelectedDate(initialDate)
 headerform.setFieldsValue({
  'date':moment(initialDate,dateFormat),
})
summaryForm.setFieldsValue({
  'summbusinessunit':businessUnitName,
  'warehouseName':warehouseName,
  'summreceiptdate':moment(initialDate,dateFormat),
})
getBusinessUnit()
getAppSetup()
}, []);

const tableColumns = [
  {
    title: '',
    dataIndex: '',
    width: 30,
    render: (text, row) => <span
    style={{cursor:'pointer'}}
    role="presentation"
    onClick={() => {
      const isScan = "N"
      rowSelectedProduct(text,isScan)
    }}
  >
    <EditOutlined />
  </span>
  },
 {
    title: 'SKU',
    dataIndex: 'value',
    width: 80,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: 'UOM',
    dataIndex: 'uomName',
    width: 80,
  },
  {
    title: 'Qty Count',
    dataIndex: 'qtycount',
    width: 80,
  },
  {
    title: "Cost",
    dataIndex: "cost",
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
  {
    title: 'Remarks',
    dataIndex: 'remarks',
    width: 120,
  },
]

const getAppSetup = async () => {
  const val = "Stock Adjustment";
  const response = await getAppSetupData(val);
  if (response.length > 0) {
    setAppConfig(JSON.parse(response[0].configJson));
  };
}


const getBusinessUnit = async () =>{
  const userData = JSON.parse(window.localStorage.getItem('userData'))
  const businessUnitResponse = await getRoleBusinessUnit(userData.user_id)
  setBunitId(businessUnitResponse.defaultCsBunitId)
  setBunitData(businessUnitResponse.userBunit)
  headerform.setFieldsValue({
    businessUnit : businessUnitResponse.bUnitName
  })
  setBusinessUnitName(businessUnitResponse.bUnitName)
  const warehouseResponse = await getWarehouse(businessUnitResponse.defaultCsBunitId)
  setWarehouseData(warehouseResponse)
}


const onSelectBusinessUnit = async (e,data) =>{
  const { title } = data.props
  setBunitId(e)
  setBusinessUnitName(title)
  const warehouseResponse = await getWarehouse(e)
  setWarehouseData(warehouseResponse)
}

const onFinish = () =>{

}

const onChangeRadio = (e) =>{
setRadioValue(e.target.value)
setAutoFocusValue(true)
}

const OnChangeOrderQty = () =>{
  setTimeout(() => {
  const formFieldsData = form.getFieldsValue(true);
  const qtycount = formFieldsData.qtycount
  const remarks = formFieldsData.description
  const batchNo = formFieldsData.batchNo
  const cost = formFieldsData.cost
  const mfg_date = formFieldsData.mfg_date === null || formFieldsData.mfg_date === undefined ? null : moment(formFieldsData.mfg_date).format('YYYY-MM-DD')
  const expiry_date = formFieldsData.expiry_date === null || formFieldsData.expiry_date === undefined ? null : moment(formFieldsData.expiry_date).format('YYYY-MM-DD')

  const key= selectedProductObject.key
  const isBatched = selectedProductObject.batchedForStock
  const sku = selectedProductObject.value
  const uniqueId = uuid()
      .replace(/-/g, '')
      .toUpperCase()
  const newObj = {
    cost:cost,
    batchNo:batchNo,
    batchedForStock:isBatched,
    csUomId:selectedProductObject.csUomId,
    expiry_date:expiry_date,
    isBatchedFromdropdown:selectedProductObject.isBatchedFromdropdown,
    key:uniqueId,
    mBatch:selectedProductObject.mBatch,
    mProductId:selectedProductObject.mProductId,
    mfg_date:mfg_date,
    name:selectedProductObject.name,
    productBatchId:selectedProductObject.productBatchId,
    qtycount:qtycount,
    uomName:selectedProductObject.uomName,
    upc: selectedProductObject.upc,
    value:sku,
    remarks:remarks
  }
  if(isBatched === "Y"){
    const index = productData.findIndex(element => {
      return element.key === key
    })
    if (index >= 0) {
      productData.splice(index, 1);
    }
  }else{
    const index = productData.findIndex(element => {
      return element.value === sku
    })
    if (index >= 0) {
      productData.splice(index, 1);
    }
  }
  setSelectedProductObject(newObj)
    const newArray = [newObj,...productData]
    setProductData([])
    setProductData(newArray)
  }, 500);
}
    
    const scanUpcOrSku = (event) =>{
      const code = event.keyCode || event.which
      const upcVal = event.target.value
      if (code === 13) {
        if(productData1.length > 0 ){
        skuupcform.resetFields(['UPC-SKU'])
              let index;
              if(radioValue === 1){
              index = productData1.findIndex((element) => {
                return element.upc === upcVal
              });
              }
              else
              {
                index = productData1.findIndex((element) => {
                return element.value === upcVal
              });
              }
              if (index >= 0) {
                if(radioValue === 1){
                  for (let index = 0; index < productData1.length; index++) {
                    const element = productData1[index].upc;
                    if(element === upcVal){
                      const isScan = "Y"
                      const batchedForStock = productData1[index].batchedForStock
                      if(batchedForStock === "Y"){
                        rowSelectedProduct(productData1[index],isScan)
                      }else{
                        setFiledDisabled(true)
                        scaninformforNonBatchedProducts(productData1[index])
                      }
                    }
                  }
                }else{
                  for (let index = 0; index < productData1.length; index++) {
                    const element = productData1[index].value;
                    if(element === upcVal){
                      const isScan = "Y"
                      const batchedForStock = productData1[index].batchedForStock
                      if(batchedForStock === "Y"){
                        rowSelectedProduct(productData1[index],isScan)
                      }else{
                        setFiledDisabled(true)
                        scaninformforNonBatchedProducts(productData1[index])
                      }
                    }
                  }
                }
              }else{
                message.error("Product not found!")
              }              
              }else{
            message.error("Please select header first")
          }
      }
    }    
    
    const scaninformforNonBatchedProducts = (objdata) =>{
      const productId = objdata.mProductId
      const uomId = objdata.csUomId
      const newArrayForrefresh = []
      for (let index = 0; index < productData.length; index++) {
        const MproductId = productData[index].mProductId;
        const MuomId = productData[index].csUomId
        if((productId === MproductId) && (MuomId ===uomId)){
          productData[index].qtycount = productData[index].qtycount === null || productData[index].qtycount === undefined ? 1 : parseInt(productData[index].qtycount) + 1
          form.setFieldsValue({
            'cost':productData[index].cost,
            'skuValue':productData[index].value,
            'productName':productData[index].name,
            'uomName':productData[index].uomName,
            'qtycount':productData[index].qtycount,
            'description':productData[index].description,
            'batchNo':productData[index].batchNo,
            'batch':productData[index].batchNo,
            'mfg_date':null,
            'expiry_date':null,
          })
          setSelectedProductObject(productData[index])
        }
        newArrayForrefresh.push(productData[index])
      }
      setTimeout(() => {
        setProductData([])
        setProductData(newArrayForrefresh)
      }, 10);
    }

    const inventorySummaryReview = () =>{
  summaryForm.setFieldsValue({
    'summbusinessunit':businessUnitName,
    'warehouseName':warehouseName,
    'summreceiptdate':moment(selectedDate,dateFormat),
  })
  const formFieldsData = headerform.getFieldsValue(true);
  const type = formFieldsData.type
  const newArray = []
    for (let index = 0; index < productData.length; index++) {
      const element = parseFloat(productData[index].qtycount);
      if(type === 'CC'){
        if(element === 0 || element > 0){
          newArray.push(productData[index])
        }
      }else{
        if(element > 0){
          newArray.push(productData[index])
        }
      }
    }
    setInventoryCountSummaryData(newArray)
  if(newArray.length > 0){
    setInventorySummaryReviewVisible(true)
  }else{
    message.error("Please Add Products")
  }
}
const closeSummaryReview = () =>{
  setInventorySummaryReviewVisible(false)
}

const callbackTabs = (key) =>{
  setTabKey(key)
  summaryForm.setFieldsValue({
    'summbusinessunit':businessUnitName,
    'warehouseName':warehouseName,
    'summreceiptdate':moment(selectedDate,dateFormat),
  })
  const formFieldsData = headerform.getFieldsValue(true);
  const type = formFieldsData.type
  const newArray = []
    for (let index = 0; index < productData.length; index++) {
      const element = parseFloat(productData[index].qtycount);
      if(type === 'CC'){
        if(element === 0 || element > 0){
          newArray.push(productData[index])
        }
      }else{
        if(element > 0){
          newArray.push(productData[index])
        }
      }
    }
    setInventoryCountSummaryData(newArray)
}



const readFileData = (evt) =>{
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
          if (cells.length === 5) {
            dataArr.push({
              sku: cells[0],
              qtycount: parseInt(cells[1]),
              batchno: cells[2],
              mfg_date: cells[3],
              expiry_date: cells[4],
            })
          }
        } 
        if (dataArr.length > 0) {
          const newData = []
          for (let index = 0; index < dataArr.length; index++) {
            const qtycount = dataArr[index].qtycount;
            if(qtycount === 0 || qtycount > 0){
              newData.push(dataArr[index])
            } 
          }
          const matchedArray = []
          const unmatchedArray = []
          const unmatchedImportSkuArray = []
          for (let index2 = 0; index2 < productData.length; index2++) {
            let boolean = true
            const productSku = productData[index2].value;
            for (let index3 = 0; index3 < newData.length; index3++) {
              const importSku = newData[index3].sku;
              if (productSku === importSku) {
                const isBatched = productData[index2].batchedForStock
                const batchData = productData[index2].mBatch
                productData[index2].qtycount = newData[index3].qtycount
                matchedArray.push(productData[index2])
                boolean = false
              }
            }
            if (boolean) {
              unmatchedArray.push(productData[index2])
            }
          }

          for (let index3 = 0; index3 < newData.length; index3++) {
            let boolean = true
            const importSku = newData[index3].sku;
            for (let index2 = 0; index2 < productData.length; index2++) {
            const productSku = productData[index2].value;
            if (productSku === importSku) {
              boolean = false
            }
           }
           if (boolean) {
            unmatchedImportSkuArray.push(newData[index3].sku)
          }
          }
          message.success(`${matchedArray.length} products imported ...`)
          if (unmatchedImportSkuArray.length > 0) {
            setTimeout(() => {
              Modal.error({
                title: 'Products not found !',
                content: `${unmatchedImportSkuArray}`,
                closable: true,
                footer: null,
                icon:null
              })
            }, 100)
          }
          setLoading(false)
          document.getElementById('choosefile').value = null
        } else {
          message.error('Please import the file in required format.')
          document.getElementById('choosefile').value = null
          setLoading(false)
        }
    };
    reader.readAsText(file);
  }
}

const createInventoryCount = () =>{
  setLoading(true)  
  const uniqueId = uuid()
      .replace(/-/g, '')
      .toUpperCase()
      const authHeaders = getOAuthHeaders();
      if (authHeaders && authHeaders.email && authHeaders.access_token) {
  let usersData = JSON.parse(localStorage.getItem("userData"));
  const userId = usersData.user_id
  const formFieldsData = headerform.getFieldsValue(true);
  const type = formFieldsData.type
    const countData = []
    let productId = ''
    let csUomId = ''
    let countQty = ''
    let description = ''
    let batchNo = ''
    let cost = ''
    let mBatchId = ''
    let expiry_date = ''
    let mfg_date=''
  for (let index2 = 0; index2 < inventoryCountSummaryData.length; index2++) {
    productId = inventoryCountSummaryData[index2].mProductId
    batchNo = inventoryCountSummaryData[index2].batchNo === undefined || inventoryCountSummaryData[index2].batchNo === null ? null :inventoryCountSummaryData[index2].batchNo
    cost = inventoryCountSummaryData[index2].cost === undefined || inventoryCountSummaryData[index2].cost === null ? null :inventoryCountSummaryData[index2].cost
    mBatchId = inventoryCountSummaryData[index2].productBatchId === undefined || inventoryCountSummaryData[index2].productBatchId === null ? null :inventoryCountSummaryData[index2].productBatchId
    mfg_date = inventoryCountSummaryData[index2].mfg_date === undefined || inventoryCountSummaryData[index2].mfg_date === null ? null :inventoryCountSummaryData[index2].mfg_date
    expiry_date = inventoryCountSummaryData[index2].expiry_date === undefined || inventoryCountSummaryData[index2].expiry_date === null ? null :inventoryCountSummaryData[index2].expiry_date
    csUomId = inventoryCountSummaryData[index2].csUomId
    countQty = inventoryCountSummaryData[index2].qtycount === undefined || inventoryCountSummaryData[index2].qtycount === null ? 0 :inventoryCountSummaryData[index2].qtycount
    description = inventoryCountSummaryData[index2].remarks === undefined || inventoryCountSummaryData[index2].remarks === null || inventoryCountSummaryData[index2].remarks ===  '' ? '' :inventoryCountSummaryData[index2].remarks
    countData.push(
      `{
        mProductId : "${productId}"
        csUomId : "${csUomId}"
        countQty : ${countQty}
        description : "${description}"
        mBatchId:${mBatchId === null ? null :`"${mBatchId}"`}
        cost:${cost === null ? null :`"${cost}"`}
        batchNo:${batchNo === null ? null :`"${batchNo}"`}
        startDate:${mfg_date === null ? null :`"${mfg_date}"`}
        endDate:${expiry_date === null ? null :`"${expiry_date}"`}
      }`,
    )
  }
  const getBookinOrder = {
    query: `mutation {
      insertInventoryCount (inventory : {
        mInventoryID :"${uniqueId}"
        cSBunitID : "${bunitId}"
        mWarehouseId: "${mwarehouseId}"
        createdby : "${userId}"
        inventorydate : "${selectedDate}"
        inventoryType : "${type}"
        lines : [${countData}]
      }) {
        code
        status
        message
        documentNo
        recordId
      }
    }`,
  }
  Axios({
    url: serverUrl,
    method: 'POST',
    data: getBookinOrder,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${authHeaders.access_token}`,
    },
  }).then(response => {
    if(response.data.data.insertInventoryCount.status === "Success"){
      form.resetFields()
      summaryForm.resetFields()
      headerform.resetFields([
        'businessUnit',
        'warehouse',
        'type'])
      setInventoryCountSummaryData([])
      setBunitId('')
      setMwarehouseId('')
      setBusinessUnitName('')
      setWarehouseName('')
      setLoading(false)
      setProductData([])
      setSelectedProductObject({})
      setInventorySummaryReviewVisible(false)
      const recordId = response.data.data.insertInventoryCount.recordId
      const message = response.data.data.insertInventoryCount.message
      const orderNo = response.data.data.insertInventoryCount.documentNo
      getPrintCofirmation(recordId,message,orderNo)
    }else{
      message.error("Failed to insert inventory")
      setLoading(false)
    }
  })
}
}

const getPrintCofirmation = (recordId,message,orderNo) => {
  Modal.confirm({
    title: `${message} - ${orderNo}`,
    content: 'Do you want take Printout',
    okText: 'Yes',
    // okType: 'danger',
    cancelText: 'No',
    icon:null,
    onOk() {
      getPrintPdffile(recordId)
    },
    onCancel() {
      setInventorySummaryReviewVisible(false)
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
      message.error("Error")
    } else {
      getPrintCommand(response.data.data.reportTemplate)
    }
  })
}
}

const getPrintCommand = fileName => {
  setProductData([])
  setInventorySummaryReviewVisible(false)
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

const downloadImportTemplate = () =>{
  const options = {
    fieldSeparator: ',',
    filename: 'InventoryCountImport',
    // quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: false,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ['sku','count','batcho','mfg_date','expiry_date']  
  }
  const csvExporter = new ExportToCsv(options)
  csvExporter.generateCsv([{'sku':'','count':'','batcho':'','mfg_date':'','expiry_date':''}])
}

const getImportModal = () => {
  const formFieldsData = headerform.getFieldsValue(true);
  if (formFieldsData.warehouse === undefined) {
    message.error("Please select warehouse");
  } else {
    setImportModalVisible(true);
  }
};
const importModalClose = () => {
  setImportModalVisible(false);
  importform.resetFields();
  document.getElementById("choosefile").value = null;
};

const getDateChange = (date, dateString) =>{
  setSelectedDate(dateString)
  headerform.setFieldsValue({
    'date':moment(dateString,dateFormat),
  })
}

const onWarehouseChange = (e,data) =>{
  setMwarehouseId(e)
  setWarehouseName(data.props.title)
  }
const onTypeChange = async () =>{
  setLoading(true)
  const inventoryProductsResponse = await getStockCountProduct(bunitId,mwarehouseId)
  const inventoryProd2 = await getStockCountProduct(bunitId,mwarehouseId)
  for (let index = 0; index < inventoryProductsResponse.length; index++) {
    const uniqueId = uuid()
      .replace(/-/g, '')
      .toUpperCase()
      inventoryProductsResponse[index].key = uniqueId;
  }
  for (let index2 = 0; index2 < inventoryProd2.length; index2++) {
    const uniqueId = uuid()
      .replace(/-/g, '')
      .toUpperCase()
      inventoryProd2[index2].key = uniqueId;
  }
  setProductData(inventoryProductsResponse)
  setProductData1(inventoryProd2)
  setLoading(false)
}

const rowSelectedProduct = (data,isScan) =>{
  if(isScan === "Y"){
    let productKey = data.key
    let productValue = data.value
    let index = productData.findIndex(element =>{
      return element.key === productKey && element.value === productValue
    })
    if(index >= 0){
      let isBatched = data.batchedForStock
      let isBatchedFromdropdown = data.isBatchedFromdropdown === undefined || data.isBatchedFromdropdown === null ? "N" :data.isBatchedFromdropdown
      let isBatchNull = data.batchNo === null || data.batchNo === undefined ? null : data.batchNo
      const mbatchData = data.mBatch === null || data.mBatch === undefined ? [] : data.mBatch
      if((isBatched === "Y") && (mbatchData.length > 0)){
        setBatchedData(mbatchData);
        if(isBatchNull === null){
           setFiledDisabled(false)
        }else if(isBatchedFromdropdown === "Y"){
          setFiledDisabled(true)
        }else if (isBatchedFromdropdown === "N"){
          setFiledDisabled(false)
        }
      }else if(isBatched === "N"){
        setFiledDisabled(true)
        setBatchedData([])
      }else {
        setBatchedData([])
        setFiledDisabled(false)
      }
      
      const newObj = {
        batchNo:data.batchno,
        batchedForStock:data.batchedForStock,
        csUomId:data.csUomId,
        mfg_date:null,
        key:data.key,
        mBatch:data.mBatch,
        qtycount: selectedProductObject.qtycount === null || selectedProductObject.qtycount === undefined ? 0 : parseInt(selectedProductObject.qtycount) + 1,
        mProductId:data.mProductId,
        expiry_date:null,
        name:data.name,
        productBatchId:data.mBatchId,
        uomName:data.uomName,
        upc: data.upc,
        value:data.value,
        cost:data.cost,
      }
      form.setFieldsValue({
        'cost':data.cost,
        'skuValue':data.value,
        'productName':data.name,
        'uomName':data.uomName,
        'qtycount':selectedProductObject.qtycount === null || selectedProductObject.qtycount === undefined ? 0 : parseInt(selectedProductObject.qtycount) + 1,
        'description':data.description,
        'batchNo':data.batchNo,
        'batch':data.batchNo,
        'mfg_date':null,
        'expiry_date':null,
      })
      productData.splice(index, 1);
      setSelectedProductObject(newObj)
      setProductData([newObj,...productData])
    }else{
      let isBatched = data.batchedForStock
      let isBatchedFromdropdown = data.isBatchedFromdropdown === undefined || data.isBatchedFromdropdown === null ? "N" :data.isBatchedFromdropdown
      let isBatchNull = data.batchNo === null || data.batchNo === undefined ? null : data.batchNo
      const mbatchData = data.mBatch === null || data.mBatch === undefined ? [] : data.mBatch
      if((isBatched === "Y") && (mbatchData.length > 0)){
        setBatchedData(mbatchData);
        if(isBatchNull === null){
           setFiledDisabled(false)
        }else if(isBatchedFromdropdown === "Y"){
          setFiledDisabled(true)
        }else if (isBatchedFromdropdown === "N"){
          setFiledDisabled(false)
        }
      }else if(isBatched === "N"){
        setFiledDisabled(true)
        setBatchedData([])
      }else {
        setBatchedData([])
        setFiledDisabled(false)
      }
      const newObj = {
        batchNo:data.batchno,
        batchedForStock:data.batchedForStock,
        csUomId:data.csUomId,
        mfg_date:null,
        key:data.key,
        mBatch:data.mBatch,
        qtycount:1,
        mProductId:data.mProductId,
        expiry_date:null,
        name:data.name,
        productBatchId:data.mBatchId,
        uomName:data.uomName,
        upc: data.upc,
        value:data.value,
        cost:data.cost,
      }
      setSelectedProductObject(newObj)
      form.setFieldsValue({
        'cost':data.cost,
        'skuValue':data.value,
        'productName':data.name,
        'uomName':data.uomName,
        'qtycount':1,
        'description':data.description,
        'batchNo':data.batchNo,
        'batch':data.batchNo,
        'mfg_date':null,
        'expiry_date':null,
      })
      setProductData([newObj,...productData])
    }
  }else{
    setSelectedProductObject(data)
    let isBatched = data.batchedForStock
    let isBatchedFromdropdown = data.isBatchedFromdropdown === undefined || data.isBatchedFromdropdown === null ? "N" :data.isBatchedFromdropdown
    let isBatchNull = data.batchNo === null || data.batchNo === undefined ? null : data.batchNo
    const mbatchData = data.mBatch === null || data.mBatch === undefined ? [] : data.mBatch
    if((isBatched === "Y") && (mbatchData.length > 0)){
      setBatchedData(mbatchData);
      if(isBatchNull === null){
         setFiledDisabled(false)
      }else if(isBatchedFromdropdown === "Y"){
        setFiledDisabled(true)
      }else if (isBatchedFromdropdown === "N"){
        setFiledDisabled(false)
      }
    }else if(isBatched === "N"){
      setFiledDisabled(true)
      setBatchedData([])
    }else {
      setBatchedData([])
      setFiledDisabled(false)
    }
    form.setFieldsValue({
      'cost':data.cost,
      'skuValue':data.value,
      'productName':data.name,
      'uomName':data.uomName,
      'qtycount':data.qtycount,
      'description':data.description,
      'batchNo':data.batchNo,
      'batch':data.batchNo,
      'mfg_date':data.mfg_date === null || data.mfg_date === undefined || data.mfg_date === "Invalid date" ? null : moment(data.mfg_date),
      'expiry_date':data.expiry_date === null || data.expiry_date === undefined || data.expiry_date === "Invalid date" ? null : moment(data.expiry_date),
    })
  }
}

const batchedDataList = batchedData.map((data) => (
  <Option key={data.mBatchId} title={data.batchno} value={data.batchno} childdata={data}>
    {data.batchno}
  </Option>
));

      let totalQuantity=0;
      let totalQuantity1;
      for (let index = 0; index < inventoryCountSummaryData.length; index++) {
        totalQuantity1 = inventoryCountSummaryData[index].qtycount;
        const integer = parseFloat(totalQuantity1, 10)
        totalQuantity += integer
      }

      
const productList = productData1.map(Proddata => (
  <Option key={Proddata.key} title={Proddata.name} data={Proddata} value={Proddata.value}>
    {Proddata.value}-{Proddata.name}
  </Option>
))

const onSelectedproducts = (e,data) =>{
  if(appConfig.sku === "Y"){
  const data2 =  data.data
  const isScan = "N"
  rowSelectedProduct(data2,isScan)
}
}

const onChangeBatch = (e, data) => {
  setBatch(e);
  const data2 = data.childdata;
  let key = selectedProductObject.key
  let sku = selectedProductObject.value
  let batch =data2.batchno
  setFiledDisabled(true)
  if (e.length > 0) {
    const index = productData.findIndex((element) => {
      return element.value === sku && element.batchNo === batch;
    });
    if (index >= 0) {
      message.error("Can not add same bacth no to same product!")
      form.resetFields(['batch'])
      setFiledDisabled(false)
    }else{

      const index = productData.findIndex((element) => {
        return element.key === key;
      });
      if (index >= 0) {
        productData.splice(index, 1);
          const uniqueId = uuid()
      .replace(/-/g, '')
      .toUpperCase()
      const newObj = {
        batchNo:data2.batchno,
        batchedForStock:selectedProductObject.batchedForStock,
        csUomId:selectedProductObject.csUomId,
        mfg_date:moment(data2.startdate).format("YYYY-MM-DD") === "Invalid date" ? null : moment(data2.startdate).format("YYYY-MM-DD"),
        key:uniqueId,
        isBatchedFromdropdown :"Y",
        mBatch:selectedProductObject.mBatch,
        qtycount:selectedProductObject.qtycount,
        mProductId:selectedProductObject.mProductId,
        expiry_date:moment(data2.enddate).format("YYYY-MM-DD") === "Invalid date" ? null : moment(data2.enddate).format("YYYY-MM-DD"),
        name:selectedProductObject.name,
        productBatchId:data2.mBatchId,
        uomName:selectedProductObject.uomName,
        upc: selectedProductObject.upc,
        value:selectedProductObject.value,
        cost:selectedProductObject.cost,
      }
      setSelectedProductObject(newObj)
      const newArray1 = [newObj,...productData]
      setProductData([]);
      setProductData(newArray1);
      const date1 = moment(data2.startdate).format("YYYY-MM-DD") === "Invalid date" ? null : moment(data2.startdate).format("YYYY-MM-DD")
      const date2 = moment(data2.enddate).format("YYYY-MM-DD") === "Invalid date" ? null : moment(data2.enddate).format("YYYY-MM-DD")
      form.setFieldsValue({
        mfg_date: date1 === "Invalid date" || date1 === null ? null : moment(date1),
        expiry_date:date2 === "Invalid date" || date2 === null ? null : moment(date2),
        batchNo : data2.batchno
      });
      }else{
        productData.splice(index, 1);
          const uniqueId = uuid()
      .replace(/-/g, '')
      .toUpperCase()
      const newObj = {
        batchNo:data2.batchno,
        batchedForStock:selectedProductObject.batchedForStock,
        csUomId:selectedProductObject.csUomId,
        mfg_date:moment(data2.startdate).format("YYYY-MM-DD") === "Invalid date" ? null : moment(data2.startdate).format("YYYY-MM-DD"),
        key:uniqueId,
        isBatchedFromdropdown :"Y",
        mBatch:selectedProductObject.mBatch,
        qtycount:selectedProductObject.qtycount,
        mProductId:selectedProductObject.mProductId,
        expiry_date:moment(data2.enddate).format("YYYY-MM-DD") === "Invalid date" ? null : moment(data2.enddate).format("YYYY-MM-DD"),
        name:selectedProductObject.name,
        productBatchId:data2.mBatchId,
        uomName:selectedProductObject.uomName,
        upc: selectedProductObject.upc,
        value:selectedProductObject.value,
        cost:selectedProductObject.cost,
      }
      setSelectedProductObject(newObj)
      const newArray1 = [newObj,...productData]
      setProductData([]);
      setProductData(newArray1);
      const date1 = moment(data2.startdate).format("YYYY-MM-DD") === "Invalid date" ? null : moment(data2.startdate).format("YYYY-MM-DD")
      const date2 = moment(data2.enddate).format("YYYY-MM-DD") === "Invalid date" ? null : moment(data2.enddate).format("YYYY-MM-DD")
      form.setFieldsValue({
        mfg_date: date1 === "Invalid date" || date1 === null ? null : moment(date1),
        expiry_date:date2 === "Invalid date" || date2 === null ? null : moment(date2),
        batchNo : data2.batchno
      });
      }
    }
  }
}

const clearFields = () =>{
  if(appConfig.sku === "Y"){
    form.resetFields([
    'productName',
    'uomName',
    'qtycount',
    'batch',
    'batchNo',
    'mfg_date',
    'expiry_date',
    'description',
    'cost'
  ])
  setSelectedProductObject({})
}
}

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
          <Form.Item name="warehouseName" label="Warehouse">
            <Input readOnly style={{borderLeft:'none',borderTop:'none',borderRight:'none'}}/>
          </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
          <Form.Item name="summreceiptdate" label="Date">
            <DatePicker  style={{width:'100%'}}  onChange={getDateChange} />
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
)

    return (
      <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
        <div>
          <Row>
            <Col span={12}>
              <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>Stock Count</h2>
            </Col>
            <Col span={12}>
              <span style={{ float: "right" }}>
                <Button onClick={inventorySummaryReview} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }}>
                  Review
                </Button>
              </span>
            </Col>
          </Row>
          <Card style={{ marginBottom: "8px"}}>
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
                  <Form.Item name="warehouse" label="Warehouse" style={{ marginBottom: "8px" }}>
                    <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={onWarehouseChange}
                    >
                      {warehouseData.map((data, index) => (
                        <Option key={data.recordid} title={data.name} value={data.recordid}>
                          {data.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="type" label="Type" style={{ marginBottom: "8px" }} 
                  rules={[
                    {
                      required: true,
                      message: "please select type",
                    },
                  ]}
                  >
                    <Select
                      allowClear
                      showSearch
                      filterOption={(input, Option) => Option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={onTypeChange}
                    >
                      <Option key="1" value="CC">CC - Cyclic Count</Option>
                      <Option key="2" value="FC">FC - Full Count</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="date" label="Date" style={{ marginBottom: "8px" }}>
                    <DatePicker style={{ width: '100%' }} onChange={getDateChange} />
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
              <Form layout="vertical" form={skuupcform} name="control-hooks1" onFinish={onFinish} style={{display: appConfig.sku === "N" && appConfig.upc === "N" ? '' : 'none'}}>
                  <Form.Item name="UPC-SKU" label="" style={{marginBottom:'0'}}>
                  <Input placeholder="Scan UPC/SKU" autoFocus={AutoFocusValue} onKeyPress={scanUpcOrSku}
                  suffix={
                    <img alt="img" src ={barcodeImage}
                    />
                  } />
                  </Form.Item>
              </Form>
              </Col>
              <Col className="gutter-row" span={12}>
                {/* <div style={{float:'right'}}>
                  <Tooltip placement="top" title={"Download Template"}>
                    <Button size="small" onClick={downloadImportTemplate}>
                      <DownloadOutlined />
                    </Button>
                  </Tooltip>
                  &nbsp;&nbsp;
                  <input id="choosefile" type="file" accept=".csv" onChange={readFileData} />
                </div> */}
              </Col>
            </Row>
          </div>
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
                        <Button size="small">
                          Change Price
                        </Button>
                      &nbsp;
                    </span>  
                 :null} 
                  {appConfig.downloadtemplate === "Y" ? 
                    <span>
                      <Tooltip placement="top" title={"Download Template"}>
                        <Button size="small" onClick={downloadImportTemplate}>
                          <DownloadOutlined />
                        </Button>
                      </Tooltip>
                      &nbsp;
                    </span>  
                 :null} 
                 {appConfig.Import === "Y" ? 
                    <span>
                      <Button size="small" onClick={getImportModal}>
                        Import
                      </Button>
                    </span>  
                 :null}              
                </div>
              }
            >
              <TabPane tab="Products" key="10"

              >
                <Card style={{ marginBottom: "8px" }}>
                  <Form layout="vertical" form={form} name="editable-form" onFinish={onFinish}>
                    <Row gutter={16}>
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="skuValue" label="SKU" style={{ marginBottom: "8px" }}>
                        <Select
                                className="certain-category-search"
                                dropdownClassName="certain-category-search-dropdown"
                                dropdownMatchSelectWidth={false}
                                dropdownStyle={{ width: '10%' }}
                                showSearch
                                onSearch = {clearFields}
                                filterOption={(input, option) =>
                                  option.props.children !== undefined
                                    ? option.props.children
                                        .toString()
                                        .toLowerCase()
                                        .indexOf(input.toString().toLowerCase()) >= 0
                                    : ''
                                }
                                style={{ width: '100%', border: '1.5px solid #808080e0' }}
                                onSelect={onSelectedproducts}
                              >
                                {productList}
                              </Select>
                        </Form.Item>
                      </Col>
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
          
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="qtycount" label="Qty Count" style={{ marginBottom: "8px" }}>
                          <Input onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col>
                      {appConfig.cost === "Y" ? <Col className="gutter-row" span={4}>
                        <Form.Item name="cost" label="Cost" style={{ marginBottom: "8px" }}>
                          <Input onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col> : ""}
                      {appConfig.batch === "Y" ? <Col className="gutter-row" span={4}>
                        <Form.Item name="batch" label="Batch" style={{ marginBottom: "8px" }}>
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
                      </Col> : ""}
                      {appConfig.batchno === "Y" ? <Col className="gutter-row" span={4}>
                        <Form.Item name="batchNo" label="Batch No" style={{ marginBottom: "8px" }}>
                          <Input disabled={filedDisabled} onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col>: ""}
                      {appConfig.mfgdate === "Y" ? <Col className="gutter-row" span={4}>
                        <Form.Item  name="mfg_date" label="Mfg Date" style={{ marginBottom: "8px" }}>
                          <DatePicker disabled={filedDisabled} onChange={OnChangeOrderQty} style={{width:'100%'}} />
                        </Form.Item>
                      </Col> : ""}
                      {appConfig.mfgdate === "Y" ? <Col className="gutter-row" span={4}>
                        <Form.Item name="expiry_date"  label="Expiry Date" style={{ marginBottom: "8px" }}>
                          <DatePicker disabled={filedDisabled} onChange={OnChangeOrderQty} style={{width:'100%'}}  />
                        </Form.Item>
                      </Col> : ""}
                      {appConfig.qtyonhand === "Y" ? <Col className="gutter-row" span={4}>
                        <Form.Item name="qtyOnHand" label="Qty On Hand" style={{ marginBottom: "8px" }}>
                          <Input />
                        </Form.Item>
                      </Col> : null}
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="description" label="Remarks" style={{ marginBottom: "8px" }}>
                          <Input onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>
                <Card>
                <Table 
                  // rowClassName={(record, index) => record.key === selectedProductObject.key ? 'table-row-dark' :  'table-row-light'}
                  columns={tableColumns} 
                  dataSource={productData}
                  style={{ fontSize: "12px" }}
                  size="small"
                  sticky={true}
                  scroll={{ y: "37.5vh",x: "100%"}}
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
              <Button loading={loading} onClick={createInventoryCount}>
                Confirm
              </Button>,
            ]}
          >
            <h3 style={{ textAlign: "center" }}>Stock Count Summary</h3>
            <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
              {summaryDiv}
            </Spin>
          </Modal>
          <Modal visible={importModalVisible} onCancel={importModalClose} closable={null} centered width="50%" footer={[<Button onClick={importModalClose}>Close</Button>]}>
        <h3 style={{ textAlign: "center" }}>Import Products</h3>
        <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
          <Card>
            <Form layout="vertical" form={importform} name="importform">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="importProductsDiscountType" label="Discount Type">
                    <Select style={{ width: "100%" }} >
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
                    <input id="choosefile" type="file" accept=".csv" />
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

export default StockCount