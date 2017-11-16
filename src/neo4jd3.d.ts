
declare namespace neo4jd3 {
    class Neo4jD3 {
        constructor(selector: string, options: {})
        
        removeNode(node: {id: number}): void
    
        updateWithNeo4jData(data: {}): void
    }
}

export = neo4jd3;