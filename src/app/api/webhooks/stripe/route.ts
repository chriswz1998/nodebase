import {NextRequest, NextResponse} from "next/server";
import {sendWorkflowExecution} from "@/inngest/utils";

export async function POST(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const workflowId = url.searchParams.get('workflowId');

        if (!workflowId) {
            return NextResponse.json(
                {success: false, error: "Missing workflow id"},
                {status: 500}
            )
        }

        const body = await request.json();

        const stripeData = {
           eventId: body.id,
            eventType:body.type,
            timestamp: body.created,
            livemode: body.livemode,
            row: body.data?.object
        }

        await sendWorkflowExecution({
            workflowId,
            initialData: {
                stripe: stripeData,
            }
        })
        return NextResponse.json({ success: true }, {status: 200});
    }catch (error) {
        console.error('Stripe webhook error',error);
        return NextResponse.json(
            {success: false, error: "Failed to process Stripe submission"},
            {status: 500}
        )
    }
}