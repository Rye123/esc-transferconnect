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
    name: String,
    password: String,
    points: {
        type: Number,
        default: 0
    }
});

// Export the User
module.exports = mongoose.model('User', UserSchema);