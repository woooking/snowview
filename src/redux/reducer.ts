import { cloneDeep } from 'lodash';
import { getNodeIDFromRelation, relation2format } from '../utils';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
    changeTab,
    drawGraph, gotoIndex, receivedDocumentResult,
    receivedGraph,
    receivedNode, receivedRelationList, receivedShowRelation, requestDocumentResult, requestGraph, requestNode,
    requestRelationList,
    requestShowRelation, searchQuestion,
    selectNode, setQuestion
} from './action';
import { combineReducers } from 'redux';
import { DocumentResult, Neo4jd3, Question } from '../model';

export interface GraphState {
    fetching: boolean;
    toBeDrawn: boolean;
    instance?: Neo4jd3;
}

export interface RootState {
    graph: GraphState;
    page: string;
    tab: string;
    question ?: Question;
}

const selectedNode = reducerWithInitialState<number | null>(null)
    .case(requestGraph, (state, payload) => null)
    .case(selectNode, (state, payload) => payload);

const nodes = reducerWithInitialState<{}>({})
    .case(requestGraph, (state, payload) => ({}))
    .case(requestNode, (state, payload) => Object.assign({}, state, {
        [payload]: {
            fetched: false,
            node: null
        }
    }))
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
    });

const relationLists = reducerWithInitialState<{}>({})
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
        const relationsJson = relationList.map(relation2format);
        payload.graph.updateWithNeo4jData({results: [{data: [{graph: {nodes: [], relationships: relationsJson}}]}]});
        return Object.assign({}, state, {
            [payload.id]: []
        });
    });

const graph = reducerWithInitialState<GraphState>({fetching: false, toBeDrawn: false})
    .case(requestGraph, (state, payload) => ({fetching: true, toBeDrawn: false, instance: state.instance}))
    .case(receivedGraph, (state, payload) => {
        // if (payload.result === null) {
        //     return {fetching: false, toBeDrawn: false, graph: state.instance};
        // }
        // return {fetching: false, toBeDrawn: true, result: action.result};
        return state;
    })
    .case(drawGraph, (state, payload) => ({fetching: false, toBeDrawn: false, instance: payload}));

const page = reducerWithInitialState<string>('index')
    .case(gotoIndex, (state, payload) => 'index')
    .case(searchQuestion, (state, payload) => 'result');

const tab = reducerWithInitialState<string>('document')
    .case(gotoIndex, (state, payload) => 'document')
    .case(changeTab, (state, payload) => payload);

const question = reducerWithInitialState<string | null>(null)
    .case(searchQuestion, (state, payload) => payload)
    .case(setQuestion, (state, payload) => payload);

const documentResult =
    reducerWithInitialState<{ fetching: boolean, result: DocumentResult | null }>({fetching: false, result: null})
        .case(requestDocumentResult, (state, payload) => ({fetching: true, result: null}))
        .case(receivedDocumentResult, (state, payload) => ({fetching: false, result: payload}));

export const appReducer = combineReducers({
    selectedNode, nodes, relationLists, waitingRelationLists, graph, page, tab, question, documentResult
});