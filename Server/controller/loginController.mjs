// external imports
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "http-errors";

// internal imports
import { People as User } from "../models/people.mjs";

// get login page
function getLogin(req, res, next) {
    res.render("index");
}
// do login
async function login(req, res, next) {
    // console.log(req.body);
    try {
        // find a user who has this email/username
        const user = await User.findOne({
            email: req.body.email
        });
        if (user && user._id) {
            const isValidPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (isValidPassword) {
                // console.log('okay');
                // prepare the user object to generate token
                const userObject = {
                    // id: user._id,
                    name: user.name,
                    email: user.email,
                    // role: "user",
                };

                // const token = jwt.sign(userObject, process.env.JWT_SECRET, {
                //     expiresIn: process.env.JWT_EXPIRY,
                // });
                // console.log(token);
                //set cookie

                // res.cookie(process.env.COOKIE_NAME, token, {
                //     maxAge: process.env.JWT_EXPIRY,
                //     httpOnly: true,
                //     signed: true,
                //     // domain: 'localhost',
                //     // path: '/',
                //     // sameSite: 'strict',
                //     // secure: false,
                // }).json({
                //     success: true
                // })
                res.status(500).json(userObject);
            } else {
                res.json({
                    error: 'Invalid email or password'
                })
            }
        } else {
            res.json({
                error: 'Invalid email or password'
            })
        }
    } catch (err) {
        console.log(err);
        res.json({
            error: 'Internal server error'
        })
    } 
}

// do logout
function logout(req, res) {
    res.clearCookie(process.env.COOKIE_NAME);
    res.send("logged out");
}

export{
    getLogin,
    login,
    logout
};
