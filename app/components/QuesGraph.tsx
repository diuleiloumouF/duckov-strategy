'use client'
import { nanoid } from 'nanoid';

import { GraphConnection, GraphNode } from '../types/quest';
import { ReactFlow, Background, Controls, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface QuestListProps {
    nodes: GraphNode[];
    edges: GraphConnection[];
    // searchTerm: string;
}

export default function QuestGraph({ edges, nodes }: QuestListProps) {
    const reactFlowNodes: Node[] = nodes.map((node: GraphNode) => {
        return {
            id: node.$id,
            position: node.position,
            data: { label: node.name },
            // type: 'input',
        } as Node
    });

    const initialEdges = edges.map(edge => {
        return {
            id: nanoid(),
            source: edge.sourceNode.$ref,
            target: edge.targetNode.$ref,
        } as unknown as Edge;
    });

    return (
        <div style={{ height: '100%', width: '100%'}} className="text-gray-900 dark:text-gray-100">
            <ReactFlow nodes={reactFlowNodes} edges={initialEdges}>
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}
