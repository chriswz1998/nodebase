import {memo, useState} from "react";
import {NodeProps} from "@xyflow/react";
import {BaseTriggerNode} from "@/features/triggers/components/base-trigger-node";
import {MousePointerIcon} from "lucide-react";
import {ManualTriggerDialog} from "@/features/triggers/components/manual-trigger/dialog";
import {useNodeStatus} from "@/features/executions/hooks/use-node-states";
import {MANUAL_TRIGGER_CHANNEL_NAME} from "@/inngest/channels/manual-trigger";
import {fetchManualTriggerRealtimeToken} from "@/features/triggers/components/manual-trigger/actions";

export const ManualTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const handleOpenSettings = () => setDialogOpen(true)
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: MANUAL_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchManualTriggerRealtimeToken
    })

    return (
        <>
            <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
            <BaseTriggerNode
                {...props}
                icon={MousePointerIcon}
                name={"When clicking 'Execute workflow'"}
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})