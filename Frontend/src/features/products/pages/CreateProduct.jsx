import React, { useState, useRef } from 'react';
import { useProduct } from '../hooks/use.Product';
import { X, Loader2, ImagePlus } from 'lucide-react';
import { useNavigate } from 'react-router';


const CreateProduct = () => {

    const { handleCreateProduct } = useProduct();
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR'
    });

    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (images.length + selectedFiles.length > 7) {
            alert('You can only upload up to 7 images.');
            return;
        }

        const newImages = selectedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));

        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (indexToRemove) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));

        if (images.length + droppedFiles.length > 7) {
            alert('You can only upload up to 7 images.');
            return;
        }

        const newImages = droppedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));

        setImages(prev => [...prev, ...newImages]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('priceAmount', formData.priceAmount);
        data.append('priceCurrency', formData.priceCurrency);

        images.forEach(image => {
            data.append('images', image);
        });

        try {
            await handleCreateProduct(data);
            navigate('/');
            setFormData({ title: '', description: '', priceAmount: '', priceCurrency: 'INR' });
            setImages([]);
        } catch (error) {

            console.error("Failed to create product:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#0a0a0a] text-white flex justify-center items-center py-4 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-[1000px] w-full bg-[#111] rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/5 flex flex-col h-full lg:max-h-[min(750px,90vh)] mx-auto overflow-hidden">
                {/* Header */}
                <div className="mb-6 flex-shrink-0">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-1">Create New Product</h1>
                    <p className="text-gray-400 text-sm">Fill in the details to add a new item to your collection.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-grow min-h-0 overflow-hidden">

                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 flex-grow min-h-0 overflow-hidden">

                        {/* Left Column: Form Fields */}
                        <div className="flex flex-col space-y-5 overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {/* Title */}
                            <div className="space-y-2">
                                <label htmlFor="title" className="block text-xs uppercase tracking-widest font-bold text-gray-500">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Minimalist Urban Tee"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#facd15] focus:border-[#facd15] transition-all duration-200"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-xs uppercase tracking-widest font-bold text-gray-500">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the product's style, fit, and material..."
                                    rows="4"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#facd15] focus:border-[#facd15] transition-all duration-200 resize-none"
                                ></textarea>
                            </div>

                            {/* Price and Currency Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="priceAmount" className="block text-xs uppercase tracking-widest font-bold text-gray-500">Price</label>
                                    <input
                                        type="number"
                                        id="priceAmount"
                                        name="priceAmount"
                                        value={formData.priceAmount}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        min="0"
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#facd15] focus:border-[#facd15] transition-all duration-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="priceCurrency" className="block text-xs uppercase tracking-widest font-bold text-gray-500">Currency</label>
                                    <div className="relative">
                                        <select
                                            id="priceCurrency"
                                            name="priceCurrency"
                                            value={formData.priceCurrency}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#facd15] focus:border-[#facd15] transition-all duration-200 appearance-none cursor-pointer"
                                        >
                                            <option value="INR">INR (₹)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Image Upload Component */}
                        <div className="flex flex-col h-full min-h-0">
                            <div className="flex items-center justify-between pb-3">
                                <label className="block text-xs uppercase tracking-widest font-bold text-gray-500">Visuals</label>
                                <span className="text-[10px] font-bold text-gray-600 tracking-wider">{images.length} / 7 IMAGES</span>
                            </div>

                            <div className="flex-grow overflow-y-auto lg:pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                <div
                                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[180px] ${images.length < 7 ? 'border-white/10 bg-white/[0.02] hover:border-[#facd15]/40 hover:bg-[#facd15]/5 cursor-pointer' : 'border-white/5 bg-white/[0.01] opacity-50 cursor-not-allowed'
                                        }`}
                                    onDragOver={images.length < 7 ? handleDragOver : undefined}
                                    onDrop={images.length < 7 ? handleDrop : undefined}
                                    onClick={() => images.length < 7 && fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        disabled={images.length >= 7}
                                    />
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="p-3 bg-white/5 rounded-full text-gray-400 group-hover:text-[#facd15] transition-colors">
                                            <ImagePlus className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-gray-300">Upload Images</p>
                                            <p className="text-[11px] text-gray-500 max-w-[180px] mx-auto">Drag and drop your product shots here or click to browse.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Previews */}
                                {images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-3 pb-2">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-black border border-white/10">
                                                <img
                                                    src={img.preview}
                                                    alt={`Preview ${idx + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-md"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-white/5 mt-auto">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#facd15] hover:bg-yellow-400 text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-[#facd15]/10 hover:shadow-[#facd15]/20 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Creating Product...
                                </>
                            ) : (
                                'Publish Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;
