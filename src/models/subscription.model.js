import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type:Schema.Types.ObjectId, // One who subscribing
        ref: "User"
    },
    channel:{
        type:Schema.Types.ObjectId, // One to who "subscriber" is subscriber
        ref: "User"
    }

}, {timestamps: true})

export const subscription = mongoose.model("Subscription", subscriptionSchema)