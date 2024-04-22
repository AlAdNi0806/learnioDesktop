import React, { useEffect, useState } from 'react'
import useStore from '../../lib/statusMachine';
import { useAuth } from '../../lib/AuthContext';
import { GetModules, GetModuleTopics, GetUserEnrolledModules } from '../../lib/queries/queries';
import { Separator } from '../ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { BookMarked, Eye, MoveRight, Pencil } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';

function ModuleTopics() {

  const [moduleTopics, setModuleTopics] = useState()


  const { authState } = useAuth();
  const token = authState.token
  const { currentModuleId, currentModuleName } = useStore()

  useEffect(() => {
    const getModuleTopicsInfo = async () => {
      const moduleTopics = await GetModuleTopics(token, currentModuleId)
      setModuleTopics(moduleTopics.moduleTopics)
      // console.log(modules, userEnrolledModules)
    }

    getModuleTopicsInfo();
  }, [])


  return (
    <div className='bg-slate-950 flex flex-1 h-full w-full flex-col'>
      <main className='overflow-auto text-white flex flex-col w-full p-8'>
        <h2 className="bg-slate-200 p-4 text-4xl font-bold bg-gradient-to-br from-violet-600 to-cyan-300 inline-block text-transparent bg-clip-text">{currentModuleName}</h2>

        <Separator className="my-6" />
        <ShowModuleTopics moduleTopics={moduleTopics} />
      </main>
    </div>
  )
}






function ShowModuleTopics({ moduleTopics }) {
  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {moduleTopics ? (
        moduleTopics.map((module) => (
          <ShowModule key={module.id} form={module} />
        ))
      ) : (
        <div>
          You have not practised any course yet!
        </div>
      )}
    </div>
  )
}

function ShowModule({ form }) {
  const {setCurrentModuleTopicId, setCurrentModuleTopicName} = useStore()
  return (
    <Card className="bg-slate-950 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{form.name}</span>
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), {
            addSuffix: true,
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description || "No description"}
      </CardContent>
      <CardFooter>
        <Button
          asChild
          // variant={"defaultMain"}
          // className="w-full gap-4"
          variant={"secondary"}
          className=" bg-slate-950 hover:bg-slate-900 hover:text-white ring-2 text-slate-300 ring-white w-full mt-2 text-md gap-4"
        >
          <Link
            to={`/modules/topics/${form.id}`}
            onClick={() => {
              setCurrentModuleTopicId(form.id)
              setCurrentModuleTopicName(form.name)
            }}
          >
            Try module <MoveRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ModuleTopics