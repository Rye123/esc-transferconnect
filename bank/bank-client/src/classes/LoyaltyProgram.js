/**
 * Represents a single loyalty program
 */
 class LoyaltyProgram {
    /**
     * 
     * @param {string} loyaltyProgramId ID of the loyalty program
     * @param {number} exchangeRate ratio of TC points to the loyalty program points
     */
    constructor (loyaltyProgramId, exchangeRate) {
        this.loyaltyProgramId = loyaltyProgramId;
        this.exchangeRate = exchangeRate;
    }
}