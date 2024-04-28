import React, { useState, useEffect, Fragment } from "react";
import { Button, Tabs, Modal, Tooltip } from "antd";
import { useParams } from "react-router-dom";
import { useGlobalContext, useWindowContext } from "../../lib/storage";
import RecordTab from "../window/RecordTab";
import Maximise from "../../assets/images/maximise_Icon.svg";
import Minimise from "../../assets/images/mini_Icon.svg";
import PlusIcon from "../../assets/images/plus_Icon.svg";
import CloseX from "../../assets/images/closeButton.svg"
import Addnew from "../../assets/images/addNewIconTab.svg";
import SearchIcon from "../../assets/images/searchIcon.svg";
// import TreeView from "../../assets/images/tree_View.svg";
// import Addnew from "../../assets/images/addNewIcon.svg";
import "antd/dist/antd.css";
import ThemeJson from"../../constants/UIServer.json";
import "../../styles/app.css";
import "./style.css";
import "../../styles/antd.css";

const { TabPane } = Tabs;

const RecordLines = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const [tabLevels, setTabLevels] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMaximise, setIsMaximise] = useState(true);
  const [isMinimise, setIsMinimise] = useState(false);

  const { recordId } = useParams();

  const { windowStore } = useWindowContext();
  const windowDefinition = { ...windowStore.windowDefinition };

  useEffect(() => {
    let isMounted = true;
    if (windowDefinition.tabs) {
      setTabLevels([]);
      const firstLevelTabs = windowDefinition.tabs.filter((tab) => tab.tablevel === "1");
      firstLevelTabs.sort((p, c) => parseInt(p.seqno) - parseInt(c.seqno));
      firstLevelTabs.map((tab) => {
        return (tab.recordId = recordId);
      });
      if (isMounted) {
        setTabLevels([firstLevelTabs]);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [recordId]);

  const displayAdditionalInfo = (tab, record) => {
    const tabChildTabIds = tab.child_tab_ids;
    if (tabChildTabIds) {
      const localTabLevels = [...tabLevels];
      const removeIndex = localTabLevels.findIndex((ta) => {
        if (ta.findIndex((t) => t.ad_tab_id === tab.ad_tab_id) >= 0) {
          return true;
        } else {
          return false;
        }
      });
      if (removeIndex >= 0) {
        localTabLevels.splice(removeIndex + 1);
        setTabLevels([...localTabLevels]);
      }

      const childTabIds = tabChildTabIds.split(",");
      let childTabs = [];
      childTabIds.map((child) => {
        windowDefinition.tabs
          .filter((t) => t.ad_tab_id === child)
          .map((ch) => {
            childTabs.push(ch);
            return null;
          });
        return null;
      });
      childTabs.sort((p, c) => parseInt(p.seqno) - parseInt(c.seqno));
      childTabs.forEach((tab) => {
        tab.recordId = record.recordId;
        tab.parentTabRecordData = record;
      });
      setTabLevels([...localTabLevels, childTabs]);
    }
  };

  const checkActiveTabs = (i, index) => {
    tabLevels.splice(index + 1);
    setTabLevels([...tabLevels]);
  };

  const onMaximise = () => {
    setIsModalVisible(true);
    setIsMaximise(false);
  };

  const onMinimise = () => {
    setIsMinimise(true);
    setIsMaximise(true);
  };

  const onPlus = () => {
    setIsMinimise(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsMaximise(true);
    props.setLastRefreshed(new Date());
  };

  const operations = (
    <div className="row" style={Themes.contentWindow.recordWindow.linesTab.lineTabIcons}>
      {/*  <Tooltip title="Add New">
        <Button color="primary" style={Themes.contentWindow.recordWindow.linesTab.lineTabIcons.tabIconButtons}>
          <img style={{ position: "absolute", top: "3px", right: "15%", width: "21px", cursor: "pointer" }} src={Addnew} alt="" />
        </Button>
      </Tooltip>
      <Tooltip title="List">
        <Button color="primary" style={Themes.contentWindow.recordWindow.linesTab.lineTabIcons.tabIconButtons} onClick={onPlus}>
          <i className="fa fa-list" style={{ fontSize: "16px", fontWeight: "600", color: "#536C78", paddingTop: "5px" }} />
        </Button>
      </Tooltip>
      <Tooltip title="Tree View">
        <Button color="primary" style={Themes.contentWindow.recordWindow.linesTab.lineTabIcons.tabIconButtons}>
          <img style={{ fontSize: "16px", fontWeight: "600", color: "#536C78", paddingTop: "0px" }} src={TreeView} alt="invoice" />
        </Button>
      </Tooltip> */}
      {/*  {!isMinimise ? (
        <Tooltip title="SearchIcon">
          <Button color="primary" style={Themes.contentWindow.recordWindow.linesTab.lineTabIcons.tabIconButtons}>
            <img src={SearchIcon} style={{ width: "20px" }} alt="" />
          </Button>
        </Tooltip>
      ) : null} */}
      <div className="flex-spreadLines">
        {!isMinimise ? (
          <Tooltip placement="top" title="Minimise">
            <Button color="primary" style={Themes.contentWindow.recordWindow.linesTab.lineTabIcons.tabIconButtons} onClick={onMinimise}>
              <img style={Themes.contentWindow.recordWindow.linesTab.lineTabIcons.tabIconsMinimize} src={Minimise} alt="" />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip placement="bottom" title="PlusIcon">
            <Button color="primary" style={Themes.contentWindow.recordWindow.linesTab.lineTabIcons.tabIconButtons} onClick={onPlus}>
              <img style={Themes.contentWindow.recordWindow.linesTab.lineTabIcons.tabIconsMaximize} src={PlusIcon} alt="" />
            </Button>
          </Tooltip>
        )}

        {isMaximise ? (
          <Tooltip placement="top" title="Maximise">
            <Button color="primary" style={Themes.contentWindow.recordWindow.linesTab.lineTabIcons.tabIconButtons} onClick={onMaximise}>
              <img src={Maximise} style={{ width: "13px" }} alt="" />
            </Button>
          </Tooltip>
        ) : null}
      </div>
    </div>
  );

  const maximumOps = (
    <div className="row" style={Themes.contentWindow.recordWindow.linesTab.lineTabIcons}>
      {/* <Tooltip placement="bottom" title="SearchIcon"> */}
        <Button onClick={handleCancel} color="primary" style={Themes.contentWindow.recordWindow.linesTab.lineTabIcons.tabIconButtons}>
          <img src={CloseX} style={{ width: "2em"}} alt="" />
        </Button>
      {/* </Tooltip>  */}
    </div>
  );

  return (
    <Fragment>
      {tabLevels.length > 0
        ? tabLevels.map((levelTabs, indexes) => (
            <div key={`${indexes}`} style={{
              backgroundColor:"#fff",
              marginBottom: "-20px",
              paddingTop: "0px",
              paddingLeft: "0px",
              paddingRight: "0px",
              paddingBottom: "0px",
            }}>
              {levelTabs.length > 0 ? (
                <Tabs
                  tabBarExtraContent={operations}
                  tabBarStyle={
                    isMinimise
                      ? Themes.contentWindow.recordWindow.linesTab.tabStyle
                      : Themes.contentWindow.recordWindow.linesTab.tabStyle
                  }
                  // type="card"
                  defaultActiveKey="0"
                  onChange={(i) => checkActiveTabs(i, indexes)}
                >
                  {levelTabs.map((data, index) =>
                    data.isactive === "Y" ? (
                      <TabPane tab={data.name} key={`${index}`}>
                        {isMinimise ? null : <RecordTab tabData={data} tabIndex={index} selectRecord={displayAdditionalInfo} {...props} />}
                      </TabPane>
                    ) : null
                  )}
                </Tabs>
              ) : null}
            </div>
          ))
        : null}
      <br />
      <Modal visible={isModalVisible} width="1000px" closable={false} onCancel={handleCancel} maskClosable={false} footer={null} bodyStyle={{padding:0}}>
        {tabLevels.length > 0
          ? tabLevels.map((levelTabs, indexes) => (
              <div
                key={`${indexes}`}
                style={{
                  boxShadow: "rgb(33 33 33 / 20%) 0px 4px 6px 0px",
                  background: "#fff",
                  marginTop: "-8px",
                  marginLeft: "-8px",
                  marginRight: "-8px",
                  marginBottom: "0px",
                }}
              >
                {levelTabs.length > 0 ? (
                  <Tabs
                    tabBarExtraContent={maximumOps}
                    tabBarStyle={Themes.contentWindow.recordWindow.linesTab.tabStyle}
                    // type="card"
                    defaultActiveKey="0"
                    onChange={(i) => checkActiveTabs(i, indexes)}
                  >
                    {levelTabs.map((data, index) => (
                      <TabPane tab={data.name} key={`${index}`}>
                        <RecordTab tabData={data} tabIndex={index} selectRecord={displayAdditionalInfo} {...props} />
                      </TabPane>
                    ))}
                  </Tabs>
                ) : null}
              </div>
            ))
          : null}
      </Modal>
    </Fragment>
  );
};

export default RecordLines;
