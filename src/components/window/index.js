import React, { useState, useEffect, useReducer, useRef } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import { getWindowDefinition } from "../../services/generic";
import { WindowContext, storeReducer, useGlobalContext } from "../../lib/storage";
import ListWindow from "../listWindow";
import RecordWindow from "../recordWindow";
import ThemeJson from "../../constants/UIServer.json"

import "antd/dist/antd.css";

const Window = () => {
  const { globalStore, setGlobalStore } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [windowStore, setWindowStore] = useReducer(storeReducer, { windowDefinition: {} });
  const { windowId, recordId } = useParams();
  const Themes = ThemeJson;
  const history = useHistory();

  const windowLocationPath = useRef(history.location.pathname);
  const { userPreferences, windowTabs } = globalStore;

  const [windowReferesh, setWindowRefresh] = useState(new Date());
  useEffect(() => {
    if (userPreferences.enableMultiTab !== "Y") {
      setWindowRefresh(new Date());
    }
  }, [windowId]);

  useEffect(() => {
    const defintion = localStorage.getItem("windowDefinitions");
    if (defintion) {
      let definitionParsed = JSON.parse(defintion);
      for (let index = 0; index < definitionParsed.length; index++) {
        if (definitionParsed[index].ad_window_id === windowStore.windowDefinition.ad_window_id) {
          definitionParsed[index] = windowStore.windowDefinition;
        }
      }
      localStorage.setItem("windowDefinitions", JSON.stringify(definitionParsed));
    }
  }, [windowStore]);

  useEffect(() => {
    if (windowId) {
      (async () => {
        try {
          setLoading(true);
          const windowDefinitionData = await getWindowDefinition(windowId);
          windowDefinitionData.tabs.map((tab) => {
            if (tab.child_tab_ids) {
              const childTabIds = tab.child_tab_ids.split(",");
              childTabIds.map((childTabId) => {
                const tabIndex = windowDefinitionData.tabs.findIndex((inTab) => inTab.ad_tab_id === childTabId);
                if (tabIndex >= 0) {
                  windowDefinitionData.tabs[tabIndex].parent_tab_id = tab.ad_tab_id;
                }
                return null;
              });
            }
            return null;
          });
          setWindowStore({ windowDefinition: windowDefinitionData });
        } catch (error) {
          console.error("Error obtaining window definition: ", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [windowReferesh]);

  useEffect(() => {
    if (userPreferences.enableMultiTab === "Y" && history.location.pathname.search(`/window/${windowId}`) >= 0) {
      if (windowTabs.length > 0) {
        const localwindowTabs = [...windowTabs];
        const tabIdx = localwindowTabs.findIndex((tab) => tab.url === windowLocationPath.current);
        if (tabIdx >= 0) {
          localwindowTabs[tabIdx].url = history.location.pathname;
          setGlobalStore({ windowTabs: [...localwindowTabs] });
        }
      }
      windowLocationPath.current = history.location.pathname;
    }
  }, [history.location.pathname]);

  return (
    <WindowContext.Provider value={{ windowStore, setWindowStore }}>
      <Spin indicator={<LoadingOutlined className="spinLoader" style={Themes.contentWindow.mainCard} spin />} spinning={loading}>
        {loading ? null : recordId && windowId ? <RecordWindow /> : <ListWindow />}
      </Spin>
    </WindowContext.Provider>
  );
};

export default Window;
