import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User';
import { JWTPayload } from '../types';

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
}, async (payload: JWTPayload, done) => {
  try {
    const user = await User.findById(payload.userId);
    if (user && user.isActive) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/api/v1/auth/google/callback',
}, async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: any) => {
  try {
    let user = await User.findOne({
      $or: [
        { providerId: profile.id, provider: 'google' },
        { email: profile.emails?.[0]?.value }
      ]
    });

    if (user) {
      // Update existing user
      if (!user.providerId) {
        user.providerId = profile.id;
        user.provider = 'google';
        await user.save();
      }
      return done(null, user);
    }

    // Create new user
    user = new User({
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      avatar: profile.photos?.[0]?.value,
      provider: 'google',
      providerId: profile.id,
      isActive: true,
    });

    await user.save();
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackURL: '/api/v1/auth/github/callback',
}, async (accessToken: string, refreshToken: string, profile: GitHubProfile, done: any) => {
  try {
    let user = await User.findOne({
      $or: [
        { providerId: profile.id, provider: 'github' },
        { email: profile.emails?.[0]?.value }
      ]
    });

    if (user) {
      // Update existing user
      if (!user.providerId) {
        user.providerId = profile.id;
        user.provider = 'github';
        await user.save();
      }
      return done(null, user);
    }

    // Create new user
    user = new User({
      email: profile.emails?.[0]?.value,
      name: profile.displayName || profile.username,
      avatar: profile.photos?.[0]?.value,
      provider: 'github',
      providerId: profile.id,
      isActive: true,
    });

    await user.save();
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;