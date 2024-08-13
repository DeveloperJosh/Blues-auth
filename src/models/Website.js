
import mongoose from "mongoose";

const WebsiteSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    client_id: { type: String, required: true, unique: true },
    client_secret: { type: String, required: true, unique: true },
    redirect: { type: String, required: true, unique: true }, 
    permissions: { 
        type: [String], 
        required: true, 
        enum: ['read', 'write', 'delete'], 
        default: ['read']
    }
});

export default mongoose.models.Website || mongoose.model('Website', WebsiteSchema);
