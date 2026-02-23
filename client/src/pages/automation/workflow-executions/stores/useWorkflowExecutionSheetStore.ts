/* eslint-disable sort-keys */
import {TaskExecution, TriggerExecution} from '@/shared/middleware/automation/workflow/execution';
import {create} from 'zustand';

interface WorkflowExecutionSheetStateI {
    selectedItem: TaskExecution | TriggerExecution | undefined;
    setSelectedItem: (selectedItem: TaskExecution | TriggerExecution | undefined) => void;

    workflowExecutionSheetOpen: boolean;
    setWorkflowExecutionSheetOpen: (workflowExecutionDetailsSheetOpen: boolean) => void;

    workflowExecutionId: number;
    setWorkflowExecutionId: (workflowExecutionId: number) => void;
}

export const useWorkflowExecutionSheetStore = create<WorkflowExecutionSheetStateI>()((set) => ({
    selectedItem: undefined,
    setSelectedItem: (selectedItem: TaskExecution | TriggerExecution | undefined) =>
        set((state) => ({
            ...state,
            selectedItem: selectedItem,
        })),

    workflowExecutionId: 0,
    setWorkflowExecutionId: (workflowExecutionId) =>
        set((state) => ({
            ...state,
            workflowExecutionId: workflowExecutionId,
        })),

    workflowExecutionSheetOpen: false,
    setWorkflowExecutionSheetOpen: (workflowExecutionSheetOpen) =>
        set((state) => ({
            ...state,
            workflowExecutionSheetOpen: workflowExecutionSheetOpen,
        })),
}));

export default useWorkflowExecutionSheetStore;
