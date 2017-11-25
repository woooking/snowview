export interface RandomResult {
    answerId: number;
    query: string;
    query2: string;
}

export interface CypherQueryResult {
    searchResult: {
        results: Array<{
            data: Array<{
                graph: {
                    nodes: Neo4jNode[],
                    relationships: Neo4jRelation[]
                }
            }>
        }>
    };
}

export interface NavResult {
    nodes: Neo4jNode[],
    relationships: Neo4jRelation[]
}

export interface Neo4jRelation {
    startNode: number;
    endNode: number;
    id: number;
    type: string;
}

export interface Neo4jNode {
    _id: number;
    _labels: string[];
    name?: string;
    uniformTitle?: string;
}

export interface SnowRelation {
    shown: boolean;
    id: string;
    source: number;
    target: number;
    types: string[];
}

export interface SnowNode {
    shown: boolean;
    node: Neo4jNode;
}

export interface RankedResult {
    answerId: number;
    finalRank: number;
    solrRank: number;
    relevance: number;
    body: string;
    title: string;
}

export interface DocumentResult {
    query: string;
    rankedResults: Array<RankedResult>;
}

