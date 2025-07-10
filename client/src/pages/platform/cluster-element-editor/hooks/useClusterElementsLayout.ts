import {DEFAULT_NODE_POSITION} from '@/shared/constants';
import {ComponentDefinition, ComponentDefinitionApi} from '@/shared/middleware/platform/configuration';
import {
    ComponentDefinitionKeys,
    useGetComponentDefinitionQuery,
} from '@/shared/queries/platform/componentDefinitions.queries';
import {ClusterElementItemType, ClusterElementsType} from '@/shared/types';
import {useQueryClient} from '@tanstack/react-query';
import {Edge, Node} from '@xyflow/react';
import {useEffect, useMemo, useState} from 'react';
import {useShallow} from 'zustand/react/shallow';

import useWorkflowDataStore from '../../workflow-editor/stores/useWorkflowDataStore';
import useWorkflowEditorStore from '../../workflow-editor/stores/useWorkflowEditorStore';
import {getLayoutedElements} from '../../workflow-editor/utils/layoutUtils';
import useClusterElementsDataStore from '../stores/useClusterElementsDataStore';
import createClusterElementsEdges from '../utils/createClusterElementsEdges';
import createClusterElementsNodes from '../utils/createClusterElementsNodes';

const useClusterElementsLayout = () => {
    const [nestedClusterRootsDefinitions, setNestedClusterRootsDefinitions] = useState<
        Record<string, ComponentDefinition>
    >({});

    const {rootClusterElementNodeData} = useWorkflowEditorStore();
    const {workflow} = useWorkflowDataStore.getState();

    const queryClient = useQueryClient();

    const rootClusterElementComponentVersion =
        Number(rootClusterElementNodeData?.type?.split('/')[1].replace(/^v/, '')) || 1;

    const rootClusterElementComponentName = rootClusterElementNodeData?.componentName || '';

    const {data: mainRootClusterElementDefinition} = useGetComponentDefinitionQuery(
        {
            componentName: rootClusterElementComponentName,
            componentVersion: rootClusterElementComponentVersion,
        },
        !!rootClusterElementNodeData
    );

    const {nodes, setEdges, setNodes} = useClusterElementsDataStore(
        useShallow((state) => ({
            nodes: state.nodes,
            setEdges: state.setEdges,
            setNodes: state.setNodes,
        }))
    );

    const nodePositions = nodes.reduce<Record<string, {x: number; y: number}>>((accumulator, node) => {
        accumulator[node.id] = {
            x: node.position.x,
            y: node.position.y,
        };
        return accumulator;
    }, {});

    const canvasWidth = window.innerWidth - 80;

    const {allNodes, taskEdges} = useMemo(() => {
        const nodes: Array<Node> = [];
        const edges: Array<Edge> = [];

        if (!rootClusterElementNodeData || !mainRootClusterElementDefinition || !workflow.definition) {
            return {allNodes: nodes, taskEdges: edges};
        }

        const rootClusterElementNode = {
            data: rootClusterElementNodeData,
            id: rootClusterElementNodeData.workflowNodeName,
            position:
                rootClusterElementNodeData.metadata?.ui?.nodePosition ||
                nodePositions[rootClusterElementNodeData.workflowNodeName] ||
                DEFAULT_NODE_POSITION,
            type: 'workflow',
        };

        nodes.push(rootClusterElementNode);

        const workflowDefinitionTasks = JSON.parse(workflow.definition).tasks;

        const currentClusterRootTask = workflowDefinitionTasks.find(
            (task: {name: string}) => task.name === rootClusterElementNodeData?.workflowNodeName
        );

        const clusterElements = currentClusterRootTask.clusterElements || {};

        const childNodes = createClusterElementsNodes({
            clusterElements,
            clusterRootComponentDefinition: mainRootClusterElementDefinition,
            clusterRootId: rootClusterElementNodeData.workflowNodeName,
            currentNodePositions: nodePositions,
            nestedClusterRootsDefinitions: nestedClusterRootsDefinitions || {},
        });

        nodes.push(...childNodes);

        const childEdges = createClusterElementsEdges({
            clusterRootComponentDefinition: mainRootClusterElementDefinition,
            clusterRootId: rootClusterElementNodeData.workflowNodeName,
            nestedClusterRootsDefinitions: nestedClusterRootsDefinitions || {},
            nodes,
        });

        edges.push(...childEdges);

        return {allNodes: nodes, taskEdges: edges};

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nestedClusterRootsDefinitions, rootClusterElementNodeData, mainRootClusterElementDefinition, workflow]);

    useEffect(() => {
        if (!rootClusterElementNodeData || !mainRootClusterElementDefinition || !workflow.definition) {
            return;
        }

        const workflowDefinitionTasks = JSON.parse(workflow.definition).tasks;

        const mainClusterRootTask = workflowDefinitionTasks.find(
            (task: {name: string}) => task.name === rootClusterElementNodeData?.workflowNodeName
        );

        const clusterElements = mainClusterRootTask.clusterElements || {};

        const getClusterRoots = (
            elements: ClusterElementsType
        ): Array<{componentName: string; componentVersion: number}> => {
            return Object.values(elements).flatMap((value) => {
                if (Array.isArray(value)) {
                    return value.flatMap((item: ClusterElementItemType) => {
                        if (item.clusterElements) {
                            return [
                                {
                                    componentName: item.type.split('/')[0],
                                    componentVersion: Number(item.type?.split('/')[1]?.replace(/^v/, '')) || 1,
                                },
                                ...getClusterRoots(item.clusterElements),
                            ];
                        }

                        return [];
                    });
                } else if (value && typeof value === 'object') {
                    if (value.clusterElements) {
                        return [
                            {
                                componentName: value.type.split('/')[0],
                                componentVersion: Number(value.type?.split('/')[1]?.replace(/^v/, '')) || 1,
                            },
                            ...getClusterRoots(value.clusterElements),
                        ];
                    }
                }

                return [];
            });
        };

        const clusterRoots = getClusterRoots(clusterElements);

        const createDefinitionQueryParameters = (roots: Array<{componentName: string; componentVersion: number}>) => {
            return roots.map((root) => ({
                componentName: root.componentName,
                componentVersion: root.componentVersion,

                queryFn: () =>
                    new ComponentDefinitionApi().getComponentDefinition({
                        componentName: root.componentName,
                        componentVersion: root.componentVersion,
                    }),
                queryKey: ComponentDefinitionKeys.componentDefinition({
                    componentName: root.componentName,
                    componentVersion: root.componentVersion,
                }),
            }));
        };

        // MICANJE PROMISE-A JE ELIMINIRALO I ONAJ BLIP (RE-RENDER) PRI DODAVANJU NOVOG CLUSTER ELEMENTA
        const fetchAndUpdateDefinitions = async () => {
            const definitionQueryParameters = createDefinitionQueryParameters(clusterRoots);
            const definitions: Record<string, ComponentDefinition> = {};

            for (const query of definitionQueryParameters) {
                const definition = await queryClient.fetchQuery({
                    queryFn: query.queryFn,
                    queryKey: query.queryKey,
                });

                definitions[query.componentName] = definition;
            }

            setNestedClusterRootsDefinitions(definitions);
        };

        fetchAndUpdateDefinitions();
    }, [rootClusterElementNodeData, mainRootClusterElementDefinition, workflow, queryClient]);

    useEffect(() => {
        const layoutNodes = allNodes;
        const edges: Edge[] = taskEdges;

        const elements = getLayoutedElements({canvasWidth, edges, isClusterElementsCanvas: true, nodes: layoutNodes});

        setNodes(elements.nodes);
        setEdges(elements.edges);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasWidth, rootClusterElementNodeData, allNodes]);
};

export default useClusterElementsLayout;
