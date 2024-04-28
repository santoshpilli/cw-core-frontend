import axios from "axios";
// import { genericUrl, fileDownloadUrl } from "../constants/serverConfig";
import { generateToken } from "./generateToken";
import { getOAuthHeaders } from "../constants/oAuthValidation";

const fileDownloadUrl = process.env.REACT_APP_fileDownloadUrl;
let localToken;
let appId;
const { access_token } = getOAuthHeaders();
const genericUrl = process.env.REACT_APP_genericUrl

const genericInstance = axios.create();
genericInstance.defaults.baseURL = genericUrl;
// genericInstance.defaults.withCredentials = true;
genericInstance.defaults.method = "POST";
genericInstance.defaults.headers.post["Content-Type"] = "application/json";

const updateLocalToken = () => {
  localToken = JSON.parse(localStorage.getItem("authTokens"));
};

const updateAppid = () => {
  appId = localStorage.getItem("appId");
};

genericInstance.interceptors.request.use(
  (config) => {
    if (!localToken) {
      updateLocalToken();
    }
    if (!appId) {
      updateAppid();
    }
    config.headers.Authorization = `Bearer ${access_token}`;
    config.headers['appId'] = appId;
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

genericInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { message } = JSON.parse(JSON.stringify(error));
    if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
      generateToken();
    } else {
      return Promise.reject(error);
    }
  }
);

const displayError = (error) => {
  console.error(JSON.stringify(error, null, 2));
};

const getUser = async (user) => {
  try {
    const userData = await genericInstance({
      data: {
        operationName: null,
        variables: {},
        query: `{getUser(userName: "${user}")}`,
      },
    });
    return JSON.parse(userData.data.data.getUser);
  } catch (error) {
    displayError(error);
    return {};
  }
};

const getComboFill = async (userId) => {
  try {
    const combiFillData = await genericInstance({
      data: {
        query: `query {
            comboFill(
              tableName: "cs_role"
              pkName: "cs_role_id"
              identifier: "name"
              whereClause: "cs_role_id in (select cs_role_id from cs_user_access where cs_user_id = '${userId}')"
            )
          }`,
      },
    });
    return JSON.parse(combiFillData.data.data.comboFill);
  } catch (error) {
    displayError(error);
    return null;
  }
};

const get360MenuList = async (id) => {
  try {
    const threeSixtyMenuList = await genericInstance({
      data: {
        query: `query {
          get360MenuList(applicationId: "${id}", roleId: null) {
              menu
              cwLogo
              clientLogo
          }   
      }`,
      },
    });

    return JSON.parse(threeSixtyMenuList.data.data.get360MenuList["menu"]);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getWindowDefinition = async (windowId) => {
  try {
    const windowDefinitions = JSON.parse(localStorage.getItem("windowDefinitions")) || [];
    const existingIndex = windowDefinitions.findIndex((definition) => definition.ad_window_id === windowId);
    if (existingIndex >= 0) {
      return windowDefinitions[existingIndex];
    }
    const windowDefinationData = await genericInstance({
      data: {
        query: `query {
          windowDefinition(ad_window_id: "${windowId}")
        }`,
      },
    });
    const windowDefinitionResponse = JSON.parse(windowDefinationData.data.data.windowDefinition);
    if (windowDefinitionResponse) {
      windowDefinitions.push(windowDefinitionResponse);
    }
    localStorage.setItem("windowDefinitions", JSON.stringify(windowDefinitions));
    return windowDefinitionResponse;
  } catch (error) {
    displayError(error);
    return {};
  }
};

const getTabData = async (tabDataRequestParams) => {
  try {
    const filterDataField = tabDataRequestParams["filterData"] && tabDataRequestParams["filterData"].length > 0
    ? `filterData: "[${tabDataRequestParams["filterData"]}]",`
    : "";
    const getTabDataResponse = await genericInstance({
      data: {
        operationName: null,
        variables: {},
        query: `{ 
        getTabData(
          tabData: {
            windowId:"${tabDataRequestParams["windowId"]}",
            ad_tab_id: "${tabDataRequestParams["ad_tab_id"]}",
            ${tabDataRequestParams["parentTabId"] ? `parentTabId: "${tabDataRequestParams["parentTabId"]}",` : ""}
            ${tabDataRequestParams["recordId"] ? `recordId: "${tabDataRequestParams["recordId"]}",` : ``}
            ${tabDataRequestParams["parentRecordID"] ? `parentRecordID: "${tabDataRequestParams["parentRecordID"]}",` : ""}
            ${tabDataRequestParams["search"] ? `search: "${tabDataRequestParams["search"]}",` : ""}
            ${tabDataRequestParams["startRow"] ? `startRow: "${tabDataRequestParams["startRow"]}",` : ""}
            ${tabDataRequestParams["endRow"] ? `endRow: "${tabDataRequestParams["endRow"]}",` : ""}
            ${filterDataField}
            ${tabDataRequestParams["sortInfo"] ? `sortInfo: "[${tabDataRequestParams["sortInfo"]}]",` : ""}
          }
        ) { startRow endRow tableName totalRows records messageCode message __typename } }`,
      },
    });
    return JSON.parse(getTabDataResponse.data.data.getTabData.records).data;
  } catch (error) {
    displayError(error);
    return [];
  }
};

const getTabSummary = async (tabDataRequestParams) => {
  try {
    const getTabSummaryResponse = await genericInstance({
      data: {
        operationName: null,
        variables: {},
        query: `{
          getTabSummary(
            windowId:"${tabDataRequestParams["windowId"]}",
            tabId: "${tabDataRequestParams["tabId"]}",
            ${tabDataRequestParams["parentTabId"] ? `parentTabId: "${tabDataRequestParams["parentTabId"]}",` : ""},
            ${tabDataRequestParams["parentRecordId"] ? `parentRecordId: "${tabDataRequestParams["parentRecordId"]}",` : ""}
            filterData: "[${tabDataRequestParams["filterData"]}]",
            summaryData: "${tabDataRequestParams["summaryData"]}"
          )
        }`,
      },
    });
    return getTabSummaryResponse.data.data.getTabSummary;
  } catch (error) {
    displayError(error);
    return [];
  }
};

const getsearchFieldData = async (windowId,headerId,tabId,searchField, searchValue, dependentData, jsonParam) => {
  const searchFieldData = await genericInstance({
    data: {
      query: `query {searchField(windowId:"${windowId}",ad_tab_id:"${tabId}",ad_field_id:"${searchField}",searchField:"${searchValue}",
       dependent: ${dependentData?`"${dependentData}"`:null}, 
      ${jsonParam ? `param: ${jsonParam},` : ``},headerId:"${headerId?headerId:null}"
      )}`,
    },
  });
  return searchFieldData;
};

const upsertTabData = async (windowId,tabId, recordId, jsonStringified, parentTabId, parentRecordID) => {
  const upsertTabDataResponse = await genericInstance({
    data: {
      query: `mutation {
                upsertTab(
                  tabData:{windowId:"${windowId}",
                  ad_tab_id:"${tabId}",
                  recordId:"${recordId}",
                  ${parentTabId ? `parentTabId: "${parentTabId}",` : ""}
                  ${parentRecordID ? `parentRecordID: "${parentRecordID}",` : ""}
                  insert:${jsonStringified}}
                )
              { status message messageCode tableName recordId savedRecord }
            }`,
    },
  });
  return upsertTabDataResponse;
};

const getWindowInitializationData = async (windowId,tab_id, parent_tab_id, sessionData) => {
  try {
    const windowInitializationResponse = await genericInstance({
      data: {
        operationName: null,
        variables: {},
        query: `{
          windowInitialization(
            windowId:"${windowId}",
            tab_id: "${tab_id}",
            parent_tab_id: ${parent_tab_id ? `"${parent_tab_id}"` : null},
            sessionData: ${sessionData ? `${sessionData}` : null}
          )
        }`,
      },
    });
    return JSON.parse(windowInitializationResponse.data.data.windowInitialization);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getAutoCompleteData = async (windowId,ad_field_id, value, ad_tab_id, parentId, formData) => {
  try {
    const autoCompleteResponse = await genericInstance({
      data: {
        query: `mutation {
          autoComplete(
            windowId:"${windowId}",
            ad_field_id: "${ad_field_id}"
            value: "${value}"
            ad_tab_id: "${ad_tab_id}"
            parentId: ${parentId ? `"${parentId}"` : null}
            param: ${formData}
          )
        }`,
      },
    });
    return JSON.parse(autoCompleteResponse.data.data.autoComplete);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const deleteTabRecord = async (windowId,ad_tab_id, recordIds) => {
  try {
    let records = "";
    recordIds.map((value, index) => {
      if (recordIds.length - 1 === index) {
        return (records += `"${value}"`);
      } else {
        return (records += `"${value}",`);
      }
    });
    const deleteTabResponse = await genericInstance({
      data: {
        query: `mutation { 
          deleteTab(
            windowId:"${windowId}",
            ad_tab_id:"${ad_tab_id}",
            recordIds: [${records}]
          ) { messageCode, title, message }
        }`,
      },
    });
    return deleteTabResponse.data.data.deleteTab;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getProcessParamJson = async (adFieldId, processtype, ntProcessId, isReqConfirm) => {
  try {
    const processButtonData = await genericInstance({
      data: {
        operationName: null,
        variables: {},
        // eslint-disable-next-line
        query: `query {
          getProcessParamJson(processId:"${ntProcessId}")
      }`,
      },
    });
    return JSON.parse(processButtonData.data.data.getProcessParamJson);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getRunProcessWithoutParameters = async (adFieldIdForRunProces, headerTabId, recordId,windowId,flag) => {
  try {
    const callRunProcessDataWithoutParameters = await genericInstance({
      data: {
        operationName: null,
        variables: {},
        // eslint-disable-next-line
        query: `mutation {
          runProcess(recordId:"${recordId}", ad_tab_id:"${headerTabId}", ad_field_id:"${adFieldIdForRunProces}",parameters:"{}",windowId:"${windowId}",enableMultiProcess:${flag === null || flag === undefined || flag === ""? null:`"${flag}"`})
            {messageCode, title, message}   
        }`,
      },
    });

    return callRunProcessDataWithoutParameters.data.data.runProcess;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getProcessParamData = async (windowId,headerTabId, recordId, id) => {
  try {
    const callProcessParamData = await genericInstance({
      data: {
        operationName: null,
        variables: {},
        // eslint-disable-next-line
        query: `query {
          getProcessParamData(processId:"${id}",windowId:"${windowId}", tabId:"${headerTabId}", recordId:"${recordId}")
      }`,
      },
    });
    return JSON.parse(callProcessParamData.data.data.getProcessParamData);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getRunProcess = async (idForRunProcess, headerTabId, recordId, windowId,parametersData,flag) => {
  try {
    const runProcessData = await genericInstance({
      data: {
        operationName: null,
        variables: {},
        // eslint-disable-next-line
        query: `mutation {
          runProcess(recordId:"${recordId}", ad_tab_id:"${headerTabId}", ad_field_id:"${idForRunProcess}",parameters:${parametersData},windowId:"${windowId}",enableMultiProcess:${flag === null || flag === undefined || flag === ""? null:`"${flag}"`})
            {messageCode, title, message}   
        }`,
      },
    });

    return runProcessData.data.data.runProcess;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getProcessParamComboFill = async (processId,searchField, searchText,recordId) => {
  const processParamComboFill = await genericInstance({
    data: {
      // eslint-disable-next-line
      query: `query {
        processParamComboFill(processId:"${processId}",paramId:"${searchField}"${searchText ? `, search: "${searchText}"` : ""},recordId:"${recordId}")
    }`,
    },
  });
  return processParamComboFill;
};

const getProcessFormData = async (processId, recordId, param) => {
  const getProcessFormDataValues = await genericInstance({
    data: {
      // eslint-disable-next-line
      query: `query {
        getProcessFormData(processId:"${processId}", recordId:"${recordId}", param:${param})
    }`,
    },
  });
  return getProcessFormDataValues;
};

//Shridhar
const getPrintTemplate = async (windowId,headerTabId, recordId) => {
  const printTemplateData = await genericInstance({
    data: {
      // eslint-disable-next-line
      query: `query {reportTemplate(windowId:"${windowId}",ad_tab_id:"${headerTabId}",recordId:"${recordId}")}`,
    },
  });
  return printTemplateData;
};

const getPrintDownloadData = async (fileName) => {
  const printTemplateData = await axios({
    url: `${fileDownloadUrl}`.concat(`${fileName}`),
    method: "GET",
    responseType: "blob",
  });
  return printTemplateData;
};

const getEmailData = async (windowId, recordId) => {
  const emailData = await genericInstance({
    data: {
      query: `query {getEmailData (windowId:"${windowId}", recordId:"${recordId}") }`,
    },
  });
  return emailData;
};

const deleteFileAttachment = async (csFileId) => {
  try {
    const deleleTemplate = await genericInstance({
      data: {
        query: `mutation {
        deleteFile(csFileId: "${csFileId}") {
            title
            message
        }
    }`,
      },
    })
    return deleleTemplate.data.data.deleteFile;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const sendEmailFun = async (values) => {
  const emailData = await genericInstance({
    data: {
      query: `query {
        sendEmail(fromEmailId: "${values.from}", replyTo:${values.replyTo == null ? null : '"' + values.replyTo + '"'}, toEmailIds: ${values.to == null ? null : '"' + values.to + '"'
        },ccEmailIds:${values.cc == null ? null : '"' + values.cc + '"'}, subject:"${values.subject}", body:"${values.body}",attachmentPath:"${values.attachment
        }", emailTemplateId: null, parameter: null) {
            messageCode
            title
            message
        }
    }`,
    },
  });
  return emailData;
};

const getFilesData = async (windowId, headerTabId, recordId) => {
  const filesData = await genericInstance({
    data: {
      query: `query{getFileList(windowId:"${windowId}", tabId:"${headerTabId}", recordId:"${recordId}")  }`,
    },
  });
  return filesData;
};

const getComboFillForReportIdAndValue = async (dropdownId, value,reportId) => {
  try {
    const comboFillDataForReport = await genericInstance({
      data: {
        query: `query {
          reportComboFill(filterId:"${dropdownId}", dependentValue:null,reportId:"${reportId}", searchField:"${value}", limit:"100")
      }`,
      },
    });

    return JSON.parse(comboFillDataForReport.data.data.reportComboFill);
  } catch (error) {
    displayError(error);
    return null;
  }
};

const getComboFillForReportOnlyId = async (dropdownId, dependentValueId, reportId) => {
  try {
    const comboFillDataForReport = await genericInstance({
      data: {
        query: `query {
          reportComboFill(filterId:"${dropdownId}", dependentValue:${dependentValueId === undefined || dependentValueId === null ? null : `"${dependentValueId}"`},reportId:"${reportId}", searchField:"", limit:"100")
      }`,
      },
    });

    return JSON.parse(comboFillDataForReport.data.data.reportComboFill);
  } catch (error) {
    displayError(error);
    return null;
  }
};

const getUserPreferencesData = async () => {
  const userPreferencesData = await genericInstance({
    data: {
      query: `query { getUserPreferences }`,
    },
  });
  return JSON.parse(userPreferencesData.data.data.getUserPreferences);
};

const getGlobalParameters = async () => {
  const globalParametrsData = await genericInstance({
    data: {
      query: `query { getGlobalParameters }`,
    },
  });
  return JSON.parse(globalParametrsData.data.data.getGlobalParameters);
};

const getAdminMenuList = async (roleId) => {
  try {
    const threeSixtyAdminMenuList = await genericInstance({
      data: {
        query: `query {
          getAdminMenuList(roleId:"${roleId}") {
              menu
              cwLogo
              clientLogo
          }   
      }
      `,
      },
    });
    return JSON.parse(threeSixtyAdminMenuList.data.data.getAdminMenuList["menu"]);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

// Nikhil's Code for getting dynamic Logos
const getAdminMenuListForDynamicLogos = async (roleId) => {
  try {
    const threeSixtyAdminMenuList = await genericInstance({
      data: {
        query: `query {
          getAdminMenuList(roleId:"${roleId}") {
              menu
              cwLogo
              clientLogo
          }   
      }
      `,
      },
    });
    return threeSixtyAdminMenuList.data.data.getAdminMenuList;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

// Import Services
const getComboFillForImport = async () => {
  try {
    const comboFillDataForImport = await genericInstance({
      data: {
        query:`query {
          comboFill(tableName: "cs_import_template", pkName: "cs_import_template_id", identifier: "name", whereClause: "enable = 'Y'"
          )
        }`
      },
    });
    return JSON.parse(comboFillDataForImport.data.data.comboFill);
  } catch (error) {
    displayError(error);
    return null;
  }
};

const importDefinitionService = async (id, generic) => {
  try {
    const queryParameter = generic ? "tabId" : "templateId";
    
    const importDefinitionMutation = await genericInstance({
      data: {
        query: `query{getImportDefinition(${queryParameter}:"${id}")}`,
      },
    });
    
    return JSON.parse(importDefinitionMutation.data.data.getImportDefinition);
  } catch (error) {
    displayError(error);
    return null;
  }
};


const downloadImportDataService = async (id,flag) => {
  try {
    const queryParameter = flag ? "tabId" : "templateId";
    const downloadImportMutation = await genericInstance({
      data: {
        query: `query{downloadImportFormat(${queryParameter}:"${id}")}`,
      },
    });
    return JSON.parse(downloadImportMutation.data.data.downloadImportFormat);
  } catch (error) {
    displayError(error);
    return null;
  }
};

const verifyAndImportService = async (headerId, id, dataToSend,templateId,flag) => {
  try {
    const queryParameter = flag ? "tabId" : "templateId";
    const verifyAndImportMutation = await genericInstance({
      data: {
        query: `mutation { verifyAndImport(headerId:${headerId === null || headerId === undefined ? null : `"${headerId}"`},${queryParameter}:"${templateId}" ,tabData:{recordId:"NEW_RECORD",ad_tab_id:"${id}",importData:"${dataToSend}"})}`,
      },
    });
    return JSON.parse(verifyAndImportMutation.data.data.verifyAndImport);
  } catch (error) {
    displayError(error);
    return null;
  }
};

const getCustomBusinessUnit = async () => {
  try {
    const businessUnitData = await genericInstance({
      data: {
        query: `query {
          comboFill(tableName:"cs_bunit", pkName:"cs_bunit_id", identifier:"cs_bunit_id, name", whereClause: null)
      }`,
      },
    });
    return JSON.parse(businessUnitData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getSupplierData = async () => {
  try {
    const supplierData = await genericInstance({
      data: {
        query: `query {
          comboFill(tableName:"p_supplier", pkName:"p_supplier_id", identifier:"value, name, description, referenceno, p_supplier_category_id,(select name from p_supplier_category where p_supplier_category_id = p_supplier.p_supplier_category_id) as suppliercategory, gstno, p_pricelist_id,(select name from p_pricelist where p_pricelist_id = p_supplier.p_pricelist_id) as Pricelistname, (select istaxincluded from p_pricelist where p_pricelist_id = p_supplier.p_pricelist_id) as istaxincluded, islocalpurchase, p_supplierpaymentterms, taxid", whereClause:null)
      }`,
      },
    });
    return JSON.parse(supplierData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getSupplierAddress = async (supplierId) => {
  try {
    const supplierAddressData = await genericInstance({
      data: {
        query: `query {
          comboFill(tableName:"p_supplier_address", pkName:"p_supplier_address_id", identifier:"fulladdress", whereClause:"p_supplier_id='${supplierId}' ")
      }`,
      },
    });
    return JSON.parse(supplierAddressData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getFavouritesMenuList = async () => {
  try {
    const favouritesData = await genericInstance({
      data: {
        query: `query {getFavorites 
          {
            id,
            clientId,
            userId,
            menuId,
            menuName,
            type,
            url
          }
         }`,
      },
    });
    return favouritesData.data.data.getFavorites;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const removeFavouriteMenu = async (id) => {
  try {
    const removefavouritesData = await genericInstance({
      data: {
        query: `mutation {
            deleteCsFavorites (favoriteId : "${id}") {
            messageCode
            title
            message
            }}`,
      },
    });
    return removefavouritesData.data.data.deleteCsFavorites.message;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const removeView = async (id) => {
  try {
    const removeviewData = await genericInstance({
      data: {
        query: `mutation {
          removeView(viewId: "${id}" ) {
              messageCode
              title
              message
          }
      }`,
      },
    });
    return removeviewData;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const createFavouriteMenu = async (id, title, url, type, clientId) => {
  try {
    const createFavouriteMenuData = await genericInstance({
      data: {
        query: `mutation {upsertCsFavorites (csFavorites: {id:null
          clientId: "${clientId}"
          menuId : "${id}"
          menuName :"${title}"
          type:"${type}"
          url:"${url}"})
       {messageCode             
        title             
        message}}`,
      },
    });
    return createFavouriteMenuData.data.data.upsertCsFavorites.message;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

// shridhar

const getCustomUsersData = async () => {
  const getUsersData = await genericInstance({
    data: {
      query: `query {getUserList 
        {
      csBunitId
	  csClientId
	  csUserId
	  created
	  createdby
	  csWindowId
	  description
	  email
	  firstname
	  isactive
	  lastname
	  name
	  updated
	  updatedby
	  username
	  clientname
	  bunitname
      defaultCsRoleName
      defaultCsBunitName
      defaultCsRoleId
      defaultCsBunitId
        }
       }`,
    },
  });

  return getUsersData.data.data.getUserList;
};

const getUserAccess = async (userId) => {
  const getUsersData = await genericInstance({
    data: {
      query: `query {getUserAccess(userId:"${userId}")
    }`,
    },
  });

  return JSON.parse(getUsersData.data.data.getUserAccess);
};

const getUserRoleAccessTab = async (userId) => {
  const getUsersData = await genericInstance({
    data: {
      query: `query { comboFill(tableName:"cs_role", pkName:"cs_role_id", identifier:"name", whereClause:"isactive='Y'")
    }`,
    },
  });

  return JSON.parse(getUsersData.data.data.comboFill);
};

const getUsersBusinessUnit = async (userId) => {
  const getUsersData = await genericInstance({
    data: {
      query: `query {comboFill(tableName:"cs_bunit", pkName:"cs_bunit_id", identifier:"name", whereClause:"isactive='Y'") 
    }`,
    },
  });

  return JSON.parse(getUsersData.data.data.comboFill);
};

const getUsersDefaultBusinessUnit = async (userId) => {
  const getUsersData = await genericInstance({
    data: {
      query: `query {comboFill(tableName:"cs_user_bunit", pkName:"cs_bunit_trx_id", identifier:"(select name from cs_bunit where cs_bunit_id = cs_user_bunit.cs_bunit_trx_id)", whereClause:"isactive='Y' and cs_user_id = ${userId === undefined || userId === null ? null : `'${userId}'`
        } ")
    }`,
    },
  });

  return JSON.parse(getUsersData.data.data.comboFill);
};

const getUsersDefaultRole = async (userId) => {
  const getUsersData = await genericInstance({
    data: {
      query: `query {comboFill(tableName:"cs_user_access", pkName:"cs_role_id", identifier:"(select name from cs_role where cs_role_id = cs_user_access.cs_role_id)", whereClause:"isactive='Y' and cs_user_id = ${userId === undefined || userId === null ? null : `'${userId}'`
        } ") 
    }`,
    },
  });
  return JSON.parse(getUsersData.data.data.comboFill);
};

const getUsersHomeDashboard = async (userId) => {
  const getUsersData = await genericInstance({
    data: {
      query: `query {comboFill(tableName:"cs_report", pkName:"cs_report_id", identifier:"name", whereClause:"isactive='Y' and type='Dashboard'") 
    }`,
    },
  });

  return JSON.parse(getUsersData.data.data.comboFill);
};

const getUsersHomeReport = async (userId) => {
  const getUsersData = await genericInstance({
    data: {
      query: `query {comboFill(tableName:"cs_report", pkName:"cs_report_id", identifier:"name", whereClause:"isactive='Y' and type='Report'")  
    }`,
    },
  });

  return JSON.parse(getUsersData.data.data.comboFill);
};

const getUsersHomeWindow = async (userId) => {
  const getUsersData = await genericInstance({
    data: {
      query: `query {comboFill(tableName:"cs_window", pkName:"cs_window_id", identifier:"name", whereClause:"isactive='Y'")  
    }`,
    },
  });

  return JSON.parse(getUsersData.data.data.comboFill);
};

const saveNewUser = async (obj) => {
  const getUsersData = await genericInstance({
    data: {
      query: `mutation{upsertUserAccess(userJson:${obj})
      {messageCode   title    message data}}`,
    },
  });

  return getUsersData.data.data.upsertUserAccess;
};

const activeAdminRole = async (roleId) => {
  const enableRoles = await genericInstance({
    data: {
      query: `mutation{enableAdminRole(roleId:"${roleId}",isAdmin:"Y")
      {messageCode   title    message}
    }`,
    },
  });

  return enableRoles.data.data.enableAdminRole;
};

const enableActiveRole = async (roleId) => {
  const enableActiveViews = await genericInstance({
    data: {
      query: `mutation{enableActiveRole(roleId:"${roleId}",isActive:"N")
      {messageCode   title    message}
    }`,
    },
  });

  return enableActiveViews.data.data.enableActiveRole;
};

const enableAdminRole = async (roleId) => {
  const enableAdminViews = await genericInstance({
    data: {
      query: `mutation{enableAdminRole(roleId:"${roleId}",isAdmin:"N")
      {messageCode   title    message}
    }`,
    },
  });

  return enableAdminViews.data.data.enableAdminRole;
};

const enableRoleBaseOnActiveMode = async (roleId) => {
  const enableRoles = await genericInstance({
    data: {
      query: `mutation{enableActiveRole(roleId:"${roleId}",isActive:"Y")
      {messageCode   title    message}
    }`,
    },
  });

  return enableRoles.data.data.enableActiveRole;
};

const getCopyRoleGrid = async (id) => {
  const getCopyRoleGridData = await genericInstance({
    data: {
      query: `query {
        getRoleOption(isAdmin:"N", moduleIds:null, accessTo:null,roleId:"${id}")
       }`,
    },
  });

  return JSON.parse(getCopyRoleGridData.data.data.getRoleOption);
};

const getCustomRoleData = async () => {
  const getRolesData = await genericInstance({
    data: {
      query: `query {getRoleList 
        {
          name,
          csBunitId,
          csClientId,
          created,
          createdby,
          csRoleId,
          csWindowId,
          isactive,
          isadmin,
          updated,
          updatedby
        }
       }`,
    },
  });

  return getRolesData.data.data.getRoleList;
};

const getModuleAccessData = async (moduleIds, key) => {
  const getModuleDropdownDatas = await genericInstance({
    data: {
      query: `query {
        getRoleOption(isAdmin:"N",moduleIds:${moduleIds},accessTo:${key === null || key === undefined ? null : `"${key}"`})
       }`,
    },
  });

  return JSON.parse(getModuleDropdownDatas.data.data.getRoleOption);
};

const getModulesDropdownData = async () => {
  const getModuleDropdowndatas = await genericInstance({
    data: {
      query: `query {
        comboFill(tableName:"cs_module", pkName:"cs_module_id", identifier:"name", whereClause:"isactive='Y'")
       }`,
    },
  });

  return JSON.parse(getModuleDropdowndatas.data.data.comboFill);
};

const getRoleAccess = async (roleId, isAdmin) => {
  const getRolesData = await genericInstance({
    data: {
      query: `query {
        getRoleAccess(roleId:"${roleId}", isAdmin:"${isAdmin}")
       }`,
    },
  });

  return JSON.parse(getRolesData.data.data.getRoleAccess);
};

const getRolesFieldsAccess = async () => {
  const getRolesFieldsValues = await genericInstance({
    data: {
      query: `query {
        getRoleOption(isAdmin:"N")
       }`,
    },
  });

  return JSON.parse(getRolesFieldsValues.data.data.getRoleOption);
};

const getUsersFromRole = async (roleId) => {
  const getUsersFromRoleData = await genericInstance({
    data: {
      query: `query {
        getUsersFromRole(roleId:"${roleId}")
       }`,
    },
  });

  return JSON.parse(getUsersFromRoleData.data.data.getUsersFromRole);
};

const updateRoleAccess = async (roleAccess) => {
  const updateRoleAccess = await genericInstance({
    data: {
      query: `mutation{upsertRole(roleJson:${roleAccess})}`,
    },
  });

  return JSON.parse(updateRoleAccess.data.data.upsertRole);
};

const getSqlQuery = async (sqlData) => {
  const getSqlData = await genericInstance({
    data: {
      query: `mutation{
        sqlQueryTool(query:"${sqlData}"),
              }`,
    },
  });

  return JSON.parse(getSqlData.data.data.sqlQueryTool);
};

const getHistoryOfSqlQuery = async () => {
  const getSqQuerylData = await genericInstance({
    data: {
      query: `query{
        getSQLQueryLogs(transaction:"SQL Query Tool") {
          starttime
          query
        }
      }`,
    },
  });

  return getSqQuerylData.data.data.getSQLQueryLogs;
};

const getHistoryOfAdvanceSqlQuery = async () => {
  const getAdvanceSqlQuerylData = await genericInstance({
    data: {
      query: `query{
        getSQLQueryLogs(transaction:"Advance SQL Query Tool") {
          starttime
          query
        }
      }`,
    },
  });

  return getAdvanceSqlQuerylData.data.data.getSQLQueryLogs;
};

const getAdvanceSqlQuery = async (sqlData, isDml, remark) => {
  const getAdvanceSqlQuerylData = await genericInstance({
    data: {
      query: `mutation{
        advanceSQLQueryTool(query:"${sqlData}",isdml:"${isDml === true ? "Y" : "N"}", remark:"${remark === undefined ? null : remark}"),
              }`,
    },
  });

  return JSON.parse(getAdvanceSqlQuerylData.data.data.advanceSQLQueryTool);
};

const getComboFillForDashboard = async (dashboardId,dropdownId) => {
  try {
    const comboFillDataForDashboard = await genericInstance({
      data: {
        query: `query {
          dashboardComboFill(dashboardId:"${dashboardId}",filterId:"${dropdownId}" , limit:"100")
      }`,
      },
    });
    return JSON.parse(comboFillDataForDashboard.data.data.dashboardComboFill);
  } catch (error) {
    displayError(error);
    return null;
  }
};

const getCustomBusinessUnitForProfitLossStatement = async () => {
  try {
    const businessUnitData = await genericInstance({
      data: {
        query: `query {
          comboFill(tableName:"cs_bunit", pkName:"cs_bunit_id", identifier:"name", whereClause:"isactive='Y'" )
      }`,
      },
    });
    return JSON.parse(businessUnitData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getProfitLossStatementData = async (jsonToSend) => {
  try {
    const profitLossStatementData = await genericInstance({
      data: {
        query: `mutation {
          executeAPIBuilder(apiBuilderId:"61a91bfe8b9af31363d8c552", params:"${jsonToSend}")
        }`,
      },
    });
    return profitLossStatementData;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getCustomBusinessUnitForBalanceSheet = async () => {
  try {
    const businessUnitData = await genericInstance({
      data: {
        query: `query {
          comboFill(tableName:"cs_bunit", pkName:"cs_bunit_id", identifier:"name", whereClause:"isactive='Y'" )
      }`,
      },
    });
    return JSON.parse(businessUnitData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getBalanceSheetData = async (jsonToSend) => {
  try {
    const profitLossStatementData = await genericInstance({
      data: {
        query: `mutation {
          executeAPIBuilder(apiBuilderId:"61aa1844a0cba5069425b397", params:"${jsonToSend}")
        }`,
      },
    });
    return profitLossStatementData;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getAnnouncements = async () => {
  const getAnnouncemntsData = await genericInstance({
    data: {
      query: `query {getAnnouncement{
        csAnnouncementId
        title
        message
        priority
      }
       }`,
    },
  });
  return getAnnouncemntsData.data.data.getAnnouncement;
};

const getWarehouse = async (id) => {
  try {
    const warehouseData = await genericInstance({
      data: {
        query: `query {
          comboFill(tableName:"m_warehouse", pkName:"m_warehouse_id", identifier:"name", whereClause:"cs_bunit_id='${id}'")
       }`,
      },
    });
    return JSON.parse(warehouseData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getIssueingBusinessUnit = async () => {
  try {
    const issuebunitData = await genericInstance({
      data: {
        query: `query {
          comboFill(tableName:"m_warehouse", pkName:"m_warehouse_id", 
              identifier:"name,cs_client_id, cs_bunit_id, (select name from cs_bunit where cs_bunit_id = m_warehouse.cs_bunit_id) as bunit_name, (select cs_stidoctype_id from cs_bunit where cs_bunit_id = m_warehouse.cs_bunit_id) as cs_stidoctype_id, (select cs_strdoctype_id from cs_bunit where cs_bunit_id = m_warehouse.cs_bunit_id) as cs_strdoctype_id, isactive",
              whereClause: "isactive = 'Y'")
      }`,
      },
    });
    return JSON.parse(issuebunitData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getReceivingBusinessUnits = async () => {
  try {
    const receivingbunitData = await genericInstance({
      data: {
        query: `query {
          comboFill(tableName:"m_warehouse", pkName:"m_warehouse_id", 
              identifier:"name, cs_bunit_id, (select name from cs_bunit where cs_bunit_id = m_warehouse.cs_bunit_id) as bunit_name, (select cs_stidoctype_id from cs_bunit where cs_bunit_id = m_warehouse.cs_bunit_id) as cs_stidoctype_id, (select cs_strdoctype_id from cs_bunit where cs_bunit_id = m_warehouse.cs_bunit_id) as cs_strdoctype_id, isactive",
              whereClause: "isactive = 'Y'")
      }`,
      },
    });
    return JSON.parse(receivingbunitData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getRemarksList = async () => {
  try {
    const remarksListData = await genericInstance({
      data: {
        query: `query {
          comboFillMongo(collection:"nt_reference_list", primary_key:"value",iden:"name", search:"", whereClause:"nt_reference_name=Stock Transfer Issue Remarks")
      }`,
      },
    });
    return JSON.parse(remarksListData.data.data.comboFillMongo);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getSTIssueDocumentData = async (e) => {
  try {
    const getSTIssueDocument = await genericInstance({
      data: {
        query: `query {
          comboFill(tableName:"m_transferreceipt", pkName:"m_transferreceipt_id",
         identifier:"m_transferreceipt_id, m_transferissue_id, (select documentno from m_transferissue where m_transferissue_id = m_transferreceipt.m_transferissue_id) as issueno, docstatus"
        whereClause: "coalesce(docstatus, 'DR') = 'DR' and cs_bunit_id = '${e}'")
      }`,
      },
    });
    return JSON.parse(getSTIssueDocument.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getStDocumentProducts = async (e) => {
  try {
    const getSTIssueDocument = await genericInstance({
      data: {
        query: `query {getTabData(tabData:{ad_tab_id:"C744A90D6F654F7EAEEF34B6FD6A5260",
        startRow:"0",
        endRow:"99",
        parentTabId:"3E14F3E26D9D4AC8812D75779315D741",
        parentRecordID:"${e}"})
        {startRow,
        endRow,
        tableName,
        totalRows,
        records,
        messageCode,
        message}}`,
      },
    });
    return JSON.parse(getSTIssueDocument.data.data.getTabData.records);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return [];
  }
};

const getStReceiptBusinessunit = async () => {
  try {
    const getStReceiptBusinessunitData = await genericInstance({
      data: {
        query: `query {
          comboFill(tableName:"cs_bunit", pkName:"cs_bunit_id",
       identifier:"cs_bunit_id,cs_client_id, value,cs_sidoctype_id, cs_srdoctype_id,name,cwr_m_warehouse_id, isactive"
      whereClause: "isactive = 'Y'")
      }`,
      },
    });
    return JSON.parse(getStReceiptBusinessunitData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getWastageData = async () => {
  try {
    const getWastageTypeData = await genericInstance({
      data: {
        query: `query {
          comboFillMongo(collection:"nt_reference_list", primary_key:"value", iden:"name", search:"", whereClause:"nt_reference_name=Wastage Types")
      }`,
      },
    });
    return JSON.parse(getWastageTypeData.data.data.comboFillMongo);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getLoggedInUserRoles = async (UserId) => {
  try {
    const getLoggedInUserData = await genericInstance({
      data: {
        query: `query {comboFill(tableName:"cs_role", pkName:"cs_role_id", identifier:"name", whereClause:"cs_role_id in (select cs_role_id from cs_user_access where cs_user_id = '${UserId}')")}`,
      },
    });
    return JSON.parse(getLoggedInUserData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getLoggedInBusinessUnits = async (UserId) => {
  try {
    const getLoggedInBusinessData = await genericInstance({
      data: {
        query: `query {comboFill(tableName:"cs_bunit", pkName:"cs_bunit_id",identifier:"name", whereClause:"cs_bunit_id in (select cs_bunit_trx_id from cs_user_bunit where cs_user_id = '${UserId}')")}`,
      },
    });
    return JSON.parse(getLoggedInBusinessData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const updateRoles = async (roleId, bunitId) => {
  try {
    const updateRolesData = await genericInstance({
      data: {
        query: `mutation {
          updateRoleAndBunitId(roleId:"${roleId}", bunitId:"${bunitId}") {
              title, 
              messageCode, 
              message
          }
      }
      `,
      },
    });
    return updateRolesData.data.data.updateRoleAndBunitId;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getViews = async (id) => {
  try {
    const getViewsResponse = await genericInstance({
      data: {
        query: `query {
          getViews(windowId:"${id}") {
              id, 
              clientId, 
              userId, 
              windowId, 
              name, 
              isDefault, 
              filters, 
              hiddenFields, 
              gridProperties
          }
      }`,
      },
    });
    return getViewsResponse.data.data.getViews;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const upsertViews = async (user_id, client_id, ad_window_id, viewName, filters, recentID) => {
  try {
    const upsertViewsResponse = await genericInstance({
      data: {
        query: `mutation {
          upsertViews(csViews: {
              id:${recentID !== '1a2bb3ccc' ? `"${recentID}"` : null}, 
              clientId: "${client_id}", 
              userId: "${user_id}", 
              windowId: "${ad_window_id}", 
              name: "${viewName}", 
              isDefault: "N", 
              filters: "[${filters}]",
              hiddenFields: null,
              gridProperties: null  
          }) {
              messageCode
              title
              message
          }
      }`,
      },
    });
    return upsertViewsResponse;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getAllSupplier = async (bunitId) => {
  try {
    const supplierData = await genericInstance({
      data: {
        query: `query {
          comboFill(tableName:"p_supplier", pkName:"p_supplier_id", identifier:"value, name, description, referenceno, p_supplier_category_id,(select name from p_supplier_category where p_supplier_category_id = p_supplier.p_supplier_category_id) as suppliercategory, gstno, p_pricelist_id,(select name from p_pricelist where p_pricelist_id = p_supplier.p_pricelist_id) as Pricelistname, (select istaxincluded from p_pricelist where p_pricelist_id = p_supplier.p_pricelist_id) as istaxincluded,islocalpurchase, p_supplierpaymentterms, taxid", whereClause:"p_supplier_id in (select p_supplier_id from p_supplier_bunit where p_bunit_id = '${bunitId}')")
          }
      `,
      },
    });
    return JSON.parse(supplierData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getDefaultSupplier = async () => {
  try {
    const supplierData = await genericInstance({
      data: {
        query: `query {
          comboFill(tableName:"p_supplier", pkName:"p_supplier_id", identifier:"value, name, description, referenceno, p_supplier_category_id,(select name from p_supplier_category where p_supplier_category_id = p_supplier.p_supplier_category_id) as suppliercategory, gstno, p_pricelist_id,(select name from p_pricelist where p_pricelist_id = p_supplier.p_pricelist_id) as Pricelistname, (select istaxincluded from p_pricelist where p_pricelist_id = p_supplier.p_pricelist_id) as istaxincluded,(select p_bunit_id  from p_supplier_bunit where p_supplier_id= p_supplier.p_supplier_id limit 1) as bunit,islocalpurchase, p_supplierpaymentterms, taxid", whereClause:null)
          }
      `,
      },
    });
    return JSON.parse(supplierData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getGrnSuppliers = async (bunitId) => {
  try {
    const supplierData = await genericInstance({
      data: {
        query: `query {
          comboFill(tableName:"p_supplier", pkName:"p_supplier_id", identifier:"value, name, description, referenceno, p_supplier_category_id,(select name from p_supplier_category where p_supplier_category_id = p_supplier.p_supplier_category_id) as suppliercategory, gstno, p_pricelist_id,(select name from p_pricelist where p_pricelist_id = p_supplier.p_pricelist_id) as Pricelistname, (select istaxincluded from p_pricelist where p_pricelist_id = p_supplier.p_pricelist_id) as istaxincluded,islocalpurchase, p_supplierpaymentterms, taxid", whereClause:"p_supplier_id in (select p_supplier_id from p_supplier_bunit where p_bunit_id = '${bunitId}')")
          }
      `,
      },
    });
    return JSON.parse(supplierData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const deleteUserData = async (data) => {
  try {
    const supplierData = await genericInstance({
      data: {
        query: `mutation {
          deleteUser(csUserId:"${data[0]}") {
              title
              messageCode
              message
          }
      }
      `,
      },
    });
    return supplierData.data.data.deleteUser;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getAlerts = async () => {
  try {
    const supplierData = await genericInstance({
      data: {
        query: `query{getAlerts{
          csAlertId
          csBunitId
          title
          description
          level
          type
          isIsglobal
          csRoleId
          assignedTo
          isclosed
        }
         }
      `,
      },
    });
    return supplierData.data.data.getAlerts;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getPriorityData = async () => {
  try {
    const supplierData = await genericInstance({
      data: {
        query: `query{
          comboFillMongo(collection:"nt_reference_list", primary_key:"value", iden:"name"search:"", whereClause:"nt_reference_name=Announcement Priority")        }`,
      },
    });
    return JSON.parse(supplierData.data.data.comboFillMongo);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getAllusersData = async (clientId) => {
  try {
    const supplierData = await genericInstance({
      data: {
        query: `query{
          comboFill(tableName:"cs_user", pkName:"cs_user_id", identifier:"cs_user_id, name", whereClause:"cs_client_id = '${clientId}'")
          }`,
      },
    });
    return JSON.parse(supplierData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getTaskStatus = async () => {
  try {
    const supplierData = await genericInstance({
      data: {
        query: `query{
          comboFillMongo(collection:"nt_reference_list", primary_key:"value", iden:"name"search:"", whereClause:"nt_reference_name=Task Status")}`,
      },
    });
    return JSON.parse(supplierData.data.data.comboFillMongo);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const createTask = async (data) => {
  try {
    const supplierData = await genericInstance({
      data: {
        query: `mutation{
          upsertTask (csTask : {
            csTaskId :null,
            title :"${data.nTaskname}",
            description :"${data.nDescription}",
            dueDate :"${data.nDuedate}",
            assignedTo :"${data.nAssignee}",
            status :"${data.nStatus}",
            owner :"${data.nOwner}",
            remainderDate :"${data.nDate}",
            remainderTime :"${data.nTime}",
            csBunitId :"${data.Bu}",
            priority :"${data.nPriority}"
          }) {
            messageCode
            title
            message
          }}`,
      },
    });
    return supplierData.data.data.upsertTask;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getTaskData = async () => {
  try {
    const supplierData = await genericInstance({
      data: {
        query: `query {getTasks(date : "" status : "") {
          csTaskId,
          title,
          description,
          dueDate,
          assignedTo,
          status,
          owner,
          remainderDate,
          remainderTime,
          csBunitId,
          priority
        }}`,
      },
    });
    return supplierData.data.data.getTasks;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const deleteRoleAccessData = async (finalRoleAccess) => {
  try {
    const roleData = await genericInstance({
      data: {
        query: `mutation{deleteRoleAccess(roleJson:${finalRoleAccess})
        {
            title
            messageCode
            message
        }}`,
      },
    });
    return roleData.data.data.deleteRoleAccess;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getRequisitionTypeData = async (windowId,tabId) => {
  try {
    const roleData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7393",ad_tab_id:"A8A9443DD8454659B2C80BA0C8581249",ad_field_id:"3C5DC21C008644958846BF18A3B25150",searchField:"",
        )}`,
      },
    });
    return JSON.parse(roleData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getDocumentType = async () => {
  try {
    const documentData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7004",ad_tab_id:"270EED9D0E7F4C43B227FEDC44C5858F",ad_field_id:"5C0E5129CFC54DACAE4E4171502C7D76",searchField:"",
        )}`,
      },
    });
    return JSON.parse(documentData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getCustomerData = async () => {
  try {
    const customerData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7004",ad_tab_id:"270EED9D0E7F4C43B227FEDC44C5858F",ad_field_id:"8B2D0E4C5EBC4221862739BE6EC58B23",searchField:"",
      
        )}`,
      },
    });
    return JSON.parse(customerData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getFilterDropdownData = async (windowId,tabId,id, value, string) => {
  try {
    const filterData = await genericInstance({
      data: {
        query: `query { 
          filterDropdown(windowId:"${windowId}",ad_tab_id:"${tabId}",ad_field_id:"${id}", searchField:"${value !== null ? value : ""}",  jsonParam: ${string}, offset:"0", limit:"50")
        }`,
      },
    });
    return filterData.data.data.filterDropdown;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getPassWordChangeData = async (password, userid) => {
  try {
    const customerData = await genericInstance({
      data: {
        query: `mutation{resetUserPassword(csUserId:"${userid}",password:${(password === null) | (password === "null") || password === undefined ? null : `"${password}"`
          }) { messageCode, title, message}}`,
      },
    });
    return customerData.data.data.resetUserPassword;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

// Shaikh Gouse code for new sales order

const getOrderTypeData = async () => {
  try {
    const customerData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7004",ad_tab_id:"270EED9D0E7F4C43B227FEDC44C5858F",ad_field_id:"5C0E5129CFC54DACAE4E4171502C7D76",searchField:"",
        )}`,
      },
    });
    return JSON.parse(customerData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getNewSalesCustomerData = async () => {
  try {
    const orderTypeData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7004",ad_tab_id:"270EED9D0E7F4C43B227FEDC44C5858F",,ad_field_id:"8B2D0E4C5EBC4221862739BE6EC58B23",searchField:"",
        )}`,
      },
    });
    return JSON.parse(orderTypeData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getNewSalesPrice = async () => {
  try {
    const PriceData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7004",ad_tab_id:"270EED9D0E7F4C43B227FEDC44C5858F",ad_field_id:"8FB906277B1545B9B52F51F87CF8F89F",searchField:"",
        )}`,
      },
    });
    return JSON.parse(PriceData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getNewSalesRep = async () => {
  try {
    const SalesRepData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7004",ad_tab_id:"270EED9D0E7F4C43B227FEDC44C5858F",ad_field_id:"4BA5FBEFAAAA46CF98AA7DF1F3AB8E8C",searchField:"",
        )}`,
      },
    });
    return JSON.parse(SalesRepData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getCustomerAddressData = async (windowId,value) => {
  try {
    const autoCompleteResponse = await genericInstance({
      data: {
        query: `mutation {
          autoComplete(
            windowId:"${windowId}",
            ad_field_id: "8B2D0E4C5EBC4221862739BE6EC58B23"
            value: "${value}"
            ad_tab_id: "270EED9D0E7F4C43B227FEDC44C5858F"
            parentId: null
          )
        }`,
      },
    });
    return JSON.parse(autoCompleteResponse.data.data.autoComplete);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getOrderFormData = async () => {
  try {
    const orderFormData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7004",ad_tab_id:"270EED9D0E7F4C43B227FEDC44C5858F",ad_field_id:"773E31ECA6E648B88E16CD5BE076FDB6",searchField:"",
      
      
        )}`,
      },
    });
    return JSON.parse(orderFormData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getSalesTypeData = async () => {
  try {
    const SalesTypeData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7004",ad_tab_id:"270EED9D0E7F4C43B227FEDC44C5858F",ad_field_id:"27CF67E795E24673BD2786A93B65D3FC",searchField:"",

        )}`,
      },
    });
    return JSON.parse(SalesTypeData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getBunitData = async () => {
  try {
    const BunitData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7434",ad_tab_id:"B1CFDA3F558845BBB3B97F38E7E38069",ad_field_id:"DBF427E4E22A4095A08F64B22FB27ED9",searchField:"",
        )}`,
      },
    });
    return JSON.parse(BunitData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};
const getNewProductData = async () => {
  try {
    const productData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7434",ad_tab_id:"B1CFDA3F558845BBB3B97F38E7E38069",ad_field_id:"A22B086C1F7240E9B37EA399AF9B69E5",searchField:"",
        )}`,
      },
    });
    return JSON.parse(productData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getSubProductData = async (e) => {
  try {
    const subProductData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7434",ad_tab_id:"B1CFDA3F558845BBB3B97F38E7E38069",ad_field_id:"F21FCD2DDDE240A0A7405E10B731C97B",${e !== undefined ? `searchField: "${e}"` : `searchField: ""`}
        )}`,
      },
    });
    return JSON.parse(subProductData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getDesignedByData = async () => {
  try {
    const designedBy = await genericInstance({
      data: {
        query: `mutation { executeAPIBuilder(apiBuilderId:"6298af8f15898c586f981e6a", params: "{}")}`,
      },
    });
    return JSON.parse(designedBy.data.data.executeAPIBuilder);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getSketchRefData = async (name) => {
  try {
    const sketchRefData = await genericInstance({
      data: {
        query: `mutation { executeAPIBuilder(apiBuilderId:"62b2f299779ac00ef20ff772", params: "${name}")}`
      },
    });
    return JSON.parse(sketchRefData.data.data.executeAPIBuilder);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};


const getProcessParamComboFillField = async (fieldId, searchText) => {
  const processParamComboFillField = await genericInstance({
    data: {
      // eslint-disable-next-line
      query: `query {
        processParamComboFill(fieldId:"${fieldId}", search: null)
      }`,
    },
  });
  return processParamComboFillField;
};

// changes
const getProductCategoryData = async () => {
  try {
    const productCategoryData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7434",ad_tab_id:"B1CFDA3F558845BBB3B97F38E7E38069",ad_field_id:"0487BB2F586044CC926E5D0D75769CEF",searchField:"",
        )}`,
      },
    });
    return JSON.parse(productCategoryData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getCustomSalesOrderData = async (data) => {
  try {
    const customSalesOrderData = await genericInstance({
      data: {
        query: `mutation{ executeAPIBuilder(apiBuilderId:"626a1f806e639d20aba7cd16", params: "${data}")}`,
      },
    });
    return JSON.parse(customSalesOrderData.data.data.executeAPIBuilder);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getFKTableData = async () => {
  try {
    const fkTableData = await genericInstance({
      data: {
        query: `query {comboFillMongo(collection: "ad_table", primary_key: "_id", iden: "tablename", search: "", whereClause: ""
        )}`,
      },
    });
    return JSON.parse(fkTableData.data.data.comboFillMongo);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getFKIdentifierData = async (id) => {
  try {
    const fkIdentifierData = await genericInstance({
      data: {
        query: `query { comboFillMongo(collection: "ad_column", primary_key: "_id", iden: "columnname", search: "", whereClause: "ad_table_id=${id}"
        )}`,
      },
    });
    return JSON.parse(fkIdentifierData.data.data.comboFillMongo);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getFKPrimaryKeyData = async (id) => {
  try {
    const fkPrimaryKeyData = await genericInstance({
      data: {
        query: `query { comboFillMongo(collection: "ad_column", primary_key: "_id", iden: "columnname", search: "", whereClause: "ad_table_id=${id} && nt_base_reference_id=13"
        )}`,
      },
    });
    return JSON.parse(fkPrimaryKeyData.data.data.comboFillMongo);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getReferenceData = async () => {
  try {
    const referenceData = await genericInstance({
      data: {
        query: `query { comboFillMongo(collection: "nt_reference", primary_key: "nt_reference_id", iden: "name", search: "", whereClause: ""
        )}`,
      },
    });
    return JSON.parse(referenceData.data.data.comboFillMongo);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getModuleData = async () => {
  try {
    const moduleData = await genericInstance({
      data: {
        query: `query { comboFill(tableName: "cs_module", pkName: "cs_module_id", identifier: "name", whereClause: "isactive='Y'"
        )}`,
      },
    });
    return JSON.parse(moduleData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getDetailReportData = async () => {
  try {
    const detailReportData = await genericInstance({
      data: {
        query: `query { comboFill(tableName: "cs_report", pkName: "cs_report_id", identifier: "name", whereClause: "isactive='Y' And type='Report'"
        )}`,
      },
    });
    return JSON.parse(detailReportData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getDataSourceData = async () => {
  try {
    const dataSourceData = await genericInstance({
      data: {
        query: `query { comboFillMongo(collection: "nt_datasource", primary_key: "_id", iden: "name", search: "", whereClause: ""
        )}`,
      },
    });
    return JSON.parse(dataSourceData.data.data.comboFillMongo);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getFieldsDetailReportData = async () => {
  try {
    const fieldsDetailReportData = await genericInstance({
      data: {
        query: `query { comboFill(tableName: "cs_report", pkName: "cs_report_id", identifier: "name", whereClause: "isactive='Y' And type='Report'"
        )}`,
      },
    });
    return JSON.parse(fieldsDetailReportData.data.data.comboFill);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getFieldsReferenceData = async () => {
  try {
    const fieldsReferenceData = await genericInstance({
      data: {
        query: `query { comboFillMongo(collection: "nt_reference", primary_key: "nt_reference_id", iden: "name", search: "", whereClause: ""
        )}`,
      },
    });
    return JSON.parse(fieldsReferenceData.data.data.comboFillMongo);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getNavigationWindowData = async () => {
  try {
    const navigationWindowData = await genericInstance({
      data: {
        query: `query { comboFillMongo(collection: "ad_window", primary_key: "ad_window_id", iden: "name", search: "", whereClause: ""
        )}`,
      },
    });
    return JSON.parse(navigationWindowData.data.data.comboFillMongo);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getProfitLossReportData = async () => {
  try {
    const profitLossReportData = await genericInstance({
      data: {
        query: `mutation { executeAPIBuilder(apiBuilderId:"62951b400c49432ae0cf098e", params: "{}"
        )}`,
      },
    });
    return JSON.parse(profitLossReportData.data.data.executeAPIBuilder);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getFinanceData = async (jsonToSend) => {
  try {
    const financeData = await genericInstance({
      data: {
        query: `mutation { executeAPIBuilder(apiBuilderId:"61a91bfe8b9af31363d8c552", params:"${jsonToSend}"
        )}`,
      },
    });
    return JSON.parse(financeData.data.data.executeAPIBuilder);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getDesignerDetails = async () => {
  try {
    const designerDetails = await genericInstance({
      data: {
        query: `mutation { executeAPIBuilder(apiBuilderId:"6298af8f15898c586f981e6a", params: "{}")}`,
      },
    });
    return JSON.parse(designerDetails.data.data.executeAPIBuilder);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};


const getManageWorkRequest = async (id) => {
  try {
    const manageWorkRequest = await genericInstance({
      data: {
        query: `mutation { executeAPIBuilder(apiBuilderId:"6295a01c0c49432ae0cf0995", params: "${id}")}`,
      },
    });
    return JSON.parse(manageWorkRequest.data.data.executeAPIBuilder);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getUpdateProfilePassword = async (data) => {
  try {
    const getprofileData = await genericInstance({
      data: {
        query: `mutation {
          updateUserPassword(oldPassword: "${data.oldpass}", newPassword: "${data.newpass}", confirmPassword: "${data.confirmpass}") {
              messageCode
              title
              message
          }
      }`,
      },
    });

    return getprofileData.data.data.updateUserPassword;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const getWorkOrdersData = async (data) => {
  try {
    const workOrdersData = await genericInstance({
      data: {
        query: `mutation { executeAPIBuilder(apiBuilderId:"6283364e6a82541ba3a3d599", params: "${data}")}`,
      },
    });
    return JSON.parse(workOrdersData.data.data.executeAPIBuilder);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};


const getCustomerCategoryTypeData = async () => {
  try {
    const CustomerCategoryData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7436",ad_tab_id:"5225F9A973CF4A98BEAB281F336C786A",ad_field_id:"28ED822F160C41DD9E18805F502654AE",searchField:"",
        )}`,
      },
    });
    return JSON.parse(CustomerCategoryData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getCurrencyDropDownData = async () => {
  try {
    const currencyDropData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7008","ad_tab_id":"B85D12629BDE4E6BAE5001B357DF3567",ad_field_id:"9DA9E495F62F41959BE77685B5EB2B2C",searchField:"",      
        )}`,
      },
    });
    return JSON.parse(currencyDropData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getPaymentTermsDropDownData = async () => {
  try {
    const PaymentTermsData = await genericInstance({
      data: {
        query: `
        query {searchField(windowId:"7436",ad_tab_id:"B8A251A6D0734B5BBEB23F751FF4096F",ad_field_id:"E03130F1A82F47CDA504AA5F3897ECA7",searchField:"",
              )}`,
      },
    });
    return JSON.parse(PaymentTermsData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getStateDropDownData = async () => {
  try {
    const StateData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7436",ad_tab_id:"5225F9A973CF4A98BEAB281F336C786A",ad_field_id:"F0F3BD64EB8B4DEDB795E504936DCB50",searchField:"",  
        )}`,
      },
    });
    return JSON.parse(StateData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};


const getCountryDropDownData = async () => {
  try {
    const countryData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7436",ad_tab_id:"5225F9A973CF4A98BEAB281F336C786A",ad_field_id:"E925A10A829D4B2E8CCAD02F5ADB5B84",searchField:"",
        )}`,
      },
    });
    return JSON.parse(countryData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getkycStateDropDownData = async () => {
  try {
    const stateData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7436",ad_tab_id:"5225F9A973CF4A98BEAB281F336C786A",ad_field_id:"F0F3BD64EB8B4DEDB795E504936DCB50",searchField:"",  
        )}`,
      },
    });
    return JSON.parse(stateData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getkycCountryDropDownData = async () => {
  try {
    const countryKycData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7436",ad_tab_id:"5225F9A973CF4A98BEAB281F336C786A",ad_field_id:"E925A10A829D4B2E8CCAD02F5ADB5B84",searchField:"",
        )}`,
      },
    });
    return JSON.parse(countryKycData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getSalesRepDropDown = async () => {
  try {
    const salesRepData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7436",ad_tab_id:"BF2C54397ED2474EB64D8BBDC211D149",ad_field_id:"EC75721B0E7E461B8730D1BBC520385A",searchField:"",
        )}`,
      },
    });
    return JSON.parse(salesRepData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};


const getCreditPeriodDropDown = async () => {
  try {
    const CreditPeriodData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7436",ad_tab_id:"B8A251A6D0734B5BBEB23F751FF4096F",ad_field_id:"E03130F1A82F47CDA504AA5F3897ECA7",searchField:"",
        )}`,
      },
    });
    return JSON.parse(CreditPeriodData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getStateOutletDropDown = async () => {
  try {
    const stateOutLetData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7436",ad_tab_id:"5225F9A973CF4A98BEAB281F336C786A",ad_field_id:"F0F3BD64EB8B4DEDB795E504936DCB50",searchField:"",  
        )}`,
      },
    });
    return JSON.parse(stateOutLetData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};


const getCountryOutletDropDown = async () => {
  try {
    const countryOutLetData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7436",ad_tab_id:"5225F9A973CF4A98BEAB281F336C786A",ad_field_id:"E925A10A829D4B2E8CCAD02F5ADB5B84",searchField:"",
        )}`,
      },
    });
    return JSON.parse(countryOutLetData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getOutletSalesRepDropDown = async () => {
  try {
    const SalesRepOutLetData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7436",ad_tab_id:"BF2C54397ED2474EB64D8BBDC211D149",ad_field_id:"EC75721B0E7E461B8730D1BBC520385A",searchField:"",
      
        jsonParam: "{"dvn_pjmaster_id":"7A69CEAF6D9741FC96545781C997E827","cs_bunit_id":"0"}",
        )}`,
      },
    });

    return JSON.parse(SalesRepOutLetData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getInvoiceFormateDropDown = async () => {
  try {
    const InvoiceFormateDropData = await genericInstance({
      data: {
        query: `query {searchField(windowId:"7436",ad_tab_id:"B8A251A6D0734B5BBEB23F751FF4096F",ad_field_id:"345E8B6A316B404085CDB1B0CEF5ADEC",searchField:"",
        )}`,
      },
    });

    return JSON.parse(InvoiceFormateDropData.data.data.searchField);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};


const getTrialBalanceData = async (jsonToSend) => {
  try {
    const trialBalanceData = await genericInstance({
      data: {
        query: `mutation { executeAPIBuilder(apiBuilderId:"629d99cc15898c586f981fac", params:"${jsonToSend}"
        )}`,
      },
    });
    return JSON.parse(trialBalanceData.data.data.executeAPIBuilder);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getCustomerDetails = async (name) => {
  try {
    const customerDetails = await genericInstance({
      data: {
        query: `mutation {executeAPIBuilder(apiBuilderId:"62ab0f4cda917f5508c92c2b", params: "${name}")}`,
      },
    });
    return JSON.parse(customerDetails.data.data.executeAPIBuilder);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getReports = async () => {
  try {
    const reportsData = await genericInstance({
      data: {
        query: `query {
          getReports
      }`,
      },
    });
    return JSON.parse(reportsData.data.data.getReports);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getReportDetails = async (Id) => {
  try {
    const reportDetails = await genericInstance({
      data: {
        query: `query {
          getReportDetails(reportId: "${Id}")
      }`,
      },
    });
    return JSON.parse(reportDetails.data.data.getReportDetails);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const publishData = async (finalJson) => {
  try {
    const publishRespnse = await genericInstance({
      data: {
        query: `mutation {
          upsertReportDetails(reportStr: ${finalJson}) {
              messageCode
              title
              message
          }
      }`,
      },
    });
    return publishRespnse.data.data.upsertReportDetails;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getChildProductCategory = async (name) => {
  try {
    const childProductCategory = await genericInstance({
      data: {
        query: `mutation { executeAPIBuilder(apiBuilderId:"62b31227779ac00ef20ff77c", params: "${name}")}`,
      },
    });
    return JSON.parse(childProductCategory.data.data.executeAPIBuilder);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getSelectorDataFromApi = async(id,params) =>{
  try {
    const apiBuilderData = await genericInstance({
      data: {
        query: `mutation { executeAPIBuilder(apiBuilderId:"${id}", params: "${params}")}`,
      },   
    });
    return JSON.parse(apiBuilderData.data.data.executeAPIBuilder);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const getPrintTemplateForCustom = async (windowId,headerTabId, recordId) => {
  const printTemplateData = await genericInstance({
    
    data: {
      // eslint-disable-next-line
      query: `query {reportTemplate(windowId:"${windowId}",ad_tab_id:"${headerTabId}",recordId:"${recordId}")}`,
    }
  });
  return printTemplateData;
};

export {
  updateLocalToken,
  getUser,
  getComboFill,
  get360MenuList,
  getWindowDefinition,
  getTabData,
  getTabSummary,
  getsearchFieldData,
  upsertTabData,
  getWindowInitializationData,
  getAutoCompleteData,
  deleteTabRecord,
  getProcessParamComboFill,
  getRunProcess,
  getProcessParamData,
  getRunProcessWithoutParameters,
  getProcessParamJson,
  getPrintTemplate,
  getPrintDownloadData,
  deleteFileAttachment,
  getEmailData,
  sendEmailFun,
  getFilesData,
  getComboFillForReportIdAndValue,
  getComboFillForReportOnlyId,
  getUserPreferencesData,
  getGlobalParameters,
  getAdminMenuList,
  getComboFillForImport,
  importDefinitionService,
  downloadImportDataService,
  verifyAndImportService,
  getCustomBusinessUnit,
  getSupplierData,
  getSupplierAddress,
  getFavouritesMenuList,
  removeFavouriteMenu,
  removeView,
  createFavouriteMenu,
  getCustomUsersData,
  getUserAccess,
  getUserRoleAccessTab,
  getUsersBusinessUnit,
  getUsersDefaultBusinessUnit,
  getUsersDefaultRole,
  getUsersHomeDashboard,
  getUsersHomeReport,
  getUsersHomeWindow,
  saveNewUser,
  activeAdminRole,
  enableAdminRole,
  enableActiveRole,
  enableRoleBaseOnActiveMode,
  getCopyRoleGrid,
  getCustomRoleData,
  getModuleAccessData,
  getModulesDropdownData,
  getRoleAccess,
  getRolesFieldsAccess,
  getUsersFromRole,
  updateRoleAccess,
  getHistoryOfSqlQuery,
  getSqlQuery,
  getAdvanceSqlQuery,
  getHistoryOfAdvanceSqlQuery,
  getComboFillForDashboard,
  getProcessFormData,
  getCustomBusinessUnitForProfitLossStatement,
  getProfitLossStatementData,
  getCustomBusinessUnitForBalanceSheet,
  getBalanceSheetData,
  getAnnouncements,
  getWarehouse,
  getIssueingBusinessUnit,
  getReceivingBusinessUnits,
  getRemarksList,
  getSTIssueDocumentData,
  getStDocumentProducts,
  getStReceiptBusinessunit,
  getWastageData,
  getLoggedInUserRoles,
  getLoggedInBusinessUnits,
  updateRoles,
  getViews,
  upsertViews,
  getAllSupplier,
  getDefaultSupplier,
  getGrnSuppliers,
  deleteUserData,
  getAlerts,
  getPriorityData,
  getAllusersData,
  getTaskStatus,
  createTask,
  getTaskData,
  deleteRoleAccessData,
  getRequisitionTypeData,
  getDocumentType,
  getCustomerData,
  getFilterDropdownData,
  getPassWordChangeData,
  getOrderTypeData,
  getNewSalesCustomerData,
  getNewSalesPrice,
  getNewSalesRep,
  getCustomerAddressData,
  getOrderFormData,
  getSalesTypeData,
  getBunitData,
  getNewProductData,
  getDesignedByData,
  getSketchRefData,
  getAdminMenuListForDynamicLogos,
  getProcessParamComboFillField,
  getProductCategoryData,
  getSubProductData,
  getCustomSalesOrderData,
  getFKTableData,
  getFKIdentifierData,
  getFKPrimaryKeyData,
  getReferenceData,
  getModuleData,
  getDetailReportData,
  getDataSourceData,
  getFieldsDetailReportData,
  getFieldsReferenceData,
  getNavigationWindowData,
  getProfitLossReportData,
  getFinanceData,
  getDesignerDetails,
  getManageWorkRequest,
  getWorkOrdersData,
  getUpdateProfilePassword,
  getCustomerCategoryTypeData,
  getCurrencyDropDownData,
  getPaymentTermsDropDownData,
  getStateDropDownData,
  getCountryDropDownData,
  getkycStateDropDownData,
  getkycCountryDropDownData,
  getSalesRepDropDown,
  getCreditPeriodDropDown,
  getStateOutletDropDown,
  getCountryOutletDropDown,
  getOutletSalesRepDropDown,
  getInvoiceFormateDropDown,
  getTrialBalanceData,
  getCustomerDetails,
  getReports,
  getReportDetails,
  publishData,
  getChildProductCategory,
  getSelectorDataFromApi,
  getPrintTemplateForCustom
};