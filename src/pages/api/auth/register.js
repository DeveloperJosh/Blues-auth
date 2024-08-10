import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { encryptPassword } from '../../../lib/cryp';
import sendEmail from '@/lib/Email';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const encryptedPassword = await encryptPassword(password);

    const user = {
      username,
      email,
      password: encryptedPassword,
    };

    const newUser = new User(user);
    await newUser.save();       
    res.status(201).json({ message: 'User registered successfully' });
    await sendEmail({
        to: email,
        subject: "Welcome to Blue's Auth",
        text: `Hello ${username},\n\nWelcome to Blue's Auth!\n\nYou have successfully registered with the email ${email}.`,
      }); 
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
