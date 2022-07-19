/* LoyaltyProgram.js: MongoDB Schema of a Loyalty Program */
const mongoose = require('mongoose');

// Mongoose Users setup
const LoyaltyProgramSchema = new mongoose.Schema({
    loyaltyProgramId: String,
    loyaltyProgramName: String,
    exchangeRate: {
        type: Number,
        default: 1
    },
    currencyName: {
        type: String,
        default: "points"
    },
    minTransfer: {
        type: Number,
        default: 1
    },
    processingTime: {
        type: String,
        default: "1 day"
    },
    description: {
        type: String,
        default: ""
    },
    enrolmentLink: {
        type: String,
        default: ""
    },
    tncLink: {
        type: String,
        default: ""
    },
    imgSrc: {
        type: String,
        default: ""
    }
});

LoyaltyProgramSchema.set('toJSON', {
    transform: (document, jsonObject) => {
        delete jsonObject._id;
        delete jsonObject.__v;
    }
})

// Export the User
module.exports = mongoose.model('LoyaltyProgram', LoyaltyProgramSchema);