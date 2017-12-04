import * as React from 'react';
import * as d3 from 'd3';
import { ForceLink } from 'd3-force';
import { Option } from 'ts-option';
import D3ForceNode from './D3ForceNode';
import D3ForceLink from './D3ForceLink';
import { INode } from '../../model';

const nodeRadius = 50;
const arrowSize = 12;

interface D3ForceProps<N extends INode, R> {
    id: string;
    highlight: Option<number>;
    nodes: N[];
    links: R[];
    getNodeColor: (node: N) => string;
    getNodeLabel: (node: N) => string;
    getNodeText: (node: N) => string;
    getLinkID: (link: R) => string;
    getLinkText: (link: R) => string;
    getSourceNodeID: (link: R) => string;
    getTargetNodeID: (link: R) => string;
    onNodeClick?: (id: string) => void;
}

interface D3ForceState<N, R> {
    nodes: D3Node<N>[];
    links: D3Relation<N, R>[];
}

export interface D3Node<N> {
    raw: N;
    x: number;
    y: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
}

interface D3Relation<N, R> {
    raw: R;
    type: 'single' | 'repeated';
    source: D3Node<N>;
    target: D3Node<N>;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export const D3RelationType = {
    SINGLE: 'single' as 'single',
    REPEATED: 'repeated' as 'repeated'
};

class D3Force<N extends INode, R> extends React.Component<D3ForceProps<N, R>, D3ForceState<N, R>> {
    state = {
        nodes: [] as D3Node<N>[],
        links: [] as D3Relation<N, R>[]
    };

    nodes: D3Node<N>[] = [];

    links: D3Relation<N, R>[] = [];

    canvas: SVGGElement | null;

    svg: d3.Selection<SVGGElement, {}, HTMLElement, {}>;

    simulation: d3.Simulation<D3Node<N>, D3Relation<N, R>> = d3.forceSimulation<D3Node<N>>()
        .force('charge', d3.forceManyBody())
        .force('collide', d3.forceCollide(nodeRadius * 1.5));

    updateRelation = (rel: D3Relation<N, R>) => {
        const x1 = rel.source.x + nodeRadius;
        const y1 = rel.source.y + nodeRadius;
        const x2 = rel.target.x + nodeRadius;
        const y2 = rel.target.y + nodeRadius;

        return Object.assign({}, rel, {x1, y1, x2, y2});
    }

    updateLinks = (nextProps: D3ForceProps<N, R>) => {
        const {links, getLinkID, getSourceNodeID, getTargetNodeID } = nextProps;

        const newLinks = links.filter(l => !this.links.some(lk => getLinkID(lk.raw) === getLinkID(l)));

        this.links = [
            ...this.links.filter(lk => links.some(l => getLinkID(lk.raw) === getLinkID(l))),
            ...newLinks.map(l => ({
                    raw: l,
                    source: this.nodes.find(n => n.raw.getID() === getSourceNodeID(l))!,
                    target: this.nodes.find(n => n.raw.getID() === getTargetNodeID(l))!,
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 0,
                    type: D3RelationType.SINGLE
                })
            )
        ];

        this.links
            .filter(l => this.links.some(o => l.source === o.target && l.target === o.source))
            .forEach(l => l.type = D3RelationType.REPEATED);

    }

    updateNodes = (nextProps: D3ForceProps<N, R>) => {
        const {nodes} = nextProps;

        const newNodes = nodes.filter(n => !this.nodes.some(nd => nd.raw.getID() === n.getID()));

        this.nodes = [
            ...this.nodes.filter((nd: D3Node<N>) => nodes.some(n => nd.raw.getID() === n.getID())),
            ...newNodes.map(n => ({raw: n, x: 0, y: 0}))
        ];
    }

    dragCallback = (node: D3ForceNode, x: number, y: number) => {
        const newNode = [...this.state.nodes];
        const nd = newNode.find(n => n.raw.getID() === node.props.id);
        nd!.fx = x;
        nd!.fy = y;
        this.setState({
            nodes: newNode
        });
    }

    componentDidMount() {
        this.simulation.force('link', d3.forceLink().id((d: D3Node<N>) => d.raw.getID()));

        this.updateNodes(this.props);

        this.updateLinks(this.props);

        this.simulation.nodes(this.nodes);

        this.simulation.on('tick', () => {
            if (this.canvas) {
                this.links = this.links.map(this.updateRelation);
                this.setState({
                    nodes: this.simulation.nodes(),
                    links: this.links
                });
            }
        });

        this.svg = d3.select<SVGSVGElement, {}>(`#${this.props.id}`)
            .style('width', '100%')
            .style('height', '800px')
            .call(d3.zoom().on('zoom', () => {
                let scale = d3.event.transform.k;
                const {x, y} = d3.event.transform;

                this.svg.attr('transform', `translate(${x}, ${y}) scale(${scale})`);
            }))
            .on('dblclick.zoom', null)
            .select<SVGGElement>('g')
            .attr('width', '100%')
            .attr('height', '100%');

        this.simulation.force<ForceLink<D3Node<N>, D3Relation<N, R>>>('link')!
            .links(this.links)
            .strength(0.03);

    }

    componentWillReceiveProps(nextProps: Readonly<D3ForceProps<N, R>>) {
        this.updateNodes(nextProps);

        this.updateLinks(nextProps);

        this.simulation.nodes(this.nodes);

        this.simulation.force<ForceLink<D3Node<N>, D3Relation<N, R>>>('link')!
            .links(this.links)
            .strength(0.03);

        this.simulation.alpha(1).restart();
    }

    render() {
        const {getNodeColor, getNodeLabel, getNodeText, getLinkID, getLinkText, onNodeClick, highlight} = this.props;

        const sum = nodeRadius + arrowSize;
        const half = sum / 2;
        const up = half - arrowSize / 2;
        const down = half + arrowSize / 2;

        return (
            <div style={{width: '100%', background: 'white'}}>
                <svg id={this.props.id}>
                    <defs>
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
                    <g ref={g => this.canvas = g}>
                        <g className="links">
                            {this.state.links.map(l => {
                                return (
                                    <D3ForceLink
                                        key={getLinkID(l.raw)}
                                        nodeRadius={nodeRadius}
                                        id={getLinkID(l.raw)}
                                        text={getLinkText(l.raw)}
                                        x1={l.x1}
                                        x2={l.x2}
                                        y1={l.y1}
                                        y2={l.y2}
                                        toSelf={l.source === l.target}
                                        type={l.type}
                                    />
                                );
                            })}
                        </g>
                        <g className="nodes">
                            {this.state.nodes.map(n => (
                                <D3ForceNode
                                    x={n.x}
                                    y={n.y}
                                    key={n.raw.getID()}
                                    nodeRadius={nodeRadius}
                                    id={n.raw.getID()}
                                    color={getNodeColor(n.raw)}
                                    label={getNodeLabel(n.raw)}
                                    text={getNodeText(n.raw)}
                                    simulation={this.simulation}
                                    dragCallback={this.dragCallback}
                                    onNodeClick={onNodeClick}
                                    highlight={highlight.exists(x => x.toString() === n.raw.getID())}
                                />
                            ))}
                        </g>
                    </g>
                </svg>
            </div>
        );
    }
}

export default D3Force;
