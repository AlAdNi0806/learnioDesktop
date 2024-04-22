import React, { useState, useTransition } from 'react'
import { Button } from '../../../ui/button'
import { BookPlus, MoveLeft, MoveRight, Send, Shell } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../ui/alert-dialog';
import { PublishUserModuleTopic, PublishUserModuleTopicContent } from '../../../../lib/queries/queries';
import useStore from '../../../../lib/statusMachine'
import { useAuth } from '../../../../lib/AuthContext';
import { toast } from '../../../ui/use-toast';
import ReactConfetti from 'react-confetti';
import { Input } from '../../../ui/input';
import { Link } from 'react-router-dom';
import useDesigner from '../../../hooks/useDesigner';

function PublishFormBtn() {
  const [loading, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false); // State to control the dialog's open state
  const { elements } = useDesigner()
  const { currentUserModuleTopicId, setCurrentModuleTopicPublished } = useStore();
  const { authState } = useAuth();
  const token = authState.token;

  async function publishForm() {
    try {
      const jsonElements = JSON.stringify(elements)
      await PublishUserModuleTopicContent(token, currentUserModuleTopicId, jsonElements);
      toast({
        title: "Success",
        description: "Your form is now available to the public",
      });
      setIsOpen(false); // Close the dialog after successful publication
      setCurrentModuleTopicPublished(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  }


  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400" onClick={() => setIsOpen(true)}>
          <Send className="h-4 w-4" />
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. After publishing you will not be able to edit this form. <br />
            <br />
            <span className="font-medium">
              By publishing this form you will make it available to the public and you will be able to collect
              submissions.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(publishForm);
            }}
          >
            Proceed {loading && <Shell className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PublishFormBtn