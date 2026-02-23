import {Accordion} from '@/components/ui/accordion';
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from '@/components/ui/resizable';
import {ScrollArea} from '@/components/ui/scroll-area';
import useWorkflowExecutionSheetStore from '@/pages/automation/workflow-executions/stores/useWorkflowExecutionSheetStore';
import WorkflowExecutionsHeader from '@/shared/components/workflow-executions/WorkflowExecutionsHeader';
import WorkflowExecutionsTabsPanel from '@/shared/components/workflow-executions/WorkflowExecutionsTabsPanel';
import WorkflowExecutionsTaskAccordionItem from '@/shared/components/workflow-executions/WorkflowExecutionsTaskAccordionItem';
import WorkflowExecutionsTriggerAccordionItem from '@/shared/components/workflow-executions/WorkflowExecutionsTriggerAccordionItem';
import {getExpandedAccordionValues, getTasksTree} from '@/shared/components/workflow-executions/WorkflowExecutionsUtils';
import {Job, TaskExecution, TriggerExecution} from '@/shared/middleware/automation/workflow/execution';
import {TabValueType} from '@/shared/types';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useShallow} from 'zustand/shallow';

const WorkflowExecutionSheetContent = ({job, triggerExecution}: {job: Job; triggerExecution?: TriggerExecution}) => {
    const {selectedItem, setSelectedItem} = useWorkflowExecutionSheetStore(
        useShallow((state) => ({
            selectedItem: state.selectedItem,
            setSelectedItem: state.setSelectedItem,
        }))
    );

    const [activeTab, setActiveTab] = useState<TabValueType>('input');
    const [accordionValue, setAccordionValue] = useState<string>(selectedItem?.id || '');
    const [dialogOpen, setDialogOpen] = useState(false);

    const initializedRef = useRef(false);

    const tasksTree = useMemo(() => (job ? getTasksTree(job) : []), [job]);

    const expandedAccordionValues = useMemo(
        () => getExpandedAccordionValues(tasksTree, selectedItem?.id),
        [tasksTree, selectedItem?.id]
    );

    const onTaskClick = useCallback(
        (taskExecution: TaskExecution | TriggerExecution) => {
            setSelectedItem(taskExecution);
        },
        [setSelectedItem]
    );

    // Sets the initial selectedItem when the component first mounts (sheet opens with data available)
    useEffect(() => {
        if (!initializedRef.current) {
            setSelectedItem(triggerExecution || job.taskExecutions?.[0] || undefined);

            initializedRef.current = true;
        }
    }, [setSelectedItem, triggerExecution, job]);

    // Syncs the top-level accordion value and active tab whenever selectedItem changes (from accordion clicks or node clicks)
    useEffect(() => {
        if (selectedItem) {
            const topLevelTask = tasksTree.find((treeItem) =>
                expandedAccordionValues.has(treeItem.task.id || '')
            );

            setAccordionValue(topLevelTask?.task.id || selectedItem.id || '');
            setActiveTab(selectedItem.error ? 'error' : 'input');
        }
    }, [selectedItem, expandedAccordionValues, tasksTree]);

    return (
        <div className="flex size-full flex-col">
            <WorkflowExecutionsHeader job={job} triggerExecution={triggerExecution} />

            <ResizablePanelGroup orientation="horizontal">
                <ResizablePanel className="flex min-h-0 flex-col overflow-hidden" defaultSize={500}>
                    <ScrollArea className="mb-4 h-full pl-1 pr-4">
                        <Accordion
                            className="space-y-2"
                            collapsible
                            onValueChange={setAccordionValue}
                            type="single"
                            value={accordionValue}
                        >
                            {triggerExecution && (
                                <WorkflowExecutionsTriggerAccordionItem
                                    onTaskClick={onTaskClick}
                                    selectedItem={selectedItem}
                                    triggerExecution={triggerExecution}
                                />
                            )}

                            {tasksTree.map((taskTreeItem) => (
                                <WorkflowExecutionsTaskAccordionItem
                                    expandedAccordionValues={expandedAccordionValues}
                                    key={taskTreeItem.task.id}
                                    onTaskClick={onTaskClick}
                                    selectedTaskExecutionId={selectedItem?.id || ''}
                                    taskTreeItem={taskTreeItem}
                                />
                            ))}
                        </Accordion>
                    </ScrollArea>
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel className="flex min-h-0 flex-col overflow-hidden" defaultSize={500}>
                    <WorkflowExecutionsTabsPanel
                        activeTab={activeTab}
                        dialogOpen={dialogOpen}
                        job={job}
                        selectedItem={selectedItem}
                        setActiveTab={setActiveTab}
                        setDialogOpen={setDialogOpen}
                        triggerExecution={triggerExecution}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default WorkflowExecutionSheetContent;
