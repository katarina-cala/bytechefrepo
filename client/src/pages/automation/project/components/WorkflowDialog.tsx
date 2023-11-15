import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {WorkflowModel} from '@/middleware/helios/configuration';
import {UseMutationResult} from '@tanstack/react-query';
import {ReactNode, useState} from 'react';
import {useForm} from 'react-hook-form';

type WorkflowDialogProps = {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    createWorkflowRequestMutation?: UseMutationResult<
        any,
        object,
        any,
        unknown
    >;
    onClose?: () => void;
    parentId?: number;
    triggerNode?: ReactNode;
    triggerClassName?: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    updateWorkflowMutationMutation?: UseMutationResult<
        any,
        object,
        any,
        unknown
    >;
    workflow?: WorkflowModel;
};

const WorkflowDialog = ({
    createWorkflowRequestMutation,
    onClose,
    parentId,
    triggerNode,
    updateWorkflowMutationMutation,
    workflow,
}: WorkflowDialogProps) => {
    const [isOpen, setIsOpen] = useState(!triggerNode);

    const form = useForm({
        defaultValues: {
            description: workflow?.description || '',
            label: workflow?.label || '',
        } as WorkflowModel,
    });

    const {control, getValues, handleSubmit, reset} = form;

    const {isPending, mutate} = createWorkflowRequestMutation
        ? createWorkflowRequestMutation!
        : updateWorkflowMutationMutation!;

    function closeDialog() {
        setIsOpen(false);

        if (onClose) {
            onClose();
        }

        reset();
    }

    function saveWorkflow() {
        const formData = getValues();

        if (workflow) {
            mutate({
                id: workflow.id,
                workflowRequestModel: {
                    definition: JSON.stringify({
                        ...JSON.parse(workflow.definition!),
                        description: formData.description,
                        label: formData.label,
                    }),
                },
            });
        } else {
            mutate({
                id: parentId,
                workflowRequestModel: {
                    definition: JSON.stringify({
                        description: formData.description,
                        label: formData.label,
                        tasks: [],
                    }),
                },
            });
        }

        closeDialog();
    }

    return (
        <Dialog
            onOpenChange={(isOpen) => {
                if (isOpen) {
                    setIsOpen(isOpen);
                } else {
                    closeDialog();
                }
            }}
            open={isOpen}
        >
            {triggerNode && (
                <DialogTrigger asChild>{triggerNode}</DialogTrigger>
            )}

            <DialogContent>
                <Form {...form}>
                    <DialogHeader>
                        <DialogTitle>Create Workflow</DialogTitle>

                        <DialogDescription>
                            Use this to create a workflow. Creating a workflow
                            will redirect you to the page where you can edit it.
                        </DialogDescription>
                    </DialogHeader>

                    <FormField
                        control={control}
                        name="label"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>

                                <FormControl>
                                    <Input {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                        rules={{required: true}}
                    />

                    <FormField
                        control={control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>

                                <FormControl>
                                    <Textarea
                                        placeholder="Cute description of your project instance"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button
                            disabled={isPending}
                            onClick={handleSubmit(saveWorkflow)}
                            type="submit"
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default WorkflowDialog;
