import {memo, useState} from "react";
import {NodeProps} from "@xyflow/react";
import {BaseTriggerNode} from "@/features/triggers/components/base-trigger-node";
import {GoogleFormTriggerDialog} from "@/features/triggers/components/google-form-trigger/dialog";
import {useNodeStatus} from "@/features/executions/hooks/use-node-states";
import {GOOGLE_FORM_TRIGGER_CHANNEL_NAME} from "@/inngest/channels/google-form-trigger";
import {fetchGoogleFormRealtimeToken} from "@/features/triggers/components/google-form-trigger/actions";

export const GoogleFormTrigger = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const handleOpenSettings = () => setDialogOpen(true)
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGoogleFormRealtimeToken
    })

    return (
        <>
            <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
            <BaseTriggerNode
                {...props}
                icon={'/googleform.svg'}
                name={"Google Form"}
                description={"When form is submitted"}
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})