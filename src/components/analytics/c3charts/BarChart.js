/* eslint-disable */
import React, { useRef, useEffect } from 'react';
import * as c3 from 'c3';
import 'c3/c3.css';
import './index.css';

const BarChart = (props) => {
    const { barChartdata, barChartProperties, fullScreenValue, uniqueIndex, colSpace } = props;
    const chartRef = useRef(null);

    useEffect(() => {
        if (barChartdata) {
            const sider = JSON.parse(localStorage.getItem("lowerSubMenu"));
            let firstTenElementsArray = [];
            let maxValue = 0;

            for (let index = 0; index < barChartdata.length; index += 1) {
                const element = barChartdata[index];
                firstTenElementsArray.push(element.slice(0, 11));
            }

            barChartdata[1].forEach((tre, ind) => {
                if (ind !== 0 && maxValue < parseInt(tre)) {
                    maxValue = parseInt(tre);
                }
            });

            let chartSize = {};
            if (colSpace === "6") {
                chartSize = {
                    height: 220,
                    width: 570,
                };
            } else {
                chartSize = {
                    height: 200,
                    width: 480,
                };
            }

            const chart = c3.generate({
                bindto: `#chart${uniqueIndex}`,
                data: {
                    x: "x",
                    columns: fullScreenValue === false ? firstTenElementsArray.slice(0, 3) : barChartdata,
                    type: "bar",
                    colors: {
                        "Current Year": barChartProperties.currYearColor ? barChartProperties.currYearColor : "#4A90E2",
                        "Previous Year": barChartProperties.prevYearColor ? barChartProperties.prevYearColor : "#E1E6FF",
                        [barChartProperties["X"]]: [barChartProperties["barColor"]],
                    },
                    color: function (color, d) {
                        return color;
                    },
                },
                legend: {
                    position: "inset",
                    inset: {
                        anchor: 'top-right',
                        x: -1,
                        y: -15,
                        step: 1
                    },
                },
                bar: {
                    width: 16,
                    space: 0.15,
                },
                size: chartSize,
                axis: {
                    x: {
                        type: "categorized",
                        tick: {
                            fit: true,
                            multiline: true,
                            multilineMax: 2
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
                            position: 'outer-middle'
                        },
                    },
                },
                grid: {
                    y: {
                        lines: [
                            { value: maxValue / 4, class: 'grid8' },
                            { value: maxValue * (3 / 4), class: 'grid8' },
                            { value: maxValue / 2, class: 'grid8' },
                            { value: maxValue, class: 'grid8' },
                        ]
                    }
                }
            });

            if (fullScreenValue === true && sider?.length > 0) {
                chart.resize({ height: 300, width: 900 });
            } else if (fullScreenValue === false && sider === null) {
                chart.resize({ height: 227, width: 570 });
            } else if (fullScreenValue === false && sider !== null) {
                chart.resize({ height: 220, width: 450 });
            } else if (fullScreenValue === true && sider === null) {
                chart.resize({ height: 320, width: 1100 });
            };
        }
    }, [barChartdata, barChartProperties, colSpace, fullScreenValue, uniqueIndex]);

    return (
        <>
            {barChartdata &&
                <div style={{ paddingTop: '2%', right: 15 }} id={`chart${uniqueIndex}`} ref={chartRef} />
            }
        </>
    );
}

export default BarChart;
