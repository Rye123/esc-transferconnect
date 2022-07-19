/* LoyaltyProgram.js: MongoDB Schema of a Loyalty Program */
const mongoose = require('mongoose');

// Mongoose Loyalty Program setup
const LoyaltyProgramSchema = new mongoose.Schema(
    {
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
    },
    {
        collection: 'loyaltyPrograms'
    }
);

LoyaltyProgramSchema.set('toObject', {
    transform: (document, obj) => {
        delete obj._id;
        delete obj.__v;
    }
})

// Export the Loyalty Program
module.exports = mongoose.model('LoyaltyProgram', LoyaltyProgramSchema);