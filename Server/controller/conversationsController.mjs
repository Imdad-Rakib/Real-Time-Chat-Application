import { Conversation } from "../models/conversation.mjs";
import { Room } from "../models/room.mjs";
async function getConversations(req, res, next){
    try{
        let conversations = await Conversation.find({
            $or:[
                {creator: req.body.email},
                {participant: req.body.email},
            ]
        })
        .sort({last_updated: -1});
        res.json({
            conversations,
        })
    }catch(err){
        res.json({
            error: 'Internal server error'
        })
    }
}
async function modifyConversation(req, res, next){
    try{
        await Conversation.findOneAndUpdate(
            {
                creator: req.body.creator,
                participant: req.body.participant
            },
            {
                isOpened: true
            }
        )
        res.json({
            success: true
        })
    }catch(err){
        console.log(err);
        res.json({
            error: 'Internal server error'
        })
    }
}
async function newRoom(req, res, next){
    // client must send conv_id, room name, creator'name;
    try{
        const {conversation_id, name, creator} = req.body;
            let room = await Room.findOne({
                conversation_id,
                name
            })
            if(room !== null){
                res.json({
                    success: false
                })
            }
            else{
                let newRoom = new Room({
                    conversation_id,
                    name,
                    creator
                })
                newRoom = await newRoom.save();
                res.json({
                    success: true,
                })
              }

    }catch(err){
        console.log(err);
        res.json({
            error: 'Internal server side error'
        })
    }
}

async function getRooms(req, res, next){
    try{
        let rooms = await Room.find({
            conversation_id: req.body.id
        })
        res.json({
            rooms,
        })
    }
    catch(err){
        console.log(err);
        res.json({
            error: 'Internal server error'
        })
    }
}
async function getConversationInfo(req, res, next){
    try{
        const {person1, person2} = req.body
        let conversation = await Conversation.findOne({
            $or: [
                { creator: person1, participant: person2 },
                { creator: person2, participant: person1 },
            ]
        })
        res.json({
            conversation,
        })
    }catch(err){
        console.log('here ', err);
        res.json({
            error: 'Internal server error'
        })
    }
}
async function checkConversation(req, res, next){
    try{
        const {sender, receiver} = req.body;
        let conversation = await Conversation.findOne({
            $or: [
                { creator: sender, participant: receiver },
                { creator: receiver, participant: sender },
            ]
        })
        if(conversation){
            res.json({
                id: conversation._id
            })
        }
        else{
            res.json({
               error: 'Start conversation to switch room'
            })
        }
    }
    catch(err){
        console.log(err);
        res.json({
            error: 'Internal server error'
        })
    }
}
export {getConversations, modifyConversation, newRoom, getRooms, checkConversation, getConversationInfo};