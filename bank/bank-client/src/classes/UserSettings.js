/**
 * A bank user's settings.
 * Separated from User class.
 */

class UserSettings {
    constructor(userSettings) {
        this.email = userSettings.email || null;
        this.phoneNumber = userSettings.phoneNumber || null;
        this.pushNotif = userSettings.pushNotif || false;
    }
}

export default UserSettings;