/**
 * Represents a single loyalty program
 */
class LoyaltyProgram {
    /**
     * 
     * @param {string} loyaltyProgramId ID of the loyalty program
     * @param {string} loyaltyProgramName name of the loyalty program
     * @param {number} exchangeRate ratio of TC points to the loyalty program points
     * @param {string} currencyName name of loyalty program currency
     * @param {number} minTransfer minimum amount for transfers
     * @param {string} processingTime amount of time taken for processing
     * @param {string} description loyalty program description
     * @param {string} enrolmentLink link to loyalty program site
     * @param {string} tncLink link to loyalty program terms and conditions
     * @param {string} imgSrc link to loyalty program logo image
     */
    constructor(loyaltyProgramId, loyaltyProgramName, exchangeRate, currencyName, minTransfer, processingTime, description, enrolmentLink, tncLink, imgSrc) {
        this.loyaltyProgramId = loyaltyProgramId;
        this.loyaltyProgramName = loyaltyProgramName;
        this.exchangeRate = exchangeRate || 1;
        this.currencyName = currencyName || `${loyaltyProgramName} points`;
        this.minTransfer = minTransfer || 0;
        this.processingTime = processingTime || "1 day";
        this.description = description || "";
        this.enrolmentLink = enrolmentLink || "";
        this.tncLink = tncLink || "";
        this.imgSrc = imgSrc || "/images/card.svg";
    }
}

export default LoyaltyProgram;