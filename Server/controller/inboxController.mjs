import { Message } from "../models/message.mjs";

async function getMessage(req, res, next){
    try{
        let messages = await Message.find({
            $or:[
                {sender: req.body.person1, receiver: req.body.person2},
                {sender: req.body.person2, receiver: req.body.person1},
            ]
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