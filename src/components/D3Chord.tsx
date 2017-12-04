import * as React from 'react';
import * as d3 from 'd3';
import { ChordGroup, ChordSubgroup, Chord } from 'd3';
import { name2color } from '../utils/utils';

interface D3GraphProps<N, R> {
    id: string;
    data: number[][];
    getNodeID: (node: N) => string;
    getNodeColor: (node: N) => string;
    getNodeLabel: (node: N) => string;
    getNodeText: (node: N) => string;
    getLinkID: (link: R) => string;
    getLinkText: (link: R) => string;
    getSourceNodeID: (link: R) => string;
    getTargetNodeID: (link: R) => string;
}

class D3Chord<N, R> extends React.Component<D3GraphProps<N, R>, {}> {

    svg: d3.Selection<SVGGElement, d3.Chords, HTMLElement, d3.Chords>;

    update = () => {
        const outerRadius = 200, innerRadius = outerRadius - 30;

        const chord = d3.chord()
            .padAngle(0.05)
            .sortSubgroups(d3.descending);

        const arc = d3.arc<ChordGroup>()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const ribbon = d3.ribbon<Chord, ChordSubgroup>()
            .radius(innerRadius);

        this.svg = d3.select<SVGSVGElement, d3.Chords>(`#${this.props.id}`)
            .append<SVGGElement>('g')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('transform', 'translate(300, 300)')
            .datum(chord(this.props.data));

        const group = this.svg.append('g')
            .attr('class', 'groups')
            .selectAll('g')
            .data<ChordGroup>(chords => chords.groups)
            .enter().append('g');

        group.append('path')
            .style('fill', d => name2color(d.index.toString()))
            .attr('d', arc);

        // const groupTick = group.selectAll('.group-tick')
        //     .data(d => groupTicks(d, 1e5))
        //     .enter().append('g')
        //     .attr('class', 'group-tick')
        //     .attr('transform', d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${outerRadius},0)`);
        //
        // groupTick.append('line')
        //     .attr('x2', 6);
        //
        // groupTick
        //     .filter(d => d.value % 5e3 === 0)
        //     .append('text')
        //     .attr('x', 8)
        //     .attr('dy', '.35em')
        //     .attr('transform', d => d.angle > Math.PI ? 'rotate(180) translate(-16)' : null)
        //     .style('text-anchor', d => d.angle > Math.PI ? 'end' : null)
        //     .text(d => d.value);

        this.svg.append('g')
            .attr('class', 'ribbons')
            .selectAll('path')
            .data(chords => chords)
            .enter().append('path')
            .attr('d', ribbon)
            .style('fill', d => '#FF0000')
            .style('stroke', d => d3.rgb('#FF0000').darker().toString());

        // function groupTicks(d: ChordGroup, step: number) {
        //     const k = (d.endAngle - d.startAngle) / d.value;
        //     return d3.range(0, d.value, step).map(value => ({value: value, angle: value * k + d.startAngle}));
        // }
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
                <svg width={600} height={600} id={this.props.id}/>
            </div>
        );
    }
}

export default D3Chord;
