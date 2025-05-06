import useRightSidebarStore from '@/pages/platform/workflow-editor/stores/useRightSidebarStore';
import {NodeDataType, TabNameType} from '@/shared/types';
import {NodeProps} from '@xyflow/react';
import {useCallback} from 'react';
import {useShallow} from 'zustand/react/shallow';

import useAiAgentDataStore from '../../ai-agent-editor/stores/useAiAgentDataStore';
import useWorkflowDataStore from '../stores/useWorkflowDataStore';
import useWorkflowEditorStore from '../stores/useWorkflowEditorStore';
import useWorkflowNodeDetailsPanelStore from '../stores/useWorkflowNodeDetailsPanelStore';

export default function useNodeClick(data: NodeDataType, id: NodeProps['id'], activeTab?: TabNameType) {
    const {setActiveTab, setCurrentComponent, setCurrentNode, setWorkflowNodeDetailsPanelOpen} =
        useWorkflowNodeDetailsPanelStore();
    const {setRightSidebarOpen} = useRightSidebarStore();

    const {nodes} = useWorkflowDataStore(
        useShallow((state) => ({
            nodes: state.nodes,
        }))
    );

    const {nodes: aiAgentCanvasNodes} = useAiAgentDataStore(
        useShallow((state) => ({
            nodes: state.nodes,
        }))
    );

    const {aiAgentOpen, setAiAgentOpen} = useWorkflowEditorStore();

    return useCallback(() => {
        const clickedNode = nodes.find((node) => node.id === id);
        const clickedNodeInAiAgentCanvas = aiAgentCanvasNodes.find((node) => node.id === id);

        if (!aiAgentOpen && !clickedNode) {
            return;
        }

        if (aiAgentOpen && !clickedNodeInAiAgentCanvas) {
            return;
        }

        console.log('data in use node click:', data);

        setRightSidebarOpen(false);
        setActiveTab(activeTab ?? 'description');
        setCurrentNode({...data, description: ''});

        if (data.componentName === 'aiAgent') {
            setAiAgentOpen(true);
        }

        setWorkflowNodeDetailsPanelOpen(true);

        if (data.type) {
            setCurrentComponent({
                ...data,
                workflowNodeName: data.name,
            });
        }
    }, [
        nodes,
        aiAgentCanvasNodes,
        aiAgentOpen,
        setRightSidebarOpen,
        setActiveTab,
        activeTab,
        setCurrentNode,
        data,
        id,
        setAiAgentOpen,
        setWorkflowNodeDetailsPanelOpen,
        setCurrentComponent,
    ]);
}
