import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Button } from '@/components/ui/button';
import SideNavbar from '../components/home/SideNavbar';
// import { createBrowserRouter } from 'react-router-dom';
import { Outlet } from "react-router-dom";

const Home = () => {
  const { onLogout } = useAuth();

  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <div>Hello world!</div>,
  //   },
  // ]);

  return (
      <div className='flex w-full h-[100vh]'>
        <SideNavbar />

        <Outlet />
      </div>
  );
}

export default Home;
