import React, { useEffect, useState } from 'react'
import { Separator } from '../ui/separator'
import { useAuth } from '../../lib/AuthContext';
import useStore from '../../lib/statusMachine';
import { GetUserModuleTopicSubmissions } from '../../lib/queries/queries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '../../lib/utils';
// import { DataTable } from './submissions/DataTable';

import { tasks } from './tasks'
import { DataTableDemo } from './submissions/DataTable';
// import { columns } from "./submissions/Columns"


function Submissions() {
    const [submissions, setSubmissions] = useState()
    const [latestVersion, setLatestVersion] = useState()
    const [publishedVersions, setPublishedVersions] = useState()



    const { authState } = useAuth();
    const token = authState.token
    const { currentUserModuleTopicId } = useStore()


    useEffect(() => {
        const getUserModuleTopicSubmissions = async () => {
            const moduleTopicSubmissions = await GetUserModuleTopicSubmissions(token, currentUserModuleTopicId)
            // const moduleTopicElements = JSON.parse(moduleTopicSubmissions.moduleTopic.moduleTopicSubmissions)
            console.log(moduleTopicSubmissions)
            const versionsContent = JSON.parse(moduleTopicSubmissions.moduleTopic.publishedContent)
            const numberOfProperties = Object.keys(versionsContent).length;
            console.log(versionsContent)
            setPublishedVersions(versionsContent)
            setSubmissions(moduleTopicSubmissions.moduleTopic.moduleTopicSubmissions)
            setLatestVersion(numberOfProperties)

        }

        getUserModuleTopicSubmissions();
    }, [])
    return (
        <div className='bg-slate-950 flex flex-1 h-full w-full flex-col'>
            {/* flex justify-center w-full h-full items-center p-8 overflow-hidden */}
            <main className=' text-white flex flex-col w-full p-8 pr-40 '>
                <h2 className="bg-slate-200 p-4 text-4xl font-bold bg-gradient-to-br from-violet-600 to-cyan-300 inline-block text-transparent bg-clip-text">
                    Submissions
                </h2>

                <Separator className="my-6" />
                {submissions && (
                    <SubmissionTable submissions={submissions} latestVersion={latestVersion} publishedVersions={publishedVersions} />
                )}
            </main>
        </div>
    )
}


// const InfiniteTabs = ({ tabs }) => {
//     const [activeTab, setActiveTab] = useState(tabs[0].id);

//     return (
//         <div className="w-full ">
//             <div className="w-full p-1 bg-slate-900 rounded-md flex gap-4 justify-evenly">
//                 {tabs.map((tab) => (
//                     <button
//                         key={tab.id}
//                         className={cn(
//                             'w-full py-2 rounded-md',
//                             activeTab === tab.id ? 'bg-slate-950' : ' text-gray-500'
//                         )}
//                         onClick={() => setActiveTab(tab.id)}
//                     >
//                         {tab.title}
//                     </button>
//                 ))}
//             </div>
//             <div className="mt-4">
//                 {tabs.map((tab) => (
//                     <div key={tab.id} className={`${activeTab === tab.id ? 'block' : 'hidden'}`}>
//                         {tab.content}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };


function SubmissionTable({ submissions, latestVersion, publishedVersions }) {
    console.log('HALI', submissions)
    const [parsedArraysState, setParsedArraysState] = useState([]);
    const [data, setData] = useState()

    function parseAndReturnArray(value) {
        try {
            // Attempt to parse the JSON string into an array
            const parsedArray = JSON.parse(value);
            return parsedArray;
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return [];
        }
    }

    // Mapping over the object
    useEffect(() => {
        setParsedArraysState([])
        Object.values(publishedVersions).forEach((value) => {
            // const updatedValue = value.map((element) => {
            //     console.log(element)
            // });

            const parsedArray = parseAndReturnArray(value);
            // Update the state with the new parsed array
            setParsedArraysState(prevState => [...prevState, parsedArray]);
        });
    }, [])



    const groupedData = {};

    // for (let version = 1; version > latestVersion; version++) {
    //     groupedData[version].push({
    //         // ...JSON.parse(item.content),
    //         // fullName: item.userFullName,
    //         // id: item.id
    //         info: '-'
    //     });
    // }

    submissions.forEach(item => {
        const version = item.moduleTopicVersion;
        if (!groupedData[version]) {
            groupedData[version] = [];
        }
        groupedData[version].push({
            ...JSON.parse(item.content),
            fullName: item.userFullName,
            id: item.id
        });
        // groupedData[version].push({'fullName' : item.userFullName})
        // groupedData[version]['id'] = item.id
    });


    // Example usage of the state
    console.log('ONE', parsedArraysState);
    console.log('ONE', groupedData);

    // console.log(latestVersion)
    // // const tabs = [
    // //     { id: 'tab1', title: 'Tab 1', content: 'Content for Tab 1' },
    // //     { id: 'tab2', title: 'Tab 2', content: 'Contenasdt for Tab 2' },
    // //     { id: 'tab3', title: 'Tabasdf 2', content: 'Contasdfent for Tab 2' },
    // //     { id: 'tab4', title: 'Taasdfb 2', content: 'Content for Taasdfb 2' },
    // //     { id: 'tab4f', title: 'Taasdfb 2', content: 'Content for Taasdfb 2' },
    // //     // Add more tabs as needed
    // // ];

    // // const tabsSubmissions = submissions.map((submission, index) => ({
    // //     id: `tab-${index}`, // Unique ID for each tab
    // //     title: submission.moduleTopicVersion, // Assuming each submission has a title
    // //     content: "something", // Assuming each submission has content
    // //     // content: submission.content, // Assuming each submission has content
    // // }));



    // const filteredSubmissions = submissions.filter(submission => submission.moduleTopicVersion <= latestVersion);

    // // Group submissions by moduleTopicVersion
    // const groupedSubmissions = filteredSubmissions.reduce((acc, submission) => {
    //     const version = submission.moduleTopicVersion;
    //     if (!acc[version]) {
    //         acc[version] = [];
    //     }
    //     acc[version].push(submission);
    //     return acc;
    // }, {});

    // let tabsSubmissions = [];
    // for (let i = 1; i <= latestVersion; i++) {
    //     tabsSubmissions.push({
    //         id: `tab-${i}`,
    //         title: `Version ${i}`,
    //         content: "working"
    //     });
    // }
    // console.log(tabsSubmissions);
    // // Create tabs based on the grouped submissions
    // const tabs = Object.keys(groupedSubmissions).map((version, index) => ({
    //     id: `tab-${index}`, // Unique ID for each tab
    //     title: `Version ${version}`, // Use the version as the tab title
    //     content: groupedSubmissions[version].map((submission, idx) => (
    //         <div key={idx}>{submission.content}</div> // List submissions for each version
    //     )),
    // }));

    // const formElements = JSON.parse(form.content) as FormElementInstance[];
    // const columns: {
    //     id: string;
    //     label: string;
    //     required: boolean;
    //     type: ElementsType;
    // }[] = [];



    return (
        <div className='w-full'>
            {latestVersion && (
                <Tabs defaultValue="account" className="w-full overflow-hidden">
                    <TabsList className={cn('grid')} style={{ gridTemplateColumns: `repeat(${latestVersion}, 1fr)` }}>
                        {/* <p>{latestVersion}</p> */}
                        {/* <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger> */}
                        {parsedArraysState.map((item, index) => (
                            <TabsTrigger value={index + 1}>{index + 1}</TabsTrigger>
                        ))}
                    </TabsList>
                    {parsedArraysState.map((item, index) => (
                        <TabsContent value={index + 1}>
                            {groupedData[index + 1] ? (
                                <DataTableDemo publishedContent={parsedArraysState[index]} data={groupedData[index + 1]} />
                            ) : (
                                <div className='w-full flex justify-center p-16 border rounded-full mt-6'>
                                    <p>No records.</p>
                                </div>
                            )}

                        </TabsContent>
                    ))}
                    {/* <TabsContent value="name">

<DataTableDemo />
</TabsContent> */}
                </Tabs>
            )}
            {/* <InfiniteTabs tabs={tabsSubmissions} /> */}
            {/* <DataTable data={tasks} /> */}
        </div>
    )
}



export default Submissions