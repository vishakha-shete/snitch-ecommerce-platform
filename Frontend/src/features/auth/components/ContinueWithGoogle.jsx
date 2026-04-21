import React from 'react';
import { motion } from 'framer-motion';

const ContinueWithGoogle = () => {
  // Google's official brand colors
  const googleBlue = "#4285F4";

  return (
    <motion.button
      whileHover={{ 
        scale: 1.01, 
        backgroundColor: "rgba(255, 255, 255, 0.08)",
      }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={() => window.location.href = 'http://localhost:3000/api/auth/google'}
      className="w-full h-14 cursor-pointer relative flex items-center bg-[#131314] border border-[#8e918f] rounded-xl overflow-hidden transition-all duration-300 group"
    >
      {/* 1. THE LOGO BOX: Google guidelines require a white background for the 'G' on dark buttons */}
      <div className="bg-white h-full aspect-square flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-6 h-6"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      </div>

      {/* 2. THE TEXT: "Continue with Google" is a compliant label */}
      <div className="flex-1 flex justify-center items-center pr-10">
        <span className="text-sm font-semibold tracking-wide text-[#e3e3e3] group-hover:text-white transition-colors">
          Continue with Google
        </span>
      </div>

      {/* 3. PREMIUM FINISH: Subtle hover overlay */}
      <div className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-white/20 rounded-xl transition-all" />
    </motion.button>
  );
};

export default ContinueWithGoogle;