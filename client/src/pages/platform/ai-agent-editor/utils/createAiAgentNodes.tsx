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
    const {icon, label, name, parameters, type} = clusterElementData;

    return {
        data: {
            ...clusterElementData,
            clusterElementName: type.split('/')[2],
            clusterElementType: type.split('/')[2],
            version: parseInt(type.split('/')[1].replace(/^v/, '')),
            componentName: type.split('/')[0],
            icon: icon ? (
                <InlineSVG
                    className="size-9"
                    loader={<ComponentIcon className="size-9 flex-none text-gray-900" />}
                    src={icon as string}
                />
            ) : (
                <ComponentIcon className="size-9 flex-none text-gray-900" />
            ),
            label,
            name,
            operationName: type.split('/')[0],
            parameters,
            type,
            workflowNodeName: name,
        },
        id: name,
        position: {x: 0, y: 0},
        type: 'workflow',
    };
}

export function createToolNode(tool: ClusterElementItemType) {
    const {icon, label, name, parameters, type} = tool;

    return {
        data: {
            ...tool,
            clusterElementName: type.split('/')[2],
            clusterElementType: 'tools',
            version: parseInt(type.split('/')[1].replace(/^v/, '')),
            componentName: type.split('/')[0],
            icon: icon ? (
                <InlineSVG
                    className="size-9"
                    loader={<ComponentIcon className="size-9 flex-none text-gray-900" />}
                    src={icon as string}
                />
            ) : (
                <ComponentIcon className="size-9 flex-none text-gray-900" />
            ),
            label,
            name,
            operationName: type.split('/')[2],
            parameters,
            type,
            workflowNodeName: name,
        },
        id: name,
        position: {x: 0, y: 0},
        type: 'workflow',
    };
}
