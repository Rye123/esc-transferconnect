import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './App.css';

/* Services */
import auth_service from './services/auth_service';

/* Utils */
import Utils from './utils/utils';

/* Components */
import Navbar from './components/Navbar';

/* Contexts */
import userContext from './contexts/userContext';

/**
 * Main single-page application
 */
const App = () => {
  // State Variables
  const [user, setUser] = useState({});

  // Get initial state if it exists
  useEffect(() => {
    auth_service.user_getinfo()
      .then(currentUser => {
        setUser(currentUser);
      })
      .catch(error => {
        console.log("User isn't signed in.")
      })
  }, []);

  const userState = {
    user: user,
    setUser: setUser
  };

  return (
    <userContext.Provider value={userState}>
      <Navbar />
      <Outlet />
    </userContext.Provider>
  )
}

export default App;
