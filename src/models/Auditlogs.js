// audit logs model
import mongoose from "mongoose";

const AuditlogsSchema = new mongoose.Schema({
    action: { type: String, required: true },
    description: { type: String },
    user: { type: String, required: true },
    ip: { type: String, required: true },
    time: { type: Date, required: true },
});

export default mongoose.models.Auditlogs || mongoose.model('Auditlogs', AuditlogsSchema);