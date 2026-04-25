import ProductModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";
import mongoose from "mongoose";

export async function createProduct(req, res) {
    
    const {title, description , priceAmount, priceCurrency} = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async(file)=>{
        const result = await uploadFile(file.buffer, file.originalname);
        return { url: result.url };
    }))

    const product = await ProductModel.create({
        title,
        description,
        price:{
            amount:priceAmount,
            currency: priceCurrency || "INR"
        },
        images,
        seller: seller._id
    })
    res.status(201).json({
        message: "product created successfully",
        success: true,
        product 
    })
}

export async function getSellerProducts(req,res) {
    const seller = req.user; 

    const products = await ProductModel.find({seller: seller._id});

    res.status(200).json({
        message: "products fetched successfully",
        success: true,
        products
    })
}

export async function getAllProducts(req,res) {
    const products = await ProductModel.find();
    return res.status(200).json({
        message: "products fetched successfully",
        success: true,
        products
    })
}

export async function getProductDetails(req, res){

    const {id} = req.params;

    const product = await ProductModel.findById(id);

    if(!product){
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    return res.status(200).json({
        message: "product details fetched successfully",
        success: true,
        product
    })
}


export async function addVariant(req, res) {
    try {
        const { id } = req.params;
        const seller = req.user;
        const { priceAmount, priceCurrency, stoks, attributes } = req.body;

        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        if (product.seller.toString() !== seller._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You don't own this product", success: false });
        }

        // Upload variant images
        const images = req.files && req.files.length > 0
            ? await Promise.all(req.files.map(async (file) => {
                const result = await uploadFile(file.buffer, file.originalname);
                return { url: result.url };
            }))
            : [];

        // Parse attributes from JSON string
        let parsedAttributes = {};
        if (attributes) {
            try {
                parsedAttributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;
            } catch (e) {
                parsedAttributes = {};
            }
        }

        const variant = {
            images,
            stoks: parseInt(stoks) || 0,
            attributes: parsedAttributes,
            price: {
                amount: parseFloat(priceAmount),
                currency: priceCurrency || 'INR'
            }
        };

        product.variants.push(variant);
        await product.save();

        return res.status(201).json({
            message: "Variant added successfully",
            success: true,
            product
        });
    } catch (error) {
        console.error("Add variant error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}


export async function updateVariantStock(req, res) {
    try {
        const { id, variantId } = req.params;
        const seller = req.user;
        const { stoks } = req.body;

        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        if (product.seller.toString() !== seller._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You don't own this product", success: false });
        }

        const variant = product.variants.id(variantId);

        if (!variant) {
            return res.status(404).json({ message: "Variant not found", success: false });
        }

        variant.stoks = parseInt(stoks);
        await product.save();

        return res.status(200).json({
            message: "Variant stock updated successfully",
            success: true,
            product
        });
    } catch (error) {
        console.error("Update variant stock error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}


export async function deleteVariant(req, res) {
    try {
        const { id, variantId } = req.params;
        const seller = req.user;

        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        if (product.seller.toString() !== seller._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You don't own this product", success: false });
        }

        const variant = product.variants.id(variantId);

        if (!variant) {
            return res.status(404).json({ message: "Variant not found", success: false });
        }

        product.variants.pull(variantId);
        await product.save();

        return res.status(200).json({
            message: "Variant deleted successfully",
            success: true,
            product
        });
    } catch (error) {
        console.error("Delete variant error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}