// import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

// const AiModuleTopic = () => {
// //  const location = useLocation();
// //  const currentPath = location.pathname;
// //  console.log(currentPath)



// //  return (
// //     <div>
// //       aiModuleTopic
// //       <p>Current Path: {currentPath}</p>
// //     </div>
// //  );
// const { id } = useParams();

// return (
//    <div>
//      <h2>AI Module Details</h2>
//      <p>ID: {id}</p>
//    </div>
// );
// }

// export default AiModuleTopic;









import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { DeleteAiModuleTopic, GetAiModuleTopics, MakeAiModuleTopic } from '../../lib/queries/queries';
import { NewAiModuleTopic } from '../public/card/NewAiModuleTopic';

const AiModuleTopics = () => {
    const [topics, setTopics] = useState([])
    const { authState } = useAuth();
    const { id: aiModuleId } = useParams();
    const navigate = useNavigate();
    const token = authState.token

    useEffect(() => {
        console.log(token)
        let result;
        console.log(aiModuleId)
        const fetchAiModules = async () => {
            result = await GetAiModuleTopics(token, aiModuleId)
            setTopics(result.topics)
        };

        fetchAiModules()
    }, [])

    const refreshRoute = () => {
        // Navigate to the current route to refresh the component
        navigate(`/aiModules/${id}`)
    };

    const deleteAiModuleTopic = async (aiModuleTopicid) => {
        console.log(token)
        const result = await DeleteAiModuleTopic(token, aiModuleId, aiModuleTopicid)
        setTopics(topics.filter(topic => topic.id !== aiModuleTopicid));
    }

    const makeAiModuleTopic = async (aiModuleTopicName) => {
        // console.log(token)
        // event.preventDefault();
        // Here you can handle the submission, e.g., send the data to a server
        console.log(aiModuleTopicName)
        const result = await MakeAiModuleTopic(token, aiModuleId, aiModuleTopicName)
        setTopics([...topics, result.topic])
        if (result.success) {
            console.log("success")
            refreshRoute()
        } else {
            console.log("something went wrong")
        }
    };

    const goToTopic = (id) => {
        navigate(`/aiModules/topics/${id}`)
        // navigate(`/welcome/somo`)
    }

    return (
        <div className='w-full h-full sm:p-10 p-20 text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-auto'>
            {topics && topics.map((topic) => (
                <Card
                    className="flex cursor-pointer flex-col items-center justify-center h-32 aspect-w-1 aspect-h-1"
                    key={topic.id}
                    onClick={() => goToTopic(topic.id)}
                >
                    <CardHeader>
                        <CardTitle>
                            <p>
                                {topic.aiModuleTopicName}
                            </p>
                            <Button onClick={(e) => {
                                e.stopPropagation(); // Prevents the event from bubbling up to the Card
                                deleteAiModuleTopic(topic.id);
                            }}>
                                <Trash2 />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>

                    </CardContent>
                </Card>
            ))}

            <NewAiModuleTopic className="flex flex-col items-center justify-center h-32 aspect-w-1 aspect-h-1" onSubmit={makeAiModuleTopic} />
        </div>
    )
}

export default AiModuleTopics