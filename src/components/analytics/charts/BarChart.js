import React, { useEffect, useRef } from 'react';
import { useResizeObserver } from './useResizeObserver';
import * as d3 from 'd3';

const BarChartComponent=(props)=> {
    const data = props.barChartdata;
    const properties = props.barChartProperties;
    let dataArray = [];
    if (data !== undefined && data.length > 0) {
        for (let index = 1; index < data[0].length; index++) {
            let obj = {};
            for (let index1 = 0; index1 < data.length; index1++) {
              obj[data[index1][0]] = data[index1][index];
            }
            dataArray.push(obj);
        }
    }

    dataArray.forEach((d) => {
        d.enabled = true;
    });

    let keys = [];
    if (data !== undefined && data.length > 0) {
        for (let index = 1; index < data.length; index++) {
            keys.push(data[index][0]);
        } 
    };
    
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    useEffect(() => {
        let svg = d3.select(svgRef.current);

        const stackGenerator = d3.stack()
            .keys(keys)
            .order(d3.stackOrderAscending);
    
        const layers = stackGenerator(props.fullScreenValue === false ? dataArray.slice(0, 11) : dataArray);
    
        const extent = [0, d3.max(layers, layer => d3.max(layer, sequence => sequence[1] - sequence[0]))];

        if (!dimensions) return;
        const xScale = d3.scaleBand()
            .domain(props.fullScreenValue === false ? dataArray.slice(0, 11).map(d => d.x===null?d.x:d.x.length > 12 ? d.x.slice(0, -(d.x.length-12)).concat('.....') : d.x) : dataArray.map(d => d.x))
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
            .select(".y-axis")
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
                props.fullScreenValue === false ? (xScale(sequence.data.x===null?sequence.data.x:sequence.data.x.length > 12 ? sequence.data.x.slice(0, -(sequence.data.x.length-12)).concat('.....') : sequence.data.x) + xScale.bandwidth() / 2 * parseInt(j[i].parentNode.id)) : (xScale(sequence.data.x) + xScale.bandwidth() / 2 * parseInt(j[i].parentNode.id))
            )
            .attr("width", xScale.bandwidth()/ 2.3)
            .attr('y', sequence => dimensions.height/1.4 - (yScale(sequence[0]) - yScale(sequence[1])))
            .attr("height", sequence => yScale(sequence[0]) - yScale(sequence[1]))

        // let tooltip = d3.select(wrapperRef.current)
        //     .append('div')
        //     .attr('class', 'tooltip1');
    
        // tooltip.append('div')
        //     .attr('class', 'label');
            
        // tooltip.append('div')
        //     .attr('class', 'count1');

        // tooltip.append('div')
        //     .attr('class', 'count2');

        // path.on('mouseover', (e, d) => {     
        //     tooltip.select('.label').html(d.data.x); 
        //     tooltip.select('.count1').html('Previous Year:  ' +  + d.data['Previous Year']);            
        //     tooltip.select('.count2').html('Current Year:  ' +  + d.data['Current Year']);              
        //     tooltip.style('display', 'block');                  
        // });  
            
        // path.on('mouseout', () => {                       
        //     tooltip.style('display', 'none');
        // });
            
        // path.on('mousemove', (e, d) => {                  
        //     tooltip.style('top', (e.layerY + 20) + 'px')
        //     .style('left', (e.layerX + 20) + 'px');
        // });

        // d3.selectAll(`.${properties.Key}`).remove();

        // let legend = svg.selectAll('.legend')
        //     .data(color.domain())
        //     .join('g')
        //     .classed(`${properties.Key}`, true)
        //     .style("transform", (d, i) => {
        //         let vert = i * dimensions.height / 15; 
        //         return `translate(${dimensions.width / 1.3}px, ${vert}px)`
        //     });

        // d3.selectAll(`.${properties.Key}3`).remove();

        // legend.append('rect')
        //     .classed(`${properties.Key}3`, true)                                   
        //     .attr('width', dimensions.height/20)                     
        //     .attr('height', dimensions.height/20)                   
        //     .style('fill', color)
        //     .style('stroke', color)
        //     .on('click', function(e, label) {
        //         let rect = d3.select(this);
        //         let enabled = true;
        //         let totalEnabled = d3.sum(dataArray.map(function(d) {
        //             return (d.enabled) ? 1 : 0;
        //         }));

        //         if (rect.attr('class') === 'disabled') {
        //             rect.attr('class', '');
        //         } else {
        //         if (totalEnabled < 2) return;
        //             rect.attr('class', 'disabled');
        //             enabled = false;
        //         };
                
            //     pieGenerator.value(function(d) { 
            //         if (d.label === label) d.enabled = enabled;
            //         return (d.enabled) ? d.count : 0;
            //     });

            //     path = path.data(pieGenerator(dataArray))
            //                 .style("transform", `translate(${dimensions.width / 4}px, ${dimensions.height / 2}px)`)

            //     path.transition()
            //         .duration(750)
            //         .attrTween('d', function(d) {
            //             let interpolate = d3.interpolate(this._current, d);
            //             this._current = interpolate(0);
            //             return function(t) {
            //                 return arcGenerator(interpolate(t));
            //             };
            //         })
            //         .style("transform", `translate(${dimensions.width / 4}px, ${dimensions.height / 2}px)`);
                // });

        // d3.selectAll(`.${properties.Key}4`).remove();

        // legend.append('text')
        //     .classed(`${properties.Key}4`, true)                                    
        //     .attr('x', dimensions.height/20 + 5)
        //     .attr('y', dimensions.height/20)
        //     .style("font-size", dimensions.height/20)
        //     .text(function(d) { return d; });
        
    }, [dimensions, keys, dataArray]);

    return (
        <div ref={wrapperRef} style={{
            height: props.fullScreenValue === true ? "75vh" : props.height === undefined || props.height === null ? "35vh" : `${props.height-5}vh`
        }}>
            <svg ref={svgRef} style={{
                background: `${properties.bgcolor}`,
                overflow: 'visible',
                display: 'block',
                width: '100%',
                height: props.fullScreenValue === true ? "75vh" : props.height === undefined || props.height === null ? "20vh" : `${props.height-5}vh`,
                marginTop:"8px"
            }}>
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        </div>
    )
}

export default BarChartComponent;
