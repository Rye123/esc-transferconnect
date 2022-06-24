import React from 'react';
import {useState} from 'react';

/* Services */
import auth_service from '../services/auth_service';

/* Utils */
import Utils from '../utils/utils';

/**
 * Login Form Component
 * @param {{user: string, setUser: Function}} props Arguments given to this component
 * - `user`: The user that is signed in.
 * - `setUser`: Function that changes the signed-in user
 * @returns 
 */
const LoginForm = ({user, setUser}) => {
    /* State Variables */
    const [usernameValue, setUsernameValue] = useState(""); // username text input for form
    const [passwordValue, setPasswordValue] = useState(""); // password text input for form

    // If user is logged in, don't show the LoginForm
    if (!Utils.isEmptyObject(user))
        return;


    // Otherwise, we show the LoginForm
    /* Event Handlers */
    const handleFormSubmission = (event) => {
        event.preventDefault(); // by default, refreshes the page. We don't want that here.

        // Credentials from the form
        const credentials = {
        username: usernameValue,
        password: passwordValue
        };

        // Clear input elements
        setUsernameValue("");
        setPasswordValue("");

        // Send POST request
        auth_service.user_login(credentials)
        .then(loggedInUser => {
            setUser(loggedInUser);
        })
        .catch(error => {
            alert("Authentication failed. Please reenter credentials.");
        });
    };

    return (
        <form onSubmit={handleFormSubmission}>
        <h1>Log in: </h1>
        Username: <input type="text"     value={usernameValue} onChange={(event) => setUsernameValue(event.target.value)} /><br />
        Password: <input type="password" value={passwordValue} onChange={(event) => setPasswordValue(event.target.value)} /><br />
        <button type="submit">Submit</button>
        </form>
    )
};

export default LoginForm;