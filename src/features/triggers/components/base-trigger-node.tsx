'use client'

import {LucideIcon} from "lucide-react";
import React from "react";
import {NodeProps, Position} from "@xyflow/react";
import {WorkflowNode} from "@/components/workflow-node";
import {BaseNode, BaseNodeContent} from "@/components/react-flow/base-node";
import Image from "next/image";
import {BaseHandle} from "@/components/react-flow/base-handle";

interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string
    name: string
    description?: string
    children?: React.ReactNode
    // status?: NodeStatus
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
        onSettings,
        onDoubleClick
    }: BaseTriggerNodeProps) => {
    const handleDelete = () => {}

    return (
        <WorkflowNode
            name={name}
            description={description}
            onDelete={handleDelete}
            onSetting={onSettings}
        >
            <BaseNode onDoubleClick={onDoubleClick} className={'rounded-r-none rounded-l-2xl relative group'}>
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
        </WorkflowNode>
    )
}

BaseTriggerNode.displayName = "BaseTriggerNode";