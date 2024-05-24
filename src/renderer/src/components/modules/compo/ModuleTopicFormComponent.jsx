import React, { useCallback, useRef, useState, useTransition } from 'react'
import { FormElements } from '../../craftModule/compo/FormElements';
import { Button } from '../../ui/button';
import { MousePointerClick, Shell } from 'lucide-react';
import { toast } from '../../ui/use-toast';
import useStore from '../../../lib/statusMachine';
import { useAuth } from '../../../lib/AuthContext';
import { SubmitUserModuleTopic } from '../../../lib/queries/queries';

function ModuleTopicFormComponent({ content }) {
    const { authState } = useAuth();
    const token = authState.token

    const { currentModuleTopicId, currentUserEnrolledModuleId, currentModuleId } = useStore()

    const formValues = useRef({});
    const formErrors = useRef({});

    //the new Date here is to generate a random number
    const [renderKey, setRenderKey] = useState(new Date().getTime());

    const [submitted, setSubmitted] = useState(false);
    const [pending, setPending] = useState(false);

    const validateForm = useCallback(() => {
        for (const field of content) {
            const actualValue = formValues.current[field.id] || "";
            const valid = FormElements[field.type].validate(field, actualValue);

            if (!valid) {
                formErrors.current[field.id] = true;
            }
        }
        console.log(formErrors)
        if (Object.keys(formErrors.current).length > 0) {
            return false;
        }

        return true;
    }, [content]);

    const submitValue = useCallback((key, value) => {
        formValues.current[key] = value;
    }, []);

    const submitModuleTopic = async () => {
        setPending(true)
        formErrors.current = {};
        const validForm = validateForm()
        if (!validForm) {
            setRenderKey(new Date().getTime());
            toast({
                title: "Error",
                description: "please check the form errors",
                variant: 'destructive'
            })
            setPending(false)
            return;
        }

        console.log("FORM VALUES", formValues.current)

        try {
            const jsonContent = JSON.stringify(formValues.current);
            await SubmitUserModuleTopic(token, currentModuleTopicId, currentModuleId, currentUserEnrolledModuleId, jsonContent);
            setSubmitted(true);
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            });
        }
        setPending(false)
    }

    if (submitted) {
        return (
            <div className="flex justify-center w-full h-full items-center p-8">
                <div className="bg-slate-950 border-blue-950 max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
                    <h1 className="text-2xl font-bold">Topic submitted</h1>
                    <p className="text-muted-foreground">Thank you for submitting the topic, you can close this page now.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex justify-center w-full h-full items-center p-8 overflow-hidden'>
            <div
                className='max-w-[1000px] h-full overflow-auto flex flex-col gap-4 flex-grow bg-slate-950 w-full p-8 overflow-y-auto border border-blue-950 shadow-xl shadow-blue-700 rounded'
                key={renderKey}
            >
                {content.map((element) => {
                    const FormElement = FormElements[element.type].formComponent;
                    return (
                        <FormElement
                            key={element.id}
                            elementInstance={element}
                            submitValue={submitValue}
                            isInvalid={formErrors.current[element.id]}
                            defaultValue={formValues.current[element.id]}
                        />
                    );
                })}
                <Button
                    className="mt-8 ring-2 ring-blue-800"
                    onClick={() => {
                        submitModuleTopic();
                    }}
                    disabled={pending}
                >
                    {!pending ? (
                        <>
                            <MousePointerClick className="mr-2" />
                            Submit
                        </>
                    ) : (
                        <Shell className="animate-spin" />
                    )}
                </Button>
            </div>
        </div>
    )
}

export default ModuleTopicFormComponent