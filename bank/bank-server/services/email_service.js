const nodemailer = require('nodemailer');

const sourceEmailUser = {
    user: "esctransferconnectc4g10@gmail.com",
    pass: process.env.EMAIL_PASSWORD
}

const email_service = {
    /**
     * Sends an email to `email`, with the given `subject` and content `text`.
     * Returns a Promise.
     * @param {String} email 
     * @param {String} subject 
     * @param {String} text 
     * @returns Promise that resolves to the email data object.
     */
    sendEmail(email, subject, text) {
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
            transporter.sendMail(mailOptions, function(error, data){
                if(error){
                    reject(error);
                }
                resolve(data);
            })
        });
    }
}

module.exports = email_service;