import {ComponentDefinitionBasic, WorkflowNodeOutput} from '@/shared/middleware/platform/configuration';
import {UpdateWorkflowMutationType} from '@/shared/types';
import {Controls, ReactFlow, ReactFlowProvider, StepEdge, applyEdgeChanges, applyNodeChanges} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import {useCallback, useState} from 'react';

import WorkflowNodeDetailsPanel from '../../workflow-editor/components/WorkflowNodeDetailsPanel';
import AiAgentModelNode from '../../workflow-editor/nodes/AiAgentModelNode';
import useWorkflowDataStore from '../../workflow-editor/stores/useWorkflowDataStore';
import {BotIcon} from 'lucide-react';
import {FINAL_PLACEHOLDER_NODE_ID} from '@/shared/constants';
import useWorkflowNodeDetailsPanelStore from '../../workflow-editor/stores/useWorkflowNodeDetailsPanelStore';
import WorkflowNode from '../../workflow-editor/nodes/WorkflowNode';
import PlaceholderNode from '../../workflow-editor/nodes/PlaceholderNode';
import PlaceholderEdge from '../../workflow-editor/edges/PlaceholderEdge';
import useAiAgentDataStore from '../stores/useAiAgentDataStore';
import {useShallow} from 'zustand/react/shallow';
import useAiAgentLayout from '../hooks/useAiAgentLayout';

const AiAgentWorkflowEditor = () => {
    // const {currentNode} = useWorkflowNodeDetailsPanelStore();
    // console.log('current node', currentNode);

    const {edges, nodes, onEdgesChange, onNodesChange} = useAiAgentDataStore(
        useShallow((state) => ({
            edges: state.edges,
            nodes: state.nodes,
            onEdgesChange: state.onEdgesChange,
            onNodesChange: state.onNodesChange,
        }))
    );

    const aiAgentEdgeTypes = {
        placeholder: PlaceholderEdge,
    };

    const aiAgentNodeTypes = {
        placeholder: PlaceholderNode,
        workflow: WorkflowNode,
    };

    useAiAgentLayout();

    console.log('edges', edges);
    console.log('nodes', nodes);

    return (
        <div className="size-full rounded-lg bg-surface-popover-canvas">
            <ReactFlowProvider>
                <ReactFlow
                    edgeTypes={aiAgentEdgeTypes}
                    edges={edges}
                    maxZoom={1.5}
                    minZoom={0.6}
                    nodeTypes={aiAgentNodeTypes}
                    nodesDraggable
                    // onDragOver={onDragOver}
                    // onDrop={onDrop}
                    nodes={nodes}
                    nodesConnectable={false}
                    onEdgesChange={onEdgesChange}
                    onNodesChange={onNodesChange}
                    panOnDrag
                    panOnScroll
                    proOptions={{hideAttribution: true}}
                    zoomOnDoubleClick={false}
                    zoomOnScroll={false}
                >
                    <Controls
                        className="m-2 rounded-md border border-stroke-neutral-secondary bg-background"
                        fitViewOptions={{duration: 500, minZoom: 0.2}}
                        showInteractive={false}
                    />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
};

export default AiAgentWorkflowEditor;
