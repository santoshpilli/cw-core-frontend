import React, { useEffect, useRef } from 'react';
import { useResizeObserver } from './useResizeObserver';
import * as d3 from 'd3';

const CombinationChartSingleYAxisComponent=(props)=> {
    const data = props.combinationChartSingleYAxisdata;
    const properties = props.combinationChartSingleYAxisProperties;
    // let dataArray = [];
    // let lineDataArray = [];
    // let barDataArray = [];
    // if (data !== undefined && data.length > 0) {
    //     for (let index = 1; index < data[0].length; index++) {
    //         let arr = [], arr1 = [];
    //         for (let index1 = 0; index1 < data.length; index1++) {
    //           if (index1 === 0) {
    //             arr.push(data[index1][index]);
    //           } else if (index1 !== 2) {
    //             arr.push(Number(data[index1][index]));
    //           }
    //         }
    //         for (let index1 = 0; index1 < data.length; index1++) {
    //             if (index1 === 0) {
    //               arr1.push(data[index1][index]);
    //             } else if (index1 === 2) {
    //               arr1.push(Number(data[index1][index]));
    //             }
    //         }
    //         lineDataArray.push(arr1);
    //         barDataArray.push(arr);
    //     }
    // };
    

    // if (data !== undefined && data.length > 0) {
    //     for (let index = 1; index < data[0].length; index++) {
    //         let arr = [];
    //         for (let index1 = 0; index1 < data.length; index1++) {
    //           if (index1 === 0) {
    //             arr.push(data[index1][index]);
    //           } else {
    //             arr.push(Number(data[index1][index]));
    //           }
    //         }
    //         dataArray.push(arr);
    //     }
    // };
    let barDataArray = [];
    if (data !== undefined && data.length > 0) {
        for (let index = 1; index < data[0].length; index++) {
            let obj = {};
            for (let index1 = 0; index1 < data.length; index1++) {
                if (index1 !== 2) obj[data[index1][0]] = data[index1][index];
            };
            barDataArray.push(obj);
        }
    };

    barDataArray.forEach((d) => {
        d.enabled = true;
    });

    let barKeys = [];
    if (data !== undefined && data.length > 0) {
        for (let index = 1; index < data.length; index++) {
            if (index !== 2) barKeys.push(data[index][0]);
        };
    };
    
    let lineDataArray = [];
    if (data !== undefined && data.length > 0) {
        for (let index = 1; index < data[0].length; index++) {
            let arr = [];
            for (let index1 = 0; index1 < data.length; index1++) {
              if (index1 === 0) {
                arr.push(data[index1][index]);
              } else if (index1 === 2) {
                arr.push(Number(data[index1][index]));
              }
            }
            lineDataArray.push(arr);
        }
    };

    let lineKeys = [];
    if (data !== undefined && data.length > 0) {
        for (let index = 1; index < data.length; index++) {
            if (index === 2) lineKeys.push(data[index][0]);
        };
    };
    
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    useEffect(() => {
        let svg = d3.select(svgRef.current);

        const stackGenerator = d3.stack()
            .keys(barKeys)
            .order(d3.stackOrderAscending);
    
        const layers = stackGenerator(props.fullScreenValue === false ? barDataArray.slice(0, 11) : barDataArray);
    
        const extent = [0, d3.max(layers, layer => d3.max(layer, sequence => sequence[1] - sequence[0]))];

        if (!dimensions) return;
    
        const xScale = d3.scaleBand()
            .domain(props.fullScreenValue === false ? barDataArray.slice(0, 11).map(d => d.x.length > 12 ? d.x.slice(0, -(d.x.length-12)).concat('.....') : d.x) : barDataArray.map(d => d.x))
            .range([50, dimensions.width/1.1])
            .padding(0.2);
    
        const yScale = d3.scaleLinear()
            .domain(extent)
            .range([dimensions.height/1.4, 0]);
            
        const color = d3.scaleOrdinal([properties.prevYearColor, properties.currYearColor])
    
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
            .select(".y-axis1")
            .style("transform", `translateX(${50}px)`)
            .call(yAxis);
    
        let path = svg.selectAll(".layer")
            .data(layers)
            .join("g")
            .attr("class", "layer")
            .attr("id", layer => {return layer.index})
            .attr("fill", layer => {
                return color(layer.key);
            })
            .selectAll("rect")
            .data(layer => layer)
            .join("rect")
            .attr("x", (sequence, i, j) => 
                props.fullScreenValue === false ? (xScale(sequence.data.x.length > 12 ? sequence.data.x.slice(0, -(sequence.data.x.length-12)).concat('.....') : sequence.data.x) + xScale.bandwidth() / 2 * parseInt(j[i].parentNode.id)) : (xScale(sequence.data.x) + xScale.bandwidth() / 2 * parseInt(j[i].parentNode.id))
            )
            .attr("width", xScale.bandwidth()/ 2)
            .attr('y', sequence => dimensions.height/1.4 - (yScale(sequence[0]) - yScale(sequence[1])))
            .attr("height", sequence => yScale(sequence[0]) - yScale(sequence[1]));

        const xLineScale = d3.scaleBand()
            .domain(props.fullScreenValue === false ? lineDataArray.slice(0, 11).map(d => d[0] !== null ? (d[0].length > 12 ? d[0].slice(0, -(d[0].length-12)).concat('.....') : d[0]) : d[0]) : lineDataArray.map(d => {return d[0]}))
            .range([50, dimensions.width/1.1]);

        const yLineScale = d3.scaleLinear()
            .domain([0, d3.max(lineDataArray, d => {
                return d[1];
            })])
            .range([dimensions.height/1.4, 0]);

        const xLineAxis = d3.axisBottom(xLineScale);

        const yLineAxis = d3.axisRight(yLineScale).tickFormat((d) => { if (d / 1000000000 >= 1) {
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
            .call(xLineAxis)
            .selectAll("text")
            .attr("transform", "translate(0,0)rotate(20)")
            .style("text-anchor", "start")
            .style("font-size", 10)
            .style("fill", "black");

        svg
            .select(".y-axis2")
            .style("transform", `translateX(${dimensions.width/1.1}px)`)
            .call(yLineAxis);

        const myLine = d3.line()
            .x((d, i) => props.fullScreenValue === false ? xLineScale(d[0] !== null ? (d[0].length > 12 ? d[0].slice(0, -(d[0].length-12)).concat('.....') : d[0]) : d[0]) + xLineScale.bandwidth() / 2 : xScale(d[0]) + xScale.bandwidth() / 2)
            .y(d => yLineScale(d[1]));

        svg 
            .selectAll(".line")
            .data(props.fullScreenValue === false ? lineDataArray.slice(0, 11) : lineDataArray)
            .join("path")
            .attr("class", "line")
            .attr("d", myLine(props.fullScreenValue === false ? lineDataArray.slice(0, 11) : lineDataArray))
            .attr("fill", "none")
            .attr("stroke", `${properties.lineColor}`);

        // const svg = select(svgRef.current);

        // if (!dimensions) return;

        // const xScale = scaleBand()
        //     .domain(props.fullScreenValue === false ? barDataArray.slice(0, 11).map(d => d[0].length > 12 ? d[0].slice(0, -(d[0].length-12)).concat('.....') : d[0]) : barDataArray.map(d => d[0]))
        //     .range([50, dimensions.width/1.1])
        //     .padding(0.5);
            
        // const yScale = scaleLinear()
        //     .domain([0, max(barDataArray, d => {
        //         if (d[2] === undefined) return Math.max(d[1]);
        //         if (d[3] === undefined) return Math.max(d[1], d[2]);
        //         if (d[4] === undefined) return Math.max(d[1], d[2], d[3]);
        //     })])
        //     .range([dimensions.height/1.4, 0]);

        // const xAxis = axisBottom(xScale);

        // const yAxis = axisLeft(yScale).tickFormat((d) => { if (d / 1000000000 >= 1) {
        //     return +(d / 1000000000).toFixed(1) + ' B'
        //   } else if (d / 1000000 >= 1) {
        //     return +(d / 1000000).toFixed(1) + ' M'
        //   } else if (d / 1000 >= 1) {
        //     return +(d / 1000).toFixed(1) + ' K'
        //   } else {
        //     return d
        // }});

        // svg
        //     .select(".x-axis")
        //     .style("transform", `translateY(${dimensions.height/1.4}px)`)
        //     .call(xAxis)
        //     .selectAll("text")
        //     .attr("transform", "translate(0,0)rotate(20)")
        //     .style("text-anchor", "start")
        //     .style("font-size", 10)
        //     .style("fill", "black");

        // svg
        //     .select(".y-axis")
        //     .style("transform", `translateX(${50}px)`)
        //     .call(yAxis);

        // const myLine = line()
        //     .x((d, i) => props.fullScreenValue === false ? xScale(d[0].length > 12 ? d[0].slice(0, -(d[0].length-12)).concat('.....') : d[0]) + xScale.bandwidth() / 2 : xScale(d[0]) + xScale.bandwidth() / 2)
        //     .y(d => yScale(d[2]));

        // svg
        //     .selectAll(".bar")
        //     .data(props.fullScreenValue === false ? barDataArray.slice(0, 11) : barDataArray)
        //     .join("rect")
        //     .attr("class", "bar")
        //     .style("transform", "scale(1, -1)")
        //     .attr("x", d => props.fullScreenValue === false ? xScale(d[0].length > 12 ? d[0].slice(0, -(d[0].length-12)).concat('.....') : d[0]) : xScale(d[0]))
        //     .attr("y", -dimensions.height/1.4)
        //     .attr("width", xScale.bandwidth())
        //     .attr("fill", `${properties.prevYearColor}`)
        //     .attr("height", d => dimensions.height/1.4 - yScale(d[1]));

        // svg 
        //     .selectAll(".line")
        //     .data(props.fullScreenValue === false ? barDataArray.slice(0, 11) : barDataArray)
        //     .join("path")
        //     .attr("class", "line")
        //     .attr("d", myLine(props.fullScreenValue === false ? barDataArray.slice(0, 11) : barDataArray))
        //     .attr("fill", "none")
        //     .attr("stroke", `${properties.lineColor}`);
        
    }, [dimensions, barKeys, barDataArray]);

    return (
        <div ref={wrapperRef} style={{
            height: props.fullScreenValue === true ? "75vh" : props.height === undefined || props.height === null ? "40vh" : `${props.height-5}vh`
        }}>
            <svg ref={svgRef} style={{
                background: `${properties===undefined || properties===null ? "#FFFFFF" : properties.bgcolor }`,
                overflow: 'visible',
                display: 'block',
                width: '100%',
                marginTop:"6px",
                height: props.fullScreenValue === true ? "75vh" : props.height === undefined || props.height === null ? "25vh" : `${props.height-5}vh`
            }}>
                <g className="x-axis" />
                <g className="y-axis1" />
                <g className="y-axis2" />
            </svg>
        </div>
    )
}

export default CombinationChartSingleYAxisComponent
