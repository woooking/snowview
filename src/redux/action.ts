import * as $ from 'jquery';
import actionCreatorFactory from 'typescript-fsa';
import bindThunkAction from 'typescript-fsa-redux-thunk';
import { CypherQueryResult, DocumentResult, RandomResult, Neo4jRelation, NavResult } from '../model';
import { Neo4jNode } from '../model';
import { RootState } from './reducer';
import * as _ from 'lodash';

// const URL = 'http://162.105.88.181:8080/SnowGraph';
// const URL = 'http://127.0.0.1:8080/SnowGraph';
const URL = 'http://162.105.88.28:8080/SnowGraph';

const actionCreator = actionCreatorFactory();

export const fetchRandomQuestion = actionCreator.async<Function, RandomResult>('FETCH_RANDOM_QUESTION');
export const fetchRandomQuestionWorker = bindThunkAction(
    fetchRandomQuestion,
    async () => {
        return await $.post(`${URL}/Random`, {});
    }
);

export const fetchDocumentResult = actionCreator.async<{ query: string }, DocumentResult>('FETCH_DOCUMENT_RESULT');
export const fetchDocumentResultWorker = bindThunkAction(
    fetchDocumentResult,
    async (params) => {
        return await $.post(`${URL}/Rank`, params);
    }
);

export const selectNode = actionCreator<number>('SELECT_NODE');
export const removeNode = actionCreator<number>('REMOVE_NODE');
export const addNodes = actionCreator<Neo4jNode[]>('ADD_NODES');

export const fetchNode = actionCreator.async<number, Neo4jNode>('FETCH_NODE');
export const fetchNodeWorker = bindThunkAction(
    fetchNode,
    async (params, dispatch, getState: () => RootState) => {
        const state = getState();
        if (state.graph.nodes.has(params)) {
            const node = state.graph.nodes.get(params);
            if (node.nonEmpty) {
                return node.get.node;
            }
        }
        return await $.post(`${URL}/GetNode`, {id: params});
    }
);

export const addShownRelations = actionCreator<Neo4jRelation[]>('ADD_SHOWN_RELATIONS');
export const addRelations = actionCreator<Neo4jRelation[]>('ADD_RELATIONS');

export const fetchRelationList = actionCreator.async<number, string[]>('FETCH_RELATION_LIST');
export const fetchRelationListWorker = bindThunkAction(
    fetchRelationList,
    async (params, dispatch, getState: () => RootState) => {
        const state = getState();
        if (state.graph.relationLists.has(params)) {
            const list = state.graph.relationLists.get(params);
            if (list.nonEmpty) {
                return list.get;
            }
        }
        const result: Neo4jRelation[] = await $.post(`${URL}/OutGoingRelation`, {id: params});
        dispatch(addRelations(result));
        return _.uniq(result.map(r => `${r.startNode},${r.endNode}`));
    }
);

export const showRelations = actionCreator<string[]>('SHOW_RELATIONS');

export const fetchGraph = actionCreator.async<{ query: string }, {}>('FETCH_GRAPH');
export const fetchGraphWorker = bindThunkAction(
    fetchGraph,
    async (params, dispatch) => {
        const result: CypherQueryResult = await $.post(`${URL}/CypherQuery`, {query: params.query});
        const nodes = result.searchResult.results[0].data[0].graph.nodes;
        const relations = result.searchResult.results[0].data[0].graph.relationships;

        dispatch(addNodes(nodes));
        dispatch(addShownRelations(relations));
        return {};
    });

export const fetchNavGraph = actionCreator.async<{}, NavResult>('FETCH_NAV_GRAPH');
export const fetchNavGraphWorker = bindThunkAction(
    fetchNavGraph,
    async () => {
        return await $.post(`${URL}/Nav`, {});
    });