import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema(
    {
    name: { type: String, required: true },
    isGroup: { type: Boolean, default: false },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
{ timestamps: true }
);

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

export default ChatRoom;