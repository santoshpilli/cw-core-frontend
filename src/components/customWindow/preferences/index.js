import { Card, Checkbox, Col, Input, Row, Select, Button, Form, message, Spin } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from 'react';
import "./styles.css"
// import { serverUrl } from "../../../constants/serverConfig";
import Axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import { getOAuthHeaders } from '../../../constants/oAuthValidation';
import Scrollbars from 'react-custom-scrollbars';
import { getTabData } from '../../../services/generic';


const Preferences = () => {
    const { pathname } = useLocation();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [mainForm] = Form.useForm();
    const [allowManualDiscountFlag, setAllowManualDiscountFlag] = useState(false);
    const [discountByAmountFlag, setDiscountByAmountFlag] = useState(false);
    const [discountByPercentageFlag, setDiscountByPercentagaeFlag] = useState(false);
    const [customerSearchFlag, setCustomerSearchFlag] = useState(false);
    const [searchByFlag, setSearchByFlag] = useState(false);
    const [customFieldFlag, setCustomFieldFlag] = useState(false);
    const [enableBillFlag, setEnableBillFlag] = useState(false);
    const [defaultSearchScreenFlag, setDefaultSearchScreenFlag] = useState(false);
    const [enableCardIntegrationFlag, setEnableCardIntegrationFlag] = useState(false);
    const [enableCardFlag, setEnableCardFlag] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [initialValues, setInitialValues] = useState({});
    const serverUrl = process.env.REACT_APP_serverUrl;
    const urlPath = window.location.pathname;
    const pathSegments = urlPath.split('/');
    const recordId = pathSegments[pathSegments.length - 1];

    const { Option } = Select;



    useEffect(async () => {
        let headerRecordData;
        if (recordId !== "NEW_RECORD") {
            const getTabDataResponse = await getTabData({ windowId: "7585", ad_tab_id: "CA24F0DE019C40BC962E1F03B532F1A7", recordId: recordId, startRow: "0", endRow: "1" });
            headerRecordData = getTabDataResponse[0];
            getConfigData(headerRecordData.EE8F1047056B4CA9B4FB899BF527BF56);
        }
    }, []);


    const onFinish = (values, e) => {
        for (const prop in values) {
            if (values[prop] === true) {
                values[prop] = "Y";
            } else if (values[prop] === false || values[prop] === undefined) {
                values[prop] = "N";
            }
        }
        if (values.showCustomerSearch === "N" || values.showCustomerSearch === "false") {
            values.showCustomerSearch = "Do Not Show"
        }
        values.printReceipt = "N";
        values.addLoyaltyLevel = "N";
        values.loyaltyLevelID = null;

        const filteredValues = { ...values };
        delete filteredValues.name;
        delete filteredValues.posType;
        delete filteredValues.activateExpiryDiscount;
        delete filteredValues.minimumOpeningAmount;
        const Fieldvalues = JSON.stringify(JSON.stringify(filteredValues));


        try {
            setLoading(true);
            const { access_token } = getOAuthHeaders();
            const posConfigArray = [];
            posConfigArray.push(

                `{
                application:"POS"
                name:${values.name !== "N" ? `"${values.name}"` : null}
                posType:${values.posType !== "N" ? `"${values.posType}"` : null}
                activateExpiryDiscount:"${values.activateExpiryDiscount}"
                minimumOpeningAmount: ${values.minimumOpeningAmount !== "N" && values.minimumOpeningAmount  ? values.minimumOpeningAmount : null}
                configJson: ${Fieldvalues},
            },
            `

            );

            const posConfigMutation = {
                query: `mutation {
              upsertPOSConfig(posConfig: {
                cwrPosConfigs: [${posConfigArray}]
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
                    Authorization: `bearer ${access_token}`,
                },
            }).then((response) => {
                const posConfigResponse = response.data.data.upsertPOSConfig;
                if (posConfigResponse.status === "200") {
                    message.success(posConfigResponse.message);
                    setLoading(false);
                    setIsFormChanged(false)
                } else {
                    message.error(posConfigResponse.message);
                    setLoading(false);
                }
            });
        } catch (error) {
            console.log(error)
        }
        // const pathSegments = pathname.split('/');
        // const segmentAfterHost = pathSegments[1];
        // if (segmentAfterHost === 'popupWindow') {
        //     window.self.close();
        // }

    };


    const getConfigData = async (recordName) => {
        try {
            setLoading(true);
            const { access_token } = getOAuthHeaders();
            const getPOSConfigMutation = {
                query: `query{
              getPOSConfig(tillId:null , name: "${recordName}")
              {
                cwrPosConfigId
                name
                posType
                application
                configJson
                PricingRule
                ExpiryDiscount
                activateExpiryDiscount
                minimumOpeningAmount
              }
            }`,
            };

            const headers = {
                "Content-Type": "application/json",
                Authorization: `bearer ${access_token}`,
            };

            const PosResponse = await Axios.post(serverUrl, getPOSConfigMutation, { headers: headers }, { async: true }, { crossDomain: true });

            if (PosResponse.status === 200) {
                setLoading(false)
                const posConfigResponse = PosResponse.data.data.getPOSConfig.filter(val => val.cwrPosConfigId === recordId);
                const stringifiedConfig = JSON.parse(posConfigResponse[0].configJson);
                const posParsedConfigJSON = stringifiedConfig;

                const { allowManualDiscount,
                    discountByAmount_status,
                    discountByAmount_value,
                    discountPercentage_Value,
                    discountByPercentage_status,
                    allowSplitTender, enableCash,
                    enableCard,
                    enableCardIntegration,
                    showCustomerSearch,
                    defaultCustomerSearch,
                    byName,
                    customFieldStatus,
                    byNumber,
                    showTillOpening,
                    showDenominations,
                    shiftClose,
                    dayClose,
                    pettyCash,
                    cashOut,
                    cashIn,
                    cashDiffInShiftClose,
                    allowLogout,
                    showDayOpeningAmount,
                    taxExcluded,
                    allowReturnRefund,
                    allowPriceUpdate,
                    allowBillParking,
                    allowItemWiseSaleReq,
                    allowReturnExchange,
                    showImage,
                    allowOrderWiseSalesreq,
                    showOrderSalesRep,
                    showSalesReturn,
                    showLineSalesRep,
                    showWeightPopup,
                    enableDefaultLoyalty,
                    showKeyboard,
                    enableLayaway,
                    defautSearchScreenStatus,
                    openingregister,
                    closingRegister,
                    cashCarry,
                    homeDelivery,
                    storePickUp,
                    enableCardIntegrationValue,
                    showCustomerSearchValue,
                    customFieldValue,
                    defaultSearchScreen,
                    posType, name, eBillWebHookURL, eBillCommType, eBill,minimumOpeningAmount
                } = posParsedConfigJSON;
                mainForm.setFieldsValue({
                    discountByAmount_value: discountByAmount_value === "N" ? "" : discountByAmount_value,
                    discountPercentage_Value: discountPercentage_Value === "N" ? "" : discountPercentage_Value,
                    enableCardIntegrationValue: enableCardIntegrationValue === "N" ? "" : enableCardIntegrationValue,
                    showCustomerSearchValue: showCustomerSearchValue === "N" ? "" : showCustomerSearchValue,
                    customFieldValue: customFieldValue === "N" ? "" : customFieldValue,
                    defaultSearchScreen: defaultSearchScreen === "N" ? "" : defaultSearchScreen,
                    posType: posConfigResponse[0].posType ? posConfigResponse[0].posType : "",
                    name: posConfigResponse[0].name ? posConfigResponse[0].name : "",
                    minimumOpeningAmount: posConfigResponse[0].minimumOpeningAmount ? posConfigResponse[0].minimumOpeningAmount : "",
                    eBillWebHookURL: eBillWebHookURL === "N" ? "" : eBillWebHookURL,
                    eBillCommType: eBillCommType === "N" ? "" : eBillCommType,
                })
                // mainForm.setFieldsValue({allowManualDiscount:ch})
                if (posConfigResponse[0].activateExpiryDiscount === "Y") {
                    mainForm.setFieldsValue({
                        activateExpiryDiscount: posConfigResponse[0].activateExpiryDiscount
                    })
                }
                if (eBill === "Y") {
                    mainForm.setFieldsValue({
                        eBill: eBill
                    })
                    setEnableBillFlag(true)
                }
                if (allowManualDiscount === "Y") {
                    mainForm.setFieldsValue({
                        allowManualDiscount: allowManualDiscount
                    })
                    setAllowManualDiscountFlag(true)
                }
                if (discountByAmount_status === "Y") {
                    mainForm.setFieldsValue({
                        discountByAmount_status: discountByAmount_status
                    })
                    setDiscountByAmountFlag(true)
                }

                if (discountByPercentage_status === "Y") {
                    mainForm.setFieldsValue({
                        discountByPercentage_status: discountByPercentage_status
                    })
                    setDiscountByPercentagaeFlag(true)
                }
                if (enableCash === "Y") {
                    mainForm.setFieldsValue({
                        enableCash: enableCash
                    })
                }
                if (enableCard === "Y") {
                    mainForm.setFieldsValue({
                        enableCard: enableCard
                    })
                    setEnableCardFlag(true);
                }
                if (enableCardIntegration === "Y") {
                    mainForm.setFieldsValue({
                        enableCardIntegration: enableCardIntegration
                    })
                    setEnableCardIntegrationFlag(true);
                }
                if (allowSplitTender === "Y") {
                    mainForm.setFieldsValue({
                        allowSplitTender: allowSplitTender
                    })
                }
                if (showCustomerSearch === "Y") {
                    mainForm.setFieldsValue({
                        showCustomerSearch: showCustomerSearch
                    })
                    setCustomerSearchFlag(true)
                }
                if (defaultCustomerSearch === "Y") {
                    mainForm.setFieldsValue({
                        defaultCustomerSearch: defaultCustomerSearch
                    })
                    setSearchByFlag(true)
                }
                if (byName === "Y") {
                    mainForm.setFieldsValue({
                        byName: byName
                    })
                }
                if (customFieldStatus === "Y") {
                    mainForm.setFieldsValue({
                        customFieldStatus: customFieldStatus
                    })
                    setCustomFieldFlag(true)
                }
                if (byNumber === "Y") {
                    mainForm.setFieldsValue({
                        byNumber: byNumber
                    })
                }
                if (showTillOpening === "Y") {
                    mainForm.setFieldsValue({
                        showTillOpening: showTillOpening
                    })
                }
                if (showDenominations === "Y") {
                    mainForm.setFieldsValue({
                        showDenominations: showDenominations
                    })
                }
                if (shiftClose === "Y") {
                    mainForm.setFieldsValue({
                        shiftClose: shiftClose
                    })
                }
                if (dayClose === "Y") {
                    mainForm.setFieldsValue({
                        dayClose: dayClose
                    })
                }
                if (pettyCash === "Y") {
                    mainForm.setFieldsValue({
                        pettyCash: pettyCash
                    })
                }
                if (cashOut === "Y") {
                    mainForm.setFieldsValue({
                        cashOut: cashOut
                    })
                }
                if (cashIn === "Y") {
                    mainForm.setFieldsValue({
                        cashIn: cashIn
                    })
                }
                if (cashDiffInShiftClose === "Y") {
                    mainForm.setFieldsValue({
                        cashDiffInShiftClose: cashDiffInShiftClose
                    })
                }
                if (allowLogout === "Y") {
                    mainForm.setFieldsValue({
                        allowLogout: allowLogout
                    })
                }
                if (showDayOpeningAmount === "Y") {
                    mainForm.setFieldsValue({
                        showDayOpeningAmount: showDayOpeningAmount
                    })
                }
                if (taxExcluded === "Y") {
                    mainForm.setFieldsValue({
                        taxExcluded: taxExcluded
                    })
                }
                if (allowReturnRefund === "Y") {
                    mainForm.setFieldsValue({
                        allowReturnRefund: allowReturnRefund
                    })
                }
                if (allowPriceUpdate === "Y") {
                    mainForm.setFieldsValue({
                        allowPriceUpdate: allowPriceUpdate
                    })
                }
                if (allowBillParking === "Y") {
                    mainForm.setFieldsValue({
                        allowBillParking: allowBillParking
                    })
                }
                if (allowItemWiseSaleReq === "Y") {
                    mainForm.setFieldsValue({
                        allowItemWiseSaleReq: allowItemWiseSaleReq
                    })
                }
                if (allowReturnExchange === "Y") {
                    mainForm.setFieldsValue({
                        allowReturnExchange: allowReturnExchange
                    })
                }
                if (showImage === "Y") {
                    mainForm.setFieldsValue({
                        showImage: showImage
                    })
                }
                if (allowOrderWiseSalesreq === "Y") {
                    mainForm.setFieldsValue({
                        allowOrderWiseSalesreq: allowOrderWiseSalesreq
                    })
                }
                if (showOrderSalesRep === "Y") {
                    mainForm.setFieldsValue({
                        showOrderSalesRep: showOrderSalesRep
                    })
                }
                if (showSalesReturn === "Y") {
                    mainForm.setFieldsValue({
                        showSalesReturn: showSalesReturn
                    })
                }
                if (showLineSalesRep === "Y") {
                    mainForm.setFieldsValue({
                        showLineSalesRep: showLineSalesRep
                    })
                }
                if (showWeightPopup === "Y") {
                    mainForm.setFieldsValue({
                        showWeightPopup: showWeightPopup
                    })
                }
                if (enableDefaultLoyalty === "Y") {
                    mainForm.setFieldsValue({
                        enableDefaultLoyalty: enableDefaultLoyalty
                    })
                }
                if (showKeyboard === "Y") {
                    mainForm.setFieldsValue({
                        showKeyboard: showKeyboard
                    })
                }
                if (enableLayaway === "Y") {
                    mainForm.setFieldsValue({
                        enableLayaway: enableLayaway
                    })
                }
                if (defautSearchScreenStatus === "Y") {
                    mainForm.setFieldsValue({
                        defautSearchScreenStatus: defautSearchScreenStatus
                    })
                    setDefaultSearchScreenFlag(true);
                }
                if (openingregister === "Y") {
                    mainForm.setFieldsValue({
                        openingregister: openingregister
                    })
                }
                if (closingRegister === "Y") {
                    mainForm.setFieldsValue({
                        closingRegister: closingRegister
                    })
                }
                if (cashCarry === "Y") {
                    mainForm.setFieldsValue({
                        cashCarry: cashCarry
                    })
                }
                if (homeDelivery === "Y") {
                    mainForm.setFieldsValue({
                        homeDelivery: homeDelivery
                    })
                }
                if (storePickUp === "Y") {
                    mainForm.setFieldsValue({
                        storePickUp: storePickUp
                    })
                }


            }
            // posConfigTabsData(posConfigResponse)
        } catch (error) {
            console.log(error)
        }
        mainForm.validateFields()
            .then(values => {
                setInitialValues(values)
            });
    };

    const onchangeCheckBox = (key) => (e) => {
        if (e.target.id === "mainForm_allowManualDiscount") {
            if (e.target.checked === true) {
                setAllowManualDiscountFlag(true)
            }
            else { setAllowManualDiscountFlag(false) }

        }
        if (e.target.id === "mainForm_discountByPercentage_status") {
            if (e.target.checked === true) {
                setDiscountByPercentagaeFlag(true)
            }
            else { setDiscountByPercentagaeFlag(false) }

        }
        if (e.target.id === "mainForm_discountByAmount_status") {
            if (e.target.checked === true) {
                setDiscountByAmountFlag(true)
            }
            else { setDiscountByAmountFlag(false) }

        }

        if (e.target.id === "mainForm_showCustomerSearch") {
            if (e.target.checked === true) {
                setCustomerSearchFlag(true)
            }
            else { setCustomerSearchFlag(false) }

        }

        if (e.target.id === "mainForm_defaultCustomerSearch") {
            if (e.target.checked === true) {
                setSearchByFlag(true)
            }
            else { setSearchByFlag(false) }

        }
        if (e.target.id === "mainForm_customFieldStatus") {
            if (e.target.checked === true) {
                setCustomFieldFlag(true)
            }
            else { setCustomFieldFlag(false) }

        }
        if (e.target.id === "mainForm_eBill") {
            if (e.target.checked === true) {
                setEnableBillFlag(true)
            }
            else { setEnableBillFlag(false) }

        }
        if (e.target.id === "mainForm_defautSearchScreenStatus") {
            if (e.target.checked === true) {
                setDefaultSearchScreenFlag(true)
            }
            else { setDefaultSearchScreenFlag(false) }

        }
        if (e.target.id === "mainForm_enableCard") {
            if (e.target.checked === true) {
                setEnableCardFlag(true)
            }
            else { setEnableCardFlag(false) }

        }
        if (e.target.id === "mainForm_enableCardIntegration") {
            if (e.target.checked === true) {
                setEnableCardIntegrationFlag(true)
            }
            else { setEnableCardIntegrationFlag(false) }

        }

    }

    const handleFormChange = (values) => {
        setIsFormChanged(true)

    };
    const onClickCancel = () => {
        mainForm.resetFields()
        setIsFormChanged(false)
    }

    const renderThumb = ({ style, ...props }) => {
        const thumbStyle = {
            backgroundColor: "#c1c1c1",
            borderRadius: "5px",
            width: "8px",
        };
        return <div style={{ ...style, ...thumbStyle }} {...props} />;
    };

    const renderThumbHorizontalScroll = ({ style, ...props }) => {
        const thumbStyle = {
            // backgroundColor: "#c1c1c1",
            // borderRadius: "5px",
            width: "0px",
        };
        return <div style={{ ...style, ...thumbStyle }} {...props} />;
    };

    const renderView = ({ style, ...props }) => {
        const viewStyle = {
            color: "#00000",
        };
        return <div className="box" style={{ ...style, ...viewStyle, overflowX: "hidden" }} {...props} />;
    };
    return (
        <Spin indicator={<LoadingOutlined style={{ fontSize: "52px" }} spin />} spinning={loading}>
            <Scrollbars
                autoHide={false}
                // Hide delay in ms
                // autoHideTimeout={1000}
                // Duration for hide animation in ms.
                // autoHideDuration={200}
                thumbSize={100}
                renderView={renderView}
                renderThumbHorizontal={renderThumbHorizontalScroll}
                renderThumbVertical={renderThumb}
                style={{ height: "77vh" }}>
                <Form onFinish={onFinish} form={mainForm} name='mainForm'
                    initialValues={initialValues}
                    onValuesChange={handleFormChange}>
                    <div>
                        <div className='pref-headings-div'>
                            <span className='pref-headings'>
                                Info
                            </span>
                        </div>
                        <Card>
                            <Row gutter={[0, 8]} style={{ display: "flex" }} justify="start">
                                <Col xs={24} sm={12} md={10} className='pref-card-div'>
                                    <span className='lable-text' style={{ marginRight: "0.5rem" }}>Name</span>
                                    <Form.Item name="name" noStyle={true}>
                                        <Input className='inside-text' style={{ width: "10vw" }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={10} className='pref-card-div'>
                                    <span className='lable-text' style={{ marginRight: "0.5rem" }}>Layout</span>
                                    <Form.Item name="posType" noStyle={true}>
                                        <Select className='inside-text' style={{ width: "10vw" }}>
                                            <Option className="inside-text" value="RT">Retail</Option>
                                            <Option className="inside-text" value="FB">F&B</Option>
                                            <Option className="inside-text" value="FG">FMCG</Option>
                                            <Option className="inside-text" value="FS">Fashion</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="activateExpiryDiscount" valuePropName="checked" noStyle={true}>
                                        <Checkbox style={{ marginRight: "1rem" }} />
                                    </Form.Item>
                                    <span className='lable-text'>Activate Expiry Discount</span>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                    <div>
                        <div className='pref-headings-div'>
                            <span className='pref-headings'>
                                Payments
                            </span>
                        </div>
                        <Card>
                            <Row >
                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="enableCash" valuePropName="checked" noStyle={true}>
                                        <Checkbox style={{ marginRight: "1rem" }} />
                                    </Form.Item>
                                    <span className='lable-text'>Enable Cash</span>
                                </Col>
                                <Col span={14} className='pref-card-div' >
                                    <Form.Item name="allowSplitTender" valuePropName="checked" noStyle={true}>
                                        <Checkbox style={{ marginRight: "1rem" }} />
                                    </Form.Item>
                                    <span className='lable-text' style={{ marginRight: "1rem" }}>Allow Split Tender</span>
                                    <span className='note-text'>(This Option should allow Splitting Payment to Multiple Payment Methods)</span>
                                </Col>
                                <Col span={24} className='pref-card-div' style={{ alignItems: "unset" }} >
                                    <Row gutter={[0, 8]}>
                                        <Col >
                                            <Form.Item name="enableCard" valuePropName='checked' noStyle={true}>
                                                <Checkbox checked={enableCardFlag} onChange={onchangeCheckBox('enableCard')} style={{ marginRight: "1rem" }} />
                                            </Form.Item>
                                        </Col>
                                        {/* <Row gutter={[0, 8]}> */}
                                        <Col> <span className='lable-text' >Enable Card</span></Col>
                                        {enableCardFlag ?
                                            <Col offset={3} span={21} >
                                                <Row align="top" style={{ display: "flex", alignItems: "center" }} >
                                                    <Col >
                                                        <Form.Item name="enableCardIntegration" valuePropName="checked" noStyle={true}>
                                                            <Checkbox checked={enableCardIntegrationFlag} onChange={onchangeCheckBox('enableCardIntegration')} style={{ marginRight: "1rem" }} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col><span className='lable-text' style={{ marginRight: "0.5rem" }}>Enable Card Integration</span></Col>
                                                    <Col >
                                                        {enableCardIntegrationFlag ?

                                                            <Form.Item name="enableCardIntegrationValue" noStyle={true} >
                                                                <Select className='inside-text' defaultValue="Paytm"  >
                                                                    <Option className="inside-text" value="Paytm">Paytm</Option>
                                                                    <Option className="inside-text" value="Innoviti">Innoviti</Option>
                                                                    <Option className="inside-text" value="Pine Labs">Pine Labs</Option>
                                                                    <Option className="inside-text" value="EzeTap">EzeTap</Option>
                                                                </Select>
                                                            </Form.Item>

                                                            : ""}

                                                    </Col>
                                                </Row>
                                            </Col>
                                            : ""}
                                    </Row>
                                    {/* </Row> */}
                                </Col>

                            </Row>
                        </Card>
                    </div>
                    <div>
                        <div className='pref-headings-div'>
                            <span className='pref-headings'>
                                Customer
                            </span>
                        </div>
                        <Card>
                            <Row >
                                <Col span={24} className='pref-card-div' >
                                    <Form.Item name="showCustomerSearch" valuePropName="checked" noStyle={true} >
                                        <Checkbox checked={customerSearchFlag} onChange={onchangeCheckBox('showCustomerSearch')} style={{ marginRight: "1rem" }} />
                                    </Form.Item>
                                    {/* <Row  gutter={[0, 4]}> */}
                                    <Col >
                                        <span className='lable-text' style={{ marginRight: "0.5rem" }}>Customer Search</span>
                                    </Col>
                                    {customerSearchFlag ?
                                        <Col span={4}>
                                            <Form.Item name="showCustomerSearchValue" noStyle={true}>
                                                <Select className='inside-text' defaultValue="Before Payment">
                                                    <Option className="inside-text" value="Before Payment">Before Payment</Option>
                                                    <Option className="inside-text" value="After Payment">After Payment</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        : ""}
                                    {/* </Row> */}
                                </Col>
                                <Col span={24} className='pref-card-div' style={{ alignItems: "unset" }}>
                                    <Row gutter={[24, 8]}>
                                        <Col>
                                            <Form.Item name="defaultCustomerSearch" valuePropName='checked' noStyle={true}>
                                                <Checkbox checked={searchByFlag} onChange={onchangeCheckBox('defaultCustomerSearch')} style={{ marginRight: "1rem" }} />
                                            </Form.Item>
                                            <span className='lable-text'>Search By</span>
                                        </Col>
                                        {searchByFlag &&
                                            <Col offset={2} span={22}>
                                                <Row align="top" gutter={[24, 8]}>
                                                    <Col span={8} >
                                                        <Row gutter={[24, 8]} style={{ display: "flex", alignItems: "center" }}>
                                                            <Col >
                                                                <Form.Item name="customFieldStatus" valuePropName="checked" noStyle={true}>
                                                                    <Checkbox checked={customFieldFlag} onChange={onchangeCheckBox('customFieldStatus')} style={{ marginRight: "1rem" }} />
                                                                </Form.Item>
                                                                <span className='lable-text' >Custom Field</span>
                                                            </Col>
                                                            {customFieldFlag &&
                                                                <Col>
                                                                    <Form.Item name="customFieldValue" noStyle={true} style={{ marginLeft: "1rem" }}>
                                                                        <Select className='inside-text' defaultValue="Email">
                                                                            <Option className="inside-text" value="Email">Email</Option>
                                                                            <Option className="inside-text" value="Products Purchased">Products Purchased</Option>
                                                                            <Option className="inside-text" value="Amount">Amount</Option>
                                                                        </Select>
                                                                    </Form.Item>
                                                                </Col>

                                                            }
                                                        </Row>

                                                    </Col>
                                                    <Col span={8} style={{ display: "flex", alignItems: "center" }}>
                                                        <Form.Item name="byName" valuePropName="checked" noStyle={true}>
                                                            <Checkbox style={{ marginRight: "1rem" }} />
                                                        </Form.Item>
                                                        <span className='lable-text'>By Name</span>
                                                    </Col>
                                                    <Col span={8} style={{ display: "flex", alignItems: "center" }}>
                                                        <Form.Item name="byNumber" valuePropName="checked" noStyle={true}>
                                                            <Checkbox style={{ marginRight: "1rem" }} />
                                                        </Form.Item>
                                                        <span className='lable-text'>By Number</span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        }
                                    </Row>
                                </Col>

                            </Row>
                        </Card>
                    </div>
                    <div>
                        <div className='pref-headings-div'>
                            <span className='pref-headings'>
                                Cash Register
                            </span>
                        </div>
                        <Card>
                            <Row >
                            <Col xs={10} className='pref-card-div'>
                                    <span className='lable-text' style={{ marginRight: "0.5rem" }}>Minimum Opening Amount</span>
                                    <Form.Item name="minimumOpeningAmount" noStyle={true}>
                                        <Input className='inside-text' style={{ width: "10vw" }} />
                                    </Form.Item>
                                </Col>
                                <Col span={14} className='pref-card-div' >
                                    <Form.Item name="showTillOpening" valuePropName="checked" noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Enable Shift Open</span>
                                </Col>
                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="showDenominations" valuePropName="checked" noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Show Cash Denominations</span>
                                </Col>
                                <Col span={14} className='pref-card-div' >
                                    <Form.Item name="shiftClose" valuePropName="checked" noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Enable Shift Close</span>
                                </Col>
                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="dayClose" valuePropName="checked" noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Enable Day Close</span>
                                </Col>
                                <Col span={14} className='pref-card-div' >
                                    <Form.Item name="pettyCash" valuePropName="checked" noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Allow Petty Cash</span>
                                </Col>
                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="cashOut" valuePropName="checked" noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Allow Cash Out</span>
                                </Col>
                                <Col span={14} className='pref-card-div' >
                                    <Form.Item name="cashIn" valuePropName="checked" noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Allow Cash In</span>
                                </Col>
                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="cashDiffInShiftClose" valuePropName="checked" noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Allow Cash Difference In Shift Close</span>
                                </Col>
                                <Col span={14} className='pref-card-div' >
                                    <Form.Item name="allowLogout" noStyle={true} valuePropName="checked"><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Allow Logout (Without Shift Close)</span>
                                </Col>
                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="showDayOpeningAmount" noStyle={true} valuePropName="checked"><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Show Day Opening Amount (In Close Till)</span>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                    <div>
                        <div className='pref-headings-div'>
                            <span className='pref-headings'>
                                Taxes
                            </span>
                        </div>
                        <Card>
                            <Row >
                                <Col span={24} className='pref-card-div' >
                                    <Form.Item name='taxExcluded' valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Tax Excluded</span>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                    <div>
                        <div className='pref-headings-div'>
                            <span className='pref-headings'>
                                POS
                            </span>
                        </div>
                        <Card>
                            <Row >

                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="allowReturnRefund" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Allow Return & Refund</span>
                                </Col>
                                <Col span={14} className='pref-card-div' >
                                    <Form.Item name="allowReturnExchange" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Allow Return & Exchange</span>
                                </Col>
                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="allowPriceUpdate" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Allow Price Update</span>
                                </Col>
                                <Col span={14} className='pref-card-div' >
                                    <Form.Item name="showImage" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Show Product Images</span>
                                </Col>
                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="allowBillParking" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Allow Bill Parking</span>
                                </Col>
                                <Col span={14} className='pref-card-div' >
                                    <Form.Item name="allowOrderWiseSalesreq" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Allow Order wise Sales Rep</span>
                                </Col>

                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="allowItemWiseSaleReq" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Allow Item wise Sales Rep</span>
                                </Col>
                                <Col span={14} className='pref-card-div' >
                                    <Form.Item name="showOrderSalesRep" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Show Order Line Sales Rep</span>
                                </Col>
                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="showSalesReturn" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Show Sales Return</span>
                                </Col>
                                <Col span={14} className='pref-card-div' >
                                    <Form.Item name="showLineSalesRep" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Show Line Sales Rep</span>
                                </Col>
                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="showWeightPopup" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text' >Show Weight Pop Up</span>
                                </Col>
                                <Col span={14} className='pref-card-div' >
                                    <Form.Item name="enableDefaultLoyalty" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text' >Enable Default Loyalty</span>
                                </Col>
                                <Col span={10} className='pref-card-div' >
                                    <Row gutter={[, 8]}>
                                        <Col>
                                            <Form.Item name="defautSearchScreenStatus" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} checked={defaultSearchScreenFlag} onChange={onchangeCheckBox('defautSearchScreenStatus')} /></Form.Item>
                                        </Col>
                                        <Col><span className='lable-text' >Default Product Search</span></Col>
                                        {defaultSearchScreenFlag ?
                                            <Col span={21}>
                                                <Form.Item name="defaultSearchScreen" noStyle={true}>
                                                    <Select className='inside-text' defaultValue="Product Search">
                                                        <Option className="inside-text" value="Product Search">Product Search</Option>
                                                        <Option className="inside-text" value="Category Search">Category Search</Option>
                                                        <Option className="inside-text" value="SKU/UPC Search">SKU/UPC Search</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            : ""}
                                    </Row>
                                </Col>
                                <Col span={14} className='pref-card-div' >
                                    <Form.Item name="showKeyboard" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text' >Show Keyboard</span>
                                </Col>
                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="enableLayaway" valuePropName='checked' noStyle={true}>
                                        <Checkbox style={{ marginRight: "1rem" }} />
                                    </Form.Item>
                                    <span className='lable-text' >Enable Layaway</span>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                    <div>
                        <div className='pref-headings-div'>
                            <span className='pref-headings'>
                                Print
                            </span>
                        </div>
                        <Card>
                            <Row >
                                <Col span={24} className='pref-card-div' >
                                    <Form.Item name="openingregister" valuePropName='checked' noStyle={true} ><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Opening Register</span>
                                </Col>
                                <Col span={24} className='pref-card-div' >
                                    <Form.Item name="closingRegister" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Closing Register</span>
                                </Col>


                            </Row>
                        </Card>
                    </div>
                    <div>
                        <div className='pref-headings-div'>
                            <span className='pref-headings'>
                                Sale Type
                            </span>
                        </div>
                        <Card>
                            <Row >
                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="cashCarry" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Cash & Carry</span>
                                </Col>
                                <Col span={14} className='pref-card-div' >
                                    <Form.Item name="homeDelivery" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Home Delivery</span>
                                </Col>
                                <Col span={10} className='pref-card-div' >
                                    <Form.Item name="storePickUp" valuePropName='checked' noStyle={true}><Checkbox style={{ marginRight: "1rem" }} /></Form.Item>
                                    <span className='lable-text'>Store PickUp</span>
                                </Col>


                            </Row>
                        </Card>
                    </div>
                    <div>
                        <div className='pref-headings-div'>
                            <span className='pref-headings'>
                                E-Bill
                            </span>
                        </div>
                        <Card>
                            <div className='pref-card-div'>
                                <Form.Item name="eBill" valuePropName='checked' noStyle={true}>
                                    <Checkbox checked={enableBillFlag} onChange={onchangeCheckBox('eBill')} style={{ marginRight: "1rem" }} />
                                </Form.Item>
                                <span className='lable-text'>Enable E-Bill</span>
                            </div>
                            {
                                enableBillFlag ?
                                    <Row style={{ display: "flex", paddingLeft: "2rem" }} justify="start">
                                        <Col xs={24} sm={12} md={10} className='pref-card-div'>
                                            <span className='lable-text'>E-Bill Web Hook URL</span>
                                            <Form.Item name="eBillWebHookURL" noStyle={true}>
                                                <Input className='inside-text' />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12} md={10} className='pref-card-div'>
                                            <span className='lable-text' style={{ marginRight: "0.5rem" }}>E-Bill Type</span>
                                            <Form.Item name="eBillCommType" noStyle={true}>
                                                <Select className='inside-text' defaultValue="WhatsApp">
                                                    <Option className="inside-text" value="WhatsApp">WhatsApp</Option>
                                                    <Option className="inside-text" value="SMS">SMS</Option>
                                                    <Option className="inside-text" value="Email">Email</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    : ""
                            }
                            {isFormChanged ?
                                <Form.Item noStyle={true}>
                                    <Button onClick={onClickCancel} style={{ borderRadius: "4px", float: "right", marginTop: "5rem", fontSize: "16px", fontWeight: 700, fontFamily: "Inter" }}>Cancel</Button>
                                    <Button type="primary" htmlType="submit" style={{ background: "#0C173A", color: "#FFFFFF", borderRadius: "4px", float: "right", marginTop: "5rem", fontSize: "16px", fontWeight: 700, fontFamily: "Inter", marginRight: "0.5rem" }}>Save</Button>
                                </Form.Item>

                                :
                                <Button onClick={() => history.push('/window/list/7585')} style={{ borderRadius: "4px", float: "right", marginTop: "5rem", fontSize: "16px", fontWeight: 700, fontFamily: "Inter" }}>Close</Button>

                            }
                        </Card>

                    </div>
                </Form>
            </Scrollbars>
        </Spin>
    )
}
export default Preferences;
