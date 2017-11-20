import * as React from 'react';
import { RootState } from '../redux/reducer';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { ForceLink } from 'd3-force';
import { translation } from '../translation';
import { Node, Relation } from '../model';


interface D3GraphProps {
    id: string;
    nodes: Node[];
    links: Relation[];
    dispatch: Dispatch<RootState>;
}

class D3Graph extends React.Component<D3GraphProps, {}> {
    
    svg: d3.Selection<SVGGElement, {}, HTMLElement, {}>;
    
    // link: Selection<BaseType, { source: Number; target: Number }, BaseType, any> = this.svg.append('g')
    //     .attr('class', 'links')
    //     .selectAll('line')
    //     .data(this.props.edges)
    //     .enter()
    //     .append('line')
    //     .attr('stroke', 'black');
    //
    // node = this.svg.append('g')
    //     .attr('class', 'nodes')
    //     .selectAll('node')
    //     .data(this.props.nodes)
    //     .enter()
    //     .append('circle')
    //     .attr('r', 20);
    //
    // force = d3.forceSimulation()
    //     .nodes(this.props.nodes)
    //     .force('link', d3.forceLink(this.props.edges))
    //     .on('tick', () => {
    //     });
    
    componentDidMount() {
        this.svg = d3.select<HTMLDivElement, {}>(`#${this.props.id}`)
            .append<SVGSVGElement>('svg')
            .style('width', '100%')
            .style('height', '800px')
            .call(d3.zoom().on('zoom', () => {
                let scale = d3.event.transform.k;
                const {x, y} = d3.event.transform;
                
                this.svg.attr('transform', `translate(${x}, ${y}) scale(${scale})`);
            }))
            .on('dblclick.zoom', null)
            .append<SVGGElement>('g')
            .attr('width', '100%')
            .attr('height', '100%');
    
        
        const width = this.svg.node()!.getBoundingClientRect().width;
        
        const height = this.svg.node()!.getBoundingClientRect().height;
        
        const force = d3.forceSimulation<Node>()
            .force('link', d3.forceLink().id((d: Node) => d._id.toString()))
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(width / 2, height / 2));
        
        
        const link = this.svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(this.props.links)
            .enter()
            .append('line')
            .attr('stroke', 'black');
        
        const node = this.svg.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(this.props.nodes)
            .enter()
            .append('svg')
            .attr('width', '60')
            .attr('height', '60')
            .attr('viewBox', '0 0 60 60')
            .call(d3.drag<SVGCircleElement, Node>()
                .on('start', () => {
                    if (!d3.event.active) {
                        force.alphaTarget(0.3).restart();
                    }
                })
                .on('drag', (d: Node) => {
                    d.x = d3.event.x;
                    d.y = d3.event.y;
                })
                .on('end', () => {
                    if (!d3.event.active) {
                        force.alphaTarget(0);
                    }
                })
            );
        
        node.append('circle')
            .attr('r', 30)
            .attr('cx', 30)
            .attr('cy', 30)
            .style('fill', (d: Node) => {
                const l = translation.classes[d._labels[0]]
                return l === null ? '#DDDDDD' : l.nodeFillColor;
            });
        
        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', 30)
            .attr('y', 25)
            .html((d: Node) => {
                const label = d._labels[0];
                const c = translation.classes[label];
                if (c == null) return label;
                if (c.englishName == null) return label;
                return c.englishName;
            });
        
        
        force.nodes(this.props.nodes).on('tick', () => {
            link
                .attr('x1', (d: any) => d.source.x + 30)
                .attr('y1', (d: any) => d.source.y + 30)
                .attr('x2', (d: any) => d.target.x + 30)
                .attr('y2', (d: any) => d.target.y + 30);
            
            node
                .attr('x', (d: any) => d.x)
                .attr('y', (d: any) => d.y);
        });
        
        force.force<ForceLink<any, any>>('link')!
            .links(this.props.links)
            .strength(0.03);
        
    }
    
    componentDidUpdate() {
        // TODO
    }
    
    render() {
        return (
            <div id={this.props.id}/>
        );
    }
}

export default connect()(D3Graph);
