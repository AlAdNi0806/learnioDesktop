import { Heading1, Minus, SeparatorHorizontal, Type } from 'lucide-react'
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
import { Separator } from '../../../ui/separator';

const type = "SeparatorField";


export const SeparatorFieldFormElement = {
    type,
    construct: (id) => ({
        id,
        type,
    }),
    designerBtnElement: {
        icon: Minus,
        label: "Separator Field"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: () => true,
}

function FormComponent({

}) {

    return (
        <Separator />
    )
}

function PropertiesComponent({

}) {

    return <p>No properties for this component</p>
}

function DesignerComponent({

}) {
    // console.log(required)
    return (
        <div className='text-white flex flex-col gap-2 w-full'>
            <div className="flex flex-col gap-2 w-full">
                <Label className="text-muted-foreground">Separator field</Label>
                <Separator />
            </div>
        </div>
    )
}