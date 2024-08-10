import mongoose from "mongoose";

const WebsiteSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    url: { type: String, required: true, unique: true },
    token: { type: String, required: true, unique: true },
    redirect: { type: String, required: true, unique: true }, 
    permission: { 
        type: String, 
        required: true, 
        enum: ['read', 'write', 'delete'], 
        default: 'read'
     }, 
});

export default mongoose.models.Website || mongoose.model('Website', WebsiteSchema);