import { MakeUserModule, MakeUserModuleTopic } from "../../../lib/queries/queries";
import { useForm } from "react-hook-form";
import { toast } from "../../ui/use-toast";
import { useNavigate, redirect } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { FilePlus, Shell, Plus } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { useAuth } from "../../../lib/AuthContext";
import useStore from '../../../lib/statusMachine'


function CreateModuleTopicBtn() {
    const { currentUserModuleId, setCurrentUserModuleTopicId, setCurrentUserModuleTopicName } = useStore()
    const navigate = useNavigate();
    const { authState } = useAuth();
    const token = authState.token

    const form = useForm({
        // resolver: zodResolver(formSchema),
    });

    async function onSubmit(values) {
        try {
            const moduleTopic = await MakeUserModuleTopic(token, currentUserModuleId, values);
            toast({
                title: "Success",
                description: "Form created successfully",
            });
            console.log(values)
            const id = moduleTopic.moduleTopic.id
            const name = moduleTopic.moduleTopic.name
            setCurrentUserModuleTopicId(id)
            setCurrentUserModuleTopicName(name)
            navigate(`/craftModules/editor/${id}`)
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong, please try again later",
                variant: "destructive",
            });
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="hover:bg-slate-800 bg-black absolute right-14 bottom-14 h-14 w-14 ring-2 ring-white">
                    <Plus size={24} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create form</DialogTitle>
                    <DialogDescription>Create a new form to start collecting responses</DialogDescription>
                </DialogHeader>
                <Form {...form}>
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
                </Form>
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

export default CreateModuleTopicBtn;