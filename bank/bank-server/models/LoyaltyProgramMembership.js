/* User.js: MongoDB Schema of a Bank User */
const mongoose = require('mongoose');

// Mongoose Users setup
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

// Export the User
module.exports = mongoose.model('LoyaltyProgramMembership', LoyaltyProgramMembershipSchema);