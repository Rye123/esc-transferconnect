import { Navigate, useLocation } from 'react-router-dom';

/* Hooks */
import { useUserAuth } from '../hooks/UserAuthContext';

/* Utils */
import Utils from '../utils/utils';

/**
 * Navigates to `route` if user is logged in, otherwise navigates to `Index`.
 * @param {Route} route
 */
const RequireAuthRoute = ({ children }) => {
    const userAuth = useUserAuth();
    const location = useLocation();

    if (Utils.isEmptyObject(userAuth.user))
        return (<Navigate to='/login' state={{ from: location }} replace />)
    return children;
}

export default RequireAuthRoute;