import React, { useTransition } from 'react'
import { Button } from '../../../ui/button'
import { Save } from 'lucide-react';
import useDesigner from '../../../hooks/useDesigner';
import { UpdateUserModuleTopicContent } from '../../../../lib/queries/queries';
import { useAuth } from '../../../../lib/AuthContext';
import useStore from '../../../../lib/statusMachine'
import { toast } from '../../../ui/use-toast';
import { Shell } from 'lucide-react';

function SaveFormBtn() {
    const { currentUserModuleTopicId } = useStore()
    const [loading, startTransition] = useTransition()
    const { elements } = useDesigner();
    const { authState } = useAuth();
    const token = authState.token

    const updateFormContent = async () => {
        try {
            const jsonElements = JSON.stringify(elements)
            const updatedUserModuleTopic = await UpdateUserModuleTopicContent(token, currentUserModuleTopicId, jsonElements)
            toast({
                title: "success",
                description: "Your topic has been saved"
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive"
            })
        }
    }

    return (
        <Button
            variant={'default'}
            className="gap-2"
            disabled={loading}
            onClick={() => {
                startTransition(updateFormContent)
            }}
        >
            <Save className='h-4 w-4' />
            Save
            {loading && <Shell className=' animate-spin' />}
        </Button>
    )
}

export default SaveFormBtn