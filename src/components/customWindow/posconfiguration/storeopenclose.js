import React, { useState, useEffect } from "react";
import { Form, Button, Space, Select, Input,Row,Col,Checkbox} from "antd";
import { PlusOutlined, MinusCircleOutlined,PlusCircleOutlined} from "@ant-design/icons";
const { Option } = Select;


const Storeopenclose = props => { 
  const [isState1,setIsState1] = useState([])              
  const {Optional,StoreOpen,Storeclose}=props 

   const getListData=(name)=>(e)=>{
     let newArry = [...isState1]
    if(e === "LI"){
      if(newArry.length === 0){
        newArry.push({
                key : name.key,
                type : e
              })
       }else{
        newArry.map((item)=>{
          if(item.key  !== name.key){
            newArry.push({
              key : name.key,
              type : e
            })
          }
        })
       }
    }else{
     newArry =  newArry.filter((item)=>item.key !== name.key)
    }
     setIsState1(newArry)
   }
 
  return (
    <> 
     <Form.List name={[props.fieldKey, "AddnewButton"]} >
        {(beds, { add, remove }) => {
          return (
            <div>
              {beds.map((bed, index2) => (
                <Row gutter={16}>
                     <Col className="gutter-row" span={3}>
                     <Form.Item
               
               {...bed}
               name={[bed.name, "CheckListName"]}
               fieldKey={[bed.fieldKey, "CheckListName"]}
               label={"Check List Name"}
               key={index2}
              
               style={{marginBottom:'8px'}}
             >
            <Input/>
             </Form.Item> 
                       </Col> 
                 
                              <Col className="gutter-row" span={3}>
                  <Form.Item
                   
                    {...bed}
                    name={[bed.name, "Type"]}
                    fieldKey={[bed.fieldKey, "Type"]}
                    label={"Type"}
                    key={index2}
                  
                    style={{marginBottom:'8px'}}
                  >
                   <Select
                      allowClear
                      showSearch
                      onSelect={getListData(bed)}
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      <Option key="1" value="ST" title="String">
                                         String
                                        </Option>

                                        <Option key="2" value="NU" title="Numeric">
                                         Numeric
                                       </Option>

                                       <Option key="3" value="DA" title="Date">
                                        Date
                                       </Option>

                                      <Option key="4" value="DT" title="Date/Time ">
                                        Date/Time 
                                      </Option>
 
                                      <Option key="5" value="TI" title="Time">
                                      Time  
                                       </Option> 

                                       <Option key="6" value="LI" title="List">
                                        List
                                      </Option>
                                      <Option key="6" value="Boolean" title="Boolean">
                                      boolean
                                      </Option>
                      
                    </Select>
                  </Form.Item>
                   </Col>
                  
                              <Col className="gutter-row" span={3}>
                    <Form.Item 
                     initialValue={Optional === "Y" ? true : false}
                     {...bed}
                    name={[bed.name, "Optional"]}
                     fieldKey={[bed.fieldKey, "Optional"]}
                    label={"Optional"}
                    key={index2}
                    style={{marginBottom:'8px'}}
                               valuePropName="checked" 
                                >
                                <Checkbox/>
                              </Form.Item>
                  </Col>        
                              <Col className="gutter-row" span={3}>
                   <Form.Item  
                   initialValue={StoreOpen === "Y" ? true : false}
                                {...bed}
                    name={[bed.name, "StoreOpen"]}
                     fieldKey={[bed.fieldKey, "Store Open"]}
                    label={"Store Open"}
                    key={index2}
                    // noStyle
                    style={{marginBottom:'8px'}}
                               valuePropName="checked" 
                                >
                                <Checkbox  
                            
                                //    checked={checkedValueSOCOpenCheck}
                                //  onChange={onchengrCheckboxoptional}
                                />
                              </Form.Item>
                             </Col>
                              <Col className="gutter-row" span={3}>
                            <Form.Item 
                             initialValue={Storeclose === "Y" ? true : false}
                             {...bed}
                              fieldKey={[bed.fieldKey, "Store Close"]}
                                valuePropName="checked" 
                              label={"Store Close"}  name={[bed.name, "Storeclose"]}  style={{ marginBottom: "8px" }}>
                                <Checkbox   
                                defaultValue={false}

                                // checked={checkedValueSOCCloseCheck}
                                //  onChange={onchengrCheckboxoptional} 

                                 />
                              </Form.Item>
                               </Col>
                               
                              <Col className="gutter-row" span={3}>
                              <Form.Item   
                              {...bed}
                    name={[bed.name, "Additional"]}
                     fieldKey={[bed.fieldKey, "additional"]}
                    label={"Additional"}
                    key={index2}
                    // noStyle
                    style={{marginBottom:'8px'}}>
                              <Select 
                              style={{width:'150px'}}
                             allowClear
                             showSearch
                             filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          >
                        <Option key="1" value="NTG" >
                        Nothing
                        </Option>
                        <Option key="2" value="Img">
                          Image
                        </Option>
                    </Select>
                              </Form.Item>
                            </Col> 
                            <Col className="gutter-row" span={1}/>
                        <Col className="gutter-row" span={3}>

                  {isState1.map((element)=>{
                    if(element.type === "LI" && element.key === index2 ){
                      return(
                        <Form.Item
                    {...bed}
                    name={[bed.name, "refValues"]}
                    fieldKey={[bed.fieldKey, "refValues"]}
                    label={"Ref Values"}
                    key={index2}
                    style={{marginBottom:'8px'}}
                  >
                 <Input/>
                  </Form.Item>

                      )
                    }
                  })
                    } 
                  </Col>

                   <Col className="gutter-row" span={2} style={{marginTop:'24px'}}>
                  <MinusCircleOutlined
                    onClick={() => {remove(bed.name)}}/>
                  </Col>
                </Row>
              ))} 
               <Row gutter={16}>
                 <Col span={20}/>
                 <Col span={4}>
                 <Form.Item  style={{marginBottom:'20px'}}>
               <span style={{ float: "right" }}>
               <Button
                  type="dashed" 
                  onClick={() => {
                    add();
                  }}
                >
                  Add Check List
                </Button> 
                </span>        
              </Form.Item>
                 </Col>
               
                            </Row>
               
            </div>
          );
        }}
      </Form.List>
    </>
  );
};

export default Storeopenclose ;

