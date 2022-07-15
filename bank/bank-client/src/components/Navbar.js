import { useContext } from 'react'

/* Styling */
import './Navbar.css';

/* Services */
import auth_service from '../services/auth_service';

/* Utils */
import Utils from '../utils/utils';

/* Components */
import NavbarLink from './NavbarLink';

/* Contexts */
import userContext from '../contexts/userContext';

/**
 * Navbar Component: Displays navbar
 * @param {{user: string, setUser: Function}} props Arguments given to this component
 * - `user`: The user that is signed in.
 * - `setUser`: Function that changes the signed-in user
 * @returns 
 */
const Navbar = () => {
    const userState = useContext(userContext);
    const user = userState.user;

    // If user is not logged in, don't show user-only info
    if (Utils.isEmptyObject(user))
        return (
            <nav>
                <a href='/' className='site-title'>Digibank</a>
                <NavbarLink to='/login' content='Login' />
            </nav>
        )

    //Otherwise, we show the UserPanel

    return (
        <nav>
            <a href='/' className='site-title'>Digibank</a>
            <NavbarLink to='/profile' content='Profile' />
            <NavbarLink to='/loyalty_programs' content='Loyalty Programs' />
            <NavbarLink to='/transfer_history' content='Transfer History' />
            <NavbarLink to='/logout' content='Logout' />
        </nav>
    )
};

export default Navbar;
