import { authenticate } from '../../../lib/authMiddleware';

export default async function handler(req, res) {
  await authenticate(req, res, async () => {
    try {
      const user = req.user;
      res.status(200).json({ username: user.username, email: user.email });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
}
