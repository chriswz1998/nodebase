import {NodeExecutor} from "@/features/executions/types";

type HttpRequestData = Record<string, unknown>

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
    nodeId,
    context,
    step
}) => {
    const result = await step.run('http-request', async () => context)

    return result
}