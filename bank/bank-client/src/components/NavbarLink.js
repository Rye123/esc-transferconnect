import { NavLink } from 'react-router-dom';

const NavbarLink = ({to, content}) => {
    return (
        <NavLink className={ ({isActive}) => isActive ? "active" : ""} to={to}>{content}</NavLink>
    )
}

export default NavbarLink;