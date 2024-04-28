import React, { useState } from "react";
import { Button, Modal, Card, Row, Col, Form, Input, Result, message, Skeleton } from "antd";
import { CloseOutlined } from '@ant-design/icons'
import { getEmailData, getPrintTemplate, sendEmailFun } from "../../../../services/generic";
import { Document, Page, pdfjs } from "react-pdf";
import { useGlobalContext } from "../../../../lib/storage";
import mailIcon from "../../../../assets/images/maillicon.svg"

import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import "./style.css"
import { useHistory } from "react-router-dom";


const EmailTemplate = (props) => {
  const history = useHistory();
  const fileDownloadUrl = process.env.REACT_APP_fileDownloadUrl
  const { globalStore } = useGlobalContext();
  const { selectedHistoryRecord, emailConfig, recordId } = props;
  const windowId = emailConfig.windowId
  const headerTabId = emailConfig.headerTabId
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMailSuccessModal, setIsMailSuccessModal] = useState(false);
  const [emailBody, setEmailBody] = useState("");
  const [emailCc, setEmailCc] = useState("");
  const [emailFrom, setEmailFrom] = useState("no-reply@noton.dev");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailReplyTo, setEmailReplyTo] = useState("");
  const [emailAttachment, setEmailAttachment] = useState("");
  const [editHtml, setEditHtml] = useState('')
  const [emailSuccessFailedMessage, setEmailSuccessFailedMessage] = useState("");
  const [emailSuccessFailedStatus, setEmailSuccessFailedStatus] = useState("");
  const [loading, setLoading] = useState(false)


  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [form] = Form.useForm();

  let urlForEmailPdf = `${fileDownloadUrl}`.concat(`${emailAttachment}`);

  const printTemplate = async () => {
    form.resetFields();
    setIsModalVisible(true);
    setLoading(true)

    try {
      const emailData = await getEmailData(windowId, recordId);
      const getEmailTemplateValues = JSON.parse(emailData.data.data.getEmailData);
      const getPdfName = await getPrintTemplate(windowId,headerTabId, recordId);
      let pdfName = getPdfName.data.data.reportTemplate;
      setEmailBody(getEmailTemplateValues["body"]?.replaceAll(/(<([^>]+)>)/ig, ''));
      setEmailCc(getEmailTemplateValues["cc"]);
      setEmailFrom(getEmailTemplateValues["from"]);
      setEmailSubject(getEmailTemplateValues["subject"]);
      setEmailTo(getEmailTemplateValues["toEmail"]);
      setEmailReplyTo(getEmailTemplateValues["replyTo"]);
      setEmailAttachment(pdfName);
      setLoading(false)
    } catch (error) {
      console.error("Error", error);
    }
  };

  const successNotification = (title, message) => () => {
    //setEmailSuccessFailedTitle(title)
    setEmailSuccessFailedMessage(message);
    setIsMailSuccessModal(true);
  };


  const handleOk = () => {
    form.submit();
    // setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancelForEmail = () => {
    setIsMailSuccessModal(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const sendEmail = await sendEmailFun(values);

      const messageCode = sendEmail.data.data.sendEmail.messageCode;
      const Title = sendEmail.data.data.sendEmail.title;
      const Message = sendEmail.data.data.sendEmail.message;
      if (messageCode === '200') {
        setEmailSuccessFailedStatus("success");
        setIsModalVisible(false);
        form.resetFields();
        successNotification(Title, Message);
        message.success(Message)
      } else {
        message.error(Message)
        setEmailSuccessFailedStatus("error");
        successNotification(Title, Message);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const onQuillchange = value => {
    setEditHtml(value)
  }

  return (
    <span>
      <Button
       id='email'
        onClick={printTemplate} disabled={selectedHistoryRecord?.status !== "CO"} style={{ border: 'none', padding: '0px', background: 'none' }}>
        <img alt="filter" width="25px" height="15px" src={mailIcon} style={{ cursor: "pointer", marginBottom: '4px' }} />
      </Button>
      &emsp;
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width="87%"
        height="94%"
        centered
        title={<>
          <h2 style={{ fontWeight: 'bold', width: '180px', fontStyle: 'normal', float: 'left' }}>Notify by Email</h2>
          <span style={{ float: 'right' }}><CloseOutlined onClick={() => { setIsModalVisible(false) }} /></span>
        </>}
        closable={false}
        bodyStyle={{ padding: "0px" }}
        footer={[
          <span
            style={{ color: '#0C173A', fontWeight: 700, cursor: 'pointer' }}
            onClick={handleCancel}
          >
            Cancel
          </span>,
          <Button
            style={{ backgroundColor: "#0C173A", color: "white", width: "88px", height: "36px", marginLeft: '31px', fontWeight: 700, borderRadius: '4px' }}
            key="submit"
            onClick={handleOk}
          >
            Send
          </Button>,
        ]}
      >
        <br />
        <Skeleton active paragraph={{ rows: 10 }} loading={loading}>
          <Form layout="vertical" name="control-hooks" style={{ padding: "15px" }} form={form} onFinish={onFinish}>
            <Row>
              <Col style={{ padding: "10px" }} span={emailAttachment === '' ? 24 : 10}>
                <Row style={{ paddingBottom: "16px" }}>
                  <Col style={{ paddingRight: "8px" }} span={12}>
                    <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12, fontFamily: "Inter" }}>Form</span>} name="from" initialValue={'no-reply@noton.dev'}>
                      <Input style={{ fontWeight: 600, opacity: 0.7, border: "1px solid #D3D3D3", borderRadius: "3px" }} />
                    </Form.Item>
                  </Col>

                  <Col style={{ paddingLeft: "8px" }} span={12}>
                    <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12, fontFamily: "Inter" }}>Reply To</span>} name="replyTo" initialValue={emailReplyTo}>
                      <Input style={{ fontWeight: 600, opacity: 0.7, border: "1px solid #D3D3D3", borderRadius: "3px" }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{ paddingBottom: "16px" }}>
                  <Col style={{ paddingRight: "8px" }} span={12}>
                    <Form.Item
                      label={<span style={{ fontWeight: 600, fontSize: 12, fontFamily: "Inter" }}>To</span>}
                      name="to"
                      rules={[
                        {
                          type: "email",
                          message: "The input is not valid E-mail!",
                        },
                        {
                          required: true,
                          message: "Please input your E-mail!",
                        },
                      ]}
                      initialValue={emailTo}
                    >
                      <Input style={{ fontWeight: 600, opacity: 0.7, border: "1px solid #D3D3D3", borderRadius: "3px" }} />
                    </Form.Item>
                  </Col>
                  <Col style={{ paddingLeft: "8px" }} span={12}>
                    <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12, fontFamily: "Inter" }}>Cc</span>} name="cc" initialValue={emailCc}>
                      <Input style={{ fontWeight: 600, opacity: 0.7, border: "1px solid #D3D3D3", borderRadius: "3px" }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{ paddingBottom: "16px" }}>
                  <Col span={24}>
                    <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12, fontFamily: "Inter" }}>Subject</span>} name="subject" initialValue={emailSubject}>
                      <Input style={{ fontWeight: 600, opacity: 0.7, border: "1px solid #D3D3D3", borderRadius: "3px" }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row style={{ paddingBottom: "16px" }}>
                  <Col span={24}>
                    <Form.Item name="body" label={<span style={{ fontWeight: 600, fontSize: 12, fontFamily: "Inter" }}>Body</span>} initialValue={emailBody || ''}>
                      <ReactQuill
                        // initialValue={}
                        value={editHtml}
                        onChange={onQuillchange}
                        theme="snow"
                        modules={{
                          toolbar: [
                            [{ font: [false, "serif", "monospace"] }, { header: [1, 2, 3, 4, 5, 6, false] }],
                            ["bold", "italic", "underline", "strike", "blockquote"],
                            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                            [{ align: [] }],
                            ["code", "background"],
                            ["code-block", "direction"],
                            ["link", "image", "video"],
                            ["clean"],
                          ],
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12, fontFamily: "Inter" }}>Attachment</span>} name="attachment" initialValue={emailAttachment}>
                      <Input style={{ fontWeight: 600, opacity: 0.7, border: "1px solid #D3D3D3", borderRadius: "3px" }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col style={{ padding: "10px" }} span={emailAttachment === '' ? 0 : 14}>
                <div style={{ position: "relative", top: "7px", maxHeight: "76vh", overflowY: 'scroll', overflowX: "hidden" }}>
                  <strong>Attachment Preview</strong>
                  <div style={{ position: "relative", top: "-4px", padding: '5px' }}>
                    <Card bodyStyle={{ padding: "0px", width: "614px" }}>
                      <div style={{ padding: '5px' }}>
                        <Document file={urlForEmailPdf} width="100">
                          <Page pageNumber={1} />
                        </Document>
                        <p>
                          Page {1} of {2}
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Skeleton>
      </Modal>
      <Modal width="36%" bodyStyle={{ height: "35%" }} style={{ top: "13rem" }} visible={isMailSuccessModal} footer={[]} /*  onOk={handleOk} */ onCancel={handleCancelForEmail}>
        <Result
          status={emailSuccessFailedStatus}
          title={emailSuccessFailedStatus === "success" ? emailSuccessFailedMessage : ""}
          subTitle={emailSuccessFailedStatus === "error" ? emailSuccessFailedMessage : ""}
        />
      </Modal>
    </span>
  );
};

export default EmailTemplate;
