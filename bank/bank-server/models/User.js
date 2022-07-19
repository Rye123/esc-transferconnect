/* User.js: MongoDB Schema of a Bank User */
const mongoose = require('mongoose');

const mongoDBurl = process.env.MONGODB_URI;
mongoose.connect(mongoDBurl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(result => {
        console.log("Established connection to MongoDB.");
    })
    .catch(error => {
        console.error("Database Error: ", error);
    });

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