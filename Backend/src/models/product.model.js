import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'GBP', 'JPY', 'INR'],
            default: 'INR'
        }
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            alt: {
                type: String
            }
        }
    ]
},{timestamps: true});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;