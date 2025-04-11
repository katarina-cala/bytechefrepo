import {BotIcon} from 'lucide-react';

const defaultAiAgentNodes = [
    {
        data: {
            componentName: 'aiAgent',
            icon: <BotIcon className="size-9 text-black" />,
            id: 'aiAgent_1',
            label: 'AI Agent',
            name: 'aiAgent',
            type: 'aiAgent/v1/chat',
            workflowNodeName: 'aiAgent_1',
        },
        id: 'aiAgent_1',
        position: {x: 500, y: 250},
        type: 'workflow',
    },
    {
        data: {label: '+'},
        id: `aiAgent_1-RAG-placeholder-0`,
        position: {x: 250, y: 500},
        type: 'placeholder',
    },
    {
        data: {label: '+'},
        id: `aiAgent_1-CHAT_MEMORY-placeholder-0`,
        position: {x: 400, y: 500},
        type: 'placeholder',
    },
    {
        data: {label: '+'},
        id: `aiAgent_1-MODEL-placeholder-0`,
        position: {x: 600, y: 500},
        type: 'placeholder',
    },
    {
        data: {label: '+'},
        id: `aiAgent_1-TOOLS-placeholder-0`,
        position: {x: 750, y: 500},
        type: 'placeholder',
    },
];

export default defaultAiAgentNodes;
