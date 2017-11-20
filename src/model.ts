
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
    source: number;
    target: number;
}

export interface Node {
    _id: number;
    _labels: string[];
    x?: number;
    y?: number;
    r?: number;
    color?: string;
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

