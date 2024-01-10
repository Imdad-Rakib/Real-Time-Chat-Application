import { Message } from "../models/message.mjs";
import { Room } from "../models/room.mjs";
import { Conversation } from "../models/conversation.mjs";
import { ActiveClients } from "../models/activeClients.mjs";
import { io } from "../app.mjs";

//external
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getMessage(req, res, next){
    try{
        const {conversation_id, name} = req.body;
        let room = await Room.findOne({
            conversation_id,
            name
        })
        let messages = await Message.find({
            room_id: room._id
        })
        .select('-_id sender receiver text createdAt file')
        .sort({createdAt: -1});
        res.json({
            messages,
        })
    }catch(err){
        console.log(err);
        res.json({
            error: 'Internal server error'
        })
    }
}

async function handlePrivateMsg(req, res, next) {
    try {
        const { text, sender, conversation_id, sender_name, receiver_name, receiver, room_name } = req.body;
        let conversation = await Conversation.findOne({
            $or: [
                { creator: sender, participant: receiver },
                { creator: receiver, participant: sender },
            ]
        })
        let room = {};
        if (conversation) {
            conversation.last_updated = Date.now();
            conversation.last_msg = text;
            conversation.updated_by = sender;
            conversation.isOpened = false;
            conversation.last_room = room_name,
                conversation = await conversation.save();
            room = await Room.findOne({
                conversation_id,
                name: room_name
            })

        } else {
            conversation = new Conversation({
                creator: sender,
                participant: receiver,
                creator_name: sender_name,
                participant_name: receiver_name,
                last_updated: Date.now(),
                last_msg: text,
                updated_by: sender,
                isOpened: false,
                last_room: 'General',
            })
            conversation = await conversation.save();
            room = new Room({
                conversation_id: conversation._id,
                name: 'General',
                creator: sender,
            })
            await room.save();
        }
        let file = null;
        if(req.files.length){
            file = {
                name: req.files[0].filename,
                size: req.files[0].size,
                extname: path.extname(req.files[0].originalname)
            }
        }
        const msg = new Message({ room_id: room._id, text, sender, receiver, file });
        await msg.save();
        let user = await ActiveClients.findOne({
            email: receiver,
        })
        if (user) {
            io.to(user.connectionId).emit('private_message', msg, conversation)
        }
        res.json({
            conversation,
            file
        })
    }
    catch (err) {
        console.log(err)
        res.json({
            error: 'Internal server error.'
        })
    }
}

async function singleDownloader(req, res, next){
    const folderPath = path.join(__dirname, '../public/uploads/files/');
    res.download(folderPath + req.params.fileName, function (err) {
        if (err) {
            console.log(err);
            res.json({
                error: 'Internal server error'
            })
        }
    })
}

export {getMessage, handlePrivateMsg, singleDownloader}