import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {toast} from "sonner";
import {useWorkflowsParams} from "@/features/workflows/hooks/use-workflows-params";
import {prefetchWorkflow} from "@/features/workflows/server/prefetch";

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC()
    const [params] = useWorkflowsParams()

    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params))
}

export const useCreateWorkflow = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.workflows.create.mutationOptions({
            onSuccess: async (data) => {
                toast.success(`Workflow ${data.name} created successfully.`)
                await queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({})
                )
            },
            onError: (error) => {
                toast.error(`Failed to create workflow ${error.message}`)
            }
        })
    )
}

export const useRemoveWorkflow = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.workflows.remove.mutationOptions({
            onSuccess: async (data) => {
                toast.success(`Workflow ${data.name} removed successfully.`)
                await queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
                await queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({id: data.id}))
            }
        })
    )
}

export const useSuspenseWorkflow = (id: string) => {
    const trpc = useTRPC()

    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({id}))
}

export const useUpdateWorkflowName = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.workflows.updateName.mutationOptions({
            onSuccess: async (data) => {
                toast.success(`Workflow ${data.name} updated successfully.`)
                await queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({})
                )
                await queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryOptions({id: data.id})
                )
            },
            onError: (error) => {
                toast.error(`Failed to update workflow ${error.message}`)
            }
        })
    )
}

export const useUpdateWorkflow = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.workflows.update.mutationOptions({
            onSuccess: async (data) => {
                toast.success(`Workflow ${data.name} saved successfully.`)
                await queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({})
                )
                await queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryOptions({id: data.id})
                )
            },
            onError: (error) => {
                toast.error(`Failed to dave workflow ${error.message}`)
            }
        })
    )
}