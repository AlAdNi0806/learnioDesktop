import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider, useAuth } from './lib/AuthContext'

import { BrowserRouter as Router, Route, Routes, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Auth from './routes/Auth'
import Home from './routes/Home'
import Welcome from './components/home/Welcome'
import CraftAiModules from './components/home/CraftAiModules'
import Profile from './components/home/Profile'
import SideNavbar from './components/home/SideNavbar'
import AiModuleTopics from './components/aiModule/AiModuleTopics'
import AiModuleTopicGame from './components/aiModule/AiModuleTopicGame'
import UserEnrolledAiModules from './components/home/UserEnrolledAiModules'
import UserEnrolledAiModuleTopicGame from './components/userEnrolledAiModule/UserEnrolledAiModuleTopicGame'
import UserEnrolledAiModuleTopics from './components/userEnrolledAiModule/UserEnrolledAiModuleTopics'
import CraftModule from './components/home/CraftModule'
import DesignerContextProvider from './components/context/designerContext'
import FormBuilder from './components/craftModule/FormBuilder'
import CraftModuleTopics from './components/craftModule/CraftModuleTopics'
import Modules from './components/home/Modules'
import ModuleTopics from './components/modules/ModuleTopics'
import ModuleTopicForm from './components/modules/ModuleTopicForm'
import Submissions from './components/craftModule/Submissions'
import Control from './components/home/Control'


// export const Layout = () => {
//   const { authState, onLogout } = useAuth();

//   console.log(authState?.authenticated)
//   return (
//     <Router>
//       <Routes>
//         {authState?.authenticated ? (
//           <>
//             <Route path="/" element={<Home onLogout={onLogout} />}>
//               <Route path="welcome" element={<Welcome />} />
//               <Route path="aiModule" element={<AiModule />} />
//               <Route path="profile" element={<Profile />} />
//             </Route>
//           </>
//         ) : (
//           <Route path="/" element={<Auth />} />
//         )}
//       </Routes>
//     </Router>
//   );
// };

export const MainLayout = () => {
  const { authState } = useAuth();

  console.log(authState?.authenticated)
  return (
    <Router>
      <Routes>
        {authState?.authenticated ? (
          <Route path="/" element={<Home />}>
            <Route path="welcome" element={<Welcome />} />
            <Route path="aiModules" element={<CraftAiModules />}/>
            <Route path="aiModules/:id" element={<AiModuleTopics />}></Route>
            <Route path="aiModules/topics/:id" element={<AiModuleTopicGame />}></Route>
            <Route path="userEnrolledAiModules" element={<UserEnrolledAiModules />}/>
            <Route path="userEnrolledAiModules/:id" element={<UserEnrolledAiModuleTopics />}></Route>
            <Route path="userEnrolledAiModules/userEnrolledAiModuleTopics/:id" element={<UserEnrolledAiModuleTopicGame />}></Route>
            <Route path="craftModules" element={<CraftModule />} />
            <Route path="craftModules/:id" element={<CraftModuleTopics />} />
            <Route path="craftModules/submissions/:id" element={<Submissions />} />
            <Route path="craftModules/editor/:id" element={<FormBuilder />} />
            <Route path="modules" element={<Modules />} />
            <Route path="modules/:id" element={<ModuleTopics />} />
            <Route path="modules/topics/:id" element={<ModuleTopicForm />} />
            <Route path="Control" element={<Control />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </Router>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <DesignerContextProvider>
        <MainLayout>
        </MainLayout>
      </DesignerContextProvider>
    </AuthProvider>
  </React.StrictMode>
)
