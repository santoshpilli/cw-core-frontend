import React,{useState,useEffect} from "react";
import {Row,Col,Card,Input,Radio,Table } from 'antd'
import closeIcon from "../../../assets/images/closeIcon.png";
import { SearchOutlined } from "@ant-design/icons";
import {getHistoryDataWithTransactionQue} from "../../../services/custom"
import { useGlobalContext } from "../../../lib/storage";
import moment from 'moment'

const HistoryComponent = (props) =>{
  const { globalStore } = useGlobalContext();
  const userPreferences = globalStore.userPreferences;
  const dateFormat = userPreferences.dateFormat
    const {transationType,getHistorySelectedData,setIsvisible} = props;    
    const [value, setValue] = useState(1);
    const [searchedValue,setSearchedValue] = useState('')
    const [historyDataSource,setHistoryDataSource] = useState([])
    useEffect(()=>{
        getHistory(1)
    },[])

    const onChange = async(e) => {
        setValue(e.target.value);
        getHistory(e.target.value)
      };

     const getHistory = async(val) =>{
        const response = await getHistoryDataWithTransactionQue(null,val === 1 ? "DR":"CO",transationType)
        if(response.data.data){
            let transQueData = response.data.data.transactionQueue
            for (let index = 0; index < transQueData.length; index++) {
                transQueData[index].dataLoad = JSON.parse(transQueData[index].dataLoad)
            }
            for (let index = 0; index < transQueData.length; index++) {
              transQueData[index].dataLoad.date = transQueData[index].dataLoad.issueDate || transQueData[index].dataLoad.receiptDate || transQueData[index].dataLoad.date || transQueData[index].dataLoad.movementDate || transQueData[index].dataLoad.dateOrdered 

            }
            setHistoryDataSource(response.data.data.transactionQueue)
        }
     }

      const getData = async(event) => {
        let status;
        if(value === 1){
            status = "DR"
        }else{
            status = "CO"
        }
        const response = await getHistoryDataWithTransactionQue(event,status,transationType)
        if(response.data.data){
            let transQueData = response.data.data.transactionQueue
            for (let index = 0; index < transQueData.length; index++) {
                transQueData[index].dataLoad = JSON.parse(transQueData[index].dataLoad)
            }
            for (let index = 0; index < transQueData.length; index++) {
              transQueData[index].dataLoad.date = transQueData[index].dataLoad.issueDate || transQueData[index].dataLoad.receiptDate || transQueData[index].dataLoad.date || transQueData[index].dataLoad.movementDate || transQueData[index].dataLoad.dateOrdered 
            }
            setHistoryDataSource(response.data.data.transactionQueue)
        }
      }
      
      const debounce = (fn, d) => {
        let timer
        return function() {
          let context = searchedValue,
            args = arguments
          clearTimeout(timer)
          timer = setTimeout(() => {
            getData.apply(context, arguments)
          }, d)
        }
      }

 const debounceLog = debounce(getData, 500)
  
  const searchDropdownRecords = (e) => {
      setSearchedValue(e.target.value)
      debounceLog(e.target.value)
  }

  const historyColumns = [
    {
        title: <span style={{paddingLeft:'15px'}}>Document No</span>,
        dataIndex: 'documentNo',
        width: 150,
        render: (text, row, index) => (
          <div style={{ display: 'flex', flexDirection: 'column',paddingLeft:'15px',fontSize:'12px'}}>
            {row.dataLoad.documentNo ?
            <p style={{ margin: '0' }}>{row.dataLoad.documentNo}</p>:null}
            <p style={{ margin: '0' }}>{
               (moment(row.dataLoad.date).format(dateFormat))
            }</p>
            <p style={{ margin: '0' }}>{row.referenceNo}</p>
          </div>
        ),
    },
    {
        title: '',
        dataIndex: '',
        width: 100,
        render:(text, row,index) => (
            <span onClick={()=>getHistorySelectedData(row,value)} style={{textDecoration:'underline',color:'#2A55DF',float:'right',fontSize:'12px',paddingRight:'15px'}}>
                View
            </span>
        )
    },
  ]

    return (
        <div>
            <Card bodyStyle={{paddingLeft:'7px',paddingRight:'7px',paddingBottom:'20px'}} style={{border:'1px solid #E4E4E4',borderRadius:'4px',boxShadow:'0px 0px 10px 1px rgba(0, 0, 0, 0.04)'}}>
                <Row gutter={16}>
                    <Col span={12} style={{fontFamily:'Inter',paddingLeft:'21px',paddingTop:'14px'}}>
                        <h3 style={{color:'#192228',fontSize:'14px'}}>HISTORY</h3>
                    </Col>
                    <Col span={12} style={{paddingRight:'21px',paddingTop:'16px'}}>
                        <img src={closeIcon} onClick={()=>setIsvisible(false)} alt="close" style={{float:'right',cursor:'pointer'}} height={15} width={15} />
                    </Col>
                </Row>
                <Row gutter={16} style={{marginBottom:'10px'}}>
                  <Col span={24} style={{paddingLeft:'21px',paddingRight:'21px'}}>
                  <Input
                    placeholder="Search..."
                    className="searchInput"
                    value={searchedValue}
                    suffix={<SearchOutlined style={{ color: "#d7dade" }} />}
                    onChange={searchDropdownRecords}
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24} style={{fontFamily:'Inter',paddingLeft:'21px',paddingRight:'21px'}}>
                  <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1} style={{fontSize:'12px'}}>Draft</Radio>
                    <Radio value={2} style={{fontSize:'12px'}}>Completed</Radio>
                  </Radio.Group>
                  </Col>
                </Row>
                <br />
                <Row gutter={16}>
                <Col span={24} style={{paddingLeft:'8px',paddingRight:'4px'}} >
                    <Table 
                    columns={historyColumns} 
                    dataSource={historyDataSource}
                    style={{ fontSize: "12px" }}
                    size="small"
                    bordered
                    sticky={true}
                    scroll={{ y: "47.5vh",x: "100%"}}
                    pagination={false}
                   />
                </Col>
                </Row>
            </Card>
        </div>
    )
}


export default HistoryComponent;