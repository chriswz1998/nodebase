'use client'

import {useCreateWorkflow, useSuspenseWorkflows} from "@/features/workflows/hooks/use-workflows";
import {EntityContainer, EntityHeader} from "@/components/entity-components";
import {ReactNode} from "react";
import {Workflow} from "@/generated/prisma/client";
import {useUpgradeModal} from "@/hooks/use-upgrade-modal";
import {useRouter} from "next/navigation";

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows()

    return (
        <div className={'flex-1 flex justify-center items-center'}>
            <p>{JSON.stringify(workflows.data)}</p>
        </div>
    )
}

export const WorkflowsHeader = ({disabled}: {disabled?: boolean}) => {
    const createWorkflow =useCreateWorkflow()
    const {modal, handleError} = useUpgradeModal()
    const router = useRouter()

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`workflows/${data.id}`)
            },
            onError: (error) => {
                handleError(error)
            }
        })
    }

    return (
        <>
            {modal}
            <EntityHeader
                title={'Workflows'}
                description={'Creating and manage your workflows'}
                onNew={handleCreate}
                newButtonLabel={"New workflow"}
                disable={disabled}
                isCreating={createWorkflow.isPending}
            />
        </>
    )
}

export const WorkflowsContainer = ({children}: {children: ReactNode}) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader/>}
            search={<></>}
            pagination={<></>}
        >
            {children}
        </EntityContainer>
    )
}