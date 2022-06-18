import './App.css';
import { useState, useEffect } from 'react';

/* Services */
import users_handler from './services/users_handler';

const LoginForm = () => {
  // State Variables
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

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
        // const authToken = response.data;
        // document.cookie = `authToken=${authToken}`;
        console.log(response.data);
      })
      .catch(error => {
        alert(error);
      })
  }

  return (
    <form onSubmit={handleFormSubmission}>
      Username: <input type="text"     value={usernameValue} onChange={(event) => setUsernameValue(event.target.value)} /><br />
      Password: <input type="password" value={passwordValue} onChange={(event) => setPasswordValue(event.target.value)} /><br />
      <button type="submit">Submit</button>
    </form>
  )
}

const DebugPanel = () => {
  /* Displays debugging information */
  // State Variables
  const [users, setUsers] = useState([]);

  // Get initial state of users
  useEffect(() => {
    users_handler.DEBUG_getUsers()
    .then(usersFromDatabase => {
      setUsers(usersFromDatabase.data);
    })
    .catch(error => {
      console.error("DB Read Error: ", error);
    })
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => {
          return <li key={user.id}>{user.username}</li>
        })}
      </ul>
    </div>
  )
}

function App() {
  return (
    <>
      <LoginForm />
      <DebugPanel />
    </>
  );
}

export default App;
