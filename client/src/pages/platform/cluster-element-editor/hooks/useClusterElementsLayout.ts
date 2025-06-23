import {DEFAULT_NODE_POSITION} from '@/shared/constants';
import {ComponentDefinition, ComponentDefinitionApi} from '@/shared/middleware/platform/configuration';
import {
    ComponentDefinitionKeys,
    useGetComponentDefinitionQuery,
} from '@/shared/queries/platform/componentDefinitions.queries';
import {ClusterElementItemType, ClusterElementsType, NodeDataType} from '@/shared/types';
import {useQueryClient} from '@tanstack/react-query';
import {Edge, Node} from '@xyflow/react';
import {useEffect, useMemo, useState} from 'react';
import {useShallow} from 'zustand/react/shallow';

import useWorkflowDataStore from '../../workflow-editor/stores/useWorkflowDataStore';
import useWorkflowEditorStore from '../../workflow-editor/stores/useWorkflowEditorStore';
import useWorkflowNodeDetailsPanelStore from '../../workflow-editor/stores/useWorkflowNodeDetailsPanelStore';
import {getLayoutedElements} from '../../workflow-editor/utils/layoutUtils';
import useClusterElementsDataStore from '../stores/useClusterElementsDataStore';
import {convertNameToCamelCase} from '../utils/clusterElementsUtils';
import {
    createEdgeForClusterElementNode,
    createEdgeForMultipleClusterElementNode,
    createEdgeForPlaceholderNode,
} from '../utils/createClusterElementsEdges';
import {
    createMultipleElementsNode,
    createPlaceholderNode,
    createSingleElementsNode,
} from '../utils/createClusterElementsNodes';

const useClusterElementsLayout = () => {
    const [nestedClusterRootsDefinitions, setNestedClusterRootsDefinitions] = useState<
        Record<string, ComponentDefinition>
    >({});

    const {rootClusterElementNodeData} = useWorkflowEditorStore();
    const {currentNode} = useWorkflowNodeDetailsPanelStore();
    const {workflow} = useWorkflowDataStore.getState();

    const queryClient = useQueryClient();

    const rootClusterElementComponentVersion =
        Number(rootClusterElementNodeData?.type?.split('/')[1].replace(/^v/, '')) || 1;

    const rootClusterElementComponentName = rootClusterElementNodeData?.componentName || '';

    const {data: rootClusterElementDefinition} = useGetComponentDefinitionQuery(
        {
            componentName: rootClusterElementComponentName,
            componentVersion: rootClusterElementComponentVersion,
        },
        !!rootClusterElementNodeData && currentNode?.rootClusterElement
    );

    const {nodes, setEdges, setNodes} = useClusterElementsDataStore(
        useShallow((state) => ({
            nodes: state.nodes,
            setEdges: state.setEdges,
            setNodes: state.setNodes,
        }))
    );

    const nodePositions = nodes.reduce<Record<string, {x: number; y: number}>>((accumulator, node) => {
        accumulator[node.id] = {
            x: node.position.x,
            y: node.position.y,
        };
        return accumulator;
    }, {});

    const canvasWidth = window.innerWidth - 80;

    const {allNodes, taskEdges} = useMemo(() => {
        const nodes: Array<Node> = [];
        const edges: Array<Edge> = [];

        if (!rootClusterElementNodeData || !rootClusterElementDefinition || !workflow.definition) {
            return {allNodes: nodes, taskEdges: edges};
        }

        if (rootClusterElementNodeData) {
            const rootClusterElementNode = {
                data: {...rootClusterElementNodeData},
                id: rootClusterElementNodeData.workflowNodeName,
                position:
                    rootClusterElementNodeData.metadata?.ui?.nodePosition ||
                    nodePositions[rootClusterElementNodeData.workflowNodeName] ||
                    DEFAULT_NODE_POSITION,
                type: 'workflow',
            };

            nodes.push(rootClusterElementNode);
        }

        const workflowDefinitionTasks = JSON.parse(workflow.definition).tasks;

        const currentClusterRootTask = workflowDefinitionTasks.find(
            (task: {name: string}) => task.name === rootClusterElementNodeData?.workflowNodeName
        );

        const clusterElements = currentClusterRootTask.clusterElements || {};

        const childNodes = createClusterElementNodes(
            rootClusterElementNodeData.workflowNodeName,
            rootClusterElementDefinition,
            clusterElements,
            rootClusterElementNodeData,
            nodePositions,
            nestedClusterRootsDefinitions
        );
        nodes.push(...childNodes);

        const childEdges = createClusterElementEdges(
            nodes,
            rootClusterElementNodeData.workflowNodeName,
            rootClusterElementDefinition,
            nestedClusterRootsDefinitions
        );
        edges.push(...childEdges);

        return {allNodes: nodes, taskEdges: edges};

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nestedClusterRootsDefinitions, rootClusterElementNodeData, rootClusterElementDefinition, workflow]);

    useEffect(() => {
        if (!rootClusterElementNodeData || !rootClusterElementDefinition || !workflow.definition) {
            return;
        }

        const workflowDefinitionTasks = JSON.parse(workflow.definition).tasks;
        const currentClusterRootTask = workflowDefinitionTasks.find(
            (task: {name: string}) => task.name === rootClusterElementNodeData?.workflowNodeName
        );
        const clusterElements = currentClusterRootTask.clusterElements || {};

        const clusterRoots: {componentName: string; componentVersion: number}[] = [];

        const findClusterRoots = (elements: ClusterElementsType) => {
            Object.entries(elements).forEach(([, value]) => {
                if (Array.isArray(value)) {
                    (value as ClusterElementItemType[]).forEach((item) => {
                        if (item.clusterElements) {
                            // This is a nested root
                            clusterRoots.push({
                                componentName: item.type.split('/')[0],
                                componentVersion: Number(item.type?.split('/')[1]?.replace(/^v/, '')) || 1,
                            });

                            // Check if this root has further nested roots
                            findClusterRoots(item.clusterElements);
                        }
                    });
                } else if (value && typeof value === 'object') {
                    const typedValue = value as ClusterElementItemType;

                    if (typedValue.clusterElements) {
                        // This is a nested root
                        clusterRoots.push({
                            componentName: typedValue.type.split('/')[0],
                            componentVersion: Number(typedValue.type?.split('/')[1]?.replace(/^v/, '')) || 1,
                        });

                        // Check if this root has further nested roots
                        findClusterRoots(typedValue.clusterElements);
                    }
                }
            });
        };

        findClusterRoots(clusterElements);

        // Now fetch definitions for all nested roots
        const fetchDefinitions = async () => {
            const definitions: Record<string, ComponentDefinition> = {};

            await Promise.all(
                clusterRoots.map(async (root) => {
                    const definition = await queryClient.fetchQuery({
                        queryFn: () =>
                            new ComponentDefinitionApi().getComponentDefinition({
                                componentName: root.componentName,
                                componentVersion: root.componentVersion,
                            }),
                        queryKey: ComponentDefinitionKeys.componentDefinition({
                            componentName: root.componentName,
                            componentVersion: root.componentVersion,
                        }),
                    });

                    definitions[root.componentName] = definition;
                })
            );

            setNestedClusterRootsDefinitions(definitions);
        };

        fetchDefinitions();
    }, [rootClusterElementNodeData, rootClusterElementDefinition, workflow, queryClient]);

    useEffect(() => {
        const layoutNodes = allNodes;
        const edges: Edge[] = taskEdges;

        const elements = getLayoutedElements({canvasWidth, edges, isClusterElementsCanvas: true, nodes: layoutNodes});

        setNodes(elements.nodes);
        setEdges(elements.edges);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasWidth, rootClusterElementNodeData, allNodes]);
};

export default useClusterElementsLayout;

const createClusterElementNodes = (
    clusterRootId: string,
    clusterRootComponentDefinition: ComponentDefinition,
    clusterElements: ClusterElementsType,
    clusterRootNodeData: NodeDataType | null,
    currentNodePositions: Record<string, {x: number; y: number}> = {},
    nestedClusterRootsDefinitions: Record<string, ComponentDefinition> = {}
) => {
    if (!clusterRootComponentDefinition?.clusterElementTypes || !clusterElements) return [];

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
                        element,
                        elementType,
                        isMultipleElementsNode,
                        currentNodePositions
                    );

                    // Set parent relationship
                    elementNode.data.parentClusterRootId = clusterRootId;

                    createdNodes.push(elementNode);

                    // Check if this element is also a nested root
                    if (element.clusterElements) {
                        elementNode.data.nestedClusterRoot = true;

                        const componentName = element.type?.split('/')[0];
                        const nestedDefinition = nestedClusterRootsDefinitions[componentName];

                        if (nestedDefinition) {
                            const childNodes = createClusterElementNodes(
                                element.name,
                                nestedDefinition,
                                element.clusterElements,
                                element,
                                currentNodePositions,
                                nestedClusterRootsDefinitions
                            );
                            createdNodes.push(...childNodes);
                        }
                    }
                });
            }

            const placeholderNode = createPlaceholderNode(
                clusterRootId,
                elementLabel,
                elementType,
                placeholderPositions,
                currentNodePositions
            );
            createdNodes.push(placeholderNode);
        } else {
            if (clusterElementData) {
                // Create the node
                const elementNode = createSingleElementsNode(
                    clusterElementData,
                    elementLabel,
                    elementType,
                    currentNodePositions
                );

                // Set parent relationship
                elementNode.data.parentClusterRootId = clusterRootId;

                createdNodes.push(elementNode);

                // Check if this element is also a nested root
                if (clusterElementData.clusterElements) {
                    elementNode.data.nestedClusterRoot = true;

                    const componentName = clusterElementData.type?.split('/')[0];
                    const nestedDefinition = nestedClusterRootsDefinitions[componentName];

                    if (nestedDefinition) {
                        // Process its children recursively
                        const childNodes = createClusterElementNodes(
                            clusterElementData.name,
                            nestedDefinition,
                            clusterElementData.clusterElements,
                            clusterElementData,
                            currentNodePositions,
                            nestedClusterRootsDefinitions
                        );

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
};

const createClusterElementEdges = (
    nodes: Node[],
    clusterRootId: string,
    clusterRootComponentDefinition: ComponentDefinition,
    nestedClusterRootsDefinitions: Record<string, ComponentDefinition> = {}
): Edge[] => {
    const edges: Edge[] = [];

    if (!clusterRootComponentDefinition?.clusterElementTypes) return edges;

    // Find the direct children of this parent node
    const childNodes = nodes.filter(
        (node) =>
            (node.id !== clusterRootId && node.id.split('-')[0] === clusterRootId) ||
            node.data.parentClusterRootId === clusterRootId
    );

    // Get all multiple element nodes that are children of this parent
    const multipleElementNodes = childNodes.filter(
        (node) => node.data.multipleClusterElementsNode && node.type === 'workflow'
    );

    // Process each element type in the definition
    clusterRootComponentDefinition.clusterElementTypes.forEach((clusterElementType) => {
        const elementType = convertNameToCamelCase(clusterElementType.name || '');
        const isMultipleElementsNode = clusterElementType.multipleElements;

        const targetNodes = childNodes.filter((node) => node.data.clusterElementType === elementType);

        // Create edges
        if (isMultipleElementsNode) {
            const placeholderNode = targetNodes.find(
                (node) => node.type === 'placeholder' && node.data.clusterElementType === elementType
            );
            if (placeholderNode) {
                edges.push(createEdgeForPlaceholderNode(clusterRootId, elementType));
            }

            const relevantMultipleNodes = multipleElementNodes.filter(
                (node) => node.data.clusterElementType === elementType
            );

            relevantMultipleNodes.forEach((node) => {
                edges.push(createEdgeForMultipleClusterElementNode(clusterRootId, node));

                // for nested roots
                if (node.data.nestedClusterRoot) {
                    const componentName = (node.data.type as string)?.split('/')[0];
                    const nestedDefinition = nestedClusterRootsDefinitions[componentName];

                    if (nestedDefinition && node.data.clusterElements) {
                        const nestedEdges = createClusterElementEdges(
                            nodes,
                            node.id,
                            nestedDefinition,
                            nestedClusterRootsDefinitions
                        );

                        edges.push(...nestedEdges);
                    }
                }
            });
        } else {
            const placeholderNode = targetNodes.find(
                (node) => node.type === 'placeholder' && node.data.clusterElementType === elementType
            );

            if (placeholderNode) {
                edges.push(createEdgeForPlaceholderNode(clusterRootId, elementType));
            } else {
                const singleNode = targetNodes.find((node) => !node.data.placeholder);

                if (singleNode) {
                    edges.push(createEdgeForClusterElementNode(clusterRootId, singleNode));

                    // for nested roots
                    if (singleNode.data.nestedClusterRoot) {
                        const componentName = (singleNode.data.type as string)?.split('/')[0];
                        const nestedDefinition = nestedClusterRootsDefinitions[componentName];

                        if (nestedDefinition && singleNode.data.clusterElements) {
                            const nestedEdges = createClusterElementEdges(
                                nodes,
                                singleNode.id,
                                nestedDefinition,
                                nestedClusterRootsDefinitions
                            );

                            edges.push(...nestedEdges);
                        }
                    }
                }
            }
        }
    });

    return edges;
};
