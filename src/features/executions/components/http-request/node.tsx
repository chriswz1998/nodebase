'use client'

import {Node, NodeProps} from "@xyflow/react";
import {memo, useState} from "react";
import {BaseExecutionNode} from "@/features/executions/components/base-execution-node";
import {GlobeIcon} from "lucide-react";
import {HttpRequestDialog} from "@/features/executions/components/http-request/dialog";

type HttpRequestNodeData = {
    endpoint?: string
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    body?: string
    [key: string]: unknown
}

type HttpRequestNodeType = Node<HttpRequestNodeData>

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleOpenSettings = () => setDialogOpen(true)

    const nodeData = props.data
    const description = nodeData?.endpoint ? `${nodeData.method || "GET"} : ${nodeData.endpoint}` : 'Not configured'

    const nodeStatus = 'initial'

    return (
        <>
            <HttpRequestDialog
                onSubmit={() => {}}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                defaultEndpoint={nodeData.endpoint}
                defaultMethod={nodeData.method}
                defaultBody={nodeData.body}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={GlobeIcon}
                name={'HTTP Request'}
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

HttpRequestNode.displayName = "HttpRequestNode";
