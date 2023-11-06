import { Schema, Types, model } from "mongoose";

const messageSchema = Schema(
    {
        // id:{
        //     type: String,
        //     required: true,
        // },
        room_id:{
            type: String,
            required: true
        },
        text: {
            type: String,
        },
        sender: {
           type: String
        },
        receiver: {
           type: String
        },
        sent:{
            type: Boolean,
        }
        // conversation_id: {
        //     type: Types.ObjectId,
        //     required: true,
        // },
    },
    {
        timestamps: true,
    }
);

const Message = model("Message", messageSchema);

export {Message};
