/**
 * A bank user.
 */
import UserSettings from "./UserSettings";

class User {
    constructor(userId, username, firstName, lastName, points, userSettings) {
        this.userId = userId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.points = points;
        this.userSettings = new UserSettings(userSettings);
    }
}

export default User;