import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/* Styling */
import '../styles/Login.css';

/* Utils */
import Utils from '../utils/utils';

/* Hooks */
import { useUserAuth } from '../hooks/UserAuthContext';

/**
 * Login Form Page.
 */
const LoginPage = () => {
    const userAuth = useUserAuth();

    /* State Variables */
    const [usernameValue, setUsernameValue] = useState(""); // username text input for form
    const [passwordValue, setPasswordValue] = useState(""); // password text input for form
    let from = useLocation().state?.from?.pathname || "/profile";
    if (from === "/logout")
        from = "/profile";

    // If user is logged in, don't show the Login
    if (!Utils.isEmptyObject(userAuth.user))
        return (
            <Navigate to={from} />
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
        userAuth.login(credentials).then(() => {
            return (<Navigate to={from} />);
        })
            .catch(err => {
                const inputShake = [
                    { transform: 'translate(0px, 0px)' },
                    { transform: 'translate(-4px, 0px)' },
                    { transform: 'translate(0px, 0px)' },
                    { transform: 'translate(4px, 0px)' },
                    { transform: 'translate(0px, 0px)' },
                ];
                const inputShakeTiming = {
                    duration: 250,
                    iterations: 1
                }
                Array.prototype.forEach.call(document.getElementsByClassName('input'), el => {
                    el.animate(inputShake, inputShakeTiming);
                });
            });
    };

    return (
        <>
            <img className="wave" src='/images/wave.png'></img>
            <div className="container">
                <div className="img">
                    <img src='/images/vault.svg' alt="Banking app"></img>
                </div>
                <div className="login-container">
                    <form onSubmit={handleFormSubmission}>
                        <img className="avatar" src='/images/profile.svg' alt="Profile"></img>
                        <h2>Digibank</h2>
                        <div className="input-div one">
                            <div className="i">
                                <i className="material-icons">person</i>
                            </div>
                            <div>
                                <input className="input" type="text" placeholder='Username' value={usernameValue} onChange={(event) => setUsernameValue(event.target.value)} /><br />
                            </div>
                        </div>
                        <div className="input-div two">
                            <div className="i">
                                <i className="material-icons">lock</i>
                            </div>
                            <div>
                                <input className="input" type="password" placeholder='Password' value={passwordValue} onChange={(event) => setPasswordValue(event.target.value)} /><br />
                            </div>
                        </div>
                        <button className="btn" type="submit">Login</button>
                    </form>
                </div>
            </div>
        </>
    )
};

export default LoginPage;