/* User.js: MongoDB Schema of a Bank User */
const mongoose = require('mongoose');

// Mongoose Users setup
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    points: {
        type: Number,
        default: 0
    },
    loyaltyProgramMembershipIds: {
        type: [String],
        default: []
    },
    transferIds: {
        type: [String],
        default: []
    }
});

UserSchema.set('toJSON', {
    transform: (document, jsonObject) => {
        jsonObject.userId = jsonObject._id.toString();
        delete jsonObject._id;
        delete jsonObject.__v;
    }
})

// Export the User
module.exports = mongoose.model('User', UserSchema);