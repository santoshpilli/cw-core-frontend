import React, { useState, useEffect } from "react";
import { Col, Row, Card, Input, List } from "antd";
import { useHistory } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import ThemeJson from "../../../constants/UIServer.json"
import { useGlobalContext } from "../../../lib/storage";

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

  const onReports = (subMenuItem) => {
    history.push(`/reports/report/${subMenuItem.id}`);
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

  const getReportFilteredMenuData = (menuParam, filterKey) => {
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

  const getReportFilteredSubMenuData = (menuParam, filterKey) => {
    return menuParam.filter(
      (c) =>
        c.type === filterKey &&
        (dashBoardSearchInput.length > 0 ? c.title.replace(/\s/g, "").toLowerCase().indexOf(dashBoardSearchInput.replace(/\s/g, "").toLowerCase()) > -1 : true)
    );
  };

  return (
    <div
      style={{
        paddingLeft: 3,
      }}
    >
      <Row style={{ paddingBottom: "10px" }}>
        <Col {...responsiveDesignForColumn}>
          <div style={{ fontSize: "20px", fontWeight: "600" }}>Reports</div>
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
      <Card bodyStyle={{ padding: 10 }} style={{ borderRadius: "4px" }}>
        <Scrollbars
          style={{
            height: "79vh",
          }}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          thumbSize={90}
        >
          <Row>
            {getReportFilteredMenuData(menuData, "Report").map((menu, index) => (
              <>
                {menu.children ? (
                  <Col span={12} style={{ padding: "7px" }}>
                    <Scrollbars
                      style={{
                        height: "23vh",
                      }}
                      autoHide
                      autoHideTimeout={1000}
                      autoHideDuration={200}
                      thumbSize={90}
                    >
                      <List
                        size="small"
                        bordered
                        dataSource={getReportFilteredSubMenuData(menu.children, "Report").sort((a, b) => (a.title > b.title ? 1 : -1))}
                        header={
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              letterSpacing: "0.3px",
                              color: "#D4D4D4",
                            }}
                          >
                            {menu.title}
                          </div>
                        }
                        renderItem={(item) => (
                          <List.Item
                            onClick={() => onReports(item)}
                            style={{
                              fontSize: 12,
                              letterSpacing: "0.3px",
                              color: "#468CC8",
                              cursor: "pointer"
                            }}
                          >
                            {item?.title}
                          </List.Item>
                        )}
                      />
                    </Scrollbars>
                  </Col>
                ) : null}
              </>
            ))}
          </Row>
        </Scrollbars>
      </Card>
    </div>
  );
};

export default DashboardList;
