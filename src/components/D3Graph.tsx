import * as React from 'react';
import * as d3 from 'd3';
import { ForceLink } from 'd3-force';

const nodeRadius = 40;
const arrowSize = 12;

interface D3GraphProps<N, R> {
    id: string;
    nodes: N[];
    links: R[];
    getNodeID: (node: N) => string;
    getNodeColor: (node: N) => string;
    getNodeLabel: (node: N) => string;
    getNodeText: (node: N) => string;
    getLinkID: (link: R) => string;
    getLinkText: (link: R) => string;
    getSourceNodeID: (link: R) => string;
    getTargetNodeID: (link: R) => string;
    onNodeClick?: (d: D3Node<N>) => void;
}

export interface D3Node<N> {
    raw: N;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
}

interface D3Relation<N, R> {
    raw: R;
    type: 'single' | 'repeated';
    source: string | D3Node<N>;
    target: string | D3Node<N>;
}

const D3RelationType = {
    SINGLE: 'single' as 'single',
    REPEATED: 'repeated' as 'repeated'
}

class D3Graph<N, R> extends React.Component<D3GraphProps<N, R>, {}> {

    svg: d3.Selection<SVGGElement, {}, HTMLElement, {}>;

    nodeG: d3.Selection<SVGGElement, {}, HTMLElement, {}>;

    linkG: d3.Selection<SVGGElement, {}, HTMLElement, {}>;

    nodeSelection: d3.Selection<SVGGElement, D3Node<N>, SVGGElement, {}>;

    linkSelection: d3.Selection<SVGPathElement, D3Relation<N, R>, SVGGElement, {}>;

    nodes: D3Node<N>[] = [];

    links: D3Relation<N, R>[] = [];

    simulation: d3.Simulation<D3Node<N>, D3Relation<N, R>>;

    updateLinks = () => {
        const {links, getLinkID, getLinkText, getSourceNodeID, getTargetNodeID} = this.props;

        const newLinks = links.filter(l => !this.links.some(lk => getLinkID(lk.raw) === getLinkID(l)));

        this.links = [
            ...this.links.filter(lk => links.some(l => getLinkID(lk.raw) === getLinkID(l))),
            ...newLinks.map(l => ({
                    raw: l,
                    source: getSourceNodeID(l),
                    target: getTargetNodeID(l),
                    type: D3RelationType.SINGLE
                })
            )
        ];

        this.links
            .filter(l => this.links.some(o => l.source === o.target && l.target === o.source))
            .forEach(l => l.type = D3RelationType.REPEATED);

        const update = this.linkG
            .selectAll('.link')
            .data(this.links, (d: any) => d.raw.id);

        update
            .exit()
            .remove();

        const link = update
            .enter()
            .append<SVGPathElement>('path')
            .attr('id', (d) => `p${getLinkID(d.raw)}`)
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', '3');

        this.linkG
            .selectAll('.link-label')
            .data(this.links)
            .enter()
            .append('text')
            .attr('transform', 'translate(0,-2)')
            .attr('class', 'link-label')
            .attr('text-anchor', 'middle')
            // .attr('filter', 'url(#text-background)')
            .style('background', '#FFFFFF')
            .append('textPath')
            .attr('href', d => `#p${getLinkID(d.raw)}`)
            .attr('startOffset', '50%')
            .html(d => getLinkText(d.raw));

        return link;
    }

    updateNodes = () => {
        const {getNodeID, getNodeColor, getNodeLabel, getNodeText, onNodeClick, nodes} = this.props;

        const newNodes = nodes.filter(n => !this.nodes.some(nd => getNodeID(nd.raw) === getNodeID(n)));

        this.nodes = [
            ...this.nodes.filter(nd => this.props.nodes.some(n => getNodeID(nd.raw) === getNodeID(n))),
            ...newNodes.map(n => ({raw: n}))
        ];

        const update = this.nodeG
            .selectAll('.node')
            .data(this.nodes, (d: any) => d.raw._id);

        const node = update
            .enter()
            .append<SVGGElement>('g')
            .attr('class', 'node')
            .on('dblclick', d => {
                d.fx = null;
                d.fy = null;
            })
            .call(d3.drag<SVGCircleElement, D3Node<N>>()
                .on('start', () => {
                    if (!d3.event.active) {
                        this.simulation.alphaTarget(0.3).restart();
                    }
                })
                .on('drag', (d: D3Node<N>) => {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                })
                .on('end', () => {
                    if (!d3.event.active) {
                        this.simulation.alphaTarget(0);
                    }
                })
            );

        if (onNodeClick) {
            node.on('click', onNodeClick);
        }

        node.append('circle')
            .attr('r', nodeRadius)
            .attr('cx', nodeRadius)
            .attr('cy', nodeRadius)
            .attr('stroke', "#000")
            .attr('stroke-width', "1.5px")
            .style('fill', d => getNodeColor(d.raw));

        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', nodeRadius)
            .attr('y', nodeRadius - 5)
            .attr('font-weight', 'bold')
            .html(d => getNodeLabel(d.raw));

        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', nodeRadius)
            .attr('y', nodeRadius + 15)
            .html(d => getNodeText(d.raw));

        update
            .exit()
            .remove();

        return node;
    }

    componentDidMount() {
        const {getNodeID} = this.props;

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

        this.simulation = d3.forceSimulation<D3Node<N>>()
            .force('link', d3.forceLink().id((d: D3Node<N>) => getNodeID(d.raw)))
            .force('charge', d3.forceManyBody())
            .force('collide', d3.forceCollide(nodeRadius * 1.5));

        this.simulation.nodes(this.nodes).on('tick', () => {
            this.linkSelection
                .attr('d', d => {
                    const x1 = (d.source as D3Node<N>).x! + nodeRadius;
                    const y1 = (d.source as D3Node<N>).y! + nodeRadius;
                    const x2 = (d.target as D3Node<N>).x! + nodeRadius;
                    const y2 = (d.target as D3Node<N>).y! + nodeRadius;
                    if (d.type === 'single') {
                        return x1 > x2 ? `M${x2},${y2} L${x1},${y1}` : `M${x1},${y1} L${x2},${y2}`;
                    } else if (d.source === d.target) {
                        return `M${x1 - nodeRadius},${y1} 
                        A${nodeRadius},${nodeRadius} 0 1,0
                        ${x1},${y1 + nodeRadius}`;
                    } else {
                        const dx = x2 - x1;
                        const dy = y2 - y1;
                        const dxx = dx * dx;
                        const dyy = dy * dy;
                        const dxy = dx * dy;
                        const sx = x1 + x2;
                        const sy = y1 + y2;
                        const dis = Math.sqrt(dxx + dyy);

                        const fx =
                            (-dxy * y1 + dyy * x1 + 0.5 * dxx * sx + 0.5 * dxy * sy - dis / 5 * dis * dy) / (dxx + dyy);
                        const fy =
                            (dxx * y1 - dxy * x1 + 0.5 * dxy * sx + 0.5 * dyy * sy + dis / 5 * dis * dx) / (dxx + dyy);
                        return x1 > x2 ?
                            `M${x2},${y2} Q${fx},${fy} ${x1},${y1}` : `M${x1},${y1} Q${fx},${fy} ${x2},${y2}`;
                    }
                })
                .attr('marker-end', d => {
                    const x1 = (d.source as D3Node<N>).x! + nodeRadius;
                    const x2 = (d.target as D3Node<N>).x! + nodeRadius;
                    return x2 > x1 ? 'url(#end-arrow)' : '';
                })
                .attr('marker-start', d => {
                    const x1 = (d.source as D3Node<N>).x! + nodeRadius;
                    const x2 = (d.target as D3Node<N>).x! + nodeRadius;
                    return x1 > x2 ? 'url(#start-arrow)' : '';
                });

            this.nodeSelection.attr('transform', d => `translate(${d.x}, ${d.y})`);
        });

        this.simulation.force<ForceLink<D3Node<N>, D3Relation<N, R>>>('link')!
            .links(this.links)
            .strength(0.03);

    }

    componentDidUpdate() {
        this.updateNodes();
        this.nodeSelection = this.nodeG
            .selectAll<SVGGElement, D3Node<N>>('.node')
            .data(this.nodes);

        this.updateLinks();
        this.linkSelection = this.linkG
            .selectAll<SVGPathElement, D3Relation<N, R>>('.link')
            .data(this.links, d => this.props.getLinkID(d.raw));

        this.simulation.nodes(this.nodes);

        this.simulation.force<ForceLink<D3Node<N>, D3Relation<N, R>>>('link')!
            .links(this.links)
            .strength(0.03);

        this.simulation.alpha(1).restart();
    }

    render() {
        const sum = nodeRadius + arrowSize;
        const half = sum / 2;
        const up = half - arrowSize / 2;
        const down = half + arrowSize / 2;

        return (
            <div style={{width: '100%', background: 'white'}}>
                <svg id={this.props.id}>
                    <defs>
                        <filter x="0" y="0" width="1" height="1" id="text-background">
                            <feFlood floodColor="#FFFFFF"/>
                            <feComposite in="SourceGraphic"/>
                        </filter>
                        <marker
                            id="start-arrow"
                            markerWidth={sum}
                            markerHeight={sum}
                            refX={0}
                            refY={half}
                            orient="auto"
                            markerUnits="userSpaceOnUse"
                        >
                            <path
                                d={`M${sum},${up} L${sum},${down} L${nodeRadius},${down} L${nodeRadius},${up} z`}
                                fill="#FFFFFF"
                            />
                            <path
                                d={`M${sum},${up} L${sum},${down} L${nodeRadius},${half} z`}
                                fill="#000000"
                            />
                        </marker>
                        <marker
                            id="end-arrow"
                            markerWidth={sum}
                            markerHeight={sum}
                            refX={sum}
                            refY={half}
                            orient="auto"
                            markerUnits="userSpaceOnUse"
                        >
                            <path
                                d={`M0,${up} L0,${down} L${arrowSize},${down} L${arrowSize},${up} z`}
                                fill="#FFFFFF"
                            />
                            <path
                                d={`M0,${up} L0,${down} L${arrowSize},${half} z`}
                                fill="#000000"
                            />
                        </marker>
                    </defs>
                </svg>
            </div>
        );
    }
}

export default D3Graph;
