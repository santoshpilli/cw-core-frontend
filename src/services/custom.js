import axios from "axios";
// import { serverUrl } from "../constants/serverConfig";
import moment from 'moment'
import { generateToken } from "./generateToken";
import { getOAuthHeaders } from "../constants/oAuthValidation";

const serverUrl = process.env.REACT_APP_serverUrl;
let localToken;
let appId;
const { access_token } = getOAuthHeaders();
const customInstance = axios.create();
customInstance.defaults.baseURL = serverUrl;
customInstance.defaults.method = "POST";
customInstance.defaults.headers.post["Content-Type"] = "application/json";

const updateCustomLocalToken = () => {
  localToken = JSON.parse(localStorage.getItem("authTokens"));
};

const updateAppid = () => {
  appId = localStorage.getItem("appId");
};

customInstance.interceptors.request.use(
  (config) => {
    if (!localToken) {
      updateCustomLocalToken();
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

customInstance.interceptors.response.use(
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

const getDeliveryLocation = async (e) => {
  try {
    const deliveryData = await customInstance({
      data: {
        query: `query {
            getDeliveryLocations (bUnitId : "${e}")
        }`,
      },
    });
    return JSON.parse(deliveryData.data.data.getDeliveryLocations);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getSupplierProduct = async (supplierId, bunitId, appConfig) => {
  const priceFlag = appConfig.basePriceCalc;
  try {
    const supplierProductData = await customInstance({
      data: {
        query: `query {
            getSupplierProduct1(supplierId : "${supplierId}",bUnitId : "${bunitId}") {
              supplierProductId
              clientId
              clientName
              bUnitId
              bUnitName
              supplierId
              supplierName
              productId
              productName
              productCode
              qtyOnHand
              uomId
              uomName
              productCategoryId
              productcategoryName
              taxCategoryId
              taxCategoryName
              taxId
              taxName
              taxRate
              priceStd
              actualCostPrice
              priceList
              twoWeekSale
              fourWeekSale
              upc
              description
              istaxincluded
              batchedProduct
              salePrice
              restrictMargin
              alternateUomList 
                  { alternateUomId uomId uomName }
              margin
          }
        }`,
      },
    });
    const data = supplierProductData.data.data.getSupplierProduct1;
    const tempArray = [];
    for (let index = 0; index < data.length; index++) {
      const actualCostPrice = data[index].actualCostPrice === null || data[index].actualCostPrice === undefined  ? 0 : parseFloat(data[index].actualCostPrice).toFixed(2)
      const obj = {
        productCategoryName: data[index].productcategoryName,
        name: data[index].productName,
        actualCostPrice: data[index].actualCostPrice,
        description: data[index].description,
        twoWeekSale: data[index].twoWeekSale,
        qtyOnHand: data[index].qtyOnHand,
        productId: data[index].productId,
        key: data[index].productId,
        uomName: data[index].uomName,
        uomId: data[index].uomId,
        priceList: data[index].priceList,
        priceStd: priceFlag === "Actual Cost Price" ? actualCostPrice : data[index].priceStd,
        unitPrice: priceFlag === "Actual Cost Price" ? actualCostPrice : data[index].priceStd,
        netUnitPrice: priceFlag === "Actual Cost Price" ? actualCostPrice : data[index].priceStd,
        unitPrice1: priceFlag === "Actual Cost Price" ? actualCostPrice : data[index].priceStd,
        priceList1: data[index].priceList,
        priceStd1: priceFlag === "Actual Cost Price" ? actualCostPrice : data[index].priceStd,
        priceStd2: priceFlag === "Actual Cost Price" ? actualCostPrice : data[index].priceStd,
        taxId: data[index].taxId,
        value: data[index].productCode,
        responseMargin: data[index].margin,
        upc: data[index].upc,
        taxName: data[index].taxName,
        taxRate: data[index].taxRate,
        salePrice: data[index].salePrice,
        batchedProduct: data[index].batchedProduct,
        restrictMargin: data[index].restrictMargin,
        skuName: data[index].productCode + "-" + data[index].productName,
      };
      tempArray.push(obj);
    }
    return tempArray;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getLandedCostData = async () => {
  try {
    const deliveryData = await customInstance({
      data: {
        query: `query{
          getLctype{
              pLcTypeId
              key
              name
              product{
                  mProductId
                  name
              }
              csTaxId
              calcMethod
          }
      }`,
      },
    });
    return deliveryData.data.data.getLctype;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getInventoryProduct = async (bunitId, mWarehousId) => {
  try {
    const inventoryProductData = await customInstance({
      data: {
        query: `query{ getInventoryProduct(bUnit:"${bunitId}", warehouseId:"${mWarehousId}"){
          mProductId
          value
          name 
          upc
          csUomId
          uomName 
          }
          }`,
      },
    });
    return inventoryProductData.data.data.getInventoryProduct;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getStockCountProduct = async (bunitId, mWarehousId) => {
  try {
    const inventoryProductData = await customInstance({
      data: {
        query: `query{ getStockCount(bUnit:"${bunitId}", warehouseId:"${mWarehousId}"){
          mProductId
          value
          name 
          upc
          csUomId
          uomName
          batchedForStock
          mBatch{
              mBatchId
              batchno
              startdate
              enddate
          }    
          }
          }`,
      },
    });
    return inventoryProductData.data.data.getStockCount;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getgetAgents = async (bunitId) => {
  try {
    const agentsData = await customInstance({
      data: {
        query: `query{
          getAgent (bUnitId:null)
          {
                  agentId
                  name
          }
          }`,
      },
    });
    return agentsData.data.data.getAgent;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getApparelProducts = async (value, bunitId, supplierId) => {
  try {
    const apparelData = await customInstance({
      data: {
        query: `query{
          getApparelProduct(productName:"${value}",
          bUnitId:"${bunitId}",supplierId:"${supplierId}"){
            mProductId 
            value         
            name            
            description 
            brandId
            brandName
            hsnCodeId
            hsnName         
            uom{
               csUomId
               name
           }
           productCategory{
               mProductCategoryId         
               name  
           }               
           taxCategory{
              csTaxcategoryID
              name
              overRideTax
              overRideCondition
              contraTaxCategoryId
              contraTaxCategory
              {
              contraTaxCategoryName
              contraTaxId
              contraTaxName
              contraRate
              }
           }        
           taxRate{
               csTaxID
               name
               rate
           } 
           pPriceList{
               pPriceListID
               name
               isTaxIncluded
               isDefault
           }             
       }
      }`,
      },
    });
    return apparelData.data.data.getApparelProduct;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getSpecificApparelProduct = async (value, bunitId, supplierId) => {
  try {
    const apparelData = await customInstance({
      data: {
        query: `query{
          getApparelProduct(productName:"${value}",
          bUnitId:"${bunitId}",supplierId:"${supplierId}"){
            mProductId 
            value         
            name            
            description 
            brandId
            brandName
            hsnCodeId
            hsnName         
            uom{
               csUomId
               name
           }
           productCategory{
               mProductCategoryId         
               name  
           }               
           taxCategory{
            csTaxcategoryID
            name
            overRideTax
            overRideCondition
            contraTaxCategoryId
            contraTaxCategory
            {
            contraTaxCategoryName
            contraTaxId
            contraTaxName
            contraRate
            }
           }        
           taxRate{
               csTaxID
               name
               rate
           } 
           pPriceList{
               pPriceListID
               name
               isTaxIncluded
               isDefault
           }             
       }
      }`,
      },
    });
    return apparelData.data.data.getApparelProduct;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getDraftPoDocs = async (supplierId, bunitId) => {
  try {
    const draftProductData = await customInstance({
      data: {
        query: `query {     
          getDraftPO(bUnitId : "${bunitId}" supplierId : "${supplierId}") {         
              orderId         
              docNo         
          } 
      }`,
      },
    });
    return draftProductData.data.data.getDraftPO;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getDraftpoProducts = async (bunitId, supplierId, e) => {
  try {
    const draftProductData = await customInstance({
      data: {
        query: `query {       
          getDraftOrderLines (bunitId : "${bunitId}" supplierId: "${supplierId}" orderIds: ["${e}"])
          {         
              orderLineId        
              orderId         
              documentNo         
              line         
              productId         
              productSearchKey         
              productName         
              uomId         
              uomName         
              orderedQty         
              description         
              receivedqty         
              stockUomId         
              stockUomIdName         
              stockQty         
              unitPrice         
              listPrice         
              pofreeqty         
              discountvalue         
              discountapplicable         
              discounttype       
              totaldiscount
              batchedProduct
              shelfLife
              netStd
              grossStd
              salePrice
              upc
              pCategoryName
              margin
              marginStd
              restrictMargin
              actualCostPrice
              taxRate{
                  csTaxID
                  name
                  rate
              }
          }   
      }`,
      },
    });
    return draftProductData.data.data.getDraftOrderLines;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getStockAllocationData = async (bUnitId, warehouseId) => {
  try {
    const stockAllocationData = await customInstance({
      data: {
        query: `query{ getSTOpenOrders(bUnitId:"${bUnitId}",warehouseId:"${warehouseId}")
        {       mProductId
                name    
                value
                uom{
                    csUomId
                    name
                }
                qty
                qtyOnHand
                stockTransferOrder{
                    stockTransferOrderId
                    stockTransferOrderLineId
                    cSBunitID
                    bUnitName
                    qty
                }
            }
        }`,
      },
    });
    return stockAllocationData;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getConfirmDataForStockAllocation = async (order) => {
  try {
    const confirmData = await customInstance({
      data: {
        query: `mutation {
          confirmSTOrder(stOrder: {
            order : [${order}]
          })        
          {
              status
              message
          } 
      }`,
      },
    });
    return confirmData;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getRoleBusinessUnit = async (userId) => {
  try {
    const buData = await customInstance({
      data: {
        query: `query {
          getroleBunit(userId : "${userId}")
          {
              csUserId
              defaultCsRoleId
              roleName
              defaultCsBunitId
              bUnitName
            isLocalPurchase
              userBunit{
                  csUserId
                  csBunitId
                  bUnitName
                  isLocalPurchase
              }
        }    
        }`,
      },
    });
    return buData.data.data.getroleBunit;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getSupplierCategory = async () => {
  try {
    const supplierCategoryData = await customInstance({
      data: {
        query: `query{
          getSupplierCategory(bunitId:"0"){
            pSupplierCategoryId
            value
            name
          }
          
        }`,
      },
    });
    return supplierCategoryData.data.data.getSupplierCategory;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getSupplierRegion = async (clientId) => {
  try {
    const supplierRegionData = await customInstance({
      data: {
        query: `query{
          getRegion(clientId:"${clientId}"){
            csRegionID
            value
            name
          }  
        }`,
      },
    });
    return supplierRegionData.data.data.getRegion;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getTaxCategory = async (clientId) => {
  try {
    const taxCategoryData = await customInstance({
      data: {
        query: `query{
          getTaxCategory(clientId:"${clientId}"){
            csTaxcategoryID
            description
            name
          }  
        }`,
      },
    });
    return taxCategoryData.data.data.getTaxCategory;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getBrand = async (clientId) => {
  try {
    const brandData = await customInstance({
      data: {
        query: `query{
          getBrand(clientId:"${clientId}"){
            brandId
            name
            value
          }  
        }`,
      },
    });
    return brandData.data.data.getBrand;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getProductCategory = async () => {
  try {
    const productCategoryData = await customInstance({
      data: {
        query: `query{
          getProductCategory(tillId:null){
              mProductCategoryId
              name
              value
              description
              imageurl
              parentCategory{
                  mProductCategoryId
                  name
                  value
                  description
                  imageurl
                  parentCategory{
                      mProductCategoryId
                      name
                      value
                      description
                      imageurl
                      parentCategory{
                          mProductCategoryId
                          name
                          value
                          description
                          imageurl
                          parentCategory{
                              mProductCategoryId
                              name
                              value
                              description
                              imageurl
                          }
                      }
                  }
              }
          }
      }`,
      },
    });
    return productCategoryData.data.data.getProductCategory;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getUOM = async (clientId) => {
  try {
    const uomData = await customInstance({
      data: {
        query: `query{
          getUom(clientId:"${clientId}"){
            csUomId
            ediCode
            name
          }  
        }`,
      },
    });
    return uomData.data.data.getUom;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getPoOrderLineProducts = async (e, bunitId, supplierId) => {
  try {
    const pOrderLineProducts = await customInstance({
      data: {
        query: `query {
          getOpenOrderLines (bunitId : "${bunitId}"
          supplierId : "${supplierId}"
          orderIds : ${e === "" ? null : `["${e}"]`}
          date : null) {
          orderLineId
          orderId         
          documentNo         
          line         
          productId         
          productSearchKey         
          productName         
          uomId         
          uomName         
          orderedQty         
          description         
          receivedqty         
          stockUomId         
          stockUomIdName         
          stockQty         
          unitPrice         
          listPrice         
          pofreeqty         
          discountvalue         
          discountapplicable         
          discounttype       
          totaldiscount
          batchedProduct
          shelfLife
          salePrice
          taxRate{
              csTaxID
              name
              rate
          }
          }
      }`,
      },
    });
    return pOrderLineProducts.data.data.getOpenOrderLines;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getPurchaseOrderDocData = async (bunitId, supplierId) => {
  try {
    const purchaseOrderDocData = await customInstance({
      data: {
        query: `query {
          getOpenPO(bUnitId : ${bunitId === "" ? null : `"${bunitId}"`} supplierId : ${supplierId === "" ? null : `"${supplierId}"`}) {
        orderId         
        docNo         
        dateOrdered         
        supplierId         
        supplierIdName         
        bUnitLocationId         
        bUnitId         
        bUnitIdName         
        islocalpurchase   
        totalNetAmount  
        totalGrossAmount 
          }
      }`,
      },
    });
    return purchaseOrderDocData.data.data.getOpenPO;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};
const getSupplierProductsList = async (e,bunitId) => {
  try {
    const SupplierProducts = await customInstance({
      data: {
        query: `query {
          getSupplierProduct1(supplierId : "${e}",bUnitId : "${bunitId}"
          sku : null
          upc : null) {
              supplierProductId
              clientId
              clientName
              bUnitId
              bUnitName
              supplierId
              supplierName
              productId
              productName
              productCode
              qtyOnHand
              uomId
              uomName
              productCategoryId
              productcategoryName
              taxCategoryId
              taxCategoryName
              taxId
              taxName
              taxRate
              priceStd
              priceList
              twoWeekSale
              fourWeekSale
              upc
              description
              batchedProduct
              actualCostPrice
              salePrice
              restrictMargin
              alternateUomList 
                  { alternateUomId uomId uomName }
              margin
          }     
        }`,
      },
    });
    return SupplierProducts.data.data.getSupplierProduct1;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getPoDocs = async (supplierId, bunitId) => {
  try {
    const SupplierProducts = await customInstance({
      data: {
        query: `query {     
          getPO(bUnitId : "${bunitId}" ,supplierId : "${supplierId}") 
          {         
          orderId         
          docNo         
          dateOrdered         
          supplierId         
          supplierIdName         
          bUnitLocationId         
          bUnitId         
          bUnitIdName         
          islocalpurchase   
          totalNetAmount  
          totalGrossAmount  
          } 
          }`,
      },
    });
    return SupplierProducts.data.data.getPO;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getpoLineProducts = async (bunitId, supplierId, e) => {
  try {
    const SupplierProducts = await customInstance({
      data: {
        query: `query {       
          getPoLines (bunitId : "${bunitId}" supplierId: "${supplierId}" orderIds: ["${e}"] date: null, sku:null upc:null) 
              {   
              orderLineId        
              orderId         
              documentNo         
              line         
              productId         
              productSearchKey         
              productName         
              uomId         
              uomName         
              orderedQty         
              description         
              receivedqty         
              stockUomId         
              stockUomIdName         
              stockQty         
              unitPrice         
              listPrice         
              batchedProduct
              upc 
              salePrice
              taxRate{
                  csTaxID
                  name
                  rate
              }
          }   
      }`,
      },
    });
    return SupplierProducts.data.data.getPoLines;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getReturnReasons = async (clientId) => {
  try {
    const returnreasonData = await customInstance({
      data: {
        query: `query{
          getReturnReason(clientId:"${clientId}"){
            returnReasonId
            name    
          }  
        }`,
      },
    });
    return returnreasonData.data.data.getReturnReason;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getPendingRequisition = async (bunit, doctype) => {
  try {
    const returnreasonData = await customInstance({
      data: {
        query: `query { getPendingRequisition(bUnitId: "${bunit}",documentType: "${doctype}")
        {
          purchaseRequistionId
          csBUnit{
              csBunitId                                   
              name
              }
              documentNo
              requistionDate
              requiredDate
              description
              sOrderId
              sDocumentNo
              sCustomerId
              sCustomerName
              requisitionType{
              typeId
              name
              }
       csUser {
                  csUserId                        
                   username
                  }
        
           requisitionLines{
                     prequestlineId                
                     product {
                             mProductId                 
                             name
                             value
                             description
                             imageurl
                             isManual
                             shortDescription
                             salePrice
                             listPrice
                             purchasePrice
                             costPrice
                             }
                        uom {
                            csUomId                                  
                            name
                            }                       
                         mProduct{
                              mProductCategoryId  
                                 name
                                 value
                                }
                         description
                         requiredQty
                         estimatedPrice
                         estimatedtotal
                         sOrderQty
                         sOrderLineId
                         openReqQty
                         channelName
                         channelId
                         stockAllocatedQty
                         pendingRequisitionQty
                         orderFulfilledQty
                          tax
                              {
                               csTaxID                            
                               name
                               rate
                              }
                         
                          }
                      supplierProduct{
                      productId
                      supplierId
                      supplierName
                      lastPurchasePrice
                      minOrderQty
                      supplierProductId
                      }   
                      attribute {
                        name
                        value
                        mAttributeId
                        mProductAttributeId
                      }      
        }
      }`,
      },
    });
    return returnreasonData.data.data.getPendingRequisition;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getPendingSalesOrders = async (bUnitId, documentTypeId, customerId) => {
  try {
    const pendingSalesOrder = await customInstance({
      data: {
        query: `query {
          getPendingSalesOrders(bUnitId: "${bUnitId}",documentType: "${documentTypeId}", customerId: ${customerId === null ? null : `"${customerId}"`})
          {
            sOrderID
            csBUnit{
                csBunitId                                 
                name
                }
                documentno
                dateordered
                datepromised
                description
         salesRep{ 
              salesRepresentId                                
               name
               }
            customer{
                    sCustomerID                            
                    name
                    }
             salesOrderLines{
                  sOrderlineID                
                  product {
                               mProductId                              
                               name
                               value
                               description
                               imageurl
                      
                               }
                          uom {
                              csUomId                                   
                              name
                              }                       
                           mProduct{
                                   mProductCategoryId                       
                                   name
                                   value
                                  }
                           description
                           qty       
                           stockqty       
                           requiredQty     
                           deliveredQty
                           reservedQty
                           isReserved  
                           actualQty
                           cwcChannelId
                           channelName
                           designStatus
                            tax
                                {
                                 csTaxID                                
                                 name
                                 rate
                                }
                           
        }
        sordersubproducts {
                                       sOrderLineAddonsId
                                       sOrderLineId
                                       name
                                       product {
                                                mProductId
                                                name
                                                value
                                       description
                                       imageurl
                              
                                       }
                                  uom {
                                      csUomId                                   
                                      name
                                      }                       
                                   mProduct{
                                           mProductCategoryId                       
                                           name
                                           value
                                          }
                                   qty     
                                   price  
                                   stockQty       
                                   requiredQty      
                                    tax
                                        {
                                         csTaxID                                
                                         name
                                         rate
                                        }
  }
     }
    }
    
    `,
      },
    });
    return pendingSalesOrder.data.data.getPendingSalesOrders;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getUIDStocks = async (id) => {
  try {
    const UIDStockData = await customInstance({
      data: {
        query:`
      query{
        getUIDStock(productId:"${id}",batchNo:null){
         cSBunitID
         bunitName
         cSClientID
         clientName
         createdby
         reservedQty
         csUomId
         uomName
         isactive
         mProductId
         productName
         value
         mStockID
         mStoragebinID
         storagebinName
         qtyonhand
         updatedby
         mBatchId
         batchNo
        }  
      }
      `
      },
    });
    return UIDStockData.data.data.getUIDStock;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getUIDStocks1 = async (id) => {
  try {
    const UIDStockData = await customInstance({
      data: {
        query:`
        query{
          getUIDStock1(sOrderLineId:"${id}" )  
           {
               mProductId
                 cSBunitID
                 bunitName
                 cSClientID
               clientName
                createdby
                 csUomId
                 uomName
                 isactive
               productName
                value
                 mStockID
               mStoragebinID
            storagebinName
              qtyonhand
               updatedby
                mBatchId
                 batchNo
                 reservedQty
                 attributes {
                   name
                   value
                  mAttributeId
                  mProductAttributeId
               }
          }  
        }
      `
      },
    });
    return UIDStockData.data.data.getUIDStock1;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getIssueTypeData = async () => {
  try {
    const getIssueType1 = await customInstance({
      data: {
        query: `query { getIssueType(mIssueTypeId : null){
          mIssueTypeId
          name
          type
          csDocTypeId
          qualityRequired
          autoReceive
      }
      }`,
      },
    });
    return getIssueType1.data.data.getIssueType;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getAppSetupData = async (val) => {
  try {
    const getAppSetup = await customInstance({
      data: {
        query: `query{
          getAppSetup(application:"${val}")
          {
              appSetupId
              application
              configJson
          }
        }`,
      },
    });
    return getAppSetup.data.data.getAppSetup;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getSoProductData = async (key) => {
  try {
    const soProducts = await customInstance({
      data: {
        query: `query{
          getSoProduct(searchKey:"${key}", limit :100 ,from: 0 ){
              mProductId
              name
              value
              uom{
                  csUomId
                  name
              }
              imageurl
              batchedProduct
              mBatchGroupId
              mBatchGroupName
              mProductGroupId
              mProductGroupName
              brandId
              brandName
              description
              shortDescription
              taxCategory{
                  csTaxcategoryID
                  name
              }
              costPrice
              listPrice
              salePrice
              purchasePrice
              pSupplierId
              pSupplierName
              taxRate{
                  csTaxID
                  name
                  rate
              }
              productCategory{
                  mProductCategoryId
                  name
              }
              productAddons{
                  mProductAddOnId
                  name
                  price
                  mAddonGroup{
                      mAddonGroupId
                      name
                      minqty
                      maxqty
                  }
                   productAttributes{
                  mProductAttributeId
                  name
                  value
                  mProductAddonId
              }
              }
          }
        }`,
      },
    });
    return soProducts.data.data.getSoProduct;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getAddonProductData = async (id) => {
  try {
    const addOnProducts = await customInstance({
      data: {
        query: `query{
          getAddOnProduct1(productId:"${id}"){
               plmDesignId
               imageurl
               name
               designCode
        designs{
                mAttributeId
                name
                value
                lineAttributeId
                mAttributeGroupId
                groupName
                varient
         }
         metaLines{
          key
          value
          plmDesignMetaId
      }
          }  
        }`,
      },
    });

    return addOnProducts.data.data.getAddOnProduct1;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getPriceListData = async (id) => {
  try {
    const PriceList = await customInstance({
      data: {
        query: `query {
          getSalesPriceList (cSClientID :"${id}") {
             sPricelistID
              name
          }
        }`,
      },
    });

    return PriceList.data.data.getSalesPriceList;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};
const getProductCategoryAttribute = async (userId) => {
  try {
    const productData = await customInstance({
      data: {
        query: `query{
          getProductCategoryAttributes(categoryId:"${userId}"){
            designAttributeId
            value
            type
            name
            varient
          }  
        }`,
      },
    });
    return productData.data.data.getProductCategoryAttributes;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};
const getDesignDetails = async (id) => {
  try {
    const productData = await customInstance({
      data: {
        query: `query{
          getDesignDetails(designId:"${id}"){
            plmDesignId
            designcode
            designName
            bunitId
             image
           description
           designedBy
           sketchId
           subProduct
           product
           productCategory
           categoryName
           bunitName
           productName
           subProductName
           sketchName
           disignerName
           isActive
            attributes {
                designAttributeId
                value
                varient
                type
                name
                lineAttributeId
                referenceValue
            }
            metaLines {
              key
              value
              plmDesignMetaId
           }
          }  
        }`,
      },
    });
    return productData.data.data.getDesignDetails;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getDesign = async (key,startRow,limit) => {
  try {
    const designData = await customInstance({
      data: {
        query: `query{
          getDesign(startRow: "0",limit: "${limit}",searchKey:"${key}"){
            plmDesignId
            designcode
            designName
            bunitId
             image
           description
           designedBy
           sketchId
           subProduct
           product
           bunitName
           productName
           subProductName
           sketchName
           disignerName
           
          }  
        }`,
      },
    });
    return designData.data.data.getDesign;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getVarients = async (id) => {
  try {
    const varientData = await customInstance({
      data: {
        query: `query{
  getDesignVarient(designId:"${id}"){
    plmDesignId
    bunitId
    bunitName
     image
   description
   designStatus
   plmDesignVarientId
   name
   variantObject
    attributes {
        designAttributeId
        name
        value
        lineAttributeId
    }
    metaVariants {
      plmDesignMetaVariantId
      key
      value
  }
  }  
}`,
      },
    });
    return varientData.data.data.getDesignVarient;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getGRNdocs = async (supplierId, bunitId) => {
  try {
    const SupplierProducts = await customInstance({
      data: {
        query: `query{
          getGRN(supplierId:"${supplierId}",bunitId: "${bunitId}"){
            mReceiptId
            pSupplierId
            pSupplierName
            csbUnit {
                 csBunitId
                 name
            }
            documentNo
            date
            pOrderId
          }  
        }`,
      },
    });
    return SupplierProducts.data.data.getGRN;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getGRNLineProducts = async (e) => {
  try {
    const SupplierProducts = await customInstance({
      data: {
        query: `query{
          getGRNLines(mReceiptId:"${e}") {
              receiptLineId
              mProduct{
                  mProductId
                  name
                  value
                  upc
              }
              csuom{
                  csUomId
                  name
              }
              receivedQty
              batchId
              batchNo
              startDate
              endDate
              orderLineId
              stockUomId
              stockUomName
              taxRate{
                  csTaxID
                  name
                  rate
              }
              unitprice
              listprice
              salePrice
          }
      }`,
      },
    });
    return SupplierProducts.data.data.getGRNLines;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }

}


const getSalesOrderDetailsData = async (recordId) => {
  try {
    const salesOrderDetails = await customInstance({
      data: {
        query: `query { getSalesOrderDetails(sOrderId: "${recordId}")
        {
          sOrderID
              csDoctypeId
              sPricelistId
              sCustomerId
              salesRepID
              cwrSaletypeId
              dateordered
              datepromised
              channelId
              documentno
              sCustomerAddressId
              docTypeName
              priceListName
              salesRepName
              saleTypeName
              channelName
              address
              customerName
           line{
                     sOrderlineID                                 
                         csUomId
                         mProductId
                         csTaxId
                         qty
                         unitprice
                         listprice
                         stockqty
                         returnQty
                         mBatchId
                         productName
                         taxName
                         uomName
                          addons
                              {
                               sOrderLineAddonsId                            
                               name
                               qty
                               price
                              }
                         
                          } 
              sordersubproducts{
                  key
                  value
                  sOrderMetaId
              }            
        }
      }
`,
      },
    });
    return salesOrderDetails.data.data.getSalesOrderDetails;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }

}



const getCustomerInfoTabData = async (pjMasterId) => {
  try {
    const customertab= await customInstance({
      data: {
        query: `query {
          getPjMaster(
            pjmasterId:${pjMasterId === null || pjMasterId ===undefined ? null:`"${pjMasterId}"`}
          ,searchkey: null) {
           pjMasterId
           csBunitId
            bUnitName
            pjCode
            pjName
            gstNo
            isInvoicing
            invoicingAddress
           pjtype
            pjGroup
            creditLimit
            csaLimit
            asslimit
            assStartDate
            assEndDate
            websiteAddress
            companyLogo
           totalConsignmentStock
            outRightStock
            totalStock
            pjtype
            ownerPic
            registeredWithDs
            unregisteredWithDs
            pjOnboardingDate
            pjClosureDate
            city
            zone
            mobileNo
            email
            pincode
           solitaireJewellery
            smallDiamondJewellery
            goldJewellery
            luxuryLifestyle
            others
           
           customerCategory{
              sCustomerCategoryId
              name
              }
         currency{
          csCurrencyId
          isoCode
          }
          paymentTerms{
          csPaymenttermID
          name
          }
          region{
          csRegionID
          name
          }
          country{
          csCountryID
          name
          }
       csDocType{
              csDoctypeId
              name
          }
          }
      }`,
      },
    });

    return customertab.data.data.getPjMaster;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}; 
 

const getUpsertSupplier = async (data) => {
  const newMutation = []
  for (let index = 0; index < data.length; index++) {
    newMutation.push(
      `{
        regionName:${data[index].region === undefined || data[index].region === "" || data[index].region === null ? null :`"${data[index].region}"`},
        value:${data[index].value === undefined || data[index].value === "" || data[index].value === null ? null :`"${data[index].value}"`},
        name:${data[index].name === undefined || data[index].name === "" || data[index].name === null ? null :`"${data[index].name}"`},
        taxName:${data[index].taxId === undefined || data[index].taxId === "" || data[index].taxId === null ? null :`"${data[index].taxId}"`},
        city:${data[index].city === undefined || data[index].city === "" || data[index].city === null ? null :`"${data[index].city}"`},
        address1:${data[index].addressLine1 === undefined || data[index].addressLine1 === "" || data[index].addressLine1 === null ? null :`"${data[index].addressLine1}"`},
        address2:${data[index].addressLine2 === undefined || data[index].addressLine2 === "" || data[index].addressLine2 === null ? null :`"${data[index].addressLine2}"`},
        }`
    )
  }
  try {
    const upserSupplierData= await customInstance({
      data: {
        query: `mutation {
          importSupplier(supplier: {
              suppliers: [${newMutation}]
           }) { 
        status
        message   
        }
        }`,
      },
    });

    return upserSupplierData;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}; 

const getUpsertRetailCustomer = async (data) => {
  const newMutation = []
  for (let index = 0; index < data.length; index++) {
    newMutation.push(
      `{
        value:${data[index].value === undefined || data[index].value === "" || data[index].value === null ? null :`"${data[index].value}"`},
        name:${data[index].name === undefined || data[index].name === "" || data[index].name === null ? null :`"${data[index].name}"`},
        mobileNo:${data[index].contactNo === undefined || data[index].contactNo === "" || data[index].contactNo === null ? null :`"${data[index].contactNo}"`},
        loyaltybalance:${data[index].loyaltyBalance === undefined || data[index].loyaltyBalance === "" || data[index].loyaltyBalance === null ? null :data[index].loyaltyBalance},
        creditBalance:${data[index].creditLimit === undefined || data[index].creditLimit === "" || data[index].creditLimit === null ? null :`"${data[index].creditLimit}"`},
        }`
    )
  }
  try {
    const upserRetailCustomerData= await customInstance({
      data: {
        query: `mutation {
          importRetailCustomer(customers: {
            customer: [${newMutation}]
           }) { 
        status
        message   
        }
        }`,
      },
    });

    return upserRetailCustomerData;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}; 

const getUpsertCustomers = async (data) => {
  const newMutation = []
  for (let index = 0; index < data.length; index++) {
    newMutation.push(
      `{
        value:${data[index].value === undefined || data[index].value === "" || data[index].value === null ? null :`"${data[index].value}"`},
        name:${data[index].name === undefined || data[index].name === "" || data[index].name === null ? null :`"${data[index].name}"`},
        regionName:${data[index].region === undefined || data[index].region === "" || data[index].region === null ? null :`"${data[index].region}"`},
        taxName:${data[index].taxId === undefined || data[index].taxId === "" || data[index].taxId === null ? null :data[index].taxId},
        city:${data[index].city === undefined || data[index].city === "" || data[index].city === null ? null :`"${data[index].city}"`},
        pincode:${data[index].pinCode === undefined || data[index].pinCode === "" || data[index].pinCode === null ? null :`"${data[index].pinCode}"`},
        address1:${data[index].addressLine1 === undefined || data[index].addressLine1 === "" || data[index].addressLine1 === null ? null :`"${data[index].addressLine1}"`},
        address2:${data[index].addressLine2 === undefined || data[index].addressLine2 === "" || data[index].addressLine2 === null ? null :`"${data[index].addressLine2}"`},
      }`
    )
  }
  try {
    const upserCustomerData= await customInstance({
      data: {
        query: `mutation {
          importCustomer(customer: {
            customers: [${newMutation}]
           }) { 
        status
        message   
        }
        }`,
      },
    });

    return upserCustomerData;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}; 

const getUpsertProductCatalouge = async (data,name) => {
  const newMutation = []
  for (let index = 0; index < data.length; index++) {
    newMutation.push(
      `{
        sku:${data[index].sku === undefined || data[index].sku === "" || data[index].sku === null ? null :`"${data[index].sku}"`},        
      }`
    )
  }
  try {
    const upserCustomerData= await customInstance({
      data: {
        query: `mutation {
          importProductCatalogue (catalogues : { catalogue : [{
              csBunitId:"0"
              name: "${name}"
            catalogueLines : [${newMutation}]
          }]
          }) {
          status
          message
          }
        }`,
      },
    });

    return upserCustomerData;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getUpsertStockOpeningBalance = async (data,bunitId,date) =>{
  const newMutation = []
  for (let index = 0; index < data.length; index++) {
    newMutation.push(
      `{
        productCode:${data[index].value === undefined || data[index].value === "" || data[index].value === null ? null :`"${data[index].value}"`}, 		
        countQty :${data[index].qty === undefined || data[index].qty === "" || data[index].qty === null ? null :`"${data[index].qty}"`}, 			
        cost:${data[index].cost === undefined || data[index].cost === "" || data[index].cost === null ? null :`"${data[index].cost}"`}, 
        batchNo:${data[index].batchNo === undefined || data[index].batchNo === "" || data[index].batchNo === null ? null :`"${data[index].batchNo}"`}, 
        startDate:${data[index].mfgDate === undefined || data[index].mfgDate === "" || data[index].mfgDate === null ? null :`"${data[index].mfgDate}"`}, 
        endDate:${data[index].expDate === undefined || data[index].expDate === "" || data[index].expDate === null ? null :`"${data[index].expDate}"`}, 
      }`
    )
  }
  try {
    const upserCustomerData= await customInstance({
      data: {
        query: `mutation { 
          importStock (inventory : { 			
            bUnitId : "${bunitId}" 		
            inventoryDate : "${date}" 	
            inventoryLines : [${newMutation}] 	
            }) 
            { 	
            status
            message	
          } }`,
      },
    });

    return upserCustomerData;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const getUpsertImportedProducts = async(data) =>{
  const newMutation = []
  for (let index = 0; index < data.length; index++) {
    newMutation.push(
      `{
        value:${data[index].productCode === undefined || data[index].productCode === "" || data[index].productCode === null ? null :`"${data[index].productCode}"`},
        upc:${data[index].upcBarCode === undefined || data[index].upcBarCode === "" || data[index].upcBarCode === null ? null :`"${data[index].upcBarCode}"`},
        productName:${data[index].productName === undefined || data[index].productName === "" || data[index].productName === null ? null :`"${data[index].productName}"`},
        uomName:${data[index].uom === undefined || data[index].uom === "" || data[index].uom === null ? null :`"${data[index].uom}"`},
        productCategory:{
            name:${data[index].productCategory === undefined || data[index].productCategory === "" || data[index].productCategory === null ? null :`"${data[index].productCategory}"`},
        }
        brandName:${data[index].brand === undefined || data[index].brand === "" || data[index].brand === null ? null :`"${data[index].brand}"`},
        imageurl:${data[index].imageUrl === undefined || data[index].imageUrl === "" || data[index].imageUrl === null ? null :`"${data[index].imageUrl}"`},
        taxCategory:{
            name:${data[index].taxCategory === undefined || data[index].taxCategory === "" || data[index].taxCategory === null ? null :`"${data[index].taxCategory}"`},
        }
        hsncode:${data[index].hsnCode === undefined || data[index].hsnCode === "" || data[index].hsnCode === null ? null :`"${data[index].hsnCode}"`},
        batchedForSale:${data[index].batchForSale === undefined || data[index].batchForSale === "" || data[index].batchForSale === null ? `"N"` :`"Y"`},
        batchedForStock:${data[index].batchForStock === undefined || data[index].batchForStock === "" || data[index].batchForStock === null ? `"N"` :`"Y"`},
        shelfLife:${data[index].shelfLifeInMonnths === undefined || data[index].shelfLifeInMonnths === "" || data[index].shelfLifeInMonnths === null ? null :`"${data[index].shelfLifeInMonnths}"`},
        salePrice:${data[index].salePrice === undefined || data[index].salePrice === "" || data[index].salePrice === null ? null :`"${data[index].salePrice}"`},
        mrp:${data[index].mrp === undefined || data[index].mrp === "" || data[index].mrp === null ? null :`"${data[index].mrp}"`},
        supplierCode:${data[index].supplier === undefined || data[index].supplier === "" || data[index].supplier === null ? null :[`"${data[index].supplier}"`]}
        purchasePrice:${data[index].purchasePrice === undefined || data[index].purchasePrice === "" || data[index].purchasePrice === null ? null :`"${data[index].purchasePrice}"`},
      }`
    )
  }
  try {
    const upserCustomerData= await customInstance({
      data: {
        query: `mutation { 
          importProduct (product : { 			
            products : [${newMutation}] 	
            }) 
            { 	
            status
            message	
          } }`,
      },
    });

    return upserCustomerData;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const getUpsertPurchaseInvoice = async(data,businessUnit,FormattedInvoiceDate,mProductIdForPurchaseInvoice) =>{
  const newMutation = []
  for (let index = 0; index < data.length; index++) {
    newMutation.push(
      `{
          cSBunitID:"${businessUnit}"
          pSupplierValue:"${data[index].supplierCode}"
          dateInvoiced:"${FormattedInvoiceDate}"
          dueDate:"${FormattedInvoiceDate}"
          outstandingAmt:"${data[index].outstanding}"
             lines:[{
             mProductID:"${mProductIdForPurchaseInvoice}" 
             }]
      }`
    )
  }
  try {
    const upserCustomerData= await customInstance({
      data: {
        query: `mutation {
          importPurchaseInvoices(invoices:{
              pInvoice:[${newMutation}]
              }
           ) {
            status
            message
          }
        }`,
      },
    });

    return upserCustomerData;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const getUpsertSalesInvoice = async(data,businessUnit,FormattedInvoiceDate,mproductIdForSalesInvoice) =>{
  const newMutation = []
  for (let index = 0; index < data.length; index++) {
    newMutation.push(
      `{
        csBunitId:"${businessUnit}"
        customerValue:"${data[index].customerCode}"
        dateinvoiced:"${FormattedInvoiceDate}"
        grosstotal:"${data[index].outstanding}"
        lines:[{
              mProductId:"${mproductIdForSalesInvoice}" 
             }]
      }`
    )
  }
  try {
    const upserCustomerData= await customInstance({
      data: {
        query: `mutation {
          importSalesInvoices(invoice:{
            sInvoice:[${newMutation}]
              }
           ) {
            status
            message
          }
        }`,
      },
    });

    return upserCustomerData;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}


const getWorkOrderDetails =async(id)=>{
  try{
    const workOrderDetails = await customInstance({
      data :{
        query:`query { getWorkOrderDetails(workOrderId: "${id}")
        {
           workOrderId
          doctypeId
          documentNo
          supplierId
          supplierAddressId
          sOrderId
          bUnitId
          bUnitName
          supplierName
          sOrderName
          city
          address
          date
           pOrderLines{
                        prOrderId
                        productId                                 
                         productName
                         docStatus
                         processId
                         qtyProduction
                         batchId
                         batchNo
                         doctypeId
                         storageBinId
                         storegeBinName
                         warehouseid
                         warehouseName
                         documentNo
                         date
                         imageUrl
                          prIOProductLines
                              {
                               ioProductId                            
                               type
                               uomId
                               uomName
                                plannedQty                            
                               actualQty
                               unitCost
                               actualCost
                               productcategoryId
                               categoryName
                               productId                                 
                               productName
                               batchId
                               batchNo
                              }
                              metaDetails{
                                key
                                value
                                sOrderlineMetaId
                            }
                         
                          }          
        }
      }`
      }
    })
    return workOrderDetails.data.data.getWorkOrderDetails;
  }catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const getProfile = async (id) =>{
  try {
    const getprofileData = await customInstance({
      data: {
        query: `query {
          getProfile(id : "${id}")
          {
            csBunitId
            bUnitName
            phoneNo
            location
            defaultCsRoleId
            roleName
            image
            firstname
            lastname
            name
            email
            description
            phoneNo
            location
            department
            roleName
            image
          }
          }`,
      },
    });

    return getprofileData.data.data.getProfile;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const getQualityTask = async (id) =>{
  try {
    const getInspectionTaskData = await customInstance({
      data: {
        query: `query{
          getInspectionTask(userId:"${id}"){
              cWQInspectionTaskId
              bUnit{
                  csBunitId
                  name
              }
              product{
                  mProductId
                  name
              }
              date
              qualityWorkflowName
            taskNo
              status
              cwqQualityEngineerId
              cwqQualityEngineerName
              mBatchId
              batchNo
              cWQInspectionTaskLine{
              cWQInspectionTaskLineId
              value
              cWQInspectionRuleId
              parameterName
              parameterGroupName
              refValues
              type 
              remarks
      }
                      
          }
      }`,
      },
    });

    return getInspectionTaskData.data.data.getInspectionTask;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const getQualityReview = async (id) =>{
  try {
    const getQualityReview = await customInstance({
      data: {
        query: `query{
          getQCReview(approverId:"${id}"){
          cWQWorkflowId
          status
         date
          bUnit{
              csBunitId
              name
          }
          product{
              mProductId
              name
          }
          mBatchId
          batchNo
          }
      }`,
      },
    });

    return getQualityReview.data.data.getQCReview;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}



  
 
 

 
const getRegulatoryData = async (pjMasterId) => {
  try {
    const RegulatoryTab  = await customInstance({
      data: {
        query: `query {
          getDvnCustbankdetails(pjmasterId:${pjMasterId === null || pjMasterId ===undefined ? null:`"${pjMasterId}"`},
          dvnCustbankdetailsId:null) {
          cBankDetailsId
          pjMasterId
          bankAccNumber
          bankname
          ifscCode
          gstNo
          branch
          panNo
          tdsApplicable
          gstApplicable
          incentivePromptPayment
          jwellerlevelPromtPayment
          }
      }`,
      },
    });
    return RegulatoryTab.data.data.getDvnCustbankdetails;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};  
 
const getStockMixData = async (pjMasterId) => {
  try {
    const stockmixtab = await customInstance({
      data: {
        query: `query {
          getDvnCustClassification(pjmasterId:${pjMasterId === null || pjMasterId ===undefined ? null:`"${pjMasterId}"`},
          dvnClassificationId:null) {
          dOtherClassificationId
          pjMasterId
          small
          medium
          large
          exLarge
          defVvs
          defVs
          defSi
          ghVvs
          ghVs
          ghSi
          ijkVvs
          ijkVs
          ijksi
          dsd
          dsj
          }
      }`,
      },
    });

    return stockmixtab.data.data.getDvnCustClassification;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}; 





const getDeleteData = async (id) => {
  try {
    const deleteform = await customInstance({
      data: {
        query: `mutation {
          deleteDvnCustbankdetails(dvnCustbankdetailsIds: ["${id}"]
           ) { 
        status
        message   
        }
        }`,
      },
    });
    return deleteform.data.data.deleteDvnCustbankdetails;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}; 
 












 
const getCustomInfoTabDeleteData = async (id) => {
  try {
    const deleteCustomInfoform = await customInstance({
      data: {
        query: `mutation {
          deletePjMaster(pjMasterIds: ["${id}"] ) 
          { 
          status
          message   
          }
          }`,
      },
    });
    return deleteCustomInfoform.data.data.deletePjMaster;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}; 

const getDeleteStockMixData = async (id) => {
  try {
    const deleteStockMixform = await customInstance({
      data: {
        query: `mutation {
          deleteDvnCustClassification(dvnCustClassificationIds: ["${id}"]
           ) { 
        status
        message   
        }
        }`,
      },
    });
    return deleteStockMixform.data.data.deleteDvnCustClassification;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}; 
 

const getDeleteTermsConditionsData = async (id) => {
  try {
    const deleteTermsConditionsform = await customInstance({
      data: {
        query: `mutation {
          deleteDvnCustaddress(dvnCustaddressIds: ["${id}"]
           ) { 
        status
        message   
        }
        }`,
      },
    });
    return  deleteTermsConditionsform.data.data.deleteDvnCustClassification;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}; 
 

const getDeleteOuttLetData = async (id) => {
  try {
    const deleteDeleteOutletform = await customInstance({
      data: {
        query: `mutation {
          deleteDvnOutlet(dvnOutletIds: ["${id}"]
           ) { 
        status
        message   
        }
        }`,
      },
    });
    return deleteDeleteOutletform.data.data.deleteDvnOutlet;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};  
  

const getDeleteKYCData = async (id) => {
  try {
    const deleteKycform = await customInstance({
      data: {
        query: `mutation {
          deleteDvnCustomer(dvnCustomerIds: ["${id}"]
           ) { 
        status
        message   
        }
        }`,
      },
    });
    return deleteKycform.data.data.deleteDvnCustomer;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};   
  
const getroleBunit = async (userId) => {
  try {
    const roleCustomerInfo = await customInstance({
      data: {
        query: `query {
          getroleBunit(userId : "${userId}")
          {
              csUserId
              defaultCsRoleId
              roleName
              defaultCsBunitId
              bUnitName
            isLocalPurchase
              userBunit{
                  csUserId
                  csBunitId
                  bUnitName
                  isLocalPurchase
              }
        }    
        }`,
      },
    });
    return roleCustomerInfo.data.data.getroleBunit;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getEnableProduct = async (id) => {
  try {
    const enableDesignProduct = await customInstance({
      data: {
        query: `mutation{
          enableDesign(product:{
              plmDesignId: "${id}"
          })
          {
              status
              message
          }
      }`,
      },
    });
    return enableDesignProduct.data.data.enableDesign;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getDisableProduct = async (id) => {
  try {
    const disableDesignProduct = await customInstance({
      data: {
        query: `mutation{
          disableDesign(product:{
              plmDesignId: "${id}"
          })
          {
              status
              message
          }
      }`,
      },
    });
    return disableDesignProduct.data.data.disableDesign;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getSolitaireStockData = async (limit,key,orderDate) => {
  try {
    const solitaireData = await customInstance({
      data: {
        query: `query{
          getSolitaireStock(limit:null,searchKey:null,orderDate:"${orderDate}"){
           productId
           name
           qtyOnHand
           productPrice
           attributes {
               mAttributeId
               name
               value
           }
          }  
        }`,
      },
    });
    return solitaireData.data.data.getSolitaireStock;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};


const getconfirmQualityTask = async (headerFormValues,headerData,lineData) =>{
  const arrayFormuttaion = []
  for (let index = 0; index < lineData.length; index++) {
    if(lineData[index].type === 'DT'){
      lineData[index].newFormValues = moment(lineData[index].newFormValues).format('YYYY-MM-DD')
    }
    if(lineData[index].type === 'IM'){
      lineData[index].newFormValues = lineData[index].newFormValues === undefined || lineData[index].newFormValues === null ? lineData[index].value : lineData[index].newFormValues.fileList[0].response 
    }
    const obj1 =
      {
        cwqInspectionTaskLineId:`${lineData[index].cWQInspectionTaskLineId}`,
        value:`${lineData[index].newFormValues}`, 
        remarks:`${lineData[index].remarksFromForm === undefined || lineData[index].remarksFromForm === null || lineData[index].remarksFromForm === "" ? null :`${lineData[index].remarksFromForm}`}`
       }
       arrayFormuttaion.push(obj1)
    
  }

  const obj = {
    cwqInspectionTaskId : headerData[0].cWQInspectionTaskId,
    status:headerData[0].status, 
    cwqInspectionTaskLines:arrayFormuttaion
  }
  const formattedStringified = JSON.stringify(JSON.stringify(obj))

  try {
    const roleCustomerInfo = await customInstance({
      data: {
        query: `mutation {            
          confirmInspectionTask(inspectionTasks:${formattedStringified}
          ) {
                    status
                    message
                } 
          }`,
      },
    });
    return roleCustomerInfo.data.data.confirmInspectionTask;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const getQualityReviewTask = async(id) =>{
  try {
    const getQCReviewTaskData = await customInstance({
      data: {
        query: `query{
          getQCReviewTask(workflowId:"${id}"){
              cWQInspectionTaskId
              taskNo
              status
              cwqQualityEngineerId
              cwqQualityEngineerName
              bUnit{
                csBunitId
                name
                }
              product{
                  mProductId
                  name
              }
              mBatchId
              batchNo
              cWQInspectionTaskLine{
              cWQInspectionTaskLineId
              value
              cWQInspectionRuleId
              parameterName
              parameterGroupName
              type 
              refValues
              remarks
      }             
          }
      }`,
      },
    });
    return getQCReviewTaskData.data.data.getQCReviewTask;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const getconfirmQualityReviewTask = async(qualityReviewResponse,consolidateDataArray,userId) =>{
  const date = new Date()
  const formattedDate = moment(date).format('YYYY-MM-DD')
  const arrayFormuttaion = []
  for (let index = 0; index < consolidateDataArray.length; index++) {
    if(consolidateDataArray[index].type === 'DT'){
      consolidateDataArray[index].newFormValues = moment(consolidateDataArray[index].newFormValues).format('YYYY-MM-DD')
    }
    if(consolidateDataArray[index].type === 'IM'){
      consolidateDataArray[index].newFormValues = consolidateDataArray[index].newFormValues === undefined || consolidateDataArray[index].newFormValues === null ? consolidateDataArray[index].value : consolidateDataArray[index].newFormValues.fileList[0].response 
    }
    const obj1 =
        `{
          cWQInspectionRuleId:"${consolidateDataArray[index].cWQInspectionRuleId}",
          parameterName:"${consolidateDataArray[index].parameterName}",
          value:${consolidateDataArray[index].newFormValues === undefined || consolidateDataArray[index].newFormValues === null ? null : `"${consolidateDataArray[index].newFormValues}"`},
       }`
       arrayFormuttaion.push(obj1)
    
  }

  try {
    const qcReviewData = await customInstance({
      data: {
        query: `mutation {
          approveQCReview(inspectionTask: {
          csBUnitId:"${qualityReviewResponse[0].bUnit.csBunitId}"
          cwqQualityEngineerId:"${userId}"
          mProductId:"${qualityReviewResponse[0].product.mProductId}"
          mBatchId:${qualityReviewResponse[0].mBatchId === null || qualityReviewResponse[0].mBatchId === undefined ? null : `"${qualityReviewResponse[0].mBatchId}"`}
          date:"${formattedDate}"
              lines:[${arrayFormuttaion}]
          })
          {
              status
              message
          }
          }`,
      },
    });
    return qcReviewData.data.data.approveQCReview;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const getStockIssueData = async(id) =>{
  try {
    const stockData = await customInstance({
      data: {
        query: `query{
          getStockIssue(csBunitId:"${id}"){
            mTransferissueID
            stockTransferReceipt
            cSBunitID
            bunitName
            warehouseId
             warehouseName
           totalQty
           noOfProducts
           documentno
           createdby
           date
           csUserId
           receiptWarehouseName
          receiptWarehouseId
          receiptBunitId
          receiptBunitName
          mStoragebinId
          }  
        }`,
      },
    });
    return stockData.data.data.getStockIssue;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const getStReceiptLinesData =  async (issueId) =>{
  try {
    const stockLinesData = await customInstance({
      data: {
        query: `query{
          getStockIssueLine(documentNo:null,issueId:"${issueId}"){
            productName
            qtyReceived
            mTransferIssueLineID
            qtyIssued
            mStoragebintoID
            mProductID
            mStoragebinID
            sku
            batchNo
            mBatchId
          }  
        }`,
      },
    });
    return stockLinesData.data.data.getStockIssueLine;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const getConfirmSTReceipt = async(linesData,selectedHeaderObject) =>{
  let arrayFormuttaion = []
  for (let index = 0; index < linesData.length; index++) {
    arrayFormuttaion.push(
      `{
        mProductID: "${linesData[index].mProductID}"
        mTransferIssueLineID: "${linesData[index].mTransferIssueLineID}"
        qtyReceived:${linesData[index].qtyReceived}
       }`
    )
    
  }
  try {
    const confirmSTRData = await customInstance({
      data: {
        query: `mutation {
          confirmSTReceipt(receiptlines: [{
             cSBunitID: "${selectedHeaderObject.cSBunitID}"
             date:"${selectedHeaderObject.date}"
             mStoragebinID:"${selectedHeaderObject.mStoragebinId}"
             mTransferIssueID:"${selectedHeaderObject.mTransferissueID}"
             lines : [${arrayFormuttaion}]
          }
          ])        
          {
              status
              message
          } 
    }`,
      },
    });
    return confirmSTRData.data.data.confirmSTReceipt;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const getPjDetailsData = async (pjMasterId) => {
  try {
    const PjDetails = await customInstance({
      data: {
        query: `query {
      getPjDetails(pjmasterId:${pjMasterId === null || pjMasterId ===undefined ? null:`"${pjMasterId}"`},searchkey: null ) {
        pjMasterId
        csBunitId
          bUnitName
        pjCode
        pjName
        gstNo
        isInvoicing
        invoicingAddress
        pjGroup
        creditLimit
        csaLimit
        asslimit
        assStartDate
        assEndDate
        websiteAddress
        companyLogo
        ownerPic
        registeredWithDs
        unregisteredWithDs
        pjOnboardingDate
        pjClosureDate
        city
        zone
        mobileNo
        email
        pincode
          solitaireJewellery
        smallDiamondJewellery
        goldJewellery
        luxuryLifestyle
        others
        customerCategory{
            sCustomerCategoryId
            name
          }
      currency{
      csCurrencyId
      isoCode
      }
      paymentTerms{
      csPaymenttermID
      name
      }
      region{
      csRegionID
      name
      }
      country{
      csCountryID
      name
      }
        csDocType{
            csDoctypeId
            name
        }
      dvncustAddress{
          dvnCustomerAddressId
            pjMasterId
          faxno
           description
           addresssLine1
           addresssLine2
           agreementDate
           agreementSign
           depositCommited
           depositReceivedValue
           storeWisePromptPayment
           projectionJwellerWiseTarget
           storeWiseTarget
           margin
           sor
           ownerPic
           companyLogo
           email
           dateOfEstablishement
           creditPeriod
            paymenttermName
            pjCreditLimit
           weeklyOff
            authorizedoutlet
            totalStock
          outRightStock
          totalConsignmentStock
          asslimit
          csaLimit
            paymentTermId
            paymentTermName
            depositWvOff
        }
      dvnclassification{
        dOtherClassificationId
        pjMasterId
        small
        medium
        large
        exLarge
        defVvs
        defVs
        defSi
        ghVvs
        ghVs
        ghSi
        ijkVvs
        ijkVs
        ijksi
        dsd
        dsj
      }
      dvnBankDetails{
        cBankDetailsId
         pjMasterId
         bankAccNumber
         bankname
         ifscCode
         gstNo
         branch
         panNo
         tdsApplicable
         gstApplicable
         incentivePromptPayment
         jwellerlevelPromtPayment
      }
      dvnContact{
        customerContactId
        pjMasterId
        outletName
        nickName
        ownerName
        addressLine1
        addressLine2
        outletCity
        state
            stateName
        outletCountry
            outletCountryName
        outletFullAddress
        pjSalesRepresentative
            pjSalesRepresentativeName
            weeklyOff
            kyc
        salesRepStartDate
        birthDate
        anniversaryDate
        outletOnboardingDate
        outletClosureDate
        gstNo
        mobileNo
        advertisement
        email
        area
        displayDone
        outletLongitude
        outletLatitude
        pricelistHandoverContactPersonName
        stockConfirmationContactName
        storeContactPersonName
        zone
        tier
        outletPic
        trialFromPeriod
        trialToPeriod
        promotionAllowed
        storeWiseTarget 
        projectionJwellerWiseTarget
        storeContactPersonNo
        stockConfirmationContactNo
        pHandoverContactPersonNo
        pinCode
        totalStock
        authorizedoutlet
        joiningFeeDate
        joiningFeeAmount
        comment 
        joiningWvOff 
      }
      dvnCustomer{
      dvnCustomerId
          pjMasterId
      csBunitId
        bunitName
      value
      pjName
      gstNumber
      nickName
            pCloserDate
      birthDate
      anniversaryDate	
      sor
      dateofEstablishement
      kyc
      compmanyLogo
      pincode
      pjAddress
      pjSalesRepStartDate
      pjSalesRepEndDate
      ownerPic
      pjOnboardingDate
      pjClosureDate
      websiteAddress
      ownerName
      city
      zone
      mobileNo
      email
      outletPic
      unregisteredWithDs
      type
      registeredWithDs
      totalStock
      outRightStock
      totalConsignmentStock
      assEndDate
      assStartDate
      asslimit
      csaLimit
      creditLimit
      pjGroup
      invoicingAddress
      invoicingName
        solitaireJewellery
        smallDiamondJewellery
        goldJewellery
        luxuryLifestyle
        others
        pjCode
            currency{
      csCurrencyId
      isoCode
      }
      docType{
      csDoctypeId
      name
      }
      category{
      sCustomerCategoryId
      name
      }
      paymentTerms{
      csPaymenttermID
      value
      name
      }
      region{
      csRegionID
      name
      }
      country{
      csCountryID
      name
      }
        salesRep{
            salesRepresentId
            name
        }
      }
  }
    
}`,     },
    });

    return PjDetails.data.data.getPjDetails;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};


//updated

const getKycData = async (pjMasterId ) => {
  try {
    const kyctab = await customInstance({
      data: {
        query: `query {
          getDvnCustomer(dvnCustomerId:null ,
          searchKey: null,pjmasterId:${pjMasterId === null || pjMasterId ===undefined ? null:`"${pjMasterId}"`}) {
          dvnCustomerId
          pjMasterId
          csBunitId
          bunitName        
          value
          pjName
          gstNumber
          nickName
              pCloserDate
          birthDate
          anniversaryDate 
          sor
          dateofEstablishement
          kyc
          compmanyLogo
          pincode
          pjAddress
          pjSalesRepStartDate
          pjSalesRepEndDate
          ownerPic
          pjOnboardingDate
          pjClosureDate
          websiteAddress
          ownerName
          city
          zone
          mobileNo
          email
          outletPic
          unregisteredWithDs
          type
          registeredWithDs
          totalStock
          outRightStock
          totalConsignmentStock
          assEndDate
          assStartDate
          asslimit
          csaLimit
          creditLimit
          pjGroup
          invoicingAddress
          invoicingName
              currency{
          csCurrencyId
          isoCode
          }
          docType{
          csDoctypeId
          name
          }
          category{
          sCustomerCategoryId
          name
          }
          paymentTerms{
          csPaymenttermID
          value
          name
          }
          region{
          csRegionID
          name
          }
          country{
          csCountryID
          name
          }
          salesRep{
              salesRepresentId
              name
          }
          solitaireJewellery
          smallDiamondJewellery
          goldJewellery
          luxuryLifestyle
          others
           pjCode
          }
      }`,
      },
    });

    return kyctab.data.data.getDvnCustomer;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};   

  
const getTermsConditionsData = async (pjMasterId) => {
  try {
    const TermsConditionstab = await customInstance({
      data: {
        query: `query {
          getDvnCustAddress(pjmasterId:${pjMasterId === null || pjMasterId ===undefined ? null:`"${pjMasterId}"`},
          dvnCustomerAddressId:null) {
          dvnCustomerAddressId
          pjMasterId
          faxno
          description
          addresssLine1
          addresssLine2
          agreementDate  
          agreementSign  
          depositCommited 
          depositReceivedValue  
          storeWisePromptPayment 
          projectionJwellerWiseTarget
          storeWiseTarget
          margin 
          sor
          ownerPic
          companyLogo
          email
          dateOfEstablishement
          pjCreditLimit
          weeklyOff 
          paymentTerms{
            creditPeriod
            paymenttermName 
            }
            csaLimit
            asslimit
            totalConsignmentStock
            outRightStock
            totalStock
            paymentTermId
            paymentTermName 
            depositWvOff
          }
      }`,
      },
    });

    return TermsConditionstab.data.data.getDvnCustAddress;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};







const getOutletData = async (pjMasterId) => {
  try {
    const outlettab = await customInstance({
      data: {
        query: `query {
            getDvnOutlet(pjmasterId:${pjMasterId === null || pjMasterId ===undefined ? null:`"${pjMasterId}"`},
            dvnOutletId: null){
            customerContactId
            pjMasterId
            outletName
            nickName
            ownerName
            addressLine1
            addressLine2
            outletCity
            state
            stateName
            outletCountry
            outletCountryName
            outletFullAddress
            pjSalesRepresentative
            pjSalesRepresentativeName
            salesRepStartDate
            salesRepEndDate
            birthDate
            anniversaryDate
            outletOnboardingDate
            outletClosureDate
            gstNo
            mobileNo
            advertisement
            email
            area
            displayDone
            outletLongitude
            outletLatitude
            pricelistHandoverContactPersonName
            stockConfirmationContactName
            storeContactPersonName
            zone
            tier
            outletPic
            trialFromPeriod
            trialToPeriod
            promotionAllowed
            storeWiseTarget 
            projectionJwellerWiseTarget
            storeContactPersonNo
            stockConfirmationContactNo
            pHandoverContactPersonNo
            pinCode
            totalStock 
            weeklyOff
           kyc 
           authorizedoutlet
           marketName
           salesRep{
            pjSalesRepresentative
          pjSalesRepresentativeName
           }
           joiningFeeDate
           joiningFeeAmount
           comment  
           joiningWvOff 
           region{
            csRegionID
            name
            }
        
            }
        }`,
      },
    });

    return outlettab.data.data.getDvnOutlet;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};


const getConfirmSTReturen = async(linesData,selectedHeaderObject) => {
  let arrayFormuttaion2 = []
  for (let index = 0; index < linesData.length; index++) {
    arrayFormuttaion2.push(
      `{
        mProductID: "${linesData[index].mProductID}"
        mTransferIssueLineID:"${linesData[index].mTransferIssueLineID}"
        qtyReceived:${linesData[index].qtyReceived}
        returnQty:${linesData[index].returnQty}
       }`
    )
    
  }
  try {
    const confirmSTReturnData = await customInstance({
      data: {
        query: `mutation {
          returnSTReceipt(receipt: {
              cSBunitID:"${selectedHeaderObject.cSBunitID}"
              date:"${selectedHeaderObject.date}"
              storagebinId:"${selectedHeaderObject.mStoragebinId}"
              mTransferissueID:"${selectedHeaderObject.mTransferissueID}"
              lines:[${arrayFormuttaion2}]
          }
          )        
          {
              status
              message
          } 
      }`,
      },
    });
    return confirmSTReturnData.data.data.returnSTReceipt;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const createOrder = async (dataToSubmit,type,action,transactionQueId) => {
  try {
    const createOrderData = await customInstance({
      data: {
        query: `mutation {
          transactionQueue(queue: {
            transactionQueueId:"${transactionQueId}"
            transactionType:"${type}"
            action:"${action}"
            dataLoad:${dataToSubmit}
           }) { 
        code
        message   
        referenceNo
        recordId
        }
        }`,
      },
    });
    return createOrderData;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

const getHistoryDataWithTransactionQue =  async (event,status,transationType) => {
  try {
    const createOrderData = await customInstance({
      data: {
        query: `query {
          transactionQueue(queue: {
            transactionType: "${transationType}"
            status: "${status}"
            documentNo : ${event === undefined || event === null || event === ""? null :`"${event}"`}
           }) { 
        transactionType
        status
        logs
        dataLoad
        transactionQueueId
        referenceNo      
        }
        }`,
      },
    });
    return createOrderData;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }

}

export {
  updateCustomLocalToken,
  getProductCategory,
  getTaxCategory,
  getUOM,
  getSupplierCategory,
  getSupplierRegion,
  getDeliveryLocation,
  getSupplierProduct,
  getLandedCostData,
  getInventoryProduct,
  getStockCountProduct,
  getgetAgents,
  getApparelProducts,
  getSpecificApparelProduct,
  getDraftPoDocs,
  getDraftpoProducts,
  getStockAllocationData,
  getConfirmDataForStockAllocation,
  getRoleBusinessUnit,
  getPoOrderLineProducts,
  getPurchaseOrderDocData,
  getSupplierProductsList,
  getBrand,
  getPoDocs,
  getpoLineProducts,
  getReturnReasons,
  getPendingRequisition,
  getPendingSalesOrders,
  getUIDStocks,
  getUIDStocks1,
  getIssueTypeData,
  getAppSetupData,
  getSoProductData,
  getAddonProductData,
  getPriceListData,
  getProductCategoryAttribute,
  getDesignDetails,
  getDesign,
  getVarients,
  getGRNdocs,
  getGRNLineProducts,
  getSalesOrderDetailsData,
  getCustomerInfoTabData,
  getRegulatoryData,
  getStockMixData,
  getDeleteData,
  getCustomInfoTabDeleteData,
  getDeleteKYCData,
  getUpsertSupplier,
  getUpsertRetailCustomer,
  getUpsertCustomers,
  getUpsertProductCatalouge,
  getUpsertStockOpeningBalance,
  getUpsertImportedProducts,
  getUpsertPurchaseInvoice,
  getUpsertSalesInvoice,
  getWorkOrderDetails,
  getProfile,
  getQualityTask,
  getQualityReview,
  getDeleteTermsConditionsData,
  getDeleteOuttLetData,
  getroleBunit,
  getDeleteStockMixData,
  getconfirmQualityTask,
  getEnableProduct,
  getDisableProduct,
  getPjDetailsData,
  getKycData,
   getTermsConditionsData, 
  getOutletData,  
  getSolitaireStockData,
  getQualityReviewTask,
  getconfirmQualityReviewTask,
  getStockIssueData,
  getStReceiptLinesData,
  getConfirmSTReceipt,
  getConfirmSTReturen,
  createOrder,
  getHistoryDataWithTransactionQue
};