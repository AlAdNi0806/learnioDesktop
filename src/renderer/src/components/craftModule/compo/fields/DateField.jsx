import { CalendarDays, Type } from 'lucide-react'
import { Label } from '../../../ui/label';
import { Input } from '../../../ui/input';
import { z } from 'zod'
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useDesigner from '../../../hooks/useDesigner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../../ui/form';
import { Switch } from '../../../ui/switch';
import { cn } from '../../../../lib/utils';
import { Button } from '../../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover';
import { format } from 'date-fns';
import { Calendar } from '../../../ui/calendar';

const type = "DateField";

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),
})

export const DateFieldFormElement = {
    type,
    construct: (id) => ({
        id,
        type,
        extraAttributes: {
            label: "Date field",
            helperText: "Pick a date",
            required: false,
        }
    }),
    designerBtnElement: {
        icon: CalendarDays,
        label: "Date Field"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: (formElement, currentValue) => {
        const element = formElement
        if (element.extraAttributes.required) {
            return currentValue.length > 0
        }
        return true
    }
}

function FormComponent({
    elementInstance,
    submitValue,
    isInvalid,
    defaultValue
}) {
    const element = elementInstance

    const [date, setDate] = useState(defaultValue ? new Date(defaultValue) : undefined)
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(isInvalid === true)
    }, [isInvalid])

    const { label, required, placeholder, helperText } = element.extraAttributes
    return (
        <div className='text-white flex flex-col gap-2 w-full'>
            <Label
                className={cn(
                    error && "text-red-500"
                )}
            >
                {label}
                {required && "*"}
            </Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !date && "text-muted-foreground",
                            error && 'border-red-500'
                        )}
                    >
                        <CalendarDays className='mr-2 h-4 w-4' />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        {/* <span>Pick a date</span> */}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 " align="start">
                    <Calendar
                        mode='single'
                        selected={date}
                        onSelect={(date) => {
                            setDate(date);
                            if(!submitValue) return
                            const value = date?.toUTCString() || "";
                            const valid = DateFieldFormElement.validate(element, value)
                            setError(!valid)
                            submitValue(element.id, value)
                        }}
                        initialFocus
                    >

                    </Calendar>
                </PopoverContent>
            </Popover>
            {helperText && (
                <p
                    className={cn(
                        'text-muted-foreground text-[0.8rem]',
                        error && "text-red-500"
                    )}
                >
                    {helperText}
                </p>
            )}
        </div>
    )
}

function PropertiesComponent({
    elementInstance
}) {

    const element = elementInstance

    const { updateElement } = useDesigner()

    const form = useForm({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            label: element.extraAttributes.label,
            helperText: element.extraAttributes.helperText,
            required: element.extraAttributes.required,
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes)
    }, [element, form])

    function applyChanges(values) {
        const { label, helperText, required } = values
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                label,
                helperText,
                required
            }
        })
    }

    return (
        <Form {...form}>
            <form
                onBlur={form.handleSubmit(applyChanges)}
                className='space-y-3'
                onSubmit={e => {
                    e.preventDefault()
                }}
            >
                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Label
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="bg-slate-950 text-white"
                                    onKeyDown={e => {
                                        if (e.key === "Enter") {
                                            e.currentTarget.blur()
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The label of the field. <br /> It will be displayed above the field
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="helperText"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Helper Text
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="bg-slate-950 text-white"
                                    onKeyDown={e => {
                                        if (e.key === "Enter") {
                                            e.currentTarget.blur()
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The helper text of the field. <br /> It will be displayed below the field
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="required"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Required</FormLabel>
                                <FormDescription>
                                    The helper text of the field. <br />
                                    It will be displayed below the field.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

function DesignerComponent({
    elementInstance
}) {
    const element = elementInstance
    const { label, required, placeholder, helperText } = element.extraAttributes
    // console.log(required)
    return (
        <div className='text-white flex flex-col gap-2 w-full'>
            <Label>
                {label}
                {required && "*"}
            </Label>
            <Button
                variant={'outline'}
                className='w-full justify-start text-left font-normal bg-transparent'
            >
                <CalendarDays className='mr-2 h-4 w-4' />
                <span>Pick a date</span>
            </Button>
            {helperText && (
                <p className='text-muted-foreground text-[0.8rem]'>
                    {helperText}
                </p>
            )}
        </div>
    )
}