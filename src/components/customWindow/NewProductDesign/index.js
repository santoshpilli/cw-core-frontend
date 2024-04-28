import React, { useEffect, useState } from "react";
import { Form, Input, Modal,TreeSelect, Select, Card, Col, Row, Spin, DatePicker,Slider, message, Upload, Button ,Table,Checkbox,InputNumber,Tooltip, Collapse,Anchor} from "antd";
import { LoadingOutlined, UploadOutlined,EditOutlined,DeleteOutlined,MinusCircleOutlined,PlusCircleOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import { getProductCategoryAttribute, getDesignDetails,getVarients,getEnableProduct,getDisableProduct } from "../../../services/custom";
import "antd/dist/antd.css";
import "../../../styles/antd.css";
import Axios from "axios";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router";

import moment from "moment";
// import { serverUrl } from "../../../constants/serverConfig";
import DesignDetails from "../NewProductDesign/designDetails";

import { useParams } from "react-router-dom";
import { getProductCategoryData, getNewProductData, getSubProductData, getDesignedByData, getSketchRefData,getDesignerDetails,getChildProductCategory } from "../../../services/generic";
import { render } from "@testing-library/react";

const NewProductDesign = () => {
  const { Option } = Select;
  const [headerForm] = Form.useForm();
  const [variantForm] = Form.useForm();
  const [weightForm] = Form.useForm();

  const [form] = Form.useForm();
  const serverUrl = process.env.REACT_APP_serverUrl;
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState([]);
  const [designCode, setDesignCode] = useState("");
  const [designName, setDesignName] = useState("");
  // const [designDetails, setDesignDetails] = useState([]);
  const [cadWeight,setCadWeight] = useState('')
  const [findWeight,setFindWeight] = useState('')
  const [min,setMin] =useState('')
  const [max,setMax] =useState('')
  const [bUnitId, setBUnitId] = useState("");
  const [productId, setProductId] = useState("");
  const [subProductId, setSubProductId] = useState(null);
  const { recordId } = useParams();
  const [sketchRef, setSketchRef] = useState(null);
  const [designedById, setDesignedById] = useState(null);
  const [designId, setDesignId] = useState("");
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [designDetail, setDesignDetails] = useState([]);
  const [productCategoryId, setProductCategoryId] = useState("");
  const [imageVisible, setImageVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [skuName,setSkuName] = useState("")

  const [data,setData] = useState([])	
  const [id, setId] = useState(null);

  const [cadValue,setCadValue] = useState("N")
  const [weightData,setWeightData] = useState([])
  const [weightModal,setWeightModal] = useState(false)
  const [flag,setFlag] = useState({'flag':false,'flag1':false})
  const [weightValue,setWeightValue] = useState('')

  	
  const [variantVisible,setVariantVisible] = useState(false)

  const [variantCreation,setVariantCreation] = useState(false)
  const [lableVisible,setLableVisible] = useState(true)
  const [diamondVisible,setDiamondVisible] = useState(false)
  const [colourStoneVisible,setColourStoneVisible] = useState(false)
  const [solitaireVisible,setSolitaireVisible] = useState(false)
 
  const [bunitData, setBunitData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [subProductData, setSubProductData] = useState([]);
  const [designedByData, setDesignedByData] = useState([]);
  const [sketchData, setSkecthData] = useState([]);
  const [isValue, setIsValue] = useState(false);
  const [quantity,setQuantity] = useState(0)
  const [weight,setWeight]=useState(0)
  const [diamondQuantity,setDiamondQuantity]=useState(0)
  const [diamondWeight,setDiamondWeight]=useState(0)
  const [colourStoneQuantity,setColourStoneQuantity]=useState(0)
  const [colourStoneWeight,setColourStoneWeight]=useState(0)
  const [totalQty,setTotalQty] = useState(0)
  const [totalWeight,setTotalWight] = useState(0)
  const [getDesignerData ,setDesignerData] =useState([])
  const [variantImgVisible,setVariantImgVisible] = useState(false)
  const [variantSrc,setVariantSrc] = useState('')
  const [enableFlag,SetEnableFlag] = useState("")

  const changePage = () => {
    history.push(`/others/window/7447`);
  };

  useEffect(() => {
    if (recordId === "New_Record") {
      setIsValue(true);
      form.resetFields();
      headerForm.resetFields();
      setFormVisible(false);
      setDesignName("");
      setDesignCode("");
      setData([])
      setIsTableVisible(true);
      setVariantVisible(false)
    } else if (recordId) {
      setIsTableVisible(true);
      setLoading(true);
      getData(recordId);
      setData([])
      setVariantVisible(true)
    } else {
      setIsTableVisible(false);
      // getDesignData("");
    }
  }, [recordId]);
  const history = useHistory();



  const getDesigner= async( )=>{
    const designerRes = await getDesignerDetails()
    setDesignerData(designerRes)
  }
  
  


const handleQuantityChange=(data)=>{
  const formData = variantForm.getFieldsValue(true)
  let qty = 0
  let qty1 = 0
  let qty2 = 0
  if(data === "solitaire"){
    let array = []
    let weight = 0
    for(let i=0;i<formData.solitaireData.length;i++){
      qty = parseFloat(qty) + parseFloat(formData.solitaireData[i].quantity)
      let total = parseFloat(formData.solitaireData[i].pointerWeight)*parseFloat(formData.solitaireData[i].quantity)
      formData.solitaireData[i].totalWeight = total.toFixed(3)
      array.push(formData.solitaireData[i])
      weight = weight + total
    }
    setWeight(weight.toFixed(2))
    variantForm.setFieldsValue({
      solitaireData:array
    })
    setQuantity(qty.toFixed(2))
  }else if(data === "Diamond"){
    let array = []
    let weight = 0
    for(let i=0;i<formData.sideDiamond.length;i++){
      qty1 = parseFloat(qty1) + parseFloat(formData.sideDiamond[i].quantity)
      let total = parseFloat(formData.sideDiamond[i].pointerWeight)*parseFloat(formData.sideDiamond[i].quantity)
      formData.sideDiamond[i].totalWeight = total.toFixed(3)
      array.push(formData.sideDiamond[i])
      weight = weight + total
    }
    setDiamondWeight(weight.toFixed(2))
    variantForm.setFieldsValue({
      sideDiamond:array
    })
    setDiamondQuantity(qty1.toFixed(2))
  }else if(data === "ColourStone"){
    let array =[]
    let weight = 0
    {
      for(let i=0;i<formData.colourStone.length;i++){
        qty2 = parseFloat(qty2) + parseFloat(formData.colourStone[i].quantity)
        let total = parseFloat(formData.colourStone[i].pointerWeight)*parseFloat(formData.colourStone[i].quantity)
      formData.colourStone[i].totalWeight = total.toFixed(3)
      array.push(formData.colourStone[i])
      weight = weight + total
      }
      setColourStoneWeight(weight.toFixed(3))
      variantForm.setFieldsValue({
        colourStone:array
      })
      setColourStoneQuantity(qty2.toFixed(2))
    }
  }
}



useEffect(() => {
  
const total = parseFloat(quantity)+parseFloat(diamondQuantity)+parseFloat(colourStoneQuantity)
  variantForm.setFieldsValue({
    totalQuantity:total.toFixed(2)
  })
}, [quantity,diamondQuantity,colourStoneQuantity])

useEffect(() => {
  const total = parseFloat(weight)+parseFloat(diamondWeight)+parseFloat(colourStoneWeight)
    variantForm.setFieldsValue({
      totalWeight:total.toFixed(2)
    })
    
  }, [weight,diamondWeight,colourStoneWeight])


const handleWeightChange=(data)=>{
  const formData = variantForm.getFieldsValue(true)
  if(data === "solitaire"){
  let weight = 0
    for(let i=0;i<formData.solitaireData.length;i++){
      weight = weight + Number(formData.solitaireData[i]?.totalWeight)
    }
    setWeight(weight.toFixed(2))
  }else if(data === "Diamond"){
  let weight1 = 0
    for(let i=0;i<formData.sideDiamond.length;i++){
      weight1 = weight1 + Number(formData.sideDiamond[i]?.totalWeight)
    }
    setDiamondWeight(weight1.toFixed(2))
  }else if(data === "ColourStone"){
  let weight2 = 0
    {
      for(let i=0;i<formData.colourStone.length;i++){
        weight2 = weight2 + Number(formData.colourStone[i]?.totalWeight)
      }
      setColourStoneWeight(weight2.toFixed(2))
    }
  }
}


// =============
const getJewelCadVolume =(e)=>{
  let camWeightFromJewel =  Number(e.target.value)*0.00091
  variantForm.setFieldsValue({
    "camWeight" : camWeightFromJewel.toFixed(2)
  })
}

const getCadWeight =(e)=>{
  setCadWeight(e.target.value)
  let FG18KTfromCad = Number(e.target.value)
 variantForm.setFieldsValue({
   "FG18KT" : FG18KTfromCad.toFixed(2)
 })
 let FG14KTfromCad = Number(FG18KTfromCad)*0.85
 variantForm.setFieldsValue({
  "FG14KT": FG14KTfromCad.toFixed(2)
 })
 let FGPTfromCad = Number(FG18KTfromCad)*1.42
 variantForm.setFieldsValue({
  "FGPTWeight": FGPTfromCad.toFixed(2)
 })
let weight925fromCad = Number(FG18KTfromCad)*1.497
variantForm.setFieldsValue({
  "925Weight": weight925fromCad.toFixed(2)
})
let mimValue =Number(FG18KTfromCad)-(Number(FG18KTfromCad)*0.05)
let maxValue =Number(FG18KTfromCad)+(Number(FG18KTfromCad)*0.05)
let min14Value = Number(FG14KTfromCad)-(Number(FG14KTfromCad)*0.05)
let max14Value = Number(FG14KTfromCad)+(Number(FG14KTfromCad)*0.05)
let minValuePT = Number(FGPTfromCad)-(Number(FGPTfromCad)*0.05)
let maxValuePT = Number(FGPTfromCad)+(Number(FGPTfromCad)*0.05)
variantForm.setFieldsValue({
  "18KTGoldMin5%":mimValue.toFixed(2),
  "18KTGoldMax5%":maxValue.toFixed(2),
  "14KTGoldMin5%":min14Value.toFixed(2),
  "14KTGoldMax5%":max14Value.toFixed(2),
  "FTGoldMin5%":minValuePT.toFixed(2),
  "FTGoldMax5%":maxValuePT.toFixed(2)
})
  
}

const getFindWeight =(e)=>{
 setFindWeight(e.target.value)
 let FG18KTfromfind = Number(cadWeight)+Number(e.target.value)
 variantForm.setFieldsValue({
  "FG18KT" : FG18KTfromfind.toFixed(2)
})
let FG14KTfromFind = Number(FG18KTfromfind)*0.85
 variantForm.setFieldsValue({
  "FG14KT": FG14KTfromFind.toFixed(2)
 })
 let FGPTfromfind = Number(FG18KTfromfind)*1.42
 variantForm.setFieldsValue({
  "FGPTWeight": FGPTfromfind.toFixed(2)
 })
 let weight925fromfind = Number(FG18KTfromfind)*1.497
variantForm.setFieldsValue({
  "925Weight": weight925fromfind.toFixed(2)
})
let mimValue =Number(FG18KTfromfind)-(Number(FG18KTfromfind)*0.05)
let maxValue =Number(FG18KTfromfind)+(Number(FG18KTfromfind)*0.05)
let min14Value = Number(FG14KTfromFind)-(Number(FG14KTfromFind)*0.05)
let max14Value = Number(FG14KTfromFind)+(Number(FG14KTfromFind)*0.05)
let minValuePT = Number(FGPTfromfind)-(Number(FGPTfromfind)*0.05)
let maxValuePT = Number(FGPTfromfind)+(Number(FGPTfromfind)*0.05)
variantForm.setFieldsValue({
  "18KTGoldMin5%":mimValue.toFixed(2),
  "18KTGoldMax5%":maxValue.toFixed(2),
  "14KTGoldMin5%":min14Value.toFixed(2),
  "14KTGoldMax5%":max14Value.toFixed(2),
  "FTGoldMin5%":minValuePT.toFixed(2),
  "FTGoldMax5%":maxValuePT.toFixed(2)
})
}

  // ===========
const editProduct = (record)=>{
  setSolitaireVisible(true)
  setDiamondVisible(true)
  setColourStoneVisible(true)
    const cadCheckboxvalue = record.variantObject.createCad
    setVariantImgVisible(true)
    setId(record.plmDesignVarientId)
    setVariantCreation(true)
    let data = record.variantObject
    setCadValue(data['createCad'])
    setVariantSrc(data.designImage)
    // variantForm.setFieldsValue({
    //   designImage:
    // })
    if(data['solitaireData']){
      let solitaireQty = 0
      let weight = 0
      data['solitaireData'].map((element)=>{
        solitaireQty = Number(element.quantity)  +Number(solitaireQty) 
        weight =  Number(element.totalWeight)  +Number(weight)
      })
      setQuantity(Number(solitaireQty).toFixed(2))
      setWeight(Number(weight).toFixed(2))
     }

     if(data['colourStone']){
          let Qty = 0
          let weight = 0
          data['colourStone'].map((element)=>{
            Qty = Number(element.quantity)  +Number(Qty)
        weight =  Number(element.totalWeight)  +Number(weight)
          })
          setColourStoneQuantity(Number(Qty).toFixed(2))
          setColourStoneWeight(Number(weight).toFixed(3))
    }


    if(data['sideDiamond']){
              let Qty = 0
              let weight = 0
              data['sideDiamond'].map((element)=>{
                Qty = Number(element.quantity)  +Number(Qty) 
                weight =  Number(element.totalWeight)  +Number(weight)
              })
              setDiamondQuantity(Number(Qty).toFixed(2))
              setDiamondWeight(Number(weight).toFixed(2))
    }
    //
    variantForm.setFieldsValue({
      'designImage':data.designImage,
      '14KTGoldMin5%': data['14KTGoldMin5%'],
      '14KTGoldMax5%': data['14KTGoldMax5%'],
      'description':record.description,
      // 'createCad': data['createCad'] === "Y" ? true : false,
      '18KTGoldMin5%': data['18KTGoldMin5%'],
      '18KTGoldMax5%': data['18KTGoldMax5%'],
      '925Weight': data['925Weight'],
      'ApprovalDate': moment(data['ApprovalDate']),
      'ApprovedBy': data['ApprovedBy'],
      'Exclusivity': data['Exclusivity'],
      'FG14KT': data['FG14KT'],
      'FG18KT': data['FG18KT'],
      'FGPTWeight': data['FGPTWeight'],
      'FTGoldMax5%': data['FTGoldMax5%'],
      'FTGoldMin5%': data['FTGoldMin5%'],
      'ImageUrl': data['ImageUrl'],
      'MRP': Number(data['MRP']).toFixed(2),
      'MountRatio': Number(data['MountRatio']).toFixed(2),
      'SkuCreationDate': moment(data['SkuCreationDate']),
      'SkuCreatorName': data['SkuCreatorName'],
      'SolitareRatio': Number(data['SolitareRatio']).toFixed(2),
      'cadWeight': data['cadWeight'],
      'camWeight': data['camWeight'],
      'colourStone': data['colourStone'] ,
      'findingWeight': data['findingWeight'],
      'jewelCADVolume': data['jewelCADVolume'],
      'noOfcomponents': data['noOfcomponents'],
      'productSize': data['productSize'],
      'sideDiamond': data['sideDiamond'],
      'solitaireData': data['solitaireData'],
      'totalQuantity': Number(data['totalQuantity']).toFixed(2),
      'totalWeight': Number(data['totalWeight']).toFixed(2),
      'CADdesignerName':data['CADdesignerName'] 
    });
  }	

     
  
  const deleteRow =(record)=>{	
    let newData = []	
    setId(record.plmDesignVarientId)
    data.forEach((element)=>{	
      if(element.plmDesignVarientId !== record.plmDesignVarientId){	
        newData.push(element)	
      }	
    })
    setData(newData)
    createVari("Delete",record.plmDesignVarientId,record.variantObject)
  }	
  
  const getCadValue =(e)=>{
    const checkedValue =  e.target.checked
    if(checkedValue === true){
      setCadValue("Y")
    }else{
      setCadValue("N")
    }
  }

  useEffect(() => {
    getVarientsData(recordId);
  }, [recordId])

  const getVarientsData = async (recordId) => {
    let varientsData = await getVarients(recordId);
    let newArry = [];
    varientsData?.map((value) => {
      let attributeData = value.variantObject;
      value.variantObject = JSON.parse(attributeData)
      newArry.push(value);
    });
if(newArry.length>0){
    setData(newArry)
}
  };

  const {Panel}=Collapse;

  const createVariant = ()=>{	
    variantForm.resetFields()
    setColourStoneQuantity(0)
    setColourStoneWeight(0)
    setDiamondQuantity(0)
    setDiamondWeight(0)
    setQuantity(0)
    setWeight(0)
    setVariantCreation(true)
  }	

  const createVariantData =()=>{
    setVariantImgVisible(false)
    setVariantSrc('')
    let finalData = [...data]
    let type
    let uniqueId 
    let index = data.findIndex((element) => {
      return element.plmDesignVarientId === id;
    });
    if (index >= 0) {
      uniqueId = id
      type = "Update" 

    }else{
      type = "New"
       uniqueId = uuid().replace(/-/g, "").toUpperCase();
    }
    setSolitaireVisible(false)
    setDiamondVisible(false)
    setColourStoneVisible(false)
    createVari(type,uniqueId,cadValue)
    setData(finalData)
  }	
  
  const variantModalClose=()=>{	
    setVariantImgVisible(false)
    setVariantSrc('')
    setVariantCreation(false)
    setSolitaireVisible(false)
    setDiamondVisible(false)
    setColourStoneVisible(false)
    setId('')
  }

  // service Calls start
  const getBunitId = async () => {
    const productCategory = await getProductCategoryData();
    setBunitData(productCategory.searchData);
  };

  const getSubProduct = async () => {
    const subProductResponse = await getSubProductData();
    setSubProductData(subProductResponse.searchData);
  };

  const getDesignByData = async () => {
    const designByRes = await getDesignedByData();
     setDesignedByData(designByRes);
  }

  const getSkecthRef = async () => {
    // {\"sketch_code\":\"\"}
    const valuesObj ={sketch_code:""}
    const stringifiedJSON = JSON.stringify(valuesObj);
    const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
    const skecthRes = await getSketchRefData(jsonToSend);
    setSkecthData(skecthRes);
  };


  const onChange = async (e) => {
    const subProductResponse = await getSubProductData(e);
    setSubProductData(subProductResponse.searchData);
  };
  // service Calls end

  const getData = async (recordId) => {
    const productResponse = await getDesignDetails(recordId);
    setLoading(false);
    let obj ={}
    let flag2 = false
    for(let i=0;i<productResponse[0].metaLines.length;i++){
      obj[`${productResponse[0].metaLines[i].key}`]  = productResponse[0].metaLines[i].value
      if(productResponse[0].metaLines[i].key === "Design_Object" && productResponse[0].metaLines[i].value !== ""){
        flag2 = true
        setWeightData(JSON.parse(productResponse[0].metaLines[i].value ))
      }
    }
    form.setFieldsValue(obj)
    form.setFieldsValue({
      designImage:productResponse[0].image,
      productCategory: productResponse[0].subProductName,
      designName: productResponse[0].designName,
      designCode: productResponse[0].designcode,
      product: productResponse[0]?.productName,
      subProduct: productResponse[0].categoryName,
      designedBy: productResponse[0].disignerName,
      sketchReference: productResponse[0].sketchName,
      designDescription: productResponse[0].description,
    });
    let flag1 
    if(productResponse[0].subProductName !== ""){
      flag1 = true
    }
    
    productResponse[0].attributes.map((element)=>{
      if(element.name === "SKU Weight (gm)" && flag1 && flag2){
        setFlag({"flag":true,'flag1':true})
      }
    })

    if (productResponse[0].image === "undefined" || productResponse[0].image === null) {
      setImageVisible(false);
      setImgSrc('')
    }else{
      setImageVisible(true);
      setImgSrc(productResponse[0].image);
    }
    setProductCategoryId(productResponse[0].productCategory);
    setSketchRef(productResponse[0].sketchId);
    setDesignedById(productResponse[0].designedBy);
    setSubProductId(productResponse[0].subProduct);
    setDesignId(productResponse[0].plmDesignId);
    setDesignCode(productResponse[0].designcode);
    setDesignName(productResponse[0].designName);
    setBUnitId(productResponse[0].bunitId);
    SetEnableFlag(productResponse[0].isActive)
    setProductId(productResponse[0].product);
    if (productResponse[0].attributes.length > 0) {
      FormValuesData(productResponse[0].attributes);
    }
  };

  const FormValuesData = (FormData) => {
    if (FormData.length > 0) {
      for (let i = 0; i < FormData?.length; i++) {
        if (FormData[i].referenceValue?.includes(",")) {
          FormData[i].data = FormData[i].referenceValue.split(",");
          FormData[i].data1 = FormData[i].value.split(",");
        } else {
          FormData[i].data = [];
          let data = FormData[i].referenceValue ? FormData[i].referenceValue : null;
          FormData[i].data.push(data);
          FormData[i].data1 = [];
          let data1 = FormData[i].value ? FormData[i].value : null;
          FormData[i].data1.push(data1);
        }
      }
      setFormData(FormData);
      setFormVisible(true);
    } else {
      setFormData([]);
      setFormVisible(false);
    }
  };

  const getFormData = async (e) => {
    
  };


  const imageUploadStatusChange = (uploadStatus) => {
    const fieldsToUpdate = {};
    fieldsToUpdate["item"] = uploadStatus.file.response;
    form.setFieldsValue({
      designImage: uploadStatus.file.response,
    });
  };

  const getVariantImage =(uploadStatus)=>{
    const fieldsToUpdate = {};
    fieldsToUpdate["item"] = uploadStatus.file.response;
    variantForm.setFieldsValue({
      designImage: uploadStatus.file.response,
    });
  }

  // getting form field's id's start
  const getBusUnitId = (e) => {
    // setBUnitId(e);
    setProductCategoryId(e);
  };

  const getProductId = async(e) => {
    setProductId(e);
  };

  const getsubProcuctId = async(e) => {
    getFormData(e);
    setSubProductId(e);
    const valuesObj ={parentcategory:e}
    const stringifiedJSON = JSON.stringify(valuesObj);
    const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
    const childData = await getChildProductCategory(jsonToSend) 
    setProductData(childData)
    getMetalWeightData()
  };
  const getDesignedById = (e) => {
    setDesignedById(e);
  };
  const getSketchRef = (e) => {
    setSketchRef(e);
  };

  const getDesignCode = (e) => {
    setDesignCode(e.target.value);
  };

  const getDesignName = (e) => {
    setDesignName(e.target.value);
  };

  const onChangeData =(data)=>{
setDesignDetails(data)
  }

  const onClickNew = ()=>{
    setImageVisible(false)
    setDesignId('')
  }

  // upsert services start
  const createDesignDetails = () => {
    const headerFormValues = headerForm.getFieldsValue(true);
    form.validateFields().then((values) => {
      const formValues = form.getFieldsValue(true);
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      let uniqueId = uuid().replace(/-/g, "").toUpperCase();
      if (formData.length > 0) {
        setLoading(true);
        const arrayForMutation = [];
        Object.entries(headerFormValues).map((item) => {
        let uniqueId1 = uuid().replace(/-/g, "").toUpperCase();
        for (let i = 0; i < formData.length; i++) {
            if (formData[i].designAttributeId === item[0]) {
              arrayForMutation.push(`{
                designAttributeId : "${formData[i].designAttributeId}",
                lineAttributeId: "${formData[i].lineAttributeId ? formData[i].lineAttributeId : uniqueId1}",
                varient: "${formData[i].varient}",
                value: "${item[1]}"
              }`);
            }
          }
          });

        let metaArry = []
        Object.entries(formValues).map((item) => {
          if (item[0] === "cstomer/Market" || item[0] === "gender" || item[0] === "targetedAge2" || item[0] === "targetedAge1" || item[0] === "collection" ) {
            let uniqueId2 = uuid().replace(/-/g, "").toUpperCase();
            metaArry.push(`{
              key:"${item[0]}"
              value:"${item[1]}"
              plmDesignMetaId:"${uniqueId2}"
            }`);
          }
        });
        let uniqueId3 = uuid().replace(/-/g, "").toUpperCase();
        if(weightData.string !== undefined && weightData.string !== null ){
          metaArry.push(`{
            key:"Design_Object"
            value:${weightData.string}
            plmDesignMetaId:"${uniqueId3}"
          }`);
        }
      

        const create = {
          query: `mutation {
            upsertDesign(design: {
             productCategory:"${productCategoryId}"
             plmDesignId: "${designId ? designId : uniqueId}"
             designcode: "${formValues.designCode}"
             designName: "${formValues.designName}" 
             bunitId: "${bUnitId ? bUnitId : 0}"
             image: "${formValues?.designImage}"
             description: ${JSON.stringify(formValues.designDescription)}
             designedBy: ${designedById ? `"${designedById}"` : null}
             sketchId:  ${sketchRef ? `"${sketchRef}"` : null}
             subProduct: ${subProductId ? `"${subProductId}"` : null}
             product: ${productId ? `"${productId}"` : null}
             attributes: [${arrayForMutation}]
             metaLines:  [${metaArry}]
          
             }) { 
          status
          message   
          }
          }`,
        };
        Axios({
          url: serverUrl,
          method: "POST",
          data: create,
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${newToken}`,
          },
        }).then((response) => {
          if (response.data.data.upsertDesign.status === "200") {
            message.success(response.data.data.upsertDesign.message);
            setLoading(false);
            form.resetFields();
            headerForm.resetFields();
            setFormVisible(false);
            setDesignName("");
            setDesignCode("");
            if(designId){
            headerForm.resetFields()
            history.push(`/others/window/7447`)
            }else{
              headerForm.resetFields()
              history.push(`/others/window/7447/${designId ? designId : uniqueId}`)
               window.location.reload();
            }
            setVariantVisible(true)
          } else {
            setLoading(false);
            setImgSrc('')
            message.error("getting error while creating lines");
          }
        });
      } else {
        message.error("select product");
      }
    });
  };

  const createVari =(operation,plmId,data)=>{
    setLoading(true)
    const variantDetails = operation === "Delete" ? data : variantForm.getFieldsValue(true)
    const newToken = JSON.parse(localStorage.getItem("authTokens"));
    const newArry = []
    const metaArry = []
    const colourStoneArry = []
    const solitaireArry = []
    const sideDiamondArry = []
      // setImgSrc(variantDetails.designImage)
    Object.entries(variantDetails).map((element)=>{
      if(element[0]=== "colourStone"){
        element[1].map((item)=>{
          const stringifiedJSON = JSON.stringify(item);
          const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
          colourStoneArry.push(jsonToSend) 
        })
      }

      if(element[0]=== "solitaireData"){
        element[1].map((item)=>{
          const stringifiedJSON = JSON.stringify(item);
          const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
          solitaireArry.push(jsonToSend) 
        })
      }
      if(element[0]=== "sideDiamond"){
        element[1].map((item)=>{
          const stringifiedJSON = JSON.stringify(item);
          const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
          sideDiamondArry.push(jsonToSend) 
        })
      }
    })
    let name = `${designCode} ${variantDetails?.solitaireData[0]?.pointerWeight} ${variantDetails?.productSize}`

  let data1 = `"{\\"designImage\\":${variantDetails.designImage === undefined || variantDetails.designImage === null ? null : `\\"${variantDetails.designImage}\\"`}, \\"createCad\\":${cadValue === undefined  || cadValue === null ? null : `\\"${cadValue}\\"`},\\"SkuCreatorName\\":${ variantDetails.SkuCreatorName === undefined || variantDetails.SkuCreatorName === null ? null : `\\"${variantDetails.SkuCreatorName}\\"`},\\"SkuCreationDate\\":${variantDetails.SkuCreationDate === undefined || variantDetails.SkuCreationDate === null ? null : `\\"${moment(variantDetails.SkuCreationDate ).format("YYYY-MM-DD")}\\"`},\\"Exclusivity\\":${ variantDetails.Exclusivity  === undefined || variantDetails.Exclusivity === null ? null : `\\"${variantDetails.Exclusivity }\\"`}, \\"totalQuantity\\":${ variantDetails.totalQuantity  === undefined || variantDetails.totalQuantity  === null ? null : variantDetails.totalQuantity },\\"totalWeight\\":${variantDetails.totalWeight  === undefined || variantDetails.totalWeight  === null ? null : variantDetails.totalWeight}, \\"noOfcomponents\\":${ variantDetails.noOfcomponents === undefined || variantDetails.noOfcomponents === null ? null : `\\"${variantDetails.noOfcomponents}\\"`},\\"productSize\\":${variantDetails.productSize === undefined || variantDetails.productSize === null ? null : `\\"${variantDetails.productSize}\\"`},\\"jewelCADVolume\\":${ variantDetails.jewelCADVolume === undefined || variantDetails.jewelCADVolume === null ? null : `\\"${variantDetails.jewelCADVolume}\\"`},\\"camWeight\\":${variantDetails.camWeight === undefined || variantDetails.camWeight === null ? null : `\\"${variantDetails.camWeight}\\"`}, \\"cadWeight\\":${ variantDetails.cadWeight === undefined || variantDetails.cadWeight === null ? null : `\\"${variantDetails.cadWeight}\\"`},\\"findingWeight\\":${variantDetails.findingWeight === undefined || variantDetails.findingWeight === null ? null : `\\"${variantDetails.findingWeight}\\"`}, \\"FG18KT\\":${ variantDetails.FG18KT === undefined || variantDetails.FG18KT === null ? null : `\\"${variantDetails.FG18KT}\\"`}, \\"FG14KT\\":${ variantDetails.FG14KT=== undefined || variantDetails.FG14KT=== null ? null : `\\"${variantDetails.FG14KT}\\"`},\\"FGPTWeight\\":${variantDetails.FGPTWeight === undefined || variantDetails.FGPTWeight === null ? null : `\\"${variantDetails.FGPTWeight}\\"`}, \\"925Weight\\":${ variantDetails['925Weight'] === undefined || variantDetails['925Weight'] === null ? null : `\\"${variantDetails['925Weight']}\\"`},\\"18KTGoldMin5%\\":${variantDetails['18KTGoldMin5%']  === undefined ||variantDetails['18KTGoldMin5%']  === null ? null : `\\"${variantDetails['18KTGoldMin5%'] }\\"`}, \\"14KTGoldMin5%\\":${variantDetails['14KTGoldMin5%'] === undefined || variantDetails['14KTGoldMin5%'] === null ? null : `\\"${variantDetails['14KTGoldMin5%']}\\"`},\\"FTGoldMax5%\\":${variantDetails['FTGoldMax5%'] === undefined || variantDetails['FTGoldMax5%'] === null ? null : `\\"${variantDetails['FTGoldMax5%'] }\\"`},\\"FTGoldMin5%\\":${variantDetails['FTGoldMin5%'] === undefined || variantDetails['FTGoldMin5%'] === null ? null : `\\"${variantDetails['FTGoldMin5%'] }\\"`}, \\"MRP\\":${ variantDetails.MRP === undefined || variantDetails.MRP === null ? null : `\\"${variantDetails.MRP}\\"`},\\"SolitareRatio\\":${variantDetails.SolitareRatio === undefined || variantDetails.SolitareRatio === null ? null : `\\"${variantDetails.SolitareRatio}\\"`}, \\"MountRatio\\":${ variantDetails.MountRatio === undefined || variantDetails.MountRatio === null ? null : `\\"${variantDetails.MountRatio}\\"`},\\"ImageUrl\\":${variantDetails.ImageUrl === undefined || variantDetails.ImageUrl === null ? null : `\\"${variantDetails.ImageUrl}\\"`},\\"ApprovalDate\\":${variantDetails.ApprovalDate === undefined || variantDetails.ApprovalDate === null ? null : `\\"${moment(variantDetails.ApprovalDate).format("YYYY-MM-DD")}\\"`}, \\"ApprovedBy\\":${variantDetails.ApprovedBy === undefined || variantDetails.ApprovedBy === null ? null : `\\"${variantDetails.ApprovedBy}\\"`},\\"solitaireData\\":[${solitaireArry}],\\"sideDiamond\\":[${ sideDiamondArry}],\\"14KTGoldMax5%\\":${variantDetails['14KTGoldMax5%'] === undefined || variantDetails['14KTGoldMax5%'] === null ? null : `\\"${variantDetails['14KTGoldMax5%']}\\"`},\\"18KTGoldMax5%\\":${variantDetails['18KTGoldMax5%'] === undefined || variantDetails['18KTGoldMax5%'] === null ? null : `\\"${variantDetails['18KTGoldMax5%']}\\"`},\\"CADdesignerName\\":${variantDetails['CADdesignerName'] === undefined || variantDetails['CADdesignerName'] === null ? null : `\\"${variantDetails['CADdesignerName']}\\"`},\\"colourStone\\":[${colourStoneArry}]}"`
          const createVari = {
             query: `mutation {
              upsertVariant(design: {
                 plmDesignId: "${recordId}"
                image: "imageUrl"
               description: "description"
               designStatus: "${cadValue}"
               plmDesignVarientId: "${plmId}"
               operations: "${operation}"
               metaVariants:[${metaArry}]
               variantObject:${data1}
               name: "${name}"
               variantAttributes: [${newArry}]
               }) { 
            status
            message   
            }
            }`,
          }
          Axios({
            url: serverUrl,
            method: "POST",
            data: createVari,
            headers: {
              "Content-Type": "application/json",
              Authorization: `bearer ${newToken}`,
            },
          }).then((response)=>{
            if(response.data.data.upsertVariant.status === "200"){
              message.success(response.data.data.upsertVariant.message);
              setVariantCreation(false)
              setId('')
              setQuantity('')
              setWeight('')
              setDiamondQuantity()
              setDiamondWeight('')
              setColourStoneQuantity('')
              setColourStoneWeight('')
              window.location.reload()
              setLoading(false)
              variantForm.resetFields()

            }else{
        setLoading(false)
        message.error("getting error while creating variant");
            }
          })
        }


    const enableDesign= async()=>{
    const response = await getEnableProduct(recordId)
    if(response.status === "200"){
      message.success(response.message)
      SetEnableFlag("Y")
    }else{
      message.error(response.message)
    }
  }

  const desableDesign= async()=>{
    const response = await getDisableProduct(recordId)
    if(response.status === "200"){
      message.success(response.message)
      SetEnableFlag("N")
    }else{
      message.error(response.message)
    }
  }


  // let metalWeightArray = []
 
  let metalWeightArray = [
    {gender:"MEN",
    data:[{"ringSize":10,"percentage":-30},
    {"ringSize":11,	"percentage":-27},
    {"ringSize":12,	"percentage":-24},
    {"ringSize":13,	"percentage":-21},
    {"ringSize":14,	"percentage":-18},
    {"ringSize":15,	"percentage":-15},
    {"ringSize":16,	"percentage":-12},
    {"ringSize":17,	"percentage":-9},
    {"ringSize":18,	"percentage":-6},
    {"ringSize":19,	"percentage":-3},
    {"ringSize":20,	"percentage":0},
    {"ringSize":21,	"percentage":3},
    {"ringSize":22,	"percentage":6},
    {"ringSize":23,	"percentage":9},
    {"ringSize":24,	"percentage":12},
    {"ringSize":25,	"percentage":15},
    {"ringSize":26,	"percentage":18},
    {"ringSize":27,	"percentage":21},
    {"ringSize":28,	"percentage":24},
    {"ringSize":29,	"percentage":27}
  ]},
    
    {gender:"WOMEN",
    data:[
    {"ringSize":10,	"percentage":-30},
    {"ringSize":11,	"percentage":-27},
    {"ringSize":12,	"percentage":-24},
    {"ringSize":13,	"percentage":-21},
    {"ringSize":14,	"percentage":-18},
    {"ringSize":15,	"percentage":-15},
    {"ringSize":16,	"percentage":-12},
    {"ringSize":17,	"percentage":-9},
    {"ringSize":18,	"percentage":-6},
    {"ringSize":19,	"percentage":-3},
    {"ringSize":20,	"percentage":0},
    {"ringSize":21,	"percentage":3},
    {"ringSize":22,	"percentage":6},
    {"ringSize":23,	"percentage":9},
    {"ringSize":24,	"percentage":12},
    {"ringSize":25,	"percentage":15},
    {"ringSize":26,	"percentage":18},
    {"ringSize":27,	"percentage":21},
    {"ringSize":28,	"percentage":24},
    {"ringSize":29,	"percentage":27}
    ]}
      ]

  const weightColumns =[
    {
      title:'Gender',
      dataIndex:'gender',
      key:'ringSize',
      render:(text, record) => {
        return record.gender;
      },
    },
    {
      title:'Ring Size',
      dataIndex:'ringSize',
      key:'ringSize',
      render:(text, record) => {
        return record.ringSize;
      },
    },
    {
      title:'Percentage',
      dataIndex:'percentage',
      key:'percentage',
      render:(text, record) => {
        return record.percentage;
      },
    },
    {
      title:'Weight',
      dataIndex:'weight',
      key:'weight',
      render:(text, record) => {
        return record.weight;
      },
    },
    

  ]



  const getMetalWeightData =(type)=>async(e)=>{
    // let formData1 = []
    let flag1 = false
    let weight=0

    if(type === "1"){
      getFormData(e);
    setSubProductId(e);
    setLoading(true)
    const valuesObj ={parentcategory:e}
    const stringifiedJSON = JSON.stringify(valuesObj);
    const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
    const childData = await getChildProductCategory(jsonToSend) 
    setProductData(childData)
    // getMetalWeightData()
    const FormData = await getProductCategoryAttribute(e);
    FormData.forEach((element) => {
      if (element.value) {
        element.referenceValue = element.value;
      }
    });
    FormValuesData(FormData);
    for(let i=0;i<FormData.length;i++){
      if(FormData[i].name === "SKU Weight (gm)"){
        weight = FormData[i].value
        flag1 = true
      }
    }

    // formData1.push(FormData)
    setLoading(false)
    
      setFlag({"flag":flag1,'flag1':flag.flag1})
    }

    if(type === "2"){
      for(let i=0;i<formData.length;i++){
        if(formData[i].name === "SKU Weight (gm)"){
          weight = formData[i].value
          flag1 = true
        }
      }
      let data = []
        metalWeightArray.map((element)=>{
              if(element.gender === e){
                element.data.map((item)=>{
                  let percentage = item.percentage.toString()
                  percentage = percentage.includes("-") ? 100-(percentage.substring(1)) :100+ Number(percentage)
                  item.weight = weight*(0.01*percentage).toFixed(2) 
                  item.weight = item.weight.toFixed(2)
                  item.gender = e
                data.push(item)
                })
              }
        })
        
          setFlag({'flag':flag.flag,'flag1':flag1})
        let string = JSON.stringify(JSON.stringify(data))
        data.string = string
        setWeightData(data)
    }

    
  }


  const openWeightModal =()=>{
    setWeightModal(true)
  }

  const onChangeInputNumber=(type)=>(e)=>{
    let data = []
    if(type === "SKU Weight (gm)"){
      weightData.map((item)=>{
            let percentage = item.percentage.toString()
            percentage = percentage.includes("-") ? 100-(percentage.substring(1)) :100+ Number(percentage)
            item.weight = e*(0.01*percentage).toFixed(2) 
            item.weight = item.weight.toFixed(2)
          data.push(item)
  })

  let string = JSON.stringify(JSON.stringify(data))
  data.string = string
  setWeightData(data)
    }
  }

  const onChangeSlide = value =>{
    if (value[0]< value[1]){
      setMin(value[0])
      setMax(value[1])
    }
  }

  const solitaireShape = ["3X3","3.37 X 3.37","3.59X 3.59","3.90","4.26","4.65","4.87","5.05","5.36","5.65","5.90","6.14","6.36","6.90","7.35","7.66","8.09","8.71"]
  const sideDiamondDataArr = [
    {SideDiamondSieve:"000-00",	    size:"0.9X0.9"		,PointerWeight:"0.004"},	
    {SideDiamondSieve:"00-0",	    size:"1X1"  ,PointerWeight:"0.005"},
    {SideDiamondSieve:"0-1"		    ,size:"1.1X1.1"		,PointerWeight:"0.006"},
    {SideDiamondSieve:"1.00-1.5"    ,size:"1.15"		,PointerWeight:"0.007"},
    {SideDiamondSieve:"1.50-2.00"   ,size:"1.20"		,PointerWeight:"0.008"},	
    {SideDiamondSieve:"2.00-2.50"   ,size:"1.25"		,PointerWeight:"0.009"},	
    {SideDiamondSieve:"2.50-3.00"   ,size:"1.30"		,PointerWeight:"0.010"},	
    {SideDiamondSieve:"3.00-3.50"   ,size:"1.35"		,PointerWeight:"0.011"},	
    {SideDiamondSieve:"3.50-4.00"   ,size:"1.40"		,PointerWeight:"0.012"},	
    {SideDiamondSieve:"4.00-4.50"   ,size:"1.45"		,PointerWeight:"0.014"},	
    {SideDiamondSieve:"4.50-5.00"   ,size:"1.50"		,PointerWeight:"0.015"},	
    {SideDiamondSieve:"5.00-5.50"   ,size:"1.55"		,PointerWeight:"0.016"},	
    {SideDiamondSieve:"5.50-6.00"   ,size:"1.60"		,PointerWeight:"0.019"},	
    {SideDiamondSieve:"6.00-6.50"   ,size:"1.70"		,PointerWeight:"0.022"},	
    {SideDiamondSieve:"6.50-7.00"   ,size:"1.80"		,PointerWeight:"0.026"},	
    {SideDiamondSieve:"7.00-7.50"   ,size:"1.90"		,PointerWeight:"0.030"},	
    {SideDiamondSieve:"7.50-8.00"   ,size:"2.00"		,PointerWeight:"0.035"},	
    {SideDiamondSieve:"8.00-8.50"   ,size:"2.10"		,PointerWeight:"0.040"},	
    {SideDiamondSieve:"8.50-9.00"   ,size:"2.20"		,PointerWeight:"0.045"},	
    {SideDiamondSieve:"9.00-9.50"   ,size:"2.30"		,PointerWeight:"0.051"},	
    {SideDiamondSieve:"9.50-10.00"  ,size:"2.40"		,PointerWeight:"0.058"},	
    {SideDiamondSieve:"10.00-10.50" ,size:"2.50"		,PointerWeight:"0.064"},	
    {SideDiamondSieve:"10.50-11.00" ,size:"2.60"		,PointerWeight:"0.073"},	
    {SideDiamondSieve:"11.00-11.50" ,size:"2.70"		,PointerWeight:"0.080"},	
    {SideDiamondSieve:"11.50-12.00" ,size:"2.80"		,PointerWeight:"0.086"}]

  const getSolitaireSlab =(name)=>(e,index)=>{
    let formData = variantForm.getFieldsValue(true)
    let data = e.split("-")
    formData.solitaireData[name].pointerWeight = data[0]
    formData.solitaireData[name].size = solitaireShape[index.key]
    variantForm.setFieldsValue({
      solitaireData:formData.solitaireData
    })
  }

  const getDiamondData =(name)=>(e,ind)=>{
    let formData = variantForm.getFieldsValue(true)
    formData.sideDiamond[name].size = sideDiamondDataArr[ind.key].size
    formData.sideDiamond[name].pointerWeight = sideDiamondDataArr[ind.key].PointerWeight
    variantForm.setFieldsValue({
      sideDiamond:formData.sideDiamond
    })
  }

// const onChangeMin = value => {
//   if(max>value){
//     setMin(value)
//   }
// }
// const onAfterChange= value =>{
// }
// const onChangeMax = value => {
//   if(min<value){
//     setMax(value)
//   }
// }
  return (
    <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
      {isTableVisible ? (
       <div style={{height:'89vh', overflow:'auto'}}>
          <Row>
            <Col span={12} style={{ display: "flex", flexDirection: "column" }}>
              <span
                onClick={changePage}
                style={{
                  fontSize: "11px",
                  paddingLeft: "0px",
                  color: "rgb(22, 72, 170)",
                  paddingBottom: "0px",
                  paddingTop: "0px",
                  fontWeight: "500",
                  fontFamily: "Open sans",
                  cursor: "pointer",
                }}
              >
                Product Design
              </span>

              <span style={{ fontSize: "22px", font: "normal normal 600 22px/30px  Open Sans", color: "#666666" }}>
                {designCode} {designName.length !== 0 ? ` - ${designName}` : ""}
              </span>
            </Col>
            <Col span={12}>
            
              <span style={{ float: "right" }}>
                <Button onClick={createDesignDetails} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }}>
                  Save
                </Button>
              </span>
             {enableFlag ==="N" ? <span style={{ float: "right" }}>
                <Button onClick={enableDesign} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }}>
                  Enable
                </Button>
              </span> :
              <span style={{ float: "right" }}>
                <Button onClick={desableDesign} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }}>
                  Disable
                </Button>
              </span>}
            </Col>
          </Row>
          <Card style={{ marginBottom: "8px" }}>
            <Form layout="vertical" form={form}>
              <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    label="Product Category"
                    name="productCategory"
                    rules={[
                      {
                        required: true,
                        message: "Please select Product Category!",
                      },
                    ]}
                    style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}
                  >
                    <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onFocus={getSubProduct}
                      onSelect={getMetalWeightData("1")}
                      onSearch={onChange}
                    >
                      {subProductData.map((data, index) => (
                        <Option key={data.RecordID} value={data.RecordID} title={data.Name}>
                          {data.Name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item label="Product" name="product" style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}>
                    <Select
                      onSelect={getProductId}
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      // onFocus={getProduct}
                    >
                      {productData.map((data, index) => (
                        <Option key={data.m_product_category_id} value={data.m_product_category_id} title={data.name}>
                          {data.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item label="Sub Product" name="subProduct" style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}>
                  <Select
                      // defaultValue="*"
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onFocus={getBunitId}
                      onSelect={getBusUnitId}
                    >
                      {bunitData.map((data, index) => (
                        <Option key={data.RecordID} value={data.RecordID} title={data.Name}>
                          {data.Name}
                        </Option>
                      ))}
                    </Select>
                    
                  </Form.Item>
                </Col>
              </Row>
              <p />
              <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    label="Design Code"
                    name="designCode"
                    rules={[
                      {
                        required: true,
                        message: "Please select Design Code!",
                      },
                    ]}
                    style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}
                  >
                    <Input onChange={getDesignCode}></Input>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Please select Design Name!",
                      },
                    ]}
                    label="Design Name"
                    name="designName"
                    style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}
                  >
                    <Input onChange={getDesignName}></Input>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item label="Designed By" name="designedBy" style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}>
                    <Select
                      onSelect={getDesignedById}
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onFocus = {getDesignByData}
                    >
                      {designedByData.map((data, index) => (
                        <Option key={data.plm_designer_id} value={data.plm_designer_id} title={data.name}>
                          {data.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <p />

              <Row gutter={16}>
                <Col className="gutter-row" span={24}>
                  <Form.Item
                    label="Design Description"
                    name="designDescription"
                    initialValue={description}
                    rules={[
                      {
                        required: true,
                        message: "Please enter description",
                      },
                    ]}
                    style={{ marginBottom: "8px" }}
                  >
                    <ReactQuill
                      theme="snow"
                      // onChange={handleChange}
                      // value={description}
                      modules={{
                        toolbar: [
                          [{ font: [false, "serif", "monospace"] }, { header: [1, 2, 3, 4, 5, 6, false] }],
                          ["bold", "italic", "underline", "strike", "blockquote"],
                          [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                          [{ align: [] }],
                          ["code", "background"],
                          ["code-block", "direction"],
                          ["link", "image", "video"],
                          ["clean"],
                        ],
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <p />
              
              <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                  <Form.Item label="Sketch Reference" name="sketchReference" style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}>
                    <Select onFocus={getSkecthRef} onSelect={getSketchRef} showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      {sketchData.map((data, index) => (
                        <Option key={data.plm_sketch_id} value={data.plm_sketch_id} title={data.sketchname}>
                          {data.sketchname}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  {imageVisible ? (
                    <Form.Item name="designImage">
                    <img style={{ height: 90, width: 90 }} src={imgSrc} /></Form.Item>
                  ) : (
                    <Form.Item label="Design Image" name="designImage" style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}>
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
                  )}
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item label="Customer/Market" name="cstomer/Market" style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}>
                  <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        <Option key={1} value={'india'}>
                          India
                        </Option>
                        <Option key={2} value={'customerSketch'}>
                        Customer Sketch
                        </Option>
                        
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <p/>
              <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    label="Collection"
                    name="collection"
                    style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}
                  >
                    <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        <Option key={1} value={'generic'} >
                          Generic
                        </Option>
                        <Option key={3} value={'nowForever'} >
                          Now & Forever
                        </Option>
                        <Option key={4} value={'Maliha'} >
                          Maliha
                        </Option>
                        <Option key={5} value={'Ballerina'} >
                          Ballerina
                        </Option>
                        <Option key={6} value={'yesIDo'} >
                          Yes I Do
                        </Option>
                        <Option key={7} value={'bornPretty'} >
                          Born Pretty
                        </Option>
                        <Option key={8} value={'beyondBeauty'} >
                          Beyond Beauty
                        </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Row gutter={16}>
                    <Col span={11}>
                    <Form.Item label="Targeted Age" name="targetedAge1" style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}>
                  <Input/>
                  </Form.Item>
                    </Col>
                    <Col span={2} style={{marginTop:'24.84px'}}>
                      <span>to</span>
                    </Col>
                    <Col span={11} style={{marginTop:'23.84px'}}>
                    <Form.Item  name="targetedAge2" style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}>
                  <Input/>
                  </Form.Item>
                    </Col>
                  </Row>
                  
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item label="Gender" name="gender" style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}>
                  <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onSelect={getMetalWeightData("2")}
                    >
                        <Option key={1} value={'MEN'} title={'Male'}>
                          Male
                        </Option>
                        <Option key={2} value={'WOMEN'} title={'Female'}>
                          Female
                        </Option>
                        {/* <Option key={2} value={'unisex'} title={'unisex'}>
                          Unisex
                        </Option> */}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <p/>
              {/* <Row gutter={16}>
              <Col className="gutter-row" span={8}>
              <Form.Item name="startDate" label="Start Date" style={{ color: "#8E8E8E", fontSize: "13px" }}>
                <DatePicker style={{ width: "100%", borderLeft: "none", borderTop: "none", borderRight: "none" }} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item name="estimatedFinisgDate" label="Estimated Finish Date" style={{ color: "#8E8E8E", fontSize: "13px" }}>
                <DatePicker style={{ width: "100%", borderLeft: "none", borderTop: "none", borderRight: "none" }} />
              </Form.Item>
            </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item label="Remarks" name="remarks" style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}>
                  <Input></Input>
                  </Form.Item>
                </Col>
              </Row> */}
            </Form>
          </Card>
          {formVisible ? (
            <Card>
              <Form layout="vertical" form={headerForm}>
                <Row gutter={16}>
                  {formData.map((element) => {
                    {
                      switch (element.type) {
                        case "10":
                          return (
                            <Col className="gutter-row" span={6} style={{ marginBottom: "24px" }}>
                              <Form.Item label={element.name} name={element.designAttributeId} initialValue={element.value}>
                                <Input   />
                              </Form.Item>
                            </Col>
                          );
                        case "17":
                          return (
                            <Col className="gutter-row" span={6} style={{ marginBottom: "24px" }}>
                              <Form.Item initialValue={element.data1} label={element.name} name={element.designAttributeId}>
                                <Select mode="multiple" maxTagCount="responsive" showSearch style={{ width: "100%", marginBottom: "0px" }}>
                                  {element?.data.map((option, index) => (
                                    <Option key={`${index}-${element.designAttributeId}`} value={option}>
                                      {option}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                          );
                        case "15":
                          return (
                            <Col className="gutter-row" span={6} style={{ marginBottom: "24px" }}>
                              <Form.Item initialValue={element? moment(element.value) : null} label={element.name} name={element.designAttributeId}>
                                <DatePicker format={"DD-MM-YYYY"} />
                              </Form.Item>
                            </Col>
                          );
                        case "22":
                          return (
                              <Col className="gutter-row" span={6} style={{ marginBottom: "24px" }}>
                                <Form.Item initialValue={element.value} label={element.name} name={element.designAttributeId} >
                                <InputNumber onChange={onChangeInputNumber(element.name)} style={{ width: "100%", marginBottom: "0px" }}/>
                                </Form.Item>
                              </Col>
                            );
                      }
                    }
                  })}
                  {flag.flag && flag.flag1 ? <Col className="gutter-row" span={6} style={{ marginTop: "24px",cursor:'pointer' }}>
                  <sapn onClick={openWeightModal} style={{color:'#008dff'}}>
                  Manage Metal Weight
                  </sapn>      
                  </Col> : null}
                </Row>
              </Form>
            </Card>
          ) : (
            ""
          )}

<Modal width="60%" centered visible={weightModal} closable={true} okText="Save" onCancel={()=>setWeightModal(false)}>
              <Table size="small" columns={weightColumns} dataSource={weightData}/>
      </Modal>
           {variantVisible ? <Button onClick={createVariant} style={{margin:'8px 0 0 auto',display:'flex',size:'small',justifyContent:'flex-end',color:'rgb(62, 62, 60)'}}>+ Add</Button>	:''}
          {data.map((product, ind) => (	
            <>	
            <div style={{ marginTop: "8px" }}>	
          <Card style={{height:'125px'}}>	
            <Row gutter={16}>	
              <Col className="gutter-row" span={3}>	
                <img src={product?.variantObject?.designImage} style={{ height: "75px", width: "75px" }} />	
              </Col>	
              <Col className="gutter-row" span={5}>	
                <h1 style={{ color: "#8E8E8E", fontSize: "13px" }}>Name</h1>	
              </Col>	
               {/*
              <Col className="gutter-row" span={4}>	
                <h1 style={{ color: "#8E8E8E", fontSize: "13px" }}>Sku Creator Name</h1>	
              </Col>
              <Col className="gutter-row" span={3}>	
                <h1 style={{ color: "#8E8E8E", fontSize: "13px" }}>Sku Created Date</h1>	
              </Col>
              <Col className="gutter-row" span={3}>	
                <h1 style={{ color: "#8E8E8E", fontSize: "13px" }}>Exclusivity</h1>	
              </Col>
              <Col className="gutter-row" span={3}>	
                <h1 style={{ color: "#8E8E8E", fontSize: "13px" }}>CAD Available</h1>	
              </Col> */}
              	
              <Col className="gutter-row" span={16}>	
                <span style={{ float: "right" }}>	
                  {/* <EditOutlined style={{ paddingRight: "15px", fontSize: "18px", color: "#8E8E8E", cursor: "pointer" }} onClick={() => editProduct(product)} />	 */}
              <Button size="small" onClick={() => editProduct(product)} style={{marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "60px", height: "25px",marginRight:'8px'}}>view</Button>
                 <DeleteOutlined onClick={() => deleteRow(product)} style={{ paddingRight: "15px", fontSize: "18px", color: "#8E8E8E", cursor: "pointer" }} />	
                </span>	
              </Col>	
            </Row>
            <Row >
              <Col span={20}>

              </Col>
              <Col span={4}>
              {/* <Button size="small" onClick={() => editProduct(product)} style={{marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "60px", height: "25px",float:'right' }}>view</Button> */}
              </Col>
            </Row>	
            <div style={{
                marginTop: "-50px",
              }}>	
               <Row gutter={16}>	
                <Col className="gutter-row" span={3}></Col>	
                <Col className="gutter-row" span={5}>	
                  <h1 style={{ fontSize: "13px" }}>{product.name ? product.name  : skuName}</h1>	
                </Col>
                </Row>	
              {/*  <Col className="gutter-row" span={4}>	
                  <h1 style={{ fontSize: "13px" }}>{product.data2["SkuCreatorName+"] === null || undefined  ? '' : product.data2["SkuCreatorName+"] }</h1>	
                </Col>	
                <Col className="gutter-row" span={3}>	
                  <h1 style={{ fontSize: "13px" }}>{product.data2["SkuCreationDate+"] === null || undefined ? '' : product.data2["SkuCreationDate+"] }</h1>	
                </Col>	
                <Col className="gutter-row" span={3}>	
                  <h1 style={{ fontSize: "13px" }}>{product.data2["Exclusivity+"] === null || undefined ? '' : product.data2["Exclusivity+"] }</h1>	
                </Col>	
                <Col className="gutter-row" span={3}>	
                  <h1 style={{ fontSize: "13px" }}>{product.designStatus ? product.designStatus : cadValue}</h1>	
                </Col>	
                <Col className="gutter-row" span={3}></Col>	
              	
            <Row gutter={16}>	
            {Object.entries(product?.data).map(((element,ind)=>{
                return(
                  <Col span={3} style={{marginTop:'15px'}}>	
                    <span style={{color: "#8E8E8E",fontSize:'13px',fontWeight:'600'}}> {element[0].split(/(?=[A-Z])/).join(" ")}	</span>
                    <br/>
                    {element[1]}	
                  </Col>
                  )	
            }))}	
              </Row>
              	 
               <Row gutter={16} >
                <Col span={3} style={{marginTop:'10px'}}>
            <span style={{color: "#8E8E8E",fontSize:'13px',fontWeight:'600'}}>Image Url</span>
            <br/>
            <Tooltip placement="top" title={product.data2["ImageUrl+"] !== null && product.data2["ImageUrl+"] !== undefined  ?  product.data2["ImageUrl+"] :''}>
            {product.data2["ImageUrl+"] === null && product.data2["ImageUrl+"] !== undefined  ?  `${ product.data2["ImageUrl+"].substring(0,20) }...` : ''}	
            </Tooltip>
            </Col>	
            {Object.entries(product?.data1).map(((element,ind)=>{
                element[0] = element[0].slice(0,-1)
                return(
                  <Col span={3} style={{marginTop:'10px'}}>	
                    <span style={{'letterSpacing': '0.52px',color: "#8E8E8E",fontSize:'13px',fontWeight:'600'}}>{element[0].split(/(?=[A-Z])/).join(" ")}	</span>
                    <br/>
                    {element[1]}	
                  </Col>)	
            }))}	
              </Row> */}
              
            </div>	

          </Card>	
        </div>	
            </>	
        	
      ))}	
      
      {variantVisible ? <Modal width="90%" centered visible={variantCreation} closable={true} okText="Save" onOk={createVariantData} onCancel={variantModalClose}>
        <div style={{height:'70vh',overflowY:'auto',overflowX:'hidden'}} >
           <Form name="variantForm" layout="vertical" form={variantForm}>
            <Row gutter={16}>
              <Col className="gutter-row" span={8}  >

              {variantImgVisible ? (
                    <Form.Item label="CAD Image" name="designImage" style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}>
                    <img style={{ height: 90, width: 90 }} src={variantSrc} />
                    </Form.Item>

                  ) : (
                    <Form.Item label="CAD Image" name="designImage" style={{ color: "#8E8E8E", fontSize: "13px", marginBottom: "8px" }}>
                      <Upload
                        action="https://sapp.mycw.in/image-manager/uploadImage"
                        listType="picture"
                        headers={{ APIKey: "AUa4koVlpsgR7PZwPVhRdTfUvYsWcjkg" }}
                        name="image"
                        onChange={getVariantImage}
                        maxCount={1}
                      >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                      </Upload>
                    </Form.Item>
                  )}
                    
                </Col>
                <Col span={4} style={{marginTop:'15px'}}>
                  <Form.Item name='createCad'>
                  <Checkbox onChange={getCadValue} checked={cadValue === 'Y' ? true : false}>CAD Available</Checkbox>
                  </Form.Item>
                  </Col>
                  
                <Col className="gutter-row" span={4} style={{ marginBottom: "24px" }}>
                    <Form.Item  label={"SKU Creator Name"} name={'SkuCreatorName'}>
                    <Select mode="multiple" maxTagCount="responsive" showSearch style={{ width: "100%", marginBottom: "0px" }}>
                       <Option key={1}>
                                 Sonal
                                 </Option>
                                 <Option key={2}>
                                 Anushka
                                 </Option>
                                 <Option key={3}>
                                 Manoj
                                 </Option>
                                 <Option key={4}>
                                 Neha
                                 </Option>
                    </Select>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={4} style={{ marginBottom: "24px" }}>
                    <Form.Item label={"SKU Creation Date"} name={'SkuCreationDate'}>
                        <DatePicker format={"DD-MM-YYYY"}/>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={4} style={{ marginBottom: "24px" }}>
                    <Form.Item label={"Exclusivity"} name={'Exclusivity'}>
                    <Input/>
                    </Form.Item>
                </Col>
            </Row>
            {/* 

            {formData.map((element) => {
      switch (element.type) {
        case "ST":
          return (
            <Col className="gutter-row" span={6} style={{ marginBottom: "24px" }}>
              <Form.Item label={element.name} name={`${element.name}-${element.designAttributeId}`} >
                <Input />
              </Form.Item>
            </Col>
          );
        case "LI":
          return (
            <Col className="gutter-row" span={6} style={{ marginBottom: "24px" }}>
              <Form.Item  label={element.name} name={`${element.name}-${element.designAttributeId}`} >
                <Select showSearch >
                  {element?.data.map((option, index) => (
                    <Option key={`${index}-${element.designAttributeId}`} value={option} style={{ width: "100%", marginBottom: "0px" }}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          );
        case "DA":
          return (
            <Col className="gutter-row" span={6} style={{ marginBottom: "24px" }}>
              <Form.Item label={element.name} name={`${element.name}-${element.designAttributeId}`}>
                <DatePicker format={"DD-MM-YYYY"} />
              </Form.Item>
            </Col>
          );
          case "NU":
               return (
                <Col className="gutter-row" span={6} style={{ marginBottom: "24px" }}>
                     <Form.Item  label={element.name} name={`${element.name}-${element.designAttributeId}`} >
                     <InputNumber  style={{ width: "100%", marginBottom: "0px" }}/>
                     </Form.Item>
                 </Col>
          );
                      }
                }
            )}
             */}
             <Collapse>
              <Panel header='Solitaire'>
                <Form.List name='solitaireData'>
                  {(fields,{add,remove})=>(
                   <>
                    <Row gutter={8}>
                   <Col span={24}>
                    <Form.Item>
                           <span style={{ float: "right" }}>
                              <PlusCircleOutlined label="Add"  onClick={() => {
                                setSolitaireVisible(true)
                                add()}}/>
                             </span>
                           </Form.Item>
                           </Col>
                           </Row>
                    {solitaireVisible ? <Row>
                      <Col span={3}>
                        <label style={{marginLeft:'5px'}}>Solitare Slab</label>
                      </Col>
                      <Col span={2}>
                        <label style={{marginLeft:'20px'}}>Shape</label>
                      </Col>
                      <Col span={2}>
                        <label style={{marginLeft:'15px'}}>Size(mm)</label>
                      </Col>
                      <Col span={3}>
                        <label style={{marginLeft:'5px'}}>Pointer Weight</label>
                      </Col>
                      <Col span={2}>
                        <label style={{marginLeft:'20px'}}>Quantity</label>
                      </Col>
                      <Col span={3}>
                        <label style={{marginLeft:'15px'}}>Total Weight</label>
                      </Col>
                      <Col span={3}>
                        <label style={{marginLeft:'15px'}}>Setting Type</label>
                      </Col>
                      <Col span={2}>
                        <label style={{marginLeft:'20px'}}>Quality</label>
                      </Col>
                    </Row> : ''}
                     {fields.map(({key,name,...restField})=>(
                          <Row gutter={16}>
                            <Col span={3}>
                              <Form.Item name={[name,'addSolitare']} {...restField} style={{marginBottom:'8px'}}>
                               <Select allowClear showSearch 
                               onSelect={getSolitaireSlab(name)}
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                 <Option key={0} value = {"0.10-0.13"}>
                                 0.10-0.13
                                 </Option>
                                 <Option key={1} value = {"0.14-0.17"}>
                                 0.14-0.17
                                 </Option>
                                 <Option key={2} value = {"0.18-0.22"}>
                                 0.18-0.22
                                 </Option>
                                 <Option key={3} value = {"0.23-0.29"}>
                                 0.23-0.29
                                 </Option>
                                 <Option key={4} value = {"0.30-0.38"}>
                                 0.30-0.38
                                 </Option>
                                 <Option key={5} value = {"0.39-0.44"}>
                                 0.39-0.44
                                 </Option>
                                 <Option key={6} value = {"0.45-0.49"}>
                                 0.45-0.49
                                 </Option>
                                 <Option key={7} value = {"0.50-0.59"}>
                                 0.50-0.59
                                 </Option>
                                 <Option key={8} value = {"0.60-0.69"}>
                                 0.60-0.69
                                 </Option>
                                 <Option key={9} value = {"0.70-0.79"}>
                                 0.70-0.79
                                 </Option>
                                 <Option key={10} value = {"0.80-0.89"}>
                                 0.80-0.89
                                 </Option>
                                 <Option key={11} value = {"0.90-0.99"}>
                                 0.90-0.99
                                 </Option>
                                 <Option key={12} value = {"1.00-1.23"}>
                                 1.00-1.23
                                 </Option>
                                 <Option key={13} value = {"1.24-1.49"}>
                                 1.24-1.49
                                 </Option>
                                 <Option key={14} value = {"1.50-1.69"}>
                                 1.50-1.69
                                 </Option>
                                 <Option key={15} value = {"1.70-1.99"}>
                                 1.70-1.99
                                 </Option>
                                 <Option key={16} value = {"2.00-2.49"}>
                                 2.00-2.49
                                 </Option>
                                 <Option key={17} value = {"2.50-2.99"}>
                                 2.50-2.99
                                 </Option>
                               </Select>
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Form.Item name={[name,'shape']} {...restField} style={{marginBottom:'8px'}}>
                              <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        <Option key={1} value={"Round"}>
                          Round
                        </Option>
                        <Option key={2} value={"Pear"}>
                          Pear
                        </Option>
                        <Option key={3} value={"Princess"}>
                        Princess
                        </Option>
                        <Option key={4} value={"Oval"}>
                          Oval
                        </Option>
                        <Option key={5} value={"Marquise"}>
                        Marquise
                        </Option>
                        <Option key={6} value={"Baguette"}>
                        Baguette
                        </Option>
                      
                    </Select>
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Form.Item   name={[name, "size"]} {...restField} style={{ marginBottom: "8px" }}>
                                <Select allowClear showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                        {solitaireShape.map((item)=>{
                          return(
                            <Option value={item}>
                                  {item}
                                  </Option>
                          )
                        })}
                                  
                                
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={3}>
                              <Form.Item name={[name,'pointerWeight']} {...restField} style={{marginBottom:'8px'}}>
                                <Select allowClear showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={(e)=>handleQuantityChange("pointerWeight")}>
                                  <Option key={1} value="0.10">
                                    0.10
                                  </Option>
                                  <Option key={2} value="0.14">
                                    0.14
                                  </Option>
                                  <Option key={3} value='0.18'>
                                    0.18
                                  </Option>
                                  <Option key={4} value='0.23'>
                                    0.23
                                  </Option>
                                  <Option key={5} value='0.30'>
                                    0.30
                                  </Option>
                                  <Option key={6} value='0.39'>
                                    0.39
                                  </Option>
                                  <Option key={7} value='0.45'>
                                    0.45
                                  </Option>
                                  <Option key={8} value='0.50'>
                                    0.50
                                  </Option>
                                  <Option key={9} value='0.60'>
                                    0.60
                                  </Option>
                                  <Option key={10} value='0.70'>
                                    0.70
                                  </Option>
                                  <Option key={11} value='0.80'>
                                    0.80
                                  </Option>
                                  <Option key={12} value='0.90'>
                                    0.90
                                  </Option>
                                  <Option key={13} value="1.00">
                                    1.00
                                  </Option>
                                  <Option key={14} value='1.24'>
                                    1.24
                                  </Option>
                                  <Option key={15} value='1.5'>
                                    1.5
                                  </Option>
                                  <Option key={16} value='1.7'>
                                    1.7
                                  </Option>
                                  <Option key={17} value='2'>
                                    2
                                  </Option>
                                  <Option key={18} value='2.5'>
                                    2.5
                                  </Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Form.Item name={[name,'quantity']} {...restField} style={{marginBottom:'8px'}}>
                                <Input onChange={(e)=> handleQuantityChange("solitaire")} />
                              </Form.Item>
                            </Col>
                            <Col span={3}>
                              <Form.Item name={[name,'totalWeight']} {...restField} style={{marginBottom:'8px'}}>
                                <Input onChange={(e)=> handleWeightChange("solitaire")}  />
                              </Form.Item>
                            </Col>
                            <Col span={3}>
                              <Form.Item name={[name,'settingType']} {...restField} style={{marginBottom:'8px'}}>
                              <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        <Option key={1} value={"Prong"}>
                        Prong
                        </Option>
                        <Option key={2} value={"Channel"}>
                          Channel
                        </Option>
                        <Option key={3} value={"BoxProng"}>
                        Box Prong
                        </Option>
                        <Option key={4} value={"U-Rong"}>
                        U- Rong
                        </Option>
                        <Option key={5} value={"PlateProng"}>
                        Plate Prong
                        </Option>
                        <Option key={6} value={"Pave"}>
                        Pave
                        </Option>
                      
                    </Select>
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Form.Item name={[name,'quality']} {...restField} style={{marginBottom:'8px'}}>
                                <Select
                                allowClear
                                showSearch
                                filterOption={(input, option) => option.children.toLowerCase().startsWith(input.toLowerCase())}
                                >
                                  <Option key={1}>
                                    D IF
                                  </Option>
                                  <Option key={2}>
                                    E IF
                                  </Option>
                                  <Option key={3}>
                                    F IF
                                  </Option>
                                  <Option key={4}>
                                    G IF
                                  </Option>
                                  <Option key={5}>
                                    H IF
                                  </Option>
                                  <Option key={6}>
                                    I IF
                                  </Option>
                                  <Option key={7}>
                                    J IF
                                  </Option>
                                  <Option key={8}>
                                    K IF
                                  </Option>
                                  <Option key={9}>
                                    D VVS1
                                  </Option>
                                  <Option key={10}>
                                    E VVS1
                                  </Option>
                                  <Option key={11}>
                                    F VVS1
                                  </Option>
                                  <Option key={12}>
                                    G VVS1
                                  </Option>
                                  <Option key={13}>
                                    H VVS1
                                  </Option>
                                  <Option key={14}>
                                    I VVS1
                                  </Option>
                                  <Option key={15}>
                                    J VVS1
                                  </Option>
                                  <Option key={16}>
                                    K VVS1
                                  </Option>
                                  <Option key={17}>
                                    D VVS2
                                  </Option>
                                  <Option key={18}>
                                    E VVS2
                                  </Option>
                                  <Option key={19}>
                                    F VVS2
                                  </Option>
                                  <Option key={20}>
                                    G VVS2
                                  </Option>
                                  <Option key={21}>
                                    H VVS2
                                  </Option>
                                  <Option key={22}>
                                    I VVS2
                                  </Option>
                                  <Option key={23}>
                                    J VVS2
                                  </Option>
                                  <Option key={24}>
                                    K VVS2
                                  </Option>
                                  <Option key={25}>
                                    D VS1
                                  </Option>
                                  <Option key={26}>
                                    E VS1
                                  </Option>
                                  <Option key={27}>
                                    F VS1
                                  </Option>
                                  <Option key={28}>
                                    G VS1
                                  </Option>
                                  <Option key={29}>
                                    H VS1
                                  </Option>
                                  <Option key={30}>
                                    I VS1
                                  </Option>
                                  <Option key={31}>
                                    J VS1
                                  </Option>
                                  <Option key={32}>
                                    K VS1
                                  </Option>
                                  <Option key={33}>
                                    D VS2
                                  </Option>
                                  <Option key={34}>
                                    E VS2
                                  </Option>
                                  <Option key={35}>
                                    F VS2
                                  </Option>
                                  <Option key={36}>
                                    G VS2
                                  </Option>
                                  <Option key={37}>
                                    H VS2
                                  </Option>
                                  <Option key={38}>
                                    I VS2
                                  </Option>
                                  <Option key={39}>
                                    J VS2
                                  </Option>
                                  <Option key={40}>
                                    K VS2
                                  </Option>
                                  <Option key={41}>
                                    D SI1
                                  </Option>
                                  <Option key={42}>
                                    E SI1
                                  </Option>
                                  <Option key={43}>
                                    F SI1
                                  </Option>
                                  <Option key={44}>
                                    G SI1
                                  </Option>
                                  <Option key={45}>
                                    H SI1
                                  </Option>
                                  <Option key={46}>
                                    I SI1
                                  </Option>
                                  <Option key={47}>
                                    J SI1
                                  </Option>
                                  <Option key={48}>
                                    K SI1
                                  </Option>
                                  <Option key={49}>
                                    D SI2
                                  </Option>
                                  <Option key={50}>
                                    E SI2
                                  </Option>
                                  <Option key={51}>
                                    F SI2
                                  </Option>
                                  <Option key={52}>
                                    G SI2
                                  </Option>
                                  <Option key={53}>
                                    H SI2
                                  </Option>
                                  <Option key={54}>
                                    I SI2
                                  </Option>
                                  <Option key={55}>
                                    J SI2
                                  </Option>
                                  <Option key={56}>
                                    K SI2
                                  </Option>
                                  <Option key={57}>
                                    EF VVS
                                  </Option>
                                  <Option key={58}>
                                    GH VVS
                                  </Option>
                                  <Option key={59}>
                                    IJ VVS
                                  </Option>
                                  <Option key={60}>
                                    EF VS
                                  </Option>
                                  <Option key={61}>
                                    GH VS
                                  </Option>
                                  <Option key={62}>
                                    IJ VS
                                  </Option>
                                  <Option key={63}>
                                    EF SI
                                  </Option>
                                  <Option key={64}>
                                    GH SI
                                  </Option>
                                  <Option key={65}>
                                    IJ SI
                                  </Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={1} className='gutter-row'>
                              <MinusCircleOutlined onClick={() => {
                                if(fields.length<=1){
                                  setSolitaireVisible(false)
                                  }
                                // handleWeightChange(fields)
                                remove(name)
                                handleQuantityChange("solitaire")
                                handleWeightChange("solitaire")
                                }} />
                             </Col>
                          </Row>
                          ))}
                          {fields.length>0?
                          <Row gutter={16}>
                          <Col span={10}/>
                          <Col span={2}>
                            <Input value={quantity} placeholder="Total Quantity"/>
                          </Col>
                          <Col span={3}>
                            <Input value={weight} placeholder="Total Weight"/>
                          </Col>
                          <Col span={7}/>
                        </Row> :''}
                         </>
                       )} 
                     </Form.List>
                     {/* */}
                  </Panel>
                 </Collapse>
            {/* =============== */}
            <Collapse>
              <Panel header='Side Diamond'>
                <Form.List name='sideDiamond'>
                  {(fields,{add,remove})=>(
                   <>
                    <Row gutter={8}>
                   <Col span={24}>
                    <Form.Item>
                           <span style={{ float: "right" }}>
                              <PlusCircleOutlined label="Add"  onClick={() => {
                                setDiamondVisible(true) 
                                add()}}/>
                             </span>
                           </Form.Item>
                           </Col>
                           </Row>
                    {diamondVisible ? <Row>
                      <Col span={3}>
                        <label style={{marginLeft:'5px'}}>Side Diamond Sieve</label>
                      </Col>
                      <Col span={2}>
                        <label style={{marginLeft:'20px'}}>Shape</label>
                      </Col>
                      <Col span={2}>
                        <label style={{marginLeft:'15px'}}>Size(mm)</label>
                      </Col>
                      <Col span={3}>
                        <label style={{marginLeft:'5px'}}>Pointer Weight</label>
                      </Col>
                      <Col span={2}>
                        <label style={{marginLeft:'20px'}}>Quantity</label>
                      </Col>
                      <Col span={3}>
                        <label style={{marginLeft:'15px'}}>Total Weight</label>
                      </Col>
                      <Col span={3}>
                        <label style={{marginLeft:'15px'}}>Setting Type</label>
                      </Col>
                      <Col span={2}>
                        <label style={{marginLeft:'20px'}}>Quality</label>
                      </Col>
                    </Row> : ''}
                     {fields.map(({key,name,...restField})=>(
                          <Row gutter={16}>
                            <Col span={3}>
                              <Form.Item name={[name,'addDiamond']} {...restField} style={{marginBottom:'8px'}}>
                               <Select allowClear showSearch onSelect={getDiamondData(name)}
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                        {sideDiamondDataArr.map((item,index)=>{
                          return(
                            <Option key={index} value={item.SideDiamondSieve} >
                                 {item.SideDiamondSieve}
                                 </Option>
                          )
                        })}
                                 
                                 
                               </Select>
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Form.Item name={[name,'shape']} {...restField} style={{marginBottom:'8px'}}>
                              <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      
                    >
                      
                      <Option key={1} value={"Round"}>
                          Round
                        </Option>
                        <Option key={2} value={"Pear"}>
                          Pear
                        </Option>
                        <Option key={3} value={"Princess"}>
                        Princess
                        </Option>
                        <Option key={4} value={"Oval"}>
                          Oval
                        </Option>
                        <Option key={5} value={"Marquise"}>
                        Marquise
                        </Option>
                        <Option key={6} value={"Baguette"}>
                        Baguette
                        </Option>
                      
                    </Select>
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Form.Item   name={[name, "size"]} {...restField} style={{ marginBottom: "8px" }}>
                                <Select allowClear showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                 {sideDiamondDataArr.map((item,ind)=>{
                                   return(
                                    <Option key={ind} value={item.size}>
                                    {item.size}
                                  </Option>
                                   )
                                 })}
                                  
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={3}>
                              <Form.Item name={[name,'pointerWeight']} {...restField} style={{marginBottom:'8px'}}>
                                <Select allowClear showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                  {sideDiamondDataArr.map((item,ind)=>{
                                   return(
                                    <Option key={ind} value={item.PointerWeight}>
                                    {item.PointerWeight}
                                  </Option>
                                   )
                                 })}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Form.Item name={[name,'quantity']} {...restField} style={{marginBottom:'8px'}}>
                                <Input onChange={(e)=> handleQuantityChange("Diamond")} />
                              </Form.Item>
                            </Col>
                            <Col span={3}>
                              <Form.Item name={[name,'totalWeight']} {...restField} style={{marginBottom:'8px'}}>
                                <Input onChange={(e)=> handleWeightChange("Diamond")} />
                              </Form.Item>
                            </Col>
                            <Col span={3}>
                              <Form.Item name={[name,'settingType']} {...restField} style={{marginBottom:'8px'}}>
                              <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      
                    >
                      
                      <Option key={1} value={"Prong"}>
                        Prong
                        </Option>
                        <Option key={2} value={"Channel"}>
                          Channel
                        </Option>
                        <Option key={3} value={"BoxProng"}>
                        Box Prong
                        </Option>
                        <Option key={4} value={"U-Rong"}>
                        U- Rong
                        </Option>
                        <Option key={5} value={"PlateProng"}>
                        Plate Prong
                        </Option>
                        <Option key={6} value={"Pave"}>
                        Pave
                        </Option>
                      
                    </Select>
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Form.Item name={[name,'quality']} {...restField} style={{marginBottom:'8px'}}>
                              <Select
                                allowClear
                                showSearch
                                filterOption={(input, option) => option.children.toLowerCase().startsWith(input.toLowerCase())}
                                >
                                  <Option key={1}>
                                    D IF
                                  </Option>
                                  <Option key={2}>
                                    E IF
                                  </Option>
                                  <Option key={3}>
                                    F IF
                                  </Option>
                                  <Option key={4}>
                                    G IF
                                  </Option>
                                  <Option key={5}>
                                    H IF
                                  </Option>
                                  <Option key={6}>
                                    I IF
                                  </Option>
                                  <Option key={7}>
                                    J IF
                                  </Option>
                                  <Option key={8}>
                                    K IF
                                  </Option>
                                  <Option key={9}>
                                    D VVS1
                                  </Option>
                                  <Option key={10}>
                                    E VVS1
                                  </Option>
                                  <Option key={11}>
                                    F VVS1
                                  </Option>
                                  <Option key={12}>
                                    G VVS1
                                  </Option>
                                  <Option key={13}>
                                    H VVS1
                                  </Option>
                                  <Option key={14}>
                                    I VVS1
                                  </Option>
                                  <Option key={15}>
                                    J VVS1
                                  </Option>
                                  <Option key={16}>
                                    K VVS1
                                  </Option>
                                  <Option key={17}>
                                    D VVS2
                                  </Option>
                                  <Option key={18}>
                                    E VVS2
                                  </Option>
                                  <Option key={19}>
                                    F VVS2
                                  </Option>
                                  <Option key={20}>
                                    G VVS2
                                  </Option>
                                  <Option key={21}>
                                    H VVS2
                                  </Option>
                                  <Option key={22}>
                                    I VVS2
                                  </Option>
                                  <Option key={23}>
                                    J VVS2
                                  </Option>
                                  <Option key={24}>
                                    K VVS2
                                  </Option>
                                  <Option key={25}>
                                    D VS1
                                  </Option>
                                  <Option key={26}>
                                    E VS1
                                  </Option>
                                  <Option key={27}>
                                    F VS1
                                  </Option>
                                  <Option key={28}>
                                    G VS1
                                  </Option>
                                  <Option key={29}>
                                    H VS1
                                  </Option>
                                  <Option key={30}>
                                    I VS1
                                  </Option>
                                  <Option key={31}>
                                    J VS1
                                  </Option>
                                  <Option key={32}>
                                    K VS1
                                  </Option>
                                  <Option key={33}>
                                    D VS2
                                  </Option>
                                  <Option key={34}>
                                    E VS2
                                  </Option>
                                  <Option key={35}>
                                    F VS2
                                  </Option>
                                  <Option key={36}>
                                    G VS2
                                  </Option>
                                  <Option key={37}>
                                    H VS2
                                  </Option>
                                  <Option key={38}>
                                    I VS2
                                  </Option>
                                  <Option key={39}>
                                    J VS2
                                  </Option>
                                  <Option key={40}>
                                    K VS2
                                  </Option>
                                  <Option key={41}>
                                    D SI1
                                  </Option>
                                  <Option key={42}>
                                    E SI1
                                  </Option>
                                  <Option key={43}>
                                    F SI1
                                  </Option>
                                  <Option key={44}>
                                    G SI1
                                  </Option>
                                  <Option key={45}>
                                    H SI1
                                  </Option>
                                  <Option key={46}>
                                    I SI1
                                  </Option>
                                  <Option key={47}>
                                    J SI1
                                  </Option>
                                  <Option key={48}>
                                    K SI1
                                  </Option>
                                  <Option key={49}>
                                    D SI2
                                  </Option>
                                  <Option key={50}>
                                    E SI2
                                  </Option>
                                  <Option key={51}>
                                    F SI2
                                  </Option>
                                  <Option key={52}>
                                    G SI2
                                  </Option>
                                  <Option key={53}>
                                    H SI2
                                  </Option>
                                  <Option key={54}>
                                    I SI2
                                  </Option>
                                  <Option key={55}>
                                    J SI2
                                  </Option>
                                  <Option key={56}>
                                    K SI2
                                  </Option>
                                  <Option key={57}>
                                    EF VVS
                                  </Option>
                                  <Option key={58}>
                                    GH VVS
                                  </Option>
                                  <Option key={59}>
                                    IJ VVS
                                  </Option>
                                  <Option key={60}>
                                    EF VS
                                  </Option>
                                  <Option key={61}>
                                    GH VS
                                  </Option>
                                  <Option key={62}>
                                    IJ VS
                                  </Option>
                                  <Option key={63}>
                                    EF SI
                                  </Option>
                                  <Option key={64}>
                                    GH SI
                                  </Option>
                                  <Option key={65}>
                                    IJ SI
                                  </Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={1} className='gutter-row'>
                              <MinusCircleOutlined onClick={() => {
                                if(fields.length<=1){
                                  setDiamondVisible(false)
                                  }
                                remove(name)
                                handleQuantityChange("Diamond")
                                handleWeightChange("Diamond")
                                }} />
                             </Col>
                          </Row>
                          ))}
                          {fields.length>0?
                          <Row gutter={16}>
                          <Col span={10}/>
                          <Col span={2}>
                            <Input  value={diamondQuantity} placeholder="Total Quantity"/>
                          </Col>
                          <Col span={3}>
                            <Input value={diamondWeight} placeholder="Total Weight"/>
                          </Col>
                          <Col span={7}/>
                        </Row> :''}

                         </>
                       )
                       }
                </Form.List>
                  </Panel>
                 </Collapse>
                 {/* ========= */}
                 <Collapse>
              <Panel header='Colour Stone'>
                <Form.List name='colourStone'>
                  {(fields,{add,remove})=>(
                   <>
                  <Row gutter={8}>
                   <Col span={24}>
                    <Form.Item>
                           <span style={{ float: "right" }}>
                              <PlusCircleOutlined label="Add"  onClick={() => {
                                setColourStoneVisible(true)
                                add()}}/>
                             </span>
                           </Form.Item>
                           </Col>
                           </Row>
                    {colourStoneVisible ? <Row>
                      <Col span={3}>
                        <span style={{marginLeft:'5px'}}>Colour Stone</span>
                      </Col>
                      <Col span={2}>
                        <span style={{marginLeft:'20px'}}>Shape</span>
                      </Col>
                      <Col span={2}>
                        <span style={{marginLeft:'15px'}}>Size(mm)</span>
                      </Col>
                      <Col span={3}>
                        <span style={{marginLeft:'5px'}}>Pointer Weight</span>
                      </Col>
                      <Col span={2}>
                        <span style={{marginLeft:'20px'}}>Quantity</span>
                      </Col>
                      <Col span={3}>
                        <span style={{marginLeft:'15px'}}>Total Weight</span>
                      </Col>
                      <Col span={3}>
                        <span style={{marginLeft:'15px'}}>Setting Type</span>
                      </Col>
                      <Col span={2}>
                        <span style={{marginLeft:'20px'}}>Quality</span>
                      </Col>
                    </Row> : ''}
                     {fields.map(({key,name,...restField})=>(
                          <Row gutter={16}>
                            <Col span={3}>
                              <Form.Item name={[name,'addColour']} {...restField} style={{marginBottom:'8px'}}>
                               <Select allowClear showSearch>
                                 <Option key={1}>
                                   Green Emerald
                                 </Option>
                                 <Option key={2}>
                                   Red Ruby
                                 </Option>
                               </Select>
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Form.Item name={[name,'shape']} {...restField} style={{marginBottom:'8px'}}>
                              <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      
                    >
                      
                      <Option key={1} value={"Round"}>
                          Round
                        </Option>
                        <Option key={2} value={"Pear"}>
                          Pear
                        </Option>
                        <Option key={3} value={"Princess"}>
                        Princess
                        </Option>
                        <Option key={4} value={"Oval"}>
                          Oval
                        </Option>
                        <Option key={5} value={"Marquise"}>
                        Marquise
                        </Option>
                        <Option key={6} value={"Baguette"}>
                        Baguette
                        </Option>
                      
                    </Select>
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Form.Item   name={[name, "size"]} {...restField} style={{ marginBottom: "8px" }}>
                                <Input/>
                              </Form.Item>
                            </Col>
                            <Col span={3}>
                              <Form.Item name={[name,'pointerWeight']} {...restField} style={{marginBottom:'8px'}}>
                                <Input/>
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Form.Item name={[name,'quantity']} {...restField} style={{marginBottom:'8px'}}>
                                <Input onChange={(e)=> handleQuantityChange("ColourStone")} />
                              </Form.Item>
                            </Col>
                            <Col span={3}>
                              <Form.Item name={[name,'totalWeight']} {...restField} style={{marginBottom:'8px'}}>
                                <Input onChange={(e)=> handleWeightChange("ColourStone")}/>
                              </Form.Item>
                            </Col>
                            <Col span={3}>
                              <Form.Item name={[name,'settingType']} {...restField} style={{marginBottom:'8px'}}>
                              <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      
                    >
                      
                      <Option key={1} value={"Prong"}>
                        Prong
                        </Option>
                        <Option key={2} value={"Channel"}>
                          Channel
                        </Option>
                        <Option key={3} value={"BoxProng"}>
                        Box Prong
                        </Option>
                        <Option key={4} value={"U-Rong"}>
                        U- Rong
                        </Option>
                        <Option key={5} value={"PlateProng"}>
                        Plate Prong
                        </Option>
                        <Option key={6} value={"Pave"}>
                        Pave
                        </Option>
                      
                    </Select>
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Form.Item name={[name,'quality']} {...restField} style={{marginBottom:'8px'}}>
                              <Select
                                allowClear
                                showSearch
                                filterOption={(input, option) => option.children.toLowerCase().startsWith(input.toLowerCase())}
                                >
                                  <Option key={1}>
                                    D IF
                                  </Option>
                                  <Option key={2}>
                                    E IF
                                  </Option>
                                  <Option key={3}>
                                    F IF
                                  </Option>
                                  <Option key={4}>
                                    G IF
                                  </Option>
                                  <Option key={5}>
                                    H IF
                                  </Option>
                                  <Option key={6}>
                                    I IF
                                  </Option>
                                  <Option key={7}>
                                    J IF
                                  </Option>
                                  <Option key={8}>
                                    K IF
                                  </Option>
                                  <Option key={9}>
                                    D VVS1
                                  </Option>
                                  <Option key={10}>
                                    E VVS1
                                  </Option>
                                  <Option key={11}>
                                    F VVS1
                                  </Option>
                                  <Option key={12}>
                                    G VVS1
                                  </Option>
                                  <Option key={13}>
                                    H VVS1
                                  </Option>
                                  <Option key={14}>
                                    I VVS1
                                  </Option>
                                  <Option key={15}>
                                    J VVS1
                                  </Option>
                                  <Option key={16}>
                                    K VVS1
                                  </Option>
                                  <Option key={17}>
                                    D VVS2
                                  </Option>
                                  <Option key={18}>
                                    E VVS2
                                  </Option>
                                  <Option key={19}>
                                    F VVS2
                                  </Option>
                                  <Option key={20}>
                                    G VVS2
                                  </Option>
                                  <Option key={21}>
                                    H VVS2
                                  </Option>
                                  <Option key={22}>
                                    I VVS2
                                  </Option>
                                  <Option key={23}>
                                    J VVS2
                                  </Option>
                                  <Option key={24}>
                                    K VVS2
                                  </Option>
                                  <Option key={25}>
                                    D VS1
                                  </Option>
                                  <Option key={26}>
                                    E VS1
                                  </Option>
                                  <Option key={27}>
                                    F VS1
                                  </Option>
                                  <Option key={28}>
                                    G VS1
                                  </Option>
                                  <Option key={29}>
                                    H VS1
                                  </Option>
                                  <Option key={30}>
                                    I VS1
                                  </Option>
                                  <Option key={31}>
                                    J VS1
                                  </Option>
                                  <Option key={32}>
                                    K VS1
                                  </Option>
                                  <Option key={33}>
                                    D VS2
                                  </Option>
                                  <Option key={34}>
                                    E VS2
                                  </Option>
                                  <Option key={35}>
                                    F VS2
                                  </Option>
                                  <Option key={36}>
                                    G VS2
                                  </Option>
                                  <Option key={37}>
                                    H VS2
                                  </Option>
                                  <Option key={38}>
                                    I VS2
                                  </Option>
                                  <Option key={39}>
                                    J VS2
                                  </Option>
                                  <Option key={40}>
                                    K VS2
                                  </Option>
                                  <Option key={41}>
                                    D SI1
                                  </Option>
                                  <Option key={42}>
                                    E SI1
                                  </Option>
                                  <Option key={43}>
                                    F SI1
                                  </Option>
                                  <Option key={44}>
                                    G SI1
                                  </Option>
                                  <Option key={45}>
                                    H SI1
                                  </Option>
                                  <Option key={46}>
                                    I SI1
                                  </Option>
                                  <Option key={47}>
                                    J SI1
                                  </Option>
                                  <Option key={48}>
                                    K SI1
                                  </Option>
                                  <Option key={49}>
                                    D SI2
                                  </Option>
                                  <Option key={50}>
                                    E SI2
                                  </Option>
                                  <Option key={51}>
                                    F SI2
                                  </Option>
                                  <Option key={52}>
                                    G SI2
                                  </Option>
                                  <Option key={53}>
                                    H SI2
                                  </Option>
                                  <Option key={54}>
                                    I SI2
                                  </Option>
                                  <Option key={55}>
                                    J SI2
                                  </Option>
                                  <Option key={56}>
                                    K SI2
                                  </Option>
                                  <Option key={57}>
                                    EF VVS
                                  </Option>
                                  <Option key={58}>
                                    GH VVS
                                  </Option>
                                  <Option key={59}>
                                    IJ VVS
                                  </Option>
                                  <Option key={60}>
                                    EF VS
                                  </Option>
                                  <Option key={61}>
                                    GH VS
                                  </Option>
                                  <Option key={62}>
                                    IJ VS
                                  </Option>
                                  <Option key={63}>
                                    EF SI
                                  </Option>
                                  <Option key={64}>
                                    GH SI
                                  </Option>
                                  <Option key={65}>
                                    IJ SI
                                  </Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={1} className='gutter-row'>
                              <MinusCircleOutlined onClick={() => {
                                if(fields.length<=1){
                                setColourStoneVisible(false)
                                }
                                remove(name)
                                handleQuantityChange("ColourStone")
                                handleWeightChange("ColourStone")
                                }} />
                             </Col>
                          </Row>
                          ))}
                          {fields.length>0?
                          <Row gutter={16}>
                          <Col span={10}/>
                          <Col span={2}>
                            <Input  value={colourStoneQuantity} placeholder="Total Quantity"/>
                          </Col>
                          <Col span={3}>
                            <Input value={colourStoneWeight} placeholder="Total Weight"/>
                          </Col>
                          <Col span={7}/>
                        </Row> :''}
                        
                         </>
                       )
                       }
                     </Form.List>
                  </Panel>
                 </Collapse>

                 <Row gutter={16} style={{marginBottom:'10px',marginTop:'8px'}}>
                   <Col span={10}/>
                  <Col span={2}>
                    <Form.Item name={"totalQuantity"} label='Total Quantity'>
                      <Input value={totalQty}/>
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item name={"totalWeight"} label='Total Weight'>
                      <Input value={totalWeight}/>
                    </Form.Item>
                  </Col>
                 </Row>
                 <Row gutter={16} >
                   <Col span={3}>
                     <Form.Item label={"No of Components"} name={'noOfcomponents'} style={{marginTop:'8px'}}>
                       <Input/>
                     </Form.Item>
                   </Col>
                 </Row>
                 <Row gutter={16} >
                 <Col span={3}>
                     <Form.Item label='Product Size' name={'productSize'} style={{marginTop:'8px'}}>
                       <Input/>
                     </Form.Item>
                 </Col>
                 <Col span={3}>
                     <Form.Item label='Metal Purity' name={'metalPurity'} style={{marginTop:'8px'}}>
                     <Select showSearch style={{ width: "100%", marginBottom: "0px" }}>
                       <Option key={1} value={"14KT"}>
                                14KT
                                 </Option>
                                 <Option key={2} value={"18KT"}>
                                 18KT
                                 </Option>
                                 <Option key={3} value={"22KT"}>
                                 22KT
                                 </Option>
                                
                    </Select>
                     </Form.Item>
                 </Col>
                 </Row>
                 <Row gutter={16} >
                 <Col span={3}>
                     <Form.Item label='Jewel CAD Volume' name={'jewelCADVolume'} style={{marginTop:'8px'}}>
                       <Input onChange={(e)=>getJewelCadVolume(e)}/>
                     </Form.Item>
                 </Col>
                 <Col span={3} className='gutter-row'>
                     <Form.Item label='CAM Weight' name={'camWeight'} style={{marginTop:'8px'}}>
                       <Input/>
                     </Form.Item>
                   </Col>
                   <Col span={3}>
                     <Form.Item label='CAD Weight' name={'cadWeight'} style={{marginTop:'8px'}}>
                       <Input onChange={(e)=>getCadWeight(e)}/>
                     </Form.Item>
                   </Col>
                   <Col span={3}>
                     <Form.Item label='Finding Weight' name={'findingWeight'} style={{marginTop:'8px'}}>
                       <Input onChange={(e)=>getFindWeight(e)}/>
                     </Form.Item>
                   </Col>
                   <Col span={3}>
                     <Form.Item label='FG 18KT' name={'FG18KT'} style={{marginTop:'8px'}}>
                       <Input />
                     </Form.Item>
                   </Col>
                   <Col span={3}>
                     <Form.Item label='FG 14KT' name={'FG14KT'} style={{marginTop:'8px'}}>
                       <Input />
                     </Form.Item>
                   </Col>
                   <Col span={3}>
                     <Form.Item label='FG PT Weight' name={'FGPTWeight'} style={{marginTop:'8px'}}>
                       <Input />
                     </Form.Item>
                   </Col>
                   <Col span={3}>
                     <Form.Item label='925 Weight' name={'925Weight'} style={{marginTop:'8px'}}>
                       <Input/>
                     </Form.Item>
                   </Col>
                 </Row>
                 <Row gutter={16}>
                 <Col span={12}/>   
                 <Col span={3}>
                     <Form.Item label='Gold Min 5%' name={'18KTGoldMin5%'} style={{marginTop:'8px'}}>
                       <Input />
                     </Form.Item>
                 </Col>
                 <Col span={3}>
                     <Form.Item label='Gold Min 5%' name={'14KTGoldMin5%'} style={{marginTop:'8px'}}>
                       <Input />
                     </Form.Item>
                 </Col>
                 <Col span={3}>
                     <Form.Item  label='Gold Min 5%' name={'FTGoldMin5%'} style={{marginTop:'8px'}}>
                       <Input  />
                     </Form.Item>
                 </Col>
                 <Col span={3}>
                     <Form.Item name='CADdesignerName' label='CAD Designer Name' style={{marginTop:'8px'}}>
                       <Input  />
                     </Form.Item>
                 </Col>
                 </Row>
                 <Row gutter={16}>
                 <Col span={12}/>   
                 <Col span={3}>
                     <Form.Item label='Gold Max 5%' name={'18KTGoldMax5%'} style={{marginTop:'8px'}} >
                       <Input />
                     </Form.Item>
                 </Col>
                 <Col span={3}>
                     <Form.Item label='Gold Max 5%' name={'14KTGoldMax5%'} style={{marginTop:'8px'}} >
                       <Input />
                     </Form.Item>
                 </Col>
                 <Col span={3}>
                     <Form.Item label='Gold Max 5%' name={'FTGoldMax5%'} style={{marginTop:'8px'}} >
                       <Input  />
                     </Form.Item>
                 </Col>
                 </Row>
                 <Row gutter={16} >
                   <Col span={12}/>
                   <Col span={3}>
                     <Form.Item label='MRP' name={'MRP'} style={{marginTop:'8px'}}>
                       <Input/>
                     </Form.Item>
                   </Col>
                   <Col span={3}>
                     <Form.Item label='Solitare Ratio' name={'SolitareRatio'} style={{marginTop:'8px'}}>
                       <Input/>
                     </Form.Item>
                   </Col>
                   <Col span={3}>
                     <Form.Item label='Mount Ratio' name={'MountRatio'} style={{marginTop:'8px'}}>
                       <Input/>
                     </Form.Item>
                   </Col>
                 </Row>
           <Row gutter={16} style={{paddingBottom:'24px'}}>
            <Col className="gutter-row" span={6} style={{ marginTop: "15px",marginBottom:'8px' }}>
                    <Form.Item label={"Image URL"} name={'ImageUrl'}>
                        <Input style={{width:"100%"}}/>
                    </Form.Item>
                </Col>
            <Col className="gutter-row" span={6} style={{ marginTop: "15px",marginBottom:'8px' }}>
                    <Form.Item label={"Approval Date"} name={'ApprovalDate'}>
                        <DatePicker />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={6} style={{ marginTop: "15px",marginBottom:'8px' }}>
                    <Form.Item label={"Approved By"} name={'ApprovedBy'}>
                    <Select showSearch >
                   <Option style={{ width: "100%" }}>
                    </Option>
                </Select>
                    </Form.Item>
                </Col>
                </Row>
           </Form>
            </div> 
      </Modal> : ''}
        </div>	
      ) : (	
        <DesignDetails designDetail={designDetail}  onChangeData={onChangeData} onClickNew = {onClickNew} />	
      )}
    </Spin>
  );
};
export default NewProductDesign;
