import { MakeUserModule } from "../../../lib/queries/queries";
import { useForm } from "react-hook-form";
import { toast } from "../../ui/use-toast";
import { useNavigate, redirect } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { FilePlus, Shell } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { useAuth } from "../../../lib/AuthContext";
import useStore from '../../../lib/statusMachine'
import { useState } from "react";



function CreateModuleBtn() {
    const { setCurrentUserModuleId, setCurrentUserModuleName, setCurrentUserModulePublished } = useStore()
    const navigate = useNavigate();
    const { authState } = useAuth();
    const token = authState.token

    const [open, setOpen] = useState(false);

    const form = useForm({
        // resolver: zodResolver(formSchema),
    });

    async function onSubmit(values) {
        try {
            const module = await MakeUserModule(token, values);
            console.log("apsodfjapsd")
            toast({
                title: "Success",
                description: "Form created successfully",
            });
            console.log(values)
            const id = module.module.id
            const name = module.module.name
            setCurrentUserModulePublished(false)
            setCurrentUserModuleId(id)
            setCurrentUserModuleName(name)

            setOpen(false);
            navigate(`/craftModules/${id}`)
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong, please try again later",
                variant: "destructive",
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={"outline"}
                    className="bg-slate-950 hover:bg-slate-800 hover:text-white group border border-slate-600 h-[190px] items-center justify-center flex flex-col hover:border-slate-100 hover:cursor-pointer border-dashed gap-4"
                >
                    <FilePlus className="h-8 w-8 text-muted-foreground group-hover:text-white" />
                    <p className="font-bold text-xl text-muted-foreground group-hover:text-white">Create new form</p>
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

export default CreateModuleBtn;