import dbConnect from "@/lib/dbConnect";
import Website from "@/models/Website";
import { Tokenauthenticate } from "@/lib/tokenMiddleware";

export default async function handler(req, res) {
    await Tokenauthenticate(req, res, async () => {
        await dbConnect();
    
        if (req.method !== "GET") {
            return res.status(405).end(); // Method Not Allowed
        }
    
        const { client_id } = req.query; // Dynamic segment
    
        if (!client_id) {
            return res.status(400).json({ message: 'Client ID is required' });
        }
    
        try {
            const website = await Website.findOne({ client_id });
            if (!website) {
                return res.status(404).json({ message: 'Website not found' });
            }
            res.status(200).json(website);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    });
}
