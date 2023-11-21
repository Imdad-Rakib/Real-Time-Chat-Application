// external imports
import express from "express";
import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';
// internal imports
import {getMessage, handlePrivateMsg, singleDownloader} from '../controller/inboxController.mjs'
import fileUpload from "../middleware/users/fileUpload.mjs";

const inboxRouter = express.Router();

// const cpUpload = upload.fields([{ name: 'file1'}, {name: 'file2'}, {name: 'file3'}])
// inbox page

inboxRouter.post('/', getMessage);
inboxRouter.post('/privateMessage', fileUpload, handlePrivateMsg)
inboxRouter.get('/download/:fileName', singleDownloader);

export { inboxRouter }

/*
app.get('/download', function (req, res) {
   
})
*/