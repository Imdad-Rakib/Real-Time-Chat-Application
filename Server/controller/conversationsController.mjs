import { Conversation } from "../models/conversation.mjs";
async function getConversations(req, res, next){
    try{
        let conversations = await Conversation.find({
            $or:[
                {creator: req.body.email},
                {participant: req.body.email},
            ]
        })
        .select('-_id updated_by creator participant creator_name participant_name last_updated last_msg isOpened')
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
    console.log(req.body);
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
export {getConversations, modifyConversation};