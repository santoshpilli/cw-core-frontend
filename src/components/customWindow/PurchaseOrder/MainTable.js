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
          dataIndex: 'name',
          width: 150,
        },
        {
          title: 'Category',
          dataIndex: 'productCategoryName',
          width: 150,
        },
        {
          title: 'UOM',
          dataIndex: 'uomName',
          width: 80,
        },
        {
          title: 'Order Qty',
          dataIndex: 'orderQty',
          width: 80,
        },
        {
          title: 'Free Qty',
          dataIndex: 'freeqty',
          width: 80,
        },
        {
          title: 'Discount Value',
          dataIndex: 'discount',
          width: 120,
        },
        {
          title: 'Unit Price',
          dataIndex: 'priceStd',
          width: 80,
        },
        {
          title: 'Net Unit Price',
          dataIndex: 'netUnitPrice',
          width: 120,
        },
        {
          title: 'MRP',
          dataIndex: 'priceList',
          width: 80,
        },
        {
          title: 'Sale Price',
          dataIndex: 'salePrice',
          width: 80,
        },
        {
          title: 'Discount Type',
          dataIndex: 'discountType',
          width: 120,
        },
        {
          title: 'Total Discount',
          dataIndex: 'totalDiscount',
          width: 120,
        },
        {
          title: 'Margin',
          dataIndex: 'margin',
          width: 120,
        },
        {
          title: 'Gross Amount',
          dataIndex: 'grossAmount',
          width: 120,
        },
        {
          title: '2W/4W Sale',
          dataIndex: 'twoWeekSale',
          width: 120,
        },
        {
          title: 'On Hand Qty',
          dataIndex: 'qtyOnHand',
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