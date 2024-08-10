import crypto from 'crypto';
import User from '@/models/User';
import Forget from '@/models/Forget';
import sendEmail from '@/lib/Email';
import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
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

        const token = crypto.randomBytes(32).toString('hex');
        const expire = new Date(Date.now() + 3600000); // 1 hour

        const forget = {
            email,
            token,
            expire,
        };

        const newForget = new Forget(forget);
        await newForget.save();

        await sendEmail(
            user.email,
            'Reset your password',
            `<p>You requested to reset your password. Click the link below to reset it.</p><p><a href="https://auth.blue-dev.xyz/reset-password/${token}">Reset Password</a></p>`,
        );

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}
