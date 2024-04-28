// /* eslint-disable */

// import React from "react";
// import * as c3 from "c3";
// import "c3/c3.css";

// const PieChart = (props) => {
//   const { pieChartdata, pieChartProperties, fullScreenValue, uniqueIndex,colSpace } = props;

//   let defaultPieColors = ["#5E77FF","#7B90FF","#BCC5F9"," #E1E6FF","#0047ff"];
//   let pieColorData = null;
//   if (pieChartdata !== undefined) {
//     let chartSize={}
//       if(colSpace==="6"){
//         chartSize= {
//           height: 220,
//           width: 550,
//         }
//       }else{
//         chartSize= {
//           height: 200,
//           width: 350,
//         }
//       }
//     // console.log("===Pie chart data====",pieChartdata.slice(0,6))
    
//     const pieColor = pieChartProperties.piecolor;
//     // console.log("=======>pieColor<========",pieColor)
//     const replaceSquareBrackets = pieChartProperties.piecolor !== undefined ? pieColor.replace(/[\[\]']+/g, "") : "";
//     const replaceAllDoubleQuotes = replaceSquareBrackets.replace(/\"/g, "");
//     pieColorData = replaceAllDoubleQuotes.split(","); 
//     const chart = c3.generate({
//       bindto: `#chart${uniqueIndex}`,
//       data: {
//         columns:fullScreenValue===false?pieChartdata.slice(0,5):pieChartdata,
//         type: "pie",
//       },
//       /* padding: {
//               top: 0,
//               right: 0,
//               bottom: 0,
//               left: 100,
//           }, */
//       /* pie: {
//                 label: {
//                   format: function(value) {
//                     if (value / 1000000000 >= 1) {
//                       return +(value / 1000000000).toFixed(1) + ' B'
//                     } else if (value / 1000000 >= 1) {
//                       return +(value / 1000000).toFixed(1) + ' M'
//                     } else if (value / 1000 >= 1) {
//                       return +(value / 1000).toFixed(1) + ' K'
//                     } else {
//                       return value
//                     }
//                   },
//                 },
//               }, */
//        color: {
//         pattern: pieColorData?pieColorData:defaultPieColors,
//       }, 
//       legend: {
//         position: "right",
//         /* inset: {
//             anchor: 'top-right',
//             x: 50,
//             y: 50,
//             step: 7
//         } */
//       },
//       size: chartSize,
//     });
//     // leftMenuThreeLines === true ? chart.resize({ height: 320, width: 550 }) : ''
//     // window.innerWidth <= 2634 ? chart.resize({ height: 500, width: 1200 }) :''
//     /* window.innerWidth <= 1317 ? chart.resize({ height: 230, width: 300 }) :''
//           window.innerWidth <= 1646 ? chart.resize({ height: 230, width: 700 }) :'' */
//     fullScreenValue === true ? chart.resize({ height: 350, width: 1000 }) : "";
//   }
//   return (
//     <>
//       <div id={`chart${uniqueIndex}`} />
//     </>
//   );
// };

// export default PieChart;

import React, { useEffect } from "react";
import * as c3 from "c3";
import "c3/c3.css";

const PieChart = (props) => {
  const { pieChartdata, pieChartProperties, fullScreenValue, uniqueIndex, colSpace } = props;

  useEffect(() => {
    let defaultPieColors = ["#5E77FF","#7B90FF","#BCC5F9"," #E1E6FF","#0047ff"];
    let pieColorData = null;

    if (pieChartdata !== undefined) {
      let chartSize = {};
      if (colSpace === "6") {
        chartSize = {
          height: 220,
          width: 550,
        };
      } else {
        chartSize = {
          height: 200,
          width: 350,
        };
      }

      const pieColor = pieChartProperties.piecolor;
      const replaceSquareBrackets = pieChartProperties.piecolor !== undefined ? pieColor.replace(/[\[\]']+/g, "") : "";
      const replaceAllDoubleQuotes = replaceSquareBrackets.replace(/\"/g, "");
      pieColorData = replaceAllDoubleQuotes.split(",");

      const chart = c3.generate({
        bindto: `#chart${uniqueIndex}`,
        data: {
          columns: fullScreenValue === false ? pieChartdata.slice(0, 5) : pieChartdata,
          type: "pie",
        },
        color: {
          pattern: pieColorData ? pieColorData : defaultPieColors,
        },
        legend: {
          position: "right",
        },
        size: chartSize,
      });

      if (fullScreenValue === true) {
        chart.resize({ height: 350, width: 1000 });
      }

      // Cleanup function
      return () => {
        chart.destroy();
      };
    }
  }, [pieChartdata, pieChartProperties, fullScreenValue, uniqueIndex, colSpace]);

  return <div id={`chart${uniqueIndex}`} />;
};

export default PieChart;

