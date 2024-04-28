import React from "react";
import { Result, /* Typography */ } from "antd";

/* const { Paragraph, Text } = Typography; */

const ErrorPage = () => {
  return (
    <div style={{ margin: "0", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
      <Result status="500" title="Oops !" subTitle="There was a problem while trying to load this page, please contact support team">
        {/* <Paragraph style={{ textAlign: "center" }}>
          <Text style={{ fontSize: 14 }}>{this.state.error && this.state.error.toString()}</Text>
        </Paragraph>
        <Paragraph style={{ overflowY: "auto", textAlign: "center" }}>
          <details>{this.state.errorInfo.componentStack}</details>
        </Paragraph> */}
      </Result>
    </div>
  );
};

export default ErrorPage;
