import { Navigate } from 'react-router-dom';

/* Utils */
import Utils from '../utils/utils';

/* Hooks */
import { useUserAuth } from '../hooks/UserAuthContext';

/**
 * Index Page -- routes to `/login` or `/profile` depending on logged-in status
 */
const IndexPage = () => {
    const userAuth = useUserAuth();

    if (Utils.isEmptyObject(userAuth.user))
        return (<Navigate to='/login' />)
    return (<Navigate to='/profile' />)
}

export default IndexPage;