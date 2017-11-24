import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Card, CardContent, CardHeader } from 'material-ui';
import { RootState } from '../redux/reducer';
import D3Graph from './D3Graph';
import { Option } from 'ts-option';
import { SnowNode } from '../model';
import { NodesState, RelationsState } from '../redux/graphReducer';

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
            .flatMap<number, SnowNode>((x?: Option<SnowNode>) => x!.toArray)
            .filter(x => x!.shown)
            .toArray();
        
        const links = this.props.relations
            .valueSeq()
            .filter(x => x!.shown)
            .toArray();
        
        const filteredLinks = links.
            filter(x => nodes.some(n => n.node._id === x!.source) && nodes.some(n => n.node._id === x!.target));
    
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
