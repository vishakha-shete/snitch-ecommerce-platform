import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useauth";
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

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
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 z-10 bg-black/50 backdrop-blur-sm overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-xl glass-premium p-8 lg:p-10 rounded-[2.5rem] border border-white/10 flex flex-col max-h-[min(90vh,800px)] overflow-hidden"
        >
          <header className="mb-4 flex-shrink-0">
            <h2 className="text-3xl font-black tracking-tight mb-1">Create Account</h2>
            <p className="text-gray-500 font-medium text-[13px]">Join the movement and start your journey.</p>
          </header>

          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs"
                >
                  <AlertCircle size={16} />
                  {serverError}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWrapper label="Full Name" error={errors.fullname}>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className="input-field py-2.5"
                  />
                </InputWrapper>
                <InputWrapper label="Email Address" error={errors.email}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@snitch.com"
                    className="input-field py-2.5"
                  />
                </InputWrapper>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWrapper label="Contact" error={errors.contact}>
                  <input
                    type="tel"
                    name="contact"
                    maxLength="10"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="input-field py-2.5"
                  />
                </InputWrapper>

                <InputWrapper label="Password" error={errors.password}>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="input-field pr-10 w-full py-2.5"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </InputWrapper>
              </div>

              {/* Password Strength Indictor */}
              <div className="pb-1">
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
                <div className="flex justify-between text-[8px] mt-1 uppercase tracking-widest font-bold">
                  <span className="text-gray-600">Security:</span>
                  <span style={{ color: strength > 66 ? '#10b981' : strength > 33 ? '#facc15' : '#ef4444' }}>
                    {strength > 66 ? 'Strong' : strength > 33 ? 'Medium' : 'Weak'}
                  </span>
                </div>
              </div>

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
                <div className={`w-4 h-4 rounded border ${formData.isSeller ? 'bg-[#facd15] border-[#facd15]' : 'border-white/20'} flex items-center justify-center transition-all group-hover:border-[#facd15]`}>
                  {formData.isSeller && <CheckCircle2 size={12} className="text-black" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Register as a seller</span>
              </label>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#facd15] text-black h-12 rounded-xl font-bold text-base flex items-center justify-center gap-2 group transition-opacity disabled:opacity-70 mt-1"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    Create Account
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>

              <div className="py-1 flex items-center gap-3">
                <div className="flex-1 h-[1px] bg-white/5"></div>
                <span className="text-[9px] text-gray-700 font-bold uppercase tracking-[0.2em]">Social</span>
                <div className="flex-1 h-[1px] bg-white/5"></div>
              </div>

            < ContinueWithGoogle/>
            </form>
          </div>

          <p className="mt-6 text-center text-[10px] text-gray-600 uppercase tracking-widest flex-shrink-0">
            Member?{" "}
            <Link to="/login" className="text-[#facd15] font-bold hover:underline underline-offset-4 ml-1">
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