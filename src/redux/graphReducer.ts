import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
    addNodes, addRelations, addShownRelations,
    fetchGraph, fetchNode, fetchRelationList,
    removeNode,
    selectNode, setCypher, showRelations
} from './action';
import { combineReducers } from 'redux';
import { Neo4jRelation, SnowNode, SnowRelation } from '../model';
import { Map } from 'immutable';
import { none, Option, some } from 'ts-option';
import { withError } from '../utils/utils';
import * as _ from 'lodash';

export type NodesState = Map<number, Option<SnowNode>>;

export type RelationsState = Map<string, SnowRelation>;

export type RelationListsState = Map<number, Option<string[]>>;

export interface GraphState {
    fetching: boolean;
    selectedNode: Option<number>;
    cypher: string;
    nodes: NodesState;
    relations: RelationsState;
    relationLists: RelationListsState;
}

function r2id(neo4jRelation: Neo4jRelation) {
    return `${neo4jRelation.startNode},${neo4jRelation.endNode}`;
}

const fetching = reducerWithInitialState<boolean>(false)
    .case(fetchGraph.started, () => true)
    .case(fetchGraph.done, () => false)
    .case(fetchGraph.failed, () => withError('Failed to execute CypherQuery', false));

const selectedNode = reducerWithInitialState<Option<number>>(none)
    .case(fetchGraph.started, () => none)
    .case(selectNode, (s, p) => some(p))
    .case(removeNode, (s, p) => s.exists(num => num === p) ? none : s);

const nodes = reducerWithInitialState<NodesState>(Map())
    .case(fetchGraph.started, () => Map())
    .case(fetchNode.started, (s, p) => s.update(p.id, (val = none) => val))
    .case(fetchNode.done, (s, p) => s.set(p.params.id, some(new SnowNode(true, p.result))))
    .case(
        fetchNode.failed,
        (s, p) => withError('Failed to get node', s.get(p.params.id).isEmpty ? s.remove(p.params.id) : s)
    )
    .case(addNodes, (s, p) => p.reduce((prev, n) => prev.set(n.id, some(new SnowNode(true, n))), s))
    .case(removeNode, (s, p) => s.set(p, s.get(p).map(sn => new SnowNode(false, sn.node))));

const relations = reducerWithInitialState<RelationsState>(Map())
    .case(fetchGraph.started, () => Map())
    .case(addShownRelations, (s, p) => {
        const grouped = _.groupBy(p, r2id);
        let newState = s;
        for (const id of Object.keys(grouped)) {
            const [source, target] = id.split(',').map(x => parseInt(x, 10));
            const types = _.uniq(grouped[id].map(r => r.type));
            newState = newState.set(id, {shown: true, source, target, id, types});
        }
        return newState;
    })
    .case(addRelations, (s, p) => {
        const grouped = _.groupBy(p, r2id);
        let newState = s;
        for (const id of Object.keys(grouped)) {
            const [source, target] = id.split(',').map(x => parseInt(x, 10));
            const types = _.uniq(grouped[id].map(r => r.type));
            if (newState.has(id)) {
                newState = newState.update(id, r => Object.assign({}, r, {types: _.uniq([...r.types, ...types])}));
            } else {
                newState = newState.set(id, {shown: false, source, target, id, types});
            }
        }
        return newState;
    })
    .case(showRelations, (s, p) =>
        p.reduce((prev, r) => prev.update(r, old => Object.assign({}, old, {shown: true})), s))
    .case(removeNode, (s, p) => (s.map(value => value!.source === p || value!.target === p ?
            Object.assign({}, value, {shown: false}) : value!) as Map<string, SnowRelation>
    ));

const relationLists = reducerWithInitialState<RelationListsState>(Map())
    .case(fetchGraph.started, () => Map())
    .case(fetchRelationList.started, (s, p) => s.set(p.id, s.get(p.id, none)))
    .case(fetchRelationList.done, (s, p) => s.set(p.params.id, some(p.result)))
    .case(fetchRelationList.failed, (s, p) =>
        withError('Failed to get relation list', s.remove(p.params.id))
    );

const cypher = reducerWithInitialState<string>('')
    .case(setCypher, (state, payload) => payload);

export const graph = combineReducers({
    fetching, selectedNode, cypher, nodes, relations, relationLists
});
