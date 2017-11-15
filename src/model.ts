
export interface Relation {
    start: string;
    end: string;
    type: string;
    metadata: {
        id: string;
    };
}

export interface Node {
    data: {};
    metadata: {
      id: string;
      labels: Array<string>;
    };
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

export interface PlainQuestion {
    query: string;
}

export interface RichQuestion {
    answerId: number;
    query: string;
    query2: string;
}

export type Question = PlainQuestion | RichQuestion

