import React from 'react'
import { Table } from "antd";
import "./antdClass.css"
import "../../../styles/antd.css"

const OtherCostTable = (props) =>{
    const { gridData1 } = props

    const tableColumns = [
       {
          title: 'Cost Parameter',
          dataIndex: 'name',
          width: 100,
        },
        {
          title: 'Cost',
          dataIndex: 'costPrice',
          width: 100,
        },
        
   ]

    return(
        <div>
            <Table 
              columns={tableColumns} 
              dataSource={gridData1}
              style={{ fontSize: "12px" }}
              size="small"
              sticky={true}
              scroll={{ y: "40vh",x: "100%"}}
              pagination={false}
              />
        </div>
    )

}

export default OtherCostTable