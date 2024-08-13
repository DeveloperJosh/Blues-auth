import dbConnect from "@/lib/dbConnect";
import Website from "@/models/Website";
import User from "@/models/User";
import { generateId, generateToken } from "@/lib/crypo";
import { authenticate } from "@/lib/authMiddleware";
import sendEmail from "@/lib/Email";

export default async function handler(req, res) {
    await authenticate(req, res, async () => {
        await dbConnect();
    
        if (req.method !== "POST") {
            return res.status(405).end(); // Method Not Allowed
        }
    
        const { url, redirect } = req.body;
        const client_id = await generateId();
        const client_secret = await generateToken();
        const user = await User.findById(req.user._id).select('username email');

        if (!url) {
            return res.status(400).json({ message: 'URL is required' });
        }

        if (!redirect) {
            return res.status(400).json({ message: 'Redirect URL is required' });
        }

        try {

            const newWebsite = new Website({
                email: user.email,
                url,
                client_id,
                client_secret,
                redirect: redirect,
                permission: 'read',
            });

            await newWebsite.save();
            res.status(201).json({ message: 'Website added successfully', website: newWebsite });
            sendEmail(
                user.email,
                "Website Added",
                `<p>Hello ${user.username},</p><p>Your website has been added successfully. Here are your client credentials:</p><p>Client ID: ${client_id}</p><p>Client Secret: ${client_secret}</p><p>Redirect URL: ${redirect}</p>`,
            )
        } catch (error) {
            console.error(error);
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Website already exists' });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
}