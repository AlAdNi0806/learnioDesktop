import React, { useEffect, useState } from 'react'
import { Separator } from '../ui/separator'
import { useAuth } from '../../lib/AuthContext';
import useStore from '../../lib/statusMachine';
import { GetUserModuleTopicSubmissions } from '../../lib/queries/queries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '../../lib/utils';

function Submissions() {
    const [submissions, setSubmissions] = useState()
    const [latestVersion, setLatestVersion] = useState()


    const { authState } = useAuth();
    const token = authState.token
    const { currentUserModuleTopicId } = useStore()

    useEffect(() => {
        const getUserModuleTopicSubmissions = async () => {
            const moduleTopicSubmissions = await GetUserModuleTopicSubmissions(token, currentUserModuleTopicId)
            // const moduleTopicElements = JSON.parse(moduleTopicSubmissions.moduleTopic.moduleTopicSubmissions)
            console.log(moduleTopicSubmissions.moduleTopic.moduleTopicSubmissions)
            setSubmissions(moduleTopicSubmissions.moduleTopic.moduleTopicSubmissions)
            setLatestVersion(moduleTopicSubmissions.moduleTopic.version)
        }

        getUserModuleTopicSubmissions();
    }, [])
    return (
        <div className='bg-slate-950 flex flex-1 h-full w-full flex-col'>
            <main className='overflow-auto text-white flex flex-col w-full p-8'>
                <h2 className="bg-slate-200 p-4 text-4xl font-bold bg-gradient-to-br from-violet-600 to-cyan-300 inline-block text-transparent bg-clip-text">
                    Submissions
                </h2>

                <Separator className="my-6" />
                {submissions && (
                    <SubmissionTable submissions={submissions} latestVersion={latestVersion} />
                )}
            </main>
        </div>
    )
}


const InfiniteTabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <div className="w-full ">
            <div className="w-full p-1 bg-slate-900 rounded-md flex gap-4 justify-evenly">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={cn(
                            'w-full py-2 rounded-md',
                            activeTab === tab.id ? 'bg-slate-950' : ' text-gray-500'
                        )}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>
            <div className="mt-4">
                {tabs.map((tab) => (
                    <div key={tab.id} className={`${activeTab === tab.id ? 'block' : 'hidden'}`}>
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
};


function SubmissionTable({ submissions, latestVersion }) {

    console.log(latestVersion)
    // const tabs = [
    //     { id: 'tab1', title: 'Tab 1', content: 'Content for Tab 1' },
    //     { id: 'tab2', title: 'Tab 2', content: 'Contenasdt for Tab 2' },
    //     { id: 'tab3', title: 'Tabasdf 2', content: 'Contasdfent for Tab 2' },
    //     { id: 'tab4', title: 'Taasdfb 2', content: 'Content for Taasdfb 2' },
    //     { id: 'tab4f', title: 'Taasdfb 2', content: 'Content for Taasdfb 2' },
    //     // Add more tabs as needed
    // ];

    // const tabsSubmissions = submissions.map((submission, index) => ({
    //     id: `tab-${index}`, // Unique ID for each tab
    //     title: submission.moduleTopicVersion, // Assuming each submission has a title
    //     content: "something", // Assuming each submission has content
    //     // content: submission.content, // Assuming each submission has content
    // }));

    const filteredSubmissions = submissions.filter(submission => submission.moduleTopicVersion <= latestVersion);

    // Group submissions by moduleTopicVersion
    const groupedSubmissions = filteredSubmissions.reduce((acc, submission) => {
        const version = submission.moduleTopicVersion;
        if (!acc[version]) {
            acc[version] = [];
        }
        acc[version].push(submission);
        return acc;
    }, {});

    let tabsSubmissions = [];
    for (let i = 1; i <= latestVersion; i++) {
        tabsSubmissions.push({
            id: `tab-${i}`,
            title: `Version ${i}`,
            content: "working"
        });
    }
    console.log(tabsSubmissions);
    // Create tabs based on the grouped submissions
    const tabs = Object.keys(groupedSubmissions).map((version, index) => ({
        id: `tab-${index}`, // Unique ID for each tab
        title: `Version ${version}`, // Use the version as the tab title
        content: groupedSubmissions[version].map((submission, idx) => (
            <div key={idx}>{submission.content}</div> // List submissions for each version
        )),
    }));

    return (
        <div>
            <InfiniteTabs tabs={tabsSubmissions} />

        </div>
    )
}



export default Submissions