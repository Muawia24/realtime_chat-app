import Message from "../models/Message";

export default class MessageController {
    static async getRoom(req, res) {
        const { room } = req.params.room;
        try {
            const messages = await Message.findOne({ room: room }).sort({ timestamp: 1 });
            return res.status(200).json(messages);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to fetch messages' });
        }
    }
}