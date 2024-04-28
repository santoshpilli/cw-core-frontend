// /* eslint-disable */

// import React from 'react'
// import * as c3 from 'c3';
// import 'c3/c3.css';


// const DonutChart=(props)=> {
//     const {donutChartdata,donutChartProperties,fullScreenValue,uniqueIndex,colSpace}=props
//     const defaultColors = ["#5E77FF","#7B90FF","#BCC5F9"," #E1E6FF"]
//     const firstEightElementsArray = []

//     if (donutChartdata !== undefined) {
//         let chartSize={}
//         if(colSpace==="12"){
//           chartSize= {
//             height: 220,
//             width: 550,
//           }
//         }else{
//           chartSize= {
//             height: 200,
//             width: 550,
//           }
//         }
//         if (donutChartdata.length > 0) {
//           const arrayElements = donutChartdata[1]
//           for (let index = 0; index < arrayElements.length; index += 1) {
//             const element = arrayElements[index]
//             firstEightElementsArray.push(element.slice(0, 5))
//             // firstTenElementsArray.push(element)
//           }
//           let donutColorData = ''
          
//             const donutColor = donutChartProperties.donutcolor
//             const replaceSquareBrackets = donutChartProperties.donutcolor !== undefined ? donutColor.replace(/[\[\]']+/g, '') : ''
//             const replaceAllDoubleQuotes = replaceSquareBrackets.replace(/\"/g, '')
//             donutColorData = replaceAllDoubleQuotes.split(',')
            
//             const chart = c3.generate({
//               bindto: `#chart${uniqueIndex}`,
//               data: {
//                 columns: fullScreenValue === false ? firstEightElementsArray.slice(0, 5) : donutChartdata[1],
//                 type: 'donut',
//               },
//               color: {
//                 pattern:donutColorData?donutColorData:defaultColors,
//               },
//               donut: {
//                 // title: fullScreenValue===true?`Total:${this.amountFormat(donutChartdata[0])}`:'',
//                 // title: `Total:${this.amountFormat(donutChartdata[0])}`,
//               },
//               legend: {
//                 position: 'right',
//               },
//               size: chartSize,
//             })
//             fullScreenValue === true ? chart.resize({ height: 350, width: 1000 }) : ''
          
//         }
//       }
//     return (
//       <>
//         <div id={`chart${uniqueIndex}`} />
//       </>
//     );
// }

// export default DonutChart


import React, { useEffect } from 'react';
import * as c3 from 'c3';
import 'c3/c3.css';

const DonutChart = (props) => {
    const { donutChartdata, donutChartProperties, fullScreenValue, uniqueIndex, colSpace } = props;
    const defaultColors = ["#5E77FF", "#7B90FF", "#BCC5F9", " #E1E6FF"];
    const firstEightElementsArray = [];

    useEffect(() => {
        if (donutChartdata && donutChartdata.length > 0) {
            const arrayElements = donutChartdata[1];
            for (let index = 0; index < arrayElements.length; index += 1) {
                const element = arrayElements[index];
                firstEightElementsArray.push(element.slice(0, 10));
            }

            let chartSize = {};
            if (colSpace === "12") {
                chartSize = {
                    height: 220,
                    width: 550,
                };
            } else {
                chartSize = {
                    height: 200,
                    width: 550,
                };
            }

            let donutColorData = '';
            const donutColor = donutChartProperties.donutcolor;
            const replaceSquareBrackets = donutChartProperties.donutcolor !== undefined ? donutColor.replace(/[\[\]']+/g, '') : '';
            const replaceAllDoubleQuotes = replaceSquareBrackets.replace(/\"/g, '');
            donutColorData = replaceAllDoubleQuotes.split(',');

            const chart = c3.generate({
                bindto: `#chart${uniqueIndex}`,
                data: {
                    columns: fullScreenValue === false ? firstEightElementsArray : donutChartdata[1],
                    type: 'donut',
                },
                color: {
                    pattern: donutColorData ? donutColorData : defaultColors,
                },
                donut: {},
                legend: {
                    position: 'right',
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
    }, [donutChartdata, donutChartProperties, fullScreenValue, uniqueIndex, colSpace]);

    return (
        <div id={`chart${uniqueIndex}`} />
    );
}

export default DonutChart;
