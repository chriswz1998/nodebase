'use client'

import {
    EmptyView,
    EntityContainer,
    EntityHeader, EntityItem, EntityList,
    EntityPagination,
    EntitySearch, ErrorView,
    LoadingView
} from "@/components/entity-components";
import {ReactNode} from "react";

import {useRouter} from "next/navigation";
import {useEntitySearch} from "@/hooks/use-entity-search";
import {formatDistanceToNow} from "date-fns";
import {useCredentialsParams} from "@/features/credentials/hooks/use-credentials-params";
import {
    useRemoveCredential,
    useSuspenseCredentials
} from "@/features/credentials/hooks/use-credentials";
import Image from "next/image";
import {Credentialtype} from "@/generated/prisma/enums";

export const CredentialsSearch = () => {
    const [params, setParams] = useCredentialsParams()
    const {searchValue, onSearchChange} = useEntitySearch({params,setParams})

    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder={'Search Credentials'}
        />
    )
}

export const CredentialsList = () => {
    const credentials = useSuspenseCredentials()

    return (
       <EntityList
           items={credentials.data.items}
           getKey={(credential) => credential.id}
           renderItem={(credential) => <CredentialItem data={credential}/>}
           emptyView={<CredentialsEmpty />}
       />
    )
}

export const CredentialsHeader = ({disabled}: {disabled?: boolean}) => {
    return (
        <EntityHeader
            title={'Credentials'}
            description={'Creating and manage your Credentials'}
            newButtonLabel={"New Credential"}
            disable={disabled}
            newButtonHref={'credentials/new'}
        />
    )
}

export const CredentialsPagination = () => {
    const [params, setParams] = useCredentialsParams()
    const credentials = useSuspenseCredentials()

    return (
        <EntityPagination
            disable={credentials.isFetching}
            page={credentials.data.page}
            totalPages={credentials.data.totalPages}
            onPageChange={(page) => setParams({...params,page})}
        />
    )
}

export const CredentialsContainer = ({children}: {children: ReactNode}) => {
    return (
        <EntityContainer
            header={<CredentialsHeader/>}
            search={<CredentialsSearch/>}
            pagination={<CredentialsPagination/>}
        >
            {children}
        </EntityContainer>
    )
}

export const CredentialsLoading = () => {
    return (
        <LoadingView message={'Loading Credentials...'}/>
    )
}

export const CredentialsError = () => {
    return (
        <ErrorView message={'Error loading Credentials'}/>
    )
}

export const CredentialsEmpty = () => {
    const router = useRouter()

    const handleCreate = () => {
        router.push(`credentials/new`)
    }

    return (
        <EmptyView
            onNew={handleCreate}
            message={'You haven&apos;t created any Credentials yet. Get started by creating your first project.'}
        />
    )
}

const credentialLogos: Record<Credentialtype, string> = {
    [Credentialtype.GEMINI]: '/gemini.svg',
    [Credentialtype.OPENAI]: '/openai.svg'
}

export const CredentialItem = (
    {data}: { data: {id: string, name: string, type: Credentialtype, value: string, updatedAt: Date, createdAt: Date} }
) => {
    const removeCredential =useRemoveCredential()

    const handleRemove = () => {
        removeCredential.mutate({id: data.id})
    }

    const logo = credentialLogos[data.type] || '/gemini.svg'

    return (
        <EntityItem
            href={`credentials/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    Updated {formatDistanceToNow(data.updatedAt, {addSuffix: true})}{" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(data.createdAt, {addSuffix: true})}
                </>
            }
            image={
                <div className={'size-8 flex items-center justify-center'}>
                    <Image src={logo} alt={data.type} width={20} height={20}/>
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeCredential.isPending}
        />
    )
}
