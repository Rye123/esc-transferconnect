/**
 * A bank user's settings.
 * Separated from User class.
 */

class UserSettings {
    constructor(userSettings) {
        this.email = userSettings.email || null;
        this.phoneNumber = userSettings.phoneNumber || null;
        this.sendTo = {
            email: userSettings.sendTo?.email || false,
            phoneNumber: userSettings.sendTo?.phoneNumber || false,
            pushNotif: userSettings.sendTo?.pushNotif || false
        }
    }
}

export default UserSettings;