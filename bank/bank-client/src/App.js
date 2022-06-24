import './App.css';
import { useState, useEffect } from 'react';

/* Services */
import auth_service from './services/auth_service';

/* Utils */
import Utils from './utils/utils';

/**
 * Login Form Component
 * @param {*} props Arguments given to this component
 * @param {*} props.user The user that is signed in.
 * @param {*} props.setUser Function that changes the signed-in user
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
}

/**
 * User Panel Component: Displays user information
 * @param {*} props Arguments given to this component
 * @param {*} props.user The user that is signed in.
 * @param {*} props.setUser Function that changes the signed-in user
 * @returns 
 */
const UserPanel = ({user, setUser}) => {
  /* Displays user information */

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
}

/**
 * 
 * @returns 
 */
function App() {
  // State Variables
  const [user, setUser] = useState({});

  // Get initial state if it exists
  useEffect(() => {
    auth_service.user_getinfo()
    .then(currentUser => {
      setUser(currentUser);
    })
    .catch(error => {
      console.log("User isn't signed in, redirecting to Login page.")
    })
  }, []);

  return (
    <>
      <LoginForm user={user} setUser={setUser}/>
      <UserPanel user={user} setUser={setUser}/>
    </>
  );
}

export default App;
