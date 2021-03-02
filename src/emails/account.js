const sendgridAPIKey = process.env.SENDGRID_API_KEY
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(sendgridAPIKey)

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'raishkhaitu@gmail.com',
        subject: 'Thanks for joining in!',
        text: `welcome to the app ${name}. Let me know how to improve.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'raishkhaitu@gmail.com',
        subject: 'Sorry to see you Leave',
        text: `Sorry to see you leave ${name}. Could you provide us any info as to waht we can improve? your feed back is important.`
    })
}

module.exports = {
    sendWelcomeEmail, sendCancelEmail
}