import { ActiveClients } from "../models/activeClients.mjs"
import { Conversation } from "../models/conversation.mjs";
import { Message } from "../models/message.mjs";
import { io } from "../app.mjs";
import { Room } from "../models/room.mjs";
async function addClient(email, connectionId){    
    
    try{
        await ActiveClients.deleteMany(
            {email},
        )
        let newClient = new ActiveClients({
            email, 
            connectionId
        })
        await newClient.save();
        // let unsentMsg = await Message.find({
        //     receiver: email,
        //     sent: false,
        // });
        // if(unsentMsg.length){
            
        // }
    }
    catch(err){
        console.log(err)
    }
}
async function removeClient(connectionId){    
    
    try{
        await ActiveClients.deleteMany({
            connectionId
        })
    }
    catch(err){
        console.log(err)
    }
}
async function handlePrivateMsg(message){    
    console.log(message);
    try{
        const {text, sender, conversation_id, sender_name, receiver_name, receiver, room_name} = message;
        let conversation = await Conversation.findOne({
            $or: [
                { creator: sender, participant: receiver },
                { creator: receiver, participant: sender },
            ]
        })
        let room = {};
        if(conversation){
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
            
        }else{
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
        let msg = new Message({room_id: room._id, text, sender, receiver });
        msg = await msg.save();

        let user = await ActiveClients.findOne({
            email: receiver,
        })
        if(user){
            io.to(user.connectionId).emit('private_message', msg, conversation)
                // if(status !== null && status.ok){
                //         Conversation.findOneAndUpdate(
                //         {
                //             $or: [
                //                 { creator: sender, participant: receiver },
                //                 { creator: receiver, participant: sender }
                //             ]
                //         }, 
                //         {
                //             $set: { isOpened: true } 
                //         }
                //     );
                // }
            // //         // (async () => {
            // //         //     const result = await Conversation.findOneAndUpdate(
            // //         //         {
            // //         //             $or: [
            // //         //                 { creator: sender, participant: receiver },
            // //         //                 { creator: receiver, participant: sender }
            // //         //             ]
            // //         //         },
            // //         //         {
            // //         //             $set: { isOpened: true }
            // //         //         }
            // //         //     );

            // //         // })();
            // //     }
            // })
        }
        return {
            conversation,
            msg,
        }
        // console.log(newMsg);
    }
    catch(err){
        console.log(err)
        return {
            error: 'Internal server error.'
        }
    }
}

export {addClient, removeClient, handlePrivateMsg}