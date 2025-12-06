'use client'

import {Node, NodeProps, useReactFlow} from "@xyflow/react";
import {memo, useState} from "react";
import {BaseExecutionNode} from "@/features/executions/components/base-execution-node";
import {useNodeStatus} from "@/features/executions/hooks/use-node-states";
import {DiscordDialog, DiscordFormValues} from "@/features/executions/components/discord/dialog";
import {DISCORD_CHANNEL_NAME} from "@/inngest/channels/discord";
import {fetchDiscordRealtimeToken} from "@/features/executions/components/discord/actions";

type DiscordNodeData = {
    webhookUrl?: string;
    content?: string;
    username?: string;
}

type DiscordNodeType = Node<DiscordNodeData>

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow()

    const handleOpenSettings = () => setDialogOpen(true)

    const handleSubmit = (value: DiscordFormValues) => {
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
    const description = nodeData?.content
        ? `"Send:" : ${nodeData.content.slice(0,50)}...`
        : 'Not configured'

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: DISCORD_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchDiscordRealtimeToken
    })

    return (
        <>
            <DiscordDialog
                onSubmit={handleSubmit}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={'/discord.svg'}
                name={'Discord'}
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

DiscordNode.displayName = "DiscordNode";
