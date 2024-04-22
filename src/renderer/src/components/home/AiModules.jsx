import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Plus, Trash2 } from 'lucide-react';
import { DeleteAiModule, GetAiModules, MakeAiModule } from '../../lib/queries/queries';
import { Button } from '../ui/button';
import { NewAiModule } from '../public/card/NewAiModule';
import { useNavigate, redirect } from 'react-router-dom';

const AiModules = () => {
    const { authState } = useAuth();
    const token = authState.token
    console.log(token)
    const [modules, setModules] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        console.log(token)
        let result;
        const fetchAiModules = async () => {
            result = await GetAiModules(token)
            setModules(result.aiModules)
        };

        fetchAiModules()
    }, [])

    const refreshRoute = () => {
        // Navigate to the current route to refresh the component
        navigate('/aiModules')
    };

    const deleteAiModule = async (id) => {
        console.log(token)
        const result = await DeleteAiModule(token, id)
        setModules(modules.filter(module => module.id !== id));
    }

    const makeAiModule = async (aiModuleSubject) => {
        console.log(token)
        // event.preventDefault();
        // Here you can handle the submission, e.g., send the data to a server
        const result = await MakeAiModule(token, aiModuleSubject)
        setModules([...modules, result.aiModule])
        if (result.success) {
            console.log("success")
            refreshRoute()
        } else {
            console.log("something went wrong")
        }
    };

    const goToModule = (id) => {
        navigate(`/aiModules/${id}`)
        // navigate(`/welcome/somo`)
    }

    return (
        <div className='w-full h-full sm:p-10 p-20 text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-auto'>
            {modules && modules.map((module) => (
                <Card
                    className="flex cursor-pointer flex-col items-center justify-center h-32 aspect-w-1 aspect-h-1"
                    key={module.id}
                    onClick={() => goToModule(module.id)}
                >
                    <CardHeader>
                        <CardTitle>
                            <p>
                                {module.aiModuleSubject}
                            </p>
                            <Button onClick={(e) => {
                                e.stopPropagation(); // Prevents the event from bubbling up to the Card
                                deleteAiModule(module.id);
                            }}>
                                <Trash2 />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>

                    </CardContent>
                </Card>
            ))}

            <NewAiModule className="flex flex-col items-center justify-center h-32 aspect-w-1 aspect-h-1" onSubmit={makeAiModule} />
        </div>
    )
}

export default AiModules