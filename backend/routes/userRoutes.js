// routes/userRoutes.js
import express from 'express';
import { body, param } from 'express-validator';
import {
  getAllUsers,
  getUserById,
  searchUsers,
  updateUser,
  deleteUser,
  updateUserRole,
  updateUserStatus
} from '../controllers/userController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for user endpoints
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests to user endpoints, please try again later'
  }
});

// Validation middleware
const updateUserValidation = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters')
];

const userIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format')
];

// Apply rate limiting and authentication to all routes
router.use(userLimiter);
router.use(authenticateToken);

// Public user routes (authenticated users)
router.get('/', getAllUsers);
router.get('/search', searchUsers);
router.get('/:id', userIdValidation, getUserById);

// User profile management (user can update own profile)
router.put('/:id', userIdValidation, updateUserValidation, updateUser);

// Admin-only routes
router.delete('/:id', userIdValidation, authorizeRoles('Admin'), deleteUser);
router.put('/:id/role', userIdValidation, authorizeRoles('Admin'), updateUserRole);
router.put('/:id/status', userIdValidation, authorizeRoles('Admin'), updateUserStatus);

export default router;
