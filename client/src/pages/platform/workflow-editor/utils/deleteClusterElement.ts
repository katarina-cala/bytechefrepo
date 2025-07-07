import {ClusterElementsType} from '@/shared/types';

interface DeleteClusterElementProps {
    elements: ClusterElementsType;
    elementFound: boolean;
}

export default function deleteClusterElement(
    clusterElements: ClusterElementsType,
    clickedElementName: string,
    clickedElementType?: string
): DeleteClusterElementProps {
    const result = {elementFound: false, elements: {...clusterElements}};

    Object.entries(result.elements).forEach(([elementType, elementValue]) => {
        if (result.elementFound) {
            return;
        }

        if (Array.isArray(elementValue)) {
            const elementIndex = elementValue.findIndex(
                (element) =>
                    element.name === clickedElementName && (!clickedElementType || elementType === clickedElementType)
            );

            // First level elements (multiple element cluster element deletion)
            if (elementIndex >= 0) {
                result.elements[elementType] = elementValue.filter((element) => element.name !== clickedElementName);
                result.elementFound = true;
                return;
            }

            // Nested elements (recursion when multiple element cluster element is also a cluster root)
            result.elements[elementType] = elementValue.map((element) => {
                if (!element.clusterElements) {
                    return element;
                }

                const nestedResult = deleteClusterElement(
                    element.clusterElements,
                    clickedElementName,
                    clickedElementType
                );

                if (nestedResult.elementFound) {
                    result.elementFound = true;
                    return {
                        ...element,
                        clusterElements: nestedResult.elements,
                    };
                }

                return element;
            });
        } else if (elementValue && typeof elementValue === 'object') {
            // Single element deletion
            if (
                elementValue.name === clickedElementName &&
                (!clickedElementType || elementType === clickedElementType)
            ) {
                result.elements[elementType] = null;
                result.elementFound = true;
                return;
            }

            // Nested elements in a single element
            if (!result.elementFound && elementValue.clusterElements) {
                const nestedResult = deleteClusterElement(
                    elementValue.clusterElements,
                    clickedElementName,
                    clickedElementType
                );

                if (nestedResult.elementFound) {
                    result.elementFound = true;
                    result.elements[elementType] = {
                        ...elementValue,
                        clusterElements: nestedResult.elements,
                    };
                }
            }
        }
    });

    return result;
}
