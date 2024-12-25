import Message from "../models/Message.js";
import ChatRoom from "../models/ChatRoom.js";

export default class MessageController {
    static async newRoom(req, res) {
        try {
            const { name } = req.body;

            const existingRoom = await ChatRoom.findOne({ name });
            if (existingRoom) {
                return res.status(400).json({ message: 'Chat room already exists' });
            }

            const newRoom = new ChatRoom({
                name,
                users: req.user._id,
                admin: req.user._id,
            });
            const savedRoom = await newRoom.save();
            return res.status(201).json(savedRoom);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to create chat room'});
        }
    }

    static async getUserRooms (req, res) {
        try {
            const userId = req.user._id;
            const userRooms = await ChatRoom.find({ users: userId });

            return res.status(200).json(userRooms);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to user rooms'});   
        }
    }

    static async updateRoomMembers(req, res) {
        const { participants } = req.body;
        const roomId = req.params.roomId;

        try {
            const updatedRoom = await ChatRoom.findByIdAndUpdate(roomId, { users }, { new: true });
            return res.status(201).json(updatedRoom);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to update room members'});
        }

    }

    static async getRoom(req, res) {
        const { room } = req.params.room;
        try {
            const messages = await Message.find({ room: room }).sort({ timestamp: 1 });
            return res.status(200).json(messages);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to fetch messages' });
        }
    }
}