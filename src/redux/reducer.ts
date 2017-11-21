import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
    addNodes, addRelations, addShownRelations,
    fetchDocumentResult, fetchGraph, fetchNode, fetchRandomQuestion, fetchRelationList, gotoIndex, gotoResult,
    selectNode, showRelations
} from './action';
import { combineReducers } from 'redux';
import { DocumentResult, Relation, Node } from '../model';
import { Map } from 'immutable';
import { none, Option, some } from 'ts-option';
import { show } from 'js-snackbar';

require('../../node_modules/js-snackbar/dist/snackbar.css');

function showError(message: string) {
    show({
        text: message,
        pos: 'bottom-center',
        duration: 1000
    });
}

function withError<V>(message: string, value: V): V {
    showError(message);
    return value;
}

export type ShowableRelation = {
    shown: boolean;
    relation: Relation;
};

export type NodesState = Map<number, Option<Node>>;

export type RelationsState = Map<number, ShowableRelation>;

export type RelationListsState = Map<number, Option<number[]>>;

export interface DocumentResultState {
    fetching: boolean;
    query: string;
    result?: DocumentResult;
}

export interface GraphState {
    fetching: boolean;
    selectedNode: Option<number>;
    nodes: NodesState;
    relations: RelationsState;
    relationLists: RelationListsState;
}

export interface RootState {
    fetchingRandomQuestion: boolean;
    graph: GraphState;
    page: string;
    documentResult: DocumentResultState;
}

const fetchingRandomQuestion = reducerWithInitialState<boolean>(false)
    .case(fetchRandomQuestion.started, () => true)
    .case(fetchRandomQuestion.done, (s, p) => {
        p.params(p.result.query);
        return false;
    })
    .case(fetchRandomQuestion.failed, () => withError('Failed to get a random question', false));

const fetching = reducerWithInitialState<boolean>(false)
    .case(fetchGraph.started, () => true)
    .case(fetchGraph.done, () => false)
    .case(fetchGraph.failed, () => withError('Failed to execute CypherQuery', false));

const selectedNode = reducerWithInitialState<Option<number>>(none)
    .case(fetchGraph.started, () => none)
    .case(selectNode, (s, p) => some(p));

const nodes = reducerWithInitialState<NodesState>(Map())
    .case(fetchGraph.started, (s, p) => Map())
    .case(fetchNode.started, (s, p) => s.set(p, s.get(p, none)))
    .case(fetchNode.done, (s, p) => s.set(p.params, some(p.result)))
    .case(fetchNode.failed, (s, p) => withError('Failed to get node', s.get(p.params).isEmpty ? s.remove(p.params) : s))
    .case(addNodes, (state, payload) => payload.reduce((p, n) => p.set(n._id, some(n)), state));

const relations = reducerWithInitialState<RelationsState>(Map())
    .case(fetchGraph.started, (state, payload) => Map())
    .case(addShownRelations, (state, payload) =>
        payload.reduce((p, r) => p.set( r.id, { shown: true, relation: r }), state))
    .case(addRelations, (state, payload) =>
        payload.reduce((p, r) => p.has(r.id) ? p : p.set(r.id, { shown: false, relation: r }), state))
    .case(showRelations, (state, payload) =>
        payload.reduce((p, r) => p.set(r, { shown: true, relation: p.get(r).relation }), state));

const relationLists = reducerWithInitialState<RelationListsState>(Map())
    .case(fetchGraph.started, (state, payload) => Map())
    .case(fetchRelationList.started, (state, payload) => state.set(payload, state.get(payload, none)))
    .case(fetchRelationList.done, (state, payload) => state.set(payload.params, some(payload.result)))
    .case(fetchRelationList.failed, (state, payload) =>
        withError('Failed to get relation list', state.remove(payload.params))
    );

const graph = combineReducers({
    fetching, selectedNode, nodes, relations, relationLists
});

const page = reducerWithInitialState<string>('index')
    .case(gotoIndex, (state, payload) => 'index')
    .case(gotoResult, (state, payload) => 'result');

const documentResult =
    reducerWithInitialState<DocumentResultState>({fetching: false, query: ''})
        .case(fetchDocumentResult.started, (state, payload) => ({fetching: true, query: payload.query}))
        .case(fetchDocumentResult.done, (state, payload) => ({
            fetching: false, query: payload.params.query, result: payload.result
        }))
        .case(fetchDocumentResult.failed, (state, payload) =>
            withError('Failed to rank', {fetching: false, query: payload.params.query}));

export const appReducer = combineReducers({
    fetchingRandomQuestion, graph, page, documentResult
});