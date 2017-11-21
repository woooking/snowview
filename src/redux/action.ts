import * as $ from 'jquery';
import actionCreatorFactory from 'typescript-fsa';
import bindThunkAction from 'typescript-fsa-redux-thunk';
import { CypherQueryResult, DocumentResult, RandomResult, Relation } from '../model';
// import { RelationListsState } from './reducer';
import { Node } from '../model';
import { RootState } from './reducer';

const URL = 'http://162.105.88.181:8080/SnowGraph';

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
export const addNodes = actionCreator<Node[]>('ADD_NODES');

export const fetchNode = actionCreator.async<number, Node>('FETCH_NODE');
export const fetchNodeWorker = bindThunkAction(
    fetchNode,
    async (params, dispatch, getState: () => RootState) => {
        const state = getState();
        if (state.graph.nodes.has(params)) {
            const node = state.graph.nodes.get(params);
            if (node.nonEmpty) {
                return node.get;
            }
        }
        return await $.post(`${URL}/GetNode`, {id: params});
    }
);

export const addShownRelations = actionCreator<Relation[]>('ADD_SHOWN_RELATIONS');
export const addRelations = actionCreator<Relation[]>('ADD_RELATIONS');

export const fetchRelationList = actionCreator.async<number, number[]>('FETCH_RELATION_LIST');
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
        const result: Relation[] = await $.post(`${URL}/OutGoingRelation`, {id: params});
        dispatch(addRelations(result));
        return result.map(r => r.id);
    }
);

export const showRelations = actionCreator<number[]>('SHOW_RELATIONS');

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

export const gotoIndex = actionCreator<{}>('GOTO_INDEX');
export const gotoResult = actionCreator<{}>('GOTO_RESULT');

export const changeTab = actionCreator<string>('CHANGE_TAB');
