// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authConfig } from '../config/auth.config.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, authConfig.jwtSecret);
    
    const user = await User.findById(decoded.userId)
      .populate('roles')
      .populate('projects.project')
      .populate('projects.role');

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'User not found or inactive'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired'
      });
    }
    
    return res.status(403).json({
      error: 'Invalid token'
    });
  }
};

export const authorizeRoles = (...requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const userRoles = req.user.roles.map(role => role.name);
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({
        error: `Access denied. Required roles: ${requiredRoles.join(', ')}`
      });
    }

    next();
  };
};
