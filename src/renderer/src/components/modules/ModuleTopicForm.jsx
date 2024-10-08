import React, { useEffect, useState } from 'react'
import { GetModuleTopicContent, GetUserModuleTopicContent } from '../../lib/queries/queries';
import { useAuth } from '../../lib/AuthContext';
import useStore from '../../lib/statusMachine';
import ModuleTopicFormComponent from './compo/ModuleTopicFormComponent';
import { Shell } from 'lucide-react';

function ModuleTopicForm() {
    const [content, setContent] = useState(null)
    const { authState } = useAuth();
    const token = authState.token
    const { currentModuleTopicId } = useStore()

    useEffect(() => {
        const getModuleTopicContent = async () => {
            const userModuleTopic = await GetModuleTopicContent(token, currentModuleTopicId)
            console.log(userModuleTopic)
            const elements = JSON.parse(userModuleTopic.moduleTopicContent.publishedContent);
            console.log(elements)
            const element = JSON.parse(elements[userModuleTopic.moduleTopicContent.version  ])
            console.log(element)
            setContent(element)
        }
        getModuleTopicContent()
    }, [])

    return (
        <div className='bg-slate-950 w-full h-full text-white'>
            {content ? (
                <ModuleTopicFormComponent content={content} />
            ) : (
                <div className='bg-slate-950 flex flex-col items-center justify-center w-full h-full'>
                    <Shell className=' animate-spin text-white' />
                </div>
            )}
        </div>
    )
}

export default ModuleTopicForm