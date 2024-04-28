 const summaryTableColumns = [
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
    title: 'Remarks',
    dataIndex: 'description',
    width: 120,
  },
]


export default summaryTableColumns