import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Card, CardContent, CardHeader } from 'material-ui';
import { Map } from 'immutable';
import { RootState } from '../redux/reducer';
import D3Graph from './D3Graph';
import { Option } from 'ts-option';
import { SnowNode, SnowRelation } from '../model';
import { NodesState, RelationsState } from '../redux/graphReducer';
import { fetchRelationListWorker, selectNode } from '../redux/action';

const mapStateToProps = (state: RootState) => ({
    nodes: state.graph.nodes,
    relations: state.graph.relations,
    colorMap: state.color.colorMap,
    selectedNode: state.graph.selectedNode
});

interface GraphPanelProps {
    nodes: NodesState;
    relations: RelationsState;
    colorMap: Map<string, string>;
    selectedNode: Option<number>;
    dispatch: Dispatch<RootState>;
}

class Graph extends D3Graph<SnowNode, SnowRelation> {
}

class GraphPanel extends React.Component<GraphPanelProps, {}> {

    render() {
        const {dispatch, colorMap, selectedNode} = this.props;

        const nodes = this.props.nodes
            .valueSeq()
            .flatMap<number, SnowNode>((x?: Option<SnowNode>) => x!.toArray)
            .filter(x => x!.shown)
            .toArray();

        const links = this.props.relations
            .valueSeq()
            .filter(x => x!.shown)
            .filter(x => nodes.some(n => n.node._id === x!.source) && nodes.some(n => n.node._id === x!.target))
            .toArray();

        return (
            <Card>
                <CardHeader title="Knowledge Graph Visualization"/>
                <CardContent>
                    <Graph
                        id="neo4jd3"
                        highlight={selectedNode}
                        nodes={nodes}
                        links={links}
                        getNodeID={n => n.node._id.toString()}
                        getNodeColor={n => colorMap.get(n.node._labels[0], '#DDDDDD')}
                        getNodeLabel={n => n.node._labels[0]}
                        getNodeText={n => {
                            let name = '';
                            name = n.node.uniformText && n.node.uniformText.length > 0 ? n.node.uniformText : name;
                            name = n.node.uniformTitle && n.node.uniformTitle.length > 0 ? n.node.uniformTitle : name;
                            name = name.replace(/<(?:.|\s)*?>/g, ' ').trim();
                            name = name.length > 20 ? name.substr(0, 20) + '...' : name;
                            return name;
                        }}
                        getLinkID={d => d.id}
                        getLinkText={d => d.types.toString()}
                        getSourceNodeID={d => d.source.toString()}
                        getTargetNodeID={d => d.target.toString()}
                        onNodeClick={d => {
                            dispatch(fetchRelationListWorker(d.raw.node._id));
                            dispatch(selectNode(d.raw.node._id));
                        }}
                    />
                </CardContent>
            </Card>
        );
    }
}

export default connect(mapStateToProps)(GraphPanel);
