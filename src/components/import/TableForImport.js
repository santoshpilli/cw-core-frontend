import React from "react";
import { Table } from "antd";
import { Resizable } from "react-resizable";
// const { Text } = Typography;

const ResizableCell = (props) => {
  const { onResize, width, ...restProps } = props;

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

const components = {
  header: {
    cell: ResizableCell,
  },
};

const TableForImport = (props) => {
  const {columnsData,gridData,rowSelection}=props
  return (
    <div>
      <Table
        size="small"
        sticky={true}
        scroll={{ y: "58vh", x: "100%" }}
        columns={columnsData}
        components={components}
        dataSource={gridData}
        pagination={false}
        rowSelection={rowSelection}
        rowClassName={(record) => record.status === "Has Error" ? "row-light" : "row-dark"}
      />
    </div>
  );
};

export default TableForImport;
