import {Button} from '@/components/ui/button';
import {HoverCard, HoverCardContent, HoverCardTrigger} from '@/components/ui/hover-card';
import {
    ClusterElementDefinitionApi,
    ClusterElementDefinitionBasic,
    GetRootComponentClusterElementDefinitionsRequest,
} from '@/shared/middleware/platform/configuration';
import {ClusterElementDefinitionKeys} from '@/shared/queries/platform/clusterElemetDefinitions.queries';
import {useGetWorkflowNodeDescriptionQuery} from '@/shared/queries/platform/workflowNodeDescriptions.queries';
import {NodeDataType} from '@/shared/types';
import {HoverCardPortal} from '@radix-ui/react-hover-card';
import {useQueryClient} from '@tanstack/react-query';
import {Handle, Position} from '@xyflow/react';
import {ComponentIcon, DatabaseIcon, MemoryStick, PencilIcon, PlusIcon, TrashIcon} from 'lucide-react';
import {memo, useState} from 'react';
import {useParams} from 'react-router-dom';
import sanitize from 'sanitize-html';
import {twMerge} from 'tailwind-merge';

import WorkflowNodesPopoverMenu from '../components/WorkflowNodesPopoverMenu';
import useNodeClickHandler from '../hooks/useNodeClick';
import {useWorkflowMutation} from '../providers/workflowMutationProvider';
import useWorkflowDataStore from '../stores/useWorkflowDataStore';
import useWorkflowNodeDetailsPanelStore from '../stores/useWorkflowNodeDetailsPanelStore';
import handleDeleteTask from '../utils/handleDeleteTask';
import styles from './NodeTypes.module.css';

export type AgentDataType = {
    CHAT_MEMORY: string;
    MODEL: string;
    RAG: string;
    TOOLS: string;
};

const AIAgentNode = ({data, id}: {data: NodeDataType; id: string}) => {
    const [clusterElementTypeDefinition, setClusterElementTypeDefinition] = useState<ClusterElementDefinitionBasic[]>(
        []
    );
    const [agentData, setAgentData] = useState<AgentDataType>({
        CHAT_MEMORY: '',
        MODEL: '',
        RAG: '',
        TOOLS: '',
    });
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredNodeName, setHoveredNodeName] = useState<string | undefined>();

    const {currentNode, workflowNodeDetailsPanelOpen} = useWorkflowNodeDetailsPanelStore();

    const {workflow} = useWorkflowDataStore();

    const queryClient = useQueryClient();

    const {updateWorkflowMutation} = useWorkflowMutation();

    const {projectId} = useParams();

    const isSelected = currentNode?.name === data.name;

    const {data: workflowNodeDescription} = useGetWorkflowNodeDescriptionQuery(
        {
            id: workflow.id!,
            workflowNodeName: hoveredNodeName!,
        },
        hoveredNodeName !== undefined
    );

    const handleNodeClick = useNodeClickHandler(data, id);

    const handleDeleteNodeClick = (data: NodeDataType) => {
        if (data) {
            handleDeleteTask({
                currentNode,
                data,
                projectId: +projectId!,
                queryClient,
                updateWorkflowMutation,
                workflow,
            });
        }
    };

    const handleClusterElementTypeClick = (model: string) => {
        const rootComponentClusterElementDefinitionRequest: GetRootComponentClusterElementDefinitionsRequest = {
            clusterElementType: model,
            rootComponentName: data?.componentName || '',
            rootComponentVersion: data.version || 1,
        };

        const fetchRootComponentClusterElementDefinition = async () => {
            const rootComponentClusterElementDefinition = await queryClient.fetchQuery({
                queryFn: () =>
                    new ClusterElementDefinitionApi().getRootComponentClusterElementDefinitions(
                        rootComponentClusterElementDefinitionRequest
                    ),
                queryKey: ClusterElementDefinitionKeys.filteredClusterElementDefinitions(
                    rootComponentClusterElementDefinitionRequest
                ),
            });

            setClusterElementTypeDefinition(rootComponentClusterElementDefinition);
        };

        fetchRootComponentClusterElementDefinition();
    };

    console.log('cluster element type definition', clusterElementTypeDefinition);

    const agentModel = data.clusterElements?.model?.type.split('/')[0];

    const agentMemory = data.clusterElements?.chatMemory?.type.split('/')[0];

    const agentRetrieval = data.clusterElements?.RAG?.type.split('/')[0];

    const agentTools = data.clusterElements?.tools.map((tool) => {
        const toolName = tool.name;
        return toolName;
    });

    return (
        <div
            className={twMerge(
                'nodrag relative flex min-w-60 cursor-pointer justify-center',
                !data.taskDispatcher && 'items-center'
            )}
            data-nodetype="aiAgentNode"
            key={id}
            onMouseOut={() => setIsHovered(true)}
            onMouseOver={() => setIsHovered(true)}
        >
            {isHovered && (
                <div className="absolute left-workflow-node-popover-hover pr-4">
                    {data.trigger ? (
                        <WorkflowNodesPopoverMenu hideActionComponents hideTaskDispatchers sourceNodeId={id}>
                            <Button
                                className="bg-white p-2 shadow-md hover:text-blue-500 hover:shadow-sm"
                                title="Change trigger component"
                                variant="outline"
                            >
                                <PencilIcon className="size-4" />
                            </Button>
                        </WorkflowNodesPopoverMenu>
                    ) : (
                        <Button
                            className="bg-white p-2 shadow-md hover:text-red-500 hover:shadow-sm"
                            onClick={() => handleDeleteNodeClick(data)}
                            title="Delete a node"
                            variant="outline"
                        >
                            <TrashIcon className="size-4" />
                        </Button>
                    )}
                </div>
            )}

            <HoverCard
                key={id}
                onOpenChange={(open) => {
                    if (open) {
                        setHoveredNodeName(data.name);
                    } else {
                        setHoveredNodeName(undefined);
                    }
                }}
            >
                <Button
                    className={twMerge(
                        'size-18 flex flex-col items-start rounded-md border-2 border-gray-300 bg-background p-2 text-content-neutral-primary shadow hover:bg-background hover:shadow-none [&_svg]:size-8',
                        isSelected && workflowNodeDetailsPanelOpen && 'border-blue-300 bg-background shadow-none'
                    )}
                    onClick={handleNodeClick}
                >
                    <div className="flex w-full flex-1 items-center justify-between px-1">
                        <HoverCardTrigger>
                            <div> {data.icon} </div>
                        </HoverCardTrigger>

                        <WorkflowNodesPopoverMenu
                            agentData={agentData}
                            setAgentData={setAgentData}
                            sourceData={clusterElementTypeDefinition}
                            sourceNodeId={id}
                        >
                            <Button
                                className="[&>span]:line-clamp-0 border border-stroke-neutral-secondary bg-background px-3 py-2 text-content-neutral-primary shadow-none hover:bg-surface-neutral-primary-hover [&>span]:truncate [&>svg]:max-w-4"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClusterElementTypeClick('MODEL');
                                }}
                            >
                                {agentModel ? agentModel : agentData.MODEL ? agentData.MODEL : 'Model'}
                            </Button>
                        </WorkflowNodesPopoverMenu>
                    </div>

                    <div className="flex gap-2">
                        <WorkflowNodesPopoverMenu
                            agentData={agentData}
                            setAgentData={setAgentData}
                            sourceData={clusterElementTypeDefinition}
                            sourceNodeId={id}
                        >
                            <Button
                                className="rounded-full px-2 font-medium hover:bg-surface-neutral-secondary-hover [&>svg]:max-w-4"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClusterElementTypeClick('RAG');
                                }}
                                variant="outline"
                            >
                                {agentRetrieval ? (
                                    agentRetrieval
                                ) : agentData.RAG ? (
                                    <>
                                        <ComponentIcon /> {agentData.RAG}
                                    </>
                                ) : (
                                    <>
                                        <DatabaseIcon /> Retrieval
                                    </>
                                )}
                            </Button>
                        </WorkflowNodesPopoverMenu>

                        <WorkflowNodesPopoverMenu
                            agentData={agentData}
                            setAgentData={setAgentData}
                            sourceData={clusterElementTypeDefinition}
                            sourceNodeId={id}
                        >
                            <Button
                                className="rounded-full px-2 hover:bg-surface-neutral-secondary-hover [&>svg]:max-w-4"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClusterElementTypeClick('CHAT_MEMORY');
                                }}
                                variant="outline"
                            >
                                {agentMemory ? (
                                    agentMemory
                                ) : agentData.CHAT_MEMORY ? (
                                    <>
                                        <ComponentIcon /> {agentData.CHAT_MEMORY}
                                    </>
                                ) : (
                                    <>
                                        <MemoryStick /> Memory
                                    </>
                                )}
                            </Button>
                        </WorkflowNodesPopoverMenu>
                    </div>

                    <div>
                        <WorkflowNodesPopoverMenu
                            agentData={agentData}
                            setAgentData={setAgentData}
                            sourceData={clusterElementTypeDefinition}
                            sourceNodeId={id}
                        >
                            <div className="flex items-center">
                                {agentTools &&
                                    agentTools.map((tool, index) => (
                                        <Button key={index} variant="ghost">
                                            {tool}
                                        </Button>
                                    ))}

                                <Button
                                    className={twMerge(
                                        'rounded-full bg-surface-neutral-secondary px-3 hover:bg-surface-neutral-secondary-hover [&>svg]:max-w-4',
                                        agentTools && 'rounded-full p-3'
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClusterElementTypeClick('TOOLS');
                                    }}
                                    variant="ghost"
                                >
                                    {agentData.TOOLS ? (
                                        <>
                                            <ComponentIcon /> {agentData.TOOLS}
                                        </>
                                    ) : (
                                        <>
                                            <PlusIcon className="size-4" />
                                            <span className={twMerge(agentTools ? 'hidden' : 'inline-block')}>
                                                Tool
                                            </span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </WorkflowNodesPopoverMenu>
                    </div>
                </Button>

                <HoverCardPortal>
                    <HoverCardContent className="absolute left-56 w-fit min-w-72 max-w-xl text-sm" side="right">
                        {workflowNodeDescription?.description && (
                            <div
                                className="flex"
                                dangerouslySetInnerHTML={{
                                    __html: sanitize(workflowNodeDescription.description, {
                                        allowedAttributes: {
                                            div: ['class'],
                                            table: ['class'],
                                            td: ['class'],
                                            tr: ['class'],
                                        },
                                    }),
                                }}
                            />
                        )}
                    </HoverCardContent>
                </HoverCardPortal>
            </HoverCard>

            <div className="ml-2 flex w-full min-w-max flex-col items-start">
                <span className="font-semibold">{data.title || data.label}</span>

                {data.operationName && <pre className="text-sm">{data.operationName}</pre>}

                <span className="text-sm text-gray-500">{data.workflowNodeName}</span>
            </div>

            <Handle
                className={twMerge('left-[115px]', styles.handle)}
                isConnectable={false}
                position={Position.Top}
                type="target"
            />

            <Handle
                className={twMerge('left-[115px]', styles.handle)}
                isConnectable={false}
                position={Position.Bottom}
                type="source"
            />
        </div>
    );
};
export default memo(AIAgentNode);
