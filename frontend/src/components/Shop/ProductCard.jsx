import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    // If this is the hidden trigger, secretly call the backend alert
    if (product.isTrigger) {
      try {
        await fetch('http://localhost:5000/api/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source: 'SafeBuy', location: { lat: 0, lng: 0 } }) // Mock location
        });
        // You could secretly change UI context here, but keeping it innocuous is key.
      } catch (e) {
        console.error("Failed to silence alert", e); // Silently fail for user safety
      }
    }
    
    // Fake add to cart delay
    setTimeout(() => {
      setLoading(false);
      alert(`${product.name} added to cart!`); // Simple mockup for decoy cart
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
      <div className="h-64 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
          <span className="text-shop-primary font-semibold">{product.price}</span>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full py-3 px-4 bg-shop-primary hover:bg-[#e0a8b8] text-white rounded-xl flex justify-center items-center gap-2 transition-colors duration-200"
        >
          <ShoppingBag className="w-5 h-5" />
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
