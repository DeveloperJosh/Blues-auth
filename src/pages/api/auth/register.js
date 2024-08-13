import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Verify from '@/models/Verify';
import { encryptPassword, generateToken } from '@/lib/crypto';
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
    const gen_token = await generateToken();

    const user = {
      username,
      email,
      password: encryptedPassword,
      twoFactorEnabled: false,
    };

    const newUser = new User({
      ...user,
    });
    await newUser.save();

    // Create a new verification entry
    const verificationEntry = new Verify({
      email: email,
      token: gen_token,
      expire: new Date(Date.now() + 3600000), // Token expires in 1 hour
    });

    await verificationEntry.save();

    console.log(newUser); // Log the new user object to see all fields
    res.status(201).json({ message: 'User registered successfully' });

    await sendEmail(
        email,
        "Welcome to Blue's Auth",
        `<p>Hello ${username},</p><p>Your account has been created successfully. Please click the link below to verify your account.</p><p><a href="https://auth.blue-dev.xyz/auth/verify/${gen_token}">Verify Account</a></p>`,
    ); 
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
