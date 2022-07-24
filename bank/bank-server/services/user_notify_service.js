const nodemailer = require('nodemailer');

/* Errors */
const InvalidTransferError = require('../errors/InvalidTransferError');

const sourceEmailUser = {
    user: "esctransferconnectc4g10@gmail.com",
    pass: process.env.EMAIL_PASSWORD
}

/**
 * Sends an email to `email`, with the given `subject` and content `text`.
 * Returns a Promise.
 * @param {String} email 
 * @param {String} subject 
 * @param {String} text 
 * @returns Promise that resolves to the email data object.
 */
function sendEmail(email, subject, text) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: sourceEmailUser
    });

    let mailOptions = {
        from: sourceEmailUser.user,
        to: email,
        subject: subject,
        text: text
    };


    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, data) {
            if (error) {
                reject(error);
            }
            resolve(data);
        })
    });
}

const user_notify_service = {
    notifyUserOfCompletedTransfer: (user, transfer) => {
        let subjectText = "";
        let contentText = "";
        switch (transfer.status) {
            case "fulfilled":
                subjectText = `Transfer #${transfer.transferId} fulfilled`;
                contentText = `Your transfer #${transfer.transferId} of ${transfer.points} to ${transfer.loyaltyProgramId} has been fulfilled!`;
                break;
            case "error":
                subjectText = `Transfer #${transfer.transferId} could not be fulfilled`;
                contentText = `Your transfer #${transfer.transferId} of ${transfer.points} to ${transfer.loyaltyProgramId} could not be fulfilled.`;
                if (transfer.statusMessage !== "")
                    contentText += `\nThere was the following error message: ${transfer.statusMessage}`;
                break;
        
            default:
                throw new InvalidTransferError;
        }

        const userEmail = user.userSettings?.email || "";
        if (userEmail !== "") {
            // TODO: account for invalid emails
            return sendEmail(userEmail, subjectText, contentText);
        }
        return Promise.resolve(false);

    }
}

module.exports = user_notify_service;