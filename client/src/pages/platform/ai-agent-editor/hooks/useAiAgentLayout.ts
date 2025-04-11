import {useShallow} from 'zustand/react/shallow';
import {Edge, Node} from '@xyflow/react';

import useWorkflowNodeDetailsPanelStore from '../../workflow-editor/stores/useWorkflowNodeDetailsPanelStore';
import useAiAgentDataStore from '../stores/useAiAgentDataStore';
import {useEffect} from 'react';
import {getLayoutedElements} from '../../workflow-editor/utils/layoutUtils';
import {NodeDataType} from '@/shared/types';
import {EDGE_STYLES} from '@/shared/constants';

const useAiAgentLayout = () => {
    const {currentNode} = useWorkflowNodeDetailsPanelStore();

    const {setEdges, setNodes} = useAiAgentDataStore(
        useShallow((state) => ({
            setEdges: state.setEdges,
            setNodes: state.setNodes,
        }))
    );

    const rootAiAgentNode = {
        data: currentNode,
        id: currentNode?.workflowNodeName,
        position: {x: 0, y: 0},
        type: 'workflow',
    };

    const allNodes: Array<Node> = [rootAiAgentNode];

    const clusterElements = currentNode?.clusterElements;

    //create initial placeholder nodes
    // const ragPlaceholderNode = {
    //     data: {
    //         label: '+',
    //     },
    //     id: `${currentNode?.workflowNodeName}-rag-placeholder-0`,
    //     position: {x: 0, y: 0},
    //     type: 'placeholder',
    // };

    // const chatMemoryPlaceholderNode = {
    //     data: {
    //         label: '+',
    //     },
    //     id: `${currentNode?.workflowNodeName}-chatMemory-placeholder-0`,
    //     position: {x: 0, y: 0},
    //     type: 'placeholder',
    // };

    // const modelPlaceholderNode = {
    //     data: {
    //         label: '+',
    //     },
    //     id: `${currentNode?.workflowNodeName}-model-placeholder-0`,
    //     position: {x: 0, y: 0},
    //     type: 'placeholder',
    // };

    // const toolsPlaceholderNode = {
    //     data: {
    //         label: '+',
    //     },
    //     id: `${currentNode?.workflowNodeName}-tools-placeholder-0`,
    //     position: {x: 0, y: 0},
    //     type: 'placeholder',
    // };

    // if (!clusterElements?.rag) {
    //     allNodes.push(ragPlaceholderNode);
    // }
    // if (!clusterElements?.chatMemory) {
    //     allNodes.push(chatMemoryPlaceholderNode);
    // }
    // if (!clusterElements?.model) {
    //     allNodes.push(modelPlaceholderNode);
    // }
    // if (!clusterElements || clusterElements?.tools?.length === 0) {
    //     allNodes.push(toolsPlaceholderNode);
    // }

    // Create placeholder nodes dynamically
    const createPlaceholderNode = (type: string) => ({
        data: {label: '+'},
        id: `${currentNode?.workflowNodeName}-${type}-placeholder-0`,
        position: {x: 0, y: 0},
        type: 'placeholder',
    });

    // Define the placeholder conditions
    const createPlaceholders = [
        {
            shouldCreatePlaceholder: (elements) => !elements?.rag,
            type: 'rag',
        },
        {
            shouldCreatePlaceholder: (elements) => !elements?.chatMemory,
            type: 'chatMemory',
        },
        {
            shouldCreatePlaceholder: (elements) => !elements?.model,
            type: 'model',
        },
        {
            shouldCreatePlaceholder: (elements) => !elements || elements?.tools?.length === 0,
            type: 'tools',
        },
    ];

    // Add placeholder nodes based on condition
    createPlaceholders.forEach(({shouldCreatePlaceholder, type}) => {
        if (shouldCreatePlaceholder(clusterElements)) {
            allNodes.push(createPlaceholderNode(type));
        }
    });

    if (clusterElements) {
        Object.entries(clusterElements).forEach((clusterElement) => {
            const clusterElementType = clusterElement[0];
            const clusterElementData = clusterElement[1];

            if (clusterElementType === 'tools' && Array.isArray(clusterElementData)) {
                clusterElementData?.forEach((tool) => {
                    const {label, name, parameters, type} = tool;

                    const toolsNodes = {
                        data: {
                            ...tool,
                            clusterElementType: 'tools',
                            label,
                            name,
                            parameters,
                            type,
                        },
                        id: name,
                        position: {x: 0, y: 0},
                        type: 'workflow',
                    };

                    allNodes.push(toolsNodes);
                });
            } else if (clusterElementData && !Array.isArray(clusterElementData)) {
                const {label, name, parameters, type} = clusterElementData;

                const otherNodes = {
                    data: {
                        ...clusterElementData,
                        clusterElementType: type.split('/')[2],
                        label,
                        name,
                        parameters,
                        type,
                    },
                    id: name,
                    position: {x: 0, y: 0},
                    type: 'workflow',
                };

                allNodes.push(otherNodes);
            }
        });
    }

    const clusterElementsTools = allNodes.filter((node) => node.data.clusterElementType === 'tools');

    const finalToolPlaceholderNode = {
        data: {label: '+'},
        id: `final-tools-placeholder`,
        position: {x: 0, y: 0},
        type: 'placeholder',
    };

    if (clusterElementsTools.length > 0) {
        allNodes.push(finalToolPlaceholderNode);
    }

    console.log('cluster elements tools', clusterElementsTools);

    const taskEdges: Array<Edge> = [];

    allNodes.forEach((node, index) => {
        // const nodeData: NodeDataType = node.data as NodeDataType;

        // console.log('node', node);

        //create initial edges from ai agent
        if (index === 0) {
            const edgeFromAiAgent = {
                source: node.id,
                style: EDGE_STYLES,
                type: 'smoothstep',
            };

            // const edgeFromAiAgentToRag: Edge = {
            //     ...edgeFromAiAgent,
            //     id: `${node.id}=>${node.id}-rag-placeholder-0`,
            //     target: `${node.id}-rag-placeholder-0`,
            // };

            // const edgeFromAiAgentToChatMemory: Edge = {
            //     ...edgeFromAiAgent,
            //     id: `${node.id}=>${node.id}-chatMemory-placeholder-0`,
            //     target: `${node.id}-chatMemory-placeholder-0`,
            // };

            // const edgeFromAiAgentToModel: Edge = {
            //     ...edgeFromAiAgent,
            //     id: `${node.id}=>${node.id}-model-placeholder-0`,
            //     target: `${node.id}-model-placeholder-0`,
            // };

            // const edgeFromAiAgentToTools: Edge = {
            //     ...edgeFromAiAgent,
            //     id: `${node.id}=>${node.id}-tools-placeholder-0`,
            //     target: `${node.id}-tools-placeholder-0`,
            // };

            // const edgeFromAiAgentToRagNode: Edge = {
            //     ...edgeFromAiAgent,
            //     id: `${node.id}=>${node.id}-rag`,
            //     target: existingRagNode?.id,
            // };

            // const edgeFromAiAgentToChatMemoryNode: Edge = {
            //     ...edgeFromAiAgent,
            //     id: `${node.id}=>${node.id}-chatMemory`,
            //     target: existingChatMemoryNode?.id,
            // };

            // const edgeFromAiAgentToModelNode: Edge = {
            //     ...edgeFromAiAgent,
            //     id: `${node.id}=>${node.id}-model`,
            //     target: existingModelNode?.id,
            // };

            // const edgeFromAiAgentToToolsNode: Edge = {
            //     ...edgeFromAiAgent,
            //     id: `${node.id}=>${node.id}-tools`,
            //     target: existingToolsNode?.id,
            // };

            const createPlaceholderEdges = (type: string) => ({
                ...edgeFromAiAgent,
                id: `${node.id}=>${node.id}-${type}-placeholder-0`,
                target: `${node.id}-${type}-placeholder-0`,
            });

            // const createPlaceholderEdgesConditions = [
            //     {
            //         shouldCreatePLaceholderEdge: (elements) => !elements?.rag,
            //         type: 'rag',
            //     },
            //     {
            //         shouldCreatePLaceholderEdge: (elements) => !elements?.chatMemory,
            //         type: 'chatMemory',
            //     },
            //     {
            //         shouldCreatePLaceholderEdge: (elements) => !elements?.model,
            //         type: 'model',
            //     },
            //     {
            //         shouldCreatePLaceholderEdge: (elements) => !elements || elements?.tools?.length === 0,
            //         type: 'tools',
            //     },
            // ];

            // Add placeholder nodes based on the configuration
            createPlaceholders.forEach(({shouldCreatePlaceholder, type}) => {
                if (shouldCreatePlaceholder(clusterElements)) {
                    taskEdges.push(createPlaceholderEdges(type));
                } else {
                    const existingNode = allNodes.find((node) => node.data.clusterElementType === type);
                    // console.log('existing node', existingNode);

                    if (existingNode && existingNode.data.clusterElementType !== 'tools') {
                        taskEdges.push({
                            ...edgeFromAiAgent,
                            id: `${node.id}=>${node.id}-${type}`,
                            target: existingNode.id,
                        });
                    }

                    if (existingNode && existingNode.data.clusterElementType === 'tools') {
                        taskEdges.push({
                            ...edgeFromAiAgent,
                            id: `${node.id}=>${node.id}-${type}`,
                            target: existingNode.id,
                        });
                    }
                }
            });
        }

        if (node.data.clusterElementType === 'tools') {
            // console.log('node data', node.id, index);
            // console.log('cluster elements tools', clusterElementsTools);

            const currentToolNode = clusterElementsTools.findIndex((toolNode) => toolNode.id === node.id);
            // console.log('current tool node', currentToolNode);
            const nextToolNodeId = clusterElementsTools[currentToolNode + 1]?.id;
            console.log('next tool node id', nextToolNodeId);

            if (nextToolNodeId !== undefined) {
                taskEdges.push({
                    source: node.id,
                    style: EDGE_STYLES,
                    type: 'smoothstep',
                    id: `${node.id}=>${nextToolNodeId}`,
                    target: `${nextToolNodeId}`,
                });
            } else {
                taskEdges.push({
                    source: node.id,
                    style: EDGE_STYLES,
                    type: 'smoothstep',
                    id: `${node.id}=>${finalToolPlaceholderNode.id}`,
                    target: `${finalToolPlaceholderNode.id}`,
                });
            }
        }
    });

    const canvasWidth = window.innerWidth - 120 - 460;

    useEffect(() => {
        const layoutNodes = allNodes;
        const edges: Edge[] = taskEdges;

        const elements = getLayoutedElements(layoutNodes, edges, canvasWidth);

        setNodes(elements.nodes);
        setEdges(elements.edges);
    }, [canvasWidth, clusterElements, currentNode]);
};

export default useAiAgentLayout;
