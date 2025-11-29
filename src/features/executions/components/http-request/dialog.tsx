'use client'

import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger,
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";

const formSchema = z.object({
    endpoint: z.url({message: "Please enter a valid URL"}),
    method: z.enum(['POST', 'PUT', 'DELETE', 'PATCH', "GET"]),
    body: z.string().optional()
})

export type FormType = z.infer<typeof formSchema>

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (value: FormType) => void
    defaultEndpoint?: string
    defaultMethod?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH'
    defaultBody?: string
}

export const HttpRequestDialog = ({
                                      open,
                                      onOpenChange,
                                      onSubmit,
                                      defaultEndpoint="",
                                      defaultMethod="GET",
                                      defaultBody=""
}: Props) => {
    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            endpoint: defaultEndpoint,
            method: defaultMethod,
            body: defaultBody
        },
    })

    useEffect(() => {
        if (open) {
            form.reset({
                endpoint: defaultEndpoint,
                method: defaultMethod,
                body: defaultBody
            })
        }
    }, [open, defaultEndpoint, defaultMethod, defaultBody, form])

    const watchMethod = form.watch("method")
    const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod)

    const handleSubmit = (values: FormType) => {
        console.log(1213123)
        onSubmit(values)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Http Request</DialogTitle>
                    <DialogDescription>
                       Configure settings for the Http Request node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-4">
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Method</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The HTTP method tp use for this request.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endpoint URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={'https://example.com/{{httpResponse.data.id}}'}/>
                                    </FormControl>
                                    <FormDescription>
                                        Static URL or use {"{{variable}}"} for simple values or {"{{json variable}}"} tp stringify objects
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {showBodyField && (
                            <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Request Body</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className={'min-h-[120px] font-mono text-sm'}
                                                {...field}
                                                placeholder={`{
                                                                  "userId": "{{httpResponse.data.id}}",
                                                                  "name": "{{httpResponse.data.name}}",
                                                                  "items": "{{httpResponse.data.items}}"
                                                                  }`}/>
                                        </FormControl>
                                        <FormDescription>
                                            JSON with template variable. Use {"{{variable}}"} for simple values or {"{{json variable}}"} tp stringify objects
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <DialogFooter className={'mt-4'}>
                            <Button type={'submit'}>Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}