import * as React from 'react';
import { Card, CardContent, CardHeader } from 'material-ui';
import { Neo4jD3 } from '../neo4jd3';
import { connect } from 'react-redux';
import { NodesState, RelationListsState, RootState } from '../redux/reducer';
import { translation } from '../translation';
import { Dispatch } from 'redux';
import { drawGraph, fetchNode, fetchRelationList, selectNode } from '../redux/action';

const mapStateToProps = (state: RootState) => ({
    nodes: state.nodes,
    relationLists: state.relationLists,
    graph: state.graph.instance,
    result: state.graph.result,
    fetchingGraph: state.graph.fetching,
    redraw: state.graph.toBeDrawn
});

interface GraphPanelProps {
    nodes: NodesState;
    relationLists: RelationListsState;
    graph: Neo4jD3;
    result: { searchResult: {} };
    fetchingGraph: boolean;
    redraw: boolean;
    dispatch: Dispatch<RootState>;
}

class GraphPanel extends React.Component<GraphPanelProps, {}> {
    
    getNodes = () => this.props.nodes;
    
    getRelationLists = () => this.props.relationLists;
    
    getGraph = () => this.props.graph;
    
    updateD3 = () => {
        const {dispatch, result} = this.props;
        
        const neo4jd3 = new Neo4jD3('#neo4jd3', {
            showClassChnName: false,
            classes: translation.classes,
            showRlationshipsChnName: false,
            relationships: translation.relationships,
            highlight: [],
            icons: {
                'Api': 'gear',
                'Method': '',
                'Field': '',
                'Class': '',
                'Interface': '',
                'Cookie': 'paw',
                'Email': 'at',
                'Git': 'git',
                'Github': 'github',
                'gitCommit': 'github',
                'Google': 'google',
                'Ip': 'map-marker',
                'Issues': 'exclamation-circle',
                'Language': 'language',
                'Options': 'sliders',
                'Password': 'lock',
                'Phone': 'phone',
                'Project': 'folder-open',
                'SecurityChallengeAnswer': 'commenting',
                'User': '',
                'MailUser': '',
                'IssueUser': '',
                'StackOverflowUser': '',
                'gitCommitAuthor': '',
                'mutatedFile': 'file-o',
                'zoomFit': 'arrows-alt',
                'zoomIn': 'search-plus',
                'zoomOut': 'search-minus'
            },
            minCollision: 60,
            neo4jData: result.searchResult,
            nodeRadius: 40,
            onNodeClick: (node: { id: number }) => {
                dispatch(fetchNode(node.id, this.getNodes(), this.getGraph()));
                dispatch(fetchRelationList(node.id, this.getRelationLists(), this.getGraph()));
                dispatch(selectNode(node.id));
            },
            onNodeDoubleClick: (node: { id: number }) => {
                neo4jd3.removeNode(node);
            },
            zoomFit: false,
            infoPanel: false,
            lineColor: 'black',
            lineWidth: '3',
            relationTextColor: 'black',
            relationTextFontSize: '15px',
            nodeFillColor: '#F0F8FF'
        });
        dispatch(drawGraph(neo4jd3));
    }
    
    componentDidMount() {
        if (this.props.redraw) {
            this.updateD3();
        }
    }
    
    componentDidUpdate() {
        if (this.props.redraw) {
            this.updateD3();
        }
    }
    
    render() {
        return (
            <Card>
                <CardHeader title="Related API Code Graph"/>
                <CardContent>
                    {!this.props.fetchingGraph && <div style={{height: 800}} id="neo4jd3"/>}
                </CardContent>
            </Card>
        );
    }
}

export default connect(mapStateToProps)(GraphPanel);
