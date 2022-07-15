import {useState, useContext} from 'react';
import { Navigate } from 'react-router-dom';

/* Styling */
import './Login.css';

/* Services */
import auth_service from '../services/auth_service';

/* Utils */
import Utils from '../utils/utils';

/* Contexts */
import userContext from '../contexts/userContext';

/**
 * Login Form Component
 * - `user`: The user that is signed in.
 * - `setUser`: Function that changes the signed-in user
 * @returns 
 */
const Login = () => {
    const userState = useContext(userContext);
    const user = userState.user;
    const setUser = userState.setUser;

    /* State Variables */
    const [usernameValue, setUsernameValue] = useState(""); // username text input for form
    const [passwordValue, setPasswordValue] = useState(""); // password text input for form

    // If user is logged in, don't show the Login
    if (!Utils.isEmptyObject(user))
        return (
            <Navigate to='/' />
        )


    // Otherwise, we show the Login
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
            // redirect to profile
            console.log("going to /")
            return (
                <Navigate to='/' />
            )
        })
        .catch(error => {
            alert("Authentication failed. Please reenter credentials.");
        });
    };

    return (
        <>
            <img className ="wave" src='/images/wave.png'></img>
            <div className = "container">
                <div className = "img">
                    <img src='/images/vault.svg' alt="Banking app"></img>
                </div>
                <div className = "login-container">
                    <form onSubmit={handleFormSubmission}>
                        <img className="avatar" src='/images/profile.svg' alt="Profile"></img>
                        <h2>Digibank</h2>
                        <div className="input-div one">
                            <div className= "i">
                                <i className="material-icons">person</i>
                            </div>
                            <div>
                                <input className = "input" type="text" placeholder='Username' value={usernameValue} onChange={(event) => setUsernameValue(event.target.value)} /><br />
                            </div>
                        </div>
                        <div className="input-div two">
                            <div className= "i">
                            <i className="material-icons">lock</i>
                            </div>
                            <div>
                                <input className = "input" type="password" placeholder='Password' value={passwordValue} onChange={(event) => setPasswordValue(event.target.value)} /><br />
                            </div>
                        </div>
                        <button className = "btn" type="submit">Login</button>
                    </form>
                </div>
            </div>
        </>
    )
};

export default Login;