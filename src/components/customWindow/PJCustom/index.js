import React, { useState, useEffect ,useRef} from "react";
import { Row, Col,  Card, Form, Table,Button,AutoComplete,Input,Space} from "antd";

import { useHistory } from "react-router-dom";
import { LoadingOutlined,SearchOutlined} from "@ant-design/icons";

import {
  getPjDetailsData,
  getCustomerInfoTabData,
  getKycData,
  getTermsConditionsData,
  getRegulatoryData,
  getStockMixData,
  getOutletData,
 
} from "../../../services/custom";

import "antd/dist/antd.css";
import "../../../styles/antd.css";




const PJCustom = () => {
  const history = useHistory();

  const [loading, setLoading] = useState(true);

  const [dataSource, setDataSource] = useState([]); 
  const [dataSourceCopy,setDataSourceCopy]=useState([])
  const [value, setValue] = useState('');

  const [visible, setVisible] = useState(true);
  const [recordToDelete, setRecordToDelete] = useState(1);
  const [recordToDeleteInForm, setRecordToDeleteInForm] = useState([]);
  const [customerInfoHeder, setcustomerInfoHeder] = useState();
  const [customerInfoTabHeder, setCustomerInfoTabHeder] = useState([]);
  const [termsAndConditiontab, setTermsAndConditionTab] = useState([]);
  const [RegulatoryTabHeader, setRegulatoryTabHeader] = useState([]);
  const [kycTabHeader, setKycTabHeader] = useState([]);
  const [stockMixHeader, setStockMixHeader] = useState([]);
  const [outletHeader, setOutletHeader] = useState([]);
  
  const searchInput = useRef(null); 
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const [mainForm] = Form.useForm();
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
      >
      <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
        
        <Space>
         
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={(e) => {
              confirm({
                closeDropdown: true,
               
              });
             
              setSearchText(selectedKeys[0]);
               setSearchedColumn(dataIndex); 
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()||""),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 30);
      }
    },
   
  });
  
   
  

  const columnsdata = [
    {
      title: "Business Unit",
      dataIndex: "bunitName", 
      ...getColumnSearchProps('bunitName'),
    },
    {
      title: "PJ Code",
      dataIndex: "pjCode",
      ...getColumnSearchProps('pjCode'),
    },
    {
      title: "PJ Name",
      dataIndex: "pjName",
      ...getColumnSearchProps('pjName'),
    },
    {
      title: "Customer Category",
      dataIndex: "category",
     ...getColumnSearchProps('category'),
    },
   
    {
      title: "Nick Name",
      dataIndex: "nickName",
       ...getColumnSearchProps('nickName'),
    },
    {
      title: "PJ Group",
      dataIndex: "pjGroup",
        ...getColumnSearchProps('pjGroup'),
    },
    {
      title: "Type",
      dataIndex: "type",
        ...getColumnSearchProps('type'),
      //  sorter: (a, b) => a.address.length - b.address.length,
     
    },
  ];



  const onFinishFailed = (errorInfo) => {
  
  };

  const getAllFormValuesTab = (event, values) => {
  };

  const onSelectChange = (e) => {
    setRecordToDelete(e);
  };

  const rowSelection = {
    onChange: onSelectChange,
  };

  useEffect(() => {
    getData();
    gettabData();
  }, []);

  const gettabData = async () => {
    const pjMasterId = localStorage.getItem("pjMasterId");
    const kycTabDataresponse = await getKycData(pjMasterId); 
    
    const termsAndCondition = await getTermsConditionsData(pjMasterId);
    const Regulatoryresponse = await getRegulatoryData(pjMasterId);
    const StockMixDataresponse = await getStockMixData(pjMasterId);
    const outletHederResponse = await getOutletData(pjMasterId);

    setOutletHeader(outletHederResponse);
    
    
    setStockMixHeader(StockMixDataresponse);
  
    setTermsAndConditionTab(termsAndCondition);
  
    setRegulatoryTabHeader(Regulatoryresponse);
    
    // setKycTabHeader(kycTabDataresponse);
 
  };

  const getData = async () => {
    setLoading(true); 
   
     const pjMasterID = localStorage.getItem("pjMasterId"); 
     const pjMasterId = localStorage.getItem("pjMasterId"); 
     const kycTabDataresponse = await getKycData(pjMasterId);
   
    const getDataResponse = await getPjDetailsData(); 

    const customerInfoTabData = await getCustomerInfoTabData(pjMasterId);
    if (customerInfoTabData !== undefined) {
      if (customerInfoTabData.length > 0 || customerInfoTabData !== null) {
        setcustomerInfoHeder(customerInfoTabData);
        // mainForm.setFieldsValue({
        //   bUnitName : customerInfoTabData[0].bUnitName,
        //   pjcode: customerInfoTabData[0].pjCode,
        //   pjname:customerInfoTabData[0].pjName,
        //   customercategory:customerInfoTabData[0].customerCategory.name,
        //   gstno:customerInfoTabData[0].gstNo,
        //   currency:customerInfoTabData[0].currency.isoCode,
        //    nickname:customerInfoTabData[0].pjName,
        //   invoicingname:customerInfoTabData[0].currency.isoCode,
        //   invoicingaddress:customerInfoTabData[0].invoicingAddress,
        //   CSAlimit:customerInfoTabData[0].csaLimit,
        //   ASSLimit:customerInfoTabData[0].asslimit,
        //   ASSStartDate:moment(customerInfoTabData[0].assStartDate).format("YYYY-MM-DD"),
        //   ASSEndDate:moment(customerInfoTabData[0].assEndDate).format("YYYY-MM-DD"),
        //   totalconsignmentStock:customerInfoTabData[0].totalConsignmentStock,
        //   outrightstock:customerInfoTabData[0].outRightStock,
        //   TotalStock:customerInfoTabData[0].totalStock,
        //   paymentterms:customerInfoTabData[0].paymentTerms.name,
        //   customerInfopjtype:customerInfoTabData[0].pjtype,
        //   customerinfopjgroup:customerInfoTabData[0].pjGroup,
        //   customerInfoPJClosureDate:moment(customerInfoTabData[0].pjClosureDate).format("YYYY-MM-DD"),
        //   customerInfoPJOnboardingDate:moment(customerInfoTabData[0].pjOnboardingDate).format("YYYY-MM-DD"),
        //   customerInfoownername:customerInfoTabData[0].pjName,
        //   customerinfocity:customerInfoTabData[0].city,
        //   customerInfostate:customerInfoTabData[0].region.name,
        //   customerInfozone:customerInfoTabData[0].zone,
        //   customerInfoEmail:customerInfoTabData[0].email,
        //   customerinfomobileno:customerInfoTabData[0].mobileNo,
        //   customerInfoCountry:customerInfoTabData[0].country.name,
        //   customerInfopincode:customerInfoTabData[0].pincode,
        //   customerinfoWebSiteaddress:customerInfoTabData[0].websiteAddress,
        //   customerInfosolitairejewellery:customerInfoTabData[0].solitaireJewellery,
        //   customerinfosmalldiamondjewellery:customerInfoTabData[0].smallDiamondJewellery,
        //   customerInfoGoldJewellery:customerInfoTabData[0].goldJewellery,
        //   customerInfoluxurylifestyleitems:customerInfoTabData[0].luxuryLifestyle,
        //   customerInfoOthers:customerInfoTabData[0].others,
        //   customerInfoRegisteredWithDS:customerInfoTabData[0].registeredWithDs,
        //   customerInfoUnRegisteredWithDS:customerInfoTabData[0].unregisteredWithDs,

        // })
      }
    }
  
    // if (getDataResponse) {
    //   for (let index = 0; index < getDataResponse.length; index++) {
    //     getDataResponse[index].key = getDataResponse[index].pjMasterId;
    //     getDataResponse[index].customerCategory = getDataResponse[index].customerCategory.name;
    //   }

    //   setDataSource([...getDataResponse]);
    // setDataSourceCopy([...getDataResponse])
    if (getDataResponse!== undefined) { 
      
      let array=[]
     
      for (let index = 0; index < getDataResponse.length; index++) {
      const dvenname=getDataResponse[index]
     
          
         const kycname=dvenname.dvnCustomer 
        
         kycname.forEach((item,index)=>{
         
         array.push({   
          
           pjMasterId:item.pjMasterId,
          bunitName:item.bunitName,
          pjCode:item.pjCode,
          pjName:item.pjName,
          category:item.category.name,
          gstNumber:item.gstNumber,
          nickName:item.nickName,
          pjGroup:item.pjGroup,
          type:item.type,
         })

         })
        //  getDataResponse.forEach((item)=>{
        //    array.push({
        //      dvnCustomer.pjMasterId:item.pjMasterId;
        //    })
        //  })

        // const bunitName=kycname.bunitName 
        getDataResponse[index].dvnCustomer.key = pjMasterId;
        // getDataResponse[index].dvnCustomer.key= getDataResponse[index].dvnCustomer.bunitName;
        // getDataResponse[index].dvnCustomer.key= getDataResponse[index].dvnCustomer.pjCode;

        //  getDataResponse[index].dvnCustomer.key= getDataResponse[index].dvnCustomer.category.name;
        } 

     
      setDataSource([...array]);
  setDataSourceCopy([...array])
      setLoading(false);
    }
  
};

  return (
    <div>
      <Row>
        <Col span={12}>
          <h2>PJ Custom</h2> 
        </Col>
        <Col span={12}>
        <span style={{float:'right'}}>
           <Button  onClick={() => {   history.push(`/others/window/PJCustomerDetails`); 
            localStorage.setItem("pjMasterId", undefined)
           } }   style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} >NEW</Button>
       </span>
       </Col>
       
      </Row> 
      <Row>
      <Col span={6} style={{ paddingTop: "8px",paddingBottom:"8px" }}>
      <AutoComplete style={{ width: "100%" }}>
            <Input
              placeholder="Search"
              value={value}
              onChange={e => {       
                let currValue = e.target.value;
                setValue(currValue);
               
                const filteredData = dataSourceCopy.filter(entry =>
                  entry.bunitName !== null && entry.bunitName.toLowerCase().includes(currValue.toLowerCase()) 
                );
                setDataSource(filteredData);
              }}
               suffix={<i className="fa fa-search" role="presentation" aria-hidden="true"/>}
            
             />
          </AutoComplete>
          </Col>
          </Row>
      <Row>
        <Col span={24}>
          <Card>
            <Form layout="vertical" form={mainForm} name="control-pj" onValuesChange={getAllFormValuesTab} onFinishFailed={onFinishFailed}>
              <div>
                <Table
                  size="small"
                  columns={columnsdata}
                  dataSource={dataSource}
                  rowSelection={rowSelection}
                  pagination={false}
                  loading={{
                    spinning: loading,
                    indicator: <LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />,
                  }}
                  onRow={(row) => ({
                    onClick: () => {
                      localStorage.setItem("pjMasterId", row["pjMasterId"]);
                      history.push(`/others/window/PJCustomerDetails`);
                    },
                  })}
                />
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PJCustom;
