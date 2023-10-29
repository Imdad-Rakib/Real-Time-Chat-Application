import { Schema, model } from "mongoose";

const PasswordResetSchema
 = Schema(
    {
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
        OTP: {
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
PasswordResetSchema
.index({ createdAt: 1 }, { expireAfterSeconds: 65 });
const PasswordResetToken
 = model("PasswordResetToken", PasswordResetSchema
);
export { PasswordResetToken };

//title, obj, desc, tech, conc 
