import React, { useState } from 'react';
import { Map as MapIcon, Navigation, Shield, PhoneCall } from 'lucide-react';

export default function SafeRouteMap() {
  const [calculating, setCalculating] = useState(false);

  const mockCalculateRoute = () => {
    setCalculating(true);
    setTimeout(() => {
      setCalculating(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      {/* Mock Map View */}
      <div className="h-72 bg-[#e5e3df] relative flex items-center justify-center overflow-hidden">
        {/* Abstract road patterns */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=New+York,NY&zoom=14&size=800x400&sensor=false')] bg-cover bg-center mix-blend-multiply"></div>
        <div className="absolute top-4 right-4 flex flex-col gap-2">
           <button className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center text-gray-700 hover:bg-gray-50">
             <MapIcon size={18} />
           </button>
           <button className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center text-blue-500 hover:bg-gray-50">
             <Navigation size={18} />
           </button>
        </div>

        {/* Fake points of interest plotted safely */}
        <div className="absolute top-1/4 left-1/3 flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full shadow-lg z-10">
          <Shield size={16} />
        </div>
        <div className="absolute bottom-1/3 right-1/4 flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full shadow-lg z-10 ring-4 ring-red-500/20">
          <PhoneCall size={16} />
        </div>
        
        {/* Placeholder label */}
        <div className="z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-lg text-sm font-medium text-gray-600 shadow-sm border border-white">
          Google Maps Integration Placeholder
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Safe Walk Navigation</h2>
        <p className="text-gray-500 text-sm mb-6">Calculates walking paths prioritizing well-lit areas, open cameras, and proximity to 24/7 stores, police stations, and hospitals.</p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-4 h-4 rounded-full border-4 border-gray-300"></div>
            <input type="text" placeholder="Current Location" className="bg-transparent border-none flex-1 focus:outline-none text-sm" />
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-4 h-4 rounded-full border-4 border-red-400"></div>
            <input type="text" placeholder="Destination" className="bg-transparent border-none flex-1 focus:outline-none text-sm" />
          </div>
        </div>

        <button 
          onClick={mockCalculateRoute}
          disabled={calculating}
          className="w-full mt-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-medium transition-colors flex justify-center items-center gap-2"
        >
          {calculating ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <Shield size={18} />
              Find Safest Route
            </>
          )}
        </button>

        {/* Hidden Emergency Button below */}
        <div className="mt-4 flex justify-center">
            <button 
              onClick={async () => {
                try {
                  await fetch('http://localhost:5000/api/alerts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ source: 'SafeRouteMap', location: { lat: 0, lng: 0 } })
                  });
                } catch(e) { console.error('Silent alert failed'); }
              }}
              className="text-xs text-shop-primary/60 hover:text-shop-primary underline decoration-shop-primary/30 active:scale-95 transition-all"
            >
                Trigger Immediate Help
            </button>
        </div>
      </div>
    </div>
  );
}
