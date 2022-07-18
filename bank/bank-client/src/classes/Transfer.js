/**
 * Represents a single accrual transfer made by a specific bank user under a specific membership
 */
class Transfer {
    /**
     * 
     * @param {string} transferId 
     * @param {string} loyaltyProgramId 
     * @param {string} loyaltyProgramMembershipId 
     * @param {string} status status of the transfer: pending, fulfilled or error
     * @param {string} statusMessage status message, displayed when status is an error.
     * @param {Date} submissionDate date of submission of the transfer
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