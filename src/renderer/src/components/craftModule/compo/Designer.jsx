import React, { useState } from 'react'
import DesignerSidebar from './DesignerSidebar'
import { useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core'
import { cn } from '../../../lib/utils'
import useDesigner from '../../hooks/useDesigner'
import { FormElements } from './FormElements'
import { idGenerator } from '../../../lib/utilities/idGenerator'
import { Button } from '../../ui/button'
import { Trash2 } from 'lucide-react';

function Designer() {

    const { elements, addElement, selectedElement, setSelectedElement, removeElement } = useDesigner();

    const droppable = useDroppable({
        id: 'designer-drop-area',
        data: {
            isDesignerDropArea: true,
        }
    })

    useDndMonitor({
        onDragEnd: (event) => {
            const { active, over } = event;
            if (!active || !over) return;

            const isDesignerBtnElement = active.data.current.isDesignerBtnElement;
            const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea

            // First scenario dropping a sidebar btn element over the designer droparea

            const droppingSidebarBtnOverDesignerDropArea = isDesignerBtnElement && isDroppingOverDesignerDropArea;

            if (droppingSidebarBtnOverDesignerDropArea) {
                const type = active.data?.current?.type;
                const newElement = FormElements[type].construct(
                    idGenerator()
                );

                addElement(elements.length, newElement)
                // console.log("NEW ELEMENT", newElement)
            }

            // Second scenario

            const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement;

            const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement;

            const isDroppingOverDesignerElement =
                isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;


            const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement;

            if (droppingSidebarBtnOverDesignerElement) {
                const type = active.data?.current?.type;
                const newElement = FormElements[type].construct(idGenerator());

                const overId = over.data?.current?.elementId;

                const overElementIndex = elements.findIndex((el) => el.id === overId);
                if (overElementIndex === -1) {
                    throw new Error("element not found");
                }

                let indexForNewElement = overElementIndex; // i assume i'm on top-half
                if (isDroppingOverDesignerElementBottomHalf) {
                    indexForNewElement = overElementIndex + 1;
                }

                addElement(indexForNewElement, newElement);
                return;
            }

            // Third scenario
            const isDraggingDesignerElement = active.data?.current?.isDesignerElement;

            const draggingDesignerElementOverAnotherDesignerElement =
                isDroppingOverDesignerElement && isDraggingDesignerElement;

            if (draggingDesignerElementOverAnotherDesignerElement) {
                const activeId = active.data?.current?.elementId;
                const overId = over.data?.current?.elementId;

                const activeElementIndex = elements.findIndex((el) => el.id === activeId);

                const overElementIndex = elements.findIndex((el) => el.id === overId);

                if (activeElementIndex === -1 || overElementIndex === -1) {
                    throw new Error("element not found");
                }

                const activeElement = { ...elements[activeElementIndex] };
                removeElement(activeId);

                let indexForNewElement = overElementIndex; // i assume i'm on top-half
                if (isDroppingOverDesignerElementBottomHalf) {
                    indexForNewElement = overElementIndex + 1;
                }

                addElement(indexForNewElement, activeElement);
            }

            // console.log("DRAG END", event)
        }
    })

    return (
        <div className='flex w-full h-full'>
            <div
                className='p-4 w-full'
                onClick={() => {
                    if (selectedElement) setSelectedElement(null)
                }}
            >
                <div
                    ref={droppable.setNodeRef}
                    className={cn(
                        'bg-slate-950 max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto',
                        droppable.isOver && "ring-4 ring-slate-200 ring-inset"
                    )}
                >
                    {!droppable.isOver && elements.length === 0 && (
                        <p className='text-3xl text-muted-foreground flex flex-grow items-center font-bold'>
                            Drop here
                        </p>
                    )}
                    {droppable.isOver && elements.length === 0 && (
                        <div className='p-4 w-full'>
                            <div className=' bg-slate-600 h-[120px] rounded-md'>

                            </div>
                        </div>
                    )}
                    {elements.length > 0 && (
                        <div className='text-white flex flex-col w-full gap-2 p-4'>
                            {elements.map(element => (
                                <DesignerElementWrapper
                                    key={element.id}
                                    element={element}
                                />
                            ))}
                        </div>
                        
                    )}
                </div>
                
            </div>
            <DesignerSidebar />
            
        </div>
    )
}

function DesignerElementWrapper({ element }) {
    const { removeElement, selectedElement, setSelectedElement } = useDesigner()

    const [mouseIsOver, setMouseIsOver] = useState(false)

    const topHalf = useDroppable({
        id: element.id + "-top",
        data: {
            type: element.type,
            elementId: element.id,
            isTopHalfDesignerElement: true,
        }
    })

    const bottomHalf = useDroppable({
        id: element.id + "-bottom",
        data: {
            type: element.type,
            elementId: element.id,
            isBottomHalfDesignerElement: true,
        }
    })

    const draggable = useDraggable({
        id: element.id + "-drag-handler",
        data: {
            type: element.type,
            elementId: element.id,
            isDesignerElement: true,
        }
    })

    if (draggable.isDragging) return null;

    const DesignerElement = FormElements[element.type].designerComponent;
    // const DesignerElement = FormElements[element.type].formComponent;

    return (
        <div
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            className='relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset'
            onMouseEnter={() => {
                setMouseIsOver(true)
            }}
            onMouseLeave={() => {
                setMouseIsOver(false)
            }}
            onClick={(e) => {
                e.stopPropagation()
                setSelectedElement(element)
            }}
        >
            <div
                ref={topHalf.setNodeRef}
                className={cn(
                    'absolute w-full h-1/2 rounded-t-md',
                    // topHalf.isOver && 'bg-green-400'
                )}
            />
            <div
                ref={bottomHalf.setNodeRef}
                className={cn(
                    'absolute w-full bottom-0 h-1/2 rounded-b-md',
                )}
            />
            {mouseIsOver && (
                <>
                    <div className='absolute right-0 h-full'>
                        <Button
                            className="flex justify-center h-full border rounded-md rounded-l-none bg-red-500"
                            variant={'destructive'}
                            onClick={(e) => {
                                e.stopPropagation()
                                removeElement(element.id)
                            }}
                        >
                            <Trash2 className='h-6 w-6' />
                        </Button>
                    </div>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'>
                        <p className='text-muted-foreground text-sm'>
                            Click for properties or drag to move
                        </p>
                    </div>
                </>
            )}
            {topHalf.isOver && (
                <div className='bg-slate-400 absolute top-0 w-full rounded-md rounded-b-none h-[7px]'>

                </div>
            )}
            <div className={cn(
                'bg-slate-800 flex w-full h-[120px] items-center rounded-md px-4 py-2 pointer-events-none opacity-100',
                mouseIsOver && 'opacity-20',

            )}>
                <DesignerElement
                    elementInstance={element}
                />
            </div>
            {bottomHalf.isOver && (
                <div className='bg-slate-400 absolute bottom-0 w-full rounded-md rounded-t-none h-[7px]'>

                </div>
            )}
        </div>
    )
}

export default Designer