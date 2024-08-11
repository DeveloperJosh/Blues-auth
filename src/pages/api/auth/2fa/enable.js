import User from "@/models/User";
import { authenticate } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnect";
import { generateTwoFactorSecret } from "@/lib/crypo";

export default async function enableTwoFactorHandler(req, res) {
  await authenticate(req, res, async () => {
    await dbConnect();
  
    if (req.method !== 'POST') {
      return res.status(405).end(); // Method Not Allowed
    }
  
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const twoFactorSecret = generateTwoFactorSecret();
      user.twoFactorSecret = twoFactorSecret;
      user.twoFactorEnabled = true;
      await user.save();
  
      res.status(200).json({ secret: twoFactorSecret });
    } catch (error) {
      console.error('2FA setup error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
}
  