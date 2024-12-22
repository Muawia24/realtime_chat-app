import express from "express";
import UsersController from "../controllers/UserController.js";
import MessageController from "../controllers/messageController.js";

const router = express.Router();

router.post('/auth/register', UsersController.postNew);
router.post('/auth/login', UsersController.logMe);

router.get('/chat/:room', MessageController.getRoom);

export default router;