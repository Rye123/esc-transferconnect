import { createContext, useContext, useState } from 'react';
import user_auth_service from '../services/user_auth_service';
/**
 * Contains saved user context data for the app.
 */
const UserAuthContext = createContext();

export const UserAuthProvider = ({children }) => {
    const [user, setUser] = useState([]);

    user_auth_service.user_getinfo()
    .then(user => {
        setUser(user);
    })
    .catch(() => {
        setUser({});
    });
    
    const value = {
        user: user,
        login: async (credentials) => {
            return user_auth_service.user_login(credentials)
            .then(user => {
                setUser(user);
            });
        },
        logout: async() => {
            return user_auth_service.user_logout()
            .finally(() => {
                setUser({});
            })
        }
    }

    return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
}

export const useUserAuth = () => {
    return useContext(UserAuthContext);
}