import { Type } from 'lucide-react'
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
import { IoMdCheckbox } from "react-icons/io";
import { Checkbox } from '../../../ui/checkbox';

const type = "CheckboxField";

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),
})

export const CheckboxFieldFormElement = {
    type,
    construct: (id) => ({
        id,
        type,
        extraAttributes: {
            label: "Checkbox field",
            helperText: "Helper Text",
            required: false,
        }
    }),
    designerBtnElement: {
        icon: IoMdCheckbox,
        label: "Checkbox Field"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: (formElement, currentValue) => {
        const element = formElement
        if (element.extraAttributes.required) {
            return currentValue === "true"
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

    const [value, setValue] = useState(defaultValue === 'true' ? true : false)
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(isInvalid === true)
    }, [isInvalid])

    const { label, required, placeholder, helperText } = element.extraAttributes
    const id = `checkbox=${element.id}`
    // console.log(required)
    return (
        <div className='text-white flex items-top space-x-2'>
            <Checkbox
                id={id}
                checked={value}
                className={cn(
                    'border-white',
                    error && 'border-red-500',
                )}
                onCheckedChange={(checked) => {
                    let value = false;
                    if (checked === true) value = true
                    setValue(value)
                    if (!submitValue) return;
                    const stringValue = value ? "true" : "false"
                    const valid = CheckboxFieldFormElement.validate(
                        element,
                        stringValue
                    )
                    setError(!valid)
                    submitValue(element.id, stringValue)
                }}
            />
            <div className='grid gap-1.5 leading-none'>
                <Label
                    htmlFor={id}
                    className={cn(
                        error && 'text-red-500',
                    )}
                >
                    {label}
                    {required && "*"}
                </Label>
                {helperText && (
                    <p
                        className={cn(
                            'text-muted-foreground text-[0.8rem]',
                            error && 'text-red-500',
                        )}
                    >
                        {helperText}
                    </p>
                )}
            </div>
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
    const { label, required, helperText } = element.extraAttributes
    const id = `checkbox=${element.id}`
    // console.log(required)
    return (
        <div className='text-white flex items-top space-x-2'>
            <Checkbox id={id} className='border-white'/>
            <div className='grid gap-1.5 leading-none'>
                <Label htmlFor={id}>
                    {label}
                    {required && "*"}
                </Label>
                {helperText && (
                    <p className='text-muted-foreground text-[0.8rem]'>
                        {helperText}
                    </p>
                )}
            </div>
        </div>
    )
}