import React, { useEffect, useRef } from 'react';
import { useResizeObserver } from './useResizeObserver';
import * as d3 from 'd3';
const LineChartComponent=(props)=> {
    const data = props.lineChartdata;
    const properties = props.lineChartProperties;
    let dataArray = [];
    if (data !== undefined && data.length > 0) {
        for (let index = 1; index < data[0].length; index++) {
            let arr = [];
            for (let index1 = 0; index1 < data.length; index1++) {
              if (index1 === 0) {
                arr.push(data[index1][index]);
              } else {
                arr.push(Number(data[index1][index]));
              }
            }
            dataArray.push(arr);
        }
    };
    let keys = [];
    if (data !== undefined && data.length > 0) {
        for (let index = 1; index < data.length; index++) {
            keys.push(data[index][0]);
        } 
    };

    for (let index1 = 0; index1 < dataArray.length-1; index1++) {
        for (let index2 = index1+1; index2 < dataArray.length; index2++) {
            if (JSON.stringify(dataArray[index1]) === JSON.stringify(dataArray[index2])) {
                dataArray.splice(1, index2);
            };
        }
    };
    
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    useEffect(() => {
        const svg = d3.select(svgRef.current);

        if (!dimensions) return;

        const xScale = d3.scaleBand()
            .domain(props.fullScreenValue === false ? dataArray.slice(0, 11).map(d => d[0] !== null ? (d[0].length > 12 ? d[0].slice(0, -(d[0].length-12)).concat('.....') : d[0]) : d[0]) : dataArray.map(d => {return d[0]}))
            .range([50, dimensions.width/1.1]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataArray, d => {
                if (d[2] === undefined) return Math.max(d[1]);
                if (d[3] === undefined) return Math.max(d[1], d[2]);
                if (d[4] === undefined) return Math.max(d[1], d[2], d[3]);
            })])
            .range([dimensions.height/1.4, 0]);

        const xAxis = d3.axisBottom(xScale);

        const yAxis = d3.axisLeft(yScale).tickFormat((d) => { if (d / 1000000000 >= 1) {
            return +(d / 1000000000).toFixed(1) + ' B'
          } else if (d / 1000000 >= 1) {
            return +(d / 1000000).toFixed(1) + ' M'
          } else if (d / 1000 >= 1) {
            return +(d / 1000).toFixed(1) + ' K'
          } else {
            return d
        }});

        svg
            .select(".x-axis")
            .style("transform", `translateY(${dimensions.height/1.4}px)`)
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "translate(0,0)rotate(20)")
            .style("text-anchor", "start")
            .style("font-size", 10)
            .style("fill", "black");

        svg
            .select(".y-axis")
            .style("transform", `translateX(${50}px)`)
            .call(yAxis);

        const myLine1 = d3.line()
            .x(d => (props.fullScreenValue === false ? xScale(d[0] !== null ? d[0].length > 12 ? d[0].slice(0, -(d[0].length-12)).concat('.....') : d[0] : d[0]) + xScale.bandwidth() / 2 : xScale(d[0])+ xScale.bandwidth() / 2))
            .y(d => yScale(d[1]));

        d3.selectAll(`.${properties.Key}1`).remove();

        svg 
            .selectAll(".line")
            .data(dataArray)
            .join("path")
            .classed(`${properties.Key}1`, true)
            .attr("d", myLine1(dataArray))
            .attr("fill", "none")
            .attr("stroke", `${properties.lineColor}`);

        const myLine2 = d3.line()
            .x(d => (props.fullScreenValue === false ? xScale(d[0] !== null ? d[0].length > 12 ? d[0].slice(0, -(d[0].length-12)).concat('.....') : d[0] : d[0]) + xScale.bandwidth() / 2 : xScale(d[0])+ xScale.bandwidth() / 2))
            .y(d => yScale(d[2]));

        d3.selectAll(`.${properties.Key}2`).remove();

        svg 
            .selectAll(".line")
            .data(dataArray)
            .join("path")
            .classed(`${properties.Key}2`, true)
            .attr("d", myLine2(dataArray))
            .attr("fill", "none")
            .attr("stroke", `${properties.prevYearColor}`);

        const myLine3 = d3.line()
            .x(d => (props.fullScreenValue === false ? xScale(d[0] !== null ? d[0].length > 12 ? d[0].slice(0, -(d[0].length-12)).concat('.....') : d[0] : d[0]) + xScale.bandwidth() / 2 : xScale(d[0])+ xScale.bandwidth() / 2))
            .y(d => yScale(d[3]));

        d3.selectAll(`.${properties.Key}3`).remove();

        svg 
            .selectAll(".line")
            .data(dataArray)
            .join("path")
            .classed(`${properties.Key}3`, true)
            .attr("d", myLine3(dataArray))
            .attr("fill", "none")
            .attr("stroke", `${properties.currYearColor}`);

    }, [dataArray , dimensions, keys]);

    return (
        <div ref={wrapperRef} style={{
            height: props.fullScreenValue === true ? "75vh" : props.height === undefined || props.height === null ? "35vh" : `${props.height-5}vh`
        }}>
            <svg ref={svgRef} style={{
                background: `${properties.bgcolor}`,
                overflow: 'visible',
                display: 'block',
                width: '100%',
                marginTop:"6px",
                height: props.fullScreenValue === true ? "75vh" : props.height === undefined || props.height === null ? "33vh" : `${props.height-5}vh`
            }}>
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        </div>
    )
}

export default LineChartComponent
