import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useProduct } from '../hooks/use.Product';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { handleGetProductById } = useProduct();

  const handleNextImage = () => {
    if (product?.images?.length > 1) {
      setActiveImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const handlePrevImage = () => {
    if (product?.images?.length > 1) {
      setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };


  useEffect(() => {
    async function fetchProductDetails() {
      setLoading(true);
      try {
        const data = await handleGetProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProductDetails();
  }, [productId]);

  const formatPrice = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          <div className="aspect-square bg-white/5 border border-white/10 rounded-2xl animate-pulse"></div>
          <div className="space-y-6 pt-4 animate-pulse w-full max-w-lg">
            <div className="h-10 bg-white/5 rounded-lg w-3/4"></div>
            <div className="h-8 bg-white/5 rounded-lg w-1/4 mt-4"></div>
            <div className="space-y-3 pt-8">
              <div className="h-4 bg-white/5 rounded w-full"></div>
              <div className="h-4 bg-white/5 rounded w-5/6"></div>
              <div className="h-4 bg-white/5 rounded w-4/5"></div>
            </div>
            <div className="flex gap-4 pt-10">
              <div className="h-14 bg-white/5 rounded-xl w-1/2"></div>
              <div className="h-14 bg-white/5 rounded-xl w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center space-y-5">
          <h2 className="text-3xl font-bold text-gray-300">Product not found</h2>
          <p className="text-gray-500 max-w-md mx-auto">We couldn't find the product you're looking for. It might have been removed or the link is broken.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-8 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Handle active main image
  const images = product?.images || [];
  const mainImage = images[activeImageIndex]?.url || images[0]?.url || 'https://placehold.co/800x800/111111/FFFFFF/png?text=No+Image';

    return (
        <div className="h-[calc(100vh-80px)] bg-[#0a0a0a] text-white overflow-hidden font-sans selection:bg-[#facd15]/30">
            <div className="max-w-[1400px] h-full mx-auto px-6 md:px-10 py-6 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start h-full overflow-hidden">
                    
                    {/* Left Section (Images) */}
                    <div className="flex flex-col gap-5 h-full overflow-hidden">
                        <div className="relative w-full aspect-square bg-[#111] border border-white/10 rounded-2xl overflow-hidden group">
                            <img 
                                src={mainImage} 
                                alt={product.title} 
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePrevImage();
                                        }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#facd15] hover:text-black hover:border-[#facd15] hover:scale-110 z-10"
                                        aria-label="Previous image"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNextImage();
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#facd15] hover:text-black hover:border-[#facd15] hover:scale-110 z-10"
                                        aria-label="Next image"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                        
                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex-shrink-0">
                                {images.map((img, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 bg-[#111] ${
                                            activeImageIndex === idx 
                                                ? 'border-[#facd15] opacity-100 shadow-lg shadow-[#facd15]/20' 
                                                : 'border-transparent opacity-40 hover:opacity-100 hover:border-white/30'
                                        }`}
                                    >
                                        <img src={img.url} alt={`${product.title} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Section (Details) */}
                    <div className="flex flex-col h-full overflow-hidden">
                        <div className="flex-grow overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            <div className="mb-2">
                                <span className="text-[10px] font-bold tracking-[0.2em] text-[#facd15] uppercase">
                                    SNITCH Exclusive
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 capitalize leading-tight">
                                {product.title}
                            </h1>
                            
                            <div className="text-2xl md:text-3xl font-black text-white mb-8 tracking-tight">
                                {product.price ? formatPrice(product.price.amount, product.price.currency) : '₹0'}
                            </div>

                            <div className="mb-10">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Product Details</h3>
                                <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light whitespace-pre-wrap">
                                    {product.description}
                                </p>
                            </div>

                            {/* Premium Trust Badges */}
                            <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-y-6 gap-x-4 text-xs font-bold uppercase tracking-widest text-gray-500 mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/5 rounded-lg text-[#facd15]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                                    </div>
                                    <span>Free Shipping</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/5 rounded-lg text-[#facd15]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                    </div>
                                    <span>Secure Payment</span>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5 mt-auto">
                            <button className="flex-1 py-4 bg-[#facd15] hover:bg-yellow-400 text-black font-bold text-lg rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl shadow-[#facd15]/10">
                                Add to Cart
                            </button>
                            <button className="flex-1 py-4 bg-transparent border border-white/10 hover:border-white/30 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:bg-white/[0.02]">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ProductDetail;