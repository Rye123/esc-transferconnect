import { useContext } from 'react';

/* Styling */
import '../styles/Profile.css';

/* Utils */
import Utils from '../utils/utils';

/* Contexts */
import userContext from '../contexts/userContext';

/**
 * Profile Page
 * Displays user information
 */
const ProfilePage = () => {
    const userState = useContext(userContext);
    const user = userState.user;

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
                            <h2>Welcome, {user.username} </h2><br></br>
                            <b>Your User ID is: </b> {user.userId} <br></br><br></br>
                            <b>The number of points you have: </b> {user.points || 0} <br></br><br></br>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ProfilePage;