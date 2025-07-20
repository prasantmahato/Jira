// controllers/authController.js
import User from '../models/User.js';
import Role from '../models/Role.js';
import RefreshToken from '../models/RefreshToken.js';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config.js';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Generate JWT tokens
const generateTokens = (user) => {
  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email
  };

  const accessToken = jwt.sign(payload, authConfig.jwtSecret, {
    expiresIn: authConfig.jwtExpiration,
    // issuer: 'jira-clone',
    // audience: 'jira-clone-users'
  });

  console.log('🔐 Access Token:', accessToken);

  const refreshToken = jwt.sign(payload, authConfig.jwtRefreshSecret, {
    expiresIn: authConfig.jwtRefreshExpiration,
    issuer: 'jira-clone',
    audience: 'jira-clone-users'
  });

  return { accessToken, refreshToken };
};

// Register new user
export const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email or username already exists',
        code: 'USER_EXISTS'
      });
    }

    // Get default role
    const defaultRole = await Role.findOne({ name: 'Developer' });

    // Create new user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      roles: defaultRole ? [defaultRole._id] : []
    });

    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token
    const refreshTokenDoc = new RefreshToken({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });

    await refreshTokenDoc.save();

    // Set secure cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      accessToken
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error during registration'
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and populate roles
    const user = await User.findOne({ email }).populate('roles');

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        error: 'Account temporarily locked due to too many failed login attempts',
        code: 'ACCOUNT_LOCKED'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 },
        $set: { lastLogin: new Date() }
      });
    } else {
      await user.updateOne({ $set: { lastLogin: new Date() } });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token
    const refreshTokenDoc = new RefreshToken({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });

    await refreshTokenDoc.save();

    // Set secure cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      accessToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error during login'
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Revoke the refresh token
      await RefreshToken.findOneAndUpdate(
        { token: refreshToken },
        { isRevoked: true }
      );
    }

    // Clear cookie
    res.clearCookie('refreshToken');

    res.json({
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal server error during logout'
    });
  }
};

// const existingToken = await RefreshToken.findOne({ token: newRefreshToken });
// if (existingToken) {
//   // Token already exists (probably a race condition, or double call)
//   // Instead of inserting again, just acknowledge success or skip
//   return res.json({ accessToken, user: refreshTokenDoc.user });
// }


// Refresh access token
// In authController.js - Enhanced conflict handling
export const refreshToken = async (req, res) => {
    try {
      const refreshToken = 
        (req.cookies && req.cookies.refreshToken) || 
        (req.body && req.body.refreshToken);
  
      if (!refreshToken) {
        return res.status(401).json({
          error: 'Refresh token is required'
        });
      }
  
      // Check if this token was already rotated recently (within last 10 seconds)
      const recentlyRotated = await RefreshToken.findOne({
        token: refreshToken,
        isRevoked: true,
        updatedAt: { $gt: new Date(Date.now() - 10000) }
      });
  
      if (recentlyRotated) {
        console.log('Token was recently rotated, checking for new token');
        
        // Find the most recent valid token for this user
        const latestToken = await RefreshToken.findOne({
          user: recentlyRotated.user,
          isRevoked: false,
          expiresAt: { $gt: new Date() }
        }).populate('user').sort({ createdAt: -1 });
  
        if (latestToken) {
          // Generate new access token using existing refresh token
          const { accessToken } = generateTokens(latestToken.user);
          
          return res.json({
            message: 'Using recent token rotation',
            accessToken,
            user: latestToken.user.toJSON()
          });
        }
      }
  
      // Verify the refresh token
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, authConfig.jwtRefreshSecret);
      } catch (jwtError) {
        return res.status(401).json({
          error: 'Invalid or expired refresh token'
        });
      }
  
      // Find token in database
      const refreshTokenDoc = await RefreshToken.findOne({
        token: refreshToken,
        user: decoded.userId,
        isRevoked: false
      }).populate('user');
  
      if (!refreshTokenDoc || refreshTokenDoc.expiresAt < new Date()) {
        return res.status(401).json({
          error: 'Invalid or expired refresh token'
        });
      }
  
      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(refreshTokenDoc.user);
  
      // Use atomic operations to prevent race conditions
      try {
        // Start a transaction
        const session = await mongoose.startSession();
        
        await session.withTransaction(async () => {
          // Check once more if token is still valid
          const stillValid = await RefreshToken.findOne({
            _id: refreshTokenDoc._id,
            isRevoked: false
          }).session(session);
          
          if (!stillValid) {
            throw new Error('Token already rotated');
          }
  
          // Revoke old token
          await RefreshToken.findByIdAndUpdate(
            refreshTokenDoc._id, 
            { isRevoked: true },
            { session }
          );
  
          // Create new token
          const newRefreshTokenDoc = new RefreshToken({
            token: newRefreshToken,
            user: refreshTokenDoc.user._id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            deviceInfo: {
              userAgent: req.headers['user-agent'],
              ipAddress: req.ip
            }
          });
  
          await newRefreshTokenDoc.save({ session });
        });
  
        await session.endSession();
  
      } catch (transactionError) {
        console.log('Transaction failed:', transactionError.message);
        
        if (transactionError.message.includes('already rotated')) {
          return res.status(409).json({
            error: 'Token already rotated',
            code: 'TOKEN_ALREADY_ROTATED'
          });
        }
        
        throw transactionError;
      }
  
      // Set new cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
  
      res.json({
        message: 'Token refreshed successfully',
        accessToken,
        user: refreshTokenDoc.user.toJSON()
      });
  
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        error: 'Invalid refresh token'
      });
    }
  };
   
  
  const refreshTokenWithRetry = async (maxRetries = 2) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await refreshToken();
        return; // Success
      } catch (error) {
        if (error.message.includes('conflict') && attempt < maxRetries - 1) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 200 * (attempt + 1)));
          continue;
        }
        throw error; // Give up
      }
    }
  };
  
  
// Get user profile
// In authController.js
export const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id)
        .populate('roles', 'name description')
        .populate('projects.project', 'name key')
        .populate('projects.role', 'name');
  
      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }
  
      res.json({
        success: true,
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Failed to get user profile'
      });
    }
  };
  
  