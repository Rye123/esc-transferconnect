import React from 'react';

/* Styling */
import './UserPanel.css';

/* Services */
import auth_service from '../services/auth_service';

/* Utils */
import Utils from '../utils/utils';

/**
 * User Panel Component: Displays user information
 * @param {{user: string, setUser: Function}} props Arguments given to this component
 * - `user`: The user that is signed in.
 * - `setUser`: Function that changes the signed-in user
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
            <img className ="wave" src='/images/wave.png'></img>
            <div className = "container">
                <div className = "img">
                    <img src= "/images/UserPanel.svg" alt="Profile Page"></img>
                </div>
                <div className = "display-container">
                    <div>
                        <div>
                            <h2>Welcome, {user.username} </h2><br></br>
                            <b>Your User ID is: </b> {user.id} <br></br><br></br>
                            <b>The number of points you have: </b> {user.points || 0} <br></br><br></br>
                        </div>
                        <button className = "btn" onClick={onClickLogout}>Log Out</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default UserPanel;
