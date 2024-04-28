import React,{useState} from "react";
import {Form,Modal} from "antd"
import schema from "./schema.json"
import Customcommon from "../customCommon";
import { v4 as uuid } from "uuid";
import moment from "moment";
import {createOrder} from "../../../services/custom"
import {getSelectorDataFromApi,getPrintTemplateForCustom ,getPrintDownloadData} from "../../../services/generic"
import { useGlobalContext } from "../../../lib/storage";


const NewStockCount = () =>{
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
        if(selectedOption.businessunit && selectedOption.ctype){
        setLoading(true)
        let remarks = values.remarks
        let date =moment(values.date).format('YYYY-MM-DD')
        let currentDate = moment(new Date()).format(dateTimeFormat)
        let sourcebunit = selectedOption.businessunit?.recordId
        let sourcebname = selectedOption.businessunit?.name
        let Type = selectedOption.ctype?.recordId
        let TypeName = selectedOption.ctype?.name
        let uniqueId1 =  selectedHistoryRecord?.dataLoad?.mInventoryId === undefined || selectedHistoryRecord?.dataLoad?.mInventoryId === null ? uuid().replace(/-/g, "").toUpperCase() : selectedHistoryRecord?.dataLoad?.mInventoryId;  
        let linesData = []
        let productid =""
        let issueQty = ""
        let productCode = ""
        let productName= ""
        let mInventoryLineId = "" 
        let category = ""
        let stock =""
        let qtyVarience = ""    
        for (let index = 0; index < dataSource.length; index++) {
            productid = dataSource[index].productid;
            issueQty = dataSource[index].qty;
            productCode = dataSource[index].value;
            productName = dataSource[index].product;
            category =  dataSource[index].category;
            stock = dataSource[index].stock;
            qtyVarience = dataSource[index].qtyVarience;

            mInventoryLineId = dataSource[index].mInventoryLineId === undefined || dataSource[index].mInventoryLineId === null ?  uuid().replace(/-/g, "").toUpperCase():dataSource[index].mInventoryLineId;

            linesData.push(
             {
                mInventoryLineId:`${mInventoryLineId}`,
                productID:`${productid}`,
                qtyOnHand:stock,
                qtyCount:issueQty,
                qtyVarience:qtyVarience,
                productCode:`${productCode}`,
                productName:`${productName}`,
                category:`${category}`,
                expdate:null,
                mfgDate:null
              }  
            )
        }

        let dataLoad = {
            mInventoryId:`${uniqueId1}`,
            csBunitId:`${sourcebunit}`,
            sourcebname:`${sourcebname}`,
            TypeName:`${TypeName}`,
            date:`${date}`,
            inventoryType:`${Type}`,
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
        let type = "SCT"
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
        getPrintPdffile(selectedHistoryRecord.dataLoad.mInventoryId)
      }

      const getPrintPdffile = async(recordId) =>{
        const response = await getPrintTemplateForCustom("7359","C3196330421C4C6D95505A04C39439B8",recordId)
        if(response.data?.data?.reportTemplate){
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
        dataSource[index].qtyVarience = (dataSource[index].stock) - e 
      }

      const getselectedProductData = (data,fieldname,index) =>{
        dataSource[index][fieldname] = data.name
        dataSource[index].productid = data.recordid
        dataSource[index].category = data.category
        dataSource[index].stock = data.stock === null ? 0 : data.stock
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
                'businessunit':{recordId:row.dataLoad.csBunitId,name:row.dataLoad.sourcebname},
                'ctype':{recordId:row.dataLoad.inventoryType,name:row.dataLoad.TypeName},
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
                    qty:data2[index].qtyCount,
                    stock:data2[index].qtyOnHand,
                    qtyVarience:data2[index].qtyVarience,
                    value:data2[index].productCode,
                    category : data2[index].category,
                    mInventoryLineId:data2[index].mInventoryLineId
                }
                newDataLoad.push(obj)
            }
            syncProductData(productCodes,row.dataLoad.csBunitId,newDataLoad)
            form.setFieldsValue({'businessunit':row.dataLoad.sourcebname,'ctype':row.dataLoad.TypeName,'remarks':row.dataLoad.remarks,
            'date':row.dataLoad.date ? moment(row.dataLoad.date):moment()})
        }

        const processDataForLines = (data) =>{
            setLoading(true)
            for (let index = 0; index < data.length; index++) {
              let uniqueId = uuid().replace(/-/g, "").toUpperCase()
              data[index].key = uniqueId
              data[index].productid= data[index].recordid;
              data[index].qty = parseFloat(data[index].importqty);
              data[index].qtyVarience = data[index].stock - parseFloat(data[index].importqty);
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
            loading={loading}
            clearScreen={clearScreen}
            transationType={"SCT"}
            getHistorySelectedData={getHistorySelectedData}
            selectedHistoryRecord={selectedHistoryRecord}
            auditLog={auditLog}
            statusBarData={statusBarData}
            getPrint={getPrint}
            recordId={selectedHistoryRecord?.dataLoad?.mInventoryId}
            processDataForLines={processDataForLines}
            importFlag={selectedOption.businessunit && selectedOption.ctype ? true : false}
        />
        </>
    )
}

export default NewStockCount;
