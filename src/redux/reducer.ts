import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
    fetchDocumentResult
} from './action';
import { combineReducers } from 'redux';
import { DocumentResult } from '../model';
import { show } from 'js-snackbar';
import { graph, GraphState } from './graphReducer';
import { navGraph, NavGraphState } from './navGraphReducer';

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

export interface DocumentResultState {
    fetching: boolean;
    query: string;
    result?: DocumentResult[];
}

export interface RootState {
    fetchingRandomQuestion: boolean;
    graph: GraphState;
    documentResult: DocumentResultState;
    navGraph: NavGraphState;
}

const documentResult =
    reducerWithInitialState<DocumentResultState>({fetching: false, query: ''})
        .case(fetchDocumentResult.started, (state, payload) => ({fetching: true, query: payload.query}))
        .case(fetchDocumentResult.done, (state, payload) => {
            for (let i = 0; i < payload.result.length; ++i) {
                payload.result[i].rank = i + 1;
            }
            return {
                fetching: false, query: payload.params.query, result: payload.result
            };
        })
        .case(fetchDocumentResult.failed, (state, payload) =>
            withError('Failed to rank', {fetching: false, query: payload.params.query}));

export const appReducer = combineReducers({
    graph, documentResult, navGraph
});