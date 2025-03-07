const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    serviceName: { type: String, required: true }, 
    serviceId: { type: String, required: true, unique: true }, 
    encryptedPassword: { type: String, required: true },
}, { timestamps: true });

const Password = mongoose.model('Password', passwordSchema);

module.exports = Password;