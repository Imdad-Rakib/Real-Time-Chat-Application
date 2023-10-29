// external imports
import express from "express";

// internal imports
import { getConversations, modifyConversation } from "../controller/conversationsController.mjs";

const conversationsRouter = express.Router();


conversationsRouter.post('/', getConversations);
conversationsRouter.post('/modify', modifyConversation);

export { conversationsRouter }

