export interface CypherQueryResult {
    nodes: Neo4jNode[];
    relationships: Neo4jRelation[];
}

export interface NavResult {
    nodes: NavNode[];
    relationships: NavRelation[];
}

export interface NavRelation {
    startNode: number;
    endNode: number;
    id: number;
    count: number;
    type: string;
}

export interface NavNode {
    id: number;
    label: string;
    count: number;
}

export interface Neo4jRelation {
    startNode: number;
    endNode: number;
    id: number;
    type: string;
}

export interface Neo4jNode {
    id: number;
    label: string;
    properties: object;
}

export interface SnowRelation {
    shown: boolean;
    id: string;
    source: number;
    target: number;
    types: string[];
}

export class SnowNode implements INode {
    shown: boolean;
    node: Neo4jNode;

    constructor(shown: boolean, node: Neo4jNode) {
        this.shown = shown;
        this.node = node;
    }

    getID(): string {
        return this.node.id.toString();
    }
}

export interface INode {
    getID(): string;
}

export interface RankedResult {
    newRank: number;
    irRank: number;
    body: string;
    title: string;
    highlight: boolean;
}

export interface DocumentResult {
    query: string;
    rankedResults: Array<RankedResult>;
}
