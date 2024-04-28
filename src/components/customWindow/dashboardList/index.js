import React, { useState, useEffect } from "react";
import { Col, Row, Card, Input } from "antd";
import { useHistory } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { useGlobalContext } from "../../../lib/storage";
import DashboardNoImage from "../../../assets/images/no-image.jpg";
import ThemeJson from "../../../constants/UIServer.json"
const { Meta } = Card;

const DashboardList = () => {
  const history = useHistory();
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const menuList = globalStore.sideMenuData;
  const [menuData, setMenuData] = useState([]);
  const [dashBoardSearchInput, setDashBoardSearchInput] = useState("");

  useEffect(() => {
    if (menuList) {
      try {
        menuList.sort((a, b) => (a.seqno != null ? parseInt(a.seqno) : Infinity) - (b.seqno != null ? parseInt(b.seqno) : Infinity));
        menuList.map((item, index) => {
          if (item.children && item.children.length > 0) {
            item.children.sort((a, b) => (a.seqno != null ? parseInt(a.seqno) : Infinity) - (b.seqno != null ? parseInt(b.seqno) : Infinity));
          }
          menuList[index] = item;
          return null;
        });
        setMenuData(menuList);
        //
      } catch (error) {
        console.error("Failed to set menu data: ", JSON.stringify(error, null, 2));
      }
    }
  }, []);

  const handleSearchInput = (value) => {
    setDashBoardSearchInput(value);
  };

  const dashBoardNavigate = (key) => {
    history.push(`/analytics/dashboard/${key}`);
  };

  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 12,
    sm: 12,
    md: 12,
  };

  const dashboardTitle = {
    marginBottom: 20,
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "-0.28px",
    color: "#313131",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  };

  const getDashboardFilteredMenuData = (menuParam, filterKey) => {
    return menuParam.filter((menu) => {
      if (menu.children) {
        const subChildren = menu.children.filter(
          (c) =>
            c.type === filterKey &&
            (dashBoardSearchInput.length > 0 ? c.title.replace(/\s/g, "").toLowerCase().indexOf(dashBoardSearchInput.replace(/\s/g, "").toLowerCase()) > -1 : true)
        );
        return subChildren.length > 0;
      } else {
        return false;
      }
    });
  };

  const getDashboardFilteredSubMenuData = (menuParam, filterKey) => {
    return menuParam.filter(
      (c) =>
        c.type === filterKey &&
        (dashBoardSearchInput.length > 0 ? c.title.replace(/\s/g, "").toLowerCase().indexOf(dashBoardSearchInput.replace(/\s/g, "").toLowerCase()) > -1 : true)
    );
  };

  return (
    <div
      style={{
        paddingLeft: 5,
      }}
    >
      <Row style={{ paddingBottom: "10px" }}>
        <Col {...responsiveDesignForColumn}>
          <div style={{ fontSize: "20px", fontWeight: "600" }}>Dashboards</div>
        </Col>
        <Col {...responsiveDesignForColumn} style={{ textAlign: "right" }}>
          <Input
            showSearch
            style={{ width: "50%", textAlign: "left" }}
            suffix={<i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.sideMenu.sideMenuSearchIcon} />}
            onChange={(e) => handleSearchInput(e.target.value)}
            value={dashBoardSearchInput || ""}
            placeholder="Search..."
            showArrow={false}
            className="search-arrow placeHolder"
          />
        </Col>
      </Row>
      <div>
        <Scrollbars
          style={{
            height: "84vh",
          }}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          thumbSize={90}
        >
          {getDashboardFilteredMenuData(menuData, "Dashboard").map((menu) => (
            <>
              <p style={{ marginBottom: 5, fontSize: "12px", letterSpacing: "0px", color: "#9E9E9E" }}>{`${menu.title}`}</p>
              {menu.children ? (
                <Row style={{ marginBottom: 10 }}>
                  {getDashboardFilteredSubMenuData(menu.children, "Dashboard")
                    .sort((a, b) => (a.title > b.title ? 1 : -1))
                    .map((subMenuItem, index) => (
                      <Col span={4} style={{ marginRight: 10, marginBottom: 10 }}>
                        <Card
                          hoverable
                          style={{ border: "1px solid #BCBCBC", borderRadius: "3px" }}
                          cover={<img alt="dashboards" style={{ border: "1px solid #BCBCBC", borderRadius: "3px" }} src={subMenuItem.imageURL == null || subMenuItem.imageURL == undefined ? DashboardNoImage : subMenuItem.imageURL} />}
                          key={`${subMenuItem.key}-${index}`}
                          onClick={() => dashBoardNavigate(subMenuItem.id)}
                        >
                          <Meta title={<p style={dashboardTitle}>{subMenuItem.title}</p>} />
                        </Card>
                      </Col>
                    ))}
                </Row>
              ) : null}
            </>
          ))}
        </Scrollbars>
      </div>
    </div>
  );
};

export default DashboardList;
