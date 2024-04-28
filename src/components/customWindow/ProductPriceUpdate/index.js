
import React,{useState} from 'react'
import {Card, Row,Col,Button,Form,Select,Tooltip,Table,message} from 'antd';
import { ExportToCsv } from 'export-to-csv'
import {getPriceListData} from "../../../services/custom"
import Axios from 'axios'
// import {serverUrl} from '../../../constants/serverConfig'
import {DownloadOutlined} from "@ant-design/icons";


const {Option}=Select;


const ProductPriceUpdate=()=> {
  const [loading, setLoading] = useState(true)
  const [priceListname, setPriceListName] = useState([]) 
  const [priceId, setPriceId] = useState('')
   const[newData, setNewData] = useState([])
   const serverUrl = process.env.REACT_APP_serverUrl;

  const priceList=async()=>{
    let usersData = JSON.parse(localStorage.getItem("userData"));
        const priceListResponce=await getPriceListData(usersData.cs_client_id) 
         setPriceListName(priceListResponce)
  }
  const selectprice=(e)=>{
    setPriceId(e)
  }
  const columns=[
    {  
    
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      // width:80
     },
     { 
      title: 'Sale Price',
      dataIndex: 'saleprice',
      key: 'saleprice',
      // width:80
     },
     { 
     title: 'MRP',
     dataIndex: 'mrp',
     key: 'mrp', 
    //  width:80
    
    },
  
    ]


  const downloadImportTemplate = () =>{
    const options = {
      fieldSeparator: ',',
      filename: 'ProductPrice',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      headers: ['sku','salesprice','mrp'] 
    }
    const csvExporter = new ExportToCsv(options)
      csvExporter.generateCsv([{'sku':'','salesprice':'','mrp':''}])
  }

  const readDataInFile=(e)=>{
    const { files } = e.target;
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
            if (cells.length === 3) {
              dataArr.push({
                sku: cells[0],
                saleprice: cells[1],
                mrp: cells[2],
                
              })
            } 
        
          }
  
            setNewData(dataArr) 
        
      }
    reader.readAsText(file);
     }    
  }
  const confirm=()=>{
    setLoading(true)
    if(newData.length>0){
     let usersData = JSON.parse(localStorage.getItem("userData"));
     const priceToken = JSON.parse(localStorage.getItem("authTokens")); 
     const arrayvalues=[] 
     let    sku=''
     let   saleprice=''
     let    mrp=''

     for (let index = 0; index < newData.length; index++){ 
      sku= newData[index].sku
      saleprice= newData[index].saleprice 
      mrp= newData[index].mrp
      arrayvalues.push(
        `{
            value :"${sku}",
            salePrice :"${saleprice}",      
            listPrice :"${mrp}",
        }`, 
       
      )
     
     } 
     const createprice={
       query:`mutation {
        importSalesPriceList(priceList:{
        priceListId:"${priceId}"
        createdby:"${usersData.user_id}"
        products:[${arrayvalues}]
           }) {
            status
            message
          }
        }`
       } 
       Axios({
       url: serverUrl,
      method: 'POST',
      data: createprice,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${priceToken}`,
      },
    }).then((response)=>{
        if(response.data.data!==null){
         const responseFromServer = response.data.data.importSalesPriceList
         if (responseFromServer.status === '200') {
          message.success(responseFromServer.message)  
          setNewData([])  
          setLoading(false) 
          document.getElementById('choosefile').value = null    
        }
        else{
          message.error(responseFromServer.message)
          document.getElementById('choosefile').value = null
          setNewData([])
          setLoading(false)
        }
        }

    })
  }else{
    message.error("Please import products,then try!")
  }
  }  
   return ( 
            <div>
              <Row> 
                    <Col span={12}>
                        <h2 style={{fontSize:'16px',fontWeight:'700',color: "rgb(0 0 0 / 65%)",marginBottom: "0px", marginTop: "1%" }}>Price List</h2>
                    </Col>
                    <Col span={12}>
                      <span style={{float:'right'}}>
                          <Button   style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={confirm}>Confirm</Button>
                      </span>
                    </Col> 
              </Row> 
              <Card  style={{ marginBottom: "8px" }}>
                 <Form layout='vertical'>
                      <Row gutter={12}>   
                        <Col className="gutter-row" span={6}>
                              <Form.Item label="Price List" name="pricelist" style={{ marginBottom: "8px" }}
                              >
                                <Select 
                                onSelect={selectprice}
                                onFocus={priceList}
                                    showSearch>
                                    {priceListname.map((list)=>(
                                      <Option key={list.sPricelistID} >{list.name}</Option>
                                    ))}
                                </Select> 
                              </Form.Item>  
                        </Col>
                       </Row> 
        
                  </Form> 
              </Card> 
                <Row> 
                      <Col span={12}>
                          <h2 >Product</h2>
                      </Col> 
                      <Col span={12}>
                          <span style={{float:'right',marginTop:'2%' ,marginBottom:'3%'}}>
                              <Tooltip placement="top" title={"Download Template"}>
                                  <Button style={{height:'29px'}} size="small" onClick={downloadImportTemplate} >
                                    <DownloadOutlined />
                                  </Button>
                                </Tooltip> &nbsp;
                                <Form style={{float:'right',marginTop:'-2px'}}>
                                  
                                  <Form.Item >
                                  <input  id="choosefile" type="file" accept=".csv" 
                                  onChange={readDataInFile}
                                  />
                                  </Form.Item>
                              </Form>
                          </span>
                        </Col>
                </Row> 
             <Table  spinning={loading}
                      size="small"
                      columns={columns} 
                      dataSource={newData} 
                      pagination={false} > 
            </Table>
            </div>
        )
    
}

export default ProductPriceUpdate
 