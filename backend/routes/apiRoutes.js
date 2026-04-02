import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import JournalEntry from '../models/JournalEntry.js';
import Alert from '../models/Alert.js';
import ChatLog from '../models/ChatLog.js';
import { generateToken, verifyToken } from '../utils/auth.js';
import { encrypt, decrypt } from '../utils/encryption.js';

const router = express.Router();

// --- Auth Routes ---
router.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password, pin } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPin = await bcrypt.hash(pin, 10);
        
        const newUser = new User({
            name, email, password: hashedPassword, pin: hashedPin
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', token: generateToken(newUser) });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({ token: generateToken(user), message: 'Login successful' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/auth/verify-pin', verifyToken, async (req, res) => {
    try {
        const { pin } = req.body;
        const user = await User.findById(req.user._id);
        if (!user || !(await bcrypt.compare(pin, user.pin))) {
            return res.status(401).json({ verified: false, message: 'Invalid PIN' });
        }
        return res.status(200).json({ verified: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Alert System (SafeBuy & Voice) ---
router.post('/alerts', async (req, res) => {
    try {
        const { source, location } = req.body;
        console.log(`[URGENT] EMERGENCY ALERT TRIGGERED via ${source}! Location:`, location);
        
        // Try to get user from token if available, otherwise use a dummy ID or null
        const token = req.header('Authorization')?.split(' ')[1];
        let userId = null;
        if (token) {
            try {
                const verified = jwt.verify(token, process.env.JWT_SECRET || 'safespaces_secret_dev_key');
                userId = verified._id;
            } catch (e) {
                // Ignore token error for anonymous triggers
            }
        }

        const newAlert = new Alert({
            user: userId || '000000000000000000000000', // Dummy ObjectId
            triggerSource: source,
            location
        });
        await newAlert.save();
        
        // Mock Twilio SMS Dispatch
        console.log(`[MOCK TWILIO] Dispatching SMS to user's emergency contacts with location data...`);
        
        res.status(200).json({ success: true, message: 'Alert dispatched silently' });
    } catch (err) {
         res.status(500).json({ error: err.message });
    }
});

// --- Sakhi AI Chat ---
router.post('/chat', verifyToken, async (req, res) => {
    try {
        const { message } = req.body;
        const distressKeywords = ['hit', 'scared', 'help', 'hurt', 'abuse'];
        const isDistress = distressKeywords.some(k => message.toLowerCase().includes(k));

        let reply = "Sakhi here! How can I help you today?";
        if (isDistress) {
            reply = "I'm here for you. We can explore resources together, or I can immediately notify your trusted contacts. Please ensure you are in a safe place. You are not alone.";
        }
        
        // In a real implementation we would call OpenAI API here:
        // const completion = await openai.createChatCompletion({...}); 

        // Optional: Save to chat log
        let log = await ChatLog.findOne({ user: req.user._id });
        if (!log) log = new ChatLog({ user: req.user._id, messages: [] });
        
        log.messages.push({ sender: 'user', text: message });
        log.messages.push({ sender: 'sakhi', text: reply });
        if (isDistress) log.distressDetected = true;
        await log.save();

        res.status(200).json({ reply, isDistress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Hidden Calendar Journal ---
router.get('/journal', verifyToken, async (req, res) => {
    try {
        const entries = await JournalEntry.find({ user: req.user._id }).sort({ date: -1 });
        // Decrypt content before sending
        const decryptedEntries = entries.map(entry => ({
            ...entry._doc,
            content: decrypt(entry.content)
        }));
        res.status(200).json({ entries: decryptedEntries });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/journal', verifyToken, async (req, res) => {
    try {
        const { date, title, content, mediaUrls } = req.body;
        const encryptedContent = encrypt(content);
        
        const newEntry = new JournalEntry({
            user: req.user._id,
            date,
            title,
            content: encryptedContent,
            mediaUrls
        });
        await newEntry.save();
        res.status(201).json({ success: true, entry: { ...newEntry._doc, content } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Safe Route Navigation ---
router.get('/safe-routes', (req, res) => {
    // Return sample locations of police stations, hospitals, etc.
    res.status(200).json({ safeSpots: [
        { name: "City Center Police Demo", location: { lat: 0, lng: 0 }, type: 'police' },
        { name: "General Hospital Demo", location: { lat: 0.1, lng: 0.1 }, type: 'hospital' }
    ] });
});

export default router;
