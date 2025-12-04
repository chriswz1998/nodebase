import {memo, useState} from "react";
import {NodeProps} from "@xyflow/react";
import {BaseTriggerNode} from "@/features/triggers/components/base-trigger-node";
import {useNodeStatus} from "@/features/executions/hooks/use-node-states";
import {StripeTriggerDialog} from "@/features/triggers/components/stripe-trigger/dialog";
import {fetchStripeRealtimeToken} from "@/features/triggers/components/stripe-trigger/actions";
import {STRIPE_TRIGGER_CHANNEL_NAME} from "@/inngest/channels/stripe-trigger";

export const StripeTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const handleOpenSettings = () => setDialogOpen(true)
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: STRIPE_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchStripeRealtimeToken
    })

    return (
        <>
            <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
            <BaseTriggerNode
                {...props}
                icon={'/stripe.svg'}
                name={"Stripe"}
                description={"When stripe event is captured"}
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})