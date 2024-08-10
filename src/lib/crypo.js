// password encryption and decryption
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

export async function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}