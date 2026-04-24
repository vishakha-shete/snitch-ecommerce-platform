import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { ShoppingBag, User, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../auth/hook/useauth";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.auth.user);
    const { handleLogout } = useAuth();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const navLinks = [
        { name: "Shop", path: "/" },
        { name: "New", path: "/" },
        { name: "Trending", path: "/" },
    ];

    const onLogout = async () => {
        await handleLogout();
        navigate("/");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-2xl border-b border-white/10">
            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                {/* LOGO */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 bg-yellow-400 rounded-lg flex items-center justify-center group-hover:rotate-12 transition">
                        <div className="w-4 h-4 bg-black rotate-45" />
                    </div>
                    <span className="text-white font-bold tracking-widest text-sm sm:text-base">
                        SNITCH
                    </span>
                </Link>

                {/* NAV LINKS */}
                <div className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;

                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="relative text-sm text-gray-400 hover:text-white transition"
                            >
                                {link.name}

                                {/* ACTIVE UNDERLINE */}
                                <span
                                    className={`absolute left-0 -bottom-1 h-[2px] bg-yellow-400 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                                        }`}
                                />
                            </Link>
                        );
                    })}
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-3 sm:gap-5">
                    {/* CART */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative text-gray-400 hover:text-white"
                    >
                        <ShoppingBag />
                        <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                            0
                        </span>
                    </button>

                    {/* PROFILE */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center"
                            >
                                <User className="text-yellow-400" />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute right-0 mt-3 w-56 bg-black/90 border border-white/10 rounded-xl p-3"
                                    >
                                        <p className="text-sm text-gray-400 mb-3">
                                            {user.fullname}
                                        </p>

                                        <button
                                            onClick={() => navigate("/profile")}
                                            className="block w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg"
                                        >
                                            Profile
                                        </button>

                                        <button
                                            onClick={onLogout}
                                            className="block w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                                        >
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-yellow-400 text-black px-5 py-2 rounded-full font-medium"
                        >
                            Sign In
                        </Link>
                    )}

                    {/* MOBILE MENU */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden"
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "100vh" }}
                        exit={{ height: 0 }}
                        className="bg-black flex flex-col items-center justify-center gap-8"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl text-white"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CART DRAWER */}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="fixed right-0 top-0 w-[350px] h-screen bg-black border-l border-white/10 p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-white text-lg">Your Cart</h2>
                            <button onClick={() => setIsCartOpen(false)}>
                                <X />
                            </button>
                        </div>

                        <p className="text-gray-400">Cart is empty</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;