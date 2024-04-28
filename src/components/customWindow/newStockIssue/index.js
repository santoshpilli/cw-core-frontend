import React,{useState} from "react";
import {Form,Modal,Spin} from "antd"
import schema from "./schema.json"
import Customcommon from "../customCommon";
import { v4 as uuid } from "uuid";
import moment from "moment";
import {createOrder} from "../../../services/custom"
import {getPrintDownloadData, getPrintTemplateForCustom, getSelectorDataFromApi} from "../../../services/generic"
import { useGlobalContext } from "../../../lib/storage";

const NewStockIssue = () =>{
    const { globalStore } = useGlobalContext();
    const userData = globalStore.userData
    const dateTimeFormat = "YYYY-MM-DD HH:mm:ss"
    const [selectedOption, setSelectedOption] = useState([]);
    const [dataSource,setDatasource] = useState([])
    const [saveFlag,setSaveFlag] = useState(false)
    const [selectedHistoryRecord,setSelectedHistoryRecord] = useState({})
    const [loading, setLoading] = useState(false);
    const [auditLog,setAuditLog] = useState({})
    const [statusBarData,setStatusBarData] = useState([])

    const [form] = Form.useForm()
    const onFinish = (values) => {
        if(selectedOption.source && selectedOption.destination){
        setLoading(true)
        let remarks = values.remarks
        let date =moment(values.date).format('YYYY-MM-DD')
        let currentDate = moment(new Date()).format(dateTimeFormat)
        let sourcebunit = selectedOption.source?.recordId
        let sourcebname = selectedOption.source?.name
        let destibunit = selectedOption.destination?.recordId
        let destibunitname = selectedOption.destination?.name
        let stockRequest = selectedOption.stockRequest?.recordId
        let uniqueId = selectedHistoryRecord?.dataLoad?.stockIssueID === undefined || selectedHistoryRecord?.dataLoad?.stockIssueID === null ? uuid().replace(/-/g, "").toUpperCase() : selectedHistoryRecord?.dataLoad?.stockIssueID;
        let linesData = []
        let productid =""
        let issueQty = ""
        let productCode = ""
        let productName= ""
        let stockRequestLineiD =""
        let issueLineID =""
        let category = ""
        for (let index = 0; index < dataSource.length; index++) {
            productid = dataSource[index].productid;
            issueQty = dataSource[index].qty;
            productCode = dataSource[index].value;
            productName = dataSource[index].product;
            category = dataSource[index].category
            stockRequestLineiD = dataSource[index].requestLineId
            issueLineID = dataSource[index].issueLineId === undefined || dataSource[index].issueLineId === null || dataSource[index].issueLineId === "" ? uuid().replace(/-/g, "").toUpperCase():dataSource[index].issueLineId;
            linesData.push(
             {
                stockIssueLineID:`${issueLineID}`,
                stockRequestLineID:stockRequestLineiD === undefined || stockRequestLineiD === null || stockRequestLineiD === "" ? null :`${stockRequestLineiD}`,
                productID:`${productid}`,
                issueQty:issueQty,
                productCode:`${productCode}`,
                productName:`${productName}`,
                category:`${category}`
              }  
            )
            
        }
        let dataLoad = {
            stockIssueID:`${uniqueId}`,
            stockRequestID:stockRequest === undefined || stockRequest === null || stockRequest === "" ? null :`${stockRequest}`,
            sourceBunitId:`${sourcebunit}`,
            sourceBunitName:`${sourcebname}`,
            issueDate:`${date}`,
            destinationBunitId:`${destibunit}`,
            destinationBunitName:`${destibunitname}`,
            remarks: remarks === undefined || remarks === null ? null : `${remarks}`,
            created:auditLog.created === undefined || auditLog.created === null ? `${currentDate}`:`${auditLog.created}`,
            createdby:auditLog.createdby === undefined || auditLog.createdby === null ?`${userData.user_id}`:`${auditLog.createdby}`,
            createdbyName:auditLog.createdbyName === undefined || auditLog.createdbyName === null ?`${userData.user}`:`${auditLog.createdbyName}`,
            updated:`${currentDate}`,
            updatedby:`${userData.user_id}`,
            updatedbyName:`${userData.user}`,
            lines:linesData
        }
        const dataToSubmit = JSON.stringify(JSON.stringify(dataLoad))
        createNewOrder(dataToSubmit)
       }

      };

      const createNewOrder = async(dataToSubmit)=>{
        let transactionQueId = uuid()
        .replace(/-/g, "")
        .toUpperCase();
        let type = "STI"
        let action = ""
        if(saveFlag === true){
            action= "Save"
        }else{
            action= "Process"
 
        }

        let newtransactionid =""
        if(selectedHistoryRecord?.transactionQueueId){
            newtransactionid = selectedHistoryRecord?.transactionQueueId 
        }else{
            newtransactionid =  transactionQueId
        }

        const response = await createOrder(dataToSubmit,type,action,newtransactionid)
        if(response.data.data.transactionQueue.code === "200"){
              getPrintCofirmation(response.data.data.transactionQueue.recordId,response.data.data.transactionQueue.message,response.data.data.transactionQueue.referenceNo)
              setLoading(false)
              setSaveFlag(false)
              form.resetFields()
              setSelectedOption([])
              setDatasource([])
              setSelectedHistoryRecord({})
              setAuditLog({})
              setStatusBarData([])
        }else{
            Modal.error({
                width:'600px',
                title: "Failed to create",
                content: null,
                closable: true,
                footer: null,
                icon: null,
              }); 
              setLoading(false)
              setSaveFlag(false)
              setSelectedOption([])
              setDatasource([])
              form.resetFields()
              setSelectedHistoryRecord({})
              setAuditLog({})
              setStatusBarData([])
        }
      } 

      const getPrintCofirmation = (recordId,message,referenceNo) => {
        Modal.confirm({
          width:'600px',
          title:<span>
                {message} <br />
                Reference No:{referenceNo}
                </span> ,
          content: 'Do you want take Printout',
          okText: 'Yes',
          icon:null,
          cancelText: 'No',
          onOk() {
            getPrintPdffile(recordId)
          },
          onCancel() {
          },
        });
      }

      const getPrint = () =>{
        getPrintPdffile(selectedHistoryRecord.dataLoad.stockIssueID)
      }

      const getPrintPdffile = async(recordId) =>{
        const response = await getPrintTemplateForCustom("7295","27B699CCCB404265BFCCA9470C4BFD1F",recordId)
        if(response.data.data.reportTemplate){
        getPrintCommand(response.data.data.reportTemplate)
        }
      }

      const getPrintCommand = async(fileName) =>{
        const downloadPrintData  = await getPrintDownloadData(fileName)
        const fileURL = window.URL.createObjectURL(new Blob([downloadPrintData.data]))
        const link = document.createElement('a')
        link.setAttribute('id', 'downloadlink')
        link.href = fileURL
        link.setAttribute('download', `${fileName}`)
        link.click()
      }

      const changeQty = (e,fieldname,index) =>{
        dataSource[index][fieldname] = e
      }

      const getselectedProductData = (data,fieldname,index) =>{
        dataSource[index][fieldname] = data.name
        dataSource[index].productid = data.recordid
        dataSource[index].value = data.value
        dataSource[index].stock = data.stock === null ? 0 : data.stock
        dataSource[index].category = data.category
      }

      const getdraftData = async(id,jsonToSend) =>{
        setLoading(true)
        const response = await getSelectorDataFromApi(id,jsonToSend)
        let productCodes = []
        for (let index = 0; index < response.length; index++) {
            productCodes.push(response[index].value)
            response[index].key = uuid().replace(/-/g, "").toUpperCase();
            response[index].product = response[index].name;
            response[index].productid = response[index].m_product_id;
            response[index].qty = response[index].qtyrequested;
            response[index].value = response[index].value;
            response[index].requestId = response[index].m_transferrequest_id;
            response[index].requestLineId = response[index].m_transferrequest_line_id;   
        }
        syncProductData(productCodes,selectedOption.source?.recordId,response)
        setLoading(false)
        }

        const clearScreen = () =>{
            setSaveFlag(false)
            setSelectedOption([])
            setDatasource([])
            form.resetFields()
            setSelectedHistoryRecord({})
            setAuditLog({})
            setStatusBarData([])
        }

        const syncProductData = async(productCodes,bu,hisData) =>{
            let obj= {name:"null",value:productCodes,cs_bunit_id:bu}
            const stringifiedJSON = JSON.stringify(obj);
            const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
            const response = await getSelectorDataFromApi('64895b56972763299598e7bc',jsonToSend)
            const data1 = response
            const data2 = hisData
            for (let index = 0; index < data2.length; index++) {  
                 const data2ProductCode = data2[index].value
                for (let index = 0; index < data1.length; index++) {
                    const data1ProductCode = data1[index].value
                    if(data1ProductCode === data2ProductCode){
                        data2[index].stock = data1[index].stock === null? 0 : data1[index].stock
                        data2[index].category = data1[index].category

                    }
                    
                }
            }
            setDatasource(data2)
            setLoading(false)
        }

        const getHistorySelectedData = (row,value) =>{
            setLoading(true)
            setSelectedHistoryRecord(row)
            let auditObj = {
                "created":row.dataLoad.created,
                "createdby":row.dataLoad.createdby,
                "createdbyName":row.dataLoad.createdbyName,
                "updated":row.dataLoad.updated,
                "updatedby":row.dataLoad.updatedby,
                "updatedbyName":row.dataLoad.updatedbyName
            }
            const statusBar = [
                {
                titleName:"Document No #",
                titleValue:row.dataLoad.documentNo
                },
                {
                    titleName:"Reference No #",
                    titleValue:row.referenceNo
                },
                {
                    titleName:"Status",
                    titleValue:row.status
                }
            ]
            setStatusBarData(statusBar)
            setAuditLog(auditObj)
            let obj = {
                'source':{recordId:row.dataLoad.sourceBunitId,name:row.dataLoad.sourceBunitName},
                'destination':{recordId:row.dataLoad.destinationBunitId,name:row.dataLoad.destinationBunitName},
                'stockRequest':{recordId:row.dataLoad.stockRequestID,name:null}
            }
            setSelectedOption(obj)

            let newDataLoad = []
            let productCodes = []
            const data2 = row.dataLoad.lines
            for (let index = 0; index < data2.length; index++) {  
                productCodes.push(data2[index].productCode)  
                let obj = {
                    key:uuid().replace(/-/g, "").toUpperCase(),
                    product:data2[index].productName,
                    productid:data2[index].productID,
                    qty:data2[index].issueQty,
                    value:data2[index].productCode,
                    requestId:'',
                    requestLineId:data2[index].stockRequestLineID,
                    category : data2[index].category,
                    issueLineId:data2[index].stockIssueLineID
                }
                newDataLoad.push(obj)
            }
            syncProductData(productCodes,row.dataLoad.sourceBunitId,newDataLoad)
            form.setFieldsValue({'source':row.dataLoad.sourceBunitName,'destination':row.dataLoad.destinationBunitName,'stockRequest':'',remarks:row.dataLoad.remarks,
            'date':row.dataLoad.issueDate ? moment(row.dataLoad.date):moment()})
        }

        const processDataForLines = (data) =>{
            setLoading(true)
            for (let index = 0; index < data.length; index++) {
              let uniqueId = uuid().replace(/-/g, "").toUpperCase()
              data[index].key = uniqueId
              data[index].productid= data[index].recordid;
              data[index].qty = parseFloat(data[index].importqty);
              data[index].value = data[index].value;
              data[index].product = data[index].name;
              data[index].category  = data[index].category;
              data[index].stock  = data[index].stock;
            }
            setDatasource(data)
            setLoading(false)
        }

    return (
        <>
        <Customcommon
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            form={form}
            schema={schema}
            onFinish={onFinish}
            dataSource={dataSource}
            setDatasource={setDatasource}
            changeQty={changeQty}
            getselectedProductData={getselectedProductData}
            saveFlag={saveFlag}
            setSaveFlag={setSaveFlag}
            getdraftData={getdraftData}
            clearScreen={clearScreen}
            transationType={"STI"}
            getHistorySelectedData={getHistorySelectedData}
            selectedHistoryRecord={selectedHistoryRecord}
            loading={loading}
            auditLog={auditLog}
            statusBarData={statusBarData}
            getPrint={getPrint}
            recordId={selectedHistoryRecord?.dataLoad?.stockIssueID}
            processDataForLines={processDataForLines}
            importFlag={selectedOption.source && selectedOption.destination ? true : false}
        />
        </>
    )
}

export default NewStockIssue;