import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pin: { type: String, required: true }, // For accessing hidden features
  emergencyContacts: [{
    name: String,
    phone: String,
    email: String,
  }],
  trustedDevices: [String],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
