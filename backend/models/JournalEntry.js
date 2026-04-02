import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, // Encrypted ideally
  mediaUrls: [{ type: String }], // Photos, voice notes
}, { timestamps: true });

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);
export default JournalEntry;
