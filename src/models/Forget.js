import mongoose from 'mongoose';

const ForgetSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  token: { type: String, required: true },
  expire: { type: Date, required: true },
});

export default mongoose.models.Forget || mongoose.model('Forget', ForgetSchema);
