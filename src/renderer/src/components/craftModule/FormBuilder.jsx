import React, { useEffect } from 'react'
import PreviewDialogBtn from './compo/buttons/PreviewDialogBtn'
import SaveFormBtn from './compo/buttons/SaveFormBtn'
import PublishFormBtn from './compo/buttons/PublishFormBtn'
import Designer from './compo/Designer'
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import DragOverlayWrapper from './compo/DragOverlayWrapper'
import useStore from '../../lib/statusMachine'
import useDesigner from '../hooks/useDesigner'
import { GetUserModuleTopicContent } from '../../lib/queries/queries'
import { useAuth } from '../../lib/AuthContext'
import { MoveLeft, MoveRight, Shell } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ReactConfetti from 'react-confetti'
import { Button } from '../ui/button'

function FormBuilder() {
    const { currentUserModuleTopicName, currentUserModuleTopicId, currentModuleTopicPublished, setCurrentModuleTopicPublished, currentUserModuleId } = useStore()
    const [isReady, setIsReady] = useState(false)
    const { setElements } = useDesigner()
    const { authState } = useAuth();
    const token = authState.token

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5
            }
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 300,
                tolerance: 5
            }
        })
    )

    useEffect(() => {
        if (isReady) return;
        const getModuleTopicContent = async () => {
            const userModuleTopicContent = await GetUserModuleTopicContent(token, currentUserModuleTopicId)
            const elements = JSON.parse(userModuleTopicContent.moduleTopicContent);
            setElements(elements)
            setIsReady(true)
        }
        getModuleTopicContent()
        
    }, [currentUserModuleTopicId])

    if (!isReady) {
        return (
            <div className='bg-slate-950 flex flex-col items-center justify-center w-full h-full'>
                <Shell className=' animate-spin text-white' />
            </div>
        )
    }

    if (currentModuleTopicPublished) {
        return (
            <>
                <ReactConfetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={1000} />
                <div className=" bg-slate-950 text-white flex flex-col items-center justify-center h-full w-full">
                    <div className="max-w-md">
                        <h1 className="text-center text-4xl font-bold border-b pb-2 mb-10">
                            🎊 Form Published 🎊
                        </h1>
                        <h2 className="text-2xl">Share this form</h2>
                        <h3 className="text-xl text-muted-foreground border-b pb-10">
                            Anyone with the link can view and submit the form
                        </h3>
                        <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
                            {/* <Input className="w-full" readOnly value={shareUrl} /> */}
                            {/* <Button
                                className="mt-2 w-full"
                                onClick={() => {
                                    navigator.clipboard.writeText(shareUrl);
                                    toast({
                                        title: "Copied!",
                                        description: "Link copied to clipboard",
                                    });
                                }}
                            >
                                Copy link
                            </Button> */}
                        </div>
                        <div className="flex justify-between">
                            <Button variant={"link"} className="text-white" asChild>
                                <Link
                                    to={`/craftModules/editor/${currentUserModuleTopicId}`}
                                    className="gap-2"
                                    onClick={() => {
                                        setCurrentModuleTopicPublished(false)
                                    }}
                                >
                                    <MoveLeft />
                                    Back to editor
                                </Link>
                            </Button>
                            <Button variant={"link"} className="text-white" asChild>
                                <Link
                                    to={`/craftModules/${currentUserModuleId}`}
                                    className="gap-2"

                                >
                                    Go to topics
                                    <MoveRight />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <DndContext sensors={sensors}>
            <main className=' flex flex-col w-full bg-slate-800 text-white'>
                <nav className='flex justify-between border-b-2 border-slate-500 p-4 gap-3 items-center'>
                    <h2 className='truncate font-medium'>
                        <span className='text-muted-foreground mr-2'>
                            Form:
                        </span>
                        {currentUserModuleTopicName}
                    </h2>
                    <div className='flex items-center gap-2'>
                        <PreviewDialogBtn />
                        {true && (
                            <>
                                <SaveFormBtn />
                                <PublishFormBtn />
                            </>
                        )}
                    </div>
                </nav>
                <div className='flex w-full flex-grow items-center justify-center relative overflow-x-auto h-[200px] bg-accent bg-slate-700 bg-[url(../assets/home/graph-paper.svg)]'>
                    <Designer />
                </div>
            </main>
            <DragOverlayWrapper />
        </DndContext>
    )
}

export default FormBuilder