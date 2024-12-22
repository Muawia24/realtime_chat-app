import Message from "../models/Message.js";
import ChatRoom from "../models/ChatRoom.js";

export default class MessageController {
    static async newRoom(req, res) {
        try {
            const { name, participants, isGroup, admin } = req.body;

            const newRoom = new ChatRoom({
                name,
                participants,
                isGroup,
                admin: isGroup ? admin : undefined,
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
            const userId = req.params.userId
            const userRooms = await ChatRoom.find({ participants: userId });

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
            const updatedRoom = await ChatRoom.findByIdAndUpdate(roomId, { participants }, { new: true });
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