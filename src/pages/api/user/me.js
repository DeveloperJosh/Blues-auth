import { authenticate } from '../../../lib/authMiddleware';
import { checkPermission } from '../../../lib/permissionMiddleware';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  try {
    await dbConnect();
    await authenticate(req, res, async () => {
      await checkPermission('read')(req, res, async () => {
        try {
          const user = await User.findById(req.user._id).select('username email twoFactorEnabled');

          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }

          return res.status(200).json({
            username: user.username,
            email: user.email,
            twoFactorEnabled: user.twoFactorEnabled,
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Server error' });
        }
      });
    });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
