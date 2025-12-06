import {useTRPC} from "@/trpc/client";
import {useMutation, useQuery, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {toast} from "sonner";
import {useCredentialsParams} from "@/features/credentials/hooks/use-credentials-params";
import {Credentialtype} from "@/generated/prisma/enums";

export const useSuspenseCredentials = () => {
    const trpc = useTRPC()
    const [params] = useCredentialsParams()

    return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params))
}

export const useCreateCredential = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.credentials.create.mutationOptions({
            onSuccess: async (data) => {
                toast.success(`Credential ${data.name} created successfully.`)
                await queryClient.invalidateQueries(
                    trpc.credentials.getMany.queryOptions({})
                )
            },
            onError: (error) => {
                toast.error(`Failed to create Credential ${error.message}`)
            }
        })
    )
}

export const useRemoveCredential = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.credentials.remove.mutationOptions({
            onSuccess: async (data) => {
                toast.success(`Credential ${data.name} removed successfully.`)
                await queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}))
                await queryClient.invalidateQueries(trpc.credentials.getOne.queryFilter({id: data.id}))
            }
        })
    )
}

export const useSuspenseCredential = (id: string) => {
    const trpc = useTRPC()

    return useSuspenseQuery(trpc.credentials.getOne.queryOptions({id}))
}

export const useUpdateCredential = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.credentials.update.mutationOptions({
            onSuccess: async (data) => {
                toast.success(`Credential ${data.name} saved successfully.`)
                await queryClient.invalidateQueries(
                    trpc.credentials.getMany.queryOptions({})
                )
                await queryClient.invalidateQueries(
                    trpc.credentials.getOne.queryOptions({id: data.id})
                )
            },
            onError: (error) => {
                toast.error(`Failed to dave Credential ${error.message}`)
            }
        })
    )
}

export const useCredentialsByType = (type: Credentialtype) => {
    const trpc = useTRPC()
    return useQuery(trpc.credentials.getByType.queryOptions({type}))
}