import React from 'react';
import ProductCard from './ProductCard';

const products = [
  { id: 1, name: "Rose Water Mist", price: "$15.00", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80" },
  { id: 2, name: "Silk Sleeping Mask", price: "$22.00", image: "https://images.unsplash.com/photo-1541812674-601e33ea2196?auto=format&fit=crop&w=400&q=80" },
  { id: 'trigger', name: "Red Bangle", price: "$12.00", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80", isTrigger: true },
  { id: 3, name: "Lavender Essential Oil", price: "$18.00", image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=400&q=80" },
];

export default function ShopLayout() {
  return (
    <div className="animate-fade-in">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-light text-gray-800 mb-2">Self Care Essentials</h1>
        <p className="text-gray-500">Curated products for your daily routine.</p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
