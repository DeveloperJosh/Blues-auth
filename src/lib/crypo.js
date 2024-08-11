// password encryption and decryption
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import speakeasy from 'speakeasy';

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

export async function generateId() {
    return crypto.randomBytes(10).toString('hex');
}

export const generateTwoFactorSecret = () => {
    const secret = speakeasy.generateSecret();
    return secret.base32;
  };

export const verifyTwoFactorCode = (user, token) => {
    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
    });
  };