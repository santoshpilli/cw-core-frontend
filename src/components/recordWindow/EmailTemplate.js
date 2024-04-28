import React, { useState } from "react";
import { useParams } from "react-router";
import { Button, Modal, Card, Col, Form, Input, Divider, Row, Result, Tooltip, message } from "antd";
import {CloseOutlined} from '@ant-design/icons'
// import { fileDownloadUrl } from "../../constants//serverConfig";
import { getEmailData, getPrintTemplate, sendEmailFun } from "../../services/generic";
import { Document, Page, pdfjs } from "react-pdf";
import { useGlobalContext } from "../../lib/storage";
import Envelop from "../../assets/images/mailDefault.svg";
import EnvelopHover from "../../assets/images/mailHover.svg";
import ReactQuill from "react-quill";
import ThemeJson from "../../constants/UIServer.json"
import "react-quill/dist/quill.bubble.css";
import "./style.css";

const EmailTemplate = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const { headerTabId } = props;
  const { recordId } = useParams();
  const fileDownloadUrl = process.env.REACT_APP_fileDownloadUrl;
  const { windowId } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMailSuccessModal, setIsMailSuccessModal] = useState(false);
  const [emailBody, setEmailBody] = useState("");
  const [emailCc, setEmailCc] = useState("");
  const [emailFrom, setEmailFrom] = useState("no-reply@noton.dev");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailReplyTo, setEmailReplyTo] = useState("");
  const [emailAttachment, setEmailAttachment] = useState("");
  const [editHtml,setEditHtml]= useState('')
  //const [emailSuccessFailedTitle, setEmailSuccessFailedTitle] = useState('');
  const [emailSuccessFailedMessage, setEmailSuccessFailedMessage] = useState("");
  const [emailSuccessFailedStatus, setEmailSuccessFailedStatus] = useState("");
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleIconHover = (iconName) => {
    setHoveredIcon(iconName);
  };

  const handleIconLeave = () => {
    setHoveredIcon(null);
  };

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [form] = Form.useForm();
  const listActionButtons = {
    height: "28px",
    width: "28px",
    background: "#fff",
    border: "0.5px solid #d9d9d9",
    cursor: "pointer",
    marginRight: "5px ",
    // display:"flex",
    borderRadius:"3px",
    justifyContent:"center",
    alignItems:"center",
    description: "list icon buttons on the right hand side"
  }

  let urlForEmailPdf = `${fileDownloadUrl}`.concat(`${emailAttachment}`);

  const printTemplate = async () => {
    form.resetFields();

    try {
      const emailData = await getEmailData(windowId, recordId);

      const getEmailTemplateValues = JSON.parse(emailData.data.data.getEmailData);
      const getPdfName = await getPrintTemplate(windowId,headerTabId, recordId);
      let pdfName = getPdfName.data.data.reportTemplate;
      setEmailBody(getEmailTemplateValues["body"]?.replaceAll( /(<([^>]+)>)/ig, ''));
      setEmailCc(getEmailTemplateValues["cc"]);
      setEmailFrom(getEmailTemplateValues["from"]);
      setEmailSubject(getEmailTemplateValues["subject"]);
      setEmailTo(getEmailTemplateValues["toEmail"]);
      setEmailReplyTo(getEmailTemplateValues["replyTo"]);
      setEmailAttachment(pdfName);
      setIsModalVisible(true);
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

  const onQuillchange=value=>{
    setEditHtml(value)
  }

  return (
    <span>
     <Tooltip  placement="top" title="Email" onMouseEnter={() => handleIconHover('email')} onMouseLeave={handleIconLeave}>
    {/* <Button className="listHeaderButtons" style={listActionButtons}> */}
      <img onClick={printTemplate} style={{cursor:"pointer"}} src={hoveredIcon === "email"?EnvelopHover:Envelop} alt="invoice" /> &nbsp;
      {/* </Button> */}
  </Tooltip>
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width="87%"
        height="94%"
        centered
        title={<>
          <h2 style={{fontWeight:'bold',width:'180px',fontStyle:'normal',float:'left'}}>Notify by Email</h2>
          <span style={{float:'right'}}><CloseOutlined onClick={()=>{setIsModalVisible(false)}}/></span>
          </>}
        closable={false}
        bodyStyle={{ padding: "0px" }}
        footer={[
          <span
          style={{color:'#0C173A',fontWeight:700,cursor:'pointer'}}
           onClick={handleCancel}
         >
           Cancel
         </span>,
          <Button
          style={{ backgroundColor: "#0C173A", color: "white", width: "88px", height: "36px",marginLeft:'31px',fontWeight:700,borderRadius:'4px'}}
            key="submit"
            onClick={handleOk}
          >
            Send
          </Button>,
        ]}
      >
        <br/>
        <Form layout="vertical" name="control-hooks" style={{ padding: "15px" }} form={form} onFinish={onFinish}>
          <Row>
            <Col style={{ padding: "10px" }} span={emailAttachment===''?24:10}>
              <Row style={{ paddingBottom: "16px" }}>
                <Col style={{ paddingRight: "8px" }} span={12}>
                  <Form.Item  label={<span style={{fontWeight:600,fontSize:12,fontFamily:"Inter"}}>Form</span>} name="from"  initialValue={'no-reply@noton.dev'}>
                    <Input  style={{ fontWeight: 600,opacity:0.7,border: "1px solid #D3D3D3",borderRadius: "3px" }}  />
                  </Form.Item>
                </Col>

                <Col style={{ paddingLeft: "8px" }} span={12}>
                  <Form.Item label={<span style={{fontWeight:600,fontSize:12,fontFamily:"Inter"}}>Reply To</span>} name="replyTo" initialValue={emailReplyTo}>
                    <Input style={{ fontWeight: 600,opacity:0.7,border: "1px solid #D3D3D3",borderRadius: "3px" }}  />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ paddingBottom: "16px" }}>
                <Col style={{ paddingRight: "8px" }} span={12}>
                  <Form.Item
                    label={<span style={{fontWeight:600,fontSize:12,fontFamily:"Inter"}}>To</span>}
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
                    <Input style={{ fontWeight: 600,opacity:0.7,border: "1px solid #D3D3D3",borderRadius: "3px" }} />
                  </Form.Item>
                </Col>
                <Col style={{ paddingLeft: "8px" }} span={12}>
                  <Form.Item label={<span style={{fontWeight:600,fontSize:12,fontFamily:"Inter"}}>Cc</span>} name="cc" initialValue={emailCc}>
                    <Input style={{ fontWeight: 600,opacity:0.7,border: "1px solid #D3D3D3",borderRadius: "3px" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ paddingBottom: "16px" }}>
                <Col span={24}>
                  <Form.Item label={<span style={{fontWeight:600,fontSize:12,fontFamily:"Inter"}}>Subject</span>} name="subject" initialValue={emailSubject}>
                    <Input style={{ fontWeight: 600,opacity:0.7,border: "1px solid #D3D3D3",borderRadius: "3px" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row style={{ paddingBottom: "16px" }}>
                <Col span={24}>
                  <Form.Item name="body" label={<span style={{fontWeight:600,fontSize:12,fontFamily:"Inter"}}>Body</span>} initialValue={emailBody||''}>
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
                  <Form.Item label={<span style={{fontWeight:600,fontSize:12,fontFamily:"Inter"}}>Attachment</span>} name="attachment" initialValue={emailAttachment}>
                    <Input style={{ fontWeight: 600,opacity:0.7,border: "1px solid #D3D3D3",borderRadius: "3px" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col style={{ padding: "10px" }} span={emailAttachment===''?0:14}>
              <div style={{ position: "relative", top: "7px", maxHeight: "76vh", overflowY:'scroll', overflowX: "hidden"}}>
                <strong>Attachment Preview</strong>
                {/* <Card bodyStyle={{ padding: "3px" }} style={{ pointerEvents: "none" }}> */}
                  {/* <Form layout="inline" form={form} onFinish={onFinish}>
                    <span style={{ color: "slategray" }}>From:</span>
                    <Form.Item name="from">{<Input style={{ width: "23rem", border: "none", position: "relative", top: "-5px", fontWeight: 500, color: "black" }} />}</Form.Item>
                  </Form>
                  <Form layout="inline" form={form} onFinish={onFinish} style={{ top: "-10px", position: "relative" }}>
                    <span style={{ color: "slategray" }}>Reply To</span>
                    <Form.Item name="replyTo">{<Input style={{ width: "23rem", border: "none", position: "relative", top: "-5px", fontWeight: 500, color: "black" }} />}</Form.Item>
                  </Form>
                  <Form layout="inline" form={form} onFinish={onFinish} style={{ top: "-20px", position: "relative" }}>
                    <span style={{ color: "slategray" }}>To</span>
                    <Form.Item name="to">{<Input style={{ width: "23rem", border: "none", position: "relative", top: "-5px", fontWeight: 500, color: "black" }} />}</Form.Item>
                  </Form>
                  <Form layout="inline" form={form} onFinish={onFinish} style={{ top: "-30px", position: "relative" }}>
                    <span style={{ color: "slategray" }}>Cc</span>
                    <Form.Item name="cc">{<Input style={{ width: "23rem", border: "none", position: "relative", top: "-5px", fontWeight: 500, color: "black" }} />}</Form.Item>
                  </Form> */}

                  <div style={{ position: "relative", top: "-4px",padding:'5px'}}>
                    {/* <Divider /> */}
                    {/* <span>
                      <Form.Item name="subject" style={{ marginBottom: "0px" }}>
                        <Input style={{ width: "23rem", border: "none", position: "relative", top: "-5px", fontWeight: 500, color: "black" }} />
                      </Form.Item>
                    </span> */}

                    {/* <Col span={24}>
                      <Form.Item name="body">
                        <ReactQuill theme="bubble" />
                      </Form.Item>
                    </Col> */}
                    <Card bodyStyle={{ padding: "0px", width: "614px"}}>
                      <div style={{padding:'5px'}}>
                        <Document file={urlForEmailPdf} width="100">
                          <Page pageNumber={1} />
                        </Document>
                        <p>
                          Page {1} of {2}
                        </p>
                      </div>
                    </Card>
                  </div>
                {/* </Card> */}
              </div>
            </Col>
          </Row>
        </Form>
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
