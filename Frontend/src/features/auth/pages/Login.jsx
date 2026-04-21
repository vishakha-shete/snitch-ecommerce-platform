import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useauth";
import { Eye, EyeOff, Loader2, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (formData.password.length < 6)
      newErrors.password = "Password is too short";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServerError("");
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await handleLogin({ email: formData.email, password: formData.password });
      navigate("/");
    } catch (err) {
      const errorMsg = err?.errors?.[0]?.msg || err?.message || "Invalid credentials. Please try again.";
      setServerError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white font-['Plus_Jakarta_Sans'] overflow-hidden relative">
      <div className="aurora-bg" />

      {/* ── LEFT SIDE – BRANDING ── */}
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
          {/* Logo */}
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
            WELCOME<br />BACK<span className="text-[#facd15]">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8 text-xl text-gray-400 font-light max-w-lg leading-relaxed"
          >
            The elite circle is waiting. Sign in to continue your journey with SNITCH.
          </motion.p>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-12 flex items-center gap-3 text-sm text-gray-500"
          >
            <ShieldCheck size={18} className="text-[#facd15]" />
            <span>256-bit encrypted &amp; secure login</span>
          </motion.div>
        </div>
      </motion.div>

      {/* ── RIGHT SIDE – FORM ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 z-10 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-xl glass-premium p-8 lg:p-10 rounded-[2rem] border border-white/10"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#facd15] rounded-md flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-sm rotate-45" />
            </div>
            <span className="text-base font-bold tracking-widest">SNITCH</span>
          </div>

          <header className="mb-8">
            <h2 className="text-4xl font-bold tracking-tight mb-2">Sign In</h2>
            <p className="text-gray-400 font-light">
              Access your exclusive account.
            </p>
          </header>

          {/* Server-side error banner */}
          <AnimatePresence mode="wait">
            {serverError && (
              <motion.div
                key="server-error"
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

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <InputWrapper label="Email Address" error={errors.email}>
              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                autoComplete="email"
                className="input-field"
              />
            </InputWrapper>

            {/* Password */}
            <InputWrapper label="Password" error={errors.password}>
              <div className="relative group">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="input-field pr-12 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </InputWrapper>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-3 cursor-pointer group w-fit select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  className="hidden"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all group-hover:border-[#facd15] ${formData.rememberMe
                    ? "bg-[#facd15] border-[#facd15]"
                    : "border-white/20"
                    }`}
                >
                  {formData.rememberMe && (
                    <svg
                      className="w-3 h-3 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-light text-gray-400 group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-[#facd15] hover:underline underline-offset-4 font-medium transition-opacity hover:opacity-80"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              id="login-submit"
              disabled={loading}
              className="w-full bg-[#facd15] text-black h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 group transition-opacity disabled:opacity-70 mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="py-2 flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-white/5" />
              <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
                Social Connect
              </span>
              <div className="flex-1 h-[1px] bg-white/5" />
            </div>

            {/* Google */}
            {/* Bug fix: added onClick — button previously did nothing on click */}
            < ContinueWithGoogle />
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            New to SNITCH?{" "}
            <Link
              to="/register"
              className="text-[#facd15] font-semibold hover:underline underline-offset-4"
            >
              Create an account
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
        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.2);
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

/* ── Reusable input wrapper ── */
const InputWrapper = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center px-1">
      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
        {label}
      </label>
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

export default Login;
