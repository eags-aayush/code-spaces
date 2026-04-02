import mongoose from 'mongoose';

const chatLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{
    sender: { type: String, enum: ['user', 'sakhi'] },
    text: String,
    timestamp: { type: Date, default: Date.now },
  }],
  distressDetected: { type: Boolean, default: false },
}, { timestamps: true });

const ChatLog = mongoose.model('ChatLog', chatLogSchema);
export default ChatLog;
