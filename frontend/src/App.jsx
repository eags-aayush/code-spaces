import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ShopLayout from './components/Shop/ShopLayout';
import SakhiChat from './components/Chat/SakhiChat';
import HiddenCalendar from './components/Journal/HiddenCalendar';
import SafeRouteMap from './components/Map/SafeRouteMap';
import useVoiceTrigger from './hooks/useVoiceTrigger';
import { Heart, MessageCircle, Calendar as CalendarIcon, MapPin } from 'lucide-react';

function App() {
  // Initiating background voice listener for the secret phrase
  const { listening, error } = useVoiceTrigger("remind me to buy milk");

  // Auto-login dummy user for demo purposes to get a valid JWT token
  React.useEffect(() => {
    const initDemoAuth = async () => {
      if (!localStorage.getItem('safe_spaces_token')) {
        try {
          // Attempt login first
          let res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'demo@safespaces.app', password: 'demo' })
          });
          let data = await res.json();
          
          if (!res.ok) {
            // Register if login fails
            res = await fetch('http://localhost:5000/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: 'Demo User', email: 'demo@safespaces.app', password: 'demo', pin: '1234' })
            });
            data = await res.json();
          }
          if (data.token) {
            localStorage.setItem('safe_spaces_token', data.token);
          }
        } catch(e) { console.error("Auto auth failed", e); }
      }
    };
    initDemoAuth();
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Mock Navigation for Demo purposes */}
        <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto flex justify-between items-center text-shop-primary">
            <Link to="/" className="text-xl font-semibold tracking-wide flex items-center gap-2">
              <Heart className="w-6 h-6" fill="currentColor" />
              Lumina Lifestyle
            </Link>
            <div className="flex gap-4">
               <Link to="/chat" className="hover:text-shop-secondary transition-colors"><MessageCircle /></Link>
               <Link to="/calendar" className="hover:text-shop-secondary transition-colors"><CalendarIcon /></Link>
               <Link to="/routes" className="hover:text-shop-secondary transition-colors"><MapPin /></Link>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl w-full mx-auto p-4 py-8">
          <Routes>
            <Route path="/" element={<ShopLayout />} />
            <Route path="/chat" element={<SakhiChat />} />
            <Route path="/calendar" element={<HiddenCalendar />} />
            <Route path="/routes" element={<SafeRouteMap />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
