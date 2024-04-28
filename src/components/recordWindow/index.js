import React, { useState } from "react";
import { Card, Spin,Col } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useGlobalContext } from "../../lib/storage";
import RecordHeader from "./RecordHeader";
import RecordLines from "./RecordLines";
import RecordTitle from "./RecordTitle";
import Scrollbars from "react-custom-scrollbars";
import ThemeJson from "../../constants/UIServer.json"

const RecordWindow = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isHeaderActive, setIsHeaderActive] = useState(false);
  const [headerRecordData, setHeaderRecordData] = useState({});
  const [loadingRecordWindow, setLoadingRecordWindow] = useState(false);
  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: "#c1c1c1",
      borderRadius: "5px",
      width: "8px",
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const renderView = ({ style, ...props }) => {
    const viewStyle = {
      color: "#00000",
    };
    return <div className="box" style={{ ...style, ...viewStyle }} {...props} />;
  };

  return (
    <Card  bodyStyle={{padding:"10px 0 0 0"}}>
       <Scrollbars
               style={{
                // marginLeft:'1.5px',
                // height:"auto",
                transition: 'height 0.3s',
                boxShadow:" 0px 2px 2px 0px #0000001A"
              }}
              autoHeight
              autoHeightMax="79vh"
              hidden={false}
              hideTracksWhenNotNeeded={true}
              universal
              thumbSize={90}
              renderView={renderView}
              renderThumbHorizontal={renderThumb}
              renderThumbVertical={renderThumb}
            >
      <Spin indicator={<LoadingOutlined className="spinLoader" style={Themes.contentWindow.mainCard} spin />} spinning={loadingRecordWindow}>
        {/* <RecordTitle lastRefreshed={lastRefreshed} setLastRefreshed={setLastRefreshed} headerRecordData={headerRecordData} isHeaderActive={isHeaderActive} {...props} /> */}
        <RecordHeader
          setIsHeaderActive={setIsHeaderActive}
          headerRecordData={headerRecordData}
          isHeaderActive={isHeaderActive}
          lastRefreshed={lastRefreshed}
          setLastRefreshed={setLastRefreshed}
          setHeaderRecordData={setHeaderRecordData}
          loadingRecordWindow={loadingRecordWindow}
          setLoadingRecordWindow={setLoadingRecordWindow}
          {...props}
        />
        <RecordLines
          isHeaderActive={isHeaderActive}
          lastRefreshed={lastRefreshed}
          setLastRefreshed={setLastRefreshed}
          headerRecordData={headerRecordData}
          loadingRecordWindow={loadingRecordWindow}
          setLoadingRecordWindow={setLoadingRecordWindow}
          {...props}
        />
      </Spin>
      </Scrollbars>
     </Card>
  );
};

export default RecordWindow;
