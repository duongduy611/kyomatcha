const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Find user
        const user = await User.findOne({ _id: decoded._id });
        
        if (!user) {
            throw new Error();
        }

        // Attach user to request
        req.user = user;
        req.token = token;
        
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Không có quyền truy cập'
        });
    }
};

module.exports = auth; 