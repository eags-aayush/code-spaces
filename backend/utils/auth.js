import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT token
 */
export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
        // For development/demo purposes without full auth, allow bypass if needed.
        // In real app, we might strictly reject. We will strictly reject here.
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'safespaces_secret_dev_key');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

/**
 * Utility to generate a token
 */
export const generateToken = (user) => {
    return jwt.sign(
        { _id: user._id, email: user.email }, 
        process.env.JWT_SECRET || 'safespaces_secret_dev_key', 
        { expiresIn: '24h' }
    );
};
