import {FINAL_PLACEHOLDER_NODE_ID, SORTED_CLUSTER_ELEMENTS_KEYS} from '@/shared/constants';
import {Edge, Node} from '@xyflow/react';
import {useEffect} from 'react';
import {useShallow} from 'zustand/react/shallow';

import useWorkflowNodeDetailsPanelStore from '../../workflow-editor/stores/useWorkflowNodeDetailsPanelStore';
import {getLayoutedElements} from '../../workflow-editor/utils/layoutUtils';
import useAiAgentDataStore from '../stores/useAiAgentDataStore';
import {
    createEdgeForClusterElementNode,
    createEdgeForFinalToolPlaceholderNode,
    createEdgeForNextToolNode,
    createEdgeForPlaceholderNode,
} from '../utils/createAiAgentEdges';
import {createClusterElementNode, createPlaceholderNode, createToolNode} from '../utils/createAiAgentNodes';

const useAiAgentLayout = () => {
    const {currentNode} = useWorkflowNodeDetailsPanelStore();

    const {setEdges, setNodes} = useAiAgentDataStore(
        useShallow((state) => ({
            setEdges: state.setEdges,
            setNodes: state.setNodes,
        }))
    );

    const allNodes: Array<Node> = [];
    const taskEdges: Array<Edge> = [];

    if (currentNode) {
        const rootAiAgentNode = {
            data: currentNode,
            id: currentNode.workflowNodeName,
            position: {x: 0, y: 0},
            type: 'workflow',
        };

        allNodes.push(rootAiAgentNode);
    }

    const finalToolPlaceholderNode = {
        data: {label: '+'},
        id: FINAL_PLACEHOLDER_NODE_ID,
        position: {x: 0, y: 0},
        type: 'placeholder',
    };

    let clusterElements = currentNode?.clusterElements;

    if (!clusterElements) {
        clusterElements = {
            rag: null,
            // eslint-disable-next-line sort-keys
            chatMemory: null,
            model: null,
            tools: [],
        };
    }

    if (clusterElements) {
        SORTED_CLUSTER_ELEMENTS_KEYS.forEach((clusterElementType) => {
            const clusterElementData = clusterElements[clusterElementType as keyof typeof clusterElements];

            if (clusterElementData === null || (Array.isArray(clusterElementData) && clusterElementData.length === 0)) {
                allNodes.push(createPlaceholderNode(currentNode, clusterElementType));
            } else if (clusterElementType === 'tools' && Array.isArray(clusterElementData)) {
                clusterElementData?.forEach((tool) => {
                    allNodes.push(createToolNode(tool));
                });
            } else if (clusterElementData && !Array.isArray(clusterElementData)) {
                allNodes.push(createClusterElementNode(clusterElementData));
            }
        });
    }

    const groupedClusterElementsTools = allNodes.filter((node) => node.data.clusterElementType === 'tools');

    if (groupedClusterElementsTools.length > 0) {
        allNodes.push(finalToolPlaceholderNode);
    }

    allNodes.forEach((node) => {
        if (node.data.componentName === 'aiAgent') {
            SORTED_CLUSTER_ELEMENTS_KEYS.forEach((clusterElementType) => {
                const clusterElementData = clusterElements[clusterElementType as keyof typeof clusterElements];
                const targetNode = allNodes.find((node) => node.data.clusterElementType === clusterElementType);

                if (
                    clusterElementData === null ||
                    (Array.isArray(clusterElementData) && clusterElementData.length === 0)
                ) {
                    taskEdges.push(createEdgeForPlaceholderNode(node, clusterElementType));
                } else if (targetNode) {
                    taskEdges.push(createEdgeForClusterElementNode(node, targetNode));
                }
            });
        }

        if (node.data.clusterElementType === 'tools') {
            const currentToolNode = groupedClusterElementsTools.findIndex((toolNode) => toolNode.id === node.id);
            const nextToolNodeId = groupedClusterElementsTools[currentToolNode + 1]?.id;

            if (nextToolNodeId) {
                taskEdges.push(createEdgeForNextToolNode(node, nextToolNodeId));
            } else {
                taskEdges.push(createEdgeForFinalToolPlaceholderNode(node, finalToolPlaceholderNode));
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasWidth, currentNode]);
};

export default useAiAgentLayout;
