import {ClusterElementItemType, ClusterElementsType} from '@/shared/types';

import updateClusterElementsPositions from './updateClusterElementsPositions';

interface ProcessClusterElementsHierarchyProps {
    clusterElementData?: ClusterElementItemType;
    clusterElements: ClusterElementsType;
    elementType?: string;
    isMultipleElements?: boolean;
    mainRootId?: string;
    nodePositions: Record<string, {x: number; y: number}>;
    sourceNodeId?: string;
}

export default function processClusterElementsHierarchy({
    clusterElementData,
    clusterElements,
    elementType,
    isMultipleElements,
    mainRootId,
    nodePositions,
    sourceNodeId,
}: ProcessClusterElementsHierarchyProps): {parentFound: boolean; nestedClusterElements: ClusterElementsType} {
    let updatedClusterElements = {...clusterElements};
    let parentFound = false;

    if (sourceNodeId && clusterElementData && elementType !== undefined) {
        if (mainRootId && sourceNodeId === mainRootId) {
            if (isMultipleElements) {
                updatedClusterElements[elementType] = [
                    ...(Array.isArray(updatedClusterElements[elementType]) ? updatedClusterElements[elementType] : []),
                    clusterElementData,
                ];
            } else {
                updatedClusterElements[elementType] = clusterElementData;
            }

            parentFound = true;
        } else {
            Object.values(updatedClusterElements).forEach((value) => {
                if (parentFound) {
                    return;
                }

                if (Array.isArray(value)) {
                    value.forEach((element) => {
                        if (parentFound) {
                            return;
                        }

                        // Check if this is the parent we're looking for
                        if (element.name === sourceNodeId) {
                            if (!element.clusterElements) {
                                element.clusterElements = {};
                            }

                            // Add element to this parent
                            if (isMultipleElements) {
                                element.clusterElements[elementType] = [
                                    ...(Array.isArray(element.clusterElements[elementType])
                                        ? element.clusterElements[elementType]
                                        : []),
                                    clusterElementData,
                                ];
                            } else {
                                element.clusterElements[elementType] = clusterElementData;
                            }

                            parentFound = true;

                            return;
                        }

                        if (element.clusterElements) {
                            const result = processClusterElementsHierarchy({
                                clusterElementData,
                                clusterElements: element.clusterElements,
                                elementType,
                                isMultipleElements,
                                nodePositions,
                                sourceNodeId,
                            });

                            if (result.parentFound) {
                                element.clusterElements = result.nestedClusterElements;
                                parentFound = true;

                                return;
                            }
                        }
                    });
                } else if (value && typeof value === 'object') {
                    // Check if this is the parent we're looking for
                    if (value.name === sourceNodeId) {
                        if (!value.clusterElements) {
                            value.clusterElements = {};
                        }

                        // Add element to this parent
                        if (isMultipleElements) {
                            value.clusterElements[elementType] = [
                                ...(Array.isArray(value.clusterElements[elementType])
                                    ? value.clusterElements[elementType]
                                    : []),
                                clusterElementData,
                            ];
                        } else {
                            value.clusterElements[elementType] = clusterElementData;
                        }

                        parentFound = true;

                        return;
                    }

                    if (value.clusterElements) {
                        const result = processClusterElementsHierarchy({
                            clusterElementData,
                            clusterElements: value.clusterElements,
                            elementType,
                            isMultipleElements,
                            nodePositions,
                            sourceNodeId,
                        });

                        if (result.parentFound) {
                            value.clusterElements = result.nestedClusterElements;
                            parentFound = true;

                            return;
                        }
                    }
                }
            });
        }
    }

    updatedClusterElements = updateClusterElementsPositions({
        clusterElements: updatedClusterElements,
        nodePositions,
    });

    return {nestedClusterElements: updatedClusterElements, parentFound};
}
