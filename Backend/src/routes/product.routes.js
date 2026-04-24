import express  from "express";
import { authenticateseller } from "../middlewares/auth.middleware.js";
import { createProduct, getAllProducts, getSellerProducts, getProductDetails } from "../controllers/product.controller.js";
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
router.post("/", authenticateseller, upload.array('images', 7), createProductValidator , createProduct)


/**
 * @route GET/api/products/seller
 * @description get all products of the authenticate seller
 * @access private seller only 
 */
router.get("/seller", authenticateseller, getSellerProducts)


/**
 * @route GET /api/products/all
 * @description get all the products
 * @access public 
 */
router.get("/", getAllProducts)


/**
 * @route GET/api/detail/:id
 * @description get product deails by ID
 * @access public
 */
router.get("/detail/:id", getProductDetails)

export default router;