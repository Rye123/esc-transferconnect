import { useState, useEffect } from 'react';
import './App.css';

/* Services */
import auth_service from './services/auth_service';

/* Utils */
import Utils from './utils/utils';

/* Components */
import LoginForm from './components/LoginForm';
import UserPanel from './components/UserPanel';

/**
 * Main single-page application
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
