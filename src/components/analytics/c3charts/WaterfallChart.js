/* eslint-disable */

import React from 'react'
import * as c3 from 'c3';
import 'c3/c3.css';


const WaterfallChart=(props)=> {
    const {waterFallChartdata,waterFallChartProperties,fullScreenValue,uniqueIndex,colSpace}=props
    /* const kpiId = element.kpi_id;
    const drillDownInputFilter = element.drilldown_inputfilters;
    const dashboardId = element.nt_dashboard_id;
    const drillDownKpiId = element.drilldown_kpi_id;
    const drillDownKpiTitle = element.title;
    const widgetHeight = element.widget_height;
    const colSpace = element.column_space;
    const waterFallChartdata = hideChartData === "Y" ? [] : dashboardDataInState[element.kpi_id];
    const waterFallChartProperties = JSON.parse(element.properties); */

    if (waterFallChartdata !== undefined) {
      
      let water_data = [
        ['Income' , 1500],
        ['Rent', -480],
        ['Eat', -170],
        ['Sold', 140],
      ];
      /* let water_data = [

        [
           "Revenue",
           10767692.01
        ],
        [
           "Wastage",
           -81045.31
        ]
      ]; */

      water_data.push(['Result', water_data.reduce((acc, val) => acc + val[1], 0)])
      let val = ['up']
      let val2 = ['down']
      let gap = ['gap', 0]

      water_data.forEach((elem, index) => {
        if (elem[1] >= 0) {
          val.push(elem[1])
          val2.push('')
          gap.push(elem[1] + gap[gap.length - 1])
        } else {
          val.push('')
          val2.push(Math.abs(elem[1]))
          gap[index + 1] += elem[1]
          gap.push(gap[index + 1])
        }
      })
      gap[gap.length - 2] = 0
      let data = [['x', ...water_data.map(elem => elem[0], [])], gap, val, val2]

      var chart = c3.generate({
        bindto: `#chart${uniqueIndex}`,
        size: {
          height: 230,
          width: 350,
        },
        data: {
          x: 'x',
          columns: data,
          type: 'bar',
          groups: [['up', 'down', 'gap']],
          order: null,
          colors: {
            gap: 'transparent',
          },
          /* color: function(color, d) {
            let result = ''
            switch (d.id) {
              case 'up':
                result = [waterFallChartProperties['upColor']]
                break
              case 'down':
                result = [waterFallChartProperties['downColor']]
                break
              default:
                result = 'transparent'
                break
            }
            return result
          }, */
          labels: {
            format: {
              up: function(v, id, i, j) {
                if (v === 0) {
                } else {
                  if (v / 1000000000 >= 1) {
                    return +(v / 1000000000).toFixed(1) + ' B'
                  } else if (v / 1000000 >= 1) {
                    return +(v / 1000000).toFixed(1) + ' M'
                  } else if (v / 1000 >= 1) {
                    return +(v / 1000).toFixed(1) + ' K'
                  } else {
                    return v
                  }
                }
              },
              down: function(v, id, i, j) {
                if (v === 0) {
                } else {
                  if (v / 1000000000 >= 1) {
                    return '-' + (v / 1000000000).toFixed(1) + ' B'
                  } else if (v / 1000000 >= 1) {
                    return '-' + (v / 1000000).toFixed(1) + ' M'
                  } else if (v / 1000 >= 1) {
                    return '-' + (v / 1000).toFixed(1) + ' K'
                  } else {
                    return '-' + v
                  }
                }
              },
            },
          },
        },
        axis: {
          x: {
            type: 'category',
          },
          y: {
            padding: { top: 100, bottom: 100 },
            tick: {
              format: function(d) {
                if (d / 1000000000 >= 1) {
                  return +(d / 1000000000).toFixed(1) + ' B'
                } else if (d / 1000000 >= 1) {
                  return +(d / 1000000).toFixed(1) + ' M'
                } else if (d / 1000 >= 1) {
                  return +(d / 1000).toFixed(1) + ' K'
                } else {
                  return d
                }
              },
            },
            /* label: {
                  text: [waterFallChartProperties['LY']],
                  position: 'outer-middle',
                }, */
          },
        },
        legend: {
          show: false,
        },
        tooltip: {
          format: {
            value: function(value, ratio, id) {
              if (id === 'up' && value !== 0) {
                if (value / 1000000000 >= 1) {
                  return +(value / 1000000000).toFixed(1) + ' B'
                } else if (value / 1000000 >= 1) {
                  return +(value / 1000000).toFixed(1) + ' M'
                } else if (value / 1000 >= 1) {
                  return +(value / 1000).toFixed(1) + ' K'
                }
                return value
              }

              if (id === 'down' && value !== 0) {
                if (value / 1000000000 >= 1) {
                  return '-' + (value / 1000000000).toFixed(1) + ' B'
                } else if (value / 1000000 >= 1) {
                  return '-' + (value / 1000000).toFixed(1) + ' M'
                } else if (value / 1000 >= 1) {
                  return '-' + (value / 1000).toFixed(1) + ' K'
                }
                return '-' + value
              }
            },
          },
        },
        onrendered: function() {
          // chart = document.getElementById('waterfall');
          // pathArray = []
          // chart.querySelectorAll('.c3-chart-bars > g:not(.c3-target-gap) path').forEach(path => {
          //     if (path.__data__.value !== 0) pathArray.push(path)
          // })
        },
      })
      fullScreenValue === true ? chart.resize({ height: 480, width: 1000 }) : ''
    }
    return (
      <>
        <div id={`chart${uniqueIndex}`} />
      </>
    );
}

export default WaterfallChart
