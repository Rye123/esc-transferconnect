import { Outlet } from 'react-router-dom';
import './App.css';

/* Components */
import Navbar from './components/Navbar';

/* Hooks */
import { UserAuthProvider } from './hooks/UserAuthContext';

/**
 * Main single-page application
 */
const App = () => {
  return (
    <UserAuthProvider>
      <Navbar />
      <Outlet />
    </UserAuthProvider>
  )
}

export default App;
