// external imports
import express from "express";

// internal imports
import { getConversations, modifyConversation, newRoom, getRooms, checkConversation, getConversationInfo } from "../controller/conversationsController.mjs";

const conversationsRouter = express.Router();


conversationsRouter.post('/', getConversations);
conversationsRouter.post('/getConversationInfo', getConversationInfo);
conversationsRouter.post('/modify', modifyConversation);
conversationsRouter.post('/newRoom', newRoom);
conversationsRouter.post('/getRooms', getRooms);
conversationsRouter.post('/checkConversation', checkConversation);

export { conversationsRouter }

