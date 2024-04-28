/* eslint-disable */

import React from 'react'
import * as c3 from 'c3';
import 'c3/c3.css';


const AreaChart=(props)=> {
    const {areaChartdata,areaChartProperties,fullScreenValue,uniqueIndex,colSpace}=props
    /* const kpiId = element.kpi_id;
    const drillDownInputFilter = element.drilldown_inputfilters;
    const dashboardId = element.nt_dashboard_id;
    const drillDownKpiId = element.drilldown_kpi_id;
    const drillDownKpiTitle = element.title;
    const widgetHeight = element.widget_height;
    const colSpace = element.column_space;
    const areaChartdata = hideChartData === "Y" ? [] : dashboardDataInState[element.kpi_id];
    const areaChartProperties = JSON.parse(element.properties); */
    const firstTenElementsArray = [];

    if (areaChartdata !== undefined) {
      let chartSize={}
      if(colSpace==="6"){
        chartSize= {
          height: 220,
          width: 500,
        }
      }else{
        chartSize= {
          height: 200,
          width: 335,
        }
      }

      for (let index = 0; index < areaChartdata.length; index += 1) {
        const element = areaChartdata[index];
        firstTenElementsArray.push(element.slice(0, 11));
        // firstTenElementsArray.push(element)
      }


      const chart = c3.generate({
        bindto: `#chart${uniqueIndex}`,
        data: {
          x: "x",
          columns: fullScreenValue === false ? firstTenElementsArray.slice(0, 3) : areaChartdata,
          type: "area",
          /* colors: {
            // pattern: [areaChartProperties['barColor']],
            "Current Year": [areaChartProperties["currYearColor"]],
            "Previous Year": [areaChartProperties["prevYearColor"]],
            [areaChartProperties["X"]]: [areaChartProperties["barColor"]],
          }, */
          color: function (color, d) {
            return color;
          },
        },
        legend: {
          position: "bottom",
        },

        bar: {
          width: {
            ratio: 0.7,
          },
          space: 0.15,
          // spacing: 9
        },
        size: chartSize,
        axis: {
          x: {
            type: "categorized", // this needed to load string x value
            tick: {
              multiline: true,
              multilineMax: 2,
              // multilineMax: 1,
            },
            // height: 80,
          },
          y: {
            
            tick: {
              format: function (d) {
                if (d / 1000000000 >= 1) {
                  return +(d / 1000000000).toFixed(1) + " B";
                } else if (d / 1000000 >= 1) {
                  return +(d / 1000000).toFixed(1) + " M";
                } else if (d / 1000 >= 1) {
                  return +(d / 1000).toFixed(1) + " K";
                } else {
                  return d;
                }
              },
            },
            label: {
              text: areaChartProperties["Y"],
            },
          },
        },
      });
      fullScreenValue === true ? chart.resize({ height: 480, width: 1080 }) : "";
    }
    return (
      <>
        <div id={`chart${uniqueIndex}`} />
      </>
    );
}

export default AreaChart
