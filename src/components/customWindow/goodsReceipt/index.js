import React,{useState} from "react";
import {Form,Modal} from "antd"
import schema from "./schema.json"
import Customcommon from "../customCommon";
import { v4 as uuid } from "uuid";
import moment from "moment";
import {createOrder} from "../../../services/custom"
import {getSelectorDataFromApi,getPrintTemplateForCustom ,getPrintDownloadData} from "../../../services/generic"
import { useGlobalContext } from "../../../lib/storage";

const GoodsReceipt = () =>{
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
        if(selectedOption.businessunit && selectedOption.supplier){
        setLoading(true)
        let remarks = values.remarks
        let date =moment(values.date).format('YYYY-MM-DD')
        let currentDate = moment(new Date()).format(dateTimeFormat)
        let sourcebunit = selectedOption.businessunit?.recordId
        let sourcebname = selectedOption.businessunit?.name
        let porderId = selectedOption.po?.recordId
        let poName = selectedOption.po?.name
        let supplierId = selectedOption.supplier?.recordId
        let supplierName = selectedOption.supplier?.name
        let uniqueId1 =  selectedHistoryRecord?.dataLoad?.mReceiptID === undefined || selectedHistoryRecord?.dataLoad?.mReceiptID === null ? uuid().replace(/-/g, "").toUpperCase() : selectedHistoryRecord?.dataLoad?.mReceiptID;  
        let linesData = []
        let productid =""
        let issueQty = ""
        let productCode = ""
        let productName= ""
        let category = ""
        let p_orderline_id = ""
        let mReceiptLineID = "" 
        for (let index = 0; index < dataSource.length; index++) {
            productid = dataSource[index].productid;
            issueQty = dataSource[index].qty;
            productCode = dataSource[index].value;
            productName = dataSource[index].product;
            category =  dataSource[index].category;
            p_orderline_id = dataSource[index].p_orderline_id
            mReceiptLineID = dataSource[index].mReceiptLineID === undefined || dataSource[index].mReceiptLineID === null ?  uuid().replace(/-/g, "").toUpperCase():dataSource[index].mReceiptLineID;
            linesData.push(
             {
                mReceiptLineID:`${mReceiptLineID}`,
                productID:`${productid}`,
                receiveQty:issueQty,
                productCode:`${productCode}`,
                productName:`${productName}`,
                pOrderLineId:p_orderline_id === undefined || p_orderline_id === null || p_orderline_id === "" ? null :`${p_orderline_id}`,
                category:`${category}`,
                startDate:null,
                endDate:null
              }  
            )
        }

        let dataLoad = {
            mReceiptID:`${uniqueId1}`,
            sourceBunitId:`${sourcebunit}`,
            sourcebname:`${sourcebname}`,
            pSupplierId:`${supplierId}`,
            supplierName:`${supplierName}`,
            poName:poName === undefined || poName === null || poName === "" ? null :`${poName}`,
            pOrderId:porderId === undefined || porderId === null || porderId === "" ? null: `${porderId}`,
            movementDate:`${date}`,
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
        let type = "GRN"
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
        getPrintPdffile(selectedHistoryRecord.dataLoad.mReceiptID)
      }

      const getPrintPdffile = async(recordId) =>{
        const response = await getPrintTemplateForCustom("7363","0953FB1201D94CA39671ADF5D4CB967B",recordId)
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
        dataSource[index].category = data.category
        dataSource[index].stock = data.stock === null ? 0 : data.stock
        dataSource[index].value = data.value
      }

      
      const getdraftData = async(id,jsonToSend) =>{
        setLoading(true)
        const response = await getSelectorDataFromApi(id,jsonToSend)
        for (let index = 0; index < response.length; index++) {
            response[index].key = uuid().replace(/-/g, "").toUpperCase();
            response[index].product = response[index].productname;
            response[index].productid = response[index].m_product_id;
            response[index].stock = response[index].qty;
            response[index].value = response[index].value;
            response[index].p_orderline_id = response[index].p_orderline_id
        
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
                'businessunit':{recordId:row.dataLoad.sourceBunitId,name:row.dataLoad.sourcebname},
                'supplier':{recordId:row.dataLoad.pSupplierId,name:row.dataLoad.supplierName},
                'po':{recordId:row.dataLoad.pOrderId,name:row.dataLoad.poName}
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
                    qty:data2[index].receiveQty,
                    value:data2[index].productCode,
                    category : data2[index].category,
                    p_orderline_id:data2[index].pOrderLineId,
                    mReceiptLineID:data2[index].mReceiptLineID
                }
                newDataLoad.push(obj)
            }
            setDatasource(newDataLoad)
            form.setFieldsValue({'businessunit':row.dataLoad.sourcebname,'supplier':row.dataLoad.supplierName,'po':row.dataLoad.poName,'remarks':row.dataLoad.remarks,
            'date':row.dataLoad.movementDate ? moment(row.dataLoad.movementDate):moment()})
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
            loading={loading}
            saveFlag={saveFlag}
            setSaveFlag={setSaveFlag}
            getdraftData={getdraftData}
            clearScreen={clearScreen}
            transationType={"GRN"}
            getHistorySelectedData={getHistorySelectedData}
            selectedHistoryRecord={selectedHistoryRecord}
            auditLog={auditLog}
            statusBarData={statusBarData}
            getPrint={getPrint}
            recordId={selectedHistoryRecord?.dataLoad?.mReceiptID}
            processDataForLines={processDataForLines}
            importFlag={selectedOption.businessunit && selectedOption.supplier ? true : false}
        />
        </>
    )
}

export default GoodsReceipt;
