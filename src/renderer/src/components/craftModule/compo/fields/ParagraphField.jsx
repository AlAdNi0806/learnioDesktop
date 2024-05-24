import { CaseLower, Heading1, LucideType, Type } from 'lucide-react'
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
import { Textarea } from '../../../ui/textarea';

const type = "ParagraphField";

const propertiesSchema = z.object({
    text: z.string().min(2).max(5000),
})

export const ParagraphFieldFormElement = {
    type,
    construct: (id) => ({
        id,
        type,
        extraAttributes: {
            text: "Text here",
        }
    }),
    designerBtnElement: {
        icon: CaseLower,
        label: "Paragraph Field"
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

    const { text } = element.extraAttributes

    return (
        <pre className="text-slate-400 whitespace-pre-wrap">{text}</pre>
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
            text: element.extraAttributes.text,
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes)
    }, [element, form])

    function applyChanges(values) {
        const { text } = values;
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                text,
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
                    name="text"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Paragraph Text</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={25}                                    {...field}
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
    const { text } = element.extraAttributes
    // console.log(required)
    return (
        <div className='text-white flex flex-col gap-2 w-full'>
            <div className="flex flex-col gap-2 w-full">
                <Label className="text-muted-foreground">Paragraph field</Label>
                <p className=' truncate'>{text}</p>
            </div>
        </div>
    )
}