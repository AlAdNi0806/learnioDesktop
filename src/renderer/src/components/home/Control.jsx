import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { ControlSearchUser, ControlUpdateUserRoles, GetControl } from '../../lib/queries/queries'
import { Separator } from '../ui/separator'
import { Search, Shell, X } from 'lucide-react'
import { useAuth } from '../../lib/AuthContext'
import { formatDistance } from 'date-fns'
import { Button } from '../ui/button'

function Control() {

  const [roles, setRoles] = useState([])
  const [searchUsername, setSearchUsername] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [userRoles, setUserRoles] = useState([])
  const [userFound, setUserFound] = useState(false);
  const [pending, setPending] = useState(false)
  const [rolesPending, setRolesPending] = useState(false)

  const { authState } = useAuth();
  const token = authState.token

  useEffect(() => {
    const controls = async () => {
      const result = await GetControl()
      setRoles(result.roles)
      console.log(result)
    }
    controls()
  }, [])

  const searchUser = async (username) => {
    setUserFound(false)
    setPending(true)
    const result = await ControlSearchUser(token, username)
    if (result.user) {
      console.log(result.user)
      setUserFound(true)
      setUserDetails(result.user)
      setUserRoles(result.user.roles)
    }
    setPending(false)

  };

  const saveUserRoles = async () => {
    // const upperCaseUserRoles = userRoles.map(role => role.toUpperCase());
    console.log("called")
    setRolesPending(true)
    await ControlUpdateUserRoles(token, userDetails.id, userRoles)
    setRolesPending(false)
  }


  return (
    <main
      className='h-full w-full p-8 bg-slate-950'
    >
      <div className='w-full'>
        <h2 className='p-4 text-4xl font-bold bg-gradient-to-br from-violet-600 to-cyan-300 inline-block text-transparent bg-clip-text'>
          Search for people and their roles
        </h2>
        <Separator className="mb-8" />
        <div className='mb-8'>
          <h3 className='text-2xl font-bold mb-4'>
            Roles:
          </h3>
          <div className='flex flex-row gap-4'>
            {roles.map((role, index) => (
              <div
                className=' rounded-md bg-cyan-900 text-white text-center lowercase px-2'
                key={index}
              >
                {role}
              </div>
            ))}
          </div>
        </div>
        <Separator className="mb-8" />
        <div className='w-full'>
          <h3 className='text-2xl font-bold mb-4'>
            Search a person:
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent the default form submission behavior
              searchUser(searchUsername); // Call your function with the parameter
            }}
            className='flex flex-row gap-4'
          >
            <Input
              className="rounded-full text-lg p-6"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
            />
            <button
              type="submit"
              className='hover:bg-cyan-950 w-40 ring-2 ring-white rounded-full flex justify-center items-center cursor-pointer'
              disabled={pending}
            >
              <Search />
            </button>
          </form>
          <div className='w-full'>
            {pending ? (
              <div className='mt-16 w-full h-full text-xl font-bold flex justify-center'>
                <Shell className='animate-spin' />
              </div>
            ) : (
              userFound ? (
                <div className='py-8'>
                  <h3 className='text-2xl font-bold mb-8 bg-gradient-to-br from-violet-600 to-cyan-300 inline-block text-transparent bg-clip-text'>
                    {userDetails.username}
                  </h3>
                  <h3 className='text-xl mb-4'>
                    Full Name - {userDetails.fullName}
                  </h3>
                  <h3 className='text-xl mb-8'>
                    Created at - {userDetails.createdAt}
                  </h3>
                  <div className='w-full p-4 ring-2 ring-white rounded-md'>
                    <div className='flex flex-row flex-wrap justify-between gap-4 mb-4'>
                      <div className='flex flex-row flex-wrap gap-4 items-center'>
                        {roles.filter(role => !userRoles.includes(role)).map((role, index) => (
                          <div
                            className='cursor-pointer rounded-full bg-cyan-900 text-white text-center lowercase px-2 h-6'
                            key={index}
                            onClick={() => {
                              setUserRoles([...userRoles, role]);
                            }}
                          >
                            {role}
                          </div>
                        ))}
                      </div>
                      <button
                        className='hover:bg-slate-800 ring-2 ring-white p-2 w-32 rounded-md'
                        onClick={() => saveUserRoles()}
                        disabled={pending}
                      >
                        {rolesPending ? (
                          <div className='w-full h-full text-xl font-bold flex justify-center'>
                            <Shell className='animate-spin' />
                          </div>
                        ) : (
                          <p>
                            Save
                          </p>
                        )}
                      </button>
                    </div>
                    <Separator className="mb-4" />
                    <div className='flex flex-wrap flex-row gap-4 '>
                      {userRoles.map((role, index) => (
                        <div
                          className='flex flex-row items-center justify-center gap-2 rounded-full bg-cyan-900 text-white text-center lowercase px-2'
                          key={index}
                        >
                          <p
                            className='text-center'
                          >
                            {role}
                          </p>
                          <X
                            className='cursor-pointer'
                            onClick={() => {
                              setUserRoles(userRoles.filter(userRole => userRole !== role));
                            }}
                            size={16}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className='mt-16 w-full h-full text-xl font-bold text-center'>
                  No user found ...
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </main >
  )
}

export default Control