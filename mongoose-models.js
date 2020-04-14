const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
    originalUrl: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    incomingDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    processed: {
        type: Boolean,
        required: true,
        default: false
    }
});

exports.contactMessageModel = mongoose.model('ContactMessage', contactMessageSchema);
