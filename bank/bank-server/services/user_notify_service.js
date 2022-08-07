const nodemailer = require('nodemailer');
const webpush = require('web-push');

/* Errors */
const InvalidTransferError = require('../errors/InvalidTransferError');

/* Constants */
const sourceEmailUser = {
    user: "esctransferconnectc4g10@gmail.com",
    pass: process.env.EMAIL_PASSWORD
}
const vapidKeys = {
    publicKey: process.env.VAPID_PUB_KEY,
    privateKey: process.env.VAPID_PRIV_KEY
}

webpush.setVapidDetails(
    "mailto:esctransferconnectc4g10@gmail.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);


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
    subscribePushNotifs: (subscription) => {
        const payload = JSON.stringify({
            title: "MSTB: Subscribed to notifications!",
            body: "You have successfully subscribed to notifications from our bank!"
        });
        webpush.sendNotification(subscription, payload)
        .catch(err => {
            console.error("PushNotif Error: ", err);
        })
    },

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
        const userPushNotifSub = user.userSettings?.pushNotifSub || "";

        const promiseChain = [];
        if (userEmail !== "" && user.userSettings.sendTo.email === true) {
            promiseChain.push(sendEmail(userEmail, subjectText, contentText)
                .catch(err => {
                    console.log(`Could not send email due to following error: ${err.message}`);
                    return Promise.resolve(false);
                })
            );
        }
        if (userPushNotifSub !== "" && user.userSettings.sendTo.pushNotif === true) {
            const payload = JSON.stringify({
                title: subjectText,
                body: contentText
            })
            promiseChain.push(
                webpush.sendNotification(userPushNotifSub, payload)
                .catch(err => {
                    console.log(`Could not send push notification due to following error: ${err.message}`);
                    return Promise.resolve(false);
                })
            )
        }
        return Promise.allSettled(promiseChain)
        .then(results => {
            if (results.includes(false))
                return false;
            return true;
        });

    }
}

module.exports = user_notify_service;