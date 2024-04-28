import React,{useState,useEffect} from 'react'
import {Card,Row,Col,Button,Form,Select,Tabs,Input,Spin,Modal,Tooltip,DatePicker,Radio,message,Table} from 'antd'
import { LoadingOutlined ,DownloadOutlined,EditOutlined} from "@ant-design/icons";
import { ExportToCsv } from 'export-to-csv'
import { v4 as uuid } from 'uuid'
import moment from 'moment'
import Axios from 'axios'
import { getOAuthHeaders } from '../../../constants/oAuthValidation';
import { getWarehouse,getWastageData} from "../../../services/generic";
import { getInventoryProduct ,getRoleBusinessUnit,getAppSetupData } from "../../../services/custom";
// import {serverUrl,genericUrl,fileDownloadUrl} from '../../../constants/serverConfig'
import "./antdClass.css"
import "antd/dist/antd.css";
import "../../../styles/antd.css";
import barcodeImage from '../../../assets/images/barcode.svg'

const {Option} = Select
const {TabPane} = Tabs
const dateFormat = 'YYYY-MM-DD'

const WastageEntry = (props) => {
const [bunitData,setBunitData] = useState([])
const [bunitId,setBunitId] = useState('')
const [businessUnitName,setBusinessUnitName] = useState('')
const [loading,setLoading] = useState(false)
const [productData,setProductData] = useState([])
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
const [wastageTypesData,setWastageTypesData] = useState([])
const [appConfig, setAppConfig] = useState({});


const [form] = Form.useForm();
const [headerform] = Form.useForm()
const [summaryForm] = Form.useForm()
const [skuupcform] = Form.useForm()

useEffect(() => {
  getBusinessUnit()
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
getAppSetup();
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
      rowSelectedProduct(text)
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
    title: 'Write-off Count',
    dataIndex: 'qtycount',
    width: 80,
  },
  {
    title: 'Remarks',
    dataIndex: 'remarks',
    width: 120,
  },
]


const getBusinessUnit = async () =>{
  const userData = JSON.parse(window.localStorage.getItem('userData'))
  const businessUnitResponse = await getRoleBusinessUnit(userData.user_id)
  headerform.setFieldsValue({
    businessUnit : businessUnitResponse.bUnitName
  })
  setBusinessUnitName(businessUnitResponse.bUnitName)
  setBunitId(businessUnitResponse.defaultCsBunitId)
  setBunitData(businessUnitResponse.userBunit)
  const warehouseResponse = await getWarehouse(businessUnitResponse.defaultCsBunitId)
  setWarehouseData(warehouseResponse)
}

const getAppSetup = async () => {
  const val = "Wastage Entry";
  const response = await getAppSetupData(val);
  if (response.length > 0) {
    setAppConfig(JSON.parse(response[0].configJson));
  };
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
  const formFieldsData = form.getFieldsValue(true);
  const qtycount = formFieldsData.qtycount
  const remarks = formFieldsData.description

  const selectedMProductId= selectedProductObject.mProductId
  const selectedCsUomId = selectedProductObject.csUomId
  selectedProductObject.qtycount = qtycount
  selectedProductObject.remarks = remarks

      const index = productData.findIndex(element => {
        return element.mProductId === selectedMProductId && element.csUomId === selectedCsUomId
    })
    const newArray =[]
    if (index >= 0) {
      productData.splice(index, 1);
    }
    for (let index = 0; index < productData.length; index++) {
      newArray.push(productData[index]);
      
    }
    newArray.unshift(selectedProductObject)
    setTimeout(() => {
      setProductData([])
      setProductData(newArray)
    }, 1);
}

const scanUpcOrSku = (event) =>{
  const authHeaders = getOAuthHeaders();
  if (authHeaders && authHeaders.email && authHeaders.access_token) {
  const code = event.keyCode || event.which
  const upcVal = event.target.value
  if (code === 13) {
    if(productData.length > 0 ){
    skuupcform.resetFields(['UPC-SKU'])
    let upcOrSku;
          if(radioValue === 1){
            upcOrSku = 'upc'
          }else{
            upcOrSku = 'searchKey'
          }
          const getProducts = {
            query: `query{ 
            getInventoryProduct1(
            ${upcOrSku}:"${upcVal}"){
            mProductId
            value
            name 
            upc
            csUomId
            uomName
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
            const responseData = response.data.data.getInventoryProduct1
           const responsecsUomId = responseData.csUomId
           const responsemProductId = responseData.mProductId
           const index = productData.findIndex(element => {
            return element.mProductId === responsemProductId && element.csUomId === responsecsUomId
           })
           if (index >= 0) {
            let newArray = []
            let arrayforForm={}
      
            for (let index = 0; index < productData.length; index++) {
              const mProductId = productData[index].mProductId;
              const csUomId = productData[index].csUomId;
              if(mProductId === responsemProductId && csUomId === responsecsUomId){
                setSelectedProductObject({})
                productData[index].qtycount = productData[index].qtycount === undefined || productData[index].qtycount === '' || productData[index].qtycount === 0 ? 1 : parseInt(productData[index].qtycount) + 1
                arrayforForm=productData[index]
              }
              newArray.push(productData[index])
            }
            setSelectedProductObject(arrayforForm)
            form.setFieldsValue({
              'skuValue':arrayforForm.value,
              'productName':arrayforForm.name,
              'uomName':arrayforForm.uomName,
              'qtycount':arrayforForm.qtycount,
            })
            const newArray2 = []
          for (let index = 0; index < newArray.length; index++) {
            const productIdFromArray = newArray[index].mProductId;
            if(productIdFromArray !==responsemProductId){
              newArray2.push(newArray[index])
            }
          }
            newArray2.unshift(arrayforForm)
            setProductData([])
            setProductData(newArray2)
           }else{
             if(responseData.csUomId === null || responseData.mProductId === null){
               message.error("Product not found!")
             }else{
             let newArray = []
             let arrayforForm={}
            const Obj= responseData
            Obj.qtycount = 1
            for (let index2 = 0; index2 < productData.length; index2++) {
              newArray.push(productData[index2]);
            }
            newArray.unshift(Obj)
            arrayforForm=Obj
            setSelectedProductObject(arrayforForm)
            form.setFieldsValue({
              'skuValue':arrayforForm.value,
              'productName':arrayforForm.name,
              'uomName':arrayforForm.uomName,
              'qtycount':arrayforForm.qtycount,
            })
            setProductData([])
            setProductData(newArray)
             }
           }
          })
        }else{
          message.error("Please select header first")
        }
        }
      }
}

const inventorySummaryReview = () =>{
  summaryForm.setFieldsValue({
    'summbusinessunit':businessUnitName,
    'warehouseName':warehouseName,
    'summreceiptdate':moment(selectedDate,dateFormat),
  })
  const newArray = []
    for (let index = 0; index < productData.length; index++) {
      const element = parseFloat(productData[index].qtycount);
        if(element > 0){
          newArray.push(productData[index])
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
  const newArray = []
    for (let index = 0; index < productData.length; index++) {
      const element = parseFloat(productData[index].qtycount);
        if(element > 0){
          newArray.push(productData[index])
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
          if (cells.length === 2) {
            dataArr.push({
              sku: cells[0],
              qtycount: parseInt(cells[1]),
            })
          }
        } 
        if (dataArr.length > 0) {
          const newData = []
          for (let index = 0; index < dataArr.length; index++) {
            const qtycount = parseFloat(dataArr[index].qtycount);
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
          const finalDataArray = [...matchedArray,...unmatchedArray]
          setProductData([])
          setProductData(finalDataArray)
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
  for (let index2 = 0; index2 < inventoryCountSummaryData.length; index2++) {
    productId = inventoryCountSummaryData[index2].mProductId
    csUomId = inventoryCountSummaryData[index2].csUomId
    countQty = inventoryCountSummaryData[index2].qtycount === undefined || inventoryCountSummaryData[index2].qtycount === null ? 0 :inventoryCountSummaryData[index2].qtycount
    countData.push(
        `{
          mProductId : "${productId}"
          csUomId : "${csUomId}"
          qty : ${countQty}
        }`,
    )
  }
  const getBookinOrder = {
    query: `mutation {
        insertStockWriteOff (wastage : {
          mWastageId :"${uniqueId}"
          csBunitId : "${bunitId}"
          mWarehouseId: "${mwarehouseId}"
          createdby : "${userId}"
          type : "${type}"
          date : "${selectedDate}"
          description : ""
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
    if(response.data.data.insertStockWriteOff.status === "SUCCESS"){
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
      const recordId = response.data.data.insertStockWriteOff.recordId
      const message = response.data.data.insertStockWriteOff.message
      const orderNo = response.data.data.insertStockWriteOff.documentNo
      getPrintCofirmation(recordId,message,orderNo)
    }else{
      message.error("Failed to insert wastage")
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
    query: `query {reportTemplate(ad_tab_id:"21E55DED98F646839B881D2B3917860D",recordId:"${recordId}")}`,
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
    filename: 'StockWriteOffImport',
    // quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: false,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ['Sku','Count']  
  }
  const csvExporter = new ExportToCsv(options)
  csvExporter.generateCsv([{'Sku':'','Count':''}])
}

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
  const inventoryProductsResponse = await getInventoryProduct(bunitId,mwarehouseId)
  for (let index = 0; index < inventoryProductsResponse.length; index++) {
    const uniqueId = uuid()
      .replace(/-/g, '')
      .toUpperCase()
    inventoryProductsResponse[index].key = uniqueId;
  }
  setProductData(inventoryProductsResponse)
  setLoading(false)
}
const rowSelectedProduct = (data) =>{
  setSelectedProductObject(data)
  form.setFieldsValue({
    'skuValue':data.value,
    'productName':data.name,
    'uomName':data.uomName,
    'qtycount':data.qtycount,
    'description':data.description
  })
}

const getWastageTypes = async () =>{
  const wastageTypeResponse = await getWastageData()
  setWastageTypesData(wastageTypeResponse)
}

      let totalQuantity=0;
      let totalQuantity1;
      for (let index = 0; index < inventoryCountSummaryData.length; index++) {
        totalQuantity1 = inventoryCountSummaryData[index].qtycount;
        const integer = parseFloat(totalQuantity1, 10)
        totalQuantity += integer
      }

const productList = productData.map(data => (
  <Option key={data.key} title={data.name} data={data} value={data.value}>
    {data.value}-{data.name}
  </Option>
))

const onSelectedproducts = (e,data) =>{
  const selectedProductdata = data.props.data
  form.setFieldsValue({
    'skuValue':data.value,
    'productName':data.name,
    'uomName':data.uomName,
    'qtycount':data.qtycount,
    'description':data.description
  })

  let newArray = []
      let arrayforForm={}
      const responsecsUomId = selectedProductdata.csUomId
     const responsemProductId = selectedProductdata.mProductId
     let newUnique;
      for (let index = 0; index < productData.length; index++) {
        const mProductId = productData[index].mProductId;
        const csUomId = productData[index].csUomId;
        if(mProductId === responsemProductId && csUomId === responsecsUomId){
          setSelectedProductObject({})
          newUnique = productData[index].key
          productData[index].qtycount = productData[index].qtycount === undefined || productData[index].qtycount === '' || productData[index].qtycount === 0 ? 1 : parseInt(productData[index].qtycount) + 1
          arrayforForm =  productData[index]
        }
        newArray.push(productData[index])
      }
      let newArray2=[]
      for (let index = 0; index < newArray.length; index++) {
        const element = newArray[index].key;
        if(newUnique === element){
          newArray2.unshift(newArray[index])
        }else{
          newArray2.push(newArray[index])
        }
      }
      form.setFieldsValue({
        'skuValue':arrayforForm.value,
        'productName':arrayforForm.name,
        'uomName':arrayforForm.uomName,
        'qtycount':arrayforForm.qtycount,
      })
      setSelectedProductObject(arrayforForm)
      setProductData([])
      setProductData(newArray2)
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
              <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>Wastage Entry</h2>
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
                    <Select allowClear showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={onWarehouseChange}>
                      {warehouseData.map((data, index) => (
                        <Option key={data.recordid} title={data.name} value={data.recordid}>
                          {data.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    name="type"
                    label="Type"
                    style={{ marginBottom: "8px" }}
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
                    onFocus = {getWastageTypes}
                    >
                    {wastageTypesData.map((data, index) => (
                        <Option key={data.id} title={data.name} value={data.id}>
                          {data.name}
                        </Option>
                      ))}
                      {/* <Option key="1" value="DM">
                        DM - Damage
                      </Option>
                      <Option key="2" value="EX">
                        EX - Expired
                      </Option>
                      <Option key="2" value="SC">
                        SC - Scrap
                      </Option> */}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="date" label="Date" style={{ marginBottom: "8px" }}>
                    <DatePicker style={{ width: "100%" }} onChange={getDateChange} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <Radio.Group onChange={onChangeRadio} value={radioValue}>
                {appConfig.upc === "Y" ? <Radio value={1}>UPC</Radio> : ''}
                {appConfig.sku === "Y" ? <Radio value={2}>SKU</Radio> : ''}
                </Radio.Group>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form layout="vertical" form={skuupcform} name="control-hooks1" onFinish={onFinish}>
                  <Form.Item name="UPC-SKU" label="" style={{ marginBottom: "0" }}>
                    <Input placeholder="Scan UPC/SKU" style={{display: appConfig.sku === "N" && appConfig.upc === "N" ? 'none' : ''}} autoFocus={AutoFocusValue} onKeyPress={scanUpcOrSku} suffix={<img alt="img" src={barcodeImage} />} />
                  </Form.Item>
                </Form>
              </Col>
              {/* <Col className="gutter-row" span={12}>
                <div style={{ float: "right" }}>
                  <Tooltip placement="top" title={"Download Template"}>
                    <Button size="small" onClick={downloadImportTemplate}>
                      <DownloadOutlined />
                    </Button>
                  </Tooltip>
                  &nbsp;&nbsp;
                  <input id="choosefile" type="file" accept=".csv" onChange={readFileData} />
                </div>
              </Col> */}
            </Row>
          </div>
          <div>
            <Tabs defaultActiveKey={tabKey} onChange={callbackTabs} type="card" tabBarStyle={{ marginBottom: "0px" }}
            tabBarExtraContent={
            <div style={{ float: "right" }}>
            <Tooltip placement="top" title={"Download Template"}>
              <Button size="small" onClick={downloadImportTemplate}>
                <DownloadOutlined />
              </Button>
            </Tooltip>
            &nbsp;&nbsp;
            <input id="choosefile" type="file" accept=".csv" onChange={readFileData} />
          </div>}
            >
              <TabPane tab="Products" key="10">
                <Card style={{ marginBottom: "8px" }}>
                  <Form layout="vertical" form={form} name="editable-form" onFinish={onFinish}>
                    <Row gutter={16}>
                      <Col className="gutter-row" span={4}>
                        <Form.Item name="skuValue" label="SKU" style={{ marginBottom: "8px" }}>
                          {/* <Input readOnly style={{ border: "none", background: "rgb(241 243 247 / 68%)" }} /> */}
                          <Select
                                className="certain-category-search"
                                dropdownClassName="certain-category-search-dropdown"
                                dropdownMatchSelectWidth={false}
                                dropdownStyle={{ width: '10%' }}
                                showSearch
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
                        <Form.Item name="qtycount" label="Write-off" style={{ marginBottom: "8px" }}>
                          <Input onChange={OnChangeOrderQty} />
                        </Form.Item>
                      </Col>
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
                  rowClassName={(record, index) => (record.key === selectedProductObject.key ? "table-row-dark" : "table-row-light")}
                  columns={tableColumns}
                  dataSource={productData}
                  style={{ fontSize: "12px" }}
                  size="small"
                  sticky={true}
                  scroll={{y: "37.5vh",x: "100%"}}
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
            <h3 style={{ textAlign: "center" }}>Wastage Entry Summary</h3>
            <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
              {summaryDiv}
            </Spin>
          </Modal>
        </div>
      </Spin>
    );
}

export default WastageEntry