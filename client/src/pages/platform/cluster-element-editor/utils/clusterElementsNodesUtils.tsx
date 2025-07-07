import {DEFAULT_NODE_POSITION, ROOT_CLUSTER_HANDLE_STEP, ROOT_CLUSTER_WIDTH} from '@/shared/constants';
import {ClusterElementItemType} from '@/shared/types';
import {Node} from '@xyflow/react';
import {ComponentIcon} from 'lucide-react';
import InlineSVG from 'react-inlinesvg';

export function createPlaceholderNode(
    clusterRootId: string,
    elementLabel: string,
    elementType: string,
    nodePositions: Record<string, {x: number; y: number}> = {},
    clusterElementTypeIndex: number = 0,
    totalClusterElementTypeCount: number = 1
): Node {
    const nodeId = `${clusterRootId}-${elementType}-placeholder-0`;
    const placeholderWidth = 28;

    const calculateNodeWidth = (handleCount: number): number => {
        const baseWidth = ROOT_CLUSTER_WIDTH;
        const handleStep = ROOT_CLUSTER_HANDLE_STEP;

        if (!handleCount || handleCount <= 4) {
            return baseWidth;
        }

        return baseWidth + (handleCount - 4) * handleStep;
    };

    const getHandlePosition = (index: number, totalHandles: number, nodeWidth: number): number => {
        const edgeBuffer = nodeWidth * 0.1;
        const usableWidth = nodeWidth - edgeBuffer * 2;

        if (totalHandles === 1) {
            return nodeWidth / 2;
        }

        const step = usableWidth / (totalHandles - 1);

        return edgeBuffer + index * step;
    };

    const nodeWidth = calculateNodeWidth(totalClusterElementTypeCount);

    const handleX = getHandlePosition(clusterElementTypeIndex, totalClusterElementTypeCount, nodeWidth);

    const position = {
        x: handleX - placeholderWidth / 2,
        y: 160,
    };

    return {
        data: {
            clusterElementLabel: elementLabel,
            clusterElementType: elementType,
            label: '+',
        },
        id: nodeId,
        parentId: clusterRootId,
        position: position || nodePositions[elementType] || DEFAULT_NODE_POSITION,
        type: 'placeholder',
    };
}

export function createSingleElementsNode(
    clusterElementData: ClusterElementItemType,
    clusterRootId: string,
    elementLabel: string,
    elementType: string,
    nodePositions: Record<string, {x: number; y: number}> = {}
): Node {
    const {label, metadata, name, parameters, type} = clusterElementData;
    const typeSegments = type.split('/');
    const nodePosition = metadata?.ui?.nodePosition || DEFAULT_NODE_POSITION;

    const enhancedMetadata = {
        ...(metadata || {}),
        ui: {
            ...(metadata?.ui || {}),
            nodePosition: nodePositions[name] || metadata?.ui?.nodePosition,
        },
    };

    const iconUrl = `/icons/${typeSegments[0]}.svg`;

    return {
        data: {
            ...clusterElementData,
            clusterElementLabel: elementLabel,
            clusterElementName: elementType,
            clusterElementType: elementType,
            componentName: typeSegments[0],
            icon: (
                <InlineSVG
                    className="size-9 flex-none text-gray-900"
                    loader={<ComponentIcon className="size-9 flex-none text-gray-900" />}
                    src={iconUrl as string}
                />
            ),
            label,
            metadata: enhancedMetadata || {},
            name,
            operationName: typeSegments[2],
            parameters,
            type,
            version: parseInt(typeSegments[1].replace(/^v/, '')),
            workflowNodeName: name,
        },
        id: name,
        parentId: clusterRootId,
        position: nodePositions[name] || nodePosition,
        type: 'workflow',
    };
}

export function createMultipleElementsNode(
    clusterRootId: string,
    element: ClusterElementItemType,
    elementType: string,
    isMultipleElementsNode: boolean,
    nodePositions: Record<string, {x: number; y: number}> = {}
) {
    const {label, metadata, name, parameters, type} = element;
    const typeSegments = type.split('/');
    const nodePosition = metadata?.ui?.nodePosition || DEFAULT_NODE_POSITION;

    const enhancedMetadata = {
        ...(metadata || {}),
        ui: {
            ...(metadata?.ui || {}),
            nodePosition: nodePositions[name] || metadata?.ui?.nodePosition,
        },
    };

    const iconUrl = `/icons/${typeSegments[0]}.svg`;

    return {
        data: {
            ...element,
            clusterElementName: typeSegments[2],
            clusterElementType: elementType,
            componentName: typeSegments[0],
            icon: (
                <InlineSVG
                    className="size-9 flex-none text-gray-900"
                    loader={<ComponentIcon className="size-9 flex-none text-gray-900" />}
                    src={iconUrl as string}
                />
            ),
            label,
            metadata: enhancedMetadata || {},
            multipleClusterElementsNode: isMultipleElementsNode,
            name,
            operationName: typeSegments[2],
            parameters,
            type,
            version: parseInt(typeSegments[1].replace(/^v/, '')),
            workflowNodeName: name,
        },
        id: name,
        parentId: clusterRootId,
        position: nodePositions[name] || nodePosition,
        type: 'workflow',
    };
}
