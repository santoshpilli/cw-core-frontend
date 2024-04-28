/* eslint-disable */

import React from 'react'
import * as c3 from 'c3';
import 'c3/c3.css';


const GaugeChart=(props)=> {
    const {gaugeChartdata,gaugeChartProperties,fullScreenValue,uniqueIndex}=props

    if (gaugeChartdata !== undefined) {       
          if (gaugeChartdata !== undefined) {
            const gaugeChartArr = gaugeChartdata[0]
            const chart = c3.generate({
              bindto: `#chart${uniqueIndex}`,
              data: {
                columns: [[gaugeChartProperties['X'], gaugeChartArr[gaugeChartProperties['X']]]],
                type: 'gauge',
              },
              color: {
                pattern: [[gaugeChartProperties['gaugeColor']]],
              },

              gauge: {
                label: {
                  show: true, // to turn off the min/max labels.
                },
                min: gaugeChartProperties['min'], // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
                max: gaugeChartProperties['max'], // 100 is default
              },
              size: {
                height: 200,
                width: 350,
              },
            })
            fullScreenValue === true ? chart.resize({ height: 400, width: 1000 }) : ''
          }
        
      }
    return (
      <>
        <div id={`chart${uniqueIndex}`} />
      </>
    );
}

export default GaugeChart
