const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const floatValidator = input => {
    return /^[1-9]\d*(\.\d+)?$/.test(input);
}

const alphaNumericValidator = input => {
    return /^[A-Za-z0-9]+$/.test(input);
}

const transferSchema = new Schema({
    memberId : { type: String, validate: {
        validator: function(v) {
            if (this.loyaltyProgram === "GOPOINTS"){
                return /^(\d{10}|\d{16})$/.test(v);
            } else if (this.loyaltyProgram === "INDOMILES"){
                return /^(\d{10})$/.test(v);
            } else if (this.loyaltyProgram === "EMINENTGUEST") {
                return /^(\d{12})$/.test(v)
            } else if (this.loyaltyProgram === "CONRADCLUB") {
                return /^(\d{9})$/.test(v)
            } else if (this.loyaltyProgram === "MILLENIUMREWARDS") {
                return /^(\d{10}[A-Za-z]{1})$/.test(v)
            } else {
                return false;
            }
        },
        message: props => `${props.value} is not a valid phone number!`
      }, required: true },
    memberFirstName : { type: String, validate: alphaNumericValidator, required: true },
    memberLastName : { type: String, validate: alphaNumericValidator, required: true },
    transferDate : { type: String, required: true },
    amount : { type: String, validate: floatValidator,  required: true },
    referenceNumber : { type: String, validate: alphaNumericValidator, required: true },
    partnerCode : { type: String, validate: alphaNumericValidator, required: true }, 
    loyaltyProgram: { type: String, validate: alphaNumericValidator, required: true },  
    status : { type: String, required: true},
    outcomeDetails : { type: String, required: true},
    sentToSFTP: { type: String, required: true}
});

module.exports = mongoose.model('Transfer', transferSchema);