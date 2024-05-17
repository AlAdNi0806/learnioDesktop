import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { ArrowLeft, EllipsisVertical, FilePlus, MoveRight, Pencil, Plus, Trash, Trash2 } from 'lucide-react';
import { DeleteAiModule, GetAiModules, GetAllLinkedAiDirectoriesAndFiles, MakeAiModule } from '../../lib/queries/queries';
import { Button } from '../ui/button';
import { NewAiModule } from '../public/card/NewAiModule';
import { useNavigate, redirect, Link } from 'react-router-dom';
import { Separator } from '../ui/separator';
import UpsertAiElement from '../public/card/UpsertAiElement';
import { cn } from '../../lib/utils';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from '../ui/context-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import DeleteAiElement from '../public/card/DeleteAiElement';
import { TopicEditor } from '../craftAiModule/TopicEditor';

export default function CraftAiModules() {
    const { authState } = useAuth();
    const token = authState.token
    const [linkedModules, setLinkedModules] = useState({})
    const navigate = useNavigate();

    const [mainDirectory, setMainDirectory] = useState(null);
    const [targetPath, setTargetPath] = useState([]); // Default path
    const [directoryContents, setDirectoryContents] = useState([]);

    const [currentDirectories, setCurrentDirectories] = useState()
    const [currentFiles, setCurrentFiles] = useState()
    const [parentId, setParentId] = useState()
    const [currentDirectoryNames, setCurrentDirectoryNames] = useState()
    const [currentFileNames, setCurrenFileNames] = useState()
    const [currentDirectoryName, setCurrentDirectoryName] = useState('Ai Modules')
    const [deleteDialogueOpen, setDeleteDialogueOpen] = useState(false)
    const [upsertDialogueOpen, setUpsertDialogueOpen] = useState(false)

    const [topicEditorOpen, setTopicEditorOpen] = useState(false)

    const [fileTitle, setFileTitle] = useState('')
    const [fileId, setFileId] = useState('')

    const [deleteElementType, setDeleteElementType] = useState()
    const [deleteElement, setDeleteElement] = useState()

    const [upsertElementType, setUpserteElementType] = useState()
    const [upsertType, setUpserteType] = useState()
    const [upsertElement, setUpserteElement] = useState()


    useEffect(() => {
        let result;
        const fetchAiModules = async () => {
            result = await GetAllLinkedAiDirectoriesAndFiles(token)
            setCurrentDirectories(result.mainDirectory.children)
            setCurrentFiles(result.mainDirectory.files)
            setCurrentDirectoryNames(result.mainDirectory.children.map(directory => directory.title));
            setCurrenFileNames(result.mainDirectory.files.map(file => file.title));
            setParentId(result.mainDirectory.id)
            setLinkedModules(result.mainDirectory)
        };

        fetchAiModules()
    }, [])

    useEffect(() => {
        console.log('CMD', targetPath)
    }, [targetPath])

    const updateTargetPath = ({ newPath, goBack = false }) => {
        // Create a copy of the current target path
        let updatedPath = [...targetPath];

        if (goBack) {
            // Go back one level in the path
            updatedPath = updatedPath.slice(0, -1);
        } else {
            // Add the new directory to the path
            updatedPath = [...updatedPath, newPath];
        }

        // Set the updated target path
        setTargetPath(updatedPath);

        // Find the directories and files based on the updated path
        let currentDirectory = linkedModules;
        setParentId(currentDirectory.id)
        // console.log('CMD', updatedPath)
        let count = 0
        updatedPath.forEach(path => {
            console.log(count)
            // console.log(dir.title)
            // currentDirectory = currentDirectory.children.find(dir => dir.title === path);
            currentDirectory = currentDirectory.children.find((dir) => {
                console.log('DIR', dir.title)
                console.log('PATH', path)
                if (dir.title === path) {
                    count += 1
                    console.log('CORRECT')
                    setParentId(dir.id)
                    return dir
                }
                dir.title === path

            })

            console.log('CUR', currentDirectory)
        });

        // Update the current files and directories
        console.log('CURDIR', currentDirectory.children)

        if (updatedPath.length === 0) {
            setCurrentDirectoryName('Ai Modules')
        } else {
            setCurrentDirectoryName(currentDirectory.title)
        }

        setCurrentDirectoryNames(currentDirectory.children.map(directory => directory.title));
        setCurrenFileNames(currentDirectory.files.map(file => file.title));

        setCurrentDirectories(currentDirectory.children);
        setCurrentFiles(currentDirectory.files);
    };

    const updateAiModule = async () => {
        const result = await GetAllLinkedAiDirectoriesAndFiles(token)
        setLinkedModules(result.mainDirectory)

        // Find the directories and files based on the updated path
        let currentDirectory = result.mainDirectory;
        // console.log('CMD', updatedPath)
        let count = 0
        targetPath.forEach(path => {
            console.log(count)
            // console.log(dir.title)
            // currentDirectory = currentDirectory.children.find(dir => dir.title === path);
            currentDirectory = currentDirectory.children.find((dir) => {
                console.log('DIR', dir.title)
                console.log('PATH', path)
                if (dir.title === path) {
                    count += 1
                    console.log('CORRECT')
                    setParentId(dir.id)
                    return dir
                }
                dir.title === path

            })

            console.log('CUR', currentDirectory)
        });

        // Update the current files and directories
        console.log('CURDIR', currentDirectory.children)


        setCurrentDirectoryNames(currentDirectory.children.map(directory => directory.title));
        setCurrenFileNames(currentDirectory.files.map(file => file.title));

        setCurrentDirectories(currentDirectory.children);
        setCurrentFiles(currentDirectory.files);
    }

    const deleteElementFunction = ({ element, type }) => {
        console.log("CLICKED", element)
        setDeleteElement(element)
        setDeleteElementType(type)
        setDeleteDialogueOpen(true)
    }

    const upsertElementFunction = ({ element, type, elementType } = {}) => {
        console.log("CLICKED UPSERT", elementType);
        setUpserteType(type || null);
        setUpserteElement(element || null); // Provide a default value if element is undefined
        setUpserteElementType(elementType || null); // Provide a default value if type is undefined
        setUpsertDialogueOpen(true);
    };

    const openEditor = ({ fileType, fileTitle, fileId }) => {
        if (fileType === 'topic'){
            console.log('FILETYPE', fileType)
            console.log(fileId)
            setFileId(fileId)
            setFileTitle(fileTitle)
            setTopicEditorOpen(true)
        }
    }


    return (
        <div className='bg-slate-950 flex flex-1 h-full w-full flex-col'>
            <TopicEditor open={topicEditorOpen} setOpen={setTopicEditorOpen} fileTitle={fileTitle} fileId={fileId}/>
            {/* <nav>
            Nav
        </nav> */}
            <main className='overflow-auto text-white flex flex-col w-full p-8'>
                {/* <Suspense fallback={<StatsCards loading={true} />}>
                    <CardStatsWrapper />
                </Suspense> */}
                {/* <Separator className="my-6" /> */}
                <div
                    className='relative w-full flex justify-center'
                >
                    <Button
                        className={cn(
                            targetPath.length === 0 ? "hidden" : " block",
                            "absolute left-6 top-1 hover:bg-slate-800",
                        )}
                        onClick={() => {
                            updateTargetPath({ goBack: true })
                        }}
                    >
                        <ArrowLeft size={26} />
                    </Button>
                    <h2 className="text-4xl font-bold col-span-2 text-center max-w-[600px] truncate">{currentDirectoryName}</h2>
                </div>
                <Separator className="my-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DeleteAiElement element={deleteElement} type={deleteElementType} setDeleteDialogueOpen={setDeleteDialogueOpen} open={deleteDialogueOpen} updateAiModule={updateAiModule} />
                    {/* <UpsertAiElement parentId={parentId} currentDirectoryNames={currentDirectoryNames} currentFileNames={currentFileNames} updateAiModule={updateAiModule} /> */}
                    <UpsertAiElement parentId={parentId} currentDirectoryNames={currentDirectoryNames} currentFileNames={currentFileNames} updateAiModule={updateAiModule} open={upsertDialogueOpen} setUpsertDialogueOpen={setUpsertDialogueOpen} element={upsertElement} upsertType={upsertType} upsertElementType={upsertElementType} />
                    <Button
                        variant={"outline"}
                        className="bg-slate-950 hover:bg-slate-800 hover:text-white group border border-slate-600 h-[190px] items-center justify-center flex flex-col hover:border-slate-100 hover:cursor-pointer border-dashed gap-4"
                        onClick={() => { upsertElementFunction() }}
                    >
                        <FilePlus className="h-8 w-8 text-muted-foreground group-hover:text-white" />
                        <p className="font-bold text-xl text-muted-foreground group-hover:text-white">Create new element</p>
                    </Button>
                    <ElementCards elements={currentFiles} type={'file'} openEditor={openEditor} deleteElementFunction={deleteElementFunction} upsertElementFunction={upsertElementFunction} />
                    <ElementCards elements={currentDirectories} type={'directory'} updateTargetPath={updateTargetPath} deleteElementFunction={deleteElementFunction} upsertElementFunction={upsertElementFunction} />
                </div>
            </main>
        </div>
    )
}




function ElementCards({ elements, type, updateTargetPath, deleteElementFunction, upsertElementFunction, openEditor }) {
    // console.log('ELEMENTS', elements)
    return (elements) && (
        <>
            {elements.map((element) => (
                <ElementCard key={element.id} element={element} type={type} openEditor={openEditor} updateTargetPath={updateTargetPath} deleteElementFunction={deleteElementFunction} upsertElementFunction={upsertElementFunction} />
            ))}
        </>
    );
}

function ElementCard({ element, type, updateTargetPath, deleteElementFunction, upsertElementFunction, openEditor }) {
    // console.log(element)
    // const { setCurrentUserModuleName, setCurrentUserModuleId, setCurrentUserModulePublished } = useStore()
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Card
                    className={cn(
                        type === "directory" ? "border-indigo-600" : " border-pink-500",
                        "bg-slate-950 text-white h-[190px] border-[4px] relative",
                    )}
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="absolute top-[10px] right-[10px]">
                                <EllipsisVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40">

                            <DropdownMenuItem
                                className=" cursor-pointer"
                                onClick={() => { upsertElementFunction({ element, type: 'update', elementType: type }) }}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className=" bg-red-600 hover:bg-red-800 cursor-pointer"
                                onClick={() => { deleteElementFunction({ element, type }) }}
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center flex-row">
                            <p className='truncate text-2xl font-bold text-white m-0 p-0'> {/* Adjusted margin and padding */}
                                {element.title}
                            </p>
                            {type === 'file' && (
                                <p className='m-0 p-0'> {/* Adjusted margin and padding */}
                                    .{element.type}
                                </p>
                            )}
                        </CardTitle>
                        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">

                            <div className="truncate text-ellipsis">
                                {element.description || "No description"}
                            </div>


                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[20px] text-sm text-muted-foreground">
                        {element && (
                            <Button
                                asChild
                                variant={"secondary"}
                                className="bg-slate-950 hover:bg-slate-900 hover:text-white ring-2 text-slate-300 ring-white w-full mt-2 text-md gap-4 cursor-pointer"
                                onClick={() => {
                                    if (type === "directory") {
                                        updateTargetPath({ newPath: element.title });
                                    } else if (type === "file") {
                                        openEditor({ fileType: element.type, fileTitle: element.title, fileId: element.id })
                                    }
                                }}
                            >
                                <div>
                                    {type === "directory" ? 'Go to' : 'Edit'} {type === "directory" ? 'directory' : 'file'} {type === "directory" ? <MoveRight /> : <Pencil />}
                                </div>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
                <ContextMenuItem
                    inset
                    onClick={() => { upsertElementFunction({ element, type: 'update', elementType: type }) }}
                >
                    Edit
                    {/* <ContextMenuShortcut>⌘[</ContextMenuShortcut> */}
                </ContextMenuItem>
                <ContextMenuItem inset disabled>
                    Forward
                    {/* <ContextMenuShortcut>⌘]</ContextMenuShortcut> */}
                </ContextMenuItem>
                <ContextMenuItem
                    inset
                    className=" bg-red-600 hover:bg-red-800 cursor-pointer focus:bg-red-800 focus:text-white"
                    onClick={() => { deleteElementFunction({ element, type }) }}
                >
                    Delete
                    {/* <ContextMenuShortcut>⌘R</ContextMenuShortcut> */}
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}