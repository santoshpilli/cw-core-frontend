import axios from "axios";
// import { genericUrl, fileDownloadUrl } from "../constants/serverConfig";
import { generateToken } from "./generateToken";
import { getOAuthHeaders } from "../constants/oAuthValidation";

const genericUrl = process.env.REACT_APP_genericUrl;
const fileDownloadUrl = process.env.REACT_APP_fileDownloadUrl;
let localToken;
let appId;
const { access_token } = getOAuthHeaders();
const genericInstance = axios.create();
genericInstance.defaults.baseURL = genericUrl;
genericInstance.defaults.method = "POST";
genericInstance.defaults.headers.post["Content-Type"] = "application/json";

const updateLocalToken = () => {
  localToken = JSON.parse(localStorage.getItem("authTokens"));
};

const updateAppid = () => {
  appId = localStorage.getItem("appId");
};

genericInstance.interceptors.request.use(
  (config) => {
    if (!localToken) {
      updateLocalToken();
    }
    if (!appId) {
      updateAppid();
    }
    config.headers.Authorization = `Bearer ${access_token}`;
    config.headers['appId'] = appId;
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

genericInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { message } = JSON.parse(JSON.stringify(error));
    if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
      generateToken();
    } else {
      return Promise.reject(error);
    }
  }
);

const displayError = (error) => {
  console.error(JSON.stringify(error, null, 2));
};

const publishData = async (finalJson) => {
    try {
      const publishResponse = await genericInstance({
        data: {
          query: `mutation {
            upsertReportDetails(reportStr: ${finalJson}) {
                messageCode
                title
                message
                data
            }
        }`,
        },
      });
      return publishResponse.data.data.upsertReportDetails;
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      return null;
    }
};

const getTasks = async () => {
  try {
    const tasksData = await genericInstance({
      data: {
        query: `query {
          getDagTasks{
              csDWTaskId
              name
             }
        }`,
      },
    });
    return tasksData.data.data.getDagTasks;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getTaskDetails = async (id) => {
  try {
    const tasksData = await genericInstance({
      data: {
        query: `query {
          getDagTaskDetails(dwtaskId:"${id}"){
              csDWTaskId
              name
              paramsJson
              cwAnalyticsUrl
              dagUrl
              csDagTaskScheduler{
                cSDagTaskSchedulerId
                frequency
                scheduleinfo
                startDate
                nextSchDate   
                lastRunDate
            }
          }
        }`,
      },
    });
    return tasksData.data.data.getDagTaskDetails;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const scheduleData = async (finalJson, name, id) => {
  try {
    const scheduleResponse = await genericInstance({
      data: {
        query: `mutation {
          scheduleDagReport(dwTask: {
            csDWTaskId: ${id !== "" ? `"${id}"` : null}
            name: "${name}"
            frequency: "DI"
            paramsJson: ${finalJson}
          })
          {
            messageCode
            message
            data
          }
    }`,
      },
    });
    return scheduleResponse.data.data.scheduleDagReport;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const saveData = async (finalJson, name, id) => {
  try {
    const saveResponse = await genericInstance({
      data: {
        query: `mutation {
          upsertDagTask(dwTask: {
            csDWTaskId: ${id !== "" ? `"${id}"` : null}
            name: "${name}"
            frequency: "DI"
            paramsJson: ${finalJson}
          })
          {
            messageCode
            message
          }
    }`,
      },
    });
    return saveResponse.data.data.upsertDagTask;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const upsertScheduleData = async (id, schedularId, frequency, startDate, json) => {
  try {
    const scheduleResponse = await genericInstance({
      data: {
        query: `mutation{
          upsertScheduleDagTask(scheduleDagTask:{ 
              cSDagTaskSchedulerId: ${schedularId !== "" ? `"${schedularId}"` : null}
              csDWTaskId: ${id !== "" ? `"${id}"` : null} 
              frequency:"${frequency}"
              scheduleinfo: "${json}"
              startDate:"${startDate}"
          })
          {
              messageCode
              message
          }
      }`,
      },
    });
    return scheduleResponse.data.data.upsertScheduleDagTask;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const getConnections = async () => {
  try {
    const connections = await genericInstance({
      data: {
        query: `query{
          getCWConnections{
              connections{
                  connectionId
                  connectionType
                  host
              }
          }
      }`,
      },
    });
    return connections.data.data.getCWConnections;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const testConnection = async (id) => {
  try {
    const testConnection = await genericInstance({
      data: {
        query: `mutation {
          testCWConnection(connectionId:"${id}"
          ){
              messageCode
              message
          }
    }`,
      },
    });
    return testConnection.data.data.testCWConnection;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

const newConnection = async (json) => {
  try {
    const newConnection = await genericInstance({
      data: {
        query: `mutation {
          createCWConnection(connection:"${json}"
          )
          {
              messageCode
              message
          }
    }`,
      },
    });
    return newConnection.data.data.createCWConnection;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
};

export {
    publishData,
    getTasks,
    getTaskDetails,
    scheduleData,
    saveData,
    upsertScheduleData,
    getConnections,
    testConnection,
    newConnection
}