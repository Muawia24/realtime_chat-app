import express from "express";
import UsersController from "../controllers/UserController.js";
import MessageController from "../controllers/messageController.js";
import protect from "../middlewares/authMiddleware.js";
import isRoomAdmin from "../middlewares/isRoomAdmin.js";
import upload from "../config/multer.js.js";

const router = express.Router();

router.post('/auth/register', UsersController.postNew);
router.post('/auth/login', UsersController.logMe);
router.get('/users', protect, UsersController.getAllUsers);
router.post('/roomusers', UsersController.getRoomUsers);

router.get('/chatrooms', protect, MessageController.getUserRooms );
router.post('/chatrooms', protect, MessageController.newRoom);
router.get('/chatrooms/:roomName', protect, MessageController.getRoom);
router.post('/chatrooms/:roomName/addUserToRoom', protect, isRoomAdmin, MessageController.addUserToRoom);
router.post(`/chatrooms/:roomName/removeUser`, protect, isRoomAdmin, MessageController.removeUserInRoom);
router.post(`/chatrooms/:roomName/exit`, protect, MessageController.exitRoom);
router.post(`/chatrooms/:roomName/messages`, protect, upload.single('file'), MessageController.newMessage);
router.delete('/messages/:messageId', protect, MessageController.messageDelete);

export default router;