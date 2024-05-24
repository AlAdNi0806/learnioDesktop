import { Heading1, SeparatorHorizontal, Type } from 'lucide-react'
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
import { Slider } from '../../../ui/slider';
import { Separator } from '../../../ui/separator';

const type = "SpacerField";

const propertiesSchema = z.object({
    height: z.number().min(5).max(200),
})

export const SpacerFieldFormElement = {
    type,
    construct: (id) => ({
        id,
        type,
        extraAttributes: {
            height: 20
        }
    }),
    designerBtnElement: {
        icon: SeparatorHorizontal,
        label: "Spacer Field"
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
    const { height } = element.extraAttributes

    console.log('HEIGHT', height)

    return <div style={{marginTop: height, width: '100%'}}></div>
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
            height: element.extraAttributes.height,
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes)
    }, [element, form])

    function applyChanges(values) {
        const { height } = values;
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                height,
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
                    name="height"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Height (px): {form.watch("height")}</FormLabel>
                            <FormControl className="pt-2">
                                <Slider
                                    defaultValue={[field.value]}
                                    min={5}
                                    max={200}
                                    step={1}
                                    onValueChange={(value) => {
                                        field.onChange(value[0])
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
    const { height } = element.extraAttributes
    // console.log(required)
    return (
        <div className='text-white flex flex-col gap-2 w-full'>
            <div className="flex flex-col gap-2 w-full items-center">
                <Label className="text-muted-foreground">Spacer Field: {height}px</Label>
                <SeparatorHorizontal className='h-8 w-8' />
            </div>
        </div>
    )
}