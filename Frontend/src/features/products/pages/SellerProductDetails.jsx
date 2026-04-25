import React, { useEffect, useState, useRef } from 'react';
import { useProduct } from '../hooks/use.Product';
import { useParams, useNavigate } from 'react-router';
import { Plus, Package, Trash2, Minus, X, Loader2, ImagePlus, ArrowLeft, Layers } from 'lucide-react';

const formatPrice = (amount, currency = 'INR') => {
    if (!amount && amount !== 0) return '';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const SellerProductDetails = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [variantImages, setVariantImages] = useState([]);
    const [attributes, setAttributes] = useState([{ key: '', value: '' }]);
    const [variantForm, setVariantForm] = useState({ priceAmount: '', priceCurrency: 'INR', stoks: '0' });
    const [stockUpdating, setStockUpdating] = useState(null);

    const { productId } = useParams();
    const navigate = useNavigate();
    const { handleGetProductById, handleAddVariant, handleUpdateVariantStock, handleDeleteVariant } = useProduct();
    const fileInputRef = useRef(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await handleGetProductById(productId);
                setProduct(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        })();
    }, [productId]);

    const handleStockChange = async (variantId, newStock) => {
        if (newStock < 0) return;
        setStockUpdating(variantId);
        try {
            const updated = await handleUpdateVariantStock(productId, variantId, newStock);
            setProduct(updated);
        } catch (err) { console.error(err); }
        finally { setStockUpdating(null); }
    };

    const handleDelete = async (variantId) => {
        if (!window.confirm('Delete this variant?')) return;
        try {
            const updated = await handleDeleteVariant(productId, variantId);
            setProduct(updated);
        } catch (err) { console.error(err); }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (variantImages.length + files.length > 7) { alert('Max 7 images'); return; }
        setVariantImages(prev => [...prev, ...files.map(f => Object.assign(f, { preview: URL.createObjectURL(f) }))]);
    };

    const addAttribute = () => setAttributes(prev => [...prev, { key: '', value: '' }]);
    const removeAttribute = (i) => setAttributes(prev => prev.filter((_, idx) => idx !== i));
    const updateAttribute = (i, field, val) => setAttributes(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: val } : a));

    const resetModal = () => {
        setShowModal(false);
        setVariantImages([]);
        setAttributes([{ key: '', value: '' }]);
        setVariantForm({ priceAmount: '', priceCurrency: 'INR', stoks: '0' });
    };

    const handleSubmitVariant = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData();
        formData.append('priceAmount', variantForm.priceAmount);
        formData.append('priceCurrency', variantForm.priceCurrency);
        formData.append('stoks', variantForm.stoks);
        const attrObj = {};
        attributes.forEach(a => { if (a.key.trim()) attrObj[a.key.trim()] = a.value.trim(); });
        formData.append('attributes', JSON.stringify(attrObj));
        variantImages.forEach(img => formData.append('images', img));
        try {
            const updated = await handleAddVariant(productId, formData);
            setProduct(updated);
            resetModal();
        } catch (err) { console.error(err); }
        finally { setSubmitting(false); }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#facd15]"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-400">Product not found</h2>
            </div>
        );
    }

    const images = product?.images || [];
    const mainImage = images[activeImageIndex]?.url || images[0]?.url;
    const variants = product?.variants || [];

    return (
        <div className="h-[calc(100vh-80px)] bg-[#0a0a0a] text-white overflow-hidden font-sans selection:bg-[#facd15]/30">
            <div className="max-w-[1400px] h-full mx-auto px-6 md:px-10 py-6 flex flex-col gap-6 overflow-hidden">

                {/* Back Button */}
                <button onClick={() => navigate('/seller/dashboard')} className="flex items-center gap-2 text-neutral-500 hover:text-[#facd15] transition-colors text-sm font-medium w-fit flex-shrink-0">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>

                {/* Main Content — scrollable */}
                <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                    {/* Product Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-10">
                        {/* Images */}
                        <div className="flex flex-col gap-4">
                            <div className="relative w-full aspect-square bg-[#111] border border-white/10 rounded-2xl overflow-hidden group">
                                {mainImage ? (
                                    <img src={mainImage} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                                ) : (
                                    <div className="flex items-center justify-center h-full"><Package className="w-16 h-16 text-neutral-800" /></div>
                                )}
                            </div>
                            {images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                    {images.map((img, idx) => (
                                        <button key={idx} onClick={() => setActiveImageIndex(idx)}
                                            className={`w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 bg-[#111] ${activeImageIndex === idx ? 'border-[#facd15] opacity-100 shadow-lg shadow-[#facd15]/20' : 'border-transparent opacity-40 hover:opacity-100 hover:border-white/30'}`}>
                                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col justify-center">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#facd15] uppercase mb-2">Product Details</span>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3 capitalize leading-tight">{product.title}</h1>
                            <div className="text-2xl font-black text-[#facd15] mb-4 tracking-tight">
                                {product.price ? formatPrice(product.price.amount, product.price.currency) : '₹0'}
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">{product.description}</p>
                            <div className="flex items-center gap-6 text-xs text-neutral-600 font-bold uppercase tracking-widest">
                                <span>Created {formatDate(product.createdAt)}</span>
                                <span className="flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5" /> {variants.length} Variant{variants.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Variants Section */}
                    <div className="border-t border-white/5 pt-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">Product Variants</h2>
                                <p className="text-neutral-500 text-xs mt-1">Manage sizes, colors, and stock for each variant.</p>
                            </div>
                            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#facd15] text-black px-5 py-2.5 rounded-xl font-bold hover:scale-105 transition-all text-sm shadow-lg shadow-[#facd15]/10">
                                <Plus className="w-4 h-4" /> Add Variant
                            </button>
                        </div>

                        {variants.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-6">
                                {variants.map((v) => {
                                    const vId = v._id;
                                    const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : (v.attributes || {});
                                    return (
                                        <div key={vId} className="group bg-white/[0.02] border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all duration-300">
                                            {/* Variant Image */}
                                            {v.images?.length > 0 && (
                                                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-black/40">
                                                    <img src={v.images[0].url} alt="variant" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                            )}

                                            {/* Attributes */}
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {Object.entries(attrs).map(([k, val]) => (
                                                    <span key={k} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                                                        {k}: <span className="text-[#facd15]">{val}</span>
                                                    </span>
                                                ))}
                                                {Object.keys(attrs).length === 0 && (
                                                    <span className="text-neutral-600 text-xs italic">No attributes</span>
                                                )}
                                            </div>

                                            {/* Price */}
                                            <div className="text-[#facd15] font-bold text-sm mb-4">
                                                {v.price ? formatPrice(v.price.amount, v.price.currency) : '—'}
                                            </div>

                                            {/* Stock Control */}
                                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Stock</span>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleStockChange(vId, (v.stoks || 0) - 1)}
                                                        disabled={stockUpdating === vId || (v.stoks || 0) <= 0}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className={`min-w-[36px] text-center font-bold text-sm tabular-nums ${(v.stoks || 0) === 0 ? 'text-red-400' : 'text-white'}`}>
                                                        {stockUpdating === vId ? '...' : (v.stoks || 0)}
                                                    </span>
                                                    <button onClick={() => handleStockChange(vId, (v.stoks || 0) + 1)}
                                                        disabled={stockUpdating === vId}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Delete */}
                                            <div className="flex justify-end mt-3">
                                                <button onClick={() => handleDelete(vId)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5">
                                                    <Trash2 className="w-3.5 h-3.5" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] mb-6">
                                <Layers className="w-12 h-12 text-neutral-800 mb-4" />
                                <h3 className="text-lg font-bold">No Variants Yet</h3>
                                <p className="text-neutral-500 mt-2 mb-6 text-center max-w-xs text-sm">Add size, color, and other variants to let customers choose what they need.</p>
                                <button onClick={() => setShowModal(true)} className="bg-[#facd15] text-black px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-[#facd15]/10">
                                    Add First Variant
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Variant Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={resetModal}>
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Add Variant</h3>
                            <button onClick={resetModal} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleSubmitVariant} className="space-y-5">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Images</label>
                                <div onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-[#facd15]/40 hover:bg-[#facd15]/5 transition-all">
                                    <input type="file" ref={fileInputRef} onChange={handleImageChange} multiple accept="image/*" className="hidden" />
                                    <ImagePlus className="w-6 h-6 mx-auto text-gray-500 mb-2" />
                                    <p className="text-xs text-gray-500">Click to upload variant images</p>
                                </div>
                                {variantImages.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 mt-3">
                                        {variantImages.map((img, idx) => (
                                            <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-black border border-white/10">
                                                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setVariantImages(prev => prev.filter((_, i) => i !== idx))}
                                                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Attributes */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs uppercase tracking-widest font-bold text-gray-500">Attributes</label>
                                    <button type="button" onClick={addAttribute} className="text-[#facd15] text-xs font-bold hover:underline flex items-center gap-1">
                                        <Plus className="w-3 h-3" /> Add
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {attributes.map((attr, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <input type="text" placeholder="e.g. Color" value={attr.key} onChange={(e) => updateAttribute(i, 'key', e.target.value)}
                                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#facd15] focus:border-[#facd15] transition-all" />
                                            <input type="text" placeholder="e.g. Red" value={attr.value} onChange={(e) => updateAttribute(i, 'value', e.target.value)}
                                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#facd15] focus:border-[#facd15] transition-all" />
                                            {attributes.length > 1 && (
                                                <button type="button" onClick={() => removeAttribute(i)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price & Stock */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-1">
                                    <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Price</label>
                                    <input type="number" required min="0" value={variantForm.priceAmount} onChange={(e) => setVariantForm(p => ({ ...p, priceAmount: e.target.value }))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#facd15] focus:border-[#facd15] transition-all" placeholder="0" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Currency</label>
                                    <select value={variantForm.priceCurrency} onChange={(e) => setVariantForm(p => ({ ...p, priceCurrency: e.target.value }))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#facd15] focus:border-[#facd15] transition-all appearance-none cursor-pointer">
                                        <option value="INR">INR (₹)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="JPY">JPY (¥)</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Stock</label>
                                    <input type="number" min="0" value={variantForm.stoks} onChange={(e) => setVariantForm(p => ({ ...p, stoks: e.target.value }))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#facd15] focus:border-[#facd15] transition-all" placeholder="0" />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-white/5">
                                <button type="button" onClick={resetModal} className="flex-1 py-3 bg-transparent border border-white/10 hover:border-white/30 text-white font-bold rounded-xl transition-all text-sm">Cancel</button>
                                <button type="submit" disabled={submitting}
                                    className="flex-1 py-3 bg-[#facd15] hover:bg-yellow-400 text-black font-bold rounded-xl transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#facd15]/10">
                                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : 'Add Variant'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerProductDetails;