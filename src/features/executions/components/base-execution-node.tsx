'use client'

import {LucideIcon} from "lucide-react";
import React from "react";
import {NodeProps, Position} from "@xyflow/react";
import {WorkflowNode} from "@/components/workflow-node";
import {BaseNode, BaseNodeContent} from "@/components/react-flow/base-node";
import Image from "next/image";
import {BaseHandle} from "@/components/react-flow/base-handle";

interface BaseExecutionNodeProps extends NodeProps {
    icon: LucideIcon | string
    name: string
    description?: string
    children?: React.ReactNode
    // status?: NodeStatus
    onSettings?: () => void
    onDoubleClick?: () => void
}

export const BaseExecutionNode = (
    {
        id,
        icon: Icon,
        name,
        description,
        children,
        onSettings,
        onDoubleClick
    }: BaseExecutionNodeProps) => {
    const handleDelete = () => {}

    return (
        <WorkflowNode
            name={name}
            description={description}
            onDelete={handleDelete}
            onSetting={onSettings}
        >
            <BaseNode onDoubleClick={onDoubleClick}>
                <BaseNodeContent>
                    {
                        typeof Icon === "string" ?(
                            <Image src={Icon} alt={name} width={16} height={16} />
                        ) : <Icon className={'size-4 text-muted-foreground'}/>
                    }
                    {children}
                    <BaseHandle
                        type={'target'}
                        id={'target-1'}
                        position={Position.Left}
                    />
                    <BaseHandle
                        type={'source'}
                        id={'source-1'}
                        position={Position.Right}
                    />
                </BaseNodeContent>
            </BaseNode>
        </WorkflowNode>
    )
}

BaseExecutionNode.displayName = "BaseExecutionNode";