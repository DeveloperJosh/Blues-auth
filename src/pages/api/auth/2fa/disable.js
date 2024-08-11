import User from "@/models/User";
import { authenticate } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnect";

export default async function disableTwoFactorHandler(req, res) {
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
  
      user.twoFactorEnabled = false;
      user.twoFactorSecret = null;
      await user.save();
  
      res.status(200).json({ message: '2FA disabled' });
    } catch (error) {
      console.error('2FA disable error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
}  