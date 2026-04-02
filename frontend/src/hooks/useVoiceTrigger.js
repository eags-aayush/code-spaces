import { useEffect, useState } from 'react';

/**
 * Custom hook to listen for a specific distress phrase using the Web Speech API.
 * e.g., "remind me to buy milk"
 */
export default function useVoiceTrigger(triggerPhrase = "remind me to buy milk") {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log('Voice heard:', transcript); // In prod, remove console log

      if (transcript.includes(triggerPhrase.toLowerCase())) {
        console.log(`Trigger phrase "${triggerPhrase}" detected!`);
        // Silently trigger the backend alert
        try {
          await fetch('http://localhost:5000/api/alerts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source: 'Voice', location: { lat: 0, lng: 0 } })
          });
        } catch (e) {
          console.error("Failed to silence voice alert", e);
        }
      }
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      // Restart listening to keep it active as a background listener when tab is open
      // In a real app, you'd need explicit user permission and handle this carefully
      // recognition.start(); 
    };

    // Start listening
    try {
        recognition.start();
    } catch(err) {
        console.error("Could not start recognition without interaction", err);
    }

    return () => {
      recognition.stop();
    };
  }, [triggerPhrase]);

  return { listening, error };
}
