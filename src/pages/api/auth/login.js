import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';
import { comparePassword, verifyTwoFactorCode } from '../../../lib/crypo';
import sendEmail from '@/lib/Email';
import useragent from 'useragent';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, password, twoFactorToken } = req.body;

  try {
    const user = await User.findOne({ email }).select('username email password twoFactorEnabled twoFactorSecret verified');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password.trim(), user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.verified) {
      return res.status(400).json({ message: 'Account not verified' });
    }

    if (user.twoFactorEnabled && !twoFactorToken) {
      return res.status(200).json({ requires2FA: true });
    }
    
    if (user.twoFactorEnabled && twoFactorToken) {
      if (!verifyTwoFactorCode(user, twoFactorToken)) {
        return res.status(400).json({ message: 'Invalid 2FA token' });
      }
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, twoFactorEnabled: user.twoFactorEnabled },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const agent = useragent.parse(req.headers['user-agent']);
    const deviceInfo = `${agent.family} on ${agent.os.family}`;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    res.status(200).json({ token });

    await sendEmail(
      email, 
      "Login Notification", 
      `New Login Detected<br><br>Device: ${deviceInfo}<br><br>IP Address: ${ipAddress}`
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
