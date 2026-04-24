import ProductModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

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