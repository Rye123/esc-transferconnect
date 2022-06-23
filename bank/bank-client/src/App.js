import './App.css';
import { useState, useEffect } from 'react';

/* Services */
import users_handler from './services/users_handler';

/* Utils */
import Utils from './utils/utils';

const LoginForm = ({user, setUser}) => {
  // State Variables
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  // if user (i.e. logged in)
  if (!Utils.isEmptyObject(user)) {
    return (
      <>
      </>
    )
  }

  // otherwise, show form


  // Listeners
  const handleFormSubmission = (event) => {
    event.preventDefault(); // by default, refreshes the page. We don't want that here.
    const testUser = {
      username: usernameValue,
      password: passwordValue
    };

    // Clear input elements
    setUsernameValue("");
    setPasswordValue("");

    // Send POST request
    users_handler.authenticate(testUser)
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.log("Authentication failed.");
        alert("Please reenter details!");
      })
  }

  return (
    <form onSubmit={handleFormSubmission}>
      <h1>Log in: </h1>
      Username: <input type="text"     value={usernameValue} onChange={(event) => setUsernameValue(event.target.value)} /><br />
      Password: <input type="password" value={passwordValue} onChange={(event) => setPasswordValue(event.target.value)} /><br />
      <button type="submit">Submit</button>
    </form>
  )
}

const UserPanel = ({user, setUser}) => {
  /* Displays user information */

  // if no user (i.e. not logged in)
  if (Utils.isEmptyObject(user)) {
    return (
      <>
      </>
    )
  }

  // otherwise, give info

  /* Event Handlers */
  const onClickLogout = (event) => {
    event.preventDefault();
    users_handler.logout(user.id)
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

function App() {
  // State Variables
  const [user, setUser] = useState({});

  // Get initial state if it exists
  useEffect(() => {
    users_handler.get_user_with_token()
    .then(response => {
      setUser(response.data);
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
