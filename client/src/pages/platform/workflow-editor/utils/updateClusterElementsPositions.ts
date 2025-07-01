import {ClusterElementItemType, ClusterElementsType} from '@/shared/types';

interface UpdateElementsWithPositionsProps {
    clusterElements: ClusterElementsType;
    nodePositions: Record<string, {x: number; y: number}>;
    placeholdersByParent: Record<string, Record<string, {x: number; y: number}>>;
}

export default function updateClusterElementsPositions({
    clusterElements,
    nodePositions,
    placeholdersByParent,
}: UpdateElementsWithPositionsProps): ClusterElementsType {
    const updatedElements = {...clusterElements};

    Object.entries(updatedElements).forEach(([elementKey, elementValue]) => {
        if (Array.isArray(elementValue)) {
            updatedElements[elementKey] = elementValue.map((element) => {
                const elementNodeId = element.name;
                const elementPosition = nodePositions[elementNodeId];
                const elementPlaceholders = placeholdersByParent[elementNodeId] || {};

                const updatedElement = {
                    ...element,
                    metadata: {
                        ...element?.metadata,
                        ui: {
                            ...element?.metadata?.ui,
                            nodePosition: elementPosition || element?.metadata?.ui?.nodePosition,
                            placeholderPositions:
                                Object.keys(elementPlaceholders).length > 0
                                    ? elementPlaceholders
                                    : element?.metadata?.ui?.placeholderPositions,
                        },
                    },
                };

                if (updatedElement.clusterElements) {
                    updatedElement.clusterElements = updateClusterElementsPositions({
                        clusterElements: updatedElement.clusterElements,
                        nodePositions,
                        placeholdersByParent,
                    });
                }

                return updatedElement;
            });
        } else if (elementValue && typeof elementValue === 'object') {
            const elementNodeId = elementValue.name;
            const elementPosition = nodePositions[elementNodeId];
            const elementPlaceholders = placeholdersByParent[elementNodeId] || {};

            // Update element position and its placeholders positions
            updatedElements[elementKey] = {
                ...elementValue,
                metadata: {
                    ...elementValue?.metadata,
                    ui: {
                        ...elementValue?.metadata?.ui,
                        nodePosition: elementPosition || elementValue?.metadata?.ui?.nodePosition,
                        placeholderPositions:
                            Object.keys(elementPlaceholders).length > 0
                                ? elementPlaceholders
                                : elementValue?.metadata?.ui?.placeholderPositions,
                    },
                },
            } as ClusterElementItemType;

            const updatedElement = updatedElements[elementKey] as ClusterElementItemType;
            if (updatedElement.clusterElements) {
                updatedElement.clusterElements = updateClusterElementsPositions({
                    clusterElements: updatedElement.clusterElements,
                    nodePositions,
                    placeholdersByParent,
                });
            }
        }
    });

    return updatedElements;
}
