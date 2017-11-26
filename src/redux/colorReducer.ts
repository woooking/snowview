import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { Map } from 'immutable';
import { Chance } from 'chance';
import { addNodes, fetchNode } from './action';
import { Neo4jNode } from '../model';

export interface ColorState {
    unusedColors: string[];
    colorMap: Map<string, string>;
}

const chance = new Chance();

const mainColors = [
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50',
    '#8BC34A',
    '#CDDC39',
    '#FFEB3B',
    '#FFC107',
    '#FF9800',
    '#FF5722',
    '#795548',
];

function randomColor(unused: string[]) {
    return unused.length === 0 ? chance.pickone(mainColors) : chance.pickone(unused);
}

function process(state: ColorState, node: Neo4jNode) {
    const label = node._labels[0];
    if (state.colorMap.has(label)) {
        return state;
    }
    const c = randomColor(state.unusedColors);
    return {unusedColors: state.unusedColors.filter(x => x !== c), colorMap: state.colorMap.set(label, c)};
}

export const color = reducerWithInitialState<ColorState>({unusedColors: mainColors, colorMap: Map()})
    .case(fetchNode.done, (s, p) => process(s, p.result))
    .case(addNodes, (s, p) => p.reduce((prev, n) => process(prev, n), s));


