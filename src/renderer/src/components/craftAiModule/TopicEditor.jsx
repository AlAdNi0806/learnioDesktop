import React, { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { DeleteAiFileElement, GetAiFileElements, UpsertAiFileElement } from '../../lib/queries/queries';
import { Button } from '../ui/button';
import { Plus, Trash } from 'lucide-react';
import { toast } from '../ui/use-toast';
import { useAuth } from '../../lib/AuthContext';
import { Textarea } from '../ui/textarea';
import { FormLabel } from '../ui/form';
import { cn } from '../../lib/utils';

export const TopicEditor = ({ open, setOpen, fileTitle, fileId }) => {
    const { authState } = useAuth();
    const token = authState.token

    const [aiFileElements, setAiFileElements] = useState()
    const [updatediFileElements, setUpdatedAiFileElements] = useState()

    const [elementArrayLength, setElementArrayLength] = useState(0)

    const handleEscClose = (event) => {
        if (open && event.key === 'Escape') {
            event.preventDefault();
            // closeDialog();
        }
    };

    useEffect(() => {
        if (open) {
            document.addEventListener('keydown', handleEscClose);
        } else {
            document.removeEventListener('keydown', handleEscClose);
        }

        // Cleanup function to run when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleEscClose);
        };
    }, [open]);

    useEffect(() => {
        setAiFileElements([])
        async function getFileElements() {
            try {
                console.log('ID', fileId)
                const result = await GetAiFileElements(token, fileId);
                console.log(result)
                console.log('AIELEMENTFILE', result.aiFile.aiFileElements)

                setAiFileElements(result.aiFile.aiFileElements)
                setUpdatedAiFileElements(result.aiFile.aiFileElements)

                setElementArrayLength(result.aiFile.aiFileElements.length)

            } catch (error) {
                toast({
                    title: "Error",
                    description: "Something went wrong, please try again later",
                    variant: "destructive",
                });
            }
        }
        getFileElements()
    }, [open])

    const createNewElement = () => {
        const newItem = {
            id: Date.now(), // Generate a unique ID for the new element
            title: (elementArrayLength + 1).toString(), // Default title
            description: "Default Description", // Default description
            status: "create" // Set the status to indicate it's a new creation
        };
        setUpdatedAiFileElements(prevElements => [...prevElements, newItem]);
        setElementArrayLength(elementArrayLength + 1);

    };

    const deleteElement = (itemId) => {
        setUpdatedAiFileElements(prevElements =>
            prevElements.map(item =>
                item.id === itemId ?
                    item.status === "create" ? null : { ...item, status: "delete" } :
                    item
            ).filter(Boolean) // Filter out null values resulting from deleted items
        );
        setElementArrayLength(elementArrayLength - 1);
    };

    const handleInputChange = (newValue, item, field) => {
        setUpdatedAiFileElements(prevElements =>
            prevElements.map(el => el.id === item.id ? { ...el, [field]: newValue } : el)
        );
    };

    const submitChanges = async () => {
        // Assuming aiFileElements is available in the scope
        const aiFileIds = aiFileElements.map(element => element.id);

        for (let updatedElement of updatediFileElements) {
            let correspondingElement = aiFileElements.find(element => element.id === updatedElement.id);

            if (!correspondingElement) {
                // Element doesn't exist in aiFileElements, treat as a create operation
                await UpsertAiFileElement({ token, aiFileId: fileId, title: updatedElement.title, description: updatedElement.description });
                continue; // Skip further processing for this element since it's treated as a create
            }

            // Check if the element exists and needs to be updated
            if (updatedElement.title !== correspondingElement.title ||
                updatedElement.description !== correspondingElement.description) {
                await UpsertAiFileElement({ token, aiFileId: fileId, aiFileElementId: updatedElement.id, title: updatedElement.title, description: updatedElement.description });
            }

            // Check if the element needs to be deleted
            if (updatedElement.status === "delete") {
                await DeleteAiFileElement(token, updatedElement.id);
            }
        }

        const result = await GetAiFileElements(token, fileId);
        console.log(result)
        console.log('AIELEMENTFILE', result.aiFile.aiFileElements)

        setAiFileElements(result.aiFile.aiFileElements)
        setUpdatedAiFileElements(result.aiFile.aiFileElements)
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className=" bg-slate-950 w-screen h-screen max-h-screen max-w-screen flex flex-col flex-grow p-0 gap-0 border-none">
                <div className='px-4 py-4 border-b relative'>
                    <div className='absolute'>
                        <Button onClick={() => submitChanges()} className="bg-white text-black hover:bg-indigo-400">
                            Save
                        </Button>
                    </div>
                    <CardTitle className="flex items-center justify-center flex-row">
                        <p className='truncate text-2xl font-bold text-white m-0 p-0'> {/* Adjusted margin and padding */}
                            {fileTitle}
                        </p>
                        <p className='m-0 p-0'> {/* Adjusted margin and padding */}
                            .topic
                        </p>
                    </CardTitle>
                </div>
                <div className="bg-slate-700 text-white flex flex-col flex-grow items-center justify-center p-4 bg-[url(../assets/home/graph-paper.svg)] overflow-y-auto">
                    <div className=" bg-slate-950 max-w-[1000px] flex flex-col gap-4 flex-grow h-full w-full rounded-2xl p-8 overflow-y-auto">

                        <Accordion type='multiple' collapsible className="w-full">

                            {updatediFileElements && (updatediFileElements.map((item, index) => (
                                <AccordionItem
                                    value={`item-${index}`}
                                    key={index}
                                    className={cn(
                                        item.status === "delete" ? " hidden" : " block",
                                    )}
                                >
                                    <AccordionTrigger>{item.title}</AccordionTrigger>
                                    <AccordionContent>
                                        <div className='flex flex-col md:flex-row w-full gap-6'>
                                            <div className='flex flex-col w-full'>
                                                <p className='text-xl text-white font-semibold mb-2 text-center'>Title</p>
                                                <Input
                                                    value={item.title}
                                                    className="w-full"
                                                    onChange={(e) => handleInputChange(e.target.value, item, 'title')}
                                                />
                                            </div>
                                            <div className='flex flex-col w-full mb-6'>
                                                <p className='text-xl text-white font-semibold mb-2 text-center'>Description</p>
                                                <Textarea
                                                    defaultValue={item.description}
                                                    className="w-full"
                                                    onChange={(e) => handleInputChange(e.target.value, item, 'description')}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex justify-center'>
                                            <Button variant="outline" className="w-full border-red-600 border-2 hover:bg-red-950" onClick={() => deleteElement(item.id)}>
                                                <Trash />
                                            </Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )))}
                            <Button variant='outline' className="w-full mt-10" onClick={() => createNewElement()}>
                                <Plus />
                            </Button>
                        </Accordion>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

