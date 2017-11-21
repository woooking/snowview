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
    
    linkSelection: d3.Selection<SVGPathElement, D3Relation, SVGGElement, {}>;
    
    nodes: D3Node[] = [];
    
    links: D3Relation[] = [];
    
    simulation: d3.Simulation<D3Node, D3Relation>;
    
    updateLinks = () => {
        const newLinks = this.props.links.filter(l => !this.links.some(lk => lk.raw.id === l.id));
        
        this.links = [
            ...this.links.filter(lk => this.props.links.some(l => lk.raw.id === l.id)),
            ...newLinks.map(l => ({raw: l, source: l.startNode.toString(), target: l.endNode.toString()}))
        ];
        
        
        const update = this.linkG
            .selectAll('.link')
            .data(this.links, (d: any) => d.raw.id);
    
        update
            .exit()
            .remove();
        
        const link = update
            .enter()
            .append<SVGPathElement>('path')
            .attr('id', (d) => `p${d.raw.id}`)
            .attr('class', 'link')
            .attr('stroke', 'black')
            .attr('stroke-width', '3')
            .attr('marker-end', 'url(#arrow)');
        
        this.linkG
            .selectAll('.link-label')
            .data(this.links)
            .enter()
            .append('text')
            .attr('class', 'link-label')
            .attr('text-anchor', 'middle')
            // .attr('filter', 'url(#text-background)')
            .style('background', '#FFFFFF')
            .append('textPath')
            .attr('href', d => `#p${d.raw.id}`)
            .attr('startOffset', '50%')
            .html(d => d.raw.type);
        
        return link;
    }
    
    updateNodes = () => {
        const newNodes = this.props.nodes.filter(n => !this.nodes.some(nd => nd.raw._id === n._id));
        
        this.nodes = [
            ...this.nodes.filter(nd => this.props.nodes.some(n => nd.raw._id === n._id)),
            ...newNodes.map(n => ({raw: n}))
        ];
        
        const nodeRadius = 40;
        
        const {dispatch} = this.props;
        
        const update = this.nodeG
            .selectAll('.node')
            .data(this.nodes, (d: any) => d.raw._id)
        
        const node = update
            .enter()
            .append<SVGGElement>('g')
            .attr('class', 'node')
            .on('click', d => {
                dispatch(fetchRelationListWorker(d.raw._id));
                dispatch(selectNode(d.raw._id));
            })
            .on('dblclick', d => {
                d.fx = null;
                d.fy = null;
            })
            .call(d3.drag<SVGCircleElement, D3Node>()
                .on('start', () => {
                    if (!d3.event.active) {
                        this.simulation.alphaTarget(0.3).restart();
                    }
                })
                .on('drag', (d: D3Node) => {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
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
                const l = translation.classes[d.raw._labels[0]];
                return l && l.nodeFillColor ? l.nodeFillColor : '#DDDDDD';
            });
        
        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', nodeRadius)
            .attr('y', nodeRadius - 5)
            .html((d: D3Node) => d.raw._labels[0]);
        
        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', nodeRadius)
            .attr('y', nodeRadius + 15)
            .html((d: D3Node) => {
                let name = d.raw.name;
                name = name ? name : d.raw.uniformTitle;
                name = name ? name : '';
                name = name.length > 20 ? name.substr(0, 20) + '...' : name;
                return name;
            });
        
        update
            .exit()
            .remove();
        
        return node;
    }
    
    componentDidMount() {
        const nodeRadius = 40;
        
        this.svg = d3.select<SVGSVGElement, {}>(`#${this.props.id}`)
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
                .attr('d', (d: D3Relation) => {
                    const x1 = (d.source as D3Node).x! + nodeRadius;
                    const y1 = (d.source as D3Node).y! + nodeRadius;
                    const x2 = (d.target as D3Node).x! + nodeRadius;
                    const y2 = (d.target as D3Node).y! + nodeRadius;
                    return `M${x1},${y1} L${x2},${y2}`;
                });
            
            this.nodeSelection.attr('transform', d => `translate(${d.x}, ${d.y})`);
        });
        
        this.simulation.force<ForceLink<D3Node, D3Relation>>('link')!
            .links(this.links)
            .strength(0.03);
        
    }
    
    componentDidUpdate() {
        this.updateNodes();
        this.nodeSelection = this.nodeG
            .selectAll<SVGGElement, D3Node>('.node')
            .data(this.nodes);
        
        this.updateLinks();
        this.linkSelection = this.linkG
            .selectAll<SVGPathElement, D3Relation>('.link')
            .data(this.links, (d: any) => d.raw.id);
        
        this.simulation.nodes(this.nodes);
        
        this.simulation.force<ForceLink<D3Node, D3Relation>>('link')!
            .links(this.links)
            .strength(0.03);
        
        this.simulation.alpha(1).restart();
    }
    
    render() {
        return (
            <div>
                <svg id={this.props.id}>
                    <defs>
                        <filter x="0" y="0" width="1" height="1" id="text-background">
                            <feFlood floodColor="#FFFFFF"/>
                            <feComposite in="SourceGraphic"/>
                        </filter>
                        <marker
                            id="arrow"
                            markerWidth="52"
                            markerHeight="52"
                            refX="52"
                            refY="26"
                            orient="auto"
                            markerUnits="userSpaceOnUse"
                        >
                            <path d="M0,20 L0,32 L12,32 L12,20 z" fill="#FFFFFF"/>
                            <path d="M0,20 L0,32 L12,26 z" fill="#000000"/>
                        </marker>
                    </defs>
                </svg>
            </div>
        );
    }
}

export default connect()(D3Graph);
