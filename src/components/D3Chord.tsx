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

        this.canvas = svg
            .append<SVGGElement>('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`)
            .datum(chord(data))
            .on('mouseleave', this.mouseleave);

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

        group.append('title')
            .html(d => labels[d.index]);

        this.ribbons = this.canvas.append<SVGGElement>('g')
            .attr('class', 'ribbons')
            .selectAll('path')
            .data(chords => chords)
            .enter()
            .append<SVGGElement>('g');

        this.ribbons
            .append('path')
            .attr('d', ribbon)
            .style('fill', d => mix(colors[d.source.index], colors[d.target.index]))
            .style('stroke-width', '0.1')
            .style('stroke', 'black');

        this.ribbons
            .append('title')
            .html(d => data[d.source.index][d.target.index].toString());
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
