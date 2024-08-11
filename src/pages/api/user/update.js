import { authenticate } from '../../../lib/authMiddleware';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  // Allow only PATCH requests
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await authenticate(req, res, async () => {
    try {
      const { twoFactorEnabled } = req.body;

      // Validate input
      if (typeof twoFactorEnabled !== 'boolean') {
        return res.status(400).json({ message: 'Invalid input' });
      }

      // Update the user's 2FA status
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { twoFactorEnabled },
        { new: true, runValidators: true }
      ).select('username email twoFactorEnabled');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        message: 'Two-Factor Authentication status updated',
        username: user.username,
        email: user.email,
        twoFactorEnabled: user.twoFactorEnabled,
      });
    } catch (error) {
      console.error('Error updating 2FA status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
}
