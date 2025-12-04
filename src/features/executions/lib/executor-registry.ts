import {NodeType} from "@/generated/prisma/enums";
import {NodeExecutor} from "@/features/executions/types";
import {manualTriggerExecutor} from "@/features/triggers/components/manual-trigger/executor";
import {httpRequestExecutor} from "@/features/executions/components/http-request/executor";
import {googleFormExecutor} from "@/features/triggers/components/google-form-trigger/executor";
import {StripeTriggerExecutor} from "@/features/triggers/components/stripe-trigger/executor";
import {GeminiExecutor} from "@/features/executions/components/gemini/executor";
import {OpenAIExecutor} from "@/features/executions/components/openai/executor";


export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: googleFormExecutor,
    [NodeType.STRIPE_TRIGGER]: StripeTriggerExecutor,
    [NodeType.GEMINI]: GeminiExecutor,
    [NodeType.OPENAI]: OpenAIExecutor
}

export const getExecutor = (type: NodeType): NodeExecutor => {
    const executor = executorRegistry[type];
    if (!executor) {
        throw new Error(`No executor found for node type: ${type}`);
    }

    return executor;
}