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
                    nodes: Node[],
                    relationships: Relation[]
                }
            }>
        }>
    };
}

export interface Relation {
    startNode: number;
    endNode: number;
    id: number;
    type: string;
}

export interface Node {
    _id: number;
    _labels: string[];
    name?: string;
    uniformTitle?: string;
}

export interface D3Relation {
    raw: Relation;
    source: string | D3Node;
    target: string | D3Node;
}

export interface D3Node {
    raw: Node;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
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

