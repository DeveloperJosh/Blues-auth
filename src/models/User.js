import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false, required: true},
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
}, { timestamps: true, versionKey: false });

export default mongoose.models.User || mongoose.model('User', UserSchema);
