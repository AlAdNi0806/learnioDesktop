import { Heading1, Type } from 'lucide-react'
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

const type = "TitleField";

const propertiesSchema = z.object({
    title: z.string().min(2).max(50),
})

export const TitleFieldFormElement = {
    type,
    construct: (id) => ({
        id,
        type,
        extraAttributes: {
            title: "Title field",
        }
    }),
    designerBtnElement: {
        icon: Heading1,
        label: "Title Field"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: () => true,
}

function FormComponent({
    elementInstance,
}) {
    const element = elementInstance

    const { title } = element.extraAttributes

    return (
        <p className='text-xl'>
            {title}
        </p>
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
            title: element.extraAttributes.title,
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes)
    }, [element, form])

    function applyChanges(values) {
        const { title } = values;
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                title,
            },
        });
    }

    return (
        <Form {...form}>
            <form
                onBlur={form.handleSubmit(applyChanges)}
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                className="space-y-3"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") e.currentTarget.blur();
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}

function DesignerComponent({
    elementInstance
}) {
    const element = elementInstance
    const { title } = element.extraAttributes
    // console.log(required)
    return (
        <div className='text-white flex flex-col gap-2 w-full'>
            <div className="flex flex-col gap-2 w-full">
                <Label className="text-muted-foreground">Title field</Label>
                <p className="text-xl">{title}</p>
            </div>
        </div>
    )
}