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
     * @param {string} statusMessage
     * @param {Date} submissionDate
     * @param {number} points
     */
    constructor(transferId, loyaltyProgramId, loyaltyProgramMembershipId, status, statusMessage, submissionDate, points) {
        this.transferId = transferId;
        this.loyaltyProgramId = loyaltyProgramId;
        this.loyaltyProgramMembershipId = loyaltyProgramMembershipId;
        this.status = status;
        this.statusMessage = statusMessage || "";
        this.submissionDate = submissionDate;
        this.points = points;
    }
}

export default Transfer;