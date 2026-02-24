import useWorkflowExecutionSheetStore from '@/pages/automation/workflow-executions/stores/useWorkflowExecutionSheetStore';
import {useGetProjectWorkflowExecutionQuery} from '@/shared/queries/automation/workflowExecutions.queries';
import {useMemo} from 'react';
import {useShallow} from 'zustand/react/shallow';

const DEFAULT_CLASS_NAME = 'bg-stroke-neutral-tertiary';
const COMPLETED_CLASS_NAME = 'bg-stroke-success-secondary';
const NOT_EXECUTED_CLASS_NAME = 'bg-gray-300 opacity-50';

export default function useGhostNodeExecutionClassName(taskDispatcherId?: string): string {
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

    return useMemo(() => {
        if (!workflowExecution || !workflowExecutionSheetOpen || !taskDispatcherId) {
            return DEFAULT_CLASS_NAME;
        }

        const taskExecutions = workflowExecution.job?.taskExecutions;

        const matchingExecution = taskExecutions?.find(
            (execution) => execution.workflowTask?.name === taskDispatcherId
        );

        if (!matchingExecution) {
            return NOT_EXECUTED_CLASS_NAME;
        }

        if (matchingExecution.status === 'COMPLETED') {
            return COMPLETED_CLASS_NAME;
        }

        return DEFAULT_CLASS_NAME;
    }, [workflowExecution, workflowExecutionSheetOpen, taskDispatcherId]);
}
