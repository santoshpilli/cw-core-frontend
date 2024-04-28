import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Dropdown, Menu, notification, Spin, Modal, Table, Row, Col, Button, AutoComplete, Input, Card, Form, Select, Checkbox, Tabs } from "antd";
import { useGlobalContext } from "../../../lib/storage";
import { updateRoleAccess } from "../../../services/generic";
import { LoadingOutlined } from "@ant-design/icons";
import InvoiceLogo from "../../../assets/images/invoice.svg";
import "antd/dist/antd.css";
import ThemeJson from "../../../constants/UIServer.json"

const UserWindowHeader = (props) => {
    const history = useHistory();
    const { globalStore } = useGlobalContext();
    const Themes = ThemeJson;


    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();
    






    const responsiveDesignForColumn = {
        xxl: 12,
        xl: 12,
        lg: 12,
        xs: 12,
        sm: 12,
        md: 12,
    };
   

 
    const onFinish = async (values) => {
        let roleName = values.roleName;
        let description = values.description;
        let menuId = values.menuId;


const roleAccess ={
    "roleName":roleName,
    "description": description,
    "window": []
  }
  const finalRoleAccess = JSON.stringify(JSON.stringify(roleAccess))
const createNewRole=await updateRoleAccess(finalRoleAccess)


if (createNewRole.messageCode == 200) {
    notification.success({
        message: createNewRole.message,
    });
    localStorage.setItem("csRoleId", createNewRole.csRoleId);
    // history.push(`/window/others/roleDetails`);
    history.push(`/others/window/RoleDetails`);
} else {
    notification.info({
        message: createNewRole.message,
    });
}
      
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            form.submit();
          })
    };


    return (
        <div>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
                <Row>
                    <Col {...responsiveDesignForColumn}>
                        <img src={InvoiceLogo} alt="invoice" align="left" /> <p style={Themes.contentWindow.ListWindowHeader.listWindowTitle}> &ensp;Role-Details</p>
                    </Col>

                   
                        <Col {...responsiveDesignForColumn}>

                           
                            <Button type="default" onClick={handleOk} htmlType="submit" style={Themes.contentWindow.ListWindowHeader.newButtonForlist}>
                                Save
                            </Button>

                            <Button
                                type="default"
                                onClick={() => {
                                    history.push(`/others/window/7199`);
                                }}
                                style={{
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    height: "2rem",
                                    width: "5.4rem",
                                    border: "0.25px solid rgb(7, 136, 141)",
                                    borderRadius: "2px",
                                    opacity: 1,
                                    fontWeight: 500,
                                    margin: "0px 5px 0px 0px",
                                    float: "right",
                                }}

                            /* style={Themes.contentWindow.ListWindowHeader.newButtonForlist} */
                            >
                                Cancel
              </Button>

                        </Col>
                   

                </Row>
                <Card style={Themes.contentWindow.recordWindow.RecordHeader.headerCard}>
                    <Form layout="vertical" name="control-hooks" form={form} onFinish={onFinish}>
                        <Row gutter={16}>
                            <Col span={6}>
                                <Form.Item 
                                label="Role Name"
                                 name="roleName"
                                 rules={[
                                    {
                                      required: true,
                                      message: 'Please enter role name!',
                                    },
                                  ]}
                                 >
                                    <Input placeholder="Role Name" />
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Form.Item label="Description" name="description">
                                    <Input placeholder="Description" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Menu Id" name="menuId">
                                    <Input placeholder="Menu Id" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <br />
                    </Form>
                </Card>
             
            </Spin>
        </div>
    );
};

export default UserWindowHeader;
