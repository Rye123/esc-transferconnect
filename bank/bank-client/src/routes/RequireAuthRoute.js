import { useContext } from 'react'
import { Navigate } from 'react-router-dom';

/* Contexts */
import userContext from '../contexts/userContext';

/* Utils */
import Utils from '../utils/utils';

/**
 * Navigates to `route` if user is logged in, otherwise navigates to `Index`.
 * @param {Route} route
 */
const RequireAuthRoute = ({ children }) => {
    const userState = useContext(userContext);
    const user = userState.user;

    if (Utils.isEmptyObject(user))
        return (
            <Navigate to='/' />
        )
    return children;
}

export default RequireAuthRoute;