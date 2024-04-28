// /* eslint-disable */

// import React from 'react'
// import * as c3 from 'c3';
// import 'c3/c3.css';
// import'./index.css'


// const LineChart=(props)=> {
//     const {lineChartdata,lineChartProperties,fullScreenValue,uniqueIndex}=props
//     const sider = JSON.parse(localStorage.getItem("lowerSubMenu"))
//     let maxValue=0;
//     let maxValue2=0;

//     if (lineChartdata !== undefined) {
//       lineChartdata[1].map((tre,ind)=>{
//         if(ind !== 0){
//            if(maxValue<parseInt(tre)){
//             maxValue=parseInt(tre)
//            }
//         }
//       })

//       lineChartdata[2]?.map((rew,index)=>{
//         if(index !== 0){
//            if(maxValue2<parseInt(rew)){
//             maxValue2=parseInt(rew)
//            }
//         }
//       })
      

//         const chart = c3.generate({
//           bindto: `#chart${uniqueIndex}`,
//           type: "line",
//           data: {
//             x: "x",
//             columns: lineChartdata,
//             colors: {
//               // pattern: [barChartProperties['barColor']],
//               "Current Year": lineChartProperties.currYearColor?lineChartProperties.currYearColor:"#2F3856",
//               "Previous Year": lineChartProperties.prevYearColor?lineChartProperties.prevYearColor:"#4A90E2",
//               // [barChartProperties["X"]]: [barChartProperties["barColor"]],
//             },
//           },
//           color: function (color, d) {
//             return color,d;
//           },
//           axis: {
//             x: {
//               type: "categorized", // this needed to load string x value
//               tick: {
//                 // rotate: 20,
//                 multiline: false,
//               },
//             },
//             y: {
//               tick: {
                
//                 format: function (d) {
//                   if (d / 1000000000 >= 1) {
//                     return +(d / 1000000000).toFixed(1) + " B";
//                   } else if (d / 1000000 >= 1) {
//                     return +(d / 1000000).toFixed(1) + " M";
//                   } else if (d / 1000 >= 1) {
//                     return +(d / 1000).toFixed(1) + " K";
//                   } else {
//                     return d;
//                   }
//                 },
//               },
//               height: 100,
//               label: {
//                 text: lineChartProperties["Y"],
//                 position: /* element.rotatechart === 'Y' ? '' :  */ "outer-middle",
//               },
//             },
//           },
//           legend: {
//             position: "inset",
//             inset:{
//               anchor:'top-right',
//               // x:-31,
//               // y:-7,
//               step:1
//             },
//           },
//           size: {
//             height: 240,
//           },
//           grid: {
//             y: {
//               lines: [
//                   {value: maxValue >maxValue2?maxValue/4:maxValue2/4,class:'grid8'},
//                   {value: maxValue>maxValue2?maxValue*(3/4):maxValue2*(3/4),class:'grid8'},
//                   {value: maxValue>maxValue2?maxValue/2:maxValue2/2,class:'grid8'},
//                   {value: maxValue>maxValue2?maxValue:maxValue2,class:'grid8'},
//                   // {value: 3900,class:'grid8'},
//                   // {value: 6900,class:'grid8'}
//               ]
//           }
//         }
//         });
//         if (fullScreenValue === true && sider?.length >0) {
//           chart.resize({ height: 300, width: 900 });
//       } else if (fullScreenValue === false && sider === null) {
//         chart.resize({ height: 237, width: 570 });
//           // Scenario 2: fullScreenValue is true but sider is null
//           // No resizing operation needed, chart remains unchanged
//       } else if (fullScreenValue === false && sider !== null) {
//         chart.resize({ height: 220, width: 450 });
//       } else if (fullScreenValue === true && sider === null) {
        
//         chart.resize({ height: 300, width: 1100 });
//       };
//     }
//     return (
//       <>
//         <div style={{paddingTop:'2%',right:'10px'}} id={`chart${uniqueIndex}`} />
//       </>
//     );
// }

// export default LineChart


import React, { useEffect, useRef } from 'react';
import * as c3 from 'c3';
import 'c3/c3.css';
import './index.css';

const LineChart = (props) => {
    const { lineChartdata, lineChartProperties, fullScreenValue, uniqueIndex } = props;
    const chartRef = useRef(null);
    const sider = JSON.parse(localStorage.getItem("lowerSubMenu"))
    useEffect(() => {
        if (lineChartdata) {
            let maxValue = 0;
            let maxValue2 = 0;

            // Calculate max values
            lineChartdata[1].forEach((tre, ind) => {
                if (ind !== 0 && maxValue < parseInt(tre)) {
                    maxValue = parseInt(tre);
                }
            });

            lineChartdata[2]?.forEach((rew, index) => {
                if (index !== 0 && maxValue2 < parseInt(rew)) {
                    maxValue2 = parseInt(rew);
                }
            });

            const chart = c3.generate({
                bindto: `#chart${uniqueIndex}`,
                type: "line",
                data: {
                    x: "x",
                    columns: lineChartdata,
                    colors: {
                        "Current Year": lineChartProperties.currYearColor ? lineChartProperties.currYearColor : "#2F3856",
                        "Previous Year": lineChartProperties.prevYearColor ? lineChartProperties.prevYearColor : "#4A90E2",
                    },
                },
                color: function (color, d) {
                    return color, d;
                },
                axis: {
                    x: {
                        type: "categorized",
                        tick: {
                            multiline: false,
                        },
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
                            text: lineChartProperties["Y"],
                            position: "outer-middle",
                        },
                    },
                },
                legend: {
                    position: "inset",
                    inset: {
                        anchor: 'top-right',
                        step: 1
                    },
                },
                size: {
                    height: 240,
                },
                grid: {
                    y: {
                        lines: [
                            { value: maxValue > maxValue2 ? maxValue / 4 : maxValue2 / 4, class: 'grid8' },
                            { value: maxValue > maxValue2 ? maxValue * (3 / 4) : maxValue2 * (3 / 4), class: 'grid8' },
                            { value: maxValue > maxValue2 ? maxValue / 2 : maxValue2 / 2, class: 'grid8' },
                            { value: maxValue > maxValue2 ? maxValue : maxValue2, class: 'grid8' },
                        ]
                    }
                }
            });

            if (fullScreenValue === true && sider?.length >0) {
              chart.resize({ height: 300, width: 900 });
          } else if (fullScreenValue === false && sider === null) {
            chart.resize({ height: 237, width: 570 });
              // Scenario 2: fullScreenValue is true but sider is null
              // No resizing operation needed, chart remains unchanged
          } else if (fullScreenValue === false && sider !== null) {
            chart.resize({ height: 220, width: 450 });
          } else if (fullScreenValue === true && sider === null) {
            
            chart.resize({ height: 300, width: 1100 });
          };
            // Cleanup function
            return () => {
                chart.destroy();
            };
        }
    }, [lineChartdata, lineChartProperties, fullScreenValue, uniqueIndex]);

    return (
        <div style={{ paddingTop: '2%', right: '10px' }} id={`chart${uniqueIndex}`} ref={chartRef} />
    );
}

export default LineChart;
