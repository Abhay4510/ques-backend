const crypto = require('crypto');
const dotenv = require('dotenv');
const { SECRET_KEY, SECRET_IV, ecnryptionMethod } = process.env;

if (!SECRET_KEY || !SECRET_IV || !ecnryptionMethod) {
  throw new Error('Secret key, secret IV, and encryption method are required.');
}

const key = Buffer.from(SECRET_KEY, 'hex');
const iv = Buffer.from(SECRET_IV, 'hex');

function encrypt(data) {
  const cipher = crypto.createCipheriv(ecnryptionMethod, key, iv);
  let encrypted = cipher.update(data, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedData) {
  const decipher = crypto.createDecipheriv(ecnryptionMethod, key, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
