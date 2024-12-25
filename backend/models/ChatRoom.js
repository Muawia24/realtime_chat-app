import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema(
    {
    name: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true},
},
{ timestamps: true }
);

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

export default ChatRoom;