import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { fetchNavGraph } from './action';
import { combineReducers } from 'redux';
import { withError } from '../utils/utils';
import { Option, none, some } from 'ts-option';

export interface NavGraphState {
    fetching: boolean;
    data: Option<number[][]>;
}

const fetching = reducerWithInitialState<boolean>(false)
    .case(fetchNavGraph.started, () => true)
    .case(fetchNavGraph.done, () => false)
    .case(fetchNavGraph.failed, () => withError('Failed to get nav graph', false));

const data = reducerWithInitialState<Option<number[][]>>(none)
    .case(fetchNavGraph.done, (s, p) => {
        const nodes = p.result.nodes;
        const d = nodes.map(n1 => nodes.map(n2 => 0));
        p.result.relationships.forEach(r => d[r.startNode][r.endNode] = r.count);
        return some(d);
    });

export const navGraph = combineReducers({
    fetching, data
});
