import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { Eye, BookMarked, MousePointerClick, CircleArrowOutUpRight, Pencil, MoveRight, Plus, Trash2, ListChecks } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { Separator } from '../ui/separator';
import CreateModuleTopicBtn from '../public/card/CreateModuleTopicBtn';
import { DeleteUserModule, GetUserModules, GetUserModuleTopics, PublishUserModule } from '../../lib/queries/queries';
import { useAuth } from "../../lib/AuthContext";
import { useNavigate, redirect } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { formatDistance } from 'date-fns';
import { useLocation, useParams } from 'react-router-dom';
import useStore from '../../lib/statusMachine'
import { Switch } from '../ui/switch';


export default function CraftModuleTopics() {
    const { currentUserModuleName, currentUserModuleId, setCurrentModuleTopicPublished, currentUserModulePublished, setCurrentUserModulePublished } = useStore()
    const [modules, setModules] = useState()
    const navigate = useNavigate();
    const { id: ModuleId } = useParams();
    const { authState } = useAuth();
    const token = authState.token

    // console.log(currentUserModulePublished)

    useEffect(() => {
        const getUserModuleTopics = async () => {
            const fetchedModules = await GetUserModuleTopics(token, ModuleId);
            setModules(fetchedModules.moduleTopics)
        }
        setCurrentModuleTopicPublished(false)
        getUserModuleTopics();
    }, [])

    function publishedUserModule() {
        PublishUserModule(token, currentUserModuleId, !currentUserModulePublished)
        setCurrentUserModulePublished(!currentUserModulePublished)
    }

    const deleteUserModule = async () => {
        await DeleteUserModule(token, currentUserModuleId)
        navigate('/craftModules')
    }

    return (
        <div className='bg-slate-950 flex flex-1 h-full w-full flex-col'>
            {/* <nav>
            Nav
        </nav> */}
            <main className=' overflow-auto text-white flex flex-col w-full p-8'>
                <div className='flex flex-row justify-between items-end'>
                    <h2 className="flex flex-row items-end text-4xl font-bold col-span-2">
                        <h3 className='text-slate-400 mr-4 text-2xl'>Topics for:</h3>
                        {currentUserModuleName}
                    </h2>
                    <div className='flex flex-row gap-8 items-center'>
                        <h2 className='text-3xl text-white font-bold'>
                            Published
                        </h2>
                        <Switch
                            checked={currentUserModulePublished}
                            onCheckedChange={() => publishedUserModule()}
                        />
                    </div>
                </div>
                <Separator className="my-6" />
                <Suspense fallback={<StatsCards loading={true} />}>
                    <CardStatsWrapper />
                </Suspense>
                <Separator className="my-6" />
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                        <Suspense
                        // fallback={[1, 2, 3, 4].map((el) => (
                        //     <FormCardSkeleton key={el} />
                        // ))}
                        >
                            <FormCards modules={modules} />
                        </Suspense>

                    </div>
                </div>
                {/* <Button className="hover:bg-slate-800 bg-black absolute right-10 bottom-10 h-14 w-14 ring-2 ring-white">
                    <Plus size={24}/>
                </Button> */}
                <CreateModuleTopicBtn />
                <Separator className="mb-8 mt-6" />
                <div className='bg-red-950  p-4 border-2 rounded-md border-red-700 lg:w-[60%] w-[80%] flex flex-row gap-6 justify-between items-center'>
                    <div className=' font-bold '>
                        <h2 className='text-2xl mb-4 text-red-600'>
                            Danger Zone
                        </h2>
                        <p className=''>
                            If you delete this module you can not get it back. It will be deleted permanently.
                        </p>
                    </div>
                    <Button
                        variant={'destructive'}
                        onClick={() => deleteUserModule()}
                        className=''
                    >
                        <Trash2 />
                    </Button>
                </div>
            </main>
        </div>
    )
}

function CardStatsWrapper() {
    // const stats = GetFormStats();
    const stats = {
        visits: 12,
        submissions: 8,
        submissionRate: 0.78

    }
    return <StatsCards loading={false} data={stats} />
}

function StatsCards({ data, loading }) {

    return (
        <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
                title="Total visits"
                icon={<Eye className="text-blue-600" />}
                helperText="All time form visits"
                value={data?.visits.toLocaleString() || ""}
                loading={loading}
                className="bg-slate-950 text-white border-none shadow-md shadow-blue-600"
            />

            <StatsCard
                title="Total submissions"
                icon={<BookMarked className="text-yellow-600" />}
                helperText="All time form submissions"
                value={data?.submissions.toLocaleString() || ""}
                loading={loading}
                className="bg-slate-950 text-white border-none shadow-md shadow-yellow-600"
            />

            <StatsCard
                title="Submission rate"
                icon={<MousePointerClick className="text-green-600" />}
                helperText="Visits that result in form submission"
                value={data?.submissionRate.toLocaleString() + "%" || ""}
                loading={loading}
                className="bg-slate-950 text-white border-none shadow-md shadow-green-600"
            />

            <StatsCard
                title="Bounce rate"
                icon={<CircleArrowOutUpRight className="text-red-600" />}
                helperText="Visits that leaves without interacting"
                value={data?.submissionRate.toLocaleString() + "%" || ""}
                loading={loading}
                className="bg-slate-950 text-white border-none shadow-md shadow-red-600"
            />
        </div>
    )
}

export function StatsCard({
    title,
    value,
    icon,
    helperText,
    loading,
    className,
}) {
    return (
        <Card className={className}>
            {loading ? (
                <Skeleton>
                    <span className="opacity-0">0</span>
                </Skeleton>
            ) : (
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                    {!loading && value}
                    {icon}
                </CardHeader>
            )}
        </Card>
    );
}

function FormCardSkeleton() {
    return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />;
}

function FormCards({ modules }) {
    // console.log(modules)
    return (modules) && (
        <>
            {modules.map((module) => (
                <FormCard key={module.id} form={module} />
            ))}
        </>
    );
}

function FormCard({ form }) {
    const { setCurrentUserModuleTopicId, setCurrentUserModuleTopicName } = useStore()

    return (
        <Card className="bg-slate-950 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                    <span className="truncate font-bold">{form.name}</span>
                    {form.published && <Badge>Published</Badge>}
                    {!form.published && <Badge variant={"destructive"}>Draft</Badge>}
                </CardTitle>
                <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
                    {formatDistance(form.createdAt, new Date(), {
                        addSuffix: true,
                    })}
                    {form.published && (
                        <span className="flex items-center gap-2">
                            <Eye className="text-muted-foreground" />
                            {/* <span>{form.visits.toLocaleString()}</span> */}
                            <BookMarked className="text-muted-foreground" />
                            <span>{form.userEnrolledCount.toLocaleString()}</span>
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
                {form.description || "No description"}
            </CardContent>
            <CardFooter>
                {/* {form.published && (
                    <Button asChild className="bg-slate-950 ring-2 text-white ring-white w-full mt-2 text-md gap-4">
                        <Link href={`/forms/${form.id}`}>
                            View submissions <MoveRight />
                        </Link>
                    </Button>
                )}
                {!form.published && ( */}
                {form && (
                    <div className='w-full flex flex-col gap-4'>
                        <Button
                            asChild
                            // variant={"defaultMain"}
                            // className="w-full gap-4"
                            variant={"secondary"}
                            className=" bg-slate-950 hover:bg-slate-900 hover:text-white ring-2 text-slate-300 ring-white w-full mt-2 text-md gap-4"
                        >
                            <Link
                                to={`/craftModules/editor/${form.id}`}
                                onClick={() => {
                                    setCurrentUserModuleTopicId(form.id)
                                    setCurrentUserModuleTopicName(form.name)
                                    // console.log("🚀 ~ FormCard ~ form.name:", form.name)
                                }}
                            >
                                Edit form <Pencil />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            // variant={"defaultMain"}
                            // className="w-full gap-4"
                            variant={"secondary"}
                            className=" bg-slate-950 hover:bg-slate-900 hover:text-white ring-2 text-slate-300 ring-white w-full mt-2 text-md gap-4"
                        >
                            <Link
                                to={`/craftModules/submissions/${form.id}`}
                                onClick={() => {
                                    setCurrentUserModuleTopicId(form.id)
                                    setCurrentUserModuleTopicName(form.name)
                                    // console.log("🚀 ~ FormCard ~ form.name:", form.name)
                                }}
                            >
                                Answers <ListChecks />
                            </Link>
                        </Button>
                        
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}