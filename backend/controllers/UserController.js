import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default class UsersController {
    static async postNew(req, res) {
        const { name, email, password } = req.body;

        if (!email) {
            res.status(400).send({ error: 'Missing email' });
            return;
        }
        if (!password) {
            res.status(400).send({ error: 'Missing password' });
            return;
        }
        try {
            const user = await User.findOne({ email });

            if (user) {
                res.status(400).send({ error: 'User already exist' });
                return;
              }
            const hashedPwd = await bcrypt.hash(password, 10);

            const newUser = new User({ name, email, password: hashedPwd });
            if (!newUser) {
                return res.status(400).json({ message: 'Invalid user data' });
            }
            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                token: token,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }

    static async logMe(req, res) {
        const { email, password } = req.body;
        try {
            console.log(email);
            const user = await User.findOne({ email });
            if (!user) {
                console.log('no user found');
                return res.status(401).json({ error: "Invalid email or password" });
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid email or password" });
            }
            console.log(isMatch);

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token,
            });
        } catch(error) {
            console.error(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }
    static async getAllUsers(req, res) {
        try {
            const users = await User.find({});
            console.log(users);
            return res.status(200).json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }
    static async getRoomUsers(req, res) {
        const users = req.body.userIds;
        try {
            const roomUsers = await User.find({ _id: { $in: users }});

            return res.status(200).json(roomUsers);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error" });
        }
        
    }
}