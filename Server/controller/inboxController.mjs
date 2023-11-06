import { Message } from "../models/message.mjs";
import { Room } from "../models/room.mjs";
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
export {getMessage}