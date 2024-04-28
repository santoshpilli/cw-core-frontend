import React from 'react'
import Axios from 'axios';
import { Route, useHistory } from 'react-router-dom';
import { Card, Row, Col, Image, Button, Spin } from "antd";
import first1 from "../../../assets/images/first1.svg"
import { useEffect,useState } from 'react';
// import { genericUrl } from "../../../constants/serverConfig";
import { LoadingOutlined } from '@ant-design/icons';
import { generateToken } from '../../../services/generateToken';
import { getOAuthHeaders } from '../../../constants/oAuthValidation';

const PoSPlG = ()=> {
const history = useHistory();
const [loading,setLoading] = useState(false)
const genericUrl = process.env.REACT_APP_genericUrl;
const [tills,setTills] = useState()
// const username = localStorage.getItem("email")
const authHeaders = getOAuthHeaders();
const token = localStorage.getItem("authTokens")

        useEffect(()=>{
        getTillData()
        },[])

    const getTillData = async () => {
        try {
          setLoading(true);
          // const newToken = JSON.parse(localStorage.getItem("authTokens"));
          const { access_token } = getOAuthHeaders();
          const userData = JSON.parse(localStorage.getItem("userData"));
          const userid = userData.user_id

          const getTillMutation = {
            query: `query {
                comboFill(
                  tableName: "cwr_till"
                  pkName: "cwr_till_id"
                  identifier: "cwr_till_id, search_key, till"
                  whereClause: "cwr_till_id in (select cwr_till_id from cwr_tillaccess where cs_user_id = '${userid}')"
                )
              }`,
          };
          const headers = {
            "Content-Type": "application/json",
            Authorization: `bearer ${access_token}`,
          };
    
          const serverResponse = await Axios.post(genericUrl, getTillMutation, { headers: headers }, { async: true }, { crossDomain: true });
          // console.log(serverResponse.data.data)
          setTills(JSON.parse(serverResponse.data.data.comboFill))
          setLoading(false)
        } catch (error) {
          const { message } = JSON.parse(JSON.stringify(error));
          if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
            // let email = localStorage.getItem("email");
            // let tenantId = localStorage.getItem("tenantId");
            // let appId = localStorage.getItem("appId");
            // let appName = localStorage.getItem("appName");
            // setTimeout(() => {
            //   localStorage.clear();
            //   if (window.location.href.includes("email")) {
            //     window.location.assign(`https://app.cwsuite.com${window.location.href.replace("https://plg1.cwsuite.com", "/")}`)
            //   } else {
            //     window.location.assign(`https://app.cwsuite.com?redirectUrl=${window.location.href}&email=${encodeURIComponent(email)}&tenantId=${encodeURIComponent(tenantId)}&appId=${encodeURIComponent(appId)}&name=${encodeURIComponent(appName)}`);
            //   };
            // }, 1000);
            generateToken();
          } else {
            return Promise.reject(error);
          }
        }
      };
  return (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
        <div style={{ display: "block", textAlign: "center", justifyContent: "center", alignContent: "center" }}>
                <p style={{ fontWeight: 600, color: "#192228" }}>Select below to Open Tills</p>
            </div>
            <Row justify="center" align="middle" style={{ marginTop: "30px" }}>
                {tills?.map(res => (
                    <Col xs={24} sm={12} md={8} lg={6} xl={4} style={{ marginBottom: "30px", textAlign: "center" }}>
                      {/* {console.log(res)} */}
                    <Card key={res.cwr_till_id} style={{ height: 250, width: 250, borderRadius: "5px" }}>
                        <Image src={first1} alt='' preview={false} height={150} width={180} />
                        <p style={{ fontFamily: "Inter", fontWeight: 600, fontSize: "11px", color: "#0C173A" }}>{res.name}</p>
                        <Button onClick={(event)=>{ window.location.assign(`${process.env.REACT_APP_POSURL}?searchKey=${res.search_key}&token=${token}&tillId=${res.cwr_till_id}&username=${authHeaders.email}&nameTill=${res.name}`)}} style={{ backgroundColor: "#0C173A", fontFamily: "Roboto", borderRadius: "5px", fontWeight: 600, fontSize: "11px", width: 180, height: "35px", color: "white" }}>Open</Button>
                    </Card>
                    </Col>
                ))}
                </Row>
        </Spin>
  )
}
export default PoSPlG;