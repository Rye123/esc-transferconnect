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
            <head>
                <title>LoginForm</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                <link rel="stylesheet" href='/styles/login.css'></link>
                <link href="https://fonts.googleapis.com/css?family=Poppins:600&display=swap" rel="stylesheet"></link>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
            </head>
            <body>
                <img class ="wave" src='/images/wave.png' alt = "Green wave"></img>
                <div class = "container">
                    <div class = "img">
                        <img src='/images/vault.svg' alt="Banking app"></img>
                    </div>
                    <div class = "login-container">
                        <form>
                            <img class="avatar" src='/images/profile.svg' alt="Profile"></img>
                            <h2>Digibank</h2>
                            <div class="input-div one">
                                <div class= "i">
                                    <i class="material-icons">person</i>
                                </div>
                                <div>
                                    <input class = "input" type="text" placeholder='Username' value={usernameValue} onChange={(event) => setUsernameValue(event.target.value)} /><br />
                                </div>
                            </div>
                            <div class="input-div two">
                                <div class= "i">
                                <i class="material-icons">lock</i>
                                </div>
                                <div>
                                    <input class = "input" type="password" placeholder='Password' value={passwordValue} onChange={(event) => setPasswordValue(event.target.value)} /><br />
                                </div>
                            </div>
                            <button class = "btn" type="submit">Login</button>
                        </form>
                    </div>
                </div>
            </body>
        </form>
    )
};

export default LoginForm;