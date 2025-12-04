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
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, {message: "User Prompt is required"})
})

export type GeminiFormValues = z.infer<typeof formSchema>

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (value: GeminiFormValues) => void
    defaultValues?: Partial<GeminiFormValues>
}

export const GeminiDialog = ({
                                      open,
                                      onOpenChange,
                                      onSubmit,
                                      defaultValues = {}
}: Props) => {
    const form = useForm<GeminiFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues?.variableName || "",
            systemPrompt: defaultValues?.systemPrompt || "",
            userPrompt: defaultValues?.userPrompt || ""
        },
    })

    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues?.variableName || "",
                systemPrompt: defaultValues?.systemPrompt || "",
                userPrompt: defaultValues?.userPrompt || ""
            })
        }
    }, [open, defaultValues, form])

    const watchVariableName = form.watch("variableName") || "Gemini"

    const handleSubmit = (values: GeminiFormValues) => {
        onSubmit(values)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Gemini Configuration</DialogTitle>
                    <DialogDescription>
                       Configure the AT model and prompts for this node.
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
                                        <Input {...field} placeholder={'Gemini'}/>
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
                            name="systemPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>System Prompt (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className={'min-h-[80px] text-sm'}
                                            {...field}
                                            placeholder={'You are a helpful assistant'}/>
                                    </FormControl>
                                    <FormDescription>
                                        Sets the behavior of the assistant. Use {"{{variables}}"} for simple values
                                        or {"{{json variable}}"} to stringify objects
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="userPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className={'min-h-[120px] text-sm'}
                                            {...field}
                                            placeholder={'Summary this text: {{json httpRequest.data}}'}/>
                                    </FormControl>
                                    <FormDescription>
                                       The prompt to send to AI. Use {"{{variables}}"} for simple values
                                        or {"{{json variable}}"} to stringify objects
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