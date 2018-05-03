import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { fetchNavGraph } from './action';
import { combineReducers } from 'redux';
import { withError } from '../utils/utils';
import { Option, none, some } from 'ts-option';
import { NavNode, NavRelation } from '../model';

export interface NavGraphState {
    fetching: boolean;
    nodes: NavNode[];
    relations: NavRelation[];
    matrix: Option<number[][]>;
}

const fetching = reducerWithInitialState<boolean>(false)
    .case(fetchNavGraph.started, () => true)
    .case(fetchNavGraph.done, () => false)
    .case(fetchNavGraph.failed, () => withError('Failed to get nav graph', false));

const nodes = reducerWithInitialState<NavNode[]>([])
    .case(fetchNavGraph.done, (s, p) => p.result.nodes);

const relations = reducerWithInitialState<NavRelation[]>([])
    .case(fetchNavGraph.done, (s, p) => p.result.relationships);

const matrix = reducerWithInitialState<Option<number[][]>>(none)
    .case(fetchNavGraph.done, (s, p) => {
        const ns = p.result.nodes;
        const d = ns.map(() => ns.map(() => 0));
        p.result.relationships.forEach(r => d[r.startNode][r.endNode] += r.count);
        return some(d);
    });

export const navGraph = combineReducers({
    fetching, nodes, relations, matrix
});
