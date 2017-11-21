import * as React from 'react';
import { Card, CardContent, CardHeader } from 'material-ui';
import { connect } from 'react-redux';
import { NodesState, RelationsState, RootState, ShowableNode } from '../redux/reducer';
import { Dispatch } from 'redux';
import D3Graph from './D3Graph';
import { Option } from 'ts-option';

const mapStateToProps = (state: RootState) => ({
    nodes: state.graph.nodes,
    relations: state.graph.relations,
});

interface GraphPanelProps {
    nodes: NodesState;
    relations: RelationsState;
    dispatch: Dispatch<RootState>;
}

class GraphPanel extends React.Component<GraphPanelProps, {}> {
    
    render() {
        const nodes = this.props.nodes
            .valueSeq()
            .flatMap<number, ShowableNode>((x?: Option<ShowableNode>) => x!.toArray)
            .filter(x => x!.shown)
            .map(x => x!.node)
            .toArray();
        
        const links = this.props.relations
            .valueSeq()
            .filter(x => x!.shown)
            .map(x => x!.relation)
            .toArray();
        
        const filteredLinks = links.
            filter(x => nodes.some(n => n._id === x!.startNode) && nodes.some(n => n._id === x!.endNode));
        
        return (
            <Card>
                <CardHeader title="Related API Code Graph"/>
                <CardContent>
                    <D3Graph
                        id="neo4jd3"
                        nodes={nodes}
                        links={filteredLinks}
                    />
                </CardContent>
            </Card>
        );
    }
}

export default connect(mapStateToProps)(GraphPanel);
