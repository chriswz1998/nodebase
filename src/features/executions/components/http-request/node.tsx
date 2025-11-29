'use client'

import {Node, NodeProps, useReactFlow} from "@xyflow/react";
import {memo, useState} from "react";
import {BaseExecutionNode} from "@/features/executions/components/base-execution-node";
import {GlobeIcon} from "lucide-react";
import {FormType, HttpRequestDialog} from "@/features/executions/components/http-request/dialog";

type HttpRequestNodeData = {
    endpoint?: string
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    body?: string
    [key: string]: unknown
}

type HttpRequestNodeType = Node<HttpRequestNodeData>

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow()

    const handleOpenSettings = () => setDialogOpen(true)

    const handleSubmit = (value: FormType) => {
        setNodes((nodes) => nodes.map((node => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        endpoint: value.endpoint,
                        method: value.method,
                        body: value.body
                    }
                }
            }
            return node
        })))
    }

    const nodeData = props.data
    const description = nodeData?.endpoint
        ? `${nodeData.method || "GET"} : ${nodeData.endpoint}`
        : 'Not configured'

    const nodeStatus = 'initial'

    return (
        <>
            <HttpRequestDialog
                onSubmit={handleSubmit}
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
