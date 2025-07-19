// controllers/authController.js
import User from '../models/User.js';
import Role from '../models/Role.js';
import RefreshToken from '../models/RefreshToken.js';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config.js';
import { validationResult } from 'express-validator';

// Generate JWT tokens
const generateTokens = (user) => {
  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email
  };

  const accessToken = jwt.sign(payload, authConfig.jwtSecret, {
    expiresIn: authConfig.jwtExpiration,
    issuer: 'jira-clone',
    audience: 'jira-clone-users'
  });

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

// Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, authConfig.jwtRefreshSecret);

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

    // Generate new token pair (token rotation)
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(refreshTokenDoc.user);

    // Revoke old refresh token
    await RefreshToken.findByIdAndUpdate(refreshTokenDoc._id, { isRevoked: true });

    // Store new refresh token
    const newRefreshTokenDoc = new RefreshToken({
      token: newRefreshToken,
      user: refreshTokenDoc.user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });

    await newRefreshTokenDoc.save();

    // Set new cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Token refreshed successfully',
      accessToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      error: 'Invalid refresh token'
    });
  }
};
