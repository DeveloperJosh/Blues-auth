import { authenticate } from '../../../lib/authMiddleware';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  await authenticate(req, res, async () => {
    try {
      // Fetch the latest user data from the database using the user ID
      const user = await User.findById(req.user._id).select('username email twoFactorEnabled');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return the user data including the latest 2FA status
      res.status(200).json({
        username: user.username,
        email: user.email,
        twoFactorEnabled: user.twoFactorEnabled,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
}
