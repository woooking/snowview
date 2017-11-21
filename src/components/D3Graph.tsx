import * as React from 'react';
import { RootState } from '../redux/reducer';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { translation } from '../translation';
import { D3Node, D3Relation, Node, Relation } from '../model';
import { fetchRelationListWorker, selectNode } from '../redux/action';
import { ForceLink } from 'd3-force';

interface D3GraphProps {
    id: string;
    nodes: Node[];
    links: Relation[];
    dispatch: Dispatch<RootState>;
}

class D3Graph extends React.Component<D3GraphProps, {}> {
    
    svg: d3.Selection<SVGGElement, {}, HTMLElement, {}>;
    
    nodeG: d3.Selection<SVGGElement, {}, HTMLElement, {}>;
    
    linkG: d3.Selection<SVGGElement, {}, HTMLElement, {}>;
    
    nodeSelection: d3.Selection<SVGGElement, D3Node, SVGGElement, {}>;
    
    linkSelection: d3.Selection<SVGLineElement, D3Relation, SVGGElement, {}>;
    
    nodes: D3Node[] = [];
    
    links: D3Relation[] = [];
    
    simulation: d3.Simulation<D3Node, D3Relation>;
    
    updateLinks = () => {
        const newLinks = this.props.links.filter(l => !this.links.some(link => link.raw.id === l.id));
    
        this.links = [...this.links, ...newLinks.map(
            l => ({raw: l, source: l.startNode.toString(), target: l.endNode.toString()})
        )];
        
        const link = this.linkG
            .selectAll('.link')
            .data(this.links)
            .enter()
            .append<SVGLineElement>('line')
            .attr('class', 'link')
            .attr('stroke', 'black');
        
        return link;
    }
    
    updateNodes = () => {
        const newNodes = this.props.nodes.filter(n => !this.nodes.some(node => node.raw._id === n._id));
        
        this.nodes = [...this.nodes, ...newNodes.map(n => ({index: n._id.toString(), raw: n}))];
        
        const nodeRadius = 40;
        
        const {dispatch} = this.props;
        
        const node = this.nodeG
            .selectAll('.node')
            .data(this.nodes)
            .enter()
            .append<SVGGElement>('g')
            .attr('class', 'node')
            .on('click', (d: D3Node) => {
                dispatch(fetchRelationListWorker(d.raw._id))
                dispatch(selectNode(d.raw._id));
            })
            .call(d3.drag<SVGCircleElement, D3Node>()
                .on('start', () => {
                    if (!d3.event.active) {
                        this.simulation.alphaTarget(0.3).restart();
                    }
                })
                .on('drag', (d: D3Node) => {
                    d.x = d3.event.x;
                    d.y = d3.event.y;
                })
                .on('end', () => {
                    if (!d3.event.active) {
                        this.simulation.alphaTarget(0);
                    }
                })
            );
        
        node.append('circle')
            .attr('r', nodeRadius)
            .attr('cx', nodeRadius)
            .attr('cy', nodeRadius)
            .style('fill', (d: D3Node) => {
                const l = translation.classes[d.raw._labels[0]]
                return l === null ? '#DDDDDD' : l.nodeFillColor;
            });
        
        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', nodeRadius)
            .attr('y', nodeRadius - 5)
            .html((d: D3Node) => {
                const label = d.raw._labels[0];
                const c = translation.classes[label];
                if (c == null) {
                    return label;
                }
                if (c.englishName == null) {
                    return label;
                }
                return c.englishName;
            });
        
        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', nodeRadius)
            .attr('y', nodeRadius + 15)
            .html((d: D3Node) => {
                const label = d.raw._labels[0];
                if (translation.classes[label] === undefined) {
                    return d.raw._id;
                }
                if (translation.classes[label]["displayName"] === undefined) {
                    return d.raw._id;
                }
                if (!d.raw[translation.classes[label]["displayName"]]) {
                    return d.raw._id;
                }
                return d.raw[translation.classes[label]["displayName"]];
            });
        
        return node;
    }
    
    componentDidMount() {
        const nodeRadius = 40;
        
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
        
        this.linkG = this.svg.append<SVGGElement>('g').attr('class', 'links');
        
        this.nodeG = this.svg.append<SVGGElement>('g').attr('class', 'nodes');
        
        this.nodeSelection = this.updateNodes();
        
        this.linkSelection = this.updateLinks();
        
        this.simulation = d3.forceSimulation<D3Node>()
            .force('link', d3.forceLink().id((d: D3Node) => d.raw._id.toString()))
            .force('charge', d3.forceManyBody())
            .force('collide', d3.forceCollide(nodeRadius * 1.5));
        
        
        this.simulation.nodes(this.nodes).on('tick', () => {
            this.linkSelection
                .attr('x1', (d: any) => d.source.x + nodeRadius)
                .attr('y1', (d: any) => d.source.y + nodeRadius)
                .attr('x2', (d: any) => d.target.x + nodeRadius)
                .attr('y2', (d: any) => d.target.y + nodeRadius);

            this.nodeSelection.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
        });
        
        this.simulation.force<ForceLink<any, any>>('link')!
            .links(this.links)
            .strength(0.03);
        
    }
    
    componentDidUpdate() {
        const newNodes = this.updateNodes();
        this.nodeSelection = newNodes.merge(this.nodeSelection);
    
        const newLinks = this.updateLinks();
        this.linkSelection = newLinks.merge(this.linkSelection);
        
        this.simulation.nodes(this.nodes);
        
        this.simulation.force<ForceLink<any, any>>('link')!
            .links(this.links)
            .strength(0.03);
    }
    
    render() {
        return (
            <div id={this.props.id}/>
        );
    }
}

export default connect()(D3Graph);
