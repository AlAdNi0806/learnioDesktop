import { Heading1, ImageIcon, Type } from 'lucide-react'
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
import { IoIosPhotos } from 'react-icons/io';

const type = "ImageField";

const propertiesSchema = z.object({
    url: z.string().min(2).max(5000),
})

export const ImageFieldFormElement = {
    type,
    construct: (id) => ({
        id,
        type,
        extraAttributes: {
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr7553iJOF6ZBEZ3MqzXY0AKpCtu5woW6HOEOlFrsQ6mnExeNE5Y1ftCy1r_SrdaJ9ekQ",
        }
    }),
    designerBtnElement: {
        icon: ImageIcon,
        label: "Image Field"
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

    const { url } = element.extraAttributes

    return (
        <div className='flex justify-center items-center'>
            {/* <p>apsodifjapsodifjapsoi</p> */}
            <img src={url} alt="Description" className="text-xl rounded-md" />
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
            url: element.extraAttributes.title,
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes)
    }, [element, form])

    function applyChanges(values) {
        const { url } = values;
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                url,
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
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL</FormLabel>
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
    const { url } = element.extraAttributes
    // console.log(required)
    return (
        <div className='text-white flex flex-col gap-2 w-full'>
            <div className="flex flex-col gap-2 w-full">
                <Label className="text-muted-foreground">Image field</Label>
                <p className="text-xl truncate">{url}</p>
            </div>
        </div>
    )
}