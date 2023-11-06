import bcrypt from 'bcrypt'
import generator from 'generate-password'

import {People as User} from '../models/people.mjs'
import { PasswordResetToken } from '../models/passwordResetToken.mjs'
import { TemporaryUserData } from '../models/temporaryUserData.mjs';
import { sendOTP, sendLink } from "../utilities/nodemailerSetup.mjs";
import { cookie } from 'express-validator';
import { Conversation } from '../models/conversation.mjs';
import { ChatRequest } from '../models/chatRequest.mjs';

async function getUsers(req, res, next) {
    try {
        const users = await User.find();
        res.render("users", {
            users: users,
        });
    } catch (err) {
        next(err);
    }
}

async function searchUser(req, res, next){
    if(req.body.searchFor === ''){
        res.json({
            foundUsers: []
        })
        return;
    }
    const regexPattern = new RegExp(`.*${req.body.searchFor}.*`, 'i');
    try{
        let users = await User.find(
            { name: { $regex: regexPattern }},
        )
        .select('name email')
        users = users.filter((user) => user.email !== req.body.email);
        // let response  = await Promise.all(users.map(async (user) =>{
        //     let isFriend = await Conversation.find({
        //         $or: [
        //             {
        //                 creator: req.body.email,
        //                 participant: user.email
        //             },
        //             {
        //                 creator: user.email,
        //                 participant: req.body.email
        //             }
        //         ]
        //     })
        //     let data = {
        //         name: user.name,
        //         email: user.email,
        //         // state: isFriend.length ? 'person' : 'person-add',
        //     }
        //     return data
        // }))
        res.json({
            users
        })
    }
    catch(err){
        console.log(err);
        res.json({
            error: 'Internal server error'
        })
    }
}
async function verifyPassOtp(req, res, next){
    try{
        let token = await PasswordResetToken.findOne({
            email: req.body.email,
            OTP: req.body.OTP
        })
        if(token){
            let {email, OTP} = token;
            await PasswordResetToken.deleteMany({
                email,
                OTP
            });
            res.json({
                success: true
            })
        }
        else{
            res.json({
                error: 'The OTP you entered is not valid'
            })
        }
    }
    catch(err){
        console.log(err);
        res.json({
            error: 'Internal server error'
        })
    }
}

async function checkEmail(req, res, next) {
    try {
        const user = await User.find({
            email: req.body.email
        });
        if(user.length){
            res.json({
                error: 'This email is already in use. Try different'
            })
        }
        else next();
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'An error occured. Please try again'
        })
    }
}
async function updatePassword(req, res, next){
    try{
        let user = await User.findOne({
            email: req.body.email
        })
        if(user){
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            user.password = hashedPassword;
            user = await user.save();
            console.log('new password saved successfully')
            res.status(200).json({
                sucesss: true
            })
        }
        else{
            res.json({
                error: 'No user found'
            })
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}
// async function resetPassword(req, res, next){
//     try{
//         let token = await PasswordResetToken.findOne({
//             token: req.params.token
//         })
//         if(token){
//             res.redirect(`http://localhost:${process.env.CLIENT_PORT}/resetpassword`)
//         }
//         else{
//             res.redirect(`http://localhost:${process.env.CLIENT_PORT}/blank`)
//         }
//     }catch(err){
//         res.status(500).json({
//             error: 'An error occured. Please try again'
//         })
//     }
// }

function generateOTP() {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * 10); // Generate a random index between 0 and 9
        otp += digits[randomIndex];
    }
    return otp;
}
async function passwordRecovery(req, res, next){
    try{
        let user = await User.findOne({ email: req.body.email })
        if(user){
            await PasswordResetToken.deleteMany({
                email: req.body.email
            })
            const OTP = generateOTP();
            let isEmailSent = await sendOTP(process.env.EMAIL, process.env.KEY, req.body.email, OTP, 'Password Reset');
            if (isEmailSent) {
                let newToken = new PasswordResetToken({
                    email: req.body.email,
                    OTP
                })
                newToken = await newToken.save();
                res.status(200).json({
                    success: true
                })
            }
            else {
                throw Error("Couldn't send email")
            }
        }
        else{
            res.json({
                error: 'Email not found'
            })
        }

    }catch(err){
        console.log(err);
        res.status(500).json({
            error: 'Internal server error. Please try again'
        })
    }
}



async function processEmail(req, res, next) {
    try {
        let user;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const OTP = generateOTP();
        await TemporaryUserData.deleteMany({
            email: req.body.email
        })
        if (req.files && req.files.length > 0) {
            newUser = new TemporaryUserData({
                ...req.body,
                OTP,
                avatar: req.files[0].filename,
                password: hashedPassword,
            });
        } else {
            user = new TemporaryUserData({
                ...req.body,
                OTP,
                password: hashedPassword,
            });
        }   
        let isEmailSent = await sendOTP(process.env.EMAIL, process.env.KEY, req.body.email, OTP, 'Email Verification');
        if(isEmailSent){
            const result = await user.save();
            res.status(200).json({
                success: true
            })
        }
        else throw Error("Couldn't send email");
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'An error occured. Please try again'
        })
    }
}
// addUser
async function addUser(req, res, next) {
    try{
        let user = await TemporaryUserData.findOne({
            email: req.body.email,
            OTP: req.body.OTP,
        })
        if(user){
            let {name, email, password} = user;
            let newUser = new User({
                name,
                email,
                password
            })
            await TemporaryUserData.deleteMany({
                email,
            })
            try{
                const result = await newUser.save();
                console.log('User added successfully')
                res.status(200).json({
                    success: true
                })
            }
            catch(err){
                console.log(err);
                res.status(500).json({
                    error: 'An error occured. Please try again'
                })
            }
        }
        else{
            res.json({
                error: 'The OTP you entered is not valid'
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error: 'An error occured. Please try again'
        })
    }
    // save user or send error
}
// remove user
async function removeUser(req, res, next) {
    try {
        const user = await User.findByIdAndDelete({
            _id: req.params.id,
        });

        // remove user avatar if any
        if (user.avatar) {
            unlink(
                path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
                (err) => {
                    if (err) console.log(err);
                }
            );
        }

        res.status(200).json({
            message: "User was removed successfully!",
        });
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: "Could not delete the user!",
                },
            },
        });
    }
}
export { addUser, getUsers, removeUser, checkEmail, processEmail, passwordRecovery, updatePassword, verifyPassOtp, searchUser }