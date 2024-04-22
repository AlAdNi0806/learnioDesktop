import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useLocation, useParams } from 'react-router-dom';
import { Plus, Trash2, Timer, BarChart, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { DeleteAiModuleTopic, GenerateQuestions, GetAiModuleTopics, GetUserEnrolledAiModuleTopics, MakeAiModuleTopic, UpsertUserEnrolledAiModuleTopic } from '../../lib/queries/queries';

import useStore from '../../lib/statusMachine'
import MCQCounter from '../public/indicator/MCQCounter';
import CustomMCQ from './compo/CustomMCQ';


const UserEnrolledAiModuleTopicGame = () => {
    const { pending, setPending } = useStore();
    const { authState } = useAuth();
    const { currentUserEnrolledAiModuleTopicId, currentAiModuleTopicName } = useStore();
    const [questions, setQuestions] = useState([])
    const { id: aiTopicId } = useParams();
    const navigate = useNavigate();
    const token = authState.token

    useEffect(() => {

        console.log(currentAiModuleTopicName)
        let generatedQuestions;
        setPending(true)
        const fetchAiModules = async () => {
            generatedQuestions = await GenerateQuestions(token, currentAiModuleTopicName, 'mcq', currentUserEnrolledAiModuleTopicId)
            console.log(generatedQuestions.questions)
            setQuestions(generatedQuestions.questions)
        };

        fetchAiModules()
        setPending(false)
    }, [])


    return (
        <div className='text-white w-full'>
            {/* {questions.map((question, index) => (
                <div key={index}>
                    <p>{question.question}</p>
                    <p>{question.answer}</p>
                    {question.option1 && <p>{question.option1}</p>}
                    {question.option2 && <p>{question.option2}</p>}
                    {question.option3 && <p>{question.option3}</p>}
                    {question.option3 && <p>{question.option4}</p>}
                </div>
            ))} */}
            {pending ? null : <CustomMCQ questions={questions} />}


        </div>
    )
}

export default UserEnrolledAiModuleTopicGame