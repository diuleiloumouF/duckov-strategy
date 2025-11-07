export interface GraphNode {
    questID?: number;
    name: string;
    color?: Color;
    tag?: string;
    position: Vector2;
    comment: string;
    $type: string;
    $id?: string;
}

export type Color = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export interface NodeReference {
    $ref: string;
}

export interface GraphConnection {
    sourceNode: NodeReference;
    targetNode: NodeReference;
    $type: string;
}

export interface IQuestGraph {
    type: string;
    nodes: GraphNode[];
    connections: GraphConnection[];
}

// 如果 Vector2 还没有定义，可能需要:
export interface Vector2 {
    x: number;
    y: number;
}

export type ParsedQuestName = {
    questId: string;
    title: string;
    npc: string;
    rewards: string;
    unlock?: string;
};

export function parseQuestName(name: string): ParsedQuestName {
    // Format: "#111 启动资金   [杰夫]\nexp:500  $:1296"
    const lines = name.split('\n');
    const firstLine = lines[0] || '';
    const secondLine = lines[1] || '';
    const unlock = lines[2];

    // Extract quest ID and title
    const idMatch = firstLine.match(/#(\S+)\s+(.+?)\s+\[(.+?)]/);
    const questId = idMatch?.[1] || '';
    const title = idMatch?.[2] || firstLine;
    const npc = idMatch?.[3] || '';

    return {
        questId,
        title,
        npc,
        rewards: secondLine.trim(),
        unlock,
    };
}
