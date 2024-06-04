import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const TOKEN_KEY = 'my-jwt';
const API_URL = "https://z38rh8lf-3000.euw.devtunnels.ms";
// const API_URL = "http://10.192.215.208:3000";
// const API_URL = "http://192.168.191.133:3000";

const AuthContext = createContext({});


export const useAuth = () => {
   return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
   const [authState, setAuthState] = useState({
      token: null,
      authenticated: false,
   });

   useEffect(() => {
      const loadToken = async () => {
         const db = await openDB('authDB', 1, {
            upgrade(db) {
               db.createObjectStore('auth');
            },
         });
         const transaction = db.transaction(['auth'], 'readonly');
         const objectStore = transaction.objectStore('auth');
         const getRequest = objectStore.get(TOKEN_KEY);

         getRequest.onsuccess = function (event) {
            const token = event.target.result;
            console.log("🚀 ~ loadToken ~ token:", token);

            if (token) {
               axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
               setAuthState({
                  token: token,
                  authenticated: true,
               });
            }
         };
      };
      loadToken();
   }, []);

   const register = async (fullName, username, password) => {
      try {
         const result = await axios.post(`${API_URL}/auth/register`, { fullName, username, password, language: 'en' });
         return { success: true };
      } catch (error) {
         if (error.response) {
            console.log(error.response.data);
            return { success: false, message: error.response.data };
         } else if (error.request) {
            console.log(error.request);
            return { success: false, message: 'No response received from the server.' };
         } else {
            console.log('Error', error.message);
            return { success: false, message: error.message };
         }
      }
   };

   const login = async (username, password) => {
      try {
         const result = await axios.post(`${API_URL}/auth/login`, { username, password });
         console.log("🚀 ~ login ~ result:", result);
   
         setAuthState({
            token: result.data.token,
            authenticated: true,
         });
   
         axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
         const db = await openDB('authDB', 1, {
            upgrade(db) {
               db.createObjectStore('auth');
            },
         });
         const transaction = db.transaction(['auth'], 'readwrite');
         const store = transaction.objectStore('auth');
         await store.put(result.data.token, TOKEN_KEY);
   
         return { success: true };
   
      } catch (error) {
         if (error.response) {
            console.log(error.response.data);
            return { success: false, message: error.response.data };
         } else if (error.request) {
            console.log(error.request);
            return { success: false, message: 'No response received from the server.' };
         } else {
            console.log('Error', error.message);
            return { success: false, message: error.message };
         }
      }
   };

   const logout = async () => {
      const db = await openDB('authDB', 1, {
         upgrade(db) {
            db.createObjectStore('auth');
         },
      });
      const transaction = db.transaction(['auth'], 'readwrite');
      const store = transaction.objectStore('auth');
      await store.delete(TOKEN_KEY);
      axios.defaults.headers.common['Authorization'] = '';
      setAuthState({
         token: null,
         authenticated: false,
      });
   };

   const value = {
      onRegister: register,
      onLogin: login,
      onLogout: logout,
      authState,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper function to open or create an IndexedDB database
async function openDB(name, version, { upgrade }) {
   return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, version);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
         upgrade(event.target.result);
      };
   });
}
