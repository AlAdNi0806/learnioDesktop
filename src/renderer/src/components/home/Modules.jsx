import React, { useEffect, useState } from 'react'
import useStore from '../../lib/statusMachine';
import { useAuth } from '../../lib/AuthContext';
import { GetModules, GetUserEnrolledModules } from '../../lib/queries/queries';
import { Separator } from '../ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { BookMarked, Eye, MoveRight, Pencil } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';

function Modules() {

  const [modules, setModules] = useState()
  const [userEnrolledModules, setUserEnrolledModules] = useState()


  const { authState } = useAuth();
  const token = authState.token
  // const { setCurrentModuleId } = useStore()

  useEffect(() => {
    const getModulesInfo = async () => {
      const modules = await GetModules(token)
      const userEnrolledModules = await GetUserEnrolledModules(token)
      setModules(modules.modules)
      setUserEnrolledModules(userEnrolledModules.userEnrolledModules)
      // console.log(modules, userEnrolledModules)
    }

    getModulesInfo();
  }, [])


  return (
    <div className='bg-slate-950 flex flex-1 h-full w-full flex-col'>
      <main className='overflow-auto text-white flex flex-col w-full p-8'>
        <h2 className="bg-slate-200 p-4 text-4xl font-bold bg-gradient-to-br from-violet-600 to-cyan-300 inline-block text-transparent bg-clip-text">Look through the modules and learn something new!</h2>

        <Separator className="my-6" />
        <UserEnrolledModules userEnrolledModules={userEnrolledModules} />
        <Separator className="my-6" />
        <ShowModules modules={modules} userEnrolledModules={userEnrolledModules} />
      </main>
    </div>
  )
}


function UserEnrolledModules({ userEnrolledModules }) {
  // console.log("working")
  // console.log(userEnrolledModules)
  // console.log("working")
  return (userEnrolledModules) && (
    <div className="w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {userEnrolledModules.length > 0 ? (
        userEnrolledModules.map((module) => {
          if (module.module.published) {
            return (
              <UserEnrolledModule key={module.id} form={module} />
            )
          }
        })
      ) : (
        <div>
          You ave not practised any course yet!
        </div>
      )}
    </div>
  )
}

function UserEnrolledModule({ form }) {
  const { setCurrentUserEnrolledModuleId, setCurrentModuleId, setCurrentModuleName } = useStore()
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
            to={`/modules/${form.moduleId}`}
            onClick={() => {
              console.log(form)
              setCurrentUserEnrolledModuleId(form.id)
              setCurrentModuleId(form.moduleId)
              setCurrentModuleName(form.name)
            }}
          >
            Continue module <MoveRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}



// function ShowModules({ modules, userEnrolledModules }) {
//   return (
//     <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
//       {modules ? (
//         modules.map((module) => (
//           <ShowModule key={module.id} form={module} />
//         ))
//       ) : (
//         <div>
//           You have not practised any course yet!
//         </div>
//       )}
//     </div>
//   )
// }

function ShowModules({ modules, userEnrolledModules }) {
  // Filter out modules that are already enrolled by the user
  let filteredModules = [];
  if (modules) {
    filteredModules = modules.filter(module => {
      // Check if the module's ID is not in the list of userEnrolledModules IDs
      return !userEnrolledModules.some(userEnrolledModule => userEnrolledModule.moduleId === module.id);
    });
  }

  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {filteredModules.length > 0 ? (
        filteredModules.map((module) => (
          <ShowModule key={module.id} form={module} />
        ))
      ) : (
        <div>
          You have not practised any course yet!
        </div>
      )}
    </div>
  );
}

function ShowModule({ form }) {
  const { setCurrentModuleId, setCurrentModuleName, setCurrentUserEnrolledModuleId } = useStore()

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
            to={`/modules/${form.id}`}
            onClick={() => {
              setCurrentUserEnrolledModuleId("")
              setCurrentModuleId(form.id)
              setCurrentModuleName(form.name)
            }}
          >
            Try module
            <MoveRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Modules