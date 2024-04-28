import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Button, AutoComplete, Input } from "antd";
import { useWindowContext, useGlobalContext } from "../../../lib/storage";
import InvoiceLogo from "../../../assets/images/invoice.svg";
import "antd/dist/antd.css";
import ThemeJson from "../../../constants/UIServer.json"

const UserWindowHeader = (props) => {
  const { setSearchKey, setLastRefreshed } = props;
  const history = useHistory();
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const [searchInput, setSearchInput] = useState("");


  const getSearchData = (e) => {
    const searchValue = e.target.value;
    setSearchInput(searchValue);
    setSearchKey(searchValue);
  }

  const refreshData = () => {
    setLastRefreshed(new Date());
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
              value={searchInput}
              onChange={getSearchData}
              suffix={<i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.contentWindow.ListWindowHeader.listSearch} />}
            />
          </AutoComplete>
        </Col>
      </Row>
      <p style={{marginBottom:'8px'}} />
    </div>
  );
};

export default UserWindowHeader;
