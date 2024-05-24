import { MakeUserModule, UpdateModuleTopicPublicVersion } from "../../../lib/queries/queries";
import { useForm } from "react-hook-form";
import { toast } from "../../ui/use-toast";
import { useNavigate, redirect } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { FilePlus, Settings, Shell } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { useAuth } from "../../../lib/AuthContext";
import useStore from '../../../lib/statusMachine'
import { useEffect, useMemo, useState } from "react";
import { cn } from "../../../lib/utils";



function SettingsBtn({ currentUserModuleTopicId, reloadTopic, publishedVersion, publicVariantsContent }) {
    const { setCurrentUserModuleId, setCurrentUserModuleName, setCurrentUserModulePublished } = useStore()
    const navigate = useNavigate();
    const { authState } = useAuth();
    const token = authState.token

    const [open, setOpen] = useState(false);
    const [currentSelectedExercise, setCurrentSelectedExercise] = useState(publishedVersion);
    const [versionsArray, setVersionsArray] = useState([])

    const form = useForm({
        // resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        console.log('apsodifjaspodf', publicVariantsContent)
        const numberOfProperties = Object.keys(publicVariantsContent).length;

        // Generate an array of numbers from 1 to the count
        const numbersArray = Array.from({ length: numberOfProperties }, (_, i) => i + 1);

        setVersionsArray(numbersArray)
    }, [publicVariantsContent])

    async function onSubmit(values) {
        try {
            console.log("apsodfjapsd")
            const module = await UpdateModuleTopicPublicVersion(token, currentUserModuleTopicId, currentSelectedExercise);
            console.log("apsodfjapsd")
            reloadTopic()
            toast({
                title: "Success",
                description: "Form created successfully",
            });


            setOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong, please try again later",
                variant: "destructive",
            });
        }
    }

    const Square = ({ text, index }) => (
        <Button

            className={cn(
                ' max-w-10',
                index + 1 === currentSelectedExercise && "border-white border-2"
            )}
            onClick={() => {
                setCurrentSelectedExercise(text)
            }}
        >
            <p >{text}</p>
        </Button>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={"outline"}
                // className="bg-slate-950 hover:bg-slate-800 hover:text-white group border border-slate-600 items-center justify-center flex flex-col hover:border-slate-100 hover:cursor-pointer border-dashed gap-4"
                >
                    <Settings className="h-6 w-6 text-muted-foreground group-hover:text-white text-white" />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[900px]">
                <DialogHeader>
                    <DialogTitle>Publish variant</DialogTitle>
                    <DialogDescription>Update the published variant for the users of your topic</DialogDescription>
                </DialogHeader>
                <div className=" grid grid-cols-6 pt-4">
                    {versionsArray.map((item, index) => {
                        return (
                            <Square text={item} index={index} />
                        )
                    })}
                </div>
                {/* <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea rows={5} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form> */}
                <DialogFooter>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full mt-4">
                        {!form.formState.isSubmitting && <span>Save</span>}
                        {form.formState.isSubmitting && <Shell className="animate-spin" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default SettingsBtn;