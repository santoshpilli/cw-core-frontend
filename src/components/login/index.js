import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Col, Spin, Row } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useGlobalContext } from "../../lib/storage";
import { getUser, get360MenuList, getUserPreferencesData, updateLocalToken, getGlobalParameters } from "../../services/generic";
import { updateCustomLocalToken } from "../../services/custom";
import loginLogo from "../../assets/images/NewLogoCW.svg";
import "antd/dist/antd.css";
import "../../styles/app.css";
import "./login.css";
import ThemeJson from "../../constants/UIServer.json";
import Axios from "axios";
// import { tamURL } from "../../constants/serverConfig";
import { getOAuthHeaders } from "../../constants/oAuthValidation";

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const tamURL = process.env.REACT_APP_tamURL;
  const { globalStore, setGlobalStore } = useGlobalContext();
  const history = useHistory();
  // let token = JSON.parse(localStorage.getItem("authTokens"));

  useEffect(async () => {
    const { authTokensFlag } = globalStore;
    if (authTokensFlag) {
      let userApps = JSON.parse(localStorage.getItem("userApps"));
      localStorage.setItem("sideMenuData", JSON.stringify(userApps));
      setGlobalStore({ sideMenuData: userApps });
      history.push("/");
    } else {
      setLoading(true);
      // if (email) {
      //   Axios({
      //     url: 'https://services.plg1.cwsuite.com/core/plg/getAuthToken',
      //     method: 'POST',
      //     crossDomain: true,
      //     data: {
      //       "username": email,
      //     }
      // }).then(async res => {
      // if (res.status === 200) {
      setGlobalStore({ authTokens: null, userData: null, sideMenuData: null, userPreferences: null, globalPreferences: null, windowTabs: [] });
      // try {
      // const resTokenData = await getToken(username, password);
      // localStorage.setItem("authTokens", JSON.stringify(res.data.authToken));
      let userApps = JSON.parse(localStorage.getItem("userApps"));
      // if (access_token === undefined && refresh_token === undefined && email === undefined) {
      //   window.location.assign(`${SSOURL}?&redirect_uri=${window.location.href}`);
      // } else {
      // localStorage.setItem("authTokens", JSON.stringify(access_token));
      localStorage.setItem("authTokensFlag", true);
      // localStorage.setItem("refreshToken", JSON.stringify(refresh_token));
      // localStorage.setItem("email", email);
      // updateLocalToken();
      // updateCustomLocalToken();
      // const userDataResponse = await getUser(email);
      // // userDataResponse.username = username
      // if (!userDataResponse) {
      //   throw new Error("Invalid User Data Response");
      // }

      // if (userDataResponse.CW360_V2_UI === null || userDataResponse.CW360_V2_UI === undefined) {
      //   userDataResponse.CW360_V2_UI = ThemeJson;
      // } else {
      //   userDataResponse.CW360_V2_UI = JSON.parse(userDataResponse.CW360_V2_UI);
      // }

      // if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      //   userDataResponse.CW360_V2_UI = ThemeJson;
      // }
      // localStorage.setItem("userData", JSON.stringify(userDataResponse));
      const userDataResponse = JSON.parse(localStorage.getItem("userData"));
      const userPreferencesResponse = JSON.parse(localStorage.getItem("userPreferences"));
      const globalParametersResponse = JSON.parse(localStorage.getItem("globalParameters"))

      // const userPreferencesResponse = await getUserPreferencesData();
      // localStorage.setItem("userPreferences", JSON.stringify(userPreferencesResponse));

      // const globalParametersResponse = await getGlobalParameters();
      // localStorage.setItem("globalParameters", JSON.stringify(globalParametersResponse));

      // let tenantId = localStorage.getItem("tenantId");
      // let body = {
      //   username: email,
      //   tenantId: tenantId
      // };

      // const response = await Axios({
      //   url: `${tamURL}tenant/getUserApps`,
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   data: body
      // });

      // if (response.status === 200) {
      // console.log(response);
      let appId = localStorage.getItem("appId");
      // const menuDataResponse = await get360MenuList(appId);
      // localStorage.setItem("mainSideMenuData", JSON.stringify(menuDataResponse));
      // localStorage.setItem("sideMenuData", JSON.stringify(jsonData));
      localStorage.setItem("sideMenuData", JSON.stringify(userApps));
      let menuDataResponse = JSON.parse(localStorage.getItem(appId));
      // let submenu = [];
      // menuDataResponse.map(item => {
      //   Object.keys(item).map((it) => {
      //     if (it === appId) {
      //       submenu = item[`${it}`]
      //     };
      //   });
      // });
      if (menuDataResponse?.length > 0) {
        menuDataResponse[0]?.children.sort((a, b) => {
          const x = a.seqno !== null ? parseInt(a.seqno) : a.seqno;
          const y = b.seqno !== null ? parseInt(b.seqno) : b.seqno;
          return (x != null ? x : Infinity) - (y != null ? y : Infinity);
        });
        localStorage.setItem("subMenuData", JSON.stringify(menuDataResponse[0]?.children));
      } else {
        localStorage.setItem("subMenuData", JSON.stringify([]));
      };

      setGlobalStore({ authTokensFlag: true, userData: userDataResponse, sideMenuData: userApps, userPreferences: userPreferencesResponse, globalPreferences: globalParametersResponse });
      // setGlobalStore({ authTokens: accessToken, userData: userDataResponse, sideMenuData: jsonData, userPreferences: userPreferencesResponse,globalPreferences:globalParametersResponse });
      // setLoading({ status: false, message: "" });
      setLoading(false);
      const refState = props.location.state;

      if (refState !== undefined && refState.referer.pathname !== "/:appName") {
        history.push(props.location.state.referer.pathname);
      } else {
        history.push("/");
      };
      // };
      //   } catch (error) {
      //     console.error("Login Failed:", error);
      //     if (JSON.parse(JSON.stringify(error)).message === "Request failed with status code 400") {
      //       message.error("Bad credentials, try again");
      //     } else {
      //       message.error("Some thing went wrong, Try again later");
      //     }
      //     // localStorage.clear();
      //     setGlobalStore({ authTokens: null, userData: null, sideMenuData: null, userPreferences: null, windowTabs: [] });
      //     // setLoading({ status: false, message: "" });
      //   }
      // };
      // });
      // };
    };
    // }
  }, []);

  return (
    <div className="mainDiv col-ms-12">
      <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "30px", color: "#0C173A", opacity: 0.9 }} />} spinning={loading}>
        {/* <div className="innerBlock col-ms-10">
        <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "30px", color: "#0C173A", opacity: 0.9 }} />} spinning={loading.status} tip={loading.message}>
          <Row>
            <Col span={2}></Col>
            <Col span={16} offset={4} >
              <img className="cwLoginLogo" src={loginLogo}></img></Col>
            <Col span={2}></Col>
          </Row>
          <Form onFinish={onLogin} onFinishFailed={onLoginInvalid}>
            <Form.Item name="username">
              <Col span={22}>
                <Input className = "usernameInput"style={{ backgroundColor: "#D8DADE", fontSize: "1rem", borderRadius: 5, borderColor: "#D8DDE6", marginTop: "5%", marginLeft: "1.2em", height: "3.7em" }} placeholder="Username" />
              </Col>
            </Form.Item>
            <Form.Item name="password">
              <Col span={22}>
                <Input.Password visibilityToggle = {false} className="passwordColorBackground" style={{ backgroundColor: "#D8DADE", fontSize: "1rem", borderRadius: 5, borderColor: "#D8DDE6", marginTop: "7.5%", marginLeft: "1.2em", height: "3.7em" }} placeholder="Password" />
              </Col>
            </Form.Item>
            <Form.Item><Col span={22}>
              <Button style={{ backgroundColor: "#A0C838", fontWeight: 600, borderRadius: 5, borderColor: "#D8DDE6", marginTop: "7.5%", letterSpacing: "0.32px", marginLeft: "1.2em", width: "100%", height: "3.7em" }}
                type="primary" htmlType="submit">Login</Button></Col></Form.Item>

            <div className="resetPasswordLog">
              <Row> 
                <Col><h4 style={{ marginLeft: "1.2em" }}>Forgot your password ?</h4></Col>
                <Col><Link style={{ marginLeft: "0.80em" }} to="./NewPassword">Reset Password </Link></Col>
              </Row>
            </div>
          </Form>
        </Spin>
      </div>

      <div className="copyright col-ms-10">
        <Col>
          <h5 style={{ fontSize: "0.85em", textAlign: "center", color: "#FAFAFAE0", fontWeight: 400 }}>This site uses cookies to manage user authentication, analytics, and to provide an improved digital experience. You can learn more about the cookies we use as well as how you can change your cookie settings by clicking here. By continuing to use this site without changing your settings, you are agreeing to our use of cookies. Review CW Suite's Privacy Statement to learn more.</h5>
        </Col>
        </div>

      <div className="col-ms-10">
        <Col>
          <h5 style={{ fontSize: "0.85em", marginTop: "8%", textAlign: "center", color: "#FAFAFAE0", fontWeight: 400 }}>Copyright 2020 CW Suite | All Rights Reserved</h5>
        </Col>
        </div> */}

      </Spin>
    </div>
  );
};

export default Login;