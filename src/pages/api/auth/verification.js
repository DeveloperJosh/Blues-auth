import User from "@/models/User";
import Verify from "@/models/Verify";
import dbConnect from '@/lib/dbConnect';
import sendEmail from "@/lib/Email";

export default async function handler(req, res) {
    await dbConnect();
    
    if (req.method !== 'POST') {  // Use POST instead of GET for security when handling tokens
        return res.status(405).end(); // Method Not Allowed
    }
    
    const { token } = req.body;
    
    try {
        const verification = await Verify.findOne({ token });
        if (!verification) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const user = await User.findOne({ email: verification.email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.verified) {
            return res.status(400).json({ message: 'Account already verified' });
        }

        user.verified = true;
        await user.save();

        await Verify.deleteOne({ token });

        res.status(200).json({ message: 'Account verified successfully' });

        // Send verification confirmation email asynchronously
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
