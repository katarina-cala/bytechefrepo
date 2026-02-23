import Button from '@/components/Button/Button';
import useWorkflowExecutionSheetStore from '@/pages/automation/workflow-executions/stores/useWorkflowExecutionSheetStore';
import {useGetProjectWorkflowExecutionQuery} from '@/shared/queries/automation/workflowExecutions.queries';
import {NodeDataType} from '@/shared/types';
import {Handle, Position} from '@xyflow/react';
import {memo, useMemo} from 'react';
import {twMerge} from 'tailwind-merge';
import {useShallow} from 'zustand/shallow';

import useLayoutDirectionStore from '../stores/useLayoutDirectionStore';
import {mapHandlePosition} from '../utils/directionUtils';
import styles from './NodeTypes.module.css';

const STATUS_BORDER_CLASSES: Record<string, string> = {
    CANCELLED: 'border-stroke-neutral-tertiary',
    COMPLETED: 'border-stroke-success-secondary',
    CREATED: 'border-stroke-neutral-tertiary',
    FAILED: 'border-stroke-destructive-primary',
    STARTED: 'animate-pulse border-stroke-brand-primary',
};

const ReadOnlyNode = ({data}: {data: NodeDataType}) => {
    const layoutDirection = useLayoutDirectionStore((state) => state.layoutDirection);

    const {selectedItem, setSelectedItem, workflowExecutionId, workflowExecutionSheetOpen} =
        useWorkflowExecutionSheetStore(
            useShallow((state) => ({
                selectedItem: state.selectedItem,
                setSelectedItem: state.setSelectedItem,
                workflowExecutionId: state.workflowExecutionId,
                workflowExecutionSheetOpen: state.workflowExecutionSheetOpen,
            }))
        );

    const {data: workflowExecution} = useGetProjectWorkflowExecutionQuery(
        {
            id: workflowExecutionId,
        },
        workflowExecutionSheetOpen
    );

    const matchingTaskExecution = useMemo(
        () =>
            workflowExecution?.job.taskExecutions?.find(
                (execution) => execution.workflowTask?.name === data.workflowNodeName
            ),
        [workflowExecution, data.workflowNodeName]
    );

    const executionStatus = data.trigger ? workflowExecution?.triggerExecution?.status : matchingTaskExecution?.status;

    const isExecuted = !!executionStatus;

    const isSelected = data.trigger
        ? selectedItem?.id === workflowExecution?.triggerExecution?.id
        : selectedItem?.id === matchingTaskExecution?.id;

    const handleNodeClick = () => {
        if (data.trigger && workflowExecution?.triggerExecution) {
            setSelectedItem(workflowExecution.triggerExecution);
        } else if (matchingTaskExecution) {
            setSelectedItem(matchingTaskExecution);
        }
    };

    const statusBorderClass = executionStatus ? STATUS_BORDER_CLASSES[executionStatus] : '';

    return (
        <div className="relative flex items-center justify-center">
            <Button
                className={twMerge(
                    'size-18 rounded-md border-2 border-stroke-neutral-tertiary bg-surface-neutral-primary p-4 text-primary shadow hover:bg-surface-neutral-primary focus-visible:ring-stroke-brand-focus active:bg-surface-neutral-primary [&_svg]:size-9',
                    isExecuted
                        ? 'cursor-pointer hover:border-stroke-brand-secondary-hover hover:shadow-none'
                        : 'cursor-default opacity-50',
                    statusBorderClass,
                    isSelected && 'border-stroke-brand-primary shadow-none hover:border-stroke-brand-primary'
                )}
                onClick={handleNodeClick}
            >
                {data.icon}
            </Button>

            <div className="ml-2 flex w-full min-w-max flex-col items-start">
                <span className="font-semibold">{data.title || data.label}</span>

                {data.operationName && <pre className="text-sm">{data.operationName}</pre>}

                <span className="text-sm text-gray-500">{data.trigger ? 'trigger_1' : data.name}</span>
            </div>

            <Handle
                className={styles.handle}
                isConnectable={false}
                position={mapHandlePosition(Position.Top, layoutDirection)}
                style={layoutDirection === 'TB' ? {left: '36px'} : undefined}
                type="target"
            />

            <Handle
                className={styles.handle}
                isConnectable={false}
                position={mapHandlePosition(Position.Bottom, layoutDirection)}
                style={layoutDirection === 'TB' ? {left: '36px'} : undefined}
                type="source"
            />
        </div>
    );
};

export default memo(ReadOnlyNode);
