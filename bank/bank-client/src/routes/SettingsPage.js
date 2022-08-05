import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* Classes */
import UserSettings from '../classes/UserSettings';

/* Services */
import user_settings_service from '../services/user_settings_service';

/* Hooks */
import { useUserAuth } from '../hooks/UserAuthContext';

/**
 * Settings Page
 * Modify user settings
 */
const SettingsPage = () => {
    const userAuth = useUserAuth();
    const user = userAuth.user;
    const [sendTo, setSendTo] = useState(user.userSettings.sendTo);
    const [emailInputValue, setEmailInputValue] = useState(user.userSettings.email || "");
    const [phoneNumberInputValue, setPhoneNumberInputValue] = useState(user.userSettings.phoneNumber?.toString() || "");

    const navigate = useNavigate();

    // Handle sendTo input change
    const handleSendToChange = (event) => {
        let newSendTo = Object.assign({}, sendTo); // shallow copy
        newSendTo[event.target.value] = !(newSendTo[event.target.value]);
        setSendTo(newSendTo);
    }

    // Handle Settings Form Submission
    const handleFormSubmission = (event) => {
        event.preventDefault();
    }
    
    return (
        <>
            <img className='wave' src='/images/wave.png' />
            <div className='container'>
                <div className='img'>
                    <img src='/images/settings.svg' alt="" />
                </div>
                <div className='form-container'>
                    <form onSubmit={handleFormSubmission}>
                        <h2>Settings</h2>
                        <div style={{
                            display: 'grid',
                            justifyItems: 'left',
                            justifySelf: 'center'
                        }}>
                            <h3>Send to...</h3>
                            <div>
                                <input 
                                    type='checkbox' 
                                    name='sendTo' 
                                    value='email' 
                                    id='sendToEmail'
                                    checked={sendTo.email}
                                    onChange={handleSendToChange}
                                />
                                <label htmlFor='sendToEmail'>Email</label>
                            </div>
                            <div>
                                <input 
                                    type='checkbox' 
                                    name='sendTo' 
                                    value='phoneNumber' 
                                    id='sendToPhoneNumber'
                                    checked={sendTo.phoneNumber}
                                    onChange={handleSendToChange}
                                />
                                <label htmlFor='sendToPhoneNumber'>Phone Number</label>
                            </div>
                            <div>
                                <input 
                                    type='checkbox' 
                                    name='sendTo' 
                                    value='pushNotif' 
                                    id='sendToPushNotif'
                                    checked={sendTo.pushNotif}
                                    onChange={handleSendToChange}
                                />
                                <label htmlFor='sendToPushNotif'>Push Notifications</label>
                            </div>
                        </div>

                        <div className='input-div two'>
                            <div className='i'>
                                <i className='material-icons'>mail</i>
                            </div>
                            <div>
                                <input 
                                    className='input' 
                                    type='text' 
                                    placeholder='Enter your email...'
                                    value={emailInputValue}
                                    onChange={(e) => {setEmailInputValue(e.target.value)}}
                                />
                            </div>
                        </div>

                        <div className='input-div two'>
                            <div className='i'>
                                <i className='material-icons'>call</i>
                            </div>
                            <div>
                                <input 
                                    className='input' 
                                    type='text' 
                                    placeholder='Enter your phone number...'
                                    value={phoneNumberInputValue}
                                    onChange={(e) => {setPhoneNumberInputValue(e.target.value)}}
                                />
                            </div>
                        </div>

                        <button className='btn' type='submit'>Submit</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SettingsPage;