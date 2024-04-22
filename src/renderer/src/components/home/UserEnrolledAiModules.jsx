import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Plus, Trash2 } from 'lucide-react';
import { DeleteAiModule, GetAiModules, GetUserEnrolledAiModules, MakeAiModule, upsertUserEnrolledAiModule } from '../../lib/queries/queries';
import { Button } from '../ui/button';
import { NewAiModule } from '../public/card/NewAiModule';
import { useNavigate, redirect } from 'react-router-dom';

import useStore from '../../lib/statusMachine'



const UserEnrolledAiModules = () => {
    const { authState } = useAuth();
    const { count, currentAiModuleId, increment, decrement, setCurrentAiModuleId, setPending, setCurrentUserEnrolledAiModuleId } = useStore();
    const [modules, setModules] = useState([])
    const [userEnrolledModules, setUserEnrolledModules] = useState([])
    const navigate = useNavigate();
    const token = authState.token

    useEffect(() => {

        (async () => {
            try {
                const result = await GetAiModules(token);
                setModules(result.aiModules);
            } catch (error) {
                console.error('Error fetching AI modules:', error);
            }

            try {
                const UserEnrolledModules = await GetUserEnrolledAiModules(token);
                setUserEnrolledModules(UserEnrolledModules.userEnrolledAiModules);
            } catch (error) {
                console.error('Error fetching user enrolled AI modules:', error);
            }
        })();
    }, []);

    const refreshRoute = () => {
        // Navigate to the current route to refresh the component
        navigate('/UserEnrolledAiModules')
    };

    const goToModule = async (id) => {
        try {
            console.log("goingToModule")

            setCurrentAiModuleId(id)
            setPending(true)
            navigate(`/userEnrolledAiModules/${id}`)
            const result = await upsertUserEnrolledAiModule(token, id)
            const userEnrolledAiModule = result.userEnrolledAiModule.id
            setCurrentUserEnrolledAiModuleId(userEnrolledAiModule)
            setPending(false)

        } catch (error) {
            console.log(error)
        }
        // navigate(`/welcome/somo`)
    }

    return (
        <div className='w-full h-full sm:p-10 p-20 text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-auto'>
            <div>
                <p>Count: {count}</p>
                <p>aiModule: {currentAiModuleId}</p>
                <button onClick={increment}>Increment</button>
                {/* <button onClick={() =>setAiModule(count)}>Decrement</button> */}
                <button onClick={decrement}>Decrement</button>
            </div>
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
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {userEnrolledModules.some(userEnrolledModule => userEnrolledModule.aiModuleId === module.id) && (
                            <p>Enrolled</p>
                        )}
                    </CardContent>
                </Card>
            ))}

        </div>
    )
}

export default UserEnrolledAiModules