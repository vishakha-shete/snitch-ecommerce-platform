import axios from "axios"

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true
})

export async function createProduct(formData) {
    const response = await productApiInstance.post("/", formData)
    return response.data
}

export async function getSellerProduct() {
    const response = await productApiInstance.get("/seller",)
    return response.data
}

export async function getAllProducts() {
    const response = await productApiInstance.get("/")
    return response.data
}

export async function getProductById(productId){
    const response = await productApiInstance.get(`detail/${productId}`)
    return response.data
}

export async function addVariant(productId, formData) {
    const response = await productApiInstance.post(`/${productId}/variants`, formData)
    return response.data
}

export async function updateVariantStock(productId, variantId, stoks) {
    const response = await productApiInstance.put(`/${productId}/variants/${variantId}/stock`, { stoks })
    return response.data
}

export async function deleteVariant(productId, variantId) {
    const response = await productApiInstance.delete(`/${productId}/variants/${variantId}`)
    return response.data
}

export default productApiInstance