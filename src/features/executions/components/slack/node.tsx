'use client'

import {Node, NodeProps, useReactFlow} from "@xyflow/react";
import {memo, useState} from "react";
import {BaseExecutionNode} from "@/features/executions/components/base-execution-node";
import {useNodeStatus} from "@/features/executions/hooks/use-node-states";
import {SlackDialog, SlackFormValues} from "@/features/executions/components/slack/dialog";
import {fetchSlackRealtimeToken} from "@/features/executions/components/slack/actions";
import {SLACK_CHANNEL_NAME} from "@/inngest/channels/slack";

type SlackNodeData = {
    webhookUrl?: string;
    content?: string;
}

type SlackNodeType = Node<SlackNodeData>

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow()

    const handleOpenSettings = () => setDialogOpen(true)

    const handleSubmit = (value: SlackFormValues) => {
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
        channel: SLACK_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchSlackRealtimeToken
    })

    return (
        <>
            <SlackDialog
                onSubmit={handleSubmit}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={'/slack.svg'}
                name={'Slack'}
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

SlackNode.displayName = "SlackNode";
