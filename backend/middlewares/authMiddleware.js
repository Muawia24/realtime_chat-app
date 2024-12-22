import jwt from 'jsonwebtoken';
import User from '../models/User';

let token;

const protect =  async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decodedToken.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }

    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
}

export default protect;