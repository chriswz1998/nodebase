import {NextRequest, NextResponse} from "next/server";
import {inngest} from "@/inngest/client";
import {next} from "effect/Cron";
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

        const formData = {
            formId: body.formId,
            formTitle: body.formTitle,
            responseId: body.responseId,
            timestamp: body.timestamp,
            respondentEmail: body.respondentEmail,
            responses: body.responses,
            row: body
        }

        await sendWorkflowExecution({
            workflowId,
            initialData: {
                googleForm: formData,
            }
        })
        // return NextResponse.json({ success: true });
    }catch (error) {
        console.error('Google form webhook error',error);
        return NextResponse.json(
            {success: false, error: "Failed to process Google Form submission"},
            {status: 500}
        )
    }
}