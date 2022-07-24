import { NavLink } from 'react-router-dom';

/**
 * A link on the Navbar.
 * @param {{to, content}} 
 * - `to`: Link location
 * - `content`: Link title
 * @returns 
 */
const NavbarLink = ({ to, content }) => {
    return (
        <NavLink className={({ isActive }) => isActive ? "active" : ""} to={to}>{content}</NavLink>
    )
}

export default NavbarLink;