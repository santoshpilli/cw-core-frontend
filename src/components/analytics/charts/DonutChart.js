import React, { useEffect, useRef } from 'react';
import { useResizeObserver } from './useResizeObserver';
import * as d3 from 'd3';

const DonutChartComponent=(props)=> {
    const data = props.donutChartdata;
    const properties = props.donutChartProperties;

    let finalData;
    if (data !== undefined && data.length > 0) {
        finalData = data[1];
    }

    let dataArray = [];
    if (finalData !== undefined && finalData.length > 0) {
        for (let index1 = 0; index1 < finalData.length; index1++) {
            let obj = {};
            obj['label'] = finalData[index1][0];
            obj['count'] = Number(finalData[index1][1]);
            dataArray.push(obj);
        }
    };

    dataArray.forEach((d) => {
        d.enabled = true;
    });

    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    useEffect(() => {
        let svg = d3.select(svgRef.current);

        if (!dimensions) return;

        let arcGenerator = d3.arc().innerRadius(dimensions.height / 5).outerRadius(dimensions.height / 2);

        let pieGenerator = d3.pie().value(function(d) { return d.count; }).sort(null);

        let color = d3.scaleOrdinal(JSON.parse(properties.donutcolor.replace(/'/g, '"')));

        let path = svg.selectAll('.path')
                        .data(pieGenerator(dataArray))
                        .join('path')
                        .attr('class', 'path')
                        .attr('fill', (d) => { return color(d.data.label); })
                        .style("transform", `translate(${dimensions.width / 4}px, ${dimensions.height / 2}px)`)
                        .attr('d', arcGenerator);

        let tooltip = d3.select(wrapperRef.current)
                        .append('div')
                        .attr('class', 'tooltip');
                
        tooltip.append('div')
                .attr('class', 'label');
                
        tooltip.append('div')
                .attr('class', 'count');

        path.on('mouseover', (e, d) => {     
            tooltip.select('.label').html(d.data.label);           
            tooltip.select('.count').html(d.data.count);                
            tooltip.style('display', 'block');                  
        });  
        
        path.on('mouseout', () => {                       
            tooltip.style('display', 'none');
        });
        
        path.on('mousemove', (e, d) => {                  
            tooltip.style('top', (e.layerY + 20) + 'px')
            .style('left', (e.layerX + 20) + 'px');
        });

        d3.selectAll(`.${properties.Key}1`).remove();

        let legend = svg.selectAll('.legend')
            .data(color.domain())
            .join('g')
            .classed(`${properties.Key}1`, true)
            .style("transform", (d, i) => {
                if (i < 10) {
                    let vert = (i+2) * dimensions.height / 15; 
                    return `translate(${dimensions.width / 2}px, ${vert}px)`
                } else {
                    let vert = (i-8) * dimensions.height / 15;
                    return `translate(${dimensions.width / 1.3}px, ${vert}px)` 
                };
            });

        d3.selectAll(`.${properties.Key}2`).remove();

        legend.append('rect')
            .classed(`${properties.Key}2`, true)                                   
            .attr('width', dimensions.height/20)                     
            .attr('height', dimensions.height/20)                   
            .style('fill', color)
            .style('stroke', color)
            .on('click', function(e, label) {
                let rect = d3.select(this);
                let enabled = true;
                let totalEnabled = d3.sum(dataArray.map(function(d) {
                    return (d.enabled) ? 1 : 0;
                }));

                if (rect.attr('class') === 'disabled') {
                    rect.attr('class', '');
                } else {
                if (totalEnabled < 2) return;
                    rect.attr('class', 'disabled');
                    enabled = false;
                }

                pieGenerator.value(function(d) { 
                    if (d.label === label) d.enabled = enabled;
                    return (d.enabled) ? d.count : 0;
                });

                path = path.data(pieGenerator(dataArray))
                            .style("transform", `translate(${dimensions.width / 4}px, ${dimensions.height / 2}px)`)

                path.transition()
                    .duration(750)
                    .attrTween('d', function(d) {
                        let interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            return arcGenerator(interpolate(t));
                        };
                    })
                    .style("transform", `translate(${dimensions.width / 4}px, ${dimensions.height / 2}px)`);
                });

        d3.selectAll(`.${properties.Key}3`).remove();

        legend.append('text')
            .classed(`${properties.Key}3`, true)                                    
            .attr('x', dimensions.height/20 + 5)
            .attr('y', dimensions.height/20)
            .style("font-size", dimensions.height/20)
            .text(function(d) { return d; });

    }, [dimensions, dataArray]);

    return (
        <div ref={wrapperRef} style={{
            height: props.fullScreenValue === true ? "75vh" : props.height === undefined || props.height === null ? "35vh" : `${props.height-5}vh`
        }}>
            <svg ref={svgRef} style={{
                background: `${properties.bgcolor}`,
                overflow: 'visible',
                display: 'block',
                width: '100%',
                height: props.fullScreenValue === true ? "75vh" : props.height === undefined || props.height === null ? "35vh" : `${props.height-5}vh`
            }}>
            </svg>
        </div>
    )
}

export default DonutChartComponent