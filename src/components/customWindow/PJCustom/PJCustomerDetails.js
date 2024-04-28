import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Row, Col, Card, Form, Checkbox, Image, Spin, Button, Input, Tabs, message, Select, Modal, Upload, DatePicker, Space } from "antd";
import { useGlobalContext } from "../../../lib/storage";
import { getPjDetailsData } from "../../../services/custom";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { LoadingOutlined, EditOutlined, UploadOutlined, PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import ThemeJson from "../../../constants/UIServer.json"
// import { serverUrl } from "../../../constants/serverConfig";
import Axios from "axios";
import {
  getCustomerInfoTabData,
  getKycData,
  getTermsConditionsData,
  getRegulatoryData,
  getStockMixData,
  getOutletData,
  getDeleteData,
  getDeleteStockMixData,
  getDeleteTermsConditionsData,
  getDeleteOuttLetData,
  getDeleteKYCData,
  getroleBunit,
} from "../../../services/custom";
import {
  getCustomerCategoryTypeData,
  getCurrencyDropDownData,
  getPaymentTermsDropDownData,
  getStateDropDownData,
  getCountryDropDownData,
  getkycStateDropDownData,
  getSalesRepDropDown,
  getkycCountryDropDownData,
  getCreditPeriodDropDown,
  getStateOutletDropDown,
  getInvoiceFormateDropDown,
} from "../../../services/generic";

const { TabPane } = Tabs;
const { Option } = Select;

const CustomWindowHeader = () => {
  const history = useHistory();
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const [headerFormData, setHeaderFormData] = useState();

  const [loading, setLoading] = useState(false);

  const [customerInfoHeder, setcustomerInfoHeder] = useState();
  const [outletValue, setoutletValue] = useState([]);
  const [dvnclass, setdvnclass] = useState([]);
  const [dvnbankregulatory, setDVNBankRegulatory] = useState([]);
  const [dvnAddress, setdvnAddress] = useState([]);
  const [dvnCustomerKyc, setdvnCustomerKyc] = useState([]);
  const [kycTabHeader, setKycTabHeader] = useState([]);
  const [termsAndConditiontab, setTermsAndConditionTab] = useState([]);
  const [RegulatoryTabHeader, setRegulatoryTabHeader] = useState([]);
  const [stockMixHeader, setStockMixHeader] = useState([]);
  const [outletHeader, setOutletHeader] = useState([]);
  const [displayInput, setdisplayInput] = useState("block");
  const [displayInputTerms, setDisplayInputTerms] = useState("block");
  const [displayInputCustomerInfo, setDisplayInputCustomrInfo] = useState("block");
  const [displayInputRegulatory, setDisplayInputRegulatory] = useState("block");
  const [displayInputStockMix, setDisplayInputStockMix] = useState("block");
  const [displayInputOutlet, setDisplayInputOutlet] = useState("block");

  const pjMasterId = localStorage.getItem("pjMasterId");

  const [bUnitId, setBUnitId] = useState("");
  const [bunitData, setBunitData] = useState([]);
  const [customerCategoryData, setCustomerCategoryData] = useState([]);
  const [customerCategoryId, setCustomerCategoryId] = useState("");
  const [CurrencyData, setCurrencyData] = useState([]);
  const [currencyId, setCurrencyId] = useState("");
  const [paymentData, setPaymentData] = useState([]);
  const [paymentId, setPaymentId] = useState("");
  const [stateData, setStateData] = useState([]);
  const [stateId, setstateId] = useState("");
  const [countryData, setCountryData] = useState([]);
  const [countryId, setCountryId] = useState("");
  const [stateKycData, setStateKYCData] = useState([]);
  const [stateKycId, setStateKYCId] = useState("");
  const [salesRepData, setSalesRepData] = useState([]);
  const [salesRepId, setsalesRepId] = useState("");
  const [countryKYCData, setCountryKYCData] = useState([]);
  const [countryKYCId, setCountryKYCId] = useState("");
  const [creditData, setCreditDataData] = useState([]);
  const [creditId, setCreditId] = useState("");
  const [stateOutletData, setStateOutlet] = useState([]);
  const [stateOutletId, setStateOutletId] = useState("");
  const [invoiceFormateData, setInvoiceFormateDate] = useState([]);

  const [isInvoicing, setISInvoicing] = useState(false);
  const [isInvoicingCustomer, setIsInvoicingCustomer] = useState(false);
  const [isTDSApplication, setIsTDSApplication] = useState(false);

  const [visibleForKYCEdit, setVisibleForKYCEdit] = useState(false);
  const [visibleForStockEdit, setVisibleForStockEdit] = useState(false);
  const [visibleForRegulatoryEdit, setVisibleForRegulatoryEdit] = useState(false);
  const [visibleForTermsAndConditionEdit, setvisibleForTermsAndConditionEdit] = useState(false);
  const [visibleForOutletEdit, setvisibleForOutletEdit] = useState(false);
  const [visibleForCustomerInfoEdit, setVisibleForCustomerInfoEdit] = useState(false);
  const [visibleForCustomerInfoNewEdit, setVisibleForCustomerInfoNewEdit] = useState(false);
  
  const [kycCustomerId, setKycDvnCustomerId] = useState(null); 
  const [kycpjmsndterId, setKycpjmsndterId] = useState(null);
  const serverUrl = process.env.REACT_APP_serverUrl;
  const [visibleNewButtonkYC, setVisibleNewButtonkYC] = useState(false);



  const [pjmasterCustomerInfo, setpjmasterCustomerInfo] = useState(null);
  const [dOtherClassificationId, setDOtherClassificationId] = useState(null);
  const [cBankDetailsId, setCBankDetailsId] = useState(null);
  const [dvnCustomerAddressId, setDvnCustomerAddressId] = useState(null);
  const [customerContactId, setcustomerContactId] = useState(null);
  const [istdsAPPlication, setIstdsAPPlication] = useState(false);
  const [isGSTApplicable, setIsGSTApplicable] = useState(false);
  const [isIncentivePromptPayment, setIncentivePromptPayment] = useState(false);
  const [isJewellerLevelPromptPayment, setJewellerLevelPromptPayment] = useState(false);
  const [isAgreementSign, setIsAgreementSign] = useState(false); 
  const [isDepositWaiveoff, setisDepositWaiveoff] = useState(false)
  const [iskycoutlet, setiskycoutlet] = useState(false);
  const [isdisplayDone, setIsdisplayDone] = useState(false);
  const [isAuthorisedOutlet, setIsAuthorisedOutlet] = useState(false);
  const [isPromotionAllowed, setIsPromotionAllowed] = useState(false);
  const [isJoiningfeewaiveoff, setIsJoiningfeewaiveoff] = useState(false)
  const [isInKYCKYC, setIsInKYCKYC] = useState(false);
  const [isInsorInKyc, setIsInsorInKyc] = useState(false);
  const [isInvoicingAddress, setisInvoicingAddress] = useState(false); 




  const [form] = Form.useForm();
  const [mainForm] = Form.useForm();
  const [CustomerInfoForm] = Form.useForm();
  const [kycForm] = Form.useForm();
  const [stockmixForm] = Form.useForm();
  const [regulatoryForm] = Form.useForm();
  const [termsAndConditionForm] = Form.useForm();
  const [outletForm] = Form.useForm();



  useEffect(async () => {
    
  
    if (pjMasterId === "undefined") {
       //openaddAddressModalCustomerInfo();
       openaddAddressModalkycNewButton();
    } else {
      gettabAndTableData();
      getData();
      gettabKYCToOutletData();
    } 
      
  
    const userData = JSON.parse(window.localStorage.getItem("userData"));
    const businessUnitResponse = await getroleBunit(userData.user_id);
    setBunitData(businessUnitResponse.userBunit);

    const CustomerCategoryResponse = await getCustomerCategoryTypeData();
    setCustomerCategoryData(CustomerCategoryResponse.searchData);

    const CurrencyDataResponse = await getCurrencyDropDownData();
    setCurrencyData(CurrencyDataResponse.searchData);

    const paymentDataResponse = await getPaymentTermsDropDownData();
    setPaymentData(paymentDataResponse.searchData);

    const stateDataResponse = await getStateDropDownData();
    setStateData(stateDataResponse.searchData);

    const countryDataResponse = await getCountryDropDownData();
    setCountryData(countryDataResponse.searchData);

    const InvoiceFormateDropDownresponse = await getInvoiceFormateDropDown();
    setInvoiceFormateDate(InvoiceFormateDropDownresponse.searchData);

    const stateDatakycResponse = await getkycStateDropDownData();
    setStateKYCData(stateDatakycResponse.searchData);

    const countryKycDataResponse = await getkycCountryDropDownData();
    setCountryKYCData(countryKycDataResponse.searchData);

    const salesRepDataResponse = await getSalesRepDropDown();

    setSalesRepData(salesRepDataResponse.searchData);

    const stateOutletDataResponse = await getStateOutletDropDown();
    setStateOutlet(stateOutletDataResponse.searchData);

    const creditDataResponse = await getCreditPeriodDropDown();
    setCreditDataData(creditDataResponse.searchData);
  }, []);

  const getData = async () => {
    setLoading(true);
    const pjMasterId = localStorage.getItem("pjMasterId");

    const getDataResponse = await getPjDetailsData(pjMasterId);
 
     if (getDataResponse && getDataResponse!== undefined) {
      if (getDataResponse.length > 0 || getDataResponse !== null) {
    setHeaderFormData(getDataResponse); 
    setoutletValue(getDataResponse[0].dvnContact);
    setdvnclass(getDataResponse[0].dvnclassification) ; 
   
    setDVNBankRegulatory(getDataResponse[0].dvnBankDetails);
    setdvnAddress(getDataResponse[0].dvncustAddress);
    setdvnCustomerKyc(getDataResponse[0].dvnCustomer);
    // for (let index = 0; index < getDataResponse.length; index++) {
    //   getDataResponse[index].key = getDataResponse[index].pjMasterId;
    // }
    }
    }

    setLoading(false);
  };
  const gettabKYCToOutletData = async () => {
    setLoading(true);
    const pjMasterId = localStorage.getItem("pjMasterId");
    const kycTabDataresponse = await getKycData(pjMasterId);
    const termsAndCondition = await getTermsConditionsData(pjMasterId);
    const Regulatoryresponse = await getRegulatoryData(pjMasterId);
    const StockMixDataresponse = await getStockMixData(pjMasterId);
    const outletHederResponse = await getOutletData(pjMasterId);
   

    setLoading(false);
    for (let i = 0; i < kycTabDataresponse.length; i++) {
      kycTabDataresponse[i].kycflag = "N";
    }
    setKycTabHeader(kycTabDataresponse);
    for (let i = 0; i < StockMixDataresponse.length; i++) {
      StockMixDataresponse[i].flag = "N";
    }
    setTermsAndConditionTab(termsAndCondition);
  
   

    for (let i = 0; i < Regulatoryresponse.length; i++) {
      Regulatoryresponse[i].regulatoryflag = "N";
    }
    setRegulatoryTabHeader(Regulatoryresponse);

    setStockMixHeader(StockMixDataresponse);

    for (let i = 0; i < outletHederResponse.length; i++) {
      outletHederResponse[i].outletflag = "N";
    }

    setOutletHeader(outletHederResponse);
    setLoading(false);
  };

  const onChangeCheckBOx = (e) => {
    setISInvoicing(e.target.checked);
    setIsTDSApplication(e.target.checked);
  };

  const onChangeCheckBoxcustomer = (e) => {
    setIsInvoicingCustomer(e.target.checked);
  };

  const gettabAndTableData = async () => {
    setLoading(true);
    const pjMasterId = localStorage.getItem("pjMasterId");

    const customerInfoTabData = await getCustomerInfoTabData(pjMasterId);
    // if (customerInfoTabData !== undefined) {
    //   if (customerInfoTabData.length > 0 || customerInfoTabData !== null) {

    setcustomerInfoHeder(customerInfoTabData);

    // mainForm.setFieldsValue({
    //   bUnitName: customerInfoTabData[0]["csBunitId"],
    //   pjcode: customerInfoTabData[0].pjCode,
    //   pjName: customerInfoTabData[0].pjName,
    //   customercategory: customerInfoTabData[0].customerCategory["sCustomerCategoryId"],
    //   gstno: customerInfoTabData[0].gstNo,
    //   currency: customerInfoTabData[0].currency["csCurrencyId"],
    //   nickname: customerInfoTabData[0].pjName,
    //   invoicingname: customerInfoTabData[0].currency.isoCode,
    //   invoicingaddress: customerInfoTabData[0].invoicingAddress,
    //   CSAlimit: customerInfoTabData[0].csaLimit,
    //   ASSLimit: customerInfoTabData[0].asslimit,
    //   ASSStartDate: moment(customerInfoTabData[0].assStartDate).format("YYYY-MM-DD"),
    //   ASSEndDate: moment(customerInfoTabData[0].assEndDate).format("YYYY-MM-DD"),
    //   totalconsignmentStock: customerInfoTabData[0].totalConsignmentStock,
    //   outrightstock: customerInfoTabData[0].outRightStock,
    //   TotalStock: customerInfoTabData[0].totalStock,
    //   paymentterms: customerInfoTabData[0].paymentTerms["csPaymenttermID"],
    //   customerInfopjtype: customerInfoTabData[0].pjtype,
    //   customerinfopjgroup: customerInfoTabData[0].pjGroup,
    //   customerInfoPJClosureDate: moment(customerInfoTabData[0].pjClosureDate).format("YYYY-MM-DD"),
    //   customerInfoPJOnboardingDate: moment(customerInfoTabData[0].pjOnboardingDate).format("YYYY-MM-DD"),
    //   customerInfoownername: customerInfoTabData[0].pjName,
    //   customerinfocity: customerInfoTabData[0].city,
    //   customerInfostate: customerInfoTabData[0].region["csRegionID"],
    //   customerInfozone: customerInfoTabData[0].zone,
    //   customerInfoEmail: customerInfoTabData[0].email,
    //   customerinfomobileno: customerInfoTabData[0].mobileNo,
    //   customerInfoCountry: customerInfoTabData[0].country["csCountryID"],
    //   customerInfopincode: customerInfoTabData[0].pincode,
    //   customerinfoWebSiteaddress: customerInfoTabData[0].websiteAddress,
    //   customerInfosolitairejewellery: customerInfoTabData[0].solitaireJewellery,
    //   customerinfosmalldiamondjewellery: customerInfoTabData[0].smallDiamondJewellery,
    //   customerInfoGoldJewellery: customerInfoTabData[0].goldJewellery,
    //   customerInfoluxurylifestyleitems: customerInfoTabData[0].luxuryLifestyle,
    //   customerInfoOthers: customerInfoTabData[0].others,
    //   customerInfoRegisteredWithDS: customerInfoTabData[0].registeredWithDs,
    //   customerInfoUnRegisteredWithDS: customerInfoTabData[0].unregisteredWithDs,
    //   invoiceFormate: customerInfoTabData[0].csDocType["csDoctypeId"],
    // });
    //   }
    // }

    // setISInvoicing(customerInfoHeder !== undefined ? (customerInfoHeder[0].isInvoicing === "Y" ? true : false) : "");
    setLoading(false);
  };
  const imageUploadStatusChangeKycOwnerPic = (uploadStatus) => {
    const fieldsToUpdate = {};
    fieldsToUpdate["item"] = uploadStatus.file.response;

    kycForm.setFieldsValue({
      KycOwnerPic: uploadStatus.file.response,
      kyccompmany_Logo: uploadStatus.file.response,
    });
  };

  const editFieldsInFromNewButtonKyc = (data) => { 
   
     
    kycForm.setFieldsValue({
      bUnitNamekyc: data["csBunitId"],
      KycpjName: data.pjName,
      Kycpjcode: data.pjCode,
      kycNickName: data.nickName,
      kycOnboarding_Date: moment(data.pjOnboardingDate),
      Kycpj_ClosureDate: moment(data.pjClosureDate),
      Kycpj_Address: data.pjAddress,
      kyc_city: data.city,
      kyc_state: data.region["csRegionID"],
      kyc_zone: data.zone,
      Country_Kyc: data.country["csCountryID"],
      kycpin_code: data.pincode,
      kyc_pjsalesRep: data.salesRep["salesRepresentId"],
      kycpj_SalesRepStartDate: moment(data.pjSalesRepStartDate),
      kycpjSalesRepEndDate: moment(data.pjSalesRepEndDate),
      kycpjOwnerName: data.ownerName,
      kycmobileNo: data.mobileNo,
      kycemail: data.email,
      kyc_Birth_Date: moment(data.birthDate),
      kyc_Anniversary_Date: moment(data.anniversaryDate),
      Kyc_Address: data.pjAddress,
      KycOwnerPic: data.ownerPic,
      date_of_Establishement: moment(data.dateofEstablishement),
      kyccompmany_Logo: data.compmanyLogo,
      kyccategory: data.category["sCustomerCategoryId"],
      kyccurrency: data.currency["csCurrencyId"],
      kycinvoiceFormate: data.docType["csDoctypeId"],
      kycpaymentterms: data.paymentTerms["csPaymenttermID"],
      InvoicingNamekyc: data.invoicingName,
      TypeKyc: data.type,
      PJGroupKyc: data.pjGroup,
      Websiteaddresskyc: data.websiteAddress,
      SolitaireJewellerykyc: data.solitaireJewellery,
      SmallDiamondJewelleryKyc: data.smallDiamondJewellery,
      GoldJewelleryKyc: data.goldJewellery,
      LuxuryLifestyleitemsKyc: data.luxuryLifestyle,
      Others: data.others,
      RegisteredwithDSKyc: data.registeredWithDs,
      UnregisteredwithDSKyc: data.unregisteredWithDs,
    });
    setVisibleNewButtonkYC(true)
    // setVisibleForKYCEdit(true);
    setIsInKYCKYC(data.kyc === "Y" ? true : false);
    setKycDvnCustomerId(data.dvnCustomerId); 
    setKycpjmsndterId(data.pjMasterId)
    setIsInsorInKyc(data.sor === "Y" ? true : false);
    setisInvoicingAddress(data.invoicingAddress === "Y" ? true : false); 
  
    };

  const editFieldsInFrom = (data) => {
  
    kycForm.setFieldsValue({
      bUnitNamekyc: data["csBunitId"],
      KycpjName: data.pjName,
      Kycpjcode: data.pjCode,
      kycNickName: data.nickName,
      kycOnboarding_Date: moment(data.pjOnboardingDate),
      Kycpj_ClosureDate: moment(data.pjClosureDate),
      Kycpj_Address: data.pjAddress,
      kyc_city: data.city,
      kyc_state: data.region["csRegionID"],
      kyc_zone: data.zone,
      Country_Kyc: data.country["csCountryID"],
      kycpin_code: data.pincode,
      kyc_pjsalesRep: data.salesRep["salesRepresentId"],
      kycpj_SalesRepStartDate: moment(data.pjSalesRepStartDate),
      kycpjSalesRepEndDate: moment(data.pjSalesRepEndDate),
      kycpjOwnerName: data.ownerName,
      kycmobileNo: data.mobileNo,
      kycemail: data.email,
      kyc_Birth_Date: moment(data.birthDate),
      kyc_Anniversary_Date: moment(data.anniversaryDate),
      Kyc_Address: data.pjAddress,
      KycOwnerPic: data.ownerPic,
      date_of_Establishement: moment(data.dateofEstablishement),
      kyccompmany_Logo: data.compmanyLogo,
      kyccategory: data.category["sCustomerCategoryId"],
      kyccurrency: data.currency["csCurrencyId"],
      kycinvoiceFormate: data.docType["csDoctypeId"],
      kycpaymentterms: data.paymentTerms["csPaymenttermID"],
      InvoicingNamekyc: data.invoicingName,
      TypeKyc: data.type,
      PJGroupKyc: data.pjGroup,
      Websiteaddresskyc: data.websiteAddress,
      SolitaireJewellerykyc: data.solitaireJewellery,
      SmallDiamondJewelleryKyc: data.smallDiamondJewellery,
      GoldJewelleryKyc: data.goldJewellery,
      LuxuryLifestyleitemsKyc: data.luxuryLifestyle,
      Others: data.others,
      RegisteredwithDSKyc: data.registeredWithDs,
      UnregisteredwithDSKyc: data.unregisteredWithDs,
    });
    setVisibleForKYCEdit(true);
    setIsInKYCKYC(data.kyc === "Y" ? true : false);
    setKycDvnCustomerId(data.dvnCustomerId);
    setKycpjmsndterId(data.pjMasterId)
    setIsInsorInKyc(data.sor === "Y" ? true : false);
    setisInvoicingAddress(data.invoicingAddress === "Y" ? true : false);
   
  };

  const handleCancelAllModal = () => {
    // setVisibleForCustomerInfoEdit(false);
    setVisibleForKYCEdit(false);
    setVisibleForStockEdit(false);
    setVisibleForRegulatoryEdit(false);
    setvisibleForTermsAndConditionEdit(false);
    setvisibleForOutletEdit(false);
    setvisibleForOutletEdit(false);
  };

  const handelCancelcustomer = () => {
    setVisibleForCustomerInfoEdit(false);
    history.push(`/others/window/7452`);
  };

  const handelCancelKyc = () => {
    setVisibleNewButtonkYC(false);
    history.push(`/others/window/7452`);
  };
  const handelCancelcustomeredit = () => {
    setVisibleForCustomerInfoNewEdit(false);
  };

  const imageUploadStatusChangecustomer = (uploadStatus) => {
    const fieldsToUpdate = {};
    fieldsToUpdate["item"] = uploadStatus.file.response;

    CustomerInfoForm.setFieldsValue({
      customerInfownerPic: uploadStatus.file.response,
      customerInfoCompanyLogo: uploadStatus.file.response,
    });
  };

  const editFieldsInCustomeTabNew = async () => {
    const customerInfoTabData = await getCustomerInfoTabData(pjMasterId);
    if (customerInfoTabData.length > 0 || customerInfoTabData !== null) {
      setcustomerInfoHeder(customerInfoTabData);

      CustomerInfoForm.setFieldsValue({
        bUnitName: customerInfoTabData[0]["csBunitId"],
        pjcode: customerInfoTabData[0].pjCode,
        pjName: customerInfoTabData[0].pjName,
        customercategory: customerInfoTabData[0].customerCategory["sCustomerCategoryId"],
        customerinfoGSTNo: customerInfoTabData[0].gstNo,
        currency: customerInfoTabData[0].currency["csCurrencyId"],
        nickname: customerInfoTabData[0].pjName,
        invoicingname: customerInfoTabData[0].currency.isoCode,
        custominfoinvoicingaddress: customerInfoTabData[0].invoicingAddress,
        CSAlimit: customerInfoTabData[0].csaLimit,
        ASSLimit: customerInfoTabData[0].asslimit,
        ASSStartDate: moment(customerInfoTabData[0].assStartDate),
        ASSEndDate: moment(customerInfoTabData[0].assEndDate),
        customertotalconsignmentStock: customerInfoTabData[0].totalConsignmentStock,
        customeroutrightstock: customerInfoTabData[0].outRightStock,
        customerInfoTotalStock: customerInfoTabData[0].totalStock,
        paymentterms: customerInfoTabData[0].paymentTerms["csPaymenttermID"],
        customerInfopjtype: customerInfoTabData[0].pjtype,
        customerinfopjgroup: customerInfoTabData[0].pjGroup,
        customerInfoPJClosureDate: moment(customerInfoTabData[0].pjClosureDate),
        customerInfoPJOnboardingDate: moment(customerInfoTabData[0].pjOnboardingDate),
        customerInfoownername: customerInfoTabData[0].pjName,
        customerinfocity: customerInfoTabData[0].city,
        customerInfostate: customerInfoTabData[0].region["csRegionID"],
        customerInfozone: customerInfoTabData[0].zone,
        customerInfoEmail: customerInfoTabData[0].email,
        customerinfomobileno: customerInfoTabData[0].mobileNo,
        customerInfoCountry: customerInfoTabData[0].country["csCountryID"],
        customerInfopincode: customerInfoTabData[0].pincode,
        customerinfoWebSiteaddress: customerInfoTabData[0].websiteAddress,
        customerInfosolitairejewellery: customerInfoTabData[0].solitaireJewellery,
        customerinfosmalldiamondjewellery: customerInfoTabData[0].smallDiamondJewellery,
        customerInfoGoldJewellery: customerInfoTabData[0].goldJewellery,
        customerInfoluxurylifestyleitems: customerInfoTabData[0].luxuryLifestyle,
        customerInfoOthers: customerInfoTabData[0].others,
        customerInfoRegisteredWithDS: customerInfoTabData[0].registeredWithDs,
        customerInfoUnRegisteredWithDS: customerInfoTabData[0].unregisteredWithDs,
        invoiceFormate: customerInfoTabData[0].csDocType["csDoctypeId"],
        customerInfoCompanyLogo: customerInfoTabData[0].companyLogo,
        customerInfownerPic: customerInfoTabData[0].ownerPic,
      });
      setIsInvoicingCustomer(customerInfoTabData[0].isInvoicing === "Y" ? true : false);
    }
    setVisibleForCustomerInfoEdit(true);
    setpjmasterCustomerInfo(customerInfoTabData !== undefined ? customerInfoTabData[0].pjMasterId : "");
  };

  const editFieldsInCustomeTab = async () => {
    const customerInfoTabData = await getCustomerInfoTabData(pjMasterId);
    if (customerInfoTabData.length > 0 || customerInfoTabData !== null) {
      setcustomerInfoHeder(customerInfoTabData);

      CustomerInfoForm.setFieldsValue({
        bUnitName: customerInfoTabData[0]["csBunitId"],
        pjcode: customerInfoTabData[0].pjCode,
        pjName: customerInfoTabData[0].pjName,
        customercategory: customerInfoTabData[0].customerCategory["sCustomerCategoryId"],
        customerinfoGSTNo: customerInfoTabData[0].gstNo,
        currency: customerInfoTabData[0].currency["csCurrencyId"],
        nickname: customerInfoTabData[0].pjName,
        invoicingname: customerInfoTabData[0].currency.isoCode,
        custominfoinvoicingaddress: customerInfoTabData[0].invoicingAddress,
        CSAlimit: customerInfoTabData[0].csaLimit,
        ASSLimit: customerInfoTabData[0].asslimit,
        ASSStartDate: moment(customerInfoTabData[0].assStartDate),
        ASSEndDate: moment(customerInfoTabData[0].assEndDate),
        customertotalconsignmentStock: customerInfoTabData[0].totalConsignmentStock,
        customeroutrightstock: customerInfoTabData[0].outRightStock,
        customerInfoTotalStock: customerInfoTabData[0].totalStock,
        paymentterms: customerInfoTabData[0].paymentTerms["csPaymenttermID"],
        customerInfopjtype: customerInfoTabData[0].pjtype,
        customerinfopjgroup: customerInfoTabData[0].pjGroup,
        customerInfoPJClosureDate: moment(customerInfoTabData[0].pjClosureDate),
        customerInfoPJOnboardingDate: moment(customerInfoTabData[0].pjOnboardingDate),
        customerInfoownername: customerInfoTabData[0].pjName,
        customerinfocity: customerInfoTabData[0].city,
        customerInfostate: customerInfoTabData[0].region["csRegionID"],
        customerInfozone: customerInfoTabData[0].zone,
        customerInfoEmail: customerInfoTabData[0].email,
        customerinfomobileno: customerInfoTabData[0].mobileNo,
        customerInfoCountry: customerInfoTabData[0].country["csCountryID"],
        customerInfopincode: customerInfoTabData[0].pincode,
        customerinfoWebSiteaddress: customerInfoTabData[0].websiteAddress,
        customerInfosolitairejewellery: customerInfoTabData[0].solitaireJewellery,
        customerinfosmalldiamondjewellery: customerInfoTabData[0].smallDiamondJewellery,
        customerInfoGoldJewellery: customerInfoTabData[0].goldJewellery,
        customerInfoluxurylifestyleitems: customerInfoTabData[0].luxuryLifestyle,
        customerInfoOthers: customerInfoTabData[0].others,
        customerInfoRegisteredWithDS: customerInfoTabData[0].registeredWithDs,
        customerInfoUnRegisteredWithDS: customerInfoTabData[0].unregisteredWithDs,
        invoiceFormate: customerInfoTabData[0].csDocType["csDoctypeId"],
        customerInfoCompanyLogo: customerInfoTabData[0].companyLogo,
        customerInfownerPic: customerInfoTabData[0].ownerPic,
      });
      setIsInvoicingCustomer(customerInfoTabData[0].isInvoicing === "Y" ? true : false);
    }
    setVisibleForCustomerInfoNewEdit(true);
    setpjmasterCustomerInfo(customerInfoTabData !== undefined ? customerInfoTabData[0].pjMasterId : "");
  };
  const editFieldsInFromTerms = (data) => {
    termsAndConditionForm.setFieldsValue({
      PaymentTermsterm: data["paymentTermId"],
      margin: data.margin,
      depositCommited: data.depositCommited,
      creditPeriod_terms: data.paymentTerms["creditPeriod"],
      CSALimit_teams: data.csaLimit,
      ASSLimit_teams: data.asslimit,
      CreditLimit_terms: data.pjCreditLimit,
      Projection_JwellerWiseTarget: data.projectionJwellerWiseTarget,
      store_WiseTarget: data.storeWiseTarget,
      storeWise_PromptPayment: data.storeWisePromptPayment,
      agreement_Date: moment(data.agreementDate),
      DepositReceivedValue: data.depositReceivedValue,
      TotalConsignmentStock_team: data.totalConsignmentStock,
      Outrightstock_team: data.outRightStock,
      Totalstock_team: data.totalStock,
    });
    setDvnCustomerAddressId(data.dvnCustomerAddressId);
    setvisibleForTermsAndConditionEdit(true);
    setIsAgreementSign(data.agreementSign === "Y" ? true : false); 
    setisDepositWaiveoff(data.depositWvOff==="Y"?true:false)
  };

  const editFieldsInFromRegulatory = (data) => {
    regulatoryForm.setFieldsValue({
      BankAccountNo: data.bankAccNumber,
      bank_Name: data.bankname,
      bra_nch: data.branch,
      ifsc_Code: data.ifscCode,
      Gst_No: data.gstNo,
      panNo: data.panNo,
    });
    setVisibleForRegulatoryEdit(true);
    setCBankDetailsId(data.cBankDetailsId);
    setIstdsAPPlication(data.tdsApplicable === "Y" ? true : false);
    setIsGSTApplicable(data.gstApplicable === "Y" ? true : false);
    setIncentivePromptPayment(data.incentivePromptPayment === "Y" ? true : false);
    setJewellerLevelPromptPayment(data.jwellerlevelPromtPayment === "Y" ? true : false);
  };

  const editFieldsInFromStockMix = (data) => {
    stockmixForm.setFieldsValue({
      small: data.small,
      medium: data.medium,
      Large: data.large,
      ExLarge: data.exLarge,
      DEFVVS: data.defVvs,
      DEFVS: data.defVs,
      DEFSI: data.defSi,
      GHVVS: data.ghVvs,
      GHVS: data.ghVs,
      GHSI: data.ghSi,
      IJKVVS: data.ijkVvs,
      IJKVS: data.ijkVs,
      IJKSI: data.ijksi,
      DSD: data.dsd,
      DSJ: data.dsj,
    });
    setVisibleForStockEdit(true);
    setDOtherClassificationId(data.dOtherClassificationId);
  };
  const imageUploadStatusChange = (uploadStatus) => {
    const fieldsToUpdate = {};
    fieldsToUpdate["item"] = uploadStatus.file.response;

    outletForm.setFieldsValue({
      OutletPic_outlet: uploadStatus.file.response,
    });
  };

  const editFieldsInFromOutlet = (data) => { 
    outletForm.setFieldsValue({
      outlet_Name: data.outletName,
      outlet_nickName: data.nickName,
      outlet_addressLine1: data.addressLine1,
      outlet_City: data.outletCity,
      outlet_pinCode: data.pinCode,
      stateNameoutlet: data.region["csRegionID"],
      outlet_zone: data.zone,
      outlet_tier: data.tier,
      outlet_mobileNo: data.mobileNo,
      outlet_sarea: data.area,
      outlet_email: data.email,
      outlet_MarketName: data.marketName,
      outlet_storeContactPersonName: data.storeContactPersonName,
      outlet_storeContactPersonNo: data.storeContactPersonNo,
      outlet_weeklyOff: data.weeklyOff,
      outlet_gstNo: data.gstNo,
      outlet_OnboardingDate: moment(data.outletOnboardingDate),
      outlet_ClosureDate: moment(data.outletClosureDate),
      outlet_salesRep: data.salesRep["pjSalesRepresentative"],
      outlet_salesRepStartDate: moment(data.salesRepStartDate),
      outlet_salesRepEndDate: moment(data.salesRepEndDate),
      pricelist_HandoverContact_PersonName: data.pricelistHandoverContactPersonName,
      pHandover_ContactPersonNo: data.pHandoverContactPersonNo,
      outlet_stockConfirmationContactName: data.stockConfirmationContactName,
      outlet_stockConfirmationContactNo: data.stockConfirmationContactNo,
      outlet_trialFromPeriod: moment(data.trialFromPeriod),
      outlet_trialToPeriod: moment(data.trialToPeriod),
      outlet_totalStock: data.totalStock, 
      // outlet_totalStock2:data.pjTotalStock,
      outlet_ProjectionJwellerWiseTarget: data.projectionJwellerWiseTarget,
      outlet_storeWiseTarget: data.storeWiseTarget,
      OutletPic_outlet: data.outletPic,
      outlet_Longitude: data.outletLongitude,
      outlet_Latitude: data.outletLatitude, 
      Dateoutlet:moment(data.joiningFeeDate),
      Amount0utlet:data.joiningFeeAmount,
      Commentsoutlet:data.comment,
    });
    setiskycoutlet(data.kyc === "Y" ? true : false);
    setcustomerContactId(data.customerContactId);
    setIsdisplayDone(data.displayDone === "Y" ? true : false);
    setIsAuthorisedOutlet(data.authorizedoutlet === "Y" ? true : false);
    setIsPromotionAllowed(data.promotionAllowed === "Y" ? true : false); 
    setIsJoiningfeewaiveoff(data.joiningWvOff ==="Y"? true:false);
    setvisibleForOutletEdit(true);
  };

  const openaddAddressModal = () => {
    setVisibleForStockEdit(true);
    stockmixForm.resetFields();
  };

  const openaddAddressModalRegulatory = () => {
    setVisibleForRegulatoryEdit(true);
    regulatoryForm.resetFields();
  };

  const openaddAddressModalTeamsAndCondition = () => {
    setvisibleForTermsAndConditionEdit(true);
    termsAndConditionForm.resetFields();
  };
  const openaddAddressModaloutlet = () => {
    setvisibleForOutletEdit(true);
    outletForm.resetFields();
  };

  const openaddAddressModalkyc = () => {
    setVisibleForKYCEdit(true);
    kycForm.resetFields();
  };

  const openaddAddressModalkycNewButton = () => {
    setVisibleNewButtonkYC(true); 
   
    kycForm.resetFields();
  };
  const openaddAddressModalCustomerInfo = () => {
    setVisibleForCustomerInfoEdit(true);
    CustomerInfoForm.resetFields();
  };

  const onChangechecbox = (event) => {
    setIstdsAPPlication(event.target.checked);

    setIsdisplayDone(event.target.checked);
    setIsInKYCKYC(event.target.checked);
   
  };
  const onChangecheckboxAuthorised = (event) => {
    setIsAuthorisedOutlet(event.target.checked);
  };
  const onChangePromotionAllowed = (e) => {
    setIsPromotionAllowed(e.target.checked);
  }; 

  
  const onChangejoiningWvOff = (e) => {
   setIsJoiningfeewaiveoff(e.target.checked) 
  }

  const onchangechecboxKycinOutlet = (event) => {
    setiskycoutlet(event.target.checked);
  };

  const onChangechecboxsor = (event) => {
    setIsInsorInKyc(event.target.checked);
  };
  const onchangeInvoiceAddress = (event) => {
    setisInvoicingAddress(event.target.checked);
  };

  const OnGSTApplicable = (e) => {
    setIsGSTApplicable(e.target.checked);
  };

  const onIncentivePromptPayment = (e) => {
    setIncentivePromptPayment(e.target.checked);
  };
  const onJewellerLevelPromptPayment = (e) => {
    setJewellerLevelPromptPayment(e.target.checked);
  };

  const agreementSign = (e) => {
    setIsAgreementSign(e.target.checked);
  }; 
  const OnDeposit=(e)=>{
    setisDepositWaiveoff(e.target.checked)
  }

  const getFinish = (values) => {
    const newToken = JSON.parse(localStorage.getItem("authTokens"));
    const pjMasterId = localStorage.getItem("pjMasterId");
    form.validateFields().then((values) => {
      mainForm.submit();
    });
    const fieldValues = CustomerInfoForm.getFieldsValue();

    const uniqueId = uuid().replace(/-/g, "").toUpperCase();

    const customsaveButton = {
      query: `mutation {
        upsertPjMaster(dvnPjMasters: { dvnPjMaster: [{
            pjMasterId: "${pjmasterCustomerInfo === null || pjmasterCustomerInfo === undefined ? uniqueId : `${pjmasterCustomerInfo}`}"
            csBunitId: ${fieldValues.bUnitName === null || fieldValues.bUnitName === undefined ? null : `"${fieldValues.bUnitName}"`}
            pjCode: ${fieldValues.pjcode === null || fieldValues.pjcode === undefined ? null : `"${fieldValues.pjcode}"`}
            pjName: ${fieldValues.pjName === null || fieldValues.pjName === undefined ? null : `"${fieldValues.pjName}"`}
            gstNo: ${fieldValues.customerinfoGSTNo === null || fieldValues.customerinfoGSTNo === undefined ? null : `"${fieldValues.customerinfoGSTNo}"`}
            customerCategoryId: ${fieldValues.customercategory === null || fieldValues.customercategory === undefined ? null : `"${fieldValues.customercategory}"`}
            cscurrencyId: "${fieldValues.currency}"
            isInvoicing: "${isInvoicingCustomer === true ? "Y" : "N"}"
            invoicingAddress: ${
              fieldValues.custominfoinvoicingaddress === null || fieldValues.custominfoinvoicingaddress === undefined ? null : `"${fieldValues.custominfoinvoicingaddress}"`
            }
            pjGroup:  ${fieldValues.customerinfopjgroup === null || fieldValues.customerinfopjgroup === undefined ? null : `"${fieldValues.customerinfopjgroup}"`}
            csaLimit: ${fieldValues.CSAlimit ? `${fieldValues.CSAlimit}` : null}
            asslimit: ${fieldValues.ASSLimit ? `${fieldValues.ASSLimit}` : null}
            aStartDate: ${fieldValues.ASSStartDate === null || fieldValues.ASSStartDate === undefined ? null : `"${moment(fieldValues.ASSStartDate).format("YYYY-MM-DD")}"`}
           aEndDate: ${fieldValues.ASSEndDate === null || fieldValues.ASSEndDate === undefined ? null : `"${moment(fieldValues.ASSEndDate).format("YYYY-MM-DD")}"`}
             totalConsignmentStock: ${fieldValues.customertotalconsignmentStock ? `${fieldValues.customertotalconsignmentStock}` : null}
            outRightStock: ${fieldValues.customeroutrightstock ? `${fieldValues.customeroutrightstock}` : null}
            totalStock: ${fieldValues.customerInfoTotalStock ? `${fieldValues.customerInfoTotalStock}` : null} 
            csPaymentId:${fieldValues.paymentterms === null || fieldValues.paymentterms === undefined ? null : `"${fieldValues.paymentterms}"`}
            websiteAddress:${
              fieldValues.customerinfoWebSiteaddress === null || fieldValues.customerinfoWebSiteaddress === undefined ? null : `"${fieldValues.customerinfoWebSiteaddress}"`
            }
            companyLogo:${fieldValues.customerInfoCompanyLogo === null || fieldValues.customerInfoCompanyLogo === undefined ? null : `"${fieldValues.customerInfoCompanyLogo}"`}
            ownerPic: ${fieldValues.customerInfownerPic === null || fieldValues.customerInfownerPic === undefined ? null : `"${fieldValues.customerInfownerPic}"`}
            registeredWithDs: ${
              fieldValues.customerInfoRegisteredWithDS === null || fieldValues.customerInfoRegisteredWithDS === undefined ? null : `"${fieldValues.customerInfoRegisteredWithDS}"`
            } 
            unregisteredWithDs: ${
              fieldValues.customerInfoUnRegisteredWithDS === null || fieldValues.customerInfoUnRegisteredWithDS === undefined
                ? null
                : `"${fieldValues.customerInfoUnRegisteredWithDS}"`
            } 
            solitaireJewellery: ${fieldValues.customerInfosolitairejewellery ? `${fieldValues.customerInfosolitairejewellery}` : null}
            smallDiamondJewellery:${fieldValues.customerinfosmalldiamondjewellery ? `${fieldValues.customerinfosmalldiamondjewellery}` : null} 
            goldJewellery: ${fieldValues.customerInfoGoldJewellery ? `${fieldValues.customerInfoGoldJewellery}` : null}
            luxuryLifestyle:${fieldValues.customerInfoluxurylifestyleitems ? `${fieldValues.customerInfoluxurylifestyleitems}` : null}
            others: ${fieldValues.customerInfoOthers ? `${fieldValues.customerInfoOthers}` : null} 
            pOnboardingDate: ${
              fieldValues.customerInfoPJOnboardingDate === null || fieldValues.customerInfoPJOnboardingDate === undefined
                ? null
                : `"${moment(fieldValues.customerInfoPJOnboardingDate).format("YYYY-MM-DD")}"`
            }
            pClosureDate:${
              fieldValues.customerInfoPJClosureDate === null || fieldValues.customerInfoPJClosureDate === undefined
                ? null
                : `"${moment(fieldValues.customerInfoPJClosureDate).format("YYYY-MM-DD")}"`
            }
            pjtype: ${fieldValues.customerInfopjtype === null || fieldValues.customerInfopjtype === undefined ? null : `"${fieldValues.customerInfopjtype}"`}
            ownerName:"${fieldValues.customerInfoownername}"
            city: "${fieldValues.customerinfocity}"
            zone: "${fieldValues.customerInfozone}"
            csRegionId: ${fieldValues.customerInfostate === null || fieldValues.customerInfostate === undefined ? null : `"${fieldValues.customerInfostate}"`}
            mobileNo:${fieldValues.customerinfomobileno === null || fieldValues.customerinfomobileno === undefined ? null : `${fieldValues.customerinfomobileno}`}
            email: ${fieldValues.customerInfoEmail === null || fieldValues.customerInfoEmail === undefined ? null : `"${fieldValues.customerInfoEmail}"`}
            pincode: ${fieldValues.customerInfopincode === null || fieldValues.customerInfopincode === undefined ? null : `${fieldValues.customerInfopincode}`}
            csCountryId:${fieldValues.customerInfoCountry === null || fieldValues.customerInfoCountry === undefined ? null : `"${fieldValues.customerInfoCountry}"`}
            docTypId:${fieldValues.invoiceFormate === null || fieldValues.invoiceFormate === undefined ? null : `"${fieldValues.invoiceFormate}"`}
          }]
           })
          { 
          status
          message  
          recordsId 
          }
          }
       `,
    };
    Axios({
      url: serverUrl,
      method: "POST",
      data: customsaveButton,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      },
    }).then((response) => {
      const Status = response.data.data.upsertPjMaster.status;
      if (Status === "200") {
        const messageForSuccess = response.data.data.upsertPjMaster.message;

        message.success(messageForSuccess);
        setVisibleForCustomerInfoEdit(false);
        CustomerInfoForm.resetFields();
        setTimeout(() => {
          gettabAndTableData();
        }, 500);
        setDisplayInputCustomrInfo("block");
        history.push(`/others/window/7452`);
      } else {
        message.error("getting error while creating lines");
        setVisibleForCustomerInfoEdit(false);
        setLoading(false);
        history.push(`/others/window/7452`);
      }
    });
  };

  const getFinishEdit = (values) => {
    const newToken = JSON.parse(localStorage.getItem("authTokens"));
    const pjMasterId = localStorage.getItem("pjMasterId");
    form.validateFields().then((values) => {
      mainForm.submit();
    });
    const fieldValues = CustomerInfoForm.getFieldsValue();

    const uniqueId = uuid().replace(/-/g, "").toUpperCase();

    const customsaveButton = {
      query: `mutation {
       upsertPjMaster(dvnPjMasters: { dvnPjMaster: [{
           pjMasterId: "${pjmasterCustomerInfo === null || pjmasterCustomerInfo === undefined ? null : `${pjmasterCustomerInfo}`}"
           csBunitId: ${fieldValues.bUnitName === null || fieldValues.bUnitName === undefined ? null : `"${fieldValues.bUnitName}"`}
           pjCode: ${fieldValues.pjcode === null || fieldValues.pjcode === undefined ? null : `"${fieldValues.pjcode}"`}
           pjName: ${fieldValues.pjName === null || fieldValues.pjName === undefined ? null : `"${fieldValues.pjName}"`}
           gstNo: ${fieldValues.customerinfoGSTNo === null || fieldValues.customerinfoGSTNo === undefined ? null : `"${fieldValues.customerinfoGSTNo}"`}
           customerCategoryId: ${fieldValues.customercategory === null || fieldValues.customercategory === undefined ? null : `"${fieldValues.customercategory}"`}
           cscurrencyId: ${fieldValues.currency === null || fieldValues.currency === undefined ? null : `"${fieldValues.currency}"`}
           isInvoicing: "${isInvoicingCustomer === true ? "Y" : "N"}"
           invoicingAddress: ${
             fieldValues.custominfoinvoicingaddress === null || fieldValues.custominfoinvoicingaddress === undefined ? null : `"${fieldValues.custominfoinvoicingaddress}"`
           }
           pjGroup:  ${fieldValues.customerinfopjgroup === null || fieldValues.customerinfopjgroup === undefined ? null : `"${fieldValues.customerinfopjgroup}"`}
           csaLimit: ${fieldValues.CSAlimit ? `${fieldValues.CSAlimit}` : null}
           asslimit: ${fieldValues.ASSLimit ? `${fieldValues.ASSLimit}` : null}
           aStartDate: ${fieldValues.ASSStartDate === null || fieldValues.ASSStartDate === undefined ? null : `"${moment(fieldValues.ASSStartDate).format("YYYY-MM-DD")}"`}
           aEndDate: ${fieldValues.ASSEndDate === null || fieldValues.ASSEndDate === undefined ? null : `"${moment(fieldValues.ASSEndDate).format("YYYY-MM-DD")}"`}
           totalConsignmentStock: ${fieldValues.customertotalconsignmentStock ? `${fieldValues.customertotalconsignmentStock}` : null}
            outRightStock: ${fieldValues.customeroutrightstock ? `${fieldValues.customeroutrightstock}` : null}
            totalStock: ${fieldValues.customerInfoTotalStock ? `${fieldValues.customerInfoTotalStock}` : null} 
            csPaymentId:${fieldValues.paymentterms === null || fieldValues.paymentterms === undefined ? null : `"${fieldValues.paymentterms}"`}
           websiteAddress:${
             fieldValues.customerinfoWebSiteaddress === null || fieldValues.customerinfoWebSiteaddress === undefined ? null : `"${fieldValues.customerinfoWebSiteaddress}"`
           }
           companyLogo:${fieldValues.customerInfoCompanyLogo === null || fieldValues.customerInfoCompanyLogo === undefined ? null : `"${fieldValues.customerInfoCompanyLogo}"`}
           ownerPic: ${fieldValues.customerInfownerPic === null || fieldValues.customerInfownerPic === undefined ? null : `"${fieldValues.customerInfownerPic}"`}
           registeredWithDs: ${
             fieldValues.customerInfoRegisteredWithDS === null || fieldValues.customerInfoRegisteredWithDS === undefined ? null : `"${fieldValues.customerInfoRegisteredWithDS}"`
           } 
           unregisteredWithDs: ${
             fieldValues.customerInfoUnRegisteredWithDS === null || fieldValues.customerInfoUnRegisteredWithDS === undefined
               ? null
               : `"${fieldValues.customerInfoUnRegisteredWithDS}"`
           } 
           solitaireJewellery: ${fieldValues.customerInfosolitairejewellery ? `${fieldValues.customerInfosolitairejewellery}` : null}
           smallDiamondJewellery:${fieldValues.customerinfosmalldiamondjewellery ? `${fieldValues.customerinfosmalldiamondjewellery}` : null} 
           goldJewellery: ${fieldValues.customerInfoGoldJewellery ? `${fieldValues.customerInfoGoldJewellery}` : null}
           luxuryLifestyle:${fieldValues.customerInfoluxurylifestyleitems ? `${fieldValues.customerInfoluxurylifestyleitems}` : null}
           others: ${fieldValues.customerInfoOthers ? `${fieldValues.customerInfoOthers}` : null}
           pOnboardingDate: ${
             fieldValues.customerInfoPJOnboardingDate === null || fieldValues.customerInfoPJOnboardingDate === undefined
               ? null
               : `"${moment(fieldValues.customerInfoPJOnboardingDate).format("YYYY-MM-DD")}"`
           }
           pClosureDate:${
             fieldValues.customerInfoPJClosureDate === null || fieldValues.customerInfoPJClosureDate === undefined
               ? null
               : `"${moment(fieldValues.customerInfoPJClosureDate).format("YYYY-MM-DD")}"`
           }
           pjtype: ${fieldValues.customerInfopjtype === null || fieldValues.customerInfopjtype === undefined ? null : `"${fieldValues.customerInfopjtype}"`}
           ownerName:"${fieldValues.customerInfoownername}"
           city: "${fieldValues.customerinfocity}"
           zone: "${fieldValues.customerInfozone}"
           csRegionId: ${fieldValues.customerInfostate === null || fieldValues.customerInfostate === undefined ? null : `"${fieldValues.customerInfostate}"`}
           mobileNo:${fieldValues.customerinfomobileno === null || fieldValues.customerinfomobileno === undefined ? null : `${fieldValues.customerinfomobileno}`}
           email: ${fieldValues.customerInfoEmail === null || fieldValues.customerInfoEmail === undefined ? null : `"${fieldValues.customerInfoEmail}"`}
           pincode: ${fieldValues.customerInfopincode === null || fieldValues.customerInfopincode === undefined ? null : `${fieldValues.customerInfopincode}`}
           csCountryId:${fieldValues.customerInfoCountry === null || fieldValues.customerInfoCountry === undefined ? null : `"${fieldValues.customerInfoCountry}"`}
            docTypId:${fieldValues.invoiceFormate === null || fieldValues.invoiceFormate === undefined ? null : `"${fieldValues.invoiceFormate}"`}
         }]
          })
         { 
         status
         message  
         recordsId 
         }
         }
      `,
    };
    Axios({
      url: serverUrl,
      method: "POST",
      data: customsaveButton,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      },
    }).then((response) => {
      const Status = response.data.data.upsertPjMaster.status;
      if (Status === "200") {
        const messageForSuccess = response.data.data.upsertPjMaster.message;

        message.success(messageForSuccess);
        setVisibleForCustomerInfoNewEdit(false);
        CustomerInfoForm.resetFields();
        setTimeout(() => {
          gettabAndTableData();
        }, 500);
        //setVisibleForCustomerInfoNewEdit("block");
      } else {
        message.error("getting error while creating lines");
        setVisibleForCustomerInfoNewEdit(false);
        setLoading(false);
      }
    });
  };

  const getoutletUpset = (values) => {
    const newToken = JSON.parse(localStorage.getItem("authTokens"));
    form.validateFields().then((values) => {
      mainForm.submit();
    });
    const pjMasterId = localStorage.getItem("pjMasterId");
    const fieldValues = outletForm.getFieldsValue();
    const uniqueId = uuid().replace(/-/g, "").toUpperCase();
    const outletsaveButton = {
      query: `mutation {
        upsertDvnOutlet(dvnOutlet: { dvnCustomerOutlet: [{
          customerContactId:"${customerContactId === null || customerContactId === undefined ? uniqueId : customerContactId}"
          pjMasterId:  ${pjMasterId === null || pjMasterId === undefined ? null : `"${pjMasterId}"`}
          csBunitId: "0"
          outletName: ${fieldValues.outlet_Name === null || fieldValues.outlet_Name === undefined ? null : `"${fieldValues.outlet_Name}"`}
          nickName: ${fieldValues.outlet_nickName === null || fieldValues.outlet_nickName === undefined ? null : `"${fieldValues.outlet_nickName}"`}
          ownerName: null
          addressLine1: ${fieldValues.outlet_addressLine1 === null || fieldValues.outlet_addressLine1 === undefined ? null : `"${fieldValues.outlet_addressLine1}"`}
          addressLine2: null
          outletCity: ${fieldValues.outlet_City === null || fieldValues.outlet_City === undefined ? null : `"${fieldValues.outlet_City}"`}
          state: ${fieldValues.stateNameoutlet === null || fieldValues.stateNameoutlet === undefined ? null : `"${fieldValues.stateNameoutlet}"`}
          outletCountry: null
          outletFullAddress:null
          pjSalesRepresentative: ${fieldValues.outlet_salesRep === null || fieldValues.outlet_salesRep === undefined ? null : `"${fieldValues.outlet_salesRep}"`}
          salesStartDate: ${
            fieldValues.outlet_salesRepStartDate === null || fieldValues.outlet_salesRepStartDate === undefined
              ? null
              : `"${moment(fieldValues.outlet_salesRepStartDate).format("YYYY-MM-DD")}"`
          }
          salesEndDate: ${
            fieldValues.outlet_salesRepEndDate === null || fieldValues.outlet_salesRepEndDate === undefined
              ? null
              : `"${moment(fieldValues.outlet_salesRepEndDate).format("YYYY-MM-DD")}"`
          }
          birthdayDate:null
          dateOfAnniversary: null
          dateOfOutletOnboard: ${
            fieldValues.outlet_OnboardingDate === null || fieldValues.outlet_OnboardingDate === undefined
              ? null
              : `"${moment(fieldValues.outlet_OnboardingDate).format("YYYY-MM-DD")}"`
          }
          dateOfClosureDate: ${
            fieldValues.outlet_ClosureDate === null || fieldValues.outlet_ClosureDate === undefined ? null : `"${moment(fieldValues.outlet_ClosureDate).format("YYYY-MM-DD")}"`
          }
          tFromPeriod:${
            fieldValues.outlet_trialFromPeriod === null || fieldValues.outlet_trialFromPeriod === undefined
              ? null
              : `"${moment(fieldValues.outlet_trialFromPeriod).format("YYYY-MM-DD")}"`
          }
          tToPeriod: ${
            fieldValues.outlet_trialToPeriod === null || fieldValues.outlet_trialToPeriod === undefined
              ? null
              : `"${moment(fieldValues.outlet_trialToPeriod).format("YYYY-MM-DD")}"`
          }
          gstNo: ${fieldValues.outlet_gstNo === null || fieldValues.outlet_gstNo === undefined ? null : `"${fieldValues.outlet_gstNo}"`}
          mobileNo: ${fieldValues.outlet_mobileNo === null || fieldValues.outlet_mobileNo === undefined ? null : `${fieldValues.outlet_mobileNo}`}
          advertisement:null
          email:  ${fieldValues.outlet_email === null || fieldValues.outlet_email === undefined ? null : `"${fieldValues.outlet_email}"`}
          area: ${fieldValues.outlet_sarea === null || fieldValues.outlet_sarea === undefined ? null : `"${fieldValues.outlet_sarea}"`}
          displayDone: "${isdisplayDone === true ? "Y" : "N"}"  
          outletLongitude: ${fieldValues.outlet_Longitude === null || fieldValues.outlet_Longitude === undefined ? null : `"${fieldValues.outlet_Longitude}"`}
          outletLatitude:${fieldValues.outlet_Latitude === null || fieldValues.outlet_Latitude === undefined ? null : `"${fieldValues.outlet_Latitude}"`}
          pricelistHandoverContactPersonName: ${
            fieldValues.pricelist_HandoverContact_PersonName === null || fieldValues.pricelist_HandoverContact_PersonName === undefined
              ? null
              : `"${fieldValues.pricelist_HandoverContact_PersonName}"`
          }
          stockConfirmationContactName:${
            fieldValues.outlet_stockConfirmationContactName === null || fieldValues.outlet_stockConfirmationContactName === undefined
              ? null
              : `"${fieldValues.outlet_stockConfirmationContactName}"`
          }
          storeContactPersonName: ${
            fieldValues.outlet_storeContactPersonName === null || fieldValues.outlet_storeContactPersonName === undefined ? null : `"${fieldValues.outlet_storeContactPersonName}"`
          }
          zone: ${fieldValues.outlet_zone === null || fieldValues.outlet_zone === undefined ? null : `"${fieldValues.outlet_zone}"`}
          tier: ${fieldValues.outlet_tier === null || fieldValues.outlet_tier === undefined ? null : `"${fieldValues.outlet_tier}"`}
          outletPic: ${fieldValues.OutletPic_outlet === null || fieldValues.OutletPic_outlet === undefined ? null : `"${fieldValues.OutletPic_outlet}"`}
          promotionAllowed:"${isPromotionAllowed === true ? "Y" : "N"}" 
          storeWiseTarget :  ${fieldValues.outlet_storeWiseTarget ? `${fieldValues.outlet_storeWiseTarget}` : null}
          projectionJwellerWiseTarget: ${fieldValues.outlet_ProjectionJwellerWiseTarget ? `${fieldValues.outlet_ProjectionJwellerWiseTarget}` : null}
          storeContactPersonNo: ${
            fieldValues.outlet_storeContactPersonNo === null || fieldValues.outlet_storeContactPersonNo === undefined ? null : `${fieldValues.outlet_storeContactPersonNo}`
          }
          stockConfirmationContactNo: ${
            fieldValues.outlet_stockConfirmationContactNo === null || fieldValues.outlet_stockConfirmationContactNo === undefined
              ? null
              : `${fieldValues.outlet_stockConfirmationContactNo}`
          }
          pHandoverContactPersonNo:${
            fieldValues.pHandover_ContactPersonNo === null || fieldValues.pHandover_ContactPersonNo === undefined ? null : `${fieldValues.pHandover_ContactPersonNo}`
          }
          pinCode: ${fieldValues.outlet_pinCode === null || fieldValues.outlet_pinCode === undefined ? null : `${fieldValues.outlet_pinCode}`}
          totalStock:${fieldValues.outlet_totalStock ? `${fieldValues.outlet_totalStock}` : null}
          weeklyOff: ${fieldValues.outlet_weeklyOff === null || fieldValues.outlet_weeklyOff === undefined ? null : `"${fieldValues.outlet_weeklyOff}"`}
          authorizedoutlet: "${isAuthorisedOutlet === true ? "Y" : "N"}"
          kyc:"${iskycoutlet === true ? "Y" : "N"}"
          joiningWvOff :"${isJoiningfeewaiveoff === true ? "Y" : "N"}" 
          marketName:${fieldValues.outlet_MarketName===null || fieldValues.outlet_MarketName===undefined ? null: `"${fieldValues.outlet_MarketName}"`}
          joiningFeeDate: ${
            fieldValues.Dateoutlet === null || fieldValues.Dateoutlet === undefined
              ? null
              : `"${moment(fieldValues.Dateoutlet).format("YYYY-MM-DD")}"`
          }
          joiningFeeAmount: ${fieldValues.Amount0utlet ? `${fieldValues.Amount0utlet}` : null}
          comment:${fieldValues.Commentsoutlet===null || fieldValues.Commentsoutlet===undefined ? null: `"${fieldValues.Commentsoutlet}"`}
          
        }
          ]
         }) { 
      status
      message 
      recordsId
      }
      }
      
      
      
      `,
    };
    Axios({
      url: serverUrl,
      method: "POST",
      data: outletsaveButton,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      },
    }).then((response) => {
      const status = response.data.data.upsertDvnOutlet.status;

      if (status === "200") {
        const messageForSuccess = response.data.data.upsertDvnOutlet.message;

        message.success(messageForSuccess);
        setvisibleForOutletEdit(false);
        outletForm.resetFields();
        setTimeout(() => {
          gettabKYCToOutletData();
        }, 100); 
        setLoading(true);
        // setDisplayInputOutlet("block");
      } else {
        message.error("getting error while creating lines");

        setLoading(false);
      }
    });
  };

  const getStockMixUpset = (data) => {
    const newToken = JSON.parse(localStorage.getItem("authTokens"));
    form.validateFields().then((values) => {
      mainForm.submit();
    });
    const fieldValues = stockmixForm.getFieldsValue();

    const pjMasterId = localStorage.getItem("pjMasterId");

    const uniqueId = uuid().replace(/-/g, "").toUpperCase();
    const stockMixsaveButton = {
      query: `mutation {
        upsertDvnClassification(dvnClassification: { dvnclassification: [{
          dOtherClassificationId: "${dOtherClassificationId === null || dOtherClassificationId === undefined ? uniqueId : dOtherClassificationId}"
          pjMasterId:  ${pjMasterId === null || pjMasterId === undefined ? null : `"${pjMasterId}"`}
          csBunitId: "0" 
          small: ${fieldValues.small === null || fieldValues.small === undefined ? null : `${fieldValues.small}`}
          medium: ${fieldValues.medium === null || fieldValues.medium === undefined ? null : `${fieldValues.medium}`}
          large: ${fieldValues.Large === null || fieldValues.Large === undefined ? null : `${fieldValues.Large}`}
          exLarge: ${fieldValues.ExLarge === null || fieldValues.ExLarge === undefined ? null : `${fieldValues.ExLarge}`}
          defVvs: ${fieldValues.DEFVVS === null || fieldValues.DEFVVS === undefined ? null : `${fieldValues.DEFVVS}`}
          defVs: ${fieldValues.DEFVS === null || fieldValues.DEFVS === undefined ? null : `${fieldValues.DEFVS}`}
          defSi: ${fieldValues.DEFSI === null || fieldValues.DEFSI === undefined ? null : `${fieldValues.DEFSI}`}
          ghVvs: ${fieldValues.GHVVS === null || fieldValues.GHVVS === undefined ? null : `${fieldValues.GHVVS}`}
          ghVs:${fieldValues.GHVS === null || fieldValues.GHVS === undefined ? null : `${fieldValues.GHVS}`}
          ghSi: ${fieldValues.GHSI === null || fieldValues.GHVS === undefined ? null : `${fieldValues.GHVS}`}
          ijkVvs: ${fieldValues.IJKVVS === null || fieldValues.IJKVVS === undefined ? null : `${fieldValues.IJKVVS}`}
          ijkVs: ${fieldValues.IJKVS === null || fieldValues.IJKVS === undefined ? null : `${fieldValues.IJKVS}`}
          ijksi: ${fieldValues.IJKSI === null || fieldValues.IJKSI === undefined ? null : `${fieldValues.IJKSI}`}
          dsd: ${fieldValues.DSD === null || fieldValues.DSD === undefined ? null : `${fieldValues.DSD}`}
          dsj:${fieldValues.DSJ === null || fieldValues.DSJ === undefined ? null : `${fieldValues.DSJ}`}
         }
          ]
         }) { 
      status
      message 
      recordsId
      }
      }`,
    };

    Axios({
      url: serverUrl,
      method: "POST",
      data: stockMixsaveButton,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      },
    }).then((response) => {
      const status = response.data.data.upsertDvnClassification.status;

      if (status === "200") {
        const messageForSuccess = response.data.data.upsertDvnClassification.message;

        message.success(messageForSuccess);
        stockmixForm.resetFields();
        setVisibleForStockEdit(false);
        setDOtherClassificationId(null);
        setTimeout(() => {
          gettabKYCToOutletData();
        }, 500);
        setDisplayInputStockMix("block");
      } else {
        message.error("getting error while creating lines");
        // setVisibleForStockEdit(false);
        setLoading(false);
      }
    });
  };

  const getRegulatoryupset = (values) => {
    const newToken = JSON.parse(localStorage.getItem("authTokens"));
    form.validateFields().then((values) => {
      mainForm.submit();
    });
    const pjMasterId = localStorage.getItem("pjMasterId");
    const fieldValues = regulatoryForm.getFieldsValue();

    const uniqueId = uuid().replace(/-/g, "").toUpperCase();
    const regulatorysaveButton = {
      query: `mutation {
         upsertDvnCustbankdetails(dvnCustbankdetails: { dvnCustomerBankdetails: [{
           cBankDetailsId:"${cBankDetailsId === null || cBankDetailsId === undefined ? uniqueId : cBankDetailsId}"
           pjMasterId:${pjMasterId === null || pjMasterId === undefined ? null : `"${pjMasterId}"`}
           csBunitId:"0" 
           bankAccNumber:${fieldValues.BankAccountNo === null || fieldValues.BankAccountNo === undefined ? null : `"${fieldValues.BankAccountNo}"`}
           bankname: ${fieldValues.bank_Name === null || fieldValues.bank_Name === undefined ? null : `"${fieldValues.bank_Name}"`}
           ifscCode: ${fieldValues.ifsc_Code === null || fieldValues.ifsc_Code === undefined ? null : `"${fieldValues.ifsc_Code}"`}
           gstNo: ${fieldValues.Gst_No === null || fieldValues.Gst_No === undefined ? null : `"${fieldValues.Gst_No}"`}
           branch: ${fieldValues.bra_nch === null || fieldValues.bra_nch === undefined ? null : `"${fieldValues.bra_nch}"`}
           panNo: ${fieldValues.panNo === null || fieldValues.panNo === undefined ? null : `"${fieldValues.panNo}"`}
           tdsApplicable: ${istdsAPPlication === true ? `"Y"` : `"N"`}
           gstApplicable:${isGSTApplicable === true ? `"Y"` : `"N"`}
           incentivePromptPayment: ${isIncentivePromptPayment === true ? `"Y"` : `"N"`}
           jwellerlevelPromtPayment: ${isJewellerLevelPromptPayment === true ? `"Y"` : `"N"`}
          }
           ]
          }) { 
       status
       message 
       recordsId
       }
       }`,
    };
    Axios({
      url: serverUrl,
      method: "POST",
      data: regulatorysaveButton,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      },
    }).then((response) => {
      const status = response.data.data.upsertDvnCustbankdetails.status;

      if (status === "200") {
        const messageForSuccess = response.data.data.upsertDvnCustbankdetails.message;
        message.success(messageForSuccess);
        setVisibleForRegulatoryEdit(false);
        regulatoryForm.resetFields();
        setCBankDetailsId(null);
        setTimeout(() => {
          gettabKYCToOutletData();
        }, 500);
        setDisplayInputRegulatory("block");
      } else {
        message.error("getting error while creating lines");

        setLoading(false);
      }
    });
  };

  const getTermsConditionsupset = (values) => {
    const newToken = JSON.parse(localStorage.getItem("authTokens"));
    form.validateFields().then((values) => {
      mainForm.submit();
    });
    const pjMasterId = localStorage.getItem("pjMasterId");
    const fieldValues = termsAndConditionForm.getFieldsValue();

    const uniqueId = uuid().replace(/-/g, "").toUpperCase();
    const TermsConditionButton = {
      query: `mutation {
        upsertDvnCustaddress(dvnCustAddress: { dvnCustomerAddress: [{
          dvnCustomerAddressId:"${dvnCustomerAddressId === null || dvnCustomerAddressId === undefined ? uniqueId : dvnCustomerAddressId}" 
          pjMasterId:${pjMasterId === null || pjMasterId === undefined ? null : `"${pjMasterId}"`}
          csBunitId:"0"   
          faxno:null
          description:null
          addresssLine1:null
          addresssLine2:null
          dateOfAgreement:${
            fieldValues.agreement_Date === null || fieldValues.agreement_Date === undefined ? null : `"${moment(fieldValues.agreement_Date).format("YYYY-MM-DD")}"`
          }  
          agreementSign:"${isAgreementSign === true ? "Y" : "N"}"  
          depositCommited:${fieldValues.depositCommited ? `"${fieldValues.depositCommited}"` : null}  
          depositReceivedValue:${fieldValues.DepositReceivedValue ? `"${fieldValues.DepositReceivedValue}"` : null}
          storeWisePromptPayment:${fieldValues.storeWise_PromptPayment ? `${fieldValues.storeWise_PromptPayment}` : null}  
          projectionJwellerWiseTarget:${fieldValues.Projection_JwellerWiseTarget ? `${fieldValues.Projection_JwellerWiseTarget}` : null} 	
          storeWiseTarget:${fieldValues.store_WiseTarget ? `${fieldValues.store_WiseTarget}` : null}   
          margin:${fieldValues.margin ? `${fieldValues.margin}` : null}  
          sor:null
          ownerPic:null
          companyLogo:null
          email:null
          establishementDate:null
          creditPeriod:${fieldValues.creditPeriod_terms === null || fieldValues.creditPeriod_terms === undefined ? null : `"${fieldValues.creditPeriod_terms}"`} 
          weeklyOff:null
          pjCreditLimit: ${fieldValues.CreditLimit_terms ? `${fieldValues.CreditLimit_terms}` : null}
          csaLimit: ${fieldValues.CSALimit_teams ? `${fieldValues.CSALimit_teams}` : null}
          asslimit: ${fieldValues.ASSLimit_teams ? `${fieldValues.ASSLimit_teams}` : null}
          outRightStock: ${fieldValues.Outrightstock_team ? `${fieldValues.Outrightstock_team}` : null}
          paymentTermId:${fieldValues.PaymentTermsterm === null || fieldValues.PaymentTermsterm === undefined ? null : `"${fieldValues.PaymentTermsterm}"`}
          depositWvOff:"${isDepositWaiveoff=== true ? "Y" : "N"}"  
        }
          ]
         }) { 
      status
      message 
      recordsId
      }
      }`,
    };
    Axios({
      url: serverUrl,
      method: "POST",
      data: TermsConditionButton,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      },
    }).then((response) => {
      const status = response.data.data.upsertDvnCustaddress.status;
      if (status === "200") {
        const messageForSuccess = response.data.data.upsertDvnCustaddress.message;

        message.success(messageForSuccess);
        setvisibleForTermsAndConditionEdit(false);
        termsAndConditionForm.resetFields();
        setTimeout(() => {
          gettabKYCToOutletData();
        }, 500);
        setDisplayInputTerms("block");
      } else {
        message.error("getting error while creating lines");

        setLoading(false);
      }
    });
  };

  const getKYCupset = (data) => {
    const newToken = JSON.parse(localStorage.getItem("authTokens"));
    form.validateFields().then((values) => {
      mainForm.submit();
    });
      
    const pjMasterId = localStorage.getItem("pjMasterId");
    const fieldValues = kycForm.getFieldsValue();
   
    const uniqueId = uuid().replace(/-/g, "").toUpperCase(); 
    const uniqueID = uuid().replace(/-/g, "").toUpperCase(); 
    const kycSaveButton = {
      query: `mutation {
          upsertDvnCustomer(dvnCustomers: { dvnCustomer: [{
            dvnCustomerId:"${kycCustomerId === null || kycCustomerId === undefined ? null :`${ kycCustomerId}`}"
            pjMasterId:"${kycpjmsndterId === null || kycpjmsndterId === undefined ? null  :`${ kycpjmsndterId}`}"
           csBunitId:${fieldValues.bUnitNamekyc === null || fieldValues.bUnitNamekyc === undefined ? null : `"${fieldValues.bUnitNamekyc}"`}
            value:"0"
            pjName:${fieldValues.KycpjName === null || fieldValues.KycpjName === undefined ? null : `"${fieldValues.KycpjName}"`}
            gstNumber:"0"
            nickName:${fieldValues.kycNickName === null || fieldValues.kycNickName === undefined ? null : `"${fieldValues.kycNickName}"`}
            websiteAddress:"0"
            ownerName:"0"
            city:"0"
            zone:"0"
            mobileNo:"0"
            outletPic:"0"
            csCountryId:${fieldValues.Country_Kyc === null || fieldValues.Country_Kyc === undefined ? null : `"${fieldValues.Country_Kyc}"`}
            closerDate:null
            dateOfBirth:${fieldValues.kyc_Birth_Date === null || fieldValues.kyc_Birth_Date === undefined ? null : `"${moment(fieldValues.kyc_Birth_Date).format("YYYY-MM-DD")}"`}
            dateOfAnniversary:${
              fieldValues.kyc_Anniversary_Date === null || fieldValues.kyc_Anniversary_Date === undefined
                ? null
                : `"${moment(fieldValues.kyc_Anniversary_Date).format("YYYY-MM-DD")}"`
            }
            sor:"${isInsorInKyc === true ? "Y" : "N"}"
            establishementDate:${
              fieldValues.date_of_Establishement === null || fieldValues.date_of_Establishement === undefined
                ? null
                : `"${moment(fieldValues.date_of_Establishement).format("YYYY-MM-DD")}"`
            }
            kyc:"${isInKYCKYC === true ? "Y" : "N"}"
            compmanyLogo:${fieldValues.kyccompmany_Logo === null || fieldValues.kyccompmany_Logo === undefined ? null : `"${fieldValues.kyccompmany_Logo}"`}
            pincode:${fieldValues.kycpin_code === null || fieldValues.kycpin_code === undefined ? null : `"${fieldValues.kycpin_code}"`}
            pjAddress:${fieldValues.Kycpj_Address === null || fieldValues.Kycpj_Address === undefined ? null : `"${fieldValues.Kycpj_Address}"`}
            pSalesRepStartDate:${
              fieldValues.kycpj_SalesRepStartDate === null || fieldValues.kycpj_SalesRepStartDate === undefined
                ? null
                : `"${moment(fieldValues.kycpj_SalesRepStartDate).format("YYYY-MM-DD")}"`
            }
            pSalesRepEndDate:${
              fieldValues.kycpjSalesRepEndDate === null || fieldValues.kycpjSalesRepEndDate === undefined
                ? null
                : `"${moment(fieldValues.kycpjSalesRepEndDate).format("YYYY-MM-DD")}"`
            }
            ownerPic:${fieldValues.KycOwnerPic === null || fieldValues.KycOwnerPic === undefined ? null : `"${fieldValues.KycOwnerPic}"`}
            pjSalesrep:${fieldValues.kyc_pjsalesRep === null || fieldValues.kyc_pjsalesRep === undefined ? null : `"${fieldValues.kyc_pjsalesRep}"`}
            invoicingName:${fieldValues.InvoicingNamekyc === null || fieldValues.InvoicingNamekyc === undefined ? null : `"${fieldValues.InvoicingNamekyc}"`}
            invoicingAddress:"${isInvoicingAddress === true ? "Y" : "N"}"
            pjGroup:${fieldValues.PJGroupKyc === null || fieldValues.PJGroupKyc === undefined ? null : `"${fieldValues.PJGroupKyc}"`}
            creditLimit: "0"
            csaLimit: "0"
            asslimit: "0"
            totalConsignmentStock: "0"
            outRightStock:"0"
            totalStock: "0"
            pOnboardingDate: ${
              fieldValues.kycOnboarding_Date === null || fieldValues.kycOnboarding_Date === undefined ? null : `"${moment(fieldValues.kycOnboarding_Date).format("YYYY-MM-DD")}"`
            }
            pClosureDate: ${
              fieldValues.Kycpj_ClosureDate === null || fieldValues.Kycpj_ClosureDate === undefined ? null : `"${moment(fieldValues.Kycpj_ClosureDate).format("YYYY-MM-DD")}"`
            }
            websiteAddress: ${fieldValues.Websiteaddresskyc === null || fieldValues.Websiteaddresskyc === undefined ? null : `"${fieldValues.Websiteaddresskyc}"`}
            ownerName: ${fieldValues.kycpjOwnerName === null || fieldValues.kycpjOwnerName === undefined ? null : `"${fieldValues.kycpjOwnerName}"`}
            city: ${fieldValues.kyc_city === null || fieldValues.kyc_city === undefined ? null : `"${fieldValues.kyc_city}"`}
            zone:${fieldValues.kyc_zone === null || fieldValues.kyc_zone === undefined ? null : `"${fieldValues.kyc_zone}"`}
            mobileNo:${fieldValues.kycmobileNo === null || fieldValues.kycmobileNo === undefined ? null : `"${fieldValues.kycmobileNo}"`}
            email: ${fieldValues.kycemail === null || fieldValues.kycemail === undefined ? null : `"${fieldValues.kycemail}"`}
            outletPic: null
            registeredWithDs: ${fieldValues.RegisteredwithDSKyc === null || fieldValues.RegisteredwithDSKyc === undefined ? null : `"${fieldValues.RegisteredwithDSKyc}"`}
            unregisteredWithDs: ${fieldValues.UnregisteredwithDSKyc === null || fieldValues.UnregisteredwithDSKyc === undefined ? null : `"${fieldValues.UnregisteredwithDSKyc}"`}
            type: ${fieldValues.TypeKyc === null || fieldValues.TypeKyc === undefined ? null : `"${fieldValues.TypeKyc}"`}
            csCurrencyId: ${fieldValues.kyccurrency === null || fieldValues.kyccurrency === undefined ? null : `"${fieldValues.kyccurrency}"`}
            csPaymenttermId: ${fieldValues.kycpaymentterms === null || fieldValues.kycpaymentterms === undefined ? null : `"${fieldValues.kycpaymentterms}"`}
            csDoctypeId: ${fieldValues.kycinvoiceFormate === null || fieldValues.kycinvoiceFormate === undefined ? null : `"${fieldValues.kycinvoiceFormate}"`}
            csRegionId: ${fieldValues.kyc_state === null || fieldValues.kyc_state === undefined ? null : `"${fieldValues.kyc_state}"`}
            dvnCustomerCategoryId:${fieldValues.kyccategory === null || fieldValues.kyccategory === undefined ? null : `"${fieldValues.kyccategory}"`}
            pjCode: ${fieldValues.Kycpjcode === null || fieldValues.Kycpjcode === undefined ? null : `"${fieldValues.Kycpjcode}"`}
            solitaireJewellery:${fieldValues.SolitaireJewellerykyc ? `${fieldValues.SolitaireJewellerykyc}` : null} 
            smallDiamondJewellery:${fieldValues.SmallDiamondJewelleryKyc ? `${fieldValues.SmallDiamondJewelleryKyc}` : null} 
            goldJewellery: ${fieldValues.GoldJewelleryKyc ? `${fieldValues.GoldJewelleryKyc}` : null} 
            luxuryLifestyle: ${fieldValues.LuxuryLifestyleitemsKyc ? `${fieldValues.LuxuryLifestyleitemsKyc}` : null} 
            others: ${fieldValues.Others ? `${fieldValues.Others}` : null} 
           }
            ]
           }) {
        status
        message
        recordsId
        }
        }`,
    };
   
    Axios({
      url: serverUrl,
      method: "POST",
      data: kycSaveButton,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      },
    }).then((response) => {
      const status = response.data.data.upsertDvnCustomer.status;

      if (status === "200") {
        const messageForSuccess = response.data.data.upsertDvnCustomer.message;

        message.success(messageForSuccess);
        setVisibleForKYCEdit(false);
        kycForm.resetFields();
        setTimeout(() => {
          gettabKYCToOutletData();
        }, 50);
        setdisplayInput("block");
      } else {
        message.error("getting error while creating lines");

        setLoading(false);
      }
    });
  };
    
  const getKYCupsetNewButton = (data) => {

    const newToken = JSON.parse(localStorage.getItem("authTokens"));
    form.validateFields().then((values) => {
      mainForm.submit();
    });

    const pjMasterId = localStorage.getItem("pjMasterId");
    const fieldValues = kycForm.getFieldsValue();

    // for (let index = 0; index < kycTabHeader.length; index++) {
    //   const element = kycTabHeader[index];
    // }

    // for (let index = 0; index < kycTabHeader.length; index++) {
    //   const element = kycTabHeader[index];

    // }

    const uniqueId = uuid().replace(/-/g, "").toUpperCase(); 
    const uniqueID = uuid().replace(/-/g, "").toUpperCase(); 
    
    const kycSaveButton = {
      query: `mutation {
          upsertDvnCustomer(dvnCustomers: { dvnCustomer: [{
            dvnCustomerId:"${kycCustomerId === null || kycCustomerId === undefined ? uniqueId :`${ kycCustomerId}`}"
            pjMasterId:"${kycpjmsndterId === null || kycpjmsndterId === undefined ? uniqueID  :`${ kycpjmsndterId}`}"
            csBunitId:${fieldValues.bUnitNamekyc === null || fieldValues.bUnitNamekyc === undefined ? null : `"${fieldValues.bUnitNamekyc}"`}
            value:"0"
            pjName:${fieldValues.KycpjName === null || fieldValues.KycpjName === undefined ? null : `"${fieldValues.KycpjName}"`}
            gstNumber:"0"
            nickName:${fieldValues.kycNickName === null || fieldValues.kycNickName === undefined ? null : `"${fieldValues.kycNickName}"`}
            websiteAddress:"0"
            ownerName:"0"
            city:"0"
            zone:"0"
            mobileNo:"0"
            outletPic:"0"
            csCountryId:${fieldValues.Country_Kyc === null || fieldValues.Country_Kyc === undefined ? null : `"${fieldValues.Country_Kyc}"`}
            closerDate:null
            dateOfBirth:${fieldValues.kyc_Birth_Date === null || fieldValues.kyc_Birth_Date === undefined ? null : `"${moment(fieldValues.kyc_Birth_Date).format("YYYY-MM-DD")}"`}
            dateOfAnniversary:${
              fieldValues.kyc_Anniversary_Date === null || fieldValues.kyc_Anniversary_Date === undefined
                ? null
                : `"${moment(fieldValues.kyc_Anniversary_Date).format("YYYY-MM-DD")}"`
            }
            sor:"${isInsorInKyc === true ? "Y" : "N"}"
            establishementDate:${
              fieldValues.date_of_Establishement === null || fieldValues.date_of_Establishement === undefined
                ? null
                : `"${moment(fieldValues.date_of_Establishement).format("YYYY-MM-DD")}"`
            }
            kyc:"${isInKYCKYC === true ? "Y" : "N"}"
            compmanyLogo:${fieldValues.kyccompmany_Logo === null || fieldValues.kyccompmany_Logo === undefined ? null : `"${fieldValues.kyccompmany_Logo}"`}
            pincode:${fieldValues.kycpin_code === null || fieldValues.kycpin_code === undefined ? null : `"${fieldValues.kycpin_code}"`}
            pjAddress:${fieldValues.Kycpj_Address === null || fieldValues.Kycpj_Address === undefined ? null : `"${fieldValues.Kycpj_Address}"`}
            pSalesRepStartDate:${
              fieldValues.kycpj_SalesRepStartDate === null || fieldValues.kycpj_SalesRepStartDate === undefined
                ? null
                : `"${moment(fieldValues.kycpj_SalesRepStartDate).format("YYYY-MM-DD")}"`
            }
            pSalesRepEndDate:${
              fieldValues.kycpjSalesRepEndDate === null || fieldValues.kycpjSalesRepEndDate === undefined
                ? null
                : `"${moment(fieldValues.kycpjSalesRepEndDate).format("YYYY-MM-DD")}"`
            }
            ownerPic:${fieldValues.KycOwnerPic === null || fieldValues.KycOwnerPic === undefined ? null : `"${fieldValues.KycOwnerPic}"`}
            pjSalesrep:${fieldValues.kyc_pjsalesRep === null || fieldValues.kyc_pjsalesRep === undefined ? null : `"${fieldValues.kyc_pjsalesRep}"`}
            invoicingName:${fieldValues.InvoicingNamekyc === null || fieldValues.InvoicingNamekyc === undefined ? null : `"${fieldValues.InvoicingNamekyc}"`}
            invoicingAddress:"${isInvoicingAddress === true ? "Y" : "N"}"
            pjGroup:${fieldValues.PJGroupKyc === null || fieldValues.PJGroupKyc === undefined ? null : `"${fieldValues.PJGroupKyc}"`}
            creditLimit: "0"
            csaLimit: "0"
            asslimit: "0"
            totalConsignmentStock: "0"
            outRightStock:"0"
            totalStock: "0"
            pOnboardingDate: ${
              fieldValues.kycOnboarding_Date === null || fieldValues.kycOnboarding_Date === undefined ? null : `"${moment(fieldValues.kycOnboarding_Date).format("YYYY-MM-DD")}"`
            }
            pClosureDate: ${
              fieldValues.Kycpj_ClosureDate === null || fieldValues.Kycpj_ClosureDate === undefined ? null : `"${moment(fieldValues.Kycpj_ClosureDate).format("YYYY-MM-DD")}"`
            }
            websiteAddress: ${fieldValues.Websiteaddresskyc === null || fieldValues.Websiteaddresskyc === undefined ? null : `"${fieldValues.Websiteaddresskyc}"`}
            ownerName: ${fieldValues.kycpjOwnerName === null || fieldValues.kycpjOwnerName === undefined ? null : `"${fieldValues.kycpjOwnerName}"`}
            city: ${fieldValues.kyc_city === null || fieldValues.kyc_city === undefined ? null : `"${fieldValues.kyc_city}"`}
            zone:${fieldValues.kyc_zone === null || fieldValues.kyc_zone === undefined ? null : `"${fieldValues.kyc_zone}"`}
            mobileNo:${fieldValues.kycmobileNo === null || fieldValues.kycmobileNo === undefined ? null : `"${fieldValues.kycmobileNo}"`}
            email: ${fieldValues.kycemail === null || fieldValues.kycemail === undefined ? null : `"${fieldValues.kycemail}"`}
            outletPic: null
            registeredWithDs: ${fieldValues.RegisteredwithDSKyc === null || fieldValues.RegisteredwithDSKyc === undefined ? null : `"${fieldValues.RegisteredwithDSKyc}"`}
            unregisteredWithDs: ${fieldValues.UnregisteredwithDSKyc === null || fieldValues.UnregisteredwithDSKyc === undefined ? null : `"${fieldValues.UnregisteredwithDSKyc}"`}
            type: ${fieldValues.TypeKyc === null || fieldValues.TypeKyc === undefined ? null : `"${fieldValues.TypeKyc}"`}
            csCurrencyId: ${fieldValues.kyccurrency === null || fieldValues.kyccurrency === undefined ? null : `"${fieldValues.kyccurrency}"`}
            csPaymenttermId: ${fieldValues.kycpaymentterms === null || fieldValues.kycpaymentterms === undefined ? null : `"${fieldValues.kycpaymentterms}"`}
            csDoctypeId: ${fieldValues.kycinvoiceFormate === null || fieldValues.kycinvoiceFormate === undefined ? null : `"${fieldValues.kycinvoiceFormate}"`}
            csRegionId: ${fieldValues.kyc_state === null || fieldValues.kyc_state === undefined ? null : `"${fieldValues.kyc_state}"`}
            dvnCustomerCategoryId:${fieldValues.kyccategory === null || fieldValues.kyccategory === undefined ? null : `"${fieldValues.kyccategory}"`}
            pjCode: ${fieldValues.Kycpjcode === null || fieldValues.Kycpjcode === undefined ? null : `"${fieldValues.Kycpjcode}"`}
            solitaireJewellery:${fieldValues.SolitaireJewellerykyc ? `${fieldValues.SolitaireJewellerykyc}` : null} 
            smallDiamondJewellery:${fieldValues.SmallDiamondJewelleryKyc ? `${fieldValues.SmallDiamondJewelleryKyc}` : null} 
            goldJewellery: ${fieldValues.GoldJewelleryKyc ? `${fieldValues.GoldJewelleryKyc}` : null} 
            luxuryLifestyle: ${fieldValues.LuxuryLifestyleitemsKyc ? `${fieldValues.LuxuryLifestyleitemsKyc}` : null} 
            others: ${fieldValues.Others ? `${fieldValues.Others}` : null} 
           }
            ]
           }) {
        status
        message
        recordsId
        }
        }`,
    };

    Axios({
      url: serverUrl,
      method: "POST",
      data: kycSaveButton,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      },
    }).then((response) => {

      const status = response.data.data.upsertDvnCustomer.status;

      if (status === "200") {
        const messageForSuccess = response.data.data.upsertDvnCustomer.message;

        message.success(messageForSuccess);
        setVisibleNewButtonkYC(false);
        kycForm.resetFields();
        setTimeout(() => {
          gettabKYCToOutletData();
        }, 500);
        
        history.push(`/others/window/7452`)
      } else {
        message.error("getting error while creating lines");
        setVisibleNewButtonkYC(false);
        history.push(`/others/window/7452`)
        setLoading(false);
        
      }
    });
  };

  const deleteKYCTab = async (data) => {
    const deleteKYcResponse = await getDeleteKYCData(data);

    if (deleteKYcResponse.status === "200") {
      message.success(deleteKYcResponse.message);

      gettabKYCToOutletData();
    } else {
      message.error(deleteKYcResponse.message);
    }
  };

  const deleteTeamsConditiondata = async (data) => {
    const responseteamsCondition = await getDeleteTermsConditionsData(data);

    if (responseteamsCondition && responseteamsCondition.status === "200") {
      message.success(responseteamsCondition.message);

      gettabKYCToOutletData();
    } else {
      message.error(responseteamsCondition && responseteamsCondition.message);
    }
  };

  const deleteRegulatoryForm = async (data) => {
    const deletefun = await getDeleteData(data);

    if (deletefun.status === "200") {
      message.success(deletefun.message);

      gettabKYCToOutletData();
    } else {
      message.error(deletefun.message);
    }
  };

  const deletestockmixtab = async (data) => {
    const delectresponse = await getDeleteStockMixData(data);

    if (delectresponse.status === "200") {
      message.success(delectresponse.message);

      gettabKYCToOutletData();
    } else {
      message.error(delectresponse.message);
    }
  };
  const deleteOutlet = async (data) => {
    const deleteOutletResponse = await getDeleteOuttLetData(data);

    if (deleteOutletResponse.status === "200") {
      message.success(deleteOutletResponse.message);
      gettabKYCToOutletData();
    } else {
      message.error(deleteOutletResponse.message);
    }
  };

  const getBusinessUnit = async () => {
    const userData = JSON.parse(window.localStorage.getItem("userData"));
    const businessUnitResponse = await getroleBunit(userData.user_id);

    setBunitData(businessUnitResponse.userBunit);
    setBUnitId(businessUnitResponse.defaultCsBunitId);
  };
  const onSelectBusinessUnit = (e) => {
    setBUnitId(e);
  };

  const getcustomgeneric = async () => {
    const CustomerCategoryResponse = await getCustomerCategoryTypeData();
    setCustomerCategoryData(CustomerCategoryResponse.searchData);
  };
  const OnCustomerCategory = (e, data) => {
    setCustomerCategoryId(e);
  };

  const getCurrencyData = async () => {
    const CurrencyDataResponse = await getCurrencyDropDownData();
    setCurrencyData(CurrencyDataResponse.searchData);
  };

  const onCurrencySelect = (e) => {
    setCurrencyId(e);
  };
  const paymentDropDownData = async () => {
    const paymentDataResponse = await getPaymentTermsDropDownData();
    setPaymentData(paymentDataResponse.searchData);
  };

  const onPaymentSelect = (e) => {
    setPaymentId(e);
  };

  const getStateDropData = async () => {
    const stateDataResponse = await getStateDropDownData();
    setStateData(stateDataResponse.searchData);
  };

  const onSelectState = (e) => {
    setstateId(e);
  };

  const getCountryData = async () => {
    const countryDataResponse = await getCountryDropDownData();
    setCountryData(countryDataResponse.searchData);
  };

  const onSelectCountry = (e) => {
    setCountryId(e);
  };

  const getkycStateData = async () => {
    const stateDataResponse = await getkycStateDropDownData();
    setStateKYCData(stateDataResponse.searchData);
  };

  const onSelectKycState = (e) => {
    setStateKYCId(e);
  };

  const getkycCountryData = async () => {
    const countryKycDataResponse = await getkycCountryDropDownData();
    setCountryKYCData(countryKycDataResponse.searchData);
  };

  const onSelectKycCountry = (e) => {
    setCountryKYCId(e);
  };
  const getSalesRepData = async () => {
    const salesRepDataResponse = await getSalesRepDropDown();

    setSalesRepData(salesRepDataResponse.searchData);
  };

  const onSelectSalesrep = (e) => {
    setsalesRepId(e);
  };

  const getCreditData = async () => {
    const creditDataResponse = await getCreditPeriodDropDown();
    setCreditDataData(creditDataResponse.searchData);
  };

  const onSelectCredit = (e) => {
    setCreditId(e);
  };

  const getStateOutletData = async () => {
    const stateOutletDataResponse = await getStateOutletDropDown();
    setStateOutlet(stateOutletDataResponse.searchData);
  };

  const onSelectStateOutlet = (e) => {
    setStateOutletId(e);
  };

  return (
    <div>
      <Row>
        <Col span={12}>
          <h2>PJ Custom</h2>
        </Col>
        {/* <Col span={12}>
        <span style={{float:'right'}}>
           <Button   style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} >NEW</Button>
       </span>
       </Col> */}

        <Col span={12}>
          <span style={{ float: "right" }}>
            <Button
              type="default"
              onClick={() => {
                history.push(`/others/window/7452`);
              }}
              style={{
                height: "2rem",
                width: "5.4rem",
                backgroundColor: "rgb(8 158 164)",
                border: "0.25px solid rgb(7, 136, 141)",
                borderRadius: "2px",
                fontSize: "14px",
                color: "rgb(255, 255, 255)",
                fontWeight: "500",
                fontFamily: "Open Sans",
                opacity: "1",
              }}
            >
              Back
            </Button>
          </span>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card>
            <Form layout="vertical" form={mainForm} name="mainForm">
              <Tabs tabPosition="left" defaultActiveKey={"All"}>
                {/* {newButton ?<div> */}
                <TabPane tab="All" key="All">
                  <div>
                    <div>
                      <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                        <Card style={{ height: "70vh", overflowY: "scroll", border: "none" }}>
                          <Form layout="vertical" name="control-hooks" form={form}>
                            <Row>
                              <Col span={24}>
                                <span style={{ float: "right" }}>
                                  <Button
                                    type="default"
                                    onClick={() => {
                                      history.push(`/others/window/7452`);
                                    }}
                                    style={{
                                      height: "2rem",
                                      width: "5.4rem",
                                      backgroundColor: "rgb(8 158 164)",
                                      border: "0.25px solid rgb(7, 136, 141)",
                                      borderRadius: "2px",
                                      fontSize: "14px",
                                      color: "rgb(255, 255, 255)",
                                      fontWeight: "500",
                                      fontFamily: "Open Sans",
                                      opacity: "1",
                                    }}
                                  >
                                    Back
                                  </Button>
                                </span>
                              </Col>
                            </Row>
                            {/* <div>
                            <h3>Customer Info</h3>
                            </div>
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item name="bname" label="Business Unit*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].bUnitName : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <span>
                                  <Form.Item label="PJ Code*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                    <span>{headerFormData !== undefined ? headerFormData[0].pjCode : ""}</span>
                                  </Form.Item>
                                </span>
                              </Col>
                              <Col span={6}>
                                <span>
                                  <Form.Item label="PJ Name*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                    <span>{headerFormData !== undefined ? headerFormData[0].pjName : ""}</span>
                                  </Form.Item>
                                </span>
                              </Col>
                              <Col span={6}>
                                <span>
                                  <Form.Item label="Customer Category" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                    <span>{headerFormData !== undefined ? headerFormData[0].customerCategory.name : ""}</span>
                                  </Form.Item>
                                </span>
                              </Col>
                            </Row>
                            <p style={{ marginBottom: "20px" }} />
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item label="GST No" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].gstNo : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="Currency" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].currency.isoCode : ""}</span>
                                </Form.Item>
                              </Col>
                              {/* <Col span={6}>
                                <Form.Item label="Nick Name" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].pjName : ""}</span>
                                </Form.Item>
                              </Col> */}
                            {/* <Col span={6}>
                                <Form.Item label="Invoicing Name" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].currency.isoCode : ""}</span>
                                </Form.Item>
                              </Col> */}
                            {/* </Row>
                            <p style={{ marginBottom: "20px" }} />
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item label="Invoicing(Y/N)" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? (headerFormData[0].isInvoicing) : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <span>
                                  <Form.Item label="Invoicing Address" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                    <span>{headerFormData !== undefined ? headerFormData[0].invoicingAddress : ""}</span>
                                  </Form.Item>
                                </span>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="CSA Limit" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].csaLimit : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="ASS Limit" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].asslimit : ""}</span>
                                </Form.Item>
                              </Col>
                            </Row>
                            <p style={{ marginBottom: "20px" }} />
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item label="ASS Start Date" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? moment(headerFormData[0].assStartDate).format("YYYY-MM-DD") : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="ASS End Date" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? moment(headerFormData[0].assEndDate).format("YYYY-MM-DD") : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="Total Consignment Stock (TCS)" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>
                                    {headerFormData !== undefined ? headerFormData[0].totalConsignmentStock : ""}
                                  </span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="Outright Stock (OS)" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>
                                    {headerFormData !== undefined ? headerFormData[0].outRightStock: ""}
                                  </span>
                                </Form.Item>
                              </Col>
                            </Row>
                            <p style={{ marginBottom: "20px" }} />
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item label="Total  Stock" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>
                                    {headerFormData !== undefined ? headerFormData[0].totalStock : ""}
                                  </span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="Payment Terms" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].paymentTerms.name : ""}</span>
                                </Form.Item>
                              </Col>
                            </Row>
                            <p style={{ marginBottom: "20px" }} />
                            <h4>More Information</h4>
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item label="PJ Type" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].pjtype : null}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="PJ Group" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].pjGroup : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="PJ Closure Date" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? moment(headerFormData[0].pjClosureDate).format("YYYY-MM-DD") : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="PJ Onboarding Date" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? moment(headerFormData[0].pjOnboardingDate).format("YYYY-MM-DD") : ""}</span>
                                </Form.Item>
                              </Col>
                            </Row>
                            <p style={{ marginBottom: "20px" }} />
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item label="City" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].city : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="State" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].region.name : ""}</span>
                                </Form.Item>
                              </Col>
                            </Row>
                            <p style={{ marginBottom: "20px" }} />
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item label="Zone" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].zone : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="Email" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].email : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="Mobile No" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].mobileNo : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="Country" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].country.name : ""}</span>
                                </Form.Item>
                              </Col>
                            </Row>
                            <p style={{ marginBottom: "20px" }} />
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item label="Pincode" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].pincode : ""}</span>
                                </Form.Item>
                              </Col>
                              <Row />
                              <Col span={6}>
                                <Form.Item label="WebSite Address" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].websiteAddress : ""}</span>
                                </Form.Item>
                              </Col>
                            </Row>
                            <p />
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item label="Company Logo" name="companyLogo">
                                  <Image width={100} src={headerFormData !== undefined ? headerFormData[0].companyLogo : ""} />
                                </Form.Item>
                              </Col>

                              <Col span={6}>
                                <Form.Item label="Owner Pic" name="ownerPic">
                                  <Image width={100} src={headerFormData !== undefined ? headerFormData[0].ownerPic : ""} />
                                </Form.Item>
                              </Col>
                            </Row>

                            <p style={{ marginBottom: "20px" }} />
                            <h4>PJ Sales Distribution In(%)</h4>
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item label="Solitaire Jewellery" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].solitaireJewellery : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="Small Diamond Jewellery" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].smallDiamondJewellery : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="Gold Jewellery" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].goldJewellery : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="Luxury & Lifestyle Items" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].luxuryLifestyle : ""}</span>
                                </Form.Item>
                              </Col>
                            </Row>
                            <p style={{ marginBottom: "20px" }} />
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item label="Others" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].others : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="Registered With DS" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].registeredWithDs : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="Un-Registered With DS" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].unregisteredWithDs : ""}</span>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="Invoicing Format" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                  <span>{headerFormData !== undefined ? headerFormData[0].csDocType.name : ""}</span>
                                </Form.Item>
                              </Col>
                            </Row>
                            <p style={{ marginBottom: "20px" }} />

                            <hr /> */}
                            <h3>KYC</h3>

                            {dvnCustomerKyc.map((data) => (
                              <div>
                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Form.Item name="BusinessUnit" label="Business Unit*"  style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.bunitName}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col  span={6}>
                                    <Form.Item name="KYCPjcode" label="PJ Code"  style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.pjCode}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="PJ Name" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.pjName}</span>
                                    </Form.Item>
                                  </Col>

                                  <Col span={6}>
                                  
                                      <Form.Item label="Nick Name" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.nickName}</span>
                                      </Form.Item>
                                    
                                  </Col>
                                </Row>
                                <p style={{ marginBottom: "20px" }} />
                                <Row gutter={16}>
                                  <Col span={6}>
                                  <Form.Item name="KYCpjAddress" label="PJ Address" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                   <span>{data.pjAddress}</span>
                                   </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                  <Form.Item label="City" name="KYCcity"  style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                   <span>{data.city}</span>
                                     </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item name="KYCpincode" label="PinCode" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                    <span>{data.pincode}</span>                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    
                                    <Form.Item label="State" name="stateKYC"style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                     <span>{data.region.name}</span>
                                    </Form.Item>
                                  </Col>
                                </Row>
                               
                                <p style={{ marginBottom: "20px" }} />
                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Form.Item name="KYCZone" label="Zone" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                    <span>{data.zone}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item  name="InvoicingName" label="Invoicing Name" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                    <span>{data.invoicingName}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item  name="InvoicingAddress" label="Invoicing Address" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                   
                                    <Checkbox checked={data.invoicingAddress === "Y" ? true : false}></Checkbox>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item name="InvoiceFormat" label="Invoice Format" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                    <span>{data.docType.name}</span>
                                    </Form.Item>
                                  </Col>
                                </Row> 
                                <p/>
                              {data.invoicingAddress==="Y"?
                                    <>
                                    <Row gutter={16}>
                                  <Col span={6}>
                                  <Form.Item name="KYCpjAddress" label="Invoice Address" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                   <span>{data.pjAddress}</span>
                                   </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                  <Form.Item label="City" name="KYCcity"  style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                   <span>{data.city}</span>
                                     </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item name="KYCpincode" label="PinCode" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                    <span>{data.pincode}</span>                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    
                                    <Form.Item label="State" name="stateKYC"style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                     <span>{data.region.name}</span>
                                    </Form.Item>
                                  </Col>
                                </Row>
                               
                                    </> :""
                                }
                                
                                <p style={{ marginBottom: "20px" }} />
                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Form.Item name="type" label="type" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                    <span>{data.type}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item  name="CustomerCategory" label="Customer Category" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                    <span>{data.category.name}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item name="Pj group" label="PJ Group" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }} >
                                    <span>{data.pjGroup}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                  <Form.Item name="KYCpjOnboardingDate" label="PJ Onboarding Date"  style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }} >
                                  <span>{data.pjOnboardingDate === undefined || data.pjOnboardingDate === null ? null : moment(data.pjOnboardingDate).format("YYYY-MM-DD")}</span>
                                  </Form.Item>
                                  </Col>
                                </Row>
                                <p style={{ marginBottom: "20px" }} />
                                <Row gutter={16}>
                                  <Col span={6}>
                                  <Form.Item name="KYCpjClosureDate" label="PJ Closure Date"    style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                   <span>{moment(data.pjClosureDate).format("YYYY-MM-DD")}</span>
                                </Form.Item>
                                  </Col>

                                  <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCPJSalesRep" label="PJ Sales Rep" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                              <span>{data.salesRep.name}</span>
                            </Form.Item>
                          </Col> 
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCSalesRepStartDate" label="Sales Rep Start Date	" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                              <span>
                                {data.pjSalesRepStartDate === undefined || data.pjSalesRepStartDate === null ? null : moment(data.pjSalesRepStartDate).format("YYYY-MM-DD")}
                              </span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCSalesRepEndDate" label="Sales Rep End Date	" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                              <span>{moment(data.pjSalesRepEndDate).format("YYYY-MM-DD")}</span>
                            </Form.Item>
                          </Col>
                                </Row>
                                <p style={{ marginBottom: "20px" }} />
                            <h3>Owner Details (Field Group)</h3>
                        <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCOwnerName" label="Owner Name" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                              <span>{data.pjName}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="mobileno" label="Mobile No" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                              <span>{data.mobileNo}</span>
                            </Form.Item>
                          </Col>
                            <Col className="gutter-row" span={6}>
                            <Form.Item name="email" label="Email" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                              <span>{data.email}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCbirthDate" label="Birth Date" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                              <span>{data.birthDate === undefined || data.birthDate === null ? null : moment(data.birthDate).format("YYYY-MM-DD")} </span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <p/>
                        <Row gutter={16}>
                          <Col span={6}>
                            <Form.Item name="KYCAnniversaryDate" label="Anniversary Date" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                              <span>{data.anniversaryDate === undefined || data.anniversaryDate === null ? null : moment(data.anniversaryDate).format("YYYY-MM-DD")}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCpjAddress" label="Address" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                              <span>{data.pjAddress}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCOwnerPic" label="Owner Pic" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                              <Image width={100} src={data.ownerPic} />
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item
                              name="kyc_sor"
                              label="SOR"
                              style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}
                            >
                              
                              <Checkbox checked={data.sor === "Y" ? true : false}></Checkbox>
                            </Form.Item>
                          </Col>
                        </Row> 
                        <br/>
                        <Row gutter={16}>
                          
                        
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCdateofEstablishement" label="Date of Establishment" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                              <span>
                                {data.dateofEstablishement === undefined || data.dateofEstablishement === null ? null : moment(data.dateofEstablishement).format("YYYY-MM-DD")}
                              </span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6} style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                            <Form.Item
                              name="kycIn_Kyc"
                             
                              label="KYC"
                              style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}
                            >
                           
                              <Checkbox checked={data.kyc === "Y" ? true : false}></Checkbox>
                            </Form.Item>
                          </Col> 
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCWebsiteaddress" label="Website address"
                             style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}
                            >
                              <span>{data.websiteAddress}</span>
                          
                            </Form.Item>
                          </Col> 
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCcompmany_Logo" label="Company Logo" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                              <Image width={100} src={data.compmanyLogo} />
                            </Form.Item>
                          </Col>

                        </Row>
                        <br /> 
                        <h3>PJ Sales Distribution</h3>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item
                              name="SolitaireJewellery"  label="Solitaire Jewellery" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}
                            >
                              <span>{data.solitaireJewellery}</span>
                          
                            </Form.Item>
                            
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item
                              name="SmallDiamondJewellery"
                              label="Small Diamond Jewellery"
                              style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}
                            >
                              <span>{data.smallDiamondJewellery}</span>
                          
                            </Form.Item>
                            
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item
                              name="GoldJewellery"
                              label="Gold Jewellery"
                              style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}
                            >
                              <span>{data.goldJewellery}</span>
                          
                            </Form.Item>
                            
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item
                              name="Luxury&Lifestyleitems"
                              label="Luxury & Lifestyle items "
                              style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}
                            >
                              <span>{data.luxuryLifestyle}</span>
                          
                            </Form.Item>
                            
                          </Col>
                        </Row>
                        <br/>
                     
                        <Row gutter={16}>
                         
                          <Col className="gutter-row" span={6}>
                            <Form.Item
                              name="kycInOthers"
                              label="Others"
                              style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}
                            >
                              <span>{data.others}</span>
                            </Form.Item>
                          </Col> 
                          
                          
                          </Row> 
                          <br/>
                        <h3>Other showroom details (Mention market name)</h3>
                        <Row gutter={16}>
                         
                          <Col className="gutter-row" span={6}>
                            <Form.Item
                              name="RegisteredwithDS"
                              label="Registered with DS"
                              style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}
                            >
                              <span>{data.registeredWithDs}</span>
                            </Form.Item>
                          </Col> 
                          <Col className="gutter-row" span={6}>
                            <Form.Item
                              name="UnregisteredwithDS"
                              label="Unregistered with DS"
                              style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}
                            >
                              <span>{data.unregisteredWithDs}</span>
                            </Form.Item>
                          </Col> 
                          
                          
                          </Row>
                                <p style={{ marginBottom: "20px" }} />
                                <hr />
                              </div>
                            ))}
                            <h3>Terms & Conditions</h3>
                            {dvnAddress && dvnAddress.map((data) => (
                              <div>
                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Form.Item label="Payment Terms" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.paymenttermName}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="Margin" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.margin}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col className="gutter-row" span={6}>
                                   <Form.Item name="DepositCommited" label="Deposit Commited" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                    <span>{data.depositCommited?data.depositCommited.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                                   </Form.Item>
                                   </Col>
                                  <Col className="gutter-row" span={6}>
                                   <Form.Item name="term_DepositReceivedValue" label="DepositReceivedValue" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                     <span>{data.depositReceivedValue?data.depositReceivedValue.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""} </span>
                                   </Form.Item>
                                  </Col>
                                 
                                </Row>
                                <p style={{ marginBottom: "20px" }} />
                                <Row gutter={16}>
                                  <Col span={6}>
                                
                                    <Form.Item label="Credit Limit" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                    
                                      <span>{data.pjCreditLimit?data.pjCreditLimit.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span> 
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="CreditPeriod" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.paymenttermName}</span>
                                    </Form.Item>
                                  </Col>
                                   <Col className="gutter-row" span={6}>
                                    <Form.Item name="CSALimit" label="CSA Limit" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.csaLimit?data.csaLimit.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                                     </Form.Item>
                                   </Col>
                                   <Col className="gutter-row" span={6}>
                                   <Form.Item name="ASS Limit" label="ASS Limit" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                         <span>{data.asslimit?data.asslimit.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                                   </Form.Item>
                                   </Col>
                                
                                </Row>
                                <p style={{ marginBottom: "20px" }} />
                                <Row gutter={16}>
                                <Col className="gutter-row" span={6}>
                                   <Form.Item name="TotalConsignmentStock" label="Total Consignment Stock" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                    <span>{data.totalConsignmentStock?data.totalConsignmentStock.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                                  </Form.Item>
                                 </Col>
                                 <Col className="gutter-row" span={6}>
                                  <Form.Item name="Outrightstock" label="Outright stock" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                    <span>{data.outRightStock?data.outRightStock.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                                  </Form.Item>
                                  </Col>
                                 <Col className="gutter-row" span={6}>
                                   <Form.Item name="Totalstock" label="Total stock" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                     <span>{data.totalStock?data.totalStock.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="Agreement Date" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>
                                        {/* {headerFormData !== undefined
                                          ? headerFormData[0].dvncustAddress[0] !== undefined && headerFormData[0].dvncustAddress.length > 0
                                            ? moment(headerFormData[0].dvncustAddress[0].agreementDate).format("YYYY-MM-DD")
                                            : ""
                                          : ""}  */}
                                        {moment(data.agreementDate).format("YYYY-MM-DD")}
                                      </span>
                                    </Form.Item>
                                  </Col>
                                  </Row>
                      
                                <p style={{ marginBottom: "20px" }} />
                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Form.Item label="Agreement Sign" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <Checkbox checked={data.agreementSign === "Y" ? true : false} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                                    </Form.Item> 
                                    </Col>
                                     <Col span={6}>
                                    <Form.Item label="Deposit Waive off " style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <Checkbox checked={data.depositWvOff === "Y" ? true : false} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                                    </Form.Item>
                                  </Col>
                                
                                </Row>
                                <p style={{ marginBottom: "20px" }} />
                                <hr />
                              </div>
                            ))}
                            <h3>Regulatory</h3>
                            {dvnbankregulatory && dvnbankregulatory.map((data) => (
                              <div>
                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Form.Item label="Bank Account No*" style={{ color: "#080707", fontWeight: "300", fontSize: "15px" }}>
                                      <span>{data.bankAccNumber}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="Bank Name*" style={{ color: "#080707", fontWeight: "300", fontSize: "15px" }}>
                                      <span>{data.bankname}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="Branch" style={{ color: "#080707", fontWeight: "300", fontSize: "15px" }}>
                                      <span>{data.branch}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="IFSC Code" style={{ color: "#080707", fontWeight: "300", fontSize: "15px" }}>
                                      <span>{data.ifscCode}</span>
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <p style={{ marginBottom: "20px" }} />
                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Form.Item label="GST No" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.gstNo}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="PAN No" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.panNo}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="TDS Applicable" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <Checkbox checked={data.tdsApplicable === "Y" ? true : false}></Checkbox>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="GST Applicable" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <Checkbox checked={data.gstApplicable === "Y" ? true : false}></Checkbox>
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <p style={{ marginBottom: "20px" }} />
                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Form.Item label="Incentive Prompt Payment" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <Checkbox checked={data.incentivePromptPayment === "Y" ? true : false}></Checkbox>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="Jeweller Level Prompt Payment" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <Checkbox checked={data.jwellerlevelPromtPayment === "Y" ? true : false}></Checkbox>
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <p style={{ marginBottom: "20px" }} />
                                <hr />
                              </div>
                            ))}

                            <h3>Stock Mix</h3>
                            {dvnclass && dvnclass.map((data) => (
                              <div>
                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Form.Item label="Small%*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.small}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="Medium %*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.medium}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="Large %*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.large}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="Ex.Large %*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.exLarge}</span>
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <p style={{ marginBottom: "20px" }} /> 
                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Form.Item label="DEF VVS %*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.defVvs}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="DEF VS%*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.defVs}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="DEF SI%*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.defSi}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="GH VVS%*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.ghVvs}</span>
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <p style={{ marginBottom: "20px" }} />

                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Form.Item label="GH VS%*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.ghVs}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="GH SI%*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.ghSi}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="IJK VVS%*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.ijkVvs}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="IJK VS%*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.ijkVs}</span>
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <p style={{ marginBottom: "20px" }} />
                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Form.Item label="IJK SI%*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.ijksi}</span>
                                    </Form.Item>
                                  </Col> 
                                </Row>
                                <p style={{ marginBottom: "20px" }} />
                                <Row gutter={16}>
                                  <Col span={6}>
                                    <Form.Item label="DSD %*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.dsd}</span>
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item label="DSJ %*" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.dsj}</span>
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <p style={{ marginBottom: "20px" }} />
                                <hr />
                              </div>
                            ))}
                            <h3>OutLet</h3>
                            {outletValue &&
                              outletValue.map((data,index) => (
                                <div> 
                              
                               <h3>Outlet <span>{index}</span></h3>
                                  <Row gutter={16}>
                                    <Col span={6}>
                                      <Form.Item label="Outlet Name" style={{ color: "#080707", fontWeight: "300", fontSize: "15px" }}>
                                        <span>{data.outletName}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Nick  Name" style={{ color: "#080707", fontWeight: "300", fontSize: "15px" }}>
                                        <span>{data.nickName}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="outletaddress" style={{ color: "#080707", fontWeight: "300", fontSize: "15px" }}>
                                        <span>{data.addressLine1}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="City" style={{ color: "#080707", fontWeight: "300", fontSize: "15px" }}>
                                        <span>{data.outletCity}</span>
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                  <p style={{ marginBottom: "20px" }} />
                                  <Row gutter={16}>
                                    <Col span={6}>
                                      <Form.Item label="Pin" style={{ color: "#080707", fontWeight: "300", fontSize: "15px" }}>
                                        <span>{data.pinCode}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="State" style={{ color: "#080707", fontWeight: "300", fontSize: "15px" }}>
                                        <span>{data.stateName}</span>
                                      </Form.Item>
                                    </Col>
                                    <p />
                                    <Col span={6}>
                                      <Form.Item label="Zone" style={{ color: "#080707", fontWeight: "300", fontSize: "15px" }}>
                                        <span>{data.zone}</span>
                                      </Form.Item>
                                    </Col>

                                    <Col span={6}>
                                      <Form.Item label="Tier" style={{ color: "#080707", fontWeight: "300", fontSize: "15px" }}>
                                        <span>{data.tier}</span>
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                  <p style={{ marginBottom: "20px" }} />
                                  <Row gutter={16}>
                                    <Col span={6}>
                                      <Form.Item label="Phone No" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.mobileNo}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Area" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.area}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Email" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.email}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Market Name" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.marketName}</span>
                                    </Form.Item>
                                    </Col>
                                  </Row>
                                  <p style={{ marginBottom: "20px" }} />
                                  <Row gutter={16}>
                                    <Col span={6}>
                                      <Form.Item label="Store Contact Person Name" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.storeContactPersonName}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Store Contact Person No" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.storeContactPersonNo}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Weekly Off" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.weeklyOff}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="GST No" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.gstNo}</span>
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                  <p style={{ marginBottom: "20px" }} />
                                  <Row gutter={16}>
                                    <Col span={6}>
                                      <Form.Item label="Outlet Onboarding Date" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>
                                          {data.outletOnboardingDate === null || data.outletOnboardingDate === undefined
                                            ? null
                                            : moment(data.outletOnboardingDate).format("YYYY-MM-DD")}
                                        </span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Outlet Closure Date" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>
                                          {data.outletClosureDate === null || data.outletClosureDate === undefined ? null : moment(data.outletClosureDate).format("YYYY-MM-DD")}
                                        </span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Outlet Sales Rep" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.pjSalesRepresentativeName}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Sales  Rep  Start Date" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>
                                          {data.salesRepStartDate === null || data.salesRepStartDate === undefined ? null : moment(data.salesRepStartDate).format("YYYY-MM-DD")}
                                        </span>
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                  <p style={{ marginBottom: "20px" }} />
                                  <Row gutter={16}>
                                    <Col span={6}>
                                      <Form.Item label="Sales Rep End Date" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>
                                          {data.salesRepStartDate === null || data.salesRepStartDate === undefined ? null : moment(data.pjSalesRepEndDate).format("YYYY-MM-DD")}
                                        </span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Price List Handover Contact Person Name" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.stockConfirmationContactName}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Price List Hand Over Contact No" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.pHandoverContactPersonNo}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="stock Confirmation  Contact Person Name" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.pricelistHandoverContactPersonName}</span>
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                  <p style={{ marginBottom: "20px" }} />
                                  <Row gutter={16}>
                                    <Col span={6}>
                                      <Form.Item label="Stock Confirmation Contact Person No" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.stockConfirmationContactNo}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="KYC">
                                        <Checkbox checked={data.kyc === "Y" ? true : false}></Checkbox>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Authorised Outlet" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <Checkbox checked={data.authorizedoutlet === "Y" ? true : false}></Checkbox>
                                      </Form.Item>
                                    </Col> 
                                    <Col span={6}>
                                      <Form.Item label="promotion Allowed" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <Checkbox checked={data.promotionAllowed === "Y" ? true : false}></Checkbox>
                                      </Form.Item>
                                    </Col> 
                                 
                                  </Row>
                                  <p style={{ marginBottom: "20px" }} />
                                  <Row gutter={16}>
                                
                                    <Col span={6}>
                                      <Form.Item label="Outlet Longitude" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.outletLongitude}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Outlet Latitude" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.outletLatitude}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Outlet Pic">
                                        <Image width={100} src={data.outletPic} />
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Display Done">
                                        <Checkbox checked={data.displayDone === "Y" ? true : false}></Checkbox>
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                  <p style={{ marginBottom: "20px" }} />
                                  <Row gutter={16}>
                                    <Col span={6}>
                                      <Form.Item label="Trial Period  From  Date" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{moment(data.trialFromPeriod).format("YYYY-MM-DD")}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Trial Period To Date" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{moment(data.trialToPeriod).format("YYYY-MM-DD")}</span>
                                      </Form.Item>
                                    </Col>

                                    <Col span={6}>
                                      <Form.Item label="Total Stock" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.totalStock?data.totalStock.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label="Projection Jweller Wise Target" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.projectionJwellerWiseTarget?data.projectionJwellerWiseTarget.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                  <p style={{ marginBottom: "20px" }} />
                                  <Row gutter={16}>
                                    <Col span={6}>
                                      <Form.Item label="Store Wise Target" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <span>{data.storeWiseTarget?data.storeWiseTarget.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                                      </Form.Item>
                                    </Col>
                                  </Row>

                                  <p />
                                  <h3>Joining Fees </h3>
                                <Row gutter={16}>
                                  <Col className="gutter-row" span={6}>
                                    <Form.Item name="Date" label="Date" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.joiningFeeDate}</span>
                                    </Form.Item>
                                   </Col>
                                  <Col className="gutter-row" span={6}>
                                    <Form.Item label="Amount " name="Amount" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.joiningFeeAmount?data.joiningFeeAmount.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                                    </Form.Item>
                                  </Col> 
                                  <Col className="gutter-row" span={6}>
                                    <Form.Item label="Comments" name="Comments" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                      <span>{data.comment}</span>
                                    </Form.Item>
                                  </Col> 
                                  <Col span={6}>
                                      <Form.Item label="Joining fee waive off" style={{ color: "#080707", fontWeight: "300", fontSize: "13px" }}>
                                        <Checkbox checked={data.joiningWvOff  === "Y" ? true : false}></Checkbox>
                                      </Form.Item>
                                    </Col> 
                                
                                </Row> 
                        <p/>
                                  <hr />
                                </div>
                              ))}
                          </Form>
                        </Card>
                      </Spin>
                    </div>
                  </div>
                </TabPane>
                {/*             
                <TabPane tab="Customer Info" key="CustomerInfo">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                    <div style={{ padding: "8px" }}>
                      <h3>Customer Info</h3>
                      <Row>
                        <Col span={24} style={{ textAlign: "right", marginTop: "0.5%", marginBottom: "0.5%" }}>
                          {/* <Button
                            size="small"
                            style={{
                              color: "white",
                              background: "#3E7A86",
                              fontSize: "12px",
                              float: "right",
                              marginBottom: "7.5px",
                            }}
                            onClick={() => {
                              openaddAddressModalCustomerInfo();
                            }}
                          >
                            ADD +
                          </Button> 
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24} style={{ textAlign: "right", marginTop: "0.5%", marginBottom: "0.5%" }}>
                          <span style={{ float: "right" }}>
                          
                            &nbsp;
                            <Button
                             
                              onClick={editFieldsInCustomeTab}
                              style={{ height: "30px", marginRight: "8px" }}
                            >
                              <EditOutlined style={{ fontWeight: "600" }} />
                            </Button>
                          </span>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="bUnitname" label="Business Unit*" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder && customerInfoHeder !== undefined ? customerInfoHeder[0].bUnitName : ""}</span>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="pj_code" label="PJ Code*" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].pjCode : ""}</span>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="pj_Name" label="PJ Name*" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].pjName : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customer_category" label="Customer Category" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].customerCategory.name : ""}</span>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="gst_no" label="GST No" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].gstNo : ""}</span>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="curr_ency" label="Currency" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].currency.isoCode : ""}</span>
                          </Form.Item>
                        </Col>

                        {/* <Col className="gutter-row" span={6}>
                          <Form.Item name="nick_name" label="Nick Name" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].currency.pjName : ""}</span>
                          </Form.Item>
                        </Col> */}
                {/* <Col className="gutter-row" span={6}>
                          <Form.Item name="invoicing_name" label="Invoicing Name" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].currency.isoCode : ""}</span>
                          </Form.Item>
                        </Col> */}
                {/* </Row>
                      <p style={{ marginBottom: "10px" }} />

                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                     <Form.Item name="Invoicingcustom" label="Invoicing (Y/N)" style={{ marginBottom: "8px" }}>

                        <span> {(customerInfoHeder!== undefined ? (customerInfoHeder[0].isInvoicing) : "")}</span>
                     </Form.Item>                                                                                                               
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="invoicing_address" label="Invoicing Address" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].invoicingAddress : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="CSA_limit" label="CSA Limit" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].csaLimit : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="ASS_Limit" label="ASS Limit" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].asslimit : ""}</span>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="ASSStart_Date" label="ASS Start Date" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? moment(customerInfoHeder[0].assStartDate).format("YYYY-MM-DD") : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="ASSEnd_Date" label="ASS End Date" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? moment(customerInfoHeder[0].assEndDate).format("YYYY-MM-DD") : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="totalconsignment_Stock" label="Total Consignment Stock (TCS)" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].totalConsignmentStock : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outright_stock" label="Outright Stock (OS)" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].outRightStock : ""}</span>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Total_Stock" label="Total  Stock" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].totalStock : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="paymen_tterms" label="Payment Terms" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].paymentTerms.name : ""}</span>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <h3>More Information</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customer_Infopjtype" label="PJ Type" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].pjtype : ""}</span>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customer_infopjgroup" label="PJ Group" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].pjGroup : ""}</span>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoPJClosureDate" label="PJ Closure Date" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? moment(customerInfoHeder[0].pjClosureDate).format("YYYY-MM-DD") : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoPJOnboardingDate" label="PJ Onboarding Date" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? moment(customerInfoHeder[0].pjOnboardingDate).format("YYYY-MM-DD") : ""}</span>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInf_oownername" label="Owner Name" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].pjName : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customer_infocity" label="City" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].city : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfo_state" label="State" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].region.name : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfo_zone" label="Zone" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].zone : ""}</span>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfo_Email" label="Email" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].email : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerinfo_mobileno" label="Mobile No" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].mobileNo : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfo_Country" label="Country" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].country.name : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="invoice_Formate" label="invoice Formate" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].csDocType.name : ""}</span>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfo_pincode" label="Pincode" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].pincode : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerinfoWebSit_eaddress" label="WebSite Address" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].websiteAddress : ""}</span>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfo_CompanyLogo" label="Company Logo" style={{ marginBottom: "8px" }}>
                            <Image width={100} src={customerInfoHeder !== undefined ? customerInfoHeder[0].companyLogo : ""} />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customer_InfoCountry" label="Owner Pic" style={{ marginBottom: "8px" }}>
                            <Image width={100} src={customerInfoHeder !== undefined ? customerInfoHeder[0].ownerPic : ""} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <h3>PJ Sales Distribution In(%)</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfosolitaire_jewellery" label="Solitaire Jewellery" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].solitaireJewellery : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerinfosmalldiamond_jewellery" label="Small Diamond Jewellery" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].smallDiamondJewellery : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfo_GoldJewellery" label="Gold Jewellery" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].goldJewellery : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoluxury_lifestyleitems" label="Luxury & Lifestyle Items" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].luxuryLifestyle : ""}</span>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfo_Others" label="Others" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].others : ""}</span>
                          </Form.Item>
                        </Col>
                      </Row>
                      <h3>Other Showroom Details (Mention Market Name)</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfo_RegisteredWithDS" label="Registered With DS" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].registeredWithDs : ""}</span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfo_UnRegisteredWithDS" label="Un-Registered With DS" style={{ marginBottom: "8px" }}>
                            <span>{customerInfoHeder !== undefined ? customerInfoHeder[0].unregisteredWithDs : ""}</span>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </Spin>
                </TabPane>
                 */}
                <TabPane tab="KYC" key="KYC">
                  <h3>KYC</h3>
                  <div style={{ padding: "8px" }}>
                    <Row>
                      <Col span={24} style={{ textAlign: "right", marginTop: "0.5%", marginBottom: "0.5%" }}>
                        {/* <Button
                        style={{
                          color: "white",
                          background: "#3E7A86",
                          fontSize: "12px",
                          float: "right",
                          marginBottom: "7.5px",
                        }}
                        onClick={() => {
                          openaddAddressModalkyc();
                        }}
                      >
                        ADD +
                      </Button> */}
                      </Col>
                    </Row>
                  </div>
                  {kycTabHeader.map((data) => (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                      <div style={{ padding: "8px" }}>
                        <Row>
                          <Col span={24} style={{ textAlign: "right", marginTop: "0.5%", marginBottom: "0.5%" }}>
                            <span style={{ float: "right" }}>
                              <Button onClick={() => editFieldsInFrom(data)} style={{ height: "30px", marginRight: "8px" }}>
                                <EditOutlined style={{ fontWeight: "600" }} />
                              </Button>
                              &nbsp;
                              <Button
                                style={{ height: "30px", marginRight: "8px" }}
                                onClick={() => {
                                  deleteKYCTab(data.dvnCustomerId);
                                }}
                              >
                                <i style={{ fontWeight: "600" }} className="lnr lnr-trash" />
                              </Button>
                            </span>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="BusinessUnit" label="Business Unit*">
                              <span>{data.bunitName}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCPjcode" label="PJ Code">
                              <span>{data.pjCode}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCPjName" label="PJ Name">
                              <span>{data.pjName}</span>
                            </Form.Item>
                          </Col>

                          <Col className="gutter-row" span={6}>
                            <span>
                              <Form.Item name="KYCnickName" label="Nick Name">
                                <span>{data.nickName}</span>
                              </Form.Item>
                            </span>
                          </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCpjAddress" label="PJ Address">
                              <span>{data.pjAddress}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="City" name="KYCcity">
                              <span>{data.city}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCpincode" label="PinCode" style={{ marginBottom: "8px" }}>
                              <span>{data.pincode}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="State" name="stateKYC">
                              <span>{data.region.name}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCZone" label="Zone" style={{ marginBottom: "8px" }}>
                              <span>{data.zone}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="InvoicingName" label="Invoicing Name" style={{ marginBottom: "8px" }}>
                              <span>{data.invoicingName}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="InvoicingAddress" label="Invoicing Address" style={{ marginBottom: "8px" }}>
                              <span>{data.invoicingAddress}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="InvoiceFormat" label="Invoice Format" style={{ marginBottom: "8px" }}>
                              <span>{data.docType.name}</span>
                            </Form.Item>
                          </Col>
                        </Row> 
                        {data.invoicingAddress==="Y"?
                        <>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCpjAddress" label="Invoice Address">
                              <span>{data.pjAddress}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="City" name="KYCcity">
                              <span>{data.city}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCpincode" label="PinCode" style={{ marginBottom: "8px" }}>
                              <span>{data.pincode}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="State" name="stateKYC">
                              <span>{data.region.name}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        </> :""
                        }
                        <p />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="type" label="Type" style={{ marginBottom: "8px" }}>
                              <span>{data.type}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="CustomerCategory" label="Customer Category" style={{ marginBottom: "8px" }}>
                              <span>{data.category.name}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="Pj group" label="PJ Group" style={{ marginBottom: "8px" }}>
                              <span>{data.pjGroup}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCpjOnboardingDate" label="PJ Onboarding Date">
                              <span>{data.pjOnboardingDate === undefined || data.pjOnboardingDate === null ? null : moment(data.pjOnboardingDate).format("YYYY-MM-DD")}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCpjClosureDate" label="PJ Closure Date" style={{ marginBottom: "8px" }}>
                              <span>{moment(data.pjClosureDate).format("YYYY-MM-DD")}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCPJSalesRep" label="PJ Sales Rep" style={{ marginBottom: "8px" }}>
                              <span>{data.salesRep.name}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCSalesRepStartDate" label="Sales Rep Start Date	" style={{ marginBottom: "8px" }}>
                              <span>
                                {data.pjSalesRepStartDate === undefined || data.pjSalesRepStartDate === null ? null : moment(data.pjSalesRepStartDate).format("YYYY-MM-DD")}
                              </span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCSalesRepEndDate" label="Sales Rep End Date	" style={{ marginBottom: "8px" }}>
                              <span>{moment(data.pjSalesRepEndDate).format("YYYY-MM-DD")}</span>
                            </Form.Item>
                          </Col>
                        </Row>

                        <br />
                        <h3>Owner Details (Field Group)</h3>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCOwnerName" label="Owner Name" style={{ marginBottom: "8px" }}>
                              <span>{data.pjName}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="mobileno" label="Mobile No" style={{ marginBottom: "8px" }}>
                              <span>{data.mobileNo}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="email" label="Email" style={{ marginBottom: "8px" }}>
                              <span>{data.email}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCbirthDate" label="Birth Date" style={{ marginBottom: "8px" }}>
                              <span>{data.birthDate === undefined || data.birthDate === null ? null : moment(data.birthDate).format("YYYY-MM-DD")} </span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCAnniversaryDate" label="Anniversary Date" style={{ marginBottom: "8px" }}>
                              <span>{data.anniversaryDate === undefined || data.anniversaryDate === null ? null : moment(data.anniversaryDate).format("YYYY-MM-DD")}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCpjAddress" label="Address" style={{ marginBottom: "8px" }}>
                              <span>{data.pjAddress}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCOwnerPic" label="Owner Pic">
                              <Image width={100} src={data.ownerPic} />
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="kyc_sor" label="SOR" style={{ marginBottom: "8px" }}>
                              <span>{data.sor}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCdateofEstablishement" label="Date of Establishment" style={{ marginBottom: "8px" }}>
                              <span>
                                {data.dateofEstablishement === undefined || data.dateofEstablishement === null ? null : moment(data.dateofEstablishement).format("YYYY-MM-DD")}
                              </span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="kycIn_Kyc" label="KYC" style={{ marginBottom: "8px" }}>
                              <span>{data.kyc}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCWebsiteaddress" label="Website address" style={{ marginBottom: "8px" }}>
                              <span>{data.websiteAddress}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="KYCcompmany_Logo" label="Company Logo" style={{ marginBottom: "8px" }}>
                              <Image width={100} src={data.compmanyLogo} />
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        <h3>PJ Sales Distribution</h3>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="SolitaireJewellery" label="Solitaire Jewellery" style={{ marginBottom: "8px" }}>
                              <span>{data.solitaireJewellery}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="SmallDiamondJewellery" label="Small Diamond Jewellery" style={{ marginBottom: "8px" }}>
                              <span>{data.smallDiamondJewellery}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="GoldJewellery" label="Gold Jewellery" style={{ marginBottom: "8px" }}>
                              <span>{data.goldJewellery}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="Luxury&Lifestyleitems" label="Luxury & Lifestyle items " style={{ marginBottom: "8px" }}>
                              <span>{data.luxuryLifestyle}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="kycInOthers" label="Others" style={{ marginBottom: "8px" }}>
                              <span>{data.others}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <h3>Other showroom details (Mention market name)</h3>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="RegisteredwithDS" label="Registered with DS" style={{ marginBottom: "8px" }}>
                              <span>{data.registeredWithDs}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="UnregisteredwithDS" label="Unregistered with DS" style={{ marginBottom: "8px" }}>
                              <span>{data.unregisteredWithDs}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        {kycTabHeader.length > 1 ? <hr /> : null}
                      </div>
                    </Spin>
                  ))}
                </TabPane>
                <TabPane tab="Terms & Conditions" key="Terms & Conditions">
                  <h3>Terms & Conditions</h3>
                  <div style={{ padding: "8px" }}>
                    <Row>
                      <Col span={24} style={{ textAlign: "right", marginTop: "0.5%", marginBottom: "0.5%" }}>
                        <Button
                          size="small"
                          style={{
                            color: "white",
                            background: "#3E7A86",
                            fontSize: "12px",
                            float: "right",
                            marginBottom: "7.5px",
                          }}
                          onClick={() => {
                            openaddAddressModalTeamsAndCondition();
                          }}
                        >
                          ADD +
                        </Button>
                      </Col>
                    </Row>
                  </div>

                  {termsAndConditiontab &&
                    termsAndConditiontab.map((data) => (
                      <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                        <div style={{ padding: "8px" }}>
                          <Row>
                            <Col span={24} style={{ textAlign: "right", marginTop: "0.5%", marginBottom: "0.5%" }}>
                              <span style={{ float: "right" }}>
                                <Button onClick={() => editFieldsInFromTerms(data)} style={{ height: "30px", marginRight: "8px" }}>
                                  <EditOutlined style={{ fontWeight: "600" }} />
                                </Button>
                                &nbsp;
                                <Button
                                  style={{ height: "30px", marginRight: "8px" }}
                                  onClick={() => {
                                    deleteTeamsConditiondata(data.dvnCustomerAddressId);
                                  }}
                                >
                                  <i style={{ fontWeight: "600" }} className="lnr lnr-trash" />
                                </Button>
                              </span>
                            </Col>
                          </Row>

                          <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="PaymentTerms" label="Payment Terms" style={{ marginBottom: "8px" }}>
                                <span>{data.paymentTermName}</span>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="Margin" label="Margin" style={{ marginBottom: "8px" }}>
                                <span>{data.margin}</span>
                              </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                              <Form.Item name="DepositCommited" label="Deposit Commited" style={{ marginBottom: "8px" }}>
                                <span>{data.depositCommited?data.depositCommited.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""} </span>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="term_DepositReceivedValue" label="DepositReceivedValue" style={{ marginBottom: "8px" }}>
                                <span>{data.depositReceivedValue?data.depositReceivedValue.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""} </span>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="CreditLimit" label="CreditLimit" style={{ marginBottom: "8px" }}>
                                <span>{data.pjCreditLimit?data.pjCreditLimit.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                              </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                              <Form.Item name="CreditPeriod" label="Credit Period" style={{ marginBottom: "8px" }}>
                                <span>{data.paymentTerms.paymenttermName}</span>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="CSALimit" label="CSA Limit" style={{ marginBottom: "8px" }}>
                                <span>{data.csaLimit?data.csaLimit.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="ASS Limit" label="ASS Limit" style={{ marginBottom: "8px" }}>
                                <span>{data.asslimit?data.asslimit.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                              </Form.Item>
                            </Col>
                          </Row>
                          <br />
                          <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="TotalConsignmentStock" label="Total Consignment Stock" style={{ marginBottom: "8px" }}>
                                <span>{data.totalConsignmentStock?data.totalConsignmentStock.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="Outrightstock" label="Outright stock" style={{ marginBottom: "8px" }}>
                                <span>{data.outRightStock?data.outRightStock.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="Totalstock" label="Total stock" style={{ marginBottom: "8px" }}>
                                <span>{data.totalStock?data.totalStock.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                              </Form.Item>
                            </Col>
                          </Row>
                          <br />
                          <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="ProjectionJwellerWiseTarget" label="Projection Jeweller Wise Target" style={{ marginBottom: "8px" }}>
                                <span>{data.projectionJwellerWiseTarget?data.projectionJwellerWiseTarget.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="storeWiseTarget" label="Store wise target" style={{ marginBottom: "8px" }}>
                                <span>{data.storeWiseTarget?data.storeWiseTarget.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                              </Form.Item>                                                                                                                                                                                                                                                                                                            
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item label="Store Wise Prompt Payment	" style={{ marginBottom: "8px" }}>
                                <span>{data.storeWisePromptPayment?data.storeWisePromptPayment.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                              </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                              <Form.Item name="agreementDate" label="Agreement Date" style={{ marginBottom: "8px" }}>
                                <span>{moment(data.agreementDate).format("YYYY-MM-DD")}</span>
                              </Form.Item>
                            </Col>
                          </Row>
                          <br />
                          <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="Agreement_Sign" valuePropName="checked" label="Agreement Sign" style={{ marginBottom: "8px" }}>
                                <span>{data.agreementSign}</span>
                              </Form.Item>
                            </Col> 
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="Deposit_Waive_off" valuePropName="checked" label="Deposit Waive off" style={{ marginBottom: "8px" }}>
                                <span>{data.depositWvOff}</span>
                              </Form.Item>
                            </Col>
                          </Row>
                          <br />
                          {termsAndConditiontab.length > 1 ? <hr /> : null}
                        </div>
                      </Spin>
                    ))}
                </TabPane>
                <TabPane tab="Regulatory" key="Regulatory">
                  <h3>Regulatory</h3>
                  <div style={{ padding: "8px" }}>
                    <Row>
                      <Col span={24} style={{ textAlign: "right", marginTop: "0.5%", marginBottom: "0.5%" }}>
                        <Button
                          size="small"
                          style={{
                            color: "white",
                            background: "#3E7A86",
                            fontSize: "12px",
                            float: "right",
                            marginBottom: "7.5px",
                          }}
                          onClick={() => {
                            openaddAddressModalRegulatory();
                          }}
                        >
                          ADD +
                        </Button>
                      </Col>
                    </Row>
                  </div>
                  {RegulatoryTabHeader.map((data) => (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                      <div style={{ padding: "8px" }}>
                        <Row>
                          <Col span={24} style={{ textAlign: "right", marginTop: "0.5%", marginBottom: "0.5%" }}>
                            <span style={{ float: "right" }}>
                              <Button onClick={() => editFieldsInFromRegulatory(data)} style={{ height: "30px", marginRight: "8px" }}>
                                <EditOutlined style={{ fontWeight: "600" }} />
                              </Button>
                              &nbsp;
                              <Button
                                style={{ height: "30px", marginRight: "8px" }}
                                onClick={() => {
                                  deleteRegulatoryForm(data.cBankDetailsId);
                                }}
                              >
                                <i style={{ fontWeight: "600" }} className="lnr lnr-trash" />
                              </Button>
                            </span>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="Bank Account No*" name="bankAccNumber" style={{ marginBottom: "8px" }}>
                              <span>{data.bankAccNumber}</span>
                            </Form.Item>
                          </Col>

                          <Col className="gutter-row" span={6}>
                            <Form.Item label="Bank Name*" name="bankName" style={{ marginBottom: "8px" }}>
                              <span>{data.bankname}</span>
                            </Form.Item>
                          </Col>

                          <Col className="gutter-row" span={6}>
                            <Form.Item label="Branch" name="branch" style={{ marginBottom: "8px" }}>
                              <span>{data.branch}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="IFSC Code" name="ifscCode" style={{ marginBottom: "8px" }}>
                              <span>{data.ifscCode}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="GST No" name="gstNo" style={{ marginBottom: "8px" }}>
                              <span>{data.gstNo}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="PAN No" name="pan_No" style={{ marginBottom: "8px" }}>
                              <span>{data.panNo}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="tdsApplicable" label="TDS Applicable" style={{ marginBottom: "8px" }}>
                              <span>{data.tdsApplicable}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item valuePropName="checked" name="gstApplicable" label="GST Applicable" style={{ marginBottom: "8px" }}>
                              <span>{data.gstApplicable}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item valuePropName="checked" name="incentivePromptPayment" label="Incentive Prompt Payment	" style={{ marginBottom: "8px" }}>
                              <span>{data.incentivePromptPayment}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item valuePropName="checked" name="jwellerlevelPromtPayment" label="Jeweller Level Prompt Payment" style={{ marginBottom: "8px" }}>
                              <span>{data.jwellerlevelPromtPayment}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        {RegulatoryTabHeader.length > 1 ? <hr /> : null}
                      </div>
                    </Spin>
                  ))}
                </TabPane>
                <TabPane tab="Stock  Mix" key="Stock  Mix">
                  <h3>Stock Mix</h3>
                  <div style={{ padding: "8px" }}>
                    <Row>
                      <Col span={24} style={{ textAlign: "right", marginTop: "0.5%", marginBottom: "0.5%" }}>
                        <Button
                          size="small"
                          style={{
                            color: "white",
                            background: "#3E7A86",
                            fontSize: "12px",
                            float: "right",
                            marginBottom: "7.5px",
                          }}
                          onClick={() => {
                            openaddAddressModal();
                          }}
                        >
                          ADD +
                        </Button>
                      </Col>
                    </Row>
                  </div>
                  {stockMixHeader.map((data) => (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                      <div style={{ padding: "8px" }}>
                        <Row>
                          <Col span={24} style={{ textAlign: "right", marginTop: "0.5%", marginBottom: "0.5%" }}>
                            <span style={{ float: "right" }}>
                              <Button onClick={() => editFieldsInFromStockMix(data)} style={{ height: "30px", marginRight: "8px" }}>
                                <EditOutlined style={{ fontWeight: "600" }} />
                              </Button>
                              &nbsp;
                              <Button
                                style={{ height: "30px", marginRight: "8px" }}
                                onClick={() => {
                                  deletestockmixtab(data.dOtherClassificationId);
                                }}
                              >
                                <i style={{ fontWeight: "600" }} className="lnr lnr-trash" />
                              </Button>
                            </span>
                           
                          </Col>
                        </Row>

                        <div>
                          <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="StockMixSmall" label="Small %*" style={{ marginBottom: "8px" }}>
                                <span>{data.small}</span>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="StockMixMedium" label="Medium %*" style={{ marginBottom: "8px" }}>
                                <span>{data.medium}</span>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="StockmixLarge" label="Large %*" style={{ marginBottom: "8px" }}>
                                <span>{data.large}</span>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="stockmixExLarge" label="Ex.Large %*" style={{ marginBottom: "8px" }}>
                                <span>{data.exLarge}</span>
                              </Form.Item>
                            </Col>
                          </Row>
                          <hr/>
                          <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="stockmixDEFVVS" label="DEF VVS %*" style={{ marginBottom: "8px" }}>
                                <span>{data.defVvs} </span>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="stockmixDEFVS" label="DEF VS%*" style={{ marginBottom: "8px" }}>
                                <span>{data.defVs}</span>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="stockMixDEFSI" label="DEF SI%*" style={{ marginBottom: "8px" }}>
                                <span>{data.defSi}</span>
                              </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                              <Form.Item name="stockmixGHVVS" label="GH VVS%*" style={{ marginBottom: "8px" }}>
                                <span>{data.defSi}</span>
                              </Form.Item>
                            </Col>
                          </Row>
                          <br />
                          <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="stockMixGHVS" label="GH VS%*" style={{ marginBottom: "8px" }}>
                                <span>{data.ghVs}</span>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item label="GH SI%*" name="stockmixGHSI" style={{ marginBottom: "8px" }}>
                                <span>{data.ghSi}</span>
                              </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={6}>
                              <Form.Item name="stoclkmixIJKVVS" label="IJK VVS%*" style={{ marginBottom: "8px" }}>
                                <span>{data.ijkVvs}</span>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="stockmixIJKVS" label="IJK VS%*" style={{ marginBottom: "8px" }}>
                                <span>{data.ijkVs}</span>
                              </Form.Item>
                            </Col>
                          </Row>
                          
                          <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="stockmixIJKSI" label="IJK SI%*" style={{ marginBottom: "8px" }}>
                                <span>{data.ijksi}</span>
                              </Form.Item>
                            </Col>
                          </Row>
                          <hr />
                          <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="stockmixDSD" label="DSD %*" style={{ marginBottom: "8px" }}>
                                <span>{data.dsd}</span>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item name="stockmixDSJ" label="DSJ %*" style={{ marginBottom: "8px" }}>
                                <span>{data.dsj}</span>
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                        <br />
                        {stockMixHeader.length > 1 ? <hr /> : null}
                      </div>
                    </Spin>
                  ))}
                </TabPane>

                <TabPane tab="Outlet" key="Outlet">
                  <h3>Outlet</h3>
                  <div style={{ padding: "8px" }}>
                    <Row>
                      <Col span={24} style={{ textAlign: "right", marginTop: "0.5%", marginBottom: "0.5%" }}>
                        <Button
                          size="small"
                          style={{
                            color: "white",
                            background: "#3E7A86",
                            fontSize: "12px",
                            float: "right",
                            marginBottom: "7.5px",
                          }}
                          onClick={() => {
                            openaddAddressModaloutlet();
                          }}
                        >
                          ADD +
                        </Button>
                      </Col>
                    </Row>
                  </div>
                  {outletHeader.map((data,index) => (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                      <div style={{ padding: "8px" }}> 
                      <h3>Outlet <span>{index}</span></h3>
                        <Row>
                          <Col span={24} style={{ textAlign: "right", marginTop: "0.5%", marginBottom: "0.5%" }}>
                            <span style={{ float: "right" }}>
                              <Button onClick={() => editFieldsInFromOutlet(data)} style={{ height: "30px", marginRight: "8px" }}>
                                <EditOutlined style={{ fontWeight: "600" }} />
                              </Button>
                              &nbsp;
                              <Button
                                style={{ height: "30px", marginRight: "8px" }}
                                onClick={() => {
                                  deleteOutlet(data.customerContactId);
                                }}
                              >
                                <i style={{ fontWeight: "600" }} className="lnr lnr-trash" />
                              </Button>
                            </span>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="outletName" label="Outlet Name" style={{ marginBottom: "8px" }}>
                              <span>{data.outletName} </span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="NickName" label="Nick  Name" style={{ marginBottom: "8px" }}>
                              <span>{data.nickName} </span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="OutletAddress" label="Outlet Address" style={{ marginBottom: "8px" }}>
                              <span>{data.addressLine1}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="outletcity" label="City" style={{ marginBottom: "8px" }}>
                              <span>{data.outletCity}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="Pincode" name="outlet_pinCode" style={{ marginBottom: "8px" }}>
                              <span>{data.pinCode}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="outletState" label="State" style={{ marginBottom: "8px" }}>
                              <span>{data.region.name}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="Zone" style={{ marginBottom: "8px" }}>
                              <span>{data.zone}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="Tier" style={{ marginBottom: "8px" }}>
                              <span>{data.tier}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="outletmobileNo" label="Phone No" style={{ marginBottom: "8px" }}>
                              <span>{data.mobileNo}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="outletsarea" label="Area" style={{ marginBottom: "8px" }}>
                              <span>{data.area}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="outletemail" label="Email" style={{ marginBottom: "8px" }}>
                              <span>{data.email}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="Market Name" name="outletMarketName" style={{ marginBottom: "8px" }}>
                              <span>{data.marketName}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="OutletStoreContactPersonName" label="Store Contact Person Name	" style={{ marginBottom: "8px" }}>
                              <span>{data.storeContactPersonName}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="OutletStoreContactPersonNo" label="Store Contact Person No	" style={{ marginBottom: "8px" }}>
                              <span>{data.storeContactPersonNo}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="Weekly Off" name="outletweeklyOff" style={{ marginBottom: "8px" }}>
                              <span>{data.weeklyOff}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="GST No" name="OutletgstNo" style={{ marginBottom: "8px" }}>
                              <span>{data.gstNo}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="OutletOnboardingDate" label="Outlet Onboarding Date" style={{ marginBottom: "8px" }}>
                              <span>{moment(data.outletOnboardingDate).format("YYYY-MM-DD")}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="OutletClosureDate" label="Outlet Closure Date " style={{ marginBottom: "8px" }}>
                              <span>{moment(data.outletClosureDate).format("YYYY-MM-DD")}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="OutletSalesRep" label="Outlet Sales Rep" style={{ marginBottom: "8px" }}>
                              <span>{data.salesRep.pjSalesRepresentativeName}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="outletSalesRepStartDate" label="Sales  Rep  Start Date" style={{ marginBottom: "8px" }}>
                              <span>{moment(data.salesRepStartDate).format("YYYY-MM-DD")}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="outletSalesRepEndDate" label="Sales Rep End Date" style={{ marginBottom: "8px" }}>
                              <span>{moment(data.salesRepEndDate).format("YYYY-MM-DD")}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6} style={{ marginTop: "-16px" }}>
                            <Form.Item name="pricelistHandoverContactPersonName" label="Price List Handover Contact Person Name" style={{ marginBottom: "8px" }}>
                              <span>{data.pricelistHandoverContactPersonName}</span>
                            </Form.Item>
                          </Col>

                          <Col className="gutter-row" span={6}>
                            <Form.Item name="PHandoverContactPersonNo" label="Price List Hand Over Contact No" style={{ marginBottom: "8px" }}>
                              <span>{data.pHandoverContactPersonNo}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6} style={{ marginTop: "-16px" }}>
                            <Form.Item name="outletStockConfirmationContactName" label="Stock Confirmation  Contact Person Name" style={{ marginBottom: "8px" }}>
                              <span>{data.stockConfirmationContactName}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6} style={{ marginTop: "-18px" }}>
                            <Form.Item name="OutletStockConfirmationContactNo" label="Stock Confirmation Contact Person No" style={{ marginBottom: "8px" }}>
                              <span>{data.stockConfirmationContactNo}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item valuePropName="checked" name="outlet_kyc" label="KYC" style={{ marginBottom: "8px" }}>
                              <span>{data.kyc}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="OUTLETAuthorisedOutlet" label="Authorised Outlet" style={{ marginBottom: "8px" }}>
                              {/* <Checkbox style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox> */}
                              <span>{data.authorizedoutlet}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="promotionAllowed" name="OutletpromotionAllowed" style={{ marginBottom: "8px" }}>
                              <span>{data.joiningWvOff}</span>
                            </Form.Item>
                          </Col>
                        
                        </Row> 
                        <br/>
                        <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="OutletLongitude" name="outletLongitude" style={{ marginBottom: "8px" }}>
                              <span>{data.outletLongitude}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="OutletLatitude" name=" outletLatitude" style={{ marginBottom: "8px" }}>
                              <span>{data.outletLatitude}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="OutletPic_outlet_all" label="Outlet Pic" style={{ marginBottom: "8px" }}>
                              <Image width={100} src={data.outletPic} />
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item valuePropName="checked" name="outlet_displayDone" label="Display Done" style={{ marginBottom: "8px" }}>
                              <span>{data.displayDone}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                          
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="OutletTrialFromPeriod" label="Trial Period  From  Date" style={{ marginBottom: "8px" }}>
                              <span>{moment(data.trialFromPeriod).format("YYYY-MM-DD")}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="OutletTrialToPeriod" label="Trial Period To Date" style={{ marginBottom: "8px" }}>
                              <span>{moment(data.trialToPeriod).format("YYYY-MM-DD")}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="OutletTotalStock" label="Total Stock" style={{ marginBottom: "8px" }}>
                              <span>{data.totalStock?data.totalStock.toLocaleString("en-IN"):""}</span>
                            </Form.Item>
                          </Col> 
                        
                        </Row>
                        <br />
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="ProjectionJwellerWise_Target" label="Projection Jweller Wise Target" style={{ marginBottom: "8px" }}>
                              <span>{data.projectionJwellerWiseTarget?data.projectionJwellerWiseTarget.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="Store Wise Target" name="OutletStoreWiseTarget" style={{ marginBottom: "8px" }}>
                              <span>{data.storeWiseTarget?data.storeWiseTarget.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):""}</span>
                            </Form.Item>
                          </Col> 
                         
                        </Row>
                       
                        <h3>Joining Fees </h3>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item name="Date" label="Date" style={{ marginBottom: "8px" }}>
                              <span>{data.joiningFeeDate}</span>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="Amount " name="Amount" style={{ marginBottom: "8px" }}>
                              <span>{data.joiningFeeAmount?data.joiningFeeAmount.toLocaleString('en-IN', { maximumSignificantDigits: 3 }):"" }</span>
                            </Form.Item>
                          </Col> 
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="Comments" name="Comments" style={{ marginBottom: "8px" }}>
                              <span>{data.comment}</span>
                            </Form.Item>
                          </Col> 
                          <Col className="gutter-row" span={6}>
                            <Form.Item label="Joining fee waive off" name="Joiningfeewaiveoff" style={{ marginBottom: "8px" }}>
                              <span>{data.joiningWvOff}</span>
                            </Form.Item>
                          </Col>
                        </Row>
                       
                        {outletHeader.length > 1 ? <hr /> : null}
                      </div>
                    </Spin>
                  ))}
                </TabPane>
              </Tabs>

              <Modal
                visible={visibleForKYCEdit}
                title="Edit KYC"
                width="80%"
                onCancel={handleCancelAllModal}
                footer={[
                  <span>
                    <Button style={{ background: "#E9E9E9", color: "#384147", fontSize: "14px" }} onClick={handleCancelAllModal}>
                      Cancel
                    </Button>
                    <Button style={{ background: "#3E7A86", color: "#ffffff", fontSize: "14px" }} key="submit" onClick={getKYCupset}>
                      Confirm
                    </Button>
                  </span>,
                ]}
              >
                <Form form={kycForm} name="dynamic_form_kyc" layout="vertical" autoComplete="off">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                    <div style={{ padding: "8px" }}>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="bUnitNamekyc" label="Business Unit*" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Business Unit"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {bunitData.map((option, index) => (
                                <Option key={`${index}-${option.bUnitName}`} value={option.csBunitId}>
                                  {option.bUnitName}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Kycpjcode" label="PJ code" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="KycpjName" label="PJ Name" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycNickName" label="Nick Name" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Kycpj_Address" label="PJ Address" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_city" label="City" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycpin_code" label="PinCode" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_state" label="State" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="state"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {stateKycData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>

                      <p />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_zone" label="Zone*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="InvoicingNamekyc" label="Invoicing Name" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="InvoicingAddresskyc" label="Invoicing Address" style={{ marginBottom: "8px" }}>
                            <Checkbox checked={isInvoicingAddress} onChange={onchangeInvoiceAddress} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycinvoiceFormate" label="Invoice Format" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Invoice Format"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {invoiceFormateData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row> 
                    <p/>  
                    {isInvoicingAddress===true?
                    <> 
                    <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Kycpj_Address" label="Invoice Address" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_city" label="City" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycpin_code" label="PinCode" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_state" label="State" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="state"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {stateKycData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>

                    </>
                    :""}
                      
                      <p />
                      {/* <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Country_Kyc" label="Country" style={{ marginBottom: "8px" }}>
                            <Select 
                            allowClear
                              showSearch
                              placeholder="Country"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}>

                              {countryKYCData.map((data, index) => (
                                <Option key={data.RecordID} value={data.RecordID} title={data.Name}>
                                  {data.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                       
                      </Row> */}
                      <p />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="TypeKyc" label="Type" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyccategory" label="Customer Category" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Category"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {customerCategoryData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="PJGroupKyc" label="PJ Group" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycOnboarding_Date" label="PJ Onboarding Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Kycpj_ClosureDate" label="PJ Closure Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_pjsalesRep" label="PJ Sales Rep" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="PJ Sales Rep"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {salesRepData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycpj_SalesRepStartDate" label="Sales Rep Start Date	" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycpjSalesRepEndDate" label="Sales Rep End Date	" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                      </Row>

                      <h3>Owner Details (Field Group)</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycpjOwnerName" label="Owner Name" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycmobileNo" label="Mobile No" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycemail" label="Email" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_Birth_Date" label="Birth Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_Anniversary_Date" label="Anniversary Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Kyc_Address" label="Address" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="KycOwnerPic" label="Owner Pic" style={{ marginBottom: "8px" }}>
                            <Upload
                              action="https://sapp.mycw.in/image-manager/uploadImage"
                              listType="picture"
                              headers={{ APIKey: "AUa4koVlpsgR7PZwPVhRdTfUvYsWcjkg" }}
                              name="image"
                              onChange={imageUploadStatusChangeKycOwnerPic}
                              maxCount={1}
                            >
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_sor" label="SOR" style={{ marginBottom: "8px" }}>
                            <Checkbox checked={isInsorInKyc} onChange={onChangechecboxsor} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="date_of_Establishement" label="Date of Establishment" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_InKyc" label="KYC" style={{ marginBottom: "8px" }}>
                            <Checkbox checked={isInKYCKYC} onChange={onChangechecbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Websiteaddresskyc" label="Website address" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyccompmany_Logo" label="Company Logo" style={{ marginBottom: "8px" }}>
                            <Upload
                              action="https://sapp.mycw.in/image-manager/uploadImage"
                              listType="picture"
                              headers={{ APIKey: "AUa4koVlpsgR7PZwPVhRdTfUvYsWcjkg" }}
                              name="image"
                              onChange={imageUploadStatusChangeKycOwnerPic}
                              maxCount={1}
                            >
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </Form.Item>
                        </Col>
                      </Row>
                      <h3>PJ Sales Distribution</h3>
                      <p />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="SolitaireJewellerykyc" label="Solitaire Jewellery" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="SmallDiamondJewelleryKyc" label="Small Diamond Jewellery " style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="GoldJewelleryKyc" label="Gold Jewellery" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="LuxuryLifestyleitemsKyc" label="Luxury & Lifestyle items" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Others" label="Others" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                      <h3>Other showroom details (Mention market name)</h3>

                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="RegisteredwithDSKyc" label="Registered with DS " style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="UnregisteredwithDSKyc" label="Unregistered with DS " style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                      {/* <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyccategory" label="Category" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Category"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {customerCategoryData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyccurrency" label="Currency" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Currency"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {CurrencyData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                      </Row> */}

                      {/* <Row gutter={16}>
                      
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycpaymentterms" label="Payment Terms" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Payment Terms"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {paymentData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                    
                        </Col> */}
                      {/* <Col className="gutter-row" span={6}>
                          <Form.Item name="kycinvoiceFormate" label="Invoice Format" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Invoice Format"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}

                            >
                              {invoiceFormateData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col> */}

                      {/* </Row> */}
                    </div>
                  </Spin>
                </Form>
              </Modal>
             <Modal
                visible={visibleNewButtonkYC}
                title="KYC"
                width="80%"
                onCancel={handelCancelKyc}
                footer={[
                  <span>
                    <Button style={{ background: "#E9E9E9", color: "#384147", fontSize: "14px" }} onClick={handelCancelKyc}>
                      Cancel
                    </Button>
                    <Button style={{ background: "#3E7A86", color: "#ffffff", fontSize: "14px" }} key="submit" onClick={getKYCupsetNewButton}>
                      Confirm
                    </Button>
                  </span>,
                ]}
              >
                <Form
                  form={kycForm}
                  name="dynamic_form_kyc"
                  layout="vertical"
               
                  autoComplete="off"
                >
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                  <div style={{ padding: "8px" }}>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="bUnitNamekyc" label="Business Unit*" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Business Unit"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {bunitData.map((option, index) => (
                                <Option key={`${index}-${option.bUnitName}`} value={option.csBunitId}>
                                  {option.bUnitName}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Kycpjcode" label="PJ code" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="KycpjName" label="PJ Name" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycNickName" label="Nick Name" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Kycpj_Address" label="PJ Address" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_city" label="City" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycpin_code" label="PinCode" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_state" label="State" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="state"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {stateKycData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>

                  
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_zone" label="Zone*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="InvoicingNamekyc" label="Invoicing Name" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="InvoicingAddresskyc" label="Invoicing Address" style={{ marginBottom: "8px" }}>
                            <Checkbox checked={isInvoicingAddress} onChange={onchangeInvoiceAddress} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycinvoiceFormate" label="Invoice Format" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Invoice Format"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {invoiceFormateData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p/>  
                    {isInvoicingAddress===true?
                    <> 
                    <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Kycpj_Address" label="Invoice Address" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_city" label="City" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycpin_code" label="PinCode" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_state" label="State" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="state"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {stateKycData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>

                    </>
                    :""}
                  
                 
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="TypeKyc" label="Type" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyccategory" label="Customer Category" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Category"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {customerCategoryData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="PJGroupKyc" label="PJ Group" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycOnboarding_Date" label="PJ Onboarding Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                      </Row>
                
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Kycpj_ClosureDate" label="PJ Closure Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_pjsalesRep" label="PJ Sales Rep" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="PJ Sales Rep"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {salesRepData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycpj_SalesRepStartDate" label="Sales Rep Start Date	" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycpjSalesRepEndDate" label="Sales Rep End Date	" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                      </Row>

                      <h3>Owner Details (Field Group)</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycpjOwnerName" label="Owner Name" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycmobileNo" label="Mobile No" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kycemail" label="Email" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_Birth_Date" label="Birth Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                      </Row>
                     
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_Anniversary_Date" label="Anniversary Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Kyc_Address" label="Address" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="KycOwnerPic" label="Owner Pic" style={{ marginBottom: "8px" }}>
                            <Upload
                              action="https://sapp.mycw.in/image-manager/uploadImage"
                              listType="picture"
                              headers={{ APIKey: "AUa4koVlpsgR7PZwPVhRdTfUvYsWcjkg" }}
                              name="image"
                              onChange={imageUploadStatusChangeKycOwnerPic}
                              maxCount={1}
                            >
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_sor" label="SOR" style={{ marginBottom: "8px" }}>
                            <Checkbox checked={isInsorInKyc} onChange={onChangechecboxsor} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                    
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="date_of_Establishement" label="Date of Establishment" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyc_InKyc" label="KYC" style={{ marginBottom: "8px" }}>
                            <Checkbox checked={isInKYCKYC} onChange={onChangechecbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Websiteaddresskyc" label="Website address" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="kyccompmany_Logo" label="Company Logo" style={{ marginBottom: "8px" }}>
                            <Upload
                              action="https://sapp.mycw.in/image-manager/uploadImage"
                              listType="picture"
                              headers={{ APIKey: "AUa4koVlpsgR7PZwPVhRdTfUvYsWcjkg" }}
                              name="image"
                              onChange={imageUploadStatusChangeKycOwnerPic}
                              maxCount={1}
                            >
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </Form.Item>
                        </Col>
                      </Row>
                      <h3>PJ Sales Distribution</h3>
                   
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="SolitaireJewellerykyc" label="Solitaire Jewellery" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="SmallDiamondJewelleryKyc" label="Small Diamond Jewellery " style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="GoldJewelleryKyc" label="Gold Jewellery" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="LuxuryLifestyleitemsKyc" label="Luxury & Lifestyle items" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                    
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Others" label="Others" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                      <h3>Other showroom details (Mention market name)</h3>

                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="RegisteredwithDSKyc" label="Registered with DS " style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="UnregisteredwithDSKyc" label="Unregistered with DS " style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                   </div>
                
                  </Spin>
                </Form>
              </Modal> 

              <Modal
                visible={visibleForStockEdit}
                title="Edit Stock"
                width="80%"
                onCancel={handleCancelAllModal}
                footer={[
                  <span>
                    <Button style={{ background: "#E9E9E9", color: "#384147", fontSize: "14px" }} onClick={handleCancelAllModal}>
                      Cancel
                    </Button>
                    <Button style={{ background: "#3E7A86", color: "#ffffff", fontSize: "14px" }} key="submit" onClick={getStockMixUpset}>
                      Confirm
                    </Button>
                  </span>,
                ]}
              >
                <Form form={stockmixForm} name="basic" layout="vertical" autoComplete="off">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                    <div>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="small" label="Small %*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="medium" label="Medium %*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Large" label="Large %*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="ExLarge" label="Ex.Large %*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row> 
                      <hr/>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="DEFVVS" label="DEF VVS %*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="DEFVS" label="DEF VS%*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="DEFSI" label="DEF SI%*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="GHVVS" label="GH VVS%*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <br />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="GHVS" label="GH VS%*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="GHSI" label="GH SI%*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="IJKVVS" label="IJK VVS%*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="IJKVS" label="IJK VS%*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                     
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="IJKSI" label="IJK SI%*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                     <hr/>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="DSD" label="DSD %*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="DSJ" label="DSJ %*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                      <br />
                    </div>
                  </Spin>
                </Form>
              </Modal>

              <Modal
                visible={visibleForRegulatoryEdit}
                title="Edit Regulatory"
                width="80%"
                onCancel={handleCancelAllModal}
                footer={[
                  <span>
                    <Button style={{ background: "#E9E9E9", color: "#384147", fontSize: "14px" }} onClick={handleCancelAllModal}>
                      Cancel
                    </Button>
                    <Button style={{ background: "#3E7A86", color: "#ffffff", fontSize: "14px" }} key="submit" onClick={getRegulatoryupset}>
                      Confirm
                    </Button>
                  </span>,
                ]}
              >
                <Form form={regulatoryForm} name="basic" layout="vertical" autoComplete="off">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                    <div>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="BankAccountNo" label="Bank Account No*" rules={[{ required: true, message: "Missing Bank Account No" }]} style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="bank_Name" label="Bank Name*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="bra_nch" label="Branch" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="ifsc_Code" label="IFSC Code" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <br />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Gst_No" label="GST No" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="panNo" label="PAN No" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="tdsApplicable" label="TDS Applicable" style={{ marginBottom: "8px" }}>
                            <Checkbox checked={istdsAPPlication} onChange={onChangechecbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="gstApplicable" label="GST Applicable" style={{ marginBottom: "8px" }}>
                            <Checkbox checked={isGSTApplicable} onChange={OnGSTApplicable} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                      <br />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="incentivePromptPayment" label="Incentive Prompt Payment	" style={{ marginBottom: "8px" }}>
                            <Checkbox
                              checked={isIncentivePromptPayment}
                              onChange={onIncentivePromptPayment}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="jwellerlevelPromtPayment" label="Jeweller Level Prompt Payment" style={{ marginBottom: "8px" }}>
                            <Checkbox
                              checked={isJewellerLevelPromptPayment}
                              onChange={onJewellerLevelPromptPayment}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </Spin>
                </Form>
              </Modal>
              <Modal
                visible={visibleForTermsAndConditionEdit}
                title="Edit Terms & Conditions"
                width="80%"
                onCancel={handleCancelAllModal}
                footer={[
                  <span>
                    <Button style={{ background: "#E9E9E9", color: "#384147", fontSize: "14px" }} onClick={handleCancelAllModal}>
                      Cancel
                    </Button>
                    <Button style={{ background: "#3E7A86", color: "#ffffff", fontSize: "14px" }} key="submit" onClick={getTermsConditionsupset}>
                      Confirm
                    </Button>
                  </span>,
                ]}
              >
                <Form form={termsAndConditionForm} name="basic" layout="vertical" autoComplete="off">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                    <div>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="PaymentTermsterm" label="Payment Terms" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Payment Terms"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {creditData &&
                                creditData.map((option, index) => (
                                  <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                    {option.Name}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="margin" label="Margin" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="depositCommited" label="Deposit Commited" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="DepositReceivedValue" label="Deposit Received Value" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="CreditLimit_terms" label="CreditLimit " style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="creditPeriod_terms" label="Credit Period">
                            <Select
                              allowClear
                              showSearch
                              placeholder="Credit Period"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {creditData &&
                                creditData.map((option, index) => (
                                  <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                    {option.Name}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="CSALimit_teams" label="CSA Limit" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="ASSLimit_teams" label="ASS Limit" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="TotalConsignmentStock_team" label="Total Consignment Stock" style={{ marginBottom: "8px" }} disabled>
                            <Input readOnly style={{ background: "rgb(241 243 247 / 68%)" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Outrightstock_team" label="Outright stock " style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Totalstock_team" label="Total stock" style={{ marginBottom: "8px" }}>
                            <Input readOnly style={{ background: "rgb(241 243 247 / 68%)" }} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Projection_JwellerWiseTarget" label="Projection Jeweller Wise Target" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="store_WiseTarget" label="Store wise target" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="storeWise_PromptPayment" label="Store Wise Prompt Payment	" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="agreement_Date" label="Agreement Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <br />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Agreement_Sign" label="Agreement Sign" style={{ marginBottom: "8px" }}>
                            <Checkbox checked={isAgreementSign} onChange={agreementSign} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                         <Col className="gutter-row" span={6}>
                          <Form.Item name="Deposit Waive off" label="Deposit Waive off" style={{ marginBottom: "8px" }}>
                            <Checkbox checked={isDepositWaiveoff} onChange={OnDeposit} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </Spin>
                </Form>
              </Modal>
              <Modal
                visible={visibleForOutletEdit}
                title="Edit Outlet"
                width="80%"
                onCancel={handleCancelAllModal}
                footer={[
                  <span>
                    <Button style={{ background: "#E9E9E9", color: "#384147", fontSize: "14px" }} onClick={handleCancelAllModal}>
                      Cancel
                    </Button>
                    <Button style={{ background: "#3E7A86", color: "#ffffff", fontSize: "14px" }} key="submit" onClick={getoutletUpset}>
                      Confirm
                    </Button>
                  </span>,
                ]}
              >
                <Form form={outletForm} name="basic" layout="vertical" autoComplete="off">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                    <div style={{ padding: "8px" }}>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_Name" label="Outlet Name" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_nickName" label="Nick  Name" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_addressLine1" label="Outlet Address" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_City" label="City" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                  
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_pinCode" label="PinCode" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="stateNameoutlet" label="State" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="state"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {stateOutletData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_zone" label="Zone" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_tier" label="Tier" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                     
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_mobileNo" label="Phone No" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_sarea" label="Area" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_email" label="Email" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_MarketName" label="Market Name" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                   
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_storeContactPersonName" label="Store Contact Person Name	" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_storeContactPersonNo" label="Store Contact Person No	" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_weeklyOff" label="Weekly Off" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_gstNo" label="GST No" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                   
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_OnboardingDate" label="Outlet Onboarding Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_ClosureDate" label="Outlet Closure Date " style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_salesRep" label="Outlet Sales Rep" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Outlet Sales Rep"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {salesRepData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_salesRepStartDate" label="Sales  Rep  Start Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                      </Row>
                   
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_salesRepEndDate" label="Sales Rep End Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="pricelist_HandoverContact_PersonName" label="Price List Handover Contact Person Name" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="pHandover_ContactPersonNo" label="Price List Hand Over Contact No" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_stockConfirmationContactName" label="Stock Confirmation  Contact Person Name" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col className="gutter-row" span={6} style={{ marginTop: "4px" }}>
                          <Form.Item name="outlet_stockConfirmationContactNo" label="Stock Confirmation Contact Person No" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_kyc" label="KYC" style={{ marginBottom: "4px" }}>
                            <Checkbox checked={iskycoutlet} onChange={onchangechecboxKycinOutlet} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="OUTLETAuthorisedOutlet" label="Authorised Outlet" style={{ marginBottom: "4px" }}>
                            <Checkbox
                              checked={isAuthorisedOutlet}
                              onChange={onChangecheckboxAuthorised}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_promotionAllowed" label="Promotion Allowed" style={{ marginBottom: "4px" }}>
                            <Checkbox checked={isPromotionAllowed} onChange={onChangePromotionAllowed} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                       
                      </Row>
                    
                   
                      <Row gutter={16}> 
                      <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_Longitude" label="outletLongitude" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_Latitude" label="outletLatitude" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="OutletPic_outlet" label="Outlet Pic" style={{ marginBottom: "8px" }}>
                            <Upload
                              action="https://sapp.mycw.in/image-manager/uploadImage"
                              listType="picture"
                              headers={{ APIKey: "AUa4koVlpsgR7PZwPVhRdTfUvYsWcjkg" }}
                              name="image"
                              onChange={imageUploadStatusChange}
                              maxCount={1}
                            >
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_displayDone" label="Display Done" style={{ marginBottom: "8px" }}>
                            <Checkbox checked={isdisplayDone} onChange={onChangechecbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        
                        </Col>
                      </Row>
                      <Row gutter={16}>
                       
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_trialFromPeriod" label="Trial Period  From  Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_trialToPeriod" label="Trial Period To Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item readOnly name="outlet_totalStock" label="Total Stock" style={{ marginBottom: "8px" }}>
                            <Input
                             /> 
                          </Form.Item>
                        </Col>  
                        
                      </Row>
                   
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_ProjectionJwellerWiseTarget" label="Projection Jweller Wise Target" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_storeWiseTarget" label="Store Wise Target" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                     
                      </Row>
                      <h3>Joining Fees </h3>
                     <Row  gutter={16}>
                     <Col className="gutter-row" span={6}>
                        <Form.Item name="Dateoutlet" label="Date"  style={{ marginBottom: "8px" }}>
                        <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                     
                       <Col className="gutter-row" span={6}>
                        <Form.Item name="Amount0utlet" label="Amount" style={{ marginBottom: "8px" }}>
                              <Input />
                          </Form.Item>
                        </Col>
                                   
                       <Col className="gutter-row" span={6}>
                         <Form.Item name= "Commentsoutlet" label="Comments" style={{ marginBottom: "8px" }}>
                                        <Input  />
                         </Form.Item>
                         </Col> 
                         <Col className="gutter-row" span={6}>
                          <Form.Item name="outlet_Joiningfeewaiveoff" label="Joining fee waive off" style={{ marginBottom: "4px" }}>
                            <Checkbox checked={isJoiningfeewaiveoff} onChange={onChangejoiningWvOff} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                       
                     </Row>

                      {/* <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={24}>
                          <Form.List form={mainForm} name="dyanamicFileds" autoComplete="off">
                            {(fields, { add, remove }) => (
                              <>
                                <Col className="gutter-row" span={12} />
                                <Col className="gutter-row" span={22}>
                                  <Form.Item>
                                    <span style={{ float: "right" }}>
                                      <PlusCircleOutlined onClick={() => add()} />
                                    </span>
                                  </Form.Item>
                                </Col>
                                <br />
                                <h3>Joining Fees </h3>
                                {fields.map(({ key, name, ...restField }) => (
                                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                                    <Col className="gutter-row" span={2} />
                                    <Col className="gutter-row" span={24}>
                                      <Form.Item name={[name, "Date"]} label="Date" {...restField} style={{ marginBottom: "8px" }}>
                                        <Input />
                                      </Form.Item>
                                    </Col>

                                    <Col className="gutter-row" span={2} />
                                    <Col className="gutter-row" span={24}>
                                      <Form.Item name={[name, "Amount"]} label="Amount " {...restField} style={{ marginBottom: "8px" }}>
                                        <Input />
                                      </Form.Item>
                                    </Col>

                                    <Col className="gutter-row" span={2} />
                                    <Col className="gutter-row" span={24}>
                                      <Form.Item name={[name, "Comments"]} label="Comments" {...restField} style={{ marginBottom: "8px" }}>
                                        <Input />
                                      </Form.Item>
                                    </Col>
                                    <Col className="gutter-row" span={2} />
                                    <Col className="gutter-row" span={2}>
                                      <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Col>
                                  </Space>
                                ))}
                              </>
                            )}
                          </Form.List>
                        </Col>
                      </Row> */}
                    </div>
                  </Spin>
                </Form>
              </Modal>
              <Modal
                visible={visibleForCustomerInfoEdit}
                title="CustomerInfo"
                width="80%"
                onCancel={handelCancelcustomer}
                footer={[
                  <span>
                    <Button style={{ background: "#E9E9E9", color: "#384147", fontSize: "14px" }} onClick={handelCancelcustomer}>
                      Cancel
                    </Button>
                    <Button style={{ background: "#3E7A86", color: "#ffffff", fontSize: "14px" }} key="submit" onClick={getFinish}>
                      Confirm
                    </Button>
                  </span>,
                ]}
              >
                <Form form={CustomerInfoForm} name="basic" layout="vertical" autoComplete="off">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                    <div style={{ padding: "8px" }}>
                      <h3>Customer Info</h3>

                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="bUnitName" label="Business Unit*" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Business Unit"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {bunitData.map((option, index) => (
                                <Option key={`${index}-${option.bUnitName}`} value={option.csBunitId}>
                                  {option.bUnitName}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="pjcode" label="PJ Code*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="pjName" label="PJ Name*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customercategory" label="Customer Category" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Customer Category"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {customerCategoryData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerinfoGSTNo" label="GST No" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="currency" label="Currency" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Currency"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {CurrencyData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                    
                      </Row>
                      <p style={{ marginBottom: "10px" }} />

                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Invoicingcustomer" label="Invoicing (Y/N)" style={{ marginBottom: "8px" }}>
                            <Checkbox
                              checked={isInvoicingCustomer}
                              onChange={onChangeCheckBoxcustomer}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="custominfoinvoicingaddress" label="Invoicing Address" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="CSAlimit" label="CSA Limit" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="ASSLimit" label="ASS Limit" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="ASSStartDate" label="ASS Start Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="ASSEndDate" label="ASS End Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customertotalconsignmentStock" label="Total Consignment Stock (TCS)" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customeroutrightstock" label="Outright Stock (OS)" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoTotalStock" label="Total  Stock" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="paymentterms" label="Payment Terms" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Payment Terms"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {paymentData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <h3>More Information</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfopjtype" label="PJ Type" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerinfopjgroup" label="PJ Group" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoPJClosureDate" label="PJ Closure Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoPJOnboardingDate" label="PJ Onboarding Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoownername" label="Owner Name" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerinfocity" label="City" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfostate" label="State" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="state"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {stateData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfozone" label="Zone" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoEmail" label="Email" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerinfomobileno" label="Mobile No" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoCountry" label="Country" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Country"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {countryData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="invoiceFormate" label="Invoice Format" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Invoice Format"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {invoiceFormateData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfopincode" label="Pincode" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerinfoWebSiteaddress" label="WebSite Address" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoCompanyLogo" label="Company Logo" style={{ marginBottom: "8px" }}>
                            <Upload
                              action="https://sapp.mycw.in/image-manager/uploadImage"
                              listType="picture"
                              headers={{ APIKey: "AUa4koVlpsgR7PZwPVhRdTfUvYsWcjkg" }}
                              name="image"
                              onChange={imageUploadStatusChangecustomer}
                              maxCount={1}
                            >
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfownerPic" label="Owner Pic" style={{ marginBottom: "8px" }}>
                            <Upload
                              action="https://sapp.mycw.in/image-manager/uploadImage"
                              listType="picture"
                              headers={{ APIKey: "AUa4koVlpsgR7PZwPVhRdTfUvYsWcjkg" }}
                              name="image"
                              onChange={imageUploadStatusChangecustomer}
                              maxCount={1}
                            >
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <h3>PJ Sales Distribution In(%)</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfosolitairejewellery" label="Solitaire Jewellery" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerinfosmalldiamondjewellery" label="Small Diamond Jewellery" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoGoldJewellery" label="Gold Jewellery" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoluxurylifestyleitems" label="Luxury & Lifestyle Items" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoOthers" label="Others" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <h3>Other Showroom Details (Mention Market Name)</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoRegisteredWithDS" label="Registered With DS" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoUnRegisteredWithDS" label="Un-Registered With DS" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </Spin>
                </Form>
              </Modal>
            
              {/* <Modal
                visible={visibleForCustomerInfoNewEdit}
                title="CustomerInfo Edit"
                width="80%"
                onCancel={handelCancelcustomeredit}
                footer={[
                  <span>
                    <Button style={{ background: "#E9E9E9", color: "#384147", fontSize: "14px" }} onClick={handelCancelcustomeredit}>
                      Cancel
                    </Button>
                    <Button style={{ background: "#3E7A86", color: "#ffffff", fontSize: "14px" }} key="submit" onClick={getFinishEdit}>
                      Confirm
                    </Button>
                  </span>,
                ]}
              >
                <Form form={CustomerInfoForm} name="basic" layout="vertical" autoComplete="off">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                    <div style={{ padding: "8px" }}>
                      <h3>Customer Info</h3>

                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="bUnitName" label="Business Unit*" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Business Unit"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {bunitData.map((option, index) => (
                                <Option key={`${index}-${option.bUnitName}`} value={option.csBunitId}>
                                  {option.bUnitName}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="pjcode" label="PJ Code*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="pjName" label="PJ Name*" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customercategory" label="Customer Category" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Customer Category"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {customerCategoryData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerinfoGSTNo" label="GST No" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="currency" label="Currency" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Currency"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {CurrencyData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />

                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="Invoicingcustomer" label="Invoicing (Y/N)" style={{ marginBottom: "8px" }}>
                            <Checkbox
                              checked={isInvoicingCustomer}
                              onChange={onChangeCheckBoxcustomer}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="custominfoinvoicingaddress" label="Invoicing Address" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="CSAlimit" label="CSA Limit" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="ASSLimit" label="ASS Limit" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="ASSStartDate" label="ASS Start Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="ASSEndDate" label="ASS End Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customertotalconsignmentStock" label="Total Consignment Stock (TCS)" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customeroutrightstock" label="Outright Stock (OS)" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoTotalStock" label="Total  Stock" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="paymentterms" label="Payment Terms" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Payment Terms"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {paymentData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <h3>More Information</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfopjtype" label="PJ Type" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerinfopjgroup" label="PJ Group" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoPJClosureDate" label="PJ Closure Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoPJOnboardingDate" label="PJ Onboarding Date" style={{ marginBottom: "8px" }}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoownername" label="Owner Name" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerinfocity" label="City" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfostate" label="State" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="state"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {stateData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfozone" label="Zone" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoEmail" label="Email" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerinfomobileno" label="Mobile No" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoCountry" label="Country" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Country"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {countryData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="invoiceFormate" label="Invoice Format" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              placeholder="Invoice Format"
                              dropdownMatchSelectWidth={false}
                              dropdownStyle={{ width: 228 }}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              style={{ width: "100%" }}
                            >
                              {invoiceFormateData.map((option, index) => (
                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                  {option.Name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfopincode" label="Pincode" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerinfoWebSiteaddress" label="WebSite Address" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoCompanyLogo" label="Company Logo" style={{ marginBottom: "8px" }}>
                            <Upload
                              action="https://sapp.mycw.in/image-manager/uploadImage"
                              listType="picture"
                              headers={{ APIKey: "AUa4koVlpsgR7PZwPVhRdTfUvYsWcjkg" }}
                              name="image"
                              onChange={imageUploadStatusChangecustomer}
                              maxCount={1}
                            >
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfownerPic" label="Owner Pic" style={{ marginBottom: "8px" }}>
                            <Upload
                              action="https://sapp.mycw.in/image-manager/uploadImage"
                              listType="picture"
                              headers={{ APIKey: "AUa4koVlpsgR7PZwPVhRdTfUvYsWcjkg" }}
                              name="image"
                              onChange={imageUploadStatusChangecustomer}
                              maxCount={1}
                            >
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <h3>PJ Sales Distribution In(%)</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfosolitairejewellery" label="Solitaire Jewellery" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerinfosmalldiamondjewellery" label="Small Diamond Jewellery" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoGoldJewellery" label="Gold Jewellery" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoluxurylifestyleitems" label="Luxury & Lifestyle Items" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <p style={{ marginBottom: "10px" }} />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoOthers" label="Others" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <h3>Other Showroom Details (Mention Market Name)</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoRegisteredWithDS" label="Registered With DS" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="customerInfoUnRegisteredWithDS" label="Un-Registered With DS" style={{ marginBottom: "8px" }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </Spin>
                </Form>
              </Modal>
             */}
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomWindowHeader;

