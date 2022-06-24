import React from 'react';

/* Services */
import auth_service from '../services/auth_service';

/* Utils */
import Utils from '../utils/utils';

/**
 * User Panel Component: Displays user information
 * @param {*} props Arguments given to this component
 * @param {*} props.user The user that is signed in.
 * @param {*} props.setUser Function that changes the signed-in user
 * @returns 
 */
const UserPanel = ({user, setUser}) => {
    //If user is not logged in, don't show the UserPanel
    if (Utils.isEmptyObject(user))
        return;

    //Otherwise, we show the UserPanel
    /* Event Handlers */
    const onClickLogout = (event) => {
        event.preventDefault();
        auth_service.user_logout(user.id)
        .then(() => {
        console.log("Successful logout.");
        })
        .catch(err => {
        console.error("Logout error", err);
        })
        .finally(() => {
        setUser({});
        });
    }

    return (
        <div>
        <h1>Welcome, {user.username}</h1>
        <div>
            <b>ID: </b> {user.id} <br />
            <b>Points: </b> {user.points || 0}
        </div>
        <button onClick={onClickLogout}>Log Out</button>
        </div>
    )
};

export default UserPanel;
