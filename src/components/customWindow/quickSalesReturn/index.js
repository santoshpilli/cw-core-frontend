import React,{useState} from "react";
import {Form,Modal} from "antd"
import schema from "./schema.json"
import Customcommon from "../customCommon";
import { v4 as uuid } from "uuid";
import moment from "moment";
import {createOrder} from "../../../services/custom"
import {getSelectorDataFromApi,getPrintTemplateForCustom ,getPrintDownloadData} from "../../../services/generic"
import { useGlobalContext } from "../../../lib/storage";

const QuickSalesReturn = () =>{
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
        form.validateFields()
        if(selectedOption.businessunit && selectedOption.customer){
        setLoading(true)
        let date =moment(values.date).format('YYYY-MM-DD')
        let currentDate = moment(new Date()).format(dateTimeFormat)
        let sourcebunit = selectedOption.businessunit?.recordId
        let sourcebname = selectedOption.businessunit?.name
        let orderIdFromSo = selectedOption.so?.recordId
        let soName = selectedOption.so?.name
        let customerId = selectedOption.customer?.recordId
        let customerName = selectedOption.customer?.name
        let returnReason = selectedOption.returnReason?.recordId
        let returnReasonName = selectedOption.returnReason?.name
        let remarks = values.remarks
        let uniqueId1 =  selectedHistoryRecord?.dataLoad?.sOrderId === undefined || selectedHistoryRecord?.dataLoad?.sOrderId === null ? uuid().replace(/-/g, "").toUpperCase() : selectedHistoryRecord?.dataLoad?.sOrderId;  
        let orderLineId = ""
        let linesData = []
        let productid =""
        let issueQty = ""
        let productCode = ""
        let productName= ""
        let category = ""
        let sOrderLineId = ""
        let soqty = ""
        let unitPrice = ""

        for (let index = 0; index < dataSource.length; index++) {
            productid = dataSource[index].productid;
            issueQty = dataSource[index].qty;
            soqty = dataSource[index].soqty? dataSource[index].soqty:0
            productCode = dataSource[index].value;
            productName = dataSource[index].product;
            category =  dataSource[index].category;
            unitPrice = dataSource[index].unitPrice
            sOrderLineId = dataSource[index].sOrderLineId === undefined || dataSource[index].sOrderLineId === null || dataSource[index].sOrderLineId === "" ? uuid().replace(/-/g, "").toUpperCase() :dataSource[index].sOrderLineId
            orderLineId = dataSource[index].orderLineId === undefined || dataSource[index].orderLineId === null || dataSource[index].orderLineId === "" ? null :dataSource[index].orderLineId
            linesData.push(
             {
                sOrderLineId:`${sOrderLineId}`,
                orderLineId:orderLineId === undefined || orderLineId === null ? null :`${orderLineId}`,
                productID:`${productid}`,
                soqty:soqty,
                qty:issueQty,
                productCode:`${productCode}`,
                productName:`${productName}`,
                isReturn:"Y",
                isManual:"Y",
                unitPrice:unitPrice,
              }  
            )
        }

        let dataLoad = {
            orderId:orderIdFromSo === undefined || orderIdFromSo === null ? null :`${orderIdFromSo}`,
            returnReason:`${returnReason}`,
            sOrderId:`${uniqueId1}`,
            csBunitId:`${sourcebunit}`,
            sourcebname:`${sourcebname}`,
            sCustomerId:`${customerId}`,
            customerName:`${customerName}`,
            dateOrdered:`${date}`,
            datePromised:`${date}`,
            soName:soName === undefined || soName === null ? null :`${soName}`,
            returnReasonName:`${returnReasonName}`,
            isReturn:"Y",
            remarks:remarks === undefined || remarks === "" || remarks === null ? null : `${remarks}`,
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
        let type = "SRE"
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
        getPrintPdffile(selectedHistoryRecord.dataLoad.sOrderId)
      }

      const getPrintPdffile = async(recordId) =>{
        const response = await getPrintTemplateForCustom("7532","8CE09FAB98FD4A3CBF921E78F3761232",recordId)
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
        dataSource[index].poqty = 0
        dataSource[index].value = data.value
      }

      const getdraftData = async(id,jsonToSend) =>{
        setLoading(true)
        const response = await getSelectorDataFromApi(id,jsonToSend)
        for (let index = 0; index < response.length; index++) {
            response[index].key = uuid().replace(/-/g, "").toUpperCase();
            response[index].product = response[index].productname;
            response[index].productid = response[index].m_product_id;
            response[index].value = response[index].value;
            response[index].orderLineId = response[index].s_orderline_id
            response[index].unitPrice = response[index].unitprice
            response[index].soqty = response[index].qty
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
                'businessunit':{recordId:row.dataLoad.csBunitId,name:row.dataLoad.sourcebname},
                'customer':{recordId:row.dataLoad.sCustomerId,name:row.dataLoad.customerName},
                'so':{recordId:row.dataLoad.orderId,name:row.dataLoad.soName},
                'returnReason':{recordId:row.dataLoad.returnReason,name:row.dataLoad.returnReasonName}
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
                    qty:data2[index].qty,
                    soqty:data2[index].soqty,
                    unitPrice:data2[index].unitPrice,
                    value:data2[index].productCode,
                    category : data2[index].category,
                    sOrderLineId:data2[index].sOrderLineId,
                    orderLineId : data2[index].orderLineId
                }
                newDataLoad.push(obj)
            }
            setDatasource(newDataLoad)
            form.setFieldsValue({'businessunit':row.dataLoad.sourcebname,'customer':row.dataLoad.customerName,'so':row.dataLoad.soName,'returnReason':row.dataLoad.returnReasonName,'remarks':row.dataLoad.remarks,
            'date':row.dataLoad.dateOrdered ? moment(row.dataLoad.dateOrdered):moment()})
            setLoading(false)
        }

        const processDataForLines = (data) =>{
          setLoading(true)
          for (let index = 0; index < data.length; index++) {
            let uniqueId = uuid().replace(/-/g, "").toUpperCase()
            data[index].key = uniqueId
            data[index].productid= data[index].recordid;
            data[index].qty = parseFloat(data[index].importqty);
            data[index].total = parseFloat(data[index].importqty) * (data[index].price)
            data[index].value = data[index].value;
            data[index].product = data[index].name;
            data[index].category  = data[index].category;
            data[index].stock  = data[index].stock;
            data[index].price  = data[index].price;
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
            transationType={"SRE"}
            getHistorySelectedData={getHistorySelectedData}
            selectedHistoryRecord={selectedHistoryRecord}
            auditLog={auditLog}
            statusBarData={statusBarData}
            getPrint={getPrint}
            recordId={selectedHistoryRecord?.dataLoad?.sOrderId}
            processDataForLines={processDataForLines}
            importFlag={selectedOption.businessunit && selectedOption.customer ? true : false}
        />
        </>
    )
}

export default QuickSalesReturn;
