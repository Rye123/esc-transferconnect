/**
 * Represents a membership registered under a specific bank user for a specific loyalty program.
 */
class LoyaltyProgramMembership {
    /**
     * 
     * @param {string} loyaltyProgramMembershipId ID of loyalty program membership
     * @param {string} userId ID of `User` this membership is registered to
     * @param {string} loyaltyProgramId ID of `LoyaltyProgram` this membership is registered to
     */
    constructor(loyaltyProgramMembershipId, userId, loyaltyProgramId) {
        this.loyaltyProgramMembershipId = loyaltyProgramMembershipId;
        this.userId = userId;
        this.loyaltyProgramId = loyaltyProgramId;
    }
}

export default LoyaltyProgramMembership;