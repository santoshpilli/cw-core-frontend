 const summaryTableColumns = [
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
    dataIndex: 'productCategoryName',
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
    width: 150,
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
  /* {
    title: 'Tax(%)',
    dataIndex: 'taxRate',
    width: 150,
    render: (text,record) => (
      <span>
        {record.taxRate}
      </span>
    ),
  }, */
  {
    title: 'Total Discount',
    dataIndex: 'totalDiscount',
    width: 150,
    render: (text,record) => (
      <span>
        {(record.totalDiscount).toFixed(2)}
      </span>
    ),
  },
  {
    title: 'P Price',
    dataIndex: 'productCategoryName',
    width: 150,
    render: (text,record) => (
      <span>
        {(record.purchasePrice).toFixed(2)}
      </span>
    ),
  },
  /* {
    title: 'P Price',
    dataIndex: 'unitPriceAfterDisc',
    width: 150,
    render: (text,record) => (
      <span>
        {(record.unitPriceAfterDisc).toFixed(2)}
      </span>
    ),
  }, */

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
    width: 150,
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
    width: 150,
    render: (text,record) => (
      <span>
        {record.lineNetAmtAfterDisc===undefined?0:(record.lineNetAmtAfterDisc).toFixed(2)}
      </span>
    ),
  },
  {
    title: 'Amount',
    dataIndex: 'lineGrossAmtAfterDisc',
    width: 200,
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
    width: 150,
    render: (text,record) => (
      <span>
        {record.margin}
      </span>
    ),
  },
  {
    title: 'MRP',
    dataIndex: 'productCategoryName',
    width: 150,
    render: (text,record) => (
      <span>
        {record.priceList}
      </span>
    ),
  },
  {
    title: 'Commission',
    dataIndex: 'productCategoryName',
    width: 150,
    render: (text,record) => (
      <span>
        {record.commission}
      </span>
    ),
  },
]


export default summaryTableColumns