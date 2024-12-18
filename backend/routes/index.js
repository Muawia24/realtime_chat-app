import express from "express";
import UsersController from "../controllers/UserController.js";
import MessageController from "../controllers/messageController.js";

const router = express.Router();

router.post('/register', UsersController.postNew);
router.post('/login', UsersController.logMe);

router.get('/chat/:room', MessageController.getRoom);

export default router;