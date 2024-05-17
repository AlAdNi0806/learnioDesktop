import { DeleteAiDirectory, DeleteAiFile, MakeUserModule, UpsertAiDirectory, UpsertAiFile } from "../../../lib/queries/queries";
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


function DeleteAiElement({ element, type, setDeleteDialogueOpen, open, updateAiModule }) {
    const { authState } = useAuth();
    const token = authState.token

    const [confirmationText, setConfirmationText] = useState('')
    const [completeText, setCompleteText] = useState()
    const [pending, setPending] = useState(false)

    useEffect(() => {
        if (element) {
            console.log("ELEMENT", element.title)
            setCompleteText(element.title)
        }
    }, [element])

    async function onSubmit() {
        setPending(true)
        try {
            if (type === "directory") {
                await DeleteAiDirectory(token, element.id)
            } else if (type === "file") {
                await DeleteAiFile(token, element.id)
            }
            await updateAiModule()
            // updateAiModule()
            setConfirmationText('')
            setDeleteDialogueOpen(false);
            console.log("FASPODFIJP", confirmationText)
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong, please try again later",
                variant: "destructive",
            });
        }
        setPending(false)
    }



    return (
        <Dialog open={open} onOpenChange={setDeleteDialogueOpen} className="">

            <DialogContent className="max-h-[700px] overflow-y-scroll border-slate-800">
                <DialogHeader>
                    <DialogTitle>Delete your element</DialogTitle>
                    <DialogDescription><span>To confirm, type " <span className="text-white">{element ? element.title : ''}</span> " in the box below</span></DialogDescription>
                </DialogHeader>
                <Input
                    className="border-red-500"
                    onChange={(e) => setConfirmationText(e.target.value)} // Fix the onChange handler
                    value={confirmationText} // Set the input value to the state
                />
                <DialogFooter>
                    <Button
                        onClick={onSubmit}
                        disabled={(pending) || (completeText !== confirmationText)}
                        className="w-full mt-4"
                        aria-label={!pending ? "Delete" : undefined}
                    >
                        {!pending && <span className="text-red-500 font-semibold">Delete this {type}</span>}
                        {pending && <Shell className="animate-spin" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteAiElement;