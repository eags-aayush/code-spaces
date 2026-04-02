import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  triggerSource: { type: String, enum: ['SafeBuy', 'Voice', 'Map', 'Other'], required: true },
  location: {
    lat: Number,
    lng: Number
  },
  status: { type: String, enum: ['Active', 'Resolved'], default: 'Active' },
  notifiedContacts: [String],
}, { timestamps: true });

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
