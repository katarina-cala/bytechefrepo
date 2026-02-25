import useWorkflowExecutionSheetStore from '@/pages/automation/workflow-executions/stores/useWorkflowExecutionSheetStore';
import {useGetProjectWorkflowExecutionQuery} from '@/shared/queries/automation/workflowExecutions.queries';
import {NodeDataType} from '@/shared/types';
import {Node} from '@xyflow/react';
import {useMemo} from 'react';
import {useShallow} from 'zustand/react/shallow';

import useWorkflowDataStore from '../stores/useWorkflowDataStore';

const DEFAULT_EDGE_CLASS_NAME = 'fill-none stroke-gray-300 stroke-2';
const NOT_EXECUTED_EDGE_CLASS_NAME = 'fill-none stroke-gray-300 stroke-2 [stroke-dasharray:5,5]';

function getNodeExecutionStatus(
    node: Node | undefined,
    triggerExecutionStatus: string | undefined,
    taskExecutions: Array<{status?: string; workflowTask?: {name?: string}}> | undefined
): string | undefined {
    if (!node) {
        return undefined;
    }

    const nodeData = node.data as NodeDataType;

    if (nodeData.trigger) {
        return triggerExecutionStatus;
    }

    const matchingExecution = taskExecutions?.find(
        (execution) => execution.workflowTask?.name === nodeData.workflowNodeName
    );

    return matchingExecution?.status;
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

    const sourceNodeId = edgeId.split('=>')[0];
    const targetNodeId = edgeId.split('=>')[1];

    const sourceNode = nodes.find((node) => node.id === sourceNodeId);
    const targetNode = nodes.find((node) => node.id === targetNodeId);

    const triggerExecutionStatus = workflowExecution?.triggerExecution?.status;
    const taskExecutions = workflowExecution?.job?.taskExecutions;

    return useMemo(() => {
        if (!workflowExecution || !workflowExecutionSheetOpen) {
            return DEFAULT_EDGE_CLASS_NAME;
        }

        const isSourceReadOnly = sourceNode?.type === 'readonly';
        const isTargetReadOnly = targetNode?.type === 'readonly';

        if (!isSourceReadOnly && !isTargetReadOnly) {
            return DEFAULT_EDGE_CLASS_NAME;
        }

        const readOnlyStatuses: (string | undefined)[] = [];

        if (isSourceReadOnly) {
            readOnlyStatuses.push(getNodeExecutionStatus(sourceNode, triggerExecutionStatus, taskExecutions));
        }

        if (isTargetReadOnly) {
            readOnlyStatuses.push(getNodeExecutionStatus(targetNode, triggerExecutionStatus, taskExecutions));
        }

        const anyNotExecuted = readOnlyStatuses.some((status) => !status);

        if (anyNotExecuted) {
            return NOT_EXECUTED_EDGE_CLASS_NAME;
        }

        return DEFAULT_EDGE_CLASS_NAME;
    }, [sourceNode, targetNode, triggerExecutionStatus, taskExecutions, workflowExecution, workflowExecutionSheetOpen]);
}
