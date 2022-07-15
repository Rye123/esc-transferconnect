/**
 * Represents a single accrual transfer made by a specific bank user under a specific membership
 */
class Transfer {
    /**
     * 
     * @param {string} transferId 
     * @param {string} loyaltyProgramId 
     * @param {string} loyaltyProgramMembershipId 
     * @param {string} status 
     */
    constructor (transferId, loyaltyProgramId, loyaltyProgramMembershipId, status) {
        this.transferId = transferId;
        this.loyaltyProgramId = loyaltyProgramId;
        this.loyaltyProgramMembershipId = loyaltyProgramMembershipId;
        this.status = status;
    }
}

export default Transfer;