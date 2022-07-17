import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

/* Utils */
import Utils from '../utils/utils';

/* Contexts */
import userContext from '../contexts/userContext';

/**
 * Index Page -- routes to `/login` or `/profile` depending on logged-in status
 */
const IndexPage = () => {
    const userState = useContext(userContext);
    const user = userState.user;

    if (Utils.isEmptyObject(user))
        return (<Navigate to='/login' />)
    return (<Navigate to='/profile' />)
}

export default IndexPage;