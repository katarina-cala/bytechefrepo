import useWorkflowExecutionSheetStore from '@/pages/automation/workflow-executions/stores/useWorkflowExecutionSheetStore';
import {useGetProjectWorkflowExecutionQuery} from '@/shared/queries/automation/workflowExecutions.queries';
import {NodeDataType} from '@/shared/types';
import {Node} from '@xyflow/react';
import {useMemo} from 'react';
import {useShallow} from 'zustand/react/shallow';

import useWorkflowDataStore from '../stores/useWorkflowDataStore';

const DEFAULT_EDGE_CLASS_NAME = 'fill-none stroke-gray-300 stroke-2';
const NOT_EXECUTED_EDGE_CLASS_NAME = 'fill-none stroke-gray-300 stroke-2 [stroke-dasharray:5,5]';

const GHOST_NODE_TYPES = new Set([
    'taskDispatcherTopGhostNode',
    'taskDispatcherBottomGhostNode',
    'taskDispatcherLeftGhostNode',
]);

function getNodeExecutionStatus(
    node: Node | undefined,
    triggerExecutionStatus: string | undefined,
    taskExecutions: Array<{status?: string; workflowTask?: {name?: string}}> | undefined
): string | undefined {
    if (!node) {
        return undefined;
    }

    const nodeData = node.data as NodeDataType;

    if (node.type === 'readonly') {
        if (nodeData.trigger) {
            return triggerExecutionStatus;
        }

        const matchingExecution = taskExecutions?.find(
            (execution) => execution.workflowTask?.name === nodeData.workflowNodeName
        );

        return matchingExecution?.status;
    }

    if (GHOST_NODE_TYPES.has(node.type || '')) {
        const taskDispatcherId = nodeData.taskDispatcherId;

        if (taskDispatcherId) {
            const matchingExecution = taskExecutions?.find(
                (execution) => execution.workflowTask?.name === taskDispatcherId
            );

            return matchingExecution?.status;
        }

        return undefined;
    }

    return undefined;
}

export default function useEdgeExecutionClassName(edgeId: string): string {
    const nodes = useWorkflowDataStore((state) => state.nodes);

    const {workflowExecutionId, workflowExecutionSheetOpen} = useWorkflowExecutionSheetStore(
        useShallow((state) => ({
            workflowExecutionId: state.workflowExecutionId,
            workflowExecutionSheetOpen: state.workflowExecutionSheetOpen,
        }))
    );

    const {data: workflowExecution} = useGetProjectWorkflowExecutionQuery(
        {id: workflowExecutionId},
        workflowExecutionSheetOpen
    );

    const isReadOnlyWorkflow = useMemo(() => nodes.some((node) => node.type === 'readonly'), [nodes]);

    const sourceNodeId = edgeId.split('=>')[0];
    const targetNodeId = edgeId.split('=>')[1];

    const sourceNode = nodes.find((node) => node.id === sourceNodeId);
    const targetNode = nodes.find((node) => node.id === targetNodeId);

    const triggerExecutionStatus = workflowExecution?.triggerExecution?.status;
    const taskExecutions = workflowExecution?.job?.taskExecutions;

    return useMemo(() => {
        if (!isReadOnlyWorkflow || !workflowExecution || !workflowExecutionSheetOpen) {
            return DEFAULT_EDGE_CLASS_NAME;
        }

        const sourceStatus = getNodeExecutionStatus(sourceNode, triggerExecutionStatus, taskExecutions);
        const targetStatus = getNodeExecutionStatus(targetNode, triggerExecutionStatus, taskExecutions);

        if (sourceStatus === undefined || targetStatus === undefined) {
            return NOT_EXECUTED_EDGE_CLASS_NAME;
        }

        return DEFAULT_EDGE_CLASS_NAME;
    }, [
        isReadOnlyWorkflow,
        sourceNode,
        targetNode,
        triggerExecutionStatus,
        taskExecutions,
        workflowExecution,
        workflowExecutionSheetOpen,
    ]);
}
