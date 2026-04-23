import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProducts: [],
    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload
        },
        setProducts:(state, action)=>{
            state.products = action.payload
        }
    }
})

export const { setSellerProducts, setProducts } = productSlice.actions;
export default productSlice.reducer