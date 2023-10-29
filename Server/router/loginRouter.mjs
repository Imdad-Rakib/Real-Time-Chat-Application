// external imports
import express from "express";

// internal imports
import { getLogin } from "../controller/loginController.mjs";
import { login, logout } from "../controller/loginController.mjs";
import { decorateHtmlResponse } from "../middleware/common/decorateHtmlResponse.mjs";
import { doLoginValidators, doLoginValidationHandler } from "../middleware/login/loginValidators.mjs";
import { redirectLoggedIn } from "../middleware/common/checkLogin.mjs";
const loginRouter = express.Router();

//set page title
const page_title = 'Login'

// login page
// loginRouter.get('/', decorateHtmlResponse(page_title), redirectLoggedIn, getLogin);

//process login
loginRouter.post('/', login)

// logout
loginRouter.delete('/', logout)
export {loginRouter}

