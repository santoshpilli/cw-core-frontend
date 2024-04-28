import React, { useEffect, useState } from "react";
import { Card, Menu, Dropdown, Form, Row, Col, Select, Button, InputNumber,Input, Spin, message, Table, Image,Popover } from "antd";
import { getQualityTask } from "../../../services/custom";
import { useHistory } from "react-router";
import useDebounce from "../../../lib/hooks/useDebounce";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import { v4 as uuid } from "uuid";

import "antd/dist/antd.css";
import "../../../styles/app.css";

const { Option } = Select;


const PendingQualityTask = () => {
  const [loading,setLoading] = useState(false)
  const [taskData,setTaskData] = useState([])
  
  const [taskDataCopy,setTaskDataCopy]= useState([])
 const [value,setValue] = useState()

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
    let arr = [...taskDataCopy]
    const filteredData = arr.filter(entry =>
          entry.taskNo !== null && entry.taskNo.toLowerCase().includes(currValue.toLowerCase()) ||
          entry.bUnit.name !== null && entry.bUnit.name.toLowerCase().includes(currValue.toLowerCase()) ||
          entry.product.name !== null && entry.product.name.toLowerCase().includes(currValue.toLowerCase()) ||
          entry.batchNo !== null && entry.batchNo.toLowerCase().includes(currValue.toLowerCase()) ||
          entry.cwqQualityEngineerName !== null && entry.cwqQualityEngineerName.toLowerCase().includes(currValue.toLowerCase()) ||
          entry.status !== null && entry.status.toLowerCase().includes(currValue.toLowerCase())
        );
        setTaskData(filteredData);
  }
  

  const history = useHistory();

  const getData = async () =>{
    setLoading(true)
    const userData = window.localStorage.getItem('userData')
    const parsedUserData = JSON.parse(userData)
    const qualityTaskResponse = await getQualityTask(parsedUserData.user_id)
    setTaskData(qualityTaskResponse !== null && qualityTaskResponse.length > 0 ? qualityTaskResponse :[])
    setTaskDataCopy(qualityTaskResponse !== null && qualityTaskResponse.length > 0 ? qualityTaskResponse :[])
    setLoading(false)
  }

  const selectRow = (record) => {
    return {
      onClick: (event) => {
        history.push(`/others/window/7475/${record.cWQInspectionTaskId}`);
      },
    };
  };

  const columns = [
    { title: "Task No", 
    dataIndex: "taskNo",
    key: "taskNo", 
    width: 130, 
    },
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
    { title: "Batch",
     dataIndex: "batchNo",
     key: "batch1",
     width: 180
    },
    {
      title: "Service Engineer",
      dataIndex: "cwqQualityEngineerName",
      key: "Customer",
      width: 180,
      render:(text,data) =>{
        return data.cwqQualityEngineerName
      }
    },
    { title: "Status", dataIndex: "status", key: "status", width: 220,},
  ];
 
  return (
     <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading}>
      <div>
        <Row>
          <Col span={12}>
            <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "8px", marginTop: "1%" }}>Pending QC Task</h2>
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
              //   const filteredData = taskDataCopy.filter(entry =>
              //     entry.taskNo !== null && entry.taskNo.toLowerCase().includes(currValue.toLowerCase()) ||
              //     entry.bUnit.name !== null && entry.bUnit.name.toLowerCase().includes(currValue.toLowerCase()) ||
              //     entry.product.name !== null && entry.product.name.toLowerCase().includes(currValue.toLowerCase()) ||
              //     entry.batchNo !== null && entry.batchNo.toLowerCase().includes(currValue.toLowerCase()) ||
              //     entry.cwqQualityEngineerName !== null && entry.cwqQualityEngineerName.toLowerCase().includes(currValue.toLowerCase()) ||
              //     entry.status !== null && entry.status.toLowerCase().includes(currValue.toLowerCase())
              //   );
              //   setTaskData(filteredData);
              // }}
              style={{ width: "85%", margin: "5px" }}
              suffix={<i className="fa fa-search" role="presentation" aria-hidden="true"/>} />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={taskData}
          size="small"
          scroll={{ y: "78.5vh", x: "100%"}}
          pagination={false}
          onRow={selectRow}
        />
      </div>
     </Spin>
  );
};

export default PendingQualityTask;
