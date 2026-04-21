import React, { useState, useRef } from 'react';
import { useProduct } from '../hooks/use.Product';
import { X, Loader2, ImagePlus } from 'lucide-react';

const CreateProduct = () => {
    const { handleCreateProduct } = useProduct();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);
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
        setIsLoading(true);

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
            // reset form or redirect
            setFormData({ title: '', description: '', priceAmount: '', priceCurrency: 'INR' });
            setImages([]);
        } catch (error) {

            console.error("Failed to create product:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[100dvh] lg:h-screen lg:overflow-hidden bg-[#0a0a0a] text-white flex justify-center items-start lg:items-center py-4 lg:py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-[900px] w-full bg-[#141414] rounded-2xl lg:rounded-3xl p-5 lg:p-8 shadow-2xl border border-white/5 flex flex-col h-full max-h-[850px] mx-auto">
                {/* Header */}
                <div className="mb-5 lg:mb-6 flex-shrink-0">
                    <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-white mb-1">Create New Product</h1>
                    <p className="text-gray-400 text-sm">Add a new product to your store and start selling.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-grow min-h-0">
                    
                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 flex-grow min-h-0 overflow-y-auto lg:overflow-hidden pb-4 lg:pb-0 scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                        
                        {/* Left Column: Form Fields */}
                        <div className="flex flex-col space-y-4 lg:overflow-y-auto lg:pr-2 scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {/* Title */}
                            <div className="space-y-1.5 flex-shrink-0">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter product title"
                                    required
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#facd15] focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5 flex-shrink-0">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Write a short product description..."
                                    rows="4"
                                    required
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#facd15] focus:border-transparent transition-all duration-200 resize-none"
                                ></textarea>
                            </div>

                            {/* Price and Currency Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-shrink-0">
                                <div className="space-y-1.5">
                                    <label htmlFor="priceAmount" className="block text-sm font-medium text-gray-300">Price Amount</label>
                                    <input
                                        type="number"
                                        id="priceAmount"
                                        name="priceAmount"
                                        value={formData.priceAmount}
                                        onChange={handleChange}
                                        placeholder="e.g. 999"
                                        min="0"
                                        required
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#facd15] focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="priceCurrency" className="block text-sm font-medium text-gray-300">Currency</label>
                                    <div className="relative">
                                        <select
                                            id="priceCurrency"
                                            name="priceCurrency"
                                            value={formData.priceCurrency}
                                            onChange={handleChange}
                                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#facd15] focus:border-transparent transition-all duration-200 appearance-none"
                                        >
                                            <option value="INR">INR (₹)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Image Upload Component */}
                        <div className="flex flex-col h-full min-h-0 mt-2 lg:mt-0">
                            <div className="flex items-center justify-between pb-2 flex-shrink-0">
                                <label className="block text-sm font-medium text-gray-300">Product Images</label>
                                <span className="text-xs text-gray-400">{images.length} / 7</span>
                            </div>
                            
                            <div className="flex-grow overflow-y-auto lg:pr-2 space-y-3 scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                                <div 
                                    className={`border-2 border-dashed rounded-xl p-5 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] flex-shrink-0 ${
                                        images.length < 7 ? 'border-white/20 hover:border-[#facd15]/50 hover:bg-[#facd15]/5 cursor-pointer' : 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
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
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <div className="p-2.5 bg-white/5 rounded-full">
                                            <ImagePlus className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-300">
                                                Click to upload or drag & drop
                                            </p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">
                                                PNG, JPG, WEBP up to 5MB
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Previews */}
                                {images.length > 0 && (
                                    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2 pb-2">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-[#0a0a0a] border border-white/10">
                                                <img 
                                                    src={img.preview} 
                                                    alt={`Preview ${idx + 1}`} 
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
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
                    <div className="pt-4 lg:pt-5 border-t border-white/5 mt-auto flex-shrink-0">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#facd15] hover:bg-[#e5bc13] text-black font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(250,205,21,0.15)] hover:shadow-[0_0_20px_rgba(250,205,21,0.3)] transform hover:scale-[1.005] active:scale-[0.99]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating Product...
                                </>
                            ) : (
                                'Create Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;
