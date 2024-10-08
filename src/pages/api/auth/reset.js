import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Forget from '@/models/Forget';
import { encryptPassword } from '@/lib/crypto';
import sendEmail from '@/lib/Email';
import { log } from '@/lib/logs';

export default async function handler(req, res) {
    await dbConnect();
    
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }
    
    const { token, password } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    try {
       
        const resetToken = await Forget.findOne({ token });
        if (!resetToken) {
            await log('reset_failed', 'Unknown', ipAddress, 'Password reset failed: Invalid or expired token');
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        if (resetToken.expire < Date.now()) {
            await Forget.deleteOne({ token });
            await log('reset_failed', resetToken.email, ipAddress, 'Password reset failed: Token has expired');
            return res.status(400).json({ message: 'Token has expired' });
        }

        const encryptedPassword = await encryptPassword(password);

        await User.updateOne({ email: resetToken.email }, { password: encryptedPassword });

        await Forget.deleteOne({ token });

        res.status(200).json({ message: 'Password updated successfully' });

        await log('reset', resetToken.email, ipAddress, 'Password reset successfully');

        await sendEmail(
            resetToken.email,
            'Password Reset Successfully',
            '<p>Your password has been reset successfully. If you did not make this request, please contact us immediately at Blue@blue-dev.xyz.</p>',
        );

    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
