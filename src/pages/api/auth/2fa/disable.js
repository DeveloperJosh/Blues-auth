import User from "@/models/User";
import { authenticate } from "@/lib/authMiddleware";
import { checkPermission } from "@/lib/permissionMiddleware";
import dbConnect from "@/lib/dbConnect";
import { log } from "@/lib/logs";

export default async function disableTwoFactorHandler(req, res) {
  await authenticate(req, res, async () => {
   await checkPermission('write')(req, res, async () => {
    await dbConnect();
  
    if (req.method !== 'POST') {
      return res.status(405).end(); // Method Not Allowed
    }
  
    const { email } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        await log('2fa_disable_failed', email, ipAddress, 'User not found');
        return res.status(400).json({ message: 'User not found' });
      }
  
      user.twoFactorEnabled = false;
      user.twoFactorSecret = null;
      await user.save();
  
      res.status(200).json({ message: 'Two-factor authentication has been disabled successfully.', staus: 'success' });

      await log('2fa_disable', user.email, ipAddress, 'Two-factor authentication disabled');
    } catch (error) {
      console.error('2FA disable error:', error);
      res.status(500).json({ message: 'An error occurred while disabling 2FA.' });
    }
  });
 });
}
