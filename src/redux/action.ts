import * as $ from 'jquery';
import actionCreatorFactory from 'typescript-fsa';
import { Dispatch } from 'redux';
import bindThunkAction from 'typescript-fsa-redux-thunk';
import { CypherQueryResult, DocumentResult, RandomResult, Relation } from '../model';
import { NodesState, RelationListsState } from './reducer';
import { Node } from '../model';

const URL = 'http://162.105.88.181:8080/SnowGraph';

const actionCreator = actionCreatorFactory();

export const fetchRandomQuestion = actionCreator.async<{ callback: Function }, RandomResult>('FETCH_RANDOM_QUESTION');
export const fetchRandomQuestionWorker = bindThunkAction(
    fetchRandomQuestion,
    async () => {
        return await $.post(`${URL}/Random`, {});
    }
);

export const fetchDocumentResult =
    actionCreator.async<{ query: string }, DocumentResult>('FETCH_DOCUMENT_RESULT');
export const fetchDocumentResultWorker = bindThunkAction(
    fetchDocumentResult,
    async (params) => {
        return await $.post(`${URL}/Rank`, params);
    }
);

export const selectNode = actionCreator<number>('SELECT_NODE');
export const requestNode = actionCreator<number>('REQUEST_NODE');
export const receivedNode = actionCreator<{ id: number, node: Node }>('RECEIVED_NODE');
export const addNodes = actionCreator<Node[]>('ADD_NODES');

export function fetchNode(id: number, nodes: NodesState) {
    return function (dispatch: Dispatch<{}>) {
        if (id in nodes) {
            return;
        }
        dispatch(requestNode(id));
        $.post(`${URL}/GetNode`, {id})
            .done(result => {
                dispatch(receivedNode({id, node: result}));
                // const nodeJson = node2format(result);
                // graph.updateWithNeo4jData({results: [{data: [{graph: {nodes: [nodeJson], relationships: []}}]}]});
                dispatch(receivedShowRelation({id}));
            })
            .fail(() => {
                // show({
                //     text: 'Could not connect to server',
                //     pos: 'bottom-center',
                // });
                // dispatch(receivedNode(id, null));
            });
    };
}

export const addShownRelation = actionCreator<Relation>('ADD_SHOWN_RELATION');

export const requestRelationList = actionCreator<number>('REQUEST_RELATION_LIST');
export const receivedRelationList =
    actionCreator<{ id: number, relationList: Array<Relation> }>('RECEIVED_RELATION_LIST');

export function fetchRelationList(id: number, relationLists: RelationListsState) {
    return function (dispatch: Dispatch<{}>) {
        if (id in relationLists) {
            return;
        }
        dispatch(requestRelationList(id));
        return $.post(`${URL}/OutGoingRelation`, {id}, result => {
            dispatch(receivedRelationList({id, relationList: result}));
            // const relationsJson = result.map(relation2format);
            // graph.updateWithNeo4jData({results: [{data: [{graph: {nodes: [], relationships: relationsJson}}]}]});
        });
    };
}

export const requestShowRelation =
    actionCreator<{ id: number, relationIndex: number, relation: Relation }>('REQUEST_SHOW_REALTION');
export const receivedShowRelation = actionCreator<{ id: number }>('RECEIVED_SHOW_REALTION');

export const requestGraph = actionCreator<{}>('REQUEST_GRAPH');
export const receivedGraph = actionCreator<{}>('RECEIVED_GRAPH');
export const drawGraph = actionCreator<{}>('DRAW_GRAPH');
export const fetchGraph = actionCreator.async<{ query: string }, {}>('FETCH_GRAPH');
export const fetchGraphWorker = bindThunkAction(
    fetchGraph,
    async (params, dispatch) => {
        dispatch(requestGraph({}));
        const result: CypherQueryResult = await $.post(`${URL}/CypherQuery`, {query: params.query});
        const nodes = result.searchResult.results[0].data[0].graph.nodes;
        const relations = result.searchResult.results[0].data[0].graph.relationships;
        
        dispatch(addNodes(nodes));
        relations.forEach(r => {
            r.source = r.startNode;
            r.target = r.endNode;
            dispatch(addShownRelation(r))
        });
        dispatch(receivedGraph({}));
        return {};
    });

export const gotoIndex = actionCreator<{}>('GOTO_INDEX');
export const gotoResult = actionCreator<{}>('GOTO_RESULT');

export const changeTab = actionCreator<string>('CHANGE_TAB');
