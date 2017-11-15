import { translation } from './translation';
import { Relation, Node } from './model';

function extractID(url: string): number {
    const pattern = new RegExp('/db/data/node/(\\d+)');
    const result = pattern.exec(url);
    if (result != null) {
        return parseInt(result[1], 10);
    }
    throw new Error('Invalid URL');
}

export function rename(str: string) {
    if (translation.relationships[str] && translation.relationships[str].englishName) {
        return translation.relationships[str].englishName;
    }
    if (translation.in_relationships[str] && translation.in_relationships[str].englishName) {
        return translation.in_relationships[str].englishName;
    }
    if (translation.ou_relationships[str] && translation.ou_relationships[str].englishName) {
        return translation.ou_relationships[str].englishName;
    }
    if (str.substring(0, 3) === 'in_') { return str.substring(3) + '(incoming)'; }
    if (str.substring(0, 3) === 'ou_') { return str.substring(3) + '(outgoing)'; }
    return str;
}

export function getNodeIDFromRelation(relation: Relation) {
    const startID = extractID(relation.start);
    const endID = extractID(relation.end);
    return [startID, endID];
}

export function relation2format(relation: Relation) {
    const [startID, endID] = getNodeIDFromRelation(relation);
    return {
        id: relation.metadata.id, type: relation.type.substr(3), startNode: startID, endNode: endID, properties: {}
    };
}

export function node2format(node: Node) {
    return {
        id: node.metadata.id,
        labels: node.metadata.labels,
        properties: node.data
    };
}