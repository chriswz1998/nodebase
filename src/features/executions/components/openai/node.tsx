'use client'

import {Node, NodeProps, useReactFlow} from "@xyflow/react";
import {memo, useState} from "react";
import {BaseExecutionNode} from "@/features/executions/components/base-execution-node";
import {useNodeStatus} from "@/features/executions/hooks/use-node-states";
import {OpenAIDialog, OpenAIFormValues} from "@/features/executions/components/openai/dialog";
import {fetchOpenAIRealtimeToken} from "@/features/executions/components/openai/actions";
import {OPENAI_CHANNEL_NAME} from "@/inngest/channels/openai";

type OpenAINodeData = {
    credentialId?: string;
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

type OpenAINodeType = Node<OpenAINodeData>

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow()

    const handleOpenSettings = () => setDialogOpen(true)

    const handleSubmit = (value: OpenAIFormValues) => {
        setNodes((nodes) => nodes.map((node => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...value
                    }
                }
            }
            return node
        })))
    }

    const nodeData = props.data
    const description = nodeData?.userPrompt
        ? `"gpt-5-nano" : ${nodeData.userPrompt.slice(0,50)}...`
        : 'Not configured'

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenAIRealtimeToken
    })

    return (
        <>
            <OpenAIDialog
                onSubmit={handleSubmit}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={'/openai.svg'}
                name={'OpenAI'}
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

OpenAINode.displayName = "OpenAINode";
