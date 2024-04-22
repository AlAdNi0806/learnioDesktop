import React from 'react'
import { useLocation, useParams } from 'react-router-dom';


const AiModuleTopicGame = () => {
    const { id: aiModuleTopicId } = useParams();
    return (
        <div>
            <h2>AI Module Topic Details</h2>
            <p>ID: {aiModuleTopicId}</p>
        </div>
    )
}

export default AiModuleTopicGame