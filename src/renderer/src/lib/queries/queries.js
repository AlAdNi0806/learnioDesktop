import axios from 'axios';

// const API_URL = "http://10.192.215.208:3000";
const API_URL = "https://expressserver-pq6l.onrender.com";
// const API_URL = "https://expressserver-pq6l.onrender.com";

// const API_URL = "https://expressserver-1.onrender.com";

// const API_URL = "https://expressserver-kgeo.onrender.com";

// const API_URL = "http://172.24.48.1:3000";
// const API_URL = "http://10.192.215.208:3000";
// const API_URL = "http://192.168.191.133:3000";


export const GetAiModules = async (token) => {
    const response = await axios.post(
        `${API_URL}/editor/getAiModules`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response)
    return (response.data)
}

export const MakeAiModule = async (token, aiModuleSubject) => {
    console.log("/n")
    console.log(token)
    console.log("/n")
    const response = await axios.post(
        `${API_URL}/editor/makeAiModule`,
        {
            aiModuleSubject: aiModuleSubject
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response)
    return (response.data)
}

export const DeleteAiModule = async (token, aiModuleId) => {
    const response = await axios.post(
        `${API_URL}/editor/deleteAiModule`,
        {
            id: aiModuleId
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}


export const GetAiModuleTopics = async (token, aiModuleId) => {
    const response = await axios.post(
        `${API_URL}/editor/getAiModuleTopics`,
        {
            aiModuleId: aiModuleId
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const MakeAiModuleTopic = async (token, aiModuleId, aiModuleTopicName) => {
    const response = await axios.post(
        `${API_URL}/editor/makeAiModuleTopic`,
        {
            aiModuleId: aiModuleId,
            aiModuleTopicName: aiModuleTopicName
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const DeleteAiModuleTopic = async (token, aiModuleId, aiModuleTopicId) => {
    const response = await axios.post(
        `${API_URL}/editor/deleteAiModuleTopic`,
        {
            aiModuleId: aiModuleId,
            aiModuleTopicId: aiModuleTopicId
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}


export const upsertUserEnrolledAiModule = async (token, aiModuleId) => {
    const response = await axios.post(
        `${API_URL}/user/upsertUserEnrolledAiModule`,
        {
            aiModuleId: aiModuleId,
            token: token
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const GetUserEnrolledAiModules = async (token) => {
    const response = await axios.post(
        `${API_URL}/user/getUserEnrolledAiModules`,
        {
            token: token
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}


export const UpsertUserEnrolledAiModuleTopic = async (token, userEnrolledAiModuleId, aiModuleTopicId) => {
    const response = await axios.post(
        `${API_URL}/user/upsertUserEnrolledAiModuleTopic`,
        {
            userEnrolledAiModuleId: userEnrolledAiModuleId,
            aiModuleTopicId: aiModuleTopicId,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const GetUserEnrolledAiModuleTopics = async (token, userEnrolledAiModuleId) => {
    const response = await axios.post(
        `${API_URL}/user/getUserEnrolledAiModuleTopics`,
        {
            userEnrolledAiModuleId: userEnrolledAiModuleId
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}


export const GenerateQuestions = async (token, topic, type, userEnrolledAiModuleTopicId) => {
    const response = await axios.post(
        `${API_URL}/user/generateQuestions`,
        {
            topic: topic,
            type: type,
            userEnrolledAiModuleTopicId: userEnrolledAiModuleTopicId
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}


export const MakeUserModule = async (token, values) => {
    const response = await axios.post(
        `${API_URL}/user/makeUserModule`,
        {
            token: token,
            values: values,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const PublishUserModule = async (token, moduleId, published) => {
    const response = await axios.post(
        `${API_URL}/user/publishUserModule`,
        {
            moduleId: moduleId,
            published: published,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const GetUserModules = async (token) => {
    const response = await axios.post(
        `${API_URL}/user/getUserModules`,
        {
            token: token,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const DeleteUserModule = async (token, moduleId) => {
    const response = await axios.post(
        `${API_URL}/user/deleteUserModule`,
        {
            moduleId: moduleId,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}


export const GetUserModuleTopics = async (token, userModuleId) => {
    const response = await axios.post(
        `${API_URL}/user/getUserModuleTopics`,
        {
            token: token,
            userModuleId: userModuleId
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const UpdateUserModuleTopicContent = async (token, userModuleTopicId, jsonElements) => {
    const response = await axios.post(
        `${API_URL}/user/updateUserModuleTopicContent`,
        {
            token: token,
            userModuleTopicId: userModuleTopicId,
            jsonElements: jsonElements
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const MakeUserModuleTopic = async (token, userModuleId, values) => {
    const response = await axios.post(
        `${API_URL}/user/makeUserModuleTopic`,
        {
            token: token,
            userModuleId: userModuleId,
            values: values
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const GetUserModuleTopicContent = async (token, userModuleTopicId) => {
    const response = await axios.post(
        `${API_URL}/user/getUserModuleTopicContent`,
        {
            token: token,
            userModuleTopicId: userModuleTopicId
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const PublishUserModuleTopic = async (token, userModuleTopicId, publishUserModuleTopic) => {
    const response = await axios.post(
        `${API_URL}/user/publishUserModuleTopic`,
        {
            token: token,
            userModuleTopicId: userModuleTopicId,
            publishUserModuleTopic: publishUserModuleTopic
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const PublishUserModuleTopicContent = async (token, userModuleTopicId, jsonElements) => {
    const response = await axios.post(
        `${API_URL}/user/publishUserModuleTopicContent`,
        {
            token: token,
            userModuleTopicId: userModuleTopicId,
            jsonElements: jsonElements
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}



export const GetUserEnrolledModules = async (token) => {
    const response = await axios.post(
        `${API_URL}/user/getUserEnrolledModules`,
        {
            token: token
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const GetModules = async (token) => {
    const response = await axios.post(
        `${API_URL}/user/getModules`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const GetModuleTopics = async (token, moduleId) => {
    const response = await axios.post(
        `${API_URL}/user/getModuleTopics`,
        {
            moduleId: moduleId
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const GetModuleTopicContent = async (token, moduleTopicId) => {
    const response = await axios.post(
        `${API_URL}/user/getModuleTopicContent`,
        {
            token: token,
            moduleTopicId: moduleTopicId
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const SubmitUserModuleTopic = async (token, moduleTopicId, moduleId, userEnrolledModuleId, jsonContent) => {
    const response = await axios.post(
        `${API_URL}/user/submitModuleTopic`,
        {
            token: token,
            moduleTopicId: moduleTopicId,
            moduleId: moduleId,
            userEnrolledModuleId: userEnrolledModuleId,
            jsonContent: jsonContent
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}


export const GetUserModuleTopicSubmissions = async (token, moduleTopicId) => {
    const response = await axios.post(
        `${API_URL}/user/getUserModuleTopicSubmissions`,
        {
            token: token,
            moduleTopicId: moduleTopicId,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}


export const GetControl = async (token, moduleTopicId) => {
    const response = await axios.post(
        `${API_URL}/control/getControl`,
        {
            token: token,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const ControlSearchUser = async (token, username) => {
    const response = await axios.post(
        `${API_URL}/control/controlSearchUser`,
        {
            token: token,
            username: username
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}

export const ControlUpdateUserRoles = async (token, userId, roles) => {
    const response = await axios.post(
        `${API_URL}/control/controlUpdateUserRoles`,
        {
            token: token,
            userId: userId,
            roles: roles
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    // console.log(response);
    return response.data;
}



