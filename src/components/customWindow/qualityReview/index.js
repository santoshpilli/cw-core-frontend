import React, { useEffect, useState } from "react";
import { Row, Col, Select,Input, Spin, Table } from "antd";
import { useHistory } from "react-router";
import { getQualityReview } from "../../../services/custom";
import { LoadingOutlined } from "@ant-design/icons";
import useDebounce from "../../../lib/hooks/useDebounce";
import "antd/dist/antd.css";
import "../../../styles/app.css";



const QualityReview = () => {
const [loading,setLoading] = useState(false)
const [data,setData] = useState([])
const [dataCopy,setDataCopy] = useState([])
const [searchInput,setSearchInput] = useState('')
const [value,setValue] = useState('')

const history = useHistory();
// const debounccedSearch = useDebounce(searchTerm,500);
  useEffect(() => {
    getData()
  }, [])

  
  const onChange = (e)=>{
    setValue(e.target.value)
  };

  const searchKey = useDebounce(value, 500);

  useEffect(() => { 
      getSearchData(searchKey);
  }, [searchKey]);

  const getSearchData=(currValue)=>{
    let arr = [...dataCopy]
    const filteredData = arr.filter(entry =>
          entry.bUnit.name !== null && entry.bUnit.name.toLowerCase().includes(currValue.toLowerCase()) ||
          entry.product.name !== null && entry.product.name.toLowerCase().includes(currValue.toLowerCase()) ||
          entry.batchNo !== null && entry.batchNo.toLowerCase().includes(currValue.toLowerCase()) ||
          entry.date !== null && entry.date.toLowerCase().includes(currValue.toLocaleLowerCase())
        );
        setData(filteredData);
  }

  const getData = async () =>{
    setLoading(true)
    const userData = window.localStorage.getItem('userData')
    const parsedUserData = JSON.parse(userData)
    // parsedUserData.user_id
    const qualityReview = await getQualityReview(parsedUserData.user_id)
    setData(qualityReview.length > 0 ? qualityReview :[])
    setDataCopy(qualityReview.length> 0? qualityReview:[])
    setLoading(false)
  }

  const columns = [
    {
      title: "Business Unit",
      dataIndex: "SalesOrder",
      key: "SalesOrder",
      width: 130,
      render:(text,data) =>{
        return data.bUnit.name
      }
    },
    {
      title: "Product",
      dataIndex: "Customer_name",
      key: "Customer",
      width: 180,
      render:(text,data) =>{
        return data.product.name
      }
    },
    { title: "Batch", dataIndex: "batchNo", key: "batchNo", width: 180,},
    { title: "Status", dataIndex: "status", key: "status", width: 220,},
    { title: "Date", dataIndex: "date", key: "date", width: 130 }
  ];
 
  const selectRow = (record) => {
    return {
      onClick: (event) => {
        history.push(`/others/window/7478/${record.cWQWorkflowId}`);
      },
    };
  };

  return (
    <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
      <div>
        <Row>
          <Col span={12}>
            <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "8px", marginTop: "1%" }}>Quality Review</h2>
          </Col>
          <Col span={12} />
        </Row>
        <Row>
          <Col span={6}>
            <Input
               placeholder="Search"
               value={value} 
                onChange={onChange}
              //  onChange={e => {
              //   let currValue = e.target.value;
              //   setValue(currValue);
              //   const filteredData = dataCopy.filter(entry =>
              //     entry.bUnit.name !== null && entry.bUnit.name.toLowerCase().includes(currValue.toLowerCase()) ||
              //     entry.product.name !== null && entry.product.name.toLowerCase().includes(currValue.toLowerCase()) ||
              //     entry.batchNo !== null && entry.batchNo.toLowerCase().includes(currValue.toLowerCase()) ||
              //     entry.date !== null && entry.date.toLowerCase().includes(currValue.toLocaleLowerCase())
              //   );
              //   setData(filteredData);
              // }}
              style={{ width: "85%", margin: "5px" }}
              suffix={<i className="fa fa-search" role="presentation" aria-hidden="true"/>} />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={data}
          size="small"
          scroll={{ y: "64.5vh", x: "100%"}}
          pagination={false}
          onRow={selectRow}
        />
      </div>
     </Spin>
  );
};

export default QualityReview;
