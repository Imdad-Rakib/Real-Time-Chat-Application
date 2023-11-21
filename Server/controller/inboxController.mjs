import { Message } from "../models/message.mjs";
import { Room } from "../models/room.mjs";
import { Conversation } from "../models/conversation.mjs";
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
        .select('-_id sender receiver text createdAt')
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
    // console.log(req.files);
    res.json({
        success: true
    })
    // try {
    //     const { text, sender, conversation_id, sender_name, receiver_name, receiver, room_name } = message;
    //     let conversation = await Conversation.findOne({
    //         $or: [
    //             { creator: sender, participant: receiver },
    //             { creator: receiver, participant: sender },
    //         ]
    //     })
    //     let room = {};
    //     if (conversation) {
    //         conversation.last_updated = Date.now();
    //         conversation.last_msg = text;
    //         conversation.updated_by = sender;
    //         conversation.isOpened = false;
    //         conversation.last_room = room_name,
    //             conversation = await conversation.save();
    //         room = await Room.findOne({
    //             conversation_id,
    //             name: room_name
    //         })

    //     } else {
    //         conversation = new Conversation({
    //             creator: sender,
    //             participant: receiver,
    //             creator_name: sender_name,
    //             participant_name: receiver_name,
    //             last_updated: Date.now(),
    //             last_msg: text,
    //             updated_by: sender,
    //             isOpened: false,
    //             last_room: 'General',
    //         })
    //         conversation = await conversation.save();
    //         room = new Room({
    //             conversation_id: conversation._id,
    //             name: 'General',
    //             creator: sender,
    //         })
    //         await room.save();
    //     }
    //     let msg = new Message({ room_id: room._id, text, sender, receiver });
    //     msg = await msg.save();

    //     let user = await ActiveClients.findOne({
    //         email: receiver,
    //     })
    //     if (user) {
    //         io.to(user.connectionId).emit('private_message', msg, conversation)
    //         // if(status !== null && status.ok){
    //         //         Conversation.findOneAndUpdate(
    //         //         {
    //         //             $or: [
    //         //                 { creator: sender, participant: receiver },
    //         //                 { creator: receiver, participant: sender }
    //         //             ]
    //         //         }, 
    //         //         {
    //         //             $set: { isOpened: true } 
    //         //         }
    //         //     );
    //         // }
    //         // //         // (async () => {
    //         // //         //     const result = await Conversation.findOneAndUpdate(
    //         // //         //         {
    //         // //         //             $or: [
    //         // //         //                 { creator: sender, participant: receiver },
    //         // //         //                 { creator: receiver, participant: sender }
    //         // //         //             ]
    //         // //         //         },
    //         // //         //         {
    //         // //         //             $set: { isOpened: true }
    //         // //         //         }
    //         // //         //     );

    //         // //         // })();
    //         // //     }
    //         // })
    //     }
    //     res.json({
    //         conversation,
    //         msg,
    //     })
    //     // console.log(newMsg);
    // }
    // catch (err) {
    //     // console.log(err)
    //     return {
    //         error: 'Internal server error.'
    //     }
    // }
}

async function singleDownloader(req, res, next){
    // console.log('single file');
    const folderPath = path.join(__dirname, '../public/uploads/files/');
    console.log('folderPath: ', folderPath);
    // Download function provided by express
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