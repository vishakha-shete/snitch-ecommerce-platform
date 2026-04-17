import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
import passport from "passport";

const router = Router();

router.post("/register", validateRegisterUser, registerUser);


router.post("/login", validateLoginUser, loginUser)

router.get('/google',
    passport.authenticate
        ('google',
            { scope: ['profile', 'email'] }
        ));

router.get('/google/callback',
    passport.authenticate
        ('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

export default router;