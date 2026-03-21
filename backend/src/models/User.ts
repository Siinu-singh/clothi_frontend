import { Schema, model } from 'mongoose';
import { IUser } from '../types/index.js';

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Don't include password by default in queries
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    oauthProviders: {
      type: [{
        provider: {
          type: String,
          enum: ['google', 'apple'],
          required: true,
        },
        providerId: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          default: null,
        },
        profilePicture: {
          type: String,
          default: null,
        },
        connectedAt: {
          type: Date,
          default: Date.now,
        },
      }],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

export const User = model<IUser>('User', userSchema);
