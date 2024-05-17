import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { Eye, BookMarked, MousePointerClick, CircleArrowOutUpRight, Pencil, MoveRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { Separator } from '../ui/separator';
import CreateModuleBtn from '../public/card/CreateModuleBtn';
import { GetUserModules } from '../../lib/queries/queries';
import { useAuth } from "../../lib/AuthContext";
import { useNavigate, redirect } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { formatDistance } from 'date-fns';
import useStore from '../../lib/statusMachine'


export default function CraftModule() {
    // const { currentModuleName } = useStore()
    const [modules, setModules] = useState()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const { authState } = useAuth();
    const token = authState.token
    const { setCurrentModuleTopicPublished } = useStore()

    useEffect(() => {
        const getUserModules = async () => {
            const fetchedModules = await GetUserModules(token);
            setModules(fetchedModules.modules)
        }
        setLoading(false)
        setCurrentModuleTopicPublished(false)

        getUserModules();
        setLoading(true)
    }, [])

    return (
        <div className='bg-slate-950 flex flex-1 h-full w-full flex-col'>
            {/* <nav>
            Nav
        </nav> */}
            <main className='overflow-auto text-white flex flex-col w-full p-8'>
                <Suspense fallback={<StatsCards loading={true} />}>
                    <CardStatsWrapper />
                </Suspense>
                <Separator className="my-6" />
                <h2 className="text-4xl font-bold col-span-2">Your Modules</h2>
                <Separator className="my-6" />
                <div className="grid gric-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CreateModuleBtn />
                    <Suspense
                        fallback={[1, 2, 3, 4].map((el) => (
                            <FormCardSkeleton key={el} />
                        ))}
                    >
                        <FormCards modules={modules} />
                    </Suspense>
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {loading && (
                        <Skeleton>
                            <span className="opacity-0">0</span>
                        </Skeleton>
                    )}
                    {!loading && value}
                </div>
                <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
            </CardContent>
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
    const { setCurrentUserModuleName, setCurrentUserModuleId, setCurrentUserModulePublished } = useStore()
    return (
        <Card className="bg-slate-950 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                    <span className="truncate font-bold">{form.name}</span>
                    {form.published && <Badge className=" bg-emerald-600 hover:bg-emerald-700">Published</Badge>}
                    {!form.published && <Badge variant={"destructive"}>Draft</Badge>}
                </CardTitle>
                <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
                    {formatDistance(form.createdAt, new Date(), {
                        addSuffix: true,
                    })}
                    {/* {form.published && (
                        <span className="flex items-center gap-2">
                            <Eye className="text-muted-foreground" />
                            <span>{form.visits.toLocaleString()}</span>
                            <BookMarked className="text-muted-foreground" />
                            <span>{form.submissions.toLocaleString()}</span>
                        </span>
                    )} */}
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
                )} */}
                {form && (
                    <Button
                        asChild
                        // variant={"defaultMain"}
                        // className="w-full gap-4"
                        variant={"secondary"}
                        className=" bg-slate-950 hover:bg-slate-900 hover:text-white ring-2 text-slate-300 ring-white w-full mt-2 text-md gap-4"
                    >
                        <Link
                            to={`/craftModules/${form.id}`}
                            onClick={() => {
                                setCurrentUserModulePublished(form.published)
                                setCurrentUserModuleId(form.id)
                                setCurrentUserModuleName(form.name)
                            }}
                        >
                            Edit form <Pencil />
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}