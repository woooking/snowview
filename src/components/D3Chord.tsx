import * as React from 'react';
import * as d3 from 'd3';
import { ChordGroup, ChordSubgroup, Chord, color, rgb } from 'd3';
import { Chords } from 'd3-chord';

interface D3GraphProps {
    id: string;
    data: number[][];
    colors: string[];
    labels: string[];
}

function mix(color1: string, color2: string) {
    const c1 = color(color1);
    const c2 = color(color2);
    const newColor = rgb(
        (c1.rgb().r + c2.rgb().r) / 2,
        (c1.rgb().g + c2.rgb().g) / 2,
        (c1.rgb().b + c2.rgb().b) / 2
    );
    return newColor.toString();
}

class D3Chord extends React.Component<D3GraphProps, {}> {

    canvas: d3.Selection<SVGGElement, Chords, HTMLElement, {}>;

    ribbons: d3.Selection<SVGGElement, Chord, SVGGElement, {}>;

    update = () => {
        const outerRadius = 250, innerRadius = outerRadius - 20;

        const {data, colors, labels} = this.props;

        const chord = d3.chord()
            .padAngle(0.05)
            .sortSubgroups(d3.descending);

        const arc = d3.arc<ChordGroup>()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const ribbon = d3.ribbon<Chord, ChordSubgroup>()
            .radius(innerRadius);

        const svg = d3.select<SVGSVGElement, {}>(`#${this.props.id}`);

        const width = parseFloat(svg.style('width').slice(0, -2));
        const height = parseFloat(svg.style('height').slice(0, -2));

        const binaryData: number[][] = [];
        for (var i = 0; i < data.length; i++) {
            binaryData.push([]);
            for (var j = 0; j < data[i].length; j++) {
                binaryData[i].push(Math.log(data[i][j] + 1));
            }
        }

        this.canvas = svg
            .append<SVGGElement>('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`)
            .datum(chord(binaryData))
            .on('mouseleave', this.mouseleave);

        this.ribbons = this.canvas.append<SVGGElement>('g')
            .attr('class', 'ribbons')
            .selectAll('path')
            .data(chords => chords)
            .enter()
            .append<SVGGElement>('g');

        const group = this.canvas.append<SVGGElement>('g')
            .attr('class', 'groups')
            .selectAll('g')
            .data<ChordGroup>(chords => chords.groups)
            .enter().append<SVGGElement>('g')
            .on('mouseover', this.mouseover);

        group.append('path')
            .attr('id', d => `p${d.index}`)
            .style('fill', d => colors[d.index])
            .attr('d', arc);

        group.append('title').html(d => labels[d.index]);

        this.ribbons
            .append('path')
            .attr('d', ribbon)
            .style('fill', d => mix(colors[d.source.index], colors[d.target.index]))
            .style('stroke-width', '0.1')
            .style('stroke', 'black');

        this.ribbons
            .append('title')
            .html(d => data[d.source.index][d.target.index].toString());

        group.append('svg:text')
            .style('font-size', '10px')
            .style('text-anchor', 'middle')
            .attr('dx', function (d: ChordGroup) {
                let anchor = (d.startAngle + d.endAngle) / 2;
                let radius = outerRadius + 10;
                return radius * Math.sin(anchor);
            })
            .attr('dy', function (d: ChordGroup) {
                let anchor = (d.startAngle + d.endAngle) / 2;
                let radius = outerRadius + 10;
                return -radius * Math.cos(anchor);
            })
            .text(function (d: ChordGroup) {
                return labels[d.index].substr(0, labels[d.index].indexOf('('));
            });

    }

    mouseover = (d: {}, i: {}) => {
        this.ribbons.classed('fade', p => {
            return p.source.index !== i && p.target.index !== i;
        });
    }

    mouseleave = () => {
        this.ribbons.classed('fade', false);
    }

    componentDidMount() {
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    render() {
        return (
            <div style={{width: '100%', background: 'white'}}>
                <svg width="100%" height={600} id={this.props.id}/>
            </div>
        );
    }
}

export default D3Chord;
