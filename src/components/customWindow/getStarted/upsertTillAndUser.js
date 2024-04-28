import { useEffect, useState } from "react";
import { Button, Card, Row, Col, Collapse, Form, Input, message, Spin, Select } from "antd";
// import { serverUrl } from "../../../constants/serverConfig";
import { LoadingOutlined } from "@ant-design/icons";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { getCustomUsersData, deleteUserData, getTrialBalanceData } from "../../../services/generic";
import { v4 as uuid } from "uuid";
import userIcon from "../../../assets/images/userIcon.png"
import { getOAuthHeaders } from "../../../constants/oAuthValidation";





const { Panel } = Collapse;
const { Option } = Select;



const UpsertTillAndUser = () => {
    const { access_token } = getOAuthHeaders();
    const history = useHistory();
    const serverUrl = process.env.REACT_APP_serverUrl;
    const [manageTillandUserForm] = Form.useForm();
    const [name, setName] = useState('Add Till')
    const [isSaved, setisSaved] = useState(false)
    const [showAddUserButton, setShowAddUserButton] = useState(false)
    const [loading, setLoading] = useState(false);
    const [addUserdropDownSection, setAddUserdropDownSection] = useState(false)
    const [isFieldDesable, setIsFieldDesable] = useState(false)
    const [editFlag, setEditFlag] = useState(false)
    const [userList, setUserList] = useState([])
    const [selectedUser, setSelectedUser] = useState()
    const [showAddedUsers, setShowAddedUsers] = useState()
    const [addedUserData, setAddedUserData] = useState([])
    const [disableAddUserButton, setDisableAddUserButton] = useState(false)
    const [userName, setUserName] = useState([])
    const [selectedUserName, setSelectedUserName] = useState([])
    const [showUSerDetails, setShowUSerDetails] = useState(false)




    useEffect(() => {
        const tillData = JSON.parse(localStorage.getItem("tillData"))
        // const users = localStorage.getItem('users')
        if (tillData !== null) {
            manageTillandUserForm.setFieldsValue({
                tillId: tillData.searchKey,
                tillName: tillData.till,
                description: tillData.description,
                prefix:tillData.prefix,
                nextOrderNo:tillData.nextAssignedNumber
            })
            setShowAddUserButton(true)
            setAddUserdropDownSection(false)
            setisSaved(true)
            setIsFieldDesable(true)
            setName(tillData.till)
            getUserData()
            // if (users === "true") {
            //     getUserData()
            // }
            // else if (users === "null") {
            //     setShowUSerDetails(false)
            // }
        }

    }, [])



    const onFinish = (values) => {
        if (showAddUserButton === false && addUserdropDownSection === true && isSaved === false) {
            // let randomNumber = Math.floor(Math.random() * Math.pow(2, 32));
            // let id = randomNumber >>> 0;
            let uniqueId = uuid()
                .replace(/-/g, "")
                .toUpperCase();
            setLoading(true)
            const cwrTillId = localStorage.getItem('cwrTillId')
            const upsertTillUser = {
                query: `mutation {
                upsertTillUser(user:[{
                  cwrTillaccessId: "${uniqueId}"
                  csUserId: "${selectedUser}"
                  cwrTillId: "${cwrTillId}"
                  userAccessController: "{\\"pos\\":\\"Y\\",\\"layout\\":\\"1\\",\\"kds_print\\":\\"Y\\",\\"dineIn\\":\\"N\\",\\"purchase\\":\\"Y\\",\\"dayEnd\\":\\"N\\",\\"cashManagement\\":\\"Y\\"}"
                }]) { 
              status
              message   
              }
              }
              
    `

            }
            Axios({
                url: serverUrl,
                method: "POST",
                data: upsertTillUser,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${access_token}`,
                },
            }).then((response) => {
                if (response.data.data.upsertTillUser.status === "200") {
                    setLoading(false)
                    message.success(response.data.data.upsertTillUser.message)
                    // setShowUserList(true)
                    setisSaved(true)
                    setShowAddUserButton(true)
                    setAddUserdropDownSection(false)
                    setIsFieldDesable(true)
                    setShowAddedUsers(true)
                    setShowUSerDetails(true)
                    // getTillAndUserData()
                    getUserData()
                    // setAddedUserData()


                }
                else {
                    setLoading(false)
                    message.error(response.data.data.upsertTillUser.message)
                }
            })
                .catch((error) => {
                    console.log(error)
                })

        }

        else {
            const csBunitId = localStorage.getItem('csBunitId')
            const cwrTillId = localStorage.getItem('cwrTillId')
            setLoading(true)
            let uniqueId = uuid()
                .replace(/-/g, "")
                .toUpperCase();
            const upsertBunitTill = {
                query: `mutation {
                upsertBunitTill(till:[{
                  cwrTillID: "${editFlag ? cwrTillId : uniqueId}"
                  cSBunitID:  "${csBunitId}"
                  prefix: ${values.prefix ? `"${values.prefix}"` : null}
                  suffix: null
                  nextNo: null
                  description: ${values.description ? `"${values.description}"` : null}
                  nextAssignedNumber: ${values.nextOrderNo ? `"${values.nextOrderNo}"` : null}
                  searchKey: ${values.tillId ? `"${values.tillId}"` : null}
                  till:  ${values.tillName ? `"${values.tillName}"` : null}
                  posType: "FG"
                  manageCash: false
                  showopeningamount: true
                  showsalesamount: false
                  showexpectedamount: true
                  showdifferenceamount: false
                  shiftclose: true
                  shiftopen: true
                  eReceipt: false
                  printPreview: "Y"
                  cashin: "Y"
                  cashout: "N"
                  layAway: "N"
                  payNow: "Y"
                  posOrderPrint: "N"
                  tillOpnClsPrint: "Y"    
                  linked: "N"
                  restaurentPos: "N"
                }]) { 
              status
              message
              }
              }
              
    `

            }
            Axios({
                url: serverUrl,
                method: "POST",
                data: upsertBunitTill,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${access_token}`,
                },
            }).then((response) => {
                if (response.data.data.upsertBunitTill.status === "200") {
                    setLoading(false)
                    message.success(response.data.data.upsertBunitTill.message)
                    localStorage.setItem('cwrTillId', uniqueId)
                    setisSaved(true)
                    setShowAddUserButton(true)
                    setIsFieldDesable(true)
                    setAddUserdropDownSection(false)
                    setShowUSerDetails(true)
                    upsertTillUser(uniqueId)

                }
                else {
                    setLoading(false)
                    message.error(response.data.data.upsertBunitTill.message)
                }
            })
                .catch((error) => {
                    console.log(error)
                })

        }
    }
    const onClickEdit = () => {
        setIsFieldDesable(false)
        setisSaved(false)
        setEditFlag(true)
    }
    const onClickCancel = () => {
        setIsFieldDesable(true)
        setisSaved(true)
        if (editFlag === false) {
            history.push('./1002')
        }
        if (showAddUserButton === false && addUserdropDownSection === true) {
            setShowAddUserButton(true)
            setAddUserdropDownSection(false)
        }

    }
    const onClickClose = () => {
        history.push('./1002')
    }
    const onClickAddUser = () => {
        setShowAddUserButton(false)
        setAddUserdropDownSection(true)
        setisSaved(false)
        // setDisableAddUserButton(fa)
    }
    const onClickAddUser1 = () => {
        setShowAddUserButton(true)
        setAddUserdropDownSection(false)
        setDisableAddUserButton(true)
        // setisSaved(false)
    }
    const onClickUserSelectBox = async () => {
        const getDataResponse = await getCustomUsersData();
        let arr = [];
        // let users
        getDataResponse.map((list) => {
            arr.push({ label: list.name, value: list.csUserId, email: list.email, userName: list.username })
        })
        setUserList(arr);


        // const newToken = JSON.parse(localStorage.getItem("authTokens"))
        // setLoading(true)
        // const getUserData = {
        //     query: `query {searchField(ad_field_id:\\"AE56C650531247F68A8773A46778BDBA\",searchField:\"\",\n      \n      jsonParam: \"{\\\"Cwr_till_ID\\\":\\\"2D6988313B6C413D9E6FE2CA54E8966E\\\",\\\"CS_Bunit_ID\\\":\\\"DF6CCEA8E42D4D00B4C35C7D3B323CF6\\\"}\",\n      )}`
        //   }
        // Axios({
        //     url: serverUrl,
        //     method: "GET",
        //     data: getUserData,
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `bearer ${newToken}`,
        //     },
        // }).then((response) => {
        //     console.log(response)
        //     if (response.data.data.upsertBunitTill.status === "200") {
        //         setLoading(false)
        //         message.success(response.data.data.upsertBunitTill.message)


        //     }
        //     else {
        //         setLoading(false)
        //         message.error(response.data.data.upsertBunitTill.message)
        //     }
        // })
        //     .catch((error) => {
        //         console.log(error)
        //     })
    }

    const onSelectUSer = (val) => {
        localStorage.setItem('tillUser', val)
        setSelectedUser(val)
        setSelectedUserName(userList[0].email)
        setShowAddUserButton(false)
        setAddUserdropDownSection(true)
        setisSaved(false)
    }
    const getTillAndUserData = () => {
        // const user = JSON.parse(localStorage.getItem("tillUser"))

        const tillData = {
            query: `query{
                tillData(user:"${selectedUserName}"){   
                   
                  posScanConfigs{
                      cwrPosScanConfigId
                      scanTrxType
                      dataType
                      barcodeLength
                      startsWith
                      endsWith
                      customFormula
                      formula
                  }
                  loyaltyApply{
                      cwrLoyaltyLevelId
                      name
                      applicableFor
                      prodCategories{
                          mProductCategoryId
                          include
                          }
                      }  
                  tillAccess{
                    cwrTillaccessId
                    csClientId
                    csUserId
                    userAccessController
                    cwrTill{
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
                    csBunit{
                      csBunitId
                      name
                      value
                      cwrSCustomerId
                      cwrCsDoctypeId
                      cwrPcatalogueId
                      cwrSpricelistId
                      pCatalogueSaleType{
                        cwrPcatalogueSaletypeId          
                        isPromoApplicable
                        cwrSaletypeId
                      }
                       currencies{
                        csCurrencyId
                        currSymbol
                        isoCode
                        prcPrecision
                        stdPrecision
                        cstgPrecision
                        symbolRightSide
                        denominations{
                            value
                            seqNo
                        }
                    }
                      b2cCustomer{
                        cwrCustomerId
                        code
                        name
                        email
                        mobileNo
                        pincode
                        retlLoyaltyBalance
                        b2cRegisteredstoreId
                        iscredit
                        balancePoints
                        loyaltyLevel{
                        cwrLoyaltyLevelId
                        name
                        accumulationRate
                        redemptionRate
                      }
                  
                    sCustomer{
                    sCustomerID
                    customerCategory{
                      sCustomerCateforyId
                      value
                      name
                      description
                  }
                    }
                      }
                      paymentMethodList{
                        cWRPaymentMethodID
                        sequenceNo
                        finPaymentmethodId
                        finFinancialAccountId
                        finDayCloseAccountId
                        name
                        integratedPayment
                        isloyalty
                        paymentProvider
                        iscredit 
                        isGiftCard
                        isDefault
                      }
                      mWarehouse{
                        mWarehouseID
                        name
                      }
                      customerAddress{
                        sCustomerAddressID
                          line1
                          line2
                          line3
                          fulladdress
                          phone
                          city
                          postalcode
                          csCountry{
                              csCountryID
                              name          
                          }
                          csRegion{
                              csRegionID
                              name
                          }
                      }
                      locations{
                          csBunitLocationId
                          fulladdress
                          phone
                          contactPerson
                      }
                       salesRep{
                          code
                          name
                          salesRepresentId
                      }
                      
                    }
                    
                  }
                  status
                  message
                }
              
              }
`

        }
        Axios({
            url: serverUrl,
            method: "POST",
            data: tillData,
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${access_token}`,
            },
        }).then((response) => {
            if (response.data.data.tillData.status === "200") {
                setLoading(false)
                message.success(response.data.data.tillData.message)
                // setAddedUserData(response.data.data.tillData.tillAccess)
            }
            else {
                setLoading(false)
                message.error(response.data.data.tillData.message)
            }
        })
            .catch((error) => {
                console.log(error)
            })
    }
    const getUserData = () => {
        const cwrTillId = localStorage.getItem('cwrTillId')
        const getTillUser = {
            query: `query {
                getTillUser(tillId: "${cwrTillId}") {
              cwrTillaccessId
              userAccessController
              csUser{
                 csUserId
                 username
              }
            }
            }
          
`

        }
        Axios({
            url: serverUrl,
            method: "POST",
            data: getTillUser,
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${access_token}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setLoading(false)
                message.success(response.data.data.getTillUser.message)
                setAddedUserData(response.data.data.getTillUser)
                setisSaved(true)
                setDisableAddUserButton(true)
                if (response.data.data.getTillUser?.length > 0) {
                    setShowUSerDetails(true)
                }

            }
            else {
                setLoading(false)
                message.error(response.data.data.getTillUser.message)
            }
        })
            .catch((error) => {
                console.log(error)
            })
    }
    const upsertTillUser = (cwrTillId) => {
        let uniqueId = uuid()
            .replace(/-/g, "")
            .toUpperCase();
        const userData = JSON.parse(localStorage.getItem("userData"))
        const user = userData.user_id
        const upsertTillUser = {
            query: `mutation {
            upsertTillUser(user:[{
              cwrTillaccessId: "${uniqueId}"
              csUserId: "${user}"
              cwrTillId: "${cwrTillId}"
              userAccessController: "{\\"pos\\":\\"Y\\",\\"layout\\":\\"1\\",\\"kds_print\\":\\"Y\\",\\"dineIn\\":\\"N\\",\\"purchase\\":\\"Y\\",\\"dayEnd\\":\\"N\\",\\"cashManagement\\":\\"Y\\"}"
            }]) { 
          status
          message   
          }
          }
          
`

        }
        Axios({
            url: serverUrl,
            method: "POST",
            data: upsertTillUser,
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${access_token}`,
            },
        }).then((response) => {
            if (response.data.data.upsertTillUser.status === "200") {
                setLoading(false)
                message.success(response.data.data.upsertTillUser.message)
                // setShowUserList(true)
                setisSaved(true)
                setShowAddUserButton(true)
                setAddUserdropDownSection(false)
                setIsFieldDesable(true)
                setShowAddedUsers(true)
                // getTillAndUserData()
                getUserData()
                // setAddedUserData()


            }
            else {
                setLoading(false)
                message.error(response.data.data.upsertTillUser.message)
            }
        })
            .catch((error) => {
                console.log(error)
            })
    }
    return (
        <Spin indicator={<LoadingOutlined style={{ fontSize: "52px" }} spin />} spinning={loading}>

            <>
                <Form layout='vertical' form={manageTillandUserForm} onFinish={onFinish}>

                    <Row justify="space-between" align="middle">
                        <Col className="main-heading">
                            {name}
                        </Col>
                        {isSaved ?
                            <Col>
                                <Button onClick={onClickEdit} style={{ marginRight: "0.5rem", background: "#0C173A", color: "#F5F5F5", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", }} >Edit</Button>
                                <Button onClick={onClickClose} style={{ color: "#0C173A", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", }} >Close</Button>

                            </Col>
                            :
                            <Col>
                                <Form.Item noStyle={true}>
                                    <Button id="step1" type="primary" htmlType="submit" style={{ marginRight: "0.5rem", background: "#0C173A", color: "#F5F5F5", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", padding: "0 2rem" }}>Save</Button>
                                </Form.Item>
                                <Button onClick={onClickCancel} style={{ color: "#0C173A", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", }} >Cancel</Button>
                            </Col>
                        }

                    </Row>
                    <Collapse defaultActiveKey={['1', '2', '3', '4']} style={{ border: "none", padding: "0", margin: "0", width: "100%" }}>
                        <Panel header="Till Details" key="1" style={{ border: "none" }}>
                            <Row gutter={[24, 24]} style={{ marginBottom: '1rem' }}>
                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>Till ID</span>}
                                        name="tillId"
                                        rules={[{ required: true, message: 'Please Input Till Id!' }]}
                                    >
                                        <Input className="input-inside-text" disabled={isFieldDesable} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>Name</span>}
                                        name="tillName"
                                        rules={[{ required: true, message: 'Please Input Till Name!' }]}
                                    >
                                        <Input className="input-inside-text" disabled={isFieldDesable} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>Description</span>}
                                        name="description"
                                    // rules={[{ required: true, message: 'Please Input Description!' }]}
                                    >
                                        <Input className="input-inside-text" disabled={isFieldDesable} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>Prefix</span>}
                                        name="prefix"
                                        rules={[{ required: true, message: 'Please Input Till Name!' }]}
                                    >
                                        <Input className="input-inside-text" disabled={isFieldDesable} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>Next Order Number</span>}
                                        name="nextOrderNo"
                                        rules={[{ required: true, message: 'Please Input Till Name!' }]}
                                    >
                                        <Input className="input-inside-text" disabled={isFieldDesable} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Panel>
                        {showUSerDetails ?
                            <Panel header="User Details" key="4" style={{ border: "none",alignSelf:"center" }}>
                                <Row gutter={[24, 24]} align="middle" style={{ marginBottom: '1rem', }}>
                                    {addedUserData?.map((user) => (
                                        <Col span={8} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
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
                                                <img src={userIcon} alt="" />
                                            </div>
                                            <div style={{ display: "grid" }}>
                                                {<span className="lable-text" style={{ fontWeight: 500, color: "#0C173A" }}>User : {user.csUser.username}</span>}
                                            </div>
                                        </Col>
                                    ))}
                                    <Col span={8}  >
                                        {showAddUserButton === true && addUserdropDownSection === false ?
                                            <Button onClick={onClickAddUser} style={{ background: "#0C173A", color: "#F5F5F5", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", padding: "0 2rem" }}>Add User</Button>
                                            :
                                            // <Col span={8}>
                                                <Form.Item
                                                    label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>User</span>}
                                                    name="user"
                                                // rules={[{ required: true, message: 'Please input Input 1!' }]}
                                                >
                                                    <Select onFocus={onClickUserSelectBox} onSelect={onSelectUSer} style={{width:"60%"}}>
                                                        {userList.map((data) => (
                                                            <Option key={data.value} value={data.value} title={data.value}>
                                                                {data.userName}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            // </Col>

                                        }
                                    </Col>

                                </Row>
                                {/* {disableAddUserButton ? "" :
                                    <Row style={{ padding: "1rem 0" }}>
                                        <Button onClick={onClickAddUser1} style={{ background: "#0C173A", color: "#F5F5F5", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", padding: "0 2rem" }}>Add User</Button>
                                    </Row>
                                } */}
                            </Panel>
                            : ""
                        }
                        {/* {showAddUserButton === true && addUserdropDownSection === false ?
                            <Panel header="Add User" key="2" forceRender={showAddUserButton ? true : false} style={{ border: "none" }}>
                                <Button onClick={onClickAddUser} style={{ background: "#0C173A", color: "#F5F5F5", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Inter", lineHeight: "17px", fontStyle: "normal", padding: "0 2rem" }}>Add User</Button>
                            </Panel>
                            :
                            ""
                        } */}

                        {/* {showAddUserButton === false && addUserdropDownSection === true ?
                            <Panel header="Add User" key="3" forceRender={showAddUserButton ? true : false} style={{ border: "none" }}>
                                <Row gutter={[24, 24]} style={{ padding: '0.5rem 0' }}>
                                    <Col span={8}>
                                        <Form.Item
                                            label={<span style={{ fontFamily: "Inter", fontStyle: "normal", fontSize: "12px", fontWeight: 400, lineHeight: "15px", color: "#000000", opacity: "0.5" }}>User</span>}
                                            name="user"
                                        // rules={[{ required: true, message: 'Please input Input 1!' }]}
                                        >
                                            <Select onFocus={onClickUserSelectBox} onSelect={onSelectUSer} className="input-inside-text" >
                                                {userList.map((data) => (
                                                    <Option key={data.value} value={data.value} title={data.value}>
                                                        {data.userName}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                </Row>
                            </Panel> : ""
                        } */}

                    </Collapse>
                </Form>

            </>
        </Spin>
    )
}
export default UpsertTillAndUser;
