import React, { useState, useEffect } from "react";
import { Card, Tabs, Row, Col, Form, Select, Checkbox, Button, message, Spin,Input } from "antd";
import { LoadingOutlined,MinusCircleOutlined } from "@ant-design/icons";
import { useGlobalContext } from "../../../lib/storage";
import Axios from "axios";
// import { serverUrl } from "../../../constants/serverConfig";
import ApprovalLogging from './approvallogging'
import StoreOpenClose from "./storeopenclose.js";
import EBill from './eBill'
import "antd/dist/antd.css";
import "../../../styles/antd.css";  
import { getOAuthHeaders } from "../../../constants/oAuthValidation";
import ThemeJson from "../../../constants/UIServer.json"
const { TabPane } = Tabs;
const { Option } = Select;

const POSConfiguration = () => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const authHeaders = getOAuthHeaders();
  const serverUrl = process.env.REACT_APP_serverUrl;
  const [checkedValueShowOrderSalesRep, setCheckedValueShowOrderSalesRep] = useState(1);
  const [checkedValueShowLineSalesRep, setCheckedValueShowLineSalesRep] = useState(1);
  const [checkedValueShowSalesReturn, setCheckedValueShowSalesReturn] = useState(1);
  const [checkedValueShowWeightPopup, setCheckedValueShowWeightPopup] = useState(1);
  const [checkedValueShowTillOpening, setCheckedValueShowTillOpening] = useState(1);
  const [checkedValueShowDenominations, setCheckedValueShowDenominations] = useState(1);
  const [checkedValuePrintReceipt, setCheckedValuePrintReceipt] = useState(1); 
  const [checkedValueAddLoyaltyLevel, setCheckedValueAddLoyaltyLevel] = useState(1); 

  const [checkedValueLoyaltyApplicable, setCheckedValueLoyaltyApplicable] = useState(1);
  const [checkedValueShowImage, setcheckedValueShowImage] = useState(1);


  const [checkedValueGRPrintPdf, setCheckedValueGRPrintPdf] = useState(1);
  const [checkedValueGREditPrice, setCheckedValueGREditPrice] = useState(1);
  const [checkedValueGREditMRP, setCheckedValueGREditMRP] = useState(1); 

  const [checkedValueSTReceipt, setCheckedValueSTReceipt] = useState(1); 
  const [checkedValueSTReceiptPrintPdf, setCheckedValueSTReceiptPrintPdf] = useState(1); 
  const [checkedValueSTReceiptStockReturn, setCheckedValueSTReceiptStockReturn] = useState(1);
  const  [checkedValueSTReceiptShowBatch, setCheckedValueSTReceiptShowBatch] = useState(1);

  const  [checkedValueImageUpload, setcheckedValueImageUpload] = useState(1); 
  const  [checkedValueWGPrintPDF, setCheckedValueWGPrintPDF] = useState(1);
  const  [checkedValueWastageShowBatch, setCheckedValueWastageShowBatch] = useState(1);

  const [approvalLoggingValues, setApprovalLoggingValues] = useState({}); 
  const [eBillValues, setEBillValues] = useState({});   

  const  [checkedValueSOCOptional, setCheckedValueSOCOptional] = useState(true);  
  const  [checkedValueSOCOpenCheck,setCheckedValueSOCOpenCheck]=useState(true);
  const  [checkedValueSOCCloseCheck,setCheckedValueSOCCloseCheck]=useState(true);

  const [checkedValueEBCompanyLogo, setCheckedValueEBCompanyLogo] = useState(1);
  const [checkedValueEBOrderDate, setCheckedValueEBOrderDate] = useState(1);
  const [checkedValueEBOrderTime, setCheckedValueEBOrderTime] = useState(1); 

  const [checkedValueEBCustomerName, setCheckedValueEBCustomerName] = useState(1);
  const [checkedValueEBCustomerReview, setCheckedValueEBCustomerReview] = useState(1);
  const [checkedValueEBCompanyWebsite, setCheckedValueEBCompanyWebsite] = useState(1); 

  const [checkedValueEBDownloadInvoice, setCheckedValueEBDownloadInvoice] = useState(1);
  const [checkedValueEBSocialMedia, setCheckedValueEBSocialMedia] = useState(1);
  const [checkedValueEBWebsite, setCheckedValueEBWebsite] = useState(1); 

  const [checkedValueEBTermsConditions, setCheckedValueEBTermsConditions] = useState(1);
  const [checkedValueEBenableBill,setCheckedValueEBenableBill] =  useState(1)

  const [loading, setLoading] = useState(false);

  const [mainForm] = Form.useForm();


  useEffect(() => {
    getConfigData("POS");
    setApprovalLoggingValues({})
    getConfigData("GRN")
    getConfigData("STReceipt")
    getConfigData("Wastage")
    getConfigData("Day Close")
    getConfigData("Logging")
    getConfigData("E-Bill")
    getConfigData("Store-Open-Close-CkeckList")

  }, []);

  const posConfigTabsData = (posConfigResponse)=>{
    if (posConfigResponse.length > 0) {

      const posConfigRecord = posConfigResponse[0];
      const { application, configJson } = posConfigRecord;
    
      const stringifiedConfig = JSON.parse(configJson)
      if (application === "POS") { 
        const posParsedConfigJSON = stringifiedConfig; 
        const { defaultSearchScreen, showOrderSalesRep, showLineSalesRep, defaultCustomerSearch, showSalesReturn, showWeightPopup, showCustomerSearch, showTillOpening, showDenominations, printReceipt,addLoyaltyLevel,loyaltyApplicable,loyaltyLevelID,showImage} = posParsedConfigJSON;
        mainForm.setFieldsValue({ defaultSearchScreen: defaultSearchScreen, defaultCustomerSearch: defaultCustomerSearch, showCustomerSearch: showCustomerSearch,loyaltyLevelID:loyaltyLevelID });
        if (showOrderSalesRep === "Y") {
          setCheckedValueShowOrderSalesRep(1);
        } else {
          setCheckedValueShowOrderSalesRep(0);
        }

        if (showLineSalesRep === "Y") {
          setCheckedValueShowLineSalesRep(1);
        } else {
          setCheckedValueShowLineSalesRep(0);
        }

        if (showSalesReturn === "Y") {
          setCheckedValueShowSalesReturn(1);
        } else {
          setCheckedValueShowSalesReturn(0);
        }

        if (showWeightPopup === "Y") {
          setCheckedValueShowWeightPopup(1);
        } else {
          setCheckedValueShowWeightPopup(0);
        }

        if (showTillOpening === "Y") {
          setCheckedValueShowTillOpening(1);
        } else {
          setCheckedValueShowTillOpening(0);
        }

        if (showDenominations === "Y") {
          setCheckedValueShowDenominations(1);
        } else {
          setCheckedValueShowDenominations(0);
        }
        
        if (printReceipt === "Y") {
          setCheckedValuePrintReceipt(1);
        } else {
          setCheckedValuePrintReceipt(0);
        }

        if (addLoyaltyLevel === "Y") {
          setCheckedValueAddLoyaltyLevel(1);
        } else {
          setCheckedValueAddLoyaltyLevel(0);
        }

        if (loyaltyApplicable  === "Y") {
          setCheckedValueLoyaltyApplicable(1);
        } else {
          setCheckedValueLoyaltyApplicable(0);
        }

        if (showImage === "Y") {
          setcheckedValueShowImage(1);
        } else {
          setcheckedValueShowImage(0);
        }

      }
      else if (application === "GRN") {
        const grnparsedConfigJSON = JSON.parse(configJson);
    
     
        const { basePriceCalc, priceEdit, printPDF, MRPEdit } = grnparsedConfigJSON;
        mainForm.setFieldsValue({ basePriceCalculation: basePriceCalc });
        if (priceEdit === "Y") {
          setCheckedValueGREditPrice(1);
        } else {
          setCheckedValueGREditPrice(0);
        }

        if (MRPEdit === "Y") {
          setCheckedValueGREditMRP(1);
        } else {
          setCheckedValueGREditMRP(0);
        }

        if (printPDF === "Y") {
          setCheckedValueGRPrintPdf(1);
        } else {
          setCheckedValueGRPrintPdf(0);
        }
      }
      else if (application === "STReceipt") {
        const STReceiptConfigJSON = JSON.parse(configJson); 
       
        const {  editReceivingQty, printPDF, StockReturn,ShowBatch } = STReceiptConfigJSON;
        if (editReceivingQty === "Y") {
          setCheckedValueSTReceipt(1);
        } else {
          setCheckedValueSTReceipt(0);
        }
        if (printPDF === "Y") {
          setCheckedValueSTReceiptPrintPdf(1);
        } else {
          setCheckedValueSTReceiptPrintPdf(0);
        }
        if (StockReturn === "Y") {
          setCheckedValueSTReceiptStockReturn(1);
        } else {
          setCheckedValueSTReceiptStockReturn(0);
        }
        if (ShowBatch === "Y") {
          setCheckedValueSTReceiptShowBatch(1);
        } else {
          setCheckedValueSTReceiptShowBatch(0);
        }
      } 
      else if(application === "Wastage"){
        const WastageJSON = JSON.parse(configJson);
        
        const {  imageUpload, printPDF, showBatch } = WastageJSON;
        if (imageUpload === "Y") {
          setcheckedValueImageUpload(1);
        } else {
          setcheckedValueImageUpload(0);
        }
        if (printPDF === "Y") {
          setCheckedValueWGPrintPDF(1);
        } else {
          setCheckedValueWGPrintPDF(0);
        }
        if (showBatch === "Y") {
          setCheckedValueWastageShowBatch(1);
        } else {
          setCheckedValueWastageShowBatch(0);
        }
        
      }
      else if(application === "Logging"){
        const approvalLoggingJSON = JSON.parse(configJson);
       
        setApprovalLoggingValues(approvalLoggingJSON)
      }
      else if(application === "E-Bill"){ 
        const eBillJSON = JSON.parse(configJson);
        setEBillValues(eBillJSON); 
        const {companylogo,orderdate,ordertime,customername,customerreview,companywebsite,downloadinvoice,socialmedia,website,termsconditions,eBill,eBillCommType,eBillWebHookURL} = eBillJSON;
        mainForm.setFieldsValue({ eBillCommType: eBillCommType,eBillWebHookURL:eBillWebHookURL });
        if (companylogo === "Y") {
          setCheckedValueEBCompanyLogo(1);
        } else {
          setCheckedValueEBCompanyLogo(0);
        } 

        if (orderdate === "Y") {
          setCheckedValueEBOrderDate(1);
        } else {
          setCheckedValueEBOrderDate(0);
        } 

        if (ordertime === "Y") {
          setCheckedValueEBOrderTime(1);
        } else {
          setCheckedValueEBOrderTime(0);
        } 

        if (customername === "Y") {
          setCheckedValueEBCustomerName(1);
        } else {
          setCheckedValueEBCustomerName(0);
        } 

        if (customerreview === "Y") {
          setCheckedValueEBCustomerReview(1);
        } else {
          setCheckedValueEBCustomerReview(0);
        } 

        if (companywebsite === "Y") {
          setCheckedValueEBCompanyWebsite(1);
        } else {
          setCheckedValueEBCompanyWebsite(0);
        } 

        if (downloadinvoice === "Y") {
          setCheckedValueEBDownloadInvoice(1);
        } else {
          setCheckedValueEBDownloadInvoice(0);
        } 

        if (socialmedia === "Y") {
          setCheckedValueEBSocialMedia(1);
        } else {
          setCheckedValueEBSocialMedia(0);
        } 

        if (website === "Y") {
          setCheckedValueEBWebsite(1);
        } else {
          setCheckedValueEBWebsite(0);
        } 

        if (termsconditions === "Y") {
          setCheckedValueEBTermsConditions(1);
        } else {
          setCheckedValueEBTermsConditions(0);
        } 
        if (eBill === "Y") {
          setCheckedValueEBenableBill(1);
        } else {
          setCheckedValueEBenableBill(0);
        } 

      }
      else if(application==="Store-Open-Close-CkeckList"){ 
      
        const storeOpendConfigJSON = JSON.parse(configJson);
       

        const {dynamicFileds } = storeOpendConfigJSON; 
       
        if(dynamicFileds!==undefined ){
          if(dynamicFileds.length>0|| dynamicFileds.AddnewButton>0){
            let arraobjdynamic=[] 
            const newbutton=dynamicFileds[0].AddnewButton
          
            for (let index = 0; index < dynamicFileds.length; index++) {
                 
                let obj={groupName:dynamicFileds[index].groupName,checkListName:dynamicFileds[index].checkListName,type:dynamicFileds[index].type,additional:dynamicFileds[index].additional,optional:dynamicFileds[index].optional,StoreOpen:dynamicFileds[index].StoreOpen
                  ,Storeclose:dynamicFileds[index].Storeclose
                  ,AddnewButton:dynamicFileds[index].AddnewButton
                
                }; 
               
              arraobjdynamic.push(obj) 

            }  

            mainForm.setFieldsValue({dynamicFileds:arraobjdynamic}) 
           
          }
        } 
 
      
      
      }

      setLoading(false);
    }else{
      message.error("No data available")
      setLoading(false);
    }
  }

  // const getPOSConfigData = async () => {
  //   try {
  //     setLoading(true);
  //     const newToken = JSON.parse(localStorage.getItem("authTokens"));
  //     const getPOSConfigMutation = {
  //       query: `query{
  //         getPOSConfig(application:"POS")
  //         {
  //           cwrPosConfigId
  //           application
  //           configJson
  //         }
  //       }`,
  //     };
  //     const headers = {
  //       "Content-Type": "application/json",
  //       Authorization: `bearer ${newToken.access_token}`,
  //     };

  //     const serverResponse = await Axios.post(serverUrl, getPOSConfigMutation, { headers: headers }, { async: true }, { crossDomain: true });
  //     const posConfigResponse = serverResponse.data.data.getPOSConfig;
  //     posConfigTabsData(posConfigResponse)
  //     if (posConfigResponse.length > 0) {
  //       const posConfigRecord = posConfigResponse[0];
  //       const { configJson } = posConfigRecord;

  //       const posParsedConfigJSON = JSON.parse(configJson);
  //       const { defaultSearchScreen, showOrderSalesRep, showLineSalesRep, defaultCustomerSearch, showSalesReturn, showWeightPopup, showCustomerSearch, showTillOpening, showDenominations,printReceipt,addLoyaltyLevel,loyaltyApplicable,loyaltyLevelID,showImage} = posParsedConfigJSON;
  //       mainForm.setFieldsValue({ defaultSearchScreen: defaultSearchScreen, defaultCustomerSearch: defaultCustomerSearch, showCustomerSearch: showCustomerSearch,loyaltyLevelID:loyaltyLevelID });
  //       if (showOrderSalesRep === "Y") {
  //         setCheckedValueShowOrderSalesRep(1);
  //       } else {
  //         setCheckedValueShowOrderSalesRep(0);
  //       }

  //       if (showLineSalesRep === "Y") {
  //         setCheckedValueShowLineSalesRep(1);
  //       } else {
  //         setCheckedValueShowLineSalesRep(0);
  //       }

  //       if (showSalesReturn === "Y") {
  //         setCheckedValueShowSalesReturn(1);
  //       } else {
  //         setCheckedValueShowSalesReturn(0);
  //       }

  //       if (showWeightPopup === "Y") {
  //         setCheckedValueShowWeightPopup(1);
  //       } else {
  //         setCheckedValueShowWeightPopup(0);
  //       }

  //       if (showTillOpening === "Y") {
  //         setCheckedValueShowTillOpening(1);
  //       } else {
  //         setCheckedValueShowTillOpening(0);
  //       }

  //       if (showDenominations === "Y") {
  //         setCheckedValueShowDenominations(1);
  //       } else {
  //         setCheckedValueShowDenominations(0);
  //       }

  //       if (printReceipt === "Y") {
  //         setCheckedValuePrintReceipt(1);
  //       } else {
  //         setCheckedValuePrintReceipt(0);
  //       }   

  //       if (addLoyaltyLevel === "Y") {
  //         setCheckedValueAddLoyaltyLevel(1);
  //       } else {
  //         setCheckedValueAddLoyaltyLevel(0);
  //       }

  //       if (loyaltyApplicable === "Y") {
  //         setCheckedValueLoyaltyApplicable(1);
  //       } else {
  //         setCheckedValueLoyaltyApplicable(0);
  //       }

  //       if (showImage === "Y") {
  //         setcheckedValueShowImage(1);
  //       } else {
  //         setcheckedValueShowImage(0);
  //       }

  //       setLoading(false);
  //     } else {
  //       message.error("No Data Available");
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     const { message } = JSON.parse(JSON.stringify(error));
  //     if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
  //       localStorage.clear();
  //       window.location.replace("/login");
  //     } else {
  //       return Promise.reject(error);
  //     }
  //   }
  // };

  

  const getConfigData = async (type) => {
    try {
      setLoading(true);
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));

      const getPOSConfigMutation = {
        query: `query{
          getPOSConfig(application:"${type}")
          {
            cwrPosConfigId
            application
            configJson
          }
        }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${authHeaders.access_token}`,
      };

      const serverResponse = await Axios.post(serverUrl, getPOSConfigMutation, { headers: headers }, { async: true }, { crossDomain: true });
      const posConfigResponse = serverResponse.data.data.getPOSConfig; 
      posConfigTabsData(posConfigResponse)
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        // let email = localStorage.getItem("email");
        // let tenantId = localStorage.getItem("tenantId");
        // let appId = localStorage.getItem("appId");
        // let appName = localStorage.getItem("appName");
        // setTimeout(() => {
        //   localStorage.clear();
        //   if (window.location.href.includes("appId")) {
        //     window.location.assign(`https://app.cwsuite.com${window.location.href.replace("https://plg1.cwsuite.com", "/")}`)
        //   } else {
        //     window.location.assign(`https://app.cwsuite.com?redirectUrl=${window.location.href}&appId=${encodeURIComponent(appId)}&name=${encodeURIComponent(appName)}`);
        //   };
        // }, 1000);
      } else {
        return Promise.reject(error);
      }
    }
  };

  const callBackTabs = async (value) => {
    try {
      setLoading(true);
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const getPOSConfigMutation = {
        query: `query{
          getPOSConfig(application:"${value}")
          {
            cwrPosConfigId
            application
            configJson
          }
        }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${authHeaders.access_token}`,
      };

      const serverResponse = await Axios.post(serverUrl, getPOSConfigMutation, { headers: headers }, { async: true }, { crossDomain: true });
      const posConfigResponse = serverResponse.data.data.getPOSConfig; 
      posConfigTabsData(posConfigResponse)
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        // let email = localStorage.getItem("email");
        // let tenantId = localStorage.getItem("tenantId");
        let appId = localStorage.getItem("appId");
        let appName = localStorage.getItem("appName");
        setTimeout(() => {
          localStorage.clear();
          if (window.location.href.includes("appId")) {
            window.location.assign(`https://app.cwsuite.com${window.location.href.replace("https://plg1.cwsuite.com", "/")}`)
          } else {
            window.location.assign(`https://app.cwsuite.com?redirectUrl=${window.location.href}&appId=${encodeURIComponent(appId)}&name=${encodeURIComponent(appName)}`);
          };
        }, 1000);
      } else {
        return Promise.reject(error);
      }
    }
  };

  const saveData = () => {
    mainForm.submit(); 
    
  };

  const onFinish = async () => {
    const values=mainForm.getFieldValue();
    const formattedArray=[]    
    if(values.dynamicFileds!==undefined) { 
    for (let i=0;i<values.dynamicFileds.length;i++){ 
    const stringifiedJSON = JSON.stringify(values.dynamicFileds[i]); 
    const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
    formattedArray.push(jsonToSend)  
    }  
    
  }
 
    try {
      setLoading(true);
      // const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const posConfigArray = [];
      posConfigArray.push(
        `{
          application:"POS"
          configJson: "{\\"defaultSearchScreen\\":${values.defaultSearchScreen === undefined || values.defaultSearchScreen === null ? null : `\\"${values.defaultSearchScreen}\\"`},\\"showOrderSalesRep\\":${checkedValueShowOrderSalesRep === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"showLineSalesRep\\":${checkedValueShowLineSalesRep === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"defaultCustomerSearch\\":${values.defaultCustomerSearch === undefined || values.defaultCustomerSearch === null ? null : `\\"${values.defaultCustomerSearch}\\"`},\\"showSalesReturn\\":${checkedValueShowSalesReturn === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"showWeightPopup\\":${checkedValueShowWeightPopup === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"showCustomerSearch\\":${values.showCustomerSearch === undefined || values.showCustomerSearch === null ? null : `\\"${values.showCustomerSearch}\\"`},\\"showTillOpening\\":${checkedValueShowTillOpening === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"showDenominations\\":${checkedValueShowDenominations === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"printReceipt\\":${checkedValuePrintReceipt === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"addLoyaltyLevel\\":${checkedValueAddLoyaltyLevel === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"loyaltyApplicable\\":${checkedValueLoyaltyApplicable === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"loyaltyLevelID\\":${values.loyaltyLevelID === undefined || values.loyaltyLevelID === null ? null : `\\"${values.loyaltyLevelID}\\"`},\\"showImage\\":${checkedValueShowImage === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`}}"
         },
        {
          application:"GRN"
          configJson: "{\\"basePriceCalc\\":${values.basePriceCalculation === undefined || values.basePriceCalculation === null ? null : `\\"${values.basePriceCalculation}\\"`},\\"priceEdit\\":${checkedValueGREditPrice === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"printPDF\\":${checkedValueGRPrintPdf === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"MRPEdit\\":${checkedValueGREditMRP === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`}}",
        } 
        {
          application:"STReceipt"
          configJson: "{\\"editReceivingQty\\":${checkedValueSTReceipt === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"printPDF\\":${checkedValueSTReceiptPrintPdf  === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"StockReturn\\":${checkedValueSTReceiptStockReturn === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"ShowBatch\\":${checkedValueSTReceiptShowBatch === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`}}", 
        }
        {
          application:"Wastage"
          configJson: "{\\"imageUpload\\":${ checkedValueImageUpload=== 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"printPDF\\":${ checkedValueWGPrintPDF === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"showBatch\\":${checkedValueWastageShowBatch === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`}}", 
        }

        {
          application:"Logging"
          configJson: "{\\"login\\":[{\\"approval\\":${values.loginApproval === undefined || values.loginApproval === null ? null : values.loginApproval===false || values.loginApproval==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}},{\\"log\\":${values.loginLog === undefined || values.loginLog === null ? null : values.loginLog===false || values.loginLog==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}}],\\"logout\\":[{\\"approval\\":${values.logoutApproval === undefined || values.logoutApproval === null ? null : values.logoutApproval===false || values.logoutApproval==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}},{\\"log\\":${values.logoutLog === undefined || values.logoutLog === null ? null : values.logoutLog===false || values.logoutLog==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}}],\\"deleteLines\\":[{\\"approval\\":${values.deleteLinesApproval === undefined || values.deleteLinesApproval === null ? null : values.deleteLinesApproval===false || values.deleteLinesApproval==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}},{\\"log\\":${values.deleteLinesLog === undefined || values.deleteLinesLog === null ? null : values.deleteLinesLog===false || values.deleteLinesLog==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}}],\\"deleteOrder\\":[{\\"approval\\":${values.deleteOrderApproval === undefined || values.deleteOrderApproval === null ? null : values.deleteOrderApproval===false || values.deleteOrderApproval==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}},{\\"log\\":${values.deleteOrderLog === undefined || values.deleteOrderLog === null ? null : values.deleteOrderLog===false || values.deleteOrderLog==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}}],\\"dayOpening\\":[{\\"approval\\":${values.dayOpeningApproval === undefined || values.dayOpeningApproval === null ? null : values.dayOpeningApproval===false || values.dayOpeningApproval==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}},{\\"log\\":${values.dayOpeningLog === undefined || values.dayOpeningLog === null ? null : values.dayOpeningLog===false || values.dayOpeningLog==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}}],\\"dayClosing\\":[{\\"approval\\":${values.dayClosingApproval === undefined || values.dayClosingApproval === null ? null : values.dayClosingApproval===false || values.dayClosingApproval==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}},{\\"log\\":${values.dayClosingLog === undefined || values.dayClosingLog === null ? null : values.dayClosingLog===false || values.dayClosingLog==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}}],\\"decreaseQty\\":[{\\"approval\\":${values.decreaseQtyApproval === undefined || values.decreaseQtyApproval === null ? null : values.decreaseQtyApproval===false || values.decreaseQtyApproval==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}},{\\"log\\":${values.decreaseQtyLog === undefined || values.decreaseQtyLog === null ? null : values.decreaseQtyLog===false || values.decreaseQtyLog==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}}],\\"addCustomer\\":[{\\"approval\\":${values.addCustomerApproval === undefined || values.addCustomerApproval === null ? null : values.addCustomerApproval===false || values.addCustomerApproval==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}},{\\"log\\":${values.addCustomerLog === undefined || values.addCustomerLog === null ? null : values.addCustomerLog===false || values.addCustomerLog==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}}],\\"paymentDelete\\":[{\\"approval\\":${values.paymentDeleteApproval === undefined || values.paymentDeleteApproval === null ? null : values.paymentDeleteApproval===false || values.paymentDeleteApproval==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}},{\\"log\\":${values.paymentDeleteLog === undefined || values.paymentDeleteLog === null ? null : values.paymentDeleteLog===false || values.paymentDeleteLog==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}}],\\"deleteParkedOrder\\":[{\\"approval\\":${values.deleteParkedOrderApproval === undefined || values.deleteParkedOrderApproval === null ? null : values.deleteParkedOrderApproval===false || values.deleteParkedOrderApproval==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}},{\\"log\\":${values.deleteParkedOrderLog === undefined || values.deleteParkedOrderLog === null ? null : values.deleteParkedOrderLog===false || values.deleteParkedOrderLog==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}}],\\"salesReturn\\":[{\\"approval\\":${values.salesReturnApproval === undefined || values.salesReturnApproval === null ? null : values.salesReturnApproval===false || values.salesReturnApproval==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}},{\\"log\\":${values.salesReturnLog === undefined || values.salesReturnLog === null ? null : values.salesReturnLog===false || values.salesReturnLog==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}}],\\"salesRepDelete\\":[{\\"approval\\":${values.salesRepDeleteApproval === undefined || values.salesRepDeleteApproval === null ? null : values.salesRepDeleteApproval===false || values.salesRepDeleteApproval==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}},{\\"log\\":${values.salesRepDeleteLog === undefined || values.salesRepDeleteLog === null ? null : values.salesRepDeleteLog===false || values.salesRepDeleteLog==="false" ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`}}],\\"lineSalesRepDelete\\":[{\\"approval\\":${values.lineSalesRepDeleteApproval === undefined || values.lineSalesRepDeleteApproval === null ? null : values.lineSalesRepDeleteApproval===false || values.lineSalesRepDeleteApproval==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}},{\\"log\\":${values.lineSalesRepDeleteLog === undefined || values.lineSalesRepDeleteLog === null ? null : values.lineSalesRepDeleteLog===false || values.lineSalesRepDeleteLog==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}}],\\"removeCustomer\\":[{\\"approval\\":${values.removeCustomerApproval === undefined || values.removeCustomerApproval === null ? null : values.removeCustomerApproval===false || values.removeCustomerApproval==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}},{\\"log\\":${values.removeCustomerLog === undefined || values.removeCustomerLog === null ? null : values.removeCustomerLog===false || values.removeCustomerLog==="false" ? `\\"${"N"}\\"` : `\\"${"Y"}\\"`}}]}",
        }
        {
          application:"E-Bill"
          configJson: "{\\"eBill\\":${checkedValueEBenableBill === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"eBillWebHookURL\\":${values.eBillWebHookURL === undefined || values.eBillWebHookURL === null  ? null : `\\"${values.eBillWebHookURL}\\"`},\\"eBillCommType\\":${values.eBillCommType === undefined || values.eBillCommType === null ? null : `\\"${values.eBillCommType}\\"`}}"
        }
        {
          application:"Store-Open-Close-CkeckList"
          configJson: "{\\"dynamicFileds\\":[${formattedArray}]}",
        }`
        
      );

      const posConfigMutation = {
        query: `mutation {
          upsertPOSConfig(posConfig: { 
            cwrPosConfigs:[${posConfigArray}]
          }) {
            status
            message
        }
      }`,
      };
    

      Axios({
        url: serverUrl,
        method: "POST",
        data: posConfigMutation,
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${authHeaders.access_token}`,
        },
      }).then((response) => {
        const posConfigResponse = response.data.data.upsertPOSConfig; 
        if (posConfigResponse.status === "200") {
          message.success(posConfigResponse.message);
          setLoading(false); 
        } else {
          message.error(posConfigResponse.message);
          setLoading(false);
        }
      });
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        // let email = localStorage.getItem("email");
        // let tenantId = localStorage.getItem("tenantId");
        let appId = localStorage.getItem("appId");
        let appName = localStorage.getItem("appName");
        setTimeout(() => {
          localStorage.clear();
          if (window.location.href.includes("appId")) {
            window.location.assign(`https://app.cwsuite.com${window.location.href.replace("https://plg1.cwsuite.com", "/")}`)
          } else {
            window.location.assign(`https://app.cwsuite.com?redirectUrl=${window.location.href}&appId=${encodeURIComponent(appId)}&name=${encodeURIComponent(appName)}`);
          };
        }, 1000);
      } else {
        return Promise.reject(error);
      }
    }
  };

  /* const clearData = () => {
    mainForm.resetFields();
  }; */
  const onChangeCheckboxOptainal=(e)=>{
    const eventId = e.target.id;
    const stockname=mainForm.getFieldValue();



   
    const checkedValue = e.target.checked;
   
    if (eventId === "control-hooks_optional") {
      if (checkedValue === true) {
        
        stockname.dyanamicFileds[0].optional=true
        mainForm.setFieldsValue({
        dyanamicFileds:stockname.dyanamicFileds
        })
     
      } else {
        stockname.dyanamicFileds[0].optional=false
        mainForm.setFieldsValue({
        dyanamicFileds:stockname.dyanamicFileds
        })
      } 
    } 
  } 

  const onchengrCheckboxoptional=(e)=>{
    const eventId = e.target.id;

    const checkedValue = e.target.checked; 
    
    if (checkedValue === true) {
       setCheckedValueSOCOptional(true);
      
    } else {
      setCheckedValueSOCOptional(false);
    
    } 
    if (checkedValue === true) {
      setCheckedValueSOCOpenCheck(true);
     
   } else {
      setCheckedValueSOCOpenCheck(false);
   } 
   if (checkedValue === true) {
    setCheckedValueSOCCloseCheck(true);
   
   } else {
    setCheckedValueSOCCloseCheck(false);
   } 
  }
  const onChangeCheckbox = (e) => {
    const eventId = e.target.id;
   

    const checkedValue = e.target.checked;
  
    if (eventId === "control-hooks_showOrderSalesRep") {
      if (checkedValue === true) {
        setCheckedValueShowOrderSalesRep(1);
      } else {
        setCheckedValueShowOrderSalesRep(0);
      }
    }

    if (eventId === "control-hooks_showLineSalesRep") {
      if (checkedValue === true) {
        setCheckedValueShowLineSalesRep(1);
      } else {
        setCheckedValueShowLineSalesRep(0);
      }
    }

    if (eventId === "control-hooks_showSalesReturn") {
      if (checkedValue === true) {
        setCheckedValueShowSalesReturn(1);
      } else {
        setCheckedValueShowSalesReturn(0);
      }
    }

    if (eventId === "control-hooks_showWeightPopup") {
      if (checkedValue === true) {
        setCheckedValueShowWeightPopup(1);
      } else {
        setCheckedValueShowWeightPopup(0);
      }
    }

    if (eventId === "control-hooks_showTillOpening") {
      if (checkedValue === true) {
        setCheckedValueShowTillOpening(1);
      } else {
        setCheckedValueShowTillOpening(0);
      }
    }

    if (eventId === "control-hooks_showDenominations") {
      if (checkedValue === true) {
        setCheckedValueShowDenominations(1);
      } else {
        setCheckedValueShowDenominations(0);
      }
    }

    if (eventId === "control-hooks_printReceipt") {
      if (checkedValue === true) {
        setCheckedValuePrintReceipt(1);
      } else {
        setCheckedValuePrintReceipt(0);
      }
    }

    if (eventId === "control-hooks_AddLoyaltyLevel") {
      if (checkedValue === true) {
        setCheckedValueAddLoyaltyLevel(1);
      } else {
        setCheckedValueAddLoyaltyLevel(0);
      }
    }
     
    if (eventId === "control-hooks_LoyaltyApplicable") {
      if (checkedValue === true) {
        setCheckedValueLoyaltyApplicable(1);
      } else {
        setCheckedValueLoyaltyApplicable(0);
      }
    }
    if (eventId === "control-hooks_showImage") {
      if (checkedValue === true) {
        setcheckedValueShowImage(1);
      } else {
        setcheckedValueShowImage(0);
      }
    }


    if (eventId === "control-hooks_goodsReceiptPrintPdf") {
      if (checkedValue === true) {
        setCheckedValueGRPrintPdf(1);
      } else {
        setCheckedValueGRPrintPdf(0);
      }
    }

    if (eventId === "control-hooks_editMrp") {
      if (checkedValue === true) {
        setCheckedValueGREditMRP(1);
      } else {
        setCheckedValueGREditMRP(0);
      }
    }

    if (eventId === "control-hooks_editPrice") {
      if (checkedValue === true) {
        setCheckedValueGREditPrice(1);
      } else {
        setCheckedValueGREditPrice(0);
      }
    }
    if (eventId === "control-hooks_EBCompanyLogo") {
      if (checkedValue === true) {
        setCheckedValueEBCompanyLogo(1);
      } else {
        setCheckedValueEBCompanyLogo(0);
      }
    } 

    if (eventId === "control-hooks_EBOrderDate") {
      if (checkedValue === true) {
        setCheckedValueEBOrderDate(1);
      } else {
        setCheckedValueEBOrderDate(0);
      }
    }

    if (eventId === "control-hooks_EBOrderTime") {
      if (checkedValue === true) {
        setCheckedValueEBOrderTime(1);
      } else {
        setCheckedValueEBOrderTime(0);
      }
    }

    if (eventId === "control-hooks_EBCustomerName") {
      if (checkedValue === true) {
        setCheckedValueEBCustomerName(1);
      } else {
        setCheckedValueEBCustomerName(0);
      }
    }

    if (eventId === "control-hooks_EBCustomerReview") {
      if (checkedValue === true) {
        setCheckedValueEBCustomerReview(1);
      } else {
        setCheckedValueEBCustomerReview(0);
      }
    }

    if (eventId === "control-hooks_EBCompanyWebsite") {
      if (checkedValue === true) {
        setCheckedValueEBCompanyWebsite(1);
      } else {
        setCheckedValueEBCompanyWebsite(0);
      }
    }

    if (eventId === "control-hooks_EBDownloadInvoice") {
      if (checkedValue === true) {
        setCheckedValueEBDownloadInvoice(1);
      } else {
        setCheckedValueEBDownloadInvoice(0);
      }
    }

    if (eventId === "control-hooks_EBSocialMedia") {
      if (checkedValue === true) {
        setCheckedValueEBSocialMedia(1);
      } else {
        setCheckedValueEBSocialMedia(0);
      }
    }

    if (eventId === "control-hooks_EBWebsite") {
      if (checkedValue === true) {
        setCheckedValueEBWebsite(1);
      } else {
        setCheckedValueEBWebsite(0);
      }
    }
    if (eventId === "control-hooks_EBTerms&Conditions") {
      if (checkedValue === true) {
        setCheckedValueEBTermsConditions(1);
      } else {
        setCheckedValueEBTermsConditions(0);
      }
    }
    if (eventId === "control-hooks_EBenableBill") {
      if (checkedValue === true) {
        setCheckedValueEBenableBill(1);
      } else {
        setCheckedValueEBenableBill(0);
      }
    } 
    if (eventId === "control-hooks_STReceiptEditReceivingQty") {
      if (checkedValue === true) {
        setCheckedValueSTReceipt(1);
      } else {
        setCheckedValueSTReceipt(0);
      }
    } 

    if (eventId === "control-hooks_STReceiptPrintPDF") {
      if (checkedValue === true) {
        setCheckedValueSTReceiptPrintPdf(1);
      } else {
        setCheckedValueSTReceiptPrintPdf(0);
      }
    }

    if (eventId === "control-hooks_STReceiptStockReturn") {
      if (checkedValue === true) {
        setCheckedValueSTReceiptStockReturn(1);
      } else {
        setCheckedValueSTReceiptStockReturn(0);
      }
    }
    if (eventId === "control-hooks_STReceiptShowBatch") {
      if (checkedValue === true) {
        setCheckedValueSTReceiptShowBatch(1);
      } else {
        setCheckedValueSTReceiptShowBatch(0);
      }
    }
    if (eventId === "control-hooks_WastageImageUpload") {
      if (checkedValue === true) {
        setcheckedValueImageUpload(1);
      } else {
        setcheckedValueImageUpload(0);
      }
    }
    if (eventId === "control-hooks_WastagePrintPDF") {
      if (checkedValue === true) {
        setCheckedValueWGPrintPDF(1);
      } else {
        setCheckedValueWGPrintPDF(0);
      }
    }
    if (eventId === "control-hooks_WastageShowBatch") {
      if (checkedValue === true) {
        setCheckedValueWastageShowBatch(1);
      } else {
        setCheckedValueWastageShowBatch(0);
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
  };

  const getAllFormValues = (e,val) =>{
  }

  return (
    <Spin indicator={<LoadingOutlined style={{ fontSize: "52px" }} spin />} spinning={loading}>
      <div>
        <Row>
          <Col span={12}>
            <h2>POS Configuration</h2>
          </Col>
          <Col span={10} />
          <Col span={2}>
            <Button style={Themes.contentWindow.ListWindowHeader.newButtonForlist} type="primary" onClick={saveData}>
              Save
            </Button>
            &nbsp;
          </Col>
          {/* <Col span={2}>
            <Button style={Themes.contentWindow.ListWindowHeader.newButtonForlist} onClick={clearData}>
              Cancel
            </Button>
          </Col> */}
        </Row>
        <Row>
          <Col span={24}>
            <Form layout="vertical" onValuesChange={getAllFormValues} form={mainForm} name="control-hooks" onFinish={onFinish} onFinishFailed={onFinishFailed}>
              <Card>
                <Tabs defaultActiveKey={"POS"} onChange={callBackTabs}>
                  <TabPane tab="POS" key="POS">
                    <div style={{ padding: "8px" }}>
                      <h3>POS</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Default Search Screen" name="defaultSearchScreen" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              /* onFocus={getBusinessUnit}
                              onSelect={onSelectBusinessUnit} */
                            >
                              <Option key="1" value="Product Search" title="Product Search">
                                Product Search
                              </Option>

                              <Option key="2" value="SKU/UPC Search" title="SKU/UPC Search">
                                SKU/UPC Search
                              </Option>

                              <Option key="3" value="Category Search" title="Category Search">
                                Category Search
                              </Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Show Order Sales Rep" name="showOrderSalesRep">
                            <Checkbox
                              checked={checkedValueShowOrderSalesRep}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Show Line Sales Rep" name="showLineSalesRep">
                            <Checkbox
                              checked={checkedValueShowLineSalesRep}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="defaultCustomerSearch" label="Default Customer Search" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              /* onFocus={getBusinessUnit}
                              onSelect={onSelectBusinessUnit} */
                            >
                              <Option key="1" value="Search Key" title="Search Key">
                                Search Key
                              </Option>

                              <Option key="2" value="Contact Number" title="Contact Number">
                                Contact Number
                              </Option>
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Show Sales Return" name="showSalesReturn">
                            <Checkbox
                              checked={checkedValueShowSalesReturn}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Show Weight Popup" name="showWeightPopup">
                            <Checkbox
                              checked={checkedValueShowWeightPopup}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="showCustomerSearch" label="Show Customer Search" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              /* onFocus={getBusinessUnit}
                              onSelect={onSelectBusinessUnit} */
                            >
                              <Option key="1" value="Do Not Show" title="Do Not Show">
                                Do Not Show
                              </Option>

                              <Option key="2" value="Before Payment" title="Before Payment">
                                Before Payment
                              </Option>

                              <Option key="3" value="Before Order" title="Before Order">
                                Before Order
                              </Option>
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Show Till Opening" name="showTillOpening">
                            <Checkbox
                              checked={checkedValueShowTillOpening}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Show Denominations" name="showDenominations">
                            <Checkbox
                              checked={checkedValueShowDenominations}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Print Receipt" name="printReceipt">
                            <Checkbox checked={checkedValuePrintReceipt} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label=" Add Loyalty Level" name="AddLoyaltyLevel">
                            <Checkbox checked={checkedValueAddLoyaltyLevel} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Loyalty Applicable" name="LoyaltyApplicable">
                            <Checkbox checked={checkedValueLoyaltyApplicable} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                       <br/>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="loyaltyLevelID" label=" Loyalty Level ID" style={{ marginBottom: "8px" }}>
                            <Input value="string" placeholder="ID" />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Show Image" name="showImage">
                            <Checkbox checked={checkedValueShowImage} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                       </Row>
                      <br />
                    </div>
                  </TabPane>
                  <TabPane tab="GRN" key="GRN">
                    <div style={{ padding: "8px" }}>
                      <h3>GRN</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="basePriceCalculation" label="Price" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              /* onFocus={getBusinessUnit}
                              onSelect={onSelectBusinessUnit} */
                            >
                              <Option key="2" value="Actual Cost Price" title="Actual Cost Price">
                                Actual Cost Price
                              </Option>

                              <Option key="1" value="Purchase Price" title="Purchase Price">
                                Purchase Price
                              </Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Print PDF" name="goodsReceiptPrintPdf">
                            <Checkbox checked={checkedValueGRPrintPdf} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Edit Price " name="editPrice">
                            <Checkbox checked={checkedValueGREditPrice} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                      </Row>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Edit MRP" name="editMrp">
                            <Checkbox checked={checkedValueGREditMRP} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                      <br />
                    </div>
                  </TabPane>
                  <TabPane tab="ST Receipt" key="STReceipt">
                  <div style={{ padding: "8px" }}>
                      <h3>ST Receipt</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Edit Receiving Qty" name="STReceiptEditReceivingQty">
                            <Checkbox checked={checkedValueSTReceipt} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Print PDF" name="STReceiptPrintPDF">
                            <Checkbox checked={checkedValueSTReceiptPrintPdf} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Stock Return" name="STReceiptStockReturn">
                            <Checkbox checked={checkedValueSTReceiptStockReturn} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        </Row> 
                        <br/>
                        <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Show Batch" name="STReceiptShowBatch">
                            <Checkbox checked={checkedValueSTReceiptShowBatch} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        </Row>
                        <br/>
                  </div>
                  </TabPane>
                  <TabPane tab="Wastage" key="Wastage">
                  <div style={{ padding: "8px" }}>
                      <h3>Wastage</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Image Upload" name="WastageImageUpload">
                            <Checkbox checked={checkedValueImageUpload} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Print PDF" name="WastagePrintPDF">
                            <Checkbox checked={checkedValueWGPrintPDF} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Show Batch" name="WastageShowBatch">
                            <Checkbox checked={checkedValueWastageShowBatch} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                        </Row>
                        <br/>
                        </div>
                  </TabPane>
                  <TabPane tab="Day Close" key="Day Close">
                    Day Close
                  </TabPane>
                  <TabPane tab="Approvals/Logging" key="Logging">
                    <ApprovalLogging approvalLoggingValues={approvalLoggingValues} />
                  </TabPane>
                  <TabPane tab="E-Bill" key="E-Bill">
                    {/* <EBill eBillValues={eBillValues} /> */} 
                    <div style={{ padding: "8px" }}>
                    <h3>E-Bill</h3>
                      {/* <Row gutter={16}>
                          <Col className="gutter-row" span={2} />
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="Company Logo" name="EBCompanyLogo">
                              <Checkbox 
                               checked={checkedValueEBCompanyLogo} 
                               onChange={onChangeCheckbox} 
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={4} />
                          <Col className="gutter-row" span={4}>
                            <Form.Item label="Order Date" name="EBOrderDate">
                              <Checkbox 
                                checked={checkedValueEBOrderDate} 
                                  onChange={onChangeCheckbox} 
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={4} />
                          <Col className="gutter-row" span={4}>
                            <Form.Item label="Order Time" name="EBOrderTime">
                              <Checkbox 
                                checked={checkedValueEBOrderTime} 
                                  onChange={onChangeCheckbox} 
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                          
                        </Row> 
                        <br/>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={2} />
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="Customer Name" name="EBCustomerName">
                              <Checkbox 
                                checked={checkedValueEBCustomerName} 
                                onChange={onChangeCheckbox} 
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col> 
                          <Col className="gutter-row" span={4} />
                          <Col className="gutter-row" span={4}>
                            <Form.Item label="Customer Review" name="EBCustomerReview">
                              <Checkbox 
                                checked={checkedValueEBCustomerReview} 
                                onChange={onChangeCheckbox} 
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col> 
                          <Col className="gutter-row" span={4} />
                          <Col className="gutter-row" span={4}>
                            <Form.Item label="Company Website" name="EBCompanyWebsite">
                              <Checkbox 
                                checked={checkedValueEBCompanyWebsite} 
                                onChange={onChangeCheckbox} 
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col> 
                        </Row> 
                          <br/>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={2} />
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="Download Invoice" name="EBDownloadInvoice">
                              <Checkbox 
                                checked={checkedValueEBDownloadInvoice} 
                                onChange={onChangeCheckbox} 
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>  
                          <Col className="gutter-row" span={4} />
                          <Col className="gutter-row" span={4}>
                            <Form.Item label="Social Media" name="EBSocialMedia">
                              <Checkbox 
                                checked={checkedValueEBSocialMedia} 
                                onChange={onChangeCheckbox} 
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col> 
                          <Col className="gutter-row" span={4} />
                          <Col className="gutter-row" span={4}>
                            <Form.Item label="Website" name="EBWebsite">
                              <Checkbox 
                                 checked={checkedValueEBWebsite} 
                                 onChange={onChangeCheckbox} 
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>   
                        </Row> 
                        <br/> */}
                        <Row gutter={16}>
                          <Col className="gutter-row" span={2} />
                            <Col className="gutter-row" span={6}>
                            <Form.Item label="Enable E-Bill" name="EBenableBill">
                              <Checkbox 
                                checked={checkedValueEBenableBill} 
                                onChange={onChangeCheckbox} 
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                            <Form.Item label="E-Bill WebHookURL" name="eBillWebHookURL">
                              <Input />
                            </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item label="E-Bill Type" name="eBillCommType" style={{ marginBottom: "8px" }}>
                              <Select
                                allowClear
                                showSearch
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                /* onFocus={getBusinessUnit}
                                onSelect={onSelectBusinessUnit} */
                              >
                                <Option key="1" value="WhatsApp" title="WhatsApp">
                                  WhatsApp
                                </Option>

                                <Option key="2" value="SMS" title="SMS">
                                  SMS
                                </Option>

                                <Option key="3" value="Email" title="Email">
                                  Email
                                </Option>
                              </Select>
                              </Form.Item>
                            </Col>
                        </Row>
                      <br/>
                    </div>
                  </TabPane>
                  <TabPane tab="Store Open-Close Ckeck List" key="Store-Open-Close-CkeckList">
                  <div style={{ padding: "8px" }}>
                    <h3>Store Open-Close Ckeck List</h3>
                    
                        <Form.List name="dynamicFileds">
                        {(fields,{add,remove})=>(
                   <>
                    <Row gutter={8}>
                   <Col span={24}>
                    <span style={{float:'right',marginBottom:'8px'}}><Button style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px",textAlign:'center'}} onClick={() => {
                                add()}} type="primary" >
                      Add Group
                    </Button>
                    </span>
                           </Col>
                           </Row>
                          
                      {fields.map(({key,name,...restField})=>(
                        <>
                          <Row gutter={16}>
                          <Col span={3}>
                              <Form.Item label={"Group Name"} name={[name,'groupName']} {...restField} style={{marginBottom:'20px'}}>
                               <Input/>
                              </Form.Item>
                            </Col>
                           
                        <Col className="gutter-row" span={3}>
                           <Form.Item        
                         name={[name, "StoreOpen"]}
                         label={"Store Open"}
                          {...restField} style={{marginBottom:'20px'}}
                         valuePropName="checked" 
                         initialValue={ checkedValueSOCOpenCheck=== "Y" ? true : false}
                                >
                                 <Checkbox  
                              //  defaultValue={false}
                                    checked={checkedValueSOCOpenCheck}
                                 onChange={onchengrCheckboxoptional}
                                />
                              </Form.Item>
                             </Col>
                             
                              <Col className="gutter-row" span={3}>
                            <Form.Item initialValue={ checkedValueSOCCloseCheck=== "Y" ? true : false}
                            valuePropName="checked" 
                            label={"Store Close"} {...restField}  name={[name, "Storeclose"]}  style={{ marginBottom: "8px" }}>
                                <Checkbox checked={checkedValueSOCCloseCheck} onChange={onchengrCheckboxoptional} />
                              </Form.Item>
                               </Col>
                               <Col span={13}/>
                            <Col span={2} className='gutter-row' style={{float:'right'}}>
                           <MinusCircleOutlined onClick={() => {
                             remove(name)
                             }} />
                          </Col>
                          </Row>
                          <Form.Item>
                              <StoreOpenClose fieldKey={name}/>
                             </Form.Item>
                            
                          </>
                          ))}
                         </>
                       )} 
                        </Form.List>
                      <br/>
                    </div>
                  </TabPane>
                </Tabs>
              </Card>
            </Form>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default POSConfiguration;