import { Navigate } from 'react-router-dom';

/* Services */
import user_auth_service from '../services/user_auth_service';

/* Hooks */
import { useUserAuth } from '../hooks/UserAuthContext';

/**
 * Logout Route -- auto routes to `Index`.
 */
const LogoutRoute = () => {
    const userAuth = useUserAuth();

    userAuth.logout()
        .then(() => {
            console.log("Successful logout");
        })
        .catch(err => {
            console.error("LogoutRoute Error:", err);
        })
        .finally(() => {
            return (<Navigate to='/' />);
        });
}

export default LogoutRoute;