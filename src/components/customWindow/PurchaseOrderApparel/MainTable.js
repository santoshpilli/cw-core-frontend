import React from 'react'
import { Table } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import "antd/dist/antd.css";
import "./antdClass.css"
import "../../../styles/antd.css"

const MainTable = (props) =>{
    const {gridData,getSelectedRecord,deleteSelectedRecord} = props
    const tableColumns = [
        {
          title: '',
          dataIndex: '',
          fixed: 'left',
          width: 30,
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
          title: '',
          dataIndex: '',
          fixed: 'left',
          width: 30,
          render: (text) => <span
          style={{cursor:'pointer'}}
          role="presentation"
          onClick={() => {
            deletedProduct(text)
          }}
        >
          <DeleteOutlined />
        </span>
        },
        {
          title: 'Product',
          dataIndex: 'name',
          width: 150,
        },
        {
          title: 'Design#',
          dataIndex: 'design',
          width: 150,
        },
        {
          title: 'Size',
          dataIndex: 'size',
          width: 80,
        },
        {
          title: 'Category',
          dataIndex: 'productCategoryName',
          width: 150,
          render: (text,record) => (
            <span>
              {record.productCategory.name}
            </span>
          ),
        },
        {
          title: 'Brand',
          dataIndex: 'productCategoryName',
          width: 150,
          render: (text,record) => (
            <span>
              {record.brandName}
            </span>
          ),
        },
        {
          title: 'HSN',
          dataIndex: 'hsnName',
          width: 150,
          render: (text,record) => (
            <span>
              {record.hsnName}
            </span>
          ),
        },
        {
          title: 'Qty',
          dataIndex: 'qty',
          width: 70,
          render: (text,record) => (
            <span>
              {record.qty}
            </span>
          ),
        },
        {
          title: 'Bar Code',
          dataIndex: 'bCode',
          width: 70,
          render: (text,record) => (
            <span>
              {record.bCode}
            </span>
          ),
        },
        {
          title: 'Total Discount',
          dataIndex: 'totalDiscount',
          width: 100,
          render: (text,record) => (
            <span>
              {(record.totalDiscount).toFixed(2)}
            </span>
          ),
        },
        /* {
          title: 'P Price',
          dataIndex: 'productCategoryName',
          width: 150,
          render: (text,record) => (
            <span>
              {record.priceStd}
            </span>
          ),
        }, */
        /* {
          title: 'P Price',
          dataIndex: 'unitPriceAfterDisc',
          width: 100,
          render: (text,record) => (
            <span>
              {(record.unitPriceAfterDisc).toFixed(2)}
            </span>
          ),
        }, */

        {
          title: 'P Price',
          dataIndex: 'priceStd',
          width: 100,
          render: (text,record) => (
            <span>
              {(record.purchasePrice).toFixed(2)}
            </span>
          ),
        },

        /* {
          title: 'Unit Tax',
          dataIndex: 'unitTax',
          width: 150,
          render: (text,record) => (
            <span>
              {(record.unitTax).toFixed(2)}
            </span>
          ),
        }, */

        {
          title: 'Unit Tax',
          dataIndex: 'unitTaxAfterDisc',
          width: 100,
          render: (text,record) => (
            <span>
              {(record.unitTaxAfterDisc).toFixed(2)}
            </span>
          ),
        },
        
        /* {
          title: 'Line Net Amt',
          dataIndex: 'linenetamt',
          width: 150,
          render: (text,record) => (
            <span>
              {(record.linenetamt).toFixed(2)}
            </span>
          ),
        }, */
        {
          title: 'Line Net Amt',
          dataIndex: 'lineNetAmtAfterDisc',
          width: 100,
          render: (text,record) => (
            <span>
              {record.lineNetAmtAfterDisc===undefined?0:(record.lineNetAmtAfterDisc).toFixed(2)}
            </span>
          ),
        },
        {
          title: 'Amount',
          dataIndex: 'lineGrossAmtAfterDisc',
          width: 100,
          render: (text,record) => (
            <span>
              {record.lineGrossAmtAfterDisc===undefined?0:(record.lineGrossAmtAfterDisc).toFixed(2)}
            </span>
          ),
        },        
        /* {
          title: 'Amount',
          dataIndex: 'productCategoryName',
          width: 150,
          render: (text,record) => (
            <span>
              {record.gridGrossAmt}
            </span>
          ),
        }, */
        {
          title: 'Margin',
          dataIndex: 'productCategoryName',
          width: 80,
          render: (text,record) => (
            <span>
              {record.margin}
            </span>
          ),
        },
        {
          title: 'MRP',
          dataIndex: 'productCategoryName',
          width: 80,
          render: (text,record) => (
            <span>
              {record.priceList}
            </span>
          ),
        },
        {
          title: 'Commission',
          dataIndex: 'commission',
          width: 150,
          render: (text,record) => (
            <span>
              {record.commission}
            </span>
          ),
        },
   ]

   const selectedProduct = (data) =>{
    getSelectedRecord(data)
    // setSelectedRecord(data)
   }

   const deletedProduct = (data) =>{
    deleteSelectedRecord(data)
    // setSelectedRecord(data)
   }

   
    return(
        <div>
            <Table 
              // rowClassName={(record, index) => record.productId === selectedRecord.productId ? 'table-row-dark' :  'table-row-light'}
              columns={tableColumns} 
              dataSource={gridData}
              style={{ fontSize: "12px" }}
              size="small"
              sticky={true}
              scroll={{ y: "20vh",x: "100%"}}
              pagination={false}
              />
        </div>
    )
}

export default MainTable