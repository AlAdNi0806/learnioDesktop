import { MakeUserModule, UpsertAiDirectory, UpsertAiFile } from "../../../lib/queries/queries";
import { useForm } from "react-hook-form";
import { toast } from "../../ui/use-toast";
import { useNavigate, redirect } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { ChevronDown, FilePlus, Shell } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { useAuth } from "../../../lib/AuthContext";
import useStore from '../../../lib/statusMachine'
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { cn } from '../../../lib/utils'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


function UpsertAiElement({ parentId, currentFileNames, currentDirectoryNames, updateAiModule, element, upsertType, upsertElementType, setUpsertDialogueOpen, open }) {
    const { authState } = useAuth();
    const token = authState.token

    const directorySchema = z.object({
        name: z.string().min(1, "Name is required"),
        title: z.string().min(1, "Title is required").refine(
            value => upsertType === 'update' ? value === element?.title || !currentDirectoryNames.includes(value) : !currentDirectoryNames.includes(value),
            {
                message: "Title already exists in current directory names",
            }
        ),
        // shortened: z.string().min(1, "Description is shortened"),

        description: z.string().min(1, "Description is required"),
        iconPack: z.string().min(1, "Icon Pack is required"),
        icon: z.string().min(1, "Icon is required"),
    });

    const fileSchema = z.object({
        name: z.string().min(1, "Name is required"),
        title: z.string().min(1, "Title is required").refine(
            value => upsertType === 'update' ? value === element?.title || !currentFileNames.includes(value) : !currentFileNames.includes(value),
            {
                message: "Title already exists in current file names",
            }
        ),
        shortened: z.string().min(1, "Shortened Name is required"),
        description: z.string().min(1, "Description is required"),
        iconPack: z.string().min(1, "Icon Pack is required"),
        icon: z.string().min(1, "Icon is required"),
    });

    // const [open, setOpen] = useState(false);
    const [elementType, setElementType] = useState('directory')
    const [fileType, setFileType] = useState("topic")
    console.log('ELEMENT_TIPE', upsertElementType)

    const form = useForm({
        resolver: zodResolver(
            upsertType === 'update' ? upsertElementType === "directory" ? directorySchema : fileSchema :  elementType === "directory" ? directorySchema : fileSchema,
        ),
        mode: "onChange",
    });

    const { register, setValue, handleSubmit, formState: { errors } } = form;

    async function onSubmit(values) {
        try {
            if (upsertType === 'update') {
                if (upsertElementType === "directory") {
                    console.log('UPDATEVAL', values)
                    await UpsertAiDirectory({ ...values, token, parentAiDirectoryId: parentId, aiDirectoryId: element.id });
                    console.log('UPDATEDIRECTORY')
                } else if (upsertElementType === "file") {
                    console.log('UPDATEVAL', values)
                    await UpsertAiFile({ ...values, fileType, token, parentAiDirectoryId: parentId, aiFileId: element.id });
                    console.log('UPDATEFILE')

                }
            } else {

                if (elementType === "directory") {
                    console.log('VAL', values)
                    await UpsertAiDirectory({ ...values, token, parentAiDirectoryId: parentId });
                    console.log('DIRECTORY')
                } else if (elementType === "file") {
                    console.log('VAL', values)
                    await UpsertAiFile({ ...values, fileType, token, parentAiDirectoryId: parentId });
                    console.log('FILE')

                }
            }

            console.log(parentId, currentFileNames, currentDirectoryNames)
            await updateAiModule()


            form.reset();

            setUpsertDialogueOpen(false);

        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong, please try again later",
                variant: "destructive",
            });
        }
    }

    const changeElementType = async (type) => {
        setElementType(type)
        const currentValues = form.getValues();

        if (type === "directory") {
            validationResult = directorySchema.safeParse(currentValues);
        } else if (type === "file") {
            validationResult = fileSchema.safeParse(currentValues);
        }
        form.trigger();
    };

    useEffect(() => {

        form.trigger();
    }, [elementType]);


    useEffect(() => {
        if (upsertType !== 'update') {
            setValue('name', '');
            setValue('title', '');
            setValue('shortened', '');
            setValue('description', '');
            setValue('iconPack', '');
            setValue('icon', '');
            form.trigger();
            // No action needed for insert
        } else {
            setValue('name', element?.name || '');
            setValue('title', element?.title || '');
            setValue('shortened', element?.shortened || '');
            setValue('description', element?.description || '');
            setValue('iconPack', element?.iconPack || '');
            setValue('icon', element?.icon || '');
            setFileType(element?.type)
            form.trigger();
            // console.log('ELEMENT NAMES', currentFileNames)
            // form.trigger();
        }
    }, [element, upsertType, setValue]);

    return (
        <Dialog open={open} onOpenChange={setUpsertDialogueOpen}>
            {/* <DialogTrigger asChild>
                <Button
                    variant={"outline"}
                    className="bg-slate-950 hover:bg-slate-800 hover:text-white group border border-slate-600 h-[190px] items-center justify-center flex flex-col hover:border-slate-100 hover:cursor-pointer border-dashed gap-4"
                >
                    <FilePlus className="h-8 w-8 text-muted-foreground group-hover:text-white" />
                    <p className="font-bold text-xl text-muted-foreground group-hover:text-white">Create new element</p>
                </Button>
            </DialogTrigger> */}
            <DialogContent className="max-h-[700px] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Update your {upsertType === 'update' ? upsertElementType : elementType}</DialogTitle>
                    <DialogDescription>Update your {upsertType === 'update' ? upsertElementType : elementType} so that others would see it</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">

                        <FormField
                            control={form.control}
                            name="elementType"
                            render={({ field }) => (
                                <FormItem
                                    className={cn(
                                        upsertType === "update" ? " hidden" : " flex",
                                        "flex-col mb-4",
                                    )}
                                >
                                    <FormLabel className="mb-1">Element</FormLabel>
                                    <FormControl >
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="flex justify-between gap-12 flex-row w-52">
                                                    <p>{elementType}</p>
                                                    <ChevronDown size={20} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                <DropdownMenuLabel>Element Type</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuRadioGroup value={upsertType === 'update' ? upsertElementType : elementType} onValueChange={(type) => {
                                                    changeElementType(type)
                                                }}>
                                                    <DropdownMenuRadioItem value="directory">Directory</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem value="file">File</DropdownMenuRadioItem>
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fileType"
                            render={({ field }) => (
                                <FormItem
                                    className={cn(
                                        upsertType === 'update' ? upsertElementType === "directory" ? " hidden" : " flex" : elementType === "directory" ? " hidden" : " flex",
                                        "flex-col mb-4",
                                    )}
                                >
                                    <FormLabel className="mb-1">File</FormLabel>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="flex justify-between gap-12 flex-row w-52">
                                                <p>{fileType}</p>
                                                <ChevronDown size={20} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuLabel>File Type</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={fileType} onValueChange={setFileType}>
                                                <DropdownMenuRadioItem value="topic">topic</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="essay">essay</DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>


                                        <Input
                                            {...field}
                                            {...register('name')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>


                                        <Input
                                            {...field}
                                            {...register('title')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="shortened"
                            render={({ field }) => (
                                <FormItem
                                    className={cn(
                                        upsertType === 'update' ? upsertElementType === "directory" ? " hidden" : " block" : elementType === "directory" ? " hidden" : " block",
                                    )}
                                >
                                    <FormLabel>Shortened</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            {...register('shortened')}
                                        />
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
                                        <Textarea
                                            rows={5}
                                            {...field}
                                            {...register('description')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="iconPack"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon Pack</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            {...register('iconPack')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            {...register('icon')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full mt-4 bg-slate-200 text-black hover:bg-slate-300">
                        {!form.formState.isSubmitting && <span className="tracking-wide font-semibold">{upsertType === 'update' ? 'Update' : 'Create'}</span>}
                        {form.formState.isSubmitting && <Shell className="animate-spin" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default UpsertAiElement;