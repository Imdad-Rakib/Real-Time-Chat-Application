import { Schema, Types, model } from "mongoose";

const DisappearingMsgSchema = Schema(
  {
    conversation_id: {
      type: String,
      required: true
    },
    room:{
      type: String,
    },
    expiry:{
      type: Date, 
    }
  }
);

const DisappearingMsg = model("DisappearingMsg", DisappearingMsgSchema);

export { DisappearingMsg };
