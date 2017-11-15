import { node2format, relation2format } from '../utils';
import * as $ from 'jquery';
import actionCreatorFactory from 'typescript-fsa';
import { Dispatch } from 'redux';
import bindThunkAction from 'typescript-fsa-redux-thunk';
import { DocumentResult, Neo4jd3, Relation } from '../model';

const URL = 'http://162.105.88.181:8080';

const actionCreator = actionCreatorFactory();

export const searchQuestion = actionCreator<string>('SEARCH_QUESTION');
export const setQuestion = actionCreator<string>('SET_QUESTION');

export const requestDocumentResult = actionCreator<{}>('REQUEST_DOCUMENT_RESULT');
export const receivedDocumentResult = actionCreator<DocumentResult>('RECEIVED_DOCUMENT_RESULT');

export function fetchDocumentResult(question: { query: string }) {
    if (question.query === '') {
        return function (dispatch: Dispatch<{}>) {
            $.post(`${URL}/Random`, {})
                .done(q => {
                    dispatch(setQuestion(q));
                    dispatch(requestDocumentResult({}));
                    $.post(`${URL}/Rank`, question)
                        .done((result: DocumentResult) => {
                            dispatch(receivedDocumentResult(result));
                            dispatch(fetchGraphWorker({query: result.query}));
                        });
                });
        };
    }
    return function (dispatch: Dispatch<{}>) {
        dispatch(requestDocumentResult({}));
        $.post(`${URL}/Rank`, question)
            .done(result => {
                dispatch(receivedDocumentResult(result));
                dispatch(fetchGraphWorker({query: result.query}));
            });
    };
}

export const selectNode = actionCreator<number>('SELECT_NODE');
export const requestNode = actionCreator<number>('REQUEST_NODE');
export const receivedNode = actionCreator<{ id: number, node: Node }>('RECEIVED_NODE');

export function fetchNode(id: number, nodes: Array<number>, graph: Neo4jd3) {
    return function (dispatch: Dispatch<{}>) {
        if (id in nodes) {
            return;
        }
        dispatch(requestNode(id));
        $.post(`${URL}/GetNode`, {id})
            .done(result => {
                dispatch(receivedNode({id, node: result}));
                const nodeJson = node2format(result);
                graph.updateWithNeo4jData({results: [{data: [{graph: {nodes: [nodeJson], relationships: []}}]}]});
                dispatch(receivedShowRelation({id, graph}));
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

export const requestRelationList = actionCreator<number>('REQUEST_RELATION_LIST');
export const receivedRelationList =
    actionCreator<{ id: number, relationList: Array<Relation> }>('RECEIVED_RELATION_LIST');

export function fetchRelationList(id: number, relationLists: Array<Relation>, graph: Neo4jd3) {
    return function (dispatch: Dispatch<{}>) {
        if (id in relationLists) {
            return;
        }
        dispatch(requestRelationList(id));
        return $.post(`${URL}/OutGoingRelation`, {id}, result => {
            dispatch(receivedRelationList({id, relationList: result}));
            const relationsJson = result.map(relation2format);
            graph.updateWithNeo4jData({results: [{data: [{graph: {nodes: [], relationships: relationsJson}}]}]});
        });
    };
}

export const requestShowRelation =
    actionCreator<{ id: number, relationIndex: number, relation: Relation }>('REQUEST_SHOW_REALTION');
export const receivedShowRelation = actionCreator<{ id: number, graph: Neo4jd3 }>('RECEIVED_SHOW_REALTION');

export const requestGraph = actionCreator<{}>('REQUEST_GRAPH');
export const receivedGraph = actionCreator<string>('RECEIVED_GRAPH');
export const drawGraph = actionCreator<Neo4jd3>('DRAW_GRAPH');
export const fetchGraph = actionCreator.async<{query: string}, {}>('FETCH_GRAPH');
export const fetchGraphWorker = bindThunkAction(
    fetchGraph,
    async (params , dispatch) => {
        dispatch(requestGraph({}));
        const result = await $.post(`${URL}/CypherQuery`, {query: params.query});
        dispatch(receivedGraph(result));
        return {};
    });

export const gotoIndex = actionCreator<{}>('GOTO_INDEX');

export const changeTab = actionCreator<string>('CHANGE_TAB');
