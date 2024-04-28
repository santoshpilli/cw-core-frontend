import React,{useEffect,useState} from "react";
import { Input, Col, Row, Button, Dropdown, Tooltip, Table, Image } from "antd";
import "antd/dist/antd.css";
import { useHistory } from "react-router";
import {getDesign } from "../../../services/custom";

import "../../../styles/antd.css";

// import { serverUrl } from "../../../../../constants/serverConfig";
import Settings from "../../../assets/images/settingIcon.svg";
import MoreActions from "../../../assets/images/moreActions.svg";
import TreeView from "../../../assets/images/tree_View.svg";
import Export from "../../../assets/images/export.svg";
import QuickAdd from "../../../assets/images/Quickadd.svg";
import DownArrow from "../../../assets/images/arrow-drop-down.svg";
import Reset from "../../../assets/images/reset.svg";
import Summary from "../../../assets/images/summary.svg";
import Selection from "../../../assets/images/selection.svg";
import ShowList from "../../../assets/images/listView.svg";
import ShowAndHide from "../../../assets/images/showandHide.svg";
import Repeat from "../../../assets/images/repeat.svg";
import { index } from "d3";
import useDebounce from "../../../lib/hooks/useDebounce";
// import ListMore from "../../../assets/images/listMoreIcon.svg";
// import Print from "../../../assets/images/print.svg";
// import Filter from "../../../assets/images/filter.svg";
// import Edit from "../../../assets/images/edit.svg";
// import Trash from "../../../assets/images/trash.svg";


const DesignDetails = ({ onClickNew }) => {
  const [dataSource,setDataSource] = useState([])
const [keyValue,setKeyValue] = useState('')

const searchKey = useDebounce(keyValue,500)

  useEffect(()=>{
    getDesignData(searchKey)
  },[searchKey])

  const getDesignData = async (keyValue) => {
    const designDataRes = await getDesign(keyValue,0,100);
    designDataRes.forEach((item) => {
      item.key = item.plmDesignId;
    });
    setDataSource(designDataRes);
  };

  const getData = async (recordId,skip,limit) => {
    const designDataRes = await getDesign(recordId,skip,limit);
    designDataRes.forEach((item) => {
      item.key = item.plmDesignId;
    });
  let finalArry = [...dataSource]
    designDataRes.filter((item,index)=>{
      if (index>dataSource.length){
        finalArry.push(item)
      }
    });
    setDataSource(finalArry)
  };

  const getTabData = (currentPage, page) => {
    let skip = currentPage ;
    let page1 = currentPage*10
    if(currentPage>9){
      let limit = 20 + page1
      getData('',skip,limit)
    }
  };

  const getKeyValue = (e) => {
    setKeyValue(e.target.value)

    // if(e.target.value.length<1){
    //   getData('',0,100)
    // }
    //  getData(e.target.value,'',);

  };
  dataSource.forEach((element) => {
    element.description = element.description?.replaceAll("<div>", "")?.replaceAll("</div>", "");
  });
  const history = useHistory();
  const onClick = () => {
    onClickNew()
    history.push(`/others/window/7447/New_Record`);
  };

  const selectRow = (record) => {
    return {
      onClick: (event) => {
        history.push(`/others/window/7447/${record.plmDesignId}`);
      },
    };
  };

  const onSelectProductData = (e, data) => {
  };

  const rowSelection = {
    onChange: onSelectProductData,
  };

 

  const columns = [
    {
      title: "Design Code",
      dataIndex: "designcode",
      key: "designcode",
      ellipsis: true,
    },

    {
      title: "Design Name",
      dataIndex: "designName",
      key: "designName",
      ellipsis: true,
    },
    {
      title: "Design Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },

    {
      title: "Sketch Reference",
      dataIndex: "sketchName",
      key: "sketchName",
      ellipsis: true,
    },

    { title: "Design Image", dataIndex: "image", key: "image", render: (text) => (text !== "undefined" ? <Image src={text} /> : null) },

    {
      title: "Designed By",
      dataIndex: "disignerName",
      key: "disignerName",
      ellipsis: true,
    },
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      ellipsis: true,
    },
    {
      title: "sub Product",
      dataIndex: "subProductName",
      key: "subProductName",
      ellipsis: true,
    },
  ];

  const responsiveButton = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 24,
    sm: 16,
    md: 12,
  };
  const style1 = {
    fontWeight: "550",
    cursor: "pointer",
    fontSize: "14px",
    color: "rgb(62, 62, 60)",
    fontFamily: "Open Sans",
    textAline: "center",
    paddingLeft: "15px",
  };
  const styleData = {
    background: "#fff",
    border: "0.5px solid #dddbda",
    borderRadius: "5px",
    cursor: "pointer",
    description: "list icon buttons on the right hand side",
    height: "32px",
    marginRight: "4px ",
    paddingLeft: "5px",
    paddingRight: "5px ",
    paddingTop: "6px ",
    width: "33px",
  };
  const dropDownStyle = {
    height: "32px",
    width: "24px",
  };

  const styleForButton = {
    fontSize: "14px",
    borderRadius: "2px",
    fontWeight: "500",
    color: "rgb(255, 255, 255)",
    border: "0.25px solid rgb(7, 136, 141)",
    marginBottom: "8px",
    backgroundColor: "rgb(8 158 164)",
    color: "white",
    width: "93px",
    height: "33px",
  };
  return (
    <>
      <Row>
        <Col span={12} style={{ height: "auto" }}>
          <span
            style={{
              fontSize: "23px",
              color: "rgb(62, 62, 60)",
              fontWeight: "600",
              marginTop: "-5px",
              marginBottom: "0rem",
              width: "auto",
              maxWidth: "200px",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {" "}
            PLM Design
          </span>
        </Col>
        <Col span={12} style={{ height: "auto" }}>
          <span style={{ float: "right" }}>
            <Button onClick={onClick} style={styleForButton}>
              New
            </Button>
          </span>
        </Col>
      </Row>
      <Row>
        <Col span={6} style={{ height: "auto" }}>
          <Input
            onChange={getKeyValue}
            placeholder="Search"
            style={{ cursor: "pointer", color: "lightgray" }}
            suffix={<i className="fa fa-search" role="presentation" aria-hidden="true" />}
          />
        </Col>
        <Col span={6} style={{ height: "auto", display: "flex", alignItems: "center" }}>
          <span style={style1}>Recently Viewed</span>
          <span>
            <img src={DownArrow} alt="img" />
          </span>
        </Col>
        <Col span={12} {...responsiveButton}>
          <div style={{ display: "flex", float: "right" }}>
            <Dropdown trigger={["click"]} style={{ dropDownStyle }}>
              <Tooltip title="Settings" placement="bottom">
                <Button color="primary" style={styleData}>
                  <img style={{ paddingBottom: "6px", width: "20px" }} src={Settings} alt="invoice" />
                </Button>
              </Tooltip>
            </Dropdown>
            <Dropdown trigger={["click"]}>
              <Tooltip title="Summary" placement="bottom">
                <Button color="primary" style={styleData}>
                  <img style={{ paddingBottom: "6px", paddingRight: "1px", width: "11px" }} src={Summary} alt="invoice" />
                </Button>
              </Tooltip>
            </Dropdown>

            <Tooltip title="Kanban View" placement="bottom">
              <Button color="primary" style={styleData} >
                <img style={{ paddingBottom: "6px", width: "16px" }} src={Selection} alt="invoice" />
              </Button>
            </Tooltip>

            <Tooltip title="List View" placement="bottom">
              <Button color="primary" style={styleData}>
                <img style={{ paddingBottom: "6px", width: "19px" }} src={ShowList} alt="invoice" />
              </Button>
            </Tooltip>

            <Tooltip title="Clear Filters" placement="bottom">
              <Button color="primary" style={styleData}>
                <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "20px" }} src={Reset} alt="invoice" />
              </Button>
            </Tooltip>

            <Dropdown trigger={["click"]}>
              <Tooltip title="Show/Hide Columns" placement="bottom">
                <Button color="primary" style={styleData}>
                  <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "16px" }} src={ShowAndHide} alt="invoice" />
                </Button>
              </Tooltip>
            </Dropdown>
            <Tooltip title="Reload" placement="bottom">
              <Button color="primary" style={styleData}>
                <img style={{ paddingBottom: "7px", paddingRight: "2px", width: "18px" }} src={Repeat} alt="invoice" />
              </Button>
            </Tooltip>
          </div>
        </Col>
      </Row>
      <Row>
        <Table
          size="small"
          style={{ marginTop: "8px" }}
          columns={columns}
          dataSource={dataSource}
          sticky={true}
          pagination={{ onChange: getTabData }}
          rowSelection={{ ...rowSelection }}
          onRow={selectRow}
        />
      </Row>
    </>
  );
};
export default DesignDetails;
