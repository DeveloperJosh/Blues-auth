import Website from '@/models/Website';
import dbConnect from './dbConnect';

export const Tokenauthenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    await dbConnect();

    // Find the website by the client_secret (token)
    const website = await Website.findOne({ client_secret: token });

    if (!website) {
      return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }

    // Attach the website to the request object for later use
    req.website = website;

    // Instead of calling next, directly proceed with the handler if async
    if (typeof next === 'function') {
      return next();
    } else {
      return res.status(500).json({ message: 'Unexpected behavior' });
    }
  } catch (error) {
    console.error('Token authentication error:', error);
    return res.status(500).json({ message: 'Server error during token authentication' });
  }
};
