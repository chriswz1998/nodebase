import {useQuery} from "@tanstack/react-query";
import {authClient} from "@/lib/auth-client";

export const useSubscription = () => {
    return useQuery({
        queryKey: ['subscription'],
        queryFn: async () => {
            const {data} = await authClient.customer.state()
            return data
        }
    })
}

export const useHasActiveSubscription = () => {
    const {data: customState, isLoading, ...rest} = useSubscription()

    const hasActiveSubscription = customState?.activeSubscriptions && customState.activeSubscriptions.length > 0

    return {
        hasActiveSubscription,
        subscription: customState?.activeSubscriptions?.[0],
        isLoading,
        ...rest
    }
}