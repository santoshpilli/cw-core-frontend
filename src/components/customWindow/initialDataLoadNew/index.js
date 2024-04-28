import React,{useState,useEffect} from 'react'
import {Row,Col,Button,Form,Select,Spin,Input,DatePicker,Table,Card,message,Tooltip} from 'antd'
import { LoadingOutlined,DownloadOutlined } from "@ant-design/icons";
import Axios from "axios";
import { ExportToCsv } from 'export-to-csv'
// import { serverUrl } from "../../../constants/serverConfig";
import { generateToken } from '../../../services/generateToken';


const {Option} = Select
const InitialDataLoadNew = () => {
    const [loading, setLoading] = useState(false);
    const [mainTabData,setMainTabData] = useState([])
    const [columnsData,setColumnsData] = useState([])
    const [tableData,setTableData] = useState([])
    const [tabName,setTabName] = useState(null)
    const [serviceName,setServiceName] = useState(null)
    const [serviceHeaderName,setServiceHeaderName] = useState(null)
    const serverUrl = process.env.REACT_APP_serverUrl;
    const [headerform] = Form.useForm()

    useEffect(() => {
        getAppSetupData();
      }, [])

      const getAppSetupData = async () => {
        try {
          setLoading(true);
          const newToken = JSON.parse(localStorage.getItem("authTokens"));
          const getAppSetupMutation = {
            query: `query{
              getDataLoadConfig(name:null)
              {
                  dataLoadConfigId
                  name
                  serviceName
                  configJson
              }
              }`,
          };
          const headers = {
            "Content-Type": "application/json",
            Authorization: `bearer ${newToken}`,
          };
    
          const serverResponse = await Axios.post(serverUrl, getAppSetupMutation, { headers: headers }, { async: true }, { crossDomain: true });
          const appSetupResponse = serverResponse.data.data.getDataLoadConfig; 
          if (appSetupResponse.length > 0) {
            const finalArray =[]
            for (let index = 0; index < appSetupResponse.length; index++) {
              const obj ={
                tabName:appSetupResponse[index].name, 
                tabKey: appSetupResponse[index].dataLoadConfigId, 
                serviceName:appSetupResponse[index].serviceName,
                colsData:JSON.parse(appSetupResponse[index].configJson),
              }
              finalArray.push(obj)
            }
            setMainTabData(finalArray)
            setLoading(false);
          } else {
            message.error("No Data Available");
            setLoading(false);
          }
        } catch (error) {
          const { message } = JSON.parse(JSON.stringify(error));
          if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
            generateToken();
          } else {
            return Promise.reject(error);
          }
        }
    }

    const onChageDataLoadType = (e,data) =>{
        setTableData([])
        const isImport = document.getElementById("choosefile")=== null || document.getElementById("choosefile") === undefined? null: document.getElementById("choosefile").value;
        if(isImport !== null){
          document.getElementById("choosefile").value = null
        }
        setColumnsData([])
        setLoading(true)
        setTabName(null)
        const cData = data.data.colsData
        const tabName = data.data.tabName
        setTabName(tabName)
        const dyData = data.data.serviceName. split('/')
        setServiceName(dyData[0])
        setServiceHeaderName(dyData[1])
      let Cols = []
      for (let index = 0; index < cData.length; index++) {
        const columnName = cData[index].columnName;
        const fieldName = cData[index].fieldName;
        const enabledField = cData[index].enabledField;
        const isMandetory = cData[index].isMandatory;
        Cols.push({
          title: columnName,
          dataIndex: fieldName,
          width: 180,
          ellipsis: true,
          hidden:enabledField === "N" ? true:false,
          isMandetoryTitleAndColumn:`${columnName}${isMandetory==="Y" ?'*':''}`,
          isMandetoryTitle:isMandetory==="Y" ?'*':null
        });
      }
      const rcColumns= Cols.filter(item => !item.hidden);
      setColumnsData(rcColumns)
      setLoading(false)

    }

    const downloadImportTemplate = () =>{
        const newArray = []
    for (let index = 0; index < columnsData.length; index++) {
      const element = columnsData[index].isMandetoryTitleAndColumn;
      newArray.push(element)
      
    }
    const options = {
      fieldSeparator: ',',
      filename:tabName,
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      headers:newArray
    }
    let newArray2 = []
    
    const obj = {};
    for (let i = 0; i < newArray.length; i++) {
      obj[newArray[i]] = '';
    }
    newArray2.push(obj)
    const csvExporter = new ExportToCsv(options)
      csvExporter.generateCsv(newArray2)
    }

    const readImportData = (evt) =>{
        const { files } = evt.target;
  const filename = files[0].name;
  const fileExt = filename.substr(filename.lastIndexOf("."), filename.length);
  if (fileExt !== ".csv") {
    message.error("Please select csv file");
  } else {
    const file = files[0];
      const reader = new FileReader();
      let fileTextData;
      reader.onload = (e) => {
        fileTextData = e.target.result;
        const rows = fileTextData.split(/\r?\n/);
        const newData = [];
        rows.forEach((element) => {
          if (element.trim() !== "") {
            newData.push(element);
          }
        });
        
        const dataArr = [];
        let flag = true
        for (let i = 1; i < newData.length; i += 1) {
          const cells = newData[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          if(cells.length === columnsData.length){
            const jsonObject = {};
            for (let index = 0; index < columnsData.length; index += 1) {
              const element = columnsData[index];
              const isMandetory = columnsData[index].isMandetoryTitle
              if(isMandetory === '*'){
                const iscellsEmpty = cells[index].replace(/"/g, "")
                if(iscellsEmpty === "" || iscellsEmpty === undefined || iscellsEmpty === null){
                  flag = false
                }
              }
              jsonObject[element.dataIndex] = cells[index].replace(/"/g, "") === "" || cells[index].replace(/"/g, "") === undefined || cells[index].replace(/"/g, "") === null ? null :cells[index].replace(/"/g, "");
            }
            dataArr.push(jsonObject);
          }else{
            message.error("Header and data not matching")
            setTableData([])
            document.getElementById("choosefile").value = null;
          }
        }
        if(flag === false){
          message.error("Please add data in mandatory columns")
          document.getElementById("choosefile").value = null;
        }else{
          if(dataArr.length > 0){
            message.success("Data imported successfully");
            setTableData(dataArr)
          }
        }
      }
      reader.readAsText(file);
        }
    }

    const processImport = async () =>{
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
        if(tableData.length > 0){
          setLoading(true)
        let oneData = JSON.stringify(JSON.stringify(tableData)) 

        const appSetupMutation = {          
          query: `mutation { 
            ${serviceName}(${serviceHeaderName} :${oneData}){
              status
              message	
                } 
            }`,
        };
        Axios({
          url: serverUrl,
          method: 'POST',
          data: appSetupMutation,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${newToken}`,
          },
        }).then(response => {
          if (response.data.data !== null) {
            if(response.data.data[serviceName].status === "200"){
              message.success(response.data.data[serviceName].message)
              setLoading(false)
              setTableData([])
              setColumnsData([])
              headerform.resetFields()
              document.getElementById("choosefile").value = null
            }else{
              message.error(response.data.data[serviceName].message)
              setLoading(false)
            }
          }
        })
        }else{
          message.error('No Data')
        }
      }
      
      
    return (
        <Spin indicator={<LoadingOutlined style={{ fontSize: "52px" }} spin />} spinning={loading}>
        <div>
          <Row>
            <Col span={12}>
              <h2 style={{ fontWeight: "700", fontSize: "16px", color: "rgb(0 0 0 / 65%)", marginBottom: "0px", marginTop: "1%" }}>Data Load</h2>
            </Col>
            <Col span={12}>
              <span style={{ float: "right" }}>
                <Button onClick={processImport} style={{ marginBottom: "8px", backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }}>Process</Button>
              </span>
            </Col>
          </Row>
          <Card style={{ marginBottom: "8px" }}>
            <Form layout="vertical" form={headerform} name="control-hooks" /* onFinish={onFinish} */>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="dlType" label="Data Load Type" style={{ marginBottom: "8px" }}>
                    <Select
                      allowClear
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={onChageDataLoadType}
                      >
                        {mainTabData.map((data) => (
                            <Option key={data.tabKey} value={data.tabKey} data={data} title={data.tabName}>
                                {data.tabName}
                            </Option>
                            ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          {columnsData.length > 0 ? 
          <Row style={{textAlign:'right'}}>
            <Col span={24}>
              <Tooltip placement="top" title={"Download Template"}>
                  <Button size="small" onClick={downloadImportTemplate}>
                    <DownloadOutlined />
                  </Button>
                </Tooltip>
                &nbsp;
                <input id="choosefile" type="file" accept=".csv" onChange={readImportData}/>
            </Col>
          </Row>
          :null}
          <Row style={{marginTop:'8px'}}>
            <Col span={24}>
              <Card>
              <div>
                  <Table 
                    columns={columnsData} 
                    dataSource={tableData}
                    style={{ fontSize: "12px" }}
                    size="small"
                    sticky={true}
                    scroll={{ y: "30vh",x: "100%"}}
                    pagination={false}
                    />
              </div>
            </Card>
            </Col>
            </Row>
        </div>
        </Spin>
    )
}

export default InitialDataLoadNew