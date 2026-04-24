import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hooks/use.Product'
import { ShoppingBag, Heart } from 'lucide-react'
import { useNavigate } from 'react-router'

const Home = () => {
    const products = useSelector(state => state.product.products)
    const { handleGetAllProducts } = useProduct()
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                await handleGetAllProducts()
            } catch (error) {
                console.error("Failed to fetch products:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    return (
        <div className="h-[calc(100vh-80px)] bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#facd15]/30 overflow-hidden">
            <div className="max-w-[1400px] w-full mx-auto px-6 md:px-10 py-8 flex flex-col h-full">
                {/* Header Section */}
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                        Explore Products
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base font-light">
                        Discover the latest items curated for your lifestyle.
                    </p>
                </div>

                {/* Product Grid Container */}
                <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6">
                        {loading ? (
                            /* Skeleton Loading UI */
                            Array.from({ length: 8 }).map((_, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4 animate-pulse">
                                    <div className="w-full aspect-square bg-white/10 rounded-xl"></div>
                                    <div className="space-y-3">
                                        <div className="h-5 bg-white/10 rounded w-3/4"></div>
                                        <div className="h-4 bg-white/10 rounded w-full"></div>
                                    </div>
                                    <div className="mt-auto pt-4">
                                        <div className="h-6 bg-white/10 rounded w-1/3"></div>
                                    </div>
                                </div>
                            ))
                        ) : products && products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard key={product._id || product.id} product={product} onClick={() => navigate(`/product/${product._id || product.id}`)} />
                            ))
                        ) : (
                            /* Empty State */
                            <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-500 bg-white/[0.02] rounded-3xl border border-white/10 border-dashed">
                                <ShoppingBag className="w-12 h-12 mb-4 opacity-30" />
                                <p className="text-lg font-medium text-gray-400">No products available</p>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="mt-6 px-6 py-2 bg-[#facd15] text-black font-bold rounded-full hover:bg-yellow-400 transition-all text-sm"
                                >
                                    Refresh Page
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const ProductCard = ({ product, onClick }) => {
    // Safely extract main and hover images
    const imageUrl = product?.images?.[0]?.url || 'https://placehold.co/600x600/111111/FFFFFF/png?text=No+Image';
    const hoverImageUrl = product?.images?.[1]?.url || imageUrl;

    const formatPrice = (amount, currency = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <div onClick={onClick} className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#facd15]/5 transition-all duration-300 ease-in-out">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-[#111] p-2.5">
                <div className="w-full h-full relative rounded-xl overflow-hidden">
                    <img 
                        src={imageUrl} 
                        alt={product.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-0"
                        loading="lazy"
                    />
                    <img 
                        src={hoverImageUrl} 
                        alt={product.title} 
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-100"
                        loading="lazy"
                    />
                </div>
                
                {/* Floating Actions */}
                <div className="absolute top-5 right-5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-[#facd15] hover:text-black transition-colors shadow-xl">
                        <Heart className="w-4 h-4" />
                    </button>
                </div>
                
                {/* Quick Action Overlay (Optional visual cue) */}
                <div className="absolute inset-x-4 bottom-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
                    <button className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-black font-semibold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-2xl text-sm">
                        View Product
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow p-5 pt-4">
                <div className="mb-2">
                    <h3 className="text-[1.05rem] font-bold text-white/95 leading-tight capitalize truncate" title={product.title}>
                        {product.title}
                    </h3>
                </div>
                
                <p className="text-sm text-gray-400 line-clamp-2 mb-5 leading-relaxed flex-grow">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-extrabold text-[#facd15] tracking-tight">
                        {product.price ? formatPrice(product.price.amount, product.price?.currency) : '₹0'}
                    </span>
                    <div className="p-2 bg-white/5 rounded-full group-hover:bg-[#facd15]/10 group-hover:text-[#facd15] transition-colors text-gray-400">
                        <ShoppingBag className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home