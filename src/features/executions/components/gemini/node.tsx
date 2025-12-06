'use client'

import {Node, NodeProps, useReactFlow} from "@xyflow/react";
import {memo, useState} from "react";
import {BaseExecutionNode} from "@/features/executions/components/base-execution-node";
import {useNodeStatus} from "@/features/executions/hooks/use-node-states";
import {GeminiDialog, GeminiFormValues} from "@/features/executions/components/gemini/dialog";
import {fetchGeminiRealtimeToken} from "@/features/executions/components/gemini/actions";
import {GEMINI_CHANNEL_NAME} from "@/inngest/channels/gemini";

type GeminiNodeData = {
    credentialId?: string;
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

type GeminiNodeType = Node<GeminiNodeData>

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow()

    const handleOpenSettings = () => setDialogOpen(true)

    const handleSubmit = (value: GeminiFormValues) => {
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
        ? `"gemini-2.5-flash" : ${nodeData.userPrompt.slice(0,50)}...`
        : 'Not configured'

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GEMINI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGeminiRealtimeToken
    })

    return (
        <>
            <GeminiDialog
                onSubmit={handleSubmit}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={'/gemini.svg'}
                name={'Gemini'}
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

GeminiNode.displayName = "GeminiNode";
