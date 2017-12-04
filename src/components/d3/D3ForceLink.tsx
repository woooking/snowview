import * as React from 'react';

interface D3ForceLinkProps {
    id: string;
    text: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    nodeRadius: number;
    toSelf: boolean;
    type: 'single' | 'repeated';
}

class D3ForceLink extends React.Component<D3ForceLinkProps, {}> {

    g: SVGGElement | null;

    render() {
        const {id, text, x1, y1, x2, y2, type, toSelf, nodeRadius} = this.props;

        let d = '';

        if (type === 'single') {
            d = x1 > x2 ? `M${x2},${y2} L${x1},${y1}` : `M${x1},${y1} L${x2},${y2}`;
        } else if (toSelf) {
            d =  `M${x1 - nodeRadius},${y1}
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
            d = x1 > x2 ?
                `M${x2},${y2} Q${fx},${fy} ${x1},${y1}` : `M${x1},${y1} Q${fx},${fy} ${x2},${y2}`;
        }

        const markerStart = x1 > x2 ? 'url(#start-arrow)' : '';
        const markerEnd = x2 > x1 ? 'url(#end-arrow)' : '';

        return (
            <g ref={x => this.g = x} className="link">
                <path
                    id={id}
                    className="link"
                    fill="none"
                    stroke="black"
                    strokeWidth={3}
                    d={d}
                    markerStart={markerStart}
                    markerEnd={markerEnd}
                />
                <text transform="translate(0,-2)" className="link-label" textAnchor="middle">
                    <textPath xlinkHref={`#p${id}`} startOffset="50%">
                        {text}
                    </textPath>
                </text>
            </g>
        );
    }
}

export default D3ForceLink;
