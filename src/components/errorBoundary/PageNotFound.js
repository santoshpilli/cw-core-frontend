import React from "react";
import { Result } from "antd";

const PageNotFound = () => {
  return (
    <div style={{ margin: "0", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
      <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />
    </div>
  );
};

export default PageNotFound;
