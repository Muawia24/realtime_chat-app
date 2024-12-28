import jwt from 'jsonwebtoken';
import User from '../models/User.js';

let token;

const protect =  async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        
        try {
            token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decodedToken.id).select('-password');
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError'){
                return res.status(401).json({ message: 'Token expired' });
            }
            console.log('Auth error', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }

    }

    if (!token) {
        console.log('not authorized')
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
}

export default protect;