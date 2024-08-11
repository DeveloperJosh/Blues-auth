import mongoose from 'mongoose';

const VerifySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  token: { type: String, required: true },
  expire: { type: Date, required: true },
});

export default mongoose.models.Verify || mongoose.model('Verify', VerifySchema);
