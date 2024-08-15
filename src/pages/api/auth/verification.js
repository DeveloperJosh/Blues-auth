import User from "@/models/User";
import Verify from "@/models/Verify";
import dbConnect from '@/lib/dbConnect';
import sendEmail from "@/lib/Email";
import { log } from "@/lib/logs";

export default async function handler(req, res) {
    await dbConnect();
    
    if (req.method !== 'POST') {  
        return res.status(405).end(); // Method Not Allowed
    }
    
    const { token } = req.body;
    
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    try {
        const verification = await Verify.findOne({ token });
        if (!verification) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const user = await User.findOne({ email: verification.email });
        if (!user) {
            await log('verify_failed', verification.email, ipAddress, 'User not found');
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.verified) {
            await log('verify_failed', user.email, ipAddress, 'Account already verified');
            return res.status(400).json({ message: 'Account already verified' });
        }

        user.verified = true;
        await user.save();

        await Verify.deleteOne({ token });

        res.status(200).json({ message: 'Account verified successfully' });

        await log('verify', user.email, ipAddress, 'Account verified');

        sendEmail(
            user.email,
            "Account Verified",
            `Hello ${user.username},<br/><br/>Your account has been verified successfully.<br/><br/>You can now log in to your account.`
        ).catch(err => console.log('Failed to send email:', err));

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
