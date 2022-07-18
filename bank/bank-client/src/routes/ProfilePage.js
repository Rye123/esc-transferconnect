/* Styling */
import '../styles/Profile.css';

/* Utils */
import Utils from '../utils/utils';

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
                            <h2>Welcome, {user.firstName} {user.lastName}</h2><br></br>
                            <b>Logged in as: </b> {user.username} <br></br><br></br>
                            <b>Points: </b> {user.points || 0} <br></br><br></br>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ProfilePage;