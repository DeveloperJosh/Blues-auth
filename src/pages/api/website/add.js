import dbConnect from "@/lib/dbConnect";
import Website from "@/models/Website";
import User from "@/models/User";
import { generateId, generateToken } from "@/lib/crypo";
import { authenticate } from "@/lib/authMiddleware";

export default async function handler(req, res) {
    await authenticate(req, res, async () => {
        await dbConnect();
    
        if (req.method !== "POST") {
            return res.status(405).end(); // Method Not Allowed
        }
    
        const { url, redirect, email } = req.body;
        const client_id = await generateId();
        const client_secret = await generateToken();

        if (!url) {
            return res.status(400).json({ message: 'URL is required' });
        }

        if (!redirect) {
            return res.status(400).json({ message: 'Redirect URL is required' });
        }

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        try {

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            const newWebsite = new Website({
                email: email,
                url,
                client_id,
                client_secret,
                redirect: redirect,
                permission: 'read',
            });

            await newWebsite.save();
            res.status(201).json({ message: 'Website added successfully', website: newWebsite });
        } catch (error) {
            console.error(error);
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Website already exists' });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
}
