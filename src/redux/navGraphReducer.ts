import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { fetchNavGraph } from './action';
import { combineReducers } from 'redux';
import { Neo4jNode, Neo4jRelation, SnowRelation } from '../model';
import { Map } from 'immutable';
import { withError } from '../utils';
import * as _ from 'lodash';

export interface NavGraphState {
    fetching: boolean;
    nodes: Map<number, Neo4jNode>;
    relations: Map<string, SnowRelation>;
}
function r2id(neo4jRelation: Neo4jRelation) {
    return `${neo4jRelation.startNode},${neo4jRelation.endNode}`;
}

const fetching = reducerWithInitialState<boolean>(false)
    .case(fetchNavGraph.started, () => true)
    .case(fetchNavGraph.done, () => false)
    .case(fetchNavGraph.failed, () => withError('Failed to get nav graph', false));

const nodes = reducerWithInitialState<Map<number, Neo4jNode>>(Map())
    .case(fetchNavGraph.done, (s, p) =>
        p.result.nodes.reduce((prev, n) => prev.set(n._id, n), Map<number, Neo4jNode>()));

const relations = reducerWithInitialState<Map<string, SnowRelation>>(Map())
    .case(fetchNavGraph.done, (s, p) => {
        const grouped = _.groupBy(p.result.relationships, r2id);
        let newState = Map<string, SnowRelation>();
        for (const id of Object.keys(grouped)) {
            const [source, target] = id.split(',').map(x => parseInt(x, 10));
            const types = _.uniq(grouped[id].map(r => r.type));
            newState = newState.set(id, {shown: true, source, target, id, types});
        }
        return newState;
    });

export const navGraph = combineReducers({
    fetching, nodes, relations
});
