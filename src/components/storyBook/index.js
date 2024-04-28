import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, Tooltip, Result, Modal,Popover } from "antd";
import { upsertTabData } from "../../services/generic";
import { useGlobalContext,useWindowContext } from "../../lib/storage";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({});

function QuoteApp(props) {
  let identiFiersData = props.identiFiers;
  let laneDatas = props.laneData;
  let laneJsonObj = {};

  let lanePureData = [];
  for (let key in identiFiersData) {
    for (let keys in laneDatas) {
      if (laneDatas[keys] === identiFiersData[key]["key"]) {
        laneJsonObj[identiFiersData[key]["key"]] = identiFiersData[key]["value"];
      }
    }
  }

  props.cardData.filter((data) => {
    for (let key in data) {
      lanePureData.push(data[key]);
    }

    return 0;
  });

  const [stateTemp, setStateTemp] = useState(lanePureData);
  const [isUpsertRecordSuccess, setIsUpsertRecordSuccess] = useState(false);
  const [upsertSuccessFailedStatus, setUpsertSuccessFailedStatus] = useState("");
  const [upsertSuccessFailedMessage, setUpsertSuccessFailedMessage] = useState("");
  const { globalStore, setGlobalStore } = useGlobalContext();
  const { windowStore } = useWindowContext();
  const windowDefinition = { ...windowStore.windowDefinition };
  const { userData } = globalStore;
  const Themes = userData.CW360_V2_UI;
  const move = (source, destination, droppableSource, droppableDestination, headerTabData, statusId, laneData) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const recordId = removed["recordId"];

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    for (let j in removed) {
      if (j.includes("_iden")) {
        delete removed[j];
      }
      if (j.includes("key")) {
        delete removed[j];
      }
      if (j.includes("recordId")) {
        delete removed[j];
      }
    }

    removed[statusId] = laneData[droppableDestination.droppableId];

    const stringifiedFields = JSON.stringify(removed);
    const updatedStrings = stringifiedFields.replace(/\\"/g, '\\"');
    const stringRequest = JSON.stringify(updatedStrings);

    const headerTabId = headerTabData.ad_tab_id;

    upsertTabData(windowDefinition.ad_window_id,headerTabId, recordId, stringRequest).then((upsertResponse) => {
      if (upsertResponse.data.data.upsertTab.status === "200") {
        setUpsertSuccessFailedStatus("success");
        setUpsertSuccessFailedMessage(upsertResponse.data.data.upsertTab.message);
        setIsUpsertRecordSuccess(true);
      } else {
        setUpsertSuccessFailedMessage(upsertResponse.data.data.upsertTab.message);
        setUpsertSuccessFailedStatus("error");
      }
    });

    return result;
  };

  const handleCancelSuccessModal = () => {
    setIsUpsertRecordSuccess(false);
  };

  function onDragEnd(result) {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(stateTemp[sInd], source.index, destination.index);
      const newState = [...stateTemp];
      newState[sInd] = items;
      setStateTemp(newState);
    } else {
      const result = move(stateTemp[sInd], stateTemp[dInd], source, destination, props.hederTabData, props.statusID, props.laneData);
      const newState = props.cardData;
      for (let key in newState[sInd]) {
        newState[sInd][key] = result[sInd];
      }

      for (let key in newState[dInd]) {
        newState[dInd][key] = result[dInd];
      }
      setStateTemp(newState);
    }
  }
  return (
    <Card
      bordered={true}
      bodyStyle={{ padding: "0px" }}
      style={{ overflow: "scroll", height: "79vh", backgroundColor: "#f5f5f5", border: "0px solid rgb(245, 245, 245)" }}
    >
      <div style={{ marginTop: "-5px" }}>
        <div style={{ display: "inline-flex" }}>
          <DragDropContext onDragEnd={onDragEnd}>
            {props.cardData.map((el, ind) => {
              return (
                <Droppable key={ind} droppableId={`${ind}`}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
                      <Card
                        headStyle={{
                          height: 0,
                          minHeight: 28,
                          color: Themes.appTheme.primaryColor,
                          fontWeight: 600,
                          fontFamily:"Inter",
                          margin: "0px -1px -20px 0px",
                          position: "relative",
                          fontSize: "12px",
                          padding: "0px 0px 0px 10px",
                          borderRadius: "2px 2px 0 0",
                        }}
                        title={<span style={{ position: "relative", top: "-11px" }}>{laneJsonObj[props.laneData[ind]].toUpperCase()}</span>}
                        style={{ margin: "0px 5px 0px 0px", width: "17rem", backgroundColor: "rgb(245, 245, 245)" }}
                      >
                        {el[props.laneData[ind]].map((item, index) => {
                          return (
                            <Draggable key={item.key} draggableId={item.key} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-around",
                                    }}
                                  >
                                    {
                                      <Card
                                        bodyStyle={{ padding: "5px", width: "270px", /* height: "6rem" */ }}
                                        style={{ width: 300, marginTop: 12, boxShadow: "0px 0px 0px 0px, rgb(3 8 10 / 7%) 0px 0px 5px 0px" }}
                                      >
                                        <Tooltip placement="topLeft" title={item["9E5E785D81B040B0AF932DA0307D6CED_iden"]}>
                                          <div /* style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} */>
                                            <span style={{ fontSize: "12px", fontWeight: 600,fontFamily:"Inter", color: `${item.title_field_color === "" || item.title_field_color === null ?  Themes.appTheme.primaryColor : item.title_field_color}`}}>
                                                
                                              {item.recordTitlesData.map((record, index) => (
                                                       <span>&ensp;{record.titleName},</span>
                                              ))}
                                            </span>
                                            {/* <span style={{ fontSize: "14px", fontWeight: 600, color: "#607D8B" }}>{item["9E5E785D81B040B0AF932DA0307D6CED_iden"]}</span> */}
                                          </div>
                                        </Tooltip>
                                        <div>
                                          <span style={{ fontSize: "11px", fontWeight: 400,opacity:0.8,color:`${item.row1_field_color === null || item.row1_field_color === 'null' || item.row1_field_color === "" ? "#425B6D":item.row1_field_color }` }}>
                                          {item.recordRow1Data.map((record, index) => (
                                                      <span>&ensp;{record.recordRow1Name}</span>
                                           ))}
                                          </span>
                                          {/* <span style={{ fontSize: "12px", fontWeight: 600 }}>{item["5F8121BD312743A59719933D045B7A14"]}</span> */}
                                        </div>
                                        <div>
                                          <span style={{ fontSize: "11px", fontWeight: 400,opacity:0.8,color:`${item.row2_field_color === null || item.row2_field_color === 'null' || item.row2_field_color === "" ? "#425B6D":item.row2_field_color }` }}>
                                          {item.recordRow2Data.map((record, index) => (
                                                <span>&ensp;{record.recordRow2Name}</span>
                                           ))}
                                          </span>
                                        </div>
                                        <div>
                                          <span style={{ fontSize: "11px", fontWeight: 400,opacity:0.8,color:`${item.row3_field_color === null || item.row3_field_color === 'null' || item.row3_field_color === "" ? "#425B6D":item.row3_field_color }` }}>
                                          {item.recordRow3Data.map((record, index) => (
                                                <span>&ensp;{record.recordRow3Name}</span>
                                           ))}
                                          </span>
                                        </div>
                                        {/* <Tooltip placement="bottom" title={item["96A0744488744727928537FCF25801DA"]}>
                                          <div
                                            dangerouslySetInnerHTML={{ __html: item["96A0744488744727928537FCF25801DA"] }}
                                            style={{ height: "30px", padding: "0px", overflow: "hidden scroll" }}
                                          />
                                        </Tooltip> */}
                                      </Card>
                                    }
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                      </Card>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </DragDropContext>
        </div>
      </div>
      <div>
        <Modal width="26%" style={{ top: "7rem" }} visible={isUpsertRecordSuccess} footer={[]} onCancel={handleCancelSuccessModal}>
          <Result
            status={upsertSuccessFailedStatus}
            title={upsertSuccessFailedStatus === "success" ? upsertSuccessFailedMessage : ""}
            subTitle={upsertSuccessFailedStatus === "error" ? upsertSuccessFailedMessage : ""}
          />
        </Modal>
      </div>
    </Card>
  );
}

export default QuoteApp;
