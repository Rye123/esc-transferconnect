import { useContext } from 'react'
import { Navigate } from 'react-router-dom';

/* Services */
import user_auth_service from '../services/user_auth_service';

/* Contexts */
import userContext from '../contexts/userContext';

const Logout = () => {
    const userState = useContext(userContext);
    const user = userState.user;
    const setUser = userState.setUser;

    user_auth_service.user_logout(user.id)
        .then(() => {
            console.log("Successful Logout");
            setUser({});
        })
        .catch(err => {
            console.error("Logout error", err);
        })
        .finally(() => {
            return (
                <Navigate to='/' />
            )
        });
}

export default Logout;