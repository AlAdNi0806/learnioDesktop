import React from 'react'
import { useLocation } from 'react-router-dom';

const Welcome = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  console.log(currentPath)

  return (
    <div>
      aiModuleTopic
      <p>Current Path: {currentPath}</p>
    </div>
  );
}

export default Welcome