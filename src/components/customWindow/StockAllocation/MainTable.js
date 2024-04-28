import React, { useState } from "react";
import { Table } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const MainTable = ({ mainData, mainColumns, nestedData, nestedColumns, takeRecordKey, loading }) => {
    const [nestedKeys, setNestedKeys] = useState([]);
    const expandedRowRender = (row) => { 
        let inNestedData = [];
        for (let index = 0; index < nestedData.length; index++) {
            if (row.key == index) {
                inNestedData = nestedData[index];
            }
        }
        return (
            <Table
                style={{ fontSize: "12px" }}
                size="small"
                dataSource={inNestedData}
                columns={nestedColumns}
                pagination={false}
            />
        );
    };

    const handleExpand = (expanded, record) => {
        takeRecordKey(record.key);
        setNestedKeys([record.key]);
    };

    return (
        <Table 
            sticky={true}
            pagination={false}
            style={{ fontSize: "12px" }}
            size="small"
            scroll={{x: "100%", y: "65vh"}}
            dataSource={mainData}
            columns={mainColumns}
            loading={{
                spinning: loading,
                indicator: <LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />,
            }}
            expandable={{ expandedRowRender }}
            expandedRowKeys={nestedKeys}
            onExpand={handleExpand}
        />
    );
};

export default MainTable;