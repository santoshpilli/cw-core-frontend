import React,{useState} from 'react'
import {Form,Row,Col,Card,Spin,Skeleton} from "antd"
import FormField from './FormField'
import LinesForm from './LinesForm'
import HistoryComponent from './HistoryComponent'
import { LoadingOutlined } from "@ant-design/icons";
import StatusBar from './statusBar'
import EmailTemplate from './email/EmailTemplate'
import { useHistory } from "react-router-dom";


const Customcommon = (props)=> {
  const history = useHistory();
  const {form,schema,selectedOption,setSelectedOption,onFinish,dataSource,setDatasource,changeQty,getselectedProductData,getFormValues,
    saveFlag,getdraftData,clearScreen,transationType,getHistorySelectedData,selectedHistoryRecord,
    setSaveFlag,loading,auditLog,statusBarData,getPrint,recordId,processDataForLines,importFlag
  } = props

  const [isVisible,setIsvisible] = useState(false)
  return (
        <>

        {/* <Spin indicator={<LoadingOutlined className="spinLoader" style={{fontSize:'52px',marginTop:'7vh'}} spin />} spinning={loading}> */}
        <div>
            <Form form={form} preserve={false} layout="vertical" onFinish={onFinish}>
            <Row gutter={16}>
             <Col span={isVisible ? 18 :24}>
                <Card 
                 style={{paddingTop:'2px',borderRadius:'8px',border:'1px solid #E4E4E4',boxShadow:'0px 0px 10px 1px rgba(0, 0, 0, 0.04)'}} bodyStyle={{paddingTop:'0px',paddingLeft:'0px',paddingRight:'0px',paddingBottom:'0px'}}>
                <div style={{paddingTop:'18px',paddingLeft:'25px',paddingRight:'25px'}}>
                  <Row gutter={[24, 12]}>
                    <Col span={12}>
                    <span style={{padding:'0px',color:'#0C173A',fontWeight:'500',fontSize:'16px',fontFamily:'Inter'}}>{schema.title}</span>
                    </Col>
                    <Col span={12}>
                    <span style={{fontSize:'13px',color:'#0500ED',cursor:'pointer',fontFamily:'Inter',float:'right'}} onClick={()=>setIsvisible(true)}>History</span>
                    </Col>
                  </Row>
                </div>
                <StatusBar auditLog={auditLog} statusBarData={statusBarData}/>
                <hr style={{opacity:'0.1'}}/>
                <div style={{paddingLeft:'25px',paddingRight:'25px',paddingBottom:'25px'}}>
                <Row gutter={[24, 12]}>
                {schema.Fields.map((field, index) => {
                    return(
                    <Col
                    key={index}
                    span={6}
                    id={`${field.name}`}
                    >
                    <FormField
                        field={field}
                        form={form}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                        getdraftData={getdraftData}
                        selectedHistoryRecord={selectedHistoryRecord}
                    />
                    </Col>
                    ) 
                })}
                </Row>
                </div>
                </Card>
            <Skeleton active paragraph={{rows:8}} loading={loading}>
            <LinesForm 
              form={form}
              schema={schema}
              dataSource={dataSource}
              setDatasource={setDatasource}
              changeQty={changeQty}
              getselectedProductData={getselectedProductData}
              getFormValues={getFormValues}
              saveFlag={saveFlag}
              setSaveFlag={setSaveFlag}
              clearScreen={clearScreen}
              selectedHistoryRecord={selectedHistoryRecord}
              selectedOption={selectedOption}
              getPrint={getPrint}
              recordId={recordId}
              processDataForLines={processDataForLines}
              importFlag={importFlag}
            />
            </Skeleton>
            </Col>
            <Col span={6} style={{display:isVisible === true ? 'block':'none'}}>
              <HistoryComponent transationType={transationType} getHistorySelectedData={getHistorySelectedData} setIsvisible={setIsvisible}/>
            </Col>
            </Row>
            </Form>
        </div>
        {/* </Spin> */}
        </>
      )
}

export default Customcommon