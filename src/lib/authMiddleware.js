import jwt from 'jsonwebtoken';
import User from '../models/User';
import dbConnect from './dbConnect';

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Establish database connection
    await dbConnect();

    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database
    req.user = await User.findById(decoded.userId).select('username email twoFactorEnabled');

    // if token expired
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ message: 'Token expired' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if next is a function before calling it
    if (typeof next === 'function') {
      return next();
    } else {
      return res.status(500).json({ message: 'Unexpected behavior: next is not a function' });
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token is not valid' });
    } else {
      // Log unexpected errors
      console.error('Unexpected error in authentication middleware:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
};
