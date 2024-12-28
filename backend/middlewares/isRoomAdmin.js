import ChatRoom from '../models/ChatRoom.js';

const isRoomAdmin = async (req, res, next) => {
    const { roomName } = req.params; // The room ID should be passed in the request body

    try {
        const room = await ChatRoom.findOne({ name: roomName });
        console.log('heeere');
            console.log(room);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Check if the logged-in user is the admin of the room
        if (room.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not the admin of this room' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error checking room admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export default isRoomAdmin;
