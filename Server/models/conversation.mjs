import { Schema, Types, model } from "mongoose";

const conversationSchema = Schema(
    {

        creator: {
            type: String,
        },
        participant: {
            type: String,
        },
        creator_name:{
            type: String,
            avatar: String,
        },
        participant_name: {
            type: String,
            avatar: String,
        },

        last_updated: {
            type: Date,
            default: Date.now,
        },
        updated_by:{
            type: String,
        },
        last_msg: {
            type: String,
        },
        isOpened:{
            type: Boolean,
        }
    },
    // {
    //     timestamps: true,
    // }
);

const Conversation = model("Conversation", conversationSchema);

export {Conversation};
