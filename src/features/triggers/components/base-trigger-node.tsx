'use client'

import {LucideIcon} from "lucide-react";
import React from "react";
import {NodeProps, Position, useReactFlow} from "@xyflow/react";
import {WorkflowNode} from "@/components/workflow-node";
import {BaseNode, BaseNodeContent} from "@/components/react-flow/base-node";
import Image from "next/image";
import {BaseHandle} from "@/components/react-flow/base-handle";
import {NodeStatus, NodeStatusIndicator} from "@/components/react-flow/node-status-indicator";

interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string
    name: string
    description?: string
    children?: React.ReactNode
    status?: NodeStatus
    onSettings?: () => void
    onDoubleClick?: () => void
}

export const BaseTriggerNode = (
    {
        id,
        icon: Icon,
        name,
        description,
        children,
        status = 'initial',
        onSettings,
        onDoubleClick
    }: BaseTriggerNodeProps) => {
    const {setNodes, setEdges} = useReactFlow()

    const handleDelete = () => {
        setNodes((currentNodes) => {
            return currentNodes.filter((node) => node.id !== id)
        })

        setEdges((currentEdges) => {
            return currentEdges.filter((edge) => edge.source !== id && edge.target !== id)
        })
    }

    return (
        <WorkflowNode
            name={name}
            description={description}
            onDelete={handleDelete}
            onSetting={onSettings}
        >
            <NodeStatusIndicator
                status={status}
                variant="border"
                className={'rounded-xs'}
            >
                <BaseNode status={status} onDoubleClick={onDoubleClick} className={'rounded-xs relative group'}>
                    <BaseNodeContent>
                        {
                            typeof Icon === "string" ?(
                                <Image src={Icon} alt={name} width={16} height={16} />
                            ) : <Icon className={'size-4 text-muted-foreground'}/>
                        }
                        {children}
                        <BaseHandle
                            type={'source'}
                            id={'source-1'}
                            position={Position.Right}
                        />
                    </BaseNodeContent>
                </BaseNode>
            </NodeStatusIndicator>
        </WorkflowNode>
    )
}

BaseTriggerNode.displayName = "BaseTriggerNode";