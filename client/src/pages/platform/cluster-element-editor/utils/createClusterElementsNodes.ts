import {ComponentDefinition} from '@/shared/middleware/platform/configuration';
import {ClusterElementItemType, ClusterElementsType, NodeDataType} from '@/shared/types';
import {Node} from '@xyflow/react';

import {createMultipleElementsNode, createPlaceholderNode, createSingleElementsNode} from './clusterElementsNodesUtils';
import {convertNameToCamelCase} from './clusterElementsUtils';

interface CreateClusterElementNodesProps {
    clusterElements: ClusterElementsType;
    clusterRootComponentDefinition: ComponentDefinition;
    clusterRootId: string;
    clusterRootNodeData: ClusterElementItemType | NodeDataType | null;
    currentNodePositions?: Record<string, {x: number; y: number}>;
    nestedClusterRootsDefinitions: Record<string, ComponentDefinition>;
}

export default function createClusterElementNodes({
    clusterElements,
    clusterRootComponentDefinition,
    clusterRootId,
    clusterRootNodeData,
    currentNodePositions,
    nestedClusterRootsDefinitions,
}: CreateClusterElementNodesProps) {
    if (!clusterRootComponentDefinition?.clusterElementTypes || !clusterElements) {
        return [];
    }

    const createdNodes: Node[] = [];

    clusterRootComponentDefinition.clusterElementTypes.forEach((clusterElementType) => {
        const elementType = convertNameToCamelCase(clusterElementType.name || '');
        const elementLabel = clusterElementType.label || '';
        const isMultipleElementsNode = clusterElementType.multipleElements;
        const clusterElementData = clusterElements[elementType];
        const placeholderPositions = clusterRootNodeData?.metadata?.ui?.placeholderPositions || {};

        if (isMultipleElementsNode) {
            if (Array.isArray(clusterElementData) && clusterElementData.length) {
                clusterElementData.forEach((element) => {
                    // Create the node
                    const elementNode = createMultipleElementsNode(
                        clusterRootId,
                        element,
                        elementType,
                        isMultipleElementsNode,
                        currentNodePositions
                    );

                    // Set root parent id
                    elementNode.data.parentClusterRootId = clusterRootId;

                    createdNodes.push(elementNode);

                    // Check if this element is also a nested root
                    if (element.clusterElements) {
                        const componentName = element.type?.split('/')[0];
                        const nestedDefinition = nestedClusterRootsDefinitions[componentName];

                        if (nestedDefinition) {
                            const childNodes = createClusterElementNodes({
                                clusterElements: element.clusterElements,
                                clusterRootComponentDefinition: nestedDefinition,
                                clusterRootId: element.name,
                                clusterRootNodeData: element,
                                currentNodePositions,
                                nestedClusterRootsDefinitions,
                            });
                            createdNodes.push(...childNodes);
                        }
                    }
                });
            }

            const placeholderNode = createPlaceholderNode(
                clusterRootId,
                elementLabel,
                elementType,
                currentNodePositions,
                placeholderPositions
            );
            createdNodes.push(placeholderNode);
        } else {
            if (clusterElementData && !Array.isArray(clusterElementData)) {
                // Create the node
                const elementNode = createSingleElementsNode(
                    clusterElementData,
                    clusterRootId,
                    elementLabel,
                    elementType,
                    currentNodePositions
                );

                // Set root parent id
                elementNode.data.parentClusterRootId = clusterRootId;

                createdNodes.push(elementNode);

                // Check if this element is also a nested root
                if (clusterElementData.clusterElements) {
                    const componentName = clusterElementData.type?.split('/')[0];
                    const nestedDefinition = nestedClusterRootsDefinitions[componentName];

                    if (nestedDefinition) {
                        // Process its children recursively
                        const childNodes = createClusterElementNodes({
                            clusterElements: clusterElementData.clusterElements,
                            clusterRootComponentDefinition: nestedDefinition,
                            clusterRootId: clusterElementData.name,
                            clusterRootNodeData: clusterElementData,
                            currentNodePositions,
                            nestedClusterRootsDefinitions,
                        });

                        createdNodes.push(...childNodes);
                    }
                }
            } else {
                const placeholderNode = createPlaceholderNode(
                    clusterRootId,
                    elementLabel,
                    elementType,
                    currentNodePositions,
                    placeholderPositions
                );

                createdNodes.push(placeholderNode);
            }
        }
    });

    return createdNodes;
}
