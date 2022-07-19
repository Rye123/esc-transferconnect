/* Transfer.js: MongoDB Schema of an Accrual Transfer */
const mongoose = require('mongoose');

// Mongoose Transfers setup
const TransferSchema = new mongoose.Schema(
    {
        loyaltyProgramId: String,
        loyaltyProgramMembershipId: String,
        status: {
            type: String,
            default: "pending"
        },
        statusMessage: {
            type: String,
            default: ""
        },
        submissionDate: Date,
        points: Number
    },
    {
        collection: 'transfers'
    }
);

TransferSchema.set('toObject', {
    transform: (document, obj) => {
        obj.transferId = obj._id.toString();
        delete obj.id;
        delete obj._id;
        delete obj.__v;
    }
})

// Export the Transfer
module.exports = mongoose.model('Transfer', TransferSchema);