import {ClusterElementItemType} from '@/shared/types';
import {Node} from '@xyflow/react';
import {ComponentIcon} from 'lucide-react';
import InlineSVG from 'react-inlinesvg';

export function createPlaceholderNode(currentAiAgentNodeName: string | undefined, type: string): Node {
    return {
        data: {clusterElementType: type, label: '+'},
        id: `${currentAiAgentNodeName}-${type}-placeholder-0`,
        position: {x: 0, y: 0},
        type: 'placeholder',
    };
}

export function createToolsGhostNode(currentAiAgentNodeName: string | undefined): Node {
    return {
        data: {
            aiAgentId: currentAiAgentNodeName,
            clusterElementType: 'tools',
        },
        id: `${currentAiAgentNodeName}-tools-ghost`,
        position: {x: 0, y: 0},
        type: 'aiAgentToolsGhostNode',
    };
}

export function createClusterElementNode(clusterElementData: ClusterElementItemType) {
    const {label, name, parameters, type} = clusterElementData;
    const iconUrl = `/icons/${type.split('/')[0]}.svg`;

    return {
        data: {
            ...clusterElementData,
            clusterElementName: type.split('/')[2],
            clusterElementType: type.split('/')[2],
            componentName: type.split('/')[0],
            icon: (
                <InlineSVG
                    className="size-9"
                    loader={<ComponentIcon className="size-9 flex-none text-gray-900" />}
                    src={iconUrl as string}
                />
            ),
            label,
            name,
            operationName: type.split('/')[0],
            parameters,
            type,
            version: parseInt(type.split('/')[1].replace(/^v/, '')),
            workflowNodeName: name,
        },
        id: name,
        position: {x: 0, y: 0},
        type: 'workflow',
    };
}

export function createToolNode(tool: ClusterElementItemType) {
    const {label, name, parameters, type} = tool;
    const iconUrl = `/icons/${type.split('/')[0]}.svg`;

    return {
        data: {
            ...tool,
            clusterElementName: type.split('/')[2],
            clusterElementType: 'tools',
            componentName: type.split('/')[0],
            icon: (
                <InlineSVG
                    className="size-9"
                    loader={<ComponentIcon className="size-9 flex-none text-gray-900" />}
                    src={iconUrl as string}
                />
            ),
            label,
            name,
            operationName: type.split('/')[2],
            parameters,
            type,
            version: parseInt(type.split('/')[1].replace(/^v/, '')),
            workflowNodeName: name,
        },
        id: name,
        position: {x: 0, y: 0},
        type: 'workflow',
    };
}
