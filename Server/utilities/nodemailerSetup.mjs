import nodemailer from 'nodemailer'


async function sendOTP(author, pass, receiver, OTP, subject){


    const emailVerification = `<html><body><p>Hi there!</p><p>You have recently visited our website and entered your email.</p>
                                <p>Your <strong> OTP </strong> for email verification is: <strong> ${OTP} </strong></p>
                                <p><strong>This OTP expires in 1 minute</strong></p><p>Thanks!</p>
                                </body></html>`

    const forgotPassword = `<html>
                            <body>
                                <p>Hi, we received a request to reset your password.</p>
                                <p>Enter the following password reset code: </p>
                                <p><strong> ${OTP} </strong></p>
                                <p><strong>This OTP expires in 1 minute</strong></p>
                                <p>Thanks!</p>
                            </body>
                        </html>`
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: author,
            pass
        }
    });

    try {
        await transporter.sendMail({

            from: author,
            to: receiver,
            subject,
            html: (subject === 'Password Reset' ? forgotPassword : emailVerification)

        });
        console.log('Email Sent Successfully');
        return true;
    } catch (err) {
        console.log('Error', err);
        return false
    }
}

async function sendLink(author, pass, receiver, url) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: author,
            pass
        }
    });

    try {
        await transporter.sendMail({

            from: author,
            to: receiver,
            subject: 'Password Recovery',
            html: `<html>
                    <body>
                    <p>Hi there!</p>
                    <p>You have recently requested for password reset</p>
                    <p>Click on the link below to reset your password: <br> <a href = ${url}> ${url}</p>
                    <p><strong>This link will not work after 1 minute</strong></p>
                    <p>Thanks!</p>
                    </body>
                    </html>`,

        });
        console.log('Email Sent Successfully');
        return true;
    } catch (err) {
        console.log('Error', err);
        return false
    }
}

export {sendOTP, sendLink};