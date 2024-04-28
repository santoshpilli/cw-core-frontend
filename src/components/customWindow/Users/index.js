import React, { useState, Fragment,useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Button, AutoComplete, Input,Table,message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useGlobalContext } from "../../../lib/storage";
import InvoiceLogo from "../../../assets/images/invoice.svg";
import "antd/dist/antd.css";
import { getCustomUsersData,deleteUserData } from "../../../services/generic";
import ThemeJson from "../../../constants/UIServer.json"

const ListWindow = () => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [dataSourceRecords, setDataSourceRecords] = useState([]);
  const [dataSourceRecordsCopy,setDataSourceRecordsCopy] = useState([])
  const [recordToDelete,setRecordToDelete]= useState([])
  const [value, setValue] = useState('');
  const [firstNameArray,setFirstNameArray] = useState([])
  const [lastNameArray,setLastNameArray] = useState([])
  const [nameArray,setNameArray] = useState([])
  const [usernameArray,setusernameArray] = useState([])
  const [emailArray,setemailArray] = useState([])

  const columnsData = [

    {
      title: 'First Name',
      dataIndex: 'firstname',
      filters: firstNameArray,
      onFilter: (value, record) => record.firstname === null || record.firstname === undefined || record.firstname === "" ? null : record.firstname.includes(value),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastname',
      filters: lastNameArray,
      onFilter: (value, record) => record.lastname === null || record.lastname === undefined || record.lastname === "" ? null : record.lastname.includes(value),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      filters: nameArray,
      onFilter: (value, record) => record.name === null || record.name === undefined || record.name === "" ? null : record.name.includes(value),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      filters: usernameArray,
      onFilter: (value, record) => record.username === null || record.username === undefined || record.username === "" ? null : record.username.includes(value),
    },
    {
      title: 'Active',
      dataIndex: 'isactive',
      render: text => <span>{text === "Y" ? <i class="fa fa-check" aria-hidden="true" /> : <i class="fa fa-times" aria-hidden="true" />}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      filters: emailArray,
      onFilter: (value, record) => record.email === null || record.email === undefined || record.email === "" ? null : record.email.includes(value),
    },
  ]

  
  useEffect(() => {
    getData()
  }, [])

const getData = async() =>{
  setLoading(true);
    const getDataResponse = await getCustomUsersData();
    for (let index = 0; index < getDataResponse.length; index++) {
      getDataResponse[index].key = getDataResponse[index].csUserId;
    }
    setDataSourceRecords([...getDataResponse]);
    setDataSourceRecordsCopy([...getDataResponse])
    let firstNameArray=[]
    let lastNameArray=[]
    let NameArray = []
    let userNameArray= []
    for (let index = 0; index < getDataResponse.length; index++) {
      const firstname = getDataResponse[index].firstname;
      const lastname = getDataResponse[index].lastname;
      const name = getDataResponse[index].name;
      const username = getDataResponse[index].username;
      const email = getDataResponse[index].email;
      if(firstname != null || firstname != undefined){
        firstNameArray.push(
          {
          text: firstname,
          value: firstname,
          key:getDataResponse[index].csUserId
          }
        ) 
      }
      if(lastname === null || lastname === undefined || lastname === ""){
      }else{
        lastNameArray.push(
          {
          text: lastname,
          value: lastname,
          key:getDataResponse[index].csUserId
          }
        ) 
      }
      if(name === null || name === undefined || name === ""){
      }else{
        NameArray.push(
          {
          text: name,
          value: name,
          key:getDataResponse[index].csUserId
          }
        ) 
      }
      if(username === null || username === undefined || username === ""){
      }else{
        userNameArray.push(
          {
          text: username,
          value: username,
          key:getDataResponse[index].csUserId
          }
        ) 
      }
      if(email === null || email === undefined || email === ""){
      }else{
        emailArray.push(
          {
          text: email,
          value: email,
          key:getDataResponse[index].csUserId
          }
        ) 
      }
    }
    const ids = firstNameArray.map(o => o.text)
    const filtered = firstNameArray.filter(({text}, index) => !ids.includes(text, index + 1))

    const ids2 = lastNameArray.map(o => o.text)
    const filteredlastNameArray = lastNameArray.filter(({text}, index) => !ids2.includes(text, index + 1))

    const ids3 = NameArray.map(o => o.text)
    const filteredNameArray = NameArray.filter(({text}, index) => !ids3.includes(text, index + 1))

    const ids4 = userNameArray.map(o => o.text)
    const filtereduserNameArray = userNameArray.filter(({text}, index) => !ids4.includes(text, index + 1))

    const ids5 = emailArray.map(o => o.text)
    const filteredEmailArray = emailArray.filter(({text}, index) => !ids5.includes(text, index + 1))

    setFirstNameArray(filtered)
    setLastNameArray(filteredlastNameArray)
    setNameArray(filteredNameArray)
    setusernameArray(filtereduserNameArray)
    setemailArray(filteredEmailArray)
    setLoading(false);
}
const  onSelectChange = (e) =>{
  setRecordToDelete(e)
  }

const deleteUser = async () =>{
  if(recordToDelete.length >1){
    message.error("Can not delete more than one user!")
  }else{
    setLoading(true)
    const deleteUserResponse = await deleteUserData(recordToDelete)
    if(deleteUserResponse.messageCode === '200'){
      setLoading(false)
      message.success(deleteUserResponse.message)
      setRecordToDelete([])
      getData()
    }else{
      setLoading(false)
      message.error(deleteUserResponse.title)
      setRecordToDelete([])
      getData()
    }
  }
}
  const rowSelection = {
    onChange: onSelectChange,
  };

  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 12,
    sm: 12,
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
    <Fragment>
      <div>
      <Row>
        <Col {...responsiveDesignForColumn}>
          <img src={InvoiceLogo} alt="invoice" align="left" /> <p style={Themes.contentWindow.ListWindowHeader.listWindowTitle}> &ensp;User</p>
        </Col>
        <Col {...responsiveDesignForColumn}>
          <Button onClick={() => { history.push(`/others/window/userDetails`); /* setWindowStore({ userRecordData: {}, saveUserButton: { "saveButton": true } }); */ localStorage.setItem("csUserId", undefined) }} style={Themes.contentWindow.ListWindowHeader.newButtonForlist}>
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
                  entry.username !== null && entry.username.toLowerCase().includes(currValue.toLowerCase()) ||
                  entry.firstname !== null && entry.firstname.toLowerCase().includes(currValue.toLowerCase()) 
                );
                setDataSourceRecords(filteredData);
              }}
              suffix={<i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.contentWindow.ListWindowHeader.listSearch} />}
            />
          </AutoComplete>
        </Col>
        <Col {...responsiveSearch} />
        <Col {...responsiveSearch} />
        <Col {...responsiveSearch} style={{textAlign:'right',marginTop:'0.5%'}}>
        {recordToDelete.length >0 ? <span style={{ float: 'right' }}>
                <Button style={{ height: '30px', marginRight: '8px' }} onClick={deleteUser}>
                  <i
                    style={{ fontWeight: '600' }}
                    className="lnr lnr-trash"
                  />
                </Button>
              </span> : ''}
        </Col>
      </Row>
      <p style={{marginBottom:'8px'}} />
    </div>
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
          localStorage.setItem("csUserId", row['csUserId']);
          history.push(`/others/window/userDetails`);
        },
      })}
    />
    </Fragment>
  );
};

export default ListWindow;
