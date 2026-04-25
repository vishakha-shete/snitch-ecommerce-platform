import React, { useEffect, useState } from "react";
import { useProduct } from "../hooks/use.Product";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Plus, Package, Edit3, Trash2, Eye } from "lucide-react";

const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatPrice = (amount, currency = "INR") => {
    if (!amount) return "";
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { handleGetSellerProduct } = useProduct();
    const sellerProducts = useSelector(
        (state) => state.product?.sellerProducts || []
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            await handleGetSellerProduct();
            setLoading(false);
        })();
    }, []);

    return (
        <div className="h-[calc(100vh-80px)] bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#facd15]/30 overflow-hidden">
            <div className="max-w-[1400px] w-full mx-auto px-6 md:px-10 py-8 flex flex-col h-full">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Your Products
                        </h1>
                        <p className="text-neutral-500 text-sm mt-1">
                            Manage and grow your inventory with ease.
                        </p>
                    </div>

                    <Link
                        to="/seller/create-product"
                        className="flex items-center gap-2 bg-[#facd15] text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all text-sm shadow-lg shadow-[#facd15]/10"
                    >
                        <Plus className="w-5 h-5" />
                        Add Product
                    </Link>
                </div>

                {/* SCROLLABLE GRID CONTAINER */}
                <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-6">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse bg-white/[0.02] border border-white/5 h-72 rounded-2xl"
                                />
                            ))}
                        </div>
                    ) : sellerProducts.length > 0 ? (
                        /* PRODUCTS GRID */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                            {sellerProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="group bg-white/[0.02] border border-white/10 rounded-2xl p-4 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#facd15]/5 transition-all duration-300"
                                >
                                    {/* IMAGE */}
                                    <div 
                                        onClick={() => navigate(`/seller/product/${product._id}`)}
                                        className="relative aspect-square overflow-hidden rounded-xl mb-4 bg-black/40 cursor-pointer"
                                    >
                                        {product.images?.length ? (
                                            <img
                                                src={product.images[0]?.url}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <Package className="w-10 h-10 text-neutral-800" />
                                            </div>
                                        )}

                                        {/* ACTIONS */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all duration-300 backdrop-blur-sm">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Add edit logic here if needed
                                                }}
                                                className="p-2.5 bg-white/10 rounded-full hover:bg-[#facd15] hover:text-black transition-colors"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/seller/product/${product._id}`);
                                                }}
                                                className="p-2.5 bg-white/10 rounded-full hover:bg-white hover:text-black transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Add delete logic here
                                                }}
                                                className="p-2.5 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    <h3 
                                        onClick={() => navigate(`/seller/product/${product._id}`)}
                                        className="font-bold text-base truncate mb-1 cursor-pointer hover:text-[#facd15] transition-colors"
                                    >
                                        {product.title}
                                    </h3>

                                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-4">
                                        {product.description}
                                    </p>

                                    {/* FOOTER */}
                                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                        <span className="text-[#facd15] font-bold text-sm">
                                            {formatPrice(product.price?.amount)}
                                        </span>

                                        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-600">
                                            {formatDate(product.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* EMPTY STATE */
                        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                            <Package className="w-12 h-12 text-neutral-800 mb-4" />
                            <h2 className="text-xl font-bold">Inventory is empty</h2>
                            <p className="text-neutral-500 mt-2 mb-8 text-center max-w-xs text-sm">
                                It looks like you haven't added any products to your store yet.
                            </p>
                            <Link
                                to="/seller/create-product"
                                className="bg-[#facd15] text-black px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-[#facd15]/10"
                            >
                                Add Your First Product
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;