import React, { useEffect, useMemo, useState } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, Controller } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { CircleCheck, CircleX, BookmarkCheck } from 'lucide-react';

import { cn } from "@/lib/utils"


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const CustomMCQ = ({ questions }) => {
    const shuffledQuestions = [...questions];
    // shuffleArray(shuffledQuestions);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [currentSelectedOptionId, setCurrentSelectedOptionId] = useState()
    const [disabled, setDisabled] = useState()

    const handleOptionSelect = (optionId) => {
        // setUserAnswers([...userAnswers, { question: shuffledQuestions[currentQuestionIndex].question, isCorrect }]);

        // if (currentQuestionIndex < shuffledQuestions.length - 1) {
        //     setCurrentQuestionIndex(currentQuestionIndex + 1);
        // } else {
        //     setShowResults(true);
        // }
        setCurrentSelectedOptionId(optionId);
        console.log(optionId)
    };

    const handleCheckAnswer = (isCorrect) => {
        setUserAnswers([...userAnswers, { question: shuffledQuestions[currentQuestionIndex].question, isCorrect }]);

        // if (currentQuestionIndex < shuffledQuestions.length - 1) {
        //     setCurrentQuestionIndex(currentQuestionIndex + 1);
        // } else {
        //     setShowResults(true);
        // }
        setDisabled(true)
    };

    const nextPage = () => {
        setCurrentSelectedOptionId()

        if (currentQuestionIndex < shuffledQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResults(true);
        }
        setDisabled(false)
    }

    return (
        <div className='p-10 bg-indigo-900 rounded-2xl w-full'>
            {showResults ? (
                <div>
                    <h2>Quiz Completed!</h2>
                    <ul>
                        {userAnswers.map((answer, index) => (
                            <li key={index}>
                                {answer.question}: {answer.isCorrect ? 'Correct' : 'Incorrect'}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    {shuffledQuestions.map((question, index) => {
                        if (index !== currentQuestionIndex) return null;

                        const options = [question.option1, question.option2, question.option3, question.answer];
                        // shuffleArray(options);

                        return (
                            <div key={index} className='flex flex-col gap-10'>
                                <p className=' text-2xl'>
                                    {question.question}
                                </p>
                                {options.map((option, optionIndex) => (
                                    <label
                                        key={optionIndex}
                                        className={cn(
                                            'p-4 bg-indigo-500 border-indigo-950 rounded-xl cursor-pointer relative flex justify-between',
                                            optionIndex === currentSelectedOptionId && !disabled ? ' ring-2 ring-cyan-400' : '',
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={option}
                                            onClick={() => handleOptionSelect(optionIndex)}
                                            disabled={disabled}
                                            className=' invisible absolute'
                                        />
                                        <p>{option}</p>
                                        {/* CircleCheck, CircleX, BookmarkCheck */}
                                        {/* currentSelectedOptionId === optionIndex && options[currentSelectedOptionId] === question.answer */}
                                        {disabled ? (
                                            (options[optionIndex] === question.answer) ? (
                                                <CircleCheck className=' text-emerald-400' />
                                            ) : (
                                                
                                                
                                                (optionIndex === currentSelectedOptionId) ? (
                                                    <CircleX className=' text-rose-700' />
                                                ) : (
                                                    null
                                                )
                                            )
                                            
                                            
                                        ) : (
                                            null
                                        )}
                                    </label>
                                ))}
                                {disabled ? (
                                    <button onClick={() => nextPage()}>
                                        Next page
                                    </button>

                                ) : (

                                    <button onClick={() => handleCheckAnswer(options[currentSelectedOptionId] === question.answer)}>
                                        Check Answer
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};


// import useStore from '../../../lib/statusMachine'


// const CustomMCQ = ({ questions }) => {
//     const { pending, setPending } = useStore();
//     const [questionAnswerHistory, setQuestionAnswerHistory] = useState([])
//     const [currentQuestionId, setCurrentQuestionId] = useState(0)
//     const [currentQuestion, setCurrentQuestion] = useState()

//     useEffect(() => {
//         if (questions.length > 1) {
//             console.log(questions[currentQuestionId])
//             setCurrentQuestion(questions[currentQuestionId])
//             console.log("qorking")
//             console.log(currentQuestion)
//             // const options = [
//             //     currentQuestion.option1,
//             //     currentQuestion.option2,
//             //     currentQuestion.option3,
//             //     currentQuestion.answer,
//             // ].sort(() => Math.random() - 0.5);
//             // console.log(options)
//         }
//     }, [currentQuestionId, questions]);

//     const goToNextQuestion = () => {
//         if ((currentQuestionId += 1) === questions.length) {
//             console.log("done")
//         } else {
//             setCurrentQuestionId(currentQuestionId += 1)
//         }
//     }

//     const checkQuestion = () => {

//     }

//     const goToPreviousQuestion = () => {

//     }


//     // 1. Define your form.
//     const form = useForm({
//         resolver: {},
//         defaultValues: {
//             username: "",
//         },
//     })

//     // 2. Define a submit handler.
//     function onSubmit(values) {
//         // Do something with the form values.
//         // ✅ This will be type-safe and validated.
//         console.log(values)
//     }


//     return (
//         <div>
//             {/* <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

//                     <Button type="submit">Submit</Button>
//                 </form>
//             </Form> */}
//             {questions.map((question, index) => (
//                 <div key={index}>
//                     <p>{question.question}</p>
//                     <p>{question.answer}</p>
//                     {question.option1 && <p>{question.option1}</p>}
//                     {question.option2 && <p>{question.option2}</p>}
//                     {question.option3 && <p>{question.option3}</p>}
//                     {question.option3 && <p>{question.option4}</p>}
//                 </div>
//             ))}

//         </div>
//     );
// }
export default CustomMCQ;
