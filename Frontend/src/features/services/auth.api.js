import axios from "axios";

const authApiInstance = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
})

export async function register({ email, contact, fullname, password, isSeller }) {
    try {
        const response = await authApiInstance.post("/register", {
            email,
            contact,
            password,
            fullname,
            isSeller
        });
        return response.data;
    } catch (error) {
        console.log("REGISTER ERROR 👉", error.response?.data); // 🔥 THIS LINE

        throw error.response?.data || { message: "Something went wrong" };
    }
};

export async function login({ email, password }) {

    const response = await authApiInstance.post("/login", {
        email,
        password
    })
    return response.data;
}

export async function logout() {
    const response = await authApiInstance.post("/logout")
    return response.data
}

export async function getMe() {
    const response = await authApiInstance.get("/me")
    return response.data
}