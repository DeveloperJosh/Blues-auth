// password encryption and decryption
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import node2fa from 'node-2fa';

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

export const generateTwoFactorSecret = (email) => {
    const newSecret = node2fa.generateSecret( { name: 'Blue Auth', account: email } );
    console.log('2FA Secret:', newSecret.secret );
    return newSecret.secret;
};

export const verifyTwoFactorCode = (user, token) => {
    const result = node2fa.verifyToken(user.twoFactorSecret, token);
    return result && result.delta === 0; // Returns true if the token is valid
};
