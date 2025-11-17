import {createTRPCRouter, protectedProcedure} from '../init';
import prisma from "@/lib/db";
import {inngest} from "@/inngest/client";

export const appRouter = createTRPCRouter({
    testAi: protectedProcedure.mutation(async () => {
        await inngest.send({
            name: 'execute/ai',
        })
        return {success: true, message: 'Job queued successfully.'};
    }),
    getWorkflows: protectedProcedure
        .query(({ctx}) => {
            return prisma.workflow.findMany()
        }),
    createWorkflow: protectedProcedure.mutation( async () => {
        await inngest.send({
            name: 'test/hello.world',
            data: {
                email: 'x@email.com'
            }
        })

        return {success: true, message: 'Job queued successfully.'};
    })
});
// export type definition of API
export type AppRouter = typeof appRouter;