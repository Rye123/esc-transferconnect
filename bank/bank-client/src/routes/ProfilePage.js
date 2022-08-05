/* Styling */
import '../styles/Profile.css';

/* Hooks */
import { useUserAuth } from '../hooks/UserAuthContext';

/**
 * Profile Page
 * Displays user information
 */
const ProfilePage = () => {
    const userAuth = useUserAuth();
    const user = userAuth.user;

    return (
        <main>
            <img className="wave" src='/images/wave.png'></img>
            <div className="container">
                <div className="img">
                    <img src="/images/UserPanel.svg" alt="Profile Page"></img>
                </div>
                <div className="display-container">
                    <div>
                        <div>
                            <h2>Welcome, <b>{user.firstName} {user.lastName}</b></h2><br />
                            Logged in as: <b>{user.username}</b> <br /><br />
                            Points:  <b>{user.points || 0}</b> <br /><br />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ProfilePage;