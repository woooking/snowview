import * as React from 'react';
import * as d3 from 'd3';

interface D3ForceNodeProps {
    nodeRadius: number;
    id: string;
    color: string;
    label: string;
    text: string;
    x: number;
    y: number;
    simulation: d3.Simulation<{}, undefined>;
    dragCallback: (node: D3ForceNode, x: number, y: number) => void;
    highlight?: boolean;
    onNodeClick?: (id: string) => void;
}

class D3ForceNode extends React.Component<D3ForceNodeProps, {}> {

    g: SVGGElement | null;

    componentDidMount() {
        const {simulation, dragCallback, nodeRadius, onNodeClick, id} = this.props;

        const node = d3.select(this.g)
            .call(d3.drag<SVGGElement, {}>()
                .on('start', () => {
                    if (!d3.event.active) {
                        simulation.alphaTarget(0.3).restart();
                    }
                })
                .on('drag', () => {
                    dragCallback(this, d3.event.x - nodeRadius, d3.event.y - nodeRadius);
                })
                .on('end', () => {
                    if (!d3.event.active) {
                        simulation.alphaTarget(0);
                    }
                })
            );

        if (onNodeClick) {
            node.on('click', () => onNodeClick(id));
        }
    }

    render() {
        const {nodeRadius, color, label, text, x, y, highlight} = this.props;

        return (
            <g ref={i => this.g = i} className="node" transform={`translate(${x}, ${y})`}>
                <circle
                    r={nodeRadius}
                    cx={nodeRadius}
                    cy={nodeRadius}
                    style={{fill: color}}
                    strokeWidth={highlight ? 3 : 0}
                    stroke="black"
                />
                <text textAnchor="middle" x={nodeRadius} y={nodeRadius - 5} fontWeight="bold">{label}</text>
                <text textAnchor="middle" x={nodeRadius} y={nodeRadius + 15}>{text}</text>
            </g>
        );
    }
}

export default D3ForceNode;
