import { Schema, model } from "mongoose";

const EmailValidationSchema = Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        // mobile: {
        //     type: String,
        //     required: true,
        // },
        password: {
            type: String,
            required: true,
        },
        OTP:{
            type: String,
            required: true,
        }
        // avatar: {
        //     type: String,
        // },
        // role: {
        //     type: String,
        //     enum: ["admin", "user"],
        //     default: "user",
        // },
    },
    {
        timestamps: true,
    }
);
EmailValidationSchema.index({createdAt: 1}, {expireAfterSeconds: 65});
const TemporaryUserData = model("TemporaryUserData", EmailValidationSchema);
export {TemporaryUserData};