// external imports
import express from "express";

// internal imports
import { getLogin } from "../controller/loginController.mjs";
import { login, logout } from "../controller/loginController.mjs";

import { redirectLoggedIn } from "../middleware/common/checkLogin.mjs";
const loginRouter = express.Router();
import path from 'path';
import { fileURLToPath } from "url";
//set page title
const page_title = 'Login'

// login page
// loginRouter.get('/', decorateHtmlResponse(page_title), redirectLoggedIn, getLogin);

//process 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
loginRouter.get('/getImage/:user', function(req, res, next) {
  const Path = path.join(__dirname, `../public/uploads/avatars/${decodeURIComponent(req.params.user)}.png`);
  res.sendFile(Path);
})
loginRouter.post('/', login)

// logout
loginRouter.delete('/', logout)
export {loginRouter}

