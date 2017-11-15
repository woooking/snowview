
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

export interface DocumentResult {
    query: string;
}

export interface Neo4jd3 {
    updateWithNeo4jData: Function;
}