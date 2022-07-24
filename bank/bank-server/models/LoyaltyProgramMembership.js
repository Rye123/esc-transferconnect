/* LoyaltyProgramMembership.js: MongoDB Schema of a membership */
const mongoose = require('mongoose');

// Mongoose Membership setup
const LoyaltyProgramMembershipSchema = new mongoose.Schema(
    {
        loyaltyProgramMembershipId: String,
        userId: String,
        loyaltyProgramId: String
    },
    {
        collection: 'loyaltyProgramMemberships'
    }
);

LoyaltyProgramMembershipSchema.set('toObject', {
    transform: (document, obj) => {
        delete obj._id;
        delete obj.__v;
    }
})

// Export the membership
module.exports = mongoose.model('LoyaltyProgramMembership', LoyaltyProgramMembershipSchema);