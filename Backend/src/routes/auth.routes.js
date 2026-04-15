import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { validateRegisterUser ,validateLoginUser  } from "../validator/auth.validator.js";


const router = Router();

router.post("/register", validateRegisterUser, registerUser);


router.post("/login", validateLoginUser , loginUser)

export default router;