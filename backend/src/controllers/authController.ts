import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest } from '../types';
import { AppError } from '../utils/AppError';
import { generateTokens, verifyToken } from '../utils/jwt';
import { sendSuccess, sendError, sendCreated } from '../utils/response';
import emailService from '../services/emailService';
import logger from '../config/logger';
import { sanitizeInput } from '../utils/sanitizer';
import passport from '../config/passport';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = sanitizeInput.email(req.body.email);
    const password = sanitizeInput.string(req.body.password);
    const name = sanitizeInput.string(req.body.name);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('User already exists with this email', 400));
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      role: 'user',
    });

    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookie
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user);
    } catch (emailError) {
      logger.error('Failed to send welcome email:', emailError);
    }

    sendCreated(res, 'User registered successfully', {
      user: user.toJSON(),
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = sanitizeInput.email(req.body.email);
    const password = sanitizeInput.string(req.body.password);

    // Find user with password
    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user || !user.isActive) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookie
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess(res, 'Login successful', {
      user: user.toJSON(),
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (authReq.user) {
      // Clear refresh token
      authReq.user.refreshToken = undefined;
      await authReq.user.save();
    }

    // Clear cookie
    res.clearCookie('token');

    sendSuccess(res, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = sanitizeInput.string(req.body.refreshToken);

    if (!refreshToken) {
      return next(new AppError('Refresh token is required', 401));
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!);
    
    // Find user
    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || !user.isActive || user.refreshToken !== refreshToken) {
      return next(new AppError('Invalid refresh token', 401));
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    // Save new refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Set new cookie
    res.cookie('token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess(res, 'Token refreshed successfully', {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    sendSuccess(res, 'Profile retrieved successfully', {
      user: authReq.user?.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = sanitizeInput.string(req.body.name);
    const email = sanitizeInput.email(req.body.email);
    const authReq = req as AuthRequest;
    const user = authReq.user!;

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new AppError('Email already in use', 400));
      }
      user.email = email;
    }

    if (name) user.name = name;

    await user.save();

    sendSuccess(res, 'Profile updated successfully', {
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentPassword = sanitizeInput.string(req.body.currentPassword);
    const newPassword = sanitizeInput.string(req.body.newPassword);
    const authReq = req as AuthRequest;
    const user = await User.findById(authReq.user!._id).select('+password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return next(new AppError('Current password is incorrect', 400));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendSuccess(res, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any;
    
    const { accessToken, refreshToken } = generateTokens({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${accessToken}`);
  } catch (error) {
    next(error);
  }
};

export const githubAuth = passport.authenticate('github', {
  scope: ['user:email']
});

export const githubCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any;
    
    const { accessToken, refreshToken } = generateTokens({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${accessToken}`);
  } catch (error) {
    next(error);
  }
};