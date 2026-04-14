
import { body, validationResult } from 'express-validator';

export const validateRegisterUser = [
    body('fullname').notEmpty().withMessage('Full name is required')
        .isLength({ min: 4 }).withMessage('Full name must be at least 4 characters long'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('contact').notEmpty().withMessage('Contact number is required')
        .matches(/^[0-9]{10,15}$/).withMessage('Contact number must be 10-15 digits'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];



