import React,{useState} from "react";
import { useParams } from "react-router";
import { Button, notification, Tooltip } from "antd";
import { getPrintTemplate, getPrintDownloadData } from "../../services/generic";
import { useGlobalContext } from "../../lib/storage";
import printHover from "../../assets/images/printhover.svg";
import printDefault from "../../assets/images/printdefault.svg";
import "./style.css";
import ThemeJson from "../../constants/UIServer.json"

const Print = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const { headerTabId, setLoadingRecordWindow } = props;
  const { recordId,windowId } = useParams();

  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleIconHover = (iconName) => {
    setHoveredIcon(iconName);
  };

  const handleIconLeave = () => {
    setHoveredIcon(null);
  };

  const printTemplate = async () => {
    try {
      setLoadingRecordWindow(true);
      const printTemplateData = await getPrintTemplate(windowId,headerTabId, recordId);
      if (printTemplateData.data.data.reportTemplate === null || printTemplateData.data.data.reportTemplate === "null" || printTemplateData.data.data.reportTemplate === "") {
        notification.info({
          message: "File Not Found..!!!!",
        });
        setLoadingRecordWindow(false);
      } else {
        getPrintCommand(printTemplateData.data.data.reportTemplate);
      }
    } catch (error) {
      console.error("Error", error);
      setLoadingRecordWindow(false);
    }
  };

  const getPrintCommand = async (fileName) => {
    const downloadPrintData = await getPrintDownloadData(fileName);
    const fileURL = window.URL.createObjectURL(new Blob([downloadPrintData.data]));
    const link = document.createElement("a");
    link.setAttribute("id", "downloadlink");
    link.href = fileURL;
    link.setAttribute("download", `${fileName}`);
    link.click();
    setLoadingRecordWindow(false);
  };

  return (
    <Tooltip  placement="top" title="Print" onMouseEnter={() => handleIconHover('print')} onMouseLeave={handleIconLeave}>
    {/* <Button className="listHeaderButtons" style={listActionButtons}> */}
      <img onClick={printTemplate} style={{cursor:"pointer"}} src={hoveredIcon === "print"?printHover:printDefault} alt="invoice" /> &nbsp;
      {/* </Button> */}
  </Tooltip>
  );
};

export default Print;
