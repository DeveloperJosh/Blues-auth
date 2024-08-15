import crypto from 'crypto';
import User from '@/models/User';
import Forget from '@/models/Forget';
import sendEmail from '@/lib/Email';
import dbConnect from '@/lib/dbConnect';
import { log } from '@/lib/logs';

export default async function handler(req, res) {
    await dbConnect();
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            await log('no_user', email, ipAddress, 'Password reset requested, but user not found');
            return res.status(400).json({ message: 'User not found' });
        }

        const existingForget = await Forget.findOne({ email });
        if (existingForget) {
            await Forget.deleteOne({ email });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expire = new Date(Date.now() + 3600000); // 1 hour

        const forget = {
            email,
            token,
            expire,
        };

        const newForget = new Forget(forget);
        await newForget.save();

        res.status(200).json({ message: 'Email sent successfully' });

        await log('forgotten_password', user.email, ipAddress, 'Password reset requested');

        await sendEmail(
            user.email,
            'Reset your password',
            `<p>You requested to reset your password. Click the link below to reset it.</p><p><a href="https://auth.blue-dev.xyz/auth/reset-password/${token}">Reset Password</a></p>`,
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}
