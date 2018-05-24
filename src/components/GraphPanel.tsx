import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Card, CardContent, CardHeader } from 'material-ui';
import { RootState } from '../redux/reducer';
import D3Force from './d3/D3Force';
import { Option } from 'ts-option';
import { SnowNode, SnowRelation } from '../model';
import { NodesState, RelationsState } from '../redux/graphReducer';
import { fetchRelationListWorker, selectNode } from '../redux/action';
import { name2color } from '../utils/utils';

const mapStateToProps = (state: RootState) => ({
    nodes: state.graph.nodes,
    relations: state.graph.relations,
    selectedNode: state.graph.selectedNode
});

interface GraphPanelProps {
    nodes: NodesState;
    relations: RelationsState;
    selectedNode: Option<number>;
    dispatch: Dispatch<RootState>;
    project: string;
}

class Graph extends D3Force<SnowNode, SnowRelation> {
}

class GraphPanel extends React.Component<GraphPanelProps, {}> {

    render() {
        const {dispatch, selectedNode, project} = this.props;

        const nodes = this.props.nodes
            .valueSeq()
            .flatMap<number, SnowNode>((x?: Option<SnowNode>) => x!.toArray)
            .filter(x => x!.shown)
            .toArray();

        const links = this.props.relations
            .valueSeq()
            .filter(x => x!.shown)
            .filter(x => nodes.some(n => n.node.id === x!.source) &&
                nodes.some(n => n.node.id === x!.target))
            .toArray();

        return (
            <Card>
                <CardHeader title="Knowledge Graph Inference Result"/>
                <CardContent>
                    {this.props.nodes.isEmpty() ?
                        '' :
                        <Graph
                            id="neo4jd3"
                            highlight={selectedNode}
                            nodes={nodes}
                            links={links}
                            getNodeColor={n => name2color(n.node.label)}
                            getNodeLabel={n => n.node.label}
                            getNodeText={n => {
                                let name = '';
                                name = n.node.properties.name ? n.node.properties.name : name;
                                name = n.node.properties.title ? n.node.properties.title : name;
                                name = name.replace(/<(?:.|\s)*?>/g, ' ').trim();
                                name = name.length > 10 ? name.substr(0, 8) + '...' : name;
                                return name;
                            }}
                            getLinkID={d => d.id}
                            getLinkText={d => d.types.toString()}
                            getSourceNodeID={d => d.source.toString()}
                            getTargetNodeID={d => d.target.toString()}
                            onNodeClick={id => {
                                dispatch(fetchRelationListWorker({project, id: parseInt(id, 10)}));
                                dispatch(selectNode(parseInt(id, 10)));
                            }}
                        />}
                </CardContent>
            </Card>
        );
    }
}

export default connect(mapStateToProps)(GraphPanel);
