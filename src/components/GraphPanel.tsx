import * as React from 'react';
import { Card, CardContent, CardHeader } from 'material-ui';
import { connect } from 'react-redux';
import { NodesState, RelationsState, RootState } from '../redux/reducer';
// import { translation } from '../translation';
import { Dispatch } from 'redux';
import D3Graph from './D3Graph';
import { Node, Relation } from '../model';
import { Option } from 'ts-option';
// import { drawGraph, fetchNode, fetchRelationList, selectNode } from '../redux/action';

const mapStateToProps = (state: RootState) => ({
    nodes: state.nodes,
    relations: state.relations,
});

interface GraphPanelProps {
    nodes: NodesState;
    relations: RelationsState;
    dispatch: Dispatch<RootState>;
}

class GraphPanel extends React.Component<GraphPanelProps, {}> {
    
    render() {
        return (
            <Card>
                <CardHeader title="Related API Code Graph"/>
                <CardContent>
                    <D3Graph
                        id="neo4jd3"
                        nodes={this.props.nodes.valueSeq().flatMap<number, Node>((x?: Option<Node>) => x!.toArray).toArray()}
                        links={this.props.relations.valueSeq().flatMap<number, Relation>((x?: Option<Relation>) => x!.toArray).toArray()}
                    />
                </CardContent>
            </Card>
        );
    }
}

export default connect(mapStateToProps)(GraphPanel);
