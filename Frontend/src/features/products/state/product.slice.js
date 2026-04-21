import {createSlice} from "@reduxjs/toolkit";
import { getSellerProduct } from "../services/product.api";


const productSlice = createSlice({
    name: "product",
    initialState:{
        getSellerProducts: (state,action) => {
              state.getSellerProducts = action.payload     
        }
    }
})

export const setSellerProducts = productSlice.actions
export default productSlice.reducer