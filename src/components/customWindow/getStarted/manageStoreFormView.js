import { Button, Card, Row, Col, Collapse, Form, Input, message, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import TillIcon from "../../../assets/images/TillIcon.png"
import { UserOutlined } from '@ant-design/icons';
import ManageStoresIcon from "../../../assets/images/Shape.png"
// import { serverUrl } from "../../../constants/serverConfig";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { getSupplierRegion } from "../../../services/custom";
import { getCountryDropDownData } from "../../../services/generic";
import { LoadingOutlined } from "@ant-design/icons";
import { getOAuthHeaders } from "../../../constants/oAuthValidation";



const { Panel } = Collapse;
const { Option } = Select;

const ManageStoreFormView = () => {
    let usersData = JSON.parse(localStorage.getItem("userData"));
    const history = useHistory();
    const serverUrl = process.env.REACT_APP_serverUrl;
    const [manageStoreForm] = Form.useForm();
    const [addTillFlag, setAddTillFlag] = useState(false)
    const [tillDetailsFlag, setTillDetailsFlag] = useState(false)
    const [name, setName] = useState('Add Store')
    const [isTillDetailsSaveFlag, setIsTillDetailsSaveFlag] = useState(false)
    const [tillName, setTillName] = useState("")
    const [description, setDescription] = useState("")
    const [manageStoreFormViewFlag, setManageStoreFormViewFlag] = useState(false)
    const [taxId, setTaxId] = useState("")
    const [address, setAddress] = useState("")
    const [bUnitdata, setBUnitdata] = useState([])
    const [csBunitId, setCsBunitId] = useState(null)
    const [addedTillsData, setAddedTillsData] = useState([])
    const [isBUnitFieldsDisabled, setIsBUnitFieldsDisabled] = useState(false)
    const [cancelForEdit, setCancelForEdit] = useState(false)
    const [initialValues, setInitialValues] = useState({});
    const [supplierRegionDropDownData, setSupplierRegionDropdownData] = useState([])
    const [countryData, setCountryData] = useState([]);
    const [countryId, setCountryId] = useState("");
    const [regionId, setRegionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [csCountryId, setCsCountryId] = useState(null)
    const [csRegionId, setCsRegionId] = useState(null)



    const selectedBUnitId = localStorage.getItem("selectedBUnitId")
    const currentBUnitData = JSON.parse(localStorage.getItem("currentBUnitData"))


    useEffect(() => {
        if (selectedBUnitId !== 'null') {
            // const myString = selectedBUnitData.locations[0].fulladdress
            // const myArray = myString.split(",");

            // const thirdValue = myArray[2]; // Telangana
            // const fourthValue = myArray[3]; // 546577
            // const fifthValue = myArray[4]; // 546577


            // manageStoreForm.setFieldsValue({
            //     storeId: selectedBUnitData.value,
            //     name: selectedBUnitData.name,
            //     taxId: selectedBUnitData.taxId,
            //     line1: selectedBUnitData.locations[0].line1,
            //     line2: selectedBUnitData.locations[0].line2,
            //     city: selectedBUnitData.locations[0].city,
            //     region: thirdValue,
            //     country: fifthValue,
            //     pincode: fourthValue
            // })
            setIsBUnitFieldsDisabled(true)
            setAddTillFlag(true)
            setTillDetailsFlag(false)
            getBUnit('getCurrentBUnitData')
            // setName(selectedBUnitData.name)
        }
        // else if (currentBUnitData !== null) {
        //     manageStoreForm.setFieldsValue(currentBUnitData)
        //     setName(currentBUnitData.name)
        //     setIsBUnitFieldsDisabled(true)
        //     setAddTillFlag(true)
        //     setTillDetailsFlag(false)
        //     getBUnit('getCurrentBUnitData')
        // }
        else {
            getBUnit()
        }
        manageStoreForm.validateFields()
            .then(values => {
                setInitialValues(values)
            });
    }, [])

    const manageStoreMutation = {
        query: `query {
            getBunit(bunit: null) {
        csBunitId    
        name 
        value
        legalentity
        type
        cwrSpricelistId
        priceListName
        taxId
        locations{
            fulladdress
             phone
             line1
              line2
             line3
          postalcode
             city
         csCountryId
         csRegionId 
         regionName
         countryName  
        }
        pBunit{
        csBunitId
        name
        }
        csDocType{
            csDoctypeId
            name
        }
        mWarehouse{
            mWarehouseID
            name
        }
        cwrPcatalogueId
        catalogueName
        customerAddress{
            sCustomerAddressID
            line1
            line2
            line3
        }
        csCurrency{
            csCurrencyId
            isoCode
        }
        customer{    
        name
        sCustomerID
        }
        csDocSequence{
            csSequenceID
            name
        }
        b2cCustomer{
            b2cCustomerId
            name
        }    
        grnDoctype{
            csDoctypeId
            name
        }
        piDoctype{
            csDoctypeId
            name
        }
        soDoctype{
            csDoctypeId
            name
        }
        gsDoctype{
            csDoctypeId
            name
        }
        csDocType{
            csDoctypeId
            name
        }
        siDoctype{
            csDoctypeId
            name
        }
        prDoctype{
            csDoctypeId
            name
        }
        csDocType{
            csDoctypeId
            name
        }
        rsDoctype{
            csDoctypeId
            name
        }
        dnDoctype{
            csDoctypeId
            name
        }
        srDoctype{
            csDoctypeId
            name
        }
        rrDoctype{
            csDoctypeId
            name
        }
        poDoctype{
            csDoctypeId
            name
        }
        prodDoctype{
            csDoctypeId
            name
        }
        invDoctype{
            csDoctypeId
            name
        }
        wgDoctype{
            csDoctypeId
            name
        }strDoctype{
            csDoctypeId
            name
        }stiDoctype{
            csDoctypeId
            name
        }strqDoctype{
            csDoctypeId
            name
        }stoDoctype{
            csDoctypeId
            name
        }cnDoctype{
            csDoctypeId
            name
        }
        tilldata{
             cwrTillID
                 searchKey
                 till
                 description
                 nextAssignedNumber
                 prefix
                 suffix
                 loyaltyProgram
                 accessController 
                 posType
                 manageCash
                 showopeningamount
                 showsalesamount
                 showexpectedamount
                 showdifferenceamount
                 shiftclose
                 shiftopen
                 eReceipt
                 printPreview
                 cashin
                 cashout
                 layAway
                 payNow
                 hardwareController{
                     imageUrl
                     printReceipt
                     weighingScale
                     payment
                     printBarcode
                 }
                 printTemplate{
                  cwrPrinttemplateId
                  name
                  htmlcode
                  htmlcode2
                  xmlcode
                  xmlcode2
                }
                tillCloseTemplate{
                     cwrPrinttemplateId
                  name
                  htmlcode
                  htmlcode2 
                }
                kotPrintTemplate{
                     cwrPrinttemplateId
                  name
                  htmlcode
                  htmlcode2 
                  xmlcode
                  xmlcode2
                }
        }
        }
        }
        
        
        `


    }
    const manageStoreMutation1 = {
        query: `query {
            getBunit(bunit: "${selectedBUnitId}") {
        csBunitId    
        name 
        value
        legalentity
        type
        cwrSpricelistId
        priceListName
        taxId
        locations{
            fulladdress
             phone
             line1
              line2
             line3
          postalcode
             city
         csCountryId
         csRegionId
         regionName
         countryName   
        }
        pBunit{
        csBunitId
        name
        }
        csDocType{
            csDoctypeId
            name
        }
        mWarehouse{
            mWarehouseID
            name
        }
        cwrPcatalogueId
        catalogueName
        customerAddress{
            sCustomerAddressID
            line1
            line2
            line3
        }
        csCurrency{
            csCurrencyId
            isoCode
        }
        customer{    
        name
        sCustomerID
        }
        csDocSequence{
            csSequenceID
            name
        }
        b2cCustomer{
            b2cCustomerId
            name
        }    
        grnDoctype{
            csDoctypeId
            name
        }
        piDoctype{
            csDoctypeId
            name
        }
        soDoctype{
            csDoctypeId
            name
        }
        gsDoctype{
            csDoctypeId
            name
        }
        csDocType{
            csDoctypeId
            name
        }
        siDoctype{
            csDoctypeId
            name
        }
        prDoctype{
            csDoctypeId
            name
        }
        csDocType{
            csDoctypeId
            name
        }
        rsDoctype{
            csDoctypeId
            name
        }
        dnDoctype{
            csDoctypeId
            name
        }
        srDoctype{
            csDoctypeId
            name
        }
        rrDoctype{
            csDoctypeId
            name
        }
        poDoctype{
            csDoctypeId
            name
        }
        prodDoctype{
            csDoctypeId
            name
        }
        invDoctype{
            csDoctypeId
            name
        }
        wgDoctype{
            csDoctypeId
            name
        }strDoctype{
            csDoctypeId
            name
        }stiDoctype{
            csDoctypeId
            name
        }strqDoctype{
            csDoctypeId
            name
        }stoDoctype{
            csDoctypeId
            name
        }cnDoctype{
            csDoctypeId
            name
        }
        tilldata{
             cwrTillID
                 searchKey
                 till
                 description
                 nextAssignedNumber
                 prefix
                 suffix
                 loyaltyProgram
                 accessController 
                 posType
                 manageCash
                 showopeningamount
                 showsalesamount
                 showexpectedamount
                 showdifferenceamount
                 shiftclose
                 shiftopen
                 eReceipt
                 printPreview
                 cashin
                 cashout
                 layAway
                 payNow
                 hardwareController{
                     imageUrl
                     printReceipt
                     weighingScale
                     payment
                     printBarcode
                 }
                 printTemplate{
                  cwrPrinttemplateId
                  name
                  htmlcode
                  htmlcode2
                  xmlcode
                  xmlcode2
                }
                tillCloseTemplate{
                     cwrPrinttemplateId
                  name
                  htmlcode
                  htmlcode2 
                }
                kotPrintTemplate{
                     cwrPrinttemplateId
                  name
                  htmlcode
                  htmlcode2 
                  xmlcode
                  xmlcode2
                }
        }
        }
        }
        
        
        `


    }

    const onFinish = (values) => {
        setName(values.name)
        const { access_token } = getOAuthHeaders();
        // let value = bUnitdata[0].value ? parseInt(bUnitdata[0].value) : 7010;
        // let orderNumber = 1;
        // orderNumber++;
        // let newValue = value.toString() + orderNumber.toString().padStart(2, '0');
        const upsertBUnitQuery = {
            query: `mutation {upsertBusinessUnit
                    (bunit: {
                  value: ${values.storeId ? `"${values.storeId}"` : null}
                  name: ${values.name ? `"${values.name}"` : null}
                  taxId: ${values.taxId ? `"${values.taxId}"` : null}
                  locations:[{
                 fulladdress: null
                 phone:null,
                 line1: ${values.line1 ? `"${values.line1}"` : null}
                 line2:${values.line2 ? `"${values.line2}"` : null}
                 line3: ${values.line3 ? `"${values.line3}"` : null}
                 postalcode:${values.pincode ? `"${values.pincode}"` : null}
                 city: ${values.city ? `"${values.city}"` : null}
                 csCountryId: ${csCountryId !== null ? `"${csCountryId}"` : values.country === null ? null : `"${values.country}"`}
                 csRegionId:  ${csRegionId !== null ? `"${csRegionId}"` : values.region === null ? null : `"${values.region}"`}
                  }]
                 }) { 
              status
              message  
              recordId 
              }
              }
   
            `

        }
        //     const upsertTilldata = {
        //         query: `mutation {
        //             upsertBunitTill(till:[{
        //               cSBunitID:  "${csBunitId}"
        //               prefix: null
        //               suffix: null
        //               nextNo: null
        //               description: ${values.description ? `"${values.description}"` : null}
        //               nextAssignedNumber: null
        //               searchKey: ${values.tillId ? `"${values.tillId}"` : null}
        //               till:  ${values.tillName ? `"${values.tillName}"` : null}
        //               posType: "Y"
        //               manageCash: false
        //               showopeningamount: true
        //               showsalesamount: false
        //               showexpectedamount: true
        //               showdifferenceamount: false
        //               shiftclose: true
        //               shiftopen: true
        //               eReceipt: false
        //               printPreview: "Y"
        //               cashin: "Y"
        //               cashout: "N"
        //               layAway: "N"
        //               payNow: "Y"
        //               posOrderPrint: "N"
        //               tillOpnClsPrint: "Y"    
        //               linked: "N"
        //               restaurentPos: "N"
        //             }]) { 
        //           status
        //           message   
        //           }
        //           }

        // `

        //     }

        // if (addTillFlag === false && tillDetailsFlag === true) {
        //     Axios({
        //         url: serverUrl,
        //         method: "POST",
        //         data: upsertTilldata,
        //         headers: {
        //             "Content-Type": "application/json",
        //             Authorization: `bearer ${newToken}`,
        //         },
        //     }).then((response) => {
        //         console.log(response)
        //         if (response.data.data.upsertBunitTill.status === "200") {
        //             message.success(response.data.data.upsertBunitTill.message)
        //             getBUnit("TillAdding")
        //             setIsTillDetailsSaveFlag(true)
        //             setTillName(values.tillName)
        //             setDescription(values.description)
        //             setIsBUnitFieldsDisabled(true)
        //         }
        //         else {
        //             message.error(response.data.data.upsertBunitTill.message)
        //         }
        //     })
        //         .catch((error) => {
        //             console.log(error)
        //         })
        //     // addTillFlag(false)
        //     // tillDetailsFlag(false)

        // }
        // else {
        Axios({
            url: serverUrl,
            method: "POST",
            data: upsertBUnitQuery,
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${access_token}`,
            },
        }).then((response) => {
            if (response.data.data.upsertBusinessUnit.status === "200") {
                message.success(response.data.data.upsertBusinessUnit.message)
                localStorage.setItem("selectedBUnitId", response.data.data.upsertBusinessUnit.recordId)
                localStorage.setItem('csBunitId', response.data.data.upsertBusinessUnit.recordId)
                setCsBunitId(response.data.data.upsertBusinessUnit.recordId)
                setIsBUnitFieldsDisabled(true)
            }
            else {
                message.error(response.data.data.upsertBusinessUnit.message)
            }
        })
            .catch((error) => {
                console.log(error)
            })

        manageStoreForm.validateFields()
            .then(values => {
                setInitialValues(values)
            });

        setAddTillFlag(true)

        // }
    }



    const getBUnit = (val) => {
        const { access_token } = getOAuthHeaders();
        setLoading(true)
        Axios({
            url: serverUrl,
            method: "POST",
            data: val === 'getCurrentBUnitData' ? manageStoreMutation1 : manageStoreMutation,
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${access_token}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setLoading(false)
                const data = response.data.data.getBunit
                const selectedBUnitData = response.data.data.getBunit[0]
                if (val === 'getCurrentBUnitData') {
                    manageStoreForm.setFieldsValue({
                        storeId: selectedBUnitData.value,
                        name: selectedBUnitData.name,
                        taxId: selectedBUnitData.taxId,
                        line1: selectedBUnitData.locations[0].line1,
                        line2: selectedBUnitData.locations[0].line2,
                        city: selectedBUnitData.locations[0].city,
                        region: selectedBUnitData.locations[0].regionName,
                        country: selectedBUnitData.locations[0].countryName,
                        pincode: selectedBUnitData.locations[0].postalcode
                    })
                     setCsCountryId(selectedBUnitData.locations[0].csCountryId)
                    setCsRegionId(selectedBUnitData.locations[0].csRegionId)
                    localStorage.setItem('csBunitId', selectedBUnitData.csBunitId)
                    setName(selectedBUnitData.name)
                    setAddedTillsData(selectedBUnitData.tilldata)
                    manageStoreForm.validateFields()
                        .then(values => {
                            setInitialValues(values)
                        });

                }
                else {
                    setBUnitdata(data)
                    manageStoreForm.setFieldsValue({
                        storeId: 7010 + "" + (data.length + 1),

                    });
                }
            }
            // let add = data.customerAddress.sCustomerAddressID !== null ? data.customerAddress.sCustomerAddressID : "" + " " + data.customerAddress.line1 !== null ? data.customerAddress.line1 : "" + " " + data.customerAddress.line2 !== null ? data.customerAddress.line2 : "" + " " + data.customerAddress.line3 !== null ? data.customerAddress.line3 : ""
            // setTaxId(data.taxid)
            // setAddress(add)
        })
            .catch((error) => {
                console.log(error)
            })
    }

    const onClickAddTill = () => {
        let val = manageStoreForm.getFieldsValue()
        localStorage.setItem('currentBUnitData', JSON.stringify(val))
        localStorage.setItem('tillData', null)
        history.push('./1003')
        // localStorage.setItem('currentBUnitDetails',initialValues)
        // manageStoreForm.setFieldsValue({
        //     tillName: '',
        //     description: '',
        //     tillId: '',
        // });
        // setIsTillDetailsSaveFlag(false)
        // setAddTillFlag(false)
        // setTillDetailsFlag(true)
        // setIsBUnitFieldsDisabled(true)
    }
    const onClickAddTill1 = () => {
        manageStoreForm.setFieldsValue({
            tillName: '',
            description: '',
            tillId: '',
        });
        setIsTillDetailsSaveFlag(false)
        // setAddTillFlag(false)
        setTillDetailsFlag(true)
        setIsBUnitFieldsDisabled(false)

    }
    const onClickcancel = () => {

        // setIsBUnitFieldsDisabled(true)
        // cancelForEdit ? setIsBUnitFieldsDisabled(true) : history.push('./1001')
        if (cancelForEdit === true) {
            setIsBUnitFieldsDisabled(true)
            manageStoreForm.resetFields()
        }
        else {
            history.push('./1001')
        }
    }
    const onclickedit = () => {
        setIsBUnitFieldsDisabled(false)
        setIsTillDetailsSaveFlag(false)
        setCancelForEdit(true)

        // setAddTillFlag(true)
        // setTillDetailsFlag(false)
    }
    const onClickClose = () => {
        // window.location.reload()
        history.push('./1001')
        setManageStoreFormViewFlag(false)

    }
    const onClicktillToOpen = (val) => {
        history.push('./1003')
        localStorage.setItem('tillData', JSON.stringify(val))
        localStorage.setItem('cwrTillId', val.cwrTillID)
        setTillDetailsFlag(true)
        setIsTillDetailsSaveFlag(false)

    }
    const getSupplierRegionData = async () => {
        const clientId = usersData.cs_client_id
        const supplierRegionResponse = await getSupplierRegion(clientId)
        setSupplierRegionDropdownData(supplierRegionResponse)
    }

    const getCountryData = async () => {
        // const clientId = usersData.cs_client_id
        const countryDataResponse = await getCountryDropDownData();
        setCountryData(countryDataResponse.searchData);
    }
    const onSelectCountry = (recordId) => {
        setCountryId(recordId)
    }
    const onSelectRegion = (recordId) => {
        setRegionId(recordId)
    }
    return (
        <Spin indicator={<LoadingOutlined style={{ fontSize: "52px" }} spin />} spinning={loading}>

            < div style={{ padding: "0" }}>
                <Form layout='vertical' form={manageStoreForm} initialValues={initialValues} onFinish={onFinish}>
                    <Row justify="space-between" align="middle">
                        <Col className="main-heading">
                            {name}
                        </Col>

                        <Col >
                            {addTillFlag === true && tillDetailsFlag === false && isBUnitFieldsDisabled === true || isTillDetailsSaveFlag === true ?
                                <Button style={{ marginRight: "0.5rem", background: "#0C173A", color: "#F5F5F5", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", padding: "0 2rem" }} onClick={onclickedit}>Edit</Button>

                                :

                                //  isBUnitFieldsDisabled?
                                // <Button style={{ marginRight: "0.5rem", background: "#0C173A", color: "#F5F5F5", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", padding: "0 2rem" }}>Edit</Button>
                                // :
                                <Form.Item noStyle={true} >
                                    <Button id="step1" type="primary" htmlType="submit" style={{ marginRight: "0.5rem", background: "#0C173A", color: "#F5F5F5", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", padding: "0 2rem" }}>Save</Button>
                                </Form.Item>
                            }
                            {isBUnitFieldsDisabled ?
                                <Button style={{ color: "#0C173A", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", }} onClick={onClickClose}>Close</Button>
                                :
                                <Button style={{ color: "#0C173A", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", }} onClick={onClickcancel}>Cancel</Button>

                            }
                        </Col>
                    </Row>
                    <Collapse defaultActiveKey={['1', '2', '3', '4', '5']} style={{ border: "none", padding: "0", margin: "0", width: "100%" }}>
                        <Panel header="Store" key="1" style={{ border: "none" }}>
                            <Row style={{ marginBottom: "1.5rem" }}>
                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>Store ID</span>}
                                        name="storeId"
                                    // rules={[{ required: true, message: 'Please input Input 1!' }]}
                                    >
                                        <Input className="input-inside-text" disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>Name</span>}
                                        name="name"
                                    // rules={[{ required: true, message: 'Please input Input 1!' }]}
                                    >
                                        <Input className="input-inside-text" disabled={isBUnitFieldsDisabled} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>Tax ID</span>}
                                        name="taxId"
                                    // rules={[{ required: true, message: 'Please input Input 1!' }]}
                                    >
                                        <Input className="input-inside-text" disabled={isBUnitFieldsDisabled} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Panel>
                        <Panel header="Address Information" key="2" style={{ border: "none" }}>
                            <Row style={{ marginBottom: "1.5rem" }}>
                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>Line 1</span>}
                                        name="line1"
                                    // rules={[{ required: true, message: 'Please input Input 1!' }]}
                                    >
                                        <Input className="input-inside-text" disabled={isBUnitFieldsDisabled} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>Line 2</span>}
                                        name="line2"
                                    // rules={[{ required: true, message: 'Please input Input 1!' }]}
                                    >
                                        <Input className="input-inside-text" disabled={isBUnitFieldsDisabled} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>City</span>}
                                        name="city"
                                    // rules={[{ required: true, message: 'Please input Input 1!' }]}
                                    >
                                        <Input className="input-inside-text" disabled={isBUnitFieldsDisabled} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "1.5rem" }}>
                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>Country</span>}
                                        name="country"
                                    // rules={[{ required: true, message: 'Please input Input 1!' }]}
                                    >
                                        {/* <Input className="input-inside-text" disabled={isBUnitFieldsDisabled} /> */}
                                        <Select
                                         className="getStarted"
                                            allowClear
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onFocus={getCountryData}
                                            onSelect={onSelectCountry}
                                            style={{ width: "60%" }}
                                            disabled={isBUnitFieldsDisabled} >
                                            {countryData?.map((option, index) => (
                                                <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                                                    <span > {option.Name}</span>
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>Region</span>}
                                        name="region"
                                    // rules={[{ required: true, message: 'Please input Input 1!' }]}
                                    >
                                        {/* <Input className="input-inside-text" disabled={isBUnitFieldsDisabled} /> */}
                                        <Select
                                        className="getStarted"
                                            allowClear
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            style={{ width: "60%" }}
                                            onFocus={getSupplierRegionData}
                                            disabled={isBUnitFieldsDisabled} >
                                            {supplierRegionDropDownData?.map((data, index) => (
                                                <Option key={data.csRegionID} data={data} value={data.csRegionID}>
                                                    {data.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>Postal Code</span>}
                                        name="pincode"
                                    // rules={[{ required: true, message: 'Please input Input 1!' }]}
                                    >
                                        <Input className="input-inside-text" disabled={isBUnitFieldsDisabled} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Panel>
                        {addTillFlag && addedTillsData.length === 0 ?
                            <Panel header="Add Till" key="3" forceRender={addTillFlag ? true : false} style={{ border: "none" }}>
                                <Button onClick={onClickAddTill} style={{ background: "#0C173A", color: "#F5F5F5", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", padding: "0 2rem" }}>Add Till</Button>
                            </Panel>
                            : ""
                        }

                        {addedTillsData.length > 0 ?
                            <Panel header="Till Details" key="5" style={{ border: "none" }}>
                                <Row style={{ marginBottom: "1.5rem" }}>
                                    {addedTillsData?.map((addedTills) => (
                                        <Col onClick={() => { onClicktillToOpen(addedTills) }} span={8} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                                            <div style={{
                                                backgroundColor: '#E4E5E7',
                                                width: 45,
                                                height: 45,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginRight: 12,
                                            }}>
                                                <img src={TillIcon} alt="" />
                                            </div>
                                            <div style={{ display: "grid" }}>
                                                {<span className="lable-text" style={{ fontWeight: 500, color: "#0C173A" }}>Till Name : {addedTills.till}</span>}
                                                <span className="lable-text" style={{ fontWeight: 500, color: "#0C173A" }}>{addedTills.description}</span>
                                            </div>
                                        </Col>
                                    ))}

                                </Row>
                                <Row style={{ marginBottom: "1.5rem" }}    >
                                    <Button onClick={onClickAddTill} style={{ background: "#0C173A", color: "#F5F5F5", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", padding: "0 2rem" }}>Add Till</Button>
                                </Row>
                            </Panel>
                            : ""
                        }
                    </Collapse>
                </Form>







            </div>
        </Spin>
    )
}
export default ManageStoreFormView;
