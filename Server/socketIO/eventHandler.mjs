import { ActiveClients } from "../models/activeClients.mjs"
import { Conversation } from "../models/conversation.mjs";
import { Message } from "../models/message.mjs";
import { io } from "../app.mjs";
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
        let unsentMsg = await Message.find({
            receiver: email,
            sent: false,
        });
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
    
    try{
        
        const {text, sender, sender_name, receiver, receiver_name} = message;
        let conversation = await Conversation.findOne({
            $or:[
                {creator: sender, participant: receiver},
                {creator: receiver, participant: sender}
            ]
        })
        if(conversation){
            conversation.last_updated = Date.now();
            conversation.last_msg = text;
            conversation.updated_by = sender;
            conversation.isOpened = false;
        }else{
            conversation = new Conversation({
                creator: sender,
                participant: receiver,
                creator_name: sender_name,
                participant_name: receiver_name,
                last_updated: Date.now(),
                last_msg: text,
                updated_by: sender,
                isOpened: false
            })
        }
        conversation = await conversation.save();
        let user = await ActiveClients.findOne({
            email: receiver,
        })
        if(user){
            io.to(user.connectionId).emit('private_message', {text, sender, receiver, createdAt: Date.now(),}, conversation,
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
        )}
        let msg = new Message({text, sender, receiver});
        msg = await msg.save();
        return {conversation}
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