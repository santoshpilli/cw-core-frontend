import React,{useState} from "react";
import {Form,Button,Row,Col,Card,Modal} from "antd"
import schema from "./schema.json"
import Customcommon from "../customCommon";
import { v4 as uuid } from "uuid";
import moment from "moment";
import {getPrintTemplateForCustom ,getPrintDownloadData} from "../../../services/generic"
import {createOrder} from "../../../services/custom"
import { useGlobalContext } from "../../../lib/storage";

const Wastage = () =>{
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
        if(selectedOption.businessunit && selectedOption.wastageType){
        setLoading(true)
        let remarks = values.remarks
        let date =moment(values.date).format('YYYY-MM-DD')
        let currentDate = moment(new Date()).format(dateTimeFormat)
        let sourcebunit = selectedOption.businessunit?.recordId
        let sourcebname = selectedOption.businessunit?.name
        let wastageType = selectedOption.wastageType?.recordId
        let wastageTypeName = selectedOption.wastageType?.name
        let uniqueId1 =  selectedHistoryRecord?.dataLoad?.mWastageId === undefined || selectedHistoryRecord?.dataLoad?.mWastageId === null ? uuid().replace(/-/g, "").toUpperCase() : selectedHistoryRecord?.dataLoad?.mWastageId;  
        let linesData = []
        let productid =""
        let issueQty = ""
        let productCode = ""
        let productName= ""
        let mWastageLineId = "" 
        let category = ""
        
        for (let index = 0; index < dataSource.length; index++) {
            productid = dataSource[index].productid;
            issueQty = dataSource[index].qty;
            productCode = dataSource[index].value;
            productName = dataSource[index].product;
            mWastageLineId = dataSource[index].mWastageLineId === undefined || dataSource[index].mWastageLineId === null ?  uuid().replace(/-/g, "").toUpperCase():dataSource[index].mWastageLineId;
            category= dataSource[index].category
            linesData.push(
             {
                mWastageLineId:`${mWastageLineId}`,
                productID:`${productid}`,
                qty:issueQty,
                productCode:`${productCode}`,
                productName:`${productName}`,
                category:`${category}`,
                batchId:null
              }  
            )
        }

        let dataLoad = {
            mWastageId:`${uniqueId1}`,
            csBunitId:`${sourcebunit}`,
            sourcebname:`${sourcebname}`,
            wastageTypeName:`${wastageTypeName}`,
            date:`${date}`,
            wastageType:`${wastageType}`,
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
        let type = "WAG"
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
        getPrintPdffile(selectedHistoryRecord.dataLoad.mWastageId)
      }

      const getPrintPdffile = async(recordId) =>{
        const response = await getPrintTemplateForCustom("7360","21E55DED98F646839B881D2B3917860D",recordId)
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
        dataSource[index].value = data.value
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
                'wastageType':{recordId:row.dataLoad.wastageType,name:row.dataLoad.wastageTypeName},
            }
            setSelectedOption(obj)

            let newDataLoad = []
            const data2 = row.dataLoad.lines
            for (let index = 0; index < data2.length; index++) {   
                let obj = {
                    key:uuid().replace(/-/g, "").toUpperCase(),
                    product:data2[index].productName,
                    productid:data2[index].productID,
                    qty:data2[index].qty,
                    value:data2[index].productCode,
                    category : data2[index].category,
                    mWastageLineId:data2[index].mWastageLineId
                }
                newDataLoad.push(obj)
            }
            setDatasource(newDataLoad)
            form.setFieldsValue({'businessunit':row.dataLoad.sourcebname,'wastageType':row.dataLoad.wastageTypeName,'remarks':row.dataLoad.remarks,
            'date':row.dataLoad.date ? moment(row.dataLoad.date):moment()})
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
            clearScreen={clearScreen}
            transationType={"WAG"}
            getHistorySelectedData={getHistorySelectedData}
            selectedHistoryRecord={selectedHistoryRecord}
            auditLog={auditLog}
            statusBarData={statusBarData}
            getPrint={getPrint}
            recordId={selectedHistoryRecord?.dataLoad?.mWastageId}
            processDataForLines={processDataForLines}
            importFlag={selectedOption.businessunit && selectedOption.wastageType ? true : false}
        />
        </>
    )
}

export default Wastage;