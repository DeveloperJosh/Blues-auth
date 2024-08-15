import User from "@/models/User";
import { authenticate } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnect";
import { generateTwoFactorSecret } from "@/lib/crypto";
import { checkPermission } from "@/lib/permissionMiddleware";
import { log } from "@/lib/logs";

export default async function enableTwoFactorHandler(req, res) {
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
        await log('2fa_enable_failed', email, ipAddress, 'User not found');
        return res.status(400).json({ message: 'User not found' });
      }

      const secret = generateTwoFactorSecret(email);
      user.twoFactorSecret = secret;
      user.twoFactorEnabled = true;
      await user.save();

      res.status(200).json({ secret });

      await log('2fa_enable', user.email, ipAddress, 'Two-factor authentication enabled');
    } catch (error) {
      console.error('2FA setup error:', error);
      await log('2fa_enable_failed', email, ipAddress, 'An error occurred while enabling 2FA'); 
      res.status(500).json({ message: 'Server error' });
    }
  });
 });
}
