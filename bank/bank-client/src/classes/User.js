/**
 * A bank user.
 */
class User {
    constructor(userId, username, firstName, lastName, points) {
        this.userId = userId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.points = points;
    }
}

export default User;