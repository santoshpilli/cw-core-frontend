import React, { useState } from "react";
import { useParams } from "react-router";
import { Button, Modal, Card, Form, notification, List, Tooltip,message } from "antd";
// import { genericUrl } from "../../constants/serverConfig";
import { DownloadOutlined,CloseOutlined} from "@ant-design/icons";
import { useGlobalContext } from "../../lib/storage";
import { getFilesData, getPrintDownloadData,deleteFileAttachment } from "../../services/generic";
import Attachment from "../../assets/images/attachmentDef.svg";
import AttachmentHover from "../../assets/images/attachmentHover.svg";
import { getOAuthHeaders } from "../../constants/oAuthValidation";
import DeleteAttachment from '../../assets/images/deleteattachment.svg'
import http from "../recordWindow/http-common.js";
import axios from "axios";
import "./style.css";

const FileAttachment = (props) => {

  const genericUrl = process.env.REACT_APP_genericUrl;
  const { headerTabId } = props;
  const { recordId } = useParams();
  const { windowId } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModal,setDeleteModal] = useState(false)
  const [fileId,setFileId]=useState()
  const [fileInfos, setFileInfos] = useState([]);
  const { access_token } = getOAuthHeaders();
  const [form] = Form.useForm();
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleIconHover = (iconName) => {
    setHoveredIcon(iconName);
  };

  const handleIconLeave = () => {
    setHoveredIcon(null);
  };

  const fileAttachment = async () => {
    const getFiles = await getFilesData(windowId, headerTabId, recordId);

    let fileData = JSON.parse(getFiles.data.data.getFileList);
    let fileDataArray = fileData.FileList;
    for (let i = 0; i < fileDataArray.length; i++) {
      fileDataArray[i]["AscOrder"] = i;
    }

    const sortFileDataArray = fileDataArray.sort(function (a, b) {
      return b.AscOrder - a.AscOrder;
    });

    setFileInfos(sortFileDataArray);

    setIsModalVisible(true);
  };


  const selectFile = async (event) => {
    let newUrl = genericUrl.replace('graphql', 'api');
    let currentFile = event.target.files[0];
    let appId = localStorage.getItem("appId")
    const formData = new FormData();
    formData.append('file', currentFile);
    formData.append("data", '{"windowId":' + `"${windowId}"` + ',"tabId":' + `"${headerTabId}"` + ',"recordId":' + `"${recordId}"` + "}"); // eslint-disable-line
    axios.post(`${newUrl}/upsertFile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        appId:appId,
        Authorization: `bearer ${access_token}`,
      },
    })
    .then(response => {
         if (response.data.messageCode === "200") {
        fileAttachment();
        notification.success({
          message: response.data.message,
        });
        document.getElementById("choosefile").value = "";
      } else {
        notification.info({
          message: response.data.message,
        });
      }
    })
    .catch(error => {
      document.getElementById("choosefile").value = "";
      console.error(error);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const downloadFile = async (fileName, path) => {
    const downloadPrintData = await getPrintDownloadData(path + `${fileName}`);
    const fileURL = window.URL.createObjectURL(new Blob([ downloadPrintData.data]));
    const link = document.createElement("a");
    link.setAttribute("id", "downloadlink");
    link.href = fileURL;
    link.setAttribute("download", `${path + `${fileName}`}`);
    link.click();
  };

  const deleteFile = async ()=>{
    const deleteFileResponse = await deleteFileAttachment(fileId);
    if(deleteFileResponse.title==='Success'){
      notification.success({
        message:deleteFileResponse.message
      });
      setDeleteModal(false)
      setFileId()
    }else{
      notification.error({
        message:deleteFileResponse.message
      });
    }
    fileAttachment()
  }

  const propsConfirmCancel=()=>{
    setDeleteModal(false)
  }
const openDeleteModal = (csFileId) =>{
  setDeleteModal(true)
  setFileId(csFileId)
}
  return (
    <span>
      <Tooltip placement="top" title="Attachment" onMouseEnter={() => handleIconHover('attach')} onMouseLeave={handleIconLeave}>
          <img onClick={fileAttachment} style={{ cursor:"pointer"}} src={hoveredIcon === "attach"?AttachmentHover: Attachment} alt="invoice" />&nbsp;{" "}
      </Tooltip>
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        // width="87%"
        // height="94%"
        centered
        closable={false}
        title={<>
          <h2 style={{fontWeight:'bold',width:'40%',fontStyle:'normal',float:'left',marginLeft:'7px'}}>Add Attachment</h2>
          <span style={{float:'right'}}><CloseOutlined onClick={()=>{setIsModalVisible(false)}}/></span>
          </>}
        bodyStyle={{ padding: "0px" }}
        footer={null}
      >
        <Card style={{ padding: "15px",marginTop:'40px' }}>
          <div>
            <label>
              <input style={{ width: "74%" }} id="choosefile" type="file" onChange={selectFile} />
            </label>
          </div>
          <br />
          <div style={{ backgroundColor: "white", position: "relative", top: "7px", maxHeight: "55vh", overflowY: "auto", overflowX: "hidden" }}>
            <List
              size="small"
              header={
                <div>
                  <span style={{ fontWeight: 700, margin: "0px 0px 0px 50px" }}>List of Files</span>
                </div>
              }
              bordered
              dataSource={fileInfos}
              renderItem={(file) => (
                <List.Item>
                  {file.fileName}{" "}
                  <span style={{ float: "right" }}>
                    <DownloadOutlined onClick={() => downloadFile(file.fileName, file.path)} style={{ marginBottom:'3px', cursor: "pointer", color: '#707070',marginRight:'7px',opacity:1,fontSize:'19px'}} />
                    {/* <DeleteOutlined onClick={()=>deleteFile(file.csFileId)} style={{ fontSize: "17px", cursor: "pointer", color: "rgb(22, 72, 170)" }}/> */}
                    <img src={DeleteAttachment} onClick={()=>{openDeleteModal(file.csFileId)}} alt='deleteAttachment' style={{marginBottom:'8px',cursor: "pointer",opacity:1,height:'18px'}}/>
                  </span>
                </List.Item>
              )}
            />
          </div>
        </Card>
      </Modal>
      <Modal
           title={<>
                  <center style={{fontWeight:'bold',width:'40%px',fontStyle:'normal'}}>Confirm Delete</center>
                  {/* <span style={{float:'right'}}><CloseOutlined onClick={propsConfirmCancel}/></span> */}
                  </>}
          visible={deleteModal}
          footer={[
            <span
             style={{color:'#0C173A',fontWeight:700,cursor:'pointer'}}
              onClick={propsConfirmCancel}
            >
              Cancel
            </span>,
            <Button style={{ backgroundColor: "#0C173A", color: "white", width: "88px", height: "36px",marginLeft:'31px',fontWeight:700,borderRadius:'4px'}} onClick={deleteFile}>
              Confirm
            </Button>,
          ]}
          closable={false}
          // centered
          style={{marginTop:"3%"}}
          width="350px"
          // onOk={propsConfirmOk}
          onCancel={propsConfirmCancel}
        >
          
          <center>Do you want to delete Attachment?</center>
            <br />
      </Modal>
    </span>
  );
};

export default FileAttachment;
