'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";


const formSchema = z.object({
    variableName: z.string()
        .min(1, {message: "Variable Name is required"})
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
            message: "Variable name must start with a letter or underscore and container only letters, numbers, and underscores"
        }),
    content: z
        .string()
        .min(1, 'Message content is required')
        .max(2000, 'Slack message content exceed 2000 characters'),
    webhookUrl: z.string().min(1, {message: "Webhook URL is required"})
})

export type SlackFormValues = z.infer<typeof formSchema>

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (value: SlackFormValues) => void
    defaultValues?: Partial<SlackFormValues>
}

export const SlackDialog = ({
                                      open,
                                      onOpenChange,
                                      onSubmit,
                                      defaultValues = {}
}: Props) => {

    const form = useForm<SlackFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues?.variableName || "",
            content: defaultValues?.content || "",
            webhookUrl: defaultValues?.webhookUrl || ""
        },
    })

    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues?.variableName || "",
                content: defaultValues?.content || "",
                webhookUrl: defaultValues?.webhookUrl || ""
            })
        }
    }, [open, defaultValues, form])

    const watchVariableName = form.watch("variableName") || "Slack"

    const handleSubmit = (values: SlackFormValues) => {
        onSubmit(values)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Slack Configuration</DialogTitle>
                    <DialogDescription>
                       Configure the Slack webhook settings for this node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-4">
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variable Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={'Slack'}/>
                                    </FormControl>
                                    <FormDescription>
                                        Use this name to reference the result in other nodes: {" "}
                                        {`{{${watchVariableName}.text}}`}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="webhookUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Webhook URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://slack.com/api/webhooks/..." {...field}/>
                                    </FormControl>
                                    <FormDescription>
                                        Get this from Slack: Channel Setting, Integrations, Webhooks
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className={'min-h-[80px] text-sm'}
                                            {...field}
                                            placeholder='Summary: {{Gemini.text}}'/>
                                    </FormControl>
                                    <FormDescription>
                                        The message to send. Use variables for simple values or to stringify objects.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className={'mt-4'}>
                            <Button type={'submit'}>Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}