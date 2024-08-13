import dbConnect from '@/lib/dbConnect';
import Website from '@/models/Website';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { comparePassword, verifyTwoFactorCode } from '@/lib/crypo';
import sendEmail from '@/lib/Email';
import useragent from 'useragent';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    const { email, password, twoFactorToken, callback_url, client_id, client_secret } = req.body;

    try {
        if (!client_id || !client_secret || !callback_url) {
            console.error('Missing client_id, client_secret, or callback_url');
            return res.status(400).json({ message: 'Missing client_id, client_secret, or callback_url' });
        }

        const website = await Website.findOne({ client_id, client_secret });
        if (!website) {
            console.error('Invalid client credentials');
            return res.status(401).json({ message: 'Invalid client credentials' });
        }

        const user = await User.findOne({ email }).select('username email password twoFactorEnabled twoFactorSecret verified');
        if (!user) {
            console.error('Invalid credentials');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await comparePassword(password.trim(), user.password);
        if (!isMatch) {
            console.error('Invalid credentials');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.verified) {
            console.error('Account not verified');
            return res.status(400).json({ message: 'Account not verified' });
        }

        if (user.twoFactorEnabled && !twoFactorToken) {
            console.log('2FA required');
            return res.status(200).json({ requires2FA: true });
        }

        if (user.twoFactorEnabled && twoFactorToken) {
            if (!verifyTwoFactorCode(user, twoFactorToken)) {
                console.error('Invalid 2FA token');
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

        await sendEmail(
            email, 
            "Login Notification", 
            `New Login Detected<br><br>Device: ${deviceInfo}<br><br>IP Address: ${ipAddress}<br><br>You authenticated with ${website.url}`
        );

        const redirectUrl = `${callback_url}?token=${token}`;
        res.status(200).json({ redirectUrl });

    } catch (error) {
        console.error('SSO Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
