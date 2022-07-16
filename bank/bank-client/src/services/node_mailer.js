const nodemailer = require('nodemailer');

function send_mail(email, subject, text) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: "esctransferconnectc4g10@gmail.com",
            pass: "paybffypzzzfnjrf"
        }
    });

    let mailOptions = {
        from:'esctransferconnectc4g10@gmail.com',
        to: email,
        subject: subject,
        text: text
    };


    transporter.sendMail(mailOptions, function(error, data){
        if(error){
            console.log("Error occurs!", error);
        }
        else {
            console.log("Email sent!");
        }
    });
}