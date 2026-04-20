import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useauth";
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!/^\d{10}$/.test(formData.contact)) newErrors.contact = "Enter valid 10-digit number";
    if (formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      newErrors.password = "8+ chars, 1 uppercase & 1 number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 33;
    if (/[A-Z]/.test(password)) strength += 33;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 34;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServerError(""); // Clear server error when user types
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("FORM DATA 👉", formData); // debug

  if (!validate()) return; // 🔥 IMPORTANT

  try {
    setLoading(true);

    await handleRegister({
      fullname: formData.fullname,
      email: formData.email,
      contact: formData.contact,
      password: formData.password,
      isSeller: formData.isSeller
    });

    navigate("/");
    } catch (err) {
      const errorMsg = err?.errors?.[0]?.msg || err?.message || "Registration failed";
      setServerError(errorMsg);
    } finally {
    setLoading(false);
  }
};

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex bg-black text-white font-['Plus_Jakarta_Sans'] overflow-hidden relative">
      <div className="aurora-bg"></div>

      {/* LEFT SIDE - BRANDING */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="hidden lg:flex w-7/12 relative items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-center grayscale brightness-[0.3]"
          style={{ backgroundImage: 'url("/auth-bg.png")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

        <div className="z-10 px-16 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-[#facd15] rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-black rounded-sm rotate-45" />
            </div>
            <span className="text-xl font-bold tracking-widest">SNITCH</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-8xl font-black tracking-tighter leading-none"
          >
            JOIN THE<br />ELITE<span className="text-[#facd15]">.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8 text-xl text-gray-400 font-light max-w-lg leading-relaxed"
          >
            Redefining modern aesthetics. Join the exclusive circle of trendsetters and tech enthusiasts.
          </motion.p>
        </div>
      </motion.div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 z-10 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-xl glass-premium p-8 lg:p-10 rounded-[2rem] border border-white/10"
        >
          <header className="mb-8">
            <h2 className="text-4xl font-bold tracking-tight mb-2">Create Account</h2>
            <p className="text-gray-400 font-light">Join the movement today.</p>
          </header>

          <AnimatePresence mode="wait">
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm"
              >
                <AlertCircle size={18} />
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputWrapper label="Full Name" error={errors.fullname}>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-field"
                />
              </InputWrapper>
              <InputWrapper label="Email Address" error={errors.email}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="input-field"
                />
              </InputWrapper>
            </div>

            <InputWrapper label="Contact Number" error={errors.contact}>
              <input
                type="tel"
                name="contact"
                maxLength="10"
                value={formData.contact}
                onChange={handleChange}
                placeholder="9876543210"
                className="input-field"
              />
            </InputWrapper>

            <InputWrapper label="Secure Password" error={errors.password}>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pr-12 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Indictor */}
              <div className="mt-3">
                <div className="flex gap-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${strength}%`,
                      backgroundColor: strength > 66 ? '#10b981' : strength > 33 ? '#facc15' : '#ef4444'
                    }}
                    className="h-full transition-all duration-500"
                  />
                </div>
                <div className="flex justify-between text-[9px] mt-1.5 uppercase tracking-widest font-bold">
                  <span className="text-gray-500">Security:</span>
                  <span style={{ color: strength > 66 ? '#10b981' : strength > 33 ? '#facc15' : '#ef4444' }}>
                    {strength > 66 ? 'Strong' : strength > 33 ? 'Medium' : 'Weak'}
                  </span>
                </div>
              </div>
            </InputWrapper>

            <label 
              htmlFor="isSeller"
              className="flex items-center gap-3 cursor-pointer group w-fit select-none"
            >
              <input
                id="isSeller"
                type="checkbox"
                name="isSeller"
                className="hidden"
                checked={formData.isSeller}
                onChange={handleChange}
              />
              <div className={`w-5 h-5 rounded border ${formData.isSeller ? 'bg-[#facd15] border-[#facd15]' : 'border-white/20'} flex items-center justify-center transition-all group-hover:border-[#facd15]`}>
                {formData.isSeller && <CheckCircle2 size={14} className="text-black" />}
              </div>
              <span className="text-sm font-light text-gray-400 group-hover:text-white transition-colors">Register as a seller</span>
            </label>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#facd15] text-black h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 group transition-opacity disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Create Account
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>

            <div className="py-2 flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-white/5"></div>
              <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">Social Connect</span>
              <div className="flex-1 h-[1px] bg-white/5"></div>
            </div>

            <button type="button" onClick={() => window.location.href = 'http://localhost:3000/api/auth/google'} className="w-full h-12 border border-white/10 rounded-xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all text-sm font-medium">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already a member?{" "}
            <Link to="/login" className="text-[#facd15] font-semibold hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 0.875rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.75rem;
          outline: none;
          transition: all 0.2s ease;
          color: white;
          font-family: inherit;
        }
        .input-field:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: #facd15;
          box-shadow: 0 0 0 1px #facd15;
        }
        .glass-premium {
          background: rgba(15, 15, 15, 0.7);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
};

const InputWrapper = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center px-1">
      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{label}</label>
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="text-[9px] text-red-500 font-bold uppercase tracking-wider"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
    {children}
  </div>
);

export default Register;