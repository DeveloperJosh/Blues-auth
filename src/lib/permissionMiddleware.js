import dbConnect from './dbConnect';
import Website from '../models/Website';

export const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    await dbConnect();

    const { client_id } = req.body; // Getting client_id from the body
    const client_secret = req.headers['x-client-secret'];
    const internalToken = req.headers['x-internal-token'];

    try {
      if (internalToken === process.env.NEXT_PUBLIC_INTERNAL_SECRET_TOKEN) {
        console.log('Internal request detected');
        return next(); 
      }

      if (!client_id || !client_secret) {
        return res.status(400).json({ message: 'Missing client_id or client_secret' });
      }

      const website = await Website.findOne({ client_id, client_secret });
      if (!website) {
        return res.status(401).json({ message: 'Invalid client credentials' });
      }

      if (!website.permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: `Permission '${requiredPermission}' not allowed` });
      }

      req.website = website;
      return next();
    } catch (error) {
      console.error('Error checking permissions:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};
