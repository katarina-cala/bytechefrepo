import {Workflow} from '@/shared/middleware/platform/configuration';
import {ClusterElementItemType, UpdateWorkflowMutationType} from '@/shared/types';
import {QueryClient} from '@tanstack/react-query';

import useClusterElementsDataStore from '../../cluster-element-editor/stores/useClusterElementsDataStore';
import useWorkflowEditorStore from '../stores/useWorkflowEditorStore';
import useWorkflowNodeDetailsPanelStore from '../stores/useWorkflowNodeDetailsPanelStore';
import saveWorkflowDefinition from './saveWorkflowDefinition';
import updateClusterElementsPositions from './updateClusterElementsPositions';

interface SaveClusterElementNodesPositionProps {
    invalidateWorkflowQueries: () => void;
    queryClient: QueryClient;
    updateWorkflowMutation: UpdateWorkflowMutationType;
    workflow: Workflow;
}

export default function saveClusterElementNodesPosition({
    invalidateWorkflowQueries,
    updateWorkflowMutation,
    workflow,
}: SaveClusterElementNodesPositionProps) {
    const {nodes: clusterElementNodes} = useClusterElementsDataStore.getState();
    const {rootClusterElementNodeData, setRootClusterElementNodeData} = useWorkflowEditorStore.getState();
    const {currentNode, setCurrentNode} = useWorkflowNodeDetailsPanelStore.getState();

    if (!workflow.definition || !rootClusterElementNodeData) {
        return;
    }

    const workflowDefinitionTasks = JSON.parse(workflow.definition).tasks;

    const currentClusterRootTask = workflowDefinitionTasks.find(
        (task: {name: string}) => task.name === rootClusterElementNodeData?.workflowNodeName
    );

    if (!currentClusterRootTask || !currentClusterRootTask.clusterElements) {
        return;
    }

    const clusterElements: Record<string, ClusterElementItemType | ClusterElementItemType[]> =
        currentClusterRootTask.clusterElements;

    const nodePositions = clusterElementNodes.reduce<Record<string, {x: number; y: number}>>((accumulator, node) => {
        accumulator[node.id] = {
            x: node.position.x,
            y: node.position.y,
        };

        return accumulator;
    }, {});

    const placeholdersByParent: Record<string, Record<string, {x: number; y: number}>> = {};

    Object.entries(nodePositions).forEach(([nodeId, position]) => {
        if (nodeId.includes('placeholder')) {
            const parentId = nodeId.split('-')[0];

            if (!placeholdersByParent[parentId]) {
                placeholdersByParent[parentId] = {};
            }

            placeholdersByParent[parentId][nodeId] = position;
        }
    });

    const rootPlaceholderPositions = placeholdersByParent[rootClusterElementNodeData.workflowNodeName] || {};

    const updatedClusterElements = updateClusterElementsPositions({
        clusterElements,
        nodePositions,
        placeholdersByParent,
    });

    const rootNodePosition = rootClusterElementNodeData?.workflowNodeName
        ? nodePositions[rootClusterElementNodeData.workflowNodeName]
        : undefined;

    const metadata = {
        ...currentClusterRootTask.metadata,
        ui: {
            ...currentClusterRootTask.metadata?.ui,
            nodePosition: rootNodePosition,
            placeholderPositions: rootPlaceholderPositions || {},
        },
    };

    const updatedNodeData = {
        ...currentClusterRootTask,
        clusterElements: updatedClusterElements,
        metadata,
    };

    setRootClusterElementNodeData({
        ...rootClusterElementNodeData,
        clusterElements: updatedClusterElements,
        metadata,
    } as typeof rootClusterElementNodeData);

    if (currentNode?.rootClusterElement) {
        setCurrentNode({
            ...currentNode,
            clusterElements: updatedClusterElements,
            metadata,
        });
    }

    saveWorkflowDefinition({
        invalidateWorkflowQueries,
        nodeData: updatedNodeData,
        updateWorkflowMutation,
    });
}
