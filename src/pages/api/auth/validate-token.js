import dbConnect from '@/lib/dbConnect';
import Forget from '@/models/Forget';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    const { token } = req.body;

    try {
        const resetToken = await Forget.findOne({ token });
        if (!resetToken) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        if (resetToken.expire < Date.now()) {
            return res.status(400).json({ message: 'Token has expired' });
        }

        res.status(200).json({ message: 'Token is valid' });

    } catch (error) {
        console.error('Error validating token:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
