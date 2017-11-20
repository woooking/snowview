import { cloneDeep } from 'lodash';
import { getNodeIDFromRelation } from '../utils';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
    addNodes, addShownRelation,
    changeTab,
    drawGraph, fetchDocumentResult, fetchRandomQuestion, gotoIndex, gotoResult,
    receivedGraph,
    receivedNode, receivedRelationList, receivedShowRelation,
    requestGraph, requestNode,
    requestRelationList,
    requestShowRelation,
    selectNode
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
    })
}

export type NodesState = Map<number, Option<Node>>;

export type RelationsState = Map<number, Option<Relation>>;

export type RelationListsState = {
    [key: number]: {
        fetched: boolean;
        relationList: Array<{ shown: boolean, raw: Relation }>;
    }
};

export interface DocumentResultState {
    fetching: boolean;
    query: string;
    result?: DocumentResult;
}

export interface RootState {
    fetchingRandomQuestion: boolean;
    selectedNode: number;
    nodes: NodesState;
    relations: RelationsState;
    relationLists: RelationListsState;
    page: string;
    tab: string;
    documentResult: DocumentResultState;
}

const fetchingRandomQuestion = reducerWithInitialState<boolean>(false)
    .case(fetchRandomQuestion.started, (state, payload) => true)
    .case(fetchRandomQuestion.done, (state, payload) => {
        payload.params.callback(payload.result.query);
        return false;
    })
    .case(fetchRandomQuestion.failed, () => {
        showError('Failed to get a random question');
        return false;
    });

const selectedNode = reducerWithInitialState<number | null>(null)
    .case(requestGraph, (state, payload) => null)
    .case(selectNode, (state, payload) => payload);

const nodes = reducerWithInitialState<NodesState>(Map())
    .case(requestGraph, (state, payload) => (Map()))
    .case(requestNode, (state, payload) => state.set(payload, none))
    .case(receivedNode, (state, payload) => {
        if (payload.node == null) {
            const newState = Object.assign({}, state);
            delete newState[payload.id];
            return newState;
        }
        return Object.assign({}, state, {
            [payload.id]: {
                fetched: true,
                node: payload.node
            }
        });
    })
    .case(addNodes, (state, payload) => {
        let newState = state;
        for (let node of payload) {
            newState = newState.set(node._id, some(node));
        }
        return newState;
    });

const relations = reducerWithInitialState<RelationsState>(Map())
    .case(requestGraph, (state, payload) => (Map()))
    .case(addShownRelation, (state, payload) => state.set(payload.id, some(payload)));

const relationLists = reducerWithInitialState<RelationListsState>({})
    .case(requestGraph, (state, payload) => ({}))
    .case(requestRelationList, (state, payload) => Object.assign({}, state, {
        [payload]: {
            fetched: false,
            node: null
        }
    }))
    .case(receivedRelationList, (state, payload) => Object.assign({}, state, {
        [payload.id]: {
            fetched: true,
            relationList: payload.relationList.map(r => ({shown: false, raw: r}))
        }
    }))
    .case(requestShowRelation, (state, payload) => {
        const newState = cloneDeep(state);
        newState[payload.id].relationList[payload.relationIndex].shown = true;
        return newState;
    });

const waitingRelationLists = reducerWithInitialState<{}>({})
    .case(requestGraph, (state, payload) => ({}))
    .case(requestShowRelation, (state, payload) => {
        const relation = payload.relation;
        const [startID, endID] = getNodeIDFromRelation(relation);
        const otherID = startID === payload.id ? endID : startID;
        let oldList = state[otherID];
        if (!oldList) {
            oldList = [];
        }
        return Object.assign({}, state, {
            [otherID]: [...oldList, payload.relation]
        });
    })
    .case(receivedShowRelation, (state, payload) => {
        const relationList = state[payload.id];
        if (!relationList) {
            return state;
        }
        // const relationsJson = relationList.map(relation2format);
        // payload.graph.updateWithNeo4jData({results: [{data: [{graph: {nodes: [], relationships: relationsJson}}]}]});
        return Object.assign({}, state, {
            [payload.id]: []
        });
    });

const page = reducerWithInitialState<string>('index')
    .case(gotoIndex, (state, payload) => 'index')
    .case(gotoResult, (state, payload) => 'result');

const tab = reducerWithInitialState<string>('document')
    .case(gotoIndex, (state, payload) => 'document')
    .case(changeTab, (state, payload) => payload);

const documentResult =
    reducerWithInitialState<DocumentResultState>({fetching: false, query: ''})
        .case(fetchDocumentResult.started, (state, payload) => ({fetching: true, query: payload.query}))
        .case(fetchDocumentResult.done, (state, payload) => ({
            fetching: false, query: payload.params.query, result: payload.result
        }))
        .case(fetchDocumentResult.failed, (state, payload) => {
            showError('Failed to rank');
            return {fetching: false, query: payload.params.query};
        });

export const appReducer = combineReducers({
    fetchingRandomQuestion,
    selectedNode, nodes, relations, relationLists, waitingRelationLists, graph, page, tab, documentResult
});