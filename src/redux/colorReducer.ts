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

export const mainColors = [
    '#8B2323',
    '#f44336',
    '#e57373',
    '#795548',
    '#f57f17',
    '#fff176',
    '#b4a647',
    '#ccff90',
    '#54FF9F',
    '#7FFF00',
    '#2e7d32',
    '#004d40',
    '#008B8B',
    '#18ffff',
    '#90a4ae',
    '#4A708B',
    '#2196f3',
    '#304ffe',
    '#836FFF',
    '#6a1b9a',
    '#ea80fc',
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
