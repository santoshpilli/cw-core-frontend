import React,{useState} from 'react'
import { Table ,Card} from "antd";
import { EditOutlined } from '@ant-design/icons'
import "antd/dist/antd.css";
import "./antdClass.css"
import "../../../styles/antd.css"

const MainTable = (props) =>{
  const [selectedRecord,setSelectedRecord] = useState({})
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
          dataIndex: 'productSearchKey',
          width: 80,
        },
        {
          title: 'Product',
          dataIndex: 'productName',
          width: 150,
        },
        // {
        //   title: 'Category',
        //   dataIndex: 'productCategoryName',
        //   width: 150,
        // },
        {
          title: 'UOM',
          dataIndex: 'uomName',
          width: 80,
        },
        {
          title: 'Batch No',
          dataIndex: 'batchNo',
          width: 80,
        },
        {
          title: 'Mfg Date',
          dataIndex: 'mfg_date',
          width: 80,
        },
        {
          title: 'Exp. Date',
          dataIndex: 'expiry_date',
          width: 120,
        },
        {
          title: 'Receiving Qty',
          dataIndex: 'receivingQty',
          width: 100,
        },
        {
          title: 'Free Qty',
          dataIndex: 'freeqty',
          width: 120,
        },
        {
          title: 'Discount Value',
          dataIndex: 'discountvalue',
          width: 100,
        },
        {
          title: 'Ordered Qty',
          dataIndex: 'orderedQty',
          width: 100,
        },
        {
          title: 'PO Free Qty',
          dataIndex: 'pofreeqty',
          width: 120,
        },
        {
          title: 'Received Qty',
          dataIndex: 'receivedqty',
          width: 120,
        },
        {
          title: 'Base Price',
          dataIndex: 'priceStd',
          width: 120,
        },
        {
          title: 'Net Unit Price',
          dataIndex: 'netUnitPrice',
          width: 120,
        },
        {
          title: 'Sale Price',
          dataIndex: 'salePrice',
          width: 120,
        },
        {
          title: 'MRP',
          dataIndex: 'priceList',
          width: 120,
        },
        {
          title: 'Margin',
          dataIndex: 'margin',
          width: 120,
        },
        {
          title: 'Net Amount',
          dataIndex: 'lineNetGross',
          width: 100,
        },
        {
          title: 'Gross Amount',
          dataIndex: 'gridGross',
          width: 100,
        },
        {
          title: 'Remarks',
          dataIndex: 'Remark',
          width: 110,
        },
   ]

   const selectedProduct = (data) =>{
    getSelectedRecord(data)
    setSelectedRecord(data)
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