import {Accordion} from '@/components/ui/accordion';
import {ScrollArea} from '@/components/ui/scroll-area';
import WorkflowExecutionsHeader from '@/shared/components/workflow-executions/WorkflowExecutionsHeader';
import {getTasksTree, handleTaskClick} from '@/shared/components/workflow-executions/WorkflowExecutionsUtils';
import {Job, TaskExecution, TriggerExecution} from '@/shared/middleware/automation/workflow/execution';
import {useCallback, useMemo, useState} from 'react';

import WorkflowExecutionsTabsPanel from './WorkflowExecutionsTabsPanel';
import WorkflowExecutionsTaskAccordionItem from './WorkflowExecutionsTaskAccordionItem';
import WorkflowExecutionsTriggerAccordionItem from './WorkflowExecutionsTriggerAccordionItem';

const WorkflowExecutionSheetAccordion = ({job, triggerExecution}: {job: Job; triggerExecution?: TriggerExecution}) => {
    const [activeTab, setActiveTab] = useState<'input' | 'output' | 'error'>('input');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TaskExecution | TriggerExecution | undefined>(
        triggerExecution || job.taskExecutions?.[0] || undefined
    );

    const tasksTree = useMemo(() => getTasksTree(job), [job]);

    const onTaskClick = useCallback(
        (taskExecution: TaskExecution | TriggerExecution) => {
            handleTaskClick({setActiveTab, setSelectedItem, taskExecution});
        },
        [setActiveTab, setSelectedItem]
    );

    const isTriggerExecution = selectedItem?.id === triggerExecution?.id;

    return (
        <div className="flex size-full flex-col">
            <WorkflowExecutionsHeader job={job} triggerExecution={triggerExecution} />

            <div className="grid min-h-0 w-full max-w-full flex-1 grid-cols-2 gap-1 px-2">
                <div className="flex min-h-0 flex-col overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                        <Accordion
                            className="space-y-2"
                            collapsible
                            defaultValue={isTriggerExecution ? triggerExecution?.id || '' : selectedItem?.id || ''}
                            type="single"
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
                                    key={taskTreeItem.task.id}
                                    onTaskClick={onTaskClick}
                                    selectedTaskExecutionId={selectedItem?.id || ''}
                                    taskTreeItem={taskTreeItem}
                                />
                            ))}
                        </Accordion>
                    </ScrollArea>
                </div>

                <div className="flex min-h-0 flex-col rounded-md border border-border/50 p-3">
                    <WorkflowExecutionsTabsPanel
                        activeTab={activeTab}
                        dialogOpen={dialogOpen}
                        job={job}
                        selectedItem={selectedItem}
                        setActiveTab={setActiveTab}
                        setDialogOpen={setDialogOpen}
                        triggerExecution={triggerExecution}
                    />
                </div>
            </div>
        </div>
    );
};

export default WorkflowExecutionSheetAccordion;
