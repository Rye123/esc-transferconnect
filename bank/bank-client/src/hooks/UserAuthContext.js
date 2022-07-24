import { createContext, useContext, useEffect, useState } from 'react';
import user_auth_service from '../services/user_auth_service';
/**
 * Contains saved user context data for the app.
 */
const UserAuthContext = createContext();
const localStorageUserVar = 'user';

const storeUserLocally = (user) => {
    localStorage.setItem(localStorageUserVar, JSON.stringify(user));
}

const getUserLocally = () => {
    return JSON.parse(localStorage.getItem(localStorageUserVar)) || {}
}

export const UserAuthProvider = ({children }) => {
    const [user, setUser] = useState(getUserLocally());

    useEffect(() => {
        user_auth_service.user_getinfo()
        .then(user => {
            setUser(user);
            storeUserLocally(user);
        })
        .catch(() => {
            setUser({});
            storeUserLocally({});
        });
    }, []);


    const value = {
        user: user,
        login: async (credentials) => {
            return user_auth_service.user_login(credentials)
            .then(user => {
                setUser(user);
                storeUserLocally(user);
            });
        },
        logout: async() => {
            return user_auth_service.user_logout()
            .finally(() => {
                setUser({});
                storeUserLocally({});
            })
        }
    }

    return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
}

export const useUserAuth = () => {
    return useContext(UserAuthContext);
}