import { Router } from "express";
import { loginUser, registerUser, GoogleCallback } from "../controllers/auth.controller.js";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
import passport from "passport";

const router = Router();

router.post("/register", validateRegisterUser, registerUser);

router.post("/login", validateLoginUser, loginUser);

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

export default router;