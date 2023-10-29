import { Schema, Types, model } from "mongoose";

const activeClients = Schema(
    {

        email: {
            type: String,
        },
        connectionId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const ActiveClients = model("ActiveClients", activeClients);

export { ActiveClients };
