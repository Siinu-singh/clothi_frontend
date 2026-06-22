'use client';
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Product {
  _id: string;
  image?: string;
  title: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  colors?: string[];
}

export default function NewArrivals({ limit = 8 }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadNewArrivals();
  }, []);

  const loadNewArrivals = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await fetch(`${API_BASE}/api/products?sort=new&limit=${limit}`, { headers });
      const data = await response.json();
      setProducts(data.data || data);
    } catch (err) {
      console.error('Failed to load new arrivals', err);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 4, products.length - 4));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 4, 0));
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg mb-3"></div>
              <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products?.length) return null;

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-sm text-emerald-600 font-medium uppercase tracking-wider">New Arrivals</span>
          <h2 className="text-2xl font-bold text-gray-900">Fresh Drops</h2>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-full border hover:bg-gray-50 flex items-center justify-center disabled:opacity-50 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            disabled={currentIndex >= products.length - 4}
            className="w-10 h-10 rounded-full border hover:bg-gray-50 flex items-center justify-center disabled:opacity-50 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="overflow-hidden">
        <div 
          className="flex gap-4 transition-transform duration-300"
          style={{ transform: `translateX(-${currentIndex * 25}%)` }}
        >
          {products.map((product) => (
            <a 
              key={product._id} 
              href={`/product/${product._id}`}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-1/4"
            >
              <div className="group">
                <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {product.badge === 'new' && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      NEW
                    </span>
                  )}
                  {product.badge === 'bestseller' && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                      BESTSELLER
                    </span>
                  )}
                  {product.badge === 'premium' && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded-full">
                      PREMIUM
                    </span>
                  )}
                </div>
                
                <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-gray-900">₹{product.price}</span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.oldPrice}
                    </span>
                  )}
                </div>
                {product.colors && product.colors.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {product.colors.slice(0, 4).map((color, i) => (
                      <span 
                        key={i}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* View All Link */}
      <div className="mt-8 text-center">
        <a 
          href="/catalog?sort=new" 
          className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:gap-3 transition-all"
        >
          View All New Arrivals
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
