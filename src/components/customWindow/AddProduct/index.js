import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Input, Card, Select, Checkbox, Upload, Tag, message, Spin, Tabs, Table,Skeleton } from "antd";
import backIconMobile from "../../../assets/images/backMobileForm.png";
// import uploadImageIcon from "../../../assets/images/octicon_image-24.png";
import Plus from "../../../assets/images/plusIcon.png";
// import TimeLineIcon from '../../../assets/images/showMenuIcon.svg'
import VerticalDots from '../../../assets/images/VertiaclDots.png'
import DeleteIcon from '../../../assets/images/DeleteIcon.png'
import Icon, { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from "axios";
// import { useGlobalContext } from "../../../lib/storage";
import { getOAuthHeaders } from "../../../constants/oAuthValidation";
import { generateToken } from "../../../services/generateToken";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router-dom";
import './styles.css';
import Scrollbars from "react-custom-scrollbars";

const AddProduct = () => {
    const [form] = Form.useForm();
    const history = useHistory();
    const urlPath = window.location.pathname;
    const pathSegments = urlPath.split('/');
    const recordId = pathSegments[pathSegments.length - 1];
    // const { globalStore } = useGlobalContext();
    // const Themes = globalStore.userData.CW360_V2_UI;
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [addAttributeFlag, setAddAttributeFlag] = useState(false)
    const [rows, setRows] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [tagValue, setTagValue] = useState('');
    const [selectValue, setSelectValue] = useState(null);
    const [selectValueId, setSelectValueId] = useState(null);
    const [data, setData] = useState([]);
    const [showAttributeDetails, setShowAttributeDetails] = useState(false);
    const [showAddBOMProducts, SetShowAddBOMProducts] = useState(false);
    const [dropDownList, setDropDownList] = useState([{ RecordID: "Id", Name: "Name" }]);
    const [inputValues, setInputValues] = useState(['']);
    const [price, setPrice] = useState()
    const [taxCategory, settaxCategory] = useState()
    const [productInfoStatus, setProductInfoStatus] = useState()
    const [productInfoCategory, setProductInfoCategory] = useState()
    const [productInfoUom, setProductInfoUom] = useState()
    const [productInfoBrand, setProductInfoBrand] = useState()
    const [productName, setProductName] = useState(null)
    const [tabsSupplierId, setTabsSupplierId] = useState()
    const [tabsAlternativeUomID, setTabsAlternativeUomID] = useState()
    const [tabsAddonsID, setTabsAddonsID] = useState()
    const [cost, setCost] = useState()
    const [margin, setMargin] = useState()
    const [listPrice, setListPrice] = useState()
    const [qty, setQty] = useState()
    // const [showInventoryDetails, setShowInventoryDetails] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [servGeneartedImgUrl, setServGeneartedImgUrl] = useState(null);
    const [tags, setTags] = useState([]);
    const [supplierFormFields, setSupplierFormFields] = useState([]);
    const [selectedTabSData, setSelectedTabSData] = useState([]);
    const [selectedMenuItem, setSelectedMenuItem] = useState("Supplier information");
    const [selectedField, setSelectedField] = useState("Standard product");
    const [loading, setLoading] = useState(false);
    const [showAttributesCard, setShowAttributesCard] = useState(true);
    const [visibleFields, setVisibleFields] = useState([]);
    const [tabsTableData,setTabsTableData] =useState([])
    const [tableSkeletonLoading,setTableSkeletonLoading] =useState(false)
    const [initialValues, setInitialValues] = useState({});
    const genericUrl = process.env.REACT_APP_genericUrl;
    const serverUrl = process.env.REACT_APP_serverUrl;
    const { TabPane } = Tabs;
    const genericInstance = axios.create();
    genericInstance.defaults.baseURL = genericUrl;
    // genericInstance.defaults.withCredentials = true;
    genericInstance.defaults.method = "POST";
    genericInstance.defaults.headers.post["Content-Type"] = "application/json";
    let localToken;
    let appId;
    const { access_token } = getOAuthHeaders();

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


    const formStructure = [
        {
            title: '',
            span: 16,
            section: "SKU",
            fields: [
                {
                    label: 'SKU',
                    name: 'sku',
                    placeholder: '10001...',
                },
                {
                    label: 'Name',
                    name: 'name',
                    placeholder: '',
                },
                {
                    label: 'Description',
                    name: 'description',
                },
            ],
        },
        {
            title: 'Tax & Pricing',
            span: 16,
            section: "Tax & Pricing",
            fields: [
                {
                    label: 'Tax',
                    name: 'tax',
                    placeholder: 'Choose Tax',
                    type: "Select"
                },
                {
                    subFields: [
                        {
                            label: 'Price',
                            name: 'price',
                            placeholder: '0.00',
                            type: "Input",
                            value: price
                        },
                        {
                            label: 'List price',
                            name: 'ListPrice',
                            placeholder: '0.00',
                            type: "Input",
                            value: listPrice
                        },
                        {
                            label: 'Cost',
                            name: 'cost',
                            placeholder: '0.00',
                            type: "Input",
                            value: cost
                        },
                        {
                            label: 'Margin',
                            name: 'margin',
                            placeholder: '0%',
                            type: "Input",
                            value: margin
                        }
                    ]
                }
            ],


        },
        {
            section: "text",
            span: 16,
            fields: [
                {
                    title: 'Standard product',
                    span: 7,
                    content: "This product is a single SKU with its own inventory"
                },
                {
                    title: 'Variant product',
                    span: 7,
                    content: "This is a group of similar products with different attributes like size or color. Each variant is a unique SKU with its own inventory"
                },
                {
                    title: 'Composite product',
                    span: 7,
                    content: "This product is made up of specified quantities of one or more products. A composite is a single SKU but uses the inventory information of the products within it"
                },
            ],
        },
        {
            title: 'Attributes',
            section: "Attributes",
            fields: [
                {
                    content: "Add an attribute"
                }
            ],
        },
        {
            title: '',
            section: "menu",
            fields: [
                {
                    name: "Supplier information",
                    link: "Add another field",
                    multiple: "yes",
                    type: "Form",
                    data: [
                        {
                            label: 'Supplier',
                            name: 'supplierId',
                            placeholder: '',
                            type: "Select",
                        },
                        {
                            label: 'Supplier price',
                            name: 'purchasePrice',
                            placeholder: '',
                            type: "Input",
                        },
                    ]
                },
                {
                    name: "Inventory",
                    multiple: "no",
                    type: "Table",
                    data: [
                        {
                            title: "Store",
                            dataIndex: "store",
                            key: "store"
                        },
                        {
                            title: "Storage Bin",
                            dataIndex: "storageBin",
                            key: "storageBin"
                        },
                        {
                            title: "Qty",
                            dataIndex: "qty",
                            key: "qty"
                        }
                    ]
                },
                {
                    name: "Alternative UOM",
                    multiple: "yes",
                    type: "Form",
                    data: [
                        {
                            label: 'UOM',
                            name: 'csUomId',
                            placeholder: '',
                            type: "Select",
                        },
                        {
                            label: 'Conversion Rate',
                            name: 'conversionRate',
                            placeholder: '',
                            type: "Input",
                        },
                    ]

                },
                {
                    name: "Addons",
                    multiple: "yes",
                    type: "Form",
                    data: [
                        {
                            label: 'Addon Group',
                            name: 'mProductGroupId',
                            placeholder: '',
                            type: "Select",
                        },
                        {
                            label: 'Name',
                            name: 'name',
                            placeholder: '',
                            type: "Input",
                        },
                        {
                            label: 'Price',
                            name: 'price',
                            placeholder: '',
                            type: "Input",
                        },
                    ]
                },
                {
                    name: "Batch",
                    multiple: "no",
                    type: "Table",
                    data: [
                        {
                            title: "Batch No",
                            dataIndex: "batchNo",
                            key: "batchNo"
                        },
                        {
                            title: "Supplier",
                            dataIndex: "supplier",
                            key: "supplier"
                        },
                        {
                            title: "Start Date",
                            dataIndex: "startDate",
                            key: "startDate"
                        },
                        {
                            title: "End Date",
                            dataIndex: "endDate",
                            key: "endDate"
                        }
                    ]
                }
            ],
        },
        {
            title: 'Image',
            span: 7,
            section: "Image",
            fields: [
                {
                    label: 'SKU',
                    name: 'sku',
                    placeholder: '10001...',
                }
            ],
        },
        {
            title: 'Product info',
            span: 7,
            section: "Product info",
            fields: [
                {
                    label: 'Status',
                    name: 'status',
                    placeholder: 'Choose Status',
                    type: "Select",
                    value: "ACT"
                },
                {
                    label: 'Category',
                    name: 'category',
                    placeholder: 'Choose Category',
                    type: "Select",
                    value: ""
                },
                {
                    label: 'UOM',
                    name: 'uom',
                    placeholder: 'Choose UOM',
                    type: "Select",
                    value: ""
                },
                {
                    label: 'Brand',
                    name: 'brand',
                    placeholder: 'Choose Brand',
                    type: "Select",
                    value: ""
                },
                {
                    label: 'Tags',
                    name: 'tags',
                    placeholder: '',
                    type: "Tag",
                    value: ""
                },
            ],
        },
        {
            title: 'UPC and batch sequence',
            span: 7,
            section: "UPC and batch sequence",
            fields: [
                {
                    label: 'UPC',
                    name: 'UPC',
                    placeholder: '',
                    type: "Input",
                },
                {
                    label: 'Batch sequence',
                    name: 'batchSequence',
                    placeholder: '',
                    type: "Select",
                },

            ],
        },
        {
            title: 'Activity',
            span: 7,
            section: "Activity",
            fields: [
                {
                    children1: 'Product “Round neck tee shirt” was added by John Doe',
                    children2: "29 August, 2023 at 10:30 AM"
                },
                {
                    children1: 'Product “Round neck tee shirt” was added by John Doe',
                    children2: "29 August, 2023 at 10:30 AM"

                },
            ],
        },


    ];

    const UpdateAttributeField = (val, item) => {
        // setShowAttributeDetails(false)
        const fieldData = form.getFieldsValue
        const fieldsValue = {};
        if (val === "Edit") {
            if (showAddBOMProducts) {
                fieldsValue.product = item.name;
                fieldsValue.quantity = item.value
            } else {
                fieldsValue.attributeName = item.name;
                fieldsValue.value = item.value
            }
        }
        else {
            if (showAddBOMProducts) {
                fieldsValue.product = null;
                fieldsValue.quantity = ''
            } else {
                fieldsValue.attributeName = null;
                fieldsValue.value = ''
            }
        }

        form.setFieldsValue(fieldsValue);
        setInputValues([''])
        setAddAttributeFlag(true)

    }
    const calculateMargin = (price, cost) => {
        const marginValue = ((price - cost) / price) * 100;
        const formattedMargin = `${marginValue.toFixed(2).replace(/\.?0+$/, '')}%`;
        setMargin(formattedMargin);
        form.setFieldsValue({
            margin: formattedMargin,
        });
    };



    const handleInputChange = (e, index, key) => {
        let value = e.target.value
        if (key === 'name') {
            setProductName(value)
        }
       else if (key === "price") {
            setPrice(value)
            setListPrice(value)
            form.setFieldsValue({
                ListPrice: value
            })
            const price = parseFloat(e.target.value);
            const cost = parseFloat(form.getFieldValue('cost'));
            if (!isNaN(price) && !isNaN(cost)) {
                calculateMargin(price, cost);
            }
        }
        else if (key === "ListPrice") {
            setListPrice(value)
            setPrice(value)
            form.setFieldsValue({
                price: value
            })
        }
        else if (key === "cost") {
            setCost(value)
            const cost = parseFloat(e.target.value);
            const price = parseFloat(form.getFieldValue('price'));
            if (!isNaN(price) && !isNaN(cost)) {
                calculateMargin(price, cost);
            }
        }
        else if (key === "attributeValue") {
            const newInputValues = [...inputValues];
            if (value !== "") {
                newInputValues[index] = value;
            }
            else if (value === "") {
                newInputValues.splice(index, 1)
            }
            setInputValues(newInputValues);
            setInputValue(value);
        }
    };
    useEffect(() => {
        if (inputValues[inputValues.length - 1] !== '') {
            setInputValues([...inputValues, '']);
        }
    }, [inputValues]);
    useEffect(() => {
        setProductName(form.getFieldValue('name'))
      }, [form.getFieldValue('name')]);
    useEffect(() => {
        if (selectedField === "Variant product") {
            if (data.length === 0) {
                setShowAttributeDetails(false)
                setAddAttributeFlag(false)
                setRows([])
            }
            else {
                // for (let i = 0; i < data.length; i++) {
                //     let attributeName = data[i].value;
                //     let newValues = [];
                //     console.log(attributeName, rows)
                //     if (rows.length === 0 || rows[0] === "") {
                //         newValues = attributeName;
                //     } else {
                //         for (let j = 0; j < rows.length; j++) {
                //             for (let k = 0; k < attributeName.length; k++) {
                //                 newValues.push(rows[j] + '/' + attributeName[k]);
                //             }
                //         }
                //     }
                //     console.log("Variant product", newValues)
                //     setRows(newValues)
                // }
                let finalArr = [];

                function generateVariants(data, index, currentVariant) {
                    if (index === data.length) {
                        finalArr.push({
                            name: currentVariant.map(item => item.name).join("/"),
                            quantity: currentVariant.reduce((acc, item) => acc + item.quantity, 0)
                        });
                        return;
                    }

                    for (let i = 0; i < data[index].value.length; i++) {
                        const newVariant = [...currentVariant, {
                            name: data[index].value[i],
                            quantity: data[index].quantity
                        }];
                        generateVariants(data, index + 1, newVariant);
                    }
                }

                generateVariants(data, 0, []);
                setRows(finalArr);

            }

        }
        if (selectedField === "Standard product") {
            // const concatenatedValues = data.map(item => item.Value).join('/');
            // let arr = []
            // arr.push(concatenatedValues)
            // setRows(arr)
            if (data.length === 0) {
                setShowAttributeDetails(false)
                setAddAttributeFlag(false)
            }
        }
        else if (selectedField === "Composite product") {
            let arr = data.map((item) => ({ name: item.name, value: item.value }));
            setRows(arr);
            if (data.length === 0) {
                setShowAttributeDetails(false);
                setAddAttributeFlag(false);
            }
        }

    }, [data]);

    useEffect(() => {
        // Ensure both price and cost are valid numbers before calculating the margin
        if (!isNaN(parseFloat(price)) && !isNaN(parseFloat(cost))) {
            const calculatedMargin = ((parseFloat(price) - parseFloat(cost)) / parseFloat(price)) * 100;
            setMargin(calculatedMargin); // Set margin with 2 decimal places
        } else {
            setMargin(""); // Set margin to empty string if price or cost is not a valid number
        }
    }, [price, cost]);
    useEffect(() => {
        form.setFieldsValue({
            tags: JSON.stringify(tags),
        });
    }, [tags])

    useEffect(async () => {
        const Values = form.getFieldsValue();

        if (recordId !== "NEW_RECORD") {
            setLoading(true)
            try {
                const newToken = JSON.parse(localStorage.getItem("authTokens"));
                const getProductDetails = {
                    query: `mutation { executeAPIBuilder(apiBuilderId:"652f64627acdc753d7d58b34", params: "{\\"searchkey\\":\\"${recordId}\\",\\"businessUnit\\":\\"\\",\\"limit\\":\\"\\",\\"offset\\":\\"\\",\\"lastsyncdate\\":\\"\\"}")}`,
                };
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${access_token}`,
                };
                const serverResponse = await axios.post(genericUrl, getProductDetails, { headers: headers }, { async: true }, { crossDomain: true });
                if (serverResponse.status === 200) {
                    setLoading(false)
                    setIsReadOnly(true)
                    setShowAttributeDetails(true)
                    const productData = JSON.parse(serverResponse.data.data.executeAPIBuilder);
                    setProductName(productData[0].product_name)
                    setServGeneartedImgUrl(productData[0].imageurl)
                    setImageUrl(productData[0].imageurl)
                    setPrice(productData[0].sale_price)
                    setListPrice(productData[0].sale_price)
                    settaxCategory(productData[0].cs_taxcategory_id)
                    setProductInfoCategory(productData[0].m_product_category_id)
                    setProductInfoStatus(productData[0].status)
                    setProductInfoBrand(productData[0].m_brand)
                    setProductInfoUom(productData[0].cs_uom_id)

                    const Values = form.getFieldsValue();
                    const price = parseFloat(productData[0].sale_price);
                    const cost = parseFloat(productData[0].purchaseprice);
                    const marginValue = ((price - cost) / price) * 100;
                    const calculatedMargin = `${marginValue?.toFixed(2).replace(/\.?0+$/, '')}%`;

                    form.setFieldsValue({
                        ListPrice
                            :
                            productData[0].list_price,
                        "Supplier information"
                            :
                            productData[0].supplier?.map((item => ({
                                supplierId: item.suppliername,
                                purchasePrice: item.purchasePrice
                            }))),
                        "Addons"
                            :
                            productData[0].addons?.map((item => ({
                                mProductGroupId: item.groupname,
                                price: item.price,
                                name: item.name
                            }))),
                        "Alternative UOM"
                            :
                            productData[0].alternativeuom?.map((item => ({
                                csUomId: item.uomName,
                                conversionRate: item.conversionRate
                            }))),
                        imageurl
                            :
                            productData[0].imageurl,
                        UPC
                            :
                            productData[0].upc,
                        batchSequence
                            :
                            undefined,
                        brand
                            :
                            productData[0].brand,
                        category
                            :
                            productData[0].categoryname,
                        cost
                            :
                            productData[0].purchaseprice,
                        description
                            :
                            productData[0].description,
                        margin
                            :
                            calculatedMargin === "NaN%" ? "" : calculatedMargin,
                        name
                            :
                            productData[0].product_name,
                        price
                            :
                            productData[0].sale_price,
                        sku
                            :
                            productData[0].product_value,
                        status
                            :
                            productData[0].status,
                        supplier
                            :
                            productData.map((item) => item.suppliername),
                        purchasePrice
                            :
                            undefined,
                        tags
                            :
                            undefined,
                        tax
                            :
                            productData[0].taxcategoryname,
                        uom
                            :
                            productData[0].uomname
                    })
                    form.validateFields()
                    .then(val => {
                        setInitialValues(val)
                    });
                    if (productData && productData.length > 0 && productData[0].metadata && productData[0].metadata.length > 0) {
                        setTags(
                            productData[0].metadata[0].value
                                .slice(1, -1)
                                .split(',')
                                .map(item => item.trim().replace(/"/g, ''))
                        );
                    } else {
                        setTags([]);
                    }
                    if (productData[0].variants === null && productData[0].attributes === null && productData[0].bomproducts === null) {
                        setShowAttributesCard(false)
                    }
                    setSelectedField(() => {

                        if (productData[0].variants !== null && productData[0].attributes !== null) {
                            return "Variant product";
                        } else if (productData[0].attributes !== null) {
                            return "Standard product";
                        } else if (productData[0].bomproducts !== null) {
                            return "Composite product";
                        } else {
                            return "Standard product";
                        }
                    });
                    SetShowAddBOMProducts(() => {

                        if (productData[0].variants !== null && productData[0].attributes !== null) {
                            return false;
                        } else if (productData[0].attributes !== null) {
                            return false;
                        } else if (productData[0].bomproducts !== null) {
                            return true;
                        } else {
                            return "";
                        }
                    });

                    if (productData[0].variants !== null && productData[0].variants !== null) {
                        const outputArray = productData[0].variants.reduce((result, product) => {
                            const { attributes, ...rest } = product;

                            if (attributes && attributes.length > 0) {
                                attributes.forEach(attribute => {
                                    const { mAttributeId, name, attribute_value } = attribute;

                                    // Check if the mAttributeId already exists in the result
                                    const existingAttribute = result.find(entry => entry.mAttributeId === mAttributeId);

                                    // Check if the attribute_value is not already in the array
                                    const isValueUnique = existingAttribute ? !existingAttribute.value.includes(attribute_value) : true;

                                    if (existingAttribute && isValueUnique) {
                                        // If exists and value is unique, push the new attribute_value to the existing array
                                        existingAttribute.value.push(attribute_value);
                                    } else if (!existingAttribute) {
                                        // If not exists, create a new entry with mAttributeId, name, and an array of Values
                                        result.push({
                                            mAttributeId: mAttributeId,
                                            name: name,
                                            value: [attribute_value],
                                        });
                                    }
                                });
                            }

                            return result;
                        }, []);
                        setData(outputArray)
                    }
                    else if (productData[0].attributes !== null && productData[0].variants === null) {
                        const result = productData[0].attributes.reduce((acc, attribute) => {
                            const { mAttributeId, attribute_value, name, isvariant } = attribute;

                            acc.push({
                                mAttributeId: mAttributeId,
                                name: name,
                                value: attribute_value.replace(/^\[|\]$/g, '').split(',').map(item => item.trim())
                            });
                            return acc;
                        }, []);
                        setData(result);
                    }
                    else if (productData[0].bomproducts !== null) {
                        const result = productData[0].bomproducts.reduce((acc, attribute) => {
                            const { m_bomproduct_id, bomproductname, qty } = attribute;
                            acc.push({
                                mAttributeId: m_bomproduct_id,
                                name: bomproductname,
                                value: qty,
                            });
                            return acc;
                        }, []);
                        setData(result);
                    }

                }
            } catch (error) {
                const { message } = JSON.parse(JSON.stringify(error));
                if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
                    generateToken();
                } else {
                    return Promise.reject(error);
                }
            }
        }
        else {
            form.setFieldsValue({
                cost: 0,
            })
            const productInfoCardData = formStructure
                .filter((item) => item.section === "Product info")
                .map((item) => item.fields);
            productInfoCardData?.map((val) => {
                val.map((fields) => {
                    if (fields.name === "status") {
                        form.setFieldsValue({
                            status: "ACT",
                        })
                        setProductInfoStatus("ACT")
                    }
                    else if (fields.name === "uom") {
                        getDropDownList(fields.name)
                    }
                })
            })
        }

    }, [])
    const handleSelectChange = (value, option) => {
        // console.log("RecordID",option.key); // RecordID
        // console.log(option.children); // Name
        setSelectValue(option.children);
        setSelectValueId(value)
        setInputValues([''])
    };

    const onClickDone = () => {
        const existingDataIndex = data.findIndex(item => item.name === selectValue);
        const flattenedValues = inputValues.flat().filter(value => value !== "");
        if (flattenedValues.length >= 0) {
            if (existingDataIndex !== -1) {
                const updatedData = [...data];
                updatedData[existingDataIndex].value = [...updatedData[existingDataIndex].value, ...flattenedValues];
                setData(updatedData);
            } else {
                let newData = {
                    "mAttributeId": selectValueId,
                    "name": selectValue,
                    "value": selectedField === "Variant product" || selectedField === "Standard product" ? flattenedValues : inputValue,
                    "isVariant": selectedField === "Variant product" ? "Y" : "N"
                };
                setData(prevData => [...prevData, newData]);
            }
        }
        if (showAddBOMProducts) {
            setQty(inputValue)
        }
        setAddAttributeFlag(false)
        setShowAttributeDetails(true);
    };
    const onClickAddSupplier = () => {
        const newFormSections = [...supplierFormFields, { fields: [] }];
        setSupplierFormFields(newFormSections);
    }
    const deleteData = (item, index) => {
        const updatedData = data.filter(obj => obj.mAttributeId !== item.mAttributeId);
        setData(updatedData)

    }
    const getDropDownList = async (FieldName) => {
        setDropDownList([])
        let window_id
        let ad_field_id
        let ad_tab_id
        let jsonParam = ""
        if (FieldName === "tax") {
            window_id = "7517"
            ad_field_id = "C4AE5CADA4AA46B583BE475719287EAF"
            ad_tab_id = "82012A0364A5470DAF341CD42D8F195B";
        }

        if (FieldName === "category") {
            window_id = "7517"
            ad_field_id = "C836ADF14C7046CAB505735A9C75A9A2"
            ad_tab_id = "82012A0364A5470DAF341CD42D8F195B";
        }
        if (FieldName === "brand") {
            window_id = "7517"
            ad_field_id = "76AF0C195D02433E9269D45413A0700A"
            ad_tab_id = "82012A0364A5470DAF341CD42D8F195B";
        }
        if (FieldName === "uom" || FieldName === "csUomId") {
            window_id = "7517"
            ad_field_id = "311BAEAB192E4CED9C6375C24E5FCB4A"
            ad_tab_id = "82012A0364A5470DAF341CD42D8F195B";
        }
        if (FieldName === "supplierId") {
            window_id = "7007"
            ad_field_id = "9B8D684D9D6340BDB1C1665FDEF9D810"
            ad_tab_id = "EE797F0AD47E41A08CFBC7867F538661";
        }
        if (FieldName === "attributeName") {
            window_id = "7010"
            ad_field_id = "AD7EE34C8EFB4124950B772AFFC302F8";
            ad_tab_id = "5E4660E7AE7942F59051CF258ABA9BC1";
            jsonParam = "{\"CS_Bunit_ID\":\"0\",\"m_product_ID\":\"B14BAC6BABAE4CB586D489EAD993BD88\"}";
        }
        if (FieldName === "product") {
            window_id = "7010"
            ad_field_id = "113EB753B37447F8B52E91D78A0480BB";
            ad_tab_id = "01892132BAF14359B74CC34D52464E2D";
            jsonParam = "{\"CS_Bunit_ID\":\"0\",\"m_product_ID\":\"656741DBBA1C471F86CA2E6AE8E92E12\"}";
        }
        if (FieldName === "mProductGroupId") {
            window_id = "7010"
            ad_field_id = "1E034C89D58C4A4DBE76D1466D320EFF";
            ad_tab_id = "DFA3782212504CB7AC7A74594EDAB30E";
            jsonParam = "{\"CS_Bunit_ID\":\"0\",\"m_product_ID\":\"82626F843D01494F9A54B54271BF1A32\"}";
        }
        if (FieldName === "batchSequence") {
            window_id = "7369";
            ad_field_id = "AED9D639815149398AA2D4CD483105CB";
            ad_tab_id = "076E15660ED04F949CB6BFB7265FCFB5";
        }
        try {
            const taxCategory = await genericInstance({
                data: {
                    query: `query {searchField(windowId:"${window_id}",ad_tab_id:"${ad_tab_id}",ad_field_id:"${ad_field_id}",searchField:"",param:${JSON.stringify(jsonParam)},
        
                    )}`,
                },
            });
            const responseData = JSON.parse(taxCategory.data.data.searchField);
            if (FieldName === "uom") {
                form.setFieldsValue({
                    uom: responseData.searchData[0].RecordID
                })
                setProductInfoUom(responseData.searchData[0].RecordID)
            }
            const parsedOptions = responseData.searchData.map((item) => ({
                RecordID: item.RecordID,
                Name: item.Name
            }));
            setDropDownList(parsedOptions)
        }
        catch (error) {
            console.error(JSON.stringify(error, null, 2));
            return null;
        }
    };
    const handleSelect = (value, name) => {
        if (name === "status") {
            setProductInfoStatus(value)
        }
        if (name === "category") {
            setProductInfoCategory(value)
        }
        if (name === "uom") {
            setProductInfoUom(value)
        }
        if (name === "brand") {
            setProductInfoBrand(value)
        }

    }
    const onFinish = async () => {
        setLoading(true)
        const Values = form.getFieldsValue();
        let uniqueId = uuid()
            .replace(/-/g, "")
            .toUpperCase();

        let mProductId = uuid()
            .replace(/-/g, "")
            .toUpperCase();

        const commonDetails = {
            value: `${parseFloat(Values.sku) + 1}`,
            salePrice: parseFloat(Values.price),
            sequence: 1,
            listPrice: parseFloat(Values.ListPrice),
            purchasePrice: parseFloat(Values.cost),
        };
        let currentIndex1 = 0
        function generateProducts(data, currentIndex, currentAttributes, result) {
            if (currentIndex === data.length) {
                const currentAttribute = rows[currentIndex1];
                const newProduct = {
                    mProductId: generateUniqueId(),
                    name: formatAttributeName(currentIndex1),
                    ...commonDetails,
                    attributes: currentAttributes.slice()
                };
                result.push(newProduct);
                commonDetails.value = incrementValue(commonDetails.value);
                currentIndex1++;
                return;
            }

            const currentObject = data[currentIndex];
            const attributeName = currentObject.mAttributeId;
            const attrName = currentObject.name;
            const attributeValues = currentObject.value;
            for (let i = 0; i < attributeValues.length; i++) {
                currentAttributes.push({
                    mAttributeId: attributeName,
                    name: attrName,
                    value: attributeValues[i],
                    sequence: currentAttributes.length + 1
                });

                generateProducts(data, currentIndex + 1, currentAttributes, result);

                currentAttributes.pop();
            }
        }
        function incrementValue(value) {
            const intValue = parseInt(value);
            const incrementedValue = intValue + 1;
            return incrementedValue.toString();
        }
        function generateUniqueId() {
            let id = '';
            const characters = '0123456789ABCDEF';
            for (let i = 0; i < 32; i++) {
                id += characters[Math.floor(Math.random() * 16)];
            }
            return id;
        }
        function formatAttributeName(index) {
            const originalName = rows[index]?.name;
            const formattedName = originalName?.replace('/', '-');
            return formattedName;
        }
        const products = [];
        generateProducts(data, 0, [], products);
        const productStrings = [];
        const allAttributesStrings = [];
        const bomProductsStrings = [];

        const bomProducts = []
        const allAttributes = [];
        products.forEach((product) => {
            product.attributes.forEach((attribute) => {
                allAttributes.push(attribute);
            });
        });
        if (showAddBOMProducts) {
            products.forEach((product) => {
                product.attributes.forEach((attribute) => {
                    bomProducts.push({
                        mProductId: attribute.mAttributeId,
                        qty: attribute.value,
                        name: attribute.name
                    })
                });
            });
        }

        for (const key in products) {
            if (products.hasOwnProperty(key)) {
                const product = products[key];

                const variants = product.variants;
                delete product.variants;

                const productFields = Object.keys(product).map((field) => {
                    let value = product[field];
                    if (value !== undefined && value !== "undefined") {
                        if (typeof value === 'string') {
                            value = `"${value}"`;
                        } else if (typeof value === 'object') {
                            if (Array.isArray(value)) {
                                const attributesString = `[${value.map((attr) => {
                                    const sequence = parseFloat(attr.sequence);
                                    const salePrice = parseFloat(attr.salePrice);
                                    const purchasePrice = parseFloat(attr.purchasePrice);
                                    const listPrice = parseFloat(attr.listPrice);
                                    const attribute = Object.entries(attr).map(([attrKey, attrValue]) => {
                                        if (attrKey === 'sequence') {
                                            return `${attrKey}: ${sequence}`;
                                        }
                                        else if (attrKey === 'salePrice') {
                                            return `${attrKey}: ${salePrice}`;
                                        }
                                        else if (attrKey === 'purchasePrice') {
                                            return `${attrKey}: ${purchasePrice}`;
                                        }
                                        else if (attrKey === 'listPrice') {
                                            return `${attrKey}: ${listPrice}`;
                                        }
                                        else {
                                            return `${attrKey}: "${attrValue}"`;
                                        }
                                    }).join(', ');
                                    return `{${attribute}}`;
                                }).join(', ')}]`;
                                value = attributesString;
                            } else {
                                value = JSON.stringify(value);
                            }
                        }
                        return `${field}: ${value}`;
                    }
                    return null;
                }).filter((field) => field !== null);

                const variantsString = variants
                    ? `{ ${Object.keys(variants).map((field) => {
                        const value = JSON.stringify(variants[field]);
                        return `${field}: ${value}`;
                    }).join(',')} }`
                    : '';

                if (variantsString) {
                    productFields.push(`variants: ${variantsString}`);
                }
                productStrings.push(`{ ${productFields.join(',')} }`);
            }
        }
        for (const key in allAttributes) {
            if (allAttributes.hasOwnProperty(key)) {
                const product = allAttributes[key];

                const variants = product.variants;
                delete product.variants;

                const productFields = Object.keys(product).map((field) => {
                    let value = product[field];
                    if (value !== undefined && value !== "undefined") {
                        if (typeof value === 'string') {
                            value = `"${value}"`;
                        } else if (typeof value === 'object') {
                            if (Array.isArray(value)) {
                                const attributesString = `[${value.map((attr) => {
                                    const sequence = parseFloat(attr.sequence);
                                    const salePrice = parseFloat(attr.salePrice);
                                    const purchasePrice = parseFloat(attr.purchasePrice);
                                    const listPrice = parseFloat(attr.listPrice);
                                    const attribute = Object.entries(attr).map(([attrKey, attrValue]) => {
                                        if (attrKey === 'sequence') {
                                            return `${attrKey}: ${sequence}`;
                                        }
                                        else if (attrKey === 'salePrice') {
                                            return `${attrKey}: ${salePrice}`;
                                        }
                                        else if (attrKey === 'purchasePrice') {
                                            return `${attrKey}: ${purchasePrice}`;
                                        }
                                        else if (attrKey === 'listPrice') {
                                            return `${attrKey}: ${listPrice}`;
                                        }
                                        else {
                                            return `${attrKey}: "${attrValue}"`;
                                        }
                                    }).join(', ');
                                    return `{${attribute}}`;
                                }).join(', ')}]`;
                                value = attributesString;
                            } else {
                                value = JSON.stringify(value);
                            }
                        }
                        return `${field}: ${value}`;
                    }
                    return null;
                }).filter((field) => field !== null);

                const variantsString = variants
                    ? `{ ${Object.keys(variants).map((field) => {
                        const value = JSON.stringify(variants[field]);
                        return `${field}: ${value}`;
                    }).join(',')} }`
                    : '';

                if (variantsString) {
                    productFields.push(`variants: ${variantsString}`);
                }
                allAttributesStrings.push(`{ ${productFields.join(',')} }`);
            }
        }
        for (const key in bomProducts) {
            if (bomProducts.hasOwnProperty(key)) {
                const product = bomProducts[key];

                const variants = product.variants;
                delete product.variants;

                const productFields = Object.keys(product).map((field) => {
                    let value = product[field];
                    if (value !== undefined && value !== "undefined") {
                        if (typeof value === 'string') {
                            value = `"${value}"`;
                        } else if (typeof value === 'object') {
                            if (Array.isArray(value)) {
                                const attributesString = `[${value.map((attr) => {
                                    const sequence = parseFloat(attr.sequence);
                                    const qty = parseFloat(attr.qty);
                                    const salePrice = parseFloat(attr.salePrice);
                                    const purchasePrice = parseFloat(attr.purchasePrice);
                                    const listPrice = parseFloat(attr.listPrice);
                                    const attribute = Object.entries(attr).map(([attrKey, attrValue]) => {
                                        if (attrKey === 'sequence') {
                                            return `${attrKey}: ${sequence}`;
                                        }
                                        else if (attrKey === 'salePrice') {
                                            return `${attrKey}: ${salePrice}`;
                                        }
                                        else if (attrKey === 'purchasePrice') {
                                            return `${attrKey}: ${purchasePrice}`;
                                        }
                                        else if (attrKey === 'listPrice') {
                                            return `${attrKey}: ${listPrice}`;
                                        }
                                        else if (attrKey === 'qty') {
                                            return `${attrKey}: ${qty}`;
                                        }
                                        else {
                                            return `${attrKey}: "${attrValue}"`;
                                        }
                                    }).join(', ');
                                    return `{${attribute}}`;
                                }).join(', ')}]`;
                                value = attributesString;
                            } else {
                                value = JSON.stringify(value);
                            }
                        }
                        return `${field}: ${value}`;
                    }
                    return null;
                }).filter((field) => field !== null);

                const variantsString = variants
                    ? `{ ${Object.keys(variants).map((field) => {
                        const value = JSON.stringify(variants[field]);
                        return `${field}: ${value}`;
                    }).join(',')} }`
                    : '';

                if (variantsString) {
                    productFields.push(`variants: ${variantsString}`);
                }
                bomProductsStrings.push(`{ ${productFields.join(',')} }`);
            }
        }
        let modifiedAttributesArray
        if (selectedField !== "Composite product") {
            modifiedAttributesArray = data.map(item => {
                return {
                    ...item,
                    value: `[${item.value.join(',')}]`
                };
            });
        }
        let supplierData;
        let alternativeUOM;
        let addons;
        selectedTabSData.forEach((item) => {
            if (item.fieldName === "Supplier information") {
                supplierData = item.data;
            }
            if (item.fieldName === "Alternative UOM") {
                alternativeUOM = item.data;
            }
            if (item.fieldName === "Addons") {
                addons = item.data;
            }
        });

        const upsertProduct = {
            query: `
                        mutation {    upsertproduct(product : [{    
                            mProductId : "${recordId === "NEW_RECORD" ? uniqueId : recordId}"        
                            name: ${Values.name ? `"${Values.name}"` : null} 
                            value: ${Values.sku ? `"${Values.sku}"` : null}       
                            csUomId: ${productInfoUom ? `"${productInfoUom}"` : null}       
                            csTaxcategoryId:${taxCategory ? `"${taxCategory}"` : null}       
                            imageurl: ${servGeneartedImgUrl ? `"${servGeneartedImgUrl}"` : null}        
                            description: ${Values.description ? `"${Values.description}"` : null}      
                            salePrice: ${Values.price ? `"${Values.price}"` : null}     
                            purchasePrice:${Values.cost ? `"${Values.cost}"` : null}     
                            listPrice: ${Values.ListPrice ? `"${Values.ListPrice}"` : null}    
                            isBOMRequired:"${showAddBOMProducts ? "Y" : "N"}"        
                            mProductCategoryId:${productInfoCategory ? `"${productInfoCategory}"` : null}        
                            upc: ${Values.UPC ? `"${Values.UPC}"` : null}
                            brandId: ${productInfoBrand ? `"${productInfoBrand}"` : null}         
                            type: "I"
                            status:${productInfoStatus ? `"${productInfoStatus}"` : null}       
                            variants :[${selectedField === "Variant product" ? [productStrings] : []}]
                            suppliers: ${JSON.stringify(Values['Supplier information'] || [],
                (key, value) => (typeof value === 'string' && !isNaN(value) ? Number(value) : value)
            ).replace(/"([^"]+)":/g, '$1:')}
                            billOfMaterial:[${selectedField === "Composite product" ? [bomProductsStrings] : []}]         
                            mBatch :[]        
                            productAddons: ${JSON.stringify(
                Values['Addons'] || [],
                (key, value) => (typeof value === 'string' && !isNaN(value) ? Number(value) : value)
            ).replace(/"([^"]+)":/g, '$1:')}
                            attributes :${selectedField !== "Composite product" ? JSON.stringify(modifiedAttributesArray).replace(/"([^"]+)":/g, '$1:') : '[]'}     
                            metaData: ${Values.tags !== "[]" ?
                    JSON.stringify(
                        [
                            { key: "tags", value: (Values.tags) }
                        ]
                    ).replace(/"([^"]+)":/g, '$1:')
                    : '[]'
                }
                            alternativeUOM:  ${JSON.stringify(Values['Alternative UOM'] || [],
                    (key, value) => (typeof value === 'string' && !isNaN(value) ? Number(value) : value)
                ).replace(/"([^"]+)":/g, '$1:')}       
                            }]) {  status message recordId   } }
                        `,
        };
        axios({
            url: serverUrl,
            method: "POST",
            data: upsertProduct,
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${access_token}`,
            },
        }).then((response) => {
            if (response.data.data.upsertproduct.status === "200") {
                setLoading(false)
                message.success(`${response.data.data.upsertproduct.message}`);
                setIsReadOnly(true)
                if (recordId === 'NEW_RECORD') {
                    history.push(`/others/window/7567/${response.data.data.upsertproduct.recordId}`);
                    setProductName(Values.name)
                }
            }
            if (response.data.data.upsertproduct.status === "201") {
                setLoading(false)
                message.error("Getting 201")
            }
        }).catch((error) => {
            console.log(error);
            setLoading(false)
            message.error("Something went wrong");
        });

    }
    const handleCancel = () =>{
        if(recordId === "NEW_RECORD"){
           history.push(`/window/list/7010`)
        }
        else {
           form.resetFields()
           setIsReadOnly(true)
         }

   }
    const onClickProductType = (productType) => {
        if (productType === "Composite product") {
            SetShowAddBOMProducts(true)
        }

        else {
            SetShowAddBOMProducts(false)
        }
    }
    const onClickEdit = () => {
        setIsReadOnly(false)
    }
    const onClickClose = () => {
        history.push(`/window/list/7010`);

    }
    const onClickUpload = async (info) => {
        const { file } = info;
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageUrl(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
        const formData = new FormData();
        formData.set("image", file, file.filename);
        try {
            const response = await axios({
                method: "POST",
                url: "https://sapp.mycw.in/image-manager/uploadImage",
                data: formData,
                headers: {
                    Accept: "*/*",
                    "Content-Type": "multipart/form-data",
                    APIKey: "AUa4koVlpsgR7PZwPVhRdTfUvYsWcjkg",
                },
            });
            if (!response) {
                return null;
            } else {
                setServGeneartedImgUrl(response.data)
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleEnterPress = (e) => {
        if (e.key === "Enter" && tagValue.trim() !== "") {
            setTags([...tags, tagValue.trim()]);
            setTagValue("");
        }
    };
    const handleTagClose = (tagToRemove) => {
        const updatedTags = tags.filter((tag) => tag !== tagToRemove);
        setTags(updatedTags);
    };
    const handleTagsInputChange = (e) => {
        setTagValue(e.target.value)
    }
    const handleChange = (val, name) => {
        if (name === "supplierId") {
            setTabsSupplierId(val)
        }
        if (name === "csUomId") {
            setTabsAlternativeUomID(val)
        }
        if (name === "groupname") {
            setTabsAddonsID(val)
        }

        const values = form.getFieldsValue();
        const selectedMenuItemData = values[selectedMenuItem];

        // Find index of existing data for selectedMenuItem
        const existingDataIndex = selectedTabSData.findIndex(item => item.fieldName === selectedMenuItem);

        // If data for selectedMenuItem exists, update it; otherwise, add new data
        if (existingDataIndex !== -1) {
            setSelectedTabSData(prevData => {
                const newData = [...prevData];
                newData[existingDataIndex] = { fieldName: selectedMenuItem, data: selectedMenuItemData };
                return newData;
            });
        } else {
            setSelectedTabSData(prevData => [...prevData, { fieldName: selectedMenuItem, data: selectedMenuItemData }]);
        }

    };
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
    const handleDeleteColumn = (fieldName) => {
        setVisibleFields((prevVisibleFields) => prevVisibleFields.filter((field) => field !== fieldName));
    };
    const handleTabClick = async(tab) =>{
        if(tab ==="1"){
            setTableSkeletonLoading(true)
            try {
                const inventoryData = await genericInstance({
                    data: {
                        query: `{ 
                            getTabData(
                              tabData: {
                                windowId:"7010",
                                ad_tab_id: "CABE6665C61148A3995F451E1DD7A071",
                                parentTabId: "DBF367EF26CF4EBF97DA3C20F73AC09D",
                                
                                parentRecordID: "${recordId}",
                                
                                startRow: "0",
                                endRow: "50",
                                
                                
                              }
                            ) { startRow endRow tableName totalRows records messageCode message __typename } }`,
                    }

                });
                const resData = inventoryData.data.data.getTabData
                if(resData.messageCode === "200"){
                    setTableSkeletonLoading(false)
                    const recordsData = resData.records
                    const responseData =JSON.parse(recordsData)
                    setTabsTableData(()=> {
                        return responseData.data.map((item) => ({
                          store: item["2EEF913A1EB24C59A07029551F35ED74_iden"],
                          storageBin: item["B9858B9CD7C74685900F09F7B948B5D9_iden"],
                          qty: item["38B0EBE6A1C4435986B15F59C3360035"],
                        }));
                      })
                }
                // const parsedOptions = responseData.searchData.map((item) => item.Name);
            }
            catch (error) {
                console.error(JSON.stringify(error, null, 2));
                return null;
            }
        }
        // else if(tab ==="4"){
        //     try {
        //         const batchData = await genericInstance({
        //             data: {
        //                 query: `{ 
        //                     getTabData(
        //                       tabData: {
        //                         windowId:"7010",
        //                         ad_tab_id: "4017DE5ECE634DB082DEA007A6594FCE",
        //                         parentTabId: "DBF367EF26CF4EBF97DA3C20F73AC09D",
                                
        //                         parentRecordID: "${recordId}",
                                
        //                         startRow: "0",
        //                         endRow: "50",
                                
                                
        //                       }
        //                     ) { startRow endRow tableName totalRows records messageCode message __typename } }`,
        //             }

        //         });
        //         // console.log(JSON.parse(batchData));
        //         // const parsedOptions = responseData.searchData.map((item) => item.Name);
        //     }
        //     catch (error) {
        //         console.error(JSON.stringify(error, null, 2));
        //         return null;
        //     }
        // }
        else{
            setTabsTableData([])
        }

    }
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
                <Row justify="space-between" style={{ padding: "0 6vw" }}>
                    <Col style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img onClick={() => { history.push(`/window/list/7010`); }} style={{ fontSize: "18px", fontWeight: 600, cursor: "pointer" }} src={backIconMobile} alt="" />
                        <span style={{ marginLeft: "0.5em", fontSize: "18px", fontWeight: 600 }}>{productName ? productName : "Add Product"}</span>
                    </Col>
                    {
                        isReadOnly ? (
                            <Col style={{ display: "flex" }}>
                                <Button onClick={onClickClose} style={{fontFamily:"Roboto",fontWeight:"700",width:"70px",border: '0.1px solid rgba(217, 217, 229,1)',color:"#0C173A",marginLeft:"4px",marginRight:"4px"}}>
                                    Close
                                </Button>
                                <Button onClick={onClickEdit} style={{fontFamily:"Roboto",fontWeight:"700",width:"70px",border: '0.1px solid rgba(217, 217, 229,1)',color:"#0C173A",marginLeft:"4px",marginRight:"4px"}}>
                                    Edit
                                </Button>

                            </Col>
                        ) : (
                            <Col style={{ display: "flex" }}>
                                <Button onClick={() => { handleCancel() }} style={{fontFamily:"Roboto",fontWeight:"700",width:"70px",border:'0.1px solid rgba(217, 217, 229,1)',color:"#0C173A",marginLeft:"4px",marginRight:"4px"}}>
                                    Cancel
                                </Button>
                                <Button onClick={() => { onFinish() }} style={{fontFamily:"Roboto",fontWeight:"700",width:"70px",border:'0.1px solid rgba(217, 217, 229,1)',color:"#0C173A",marginLeft:"4px",marginRight:"4px"}}>
                                    Save
                                </Button>
                            </Col>
                        )
                    }
                </Row>
                <Form form={form} initialValues={initialValues} layout="vertical" style={{ width: "100%" }} >


                    <Row gutter={[16, 16]} justify="space-between" style={{ padding: "0 6vw" }}>
                        <Col span={16} >
                            {formStructure.map((section) => {
                                if (section.section === 'SKU') {
                                    return (
                                        <Card
                                            span={section.span}
                                            key={section.title}
                                            style={{
                                                borderRadius: "6px",
                                                background: "#FFFFFF",
                                                width: "100%",
                                                height: "fit-content",
                                                padding: "1em 1.3em",
                                                marginTop: "1em",
                                            }}
                                        >
                                            <span style={{ color: "#192228", fontSize: "12px", fontWeight: 600 }}>{section.title}</span>
                                            {section.fields.map((field) =>
                                                field.subFields ? (
                                                    <Row gutter={[16, 0]} justify="space-between">
                                                        {field.subFields.map((subFieldsdata) => (
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    key={subFieldsdata.name}
                                                                    label={
                                                                        <span
                                                                        style={{
                                                                            fontFamily:"Inter",
                                                                            fontSize: "12px",
                                                                            fontWeight: 400,
                                                                            opacity: "60%",
                                                                        }}
                                                                            rules={[
                                                                                {
                                                                                    required: subFieldsdata.name === "sku" || field.name === "name" ? true : false,
                                                                                    message: 'Please enter your field!',
                                                                                },
                                                                            ]}
                                                                        >
                                                                            {subFieldsdata.label}
                                                                        </span>
                                                                    }
                                                                    name={subFieldsdata.name}
                                                                    style={{ margin: "0.5em 0" }}
                                                                >
                                                                    {inputValues.map((value, index) => (
                                                                        <div key={index} style={{ marginBottom: '10px' }}>
                                                                            <input
                                                                                disabled={isReadOnly}
                                                                                style={{ borderColor: "#D3D3D3", borderRadius: "8px", height: "34px" }}
                                                                                placeholder={`Input ${index + 1}`}
                                                                                value={value}
                                                                                onChange={(e) => handleInputChange(e, index)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </Form.Item>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                ) :
                                                    (
                                                        <Form.Item
                                                            key={field.name}
                                                            label={
                                                                <span
                                                                    style={{
                                                                        fontFamily:"Inter",
                                                                        fontSize: "12px",
                                                                        fontWeight: 400,
                                                                        opacity: "60%",
                                                                    }}
                                                                >
                                                                    {field.label}
                                                                </span>
                                                            }
                                                            name={field.name}
                                                            style={{ margin: "0.5em 0" }}
                                                            rules={[
                                                                {
                                                                    required: field.name === "sku" || field.name === "name" ? true : false,
                                                                    message: 'Please enter your field!',
                                                                },
                                                            ]}
                                                        >
                                                            <Input
                                                                disabled={recordId !== "NEW_RECORD" && field.name === "sku" ? true : isReadOnly}
                                                                style={{ borderColor: "#D3D3D3", borderRadius: "8px", height: "34px", color: "#0C173A", fontSize: "13px", fontWeight: 400 }}
                                                                placeholder={field.placeholder}
                                                            onChange={(e, index) => handleInputChange(e, index, field.name)}
                                                            />
                                                        </Form.Item>
                                                    )
                                            )}
                                        </Card>
                                    );
                                }
                                else if (section.section === 'Tax & Pricing') {
                                    return (
                                        <Card
                                            span={section.span}
                                            key={section.title}
                                            style={{
                                                borderRadius: "6px",
                                                background: "#FFFFFF",
                                                width: "100%",
                                                padding: "1em 1.3em",
                                                height: "fit-content",
                                                marginTop: "1em",
                                            }}
                                        >
                                            <span style={{ color: "#192228", fontSize: "12px", fontWeight: 600 }}>{section.title}</span>
                                            {section.fields.map((field) =>
                                                field.subFields ? (
                                                    <Row gutter={[16, 0]} justify="space-between">
                                                        {field.subFields.map((subFieldsdata) => (
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    key={subFieldsdata.name}
                                                                    label={
                                                                        <span
                                                                        style={{
                                                                            fontFamily:"Inter",
                                                                            fontSize: "12px",
                                                                            fontWeight: 400,
                                                                            opacity: "60%",
                                                                        }}
                                                                        >
                                                                            {subFieldsdata.label}
                                                                        </span>
                                                                    }
                                                                    name={subFieldsdata.name}
                                                                    style={{ margin: "0.5em 0" }}
                                                                    rules={[
                                                                        {
                                                                            required: subFieldsdata.name === "tax" ? true : false,
                                                                            message: 'Please enter your field!',
                                                                        },
                                                                    ]}
                                                                >
                                                                    {subFieldsdata.type === 'Select' ? (
                                                                        <Select
                                                                            showSearch
                                                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                                            allowClear
                                                                            disabled={isReadOnly}
                                                                            style={{ width: "100%", borderRadius: "8px", color: "#0C173A", fontWeight: 400, fontSize: "13px" }}
                                                                            placeholder={subFieldsdata.placeholder}
                                                                        // Add options prop if needed: options={subFieldsdata.options}
                                                                        // onChange={(value) => handleSelectChange(subFieldsdata.name, value)}
                                                                        >
                                                                            {/* Render Select options here */}
                                                                        </Select>
                                                                    ) : (
                                                                        <Input
                                                                            disabled={isReadOnly}
                                                                            style={{ borderColor: "#D3D3D3", borderRadius: "8px", height: "34px", color: "#0C173A", fontSize: "13px", fontWeight: 400 }}
                                                                            placeholder={subFieldsdata.placeholder}
                                                                            onChange={(e, index) => handleInputChange(e, index, subFieldsdata.name)}
                                                                            value={subFieldsdata.value} />
                                                                    )}

                                                                </Form.Item>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                ) :
                                                    (
                                                        <Form.Item
                                                            key={field.name}
                                                            label={
                                                                <span
                                                                style={{
                                                                    fontFamily:"Inter",
                                                                    fontSize: "12px",
                                                                    fontWeight: 400,
                                                                    opacity: "60%",
                                                                }}
                                                                >
                                                                    {field.label}
                                                                </span>
                                                            }
                                                            name={field.name}
                                                            style={{ margin: "0.5em 0", }}
                                                            rules={[
                                                                {
                                                                    required: field.name === "tax" ? true : false,
                                                                    message: 'Please enter your field!',
                                                                },
                                                            ]}
                                                        >
                                                            {field.type === 'Select' ? (
                                                                <Select
                                                                    showSearch
                                                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                                    allowClear
                                                                    disabled={isReadOnly} style={{ width: "100%", color: "#0C173A", fontWeight: 400, fontSize: "13px" }}
                                                                    placeholder={field.placeholder}
                                                                    onFocus={() => { getDropDownList(field.name) }}
                                                                    onChange={(val) => { settaxCategory(val) }}
                                                                    value={taxCategory}
                                                                // Add options prop if needed: options={subFieldsdata.options}
                                                                // onChange={(value) => handleSelectChange(subFieldsdata.name, value)}
                                                                >
                                                                    {dropDownList.map((option) => (
                                                                        <Select.Option key={option.RecordID} value={option.RecordID}>
                                                                            {option.Name}
                                                                        </Select.Option>
                                                                    ))}                                                            </Select>
                                                            ) : (
                                                                <Input
                                                                    disabled={isReadOnly}
                                                                    style={{ borderColor: "#D3D3D3", borderRadius: "8px", height: "34px", color: "#0C173A", fontSize: "13px", fontWeight: 400 }}
                                                                    placeholder={field.placeholder}
                                                                // onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                                />
                                                            )}

                                                        </Form.Item>
                                                    )
                                            )}
                                        </Card>
                                    );
                                }
                                else if (section.section === 'text') {
                                    return (
                                        <Row justify="space-between" gutter={[8, 0]} style={{ margin: "1em 0" }}>
                                            {section.fields.map((field) => (
                                                <Col
                                                    span={8}
                                                    style={{
                                                        cursor: isReadOnly ? "" : "pointer",
                                                        border: selectedField === field.title ? "2px solid blue" : "none",
                                                        borderRadius: "8px"

                                                    }}
                                                    onClick={() => {
                                                        if (!isReadOnly) {
                                                            onClickProductType(field.title);
                                                            setSelectedField(field.title);
                                                            setAddAttributeFlag(false)
                                                            setShowAttributeDetails(false)
                                                            setData([])
                                                        }
                                                    }}
                                                    key={field.title}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "center",
                                                            borderRadius: "6px",
                                                            background: "#FFFFFF",
                                                            width: "100%",
                                                            padding: "1.5em",
                                                            height: "100%",
                                                        }}
                                                    >
                                                        <span style={{ color: "#192228", fontSize: "12px", fontWeight: 600 }}>{field.title}</span>
                                                        <hr style={{ border: "none", borderBottom: "1px solid #D9DCE0", width: "100%" }} />
                                                        <span style={{ color: "#0C173A", fontSize: "12px", fontWeight: 500, opacity: "70%", textAlign: "center" }}>
                                                            {field.content}
                                                        </span>
                                                    </div>
                                                </Col>
                                            ))}

                                        </Row>

                                    );
                                }
                                else if (section.section === 'Attributes' && showAttributesCard === true) {
                                    return (
                                        <Card
                                            span={section.span}
                                            key={showAddBOMProducts ? "BOM Products" : section.title}
                                            style={{
                                                borderRadius: "6px",
                                                background: "#FFFFFF",
                                                width: "100%",
                                                padding: "1em 1.2em",
                                                height: "fit-content",
                                            }}
                                        >
                                            <span style={{ color: "#192228", fontSize: "12px", fontWeight: 600 }}>{showAddBOMProducts ? "BOM Products" : section.title}</span>
                                            {section.fields.map((field) => (
                                                showAttributeDetails ? (
                                                    <>
                                                        {data.map((item, index) => (
                                                            <Row justify="space-between" style={{ padding: "1em 0", display: "flex", alignItems: "center" }}>
                                                                <Col key={index} style={{ display: "flex", alignItems: "center" }}>
                                                                    <img src={VerticalDots} alt="VerticalDotsIcon" height={24} />
                                                                    <div style={{ display: "flex", marginLeft: "1em", flexDirection: "column" }}>
                                                                        <span>{item.name}</span>
                                                                        <span style={{ display: "flex" }}>
                                                                            {Array.isArray(item.value) ? (
                                                                                item.value.map((sss, index) => (
                                                                                    <span key={index} style={{ background: "#D3D3D3", color: "#192228", borderRadius: "35px", textAlign: "center", padding: "0 1em", marginRight: "0.5em" }}>{sss}</span>
                                                                                ))
                                                                            ) : (
                                                                                <span style={{ background: "#D3D3D3", color: "#192228", borderRadius: "35px", textAlign: "center", padding: "0 1em", marginRight: "0.5em" }}>{item.value}</span>
                                                                            )}
                                                                        </span>

                                                                    </div>

                                                                </Col>
                                                                <Col >
                                                                </Col>
                                                                <Col >
                                                                    {!isReadOnly && (
                                                                        <img onClick={() => { deleteData(item, index) }} src={DeleteIcon} alt="VerticalDotsIcon" style={{ cursor: "pointer" }} />

                                                                    )}
                                                                </Col>
                                                            </Row>

                                                        ))}
                                                        {addAttributeFlag ? (
                                                            <Row gutter={[16, 0]} justify="space-between">
                                                                <Col span={24}>
                                                                    <Form.Item
                                                                        key={showAddBOMProducts ? "Product" : "name"}
                                                                        label={
                                                                            <span
                                                                            style={{
                                                                                fontFamily:"Inter",
                                                                                fontSize: "12px",
                                                                                fontWeight: 400,
                                                                                opacity: "60%",
                                                                            }}
                                                                            >{showAddBOMProducts ? "Product" : "Name"}
                                                                            </span>
                                                                        }
                                                                        name={showAddBOMProducts ? "product" : "attributeName"}
                                                                        // Attribute Name
                                                                        style={{ margin: "0.5em 0" }}
                                                                    >
                                                                        <Select
                                                                            showSearch
                                                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                                            allowClear
                                                                            disabled={isReadOnly}
                                                                            style={{ borderColor: "#D3D3D3", borderRadius: "8px", height: "34px", color: "#0C173A", fontWeight: 400, fontSize: "13px" }}
                                                                            placeholder={showAddBOMProducts ? "Select Product" : "Select Attribute"}
                                                                            // defaultValue="Color"
                                                                            dropdownClassName="your-custom-dropdown-class"
                                                                            value={selectValue}
                                                                            onChange={handleSelectChange}
                                                                            onFocus={() => { showAddBOMProducts ? getDropDownList("product") : getDropDownList("attributeName") }}
                                                                        >
                                                                            {dropDownList.map((option) => (
                                                                                <Select.Option label={option.RecordID} value={option.RecordID} disabled={data.some(item => item.mAttributeId === option.RecordID)}>
                                                                                    {option.Name}
                                                                                </Select.Option>
                                                                            ))}
                                                                            {/* <Select.Option value="Color">Color</Select.Option>
                                                                    <Select.Option value="Size">Size</Select.Option>
                                                                    <Select.Option value="Material">Material</Select.Option> */}
                                                                        </Select>
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col span={24}>
                                                                    {showAddBOMProducts ? (
                                                                        <Form.Item
                                                                            key={showAddBOMProducts ? "Quantity" : "value"}
                                                                            label={
                                                                                <span
                                                                                style={{
                                                                                    fontFamily:"Inter",
                                                                                    fontSize: "12px",
                                                                                    fontWeight: 400,
                                                                                    opacity: "60%",
                                                                                }}
                                                                                >
                                                                                    {showAddBOMProducts ? "Quantity" : "Value"}
                                                                                </span>
                                                                            }
                                                                            name={showAddBOMProducts ? "quantity" : "value"}
                                                                            style={{ margin: "0.5em 0" }}
                                                                        >
                                                                            <Input
                                                                                disabled={isReadOnly}
                                                                                value={inputValue}
                                                                                onChange={(e) => {
                                                                                    handleInputChange(e);
                                                                                }}
                                                                                style={{ borderColor: "#D3D3D3", borderRadius: "8px", height: "34px", color: "#0C173A", fontSize: "13px", fontWeight: 400 }}
                                                                                placeholder={showAddBOMProducts ? "Quantity" : "Value"}
                                                                            />
                                                                        </Form.Item>
                                                                    ) : (
                                                                        <Form.Item
                                                                            key={showAddBOMProducts ? "Quantity" : "AttributeValue"}
                                                                            label={
                                                                                <span
                                                                                style={{
                                                                                    fontFamily:"Inter",
                                                                                    fontSize: "12px",
                                                                                    fontWeight: 400,
                                                                                    opacity: "60%",
                                                                                }}
                                                                                >
                                                                                    {showAddBOMProducts ? "Qty" : "Value"}
                                                                                </span>
                                                                            }
                                                                            name={showAddBOMProducts ? "quantity" : "attributeValue"}
                                                                            style={{ margin: "0.5em 0" }}
                                                                        >
                                                                            {inputValues.map((value, index) => (
                                                                                <div key={index} style={{ marginBottom: "10px" }}>
                                                                                    <Input
                                                                                        disabled={isReadOnly}
                                                                                        value={value}
                                                                                        onChange={(e) => {
                                                                                            handleInputChange(e, index,"attributeValue");
                                                                                        }}
                                                                                        style={{ borderColor: "#D3D3D3", borderRadius: "8px", height: "34px", color: "#0C173A", fontSize: "13px", fontWeight: 400 }}
                                                                                        placeholder={showAddBOMProducts ? "Quantity" : "Value"}
                                                                                    />
                                                                                </div>
                                                                            ))}
                                                                        </Form.Item>
                                                                    )}

                                                                </Col>
                                                                <Col>
                                                                    <Button onClick={onClickDone} style={{ margin: "0.5em 0", borderRadius: "8px", }}>Done</Button>
                                                                </Col>
                                                            </Row>

                                                        ) :

                                                            (<Row style={{ borderTop: "2px solid #E9EDEC" }}>
                                                                {
                                                                    !isReadOnly && (
                                                                        <Col>
                                                                            <div style={{ display: "flex", alignItems: "center", margin: "1em 0" }}>
                                                                                <img style={{ height: "auto", color: "#103FD6", fontSize: "12px", fontWeight: "400", marginRight: '0.5em' }} src={Plus} alt="" />
                                                                                <a style={{ color: "#103FD6", fontSize: "12px", fontWeight: "400" }} onClick={UpdateAttributeField}>{showAddBOMProducts ? "Add a product" : field.content}</a>
                                                                            </div>
                                                                        </Col>
                                                                    )
                                                                }
                                                            </Row>)}
                                                        {
                                                            selectedField !== "Standard product" && (
                                                                <>
                                                                    <Row gutter={[16, 16]} style={{ background: "#F7F7F9", padding: "1em 0" }}>
                                                                        <Col span={8} style={{ display: "flex" }}>
                                                                            <Checkbox disabled={isReadOnly} style={{ marginRight: "1em" }} />
                                                                            <span>{showAddBOMProducts ? "Product" : "Attribute"}</span>
                                                                        </Col>
                                                                        {
                                                                            showAddBOMProducts ? (
                                                                                <>
                                                                                    <Col span={3}></Col>
                                                                                    <Col span={6} style={{ flex: "left" }}>
                                                                                        <span>Quantity</span>
                                                                                    </Col>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Col span={8} style={{ flex: "left" }}>
                                                                                        <span>Price</span>
                                                                                    </Col>
                                                                                    <Col span={8} style={{ flex: "left" }}>
                                                                                        <span>List Price</span>
                                                                                    </Col>
                                                                                </>
                                                                            )
                                                                        }

                                                                    </Row>
                                                                    {rows.map((row, index) => (
                                                                        <Row gutter={[16, 16]} style={{ padding: "1em 0" }} key={index} >
                                                                            <Col span={8} style={{ display: "flex" }}>
                                                                                <Checkbox disabled={isReadOnly} style={{ marginRight: "1em" }} />
                                                                                <span>{row.name}</span>
                                                                            </Col>
                                                                            {
                                                                                showAddBOMProducts ? (
                                                                                    <>
                                                                                        <Col span={3}></Col>
                                                                                        <Col span={6}>
                                                                                            <Input disabled={isReadOnly} value={row.value} style={{ borderRadius: "8px", color: "#0C173A", fontSize: "13px", fontWeight: 400 }} />
                                                                                        </Col>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <Col span={8}>
                                                                                            <Input disabled={isReadOnly} value={price} style={{ borderRadius: "8px", color: "#0C173A", fontSize: "13px", fontWeight: 400 }} />
                                                                                        </Col>
                                                                                        <Col span={8}>
                                                                                            <Input disabled={isReadOnly} value={listPrice} style={{ borderRadius: "8px", color: "#0C173A", fontSize: "13px", fontWeight: 400 }} />
                                                                                        </Col>
                                                                                    </>
                                                                                )
                                                                            }

                                                                        </Row>
                                                                    ))}
                                                                </>
                                                            )
                                                        }

                                                    </>
                                                ) :
                                                    addAttributeFlag ? (
                                                        <Row gutter={[16, 0]} justify="space-between">
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    key={showAddBOMProducts ? "Product" : "name"}
                                                                    label={
                                                                        <span
                                                                        style={{
                                                                            fontFamily:"Inter",
                                                                            fontSize: "12px",
                                                                            fontWeight: 400,
                                                                            opacity: "60%",
                                                                        }}
                                                                        >{showAddBOMProducts ? "Product" : "Name"}
                                                                        </span>
                                                                    }
                                                                    name={showAddBOMProducts ? "product" : "attributeName"}
                                                                    // Attribute Name
                                                                    style={{ margin: "0.5em 0" }}
                                                                >
                                                                    <Select
                                                                        disabled={isReadOnly}
                                                                        style={{ borderColor: "#D3D3D3", borderRadius: "8px", height: "34px", color: "#0C173A", fontWeight: 400, fontSize: "13px" }}
                                                                        placeholder={showAddBOMProducts ? "Select Product" : "Select Attribute"}
                                                                        // defaultValue="Color"
                                                                        dropdownClassName="your-custom-dropdown-class"
                                                                        value={selectValue}
                                                                        onChange={handleSelectChange}
                                                                        onFocus={() => { showAddBOMProducts ? getDropDownList("product") : getDropDownList("attributeName") }}
                                                                    >
                                                                        {dropDownList.map((option) => (
                                                                            <Select.Option key={option.RecordID} value={option.RecordID}>
                                                                                {option.Name}
                                                                            </Select.Option>
                                                                        ))}
                                                                        {/* <Select.Option value="Color">Color</Select.Option>
                                                                    <Select.Option value="Size">Size</Select.Option>
                                                                    <Select.Option value="Material">Material</Select.Option> */}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={24}>
                                                                {showAddBOMProducts ? (
                                                                    <Form.Item
                                                                        key={showAddBOMProducts ? "Quantity" : "value"}
                                                                        label={
                                                                            <span
                                                                            style={{
                                                                                fontFamily:"Inter",
                                                                                fontSize: "12px",
                                                                                fontWeight: 400,
                                                                                opacity: "60%",
                                                                            }}
                                                                            >
                                                                                {showAddBOMProducts ? "Quantity" : "Value"}
                                                                            </span>
                                                                        }
                                                                        name={showAddBOMProducts ? "quantity" : "value"}
                                                                        style={{ margin: "0.5em 0" }}
                                                                    >
                                                                        <Input
                                                                            disabled={isReadOnly}
                                                                            value={inputValue}
                                                                            onChange={(e) => {
                                                                                handleInputChange(e);
                                                                            }}
                                                                            style={{ borderColor: "#D3D3D3", borderRadius: "8px", height: "34px", color: "#0C173A", fontSize: "13px", fontWeight: 400 }}
                                                                            placeholder={showAddBOMProducts ? "Quantity" : "Value"}
                                                                        />
                                                                    </Form.Item>
                                                                ) : (
                                                                    <Form.Item
                                                                        key={showAddBOMProducts ? "Quantity" : "AttributeValue"}
                                                                        label={
                                                                            <span
                                                                            style={{
                                                                                fontFamily:"Inter",
                                                                                fontSize: "12px",
                                                                                fontWeight: 400,
                                                                                opacity: "60%",
                                                                            }}
                                                                            >
                                                                                {showAddBOMProducts ? "Qty" : "Value"}
                                                                            </span>
                                                                        }
                                                                        name={showAddBOMProducts ? "quantity" : "attributeValue"}
                                                                        style={{ margin: "0.5em 0" }}
                                                                    >
                                                                        {inputValues.map((value, index) => (
                                                                            <div key={index} style={{ marginBottom: "10px" }}>
                                                                                <Input
                                                                                    disabled={isReadOnly}
                                                                                    value={value}
                                                                                    onChange={(e) => {
                                                                                        handleInputChange(e, index,"attributeValue");
                                                                                    }}
                                                                                    style={{ borderColor: "#D3D3D3", borderRadius: "8px", height: "34px", color: "#0C173A", fontSize: "13px", fontWeight: 400 }}
                                                                                    placeholder={showAddBOMProducts ? "Quantity" : "Value"}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </Form.Item>
                                                                )}

                                                            </Col>
                                                            <Col>
                                                                <Button onClick={onClickDone} style={{ margin: "0.5em 0", borderRadius: "8px", }}>Done</Button>
                                                            </Col>
                                                        </Row>

                                                    ) : (
                                                        <>
                                                            {
                                                                !isReadOnly && (
                                                                    <div style={{ display: "flex", alignItems: "center", margin: "1em 0" }}>
                                                                        <img style={{ height: "auto", color: "#103FD6", fontSize: "12px", fontWeight: "400", marginRight: '0.5em' }} src={Plus} alt="" />
                                                                        <a style={{ color: "#103FD6", fontSize: "12px", fontWeight: "400" }} onClick={UpdateAttributeField}>{showAddBOMProducts ? "Add a product" : field.content}</a>
                                                                    </div>
                                                                )
                                                            }
                                                        </>
                                                    )
                                            ))}

                                        </Card>
                                    );
                                }
                                else if (section.section === 'menu') {
                                    return (
                                        <Row justify="space-between">
                                            <Card
                                                span={section.span}
                                                key={section.title}
                                                style={{
                                                    background: "#FFFFFF",
                                                    width: "100%",
                                                    padding: "1em 1.3em",
                                                    marginTop: "1em",
                                                }}
                                            >
                                                <Tabs tabPosition="left" onTabClick={handleTabClick}>
                                                    {section.fields.map((tab, tabIndex) => (
                                                        <TabPane tab={tab.name} key={tabIndex}>
                                                            {
                                                                tab.type === "Form" ? (
                                                                    <Form.List name={tab.name} >
                                                                        {(fields, { add, remove }) => (
                                                                            <>
                                                                                {fields.map(({ key, name, ...restField }) => (
                                                                                    <Row key={key} gutter={[16, 16]} align="middle">
                                                                                        {tab.data && tab.data.map((dataField) => (
                                                                                            <Col span={10} key={`${name}-${dataField.name}`} style={{ marginBottom: "2em" }}>
                                                                                                <Form.Item
                                                                                                    {...restField}
                                                                                                    name={[name, dataField.name]}
                                                                                                    label={dataField.label}
                                                                                                >
                                                                                                    {dataField.type === "Select" ? (
                                                                                                        <Select
                                                                                                            showSearch
                                                                                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                                                                            allowClear
                                                                                                            disabled={isReadOnly}
                                                                                                            placeholder={dataField.placeholder}
                                                                                                            onFocus={() => {
                                                                                                                getDropDownList(dataField.name);
                                                                                                            }}
                                                                                                            onChange={(val) => { handleChange(val, dataField.name) }}
                                                                                                        >
                                                                                                            {dropDownList.map((option) => (
                                                                                                                <Select.Option
                                                                                                                    key={option.RecordID}
                                                                                                                    value={option.RecordID}
                                                                                                                >
                                                                                                                    {option.Name}
                                                                                                                </Select.Option>
                                                                                                            ))}
                                                                                                        </Select>
                                                                                                    ) : (
                                                                                                        <Input
                                                                                                            disabled={isReadOnly}
                                                                                                            style={{
                                                                                                                borderColor: "#D3D3D3",
                                                                                                                borderRadius: "8px",
                                                                                                                height: "34px",
                                                                                                                color: "#0C173A",
                                                                                                                fontSize: "13px"
                                                                                                            }}
                                                                                                            onChange={handleChange}
                                                                                                            placeholder={dataField.placeholder}
                                                                                                        />
                                                                                                    )}
                                                                                                </Form.Item>
                                                                                            </Col>
                                                                                        ))}
                                                                                        <Col span={2}>
                                                                                            {!isReadOnly && (
                                                                                                <img onClick={() => remove(name)} src={DeleteIcon} alt="VerticalDotsIcon" style={{ cursor: "pointer" }} />

                                                                                            )}
                                                                                        </Col>
                                                                                    </Row>
                                                                                ))}

                                                                                {tab.multiple === "yes" && !isReadOnly && (
                                                                                    <Form.Item>
                                                                                        <div style={{ display: "flex", alignItems: "center", margin: "1em 0" }}>
                                                                                            <img
                                                                                                style={{
                                                                                                    height: "auto",
                                                                                                    color: "#103FD6",
                                                                                                    fontSize: "12px",
                                                                                                    fontWeight: "400",
                                                                                                    marginRight: "0.5em",
                                                                                                }}
                                                                                                src={Plus}
                                                                                                alt=""
                                                                                                onClick={() => add()}
                                                                                            />
                                                                                            <a
                                                                                                style={{
                                                                                                    color: "#103FD6",
                                                                                                    fontSize: "12px",
                                                                                                    fontWeight: "400",
                                                                                                }}
                                                                                                onClick={() => add()}
                                                                                            >
                                                                                                Add {tab.name}
                                                                                            </a>
                                                                                        </div>
                                                                                    </Form.Item>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </Form.List>

                                                                ) : (
                                                                    <Skeleton active loading={tableSkeletonLoading}>
                                                                    <Table
                                                                        columns={tab.data}
                                                                          dataSource={tabsTableData}
                                                                        pagination={false}
                                                                    />
                                                                    </Skeleton>
                                                                )
                                                            }

                                                        </TabPane>
                                                    ))}
                                                </Tabs>
                                            </Card>
                                        </Row>
                                    );
                                }
                                return null; // Handle other types or return null for unsupported types
                            })}
                        </Col>
                        <Col span={8}>
                            {formStructure.map((section) => {
                                if (section.section === 'Image') {
                                    return (
                                        <Card style={{
                                            borderRadius: "6px",
                                            background: "#FFFFFF",
                                            width: "100%",
                                            padding: "1em 1.3em",
                                            height: "fit-content",
                                            marginTop: "1em",
                                        }}>
                                            <span style={{ color: "#192228", fontSize: "12px", fontWeight: 600 }}>{section.title}</span>
                                            <div style={{ background: "#F5F5F5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "8px", padding: "1em", margin: "1em 0", width: "100%", height: "40vh" }}>
                                                <Upload
                                                    onChange={(info) => onClickUpload(info)}
                                                    showUploadList={false}
                                                    beforeUpload={() => false}
                                                    disabled={isReadOnly}
                                                >
                                                    {imageUrl ? (
                                                        <>
                                                            <img src={imageUrl} alt="" style={{ width: "100%", height: "35vh", }} />


                                                        </>
                                                    ) : (
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                                            <div style={{ background: "#ECECEC", border: "2px dotted #C0C0C0", borderRadius: "50%", width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", cursor: isReadOnly ? "not-allowed":"pointer" }}>
                                                                <UploadOutlined style={{ fontSize: "24px" }} />
                                                            </div>
                                                            <span style={{ color: "#0C173A", fontSize: "12px", fontWeight: 400, marginTop: "1em" }}>Upload a product image</span>

                                                        </div>)}
                                                </Upload>
                                            </div>
                                        </Card>
                                    );
                                }
                                else if (section.section === 'Product info') {
                                    return (
                                        <Card style={{
                                            borderRadius: "6px",
                                            background: "#FFFFFF",
                                            width: "100%",
                                            padding: "1em 1.3em",
                                            height: "fit-content",
                                            marginTop: "1em",
                                        }}>                                        <span style={{ color: "#192228", fontSize: "12px", fontWeight: 600 }}>{section.title}</span>
                                            {section.fields?.map((field) => (
                                                <Form.Item
                                                    key={field.name}
                                                    label={
                                                        <span
                                                        style={{
                                                            fontFamily:"Inter",
                                                            fontSize: "12px",
                                                            fontWeight: 400,
                                                            opacity: "60%",
                                                        }}
                                                        >
                                                            {field.label}
                                                        </span>
                                                    }
                                                    name={field.name}
                                                    style={{ margin: "0.5em 0" }}
                                                    rules={[
                                                        {
                                                            required: field.name === "category" ? true : false,
                                                            message: 'Please enter your field!',
                                                        },
                                                    ]}
                                                >
                                                    {field.type === "Select" ? (
                                                        <Select
                                                            showSearch
                                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                            allowClear
                                                            disabled={isReadOnly}
                                                            style={{ borderColor: "#D3D3D3", borderRadius: "8px", height: "34px", color: "#0C173A", fontWeight: 400, fontSize: "13px", width: "100%" }}
                                                            placeholder={field.placeholder}
                                                            onFocus={() => {
                                                                if (field.name !== "status") {
                                                                    getDropDownList(field.name);
                                                                }
                                                            }}
                                                            onChange={(val) => { handleSelect(val, field.name) }}
                                                            value={field.value}
                                                        >
                                                            {field.name === "status" ? (
                                                                <>
                                                                    <Select.Option key="ACT" value="ACT">
                                                                        Active
                                                                    </Select.Option>
                                                                    <Select.Option key="INA" value="INA">
                                                                        Inactive
                                                                    </Select.Option>
                                                                </>
                                                            ) : (
                                                                dropDownList.map((option) => (
                                                                    <Select.Option key={option.RecordID} value={option.RecordID}>
                                                                        {option.Name}
                                                                    </Select.Option>
                                                                ))
                                                            )}
                                                        </Select>
                                                    ) : field.type === "Tag" ? (
                                                        <div>
                                                            {
                                                                !isReadOnly && (
                                                                    <Input
                                                                        disabled={isReadOnly}
                                                                        placeholder="Type here and press Enter"
                                                                        value={tagValue}
                                                                        onChange={handleTagsInputChange}
                                                                        onKeyPress={handleEnterPress}
                                                                        style={{
                                                                            borderColor: "#D3D3D3",
                                                                            borderRadius: "8px",
                                                                            height: "34px",
                                                                            color: "#0C173A", fontSize: "13px", fontWeight: 400
                                                                        }}
                                                                    />
                                                                )
                                                            }
                                                            <div style={{ marginTop: '10px' }}>
                                                                {tags.map((tag, index) => (
                                                                    <Tag
                                                                        key={tag}
                                                                        style={{
                                                                            borderColor: '#D3D3D3',
                                                                            borderRadius: '8px',
                                                                        }}
                                                                        closable={!isReadOnly}
                                                                        onClose={() => handleTagClose(tag)}
                                                                    >
                                                                        {tag}
                                                                    </Tag>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Input
                                                            disabled={isReadOnly}
                                                            style={{
                                                                borderColor: "#D3D3D3",
                                                                borderRadius: "8px",
                                                                height: "34px",
                                                                color: "#0C173A", fontSize: "13px", fontWeight: 400
                                                            }}
                                                            placeholder={field.placeholder}
                                                        />
                                                    )}
                                                </Form.Item>
                                            ))}
                                        </Card>
                                    )
                                }
                                else if (section.section === 'UPC and batch sequence') {
                                    return (
                                        <Card style={{
                                            borderRadius: "6px",
                                            background: "#FFFFFF",
                                            width: "100%",
                                            padding: "1em 1.3em",
                                            height: "fit-content",
                                            marginTop: "1em",
                                        }}>                                        <span style={{ color: "#192228", fontSize: "12px", fontWeight: 600 }}>{section.title}</span>
                                            {section.fields?.map((field) => (
                                                <Form.Item
                                                    key={field.name}
                                                    label={
                                                        <span
                                                        style={{
                                                            fontFamily:"Inter",
                                                            fontSize: "12px",
                                                            fontWeight: 400,
                                                            opacity: "60%",
                                                        }}
                                                        >
                                                            {field.label}
                                                        </span>
                                                    }
                                                    name={field.name}
                                                    style={{ margin: "0.5em 0" }}
                                                >
                                                    {field.type === "Select" ? (
                                                        <Select
                                                            disabled={isReadOnly}
                                                            placeholder={field.placeholder}
                                                            onFocus={() => {
                                                                getDropDownList(field.name);
                                                            }}
                                                            onChange={(val) => { handleChange(val, field.name) }}
                                                        >
                                                            {dropDownList.map((option) => (
                                                                <Select.Option
                                                                    key={option.RecordID}
                                                                    value={option.RecordID}
                                                                >
                                                                    {option.Name}
                                                                </Select.Option>
                                                            ))}
                                                        </Select>
                                                    ) : (
                                                        <Input
                                                            disabled={isReadOnly}
                                                            style={{
                                                                borderColor: "#D3D3D3",
                                                                borderRadius: "8px",
                                                                height: "34px",
                                                                color: "#0C173A",
                                                                fontSize: "13px"
                                                            }}
                                                            placeholder={field.placeholder}
                                                        />
                                                    )}
                                                </Form.Item>
                                            ))}
                                        </Card>
                                    )
                                }
                                // else if (section.section === 'Activity') {
                                //     return (
                                //         <Card style={{
                                //             borderRadius: "6px",
                                //             background: "#FFFFFF",
                                //             width: "100%",
                                //             padding: "1em 1.3em",
                                //             height: "fit-content",
                                //             marginTop: "1em",
                                //         }}>                                        <span style={{ color: "#192228", fontSize: "12px", fontWeight: 600, }}>{section.title}</span>
                                //             <br /><br />
                                //             <Timeline mode="left" >
                                //                 {section.fields.map((timelineData) => (
                                //                     <Timeline.Item key={timelineData.id} dot={
                                //                         <span style={{ backgroundColor: "#D3D3D3", padding: "3px", borderRadius: "50%", marginRight: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center", height: "23px", width: "23px" }}>
                                //                             <img src={TimeLineIcon} alt="timeIcon" style={{ height: "20px" }} />
                                //                         </span>
                                //                     }>
                                //                         <div style={{ display: "flex", flexDirection: "column" }}>
                                //                             <span style={{ fontSize: "12px", color: "#0C173A", fontWeight: 400, }}>{timelineData.children1}</span>
                                //                             <span style={{ fontSize: "12px", color: "#0C173A", fontWeight: 400, opacity: "70%" }}>{timelineData.children2}</span>
                                //                         </div>
                                //                     </Timeline.Item>
                                //                 ))}
                                //             </Timeline>
                                //         </Card>
                                //     )
                                // }

                                return null;
                            })}
                        </Col>

                    </Row>
                </Form>

            </Scrollbars>
        </Spin>
    )

}
export default AddProduct;
