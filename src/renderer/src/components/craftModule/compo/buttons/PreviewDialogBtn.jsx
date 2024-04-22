import React from 'react'
import { Button } from '../../../ui/button'
import { View } from 'lucide-react';
import useDesigner from '../../../hooks/useDesigner';
import { Dialog, DialogContent, DialogTrigger } from '../../../ui/dialog';
import { FormElements } from '../FormElements';

function PreviewDialogBtn() {
    const { elements } = useDesigner();
    return (
        <Dialog>
            <DialogTrigger>
                <Button variant={'default'} className="gap-2">
                    <View className='h-6 w-6' />
                    Preview
                </Button>
            </DialogTrigger>
            <DialogContent className=" bg-slate-950 w-screen h-screen max-h-screen max-w-screen flex flex-col flex-grow p-0 gap-0 border-none">
                <div className='px-4 py-2 border-b'>
                    <p className="text-lg font-bold text-muted-foreground">
                        Form preview
                    </p>
                    <p className="text-sm text-muted-foreground">
                        This is how your form will look like to your users.
                    </p>
                </div>
                <div className="bg-slate-700 text-white flex flex-col flex-grow items-center justify-center p-4 bg-[url(../assets/home/graph-paper.svg)] overflow-y-auto">
                    <div className=" bg-slate-950 max-w-[620px] flex flex-col gap-4 flex-grow h-full w-full rounded-2xl p-8 overflow-y-auto">
                        {elements.map((element) => {
                            const FormComponent = FormElements[element.type].formComponent;
                            return <FormComponent key={element.id} elementInstance={element} />;
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PreviewDialogBtn