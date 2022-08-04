const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transferSchema = new Schema({
    memberId : { type: String, required: true },
    memberFirstName : { type: String, required: true },
    memberLastName : { type: String, required: true },
    transferDate : { type: String, required: true },
    amount : { type: String, required: true },
    referenceNumber : { type: String, required: true },
    partnerCode : { type: String, required: true }, 
    loyaltyProgram: { type: String, required: true },  
    status : { type: String, required: true},
    outcomeDetails : { type: String, required: true},
    sentToSFTP: { type: String, required: true}
});

module.exports = mongoose.model('Transfer', transferSchema);