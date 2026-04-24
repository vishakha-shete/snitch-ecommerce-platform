import { Router } from "express";
import { loginUser, registerUser, GoogleCallback, getMe, logoutUser } from "../controllers/auth.controller.js";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
import passport from "passport";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validateRegisterUser, registerUser);

router.post("/login", validateLoginUser, loginUser);

router.post("/logout", logoutUser);

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:5173/login?error=google_auth_failed',
        session: false,
    }),
    GoogleCallback
);


/**
 * @route GET/API/auth/me
 * @description get Current Logged in user info
 * @access Protected
 * @middleware authMiddle
 */
router.get('/me', authenticateUser, getMe)

export default router;