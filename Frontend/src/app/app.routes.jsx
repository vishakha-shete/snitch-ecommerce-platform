import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetail from "../features/products/pages/ProductDetail";
import Layout from "../features/common/components/Layout";
import SellerProductDetails from "../features/products/pages/SellerProductDetails"


export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/product/:productId",
                element: <ProductDetail />
            },
            {
                path: "/seller/dashboard",
                element:
                    <Protected role="seller">
                        <Dashboard />
                    </Protected>
            },
            {
                path: "/seller/create-product",
                element:
                    <Protected role="seller" >
                        <CreateProduct />
                    </Protected>
            },
            {
                path: "/seller/product/:productId",
                element:
                    <Protected role="seller" >
                        <SellerProductDetails />
                    </Protected>
            }
        ]
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
])