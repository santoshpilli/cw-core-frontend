import React,{useState} from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Col, Row, Dropdown, Menu, Card, DatePicker, Form, Select,Spin } from "antd";
// import { FilterOutlined } from "@ant-design/icons";

// import { genericUrl } from "../../../constants/serverConfig.js";
import Axios from "axios";
import TableForGPReport from "./TableForGPReport.js";
import { generateToken } from "../../../services/generateToken.js";

const dateFormat = "YYYY/MM/DD";
const { Option } = Select;

const SalesGPReport = () => {

  const [gridData, setGridData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalInvoice,setTotalInvoice] = useState(0);
  const [totalLineNet,setTotalLineNetAmt] = useState(0);
  const [totalTrxCost,setTotalTrxCost] = useState(0);
  const genericUrl = process.env.REACT_APP_genericUrl;
  const [orgDropdownDetails,setOrgDropdownDetails] = useState([]);
  const [customerDropdownDetails,setCustomerDropdownDetails] = useState([]);
  const [customerGroupDropdownDetails,setCustomerGroupDropdownDetails] = useState([]);
  const [productDetails,setProductDropdownDetails] = useState([]);
  const [productCategoryDetails,setProductCategoryDropdownDetails] = useState([]);
  const [brandDetails,setBrandDropdownDetails] = useState([]);
  const [supplierDetails,setSupplierDropdownDetails] = useState([]);

  const [typeValue,setTypeValue] = useState([]);

  const[customerFilterFlag, setCustomerFilterFlag] = useState(false);
  const[customerGroupFilterFlag, setCustomerGroupFilterFlag] = useState(false);
  const[productFilterFlag, setProductFilterFlag] = useState(false);
  const[productCategoryFilterFlag, setProductCategoryFilterFlag] = useState(false);
  const[brandFilterFlag, setBrandFilterFlag] = useState(false);
  const[supplierFilterFlag, setSupplierFilterFlag] = useState(false);

  const [form] = Form.useForm();
  
  const handleMenuClick = (obj) => {
    if (obj.key === "view") {
      form.submit();
    } else {
      // form.submit();
      // downloadData();
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="view">
        <span>View</span>
      </Menu.Item>
      <Menu.Item key="download">
        <span>Download</span>
      </Menu.Item>
    </Menu>
  );

  const getOrganization = async () => {
    try {
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const getOrganization = {
        query: `mutation { executeAPIBuilder(apiBuilderId:"61b05acae04aa71f6adf4cd7", params: "{}")}`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      };
      const serverResponse = await Axios.post(genericUrl, getOrganization, { headers: headers }, { async: true }, { crossDomain: true });
      if (serverResponse.status === 200) {
        const organizationData = JSON.parse(serverResponse.data.data.executeAPIBuilder);
        setOrgDropdownDetails([...organizationData]);
      }
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  };


  const getCustomers = async () => {
    try {
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const getCustomers = {
        query: `query {
          reportComboFill(filterId:"54f34787bf754195bdef882c23d3f537", dependentValue:null, searchField:"", limit:"100")
      }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      };
      const serverResponse = await Axios.post(genericUrl, getCustomers, { headers: headers }, { async: true }, { crossDomain: true });
      if (serverResponse.status === 200) {
        const customerResponse = JSON.parse(serverResponse.data.data.reportComboFill);
        setCustomerDropdownDetails([...customerResponse]);
      }
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  };


  const getCustomerGroup = async () => {
    try {
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const getCustomerGroup = {
        query: `query {
          reportComboFill(filterId:"26befc9f17974797bd33a5cabaa41f57", dependentValue:null, searchField:"", limit:"100")
        }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      };
      const serverResponse = await Axios.post(genericUrl, getCustomerGroup, { headers: headers }, { async: true }, { crossDomain: true });
      if (serverResponse.status === 200) {
        const customerGroupResponse = JSON.parse(serverResponse.data.data.reportComboFill);
        setCustomerGroupDropdownDetails([...customerGroupResponse]);
      }
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  };


  const getProducts = async () => {
    try {
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const getProducts = {
        query: `query {
          reportComboFill(filterId:"a3143c5cf325443c9dcee7c3f7fecfbe", dependentValue:null, searchField:"", limit:"100")
      }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      };
      const serverResponse = await Axios.post(genericUrl, getProducts, { headers: headers }, { async: true }, { crossDomain: true });
      if (serverResponse.status === 200) {
        const productsResponse = JSON.parse(serverResponse.data.data.reportComboFill);
        setProductDropdownDetails([...productsResponse]);
      }
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  };


  const getProductCategory = async () => {
    try {
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const getProductCategory = {
        query: `query {
          reportComboFill(filterId:"3734d3eedc974fc7b78b296f6444e839", dependentValue:null, searchField:"", limit:"100")
      }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      };
      const serverResponse = await Axios.post(genericUrl, getProductCategory, { headers: headers }, { async: true }, { crossDomain: true });
      if (serverResponse.status === 200) {
        const productCategoryResponse = JSON.parse(serverResponse.data.data.reportComboFill);
        setProductCategoryDropdownDetails([...productCategoryResponse]);
      }
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  };


  const getBrand = async () => {
    try {
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const getBrand = {
        query: `query {
          reportComboFill(filterId:"eea574e605fe42339c8524c1b4b652b3", dependentValue:null, searchField:"", limit:"100")
      }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      };
      const serverResponse = await Axios.post(genericUrl, getBrand, { headers: headers }, { async: true }, { crossDomain: true });
      if (serverResponse.status === 200) {
        const brandResponse = JSON.parse(serverResponse.data.data.reportComboFill);
        setBrandDropdownDetails([...brandResponse]);
      }
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  };


  const getSupplier = async () => {
    try {
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const getSupplier = {
        query: `query {
          comboFill(
            tableName: "oal_fsd_bpartner"
            pkName: "oal_fsd_bpartner_id"
            identifier: "business_partner"
            whereClause: "isactive='Y'"
          )
        }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      };
      const serverResponse = await Axios.post(genericUrl, getSupplier, { headers: headers }, { async: true }, { crossDomain: true });
      if (serverResponse.status === 200) {
        const supplierResponse = JSON.parse(serverResponse.data.data.comboFill);
        setSupplierDropdownDetails([...supplierResponse]);
      }
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  };

  const getType=(e,data)=>{
    const {children}=data
    setTypeValue(children)
  }

  const onFinish = async (values) => {
    try {
      setLoading(true)
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const getReportDetailsQuery = {
        query: `query {
        getReportJson(reportId:"${values.type}"){data, messageCode, title, message}
        }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken}`,
      };
      const serverResponse = await Axios.post(genericUrl, getReportDetailsQuery, { headers: headers }, { async: true }, { crossDomain: true });
      const reportJsonResponse = serverResponse.data.data.getReportJson;
      if (reportJsonResponse.messageCode === "200") {
        const reportData = JSON.parse(reportJsonResponse.data);
        let reportFields = reportData.Fields;
        const headerArray = []
        const amountArray = []
        reportFields = [
          {
            clientId: "0",
            currencyFieldId: null,
            currencyFieldName: null,
            detailReportId: null,
            detailReportName: null,
            displayName: "SNo",
            drillDown: "N",
            enablenestedtable: "N",
            enablesummary: "N",
            fieldName: "sno",
            id: "ed6aa3381cfa4cf79899547afg638e39",
            reportId: "DEDC22058E174306B2CD1036AC9507CC",
            sequence_no: "0",
            type: "Number",
          },
          ...reportFields
        ]
        for (let index = 0; index < reportFields.length; index++) {
          const element = reportFields[index];
          if(element.type==="Amount"){
            amountArray.push(element.fieldName)
          }
          headerArray.push({
            // headerName: filtersData[index].displayName,
            title: <span className="dragHandler" >{element.displayName}</span>,
            dataIndex: element.fieldName,
            type: element.type,
            // key: index+1,
            width: 180,
            ellipsis: true
          });
        }
        
        const fromDate = new Date(values.fromDate).toISOString();
        const toDate = new Date(values.toDate).toISOString();
        const type = values.type
        const org = values.organization
        const customer = values.customer===undefined?null:values.customer
        const customerGroup = values.customerGroup===undefined?null:values.customerGroup
        const product = values.product===undefined?null:values.product
        const productCategory = values.productCategory===undefined?null:values.productCategory
        const brand = values.brand===undefined?null:values.brand
        const suppliler = values.supplier===undefined?null:values.supplier

        const arrayToSend = {};
        
        arrayToSend["DateFrom"]=fromDate
        arrayToSend["DateTo"]=toDate
        arrayToSend["organization"]=org
        arrayToSend["type"]=type
        arrayToSend["customer_id"]=customer
        arrayToSend["customer_group_id"]=customerGroup
        arrayToSend["product_id"]=product
        arrayToSend["product_category_id"]=productCategory
        arrayToSend["brand_id"]=brand
        arrayToSend["supplier"]=suppliler

        const stringifiedJSON = JSON.stringify(arrayToSend);
        const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
        const onSubmitQuery = {
            query: `query {
            executeReport(reportId:"${values.type}", reportParam:"${jsonToSend}"){data, messageCode, title, message}
          }`,
        }
        const serverResponse = await Axios.post(genericUrl, onSubmitQuery, { headers: headers }, { async: true }, { crossDomain: true });
        if (serverResponse.status === 200) {        
           const responseForGridData = serverResponse.data.data.executeReport.data;
           const gridData = JSON.parse(responseForGridData);
           if (gridData.length > 0) {   
            for (let index = 0; index < gridData.length; index++) {
              const element = gridData[index];
              element['sno'] = index+1
              for (let index2 = 0; index2 < amountArray.length; index2++) {
                const element2 = amountArray[index2];
                element[element2] = parseInt(element[element2]);
              }
            }            
          }
           let totalInv = 0;
           let totalLineNet = 0;
           let totalTrxCost = 0;

           gridData.forEach(({ qty_invoiced, linenetamt, trx_cost }) => {
            totalInv += qty_invoiced;
            totalLineNet += linenetamt;
            totalTrxCost += trx_cost
          });
           
           setTotalInvoice(totalInv)
           setTotalLineNetAmt(totalLineNet)
           setTotalTrxCost(totalTrxCost)
           setHeaderData(headerArray)
           setGridData(gridData)
           setLoading(false);

        }

        // setReportFields(reportFields);
      }
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        generateToken();
      } else {
        return Promise.reject(error);
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
  };

  
  const numberWithCommas=(x)=>{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

  return (
    <Spin indicator={<LoadingOutlined style={{ fontSize: "52px" }} spin />} spinning={loading}>
      <Row>
        <Col span={12} style={{ marginBottom: "8px" }}>
          <h2>
            <b>Sales GP Report</b>
          </h2>
        </Col>
        <Col span={12} style={{ marginBottom: "8px" }}>
          <span style={{ float: "right" }}>
            {/* <Popover
              content={content}
              placement="bottom"
              title={
                <strong>
                  <FilterOutlined />
                  &nbsp;Filters
                </strong>
              }
              trigger="click"
              visible={more}
              onVisibleChange={handleVisibleChange}
            >
              <Button type="primary">
                <FilterOutlined />
              </Button>
            </Popover>
            &nbsp; */}
            <Dropdown.Button overlay={menu} type="primary">
              Action
            </Dropdown.Button>
          </span>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ marginBottom: "8px" }}>
          <Card>
            <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
              <Row gutter={8}>
                <Col span={6}>
                  <Form.Item label="From Date" name="fromDate" rules={[{ required: true, message: "Please Enter from date" }]}>
                    <DatePicker style={{ width: "100%" }} format={dateFormat} />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item label="To Date" name="toDate" rules={[{ required: true, message: "Please Enter to date" }]}>
                    <DatePicker style={{ width: "100%" }} format={dateFormat} />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item label="Organization" name="organization" rules={[{ required: true, message: "Please select organization" }]}>
                    <Select
                      style={{ width: "100%" }}
                      // onSearch={searchDropdownRecords}
                      // mode="multiple"
                      // maxTagCount={1}
                      showSearch
                      allowClear
                      // notFoundContent={fetching ? <Spin size="small" /> : null}
                      dropdownMatchSelectWidth={false}
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onFocus={() => getOrganization()}
                    >
                      {orgDropdownDetails === null || orgDropdownDetails === undefined
                        ? null
                        : orgDropdownDetails.map((data) => {
                            return (
                              <Option key={data.cs_bunit_id} value={data.cs_bunit_id}>
                                {data.name}
                              </Option>
                            );
                          })}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item label="Type" name="type" rules={[{ required: true, message: "Please select type" }]}>
                    <Select
                      style={{ width: "100%" }}
                      // maxTagCount={1}
                      showSearch
                      allowClear
                      dropdownMatchSelectWidth={false}
                      onSelect={getType}
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      <Option key="DEDC22058E174306B2CD1036AC9507CC" value="DEDC22058E174306B2CD1036AC9507CC">
                        By Product Category
                      </Option>
                      <Option key="A55549C05F40488BBB67061050818A38" value="A55549C05F40488BBB67061050818A38">
                        By Product
                      </Option>
                      <Option key="72F2937D916D4F909DEB1DB6870B2310" value="72F2937D916D4F909DEB1DB6870B2310">
                        By Customer
                      </Option>
                      <Option key="BE5EBF5AFE19483D9C2776E4CA215F73" value="BE5EBF5AFE19483D9C2776E4CA215F73">
                        By Customer Group
                      </Option>
                      <Option key="92842554ED244B54B31386A753A76CB0" value="92842554ED244B54B31386A753A76CB0">
                        By Supplier
                      </Option>
                      <Option key="C3477C3DEFB0459889773A78DDB3E23D" value="C3477C3DEFB0459889773A78DDB3E23D">
                        By Brand
                      </Option>
                      <Option key="A22CEF3675D74CD691D10B940874D449" value="A22CEF3675D74CD691D10B940874D449">
                        Custom
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>

                {/* <Col span={6}>
                <Input />
              </Col>
              <Col span={6}>
                <Input />
              </Col>
              <Col span={6}>
                <Input />
              </Col> */}
              </Row>
              <br />

              {typeValue === "Custom" ? (
                <>
                  <Row gutter={8}>
                    <Col span={6}>
                      <Form.Item label="Customer" name="customer" rules={[{ required: false, message: "Please select customer" }]}>
                        <Select
                          style={{ width: "100%" }}
                          // maxTagCount={1}
                          showSearch
                          allowClear
                          onFocus={() => getCustomers()}
                          dropdownMatchSelectWidth={false}
                          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {customerDropdownDetails === null || customerDropdownDetails === undefined
                            ? null
                            : customerDropdownDetails.map((data) => {
                                return (
                                  <Option key={data.recordid} value={data.recordid}>
                                    {data.name}
                                  </Option>
                                );
                              })}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item label="Customer Group" name="customerGroup" rules={[{ required: false, message: "Please select customer group" }]}>
                        <Select
                          style={{ width: "100%" }}
                          // maxTagCount={1}
                          showSearch
                          allowClear
                          onFocus={() => getCustomerGroup()}
                          dropdownMatchSelectWidth={false}
                          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {customerGroupDropdownDetails === null || customerGroupDropdownDetails === undefined
                            ? null
                            : customerGroupDropdownDetails.map((data) => {
                                return (
                                  <Option key={data.recordid} value={data.recordid}>
                                    {data.name}
                                  </Option>
                                );
                              })}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item label="Product" name="product" rules={[{ required: false, message: "Please select product" }]}>
                        <Select
                          style={{ width: "100%" }}
                          // maxTagCount={1}
                          showSearch
                          allowClear
                          dropdownMatchSelectWidth={false}
                          onFocus={() => getProducts()}
                          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {productDetails === null || productDetails === undefined
                            ? null
                            : productDetails.map((data) => {
                                return (
                                  <Option key={data.recordid} value={data.recordid}>
                                    {data.name}
                                  </Option>
                                );
                              })}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item label="Product Category" name="productCategory" rules={[{ required: false, message: "Please select product category" }]}>
                        <Select
                          style={{ width: "100%" }}
                          // maxTagCount={1}
                          showSearch
                          allowClear
                          dropdownMatchSelectWidth={false}
                          onFocus={() => getProductCategory()}
                          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {productCategoryDetails === null || productCategoryDetails === undefined
                            ? null
                            : productCategoryDetails.map((data) => {
                                return (
                                  <Option key={data.recordid} value={data.recordid}>
                                    {data.name}
                                  </Option>
                                );
                              })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <br />
                  <Row gutter={8}>
                    <Col span={6}>
                      <Form.Item label="Brand" name="brand" rules={[{ required: false, message: "Please select brand" }]}>
                        <Select
                          style={{ width: "100%" }}
                          // maxTagCount={1}
                          showSearch
                          allowClear
                          dropdownMatchSelectWidth={false}
                          onFocus={() => getBrand()}
                          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {brandDetails === null || brandDetails === undefined
                            ? null
                            : brandDetails.map((data) => {
                                return (
                                  <Option key={data.recordid} value={data.recordid}>
                                    {data.name}
                                  </Option>
                                );
                              })}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item label="Supplier" name="supplier" rules={[{ required: false, message: "Please select supplier" }]}>
                        <Select
                          style={{ width: "100%" }}
                          // maxTagCount={1}
                          showSearch
                          allowClear
                          dropdownMatchSelectWidth={false}
                          onFocus={() => getSupplier()}
                          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {supplierDetails === null || supplierDetails === undefined
                            ? null
                            : supplierDetails.map((data) => {
                                return (
                                  <Option key={data.recordid} value={data.recordid}>
                                    {data.name}
                                  </Option>
                                );
                              })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ) : (
                ""
              )}
              <br />
            </Form>
            <Row>
              <Col span={24} style={{ marginBottom: "8px" }}>
                <Card>
                  <Row gutter={8} style={{ marginLeft: "5%" }}>
                    <Col span={8}>
                      <span>Total Invoice Quantity</span>
                      <br />
                      <b>{numberWithCommas(totalInvoice)}</b>
                    </Col>

                    <Col span={8}>
                      <span>Total Line Net Amount</span>
                      <br />
                      <b>{numberWithCommas(totalLineNet)}</b>
                    </Col>

                    <Col span={8}>
                      <span>Total Transaction Cost</span>
                      <br />
                      <b>{numberWithCommas(totalTrxCost)}</b>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ marginBottom: "8px" }}>
          <Card>
            <TableForGPReport gridData={gridData} columnsData={headerData} />
            {/* <Table sticky={true} size="small" pagination={false} scroll={{ y: "58vh", x: "100%" }} dataSource={gridData} columns={headerData} /> */}
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default SalesGPReport;