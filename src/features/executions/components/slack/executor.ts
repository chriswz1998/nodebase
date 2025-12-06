import {NodeExecutor} from "@/features/executions/types";
import {NonRetriableError} from "inngest";
import Handlebars from 'handlebars'
import {discordChannel} from "@/inngest/channels/discord";
import {decode} from "html-entities";
import ky from "ky";
import {slackChannel} from "@/inngest/channels/slack";

Handlebars.registerHelper("json", (context) => {
    const stringified = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(stringified);
});

type SlackData = {
    variableName?: string;
    webhookUrl?: string;
    content?: string;
}

export const SlackExecutor: NodeExecutor<SlackData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
}) => {
    await publish(
        slackChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if (!data.webhookUrl) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })
        )

        throw new NonRetriableError("Slack node: webhookUrl is missing")
    }

    if (!data.content) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })
        )

        throw new NonRetriableError("Slack node: content is missing")
    }

    const rawContent = Handlebars.compile(data.content)(context)
    const content = decode(rawContent)

    try {
       const result = await step.run("slack-webhook", async () => {
           await ky.post(data.webhookUrl!, {
               json: {
                   content
               }
           })

           if (!data.variableName) {
               await publish(
                   slackChannel().status({
                       nodeId,
                       status: "error"
                   })
               )

               throw new NonRetriableError("Slack node: Variable Name is missing")
           }

           return {
               ...context,
               [data.variableName]: {
                  MessageContent: content.slice(0, 2000),
               }
           }
       })

        await publish(
            slackChannel().status({
                nodeId,
                status: "success"
            })
        )

        return result
    }catch (error) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })
        )

        throw error;
    }
}