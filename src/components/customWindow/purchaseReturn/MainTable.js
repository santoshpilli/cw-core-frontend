import React,{useState} from 'react'
import { Table ,Card} from "antd";
import { EditOutlined } from '@ant-design/icons'
import "antd/dist/antd.css";
import "./antdClass.css"
import "../../../styles/antd.css"

const MainTable = (props) =>{
    const {gridData,getSelectedRecord} = props

    const tableColumns = [
        {
          title: '',
          dataIndex: '',
          width: 80,
          render: (text, row) => <span
          style={{cursor:'pointer'}}
          role="presentation"
          onClick={() => {
            selectedProduct(text)
          }}
        >
          <EditOutlined />
        </span>
        },
       {
          title: 'SKU',
          dataIndex: 'value',
          width: 80,
        },
        {
          title: 'Name',
          dataIndex: 'productName',
          width: 150,
        },
        {
          title: 'UOM',
          dataIndex: 'uomName',
          width: 80,
        },
        {
          title: 'Order Qty',
          dataIndex: 'orderedQty',
          width: 80,
        },
        {
          title: 'Return Qty',
          dataIndex: 'returnQty',
          width: 80,
        },
        {
          title: 'Unit Price',
          dataIndex: 'unitPrice',
          width: 80,
        },
        {
          title: 'Tax',
          dataIndex: 'taxName',
          width: 120,
          render:(tetx,record) =>{
            return record.taxRate.name
          }
        },
        {
          title: 'Gross Amount',
          dataIndex: 'grossAmount',
          width: 120,
        },
        {
          title: "Batch No",
          dataIndex: "batchNo",
          width: 120,
        },
        {
          title: "Mfg Date",
          dataIndex: "mfg_date",
          width: 120,
        },
        {
          title: "Expiry Date",
          dataIndex: "expiry_date",
          width: 120,
        },
        {
          title: 'Remarks',
          dataIndex: 'description',
          width: 120,
        },
   ]

   const selectedProduct = (data) =>{
    getSelectedRecord(data)
    // setSelectedRecord(data)
   }

   
    return(
      <Card>
        <div>
            <Table 
              // rowClassName={(record, index) => record.productId === selectedRecord.productId  ? 'table-row-dark' :  'table-row-light'}
              columns={tableColumns} 
              dataSource={gridData}
              style={{ fontSize: "12px" }}
              size="small"
              sticky={true}
              scroll={{ y: "30vh",x: "100%"}}
              pagination={false}
              />
        </div>
    </Card>
    )
}

export default MainTable