import crypto from 'crypto';

/**
 * AES-256-CBC Encryption/Decryption utility
 * Uses the ENCRYPTION_KEY from environment variables (must be 32 bytes hex)
 */

const algorithm = 'aes-256-cbc';

const getSecretKey = () => {
    const key = process.env.ENCRYPTION_KEY;
    if (!key || key.length !== 64) {
        // Fallback for demo purposes if no key provided. 32 bytes (64 hex characters)
        return Buffer.from('1234567890123456789012345678901234567890123456789012345678901234', 'hex');
    }
    return Buffer.from(key, 'hex');
};

export const encrypt = (text) => {
    if (!text) return text;
    const iv = crypto.randomBytes(16);
    const key = getSecretKey();
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return `${iv.toString('hex')}:${encrypted}`;
};

export const decrypt = (text) => {
    if (!text) return text;
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const key = getSecretKey();
        
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        console.error('Decryption failed:', error.message);
        return '--- Decryption Failed ---';
    }
};
