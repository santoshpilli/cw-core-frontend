import React,{useState} from "react";
import {Form,Modal} from "antd"
import schema from "./schema.json"
import Customcommon from "../customCommon";
import { v4 as uuid } from "uuid";
import moment from "moment";
import {createOrder} from "../../../services/custom"
import {getSelectorDataFromApi,getPrintTemplateForCustom ,getPrintDownloadData} from "../../../services/generic"
import { useGlobalContext } from "../../../lib/storage";


const NewStockTransferReceipt = () =>{
    const { globalStore } = useGlobalContext();
    const userData = globalStore.userData
    const dateTimeFormat = "YYYY-MM-DD HH:mm:ss"
    const [auditLog,setAuditLog] = useState({})
    const [statusBarData,setStatusBarData] = useState([])
    const [selectedOption, setSelectedOption] = useState([]);
    const [dataSource,setDatasource] = useState([])
    const [saveFlag,setSaveFlag] = useState(false)
    const [selectedHistoryRecord,setSelectedHistoryRecord] = useState({})
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm()
    const onFinish = (values) => {
        if(selectedOption.source && selectedOption.destination){
        setLoading(true)
        let date =moment(values.date).format('YYYY-MM-DD')
        let currentDate = moment(new Date()).format(dateTimeFormat)
        let remarks = values.remarks
        let sourcebunit = selectedOption.source?.recordId
        let sourcebname = selectedOption.source?.name
        let destibunit = selectedOption.destination?.recordId
        let destibunitname = selectedOption.destination?.name
        let stockIssueId = selectedOption.stockIssue?.recordId
        let uniqueId = uuid()
        .replace(/-/g, "")
        .toUpperCase();
        let uniqueId2 = selectedHistoryRecord?.dataLoad?.stockReceiptID === undefined || selectedHistoryRecord?.dataLoad?.stockReceiptID === null ? uuid().replace(/-/g, "").toUpperCase() : selectedHistoryRecord?.dataLoad?.stockReceiptID;
        let linesData = []
        let productid =""
        let issueQty = ""
        let productCode = ""
        let productName= ""
        let stockReceiptLineID =""
        let issueLineID =""
        let category = ""
        for (let index = 0; index < dataSource.length; index++) {
            productid = dataSource[index].productid;
            issueQty = dataSource[index].qty;
            productCode = dataSource[index].value;
            productName = dataSource[index].product;
            issueLineID = dataSource[index].issueLineId
            category = dataSource[index].category
            stockReceiptLineID = dataSource[index].stockReceiptLineid === undefined || dataSource[index].stockReceiptLineid === null || dataSource[index].stockReceiptLineid === "" ?  uuid().replace(/-/g, "").toUpperCase(): dataSource[index].stockReceiptLineid;
            linesData.push(
             {
                stockIssueLineID:issueLineID === undefined || issueLineID === null || issueLineID === "" ?null:`${issueLineID}`,
                stockReceiptLineID:`${stockReceiptLineID}`,
                productID:`${productid}`,
                receiptQty:issueQty,
                productCode:`${productCode}`,
                productName:`${productName}`,
                category:`${category}`
              }  
            )
        }

        let dataLoad = {
            stockIssueID:stockIssueId === undefined || stockIssueId === null || stockIssueId === "" ?null:`${stockIssueId}`,
            sourceBunitId:`${sourcebunit}`,
            stockReceiptID:`${uniqueId2}`,
            sourceBunitName:`${sourcebname}`,
            receiptDate:`${date}`,
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
        let type = "STR"
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
        getPrintPdffile(selectedHistoryRecord.dataLoad.stockReceiptID)
      }

      const getPrintPdffile = async(recordId) =>{
        const response = await getPrintTemplateForCustom("7296","3E14F3E26D9D4AC8812D75779315D741",recordId)
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
        dataSource[index].category = data.category
      }

      const getdraftData = async(id,jsonToSend) =>{
        setLoading(true)
        const response = await getSelectorDataFromApi(id,jsonToSend)
        for (let index = 0; index < response.length; index++) {
            response[index].key = uuid().replace(/-/g, "").toUpperCase();
            response[index].product = response[index].pname;
            response[index].stock = response[index].qtyissued;
            response[index].productid = response[index].m_product_id;
            response[index].qty = response[index].qtyreceived;
            response[index].value = response[index].value;
            response[index].category = response[index].category
            response[index].requestLineId = response[index].m_transferrequest_line_id;
            response[index].issueId = response[index].m_transferissue_id;
            response[index].issueLineId = response[index].m_transferissue_line_id;
        }
        setDatasource(response)
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
                'stockIssue':{recordId:row.dataLoad.stockIssueID,name:null}
            }
            setSelectedOption(obj)

            let newDataLoad = []
            const data2 = row.dataLoad.lines
            for (let index = 0; index < data2.length; index++) {   
                let obj = {
                    key:uuid().replace(/-/g, "").toUpperCase(),
                    product:data2[index].productName,
                    productid:data2[index].productID,
                    qty:data2[index].receiptQty,
                    value:data2[index].productCode,
                    requestId:'',
                    category:data2[index].category,
                    requestLineId:data2[index].stockRequestLineID,
                    issueLineId:data2[index].stockIssueLineID,
                    stockReceiptLineid : data2[index].stockReceiptLineID,
                    issueDate:data2[index].receiptDate
                }
                newDataLoad.push(obj)
            }
            setDatasource(newDataLoad)
            form.setFieldsValue({'source':row.dataLoad.sourceBunitName,'destination':row.dataLoad.destinationBunitName,'stockIssue':'','remarks':row.dataLoad.remarks,
            'date':row.dataLoad.receiptDate ? moment(row.dataLoad.receiptDate):moment()})
            setLoading(false)
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
            transationType={"STR"}
            getHistorySelectedData={getHistorySelectedData}
            selectedHistoryRecord={selectedHistoryRecord}
            loading={loading}
            auditLog={auditLog}
            statusBarData={statusBarData}
            getPrint={getPrint}
            recordId={selectedHistoryRecord?.dataLoad?.stockReceiptID}
            processDataForLines={processDataForLines}
            importFlag={selectedOption.source && selectedOption.destination ? true : false}
        />
        </>
    )
}

export default NewStockTransferReceipt;