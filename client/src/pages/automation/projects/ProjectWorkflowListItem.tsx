import WorkflowDialog from '@/components/WorkflowDialog/WorkflowDialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {ProjectModel, WorkflowModel} from '@/middleware/helios/configuration';
import {ComponentDefinitionBasicModel} from '@/middleware/hermes/configuration';
import {
    useDeleteWorkflowMutation,
    useDuplicateWorkflowMutation,
    useUpdateWorkflowMutation,
} from '@/mutations/projects.mutations';
import {ProjectKeys} from '@/queries/projects.queries';
import {DotsVerticalIcon} from '@radix-ui/react-icons';
import {useQueryClient} from '@tanstack/react-query';
import {CalendarIcon} from 'lucide-react';
import {useState} from 'react';
import InlineSVG from 'react-inlinesvg';
import {Link} from 'react-router-dom';

const ProjectWorkflowListItem = ({
    filteredDefinitionNames,
    project,
    workflow,
    workflowComponentDefinitions,
    workflowTaskDispatcherDefinitions,
}: {
    filteredDefinitionNames?: string[];
    project: ProjectModel;
    workflow: WorkflowModel;
    workflowComponentDefinitions: {
        [key: string]: ComponentDefinitionBasicModel | undefined;
    };
    workflowTaskDispatcherDefinitions: {
        [key: string]: ComponentDefinitionBasicModel | undefined;
    };
}) => {
    const [selectedWorkflow, setSelectedWorkflow] = useState<
        WorkflowModel | undefined
    >(undefined);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const queryClient = useQueryClient();

    const deleteWorkflowMutationMutation = useDeleteWorkflowMutation({
        onSuccess: () => {
            queryClient.invalidateQueries(ProjectKeys.projects);

            setShowDeleteDialog(false);
        },
    });

    const duplicateWorkflowMutationMutation = useDuplicateWorkflowMutation({
        onSuccess: () => {
            queryClient.invalidateQueries(ProjectKeys.projects);
        },
    });

    const updateWorkflowMutationMutation = useUpdateWorkflowMutation({
        onSuccess: () => {
            queryClient.invalidateQueries(ProjectKeys.projects);

            setShowEditDialog(false);
        },
    });

    return (
        <>
            <div className="w-10/12">
                <Link
                    className="flex items-center"
                    to={`/automation/projects/${project.id}/workflow/${workflow.id}`}
                >
                    <div className="w-6/12 text-sm font-semibold">
                        {workflow.label}
                    </div>

                    <div className="ml-6 flex">
                        {filteredDefinitionNames?.map((name) => {
                            const componentDefinition =
                                workflowComponentDefinitions[name];

                            const taskDispatcherDefinition =
                                workflowTaskDispatcherDefinitions[name];

                            return (
                                <div
                                    className="mr-0.5 flex items-center justify-center rounded-full border p-1"
                                    key={name}
                                >
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <InlineSVG
                                                className="h-5 w-5 flex-none"
                                                key={name}
                                                src={
                                                    componentDefinition?.icon
                                                        ? componentDefinition?.icon
                                                        : taskDispatcherDefinition?.icon ??
                                                          ''
                                                }
                                            />
                                        </TooltipTrigger>

                                        <TooltipContent side="right">
                                            {componentDefinition?.title}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-1 justify-end">
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="flex items-center text-sm text-gray-500">
                                    <CalendarIcon
                                        aria-hidden="true"
                                        className="mr-0.5 h-4 w-4 shrink-0 text-gray-400"
                                    />

                                    <span>{`${workflow.lastModifiedDate?.toLocaleDateString()} ${workflow.lastModifiedDate?.toLocaleTimeString()}`}</span>
                                </div>
                            </TooltipTrigger>

                            <TooltipContent>Last Modified Date</TooltipContent>
                        </Tooltip>
                    </div>
                </Link>
            </div>

            <div className="flex w-2/12 justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                            <DotsVerticalIcon className="h-4 w-4 hover:cursor-pointer" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="text-xs"
                            onClick={() => {
                                setSelectedWorkflow(workflow);
                                setShowEditDialog(true);
                            }}
                        >
                            Edit
                        </DropdownMenuItem>

                        {project && workflow && (
                            <DropdownMenuItem
                                className="text-xs"
                                onClick={() =>
                                    duplicateWorkflowMutationMutation.mutate({
                                        id: project.id!,
                                        workflowId: workflow.id!,
                                    })
                                }
                            >
                                Duplicate
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="text-xs text-red-600"
                            onClick={() => {
                                setSelectedWorkflow(workflow);
                                setShowDeleteDialog(true);
                            }}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <AlertDialog open={showDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the workflow.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            className="bg-red-600"
                            onClick={() => {
                                if (project?.id && selectedWorkflow?.id) {
                                    deleteWorkflowMutationMutation.mutate({
                                        id: project?.id,
                                        workflowId: selectedWorkflow?.id,
                                    });
                                }
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {showEditDialog && (
                <WorkflowDialog
                    onClose={() => setShowEditDialog(false)}
                    showTrigger={false}
                    updateWorkflowMutationMutation={
                        updateWorkflowMutationMutation
                    }
                    visible
                    workflow={selectedWorkflow!}
                />
            )}
        </>
    );
};

export default ProjectWorkflowListItem;
