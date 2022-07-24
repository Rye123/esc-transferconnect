/**
 * A bank user.
 */
class User {
    constructor(userId, username, firstName, lastName, points, loyaltyProgramMembershipIds, transferIds) {
        this.userId = userId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.points = points;
        this.loyaltyProgramMembershipIds = loyaltyProgramMembershipIds;
        this.transferIds = transferIds;
    }
}

export default User;