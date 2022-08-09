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

    const vapid_public_key = "BHKoC7aRDE7DBHTUgB9wdJQXYwtzp7Ztx55Glr5BhdTqQCSOo3U0TVj526AvWuxgSFrZmMA2-GB9tQSjGpKxtnA";

    const urlBase64ToUint8Array = b64str => {
        const padding = '='.repeat((4 - b64str.length %4) %4 );
        const b64 = (b64str + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(b64);
        const outputArr = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArr[i] = rawData.charCodeAt(i);
        }
        return outputArr;
    }

    // Handle sendTo input change
    const handleSendToChange = (event) => {
        let newSendTo = Object.assign({}, sendTo); // shallow copy
        newSendTo[event.target.value] = !(newSendTo[event.target.value]);

        if (event.target.value === "pushNotif" && newSendTo[event.target.value]) {
            const handlePermission = permission => {
                if (permission === 'granted') {
                    return true;
                } else {
                    return false;
                }
            }
            // Check if notifications are supported
            if (!('Notification' in window)) {
                alert("Browser doesn't support push notifications.");
                return;
            }
            // Request permissions if not given
            if (Notification.permission !== "granted") {
                try {
                    Notification.requestPermission()
                    .then(permission => handlePermission(permission))
                    .then(granted => {
                        if (!granted)
                            alert("You need to allow notifications to receive notifications.");
                        else
                            setSendTo(newSendTo);
                    })
                } catch (e) {
                    // requestPermission Promises not supported
                    const granted = Notification.requestPermission(permission => handlePermission(permission));
                    if (!granted)
                        alert("You need to allow notifications to receive notifications");
                    else
                        setSendTo(newSendTo);
                }
            } else {
                setSendTo(newSendTo);
            }
        } else {
            setSendTo(newSendTo);
        }
    }

    // Handle Settings Form Submission
    const handleFormSubmission = async (event) => {
        event.preventDefault();
        const newSettings = new UserSettings({
            email: emailInputValue,
            phoneNumber: phoneNumberInputValue,
            sendTo: sendTo
        });
        // TODO: validation of newSettings
        if (newSettings.sendTo.pushNotif) {
            // Ensure push notifications are set first
            // Register service worker
            const register = await navigator.serviceWorker.register('notif-service-worker.js', {
                scope: './'
            });

            // Register Push Notifications
            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapid_public_key)
            });

            // Append Subscription to UserSettings object
            newSettings.pushNotifSub = subscription;
        }

        // Send the update
        user_settings_service.user_postsettings(newSettings)
        .then(() => {
            return userAuth.update()
        })
        .then(() => {
            navigate({ pathname: `/profile`});
        })
        .catch(err => {
            console.error("SettingsPageError:", err);
            alert("Error in Settings Update");
        })
    }
    
    return (
        <main>
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
        </main>
    )
}

export default SettingsPage;