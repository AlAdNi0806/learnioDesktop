import React from 'react'
import useDesigner from '../../hooks/useDesigner'
import { FormElements } from './FormElements';
import { Button } from '../../ui/button';
import { X } from 'lucide-react';
import { Separator } from '../../ui/separator';

function PropertiesFormSidebar() {
    const { selectedElement, setSelectedElement } = useDesigner()
    if (!selectedElement) return null;

    const PropertiesForm = FormElements[selectedElement?.type].propertiesComponent

    return (
        <div>
            <div className='flex justify-between items-center '>
                <p className=' text-white text-sm'>
                    Element properties
                </p>
                <Button
                    onClick={() => {
                        setSelectedElement(null)
                    }}
                >
                    <X />
                </Button>
            </div>
            <Separator className="mb-4 mt-2"/>
            <PropertiesForm elementInstance={selectedElement}/>
        </div>
    )
}

export default PropertiesFormSidebar