import React, { useEffect, useState } from "react";
import { Table, Input, Space, Button, DatePicker, Dropdown, Tooltip, Menu, Checkbox } from "antd";
import { Resizable } from 'react-resizable';
import ReactDragListView from "react-drag-listview";
import "../../../styles/app.css";
import ShowAndHide from "../../../assets/images/showandHide.svg";

const ResizableCell = (props) => {
  const { onResize, width, ...restProps} = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const TableForGPReport = (props) => {
  const { columnsData, gridData } = props;
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [checkedColumns, setCheckedColumns] = useState([]);
  
  useEffect(() => {
    let data = [ ...columnsData];
    const handleReset = clearFilters => {
      clearFilters();
    };
    const getColumnSearchProps = (type) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          {type === "Date" ? 
            <DatePicker
              onChange={(date, dateString) => setSelectedKeys(dateString ? [dateString] : [])}
              style={{ marginBottom: 8, display: 'block' }}
            /> : 
            <Input
              value={selectedKeys[0]}
              onChange={e => { setSelectedKeys(e.target.value ? [e.target.value] : []) }}
              style={{ marginBottom: 8, display: 'block' }}
            />
          }
          <Space>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
            >
              Reset
            </Button>
            <Button
              onClick={() => {
                confirm({ closeDropdown: true });
              }}
              size="small"
            >
              Filter
            </Button>
          </Space>
        </div>
      )
    });
    for (let index = 0; index < data.length; index++) {
      Object.assign(data[index], getColumnSearchProps(data[index].type), { filteredValue : null }, { 
        onFilter: (value, record) => 
          record[data[index].dataIndex]
          ? record[data[index].dataIndex].toString().toLowerCase().includes(value.toLowerCase())
          : ''              
      }, {
        sorter: (a, b) => a[data[index].dataIndex] - b[data[index].dataIndex],
      });
    };
    setColumns(columnsData);
  }, [columnsData]);

  const handleChange = (pagination, filters) => {
    let data = [ ...columns];
    for (let index1 = 0; index1 < Object.keys(filters).length; index1++) {
      for (let index2 = 0; index2 < data.length; index2++) {
        if (Object.keys(filters)[index1] === data[index2].dataIndex) {
          data[index2].filteredValue = Object.values(filters)[index1];
        }
      }
    }
    setColumns(data);
  };

  const components = {
    header: {
      cell: ResizableCell
    }
  };

  const finalColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: columns => ({
      width: columns.width,
      onResize: handleResize(index),
    }),
  }));
  const handleResize = index => (e, { size }) => {
    setColumns((columns) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return nextColumns;
    });
  };

  const dragProps = {
    onDragEnd(fromIndex, toIndex){
      const resizeColumns = [...columns];
      const item = resizeColumns.splice(fromIndex,1)[0];
      resizeColumns.splice(toIndex, 0, item);
      setColumns(resizeColumns);
    },
    nodeSelector: "th",
    handleSelector: ".dragHandler",
    ignoreSelector: "react-resizable-handle"
  };

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const onChange = (e) => {
    let checkColumns = checkedColumns;
    if (e.target.checked)  {
      checkColumns = checkColumns.filter(id => {return id !== e.target.id});
    } else if (!e.target.checked) {
      checkColumns.push(e.target.id)
    } 
    let filteredColumns = columnsData;
    for(let i = 0; i < checkColumns.length; i++)
      filteredColumns = filteredColumns.filter(el => {return el.dataIndex !== checkColumns[i]});

    setColumns(filteredColumns);
    setCheckedColumns(checkColumns);
  };

  const menu = () => {
    return (
      <Menu
        key="1"
        style={{
          overflowY: "scroll",
          maxHeight: "15rem",
        }}
      >
        {columnsData.map((item, index) => {
          return (
            <Menu.Item key={index}>
              <Checkbox key={index} id={item.dataIndex} onChange={onChange} defaultChecked>
                {item.title}
              </Checkbox>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  return (
    <div>
      <Dropdown trigger={["click"]} overlay={menu} onVisibleChange={handleVisibleChange} visible={visible}>
        <Tooltip title="Show/Hide Columns" placement="bottom">
          <Button color="primary" style={{ float: "right" }}>
            <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "16px" }} src={ShowAndHide} alt="invoice" />
          </Button>
        </Tooltip>
      </Dropdown>
      <br /><br />
      <ReactDragListView.DragColumn {...dragProps}>
        <Table
          size="small"
          sticky={true}
          scroll={{ y: "58vh", x: "100%" }}
          columns={finalColumns}
          dataSource={gridData}
          components={components}
          pagination={false}
          onChange={handleChange}
        />
      </ReactDragListView.DragColumn>
    </div>
  );
};

export default TableForGPReport;
