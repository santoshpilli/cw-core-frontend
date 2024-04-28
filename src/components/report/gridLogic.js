import { Image } from "antd";
import dayjs from "dayjs";
import moment from 'moment';

const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const getDayJsValue = (value, format) => {
  if (value) {
    return dayjs(value,"YYYY-MM-DD HH:mm:ss").format(format);
  } else {
    return value;
  }
};


const gridLogic=(gridData,reportFields)=>{
    try {
        const reportsGridArray = [];
        const finalArrayToPush = [];
        let dataArray;
        let totalCount=0;

        if (gridData.length > 0) {
          for (let index = 0; index < gridData.length; index += 1) {
            if (typeof gridData[index] === "string" ) {
              dataArray = JSON.parse(gridData[index]);
              reportsGridArray.push(dataArray);
            } else {
              dataArray = gridData[index];
              reportsGridArray.push(dataArray);
            }
          }
          for (let index = 0; index < reportsGridArray.length; index++) {
            const gridData = reportsGridArray[index];
            totalCount = totalCount + 1
            for (let indexF = 0; indexF < reportFields.length; indexF++) {
              const fieldData = reportFields[indexF];
              if(fieldData.type==="String"){
                const fieldName = fieldData.fieldName
                gridData[fieldName]= gridData[fieldName]===null || gridData[fieldName]===undefined ? '' : (gridData[fieldName]).toString()
              }
              if(fieldData.type==="List"){
                const fieldName = fieldData.fieldName
                const valuesArr = fieldData.Values
                for (let indexV = 0; indexV < valuesArr.length; indexV++) {
                  const valueElement = valuesArr[indexV];    
                  if(valueElement.key===gridData[fieldName]) {
                    gridData[fieldName]=valueElement.value
                  }       
                }
              }
              if(fieldData.type==="Yes/No"){
                const fieldName = fieldData.fieldName
                if(gridData[fieldName]==="N"){
                  gridData[fieldName]="No"
                }else{
                  gridData[fieldName]="Yes"
                }
              }
              if(fieldData.type==="WYSIWYG Editor"){
                const fieldName = fieldData.fieldName
                gridData[fieldName] = <div dangerouslySetInnerHTML={{ __html: gridData[fieldName] }}></div>
              }
              if(fieldData.type==="Image"){
                const fieldName = fieldData.fieldName
                if(gridData[fieldName]!==null){
                  gridData[fieldName] =  <Image src={`${gridData[fieldName]}`} width={100} height={100} />
                  // gridData[fieldName] =  <Image src={`${gridData[fieldName]}`} width={100} height={100} />
                }
              }
              if(fieldData.type==="Date"){
                const fieldName = fieldData.fieldName
                if(gridData[fieldName]===null || gridData[fieldName]===undefined){   
                }else{
                  const userPreferencesData = JSON.parse(localStorage.getItem("userPreferences"));
                  const userPreferences = userPreferencesData ? userPreferencesData : JSON.parse(localStorage.getItem("userPreferences"));
                  gridData[fieldName] = getDayJsValue(gridData[fieldName].concat(" 00:00:00"), userPreferences.dateFormat);
                }
              }
            }
          }
          
          const keysArray = Object.keys(reportsGridArray[0]);  
          for (let i = 0; i < keysArray.length; i += 1) {
            for (let index = 0; index < reportFields.length; index += 1) {            
              if (keysArray[i] === reportFields[index].fieldName) {
                finalArrayToPush.push(reportFields[index]);                
                break;
              }              
            }
          }

          finalArrayToPush.sort(function (a, b) {
            return a.sequence_no - b.sequence_no;
          });
        }
        return {finalArrayToPush:finalArrayToPush,finalGridData:reportsGridArray,totalRecords:totalCount} 
    } catch (error) {
    }
 }

export{
  gridLogic
}