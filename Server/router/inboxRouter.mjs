// external imports
import express from "express";

// internal imports
import {getMessage} from '../controller/inboxController.mjs'

const inboxRouter = express.Router();

// inbox page

inboxRouter.post('/', getMessage);

export { inboxRouter }

