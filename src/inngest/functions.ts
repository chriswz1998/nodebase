import { inngest } from "./client";
import * as Sentry from "@sentry/nextjs";
import {createGoogleGenerativeAI} from "@ai-sdk/google";
import {generateText} from "ai";
import {createOpenAI} from "@ai-sdk/openai";

const google = createGoogleGenerativeAI()
const openai = createOpenAI()

export const execute = inngest.createFunction(
    { id: "execute-ai" },
    { event: "execute/ai" },
    async ({ event, step }) => {
        console.error("execute", event, step);
        Sentry.logger.info('User triggered test log', { log_source: 'sentry_test' })
        const {steps: geminiSteps} = await step.ai.wrap("gemini-generate-text", generateText, {
            model: google('gemini-2.5-flash'),
            system: "You are a helpful assistant",
            prompt: "what is 2 + 2?",
            experimental_telemetry: {
                isEnabled: true,
                recordInputs: true,
                recordOutputs: true,
            }
        })
        const {steps: openaiSteps} = await step.ai.wrap("openai-generate-text", generateText, {
            model: openai('gpt-5-mini'),
            system: "You are a helpful assistant",
            prompt: "what is 2 + 2?",
            experimental_telemetry: {
                isEnabled: true,
                recordInputs: true,
                recordOutputs: true,
            }
        })
        return step;
    },
);