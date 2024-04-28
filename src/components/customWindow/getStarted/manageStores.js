import { Button, Card, Row, Col, Collapse, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import TillIcon from "../../../assets/images/TillIcon.png"
import { UserOutlined } from '@ant-design/icons';
import ManageStoresIcon from "../../../assets/images/Shape.png"
// import { serverUrl } from "../../../constants/serverConfig";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { getOAuthHeaders } from "../../../constants/oAuthValidation";


const { Panel } = Collapse;


const ManageStores = () => {
    const serverUrl = process.env.REACT_APP_serverUrl;
    const history = useHistory();
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





    useEffect(() => {
        getBUnit()
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
    const AddTillMutation = {
        query: `query {
            getBunit(bunit: "${csBunitId}") {
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
    const getBUnit = (val) => {
        const { access_token } = getOAuthHeaders();
        Axios({
            url: serverUrl,
            method: "POST",
            data: val === undefined ? manageStoreMutation : AddTillMutation,
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${access_token}`,
            },
        }).then((response) => {
            const data = response.data.data.getBunit
            if (val === undefined) {
                setBUnitdata(data)
                manageStoreForm.setFieldsValue({
                    storeId: 7010 + "" + (data.length + 1),

                });
            }
            else {
                setAddedTillsData(data)
            }
            // let add = data.customerAddress.sCustomerAddressID !== null ? data.customerAddress.sCustomerAddressID : "" + " " + data.customerAddress.line1 !== null ? data.customerAddress.line1 : "" + " " + data.customerAddress.line2 !== null ? data.customerAddress.line2 : "" + " " + data.customerAddress.line3 !== null ? data.customerAddress.line3 : ""
            // setTaxId(data.taxid)
            // setAddress(add)
        })
            .catch((error) => {
                console.log(error)
            })
    }
    const onClickNewStore = () => {
        history.push('./1002')
        localStorage.setItem("selectedBUnitId",null)
        localStorage.setItem("currentBUnitData",null)


    }
    const onCardClick = (bUData) => {
        localStorage.setItem("selectedBUnitId",bUData.csBunitId)
        history.push('./1002')
    }
    return (
        <>
            <>
                <Row justify="space-between" align="middle" >
                    <Col>
                        <span className="main-heading" style={{ marginBottom: 16, fontWeight: 500, fontSize: "18px", lineHeight: "22px", color: "#0D1526" }}>Manage Store</span>
                    </Col>
                    <Col>
                        <Button onClick={() => { history.push(`./7521`) }} style={{ color: "#0C173A", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", padding: "0 2rem" }}>Close</Button>
                    </Col>
                </Row>
                <hr style={{ margin: '16px 0 2rem 0', border: "1px solid #C8C8C8", opacity: "0.5" }} />
                {
                    bUnitdata.map((bUData) => {
                        if(bUData.name !== "*"){
                            return(
                                <Card
                                style={{
                                    background: '#FFFFFF',
                                    border: '1px solid #E4E4E4',
                                    boxShadow: '0px 0px 10px 1px rgba(0, 0, 0, 0.04)',
                                    borderRadius: 8,
                                    padding: "1rem 0",
                                    marginBottom: "2rem",
                                    cursor: "pointer"
                                }}
                                onClick={()=>{onCardClick(bUData)}}
                            >
                                <span className="main-heading" style={{ marginBottom: 16, marginLeft: "1rem", marginRight: "1rem" }}>{bUData.name === "undefined" ? "" : bUData.name}</span>
                                <hr style={{ margin: '16px 0', border: "1px solid #C8C8C8", opacity: "0.5", paddingLeft: "0", paddingRight: "0" }} />
                                <div style={{ display: 'flex', alignItems: 'center', marginLeft: "1rem", marginRight: "1rem" }}>
                                    <div
                                        style={{
                                            backgroundColor: '#E4E5E7',
                                            width: 45,
                                            height: 45,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 12,
                                        }}
                                    >
                                        <img alt="" src={ManageStoresIcon} />
                                    </div>
                                    <div style={{ display: "grid" }}>
                                        <span className="tax-address-text" style={{ margin: 0 }}>Tax details : {bUData.taxId === "undefined" ? "" : bUData.taxId}</span>
                                        <span className="tax-address-text" style={{ margin: 0 }}>Address : {bUData.locations[0].line1 ? bUData.locations[0].line1 : ''}{bUData.locations[0].line2 ? ', ' + bUData.locations[0].line2 : ''}{bUData.locations[0].line3 ? ', ' + bUData.locations[0].line3 : ''}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                            )
                        }
                    }
                       
)
                }

                <Card
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E4E4E4',
                        boxShadow: '0px 0px 10px 1px rgba(0, 0, 0, 0.04)',
                        borderRadius: 8,
                        padding: "1rem 0",
                        marginBottom: "2rem"
                    }}
                >
                    <span className="main-heading" style={{ marginBottom: 16, marginLeft: "1rem", marginRight: "1rem" }}>Store</span>
                    <span style={{ margin: "0 1rem", fontFamily: "Inter", fontSize: '12px', lineHeight: "15px", fontWeight: 400, fontStyle: "normal", color: "#0C173A", display: "block", marginLeft: "1rem", marginRight: "1rem" }}>Allows you to easily create, edit, and manage stores, tills & users</span>
                    <hr style={{ margin: '16px 0', border: "1px solid #C8C8C8", opacity: "0.5" }} />
                    <Button id="step2" onClick={onClickNewStore} style={{ marginLeft: "1rem", marginRight: "1rem", background: "#0C173A", boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.2)", color: "#F5F5F5", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", padding: "0 2rem" }}>New Store</Button>
                </Card>
            </>

        </>
    )
}
export default ManageStores;