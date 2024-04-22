// import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { DeleteAiModuleTopic, GetAiModuleTopics, GetUserEnrolledAiModuleTopics, MakeAiModuleTopic, UpsertUserEnrolledAiModuleTopic } from '../../lib/queries/queries';
import { NewAiModuleTopic } from '../public/card/NewAiModuleTopic';
import useStore from '../../lib/statusMachine'



const userEnrolledAiModuleTopics = () => {
    const { count, increment, decrement, pending, setPending, currentUserEnrolledAiModuleId, setCurrentAiModuleTopicName, setCurrentUserEnrolledAiModuleTopicId } = useStore();
    const [topics, setTopics] = useState([])
    const [userEnrolledAiModuleTopics, setUserEnrolledAiModuleTopics] = useState([])
    const { authState } = useAuth();
    const { id: aiModuleId } = useParams();
    const navigate = useNavigate();
    const token = authState.token

    useEffect(() => {
    
        // Immediately Invoked Function Expression (IIFE) for async operations
        (async () => {
            try {
                const result = await GetAiModuleTopics(token, aiModuleId);
                setTopics(result.topics);
            } catch (error) {
                console.error('Error fetching AI module topics:', error);
            }
    
            try {
                const UserEnrolledTopics = await GetUserEnrolledAiModuleTopics(token, currentUserEnrolledAiModuleId);
                setUserEnrolledAiModuleTopics(UserEnrolledTopics.userEnrolledAiModuleTopics);
            } catch (error) {
                console.error('Error fetching user enrolled AI module topics:', error);
            }
        })();
    }, []);

    const refreshRoute = () => {
        // Navigate to the current route to refresh the component
        navigate(`/userEnrolledAiModules/${id}`)
    };

    const goToTopic = async (id, aiModuleTopicName) => {
        const result = await UpsertUserEnrolledAiModuleTopic(token, currentUserEnrolledAiModuleId, id)
        const userEnrolledAiModuleTopicId = result.userEnrolledAiModuleTopic.id
        setCurrentUserEnrolledAiModuleTopicId(userEnrolledAiModuleTopicId);
        setCurrentAiModuleTopicName(aiModuleTopicName)
        navigate(`/userEnrolledAiModules/userEnrolledAiModuleTopics/${id}`)
        // navigate(`/welcome/somo`)
    }

    return (
        <div className='w-full h-full sm:p-10 p-20 text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-auto'>
            <div>
                <p>Count: {count}</p>
                <button onClick={increment}>Increment</button>
                <button onClick={decrement}>Decrement</button>
            </div>
            {topics && topics.map((topic) => (
                <Card
                    className="flex cursor-pointer flex-col items-center justify-center h-32 aspect-w-1 aspect-h-1"
                    key={topic.id}
                    onClick={pending ? undefined : () => goToTopic(topic.id, topic.aiModuleTopicName)}
                >
                    <CardHeader>
                        <CardTitle>
                            <p>
                                {topic.aiModuleTopicName}
                            </p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {userEnrolledAiModuleTopics.some(userEnrolledAiModuleTopic => userEnrolledAiModuleTopic.aiModuleTopicId === topic.id) && (
                            <p>Enrolled</p>
                        )}
                    </CardContent>
                </Card>
            ))}

        </div>
    )
}

export default userEnrolledAiModuleTopics