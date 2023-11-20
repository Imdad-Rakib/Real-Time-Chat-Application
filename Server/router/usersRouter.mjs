// external imports
import express from "express";

// internal imports
// import { getUsers } from "../controller/usersController.mjs";
import { decorateHtmlResponse } from "../middleware/common/decorateHtmlResponse.mjs";
import fileUpload from "../middleware/users/fileUpload.mjs";
import {addUserValidators, addUserValidationHandler} from "../middleware/users/userValidator.mjs";
import { addUser, getUsers, removeUser, checkEmail, processEmail, passwordRecovery,  updatePassword, verifyPassOtp, searchUser } from "../controller/usersController.mjs";
import { checkLogin } from "../middleware/common/checkLogin.mjs";

const usersRouter = express.Router();

// user page
// usersRouter.get('/', decorateHtmlResponse('Users'), checkLogin, getUsers);

//add user
usersRouter.put('/updatePassword', updatePassword)
// usersRouter.get('/passwordReset/:token/:id', resetPassword);
usersRouter.post('/validateEmail', checkEmail, processEmail);
usersRouter.post('/addUser', addUser);
usersRouter.post('/forgotPassword', passwordRecovery);
usersRouter.post('/verifyPassOtp', verifyPassOtp);
usersRouter.post('/searchUser', searchUser);

// delete user
// usersRouter.delete("/:id", removeUser);

export { usersRouter,  updatePassword }

