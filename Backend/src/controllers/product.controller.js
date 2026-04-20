import ProductModel from "../models/product.model.js";
import { uploadfile } from "../services/storage.service.js";

export async function createProduct(req,res) {
    
    const {title, description , priceAmount, priceCurrency} = req.body;
    const sellerId = req.user._id;

    const images = await Promise.all(req.files.map(async(file)=>{
        return await uploadfile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }))

    const product = await ProductModel.create({
        title,
        description,
        price:{
            amount:priceAmount,
            currency: priceCurrency || "INR"
        },
        images,
        seller: sellerId
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