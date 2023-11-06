import { Schema, Types, model } from "mongoose";

const roomSchema = Schema(
    {
        conversation_id:{
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        creator:{
            type:String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Room = model("room", roomSchema);

export { Room };
