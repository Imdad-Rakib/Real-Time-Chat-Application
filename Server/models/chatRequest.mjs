import { Schema, Types, model } from "mongoose";

const schema = Schema(
    {

        requestedBy: {
            type: String,
            avatar: String,
        },

        requestedTo: {
            type: String,
            avatar: String,
        },

    },
    {
        timestamps: true,
    }
);

const ChatRequest = model("Chat Request", schema);

export { ChatRequest };
