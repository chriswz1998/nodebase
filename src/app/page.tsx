'use client'

import {requireAuth} from "@/lib/auth-utils";
import {caller} from "@/trpc/server";
import {LogoutButton} from "@/app/logout";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";

const Page = () => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const {data} = useQuery(trpc.getWorkflows.queryOptions())

    const testAi = useMutation(trpc.testAi.mutationOptions(
        {
            onSuccess:() => {
                toast.success('Ai Job queued successfully.');
            }
        }
    ))

    const create = useMutation(trpc.createWorkflow.mutationOptions({
        onSuccess:() => {
            toast.success('Job queued successfully.');
        }
    }))
  return (
      <div className="min-h-screen min-w-screen flex items-center justify-center">
          protected page {JSON.stringify(data)}
          <LogoutButton/>
          <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>Ai</Button>
          <Button disabled={create.isPending} onClick={() => create.mutate()}>create</Button>
      </div>
  );
}

export default Page;
