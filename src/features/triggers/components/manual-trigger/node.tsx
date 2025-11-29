import {memo, useState} from "react";
import {NodeProps} from "@xyflow/react";
import {BaseTriggerNode} from "@/features/triggers/components/base-trigger-node";
import {MousePointerIcon} from "lucide-react";
import {ManualTriggerDialog} from "@/features/triggers/components/manual-trigger/dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const handleOpenSettings = () => setDialogOpen(true)
    const status = 'initial'

    return (
        <>
            <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
            <BaseTriggerNode
                {...props}
                icon={MousePointerIcon}
                name={"When clicking 'Execute workflow'"}
                status={status}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})