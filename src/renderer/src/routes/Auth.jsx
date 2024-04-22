// App.js
import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';

const Auth = () => {
 const [isLoginActive, setIsLoginActive] = useState(true);

 const switchForm = () => {
    setIsLoginActive(!isLoginActive);
 };

 return (
    <div>
      {isLoginActive ? (
        <Login onSwitch={switchForm} />
      ) : (
        <Register onSwitch={switchForm} />
      )}
    </div>
 );
};

export default Auth;
