import React, { useEffect, useState } from "react";
import { useProduct } from "../hooks/use.Product";
import { useSelector } from "react-redux";
import { Link } from "react-router";
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
        <div className="min-h-screen bg-[#0a0a0a] text-white px-6 md:px-10 py-10">
            <div className="max-w-[1300px] mx-auto">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Your Products
                        </h1>
                        <p className="text-neutral-400 mt-2">
                            Manage and grow your inventory
                        </p>
                    </div>

                    <Link
                        to="/seller/create-product"
                        className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-xl font-medium hover:scale-105 transition"
                    >
                        <Plus className="w-5 h-5" />
                        Add Product
                    </Link>
                </div>

                {/* LOADING STATE */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse bg-white/5 h-72 rounded-2xl"
                            />
                        ))}
                    </div>
                ) : sellerProducts.length > 0 ? (

                    /* PRODUCTS GRID */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sellerProducts.map((product) => (
                            <div
                                key={product._id}
                                className="group bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:-translate-y-1 hover:shadow-2xl transition"
                            >

                                {/* IMAGE */}
                                <div className="relative aspect-square overflow-hidden rounded-xl mb-4">
                                    {product.images?.length ? (
                                        <img
                                            src={product.images[0]?.url}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-neutral-900">
                                            <Package className="w-10 h-10 text-neutral-600" />
                                        </div>
                                    )}

                                    {/* ACTIONS */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition">
                                        <button className="p-2 bg-white/20 rounded-full hover:scale-110">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-white/20 rounded-full hover:scale-110">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-red-500/30 rounded-full hover:scale-110">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <h3 className="font-semibold text-lg truncate">
                                    {product.title}
                                </h3>

                                <p className="text-sm text-neutral-400 line-clamp-2 mt-1">
                                    {product.description}
                                </p>

                                {/* FOOTER */}
                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
                                    <span className="text-yellow-400 font-bold">
                                        {formatPrice(product.price?.amount)}
                                    </span>

                                    <span className="text-xs text-neutral-500">
                                        {formatDate(product.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (

                    /* EMPTY STATE */
                    <div className="flex flex-col items-center justify-center py-28 border border-dashed border-white/10 rounded-3xl">
                        <Package className="w-12 h-12 text-neutral-600 mb-4" />
                        <h2 className="text-xl font-semibold">No products yet</h2>
                        <p className="text-neutral-400 mt-2 mb-6 text-center max-w-md">
                            Start building your store by adding your first product
                        </p>
                        <Link
                            to="/seller/create-product"
                            className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-medium"
                        >
                            Create Product
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;