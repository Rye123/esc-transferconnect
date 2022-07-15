/**
 * Represents a single loyalty program
 */
 class LoyaltyProgram {
    /**
     * 
     * @param {string} loyaltyProgramId ID of the loyalty program
     * @param {string} loyaltyProgramName 
     * @param {number} exchangeRate ratio of TC points to the loyalty program points
     * @param {string} href 
     * @param {string} imgSrc 
     * @param {number} estTransferTime 
     * @param {number} minTransfer 
     */
    constructor (loyaltyProgramId, loyaltyProgramName, exchangeRate, href="", imgSrc="", estTransferTime=1, minTransfer=0) {
        this.loyaltyProgramId = loyaltyProgramId;
        this.loyaltyProgramName = loyaltyProgramName;
        this.exchangeRate = exchangeRate;
        this.href = href;
        this.imgSrc = imgSrc;
        this.estTransferTime = estTransferTime;
        this.minTransfer = minTransfer;
    }
}

export default LoyaltyProgram;