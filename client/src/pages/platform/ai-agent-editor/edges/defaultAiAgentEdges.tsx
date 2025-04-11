const defaultAiAgentEdges = [
    {
        id: `aiAgent_1=>aiAgent_1-RAG-placeholder-0`,
        source: 'aiAgent_1',
        target: `aiAgent_1-RAG-placeholder-0`,
        type: 'smoothstep',
    },
    {
        id: `aiAgent_1=>aiAgent_1-CHAT_MEMORY-placeholder-0`,
        source: 'aiAgent_1',
        target: `aiAgent_1-CHAT_MEMORY-placeholder-0`,
        type: 'smoothstep',
    },
    {
        id: `aiAgent_1=>aiAgent_1-MODEL-placeholder-0`,
        source: 'aiAgent_1',
        target: `aiAgent_1-MODEL-placeholder-0`,
        type: 'smoothstep',
    },
    {
        id: `aiAgent_1=>aiAgent_1-TOOLS-placeholder-0`,
        source: 'aiAgent_1',
        target: `aiAgent_1-TOOLS-placeholder-0`,
        type: 'smoothstep',
    },
];

export default defaultAiAgentEdges;
