import { inngest } from "./client";
import {NonRetriableError} from "inngest";
import prisma from "@/lib/db";
import {topoLogicalSort} from "@/inngest/utils";
import {NodeType} from "@/generated/prisma/enums";
import {getExecutor} from "@/features/executions/lib/executor-registry";
import {httpRequestChannel} from "@/inngest/channels/http-request";
import {manualTriggerChannel} from "@/inngest/channels/manual-trigger";
import {googleFormTriggerChannel} from "@/inngest/channels/google-form-trigger";
import {stripeTriggerChannel} from "@/inngest/channels/stripe-trigger";
import {geminiChannel} from "@/inngest/channels/gemini";
import {openAiChannel} from "@/inngest/channels/openai";
import {discordChannel} from "@/inngest/channels/discord";
import {slackChannel} from "@/inngest/channels/slack";

export const executeWorkflow = inngest.createFunction(
    { id: "execute-workflow", retries: 0},
    {
        event: "workflows/execute.workflow",
        channels: [
            httpRequestChannel(),
            manualTriggerChannel(),
            googleFormTriggerChannel(),
            stripeTriggerChannel(),
            geminiChannel(),
            openAiChannel(),
            discordChannel(),
            slackChannel
        ]
    },
    async ({ event, step, publish }) => {
        const workflowId = event.data.workflowId;

        if (!workflowId) {
            throw new NonRetriableError('Workflow ID is missing');
        }

        const sortedNodes = await step.run("prepare-workflow", async () => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: { id: workflowId },
                include: {
                    nodes: true,
                    connections: true
                }
            })

            return topoLogicalSort(workflow.nodes, workflow.connections)
        })

        const userId = await step.run("find-user-id", async () => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: { id: workflowId },
                select: {
                    userId: true
                }
            })

            return workflow.userId
        })

        let context = event.data.initialData || {}

        for (const node of sortedNodes) {
            const executor = getExecutor(node.type as NodeType)
            context = await executor({
                data: node.data as Record<string, unknown>,
                nodeId: node.id,
                context,
                step,
                publish,
                userId
            })
        }

        return {
            workflowId,
            result: context,
        }
    },
);