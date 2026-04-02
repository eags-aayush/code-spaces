import React, { useState } from 'react';
import { Lock, FileText, Camera, Mic, X } from 'lucide-react';

export default function HiddenCalendar() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [journalContent, setJournalContent] = useState('');
  const [saving, setSaving] = useState(false);

  // Generate fake calendar month
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const handleDoubleClick = (day) => {
    if (!unlocked) {
      setSelectedDate(day);
      setShowPinModal(true);
    } else {
      setSelectedDate(day);
      // Open journal directly
    }
  };

  const verifyPin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('safe_spaces_token')}`
        },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setUnlocked(true);
        setShowPinModal(false);
        setPin('');
        fetchJournalEntry();
      } else {
        alert("Incorrect Vault PIN");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying PIN");
    }
  };

  const fetchJournalEntry = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/journal', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('safe_spaces_token')}` }
      });
      const data = await res.json();
      if (data.entries?.length) {
        // Just as an example, map all entries to this text area for now, or match date
        // For demo, we just dump the latest or aggregate
        const entryDate = data.entries.find(e => new Date(e.date).getDate() === selectedDate);
        if (entryDate) {
          setJournalContent(entryDate.content);
        } else {
          setJournalContent('');
        }
      }
    } catch (e) { console.error("Error fetching journal", e); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('http://localhost:5000/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('safe_spaces_token')}`
        },
        body: JSON.stringify({
          date: new Date(new Date().setDate(selectedDate)),
          title: `Entry for Day ${selectedDate}`,
          content: journalContent,
          mediaUrls: []
        })
      });
      alert('Encrypted and Saved!');
    } catch (e) {
      console.error("Error saving journal", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in relative">
      <header className="mb-8 text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-light text-gray-800 mb-1">Cycle Tracker</h1>
        <p className="text-gray-500 text-sm">Double tap a date to log physical symptoms.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-center text-gray-400 text-sm font-medium">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days.map(day => (
            <div 
              key={day}
              onDoubleClick={() => handleDoubleClick(day)}
              className="aspect-square flex items-center justify-center rounded-xl bg-gray-50 hover:bg-shop-secondary/30 cursor-pointer transition-colors text-gray-700 font-medium user-select-none"
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {showPinModal && !unlocked && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
            <button 
              onClick={() => setShowPinModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-shop-primary/10 rounded-full flex items-center justify-center text-shop-primary">
                <Lock size={24} />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">Enter Vault PIN</h2>
            <form onSubmit={verifyPin}>
              <input 
                type="password" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                className="w-full text-center tracking-[0.5em] text-2xl py-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-shop-primary/50"
                placeholder="••••"
                maxLength={4}
              />
              <button 
                type="submit"
                className="w-full py-3 bg-shop-primary text-white rounded-xl font-medium hover:bg-[#e0a8b8] transition-colors"
              >
                Unlock
              </button>
            </form>
          </div>
        </div>
      )}

      {unlocked && selectedDate && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 animate-fade-in border-t-4 border-t-shop-primary">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Secure Vault: Day {selectedDate}</h2>
            <button 
              onClick={() => setUnlocked(false)}
              className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
            >
              <Lock size={14} /> Lock Vault
            </button>
          </div>
          
          <textarea 
            value={journalContent}
            onChange={e => setJournalContent(e.target.value)}
            className="w-full h-40 bg-gray-50 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-shop-primary/50 text-gray-700 resize-none mb-4"
            placeholder="Record incident details secretly. This data is encrypted and hidden."
          ></textarea>
          
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors">
              <Camera size={16} /> Add Photo
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors">
              <Mic size={16} /> Voice Note
            </button>
            <div className="flex-1"></div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-gray-800 hover:bg-gray-900 focus:ring-2 focus:ring-gray-400 text-white rounded-lg text-sm transition-colors font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Encrypted'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
