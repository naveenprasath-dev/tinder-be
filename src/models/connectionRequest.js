const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema({

    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",  //reference to the user collection.
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    status:{
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
           message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
        }
    }
}, { timestamps: true })


connectionRequestSchema.index({fromUserId: 1, toUserId: 1});
/**
 * save is an event,consider this is an event handler.
 * This is like a middleware.
 * you should include next().
 * */ 

connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(this.toUserId)) {
        throw new Error("Cannot send connection request to Yourself");
        
    }
    next();
})

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;