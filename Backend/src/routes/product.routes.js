import express  from "express";
import { authenticateseller } from "../middlewares/auth.middleware.js";
import { createProduct, getSellerProducts } from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validator.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize: 5 * 1024 * 1024 //5 MB
    }
})

const router = express.Router();


/** 
* @route post /api/products
* @description create a new product
* @access  private(seller only)
*/
router.post("/", authenticateseller,createProductValidator , upload.array('images', 7), createProduct)


/**
 * @route GET/api/products/seller
 * @description get all products of the authenticate seller
 * @access private seller only 
 */
router.get("/seller", authenticateseller, getSellerProducts)


export default router;