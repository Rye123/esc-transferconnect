const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const loyaltySchema = new Schema({
    programId : { type: String, required: true },
    programName : { type: String, required: true },
    currencyName : { type: String, required: true },
    processingTime : { type: String, required: true },
    description : { type: String, required: true },
    enrollmentLink : { type: String, required: true },
    tncLink : { type: String, required: true },
    imgSrc: { type: String, required: true }
});

module.exports = mongoose.model('Loyalty', loyaltySchema);