const mongoose =require("mongoose");
const User = require("./user")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: {
             values: ["ignored", "interested", "rejected", "accepted"],
             message: `{VALUE} is incorrect status type`
        },
        required: true,
    }
},
{
    timestamps: true,
});

connectionRequestSchema.pre("save", function (next){
    const connection = this;
    if(connection.fromUserId.equals(connection.toUserId))
    {
        throw new Error("cannot send request to yourself")
    }
    next();
});

connectionRequestSchema.index({ fromUserId: 1 , toUserId: 1})

const ConnectionRequest  = new mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;