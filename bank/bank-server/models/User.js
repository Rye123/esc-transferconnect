/* User.js: MongoDB Schema of a Bank User */
const mongoose = require('mongoose');

// Mongoose Users setup
const UserSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        points: {
            type: Number,
            default: 0
        },
        userSettings: {
            type: Object,
            default: {
                email: null,
                phoneNumber: null,
                pushNotifSub: null,
                sendTo: {
                    email: false,
                    phoneNumber: false,
                    pushNotif: false
                }
            }
        }
    },
    {
        collection: 'users'
    }
);


UserSchema.set('toObject', {
    virtuals: true,
    transform: (document, obj) => {
        obj.userId = obj._id.toString();
        delete obj.id;
        delete obj._id;
        delete obj.__v;
    }
})

// Export the User
module.exports = mongoose.model('User', UserSchema);