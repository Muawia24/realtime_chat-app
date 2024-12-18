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
            await newUser.save();

            return res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }

    static async logMe(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: "Invalid email or password" });
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return res.json({ token });
        } catch(error) {
            console.error(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }
}