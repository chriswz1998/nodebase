'use client'

import {useCreateWorkflow, useSuspenseWorkflows} from "@/features/workflows/hooks/use-workflows";
import {EntityContainer, EntityHeader, EntityPagination, EntitySearch} from "@/components/entity-components";
import {ReactNode} from "react";
import {Workflow} from "@/generated/prisma/client";
import {useUpgradeModal} from "@/hooks/use-upgrade-modal";
import {useRouter} from "next/navigation";
import {useWorkflowsParams} from "@/features/workflows/hooks/use-workflows-params";
import {useEntitySearch} from "@/hooks/use-entity-search";

export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParams()
    const {searchValue, onSearchChange} = useEntitySearch({params,setParams})

    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder={'Search workflows'}
        />
    )
}

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows()

    return (
        <div className={'flex-1 flex items-center justify-center'}>
            <p>{JSON.stringify(workflows.data, null, 2)}</p>
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

export const WorkflowsPagination = () => {
    const [params, setParams] = useWorkflowsParams()
    const workflows = useSuspenseWorkflows()

    return (
        <EntityPagination
            disable={workflows.isFetching}
            page={workflows.data.page}
            totalPages={workflows.data.totalPages}
            onPageChange={(page) => setParams({...params,page})}
        />
    )
}

export const WorkflowsContainer = ({children}: {children: ReactNode}) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader/>}
            search={<WorkflowsSearch/>}
            pagination={<WorkflowsPagination/>}
        >
            {children}
        </EntityContainer>
    )
}