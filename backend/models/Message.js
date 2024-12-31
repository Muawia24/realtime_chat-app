import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
    username: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    room: { type: String, required: true },
    content: { type: String, required: true },
    fileUrl: { type: String },
    timestamp: { type: Date, default: Date.now},
},
{ timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;