import React, { useEffect, useState } from "react";
import { Table,Row,Col,Input,Button,AutoComplete } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import { useGlobalContext } from "../../../lib/storage";
import { getCustomRoleData } from "../../../services/generic";
import InvoiceLogo from "../../../assets/images/invoice.svg";
import ThemeJson from "../../../constants/UIServer.json"
import "antd/dist/antd.css";

const UserWindowLines = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const [loading, setLoading] = useState(false);
  const [dataSourceRecords, setDataSourceRecords] = useState([]);
  const [dataSourceRecordsCopy,setDataSourceRecordsCopy] = useState([])
  const [nameArray,setNameArray] = useState([])
  const [value, setValue] = useState('');


  
  const history = useHistory();
  const columnsData = [
    {
      width: 50,
      checkboxSelection(params) {
        return params.columnApi.getRowGroupColumns().length === 0
      },
      headerCheckboxSelection(params) {
        return params.columnApi.getRowGroupColumns().length === 0
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      filters: nameArray,
      onFilter: (value, record) => record.name === null || record.name === undefined || record.name === "" ? null : record.name.includes(value),
    },
    {
      title: 'Active',
      dataIndex: 'isactive',
      render: text => <span>{text === "true" || text === "Y" ? <i class="fa fa-check" aria-hidden="true" /> : <i class="fa fa-times" aria-hidden="true" />}</span>,
      
    },
    {
      title: 'Admin',
      dataIndex: 'isadmin',
      render: text => <span>{text === "true" || text === "Y" ? <i class="fa fa-check" aria-hidden="true" /> : <i class="fa fa-times" aria-hidden="true" />}</span>,

    },
  ]

  useEffect(async () => {
    setLoading(true);
    const getData = await getCustomRoleData();
    setDataSourceRecords([...getData]);
    setDataSourceRecordsCopy([...getData])
    let NameArray = []
    for (let index = 0; index < getData.length; index++) {
      const name = getData[index].name;
      if(name === null || name === undefined || name === ""){
      }else{
        NameArray.push(
          {
          text: name,
          value: name,
          key:getData[index].csRoleId
          }
        ) 
      } 
    }
    const ids3 = NameArray.map(o => o.text)
    const filteredNameArray = NameArray.filter(({text}, index) => !ids3.includes(text, index + 1))
    setNameArray(filteredNameArray)
    setLoading(false);
  }, []);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (keys) => {
    setSelectedRowKeys([keys[keys.length - 1]]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideSelectAll: true,
    fixed: true,
  };

  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 12,
    sm: 12,
    md: 12,
  };
  const responsiveButton = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 24,
    sm: 24,
    md: 12,
  };

  const responsiveSearch = {
    xxl: 6,
    xl: 6,
    lg: 6,
    xs: 24,
    sm: 12,
    md: 6,
  };

  return (
    <div>
      <Row>
        <Col {...responsiveDesignForColumn}>
          <img src={InvoiceLogo} alt="invoice" align="left" /> <p style={Themes.contentWindow.ListWindowHeader.listWindowTitle}> &ensp;Role</p>
        </Col>
        <Col {...responsiveDesignForColumn}>
          <Button onClick={() => { history.push(`/others/window/CreateRole`); /* setWindowStore({ userRecordData: {}, saveUserButton: { "saveButton": true } }); */ localStorage.setItem("csUserId", undefined) }} style={Themes.contentWindow.ListWindowHeader.newButtonForlist}>
            New
            </Button>
        </Col>
      </Row>
      <Row>
        <Col {...responsiveSearch} style={{ paddingTop: "8px" }}>
          <AutoComplete style={{ width: "100%" }}>
            <Input
              placeholder="Search"
              value={value}
              onChange={e => {
                let currValue = e.target.value;
                setValue(currValue);
                const filteredData = dataSourceRecordsCopy.filter(entry =>
                  entry.name !== null && entry.name.toLowerCase().includes(currValue.toLowerCase()) 
                );
                setDataSourceRecords(filteredData);
              }}
              suffix={<i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.contentWindow.ListWindowHeader.listSearch} />}
            />
          </AutoComplete>
        </Col>
      </Row>
      <p style={{marginBottom:'8px'}} />
    <Table
      size="small"
      scroll={{ y: "72vh", x: "100%" }}
      sticky={true}
      pagination={false}
      loading={{
        spinning: loading,
        indicator: <LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />,
      }}
      dataSource={dataSourceRecords}
      columns={columnsData}
      rowSelection={rowSelection}
      onRow={(row) => ({
        onClick: () => {
          localStorage.setItem("csRoleId", row['csRoleId']);
          history.push(`/others/window/RoleDetails`);
        },
      })}
    />
  </div>
  );
};

export default UserWindowLines;
