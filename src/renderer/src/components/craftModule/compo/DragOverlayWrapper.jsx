import React, { useState } from 'react'
import { DragOverlay, useDndMonitor } from '@dnd-kit/core'
import { SidebarBtnElementDragOverlay } from './SidebarBtnElement'
import { FormElements } from './FormElements'
import useDesigner from '../../hooks/useDesigner'

function DragOverlayWrapper() {
    const { elements } = useDesigner()
    const [draggedItem, setDraggedItem] = useState(null)
    useDndMonitor({
        onDragStart: (event) => {
            setDraggedItem(event.active)
        },
        onDragCancel: () => {
            setDraggedItem(null);
        },
        onDragEnd: () => {
            setDraggedItem(null)
        }
    })
    if (!draggedItem) return null;

    let node = <div> No drag overlay</div>
    const isSidebarBtnElement = draggedItem.data?.current?.isDesignerBtnElement

    if (isSidebarBtnElement) {
        const type = draggedItem.data?.current?.type;
        // console.log(draggedItem)
        node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />
    }

    const isDesignerElement = draggedItem.data?.current?.isDesignerElement;
    if (isDesignerElement) {
        const elementId = draggedItem.data?.current?.elementId
        const element = elements.find((el) => el.id === elementId)
        if (!element) {
            node = <div>Elemenet not found!</div>
        } else {
            const DesignerElementComponent = FormElements[element.type].designerComponent

            node = (
                <div className='flex bg-slate-700 border rounded-md h-[120px] w-full py-2 px-4 opacity-80 pointer-events-none'>
                    <DesignerElementComponent elementInstance={element} />
                </div>
            )
        }
    }

    return (
        <DragOverlay>
            {node}
        </DragOverlay>
    )
}

export default DragOverlayWrapper