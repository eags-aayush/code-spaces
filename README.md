# Safe Spaces

Safe Spaces is a discreet digital safety application designed for domestic violence survivors. It operates as a decoy lifestyle/e-commerce application with hidden safety features.

## Features
- **SafeBuy:** Add the "Red Bangle" to the cart to silently trigger an emergency alert.
- **Sakhi AI Chat:** A disguised chat interface connected to an AI that detects distress and offers resources.
- **Hidden Calendar Journal:** Looks like a cycle tracker, but opens an encrypted vault on double click (PIN protected).
- **SafeRoute Navigation:** Map system indicating safest walking routes and nearby safe zones (hospitals, police).
- **Voice Trigger:** Uses the Web Speech API to listen for innocent voice commands like "remind me to buy milk" to invoke alerts without physical interaction.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Lucide Icons
- Backend: Node.js, Express, MongoDB (Mongoose)

## Setup Instructions

### Backend setup
1. Navigate to `/backend`
2. Run `npm install`
3. Create a `.env` file with `MONGO_URI` and API keys
4. Run `npm start` (Runs on port 5000)

### Frontend setup
1. Navigate to `/frontend`
2. Run `npm install`
3. Run `npm run dev` to start the Vite server
