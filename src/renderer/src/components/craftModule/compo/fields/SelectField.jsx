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
import { RxDropdownMenu } from "react-icons/rx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Separator } from '../../../ui/separator';
import { Button } from '../../../ui/button';
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";

const type = "SelectField";

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),
    placeholder: z.string().max(50),
    options: z.array(z.string()).default([])
})

export const SelectFieldFormElement = {
    type,
    construct: (id) => ({
        id,
        type,
        extraAttributes: {
            label: "Select field",
            helperText: "Helper Text",
            required: false,
            placeholder: "Value here...",
            options: []
        }
    }),
    designerBtnElement: {
        icon: RxDropdownMenu,
        label: "Select Field"
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
    defaultValue,
}) {
    const element = elementInstance;

    const [value, setValue] = useState(defaultValue || "");
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(isInvalid === true);
    }, [isInvalid]);

    const { label, required, placeHolder, helperText, options } = element.extraAttributes;
    console.log(options)
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className={cn(error && "text-red-500")}>
                {label}
                {required && "*"}
            </Label>
            <Select
                defaultValue={value}
                onValueChange={(value) => {
                    setValue(value);
                    if (!submitValue) return;
                    const valid = SelectFieldFormElement.validate(element, value);
                    setError(!valid);
                    submitValue(element.id, value);
                }}
            >
                <SelectTrigger className={cn("w-full", error && "border-red-500")}>
                    <SelectValue placeholder={placeHolder} />
                </SelectTrigger>
                <SelectContent>

                    {options.map((option) => (
                        <SelectItem key={option} value={option} className=" focus:bg-slate-800 focus:text-white cursor-pointer">
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {helperText && <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>{helperText}</p>}
        </div>
    );
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
            placeholder: element.extraAttributes.placeholder,
            options: element.extraAttributes.options
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes)
    }, [element, form])

    function applyChanges(values) {
        const { label, helperText, placeholder, options, required } = values
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                label,
                helperText,
                placeholder,
                required,
                options
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
                    name="placeholder"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                placeholder
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
                                The placeholder of the field. <br />
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
                <Separator />
                <FormField
                    control={form.control}
                    name="options"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel>Options</FormLabel>
                                <Button
                                    variant={"outline"}
                                    className="gap-2"
                                    onClick={(e) => {
                                        e.preventDefault(); // avoid submit
                                        form.setValue("options", field.value.concat("New option"));
                                    }}
                                >
                                    <AiOutlinePlus />
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-col gap-2">
                                {form.watch("options").map((option, index) => (
                                    <div key={index} className="flex items-center justify-between gap-1">
                                        <Input
                                            placeholder=""
                                            value={option}
                                            onChange={(e) => {
                                                field.value[index] = e.target.value;
                                                field.onChange(field.value);
                                            }}
                                        />
                                        <Button
                                            variant={"ghost"}
                                            size={"icon"}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const newOptions = [...field.value];
                                                newOptions.splice(index, 1);
                                                field.onChange(newOptions);
                                            }}
                                        >
                                            <AiOutlineClose />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <FormDescription>
                                The helper text of the field. <br />
                                It will be displayed below the field.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Separator />
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
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-white data-[state=unchecked]:bg-slate-700"
                                />
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
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
            </Select>
            {helperText && (
                <p className='text-muted-foreground text-[0.8rem]'>
                    {helperText}
                </p>
            )}
        </div>
    )
}