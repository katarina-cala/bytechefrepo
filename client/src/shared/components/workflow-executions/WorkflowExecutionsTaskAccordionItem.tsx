import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {TaskTreeItemProps} from '@/shared/components/workflow-executions/WorkflowExecutionsUtils';
import WorkflowTaskExecutionItem from '@/shared/components/workflow-executions/WorkflowTaskExecutionItem';
import {TaskExecution} from '@/shared/middleware/automation/workflow/execution';
import {useEffect, useState} from 'react';
import {twMerge} from 'tailwind-merge';

const WorkflowExecutionsTaskAccordionItem = ({
    expandedAccordionValues,
    nestedItem,
    onTaskClick,
    selectedTaskExecutionId,
    taskTreeItem,
}: {
    expandedAccordionValues?: Set<string>;
    nestedItem?: boolean;
    onTaskClick: (taskExecution: TaskExecution) => void;
    selectedTaskExecutionId: string;
    taskTreeItem: TaskTreeItemProps;
}) => {
    const hasChildren = taskTreeItem.children?.length > 0;
    const hasIterations = taskTreeItem.iterations && taskTreeItem.iterations.length > 0;

    const [childrenAccordionValue, setChildrenAccordionValue] = useState('');
    const [iterationAccordionValue, setIterationAccordionValue] = useState('');

    // Opens the correct child accordion item when a nested task is selected externally (e.g. node click)
    useEffect(() => {
        if (!expandedAccordionValues) {
            return;
        }

        if (hasChildren) {
            const matchingChild = taskTreeItem.children.find((child) =>
                expandedAccordionValues.has(child.task.id || '')
            );

            setChildrenAccordionValue(matchingChild?.task.id || '');
        }

        if (hasIterations && taskTreeItem.iterations) {
            let matchingIterationValue = '';

            for (let index = 0; index < taskTreeItem.iterations.length; index++) {
                const iterationValue = `${taskTreeItem.task.id}-iteration-${index}`;

                if (expandedAccordionValues.has(iterationValue)) {
                    matchingIterationValue = iterationValue;

                    break;
                }
            }

            setIterationAccordionValue(matchingIterationValue);
        }
    }, [expandedAccordionValues, hasChildren, hasIterations, taskTreeItem]);

    const childrenAccordionProps = expandedAccordionValues
        ? {onValueChange: setChildrenAccordionValue, value: childrenAccordionValue}
        : {};

    const iterationAccordionProps = expandedAccordionValues
        ? {onValueChange: setIterationAccordionValue, value: iterationAccordionValue}
        : {};

    return (
        <AccordionItem
            className={twMerge('border-b-0 pl-2', nestedItem && 'pl-4')}
            key={taskTreeItem.task.id}
            value={taskTreeItem.task.id || ''}
        >
            <AccordionTrigger
                className={twMerge(
                    'group flex w-full items-center justify-between rounded-md border border-stroke-neutral-primary p-2 hover:border-stroke-brand-primary hover:no-underline focus-visible:outline-stroke-brand-focus focus-visible:transition-colors [&[data-state=open]]:border-stroke-brand-primary [&[data-state=open]]:hover:border-stroke-brand-secondary',
                    selectedTaskExecutionId === taskTreeItem.task.id &&
                        'border-stroke-brand-primary bg-surface-neutral-secondary hover:bg-surface-neutral-secondary [&[data-state=open]]:border-stroke-brand-primary',
                    !hasChildren &&
                        !hasIterations &&
                        '[&[data-state=closed]>svg]:hidden [&[data-state=open]>svg]:hidden'
                )}
                onClick={() => onTaskClick(taskTreeItem.task)}
            >
                <WorkflowTaskExecutionItem taskExecution={taskTreeItem.task} />
            </AccordionTrigger>

            {(hasChildren || hasIterations) && (
                <AccordionContent
                    className="border-l border-stroke-neutral-secondary p-0"
                    onClick={(event) => event.stopPropagation()}
                >
                    {hasIterations ? (
                        <Accordion className="mt-2 space-y-2" collapsible type="single" {...iterationAccordionProps}>
                            {taskTreeItem.iterations?.map((iterationItems, index) => {
                                const iterationValue = `${taskTreeItem.task.id}-iteration-${index}`;

                                const innerChildDefaultValue = expandedAccordionValues
                                    ? iterationItems.find((child) =>
                                          expandedAccordionValues.has(child.task.id || '')
                                      )?.task.id || ''
                                    : undefined;

                                return (
                                    <AccordionItem
                                        className="border-b-0 pl-4"
                                        key={iterationValue}
                                        value={iterationValue}
                                    >
                                        <AccordionTrigger className="group flex w-full items-center justify-between rounded-md border border-stroke-neutral-primary p-2 hover:border-stroke-brand-primary hover:no-underline focus-visible:outline-stroke-brand-focus focus-visible:transition-colors [&[data-state=open]]:border-stroke-brand-primary [&[data-state=open]]:hover:border-stroke-brand-secondary">
                                            <div className="flex w-full items-center justify-between">
                                                <span className="text-sm font-medium text-foreground">
                                                    Loop iteration {index + 1}
                                                </span>

                                                <span className="mr-2 text-xs text-muted-foreground">
                                                    {iterationItems.length} tasks
                                                </span>
                                            </div>
                                        </AccordionTrigger>

                                        {iterationItems.length > 0 && (
                                            <AccordionContent className="border-l border-stroke-neutral-secondary p-0">
                                                <Accordion
                                                    className="mt-2 space-y-2"
                                                    collapsible
                                                    defaultValue={innerChildDefaultValue}
                                                    key={
                                                        expandedAccordionValues
                                                            ? selectedTaskExecutionId
                                                            : undefined
                                                    }
                                                    type="single"
                                                >
                                                    {iterationItems.map((childItem) => (
                                                        <WorkflowExecutionsTaskAccordionItem
                                                            expandedAccordionValues={expandedAccordionValues}
                                                            key={childItem.task.id}
                                                            nestedItem
                                                            onTaskClick={onTaskClick}
                                                            selectedTaskExecutionId={
                                                                selectedTaskExecutionId || ''
                                                            }
                                                            taskTreeItem={childItem}
                                                        />
                                                    ))}
                                                </Accordion>
                                            </AccordionContent>
                                        )}
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    ) : (
                        <Accordion className="mt-2 space-y-2" collapsible type="single" {...childrenAccordionProps}>
                            {taskTreeItem.children.map((childItem) => (
                                <WorkflowExecutionsTaskAccordionItem
                                    expandedAccordionValues={expandedAccordionValues}
                                    key={childItem.task.id}
                                    nestedItem
                                    onTaskClick={onTaskClick}
                                    selectedTaskExecutionId={selectedTaskExecutionId || ''}
                                    taskTreeItem={childItem}
                                />
                            ))}
                        </Accordion>
                    )}
                </AccordionContent>
            )}
        </AccordionItem>
    );
};

export default WorkflowExecutionsTaskAccordionItem;
